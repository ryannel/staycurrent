#!/bin/bash
# driver-02-selectivity-flip.sh — adapted copy of round-3 t3-selectivity 02-selectivity-flip.sql
# (reconstructed from raw/02-selectivity-flip.log). ADAPTATION vs 2026-07-23: the original
# ran each EXPLAIN once; the standing contract requires >=3 runs per timed measurement,
# so each EXPLAIN (ANALYZE, BUFFERS) is run 3x here. All runs are kept.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/02-selectivity-flip.log"

SQL=$(cat <<'SQL'
SELECT now() AS experiment_start_utc;

-- rare value: 'cancelled' (~1% of rows), run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'cancelled';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'cancelled';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'cancelled';

-- common value: 'shipped' (~95% of rows), run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'shipped';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'shipped';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'shipped';

\x on
SELECT * FROM pg_stats WHERE tablename = 'orders' AND attname = 'status';
\x off
SQL
)

{
  echo "# Command: driver-02-selectivity-flip.sh -> docker exec -i pilot-sel psql -U postgres -X -e -f -"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# psql -e echoes each SQL statement before its output."
  echo "# Adaptation vs 2026-07-23 template: 3 runs per EXPLAIN instead of 1 (contract rule: >=3 runs)."
  echo ""
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-sel psql -U postgres -X -e -f - >> "$LOG" 2>&1 || rc=$?

{
  echo ""
  echo "# psql exit code: $rc"
} >> "$LOG"
exit "$rc"
