DROP VIEW IF EXISTS january_follow_up; DROP TABLE IF EXISTS categories;
-- Run only in a fresh disposable PostgreSQL database.
DROP TABLE IF EXISTS payments, order_lines, orders, customers;
SET TIME ZONE 'UTC';
CREATE TABLE customers (
  customer_id integer PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  placed_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'cancelled')),
  shipped_at timestamptz
);
CREATE TABLE order_lines (
  order_id integer REFERENCES orders,
  line_no integer,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  PRIMARY KEY (order_id, line_no)
);
CREATE TABLE payments (
  payment_id integer PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders,
  amount numeric(10,2) NOT NULL CHECK (amount > 0)
);
INSERT INTO customers VALUES (1, 'Mina'), (2, 'Tariq'), (3, 'Edda');
INSERT INTO orders VALUES
 (100, 1, '2026-01-01 00:00:00+00', 'open', NULL),
 (101, 1, '2026-01-10 09:00:00+00', 'open', NULL),
 (102, 1, '2026-01-10 09:00:00+00', 'open', '2026-01-12 10:00:00+00'),
 (103, 2, '2026-01-31 23:59:59+00', 'open', NULL),
 (104, 2, '2026-02-01 00:00:00+00', 'open', NULL),
 (105, 3, '2026-01-20 12:00:00+00', 'cancelled', NULL),
 (106, 3, '2026-01-22 12:00:00+00', 'open', NULL);
INSERT INTO order_lines VALUES
 (100, 1, 10), (101, 1, 20), (101, 2, 10),
 (102, 1, 20), (103, 1, 40), (104, 1, 50), (105, 1, 60);
INSERT INTO payments VALUES
 (200, 100, 10), (201, 101, 10), (202, 101, 5), (203, 103, 40);
CREATE TABLE categories (
  category_id integer PRIMARY KEY,
  parent_id integer REFERENCES categories,
  name text NOT NULL
);
INSERT INTO categories VALUES
 (1, NULL, 'Shop'), (2, 1, 'Kitchen'), (3, 1, 'Garden'),
 (4, 2, 'Cups'), (5, 4, 'Travel cups');

SELECT version(); SHOW TimeZone; SHOW default_transaction_isolation; SHOW statement_timeout;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT o.order_id,
       (SELECT SUM(p.amount) FROM payments AS p
        WHERE p.order_id = o.order_id) AS paid,
       EXISTS (SELECT 1 FROM payments AS p
               WHERE p.order_id = o.order_id) AS has_payment
FROM orders AS o
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT o.order_id,
       (SELECT SUM(p.amount) FROM payments AS p) AS paid,
       EXISTS (SELECT 1 FROM payments AS p) AS has_payment
FROM orders AS o
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT o.order_id, r.paid
FROM orders AS o
LEFT JOIN (
  SELECT p.order_id, SUM(p.amount) AS paid
  FROM payments AS p GROUP BY p.order_id
) AS r ON r.order_id = o.order_id
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT o.order_id, p.amount
FROM orders AS o
JOIN payments AS p ON p.order_id = o.order_id
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id, p.payment_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT o.order_id,(SELECT p.amount FROM payments AS p WHERE p.order_id=o.order_id) AS receipt FROM orders AS o WHERE o.order_id=100) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT o.order_id,(SELECT p.amount FROM payments AS p WHERE p.order_id=o.order_id) AS receipt FROM orders AS o WHERE o.order_id=102) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT (SELECT v FROM (VALUES (NULL::numeric)) AS x(v)) AS receipt) AS r;

DO $$ BEGIN
 BEGIN PERFORM (SELECT p.amount FROM payments AS p WHERE p.order_id=101);
 RAISE EXCEPTION 'expected cardinality violation';
 EXCEPTION WHEN cardinality_violation THEN RAISE NOTICE 'EXPECTED SQLSTATE %: %',SQLSTATE,SQLERRM; END;
