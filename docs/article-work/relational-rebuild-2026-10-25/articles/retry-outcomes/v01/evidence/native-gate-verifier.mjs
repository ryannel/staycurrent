import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import {snippet,payload,accepted,setup,reset,begin,insert,purchase,state} from './protocol.mjs';
const config=JSON.parse(await fs.readFile('/private/tmp/staycurrent-rebuild-retry-outcomes-native-20261025/connection.json','utf8'));
assert.equal(config.host,'127.0.0.1');assert.equal(config.port,58636);assert.equal(config.database,'sc_retry_outcomes');assert.equal(config.user,'sc_retry_outcomes_writer');
const clients=['observe','attempt_a','attempt_b'].map(n=>new pg.Client({...config,application_name:'retry_outcomes_'+n,statement_timeout:10000}));
const [observer,a,b]=clients; const evidence={checks:[]};const schema='retry_outcomes_writer_20261025';let created=false;
try {
 for(const c of clients) {
  await c.connect();
  const identity=(await c.query("SELECT version(), current_database() AS database, current_user AS username, current_setting('cluster_name') AS cluster, current_setting('data_directory') AS data_directory")).rows[0];
  assert.equal(identity.database,'sc_retry_outcomes');assert.equal(identity.username,'sc_retry_outcomes_writer');assert.equal(identity.cluster,'staycurrent-retry-outcomes-20261025');assert.equal(identity.data_directory,'/var/lib/postgresql/18/docker');assert.match(identity.version,/PostgreSQL 18\.6/);
  evidence.identity=identity;
 }
 await observer.query('CREATE SCHEMA '+schema);created=true;
 for(const c of clients)await c.query('SET search_path TO '+schema);
 await observer.query(setup+snippet('schema'));
 const pid=(await b.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
 for(const ending of ['commit','abort']) {
  await observer.query(reset);await a.query(begin);await a.query(insert,[JSON.stringify(payload)]);await purchase(a);
  await b.query(begin);
  let settled=false;const pending=b.query(insert,[JSON.stringify(payload)]).then(r=>{settled=true;return r;});
  let wait;
  for(let i=0;i<50;i++) {
   wait=(await observer.query('SELECT wait_event_type,wait_event FROM pg_stat_activity WHERE pid=$1',[pid])).rows[0];
   if(wait.wait_event_type==='Lock')break;
   await new Promise(resolve=>setTimeout(resolve,50));
  }
  assert.equal(settled,false);assert.equal(wait.wait_event_type,'Lock');
  const before=await state(observer);assert.equal(before.orders.length,0);assert.equal(before.receipts.length,0);assert.deepEqual(before.stock.map(r=>r.stock),[12,1,4]);
  await a.query(ending==='commit'?'COMMIT':'ROLLBACK');
  const gate=await pending;
  if(ending==='commit') {
   assert.equal(gate.rows.length,0);
   const recovered=(await b.query(snippet('recover'))).rows[0];
   assert.deepEqual(recovered.payload,payload);assert.deepEqual(recovered.result,accepted);
  } else {assert.equal(gate.rows.length,1);assert.deepEqual(await purchase(b),accepted);}
  await b.query('COMMIT');const after=await state(observer);assert.deepEqual(after.stock.map(r=>r.stock),[10,0,4]);assert.equal(after.orders.length,1);assert.equal(after.lines.length,2);assert.equal(after.receipts.length,1);assert.equal(after.payments.length,0);
  evidence.checks.push({ending,observed_wait:wait,b_gate_rows:gate.rows.length,committed_state:after});
 }
} finally {
 for(const c of [a,b])await c.query('ROLLBACK').catch(()=>{});
 if(created)await observer.query('DROP SCHEMA '+schema+' CASCADE');
 for(const c of clients)await c.end().catch(()=>{});
}
evidence.cleanup='Owned schema dropped; three owned clients closed; root retains server lifecycle.';
await fs.writeFile(new URL('./native-gate-results.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
