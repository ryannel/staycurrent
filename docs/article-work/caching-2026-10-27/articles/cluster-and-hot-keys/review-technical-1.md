# Technical review 1: Redis Cluster, sharding and hot keys

Reviewer: independent technical reviewer, round 1, 28 October 2026.
Source reviewed: `src/articles/caching/cluster-and-hot-keys.astro`, the figure models in
`src/components/caching/cluster-and-hot-keys/`, and the rendered page at
`/learn/databases/caching/cluster-and-hot-keys/` (dev server on port 4470, all nine figures exercised with
Playwright, no console errors).

My own commands and output are in
`docs/article-work/caching-2026-10-27/evidence/cluster-and-hot-keys-review-1.txt` (sections R1–R15). I used
Redis 8.10.3 on a local cluster (ports 7161–7165) and a single server (7160), the Redis source at tag
8.10.3, the redis.io documentation sources, the Redis cluster specification, redis-py 8.1.0, and the
primary papers. All servers were stopped and their data deleted.

## Verdict

Most of the article is accurate, and much of it is observed rather than asserted. I reproduced these
claims myself:

- Every `CLUSTER KEYSLOT` value and every hash-tag edge case.
- The `CROSSSLOT`, `SELECT`, `MULTI`/`EXEC` and `EVAL` behaviour.
- `MOVED`, `ASK`, `ASKING` (which lasts for one command) and `TRYAGAIN`.
- The redis-py `mget` and `mget_nonatomic` behaviour.
- Atomic slot migration chosen by `redis-cli --cluster reshard`: it forks, uses the 1 MB handoff
  threshold, pauses writes, then trims in the background, or actively on the main thread when any
  client is tracking.
- The election delay formula and log line.
- The window of about a second in which the healthy shards refuse requests between `FAIL` and
  promotion.
- `CLUSTERDOWN` on the healthy shards when a primary with no replica fails, and
  `cluster-require-full-coverage no` restoring them.
- Every default quoted.
- The `--hotkeys` error.
- The `HOTKEYS` and `CLUSTER SLOT-STATS` syntax.
- Every tracking behaviour in the article: one invalidation per read; `EXPIRE`, `DEL` and expiry
  count as changes; `FLUSHALL` sends a null; table-limit evictions; `NOLOOP` forgetting the key;
  broadcast prefixes.

The Zipf arithmetic and the model numbers quoted in the prose match the code, and all 10 model
tests pass.

Five required findings need fixing before publication:

- Figure 1's ring model is wrong.
- The resharding table mixes measurement windows.
- Two statements would lead a reader to build something broken: `OPTIN` caching, and splitting a
  write-hot key under one hash tag.
- The library near-cache advice omits a version and server requirement that the brief requires.

Sixteen suggested findings follow.

---

## Required

### R1. Figure 1's consistent-hashing ring is badly unbalanced by its hash function, and the prose blames chance

**Claim.** "Choose 'a hash ring': with four servers, 30% of the keys change in this run. On average
the new server takes 1/(N + 1) of the circle, a fifth here, but how much it actually takes depends
on where its points happen to land." The caption says each server has 160 points.

**Evidence (R2).**

- `placement-model.mjs` places ring points with FNV-1a on near-identical strings
  (`server-0#0`, `server-0#1` and so on). FNV-1a has poor avalanche on such inputs, and the
  ring it builds is badly skewed:
  - With 3 servers, one server holds 59% of the keys.
  - With 8 servers, the shares range from 6% to 22%.
- With the same ring code, 160 points per server and MD5 positions, the share of keys that move is
  close to the ideal 1/(N + 1). The FNV-1a ring is not:

  | Change | FNV-1a ring (the figure) | MD5 ring | Ideal |
  | --- | --- | --- | --- |
  | 4 → 5 | 30% | 17% | 20% |
  | 2 → 3 | 24% | 31% | 33% |

- With 160 points the new server's share should be within a few percentage points of 1/(N + 1).
  Thirty per cent is an artefact of the hash, not of "where its points happen to land".

**Why it matters.** A practitioner learns two false things: that consistent hashing with many
virtual nodes is badly balanced, and that it moves half as many keys again as hash slots. The next
paragraph's "a fifth of the keys change server, as with the ring" then contradicts the 30% the
reader has just seen.

