// Checks every database outcome the relational introduction (trial 2) states
// against a real, disposable PostgreSQL server. It creates its own cluster in a
// temporary directory, runs each scenario in a fresh database, compares the
// results with model.mjs and scenes.mjs, then stops the server and deletes the
// directory.
//
//   node src/components/relational-trial-2/a00/verify.mjs
//
// Environment: A00_PG_BIN (default /opt/homebrew/bin), A00_PG_PORT (57611),
// A00_EVIDENCE (a path to write the observed numbers as JSON).

import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, cpSync, appendFileSync, existsSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as m from './model.mjs';
import { scenes } from './scenes.mjs';

const bin = process.env.A00_PG_BIN || '/opt/homebrew/bin';
const port = process.env.A00_PG_PORT || '57611';
const env = { ...process.env, LC_ALL: 'C', PGTZ: 'UTC' };
const dir = mkdtempSync(join(tmpdir(), 'a00-verify-'));
const data = join(dir, 'data');
const archive = join(dir, 'archive');
mkdirSync(archive);
const evidence = { checked: new Date().toISOString(), cases: {} };
let checks = 0;
const ok = (fn, ...args) => { fn(...args); checks += 1; };

const pg = (tool, args, opts = {}) => execFileSync(join(bin, tool), args, { env, encoding: 'utf8', ...opts });
const startServer = dataDir => pg('pg_ctl', ['-D', dataDir, '-l', join(dir, 'server.log'), '-w', '-t', '30',
  '-o', `-h 127.0.0.1 -p ${port} -c unix_socket_directories= -c archive_mode=on -c archive_command='cp %p ${archive}/%f' -c max_wal_senders=4`, 'start']);
const stopServer = (dataDir, mode = 'fast') => pg('pg_ctl', ['-D', dataDir, '-m', mode, '-w', 'stop']);

/** One psql session that can be driven statement by statement, as a second client would. */
class Session {
  constructor(db) {
    this.proc = spawn(join(bin, 'psql'), ['-X', '-A', '-t', '-h', '127.0.0.1', '-p', port, '-U', 'postgres', '-d', db, '-v', 'VERBOSITY=verbose'], { env });
    this.out = ''; this.err = ''; this.n = 0;
    this.proc.stdout.on('data', chunk => { this.out += chunk; });
    this.proc.stderr.on('data', chunk => { this.err += chunk; });
    this.proc.stdin.write('\\set VERBOSITY verbose\n');
  }
  /** Sends SQL; resolves with its output and any error once the statement has finished. */
  run(sql) {
    const marker = `__done_${++this.n}__`;
    this.proc.stdin.write(`${sql}\n\\echo ${marker}\n`);
    return new Promise(resolve => {
      const poll = setInterval(() => {
        const at = this.out.indexOf(marker);
        if (at < 0) return;
        clearInterval(poll);
        setTimeout(() => {
          const out = this.out.slice(0, at).trim();
          const err = this.err.trim();
          this.out = this.out.slice(at + marker.length + 1);
          this.err = '';
          resolve({ out, err, code: (err.match(/ERROR:\s+([0-9A-Z]{5})/) || [])[1] });
        }, 40);
      }, 10);
    });
  }
  async pid() { return Number((await this.run('SELECT pg_backend_pid();')).out); }
  close() { this.proc.stdin.end(); return new Promise(resolve => this.proc.on('close', resolve)); }
}
const settled = (promise, ms = 400) => Promise.race([promise.then(() => true), new Promise(resolve => setTimeout(() => resolve(false), ms))]);

const sql = (db, text) => pg('psql', ['-X', '-A', '-t', '-q', '-v', 'ON_ERROR_STOP=1', '-h', '127.0.0.1', '-p', port, '-U', 'postgres', '-d', db], { input: text }).trim();
const json = (db, query) => JSON.parse(sql(db, `SELECT coalesce(json_agg(row_to_json(r)), '[]') FROM (${query.trim().replace(/;$/, '')}) r;`));
let dbCount = 0;
const fresh = template => { const name = `a00_${++dbCount}`; sql('postgres', `CREATE DATABASE ${name} TEMPLATE ${template};`); return name; };

