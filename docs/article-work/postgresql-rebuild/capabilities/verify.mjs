import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { Client } = require('/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js');
const source = readFileSync(new URL('../../../../src/lib/sql-lessons/postgresql-capabilities.ts', import.meta.url),'utf8');
const mod = await import(`data:text/javascript;base64,${Buffer.from(source.replace(/^import type.*\n/m,'').replace(': Tutorial[]','')).toString('base64')}`);
const db = new Client({host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'pg_capability_lab'});
await db.connect();
const observed = {version:(await db.query('SELECT version()')).rows[0].version,lessons:[]};
for (const tutorial of mod.postgresqlCapabilityTutorials) {
 const entry = {id:tutorial.id,steps:[]};
 for (const step of tutorial.steps) {
  try {
   const res = await db.query(step.sql);
   if (step.expectedError) throw new Error(`Expected ${step.expectedError}`);
   entry.steps.push({title:step.title,results:(Array.isArray(res)?res:[res]).map(x=>({command:x.command,rowCount:x.rowCount,rows:x.rows}))});
  } catch(error) {
   if (!step.expectedError || error.code!==step.expectedError) throw error;
   entry.steps.push({title:step.title,error:{code:error.code,message:error.message}});
  }
 }
 observed.lessons.push(entry);
}
assert.deepEqual((await db.query(mod.jsonCapabilitySql.containment)).rows.map(x=>x.product_id),[1,4]);
assert.deepEqual((await db.query(mod.jsonCapabilitySql.correlated)).rows,[{product_id:1,separate_tests:true,same_offer:true},{product_id:2,separate_tests:true,same_offer:false}]);
assert.deepEqual((await db.query(mod.jsonCapabilitySql.rows)).rows,[{product_id:1,seller:'A',price:'12'}]);
assert.equal((await db.query(mod.jsonCapabilitySql.containment.replace('blue','red'))).rows[0].product_id,2);
assert.equal((await db.query(mod.jsonCapabilitySql.targetedIndex.slice(mod.jsonCapabilitySql.targetedIndex.indexOf('SELECT count')).replaceAll("'blue'","'red'"))).rows[0].blue_products,'9500');
observed.extra=[];
async function extra(name,sql,expectedCode){
 try{
  const res=await db.query(sql);
  assert.equal(expectedCode,undefined);
  observed.extra.push({name,results:(Array.isArray(res)?res:[res]).map(x=>({command:x.command,rowCount:x.rowCount,rows:x.rows}))});
  return res;
 }catch(error){
  if(!expectedCode||error.code!==expectedCode)throw error;
  observed.extra.push({name,error:{code:error.code,message:error.message}});
 }
}
const constraint="ALTER TABLE pg_cap_products ADD CONSTRAINT numeric_capacity CHECK(NOT(attributes ? 'capacity_ml') OR jsonb_typeof(attributes->'capacity_ml')='number');";
await extra('invariant rejects existing string',constraint,'23514');
await extra('repair confirmed measurement then enforce',"UPDATE pg_cap_products SET attributes=jsonb_set(attributes,'{capacity_ml}','350') WHERE product_id=4 RETURNING attributes->'capacity_ml' AS repaired_capacity;"+constraint);
await extra('missing key accepted',"UPDATE pg_cap_products SET attributes='{}' WHERE product_id=4 RETURNING attributes;");
await extra('JSON null rejected',"UPDATE pg_cap_products SET attributes='{\"capacity_ml\":null}' WHERE product_id=4;",'23514');
await extra('SQL NULL rejected',"UPDATE pg_cap_products SET attributes=NULL WHERE product_id=4;",'23502');
await extra('current JSON patch',"UPDATE pg_cap_products SET attributes=jsonb_set(attributes,'{material}','\"stoneware\"') WHERE product_id=1 RETURNING attributes;");
const trgm=await extra('optional trigram similarity',"CREATE EXTENSION IF NOT EXISTS pg_trgm; SELECT similarity('runnng','running') AS spelling_similarity,similarity('runnng','roads') AS unrelated_similarity;");
assert.ok(trgm[1].rows[0].spelling_similarity>trgm[1].rows[0].unrelated_similarity);
await extra('extension version states',"SELECT name,default_version,installed_version FROM pg_available_extensions WHERE name IN('btree_gist','vector','postgis'); SELECT extname,extversion FROM pg_extension WHERE extname IN('btree_gist','vector','postgis');");
await extra('embedding revision guard setup',"CREATE TEMP TABLE pg_cap_embedding_document(document_id int PRIMARY KEY,source_revision int,embedding vector(3),embedding_revision int,embedding_model text); INSERT INTO pg_cap_embedding_document(document_id,source_revision)VALUES(1,6);");
const stale=await extra('reject stale embedding',"UPDATE pg_cap_embedding_document SET embedding='[1,0,0]',embedding_revision=5,embedding_model='example-v1' WHERE document_id=1 AND source_revision=5 RETURNING document_id;");
assert.equal(stale.rowCount,0);
const current=await extra('accept current embedding',"UPDATE pg_cap_embedding_document SET embedding='[1,0,0]',embedding_revision=6,embedding_model='example-v1' WHERE document_id=1 AND source_revision=6 RETURNING document_id;");
assert.equal(current.rowCount,1);
writeFileSync(new URL('./server-observed.json',import.meta.url),JSON.stringify(observed,null,2)+'\n');
await db.end();
console.log(`Verified ${observed.lessons.length} capability lessons on ${observed.version}`);
