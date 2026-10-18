import type { Tutorial } from '../sql-sandbox-tutorials';
import setupText from '../../../docs/article-work/indexes/setup.sql?raw';

// The SQL behind every measurement in the Indexes article. The article shows
// these statements, the sandbox lesson below runs them, and
// docs/article-work/indexes/build-experiment.mjs and verify.mjs read the
// constants from this file, so keep each one a plain template with no ${}.
export const lookup = `SELECT *
FROM index_orders
WHERE customer_id = 42;`;
export const customerIndex = `CREATE INDEX index_orders_customer
ON index_orders (customer_id);`;
export const range = `SELECT order_id, customer_id
FROM index_orders
WHERE customer_id BETWEEN 40 AND 45
ORDER BY customer_id;`;
export const wideRange = `SELECT order_id, total
FROM index_orders
WHERE customer_id <= 500;`;
export const statusIndex = `CREATE INDEX index_orders_status
ON index_orders (status);`;
export const paidOrders = `SELECT order_id, total
FROM index_orders
WHERE status = 'paid';`;
export const pendingOrders = `SELECT order_id, total
FROM index_orders
WHERE status = 'pending';`;
export const forceIndex = `SET enable_seqscan = off;
SET enable_bitmapscan = off;`;
export const resetPlanner = `RESET enable_seqscan;
RESET enable_bitmapscan;`;
export const bothConditions = `SELECT order_id
FROM index_orders
WHERE customer_id = 42 AND status = 'pending';`;
export const selectiveAnd = `SELECT order_id
FROM index_orders
WHERE order_id = 7 AND status = 'pending';`;
export const eitherCondition = `SELECT order_id
FROM index_orders
WHERE customer_id = 42 OR order_id = 7;`;
export const unindexedBranch = `SELECT order_id
FROM index_orders
WHERE customer_id = 42 OR total = 10.5;`;
export const dropStatus = `DROP INDEX index_orders_status;`;
export const history = `SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;`;
export const reversedIndex = `DROP INDEX index_orders_customer;
CREATE INDEX index_orders_reversed
ON index_orders (placed_at DESC, customer_id);`;
export const compositeIndex = `DROP INDEX index_orders_reversed;
CREATE INDEX index_orders_history
ON index_orders (customer_id, placed_at DESC, order_id DESC);`;
export const coveringIndex = `DROP INDEX index_orders_history;
CREATE INDEX index_orders_cover
ON index_orders (customer_id, placed_at DESC, order_id DESC)
INCLUDE (total);`;
export const neighbourUpdate = `UPDATE index_orders
SET total = total + 1
WHERE order_id = 59040;`;
export const residual = `SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND status = 'paid'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;`;
export const partialIndex = `CREATE INDEX index_orders_pending
ON index_orders (placed_at)
WHERE status = 'pending';`;
export const pending = `SELECT order_id, placed_at
FROM index_orders
WHERE status = 'pending'
ORDER BY placed_at DESC
LIMIT 10;`;
export const dayIndex = `CREATE INDEX index_orders_day
ON index_orders (((placed_at AT TIME ZONE 'UTC')::date));`;
export const day = `SELECT count(*)
FROM index_orders
WHERE (placed_at AT TIME ZONE 'UTC')::date = date '2026-02-01';`;
export const dayCast = `SELECT count(*)
FROM index_orders
WHERE placed_at::date = date '2026-02-01';`;
export const uniqueIndex = `CREATE UNIQUE INDEX index_orders_customer_time
ON index_orders (customer_id, placed_at);`;
export const usage = `SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE relname = 'index_orders';`;
export const writeCost = `CREATE TABLE write_plain (LIKE index_orders);
ALTER TABLE write_plain ADD PRIMARY KEY (order_id);
CREATE TABLE write_indexed (LIKE index_orders);
ALTER TABLE write_indexed ADD PRIMARY KEY (order_id);
CREATE INDEX ON write_indexed (customer_id);
CREATE INDEX ON write_indexed (customer_id, placed_at DESC);
CREATE INDEX ON write_indexed (total);
INSERT INTO write_plain SELECT * FROM index_orders WHERE order_id <= 20000;
INSERT INTO write_indexed SELECT * FROM index_orders WHERE order_id <= 20000;
CREATE TEMP TABLE wal (inserted_into text, before_lsn pg_lsn, after_lsn pg_lsn);

CHECKPOINT;
INSERT INTO wal VALUES ('primary key only', pg_current_wal_insert_lsn());
INSERT INTO write_plain SELECT * FROM index_orders WHERE order_id BETWEEN 20001 AND 30000;
UPDATE wal SET after_lsn = pg_current_wal_insert_lsn() WHERE inserted_into = 'primary key only';

CHECKPOINT;
INSERT INTO wal VALUES ('four indexes', pg_current_wal_insert_lsn());
INSERT INTO write_indexed SELECT * FROM index_orders WHERE order_id BETWEEN 20001 AND 30000;
UPDATE wal SET after_lsn = pg_current_wal_insert_lsn() WHERE inserted_into = 'four indexes';

SELECT inserted_into, round(pg_wal_lsn_diff(after_lsn, before_lsn) / 1e6, 1) AS wal_mb
FROM wal;`;
export const randomKeys = `CREATE TEMP TABLE random_keys (LIKE index_orders);
ALTER TABLE random_keys ADD PRIMARY KEY (order_id);
INSERT INTO random_keys
SELECT * FROM index_orders ORDER BY random();
SELECT pg_relation_size('index_orders_pkey') / 8192 AS in_order_pages,
       pg_relation_size('random_keys_pkey') / 8192 AS random_order_pages;`;
