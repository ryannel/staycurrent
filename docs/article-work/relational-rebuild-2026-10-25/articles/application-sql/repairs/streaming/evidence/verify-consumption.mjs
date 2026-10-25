import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const runtime='/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/';
const {Pool}=require(runtime+'pg/lib/index.js');
const Cursor=require(runtime+'pg-cursor/index.js');
const source=await readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const front=source.split('---')[1].replace(/^import .*;$/gm,'');
const code=Function(`${front}\nreturn consumption;`)();
const makeHelper=CursorType=>Function('Cursor',`${code.replace(/^import .*;$/gm,'')}\nreturn consumeOrderLines;`)(CursorType);
const cfg=JSON.parse(await readFile('/private/tmp/staycurrent-rebuild-application-sql-native-20261025/connection.json','utf8'));
const options={...cfg,max:1,idleTimeoutMillis:0,connectionTimeoutMillis:2000,application_name:'sc-consumption-verifier',options:'-c timezone=UTC -c search_path=sc_consumption_check,pg_catalog'};
const pool=new Pool(options);pool.on('error',()=>{});
const admin=new Pool({...options,application_name:'sc-consumption-observer'});admin.on('error',()=>{});
const result={codeSHA256:createHash('sha256').update(code).digest('hex'),pg:require(runtime+'pg/package.json').version,cursor:require(runtime+'pg-cursor/package.json').version};
const expected=[[101,1],[101,2],[103,1],[103,2]];
let held,unfinished;
const queryTimeout=(promise,ms=3000)=>Promise.race([promise,new Promise((_,reject)=>{const t=setTimeout(()=>reject(new Error('Verifier operation deadline')),ms);t.unref();})]);
try {
 const identity=(await pool.query("SELECT version(),current_database(),current_user,current_setting('cluster_name') cluster,current_setting('data_directory') data_directory")).rows[0];
 assert.equal(identity.current_database,'sc_application_sql');assert.equal(identity.current_user,'sc_application_sql_writer');assert.equal(identity.cluster,'staycurrent-application-sql-20261025');assert.ok(identity.data_directory.startsWith('/var/lib/postgresql/'));result.identity=identity;
 await pool.query(`DROP SCHEMA IF EXISTS sc_consumption_check CASCADE;CREATE SCHEMA sc_consumption_check;
 CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL);
 CREATE TABLE order_items(order_id integer,line_no integer,product_id text,quantity integer,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no));
 INSERT INTO orders VALUES(101,1),(102,2),(103,1);
 INSERT INTO order_items VALUES(101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);`);
 let calls=[];let consumerActive=false;
 class TrackedCursor extends Cursor {
  async read(n){assert.equal(consumerActive,false,'A read started before prior consumption finished');const rows=await super.read(n);calls.push(['read',rows.length]);return rows;}
  async close(){calls.push(['close']);return super.close();}
 }
 const consume=makeHelper(TrackedCursor);
 const beforePid=(await pool.query('SELECT pg_backend_pid() pid')).rows[0].pid;
 const rows=[];
 await consume(pool,1,async batch=>{consumerActive=true;calls.push(['consumer-start',batch.length]);await new Promise(resolve=>setImmediate(resolve));rows.push(...batch.map(r=>[r.order_id,r.line_no]));calls.push(['consumer-finish']);consumerActive=false;});
 assert.deepEqual(rows,expected);assert.deepEqual(calls.filter(c=>c[0]==='read').map(c=>c[1]),[2,2,0]);assert.equal(calls.at(-1)[0],'close');const completionPid=(await pool.query('SELECT pg_backend_pid() pid')).rows[0].pid;assert.equal(completionPid,beforePid);result.complete={rows,calls,sameBackendAfterClose:true};
 calls=[];let earlyRows=[];await consume(pool,1,async batch=>{earlyRows=batch.map(r=>[r.order_id,r.line_no]);return false;});assert.deepEqual(earlyRows,expected.slice(0,2));assert.deepEqual(calls,[['read',2],['close']]);assert.equal((await pool.query('SELECT pg_backend_pid() pid')).rows[0].pid,beforePid);result.earlyStop={rows:earlyRows,calls:structuredClone(calls),sameBackendAfterClose:true};
 const original=new Error('Consumer rejected the batch');await assert.rejects(consume(pool,1,async()=>{throw original;}),e=>e===original);const afterConsumer=(await pool.query('SELECT pg_backend_pid() pid')).rows[0].pid;assert.notEqual(afterConsumer,beforePid);result.consumerFailure={originalPreserved:true,backendReplaced:true};
 await pool.query(`ALTER TABLE order_items RENAME TO order_items_data;CREATE VIEW order_items AS SELECT order_id,line_no,product_id,quantity/(quantity-quantity) AS quantity,unit_price FROM order_items_data;`);
 let readError;try{await consume(pool,1,async()=>{});}catch(e){readError=e.code;}assert.equal(readError,'22012');const afterRead=(await pool.query('SELECT pg_backend_pid() pid')).rows[0].pid;assert.notEqual(afterRead,afterConsumer);result.readFailure={sqlstate:readError,backendReplaced:true};await pool.query('DROP VIEW order_items;ALTER TABLE order_items_data RENAME TO order_items');
 class CloseFailureCursor extends Cursor {async close(){throw new Error('Injected close failure');}}
 await assert.rejects(makeHelper(CloseFailureCursor)(pool,1,async()=>false),/Injected close failure/);const afterClose=(await pool.query('SELECT pg_backend_pid() pid')).rows[0].pid;assert.notEqual(afterClose,afterRead);result.closeFailure={injected:true,backendReplaced:true};
 // Counterexample: ordinary release offers the same client despite its unfinished result.
 held=await pool.connect();const originalClient=held;const badPid=(await held.query('SELECT pg_backend_pid() pid')).rows[0].pid;unfinished=held.query(new Cursor('SELECT * FROM order_items ORDER BY order_id,line_no'));const first=await unfinished.read(2);assert.equal(first.length,2);held.release();held=null;
 held=await pool.connect();assert.equal(held,originalClient);let settled=false;const next=held.query('SELECT 42 AS answer').then(r=>{settled=true;return r;});await new Promise(resolve=>setTimeout(resolve,75));assert.equal(settled,false);const backend=(await admin.query('SELECT state,wait_event_type,wait_event FROM pg_stat_activity WHERE pid=$1',[badPid])).rows[0];assert.ok(backend);await unfinished.close();unfinished=null;assert.equal((await queryTimeout(next)).rows[0].answer,42);result.unsafeRelease={sameBackendBorrowed:true,nextQueryUnsettledBeforeClose:true,observedBackend:backend,nextQueryAfterClose:42};held.release();held=null;
 // Counterexample for pacing: omitting await queues both batches before consumers finish.
 held=await pool.connect();unfinished=held.query(new Cursor('SELECT * FROM order_items WHERE order_id IN (101,103) ORDER BY order_id,line_no'));let pending=0,maximum=0,releaseConsumers;const gate=new Promise(resolve=>{releaseConsumers=resolve;});const slowConsumer=async()=>{pending++;maximum=Math.max(maximum,pending);await gate;pending--;};const unfinishedConsumers=[];for(;;){const rows=await unfinished.read(2);if(!rows.length)break;unfinishedConsumers.push(slowConsumer(rows));}assert.equal(maximum,2);releaseConsumers();await Promise.all(unfinishedConsumers);await unfinished.close();unfinished=null;held.release();held=null;result.unawaitedConsumer={unfinishedBatchesBeforeFinishingConsumers:maximum};
 await pool.query('DROP SCHEMA sc_consumption_check CASCADE');
 await writeFile(new URL('consumption-native-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
 console.log('Focused cursor completion, early stop, failure and counterexample checks passed.');
} finally {
 if(unfinished){try{await queryTimeout(unfinished.close(),1000);}catch{}}
 if(held)held.release(true);
 await Promise.allSettled([pool.end(),admin.end()]);
}
