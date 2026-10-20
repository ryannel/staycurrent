import assert from 'node:assert/strict';
import { execFileSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fixture, selectOrders, summary, insertOrder, insertItem, reserve, checkout } from './queries.mjs';
import { customers, orders, items, products, joinedRows, summaries, orderState, race } from './models.mjs';
// Defaults are the original runtime; a fresh isolated cluster can be named through the environment.
const bin = process.env.REL3_A00_BIN || '/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/';
const port = process.env.REL3_A00_PORT || '57319';
const user = process.env.REL3_A00_USER || 'staycurrent';
const database = process.env.REL3_A00_DB || 'rel3_a00_run1';
assert.match(database, /^rel3_a00_run[0-9]+$/);
const connection = `postgresql://${user}@127.0.0.1:${port}/${database}`;
const args = ['--no-psqlrc', connection, '-v', 'ON_ERROR_STOP=1', '-X', '-q', '-A', '-t'];
const sql = text => execFileSync(bin + 'psql', [...args, '-c', text], { encoding: 'utf8' }).trim();
const json = query => JSON.parse(sql(`SELECT COALESCE(json_agg(r),'[]'::json) FROM (${query.replace(/;\s*$/, '')}) r;`));
const lines = text => text.split('\n').map(line => line.trim()).filter(Boolean);
execFileSync(bin + 'createdb', ['-h','127.0.0.1','-p',port,'-U',user,database]);
sql(fixture);
// The tables shown under "Tables, keys and relationships" are the fixture's rows.
assert.deepEqual(json('SELECT * FROM customers ORDER BY customer_id'), customers);
assert.deepEqual(json('SELECT order_id, customer_id, status, shipped_at FROM orders ORDER BY order_id'), orders);
assert.deepEqual(json('SELECT * FROM order_items ORDER BY order_id, product_id'), items);
assert.deepEqual(json('SELECT * FROM products ORDER BY product_id'), products);
assert.deepEqual(json(selectOrders), [{ order_id:101, status:'paid' }]);
const inner = json(summary);
assert.deepEqual(inner, [{ order_id:101, name:'Mina', item_total_gbp:36 }]);
const outer = json(summary.replace('JOIN order_items', 'LEFT JOIN order_items'));
assert.deepEqual(outer, [{ order_id:101, name:'Mina', item_total_gbp:36 }, { order_id:102, name:'Arun', item_total_gbp:null }]);
for (const keep of [false, true]) {
  const actual = json(`SELECT o.order_id, c.name AS customer, i.product_id, i.quantity, i.unit_price_gbp FROM orders o JOIN customers c USING(customer_id) ${keep ? 'LEFT ' : ''}JOIN order_items i USING(order_id) ORDER BY o.order_id, i.product_id`);
  assert.deepEqual(actual, joinedRows(keep).map(({status, ...row}) => row));
  assert.deepEqual((keep ? outer : inner).map(row => ({ order_id:row.order_id, customer:row.name, total:row.item_total_gbp })), summaries(keep).map(({joined_count,item_count,...row}) => row));
}
assert.equal(sql("SELECT count(*) || ',' || count(i.product_id) FROM orders o LEFT JOIN order_items i USING(order_id) WHERE o.order_id=102"), '1,0');
assert.equal(sql('SELECT count(*) FROM orders WHERE shipped_at = NULL'), '0');
assert.equal(sql('SELECT count(*) FROM orders WHERE shipped_at IS NULL'), '2');
const state = () => ({ order:sql('SELECT count(*) FROM orders WHERE order_id=103') === '1', item:sql('SELECT count(*) FROM order_items WHERE order_id=103') === '1', stock:Number(sql("SELECT available FROM products WHERE product_id='MUG'")) });
const clear = () => sql("DELETE FROM order_items WHERE order_id IN (103,104); DELETE FROM orders WHERE order_id IN (103,104); UPDATE products SET available=1 WHERE product_id='MUG';");
// Figure 2: separate commits, rollback and commit.
sql(insertOrder); sql(insertItem);
assert.deepEqual(state(), orderState(4,false,true).visible);
clear();
sql(`BEGIN; ${insertOrder} ${insertItem} ROLLBACK;`);
assert.deepEqual(state(), orderState(4,true,true).visible);
// The listing stops at RETURNING; the prose says the application then commits.
assert.equal(sql(`${checkout}\nCOMMIT;`), '0');
assert.deepEqual(state(), orderState(4,true,false).visible);
// Figure 3: two buyers for the last mug, in competing sessions.
const run = promisify(execFile);
const arunOrder = insertOrder.replace('103, 1', '104, 2');
const arunItem = insertItem.replace('(103,', '(104,');
const accepted = () => json('SELECT order_id FROM orders WHERE order_id IN (103,104) ORDER BY order_id').map(row => row.order_id);
const read = "SELECT available FROM products WHERE product_id = 'MUG';";
const writeZero = "UPDATE products SET available = 0 WHERE product_id = 'MUG';";
clear();
const minaRead = run(bin + 'psql', [...args, '-c', `BEGIN; ${insertOrder} ${insertItem} ${read} SELECT pg_sleep(0.6); ${writeZero} SELECT pg_sleep(0.6); COMMIT;`]);
await new Promise(resolve => setTimeout(resolve, 200));
const arunRead = run(bin + 'psql', [...args, '-c', `BEGIN; ${arunOrder} ${arunItem} ${read} SELECT pg_sleep(0.6); ${writeZero} COMMIT;`]);
const [m1, a1] = await Promise.all([minaRead, arunRead]);
assert.deepEqual([lines(m1.stdout), lines(a1.stdout)], [['1'], ['1']]);
const readThenWrite = { accepted: accepted(), available: Number(sql(read)) };
assert.deepEqual(readThenWrite, { accepted: race(false).accepted, available: race(false).available });
clear();
const minaReserve = run(bin + 'psql', [...args, '-c', `BEGIN; ${insertOrder} ${insertItem} ${reserve} SELECT pg_sleep(1); COMMIT;`]);
await new Promise(resolve => setTimeout(resolve, 200));
const arunReserve = run(bin + 'psql', [...args, '-c', `BEGIN; ${arunOrder} ${arunItem} ${reserve} ROLLBACK;`]);
const [m2, a2] = await Promise.all([minaReserve, arunReserve]);
assert.deepEqual([lines(m2.stdout), lines(a2.stdout)], [['0'], []]);
const conditional = { accepted: accepted(), available: Number(sql(read)) };
assert.deepEqual(conditional, { accepted: race(true).accepted, available: race(true).available });
// Figure 4: retries under a unique purchase-attempt identifier, on the same fixture plus one column.
const fails = text => { try { sql(text); return null; } catch (error) { return String(error.stderr).trim(); } };
const named = name => ['--no-psqlrc', `${connection}?application_name=${name}`, '-v', 'ON_ERROR_STOP=1', '-X', '-q', '-A', '-t'];
const attempt = (orderId, extra = '') => `BEGIN; INSERT INTO orders (order_id, customer_id, status, purchase_attempt) VALUES (${orderId}, 1, 'pending_payment', 'R103'); ${insertItem.replace('(103,', `(${orderId},`)} ${reserve} ${extra}`;
const holders = () => json("SELECT order_id FROM orders WHERE purchase_attempt = 'R103' ORDER BY order_id").map(row => row.order_id);
const timed = async promise => { const start = Date.now(); try { const out = await promise; return { ms: Date.now() - start, out: lines(out.stdout), error: null }; } catch (error) { return { ms: Date.now() - start, out: [], error: String(error.stderr).trim() }; } };
clear();
sql('ALTER TABLE orders ADD COLUMN purchase_attempt text UNIQUE;');
// (a) After the first attempt committed, a retry with R103 under another order id is refused; order 103 is returned.
assert.equal(sql(`${attempt(103)} COMMIT;`), '0');
const retryAfterCommit = fails(`${attempt(150)} COMMIT;`);
assert.match(retryAfterCommit, /duplicate key value violates unique constraint "orders_purchase_attempt_key"/);
assert.deepEqual(holders(), [103]);
assert.equal(sql(read), '0');
// (b) While the first attempt is still open, the retry waits; when the first session ends without committing, the retry commits.
clear();
const firstOpen = run(bin + 'psql', [...named('a00_first'), '-c', `${attempt(103)} SELECT pg_sleep(30); COMMIT;`]).catch(error => error);
await new Promise(resolve => setTimeout(resolve, 300));
const retryWhileOpen = timed(run(bin + 'psql', [...args, '-c', `${attempt(103)} COMMIT;`]));
await new Promise(resolve => setTimeout(resolve, 1000));
sql("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE application_name = 'a00_first';");
const waited = await retryWhileOpen; await firstOpen;
assert.equal(waited.error, null);
assert.deepEqual(waited.out, ['0']);
assert.ok(waited.ms >= 900, `retry should have waited, took ${waited.ms} ms`);
assert.deepEqual(holders(), [103]);
// (c) While the first attempt is still open and then commits, the retry waits and is then refused.
clear();
const firstCommits = run(bin + 'psql', [...args, '-c', `${attempt(103)} SELECT pg_sleep(1); COMMIT;`]);
await new Promise(resolve => setTimeout(resolve, 300));
const retryThenRefused = await timed(run(bin + 'psql', [...args, '-c', `${attempt(150)} COMMIT;`]));
await firstCommits;
assert.match(retryThenRefused.error, /duplicate key value violates unique constraint "orders_purchase_attempt_key"/);
assert.ok(retryThenRefused.ms >= 500, `retry should have waited, took ${retryThenRefused.ms} ms`);
assert.deepEqual(holders(), [103]);
sql('ALTER TABLE orders DROP COLUMN purchase_attempt;');
// Figure 6: a required delivery instruction meets the old application version (orders 114 and 115).
const oldVersion = id => `INSERT INTO orders (order_id, customer_id, status) VALUES (${id}, 2, 'pending_payment');`;
const dropLater = () => sql('DELETE FROM orders WHERE order_id IN (114, 115);');
// Early path: adding the column as required fails, and the old version's next order is accepted unchanged.
const addRequired = fails('ALTER TABLE orders ADD COLUMN delivery_instruction text NOT NULL;');
assert.match(addRequired, /column "delivery_instruction" of relation "orders" contains null values/);
sql(oldVersion(114));
// Early path, continued: fill every row and require the value at once; the old version's next order is rejected.
sql("ALTER TABLE orders ADD COLUMN delivery_instruction text; UPDATE orders SET delivery_instruction = 'Leave at reception' WHERE order_id = 101; UPDATE orders SET delivery_instruction = 'Ring twice' WHERE order_id = 114; UPDATE orders SET delivery_instruction = 'From courier records' WHERE delivery_instruction IS NULL; ALTER TABLE orders ALTER COLUMN delivery_instruction SET NOT NULL;");
const oldAfterRequire = fails(oldVersion(115));
assert.match(oldAfterRequire, /null value in column "delivery_instruction" of relation "orders" violates not-null constraint/);
dropLater(); sql('ALTER TABLE orders DROP COLUMN delivery_instruction;');
// Staged path: optional column, old order accepted with NULL, new version supplies a value, rows filled, then required.
sql('ALTER TABLE orders ADD COLUMN delivery_instruction text;');
sql(oldVersion(114));
assert.equal(sql('SELECT delivery_instruction IS NULL FROM orders WHERE order_id = 114'), 't');
sql("INSERT INTO orders (order_id, customer_id, status, delivery_instruction) VALUES (115, 1, 'pending_payment', 'Side gate');");
sql("UPDATE orders SET delivery_instruction = 'Leave at reception' WHERE order_id = 101; UPDATE orders SET delivery_instruction = 'Ring twice' WHERE order_id = 114; UPDATE orders SET delivery_instruction = 'From courier records' WHERE delivery_instruction IS NULL;");
assert.equal(sql('SELECT count(*) FROM orders WHERE delivery_instruction IS NULL'), '0');
sql('ALTER TABLE orders ALTER COLUMN delivery_instruction SET NOT NULL;');
dropLater(); sql('ALTER TABLE orders DROP COLUMN delivery_instruction;');
const evidence = { figure4: { retry_after_commit: retryAfterCommit, retry_while_open_ms: waited.ms, retry_then_refused_ms: retryThenRefused.ms, retry_then_refused: retryThenRefused.error }, figure6: { add_required: addRequired, old_after_require: oldAfterRequire } };
const version = sql('SELECT version()');
console.log(JSON.stringify({version,inner,outer,counts:{empty_outer_rows:1,empty_item_count:0},read_then_write:{mina_read:'1',arun_read:'1',...readThenWrite},conditional:{mina:'0',arun:'no row',...conditional},...evidence,checks:'fixture rows, SQL results, models, separate commits, rollback, checkout listing commit, two-buyer read-then-write and conditional update, Figure 4 retries (a) to (c), Figure 6 rejections and staged path: passed'},null,2));