END $$;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH candidates (customer_id) AS (VALUES (1), (2), (NULL::integer)),
blocked (customer_id) AS (VALUES (1), (1), (NULL::integer))
SELECT c.customer_id,
       c.customer_id IN (SELECT b.customer_id FROM blocked AS b) AS included,
       c.customer_id NOT IN (SELECT b.customer_id FROM blocked AS b) AS excluded,
       EXISTS (SELECT 1 FROM blocked AS b
               WHERE b.customer_id = c.customer_id) AS present,
       NOT EXISTS (SELECT 1 FROM blocked AS b
                   WHERE b.customer_id = c.customer_id) AS absent
FROM candidates AS c
ORDER BY c.customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH candidates (customer_id) AS (VALUES (1), (2), (NULL::integer)),
blocked (customer_id) AS (VALUES (1), (1))
SELECT c.customer_id,
       c.customer_id IN (SELECT b.customer_id FROM blocked AS b) AS included,
       c.customer_id NOT IN (SELECT b.customer_id FROM blocked AS b) AS excluded,
       EXISTS (SELECT 1 FROM blocked AS b
               WHERE b.customer_id = c.customer_id) AS present,
       NOT EXISTS (SELECT 1 FROM blocked AS b
                   WHERE b.customer_id = c.customer_id) AS absent
FROM candidates AS c
ORDER BY c.customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH candidates (customer_id) AS (VALUES (1), (2), (NULL::integer)),
blocked (customer_id) AS (SELECT NULL::integer WHERE false)
SELECT c.customer_id,
       c.customer_id IN (SELECT b.customer_id FROM blocked AS b) AS included,
       c.customer_id NOT IN (SELECT b.customer_id FROM blocked AS b) AS excluded,
       EXISTS (SELECT 1 FROM blocked AS b
               WHERE b.customer_id = c.customer_id) AS present,
       NOT EXISTS (SELECT 1 FROM blocked AS b
                   WHERE b.customer_id = c.customer_id) AS absent
FROM candidates AS c
ORDER BY c.customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH candidates (customer_id) AS (VALUES (1), (2), (NULL::integer)),
blocked (customer_id) AS (VALUES (1), (1), (NULL::integer))
SELECT c.customer_id,
       c.customer_id IN (SELECT b.customer_id FROM blocked AS b) AS included,
       c.customer_id NOT IN (SELECT b.customer_id FROM blocked AS b) AS excluded,
       EXISTS (SELECT 1 FROM blocked AS b
               WHERE b.customer_id IS NOT DISTINCT FROM c.customer_id) AS present,
       NOT EXISTS (SELECT 1 FROM blocked AS b
                   WHERE b.customer_id IS NOT DISTINCT FROM c.customer_id) AS absent
FROM candidates AS c
ORDER BY c.customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH candidates (customer_id) AS (VALUES (1), (2), (NULL::integer)),
blocked (customer_id) AS (VALUES (1), (1), (NULL::integer))
SELECT c.customer_id FROM candidates AS c
WHERE c.customer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM blocked AS b
    WHERE b.customer_id = c.customer_id
  )
ORDER BY c.customer_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer))
SELECT customer_id FROM a
UNION
SELECT customer_id FROM b
ORDER BY customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer))
SELECT customer_id FROM a
UNION ALL
SELECT customer_id FROM b
ORDER BY customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer))
SELECT customer_id FROM a
INTERSECT
SELECT customer_id FROM b
ORDER BY customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer))
SELECT customer_id FROM a
INTERSECT ALL
SELECT customer_id FROM b
ORDER BY customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer))
SELECT customer_id FROM a
EXCEPT
SELECT customer_id FROM b
ORDER BY customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer))
SELECT customer_id FROM a
EXCEPT ALL
SELECT customer_id FROM b
ORDER BY customer_id NULLS LAST) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH follow_up (customer_id) AS (
  SELECT o.customer_id FROM orders AS o
  WHERE o.order_id IN (101, 102, 106)
), paid_customers (customer_id) AS (
  SELECT o.customer_id FROM orders AS o
  JOIN payments AS p ON p.order_id = o.order_id
)
SELECT customer_id FROM follow_up
UNION
SELECT customer_id FROM paid_customers
ORDER BY customer_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT o.order_id,
       (SELECT c.name FROM customers AS c
        WHERE c.customer_id = o.customer_id) AS name
