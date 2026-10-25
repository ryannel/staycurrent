-- History, correction and deletion: illustrative P7 assertions.
-- PostgreSQL 18; btree_gist must be available and its creation permitted.
-- Everything created here is rolled back at the end.
-- Run in a disposable database. All instants are UTC.
-- This installs the final history, not a correction service.
BEGIN;
SET LOCAL TIME ZONE 'UTC';
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TEMP TABLE price_history (
  assertion_id integer PRIMARY KEY,
  product_id text NOT NULL,
  price numeric(8,2) NOT NULL CHECK (price >= 0),
  effective_during tstzrange NOT NULL,
  recorded_during tstzrange NOT NULL,
  CHECK (NOT isempty(effective_during)),
  CHECK (NOT isempty(recorded_during)),
  EXCLUDE USING gist (
    product_id WITH =,
    effective_during WITH &&,
    recorded_during WITH &&
  )
);

INSERT INTO price_history VALUES
  (1, 'P7', 20.00,
   tstzrange(NULL, '2026-10-22 00:00:00+00', '[)'),
   tstzrange('2026-10-21 12:00:00+00', '2026-10-24 09:00:00+00', '[)')),
  (2, 'P7', 22.00,
   tstzrange('2026-10-22 00:00:00+00', NULL, '[)'),
   tstzrange('2026-10-21 12:00:00+00', '2026-10-24 09:00:00+00', '[)')),
  (3, 'P7', 20.00,
   tstzrange(NULL, '2026-10-21 00:00:00+00', '[)'),
   tstzrange('2026-10-24 09:00:00+00', NULL, '[)')),
  (4, 'P7', 22.00,
   tstzrange('2026-10-21 00:00:00+00', NULL, '[)'),
   tstzrange('2026-10-24 09:00:00+00', NULL, '[)'));

SELECT assertion_id, price
FROM price_history
WHERE product_id = 'P7'
  AND effective_during @> timestamptz '2026-10-21 12:00+00'
  AND upper_inf(recorded_during);
-- assertion_id | price
--            4 | 22.00

SELECT assertion_id, price
FROM price_history
WHERE product_id = 'P7'
  AND effective_during @> timestamptz '2026-10-21 12:00+00'
  AND recorded_during @> timestamptz '2026-10-23 12:00+00';
-- assertion_id | price
--            1 | 20.00

-- Without recorded time, two accounts match the same business instant.
SELECT assertion_id, price FROM price_history
WHERE product_id = 'P7'
  AND effective_during @> timestamptz '2026-10-21 12:00+00'
ORDER BY assertion_id;
-- 1 | 20.00
-- 4 | 22.00
ROLLBACK;
