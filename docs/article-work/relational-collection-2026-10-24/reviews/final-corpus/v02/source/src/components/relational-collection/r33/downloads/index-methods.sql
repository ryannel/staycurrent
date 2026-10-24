-- PostgreSQL 18. Run in a disposable database with psql -X -v ON_ERROR_STOP=1.
-- Synthetic rows: no shop purchases, customers or measured production workload.
CREATE TEMP TABLE method_rows AS
SELECT g AS row_no, timestamp '2026-01-01' + g * interval '1 minute' AS occurred_at,
       CASE WHEN g % 100 = 0 THEN ARRAY['tea','gift'] ELSE ARRAY['tea'] END AS tags,
       repeat('x',100) AS payload
FROM generate_series(1,50000) AS g;
CREATE INDEX method_tags_btree ON method_rows(tags);
ANALYZE method_rows;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT row_no FROM method_rows WHERE tags @> ARRAY['gift'];
CREATE INDEX method_tags_gin ON method_rows USING gin(tags);
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT row_no FROM method_rows WHERE tags @> ARRAY['gift'];
CREATE INDEX method_time_brin ON method_rows USING brin(occurred_at) WITH (pages_per_range=4);
CREATE TEMP TABLE mixed_rows AS SELECT * FROM method_rows ORDER BY (row_no * 7919) % 50000;
CREATE INDEX mixed_time_brin ON mixed_rows USING brin(occurred_at) WITH (pages_per_range=4);
ANALYZE mixed_rows;
-- Deliberately inspect the BRIN route on each physical arrangement.
SET enable_seqscan=off;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT row_no FROM method_rows
WHERE occurred_at >= timestamp '2026-01-01 00:01' AND occurred_at < timestamp '2026-01-01 00:11';
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT row_no FROM mixed_rows
WHERE occurred_at >= timestamp '2026-01-01 00:01' AND occurred_at < timestamp '2026-01-01 00:11';
RESET enable_seqscan;
SELECT 'gift_count',count(*) FROM method_rows WHERE tags @> ARRAY['gift'];
SELECT 'interval_count',count(*) FROM mixed_rows
WHERE occurred_at >= timestamp '2026-01-01 00:01' AND occurred_at < timestamp '2026-01-01 00:11';
SELECT relname,pg_relation_size(oid) AS bytes FROM pg_class
WHERE relname IN ('method_tags_btree','method_tags_gin','method_time_brin','mixed_time_brin');
