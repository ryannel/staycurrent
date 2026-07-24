#!/bin/bash
# r4-replication — topology setup: one primary, two streaming standbys.
#
# Why two standbys: the article's replication section claims two anomalies.
# Read-your-own-writes needs one lagging replica. Monotonic reads needs TWO
# replicas at DIFFERENT lag, so an alternating reader can see a row appear,
# vanish, and reappear. One standby cannot show the second anomaly.
#
# Lag is induced with pg_wal_replay_pause() rather than by loading the box:
# a paused replica lags deterministically, so the anomaly is reproducible and
# its cause is not in doubt. Load-induced lag on a laptop would be noise.
#
# Run as:  bash setup.sh 2>&1 | tee raw/01-setup.log
set -u

NET=r4-replnet
PRIMARY=r4-repl-primary
SBA=r4-repl-sba
SBB=r4-repl-sbb
IMAGE=postgres:16-alpine

say() { echo; echo "\$ $*"; "$@" 2>&1; }
sql() { local c="$1"; shift; echo; echo "\$ psql@$c -c \"$*\""; docker exec "$c" psql -U postgres -c "$*" 2>&1; }

echo "=== r4-replication setup — $(date) ==="

# --- teardown any previous attempt (never silently reuse a half-built topology)
docker rm -f "$PRIMARY" "$SBA" "$SBB" >/dev/null 2>&1
docker volume rm r4-sba-data r4-sbb-data >/dev/null 2>&1
docker network rm "$NET" >/dev/null 2>&1

say docker network create "$NET"

# --- primary -------------------------------------------------------------
say docker run -d --name "$PRIMARY" --network "$NET" \
  -e POSTGRES_PASSWORD=lab -e POSTGRES_HOST_AUTH_METHOD=trust \
  -p 5441:5432 "$IMAGE" \
  -c wal_level=replica -c max_wal_senders=10 -c max_replication_slots=10 \
  -c hot_standby=on -c log_min_messages=warning

echo; echo "--- waiting for primary to accept connections ---"
for i in $(seq 1 60); do
  if docker exec "$PRIMARY" pg_isready -U postgres >/dev/null 2>&1; then
    echo "primary ready after ${i}s"; break
  fi
  sleep 1
done

# Replication connections need their own pg_hba entry — the image's
# POSTGRES_HOST_AUTH_METHOD line covers `all`, not the `replication` pseudo-db.
echo; echo "\$ append 'host replication all all trust' to pg_hba.conf"
docker exec "$PRIMARY" bash -c \
  "echo 'host replication all all trust' >> /var/lib/postgresql/data/pg_hba.conf" 2>&1
say docker exec "$PRIMARY" psql -U postgres -c "SELECT pg_reload_conf();"

sql "$PRIMARY" "SELECT pg_create_physical_replication_slot('slot_a');"
sql "$PRIMARY" "SELECT pg_create_physical_replication_slot('slot_b');"

# --- standbys ------------------------------------------------------------
# pg_basebackup runs as the postgres user so PGDATA is not root-owned;
# -R writes primary_conninfo + standby.signal for us (PG12+).
build_standby() {
  local name="$1" vol="$2" slot="$3" port="$4"
  say docker volume create "$vol"
  echo; echo "\$ pg_basebackup -> $vol (slot $slot)"
  docker run --rm --network "$NET" --user postgres -v "$vol":/var/lib/postgresql/data "$IMAGE" \
    pg_basebackup -h "$PRIMARY" -U postgres -D /var/lib/postgresql/data -Fp -Xs -R -S "$slot" -P 2>&1
  say docker run -d --name "$name" --network "$NET" -v "$vol":/var/lib/postgresql/data \
    -p "$port":5432 "$IMAGE" -c hot_standby=on -c log_min_messages=warning
  echo; echo "--- waiting for $name ---"
  for i in $(seq 1 60); do
    if docker exec "$name" pg_isready -U postgres >/dev/null 2>&1; then
      echo "$name ready after ${i}s"; break
    fi
    sleep 1
  done
}

build_standby "$SBA" r4-sba-data slot_a 5442
build_standby "$SBB" r4-sbb-data slot_b 5443

# --- verify the topology is real before any experiment runs --------------
echo; echo "=== topology verification ==="
sql "$PRIMARY" "SELECT application_name, state, sync_state, sent_lsn, replay_lsn FROM pg_stat_replication ORDER BY application_name;"
sql "$SBA" "SELECT pg_is_in_recovery();"
sql "$SBB" "SELECT pg_is_in_recovery();"

echo; echo "=== setup complete — $(date) ==="
