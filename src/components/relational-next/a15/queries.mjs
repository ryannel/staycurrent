import {setup as parentSetup, stages} from '../a02/queries.mjs';
export const setup=parentSetup;
export const scalar=`SELECT o.order_id,
       (SELECT p.amount FROM payments AS p
        WHERE p.order_id = o.order_id) AS receipt
FROM orders AS o
WHERE o.order_id = 100;
-- 100 | 10.00
-- Substitute 102: one outer row, receipt NULL.
-- Substitute 101: ERROR, more than one inner row.`;
export const nullScalar=`SELECT (SELECT v FROM (VALUES (NULL::numeric)) AS x(v)) AS receipt;
-- One inner row with a null value also gives NULL.`;
export const correlated=`SELECT o.order_id,
       (SELECT SUM(p.amount) FROM payments AS p
        WHERE p.order_id = o.order_id) AS paid,
       EXISTS (SELECT 1 FROM payments AS p
               WHERE p.order_id = o.order_id) AS has_payment
FROM orders AS o
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id;`;
export const global=`SELECT o.order_id,
       (SELECT SUM(p.amount) FROM payments AS p) AS paid,
       EXISTS (SELECT 1 FROM payments AS p) AS has_payment
FROM orders AS o
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id;`;
export const derived=`SELECT o.order_id, r.paid
FROM orders AS o
LEFT JOIN (
  SELECT p.order_id, SUM(p.amount) AS paid
  FROM payments AS p GROUP BY p.order_id
) AS r ON r.order_id = o.order_id
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id;`;
export const rawJoin=`SELECT o.order_id, p.amount
FROM orders AS o
JOIN payments AS p ON p.order_id = o.order_id
WHERE o.order_id IN (101, 102)
ORDER BY o.order_id, p.payment_id;`;
export const membership=(kind='null',safe=false)=>`WITH candidates (customer_id) AS (VALUES (1), (2), (NULL::integer)),
blocked (customer_id) AS (${kind==='empty'?'SELECT NULL::integer WHERE false':kind==='known'?'VALUES (1), (1)':'VALUES (1), (1), (NULL::integer)'})
SELECT c.customer_id,
       c.customer_id IN (SELECT b.customer_id FROM blocked AS b) AS included,
       c.customer_id NOT IN (SELECT b.customer_id FROM blocked AS b) AS excluded,
       EXISTS (SELECT 1 FROM blocked AS b
               WHERE b.customer_id ${safe?'IS NOT DISTINCT FROM':'='} c.customer_id) AS present,
       NOT EXISTS (SELECT 1 FROM blocked AS b
                   WHERE b.customer_id ${safe?'IS NOT DISTINCT FROM':'='} c.customer_id) AS absent
FROM candidates AS c
ORDER BY c.customer_id NULLS LAST;`;
export const exclusion=`WITH candidates (customer_id) AS (VALUES (1), (2), (NULL::integer)),
blocked (customer_id) AS (VALUES (1), (1), (NULL::integer))
SELECT c.customer_id FROM candidates AS c
WHERE c.customer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM blocked AS b
    WHERE b.customer_id = c.customer_id
  )
ORDER BY c.customer_id;
-- 2. Missing candidate identities are deliberately excluded.`;
export const setFixture=`WITH a (customer_id) AS (VALUES (1), (1), (1), (2), (NULL::integer)),
b (customer_id) AS (VALUES (1), (1), (3), (NULL::integer), (NULL::integer))`;
export const setQuery=(op='UNION')=>`${setFixture}
SELECT customer_id FROM a
${op}
SELECT customer_id FROM b
ORDER BY customer_id NULLS LAST;`;
export const customerSets=`WITH follow_up (customer_id) AS (
  SELECT o.customer_id FROM orders AS o
  WHERE o.order_id IN (101, 102, 106)
), paid_customers (customer_id) AS (
  SELECT o.customer_id FROM orders AS o
  JOIN payments AS p ON p.order_id = o.order_id
)
SELECT customer_id FROM follow_up
UNION
SELECT customer_id FROM paid_customers
ORDER BY customer_id;
-- 1, 2, 3: one customer identity, whichever reason selected it.`;
export const view=`CREATE VIEW january_follow_up
  (order_id, customer_id, placed_at, due, has_payment) AS
${stages}
SELECT b.order_id, b.customer_id, b.placed_at, b.due, b.has_payment
FROM balances AS b
WHERE b.due > 0 OR b.due IS NULL;`;
export const consume=`SELECT f.order_id, c.name, f.due, f.has_payment
FROM january_follow_up AS f
JOIN customers AS c ON c.customer_id = f.customer_id
ORDER BY f.placed_at, f.order_id;`;
export const hierarchySetup=`CREATE TABLE categories (
  category_id integer PRIMARY KEY,
  parent_id integer REFERENCES categories,
  name text NOT NULL
);
INSERT INTO categories VALUES
 (1, NULL, 'Shop'), (2, 1, 'Kitchen'), (3, 1, 'Garden'),
 (4, 2, 'Cups'), (5, 4, 'Travel cups');`;
export const traverse=(root=1,cap=3)=>`WITH RECURSIVE walk (category_id, name, depth, path) AS (
  SELECT c.category_id, c.name, 0, ARRAY[c.category_id]
  FROM categories AS c WHERE c.category_id = ${root}
  UNION ALL
  SELECT c.category_id, c.name, w.depth + 1,
         w.path || c.category_id
  FROM walk AS w
  JOIN categories AS c ON c.parent_id = w.category_id
  WHERE NOT (c.category_id = ANY(w.path))
    AND w.depth < ${cap}
)
SELECT w.category_id, w.name, w.depth, w.path,
       (w.depth = ${cap} AND EXISTS (
         SELECT 1 FROM categories AS c
         WHERE c.parent_id = w.category_id
           AND NOT (c.category_id = ANY(w.path))
       )) AS truncated
FROM walk AS w
WHERE w.depth > 0
ORDER BY w.path;`;
