import { PGlite, protocol } from '@electric-sql/pglite';
import { postgresqlTutorials } from '../../../src/lib/sql-lessons/postgresql.ts';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
async function run(db,sql){
 const parser=new protocol.Parser();let fields=[];const out={rows:[],errors:[],status:'',commands:[]};
 await db.execProtocolRawStream(protocol.serialize.query(sql),{onRawData:bytes=>parser.parse(bytes,m=>{
  if(m.name==='rowDescription')fields=m.fields.map(f=>f.name);
  if(m.name==='dataRow')out.rows.push(Object.fromEntries(fields.map((f,i)=>[f,m.fields[i]])));
  if(m.name==='error')out.errors.push({code:m.code,message:m.message});
  if(m.name==='readyForQuery')out.status=m.status;
  if(m.name==='commandComplete')out.commands.push(m.text);
 })});return out;
}
const evidence={checked:'2026-10-15',runtime:'PGlite 0.5.8 through raw PostgreSQL protocol; not physical storage or multi-session verification',lessons:[]};
for(const lesson of postgresqlTutorials){
 const db=await PGlite.create();evidence.version??=(await run(db,'SELECT version()')).rows[0].version;
 const item={id:lesson.id,steps:[],variations:[]};
 for(const [i,step] of lesson.steps.entries()){
  const result=await run(db,step.sql);assert.equal(result.errors[0]?.code,step.expectedError,JSON.stringify({id:lesson.id,i,result}));
  assert.equal(result.status,lesson.id==='pg-wal-records'&&i===1?'T':'I');
  item.steps.push({title:step.title,...result});
 }
 const s=item.steps;
 if(lesson.id==='pg-read-write'){
  assert.match(JSON.stringify(s[1].rows),/Index Scan/);assert.equal(s[2].rows[0].available,'1');
  assert.notEqual(s[0].rows[0].location,s[2].rows[0].location);assert.equal(s[3].rows.length,1);
  const variant=await run(db,'UPDATE pg_path_products SET available=available-1 WHERE product_id=7 AND available>=1 RETURNING available;');
  assert.equal(variant.rows[0].available,'0');item.variations.push(variant);
 }
 if(lesson.id==='pg-access-methods'){
  assert.equal(s[0].rows[0].priority,'20');
  assert.deepEqual(s[1].rows.filter(r=>r.event_id).map(r=>r.event_id),['20000','19999','19998','19997','19996']);
  assert(!JSON.stringify(s[1].rows).includes('Sort'));assert.match(JSON.stringify(s[2].rows),/pg_method_attributes/);
  assert.equal(s[2].rows.at(-1).matches,'20');assert.match(JSON.stringify(s[3].rows),/Seq Scan/);
  assert.match(JSON.stringify(s[4].rows),/pg_method_time_ranges/);assert.equal(s[4].rows.at(-1).matches,'60');
  assert.deepEqual(s[5].rows.at(-1),{min:'600',max:'659',count:'60'});
  const variant=await run(db,"SELECT count(*) AS matches FROM pg_method_events WHERE occurred_at>=timestamp '2026-01-01' AND occurred_at<timestamp '2026-01-02'");
  assert.equal(variant.rows[0].matches,'20000');item.variations.push(variant);
 }
 if(lesson.id==='pg-visibility'){
  assert.match(JSON.stringify(s[2].rows),/Index Only Scan/);assert.match(JSON.stringify(s[2].rows),/Heap Fetches: 0/);
  assert.notEqual(s[0].rows[0].location,s[3].rows[0].location);assert.notEqual(s[0].rows[0].created_by,s[3].rows[0].created_by);
  assert.match(JSON.stringify(s[4].rows),/Heap Fetches: [1-9]/);assert.match(JSON.stringify(s[6].rows),/Heap Fetches: 0/);
  assert.deepEqual(s[6].rows.filter(r=>r.product_id).map(r=>r.available),['1','3','3','3','3']);
  await run(db,'UPDATE pg_visibility_products SET available=2 WHERE product_id=2');
  await run(db,'VACUUM (ANALYZE) pg_visibility_products');
  const variant=await run(db,lesson.steps[6].sql);assert.deepEqual(variant.rows.filter(r=>r.product_id).map(r=>r.available),['1','2','3','3','3']);item.variations.push(variant);
 }
 if(lesson.id==='pg-wal-records'){
  assert.match(JSON.stringify(s[1].rows),/WAL: records=[1-9]/);assert.equal(s[1].rows.at(-1).available,'1');
  assert.equal(s[2].rows[0].available,'3');assert.equal(s[2].rows[1].wal_advanced,'t');assert.equal(s[3].rows[0].available,'1');
  await run(db,lesson.steps[0].sql);
  const variant=await run(db,lesson.steps[1].sql.replace('available=1','available=2'));assert.equal(variant.rows.at(-1).available,'2');
  assert.equal((await run(db,lesson.steps[2].sql)).rows[0].available,'3');item.variations.push(variant);
 }
 assert.equal((await run(db,lesson.steps[0].sql)).errors.length,0);item.reset='passed';
 evidence.lessons.push(item);await db.close();console.log(`${lesson.id}: ${lesson.steps.length} steps passed`);
}
writeFileSync(new URL('./observed.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
