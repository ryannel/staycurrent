-- Use the same owned disposable schema as fixture.sql.
-- October example. For full year use 2026-01-01 through 2027-01-01.
-- Per-order form
SELECT o.customer_id, SUM(v.order_value) AS line_value
FROM orders o
CROSS JOIN LATERAL (
  SELECT SUM(i.quantity * i.unit_price) AS order_value
  FROM order_items i
  WHERE i.order_id = o.order_id
  HAVING COUNT(*) > 0
) v
WHERE o.status = 'paid'
  AND o.placed_at >= '2026-10-01 00:00+00'::timestamptz
  AND o.placed_at < '2026-11-01 00:00+00'::timestamptz
  AND (NULL::integer IS NULL OR o.customer_id = NULL)
GROUP BY o.customer_id
ORDER BY line_value DESC, o.customer_id;

-- Direct form
SELECT o.customer_id, SUM(i.quantity * i.unit_price) AS line_value
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'paid'
  AND o.placed_at >= '2026-10-01 00:00+00'::timestamptz
  AND o.placed_at < '2026-11-01 00:00+00'::timestamptz
  AND (NULL::integer IS NULL OR o.customer_id = NULL)
GROUP BY o.customer_id
ORDER BY line_value DESC, o.customer_id;

-- Prefix either SELECT with EXPLAIN (ANALYZE, BUFFERS) to execute and profile it.
