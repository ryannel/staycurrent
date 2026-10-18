-- Indexing queries: every measurement the article quotes. PostgreSQL 18.
-- Run: psql -X -q -d scratch -f setup.sql -f helpers.sql -f experiment.sql
-- Page counts are shared buffers hit + read for the whole plan. No timings.
SET TIME ZONE 'UTC';

\echo ===== 1. Joins and the foreign-key index
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
\echo == JOIN: customers in region north (5) with their orders
\set j 'SELECT c.name, o.order_id, o.total FROM customers c JOIN orders o ON o.customer_id = c.customer_id WHERE c.region = ''north'''
SELECT pages(:'j');
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, COSTS OFF) SELECT c.name, o.order_id, o.total FROM customers c JOIN orders o ON o.customer_id = c.customer_id WHERE c.region = 'north';
CREATE INDEX orders_customer_idx ON orders (customer_id);
ANALYZE orders;
SELECT pages(:'j');
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, COSTS OFF) SELECT c.name, o.order_id, o.total FROM customers c JOIN orders o ON o.customer_id = c.customer_id WHERE c.region = 'north';
SELECT pg_relation_size('orders_customer_idx')/8192 AS idx_pages;
INSERT INTO customers VALUES (1001,'Temp','other');
\echo -- foreign-key delete: pages of orders and of the index read by DELETE FROM customers
DROP INDEX IF EXISTS orders_customer_idx;
CREATE INDEX orders_customer_idx ON orders (customer_id);
BEGIN;
SELECT pg_stat_get_xact_blocks_fetched('orders'::regclass) o0, pg_stat_get_xact_blocks_fetched('orders_customer_idx'::regclass) i0 \gset
DELETE FROM customers WHERE customer_id = 1001;
SELECT pg_stat_get_xact_blocks_fetched('orders'::regclass)-:o0 AS orders_pages, pg_stat_get_xact_blocks_fetched('orders_customer_idx'::regclass)-:i0 AS idx_pages;
ROLLBACK;
DROP INDEX orders_customer_idx;
BEGIN;
SELECT pg_stat_get_xact_blocks_fetched('orders'::regclass) o0 \gset
DELETE FROM customers WHERE customer_id = 1001;
SELECT pg_stat_get_xact_blocks_fetched('orders'::regclass)-:o0 AS orders_pages;
ROLLBACK;
DELETE FROM customers WHERE customer_id = 1001;

\echo -- the same delete when only a composite index leads with customer_id
DROP INDEX IF EXISTS orders_customer_idx, o_cp;
INSERT INTO customers VALUES (1001,'Temp','other');
CREATE INDEX o_cp ON orders (customer_id, placed_at DESC, order_id DESC);
BEGIN;
SELECT pg_stat_get_xact_blocks_fetched('orders'::regclass) o0, pg_stat_get_xact_blocks_fetched('o_cp'::regclass) i0 \gset
DELETE FROM customers WHERE customer_id = 1001;
SELECT pg_stat_get_xact_blocks_fetched('orders'::regclass)-:o0 AS orders_pages, pg_stat_get_xact_blocks_fetched('o_cp'::regclass)-:i0 AS idx_pages;
ROLLBACK;
DROP INDEX o_cp;
DELETE FROM customers WHERE customer_id = 1001;

