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
