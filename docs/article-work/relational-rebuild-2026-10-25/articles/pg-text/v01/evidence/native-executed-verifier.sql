-- Owned disposable fixture only. Coordinator supplies connection guards.
-- No shop source tables are touched; all changes roll back.
BEGIN;
SET LOCAL statement_timeout = '30s';
CREATE SCHEMA sc_text_probe;
CREATE FUNCTION sc_text_probe.assert(ok boolean, message text) RETURNS void
LANGUAGE plpgsql AS $$ BEGIN IF ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'Assertion failed: %', message; END IF; END $$;
CREATE TABLE sc_text_probe.catalogue_search (
  product_id text PRIMARY KEY, name text NOT NULL,
  description text, stock integer NOT NULL,
  search tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('pg_catalog.english'::regconfig, name), 'A') ||
    setweight(to_tsvector('pg_catalog.english'::regconfig, coalesce(description, '')), 'D')
  ) STORED
);
INSERT INTO sc_text_probe.catalogue_search (product_id,name,description,stock) VALUES
 ('P3','Green tea, 50 g','Loose green tea for a quiet afternoon.',10),
 ('P7','Blue mug','Blue ceramic mugs for tea.',0),
 ('P9','Teapot','Blue teapot for green tea.',4);
CREATE INDEX catalogue_search_gin ON sc_text_probe.catalogue_search USING gin(search);
SELECT 'runtime',version();
SELECT 'catalogue',product_id,name,description,stock,search::text FROM sc_text_probe.catalogue_search ORDER BY product_id;
SELECT 'lexemes', to_tsvector('english','The blue mugs')::text, to_tsvector('simple','The blue mugs')::text, 'The blue mugs'::tsvector::text;
SELECT sc_text_probe.assert(to_tsvector('english','The blue mugs')::text = '''blue'':2 ''mug'':3','English lexemes and stopword gap');
SELECT sc_text_probe.assert(to_tsvector('english','The blue mugs') @@ plainto_tsquery('english','mug'),'normalised mug matches mugs');
SELECT sc_text_probe.assert(NOT (to_tsvector('simple','The blue mugs') @@ plainto_tsquery('english','mug')),'incompatible preparation loses plural');
SELECT 'debug',token,dictionary::text,lexemes FROM ts_debug('english','The blue mugs') WHERE alias <> 'blank';
SELECT 'constructors',plainto_tsquery('english','blue mugs')::text AS plain,phraseto_tsquery('english','blue mugs')::text AS phrase,phraseto_tsquery('english','mugs for tea')::text AS gap,websearch_to_tsquery('english','"blue mugs" OR teapot -green')::text,to_tsquery('english','mug:*A & !green')::text;
SELECT sc_text_probe.assert(phraseto_tsquery('english','mugs for tea')::text = '''mug'' <2> ''tea''','phrase preserves stopword distance');
SELECT 'input_policy',q::text,numnode(q),querytree(q) FROM (VALUES (websearch_to_tsquery('english','the')), (websearch_to_tsquery('english','-mug')), (websearch_to_tsquery('english','blue OR -mug')), (websearch_to_tsquery('english',''))) x(q);
SELECT 'phrases',s,to_tsvector('english',s)::text,to_tsvector('english',s) @@ plainto_tsquery('english','blue mugs'),to_tsvector('english',s) @@ phraseto_tsquery('english','blue mugs') FROM (VALUES ('The blue mugs'),('Blue ceramic mugs'),('Mugs in blue')) x(s);
SELECT 'gaps',s,to_tsvector('english',s) @@ phraseto_tsquery('english','mugs for tea') FROM (VALUES ('Mugs for tea'),('Mugs with tea'),('Mugs tea')) x(s);
SELECT sc_text_probe.assert(to_tsvector('english','Mugs with tea') @@ phraseto_tsquery('english','mugs for tea'),'normalised phrase does not require exact stopword');
SELECT 'field_boundary', (setweight(to_tsvector('english','Blue mug'),'A') || setweight(to_tsvector('english','Blue ceramic mugs for tea.'),'D'))::text,
 (setweight(to_tsvector('english','Blue mug'),'A') || setweight(to_tsvector('english','Blue ceramic mugs for tea.'),'D')) @@ phraseto_tsquery('english','mug blue');
SELECT sc_text_probe.assert((to_tsvector('english','Blue mug') || to_tsvector('english','Blue ceramic mugs for tea.')) @@ phraseto_tsquery('english','mug blue'),'concatenated vectors allow cross-field phrase');
SELECT 'null', (to_tsvector('english','Teapot') || to_tsvector('english',NULL)) IS NULL, (to_tsvector('english','Teapot') || to_tsvector('english',coalesce(NULL::text,'')))::text;
SELECT 'ranking',product_id,stock,ts_rank(search,q) AS frequency_rank,ts_rank_cd(search,q) AS cover_rank,ts_rank_cd(search,q,2) AS length_rank FROM sc_text_probe.catalogue_search CROSS JOIN websearch_to_tsquery('english','blue OR tea') q WHERE search @@ q ORDER BY ts_rank_cd(search,q) DESC,product_id;
SELECT sc_text_probe.assert((SELECT array_agg(product_id ORDER BY ts_rank_cd(search,q) DESC,product_id) FROM sc_text_probe.catalogue_search CROSS JOIN websearch_to_tsquery('english','blue OR tea') q) = ARRAY['P7','P3','P9'],'full ranking P7 P3 P9');
SELECT sc_text_probe.assert((SELECT array_agg(product_id) FROM (SELECT product_id FROM sc_text_probe.catalogue_search CROSS JOIN websearch_to_tsquery('english','blue OR tea') q WHERE search @@ q AND stock > 0 ORDER BY ts_rank_cd(search,q) DESC,product_id LIMIT 2) x) = ARRAY['P3','P9'],'eligible top two P3 P9');
SELECT sc_text_probe.assert((SELECT count(*) FROM (SELECT stock FROM sc_text_probe.catalogue_search CROSS JOIN websearch_to_tsquery('english','blue OR tea') q WHERE search @@ q ORDER BY ts_rank_cd(search,q) DESC,product_id LIMIT 2) x WHERE stock > 0) = 1,'limit before stock filter loses eligible P9');
SELECT 'rank_variations',s,ts_rank(to_tsvector('english',s),plainto_tsquery('english','blue mugs')) AS frequency_rank,ts_rank_cd(to_tsvector('english',s),plainto_tsquery('english','blue mugs')) AS cover_rank,ts_rank_cd(to_tsvector('english',s),plainto_tsquery('english','blue mugs'),2) AS length_rank FROM (VALUES ('blue mugs'),('blue ceramic mugs'),('blue mugs blue mugs'),('blue mugs for a quiet afternoon')) x(s);
SELECT 'headline',ts_headline('english','Blue ceramic mugs for tea.',phraseto_tsquery('english','blue mugs'),'StartSel=[[, StopSel=]], HighlightAll=true');
ANALYZE sc_text_probe.catalogue_search;
SELECT 'normal_plan';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT product_id FROM sc_text_probe.catalogue_search WHERE search @@ phraseto_tsquery('english','mugs for tea');
SET LOCAL enable_seqscan = off;
SELECT 'gin_membership_plan';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT product_id FROM sc_text_probe.catalogue_search WHERE search @@ plainto_tsquery('english','blue');
SELECT 'gin_phrase_plan';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT product_id FROM sc_text_probe.catalogue_search WHERE search @@ phraseto_tsquery('english','blue mugs');
SELECT 'gin_weight_plan';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT product_id FROM sc_text_probe.catalogue_search WHERE search @@ to_tsquery('english','blue:A');
SELECT 'gin_rank_filter_plan';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT product_id,ts_rank_cd(search,q) AS rank FROM sc_text_probe.catalogue_search CROSS JOIN websearch_to_tsquery('english','blue OR tea') q WHERE search @@ q AND stock > 0 ORDER BY rank DESC,product_id LIMIT 2;
CREATE TEMP TABLE reference_result AS SELECT product_id FROM sc_text_probe.catalogue_search WHERE to_tsvector('english',name) || to_tsvector('english',coalesce(description,'')) @@ websearch_to_tsquery('english','blue OR tea');
SELECT sc_text_probe.assert(NOT EXISTS ((SELECT product_id FROM reference_result EXCEPT SELECT product_id FROM sc_text_probe.catalogue_search WHERE search @@ websearch_to_tsquery('english','blue OR tea')) UNION ALL (SELECT product_id FROM sc_text_probe.catalogue_search WHERE search @@ websearch_to_tsquery('english','blue OR tea') EXCEPT SELECT product_id FROM reference_result)),'fresh derivation and stored indexed membership equal');
-- Source edit is maintained on write, unlike changing configuration mappings.
UPDATE sc_text_probe.catalogue_search SET description = 'Ceramic mugs for tea.' WHERE product_id='P7';
SELECT 'source_edit',search::text FROM sc_text_probe.catalogue_search WHERE product_id='P7';
SELECT sc_text_probe.assert((SELECT NOT (search @@ to_tsquery('english','blue:D')) FROM sc_text_probe.catalogue_search WHERE product_id='P7'),'description blue removed while title blue remains');
-- Separate representation-change probe. No changes to built-in configuration.
CREATE TEXT SEARCH CONFIGURATION sc_text_probe.catalogue_v1 (COPY=pg_catalog.english);
CREATE TABLE sc_text_probe.config_probe (body text, search tsvector GENERATED ALWAYS AS (to_tsvector('sc_text_probe.catalogue_v1'::regconfig,body)) STORED);
INSERT INTO sc_text_probe.config_probe(body) VALUES ('Blue mugs');
CREATE INDEX config_gin ON sc_text_probe.config_probe USING gin(search);
ALTER TEXT SEARCH CONFIGURATION sc_text_probe.catalogue_v1 ALTER MAPPING FOR asciiword WITH pg_catalog.simple;
SELECT 'changed_configuration',body,search::text,to_tsvector('sc_text_probe.catalogue_v1',body)::text,search @@ plainto_tsquery('sc_text_probe.catalogue_v1','mugs') FROM sc_text_probe.config_probe;
SELECT sc_text_probe.assert((SELECT NOT(search @@ plainto_tsquery('sc_text_probe.catalogue_v1','mugs')) FROM sc_text_probe.config_probe),'fresh query misses old stored representation');
REINDEX INDEX sc_text_probe.config_gin;
SELECT sc_text_probe.assert((SELECT NOT(search @@ plainto_tsquery('sc_text_probe.catalogue_v1','mugs')) FROM sc_text_probe.config_probe),'reindex alone does not regenerate stored vector');
UPDATE sc_text_probe.config_probe SET body=body;
SELECT 'regenerated',search::text,search @@ plainto_tsquery('sc_text_probe.catalogue_v1','mugs') FROM sc_text_probe.config_probe;
SELECT sc_text_probe.assert((SELECT search @@ plainto_tsquery('sc_text_probe.catalogue_v1','mugs') FROM sc_text_probe.config_probe),'source reassignment regenerates stored vector and index');
SELECT 'all_assertions_passed';
ROLLBACK;
