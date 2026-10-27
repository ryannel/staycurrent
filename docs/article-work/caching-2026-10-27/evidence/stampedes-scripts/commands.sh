#!/bin/zsh
# Command-level observations for article 6 (stampedes). Redis 8.10.3 on port 7106 only.
rc() { /opt/homebrew/opt/redis/bin/redis-cli -p 7106 "$@"; }
run() { echo "> $*"; rc "$@" | sed 's/^/  /'; }
rc INFO server | grep -E "^(redis_version|tcp_port|os):"
rc FLUSHALL >/dev/null
echo; echo "## B. Acquire a rebuild lock: SET ... NX PX"
run SET lock:trending tok-A NX PX 5000
run SET lock:trending tok-B NX PX 5000
run GET lock:trending
run PTTL lock:trending
echo; echo "## C. Release only your own lock"
echo "# Redis 8.4+: DELEX ... IFEQ token. B tries to release A's lock, then A releases its own."
run DELEX lock:trending IFEQ tok-B
run GET lock:trending
run DELEX lock:trending IFEQ tok-A
run EXISTS lock:trending
echo "# Before 8.4: a Lua script that compares and deletes atomically."
SCRIPT='if redis.call("get",KEYS[1]) == ARGV[1] then return redis.call("del",KEYS[1]) else return 0 end'
echo "# script: $SCRIPT"
run SET lock:trending tok-A NX PX 5000
run EVAL "$SCRIPT" 1 lock:trending tok-B
run EVAL "$SCRIPT" 1 lock:trending tok-A
rc FLUSHALL >/dev/null
echo; echo "## D. A lock that expires during a slow rebuild, released with plain DEL"
run SET lock:trending tok-A NX PX 300
echo "# A's rebuild takes 400 ms; at about 350 ms, B misses and tries the lock"; sleep 0.35
run SET lock:trending tok-B NX PX 300
echo "# At about 400 ms A's rebuild fails; A releases in a finally block with plain DEL"; sleep 0.05
run DEL lock:trending
run SET lock:trending tok-C NX PX 300
echo "# Same timeline, released with DELEX IFEQ"
rc FLUSHALL >/dev/null
run SET lock:trending tok-A NX PX 300
sleep 0.35
run SET lock:trending tok-B NX PX 300
sleep 0.05
run DELEX lock:trending IFEQ tok-A
run SET lock:trending tok-C NX PX 300
run GET lock:trending
rc FLUSHALL >/dev/null
echo; echo "## E. Reading a value and its remaining lifetime together (soft and hard expiry)"
run SET trending '[42,17,8]' EX 600
echo "> MULTI / GET trending / PTTL trending / EXEC"
printf 'MULTI\nGET trending\nPTTL trending\nEXEC\n' | rc | sed 's/^/  /'
echo "# The same two commands pipelined without MULTI (one round trip)"
printf 'GET trending\nPTTL trending\n' | rc | sed 's/^/  /'
echo "# PTTL on a missing key and on a key without a TTL"
run PTTL nosuchkey
run SET plain x
run PTTL plain
echo; echo "## F. Storing the rebuild time with the value for XFetch: a hash with value and delta (ms)"
run HSET trending:x v '[42,17,8]' delta 212
run EXPIRE trending:x 60
echo "> HMGET trending:x v delta / PTTL trending:x (pipelined)"
printf 'HMGET trending:x v delta\nPTTL trending:x\n' | rc | sed 's/^/  /'
rc FLUSHALL >/dev/null
