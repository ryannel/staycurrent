#!/bin/bash
# driver-05-covering-prevacuum-supplement.sh — adapted copy of round-3 t3-selectivity
# 05-covering-prevacuum-supplement.sql (reconstructed from raw/05-...log).
# CONTROL CONDITION (kept per contract): orders2 is a copy WITHOUT the plain
# orders_status_idx, so the planner's only choice is the covering index. This
# isolates the visibility-map effect: Index Only Scan with Heap Fetches>0 before
# VACUUM vs Heap Fetches=0 after. 3 runs before VACUUM, 3 after, as in the original.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/05-covering-prevacuum-supplement.log"

SQL=$(cat <<'SQL'
SELECT now() AS experiment_start_utc;

CREATE TABLE orders2 AS SELECT * FROM orders WHERE status <> 'returned';

CREATE INDEX orders2_covering_idx ON orders2 (status) INCLUDE (customer_id, total);

ANALYZE orders2;

SELECT relallvisible, relpages FROM pg_class WHERE relname = 'orders2';

-- covering index only (no plain index to fall back to), pre-VACUUM, run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders2 WHERE status = 'pending';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders2 WHERE status = 'pending';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders2 WHERE status = 'pending';

VACUUM orders2;

SELECT relallvisible, relpages FROM pg_class WHERE relname = 'orders2';

-- after VACUUM, run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders2 WHERE status = 'pending';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders2 WHERE status = 'pending';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders2 WHERE status = 'pending';

DROP TABLE orders2;
SQL
)

{
  echo "# Command: driver-05-covering-prevacuum-supplement.sh -> docker exec -i pilot-sel psql -U postgres -X -e -f -"
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
