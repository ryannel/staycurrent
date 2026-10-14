-- Run after the shared shop schema and query-results.sql in a practice database.
-- ANALYZE gathers planner statistics; EXPLAIN ANALYZE executes this SELECT.
ANALYZE products;
ANALYZE order_lines;

SELECT l.line_no, p.name,
       l.quantity * l.unit_price AS line_total
FROM order_lines AS l
JOIN products AS p ON p.product_id = l.product_id
WHERE l.order_id = 'O13'
ORDER BY l.line_no;

EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF)
SELECT l.line_no, p.name,
       l.quantity * l.unit_price AS line_total
FROM order_lines AS l
JOIN products AS p ON p.product_id = l.product_id
WHERE l.order_id = 'O13'
ORDER BY l.line_no;
