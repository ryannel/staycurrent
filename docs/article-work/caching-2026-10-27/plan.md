# Collection plan: application caching with Redis

Route: `/learn/databases/caching/`, beside the other database and storage
reading. The field guide's "Caches and in-memory stores" section links to the
introduction once it is published.

## Shape of the collection

Twelve articles in a reading order. Articles 1–6 teach caching as a design
discipline, using Redis for every concrete example. Articles 7–10 open Redis
itself: how it executes commands and spends memory, how clients talk to it, how
it survives failures and how it scales out. Articles 11–12 bring both together
in operation and design. A reader who stops after article 6 can already design a
correct cache; the later articles make them able to run it and reason about it
under load and failure.

Each article owns the subjects listed under it. Another article may mention a
subject in one or two sentences and link to its owner, but must not teach it.
When a writer finds a gap or an overlap, they report it, and the orchestrator
updates this map.

| # | Slug | Title |
| --- | --- | --- |
| 1 | `` (introduction) | Application caching with Redis |
| 2 | `caching-patterns` | Caching patterns: cache-aside, read-through, write-through and write-behind |
| 3 | `keys-and-values` | Cache keys and cached values |
| 4 | `expiration-and-eviction` | Cache expiration and eviction |
| 5 | `invalidation` | Cache invalidation and consistency |
| 6 | `stampedes` | Cache stampedes and the thundering herd |
| 7 | `how-redis-works` | How Redis works: the event loop, data structures and memory |
| 8 | `clients-and-pipelining` | Redis clients: round trips, pipelining and atomic operations |
| 9 | `replication-and-persistence` | Redis replication, persistence and failover |
| 10 | `cluster-and-hot-keys` | Redis Cluster, sharding and hot keys |
| 11 | `operating-a-cache` | Operating a cache: monitoring, capacity and failure |
| 12 | `designing-a-cache` | Designing a cache: a worked example |

Titles may be refined by the writer if a more searchable or accurate title fits;
slugs are fixed once the article is published.

## Coverage map

### 1. Application caching with Redis (introduction)

- Why applications cache: repeated expensive work, latency, database load, cost.
- The cache-aside read path in its simplest form with Redis `GET` and `SET ... EX`.
  (Patterns compared in depth: article 2.)
- Hit, miss, hit ratio, miss ratio. Mean latency and backend load as functions of
  hit ratio, derived and simulated. Why the miss ratio, not the hit ratio, sets
  database load (95% → 99% hit ratio cuts database reads fivefold).
- Locality and skew: popularity follows a long-tailed distribution, so a cache
  holding a small fraction of items can serve most requests. Working set.
- The price of a cache: staleness, a new dependency, memory. Introduced here as
  questions; owned by articles 4, 5, 11.
- Where application caches sit among other caches (browser, CDN, database buffer
  pool), one short section, to place Redis; HTTP caching is out of scope.
- What Redis is in one section: an in-memory key-value server with data
  structures, run as a separate process the application talks to over the
  network. (Internals: article 7.)
- A map of the collection.

### 2. Caching patterns

- Cache-aside (lazy loading) in full: read path, write path choices (delete or
  update after writing the database), behaviour on cold start.
- Read-through and write-through: the cache (or a library in front of it) loads
  and writes the database; what changes for the application and for failure.
- Write-behind (write-back): acknowledging before the database write; durability
  and ordering risks; when it is justified (counters, buffering).
- Write-around and refresh-ahead, briefly as variations.
- How each pattern behaves when the cache or the database fails mid-write.
- Choosing a pattern from the workload's read/write ratio and staleness tolerance.
- Not here: race conditions between concurrent readers and writers (article 5),
  stampede protection (article 6).

### 3. Cache keys and cached values

- What to cache: granularity (rows, objects, query results, rendered fragments,
  computed aggregates); trade-off between reuse, invalidation fan-out and size.
- Key design: namespaces, identity, including every input that changes the
  answer (locale, user, permissions, query parameters), normalisation, length.
- Versioned keys and schema changes in cached values across deploys.
- Serialisation formats and compression; size and CPU trade-offs.
- Strings versus hashes for objects; partial reads and updates (`HGET`, `HSET`);
  hash-field expiry (Redis 7.4+) as an option.
- Negative caching (caching "not found") and its risks.
- Large values and big keys: why they hurt (network, blocking); keeping values
  small. (Execution cost mechanics: article 7.)
- Batched reads with `MGET` mentioned; round-trip cost owned by article 8.

### 4. Cache expiration and eviction

