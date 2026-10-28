# Technical review, round 1: Operating a cache: monitoring, capacity and failure

Reviewer: independent technical reviewer, 28 October 2026. Source: `src/articles/caching/operating-a-cache.astro`, figures in `src/components/caching/operating-a-cache/`. My commands and output are in `docs/article-work/caching-2026-10-27/evidence/operating-a-cache-review-1.txt` (sections R1 to R7 are runs, S is the source checks). All runs used Redis 8.10.3 (Homebrew, macOS, libc malloc) on port 7167. The server and the dev server have been stopped and the data deleted.

## Verdict

The article is accurate on most points and its central teaching holds up. The capacity arithmetic, the SRE and Bronson attributions, the outage and warm-up models, the FLUSHALL behaviour, the hit and miss counting, the ElastiCache figures and the licence table all check out. Four things must change before publication:

- one statement about what `maxmemory` covers is wrong, and following it can empty the cache;
- the recommended ACL would break ordinary clients and the patterns earlier articles teach;
- a fragmentation figure measured with libc malloc is presented as general;
- a security claim is out of date for Redis 7.0 and later.

**Counts: 4 required, 13 suggested.**

## Required

### R1. Client output buffers are counted against `maxmemory`, not outside it

The article says (section "How big it should be"): "Outside it are fragmentation …; the output buffers of connected clients; the buffers that feed replicas and the append-only file…"

**Evidence.**

- **Source.** `freeMemoryGetNotCountedMemory` in `src/evict.c` at 8.10.3 leaves only three things out of the `maxmemory` accounting: replica buffers beyond the backlog, the atomic-slot-migration client's output, and the AOF buffer. The buffers of ordinary clients are counted.
- **Run (R7).** With `maxmemory 30mb` and `allkeys-lru`, I loaded 10,000 cached products of 2,000 bytes each. A single client then pipelined 20,000 `GET`s and did not read the replies. `mem_clients_normal` rose to 25 MB, Redis evicted 7,598 keys, and the key count fell from 10,001 to 2,404.
- **Defaults.** The default `client-output-buffer-limit normal 0 0 0` places no limit on a normal client's buffers.

**Why it matters.** A reader who believes this sizes the node correctly but never suspects a slow consumer, a large `MGET` or `KEYS`, or a big pipeline when the cache suddenly loses most of its keys.

**Correction.**

- Move client buffers out of the "outside" list. Say that normal clients' query and output buffers count towards `maxmemory`, so a slow or greedy client makes Redis evict cached data.
- Add `mem_clients_normal` to the Memory row of the alert table, or as its own row. Mention `client-output-buffer-limit normal` as the guard against it.
- The replica and AOF part of the sentence is correct and can stay.

### R2. The "twice the data" fragmentation figure is a libc-malloc measurement presented as general

The article says fragmentation "which How Redis works showed can reach twice the data after mass deletions".

**Evidence.** In `how-redis-works.astro` (lines 238 to 240), that ratio comes from the author's macOS laptop ("after a mass delete it ran to twice `used_memory` here"). The same article then warns: "do not read the table above as typical of production". It explains that the libc allocator kept the freed pages and ignored `MEMORY PURGE`, while jemalloc returns empty pages gradually. The brief forbids presenting this build's fragmentation figures as typical of Linux.

**Correction.** Remove the number, or qualify it. For example: "which can be large after mass deletions, and on my laptop's libc build reached twice `used_memory`; Linux builds with jemalloc return freed pages gradually, so measure your own `mem_fragmentation_ratio` and `allocator_frag_ratio` after a large delete."

### R3. The recommended application ACL breaks ordinary clients and earlier articles' patterns

The article recommends `ACL SETUSER shop on >… ~app:* +@read +@write -@dangerous`.

**Evidence (R3, R3b).** With exactly this user, the following were all refused with `NOPERM`:

- `PING`, `SELECT 0`, `CLIENT SETNAME` and `CLIENT SETINFO`;
- `MULTI` and `WATCH`;
- `EVAL` and `FCALL`;
- `CLUSTER SLOTS`.

`HELLO 3 AUTH` succeeded. The reasons are the command categories:

- `PING`, `SELECT` and `HELLO` are `@connection`;
- `MULTI`, `EXEC` and `WATCH` are `@transaction`;
- `EVAL` and `FCALL` are `@scripting`.

None of these is in `@read` or `@write`.

**Why it matters.** Many connection pools validate connections with `PING`, which this user cannot run. Most client libraries send `CLIENT SETINFO` on connect; it is usually tolerated, but it is logged in `ACL LOG`. Earlier articles teach transactions, `WATCH` and Lua or functions (Redis clients, invalidation, stampede locks), and all of them would fail in production after a reader applies this ACL. A cluster client cannot fetch the slot map.

**Correction.**

- Give a working baseline, for example `~app:* +@read +@write +@connection +@transaction -@dangerous`, adding `+@scripting` if scripts or functions are used. Re-test: with `+@connection +@transaction`, `PING` and `MULTI` succeed.
- Say that cluster clients also need `+cluster|slots` or `+cluster|shards`.
- Tell the reader to test the ACL with their actual client library and to read `ACL LOG` after deploying.
- Also tighten the metrics user (see S13).

