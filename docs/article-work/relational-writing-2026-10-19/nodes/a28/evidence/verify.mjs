// Node.js >=22; npm install --ignore-scripts pg@8.23.1
// PG_URL must address a disposable server with CREATE DATABASE permission.
// PG_DRIVER is an optional file: URL to an already installed pg module.
import {writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
const {Client}=await import(process.env.PG_DRIVER || 'pg');
const adminUrl=process.env.PG_URL || 'postgresql://staycurrent@127.0.0.1:57319/postgres';
const db=`rel3_a28_run${Date.now()}`;
const url=new URL(adminUrl);url.pathname='/'+db;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clients=[];
const raw={captured:new Date().toISOString(),database:db,conditions:{durationMs:2000,gapMs:12,maxOutstanding:80,maxActive:4,sampleMs:40,mix:'4 hot-account updates then 1 report',arrivalRates:[40,120],limits:[1,2,4]},runs:[]};
const admin=new Client({connectionString:adminUrl,connectionTimeoutMillis:3000});
const report='SELECT account_id, sum(total)::text AS spent FROM orders GROUP BY account_id ORDER BY sum(total) DESC, account_id LIMIT 10';
const update='UPDATE accounts SET revision=revision+1 WHERE account_id=1 RETURNING revision';
async function connect(name){const c=new Client({connectionString:url.href,application_name:name,connectionTimeoutMillis:3000});await c.connect();clients.push(c);await c.query("SET statement_timeout='1500ms'; SET lock_timeout='1000ms'; SET idle_in_transaction_session_timeout='3s'; SET jit=off; SET max_parallel_workers_per_gather=0; SET timezone='UTC'");return c;}
const percentile=(xs,p)=>xs.length?[...xs].sort((a,b)=>a-b)[Math.ceil(xs.length*p)-1]:null;
try{
 await admin.connect();await admin.query(`CREATE DATABASE ${db}`);
 const observer=await connect('a28-observer');
 raw.runtime=(await observer.query("SELECT version(), current_setting('shared_buffers') AS shared_buffers, current_setting('work_mem') AS work_mem, current_setting('fsync') AS fsync, current_setting('synchronous_commit') AS synchronous_commit, current_setting('full_page_writes') AS full_page_writes, current_setting('max_parallel_workers') AS max_parallel_workers")).rows[0];
 await observer.query('CREATE TABLE accounts(account_id integer PRIMARY KEY, revision integer NOT NULL DEFAULT 0 CHECK(revision>=0)); INSERT INTO accounts SELECT g,0 FROM generate_series(1,100) g; CREATE TABLE orders(order_id integer PRIMARY KEY, account_id integer NOT NULL REFERENCES accounts, total numeric(10,2) NOT NULL); INSERT INTO orders SELECT g,1+(g%100),(g%1000)::numeric/100 FROM generate_series(1,20000) g; ANALYZE');
 raw.reportPlan=(await observer.query('EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON) '+report)).rows[0]['QUERY PLAN'];
 raw.referenceReport=(await observer.query(report)).rows;
 // Close the administration connection during runs: five own connections total.
 await admin.end();
 const workers=[];for(let i=0;i<4;i++)workers.push(await connect('a28-worker-'+i));
 // Warm all statement/data paths without deliberate lock contention.
 for(let i=0;i<20;i++)await workers[i%4].query(i%5===4?report:update);
 raw.isolated=[];
 for(let i=0;i<5;i++)for(const kind of ['update','report']){const t=performance.now();if(kind==='update'){await workers[0].query('BEGIN');await workers[0].query(update);await sleep(12);await workers[0].query('COMMIT');}else await workers[0].query(report);raw.isolated.push({kind,ms:performance.now()-t});}
 async function run(phase,limit,rate,label='sweep'){
  await observer.query('UPDATE accounts SET revision=0');
  const start=performance.now(),records=[],samples=[],queue=[],free=workers.slice(0,limit);
  let active=0,finished=0,offering=true,preparing=0,sampling=true;
  const relative=()=>performance.now()-start;
  async function execute(job,c){
   active++;job.admitted=relative();
   try{
    job.dbStart=relative();
    if(job.kind==='update'){
     await c.query('BEGIN');await c.query(update);
     if(phase==='held')await sleep(12);
     await c.query('COMMIT');
    }else{const answer=(await c.query(report)).rows;if(JSON.stringify(answer)!==JSON.stringify(raw.referenceReport))throw new Error('report answer changed');}
    job.success=true;
   }catch(e){job.error=e.code||e.message;await c.query('ROLLBACK').catch(()=>{});}
   job.end=relative();active--;finished++;free.push(c);pump();
  }
  function pump(){while(queue.length&&free.length)void execute(queue.shift(),free.shift());}
  async function offer(job){
   records.push(job);job.offered=relative();
   if(queue.length+active+preparing>=80){job.rejected=true;job.end=relative();return;}
   if(phase==='outside'&&job.kind==='update'){preparing++;await sleep(12);preparing--;}
   job.queued=relative();queue.push(job);pump();
  }
  let sampleError;
  const sampler=(async()=>{while(sampling){const t=relative();const activity=(await observer.query("SELECT pid, application_name, state, wait_event_type, wait_event, pg_blocking_pids(pid) AS blockers FROM pg_stat_activity WHERE datname=current_database() AND application_name LIKE 'a28-worker-%' ORDER BY pid")).rows;samples.push({t,queue:queue.length,active,preparing,finished,activity});await sleep(40);}})().catch(error=>{sampleError=error;sampling=false;});
  const count=rate*2;
  // Intended schedule is independent of completion. Record scheduler delay too.
  for(let i=0;i<count;i++){const intended=i*1000/rate;await sleep(Math.max(0,intended-relative()));void offer({id:i,kind:i%5===4?'report':'update',intended});}
  offering=false;const offerEnd=relative();
  let stopReason;
  while(active||queue.length||preparing){
   if(relative()>6000){stopReason='drain exceeded six-second stop';for(const job of queue.splice(0)){job.error='drain-stop';job.end=relative();}break;}
   await sleep(10);
  }
  // Running statements retain their bounded server timeout while queued work stops.
  while(active||preparing)await sleep(10);
  sampling=false;await sampler;
  if(stopReason||sampleError){raw.runs.push({summary:{phase,limit,rate,label,stopReason,sampleError:sampleError?.message},records,samples});throw new Error(stopReason||sampleError.message);}
  const end=relative(),revision=(await observer.query('SELECT revision FROM accounts WHERE account_id=1')).rows[0].revision;
  const success=records.filter(x=>x.success);if(revision!==success.filter(x=>x.kind==='update').length)throw new Error('lost or extra revision');
  const summary={phase,limit,rate,label,offered:count,admitted:records.filter(x=>x.admitted!==undefined).length,rejected:records.filter(x=>x.rejected).length,failures:records.filter(x=>x.error).length,completedWithinOffer:success.filter(x=>x.end<=2000).length,outstandingAt2s:records.filter(x=>!x.rejected&&x.intended<2000&&x.end>2000).length,drainMs:Math.max(0,Math.max(...records.map(x=>x.end))-2000),totalCompleted:success.length,offerEnd,end,revision,classes:{}};
  for(const kind of ['update','report']){const jobs=success.filter(x=>x.kind===kind);summary.classes[kind]={count:jobs.length,p50:percentile(jobs.map(x=>x.end-x.intended),.5),p95:percentile(jobs.map(x=>x.end-x.intended),.95),p99:percentile(jobs.map(x=>x.end-x.intended),.99),dbP95:percentile(jobs.map(x=>x.end-x.dbStart),.95),queueP95:percentile(jobs.map(x=>x.admitted-x.queued),.95),schedulerP95:percentile(jobs.map(x=>x.offered-x.intended),.95)};}
  raw.runs.push({summary,records,samples});console.log(JSON.stringify(summary));
 }
 // Alternate phases at each point rather than putting every before run first.
 for(const rate of [40,120])for(const limit of [1,2,4])for(const phase of ['held','outside'])await run(phase,limit,rate);
 // Repeat only the critical high-demand four-slot comparison.
 for(const phase of ['held','outside'])await run(phase,4,120,'critical-repeat');
 raw.cleaned=true;
}catch(e){raw.error={message:e.message,code:e.code};throw e;}
finally{
 await Promise.allSettled(clients.map(c=>c.end()));
 const cleanup=new Client({connectionString:adminUrl,connectionTimeoutMillis:3000});
 try{await cleanup.connect();await cleanup.query(`DROP DATABASE IF EXISTS ${db}`);raw.dropped=true;}finally{await cleanup.end();await admin.end().catch(()=>{});await writeFile(new URL('./raw-results.json',import.meta.url),JSON.stringify(raw,null,2)+'\n');}
}