- TTL as a staleness bound; choosing a TTL from tolerance and change rate.
- How Redis expires keys: passive expiry on access and the active expiry cycle;
  memory held by expired-but-unreclaimed keys; `EXPIRE`, `TTL`, `PERSIST`,
  `SET ... EX/PX/KEEPTTL`. Replicas and expiry briefly (replication owned by 9).
- Expiry jitter to avoid synchronised expiry (stampede protection itself:
  article 6).
- Memory limits: `maxmemory`; what happens without eviction (`noeviction` errors).
- Eviction policies: `allkeys-lru`, `allkeys-lfu`, `volatile-*`, `allkeys-random`,
  `volatile-ttl`, `noeviction`; choosing one for a cache.
- How Redis approximates LRU by sampling, the eviction pool and
  `maxmemory-samples`; how approximated LFU uses a logarithmic counter with decay
  (`lfu-log-factor`, `lfu-decay-time`).
- Hit ratio as a function of cache size (miss-ratio curve); scan pollution and
  why LFU resists it.
- Observing expiry and eviction: `INFO stats` `expired_keys`, `evicted_keys`.

### 5. Cache invalidation and consistency

- What "consistent" can mean for a cache: bounded staleness, read-your-writes,
  eventual convergence.
- Delete versus update on write, and why delete is the common default.
- The classic races: a slow reader writing back a stale value after a writer's
  delete; two writers updating the cache out of order. Shown step by step.
- Remedies: short TTL as a safety net; versioned values with compare-and-set (the
  atomic mechanism itself is taught in article 8, used here); leases as in
  Facebook's memcache paper; delayed double delete and its limits.
- Invalidating from the database's change stream (change data capture,
  transactional outbox) rather than from application code.
- Dependency fan-out: one change affecting many cached results; tag or
  generation-based invalidation.
- Read-your-writes for the user who made a change.
- Invalidating near caches is owned by article 10.

### 6. Cache stampedes and the thundering herd

- What a stampede is: many concurrent misses for one key rebuilding it at once;
  simulated against database capacity.
- Synchronised expiry across many keys after a deploy or warm-up, and TTL jitter
  (jitter introduced in article 4; here its effect on load).
- Request coalescing in one process (single-flight).
- A rebuild lock across processes with `SET key value NX PX`, its waiting
  strategies, and lock expiry hazards (correctness limits of Redis locks noted,
  not a full distributed-locking treatment).
- Serving stale while revalidating: soft and hard expiry.
- Probabilistic early expiration (XFetch, Vattani, Chierichetti and Lowenstein,
  2015): derivation of the rule and a simulation.
- Cold-start stampedes after a cache flush or restart (operational response:
  article 11).
- Not here: steady load concentrated on one key or shard (article 10).

### 7. How Redis works

- One process, one main thread executing commands from an event loop; why that
  gives each command atomicity and why one slow command delays all clients.
- I/O threads (Redis 6+, reworked in 8): what they parallelise and what stays on
  the main thread.
- Command cost: time complexity in the documentation; `KEYS` versus `SCAN`;
  `DEL` versus `UNLINK` and lazy freeing.
- Data types relevant to caching and their encodings (listpack, intset, hashtable,
  skiplist) and memory overhead per key; measuring with `MEMORY USAGE`.
- Memory accounting: `used_memory`, RSS, fragmentation, and allocator notes.
- Latency sources: slow commands, big keys, fork for persistence, swapping;
  `SLOWLOG`, `LATENCY` monitor, `redis-cli --latency`.
- Not here: persistence semantics (article 9), client round trips (article 8).

### 8. Redis clients: round trips, pipelining and atomic operations

- The protocol (RESP) briefly; a request costs a network round trip plus
  execution; why round trips dominate small cache reads.
- Pipelining and multi-key commands (`MGET`, `MSET`); batching a page's cache reads.
- Connection pools and multiplexed connections; per-request timeouts; retries
  and their danger; client-side behaviour on server overload.
- Atomic operations: single commands, `MULTI`/`EXEC`, optimistic concurrency
  with `WATCH`, Lua scripts (`EVAL`, `EVALSHA`) and functions (`FCALL`, Redis 7+).
- A compare-and-set for versioned cache values as the worked example, used by
  article 5.
- Serialisation cost on the client (format choice owned by article 3).

### 9. Redis replication, persistence and failover

- Whether a cache needs persistence at all; restart cost of an empty cache.
- RDB snapshots (fork, copy-on-write) and the append-only file (fsync policies);
  what each loses in a crash.
- Asynchronous replication: replica offset, partial and full resynchronisation,
  replica reads and staleness, writes lost at failover; `WAIT` and its limits.
- Failover with Redis Sentinel: detection, quorum, promotion, client discovery.
- Managed services' failover behaviour as a brief note.

