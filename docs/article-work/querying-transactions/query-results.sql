-- PostgreSQL 18 practice examples.
-- Run the shared designing-data.sql in a FRESH database first.
-- Use a separate fresh database for each article extension.
-- These statements do not drop or overwrite existing tables.

-- setup
INSERT INTO customers (customer_id, name)
VALUES ('C5', 'Ben');

-- An order header exists before its lines have been added.
INSERT INTO orders (order_id, customer_id, placed_at)
VALUES ('O14', 'C4', '2026-10-04 11:00:00+00');

CREATE TABLE shipments (
  shipment_id text PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders (order_id)
);
INSERT INTO shipments (shipment_id, order_id)
VALUES ('S1', 'O13'), ('S2', 'O13');

-- firstQuery
SELECT order_id, line_no, quantity,
       quantity * unit_price AS line_total
FROM order_lines
WHERE order_id = 'O13'
ORDER BY line_no;

-- joinQuery
SELECT l.order_id, l.line_no, p.name,
       l.quantity, l.quantity * l.unit_price AS line_total
FROM order_lines AS l
JOIN products AS p ON p.product_id = l.product_id
ORDER BY l.order_id, l.line_no;

-- customerJoin
SELECT c.customer_id, c.name, o.order_id
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
ORDER BY c.customer_id, o.order_id;

-- filterSetup
CREATE TEMP TABLE filter_customers AS
SELECT * FROM customers;
CREATE TEMP TABLE filter_orders AS
SELECT * FROM orders;

INSERT INTO filter_customers (customer_id, name)
VALUES ('C6', 'Cara');
INSERT INTO filter_orders (order_id, customer_id, placed_at)
VALUES ('O15', 'C6', '2026-10-04 08:00:00+00');

-- onFilter
SELECT c.customer_id, c.name, o.order_id
FROM filter_customers AS c
LEFT JOIN filter_orders AS o
  ON o.customer_id = c.customer_id
 AND o.placed_at >= '2026-10-04 10:00:00+00'
ORDER BY c.customer_id, o.order_id;

-- whereFilter
SELECT c.customer_id, c.name, o.order_id
FROM filter_customers AS c
LEFT JOIN filter_orders AS o ON o.customer_id = c.customer_id
WHERE o.placed_at >= '2026-10-04 10:00:00+00'
ORDER BY c.customer_id, o.order_id;

-- totalsQuery
SELECT o.order_id,
       COUNT(*) AS joined_rows,
       COUNT(l.line_no) AS line_count,
       SUM(l.quantity * l.unit_price) AS line_total
FROM orders AS o
LEFT JOIN order_lines AS l ON l.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.order_id;

-- havingQuery
SELECT order_id, SUM(quantity * unit_price) AS line_total
FROM order_lines
GROUP BY order_id
HAVING SUM(quantity * unit_price) >= 40
ORDER BY order_id;

-- fanoutQuery
SELECT l.line_no, s.shipment_id,
       l.quantity * l.unit_price AS line_total
FROM order_lines AS l
JOIN shipments AS s ON s.order_id = l.order_id
WHERE l.order_id = 'O13'
ORDER BY l.line_no, s.shipment_id;

-- safeTotals
WITH line_totals AS (
  SELECT order_id, SUM(quantity * unit_price) AS amount
  FROM order_lines
  GROUP BY order_id
), shipment_counts AS (
  SELECT order_id, COUNT(*) AS shipment_count
  FROM shipments
  GROUP BY order_id
)
SELECT o.order_id, t.amount, s.shipment_count
FROM orders AS o
JOIN line_totals AS t ON t.order_id = o.order_id
JOIN shipment_counts AS s ON s.order_id = o.order_id
WHERE o.order_id = 'O13';

-- existsQuery
SELECT o.order_id
FROM orders AS o
WHERE EXISTS (
  SELECT 1
  FROM order_lines AS l
  WHERE l.order_id = o.order_id
    AND l.product_id = 'P7'
)
ORDER BY o.order_id;

-- noLinesQuery
SELECT o.order_id
FROM orders AS o
WHERE NOT EXISTS (
  SELECT 1
  FROM order_lines AS l
  WHERE l.order_id = o.order_id
)
ORDER BY o.order_id;
