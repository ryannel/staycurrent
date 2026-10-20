// Checks every observed claim in "Relational databases" (relational-trial a00)
// against a disposable PostgreSQL server, using the rows in model.mjs.
//
// Usage: node verify.mjs [host] [port] [user]
//   defaults: 127.0.0.1 57501 staycurrent
// The server must be disposable: the script drops and creates the databases
// a00_verify and a00_scan. It changes no server settings; it sets
// max_parallel_workers_per_gather = 0 in its own measuring session only.
// Each psql session is driven through a pipe, and every concurrent step waits
// for an observed server state (a lock wait), never for a guessed sleep.

import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as m from './model.mjs';

const [host = '127.0.0.1', port = '57501', user = 'staycurrent'] = process.argv.slice(2);
const BIN = '/opt/homebrew/bin';
const here = dirname(fileURLToPath(import.meta.url));
const log = [];
const note = line => { log.push(line); console.log(line); };
let failures = 0;
const check = (ok, what, detail = '') => {
  note(`${ok ? 'PASS' : 'FAIL'} ${what}${ok ? '' : `\n     ${detail}`}`);
  if (!ok) failures += 1;
};

const admin = sql => execFileSync(`${BIN}/psql`, ['-X', '-q', '-h', host, '-p', port, '-U', user, '-d', 'postgres', '-c', sql], { encoding: 'utf8' });

