import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';

const base = new URL('../', import.meta.url);
const config = JSON.parse(await fs.readFile('/private/tmp/staycurrent-rebuild-locks-native-20261025/connection.json','utf8'));
assert.equal(config.host,'127.0.0.1'); assert.equal(config.port,55747);
assert.equal(config.database,'sc_locks'); assert.equal(config.user,'sc_locks_writer');
const results = { client:'pg 8.23.1', scenarios:[], limits:'Disposable single native Linux server; selected schedules, not timings or proof for every schedule. External payment effects and retry policy are not tested.' };
const clients=[];
const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));
const identitySql = `SELECT version(), current_database() AS database, current_user AS username,
  current_setting('cluster_name') AS cluster_name, current_setting('data_directory') AS data_directory,
  inet_server_addr()::text AS address, inet_server_port() AS port`;
async function connect(role) {
  const client = new pg.Client({...config,application_name:`locks_article_${role}`,connectionTimeoutMillis:3000});
  clients.push(client); await client.connect();
  const id=(await client.query(identitySql)).rows[0];
  assert.equal(id.database,'sc_locks'); assert.equal(id.username,'sc_locks_writer');
  assert.equal(id.cluster_name,'staycurrent-locks-20261025');
  assert.equal(id.data_directory,'/var/lib/postgresql/18/docker');
  assert.match(id.version,/PostgreSQL 18\.6/);
  results.identity=id;
  await client.query(`SET search_path TO locks_article,pg_catalog; SET statement_timeout='8s'; SET lock_timeout='6s'`);
  return client;
}
const q=async(c,sql)=> (await c.query(sql)).rows;
const lockOrder=`SELECT order_id FROM orders WHERE order_id=103 FOR UPDATE`;
const readAmounts=`SELECT (SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103) AS line_value,
  (SELECT coalesce(sum(amount),0) FROM payments WHERE order_id=103) AS paid`;
const insert=id=>`INSERT INTO payments VALUES (${id},103,20.00,'card')`;
const safeQuery=(c,sql)=>c.query(sql).then(r=>({ok:true,rows:r.rows})).catch(e=>({ok:false,code:e.code,message:e.message,detail:e.detail}));
let observer,A,B;
async function reset() {
  await Promise.all([A.query('ROLLBACK'),B.query('ROLLBACK')]);
  await observer.query('DELETE FROM payments WHERE order_id=103');
}
async function total() { return Number((await q(observer,'SELECT coalesce(sum(amount),0) AS total FROM payments WHERE order_id=103'))[0].total); }
async function waitForEdge(waiter,holder) {
  const until=Date.now()+3000;
  while(Date.now()<until) {
    const blockers=(await q(observer,`SELECT pg_blocking_pids(${waiter.processID}) AS blockers`))[0].blockers;
    if(blockers.includes(holder.processID)) return;
    await delay(25);
  }
  throw new Error('Expected owned blocking edge did not appear');
}
async function paymentScenario(mode) {
  await reset();
  await A.query('BEGIN ISOLATION LEVEL READ COMMITTED');
  await B.query(`BEGIN ISOLATION LEVEL ${mode==='repeatable-read'?'REPEATABLE READ':'READ COMMITTED'}`);
  const record={name:mode};
  if(mode==='existing-payments') {
    record.lockedRowsA=(await q(A,'SELECT payment_id FROM payments WHERE order_id=103 FOR UPDATE')).length;
    record.lockedRowsB=(await q(B,'SELECT payment_id FROM payments WHERE order_id=103 FOR UPDATE')).length;
    record.a=await q(A,readAmounts); record.b=await q(B,readAmounts);
    await A.query(insert(601)); await B.query(insert(602));
    await A.query('COMMIT'); await B.query('COMMIT');
    assert.equal(await total(),40);
  } else {
    record.guardXminBefore=(await q(observer,"SELECT xmin::text FROM orders WHERE order_id=103"))[0].xmin;
    await A.query(lockOrder);
    if(mode==='repeatable-read') record.earlierSnapshot=await q(B,readAmounts);
    const combined=`WITH guard AS MATERIALIZED (${lockOrder})
      SELECT g.order_id,(SELECT coalesce(sum(amount),0) FROM payments WHERE order_id=g.order_id) AS paid FROM guard g`;
    const waiting=safeQuery(B,mode==='one-statement'?combined:lockOrder);
    await waitForEdge(B,A); record.observedWait='B → A';
    record.a=await q(A,readAmounts); await A.query(insert(601)); await A.query('COMMIT');
    const acquired=await waiting; assert.equal(acquired.ok,true);
    record.b=mode==='one-statement'?acquired.rows:await q(B,readAmounts);
    const paid=Number(record.b[0].paid);
    if(mode==='read-committed') {
      assert.equal(paid,20); assert.ok(paid+20>29); await B.query('ROLLBACK');
      record.decision='refused'; assert.equal(await total(),20);
    } else {
      assert.equal(paid,0); await B.query(insert(602)); await B.query('COMMIT');
      record.decision='accepted from earlier view'; assert.equal(await total(),40);
    }
    record.guardXminAfter=(await q(observer,"SELECT xmin::text FROM orders WHERE order_id=103"))[0].xmin;
    assert.equal(record.guardXminAfter,record.guardXminBefore);
  }
  record.committedTotal=await total(); results.scenarios.push(record);
}

