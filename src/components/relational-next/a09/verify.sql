\set ON_ERROR_STOP on
SELECT version();
SHOW TimeZone;
SHOW server_encoding;
SELECT datcollate, datctype FROM pg_database WHERE datname = current_database();
SET TIME ZONE 'UTC';
CREATE TABLE amounts (fee numeric(8,2));
INSERT INTO amounts VALUES (20.005), (999999.99);
SELECT fee FROM amounts ORDER BY fee;
DO $$ BEGIN
 BEGIN INSERT INTO amounts VALUES (999999.995); RAISE EXCEPTION 'overflow unexpectedly accepted';
 EXCEPTION WHEN numeric_value_out_of_range THEN RAISE NOTICE 'numeric overflow rejected as expected'; END;
 BEGIN PERFORM 2147483648::integer; RAISE EXCEPTION 'integer overflow unexpectedly accepted';
 EXCEPTION WHEN numeric_value_out_of_range THEN RAISE NOTICE 'integer overflow rejected as expected'; END;
END $$;
SELECT 0.1::double precision + 0.2::double precision AS approximate,
       0.1::numeric + 0.2::numeric AS decimal_sum,
       9007199254740993::bigint AS boundary_id;
SELECT '007'::text AS member_code, '007'::integer AS quantity;
SELECT 'M007'::text = 'M007 '::text AS exact_text,
       'M007'::char(5) = 'M007 '::char(5) AS padded_char,
       'M007'::text = 'm007'::text AS case_match;
SELECT U&'\00E9' = U&'e\0301' AS raw_equal,
       normalize(U&'\00E9',NFC) = normalize(U&'e\0301',NFC) AS normalised_equal,
       char_length(U&'\00E9') AS chars, octet_length(U&'\00E9') AS bytes;
SELECT timestamptz '2026-10-25 00:30+00' AT TIME ZONE 'Europe/London' AS earlier_clock,
       timestamptz '2026-10-25 01:30+00' AT TIME ZONE 'Europe/London' AS later_clock;
SELECT timestamp '2026-03-29 01:30' AT TIME ZONE 'Europe/London' AS gap_default,
       timestamp '2026-10-25 01:30' AT TIME ZONE 'Europe/London' AS overlap_default;
SELECT timestamptz '2026-10-25 00:30+00' AS displayed_utc;
SET TIME ZONE 'Europe/London';
SELECT timestamptz '2026-10-25 00:30+00' AS displayed_london;
SET TIME ZONE 'UTC';
CREATE TABLE optional_details (id integer, phone text DEFAULT 'not asked');
INSERT INTO optional_details (id) VALUES (1);
INSERT INTO optional_details VALUES (2, NULL), (3, ''), (4, DEFAULT);
SELECT id, phone, phone IS NULL AS sql_null, length(phone) AS length FROM optional_details ORDER BY id;
SELECT '{}'::jsonb -> 'phone' IS NULL AS missing_property,
       '{"phone":null}'::jsonb -> 'phone' IS NULL AS json_null_is_sql_null,
       jsonb_typeof('{"phone":null}'::jsonb -> 'phone') AS json_null_type,
       NULL::jsonb IS NULL AS no_sql_value,
       jsonb_array_length('[]'::jsonb) AS empty_collection;
SELECT timestamptz '2026-11-03 18:00:00.123456+00' AS microseconds;
CREATE TEMP TABLE contact_example (id integer, phone_state text DEFAULT 'unprovided');
INSERT INTO contact_example (id) VALUES (1);
INSERT INTO contact_example VALUES (2, NULL);
SELECT * FROM contact_example ORDER BY id;
DROP TABLE amounts, optional_details;
