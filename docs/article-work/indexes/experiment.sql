-- Indexes: the complete experiment from the article. PostgreSQL 18.
-- Run in a fresh session. Every write affects a temporary table that
-- disappears when the session ends. Use psql -f, or run the statements one
-- at a time in a query editor with autocommit on: VACUUM cannot run inside
-- a transaction block. EXPLAIN ANALYZE executes its statement.

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

-- Sequential scan: no index on customer_id yet.

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id = 42;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- Index entries: an index on customer_id.

CREATE INDEX index_orders_customer
ON index_orders (customer_id);

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id = 42;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- Range scans.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, customer_id
FROM index_orders
WHERE customer_id BETWEEN 40 AND 45
ORDER BY customer_id;

-- Selectivity: try other bounds, such as 550.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, total
FROM index_orders
WHERE customer_id <= 500;

-- Composite indexes.

DROP INDEX index_orders_customer;
CREATE INDEX index_orders_history
ON index_orders (customer_id, placed_at DESC, order_id DESC);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at
FROM index_orders
WHERE placed_at >= timestamptz '2026-02-11 00:00:00+00'
ORDER BY placed_at DESC
LIMIT 10;

-- Covering indexes and index-only scans.

DROP INDEX index_orders_history;
CREATE INDEX index_orders_cover
ON index_orders (customer_id, placed_at DESC, order_id DESC)
INCLUDE (total);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

VACUUM (ANALYZE) index_orders;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

SELECT pg_relation_size('index_orders') AS table_bytes,
       pg_relation_size('index_orders_cover') AS covering_index_bytes;

-- Index maintenance: scans per index so far in this session.

SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE relname = 'index_orders';

-- Checking an index: a condition the index cannot use.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND status = 'paid'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- End the session to remove the temporary table.
