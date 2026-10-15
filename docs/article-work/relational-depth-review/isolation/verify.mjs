import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

// Run only against the disposable database named below. The script owns the
// isolation_review schema and replaces that schema when the experiment repeats.
const require = createRequire(import.meta.url);
const { Client } = require(process.env.PG_MODULE_PATH || '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js');
const config = {
  host: process.env.PGHOST || '/private/tmp/staycurrent-relational-depth/socket',
  port: Number(process.env.PGPORT || 55439),
  user: process.env.PGUSER || 'ryannel',
  database: 'sc_depth_isolation',
};
const admin = new Client({ ...config, database: 'postgres' });
await admin.connect();
if (!(await admin.query("SELECT 1 FROM pg_database WHERE datname = 'sc_depth_isolation'")).rowCount) {
  await admin.query('CREATE DATABASE sc_depth_isolation');
}
await admin.end();
const observer = new Client(config), a = new Client(config), b = new Client(config);
await Promise.all([observer.connect(), a.connect(), b.connect()]);
const report = { checkedAt: new Date().toISOString(), version: (await observer.query('SELECT version()')).rows[0].version, trials: [] };
const flags = () => observer.query('SELECT product_id, enabled FROM featured_products ORDER BY product_id').then(r => r.rows);
const hide = id => ({ text: `UPDATE featured_products SET enabled = false
WHERE product_id = $1 AND EXISTS (
  SELECT 1 FROM featured_products WHERE product_id = $2 AND enabled
) RETURNING product_id`, values: [id, id === 'P7' ? 'P8' : 'P7'] });
const reset = async () => {
  await Promise.all([a.query('ROLLBACK'), b.query('ROLLBACK')]);
  await observer.query('UPDATE featured_products SET enabled = true');
};
try {
  await observer.query('DROP SCHEMA IF EXISTS isolation_review CASCADE; CREATE SCHEMA isolation_review');
  for (const client of [observer, a, b]) {
    await client.query("SET search_path = isolation_review; SET statement_timeout = '8s'");
  }
  const base = await readFile(new URL('../../designing-data/schema.sql', import.meta.url), 'utf8');
  await observer.query(base);
  await observer.query(`CREATE TABLE featured_products (
    product_id text PRIMARY KEY REFERENCES products(product_id), enabled boolean NOT NULL);
    INSERT INTO featured_products VALUES ('P7', true), ('P8', true);
    CREATE TABLE display_control (display_id text PRIMARY KEY);
    INSERT INTO display_control VALUES ('front-page')`);

  for (const level of ['READ COMMITTED', 'REPEATABLE READ']) {
    await observer.query("UPDATE products SET current_price = 20 WHERE product_id = 'P7'");
    await a.query(`BEGIN ISOLATION LEVEL ${level} READ ONLY`);
    const before = (await a.query("SELECT current_price FROM products WHERE product_id = 'P7'")).rows[0].current_price;
    await b.query("BEGIN; UPDATE products SET current_price = 22 WHERE product_id = 'P7'; COMMIT");
    const after = (await a.query("SELECT current_price FROM products WHERE product_id = 'P7'")).rows[0].current_price;
    await a.query('COMMIT');
    const fresh = (await a.query("SELECT current_price FROM products WHERE product_id = 'P7'")).rows[0].current_price;
    assert.equal(before, '20.00'); assert.equal(after, level === 'READ COMMITTED' ? '22.00' : '20.00'); assert.equal(fresh, '22.00');
    report.trials.push({ trial: 'price views', level, before, after, fresh });
  }

  await reset();
  await a.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
  await b.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
  const ar = (await a.query(hide('P7'))).rows;
  const br = (await b.query(hide('P8'))).rows;
  await a.query('COMMIT'); await b.query('COMMIT');
  const skewFlags = await flags();
  assert.deepEqual(ar, [{ product_id: 'P7' }]); assert.deepEqual(br, [{ product_id: 'P8' }]);
  assert.ok(skewFlags.every(r => !r.enabled));
  report.trials.push({ trial: 'write skew', level: 'REPEATABLE READ', aReturned: ar, bReturned: br, flags: skewFlags });

  await reset();
  await a.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
  await b.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
  const failures = [], provisional = [];
  for (const [label, client, product] of [['A', a, 'P7'], ['B', b, 'P8']]) {
    try { provisional.push({ connection: label, rows: (await client.query(hide(product))).rows }); }
    catch (error) { failures.push({ connection: label, at: 'UPDATE', code: error.code }); }
  }
  for (const [label, client] of [['A', a], ['B', b]]) {
    if (failures.some(f => f.connection === label)) { await client.query('ROLLBACK'); continue; }
    try { await client.query('COMMIT'); }
    catch (error) { failures.push({ connection: label, at: 'COMMIT', code: error.code }); await client.query('ROLLBACK'); }
  }
  assert.equal(failures.length, 1); assert.equal(failures[0].code, '40001');
  const afterRejection = await flags();
  assert.equal(afterRejection.filter(r => r.enabled).length, 1);
  const failed = failures[0].connection === 'A' ? a : b;
  const failedProduct = failures[0].connection === 'A' ? 'P7' : 'P8';
  await failed.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
  const retried = (await failed.query(hide(failedProduct))).rows;
  await failed.query('COMMIT');
  assert.equal(retried.length, 0); assert.deepEqual(await flags(), afterRejection);
  report.trials.push({ trial: 'serializable and complete retry', provisional, failures, afterRejection, retryRows: retried, finalFlags: await flags() });

  const bPid = (await b.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
  const controlLock = "SELECT display_id FROM display_control WHERE display_id = 'front-page' FOR UPDATE";
  for (const level of ['READ COMMITTED', 'REPEATABLE READ']) {
    await reset();
    await a.query(`BEGIN ISOLATION LEVEL ${level}`); await b.query(`BEGIN ISOLATION LEVEL ${level}`);
    await a.query(controlLock);
    // Queue B's lock but do not await it: A must finish to release the lock.
    const blockedLock = b.query(controlLock).then(result => ({ result }), error => ({ error }));
    let waiting;
    for (let i = 0; i < 100; i++) {
      await observer.query('SELECT pg_stat_clear_snapshot()');
      const state = (await observer.query('SELECT wait_event_type, wait_event FROM pg_stat_activity WHERE pid = $1', [bPid])).rows[0];
      if (state.wait_event_type === 'Lock') { waiting = state; break; }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.ok(waiting, 'B must actually wait for A before the writer commits');
    const aView = (await a.query('SELECT product_id, enabled FROM featured_products ORDER BY product_id')).rows;
    assert.ok(aView.every(r => r.enabled));
    await a.query(hide('P7')); await a.query('COMMIT');
    const resumed = await blockedLock;
    if (resumed.error) throw resumed.error;
    const bView = (await b.query('SELECT product_id, enabled FROM featured_products ORDER BY product_id')).rows;
    const bChanged = (await b.query(hide('P8'))).rows;
    await b.query('COMMIT');
    const finalFlags = await flags();
    if (level === 'READ COMMITTED') {
      assert.equal(bView[0].enabled, false); assert.equal(bChanged.length, 0); assert.equal(finalFlags[1].enabled, true);
    } else {
      assert.equal(bView[0].enabled, true); assert.equal(bChanged.length, 1); assert.ok(finalFlags.every(r => !r.enabled));
    }
    report.trials.push({ trial: 'unchanged shared control row', level, waiting, bViewAfterWait: bView, bReturned: bChanged, finalFlags });
  }
  await reset();
  await observer.query("UPDATE products SET current_price = 20 WHERE product_id = 'P7'");
  report.finalState = { price: 20, flags: await flags(), participantsEnded: true };
  await writeFile(new URL('observed.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await Promise.allSettled([a.query('ROLLBACK'), b.query('ROLLBACK')]);
  await Promise.all([a.end(), b.end(), observer.end()]);
}
