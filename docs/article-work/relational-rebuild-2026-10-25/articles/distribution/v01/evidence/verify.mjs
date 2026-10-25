import { PGlite } from '@electric-sql/pglite';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const db = new PGlite();
const evidence = {runtime:{package:'@electric-sql/pglite',packageVersion:'0.5.8',node:process.version},checks:{},limits:'An isolated WASM SQL instance; no distributed engine or consensus execution.'};
try {
 evidence.runtime.version=(await db.query('SELECT version() AS version')).rows[0].version;
 await db.exec(`CREATE TABLE products(product_id text PRIMARY KEY, price numeric(8,2), stock integer);
 INSERT INTO products VALUES ('P3',4.50,10),('P7',20.00,0),('P9',35.00,4);
 CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer,status text);
 INSERT INTO orders VALUES (101,1,'paid'),(102,2,'paid'),(103,1,'pending');
 CREATE TABLE order_items(order_id integer,line_no integer,quantity integer,unit_price numeric(8,2));
 INSERT INTO order_items VALUES(101,1,1,4.50),(101,2,1,35.00),(102,1,2,20.00),(103,1,1,20.00),(103,2,2,4.50);`);
 const article=readFileSync('src/articles/current/article.astro','utf8');
 const displayed=article.match(/code=\{`(UPDATE products[\s\S]*?)`\}/)[1];
 evidence.checks.displayedUpdate=await db.query(displayed);
 evidence.checks.productState=(await db.query('SELECT * FROM products ORDER BY product_id')).rows;
 assert.equal(evidence.checks.productState[1].price,'22.00');
 assert.equal(evidence.checks.productState[1].stock,0);
 evidence.checks.pendingLines=(await db.query('SELECT SUM(quantity*unit_price) AS total FROM order_items WHERE order_id=103')).rows;
 assert.equal(evidence.checks.pendingLines[0].total,'29.00');
 const report=`SELECT o.customer_id, SUM(i.quantity*i.unit_price) AS line_value FROM orders o JOIN order_items i USING(order_id) WHERE o.status='paid' GROUP BY o.customer_id ORDER BY line_value DESC,o.customer_id`;
 evidence.checks.paidReport=(await db.query(report)).rows;
 assert.deepEqual(evidence.checks.paidReport,[{customer_id:2,line_value:'40.00'},{customer_id:1,line_value:'39.50'}]);
 evidence.checks.generatedSkew=(await db.query(`SELECT COUNT(*)::int AS generated_orders, COUNT(*) FILTER(WHERE n%10<7)::int AS customer_1001 FROM generate_series(0,119999) AS g(n)`)).rows;
 assert.deepEqual(evidence.checks.generatedSkew,[{generated_orders:120000,customer_1001:84000}]);
 await db.exec('CREATE TABLE pair_demo(customer_id integer,order_id integer, PRIMARY KEY(customer_id,order_id)); INSERT INTO pair_demo VALUES(1,103),(2,103)');
 evidence.checks.pairCounterexample=(await db.query('SELECT * FROM pair_demo ORDER BY customer_id')).rows;
 let refused=false;try{await db.query('INSERT INTO pair_demo VALUES(1,103)')}catch(e){refused=true;evidence.checks.exactPairRefused=e.code;}
 assert.ok(refused);assert.equal(evidence.checks.exactPairRefused,'23505');
 for(const path of ['src/articles/current/article.astro','src/articles/current/article.meta.json','src/components/relational-rebuild-distribution/Figures.astro','src/components/relational-rebuild-distribution/model.mjs','evidence/verify.mjs']) {
  (evidence.sourceHashes??={})[path]=createHash('sha256').update(readFileSync(path)).digest('hex');
 }
 evidence.status='passed';
} finally { await db.close(); writeFileSync('evidence/sql-results.json',JSON.stringify(evidence,null,2)+'\n'); }
console.log(JSON.stringify(evidence,null,2));
