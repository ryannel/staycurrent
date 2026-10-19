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
  email text NOT NULL,
  note text NOT NULL
);
INSERT INTO index_orders
  (order_id, customer_id, placed_at, status, total, email, note)
SELECT n, 1 + n % 1000,
       timestamptz '2026-01-01 00:00:00+00' + n * interval '1 minute',
       CASE WHEN (n / 1000) % 5 = 0 THEN 'pending' ELSE 'paid' END,
       (1000 + n % 9000)::numeric / 100,
       'Shopper' || lpad((1 + n % 1000)::text, 4, '0') || '@Example.com',
       repeat('leave at the door ', 8)
FROM generate_series(1, 60000) AS series(n);
ANALYZE index_orders;

-- Sequential scan: no index on customer_id yet. The second query is the
-- history query, used again in later sections.

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

-- Index entries and TIDs: an index on customer_id.

CREATE INDEX index_orders_customer
ON index_orders (customer_id);

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id = 42;

-- Range scans.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, customer_id
FROM index_orders
WHERE customer_id BETWEEN 40 AND 45
ORDER BY customer_id;

-- Selectivity: try other bounds too, such as 550.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, total
FROM index_orders
WHERE customer_id <= 500;

-- Selectivity belongs to the value: paid is 80% of the orders, pending 20%.
-- Then the paid orders again with the preferred routes turned off.

CREATE INDEX index_orders_status
ON index_orders (status);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, total
FROM index_orders
WHERE status = 'paid';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, total
FROM index_orders
WHERE status = 'pending';

SET enable_seqscan = off;
SET enable_bitmapscan = off;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, total
FROM index_orders
WHERE status = 'paid';

RESET enable_seqscan;
RESET enable_bitmapscan;

-- Combining two indexes, one condition selective enough to need no
-- second index, and an OR whose second branch has no index.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE customer_id = 42 AND status = 'pending';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE order_id = 7 AND status = 'pending';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE customer_id = 42 OR order_id = 7;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE customer_id = 42 OR total = 10.5;

DROP INDEX index_orders_status;

-- Composite indexes: the history query with the customer index, then
-- with the reversed index, then with the composite index.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

DROP INDEX index_orders_customer;
CREATE INDEX index_orders_reversed
ON index_orders (placed_at DESC, customer_id);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

DROP INDEX index_orders_reversed;
CREATE INDEX index_orders_history
ON index_orders (customer_id, placed_at DESC, order_id DESC);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- Covering indexes and index-only scans: before VACUUM, after it, and
-- after an update to another order on the same table page.

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

UPDATE index_orders
SET total = total + 1
WHERE order_id = 59040;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- Checking an index with EXPLAIN: a condition the index cannot use.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND status = 'paid'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

-- The same query with status as the last key column: the condition is
-- checked inside the index.

CREATE INDEX index_orders_cover_status
ON index_orders (customer_id, placed_at DESC, order_id DESC, status)
INCLUDE (total);

ANALYZE index_orders;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at, total
FROM index_orders
WHERE customer_id = 42
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND status = 'paid'
ORDER BY placed_at DESC, order_id DESC
LIMIT 10;

DROP INDEX index_orders_cover_status;

-- Partial and expression indexes.

CREATE INDEX index_orders_pending
ON index_orders (placed_at)
WHERE status = 'pending';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at
FROM index_orders
WHERE status = 'pending'
ORDER BY placed_at DESC
LIMIT 10;

CREATE INDEX index_orders_day
ON index_orders (((placed_at AT TIME ZONE 'UTC')::date));

EXPLAIN (ANALYZE, BUFFERS)
SELECT count(*)
FROM index_orders
WHERE (placed_at AT TIME ZONE 'UTC')::date = date '2026-02-01';

EXPLAIN (ANALYZE, BUFFERS)
SELECT count(*)
FROM index_orders
WHERE placed_at::date = date '2026-02-01';

-- Page splits: the primary key with its keys inserted in random order.

CREATE TEMP TABLE random_keys (LIKE index_orders);
ALTER TABLE random_keys ADD PRIMARY KEY (order_id);
INSERT INTO random_keys
SELECT * FROM index_orders ORDER BY random();
SELECT pg_relation_size('index_orders_pkey') / 8192 AS in_order_pages,
       pg_relation_size('random_keys_pkey') / 8192 AS random_order_pages;

-- Deleted rows: a copy with two rows in three deleted, before and after
-- VACUUM and REINDEX.

CREATE TEMP TABLE thinned (LIKE index_orders);
ALTER TABLE thinned ADD PRIMARY KEY (order_id);
INSERT INTO thinned
SELECT * FROM index_orders ORDER BY order_id;
DELETE FROM thinned WHERE order_id % 3 <> 0;

SELECT count(*) AS rows_left,
       pg_relation_size('thinned_pkey') / 8192 AS index_pages
FROM thinned;

VACUUM thinned;

SELECT count(*) AS rows_left,
       pg_relation_size('thinned_pkey') / 8192 AS index_pages
FROM thinned;

REINDEX TABLE thinned;

