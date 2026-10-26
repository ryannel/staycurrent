import fs from 'node:fs';
import assert from 'node:assert/strict';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';

// Root provisions/removes the disposable server. No inherited PG connection defaults.
const file = process.argv[2];
assert(file?.startsWith('/private/tmp/'), 'Explicit task-owned configuration required');
const { connection: c, expected: e } = JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(c.host, '127.0.0.1');
assert(Number.isInteger(c.port) && c.port !== 5432);
for (const key of ['database', 'user', 'password']) assert(c[key]);
const config = { host:c.host, port:c.port, database:c.database, user:c.user,
  password:c.password, ssl:false, connectionTimeoutMillis:2500,
  query_timeout:7000, application_name:'pg-operations-verify' };
const schema = 'pg_operations_verify';
const out = { runtime:'native PostgreSQL / node-postgres', checks:[] };
const clients = [];
let observer, holder, waiter, pool, made = false, borrowed, queuedBorrow;
const history = `SELECT order_id, placed_at, status FROM ${schema}.orders
WHERE customer_id = 1 ORDER BY placed_at DESC, order_id DESC LIMIT 10`;
const identity = async client => {
  const x = (await client.query(`SELECT current_database() AS database,
    current_user AS username, current_setting('data_directory') AS data_directory,
    current_setting('server_version_num') AS version_num,
    (pg_control_system()).system_identifier::text AS system_identifier,
    pg_backend_pid() AS pid, version() AS version`)).rows[0];
  assert.equal(x.database,e.database); assert.equal(x.username,e.user);
  assert.equal(x.data_directory,e.dataDirectory);
  assert.equal(x.system_identifier,e.systemIdentifier);
  assert.equal(x.version_num,String(e.versionNum));
  assert(x.version_num.startsWith('18'));
  return x;
};
const connect = async name => {
  const client = new pg.Client({...config, application_name:name});
  client.on('error', err => out.checks.push({event:'client-error', name, code:err.code}));
  await client.connect(); clients.push(client);
  const x = await identity(client);
  await client.query(`SET statement_timeout = '4s'; SET lock_timeout = '2s';
    SET idle_in_transaction_session_timeout = '8s'`);
  return {client, x};
};
const expectCode = async (promise, code) => {
  try { await promise; assert.fail(`Expected ${code}`); }
  catch (err) { assert.equal(err.code,code); return {code:err.code,message:err.message}; }
};
const poll = async predicate => {
  const until = Date.now()+1800;
  while(Date.now()<until) {
    const x = await predicate(); if(x) return x;
    await new Promise(resolve=>setTimeout(resolve,35));
  }
  throw new Error('Bounded evidence poll expired');
};
const snapshot = async pids => (await observer.query(`SELECT pid, application_name,
  backend_start, state, xact_start, query_start, state_change,
  wait_event_type, wait_event, query, pg_blocking_pids(pid) AS blockers
  FROM pg_stat_activity WHERE pid = ANY($1::int[]) ORDER BY pid`,[pids])).rows;
const lockRows = async pids => (await observer.query(`SELECT pid, mode, granted,
  relation::regclass::text AS relation FROM pg_locks
  WHERE database = (SELECT oid FROM pg_database WHERE datname=current_database())
    AND relation = '${schema}.orders'::regclass AND pid=ANY($1::int[])
  ORDER BY pid, mode`,[pids])).rows;
