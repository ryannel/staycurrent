import {PGlite,protocol} from '@electric-sql/pglite';
import {btree_gist} from '@electric-sql/pglite/contrib/btree_gist';
import {postgresqlCapabilityTutorials,jsonCapabilitySql as j,textCapabilitySql as t,rangeCapabilitySql as r} from '../../../../src/lib/sql-lessons/postgresql-capabilities.ts';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
async function run(db,sql){
 const parser=new protocol.Parser(); let fields=[];const out={rows:[],errors:[],status:'',commands:[]};
 await db.execProtocolRawStream(protocol.serialize.query(sql),{onRawData:bytes=>parser.parse(bytes,m=>{
  if(m.name==='rowDescription')fields=m.fields.map(f=>f.name);
  if(m.name==='dataRow')out.rows.push(Object.fromEntries(fields.map((f,i)=>[f,m.fields[i]])));
  if(m.name==='error')out.errors.push({code:m.code,message:m.message});
  if(m.name==='readyForQuery')out.status=m.status;
  if(m.name==='commandComplete')out.commands.push(m.text);
 })});return out;
}
const evidence={checked:'2026-10-15',runtime:'PGlite0.5.8, raw protocol, btree_gist explicitly registered',lessons:[]};
for(const lesson of postgresqlCapabilityTutorials){
 const db=await PGlite.create({extensions:{btree_gist}});
 evidence.version??=(await run(db,'SELECT version()')).rows[0].version;
 const item={id:lesson.id,steps:[],variations:[]};
 for(const step of lesson.steps){
  const result=await run(db,step.sql);
  assert.equal(result.errors[0]?.code,step.expectedError,`${lesson.id}: ${step.title}: ${JSON.stringify(result.errors)}`);
  assert.equal(result.status,'I');item.steps.push({title:step.title,...result});
 }
 async function variation(name,sql){const result=await run(db,sql);item.variations.push({name,...result});return result;}
 if(lesson.id==='pg-json-queries'){
  assert.deepEqual(item.steps[1].rows.map(x=>x.product_id),['1','4']);
  assert.deepEqual(item.steps[2].rows.map(x=>[x.separate_tests,x.same_offer]),[['t','t'],['t','f']]);
  assert.deepEqual(item.steps[3].rows,[{product_id:'1',seller:'A',price:'12'}]);
  assert.ok(item.steps[4].rows.some(x=>x['QUERY PLAN']?.includes('Seq Scan')));
  assert.ok(item.steps[5].rows.some(x=>x['QUERY PLAN']?.includes('pg_cap_json_tags')));
  assert.ok(item.steps[7].rows.some(x=>x['QUERY PLAN']?.includes('pg_cap_json_capacity')));
  assert.deepEqual((await variation('red containment',j.containment.replace('blue','red'))).rows.map(x=>x.product_id),['2']);
  assert.ok((await variation('offer limit20',j.correlated.replaceAll('< 15','< 20'))).rows.every(x=>x.same_offer==='t'));
  assert.equal((await variation('all offer rows',j.rows.replace("WHERE offer.seller = 'A' AND offer.price < 15",''))).rows.length,4);
  const red=await variation('red tag plan',j.targetedIndex.slice(j.targetedIndex.indexOf('EXPLAIN')).replaceAll("'blue'","'red'"));
  assert.equal(red.rows.at(-1).blue_products,'9500');
  assert.equal((await variation('numeric repair',`UPDATE pg_cap_products SET attributes=jsonb_set(attributes,'{capacity_ml}','350') WHERE product_id=4; ${j.numeric}`)).rows.at(-1).capacity,'350');
  const broad=await variation('broad numeric range',j.rangeIndex.slice(j.rangeIndex.indexOf('EXPLAIN')).replace('>= 590','>= 100'));
  assert.equal(broad.errors.length,0);
  await run(db,j.setup);
  const constraint=`ALTER TABLE pg_cap_products ADD CONSTRAINT numeric_capacity CHECK(NOT(attributes ? 'capacity_ml') OR jsonb_typeof(attributes->'capacity_ml')='number');`;
  assert.equal((await variation('reject existing string',constraint)).errors[0].code,'23514');
  assert.equal((await variation('repair then enforce',`UPDATE pg_cap_products SET attributes=jsonb_set(attributes,'{capacity_ml}','350') WHERE product_id=4; ${constraint}`)).errors.length,0);
  assert.equal((await variation('missing capacity allowed',`UPDATE pg_cap_products SET attributes='{}' WHERE product_id=4 RETURNING attributes;`)).errors.length,0);
  assert.equal((await variation('JSON null rejected',`UPDATE pg_cap_products SET attributes='{"capacity_ml":null}' WHERE product_id=4;`)).errors[0].code,'23514');
  assert.equal((await variation('SQL NULL rejected',`UPDATE pg_cap_products SET attributes=NULL WHERE product_id=4;`)).errors[0].code,'23502');
  const patch=await variation('patch current document',`UPDATE pg_cap_products SET attributes=jsonb_set(attributes,'{material}','"stoneware"') WHERE product_id=1 RETURNING attributes;`);
  assert.equal(JSON.parse(patch.rows[0].attributes).tags[1],'sale');
 }
 if(lesson.id==='pg-text-search'){
  assert.equal(item.steps[1].rows[0].words,"'road':3 'run':1");
  assert.ok(item.steps[2].rows.every(x=>x.both_words==='t'&&x.adjacent==='f'&&x.phrase_with_stopword==='t'));
  assert.deepEqual(item.steps[3].rows.map(x=>x.document_id),['1','2','5']);
  assert.deepEqual(item.steps[4].rows.map(x=>x.document_id),['1']);
  assert.deepEqual((await variation('after title edit',t.eligible)).rows.map(x=>x.document_id),['1','2']);
  assert.equal(item.steps[6].rows.at(-1).matches,'50');
  assert.equal(item.steps[7].rows.length,1); // query representation, no result documents
  assert.equal((await variation('correct spelling',t.typo.replaceAll('runnng','running'))).rows.length,3);
  await run(db,t.setup);
  assert.deepEqual((await variation('phrase stays inside field',`SELECT document_id FROM pg_cap_documents WHERE tenant_id=7 AND published AND (to_tsvector('english',title) @@ phraseto_tsquery('english','running shoes') OR to_tsvector('english',body) @@ phraseto_tsquery('english','running shoes')) ORDER BY document_id;`)).rows.map(x=>x.document_id),['1']);
 }
 if(lesson.id==='pg-vector-filter'){
  assert.deepEqual(item.steps[1].rows.map(x=>x.id),['1','3']);
  assert.deepEqual(item.steps[2].rows.map(x=>x.id),['1']);
  assert.deepEqual(item.steps[3].rows.map(x=>x.id),['1','3']);
  await variation('change ownership','UPDATE pg_cap_points SET tenant=8 WHERE id=3;');
  assert.deepEqual((await variation('exact after ownership change',lesson.steps[1].sql)).rows.map(x=>x.id),['1','4']);
  assert.deepEqual((await variation('three candidates after ownership change',lesson.steps[3].sql)).rows.map(x=>x.id),['1']);
 }
 if(lesson.id==='pg-range-rules'){
  assert.equal(item.steps[1].rows[0].booking_id,'2');
  assert.equal(item.steps[3].rows[0].room,'Birch');
  assert.equal(item.steps[8].rows[0].assignment_id,'1');
  await run(db,r.setup);
  assert.equal((await variation('short assignment',r.covered.replace('2026-10-20','2026-10-16'))).errors.length,0);
  assert.equal((await variation('remove unneeded second authorisation',r.deletion)).errors.length,0);
  assert.equal((await variation('empty booking rejected',`INSERT INTO pg_cap_booking(booking_id,room,during) VALUES(9,'Cedar','empty');`)).errors[0].code,'23514');
  assert.equal((await variation('unbounded booking rejected',`INSERT INTO pg_cap_booking(booking_id,room,during) VALUES(9,'Cedar','(,)');`)).errors[0].code,'23514');
  assert.equal((await variation('explicit infinite bounds rejected',`INSERT INTO pg_cap_booking(booking_id,room,during) VALUES(9,'Cedar','[-infinity,infinity)');`)).errors[0].code,'23514');
 }
 const reset=await run(db,lesson.steps[0].sql);assert.equal(reset.errors.length,0);item.resetPassed=true;
 evidence.lessons.push(item);await db.close();
}
writeFileSync(new URL('./browser-observed.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
console.log(`Verified ${evidence.lessons.length} browser lessons, expected failures, variations and resets`);
