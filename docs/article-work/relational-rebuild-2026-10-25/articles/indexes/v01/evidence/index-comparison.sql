-- Run only after the exact input/generated-shop-fixture.sql has been loaded into
-- an explicitly owned disposable database/schema. No external/default target.
SET timezone = 'UTC';
SET max_parallel_workers_per_gather = 0;
SET jit = off;
ALTER TABLE orders SET (autovacuum_enabled = false);
CREATE FUNCTION index_probe(label text, statement text) RETURNS jsonb
LANGUAGE plpgsql AS $$
DECLARE measured jsonb; answer jsonb;
BEGIN
 EXECUTE 'EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON) ' || statement INTO measured;
 EXECUTE 'SELECT COALESCE(jsonb_agg(to_jsonb(q)), ''[]''::jsonb) FROM (' || statement || ') q' INTO answer;
 RETURN jsonb_build_object('label', label, 'sql', statement, 'plan', measured, 'result', answer);
END $$;
CREATE FUNCTION history_matrix(variant text) RETURNS SETOF jsonb
LANGUAGE plpgsql AS $$
DECLARE customer integer; lower_day text; paid boolean; statement text;
BEGIN
 FOREACH customer IN ARRAY ARRAY[1001,1002] LOOP
 FOREACH lower_day IN ARRAY ARRAY['2026-01-01','2026-10-01'] LOOP
 FOREACH paid IN ARRAY ARRAY[false,true] LOOP
 statement := format('SELECT order_id, placed_at, status FROM orders WHERE customer_id = %s AND placed_at >= timestamptz %L %s ORDER BY placed_at DESC, order_id DESC LIMIT 10',customer,lower_day||' 00:00+00', CASE WHEN paid THEN 'AND status = ''paid''' ELSE '' END);
 RETURN NEXT index_probe(variant || ':' || customer || ':' || lower_day || ':' || paid, statement);
 END LOOP; END LOOP; END LOOP;
END $$;
SELECT jsonb_build_object('runtime',version(),'settings',jsonb_build_object('work_mem',current_setting('work_mem'),'shared_buffers',current_setting('shared_buffers'),'random_page_cost',current_setting('random_page_cost'),'seq_page_cost',current_setting('seq_page_cost'),'max_parallel_workers_per_gather',current_setting('max_parallel_workers_per_gather'),'jit',current_setting('jit'),'timezone',current_setting('timezone')));
SELECT jsonb_build_object('orders',count(*),'paid',count(*) FILTER(WHERE status='paid'),'pending',count(*) FILTER(WHERE status='pending'),'common',count(*) FILTER(WHERE customer_id=1001),'rare',count(*) FILTER(WHERE customer_id=1002)) FROM orders;
SELECT jsonb_build_object('projection',jsonb_agg(to_jsonb(q))) FROM (SELECT order_id,customer_id,placed_at,status FROM orders WHERE order_id IN (100003,100042,100012,100001,103979,114968,162920,132950,147700,117730,128719,109738) ORDER BY order_id) q;
SELECT * FROM history_matrix('primary-key-only');
CREATE INDEX orders_customer ON orders(customer_id);
SELECT jsonb_build_object('index','orders_customer','bytes',pg_relation_size('orders_customer'));
SELECT * FROM history_matrix('customer');
DROP INDEX orders_customer;
CREATE INDEX orders_time_customer ON orders(placed_at DESC,customer_id,order_id DESC);
SELECT jsonb_build_object('index','orders_time_customer','bytes',pg_relation_size('orders_time_customer'));
SELECT * FROM history_matrix('time-customer');
DROP INDEX orders_time_customer;
CREATE INDEX orders_history ON orders(customer_id,placed_at DESC,order_id DESC);
SELECT jsonb_build_object('index','orders_history','bytes',pg_relation_size('orders_history'));
SELECT * FROM history_matrix('history');
DROP INDEX orders_history;
CREATE INDEX orders_history_cover ON orders(customer_id,placed_at DESC,order_id DESC) INCLUDE(status);
SELECT jsonb_build_object('index','orders_history_cover','bytes',pg_relation_size('orders_history_cover'));
SELECT * FROM history_matrix('cover-before-vacuum');
VACUUM orders;
SELECT * FROM history_matrix('cover-after-vacuum');
DROP INDEX orders_history_cover;
CREATE INDEX orders_paid_history ON orders(customer_id,placed_at DESC,order_id DESC) INCLUDE(status) WHERE status='paid';
SELECT jsonb_build_object('index','orders_paid_history','bytes',pg_relation_size('orders_paid_history'));
SELECT * FROM history_matrix('paid-partial');
-- Fixed predicate and unknown status are different planning questions.
SET plan_cache_mode = force_generic_plan;
PREPARE any_status(integer,text) AS SELECT order_id,placed_at,status FROM orders WHERE customer_id=$1 AND status=$2 AND placed_at >= timestamptz '2026-10-01 00:00+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10;
EXPLAIN (FORMAT JSON) EXECUTE any_status(1001,'paid');
DEALLOCATE any_status;
RESET plan_cache_mode;
DROP INDEX orders_paid_history;
CREATE INDEX orders_placed_at ON orders(placed_at);
SELECT index_probe('direct-utc-range','SELECT order_id FROM orders WHERE placed_at >= timestamptz ''2026-10-01 00:00+00'' AND placed_at < timestamptz ''2026-10-02 00:00+00'' ORDER BY order_id');
SELECT index_probe('transformed-utc-day','SELECT order_id FROM orders WHERE (placed_at AT TIME ZONE ''UTC'')::date = date ''2026-10-01'' ORDER BY order_id');
CREATE INDEX orders_utc_day ON orders(((placed_at AT TIME ZONE 'UTC')::date));
SELECT index_probe('expression-utc-day','SELECT order_id FROM orders WHERE (placed_at AT TIME ZONE ''UTC'')::date = date ''2026-10-01'' ORDER BY order_id');
DROP INDEX orders_utc_day;
DROP INDEX orders_placed_at;
DROP FUNCTION history_matrix(text);
DROP FUNCTION index_probe(text,text);
