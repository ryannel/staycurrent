// Disposable PostgreSQL worksheet; Node.js 22+, npm install --ignore-scripts pg@8.23.1.
// PG_URL selects an administrative connection; PG_DRIVER optionally selects an absolute pg module.
// Creates and drops only the new rel3_a24_* database; needs CREATE DATABASE and pgstattuple rights.
import {writeFile} from 'node:fs/promises';
const {Client}=await import(process.env.PG_DRIVER||'pg');
const base=process.env.PG_URL||'postgresql://staycurrent@127.0.0.1:57319/postgres';
const name=process.env.A24_DATABASE||`rel3_a24_run${Date.now()}`;
if(!/^rel3_a24_[a-z0-9_]+$/.test(name))throw Error('Use an isolated rel3_a24_* database');
const admin=new Client({connectionString:base});await admin.connect();
let c,r,created=false;const out={captured:new Date().toISOString(),database:name};
try{
 await admin.query(`CREATE DATABASE ${name}`);created=true;
 const url=new URL(base);url.pathname='/'+name;
 c=new Client({connectionString:url.href});r=new Client({connectionString:url.href});await c.connect();await r.connect();
 out.environment=(await c.query(`SELECT version(),current_setting('block_size') block_size,current_setting('shared_buffers') shared_buffers,current_setting('work_mem') work_mem,current_setting('max_parallel_workers_per_gather') parallel_workers,current_setting('statement_timeout') statement_timeout,current_setting('lock_timeout') lock_timeout,current_setting('default_transaction_isolation') isolation,current_setting('fsync') fsync,current_setting('synchronous_commit') synchronous_commit,current_setting('full_page_writes') full_page_writes`)).rows[0];
 await c.query('CREATE EXTENSION pgstattuple');
 const q=async(sql)=>(await c.query(sql)).rows;
 const plan=async(sql)=>(await c.query('EXPLAIN (ANALYZE,BUFFERS,WAL,TIMING OFF,FORMAT JSON) '+sql)).rows[0]['QUERY PLAN'][0];
 const measure=async(t)=>({size:(await q(`SELECT pg_relation_size('${t}') heap_bytes,pg_indexes_size('${t}') index_bytes,pg_total_relation_size('${t}') total_bytes`))[0],space:(await q(`SELECT * FROM pgstattuple('${t}')`))[0]});
 await c.query(`CREATE TABLE orders(id integer PRIMARY KEY,customer integer,placed_at date,total integer,note text) WITH(autovacuum_enabled=false); ALTER TABLE orders ALTER note SET STORAGE PLAIN; INSERT INTO orders SELECT g,g%100,date '2026-01-01'+(g-1)/100,10,repeat('x',40) FROM generate_series(1,9000) g; CREATE TABLE wide (LIKE orders INCLUDING ALL); ALTER TABLE wide SET(autovacuum_enabled=false); INSERT INTO wide SELECT id,customer,placed_at,total,repeat('x',1800) FROM orders; ANALYZE orders; ANALYZE wide`);
 const lookup=t=>`SELECT id,total FROM ${t} WHERE customer=42 ORDER BY id`;
 out.width={lean:await measure('orders'),wide:await measure('wide'),results_equal:JSON.stringify(await q(lookup('orders')))===JSON.stringify(await q(lookup('wide')))};
 for(const t of ['orders','wide']){await plan(lookup(t));out.width[t+'Plan']=await plan(lookup(t));out.width[t+'NarrowPlan']=await plan(`SELECT id FROM ${t} WHERE customer=42 ORDER BY id`);}
 await c.query(`CREATE TABLE toasted(id integer PRIMARY KEY,note text); ALTER TABLE toasted ALTER note SET STORAGE EXTERNAL; INSERT INTO toasted SELECT g,string_agg(md5((g*1000+k)::text),'') FROM generate_series(1,1000)g CROSS JOIN generate_series(1,256)k GROUP BY g; ANALYZE toasted`);
 out.toast={size:await measure('toasted'),short:await plan('SELECT sum(id) FROM toasted'),materialise:await plan("SELECT sum(length(md5(note))) FROM toasted"),example:await q('SELECT octet_length(note) logical_bytes,pg_column_size(note) stored_value_bytes FROM toasted LIMIT 1')};
 await c.query(`CREATE TABLE changing(id integer PRIMARY KEY,total integer,pad text) WITH(fillfactor=80,autovacuum_enabled=false); INSERT INTO changing SELECT g,10,repeat('x',200) FROM generate_series(1,2000)g`); await c.query('VACUUM changing');
 out.versions={initial:await measure('changing')};
 await r.query('BEGIN ISOLATION LEVEL REPEATABLE READ');out.versions.snapshot_before=(await r.query('SELECT count(*) n,sum(total) total FROM changing')).rows;
 out.versions.update=await plan('UPDATE changing SET total=11');await c.query('DELETE FROM changing WHERE id%4=0');
 out.versions.current=await q('SELECT count(*) n,sum(total) total FROM changing');out.versions.snapshot_after=(await r.query('SELECT count(*) n,sum(total) total FROM changing')).rows;
 await c.query('VACUUM (TRUNCATE FALSE) changing');out.versions.snapshot_held=await measure('changing');
 await r.query('COMMIT');await c.query('VACUUM (TRUNCATE FALSE) changing');out.versions.snapshot_released=await measure('changing');
 await c.query(`INSERT INTO changing SELECT g,11,repeat('x',200) FROM generate_series(2001,2500)g`);out.versions.reuse=await measure('changing');
 await c.query(`CREATE TABLE part_orders(LIKE orders INCLUDING DEFAULTS) PARTITION BY RANGE(placed_at); CREATE TABLE orders_jan PARTITION OF part_orders FOR VALUES FROM('2026-01-01')TO('2026-02-01'); CREATE TABLE orders_feb PARTITION OF part_orders FOR VALUES FROM('2026-02-01')TO('2026-03-01'); CREATE TABLE orders_mar PARTITION OF part_orders FOR VALUES FROM('2026-03-01')TO('2026-04-01'); INSERT INTO part_orders SELECT * FROM orders; ANALYZE part_orders`);
 const range=t=>`SELECT count(*) n,sum(total) total FROM ${t} WHERE placed_at>=date '2026-02-28' AND placed_at<date '2026-03-01'`;
 out.pruning={plainResult:await q(range('orders')),partitionResult:await q(range('part_orders')),plain:await plan(range('orders')),pruned:await plan(range('part_orders')),all:await plan('SELECT count(*),sum(total) FROM part_orders'),allPlain:await plan('SELECT count(*),sum(total) FROM orders')};
 await c.query("SET plan_cache_mode=force_generic_plan; PREPARE recent(date,date) AS SELECT count(*),sum(total) FROM part_orders WHERE placed_at >= $1 AND placed_at < $2");
 out.pruning.genericRuntime=await plan("EXECUTE recent(date '2026-02-28',date '2026-03-01')");
 out.sessionOverrides=['reader: BEGIN ISOLATION LEVEL REPEATABLE READ','writer after other cases: plan_cache_mode=force_generic_plan','fixture tables only: autovacuum_enabled=false','changing: fillfactor=80','orders/wide note STORAGE PLAIN; toasted note STORAGE EXTERNAL; VACUUM TRUNCATE FALSE'];
 out.cleanup='Own sessions closed and own database dropped in finally';
 await writeFile(process.env.A24_OUTPUT||'raw-results.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify(out,(k,v)=>k==='Plans'?v:v,2));
}finally{if(r)await r.end();if(c)await c.end();if(created)await admin.query(`DROP DATABASE ${name}`);await admin.end();}
