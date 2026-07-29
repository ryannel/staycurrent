#!/bin/bash
# driver-01-schema-load.sh — adapted copy of round-3 t3-selectivity 01-schema-load.sql
# (SQL reconstructed verbatim from round-3/evidence/t3-selectivity/raw/01-schema-load.log,
# which echoed every statement via psql -e). Target container: pilot-sel.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/01-schema-load.log"

SQL=$(cat <<'SQL'
SELECT now() AS experiment_start_utc;

CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  status      text        NOT NULL,
  customer_id int         NOT NULL,
  total       numeric     NOT NULL,
  created_at  timestamptz NOT NULL
);

INSERT INTO orders (status, customer_id, total, created_at)
SELECT CASE
         WHEN r < 0.95 THEN 'shipped'
         WHEN r < 0.99 THEN 'pending'
         ELSE 'cancelled'
       END,
       1 + (random() * 99999)::int,
       round((random() * 499 + 1)::numeric, 2),
       now() - random() * interval '365 days'
FROM (SELECT random() AS r FROM generate_series(1, 2000000)) g;

CREATE INDEX orders_status_idx ON orders (status);

ANALYZE orders;

SELECT status,
       count(*) AS n_rows,
       round(100.0 * count(*) / 2000000, 3) AS pct
FROM orders
GROUP BY status
ORDER BY count(*) DESC;

SELECT pg_size_pretty(pg_relation_size('orders'))            AS table_size,
       pg_size_pretty(pg_relation_size('orders_status_idx')) AS status_index_size,
       pg_size_pretty(pg_relation_size('orders_pkey'))       AS pkey_size,
       pg_size_pretty(pg_total_relation_size('orders'))      AS total_incl_indexes;

SELECT relname, relpages, reltuples::bigint AS reltuples, relallvisible
FROM pg_class
WHERE relname IN ('orders', 'orders_status_idx', 'orders_pkey')
ORDER BY relname;
SQL
)

{
  echo "# Command: driver-01-schema-load.sh -> docker exec -i pilot-sel psql -U postgres -X -e -f -"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# psql -e echoes each SQL statement before its output."
  echo ""
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-sel psql -U postgres -X -e -f - >> "$LOG" 2>&1 || rc=$?

{
  echo ""
  echo "# psql exit code: $rc"
} >> "$LOG"
exit "$rc"
