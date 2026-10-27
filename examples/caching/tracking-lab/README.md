# Redis client-side caching lab

Companion to https://staycurrent.dev/learn/databases/caching/client-side-caching/.
Requires Node24+, npm and a Redis8.2.2 server binary on macOS or Linux. Client is
pinned to node-redis6.3.0. Use an isolated development machine.

```sh
npm ci
REDIS_SERVER=/absolute/path/to/redis-8.2.2/src/redis-server node run.mjs
```

If that redis-server is on PATH, `node run.mjs` works. Obtain Redis from its
official release source or a trusted package manager. The article's arm64 macOS
build used the8.2.2 source and
`make BUILD_WITH_MODULES=no BUILD_TLS=no MALLOC=libc redis-server redis-cli`.

The runner creates a private temporary directory and Unix-socket Redis server,
with TCP disabled and persistence off. It never contacts an existing Redis. It
starts the assertions as a child process, with a30second guard, then stops its
own server and removes only its temporary directory. SIGINT/SIGTERM trigger
cleanup; host failure or SIGKILL of the runner cannot execute cleanup.

## Assertions

The reader uses RESP3 and BasicClientSideCache with ttl60000ms, maxEntries2 and
LRU. These deliberately small lab limits make results visible, not production
recommendations. A separate writer/control connection changes keys and reads
server statistics.

- Two identical GETs return12,12 but INFOcommandstats reports only one server
  GET; client statistics agree with one miss and one local hit.
- A writer's SET15 invalidates the local result; the next GET returns15.
- GET and STRLEN of the same key produce two cached command results. One write
  invalidates both, demonstrating that entry count is not distinct-key count.
- A cached missing GET is invalidated when the key is created.
- A third result leaves only two entries under the configured capacity limit.
- CLIENTKILL targets only this lab's reader ID on the private server. Detected
  connection loss clears the cache. After a write and explicit reconnect, GET
  returns21. This is not automatic-reconnect or silent-blackhole testing.
- A Redis key with a1000ms expiry invalidates a local copy whose own configured
  TTL is60000ms. The lab checks/forces Redis's expiry with a separate GET before
  waiting for the invalidation. It does not assert exact delivery latency.
- A raw RESP3 observer uses emitInvalidate and CLIENTTRACKING BCAST PREFIX card:
  to observe a matching unread key's invalidation. This is a protocol experiment,
  not a BCAST option on the integrated BasicClientSideCache configuration.

The client listens for error events and uses bounded observation waits. It does
not time or benchmark requests. The article's separate-connection pending-read
race, multi-process schedule, freshness deadlines and reuse/fan-out counts are
models; this lab does not claim to reproduce those schedules or their timing.
Do not treat Redis's allocation metrics as measurements of the client heap.