try {
  pg('initdb', ['-D', data, '-U', 'postgres', '--auth=trust', '--locale=C', '--encoding=UTF8']);
  appendFileSync(join(data, 'postgresql.conf'), "\ntimezone = 'UTC'\n");
  startServer(data);
  evidence.version = sql('postgres', 'SELECT version();');
  ok(assert.match, evidence.version, /^PostgreSQL 18\.6/);

  sql('postgres', 'CREATE DATABASE shop_before;');
  sql('shop_before', m.schema + '\n' + m.seedBefore103);
  sql('postgres', 'CREATE DATABASE shop_after TEMPLATE shop_before;');
  sql('shop_after', m.order103Changes.map(c => c.sql).join('\n'));

  // ---- Figure 1: each prefix of the five changes, answered from stored rows.
  for (let n = 0; n <= m.order103Changes.length; n++) {
    const db = fresh('shop_before');
    if (n) sql(db, m.order103Changes.slice(0, n).map(c => c.sql).join('\n'));
    const [row] = json(db, `SELECT
      (SELECT stock FROM products WHERE product_id = 'P7') AS p7,
      (SELECT stock FROM products WHERE product_id = 'P3') AS p3,
      (SELECT count(*) FROM orders WHERE order_id = 103) AS has103,
      (SELECT coalesce(sum(quantity * unit_price), 0) FROM order_items WHERE order_id = 103) AS value`);
    const model = m.partialOrder(n);
    ok(assert.equal, row.p7, model.p7); ok(assert.equal, row.p3, model.p3);
    ok(assert.equal, row.has103 === 1, model.has103);
    if (model.has103) ok(assert.equal, Number(row.value).toFixed(2), model.questions[2].answer);
  }
  ok(assert.deepEqual, [0, 1, 2, 3, 4, 5].map(n => m.partialOrder(n).consistent), [true, false, false, false, false, true]);

  // ---- Figure 2 and its listings: keys, the join and rejected changes.
  ok(assert.deepEqual, json('shop_after', m.joinQuery), m.joinResult);
  for (const id of [101, 102, 103]) {
    const r = m.relatedRows(id);
    ok(assert.deepEqual, json('shop_after', `SELECT c.name FROM orders o JOIN customers c USING (customer_id) WHERE order_id = ${id}`).map(x => x.name), [r.customer.name]);
    ok(assert.deepEqual, json('shop_after', `SELECT line_no FROM order_items WHERE order_id = ${id} ORDER BY line_no`).map(x => x.line_no), r.items.map(i => i.line_no));
    ok(assert.deepEqual, json('shop_after', `SELECT payment_id FROM payments WHERE order_id = ${id} ORDER BY payment_id`).map(x => x.payment_id), r.payments.map(p => p.payment_id));
  }
  ok(assert.deepEqual, json('shop_after', 'SELECT c.name, count(o.order_id) AS orders FROM customers c LEFT JOIN orders o USING (customer_id) GROUP BY c.customer_id, c.name ORDER BY c.customer_id'),
    [{ name: 'Mina Shah', orders: 2 }, { name: 'Tariq Aziz', orders: 1 }, { name: 'Edda Berg', orders: 0 }]);
  evidence.cases.rejected = [];
  {
    const db = fresh('shop_after');
    const s = new Session(db);
    for (const r of m.rejected) {
      const result = await s.run(r.sql);
      ok(assert.equal, result.code, r.code, r.sql);
      ok(assert.match, result.err, new RegExp(r.constraint));
      evidence.cases.rejected.push({ sql: r.sql, error: result.err.split('\n')[0] });
    }
    await s.close();
  }

  // The listings the article prints as psql output, captured verbatim.
  const aligned = (db, text) => pg('psql', ['-X', '-h', '127.0.0.1', '-p', port, '-U', 'postgres', '-d', db], { input: text }).replace(/\s+$/, '');
  evidence.listings = {
    minaOrders: aligned('shop_after', m.minaLookup),
    join103: aligned('shop_after', m.joinQuery),
    wrongChange: aligned(fresh('shop_after'), m.wrongChange),
  };
  ok(assert.match, evidence.listings.wrongChange, /UPDATE 2/);
  ok(assert.equal, sql(fresh('shop_after'), m.rightChange), '103|cancelled');

  // ---- Figure 3: what is still due.
  ok(assert.deepEqual, json('shop_after', m.dueWrong).map(r => ({ order_id: r.order_id, value: Number(r.value).toFixed(2), paid: Number(r.paid).toFixed(2), due: Number(r.due).toFixed(2) })), m.dueWrongResult);
  const right = json('shop_after', m.dueRight);
  ok(assert.deepEqual, right.map(r => ({ order_id: r.order_id, value: Number(r.value).toFixed(2), paid: Number(r.paid).toFixed(2), due: Number(r.due).toFixed(2) })), m.dueRightResult);
  ok(assert.match, sql('shop_after', m.dueRight), /^103\|29\.00\|0\.00\|29\.00$/m);
  evidence.cases.dueRightText = sql('shop_after', m.dueRight);
  evidence.cases.dueWrongText = sql('shop_after', m.dueWrong);
  ok(assert.equal, json('shop_after', 'SELECT 1 FROM order_items i JOIN payments p USING (order_id)').length, m.joinedPairs().length);
  ok(assert.deepEqual, json('shop_after', m.dueWrong.replace('JOIN payments', 'LEFT JOIN payments')).find(r => r.order_id === 103), { order_id: 103, value: 29, paid: null, due: null });
  {
    const out = sql(fresh('shop_after'), m.wrongChange.replace('ROLLBACK;', ''));
    ok(assert.deepEqual, out.split('\n').filter(l => /\|/.test(l)).map(l => { const [order_id, status] = l.split('|'); return { order_id: Number(order_id), status }; }), m.wrongChangeResult);
  }
  const fig3 = scenes.due;
  for (const option of fig3.options.map(o => o.value)) {
    const last = fig3.frames(option).at(-1);
    const shown = last.tables.find(t => t.name === 'Result').rows.map(r => r.cells);
    const expected = option === 'separate' ? m.dueRightResult : m.dueWrongResult;
    ok(assert.deepEqual, shown.map(c => Number(c[0])), expected.map(r => r.order_id));
    ok(assert.deepEqual, shown.map(c => c.at(-1)), expected.map(r => r.due));
  }

  // ---- Figure 4: the race for the last mug, two real sessions per protocol.
  evidence.cases.race = {};
  for (const [name, protocol] of Object.entries({ ...m.raceProtocols, readAutocommit: { ...m.raceProtocols.read, begin: null } })) {
    const db = fresh('shop_before');
    const mina = new Session(db); const tariq = new Session(db);
    const trace = [];
    if (protocol.begin) { await mina.run(protocol.begin); await tariq.run(protocol.begin); }
    if (protocol.read) {
      trace.push(['mina read', (await mina.run(protocol.read)).out]);
      trace.push(['tariq read', (await tariq.run(protocol.read)).out]);
    }
    const minaWrite = await mina.run(protocol.write);
    trace.push(['mina write', minaWrite.out]);
    for (const s of m.raceOrderSql.mina) await mina.run(s);
    const tariqWrite = tariq.run(protocol.write);
    const blocked = protocol.begin ? !(await settled(tariqWrite)) : null;
    if (protocol.begin) ok(assert.equal, blocked, true, `${name}: Tariq's write should wait for Mina's lock`);
    if (protocol.begin) trace.push(['mina commit', (await mina.run('COMMIT;')).out]);
    const t = await tariqWrite;
    trace.push(['tariq write', t.out || t.err.split('\n')[0]]);
    let tariqResult;
    if (t.code === '40001') {
      await tariq.run('ROLLBACK;');
      await tariq.run(protocol.begin);
      const retry = await tariq.run(protocol.read);
      trace.push(['tariq retry read', retry.out]);
      ok(assert.equal, retry.out, '0');
      await tariq.run('ROLLBACK;');
      tariqResult = 'serialization failure';
    } else if (/UPDATE 0/.test(t.out)) {
      await tariq.run('ROLLBACK;');
      tariqResult = 'update 0';
    } else {
      for (const s of m.raceOrderSql.tariq) await tariq.run(s);
      if (protocol.begin) await tariq.run('COMMIT;');
      tariqResult = 'committed';
    }
    await mina.close(); await tariq.close();
    const [final] = json(db, "SELECT (SELECT stock FROM products WHERE product_id = 'P7') AS p7, (SELECT json_agg(order_id ORDER BY order_id) FROM order_items WHERE product_id = 'P7' AND order_id > 102) AS holding");
    const expected = m.raceOutcome[name];
    ok(assert.equal, final.p7, expected.p7);
    ok(assert.deepEqual, final.holding, expected.ordersHoldingMug);
    evidence.cases.race[name] = { trace, tariq: tariqResult, final, tariqWaited: blocked };
    if (name !== 'readAutocommit') {
      const frames = scenes.race.frames(name);
      const shownStock = frames.at(-1).tables.find(t => t.name === 'products').rows[0].cells.at(-1);
      ok(assert.equal, Number(shownStock), final.p7);
      const shownOrders = frames.at(-1).tables.find(t => t.name === 'order_items').rows.filter(r => r.state !== 'gone').map(r => Number(r.cells[0]));
      ok(assert.deepEqual, shownOrders, final.holding);
    }
  }

  // ---- Figure 5: where the connection breaks. The lost reply itself is modelled;
  //      what is observed is the database's state after the session ends
  //      before or after COMMIT, and what a blind retry or a lookup then finds.
  evidence.cases.lostReply = {};
  for (const name of Object.keys(m.breakPoints)) {
    const db = fresh('shop_before');
    const app = new Session(db); const admin = new Session(db);
    const pid = await app.pid();
    const results = [];
    for (const statement of m.placeOrder103.slice(0, name === 'beforeCommit' ? 5 : 6)) results.push(await app.run(statement));
    ok(assert.match, results[1].out, /UPDATE 1/);
    if (name !== 'beforeCommit') ok(assert.match, results[5].out, /COMMIT/);
    if (name !== 'replied') await admin.run(`SELECT pg_terminate_backend(${pid});`);
    await app.close(); await admin.close();
    const [state] = json(db, `SELECT (SELECT stock FROM products WHERE product_id = 'P7') AS p7, (SELECT count(*) FROM orders WHERE order_id = 103) AS has103`);
    ok(assert.equal, state.has103 === 1, m.breakPoints[name].committed, name);
    ok(assert.equal, state.p7, m.breakPoints[name].committed ? 0 : 1);
    const retry = new Session(db);
    const found = await retry.run(m.lookup103);
    await retry.run('BEGIN;');
    const claim = await retry.run(m.placeOrder103[1]);
    await retry.run('ROLLBACK;');
    const duplicate = await retry.run(m.placeOrder103[3]);
    await retry.close();
    if (m.breakPoints[name].committed) {
      ok(assert.match, claim.out, /UPDATE 0/);
      ok(assert.equal, found.out, '103|pending');
      ok(assert.equal, duplicate.code, '23505');
    } else {
      ok(assert.match, claim.out, /UPDATE 1/);
      ok(assert.equal, found.out, '');
    }
    evidence.cases.lostReply[name] = { state, lookupFirst: found.out || '(0 rows)', retryClaim: claim.out, reinsert103: duplicate.code ? duplicate.err.split('\n')[0] : duplicate.out };
    const shown = scenes.lost.frames(name).at(-2).tables.find(t => t.name === 'orders').rows.some(r => r.cells[0] === '103' && r.state !== 'gone');
    ok(assert.equal, shown, m.breakPoints[name].committed);
    const finalShown = scenes.lost.frames(name).at(-1).tables.find(t => t.name === 'orders').rows.some(r => r.cells[0] === '103' && r.state !== 'gone');
    ok(assert.equal, finalShown, true, `${name}: order 103 exists once the application has recovered`);
  }

  // ---- Section 6: scans, an index and the physical work they do.
  {
    sql('postgres', 'CREATE DATABASE scaled TEMPLATE shop_after;');
    sql('scaled', m.scaledGenerator);
    const explain = query => JSON.parse(sql('scaled', `SET max_parallel_workers_per_gather = 0; EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, SUMMARY OFF, FORMAT JSON) ${query}`))[0].Plan;
    const pages = plan => plan['Shared Hit Blocks'] + plan['Shared Read Blocks'];
    const scanNode = plan => (plan.Plans ? scanNode(plan.Plans.at(-1)) : plan);
    const [sizes] = json('scaled', "SELECT (SELECT count(*) FROM orders) AS orders, pg_relation_size('orders') / 8192 AS order_pages, pg_relation_size('order_items') / 8192 AS item_pages");
    const textPlan = query => sql('scaled', `SET max_parallel_workers_per_gather = 0; EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) ${query}`);
    evidence.cases.planText = { before: textPlan(m.minaLookup) };
    const before = explain(m.minaLookup);
    const reportBefore = explain(m.productReport);
    sql('scaled', m.lookupIndex + ' ANALYZE orders;');
    const after = explain(m.minaLookup);
    evidence.cases.planText.after = textPlan(m.minaLookup);
    const reportAfter = explain(m.productReport);
    const [idx] = json('scaled', "SELECT pg_relation_size('orders_customer_idx') / 8192 AS index_pages");
    const rows = json('scaled', m.minaLookup);
    ok(assert.deepEqual, rows.map(r => r.order_id), [101, 103]);
    ok(assert.equal, scanNode(before)['Node Type'], 'Seq Scan');
    ok(assert.equal, scanNode(before)['Rows Removed by Filter'], sizes.orders - 2);
    ok(assert.ok, pages(before) >= sizes.order_pages && pages(before) < sizes.order_pages * 1.01, `scan read ${pages(before)} of ${sizes.order_pages} pages`);
    ok(assert.ok, /Index Scan|Bitmap/.test(scanNode(after)['Node Type']));
    ok(assert.ok, pages(after) <= 6, `index lookup read ${pages(after)} pages`);
    ok(assert.ok, Math.abs(pages(reportBefore) - pages(reportAfter)) <= 5);
    ok(assert.ok, pages(reportBefore) >= sizes.item_pages && pages(reportBefore) < sizes.item_pages * 1.01, `report read ${pages(reportBefore)} of ${sizes.item_pages}`);
    // What the index costs every insert: write-ahead log for 10,000 new orders.
    const walFor = () => Number(sql('scaled', `
      CREATE TEMP TABLE mark AS SELECT pg_current_wal_insert_lsn() AS lsn;
      INSERT INTO orders SELECT g, 1001 + g % 20000, now(), 'pending' FROM generate_series(300001, 310000) g;
      SELECT pg_current_wal_insert_lsn() - lsn FROM mark;`));
    const cleanUp = () => sql('scaled', 'DELETE FROM orders WHERE order_id > 300000; VACUUM orders;');
    const walWithIndex = walFor(); cleanUp();
    sql('scaled', 'DROP INDEX orders_customer_idx;');
    const walWithout = walFor(); cleanUp();
    ok(assert.ok, walWithIndex > walWithout * 1.15, `index adds log: ${walWithout} -> ${walWithIndex}`);
    evidence.cases.physical = {
      sizes, indexPages: idx.index_pages,
      lookupBefore: { node: scanNode(before)['Node Type'], pages: pages(before), removed: scanNode(before)['Rows Removed by Filter'] },
      lookupAfter: { node: scanNode(after)['Node Type'], pages: pages(after) },
      report: { pagesBefore: pages(reportBefore), pagesAfter: pages(reportAfter), node: scanNode(reportBefore)['Node Type'] },
      walBytesFor10000Inserts: { withoutIndex: walWithout, withIndex: walWithIndex },
    };
  }

  // ---- Section 7: a required fact added while an old application still writes.
  {
    const db = fresh('shop_after');
    const s = new Session(db);
    const oneStep = await s.run(m.liveChange.oneStep);
    ok(assert.equal, oneStep.code, '23502');
    ok(assert.match, (await s.run(m.liveChange.expand)).out, /ALTER TABLE/);
    ok(assert.match, (await s.run(m.liveChange.oldInsert)).out, /INSERT 0 1/);
    const early = await s.run(m.liveChange.contract);
    ok(assert.equal, early.code, '23502');
    ok(assert.match, (await s.run(m.liveChange.backfill)).out, /UPDATE 4/);
    ok(assert.match, (await s.run(m.liveChange.contract)).out, /ALTER TABLE/);
    const oldAfter = await s.run(m.liveChange.oldInsert.replace('105', '106'));
    ok(assert.equal, oldAfter.code, '23502');
    await s.close();
    evidence.cases.liveChange = { oneStep: oneStep.err.split('\n')[0], earlyContract: early.err.split('\n')[0], oldWriterAfterContract: oldAfter.err.split('\n')[0] };
  }

  // ---- Figure 6: crash recovery keeps commits, including a mistaken one;
  //      a restore to an earlier point brings the deleted order back and
  //      leaves out the later good order.
  {
    sql('postgres', 'CREATE DATABASE recovery TEMPLATE shop_before;');
    sql('recovery', "INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');");
    stopServer(data, 'immediate');
    startServer(data);
    ok(assert.equal, sql('recovery', 'SELECT count(*) FROM orders WHERE order_id = 103;'), '1');
    sql('recovery', 'DELETE FROM orders WHERE order_id = 103;');

    const base = join(dir, 'base');
    pg('pg_basebackup', ['-h', '127.0.0.1', '-p', port, '-U', 'postgres', '-D', base, '-X', 'stream', '-c', 'fast']);
    sql('recovery', "SELECT pg_create_restore_point('before_cleanup');");
    sql('recovery', 'DELETE FROM payments WHERE order_id = 101; DELETE FROM order_items WHERE order_id = 101; DELETE FROM orders WHERE order_id = 101;');
    sql('recovery', "INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');");
    sql('recovery', 'SELECT pg_switch_wal();');
    stopServer(data, 'immediate');
    startServer(data);
    const afterCrash = json('recovery', 'SELECT order_id FROM orders ORDER BY order_id').map(r => r.order_id);
    ok(assert.deepEqual, afterCrash, [102, 103]);
    sql('recovery', 'SELECT pg_switch_wal(); CHECKPOINT;');
    stopServer(data, 'fast');

    const restored = join(dir, 'restored');
    cpSync(base, restored, { recursive: true }); chmodSync(restored, 0o700);
    appendFileSync(join(restored, 'postgresql.conf'), `\nrestore_command = 'cp ${archive}/%f %p'\nrecovery_target_name = 'before_cleanup'\nrecovery_target_action = 'promote'\n`);
    writeFileSync(join(restored, 'recovery.signal'), '');
    startServer(restored);
    const afterRestore = json('recovery', 'SELECT order_id FROM orders ORDER BY order_id').map(r => r.order_id);
    ok(assert.deepEqual, afterRestore, [101, 102]);
    const items101 = json('recovery', 'SELECT line_no FROM order_items WHERE order_id = 101').length;
    ok(assert.equal, items101, 2);
    stopServer(restored, 'fast');
    evidence.cases.recovery = { afterCrashReplay: afterCrash, afterRestoreToBeforeCleanup: afterRestore };
    const matrix = m.recoveryMatrix;
    ok(assert.equal, matrix.deletion.replay.order101, 'gone');
    ok(assert.equal, matrix.deletion.restore.order101, 'present');
    ok(assert.equal, matrix.deletion.restore.order103, 'lost');
  }

  // ---- Every stepped figure: step text present, steps change something, options well formed.
  for (const [id, scene] of Object.entries(scenes)) {
    for (const option of scene.options.length ? scene.options.map(o => o.value) : ['']) {
      const frames = scene.frames(option);
      ok(assert.ok, frames.length >= 1);
      frames.forEach((f, i) => {
        ok(assert.ok, f.explanation && f.explanation.length > 30, `${id}/${option}/${i} explanation`);
        if (i > 0) ok(assert.notDeepEqual, JSON.stringify(frames[i]), JSON.stringify(frames[i - 1]), `${id}/${option}/${i} repeats the previous step`);
      });
    }
  }

  if (process.env.A00_EVIDENCE) writeFileSync(process.env.A00_EVIDENCE, JSON.stringify(evidence, null, 2) + '\n');
  console.log(`PASS: ${checks} checks on ${evidence.version.split(' on ')[0]}.`);
  console.log(JSON.stringify(evidence.cases.physical));
} catch (error) {
  try { console.error(execFileSync('tail', ['-n', '25', join(dir, 'server.log')], { encoding: 'utf8' })); } catch {}
  process.exitCode = 1;
  console.error(error);
} finally {
  for (const d of [data, join(dir, 'restored')]) if (existsSync(join(d, 'postmaster.pid'))) try { stopServer(d, 'fast'); } catch {}
  rmSync(dir, { recursive: true, force: true });
}