FROM orders AS o
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM ((SELECT o.customer_id FROM orders AS o
 ORDER BY o.placed_at DESC, o.order_id DESC LIMIT 2)
UNION
SELECT c.customer_id FROM customers AS c WHERE c.customer_id = 3
ORDER BY customer_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer)), c(customer_id) AS (VALUES (3))
(SELECT customer_id FROM a UNION SELECT customer_id FROM b)
EXCEPT
SELECT customer_id FROM c
ORDER BY customer_id) AS r;

CREATE VIEW january_follow_up
  (order_id, customer_id, placed_at, due, has_payment) AS
WITH line_totals AS (
  SELECT order_id, SUM(amount) AS order_value
  FROM order_lines
  GROUP BY order_id
),
payment_totals AS (
  SELECT order_id, SUM(amount) AS paid
  FROM payments
  GROUP BY order_id
),
balances AS (
  SELECT o.order_id, o.customer_id, o.placed_at,
         l.order_value - COALESCE(p.paid, 0) AS due,
         EXISTS (
           SELECT 1 FROM payments AS receipt
           WHERE receipt.order_id = o.order_id
         ) AS has_payment
  FROM orders AS o
  LEFT JOIN line_totals AS l ON l.order_id = o.order_id
  LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
  WHERE o.status = 'open'
    AND o.placed_at >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
    AND o.placed_at <  TIMESTAMPTZ '2026-02-01 00:00:00+00'
)
SELECT b.order_id, b.customer_id, b.placed_at, b.due, b.has_payment
FROM balances AS b
WHERE b.due > 0 OR b.due IS NULL;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT f.order_id, c.name, f.due, f.has_payment
FROM january_follow_up AS f
JOIN customers AS c ON c.customer_id = f.customer_id
ORDER BY f.placed_at, f.order_id) AS r;

SELECT pg_typeof(order_id),pg_typeof(customer_id),pg_typeof(placed_at),pg_typeof(due),pg_typeof(has_payment) FROM january_follow_up LIMIT 1;

BEGIN; INSERT INTO payments VALUES (204,101,5); SELECT due FROM january_follow_up WHERE order_id=101; ROLLBACK;

SELECT COALESCE(json_agg(r), '[]') FROM (SELECT f.order_id, c.name, f.due, f.has_payment
FROM january_follow_up AS f
JOIN customers AS c ON c.customer_id = f.customer_id
ORDER BY f.placed_at, f.order_id) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH RECURSIVE walk (category_id, name, depth, path) AS (
  SELECT c.category_id, c.name, 0, ARRAY[c.category_id]
  FROM categories AS c WHERE c.category_id = 1
  UNION ALL
  SELECT c.category_id, c.name, w.depth + 1,
         w.path || c.category_id
  FROM walk AS w
  JOIN categories AS c ON c.parent_id = w.category_id
  WHERE NOT (c.category_id = ANY(w.path))
    AND w.depth < 3
)
SELECT w.category_id, w.name, w.depth, w.path,
       (w.depth = 3 AND EXISTS (
         SELECT 1 FROM categories AS c
         WHERE c.parent_id = w.category_id
           AND NOT (c.category_id = ANY(w.path))
       )) AS truncated
