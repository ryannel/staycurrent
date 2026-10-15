import type { Tutorial } from '../sql-sandbox-tutorials';

const history = (status?: string) => `SELECT order_id, placed_at, total
FROM depth_index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'${status ? `\n  AND status = '${status}'` : ''}
ORDER BY placed_at DESC, order_id DESC
LIMIT 10`;
const report = (condition: string) => `SELECT l.product_id, sum(l.quantity) AS units
FROM depth_plan_orders AS o
JOIN depth_plan_lines AS l ON l.order_id = o.order_id
WHERE ${condition}
GROUP BY l.product_id
ORDER BY units DESC, l.product_id`;
const inspect = (query: string) => `EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)\n${query};\n\n${query};`;

export const relationalDepthPerformanceTutorials: Tutorial[] = [
  {
    id: 'index-order',
    title: 'Put the next ten orders in index order',
    description: 'Keep the returned orders fixed while an index removes filtering and sorting work, then follow a remaining status filter.',
    articleHref: '/learn/databases/relational/indexes/',
    steps: [
      {
        title: 'Establish the answer before changing access',
        instruction: 'This independent fixture reproduces the index article’s 60,000 orders and customer 42. Each order has a different timestamp. Run the steps in order; restarting the lesson or rerunning this setup restores the beginning. First count the customer’s orders and February candidates, then keep the ten returned IDs for comparison.',
        sql: `DROP TABLE IF EXISTS depth_index_orders;
SET TIME ZONE 'UTC';
CREATE TABLE depth_index_orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL,
  placed_at timestamptz NOT NULL,
  status text NOT NULL,
  total numeric(10,2) NOT NULL,
  note text NOT NULL
);
INSERT INTO depth_index_orders
  (order_id, customer_id, placed_at, status, total, note)
SELECT n, 1 + n % 1000,
       timestamptz '2026-01-01 00:00:00+00' + n * interval '1 minute',
       CASE WHEN (n / 1000) % 5 = 0 THEN 'pending' ELSE 'paid' END,
       (1000 + n % 9000)::numeric / 100,
       repeat('delivery note ', 12)
FROM generate_series(1, 60000) AS series(n);
ANALYZE depth_index_orders;
SELECT count(*) AS customer_orders,
       count(*) FILTER (WHERE placed_at >= timestamptz '2026-02-01 00:00:00+00') AS february_orders
FROM depth_index_orders WHERE customer_id = 42;
${history()};`,
        expected: 'Customer 42 has 60 orders, with 15 on or after February 1. The newest ten IDs are 59041, 58041, …, 50041. The primary key alone does not put this customer’s history in the requested time order.',
      },
      {
        title: 'Find the customer, then filter and sort',
        instruction: 'Add an index on the customer only. Read the executed plan from its scan upward: identify how many customer candidates it finds, how many the date removes and whether a Sort supplies the requested order. The SELECT after EXPLAIN checks the actual answer. Plan shapes and timings can vary; compare work and IDs rather than declaring a speed ratio.',
        sql: `CREATE INDEX depth_index_customer ON depth_index_orders (customer_id);
ANALYZE depth_index_orders;
${inspect(history())}`,
        expected: 'The observed plans find 60 customer candidates, remove 45 before February and sort the remaining 15 to return ten. The IDs are unchanged. LIMIT does not let this customer-only index know which ten dates are newest.',
      },
      {
        title: 'Supply the range and order together',
        instruction: 'Replace the customer-only index with customer, descending time and descending ID. Customer equality selects one part of the B-tree; the date bounds that part, and its order already matches the request. Look for the date in Index Cond and the absence of a separate Sort. The ID is the explicit tie-breaker even though this generated fixture has no tied timestamps.',
        sql: `DROP INDEX depth_index_customer;
CREATE INDEX depth_index_history ON depth_index_orders
  (customer_id, placed_at DESC, order_id DESC);
ANALYZE depth_index_orders;
${inspect(history())}`,
        expected: 'The observed Index Scan returns ten rows directly to Limit, with no Sort or date filter discards. It can stop before consuming all 15 qualifying entries. The ten IDs and amounts still match step 1. This index does not contain total, so it still needs table rows.',
      },
      {
        title: 'Find ten paid orders, not ten candidates',
        instruction: 'Now the request adds status = paid. Before running, predict whether Limit can stop after examining ten index entries. The index still supplies customer, date and order, but status must be checked from each candidate row. Compare the new answer with the earlier unfiltered history.',
        sql: inspect(history('paid')),
        expected: 'The observed scan emits ten paid rows and removes two pending candidates: it examines 12 candidates before Limit is satisfied. IDs 55041 and 50041 disappear, and 49041 and 48041 enter the answer. Returning ten rows does not imply examining only ten.',
      },
      {
        title: 'Put status inside the bounded part of the index',
        instruction: 'Replace the index again, now with equality on customer and status before the time range. Keep exactly the paid query from step 4. Check both Index Cond and the returned IDs. This is a different access design for this request; every extra index retained in a real service also costs space and write maintenance.',
        sql: `DROP INDEX depth_index_history;
CREATE INDEX depth_index_paid_history ON depth_index_orders
  (customer_id, status, placed_at DESC, order_id DESC);
ANALYZE depth_index_orders;
${inspect(history('paid'))}`,
        expected: 'The observed scan returns the same ten paid IDs with no pending rows removed: all three conditions bound the index scan. Status can help here because the request fixes one status. Without that equality, grouping entries by status would not directly provide one combined time order.',
      },
      {
        title: 'Predict a request with fewer than ten matches',
        instruction: 'Change the status to pending while keeping the customer, date and limit. Predict the IDs and count before running. Then try removing the status condition from this query: inspect whether the planner needs to sort to restore a combined history. Restart the lesson to compare the original customer/time index again.',
        sql: inspect(history('pending')),
        expected: 'Only three pending orders meet the date boundary: 55041, 50041 and 45041. LIMIT 10 is an upper bound, not a promise of ten matches. In the observed plan, PostgreSQL chooses a bitmap scan and sorts these three matches, even though an ordered index path is available. Removing status changes which index order is useful even though the table is unchanged.',
      },
    ],
  },
  {
    id: 'join-work',
    title: 'Follow the work behind a joined report',
    description: 'Compare repeated index probes, a broad hash join and an ordered merge while checking the report’s actual totals.',
    articleHref: '/learn/databases/relational/query-execution/',
    steps: [
      {
        title: 'Build the report’s orders and lines',
        instruction: 'This independent fixture reproduces the query-execution article’s generated shop. Each of 1,000 customers has ten orders. Each order has three lines: product 1 with quantity 1, product 2 with quantity 2 and product 3 with quantity 3. The tables are separate from the sandbox’s small receipt dataset. Restart or rerun setup to restore them.',
        sql: `DROP TABLE IF EXISTS depth_plan_lines;
DROP TABLE IF EXISTS depth_plan_orders;
CREATE TABLE depth_plan_orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL,
  sales_region text NOT NULL
);
CREATE TABLE depth_plan_lines (
  order_id integer NOT NULL REFERENCES depth_plan_orders,
  line_no integer NOT NULL,
  product_id integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, line_no)
);
INSERT INTO depth_plan_orders (order_id, customer_id, sales_region)
SELECT n, (n - 1) % 1000 + 1,
       CASE WHEN (n - 1) % 1000 + 1 <= 100 THEN 'north' ELSE 'south' END
FROM generate_series(1, 10000) AS g(n);
INSERT INTO depth_plan_lines (order_id, line_no, product_id, quantity)
SELECT n, line, line, line
FROM generate_series(1, 10000) AS g(n)
CROSS JOIN generate_series(1, 3) AS l(line)
ORDER BY n, line;
CREATE INDEX depth_plan_customer ON depth_plan_orders (customer_id);
ANALYZE depth_plan_orders;
ANALYZE depth_plan_lines;
SELECT (SELECT count(*) FROM depth_plan_orders) AS orders,
       (SELECT count(*) FROM depth_plan_lines) AS lines;
SELECT order_id FROM depth_plan_orders WHERE customer_id = 42 ORDER BY order_id;`,
        expected: 'There are 10,000 orders and 30,000 lines. Customer 42 owns orders 42, 1042, …, 9042. Predict totals of 30 units for product 3, 20 for product 2 and 10 for product 1 before reading their plan.',
      },
      {
        title: 'Probe three lines for each of ten orders',
        instruction: 'Run the report for customer 42. Find the join and its inner line scan. EXPLAIN reports rows per execution; multiply that node’s actual rows by loops to understand its repeated work. Then distinguish the 30 joined line rows from the three grouped product results.',
        sql: inspect(report('o.customer_id = 42')),
        expected: 'The observed Nested Loop takes ten orders and probes the line primary key ten times. The inner scan has actual rows=3 loops=10, giving 30 line rows. Aggregation returns the predicted product totals 30, 20 and 10. Three output groups do not mean only three source rows were read.',
      },
      {
        title: 'Broaden the report to every customer',
        instruction: 'Change only the customer condition. All 1,000 customers now qualify, so the correct totals must also change. Find which input the Hash node builds and which input probes it. Compare that one build and broad scan with thousands of individual index probes; neither join name is a universal winner.',
        sql: inspect(report('o.customer_id <= 1000')),
        expected: 'The observed Hash Join builds from 10,000 orders and scans 30,000 lines, producing 30,000 joined rows and three final groups. Totals are 30,000, 20,000 and 10,000 for products 3, 2 and 1. This is a larger request, so its totals are 1,000 times the narrow report’s totals.',
      },
      {
        title: 'Compare another method for the same broad answer',
        instruction: 'Keep the broad query unchanged. For this one transaction, discourage hash joins and nested loops so PostgreSQL demonstrates a merge join. Follow the ordered inputs: a primary-key scan can supply order without a separate Sort. These settings are an experiment, not a tuning recommendation. ROLLBACK restores them; if edited SQL fails before it, run ROLLBACK before continuing.',
        sql: `BEGIN;
SET LOCAL enable_hashjoin = off;
SET LOCAL enable_nestloop = off;
${inspect(report('o.customer_id <= 1000'))}
ROLLBACK;`,
        expected: 'The observed Merge Join consumes orders and lines in order_id order and returns the same broad totals as step 3. The final result order still requires the report’s ORDER BY. Different work can implement the same SQL answer; compare buffers and input work, not these small browser timings as a production benchmark.',
      },
      {
        title: 'Predict an intermediate request',
        instruction: 'The previous transaction has ended, so normal planner choices apply again. Ask for the first 100 customers. Predict source counts and result totals first, then inspect the selected join. Its choice may differ across versions, statistics and settings; the answer follows the records, not the join method.',
        sql: `SHOW enable_hashjoin;
SHOW enable_nestloop;
${inspect(report('o.customer_id <= 100'))}`,
        expected: 'Both settings are on again. The join processes 1,000 orders and 3,000 matching lines; product totals are 3,000, 2,000 and 1,000. A broad line scan may still examine all 30,000 lines to find those matches. Separate the rows a node examines from those it emits to its parent.',
      },
    ],
  },
];
