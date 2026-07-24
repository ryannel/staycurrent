#!/bin/bash
# Experiment 3: monotonic reads — the same reader, two replicas, time running backwards.
#
# The article's claim under test: "two refreshes hit two replicas with different
# lag, and time visibly runs backwards. The comment is there, gone, there again."
#
# This anomaly needs TWO replicas at different lag; one lagging replica can only
# show read-your-own-writes (experiment 2). Standby A streams normally, standby B
# is held at a fixed point with pg_wal_replay_pause(). A client that does not pin
# a session to one replica alternates between them.
#
# Wrong outcomes are visibly wrong: each comment body is its own sentinel, so the
# sequence of visible rows is unambiguous at every read.
#
# Run as:  bash driver-03-monotonic.sh 2>&1 | tee raw/03-monotonic.log
set -u

P=r4-repl-primary; A=r4-repl-sba; B=r4-repl-sbb
q() { local c="$1"; shift; echo; echo "\$ psql@${c#r4-repl-} -c \"$*\""; docker exec "$c" psql -U postgres -X -c "$*" 2>&1; }
# Millisecond wall clock: BSD date has no %3N, so take the same route the
# round-3 drivers took on this machine.
ts() { perl -MTime::HiRes=time -e 'use POSIX qw(strftime); my $t=time; printf "%s.%03d", strftime("%H:%M:%S",localtime($t)), ($t-int($t))*1000;'; }
# A "refresh" as the application sees it: which replica, wall clock, what it returned.
refresh() {
  local c="$1" label="$2"
  echo; echo "--- refresh #$label routed to ${c#r4-repl-}  (wall clock $(ts)) ---"
  docker exec "$c" psql -U postgres -X -c "SELECT count(*) AS visible_comments, coalesce(max(id),0) AS newest_id FROM comments;" 2>&1
}

echo "=== Experiment 3: monotonic reads — $(date) ==="

echo; echo "--- step 1: reset to a known, fully-replicated baseline ---"
q "$B" "SELECT pg_wal_replay_resume();"
q "$P" "DROP TABLE IF EXISTS comments; CREATE TABLE comments (id serial PRIMARY KEY, author text, body text);"
q "$P" "INSERT INTO comments (author, body) VALUES ('user7', 'sentinel-aaa111 — the first comment');"
sleep 2
q "$A" "SELECT id, body FROM comments;"
q "$B" "SELECT id, body FROM comments;"
echo "Baseline: both replicas show exactly 1 comment."

echo; echo "--- step 2: standby B is pinned at this point; standby A keeps streaming ---"
q "$B" "SELECT pg_wal_replay_pause();"

echo; echo "--- step 3: the user posts a second comment; the primary commits it ---"
q "$P" "INSERT INTO comments (author, body) VALUES ('user7', 'sentinel-bbb222 — the second comment') RETURNING id, body;"
sleep 2

echo; echo "--- step 4: four refreshes from ONE user, round-robined across the two replicas ---"
echo "--- The count must never go down. Watch it go down. ---"
refresh "$A" "1 (A)"
refresh "$B" "2 (B)"
refresh "$A" "3 (A)"
refresh "$B" "4 (B)"

echo; echo "--- step 5: what each replica had replayed at that moment ---"
q "$P" "SELECT application_name, sent_lsn, replay_lsn, pg_wal_lsn_diff(sent_lsn, replay_lsn) AS replay_lag_bytes FROM pg_stat_replication ORDER BY application_name;"

echo; echo "--- step 6: resume B; both replicas converge ---"
q "$B" "SELECT pg_wal_replay_resume();"
sleep 2
q "$A" "SELECT count(*) AS a_final FROM comments;"
q "$B" "SELECT count(*) AS b_final FROM comments;"

echo; echo "=== Experiment 3 complete — $(date) ==="
