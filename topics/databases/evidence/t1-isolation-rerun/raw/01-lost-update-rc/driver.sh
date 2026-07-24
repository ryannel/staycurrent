#!/bin/bash
# Experiment 1: lost update at READ COMMITTED (PostgreSQL 16, Docker container r3-t1).
#
# Technique: two genuinely concurrent psql sessions (A and B) against the same
# database. Each session is a long-lived `docker exec -i ... psql` process that
# reads its statements from a FIFO held open by this script, so the interleaving
# below is real concurrency between two server backends, not a simulation.
# Statements are fed one at a time, alternating between sessions, with >=1.2s
# between steps.
#
# Interleaving driven here (READ COMMITTED is the Postgres default):
#   A: BEGIN;
#   B: BEGIN;
#   A: SELECT balance FROM accounts WHERE id = 1;   -- A reads
#   B: SELECT balance FROM accounts WHERE id = 1;   -- B reads (before either writes)
#   (driver parses each session's SELECT result out of its own log and computes
#    new_balance = read_value - 100 CLIENT-SIDE, the way a naive app would)
#   A: UPDATE accounts SET balance = <A's computed value> WHERE id = 1;  -- takes row lock
#   B: UPDATE accounts SET balance = <B's computed value> WHERE id = 1;  -- blocks on A's lock
#   A: COMMIT;                                       -- B's UPDATE unblocks and proceeds
#   B: COMMIT;
#   final state read with a one-off psql
#
# Log semantics:
#   sessionA.log / sessionB.log are the verbatim stdout+stderr of each psql,
#   run with --echo-all (every input line is printed before its result) and
#   \timing on (per-statement elapsed time, which exposes lock waits).
#   Before each statement the driver injects a marker line:
#       \echo === STEP <n> (fed HH:MM:SS.mmm) ===
#   The timestamp inside the marker text is when the line was FED into the
#   session; the marker PRINTS only when the session reaches it (i.e. after any
#   earlier blocked statement finished). driver.log (this script's stdout) is
#   the same feed timeline seen from the driver's side.
#
# Run as:  bash driver.sh 2>&1 | tee driver.log
# Session logs are written next to this script unless LOGDIR is set.

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

log "experiment 1: lost update at READ COMMITTED -- container $CONT"
log "reset schema (one-off psql, output verbatim below):"
docker exec -i "$CONT" psql -U postgres -a <<'SQL'
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (id int PRIMARY KEY, balance int NOT NULL);
INSERT INTO accounts VALUES (1, 1000);
SELECT * FROM accounts;
SHOW default_transaction_isolation;
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

# last standalone integer line in a session log = most recent single-column numeric result
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
feedA A1 'BEGIN;'; step
feedB B1 'BEGIN;'; step
feedA A2 'SELECT balance FROM accounts WHERE id = 1;'; step
feedB B2 'SELECT balance FROM accounts WHERE id = 1;'; step

VAL_A="$(wait_num "$LOGDIR/sessionA.log")" || { log "FATAL: could not parse session A SELECT result"; exit 1; }
VAL_B="$(wait_num "$LOGDIR/sessionB.log")" || { log "FATAL: could not parse session B SELECT result"; exit 1; }
NEW_A=$((VAL_A - 100)); NEW_B=$((VAL_B - 100))
log "client A read balance=$VAL_A, computes ${VAL_A}-100=${NEW_A} in the client"
log "client B read balance=$VAL_B, computes ${VAL_B}-100=${NEW_B} in the client"

feedA A3 "UPDATE accounts SET balance = $NEW_A WHERE id = 1;"; step
feedB B3 "UPDATE accounts SET balance = $NEW_B WHERE id = 1;"
log "B3 fed; B's UPDATE should now be blocked on A's row lock (see elapsed time on B3 in sessionB.log)"
sleep 2.5
feedA A4 'COMMIT;'; step
sleep 1.5
feedB B4 'COMMIT;'; step

exec 3>&-
exec 4>&-
wait "$PID_A" "$PID_B"
log "both sessions ended (EOF)"

log "final state (one-off psql, output verbatim below):"
docker exec -i "$CONT" psql -U postgres -a <<'SQL'
SELECT * FROM accounts;
SQL
log "done. started at 1000; A and B each subtracted 100 client-side; final balance above."
