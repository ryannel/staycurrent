
-- An independent reporting copy. Its pair key does not enforce global order_id.
CREATE TABLE orders_monthly (
 order_id integer NOT NULL,
 customer_id integer NOT NULL,
 placed_at timestamptz NOT NULL,
 status text NOT NULL,
 PRIMARY KEY (order_id,placed_at)
) PARTITION BY RANGE(placed_at);
DO $body$
DECLARE m integer; lo timestamptz; hi timestamptz;
BEGIN
 FOR m IN 1..12 LOOP
  lo := make_timestamptz(2026,m,1,0,0,0,'UTC');
  hi := lo + interval '1 month';
  EXECUTE format('CREATE TABLE orders_2026_%s PARTITION OF orders_monthly FOR VALUES FROM (%L) TO (%L)',lpad(m::text,2,'0'),lo,hi);
 END LOOP;
END $body$;
INSERT INTO orders_monthly SELECT * FROM orders;
ANALYZE orders_monthly;

SELECT 'fixture_counts' AS check_name,
 (SELECT count(*) FROM orders)=120003 AND
 (SELECT count(*) FROM order_items)=360005 AND
 (SELECT count(*) FROM orders_monthly)=120003 AS ok;
SELECT tableoid::regclass::text AS partition, count(*) AS orders,
 count(*) FILTER(WHERE status='paid') AS paid
FROM orders_monthly GROUP BY tableoid ORDER BY tableoid::regclass::text;

-- Verify every value and occurrence in the copy, independently of report totals.
SELECT 'copy_rows_equal' AS check_name, NOT EXISTS (
 (SELECT * FROM orders EXCEPT ALL SELECT * FROM orders_monthly)
 UNION ALL
 (SELECT * FROM orders_monthly EXCEPT ALL SELECT * FROM orders)
) AS ok;

-- Retain one result for each layout/parameter before comparing exact rows.
CREATE TEMP TABLE report_results AS
SELECT layout,report_window,o.customer_id,SUM(i.quantity*i.unit_price) AS line_value
FROM (SELECT 'unpartitioned' AS layout,* FROM orders
      UNION ALL SELECT 'monthly',* FROM orders_monthly) o
CROSS JOIN (VALUES
 ('october',timestamptz '2026-10-01 00:00+00',timestamptz '2026-11-01 00:00+00'),
 ('year',timestamptz '2026-01-01 00:00+00',timestamptz '2027-01-01 00:00+00')
) w(report_window,lo,hi)
JOIN order_items i ON i.order_id=o.order_id
WHERE o.status='paid' AND o.placed_at>=lo AND o.placed_at<hi
GROUP BY layout,report_window,o.customer_id;
SELECT 'report_results_equal' AS check_name, NOT EXISTS (
 (SELECT report_window,customer_id,line_value FROM report_results WHERE layout='unpartitioned'
  EXCEPT ALL SELECT report_window,customer_id,line_value FROM report_results WHERE layout='monthly')
 UNION ALL
 (SELECT report_window,customer_id,line_value FROM report_results WHERE layout='monthly'
  EXCEPT ALL SELECT report_window,customer_id,line_value FROM report_results WHERE layout='unpartitioned')
) AS ok;
SELECT report_window,count(*) AS customer_groups,sum(line_value) AS total
FROM report_results WHERE layout='monthly' GROUP BY report_window ORDER BY report_window;

SELECT 'unpartitioned_october_report' AS plan_label;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON)
SELECT o.customer_id,SUM(i.quantity*i.unit_price) AS line_value
FROM orders o JOIN order_items i ON i.order_id=o.order_id
WHERE o.status='paid'
AND o.placed_at>=timestamptz '2026-10-01 00:00+00'
AND o.placed_at<timestamptz '2026-11-01 00:00+00'
GROUP BY o.customer_id ORDER BY line_value DESC,o.customer_id;

SELECT 'unpartitioned_year_report' AS plan_label;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON)
SELECT o.customer_id,SUM(i.quantity*i.unit_price) AS line_value
FROM orders o JOIN order_items i ON i.order_id=o.order_id
WHERE o.status='paid'
AND o.placed_at>=timestamptz '2026-01-01 00:00+00'
AND o.placed_at<timestamptz '2027-01-01 00:00+00'
GROUP BY o.customer_id ORDER BY line_value DESC,o.customer_id;

