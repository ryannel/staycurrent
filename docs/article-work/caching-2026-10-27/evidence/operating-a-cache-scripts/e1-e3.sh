#!/bin/bash
# E1–E3: defaults, ACLs. Run against the lab server on port 7111 only.
C="/opt/homebrew/opt/redis/bin/redis-cli -p 7111"
echo "## E1. Defaults that matter to an operator (no config file)"
for k in bind protected-mode maxmemory maxmemory-policy maxclients timeout tcp-keepalive enable-debug-command lazyfree-lazy-user-flush lazyfree-lazy-eviction repl-backlog-size maxmemory-clients client-output-buffer-limit latency-monitor-threshold slowlog-log-slower-than; do echo "\$ CONFIG GET $k"; $C CONFIG GET $k | tr '\n' ' '; echo; done
echo "\$ ACL LIST"; $C ACL LIST
echo
echo "## E2. ACL: an application user restricted to app:* keys and denied @dangerous"
echo "\$ ACL SETUSER shop on >… ~app:* +@read +@write -@dangerous"; $C ACL SETUSER shop on '>s3cret-long-random' '~app:*' +@read +@write -@dangerous
S="$C --user shop --pass s3cret-long-random --no-auth-warning"
for cmd in "SET app:product:42 hello" "GET app:product:42" "SET other:1 x" "FLUSHALL" "CONFIG GET maxmemory" "INFO memory" "DEL app:product:42"; do echo "[shop] \$ $cmd"; $S $cmd 2>&1 | head -3; done
echo "[shop] \$ KEYS app:*"; $S KEYS 'app:*'
echo "\$ ACL LOG 1"; $C ACL LOG 1
echo
echo "## E3. A key pattern does not restrict FLUSHALL: user with ~tenant1:* +@all"
$C SET tenant2:secret keep >/dev/null; echo "\$ DBSIZE"; $C DBSIZE
echo "\$ ACL SETUSER tenant1 on >… ~tenant1:* +@all"; $C ACL SETUSER tenant1 on '>t1-long-random' '~tenant1:*' +@all
T="$C --user tenant1 --pass t1-long-random --no-auth-warning"
echo "[tenant1] \$ GET tenant2:secret"; $T GET tenant2:secret
echo "[tenant1] \$ FLUSHALL"; $T FLUSHALL
echo "\$ DBSIZE"; $C DBSIZE
echo "\$ ACL SETUSER tenant1 -flushall -flushdb"; $C ACL SETUSER tenant1 -flushall -flushdb
echo "[tenant1] \$ FLUSHALL"; $T FLUSHALL
echo "--- a monitoring user that can read INFO but no keys"
echo "\$ ACL SETUSER metrics on >… resetkeys -@all +info +ping +latency +slowlog"; $C ACL SETUSER metrics on '>m-long-random' resetkeys -@all +info +ping +latency +slowlog
M="$C --user metrics --pass m-long-random --no-auth-warning"
echo "[metrics] \$ INFO stats | grep keyspace_hits"; $M INFO stats | grep keyspace_hits
echo "[metrics] \$ GET anything"; $M GET anything
echo "[metrics] \$ CONFIG GET maxmemory"; $M CONFIG GET maxmemory
echo "--- ACL CAT dangerous includes:"; $C ACL CAT dangerous | tr '\n' ' '; echo
$C ACL DELUSER shop tenant1 metrics
