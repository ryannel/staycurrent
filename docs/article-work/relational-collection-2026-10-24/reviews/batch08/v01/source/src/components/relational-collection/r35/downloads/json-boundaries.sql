-- PostgreSQL 18. Temporary independent JSON experiments; no core shop changes.
CREATE TEMP TABLE missing_cases(label text, attributes jsonb);
INSERT INTO missing_cases VALUES ('missing','{}'),('JSON null','{"material":null}'),('text','{"material":"ceramic"}'),('SQL NULL',NULL);
SELECT label,attributes ? 'material' AS has_key,
       attributes->'material' AS json_value,
       attributes->>'material' AS text_value,
       jsonb_typeof(attributes->'material') AS json_type
FROM missing_cases;
CREATE TEMP TABLE checked_attributes(attributes jsonb NOT NULL,
 CHECK (jsonb_typeof(attributes)='object'),
 CHECK (NOT(attributes ? 'material') OR jsonb_typeof(attributes->'material')='string'),
 CHECK (NOT(attributes ? 'brewing_c') OR CASE WHEN jsonb_typeof(attributes->'brewing_c')='number'
    THEN (attributes->>'brewing_c')::numeric BETWEEN 0 AND 100 ELSE false END));
INSERT INTO checked_attributes VALUES ('{}'),('{"material":"ceramic"}'),('{"brewing_c":80}');
DO $$
DECLARE bad jsonb;
BEGIN
 FOREACH bad IN ARRAY ARRAY['{"material":null}','{"material":7}','{"brewing_c":"80"}','{"brewing_c":150}','[]']::jsonb[] LOOP
  BEGIN INSERT INTO checked_attributes VALUES (bad); RAISE EXCEPTION 'bad value accepted: %',bad;
  EXCEPTION WHEN check_violation THEN RAISE NOTICE 'rejected as intended: %',bad; END;
 END LOOP;
END $$;
CREATE TEMP TABLE json_catalogue AS
SELECT g AS row_no,
 CASE WHEN g%100=0 THEN jsonb_build_object('material','ceramic','brewing_c',80)
 ELSE jsonb_build_object('material','steel') END AS attributes
FROM generate_series(1,50000) g;
CREATE INDEX json_path ON json_catalogue USING gin(attributes jsonb_path_ops);
ANALYZE json_catalogue;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) SELECT row_no FROM json_catalogue WHERE attributes @> '{"material":"ceramic"}';
-- Inspect eligibility deliberately; path_ops does not support key existence.
SET enable_seqscan=off;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) SELECT row_no FROM json_catalogue WHERE attributes ? 'brewing_c';
DROP INDEX json_path;
CREATE INDEX json_default ON json_catalogue USING gin(attributes);
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) SELECT row_no FROM json_catalogue WHERE attributes ? 'brewing_c';
RESET enable_seqscan;
CREATE INDEX json_material ON json_catalogue((attributes->>'material'));
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) SELECT row_no FROM json_catalogue WHERE attributes->>'material'='ceramic';
SELECT 'containment',count(*) FROM json_catalogue WHERE attributes @> '{"material":"ceramic"}';
SELECT 'existence',count(*) FROM json_catalogue WHERE attributes ? 'brewing_c';
CREATE TEMP TABLE patch_example (id integer PRIMARY KEY, doc jsonb);
INSERT INTO patch_example VALUES (1,'{"left":1,"right":1}');
CREATE TEMP TABLE saved_client AS SELECT doc FROM patch_example WHERE id=1;
UPDATE patch_example SET doc=jsonb_set(doc,'{left}','2') WHERE id=1;
UPDATE patch_example SET doc=jsonb_set((SELECT doc FROM saved_client),'{right}','2') WHERE id=1;
SELECT 'stale replacement loses left',doc FROM patch_example;
UPDATE patch_example SET doc='{"left":1,"right":1}' WHERE id=1;
UPDATE patch_example SET doc=jsonb_set(doc,'{left}','2') WHERE id=1;
UPDATE patch_example SET doc=jsonb_set(doc,'{right}','2') WHERE id=1;
SELECT 'database expressions preserve both',doc FROM patch_example;