**Correction.**

1. Place ring points with a well-mixed hash. MD5 truncated to 32 bits, as ketama does, works, or
   FNV-1a followed by a finaliser such as murmur3's `fmix32`.
2. Re-derive the quoted number, and update the test that pins `ring` at 30%.
3. If you want to show variance, show it honestly: with few points per server the share varies
   widely; with 100–200 points it stays close to 1/(N + 1).

### R2. The resharding table compares different measurement windows and labels them "during the move"

**Claim.** The table "Moving 4,096 slots and 49,894 keys" reports:

| Row | Atomic slot migration | Key by key |
| --- | --- | --- |
| Reads during the move | 180,016 | 209,343 |
| Redirections | 60 `MOVED` | 328 `MOVED`, 2 `ASK` |
| 99th percentile read latency | 3.1 ms ("4.7 ms with no move") | 20.9 ms |

The text that follows says "the clients could not tell it from normal running".

**Evidence (R14, from the writer's own evidence file, lines 233–282).**

- **Atomic slot migration.** The load ran for 45 s at 4,000 reads a second, and the move took
  3.1 s. Reads during the move were therefore about 12,000. The figure of 180,016, and the p99 of
  3.052 ms, cover the whole 45 s run.
- **Key by key.**
  - The load ran for 60 s and "stopped 50 s into the 220 s migration".
  - The 209,343 reads, the p99 of 20.9 ms, and the 328 `MOVED` and 2 `ASK` replies therefore
    cover only the first 50 s of the move. The redirection counts come from node 7195 alone.
  - The client's rate also fell to 1,400–2,500 a second.
- **The two p99 figures.** The p99 with a move (3.1 ms) is below the p99 without one (4.7 ms).
  That shows the 99th percentile here is the noise floor of Python clients on a busy laptop. It is
  not a property of either method.

**Why it matters.** The rows read as like-for-like measurements of the two protocols, and they
are not. The brief requires measured numbers to state their conditions.

**Correction.** Either:

- re-run, with the load spanning the whole move in both cases, and report reads, errors,
  redirections and latency inside the move window only (per-second maxima are more telling than a
  run-wide p99); or
- keep the data, relabel the rows to say what they cover (for example "reads in a 45 s run
  including the 3 s move", and "first 50 s of a 220 s move, first source node only"), and drop the
  p99 row or explain that it is at the noise floor.

The robust results are worth keeping: every read was a hit, there were no client errors, and the
atomic move took about 3 s.

### R3. `OPTIN` is described in a way that would leave cached keys untracked

**Claim.** "`OPTIN` tracks only the reads that follow `CLIENT CACHING YES`."

**Evidence.**

- The client-side caching reference says: "The `CACHING` command affects the command executed
  immediately after it". The exceptions are a following `MULTI` block or script.
- Observed (R11): after `CLIENT CACHING YES`, `GET k` and then `GET j`, a write to `k` produced
  an invalidation and a write to `j` produced none.

**Why it matters.** A reader who sends `CLIENT CACHING YES` once and caches the reads that follow
caches keys Redis is not tracking. Those keys are never invalidated, which is unsafe.

**Correction.** "`OPTIN` tracks a read only when `CLIENT CACHING YES` is sent immediately before it
(or before the `MULTI` block or script that contains it). A client using it sends `CLIENT CACHING
YES` before each read whose result it means to cache."

### R4. Splitting a write-hot key under one hash tag relieves nothing

**Claim.** "Without a hash tag the parts spread across nodes; with one, a single `MGET` can read
them all, at the price of keeping them on one node."

**Why it is misleading.** Redis executes every command on one thread per node. Eight `INCR`s on
eight keys in one slot cost that node the same as eight `INCR`s on one key. With a hash tag the
split moves no load off the hot node at all. "At the price of keeping them on one node"
presents it as a trade-off when it defeats the remedy.

**Correction.** "Leave the parts untagged so they spread across nodes. Reading the total then
needs one request per node, which `mget_nonatomic` or a cluster pipeline does for you. A hash tag
would put every part back on the same node and its one thread, and relieve nothing."

### R5. The client-library near-cache advice omits the server version, protocol and server type they require

**Claim.** "Client libraries with a built-in near cache that uses tracking include redis-py from
5.1.0, Jedis from 5.2.0, node-redis from 5.1.0 and go-redis from 9.22.0". The library versions
are correct (R13).

**Evidence.**

- Redis's redis-py connection page says client-side caching "requires the RESP3 protocol" and "is
  supported by Redis v7.4 or later".
- redis-py 8.1.0, `redis/connection.py` lines 1634 and 1723–1729, enforces this. It raises
  `ConnectionError` unless the server's `HELLO` reply names it `redis` and its version is at least
  7.4.0. That excludes Redis older than 7.4, and any server reporting another name. Current Valkey
  releases report `valkey`, and so do managed services built on Valkey. I did not run Valkey, so
  confirm this against a Valkey server.

**Why it matters.** The brief requires client-side caching claims to name the version. A reader on
Redis 7.2, or on a Valkey-based managed cache, who follows this paragraph gets a connection
error. The article's "Redis 6.0 added..." also suggests that 6.0 is enough.

**Correction.** Add: "These built-in caches need a RESP3 connection, and the libraries support them
only on Redis 7.4 or later; redis-py refuses other servers, including Valkey. On older servers or
on Valkey, the commands above still work, but you build the near cache yourself or use another
library."

---

## Suggested

### S1. The specification "expects"; it does not "promise"

Section "When one server is not enough". The cluster specification (line 126 in R13) says "you can
expect the same performance as a single Redis instance multiplied by N". Use "says you can expect"
rather than "promises".

### S2. Clients discover the topology with `CLUSTER SLOTS` as often as `CLUSTER SHARDS`

The article says a client asks "for the slot map with `CLUSTER SHARDS`". The specification
prefers `CLUSTER SHARDS` (7.0+) and calls `CLUSTER SLOTS` deprecated. But redis-py 8.1.0, the
client the article measures with, calls `CLUSTER SLOTS` (`cluster.py` line 2689). Suggested
wording: "with `CLUSTER SHARDS` (Redis 7.0 and later) or the older `CLUSTER SLOTS`, which many
clients still use".

### S3. During a migration, `ASK` is also the reply for keys that never existed

Observed in R6: `GET {product:42}:nope`, a key in the migrating slot that had never been set,
got `ASK 12456 127.0.0.1:7161` from the source. For a cache this matters, because every miss in a
migrating slot costs the extra hop as well. Suggested wording: "For a key it does not have,
whether already sent across or never there, it replies `ASK`."

### S4. `MIGRATE` deletes after it confirms

"`MIGRATE`, which sends, deletes and confirms each key" has the order wrong. The specification
says it sends the serialised key and, "once an OK code is received", deletes it on the source.
Write "sends each key, waits for the new node to confirm it, then deletes its own copy".

### S5. `rebalance` ignores a new empty primary unless told otherwise

"Add a shard with `redis-cli --cluster reshard` or `rebalance`" needs a flag. In
`redis-cli.c` at 8.10.3, lines 8127–8141, rebalance gives an empty primary a weight of 0 unless
`--cluster-use-empty-masters` is given. Without that flag, the new shard receives nothing. Add the
flag to the advice.

### S6. Lowering `cluster-node-timeout` has costs beyond false alarms

"A few seconds is a common choice for a cache" has no source. Either cite one, or present it as
the author's judgement and name the costs:

- Any main-thread stall longer than the timeout triggers a failover. Examples are a large `DEL`,
  a slow script, or a fork on a large instance.
- The replica validity window shrinks with the timeout. The window is
  `node-timeout × cluster-replica-validity-factor` (default 10) plus the replication ping period,
  so a replica disconnected for longer than that refuses to fail over (`redis.conf` lines
  1822–1842).

### S7. Two failover differences from Sentinel that change operations

Consider one sentence on each:

- **Planned failover.** `CLUSTER FAILOVER`, sent to a replica, waits for it to catch up and then
  swaps roles without losing acknowledged writes. That is the right way to restart a primary.
- **Minority partitions.** A primary cut off from the majority of primaries stops accepting
  writes after the node timeout. `cluster-require-full-coverage no` does not keep a
  minority-side node serving.

Also, "the whole cluster stops when any slot has no owner" is loose. The condition is any slot
unassigned or owned by a node marked failed. The next section makes this clear, but the first
statement should match it.

### S8. `CLUSTER SLOT-STATS` and `HOTKEYS` are per node, and their configuration has practical limits

- **Per node.** Both commands report on one node, so run them on every primary. The `HOTKEYS` page
  says the redis-py and go-redis cluster clients do not support it, so connect to each node
  directly.
- **Turning the statistics on.** Since 8.6, `cluster-slot-stats-enabled` takes `cpu`, `net` and
  `mem` (and `yes` means all three).
  - `CONFIG SET cluster-slot-stats-enabled yes` fails at runtime with "memory tracking cannot be
    enabled at runtime".
  - `CONFIG SET cluster-slot-stats-enabled "cpu net"` succeeds (R10).
  - So the CPU and network statistics can be turned on during an incident without a restart. That
    is worth one clause.
- **Managed services.** The `CLUSTER SLOT-STATS` page marks it as not supported on Redis Software
  or Redis Cloud. Where a managed service lacks it, the "move busy slots" remedy loses its main
  tool.

### S9. Valkey differences that change decisions

I did not verify these myself; check them against valkey.io before using them. As I understand
it:

- Valkey 9.0 allows multiple databases in cluster mode and has its own atomic slot migration,
  under a different command.
- Valkey has had `CLUSTER SLOT-STATS` since 8.0.

If confirmed, the "One database" bullet and "the way slots moved before Redis 8.4" are true for
Redis but not for Valkey. A short note would keep Valkey and managed-Valkey readers from wrong
conclusions. Add it only if the collection's Valkey policy allows.

### S10. "In seconds" depends on how much data moves

The closing says "a shard can be added to the running cache in seconds without a single miss".
That was measured on about 25 MB of moved data. The snapshot is streamed, so the time scales with
the bytes moved. The vendor's run moved about 1.7 GB in 6.4 s. Say "in seconds for gigabytes of
data in Redis's own test", or similar.

### S11. Hot-key tools: the CPU outlier is unexplained

`product:4976` was charged 7,352 µs for 17 GETs, about 430 µs a call. Other GETs cost about
0.8 µs. "A few slow calls lift a rarely read key" is a guess. A 500-fold outlier on a `GET` of a
300-byte value is more likely mis-attribution, for example time from another command or the
`--hotkeys` scan landing on that key. Either investigate, or say the cause was not found. The
advice to prefer the bytes ranking stands either way.

### S12. The Facebook citation is a related idea, not the same one

Section 3.2.3 of Scaling Memcache replicates a whole category of keys across a pool when "the
entire data set fits in one or two memcached servers" and the application batches many keys per
request (R15). That is close to the "copies" remedy but not the same. Use "a related idea",
or describe it accurately.

### S13. Source or hedge "s is usually somewhere near 1"

Measured web and cache traces range roughly from 0.6 to above 1. Breslau et al. (1999) report
0.64–0.83 for proxy traces. Cite the source the introduction article uses, or say "often between
about 0.6 and 1.2". The figure's 0.8 / 1 / 1.2 choice already covers this range.

### S14. Detecting a silently dead invalidation connection

"A lost connection loses invalidations" covers connections the client knows have dropped. The
reference's second instruction is to ping the invalidation connection periodically, and to flush
the cache if the pings stop coming back. A half-open TCP connection otherwise looks healthy for
minutes. Add a clause.

### S15. Smaller points

- "Each node pings the others": each node pings a few random nodes a second, plus any it has not
  pinged within half the node timeout. This is harmless as written.
- An Astro `ArticleRef slug=""` for the introduction: check that it resolves to the collection's
  introduction once published.
- Observed but not in the article, and possibly worth a line for scale-in: a primary that gives
  away its last slot becomes a replica of the node that took it (R9; 7165 turned into a replica).

### S16. Full coverage is a per-node setting

"For a cache, turn full coverage off" and the closing bullet read as one cluster-wide switch.
`cluster-require-full-coverage` is a per-node setting: in `clusterUpdateState()` each node computes
its own cluster state from its own configuration. In R12 I set it on every surviving primary. I
did not test a node left on `yes`, but from the source that node would keep answering
`CLUSTERDOWN`. Say "set `cluster-require-full-coverage no` in every node's configuration file,
replicas included".

---

## Counts

Required: 5 (R1–R5). Suggested: 16 (S1–S16).