SELECT 'october_report' AS plan_label;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON)
SELECT o.customer_id,SUM(i.quantity*i.unit_price) AS line_value
FROM orders_monthly o JOIN order_items i ON i.order_id=o.order_id
WHERE o.status='paid'
AND o.placed_at>=timestamptz '2026-10-01 00:00+00'
AND o.placed_at<timestamptz '2026-11-01 00:00+00'
GROUP BY o.customer_id ORDER BY line_value DESC,o.customer_id;

SELECT 'year_report' AS plan_label;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON)
SELECT o.customer_id,SUM(i.quantity*i.unit_price) AS line_value
FROM orders_monthly o JOIN order_items i ON i.order_id=o.order_id
WHERE o.status='paid'
AND o.placed_at>=timestamptz '2026-01-01 00:00+00'
AND o.placed_at<timestamptz '2027-01-01 00:00+00'
GROUP BY o.customer_id ORDER BY line_value DESC,o.customer_id;

SELECT 'id_only' AS plan_label;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON)
SELECT * FROM orders_monthly WHERE order_id=103;

SELECT 'transformed_month' AS plan_label;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON)
SELECT count(*) FROM orders_monthly
WHERE EXTRACT(YEAR FROM placed_at AT TIME ZONE 'UTC')=2026
AND EXTRACT(MONTH FROM placed_at AT TIME ZONE 'UTC')=10;

-- A generic prepared plan can remove partitions when execution parameters arrive.
SET LOCAL plan_cache_mode=force_generic_plan;
PREPARE month_lookup(timestamptz,timestamptz) AS
SELECT count(*) FROM orders_monthly WHERE placed_at >= $1 AND placed_at < $2;
SELECT 'parameterised_october' AS plan_label;
EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON)
EXECUTE month_lookup('2026-10-01 00:00+00','2026-11-01 00:00+00');
DEALLOCATE month_lookup;
SET LOCAL plan_cache_mode=auto;

-- Isolated probes: no new business rows are added to either reporting layout.
CREATE TABLE key_demo(order_id integer NOT NULL,placed_at timestamptz NOT NULL,
 PRIMARY KEY(order_id,placed_at)) PARTITION BY RANGE(placed_at);
CREATE TABLE key_oct PARTITION OF key_demo
 FOR VALUES FROM ('2026-10-01 00:00+00') TO ('2026-11-01 00:00+00');
CREATE TABLE key_nov PARTITION OF key_demo
 FOR VALUES FROM ('2026-11-01 00:00+00') TO ('2026-12-01 00:00+00');
INSERT INTO key_demo VALUES(103,'2026-10-20 10:15+00'),(103,'2026-11-01 00:00+00');
SELECT 'different_pairs_allow_same_id' AS check_name,count(*)=2 AS ok
FROM key_demo WHERE order_id=103;
SELECT 'exact_boundary_routes_november' AS check_name,
tableoid='key_nov'::regclass AS ok
FROM key_demo WHERE placed_at='2026-11-01 00:00+00';
CREATE TABLE probe_results(check_name text,ok boolean,sqlstate text);
DO $body$
BEGIN
 BEGIN
  INSERT INTO key_demo VALUES(103,'2026-10-20 10:15+00');
  RAISE EXCEPTION 'Exact pair should be rejected';
 EXCEPTION WHEN unique_violation THEN
  INSERT INTO probe_results VALUES('same_pair_rejected',true,SQLSTATE);
 END;
 BEGIN
  ALTER TABLE key_demo ADD UNIQUE(order_id);
  RAISE EXCEPTION 'ID-only uniqueness should be rejected';
 EXCEPTION WHEN feature_not_supported THEN
  INSERT INTO probe_results VALUES('id_only_unique_refused',true,SQLSTATE);
 END;
 BEGIN
  CREATE TABLE wrong_reference(order_id integer REFERENCES key_demo(order_id));
  RAISE EXCEPTION 'ID-only reference should be rejected';
 EXCEPTION WHEN invalid_foreign_key THEN
  INSERT INTO probe_results VALUES('id_only_reference_refused',true,SQLSTATE);
 END;
 BEGIN
  INSERT INTO key_demo VALUES(103,'2027-01-01 00:00+00');
  RAISE EXCEPTION 'Missing partition should reject the write';
 EXCEPTION WHEN check_violation THEN
  INSERT INTO probe_results VALUES('missing_range_rejected',true,SQLSTATE);
 END;
