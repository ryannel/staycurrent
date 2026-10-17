-- Estimating the working set from usage counts (16 MB pool, 2,048 buffers).
\echo === evict all; warm the shop; then one pass of the report through the index over 1,500 pages
SELECT count(*) FROM pg_buffercache_evict_all();
DO $$ BEGIN FOR i IN 1..5 LOOP PERFORM sum(price) FROM products; END LOOP; END $$;
DO $$ DECLARE p numeric; BEGIN FOR i IN 1..20000 LOOP SELECT price INTO p FROM products WHERE product_id = i; END LOOP; END $$;
SET enable_seqscan = off; SET enable_bitmapscan = off; SET max_parallel_workers_per_gather = 0;
SELECT count(*) FROM page_views WHERE view_id BETWEEN 1 AND 100000;
RESET ALL;
\echo === usage-count distribution
SELECT * FROM pg_buffercache_usage_counts();
\echo === buffers used at least twice, by relation
SELECT c.relname, count(*) FROM pg_buffercache b JOIN pg_class c ON b.relfilenode = pg_relation_filenode(c.oid)
WHERE b.usagecount >= 2 AND b.reldatabase = (SELECT oid FROM pg_database WHERE datname = current_database())
GROUP BY 1 ORDER BY 2 DESC LIMIT 5;
\echo === the shop keeps working: another pass over its rows
DO $$ DECLARE p numeric; BEGIN FOR i IN 1..20000 LOOP SELECT price INTO p FROM products WHERE product_id = i; END LOOP; END $$;
SELECT * FROM pg_buffercache_usage_counts();
