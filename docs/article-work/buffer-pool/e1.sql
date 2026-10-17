\echo === evict all, then warm the shop working set
SELECT * FROM pg_buffercache_evict_all();
DO $$ BEGIN FOR i IN 1..5 LOOP PERFORM sum(price) FROM products; END LOOP; END $$;
DO $$ DECLARE p numeric; BEGIN FOR i IN 1..20000 LOOP SELECT price INTO p FROM products WHERE product_id = i; END LOOP; END $$;
\i snap.sql
SELECT * FROM pg_buffercache_usage_counts();
\echo === report: sequential scan of page_views
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT count(*), sum(length(detail)) FROM page_views;
\i snap.sql
\echo === the shop query again
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT sum(price) FROM products;
\echo === report: same rows read through the index (normal replacement)
SET enable_seqscan = off; SET enable_bitmapscan = off;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT count(*), sum(length(detail)) FROM page_views WHERE view_id BETWEEN 1 AND 1200000;
RESET enable_seqscan; RESET enable_bitmapscan;
\i snap.sql
\echo === the shop query again
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT sum(price) FROM products;
SELECT backend_type, context, reads, hits, evictions, reuses FROM pg_stat_io WHERE object='relation' AND backend_type='client backend' AND (reads>0 OR hits>0);