try {
  observer=await connect('observer');
  await observer.query('CREATE SCHEMA locks_article');
  const fixture=await fs.readFile(new URL('evidence/fixture.sql',base),'utf8');
  await observer.query(fixture);
  A=await connect('A'); B=await connect('B');
  for(const mode of ['existing-payments','read-committed','repeatable-read','one-statement']) await paymentScenario(mode);

  await reset();
  const before=await q(observer,'SELECT product_id,stock FROM products ORDER BY product_id');
  await A.query('BEGIN'); await B.query('BEGIN');
  const p3="SELECT product_id FROM products WHERE product_id='P3' FOR UPDATE";
  const p7="SELECT product_id FROM products WHERE product_id='P7' FOR UPDATE";
  await A.query(p3); await B.query(p7);
  const aWaiting=safeQuery(A,p7); await waitForEdge(A,B);
  const bWaiting=safeQuery(B,p3);
  const [aResult,bResult]=await Promise.all([aWaiting,bWaiting]);
  const failures=[aResult,bResult].filter(x=>!x.ok);
  assert.equal(failures.length,1); assert.equal(failures[0].code,'40P01');
  await Promise.all([A.query('ROLLBACK'),B.query('ROLLBACK')]);
  results.scenarios.push({name:'lock-only deadlock',aResult,bResult,unchangedStock:before});
  assert.deepEqual(await q(observer,'SELECT product_id,stock FROM products ORDER BY product_id'),before);

  await A.query('BEGIN'); await B.query('BEGIN');
  await A.query(p3); const bFirst=safeQuery(B,p3); await waitForEdge(B,A);
  await A.query(p7); await A.query('COMMIT'); assert.equal((await bFirst).ok,true);
  await B.query(p7); await B.query('COMMIT');
  results.scenarios.push({name:'consistent P3 then P7 order',observedWait:'B → A',result:'both complete',stockUnchanged:true});
  assert.deepEqual(await q(observer,'SELECT product_id,stock FROM products ORDER BY product_id'),before);

  results.sourceHashes={};
  for(const name of ['src/articles/current/article.astro','src/articles/current/article.meta.json','src/components/relational-rebuild-locks/models.mjs','src/components/relational-rebuild-locks/Schedule.astro','evidence/fixture.sql','evidence/verify-native.mjs']) {
    results.sourceHashes[name]=crypto.createHash('sha256').update(await fs.readFile(new URL(name,base))).digest('hex');
  }
  results.status='passed';
} catch(error) {
  results.status='failed'; results.error={message:error.message,code:error.code}; process.exitCode=1;
} finally {
  await Promise.allSettled(clients.map(c=>c.end()));
  results.clientsClosed=true;
  await fs.writeFile(new URL('evidence/native-results.json',base),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify({status:results.status,error:results.error,scenarios:results.scenarios.map(s=>({name:s.name,total:s.committedTotal,result:s.result})),clientsClosed:true},null,2));
}
