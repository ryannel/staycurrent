import { PGlite, protocol } from '@electric-sql/pglite';
import { operationsTutorials } from '../../../src/lib/sql-lessons/operations.ts';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

async function run(db,sql) {
 const parser=new protocol.Parser(); let fields=[];
 const out={rows:[],errors:[],commands:[],status:''};
 await db.execProtocolRawStream(protocol.serialize.query(sql),{onRawData:bytes=>parser.parse(bytes,m=>{
  if(m.name==='rowDescription') fields=m.fields.map(f=>f.name);
  if(m.name==='dataRow') out.rows.push(Object.fromEntries(fields.map((f,i)=>[f,m.fields[i]])));
  if(m.name==='error') out.errors.push({code:m.code,message:m.message});
  if(m.name==='commandComplete') out.commands.push(m.text);
  if(m.name==='readyForQuery') out.status=m.status;
 })});
 return out;
}
const evidence={checked:'2026-10-15',runtime:'PGlite 0.5.8 through raw PostgreSQL simple-query protocol',lessons:[]};
for(const lesson of operationsTutorials){
 const db=await PGlite.create();
 evidence.version??=(await run(db,'SELECT version()')).rows[0].version;
 const record={id:lesson.id,steps:[],variations:[]};
 for(const step of lesson.steps){
  const result=await run(db,step.sql);
  assert.equal(result.errors[0]?.code,step.expectedError,`${lesson.id}: ${step.title}: ${JSON.stringify(result.errors)}`);
  assert.equal(result.status,'I',`${lesson.id}: transaction unexpectedly retained`);
  record.steps.push({title:step.title,...result});
 }
 const s=record.steps;
 if(lesson.id==='schema-evolution'){
  assert(s[1].rows.every(r=>r.delivery_instructions===null));
  assert.deepEqual(s[2].rows.map(r=>r.order_id).sort(),['1','2']);
  assert.equal(s[3].rows[0].delivery_instructions,'Reception');
  assert.equal(s[4].rows[0].missing,'0');
  assert.equal(s[5].rows[0].delivery_note,null);
  assert.deepEqual(s[6].rows.map(r=>r.delivery_instructions),['Reception','Ring bell','Side door','Loading bay']);
  await run(db,lesson.steps[0].sql); await run(db,lesson.steps[1].sql);
  const variation=await run(db,lesson.steps[2].sql.replace('LIMIT 2','LIMIT 1'));
  assert.equal(variation.rows.length,1); record.variations.push(variation);
  const oldInsert=await run(db,"INSERT INTO migration_orders (order_id, delivery_note) VALUES (4,'Old writer'); SELECT delivery_instructions FROM migration_orders WHERE order_id=4;");
  assert.equal(oldInsert.rows[0].delivery_instructions,'Old writer'); record.variations.push(oldInsert);
 }
 if(lesson.id==='recovery-reconciliation'){
  assert.equal(s[1].rows.length,1); assert.equal(s[2].rows[0].request_key,'req-b');
  assert.equal(s[3].rows[0].total,'33.00'); assert.equal(s[4].rows[0].orders,'2');
  const mismatches=await run(db,lesson.steps[2].sql);
  assert.equal(mismatches.rows[0].recovered_amount,'9.00'); record.variations.push(mismatches);
  await run(db,"UPDATE recovery_orders SET amount=8 WHERE request_key='req-b'");
  assert.equal((await run(db,lesson.steps[2].sql)).rows.length,0);
 }
 if(lesson.id==='least-privilege'){
  assert.deepEqual(s[1].rows,[{current_user:'ops_shipping'},{order_id:'1',status:'ready'}]);
  assert.deepEqual(s[3].rows,[{order_id:'1',status:'packed'}]);
  assert.deepEqual(s[5].rows.map(r=>r.status),['packed','ready']);
  const variation=await run(db,'ALTER POLICY shipping_tenant ON ops_access.orders USING (tenant_id = 2) WITH CHECK (tenant_id = 2); SET ROLE ops_shipping; SELECT order_id, status FROM ops_access.orders;');
  assert.deepEqual(variation.rows,[{order_id:'2',status:'ready'}]); record.variations.push(variation);
  assert.equal((await run(db,'SELECT email FROM ops_access.orders')).errors[0].code,'42501');
  await run(db,'RESET ROLE');
 }
 if(lesson.id==='deletion-and-copies'){
  assert.deepEqual(s[2].rows,[{live:'1',notes:'1',saved:'2'}]);
  assert.equal(s[3].rows.length,2); assert.deepEqual(s[4].rows,[{customer_id:'2',name:'Lin'}]);
  await run(db,lesson.steps[3].sql);
  const replay=await run(db,lesson.steps[4].sql); assert.deepEqual(replay.rows,[{customer_id:'2',name:'Lin'}]);record.variations.push(replay);
  assert.deepEqual((await run(db,lesson.steps[4].sql)).rows,[{customer_id:'2',name:'Lin'}]);
 }
 assert.equal((await run(db,lesson.steps[0].sql)).errors.length,0);
 record.reset='passed'; evidence.lessons.push(record); await db.close();
 console.log(`${lesson.id}: ${lesson.steps.length} steps and variations passed`);
}
const extras=await PGlite.create();
const drill=readFileSync(new URL('./restore-drill.sh',import.meta.url),'utf8');
const blocks=[...drill.matchAll(/<<'SQL'\n([\s\S]*?)\nSQL/g)].map(m=>m[1]);
assert.equal(blocks.length,3);
assert.equal((await run(extras,blocks[0])).errors.length,0);
const fixtureValidation=await run(extras,blocks[2]);
assert.equal(fixtureValidation.errors.length,0);
assert.deepEqual(fixtureValidation.rows,[{request_key:'req-b',expected_amount:'8.00',recovered_amount:null}]);
const defaults=await run(extras,`CREATE ROLE order_owner NOLOGIN; CREATE ROLE order_reporting NOLOGIN; CREATE SCHEMA orders AUTHORIZATION order_owner; SET ROLE order_owner; ALTER DEFAULT PRIVILEGES FOR ROLE order_owner IN SCHEMA orders GRANT SELECT ON TABLES TO order_reporting; CREATE TABLE orders.example (id integer); RESET ROLE; SELECT has_table_privilege('order_reporting','orders.example','SELECT') AS allowed;`);
assert.equal(defaults.errors.length,0);assert.equal(defaults.rows[0].allowed,'t');
evidence.additionalSQL={fixtureValidation,defaults,note:'Executed embedded restore-validation SQL against the expected fixture. No pg_dump or pg_restore execution is implied.'};
await extras.close();
writeFileSync(new URL('./observed.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
