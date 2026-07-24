#!/bin/bash
# Experiment 3: dropping old data — DETACH PARTITION vs DELETE.
#
# The article's claim under test: Postgres's native partitioning allows
# "detaching old data in one statement".
#
# Experiment 2b found that pruning was NOT a win for a well-indexed flat table.
# This is the other side of the ledger: the operation partitioning is actually
# for. Same job on both sides — retire one month of events — measured the same
# way, three times each.
#
#   partitioned: ALTER TABLE events DETACH PARTITION events_2025_0N
#   flat:        DELETE FROM events_flat WHERE occurred_at >= .. AND < ..
#
# Three different months per side, because neither operation is repeatable on the
# same rows. Months 01, 02, 03 carry comparable but not identical row counts, so
# every run reports its own count and nothing is averaged across different sizes.
#
# The aftermath matters as much as the timing: DELETE leaves dead tuples and does
# not return the space until VACUUM, and both are recorded below.
#
# Run as:  bash driver-03-detach-vs-delete.sh 2>&1 | tee raw/03-detach-vs-delete.log
set -u
C=r4-part
q() { echo; echo "\$ psql -c \"$*\""; docker exec "$C" psql -U postgres -X -c "$*" 2>&1; }
timed() { echo; echo "\$ psql -c \"\\timing on\" -c \"$*\""; docker exec "$C" psql -U postgres -X -c '\timing on' -c "$*" 2>&1; }

echo "=== Experiment 3: DETACH vs DELETE — $(date) ==="

echo; echo "--- starting state: rows per partition, and the flat twin's size ---"
q "SELECT tableoid::regclass AS partition, count(*) FROM events GROUP BY 1 ORDER BY 1;"
q "SELECT count(*) AS flat_rows, pg_size_pretty(pg_total_relation_size('events_flat')) AS flat_size FROM events_flat;"

echo
echo "================================================================"
echo "=== A. PARTITIONED — detach three months, one statement each"
echo "================================================================"
for M in 01 02 03; do
  echo; echo "--- month 2025-$M ---"
  q "SELECT count(*) AS rows_in_this_partition FROM events_2025_$M;"
  timed "ALTER TABLE events DETACH PARTITION events_2025_$M;"
  q "SELECT count(*) AS rows_left_in_events FROM events;"
done

echo; echo "--- the detached tables still exist, intact, outside the parent ---"
q "SELECT relname, n_live_tup FROM pg_stat_user_tables WHERE relname LIKE 'events_2025_0[123]' ORDER BY relname;"

echo
echo "================================================================"
echo "=== B. FLAT TWIN — delete the same three months"
echo "================================================================"
for RANGE in "2025-01-01|2025-02-01" "2025-02-01|2025-03-01" "2025-03-01|2025-04-01"; do
  FROM="${RANGE%%|*}"; TO="${RANGE##*|}"
  echo; echo "--- deleting [$FROM, $TO) ---"
  q "SELECT count(*) AS rows_to_delete FROM events_flat WHERE occurred_at >= '$FROM' AND occurred_at < '$TO';"
  timed "DELETE FROM events_flat WHERE occurred_at >= '$FROM' AND occurred_at < '$TO';"
  q "SELECT count(*) AS rows_left_in_flat FROM events_flat;"
done

echo
echo "================================================================"
echo "=== C. the aftermath — what each approach left behind"
echo "================================================================"
q "SELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_autovacuum FROM pg_stat_user_tables WHERE relname = 'events_flat';"
q "SELECT pg_size_pretty(pg_total_relation_size('events_flat')) AS flat_size_after_delete;"
q "SELECT pg_size_pretty(sum(pg_total_relation_size(c.oid))) AS remaining_partitions_total FROM pg_class c JOIN pg_inherits i ON i.inhrelid = c.oid WHERE i.inhparent = 'events'::regclass;"

echo; echo "--- and what VACUUM does or does not give back ---"
timed "VACUUM events_flat;"
q "SELECT relname, n_live_tup, n_dead_tup FROM pg_stat_user_tables WHERE relname = 'events_flat';"
q "SELECT pg_size_pretty(pg_total_relation_size('events_flat')) AS flat_size_after_vacuum;"

echo; echo "=== Experiment 3 complete — $(date) ==="
