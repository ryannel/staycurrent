import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { PGlite } from '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';

// One embedded PostgreSQL session. This verifies commands and sequential
// branches, not the overlapping sessions, waits, deadlocks or lost replies.
const db = new PGlite();
const results = { scope: 'single-session only', checks: [] };
const isolation = await readFile('src/pages/learn/databases/relational/isolation.astro', 'utf8');
const retries = await readFile('src/pages/learn/databases/relational/conflicts-and-retries.astro', 'utf8');
function sql(source, name) {
  const value = source.match(new RegExp('const ' + name + ' = `([\\s\\S]*?)`;'));
  if (!value) throw new Error(`Missing SQL literal: ${name}`);
  return value[1];
}
async function query(label, statement) {
  const value = await db.query(statement);
  results.checks.push({ label, rows: value.rows });
  return value.rows;
}
async function expectError(label, statement, code) {
  await assert.rejects(db.query(statement), error => {
    results.checks.push({ label, sqlstate: error.code });
    assert.equal(error.code, code);
    return true;
  });
}
results.version = (await db.query('SELECT version() AS version')).rows[0].version;
await db.exec(await readFile('docs/article-work/designing-data/schema.sql', 'utf8'));
const reportResults = await db.exec(sql(isolation, 'report'));
assert.deepEqual(reportResults.filter(result => result.rows.length).map(result => result.rows[0].current_price), ['20.00', '20.00']);
results.checks.push({ label: 'Read-only RR report without concurrent writer', prices: ['20.00', '20.00'] });
await db.exec(sql(isolation, 'writer'));
assert.deepEqual(await query('Writer sets catalogue price', "SELECT current_price FROM products WHERE product_id='P7'"), [{ current_price: '22.00' }]);
await db.exec("UPDATE products SET current_price=20 WHERE product_id='P7'");
const ownResults = await db.exec(sql(isolation, 'ownWrite'));
assert.deepEqual(ownResults.filter(result => result.rows.length).map(result => result.rows[0].current_price), ['21.00', '21.00']);
results.checks.push({ label: 'RR own update and read before rollback', prices: ['21.00', '21.00'] });
assert.deepEqual(await query('Rollback restores current price', "SELECT current_price FROM products WHERE product_id='P7'"), [{ current_price:'20.00' }]);
await db.exec(sql(isolation, 'featured'));
const hideA = sql(isolation, 'hide');
const hideB = hideA.replaceAll("'P7'", "'TEMP'").replaceAll("'P8'", "'P7'").replaceAll("'TEMP'", "'P8'");
let executed = await db.exec(hideA);
assert.deepEqual(executed.flatMap(result => result.rows), [{ product_id: 'P7' }]);
executed = await db.exec(hideB);
assert.deepEqual(executed.flatMap(result => result.rows), []);
assert.deepEqual(await query('Sequential RR decisions leave Bowl enabled', 'SELECT product_id,enabled FROM featured_products ORDER BY product_id'), [{ product_id:'P7', enabled:false }, { product_id:'P8', enabled:true }]);
await db.exec('UPDATE featured_products SET enabled=true');
await db.exec(hideA.replace('REPEATABLE READ', 'SERIALIZABLE'));
await db.exec(hideB.replace('REPEATABLE READ', 'SERIALIZABLE'));
assert.deepEqual(await query('Sequential Serializable decisions preserve same rule', 'SELECT product_id,enabled FROM featured_products ORDER BY product_id'), [{ product_id:'P7', enabled:false }, { product_id:'P8', enabled:true }]);

await db.exec(sql(retries, 'setup'));
await db.exec('BEGIN ISOLATION LEVEL READ COMMITTED');
assert.deepEqual(await query('Fresh K14 claims O14', sql(retries, 'claim')), [{ order_id:'O14' }]);
const reservation = await db.exec(sql(retries, 'reserve'));
assert.deepEqual(reservation[0].rows, [{ available:1 }]);
await db.exec('COMMIT');
assert.deepEqual(await query('Committed checkout K14 lookup', sql(retries, 'lookup')), [{ order_id:'O14', customer_id:'C4', product_id:'P7', quantity:2, unit_price:'20.00' }]);
await db.exec('BEGIN ISOLATION LEVEL READ COMMITTED');
assert.deepEqual(await query('K14 repeated with candidate O15 inserts nothing', sql(retries, 'claim').replaceAll('O14','O15')), []);
const existing = await query('Duplicate recovers original O14', sql(retries, 'lookup'));
assert.equal(existing[0].order_id, 'O14');
assert.notEqual(existing[0].quantity, 3, 'A conflicting quantity must not be treated as the same request');
await db.exec('COMMIT');
assert.deepEqual(await query('Duplicate branch leaves stock unchanged', "SELECT available FROM stock WHERE product_id='P7'"), [{ available:1 }]);
assert.deepEqual(await query('Duplicate branch leaves one K14 order', "SELECT count(*)::integer AS count FROM orders WHERE operation_id='K14'"), [{ count:1 }]);

await db.exec('BEGIN');
assert.deepEqual(await query('Insufficient-stock attempt first claims K15', sql(retries, 'claim').replaceAll('O14','O15').replaceAll('K14','K15')), [{ order_id:'O15' }]);
assert.deepEqual(await query('Two mugs no longer available', "UPDATE stock SET available=available-2 WHERE product_id='P7' AND available>=2 RETURNING available"), []);
await db.exec('ROLLBACK');
assert.deepEqual(await query('Rollback removes provisional order and key', "SELECT order_id FROM orders WHERE operation_id='K15'"), []);

await db.exec('BEGIN');
await db.query(sql(retries, 'claim').replaceAll('O14','O16').replaceAll('K14','K16'));
await db.query("UPDATE stock SET available=available-1 WHERE product_id='P7'");
await expectError('Failed line after successful reservation', "INSERT INTO order_lines(order_id,line_no,product_id,quantity,unit_price) VALUES('O16',1,'P7',0,20)", '23514');
await db.exec('ROLLBACK');
assert.deepEqual(await query('Failure rollback restores stock', "SELECT available FROM stock WHERE product_id='P7'"), [{ available:1 }]);
assert.deepEqual(await query('Failure rollback removes operation', "SELECT order_id FROM orders WHERE operation_id='K16'"), []);
await expectError('Unrelated order PK conflict is not operation recovery', sql(retries, 'claim').replaceAll('K14','K99'), '23505');
const locks = await db.exec(sql(retries, 'lockOrder'));
assert.deepEqual(locks.flatMap(result => result.rows).map(row => row.product_id), ['P7','P8']);
results.checks.push({ label: 'Lock-inspection query returns sorted IDs and rolls back', product_ids:['P7','P8'] });
assert.deepEqual(await query('Historical O12 price unchanged', "SELECT quantity*unit_price AS total FROM order_lines WHERE order_id='O12' AND line_no=1"), [{ total:'36.00' }]);
await writeFile('docs/article-work/querying-transactions/isolation-retry-results.json', JSON.stringify(results,null,2)+'\n');
await db.close();
console.log(`${results.checks.length} single-session checks passed. ${results.version}`);
