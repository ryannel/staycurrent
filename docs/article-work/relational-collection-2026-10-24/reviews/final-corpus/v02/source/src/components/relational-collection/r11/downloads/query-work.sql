\set ON_ERROR_STOP on
SET timezone='UTC';
SET max_parallel_workers_per_gather=0;
CREATE TEMP TABLE plan_orders (
 shop_id integer NOT NULL, order_id integer NOT NULL,
 status text NOT NULL, payload text NOT NULL,
 PRIMARY KEY(shop_id,order_id)
);
INSERT INTO plan_orders
SELECT CASE WHEN g<=99000 THEN 10 ELSE 20 END,g,
       CASE WHEN g<=99000 THEN 'paid' ELSE 'pending' END,repeat('x',80)
FROM generate_series(1,100000) g;
CREATE INDEX plan_state ON plan_orders(shop_id,status);
ANALYZE plan_orders;
\echo Independent statistics: shop 20 and pending are correlated
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT sum(length(payload)) FROM plan_orders WHERE shop_id=20 AND status='pending';
CREATE STATISTICS plan_shop_status (mcv) ON shop_id,status FROM plan_orders;
ANALYZE plan_orders;
\echo Joint statistics see the combination
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT sum(length(payload)) FROM plan_orders WHERE shop_id=20 AND status='pending';
DO $$ BEGIN
 IF (SELECT count(*) FROM plan_orders WHERE shop_id=20 AND status='pending')<>1000
 THEN RAISE EXCEPTION 'Unexpected fixture'; END IF;
END $$;
PREPARE by_shop(integer) AS SELECT sum(length(payload)) FROM plan_orders WHERE shop_id=$1;
SET plan_cache_mode=force_custom_plan;
\echo Custom rare shop
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE by_shop(20);
\echo Custom large shop
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE by_shop(10);
SET plan_cache_mode=force_generic_plan;
\echo Generic plan for rare shop: forced comparison, not automatic choice
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) EXECUTE by_shop(20);
RESET plan_cache_mode;
CREATE TEMP TABLE plan_lines(shop_id integer,order_id integer,line_no integer,PRIMARY KEY(shop_id,order_id,line_no));
INSERT INTO plan_lines SELECT shop_id,order_id,n FROM plan_orders CROSS JOIN generate_series(1,3) n;
ANALYZE plan_lines;
\echo Repeated inner lookup
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM plan_orders o JOIN plan_lines i USING(shop_id,order_id) WHERE o.shop_id=20;
\echo Deliberate small sort allowance
SET work_mem='64kB';
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id,payload FROM plan_orders ORDER BY payload,order_id DESC;
\echo Same sort with a larger local allowance
SET work_mem='32MB';
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id,payload FROM plan_orders ORDER BY payload,order_id DESC;
RESET work_mem;
DEALLOCATE by_shop;
