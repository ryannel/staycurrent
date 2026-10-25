import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
const config=JSON.parse(await readFile('/private/tmp/staycurrent-rebuild-outboxes-jobs-native-20261025/connection.json','utf8'));
assert.equal(config.host,'127.0.0.1'); assert.equal(config.port,58641);
assert.equal(config.database,'sc_outboxes_jobs'); assert.equal(config.user,'sc_outboxes_jobs_writer');
const article=await readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const extract=name=>article.match(new RegExp('const '+name+' = `([\\s\\S]*?)`;'))[1];
const ddl=extract('schema'), claim=extract('claim').replace(/^BEGIN;\n/,'').replace(/\nCOMMIT;$/,'');
const finish=extract('finish');
const finishUpdate=finish.slice(finish.indexOf('UPDATE outbox'),finish.lastIndexOf('\nCOMMIT;'));
const schema='oj_'+randomUUID().replaceAll('-','');
const clients=[new pg.Client({...config,application_name:'outbox-author-A',statement_timeout:5000}),new pg.Client({...config,application_name:'outbox-author-B',statement_timeout:5000})];
const [a,b]=clients;
const evidence={runtime:'Native Linux PostgreSQL 18.6; pg 8.23.1',articleSHA256:createHash('sha256').update(article).digest('hex'),checks:[],limits:'No external receiver. Lease expiry predicate tested by moving owned row deadline into the past; fixed 20 October figure times are not measured time. Root owns container lifecycle.'};
const record=(test,result)=>evidence.checks.push({test,result});
let schemaCreated=false;
try {
 for(const client of clients){
  await client.connect();
  const {rows:[identity]}=await client.query("SELECT version(),current_database() AS database,current_user AS role,current_setting('cluster_name') AS cluster,current_setting('data_directory') AS data_directory");
  assert.equal(identity.database,'sc_outboxes_jobs'); assert.equal(identity.role,'sc_outboxes_jobs_writer');
  assert.equal(identity.cluster,'staycurrent-outboxes-jobs-20261025');
  assert.equal(identity.data_directory,'/var/lib/postgresql/18/docker');
  assert.match(identity.version,/PostgreSQL 18\.6/);
  evidence.identity=identity;
 }
 await a.query(`CREATE SCHEMA ${schema}`);schemaCreated=true;
 for(const c of clients) await c.query(`SET search_path TO ${schema}`);
 await a.query(ddl);
 const reset=async()=>{await a.query('TRUNCATE outbox');await a.query("INSERT INTO outbox(work_id,kind,payload,claim_generation) VALUES ('order-103-ack','order_received','{\"order_id\":103,\"total\":\"29.00\"}',6)");};
 const take=async(c,owner,hold=false)=>{await c.query('BEGIN');const r=await c.query(claim,[owner]);if(!hold)await c.query('COMMIT');return r;};
 const done=async(c,owner,gen)=>{await c.query('BEGIN');await c.query('SELECT work_id FROM outbox WHERE work_id=$1 FOR UPDATE',['order-103-ack']);const r=await c.query(finishUpdate,['order-103-ack',owner,gen]);await c.query('COMMIT');return r.rowCount;};
 await reset();
 const reads=await Promise.all(clients.map(c=>c.query("SELECT work_id FROM outbox WHERE state='ready'")));
 assert(reads.every(x=>x.rowCount===1));record('Without an atomic claim, two independent readers select the same ready work',reads.map(x=>x.rows));
 const first=await take(a,'A',true);assert.equal(first.rowCount,1);assert.equal(Number(first.rows[0].claim_generation),7);
 const skipped=await take(b,'B');assert.equal(skipped.rowCount,0);record('B skips the only eligible row while A holds the claim transaction lock',{A:first.rows,B:skipped.rows});
 await a.query('COMMIT');
 await b.query('BEGIN');await b.query('SELECT work_id FROM outbox FOR UPDATE NOWAIT');await b.query('ROLLBACK');
 record('Row lock released at claim commit','B can acquire FOR UPDATE NOWAIT afterwards');
 const unexpired=await take(b,'B');assert.equal(unexpired.rowCount,0);record('Stored unexpired lease excludes a new claim after row lock release',unexpired.rows);
 await a.query('BEGIN');await a.query('SELECT work_id FROM outbox FOR UPDATE');
 const renewal=await a.query("UPDATE outbox SET lease_until=clock_timestamp()+interval '1 minute' WHERE work_id='order-103-ack' AND state='running' AND claimed_by='A' AND claim_generation=7 AND lease_until>clock_timestamp() RETURNING work_id");await a.query('COMMIT');assert.equal(renewal.rowCount,1);record('Current unexpired claim can renew',renewal.rows);
 await a.query("UPDATE outbox SET lease_until=clock_timestamp()-interval '1 second'");
 const expiredDone=await done(a,'A',7);assert.equal(expiredDone,0);
 const expiredRenew=await a.query("UPDATE outbox SET lease_until=clock_timestamp()+interval '1 minute' WHERE work_id='order-103-ack' AND state='running' AND claimed_by='A' AND claim_generation=7 AND lease_until>clock_timestamp() RETURNING work_id");assert.equal(expiredRenew.rowCount,0);
 record('Expired claim cannot finish or renew',{finished:expiredDone,renewed:expiredRenew.rowCount});
 const reclaimed=await take(b,'B');assert.equal(reclaimed.rowCount,1);assert.equal(Number(reclaimed.rows[0].claim_generation),8);record('Expired work is reclaimed under same ID at generation 8',reclaimed.rows);
 await a.query('BEGIN');const unsafe=await a.query("UPDATE outbox SET state='done',claimed_by=NULL,lease_until=NULL WHERE work_id='order-103-ack' RETURNING work_id,claim_generation");assert.equal(unsafe.rowCount,1);await a.query('ROLLBACK');record('Without claim guard, stale A can mark B work done',unsafe.rows);
 assert.equal(await done(a,'A',7),0);assert.equal(await done(b,'B',8),1);record('Owner and generation guard rejects A7 and accepts B8',{A7:0,B8:1});
 await reset();
 const race=await Promise.all([take(a,'A'),take(b,'B')]);assert.equal(race.reduce((n,r)=>n+r.rowCount,0),1);record('Simultaneous claim transactions return one total claim',race.map((r,i)=>({worker:i?'B':'A',rows:r.rows})));
 // Execute the exact delivered one-session download on a fresh connection.
 const download=await readFile(new URL('../public/relational-rebuild/outboxes-jobs/outbox-experiment.sql',import.meta.url),'utf8');
 const c=new pg.Client({...config,application_name:'outbox-author-download',statement_timeout:5000});
 try {await c.connect();const identity=await c.query('SELECT current_database() AS database,current_user AS role');assert.equal(identity.rows[0].database,config.database);assert.equal(identity.rows[0].role,config.user);const results=await c.query(download);record('Exact delivered SQL download passes all assertions',{sha256:createHash('sha256').update(download).digest('hex'),finalResults:results.slice(-3,-1).map(r=>r.rows)});} finally {await c.end();}
 evidence.allAssertionsPassed=true;
} catch(error) {
 evidence.error={message:error.message,code:error.code};process.exitCode=1;
} finally {
 for(const c of clients){try{await c.query('ROLLBACK');}catch{}}
 if(schemaCreated){try{await a.query(`DROP SCHEMA ${schema} CASCADE`);evidence.ownedSchemaRemoved=true;}catch(error){evidence.cleanupError=error.message;process.exitCode=1;}}
 for(const c of clients){try{await c.end();}catch{}}
 await writeFile(new URL('native-results.json',import.meta.url),JSON.stringify(evidence,null,2));
 console.log(JSON.stringify(evidence,null,2));
}