END $body$;
CREATE TABLE reference_demo(order_id integer NOT NULL,placed_at timestamptz NOT NULL,
 FOREIGN KEY(order_id,placed_at) REFERENCES key_demo(order_id,placed_at));
INSERT INTO reference_demo VALUES(103,'2026-10-20 10:15+00');
DO $body$
BEGIN
 BEGIN
  INSERT INTO reference_demo VALUES(103,'2026-10-21 10:15+00');
  RAISE EXCEPTION 'Wrong composite reference should be rejected';
 EXCEPTION WHEN foreign_key_violation THEN
  INSERT INTO probe_results VALUES('wrong_timestamp_reference_rejected',true,SQLSTATE);
 END;
 BEGIN
  UPDATE key_demo SET placed_at='2026-11-02 00:00+00'
  WHERE order_id=103 AND placed_at='2026-10-20 10:15+00';
  RAISE EXCEPTION 'Referenced key update should be rejected';
 EXCEPTION WHEN foreign_key_violation THEN
  INSERT INTO probe_results VALUES('referenced_key_update_rejected',true,SQLSTATE);
 END;
 BEGIN
  ALTER TABLE key_demo DETACH PARTITION key_oct;
  RAISE EXCEPTION 'Referenced partition detach should be rejected';
 EXCEPTION WHEN foreign_key_violation THEN
  INSERT INTO probe_results VALUES('referenced_detach_rejected',true,SQLSTATE);
 END;
END $body$;
SELECT * FROM probe_results ORDER BY check_name;

-- Date correction without a dependant really moves this isolated row.
DELETE FROM reference_demo;
UPDATE key_demo SET placed_at='2026-11-02 00:00+00'
WHERE order_id=103 AND placed_at='2026-10-20 10:15+00';
SELECT 'key_update_moves_partition' AS check_name,
tableoid='key_nov'::regclass AS ok FROM key_demo WHERE placed_at='2026-11-02 00:00+00';

-- Check eligibility before the independent reporting-copy retirement.
SELECT 'january_wholly_eligible' AS check_name,
bool_and(placed_at<timestamptz '2026-02-01 00:00+00') AS ok FROM orders_2026_01;
SELECT 'january_partial_cutoff_ineligible_rows_exist' AS check_name,
count(*) FILTER(WHERE placed_at>=timestamptz '2026-01-15 00:00+00')>0 AS ok
FROM orders_2026_01;
CREATE TEMP TABLE retirement_before AS
SELECT count(*) AS parent_count,(SELECT count(*) FROM orders_2026_01) AS january_count
FROM orders_monthly;
ALTER TABLE orders_monthly DETACH PARTITION orders_2026_01;
SELECT 'detached_rows_still_exist' AS check_name,
 (SELECT count(*) FROM orders_2026_01)=january_count AND
 (SELECT count(*) FROM orders_monthly)=parent_count-january_count AS ok,
 parent_count,january_count,(SELECT count(*) FROM orders_monthly) AS remaining_parent_count
FROM retirement_before;
DO $body$
BEGIN
 BEGIN
  INSERT INTO orders_monthly VALUES(103,1,'2026-01-20 10:15+00','pending');
  RAISE EXCEPTION 'Late write after retirement should be rejected';
 EXCEPTION WHEN check_violation THEN
  INSERT INTO probe_results VALUES('late_write_after_detach_rejected',true,SQLSTATE);
 END;
END $body$;
SELECT * FROM probe_results WHERE check_name='late_write_after_detach_rejected';
DROP TABLE orders_2026_01;
SELECT 'detached_table_dropped' AS check_name,
to_regclass('orders_2026_01') IS NULL AS ok;
SELECT 'original_authority_and_dependants_unchanged' AS check_name,
 (SELECT count(*) FROM orders)=120003 AND
 (SELECT count(*) FROM order_items)=360005 AND
 (SELECT count(*) FROM payments)=3 AS ok;
ROLLBACK;
