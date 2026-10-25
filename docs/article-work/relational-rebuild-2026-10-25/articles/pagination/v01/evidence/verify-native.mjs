import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {startingRows} from '../src/components/relational-rebuild-pagination/data.mjs';

// The connection file is task-owned; never retain its generated password.
const config=JSON.parse(await readFile('/private/tmp/staycurrent-rebuild-pagination-native-20261025/connection.json','utf8'));
assert.equal(config.host,'127.0.0.1'); assert.equal(config.port,51411);
assert.equal(config.database,'sc_pagination'); assert.equal(config.user,'sc_pagination_writer');
const article=await readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const queries=[...article.matchAll(/<Sql label="([^"]+)" code=\{`([\s\S]*?)`\} \/>/g)].map(m=>({label:m[1],sql:m[2]}));
const clients=[];
const report={client:'pg 8.23.1',sourceSha256:createHash('sha256').update(article).digest('hex'),cases:[]};
const schema='pgn_writer_verification';
let created=false;
async function connect() {
  const c=new pg.Client({...config,connectionTimeoutMillis:5000,query_timeout:10000,statement_timeout:10000});
  clients.push(c); await c.connect();
  const identity=(await c.query("SELECT version(), current_database() AS database, current_user AS username, current_setting('cluster_name') AS cluster, current_setting('data_directory') AS directory")).rows[0];
  assert.equal(identity.database,'sc_pagination'); assert.equal(identity.username,'sc_pagination_writer');
  assert.equal(identity.cluster,'staycurrent-pagination-20261025');
  assert.equal(identity.directory,'/var/lib/postgresql/18/docker');
  assert.match(identity.version,/PostgreSQL 18\.6.*linux/);
  report.identity=identity;
  return c;
}
try {
  const a=await connect(),b=await connect();
  assert.equal((await a.query('SELECT to_regnamespace($1) AS existing',[schema])).rows[0].existing,null);
  await a.query(`CREATE SCHEMA ${schema}`); created=true;
  for(const c of [a,b])await c.query(`SET search_path TO ${schema}; SET TIME ZONE 'UTC';`);
  await a.query('CREATE TABLE orders(order_id integer PRIMARY KEY, customer_id integer NOT NULL, placed_at timestamptz NOT NULL,status text NOT NULL)');
  for(const r of startingRows)await a.query('INSERT INTO orders VALUES($1,$2,$3,$4)',[r.id,r.id>200?3:r.id===102?2:1,r.at,r.status]);
  for(const isolation of ['READ COMMITTED','REPEATABLE READ']) {
    await b.query("UPDATE orders SET status='pending' WHERE order_id=103");
    await a.query(`BEGIN ISOLATION LEVEL ${isolation} READ ONLY`);
    const before=(await a.query(queries[0].sql)).rows;
    assert.deepEqual(before.map(r=>[r.order_id,r.status]),[[202,'pending'],[201,'pending']]);
    await b.query("UPDATE orders SET status='paid' WHERE order_id=103");
    const after=(await a.query(queries[3].sql)).rows;
    assert.deepEqual(after.map(r=>[r.order_id,r.status]),[[103,isolation==='REPEATABLE READ'?'pending':'paid'],[102,'paid']]);
    const final=(await a.query("SELECT order_id,placed_at,status FROM orders WHERE (placed_at,order_id)<(timestamptz '2026-10-14 16:05:00+00',102) ORDER BY placed_at DESC,order_id DESC LIMIT 2")).rows;
    assert.deepEqual(final.map(r=>r.order_id),[101]);
    await a.query('COMMIT');
    report.cases.push({isolation,before,committedChange:'103 pending→paid in second session',after,final});
  }
  // Independent retained-content test. A single CREATE AS SELECT copies one projection.
  await b.query("UPDATE orders SET status='pending' WHERE order_id=103");
  await a.query('CREATE TABLE retained_export AS SELECT order_id,placed_at,status FROM orders');
  await a.query('CREATE TABLE retained_ids AS SELECT order_id FROM orders');
  await b.query("UPDATE orders SET status='paid' WHERE order_id=103");
  const retained=(await a.query('SELECT * FROM retained_export ORDER BY placed_at DESC,order_id DESC')).rows;
  const live=(await a.query('SELECT o.order_id,o.placed_at,o.status FROM retained_ids i JOIN orders o USING(order_id) ORDER BY o.placed_at DESC,o.order_id DESC')).rows;
  assert.equal(retained.find(r=>r.order_id===103).status,'pending');
  assert.equal(live.find(r=>r.order_id===103).status,'paid');
  report.cases.push({label:'Retained projection versus retained IDs joined to live values',retained,live});
  // The displayed transaction skeleton also parses and runs in this session.
  await a.query(queries[7].sql);
  report.displayedTransactionExecuted=true;
  await writeFile(new URL('./native-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({identity:report.identity,cases:report.cases.length,displayedTransactionExecuted:true}));
} finally {
  for(const c of clients) {
    try{await c.query('ROLLBACK');}catch{}
  }
  if(created&&clients[0])try{await clients[0].query(`DROP SCHEMA ${schema} CASCADE`);}catch{}
  for(const c of clients)try{await c.end();}catch{}
}
