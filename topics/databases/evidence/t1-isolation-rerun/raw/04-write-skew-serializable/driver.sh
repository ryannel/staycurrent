#!/bin/bash
# Experiment 4: the SAME write-skew interleaving as experiment 3, but with both
# transactions at SERIALIZABLE (PostgreSQL 16, Docker container r3-t1).
#
# Expectation from the docs: Postgres SSI detects the read/write dependency
# cycle and aborts one of the two transactions with a serialization error
# instead of letting both commit. Whatever actually happens is captured
# verbatim in the session logs.
#
# Technique identical to experiments 1-3: two long-lived `docker exec -i ... psql`
# sessions fed one statement at a time through FIFOs, strictly alternating,
# >=1.2s between steps. --echo-all prints each input line before its result;
# \timing on prints per-statement elapsed time. Marker lines:
# `\echo === STEP <n> (fed HH:MM:SS.mmm) ===` — timestamp is feed time.
#
# Interleaving driven here:
#   A: BEGIN ISOLATION LEVEL SERIALIZABLE;
#   B: BEGIN ISOLATION LEVEL SERIALIZABLE;
#   A: SELECT count(*) FROM doctors WHERE on_call;
#   B: SELECT count(*) FROM doctors WHERE on_call;
#   (driver applies the client-side rule for each session: go off call only if count >= 2)
#   A: UPDATE doctors SET on_call = false WHERE id = 1;
#   B: UPDATE doctors SET on_call = false WHERE id = 2;
#   A: COMMIT;    -- observe result
#   B: COMMIT;    -- observe result
#   final state read with a one-off psql
#
# Run as:  bash driver.sh 2>&1 | tee driver.log

set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
LOGDIR="${LOGDIR:-$DIR}"
mkdir -p "$LOGDIR"
CONT=r4-t1
FIFO_A="$LOGDIR/.fifo-a"; FIFO_B="$LOGDIR/.fifo-b"

ts() { perl -MTime::HiRes=time -e 'use POSIX qw(strftime); my $t=time; printf "%s.%03d", strftime("%H:%M:%S",localtime($t)), ($t-int($t))*1000;'; }
log() { echo "[$(ts)] $*"; }
step() { sleep 1.2; }
cleanup() { rm -f "$FIFO_A" "$FIFO_B"; }
trap cleanup EXIT

log "experiment 4: write-skew interleaving at SERIALIZABLE -- container $CONT"
log "invariant: at least one doctor on call. reset schema (one-off psql, output verbatim below):"
docker exec -i "$CONT" psql -U postgres -a <<'SQL'
DROP TABLE IF EXISTS doctors;
CREATE TABLE doctors (id int PRIMARY KEY, name text NOT NULL, on_call boolean NOT NULL);
INSERT INTO doctors VALUES (1, 'alice', true), (2, 'bob', true);
SELECT * FROM doctors ORDER BY id;
SQL

rm -f "$FIFO_A" "$FIFO_B"
mkfifo "$FIFO_A" "$FIFO_B"

docker exec -i "$CONT" psql -U postgres --echo-all < "$FIFO_A" > "$LOGDIR/sessionA.log" 2>&1 &
PID_A=$!
exec 3>"$FIFO_A"
docker exec -i "$CONT" psql -U postgres --echo-all < "$FIFO_B" > "$LOGDIR/sessionB.log" 2>&1 &
PID_B=$!
exec 4>"$FIFO_B"
log "session A pid=$PID_A  session B pid=$PID_B  logs in $LOGDIR"

feedA() { log "feed A | $1 | $2"; printf '\\echo === STEP %s (fed %s) ===\n' "$1" "$(ts)" >&3; printf '%s\n' "$2" >&3; }
feedB() { log "feed B | $1 | $2"; printf '\\echo === STEP %s (fed %s) ===\n' "$1" "$(ts)" >&4; printf '%s\n' "$2" >&4; }

last_num() { grep -E '^[[:space:]]*[0-9]+[[:space:]]*$' "$1" | tail -1 | tr -d '[:space:]'; }
wait_num() {
  local f="$1" i=0 v=""
  while [ "$i" -lt 20 ]; do
    v="$(last_num "$f")"
    if [ -n "$v" ]; then echo "$v"; return 0; fi
    sleep 0.5; i=$((i+1))
  done
  return 1
}

feedA A0 '\timing on'; step
feedB B0 '\timing on'; step
feedA A1 'BEGIN ISOLATION LEVEL SERIALIZABLE;'; step
feedB B1 'BEGIN ISOLATION LEVEL SERIALIZABLE;'; step
feedA A2 'SELECT count(*) FROM doctors WHERE on_call;'; step
feedB B2 'SELECT count(*) FROM doctors WHERE on_call;'; step

CNT_A="$(wait_num "$LOGDIR/sessionA.log")" || { log "FATAL: could not parse session A count"; exit 1; }
CNT_B="$(wait_num "$LOGDIR/sessionB.log")" || { log "FATAL: could not parse session B count"; exit 1; }
log "client A sees $CNT_A doctors on call; rule: alice may go off call only if count >= 2"
log "client B sees $CNT_B doctors on call; rule: bob may go off call only if count >= 2"

if [ "$CNT_A" -ge 2 ]; then
  feedA A3 'UPDATE doctors SET on_call = false WHERE id = 1;'
else
  log "client A: count < 2, alice stays on call (no UPDATE fed)"
fi
step
if [ "$CNT_B" -ge 2 ]; then
  feedB B3 'UPDATE doctors SET on_call = false WHERE id = 2;'
else
  log "client B: count < 2, bob stays on call (no UPDATE fed)"
fi
step
feedA A4 'COMMIT;'; step
sleep 1.5
feedB B4 'COMMIT;'; step

exec 3>&-
exec 4>&-
wait "$PID_A" "$PID_B"
log "both sessions ended (EOF)"

log "final state (one-off psql, output verbatim below):"
docker exec -i "$CONT" psql -U postgres -a <<'SQL'
SELECT * FROM doctors ORDER BY id;
SELECT count(*) AS doctors_on_call_now FROM doctors WHERE on_call;
SQL
log "done. compare doctors_on_call_now against the invariant (>= 1); COMMIT results are verbatim in the session logs."
