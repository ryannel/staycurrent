import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {PGlite}=require('@electric-sql/pglite');
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('src/articles/current/article.astro',root),'utf8');
const front=source.split('---')[1].replace(/^import .*;$/gm,'');
const examples=Function(`${front}\nreturn {history,sort,batch,joined,boundedJoin,purchase,ownership};`)();
const ddl=`CREATE TABLE customers(customer_id integer PRIMARY KEY,name text NOT NULL);
CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0));
CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,placed_at timestamptz NOT NULL,status text NOT NULL CHECK(status IN('pending','paid','cancelled')));
CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text NOT NULL REFERENCES products,quantity integer NOT NULL CHECK(quantity>0),unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer NOT NULL REFERENCES orders,amount numeric(8,2) NOT NULL CHECK(amount>0),method text NOT NULL);
INSERT INTO customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES(101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES(101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
INSERT INTO payments VALUES(501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');`;
const before=`DELETE FROM order_items WHERE order_id=103; DELETE FROM orders WHERE order_id=103; UPDATE products SET stock=CASE product_id WHEN 'P3' THEN 12 WHEN 'P7' THEN 1 ELSE 4 END;`;
class PurchaseRejected extends Error {constructor(productId){super(productId);this.productId=productId;}}
const writeOrder103=Function('PurchaseRejected',`${examples.purchase}\nreturn writeOrder103;`)(PurchaseRejected);
const results={};
const pglet=new PGlite();
try {
 await pglet.exec(`SET TIME ZONE 'UTC';${ddl}`);
 const q=(text,params)=>pglet.query(text,params);
 const history=await q('SELECT order_id,placed_at,status FROM orders WHERE customer_id=$1 ORDER BY placed_at DESC,order_id DESC LIMIT $2',[1,20]);
 assert.deepEqual(history.rows.map(r=>r.order_id),[103,101]);results.history=history.rows;
 const batch=await q(examples.batch,[[103,101]]);assert.equal(batch.rows.length,4);results.batch=batch.rows;
 const bad=await q(examples.joined,[1]);assert.deepEqual(bad.rows.map(r=>[r.order_id,r.line_no]),[[103,1],[103,2]]);results.joinedLimit=bad.rows;
 const good=await q(examples.boundedJoin,[1,2]);assert.deepEqual(good.rows.map(r=>[r.order_id,r.line_no]),[[103,1],[103,2],[101,1],[101,2]]);results.boundedJoin=good.rows;
 const plain=await q('SELECT o.order_id,i.line_no FROM orders o LEFT JOIN order_items i USING(order_id) WHERE o.customer_id=$1 ORDER BY o.placed_at DESC,o.order_id DESC,i.line_no',[1]);assert.equal(plain.rows.length,4);results.joinRows=plain.rows;
 await pglet.exec(before);
 const tx={query:async(text,values)=>{const result=await q(text,values);return {...result,rowCount:result.affectedRows};}};
 await pglet.exec('BEGIN');await writeOrder103(tx);await pglet.exec('COMMIT');
 results.purchase=await q('SELECT product_id,stock FROM products ORDER BY product_id');assert.deepEqual(results.purchase.rows,[{product_id:'P3',stock:10},{product_id:'P7',stock:0},{product_id:'P9',stock:4}]);
 const after=await q('SELECT o.order_id,o.status,count(i.*)::integer lines,sum(i.quantity*i.unit_price)::text value FROM orders o JOIN order_items i USING(order_id) WHERE order_id=103 GROUP BY o.order_id');assert.equal(after.rows[0].value,'29.00');assert.equal(after.rows[0].lines,2);results.purchaseOrder=after.rows;
 const zero=await q('UPDATE products SET stock=stock-$2 WHERE product_id=$1 AND stock >= $2 RETURNING stock',['P7',1]);assert.equal(zero.affectedRows,0);assert.equal(zero.rows.length,0);results.guardAfterPurchase={affectedRows:zero.affectedRows,rows:zero.rows};
 await pglet.exec(before);await pglet.exec("UPDATE products SET stock=0 WHERE product_id='P7'");await pglet.exec('BEGIN');
 await assert.rejects(()=>writeOrder103(tx),PurchaseRejected);await pglet.exec('ROLLBACK');const rejected=await q("SELECT stock FROM products WHERE product_id='P3'");assert.equal(rejected.rows[0].stock,12);assert.equal((await q('SELECT * FROM orders WHERE order_id=103')).rows.length,0);results.rejectedAfterEarlierTeaWrite=rejected.rows;
 results.version=(await q('SELECT version()')).rows[0].version;
} finally {await pglet.close();}
await writeFile(new URL('evidence/pglite-results.json',root),JSON.stringify(results,null,2)+'\n');

