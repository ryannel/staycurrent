\set ON_ERROR_STOP on
DO $$ BEGIN
 IF current_database() <> 'sc_pg_plans' OR current_user <> 'sc_pg_plans_writer'
 OR current_setting('cluster_name') <> 'staycurrent-pg-plans-20261025'
 OR current_setting('server_version_num') <> '180006'
 OR current_setting('data_directory') <> '/var/lib/postgresql/18/docker'
 OR current_setting('listen_addresses') <> '' THEN RAISE EXCEPTION 'wrong owned runtime'; END IF;
END $$;
SET statement_timeout='25s';
SET lock_timeout='2s';
SET timezone='UTC';
SET max_parallel_workers_per_gather=0;
SET jit=off;
BEGIN;
CREATE SCHEMA sc_pg_plans_work;
SET LOCAL search_path=sc_pg_plans_work,pg_catalog;
SELECT 'RUNTIME',version(),current_database(),current_user;
-- Run only in an explicitly owned disposable schema. No stock reconstruction.
CREATE TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL CHECK(stock>=0));
CREATE TABLE orders (order_id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES customers,
 placed_at timestamptz NOT NULL, status text NOT NULL CHECK(status IN ('pending','paid','cancelled')));
CREATE TABLE order_items (order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products, quantity integer NOT NULL CHECK(quantity>0),
 unit_price numeric(8,2) NOT NULL, PRIMARY KEY(order_id,line_no));
CREATE TABLE payments (payment_id integer PRIMARY KEY, order_id integer NOT NULL REFERENCES orders,
 amount numeric(8,2) NOT NULL CHECK(amount>0), method text NOT NULL);
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20,0),('P9','Teapot',35,4);
INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES (101,1,'P3',1,4.5),(101,2,'P9',1,35),(102,1,'P7',2,20),(103,1,'P7',1,20),(103,2,'P3',2,4.5);
INSERT INTO payments VALUES (501,101,30,'card'),(502,101,9.5,'gift card'),(503,102,40,'card');
INSERT INTO customers SELECT id,'Generated customer '||id FROM generate_series(1001,2000) AS g(id);
-- n = 0..119999. Seed is an arithmetic offset, not a random-number seed.
WITH generated AS (
 SELECT n, (n*37+20261025)%365 AS day_no,
        (n*53+20261025)%100 AS status_no
 FROM generate_series(0,119999) AS g(n)
)
INSERT INTO orders
SELECT 100001+n,
 CASE WHEN n%10<7 THEN 1001 ELSE 1002+(n*17+20261025)%999 END,
 timestamptz '2026-01-01 12:00+00'+day_no*interval '1 day',
 CASE WHEN (day_no>=273 AND day_no<304 AND status_no<90)
        OR ((day_no<273 OR day_no>=304) AND status_no<10)
      THEN 'paid' ELSE 'pending' END
FROM generated;
INSERT INTO order_items
SELECT 100001+n,l.line_no,l.product_id,1,l.price
FROM generate_series(0,119999) AS g(n)
CROSS JOIN (VALUES (1,'P3',4.50::numeric),(2,'P7',20.00),(3,'P9',35.00)) AS l(line_no,product_id,price);
ANALYZE customers;
ANALYZE orders;
ANALYZE order_items;

