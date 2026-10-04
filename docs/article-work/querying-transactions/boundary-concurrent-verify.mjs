// Run from the repository root. Uses the already-installed local PGlite runtime.
// SQL is extracted from the pages so a passing check verifies the displayed text.
// This is single-session execution, not a concurrency test.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PGlite } from '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';

const root = process.cwd();
const base = readFileSync(`${root}/docs/article-work/designing-data/schema.sql`, 'utf8');
const readSQL = (page, name) => {
  const source = readFileSync(`${root}/src/pages/learn/databases/relational/${page}.astro`, 'utf8');
  const match = source.match(new RegExp('const ' + name + ' = `([\\s\\S]*?)`;'));
  assert.ok(match, `Missing displayed SQL: ${page}/${name}`);
  return match[1];
};
const boundary = name => readSQL('transaction-boundaries', name);
const concurrent = name => readSQL('concurrent-updates', name);
const fresh = async setup => { const db = new PGlite(); await db.exec(base); await db.exec(setup); return db; };
const state = async db => (await db.exec(boundary('verify'))).map(r => Object.values(r.rows[0])[0]);
let db = await fresh(boundary('stockSetup'));
console.log((await db.query('SELECT version()')).rows[0].version);
let result = await db.exec(boundary('reserve'));
assert.deepEqual(result.at(-1).rows, [{ product_id: 'P7', available: 1 }]);
await db.exec(boundary('finish'));
assert.deepEqual(await state(db), [1, 1, 1]);
await db.close();
console.log('Boundary success: availability 1, one order and one line.');

db = await fresh(boundary('stockSetup'));
const failure = boundary('failure');
await assert.rejects(db.exec(failure.split('-- Issue this after the error')[0]), error => error.code === '23514');
await assert.rejects(db.query('SELECT 1'), error => error.code === '25P02');
await db.exec(failure.slice(failure.lastIndexOf('ROLLBACK;')));
assert.deepEqual(await state(db), [3, 0, 0]);
await db.close();
console.log('Boundary failure: check rejects zero, transaction fails, rollback restores [3, 0, 0].');

db = await fresh(boundary('stockSetup'));
await db.exec("UPDATE stock SET available = 1 WHERE product_id = 'P7'");
result = await db.exec(boundary('reserve'));
assert.deepEqual(result.at(-1).rows, []);
await db.exec('ROLLBACK');
assert.deepEqual(await state(db), [1, 0, 0]);
await db.close();
console.log('Boundary insufficient stock: no row returned; rollback leaves no purchase.');

db = await fresh(concurrent('setup'));
result = await db.exec(concurrent('guarded'));
assert.deepEqual(result.at(-1).rows, [{ product_id: 'P7', available: 0 }]);
await db.exec(concurrent('orderA'));
assert.deepEqual(await state(db), [0, 1, 1]);
result = await db.exec(concurrent('guarded'));
assert.deepEqual(result.at(-1).rows, []);
await db.exec('ROLLBACK');
await db.close();
console.log('Conditional update: first reservation returns [P7, 0]; later reservation returns none.');

db = await fresh(concurrent('setup'));
result = await db.exec(concurrent('locking'));
assert.deepEqual(result[1].rows, [{ available: 1 }]);
await db.exec(concurrent('orderA'));
assert.deepEqual(await state(db), [0, 1, 1]);
await db.close();
console.log('Locking-read positive branch: read 1, reserve, insert, commit gives [0, 1, 1].');

db = await fresh(concurrent('setup'));
result = await db.exec(concurrent('unsafeRead'));
assert.deepEqual(result.at(-1).rows, [{ available: 1 }]);
await db.exec(concurrent('unsafeWrite'));
await db.exec(concurrent('orderA'));
await db.exec('BEGIN ISOLATION LEVEL READ COMMITTED');
await db.exec(concurrent('unsafeWrite'));
await db.exec(concurrent('orderA').replaceAll('O14', 'O15'));
assert.equal((await db.query("SELECT available FROM stock WHERE product_id = 'P7'")).rows[0].available, 0);
assert.equal((await db.query("SELECT count(*) AS n FROM orders WHERE order_id IN ('O14','O15')")).rows[0].n, 2);
await db.close();
console.log('Replaying two stale literal writes permits two orders at stock 0; this does not test waiting.');
