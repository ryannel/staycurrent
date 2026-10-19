/**
 * Disposable request-recovery exercise. Node 24; npm install pg@8.23.1
 * PG_ADMIN_URL=postgresql://user@localhost/postgres node rehearse.mjs
 * Optional PG_DRIVER_MODULE=file:///absolute/path/to/pg/esm/index.mjs
 * Optional PG_TEST_DATABASE=rel3_a22_run2 (must not already exist).
 * Creates and drops only that fresh database; signals only its own sessions.
 * No shared server settings, roles or databases are modified.
 */
import assert from 'node:assert/strict';
import net from 'node:net';
import { randomUUID, createHash } from 'node:crypto';
const { Client, Pool } = await import(process.env.PG_DRIVER_MODULE || 'pg');
const adminUrl = new URL(process.env.PG_ADMIN_URL || 'postgresql://localhost/postgres');
const database = process.env.PG_TEST_DATABASE || `rel3_a22_run${Date.now()}`;
assert.match(database, /^rel3_a22_run[0-9]+$/);
const url = new URL(adminUrl); url.pathname = `/${database}`;
const clients = new Set(); const pools = new Set();
const results = [];
const note = (name, evidence) => { results.push({ name, ...evidence }); console.log(JSON.stringify(results.at(-1))); };
const pause = ms => new Promise(r => setTimeout(r, ms));
const admin = new Client({ connectionString: adminUrl.href, connectionTimeoutMillis: 2000 });
await admin.connect(); let created = false;
const connect = async (extra = {}) => {
  const c = new Client({ connectionString: url.href, connectionTimeoutMillis: 2000,
    options: '-c statement_timeout=3000 -c lock_timeout=1000 -c idle_in_transaction_session_timeout=5000', ...extra });
  c.on('error', () => {}); clients.add(c); await c.connect(); return c;
};
const until = async fn => {
  for (let i = 0; i < 100; i++) { const value = await fn(); if (value) return value; await pause(10); }
  throw new Error('Bounded observation did not arrive');
};
const fingerprint = quantity => createHash('sha256').update(JSON.stringify({ version: 1, items: [['mug', quantity], ['tea', 2]] })).digest('hex');
const claim = (c, key, fp, id) => c.query(`INSERT INTO operations
  (tenant_id, customer_id, kind, request_key, fingerprint, order_id, result)
  VALUES (7,42,'place-order',$1,$2,$3,$4)
  ON CONFLICT (tenant_id,customer_id,kind,request_key) DO NOTHING RETURNING order_id`,
  [key,fp,id,{order_id:id,status:'accepted'}]);