### R4. "`CONFIG SET` can make Redis write files where an attacker chooses" is out of date for Redis 7.0+

**Evidence.**

- **Run (R2).** On 8.10.3, `CONFIG SET dir /tmp` and `CONFIG SET dbfilename x.rdb` both failed with "can't set protected config".
- **Source.** The `redis.conf` shipped with 8.10.3 sets `enable-protected-configs no` and explains that `dir` and `dbfilename` "are protected by making them immutable". The protection arrived in 7.0.
- **The documentation.** The redis.io security page still describes the old behaviour, so the article repeats an outdated passage from it.

**Correction.**

- Name the version. For example: "before Redis 7.0, `CONFIG SET` could point snapshots at any directory, a well-known route to taking over the host; 7.0 made `dir` and `dbfilename` immutable at run time unless `enable-protected-configs` is changed, so check that setting is still `no`."
- The point that a reachable Redis can be read and emptied stands.

## Suggested

### S1. Items the writer left unverified

All of them check out, with small additions.

- **Fowler and Nygard.** Fowler's bliki says Nygard "popularized" the pattern in *Release It!* and describes the closed, open and half-open states with a trial call. The article's wording is fine.
- **PostgreSQL `statement_timeout`.** It does abort any statement that runs longer than the set time, timed from the statement's arrival at the server. Add that it is **0, disabled, by default**, so the reader knows it must be set, for example on the application's database role. Optionally, mention `client_connection_check_interval` (PostgreSQL 14+), which lets the server notice a disconnected client. Say also that the timeout applies to every statement from that role, so it should sit just above the request deadline.
- **Pool waits.** The claim is right and, if anything, mild:
  - HikariCP's `connectionTimeout` defaults to 30 s;
  - SQLAlchemy's `QueuePool` timeout defaults to 30 s;
  - node-postgres `connectionTimeoutMillis` defaults to 0, which means wait forever.

  See S2 for the consequence.
- **ElastiCache `volatile-lru`.** Confirmed as "Default: volatile-lru" in the parameter-group tables. Say "in its default parameter groups", since a custom group can change it.

### S2. "A wait of a few milliseconds" is not always configurable, and the two sizing rules need reconciling

HikariCP rejects a `connectionTimeout` below 250 ms, according to its README. Where the pool cannot refuse quickly, a semaphore or bulkhead in front of it does the job. Mention that.

Separately, the Little's-law limit of 60 counts queries waiting *and* running. The next paragraph sizes the pool "close to the database's useful concurrency", which is usually far below 60, and allows a wait of a few ms. That admits only a handful of queued queries and refuses more than necessary under bursty arrivals. Say how the two fit together:

- the pool size bounds the queries running;
- the wait for a free connection bounds the queue;
- choose the wait so that wait plus query time stays inside the request's deadline (here 0.2 s).

### S3. The instance-replacement procedure is missing a step and has an ordering problem

The Redis administration guide says to "Allow writes to the replica using CONFIG SET slave-read-only no" *before* pointing clients at it. Only then, once the old master receives no queries, does it run `REPLICAOF NO ONE`.

The article says "point the application at the new one and promote it". In that order, a cache-aside application's `SET` on a miss gets `READONLY` errors until the promotion. Add the step, or promote first and then switch.

### S4. `CLIENT PAUSE` rehearses a hung process, not an unreachable host

Run R5 showed:

- during `CLIENT PAUSE 3000 ALL`, a new TCP connection was established in 0.3 ms;
- a `GET` with a 50 ms timeout failed after 52 ms;
- a `GET` with no timeout replied after 2,982 ms;
- a connection to a closed port was refused in 0.66 ms.

These confirm the article's numbers. However, "a frozen virtual machine" or a network partition does not complete the TCP handshake, so the *connect* timeout is what fires there, and `CLIENT PAUSE` never exercises it. Likewise, "With Redis stopped … the operating system refuses the connection at once" holds only when the host is alive. Add a sentence saying that a dead host or a dropped network looks like a hang at connect time. Mention that a firewall rule that drops packets is the drill for that case.

### S5. Say in the prose that the 2,130 bytes per key was measured with libc malloc

The Figure 5 caption is correct and already says so. The prose ("I wrote 20,000 keys…") does not.

My re-run (R6) gave 2,146 bytes per key with a TTL and 2,121 without, for 2,000-byte values and 14-byte keys. Much of that is the allocator's rounding, which both macOS (512-byte quantum above about 1 KB) and jemalloc (size class 2,048) apply to the roughly 2,006-byte value buffer. That is an inference: I could not run jemalloc here. The total should therefore be close on Linux.

Small values differ more: 400-byte values cost 546 bytes per key here. A clause saying "on my laptop's allocator; jemalloc rounds differently, so measure on your production build" would do.

### S6. FLUSHALL: the claims are confirmed; give the bystander's cost as a number

Source:

