-- Per-page cost of PostgreSQL "reads" served by the OS page cache.
-- io_method = sync, io_combine_limit = 1 (8 kB): one read call per page, no asynchronous I/O.
SHOW io_method; SHOW io_combine_limit;
SELECT sum(price) FROM products;  -- make sure the file is in the OS cache
SELECT count(*) FROM pg_buffercache_evict_all();
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT sum(price) FROM products;
SELECT count(*) FROM pg_buffercache_evict_all();
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT sum(price) FROM products;
