\set ON_ERROR_STOP on
BEGIN;
DO $guard$
BEGIN
 IF current_database() <> 'sc_pg_indexes' OR current_user <> 'sc_pg_indexes_writer'
 OR current_setting('cluster_name') <> 'staycurrent-pg-indexes-20261025'
 OR current_setting('server_version_num') <> '180006'
 OR current_setting('data_directory') <> '/var/lib/postgresql/18/docker'
 OR current_setting('listen_addresses') <> '' THEN
 RAISE EXCEPTION 'Refusing an unowned PostgreSQL fixture'; END IF;
END $guard$;
SET LOCAL statement_timeout='90s';
SET LOCAL lock_timeout='2s';
SET LOCAL max_parallel_workers_per_gather=0;
SET LOCAL jit=off;
SET LOCAL timezone='UTC';
CREATE SCHEMA sc_indexes_bitmap;
SET LOCAL search_path=sc_indexes_bitmap,pg_catalog;
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

CREATE FUNCTION plan(q text) RETURNS jsonb LANGUAGE plpgsql AS $$ DECLARE p jsonb; BEGIN EXECUTE 'EXPLAIN (ANALYZE, BUFFERS, WAL, FORMAT JSON, TIMING OFF) '||q INTO p; RETURN p; END $$;
-- Preserve the exact orders; add only synthetic, constant width to a diagnostic copy.
CREATE TABLE bitmap_probe AS SELECT order_id,placed_at,repeat('x',512) AS padding FROM orders ORDER BY order_id;
CREATE INDEX bitmap_time ON bitmap_probe(placed_at);
ANALYZE bitmap_probe;
CREATE TABLE expected_bitmap AS SELECT order_id FROM bitmap_probe WHERE placed_at >= timestamptz '2026-06-01 00:00+00';
SET LOCAL enable_seqscan=off; SET LOCAL enable_indexscan=off;
SET LOCAL work_mem='64kB';
SELECT jsonb_build_object('case','wide_bitmap_64k','plan',plan($q$SELECT order_id FROM bitmap_probe WHERE placed_at >= timestamptz '2026-06-01 00:00+00'$q$));
SELECT jsonb_build_object('case','wide_bitmap_64k_equivalence','same',(SELECT array_agg(order_id ORDER BY order_id) FROM expected_bitmap) IS NOT DISTINCT FROM (SELECT array_agg(order_id ORDER BY order_id) FROM bitmap_probe WHERE placed_at >= timestamptz '2026-06-01 00:00+00'));
SET LOCAL work_mem='4MB';
SELECT jsonb_build_object('case','wide_bitmap_4m','plan',plan($q$SELECT order_id FROM bitmap_probe WHERE placed_at >= timestamptz '2026-06-01 00:00+00'$q$));
SELECT jsonb_build_object('case','wide_bitmap_4m_equivalence','same',(SELECT array_agg(order_id ORDER BY order_id) FROM expected_bitmap) IS NOT DISTINCT FROM (SELECT array_agg(order_id ORDER BY order_id) FROM bitmap_probe WHERE placed_at >= timestamptz '2026-06-01 00:00+00'),'rows',(SELECT count(*) FROM expected_bitmap),'heap_bytes',pg_relation_size('bitmap_probe'));
SET LOCAL enable_indexscan=on; SET LOCAL enable_seqscan=on;
CREATE TABLE history_expected AS SELECT order_id,placed_at,status FROM orders WHERE customer_id=1002 AND placed_at >= timestamptz '2026-01-01 00:00+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10;
CREATE INDEX history ON orders(customer_id,placed_at DESC,order_id DESC);
SELECT jsonb_build_object('case','history_btree_equivalence','same',(SELECT jsonb_agg(to_jsonb(s) ORDER BY placed_at DESC,order_id DESC) FROM history_expected s) IS NOT DISTINCT FROM (SELECT jsonb_agg(to_jsonb(s) ORDER BY placed_at DESC,order_id DESC) FROM (SELECT order_id,placed_at,status FROM orders WHERE customer_id=1002 AND placed_at >= timestamptz '2026-01-01 00:00+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10) s));
DROP INDEX history;
CREATE INDEX customer ON orders USING hash(customer_id);
SELECT jsonb_build_object('case','history_hash_equivalence','same',(SELECT jsonb_agg(to_jsonb(s) ORDER BY placed_at DESC,order_id DESC) FROM history_expected s) IS NOT DISTINCT FROM (SELECT jsonb_agg(to_jsonb(s) ORDER BY placed_at DESC,order_id DESC) FROM (SELECT order_id,placed_at,status FROM orders WHERE customer_id=1002 AND placed_at >= timestamptz '2026-01-01 00:00+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10) s));
ROLLBACK;
