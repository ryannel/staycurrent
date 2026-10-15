import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
const config={host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'pg_core_lab'};
const clients=await Promise.all(['observer','report','writer','contender'].map(async name=>{const c=new pg.Client({...config,application_name:'core-'+name});await c.connect();return c;}));
const [o,r,w,c]=clients;const result={};
try{
 result.version=(await o.query('SELECT version()')).rows;
 await o.query(`DROP TABLE IF EXISTS core_products;
 CREATE TABLE core_products(product_id integer PRIMARY KEY,name text NOT NULL,available integer NOT NULL CHECK(available>=0)) WITH(fillfactor=80);
 INSERT INTO core_products SELECT n,'Product '||n,3 FROM generate_series(1,10000) AS n;
 ANALYZE core_products;`);
 const read='SELECT product_id,name,available,ctid::text AS location,xmin::text AS creator FROM core_products WHERE product_id=7';
 result.initial=(await o.query(read)).rows;
 result.plan=(await o.query('EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON) SELECT product_id,name,available FROM core_products WHERE product_id=7')).rows[0]['QUERY PLAN'];
 await r.query('BEGIN ISOLATION LEVEL REPEATABLE READ');result.reportBefore=(await r.query(read)).rows;
 await w.query('BEGIN');result.pending=(await w.query('UPDATE core_products SET available=available-2 WHERE product_id=7 AND available>=2 RETURNING product_id,available,ctid::text AS location,xmin::text AS creator')).rows;
 result.otherBeforeCommit=(await c.query(read)).rows;assert.equal(result.otherBeforeCommit[0].available,3);
 await w.query('COMMIT');result.reportAfterCommit=(await r.query(read)).rows;result.newRead=(await c.query(read)).rows;
 assert.equal(result.reportAfterCommit[0].available,3);assert.equal(result.newRead[0].available,1);
 assert.notEqual(result.initial[0].location,result.newRead[0].location);
 await r.query('COMMIT');
 await o.query('UPDATE core_products SET available=3 WHERE product_id=7');
 await w.query('BEGIN');await w.query('UPDATE core_products SET available=available-2 WHERE product_id=7 AND available>=2');
 await c.query("SET lock_timeout='30s'");const cpid=(await c.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
 const waiting=c.query('UPDATE core_products SET available=available-2 WHERE product_id=7 AND available>=2 RETURNING available');
 for(let i=0;i<100;i++){
  const state=(await o.query('SELECT wait_event_type,wait_event,pg_blocking_pids(pid) AS blockers FROM pg_stat_activity WHERE pid=$1',[cpid])).rows[0];
  if(state.blockers.length){result.waiting=state;break;}await new Promise(resolve=>setTimeout(resolve,20));
 }
 assert(result.waiting?.blockers.length);await w.query('COMMIT');
 result.waitResult=(await waiting).rows;assert.deepEqual(result.waitResult,[]);
 result.final=(await o.query(read)).rows;assert.equal(result.final[0].available,1);
 writeFileSync('docs/article-work/postgresql-rebuild/core/architecture-observed.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
}finally{for(const client of clients){await client.query('ROLLBACK').catch(()=>{});await client.end();}}
