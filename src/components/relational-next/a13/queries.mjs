export const setup = `SET TIME ZONE 'UTC';
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
 (106, NULL, NULL, NULL, 'Edda_100%', 'Edda', '2026-01-22 12:00+00');`;
export const logic = `SELECT order_id, fee > 0 AS positive, NOT (fee > 0) AS not_positive,
       (fee > 0 OR fee IS NULL) AS needs_review,
       fee IS DISTINCT FROM 0 AS not_known_zero
FROM order_review ORDER BY order_id;`;
export const conditional = `SELECT order_id,
 CASE WHEN fee IS NULL THEN 'undecided'
      WHEN fee = 0 THEN 'waived'
      WHEN fee < 0 THEN 'credit'
      ELSE 'charged' END AS fee_state,
 COALESCE(NULLIF(preferred_label, ''), customer_name) AS label,
 order_value - COALESCE(paid, 0) AS due
FROM order_review ORDER BY order_id;`;
export const arithmetic = `SELECT 5 / 2 AS lost_fraction, (5 / 2)::numeric AS too_late,
       round(5::numeric / 2, 2) AS decimal_share,
       (-5) / 2 AS negative_integer,
       5::numeric / NULLIF(0, 0) AS no_share;
SELECT round(0.05::numeric * 0.10, 2) * 2 AS per_line,
       round((0.05::numeric + 0.05) * 0.10, 2) AS per_order;
SELECT round(-1.005::numeric, 2), trunc(-1.005::numeric, 2);
SELECT 0.1::double precision + 0.2::double precision = 0.3::double precision
       AS approximate_equal;
-- Cast before the multiplication, not after it:
SELECT 50000::bigint * 50000 AS wide_product;`;
export const text = `-- Optional ICU example: use only on a build with ICU support.
CREATE COLLATION report_search
 (provider = icu, locale = 'und-u-ks-level1', deterministic = false);
SELECT 'José'::text COLLATE "C" = 'Jose' AS exact,
       'José'::text COLLATE report_search = 'JOSE' AS search_match,
       U&'e\\0301' COLLATE "C" = 'é' AS exact_unicode,
       U&'e\\0301' COLLATE report_search = 'é' AS search_unicode;
SELECT 'Mina'::text = 'Mina '::text AS text_space,
       'Mina'::char(5) = 'Mina '::char(5) AS padded_space;
-- Escape the chosen escape character first, then both LIKE wildcards.
SELECT order_id FROM order_review
WHERE preferred_label COLLATE "C" LIKE
 '%' || replace(replace(replace('100%', '!', '!!'), '%', '!%'), '_', '!_') || '%'
 ESCAPE '!'
ORDER BY order_id;`;
export const conversion = `SELECT 20 = '20' AS inferred_integer,
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
-- SELECT '20'::text = 20;`;
export const boundary = `WITH bounds AS (
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
-- Expected: 202, 203. UTC bounds: 29 March 00:00, 29 March 23:00.`;
export const transitions = `SET TIME ZONE 'UTC';
SELECT TIMESTAMP '2026-03-29 01:30' AT TIME ZONE 'Europe/London' AS gap,
       TIMESTAMP '2026-10-25 01:30' AT TIME ZONE 'Europe/London' AS repeated;
-- 01:30 UTC for each; the spring result displays as 02:30 in London.
SELECT TIMESTAMPTZ '2026-10-25 01:30+01' AS first_occurrence,
       TIMESTAMPTZ '2026-10-25 01:30+00' AS second_occurrence;`;
export const calendar = `SET TIME ZONE 'Europe/London';
WITH starts(t) AS (VALUES (TIMESTAMPTZ '2026-03-28 12:00+00'))
SELECT t + INTERVAL '1 day' AS next_local_noon,
       t + INTERVAL '24 hours' AS after_24_hours,
       extract(epoch FROM ((t + INTERVAL '1 day') - t)) / 3600 AS elapsed_hours
FROM starts;
SELECT DATE '2026-01-31' + INTERVAL '1 month' AS next_month;
SET TIME ZONE 'UTC';`;
export const report = `WITH amounts AS (
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
ORDER BY placed_at, order_id;`;
export const expected = [[101,'Mina','charged','16.01'],[102,'Mina','waived','20.00'],[106,'Edda_100%','undecided',null]];
