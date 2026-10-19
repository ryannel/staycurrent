// Run only against a disposable PostgreSQL server where you may create a database.
// PG_ADMIN_URL=postgresql://... PG_DRIVER_MODULE=... node rehearse.mjs
import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
const {Client, Pool}=await import(process.env.PG_DRIVER_MODULE || 'pg');
const adminURL=process.env.PG_ADMIN_URL;
if(!adminURL) throw new Error('Set PG_ADMIN_URL to a disposable server.');
const db=`rel3_a20_run${process.pid}`;
const admin=new Client({connectionString:adminURL,application_name:'rel3_a20_admin'});
await admin.connect();
const rows=[]; const pools=new Set();
const record=(name,detail)=>rows.push({name,...detail});
const config={connectionString:new URL(db,adminURL.endsWith('/')?adminURL:adminURL.slice(0,adminURL.lastIndexOf('/')+1)).href,application_name:'rel3_a20',max:1,idleTimeoutMillis:0,connectionTimeoutMillis:1000};
const pool=(extra={})=>{const p=new Pool({...config,...extra});p.on('error',()=>{});pools.add(p);return p;};
const end=async p=>{await p.end();pools.delete(p);};
const counts=p=>({total:p.totalCount,idle:p.idleCount,waiting:p.waitingCount});
const until=async(fn)=>{for(let n=0;n<100;n++){if(await fn())return;await delay(10);}throw new Error('Bounded observation did not arrive');};
try {
 await admin.query(`CREATE DATABASE ${db}`);
 const p=pool();
 let c=await p.connect();
 const version=(await c.query('SHOW server_version')).rows[0].server_version;
 await c.query('CREATE TABLE orders(id integer PRIMARY KEY)');
 await c.query('INSERT INTO orders VALUES(101)');
 c.release();
 assert.equal((await p.query('SELECT count(*)::int AS n FROM orders')).rows[0].n,1);
 record('ordinary statement commits without explicit BEGIN',{version,counts:counts(p)});
 const affinity=pool({max:2});let firstClient=await affinity.connect();await firstClient.query('BEGIN');firstClient.release();
 firstClient=await affinity.connect();const firstPid=firstClient.processID;
 await affinity.query('INSERT INTO orders VALUES(202)');await firstClient.query('ROLLBACK');firstClient.release();
 assert.equal((await affinity.query('SELECT count(*)::int AS n FROM orders WHERE id=202')).rows[0].n,1);
 record('pool shortcut can write outside original transaction',{firstPid,afterRollback:202,clients:affinity.totalCount});await end(affinity);
 c=await p.connect();try{await c.query('BEGIN NOT_A_MODE');assert.fail();}catch(e){assert.equal(e.code,'42601');}assert.equal(c.getTransactionStatus(),'I');c.release();
 record('failed begin has no open transaction',{code:'42601',status:'I'});
 c=await p.connect();
 await c.query('BEGIN');
 try{await c.query('SELECT 1/0');assert.fail();}catch(e){assert.equal(e.code,'22012');}
 assert.equal(c.getTransactionStatus(),'E');
 try{await c.query('SELECT 1');assert.fail();}catch(e){assert.equal(e.code,'25P02');}
 await c.query('ROLLBACK');assert.equal(c.getTransactionStatus(),'I');c.release();
 record('statement failure requires rollback',{error:'22012',nextStatement:'25P02',afterRollback:'I',counts:counts(p)});
 c=await p.connect();const pid=c.processID;
 await c.query("SET application_name='tenant_7_left_behind'");c.release();
 c=await p.connect();assert.equal(c.processID,pid);
 const leaked=(await c.query('SHOW application_name')).rows[0].application_name;
 assert.equal(leaked,'tenant_7_left_behind');
 await c.query("SET application_name='rel3_a20'");
 await c.query('BEGIN');await c.query("SET LOCAL application_name='tenant_7_local'");
 const local=(await c.query('SHOW application_name')).rows[0].application_name;
 await c.query('COMMIT');
 const after=(await c.query('SHOW application_name')).rows[0].application_name;
 assert.equal(local,'tenant_7_local');assert.equal(after,'rel3_a20');c.release();
 record('lease return does not reset session settings',{samePid:true,leaked,local,after});
 c=await p.connect();let accepted=false;
 const late=p.connect().then(client=>{if(!accepted){client.release();return 'late lease returned';}return client;});
 const outcome=await Promise.race([late,delay(30).then(()=> 'caller stopped waiting')]);
 assert.equal(outcome,'caller stopped waiting');assert.equal(p.waitingCount,1);
 c.release();assert.equal(await late,'late lease returned');
 assert.deepEqual(counts(p),{total:1,idle:1,waiting:0});
 record('abandoned Promise race still acquires later',{outcome,late:'explicitly returned',counts:counts(p)});
 const timed=pool({connectionTimeoutMillis:40});c=await timed.connect();
 try{await timed.connect();assert.fail();}catch(e){assert.match(e.message,/timeout/);}
 assert.equal(timed.waitingCount,0);c.release();await timed.query('SELECT 1');
 record('configured acquisition timeout removes queued waiter',{counts:counts(timed)});await end(timed);
 c=await p.connect();await c.query('BEGIN');
 const sleeping=c.query('SELECT pg_sleep(5)').then(()=>({ok:true}),e=>({code:e.code}));
 await until(async()=> (await admin.query('SELECT wait_event FROM pg_stat_activity WHERE pid=$1',[c.processID])).rows[0]?.wait_event==='PgSleep');
 const requested=(await admin.query('SELECT pg_cancel_backend($1) AS sent',[c.processID])).rows[0].sent;
 const completion=await sleeping;assert.equal(completion.code,'57014');assert.equal(c.getTransactionStatus(),'E');
 await c.query('ROLLBACK');c.release();await p.query('SELECT 1');
 record('cancel execution then await and rollback',{requested,completion,statusAfterCleanup:'I',counts:counts(p)});
 c=await p.connect();await c.query('BEGIN');await c.query("SET LOCAL statement_timeout='40ms'");
 try{await c.query('SELECT pg_sleep(1)');assert.fail();}catch(e){assert.equal(e.code,'57014');}
 assert.equal(c.getTransactionStatus(),'E');await c.query('ROLLBACK');c.release();
 record('server statement timeout aborts explicit transaction',{code:'57014',counts:counts(p)});
 const read=pool();c=await read.connect();const readPid=c.processID;
 try{await c.query({text:'SELECT pg_sleep(1)',query_timeout:30});assert.fail();}catch(e){assert.match(e.message,/Query read timeout/);}
 const still=(await admin.query('SELECT state,wait_event FROM pg_stat_activity WHERE pid=$1',[readPid])).rows[0];
 assert.equal(still.wait_event,'PgSleep');c.release(true);
 await read.query('SELECT 1');record('client read timeout does not establish server completion',{still,counts:counts(read)});await end(read);
 c=await p.connect();await c.query('BEGIN');
 await c.query('DECLARE order_rows NO SCROLL CURSOR FOR SELECT generate_series(101,105) AS id');
 const first=(await c.query('FETCH FORWARD 2 FROM order_rows')).rows.map(r=>r.id);assert.deepEqual(first,[101,102]);
 const held=(await admin.query('SELECT state FROM pg_stat_activity WHERE pid=$1',[c.processID])).rows[0].state;assert.equal(held,'idle in transaction');
 await c.query('CLOSE order_rows');await c.query('ROLLBACK');c.release();
 c=await p.connect();const cursors=(await c.query("SELECT count(*)::int AS n FROM pg_cursors WHERE name = 'order_rows'")).rows[0].n;assert.equal(cursors,0);c.release();
 record('early cursor consumption closes resources before return',{first,whileConsumerPaused:held,cursorsNextBorrower:cursors,counts:counts(p)});
 c=await p.connect();await c.query('BEGIN');c.on('error',()=>{});
 await admin.query('SELECT pg_terminate_backend($1)',[c.processID]);await delay(20);
 const originalError=new Error('operation interrupted');let rollbackError;
 await assert.rejects(c.query('ROLLBACK'),e=>{rollbackError=e.message;return /closed|queryable|terminat/i.test(e.message);});
 assert.equal(originalError.message,'operation interrupted');
 c.release(true);await p.query('SELECT 1');
 record('failed rollback discards connection',{rollbackError,nextBorrower:'SELECT 1 succeeded',counts:counts(p)});
 c=await p.connect();const idlePid=c.processID;c.release();
 await admin.query('SELECT pg_terminate_backend($1)',[idlePid]);await until(()=>p.totalCount===0);
 c=await p.connect();assert.notEqual(c.processID,idlePid);c.release();
 record('idle disconnect emits error and is removed',{replaced:true,counts:counts(p)});
 const closing=pool();c=await closing.connect();let ended=false;
 const done=closing.end().then(()=>{ended=true;});await delay(40);assert.equal(ended,false);
 c.release(true);await done;pools.delete(closing);
 record('pool end waits for checked out lease',{beforeOwnerRelease:false,afterOwnerRelease:ended,counts:counts(closing)});
 await end(p);
 await until(async()=> (await admin.query('SELECT count(*)::int AS n FROM pg_stat_activity WHERE datname=$1',[db])).rows[0].n===0);
 const abandoned=(await admin.query("SELECT count(*)::int AS n FROM pg_stat_activity WHERE datname=$1",[db])).rows[0].n;assert.equal(abandoned,0);
 record('all sessions closed',{abandoned});
 console.log(JSON.stringify({database:db,driver:'pg 8.23.1',server:version,pipeline:false,observations:rows},null,2));
} finally {
 for(const p of pools){for(const c of [...(p._clients||[])]){try{await c.end();}catch{}}try{await p.end();}catch{}}
 await admin.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1',[db]);
 await admin.query(`DROP DATABASE IF EXISTS ${db}`);await admin.end();
}