FROM walk AS w
WHERE w.depth > 0
ORDER BY w.path) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH RECURSIVE walk (category_id, name, depth, path) AS (
  SELECT c.category_id, c.name, 0, ARRAY[c.category_id]
  FROM categories AS c WHERE c.category_id = 1
  UNION ALL
  SELECT c.category_id, c.name, w.depth + 1,
         w.path || c.category_id
  FROM walk AS w
  JOIN categories AS c ON c.parent_id = w.category_id
  WHERE NOT (c.category_id = ANY(w.path))
    AND w.depth < 2
)
SELECT w.category_id, w.name, w.depth, w.path,
       (w.depth = 2 AND EXISTS (
         SELECT 1 FROM categories AS c
         WHERE c.parent_id = w.category_id
           AND NOT (c.category_id = ANY(w.path))
       )) AS truncated
FROM walk AS w
WHERE w.depth > 0
ORDER BY w.path) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH RECURSIVE walk (category_id, name, depth, path) AS (
  SELECT c.category_id, c.name, 0, ARRAY[c.category_id]
  FROM categories AS c WHERE c.category_id = 99
  UNION ALL
  SELECT c.category_id, c.name, w.depth + 1,
         w.path || c.category_id
  FROM walk AS w
  JOIN categories AS c ON c.parent_id = w.category_id
  WHERE NOT (c.category_id = ANY(w.path))
    AND w.depth < 3
)
SELECT w.category_id, w.name, w.depth, w.path,
       (w.depth = 3 AND EXISTS (
         SELECT 1 FROM categories AS c
         WHERE c.parent_id = w.category_id
           AND NOT (c.category_id = ANY(w.path))
       )) AS truncated
FROM walk AS w
WHERE w.depth > 0
ORDER BY w.path) AS r;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH RECURSIVE walk (category_id, name, depth, path) AS (
  SELECT c.category_id, c.name, 0, ARRAY[c.category_id]
  FROM categories AS c WHERE c.category_id = 5
  UNION ALL
  SELECT c.category_id, c.name, w.depth + 1,
         w.path || c.category_id
  FROM walk AS w
  JOIN categories AS c ON c.parent_id = w.category_id
  WHERE NOT (c.category_id = ANY(w.path))
    AND w.depth < 3
)
SELECT w.category_id, w.name, w.depth, w.path,
       (w.depth = 3 AND EXISTS (
         SELECT 1 FROM categories AS c
         WHERE c.parent_id = w.category_id
           AND NOT (c.category_id = ANY(w.path))
       )) AS truncated
FROM walk AS w
WHERE w.depth > 0
ORDER BY w.path) AS r;

UPDATE categories SET parent_id=5 WHERE category_id=1;

SELECT COALESCE(json_agg(r), '[]') FROM (WITH RECURSIVE walk (category_id, name, depth, path) AS (
  SELECT c.category_id, c.name, 0, ARRAY[c.category_id]
  FROM categories AS c WHERE c.category_id = 1
  UNION ALL
  SELECT c.category_id, c.name, w.depth + 1,
         w.path || c.category_id
  FROM walk AS w
  JOIN categories AS c ON c.parent_id = w.category_id
  WHERE NOT (c.category_id = ANY(w.path))
    AND w.depth < 3
)
SELECT w.category_id, w.name, w.depth, w.path,
       (w.depth = 3 AND EXISTS (
         SELECT 1 FROM categories AS c
         WHERE c.parent_id = w.category_id
           AND NOT (c.category_id = ANY(w.path))
       )) AS truncated
FROM walk AS w
WHERE w.depth > 0
ORDER BY w.path) AS r;

UPDATE categories SET parent_id=NULL WHERE category_id=1;

WITH RECURSIVE bad(id,depth) AS (SELECT 1,0 UNION SELECT 1,depth+1 FROM bad WHERE depth<3) SELECT count(*) FROM bad;

DO $$ BEGIN
 BEGIN EXECUTE 'SELECT 1 UNION SELECT 1,2'; RAISE EXCEPTION 'expected shape error'; EXCEPTION WHEN syntax_error THEN RAISE NOTICE 'EXPECTED: %',SQLERRM; END;

END $$;