- `flushCommandCommon` in `src/db.c` at 8.10.3 runs a SYNC flush as "blocking ASYNC" unless the client is in MULTI, a script or a module (`CLIENT_AVOID_BLOCKING_ASYNC_FLUSH`);
- the path is present in 7.4.0 and absent from 7.2.0;
- Valkey 9.0.0 has no such path, but its `lazyfree-lazy-user-flush` defaults to yes (from 8.0.0).

Run (R4), with 500,000 keys of 100 bytes and another client sending `PING` every millisecond:

| Command | Caller's reply after | Worst `PING` from the other client |
| --- | --- | --- |
| Plain `FLUSHALL` | 139 to 176 ms | 6 to 24 ms |
| `MULTI`/`EXEC` | 130 to 137 ms | 128 to 136 ms |
| `EVAL` | 128 to 130 ms | 128 ms |
| `FLUSHALL ASYNC` | 0.3 ms | under 1.1 ms |

"Barely noticed" is fair, but "the other client's worst reply was 6 to 24 ms, against the full duration inside MULTI" is more useful. Also name scripts as well as transactions, since `EVAL` blocked everyone too.

### S7. "A restart looks the same" assumes no persistence

A restart that loads an RDB or AOF file comes back with keys. Its `uptime_in_seconds` and counters reset, but the key count does not collapse. Say "a restart without persistence".

### S8. Clarify "on it you cannot use anything added in Redis 7.4 or later"

ElastiCache's Valkey 9.x does provide some equivalents, for example hash-field expiry, which reached Valkey in 9.0. The article's own bullet says so, so the sentence reads as stronger than intended. Suggested wording: "…you cannot run Redis 7.4 or later itself; features added there are available only where Valkey has its own version of them."

### S9. `expired_time_cap_reached_count`: say what it means before "expect latency spikes"

The counter rises when the slow active-expiry cycle stops at its time budget. At the default `hz 10` that budget is about 25 ms in every 100 ms. Two consequences follow:

- the main thread spends up to that time on expiry, which is where the latency comes from;
- expired keys linger in memory, which leads to more eviction and stale memory use.

One clause saying this makes the alert actionable.

### S10. Redis versus Valkey licences: the table is accurate

The Redis README states, word for word:

- "7.2.x and prior": BSDv3;
- "7.4.x to 7.8.x": RSALv2 or SSPLv1;
- "8.0.x and subsequent": RSALv2, SSPLv1 or AGPLv3.

Valkey is BSD 3-clause and forked from 7.2.4. No change is needed. Optionally add "as stated in the Redis README" next to the table, since it is the primary source.

### S11. Valkey differences: verified

- **Compare-and-set commands.** `DELIFEQ` arrived in Valkey 9.0.0 (`commands.def`), and `SET … IFEQ` is in Valkey 8.1.0.
- **Features only in Redis.** `allkeys-lrm` and `volatile-lrm` are in Redis 8.6.0 `config.c` and not in 8.4.0. `HOTKEYS` has existed since 8.6.0.
- **Defaults.** Valkey's lazy-free defaults and its 10 MB backlog date from 8.0.0. Redis 8.10.3 has the lazy-free settings off and a 1 MB backlog (R1).

All correct.

### S12. Figure 4: note the allocator in the caption

The six-megabyte incident's "keys halve" depends on bytes per key, which libc and jemalloc round differently. The caption says "on a laptop"; add "macOS, libc malloc". The diagnosis that evictions point to size and expirations to TTLs does not depend on the allocator.

### S13. The metrics user can reset diagnostic data, and may be too narrow for common exporters

- `+latency +slowlog` also permits `SLOWLOG RESET` and `LATENCY RESET`; both succeeded in R3. Prefer `+slowlog|get +slowlog|len +latency|latest +latency|history`.
- Common exporters also call `CLIENT LIST` and `CONFIG GET`; both were refused. Say that the exporter's documented ACL should be checked.

### Minor

- **"Writes count nothing".** `SET … GET` counted a miss (R2).
- **Benchmark figures.** The 180,000 and 1.5 million figures come from different example runs in the documentation; the pipelined one was on a MacBook Air 11". "Examples", as written, is fair. Avoid letting them read as a ceiling.

## Models and figures

I read the model code and ran it with node; the writer's six tests pass. I checked Figure 2's headline numbers by hand:

- **Backlog.** The queue grows by 700 queries a second for 30 s, which is 21,000 queries, or 70 s of database work.
- **Recovery.** The backlog then drains at 300 − 100 = 200 a second, so it clears about 105 s after Redis returns, at about 145 s.
- **First second.** Requests are answered in time while 2.33t ≤ 1, which is 43% of the first second.

These agree with the prose (42%, 70 s, 144 s, about 40,000 wasted queries). Figure 1's arithmetic reproduces Bronson's example: 300 against 3,000 QPS at a 90% hit ratio.

In the browser, all five figures rendered at 1280 px with no console errors. Figure 2 behaved as described after six skips: 39,537 late queries without the limit, 0 with it. Figure 3's "read the old cache" option reached a 90% hit ratio with nothing refused.

Captions separate measurement from model clearly. Figure 2 says that a dead Redis is assumed to cost no time.
