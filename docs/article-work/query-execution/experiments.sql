-- PostgreSQL 18. Run execution-setup.sql once in a new empty practice database first.
-- Keep one SQL-editor or psql connection for these examples.
-- All measured statements below are SELECTs. EXPLAIN ANALYZE executes its statement.
-- Repeat from a fresh setup to reproduce the before/after statistics comparison.

-- One customer: result and natural plan.
SELECT l.product_id, sum(l.quantity) AS units
FROM orders AS o
JOIN order_lines AS l ON l.order_id = o.order_id
WHERE o.customer_id = 42
GROUP BY l.product_id
ORDER BY units DESC, l.product_id;
EXPLAIN (ANALYZE, TIMING OFF, BUFFERS OFF, SUMMARY OFF)
SELECT l.product_id, sum(l.quantity) AS units
FROM orders AS o
JOIN order_lines AS l ON l.order_id = o.order_id
WHERE o.customer_id = 42
GROUP BY l.product_id
ORDER BY units DESC, l.product_id;

-- All customers: change only the filter.
SELECT l.product_id, sum(l.quantity) AS units
FROM orders AS o
JOIN order_lines AS l ON l.order_id = o.order_id
WHERE o.customer_id <= 1000
GROUP BY l.product_id
ORDER BY units DESC, l.product_id;
EXPLAIN (ANALYZE, TIMING OFF, BUFFERS OFF, SUMMARY OFF)
SELECT l.product_id, sum(l.quantity) AS units
FROM orders AS o
JOIN order_lines AS l ON l.order_id = o.order_id
WHERE o.customer_id <= 1000
GROUP BY l.product_id
ORDER BY units DESC, l.product_id;

-- Forced diagnostic alternative. ROLLBACK restores the local settings.
BEGIN;
SET LOCAL enable_hashjoin = off;
SET LOCAL enable_nestloop = off;
EXPLAIN (ANALYZE, TIMING OFF, BUFFERS OFF, SUMMARY OFF)
SELECT l.product_id, sum(l.quantity) AS units
FROM orders AS o
JOIN order_lines AS l ON l.order_id = o.order_id
WHERE o.customer_id <= 1000
GROUP BY l.product_id
ORDER BY units DESC, l.product_id;
ROLLBACK;

-- A correlated-predicate estimate before and after dependency statistics.
EXPLAIN (ANALYZE, TIMING OFF, BUFFERS OFF, SUMMARY OFF)
SELECT order_id
FROM orders
WHERE customer_id = 42 AND sales_region = 'north';
CREATE STATISTICS orders_customer_region (dependencies)
ON customer_id, sales_region FROM orders;
ANALYZE orders;
EXPLAIN (ANALYZE, TIMING OFF, BUFFERS OFF, SUMMARY OFF)
SELECT order_id
FROM orders
WHERE customer_id = 42 AND sales_region = 'north';

-- Observe a sort spill with deliberately restricted memory.
BEGIN;
SET LOCAL work_mem = '64kB';
EXPLAIN (ANALYZE, TIMING OFF, SUMMARY OFF)
SELECT order_id, product_id
FROM order_lines
ORDER BY product_id, order_id;
ROLLBACK;
