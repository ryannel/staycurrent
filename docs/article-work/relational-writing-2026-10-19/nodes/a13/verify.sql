\pset null 'NULL'
SELECT version();
SHOW server_version_num;
SELECT datcollate, datctype, datlocprovider FROM pg_database WHERE datname = current_database();
DROP COLLATION IF EXISTS report_search;
SHOW server_encoding;

\echo setup
SET TIME ZONE 'UTC';
SET DateStyle TO 'ISO, DMY';
SET standard_conforming_strings TO on;
-- Snapshot of the parent's five open January candidates.
-- paid = NULL means no receipts in this snapshot; never a null receipt amount.
CREATE TEMP TABLE order_review (
 order_id integer PRIMARY KEY, order_value numeric, paid numeric,
 fee numeric, preferred_label text, customer_name text, placed_at timestamptz
);
INSERT INTO order_review VALUES
 (100, 10, 10, 0, NULL, 'Mina', '2026-01-01 00:00+00'),
 (101, 30, 15, 1.005, NULL, 'Mina', '2026-01-10 09:00+00'),
 (102, 20, NULL, 0, '', 'Mina', '2026-01-10 09:00+00'),
 (103, 40, 40, -2, NULL, 'Tariq', '2026-01-31 23:59:59+00'),
 (106, NULL, NULL, NULL, 'Edda_100%', 'Edda', '2026-01-22 12:00+00');

\echo logic
SELECT order_id, fee > 0 AS positive, NOT (fee > 0) AS not_positive,
       (fee > 0 OR fee IS NULL) AS needs_review,
       fee IS DISTINCT FROM 0 AS not_known_zero
FROM order_review ORDER BY order_id;

\echo conditional
SELECT order_id,
 CASE WHEN fee IS NULL THEN 'undecided'
      WHEN fee = 0 THEN 'waived'
      WHEN fee < 0 THEN 'credit'
      ELSE 'charged' END AS fee_state,
 COALESCE(NULLIF(preferred_label, ''), customer_name) AS label,
 order_value - COALESCE(paid, 0) AS due
FROM order_review ORDER BY order_id;

\echo arithmetic
SELECT 5 / 2 AS lost_fraction, (5 / 2)::numeric AS too_late,
       round(5::numeric / 2, 2) AS decimal_share,
       (-5) / 2 AS negative_integer,
       5::numeric / NULLIF(0, 0) AS no_share;
SELECT round(0.05::numeric * 0.10, 2) * 2 AS per_line,
       round((0.05::numeric + 0.05) * 0.10, 2) AS per_order;
SELECT round(-1.005::numeric, 2), trunc(-1.005::numeric, 2);
SELECT 0.1::double precision + 0.2::double precision = 0.3::double precision
       AS approximate_equal;
-- Cast before the multiplication, not after it:
SELECT 50000::bigint * 50000 AS wide_product;

\echo text
-- Optional ICU example: use only on a build with ICU support.
CREATE COLLATION report_search
 (provider = icu, locale = 'und-u-ks-level1', deterministic = false);
SELECT 'José'::text COLLATE "C" = 'Jose' AS exact,
       'José'::text COLLATE report_search = 'JOSE' AS search_match,
       U&'e\0301' COLLATE "C" = 'é' AS exact_unicode,
       U&'e\0301' COLLATE report_search = 'é' AS search_unicode;
SELECT 'Mina'::text = 'Mina '::text AS text_space,
       'Mina'::char(5) = 'Mina '::char(5) AS padded_space;
-- Escape the chosen escape character first, then both LIKE wildcards.
SELECT order_id FROM order_review
WHERE preferred_label COLLATE "C" LIKE
 '%' || replace(replace(replace('100%', '!', '!!'), '%', '!%'), '_', '!_') || '%'
 ESCAPE '!'
ORDER BY order_id;

\echo conversion
SELECT 20 = '20' AS inferred_integer,
       '10.6'::numeric::integer AS rounded,
       trunc('10.6'::numeric)::integer AS truncated;
SET DateStyle TO 'ISO, DMY';
SELECT '03/04/2026'::date AS ambiguous;
SET DateStyle TO 'ISO, MDY';
SELECT '03/04/2026'::date AS ambiguous;
SET DateStyle TO 'ISO, DMY';
SELECT DATE '2026-04-03' AS explicit_date;
-- Run separately: each fails rather than silently discarding bad text.
-- SELECT 'twenty'::numeric;
-- SELECT '20'::text = 20;

\echo boundary
WITH bounds AS (
 SELECT TIMESTAMP '2026-03-29 00:00' AT TIME ZONE 'Europe/London' AS lo,
        TIMESTAMP '2026-03-30 00:00' AT TIME ZONE 'Europe/London' AS hi
), events(event_id, happened_at) AS (VALUES
 (201, TIMESTAMPTZ '2026-03-28 23:59:59.999999+00'),
 (202, TIMESTAMPTZ '2026-03-29 00:00+00'),
 (203, TIMESTAMPTZ '2026-03-29 22:59:59.999999+00'),
 (204, TIMESTAMPTZ '2026-03-29 23:00+00'),
 (205, TIMESTAMPTZ '2026-03-29 23:30+00')
)
SELECT event_id FROM events CROSS JOIN bounds
WHERE happened_at >= lo AND happened_at < hi
ORDER BY event_id;
-- Expected: 202, 203. UTC bounds: 29 March 00:00, 29 March 23:00.

\echo transitions
SET TIME ZONE 'UTC';
SELECT TIMESTAMP '2026-03-29 01:30' AT TIME ZONE 'Europe/London' AS gap,
       TIMESTAMP '2026-10-25 01:30' AT TIME ZONE 'Europe/London' AS repeated;
