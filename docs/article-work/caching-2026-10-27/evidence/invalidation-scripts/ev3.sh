#!/bin/bash
CLI="/opt/homebrew/opt/redis/bin/redis-cli -p 7105"
r() { echo "> $*"; $CLI "$@" | sed 's/^/  /'; }
port=$($CLI INFO server | tr -d '\r' | grep '^tcp_port:' | cut -d: -f2)
[ "$port" = "7105" ] || { echo "wrong server"; exit 1; }
$CLI FLUSHALL >/dev/null
echo "## F2. Versioned values with tombstones: the script used in the article"
echo "# A value is a hash {version, value}; a tombstone is a hash {version} with no value field."
echo "# Write if the cache has nothing, or an older version, or a tombstone of the same version."
SCRIPT='local cur = tonumber(redis.call("HGET", KEYS[1], "version") or "-1")
local new = tonumber(ARGV[1])
local dead = redis.call("HEXISTS", KEYS[1], "value") == 0
if new > cur or (new == cur and dead and ARGV[2] ~= "") then
  redis.call("DEL", KEYS[1])
  if ARGV[2] == "" then redis.call("HSET", KEYS[1], "version", ARGV[1])
  else redis.call("HSET", KEYS[1], "version", ARGV[1], "value", ARGV[2]) end
  redis.call("EXPIRE", KEYS[1], ARGV[3])
  return 1
end
return 0'
echo "$SCRIPT"
SHA=$($CLI SCRIPT LOAD "$SCRIPT")
echo "SHA $SHA"
c() { echo "> EVALSHA <script> 1 $*"; $CLI EVALSHA $SHA 1 "$@" | sed 's/^/  /'; }
echo "# Cache holds version 7 (price 39). Reader R misses later... first, start from a cached v7:"
c product:42 7 '{"price":39}' 3600
echo "# Race 1 with versions. The key expires or is evicted: (simulate with DEL)"
r DEL product:42
echo "# R misses and reads version 7 (price 39) from the database, then pauses."
echo "# W commits version 8 (price 35) and invalidates by writing a tombstone for version 8 (empty value):"
c product:42 8 '' 3600
r HGETALL product:42
echo "# R resumes and tries to fill version 7: refused."
c product:42 7 '{"price":39}' 3600
echo "# The next reader treats the tombstone as a miss, reads version 8, and fills: accepted (same version, replacing a tombstone)."
c product:42 8 '{"price":35}' 3600
r HGETALL product:42
r TTL product:42
echo "# Race 2 with versions: W1 (version 9) and W2 (version 10) update the cache out of order."
c product:42 10 '{"price":33}' 3600
c product:42 9 '{"price":34}' 3600
r HGET product:42 value
echo "# A duplicate or replayed event (version 10 again, with a value) is refused because it is not newer:"
c product:42 10 '{"price":33}' 3600
echo "# The weakness: if the key is evicted or deleted, the cache forgets version 10 and a late version 9 is accepted."
r DEL product:42
c product:42 9 '{"price":34}' 3600
r HGET product:42 value
r DEL product:42
echo
echo "## I. Delayed double delete: whether the second delete catches the slow reader depends on timing"
echo "# Case A: the reader's stale SET lands 150 ms after the first delete; the second delete is at 500 ms."
r DEL product:42
( sleep 0.15; $CLI SET product:42 '{"price":39}' EX 3600 >/dev/null; echo "  [+150 ms] reader SET old value" ) &
( sleep 0.5; echo "  [+500 ms] second DEL -> $($CLI DEL product:42)" ) &
wait
r GET product:42
echo "# Case B: the reader is slower: its SET lands 650 ms after the first delete, after the second delete."
r DEL product:42
( sleep 0.65; $CLI SET product:42 '{"price":39}' EX 3600 >/dev/null; echo "  [+650 ms] reader SET old value" ) &
( sleep 0.5; echo "  [+500 ms] second DEL -> $($CLI DEL product:42)" ) &
wait
r GET product:42
r TTL product:42
r DEL product:42
echo
echo "## K. Generation counter for a group of keys"
r SET gen:category:7 1
r SET category:7:g1:page:1 '[...]' EX 3600
r SET category:7:g1:page:2 '[...]' EX 3600
echo "# A product in category 7 changes. One INCR makes every g1 page unreachable:"
r INCR gen:category:7
r GET gen:category:7
r EXISTS category:7:g2:page:1
r DBSIZE
r TTL category:7:g1:page:1
echo "# The g1 keys remain in memory until their TTL or eviction. A reader pays one extra lookup, batchable:"
r MGET gen:category:7
echo
echo "## L. Tag set for a group of keys"
r SET search:kettle:p1 '[...]' EX 3600
r SET search:steel:p1 '[...]' PX 300
r SADD tag:product:42 search:kettle:p1 search:steel:p1
sleep 0.5
echo "# search:steel:p1 has expired, but its name stays in the tag set:"
r EXISTS search:steel:p1
r SMEMBERS tag:product:42
echo "# Invalidate: read the members, delete them and the set."
r SMEMBERS tag:product:42
r UNLINK search:kettle:p1 search:steel:p1 tag:product:42
echo
echo "## M. Pub/Sub is at-most-once"
r PUBLISH invalidate product:42
echo "# 0 subscribers received it; the message is not stored anywhere."
echo
echo "## N. A recent-write marker for read-your-writes"
r SET recent-write:user:7 1 EX 10
r EXISTS recent-write:user:7
r TTL recent-write:user:7
r DEL recent-write:user:7
