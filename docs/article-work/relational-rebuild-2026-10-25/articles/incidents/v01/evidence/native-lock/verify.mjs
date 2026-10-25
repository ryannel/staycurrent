import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const cfg=JSON.parse(await fs.readFile('/private/tmp/staycurrent-rebuild-incidents-native-20261025/connection.json','utf8'));
const schema='incidents_lock_verification_20261025';
const base='/private/tmp/staycurrent-relational-rebuild-incidents-writer-20261025';
const src=await fs.readFile(base+'/src/articles/current/article.astro','utf8');
const history=src.match(/const history = `([\s\S]+?)`;/)[1];
const clients=[]; let created=false; const observations={historySQL:history,limits:'Native lock mechanism only; no pool, incident latency or resource-counter observation.'};
const connect=async(name)=>{const c=new pg.Client({...cfg,application_name:'staycurrent-incidents-'+name});await c.connect();clients.push(c);const {rows:[r]}=await c.query("SELECT current_database() AS db,current_user AS usr,current_setting('cluster_name') AS cluster,current_setting('data_directory') AS dir,version() AS version");assert.equal(r.db,'sc_incidents');assert.equal(r.usr,'sc_incidents_writer');assert.equal(r.cluster,'staycurrent-incidents-20261025');assert.equal(r.dir,'/var/lib/postgresql/18/docker');assert.match(r.version,/PostgreSQL 18.6/);observations.runtime=r;await c.query("SET TIME ZONE 'UTC';SET statement_timeout='5s';SET lock_timeout='3s'");return c;};
let h,r,o,pending;
try {
 o=await connect('observer');h=await connect('holder');r=await connect('reader');
 await o.query('CREATE SCHEMA '+schema);created=true;
 for(const c of [h,r,o])await c.query('SET search_path TO '+schema);
 await o.query(`CREATE TABLE customers(customer_id integer PRIMARY KEY,name text NOT NULL);CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,placed_at timestamptz NOT NULL,status text NOT NULL);INSERT INTO customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');INSERT INTO orders VALUES(101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');`);
 const before=(await o.query('TABLE orders ORDER BY order_id')).rows;
 const hp=(await h.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
 const rp=(await r.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
 await h.query('BEGIN; LOCK TABLE orders IN ACCESS EXCLUSIVE MODE');
 pending=r.query(history).then(v=>({value:v}),error=>({error}));
 let observed;
 for(let i=0;i<80;i++){
  const rows=(await o.query('SELECT pid,state,wait_event_type,wait_event,pg_blocking_pids(pid) AS blockers FROM pg_stat_activity WHERE pid=ANY($1::int[])',[[hp,rp]])).rows;
  const reader=rows.find(v=>v.pid===rp),holder=rows.find(v=>v.pid===hp);
  if(reader?.wait_event_type==='Lock'&&reader.blockers.includes(hp)&&holder?.state==='idle in transaction'){observed=rows;break;}
  await new Promise(resolve=>setTimeout(resolve,20));
 }
 assert.ok(observed,'Expected correlated table-lock wait');
 observations.blockedActivity=observed;
 observations.relationLocks=(await o.query('SELECT pid,mode,granted FROM pg_locks WHERE relation=$1::regclass AND pid=ANY($2::int[]) ORDER BY pid,mode',[schema+'.orders',[hp,rp]])).rows;
 assert.ok(observations.relationLocks.some(v=>v.pid===hp&&v.mode==='AccessExclusiveLock'&&v.granted));
 assert.ok(observations.relationLocks.some(v=>v.pid===rp&&v.mode==='AccessShareLock'&&!v.granted));
 await h.query('ROLLBACK');const done=await pending;pending=undefined;if(done.error)throw done.error;
 observations.afterRelease=done.value.rows;assert.deepEqual(done.value.rows.map(v=>[v.order_id,v.status]),[[103,'pending'],[101,'paid']]);
 await h.query('BEGIN; SELECT order_id FROM orders WHERE order_id=103 FOR UPDATE');
 observations.rowLockContrast=(await r.query(history)).rows;
 const holderState=(await o.query('SELECT state FROM pg_stat_activity WHERE pid=$1',[hp])).rows[0].state;assert.equal(holderState,'idle in transaction');
 assert.deepEqual(observations.rowLockContrast,observations.afterRelease);
 await h.query('ROLLBACK');assert.deepEqual((await o.query('TABLE orders ORDER BY order_id')).rows,before);observations.rowsUnchanged=true;
} finally {
 if(h)await h.query('ROLLBACK').catch(()=>{});
 if(pending)await pending;
 if(created){await o.query('DROP SCHEMA '+schema+' CASCADE');observations.schemaRemoved=true;}
 for(const c of clients)await c.end();
 await fs.writeFile(base+'/evidence/native-lock/results.json',JSON.stringify(observations,null,2)+'\n');
}
assert.equal(observations.schemaRemoved,true);console.log('Native lock wait, release, ordinary-read contrast and unchanged rows verified.');
