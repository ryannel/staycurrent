// Node.js >=22; npm install --ignore-scripts pg@8.23.1 in a fresh directory.
// PG_URL must name a disposable PostgreSQL 18 server with CREATE DATABASE/ROLE.
// PG_DRIVER may point to a pinned pg module; otherwise import the local package.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {Client} = await import(process.env.PG_DRIVER || 'pg');
const connectionString = process.env.PG_URL;
if (!connectionString) throw new Error('Set PG_URL to a disposable PostgreSQL 18 server.');
const suffix = `${Date.now()}_${process.pid}`;
const database = `rel3_a36_run_${suffix}`;
const role = `rel3_a36_observer_${suffix}`;
const output = process.env.EVIDENCE_FILE || 'observation-evidence.json';
await fs.access(output).then(()=>{throw new Error('Refusing to overwrite evidence');},e=>{if(e.code!=='ENOENT')throw e;});
const data={started:new Date().toISOString(),database,role,queries:[],cleanup:{database:false,role:false}};
let admin,actor,observer;
const connect=async(url,name)=>{const c=new Client({connectionString:url,application_name:name,connectionTimeoutMillis:3000,query_timeout:6000});await c.connect();await c.query("SET statement_timeout='5s'; SET lock_timeout='1s'; SET timezone='UTC'");return c;};
const query=async(client,label,sql)=>{const start=new Date().toISOString();try{const r=await client.query(sql);data.queries.push({label,start,sql,rows:r.rows});return r.rows;}catch(e){data.queries.push({label,start,sql,error:{code:e.code,message:e.message}});throw e;}};
const urlFor=(db,user)=>{const u=new URL(connectionString);u.pathname=`/${db}`;if(user){u.username=user;u.password='';}return String(u);};
try{
 admin=await connect(connectionString,'a36-setup');
 await query(admin,'create database',`CREATE DATABASE ${database}`);
 await query(admin,'create monitoring identity',`CREATE ROLE ${role} LOGIN`);
 await admin.end();admin=null;
 actor=await connect(urlFor(database),'a36-fixture');
 observer=await connect(urlFor(database,role),'a36-observer');
 data.runtime=(await query(actor,'environment',`SELECT version(),current_database(),current_user,inet_server_addr(),inet_server_port(),current_setting('shared_buffers') AS shared_buffers,current_setting('work_mem') AS work_mem,current_setting('max_connections') AS max_connections,current_setting('track_counts') AS track_counts,current_setting('track_io_timing') AS track_io_timing,current_setting('fsync') AS fsync,current_setting('synchronous_commit') AS synchronous_commit`))[0];
 await query(actor,'fixture',`CREATE TABLE orders (id integer PRIMARY KEY, note text NOT NULL); INSERT INTO orders SELECT i, repeat(md5(i::text),8) FROM generate_series(1,4000) AS i; ANALYZE orders`);
 const activity=`SELECT pid,application_name,state,wait_event_type,wait_event,query FROM pg_stat_activity WHERE datname=current_database() AND application_name='a36-fixture'`;
 const hidden=await query(observer,'without statistics grant',activity);
 assert.equal(hidden.length,1);assert.equal(hidden[0].state,null);assert.equal(hidden[0].query,'<insufficient privilege>');
 await query(actor,'grant statistics visibility',`GRANT pg_read_all_stats TO ${role}`);
 const visible=await query(observer,'with statistics grant',activity);
 assert.equal(visible[0].state,'idle');assert.notEqual(visible[0].query,'<insufficient privilege>');
 await query(observer,'article activity query',`SELECT clock_timestamp() AS sampled_at,pid,application_name,state,wait_event_type,wait_event,xact_start,backend_xmin FROM pg_stat_activity WHERE datname=current_database() AND pid<>pg_backend_pid()`);
 await assert.rejects(()=>query(observer,'table read still denied','SELECT count(*) FROM orders'),e=>e.code==='42501');
 await assert.rejects(()=>query(observer,'WAL directory still denied','SELECT sum(size) FROM pg_ls_waldir()'),e=>e.code==='42501');
 const sizes=`SELECT pg_relation_size('orders')::text AS heap_bytes,pg_table_size('orders')::text AS table_bytes,pg_indexes_size('orders')::text AS index_bytes,pg_total_relation_size('orders')::text AS total_bytes,pg_database_size(current_database())::text AS database_bytes`;
 data.before=(await query(observer,'allocated sizes before deletion',sizes))[0];
 assert.equal(BigInt(data.before.total_bytes),BigInt(data.before.table_bytes)+BigInt(data.before.index_bytes));
 const counters=`SELECT clock_timestamp() AS sampled_at,xact_commit,xact_rollback,temp_files,temp_bytes,stats_reset FROM pg_stat_database WHERE datname=current_database()`;
 data.counterBefore=(await query(observer,'database counters before work',counters))[0];
 await query(actor,'delete and keep file allocation','DELETE FROM orders WHERE id <= 3000');
 await query(actor,'cleanup without truncation','VACUUM (TRUNCATE false, ANALYZE) orders');
 data.after=(await query(observer,'allocated sizes after deletion',sizes))[0];
 assert.equal(data.after.heap_bytes,data.before.heap_bytes);
 assert.equal((await query(actor,'remaining live rows','SELECT count(*)::int AS rows FROM orders'))[0].rows,1000);
 await query(actor,'bounded temporary sort',`SET work_mem='64kB'; SELECT count(*) FROM (SELECT md5(i::text) AS value FROM generate_series(1,20000) AS i ORDER BY value) AS sorted`);
 await query(actor,'flush only this backend statistics','SELECT pg_stat_force_next_flush()');
 await actor.end();actor=null;
 data.counterAfter=(await query(observer,'database counters after backend exit',counters))[0];
 assert.equal(data.counterAfter.stats_reset,data.counterBefore.stats_reset);
 assert(BigInt(data.counterAfter.temp_bytes)>BigInt(data.counterBefore.temp_bytes));
 assert(Number(data.counterAfter.xact_commit)>Number(data.counterBefore.xact_commit));
 await query(observer,'retained-version observations',`SELECT relname,n_live_tup,n_dead_tup,last_autovacuum,last_vacuum,last_analyze FROM pg_stat_user_tables WHERE relname='orders'`);
 data.passed=true;
}catch(e){data.failure={message:e.message,stack:e.stack};process.exitCode=1;}
finally{
 for(const client of [observer,actor])if(client)await client.end().catch(()=>{});
 if(admin)await admin.end().catch(()=>{});
 admin=await connect(connectionString,'a36-cleanup');
 try{await query(admin,'drop own database',`DROP DATABASE IF EXISTS ${database}`);data.cleanup.database=true;await query(admin,'drop own monitoring identity',`DROP ROLE IF EXISTS ${role}`);data.cleanup.role=true;}finally{await admin.end();}
 data.finished=new Date().toISOString();await fs.writeFile(output,JSON.stringify(data,null,2)+'\n');
 console.log(JSON.stringify({passed:data.passed,output,cleanup:data.cleanup,before:data.before,after:data.after,counterBefore:data.counterBefore,counterAfter:data.counterAfter,failure:data.failure},null,2));
}
