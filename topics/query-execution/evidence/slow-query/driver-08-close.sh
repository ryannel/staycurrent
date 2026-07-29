#!/bin/bash
# driver-08-close.sh — adapted copy of round-3 ho-slow-query 08-close.sql
# (reconstructed from raw/08-close.log). Close-out: index inventory, sizes, usage counters.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/08-close.log"

SQL=$(cat <<'SQL'
\timing on
-- Close-out: what the fix cost, and final state of all relations
\di+

SELECT relname,
       pg_size_pretty(pg_relation_size(oid))       AS main_size,
       pg_size_pretty(pg_total_relation_size(oid)) AS total_with_indexes
FROM pg_class
WHERE relname IN ('users','orders','order_items')
ORDER BY relname;

SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS size, idx_scan
FROM pg_stat_user_indexes
ORDER BY indexrelname;
SQL
)

{
  echo "# Command: driver-08-close.sh -> docker exec -i pilot-slow psql -X -e -U postgres (SQL embedded below)"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# ---- input SQL (verbatim) ----"
  printf '%s\n' "$SQL"
  echo "# ---- output (verbatim) ----"
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-slow psql -X -e -U postgres >> "$LOG" 2>&1 || rc=$?
echo "# ---- finished at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC'), psql exit code: $rc ----" >> "$LOG"
exit "$rc"
