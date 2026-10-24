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
SELECT order_id,
       COUNT(*) AS lines,
       SUM(quantity * unit_price) AS order_total
FROM order_items
GROUP BY order_id
ORDER BY order_id;
CREATE TEMP TABLE result_0 AS SELECT order_id,
       COUNT(*) AS lines,
       SUM(quantity * unit_price) AS order_total
FROM order_items
GROUP BY order_id
ORDER BY order_id;
\echo Article query 2
WITH order_values AS (
  SELECT o.order_id, o.customer_id, o.placed_at,
         SUM(i.quantity * i.unit_price) AS order_total
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.order_id
  GROUP BY o.order_id, o.customer_id, o.placed_at
)
SELECT * FROM order_values ORDER BY order_id;
CREATE TEMP TABLE result_1 AS WITH order_values AS (
  SELECT o.order_id, o.customer_id, o.placed_at,
         SUM(i.quantity * i.unit_price) AS order_total
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.order_id
  GROUP BY o.order_id, o.customer_id, o.placed_at
)
SELECT * FROM order_values ORDER BY order_id;
\echo Article query 3
SELECT c.customer_id, c.name,
       COUNT(*) AS joined_rows,
       COUNT(o.order_id) AS orders
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
ORDER BY c.customer_id;
CREATE TEMP TABLE result_2 AS SELECT c.customer_id, c.name,
       COUNT(*) AS joined_rows,
       COUNT(o.order_id) AS orders
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
ORDER BY c.customer_id;
\echo Article query 4
WITH order_values AS (
  SELECT o.order_id, o.customer_id,
         SUM(i.quantity * i.unit_price) AS order_total
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.order_id
  GROUP BY o.order_id, o.customer_id
)
SELECT customer_id, SUM(order_total) AS customer_total
FROM order_values
GROUP BY customer_id
HAVING SUM(order_total) >= 50
ORDER BY customer_id;
CREATE TEMP TABLE result_3 AS WITH order_values AS (
  SELECT o.order_id, o.customer_id,
         SUM(i.quantity * i.unit_price) AS order_total
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.order_id
  GROUP BY o.order_id, o.customer_id
)
SELECT customer_id, SUM(order_total) AS customer_total
FROM order_values
GROUP BY customer_id
HAVING SUM(order_total) >= 50
ORDER BY customer_id;
\echo Article query 5
WITH order_values AS (
  SELECT o.order_id, o.customer_id,
         SUM(i.quantity * i.unit_price) AS order_total
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.order_id
  GROUP BY o.order_id, o.customer_id
)
SELECT order_id, customer_id, order_total,
       SUM(order_total) OVER (PARTITION BY customer_id)
         AS customer_total
FROM order_values
ORDER BY order_id;
CREATE TEMP TABLE result_4 AS WITH order_values AS (
  SELECT o.order_id, o.customer_id,
         SUM(i.quantity * i.unit_price) AS order_total
  FROM orders AS o
  JOIN order_items AS i ON i.order_id = o.order_id
  GROUP BY o.order_id, o.customer_id
)
SELECT order_id, customer_id, order_total,
       SUM(order_total) OVER (PARTITION BY customer_id)
         AS customer_total
FROM order_values
ORDER BY order_id;
\echo Article query 6
SELECT order_id, customer_id, placed_at,
       LAG(placed_at) OVER (
         PARTITION BY customer_id
         ORDER BY placed_at, order_id
       ) AS previous_order_at
FROM orders
ORDER BY customer_id, placed_at, order_id;
CREATE TEMP TABLE result_5 AS SELECT order_id, customer_id, placed_at,
       LAG(placed_at) OVER (
         PARTITION BY customer_id
         ORDER BY placed_at, order_id
       ) AS previous_order_at
