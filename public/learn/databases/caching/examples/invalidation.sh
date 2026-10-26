#!/bin/sh
# Redis operations are real. Database commits/reads are explicitly held shell values.
# Only a new disposable Redis container is touched; no ports or persistence.
set -eu
lab="staycurrent-cache-invalidation-$$"
cleanup() { docker rm -f "$lab" >/dev/null 2>&1 || true; }
trap cleanup EXIT HUP INT TERM
docker run --detach --rm --name "$lab" --network none redis:8.2.2 redis-server --save '' --appendonly no >/dev/null
r() { docker exec "$lab" redis-cli --raw "$@"; }
j() { docker exec "$lab" redis-cli --json "$@"; }
assert_reply() { expected="$1"; shift; actual=$(r "$@"); [ "$actual" = "$expected" ] || { printf 'Unexpected %s reply: %s\n' "$1" "$actual" >&2; exit 1; }; }
attempt=0
until r PING >/dev/null 2>&1; do attempt=$((attempt+1)); [ "$attempt" -lt 20 ] || exit 1; sleep 1; done
r INFO server | sed -n '/^redis_version:/p'
guard='demo:{42}:generation'
value='demo:{42}:value'
read_script=$(cat <<'LUA'
local generation = redis.call('GET', KEYS[1])
if not generation then
  generation = ARGV[1]
  redis.call('SET', KEYS[1], generation)
  redis.call('DEL', KEYS[2])
end
return {generation, redis.call('GET', KEYS[2]) or false}
LUA
)
fill_script=$(cat <<'LUA'
if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[2], ARGV[2], 'EX', ARGV[3])
return 1
LUA
)
invalidate_script=$(cat <<'LUA'
redis.call('SET', KEYS[1], ARGV[1])
return redis.call('DEL', KEYS[2])
LUA
)
printf '\n1. Plain deletion cannot stop a held old value being filled later:\n'
source_price=12
held_price="$source_price"
source_price=15
assert_reply 0 DEL "$value"
assert_reply OK SET "$value" "$held_price" EX 60
assert_reply 12 GET "$value"
printf 'Source=%s; late fill saved=%s\n' "$source_price" "$(r GET "$value")"
printf '\n2. Initialise a unique generation and discard the orphaned value:\n'
reply=$(j EVAL "$read_script" 2 "$guard" "$value" g-a)
[ "$reply" = '["g-a",null]' ]
printf '%s\n' "$reply"
# The reader captures g-a BEFORE its simulated authoritative source read.
captured=g-a
source_price=12
held_price="$source_price"
source_price=15
assert_reply 0 EVAL "$invalidate_script" 2 "$guard" "$value" g-b
assert_reply 0 EVAL "$fill_script" 2 "$guard" "$value" "$captured" "$held_price" 60
assert_reply 0 EXISTS "$value"
printf 'Invalidation rotated to g-b. Fill carrying g-a was rejected.\n'
printf '\n3. A new reader captures g-b, then reads the current source:\n'
reply=$(j EVAL "$read_script" 2 "$guard" "$value" unused-initialiser)
[ "$reply" = '["g-b",null]' ]
captured=g-b
held_price="$source_price"
assert_reply 1 EVAL "$fill_script" 2 "$guard" "$value" "$captured" "$held_price" 60
assert_reply 15 GET "$value"
reply=$(j EVAL "$read_script" 2 "$guard" "$value" unused-initialiser)
[ "$reply" = '["g-b","15"]' ]
printf '%s\n' "$reply"
printf '\n4. Loss of the guard must not turn into permission to fill:\n'
assert_reply 1 DEL "$guard"
assert_reply 0 EVAL "$fill_script" 2 "$guard" "$value" g-b 12 60
reply=$(j EVAL "$read_script" 2 "$guard" "$value" g-c)
[ "$reply" = '["g-c",null]' ]
assert_reply 0 EVAL "$fill_script" 2 "$guard" "$value" g-b 12 60
assert_reply 1 EVAL "$fill_script" 2 "$guard" "$value" g-c 15 60
printf 'Missing guard rejected fill; new g-c discarded the survivor and rejected g-b.\n'
printf '\n5. A repeated invalidation uses another NEW token, never an old one:\n'
assert_reply 1 EVAL "$invalidate_script" 2 "$guard" "$value" g-d
assert_reply 0 EVAL "$invalidate_script" 2 "$guard" "$value" g-e
assert_reply 0 EVAL "$fill_script" 2 "$guard" "$value" g-d 12 60
assert_reply -1 TTL "$guard"
printf 'Current token g-e; delayed g-d fill rejected. Guard has no value TTL.\n'
printf '\nAll assertions passed. No database, failover or delivery guarantee is tested.\n'
printf 'Production tokens must never repeat, including retries; these literals are lab-only.\n'
