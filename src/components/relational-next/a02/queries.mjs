export const setup = `-- Run only in a fresh disposable PostgreSQL database.
DROP TABLE IF EXISTS payments, order_lines, orders, customers;
SET TIME ZONE 'UTC';
CREATE TABLE customers (
  customer_id integer PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  placed_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'cancelled')),
  shipped_at timestamptz
);
CREATE TABLE order_lines (
  order_id integer REFERENCES orders,
  line_no integer,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  PRIMARY KEY (order_id, line_no)
);
CREATE TABLE payments (
  payment_id integer PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders,
  amount numeric(10,2) NOT NULL CHECK (amount > 0)
);
INSERT INTO customers VALUES (1, 'Mina'), (2, 'Tariq'), (3, 'Edda');
INSERT INTO orders VALUES
 (100, 1, '2026-01-01 00:00:00+00', 'open', NULL),
 (101, 1, '2026-01-10 09:00:00+00', 'open', NULL),
 (102, 1, '2026-01-10 09:00:00+00', 'open', '2026-01-12 10:00:00+00'),
 (103, 2, '2026-01-31 23:59:59+00', 'open', NULL),
 (104, 2, '2026-02-01 00:00:00+00', 'open', NULL),
 (105, 3, '2026-01-20 12:00:00+00', 'cancelled', NULL),
 (106, 3, '2026-01-22 12:00:00+00', 'open', NULL);
INSERT INTO order_lines VALUES
 (100, 1, 10), (101, 1, 20), (101, 2, 10),
 (102, 1, 20), (103, 1, 40), (104, 1, 50), (105, 1, 60);
INSERT INTO payments VALUES
 (200, 100, 10), (201, 101, 10), (202, 101, 5), (203, 103, 40);`;

export const candidates = `SELECT order_id, customer_id, placed_at,
       CASE WHEN shipped_at IS NULL THEN 'waiting' ELSE 'sent' END AS shipping
FROM orders
WHERE status = 'open'
  AND placed_at >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
  AND placed_at <  TIMESTAMPTZ '2026-02-01 00:00:00+00'
ORDER BY placed_at, order_id;`;

export const pairs = `SELECT o.order_id, l.line_no, l.amount
FROM orders AS o
JOIN order_lines AS l ON l.order_id = o.order_id
WHERE o.order_id IN (101, 102, 106)
ORDER BY o.order_id, l.line_no;`;

export const grouped = `SELECT o.order_id, SUM(l.amount) AS order_value
FROM orders AS o
LEFT JOIN order_lines AS l ON l.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.order_id;`;

export const lineStage = `line_totals AS (
  SELECT order_id, SUM(amount) AS order_value
  FROM order_lines
  GROUP BY order_id
)`;
export const paymentStage = `payment_totals AS (
  SELECT order_id, SUM(amount) AS paid
  FROM payments
  GROUP BY order_id
)`;
export const balanceStage = `balances AS (
  SELECT o.order_id, o.customer_id, o.placed_at,
         l.order_value - COALESCE(p.paid, 0) AS due,
         EXISTS (
           SELECT 1 FROM payments AS receipt
           WHERE receipt.order_id = o.order_id
         ) AS has_payment
  FROM orders AS o
  LEFT JOIN line_totals AS l ON l.order_id = o.order_id
  LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
  WHERE o.status = 'open'
    AND o.placed_at >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
    AND o.placed_at <  TIMESTAMPTZ '2026-02-01 00:00:00+00'
)`;
export const stages = `WITH ${lineStage},\n${paymentStage},\n${balanceStage}`;
export const finalSelect = `SELECT b.order_id, c.name, b.due, b.has_payment
FROM balances AS b
JOIN customers AS c ON c.customer_id = b.customer_id
WHERE b.due > 0 OR b.due IS NULL
ORDER BY b.placed_at, b.order_id;`;
export const report = stages + '\n' + finalSelect;
export const smallWith = `WITH ${lineStage}
SELECT order_id, order_value
FROM line_totals
ORDER BY order_id;`;
export const windows = `WITH ${lineStage}
SELECT o.order_id, o.customer_id, l.order_value,
       SUM(l.order_value) OVER (PARTITION BY o.customer_id) AS customer_value
FROM orders AS o
JOIN line_totals AS l ON l.order_id = o.order_id
WHERE o.order_id IN (101, 102, 103)
ORDER BY o.customer_id, o.order_id;`;
export const firstPage = `SELECT order_id, placed_at
FROM orders
ORDER BY placed_at, order_id
LIMIT 2;`;
export const nextPage = `SELECT order_id, placed_at
FROM orders
WHERE placed_at > TIMESTAMPTZ '2026-01-10 09:00:00+00'
   OR (placed_at = TIMESTAMPTZ '2026-01-10 09:00:00+00' AND order_id > 101)
ORDER BY placed_at, order_id
LIMIT 2;`;
export const changes = `BEGIN;
-- Precondition: order 101 is open; order 999 does not exist.
SELECT order_id, status FROM orders WHERE order_id IN (101, 999) ORDER BY order_id;
UPDATE orders SET status = 'cancelled'
WHERE order_id = 101 AND status = 'open'
RETURNING order_id, status;
-- Same attempt now matches zero rows.
UPDATE orders SET status = 'cancelled'
WHERE order_id = 101 AND status = 'open'
RETURNING order_id, status;
INSERT INTO orders (order_id, customer_id, placed_at, status)
VALUES (107, 3, TIMESTAMPTZ '2026-01-25 12:00:00+00', 'open')
RETURNING order_id, status, shipped_at;
DELETE FROM orders WHERE order_id = 107 RETURNING order_id;
SELECT order_id, status FROM orders WHERE order_id IN (101, 107) ORDER BY order_id;
ROLLBACK;
SELECT order_id, status FROM orders WHERE order_id IN (101, 107) ORDER BY order_id;`;

export const checks = `-- Compare complete rows and their multiplicities, ignoring order here.
WITH ${lineStage},
${paymentStage},
${balanceStage},
actual AS (
  SELECT b.order_id, c.name, b.due, b.has_payment
  FROM balances AS b
  JOIN customers AS c ON c.customer_id = b.customer_id
  WHERE b.due > 0 OR b.due IS NULL
),
expected (order_id, name, due, has_payment) AS (
  VALUES (101, 'Mina', 15::numeric, true),
         (102, 'Mina', 20::numeric, false),
         (106, 'Edda', NULL::numeric, false)
)
(SELECT * FROM actual EXCEPT ALL SELECT * FROM expected)
UNION ALL
(SELECT * FROM expected EXCEPT ALL SELECT * FROM actual);`;

export const queries = {candidates, pairs, grouped, smallWith, report, windows, firstPage, nextPage, checks};
