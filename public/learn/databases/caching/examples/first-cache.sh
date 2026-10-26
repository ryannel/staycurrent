#!/bin/sh
# Run only against a new disposable container. No host port is published.
set -eu
lab="staycurrent-first-cache-$$"
cleanup() { docker rm -f "$lab" >/dev/null 2>&1 || true; }
trap cleanup EXIT HUP INT TERM
docker run --detach --rm --name "$lab" --network none redis:8.2.2 \
  redis-server --save '' --appendonly no >/dev/null
r() { docker exec "$lab" redis-cli --raw "$@"; }
attempt=0
until r PING >/dev/null 2>&1; do
  attempt=$((attempt+1))
  [ "$attempt" -lt 20 ] || exit 1
  sleep 1
done
r INFO server | sed -n '/^redis_version:/p'
printf '\n1. Missing key (blank line in raw output):\n'
r GET demo:product:42
printf '\n2. Save a copy with a sixty-second lifetime:\n'
r SET demo:product:42 '{"name":"Blue mug","price":12}' EX 60
r GET demo:product:42
printf '\n3. Remaining lifetime in seconds (0–60):\n'
r TTL demo:product:42
printf '\n4. Delete the copy (one key deleted), then read (blank):\n'
r DEL demo:product:42
r GET demo:product:42
printf '\n5. Expire a new copy after one second:\n'
r SET demo:product:42 '{"name":"Blue mug","price":15}' EX 1
sleep 2
r GET demo:product:42
printf 'TTL of missing key: '
r TTL demo:product:42