\echo ===== 2. Order and LIMIT
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
\set q1 'SELECT order_id, placed_at, total FROM orders WHERE customer_id = 42 ORDER BY placed_at DESC LIMIT 20'
\set q2 'SELECT order_id, placed_at, total FROM orders WHERE customer_id = 42 AND status = ''paid'' ORDER BY placed_at DESC LIMIT 20'
\set q3 'SELECT order_id, placed_at FROM orders ORDER BY placed_at DESC, order_id DESC LIMIT 20'
\set q4 'SELECT order_id, placed_at FROM orders WHERE customer_id = 42 ORDER BY placed_at ASC, order_id DESC LIMIT 20'
\echo no index
SELECT pages(:'q1'); SELECT pages(:'q3');
CREATE INDEX o_c ON orders (customer_id); ANALYZE orders;
\echo (customer_id)
SELECT pages(:'q1'); SELECT pages(:'q2');
DROP INDEX o_c;
CREATE INDEX o_cp ON orders (customer_id, placed_at DESC); ANALYZE orders;
\echo (customer_id, placed_at DESC)
SELECT pages(:'q1'); SELECT pages(:'q2');
SELECT pages(:'q4');
DROP INDEX o_cp;
CREATE INDEX o_csp ON orders (customer_id, status, placed_at DESC); ANALYZE orders;
\echo (customer_id, status, placed_at DESC)
SELECT pages(:'q1'); SELECT pages(:'q2');
DROP INDEX o_csp;
CREATE INDEX o_cps ON orders (customer_id, placed_at DESC, status); ANALYZE orders;
\echo (customer_id, placed_at DESC, status)
SELECT pages(:'q2');
DROP INDEX o_cps;
CREATE INDEX o_p ON orders (placed_at DESC, order_id DESC); ANALYZE orders;
\echo global feed (placed_at DESC, order_id DESC)
SELECT pages(:'q3');
\echo ASC index scanned backward
DROP INDEX o_p;
CREATE INDEX o_pa ON orders (placed_at, order_id); ANALYZE orders;
SELECT pages(:'q3');
DROP INDEX o_pa;
\echo mixed direction: index (customer_id, placed_at, order_id) for ASC, DESC
CREATE INDEX o_mix ON orders (customer_id, placed_at, order_id); ANALYZE orders;
SELECT pages(:'q4');
DROP INDEX o_mix;
CREATE INDEX o_mix2 ON orders (customer_id, placed_at, order_id DESC); ANALYZE orders;
SELECT pages(:'q4');
DROP INDEX o_mix2;

\echo ===== 3. Offset against keyset
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
CREATE INDEX o_feed ON orders (placed_at DESC, order_id DESC); ANALYZE orders;
-- page 1000 of 20 rows: positions 19981..20000
SELECT placed_at AS last_t, order_id AS last_id FROM orders ORDER BY placed_at DESC, order_id DESC OFFSET 19979 LIMIT 1 \gset
\echo boundary :last_t :last_id
\set off 'SELECT order_id, placed_at, total FROM orders ORDER BY placed_at DESC, order_id DESC OFFSET 19980 LIMIT 20'
\set key 'SELECT order_id, placed_at, total FROM orders WHERE (placed_at, order_id) < (''':last_t''', ':last_id') ORDER BY placed_at DESC, order_id DESC LIMIT 20'
\echo page 1 offset 0
SELECT pages('SELECT order_id, placed_at, total FROM orders ORDER BY placed_at DESC, order_id DESC LIMIT 20');
\echo page 1000 offset
SELECT pages(:'off');
\echo page 1000 keyset
SELECT pages(:'key');
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT order_id, placed_at, total FROM orders WHERE (placed_at, order_id) < (:'last_t', :last_id) ORDER BY placed_at DESC, order_id DESC LIMIT 20;
\echo page 3000 (offset 59980)
SELECT pages('SELECT order_id, placed_at, total FROM orders ORDER BY placed_at DESC, order_id DESC OFFSET 59960 LIMIT 20');
\echo no index at all
DROP INDEX o_feed;
SELECT pages(:'off');
SELECT pages(:'key');
\echo mixed directions
CREATE INDEX o_mixed ON orders (placed_at DESC, order_id ASC); ANALYZE orders;
SELECT pages('SELECT order_id, placed_at, total FROM orders WHERE placed_at < '''||:'last_t'||''' OR (placed_at = '''||:'last_t'||''' AND order_id > '||:last_id||') ORDER BY placed_at DESC, order_id ASC LIMIT 20');
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT order_id, placed_at, total FROM orders WHERE placed_at < :'last_t' OR (placed_at = :'last_t' AND order_id > :last_id) ORDER BY placed_at DESC, order_id ASC LIMIT 20;
\echo mixed with row-compare wrongly
SELECT pages('SELECT order_id FROM orders WHERE (placed_at, order_id) < ('''||:'last_t'||''','||:last_id||') ORDER BY placed_at DESC, order_id ASC LIMIT 20');
DROP INDEX o_mixed;
SELECT placed_at AS last_t, order_id AS last_id FROM orders ORDER BY placed_at DESC, order_id DESC OFFSET 19979 LIMIT 1 \gset
CREATE INDEX o_mixed ON orders (placed_at DESC, order_id ASC); ANALYZE orders;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT order_id, placed_at, total FROM orders WHERE placed_at <= :'last_t' AND (placed_at < :'last_t' OR order_id > :last_id) ORDER BY placed_at DESC, order_id ASC LIMIT 20;
DROP INDEX o_mixed;
\echo nulls
CREATE TEMP TABLE t(id int primary key, shipped_at timestamptz);
INSERT INTO t SELECT n, CASE WHEN n%4=0 THEN NULL ELSE now() - n*interval '1 hour' END FROM generate_series(1,20) n;
SELECT id, shipped_at IS NULL AS n FROM t ORDER BY shipped_at DESC, id DESC LIMIT 6;
SELECT count(*) FROM t WHERE (shipped_at, id) < (now(), 10);
SELECT (NULL::timestamptz, 5) < (now(), 10) AS r;

\echo ===== 4. LIKE
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
\set q 'SELECT account_id FROM accounts WHERE email LIKE ''ab1%'''
\set qi 'SELECT account_id FROM accounts WHERE lower(email) LIKE ''ab1%'''
\set qw 'SELECT account_id FROM accounts WHERE email LIKE ''%ab1%'''
\set qeq 'SELECT account_id FROM accounts WHERE email = ''ab12ab12ab12@example.com'''
SELECT pages(:'q');
CREATE INDEX a_email ON accounts (email); ANALYZE accounts;
\echo default-collation index
SELECT pages(:'q');
SELECT pages(:'qeq');
SELECT pg_relation_size('a_email')/8192 AS idx;
DROP INDEX a_email;
CREATE INDEX a_email_pat ON accounts (email text_pattern_ops); ANALYZE accounts;
\echo text_pattern_ops
SELECT pages(:'q');
SELECT pages(:'qeq');
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT account_id FROM accounts WHERE email LIKE 'ab1%';
SELECT pages(:'qw');
DROP INDEX a_email_pat;
CREATE INDEX a_email_c ON accounts (email COLLATE "C"); ANALYZE accounts;
\echo COLLATE C index, query as written and with COLLATE C
SELECT pages(:'q');
SELECT pages('SELECT account_id FROM accounts WHERE email COLLATE "C" LIKE ''ab1%''');
DROP INDEX a_email_c;
\echo lower()
CREATE INDEX a_lower ON accounts (lower(email) text_pattern_ops); ANALYZE accounts;
SELECT pages(:'qi');
SELECT pages('SELECT account_id FROM accounts WHERE email ILIKE ''ab1%''');
DROP INDEX a_lower;
\echo pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX a_trgm ON accounts USING gin (email gin_trgm_ops); ANALYZE accounts;
SELECT pages(:'qw');
SELECT pg_relation_size('a_trgm')/8192 AS idx;
DROP INDEX a_trgm;
\echo explicit range alternative
CREATE INDEX a_email ON accounts (email); ANALYZE accounts;
SELECT pages('SELECT account_id FROM accounts WHERE email >= ''ab1'' AND email < ''ab2''');
DROP INDEX a_email;

