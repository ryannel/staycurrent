// Checks every measured number the Indexes article quotes, on PGlite
// (PostgreSQL 18 compiled to WebAssembly). Run from the repository root:
//   node docs/article-work/indexes/build-experiment.mjs
//   node docs/article-work/indexes/verify.mjs --depth
// --depth rebuilds the 100,000 / 1 million / 10 million row B-tree depth
// measurement, which takes a few minutes. Without it, the depth figures are
// carried over from the previous observed.json.
import { PGlite } from '@electric-sql/pglite';
import { pageinspect } from '@electric-sql/pglite/contrib/pageinspect';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const here = (file) => new URL(file, import.meta.url);
const setup = readFileSync(here('./setup.sql'), 'utf8');
const source = readFileSync(here('../../../src/pages/learn/databases/relational/indexes.astro'), 'utf8');
const s = Object.fromEntries([...source.matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map((m) => [m[1], m[2]]));
const previous = existsSync(here('./observed.json')) ? JSON.parse(readFileSync(here('./observed.json'), 'utf8')) : {};
const observed = { checked: '2026-10-16', runtime: 'PGlite 0.5.8, in memory. Page counts, not timings.' };

const nodes = (p) => [p, ...(p.Plans ?? []).flatMap(nodes)];
const find = (p, type) => nodes(p.Plan).find((n) => n['Node Type'] === type);
const has = (p, type) => Boolean(find(p, type));
const pages = (n) => (n['Shared Hit Blocks'] ?? 0) + (n['Shared Read Blocks'] ?? 0) + (n['Local Hit Blocks'] ?? 0) + (n['Local Read Blocks'] ?? 0);
const open = async (extensions = {}) => {
  const db = new PGlite({ extensions });
  const q = async (sql) => (await db.query(sql)).rows;
  const plan = async (sql) => (await q('EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON) ' + sql))[0]['QUERY PLAN'][0];
  return { db, q, plan };
};
const expectedIds = [59041, 58041, 57041, 56041, 55041, 54041, 53041, 52041, 51041, 50041];

// The article's sequence, in one session.
const { db, q, plan } = await open({ pageinspect });
await db.exec('CREATE EXTENSION pageinspect');
await db.exec(setup);
const historyIds = async () => (await q(s.history)).map((r) => r.order_id);
observed.version = (await q('SELECT version()'))[0].version;
observed.tablePages = Number((await q("SELECT pg_relation_size('index_orders') / 8192 AS n"))[0].n);
assert.equal(observed.tablePages, 1725);

// Sequential scan.
let p = await plan(s.lookup);
assert.equal(p.Plan['Node Type'], 'Seq Scan');
assert.equal(p.Plan['Rows Removed by Filter'], 59940);
assert.equal(p.Plan['Actual Rows'], 60);
assert.equal(pages(p.Plan), 1725);
observed.lookupNoIndex = { node: 'Seq Scan', pages: 1725, removed: 59940, rows: 60 };
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Seq Scan')['Rows Removed by Filter'], 59985);
assert(has(p, 'Sort'));
observed.history = { none: { node: 'Seq Scan', pages: pages(p.Plan), sort: true } };

// Index entries.
await db.exec(s.customerIndex);
await db.exec('ANALYZE index_orders');
p = await plan(s.lookup);
assert.equal(pages(find(p, 'Bitmap Index Scan')), 2);
assert.equal(find(p, 'Bitmap Heap Scan')['Exact Heap Blocks'], 60);
assert.equal(pages(p.Plan), 62);
observed.lookupCustomerIndex = { node: 'Bitmap Heap Scan', indexPages: 2, tablePages: 60 };
observed.customerIndex = {
  levels: (await q("SELECT level FROM bt_metap('index_orders_customer')"))[0].level + 1,
  pages: Number((await q("SELECT pg_relation_size('index_orders_customer') / 8192 AS n"))[0].n),
};
const tids = (await q("SELECT array_length(tids, 1) AS n FROM bt_page_items('index_orders_customer', 1) WHERE tids IS NOT NULL LIMIT 1"))[0].n;
assert.equal(tids, 60);
observed.postingListTids = tids;
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Bitmap Index Scan')['Actual Rows'], 60);
assert.equal(find(p, 'Bitmap Heap Scan')['Rows Removed by Filter'], 45);
assert(has(p, 'Sort'));
assert.equal(pages(p.Plan), 62);
observed.history.customer = { node: 'Bitmap Heap Scan', fetched: 60, removed: 45, pages: 62, sort: true };

// Range scans.
p = await plan(s.range);
assert.equal(find(p, 'Bitmap Index Scan')['Actual Rows'], 360);
assert.equal(pages(find(p, 'Bitmap Index Scan')), 3);
assert.equal(find(p, 'Bitmap Heap Scan')['Exact Heap Blocks'], 70);
assert(has(p, 'Sort'));
observed.range = { node: 'Bitmap Heap Scan', entries: 360, indexPages: 3, tablePages: 70, sort: true };

// Selectivity.
observed.selectivity = {};
for (const k of [1, 100, 300, 500, 550, 900]) {
  const sp = await plan(s.wideRange.replace('500', String(k)));
  observed.selectivity[k] = { node: sp.Plan['Node Type'], pages: pages(sp.Plan), tablePages: find(sp, 'Bitmap Heap Scan')?.['Exact Heap Blocks'] ?? null };
}
assert.equal(observed.selectivity[500].node, 'Bitmap Heap Scan');
assert.equal(observed.selectivity[550].node, 'Seq Scan');
observed.costSettings = { random_page_cost: (await q('SHOW random_page_cost'))[0].random_page_cost, seq_page_cost: (await q('SHOW seq_page_cost'))[0].seq_page_cost };
assert.equal(observed.costSettings.random_page_cost, '4');

// Composite indexes.
await db.exec(s.compositeIndex);
await db.exec('ANALYZE index_orders');
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Index Scan')['Actual Rows'], 10);
assert(!has(p, 'Sort'));
assert.equal(pages(p.Plan), 13);
observed.history.composite = { node: 'Index Scan', pages: 13, sort: false, indexLevels: (await q("SELECT level FROM bt_metap('index_orders_history')"))[0].level + 1 };
p = await plan(s.newest);
const newestScan = nodes(p.Plan).find((n) => /Scan/.test(n['Node Type']));
observed.newest = { node: newestScan['Node Type'], index: newestScan['Index Name'] ?? null, searches: newestScan['Index Searches'] ?? null, rows: newestScan['Actual Rows'], pages: pages(p.Plan), sort: has(p, 'Sort'), indexPages: Number((await q("SELECT pg_relation_size('index_orders_history') / 8192 AS n"))[0].n) };

// Covering indexes and index-only scans.
await db.exec(s.coveringIndex);
await db.exec('ANALYZE index_orders');
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Index Only Scan')['Heap Fetches'], 10);
assert.equal(pages(p.Plan), 13);
observed.history.coverBeforeVacuum = { node: 'Index Only Scan', heapFetches: 10, pages: 13 };
await db.exec('VACUUM (ANALYZE) index_orders');
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Index Only Scan')['Heap Fetches'], 0);
assert.equal(pages(p.Plan), 4);
observed.history.coverAfterVacuum = { node: 'Index Only Scan', heapFetches: 0, pages: 4 };
observed.sizes = (await q("SELECT pg_relation_size('index_orders') AS table_bytes, pg_relation_size('index_orders_cover') AS covering_index_bytes"))[0];

// Checking an index: the paid-only query and the usage view.
p = await plan(s.residual);
assert.equal(find(p, 'Index Scan')['Rows Removed by Filter'], 2);
assert.equal(find(p, 'Index Scan')['Actual Rows'], 10);
observed.residual = { fetched: 12, removed: 2, returned: 10 };
await q(s.usage); // runs; PGlite does not flush index scan counts, so the result is not recorded
await db.close();

// The reversed composite index, in its own session.
{
  const r = await open();
  await r.db.exec(setup);
  await r.db.exec('CREATE INDEX index_orders_reversed ON index_orders (placed_at DESC, customer_id); ANALYZE index_orders');
  const rp = await r.plan(s.history);
  assert.deepEqual((await r.q(s.history)).map((x) => x.order_id), expectedIds);
  observed.history.reversed = { node: 'Index Scan', pages: pages(rp.Plan), incrementalSort: has(rp, 'Incremental Sort'), entriesReadEstimate: 60000 - 49041 + 1 };
  assert(has(rp, 'Index Scan') && observed.history.reversed.pages > 40);
  await r.db.close();
}

// HOT updates, with and without total in an index, on ordinary tables.
observed.hot = {};
for (const [label, include, fillfactor] of [['fillfactor 90, total not indexed', false, 90], ['fillfactor 90, INCLUDE (total)', true, 90], ['default fillfactor, total not indexed', false, 100]]) {
  const h = await open();
  await h.db.exec(setup.replace('CREATE TEMP TABLE index_orders', 'CREATE TABLE index_orders').replace(/\);\nINSERT/, `) WITH (fillfactor = ${fillfactor});\nINSERT`));
  await h.db.exec(`CREATE INDEX index_orders_history ON index_orders (customer_id, placed_at DESC, order_id DESC)${include ? ' INCLUDE (total)' : ''}`);
  await h.db.exec('VACUUM (ANALYZE) index_orders');
  await h.db.exec(`BEGIN;
UPDATE index_orders SET total = total + 1 WHERE order_id % 100 = 0;
CREATE TEMP TABLE hot_result AS SELECT pg_stat_get_xact_tuples_updated('index_orders'::regclass) AS updated, pg_stat_get_xact_tuples_hot_updated('index_orders'::regclass) AS hot;
COMMIT;`);
  observed.hot[label] = (await h.q('SELECT * FROM hot_result'))[0];
  await h.db.close();
}
assert.equal(Number(observed.hot['fillfactor 90, total not indexed'].hot), 600);
assert.equal(Number(observed.hot['fillfactor 90, INCLUDE (total)'].hot), 0);

