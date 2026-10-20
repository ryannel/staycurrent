// Node >=22. Install: npm install --ignore-scripts pg@8.23.1 node-pg-migrate@9.0.0
// PG_URL must name a disposable administrative connection with CREATEDB.
// Optional PG_MODULE / MIGRATE_MODULE are file URLs for separately installed packages.
import {writeFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const {Client} = await import(process.env.PG_MODULE || 'pg');
const {runner} = await import(process.env.MIGRATE_MODULE || 'node-pg-migrate');
if (!process.env.PG_URL) throw Error('Set PG_URL explicitly; this creates and drops its own database.');
const evidence=process.env.EVIDENCE || './schema-evidence.json';
const db=`rel3_a29_run${Date.now()}`, out={db, started:new Date().toISOString(), queries:[], observations:{}};
const root=new Client({connectionString:process.env.PG_URL}); await root.connect();
const clients=[]; let created=false, work;
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function query(c,sql,values=[]){const t=performance.now(); try {const r=await c.query(sql,values);out.queries.push({sql,values,ms:performance.now()-t,rows:Array.isArray(r)?r.map(x=>x.rows):r.rows});return r;}catch(e){out.queries.push({sql,values,ms:performance.now()-t,error:{code:e.code,message:e.message}});throw e;}}
async function fail(c,sql,code){try{await query(c,sql);assert.fail('Expected '+code);}catch(e){assert.equal(e.code,code);}}
async function until(test){for(let i=0;i<150;i++){if(await test())return;await delay(20);}throw Error('Bounded observation timed out');}
async function state(c,name){return (await query(c,`SELECT i.indisvalid,i.indisready,i.indislive FROM pg_index i WHERE indexrelid=to_regclass($1)`,[name])).rows;}
try{
 await root.query(`CREATE DATABASE ${db}`); created=true;
 const url=new URL(process.env.PG_URL);url.pathname='/'+db;
 for(const name of ['a29_observer','a29_ddl','a29_workload']){const c=new Client({connectionString:url.href,application_name:name});c.on('error',e=>out.queries.push({connection:name,error:e.message}));await c.connect();clients.push(c);}
 const [a,b,c]=clients;
 out.observations.version=(await query(a,'SELECT version(), current_setting(\'server_version_num\') AS version_num')).rows;
 await query(a,`CREATE TABLE orders(id integer PRIMARY KEY, amount integer NOT NULL, reference text); INSERT INTO orders VALUES (1,-1,'duplicate'),(2,200,'duplicate'),(3,300,'three');`);
 // A holds AccessShare; B queues AccessExclusive; C's later AccessShare queues behind B.
 await query(a,'BEGIN; SELECT * FROM orders;');
 await query(b,"SET lock_timeout='3s'; BEGIN;");
 const blocked=query(b,'ALTER TABLE orders ADD COLUMN queue_probe text').catch(e=>e);
 await until(async()=> (await a.query('SELECT cardinality(pg_blocking_pids($1)) n',[b.processID])).rows[0].n>0);
 const read=query(c,'SELECT count(*) FROM orders');
 await until(async()=> (await a.query('SELECT cardinality(pg_blocking_pids($1)) n',[c.processID])).rows[0].n>0);
 out.observations.queue=(await query(a,`SELECT pid,application_name,state,wait_event_type,wait_event,pg_blocking_pids(pid) blockers FROM pg_stat_activity WHERE datname=current_database() ORDER BY pid`)).rows;
 await query(a,'SELECT pg_cancel_backend($1)',[b.processID]);assert.equal((await blocked).code,'57014');await read;
 await fail(b,'SELECT 1','25P02');await query(b,'ROLLBACK');await query(a,'ROLLBACK');
 // CHECK NOT VALID enforces new rows while retaining an invalid historical row.
 await query(a,'ALTER TABLE orders ADD CONSTRAINT orders_amount_ok CHECK(amount >= 0) NOT VALID');
 await fail(c,"INSERT INTO orders VALUES(4,-2,'bad')",'23514');
 await fail(a,'ALTER TABLE orders VALIDATE CONSTRAINT orders_amount_ok','23514');
 out.observations.invalidCheck=(await query(a,"SELECT conname,convalidated,conenforced FROM pg_constraint WHERE conrelid='orders'::regclass")).rows;
 // A slow check is drill-only: it makes execution cancellation and concurrent writes observable.
 await query(a,`CREATE FUNCTION slow_ok(integer) RETURNS boolean LANGUAGE plpgsql AS $$BEGIN PERFORM pg_sleep(0.03);RETURN $1 >= 0;END$$; CREATE TABLE slow_rows(n integer); INSERT INTO slow_rows SELECT generate_series(1,40); ALTER TABLE slow_rows ADD CONSTRAINT slow_rule CHECK(slow_ok(n)) NOT VALID;`);
 const validating=query(b,'ALTER TABLE slow_rows VALIDATE CONSTRAINT slow_rule').catch(e=>e);
 await until(async()=> (await a.query("SELECT wait_event='PgSleep' yes FROM pg_stat_activity WHERE pid=$1",[b.processID])).rows[0]?.yes);
 await query(c,'INSERT INTO slow_rows VALUES(41)');await fail(c,'INSERT INTO slow_rows VALUES(-1)','23514');
 out.observations.validationLocks=(await query(a,"SELECT mode,granted FROM pg_locks WHERE pid=$1 AND relation='slow_rows'::regclass",[b.processID])).rows;
 await query(a,'SELECT pg_cancel_backend($1)',[b.processID]);assert.equal((await validating).code,'57014');
 out.observations.cancelledValidation=(await query(a,"SELECT convalidated FROM pg_constraint WHERE conname='slow_rule'")).rows;
 await query(b,'ALTER TABLE slow_rows VALIDATE CONSTRAINT slow_rule');
 await query(a,'UPDATE orders SET amount=100 WHERE id=1; ALTER TABLE orders VALIDATE CONSTRAINT orders_amount_ok');
 await query(a,'CREATE TABLE nn(n integer); INSERT INTO nn VALUES(NULL); ALTER TABLE nn ADD CONSTRAINT nn_required NOT NULL n NOT VALID');
 await fail(c,'INSERT INTO nn VALUES(NULL)','23502'); await query(a,'UPDATE nn SET n=1; ALTER TABLE nn VALIDATE CONSTRAINT nn_required');
 // Cancel concurrent build after its catalogue entry has committed, while it waits for A.
 await query(a,'BEGIN; UPDATE orders SET amount=amount WHERE id=3');
 const indexing=query(b,'CREATE UNIQUE INDEX CONCURRENTLY orders_cancelled ON orders(reference)').catch(e=>e);
 await until(async()=> (await a.query('SELECT count(*)::int n FROM pg_stat_progress_create_index WHERE pid=$1',[b.processID])).rows[0].n>0);
 out.observations.indexWait=(await query(a,'SELECT phase,current_locker_pid FROM pg_stat_progress_create_index WHERE pid=$1',[b.processID])).rows;
 await query(a,'SELECT pg_cancel_backend($1)',[b.processID]);assert.equal((await indexing).code,'57014');await query(a,'ROLLBACK');
 out.observations.cancelledIndex=await state(a,'orders_cancelled');await query(a,'DROP INDEX CONCURRENTLY orders_cancelled');
 await fail(b,'CREATE UNIQUE INDEX CONCURRENTLY orders_ref_uq ON orders(reference)','23505');out.observations.failedIndex=await state(a,'orders_ref_uq');
 await query(a,'DROP INDEX CONCURRENTLY orders_ref_uq');await query(a,"UPDATE orders SET reference='one' WHERE id=1");
 await fail(a,'BEGIN; CREATE INDEX CONCURRENTLY impossible ON orders(amount)','25001');await query(a,'ROLLBACK');
 await query(b,'CREATE UNIQUE INDEX CONCURRENTLY orders_ref_uq ON orders(reference)');
 await query(a,'ALTER TABLE orders ADD CONSTRAINT orders_reference_key UNIQUE USING INDEX orders_ref_uq');
 out.observations.attached=(await query(a,"SELECT conname,conindid::regclass::text index_name,convalidated FROM pg_constraint WHERE conname='orders_reference_key'")).rows;
 // A direct integer->bigint rewrite: retain before/after file identity and a per-statement WAL window.
 await query(a,'CREATE TABLE direct_orders(id integer PRIMARY KEY, amount integer NOT NULL); INSERT INTO direct_orders SELECT n,n FROM generate_series(1,20000)n; CREATE INDEX direct_amount ON direct_orders(amount); CREATE VIEW direct_view AS SELECT amount FROM direct_orders;');
 await fail(a,'ALTER TABLE direct_orders ALTER COLUMN amount TYPE bigint USING amount::bigint','0A000');await query(a,'DROP VIEW direct_view');
 out.observations.rewriteBefore=(await query(a,"SELECT pg_relation_filenode('direct_orders') file,pg_total_relation_size('direct_orders') bytes,pg_current_wal_insert_lsn() lsn")).rows[0];
 await query(a,'BEGIN; ALTER TABLE direct_orders ALTER COLUMN amount TYPE bigint USING amount::bigint');
 out.observations.rewriteLocks=(await query(c,"SELECT mode,granted FROM pg_locks WHERE pid=$1 AND relation='direct_orders'::regclass",[a.processID])).rows;
 await query(a,'COMMIT; ANALYZE direct_orders');
 out.observations.rewriteAfter=(await query(a,"SELECT pg_relation_filenode('direct_orders') file,pg_total_relation_size('direct_orders') bytes,pg_wal_lsn_diff(pg_current_wal_insert_lsn(),$1)::text wal_window FROM direct_orders LIMIT 1",[out.observations.rewriteBefore.lsn])).rows[0];
 await query(a,"CREATE TABLE bad_cast(amount text); INSERT INTO bad_cast VALUES('12'),('twelve')");await fail(a,'ALTER TABLE bad_cast ALTER COLUMN amount TYPE bigint USING amount::bigint','22P02');
 // Staged widening: writer protocol/backfill algorithm deliberately belongs to a06/a30.
 await query(a,'ALTER TABLE orders ADD COLUMN amount_v2 bigint; UPDATE orders SET amount_v2=amount::bigint; ALTER TABLE orders ADD CONSTRAINT orders_v2_ok CHECK(amount_v2 IS NOT NULL AND amount_v2 >= 0) NOT VALID; ALTER TABLE orders VALIDATE CONSTRAINT orders_v2_ok;');
 await query(b,'CREATE INDEX CONCURRENTLY orders_amount_v2 ON orders(amount_v2)');
 await query(a,'CREATE VIEW order_amounts AS SELECT id,amount AS old_amount FROM orders');
 await query(a,'BEGIN; ALTER TABLE orders RENAME COLUMN amount TO amount_old; ALTER TABLE orders RENAME COLUMN amount_v2 TO amount; COMMIT');
 out.observations.renameView=(await query(a,"SELECT pg_get_viewdef('order_amounts'::regclass,true) definition")).rows;
 await query(a,'DROP VIEW order_amounts; CREATE VIEW order_amounts AS SELECT id,amount FROM orders');
 out.observations.staged=(await query(a,'SELECT * FROM order_amounts ORDER BY id')).rows;
 // Versioned runner; supplying an existing connection makes timeout inheritance explicit.
 work=await mkdtemp(join(tmpdir(),'a29-migrations-'));
 const logs=[];const options={dbClient:b,dir:work,direction:'up',migrationsTable:'pgmigrations',singleTransaction:true,log:x=>logs.push(x),logger:{debug:x=>logs.push(x),info:x=>logs.push(x),warn:x=>logs.push(x),error:x=>logs.push(x)}};
 await query(b,"SET lock_timeout='250ms'; SET statement_timeout='5s'");
 await writeFile(join(work,'1760000000000-expand.cjs'),`exports.up=pgm=>pgm.sql("CREATE TABLE runner_probe(id integer); CREATE TABLE runner_settings AS SELECT current_setting('lock_timeout') AS lock_timeout, current_setting('statement_timeout') AS statement_timeout;");`);
 await runner(options);out.observations.runnerSettings=(await query(a,'SELECT * FROM runner_settings')).rows;out.observations.runnerHistory=(await query(a,'SELECT id,name,run_on FROM pgmigrations')).rows;
 await writeFile(join(work,'1760000000001-fail.cjs'),`exports.up=pgm=>{pgm.sql('ALTER TABLE runner_probe ADD COLUMN transient integer');pgm.sql('SELECT 1/0');};`);
 try{await runner(options);assert.fail('runner should fail');}catch(e){out.observations.runnerFailure=e.message;}
 out.observations.runnerRollback=(await query(a,"SELECT column_name FROM information_schema.columns WHERE table_name='runner_probe'")).rows;
 await rm(join(work,'1760000000001-fail.cjs'));
 await writeFile(join(work,'1760000000002-separate.cjs'),`exports.up=pgm=>{pgm.noTransaction();pgm.sql('CREATE INDEX CONCURRENTLY runner_index ON runner_probe(id)');pgm.sql('SELECT 1/0');};`);
 try{await runner(options);}catch(e){out.observations.runnerSeparateFailure=e.message;}
 out.observations.runnerSeparateIndex=await state(a,'runner_index');out.observations.runnerSeparateHistory=(await query(a,'SELECT name FROM pgmigrations')).rows;
 await rm(join(work,'1760000000002-separate.cjs'));await query(a,'DROP INDEX runner_index');
 await writeFile(join(work,'1760000000003-slow.cjs'),`exports.up=pgm=>pgm.sql('SELECT pg_sleep(0.6); ALTER TABLE runner_probe ADD COLUMN ready boolean;');`);
 const first=runner(options);await until(async()=> (await a.query("SELECT wait_event='PgSleep' yes FROM pg_stat_activity WHERE pid=$1",[b.processID])).rows[0]?.yes);
 try{await runner({...options,dbClient:c});assert.fail('second runner should fail');}catch(e){out.observations.runnerCollision=e.message;}await first;
 // Suppress the completion response after server COMMIT, then lose the connection.
 // This simulates an acknowledgement lost at the client boundary; it is not a TCP-fault test.
 await writeFile(join(work,'1760000000004-unseen.cjs'),`exports.up=pgm=>pgm.sql('ALTER TABLE runner_probe ADD COLUMN unseen integer;');`);
 const original=b.query.bind(b);let lost=false;
 b.query=async(...args)=>{const r=await original(...args);if(!lost && /^COMMIT;?$/.test(String(typeof args[0]==='object' ? args[0].text : args[0]).trim().toUpperCase())){lost=true;await b.end();throw Error('Drill: committed response withheld, connection closed');}return r;};
 try{await runner(options);}catch(e){out.observations.runnerLostReply=e.message;}
 out.observations.runnerUncertain=(await query(a,"SELECT name FROM pgmigrations ORDER BY id; SELECT column_name FROM information_schema.columns WHERE table_name='runner_probe' ORDER BY ordinal_position")).map(x=>x.rows);
 assert(lost);out.observations.runnerLogs=logs;
 out.completed=true;
}catch(e){out.failure={message:e.message,stack:e.stack};process.exitCode=1;}
finally{
 for(const c of clients){try{await c.end();}catch{}}
 if(created){await root.query(`DROP DATABASE ${db}`);out.cleanedDatabase=true;}
 await root.end();if(work)await rm(work,{recursive:true,force:true});
 await writeFile(evidence,JSON.stringify(out,null,2),{flag:'wx'});
 console.log(JSON.stringify({completed:out.completed,failure:out.failure,evidence,cleanedDatabase:out.cleanedDatabase}));
}