\echo ===== 5. OR and combining indexes
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
CREATE INDEX o_c ON orders (customer_id);
CREATE INDEX o_p ON orders (placed_at);
CREATE INDEX o_s ON orders (status);
ANALYZE orders;
\echo OR across columns, two indexes
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 OR order_id = 777');
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 OR placed_at >= timestamptz ''2026-02-11 00:00:00+00''');
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 OR status = ''pending''');
\echo OR where one branch has no index (total)
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 OR total = 19.99');
\echo OR on same column and IN
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 OR customer_id = 43');
SELECT pages('SELECT order_id FROM orders WHERE customer_id IN (42,43,44)');
\echo AND of two single-column indexes
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 AND placed_at >= timestamptz ''2026-02-01 00:00:00+00'' AND placed_at < timestamptz ''2026-02-11 00:00:00+00''');
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT order_id FROM orders WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00' AND placed_at < timestamptz '2026-02-11 00:00:00+00';
DROP INDEX o_s, o_p;
\echo composite alternative
CREATE INDEX o_cp ON orders (customer_id, placed_at);
DROP INDEX o_c; ANALYZE orders;
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 AND placed_at >= timestamptz ''2026-02-01 00:00:00+00'' AND placed_at < timestamptz ''2026-02-11 00:00:00+00''');
SELECT pg_relation_size('o_cp')/8192;
\echo OR with composite only
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 OR order_id = 777');
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 UNION SELECT order_id FROM orders WHERE order_id = 777');
\echo OR rewritten as UNION ALL (two indexes: o_cp + pk)
SELECT pages('SELECT order_id FROM orders WHERE customer_id = 42 UNION ALL SELECT order_id FROM orders WHERE order_id = 777 AND customer_id <> 42');
DROP INDEX o_cp;
CREATE INDEX o_c ON orders (customer_id);
CREATE INDEX o_t ON orders (total);
ANALYZE orders;
\set q 'SELECT order_id FROM orders WHERE customer_id BETWEEN 40 AND 59 AND total BETWEEN 20.00 AND 22.00'
SELECT pages(:'q');
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,COSTS OFF) SELECT account_id FROM accounts WHERE email LIKE 'ab1%';
SELECT pages('SELECT order_id FROM orders WHERE customer_id BETWEEN 40 AND 59');
SELECT pages('SELECT order_id FROM orders WHERE total BETWEEN 20.00 AND 22.00');
SET enable_bitmapscan=off;
SELECT pages(:'q');
RESET enable_bitmapscan;
CREATE INDEX o_ct ON orders (customer_id, total); ANALYZE orders;
DROP INDEX o_c, o_t;
SELECT pages(:'q');
SELECT pg_relation_size('o_ct')/8192;
DROP INDEX o_ct;

