#!/bin/bash
# B2 test: the ACL sequence the article gives, on fresh Redis 8.10.3 servers.
set -u
BIN=/opt/homebrew/opt/redis/bin
T=$(mktemp -d "$1/aclrun.XXXX")
cli() { local port=$1; shift; "$BIN/redis-cli" -p "$port" --no-auth-warning "$@" 2>&1 | tr '\n' ' '; echo; }
say() { echo "$*"; }
# --- exactly as in the article ---
mkdir -p "$T/n7111" "$T/n7181" "$T/s7182" "$T/s7183"
cat > "$T/users.acl" <<'ACL'
user admin on >admin-password ~* &* +@all
user replica on >replica-password +psync +replconf +ping
user sentinel on >sentinel-password &__sentinel__:hello +multi +slaveof +ping +exec +subscribe +config|rewrite +role +publish +info +client|setname +client|kill +script|kill
user shop on >shop-password ~app:* +@read +@write +@connection +@transaction +@scripting -@dangerous
user metrics on >metrics-password +info +ping +client|setinfo +slowlog|get +slowlog|len +latency|latest +latency|history
user default off
ACL
for p in 7111 7181; do
  cp "$T/users.acl" "$T/n$p/users.acl"   # the same file deployed to each node
  cat > "$T/n$p/redis.conf" <<CONF
