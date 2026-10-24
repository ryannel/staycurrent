-- PostgreSQL 18. Disposable database; temporary generated rows, not real orders.
SET max_parallel_workers_per_gather=0;
CREATE TEMP TABLE plan_orders AS
SELECT CASE WHEN g <= 99000 THEN 10 ELSE 20 END::integer AS shop_id,
       g AS order_id,
       CASE WHEN g <= 99000 THEN 'paid' ELSE 'pending' END::text AS status,
       repeat('x',120) AS payload
FROM generate_series(1,100000) g;
ANALYZE plan_orders;
-- Fresh marginal statistics cannot describe this perfect correlation.
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id FROM plan_orders WHERE shop_id=20 AND status='pending';
CREATE STATISTICS plan_joint (mcv) ON shop_id,status FROM plan_orders;
ANALYZE plan_orders;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id FROM plan_orders WHERE shop_id=20 AND status='pending';
CREATE INDEX pending_history ON plan_orders(shop_id,order_id) WHERE status='pending';
PREPARE order_list(integer,text) AS
SELECT order_id FROM plan_orders WHERE shop_id=$1 AND status=$2 ORDER BY order_id LIMIT 10;
SET plan_cache_mode=force_custom_plan;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE order_list(20,'pending');
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE order_list(10,'paid');
SET plan_cache_mode=force_generic_plan;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE order_list(20,'pending');
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE order_list(10,'paid');
PREPARE pending_list(integer) AS
SELECT order_id FROM plan_orders WHERE shop_id=$1 AND status='pending' ORDER BY order_id LIMIT 10;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE pending_list(20);
EXECUTE pending_list(20);
DEALLOCATE order_list;
DEALLOCATE pending_list;
RESET plan_cache_mode;
-- Predicate cast: distinguish statistics repair from an access path.
CREATE INDEX plan_shop ON plan_orders(shop_id);
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id FROM plan_orders WHERE shop_id::text='20';
CREATE STATISTICS plan_shop_text ON (shop_id::text) FROM plan_orders;
ANALYZE plan_orders;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id FROM plan_orders WHERE shop_id::text='20';
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id FROM plan_orders WHERE shop_id='20'::integer;
RESET max_parallel_workers_per_gather;