\echo ===== 6. Conditions that defeat an index
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
DROP INDEX IF EXISTS o_cp, o_c, o_p;
CREATE INDEX o_c ON orders (customer_id);
CREATE INDEX o_p ON orders (placed_at);
ANALYZE orders;
\echo function on column
SELECT pages('SELECT total FROM orders WHERE placed_at >= timestamptz ''2026-02-01 00:00:00+00'' AND placed_at < timestamptz ''2026-02-02 00:00:00+00''');
SELECT pages('SELECT total FROM orders WHERE date_trunc(''day'', placed_at) = timestamptz ''2026-02-01 00:00:00+00''');
SELECT pages('SELECT total FROM orders WHERE customer_id = 42');
SELECT pages('SELECT total FROM orders WHERE customer_id + 0 = 42');
SELECT pages('SELECT total FROM orders WHERE customer_id::text = ''42''');
SELECT pages('SELECT total FROM orders WHERE customer_id = 42::numeric');
SELECT pages('SELECT total FROM orders WHERE customer_id = 42::bigint');
SELECT pages('SELECT total FROM orders WHERE customer_id = ANY(ARRAY[42,43])');
\echo negation
SELECT pages('SELECT total FROM orders WHERE customer_id <> 42');
SELECT pages('SELECT total FROM orders WHERE customer_id NOT IN (1,2,3)');
\echo GROUP BY / DISTINCT served by order
SELECT pages('SELECT customer_id, count(*) FROM orders GROUP BY customer_id');
SELECT pages('SELECT customer_id, sum(total) FROM orders GROUP BY customer_id');
EXPLAIN (COSTS OFF) SELECT customer_id, sum(total) FROM orders GROUP BY customer_id;
DROP INDEX o_p;
CREATE INDEX o_cp ON orders (customer_id, placed_at DESC, order_id DESC); ANALYZE orders;
\echo latest order per customer, lateral
SELECT pages('SELECT c.customer_id, l.order_id FROM customers c CROSS JOIN LATERAL (SELECT order_id FROM orders o WHERE o.customer_id = c.customer_id ORDER BY placed_at DESC, order_id DESC LIMIT 1) l');
SELECT pages('SELECT c.customer_id, l.order_id FROM customers c CROSS JOIN LATERAL (SELECT order_id FROM orders o WHERE o.customer_id = c.customer_id ORDER BY placed_at DESC, order_id DESC LIMIT 1) l WHERE c.region = ''north''');
DROP INDEX o_c;
SELECT pages('SELECT c.customer_id, l.order_id FROM customers c CROSS JOIN LATERAL (SELECT order_id FROM orders o WHERE o.customer_id = c.customer_id ORDER BY placed_at DESC, order_id DESC LIMIT 1) l');
DROP INDEX o_cp;
SELECT pages('SELECT c.customer_id, l.order_id FROM customers c CROSS JOIN LATERAL (SELECT order_id FROM orders o WHERE o.customer_id = c.customer_id ORDER BY placed_at DESC, order_id DESC LIMIT 1) l WHERE c.region = ''north''');

\echo ===== 6b. DISTINCT and DISTINCT ON
DROP INDEX IF EXISTS o_c, o_p, o_cp;
SELECT pages('SELECT DISTINCT customer_id FROM orders');
CREATE INDEX o_c ON orders (customer_id); ANALYZE orders;
SELECT pages('SELECT DISTINCT customer_id FROM orders');
DROP INDEX o_c;
CREATE INDEX o_cp ON orders (customer_id, placed_at DESC, order_id DESC); ANALYZE orders;
SELECT pages('SELECT DISTINCT ON (customer_id) customer_id, order_id FROM orders ORDER BY customer_id, placed_at DESC, order_id DESC');
DROP INDEX o_cp;

