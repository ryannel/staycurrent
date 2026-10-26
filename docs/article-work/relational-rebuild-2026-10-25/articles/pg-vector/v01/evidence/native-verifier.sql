\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '90s';
SET LOCAL lock_timeout = '3s';
SELECT set_config('sc.fixture_db', :'fixture_db', true),set_config('sc.fixture_admin', :'fixture_admin', true);
DO $$ BEGIN
 IF current_database() <> current_setting('sc.fixture_db') OR current_user <> current_setting('sc.fixture_admin') OR current_database() <> 'sc_pg_vector' OR current_setting('cluster_name') <> 'staycurrent-pg-vector-20261025' OR current_setting('listen_addresses') <> '' THEN RAISE EXCEPTION 'wrong fixture'; END IF;
END $$;
SELECT version(),current_database(),current_user,current_setting('cluster_name'),current_setting('data_directory');
CREATE EXTENSION vector;
SELECT extversion FROM pg_extension WHERE extname='vector';
CREATE SCHEMA sc_vector_evidence;
SET LOCAL search_path = sc_vector_evidence, public;
SET LOCAL max_parallel_workers_per_gather=0;
SET LOCAL max_parallel_maintenance_workers=0;
SET LOCAL maintenance_work_mem='64MB';
CREATE TABLE products(product_id text PRIMARY KEY,name text,stock int,embedding vector(2) NOT NULL);
INSERT INTO products VALUES ('P3','Green tea, 50 g',10,'[0,1]'),('P7','Blue mug',0,'[1,0]'),('P9','Teapot',4,'[0.8,0.6]');
SELECT 'small-distances',jsonb_agg(to_jsonb(r)) FROM (SELECT product_id,embedding <-> '[1,0]'::vector AS l2,embedding <=> '[1,0]'::vector AS cosine,embedding <#> '[1,0]'::vector AS negative_ip FROM products ORDER BY l2)r;
SELECT 'eligible-first',array_agg(product_id) FROM (SELECT product_id FROM products WHERE stock>0 ORDER BY embedding <-> '[1,0]'::vector LIMIT 2)r;
SELECT 'limit-first',array_agg(product_id) FROM (SELECT * FROM products ORDER BY embedding <-> '[1,0]'::vector LIMIT 2)r WHERE stock>0;
CREATE TABLE vectors(id int PRIMARY KEY,cohort int NOT NULL,embedding vector(8) NOT NULL);
INSERT INTO vectors SELECT n,n%20,(SELECT array_agg((((n*p)%1009)::float8/1009 + (n/1009)*0.0001*d)::real ORDER BY d)::vector FROM unnest(ARRAY[17,31,47,73,97,127,151,181]) WITH ORDINALITY v(p,d)) FROM generate_series(1,6000)n;
CREATE TABLE requests AS SELECT q, (SELECT array_agg(((((37*q+101)*p)%1009)::float8/1009 + ((37*q+101)/1009)*0.0001*d+0.0003)::real ORDER BY d)::vector FROM unnest(ARRAY[17,31,47,73,97,127,151,181]) WITH ORDINALITY v(p,d)) AS v FROM generate_series(1,8)q;
CREATE INDEX sc_vector_cohort ON vectors(cohort);
ANALYZE vectors;
CREATE TABLE baseline(q int,filtered bool,ids int[]);
INSERT INTO baseline SELECT q,filtered,(SELECT array_agg(id ORDER BY distance,id) FROM (SELECT id,embedding <-> v AS distance FROM vectors WHERE (NOT filtered OR cohort=q%20) ORDER BY embedding <-> v,id LIMIT 10)s) FROM requests CROSS JOIN (VALUES(false),(true))f(filtered);
CREATE TABLE runs(method text,q int,filtered bool,iteration int,ids int[],recall float8,plan jsonb);
CREATE FUNCTION measure(label text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE r record; f bool; i int; ids int[]; p jsonb; sql text; gold int[]; score float8;
BEGIN
 FOR r IN SELECT * FROM requests ORDER BY q LOOP
  FOREACH f IN ARRAY ARRAY[false,true] LOOP
   sql := format('SELECT id,embedding <-> %L::vector AS distance FROM vectors %s ORDER BY embedding <-> %L::vector LIMIT 10',r.v::text,CASE WHEN f THEN 'WHERE cohort='||(r.q%20) ELSE '' END,r.v::text);
   EXECUTE 'SELECT array_agg(id ORDER BY distance,id) FROM ('||sql||')s' INTO ids;
   SELECT b.ids INTO gold FROM baseline b WHERE b.q=r.q AND b.filtered=f;
   SELECT count(*)::float8/cardinality(gold) INTO score FROM unnest(coalesce(ids,ARRAY[]::int[]))x WHERE x=ANY(gold);
   FOR i IN 1..5 LOOP
    EXECUTE 'EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON,TIMING OFF) '||sql INTO p;
    IF label LIKE 'hnsw-%' AND p::text NOT LIKE '%"Index Name": "sc_vector_hnsw"%' THEN RAISE EXCEPTION 'HNSW plan missing'; END IF;
    IF label LIKE 'ivf-%' AND p::text NOT LIKE '%"Index Name": "sc_vector_ivf"%' THEN RAISE EXCEPTION 'IVF plan missing'; END IF;
    INSERT INTO runs VALUES(label,r.q,f,i,ids,score,p);
   END LOOP;
  END LOOP;
 END LOOP;
END $$;
SELECT measure('exact-normal');
SELECT 'exact-plan',filtered,plan FROM runs WHERE method='exact-normal' AND q=1 AND iteration=1;
DROP INDEX sc_vector_cohort;
CREATE TABLE build_cost(method text,ms numeric,bytes bigint);
DO $$DECLARE t timestamptz:=clock_timestamp(); BEGIN
 CREATE INDEX sc_vector_hnsw ON vectors USING hnsw(embedding vector_l2_ops) WITH(m=16,ef_construction=64);
 INSERT INTO build_cost VALUES('hnsw',extract(epoch FROM clock_timestamp()-t)*1000,pg_relation_size('sc_vector_hnsw'));
END $$;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON,TIMING OFF) SELECT id FROM vectors WHERE cohort=1 ORDER BY embedding <-> '[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8]'::vector LIMIT 10;
SET LOCAL enable_seqscan=off;
SET LOCAL hnsw.ef_search=10;
SET LOCAL hnsw.iterative_scan=off;
SELECT measure('hnsw-10-off');
SET LOCAL hnsw.ef_search=100;
SELECT measure('hnsw-100-off');
SET LOCAL hnsw.iterative_scan=strict_order;
SET LOCAL hnsw.max_scan_tuples=20000;
SELECT measure('hnsw-100-strict');
DROP INDEX sc_vector_hnsw;
DO $$DECLARE t timestamptz:=clock_timestamp(); BEGIN
 CREATE INDEX sc_vector_ivf ON vectors USING ivfflat(embedding vector_l2_ops) WITH(lists=20);
 INSERT INTO build_cost VALUES('ivfflat',extract(epoch FROM clock_timestamp()-t)*1000,pg_relation_size('sc_vector_ivf'));
END $$;
SET LOCAL ivfflat.probes=1;
SET LOCAL ivfflat.iterative_scan=off;
SELECT measure('ivf-1-off');
SET LOCAL ivfflat.probes=5;
SELECT measure('ivf-5-off');
SET LOCAL ivfflat.iterative_scan=relaxed_order;
SET LOCAL ivfflat.max_probes=20;
SELECT measure('ivf-5-relaxed');
SELECT 'build',to_jsonb(b) FROM build_cost b;
SELECT 'summary',jsonb_build_object('method',method,'filtered',filtered,'samples',count(*),'min_count',min(cardinality(ids)),'mean_recall',avg(recall),'median_ms',percentile_cont(0.5) WITHIN GROUP(ORDER BY (plan->0->>'Execution Time')::float8),'p95_ms',percentile_cont(0.95) WITHIN GROUP(ORDER BY (plan->0->>'Execution Time')::float8)) FROM runs GROUP BY method,filtered ORDER BY method,filtered;
SELECT 'run',to_jsonb(r) FROM runs r WHERE iteration=1 ORDER BY method,q,filtered;
SELECT 'baseline',to_jsonb(b) FROM baseline b ORDER BY q,filtered;
SELECT 'vector-fixture',count(*),min(vector_dims(embedding)),max(vector_dims(embedding)) FROM vectors;
ROLLBACK;
SELECT 'rolled-back',to_regnamespace('sc_vector_evidence') IS NULL;
