# Research dossier, group C: articles 5 and 6 (invalidation, stampedes)

Prepared 2026-10-27 for the writers of `invalidation` and `stampedes`. No article prose here.

**How to read it.** Each fact has an ID, a status and a source.

- `SRC`: stated by a primary source (URL given).
- `OBS`: observed on Redis 8.10.3, port 7203. The section letter points into `evidence/research-C.txt`.
- `DER`: derived by me from the model stated; the derivation is shown so the article can reproduce it.
- `MODEL`: a simulation result. Illustrative, not a Redis measurement.
- `UNCONFIRMED`: could not be confirmed. Do not state it as fact.

**Server used.** Redis 8.10.3, macOS arm64, `malloc=libc` (not jemalloc), `--port 7203 --save '' --appendonly no`, temporary directory, shut down at the end. Defaults seen: `hz 10`, `maxmemory-policy noeviction`, `lazyfree-lazy-user-del no`, `lazyfree-lazy-expire no`, `lazyfree-lazy-user-flush no`, `notify-keyspace-events ""`, `active-expire-effort 1` (section A, Y). No memory-fragmentation figures were taken, so the libc caveat only affects `MEMORY USAGE` (F5.38).

**Method note.** The scratch directory was shared with other researchers, and one first batch of my Python runs may have reached another server. I discarded those and re-ran everything with a client that refuses to run unless the server reports `tcp_port:7203` (evidence file, section "RE-RUNS"). The numbers below are from the re-runs.

**Primary sources used (all fetched 2026-10-27).**

- Nishtala et al., *Scaling Memcache at Facebook*, NSDI 2013: https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf
- Vattani, Chierichetti, Lowenstein, *Optimal Probabilistic Cache Stampede Prevention*, PVLDB 8(8), 2015: https://www.vldb.org/pvldb/vol8/p886-vattani.pdf
- Bronson, Aghayev, Charapko, Zhu, *Metastable Failures in Distributed Systems*, HotOS 2021: https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf
- Huang et al., *Metastable Failures in the Wild*, OSDI 2022: https://www.usenix.org/system/files/osdi22-huang-lexiang.pdf
- Meta Engineering, *Cache made consistent*, 2022: https://engineering.fb.com/2022/06/08/core-infra/cache-made-consistent/
- Redis docs: SET https://redis.io/docs/latest/commands/set/ ; DELEX https://redis.io/docs/latest/commands/delex/ ; distributed locks https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/ ; EXPIRE https://redis.io/docs/latest/commands/expire/ ; transactions https://redis.io/docs/latest/develop/using-commands/transactions/ ; Lua/EVAL intro https://redis.io/docs/latest/develop/programmability/eval-intro/ ; Pub/Sub https://redis.io/docs/latest/develop/pubsub/ ; keyspace notifications https://redis.io/docs/latest/develop/pubsub/keyspace-notifications/
- Redis source: https://github.com/redis/redis (`src/expire.c`, `src/db.c`, `redis.conf`, branch `unstable`, not the 8.10.3 tag)

---

## Article 5: `invalidation` (Cache invalidation and consistency)

### 5.1 What "consistent" can mean for a cache

