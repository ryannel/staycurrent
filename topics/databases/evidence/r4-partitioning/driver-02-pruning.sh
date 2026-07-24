#!/bin/bash
# Experiment 2: partition pruning, shown as a plan rather than described.
#
# The article's claim under test: "Postgres's native partitioning splits large
# tables locally, pruning queries to the partitions they touch."
#
# A reader is being taught to recognise pruning in a plan, so the plan has to be
# on the page. Three cases, because pruning is only interesting against what it
# is being compared to:
#   (a) one month, partitioned      — should touch ONE partition
#   (b) the same query, flat twin   — has no partitions to skip
#   (c) no partition-key predicate  — should touch all twelve
#
# Wrong outcomes are visibly wrong: a plan either names one partition or names
# twelve, and `Buffers: shared hit/read` counts the pages it actually touched.
#
# Run as:  bash driver-02-pruning.sh 2>&1 | tee raw/02-pruning.log
set -u
C=r4-part
q() { echo; echo "\$ psql -c \"$*\""; docker exec "$C" psql -U postgres -X -c "$*" 2>&1; }

echo "=== Experiment 2: partition pruning — $(date) ==="

echo; echo "--- the real size of each side (the parent relation itself stores nothing) ---"
q "SELECT pg_size_pretty(sum(pg_total_relation_size(c.oid))) AS all_partitions_total FROM pg_class c JOIN pg_inherits i ON i.inhrelid = c.oid WHERE i.inhparent = 'events'::regclass;"
q "SELECT pg_size_pretty(pg_total_relation_size('events_flat')) AS flat_total;"

echo
echo "================================================================"
echo "=== (a) one month, on the PARTITIONED table"
echo "================================================================"
for RUN in 1 2 3; do
  echo; echo "--- run $RUN of 3 ---"
  docker exec "$C" psql -U postgres -X -c "
EXPLAIN (ANALYZE, BUFFERS, COSTS ON)
SELECT count(*) FROM events
WHERE occurred_at >= '2025-07-01' AND occurred_at < '2025-08-01';" 2>&1
done

echo
echo "================================================================"
echo "=== (b) the same month, on the UNPARTITIONED twin"
echo "================================================================"
for RUN in 1 2 3; do
  echo; echo "--- run $RUN of 3 ---"
  docker exec "$C" psql -U postgres -X -c "
EXPLAIN (ANALYZE, BUFFERS, COSTS ON)
SELECT count(*) FROM events_flat
WHERE occurred_at >= '2025-07-01' AND occurred_at < '2025-08-01';" 2>&1
done

echo
echo "================================================================"
echo "=== (c) NO predicate on the partition key — pruning cannot help"
echo "================================================================"
q "EXPLAIN (ANALYZE, BUFFERS, COSTS ON) SELECT count(*) FROM events WHERE tenant_id = 42;"

echo
echo "================================================================"
echo "=== (d) how many partitions each query actually touched"
echo "================================================================"
echo "\$ counting 'events_2025_' scan nodes in each plan above"
echo "(a) partitioned, one month:"
docker exec "$C" psql -U postgres -X -c "
EXPLAIN (COSTS OFF) SELECT count(*) FROM events
WHERE occurred_at >= '2025-07-01' AND occurred_at < '2025-08-01';" 2>&1 | grep -c 'events_2025_'
echo "(c) partitioned, no partition-key predicate:"
docker exec "$C" psql -U postgres -X -c "
EXPLAIN (COSTS OFF) SELECT count(*) FROM events WHERE tenant_id = 42;" 2>&1 | grep -c 'events_2025_'

echo; echo "=== Experiment 2 complete — $(date) ==="