-- 01:30 UTC for each; the spring result displays as 02:30 in London.
SELECT TIMESTAMPTZ '2026-10-25 01:30+01' AS first_occurrence,
       TIMESTAMPTZ '2026-10-25 01:30+00' AS second_occurrence;

\echo calendar
SET TIME ZONE 'Europe/London';
WITH starts(t) AS (VALUES (TIMESTAMPTZ '2026-03-28 12:00+00'))
SELECT t + INTERVAL '1 day' AS next_local_noon,
       t + INTERVAL '24 hours' AS after_24_hours,
       extract(epoch FROM ((t + INTERVAL '1 day') - t)) / 3600 AS elapsed_hours
FROM starts;
SELECT DATE '2026-01-31' + INTERVAL '1 month' AS next_month;
SET TIME ZONE 'UTC';

\echo report
WITH amounts AS (
 SELECT order_id, placed_at,
        COALESCE(NULLIF(preferred_label, ''), customer_name) AS label,
        CASE WHEN fee IS NULL THEN 'undecided'
             WHEN fee = 0 THEN 'waived'
             WHEN fee < 0 THEN 'credit' ELSE 'charged' END AS fee_state,
        round(order_value - COALESCE(paid, 0) + fee, 2) AS payable
 FROM order_review
)
SELECT order_id, label, fee_state, payable FROM amounts
WHERE payable > 0 OR payable IS NULL
ORDER BY placed_at, order_id;

SELECT collname, collprovider, collisdeterministic, colllocale, collversion FROM pg_collation WHERE collname = 'report_search';
SHOW TimeZone;
SHOW DateStyle;
SHOW standard_conforming_strings;
SELECT 50000 * 50000;
SELECT (50000 * 50000)::bigint;
SELECT 'twenty'::numeric;
SELECT '20'::text = 20;
SELECT CASE WHEN order_id > 0 THEN 1 ELSE 1/0 END FROM order_review;
SELECT 10.6::numeric::integer, (-10.6)::numeric::integer;
BEGIN;
SELECT CURRENT_TIMESTAMP AS tx, statement_timestamp() AS stmt, clock_timestamp() >= statement_timestamp() AS wall_after_start;
SELECT pg_sleep(0.05);
SELECT CURRENT_TIMESTAMP = transaction_timestamp() AS tx_still_start, statement_timestamp() > transaction_timestamp() AS later_statement, clock_timestamp() >= statement_timestamp() AS wall_after_start;
ROLLBACK;
\echo additional_boundaries_and_policies
SELECT pg_typeof(5/2), pg_typeof(5::numeric/2), pg_typeof(50000::bigint*50000);
SELECT round(16.005::numeric,2), round(1.005::numeric,2), round(-1.005::numeric,2);
SELECT FALSE AND NULL::boolean, TRUE AND NULL::boolean, TRUE OR NULL::boolean, FALSE OR NULL::boolean, NOT NULL::boolean;
SELECT CASE WHEN fee IS NULL THEN 'undecided' ELSE fee END FROM order_review;
SELECT pg_input_is_valid('twenty','numeric'), pg_input_is_valid('1e2','numeric');
SELECT '20'::text::integer = 20;
SELECT 'Mina'::text COLLATE "C" < 'adam'::text AS capital_before_lower;
SELECT 'Edda_1000' LIKE '%100%%' ESCAPE '!' AS unsafe,
       'Edda_1000' LIKE '%100!%%' ESCAPE '!' AS escaped,
       'Edda_100%' LIKE '%!_100!%%' ESCAPE '!' AS literal_underscore_percent,
       'wow!' LIKE '%!!%' ESCAPE '!' AS literal_escape;
SELECT TIMESTAMP '2026-03-29 01:30' AT TIME ZONE 'Europe/London' AT TIME ZONE 'Europe/London' AS gap_display;
SELECT TIMESTAMP '2026-01-01 00:00+05' = TIMESTAMP '2026-01-01 00:00' AS ignored_offset;
SELECT TIMESTAMP '2026-10-25 00:00' AT TIME ZONE 'Europe/London' AS autumn_lo,
       TIMESTAMP '2026-10-26 00:00' AT TIME ZONE 'Europe/London' AS autumn_hi;
WITH bounds AS (
 SELECT TIMESTAMP '2026-10-25 00:00' AT TIME ZONE 'Europe/London' AS lo,
        TIMESTAMP '2026-10-26 00:00' AT TIME ZONE 'Europe/London' AS hi
), events(id,t) AS (VALUES
 (201,TIMESTAMPTZ '2026-10-24 22:59:59.999999+00'),
 (202,TIMESTAMPTZ '2026-10-24 23:00+00'),
 (203,TIMESTAMPTZ '2026-10-25 23:59:59.999999+00'),
 (204,TIMESTAMPTZ '2026-10-26 00:00+00'),
 (205,TIMESTAMPTZ '2026-10-25 23:30+00'))
SELECT id, t >= lo AND t < hi AS local_day, t >= lo AND t < lo + INTERVAL '24 hours' AS duration_day
FROM events CROSS JOIN bounds ORDER BY id;
SET TIME ZONE 'Europe/London';
WITH starts(t) AS (VALUES (TIMESTAMPTZ '2026-10-24 12:00+01'))
SELECT t + INTERVAL '1 day', t + INTERVAL '24 hours',
 extract(epoch FROM ((t + INTERVAL '1 day') - t))/3600 AS elapsed_hours FROM starts;
SET TIME ZONE 'UTC';
SELECT order_id, round(order_value-COALESCE(paid,0)+fee,2) AS payable,
 pg_typeof(round(order_value-COALESCE(paid,0)+fee,2)) AS result_type
FROM order_review ORDER BY order_id;
