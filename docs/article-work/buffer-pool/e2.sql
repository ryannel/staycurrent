SELECT * FROM pg_buffercache_evict_all();
DO $$ BEGIN FOR i IN 1..5 LOOP PERFORM sum(price) FROM products; END LOOP; END $$;
DO $$ DECLARE p numeric; BEGIN FOR i IN 1..20000 LOOP SELECT price INTO p FROM products WHERE product_id = i; END LOOP; END $$;
SET max_parallel_workers_per_gather = 0; SET enable_seqscan = off; SET enable_bitmapscan = off;
\echo === shorter index range: about 3000 pages
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT count(*), sum(length(detail)) FROM page_views WHERE view_id BETWEEN 1 AND 200000;
\i snap.sql
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT count(*), sum(length(detail)) FROM page_views WHERE view_id BETWEEN 200001 AND 400000;
\i snap.sql
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT count(*), sum(length(detail)) FROM page_views WHERE view_id BETWEEN 400001 AND 600000;
\i snap.sql
