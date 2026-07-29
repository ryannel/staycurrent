#!/bin/bash
# driver-06-fix2.sh — adapted copy of round-3 ho-slow-query 06-fix2.sql
# (reconstructed from raw/06-fix-2.log). Fix 2: composite index orders(user_id, created_at).
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/06-fix-2.log"

SQL=$(cat <<'SQL'
\timing on
-- Fix 2: composite index so the user filter + date range both ride the index
CREATE INDEX ON orders(user_id, created_at);

\di+ orders*

SELECT pg_size_pretty(pg_relation_size('orders_user_id_created_at_idx')) AS fix2_index_size;
SQL
)

{
  echo "# Command: driver-06-fix2.sh -> docker exec -i pilot-slow psql -X -e -U postgres (SQL embedded below)"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# ---- input SQL (verbatim) ----"
  printf '%s\n' "$SQL"
  echo "# ---- output (verbatim) ----"
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-slow psql -X -e -U postgres >> "$LOG" 2>&1 || rc=$?
echo "# ---- finished at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC'), psql exit code: $rc ----" >> "$LOG"
exit "$rc"
