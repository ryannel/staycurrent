-- PostgreSQL 18. Temporary shop tables for this session only.
-- Changes, including the scenario changes, are rolled back at the end.
BEGIN;
CREATE TEMP TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TEMP TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK (price >= 0), stock integer NOT NULL CHECK (stock >= 0));
CREATE TEMP TABLE orders (order_id integer PRIMARY KEY,
 customer_id integer NOT NULL REFERENCES customers,
 placed_at timestamptz NOT NULL,
 status text NOT NULL CHECK (status IN ('pending','paid','cancelled')));
CREATE TEMP TABLE order_items (order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products,
 quantity integer NOT NULL CHECK (quantity > 0), unit_price numeric(8,2) NOT NULL,
 PRIMARY KEY (order_id,line_no));
CREATE TEMP TABLE payments (payment_id integer PRIMARY KEY,
 order_id integer NOT NULL REFERENCES orders,
 amount numeric(8,2) NOT NULL CHECK (amount > 0), method text NOT NULL);
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES (101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
INSERT INTO payments VALUES (501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');

-- allBalances
WITH line_totals AS (
  SELECT order_id,
         SUM(quantity * unit_price) AS line_total
  FROM order_items
  GROUP BY order_id
), payment_totals AS (
  SELECT order_id, SUM(amount) AS paid_total
  FROM payments
  GROUP BY order_id
), balances AS (
  SELECT o.order_id,
         COALESCE(l.line_total, 0) AS line_total,
         COALESCE(p.paid_total, 0) AS paid_total,
         COALESCE(l.line_total, 0)
           - COALESCE(p.paid_total, 0) AS due
  FROM orders AS o
  LEFT JOIN line_totals AS l ON l.order_id = o.order_id
  LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
)
SELECT order_id, line_total, paid_total, due
FROM balances
ORDER BY order_id;

-- badTotals
SELECT o.order_id,
       SUM(i.quantity * i.unit_price) AS line_total,
       SUM(p.amount) AS paid_total
FROM orders AS o
INNER JOIN order_items AS i ON i.order_id = o.order_id
LEFT JOIN payments AS p ON p.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.order_id;

-- customerJoin
SELECT o.order_id, c.name
FROM orders AS o
INNER JOIN customers AS c
  ON c.customer_id = o.customer_id
ORDER BY o.order_id;

-- except
SELECT customer_id FROM orders WHERE status = 'paid'
EXCEPT
SELECT customer_id FROM orders WHERE status = 'pending'
ORDER BY customer_id;

-- existsOrders
SELECT c.customer_id, c.name
FROM customers AS c
WHERE EXISTS (
  SELECT 1 FROM orders AS o
  WHERE o.customer_id = c.customer_id
)
ORDER BY c.customer_id;

-- intersect
SELECT customer_id FROM orders WHERE status = 'paid'
INTERSECT
SELECT customer_id FROM orders WHERE status = 'pending'
ORDER BY customer_id;

-- leftJoin
SELECT o.order_id, p.payment_id, p.amount, p.method
FROM orders AS o
LEFT JOIN payments AS p
  ON p.order_id = o.order_id
ORDER BY o.order_id, p.payment_id;

-- lineJoin
SELECT o.order_id, i.line_no, i.product_id,
       i.quantity, i.unit_price
FROM orders AS o
INNER JOIN order_items AS i
  ON i.order_id = o.order_id
ORDER BY o.order_id, i.line_no;

-- lineTotals
SELECT order_id,
       SUM(quantity * unit_price) AS line_total
FROM order_items
GROUP BY order_id
ORDER BY order_id;

-- noOrders
SELECT c.customer_id, c.name
FROM customers AS c
WHERE NOT EXISTS (
  SELECT 1 FROM orders AS o
  WHERE o.customer_id = c.customer_id
)
ORDER BY c.customer_id;

-- noPayments
SELECT o.order_id
FROM orders AS o
WHERE NOT EXISTS (
  SELECT 1 FROM payments AS p
  WHERE p.order_id = o.order_id
)
ORDER BY o.order_id;

-- onCard
SELECT o.order_id, p.payment_id, p.amount, p.method
FROM orders AS o
LEFT JOIN payments AS p
  ON p.order_id = o.order_id
 AND p.method = 'card'
ORDER BY o.order_id, p.payment_id;

-- rawJoin
SELECT o.order_id, i.line_no, p.payment_id,
       i.quantity * i.unit_price AS line_value,
       p.amount
FROM orders AS o
INNER JOIN order_items AS i ON i.order_id = o.order_id
INNER JOIN payments AS p ON p.order_id = o.order_id
WHERE o.order_id = 101
ORDER BY i.line_no, p.payment_id;

-- report
WITH line_totals AS (
  SELECT order_id,
         SUM(quantity * unit_price) AS line_total
  FROM order_items
  GROUP BY order_id
), payment_totals AS (
  SELECT order_id, SUM(amount) AS paid_total
  FROM payments
  GROUP BY order_id
), balances AS (
  SELECT o.order_id,
         COALESCE(l.line_total, 0) AS line_total,
         COALESCE(p.paid_total, 0) AS paid_total,
         COALESCE(l.line_total, 0)
           - COALESCE(p.paid_total, 0) AS due
  FROM orders AS o
  LEFT JOIN line_totals AS l ON l.order_id = o.order_id
  LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
)
SELECT order_id, line_total, paid_total, due
FROM balances
WHERE due > 0
ORDER BY order_id;

-- union
SELECT customer_id FROM orders WHERE status = 'paid'
UNION
SELECT customer_id FROM orders WHERE status = 'pending'
ORDER BY customer_id;

-- unionAll
SELECT customer_id FROM orders WHERE status = 'paid'
UNION ALL
SELECT customer_id FROM orders WHERE status = 'pending'
ORDER BY customer_id;

-- whereCard
SELECT o.order_id, p.payment_id, p.amount, p.method
FROM orders AS o
LEFT JOIN payments AS p
  ON p.order_id = o.order_id
WHERE p.method = 'card'
ORDER BY o.order_id, p.payment_id;

-- Equal-valued lines scenario: the two occurrences still total 40.00.
SAVEPOINT equal_lines;
UPDATE order_items SET quantity = 1 WHERE order_id = 102 AND line_no = 1;
INSERT INTO order_items VALUES (102,2,'P7',1,20.00);
SELECT order_id, SUM(quantity * unit_price) AS correct_total,
 SUM(DISTINCT quantity * unit_price) AS wrong_distinct_total
FROM order_items WHERE order_id = 102 GROUP BY order_id;
ROLLBACK TO equal_lines;
-- Partial payment scenario: noPayments now returns no rows; report returns 19.00 due.
SAVEPOINT partial_payment;
INSERT INTO payments VALUES (504,103,10.00,'card');
SELECT o.order_id
FROM orders AS o
WHERE NOT EXISTS (
  SELECT 1 FROM payments AS p
  WHERE p.order_id = o.order_id
)
ORDER BY o.order_id;
WITH line_totals AS (
  SELECT order_id,
         SUM(quantity * unit_price) AS line_total
  FROM order_items
  GROUP BY order_id
), payment_totals AS (
  SELECT order_id, SUM(amount) AS paid_total
  FROM payments
  GROUP BY order_id
), balances AS (
  SELECT o.order_id,
         COALESCE(l.line_total, 0) AS line_total,
         COALESCE(p.paid_total, 0) AS paid_total,
         COALESCE(l.line_total, 0)
           - COALESCE(p.paid_total, 0) AS due
  FROM orders AS o
  LEFT JOIN line_totals AS l ON l.order_id = o.order_id
  LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
)
SELECT order_id, line_total, paid_total, due
FROM balances
WHERE due > 0
ORDER BY order_id;
ROLLBACK TO partial_payment;
ROLLBACK;
