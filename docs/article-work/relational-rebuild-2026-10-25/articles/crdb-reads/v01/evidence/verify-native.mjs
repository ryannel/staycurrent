import fs from 'node:fs';
import crypto from 'node:crypto';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const out={verifier_sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(import.meta.url))).digest('hex'),started:new Date().toISOString(),guards:[],observations:[],limits:'Single-node native SQL only; no follower route, region, latency or survival evidence.'};
const clients=[]; const schema='reads_verification';
function assert(x,m){if(!x)throw Error(m)}
async function connect(){
 assert(input.host==='127.0.0.1'&&input.port===49482&&input.database==='sc_crdb_reads'&&input.user==='sc_crdb_reads_writer'&&input.ssl===false,'Connection target mismatch');
 const c=new pg.Client({...input,connectionTimeoutMillis:5000,query_timeout:12000});clients.push(c);await c.connect();
 const g=(await c.query(`SELECT current_database() AS db, current_user AS principal, version()`)).rows[0];
 assert(g.db==='sc_crdb_reads'&&g.principal==='sc_crdb_reads_writer'&&g.version.includes('v26.2.8'),'Identity mismatch');
 await c.query('SET allow_unsafe_internals = true');
 const id=(await c.query('SELECT crdb_internal.cluster_id()::STRING AS id')).rows[0].id;
 assert(id==='dbdf35e7-213b-42b4-81ed-f011d261ad45'&&id===input.expectedClusterId,'Cluster mismatch');
 const marker=(await c.query('SELECT marker FROM public.fixture_guard')).rows[0]?.marker;
 assert(marker==='staycurrent-crdb-reads-20261025'&&marker===input.expectedMarker,'Marker mismatch');
 out.guards.push({...g,id,marker});
 await c.query("SET statement_timeout = '8s'");
 await c.query(`SET search_path = ${schema}, public`);return c;
}
async function q(c,label,sql,values=[]){const r=await c.query(sql,values);out.observations.push({label,sql,rows:r.rows});return r.rows}
try{
 const a=await connect(),b=await connect();
 await a.query(`CREATE SCHEMA ${schema}`);
 await a.query(`CREATE TABLE products(product_id STRING PRIMARY KEY, price DECIMAL(8,2), stock INT); INSERT INTO products VALUES('P3',4.50,10),('P7',20.00,0),('P9',35.00,4); CREATE TABLE payments(payment_id INT PRIMARY KEY,order_id INT,amount DECIMAL(8,2))`);
 await q(a,'default isolation','SHOW default_transaction_isolation');
 for(const level of ['SERIALIZABLE','READ COMMITTED']){
  await b.query("UPDATE products SET price=20 WHERE product_id='P7'");
  await a.query(`BEGIN ISOLATION LEVEL ${level}`);await q(a,level+' effective','SHOW transaction_isolation');
  const first=await q(a,level+' first read',"SELECT price FROM products WHERE product_id='P7'");
  await b.query("UPDATE products SET price=22 WHERE product_id='P7'");
  const second=await q(a,level+' second read',"SELECT price FROM products WHERE product_id='P7'");
  assert(first[0].price==='20.00'&&second[0].price===(level==='SERIALIZABLE'?'20.00':'22.00'),'Isolation result mismatch');await a.query('COMMIT');
 }
 for(const level of ['READ COMMITTED','SERIALIZABLE']){
  await a.query('DELETE FROM payments');await a.query(`BEGIN ISOLATION LEVEL ${level}`);await b.query(`BEGIN ISOLATION LEVEL ${level}`);
  const sql='SELECT COALESCE(sum(amount),0) AS total FROM payments WHERE order_id=103';
  await q(a,level+' attempt 601 sees',sql);await q(b,level+' attempt 602 sees',sql);
  await a.query('INSERT INTO payments VALUES(601,103,20)');await a.query('COMMIT');
  let error;try{await b.query('INSERT INTO payments VALUES(602,103,20)');await b.query('COMMIT')}catch(e){error={code:e.code,message:e.message};await b.query('ROLLBACK')}
  out.observations.push({label:level+' attempt 602 outcome',error:error||null});
  const total=await q(a,level+' final total',sql);assert(total[0].total===(level==='READ COMMITTED'?'40.00':'20.00'),'Payment protection mismatch');
  if(level==='SERIALIZABLE')assert(error?.code==='40001','Expected serialization error');
 }
 await a.query("UPDATE products SET price=20 WHERE product_id='P7'");
 const t=(await a.query('SELECT cluster_logical_timestamp()::STRING AS t')).rows[0].t;
 await b.query("UPDATE products SET price=22 WHERE product_id='P7'");
 await a.query('BEGIN');await a.query(`SET TRANSACTION AS OF SYSTEM TIME '${t}'`);
 const hist=await q(a,'fixed history P7',"SELECT price FROM products WHERE product_id='P7'");assert(hist[0].price==='20.00','Historical mismatch');
 await q(a,'fixed history unchanged stock','SELECT product_id,stock FROM products ORDER BY product_id');
 let readonly;try{await a.query("UPDATE products SET price=23 WHERE product_id='P7'")}catch(e){readonly={code:e.code,message:e.message}}await a.query('ROLLBACK');assert(readonly,'Historical writes unexpectedly allowed');out.observations.push({label:'historical write rejected',error:readonly});
 await q(a,'fresh current P7',"SELECT price FROM products WHERE product_id='P7'");
 await q(a,'convenience timestamp age','SELECT now() - follower_read_timestamp() AS age');
 await new Promise(r=>setTimeout(r,5000));
 await q(a,'exact convenience lookup',"SELECT price FROM products AS OF SYSTEM TIME follower_read_timestamp() WHERE product_id='P7'");
 await q(a,'bounded lookup',"SELECT price FROM products AS OF SYSTEM TIME with_max_staleness('10s') WHERE product_id='P7'");
 await q(a,'minimum lookup',`SELECT price FROM products AS OF SYSTEM TIME with_min_timestamp('${new Date(Date.now()-2000).toISOString()}'::TIMESTAMPTZ) WHERE product_id='P7'`);
 await q(a,'nearest only lookup',"SELECT price FROM products AS OF SYSTEM TIME with_max_staleness('10s',true) WHERE product_id='P7'");
 for(const [label,sql] of [['bounded multirow rejected',"SELECT * FROM products AS OF SYSTEM TIME with_max_staleness('10s')"],['bounded explicit transaction rejected',"BEGIN; SELECT price FROM products AS OF SYSTEM TIME with_max_staleness('10s') WHERE product_id='P7'"]]){let e;try{await a.query(sql)}catch(x){e={code:x.code,message:x.message}}await a.query('ROLLBACK');assert(e,'Expected bounded restriction');out.observations.push({label,error:e})}
 await q(a,'effective retention','SHOW ZONE CONFIGURATION FROM TABLE products');
 await q(a,'executed bounded plan',"EXPLAIN ANALYZE SELECT price FROM products AS OF SYSTEM TIME with_max_staleness('10s') WHERE product_id='P7'");
 out.success=true;
}catch(e){out.success=false;out.failure={message:e.message,code:e.code};process.exitCode=1}
finally{for(const c of clients){try{await c.query('ROLLBACK')}catch{}try{await c.end()}catch{}}out.finished=new Date().toISOString();fs.writeFileSync(process.argv[3],JSON.stringify(out,null,2)+'\n')}