export const thinned = `CREATE TEMP TABLE thinned (LIKE index_orders);
ALTER TABLE thinned ADD PRIMARY KEY (order_id);
INSERT INTO thinned
SELECT * FROM index_orders ORDER BY order_id;
DELETE FROM thinned WHERE order_id % 3 <> 0;`;
export const thinnedSize = `SELECT count(*) AS rows_left,
       pg_relation_size('thinned_pkey') / 8192 AS index_pages
FROM thinned;`;
export const rebuildThinned = `REINDEX TABLE thinned;`;
export const leadingIndex = `DROP INDEX index_orders_cover;`;
export const leading = `SELECT order_id
FROM index_orders
WHERE placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND placed_at < timestamptz '2026-02-01 00:30:00+00';`;
export const leadingCustomer = `SELECT order_id
FROM index_orders
WHERE customer_id = 650
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND placed_at < timestamptz '2026-02-01 00:30:00+00';`;
export const placedIndex = `CREATE INDEX index_orders_placed
ON index_orders (placed_at);`;
export const mixedOrder = `SELECT order_id
FROM index_orders
ORDER BY customer_id, placed_at DESC
LIMIT 5;`;
export const wholeOrder = `SELECT order_id
FROM index_orders
ORDER BY customer_id, placed_at;`;
export const emailIndex = `CREATE INDEX index_orders_email
ON index_orders (email);`;
export const email = `SELECT order_id
FROM index_orders
WHERE email = 'Shopper0042@Example.com';`;
export const lowerEmail = `SELECT order_id
FROM index_orders
WHERE lower(email) = 'shopper0042@example.com';`;
export const statusLast = `CREATE INDEX index_orders_cover_status
ON index_orders (customer_id, placed_at DESC, order_id DESC, status)
INCLUDE (total);`;
export const dropStatusLast = `DROP INDEX index_orders_cover_status;`;
export const bareSetup = `CREATE INDEX index_orders_customer
ON index_orders (customer_id);
CREATE INDEX index_orders_placed
ON index_orders (placed_at);`;
export const bareDay = `SELECT order_id
FROM index_orders
WHERE placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND placed_at < timestamptz '2026-02-02 00:00:00+00';`;
export const truncDay = `SELECT order_id
FROM index_orders
WHERE date_trunc('day', placed_at) = timestamptz '2026-02-01 00:00:00+00';`;
export const plusZero = `SELECT *
FROM index_orders
WHERE customer_id + 0 = 42;`;
export const asText = `SELECT *
FROM index_orders
WHERE customer_id::text = '42';`;
export const asNumeric = `SELECT *
FROM index_orders
WHERE customer_id = 42::numeric;`;
export const asBigint = `SELECT *
FROM index_orders
WHERE customer_id = 42::bigint;`;
export const catchAll = `PREPARE orders_for(integer) AS
SELECT order_id
FROM index_orders
WHERE ($1 IS NULL OR customer_id = $1);`;
export const latestOne = `SELECT order_id, placed_at
FROM index_orders
WHERE customer_id = 42
ORDER BY placed_at DESC
LIMIT 1;`;
export const quietCustomer = `INSERT INTO index_orders
SELECT 60000 + n, 1001,
  timestamptz '2025-12-01 00:00:00+00' + n * interval '1 hour',
  'paid', 10, 'shopper1001@example.com', ''
FROM generate_series(1, 60) AS series(n);
ANALYZE index_orders;`;
export const latestQuiet = `SELECT order_id, placed_at
FROM index_orders
WHERE customer_id = 1001
ORDER BY placed_at DESC
LIMIT 1;`;
export const latestIndex = `CREATE INDEX index_orders_customer_placed
ON index_orders (customer_id, placed_at);`;
export const staleSetup = `CREATE TEMP TABLE events (
  event_id integer PRIMARY KEY,
  kind text NOT NULL,
  payload text NOT NULL
);
INSERT INTO events
SELECT n, 'done', repeat('x', 100) FROM generate_series(1, 50000) AS series(n);
CREATE INDEX events_kind ON events (kind);
CREATE TEMP TABLE deliveries (
  event_id integer PRIMARY KEY,
  address text NOT NULL
);
INSERT INTO deliveries
SELECT n, repeat('y', 40) FROM generate_series(1, 90000) AS series(n);
ANALYZE events;
ANALYZE deliveries;
INSERT INTO events
SELECT n, 'new', repeat('x', 100) FROM generate_series(50001, 90000) AS series(n);`;
export const staleNew = `SELECT *
FROM events
WHERE kind = 'new';`;
export const staleJoin = `SELECT count(*)
FROM events JOIN deliveries USING (event_id)
WHERE events.kind = 'new';`;
export const analyzeEvents = `ANALYZE events;`;