\echo ===== 7. Partial indexes: queue and soft delete
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
\echo queue
DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (job_id integer PRIMARY KEY, state text NOT NULL, created_at timestamptz NOT NULL, payload text NOT NULL);
INSERT INTO jobs SELECT n, CASE WHEN n > 59400 THEN 'queued' ELSE 'done' END, timestamptz '2026-01-01' + n*interval '1 minute', repeat('x',100) FROM generate_series(1,60000) n;
VACUUM ANALYZE jobs;
CREATE INDEX jobs_state_created ON jobs (state, created_at);
\set claim 'SELECT job_id FROM jobs WHERE state = ''queued'' ORDER BY created_at LIMIT 1'
SELECT pages(:'claim');
SELECT pg_relation_size('jobs_state_created')/8192 AS full_idx;
DROP INDEX jobs_state_created;
CREATE INDEX jobs_queued ON jobs (created_at) WHERE state = 'queued'; ANALYZE jobs;
SELECT pages(:'claim');
SELECT pg_relation_size('jobs_queued')/8192 AS partial_idx;
-- after all but 600 are done and jobs finish: partial index shrinks? update 500 queued to done
UPDATE jobs SET state='done' WHERE job_id BETWEEN 59401 AND 59900;
SELECT pages(:'claim');
-- the planner needs query to imply predicate
SELECT pages('SELECT job_id FROM jobs WHERE state <> ''done'' ORDER BY created_at LIMIT 1');
\echo with parameter
PREPARE c(text) AS SELECT job_id FROM jobs WHERE state = $1 ORDER BY created_at LIMIT 1;
EXPLAIN (COSTS OFF) EXECUTE c('queued');
DEALLOCATE c;
\echo soft delete unique
DROP INDEX IF EXISTS a_email_u;
CREATE UNIQUE INDEX a_email_u ON accounts (lower(email)) WHERE deleted_at IS NULL;
INSERT INTO accounts VALUES (70001, 'dup@example.com', NULL);
UPDATE accounts SET deleted_at = now() WHERE account_id = 70001;
INSERT INTO accounts VALUES (70002, 'dup@example.com', NULL);
INSERT INTO accounts VALUES (70003, 'DUP@example.com', NULL); -- expected error: lower(email) matches the live row 70002
DELETE FROM accounts WHERE account_id > 70000;

\echo ===== 8. Generic plans and tenants
DROP INDEX IF EXISTS orders_customer_idx, o_c, o_p, o_s, o_t, o_cp, o_csp, o_cps, o_pa, o_mix, o_mix2, o_feed, o_mixed, o_ct, a_email, a_email_pat, a_email_c, a_lower, a_trgm, a_email_u;
SET plan_cache_mode = force_generic_plan;
PREPARE c(text) AS SELECT job_id FROM jobs WHERE state = $1 ORDER BY created_at LIMIT 1;
EXPLAIN (COSTS OFF) EXECUTE c('queued');
RESET plan_cache_mode;
\echo tenant skew
DROP TABLE IF EXISTS events;
CREATE TABLE events (event_id integer PRIMARY KEY, tenant_id integer NOT NULL, created_at timestamptz NOT NULL, body text NOT NULL);
INSERT INTO events SELECT n, CASE WHEN n % 2 = 0 THEN 1 ELSE 2 + n % 500 END, timestamptz '2026-01-01' + n*interval '1 minute', repeat('e',100) FROM generate_series(1,60000) n;
VACUUM ANALYZE events;
CREATE INDEX ev_tc ON events (tenant_id, created_at DESC);
SELECT pg_relation_size('events')/8192 AS table_pages;
\set big 'SELECT event_id FROM events WHERE tenant_id = 1 ORDER BY created_at DESC LIMIT 20'
\set small 'SELECT event_id FROM events WHERE tenant_id = 77 ORDER BY created_at DESC LIMIT 20'
SELECT pages(:'big'); SELECT pages(:'small');
SELECT pages('SELECT event_id, body FROM events WHERE tenant_id = 1');
SELECT pages('SELECT event_id, body FROM events WHERE tenant_id = 77');
SELECT pages('SELECT event_id FROM events WHERE tenant_id = 1 AND created_at >= timestamptz ''2026-02-10''');
\echo without leading tenant: only created_at index
DROP INDEX ev_tc; CREATE INDEX ev_c ON events (created_at DESC); ANALYZE events;
SELECT pages(:'big'); SELECT pages(:'small');
DROP INDEX ev_c;
