import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();
const result = {runtime:'PGlite 0.5.8 / PostgreSQL 18.3 WASM',checks:[]};
try {
  await db.waitReady;
  result.version=(await db.query('SELECT version() AS version')).rows[0].version;
  assert.match(result.version,/PostgreSQL 18\.3/);
  await db.exec(`CREATE TABLE orders(order_id integer PRIMARY KEY,
    customer_id integer NOT NULL,placed_at timestamptz NOT NULL,status text NOT NULL);
    INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),
      (102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending')`);
  const source=fs.readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
  const sql=[...source.matchAll(/<Sql label="([^"]+)" code=\{`([\s\S]*?)`\} \/>/g)].map(x=>({label:x[1],sql:x[2]}));
  result.displayedSql=sql;
  const first=(await db.query(sql[0].sql)).rows;
  assert.deepEqual(first.map(x=>[x.order_id,x.status]),[[103,'pending'],[101,'paid']]);
  result.checks.push({name:'exact-displayed-history',rows:first});
  const bounded=sql.find(x=>x.label==='Apply limits only to this explicit attempt');
  const boundedRows=await db.exec(bounded.sql);
  assert.deepEqual(boundedRows[3].rows.map(x=>x.order_id),[103,101]);
  result.checks.push({name:'exact-displayed-local-timeout-attempt',results:boundedRows});
  const settings=(await db.query("SELECT current_setting('lock_timeout') AS lock_timeout,current_setting('statement_timeout') AS statement_timeout")).rows;
  assert.deepEqual(settings,[{lock_timeout:'0',statement_timeout:'0'}]);
  result.checks.push({name:'SET-LOCAL-does-not-leak-after-commit',settings});
  for(const label of ['Sample client activity in the current database','Count client sessions and inspect the admission settings','Retain I/O counters for the same incident window']) {
    const item=sql.find(x=>x.label===label);
    result.checks.push({name:'displayed-SQL-schema-check',label,results:await db.exec(item.sql)});
  }
  const pid=(await db.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
  for(const [label,params] of [
    ['Follow the identified waiter to its immediate blockers',[pid]],
    ['Inspect the two sessions’ table-lock requests',[pid,pid]]
  ]) {
    const item=sql.find(x=>x.label===label);
    result.checks.push({name:'displayed-parameterised-SQL-schema-check',label,rows:(await db.query(item.sql,params)).rows});
  }
  result.success=true;
} finally {
  await db.close(); result.closed=true;
  fs.writeFileSync(new URL('./pglite-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
}
console.log('PGlite ordinary SQL checks passed; disposable instance closed.');
