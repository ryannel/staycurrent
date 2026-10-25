-- Pagination and consistent exports: ordinary SQL examples.
-- Run in a fresh PostgreSQL session. Temporary projected tables only.
-- The final ROLLBACK removes all test data; no existing table is changed.
-- Each mutation below is independent. All timestamps are UTC.
BEGIN;
SET LOCAL TIME ZONE 'UTC';
CREATE TEMP TABLE orders (
  order_id integer PRIMARY KEY, customer_id integer NOT NULL,
  placed_at timestamptz NOT NULL, status text NOT NULL
) ON COMMIT DROP;
INSERT INTO orders VALUES
(202, 3, '2026-10-20 10:15:00+00', 'pending'),
(201, 3, '2026-10-20 10:15:00+00', 'pending'),
(103, 1, '2026-10-20 10:15:00+00', 'pending'),
(102, 2, '2026-10-14 16:05:00+00', 'paid'),
(101, 1, '2026-10-12 09:30:00+00', 'paid');
-- Projected package weights: an independent example, in grams.
CREATE TEMP TABLE products (
  product_id text PRIMARY KEY, package_weight_g integer
) ON COMMIT DROP;
INSERT INTO products VALUES ('P3',65),('P7',NULL),('P9',820);

-- The first page of orders
SELECT order_id, placed_at, status
FROM orders
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;

-- The second numbered page
SELECT order_id, placed_at, status
FROM orders
ORDER BY placed_at DESC, order_id DESC
LIMIT 2 OFFSET 2;

-- Continue after time and order ID
SELECT order_id, placed_at, status
FROM orders
WHERE placed_at < timestamptz '2026-10-20 10:15:00+00'
   OR (placed_at = timestamptz '2026-10-20 10:15:00+00'
       AND order_id < 201)
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;

-- The same continuation as a row comparison
SELECT order_id, placed_at, status
FROM orders
WHERE (placed_at, order_id)
    < (timestamptz '2026-10-20 10:15:00+00', 201)
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;

-- A continuation for mixed sort directions
SELECT order_id, placed_at, status
FROM orders
WHERE placed_at < timestamptz '2026-10-20 10:15:00+00'
   OR (placed_at = timestamptz '2026-10-20 10:15:00+00'
       AND order_id > 201)
ORDER BY placed_at DESC, order_id ASC
LIMIT 2;

-- Continue from a measured weight into the null group
SELECT product_id, package_weight_g
FROM products
WHERE package_weight_g > 820
   OR (package_weight_g = 820 AND product_id > 'P9')
   OR package_weight_g IS NULL
ORDER BY package_weight_g ASC NULLS LAST, product_id ASC
LIMIT 2;

-- Find the nearest two rows before page two
SELECT order_id, placed_at, status
FROM orders
WHERE (placed_at, order_id)
    > (timestamptz '2026-10-20 10:15:00+00', 103)
ORDER BY placed_at ASC, order_id ASC
LIMIT 2;

-- Wrong: timestamp alone loses 103
SELECT order_id FROM orders
WHERE placed_at < timestamptz '2026-10-20 10:15:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 2;

-- Wrong: inclusive pair repeats 201
SELECT order_id FROM orders
WHERE (placed_at, order_id) <= (timestamptz '2026-10-20 10:15:00+00',201)
ORDER BY placed_at DESC, order_id DESC LIMIT 2;

-- Request one extra row, display only 202 and 201
SELECT order_id, placed_at, status
FROM orders
ORDER BY placed_at DESC, order_id DESC
LIMIT 3;

-- Continue inside the null group
SELECT product_id, package_weight_g FROM products
WHERE package_weight_g IS NULL AND product_id > 'P7'
ORDER BY package_weight_g ASC NULLS LAST, product_id ASC LIMIT 2;

-- Wrong: nullable pair comparison loses P7
SELECT product_id FROM products
WHERE (package_weight_g,product_id) > (820,'P9')
ORDER BY package_weight_g ASC NULLS LAST, product_id ASC LIMIT 2;

-- Independent change: Insert 203 before the boundary
SAVEPOINT mutation;
INSERT INTO orders VALUES (203,3,'2026-10-21 09:00:00+00','pending');

-- insert: keyset
SELECT order_id, placed_at, status
FROM orders
WHERE (placed_at, order_id)
    < (timestamptz '2026-10-20 10:15:00+00', 201)
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;

-- insert: offset
SELECT order_id, placed_at, status
FROM orders
ORDER BY placed_at DESC, order_id DESC
LIMIT 2 OFFSET 2;
ROLLBACK TO mutation;
RELEASE mutation;

-- Independent change: Delete already-read 202
SAVEPOINT mutation;
DELETE FROM orders WHERE order_id = 202;

-- delete: keyset
SELECT order_id, placed_at, status
FROM orders
WHERE (placed_at, order_id)
    < (timestamptz '2026-10-20 10:15:00+00', 201)
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;

-- delete: offset
SELECT order_id, placed_at, status
FROM orders
ORDER BY placed_at DESC, order_id DESC
LIMIT 2 OFFSET 2;
ROLLBACK TO mutation;
RELEASE mutation;

-- Independent change: Move unread 103 before the boundary
SAVEPOINT mutation;
UPDATE orders SET placed_at='2026-10-21 08:00:00+00' WHERE order_id=103;

-- forward: keyset
SELECT order_id, placed_at, status
FROM orders
WHERE (placed_at, order_id)
    < (timestamptz '2026-10-20 10:15:00+00', 201)
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;
ROLLBACK TO mutation;
RELEASE mutation;

-- Independent change: Move already-read 202 after the boundary
SAVEPOINT mutation;
UPDATE orders SET placed_at='2026-10-19 12:00:00+00' WHERE order_id=202;

-- backward: keyset
SELECT order_id, placed_at, status
FROM orders
WHERE (placed_at, order_id)
    < (timestamptz '2026-10-20 10:15:00+00', 201)
ORDER BY placed_at DESC, order_id DESC
LIMIT 2;
ROLLBACK TO mutation;
RELEASE mutation;

-- Timestamp precision example
SELECT
    timestamptz '2026-10-20 10:15:00.123456+00'::text AS exact_value,
    timestamptz '2026-10-20 10:15:00.123456+00'
      > timestamptz '2026-10-20 10:15:00.123+00' AS rounded_boundary_is_smaller;

ROLLBACK;