SELECT count(*) AS rows_left,
       pg_relation_size('thinned_pkey') / 8192 AS index_pages
FROM thinned;

-- The leading column has no condition: only (customer_id, placed_at)
-- remains, as a unique index. Then the same window for one customer it
-- contains, the window with an index on placed_at, and the order the
-- unique index can and cannot supply.

DROP INDEX index_orders_cover;

CREATE UNIQUE INDEX index_orders_customer_time
ON index_orders (customer_id, placed_at);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND placed_at < timestamptz '2026-02-01 00:30:00+00';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE customer_id = 650
  AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND placed_at < timestamptz '2026-02-01 00:30:00+00';

CREATE INDEX index_orders_placed
ON index_orders (placed_at);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND placed_at < timestamptz '2026-02-01 00:30:00+00';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
ORDER BY customer_id, placed_at DESC
LIMIT 5;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
ORDER BY customer_id, placed_at;

-- The column wrapped in a function.

CREATE INDEX index_orders_email
ON index_orders (email);

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE email = 'Shopper0042@Example.com';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE lower(email) = 'shopper0042@example.com';

-- Finding unused indexes: scans per index so far. Counts can lag behind
-- the session that made them.

SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE relname = 'index_orders';

-- Indexing queries: the diagnosis cases. Start again from only a
-- customer index and a placed_at index.

DROP INDEX index_orders_pending, index_orders_day, index_orders_customer_time,
  index_orders_placed, index_orders_email;

CREATE INDEX index_orders_customer
ON index_orders (customer_id);
CREATE INDEX index_orders_placed
ON index_orders (placed_at);

ANALYZE index_orders;

-- The column has to stand alone.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE placed_at >= timestamptz '2026-02-01 00:00:00+00'
  AND placed_at < timestamptz '2026-02-02 00:00:00+00';

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id
FROM index_orders
WHERE date_trunc('day', placed_at) = timestamptz '2026-02-01 00:00:00+00';

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id = 42;

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id + 0 = 42;

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id::text = '42';

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id = 42::numeric;

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM index_orders
WHERE customer_id = 42::bigint;

-- A catch-all optional filter: a plan made for the value, then a plan
-- made for any value.

PREPARE orders_for(integer) AS
SELECT order_id
FROM index_orders
WHERE ($1 IS NULL OR customer_id = $1);

SET plan_cache_mode = force_custom_plan;

EXPLAIN (ANALYZE, BUFFERS)
EXECUTE orders_for(42);

SET plan_cache_mode = force_generic_plan;

EXPLAIN (ANALYZE, BUFFERS)
EXECUTE orders_for(42);

RESET plan_cache_mode;

-- ORDER BY with LIMIT: the planner walks the placed_at index. Then a
-- customer whose orders are all older than everyone else's, and the
-- composite index that removes the gamble.

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at
FROM index_orders
WHERE customer_id = 42
ORDER BY placed_at DESC
LIMIT 1;

INSERT INTO index_orders
SELECT 60000 + n, 1001,
  timestamptz '2025-12-01 00:00:00+00' + n * interval '1 hour',
  'paid', 10, 'shopper1001@example.com', ''
FROM generate_series(1, 60) AS series(n);
ANALYZE index_orders;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at
FROM index_orders
WHERE customer_id = 1001
ORDER BY placed_at DESC
LIMIT 1;

CREATE INDEX index_orders_customer_placed
ON index_orders (customer_id, placed_at);

ANALYZE index_orders;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at
FROM index_orders
WHERE customer_id = 42
ORDER BY placed_at DESC
LIMIT 1;

EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, placed_at
FROM index_orders
WHERE customer_id = 1001
ORDER BY placed_at DESC
LIMIT 1;

-- Statistics that no longer match the data: a separate pair of tables.
-- Autovacuum never processes temporary tables, so nothing refreshes the
-- statistics until ANALYZE runs.

CREATE TEMP TABLE events (
  event_id integer PRIMARY KEY,
  kind text NOT NULL,
  payload text NOT NULL
);
INSERT INTO events
SELECT n, 'done', repeat('x', 100) FROM generate_series(1, 50000) AS series(n);
CREATE INDEX events_kind ON events (kind);
CREATE TEMP TABLE deliveries (
  event_id integer PRIMARY KEY,
  address text NOT NULL
);
INSERT INTO deliveries
SELECT n, repeat('y', 40) FROM generate_series(1, 90000) AS series(n);
ANALYZE events;
ANALYZE deliveries;
INSERT INTO events
SELECT n, 'new', repeat('x', 100) FROM generate_series(50001, 90000) AS series(n);

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM events
WHERE kind = 'new';

EXPLAIN (ANALYZE, BUFFERS)
SELECT count(*)
FROM events JOIN deliveries USING (event_id)
WHERE events.kind = 'new';

ANALYZE events;

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM events
WHERE kind = 'new';

EXPLAIN (ANALYZE, BUFFERS)
SELECT count(*)
FROM events JOIN deliveries USING (event_id)
WHERE events.kind = 'new';

-- End the session to remove the temporary tables.
