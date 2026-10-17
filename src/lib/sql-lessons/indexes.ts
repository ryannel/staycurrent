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
CREATE INDEX ON write_indexed (customer_id, placed_at DESC, order_id DESC);
CREATE INDEX ON write_indexed (status, placed_at);
CREATE INDEX ON write_indexed (total);
INSERT INTO write_plain SELECT * FROM index_orders WHERE order_id <= 20000;
INSERT INTO write_indexed SELECT * FROM index_orders WHERE order_id <= 20000;
CREATE TEMP TABLE wal (inserted_into text, before_lsn pg_lsn, after_lsn pg_lsn);

CHECKPOINT;
INSERT INTO wal VALUES ('primary key only', pg_current_wal_insert_lsn());
INSERT INTO write_plain SELECT * FROM index_orders WHERE order_id BETWEEN 20001 AND 30000;
UPDATE wal SET after_lsn = pg_current_wal_insert_lsn() WHERE inserted_into = 'primary key only';

CHECKPOINT;
INSERT INTO wal VALUES ('four more indexes', pg_current_wal_insert_lsn());
INSERT INTO write_indexed SELECT * FROM index_orders WHERE order_id BETWEEN 20001 AND 30000;
UPDATE wal SET after_lsn = pg_current_wal_insert_lsn() WHERE inserted_into = 'four more indexes';

SELECT inserted_into, round(pg_wal_lsn_diff(after_lsn, before_lsn) / 1e6, 1) AS wal_mb
FROM wal;`;

export const explain = (sql: string) => 'EXPLAIN (ANALYZE, BUFFERS)\n' + sql;
export const setup = setupText.replace(/^--.*\n/gm, '').trim();

export const indexesTutorials: Tutorial[] = [
  {
    id: 'indexes',
    title: 'Count the pages an index saves',
    description: 'Run every measurement from the Indexes article on its 60,000 orders, from a full table scan to a covering index and the cost of writes.',
    articleHref: '/learn/databases/relational/indexes/',
    steps: [
      {
        title: 'Build the orders table',
        instruction: 'This creates the article’s table: 60,000 orders for 1,000 customers, 60 each, with a long delivery note so the rows fill many pages. It is a temporary table, so its page counts appear under “local” in plans. Restart the lesson to rebuild it.',
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
        title: 'The history query with the customer index',
        instruction: 'Ask for customer 42’s ten newest orders since 1 February. Look for the rows the heap scan removes and the Sort that puts the rest in date order.',
        sql: explain(history),
        expected: 'The Bitmap Heap Scan fetches 60 rows and removes 45 by filter, then a Sort picks the newest ten. 62 pages.',
      },
      {
        title: 'Put the date first, then the customer first',
        instruction: 'This runs the history query twice: once with an index that leads with the date, once with one that leads with customer_id. Compare the pages and whether a sort remains.',
        sql: `${reversedIndex}\n${explain(history)}\n\n${compositeIndex}\n${explain(history)}`,
        expected: 'Date first: an Index Scan with an Incremental Sort, 57 pages, after passing about 11,000 entries. Customer first: an Index Scan that stops after 10 rows with no sort, 13 pages.',
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
        instruction: 'Run the history query again and compare Heap Fetches and Buffers with step 8.',
        sql: explain(history),
        expected: 'Heap Fetches: 0, and Buffers counts 4 pages, all in the index. The answer came from the index alone.',
      },
      {
        title: 'Partial and expression indexes',
        instruction: 'The first index holds only pending orders. The second indexes each order’s date in UTC; the last two queries ask the same question, but only one repeats the indexed expression.',
        sql: `${partialIndex}\nSELECT pg_relation_size('index_orders_pending') / 8192 AS partial_index_pages;\n${explain(pending)}\n\n${dayIndex}\n${explain(day)}\n${explain(dayCast)}`,
        expected: 'The partial index is 35 pages, and the pending query reads it backwards, touching 4 pages. The matching expression uses the index and touches 47 pages to count 1,440 orders; placed_at::date reads all 1,725.',
      },
      {
        title: 'Count what four more indexes cost an insert',
        instruction: 'This copies 20,000 orders into two new tables, one with only a primary key and one with four more indexes, then inserts 10,000 more into each and measures the write-ahead log each insert wrote. It takes a few seconds.',
        sql: writeCost,
        expected: 'About 3.3 MB of write-ahead log with only the primary key, and about 7.7 MB with four more indexes.',
      },
      {
        title: 'Read a condition the index can’t use',
        instruction: 'Ask for paid orders only. The covering index has no status column, so find where the status condition appears in the plan: under Index Cond or under Filter.',
        sql: explain(residual),
        expected: 'status = \'paid\' appears under Filter, with Rows Removed by Filter: 2: the scan fetched 12 rows to return 10. The customer and date conditions are under Index Cond.',
      },
    ],
  },
];
