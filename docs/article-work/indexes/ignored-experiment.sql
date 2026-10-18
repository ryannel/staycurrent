-- Diagnosis experiments for the Indexes article (17 Oct 2026). PostgreSQL 18.6, database in en_US.UTF-8, run as setup.sql then each block in order.
-- Setup
SET TIME ZONE 'UTC';
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL,
  placed_at timestamptz NOT NULL,
  status text NOT NULL,
  total numeric(10,2) NOT NULL,
  email text NOT NULL,
  shipped_at timestamptz,
  note text NOT NULL
);
INSERT INTO orders
SELECT n, 1 + n % 1000,
       timestamptz '2026-01-01 00:00:00+00' + n * interval '1 minute',
       CASE WHEN (n / 1000) % 5 = 0 THEN 'pending' ELSE 'paid' END,
       (1000 + n % 9000)::numeric / 100,
       'User' || (1 + n % 1000) || '@Example.com',
       CASE WHEN n % 3 = 0 THEN NULL ELSE timestamptz '2026-01-01 00:00:00+00' + n * interval '1 minute' + interval '2 days' END,
       repeat('delivery note ', 12)
FROM generate_series(1,60000) n;
CREATE INDEX orders_customer ON orders(customer_id);
CREATE INDEX orders_status ON orders(status);
ANALYZE orders;

-- ==== q1
\echo == selectivity: status paid (80%)
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT count(*) FROM orders WHERE status='paid';
\echo == selectivity: pending
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE status='pending';
\echo == prove with enable_seqscan off, paid, select *
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT * FROM orders WHERE status='paid';
SET enable_seqscan=off; SET enable_bitmapscan=off;
EXPLAIN (ANALYZE, BUFFERS, COSTS ON, TIMING OFF, SUMMARY OFF) SELECT * FROM orders WHERE status='paid';
RESET enable_seqscan; RESET enable_bitmapscan;
\echo == leading column
CREATE INDEX orders_cust_time ON orders(customer_id, placed_at);
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE placed_at >= '2026-02-01' AND placed_at < '2026-02-01 00:30';
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id=42 AND placed_at >= '2026-02-01';
DROP INDEX orders_cust_time;
\echo == function on column
CREATE INDEX orders_email ON orders(email);
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE lower(email)='user42@example.com';
CREATE INDEX orders_email_lower ON orders(lower(email));
ANALYZE orders;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE lower(email)='user42@example.com';
\echo == implicit conversion int col vs numeric
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id = 42.0;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE customer_id = 42::numeric;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE customer_id = 42::bigint;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE email = 'x'::varchar;
\echo == text col vs int
SELECT order_id FROM orders WHERE email = 42;

-- ==== q2
SET TIME ZONE 'UTC';
\echo == db collation
SELECT datcollate, datctype, datlocprovider FROM pg_database WHERE datname='t';
\echo == LIKE prefix default opclass
CREATE INDEX orders_email2 ON orders(email) ; -- exists orders_email already
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE email LIKE 'User42@%';
CREATE INDEX orders_email_pat ON orders(email text_pattern_ops);
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE email LIKE 'User42@%';
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE email LIKE '%@example.com';
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE email ILIKE 'user42@%';
\echo == C collation index
DROP INDEX orders_email_pat; DROP INDEX orders_email2;
CREATE INDEX orders_email_c ON orders(email COLLATE "C");
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE email LIKE 'User42@%';
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE email COLLATE "C" LIKE 'User42@%';
DROP INDEX orders_email_c;
\echo == range form
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE email >= 'User42@' AND email < 'User42A';
\echo == OR
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id=42 OR customer_id=43;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id=42 OR order_id=7;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id=42 OR total=10.5;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id=42 AND status='pending';
\echo == AND of two indexes
CREATE INDEX orders_total ON orders(total);
ANALYZE orders;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id < 300 AND total = 10.5;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT order_id FROM orders WHERE customer_id = 42 AND total BETWEEN 10 AND 20;

-- ==== q3
SET TIME ZONE 'UTC';
\echo == ordering: shipped_at nullable
CREATE INDEX orders_shipped ON orders(shipped_at);
ANALYZE orders;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY shipped_at LIMIT 10;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY shipped_at DESC LIMIT 10;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY shipped_at DESC NULLS LAST LIMIT 10;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY shipped_at NULLS FIRST LIMIT 10;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE shipped_at IS NULL LIMIT 10;
CREATE INDEX orders_shipped_desc_nl ON orders(shipped_at DESC NULLS LAST);
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY shipped_at DESC NULLS LAST LIMIT 10;
DROP INDEX orders_shipped_desc_nl;
\echo == mixed directions
CREATE INDEX orders_cs ON orders(customer_id, placed_at);
ANALYZE orders;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE customer_id=42 ORDER BY placed_at DESC LIMIT 5;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY customer_id, placed_at DESC LIMIT 5;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY customer_id DESC, placed_at DESC LIMIT 5;
\echo == no limit
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY customer_id, placed_at;
DROP INDEX orders_cs;
\echo == collation of ordering
CREATE INDEX orders_email_l ON orders(email);
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY email LIMIT 10;
EXPLAIN (COSTS OFF) SELECT order_id FROM orders ORDER BY email COLLATE "C" LIMIT 10;
SELECT email FROM (SELECT DISTINCT email FROM orders) s ORDER BY email COLLATE "C" LIMIT 3;
SELECT email FROM (SELECT DISTINCT email FROM orders) s ORDER BY email COLLATE "en_US" LIMIT 3;

