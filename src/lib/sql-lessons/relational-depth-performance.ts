import type { Tutorial } from '../sql-sandbox-tutorials';

const report = (condition: string) => `SELECT l.product_id, sum(l.quantity) AS units
FROM depth_plan_orders AS o
JOIN depth_plan_lines AS l ON l.order_id = o.order_id
WHERE ${condition}
GROUP BY l.product_id
ORDER BY units DESC, l.product_id`;
const inspect = (query: string) => `EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)\n${query};\n\n${query};`;

export const relationalDepthPerformanceTutorials: Tutorial[] = [
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
