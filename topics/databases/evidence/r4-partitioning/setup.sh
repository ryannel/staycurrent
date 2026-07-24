#!/bin/bash
# r4-partitioning — one container, a range-partitioned table, and its unpartitioned twin.
#
# The twin matters: every claim about what partitioning buys is a comparison, and
# without an identical unpartitioned table carrying identical rows there is
# nothing to compare against.
#
# Run as:  bash setup.sh 2>&1 | tee raw/01-schema-load.log
set -u

C=r4-part
IMAGE=postgres:16-alpine
q() { echo; echo "\$ psql -c \"$*\""; docker exec "$C" psql -U postgres -X -c "$*" 2>&1; }

echo "=== r4-partitioning setup — $(date) ==="

docker rm -f "$C" >/dev/null 2>&1
echo; echo "\$ docker run -d --name $C -p 5444:5432 $IMAGE"
docker run -d --name "$C" -e POSTGRES_PASSWORD=lab -e POSTGRES_HOST_AUTH_METHOD=trust \
  -p 5444:5432 "$IMAGE" -c log_min_messages=warning 2>&1

echo; echo "--- waiting for postgres ---"
for i in $(seq 1 60); do
  docker exec "$C" pg_isready -U postgres >/dev/null 2>&1 && { echo "ready after ${i}s"; break; }
  sleep 1
done

echo; echo "--- the partitioned table: events, RANGE partitioned by month, 12 partitions ---"
q "CREATE TABLE events (id bigserial, occurred_at timestamptz NOT NULL, tenant_id int NOT NULL, payload text) PARTITION BY RANGE (occurred_at);"
for m in 01 02 03 04 05 06 07 08 09 10 11 12; do
  next=$((10#$m + 1)); nextyear=2025
  if [ "$next" -eq 13 ]; then next=1; nextyear=2026; fi
  nm=$(printf '%02d' "$next")
  docker exec "$C" psql -U postgres -X -c \
    "CREATE TABLE events_2025_$m PARTITION OF events FOR VALUES FROM ('2025-$m-01') TO ('$nextyear-$nm-01');" 2>&1
done
q "\d+ events"

echo; echo "--- the unpartitioned twin: identical columns, identical rows ---"
q "CREATE TABLE events_flat (id bigserial, occurred_at timestamptz NOT NULL, tenant_id int NOT NULL, payload text);"

echo; echo "--- load: 200,000 rows per month across 2025, evenly spread within each month ---"
echo "\$ INSERT ... generate_series over 12 months x 200000"
docker exec "$C" psql -U postgres -X -c "
INSERT INTO events (occurred_at, tenant_id, payload)
SELECT ts, (random()*999)::int + 1, 'payload-' || g
FROM generate_series(1, 2400000) g,
LATERAL (SELECT timestamptz '2025-01-01' + ((g % 365) || ' days')::interval
                            + ((g % 86400) || ' seconds')::interval AS ts) t;" 2>&1

q "INSERT INTO events_flat (occurred_at, tenant_id, payload) SELECT occurred_at, tenant_id, payload FROM events;"

echo; echo "--- indexes on both sides, so the comparison is like for like ---"
q "CREATE INDEX events_occurred_idx ON events (occurred_at);"
q "CREATE INDEX events_flat_occurred_idx ON events_flat (occurred_at);"
q "ANALYZE events;"
q "ANALYZE events_flat;"

echo; echo "--- what landed where ---"
q "SELECT tableoid::regclass AS partition, count(*) FROM events GROUP BY 1 ORDER BY 1;"
q "SELECT count(*) AS flat_rows FROM events_flat;"
q "SELECT pg_size_pretty(pg_total_relation_size('events')) AS events_total, pg_size_pretty(pg_total_relation_size('events_flat')) AS flat_total;"

echo; echo "=== setup complete — $(date) ==="
