#!/bin/bash
# Experiment 3: the SQLSTATE behind the serialization failure.
#
# The article tells the reader that aborted serializable transactions "fail with
# SQLSTATE 40001, and the application must loop". psql's default output prints the
# message and not the code, so this run sets VERBOSITY verbose on the session that
# loses, to put the actual code on the page.
#
# Minimal SSI conflict (write skew shape): both sessions read the same set, then
# each writes a DIFFERENT row. No write-write conflict exists, so only SSI's
# dependency tracking can catch it.
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

log "experiment 3: SQLSTATE of a serialization failure -- container $CONT"
docker exec -i "$CONT" psql -U postgres -a <<'SQL'
DROP TABLE IF EXISTS oncall;
CREATE TABLE oncall (id int PRIMARY KEY, name text NOT NULL, on_duty boolean NOT NULL);
INSERT INTO oncall VALUES (1, 'alice', true), (2, 'bob', true);
SELECT * FROM oncall ORDER BY id;
SQL

rm -f "$FIFO_A" "$FIFO_B"; mkfifo "$FIFO_A" "$FIFO_B"
docker exec -i "$CONT" psql -U postgres --echo-all < "$FIFO_A" > "$LOGDIR/sessionA.log" 2>&1 & PID_A=$!
exec 3>"$FIFO_A"
docker exec -i "$CONT" psql -U postgres --echo-all < "$FIFO_B" > "$LOGDIR/sessionB.log" 2>&1 & PID_B=$!
exec 4>"$FIFO_B"
log "session A pid=$PID_A  session B pid=$PID_B  logs in $LOGDIR"

feedA() { log "feed A | $1 | $2"; printf '\\echo === STEP %s (fed %s) ===\n' "$1" "$(ts)" >&3; printf '%s\n' "$2" >&3; }
feedB() { log "feed B | $1 | $2"; printf '\\echo === STEP %s (fed %s) ===\n' "$1" "$(ts)" >&4; printf '%s\n' "$2" >&4; }

# The whole point of this run: B reports the SQLSTATE, not just the message.
feedB Bv '\set VERBOSITY verbose'; step
feedA A0 '\timing on'; step
feedB B0 '\timing on'; step
feedA A1 'BEGIN ISOLATION LEVEL SERIALIZABLE;'; step
feedB B1 'BEGIN ISOLATION LEVEL SERIALIZABLE;'; step
feedA A2 'SELECT count(*) FROM oncall WHERE on_duty;'; step
feedB B2 'SELECT count(*) FROM oncall WHERE on_duty;'; step
feedA A3 'UPDATE oncall SET on_duty = false WHERE id = 1;'; step
feedB B3 'UPDATE oncall SET on_duty = false WHERE id = 2;'; step
feedA A4 'COMMIT;'; step
sleep 1.5
feedB B4 'COMMIT;'; step

exec 3>&-; exec 4>&-
wait "$PID_A" "$PID_B"
log "both sessions ended (EOF)"

log "final state (one-off psql, output verbatim below):"
docker exec -i "$CONT" psql -U postgres -a <<'SQL'
SELECT * FROM oncall ORDER BY id;
SELECT count(*) AS still_on_duty FROM oncall WHERE on_duty;
SQL
log "invariant 'at least one on duty' must survive: SSI aborts one of the two."
