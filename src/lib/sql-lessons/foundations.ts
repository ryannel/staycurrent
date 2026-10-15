import type { Tutorial } from '../sql-sandbox-tutorials';

/** Small, disposable examples. Each lesson owns its tables and establishes its state. */
export const foundationsTutorials: Tutorial[] = [
  {
    id: 'history',
    title: 'Keep the price a customer agreed to',
    description: 'Change a catalogue price, compare two receipts, and decide which facts belong to a purchase.',
    articleHref: '/learn/databases/relational/modelling/#history',
    steps: [
      {
        title: 'Create a product and its purchase',
        instruction: 'You are using one query editor. These statements create separate practice tables: a mug currently costs €20, but order O12 bought two at €18. Run this setup first. To repeat the lesson, reset the database and run this step again.',
        sql: `DROP TABLE IF EXISTS lesson_history_lines, lesson_history_products;
CREATE TABLE lesson_history_products (
  product_id text PRIMARY KEY,
  name text NOT NULL,
  current_price numeric(12,2) NOT NULL CHECK (current_price >= 0)
);
CREATE TABLE lesson_history_lines (
  order_id text NOT NULL,
  line_no integer NOT NULL,
  product_id text NOT NULL REFERENCES lesson_history_products,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, line_no)
);
INSERT INTO lesson_history_products (product_id, name, current_price)
VALUES ('P7', 'Blue mug', 20);
INSERT INTO lesson_history_lines (order_id, line_no, product_id, quantity, unit_price)
VALUES ('O12', 1, 'P7', 2, 18);
SELECT * FROM lesson_history_lines;`,
        expected: 'O12 contains two P7 mugs at €18 each. The foreign key proves that P7 exists; it does not make the agreed price follow the catalogue.',
      },
      {
        title: 'Compare the two meanings of price',
        instruction: 'Before running this query, calculate what each multiplication will produce. Both price calculations are valid SQL. Which amount belongs on the old receipt?',
        sql: `SELECT l.order_id, p.name,
  l.quantity * l.unit_price AS agreed_total,
  l.quantity * p.current_price AS priced_today
FROM lesson_history_lines AS l
JOIN lesson_history_products AS p USING (product_id);`,
        expected: 'The agreed total is €36; pricing the same quantity today gives €40. A correct join can answer the wrong business question when it selects the wrong fact.',
      },
      {
        title: 'Change today’s offer',
        instruction: 'The catalogue editor raises the mug to €25 and changes its name. Predict which values on our joined receipt change. The update is committed when this run finishes because no explicit transaction is open.',
        sql: `UPDATE lesson_history_products
SET current_price = 25, name = 'Ocean mug'
WHERE product_id = 'P7';
SELECT l.order_id, p.name, l.unit_price,
  l.quantity * l.unit_price AS agreed_total,
  l.quantity * p.current_price AS priced_today
FROM lesson_history_lines AS l
JOIN lesson_history_products AS p USING (product_id);`,
        expected: 'The name becomes Ocean mug and today’s total becomes €50. The purchase remains two at €18, totalling €36. We preserved the purchased price, but chose to display the current product name. Reproducing an original printed name would require retaining that fact too.',
      },
      {
        title: 'Try another purchase',
        instruction: 'Add O13 at today’s €25 offer. Predict both totals, then run the query. Afterwards, change the catalogue price again and repeat the SELECT: both purchases should retain their own agreements. Reset and rerun step 1 to return to the original example.',
        sql: `INSERT INTO lesson_history_lines (order_id, line_no, product_id, quantity, unit_price)
VALUES ('O13', 1, 'P7', 1, 25);
SELECT l.order_id, l.quantity, l.unit_price,
  l.quantity * l.unit_price AS agreed_total, p.current_price
FROM lesson_history_lines AS l
JOIN lesson_history_products AS p USING (product_id)
ORDER BY l.order_id;`,
        expected: 'O12 totals €36 and O13 totals €25, although both reference the same product and see its current price of €25. The prices belong to different events. Storing them does not prevent a later writer from editing history; permissions and correction procedures must govern that separately.',
      },
    ],
  },
  {
    id: 'json-rules',
    title: 'Give a JSON field a dependable meaning',
    description: 'Distinguish missing values from strings and numbers, then move a required capacity into a typed record.',
    articleHref: '/learn/databases/relational/tables-and-documents/#queries-and-rules',
    steps: [
      {
        title: 'Inspect four representations',
        instruction: 'Run the setup first. Four objects represent a missing capacity, JSON null, the number 350 and the string “350”. Predict which rows have the key and which text values will look alike. Reset and rerun this step to start over.',
        sql: `DROP TABLE IF EXISTS lesson_json_details, lesson_json_products;
CREATE TABLE lesson_json_products (
  product_id text PRIMARY KEY,
  attributes jsonb NOT NULL CHECK (jsonb_typeof(attributes) = 'object')
);
INSERT INTO lesson_json_products (product_id, attributes) VALUES
  ('missing', '{}'), ('null', '{"capacity_ml":null}'),
  ('number', '{"capacity_ml":350}'), ('string', '{"capacity_ml":"350"}');
SELECT product_id, attributes ? 'capacity_ml' AS has_key,
  jsonb_typeof(attributes -> 'capacity_ml') AS json_type,
  attributes ->> 'capacity_ml' AS text_value
FROM lesson_json_products ORDER BY product_id;`,
        expected: 'Missing has no key and gives SQL NULL for type and text. JSON null has a key and type “null”, but its text extraction is SQL NULL. Number and string both extract text “350”; their JSON types differ. The object check accepted all four.',
      },
      {
        title: 'Test the conversion policy before storing',
        instruction: 'A mug-details record will require a positive whole capacity that fits an integer. CASE checks type before conversion, then checks range and whole-number value. Predict the only row that will produce an integer. Rejected inputs deliberately produce SQL NULL here so we can inspect the policy before enforcing it.',
        sql: `SELECT product_id,
  CASE WHEN jsonb_typeof(attributes -> 'capacity_ml') = 'number' THEN
    CASE WHEN (attributes ->> 'capacity_ml')::numeric BETWEEN 1 AND 2147483647
      AND (attributes ->> 'capacity_ml')::numeric = trunc((attributes ->> 'capacity_ml')::numeric)
    THEN (attributes ->> 'capacity_ml')::numeric::integer END
  END AS accepted_capacity
FROM lesson_json_products ORDER BY product_id;`,
        expected: 'Only number produces 350. A numeric string is still a string under this policy. Try changing the number object to 350.5, 0 or 2147483648 and rerun the SELECT: each should produce NULL. Restore 350 before continuing, or reset and repeat the first two steps.',
      },
      {
        title: 'Move the accepted fact together',
        instruction: 'You send these statements on the same connection. The transaction inserts the validated number into a required integer column and removes the JSON copy. If the input fails validation, stop and send ROLLBACK instead of continuing; restore a valid 350 in the previous step and retry. Predict where capacity remains after a successful commit.',
        sql: `BEGIN;
CREATE TABLE lesson_json_details (
  product_id text PRIMARY KEY REFERENCES lesson_json_products,
  capacity_ml integer NOT NULL CHECK (capacity_ml > 0)
);
INSERT INTO lesson_json_details (product_id, capacity_ml)
SELECT product_id,
  CASE WHEN jsonb_typeof(attributes -> 'capacity_ml') = 'number' THEN
    CASE WHEN (attributes ->> 'capacity_ml')::numeric BETWEEN 1 AND 2147483647
      AND (attributes ->> 'capacity_ml')::numeric = trunc((attributes ->> 'capacity_ml')::numeric)
    THEN (attributes ->> 'capacity_ml')::numeric::integer END
  END
FROM lesson_json_products WHERE product_id = 'number';
UPDATE lesson_json_products SET attributes = attributes - 'capacity_ml'
WHERE product_id = 'number';
COMMIT;
SELECT p.product_id, p.attributes, d.capacity_ml
FROM lesson_json_products AS p JOIN lesson_json_details AS d USING (product_id);`,
        expected: 'The number product now has an empty attributes object and a details row holding integer 350. The other sample objects are unchanged. The required value is now in one authoritative place; this schema does not require every product to have a details row.',
      },
      {
        title: 'Reject an invalid stored capacity',
        instruction: 'Predict whether zero will be stored. Run this statement by itself: it is outside an explicit transaction, so a rejected statement will not leave the session in a failed transaction.',
        sql: `UPDATE lesson_json_details SET capacity_ml = 0 WHERE product_id = 'number';`,
        expected: 'PostgreSQL rejects the update with a check-constraint violation (23514). The accepted 350 remains stored.',
        expectedError: '23514',
      },
      {
        title: 'Read and vary the valid record',
        instruction: 'Verify the rejected write left 350 in place. Then try a positive integer such as 400 and rerun the query. The column protects the stored integer; the application must still reject fractions before converting them, since a value rounded before insertion cannot be recognised as a fraction afterwards. Reset and run step 1 to repeat the JSON conversion.',
        sql: `SELECT product_id, capacity_ml FROM lesson_json_details WHERE capacity_ml >= 300;`,
        expected: 'The query returns number with capacity 350. Every stored capacity in this table is an integer that this comparison can use; there is no text-to-integer conversion during the read.',
      },
    ],
  },
  {
    id: 'join-totals',
    title: 'Find why a join doubled the total',
    description: 'Follow the rows through a join, repair an inflated aggregate, and retain an order with no lines.',
    articleHref: '/learn/databases/relational/query-results/#multiplied-rows',
    steps: [
      {
        title: 'Create orders, lines and deliveries',
        instruction: 'Run this setup first. Order 1 has two lines worth €20 and €24 and two deliveries. Order 2 is empty. Before joining anything, predict each order’s line total. Reset and rerun this step to restore these records.',
        sql: `DROP TABLE IF EXISTS lesson_join_deliveries, lesson_join_lines, lesson_join_orders;
CREATE TABLE lesson_join_orders (order_id integer PRIMARY KEY);
CREATE TABLE lesson_join_lines (
  order_id integer REFERENCES lesson_join_orders,
  line_no integer, amount numeric(12,2) NOT NULL,
  PRIMARY KEY (order_id, line_no)
);
CREATE TABLE lesson_join_deliveries (
  delivery_id integer PRIMARY KEY, order_id integer REFERENCES lesson_join_orders
);
INSERT INTO lesson_join_orders (order_id) VALUES (1), (2);
INSERT INTO lesson_join_lines (order_id, line_no, amount) VALUES (1,1,20), (1,2,24);
INSERT INTO lesson_join_deliveries (delivery_id, order_id) VALUES (101,1), (102,1);
SELECT * FROM lesson_join_lines ORDER BY order_id, line_no;`,
        expected: 'Order 1 has €44 of lines. Order 2 has no line rows. Each delivery belongs to an order; the schema does not assign individual lines to deliveries.',
      },
      {
        title: 'Count the combinations',
        instruction: 'Each line will match both deliveries through order_id. Predict the number of result rows before running the query. Read line_no and delivery_id together to see why each combination exists.',
        sql: `SELECT l.line_no, l.amount, d.delivery_id
FROM lesson_join_lines AS l
JOIN lesson_join_deliveries AS d USING (order_id)
WHERE l.order_id = 1
ORDER BY l.line_no, d.delivery_id;`,
        expected: 'Four rows: line 1 with deliveries 101 and 102, then line 2 with each delivery. This is the requested set of matches, but it repeats each amount twice.',
      },
      {
        title: 'Observe the wrong total',
        instruction: 'Predict SUM over those four rows. This asks a different question from summing the original lines, even though every join condition uses the right order ID.',
        sql: `SELECT l.order_id, sum(l.amount) AS inflated_total
FROM lesson_join_lines AS l
JOIN lesson_join_deliveries AS d USING (order_id)
GROUP BY l.order_id;`,
        expected: 'Order 1 now totals €88. Order 2 disappears because it has no lines or deliveries. SUM does not know that repeated amounts came from the same purchase line.',
      },
      {
        title: 'Aggregate each set at the order level',
        instruction: 'The two WITH queries each produce at most one row per order. LEFT JOIN then keeps every order. Predict the totals and delivery counts for orders 1 and 2; COALESCE gives zero where a missing aggregate has no value.',
        sql: `WITH totals AS (
  SELECT order_id, sum(amount) AS total FROM lesson_join_lines GROUP BY order_id
), deliveries AS (
  SELECT order_id, count(*) AS delivery_count FROM lesson_join_deliveries GROUP BY order_id
)
SELECT o.order_id, coalesce(t.total, 0) AS total,
  coalesce(d.delivery_count, 0) AS delivery_count
FROM lesson_join_orders AS o
LEFT JOIN totals AS t USING (order_id)
LEFT JOIN deliveries AS d USING (order_id)
ORDER BY o.order_id;`,
        expected: 'Order 1 totals €44 with two deliveries. Order 2 totals €0 with zero deliveries. Each join now has at most one matching row per order, so it cannot multiply an already-computed total.',
      },
      {
        title: 'Why DISTINCT is not the repair',
        instruction: 'Change the second line to €20, making two legitimate lines with equal amounts. Predict the correct total and SUM(DISTINCT amount). Then load and rerun the previous step: the corrected query should still work. Reset and rerun step 1 when finished.',
        sql: `UPDATE lesson_join_lines SET amount = 20 WHERE order_id = 1 AND line_no = 2;
SELECT sum(amount) AS correct_total, sum(DISTINCT amount) AS distinct_amounts
FROM lesson_join_lines WHERE order_id = 1;`,
        expected: 'The correct total is €40; DISTINCT amounts totals only €20. Equal values can belong to different real lines. Repair the level at which rows are combined, rather than removing equal amounts.',
      },
    ],
  },
  {
    id: 'pagination',
    title: 'Continue a list while new orders arrive',
    description: 'Compare an offset with a saved ordering key, then test what a changed ordering value can still break.',
    articleHref: '/learn/databases/relational/large-results/',
    steps: [
      {
        title: 'Create an ordered history',
        instruction: 'Run this setup first. Five orders have increasing timestamps; we will display newest first, two at a time. The ID breaks timestamp ties. Reset and rerun this step to recover the original history.',
        sql: `DROP TABLE IF EXISTS lesson_page_orders;
CREATE TABLE lesson_page_orders (order_id integer PRIMARY KEY, placed_at timestamptz NOT NULL);
INSERT INTO lesson_page_orders (order_id, placed_at) VALUES
  (1, '2026-10-15 10:01+00'), (2, '2026-10-15 10:02+00'),
  (3, '2026-10-15 10:03+00'), (4, '2026-10-15 10:04+00'),
  (5, '2026-10-15 10:05+00');
SELECT order_id, placed_at FROM lesson_page_orders
ORDER BY placed_at DESC, order_id DESC LIMIT 2;`,
        expected: 'Page 1 contains orders 5 and 4. Save the final row’s pair: timestamp 10:04 UTC and order_id 4. That pair will be the continuation boundary.',
      },
      {
        title: 'Add a new first row, then skip two',
        instruction: 'Between page requests, a new order arrives at 10:06. This single connection commits the insert before the next read; it reproduces the changed data, not concurrent sessions. Predict what OFFSET 2 skips in the new ordering.',
        sql: `INSERT INTO lesson_page_orders (order_id, placed_at) VALUES (6, '2026-10-15 10:06+00');
SELECT order_id, placed_at FROM lesson_page_orders
ORDER BY placed_at DESC, order_id DESC LIMIT 2 OFFSET 2;`,
        expected: 'The query skips 6 and 5, then returns 4 and 3. Order 4 appeared on page 1 already. The offset counts positions in the current result, not records you previously saw.',
      },
      {
        title: 'Continue after the saved pair',
        instruction: 'Now use page 1’s saved timestamp and ID. With descending order, the next rows have a smaller pair. Predict whether the new order 6 will move this boundary.',
        sql: `SELECT order_id, placed_at FROM lesson_page_orders
WHERE (placed_at, order_id) < ('2026-10-15 10:04+00'::timestamptz, 4)
ORDER BY placed_at DESC, order_id DESC LIMIT 2;`,
        expected: 'Orders 3 and 2 follow the saved boundary. The newly inserted order is above it, so it does not cause order 4 to repeat. A new visit to the first page would include order 6.',
      },
      {
        title: 'Test a record that crosses the boundary',
        instruction: 'Suppose order 1’s timestamp is corrected to 10:07 before we reach it. Predict whether continuing after the same saved pair will include order 1. This deliberately changes an ordering value; it tests a limit of the technique.',
        sql: `UPDATE lesson_page_orders SET placed_at = '2026-10-15 10:07+00' WHERE order_id = 1;
SELECT order_id, placed_at FROM lesson_page_orders
WHERE (placed_at, order_id) < ('2026-10-15 10:04+00'::timestamptz, 4)
ORDER BY placed_at DESC, order_id DESC LIMIT 2;`,
        expected: 'The continuation still returns 3 and 2, and later pages below that boundary will never reach order 1. A saved key is not a fixed snapshot. For a variation, give orders 2 and 3 the same timestamp and keep the ID in both ordering and boundary. Reset and rerun step 1 to start again.',
      },
    ],
  },
  {
    id: 'index-selectivity',
    title: 'Test which reads benefit from an index',
    description: 'Compare a selective customer lookup with a broad report over the same 20,000 orders.',
    articleHref: '/learn/databases/relational/indexes/#check',
    steps: [
      {
        title: 'Create a repeatable workload',
        instruction: 'Run this setup first. generate_series supplies IDs 1 to 20,000. The remainder operator % distributes orders evenly among 1,000 customer IDs, so each has 20 orders. ANALYZE gives the planner statistics. These browser plans teach work and choices, not production timings. Reset and rerun this step to start over.',
        sql: `DROP TABLE IF EXISTS lesson_index_orders;
CREATE TABLE lesson_index_orders (
  order_id integer PRIMARY KEY, customer_id integer NOT NULL,
  total numeric(12,2) NOT NULL, note text NOT NULL
);
INSERT INTO lesson_index_orders (order_id, customer_id, total, note)
SELECT n, n % 1000, 20 + n % 80, repeat('order detail ', 8)
FROM generate_series(1, 20000) AS n;
ANALYZE lesson_index_orders;
SELECT count(*) AS orders, count(DISTINCT customer_id) AS customers FROM lesson_index_orders;`,
        expected: 'There are 20,000 orders and 1,000 customer IDs. The primary-key index can locate an order_id, but there is no index ordered by customer_id yet.',
      },
      {
        title: 'Read the plan before adding an index',
        instruction: 'EXPLAIN ANALYZE executes this read and shows its plan. Predict how many rows match customer 42 and how many do not. Look for the scan’s actual rows and Rows Removed by Filter. TIMING OFF keeps per-node timing noise out of the example.',
        sql: `EXPLAIN (ANALYZE, TIMING OFF)
SELECT order_id, total FROM lesson_index_orders WHERE customer_id = 42;`,
        expected: 'Expect 20 matching rows and a sequential scan that removes 19,980 others by filtering. “rows” before the actual section is an estimate; “actual rows” records execution. Plan wording and costs can vary with engine settings.',
      },
      {
        title: 'Offer a customer index',
        instruction: 'Create the index, then run the same read. Predict whether the result changes and which work can now be avoided. The index stores customer values with row references; total still comes from the table.',
        sql: `CREATE INDEX lesson_index_customer ON lesson_index_orders (customer_id);
EXPLAIN (ANALYZE, TIMING OFF)
SELECT order_id, total FROM lesson_index_orders WHERE customer_id = 42;`,
        expected: 'The result remains 20 rows. The checked run used a bitmap index scan followed by a bitmap heap scan: the index finds matching locations and the heap scan reads their records. An ordinary index scan is also possible. An available index is a choice the planner evaluates.',
      },
      {
        title: 'Ask for almost everyone',
        instruction: 'The index stays in place, but this report matches customer IDs 0 through 899. Predict the number of rows and whether a scan of the table might now make sense. Compare the plan with the previous lookup.',
        sql: `EXPLAIN (ANALYZE, TIMING OFF)
SELECT order_id, total FROM lesson_index_orders WHERE customer_id < 900;`,
        expected: '18,000 rows match. The checked run chose a sequential scan: finding almost the whole table through an index would add work without avoiding many records. Try cutoffs of 10, 100 and 500 and inspect the chosen plans; there is no universal percentage where a plan must change.',
      },
      {
        title: 'Keep the index current',
        instruction: 'Move one order out of customer 42, then count that customer’s orders. Predict the answer. PostgreSQL must maintain the index as its indexed value changes; observing a correct answer does not measure that maintenance cost. Reset and rerun step 1 to compare from the original state.',
        sql: `UPDATE lesson_index_orders SET customer_id = 999 WHERE order_id = 42;
SELECT count(*) AS customer_42_orders FROM lesson_index_orders WHERE customer_id = 42;`,
        expected: 'Customer 42 now has 19 orders. The access path remains correct after the write. Deciding whether to keep an index also requires the real workload’s write rate, storage and measured latency, which this short browser exercise does not establish.',
      },
    ],
  },
  {
    id: 'query-plans',
    title: 'Follow rows through an execution plan',
    description: 'Read filtering, grouping and sorting as connected operations, then compare estimates with execution.',
    articleHref: '/learn/databases/relational/query-execution/#reading-a-plan',
    steps: [
      {
        title: 'Create a report with a known answer',
        instruction: 'Run this setup first. There are 1,000 sales, with IDs distributed across ten customers; each sale is €10. Predict each customer’s total before examining a plan. Reset and run this step again to restore the data.',
        sql: `DROP TABLE IF EXISTS lesson_plan_sales;
CREATE TABLE lesson_plan_sales (sale_id integer PRIMARY KEY, customer_id integer NOT NULL, amount integer NOT NULL);
INSERT INTO lesson_plan_sales (sale_id, customer_id, amount)
SELECT n, n % 10, 10 FROM generate_series(1,1000) AS n;
ANALYZE lesson_plan_sales;
SELECT customer_id, sum(amount) AS total FROM lesson_plan_sales
WHERE customer_id < 3 GROUP BY customer_id ORDER BY total DESC, customer_id;`,
        expected: 'Customers 0, 1 and 2 each total 1,000. The filter keeps 300 sales; grouping reduces them to three customer rows. Sorting orders those three rows, using customer_id to settle the equal totals.',
      },
      {
        title: 'Read the estimated operations',
        instruction: 'EXPLAIN without ANALYZE plans the query without executing its SELECT. Read the indented input nodes before their parents. Use the first step’s result to predict how many rows reach grouping and sorting, then compare your predictions with the estimates. Costs are planner units, not milliseconds.',
        sql: `EXPLAIN
SELECT customer_id, sum(amount) AS total FROM lesson_plan_sales
WHERE customer_id < 3 GROUP BY customer_id ORDER BY total DESC, customer_id;`,
        expected: 'The checked plan scans and filters the table, groups the qualifying sales with HashAggregate, then sorts grouped totals. It estimates 300 scan output rows but can overestimate the number of groups. An estimate of an output is not a count of every row examined.',
      },
      {
        title: 'Compare actual rows with estimates',
        instruction: 'Now execute the same SELECT through EXPLAIN ANALYZE. Find 300 output rows from the scan, 700 rows removed, and three from the aggregate. Read the estimate and actual values separately; an inaccurate group estimate does not mean the returned sum is inaccurate.',
        sql: `EXPLAIN (ANALYZE, TIMING OFF)
SELECT customer_id, sum(amount) AS total FROM lesson_plan_sales
WHERE customer_id < 3 GROUP BY customer_id ORDER BY total DESC, customer_id;`,
        expected: 'The scan examines 1,000 sales to return 300. The aggregate returns three groups; the sort returns those three in order. These nodes have one loop here. In a plan with repeated loops, actual rows is reported per loop and must be interpreted with loops.',
      },
      {
        title: 'Change the amount of work',
        instruction: 'Remove the filter and predict which node’s row count will grow from 300 to 1,000, and which will grow from three to ten. Run this plan, then try customer_id = 2 as a variation. Explain the work from row counts before comparing any elapsed times.',
        sql: `EXPLAIN (ANALYZE, TIMING OFF)
SELECT customer_id, sum(amount) AS total FROM lesson_plan_sales
GROUP BY customer_id ORDER BY total DESC, customer_id;`,
        expected: 'The scan now returns all 1,000 sales; the aggregate and sort return ten groups. A report can return only ten rows while doing work on 1,000. Plans can change when the query or data changes. Reset and rerun step 1 to repeat this example.',
      },
    ],
  },
  {
    id: 'transaction-state',
    title: 'Read your changes before deciding to commit',
    description: 'See your own updates in a Repeatable Read transaction, roll them back, then commit a separate change.',
    articleHref: '/learn/databases/relational/isolation/#statement-and-transaction',
    steps: [
      {
        title: 'Create one committed price',
        instruction: 'Run this setup first. You send every step on the sandbox’s one connection, and a transaction remains open between runs until you end it. The initial €20 price is committed. This lesson cannot show another session’s snapshot or a server crash. Reset and rerun this step to start again.',
        sql: `DROP TABLE IF EXISTS lesson_tx_prices;
CREATE TABLE lesson_tx_prices (product_id text PRIMARY KEY, price integer NOT NULL CHECK (price > 0));
INSERT INTO lesson_tx_prices (product_id, price) VALUES ('P7',20);
SELECT * FROM lesson_tx_prices;`,
        expected: 'P7 costs 20. There is no explicit transaction open after this run.',
      },
      {
        title: 'Establish a transaction view',
        instruction: 'Start a Repeatable Read transaction and read P7. Predict the price. The isolation level controls the transaction’s view of other transactions; we will first test what happens to its own writes.',
        sql: `BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT price FROM lesson_tx_prices WHERE product_id = 'P7';`,
        expected: 'The read returns 20. The transaction is still open. Loading another lesson step changes the editor without ending this transaction.',
      },
      {
        title: 'Read your own update',
        instruction: 'Change P7 to 25 within the open transaction. Will the following SELECT return the earlier 20 or your new 25? Make a prediction, then run both statements.',
        sql: `UPDATE lesson_tx_prices SET price = 25 WHERE product_id = 'P7';
SELECT price FROM lesson_tx_prices WHERE product_id = 'P7';`,
        expected: 'The read returns 25. A transaction sees its own earlier writes even at Repeatable Read. This response does not mean the transaction has committed.',
      },
      {
        title: 'Roll back the attempt',
        instruction: 'You decide not to keep the new price. Predict the value after ROLLBACK. The SELECT that follows runs outside the transaction we just ended.',
        sql: `ROLLBACK;
SELECT price FROM lesson_tx_prices WHERE product_id = 'P7';`,
        expected: 'The price is 20 again. Seeing 25 on this connection in the previous step was compatible with later undoing it.',
      },
      {
        title: 'Commit a separate change',
        instruction: 'Now begin a new transaction, set the price to 30, and commit it. Predict whether a later ROLLBACK can undo that already-completed transaction. Try a new transaction that sets 35 and rolls back as a variation; reset and rerun step 1 for the original price.',
        sql: `BEGIN;
UPDATE lesson_tx_prices SET price = 30 WHERE product_id = 'P7';
COMMIT;
SELECT price FROM lesson_tx_prices WHERE product_id = 'P7';`,
        expected: 'The price is 30. A rollback of a later attempt will leave that committed value intact. This disposable in-memory database demonstrates transaction state, not survival across browser resets or physical failures. Use the article’s server explanation for WAL and crash durability.',
      },
    ],
  },
  {
    id: 'retry-identity',
    title: 'Recover a checkout without reserving twice',
    description: 'Use a stable operation key, follow the returned-row branch, and reject a retry whose details changed.',
    articleHref: '/learn/databases/relational/conflicts-and-retries/#operation-identity',
    steps: [
      {
        title: 'Prepare the operation record and stock',
        instruction: 'Run this setup first. There are three mugs available. This simplified one-product checkout stores its customer, product, quantity and agreed EUR unit price together. You act as the handler, checking each response before deciding what to send. We will repeat a committed request, not simulate a lost network reply. Reset and rerun this step to start again.',
        sql: `DROP TABLE IF EXISTS lesson_retry_orders, lesson_retry_stock;
CREATE TABLE lesson_retry_stock (product_id text PRIMARY KEY, available integer NOT NULL CHECK (available >= 0));
CREATE TABLE lesson_retry_orders (
  order_id text PRIMARY KEY, operation_id text UNIQUE NOT NULL,
  customer_id text NOT NULL, product_id text NOT NULL REFERENCES lesson_retry_stock,
  quantity integer NOT NULL CHECK (quantity > 0), unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0)
);
INSERT INTO lesson_retry_stock (product_id, available) VALUES ('P7',3);
SELECT * FROM lesson_retry_stock;`,
        expected: 'P7 has three available mugs and there are no orders. K14 will identify the customer’s request for two mugs at €20 each, across every attempt.',
      },
      {
        title: 'Claim K14',
        instruction: 'Begin a transaction and propose order O14 for K14. Predict whether RETURNING yields a row. Continue to the reservation step only if it does. An empty result means the key already exists: skip reservation and recover that operation instead.',
        sql: `BEGIN;
INSERT INTO lesson_retry_orders (order_id, operation_id, customer_id, product_id, quantity, unit_price)
VALUES ('O14','K14','C4','P7',2,20)
ON CONFLICT (operation_id) DO NOTHING RETURNING order_id;`,
        expected: 'O14 is returned, so this attempt owns the new operation record. It is still provisional: committing now would record a purchase without reserving its stock.',
      },
      {
        title: 'Reserve only after winning the claim',
        instruction: 'The previous response returned O14, so reserve two mugs in the same transaction. Predict the remaining stock. If this query returns no rows, send ROLLBACK instead of continuing: the new order must disappear with the failed reservation.',
        sql: `UPDATE lesson_retry_stock SET available = available - 2
WHERE product_id = 'P7' AND available >= 2
RETURNING product_id, available;`,
        expected: 'One row returns P7 with available 1. The condition was tested in the update itself. This successful response permits the handler to commit.',
      },
      {
        title: 'Commit the complete purchase',
        instruction: 'The order claim and reservation both succeeded. Commit them together. Predict the stock and order count before reading them back.',
        sql: `COMMIT;
SELECT (SELECT available FROM lesson_retry_stock WHERE product_id = 'P7') AS available,
  (SELECT count(*) FROM lesson_retry_orders) AS orders;`,
        expected: 'One mug remains and one order exists. We know this attempt committed because its reply was received. The next steps explore the duplicate-request path using this committed state.',
      },
      {
        title: 'Repeat the same request',
        instruction: 'A repeated request proposes O15 but carries the same operation key K14. Predict RETURNING. If it is empty, do not reserve stock again; the next step looks up and verifies the recorded purchase.',
        sql: `BEGIN;
INSERT INTO lesson_retry_orders (order_id, operation_id, customer_id, product_id, quantity, unit_price)
VALUES ('O15','K14','C4','P7',2,20)
ON CONFLICT (operation_id) DO NOTHING RETURNING order_id;`,
        expected: 'No row is returned: the unique K14 already belongs to O14. The transaction remains open, but this attempt has created no purchase record.',
      },
      {
        title: 'Verify the existing purchase',
        instruction: 'Read K14 and compare every stored request field with the caller’s C4/P7/two/€20 request. Predict whether it matches. End this read-only attempt with ROLLBACK; that does not undo O14’s earlier commit.',
        sql: `SELECT order_id, customer_id, product_id, quantity, unit_price,
  (customer_id = 'C4' AND product_id = 'P7' AND quantity = 2 AND unit_price = 20) AS same_request
FROM lesson_retry_orders WHERE operation_id = 'K14';
ROLLBACK;
SELECT available FROM lesson_retry_stock WHERE product_id = 'P7';`,
        expected: 'O14 matches, so the handler can return that existing order. Stock remains 1. Only the attempt that created the operation record reserved stock.',
      },
      {
        title: 'Reject a changed request under the same key',
        instruction: 'Suppose the caller reuses K14 but now asks for three mugs. Predict the comparison. A false result must lead the application to reject the conflicting request; it must not treat K14 as permission for a different purchase. Reset and rerun step 1 to try the complete flow again.',
        sql: `SELECT order_id,
  (customer_id = 'C4' AND product_id = 'P7' AND quantity = 3 AND unit_price = 20) AS same_request
FROM lesson_retry_orders WHERE operation_id = 'K14';`,
        expected: 'same_request is false. A key identifies an intent only when the handler verifies the associated details. Try changing price or customer in the comparison too. This exercise does not reproduce concurrent claim waits, deadlocks or uncertain commits; the article explains how those outcomes alter the handler’s next action.',
      },
    ],
  },
];
