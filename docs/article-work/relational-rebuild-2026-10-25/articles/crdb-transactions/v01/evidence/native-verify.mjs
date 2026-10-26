// Root executes only against its explicitly supplied disposable article fixture.
// No defaults, server provisioning, database creation or database destruction.
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const configPath = process.argv[2];
const outputPath = process.argv[3];
assert(configPath && outputPath, 'Pass fixture JSON and output JSON explicitly');
const fixture = JSON.parse(await readFile(configPath, 'utf8'));
for (const field of ['host','port','database','user','password','application_name','expectedClusterId','expectedMarker']) assert(Object.hasOwn(fixture,field), field);
assert.equal(fixture.host,'127.0.0.1');
assert.equal(fixture.database,'sc_crdb_transactions');
const observations = [];
const clients = new Set();
async function connect() {
  const c = new pg.Client({host:fixture.host,port:fixture.port,database:fixture.database,user:fixture.user,password:fixture.password,ssl:false,application_name:fixture.application_name,connectionTimeoutMillis:5000,query_timeout:10000,statement_timeout:8000,options:'-c timezone=UTC'});
  await c.connect(); clients.add(c);
  await c.query('SET allow_unsafe_internals = true');
  const guard = await c.query('SELECT version() AS version, current_database() AS db, current_user AS username, crdb_internal.cluster_id()::STRING AS cluster_id');
  assert(guard.rows[0].version.includes('v26.2.8'));
  assert.equal(guard.rows[0].db,fixture.database);
  assert.equal(guard.rows[0].username,fixture.user);
  assert.equal(guard.rows[0].cluster_id,fixture.expectedClusterId);
  const marker = await c.query('SELECT marker FROM fixture_guard');
  assert.deepEqual(marker.rows,[{marker:fixture.expectedMarker}]);
  await c.query("SET application_name = 'staycurrent_crdb_transactions_verifier'");
  await c.query('SET statement_timeout = \'8s\'');
  observations.push({connection_guard:guard.rows[0],marker:fixture.expectedMarker});
  return c;
}
const payload = JSON.stringify({lines:[{product_id:'P3',quantity:2,unit_price:'4.50'},{product_id:'P7',quantity:1,unit_price:'20.00'}]});
const accepted = {outcome:'accepted',order_id:103,status_at_creation:'pending',total:'29.00'};
const refused = {outcome:'refused',reason:'insufficient_stock'};
class Mismatch extends Error {}
async function reset(c, mug=1) {
  await c.query('TRUNCATE order_items, payments, purchase_requests, orders, products, customers CASCADE');
  await c.query("INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg')");
  await c.query("INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,12),('P7','Blue mug',20.00,$1),('P9','Teapot',35.00,4)",[mug]);
  await c.query("INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid')");
  await c.query("INSERT INTO order_items VALUES (101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00)");
  await c.query("INSERT INTO payments VALUES (501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card')");
}
async function state(c) {
 return {
  stock:(await c.query('SELECT product_id,stock FROM products ORDER BY product_id')).rows,
  orders:(await c.query('SELECT order_id,status FROM orders ORDER BY order_id')).rows,
  lines:(await c.query('SELECT line_no,product_id,quantity,unit_price::STRING FROM order_items WHERE order_id=103 ORDER BY line_no')).rows,
  total:(await c.query('SELECT sum(quantity*unit_price)::STRING AS total FROM order_items WHERE order_id=103')).rows[0].total,
  payments:(await c.query('SELECT payment_id FROM payments WHERE order_id=103')).rows,
  requests:(await c.query('SELECT customer_id,request_key,payload,result FROM purchase_requests ORDER BY customer_id,request_key')).rows
 };
}
// The caller owns BEGIN and COMMIT. Every query is separately sent and observed.
async function claimAndPurchase(c, key='purchase-103', body=payload, inject=false) {
 const claim = await c.query('INSERT INTO purchase_requests(customer_id,request_key,payload) VALUES (1,$1,$2::JSONB) ON CONFLICT (customer_id,request_key) DO NOTHING RETURNING request_key',[key,body]);
 if (!claim.rowCount) {
  const found = await c.query('SELECT payload=$2::JSONB AS matches,result FROM purchase_requests WHERE customer_id=1 AND request_key=$1',[key,body]);
  assert.equal(found.rowCount,1,'Missing observation must restart protected protocol, never purchase');
  if (!found.rows[0].matches) throw new Mismatch('request payload mismatch');
  assert(found.rows[0].result, 'Protocol must not commit an unfinished request');
  return found.rows[0].result;
 }
 await c.query('SAVEPOINT purchase_work');
 const tea = await c.query("UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2 RETURNING stock");
 if (inject) {
  try { await c.query("SELECT crdb_internal.force_retry('1h'::INTERVAL)"); }
  catch(e) { observations.push({injected_error:{code:e.code,message:e.message}}); throw e; }
  throw new Error('Expected forced retry');
 }
 const mug = tea.rowCount ? await c.query("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock") : {rowCount:0};
 let result;
 if (!tea.rowCount || !mug.rowCount) {
  await c.query('ROLLBACK TO SAVEPOINT purchase_work'); result=refused;
 } else {
  await c.query("INSERT INTO orders VALUES (103,1,'2026-10-20 10:15+00','pending')");
  await c.query("INSERT INTO order_items VALUES (103,1,'P7',1,20.00),(103,2,'P3',2,4.50)");
  result=accepted;
 }
 await c.query('UPDATE purchase_requests SET result=$2::JSONB WHERE customer_id=1 AND request_key=$1',[key,JSON.stringify(result)]);
 return result;
}
async function perform(c, key='purchase-103', body=payload) {
 await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
 try { const result=await claimAndPurchase(c,key,body); await c.query('COMMIT'); return result; }
 catch(e) { await c.query('ROLLBACK'); throw e; }
}
try {
 const c=await connect();
 await c.query('CREATE TABLE customers(customer_id INT PRIMARY KEY,name STRING NOT NULL)');
 await c.query('CREATE TABLE products(product_id STRING PRIMARY KEY,name STRING NOT NULL,price DECIMAL(8,2) NOT NULL CHECK(price>=0),stock INT NOT NULL CHECK(stock>=0))');
 await c.query("CREATE TABLE orders(order_id INT PRIMARY KEY,customer_id INT NOT NULL REFERENCES customers,placed_at TIMESTAMPTZ NOT NULL,status STRING NOT NULL CHECK(status IN ('pending','paid','cancelled')))");
 await c.query('CREATE TABLE order_items(order_id INT REFERENCES orders,line_no INT,product_id STRING NOT NULL REFERENCES products,quantity INT NOT NULL CHECK(quantity>0),unit_price DECIMAL(8,2) NOT NULL,PRIMARY KEY(order_id,line_no))');
 await c.query('CREATE TABLE payments(payment_id INT PRIMARY KEY,order_id INT NOT NULL REFERENCES orders,amount DECIMAL(8,2) NOT NULL CHECK(amount>0),method STRING NOT NULL)');
 await c.query('CREATE TABLE purchase_requests(customer_id INT NOT NULL REFERENCES customers,request_key STRING NOT NULL,payload JSONB NOT NULL,result JSONB,PRIMARY KEY(customer_id,request_key))');
 const defaults={};
 for(const name of ['default_transaction_isolation','kv_transaction_buffered_writes_enabled','buffered_writes_implicit_txns_enabled','results_buffer_size']) defaults[name]=(await c.query('SHOW '+name)).rows;
 observations.push({defaults});
 await reset(c);
 // Known 40001 after earlier guarded work; full fresh attempt, same identity.
 await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
 let retry;
 try { await claimAndPurchase(c,'purchase-103',payload,true); } catch(e) { retry=e; }
 assert.equal(retry?.code,'40001');
 await c.query('ROLLBACK');
 let before=await state(c);
 assert.deepEqual(before.stock.map(x=>Number(x.stock)),[12,1,4]); assert.equal(before.requests.length,0);
 const result=await perform(c); assert.deepEqual(result,accepted);
 const committed=await state(c);
 assert.deepEqual(committed.stock.map(x=>Number(x.stock)),[10,0,4]);
 assert.equal(committed.lines.length,2); assert.equal(committed.total,'29.00'); assert.equal(committed.payments.length,0);
 assert.deepEqual(await perform(c),accepted);
 assert.deepEqual(await state(c),committed);
 observations.push({case:'40001_then_fresh_attempt_then_same_key_recovery',before,result,committed,repeat:'identical state'});
 const changed=JSON.stringify({lines:[{product_id:'P3',quantity:2,unit_price:'4.50'},{product_id:'P7',quantity:2,unit_price:'20.00'}]});
 await assert.rejects(()=>perform(c,'purchase-103',changed),Mismatch);
 assert.deepEqual(await state(c),committed);
 observations.push({case:'changed_payload_rejected',state:'unchanged'});
 const newKeyResult=await perform(c,'accidentally-new-token');
 assert.deepEqual(newKeyResult,refused);
 assert.deepEqual((await state(c)).stock,committed.stock);
 observations.push({case:'counterexample_new_token_after_success',result:newKeyResult,explanation:'False refusal for original purchase when identity is replaced'});
 // Independently initialise a shortage, preserving the shared starting basket.
 await reset(c,0);
 const refusal=await perform(c);
 assert.deepEqual(refusal,refused);
 let protectedShortage=await state(c);
 assert.deepEqual(protectedShortage.stock.map(x=>Number(x.stock)),[12,0,4]);
 assert.equal(protectedShortage.lines.length,0);
 await reset(c,0);
 await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
 await c.query("UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2 RETURNING stock");
 assert.equal((await c.query("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock")).rowCount,0);
 await c.query('COMMIT');
 let brokenShortage=await state(c);
 assert.deepEqual(brokenShortage.stock.map(x=>Number(x.stock)),[10,0,4]);
 observations.push({case:'counterexample_omitted_purchase_rollback',protectedShortage,brokenShortage});
 // Retry-savepoint alternative; no business-work savepoint is retained across retry.
 await reset(c);
 await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
 await c.query('SAVEPOINT cockroach_restart');
 await c.query("SELECT stock FROM products WHERE product_id='P7'");
 let savepointError;
 try { await c.query("SELECT crdb_internal.force_retry('1h'::INTERVAL)"); } catch(e) { savepointError=e; }
 assert.equal(savepointError?.code,'40001');
 await c.query('ROLLBACK TO SAVEPOINT cockroach_restart');
 // Deliberately no second force_retry: only the retry path is exercised here.
 assert.deepEqual(await claimAndPurchase(c),accepted);
 await c.query('RELEASE SAVEPOINT cockroach_restart');
 // Use a separately guarded connection to establish release's commitment.
 const observer=await connect();
 const afterRelease=await state(observer);
 assert.deepEqual(afterRelease.stock.map(x=>Number(x.stock)),[10,0,4]);
 assert.equal(afterRelease.lines.length,2);
 await c.query('COMMIT');
 observations.push({case:'restart_savepoint',error:{code:savepointError.code,message:savepointError.message},afterRelease});
 // A real same-row conflict, ordered explicitly with a second session.
 await reset(c);
 await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
 await c.query("SELECT stock FROM products WHERE product_id='P7'");
 await observer.query("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock");
 let conflict;
 try { await c.query("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock"); await c.query('COMMIT'); }
 catch(e) {conflict=e; await c.query('ROLLBACK');}
 observations.push({case:'two_session_same_row_conflict',error:conflict ? {code:conflict.code,message:conflict.message}:null,state:await state(observer)});
 assert.equal(conflict?.code,'40001');
 observations.push({limits:'Single-node native SQL only. force_retry is a test injection. No 40003 or actual lost reply injected. No distributed survival, physical intent trace, regional timing, or default latency established.'});
 await writeFile(outputPath,JSON.stringify({ok:true,observations},null,2)+'\n');
} catch(e) {
 await writeFile(outputPath,JSON.stringify({ok:false,error:{name:e.name,message:e.message,code:e.code,stack:e.stack},observations},null,2)+'\n');
 throw e;
} finally {
 await Promise.allSettled([...clients].map(async c=>{try{await c.query('ROLLBACK');}catch{}await c.end();}));
}
