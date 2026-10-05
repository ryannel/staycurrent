-- PostgreSQL 18 practice examples.
-- Run the shared designing-data.sql in a FRESH database first.
-- Use a separate fresh database for each article extension.
-- Send statements one at a time, or use SQL script mode (for example psql -f).
-- Do not send this whole file as one multi-statement server query.
-- These statements do not drop or overwrite existing tables.

INSERT INTO orders (order_id, customer_id, placed_at)
VALUES ('O14', 'C4', '2026-10-04 12:00:00+00'),
       ('O15', 'C4', '2026-10-04 12:00:00+00'),
       ('O16', 'C4', '2026-10-04 12:00:00+00');

-- First page
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;

-- unchanged: each experiment starts from the original five orders.
BEGIN;

SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
ORDER BY placed_at DESC, order_id DESC
OFFSET 2 LIMIT 2;
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
  AND (placed_at, order_id)
      < ('2026-10-04 12:00:00+00', 'O15')
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;
ROLLBACK;

-- new earlier row: each experiment starts from the original five orders.
BEGIN;
INSERT INTO orders (order_id, customer_id, placed_at)
VALUES ('O17', 'C4', '2026-10-04 13:00:00+00');
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
ORDER BY placed_at DESC, order_id DESC
OFFSET 2 LIMIT 2;
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
  AND (placed_at, order_id)
      < ('2026-10-04 12:00:00+00', 'O15')
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;
ROLLBACK;

-- delete seen row: each experiment starts from the original five orders.
BEGIN;
DELETE FROM orders WHERE order_id = 'O16';
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
ORDER BY placed_at DESC, order_id DESC
OFFSET 2 LIMIT 2;
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
  AND (placed_at, order_id)
      < ('2026-10-04 12:00:00+00', 'O15')
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;
ROLLBACK;

-- move unread row: each experiment starts from the original five orders.
BEGIN;
UPDATE orders SET placed_at = '2026-10-04 13:00:00+00' WHERE order_id = 'O14';
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
ORDER BY placed_at DESC, order_id DESC
OFFSET 2 LIMIT 2;
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
  AND (placed_at, order_id)
      < ('2026-10-04 12:00:00+00', 'O15')
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;
ROLLBACK;

-- delete boundary row: each experiment starts from the original five orders.
BEGIN;
DELETE FROM orders WHERE order_id = 'O15';
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
ORDER BY placed_at DESC, order_id DESC
OFFSET 2 LIMIT 2;
SELECT order_id, placed_at
FROM orders
WHERE customer_id = 'C4'
  AND (placed_at, order_id)
      < ('2026-10-04 12:00:00+00', 'O15')
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;
ROLLBACK;

CREATE INDEX orders_customer_page_idx
ON orders (customer_id, placed_at DESC, order_id DESC);

BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;

DECLARE order_export NO SCROLL CURSOR FOR
  SELECT order_id, customer_id, placed_at
  FROM orders
  ORDER BY placed_at, order_id;

FETCH FORWARD 2 FROM order_export;
FETCH FORWARD 2 FROM order_export;
FETCH FORWARD 2 FROM order_export;

CLOSE order_export;
COMMIT;

-- Select two oldest headers, then all their lines, in one statement.
WITH page AS (
  SELECT order_id, placed_at
  FROM orders
  WHERE customer_id = 'C4'
  ORDER BY placed_at, order_id
  LIMIT 2
)
SELECT page.order_id, l.line_no, l.product_id, l.quantity
FROM page
LEFT JOIN order_lines AS l ON l.order_id = page.order_id
ORDER BY page.placed_at, page.order_id, l.line_no;