SELECT 'COUNTS',(SELECT count(*) FROM orders),(SELECT count(*) FROM order_items);
SELECT 'PAID_OCT',count(*) FROM orders WHERE status='paid' AND placed_at>='2026-10-01+00' AND placed_at<'2026-11-01+00';
SELECT 'CUSTOMER_COUNTS',customer_id,count(*) FROM orders WHERE customer_id IN(1001,1002) GROUP BY customer_id ORDER BY customer_id;
SELECT 'REPORT_BEFORE';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF,SETTINGS)
SELECT o.customer_id,sum(v.order_value) AS paid_line_value
FROM orders o CROSS JOIN LATERAL (SELECT sum(i.quantity*i.unit_price) AS order_value FROM order_items i WHERE i.order_id=o.order_id HAVING count(*)>0) v WHERE o.status='paid' AND o.placed_at>=timestamptz '2026-10-01+00' AND o.placed_at<timestamptz '2026-11-01+00'
GROUP BY o.customer_id ORDER BY paid_line_value DESC,o.customer_id;
SELECT 'STATS';
SELECT attname,n_distinct,most_common_vals::text,most_common_freqs::text FROM pg_stats WHERE schemaname='sc_pg_plans_work' AND tablename='orders' AND attname IN('customer_id','status');
ALTER TABLE orders ALTER COLUMN placed_at SET STATISTICS 1000;
ALTER TABLE orders ALTER COLUMN status SET STATISTICS 1000;
ANALYZE orders;
SELECT 'LARGER_SINGLE_COLUMN';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) SELECT order_id FROM orders WHERE status='paid' AND placed_at>=timestamptz '2026-10-01+00' AND placed_at<timestamptz '2026-11-01+00';
CREATE STATISTICS orders_date_status(mcv) ON placed_at,status FROM orders;
ALTER STATISTICS orders_date_status SET STATISTICS 1000;
ANALYZE orders;
SELECT 'MCV';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) SELECT order_id FROM orders WHERE status='paid' AND placed_at>=timestamptz '2026-10-01+00' AND placed_at<timestamptz '2026-11-01+00';
SELECT 'REPORT_JOIN';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF)
SELECT o.customer_id,sum(i.quantity*i.unit_price) AS paid_line_value FROM orders o JOIN order_items i USING(order_id)
WHERE o.status='paid' AND o.placed_at>=timestamptz '2026-10-01+00' AND o.placed_at<timestamptz '2026-11-01+00'
GROUP BY o.customer_id ORDER BY paid_line_value DESC,o.customer_id;
SELECT 'EQUIVALENCE';
WITH a AS (SELECT o.customer_id,sum(v.order_value) AS v FROM orders o CROSS JOIN LATERAL (SELECT sum(i.quantity*i.unit_price) AS order_value FROM order_items i WHERE i.order_id=o.order_id HAVING count(*)>0) v WHERE o.status='paid' AND o.placed_at>='2026-10-01+00' AND o.placed_at<'2026-11-01+00' GROUP BY o.customer_id),
b AS (SELECT o.customer_id,sum(i.quantity*i.unit_price) AS v FROM orders o JOIN order_items i USING(order_id) WHERE o.status='paid' AND o.placed_at>='2026-10-01+00' AND o.placed_at<'2026-11-01+00' GROUP BY o.customer_id)
SELECT count(*) FROM ((SELECT * FROM a EXCEPT ALL SELECT * FROM b) UNION ALL (SELECT * FROM b EXCEPT ALL SELECT * FROM a)) AS difference;
CREATE INDEX orders_customer ON orders(customer_id);
SELECT 'HISTORY_CUSTOMER';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) SELECT order_id,placed_at,status FROM orders WHERE customer_id=1001 AND placed_at>=timestamptz '2026-10-01+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10;
CREATE INDEX orders_history ON orders(customer_id,placed_at DESC,order_id DESC);
SELECT 'HISTORY_COMPOSITE';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) SELECT order_id,placed_at,status FROM orders WHERE customer_id=1001 AND placed_at>=timestamptz '2026-10-01+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10;
PREPARE customer_orders(integer) AS SELECT order_id,placed_at,status FROM orders WHERE customer_id=$1;
SET LOCAL plan_cache_mode=force_custom_plan;
SELECT 'CUSTOM_COMMON';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) EXECUTE customer_orders(1001);
SELECT 'CUSTOM_RARE';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) EXECUTE customer_orders(1002);
SET LOCAL plan_cache_mode=force_generic_plan;
SELECT 'GENERIC_COMMON';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) EXECUTE customer_orders(1001);
SELECT 'GENERIC_RARE';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) EXECUTE customer_orders(1002);
DEALLOCATE customer_orders;
SET LOCAL plan_cache_mode=auto;
PREPARE customer_orders(integer) AS SELECT order_id,placed_at,status FROM orders WHERE customer_id=$1;
SELECT 'AUTO_RARE_FIRST';
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1002);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1002);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1002);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1002);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1002);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1001);
SELECT name,generic_plans,custom_plans FROM pg_prepared_statements WHERE name='customer_orders';
DEALLOCATE customer_orders;
PREPARE customer_orders(integer) AS SELECT order_id,placed_at,status FROM orders WHERE customer_id=$1;
SELECT 'AUTO_COMMON_FIRST';
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1001);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1001);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1001);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1001);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1001);
EXPLAIN(ANALYZE,TIMING OFF,BUFFERS OFF) EXECUTE customer_orders(1002);
SELECT name,generic_plans,custom_plans FROM pg_prepared_statements WHERE name='customer_orders';
DEALLOCATE customer_orders;
SELECT 'SPILL_64KB';
SET LOCAL work_mem='64kB';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) SELECT order_id,customer_id,placed_at,status FROM orders ORDER BY status,placed_at,order_id;
SELECT 'SORT_32MB';
SET LOCAL work_mem='32MB';
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF) SELECT order_id,customer_id,placed_at,status FROM orders ORDER BY status,placed_at,order_id;
SELECT 'PARALLEL_DIAGNOSTIC';
SET LOCAL max_parallel_workers_per_gather=2;
SET LOCAL min_parallel_table_scan_size=0;
SET LOCAL parallel_setup_cost=0;
SET LOCAL parallel_tuple_cost=0;
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF,VERBOSE,SETTINGS) SELECT customer_id,count(*) FROM orders GROUP BY customer_id;
ROLLBACK;
SELECT 'CLEANUP',to_regnamespace('sc_pg_plans_work') IS NULL;
