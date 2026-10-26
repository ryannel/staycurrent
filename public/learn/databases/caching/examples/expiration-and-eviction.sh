#!/bin/sh
# Only touches a new disposable Redis container; no host port or persistence.
set -eu
lab="staycurrent-cache-lifetime-$$"
cleanup() { docker rm -f "$lab" >/dev/null 2>&1 || true; }
trap cleanup EXIT HUP INT TERM
docker run --detach --rm --name "$lab" --network none redis:8.2.2 redis-server --save '' --appendonly no >/dev/null
r() { docker exec "$lab" redis-cli --raw "$@"; }
assert_reply() { expected="$1"; shift; actual=$(r "$@"); [ "$actual" = "$expected" ] || { printf 'Unexpected %s reply: %s\n' "$1" "$actual" >&2; exit 1; }; }
attempt=0
until r PING >/dev/null 2>&1; do attempt=$((attempt+1)); [ "$attempt" -lt 20 ] || exit 1; sleep 1; done
r INFO server | sed -n '/^redis_version:/p'
printf '\n1. GET and SET KEEPTTL preserve the absolute expiry:\n'
assert_reply OK SET demo:price 12 EX 60
deadline=$(r PEXPIRETIME demo:price)
assert_reply 12 GET demo:price
assert_reply "$deadline" PEXPIRETIME demo:price
assert_reply OK SET demo:price 15 KEEPTTL
assert_reply "$deadline" PEXPIRETIME demo:price
printf 'Both operations retained the same deadline.\n'
printf '\n2. Plain SET removes expiry; GETEX sets one while returning the value:\n'
assert_reply OK SET demo:price 18
assert_reply -1 TTL demo:price
assert_reply 18 GETEX demo:price EX 60
remaining=$(r TTL demo:price); [ "$remaining" -ge 0 ] && [ "$remaining" -le 60 ]
printf 'GETEX returned 18; remaining TTL: %s\n' "$remaining"
assert_reply 1 PEXPIRE demo:price 1
sleep 1
assert_reply -2 TTL demo:price
assert_reply 0 EXISTS demo:price
printf 'After expiry, TTL is -2 and EXISTS is 0.\n'
printf '\n3. allkeys-lru evicts values whose 600-second TTL has not run out:\n'
assert_reply OK CONFIG SET maxmemory-policy allkeys-lru
# Warm commands before measuring the baseline; sizes vary across builds.
r SET warm x >/dev/null; r INFO memory >/dev/null; r FLUSHDB >/dev/null
baseline=$(r INFO memory | tr -d '\r' | sed -n 's/^used_memory://p')
limit=$((baseline+262144))
assert_reply OK CONFIG SET maxmemory "$limit"
assert_reply OK CONFIG RESETSTAT
payload=$(awk 'BEGIN {for(i=0;i<8192;i++)printf "x"}')
i=0
while [ "$i" -lt 100 ]; do assert_reply OK SET "demo:item:$i" "$payload" EX 600; i=$((i+1)); done
evicted=$(r INFO stats | tr -d '\r' | sed -n 's/^evicted_keys://p')
expired=$(r INFO stats | tr -d '\r' | sed -n 's/^expired_keys://p')
[ "$evicted" -gt 0 ]; [ "$expired" -eq 0 ]
printf 'Wrote 100 values; evicted=%s, expired=%s\n' "$evicted" "$expired"
printf '\n4. noeviction rejects a fill but preserves a readable existing value:\n'
assert_reply OK CONFIG SET maxmemory 0
assert_reply OK FLUSHDB
assert_reply OK SET demo:existing retained
assert_reply OK CONFIG SET maxmemory-policy noeviction
assert_reply OK CONFIG SET maxmemory 1
reply=$(r SET demo:new value)
case "$reply" in OOM*) ;; *) printf 'Expected OOM, got %s\n' "$reply" >&2; exit 1;; esac
assert_reply retained GET demo:existing
printf 'SET rejected with OOM; GET returned retained.\n'
printf '\n5. volatile-lru cannot evict a key without an expiry:\n'
assert_reply OK CONFIG SET maxmemory-policy volatile-lru
reply=$(r SET demo:new value)
case "$reply" in OOM*) ;; *) printf 'Expected OOM, got %s\n' "$reply" >&2; exit 1;; esac
assert_reply retained GET demo:existing
printf 'No eligible key: SET rejected, persistent key remains.\n'
printf '\nAll command assertions passed. Victim order and byte counts are not portable.\n'
