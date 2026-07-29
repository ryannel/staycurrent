#!/bin/bash
# driver-04-stale-stats.sh — adapted copy of round-3 t3-selectivity 04-stale-stats.sql
# (reconstructed from raw/04-stale-stats.log). ADAPTATIONS vs 2026-07-23:
#  - each EXPLAIN is run 3x (contract rule: >=3 runs per timed measurement);
#  - EXPLAIN uses (ANALYZE, BUFFERS) instead of bare (ANALYZE) (contract rule:
#    complete verbatim plan text with BUFFERS).
# The last_analyze/last_autoanalyze checks bracket the EXPLAINs so the log itself
# proves whether autoanalyze fired between measurements.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/04-stale-stats.log"

SQL=$(cat <<'SQL'
SELECT now() AS experiment_start_utc;

SELECT last_analyze, last_autoanalyze, n_mod_since_analyze, n_live_tup
FROM pg_stat_user_tables WHERE relname = 'orders';

INSERT INTO orders (status, customer_id, total, created_at)
SELECT 'returned',
       1 + (random() * 99999)::int,
       round((random() * 499 + 1)::numeric, 2),
       now() - random() * interval '30 days'
FROM generate_series(1, 500000);

SELECT now() AS after_insert_utc;

SELECT last_analyze, last_autoanalyze, n_mod_since_analyze, n_live_tup
FROM pg_stat_user_tables WHERE relname = 'orders';

-- stats are now stale: planner has never seen 'returned'. Run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'returned';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'returned';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'returned';

SELECT now() AS after_stale_explains_utc;

SELECT last_analyze, last_autoanalyze
FROM pg_stat_user_tables WHERE relname = 'orders';

ANALYZE orders;

-- fresh stats. Run 1 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'returned';
-- run 2 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'returned';
-- run 3 of 3
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'returned';

SELECT now() AS after_manual_analyze_utc;

SELECT last_analyze, last_autoanalyze
FROM pg_stat_user_tables WHERE relname = 'orders';

SELECT most_common_vals, most_common_freqs
FROM pg_stats WHERE tablename = 'orders' AND attname = 'status';
SQL
)

{
  echo "# Command: driver-04-stale-stats.sh -> docker exec -i pilot-sel psql -U postgres -X -e -f -"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# psql -e echoes each SQL statement before its output."
  echo "# Adaptations vs 2026-07-23 template: 3 runs per EXPLAIN (was 1); BUFFERS added to EXPLAIN."
  echo ""
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-sel psql -U postgres -X -e -f - >> "$LOG" 2>&1 || rc=$?

{
  echo ""
  echo "# psql exit code: $rc"
} >> "$LOG"
exit "$rc"
