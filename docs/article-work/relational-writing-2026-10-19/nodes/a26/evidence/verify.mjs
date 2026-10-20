// Node.js >=22; npm install --ignore-scripts pg@8.23.1
// PG_URL must name a disposable server and a role with CREATEDB.
// Optional PG_DRIVER is a file URL for a separately installed pg ESM module.
import {writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
const {Client}=await import(process.env.PG_DRIVER || 'pg');
const adminUrl=process.env.PG_URL || 'postgresql://staycurrent@127.0.0.1:57319/postgres';
const database=`rel3_a26_run${Date.now()}`;
const config=new URL(adminUrl);config.pathname='/'+database;
const admin=new Client({connectionString:adminUrl});
const out={database,report:null,settings:null,captures:{},results:{},workloads:[]};
const report=`SELECT c.customer_id, sum(l.quantity * l.unit_price) AS spent
FROM customers c
JOIN orders o USING (customer_id)
JOIN order_lines l USING (order_id)
WHERE c.region = $1
  AND o.placed_at >= DATE '2026-01-01'
  AND o.placed_at < DATE '2027-01-01'
GROUP BY c.customer_id
ORDER BY spent DESC NULLS LAST, c.customer_id
LIMIT 10`;
out.report=report;
let main;
const clients=[];
const connect=async()=>{const c=new Client({connectionString:config.href});await c.connect();clients.push(c);await c.query("SET statement_timeout='15s'; SET lock_timeout='2s'; SET max_parallel_workers_per_gather=0; SET work_mem='4MB'; SET jit=off; SET timezone='UTC'");return c;};
const plan=async(c,key,region,mode='auto',timing=false)=>{
 await c.query(`SET plan_cache_mode=${mode}`);
 await c.query('DEALLOCATE ALL');
 await c.query(`PREPARE diagnostic_report(text) AS ${report}`);
 const sql=`EXPLAIN (ANALYZE, BUFFERS, SETTINGS, TIMING ${timing?'ON':'OFF'}, FORMAT JSON) EXECUTE diagnostic_report('${region}')`;
 out.captures[key]=(await c.query(sql)).rows[0]['QUERY PLAN'][0];
 out.results[key]=(await c.query(`EXECUTE diagnostic_report('${region}')`)).rows;
 await c.query('DEALLOCATE ALL');await c.query('SET plan_cache_mode=auto');
};
const stats=async()=>({relation:(await main.query("SELECT reltuples, relpages FROM pg_class WHERE oid='customers'::regclass")).rows,columns:(await main.query("SELECT attname,null_frac,n_distinct,most_common_vals::text,most_common_freqs,histogram_bounds::text,correlation FROM pg_stats WHERE tablename='customers' ORDER BY attname")).rows,counts:(await main.query('SELECT region,country,count(*) FROM customers GROUP BY region,country ORDER BY region,country')).rows});
const mixed=async(phase,trial)=>{
 const sessions=await Promise.all([connect(),connect()]);
 const samples=[];let errors=0;
 const start=performance.now();
 await Promise.all(sessions.map(async(c,ci)=>{
  // Name causes pg to prepare once per physical connection. Reuse on that connection.
  for(let i=0;i<60;i++){
   const kind=i%6===0?(i%30===0?'island':'north'):(i%3===0?'change':'lookup');
   const t=performance.now();
   try{
    if(kind==='north'||kind==='island')await c.query({name:`report_${phase}_${trial}`,text:report,values:[kind]});
    else if(kind==='change')await c.query('UPDATE orders SET revision=revision+1 WHERE order_id=$1',[1000+ci*100+i]);
    else await c.query('SELECT order_id FROM orders WHERE customer_id=$1 ORDER BY order_id LIMIT 10',[1000+ci*100+i]);
    samples.push({kind,ms:performance.now()-t});
   }catch(e){errors++;throw e;}
  }
 }));
 const elapsed=performance.now()-start;
 const summary={};for(const kind of ['north','island','lookup','change']){
  const times=samples.filter(s=>s.kind===kind).map(s=>s.ms).sort((a,b)=>a-b);
  summary[kind]={completed:times.length,p50:times[Math.ceil(times.length*.5)-1],p95:times[Math.ceil(times.length*.95)-1]};
 }
 const prepared=await Promise.all(sessions.map(async c=>(await c.query("SELECT name,generic_plans,custom_plans FROM pg_prepared_statements WHERE name LIKE 'report_%'")).rows));
 out.workloads.push({phase,trial,elapsed,completed:samples.length,errors,perSecond:samples.length*1000/elapsed,summary,prepared,samples});
 // Remove ended clients from cleanup list.
 for(const c of sessions){await c.end();clients.splice(clients.indexOf(c),1);}
};
await admin.connect();
try{
 await admin.query(`CREATE DATABASE ${database}`);
 main=await connect();
 out.settings=(await main.query("SELECT version(),current_setting('block_size') block_size,current_setting('shared_buffers') shared_buffers,current_setting('work_mem') work_mem,current_setting('max_parallel_workers_per_gather') parallel,current_setting('track_io_timing') io_timing,current_setting('jit') jit,current_setting('default_statistics_target') target")).rows[0];
 await main.query(`CREATE TABLE customers(customer_id integer PRIMARY KEY,region text, country text) WITH (autovacuum_enabled=false);
 CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,placed_at date NOT NULL,revision integer NOT NULL DEFAULT 0) WITH (autovacuum_enabled=false);
 CREATE TABLE order_lines(order_id integer REFERENCES orders,line_no integer,quantity integer NOT NULL,unit_price numeric(10,2),PRIMARY KEY(order_id,line_no)) WITH (autovacuum_enabled=false);
 INSERT INTO customers SELECT i,CASE WHEN i<=10 THEN 'north' WHEN i>9990 THEN 'island' ELSE 'south' END,CASE WHEN i<=10 THEN 'N' WHEN i>9990 THEN 'I' ELSE 'S' END FROM generate_series(1,10000) g(i);
 INSERT INTO orders SELECT i,1+(i-1)%10000,DATE '2026-01-01'+((i-1)/10000),0 FROM generate_series(1,100000) g(i);
 INSERT INTO order_lines SELECT i,j,1,10.00::numeric FROM generate_series(1,100000) g(i) CROSS JOIN generate_series(1,3) h(j);
 CREATE INDEX orders_customer ON orders(customer_id);
 ANALYZE customers; ANALYZE orders; ANALYZE order_lines;`);
 out.initialStats=await stats();
 await main.query("UPDATE customers SET region='north',country='N' WHERE customer_id BETWEEN 11 AND 8000");
 out.beforeStats=await stats();
 for(const region of ['north','island'])await plan(main,`before_${region}`,region,'force_custom_plan');
 await plan(main,'before_timed','north','force_custom_plan',true);
 // Short, closed-loop trials: fixed input order and operation mix in both phases.
 for(let trial=1;trial<=3;trial++)await mixed('before',trial);
 const t=performance.now();await main.query('ANALYZE customers');out.analyzeClientMs=performance.now()-t;
 out.afterStats=await stats();
 for(const region of ['north','island']){
  await plan(main,`after_${region}`,region,'force_custom_plan');
  await plan(main,`generic_${region}`,region,'force_generic_plan');
 }
 await plan(main,'after_timed','north','force_custom_plan',true);
 out.sameTablePair=(await main.query("EXPLAIN (ANALYZE, TIMING OFF, FORMAT JSON) SELECT customer_id FROM customers WHERE region='island' AND country='I'")).rows[0]['QUERY PLAN'][0];
 for(let trial=1;trial<=3;trial++)await mixed('after',trial);
 // Verify pg's named parameter path directly; observe automatic plan counters.
 await main.query('DEALLOCATE ALL');
 out.application=[];
 for(const region of ['north','island','north','island','north','island','north','island']){
  const start=performance.now();const r=await main.query({name:'app_report',text:report,values:[region]});
  out.application.push({region,ms:performance.now()-start,rows:r.rows,counters:(await main.query("SELECT generic_plans,custom_plans FROM pg_prepared_statements WHERE name='app_report'")).rows[0]});
 }
 // A separate correctness fixture exercises values absent from the large regular data.
 await main.query(`CREATE SCHEMA correctness; SET search_path=correctness;
 CREATE TABLE customers(customer_id int PRIMARY KEY,region text);
 CREATE TABLE orders(order_id int PRIMARY KEY,customer_id int,placed_at date);
 CREATE TABLE order_lines(order_id int,line_no int,quantity int,unit_price numeric(10,2));
 INSERT INTO customers VALUES(1,'north'),(2,'north'),(3,'north'),(4,NULL),(5,'north'),(6,'north');
 INSERT INTO orders VALUES(11,1,'2026-01-01'),(12,1,'2026-01-01'),(21,2,'2026-01-01'),(31,3,'2026-01-01'),(41,4,'2026-01-01'),(51,5,'2025-12-31'),(61,6,'2027-01-01');
 INSERT INTO order_lines VALUES(11,1,1,10),(11,2,1,10),(12,1,1,NULL),(21,1,2,10),(31,1,1,NULL),(41,1,1,100),(51,1,1,100),(61,1,1,100);`);
 out.correctness=(await main.query(report,['north'])).rows;
 if(JSON.stringify(out.correctness)!==JSON.stringify([{customer_id:1,spent:'20.00'},{customer_id:2,spent:'20.00'},{customer_id:3,spent:null}]))throw Error('Correctness fixture mismatch');
 for(const region of ['north','island'])if(JSON.stringify(out.results[`before_${region}`])!==JSON.stringify(out.results[`after_${region}`])||JSON.stringify(out.results[`after_${region}`])!==JSON.stringify(out.results[`generic_${region}`]))throw Error('Changed report result');
 out.verified=true;
}finally{
 for(const c of clients)await c.end().catch(()=>{});
 await admin.query(`DROP DATABASE IF EXISTS ${database}`).then(()=>out.cleaned=true).catch(e=>out.cleanupError=e.message);
 await admin.end();
 await writeFile(new URL('raw-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
}
console.log(JSON.stringify({database,verified:out.verified,cleaned:out.cleaned,captures:Object.fromEntries(Object.entries(out.captures).map(([k,v])=>[k,{ms:v['Execution Time'],hits:v.Plan['Shared Hit Blocks'],reads:v.Plan['Shared Read Blocks'],temp:v.Plan['Temp Read Blocks']}])) ,workloads:out.workloads.map(({phase,trial,summary,perSecond})=>({phase,trial,summary,perSecond}))},null,2));
