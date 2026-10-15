#!/bin/sh
# Run only against a disposable PostgreSQL 18 test server, using PGHOST,
# PGPORT and PGUSER (or libpq service configuration) already set for that server.
# Requires permission to create databases. No existing databases are removed.
set -eu
umask 077
drill_dir=$(mktemp -d)
printf 'Drill files: %s\n' "$drill_dir"
createdb --template=template0 sc_recovery_source
psql -X --set=ON_ERROR_STOP=1 --dbname=sc_recovery_source <<'SQL'
CREATE TABLE orders (
  order_id integer PRIMARY KEY,
  request_key text UNIQUE NOT NULL,
  amount numeric(10,2) NOT NULL
);
INSERT INTO orders (order_id, request_key, amount)
VALUES (101, 'req-a', 25);
SQL
pg_dump --format=custom --file="$drill_dir/shop.dump" sc_recovery_source
pg_restore --list "$drill_dir/shop.dump" > "$drill_dir/archive-contents.txt"
# This acknowledged request occurs after the dump's snapshot.
psql -X --set=ON_ERROR_STOP=1 --dbname=sc_recovery_source <<'SQL'
INSERT INTO orders (order_id, request_key, amount)
VALUES (102, 'req-b', 8);
SQL
restore_started=$(date +%s)
createdb --template=template0 sc_recovery_restore
pg_restore --exit-on-error --single-transaction --no-owner --no-acl \
  --dbname=sc_recovery_restore "$drill_dir/shop.dump"
psql -X --set=ON_ERROR_STOP=1 --dbname=sc_recovery_restore <<'SQL'
ANALYZE;
DO $$ BEGIN
  IF (SELECT count(*) FROM orders) <> 1
     OR NOT EXISTS (SELECT 1 FROM orders
                    WHERE request_key = 'req-a' AND amount = 25) THEN
    RAISE EXCEPTION 'Restored fixture does not match the dump snapshot';
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM orders WHERE request_key = 'req-b') THEN
    RAISE EXCEPTION 'Unexpected post-snapshot request in restored fixture';
  END IF;
END $$;
-- These two rows represent an independently preserved acknowledgement record.
WITH receipts(request_key, expected_amount) AS (
  VALUES ('req-a', 25.00), ('req-b', 8.00)
)
SELECT r.request_key, r.expected_amount, o.amount AS recovered_amount
FROM receipts AS r LEFT JOIN orders AS o USING (request_key)
WHERE o.request_key IS NULL OR o.amount IS DISTINCT FROM r.expected_amount;
SQL
restore_finished=$(date +%s)
printf 'Target creation, restore and SQL validation took %s seconds.\n' "$((restore_finished - restore_started))"
printf '%s\n' 'Expected reconciliation result: req-b, 8.00, NULL.'
printf '%s\n' 'Keep the databases and archive for inspection; remove them explicitly after the drill.'
