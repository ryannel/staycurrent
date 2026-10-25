import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const connection = JSON.parse(readFileSync('/private/tmp/staycurrent-rebuild-transactions-native-20261025/connection.json','utf8'));
assert.equal(connection.host,'127.0.0.1'); assert.equal(connection.port,55746);
const schema='transactions_writer_proof';
const clients=[];
const evidence={client:'pg8.23.1',endpoint:'127.0.0.1:55746',checks:[],limits:'Owned disposable native fixture supplied by coordinator. Coordinated schedules check selected behaviours, not latency or a universal winning transaction. Root owns server lifecycle. No credentials retained.'};
let ownsSchema=false;
const q=async(c,sql,values)=>(await c.query(sql,values)).rows;
async function client(name) {
  const c=new pg.Client({...connection,application_name:`txproof-${name}`,connectionTimeoutMillis:2500,statement_timeout:8000});
  clients.push(c); await c.connect();
  const [id]=await q(c,"SELECT current_database() db,current_user usr,current_setting('cluster_name') cluster,current_setting('data_directory') data_directory,version()");
  assert.equal(id.db,'sc_transactions'); assert.equal(id.usr,'sc_transactions_writer');
  assert.equal(id.cluster,'staycurrent-transactions-20261025');
  assert.ok(id.data_directory.startsWith('/var/lib/postgresql/'));
  evidence.identity=id;
  return c;
}
async function blocked(observer,name) {
  for(let attempt=0;attempt<60;attempt++) {
    const rows=await q(observer,"SELECT wait_event_type FROM pg_stat_activity WHERE application_name=$1",[`txproof-${name}`]);
    if(rows[0]?.wait_event_type==='Lock') return true;
    await new Promise(resolve=>setTimeout(resolve,30));
  }
  throw Error('Expected lock wait not observed');
}
try {
  const a=await client('A'),b=await client('B'),o=await client('observer');
  await o.query(`CREATE SCHEMA ${schema}`); ownsSchema=true;
  for(const c of clients) await c.query(`SET search_path=${schema},pg_catalog`);
  await o.query(`CREATE TABLE products(product_id text PRIMARY KEY,stock integer NOT NULL CHECK(stock>=0));
CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer,placed_at timestamptz,status text);
CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text REFERENCES products,quantity integer,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no));
CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer REFERENCES orders,amount numeric(8,2) CHECK(amount>0),method text);`);
  const reset=async()=>{
    await a.query('ROLLBACK');await b.query('ROLLBACK');
    await o.query('TRUNCATE payments,order_items,orders,products');
    await o.query("INSERT INTO products VALUES('P3',12),('P7',1),('P9',4)");
  };
  const purchase=async()=>a.query(`UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1;
UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2;
INSERT INTO orders VALUES(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);`);
  const stock="SELECT stock FROM products WHERE product_id='P7'";
  const guard="UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock";
  const totals="SELECT (SELECT SUM(quantity*unit_price) FROM order_items WHERE order_id=103) line_value,(SELECT COALESCE(SUM(amount),0) FROM payments WHERE order_id=103) paid";

  await reset(); await a.query('BEGIN'); await b.query('BEGIN');
  assert.equal((await q(a,stock))[0].stock,1); assert.equal((await q(b,stock))[0].stock,1);
  await a.query("UPDATE products SET stock=0 WHERE product_id='P7'");
  const unsafe=b.query("UPDATE products SET stock=0 WHERE product_id='P7'");
  await blocked(o,'B'); await a.query('COMMIT'); assert.equal((await unsafe).rowCount,1); await b.query('COMMIT');
  assert.equal((await q(o,stock))[0].stock,0);
  evidence.checks.push({case:'unsafe absolute stock writes',earlierReads:[1,1],secondWaitObserved:true,updates:[1,1],committedStock:0});

  await reset(); await a.query('BEGIN');await b.query('BEGIN');
  assert.equal((await q(a,guard))[0].stock,0);
  await b.query("UPDATE products SET stock=stock-2 WHERE product_id='P3'");
  const guarded=b.query(guard); await blocked(o,'B');await a.query('COMMIT');assert.equal((await guarded).rowCount,0);await b.query('ROLLBACK');
  assert.equal((await q(o,"SELECT stock FROM products WHERE product_id='P3'"))[0].stock,12);
  evidence.checks.push({case:'guarded RC stock and entire losing rollback',secondWaitObserved:true,secondChangedRows:0,earlierTeaChangeRolledBack:true});

  for(const isolation of ['READ COMMITTED','REPEATABLE READ']) {
    await reset();await b.query(`BEGIN ISOLATION LEVEL ${isolation} READ ONLY`);
    const before=(await q(b,stock))[0].stock;
    await a.query('BEGIN');await purchase();
    assert.equal((await q(o,"SELECT count(*)::int n FROM orders WHERE order_id=103"))[0].n,0);
    assert.equal((await q(o,stock))[0].stock,1);
    await a.query('COMMIT');
    const orderCount=(await q(b,"SELECT count(*)::int n FROM orders WHERE order_id=103"))[0].n;
    const after=(await q(b,stock))[0].stock;
    assert.equal(orderCount,isolation==='READ COMMITTED'?1:0);assert.equal(after,isolation==='READ COMMITTED'?0:1);
    await b.query('COMMIT');
    evidence.checks.push({case:`report ${isolation}`,before,orderCount,after,uncommittedPurchaseInvisible:true});
  }
  await reset(); await b.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  await a.query('BEGIN');await purchase();await a.query('COMMIT');
  assert.equal((await q(b,stock))[0].stock,0);await b.query('COMMIT');
  evidence.checks.push({case:'RR BEGIN before commit, first SELECT after',firstStock:0});

  await reset(); await a.query('BEGIN');await b.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
  assert.equal((await q(b,stock))[0].stock,1);await q(a,guard);
  const conflict=b.query(guard).then(result=>({result}),error=>({code:error.code}));
  await blocked(o,'B');await a.query('COMMIT');assert.equal((await conflict).code,'40001');await b.query('ROLLBACK');
  evidence.checks.push({case:'RR overlapping same-row guarded update',secondWaitObserved:true,error:'40001'});

  for(const isolation of ['REPEATABLE READ','SERIALIZABLE']) {
    await reset();await a.query('BEGIN');await purchase();await a.query('COMMIT');
    await a.query(`BEGIN ISOLATION LEVEL ${isolation}`);await b.query(`BEGIN ISOLATION LEVEL ${isolation}`);
    const initialA=(await q(a,totals))[0],initialB=(await q(b,totals))[0];
    assert.equal(initialA.paid,'0');assert.equal(initialB.paid,'0');assert.equal(initialA.line_value,'29.00');
    await a.query("INSERT INTO payments VALUES(601,103,20,'card')");
    await b.query("INSERT INTO payments VALUES(602,103,20,'card')");
    await a.query('COMMIT');
    const endB=await b.query('COMMIT').then(()=>({committed:true}),e=>({error:e.code}));
    const paid=(await q(o,totals))[0].paid;
    if(isolation==='REPEATABLE READ') {assert.equal(paid,'40.00');assert.equal(endB.committed,true);}
    else {
      assert.equal(endB.error,'40001');assert.equal(paid,'20.00');await b.query('ROLLBACK');
      await b.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
      const retry=(await q(b,totals))[0];assert.equal(retry.paid,'20.00');assert.equal(Number(retry.paid)+20<=Number(retry.line_value),false);await b.query('ROLLBACK');
    }
    evidence.checks.push({case:`payment limit ${isolation}`,initialA,initialB,endB,paid,freshRetry:isolation==='SERIALIZABLE'?'reads20.00; refuses20.00':null});
  }
  evidence.articleSha256=createHash('sha256').update(readFileSync(new URL('../src/articles/current/article.astro',import.meta.url))).digest('hex');
} catch(error) { evidence.failure={name:error.name,message:error.message,code:error.code};throw error;
} finally {
  for(const c of clients) {try{await c.query('ROLLBACK');}catch{}}
  if(ownsSchema) {try{await clients.at(-1).query(`DROP SCHEMA ${schema} CASCADE`);evidence.schemaCleaned=true;}catch(error){evidence.cleanupError=error.message;}}
  for(const c of clients) {try{await c.end();}catch{}}
  evidence.clientsClosed=true;
  evidence.verifierSha256=createHash('sha256').update(readFileSync(new URL('verify-native.mjs',import.meta.url))).digest('hex');
  writeFileSync(new URL('native-results.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
}
console.log(JSON.stringify(evidence,null,2));
