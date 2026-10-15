export type TutorialStep = {
  title: string;
  instruction: string;
  sql: string;
  expected: string;
};

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  articleHref: string;
  steps: TutorialStep[];
};

const inspectCheckout = `SELECT
  (SELECT available FROM stock WHERE product_id = 'P7') AS available,
  (SELECT count(*) FROM orders WHERE order_id = 'O14') AS orders,
  (SELECT count(*) FROM order_lines WHERE order_id = 'O14') AS lines;`;

const reserveTwo = `UPDATE stock
SET available = available - 2
WHERE product_id = 'P7' AND available >= 2
RETURNING product_id, available;`;

const insertOrder = `INSERT INTO orders (order_id, customer_id, placed_at)
VALUES ('O14', 'C4', '2026-10-15 11:00:00+00');`;

export const sandboxTutorials: Tutorial[] = [
  {
    id: 'queries',
    title: 'From product IDs to an order',
    description: 'Read the shop’s records, join two tables, and calculate what an order cost.',
    articleHref: '/learn/databases/relational/query-results/',
    steps: [
      {
        title: 'Read the product catalogue',
        instruction: 'Starting this tutorial loads a fresh shop. Run this SELECT to see its two products. SELECT names the columns we want; FROM names their table. ORDER BY makes the displayed order deliberate.',
        sql: `SELECT product_id, name, current_price
FROM products
ORDER BY product_id;`,
        expected: 'P7 is the Blue mug at €20; P8 is the Bowl at €24. These are today’s catalogue prices. The query only reads records.',
      },
      {
        title: 'Find the lines of order O13',
        instruction: 'An order line records a product, quantity and agreed unit price. WHERE limits this query to one order. Notice that the line has a product ID but no product name.',
        sql: `SELECT line_no, product_id, quantity, unit_price
FROM order_lines
WHERE order_id = 'O13'
ORDER BY line_no;`,
        expected: 'Two lines: line 1 has P7, quantity 1, price €20; line 2 has P8, quantity 1, price €24. One order can therefore produce several result rows.',
      },
      {
        title: 'Follow each ID to its product',
        instruction: 'JOIN matches each order line to the product with the same product_id. The short names l and p let us say which table supplies a column. Run the query and follow P7 from the previous result to its name.',
        sql: `SELECT l.line_no, p.name, l.quantity, l.unit_price
FROM order_lines AS l
JOIN products AS p ON p.product_id = l.product_id
WHERE l.order_id = 'O13'
ORDER BY l.line_no;`,
        expected: 'Line 1 now says Blue mug; line 2 says Bowl. There are still two rows because each line matches exactly one product. The unit_price still comes from the purchase line, not the catalogue.',
      },
      {
        title: 'Calculate the purchase total',
        instruction: 'Multiply each line’s quantity by its agreed price, then SUM those amounts. This query asks for one total rather than one row per line. You can change O13 to O12 afterwards to inspect another purchase.',
        sql: `SELECT sum(quantity * unit_price) AS order_total
FROM order_lines
WHERE order_id = 'O13';`,
        expected: 'O13 totals €44. If you try O12, it totals €36: that earlier purchase contains two mugs at €18 each. Its recorded price does not change with today’s €20 catalogue price.',
      },
    ],
  },
  {
    id: 'constraints',
    title: 'Accept a valid quantity, reject an invalid one',
    description: 'Change a practice order line and see what its quantity constraint permits.',
    articleHref: '/learn/databases/relational/constraints/',
    steps: [
      {
        title: 'Inspect a practice order line',
        instruction: 'This fresh shop contains order O12 with two mugs on line 1. We will edit that practice record to examine one constraint. These edits are not a complete checkout or cancellation workflow.',
        sql: `SELECT order_id, line_no, quantity
FROM order_lines
WHERE order_id = 'O12' AND line_no = 1;`,
        expected: 'One row: O12, line 1, quantity 2. The table declares quantity as NOT NULL with CHECK (quantity > 0).',
      },
      {
        title: 'Send an allowed value',
        instruction: 'Set the quantity to three. RETURNING asks the database to show the row it changed. We have not sent BEGIN, so this successful statement commits on its own.',
        sql: `UPDATE order_lines SET quantity = 3
WHERE order_id = 'O12' AND line_no = 1
RETURNING order_id, line_no, quantity;`,
        expected: 'The returned quantity is 3. It satisfies the positive-quantity check, so PostgreSQL accepts the change.',
      },
      {
        title: 'Send a value the rule excludes',
        instruction: 'Run this deliberately invalid update. An error is the intended result: zero does not satisfy quantity > 0. The database checks the value even if the application forgot to validate it.',
        sql: `UPDATE order_lines SET quantity = 0
WHERE order_id = 'O12' AND line_no = 1
RETURNING quantity;`,
        expected: 'A check-constraint error, SQLSTATE 23514. No zero quantity is saved. This statement’s transaction fails; the earlier successful edit to three stays committed.',
      },
      {
        title: 'Check what remains',
        instruction: 'Read the practice line again. There is no explicit transaction left open after the rejected standalone update, so this query can run normally. In the rollback tutorial, we will see how an error behaves inside BEGIN and ROLLBACK.',
        sql: `SELECT order_id, line_no, quantity
FROM order_lines
WHERE order_id = 'O12' AND line_no = 1;`,
        expected: 'Quantity is still 3. The constraint refused the invalid change; it did not undo a different statement that had already committed.',
      },
    ],
  },
  {
    id: 'checkout',
    title: 'Record a complete checkout',
    description: 'Reserve two mugs, record their purchase and commit all three changes together.',
    articleHref: '/learn/databases/relational/transaction-boundaries/#working-through-checkout',
    steps: [
      {
        title: 'Inspect the starting state',
        instruction: 'You will take the checkout handler’s place, sending its SQL commands and inspecting each response. This tutorial starts with three available P7 mugs and no new order O14. All steps use one database connection. Run this query to check that starting point. The outer SELECT puts three answers in one row: available reads the stock value; each count(*) counts matching records. AS supplies each result column’s name.',
        sql: inspectCheckout,
        expected: 'available = 3, orders = 0, lines = 0. The historical orders in the shop are already accounted for; these counts examine only the new O14 purchase.',
      },
      {
        title: 'Open the transaction',
        instruction: 'Run BEGIN. The transaction remains open while you read the result, edit SQL or move to another step. Loading the next step does not execute it or end this transaction.',
        sql: 'BEGIN;',
        expected: 'BEGIN succeeds without a result table. The following commands on this connection now belong to the same transaction.',
      },
      {
        title: 'Reserve two mugs and inspect the answer',
        instruction: 'This UPDATE reserves two mugs only if at least two are available. Run it once and inspect the returned rows before continuing. In an application, this is the result the handler awaits.',
        sql: reserveTwo,
        expected: 'One row: P7, available 1. That means this attempt reserved two mugs. If your edits or repeated runs produce no row, send ROLLBACK instead and stop this attempt; do not continue to create a purchase without a reservation.',
      },
      {
        title: 'Record the purchase',
        instruction: 'Continue only after the reservation returned one row. These two INSERT statements create O14 for customer C4, then its line for two P7 mugs at €20 each. They use the transaction you already opened; there is no new BEGIN.',
        sql: `${insertOrder}

INSERT INTO order_lines
  (order_id, line_no, product_id, quantity, unit_price)
VALUES ('O14', 1, 'P7', 2, 20.00);`,
        expected: 'Both inserts succeed. The stock change, order and line are still uncommitted. If either statement errors, send ROLLBACK and restart the tutorial rather than proceeding to COMMIT.',
      },
      {
        title: 'Keep the complete purchase',
        instruction: 'The reservation and both inserts succeeded. Send COMMIT to keep them together. A real handler waits for this acknowledgement before reporting a completed purchase.',
        sql: 'COMMIT;',
        expected: 'COMMIT succeeds. O14, its line and the stock reduction now form one committed purchase. A later ROLLBACK cannot undo it.',
      },
      {
        title: 'Inspect the committed result',
        instruction: 'This query runs after the transaction has ended. Compare the counts with the beginning of the tutorial. Starting the rollback tutorial creates a fresh shop, so you can compare another ending from the same initial state.',
        sql: inspectCheckout,
        expected: 'available = 1, orders = 1, lines = 1. Two mugs have a recorded purchase explaining where they went.',
      },
    ],
  },
  {
    id: 'rollback',
    title: 'Recover from a rejected order line',
    description: 'Let a checkout fail after its first changes, then end the failed transaction with rollback.',
    articleHref: '/learn/databases/relational/transaction-boundaries/#failure',
    steps: [
      {
        title: 'Start a separate attempt',
        instruction: 'This fresh shop has three mugs and no order O14. You are supplying the checkout handler’s commands on one connection. Run BEGIN to group the upcoming changes; this is an alternative to the successful checkout tutorial.',
        sql: 'BEGIN;',
        expected: 'The transaction is open. Nothing has changed yet.',
      },
      {
        title: 'Reserve two mugs',
        instruction: 'Run the reservation once. Continue only if it returns a row. Zero rows means nothing was reserved: send ROLLBACK and restart rather than continuing this purchase.',
        sql: reserveTwo,
        expected: 'P7 returns with available 1. The reduction belongs to this open transaction and has not committed.',
      },
      {
        title: 'Create the order',
        instruction: 'Send the order INSERT on the same connection. The purchase is still incomplete: it has an order record but no line describing the mugs.',
        sql: insertOrder,
        expected: 'The insert succeeds. O14 and the stock reduction are both pending inside the transaction.',
      },
      {
        title: 'Send the wrong line quantity',
        instruction: 'Run this deliberately invalid line insert. The value 0 fills quantity, which must be positive. In application code, the awaited query would throw and skip the later COMMIT call.',
        sql: `INSERT INTO order_lines
  (order_id, line_no, product_id, quantity, unit_price)
VALUES ('O14', 1, 'P7', 0, 20.00);`,
        expected: 'A check-constraint error, SQLSTATE 23514. PostgreSQL rejects the line and the explicit transaction enters a failed state. The stock reduction and order have not committed.',
      },
      {
        title: 'Observe the failed transaction',
        instruction: 'Try this ordinary read before rolling back. This is a deliberate extra experiment: a handler would normally move straight to its rollback error handler after the rejection.',
        sql: "SELECT available FROM stock WHERE product_id = 'P7';",
        expected: 'An error with SQLSTATE 25P02 says the transaction is aborted. Even this read is refused until the failed transaction is ended. It is not evidence that the stock row is missing.',
      },
      {
        title: 'Handle the error with rollback',
        instruction: 'You now take the place of the application’s catch block. Send ROLLBACK on this same connection. Do not add two mugs back with an UPDATE: the reservation never committed.',
        sql: 'ROLLBACK;',
        expected: 'ROLLBACK succeeds and ends the failed transaction. None of this attempt’s changes are kept; the connection can run ordinary queries again.',
      },
      {
        title: 'Verify the abandoned purchase',
        instruction: 'Run the same inspection used by the successful checkout. This query is now outside the ended transaction. Compare its answer with the committed checkout’s 1 available, 1 order and 1 line.',
        sql: inspectCheckout,
        expected: 'available = 3, orders = 0, lines = 0. Rollback discarded this attempt’s stock reduction and order together. Historical purchases remain untouched.',
      },
    ],
  },
];
