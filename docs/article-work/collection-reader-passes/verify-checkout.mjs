import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const root = new URL('../../../', import.meta.url);
const source = await readFile(new URL('src/pages/learn/databases/relational/conflicts-and-retries.astro', root), 'utf8');
const seed = await readFile(new URL('docs/article-work/designing-data/schema.sql', root), 'utf8');
const sql = Object.fromEntries(['setup', 'claim', 'reserve', 'insertLine', 'commit', 'lookup'].map(name => {
  const match = source.match(new RegExp('const ' + name + ' = `([\\s\\S]*?)`;'));
  assert.ok(match, name);
  return [name, match[1]];
}));
const db = await PGlite.create();
await db.exec(seed + sql.setup);
assert.deepEqual((await db.exec(sql.claim)).flatMap(r => r.rows), [{ order_id: 'O14' }]);
assert.deepEqual((await db.query(sql.reserve)).rows, [{ available: 1 }]);
await db.exec(sql.insertLine);
await db.exec(sql.commit);
const purchase = (await db.query(sql.lookup)).rows;
assert.deepEqual(purchase, [{ order_id: 'O14', customer_id: 'C4', product_id: 'P7', quantity: 2, unit_price: '20.00' }]);

// The empty claim branch skips both purchase writes and recovers the same order.
assert.deepEqual((await db.exec(sql.claim.replaceAll('O14', 'O15'))).flatMap(r => r.rows), []);
assert.deepEqual((await db.query(sql.lookup)).rows, purchase);
await db.exec('ROLLBACK;');
assert.equal((await db.query("SELECT available FROM stock WHERE product_id='P7'")).rows[0].available, 1);

// A genuinely new claim can succeed while its reservation fails. Do not insert a line.
assert.deepEqual((await db.exec(sql.claim.replaceAll('O14', 'O16').replaceAll('K14', 'K16'))).flatMap(r => r.rows), [{ order_id: 'O16' }]);
assert.deepEqual((await db.query(sql.reserve)).rows, []);
await db.exec('ROLLBACK;');
assert.deepEqual((await db.query("SELECT order_id FROM orders WHERE operation_id='K16'")).rows, []);
const result = { checkedAt: '2026-10-15', version: (await db.query('SELECT version()')).rows[0].version,
  passed: ['fresh claim, checked reservation, line and commit', 'duplicate claim recovers without reserving again', 'empty reservation rolls back provisional order'],
  limitation: 'One real PostgreSQL connection through PGlite. Does not simulate concurrent claim waits or lost commit responses.' };
await writeFile(new URL('checkout-verification.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
await db.close();
console.log(result);
