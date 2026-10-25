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
CREATE SCHEMA pg_indexes_probe;
SET LOCAL search_path=pg_indexes_probe,pg_catalog;
SELECT jsonb_build_object('runtime',version(),'database',current_database(),'user',current_user,'cluster_name',current_setting('cluster_name'),'data_directory',current_setting('data_directory'),'listener',current_setting('listen_addresses'),'work_mem',current_setting('work_mem'));
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

CREATE FUNCTION plan(q text) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE p jsonb;
BEGIN EXECUTE 'EXPLAIN (ANALYZE, BUFFERS, WAL, FORMAT JSON, TIMING OFF) '||q INTO p; RETURN p; END $$;
CREATE FUNCTION emit(label text,q text) RETURNS jsonb LANGUAGE sql AS $$ SELECT jsonb_build_object('case',label,'plan',plan(q)) $$;
-- Exact locations do not imply an exact operator match.
CREATE TABLE tag_probe(label text PRIMARY KEY,tags text[] NOT NULL);
INSERT INTO tag_probe VALUES ('P7',ARRAY['gift','ceramic']),('reversed',ARRAY['ceramic','gift']),('extra',ARRAY['gift','ceramic','sale']),('tea',ARRAY['tea']);
CREATE INDEX tag_gin ON tag_probe USING gin(tags);
ANALYZE tag_probe;
SET LOCAL enable_seqscan=off;
SELECT emit('gin_contains_mechanics',$q$SELECT label FROM tag_probe WHERE tags @> ARRAY['gift','ceramic']$q$);
SELECT emit('gin_equal_mechanics',$q$SELECT label FROM tag_probe WHERE tags = ARRAY['gift','ceramic']$q$);
SELECT jsonb_build_object('case','tag_results','contains',(SELECT jsonb_agg(label ORDER BY label) FROM tag_probe WHERE tags @> ARRAY['gift','ceramic']),'equal',(SELECT jsonb_agg(label ORDER BY label) FROM tag_probe WHERE tags=ARRAY['gift','ceramic']));
CREATE TABLE reservation_probe(id integer, during tstzrange);
INSERT INTO reservation_probe VALUES(7001,tstzrange('2026-11-02 10:00+00','2026-11-02 11:00+00','[)'));
CREATE INDEX reservation_gist ON reservation_probe USING gist(during);
SELECT emit('gist_overlap_mechanics',$q$SELECT id FROM reservation_probe WHERE during && tstzrange('2026-11-02 10:30+00','2026-11-02 11:30+00','[)')$q$);
SELECT jsonb_build_object('case','half_open','overlap',(SELECT count(*) FROM reservation_probe WHERE during && tstzrange('2026-11-02 10:30+00','2026-11-02 11:30+00','[)')),'adjoining',(SELECT count(*) FROM reservation_probe WHERE during && tstzrange('2026-11-02 11:00+00','2026-11-02 12:00+00','[)')));
CREATE TABLE point_probe(id integer,p point);
INSERT INTO point_probe VALUES(1,point(1,1)),(2,point(3,3)),(3,point(2,6)),(4,point(7,5));
CREATE INDEX point_gist ON point_probe USING gist(p);
SELECT emit('gist_point_box_mechanics',$q$SELECT id FROM point_probe WHERE p <@ box '(0,0),(4,4)'$q$);
SELECT emit('gist_distance_mechanics',$q$SELECT id,p <-> point '(0,0)' AS d FROM point_probe ORDER BY p <-> point '(0,0)' LIMIT 2$q$);
DROP INDEX point_gist;
CREATE INDEX point_spgist ON point_probe USING spgist(p quad_point_ops);
SELECT emit('spgist_point_box_mechanics',$q$SELECT id FROM point_probe WHERE p <@ box '(0,0),(4,4)'$q$);
SELECT emit('spgist_distance_mechanics',$q$SELECT id,p <-> point '(0,0)' AS d FROM point_probe ORDER BY p <-> point '(0,0)' LIMIT 2$q$);
SELECT jsonb_build_object('case','points','box',(SELECT jsonb_agg(id ORDER BY id) FROM point_probe WHERE p <@ box '(0,0),(4,4)'),'nearest',(SELECT jsonb_agg(id ORDER BY d) FROM (SELECT id,p <-> point '(0,0)' AS d FROM point_probe ORDER BY d LIMIT 2) s));
-- B-tree keeps the history order; hash only customer equality.
SET LOCAL enable_seqscan=on;
CREATE INDEX history_btree ON orders(customer_id,placed_at DESC,order_id DESC);
SELECT emit('btree_history_default',$q$SELECT order_id,placed_at,status FROM orders WHERE customer_id=1002 AND placed_at >= timestamptz '2026-01-01 00:00+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10$q$);
DROP INDEX history_btree;
CREATE INDEX customer_hash ON orders USING hash(customer_id);
SELECT emit('hash_history_default',$q$SELECT order_id,placed_at,status FROM orders WHERE customer_id=1002 AND placed_at >= timestamptz '2026-01-01 00:00+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10$q$);
DROP INDEX customer_hash;
-- The same full fixture in two physical orders, same columns, no new orders.
CREATE TABLE time_sorted AS SELECT * FROM orders ORDER BY placed_at,order_id;
CREATE TABLE time_mixed AS SELECT * FROM orders ORDER BY order_id;
CREATE INDEX time_sorted_brin ON time_sorted USING brin(placed_at) WITH(pages_per_range=32);
CREATE INDEX time_mixed_brin ON time_mixed USING brin(placed_at) WITH(pages_per_range=32);
ANALYZE time_sorted; ANALYZE time_mixed;
SET LOCAL enable_seqscan=off;
SELECT emit('brin_sorted_mechanics',$q$SELECT order_id FROM time_sorted WHERE placed_at >= timestamptz '2026-10-01 00:00+00' AND placed_at < timestamptz '2026-10-02 00:00+00'$q$);
SELECT emit('brin_mixed_mechanics',$q$SELECT order_id FROM time_mixed WHERE placed_at >= timestamptz '2026-10-01 00:00+00' AND placed_at < timestamptz '2026-10-02 00:00+00'$q$);
SELECT jsonb_build_object('case','brin_equivalence','same',(SELECT array_agg(order_id ORDER BY order_id) FROM time_sorted WHERE placed_at >= timestamptz '2026-10-01 00:00+00' AND placed_at < timestamptz '2026-10-02 00:00+00') IS NOT DISTINCT FROM (SELECT array_agg(order_id ORDER BY order_id) FROM time_mixed WHERE placed_at >= timestamptz '2026-10-01 00:00+00' AND placed_at < timestamptz '2026-10-02 00:00+00'),'rows',(SELECT count(*) FROM time_sorted WHERE placed_at >= timestamptz '2026-10-01 00:00+00' AND placed_at < timestamptz '2026-10-02 00:00+00'),'index_bytes',pg_relation_size('time_sorted_brin'),'heap_bytes',pg_relation_size('time_sorted'));
-- An exact B-tree predicate can still suffer lossy bitmap pages.
SET LOCAL enable_seqscan=on;
CREATE INDEX time_probe_btree ON time_mixed(placed_at);
DROP INDEX time_mixed_brin;
SET LOCAL enable_seqscan=off; SET LOCAL enable_indexscan=off;
SET LOCAL work_mem='64kB';
SELECT emit('bitmap_64k_mechanics',$q$SELECT order_id FROM time_mixed WHERE placed_at >= timestamptz '2026-06-01 00:00+00'$q$);
SET LOCAL work_mem='4MB';
SELECT emit('bitmap_4m_mechanics',$q$SELECT order_id FROM time_mixed WHERE placed_at >= timestamptz '2026-06-01 00:00+00'$q$);
SET LOCAL enable_indexscan=on; SET LOCAL enable_seqscan=on;
-- Prefix search in a deterministic non-C ICU collation, when supplied.
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_collation WHERE collname='und-x-icu' AND collprovider='i') THEN
  EXECUTE 'CREATE TABLE name_probe(name text COLLATE "und-x-icu")';
  EXECUTE 'INSERT INTO name_probe SELECT CASE WHEN n=1 THEN ''Blue mug'' ELSE ''Other ''||n END FROM generate_series(1,10000) g(n)';
  EXECUTE 'CREATE INDEX name_default ON name_probe(name)';
  EXECUTE 'ANALYZE name_probe';
 ELSE RAISE NOTICE 'No und-x-icu collation; prefix comparison skipped'; END IF;
END $$;
SELECT emit('prefix_default',$q$SELECT name FROM name_probe WHERE name LIKE 'Blue%'$q$) WHERE to_regclass('name_probe') IS NOT NULL;
DO $$ BEGIN IF to_regclass('name_probe') IS NOT NULL THEN EXECUTE 'CREATE INDEX name_pattern ON name_probe(name text_pattern_ops)'; END IF; END $$;
SELECT emit('prefix_pattern',$q$SELECT name FROM name_probe WHERE name LIKE 'Blue%'$q$) WHERE to_regclass('name_probe') IS NOT NULL;
-- Write work: identical input, separately created empty tables.
CREATE TABLE write_plain(id int,tags text[]);
CREATE TABLE write_gin(id int,tags text[]);
CREATE TABLE write_gin_direct(id int,tags text[]);
CREATE INDEX write_gin_idx ON write_gin USING gin(tags);
CREATE INDEX write_gin_direct_idx ON write_gin_direct USING gin(tags) WITH(fastupdate=off);
SELECT emit('write_plain',$q$INSERT INTO write_plain SELECT n,ARRAY(SELECT 'tag-'||k FROM generate_series(1,20) g(k)) FROM generate_series(1,1000) a(n)$q$);
SELECT emit('write_gin_pending',$q$INSERT INTO write_gin SELECT n,ARRAY(SELECT 'tag-'||k FROM generate_series(1,20) g(k)) FROM generate_series(1,1000) a(n)$q$);
SELECT emit('write_gin_direct',$q$INSERT INTO write_gin_direct SELECT n,ARRAY(SELECT 'tag-'||k FROM generate_series(1,20) g(k)) FROM generate_series(1,1000) a(n)$q$);
SELECT jsonb_build_object('case','write_index_size','pending_bytes',pg_relation_size('write_gin_idx'),'direct_bytes',pg_relation_size('write_gin_direct_idx'));
ROLLBACK;
