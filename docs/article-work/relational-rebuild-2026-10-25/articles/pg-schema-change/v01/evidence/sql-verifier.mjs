import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const db=new PGlite();const result={};
const article=fs.readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const snippets=[...article.matchAll(/<Sql label="([^"]+)" code=\{`([\s\S]*?)`\} \/>/g)].map(m=>({label:m[1],sql:m[2]}));
result.snippets=snippets.map(x=>x.label);result.runtime=(await db.query('SELECT version()')).rows;
try{
 await db.exec(`CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4); CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL,placed_at timestamptz NOT NULL,status text NOT NULL); INSERT INTO orders VALUES(101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending')`);
 for(const i of [0,1])await db.exec(snippets[i].sql);
 result.nan=(await db.query("SELECT 'NaN'::numeric >= 0 AS original_check, 'NaN'::numeric <> 'NaN'::numeric AS finite_guard")).rows;
 assert.equal(result.nan[0].original_check,true);assert.equal(result.nan[0].finite_guard,false);
 await db.exec("UPDATE products SET price=22,price_hundredths=2200 WHERE product_id='P7'; UPDATE products SET price_hundredths=2000 WHERE product_id='P7'");
 result.stale=(await db.query(snippets[4].sql)).rows;assert.deepEqual(result.stale,[{missing:2,different:3}]);
 result.repair=(await db.query(snippets[2].sql)).rows;assert.equal(result.repair[0].price_hundredths,2200);
 await db.exec(snippets[3].sql);result.convergence=(await db.query(snippets[4].sql)).rows;assert.deepEqual(result.convergence,[{missing:0,different:0}]);
 await db.exec(snippets[5].sql);result.validation=await db.exec(snippets[6].sql);assert(result.validation.at(-1).rows.every(x=>x.convalidated));
 result.bad_write={};for(const [label,sql] of Object.entries({missing:"UPDATE products SET price_hundredths=NULL WHERE product_id='P7'",stale:"UPDATE products SET price_hundredths=2000 WHERE product_id='P7'",negative:"UPDATE products SET price=-1,price_hundredths=-100 WHERE product_id='P7'",oversized:"UPDATE products SET price_hundredths=100000000 WHERE product_id='P7'"})){try{await db.exec(sql);throw Error('accepted '+label)}catch(e){assert(e.code);result.bad_write[label]=e.code}}
 await db.exec(snippets[7].sql);await db.exec(snippets[8].sql);result.index=(await db.query(snippets[9].sql)).rows;assert(result.index.every(x=>x.indisready&&x.indisvalid&&x.indislive));
 await db.exec(`CREATE TABLE product_tags(product_id text,tags text[]);INSERT INTO product_tags VALUES('P7',ARRAY['gift','ceramic']);CREATE INDEX product_tags_gin ON product_tags USING gin(tags);CREATE INDEX orders_time_brin ON orders USING brin(placed_at)`);
 result.gin=await db.exec(snippets[10].sql);result.brin=await db.exec(snippets[11].sql);
 // Work distinctions: a metadata default, a later default, and a physical conversion.
 await db.exec('CREATE TABLE default_probe(k integer);INSERT INTO default_probe VALUES(1),(2)');
 const before=(await db.query("SELECT pg_relation_filenode('default_probe') AS node")).rows[0].node;
 await db.exec('ALTER TABLE default_probe ADD COLUMN x integer DEFAULT 7');
 result.fast_default=(await db.query("SELECT array_agg(x ORDER BY k) AS values, (SELECT pg_relation_filenode('default_probe')) AS node FROM default_probe")).rows;assert.equal(result.fast_default[0].node,before);assert.deepEqual(result.fast_default[0].values,[7,7]);
 await db.exec('ALTER TABLE default_probe ALTER COLUMN x SET DEFAULT 9;INSERT INTO default_probe(k) VALUES(3)');result.later_default=(await db.query('SELECT x FROM default_probe ORDER BY k')).rows;assert.deepEqual(result.later_default,[{x:7},{x:7},{x:9}]);
 // Figure 2: zero missing does not prove agreement, and enforcement precedes validation.
 await db.exec("CREATE TABLE diagnostic (product_id text PRIMARY KEY,price numeric(8,2) NOT NULL,price_hundredths integer);INSERT INTO diagnostic VALUES('P3',4.5,450),('P7',22,2000),('P9',35,3500);ALTER TABLE diagnostic ADD CONSTRAINT d_nn NOT NULL price_hundredths NOT VALID, ADD CONSTRAINT d_equal CHECK(price_hundredths=price*100) NOT VALID;ALTER TABLE diagnostic VALIDATE CONSTRAINT d_nn");
 result.diagram2={notnullValid:(await db.query("SELECT convalidated FROM pg_constraint WHERE conname='d_nn'")).rows[0].convalidated};
 try{await db.exec('ALTER TABLE diagnostic VALIDATE CONSTRAINT d_equal');throw Error('bad validation accepted')}catch(e){assert.equal(e.code,'23514');result.diagram2.agreementFailure=e.code}
 try{await db.exec("UPDATE diagnostic SET price=price WHERE product_id='P7'");throw Error('bad write accepted')}catch(e){assert.equal(e.code,'23514');result.diagram2.unrelatedUpdateFailure=e.code}
 await db.exec("UPDATE diagnostic SET price_hundredths=(price*100)::integer WHERE product_id='P7';ALTER TABLE diagnostic VALIDATE CONSTRAINT d_equal");result.diagram2.afterRepair=(await db.query("SELECT conname,convalidated FROM pg_constraint WHERE conrelid='diagnostic'::regclass")).rows;
 result.success=true;
}finally{await db.close();fs.writeFileSync(new URL('sql-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n')}