if(process.argv.includes('--native')) {
 const {Pool}=require('/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js');
 const cfg=JSON.parse(await readFile('/private/tmp/staycurrent-rebuild-app-native-20261025/connection.json','utf8'));
 const pool=new Pool({...cfg,max:2,idleTimeoutMillis:0,application_name:'application-sql-verifier',options:'-c timezone=UTC -c search_path=sc_application_sql,pg_catalog'});
 pool.on('error',()=>{});
 const observed={pgVersion:require('/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/package.json').version};
 let a,b;
 try {
  a=await pool.connect();
  const identity=(await a.query("SELECT version(),current_database(),current_user,current_setting('cluster_name') cluster,current_setting('data_directory') data_directory")).rows[0];
  assert.equal(identity.current_database,'sc_app');assert.equal(identity.current_user,'sc_app_writer');assert.equal(identity.cluster,'staycurrent-app-sql-20261025');assert.ok(identity.data_directory.startsWith('/var/lib/postgresql/'));observed.identity=identity;
  await a.query('CREATE SCHEMA sc_application_sql');await a.query(ddl);
  const history=await Function('pool','customerId',`return (async()=>{${examples.history};return rows;})()`)(a,1);assert.deepEqual(history.map(r=>r.order_id),[103,101]);observed.history=history;
  const mappings=(await a.query("SELECT order_id,placed_at,(SELECT unit_price FROM order_items WHERE order_id=103 AND line_no=2) unit_price FROM orders WHERE order_id=103")).rows[0];assert.equal(mappings.unit_price,'4.50');assert.equal(typeof mappings.order_id,'number');assert.ok(mappings.placed_at instanceof Date);assert.equal(mappings.placed_at.toISOString(),'2026-10-20T10:15:00.000Z');observed.mapping={...mappings,priceType:typeof mappings.unit_price,idType:typeof mappings.order_id,dateConstructor:mappings.placed_at.constructor.name};
  const malicious='1 OR TRUE';const injected=await a.query('SELECT order_id FROM orders WHERE customer_id = '+malicious);assert.equal(injected.rows.length,3);let bindError;try{await a.query('SELECT order_id FROM orders WHERE customer_id=$1',[malicious]);}catch(e){bindError=e.code;}assert.equal(bindError,'22P02');observed.parameters={unsafeRows:injected.rows.length,boundError:bindError};
  const newest=await Function('pool','customerId','requestedSort',`return (async()=>{${examples.sort};return rows;})()`)(a,1,'newest');const oldest=await Function('pool','customerId','requestedSort',`return (async()=>{${examples.sort};return rows;})()`)(a,1,'oldest');assert.equal(newest[0].order_id,103);assert.equal(oldest[0].order_id,101);observed.sorts={newest:newest.map(r=>r.order_id),oldest:oldest.map(r=>r.order_id)};
  observed.batch=(await a.query(examples.batch,[[103,101]])).rows;assert.equal(observed.batch.length,4);
  await a.query('BEGIN');await a.query('UPDATE products SET stock=-1 WHERE product_id=\'P7\'').catch(e=>{observed.originalError={code:e.code,constraint:e.constraint};});let failedCode;try{await a.query('SELECT 1');}catch(e){failedCode=e.code;}assert.equal(failedCode,'25P02');await a.query('ROLLBACK');assert.equal((await a.query('SELECT 1 AS n')).rows[0].n,1);observed.failedTransaction={failedCode,afterRollback:'SELECT succeeds'};
  await a.query(before);await a.query('BEGIN');await writeOrder103(a);await a.query('COMMIT');observed.purchase=(await a.query('SELECT product_id,stock FROM products ORDER BY product_id')).rows;assert.equal(observed.purchase[0].stock,10);assert.equal(observed.purchase[1].stock,0);
  const update=await a.query('UPDATE products SET stock=stock WHERE product_id=$1',['P3']);assert.equal(update.rowCount,1);assert.equal(update.rows.length,0);observed.writeWithoutReturning={rowCount:update.rowCount,rows:update.rows};
  const zero=await a.query('UPDATE products SET stock=stock-$2 WHERE product_id=$1 AND stock >= $2 RETURNING stock',['P7',1]);assert.equal(zero.rowCount,0);observed.zeroGuard={rowCount:zero.rowCount,rows:zero.rows};
  await a.query(before+"UPDATE products SET stock=0 WHERE product_id='P7'");await a.query('BEGIN');await assert.rejects(()=>writeOrder103(a),PurchaseRejected);await a.query('ROLLBACK');assert.equal((await a.query("SELECT stock FROM products WHERE product_id='P3'")).rows[0].stock,12);observed.guardRollback='Earlier tea decrement rolled back';
  await a.query(before);b=await pool.connect();await a.query('BEGIN');await b.query("UPDATE products SET stock=stock-1 WHERE product_id='P7'");await a.query('ROLLBACK');const split=(await a.query("SELECT stock FROM products WHERE product_id='P7'")).rows[0].stock;assert.equal(split,0);observed.splitConnections={connectionA:(await a.query('SELECT pg_backend_pid() pid')).rows[0].pid,connectionB:(await b.query('SELECT pg_backend_pid() pid')).rows[0].pid,stockAfterRollbackA:split};b.release();b=null;
  const pid=(await a.query('SELECT pg_backend_pid() pid')).rows[0].pid;await a.query("SET TIME ZONE 'Europe/Stockholm'");a.release();a=null;const reuse=await pool.connect();a=reuse;assert.equal((await a.query('SELECT pg_backend_pid() pid')).rows[0].pid,pid);assert.equal((await a.query('SHOW TIME ZONE')).rows[0].TimeZone,'Europe/Stockholm');await a.query("SET TIME ZONE 'UTC';BEGIN;SET LOCAL TIME ZONE 'Europe/Stockholm';COMMIT");const restored=(await a.query('SHOW TIME ZONE')).rows[0].TimeZone;assert.equal(restored,'UTC');observed.session={sameBackend:true,afterSet:'Europe/Stockholm',afterLocalCommit:restored};
  await a.query("BEGIN; SET LOCAL statement_timeout='10ms'");let timeout;try{await a.query('SELECT pg_sleep(0.1)');}catch(e){timeout=e.code;}assert.equal(timeout,'57014');await a.query('ROLLBACK');observed.statementTimeout={code:timeout,afterRollback:(await a.query('SHOW statement_timeout')).rows[0].statement_timeout};
  await a.query('DROP SCHEMA sc_application_sql CASCADE');
 } finally {if(b)b.release(true);if(a)a.release(true);await pool.end();}
 await writeFile(new URL('evidence/native-results.json',root),JSON.stringify(observed,null,2)+'\n');
}
console.log('All requested SQL and driver checks passed.');
