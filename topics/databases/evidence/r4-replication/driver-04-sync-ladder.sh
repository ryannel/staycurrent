#!/bin/bash
# Experiment 4: what one synchronous standby costs per commit.
#
# The article's claim under test: "The alternative, synchronous replication, adds
# at minimum one network round trip to every commit, because the leader waits for
# the standby's disk before answering."
#
# The docs state the mechanism. What they do not give you is the shape of the
# ladder — how the five synchronous_commit settings actually separate on one
# topology — so that is what this measures. Standby A is made the synchronous
# standby; standby B stays asynchronous throughout and is never waited on.
#
# The five rungs, and who the primary waits for at COMMIT:
#   off          — nobody. The commit is acknowledged before its own WAL is flushed.
#   local        — the primary's own disk.
#   remote_write — the standby's OS, once it has received and written the WAL.
#   on           — the standby's disk (flushed). This is the "one network round trip".
#   remote_apply — the standby has REPLAYED it, so a read there sees the row.
#
# Method: pgbench, single client (-c 1) so the reported latency is per-commit and
# not a throughput average across concurrent sessions, 300 transactions per run,
# three runs per rung. Every run's number is kept; the spread is the result, not
# the mean. Absolute milliseconds on a laptop with three containers on one Docker
# VM are not portable — the SEPARATION between rungs is the finding.
#
# FIRST-ATTEMPT DEFECT, fixed here and preserved at raw/04a-sync-ladder-INVALID.log:
# `psql -c "ALTER SYSTEM SET ...; SELECT pg_reload_conf();"` sends both statements
# as ONE implicit transaction, and ALTER SYSTEM cannot run inside a transaction
# block. The setting was never applied, both standbys stayed async, and all three
# standby-waiting rungs silently measured local-flush latency instead. Every
# ALTER SYSTEM below is therefore its own -c invocation, and the guard at step 3
# aborts the run rather than benchmark a premise that is not true.
#
# Run as:  bash driver-04-sync-ladder.sh 2>&1 | tee raw/04-sync-ladder.log
set -u

P=r4-repl-primary
psqlc() { docker exec "$P" psql -U postgres -X -c "$*" 2>&1; }
q() { echo; echo "\$ psql@primary -c \"$*\""; psqlc "$*"; }

echo "=== Experiment 4: the synchronous_commit ladder — $(date) ==="

echo; echo "--- step 1: the table under test, and the pgbench script (one INSERT per transaction) ---"
q "DROP TABLE IF EXISTS ledger;"
q "CREATE TABLE ledger (id serial PRIMARY KEY, payload text);"
docker exec "$P" bash -c "printf 'INSERT INTO ledger (payload) VALUES (%s);\n' \"'x'\" > /tmp/bench.sql"
echo; echo "\$ cat /tmp/bench.sql"; docker exec "$P" cat /tmp/bench.sql

echo; echo "--- step 2: before — no synchronous standby is named, so both replicas are async ---"
q "ALTER SYSTEM RESET synchronous_standby_names;"
q "SELECT pg_reload_conf();"
sleep 2
q "SHOW synchronous_standby_names;"
q "SELECT application_name, sync_state FROM pg_stat_replication ORDER BY application_name;"

echo; echo "--- step 3: name standby A as the synchronous standby (each ALTER SYSTEM its own -c) ---"
q "ALTER SYSTEM SET synchronous_standby_names = 'sba';"
q "SELECT pg_reload_conf();"
sleep 2
q "SHOW synchronous_standby_names;"
q "SELECT application_name, sync_state FROM pg_stat_replication ORDER BY application_name;"

# The guard: refuse to produce numbers unless standby A is genuinely sync.
SYNCSTATE=$(docker exec "$P" psql -U postgres -X -t -A \
  -c "SELECT sync_state FROM pg_stat_replication WHERE application_name = 'sba';" 2>&1 | tr -d '[:space:]')
echo; echo "guard: sync_state for sba = '${SYNCSTATE}'"
if [ "$SYNCSTATE" != "sync" ]; then
  echo "ABORT: standby A is not synchronous — the ladder below would measure nothing."
  exit 1
fi
echo "guard passed: standby A is synchronous, standby B remains async and is never waited on."

echo; echo "--- step 4: the ladder. Three runs per rung, every run reported. ---"
for LEVEL in off local remote_write on remote_apply; do
  echo; echo "============================================================"
  echo "=== synchronous_commit = $LEVEL"
  echo "============================================================"
  psqlc "ALTER SYSTEM SET synchronous_commit = '$LEVEL';"
  psqlc "SELECT pg_reload_conf();" >/dev/null
  sleep 1
  echo "\$ psql@primary -c 'SHOW synchronous_commit;'"
  psqlc "SHOW synchronous_commit;"
  for RUN in 1 2 3; do
    echo
    echo "--- $LEVEL, run $RUN of 3 ---"
    echo "\$ pgbench -U postgres -n -c 1 -j 1 -t 300 -f /tmp/bench.sql postgres"
    docker exec "$P" pgbench -U postgres -n -c 1 -j 1 -t 300 -f /tmp/bench.sql postgres 2>&1 \
      | grep -E 'number of transactions actually|latency average|^tps'
  done
done

echo; echo "--- step 5: restore the defaults and leave the topology async ---"
q "ALTER SYSTEM RESET synchronous_commit;"
q "ALTER SYSTEM RESET synchronous_standby_names;"
q "SELECT pg_reload_conf();"
sleep 2
q "SHOW synchronous_commit;"
q "SELECT application_name, sync_state FROM pg_stat_replication ORDER BY application_name;"
q "SELECT count(*) AS total_rows_written FROM ledger;"

echo; echo "=== Experiment 4 complete — $(date) ==="
