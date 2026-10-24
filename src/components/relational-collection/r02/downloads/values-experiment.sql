-- Values, missing data and equality. Checked on PostgreSQL 18.6.
-- Run in a disposable database: psql -X -v ON_ERROR_STOP=1 -f values-experiment.sql
-- All created relations are temporary and the transaction is rolled back.
BEGIN;
SET LOCAL TIME ZONE 'UTC';
SET LOCAL DateStyle = 'ISO, YMD';
SET LOCAL search_path = pg_temp, pg_catalog;
\pset null '(NULL)'

SELECT version(), current_setting('server_encoding') AS encoding;

SELECT 0.1::numeric + 0.2::numeric = 0.3::numeric AS decimal_equal,
       0.1::double precision + 0.2::double precision
         = 0.3::double precision AS float_equal;
SELECT 1.005::numeric(8,2) AS stored_at_scale_two;
SELECT round(3 * 0.335::numeric, 2) AS round_line,
       3 * round(0.335::numeric, 2) AS round_unit;

-- Only the columns these examples read, using the unchanged core rows.
CREATE TEMP TABLE orders (order_id integer PRIMARY KEY, placed_at timestamptz NOT NULL);
INSERT INTO orders VALUES
 (101, '2026-10-12 09:30:00Z'),
 (102, '2026-10-14 16:05:00Z'),
 (103, '2026-10-20 10:15:00Z');
CREATE TEMP TABLE payments (payment_id integer PRIMARY KEY, order_id integer NOT NULL, amount numeric(8,2) NOT NULL);
INSERT INTO payments VALUES (501,101,30.00),(502,101,9.50),(503,102,40.00);

SELECT timestamptz '2026-11-04 18:00:00Z'
         AT TIME ZONE 'Europe/Stockholm' AS local_start;
SELECT timestamptz '2026-10-25 00:00:00 Europe/Stockholm' AS day_start_utc,
       timestamptz '2026-10-26 00:00:00 Europe/Stockholm' AS next_midnight_utc,
       extract(epoch FROM (
         timestamptz '2026-10-26 00:00:00 Europe/Stockholm' -
         timestamptz '2026-10-25 00:00:00 Europe/Stockholm')) / 3600 AS hours;
SELECT order_id, placed_at FROM orders
WHERE placed_at >= timestamptz '2026-10-25 00:00:00 Europe/Stockholm'
  AND placed_at < timestamptz '2026-10-26 00:00:00 Europe/Stockholm'
ORDER BY placed_at, order_id;

SELECT 'P7' COLLATE "C" = 'p7' AS same_code;
-- chr(769) is the combining acute accent, U+0301.
SELECT 'café' COLLATE "C" = ('cafe' || chr(769)) AS original_equal,
       normalize('café', NFC) COLLATE "C"
         = normalize(('cafe' || chr(769)), NFC) AS normalised_equal;

-- E8: optional delivery notes are an explicit variant, not core schema facts.
CREATE TEMP TABLE delivery_notes (order_id integer PRIMARY KEY, delivery_note text);
INSERT INTO delivery_notes VALUES (101,'Leave by door'),(102,''),(103,NULL);
SELECT order_id, delivery_note,
       delivery_note = '' AS equals_empty,
       delivery_note <> '' AS not_equal_empty,
       NOT (delivery_note = '') AS negated_equality,
       delivery_note IS NULL AS is_missing,
       delivery_note <> '' OR delivery_note IS NULL AS include_missing,
       delivery_note IS DISTINCT FROM '' AS distinct_from_empty
FROM delivery_notes ORDER BY order_id;
SELECT order_id FROM delivery_notes WHERE delivery_note = '' ORDER BY order_id;
SELECT order_id FROM delivery_notes WHERE delivery_note <> '' ORDER BY order_id;
SELECT order_id FROM delivery_notes WHERE NOT (delivery_note = '') ORDER BY order_id;
SELECT order_id FROM delivery_notes WHERE delivery_note IS NULL ORDER BY order_id;
SELECT order_id FROM delivery_notes WHERE delivery_note <> '' OR delivery_note IS NULL ORDER BY order_id;
SELECT order_id FROM delivery_notes WHERE delivery_note IS DISTINCT FROM '' ORDER BY order_id;
SELECT NULL::text = NULL::text AS ordinary_equality,
       NULL::text IS NOT DISTINCT FROM NULL::text AS null_safe_equality,
       7 NOT IN (3, NULL) AS not_in_with_missing;
SELECT COALESCE(SUM(amount), 0::numeric) AS paid FROM payments WHERE order_id = 103;
SELECT order_id, delivery_note FROM delivery_notes
ORDER BY delivery_note ASC NULLS LAST, order_id;

CREATE TEMP TABLE optional_codes (row_no integer PRIMARY KEY, code text UNIQUE);
INSERT INTO optional_codes VALUES (1,'gift'),(2,NULL),(3,NULL);
SELECT * FROM optional_codes ORDER BY row_no;
CREATE TEMP TABLE one_missing_code (row_no integer PRIMARY KEY, code text UNIQUE NULLS NOT DISTINCT);
INSERT INTO one_missing_code VALUES (1,'gift'),(2,NULL);
CREATE TEMP TABLE positive_only (amount numeric CHECK(amount > 0));
CREATE TEMP TABLE required_positive (amount numeric NOT NULL CHECK(amount > 0));
INSERT INTO positive_only VALUES (NULL);

-- Expected rejections are caught narrowly, so ON_ERROR_STOP can stay enabled.
DO $$
BEGIN
  BEGIN
    INSERT INTO optional_codes VALUES (4,'gift');
    RAISE EXCEPTION 'FAIL: duplicate supplied code was accepted';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate supplied code rejected';
  END;
  BEGIN
    INSERT INTO one_missing_code VALUES (3,NULL);
    RAISE EXCEPTION 'FAIL: second missing code was accepted';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: second missing code rejected with NULLS NOT DISTINCT';
  END;
  BEGIN
    INSERT INTO required_positive VALUES (NULL);
    RAISE EXCEPTION 'FAIL: required amount was missing';
  EXCEPTION WHEN not_null_violation THEN
    RAISE NOTICE 'PASS: NOT NULL rejects missing amount';
  END;
  BEGIN
    INSERT INTO positive_only VALUES (-1);
    RAISE EXCEPTION 'FAIL: negative amount accepted';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: CHECK rejects negative amount';
  END;
END $$;
ROLLBACK;
