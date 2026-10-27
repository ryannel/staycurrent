#!/bin/bash
CLI="/opt/homebrew/opt/redis/bin/redis-cli -p 7105"
r() { echo "> $*"; $CLI "$@" | sed 's/^/  /'; }
port=$($CLI INFO server | tr -d '\r' | grep '^tcp_port:' | cut -d: -f2)
[ "$port" = "7105" ] || { echo "wrong server"; exit 1; }
$CLI FLUSHALL >/dev/null
echo "## K2. A generation counter that is lost brings old keys back"
echo "# The application treats a missing generation as 1."
r SET gen:category:7 1
r SET category:7:g1:page:1 'old page' EX 3600
r INCR gen:category:7
r SET category:7:g2:page:1 'new page' EX 3600
echo "# The counter is evicted (simulated with DEL). The next reader finds no generation, assumes 1, and reads the old page:"
r DEL gen:category:7
r GET gen:category:7
r GET category:7:g1:page:1
echo "# Remedy: when the counter is missing, start it from a value no earlier generation used, such as the time in milliseconds, with NX so concurrent readers agree:"
r SET gen:category:7 1793140000000 NX
r GET gen:category:7
r EXISTS category:7:g1793140000000:page:1
r FLUSHALL
echo
echo "## O. Delete hold-off with a short tombstone and NX fills (the memcache 'hold-off' idea in Redis)"
echo "# The writer replaces the value with a tombstone that lives 2 s; fills use NX and so cannot replace it."
r SET product:42 '{"price":39}' EX 3600
r SET product:42 tombstone PX 2000
r SET product:42 '{"price":39}' NX EX 3600
r GET product:42
sleep 2.1
echo "# After the hold-off ends, a late stale fill is accepted again:"
r SET product:42 '{"price":39}' NX EX 3600
r GET product:42
r FLUSHALL
