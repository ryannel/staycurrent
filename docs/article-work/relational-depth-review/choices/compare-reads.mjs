import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
const config = { host: process.env.PGHOST || '/private/tmp/staycurrent-relational-depth/socket', port: Number(process.env.PGPORT || 55439), user: process.env.PGUSER || 'ryannel', database: 'sc_depth_choices' };
const a = new pg.Client(config), b = new pg.Client(config);
await a.connect(); await b.connect();
const evidence = { version: (await a.query('SELECT version()')).rows[0].version, schedules: [] };
try {
  for (const level of ['READ COMMITTED', 'REPEATABLE READ']) {
    await a.query('DROP TABLE IF EXISTS depth_contract_orders; CREATE TABLE depth_contract_orders (order_id integer PRIMARY KEY); INSERT INTO depth_contract_orders VALUES (101)');
    await a.query(`BEGIN ISOLATION LEVEL ${level}`);
    const first = Number((await a.query('SELECT count(*) AS orders FROM depth_contract_orders')).rows[0].orders);
    await b.query('INSERT INTO depth_contract_orders VALUES (102)');
    const second = Number((await a.query('SELECT count(*) AS orders FROM depth_contract_orders')).rows[0].orders);
    await a.query('COMMIT');
    const after = Number((await a.query('SELECT count(*) AS orders FROM depth_contract_orders')).rows[0].orders);
    assert.equal(first, 1); assert.equal(after, 2);
    assert.equal(second, level === 'READ COMMITTED' ? 2 : 1);
    evidence.schedules.push({ isolation: level, first, otherWriterCommitted: true, second, after });
  }
  await writeFile(new URL('./postgresql-reads-observed.json', import.meta.url), JSON.stringify(evidence, null, 2) + '\n');
  console.log(evidence);
} finally { await a.end(); await b.end(); }