- **F5.1** `SRC` A cache holds a copy, not the source of truth. "Cache invalidation" is the process of actively marking cached entries stale when the source of truth changes, and it needs "something other than the cache itself" to tell the cache. A cache that relies only on TTL has no invalidation. (Meta, *Cache made consistent*, https://engineering.fb.com/2022/06/08/core-infra/cache-made-consistent/)
- **F5.2** `SRC` Session guarantees give precise names for what a user can be promised. *Read your writes*: reads reflect previous writes. *Monotonic reads*: successive reads reflect a non-decreasing set of writes. Terry et al., *Session Guarantees for Weakly Consistent Replicated Data*, PDIS 1994 (checked in an HTML copy: https://www.cs.cornell.edu/courses/cs734/2000fa/cached%20papers/SessionGuaranteesPDIS_1.html). Use these as the precise terms behind "read-your-writes".
- **F5.3** `SRC` Meta measures consistency as a client-observable property: "N nines of cache writes are consistent in M minutes". Its Polaris service reported TAO going from 99.9999% to 99.99999999% at a five-minute timescale. Reuse as an example of "eventual convergence with a bound" and of measuring it. (Meta blog above.)
- **F5.4** `DER` Three definitions an article can use, each testable:
  1. Bounded staleness: a read never returns a value older than B seconds. A TTL of B gives this only if invalidation fails entirely; with working invalidation the usual staleness is the invalidation delay.
  2. Read-your-writes: after my write returns, my next read sees it (or something newer).
  3. Eventual convergence: if writes stop, the cache ends up equal to the database. Cache-aside with delete-on-write can violate this until the TTL (F5.12), which is why the TTL is the safety net.

### 5.2 Delete versus update on write

- **F5.5** `SRC` Facebook's memcache deletes cached data after a database write instead of updating it "because deletes are idempotent". (Nishtala et al. §2, "Query cache".) Observed: deleting twice, or deleting a missing key, is harmless; the second `DEL` returns 0 (section C, `OBS`).
- **F5.6** `OBS` Update-on-write can leave the older value in the cache when two writers' cache writes arrive in a different order from their database commits. Trace (section E): database order W1 sets price 110, then W2 sets price 120; cache writes arrive W2 then W1; `GET` returns 110 while the database holds 120. A delete-on-write design cannot do this, because a delete carries no value.
- **F5.7** `DER` Order matters inside the writer: commit the database change first, then delete. If the writer deletes first and commits after, a reader can refill the old value between the two steps and nothing later removes it. (Reasoning; the same trace shape as F5.9 with the writer's own steps swapped.)
- **F5.8** `DER` The delete itself can fail after the database commit (timeout, crash between the two steps). Then the stale value lives until TTL. This is the case for the TTL safety net (F5.12), for retrying deletes, and for deleting from the database's change stream (F5.22). Meta observes that when an invalidation is still missing after a few seconds, "the most common reason is that the first attempt failed and subsequent retrials will resolve the problem" (Nishtala §7, invalidation latency).

### 5.3 The classic races, step by step

- **F5.9** `OBS` **Race 1, stale refill after delete** (section D). Redis commands, in this order:
  1. R: `GET product:42` returns nil (miss).
  2. R reads the database: price 100 (old).
  3. W updates the database to 120, then `DEL product:42` (returns 0 or 1; nothing to delete).
  4. R (slow) `SET product:42 {"price":100} EX 3600`.
  5. Every later `GET` returns 100 and `TTL` shows 3600: the stale value lives a full hour.
  The writer did everything right. The reader's read and its write-back are two commands with a gap, and the writer's delete landed in the gap.
- **F5.10** `SRC` The same race is described by Meta in its own words: the cache fill for x=42 is in flight when x becomes 43; the invalidation for x=43 arrives first; then the fill reply sets x=42. (*Cache made consistent*.) Nishtala calls this a "stale set": "when concurrent updates to memcache get reordered" (§3.2.1).
- **F5.11** `DER` Why this race is rare but real: it needs a reader whose database read began before the write and whose cache write ends after the delete. The window is the reader's miss-handling time (database latency plus network). A slower database and a hotter key make it likelier. Meta's concern is exactly that these appear at scale even when each is rare.
- **F5.12** `OBS` Short TTL as a safety net does not prevent the race; it bounds its damage. In the trace above the stale value would persist for the full TTL set by the reader (3600 s). With `EX 60` the damage ends within a minute.

### 5.4 Remedies

**Versioned values with compare-and-set**

- **F5.13** `OBS` A "set only if newer" write (section F), using `EVAL`:
  `local cur = redis.call('HGET', KEYS[1], 'v'); if (not cur) or tonumber(cur) < tonumber(ARGV[1]) then redis.call('HSET', KEYS[1], 'v', ARGV[1], 'data', ARGV[2]); redis.call('EXPIRE', KEYS[1], ARGV[3]); return 1 else return 0 end`
  Version 8 written first, then a late write of version 7 returns 0 and leaves version 8. A repeat of version 8 also returns 0. This fixes race 2 (writers out of order) and, when invalidation is done by writing a newer version rather than deleting, race 1 as well.
- **F5.14** `OBS` The catch: if invalidation is a `DEL`, the version information disappears with the key, and a stale version-7 write is then accepted (section G: after `DEL`, the same script writes v7). So versioned values need either (a) writes of a tombstone with the new version (instead of `DEL`) that itself has a TTL, or (b) a separate version key. Meta describes the same failure: if the entry "x=43 @version=2" is evicted before the late "x=42" arrives, the cache "would lose knowledge of the newer data" (*Cache made consistent*). Eviction can do this too, not just `DEL`.
- **F5.15** `SRC` `WATCH` gives optimistic check-and-set: if any watched key is modified before `EXEC`, the transaction aborts and `EXEC` returns a null reply; the client retries (https://redis.io/docs/latest/develop/using-commands/transactions/). `OBS` (section H): `WATCH k`, other client does `SET k other`, `MULTI`, `SET k 2`, `EXEC` returns nil, and `GET k` is `other`.
- **F5.16** `SRC` Lua scripts run atomically: "While executing the script, all server activities are blocked during its entire runtime" (https://redis.io/docs/latest/develop/programmability/eval-intro/). Keep cache scripts tiny. Teaching of `EVAL`, `WATCH` and functions belongs to article 8; article 5 only uses them (see gaps below).
- **F5.17** `SRC`+`OBS` **Redis 8.4+** adds conditional single commands for string values: `SET key value IFEQ expected`, `IFNE`, `IFDEQ`, `IFDNE`, and `DELEX key IFEQ|IFNE|IFDEQ|IFDNE` (https://redis.io/docs/latest/commands/set/ , https://redis.io/docs/latest/commands/delex/ , "since 8.4.0"). The transactions page states they give atomic compare-and-set and compare-and-delete "much simpler and faster" than `WATCH`. Observed (section I): `SET k new IFEQ old` returns OK when it matches and nil when it does not or when the key is missing; `SET ... IFEQ ... GET` returns the old value; `DELEX k IFEQ x` returns 0 or 1. `IFEQ` compares the **whole string value** (O(1) per the docs for the compare itself), `IFDEQ` compares an XXH3 digest from `DIGEST key` (O(N) in value length).
- **F5.18** `OBS` `SET ... IFEQ` is an ordinary `SET`: without `KEEPTTL` it drops the old TTL (section I: `TTL` was -1 after `SET a 2 IFEQ 1` on a key that had `EX 100`). Pass `KEEPTTL` or a new `EX`.
- **F5.19** `DER` `IFEQ` does not give "set only if newer". It checks equality with the value you read earlier. To do an "only if unchanged since I read it" update, read value, compute, `SET ... IFEQ old`. A numeric "greater than" test still needs `EVAL` or a stored version string compared by equality.
- **F5.20** `UNCONFIRMED` Which Valkey release introduced `SET ... IFEQ`: sources disagree (an AWS ElastiCache page lists it under Valkey 8.2; a third-party guide says 8.1). `DELIFEQ` is "Since 9.0.0" on https://valkey.io/commands/delifeq/ (confirmed). Redis and Valkey therefore name the compare-and-delete differently (`DELEX ... IFEQ` vs `DELIFEQ`). One sentence in the article at most.

**Leases (Facebook's memcache)**

- **F5.21** `SRC` Nishtala §3.2.1: a *lease* is a 64-bit token bound to the specific key, given to a client on a miss; the client presents it when setting the value; the server can refuse the set "if memcached has invalidated the lease token due to receiving a delete request for that item". It is compared to load-link/store-conditional. Leases address "stale sets and thundering herds". Rate limit: tokens are returned "only once every 10 seconds per key" by default; other requests in that window get "a special notification telling the client to wait a short amount of time". Measured at Facebook: for keys prone to herds, the peak database query rate was 17K/s without leases and 1.3K/s with them (one week of data). Also: on delete the value moves to a "recently deleted items" structure for a short time and a get can return "data that is marked as stale", so applications that tolerate slightly stale data need not wait.
- **F5.22** `OBS` Leases can be built from Redis commands (section J). Lease key `lease:K` is created with `SET lease:K token NX PX 10000`. Fill: a script checks that `GET lease:K` equals the caller's token, then `SET K value EX ttl` and `DEL lease:K`. Invalidate: `DEL K` and `DEL lease:K`. Trace: R misses and takes the lease (OK); a second missing reader S gets nil (this is the herd guard); W updates the database and runs the invalidate script; R's fill returns 0 and `GET K` is nil (the stale value is refused); the next reader takes a new lease and fills 120. A lease that expired (`PX 200`, wait 400 ms) also refuses a late fill (returns 0).
- **F5.23** `DER` The lease and the stampede lock (article 6) are the same Redis mechanism, `SET key token NX PX`, used for two purposes. The article-5 purpose is "delete cancels the token". The article-6 purpose is "only one rebuilder at a time". See the overlap note below.
- **F5.24** `DER` Terminology trap. Nishtala defines *thundering herd* as a key with heavy read and write activity, where writes repeatedly invalidate recently set values so many reads hit the database. The common industry meaning (and article 6) is many concurrent misses after expiry. Say which meaning you use when citing the paper.

**Delayed double delete and its limits**

- **F5.25** `OBS` Pattern: delete after the database write, then delete again after a delay D. Section T, case A: first `DEL`; the slow reader's `SET` arrives at +150 ms; the second `DEL` at +500 ms removes it; next `GET` is nil (clean). Case B: the reader's `SET` arrives at +650 ms, after the second delete; `GET` returns the stale value and `TTL` shows 3600.
- **F5.26** `DER` Limits to state: (a) D must exceed the slowest reader's database-read-to-cache-write time, which has no hard upper bound (GC pauses, retries, replica lag); (b) if reads come from a lagging database replica, D must also exceed replica lag, otherwise the reader keeps re-reading old data; (c) the second delete needs somewhere to wait: an in-process timer is lost on crash, so it needs a queue; (d) in between, readers still see stale data for up to D; (e) it halves nothing about the delete-failure case (F5.8). It reduces the window; it does not close it. Leases or versions close it.

**Short TTL**

- **F5.27** `DER` TTL as backstop: cost is extra misses per key of 1/TTL per second per live key; the staleness guarantee is the TTL itself. Choosing TTL is article 4's; here, only say it caps the damage from every invalidation bug at once.

### 5.5 Invalidating from the database's change stream

- **F5.28** `SRC` Meta's pipeline: invalidation daemons "mcsqueal" run on every database, inspect the SQL statements that database commits, extract the cache deletes and broadcast them to memcache; deletes are batched through intermediate routers, giving an 18x improvement in packet rate; only 4% of deletes issued actually invalidate cached data. Because it works from the commit log it avoids a race in which an invalidation arrives before the data has replicated to a replica region, and it is replayable "from reliable logs" (Nishtala §4.1 "Regional Invalidations"; §5 "Writes from a master region").
- **F5.29** `SRC` Debezium reads a database's change log and delivers change events to Kafka; it provides **at-least-once** delivery, so after a fault a consumer "might emit some duplicate change events" (https://debezium.io/documentation/reference/stable/connectors/postgresql.html). A delete is idempotent (F5.5), so duplicates are harmless for invalidation. This is the strongest argument for delete-on-event over update-on-event.
- **F5.30** `SRC` Transactional outbox pattern: write the business change and an event row in the same database transaction, then a relay publishes the event; this avoids the dual-write problem where the process crashes between committing and publishing (https://microservices.io/patterns/data/transactional-outbox.html). Applied to caches: write an "invalidate key K" row in the same transaction as the data change.
- **F5.31** `SRC` Redis Pub/Sub is at-most-once: "If the subscriber is unable to handle the message (for example, due to an error or a network disconnect) the message is forever lost" (https://redis.io/docs/latest/develop/pubsub/). `OBS` (section S): `PUBLISH invalidate product:42` with no subscribers returns 0; a subscriber that disconnected received only the message sent while it was connected. Pub/Sub alone is therefore not a reliable invalidation transport; a change stream with replay, or Redis Streams, is. Keep to one or two sentences; near-cache invalidation is article 10's.
- **F5.32** `SRC` Keyspace notifications are off by default (`notify-keyspace-events ""`, `OBS` section Y), are fire-and-forget Pub/Sub, and the `expired` event "is generated when the Redis server deletes the key and not when the time to live theoretically reaches the value of zero", so with many TTL keys and no access "there can be a significant delay" (https://redis.io/docs/latest/develop/pubsub/keyspace-notifications/). Do not build invalidation on them.

### 5.6 Dependency fan-out (one change, many cached results)

- **F5.33** `OBS` **Generation counter** (section R): key `gen:category:7` holds an integer; cached pages are named `category:7:g<gen>:page:N`. `INCR gen:category:7` makes all `g1` keys unreachable in one O(1) command. Cost: the old keys stay in memory until their TTL or eviction (observed `DBSIZE` 3 after INCR; old keys keep `TTL 3600`). Every reader pays one extra `GET` for the generation (batchable with `MGET`).
- **F5.34** `OBS` **Tag set**: `SADD tag:category:7 key1 key2`, then invalidate by deleting members and the set. The set outlives its members: after `item:1` expired, `SMEMBERS tag:cat:9` still listed it (section R). Cost to say: O(N) in set size to read and delete.
- **F5.35** `OBS` Deleting a big tag set blocks the server: `DEL` of a 1,000,000-member set took 85.7 ms (client-observed), while `UNLINK` returned in 0.2 ms and frees memory in a background thread (section W; this laptop; libc malloc). `lazyfree-lazy-user-del` defaults to `no` in `redis.conf` (and on the test server), so plain `DEL` is synchronous by default. `SRC` DEL and UNLINK pages: https://redis.io/docs/latest/commands/unlink/ . Valkey's default configuration file in its development branch sets all `lazyfree-*` options to `yes` (https://raw.githubusercontent.com/valkey-io/valkey/unstable/valkey.conf); the release in which that default changed is `UNCONFIRMED`.
- **F5.36** `SRC` Key-based expiration (generation in the key) is the standard pattern in Rails: `cache_key_with_version` builds the key from class, id and `updated_at`, so an updated record is simply a different key; a `touch: true` association propagates a child change to its parent so dependent fragments change too (https://guides.rubyonrails.org/caching_with_rails.html). Use as a named, searchable example.
- **F5.37** `DER` Choosing between them: generation counters make invalidation O(1) and add a read per lookup and leaked memory until TTL; tag sets give exact deletion and add O(N) deletion cost, a second structure to keep consistent, and memory per member; versioned keys from the row's own version (`updated_at`) need no coordination but cannot express a change to a *set* of rows (a new member joining a list).
- **F5.38** `OBS` Overhead check: `MEMORY USAGE` of a small string key with a 7-byte value was 48 bytes (section U). Allocator-dependent on this libc build; do not quote as typical.

### 5.7 Read-your-writes for the user who made a change

- **F5.39** `SRC` Facebook: a web server that modifies data also sends the invalidation to its own cluster "to provide read-after-write semantics for a single user request" (Nishtala §4.1). For replicas that may lag, the *remote marker* mechanism: (1) set a marker `r_k` in the region, (2) write to the master with `k` and `r_k` embedded for invalidation, (3) delete `k` locally; a later reader that misses and finds `r_k` sends its query to the master region instead of the local replica. The paper says explicitly that it trades "additional latency when there is a cache miss, for a decreased probability of reading stale data" and that a marker can be deleted by a concurrent operation (§5).
- **F5.40** `DER` Redis-shaped version for a single-database app: after user U writes, set `SET recent-write:U 1 EX <n>` (n at least the invalidation delay or replica lag); while it exists, that user's reads bypass the cache or the replica. Or write the new value into the cache for that user's key space. State the cost: the marker is part of correctness, so unlike cached data its loss (eviction) is not safe; Nishtala makes the same point about markers.
- **F5.41** `DER` Replica note for Redis reads: a replica serves logically expired keys as missing without deleting them; deletion arrives as a `DEL` from the master (`SRC` `src/db.c` `expireIfNeeded` comment and https://redis.io/docs/latest/commands/expire/ "How expires are handled in the replication link"). Replication is asynchronous, so a read from a replica right after a write on the master can miss the write (replication owned by article 9).

### 5.8 Numbers and models for article 5

- Illustrative (choose freely): price 100 -> 120; TTL 3600 s; reader database latency 80 ms to 300 ms; delete delay D = 500 ms; lease of 10 s (Facebook's default, F5.21).
- Measured on this Redis, citable as measured: the exact traces in sections D, E, F, G, H, I, J, T, S (command semantics, return values); `DEL` vs `UNLINK` on a 1M-member set (85.7 ms vs 0.2 ms, one laptop run).
- Quoted from sources, not measured by us: 17K/s to 1.3K/s (Facebook leases); 18x packet batching; 4% of deletes effective; six to ten nines (Meta).
- Suggested figure: a stepped race (Play/Back/Next), with lanes for Reader, Writer, Database, Cache, switchable between "delete only", "+ short TTL", "+ lease", "+ version". Each step highlights the cache value; the stale final state is shown in the "delete only" mode. Second figure: the same race with two writers out of order (update-on-write).

### 5.9 Running examples for article 5

1. **Product price in a catalogue**: read-heavy, a price change must show quickly but a minute of staleness is tolerable for browsing; the price used at checkout is read from the database (leaves "what not to cache" to article 12).
2. **User profile / display name**: the user who edits must see their own edit immediately (read-your-writes), others can lag a few seconds.
3. **Category page listing products**: one product change affects many cached pages (fan-out; generation counter or tag).

---

## Article 6: `stampedes` (Cache stampedes and the thundering herd)

### 6.1 What a stampede is and how big it gets

- **F6.1** `SRC` Definition: "a situation that occurs when a popular cache item expires, leading to multiple requests seeing a cache miss and regenerating that same item at the same time"; also called dog-piling, cache miss storm, cache choking. It is described as a cascading failure because concurrent recomputations slow each recomputation, which keeps more requests inside the stampede (Vattani et al. 2015, introduction, https://www.vldb.org/pvldb/vol8/p886-vattani.pdf).
- **F6.2** `DER` Size by Little's law: if requests for the key arrive at rate r per second and one rebuild takes δ seconds, the number of requests that start a rebuild before the first one finishes is r·δ. Example: 500 requests/s and a 0.2 s query predict 100 simultaneous queries.
- **F6.3** `OBS` Stampede on a real Redis (section N; the database is `sleep(0.2)`, the Redis commands are real). Poisson arrivals, 500/s for 3 s, key absent at the start, three seeds: unprotected rebuilds = 101, 84, 83 database queries, with peak concurrency equal to the same numbers (prediction 100; Python thread start-up delays shave a few arrivals); latency p99 about 205 to 211 ms. Illustrative database; measured Redis behaviour.
- **F6.4** `OBS` Repeated cycles (section V): same traffic, hot key with a 1 s TTL for 6 s: unprotected 507 database queries (peak 125 at once; 16.6% of requests slower than 50 ms); with a rebuild lock 5 queries (14.0% of requests wait); with stale-while-revalidate 5 queries (2.4% slow, which matches the 200 ms cold start at the beginning, an inference from the request rate, not separately logged; 448 requests were served a stale value). Message for the article: a lock removes the database load but not the waiting; serving stale removes both.
- **F6.5** `SRC`+`DER` Why the database suffers more than r·δ suggests: concurrent queries are slower than one alone (F6.1), and if the application times out and retries, work multiplies. HotOS 2021 gives a worked arithmetic example: a database that handles 300 queries/s behind a cache with a 90% hit ratio can serve 3,000 requests/s; "losing a cache with a 90% hit-rate causes a 10x query amplification" (§2.2, https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf). Simple generalisation `DER`: database load = traffic x (1 - hit ratio), so empty-cache load is 1/(1 - h) times normal: 10x at 90%, 20x at 95%, 100x at 99%.
- **F6.6** `DER` The overload condition for a single key: r·δ greater than the database's concurrent query capacity c (connection pool size). Example: 100 simultaneous queries against a pool of 20 means 80 wait; draining at c/δ = 100 queries/s takes about 1 s, during which every other query is also slower. Illustrative; state c as an assumption.

### 6.2 Synchronised expiry and jitter

- **F6.7** `SRC` Passive and active expiry. A key is expired passively when a client accesses it after its time, and actively by a periodic test of a few random keys with a TTL (https://redis.io/docs/latest/commands/expire/). Expire accuracy since Redis 2.6: "from 0 to 1 milliseconds". Expiry uses absolute Unix timestamps from the computer clock; setting the clock forward expires keys immediately, and Redis does not use a monotonic clock for TTLs (same page; locks page "Redis is not using monotonic clock for TTL expiration").
- **F6.8** `SRC` Active expiry details (source, `src/expire.c`, unstable): 20 keys per database loop, a slow cycle at `hz` frequency (10 by default) limited to 25% of CPU time, a fast cycle of at most 1000 microseconds in every event-loop pass, and extra effort when more than 10% of sampled keys are expired (`ACTIVE_EXPIRE_CYCLE_KEYS_PER_LOOP 20`, `..._FAST_DURATION 1000`, `..._SLOW_TIME_PERC 25`, `..._ACCEPTABLE_STALE 10`). `active-expire-effort` default 1 (`OBS` section Y). The constants are from the unstable branch; confirm against the 8.10 tag before quoting numbers.
- **F6.9** `OBS` Reads see expiry immediately; memory is reclaimed shortly after (section L). 200,000 keys set with `PX 1000` all together: `GET` of a probe key returned its value at 0.77 s and nil at 1.03 s; `DBSIZE` was still 200000 at 0.77 s, 58,587 at 1.03 s and 0 at 1.30 s, with `expired_keys_active` equal to 200000. So a dense batch of simultaneous expiries is reclaimed within about 0.3 s. Sparse expiry reclaim behaviour is article 4's.
- **F6.10** `OBS` Mass expiry has a bounded server-side cost (section M, three runs). 1,000,000 keys all expiring within about a second: a second connection's `PING` every ~1 ms saw p99 = 1.2 to 1.35 ms and max 25 to 27 ms, against p99 0.17 to 0.65 ms and max 0.5 to 6 ms with no expiry (one earlier control run showed a 21 ms outlier, so a single-run maximum is noisy; the repeated 25 to 27 ms in all three expiry runs is the stable signal). The cap is consistent with the 25%-of-CPU slice at `hz 10` (25 ms of each 100 ms). `expired_time_cap_reached_count` was 343 to 516; `expire_cycle_cpu_milliseconds` 550 to 796. So synchronised expiry costs Redis tens of milliseconds of stall, not seconds. The damage in a stampede is to the database, not to Redis. Do not overclaim.
- **F6.11** `MODEL` TTL jitter effect (section P; 10,000 keys all loaded at t=0, each read about once per second, TTL base 300 s, rebuild on first read after expiry, 3 simulated hours, seed 11). Long-run mean rebuild rate = K/(base + 1/λ) = 33.2/s.

  | jitter (TTL = 300 s ± J) | peak rebuilds/s, first 15 min | peak, last hour | max/mean, last hour |
  | --- | --- | --- | --- |
  | none | 6,407 | 837 | 25.1 |
  | ±15 s | 364 | 119 | 3.6 |
  | ±30 s | 191 | 62 | 1.9 |
  | ±60 s | 108 | 58 | 1.7 |
  | ±150 s | 63 | 56 | 1.7 |

  Two lessons: (1) without jitter, synchronisation does not fade; three hours later the peak is still 25 times the mean; (2) the first-wave peak is about K/(2J) rebuilds per second (333, 167, 83, 33 predicted; 364, 191, 108, 63 observed with Poisson noise).
- **F6.12** `DER` Derivation for the article. If K keys expire at times spread uniformly over a window of width W, the rebuild rate is about K/W per second. With no jitter W is the read delay after expiry (about 1/λ), so the burst is about K·λ per second, which can be K per second or more. With jitter ±J, W = 2J. Mean TTL stays the same, so the long-run cost K/T does not change; only the peak does. Doubling J halves the peak of the first wave.
- **F6.13** `SRC` Redis commands for jitter: `EXPIRE key seconds [NX|XX|GT|LT]` since 7.0 (`OBS` section U: `GT` refuses a shorter TTL, `NX` refuses a key that already has a TTL). The jitter itself is computed by the application; Redis has no random-TTL option. Introduced in article 4; do not re-teach.

### 6.3 Request coalescing in one process (single-flight)

- **F6.14** `SRC` Go's `golang.org/x/sync/singleflight`: `Do(key, fn)` "executes and returns the results of the given function, making sure that only one execution is in-flight for a given key at a time. If a duplicate comes in, the duplicate caller waits for the original to complete and receives the same results" (https://pkg.go.dev/golang.org/x/sync/singleflight). Use the name "single-flight" (searchable). Other ecosystems have equivalents under other names; do not claim a list that was not checked.
- **F6.15** `OBS` Four application processes with single-flight each: the database sees 4 queries, not 1 and not 100 (section N: `rebuilds=4`, peak concurrency 4, all three seeds). Limit: it is per process, so queries grow with process count (N instances produce up to N queries per expiry per key). A cross-process rebuild lock is the next step.
- **F6.16** `DER` Failure modes to say: the waiting callers share the leader's error and latency; a leader that hangs holds everyone, so the shared call needs its own timeout; the shared result is one object, so callers must not mutate it.

### 6.4 Cross-process rebuild lock with `SET key value NX PX`

- **F6.17** `SRC`+`OBS` Acquire: `SET lock:K <unique token> NX PX <ms>`. Returns OK to one caller and nil to the rest (section K: A got OK, B got nil, `PTTL` 282 of 300). `NX` plus `GET` has been allowed together since 7.0 (SET history, `OBS` section B).
- **F6.18** `SRC`+`OBS` Release safely: compare the token, then delete. Redis 8.4+: `DELEX lock:K IFEQ <token>` (https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/ and https://redis.io/docs/latest/commands/delex/). Before 8.4, the Lua script `if redis.call("get",KEYS[1]) == ARGV[1] then return redis.call("del",KEYS[1]) else return 0 end`. Observed (section K): `DELEX ... IFEQ A` returned 0 when B held the lock and left B's lock intact; the Lua script returned 0 for A and 1 for B. Valkey 9.0 names it `DELIFEQ` (https://valkey.io/commands/delifeq/).
- **F6.19** `OBS` The expiry hazard (section K). Lock `PX 300`; A's rebuild runs 400 ms; at 300 ms the lock expires; B acquires (`SET ... NX` OK); A finishes and releases with plain `DEL`, which returns 1 and **removes B's lock** (`GET` then returns nothing). With a token and `DELEX IFEQ` A's release does nothing to B. Even with the token, two rebuilders overlap during the gap, which is acceptable for a cache (duplicate work, not corruption) but means the lock is only an efficiency tool.
- **F6.20** `SRC` Kleppmann distinguishes locks "for efficiency" (avoiding duplicate work) from locks "for correctness"; for efficiency a lock that sometimes fails is no great harm, and he warns that a lock holder paused (GC, network delay) past expiry can still write, which needs a fencing token to stop (https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html). The Redis docs say the single-instance pattern is fine "in applications where a race condition from time to time is acceptable", and that with asynchronous replication a failover can let two clients hold the lock (https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/). The rebuild lock is the efficiency case. Redlock and fencing tokens: one sentence and the links; no more.
- **F6.21** `SRC` antirez's reply (http://antirez.com/news/101) argues a random token enables check-and-set on the protected resource instead of monotonic fencing tokens. The disagreement is for the sources section, not the body.
- **F6.22** `OBS` Choose the lock TTL longer than the rebuild's slowest plausible time, and short enough that a dead holder does not stall everyone: if the holder crashes, waiters wait out the whole TTL (`DER`). In the test (section N) `PX 5000` was used with a 0.2 s rebuild. Rule of thumb for the article: a small multiple of p99.9 rebuild time.
- **F6.23** `OBS` **Re-check the cache after taking the lock**, otherwise a late arrival that missed before the fill rebuilds again. Observed: without the re-check, 1 of 15 runs produced 2 database queries instead of 1 (first run, log not kept); in 14 later repeats it produced 1 each. With the re-check, 1 in every run (section N, seeds 1 to 11). Narrow window, real bug.
- **F6.24** `OBS` Waiting strategies for the callers that did not get the lock (section N used polling): (a) poll `GET` every 20 ms; the measured p99 was 186 to 203 ms, effectively the rebuild time, so the waiters pay one rebuild's latency; (b) serve a stale copy (6.5); (c) give up and go to the database with a small probability or after a deadline; (d) return a fallback or error. Redis has no blocking "wait for key" command. `DER` A wake-up via Pub/Sub or `BLPOP` is possible but Pub/Sub is at-most-once (F5.31), so any wake-up needs a timeout and polling fallback.
- **F6.25** `DER` Add jitter to the polling interval and a deadline to the loop so waiters do not poll in lockstep and cannot wait forever.

### 6.5 Serving stale while revalidating (soft and hard expiry)

- **F6.26** `SRC` Terminology from HTTP: `stale-while-revalidate` lets a cache "immediately return a stale response while it revalidates it in the background, thereby hiding latency" (RFC 5861, https://www.rfc-editor.org/rfc/rfc5861). Use the term and say the idea is borrowed; the Redis mechanism is the application's.
- **F6.27** `OBS` A Redis implementation with no extra field (section U, V): store with the **hard** TTL (e.g. `EX 600`); the **soft** deadline is when remaining TTL drops below `hard - soft` (e.g. below 300 000 ms). Read with `MULTI`, `GET`, `PTTL`, `EXEC` (returns the value and 599995 in the test) or two pipelined commands. If `PTTL` is below the threshold, the first request takes the lock (`SET ... NX PX`) and refreshes in the background while everyone else keeps serving the stale value. Section V used hard 5 s, soft after 1 s: 448 stale responses, 5 database queries, no slow requests apart from the first cold start.
- **F6.28** `DER` Costs: memory (values live longer than their freshness); staleness is bounded by soft TTL plus rebuild time; the cold path (key truly absent) still needs a lock; the background refresher must have its own timeout.
- **F6.29** `SRC` Facebook's lease path returns "data that is marked as stale" while one client refetches, for applications that "can continue to make forward progress with stale data" (Nishtala §3.2.1). Cite as the large-scale precedent.

### 6.6 Probabilistic early expiration (XFetch)

- **F6.30** `SRC` Algorithm (Vattani et al. Figure 3):
  ```
  function XFetch(key, ttl; beta = 1)
    value, delta, expiry <- CacheRead(key)
    if !value or Time() - delta * beta * log(rand()) >= expiry then
      start <- Time(); value <- RecomputeValue(); delta <- Time() - start
      CacheWrite(key, (value, delta), ttl)
    end
    return value
  ```
  `delta` is the measured recompute time, stored with the value. `beta` defaults to 1 and "can be increased for even better guarantees against stampedes, if earlier expirations are not a concern". The paper frames it as drawing a gap from an exponential distribution (D = Exp(1/beta)) and recomputing early when `now + gap >= expiry`. It is described for caches with plain get/set and no locking (§1, §5).
- **F6.31** `SRC` Optimality claim: among gap distributions that do not depend on the request rate, the exponential distribution is optimal for trading early-expiration gap against stampede size (Theorem 8). Uniform gaps (used by Perl's CHI) need a gap of order sqrt(n) to reduce a stampede of n processes to about sqrt(n) (the paper's example: 10,000 processes needs expirations as early as 50 minutes to get down to 100). For beta = 1 the paper reports an expected stampede of "e - 1/e ~ 2.4 processes" with the early-expiry gap about ln(n) recompute-times ("loge(10,000) ~ 9.2 minutes" in its example with one-minute recomputes).
- **F6.32** `DER` Derivation the article can show. Let requests arrive at rate r, recompute time δ, and x be the time remaining until expiry.
  1. The random gap is g = -δβ·ln(u), u uniform in (0,1), so g is exponential with mean δβ.
  2. A request at remaining time x recomputes if g >= x, which has probability P(g >= x) = exp(-x/(δβ)). Far from expiry it is almost 0; at x = 0 it is 1.
  3. Requests at rate r therefore start recomputes at rate r·exp(-x/(δβ)); the total hazard still ahead of a given x is H(x) = r·δβ·exp(-x/(δβ)).
  4. The first recompute starts when H has been "used up" by an Exp(1) amount, giving mean lead time before expiry E[x1] = δβ·(ln(r·δβ) + γ), with γ = 0.5772 (Euler's constant). Example r=100/s, δ=0.2 s, β=1: 0.2 x (ln 20 + 0.577) = 0.714 s early. The recompute starts about 3.6 recompute-times before the expiry, and the lead grows only with the log of the request rate.
  5. Probability the value expires before a recompute can finish (a start must be at least δ before expiry): about exp(-r·δβ·e^(-1/β)). r=100, δ=0.2, β=1: 0.064%.
  6. Expected recomputes started per expiry cycle: e^(1/β), independent of r and δ (β=1: 2.72; β=2: 1.65; β=0.5: 7.39). Reason: the cumulative hazard at the first start is Exp(1) with mean 1, and duplicates are the extra hazard accumulated during the next δ seconds, which is that value times (e^(1/β) - 1); adding the first recompute gives e^(1/β).
- **F6.33** `MODEL` Simulation of the rule (section O, 20,000 cycles per row, seed 7, Poisson arrivals, T = 60 s). Matches the derivation:

  | r (req/s) | δ (s) | β | recomputes per cycle (XFetch) | lead before expiry of first recompute (s) | cycles with a hard miss | unprotected recomputes per cycle |
  | --- | --- | --- | --- | --- | --- | --- |
  | 100 | 0.2 | 1 | 2.74 (derived 2.72) | 0.712 (derived 0.714) | 0.04% | 21.0 |
  | 100 | 0.2 | 2 | 1.65 (1.65) | 1.705 (1.7) | 0.00% | 21.0 |
  | 100 | 0.2 | 0.5 | 6.70 (7.39) | 0.287 | 22.6% | 21.0 |
  | 1,000 | 0.2 | 1 | 2.70 | 1.178 (1.175) | 0.00% | 201 |
  | 100 | 2 | 1 | 2.70 | 11.78 (11.75) | 0.00% | 201 |
  | 10 | 0.2 | 1 | 2.14 | 0.252 | 32.2% | 3.0 |
  | 1 | 0.2 | 1 | 1.19 | negative (the first rebuild is a miss) | 83% | 1.2 |

  Reading: XFetch removes the stampede at high request rates (hot keys), regardless of δ and r, leaving about 2 to 3 recomputes per expiry; at low rates (r·δ ≲ 2) it cannot help because nobody asks in time, but there is no stampede to prevent either. It does not eliminate duplicates (no coordination); combining it with a lock removes them.
- **F6.34** `UNCONFIRMED` Paper says "e - 1/e ~ 2.4 processes" for beta = 1; both my Poisson and equally spaced simulations give 2.70 to 2.72 = e (section Q), and my derivation gives e. The paper's definition (processes regenerating in the interval of one recompute time starting at the first regeneration) looks the same as mine, so the difference is not explained. Writers: say "about two to three" and cite both; do not print 2.4 or 2.7 as exact.
- **F6.35** `DER` Practical reading for Redis: store `delta` (milliseconds the rebuild took) with the value, e.g. in the cached JSON or a hash field; read the remaining TTL with `PTTL` (the expiry is known without a stored timestamp); `rand()` per request is cheap; no Redis feature is needed; set the physical TTL to the logical expiry (XFetch fires before it). Unlike a rebuild lock it needs no extra round trip on the read path.

### 6.7 Cold-start stampedes

- **F6.36** `SRC` Look-aside caches turn cache loss into a persistent failure when the database cannot serve the refill: "the cache will remain empty since the web application is responsible for populating the cache, but its timeout will cause all queries to be considered as failed" (HotOS 2021 §2.2); OSDI 2022 cites the same pattern: a partial failure such as a cache server reboot causes a load spike on the database, the database times out, and the timeouts prevent the cache from refilling. Definition (HotOS introduction): a *metastable failure* is a state where "a trigger causes the system to enter a bad state that persists even when the trigger is removed", sustained by "work amplification or decreased overall efficiency"; leaving it needs "a strong corrective push, such as rebooting the system or dramatically reducing the load". Operators run in the vulnerable state "because it is much more efficient than running them in the stable state" (OSDI 2022, introduction). Article 11 owns the full treatment; here one section.
- **F6.37** `SRC` HotOS suggests the fix direction for look-aside caches: filling the cache should have a higher priority than serving clients, which "is unenforceable with a look-aside cache but trivial with a read-through cache" (HotOS, discussion of recovery). Practical `DER` consequence: admit only a bounded number of rebuilds (lock, per-key and global), shed other requests quickly, and let rebuild queries outlive the client's timeout so the fill completes.
- **F6.38** `OBS` `FLUSHALL` of 1,000,000 keys of 100 bytes took 272.9 ms synchronously and 0.1 ms with `ASYNC` (client-observed; section X). `lazyfree-lazy-user-flush` is `no` by default, so the plain form is synchronous. A flush also blocks Redis for that time. Operational response (warming, controlled restarts) is article 11's.
- **F6.39** `MODEL` Refill time after a flush (section Z; assumptions: 1,000,000 keys; Zipf-distributed requests at 3,000/s; the database answers at most MU misses per second and each answered miss fills the cache; unanswered misses fill nothing; no TTL; infinite memory). Time until the hit ratio reaches 90% and 95%, measured over 10 s windows:

  | keys | Zipf exponent | database queries/s | to 90% | to 95% |
  | --- | --- | --- | --- | --- |
  | 1,000,000 | 1.0 | 300 | 1,217 s (about 20 min) | 2,276 s |
  | 1,000,000 | 0.8 | 300 | 2,318 s | 2,957 s |
  | 100,000 | 1.0 | 300 | 148 s | 260 s |
  | 1,000,000 | 1.0 | 3,000 | 694 s | 1,811 s |
  | 1,000,000 | 1.0 | 100 | 3,527 s | 5,903 s |

  Reading: refill is limited by how fast the database can answer, and a long tail makes the last few percent slow. During all of it, database load is traffic x (1 - h(t)); at the start that is 100% of traffic (10x its capacity in the HotOS example). The Zipf exponent is an assumption; see F6.41.
- **F6.40** `DER` What the cold-start protections are, as one list for the article: rebuild lock per key (limits duplicates), a global cap on concurrent rebuilds (limits database load), serving stale or a degraded response for misses beyond the cap, and warming the hottest keys before taking traffic. Metrics and runbooks: article 11.
- **F6.41** `UNCONFIRMED` Zipf exponent of real request streams: the Breslau et al. abstract (http://pages.cs.wisc.edu/~cao/papers/zipf-implications.html) says web request distributions are "Zipf-like" with "the exponent varying from trace to trace" and that they do not follow Zipf's law precisely. The abstract does not give numbers, and I could not read the full text. Do not quote an exponent range; present exponents as assumptions in figures. Article 1 owns the skew material.

### 6.8 Numbers and models for article 6

- Illustrative (assumptions, state them): 500 requests/s on a hot key; rebuild 200 ms; database pool of 20; lock TTL 5 s; TTL 300 s with jitter ±15, ±30, ±60 s; 10,000 keys; soft TTL 1 s and hard TTL 5 s for the stale demo; cold-start model sizes and exponents.
- Measured on this Redis, citable as measured: command behaviour in sections I, K, T, U; the count of rebuilds under each protection scheme in sections N and V (the database delay is `sleep`, so state "simulated database, real Redis"); mass-expiry `PING` latency in section M; `FLUSHALL` timings in section X; all on one macOS laptop with libc malloc.
- Models, not measurements: sections O, P, Q, Z, and the Little's-law predictions.
- Quoted from sources: 10x amplification and 300/3,000 numbers (HotOS), 17K/s to 1.3K/s (Facebook), e - 1/e (Vattani et al.).
- Suggested figures: (1) one hot key with a request stream and a rebuild bar, no protection, showing the pile-up; (2) the same with a lock, showing waiters; (3) the same with stale-while-revalidate; (4) a jitter slider on the synchronised-expiry plot (rebuilds per second vs time); (5) XFetch: probability-of-recompute curve vs time remaining, with a beta slider; (6) cold-start refill curve with a cap-on-rebuilds control.

### 6.9 Running examples for article 6

1. **Home-page "trending products" query**: one key, every visitor needs it, a 200 ms aggregate query, expires every minute (hot-key stampede).
2. **Deploy warms the cache with a fixed TTL**: ten thousand product pages written at once with `EX 300`, all expire together (synchronised expiry; jitter).
3. **Cache restart on Black Friday**: Redis restarts with persistence off at peak traffic; the empty cache sends full traffic to the database (cold start, HotOS arithmetic).

---

## Overlaps and gaps in the coverage map

1. **Article 5 "leases" and article 6 "rebuild lock" are one mechanism** (`SET K token NX PX`, token compare on completion; F5.23). Suggest: article 6 teaches the primitive and its hazards, article 5 introduces the lease idea (a token the delete cancels) with a forward link, or the reverse; whichever comes first must define the unique-token and compare-and-delete release. As written, article 5 (which comes first) needs `SET NX PX` and the token check before article 6 teaches them.
2. **Article 5 and 6 depend on atomic scripts that article 8 teaches.** Versioned compare-and-set (5), lease fill and lock release (5, 6) need `EVAL` or Redis 8.4+ `SET IFEQ`/`DELEX`. Plan says article 5 only "uses" it. Suggest the articles show the single 8.4+ commands and give the Lua script as the older form, with a forward link to article 8. Note "set only if newer" cannot be written with `IFEQ` (F5.19) and still needs `EVAL`.
3. **Terminology clash**: Facebook's "thundering herd" is heavy read+write on a key; the plan's heading "thundering herd" means many misses after expiry (F5.24). Define it in article 6; article 5 should cite the paper's meaning carefully.
4. **Jitter** is introduced in article 4 and measured in 6 (as planned); my section P figures can serve article 4's introduction too. **Stale-while-revalidate / soft expiry** in 6 overlaps with "refresh-ahead" in article 2's variations: decide which one owns the explanation. **Cold start / metastable failure** in 6 and article 11: keep 6 to one section with the HotOS example and link to 11.
5. **Gap: no article owns "a marker or lease that is part of correctness".** Markers and leases are cached keys whose eviction is not safe (F5.40, Nishtala §5). Mention in 5, and note for article 11 (eviction policy and `volatile-*` choices).
6. **Gap: delete cost for large tag sets** (F5.35) touches article 7 (`DEL` vs `UNLINK`, lazy free); article 5 can use `UNLINK` with a pointer.
7. **Gap: Valkey differences**: `DELIFEQ` instead of `DELEX` (9.0), `lazyfree` defaults `yes` in the dev branch config, `SET IFEQ` version unclear (F5.20, F5.35). Needed for article 11's "managed services and Valkey" note; mention only where a decision depends on it.
8. **Check before writing**: the active-expiry constants (F6.8) were read from the `unstable` branch; verify against the tag for Redis 8.10 if the article quotes numbers.
