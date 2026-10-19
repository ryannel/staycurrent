import type { Tutorial } from '../sql-sandbox-tutorials';

export const performanceTutorials: Tutorial[] = [
  {
    id: 'performance-estimates',
    title: 'A query changes as its data changes',
    description: 'Compare estimated and actual rows, refresh statistics, and test a narrower access path.',
    articleHref: '/learn/databases/relational/slow-queries/',
    steps: [
      {
        title: 'Prepare a queue of jobs',
        instruction: 'Run this independent setup first. It replaces only the perf_jobs practice table, creates 10,000 jobs, and collects planner statistics. Ten jobs are queued. All steps use this connection; no other session changes these records. Restart this lesson, or rerun this setup, to restore the beginning.',
        sql: `DROP TABLE IF EXISTS perf_jobs;
CREATE TABLE perf_jobs (
  job_id integer PRIMARY KEY,
  state text NOT NULL,
  payload text NOT NULL
);
INSERT INTO perf_jobs (job_id, state, payload)
SELECT n, CASE WHEN n <= 10 THEN 'queued' ELSE 'done' END,
       repeat('parcel ', 20)
FROM generate_series(1, 10000) AS g(n);
ANALYZE perf_jobs;
SELECT state, count(*) FROM perf_jobs GROUP BY state ORDER BY state;`,
        expected: 'done = 9,990 and queued = 10. ANALYZE collected statistics about that distribution; it did not create an index on state.',
      },
      {
        title: 'Compare the estimate with the work',
        instruction: 'Predict how many rows match and how many the database must inspect without a state index. EXPLAIN ANALYZE executes this read and reports its plan. Find the scan below the aggregate; the aggregate itself returns just one count.',
        sql: `EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM perf_jobs WHERE state = 'queued';`,
        expected: 'The sequential scan emits 10 rows and removes 9,990 by its filter. Its estimated rows should be close to 10. The outer aggregate emits one row. Cost is a planner estimate, not milliseconds.',
      },
      {
        title: 'Change the population',
        instruction: 'Queue 4,990 more jobs without refreshing statistics. Before running, predict the actual match count. Then compare the scan’s estimated rows with actual rows. This controlled single-session experiment has no background autovacuum worker updating the estimate for us.',
        sql: `UPDATE perf_jobs SET state = 'queued'
WHERE job_id BETWEEN 11 AND 5000;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM perf_jobs WHERE state = 'queued';`,
        expected: 'The scan now emits 5,000 rows. Its estimate is still based on the earlier distribution and is far too small; an exact stale estimate is not promised. The query answer remains correct.',
      },
      {
        title: 'Refresh the planner’s information',
        instruction: 'ANALYZE samples the current table. Predict whether updating statistics will also make half the table disappear from the query’s work. Inspect the scan estimate again.',
        sql: `ANALYZE perf_jobs;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM perf_jobs WHERE state = 'queued';`,
        expected: 'Estimated and actual matches are now about 5,000. A sequential scan is still reasonable for this broad count. Better statistics help choose work; they do not remove the requested work.',
      },
      {
        title: 'Prepare a selective lookup',
        instruction: 'Restore ten queued jobs, refresh statistics and index state. Run this preparation once, then load the next step. Keeping the plan inspection in a separate run lets this batch finish and commit before we measure the read. Rerun step 1 to remove the index and restore the original data.',
        sql: `UPDATE perf_jobs SET state = 'done' WHERE job_id > 10;
ANALYZE perf_jobs;
CREATE INDEX perf_jobs_state ON perf_jobs (state);`,
        expected: 'The changes and index creation have completed. Ten jobs are queued again. We have given the planner a new access path, but have not yet inspected the next read.',
      },
      {
        title: 'Inspect the selective read after preparation',
        instruction: 'Predict how the index can locate the ten queued jobs. Run this query separately from the preceding setup. Then change queued to done and rerun it to ask for nearly the whole table. Compare actual rows, buffers and any heap fetches before judging the amount of work.',
        sql: `EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM perf_jobs WHERE state = 'queued';`,
        expected: 'The checked run used an Index Only Scan and returned ten matches, but also reported heap fetches: earlier updates left versions whose visibility still needed checking in the table. “Index only” names a possible access strategy, not a promise of zero table work. The done variation counts 9,990. Plans can vary; inspect the work. Reset and rerun step 1 to start over.',
      },
    ],
  },
  {
    id: 'request-batching',
    title: 'Load an order list without multiplying its work',
    description: 'Replace repeated child lookups, then see why combining two child collections can duplicate rows.',
    articleHref: '/learn/databases/relational/application-sql/',
    steps: [
      {
        title: 'Prepare three orders and their children',
        instruction: 'Run this setup first. These request_ tables are independent of the default shop. Orders 101 and 102 have lines; 103 is empty. Order 101 also has two payments. You are inspecting the SQL an order-list handler could send. Rerun this setup or restart the lesson to undo variations.',
        sql: `DROP TABLE IF EXISTS request_lines, request_payments, request_orders;
CREATE TABLE request_orders (order_id integer PRIMARY KEY, customer_name text NOT NULL);
CREATE TABLE request_lines (order_id integer REFERENCES request_orders, line_no integer, quantity integer NOT NULL, unit_price numeric(10,2) NOT NULL, PRIMARY KEY (order_id, line_no));
CREATE TABLE request_payments (payment_id integer PRIMARY KEY, order_id integer REFERENCES request_orders, amount numeric(10,2) NOT NULL);
INSERT INTO request_orders (order_id, customer_name) VALUES (101, 'Ada'), (102, 'Lin'), (103, 'Sam');
INSERT INTO request_lines (order_id, line_no, quantity, unit_price) VALUES (101, 1, 2, 10), (101, 2, 1, 5), (102, 1, 1, 8);
INSERT INTO request_payments (payment_id, order_id, amount) VALUES (1, 101, 10), (2, 101, 15), (3, 102, 8);
SELECT * FROM request_orders ORDER BY order_id;`,
        expected: 'Three parent orders. Ada has two lines worth 25 and payments totalling 25; Lin has one line and a payment worth 8; Sam has neither.',
      },
      {
        title: 'Collect the children in one batch',
        instruction: 'The application already has the three order IDs. Instead of sending one line query per order, ask for all selected IDs together. Predict the row count, including what happens for the empty order. In application code these IDs would be bound parameters selected from an authorised parent query.',
        sql: `SELECT order_id, line_no, quantity, unit_price
FROM request_lines
WHERE order_id = ANY (ARRAY[101, 102, 103])
ORDER BY order_id, line_no;`,
        expected: 'Three line rows: two for 101 and one for 102. The application groups them by order_id and assigns an empty list to 103. This query does not return an extra placeholder for an empty order.',
      },
      {
        title: 'Try joining both child collections',
        instruction: 'A single query looks attractive. Before running it, pair each of Ada’s two lines with each of her two payments. How many rows will order 101 produce? The left joins retain orders without either child.',
        sql: `SELECT o.order_id, l.line_no, p.payment_id,
       l.quantity * l.unit_price AS line_amount, p.amount AS payment_amount
FROM request_orders AS o
LEFT JOIN request_lines AS l ON l.order_id = o.order_id
LEFT JOIN request_payments AS p ON p.order_id = o.order_id
ORDER BY o.order_id, l.line_no, p.payment_id;`,
        expected: 'Six rows: four for 101, one for 102 and one null-extended row for 103. Summing Ada’s displayed line amounts would give 50, twice her real total of 25. A smaller query count can still create more rows and a wrong total.',
      },
      {
        title: 'Reduce each collection before joining',
        instruction: 'This response needs totals rather than individual children. Each subquery first produces at most one row per order; those results can be joined without multiplying one another. Predict all three totals, then run it.',
        sql: `SELECT o.order_id, coalesce(l.total, 0) AS ordered,
       coalesce(p.total, 0) AS paid
FROM request_orders AS o
LEFT JOIN (
  SELECT order_id, sum(quantity * unit_price) AS total
  FROM request_lines GROUP BY order_id
) AS l ON l.order_id = o.order_id
LEFT JOIN (
  SELECT order_id, sum(amount) AS total
  FROM request_payments GROUP BY order_id
) AS p ON p.order_id = o.order_id
ORDER BY o.order_id;`,
        expected: '101: ordered 25, paid 25; 102: 8 and 8; 103: 0 and 0. COALESCE makes the application’s empty-order convention explicit. This small demonstration aggregates every order; a large application should restrict both aggregates to the selected authorised order IDs.',
      },
      {
        title: 'Add a third payment',
        instruction: 'Run this insert once, then reload and run steps 3 and 4. Predict which quantities change: adding a payment must not alter the amount ordered. Afterwards restart the lesson or rerun step 1 to restore the original payments.',
        sql: `INSERT INTO request_payments (payment_id, order_id, amount)
VALUES (4, 101, 2);
SELECT sum(amount) AS paid FROM request_payments WHERE order_id = 101;`,
        expected: 'Ada has now paid 27. The raw join emits six rows for her, while the preaggregated result still says ordered 25 and now says paid 27. A repeated insert errors because payment_id 4 already exists; reset before repeating this variation.',
      },
    ],
  },
  {
    id: 'report-freshness',
    title: 'A fast report can contain yesterday’s answer',
    description: 'Build daily totals, store them in a materialized view, and follow a late correction through refresh.',
    articleHref: '/learn/databases/relational/aggregates-and-windows/',
    steps: [
      {
        title: 'Prepare a small sales ledger',
        instruction: 'Run this independent setup first. One row records one sale, in euros, with an explicit reporting day. The example uses dates so the time-zone policy is already resolved. Restart the lesson or rerun this setup to remove every change and the stored summary.',
        sql: `DROP MATERIALIZED VIEW IF EXISTS report_daily;
DROP TABLE IF EXISTS report_sales;
CREATE TABLE report_sales (sale_id integer PRIMARY KEY, sold_on date NOT NULL, amount numeric(10,2) NOT NULL);
INSERT INTO report_sales (sale_id, sold_on, amount)
VALUES (1, '2026-10-13', 20), (2, '2026-10-13', 30), (3, '2026-10-14', 8);
SELECT * FROM report_sales ORDER BY sale_id;`,
        expected: 'Three sales. The first day totals 50 and the second totals 8. These are sale amounts, with no taxes, refunds or currencies to reconcile in this bounded example.',
      },
      {
        title: 'Calculate the live totals',
        instruction: 'GROUP BY produces one row per day. Predict each count and amount. This SELECT computes its answer from the visible source rows each time it executes.',
        sql: `SELECT sold_on, count(*) AS sales, sum(amount) AS total
FROM report_sales GROUP BY sold_on ORDER BY sold_on;`,
        expected: '13 October: 2 sales, total 50. 14 October: 1 sale, total 8. Missing days do not automatically appear as zero rows.',
      },
      {
        title: 'Store the result for later readers',
        instruction: 'Run this step once. A PostgreSQL materialized view stores the query result, so subsequent readers can read its two rows without regrouping the ledger. Predict whether its first result differs from the live query.',
        sql: `CREATE MATERIALIZED VIEW report_daily AS
SELECT sold_on, count(*) AS sales, sum(amount) AS total
FROM report_sales GROUP BY sold_on;
SELECT * FROM report_daily ORDER BY sold_on;`,
        expected: 'The same two daily totals are stored. This is a separate stored result; it does not update itself when a sale changes. If the view already exists, restart the lesson before repeating this step.',
      },
      {
        title: 'Correct a sale from an earlier day',
        instruction: 'Sale 2 should have been 35. Change that source record and compare live and stored totals. Predict whether the correction affects 13 or 14 October and whether either sales count should change.',
        sql: `UPDATE report_sales SET amount = 35 WHERE sale_id = 2;
SELECT 'live' AS source, sold_on, count(*) AS sales, sum(amount) AS total
FROM report_sales GROUP BY sold_on
UNION ALL
SELECT 'stored', sold_on, sales, total FROM report_daily
ORDER BY sold_on, source;`,
        expected: '13 October is 55 live but still 50 stored; both counts remain 2. 14 October remains 8 in both. Refreshing only today’s bucket would miss this historical correction.',
      },
      {
        title: 'Refresh and explore another correction',
        instruction: 'Refresh reruns the defining query and replaces the stored result. Verify agreement. Then edit step 4 to set sale 2 to 40, predict the difference and refresh again. Rerun step 1 to restore the original ledger and remove the summary.',
        sql: `REFRESH MATERIALIZED VIEW report_daily;
SELECT * FROM report_daily ORDER BY sold_on;`,
        expected: '13 October now totals 55 and 14 October totals 8. After the editable variation and another refresh, 13 October totals 60. PostgreSQL’s ordinary refresh still reads the source; this exercise establishes freshness behaviour, not a measured speed improvement.',
      },
    ],
  },
];
