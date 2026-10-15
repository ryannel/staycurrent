import { PGlite, protocol } from '@electric-sql/pglite';
import { capacityTutorials } from '../../../src/lib/sql-lessons/capacity.ts';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

async function run(db, sql, expectedError) {
  const parser = new protocol.Parser();
  const out = {rows:[],commands:[],errors:[],status:''}; let fields=[];
  await db.execProtocolRawStream(protocol.serialize.query(sql),{onRawData:b=>parser.parse(b,r=>{
    if(r.name==='rowDescription') fields=r.fields.map(f=>f.name);
    if(r.name==='dataRow') out.rows.push(Object.fromEntries(fields.map((f,i)=>[f,r.fields[i]])));
    if(r.name==='commandComplete') out.commands.push(r.text);
    if(r.name==='error') out.errors.push({code:r.code,message:r.message});
    if(r.name==='readyForQuery') out.status=r.status;
  })});
  assert.equal(out.errors[0]?.code,expectedError); assert.equal(out.status,'I'); return out;
}
const observed={date:'2026-10-15',runtime:'PGlite 0.5.8, raw simple-query protocol; no real replicas or shards',lessons:[]};
for(const lesson of capacityTutorials){
  const db=await PGlite.create(); const record={id:lesson.id,steps:[],variations:[]};
  for(const step of lesson.steps) record.steps.push({title:step.title,...await run(db,step.sql,step.expectedError)});
  const s=record.steps;
  if(lesson.id==='replica-freshness'){
    assert.deepEqual(s[0].rows.map(r=>r.price),['20','20']);
    assert.deepEqual(s[1].rows.map(r=>r.price),['25','20']);
    assert.deepEqual(s[2].rows,[{price:'20',durable_copy_ready:'t',read_ready:'f'}]);
    assert.deepEqual(s[3].rows,[{node:'A'}]);
    assert.deepEqual(s[4].rows.map(r=>[r.price,r.read_ready]),[['25','t'],['25','t']]);
  }
  if(lesson.id==='partition-pruning'){
    assert.deepEqual(s[0].rows.map(r=>r.stored_in),['cap_orders_oct','cap_orders_oct','cap_orders_nov']);
    const oct=JSON.stringify(s[1].rows),tenant=JSON.stringify(s[2].rows);
    assert.match(oct,/cap_orders_oct/); assert.doesNotMatch(oct,/cap_orders_nov/);
    assert.match(tenant,/cap_orders_oct/); assert.match(tenant,/cap_orders_nov/);
    assert.deepEqual(s[4].rows,[{stored_in:'cap_orders_dec',order_id:'4'}]);
    assert.equal(s[5].rows.length,2);
    record.variations.push(await run(db,"INSERT INTO cap_partition_orders (placed_on,order_id,tenant_id,total) VALUES ('2026-10-15',1,7,25);",'23505'));
  }
  if(lesson.id==='shard-cutover'){
    assert.deepEqual(s[2].rows.map(r=>[r.order_id,r.amount]),[['1','30'],['3','12']]);
    assert.deepEqual(s[3].rows,s[2].rows);
    assert.equal(s[4].rows[0].differing_rows,'0');
    assert.equal(s[4].rows[1].writer,'B'); assert.equal(s[4].rows[1].generation,'2');
    assert.deepEqual(s[5].rows,[{amount:'30'}]); assert(s[5].commands.includes('UPDATE 0'));
    assert.deepEqual(s[6].rows.slice(1),[{copy:'A',amount:'30'},{copy:'B',amount:'35'}]);
    await run(db,lesson.steps[0].sql); await run(db,lesson.steps[1].sql); await run(db,lesson.steps[2].sql);
    await run(db,"UPDATE cap_move_owner SET accepting_writes=false WHERE tenant_id=7;");
    const bad=await run(db,lesson.steps[4].sql);
    assert.deepEqual(bad.rows,[{differing_rows:'4'}]); assert(bad.commands.includes('UPDATE 0'));
    record.variations.push({variation:'cutover refuses missing replay',...bad});
    // Repair and replay the same bounded changes twice before switching.
    await run(db,lesson.steps[3].sql); await run(db,lesson.steps[3].sql);
    const repaired=await run(db,lesson.steps[4].sql); assert.equal(repaired.rows[0].differing_rows,'0');
    record.variations.push({variation:'bounded replay is repeatable',...repaired});
  }
  await run(db,lesson.steps[0].sql); record.variations.push({reset:'passed'});
  observed.lessons.push(record); await db.close(); console.log(`${lesson.id}: ${lesson.steps.length} literal steps and variations passed`);
}
await writeFile(new URL('./observed.json',import.meta.url),JSON.stringify(observed,null,2)+'\n');
