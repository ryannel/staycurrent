# Redis memory and performance lab

Companion to https://staycurrent.dev/learn/databases/caching/memory-and-performance/.
Requires macOS/Linux, Node 24+, npm and Redis 8.2.2. Pins node-redis 6.3.0 and its
dependencies. The runner starts a private Unix-socket server with no TCP port or
persistence, then stops it and removes its temporary directory. It never connects
to an existing Redis service.

```sh
npm ci --ignore-scripts --no-audit --no-fund
REDIS_SERVER=/absolute/path/to/redis-8.2.2/src/redis-server node run.mjs
```

If the pinned binary is on PATH, omit REDIS_SERVER. To build it, obtain the official
8.2.2 source from https://github.com/redis/redis/releases/tag/8.2.2 and run:

```sh
make -j4 BUILD_WITH_MODULES=no BUILD_TLS=no MALLOC=libc redis-server redis-cli
```

A compiler and make are required. These settings are for a private local lab, not
production configuration guidance. Verified on macOS arm64 with Node 24.16.0 and
libc. Other allocators and platforms can report different byte counts.

The worksheet:

- Compares value bytes with MEMORY USAGE and OBJECT ENCODING for four strings.
- Keeps a value constant while changing key-name length.
- Confirms hash encoding thresholds, then crosses the 512-field limit.
- Shows HSCAN COUNT 1 returning all 512 compact fields.
- Continues SCAN through empty matching batches until the returned cursor is 0.
- Retrieves one field with HGET and all fields with HGETALL, recording SLOWLOG
  entries. The log threshold is lowered only on this disposable instance.
- Verifies that UNLINK makes the key absent, without inferring when physical
  memory is returned to the operating system.
- Reports selected INFO memory fields, which must not all be added together.

The assertions validate mechanisms and results, not universal byte constants.
The article's measured hash example was 7,200 bytes for 512 fields and 37,008 for
513 fields on the stated build. SLOWLOG timings and scan batch counts vary. This
small run is not a throughput or latency benchmark. It does not run a background
snapshot or claim to measure copy-on-write pressure; the article labels that
illustration as an operating-system page model.
