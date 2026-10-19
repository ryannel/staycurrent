-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE orders (
  tenant_id text NOT NULL, order_id text NOT NULL,
  customer_id integer NOT NULL, placed_at timestamptz NOT NULL,
  total numeric(10,2) NOT NULL, status text NOT NULL,
  PRIMARY KEY (tenant_id, order_id)
);
INSERT INTO orders VALUES
 ('t4','o81',42,'2026-10-19 09:00+00',40,'paid'),
 ('t4','o82',42,'2026-10-19 09:00+00',20,'pending'),
 ('t4','o83',43,'2026-10-19 10:00+00',30,'paid'),
 ('t4','o84',43,'2026-10-20 09:00+00',10,'paid');
SELECT (placed_at AT TIME ZONE 'UTC')::date AS day,
       count(*) AS orders, sum(total) AS revenue
FROM orders WHERE tenant_id = 't4'
GROUP BY (placed_at AT TIME ZONE 'UTC')::date
ORDER BY day;


SELECT customer_id,
       count(*) AS all_orders,
       count(*) FILTER (WHERE status = 'paid') AS paid_orders,
       sum(total) FILTER (WHERE status = 'paid') AS paid_total
FROM orders WHERE tenant_id = 't4'
GROUP BY customer_id ORDER BY customer_id;


SELECT order_id, customer_id, total,
       sum(total) OVER (PARTITION BY tenant_id, customer_id) AS customer_total
FROM orders WHERE tenant_id = 't4'
ORDER BY order_id;


SELECT order_id, total,
       sum(total) OVER (ORDER BY placed_at) AS through_timestamp,
       sum(total) OVER (
         ORDER BY placed_at, order_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS through_order
FROM orders WHERE tenant_id = 't4'
ORDER BY placed_at, order_id;
