# Redis transactions and Lua lab

Companion to https://staycurrent.dev/learn/databases/caching/atomicity/.
Requires macOS/Linux, Node 24+, npm and Redis 8.2.2. node-redis is pinned at 6.3.0
with a dependency lockfile. No Docker dependency and no connection to an existing
Redis service: run.mjs starts a temporary server with a private Unix socket, no TCP
port and no persistence, then stops it and removes its temporary files.

```sh
npm ci --ignore-scripts --no-audit --no-fund
REDIS_SERVER=/absolute/path/to/redis-8.2.2/src/redis-server node run.mjs
```

If the pinned redis-server is on PATH, omit REDIS_SERVER. To build Redis 8.2.2,
obtain its source from https://github.com/redis/redis/releases/tag/8.2.2 and run:

```sh
make -j4 BUILD_WITH_MODULES=no BUILD_TLS=no MALLOC=libc redis-server redis-cli
```

A compiler and make are required. These local build settings are not production
configuration advice. Tested on macOS with Node 24.16.0 and the official source.

The native assertions cover:

- Two workers deliberately read before either writes: one increment is lost.
- MULTI/EXEC around a precomputed SET does not repair that stale decision.
- WATCH rejects the stale transaction; a fresh observation and retry succeeds.
- INCR preserves both increments, whichever client executes first.
- Queue-time syntax failure aborts the queued transaction before writes.
- A transaction runtime error leaves earlier writes and executes later commands.
- An unhandled Lua runtime error leaves earlier writes but stops later lines.
- fill.lua rejects mismatched/missing generations and invalid TTLs; a matching
  generation stores a value and expiry together.
- EVALSHA reports NOSCRIPT after SCRIPT FLUSH; loading restores invocation.

SCRIPT FLUSH affects only the runner's disposable Redis process. The lab contains
no unbounded script or production endpoint. The 30-second process guard is a lab
cleanup mechanism, not cancellation semantics for production Redis commands.

fill.lua demonstrates a Redis-local guard, not a complete invalidation protocol.
The caller must bound payload size, maintain non-reused generations and deliver
invalidation. A source-database commit remains outside the script's atomicity.
