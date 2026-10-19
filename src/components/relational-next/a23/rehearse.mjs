// Run on a disposable PostgreSQL 18 server only. Creates and drops one database.
// npm install --ignore-scripts pg@8.23.1
// PG_ADMIN_URL=postgresql://user@localhost/postgres node rehearse.mjs
// Optional PG_DRIVER_MODULE: absolute path or file URL to pg's ESM entry point.
// Optional PG_TEST_DATABASE: fresh name matching rel3_a23_run followed by digits.
// No real fulfilment service is contacted: the sink binds IPv4 loopback only.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const driver = process.env.PG_DRIVER_MODULE;
const { Client } = await import(driver?.startsWith('/') ? pathToFileURL(driver).href : driver || 'pg');
const claimSql = `WITH candidate AS (
  SELECT id FROM work
  WHERE attempt < 3 AND (
    (state = 'pending' AND next_attempt_at <= clock_timestamp()) OR
    (state = 'claimed' AND lease_until <= clock_timestamp()))
  ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE work w SET state = 'claimed', owner = $1,
  attempt = w.attempt + 1,
  lease_until = clock_timestamp() + interval '30 seconds'
FROM candidate c WHERE w.id = c.id
RETURNING w.*`;
const completionSql = `UPDATE work SET state = 'completed', outcome = $4::jsonb,
  owner = NULL, lease_until = NULL
WHERE id = $1 AND state = 'claimed' AND owner = $2
  AND attempt = $3 AND lease_until > clock_timestamp()
RETURNING id`;
const options = { connectionTimeoutMillis: 2000, statement_timeout: 30000,
  lock_timeout: 5000, application_name: 'rel3_a23' };
