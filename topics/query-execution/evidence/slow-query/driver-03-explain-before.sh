#!/bin/bash
# driver-03-explain-before.sh — adapted copy of round-3 ho-slow-query 03-explain.sql
# (reconstructed from raw/03-explain-before.log). Full verbatim before-plan with BUFFERS.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/03-explain-before.log"

SQL=$(cat <<'SQL'
\timing on
EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, count(oi.id) AS items
FROM users u
JOIN orders o ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
WHERE u.email = 'user2@example.com'
  AND o.created_at > now() - interval '90 days'
GROUP BY o.id, o.created_at, o.status
ORDER BY o.created_at DESC
LIMIT 20;
SQL
)

{
  echo "# Command: driver-03-explain-before.sh -> docker exec -i pilot-slow psql -X -e -U postgres (SQL embedded below)"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# ---- input SQL (verbatim) ----"
  printf '%s\n' "$SQL"
  echo "# ---- output (verbatim) ----"
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-slow psql -X -e -U postgres >> "$LOG" 2>&1 || rc=$?
echo "# ---- finished at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC'), psql exit code: $rc ----" >> "$LOG"
exit "$rc"
