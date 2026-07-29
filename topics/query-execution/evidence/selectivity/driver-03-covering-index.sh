#!/bin/bash
# driver-03-covering-index.sh — adapted copy of round-3 t3-selectivity 03-covering-index.sql
# (reconstructed from raw/03-covering-index.log). Same shape as the original:
# 3 baseline runs, create covering index, relallvisible check, 3 pre-VACUUM runs,
# VACUUM, relallvisible check, 3 post-VACUUM runs, index size.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/03-covering-index.log"

SQL=$(cat <<'SQL'
SELECT now() AS experiment_start_utc;

-- baseline (plain status index), run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';

CREATE INDEX orders_status_covering_idx ON orders (status) INCLUDE (customer_id, total);

SELECT relallvisible, relpages FROM pg_class WHERE relname = 'orders';

-- covering index exists but relallvisible=0 (no VACUUM yet), run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';

VACUUM orders;

SELECT relallvisible, relpages FROM pg_class WHERE relname = 'orders';

-- after VACUUM (visibility map set), run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';

SELECT pg_size_pretty(pg_relation_size('orders_status_covering_idx')) AS covering_index_size;
SQL
)

{
  echo "# Command: driver-03-covering-index.sh -> docker exec -i pilot-sel psql -U postgres -X -e -f -"
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
