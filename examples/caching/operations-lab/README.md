# Operating Redis caches: isolated lab

This lab starts one owned Redis 8.2.2 process and uses node-redis 6.3.0 to test
permissions, credential/session changes, counter windows and slow-log retention.
It has no TCP listener. All keys, credentials, connections and files are temporary.
No existing Redis service is contacted.

## Run

Install Node 24+ and an official Redis 8.2.2 server binary. From this directory:

```sh
npm ci
REDIS_SERVER=/absolute/path/to/redis-server npm test
```

If that exact server is on PATH, `npm test` is enough. The runner refuses another
Redis version. It uses a private Unix socket under a temporary directory, disables
persistence, and cleans up its process and files on normal completion, assertion
failure and handled interruption. A host failure or uncatchable SIGKILL cannot run
cleanup. The client exercise has a 30-second limit. No Docker or privileged port.

## What is checked

- A fresh `cache-app` ACL permits GET/SET/DEL/PING and CLIENT SETINFO, with keys
  restricted to `cache:catalog:*`. GET/SET work; orders-prefix GET, CONFIG,
  FLUSHALL and SLOWLOG are denied. The rejected flush does not erase the value.
- ACL LOG includes key and command denials. ACL DRYRUN permits a SET without
  executing it. RESP3 returns ACL log entries as maps.
- Setting this user off blocks new authentication but leaves its existing
  authenticated connection working.
- Adding a second random password permits an overlap. Removing the old password
  blocks fresh login with it, while the old session still works. Explicit
  CLIENT KILL USER closes only the two lab-owned app sessions. The new password
  then reconnects successfully. Secrets are generated in memory and not printed.
- Two GET hits and one miss produce corresponding INFO counter deltas. A test-only
  CONFIG RESETSTAT returns both counters to zero without changing server run_id.
- With test-only slow-log threshold zero and length eight, twelve GETs leave eight
  entries, including GET and execution microseconds. No timing claim is made.

The default administrative connection exists only on the private owned Unix
socket to set up and inspect the experiment. This is **not** a production security
configuration. Deployments must establish their own network boundary, authenticated
identities, persisted policies, secret distribution and verified TLS where needed.
The lab uses no TLS and does not test a managed provider's identity integration.
Disabling reconnect is intentional so session revocation and fresh authentication
are distinct observations. A production policy must account for reconnect storms,
local-cache clearing and fallback capacity.

## Investigation exercise

Before reading the assertions in client.mjs, predict these outcomes:

1. Can the application GET an orders key if GET itself is permitted? Can the
   catalogue key pattern constrain FLUSHALL? What independent gate rejects each?
2. After the old password is removed, what happens on the old open connection,
   versus a fresh connection using the old password? Which action closes sessions?
3. Are decreasing hit/miss counters proof of a Redis restart? Which observation
   in this experiment disproves that inference?
4. Does a 1 ms slow-log execution explain a 100 ms client call? Name the evidence
   needed to separate server waiting from client or network delay.

The source includes the answers as executable assertions except for question4,
which deliberately requires application/network/server evidence outside this lab.
Do not copy its zero slow-log threshold or statistics reset into production to
measure a window. Use bounded diagnostics and counter deltas instead.