FROM orders
ORDER BY customer_id, placed_at, order_id;
-- Later tie illustration; no line or amount assumptions.
INSERT INTO orders VALUES(105,1,'2026-10-21 12:00Z','pending'),(106,3,'2026-10-21 12:00Z','pending');
\echo Article query 7
SELECT order_id, placed_at,
       COUNT(*) OVER (ORDER BY placed_at) AS through_peers,
       COUNT(*) OVER (
         ORDER BY placed_at, order_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS through_row
FROM orders
ORDER BY placed_at, order_id;
CREATE TEMP TABLE result_6 AS SELECT order_id, placed_at,
       COUNT(*) OVER (ORDER BY placed_at) AS through_peers,
       COUNT(*) OVER (
         ORDER BY placed_at, order_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS through_row
FROM orders
ORDER BY placed_at, order_id;
\echo Article query 8
WITH numbered AS (
  SELECT order_id, customer_id, placed_at,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY placed_at DESC, order_id DESC
         ) AS position
  FROM orders
)
SELECT order_id, customer_id, placed_at
FROM numbered
WHERE position = 1
ORDER BY customer_id;
CREATE TEMP TABLE result_7 AS WITH numbered AS (
  SELECT order_id, customer_id, placed_at,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY placed_at DESC, order_id DESC
         ) AS position
  FROM orders
)
SELECT order_id, customer_id, placed_at
FROM numbered
WHERE position = 1
ORDER BY customer_id;
DO $$ BEGIN
 IF (SELECT sum(order_total) FROM result_0)<>108.50 OR (SELECT sum(lines) FROM result_0)<>5 THEN RAISE EXCEPTION 'group total'; END IF;
 IF (SELECT orders FROM result_2 WHERE customer_id=3)<>0 OR (SELECT joined_rows FROM result_2 WHERE customer_id=3)<>1 THEN RAISE EXCEPTION 'left join count'; END IF;
 IF (SELECT customer_total FROM result_3 WHERE customer_id=1)<>68.50 THEN RAISE EXCEPTION 'having'; END IF;
 IF EXISTS(SELECT FROM result_4 WHERE customer_id=1 AND customer_total<>68.50) THEN RAISE EXCEPTION 'window'; END IF;
 IF (SELECT previous_order_at FROM result_5 WHERE order_id=103)<>'2026-10-12 09:30Z'::timestamptz THEN RAISE EXCEPTION 'lag'; END IF;
 IF (SELECT array_agg(through_peers ORDER BY placed_at,order_id) FROM result_6)<>ARRAY[1,2,3,5,5]::bigint[] THEN RAISE EXCEPTION 'peers'; END IF;
 IF (SELECT array_agg(through_row ORDER BY placed_at,order_id) FROM result_6)<>ARRAY[1,2,3,4,5]::bigint[] THEN RAISE EXCEPTION 'rows'; END IF;
 IF (SELECT array_agg(order_id ORDER BY customer_id) FROM result_7)<>ARRAY[105,102,106] THEN RAISE EXCEPTION 'latest'; END IF;
END $$;
-- The first six displayed queries were printed before adding 105/106.
-- Each result table captures that exact article query at its stated input stage.
SELECT round(avg(order_total),2) AS mean_order FROM result_0;
SELECT avg(quantity*unit_price) AS mean_line FROM order_items;
SELECT count(*) FILTER(WHERE status='pending') AS pending_core FROM orders WHERE order_id<=103;
SELECT order_id, count(*) OVER () AS whole_partition,
 last_value(order_id) OVER(ORDER BY placed_at,order_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS final_id
FROM orders ORDER BY placed_at,order_id;
CREATE TEMP VIEW score_ranks AS
 SELECT score, rank() OVER(ORDER BY score DESC) AS r, dense_rank() OVER(ORDER BY score DESC) AS d
 FROM (VALUES(40),(30),(30),(20)) scores(score);
TABLE score_ranks;
DO $$ BEGIN
 IF (SELECT r FROM score_ranks WHERE score=20)<>4 OR (SELECT d FROM score_ranks WHERE score=20)<>3 THEN RAISE EXCEPTION 'ranks'; END IF;
 IF (SELECT round(avg(order_total),2) FROM result_0)<>36.17 THEN RAISE EXCEPTION 'order average'; END IF;
 IF (SELECT avg(quantity*unit_price) FROM order_items)<>21.70 THEN RAISE EXCEPTION 'line average'; END IF;
END $$;
-- Filtering before/after the window separates two legitimate questions:
WITH values_per_order AS(SELECT * FROM result_4),
 filtered_first AS(SELECT order_total, sum(order_total) OVER() AS total FROM values_per_order WHERE order_id=103)
 SELECT * FROM filtered_first;
-- A bounded ROWS frame counts orders; a timestamp RANGE counts an interval:
SELECT order_id,
 count(*) OVER(ORDER BY placed_at,order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS three_orders,
 count(*) OVER(ORDER BY placed_at RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW) AS seven_days
FROM orders ORDER BY placed_at,order_id;
\echo All aggregate/window checks passed; rolling back temporary experiment.
ROLLBACK;
