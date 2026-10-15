import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {operationsTutorials} from '../../../../src/lib/sql-lessons/operations.ts';
const {Client}=pg;
const config={host:'/private/tmp/staycurrent-relational-depth/socket',port:55439,user:'ryannel',database:'sc_depth_migration'};
const bootstrap=new Client({...config,database:'postgres'});await bootstrap.connect();
if(!(await bootstrap.query('SELECT 1 FROM pg_database WHERE datname=$1',[config.database])).rowCount)await bootstrap.query('CREATE DATABASE sc_depth_migration');
await bootstrap.end();
const a=new Client({...config,application_name:'depth_migration_A'}),b=new Client({...config,application_name:'depth_migration_B'}),c=new Client({...config,application_name:'depth_migration_C'}),monitor=new Client({...config,application_name:'depth_migration_monitor'});
await Promise.all([a.connect(),b.connect(),c.connect(),monitor.connect()]);
const lesson=operationsTutorials.find(x=>x.id==='schema-evolution');
const report={version:(await monitor.query('SHOW server_version')).rows[0].server_version};
const pidA=(await a.query('SELECT pg_backend_pid() AS pid')).rows[0].pid,pidB=(await b.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
const pidC=(await c.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
async function reset(){await a.query('ROLLBACK');await b.query('ROLLBACK');await monitor.query(lesson.steps[0].sql);await monitor.query(lesson.steps[1].sql);}
async function state(){return (await monitor.query('SELECT * FROM migration_orders ORDER BY order_id')).rows;}
async function blocked(pid,by){
 const deadline=Date.now()+5000;
 while(Date.now()<deadline){
  const r=(await monitor.query('SELECT state,wait_event_type,wait_event,pg_blocking_pids(pid) AS blockers FROM pg_stat_activity WHERE pid=$1',[pid])).rows[0];
  if(r.blockers.includes(by))return r;
  await new Promise(resolve=>setTimeout(resolve,20));
 }
 throw Error('Expected lock wait was not observed');
}
try{
 await reset();
 const old=(await b.query('SELECT delivery_note FROM migration_orders WHERE order_id=1')).rows[0].delivery_note;
 await a.query("UPDATE migration_orders SET delivery_note='Reception' WHERE order_id=1");
 await b.query('UPDATE migration_orders SET delivery_instructions=$1 WHERE order_id=1',[old]);
 report.stale_application_copy={remembered:old,after:await state()};
 assert.equal(report.stale_application_copy.after[0].delivery_instructions,'Front desk');
 assert.equal(report.stale_application_copy.after[0].delivery_note,'Reception');

 await reset();
 await a.query("BEGIN ISOLATION LEVEL READ COMMITTED; UPDATE migration_orders SET delivery_note='Reception' WHERE order_id=1");
 await b.query('BEGIN ISOLATION LEVEL READ COMMITTED');
 const pendingBatch=b.query(lesson.steps[2].sql);
 const waiting=await blocked(pidB,pidA);
 await a.query('COMMIT');
 const batch=(await pendingBatch).rows;await b.query('COMMIT');
 report.writer_first={waiting,batch,after:await state()};
 assert.deepEqual(batch,[{order_id:2,delivery_instructions:'Ring bell'}]);
 assert.equal(report.writer_first.after[0].delivery_instructions,'Reception');
 assert.equal(report.writer_first.after[2].delivery_instructions,null);
 const remainder=(await b.query(lesson.steps[2].sql)).rows;
 assert.deepEqual(remainder,[{order_id:3,delivery_instructions:'Side door'}]);
 report.writer_first.next_batch=remainder;

 await reset();await b.query('BEGIN ISOLATION LEVEL READ COMMITTED');
 const firstBatch=(await b.query(lesson.steps[2].sql)).rows;
 await a.query('BEGIN ISOLATION LEVEL READ COMMITTED');
 const pendingWriter=a.query("UPDATE migration_orders SET delivery_note='Reception' WHERE order_id=1 RETURNING *");
 const writerWait=await blocked(pidA,pidB);await b.query('COMMIT');
 const written=(await pendingWriter).rows;await a.query('COMMIT');
 report.backfill_first={batch:firstBatch,waiting:writerWait,written,after:await state()};
 assert.equal(written[0].delivery_note,'Reception');assert.equal(written[0].delivery_instructions,'Reception');

 await monitor.query(lesson.steps[0].sql);
 await a.query('BEGIN; SELECT * FROM migration_orders WHERE order_id=1');
 await b.query("BEGIN; SET LOCAL lock_timeout='2s'; SET LOCAL statement_timeout='10s'");
 const pendingDDL=b.query('ALTER TABLE migration_orders ADD COLUMN delivery_instructions text').then(()=>({unexpectedSuccess:true}),e=>({code:e.code,message:e.message}));
 const ddlWait=await blocked(pidB,pidA);
 const locks=(await monitor.query("SELECT mode,granted FROM pg_locks WHERE pid=$1 AND relation='migration_orders'::regclass ORDER BY mode",[pidB])).rows;
 const pendingRead=c.query('SELECT order_id,delivery_note FROM migration_orders WHERE order_id=1');
 const laterReadWait=await blocked(pidC,pidB);
 const failure=await pendingDDL;assert.equal(failure.code,'55P03');
 const laterRead=(await pendingRead).rows;
 assert.deepEqual(laterRead,[{order_id:1,delivery_note:'Front desk'}]);
 let afterError;try{await b.query('SELECT 1')}catch(e){afterError=e.code}
 assert.equal(afterError,'25P02');await b.query('ROLLBACK');
 const beforeRetry=(await monitor.query("SELECT column_name FROM information_schema.columns WHERE table_name='migration_orders' AND column_name='delivery_instructions'")).rowCount;
 assert.equal(beforeRetry,0);await a.query('COMMIT');
 await b.query("BEGIN; SET LOCAL lock_timeout='2s'; ALTER TABLE migration_orders ADD COLUMN delivery_instructions text; COMMIT;");
 const afterRetry=(await monitor.query("SELECT column_name FROM information_schema.columns WHERE table_name='migration_orders' AND column_name='delivery_instructions'")).rowCount;
 assert.equal(afterRetry,1);report.ddl_timeout={waiting:ddlWait,laterReadWait,laterRead,locks,failure,failedTransaction:afterError,columnBeforeRetry:beforeRetry,columnAfterRetry:afterRetry};
 await writeFile('docs/article-work/relational-depth-review/migration/observed.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}finally{await Promise.allSettled([a.query('ROLLBACK'),b.query('ROLLBACK')]);await Promise.all([a.end(),b.end(),c.end(),monitor.end()]);}