// Write-ahead log written by 10,000 inserts as indexes are added.
{
  const w = await open();
  await w.db.exec(setup.replace('CREATE TEMP TABLE index_orders', 'CREATE TABLE index_orders'));
  await w.db.exec('VACUUM (FREEZE, ANALYZE) index_orders');
  const extra = [
    'CREATE INDEX w_customer ON w (customer_id)',
    'CREATE INDEX w_history ON w (customer_id, placed_at DESC, order_id DESC)',
    'CREATE INDEX w_status ON w (status, placed_at)',
    'CREATE INDEX w_total ON w (total)',
  ];
  observed.walBytesFor10000Inserts = {};
  for (const i of [0, 0, 1, 2, 3, 4]) { // the first pass warms up and is overwritten
    await w.db.exec(`DROP TABLE IF EXISTS w; CREATE TABLE w (LIKE index_orders INCLUDING ALL); ${extra.slice(0, i).join('; ')};`);
    await w.db.exec('INSERT INTO w SELECT * FROM index_orders WHERE order_id <= 20000');
    await w.db.exec('CHECKPOINT');
    const a = (await w.q('SELECT pg_current_wal_insert_lsn() AS l'))[0].l;
    await w.db.exec('INSERT INTO w SELECT * FROM index_orders WHERE order_id > 20000 AND order_id <= 30000');
    const b = (await w.q('SELECT pg_current_wal_insert_lsn() AS l'))[0].l;
    observed.walBytesFor10000Inserts[`primary key + ${i}`] = Number((await w.q(`SELECT pg_wal_lsn_diff('${b}', '${a}') AS d`))[0].d);
  }
  await w.db.close();
  const wal = observed.walBytesFor10000Inserts;
  assert(wal['primary key + 0'] > 3.1e6 && wal['primary key + 0'] < 3.4e6);
  assert(wal['primary key + 4'] > 7.5e6 && wal['primary key + 4'] < 7.9e6);
  assert(Object.values(wal).every((v, i, all) => i === 0 || v > all[i - 1]));
}

