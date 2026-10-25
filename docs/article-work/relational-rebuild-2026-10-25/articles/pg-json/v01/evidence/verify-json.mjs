import { PGlite } from '../node_modules/@electric-sql/pglite/dist/index.js';
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const db = new PGlite();
const output = {runtime: null, checks: [], sourceHashes: {}};
for (const file of ['src/articles/current/article.astro','src/components/relational-rebuild-pg-json/JsonFigures.astro']) output.sourceHashes[file]=crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+file,import.meta.url))).digest('hex');
const q = async (name, sql, test) => { const result=(await db.query(sql)).rows; if(test)test(result); output.checks.push({name,sql,result});return result; };
const rejects = async (name, sql, code) => {try {await db.query(sql);throw new Error('Unexpected acceptance: '+name);}catch(error){assert.equal(error.code,code);output.checks.push({name,sql,rejectedWith:error.code,message:error.message});}};
try {
  output.runtime=(await db.query('SELECT version() AS version')).rows[0].version;
  await db.exec(`CREATE TABLE products (product_id text PRIMARY KEY, name text NOT NULL, price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL CHECK(stock>=0));
  INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20,0),('P9','Teapot',35,4);
  CREATE TABLE orders(order_id integer PRIMARY KEY,status text NOT NULL);
  INSERT INTO orders VALUES(103,'pending');
  CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text REFERENCES products,quantity integer NOT NULL,unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
  INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.50);`);
  // Execute every SQL panel from the article, in reading order. Independent path
  // examples run in savepoints; index definitions may coexist for syntax checks,
  // but no planner observation or index comparison is claimed.
  const source=fs.readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
  const panels=[...source.matchAll(/<Sql\s+label="([^"]+)"\s+code=\{`([\s\S]*?)`\}\s*\/>/g)];
  assert.equal(panels.length,13);
  for(const [i,panel] of panels.entries()) {
    if(i===5) {
      await db.exec(`CREATE TABLE tag_probe(label text PRIMARY KEY,doc jsonb NOT NULL);
      INSERT INTO tag_probe VALUES
      ('p7','{"tags":["gift","ceramic"]}'),
      ('reversed','{"tags":["ceramic","gift"]}'),
      ('extra','{"tags":["gift","ceramic","sale"]}'),
      ('repeated','{"tags":["gift","ceramic","gift"]}');`);
    }
    const results=await db.exec(panel[2]);output.checks.push({name:'Article panel: '+panel[1],sql:panel[2],results:results.map(x=>x.rows)});
  }
  await q('normalised duplicate key',`SELECT '{ "capacity_ml": 300, "capacity_ml": 330 }'::jsonb AS value`,r=>assert.deepEqual(r[0].value,{capacity_ml:330}));
  const inputs=[['number','{"capacity_ml":300}'],['string','{"capacity_ml":"300"}'],['jsonnull','{"capacity_ml":null}'],['missing','{}'],['sqlnull',null],['zero','{"capacity_ml":0}'],['word','{"capacity_ml":"large"}'],['negative','{"capacity_ml":-1}'],['array','[300]'],['scalar','300'],['nullroot','null'],['boolean','{"capacity_ml":true}'],['arrayfield','{"capacity_ml":[300]}']];
  for(const [name,doc] of inputs) {
    const extracted=(await db.query(`SELECT $1::jsonb AS doc, $1::jsonb ? 'capacity_ml' AS presence,
      ($1::jsonb -> 'capacity_ml')::text AS json_output,
      jsonb_typeof($1::jsonb -> 'capacity_ml') AS json_type,
      $1::jsonb ->> 'capacity_ml' AS text_output`,[doc])).rows;
    output.checks.push({name:'extraction '+name,result:extracted});
    await db.exec('BEGIN');
    try {
      await db.query(`UPDATE teaware_documents SET details=$1::jsonb WHERE product_id='P7'`,[doc]);
      assert.equal(name,'number');output.checks.push({name:'strong contract '+name,accepted:true});
    } catch(error) {
      assert.notEqual(name,'number');assert.ok(['23514','23502'].includes(error.code));output.checks.push({name:'strong contract '+name,accepted:false,code:error.code});
    } finally {await db.exec('ROLLBACK');}
  }
  await db.exec(`CREATE TABLE weak_document(details jsonb CHECK((details->>'capacity_ml')::numeric>0));`);
  for (const name of ['missing','jsonnull','string','sqlnull']) {
    const doc=inputs.find(x=>x[0]===name)[1];await db.query('INSERT INTO weak_document VALUES($1::jsonb)',[doc]);output.checks.push({name:'weak contract accepts '+name,accepted:true});
  }
  await rejects('weak cast errors on large',`INSERT INTO weak_document VALUES('{"capacity_ml":"large"}')`,'22P02');
  await rejects('ordinary flexible document rejects scalar',`UPDATE product_documents SET details='300' WHERE product_id='P7'`,'23514');
  await rejects('document product reference',`INSERT INTO product_documents VALUES('absent','{}')`,'23503');
  await rejects('one document per product',`INSERT INTO product_documents VALUES('P7','{}')`,'23505');
  await q('four predicate questions',`SELECT label,doc ? 'gift' AS top,
    (doc->'tags') ? 'gift' AS element,
    doc @> '{"tags":["gift","ceramic"]}' AS contains_both,
    doc = '{"tags":["gift","ceramic"]}' AS equals_doc
    FROM tag_probe ORDER BY label`,r=>{assert.equal(r.filter(x=>x.equals_doc).length,1);assert.ok(r.every(x=>!x.top&&x.element&&x.contains_both));});
  await q('repeated containment operand does not demand repetition',`SELECT '{"tags":["gift"]}'::jsonb @> '{"tags":["gift","gift"]}'::jsonb AS matches`,r=>assert.equal(r[0].matches,true));
  await q('text order differs from numeric order',`SELECT '1000' COLLATE "C" < '300' AS text_less,1000::numeric < 300::numeric AS numeric_less`,r=>assert.deepEqual(r[0],{text_less:true,numeric_less:false}));
  await q('JSONPath lax adaptation versus explicit JSON type',`SELECT '{"capacity_ml":[300]}'::jsonb @? '$.capacity_ml ? (@ >= 300)' AS lax_match, jsonb_typeof('{"capacity_ml":[300]}'::jsonb->'capacity_ml') AS type`,r=>assert.equal(r[0].lax_match,true));
  await q('JSONPath operator forms',`SELECT '{"capacity_ml":1}'::jsonb @? '$.capacity_ml >= 300' AS item_exists,
    '{"capacity_ml":1}'::jsonb @@ '$.capacity_ml >= 300' AS predicate,
    '{}'::jsonb @? 'strict $.capacity_ml ? (@ >= 300)' AS suppressed_missing`,r=>assert.deepEqual(r[0],{item_exists:true,predicate:false,suppressed_missing:null}));
  await q('JSON_TABLE conversion is not a JSON-type contract',`SELECT * FROM JSON_TABLE('{"capacity_ml":"300"}'::jsonb,'$' COLUMNS(capacity_ml numeric PATH '$.capacity_ml'))`,r=>assert.equal(r[0].capacity_ml,'300'));
  await q('jsonb_set requires earlier paths',`SELECT jsonb_set('{}','{dimensions,capacity_ml}','330') AS value`,r=>assert.deepEqual(r[0].value,{}));
  await q('shallow concatenation loses nested member',`SELECT '{"dimensions":{"capacity_ml":300}}'::jsonb || '{"dimensions":{"width_mm":80}}'::jsonb AS value`,r=>assert.deepEqual(r[0].value,{dimensions:{width_mm:80}}));
  await db.exec(`UPDATE product_documents SET details='{"capacity_ml":300,"care":"hand wash"}' WHERE product_id='P7'`);
  await q('current-value edit preserves care, sequential replay only',`UPDATE product_documents SET details=jsonb_set(details,'{capacity_ml}','330') WHERE product_id='P7' RETURNING details`,r=>assert.deepEqual(r[0].details,{capacity_ml:330,care:'hand wash'}));
  await q('stale replacement discards care, sequential replay only',`UPDATE product_documents SET details='{"capacity_ml":330}' WHERE product_id='P7' RETURNING details`,r=>assert.deepEqual(r[0].details,{capacity_ml:330}));
  await q('array length declaration is not enforcement',`SELECT cardinality(ARRAY['gift','ceramic','sale']::text[2]) AS n`,r=>assert.equal(r[0].n,3));
  await q('composite fields are nullable',`SELECT (ROW(NULL,'ml')::measurement).amount AS amount`,r=>assert.equal(r[0].amount,null));
  await q('preserved shop facts',`SELECT product_id,price,stock FROM products ORDER BY product_id`,r=>assert.deepEqual(r,[{product_id:'P3',price:'4.50',stock:10},{product_id:'P7',price:'20.00',stock:0},{product_id:'P9',price:'35.00',stock:4}]));
  output.completed=true;
} finally {
  await db.close();
  output.closed=true;
  output.limits='Owned in-memory PGlite only. No server process, concurrent client sessions, native query plans, timing or physical write measurement. Fixture implements only rows/columns needed by the demonstrations, not a full shop schema.';
  fs.writeFileSync(new URL('./sql-results.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
}