try {
  ({client:observer,x:out.identity} = await connect('pg-operations-observer'));
  assert.equal((await observer.query('SELECT to_regnamespace($1) AS ns',[schema])).rows[0].ns,null);
  await observer.query(`CREATE SCHEMA ${schema}`); made=true;
  await observer.query(`CREATE TABLE ${schema}.orders (
    order_id integer PRIMARY KEY, customer_id integer NOT NULL,
    placed_at timestamptz NOT NULL, status text NOT NULL);
    INSERT INTO ${schema}.orders VALUES
    (101,1,'2026-10-12 09:30+00','paid'),
    (102,2,'2026-10-14 16:05+00','paid'),
    (103,1,'2026-10-20 10:15+00','pending')`);
  ({client:holder} = await connect('pg-operations-holder'));
  pool = new pg.Pool({...config,max:1,application_name:'pg-operations-history'});
  borrowed = await pool.connect(); await identity(borrowed); waiter=borrowed;
  await waiter.query(`SET statement_timeout='4s'; SET lock_timeout='2s'`);
  const hp=(await identity(holder)).pid, wp=(await identity(waiter)).pid;
  out.sessionIdentities={holder:await identity(holder),waiter:await identity(waiter)};
  out.baseline=(await waiter.query(history)).rows;
  assert.deepEqual(out.baseline.map(x=>x.order_id),[103,101]);
  await holder.query('BEGIN');
  await holder.query(`LOCK TABLE ${schema}.orders IN ACCESS EXCLUSIVE MODE`);
  const waiting=waiter.query(history).then(x=>({ok:true,rows:x.rows}),err=>({ok:false,code:err.code}));
  let queuedDone=false;
  const queued=pool.connect().then(x=>{queuedDone=true;queuedBorrow=x;return x;});
  const blocked=await poll(async()=>{
    const rows=await snapshot([hp,wp]);
    return rows.some(x=>x.pid===wp && x.wait_event_type==='Lock' && x.blockers.includes(hp))?rows:null;
  });
  assert.equal(pool.waitingCount,1); assert.equal(queuedDone,false);
  out.checks.push({name:'borrowed-waits-queued-has-no-backend',pool:{total:pool.totalCount,idle:pool.idleCount,waiting:pool.waitingCount},activity:blocked,locks:await lockRows([hp,wp])});
  const sent=(await observer.query('SELECT pg_cancel_backend($1) AS sent',[hp])).rows[0].sent;
  assert.equal(sent,true);
  const remains=await snapshot([hp,wp]);
  assert(remains.some(x=>x.pid===wp && x.blockers.includes(hp)));
  assert((await lockRows([hp])).some(x=>x.mode==='AccessExclusiveLock' && x.granted));
  out.checks.push({name:'cancel-idle-holder-does-not-release',sent,activity:remains});
  await holder.query('ROLLBACK');
  const completed=await waiting; assert.equal(completed.ok,true);
  assert.deepEqual(completed.rows.map(x=>x.order_id),[103,101]);
  borrowed.release(); borrowed=null;
  const next=await queued; await identity(next);
  const nextRows=(await next.query(history)).rows; next.release(); queuedBorrow=null;
  assert.deepEqual(nextRows.map(x=>x.order_id),[103,101]);
  out.checks.push({name:'owner-rollback-history-then-queued-caller',rows:completed.rows,queuedRows:nextRows,locks:await lockRows([hp,wp])});
  borrowed=await pool.connect(); waiter=borrowed;
  await holder.query('BEGIN'); await holder.query(`LOCK TABLE ${schema}.orders IN ACCESS EXCLUSIVE MODE`);
  await waiter.query('BEGIN');
  const cancelled=expectCode(waiter.query(history),'57014');
  await poll(async()=>(await snapshot([wp])).some(x=>x.blockers.includes(hp)));
  await observer.query('SELECT pg_cancel_backend($1)',[wp]);
  out.checks.push({name:'cancel-waiter',error:await cancelled,failedTransaction:await expectCode(waiter.query('SELECT 1'),'25P02'),holderLocks:await lockRows([hp])});
  await waiter.query('ROLLBACK'); await holder.query('ROLLBACK');
  await holder.query('BEGIN'); await holder.query(`LOCK TABLE ${schema}.orders IN ACCESS EXCLUSIVE MODE`);
  await waiter.query(`BEGIN; SET LOCAL lock_timeout='150ms'; SET LOCAL statement_timeout='900ms'`);
  out.checks.push({name:'lock-timeout',error:await expectCode(waiter.query(history),'55P03'),failedTransaction:await expectCode(waiter.query('SELECT 1'),'25P02')});
  await waiter.query('ROLLBACK'); await holder.query('ROLLBACK');
  await waiter.query(`BEGIN; SET LOCAL lock_timeout='150ms'; SET LOCAL statement_timeout='250ms'`);
  out.checks.push({name:'statement-timeout-without-lock-wait',error:await expectCode(waiter.query('SELECT pg_sleep(2)'),'57014')});
  await waiter.query('ROLLBACK');
  await holder.query('BEGIN'); await holder.query(`LOCK TABLE ${schema}.orders IN ACCESS EXCLUSIVE MODE`);
  const terminatedWait=waiter.query(history).then(x=>({rows:x.rows}),err=>({code:err.code}));
  await poll(async()=>(await snapshot([wp])).some(x=>x.blockers.includes(hp)));
  const target=await identity(holder);
  const terminate=(await observer.query(`SELECT pg_terminate_backend(pid,1000) AS ended
    FROM pg_stat_activity WHERE pid=$1 AND backend_start=$2::timestamptz
      AND application_name='pg-operations-holder' AND datname=$3 AND usename=$4`,
    [hp,(await snapshot([hp]))[0].backend_start,e.database,e.user])).rows[0];
  assert.equal(terminate.ended,true);
  const after=await terminatedWait; assert.deepEqual(after.rows.map(x=>x.order_id),[103,101]);
  out.checks.push({name:'terminate-known-lock-only-holder',target,terminate,rows:after.rows,locks:await lockRows([hp])});
  const stats=()=>observer.query(`SELECT dbid,userid,queryid::text,toplevel,calls::text,
    total_exec_time,shared_blks_hit::text,stats_since FROM pg_stat_statements
    WHERE dbid=(SELECT oid FROM pg_database WHERE datname=current_database())
      AND query LIKE 'SELECT order_id, placed_at, status FROM ${schema}.orders%'`);
  const before=(await stats()).rows; assert.equal(before.length,1);
  await waiter.query(history); await waiter.query(history);
  const afterStats=(await stats()).rows; assert.equal(afterStats.length,1);
  assert.equal(BigInt(afterStats[0].calls)-BigInt(before[0].calls),2n);
  assert.equal(String(afterStats[0].stats_since),String(before[0].stats_since));
  out.checks.push({name:'statement-counter-interval',before,after:afterStats});
  out.settings=(await observer.query(`SELECT name,setting,unit FROM pg_settings
    WHERE name IN ('max_connections','reserved_connections','superuser_reserved_connections','shared_preload_libraries') ORDER BY name`)).rows;
  out.finalRows=(await waiter.query(`SELECT * FROM ${schema}.orders ORDER BY order_id`)).rows;
  assert.equal(out.finalRows.length,3);
  out.success=true;
} finally {
  if(borrowed) { await borrowed.query('ROLLBACK').catch(()=>{}); borrowed.release(); }
  await Promise.resolve();
  if(queuedBorrow) { queuedBorrow.release(); queuedBorrow=null; }
  for(const x of clients) if(x!==observer) await x.query('ROLLBACK').catch(()=>{});
  if(made && observer) await observer.query(`DROP SCHEMA ${schema} CASCADE`).catch(err=>{out.cleanupError=err.message;});
  if(pool) await pool.end();
  for(const x of clients) await x.end().catch(()=>{});
  fs.writeFileSync(new URL('./native-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
}
assert.equal(out.success,true); assert.equal(out.cleanupError,undefined);
console.log('Native operations verifier passed; results retained without credentials.');