-- ==== q4
SET TIME ZONE 'UTC';
\echo == stale statistics
DROP TABLE IF EXISTS events;
CREATE TABLE events (event_id serial PRIMARY KEY, kind text NOT NULL, payload text NOT NULL DEFAULT repeat('x',100));
INSERT INTO events(kind) SELECT 'done' FROM generate_series(1,50000);
CREATE INDEX events_kind ON events(kind);
ANALYZE events;
ALTER TABLE events SET (autovacuum_enabled = off);
INSERT INTO events(kind) SELECT 'new' FROM generate_series(1,40000);
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT * FROM events WHERE kind='new';
EXPLAIN (ANALYZE, COSTS ON, TIMING OFF, SUMMARY OFF, BUFFERS OFF) SELECT * FROM events WHERE kind='new';
ANALYZE events;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT * FROM events WHERE kind='new';
\echo == opposite: rare value, stale says common

-- ==== q6
SET TIME ZONE 'UTC';
EXPLAIN (ANALYZE, COSTS ON, TIMING OFF, SUMMARY OFF, BUFFERS OFF) SELECT * FROM events WHERE kind='new';
SELECT pg_relation_size('events')/8192 heap_pages;
SET enable_indexscan=off; SET enable_bitmapscan=off;
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT * FROM events WHERE kind='new';
RESET enable_indexscan; RESET enable_bitmapscan;
\echo == invalid index
INSERT INTO orders SELECT 60001, 1, now(), 'paid', 1, 'User1@Example.com', NULL, 'dup note' ;
INSERT INTO orders SELECT 60002, 1, now(), 'paid', 1, 'User1@Example.com', NULL, 'dup note' ;
CREATE UNIQUE INDEX CONCURRENTLY orders_email_uq ON orders(email);
SELECT indexrelid::regclass, indisvalid, indisready FROM pg_index WHERE indrelid='orders'::regclass ORDER BY 1;
\d orders
EXPLAIN (COSTS OFF) SELECT order_id FROM orders WHERE email='User5@Example.com';
DROP INDEX CONCURRENTLY orders_email_uq;
DELETE FROM orders WHERE order_id > 60000;
\echo == redundant detection
SELECT a.indexrelid::regclass AS shorter, b.indexrelid::regclass AS longer
FROM pg_index a JOIN pg_index b ON a.indrelid=b.indrelid AND a.indexrelid<>b.indexrelid
 AND a.indisunique=false AND a.indpred IS NULL AND b.indpred IS NULL AND a.indexprs IS NULL AND b.indexprs IS NULL
 AND a.indnkeyatts <= b.indnkeyatts
 AND (string_to_array(a.indkey::text,' '))[1:a.indnkeyatts] = (string_to_array(b.indkey::text,' '))[1:a.indnkeyatts]
WHERE a.indrelid='orders'::regclass;

-- ==== q7
SET TIME ZONE 'UTC';
DROP TABLE IF EXISTS shrink;
CREATE TABLE shrink AS SELECT * FROM orders WHERE order_id <= 60000;
ALTER TABLE shrink ADD PRIMARY KEY (order_id);
CREATE INDEX shrink_cust ON shrink(customer_id, placed_at);
ALTER TABLE shrink SET (autovacuum_enabled=off);
CREATE VIEW sz AS SELECT 'heap' what, pg_relation_size('shrink')/8192 pages UNION ALL SELECT 'index (customer_id, placed_at)', pg_relation_size('shrink_cust')/8192 UNION ALL SELECT 'pkey', pg_relation_size('shrink_pkey')/8192;
\echo before
SELECT * FROM sz;
DELETE FROM shrink WHERE order_id % 10 <> 0;
\echo after delete
SELECT * FROM sz;
VACUUM shrink;
\echo after vacuum
SELECT * FROM sz;
\echo entries/live
SELECT count(*) FROM shrink;
REINDEX INDEX shrink_cust;
REINDEX INDEX shrink_pkey;
\echo after reindex
SELECT * FROM sz;
DROP VIEW sz;
\echo == contiguous delete
DROP TABLE shrink;
CREATE TABLE shrink AS SELECT * FROM orders WHERE order_id <= 60000;
ALTER TABLE shrink ADD PRIMARY KEY (order_id);
CREATE INDEX shrink_cust ON shrink(customer_id, placed_at);
ALTER TABLE shrink SET (autovacuum_enabled=off);
DELETE FROM shrink WHERE order_id <= 54000;
VACUUM shrink;
SELECT pg_relation_size('shrink')/8192 heap, pg_relation_size('shrink_cust')/8192 idx, pg_relation_size('shrink_pkey')/8192 pk;
DROP TABLE shrink;
