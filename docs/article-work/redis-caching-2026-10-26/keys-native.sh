#!/usr/bin/env bash
set -euo pipefail
cache_container="staycurrent-cache-keys-$$"
docker run --rm -d --name "$cache_container" redis:8.2.2 redis-server --save '' --appendonly no >/dev/null
trap 'docker stop "$cache_container" >/dev/null' EXIT
for attempt in $(seq 1 30); do
  if docker exec "$cache_container" redis-cli ping >/dev/null 2>&1; then break; fi
  sleep 0.1
done
r() { docker exec "$cache_container" redis-cli --raw "$@"; }
expect() {
  local expected="$1"; shift
  local actual
  actual=$(r "$@")
  if [[ "$actual" != "$expected" ]]; then
    printf 'FAIL %s: expected <%s>, got <%s>\n' "$*" "$expected" "$actual"
    exit 1
  fi
  printf 'PASS %s => <%s>\n' "$*" "$actual"
}
docker exec "$cache_container" redis-server --version
expect 2 HSET offer currency EUR amount 1800
expect $'EUR\n1800' HMGET offer currency amount
expect 0 HSET offer currency USD
expect $'USD\n1800' HMGET offer currency amount
expect 0 HSET offer currency USD amount 2000
expect $'USD\n2000' HMGET offer currency amount
expect 'WRONGTYPE Operation against a key holding the wrong kind of value' GET offer
expect 1 EXPIRE offer 60
expect 0 HSET offer amount 2100
remaining=$(r TTL offer)
[[ "$remaining" -gt 0 && "$remaining" -le 60 ]]
printf 'PASS HSET preserves key TTL => %s\n' "$remaining"
expect 1 HSET offer obsolete yes
expect 0 HSET offer amount 2200
expect yes HGET offer obsolete
expect OK SET string-offer old EX 60
expect OK SET string-offer new
expect -1 TTL string-offer
expect OK SET missing-product '{"found":false}' PX 150
expect '{"found":false}' GET missing-product
sleep 0.2
expect '' GET missing-product
expect -2 TTL missing-product
printf 'All key and value representation checks passed.\n'