class Session {
  constructor(name, db) {
    this.name = name;
    this.n = 0;
    this.buffer = '';
    this.waiters = [];
    this.p = spawn(`${BIN}/psql`, ['-X', '-A', '-t', '-F', '|', '-v', 'VERBOSITY=verbose', '-h', host, '-p', port, '-U', user, '-d', db], { stdio: ['pipe', 'pipe', 'pipe'] });
    const onData = chunk => { this.buffer += chunk.toString(); this.flush(); };
    this.p.stdout.on('data', onData);
    this.p.stderr.on('data', onData);
  }
  flush() {
    const w = this.waiters[0];
    if (!w) return;
    const at = this.buffer.indexOf(w.marker + '\n');
    if (at < 0) return;
    const out = this.buffer.slice(0, at).replace(/\n$/, '');
    this.buffer = this.buffer.slice(at + w.marker.length + 1);
    this.waiters.shift();
    note(out.split('\n').filter(Boolean).map(x => `[${this.name}] => ${x}`).join('\n'));
    w.resolve(out);
    this.flush();
  }
  send(sql) {
    this.n += 1;
    const marker = `__END_${this.name}_${this.n}__`;
    note(`[${this.name}] ${sql.replace(/\n/g, '\n        ')}`);
    const promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout in ${this.name}: ${sql}`)), 15000);
      this.waiters.push({ marker, resolve: out => { clearTimeout(timer); resolve(out); } });
    });
    this.p.stdin.write(`${sql}\n\\echo ${marker}\n`);
    return promise;
  }
  run(sql) { return this.send(sql); }
  close() { this.p.stdin.end('\\q\n'); }
}

const rows = out => out.split('\n').filter(line => line && !/^(BEGIN|COMMIT|ROLLBACK|SET|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|SELECT \d)/.test(line) && line.includes('|')).map(line => line.split('|'));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function waitForLock(observer, appName) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    const out = await observer.run(`SELECT wait_event_type FROM pg_stat_activity WHERE application_name = '${appName}';`);
    if (out.includes('Lock')) return true;
    await new Promise(r => setTimeout(r, 20));
  }
  return false;
}

async function main() {
  note(`# a00 verification, ${new Date().toISOString()}`);
  note(execFileSync(`${BIN}/psql`, ['--version'], { encoding: 'utf8' }).trim());
  admin('DROP DATABASE IF EXISTS a00_verify;');
  admin('CREATE DATABASE a00_verify;');
  const o = new Session('observer', 'a00_verify');
  note((await o.run("SELECT version(); SHOW default_transaction_isolation; SHOW synchronous_commit; SHOW fsync; SHOW server_encoding; SELECT datcollate FROM pg_database WHERE datname = current_database();")));
  await o.run('\\pset null NULL');

  // Section 2: the receipt join, and changes the declared rules refuse.
  note('\n## Receipt join and constraints');
  await o.run(m.fixtureSql({ with103: true }));
  check(same(rows(await o.run(m.receiptSql)), m.receiptRows), 'receipt for order 103');
  for (const r of m.rejections) {
    const out = await o.run(`BEGIN;\n${r.sql}\nROLLBACK;`);
    if (r.sqlstate) check(out.includes(`ERROR:  ${r.sqlstate}`), `rejected with ${r.sqlstate}: ${r.what}`, out);
    else check(/UPDATE 1/.test(out) && !out.includes('ERROR'), `accepted: ${r.what}`, out);
  }

  // Section 3: a first selection and a change that matches too many rows.
  await o.run("SET TIME ZONE 'UTC';");
  check(same(rows(await o.run(m.selectSql)), m.selectRows), 'Mina’s orders, oldest first');
  check((await o.run(`BEGIN;\n${m.broadUpdateSql}\nROLLBACK;`)).includes(m.broadUpdateResult), `broad cancellation reports ${m.broadUpdateResult}`);
  check((await o.run(`BEGIN;\n${m.narrowUpdateSql}\nROLLBACK;`)).includes(m.narrowUpdateResult), `narrow cancellation reports ${m.narrowUpdateResult}`);

  // Section 3, Figure 2: one question, three queries.
  note('\n## Order summary queries');
  for (const q of m.summaryQueries) {
    const got = rows(await o.run(q.sql));
    check(same(got, q.rows), `summary query "${q.label}"`, JSON.stringify(got));
  }

  // Section 4, Figure 3: two buyers for the last mug.
  note('\n## Two buyers for the last mug');
  for (const option of m.raceOptions) {
    note(`\n### ${option.label}`);
    await o.run(m.fixtureSql({ with103: false }));
    const mina = new Session('Mina', 'a00_verify');
    const tariq = new Session('Tariq', 'a00_verify');
    await mina.run("SET application_name = 'a00_mina';");
    await tariq.run("SET application_name = 'a00_tariq';");
    const steps = m.raceSteps(option.key);
    const guarded = option.key === 'guarded';
    const minaWrite = guarded
      ? "UPDATE products SET stock = stock - 1 WHERE product_id = 'P7' AND stock >= 1;\nUPDATE products SET stock = stock - 2 WHERE product_id = 'P3' AND stock >= 2;"
      : "UPDATE products SET stock = 0 WHERE product_id = 'P7';\nUPDATE products SET stock = 10 WHERE product_id = 'P3';";
    const tariqWrite = guarded
      ? "UPDATE products SET stock = stock - 1 WHERE product_id = 'P7' AND stock >= 1;"
      : "UPDATE products SET stock = 0 WHERE product_id = 'P7';";
    const begin = `BEGIN ISOLATION LEVEL ${option.isolation};\nSELECT stock FROM products WHERE product_id = 'P7';`;

    const s1 = await mina.run(begin);
    check(s1.split('\n').includes(steps[0].result), 'step 1: Mina reads 1', s1);
    const s2 = await tariq.run(begin);
    check(s2.split('\n').includes(steps[1].result), 'step 2: Tariq reads 1', s2);
    const s3 = await mina.run(`INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');\nINSERT INTO order_items VALUES (103, 1, 'P7', 1, 20.00), (103, 2, 'P3', 2, 4.50);\n${minaWrite}`);
    check((s3.match(/UPDATE 1/g) || []).length === 2, 'step 3: Mina changes the mug and tea counts', s3);
    const committed3 = await o.run("SELECT stock FROM products WHERE product_id = 'P7';");
    check(committed3.trim() === String(steps[2].committed.stock), 'step 3: others still see stock 1', committed3);
    const pending = tariq.send(`INSERT INTO orders VALUES (104, 2, '2026-10-20 10:15+00', 'pending');\nINSERT INTO order_items VALUES (104, 1, 'P7', 1, 20.00);\n${tariqWrite}`);
    check(await waitForLock(o, 'a00_tariq'), 'step 4: Tariq waits for Mina’s row lock');
    await mina.run('COMMIT;');
    const s5 = await pending;
    const expected5 = { overwrite: /UPDATE 1/, repeatable: /ERROR:  40001: could not serialize access due to concurrent update/, guarded: /UPDATE 0/ }[option.key];
    check(expected5.test(s5), `step 5: Tariq’s update gives ${expected5}`, s5);
    const s6 = await tariq.run(steps[5].sql);
    check(s6.includes(steps[5].result), `step 6: Tariq ${steps[5].result}`, s6);
    if (option.key === 'repeatable') {
      const retry = await tariq.run(begin + '\nROLLBACK;');
      check(retry.split('\n').includes('0'), 'retry reads stock 0', retry);
    }
    const stock = (await o.run("SELECT stock FROM products WHERE product_id = 'P7';")).trim();
    const holders = (await o.run("SELECT string_agg(order_id::text, ',' ORDER BY order_id) FROM order_items WHERE product_id = 'P7' AND order_id > 102;")).trim();
    const want = steps[5].committed;
    check(stock === String(want.stock) && holders === want.holders.join(','), `final: stock ${want.stock}, mug held by ${want.holders.join(' and ')}`, `${stock} ${holders}`);
    if (option.key !== 'overwrite') {
      const tea = (await o.run("SELECT stock FROM products WHERE product_id = 'P3';")).trim();
      const ordersNow = (await o.run('SELECT string_agg(order_id::text, \',\' ORDER BY order_id) FROM orders;')).trim();
      check(tea === '10' && ordersNow === '101,102,103', 'final state matches the shop in Figures 1 and 2', `${tea} ${ordersNow}`);
    }
    mina.close();
    tariq.close();
  }

  // Section 4: Mina's order as one transaction, from the state before it.
  await o.run(m.fixtureSql({ with103: false }));
  const tx = await o.run(m.orderTransactionSql);
  check((tx.match(/UPDATE 1/g) || []).length === 2 && tx.includes('COMMIT'), 'order 103 as one transaction commits');
  check((await o.run("SELECT string_agg(product_id || '=' || stock, ',' ORDER BY product_id) FROM products;")).trim() === m.products.map(p => `${p.product_id}=${p.stock}`).join(','), 'stock after order 103 matches the shop in Figures 1 and 2');

  // Section 4: the race with an unguarded decrement; the CHECK constraint refuses Tariq.
  await o.run(m.fixtureSql({ with103: false }));
  {
    const mina = new Session('Mina', 'a00_verify');
    const tariq = new Session('Tariq', 'a00_verify');
    await tariq.run("SET application_name = 'a00_tariq';");
    await mina.run("BEGIN;\nUPDATE products SET stock = stock - 1 WHERE product_id = 'P7';");
    await tariq.run('BEGIN;');
    const late = tariq.send("UPDATE products SET stock = stock - 1 WHERE product_id = 'P7';");
    check(await waitForLock(o, 'a00_tariq'), 'unguarded: Tariq waits');
    await mina.run('COMMIT;');
    check((await late).includes(`ERROR:  ${m.unguardedResult}`), `unguarded: Tariq’s decrement refused with ${m.unguardedResult}`);
    await tariq.run('ROLLBACK;');
    mina.close();
    tariq.close();
  }

  // Section 7: adding a required fact.
  note('\n## Adding a required tax country');
  await o.run(m.fixtureSql({ with103: true }));
  const fileBefore = (await o.run("SELECT pg_relation_filenode('orders');")).trim();
  check((await o.run('BEGIN;\nALTER TABLE orders ADD COLUMN tax_country text NOT NULL;\nROLLBACK;')).includes('ERROR:  23502'), 'NOT NULL column on existing rows is refused (23502)');
  const def = await o.run("BEGIN;\nALTER TABLE orders ADD COLUMN tax_country text NOT NULL DEFAULT 'GB';\nSELECT pg_relation_filenode('orders') = " + fileBefore + " AS same_file;\nSELECT string_agg(order_id || '=' || tax_country, ',' ORDER BY order_id) FROM orders;\nROLLBACK;");
  check(def.includes('101=GB,102=GB,103=GB') && def.split('\n').includes('t'), 'a default fills every existing order with GB, without rewriting the table', def);
  const staged = await o.run([
    'BEGIN;',
    "ALTER TABLE orders ADD COLUMN tax_country text CHECK (tax_country ~ '^[A-Z]{2}$');",
    `SELECT pg_relation_filenode('orders') = ${fileBefore} AS same_file;`,
    "INSERT INTO orders (order_id, customer_id, placed_at, status) VALUES (107, 3, '2026-10-20 12:00+00', 'pending');",
    "INSERT INTO orders (order_id, customer_id, placed_at, status, tax_country) VALUES (108, 2, '2026-10-20 12:01+00', 'pending', 'SE');",
    'SAVEPOINT early;',
    'ALTER TABLE orders ALTER COLUMN tax_country SET NOT NULL;',
    'ROLLBACK TO SAVEPOINT early;',
    "UPDATE orders SET tax_country = 'GB' WHERE tax_country IS NULL AND order_id IN (101, 103, 107);",
    "UPDATE orders SET tax_country = 'SE' WHERE order_id = 102;",
    'ALTER TABLE orders ALTER COLUMN tax_country SET NOT NULL;',
    "INSERT INTO orders (order_id, customer_id, placed_at, status) VALUES (109, 3, '2026-10-20 12:02+00', 'pending');",
    'ROLLBACK;',
  ].join('\n'));
  check(/^t$/m.test(staged), 'nullable column added without rewriting the table', staged);
  check((staged.match(/INSERT 0 1/g) || []).length === 2, 'old and new application inserts both accepted while the column is optional', staged);
  check((staged.match(/ERROR:  23502/g) || []).length === 2, 'SET NOT NULL refused while NULLs remain; old-style insert refused afterwards', staged);
  const nv = await o.run([
    'BEGIN;',
    'ALTER TABLE orders ADD COLUMN tax_country text;',
    'ALTER TABLE orders ADD CONSTRAINT orders_tax_country_not_null NOT NULL tax_country NOT VALID;',
    'SAVEPOINT s;',
    "INSERT INTO orders (order_id, customer_id, placed_at, status) VALUES (110, 3, '2026-10-20 12:03+00', 'pending');",
    'ROLLBACK TO SAVEPOINT s;',
    "UPDATE orders SET tax_country = 'GB';",
    'ALTER TABLE orders VALIDATE CONSTRAINT orders_tax_country_not_null;',
    "SELECT convalidated FROM pg_constraint WHERE conname = 'orders_tax_country_not_null';",
    'ROLLBACK;',
  ].join('\n'));
  check((nv.match(/ERROR/g) || []).length === 1 && nv.includes('ERROR:  23502') && /^t$/m.test(nv) && !nv.includes('aborted'), 'NOT VALID NOT NULL: accepted, refuses new NULLs, validates after backfill', nv);

  // Section 6: pages read to find rows.
  note('\n## Pages read: sequential scan against index');
  admin('DROP DATABASE IF EXISTS a00_scan;');
  admin('CREATE DATABASE a00_scan;');
  const s = new Session('scan', 'a00_scan');
  await s.run('SET max_parallel_workers_per_gather = 0;');
  const buffers = out => { const b = /Buffers: shared( hit=(\d+))?( read=(\d+))?/.exec(out); return b ? Number(b[2] || 0) + Number(b[4] || 0) : NaN; };
  const node = out => out.split('\n')[0].replace(/\s*\(.*$/, '').trim();
  const measured = [];
  for (const n of m.scanSizes) {
    await s.run(`DROP TABLE IF EXISTS big_orders;
CREATE TABLE big_orders (order_id integer PRIMARY KEY, customer_id integer NOT NULL, placed_at timestamptz NOT NULL, status text NOT NULL, total numeric(8,2) NOT NULL);
INSERT INTO big_orders SELECT g, (g % 1000) + 1, timestamptz '2026-01-01 00:00+00' + g * interval '1 minute', 'paid', 20.00 FROM generate_series(1, ${n}) AS g;
VACUUM ANALYZE big_orders;`);
    const pages = Number((await s.run("SELECT pg_relation_size('big_orders') / 8192;")).trim());
    const ex = sql => s.run(`EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) ${sql}`);
    const byId = await ex(`SELECT * FROM big_orders WHERE order_id = ${Math.ceil(n / 2)};`);
    const scan = await ex('SELECT * FROM big_orders WHERE customer_id = 42;');
    await s.run('CREATE INDEX ON big_orders (customer_id); ANALYZE big_orders;');
    const indexed = await ex('SELECT * FROM big_orders WHERE customer_id = 42;');
    const row = { rows: n, tablePages: pages, customerRows: n / 1000,
      idNode: node(byId), idPages: buffers(byId), scanNode: node(scan), scanPages: buffers(scan), indexNode: node(indexed), indexPages: buffers(indexed) };
    measured.push(row);
    note(JSON.stringify(row));
  }
  s.close();
  if (m.scanObserved.length) check(same(measured, m.scanObserved), 'page counts match model.mjs', JSON.stringify(measured));
  else note('model.mjs has no recorded page counts yet; copy the rows above into scanObserved.');

  o.close();
  note(`\n${failures ? `${failures} FAILED` : 'All checks passed.'}`);
  writeFileSync(join(here, 'observed.txt'), log.join('\n') + '\n');
  process.exit(failures ? 1 : 0);
}

main().catch(error => { console.error(error); process.exit(1); });
