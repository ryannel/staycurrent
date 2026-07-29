#!/bin/bash
# driver-05-after-fix1.sh — adapted copy of round-3 ho-slow-query 05-after-fix1.sql
# (reconstructed from raw/05-after-fix-1.log). 3 timed runs + full plan after fix 1.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/05-after-fix-1.log"

SQL=$(cat <<'SQL'
\timing on
-- After fix 1 (order_items_order_id_idx): incident query, run 1 of 3
SELECT o.id, o.created_at, o.status, count(oi.id) AS items
FROM users u
JOIN orders o ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
WHERE u.email = 'user2@example.com'
  AND o.created_at > now() - interval '90 days'
GROUP BY o.id, o.created_at, o.status
ORDER BY o.created_at DESC
LIMIT 20;

-- run 2 of 3 (identical)
SELECT o.id, o.created_at, o.status, count(oi.id) AS items
FROM users u
JOIN orders o ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
WHERE u.email = 'user2@example.com'
  AND o.created_at > now() - interval '90 days'
GROUP BY o.id, o.created_at, o.status
ORDER BY o.created_at DESC
LIMIT 20;

-- run 3 of 3 (identical)
SELECT o.id, o.created_at, o.status, count(oi.id) AS items
FROM users u
JOIN orders o ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
WHERE u.email = 'user2@example.com'
  AND o.created_at > now() - interval '90 days'
GROUP BY o.id, o.created_at, o.status
ORDER BY o.created_at DESC
LIMIT 20;

-- plan after fix 1
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
  echo "# Command: driver-05-after-fix1.sh -> docker exec -i pilot-slow psql -X -e -U postgres (SQL embedded below)"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# ---- input SQL (verbatim) ----"
  printf '%s\n' "$SQL"
  echo "# ---- output (verbatim) ----"
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-slow psql -X -e -U postgres >> "$LOG" 2>&1 || rc=$?
echo "# ---- finished at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC'), psql exit code: $rc ----" >> "$LOG"
exit "$rc"
