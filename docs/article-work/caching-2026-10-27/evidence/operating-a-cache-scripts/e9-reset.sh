#!/usr/bin/env bash
# E9: INFO's hit and miss counters reset on CONFIG RESETSTAT and on restart. Usage: e9-reset.sh <port> <dir>
R=/opt/homebrew/opt/redis/bin; P=$1; D=$2
cli() { "$R/redis-cli" -p "$P" "$@"; }
cli FLUSHALL >/dev/null; cli SET a 1 >/dev/null; cli CONFIG RESETSTAT >/dev/null
for i in 1 2 3; do cli GET a >/dev/null; cli GET b >/dev/null; done
echo "after 3 hits and 3 misses:"; cli INFO stats | grep -E "keyspace_(hits|misses)"
cli CONFIG RESETSTAT >/dev/null; echo "after CONFIG RESETSTAT:"; cli INFO stats | grep -E "keyspace_(hits|misses)"
for i in 1 2 3; do cli GET a >/dev/null; done; echo "after 3 more hits:"; cli INFO stats | grep -E "keyspace_hits"
cli SHUTDOWN NOSAVE; sleep 1
"$R/redis-server" --port "$P" --save '' --appendonly no --daemonize yes --dir "$D" --pidfile "$D/pid"; sleep 1
echo "after SHUTDOWN NOSAVE and a fresh start:"; cli INFO stats | grep -E "keyspace_(hits|misses)"; cli INFO server | grep -E "uptime_in_seconds"