export const explain = (sql: string) => 'EXPLAIN (ANALYZE, BUFFERS)\n' + sql;
export const setup = setupText.replace(/^--.*\n/gm, '').trim();

export const indexesTutorials: Tutorial[] = [
  {
    id: 'indexes',
    title: 'Count the pages an index saves',
    description: 'Run the measurements from the Indexes article on its 60,000 orders, from a full table scan to a covering index, the cost of writes, an index the planner can only walk and a plan built on stale statistics.',
    articleHref: '/learn/databases/relational/indexes/',
    steps: [
      {
        title: 'Build the orders table',
        instruction: 'This creates the article’s table: 60,000 orders for 1,000 customers, 60 each, with an email address and a delivery note so the rows fill many pages. It is a temporary table, so its page counts appear under “local” in plans. Restart the lesson to rebuild it.',
        sql: `DROP TABLE IF EXISTS index_orders;\n${setup}\nSELECT pg_relation_size('index_orders') / 8192 AS table_pages;`,
        expected: 'The table fills 1,725 pages of 8 kB.',
      },
      {
        title: 'Find customer 42 with no index',
        instruction: 'EXPLAIN (ANALYZE, BUFFERS) runs the query and reports how PostgreSQL found the rows. Find the node type, the rows it removed and the Buffers line just below it: its hit and read counts add up to the pages the scan touched. The Buffers line under Planning is the planner’s own work.',
        sql: explain(lookup),
        expected: 'A Seq Scan returns 60 rows, removes 59,940 by filter and touches all 1,725 pages.',
      },
      {
        title: 'Add an index on customer_id',
        instruction: 'Create the index and run the same lookup. The plan now has two parts: the index scan finds the TIDs, and the heap scan reads the table pages they point to.',
        sql: `${customerIndex}\n${explain(lookup)}`,
        expected: 'The Bitmap Index Scan touches 2 pages and the Bitmap Heap Scan reads 60 table pages (Heap Blocks: exact=60), 62 in all.',
      },
      {
        title: 'Read a range of customers',
        instruction: 'Ask for customers 40 to 45 in order. Look at how many entries the index scan returns, how many index pages it touches, and whether a Sort appears above the heap scan.',
        sql: explain(range),
        expected: '360 entries from 3 index pages, 70 table pages, then a Sort: the bitmap heap scan reads pages in page order and loses the index order.',
      },
      {
        title: 'Widen the range until the plan switches',
        instruction: 'This matches half the customers. Note the plan and its heap blocks, then change 500 to 550 and run it again.',
        sql: explain(wideRange),
        expected: 'At 500 a Bitmap Heap Scan reads 922 of the 1,725 table pages. At 550 the planner switches to a Seq Scan. Its estimates come from a sample of rows, so on a rare run the switch can land one step away.',
      },
      {
        title: 'Index a column with two values',
        instruction: 'Four orders in five are paid and one in five is pending. Index status, ask for each value, then turn off the routes the planner preferred and ask for the paid orders again. The last two statements put the planner back to normal.',
        sql: `${statusIndex}\n${explain(paidOrders)}\n${explain(pendingOrders)}\n${forceIndex}\n${explain(paidOrders)}\n${resetPlanner}`,
        expected: 'Paid: a Seq Scan of 1,725 pages, with an estimated cost (the second cost= number) of 2,475. Pending: a Bitmap Heap Scan reading 365 table pages and 12 index pages. The forced Index Scan for paid reads 1,426 pages, about a sixth fewer than the scan, yet its estimated cost is more than twice as high.',
      },
      {
        title: 'Combine two indexes',
        instruction: 'With separate indexes on customer_id and status, ask for both conditions, then for one order by its key with the same status condition, then for either of two indexed conditions, then for an OR whose second branch has no index. The last statement drops the status index again.',
        sql: `${explain(bothConditions)}\n${explain(selectiveAnd)}\n${explain(eitherCondition)}\n${explain(unindexedBranch)}\n${dropStatus}`,
        expected: 'Customer 42 AND pending: a BitmapAnd over 2 pages of the customer index and 12 of the status index, for 12 rows. Order 7 AND pending: an Index Scan on the primary key with status under Filter, 3 pages. OR on two indexed columns: a BitmapOr. OR with an unindexed total: a Seq Scan of 1,725 pages.',
      },
      {
        title: 'The history query with the customer index',
        instruction: 'Ask for customer 42’s ten newest orders since 1 February. Look for the rows the heap scan removes and the Sort that puts the rest in date order.',
        sql: explain(history),
        expected: 'The Bitmap Heap Scan fetches 60 rows and removes 45 by filter, then a Sort picks the newest ten. 62 pages.',
      },
      {
        title: 'Put the date first, then the customer first',
        instruction: 'This runs the history query twice: once with an index that leads with the date, once with one that leads with customer_id. Compare the local pages and whether a sort remains.',
        sql: `${reversedIndex}\n${explain(history)}\n\n${compositeIndex}\n${explain(history)}`,
        expected: 'Date first: an Index Scan with an Incremental Sort, 54 local pages, after passing about 11,000 entries. Customer first: an Index Scan that stops after 10 rows with no sort, 13 pages.',
      },
      {
        title: 'Include total in the index',
        instruction: 'Rebuild the composite index with total included, then run the history query. Look for Index Only Scan and its Heap Fetches line. The last query compares the index and table sizes.',
        sql: `${coveringIndex}\n${explain(history)}\n\nSELECT round(pg_relation_size('index_orders_cover') / 1048576.0, 1) AS covering_index_mib,\n       round(pg_relation_size('index_orders') / 1048576.0, 1) AS table_mib;`,
        expected: 'An Index Only Scan, but Heap Fetches: 10 and 13 pages: no page is marked all-visible yet. The index is 2.9 MiB beside a 13.5 MiB table.',
      },
      {
        title: 'Run VACUUM',
        instruction: 'VACUUM sets the visibility map’s bits. It can’t run inside a transaction block, and several statements in one run share one, so it gets a run of its own.',
        sql: 'VACUUM (ANALYZE) index_orders;',
        expected: 'VACUUM completes with no result table.',
      },
      {
        title: 'The history query after VACUUM',
        instruction: 'Run the history query again and compare Heap Fetches and Buffers with the run before VACUUM.',
        sql: explain(history),
        expected: 'Heap Fetches: 0, and Buffers counts 4 pages, all in the index. The answer came from the index alone.',
      },
      {
        title: 'Update a neighbouring row',
        instruction: 'Order 59040 belongs to customer 41, but it shares a table page with customer 42’s newest order. Change its total, then run the history query again.',
        sql: `${neighbourUpdate}\n${explain(history)}`,
        expected: 'Heap Fetches: 1 and 5 pages. The update cleared that page’s visibility bit, so the scan checked the table for customer 42’s row there.',
      },
      {
        title: 'Read a condition the index can’t use',
        instruction: 'Ask for paid orders only. The covering index has no status column, so find where the status condition appears in the plan: under Index Cond or under Filter.',
        sql: explain(residual),
        expected: 'status = \'paid\' appears under Filter, with Rows Removed by Filter: 2: the scan fetched 12 rows to return 10. The customer and date conditions are under Index Cond.',
      },
      {
        title: 'Partial and expression indexes',
        instruction: 'The first index holds only pending orders. The second indexes each order’s date in UTC; the last two queries ask the same question, but only one repeats the indexed expression.',
        sql: `${partialIndex}\nSELECT pg_relation_size('index_orders_pending') / 8192 AS partial_index_pages;\n${explain(pending)}\n\n${dayIndex}\n${explain(day)}\n${explain(dayCast)}`,
        expected: 'The partial index is 35 pages, and the pending query reads it backwards, touching 4 pages. The matching expression uses the index and touches 47 pages to count 1,440 orders; placed_at::date reads all 1,725.',
      },
      {
        title: 'Count what three more indexes cost an insert',
        instruction: 'This copies 20,000 orders into two new tables, one with only a primary key and one with the three other indexes from the article’s write figure, then inserts 10,000 more into each and measures the write-ahead log each insert wrote. It takes a few seconds.',
        sql: writeCost,
        expected: 'About 3.3 MB of write-ahead log with only the primary key, and about 6.7 MB with all four indexes.',
      },
      {
        title: 'Insert the keys in random order',
        instruction: 'This copies the table into one whose primary key receives the order IDs in random order, then compares the two primary key indexes.',
        sql: randomKeys,
        expected: '166 pages for keys inserted in order, and about 225 for the same keys in random order. The random count changes between runs, usually between 215 and 245.',
      },
      {
        title: 'Delete two rows in three',
        instruction: 'This copies the table, deletes every order whose ID is not a multiple of 3, and measures the primary key index.',
        sql: `${thinned}\n${thinnedSize}`,
        expected: '20,000 rows left, and the index is still 166 pages.',
      },
      {
        title: 'VACUUM the copy',
        instruction: 'VACUUM removes the dead index entries. It gets a run of its own.',
        sql: 'VACUUM thinned;',
        expected: 'VACUUM completes with no result table.',
      },
      {
        title: 'Rebuild the index',
        instruction: 'Measure the index after VACUUM, rebuild it, and measure it again.',
        sql: `${thinnedSize}\n${rebuildThinned}\n${thinnedSize}`,
        expected: 'Still 166 pages after VACUUM; 57 after REINDEX.',
      },
      {
        title: 'Search without the leading column',
        instruction: 'Drop the covering index and add a unique index on (customer_id, placed_at). Ask for a 30-minute window of orders, which gives the index’s first column no condition, then for the same window with a customer the window contains. Then add an index on placed_at and ask for the window again. Add up the local hit and read counts.',
        sql: `${leadingIndex}\n${uniqueIndex}\n${explain(leading)}\n${explain(leadingCustomer)}\n${placedIndex}\n${explain(leading)}`,
        expected: 'First an Index Scan on index_orders_customer_time with placed_at under Index Cond, touching 234 local pages for 30 rows, every leaf page of the index among them. With customer 650 named as well, 4 pages for its one order. With the placed_at index, 5 pages.',
      },
      {
        title: 'Let the index supply the sort order',
        instruction: 'The unique index on (customer_id, placed_at) is still there. Ask for five orders by customer with the newest first, which mixes two directions, then for every order by customer and date with no LIMIT.',
        sql: `${explain(mixedOrder)}\n${explain(wholeOrder)}`,
        expected: 'The mixed order is an Incremental Sort over an Index Scan on index_orders_customer_time: the index supplies the customer order, and only each customer’s dates are sorted. With no LIMIT, the whole table comes from a Seq Scan and a Sort.',
      },
      {
        title: 'Wrap the column in a function',
        instruction: 'Index email, then ask for one address as stored and the same address through lower().',
        sql: `${emailIndex}\n${explain(email)}\n${explain(lowerEmail)}`,
        expected: 'The bare column uses the index: 2 index pages and 60 table pages. lower(email) is a Seq Scan of 1,725 pages, with the function in the Filter line.',
      },
      {
        title: 'Let the statistics go stale',
        instruction: 'This builds a separate events table of 50,000 done rows and a deliveries table with one row per event, collects statistics, then adds 40,000 new events without collecting them again. Compare estimated and actual rows for the new events, then join them to their deliveries. It takes a few seconds.',
        sql: `DROP TABLE IF EXISTS events, deliveries;\n${staleSetup}\n${explain(staleNew)}\n${explain(staleJoin)}`,
        expected: 'The new events are estimated at rows=1 and return 40,000, through an Index Scan of 723 pages. The join believes the same estimate: a Nested Loop that searches the deliveries index 40,000 times (loops=40000), 120,723 pages in all.',
      },
      {
        title: 'Collect the statistics again',
        instruction: 'Run ANALYZE on the events table, then the same two queries.',
        sql: `${analyzeEvents}\n${explain(staleNew)}\n${explain(staleJoin)}`,
        expected: 'The estimate is now close to 40,000. The single-table plan is unchanged, at 723 pages, but the join becomes a Hash Join that reads 1,565 pages.',
      },
    ],
  },
];