const lookup = (c, key) => c.query("SELECT fingerprint,order_id,result FROM operations WHERE tenant_id=7 AND customer_id=42 AND kind='place-order' AND request_key=$1",[key]);
const effect = (c, id) => c.query('INSERT INTO orders VALUES ($1,7,42)',[id]);
const complete = async (c, key, fp = fingerprint(1)) => {
  await c.query('BEGIN ISOLATION LEVEL READ COMMITTED');
  const id = randomUUID(); const inserted = await claim(c,key,fp,id);
  if (inserted.rowCount) { await effect(c,id); await c.query('COMMIT'); return { fresh:true, id }; }
  const seen = (await lookup(c,key)).rows[0];
  await c.query('ROLLBACK');
  assert(seen, 'retained row must exist under this no-cleanup fixture');
  if (seen.fingerprint !== fp) return { conflict:true, id:seen.order_id };
  return { fresh:false, id:seen.order_id };
};
// A small PostgreSQL-protocol TCP proxy. No TLS; loopback lab only.
// Before: withhold COMMIT entirely. After: withhold its server completion.
const cutProxy = async mode => {
  const sockets = new Set(); let evidence = null;
  const server = net.createServer(front => {
    const back = net.connect({ host:adminUrl.hostname, port:Number(adminUrl.port || 5432) });
    sockets.add(front); sockets.add(back);
    for (const s of [front,back]) { s.on('error',()=>{}); s.on('close',()=>sockets.delete(s)); }
    front.on('close',()=>back.destroy()); back.on('close',()=>front.destroy());
    let startup = true, fbuf = Buffer.alloc(0), bbuf = Buffer.alloc(0);
    front.on('data', chunk => {
      fbuf = Buffer.concat([fbuf,chunk]);
      if (startup) { if (fbuf.length < 4 || fbuf.length < fbuf.readInt32BE(0)) return;
        const n=fbuf.readInt32BE(0); back.write(fbuf.subarray(0,n)); fbuf=fbuf.subarray(n); startup=false; }
      while (fbuf.length >= 5) {
        const n=1+fbuf.readInt32BE(1); if(fbuf.length<n) return;
        const msg=fbuf.subarray(0,n); fbuf=fbuf.subarray(n);
        if(mode==='before' && msg[0]===81 && msg.subarray(5,-1).toString().trim()==='COMMIT') {
          evidence='COMMIT intercepted before forwarding'; front.destroy(); back.destroy(); return;
        }
        back.write(msg);
      }
    });
    back.on('data', chunk => {
      bbuf=Buffer.concat([bbuf,chunk]);
      while(bbuf.length>=5) {
        const n=1+bbuf.readInt32BE(1); if(bbuf.length<n) return;
        const msg=bbuf.subarray(0,n); bbuf=bbuf.subarray(n);
        if(mode==='after' && msg[0]===67 && msg.subarray(5,-1).toString()==='COMMIT') {
          evidence='server CommandComplete COMMIT intercepted before client'; front.destroy(); back.destroy(); return;
        }
        front.write(msg);
      }
    });
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  return { port:server.address().port, evidence:()=>evidence, close:async()=>{ for(const s of sockets)s.destroy(); await new Promise(r=>server.close(r)); } };
};
try {
  await admin.query(`CREATE DATABASE "${database}"`); created=true;
  const observer=await connect();
  const runtime=(await observer.query("SELECT version(),current_setting('server_version') AS server_version,current_setting('default_transaction_isolation') AS isolation")).rows[0];
  note('runtime',{node:process.version,driver:'pg 8.23.1 (pinned dependency)',...runtime});
  await observer.query(`CREATE TABLE orders(order_id uuid PRIMARY KEY,tenant_id int NOT NULL,customer_id int NOT NULL);
    CREATE TABLE operations(tenant_id int NOT NULL,customer_id int NOT NULL,kind text NOT NULL,request_key text NOT NULL,
      fingerprint text NOT NULL,order_id uuid NOT NULL REFERENCES orders DEFERRABLE INITIALLY DEFERRED,
      result jsonb NOT NULL,PRIMARY KEY(tenant_id,customer_id,kind,request_key));
    CREATE TABLE counter(id int PRIMARY KEY,n int NOT NULL); INSERT INTO counter VALUES(1,0);
    CREATE TABLE probes(label text PRIMARY KEY);`);
  const c=await connect();
  const pool=new Pool({connectionString:url.href,max:1,connectionTimeoutMillis:40}); pools.add(pool);
  const held=await pool.connect(); let acquireError;
  try { await pool.connect(); } catch(e) { acquireError=e.message; }
  assert(acquireError); assert.equal(pool.waitingCount,0); held.release(); await pool.end(); pools.delete(pool);
  note('acquisition exhausted',{error:acquireError,waiting:pool.waitingCount,transactionsStarted:0});

  for(const mode of ['server-timeout','cancel']) {
    await c.query('BEGIN'); await c.query('INSERT INTO probes VALUES($1)',[mode]);
    if(mode==='server-timeout') await c.query("SET LOCAL statement_timeout='40ms'");
    const running=c.query('SELECT pg_sleep(0.4)').then(()=>null,e=>e);
    if(mode==='cancel') {
      await until(async()=> (await observer.query("SELECT 1 FROM pg_stat_activity WHERE pid=$1 AND state='active' AND query LIKE 'SELECT pg_sleep%'",[c.processID])).rowCount);
      assert.equal((await observer.query('SELECT pg_cancel_backend($1) AS sent',[c.processID])).rows[0].sent,true);
    }
    const e=await running; assert.equal(e.code,'57014');
    let failed; try{await c.query('SELECT 1');}catch(e){failed=e.code;}
    assert.equal(failed,'25P02'); await c.query('ROLLBACK');
    assert.equal((await observer.query('SELECT 1 FROM probes WHERE label=$1',[mode])).rowCount,0);
    note(mode,{statementError:e.code,subsequentStatement:failed,rolledBack:true,effects:0});
  }
  const timed=await connect();
  const timeout=await timed.query({text:'SELECT pg_sleep(0.4)',query_timeout:40}).then(()=>null,e=>e);
  const active=(await observer.query("SELECT state,wait_event FROM pg_stat_activity WHERE pid=$1",[timed.processID])).rows[0];
  assert.match(timeout.message,/timeout/i); assert.equal(active.state,'active');
  note('driver timeout',{error:timeout.message,observer:active,sqlstate:timeout.code??null}); await timed.end();

  const tx=await connect({options:'-c transaction_timeout=60 -c statement_timeout=3000'});
  await tx.query('BEGIN'); await tx.query("INSERT INTO probes VALUES('transaction-timeout')");
  const txError=await tx.query('SELECT pg_sleep(0.3)').then(()=>null,e=>e);
  assert.equal(txError.code,'25P04');
  assert.equal((await observer.query("SELECT 1 FROM probes WHERE label='transaction-timeout'")).rowCount,0);
  note('transaction timeout',{error:txError.code,effects:0});

  // Deferred trigger makes COMMIT itself do measurable work; not a storage fault.
  await observer.query(`CREATE FUNCTION slow_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_sleep(0.3); RETURN NEW; END $$;
    CREATE CONSTRAINT TRIGGER slow_commit AFTER INSERT ON probes DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION slow_commit();`);
  await c.query('BEGIN'); await c.query("SET LOCAL statement_timeout='40ms'");
  await c.query("INSERT INTO probes VALUES('commit-timeout')");
  const commitStart=performance.now(); const commitResponse=await c.query('COMMIT');
  const commitElapsed=Math.round(performance.now()-commitStart);
  assert.equal(commitResponse.command,'COMMIT'); assert(commitElapsed>=250);
  assert.equal((await observer.query("SELECT 1 FROM probes WHERE label='commit-timeout'")).rowCount,1);
  note('COMMIT exceeds local statement timeout',{command:commitResponse.command,elapsedMs:commitElapsed,statementTimeoutMs:40,effects:1,model:'deferred trigger sleep; not a storage fault'});
  await observer.query('DROP TRIGGER slow_commit ON probes; DROP FUNCTION slow_commit()');

  const b=await connect();
  await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE'); await b.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
  const first=(await c.query('SELECT n FROM counter WHERE id=1')).rows[0].n;
  const stale=(await b.query('SELECT n FROM counter WHERE id=1')).rows[0].n;
  await c.query('UPDATE counter SET n=$1 WHERE id=1',[first+1]); await c.query('COMMIT');
  const abort=await b.query('UPDATE counter SET n=$1 WHERE id=1',[stale+1]).then(()=>null,e=>e);
  assert.equal(abort.code,'40001'); await b.query('ROLLBACK');
  await b.query('BEGIN ISOLATION LEVEL SERIALIZABLE'); const fresh=(await b.query('SELECT n FROM counter WHERE id=1')).rows[0].n;
  await b.query('UPDATE counter SET n=$1 WHERE id=1',[fresh+1]); await b.query('COMMIT');
  assert.equal((await observer.query('SELECT n FROM counter')).rows[0].n,2);
  note('complete transaction retry',{error:abort.code,initialRead:stale,retriedRead:fresh,attempts:2,finalValue:2});

  for(const changed of [false,true]) {
    const key=changed?'overlap-conflict':'overlap-match', id=randomUUID();
    await c.query('BEGIN'); await claim(c,key,fingerprint(1),id); await effect(c,id);
    const missing=(await lookup(observer,key)).rowCount; assert.equal(missing,0);
    const other=complete(b,key,fingerprint(changed?2:1));
    await until(async()=> (await observer.query("SELECT 1 FROM pg_stat_activity WHERE pid=$1 AND wait_event_type='Lock'",[b.processID])).rowCount);
    await c.query('COMMIT'); const outcome=await other;
    assert.equal(outcome.id,id); assert.equal(outcome.conflict??false,changed);
    note(key,{lookupWhileFirstOpen:missing,secondWaited:true,...outcome,retained:(await lookup(observer,key)).rowCount});
  }
  const key='bounded-overlap', id=randomUUID(); await c.query('BEGIN'); await claim(c,key,fingerprint(1),id); await effect(c,id);
  await b.query('BEGIN'); await b.query("SET LOCAL lock_timeout='40ms'");
  const locked=await claim(b,key,fingerprint(1),randomUUID()).then(()=>null,e=>e); assert.equal(locked.code,'55P03');
  await b.query('ROLLBACK'); await c.query('COMMIT');
  const resolved=await complete(b,key); assert.equal(resolved.id,id);
  note('bounded conflict wait',{error:locked.code,resolvedTo:id,secondCreatedOrder:false});

  // Caller timer expires, but the retained owner continues bounded work.
  const delayed=await connect();
  const continuing=(async()=>{await delayed.query('BEGIN'); const id=randomUUID(); await claim(delayed,'outlives-caller',fingerprint(1),id);
    await effect(delayed,id); await delayed.query('SELECT pg_sleep(0.12)'); await delayed.query('COMMIT'); return id;})();
  const caller=await Promise.race([continuing.then(()=> 'completed'),pause(20).then(()=> 'deadline')]); assert.equal(caller,'deadline');
  const seenDuring=(await lookup(observer,'outlives-caller')).rowCount; assert.equal(seenDuring,0);
  const continuedId=await continuing; const recovered=await complete(b,'outlives-caller'); assert.equal(recovered.id,continuedId);
  note('first attempt outlives caller',{caller,lookupDuring:seenDuring,laterRecoveredSameOrder:true,attempts:1});

  for(const mode of ['before','after']) {
    const proxy=await cutProxy(mode);
    try{
      const proxyUrl=new URL(url); proxyUrl.hostname='127.0.0.1'; proxyUrl.port=String(proxy.port);
      const broken=await connect({connectionString:proxyUrl.href,ssl:false});
      const key=`cut-${mode}`, id=randomUUID(); await broken.query('BEGIN'); await claim(broken,key,fingerprint(1),id); await effect(broken,id);
      const err=await broken.query('COMMIT').then(()=>null,e=>e); assert(err);
      await until(async()=> !(await observer.query('SELECT 1 FROM pg_stat_activity WHERE pid=$1',[broken.processID])).rowCount);
      const found=(await lookup(observer,key)).rowCount; assert.equal(found,mode==='after'?1:0);
      const again=await complete(b,key); assert.equal(again.fresh,mode==='before');
      note(`connection cut ${mode} commit`,{injection:proxy.evidence(),clientError:err.message,clientSqlstate:err.code??null,authoritativeRecord:found,recovery:again});
    }finally{await proxy.close();}
  }
  const retained=await complete(c,'suppressed-http'); // COMMIT confirmation reached API.
  const repeated=await complete(b,'suppressed-http'); assert.equal(retained.id,repeated.id);
  note('HTTP result suppressed after known commit',{apiConfirmed:true,callerReceived:false,sameOrderReturned:true});
  const expired=await complete(c,'expiry'); const before=await complete(b,'expiry'); assert.equal(before.id,expired.id);
  await observer.query("DELETE FROM operations WHERE request_key='expiry'");
  const after=await complete(b,'expiry'); assert.notEqual(after.id,expired.id);
  note('retention boundary',{beforeDeletionSameOrder:true,afterDeletionNewOrder:true,orderCount:2,model:'explicit deletion stands for expiry cleanup'});
  const counts=(await observer.query('SELECT (SELECT count(*) FROM orders)::int AS orders,(SELECT count(*) FROM operations)::int AS retained')).rows[0];
  assert.equal(counts.orders,counts.retained+1); note('final invariants',counts);
} finally {
  await Promise.allSettled([...pools].map(p=>p.end()));
  await Promise.allSettled([...clients].map(c=>c.end()));
  if(created){
    const remaining=(await admin.query('SELECT pid FROM pg_stat_activity WHERE datname=$1',[database])).rows;
    for(const {pid} of remaining)await admin.query('SELECT pg_terminate_backend($1)',[pid]);
    note('cleanup',{remainingSessions:remaining.length,database});
    await admin.query(`DROP DATABASE "${database}"`);
  }
  await admin.end();
}
