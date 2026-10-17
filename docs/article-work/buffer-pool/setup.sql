CREATE EXTENSION pg_buffercache;
CREATE EXTENSION pg_prewarm;
CREATE TABLE products (product_id int PRIMARY KEY, name text, price numeric(10,2), description text);
INSERT INTO products SELECT g, 'Product ' || g, (g % 50) + 0.99, repeat('x', 120) FROM generate_series(1, 20000) g;
CREATE TABLE page_views (view_id bigint PRIMARY KEY, product_id int, viewed_at timestamptz, detail text);
INSERT INTO page_views SELECT g, (g % 20000) + 1, now() - g * interval '1 second', repeat('y', 40) FROM generate_series(1, 1200000) g;
VACUUM ANALYZE;
CHECKPOINT;
SELECT relname, pg_relation_size(oid)/8192 AS pages FROM pg_class WHERE relname IN ('products','products_pkey','page_views','page_views_pkey') ORDER BY 1;
