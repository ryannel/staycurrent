#!/bin/bash
# Experiment 4: where a time-ordered insert stream actually lands.
#
# The article's claim under test: "Range partitioning keeps keys sorted and
# assigns contiguous ranges to nodes... But skew is built in: a time-ordered key
# sends every insert to the newest partition, and one node works while the rest
# watch. Hash partitioning spreads keys uniformly and kills that hot tail, at the
# price of scattering ranges: a scan over a key range now visits every node."
#
# Two tables, same 12 partitions, same insert stream of strictly increasing
# timestamps. Count where the rows land, then run the same range scan on both.
#
# SCOPE LIMIT, stated up front: this is one Postgres on one machine. It can show
# which PARTITION receives the rows and which partitions a range scan must visit.
# It cannot show "one node works while the rest watch" — there are no nodes here.
# The distributed consequence is the article's claim; the local mechanism is what
# this measures.
#
# Run as:  bash driver-04-range-vs-hash.sh 2>&1 | tee raw/04-range-vs-hash.log
set -u
C=r4-part
q() { echo; echo "\$ psql -c \"$*\""; docker exec "$C" psql -U postgres -X -c "$*" 2>&1; }

echo "=== Experiment 4: range vs hash under a time-ordered stream — $(date) ==="

echo; echo "--- two tables, 12 partitions each, on the same key ---"
q "DROP TABLE IF EXISTS ev_range; CREATE TABLE ev_range (id bigint, occurred_at timestamptz NOT NULL) PARTITION BY RANGE (occurred_at);"
for m in 01 02 03 04 05 06 07 08 09 10 11 12; do
  next=$((10#$m + 1)); nextyear=2025
  if [ "$next" -eq 13 ]; then next=1; nextyear=2026; fi
  nm=$(printf '%02d' "$next")
  docker exec "$C" psql -U postgres -X -c \
    "CREATE TABLE ev_range_$m PARTITION OF ev_range FOR VALUES FROM ('2025-$m-01') TO ('$nextyear-$nm-01');" >/dev/null 2>&1
done
q "DROP TABLE IF EXISTS ev_hash; CREATE TABLE ev_hash (id bigint, occurred_at timestamptz NOT NULL) PARTITION BY HASH (occurred_at);"
for i in $(seq 0 11); do
  docker exec "$C" psql -U postgres -X -c \
    "CREATE TABLE ev_hash_$i PARTITION OF ev_hash FOR VALUES WITH (MODULUS 12, REMAINDER $i);" >/dev/null 2>&1
done
echo "created ev_range (12 monthly range partitions) and ev_hash (12 hash partitions)"

echo; echo "--- the stream: 120,000 rows, strictly increasing, all inside ONE day ---"
echo "--- (this is what 'today's writes' looks like to a table partitioned by month) ---"
INS="INSERT INTO %s (id, occurred_at) SELECT g, timestamptz '2025-07-15 00:00:00' + (g || ' milliseconds')::interval FROM generate_series(1, 120000) g;"
q "$(printf "$INS" ev_range)"
q "$(printf "$INS" ev_hash)"

echo; echo "--- where the rows landed: RANGE ---"
q "SELECT tableoid::regclass AS partition, count(*) FROM ev_range GROUP BY 1 ORDER BY 2 DESC;"

echo; echo "--- where the rows landed: HASH ---"
q "SELECT tableoid::regclass AS partition, count(*) FROM ev_hash GROUP BY 1 ORDER BY 1;"

echo; echo "--- the other side of the trade: a range scan over one hour ---"
echo; echo "=== RANGE-partitioned: how many partitions does the plan touch? ==="
docker exec "$C" psql -U postgres -X -c "
EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_range
WHERE occurred_at >= '2025-07-15 00:00:00' AND occurred_at < '2025-07-15 01:00:00';" 2>&1
echo "partition scan nodes:"
docker exec "$C" psql -U postgres -X -c "
EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_range
WHERE occurred_at >= '2025-07-15 00:00:00' AND occurred_at < '2025-07-15 01:00:00';" 2>&1 | grep -c 'ev_range_'

echo; echo "=== HASH-partitioned: the same scan ==="
docker exec "$C" psql -U postgres -X -c "
EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_hash
WHERE occurred_at >= '2025-07-15 00:00:00' AND occurred_at < '2025-07-15 01:00:00';" 2>&1
echo "partition scan nodes:"
docker exec "$C" psql -U postgres -X -c "
EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_hash
WHERE occurred_at >= '2025-07-15 00:00:00' AND occurred_at < '2025-07-15 01:00:00';" 2>&1 | grep -c 'ev_hash_'

echo; echo "=== Experiment 4 complete — $(date) ==="
