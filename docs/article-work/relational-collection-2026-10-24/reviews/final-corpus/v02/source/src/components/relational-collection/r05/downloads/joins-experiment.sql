\set ON_ERROR_STOP on
BEGIN;
SET LOCAL TIME ZONE 'UTC';
CREATE TEMP TABLE customers(customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TEMP TABLE orders(order_id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES customers, placed_at timestamptz NOT NULL, status text NOT NULL);
CREATE TEMP TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text NOT NULL,quantity integer NOT NULL,unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TEMP TABLE payments(payment_id integer PRIMARY KEY,order_id integer NOT NULL REFERENCES orders,amount numeric(8,2) NOT NULL,method text NOT NULL);
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO orders VALUES (101,1,'2026-10-12T09:30:00Z','paid'),(102,2,'2026-10-14T16:05:00Z','paid'),(103,1,'2026-10-20T10:15:00Z','pending');
INSERT INTO order_items VALUES (101,1,'P3',1,'4.50'),(101,2,'P9',1,'35.00'),(102,1,'P7',2,'20.00'),(103,1,'P7',1,'20.00'),(103,2,'P3',2,'4.50');
INSERT INTO payments VALUES (501,101,'30.00','card'),(502,101,'9.50','gift card'),(503,102,'40.00','card');
\echo Article query 1
SELECT o.order_id, c.name
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
ORDER BY o.order_id;
\echo Article query 2
SELECT i.order_id,
       SUM(i.quantity * i.unit_price) AS order_total,
       SUM(p.amount) AS paid
FROM order_items AS i
JOIN payments AS p ON p.order_id = i.order_id
GROUP BY i.order_id
ORDER BY i.order_id;
CREATE TEMP VIEW wrong_report AS SELECT i.order_id,
       SUM(i.quantity * i.unit_price) AS order_total,
       SUM(p.amount) AS paid
FROM order_items AS i
JOIN payments AS p ON p.order_id = i.order_id
GROUP BY i.order_id
ORDER BY i.order_id;
\echo Article query 3
WITH line_totals AS (
  SELECT order_id, SUM(quantity * unit_price) AS order_total
  FROM order_items
  GROUP BY order_id
), payment_totals AS (
  SELECT order_id, SUM(amount) AS paid
  FROM payments
  GROUP BY order_id
)
SELECT o.order_id, c.name, l.order_total,
       COALESCE(p.paid, 0::numeric) AS paid,
       l.order_total - COALESCE(p.paid, 0::numeric) AS due
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
LEFT JOIN line_totals AS l ON l.order_id = o.order_id
LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
ORDER BY o.order_id;
CREATE TEMP VIEW report AS WITH line_totals AS (
  SELECT order_id, SUM(quantity * unit_price) AS order_total
  FROM order_items
  GROUP BY order_id
), payment_totals AS (
  SELECT order_id, SUM(amount) AS paid
  FROM payments
  GROUP BY order_id
)
SELECT o.order_id, c.name, l.order_total,
       COALESCE(p.paid, 0::numeric) AS paid,
       l.order_total - COALESCE(p.paid, 0::numeric) AS due
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
LEFT JOIN line_totals AS l ON l.order_id = o.order_id
LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
ORDER BY o.order_id;
\echo Article query 4
SELECT o.order_id, p.payment_id, p.amount
FROM orders AS o
LEFT JOIN payments AS p
  ON p.order_id = o.order_id AND p.method = 'card'
ORDER BY o.order_id, p.payment_id;
\echo Article query 5
SELECT c.customer_id, c.name
FROM customers AS c
WHERE EXISTS (
  SELECT 1
  FROM orders AS o
  WHERE o.customer_id = c.customer_id
)
ORDER BY c.customer_id;
\echo Article query 6
SELECT o.order_id
FROM orders AS o
WHERE NOT EXISTS (
  SELECT 1
  FROM payments AS p
  WHERE p.order_id = o.order_id
)
ORDER BY o.order_id;
DO $$
BEGIN
 IF (SELECT array_agg(order_id ORDER BY order_id) FROM report) <> ARRAY[101,102,103] THEN RAISE EXCEPTION 'lost order'; END IF;
 IF (SELECT sum(order_total) FROM report) <> 108.50 OR (SELECT sum(paid) FROM report) <> 79.50 OR (SELECT sum(due) FROM report) <> 29.00 THEN RAISE EXCEPTION 'wrong report totals'; END IF;
 IF (SELECT order_total FROM wrong_report WHERE order_id=101) <>79 OR EXISTS(SELECT FROM wrong_report WHERE order_id=103) THEN RAISE EXCEPTION 'counterexample failed'; END IF;
 IF (SELECT array_agg(order_id ORDER BY order_id) FROM orders o WHERE NOT EXISTS(SELECT FROM payments p WHERE p.order_id=o.order_id)) <> ARRAY[103] THEN RAISE EXCEPTION 'absence failed'; END IF;
 IF (SELECT array_agg(customer_id) FROM customers c WHERE NOT EXISTS(SELECT FROM orders o WHERE o.customer_id=c.customer_id)) <> ARRAY[3] THEN RAISE EXCEPTION 'customer absence failed'; END IF;
 IF EXISTS(SELECT FROM orders o WHERE o.order_id NOT IN (SELECT order_id FROM payments UNION ALL SELECT NULL::integer)) THEN RAISE EXCEPTION 'NOT IN null counterexample failed'; END IF;
 IF (SELECT SUM(DISTINCT amount) FROM (VALUES (1,10::numeric),(2,10::numeric)) v(id,amount)) <>10 THEN RAISE EXCEPTION 'distinct counterexample failed'; END IF;
END $$;
\echo Appending customer IDs with UNION ALL
SELECT customer_id FROM orders WHERE status = 'paid'
UNION ALL
SELECT customer_id FROM orders WHERE status = 'pending'
ORDER BY customer_id;
\echo The same projection with UNION
SELECT customer_id FROM orders WHERE status = 'paid'
UNION
SELECT customer_id FROM orders WHERE status = 'pending'
ORDER BY customer_id;
\echo Including order identity keeps all three distinct rows
SELECT customer_id, order_id FROM orders WHERE status = 'paid'
UNION
SELECT customer_id, order_id FROM orders WHERE status = 'pending'
ORDER BY customer_id, order_id;
DO $$ BEGIN
 IF (SELECT array_agg(customer_id ORDER BY customer_id) FROM (
  SELECT customer_id FROM orders WHERE status = 'paid'
  UNION ALL
  SELECT customer_id FROM orders WHERE status = 'pending'
 ) AS combined) IS DISTINCT FROM ARRAY[1,1,2] THEN RAISE EXCEPTION 'UNION ALL contributions'; END IF;
 IF (SELECT array_agg(customer_id ORDER BY customer_id) FROM (
  SELECT customer_id FROM orders WHERE status = 'paid'
  UNION
  SELECT customer_id FROM orders WHERE status = 'pending'
 ) AS combined) IS DISTINCT FROM ARRAY[1,2] THEN RAISE EXCEPTION 'UNION projected duplicates'; END IF;
 IF (SELECT array_agg(customer_id::text || ':' || order_id::text ORDER BY customer_id,order_id) FROM (
  SELECT customer_id,order_id FROM orders WHERE status = 'paid'
  UNION
  SELECT customer_id,order_id FROM orders WHERE status = 'pending'
 ) AS combined) IS DISTINCT FROM ARRAY['1:101','1:103','2:102'] THEN RAISE EXCEPTION 'UNION retained identities'; END IF;
END $$;
-- Synthetic edge case only, not an addition to the collection's shop history:
INSERT INTO orders VALUES(999,3,'2026-10-24 00:00Z','pending');
DO $$ BEGIN
 IF NOT EXISTS(SELECT FROM report WHERE order_id=999 AND order_total IS NULL AND due IS NULL AND paid=0) THEN RAISE EXCEPTION 'empty order policy'; END IF;
END $$;
\echo All join checks passed; rolling back temporary experiment.
ROLLBACK;
