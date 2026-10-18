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
const source = readFileSync(here('../../../src/lib/sql-lessons/indexes.ts'), 'utf8');
const s = Object.fromEntries([...source.matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map((m) => [m[1], m[2]]));
const previous = existsSync(here('./observed.json')) ? JSON.parse(readFileSync(here('./observed.json'), 'utf8')) : {};
const observed = { checked: '2026-10-18', runtime: 'PGlite 0.5.8, in memory. Page counts, not timings.' };

const nodes = (p) => [p, ...(p.Plans ?? []).flatMap(nodes)];
const find = (p, type) => nodes(p.Plan).find((n) => n['Node Type'] === type);
const has = (p, type) => Boolean(find(p, type));
// Page counts. The orders table is temporary, so its table and index pages
// are local buffers. A plan can also report a few shared catalog pages, which
// belong to neither, so the article counts local pages only. The depth test
// uses ordinary tables, whose pages are shared.
const local = (n) => (n['Local Hit Blocks'] ?? 0) + (n['Local Read Blocks'] ?? 0);
const allPages = (n) => (n['Shared Hit Blocks'] ?? 0) + (n['Shared Read Blocks'] ?? 0) + local(n);
const pages = local;
const pageOf = (tid) => Number(String(tid).replace(/[()]/g, '').split(',')[0]);
const open = async (extensions = {}) => {
  const db = new PGlite({ extensions });
  const q = async (sql) => (await db.query(sql)).rows;
  const plan = async (sql) => (await q('EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON) ' + sql))[0]['QUERY PLAN'][0];
  const estimate = async (sql) => (await q('EXPLAIN (FORMAT JSON) ' + sql))[0]['QUERY PLAN'][0].Plan;
  const size = async (rel) => Number((await q(`SELECT pg_relation_size('${rel}') / 8192 AS n`))[0].n);
  return { db, q, plan, estimate, size };
};
const expectedIds = [59041, 58041, 57041, 56041, 55041, 54041, 53041, 52041, 51041, 50041];

// The article's sequence, in one session, in the order of experiment.sql.
const { db, q, plan, estimate, size } = await open({ pageinspect });
await db.exec('CREATE EXTENSION pageinspect');
await db.exec(setup);
const historyIds = async () => (await q(s.history)).map((r) => r.order_id);
observed.version = (await q('SELECT version()'))[0].version;
observed.tablePages = await size('index_orders');
assert.equal(observed.tablePages, 1725);

// Sequential scan, and the history query with no index.
let p = await plan(s.lookup);
assert.equal(p.Plan['Node Type'], 'Seq Scan');
assert.equal(p.Plan['Rows Removed by Filter'], 59940);
assert.equal(p.Plan['Actual Rows'], 60);
assert.equal(pages(p.Plan), 1725);
observed.lookupNoIndex = { node: 'Seq Scan', pages: 1725, removed: 59940, rows: 60 };
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert(has(p, 'Seq Scan') && has(p, 'Sort'));
assert.equal(pages(p.Plan), 1725);
observed.history = { none: { node: 'Seq Scan', pages: 1725, sort: true } };

// Index entries and TIDs; B-tree.
await db.exec(s.customerIndex);
p = await plan(s.lookup);
assert.equal(pages(find(p, 'Bitmap Index Scan')), 2);
assert.equal(find(p, 'Bitmap Heap Scan')['Exact Heap Blocks'], 60);
assert.equal(pages(p.Plan), 62);
observed.lookupCustomerIndex = { node: 'Bitmap Heap Scan', indexPages: 2, tablePages: 60, pages: 62 };
observed.customerIndex = {
  levels: (await q("SELECT level FROM bt_metap('index_orders_customer')"))[0].level + 1,
  pages: await size('index_orders_customer'),
};
assert.equal(observed.customerIndex.levels, 2);
const tids = (await q("SELECT array_length(tids, 1) AS n FROM bt_page_items('index_orders_customer', 1) WHERE tids IS NOT NULL LIMIT 1"))[0].n;
assert.equal(tids, 60);
observed.postingListTids = tids;

// Range scans.
p = await plan(s.range);
assert.equal(find(p, 'Bitmap Index Scan')['Actual Rows'], 360);
assert.equal(pages(find(p, 'Bitmap Index Scan')), 3);
assert.equal(find(p, 'Bitmap Heap Scan')['Exact Heap Blocks'], 70);
assert(has(p, 'Sort'));
observed.range = { node: 'Bitmap Heap Scan', entries: 360, indexPages: 3, tablePages: 70, sort: true };

// Selectivity: the plan chosen at each bound, and the planner's estimates.
const bound = (k) => s.wideRange.replace('500', String(k));
observed.selectivity = {};
for (const k of [1, 100, 300, 500, 550, 900]) {
  const sp = await plan(bound(k));
  observed.selectivity[k] = { node: sp.Plan['Node Type'], pages: pages(sp.Plan), tablePages: find(sp, 'Bitmap Heap Scan')?.['Exact Heap Blocks'] ?? null };
}
assert.equal(observed.selectivity[500].node, 'Bitmap Heap Scan');
assert.equal(observed.selectivity[500].tablePages, 922);
assert.equal(observed.selectivity[550].node, 'Seq Scan');
observed.estimates = {};
for (const k of [500, 550]) {
  await db.exec('SET enable_seqscan = off; SET enable_indexscan = off');
  const bitmap = await estimate(bound(k));
  await db.exec('RESET enable_seqscan; SET enable_bitmapscan = off');
  const seq = await estimate(bound(k));
  await db.exec('RESET enable_bitmapscan; RESET enable_indexscan');
  observed.estimates[k] = { bitmap: bitmap['Total Cost'], seq: seq['Total Cost'], rows: bitmap['Plan Rows'] };
}
// ANALYZE samples rows, so the estimates move slightly between runs. The
// article quotes only their order: the bitmap estimate rises with the
// matching rows and crosses the flat sequential-scan estimate between 500 and 550.
assert(observed.estimates[500].bitmap < observed.estimates[500].seq);
assert(observed.estimates[550].bitmap > observed.estimates[550].seq);
assert.equal(Math.round(observed.estimates[500].seq), Math.round(observed.estimates[550].seq));
observed.correlation = Number((await q("SELECT correlation FROM pg_stats WHERE tablename = 'index_orders' AND attname = 'customer_id'"))[0].correlation);
assert(Math.abs(observed.correlation) < 0.1);
observed.costSettings = { random_page_cost: (await q('SHOW random_page_cost'))[0].random_page_cost, seq_page_cost: (await q('SHOW seq_page_cost'))[0].seq_page_cost };
assert.equal(observed.costSettings.random_page_cost, '4');
assert.equal(observed.costSettings.seq_page_cost, '1');

// Selectivity belongs to the value: an index on status, paid against pending.
await db.exec(s.statusIndex + ' ANALYZE index_orders;');
p = await plan(s.paidOrders);
assert.equal(p.Plan['Node Type'], 'Seq Scan');
assert.equal(pages(p.Plan), 1725);
const paidRows = p.Plan['Actual Rows'];
assert.equal(paidRows, 48000);
const pp = await plan(s.pendingOrders);
assert.equal(pp.Plan['Node Type'], 'Bitmap Heap Scan');
observed.status = {
  paid: { node: 'Seq Scan', pages: 1725, rows: paidRows },
  pending: { node: 'Bitmap Heap Scan', tablePages: pp.Plan['Exact Heap Blocks'], indexPages: pages(find(pp, 'Bitmap Index Scan')), rows: pp.Plan['Actual Rows'] },
};
assert.equal(observed.status.pending.tablePages, 365);
assert.equal(observed.status.pending.indexPages, 12);
observed.status.correlation = Number((await q("SELECT correlation FROM pg_stats WHERE tablename = 'index_orders' AND attname = 'status'"))[0].correlation);
await db.exec(s.forceIndex);
p = await plan(s.paidOrders);
const forcedEstimate = await estimate(s.paidOrders);
// Equal keys sit in table order in a B-tree, so the forced scan reads the
// table forwards: each row's page is the same as or after the one before.
const forcedRowPages = (await q("SELECT ctid FROM index_orders WHERE status = 'paid'")).map((r) => pageOf(r.ctid));
await db.exec(s.resetPlanner);
const seqEstimate = await estimate(s.paidOrders);
assert.equal(p.Plan['Node Type'], 'Index Scan');
assert.equal(forcedEstimate['Node Type'], 'Index Scan');
observed.status.paidForced = {
  node: 'Index Scan', pages: pages(p.Plan),
  tablePages: new Set(forcedRowPages).size,
  readsForwards: forcedRowPages.every((page, i) => i === 0 || page >= forcedRowPages[i - 1]),
  estimatedCost: Math.round(forcedEstimate['Total Cost']),
  seqScanEstimatedCost: Math.round(seqEstimate['Total Cost']),
};
assert.equal(observed.status.paidForced.pages, 1426);
assert.equal(observed.status.paidForced.tablePages, 1384);
assert(observed.status.paidForced.readsForwards);
// The index scan's estimate moves with ANALYZE's sample (5,663 to 5,699 seen);
// the article says only that it is more than twice the scan's fixed 2,475.
assert.equal(observed.status.paidForced.seqScanEstimatedCost, 2475);
assert(observed.status.paidForced.estimatedCost > 2 * 2475, String(observed.status.paidForced.estimatedCost));
assert(observed.status.correlation > 0.5 && observed.status.correlation < 0.8, String(observed.status.correlation));

// Combining two indexes, and an OR with an unindexed branch.
p = await plan(s.bothConditions);
const and = find(p, 'BitmapAnd');
assert(and);
const [andCustomer, andStatus] = and.Plans;
assert.equal(andCustomer['Index Name'], 'index_orders_customer');
assert.equal(andStatus['Index Name'], 'index_orders_status');
observed.combining = { and: { customerIndexPages: pages(andCustomer), statusIndexPages: pages(andStatus), statusEntries: andStatus['Actual Rows'], rows: p.Plan['Actual Rows'] } };
assert.equal(observed.combining.and.customerIndexPages, 2);
assert.equal(observed.combining.and.statusIndexPages, 12);
assert.equal(observed.combining.and.rows, 12);
// One condition that finds a single row: the planner skips the status index.
p = await plan(s.selectiveAnd);
assert.equal(p.Plan['Node Type'], 'Index Scan');
assert.equal(p.Plan['Index Name'], 'index_orders_pkey');
assert(p.Plan.Filter.includes('status'));
assert.equal(p.Plan['Actual Rows'], 1);
observed.combining.selectiveAnd = { node: 'Index Scan', index: 'index_orders_pkey', filter: p.Plan.Filter, rows: 1, pages: pages(p.Plan) };
assert.equal(observed.combining.selectiveAnd.pages, 3);
p = await plan(s.eitherCondition);
assert(has(p, 'BitmapOr'));
observed.combining.or = { node: 'BitmapOr' };
p = await plan(s.unindexedBranch);
assert.equal(p.Plan['Node Type'], 'Seq Scan');
assert.equal(pages(p.Plan), 1725);
observed.combining.orUnindexed = { node: 'Seq Scan', pages: 1725 };
await db.exec(s.dropStatus + ' ANALYZE index_orders;');

// Composite indexes: customer index, reversed index, composite index.
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Bitmap Index Scan')['Actual Rows'], 60);
assert.equal(find(p, 'Bitmap Heap Scan')['Rows Removed by Filter'], 45);
assert(has(p, 'Sort'));
assert.equal(pages(p.Plan), 62);
observed.history.customer = { node: 'Bitmap Heap Scan', fetched: 60, removed: 45, pages: 62, sort: true };

await db.exec(s.reversedIndex);
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Index Scan')['Index Name'], 'index_orders_reversed');
assert(has(p, 'Incremental Sort'));
// The scan reads entries newest first and checks customer_id inside the
// index, so the plan reports only the rows it returned: customer 42's ten,
// plus the eleventh that ends the incremental sort's last group. The entries
// it passed are every order from that eleventh one to the newest.
const reversedRows = find(p, 'Index Scan')['Actual Rows'];
const eleventh = (await q("SELECT order_id FROM index_orders WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00' ORDER BY placed_at DESC OFFSET 10 LIMIT 1"))[0]?.order_id;
const reversedRead = Number((await q(`SELECT count(*) AS n FROM index_orders WHERE placed_at >= (SELECT placed_at FROM index_orders WHERE order_id = ${eleventh ?? 0})`))[0].n);
observed.history.reversed = { node: 'Index Scan', pages: pages(p.Plan), incrementalSort: true, rowsReturned: reversedRows, entriesRead: reversedRead };
assert.equal(observed.history.reversed.pages, 54);
assert(reversedRead > 10500 && reversedRead < 11500, String(reversedRead));

await db.exec(s.compositeIndex);
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Index Scan')['Actual Rows'], 10);
assert(!has(p, 'Sort'));
assert.equal(pages(p.Plan), 13);
observed.history.composite = {
  node: 'Index Scan', pages: 13, sort: false,
  indexLevels: (await q("SELECT level FROM bt_metap('index_orders_history')"))[0].level + 1,
  indexBytes: Number((await q("SELECT pg_relation_size('index_orders_history') AS b"))[0].b),
};
assert.equal(observed.history.composite.indexLevels, 3);

// Covering indexes and index-only scans.
await db.exec(s.coveringIndex);
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
// The plan the article prints for this point.
const text = (await q('EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, COSTS OFF) ' + s.history)).map((r) => r['QUERY PLAN']).join('\n');
observed.historyPlanText = text;
for (const line of ['Limit (actual rows=10.00 loops=1)', 'Index Only Scan using index_orders_cover on index_orders (actual rows=10.00 loops=1)', "Index Cond: ((customer_id = 42) AND (placed_at >= '2026-02-01 00:00:00+00'", 'Heap Fetches: 0', 'Buffers: local hit=4']) assert(text.includes(line), line);
observed.sizes = (await q("SELECT pg_relation_size('index_orders') AS table_bytes, pg_relation_size('index_orders_cover') AS covering_index_bytes"))[0];
// An update to another order on the same table page clears the page's bit.
const ctidOf = async (id) => (await q(`SELECT ctid FROM index_orders WHERE order_id = ${id}`))[0].ctid;
assert.equal(pageOf(await ctidOf(59040)), pageOf(await ctidOf(59041)));
assert.equal(Number((await q('SELECT customer_id FROM index_orders WHERE order_id = 59040'))[0].customer_id), 41);
await db.exec(s.neighbourUpdate);
p = await plan(s.history);
assert.deepEqual(await historyIds(), expectedIds);
assert.equal(find(p, 'Index Only Scan')['Heap Fetches'], 1);
assert.equal(pages(p.Plan), 5);
observed.history.coverAfterNeighbourUpdate = { node: 'Index Only Scan', heapFetches: 1, pages: 5 };

// Checking an index with EXPLAIN: the paid-only query.
p = await plan(s.residual);
assert.equal(find(p, 'Index Scan')['Rows Removed by Filter'], 2);
assert.equal(find(p, 'Index Scan')['Actual Rows'], 10);
observed.residual = { fetched: 12, removed: 2, returned: 10 };

// Partial, expression and unique indexes.
await db.exec(s.partialIndex);
const pendingRows = Number((await q("SELECT count(*) AS n FROM index_orders WHERE status = 'pending'"))[0].n);
p = await plan(s.pending);
const pendingScan = nodes(p.Plan).find((n) => n['Index Name'] === 'index_orders_pending');
assert(pendingScan && pendingScan['Scan Direction'] === 'Backward');
observed.partial = { pendingRows, pages: await size('index_orders_pending'), queryPages: pages(p.Plan) };
assert.equal(pendingRows, 12000);
assert.equal(observed.partial.pages, 35);
assert.equal(observed.partial.queryPages, 4);
await db.exec('CREATE INDEX index_orders_placed ON index_orders (placed_at)');
observed.partial.fullIndexPages = await size('index_orders_placed');
await db.exec('DROP INDEX index_orders_placed');

await db.exec(s.dayIndex);
p = await plan(s.day);
const dayScan = nodes(p.Plan).find((n) => n['Index Name'] === 'index_orders_day');
assert(dayScan);
const dayCount = Number((await q(s.day))[0].count);
assert.equal(dayCount, 1440);
observed.expression = { node: dayScan['Node Type'], rows: dayCount, pages: pages(p.Plan) };
assert.equal(observed.expression.pages, 47);
p = await plan(s.dayCast);
assert(has(p, 'Seq Scan'));
assert.equal(Number((await q(s.dayCast))[0].count), 1440);
observed.expression.castPlan = { node: 'Seq Scan', pages: pages(p.Plan) };
assert.equal(observed.expression.castPlan.pages, 1725);
await assert.rejects(db.exec("CREATE INDEX index_orders_cast ON index_orders ((placed_at::date))"), /IMMUTABLE/);

// Page splits: the same keys inserted in random order.
await db.exec(s.randomKeys);
const leafStats = async (rel) => (await q(`SELECT count(*) FILTER (WHERE type = 'l') AS leaves, count(*) FILTER (WHERE type = 'd') AS deleted, count(*) FILTER (WHERE type = 'l' AND live_items = 0) AS empty_leaves, round(avg(live_items) FILTER (WHERE type = 'l'), 1) AS avg_live, max(live_items) FILTER (WHERE type = 'l') AS max_live FROM generate_series(1, pg_relation_size('${rel}') / 8192 - 1) b, bt_page_stats('${rel}', b::int)`))[0];
observed.splits = {
  inOrder: { pages: await size('index_orders_pkey'), ...(await leafStats('index_orders_pkey')) },
  randomOrder: { pages: await size('random_keys_pkey'), ...(await leafStats('random_keys_pkey')) },
};
assert.equal(observed.splits.inOrder.pages, 166);
// random() differs between runs: nine runs gave 219 to 244 pages, most near 225.
assert(observed.splits.randomOrder.pages >= 215 && observed.splits.randomOrder.pages <= 250, String(observed.splits.randomOrder.pages));

// Deleted rows: two in three, scattered through the table, on a copy.
await db.exec(s.thinned);
const thinnedSize = async () => { const r = (await q(s.thinnedSize))[0]; return { rows: Number(r.rows_left), pages: Number(r.index_pages) }; };
observed.deleted = { scattered: { afterDelete: await thinnedSize() } };
await db.exec('VACUUM thinned');
observed.deleted.scattered.afterVacuum = { ...(await thinnedSize()), ...(await leafStats('thinned_pkey')) };
await db.exec(s.rebuildThinned);
observed.deleted.scattered.afterReindex = await thinnedSize();
assert.deepEqual(observed.deleted.scattered.afterDelete, { rows: 20000, pages: 166 });
assert.equal(observed.deleted.scattered.afterVacuum.pages, 166);
assert.equal(Number(observed.deleted.scattered.afterVacuum.deleted), 0);
assert.equal(observed.deleted.scattered.afterReindex.pages, 57);
// The same share deleted as one contiguous run: the oldest 40,000.
await db.exec(s.thinned.replace('thinned (LIKE', 'oldest (LIKE').replace('TABLE thinned ADD', 'TABLE oldest ADD').replace('INTO thinned', 'INTO oldest').replace('FROM thinned WHERE order_id % 3 <> 0', 'FROM oldest WHERE order_id <= 40000'));
await db.exec('VACUUM oldest');
observed.deleted.contiguous = { afterVacuum: { pages: await size('oldest_pkey'), ...(await leafStats('oldest_pkey')) } };
await db.exec('REINDEX TABLE oldest');
observed.deleted.contiguous.afterReindex = { pages: await size('oldest_pkey') };
assert.equal(observed.deleted.contiguous.afterVacuum.pages, 166);
assert.equal(Number(observed.deleted.contiguous.afterVacuum.deleted), 109);
assert.equal(observed.deleted.contiguous.afterReindex.pages, 57);
await db.exec('DROP TABLE random_keys; DROP TABLE thinned; DROP TABLE oldest;');

// The leading column has no condition: only (customer_id, placed_at) left.
await db.exec(s.leadingIndex);
await db.exec(s.uniqueIndex);
await db.exec('ANALYZE index_orders');
p = await plan(s.leading);
const walk = find(p, 'Index Scan');
assert.equal(walk['Index Name'], 'index_orders_customer_time');
assert(walk['Index Cond'].includes('placed_at') && !walk['Index Cond'].includes('customer_id'));
observed.leading = { node: 'Index Scan', index: walk['Index Name'], searches: walk['Index Searches'] ?? null, rows: walk['Actual Rows'], pages: pages(p.Plan), indexPages: await size('index_orders_customer_time') };
assert.equal(observed.leading.rows, 30);
assert.equal(observed.leading.pages, 234);
assert.equal(observed.leading.indexPages, 234);
// The window holds orders 44,640 to 44,669, customers 641 to 670.
p = await plan(s.leadingCustomer);
assert.equal(find(p, 'Index Scan')?.['Index Name'], 'index_orders_customer_time');
assert.equal(p.Plan['Actual Rows'], 1);
observed.leading.withCustomer = { customer: 650, node: 'Index Scan', rows: 1, pages: pages(p.Plan) };
assert.equal(observed.leading.withCustomer.pages, 4);
await db.exec(s.placedIndex);
p = await plan(s.leading);
assert.equal(find(p, 'Index Scan')?.['Index Name'] ?? find(p, 'Bitmap Index Scan')?.['Index Name'], 'index_orders_placed');
observed.leading.placedIndex = { pages: pages(p.Plan) };
assert.equal(observed.leading.placedIndex.pages, 5);
await db.exec('SET enable_indexscan = off; SET enable_bitmapscan = off;');
p = await plan(s.leading);
await db.exec('RESET enable_indexscan; RESET enable_bitmapscan;');
observed.leading.seqScan = { pages: pages(p.Plan) };
assert.equal(observed.leading.seqScan.pages, 1725);
// Order without sorting, with the same unique index.
p = await plan(s.mixedOrder);
assert(has(p, 'Incremental Sort'));
assert.equal(find(p, 'Index Scan')?.['Index Name'], 'index_orders_customer_time');
observed.order = { mixedDirections: 'Incremental Sort over index_orders_customer_time' };
p = await plan(s.wholeOrder);
assert(has(p, 'Seq Scan') && has(p, 'Sort') && !has(p, 'Index Scan'));
observed.order.noLimit = 'Seq Scan and Sort';

// The column is wrapped in a function.
await db.exec(s.emailIndex);
p = await plan(s.email);
assert.equal(pages(p.Plan), 62);
p = await plan(s.lowerEmail);
assert.equal(p.Plan['Node Type'], 'Seq Scan');
assert(p.Plan.Filter.includes('lower'));
assert.equal(pages(p.Plan), 1725);
observed.wrapped = { bare: { pages: 62 }, lower: { node: 'Seq Scan', pages: 1725, filter: p.Plan.Filter } };

// A unique index refuses a second order for one customer at one instant.
observed.unique = { pages: await size('index_orders_customer_time') };
await assert.rejects(db.exec("INSERT INTO index_orders SELECT 60001, customer_id, placed_at, status, total, email, note FROM index_orders WHERE order_id = 42"), /duplicate key/);

// Finding unused indexes. PGlite does not flush index scan counts, so the
// result is not recorded.
await q(s.usage);
await db.close();

// The same selectivity test with the rows shuffled across the pages.
{
  const r = await open();
  await r.db.exec(setup.replaceAll('1 + n % 1000', '1 + ((n::bigint * 7919) % 60000) % 1000').replace('FROM generate_series(1, 60000) AS series(n);', 'FROM generate_series(1, 60000) AS series(n) ORDER BY random();'));
  await r.db.exec(s.customerIndex + ' ANALYZE index_orders;');
  const at = async (k) => { const sp = await r.plan(bound(k)); return { node: sp.Plan['Node Type'], tablePages: find(sp, 'Bitmap Heap Scan')?.['Exact Heap Blocks'] ?? null }; };
  observed.shuffled = { copyPages: await r.size('index_orders'), 500: await at(500), 550: await at(550) };
  observed.shuffled.correlation = Number((await r.q("SELECT correlation FROM pg_stats WHERE tablename = 'index_orders' AND attname = 'customer_id'"))[0].correlation);
  assert.equal(observed.shuffled[500].node, 'Bitmap Heap Scan');
  assert.equal(observed.shuffled[550].node, 'Seq Scan');
  // The copy packs slightly tighter than the original (1,715 pages, not
  // 1,725), and the bitmap scan at 500 read every one of them.
  assert.equal(observed.shuffled.copyPages, 1715);
  assert.equal(observed.shuffled[500].tablePages, observed.shuffled.copyPages);
  await r.db.close();
}

// Statistics that no longer match the data: 40,000 rows added after ANALYZE.
// Autovacuum never processes temporary tables (and PGlite runs none), so
// nothing refreshes the statistics meanwhile.
{
  const st = await open();
  await st.db.exec(s.staleSetup);
  const read = async (sql) => { const sp = await st.plan(sql); return { sp, pages: pages(sp.Plan) }; };
  let r = await read(s.staleNew);
  assert.equal(r.sp.Plan['Node Type'], 'Index Scan');
  observed.stale = { single: { estimatedRows: r.sp.Plan['Plan Rows'], actualRows: r.sp.Plan['Actual Rows'], node: 'Index Scan', pages: r.pages } };
  await st.db.exec('SET enable_indexscan = off; SET enable_bitmapscan = off;');
  observed.stale.single.seqScanPages = (await read(s.staleNew)).pages;
  await st.db.exec('RESET enable_indexscan; RESET enable_bitmapscan;');
  r = await read(s.staleJoin);
  const loop = find(r.sp, 'Nested Loop');
  assert(loop);
  observed.stale.joinBefore = { node: 'Nested Loop', estimatedRows: loop['Plan Rows'], loops: find(r.sp, 'Index Only Scan')['Actual Loops'], pages: r.pages };
  await st.db.exec('ANALYZE events');
  r = await read(s.staleNew);
  observed.stale.single.estimatedAfterAnalyze = r.sp.Plan['Plan Rows'];
  r = await read(s.staleJoin);
  assert(has(r.sp, 'Hash Join'));
  observed.stale.joinAfter = { node: 'Hash Join', pages: r.pages };
  observed.stale.deliveriesPages = await st.size('deliveries');
  assert.equal(observed.stale.single.estimatedRows, 1);
  assert.equal(observed.stale.single.actualRows, 40000);
  assert.equal(observed.stale.single.pages, 723);
  assert.equal(observed.stale.single.seqScanPages, 1552);
  assert.equal(observed.stale.joinBefore.loops, 40000);
  assert.equal(observed.stale.joinBefore.pages, 120723);
  assert.equal(observed.stale.joinAfter.pages, 1565);
  assert(observed.stale.single.estimatedAfterAnalyze > 39000 && observed.stale.single.estimatedAfterAnalyze < 41000);
  await st.db.close();
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
assert.equal(Number(observed.hot['default fillfactor, total not indexed'].hot), 0);

// Write-ahead log written by 10,000 inserts: the sandbox lesson's statement,
// run as one query string, then each of the write figure's index counts.
{
  const w = await open();
  await w.db.exec(setup);
  const rows = (await w.db.exec(s.writeCost)).at(-1).rows;
  observed.walMBFor10000Inserts = Object.fromEntries(rows.map((r) => [r.inserted_into, Number(r.wal_mb)]));
  assert.equal(observed.walMBFor10000Inserts['primary key only'], 3.3);
  assert.equal(observed.walMBFor10000Inserts['four indexes'], 6.7);
  const sets = [[], ['(customer_id)'], ['(customer_id)', '(customer_id, placed_at DESC)'], ['(customer_id)', '(customer_id, placed_at DESC)', '(total)']];
  observed.walMBByIndexCount = {};
  for (const [i, extra] of sets.entries()) {
    await w.db.exec(`CREATE TABLE w${i} (LIKE index_orders); ALTER TABLE w${i} ADD PRIMARY KEY (order_id); ${extra.map((e) => `CREATE INDEX ON w${i} ${e};`).join(' ')} INSERT INTO w${i} SELECT * FROM index_orders WHERE order_id <= 20000;`);
    await w.db.exec('CHECKPOINT');
    const a = (await w.q('SELECT pg_current_wal_insert_lsn() AS l'))[0].l;
    await w.db.exec(`INSERT INTO w${i} SELECT * FROM index_orders WHERE order_id BETWEEN 20001 AND 30000`);
    const b = (await w.q('SELECT pg_current_wal_insert_lsn() AS l'))[0].l;
    observed.walMBByIndexCount[i + 1] = Number((await w.q(`SELECT round(pg_wal_lsn_diff('${b}', '${a}') / 1e6, 1) AS mb`))[0].mb);
  }
  assert.deepEqual(observed.walMBByIndexCount, { 1: 3.3, 2: 4.2, 3: 5.6, 4: 6.7 });
  await w.db.close();
}

// The downloadable script runs end to end in a fresh session. VACUUM can't
// share a query string with other statements, so each runs on its own.
{
  const d = await open();
  const parts = readFileSync(here('./experiment.sql'), 'utf8').split(/^(VACUUM[^;]*;)$/m);
  assert(parts.length >= 5);
  for (const part of parts) if (part.trim()) await d.db.exec(part);
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
      lookupIndexPages: allPages(idx),
      lookupPages: allPages(lp.Plan),
    };
  }
  await t.db.close();
  assert.deepEqual(Object.values(observed.depth).map((d) => d.levels), [2, 3, 3]);
} else {
  observed.depth = previous.depth ?? null;
}

writeFileSync(here('./observed.json'), JSON.stringify(observed, null, 2) + '\n');
console.log(JSON.stringify(observed, null, 2));
