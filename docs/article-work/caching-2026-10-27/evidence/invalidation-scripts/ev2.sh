#!/bin/bash
CLI="/opt/homebrew/opt/redis/bin/redis-cli -p 7105"
r() { echo "> $*"; $CLI "$@" | sed 's/^/  /'; }
port=$($CLI INFO server | tr -d '\r' | grep '^tcp_port:' | cut -d: -f2)
[ "$port" = "7105" ] || { echo "wrong server"; exit 1; }
$CLI FLUSHALL >/dev/null
echo "## E. A lease held in the key itself (placeholder plus SET ... IFEQ, Redis 8.4+)"
echo "# Reader R misses, then takes the lease by writing a placeholder with a unique token, before reading the database."
r GET product:42
r SET product:42 'lease:r-81c2' NX PX 10000
echo "# A second reader S misses too. Its NX fails: someone is already loading this key."
r GET product:42
r SET product:42 'lease:s-4d07' NX PX 10000
echo "# R reads 39 from the database and pauses. Writer W commits 35 and deletes the key, which removes R's placeholder."
r DEL product:42
echo "# R resumes and fills only if its own placeholder is still there. It is not, so the old value is refused."
r SET product:42 '{"price":39}' IFEQ 'lease:r-81c2' EX 3600
r EXISTS product:42
echo "# The next reader takes a new lease, reads 35 and fills."
r SET product:42 'lease:t-0b9e' NX PX 10000
r SET product:42 '{"price":35}' IFEQ 'lease:t-0b9e' EX 3600
r GET product:42
r TTL product:42
echo "# Without a racing write, the fill succeeds:"
r DEL product:42
r SET product:42 'lease:u-11aa' NX PX 10000
r SET product:42 '{"price":35}' IFEQ 'lease:u-11aa' EX 3600
r GET product:42
echo "# A lease that expires (PX 200, filler takes 400 ms) also refuses the late fill:"
r DEL product:42
r SET product:42 'lease:v-5e5e' NX PX 200
sleep 0.4
r SET product:42 '{"price":35}' IFEQ 'lease:v-5e5e' EX 3600
r EXISTS product:42
echo "# A late fill cannot overwrite a newer reader's lease either (tokens differ):"
r SET product:42 'lease:w-2222' NX PX 10000
r SET product:42 '{"price":39}' IFEQ 'lease:v-5e5e' EX 3600
r GET product:42
r DEL product:42
echo
echo "## F. Versioned values: set only if newer (Lua script, any Redis version with scripting)"
SCRIPT='local cur = redis.call("HGET", KEYS[1], "v") if (not cur) or tonumber(cur) < tonumber(ARGV[1]) then redis.call("HSET", KEYS[1], "v", ARGV[1], "data", ARGV[2]) redis.call("EXPIRE", KEYS[1], ARGV[3]) return 1 else return 0 end'
echo "script: $SCRIPT"
echo "# W2's version 8 (price 35) arrives first, then W1's late version 7 (price 37):"
r EVAL "$SCRIPT" 1 product:42 8 '{"price":35}' 3600
r EVAL "$SCRIPT" 1 product:42 7 '{"price":37}' 3600
r HGETALL product:42
echo "# A repeat of version 8 is also refused (not newer):"
r EVAL "$SCRIPT" 1 product:42 8 '{"price":35}' 3600
echo "# The catch: after a DEL, the cache has forgotten version 8, and a late version 7 is accepted."
r DEL product:42
r EVAL "$SCRIPT" 1 product:42 7 '{"price":37}' 3600
r HGETALL product:42
echo "# Invalidating with a tombstone that carries the new version (and a TTL) instead of DEL keeps the knowledge:"
r DEL product:42
r HSET product:42 v 8 data ''
r EXPIRE product:42 3600
r EVAL "$SCRIPT" 1 product:42 7 '{"price":37}' 3600
r HGETALL product:42
echo "# A reader that finds an empty data field treats it as a miss; its fill (version 8 from the database) replaces the tombstone only if newer, so it must use >= for fills of the same version, or the writer uses version 8 and fills carry their row version."
r DEL product:42
echo
echo "## G. Set only if newer built from SET ... IFEQ (Redis 8.4+): read, compare in the application, write if unchanged"
r SET product:42 'v7|{"price":37}' EX 3600
echo "# Writer A reads the current value, sees version 7, and wants to write version 9."
r GET product:42
echo "# Meanwhile writer B writes version 8 with the same method:"
r SET product:42 'v8|{"price":36}' IFEQ 'v7|{"price":37}' EX 3600
echo "# A's write is conditional on the value it read; it fails, so A reads again, compares 9 > 8, and retries:"
r SET product:42 'v9|{"price":35}' IFEQ 'v7|{"price":37}' EX 3600
r GET product:42
r SET product:42 'v9|{"price":35}' IFEQ 'v8|{"price":36}' EX 3600
r GET product:42
echo "# A late writer with version 8 reads v9, sees 8 < 9, and writes nothing."
r DEL product:42
echo
echo "## H. WATCH aborts a transaction if the key changed (optimistic check-and-set; taught in article 8)"
echo "(skipped here; see research-C section H)"
