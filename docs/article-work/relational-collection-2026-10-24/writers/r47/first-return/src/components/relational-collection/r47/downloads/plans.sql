-- CockroachDB25.4.17. New disposable database only.
-- Generated fixture, not additional shop purchase history. No random seed.
CREATE TABLE perf_orders (
 order_id INT PRIMARY KEY, customer_id INT NOT NULL,
 placed_at TIMESTAMPTZ NOT NULL, status STRING NOT NULL,
 payload STRING NOT NULL
);
INSERT INTO perf_orders
SELECT i, (i % 1000)+1,
 timestamptz '2026-01-01 00:00:00+00' + i * interval '1 minute',
 CASE WHEN i % 5=0 THEN 'pending' ELSE 'paid' END,
 repeat('x',200)
FROM generate_series(1,60000) AS g(i);
CREATE INDEX perf_customer ON perf_orders (customer_id);
CREATE INDEX perf_history ON perf_orders
 (customer_id, placed_at DESC, order_id DESC);
CREATE INDEX perf_cover ON perf_orders
 (customer_id, placed_at DESC, order_id DESC) STORING (status);
CREATE STATISTICS perf_stats FROM perf_orders;
-- Hints isolate access paths for comparison, not a production recommendation.
EXPLAIN ANALYZE
SELECT order_id,placed_at,status FROM perf_orders@perf_customer
WHERE customer_id=42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC,order_id DESC LIMIT 10;
EXPLAIN ANALYZE
SELECT order_id,placed_at,status FROM perf_orders@perf_history
WHERE customer_id=42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC,order_id DESC LIMIT 10;
EXPLAIN ANALYZE
SELECT order_id,placed_at,status FROM perf_orders@perf_cover
WHERE customer_id=42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC,order_id DESC LIMIT 10;
-- Inspect the optimiser's choice without a forced index too.
EXPLAIN ANALYZE
SELECT order_id,placed_at,status FROM perf_orders
WHERE customer_id=42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC,order_id DESC LIMIT 10;
CREATE INDEX perf_time_hash ON perf_orders (placed_at)
USING HASH WITH (bucket_count=4);
SHOW CREATE TABLE perf_orders;
EXPLAIN SELECT order_id,placed_at FROM perf_orders@perf_time_hash
WHERE placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC,order_id DESC LIMIT 10;