### 10. Redis Cluster, sharding and hot keys

- Why shard: memory and throughput beyond one server.
- Client-side sharding and consistent hashing briefly, as background.
- Redis Cluster: 16,384 hash slots, `CRC16(key) mod 16384`, hash tags, multi-key
  command restrictions, `MOVED` and `ASK` redirections, resharding and slot
  migration, cluster failover.
- Hot keys and hot shards: detection (`redis-cli --hotkeys` with LFU,
  monitoring), mitigation by key splitting, replica reads and near caches.
- Client-side caching (near cache): in-process caches in front of Redis, Redis
  server-assisted client-side caching with `CLIENT TRACKING` (default and
  broadcast modes), invalidation messages and their delivery limits.

### 11. Operating a cache: monitoring, capacity and failure

- The cache as a load-bearing dependency: what the database sees when the hit
  ratio drops or the cache disappears; capacity planning for the miss path.
- Graceful degradation: timeouts, circuit breakers, falling back, load shedding;
  metastable failure (a cold cache keeping the database overloaded) and recovery.
- Warming a cold cache and controlled restarts.
- Monitoring: hit ratio, latency percentiles, evictions, memory, connections,
  replication lag; the `INFO` fields and what alerts to set.
- Capacity planning: memory sizing from working set and value size, throughput,
  network bandwidth.
- Security essentials: no public exposure, ACL users, TLS, dangerous commands.
- Managed services and Valkey: operational differences that matter.

### 12. Designing a cache: a worked example

- One realistic application (for example a product catalogue and checkout)
  taken from requirements to a complete cache design, applying articles 1–11 as
  decisions: what to cache, pattern, keys, TTLs, invalidation, stampede
  protection, eviction policy and size, topology, failure plan, metrics.
- What not to cache and why (for example the price used to charge a customer).
- A playground simulation with the major knobs exposed, after the reader knows
  what each does.
- A design review checklist presented as questions with reasons.

## Reading order and links

Linear order 1–12. Each article opens assuming the previous ones and links back
when it relies on an earlier idea.

## Map changes after research (27 October 2026)

The research dossiers found Redis features newer than the original map and some
overlaps. These assignments now apply.

- **Article 1:** state the popularity skew with its exponent. Breslau et al.
  measured Zipf-like web proxy traces; for exponents below 1 a cache needs a
  larger fraction of items than "a small fraction" suggests. Show how the
  benefit depends on skew rather than asserting it.
- **Article 4:** add `allkeys-lrm` and `volatile-lrm` (Redis 8.6+); LRU clock
  resolution; a value larger than `maxmemory`. Where redis.io prose disagrees
  with the 8.10 source (active-expiry repeat threshold, LFU decay), follow the
  source and say so.
- **Article 5:** owns leases as the remedy for invalidation races. Versioned
  compare-and-set may use the single command `SET ... IFEQ` and `DELEX`
  (Redis 8.4+) with a short explanation; article 8 teaches atomic operations in
  general, including scripts for older versions.
- **Article 6:** owns the rebuild lock and refers back to article 5's lease
  rather than re-teaching it. Owns the stampede mechanics of a cold start; the
  operational response (warming, controlled restarts) stays in article 11.
  Note that "thundering herd" has a narrower meaning in Facebook's memcache
  paper.
- **Article 7:** owns per-key memory measurement and encodings, including
  compact hashes in 8.10. Mentions the persistence fork only as a latency
  source; article 9 owns it. Memory sizing for capacity is article 11's.
- **Article 8:** adds `SET ... IFEQ`, `DELEX` and `MSETEX` (8.4+). Owns client
  retries, backoff and timeouts; circuit breakers and system-level degradation
  stay in article 11.
- **Article 9:** adds `WAITAOF`, and the decision between a replica and simply
  a larger or rebuilt cache. Owns replica expiry behaviour; article 4 mentions it
  in one sentence.
- **Article 10:** adds `HOTKEYS` (8.6), `CLUSTER SLOT-STATS` (8.2), atomic slot
  migration (8.4), and cluster restrictions that earlier patterns must respect
  (`CROSSSLOT` errors, database 0 only).
- **Article 11:** owns failure testing (deliberately failing the cache) and the
  licensing history (Redis licences since 2024, Valkey) as part of choosing a
  service.
- **Article 11:** refers back to article 2's Figure 4 (abandoned loads under
  overload) rather than re-teaching it.
- **Article 5:** owns monotonic reads as one of the consistency guarantees.
  Multi-region invalidation is out of scope for teaching; article 12 may note it
  as a design consideration. `CLIENT TRACKING` stays in article 10.
