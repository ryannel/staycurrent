import { PGlite, protocol } from '@electric-sql/pglite';
import { foundationsTutorials } from '../../../../src/lib/sql-lessons/foundations.ts';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const results = [];
async function run(db, sql) {
  const parser = new protocol.Parser();
  const out = { rows: [], errors: [], plans: [], status: '', commands: [] };
  let fields = [];
  await db.execProtocolRawStream(protocol.serialize.query(sql), { onRawData: bytes => parser.parse(bytes, raw => {
    if (raw.name === 'rowDescription') fields = raw.fields.map(f => f.name);
    if (raw.name === 'dataRow') out.rows.push(Object.fromEntries(fields.map((f,i) => [f,raw.fields[i]])));
    if (raw.name === 'error') out.errors.push({code:raw.code,message:raw.message});
    if (raw.name === 'commandComplete') out.commands.push(raw.text);
    if (raw.name === 'readyForQuery') out.status = raw.status;
  }) });
  return out;
}
for (const lesson of foundationsTutorials) {
  const db = await PGlite.create();
  const item = {id:lesson.id,steps:[]};
  for (const step of lesson.steps) {
    const out = await run(db, step.sql);
    assert.equal(out.errors[0]?.code, step.expectedError, `${lesson.id}: ${step.title}`);
    item.steps.push({title:step.title,...out});
  }
  assert.equal(item.steps.at(-1).status, 'I', `${lesson.id} left transaction open`);
  const s = item.steps;
  if (lesson.id === 'history') {
    assert.deepEqual(s[1].rows.map(r=>[r.agreed_total,r.priced_today]),[['36.00','40.00']]);
    assert.deepEqual(s[3].rows.map(r=>r.agreed_total),['36.00','25.00']);
  }
  if (lesson.id === 'json-rules') {
    assert.deepEqual(s[1].rows.map(r=>r.accepted_capacity),[null,null,'350',null]);
    assert.equal(s[4].rows[0].capacity_ml,'350');
    const variants = await run(db, `WITH samples(attributes) AS (VALUES ('{"capacity_ml":350.5}'::jsonb), ('{"capacity_ml":0}'::jsonb), ('{"capacity_ml":2147483648}'::jsonb), ('{"capacity_ml":350.0}'::jsonb)) SELECT CASE WHEN jsonb_typeof(attributes -> 'capacity_ml') = 'number' THEN CASE WHEN (attributes ->> 'capacity_ml')::numeric BETWEEN 1 AND 2147483647 AND (attributes ->> 'capacity_ml')::numeric = trunc((attributes ->> 'capacity_ml')::numeric) THEN (attributes ->> 'capacity_ml')::numeric::integer END END AS accepted FROM samples;`);
    assert.deepEqual(variants.rows.map(r=>r.accepted),[null,null,null,'350']);
    item.variations = variants;
  }
  if (lesson.id === 'join-totals') {
    assert.equal(s[1].rows.length,4); assert.equal(s[2].rows[0].inflated_total,'88.00');
    assert.deepEqual(s[3].rows.map(r=>[r.total,r.delivery_count]),[['44.00','2'],['0','0']]);
    assert.deepEqual(s[4].rows.map(r=>[r.correct_total,r.distinct_amounts]),[['40.00','20.00']]);
  }
  if (lesson.id === 'pagination') {
    assert.deepEqual(s.map(x=>x.rows.map(r=>r.order_id)),[['5','4'],['4','3'],['3','2'],['3','2']]);
  }
  if (lesson.id === 'index-selectivity') {
    assert.equal(s[4].rows[0].customer_42_orders,'19');
    assert.match(JSON.stringify(s[1].rows), /Seq Scan/);
    assert.match(JSON.stringify(s[2].rows), /Bitmap Index Scan/);
    assert.match(JSON.stringify(s[3].rows), /Seq Scan/);
  }
  if (lesson.id === 'query-plans') {
    assert.deepEqual(s[0].rows.map(r=>r.total),['1000','1000','1000']);
    assert.match(JSON.stringify(s[2].rows), /actual rows=300(?:\.00)? loops=1/);
    assert.match(JSON.stringify(s[3].rows), /actual rows=10(?:\.00)? loops=1/);
  }
  if (lesson.id === 'transaction-state') {
    assert.deepEqual(s.map(x=>x.status),['I','T','T','I','I']);
    assert.deepEqual(s.slice(1).map(x=>x.rows.at(-1).price),['20','25','20','30']);
  }
  if (lesson.id === 'retry-identity') {
    assert.equal(s[4].rows.length,0); assert.equal(s[5].rows.at(-1).available,'1');
    assert.equal(s[6].rows[0].same_request,'f');
  }
  results.push(item);
  await db.close();
  console.log(`${lesson.id}: ${item.steps.length} steps passed`);
}
const dir = new URL('.', import.meta.url);
await mkdir(dir,{recursive:true});
await writeFile(new URL('execution.json', dir),JSON.stringify(results,null,2)+'\n');
