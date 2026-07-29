#!/bin/bash
# driver-04-fix1.sh — adapted copy of round-3 ho-slow-query 04-fix1.sql
# (reconstructed from raw/04-fix-1.log). Fix 1: index on order_items(order_id).
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/04-fix-1.log"

SQL=$(cat <<'SQL'
\timing on
-- Fix 1: the index my hypothesis names
CREATE INDEX ON order_items(order_id);

\di+ order_items*

SELECT pg_size_pretty(pg_relation_size('order_items_order_id_idx')) AS fix1_index_size;
SQL
)

{
  echo "# Command: driver-04-fix1.sh -> docker exec -i pilot-slow psql -X -e -U postgres (SQL embedded below)"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# ---- input SQL (verbatim) ----"
  printf '%s\n' "$SQL"
  echo "# ---- output (verbatim) ----"
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-slow psql -X -e -U postgres >> "$LOG" 2>&1 || rc=$?
echo "# ---- finished at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC'), psql exit code: $rc ----" >> "$LOG"
exit "$rc"
