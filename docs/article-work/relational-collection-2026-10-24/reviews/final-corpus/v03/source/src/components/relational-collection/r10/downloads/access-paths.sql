\set ON_ERROR_STOP on
SET timezone = 'UTC';
CREATE TEMP TABLE access_orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL,
  placed_at timestamptz NOT NULL,
  status text NOT NULL,
  note text NOT NULL
);
INSERT INTO access_orders
SELECT g, 1 + ((g - 1) % 1000),
       timestamptz '2026-01-01 00:00:00+00' + (g - 1) * interval '1 minute',
       CASE WHEN g % 5 = 0 THEN 'pending' ELSE 'paid' END,
       repeat('x', 80)
FROM generate_series(1,60000) g;
ANALYZE access_orders;
CREATE TEMP TABLE expected_answer AS
SELECT order_id, placed_at, status FROM access_orders
WHERE customer_id=42 AND placed_at>=timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC,order_id DESC LIMIT 10;
CREATE FUNCTION pg_temp.check_answer() RETURNS void LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS ((TABLE expected_answer EXCEPT ALL
   (SELECT order_id,placed_at,status FROM access_orders WHERE customer_id=42
    AND placed_at>=timestamptz '2026-02-01 00:00:00+00'
    ORDER BY placed_at DESC,order_id DESC LIMIT 10))
 UNION ALL
 ((SELECT order_id,placed_at,status FROM access_orders WHERE customer_id=42
    AND placed_at>=timestamptz '2026-02-01 00:00:00+00'
    ORDER BY placed_at DESC,order_id DESC LIMIT 10) EXCEPT ALL TABLE expected_answer))
 THEN RAISE EXCEPTION 'Answer changed'; END IF;
END $$;
\echo No customer index
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, status FROM access_orders
WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 10;
SELECT pg_temp.check_answer();
CREATE INDEX access_customer ON access_orders(customer_id);
\echo Customer index
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, status FROM access_orders
WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 10;
SELECT pg_temp.check_answer();
DROP INDEX access_customer;
CREATE INDEX access_history ON access_orders(customer_id, placed_at DESC, order_id DESC);
\echo Composite index
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, status FROM access_orders
WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 10;
SELECT pg_temp.check_answer();
DROP INDEX access_history;
CREATE INDEX access_cover ON access_orders(customer_id, placed_at DESC, order_id DESC) INCLUDE(status);
VACUUM access_orders;
\echo Covering index after vacuum
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id, placed_at, status FROM access_orders
WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 10;
SELECT pg_temp.check_answer();
\echo Result identities: compare across all four routes
SELECT order_id, placed_at, status FROM access_orders
WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 10;
SELECT pg_temp.check_answer();
\echo Physical sizes: bytes, not timing
SELECT pg_relation_size('access_orders') AS table_bytes, pg_relation_size('access_cover') AS index_bytes;
