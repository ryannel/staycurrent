#!/bin/sh
# Single-primary cache-efficiency lease demonstration, not a distributed-lock proof.
set -eu
lab="staycurrent-cache-stampede-$$"
cleanup() { docker rm -f "$lab" >/dev/null 2>&1 || true; }
trap cleanup EXIT HUP INT TERM
docker run --detach --rm --name "$lab" --network none redis:8.2.2 redis-server --save '' --appendonly no >/dev/null
r() { docker exec "$lab" redis-cli --raw "$@"; }
assert_reply() { expected="$1"; shift; actual=$(r "$@"); [ "$actual" = "$expected" ] || { printf 'Unexpected %s reply: %s\n' "$1" "$actual" >&2; exit 1; }; }
attempt=0
until r PING >/dev/null 2>&1; do attempt=$((attempt+1)); [ "$attempt" -lt 20 ] || exit 1; sleep 1; done
r INFO server | sed -n '/^redis_version:/p'
lease='demo:{42}:lease'; value='demo:{42}:value'
release_script=$(cat <<'LUA'
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
LUA
)
fill_script=$(cat <<'LUA'
if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[2], ARGV[2], 'EX', ARGV[3])
redis.call('DEL', KEYS[1])
return 1
LUA
)
printf '\n1. Only A acquires the present lease:\n'
assert_reply OK SET "$lease" owner-a NX PX 60000
assert_reply '' SET "$lease" owner-b NX PX 60000
printf 'A: OK; B: nil. A can start work; B must follow its bounded waiting policy.\n'
printf '\n2. Expiring the lease does not cancel A: B can now acquire:\n'
# Shorten the deadline deliberately to make the same race fast and reproducible.
assert_reply 1 PEXPIRE "$lease" 1
sleep 1
assert_reply OK SET "$lease" owner-b NX PX 60000
assert_reply 0 EVAL "$release_script" 1 "$lease" owner-a
assert_reply owner-b GET "$lease"
assert_reply 0 EVAL "$fill_script" 2 "$lease" "$value" owner-a 12 60
assert_reply 0 EXISTS "$value"
printf 'Late A cannot delete B’s lease or fill under A’s expired ownership.\n'
printf '\n3. B atomically fills and releases while it still owns the lease:\n'
assert_reply 1 EVAL "$fill_script" 2 "$lease" "$value" owner-b 15 60
assert_reply 15 GET "$value"
assert_reply 0 EXISTS "$lease"
printf 'Saved value=15, lease absent.\n'
printf '\n4. Contrast: unconditional DEL can remove a successor’s lease:\n'
assert_reply OK SET "$lease" owner-c NX PX 60000
# An obsolete worker does not own owner-c, but DEL does not check ownership.
assert_reply 1 DEL "$lease"
assert_reply 0 EXISTS "$lease"
printf 'Unconditional DEL removed owner-c. The command itself cannot identify its caller.\n'
printf '\nAll assertions passed. Source work is not executed or cancelled by this lab.\n'
printf 'Ownership validation does not replace invalidation generations or source freshness.\n'
