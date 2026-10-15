import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const client=new pg.Client({host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'pg_core_lab'});await client.connect();
const q=async sql=>(await client.query(sql)).rows;
const plan=async sql=>(await q(`EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON) ${sql}`))[0]['QUERY PLAN'][0];
try {
 await q(`DROP TABLE IF EXISTS core_jobs; CREATE TABLE core_jobs(job_id integer PRIMARY KEY,tenant_id integer NOT NULL,priority integer NOT NULL,payload text NOT NULL); INSERT INTO core_jobs SELECT n,CASE WHEN n<=45000 THEN 0 ELSE 1+(n%100) END,(n*37)%101,repeat(md5(n::text),5) FROM generate_series(1,50000)n; CREATE INDEX core_jobs_tenant ON core_jobs(tenant_id); ANALYZE core_jobs; PREPARE core_tenant(integer) AS SELECT job_id,payload FROM core_jobs WHERE tenant_id=$1; SET max_parallel_workers_per_gather=0;`);
 await q('SET plan_cache_mode=force_custom_plan');const cold=await plan('EXECUTE core_tenant(1)'),hot=await plan('EXECUTE core_tenant(0)');
 await q('SET plan_cache_mode=force_generic_plan');const genericCold=await plan('EXECUTE core_tenant(1)'),genericHot=await plan('EXECUTE core_tenant(0)');
 await q('RESET plan_cache_mode');const blocking=await plan('SELECT job_id,priority FROM core_jobs ORDER BY priority,job_id LIMIT 5');
 await q('CREATE INDEX core_jobs_priority ON core_jobs(priority,job_id)');const incremental=await plan('SELECT job_id,priority FROM core_jobs ORDER BY priority,job_id LIMIT 5');
 await q("SET work_mem='64kB'");const spill=await plan('SELECT job_id,payload FROM core_jobs ORDER BY payload,job_id');await q('RESET work_mem');
 const answer=await q('SELECT job_id,priority FROM core_jobs ORDER BY priority,job_id LIMIT 5');
 assert.equal(cold.Plan['Actual Rows'],50);assert.equal(hot.Plan['Actual Rows'],45000);assert.equal(hot.Plan['Node Type'],'Seq Scan');assert.equal(genericHot.Plan['Node Type'],'Index Scan');assert.equal(blocking.Plan.Plans[0].Plans[0]['Actual Rows'],50000);assert.equal(incremental.Plan.Plans[0]['Actual Rows'],5);assert.equal(spill.Plan['Sort Space Type'],'Disk');
 writeFileSync(new URL('query-observed.json',import.meta.url),JSON.stringify({cold,hot,genericCold,genericHot,blocking,incremental,spill,answer},null,2));console.log(JSON.stringify({cold:cold.Plan['Node Type'],hot:hot.Plan['Node Type'],genericHot:genericHot.Plan['Node Type'],genericEstimate:genericHot.Plan['Plan Rows'],blockingInput:50000,orderedInput:5,spill:spill.Plan['Sort Method'],answer}));
}finally{await client.end()}
