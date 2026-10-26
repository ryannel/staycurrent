#!/usr/bin/env bash
set -euo pipefail
cache_container="staycurrent-cache-first-$$"
docker run --rm -d --name "$cache_container" redis:8.2.2 redis-server --save '' --appendonly no >/dev/null
trap 'docker stop "$cache_container" >/dev/null' EXIT
for attempt in $(seq 1 30); do
  if docker exec "$cache_container" redis-cli ping >/dev/null 2>&1; then break; fi
  sleep 0.1
done
r() { docker exec "$cache_container" redis-cli --raw "$@"; }
expect() {
  local expected="$1"
  shift
  local actual
  actual=$(r "$@")
  if [[ "$actual" != "$expected" ]]; then
    printf 'FAIL %s: expected <%s>, got <%s>\n' "$*" "$expected" "$actual"
    exit 1
  fi
  printf 'PASS %s => <%s>\n' "$*" "$actual"
}
docker exec "$cache_container" redis-server --version
docker image inspect redis:8.2.2 --format '{{index .RepoDigests 0}}'
expect '' GET product:blue-mug:EUR
expect OK SET product:blue-mug:EUR '{"name":"Blue mug","price":18,"currency":"EUR"}' EX 60
expect '{"name":"Blue mug","price":18,"currency":"EUR"}' GET product:blue-mug:EUR
remaining=$(r TTL product:blue-mug:EUR)
[[ "$remaining" -gt 0 && "$remaining" -le 60 ]]
printf 'PASS TTL is positive and at most 60 => %s\n' "$remaining"
expect 1 DEL product:blue-mug:EUR
expect '' GET product:blue-mug:EUR
expect -2 TTL product:blue-mug:EUR
expect 0 DEL product:blue-mug:EUR
expect OK SET product:blue-mug:EUR '{"name":"Blue mug","price":15,"currency":"EUR"}' EX 60
expect '{"name":"Blue mug","price":15,"currency":"EUR"}' GET product:blue-mug:EUR
expect OK SET expiry-check value PX 100
sleep 0.2
expect '' GET expiry-check
expect -2 TTL expiry-check
expect OK SET no-expiry value
expect -1 TTL no-expiry
printf 'All native first-copy checks passed. Only the exercise container is stopped.\n'
