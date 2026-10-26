#!/bin/sh
# Independent disposable Redis 8.2.2 lab. No host port is published.
set -eu
lab="staycurrent-cache-keys-$$"
cleanup() { docker rm -f "$lab" >/dev/null 2>&1 || true; }
trap cleanup EXIT HUP INT TERM
docker run --detach --rm --name "$lab" --network none redis:8.2.2 \
  redis-server --save '' --appendonly no >/dev/null
r() { docker exec "$lab" redis-cli --raw "$@"; }
assert_reply() {
 expected="$1"; shift
 actual=$(r "$@")
 [ "$actual" = "$expected" ] || { printf 'Unexpected reply to %s: %s\n' "$1" "$actual" >&2; exit 1; }
}
attempt=0
until r PING >/dev/null 2>&1; do
 attempt=$((attempt+1)); [ "$attempt" -lt 20 ] || exit 1; sleep 1
done
r INFO server | sed -n '/^redis_version:/p'
printf '\n1. Two shops with product 42 keep different values:\n'
assert_reply OK SET demo:card:v1:harbour:42 '{"name":"Blue mug","price":12}' EX 60
assert_reply OK SET demo:card:v1:hill:42 '{"name":"Red bowl","price":18}' EX 60
r MGET demo:card:v1:harbour:42 demo:card:v1:hill:42
assert_reply string TYPE demo:card:v1:harbour:42
printf '\n2. A hash exposes selected fields:\n'
assert_reply 3 HSET demo:product:v1:42 name 'Blue mug' category kitchen discount 10
assert_reply hash TYPE demo:product:v1:42
r HMGET demo:product:v1:42 name category
printf '\n3. HSET updates supplied fields; omitted discount remains:\n'
assert_reply 0 HSET demo:product:v1:42 name 'Blue mug' category gifts
assert_reply 10 HGET demo:product:v1:42 discount
r HGET demo:product:v1:42 discount
printf '\n4. Empty string and missing field are different (JSON reply):\n'
assert_reply 1 HSET demo:product:v1:42 subtitle ''
docker exec "$lab" redis-cli --json HMGET demo:product:v1:42 subtitle missing
printf '\n5. HSET preserves the existing key expiry:\n'
assert_reply 1 EXPIRE demo:product:v1:42 60
assert_reply 0 HSET demo:product:v1:42 category kitchen
remaining=$(r TTL demo:product:v1:42)
[ "$remaining" -ge 0 ] && [ "$remaining" -le 60 ]
printf 'TTL is non-negative: %s\n' "$remaining"
printf '\n6. Cached absence is an existing string, not a missing Redis key:\n'
assert_reply OK SET demo:lookup:v1:99 '{"kind":"not_found"}' EX 60
assert_reply 1 EXISTS demo:lookup:v1:99
assert_reply '{"kind":"not_found"}' GET demo:lookup:v1:99
r GET demo:lookup:v1:99
printf '\nAll command assertions passed.\n'