port $p
dir $T/n$p
save ""
appendonly no
aclfile $T/n$p/users.acl
masteruser replica
masterauth replica-password
CONF
done
echo "replicaof 127.0.0.1 7111" >> "$T/n7181/redis.conf"
say "== users.acl (deployed to both nodes)"; cat "$T/users.acl"
say "== redis.conf on 7181"; cat "$T/n7181/redis.conf"
"$BIN/redis-server" "$T/n7111/redis.conf" --daemonize yes --logfile "$T/n7111/log"
"$BIN/redis-server" "$T/n7181/redis.conf" --daemonize yes --logfile "$T/n7181/log"
sleep 1.5
A="--user admin --pass admin-password"; S="--user shop --pass shop-password"; M="--user metrics --pass metrics-password"
say "== version"; cli 7111 $A INFO server | grep -o 'redis_version:[0-9.]*'
say "== no credentials on the primary"
say "PING => $(cli 7111 PING)"; say "GET app:1 => $(cli 7111 GET app:1)"
say "AUTH default (no password) => $(cli 7111 AUTH default x)"
say "== admin still administers"
say "ACL WHOAMI => $(cli 7111 $A ACL WHOAMI)"
say "ACL LIST => $(cli 7111 $A ACL LIST)"
say "CONFIG SET maxmemory 100mb => $(cli 7111 $A CONFIG SET maxmemory 100mb)"
say "CONFIG GET maxmemory => $(cli 7111 $A CONFIG GET maxmemory)"
say "INFO keyspace => $(cli 7111 $A INFO keyspace)"
say "== shop on the primary"
say "HELLO 3 AUTH shop => $(cli 7111 HELLO 3 AUTH shop shop-password | cut -c1-60)"
say "SET app:1 v EX 300 => $(cli 7111 $S SET app:1 v EX 300)"
say "GET app:1 => $(cli 7111 $S GET app:1)"
say "CLIENT SETINFO lib-name x => $(cli 7111 $S CLIENT SETINFO lib-name x)"
say "EVAL on app:1 => $(cli 7111 $S EVAL "return redis.call('GET', KEYS[1])" 1 app:1)"
say "SET other:secret x (as admin) => $(cli 7111 $A SET other:secret x)"
say "SET other:1 => $(cli 7111 $S SET other:1 x)"
say "FLUSHALL => $(cli 7111 $S FLUSHALL)"
say "CONFIG GET maxmemory => $(cli 7111 $S CONFIG GET maxmemory)"
say "ACL SETUSER shop +@all => $(cli 7111 $S ACL SETUSER shop +@all)"
say "SCAN 0 => $(cli 7111 $S SCAN 0)"
say "RANDOMKEY (repeated 5x) => $(for i in 1 2 3 4 5; do cli 7111 $S RANDOMKEY; done | tr '\n' ' ')"
say "TYPE other:secret => $(cli 7111 $S TYPE other:secret)"
say "== metrics on the primary"
say "CLIENT SETINFO lib-name x => $(cli 7111 $M CLIENT SETINFO lib-name x)"
say "INFO memory (first field) => $(cli 7111 $M INFO memory | cut -c1-60)"
say "SLOWLOG GET 1 => $(cli 7111 $M SLOWLOG GET 1 | cut -c1-40)"
say "GET app:1 => $(cli 7111 $M GET app:1)"
say "== categories (M3)"
say "ping in @connection: $(cli 7111 $A ACL CAT connection | tr ' ' '\n' | grep -cx ping); in @transaction: $(cli 7111 $A ACL CAT transaction | tr ' ' '\n' | grep -cx ping)"
say "@transaction => $(cli 7111 $A ACL CAT transaction)"
say "== replica 7181, authenticating as 'replica' with masteruser/masterauth"
for i in $(seq 1 20); do cli 7181 $A INFO replication | grep -q 'master_link_status:up' && break; sleep 0.5; done
say "(link waited ${i} x 0.5 s)"
say "master_link_status => $(cli 7181 $A INFO replication | grep -o 'master_link_status:[a-z]*')"
say "shop GET app:1 on the replica => $(cli 7181 $S GET app:1)"
say "no credentials on the replica: PING => $(cli 7181 PING)"
say "== Sentinel 7182 with auth-user/auth-pass"
cat > "$T/s7182/sentinel.conf" <<CONF
port 7182
dir $T/s7182
sentinel monitor shop 127.0.0.1 7111 1
sentinel auth-user shop sentinel
sentinel auth-pass shop sentinel-password
sentinel down-after-milliseconds shop 2000
sentinel failover-timeout shop 10000
CONF
cat > "$T/s7183/sentinel.conf" <<CONF
port 7183
dir $T/s7183
sentinel monitor shop 127.0.0.1 7111 2
sentinel down-after-milliseconds shop 2000
CONF
say "(7183 has no auth-user, quorum 2 so it cannot start a failover alone)"
"$BIN/redis-sentinel" "$T/s7182/sentinel.conf" --daemonize yes --logfile "$T/s7182/log"
"$BIN/redis-sentinel" "$T/s7183/sentinel.conf" --daemonize yes --logfile "$T/s7183/log"
sleep 5
flags() { "$BIN/redis-cli" -p "$1" SENTINEL MASTER shop | awk 'p{print;exit} /^flags$/{p=1}'; }
slaves() { "$BIN/redis-cli" -p "$1" SENTINEL MASTER shop | awk 'p{print;exit} /^num-slaves$/{p=1}'; }
say "7182 (with auth-user): flags=$(flags 7182) num-slaves=$(slaves 7182)"
say "7183 (without auth-user): flags=$(flags 7183) num-slaves=$(slaves 7183)"
say "7183 log: $(grep -m2 -i -E 'noauth|auth|sdown' $T/s7183/log | tr '\n' '|')"
say "== failover through Sentinel 7182"
say "SENTINEL FAILOVER shop => $(cli 7182 SENTINEL FAILOVER shop)"
for i in $(seq 1 40); do cli 7111 $A ROLE | grep -q '^slave' && break; sleep 0.5; done
say "(waited ${i} x 0.5 s for 7111 to become a replica)"
say "7182 sentinel log: $(grep -E 'failover|slave|switch|convert' $T/s7182/log | cut -c30- | tr '\n' '|')"
say "7111 ACL LOG => $(cli 7111 $A ACL LOG | cut -c1-400)"
for i in $(seq 1 20); do cli 7111 $A INFO replication | grep -q 'master_link_status:up' && break; sleep 0.5; done
say "7181 role => $(cli 7181 $A ROLE | cut -c1-40)"
say "7111 role => $(cli 7111 $A ROLE | cut -c1-60)"
say "7111 (old primary, now replica) master_link_status => $(cli 7111 $A INFO replication | grep -o 'master_link_status:[a-z]*')"
say "shop SET app:2 on promoted 7181 => $(cli 7181 $S SET app:2 v)"
say "shop GET app:2 on 7111 => $(sleep 1; cli 7111 $S GET app:2)"
say "== restart 7111 from its files: the users survive"
cli 7111 $A SHUTDOWN NOSAVE >/dev/null; sleep 1
"$BIN/redis-server" "$T/n7111/redis.conf" --daemonize yes --logfile "$T/n7111/log"; sleep 1.5
say "after restart, no credentials: PING => $(cli 7111 PING)"
say "after restart, admin ACL LIST => $(cli 7111 $A ACL LIST | cut -c1-80) ..."
say "after restart, shop GET app:1 => $(cli 7111 $S GET app:1)"
say "== changing a user later: ACL SETUSER then ACL SAVE, on each node"
say "admin ACL SETUSER shop >new-shop-password on 7181 => $(cli 7181 $A ACL SETUSER shop '>new-shop-password')"
say "admin ACL SAVE on 7181 => $(cli 7181 $A ACL SAVE)"
say "7181 users.acl now: $(grep '^user shop' $T/n7181/users.acl | cut -c1-40)... ($(grep -c '^user' $T/n7181/users.acl) users, passwords stored as #sha256)"
say "the same password on 7111, not changed there => $(cli 7111 --user shop --pass new-shop-password PING)"
say "== shut down"
for p in 7182 7183; do cli $p SHUTDOWN >/dev/null 2>&1; done
for p in 7111 7181; do cli $p $A SHUTDOWN NOSAVE >/dev/null; done
sleep 1
rm -rf "$T"
say "data deleted: $( [ -d "$T" ] && echo no || echo yes )"