async function connect(url) { const c = new Client({...options, connectionString:url}); c.on('error',()=>{}); await c.connect(); return c; }
async function send(row, route = 'dedupe') {
  const response = await fetch(`${process.env.SINK_URL}/${route}`, {
    method:'POST', headers:{'content-type':'application/json', 'idempotency-key':row.operation_id},
    body:JSON.stringify(row.payload), signal:AbortSignal.timeout(2000)
  });
  return {status:response.status, body:await response.json()};
}
if (process.env.A23_CHILD) {
  const c = await connect(process.env.PG_WORK_URL);
  if (process.env.A23_CHILD === 'commit-only') {
    await c.query("INSERT INTO orders VALUES (103, 'accepted', 'original')");
    await c.end(); process.exit(21);
  }
  const row = (await c.query(claimSql,['child'])).rows[0];
  assert(row); await c.end();
  if (process.env.A23_CHILD === 'claim-only') process.exit(22);
  const result = await send(row); assert.equal(result.status,200);
  process.exit(23); // Actual worker process exits after acceptance, before completion.
}
const adminUrl = process.env.PG_ADMIN_URL;
if (!adminUrl) throw new Error('Set PG_ADMIN_URL to a disposable PostgreSQL server');
const database = process.env.PG_TEST_DATABASE || `rel3_a23_run${Date.now()}`;
if (!/^rel3_a23_run[0-9]+$/.test(database)) throw new Error('Invalid test database name');
const dbUrl = new URL(adminUrl); dbUrl.pathname = `/${database}`;
const results = {node:process.version, database, checks:[]};
let admin, a, b, server, created = false;
let requests = 0, effects = 0, loseReply = false;
const receipts = new Map();
async function child(mode) {
  const p = spawn(process.execPath,[fileURLToPath(import.meta.url)],{env:{...process.env,
    A23_CHILD:mode, PG_WORK_URL:dbUrl.href},stdio:['ignore','pipe','pipe']});
  let stderr = ''; p.stderr.on('data',chunk=>{stderr+=chunk});
  const timer=setTimeout(()=>p.kill('SIGKILL'),5000);
  const code=await new Promise((resolve,reject)=>{p.on('error',reject);p.on('exit',resolve)});
  clearTimeout(timer); assert.equal(stderr,'');
  assert.equal(code,{'commit-only':21,'claim-only':22,'accept-only':23}[mode]); return code;
}
const resetSink=()=>{requests=0;effects=0;receipts.clear();loseReply=false};
async function reset() {
  await a.query('TRUNCATE work, orders RESTART IDENTITY'); resetSink();
}
async function orderAndWork(commit=true) {
  await a.query('BEGIN');
  await a.query("INSERT INTO orders VALUES (103, 'accepted', 'original')");
  await a.query(`INSERT INTO work (order_id,operation_id,payload)
    VALUES (103, 'fulfil:103:v1', '{"order_id":103,"items":[["mug",1],["tea",2]],"delivery":"original"}')`);
  await a.query(commit?'COMMIT':'ROLLBACK');
}
async function counts() {
  return (await a.query(`SELECT (SELECT count(*)::int FROM orders) AS orders,
    (SELECT count(*)::int FROM work) AS work`)).rows[0];
}
async function expire() { await a.query("UPDATE work SET lease_until = clock_timestamp() - interval '1 second' WHERE state = 'claimed'"); }
async function complete(row,owner,result={receipt:'R103',meaning:'accepted'}) {
  return (await a.query(completionSql,[row.id,owner,row.attempt,JSON.stringify(result)])).rowCount;
}
try {
  admin = await connect(adminUrl);
  results.postgres=(await admin.query('SELECT version() AS version')).rows[0].version;
  await admin.query(`CREATE DATABASE "${database}"`); created=true;
  a=await connect(dbUrl.href); b=await connect(dbUrl.href);
  await a.query(`CREATE TABLE orders (id integer PRIMARY KEY, status text NOT NULL, delivery text NOT NULL);
    CREATE TABLE work (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      order_id integer NOT NULL REFERENCES orders,
      operation_id text NOT NULL UNIQUE,
      payload jsonb NOT NULL,
      state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','claimed','completed','failed','unresolved')),
      attempt integer NOT NULL DEFAULT 0 CHECK(attempt BETWEEN 0 AND 3),
      owner text, lease_until timestamptz,
      next_attempt_at timestamptz NOT NULL DEFAULT clock_timestamp(),
      created_at timestamptz NOT NULL DEFAULT clock_timestamp(), outcome jsonb,
      CHECK ((state = 'claimed') = (owner IS NOT NULL AND lease_until IS NOT NULL))
    );`);
  server=createServer(async(req,res)=>{
    try {
      let raw=''; for await (const chunk of req) {raw+=chunk; if(raw.length>4096) throw new Error('body too large')}
      requests++;
      const key=req.headers['idempotency-key'];
      if(req.url==='/dedupe' && receipts.has(key)) {
        const prior=receipts.get(key);
        res.writeHead(prior.raw===raw?200:409,{'content-type':'application/json'});
        res.end(JSON.stringify(prior.raw===raw?prior.result:{error:'key input mismatch'})); return;
      }
      effects++;
      const result={receipt:`R${effects}`,meaning:'accepted'};
      if(req.url==='/dedupe') receipts.set(key,{raw,result});
      if(loseReply) {loseReply=false;req.socket.destroy();return}
      res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify(result));
    } catch {res.writeHead(500);res.end('{}')}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  process.env.SINK_URL=`http://127.0.0.1:${server.address().port}`;
  await orderAndWork(false); assert.deepEqual(await counts(),{orders:0,work:0});
  await orderAndWork(); assert.deepEqual(await counts(),{orders:1,work:1});
  results.checks.push({case:'atomic intent',rollback:{orders:0,work:0},commit:await counts()});

  await reset(); await child('commit-only');
  assert.deepEqual(await counts(),{orders:1,work:0});
  results.checks.push({case:'process exits after direct order commit',...await counts(),receiverEffects:effects});

  await reset(); await a.query('BEGIN');
  await a.query("INSERT INTO orders VALUES (103,'accepted','original')");
  await send({operation_id:'fulfil:103:v1',payload:{order_id:103}});
  await a.query('ROLLBACK'); assert.deepEqual(await counts(),{orders:0,work:0});assert.equal(effects,1);
  results.checks.push({case:'external acceptance inside rolled-back transaction',...await counts(),receiverEffects:effects});

  await reset(); await orderAndWork(); await a.query('BEGIN');
  const first=(await a.query(claimSql,['A'])).rows[0];
  const competing=await b.query(claimSql,['B']); assert.equal(competing.rowCount,0);
  await a.query('COMMIT');
  assert.equal((await b.query(claimSql,['B'])).rowCount,0);
  results.checks.push({case:'competing claims',lockedCandidateSkipped:competing.rowCount,unexpiredClaimUnavailable:0,attempt:first.attempt});
  await expire(); const takeover=(await b.query(claimSql,['B'])).rows[0];
  const oldResult=await send(first); // Old A still runs after lease expiry.
  const stale=await complete(first,'A',oldResult.body);assert.equal(stale,0);
  const replay=await send(takeover); assert.equal(await complete(takeover,'B',replay.body),1);
  assert.equal(requests,2);assert.equal(effects,1);
  results.checks.push({case:'expired lease and obsolete worker',newAttempt:takeover.attempt,staleCompletionRows:stale,requests,effects,currentCompletionRows:1});

  await reset(); await orderAndWork(); await child('claim-only');
  assert.equal((await a.query('SELECT state FROM work')).rows[0].state,'claimed');assert.equal(effects,0);
  await expire(); const reclaimed=(await b.query(claimSql,['B'])).rows[0];assert.equal(reclaimed.attempt,2);
  results.checks.push({case:'worker exits after claim',reclaimedAttempt:reclaimed.attempt,receiverEffects:effects});

  await reset(); await orderAndWork(); await child('accept-only');
  assert.equal(effects,1);assert.equal((await a.query('SELECT state FROM work')).rows[0].state,'claimed');
  await expire(); const retry=(await b.query(claimSql,['B'])).rows[0]; const recovered=await send(retry);
  assert.equal(await complete(retry,'B',recovered.body),1);assert.equal(effects,1);assert.equal(requests,2);
  results.checks.push({case:'worker exits after acceptance before completion',requests,effects,attempt:retry.attempt,retainedReceipt:recovered.body});

  await reset(); await orderAndWork(); const uncertain=(await a.query(claimSql,['A'])).rows[0];
  loseReply=true; await assert.rejects(send(uncertain)); assert.equal(effects,1);
  const known=await send(uncertain);assert.equal(known.status,200);assert.equal(effects,1);
  const mismatch=await send({...uncertain,payload:{order_id:999}});assert.equal(mismatch.status,409);
  results.checks.push({case:'receiver accepts but loses reply',effects,requests,matchingRetryStatus:known.status,changedInputStatus:mismatch.status});

  await reset(); await orderAndWork();const plain=(await a.query(claimSql,['A'])).rows[0];
  await send(plain,'plain');await send(plain,'plain');assert.equal(effects,2);
  results.checks.push({case:'same identity without receiver deduplication',requests,effects});

  await reset(); await orderAndWork();
  const event=(await a.query('SELECT payload FROM work')).rows[0].payload;
  await a.query("UPDATE orders SET delivery='changed' WHERE id=103");
  assert.equal((await a.query('SELECT delivery FROM orders')).rows[0].delivery,'changed');
  assert.equal(event.delivery,'original');
  results.checks.push({case:'delayed payload vs current state',retainedPayloadDelivery:event.delivery,currentOrderDelivery:'changed'});
  for(let n=1;n<=3;n++) {const row=(await a.query(claimSql,['A'])).rows[0];assert.equal(row.attempt,n);await expire()}
  assert.equal((await a.query(claimSql,['B'])).rowCount,0);
  const exhausted=await a.query(`UPDATE work SET state='unresolved',owner=NULL,lease_until=NULL,
    outcome='{"reason":"attempt cap reached; outcome requires reconciliation"}'
    WHERE state='claimed' AND attempt>=3 AND lease_until <= clock_timestamp() RETURNING id`);
  assert.equal(exhausted.rowCount,1);
  results.checks.push({case:'bounded abandoned claims',attempts:3,fourthClaimRows:0,state:'unresolved'});
  results.sessionOverrides='Client statement_timeout 30s, lock_timeout 5s; no server changes. Lease expiry advanced explicitly in test rows, rather than waiting 30s.';
} finally {
  if(a) {await a.query('ROLLBACK').catch(()=>{});await a.end().catch(()=>{})}
  if(b) await b.end().catch(()=>{});
  if(server) await new Promise(resolve=>server.close(resolve));
  if(admin) {
    if(created) {
      results.remainingSessions=Number((await admin.query('SELECT count(*) FROM pg_stat_activity WHERE datname=$1',[database])).rows[0].count);
      await admin.query(`DROP DATABASE "${database}"`);results.databaseRemoved=true;
    }
    await admin.end();
  }
}
console.log(JSON.stringify(results,null,2));
