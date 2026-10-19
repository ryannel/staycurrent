-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
SELECT 0.1::numeric + 0.2::numeric = 0.3::numeric AS decimal_equal,
       0.1::double precision + 0.2::double precision
         = 0.3::double precision AS float_equal,
       1.005::numeric(10,2) AS rounded;


SET TIME ZONE 'UTC';
SELECT timestamptz '2026-10-25 02:30:00+02' AS first_instant,
       timestamptz '2026-10-25 02:30:00+01' AS second_instant,
       timestamptz '2026-10-25 02:30:00+01'
         - timestamptz '2026-10-25 02:30:00+02' AS elapsed;


SELECT 'Ada' COLLATE "C" = 'ada' COLLATE "C" AS exact,
       lower('Ada') = lower('ada') AS folded;
SELECT v FROM (VALUES ('Zoe'),('adam')) AS names(v)
ORDER BY v COLLATE "C";


SELECT NULL = NULL AS ordinary_equal,
       NULL IS NULL AS is_missing,
       NULL IS NOT DISTINCT FROM NULL AS same_including_missing;


CREATE TABLE orders (tenant_id text, order_id text);
CREATE TABLE payments (tenant_id text, order_id text);
INSERT INTO orders VALUES ('t4','o81'), ('t4','o82');
INSERT INTO payments VALUES ('t4','o81'), ('t4',NULL);
SELECT order_id FROM orders
WHERE tenant_id = 't4'
  AND order_id NOT IN (
    SELECT order_id FROM payments WHERE tenant_id = 't4'
  );


SELECT o.order_id FROM orders o
WHERE o.tenant_id = 't4'
  AND NOT EXISTS (
    SELECT 1 FROM payments p
    WHERE p.tenant_id = o.tenant_id AND p.order_id = o.order_id
  )
ORDER BY o.order_id;
