-- Indexes: complete isolated experiment. PostgreSQL 18.
-- Run in a fresh session. All writes affect a temporary table.
-- Use psql -f against your practice database, or run statements individually
-- in a query editor with autocommit enabled. VACUUM cannot run in a transaction.
-- EXPLAIN ANALYZE executes its statement. No production benchmark is claimed.

-- PostgreSQL 18. Run in a new session; the table disappears on disconnect.
-- No production table is read or modified.
SET TIME ZONE 'UTC';
CREATE TEMP TABLE index_orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL,
  placed_at timestamptz NOT NULL,
  status text NOT NULL,
  total numeric(10,2) NOT NULL,
  note text NOT NULL
);
INSERT INTO index_orders
  (order_id, customer_id, placed_at, status, total, note)
SELECT n, 1 + n % 1000,
       timestamptz '2026-01-01 00:00:00+00' + n * interval '1 minute',
       CASE WHEN (n / 1000) % 5 = 0 THEN 'pending' ELSE 'paid' END,
       (1000 + n % 9000)::numeric / 100,
       repeat('delivery note ', 12)
FROM generate_series(1, 60000) AS series(n);
ANALYZE index_orders;


-- Baseline: only the primary-key index exists.

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

CREATE INDEX index_orders_customer
ON index_orders (customer_id);

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

DROP INDEX index_orders_customer;
CREATE INDEX index_orders_history
ON index_orders (customer_id, placed_at DESC, order_id DESC);

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- The paid-only query adds a remaining filter.

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND status = 'paid'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

DROP INDEX index_orders_history;
CREATE INDEX index_orders_cover
ON index_orders (customer_id, placed_at DESC, order_id DESC)
INCLUDE (total);

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

VACUUM (ANALYZE) index_orders;

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT sum(total)
FROM index_orders
WHERE customer_id BETWEEN 1 AND 900;

SELECT pg_relation_size('index_orders') AS table_bytes,
       pg_relation_size('index_orders_cover') AS covering_index_bytes;

-- Exercise the maintained index as data changes.

-- Continue after the covering-index experiment.
INSERT INTO index_orders
  (order_id, customer_id, placed_at, status, total, note)
SELECT n, 1 + n % 1000,
       timestamptz '2026-01-01 00:00:00+00' + n * interval '1 minute',
       'pending', 25.00, repeat('delivery note ', 12)
FROM generate_series(60001, 61000) AS series(n);

UPDATE index_orders
SET total = total + 1.00
WHERE order_id BETWEEN 60001 AND 60200;

DELETE FROM index_orders
WHERE order_id BETWEEN 60901 AND 61000;

DO $$
BEGIN
  IF (SELECT count(*) FROM index_orders) <> 60900 THEN
    RAISE EXCEPTION 'Unexpected final order count';
  END IF;
  IF (SELECT count(*) FROM index_orders WHERE total = 26.00 AND order_id BETWEEN 60001 AND 60200) <> 200 THEN
    RAISE EXCEPTION 'Amount changes did not persist';
  END IF;
END $$;

SELECT pg_relation_size('index_orders') AS table_bytes,
       pg_relation_size('index_orders_cover') AS covering_index_bytes;

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- End the session to remove the temporary table.
