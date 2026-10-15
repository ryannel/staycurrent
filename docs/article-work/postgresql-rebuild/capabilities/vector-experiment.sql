-- Run in a disposable PostgreSQL 18 database with pgvector 0.8.7 installed.
-- psql -v ON_ERROR_STOP=1 -d your_lab -f vector-experiment.sql
-- The setup replaces only tables named pg_cap_vector_*.
CREATE EXTENSION IF NOT EXISTS vector;
SELECT version();
SELECT extversion FROM pg_extension WHERE extname='vector';
DROP TABLE IF EXISTS pg_cap_vector_small, pg_cap_vector_scale, pg_cap_vector_truth;
CREATE TABLE pg_cap_vector_small (id integer PRIMARY KEY, tenant integer NOT NULL, embedding vector(3));
INSERT INTO pg_cap_vector_small(id,tenant,embedding) VALUES
 (1,7,'[1,0,0]'), (2,8,'[0.9,0.1,0]'), (3,7,'[0.8,0.2,0]'), (4,7,'[0,1,0]');
SELECT id, embedding <-> '[1,0,0]'::vector AS distance
FROM pg_cap_vector_small WHERE tenant=7 ORDER BY distance,id LIMIT 2;

CREATE TABLE pg_cap_vector_scale (
 id integer PRIMARY KEY, tenant integer NOT NULL, embedding vector(16) NOT NULL
);
INSERT INTO pg_cap_vector_scale(id,tenant,embedding)
SELECT n,n%50,ARRAY(SELECT sin(n*d*0.73)::real FROM generate_series(1,16) AS dims(d))::vector(16)
FROM generate_series(1,10000) AS items(n);
ANALYZE pg_cap_vector_scale;
-- Fixed synthetic query: the vector of ID 123, which belongs to tenant 23.
-- A scalar subquery supplies it to each ordered search below.
CREATE TABLE pg_cap_vector_truth AS
SELECT id,embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) AS distance
FROM pg_cap_vector_scale WHERE tenant=7 ORDER BY distance,id LIMIT 10;
SELECT * FROM pg_cap_vector_truth ORDER BY distance,id;
CREATE INDEX pg_cap_vector_hnsw ON pg_cap_vector_scale USING hnsw(embedding vector_l2_ops);

BEGIN;
SET LOCAL hnsw.ef_search=40;
SET LOCAL hnsw.iterative_scan=off;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT id FROM pg_cap_vector_scale WHERE tenant=7
ORDER BY embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) LIMIT 10;
WITH candidates AS MATERIALIZED (
 SELECT id,embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) AS distance
 FROM pg_cap_vector_scale WHERE tenant=7
 ORDER BY embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) LIMIT 10
)
SELECT count(*) AS returned, count(t.id) AS exact_top10_hits,
       count(t.id)/10.0 AS recall_at_10,
       array_agg(c.id ORDER BY c.distance,c.id) AS ids
FROM candidates c LEFT JOIN pg_cap_vector_truth t USING(id);
COMMIT;

BEGIN;
SET LOCAL hnsw.ef_search=200;
SET LOCAL hnsw.iterative_scan=off;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT id FROM pg_cap_vector_scale WHERE tenant=7
ORDER BY embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) LIMIT 10;
WITH candidates AS MATERIALIZED (
 SELECT id,embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) AS distance
 FROM pg_cap_vector_scale WHERE tenant=7
 ORDER BY embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) LIMIT 10
)
SELECT count(*) AS returned, count(t.id) AS exact_top10_hits,
       count(t.id)/10.0 AS recall_at_10,
       array_agg(c.id ORDER BY c.distance,c.id) AS ids
FROM candidates c LEFT JOIN pg_cap_vector_truth t USING(id);
COMMIT;

BEGIN;
SET LOCAL hnsw.ef_search=40;
SET LOCAL hnsw.iterative_scan=strict_order;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT id FROM pg_cap_vector_scale WHERE tenant=7
ORDER BY embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) LIMIT 10;
WITH candidates AS MATERIALIZED (
 SELECT id,embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) AS distance
 FROM pg_cap_vector_scale WHERE tenant=7
 ORDER BY embedding <-> (SELECT embedding FROM pg_cap_vector_scale WHERE id=123) LIMIT 10
)
SELECT count(*) AS returned, count(t.id) AS exact_top10_hits,
       count(t.id)/10.0 AS recall_at_10,
       array_agg(c.id ORDER BY c.distance,c.id) AS ids
FROM candidates c LEFT JOIN pg_cap_vector_truth t USING(id);
COMMIT;

-- Variation: repeat with tenant=8, recomputing exact truth before adding an ANN
-- index, or with index scans disabled locally and the exact plan inspected.
-- Never compare filtered ANN answers against an unfiltered exact baseline.
