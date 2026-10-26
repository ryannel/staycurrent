-- Full-text search in PostgreSQL: a three-product teaching experiment.
-- Run in a fresh session. All rows are temporary; the transaction rolls back.
-- Illustrative descriptions; names and post-order-103 stock are fixed.
BEGIN;
SET LOCAL statement_timeout = '30s';
CREATE TEMP TABLE catalogue_search (
  product_id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  stock integer NOT NULL,
  search tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('pg_catalog.english'::regconfig, name), 'A') ||
    setweight(to_tsvector('pg_catalog.english'::regconfig,
                         coalesce(description, '')), 'D')
  ) STORED
) ON COMMIT DROP;
INSERT INTO pg_temp.catalogue_search(product_id,name,description,stock) VALUES
 ('P3','Green tea, 50 g','Loose green tea for a quiet afternoon.',10),
 ('P7','Blue mug','Blue ceramic mugs for tea.',0),
 ('P9','Teapot','Blue teapot for green tea.',4);
CREATE INDEX catalogue_search_gin ON pg_temp.catalogue_search USING gin(search);

SELECT version();
SELECT product_id,search FROM pg_temp.catalogue_search ORDER BY product_id;
SELECT to_tsvector('english','The blue mugs') AS english,
       to_tsvector('simple','The blue mugs') AS simple;
SELECT token,dictionary,lexemes FROM ts_debug('english','The blue mugs')
WHERE alias <> 'blank';
SELECT plainto_tsquery('english','blue mugs') AS all_words,
       phraseto_tsquery('english','blue mugs') AS phrase,
       phraseto_tsquery('english','mugs for tea') AS stopword_gap,
       websearch_to_tsquery('english','"blue mugs" OR teapot -green') AS web_style;

-- Diagnostic snippets are not extra products.
SELECT snippet, to_tsvector('english',snippet) AS vector,
       to_tsvector('english',snippet) @@ plainto_tsquery('english','blue mugs') AS all_words,
       to_tsvector('english',snippet) @@ phraseto_tsquery('english','blue mugs') AS phrase
FROM (VALUES ('The blue mugs'),('Blue ceramic mugs'),('Mugs in blue')) AS x(snippet);

-- Query: blue OR tea. Unfiltered scores: P7 1.2, P3 1.1, P9 0.2.
SELECT product_id,stock,ts_rank_cd(search,query) AS rank
FROM pg_temp.catalogue_search
CROSS JOIN websearch_to_tsquery('english','blue OR tea') AS query
WHERE search @@ query
ORDER BY rank DESC,product_id;

-- Correct result: P3, P9. All eligibility conditions precede final selection.
SELECT product_id,name,ts_rank_cd(search,query) AS rank
FROM pg_temp.catalogue_search
CROSS JOIN websearch_to_tsquery('english','blue OR tea') AS query
WHERE search @@ query AND stock > 0
ORDER BY rank DESC,product_id LIMIT 2;

-- Counterexample: an early limit loses P9; the outer query returns only P3.
SELECT product_id,rank FROM (
  SELECT product_id,stock,ts_rank_cd(search,query) AS rank
  FROM pg_temp.catalogue_search
  CROSS JOIN websearch_to_tsquery('english','blue OR tea') AS query
  WHERE search @@ query
  ORDER BY rank DESC,product_id LIMIT 2
) AS limited WHERE stock > 0 ORDER BY rank DESC,product_id;

SELECT snippet,
       ts_rank(to_tsvector('english',snippet),query) AS frequency_rank,
       ts_rank_cd(to_tsvector('english',snippet),query) AS cover_rank,
       ts_rank_cd(to_tsvector('english',snippet),query,2) AS length_rank
FROM (VALUES ('blue mugs'),('blue ceramic mugs'),('blue mugs blue mugs'),
             ('blue mugs for a quiet afternoon')) AS x(snippet)
CROSS JOIN plainto_tsquery('english','blue mugs') AS query;

-- Highlighting can mark query words even where the phrase is false.
SELECT ts_headline('english','Blue ceramic mugs for tea.',
  phraseto_tsquery('english','blue mugs'),
  'StartSel=[[, StopSel=]], HighlightAll=true');

ANALYZE pg_temp.catalogue_search;
EXPLAIN (ANALYZE, BUFFERS)
SELECT product_id,ts_rank_cd(search,query) AS rank
FROM pg_temp.catalogue_search
CROSS JOIN websearch_to_tsquery('english','blue OR tea') AS query
WHERE search @@ query AND stock > 0
ORDER BY rank DESC,product_id LIMIT 2;
-- A sequential scan is plausible for three rows; this is not a benchmark.
ROLLBACK;
