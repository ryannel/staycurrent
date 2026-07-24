#!/bin/bash
# Experiment 2: read-your-own-writes against a lagging replica.
#
# The article's claim under test: "a user posts a comment, committed on the
# leader; the refresh reads a lagging replica; the comment is gone. Nothing was
# lost — the read raced the replication stream and won."
#
# Wrong outcomes are made visibly wrong: the comment body is a sentinel string
# ('sentinel-9f4c22 — posted by user 7'). A replica either has that exact row or
# it has nothing. There is no value a confused reader could mistake for success.
#
# Lag is induced deterministically with pg_wal_replay_pause() on standby B, so
# the anomaly reproduces every run and its cause is not in question. Standby A
# is left streaming as the control: the same read, at the same moment, against a
# current replica must show the row.
#
# Run as:  bash driver-02-ryow.sh 2>&1 | tee raw/02-ryow.log
set -u

P=r4-repl-primary; A=r4-repl-sba; B=r4-repl-sbb
q()  { local c="$1"; shift; echo; echo "\$ psql@${c#r4-repl-} -c \"$*\""; docker exec "$c" psql -U postgres -X -c "$*" 2>&1; }

echo "=== Experiment 2: read-your-own-writes — $(date) ==="

echo; echo "--- step 1: the table, created on the primary ---"
q "$P" "DROP TABLE IF EXISTS comments; CREATE TABLE comments (id serial PRIMARY KEY, author text, body text, posted_at timestamptz DEFAULT now());"

sleep 2
echo; echo "--- step 2: both standbys agree the table is empty (baseline) ---"
q "$A" "SELECT count(*) AS rows_on_standby_a FROM comments;"
q "$B" "SELECT count(*) AS rows_on_standby_b FROM comments;"

echo; echo "--- step 3: pause WAL replay on standby B — this is the induced lag ---"
q "$B" "SELECT pg_wal_replay_pause();"
q "$B" "SELECT pg_is_wal_replay_paused();"

echo; echo "--- step 4: the user posts a comment. The primary acknowledges the COMMIT. ---"
q "$P" "INSERT INTO comments (author, body) VALUES ('user7', 'sentinel-9f4c22 — posted by user 7') RETURNING id, author, body;"
q "$P" "SELECT count(*) AS rows_on_primary FROM comments;"

echo; echo "--- step 5: the user refreshes. The read is routed to standby B. ---"
echo "--- THIS IS THE ANOMALY: the write is committed and acknowledged, and the row is not here."
q "$B" "SELECT count(*) AS rows_on_standby_b FROM comments;"
q "$B" "SELECT id, author, body FROM comments;"

echo; echo "--- step 6: control — the same read, same moment, against the streaming standby A ---"
q "$A" "SELECT id, author, body FROM comments;"

echo; echo "--- step 7: how far behind standby B actually is, in bytes and in time ---"
q "$P" "SELECT application_name, state, sent_lsn, replay_lsn, pg_wal_lsn_diff(sent_lsn, replay_lsn) AS replay_lag_bytes FROM pg_stat_replication ORDER BY application_name;"
q "$B" "SELECT pg_last_wal_receive_lsn() AS received, pg_last_wal_replay_lsn() AS replayed, pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn()) AS unreplayed_bytes;"

echo; echo "--- step 8: nothing was lost. Resume replay and the comment arrives. ---"
q "$B" "SELECT pg_wal_replay_resume();"
sleep 2
q "$B" "SELECT id, author, body FROM comments;"

echo; echo "=== Experiment 2 complete — $(date) ==="
