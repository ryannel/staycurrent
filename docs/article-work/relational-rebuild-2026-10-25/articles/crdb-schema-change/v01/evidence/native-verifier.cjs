'use strict';
// Root executes only after guarding the disposable container in input/native-runtime.json.
const fs = require('node:fs');
const {Client} = require('/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js');
const runtime = JSON.parse(fs.readFileSync(__dirname+'/../input/native-runtime.json','utf8'));
const events=[]; const clients=[];
const emit=(name,data)=>{const e={name,data}; events.push(e); console.log(JSON.stringify(e));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function connect(suffix){const c=new Client({...runtime.connection,application_name:runtime.connection.application_name+'-'+suffix,connectionTimeoutMillis:5000,query_timeout:45000});await c.connect();clients.push(c);c.on('notice',n=>emit('notice-'+suffix,{message:n.message,detail:n.detail}));await c.query('SET allow_unsafe_internals=true');const r=await c.query('SELECT crdb_internal.cluster_id()::STRING AS cluster_id, current_database() AS db, current_user AS principal, version()');const x=r.rows[0]; if(x.cluster_id!==runtime.cluster_id||x.db!==runtime.database||x.principal!==runtime.user||!x.version.includes('v26.2.8'))throw Error('Fixture identity mismatch');await c.query("SET statement_timeout='40s'");return c;}
async function q(c,label,sql,params){const r=await c.query(sql,params);emit(label,{sql,rows:r.rows,rowCount:r.rowCount});return r;}
async function expectError(c,label,sql){try{await c.query(sql);throw Error('Expected SQL error was absent: '+label);}catch(e){if(e.message.startsWith('Expected SQL'))throw e;emit(label,{sql,code:e.code,message:e.message,detail:e.detail});}}
async function jobs(c,index){return (await c.query("SELECT job_id::STRING, job_type, description, status, running_status, fraction_completed, error FROM [SHOW JOBS] WHERE description LIKE $1 ORDER BY created DESC",['%'+index+'%'])).rows;}
async function build(c,observer,writer,name,{cancel=false}={}){
 let done=false;let error;const promise=c.query(`CREATE INDEX ${name} ON jobs_lab.workload(price) STORING(payload)`).then(r=>{emit(name+'-client',{rowCount:r.rowCount});done=true;},e=>{error={code:e.code,message:e.message};emit(name+'-client-error',error);done=true;});
 let writes=0;let requested=false;let samples=[];
 for(let n=0;n<150&&!done;n++){
  const js=await jobs(observer,name); if(js.length&&JSON.stringify(js)!==JSON.stringify(samples.at(-1))){samples.push(js);emit(name+'-job',js);}
  if(writes<10){await writer.query('UPDATE jobs_lab.workload SET price=price+1 WHERE id=$1',[7+writes]);writes++;}
  if(cancel&&!requested&&js[0]&&['running','pending','retry-running'].includes(js[0].status)){
   requested=true;try{await q(observer,name+'-cancel-request',`CANCEL JOB ${js[0].job_id}`);}catch(e){emit(name+'-cancel-error',{code:e.code,message:e.message});}
  }
  await sleep(100);
 }
 if(!done){emit(name+'-bound-reached',{});await c.end();}
 await promise;emit(name+'-summary',{writes,requested,error: error||null,final:await jobs(observer,name)});
 return {error,requested};
}
(async()=>{
 const a=await connect('ddl'),b=await connect('observer'),w=await connect('writer');
 await q(a,'identity','SELECT crdb_internal.cluster_id()::STRING, current_database(), current_user, version()');
 await q(a,'create-schema','CREATE SCHEMA jobs_lab');
 await q(a,'products-create',`CREATE TABLE jobs_lab.products(product_id STRING PRIMARY KEY,name STRING NOT NULL,price DECIMAL(8,2) NOT NULL,stock INT NOT NULL)`);
 await q(a,'products-seed',`INSERT INTO jobs_lab.products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4)`);
 await q(a,'add-column','ALTER TABLE jobs_lab.products ADD COLUMN price_hundredths INT');
 await q(a,'added-column-values','SELECT product_id, price, price_hundredths FROM jobs_lab.products ORDER BY product_id');
 await q(w,'bridge-update',"UPDATE jobs_lab.products SET price=22.00,price_hundredths=2200 WHERE product_id='P7'");
 await q(a,'stale-guard',"UPDATE jobs_lab.products SET price_hundredths=2000 WHERE product_id='P7' AND price=20.00 AND price_hundredths IS NULL");
 await q(a,'price-backfill','UPDATE jobs_lab.products SET price_hundredths=(price*100)::INT WHERE price_hundredths IS NULL');
 await q(a,'price-acceptance','SELECT count(*) FILTER (WHERE price_hundredths IS NULL) AS missing, count(*) FILTER (WHERE price_hundredths IS DISTINCT FROM price*100) AS mismatched FROM jobs_lab.products');
 await q(a,'prices-final','SELECT * FROM jobs_lab.products ORDER BY product_id');
 await a.query('BEGIN');await a.query("UPDATE jobs_lab.products SET price_hundredths=220 WHERE product_id='P7'");await q(a,'bad-units-counterexample','SELECT count(*) FILTER (WHERE price_hundredths IS NULL) AS missing,count(*) FILTER (WHERE price_hundredths IS DISTINCT FROM price*100) AS mismatched FROM jobs_lab.products');await a.query('ROLLBACK');
 await q(a,'customers-create','CREATE TABLE jobs_lab.customers(customer_id INT PRIMARY KEY,loyalty_code STRING)');
 await q(a,'customers-seed',"INSERT INTO jobs_lab.customers VALUES(1,'TEA-7'),(2,'TEA-7'),(3,NULL)");
 await q(a,'duplicate-preflight','SELECT loyalty_code,count(*) FROM jobs_lab.customers WHERE loyalty_code IS NOT NULL GROUP BY loyalty_code HAVING count(*)>1');
 await expectError(a,'duplicate-build','CREATE UNIQUE INDEX customers_loyalty_bad ON jobs_lab.customers(loyalty_code)');
 emit('duplicate-job',await jobs(b,'customers_loyalty_bad'));
 await q(a,'indexes-after-failure','SHOW INDEX FROM jobs_lab.customers');
 await q(a,'correct-mistaken-assignment',"UPDATE jobs_lab.customers SET loyalty_code=NULL WHERE customer_id=2");
 await q(a,'valid-unique-build','CREATE UNIQUE INDEX customers_loyalty_unique ON jobs_lab.customers(loyalty_code)');
 emit('unique-job',await jobs(b,'customers_loyalty_unique'));
 await expectError(w,'caller-duplicate',"UPDATE jobs_lab.customers SET loyalty_code='TEA-7' WHERE customer_id=2");
 await q(w,'caller-new-code',"UPDATE jobs_lab.customers SET loyalty_code='TEA-8' WHERE customer_id=2");
 await q(w,'caller-unassign',"UPDATE jobs_lab.customers SET loyalty_code=NULL WHERE customer_id=2");
 await q(a,'customers-final','SELECT * FROM jobs_lab.customers ORDER BY customer_id');
 await q(a,'workload-create','CREATE TABLE jobs_lab.workload(id INT PRIMARY KEY,price INT NOT NULL,payload STRING NOT NULL)');
 await q(a,'workload-seed',"INSERT INTO jobs_lab.workload SELECT i,i%1000,repeat('x',128) FROM generate_series(1,40000) AS g(i)");
 await build(a,b,w,'workload_price_ready');
 await q(a,'primary-totals','SELECT count(*),sum(price) FROM jobs_lab.workload@workload_pkey');
 await q(a,'index-totals','SELECT count(*),sum(price) FROM jobs_lab.workload@workload_price_ready');
 await q(a,'indexed-updated-rows','SELECT id,price FROM jobs_lab.workload@workload_price_ready WHERE id BETWEEN 7 AND 16 ORDER BY id');
 await build(a,b,w,'workload_price_abandoned',{cancel:true});
 await q(a,'workload-indexes','SHOW INDEX FROM jobs_lab.workload');
 emit('all-own-jobs',(await b.query("SELECT job_id::STRING,job_type,description,status,running_status,fraction_completed,error FROM [SHOW JOBS] WHERE description LIKE '%jobs_lab%' ORDER BY created")).rows);
})().catch(e=>{emit('fatal',{code:e.code,message:e.message,stack:e.stack});process.exitCode=1;}).finally(async()=>{await Promise.allSettled(clients.map(c=>c.end()));fs.writeFileSync(__dirname+'/native-results.json',JSON.stringify(events,null,2)+'\n');});