// The downloadable script runs end to end in a fresh session.
{
  const d = await open();
  const parts = readFileSync(here('./experiment.sql'), 'utf8').split('VACUUM (ANALYZE) index_orders;');
  assert.equal(parts.length, 2);
  await d.db.exec(parts[0]);
  await d.db.exec('VACUUM (ANALYZE) index_orders');
  await d.db.exec(parts[1]);
  await d.db.close();
}

// B-tree depth at three sizes of integer index.
if (process.argv.includes('--depth')) {
  const t = await open({ pageinspect });
  await t.db.exec('CREATE EXTENSION pageinspect');
  observed.depth = {};
  for (const n of [100000, 1000000, 10000000]) {
    await t.db.exec(`DROP TABLE IF EXISTS t; CREATE TABLE t (id integer); INSERT INTO t SELECT g FROM generate_series(1, ${n}) g; CREATE INDEX t_id ON t (id); ANALYZE t;`);
    const m = (await t.q("SELECT root, level FROM bt_metap('t_id')"))[0];
    const lp = await t.plan(`SELECT * FROM t WHERE id = ${n / 2}`);
    const idx = nodes(lp.Plan).find((x) => x['Node Type'].includes('Index'));
    observed.depth[n] = {
      levels: m.level + 1,
      indexPages: Number((await t.q("SELECT pg_relation_size('t_id') / 8192 AS n"))[0].n),
      rootItems: (await t.q(`SELECT live_items FROM bt_page_stats('t_id', ${m.root})`))[0].live_items,
      leafItems: (await t.q("SELECT live_items FROM bt_page_stats('t_id', 1)"))[0].live_items,
      lookupIndexPages: pages(idx),
      lookupPages: pages(lp.Plan),
    };
  }
  await t.db.close();
  assert.deepEqual(Object.values(observed.depth).map((d) => d.levels), [2, 3, 3]);
} else {
  observed.depth = previous.depth ?? null;
}

writeFileSync(here('./observed.json'), JSON.stringify(observed, null, 2) + '\n');
console.log(JSON.stringify(observed, null, 2));
