# Research dossier, group A: introduction, caching-patterns, keys-and-values

Scope: coverage-map entries 1 to 3 in `plan.md`. Written for article writers; contains no article prose.

## How to read this file

Each fact has an ID, a status tag and a source. Status tags:

- **DOC**: stated in redis.io documentation (or another named primary document) fetched on 2026-10-27.
- **SRC**: read in the Redis (or Valkey) source at the named tag.
- **OBS**: observed by me on a real server. Exact commands and output are in `docs/article-work/caching-2026-10-27/evidence/research-A.txt` (cited as "evidence").
- **DER**: derived arithmetic, reproducible from the script appended to the evidence file.
- **PAPER**: stated in a primary paper I read.
- **UNCONFIRMED**: could not confirm. Do not state as fact.

Environment for every OBS item: Redis 8.10.3 (released 2026-10-26, `redis_git_sha1:00000000`, Homebrew build), macOS 25.6 arm64, `mem_allocator:libc` (not jemalloc), port 7201, `--save ''`. Absolute memory figures are specific to this build and are not typical of Linux/jemalloc. Relative comparisons (string versus hash, with versus without a TTL) are more portable than absolutes; say so in any article that quotes bytes.

Currently supported Redis lines: 7.2, 7.4, 8.2, 8.4, 8.6, 8.8, 8.10 (all had releases on 2026-10-26). Source: https://github.com/redis/redis/releases

### Hazards for writers (read first)

1. **Shared scratch space.** Sibling agents share `/private/tmp/claude-501/scratch`. Mid-run, a foreign `dump.rdb` (1,000,000 keys) appeared in my data directory and was loaded by my restarted server, which invalidated two early experiment runs (labelled in the evidence file). Use a private `mktemp -d` directory under a unique name, and never `cat` a shared `dir.txt`.
2. **JSON and Bloom commands are absent on this build.** `JSON.SET`, `JSON.GET`, `BF.RESERVE`, `BF.ADD`, `BF.EXISTS` return `unknown command`; `MODULE LIST` shows only `vectorset`. Redis announced it folded JSON and probabilistic types into core Redis 8 (https://redis.io/blog/agplv3/), but the Homebrew build here does not have them. Do not use them in anything a reader is meant to run against this install. [OBS]
3. **Redis docs contradict themselves on hash-field TTLs.** The memory-optimisation page still says hash fields "can't have an associated time to live" (https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/), but the hashes page and command pages document per-field TTLs since 7.4.0. The command pages and my observations are right.
4. **Redis FAQ memory figures are stale.** The FAQ says 1 million small string pairs use about 85 MB and 1 million 5-field hashes about 160 MB (https://redis.io/docs/latest/develop/get-started/faq/). On 8.10.3 (libc) I measured 60.3 MB and 90.8 MB (A-3.9). Do not quote the FAQ numbers.

---

## Article 1: Application caching with Redis (introduction)

### 1.1 Hit ratio, miss ratio and what Redis counts

- **A-1.1** Hit ratio h = hits / (hits + misses); miss ratio = 1 - h. [DER; definition also stated in Wikipedia "Cache (computing)": hit rate is the share of accesses that hit. https://en.wikipedia.org/wiki/Cache_(computing)]
- **A-1.2** `INFO stats` fields `keyspace_hits` and `keyspace_misses` are documented as "Number of successful lookup of keys in the main dictionary" and the failed counterpart. [DOC https://redis.io/docs/latest/commands/info/]
- **A-1.3** These counters count **every read-style key lookup, not only application cache reads**. After `CONFIG RESETSTAT` and `SET probe v`: `TTL probe` raised hits to 1, `EXISTS probe` to 2, `TYPE probe` to 3, `GET probe` to 4. `MGET probe nokey1 nokey2` added 1 hit and 2 misses (one per key). `SET probe v2 NX` on an existing key counted nothing. `GET nokey` and `HGET nohash f` each added a miss. [OBS, evidence "Does TTL/EXISTS/TYPE count toward keyspace_hits?"] Source cause: `lookupKey` increments the counters unless the flags include `LOOKUP_NOSTATS` or `LOOKUP_WRITE` (db.c lines 326 and 332 at tag 8.10.3), and `ttlGenericCommand` calls `lookupKeyReadWithFlags(..., LOOKUP_NOTOUCH)`, which does not suppress stats. [SRC https://github.com/redis/redis/blob/8.10.3/src/db.c, https://github.com/redis/redis/blob/8.10.3/src/expire.c]
- **A-1.4** Consequence for the article: the server-side ratio is a ratio over all lookups on that instance (monitoring tools, `TTL` checks, and so on included). The ratio that tells you about your cache is the one your application counts itself (a non-nil `GET` reply is a hit). Article 11 owns alerting; the introduction should say only that the figure exists and what it covers.
- **A-1.5** A key that has passed its expiry time counts as a miss. Observed: `SET session:abc 1 PX 300`, `GET` immediately returned `1`, `GET` after 0.5 s returned nil, giving `keyspace_hits:1 keyspace_misses:1 expired_keys:1 expired_keys_active:1`. The key was removed by the **active** expiry cycle before the second `GET`, so passive expiry was not what this run exercised. [OBS, evidence "key expires"]

### 1.2 Mean latency and database load as functions of hit ratio (derivation)

Cache-aside, one lookup per request. Let Lc be the cache read time, Ld the database read time, Ls the time to write the value back on a miss, R the request rate.

- **A-1.6** Every request pays Lc. A miss (probability 1 - h) also pays Ld + Ls. So:
  mean latency = Lc + (1 - h)(Ld + Ls). Ignoring Ls (small next to Ld): Lc + (1 - h) Ld.
  Database reads per second = R (1 - h). [DER, evidence model.py]
- **A-1.7** Table, illustrative inputs Lc = 1 ms, Ld = 20 ms, R = 1000 requests/s, Ls ignored [DER]:

  | h | mean latency | database reads/s |
  | --- | --- | --- |
  | 0 | 21.0 ms | 1000 |
  | 0.50 | 11.0 ms | 500 |
  | 0.80 | 5.0 ms | 200 |
  | 0.90 | 3.0 ms | 100 |
  | 0.95 | 2.0 ms | 50 |
  | 0.99 | 1.2 ms | 10 |
  | 0.999 | 1.02 ms | 1 |

- **A-1.8** Why the miss ratio sets database load: 95% to 99% cuts reads from 50 to 10 per second, a factor of exactly (1 - 0.95)/(1 - 0.99) = 5. 99% to 99.9% is another factor of 10. Mean latency moves from 2.0 to 1.2 ms, far less than the load change. The surprise worth showing: latency improves slowly while database load falls steeply. [DER]
- **A-1.9** Break-even: caching pays off in mean latency only if Lc + (1 - h)(Ld + Ls) < Ld, that is h > (Lc + Ls)/(Ld + Ls). With Lc = Ls = 1 ms and Ld = 20 ms that is h > 2/21, about 9.5%. A cache with a low hit ratio is slower than no cache. Azure makes the same qualitative point ("Most requests don't experience a cache hit ... overhead ... might outweigh the benefits"). [DER; DOC https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside]
- **A-1.10** Loss amplification, used to motivate the price of a cache: database load is R(1 - h) with the cache and R without it, a factor 1/(1 - h): 10x at h = 0.9, 20x at 0.95, 100x at 0.99. Bronson et al. state: "losing a cache with a 90% hit-rate causes a 10x query amplification", in a worked example where the database tolerates 300 queries per second and the application plus cache handles 3,000. [DER; PAPER Bronson, Aghayev, Charapko, Zhu, "Metastable Failures in Distributed Systems", HotOS '21, section 2.2 "Look-aside Cache". https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf]
- **A-1.11** Metastable failure, as defined by the paper: a trigger pushes an open system into a bad state that persists after the trigger is removed; goodput is unusably low and a **sustaining effect**, often work amplification, prevents recovery. In the look-aside cache example the cache stays empty because the application's timeout treats the slow queries as failed, so the cache is never filled. The paper adds that filling the cache should have priority over serving clients, "unenforceable with a look-aside cache but trivial with a read-through cache" (permissive database timeout inside the cache). Owned by articles 2 (read-through contrast), 11 (recovery); the introduction names it as a question only. [PAPER, same URL]

Illustrative versus measured: all latencies and rates above are illustrative. The only measured latency I have is loopback on one machine (A-1.20).

### 1.3 Locality, skew and the working set

- **A-1.12** Breslau, Cao, Fan, Phillips and Shenker (INFOCOM 1999) found that web requests seen by proxies follow a Zipf-like distribution: the probability of a request for the i-th most popular page is proportional to 1/i^alpha. Across their traces alpha ranged **from 0.64 to 0.83**. Their statement that "the 10/90 rule" does not hold: it took **25% to 40% of documents to draw 70% of accesses**. [PAPER, text extracted from http://www.cs.wisc.edu/~cao/papers/zipf-like.ps.gz; landing page https://pages.cs.wisc.edu/~cao/papers/zipf-implications.html]
- **A-1.13** The earlier technical report by the same authors (1998) reported alpha 0.57 to 0.67 for five large proxy traces, higher alpha for small or homogeneous user groups and lower for large populations. Cite the INFOCOM figures (0.64 to 0.83); mention the tech report only if needed. [PAPER https://pages.cs.wisc.edu/~cao/papers/zipf-implication/node2.html]
- **A-1.14** The same work reports the hit ratio of a cache is roughly proportional to the **logarithm of cache size** (observed in earlier studies, derived from the Zipf model in the report). For alpha = 1 the closed form is hit(C) = H(C)/H(N) with H(n) = ln n + 0.5772..., so hit(C) is about (ln C + 0.577)/(ln N + 0.577). Check: N = 1,000,000, C = 10,000 gives 9.79/14.40 = 68.0%, matching the computed 68.0%. [PAPER https://pages.cs.wisc.edu/~cao/papers/zipf-implication/node1.html (states the three properties, including hit ratio proportional to the log of cache size, and says the Zipf model explains them); the same report's section on infinite cache, finite request stream (node4.html) derives the log behaviour for request count, and I did not read its cache-size section; the closed form above is my own derivation and the check numbers come from my computation; DER]
- **A-1.15** Share of requests landing on the most popular items, Zipf-like with exponent s, N = 1,000,000 items [DER, evidence model.py]:

  | s | top 0.1% | top 1% | top 5% | top 10% | top 20% |
  | --- | --- | --- | --- | --- | --- |
  | 0.6 | 6.0% | 15.6% | 30.0% | 39.6% | 52.4% |
  | 0.8 | 20.7% | 36.2% | 52.3% | 60.9% | 70.8% |
  | 1.0 | 52.0% | 68.0% | 79.2% | 84.0% | 88.8% |
  | 1.2 | 82.2% | 91.0% | 95.1% | 96.5% | 97.7% |

  Calibration for the writer: the plan's wording "a cache holding a small fraction of items can serve most requests" is true only for alpha near 1 or above. At the proxy-trace alphas (0.64 to 0.83) the top 1% serves 15% to 40% and the top 20% serves roughly 55% to 75%. State the exponent in any figure and let the reader move it.
- **A-1.16** **UNCONFIRMED**: the Zipf exponent for application object caches (product pages, user profiles). The papers measure web proxies and Facebook's memcache, not your application. The article should tell readers to measure from their own access log (count requests per key, plot rank against frequency). Atikoglu et al. (SIGMETRICS 2012) analysed Facebook memcache and report a GET:SET ratio of 30:1, from the abstract as reported by a search snippet only; I did not read the paper. [secondary https://research.fb.com/publications/workload-analysis-of-a-large-scale-key-value-store/]
- **A-1.17** Real Redis, real eviction, Zipf traffic [OBS, evidence "Zipf run v4" and zipfrun2.py]. Setup: 100,000 items, 100-byte values, key-popularity Zipf with the exponent shown, 1,500,000 requests (first 940,000 warm-up while `maxmemory` was tuned until the held key count matched the target, last 560,000 measured), `maxmemory-policy allkeys-lru`, `maxmemory-samples 5`, Python raw-socket client on loopback, requests sent in pipelined batches of 100 (all `GET`s, then `SET` for the misses), seed 42. "Exact LRU" is a Python `OrderedDict` simulation on the same request sequence. "Ideal static top-C" is the hit ratio of permanently holding the C most popular items, the best any policy can do when requests are independent.

  | s | cache size (share of items) | Redis allkeys-lru | exact LRU | ideal static |
  | --- | --- | --- | --- | --- |
  | 1.0 | 1% (1,000 keys) | 47.3% | 50.6% | 61.9% |
  | 1.0 | 5% | 62.5% | 66.5% | 75.2% |
  | 1.0 | 10% | 70.2% | 73.7% | 81.0% |
  | 1.0 | 20% | 79.0% | 81.3% | 86.7% |
  | 0.8 | 1% | 19.1% | 20.4% | 34.0% |
  | 0.8 | 5% | 33.2% | 36.8% | 50.5% |
  | 0.8 | 10% | 42.9% | 46.8% | 59.5% |
  | 0.8 | 20% | 55.4% | 59.2% | 69.8% |

  Held key counts were within 0.3% of target. Observations: hit ratio rises slowly with size (doubling the cache from 10% to 20% adds about 9 to 12 points); Redis's sampled LRU sits 1.3 to 4.0 points under exact LRU; exact LRU sits 5 to 14 points under the ideal. An earlier pair of runs held the wrong number of keys (sizing from a noisy baseline, then a foreign dump file) and is discarded in the evidence file. Batching changes the model slightly (a miss is not filled until its batch ends). Ownership: the sampling mechanism is article 4's; article 1 may use this only as "what a real server did".
- **A-1.18** Working set: the set of items a workload touches within a window, the thing the cache must hold to hit. Denning (1968), "The working set model for program behavior", Communications of the ACM 11(5). **UNCONFIRMED**: cited from memory, not re-fetched. Check before citing.

### 1.4 Where Redis sits among other caches

- **A-1.19** PostgreSQL's `shared_buffers`: default "typically 128 megabytes", reasonable start "25% of the memory in your system" on a dedicated server with 1 GB or more. InnoDB buffer pool: "InnoDB caches table and index data as it is accessed", on dedicated servers "up to 80% of physical memory is often assigned", managed as a linked list of pages aged out by a variation of least recently used. So a database already caches pages; an application cache saves query execution, joins, connection handling and the network hop, and can hold computed results. [DOC https://www.postgresql.org/docs/current/runtime-config-resource.html ; https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool.html]
- **A-1.20** Cost of a Redis read versus the database, measured floor: single client, one request at a time, loopback, 100,000 requests: `SET` 9,771 requests/s with p50 0.095 ms; `GET` 10,488 requests/s with p50 0.087 ms (`redis-benchmark -t get,set -n 100000 -q -c 1 -P 1`). That is about 0.09 ms of round trip, mostly client and kernel overhead. A real network adds its round-trip time. The Redis benchmark docs warn that "naively iterating on synchronous Redis commands does not benchmark Redis itself, but rather measure your network ... and the client library intrinsic latency" and show a p50 of 0.143 ms for `SET` in their example. [OBS evidence "Loopback latency"; DOC https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/]
- **A-1.21** Browser and CDN caching: out of scope (HTTP caching). Name them only to place Redis. No fact needed.

### 1.5 What Redis is

- **A-1.22** Redis is "an in-memory but persistent on disk database ... very high write and read speed is achieved with the limitation of data sets that can't be larger than memory"; values are data structures with atomic operations rather than only strings. [DOC https://redis.io/docs/latest/develop/get-started/faq/]
- **A-1.23** Limits: up to 2^32 keys per instance, tested to at least 250 million; each hash, list, set and sorted set holds up to 2^32 elements; "your limit is likely the available memory". Maximum key size 512 MB; maximum string value 512 MB (`proto-max-bulk-len` default 536870912, observed via `CONFIG GET`). [DOC FAQ above; https://redis.io/docs/latest/develop/using-commands/keyspace/; OBS; SRC config.c line 3581 at 8.10.3]
- **A-1.24** Run as a separate server process the application reaches over the network: stated in the FAQ and benchmark docs ("Redis is a server, hence, all commands involve network round trips"). [DOC benchmarks page above]
- **A-1.25** Defaults on a fresh server: `maxmemory 0` (no limit), `maxmemory-policy noeviction`, `maxmemory-samples 5`, `hz 10`, `io-threads 1`, `lfu-log-factor 10`, `lfu-decay-time 1`. A Redis used as a cache with no `maxmemory` grows until the operating system intervenes; with `maxmemory` set and the default policy, writes fail. (Articles 4 and 7 own the details.) [OBS `CONFIG GET`; SRC config.c lines 3491, 3507 at 8.10.3]
- **A-1.26** Version and licence, needed because readers may be on different lines. 7.2 and earlier: BSD-3-Clause. 7.4.x to 7.8.x: RSALv2 or SSPLv1 at your option. 8.0 and later: tri-licence RSALv2 / SSPLv1 / AGPLv3 at your option. [SRC https://github.com/redis/redis/blob/8.10.3/README.md, lines 461 to 467] Redis announcement of AGPLv3 "starting with Redis 8". [DOC https://redis.io/blog/agplv3/] Valkey: BSD-licensed fork; Valkey tag 7.2.4 exists (the fork point). **UNCONFIRMED**: Linux Foundation hosting and exact fork date; not fetched. Say "Redis" throughout and note Valkey only where it changes a decision.

### 1.6 The basic read path (command semantics)

- **A-1.27** `SET key value EX seconds` sets value and expiry atomically. `EX 0` and negative values return `ERR invalid expire time in 'set' command`; `EX` together with `PX` returns `ERR syntax error`. [OBS evidence "SET EX 0"; DOC https://redis.io/docs/latest/commands/set/]
- **A-1.28** `SET` discards any existing TTL unless `KEEPTTL` is given ("Any previous time to live associated with the key is discarded on successful SET"). `KEEPTTL` since 6.0.0; `GET` option since 6.2.0; `EXAT`/`PXAT` since 6.2.0; `NX`/`XX` since 2.6.12. [DOC set page; OBS: `SET k1 v2 KEEPTTL` left TTL 100; plain `SET k1 v3` left TTL -1]
- **A-1.29** Do not write the TTL in a second command. Azure's own cache-aside sample calls `StringSetAsync` and then `KeyExpireAsync`. A client that dies between the two leaves a key with no expiry: observed `SET cart:1 v` then `TTL cart:1` returned -1. Use `SET ... EX`. [DOC Azure page; OBS]
- **A-1.30** `GET` returns nil for a missing key and for an expired key. Complexity O(1). `GETEX` (since 6.2.0, O(1)) reads and changes the TTL in one command. [DOC https://redis.io/docs/latest/commands/getex/; OBS `GETEX k1 EX 30`]
- **A-1.31** Expiry resolution is 1 ms; "Information about expires are replicated and persisted on disk"; Redis stores the absolute expiry time, so time passes while the server is stopped. `PEXPIRE`, `PTTL` give millisecond precision. [DOC https://redis.io/docs/latest/develop/using-commands/keyspace/]
- **A-1.32** Suggested key for the opening example: `product:42` with a JSON string value and `EX 60`. Observed: `OBJECT ENCODING` of a 38-byte JSON string is `embstr`. [OBS]

### 1.7 Scenarios for running examples (introduction)

1. **Product detail page in an online shop.** Read-heavy, changes rarely, a few best sellers get most views. Fits Zipf, fits article 12's worked example.
2. **Permissions and profile lookup on every API request.** Tiny values, very high request rate, shows why hit ratio and round trips matter.
3. **An expensive aggregate**, such as "top sellers this hour", costing hundreds of milliseconds in the database and recomputed for each visitor. Shows the cost-of-recompute motive.

Which numbers are illustrative: all latencies, request rates, database capacity, the 1 ms and 20 ms costs. Which are exact: the arithmetic in A-1.6 to A-1.10 and the Zipf coverage table (A-1.15), which are computed. Which are measured: A-1.3, A-1.5, A-1.17, A-1.20.

---

## Article 2: Caching patterns

### 2.1 Definitions and sources (terminology is not uniform)

- **A-2.1** Cache-aside (Azure's definition): the application tries the cache; on a miss it reads the data store, adds the item to the cache and returns it. On a write it writes the data store, then invalidates the cached item. "The order of the steps is important. Update the data store before removing the item from the cache": if the cache entry is removed first, a concurrent reader can miss, read the not-yet-updated row and put the stale value back. Azure also says the pattern "doesn't guarantee consistency" and recommends an expiry so entries do not stay stale. [DOC https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside]
- **A-2.2** Facebook's memcache is "a demand-filled look-aside cache": the web server asks memcache for key k; on a miss it reads the database and populates the cache; on a write it updates the database then sends a **delete** to memcache. "We choose to delete cached data instead of updating it because deletes are idempotent. Memcache is not the authoritative source of the data and is therefore allowed to evict cached data." (Paper figure 1.) [PAPER Nishtala et al., "Scaling Memcache at Facebook", NSDI '13. https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf]
- **A-2.3** Read-through (Oracle Coherence documentation): when the application asks the cache for key X and X is absent, the cache itself delegates to a "cache store" that loads X from the data source, places it in the cache and returns it. The application never talks to the database for reads. [DOC https://docs.oracle.com/en/middleware/standalone/coherence/14.1.1.2206/develop-applications/caching-data-sources.html]
- **A-2.4** Write-through (same source): the application's `put` into the cache does not return "until Coherence has gone through the cache store and successfully stored the data to the underlying data source". It "does not improve write performance at all". [DOC same]
- **A-2.5** Write-behind (same source): modified entries are written to the data source asynchronously "after a configured delay, whether after 10 seconds, 20 minutes, a day, a week or even longer". A queue holds pending writes; repeated updates to the same entry within the delay are **coalesced** and written once; several entries can be combined into one database transaction (write-combining). Deletes are removed synchronously. Requirements the source states: the database transactions "must never fail" or rollbacks must be handled; write-behind "may re-order database updates"; conflicts with other writers of the same database are handled "heuristically or escalated"; the cache becomes the system of record until the queue is flushed, so the business must accept "cluster-durable (rather than disk-durable)" storage. [DOC same]
- **A-2.6** Refresh-ahead (same source): when an entry is accessed after a configured fraction of its expiry time has passed, the cache returns the current value and starts an asynchronous reload; an access after expiry does a synchronous load. Worked example in the source: expiry 60 s, factor 0.5; an access between 30 and 60 s triggers a background reload; an access after 60 s waits. [DOC same]
- **A-2.7** Write-around and the hardware origin of write-through / write-back: write-through writes cache and backing store synchronously; write-back (write-behind) writes only the cache and updates the store later, when the dirty entry is evicted; write-around sends writes straight to the store without entering the cache and loads data into the cache only on read misses. [DOC https://en.wikipedia.org/wiki/Cache_(computing), "Write policies"]
- **A-2.8** **Terminology hazard.** "Write-through" means two different things in the sources. In Coherence the cache component writes the database on the application's behalf. In AWS's guide it is application code that writes the database and then sets the cache. Azure describes it as updating "the data store and the cache in the same write operation". Tell the reader which meaning the article uses at first use. AWS's pseudocode writes the database, then `cache.set(...)`. [DOC AWS https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html (the page returned the ElastiCache "Caching strategies" text); Azure; Oracle]
- **A-2.9** Open-source Redis ships none of read-through, write-through or write-behind as built-in behaviour: you implement them in application code or a library. **UNCONFIRMED as a statement of absence**: I found no such feature in the command table or docs, but I could not prove a negative; Redisson's map persistence documentation, which I expected to describe these modes, returned 404 and was not read. Redis's own "Redis Data Integration" (RDI) docs describe change-data-capture synchronisation of a Redis cache from a system-of-record database, and frame it as a Redis Enterprise / Redis Cloud feature, not open-source Redis. [DOC https://redis.io/docs/latest/integrate/redis-data-integration/] Writers should say "your application or a library does this" and not claim Redis lacks it for all editions.
- **A-2.10** Third-party blog results for "redis write-through write-behind" disagree on whether write-through updates the database first or the cache first, and whether write-behind is a variant of write-through. Treat the Coherence, Azure and AWS pages above as the definitions; do not cite blogs.

### 2.2 Cache-aside read path, write path and cold start

- **A-2.11** Costs of a miss: AWS counts three trips on a miss (read the cache, query the database, write the cache). Advantages it lists for lazy loading: only requested data is cached ("most data is never requested"), and a failed or replaced cache node is "not fatal": the application keeps working with higher latency while the node refills. Disadvantages: the miss penalty, and stale data. [DOC AWS page above]
- **A-2.12** Cold start: a freshly started or flushed Redis returns nil for every key, so database load is R at the first moment and falls as keys fill. Observed `GET user:7` on empty server: nil. The general amplification is 1/(1 - h) (A-1.10). Azure mentions "priming the cache" with likely-needed data at startup and says cache-aside stays useful when primed data expires. Stampede mechanics: article 6; operational warm-up: article 11. [OBS; DER; DOC Azure]
- **A-2.13** Delete versus update on write: Facebook's reason is idempotence (A-2.2). Azure invalidates on write. AWS's write-through sets the new value. Reason to prefer delete in the article (derived, not sourced): a delete cannot write an older value over a newer one, and the next read rebuilds from the source of truth. Race detail belongs to article 5.
- **A-2.14** **Writes that silently remove a TTL.** Observed on 8.10.3:
  - `SET user:7 <v>` with no option after `SET ... EX 300` leaves `TTL` -1. `SET ... KEEPTTL` keeps it (300).
  - `APPEND`, `SETRANGE`, `INCR`, `RENAME`, and `HSET` on an existing hash keep the key's TTL (`HSET h f2 v2` left TTL 100; `RENAME` carried the TTL to the new name).
  - `DEL` then `HSET` creates a key with TTL -1.
  [OBS evidence "Commands with a TTL"; DOC set page] Consequence for write-through via `SET`: always pass `EX` (or `KEEPTTL`), or the entry will never expire and becomes permanent.
- **A-2.15** `SET key value NX` returns nil and changes nothing if the key exists (useful for "populate only if absent"); `SET key value XX` returns nil if the key is absent; `SET ... GET` returns the old value (nil if there was none). Observed. [OBS; DOC set page]
- **A-2.16** Multi-key reads: `MGET` returns nil for each missing key, is O(N) in the number of keys, and counts a hit or miss per key. [OBS: `MGET a nokey b` gave 2 hits, 1 miss; DOC https://redis.io/docs/latest/commands/mget/] Round-trip cost: article 8.

### 2.3 Failure behaviour

- **A-2.17** Cache unreachable: a client gets an immediate error. Observed `redis-cli -p 7299 GET user:7` printed `Could not connect to Redis at 127.0.0.1:7299: Connection refused`. A slow or hung cache instead produces a timeout whose length the client sets (article 8). [OBS]
- **A-2.18** Policy used at Facebook: "Clients treat get errors as cache misses, but web servers will skip inserting entries into memcached after querying for data to avoid putting additional load on a possibly overloaded network or server." [PAPER Nishtala §3.1]
- **A-2.19** Read-through versus cache-aside under overload, from the metastable-failure paper: with a look-aside cache the application's own timeout abandons slow queries so the cache never refills; a read-through cache can keep a more permissive database timeout, finish the load and fill the cache even after the original request gave up (A-1.11). This is the strongest sourced argument for a difference between the two patterns in failure; use it in the "what changes for failure" section. [PAPER Bronson §2.2 and discussion]
- **A-2.20** Failure windows for each write path (derived, no source needed beyond definitions):
  - Cache-aside write: database commit succeeds, then the delete fails or the process dies. The cache stays stale until TTL or the next successful delete. A TTL is the safety net (Azure, AWS both recommend one).
  - Write-through (application writes both): database succeeds, cache write fails: same stale window. Cache first, database fails: cache holds a value the database never accepted. Order matters.
  - Write-behind: acknowledged write exists only in the queue; a cache restart loses it (A-2.22).
- **A-2.21** AWS's statement that with write-through "the data in the cache is never stale" holds only when writes are serialised through the one code path; two concurrent writers can leave the cache with the older of two values. That is article 5's subject; article 2 should not repeat AWS's claim unqualified. [DOC AWS page; DER]

### 2.4 Write-behind in Redis: durability and ordering

- **A-2.22** **Observed loss.** On a server with persistence off (`--save ''`, the configuration used in these tests), `LPUSH writebehind:orders` three items (`LLEN` 3), then a fourth, then `SHUTDOWN NOSAVE` and restart: `DBSIZE` 0, `LLEN` 0. Every acknowledged write that existed only in the queue was gone. A crash behaves the same way when the last snapshot or append-only-file sync is older than the write. Persistence settings are article 9's. [OBS evidence "Write-behind buffer"]
- **A-2.23** Counters are the natural write-behind case: `INCRBY hits:product:42 5`, `INCRBY ... 3`, then `GETDEL hits:product:42` returned 8 and removed the key atomically; a second `GETDEL` returned nil. A flusher can add the 8 to the database and lose no concurrent increments, because the read and the delete are one command. `GETDEL` since 6.2.0. `INCR` is O(1), creates the key at 0 if absent. [OBS; DOC https://redis.io/docs/latest/commands/getdel/ and the INCR page]
- **A-2.24** Ordering and coalescing, derived from Coherence's requirements (A-2.5): a Redis list used as a queue (`LPUSH` / `BRPOP`) preserves insertion order per queue but the database sees writes in the order the flusher issues them; coalescing means writing only the last value per key (the state, not the history). If history matters (an audit trail), write-behind of state is the wrong tool. [DER]
- **A-2.25** Refresh-ahead in plain Redis needs the remaining TTL: `TTL`/`PTTL` return the remaining time; `GETEX key EX n` can extend it on read. A refresh-ahead check on read is `PTTL` below a threshold, then trigger one background reload (single-flight, article 6). [DOC https://redis.io/docs/latest/commands/ttl/ ; A-1.30; DER]

### 2.5 Choosing a pattern from the workload

- **A-2.26** Read/write ratio evidence: Facebook's memcache saw a GET:SET ratio of 30:1 (abstract of Atikoglu et al.; secondary, see A-1.16). Caching earns more at high read:write ratios; at low ratios, invalidations cost more than hits save.
- **A-2.27** Derived model for the choice table. With read:write ratio k, hit ratio h and a delete on every write: database reads per write are about (1 - h)k, plus one write. Write-through also writes the cache on every write, wasting memory for items never read (AWS: "Cache churn: most data is never read"; mitigated by adding a TTL). [DER; DOC AWS]
- **A-2.28** Sensitive data: Azure says cache-aside "might not be suitable" when "the data is sensitive or security related" and the cache is shared; always retrieve from the primary source. Supports the article-12 point that the price used to charge a customer is read from the database. [DOC Azure]

### 2.6 Scenarios (caching-patterns)

1. **Product detail page**, cache-aside with delete-on-write: the base case.
2. **Page-view and "likes" counters**, write-behind with `INCR` and a periodic `GETDEL` flush: the case where losing a few seconds of counts is acceptable.
3. **User settings or basket**, read-your-own-write needed, write-through (application writes the database then sets the cache with `EX`), contrasted with the delete approach.
4. **Price used at checkout**: show why it is read from the database, not the cache (links to article 12).

Illustrative: all probabilities, latencies, queue delays. Measured: A-2.14 to A-2.17, A-2.22, A-2.23 are server behaviour and safe to state as observed on 8.10.3.

---

## Article 3: Cache keys and cached values

### 3.1 Key design

- **A-3.1** Redis keys are binary-safe, may be any byte sequence including the empty string, and have no namespaces; the colon is a convention (`person:1`, `office:NewYork:1`). Recommended: stick to a schema such as `object-type:id`; dots or dashes for multi-word fields. Maximum key size 512 MB. [DOC https://redis.io/docs/latest/develop/using-commands/keyspace/]
- **A-3.2** Key length advice from the docs: "a key of 1024 bytes is a bad idea not only memory-wise, but also because the lookup ... may require several costly key-comparisons"; hash a very long key (the docs suggest SHA1) and use the hash. Very short keys such as `u1000flw` are also "often not a good idea": readability beats the few bytes saved. [DOC keyspace page]
- **A-3.3** Key bytes count toward memory. On 8.10.3 `MEMORY USAGE` of key `k` holding the integer 1 is 20 bytes; the same value under a 40-character key is 68 bytes (+48). `hash:product:5` cost 7 bytes more than `plain:5` for an identical hash (147 against 140). [OBS evidence "MEMORY USAGE of keys" and "Hash-field TTL memory cost"]
- **A-3.4** `MEMORY USAGE` reports the key and value including administrative overhead; for nested types it **samples** (`SAMPLES`, default 5; `SAMPLES 0` samples all), so numbers for large aggregates are estimates. [DOC https://redis.io/docs/latest/commands/memory-usage/]
- **A-3.5** `SET` overwrites a key "regardless of its type"; reading with the wrong command returns `WRONGTYPE Operation against a key holding the wrong kind of value` (`HGET` on a string; `GET` on a hash). Observed. Consequence: when a deploy changes a value from string to hash, reuse of the same key name breaks readers of the other version; give each format its own key name or version prefix. [DOC set page; OBS evidence "GET on wrong type"]
- **A-3.6** Hash tags: braces in a key, `{...}`, make only that part count for the cluster hash slot, so related keys can be used in multi-key commands in Redis Cluster. Docs warn not to make a habit of it: too many keys in one slot harms balance. Owned by article 10; mention in one sentence. [DOC keyspace page]
- **A-3.7** Every input that changes the answer belongs in the key (locale, currency, user tier, permissions, query parameters, API version, representation). Not sourced; this is engineering reasoning, and the failure is a correctness and privacy bug (one user receives another's cached answer). Azure notes shared caches are inappropriate for sensitive data (A-2.28). Normalise before keying: sort query parameters, lower-case where the source treats case as equal, use canonical IDs, hash the normalised parameter string if it is long. [DER]
- **A-3.8** Namespace invalidation by pattern is expensive: `KEYS` "will block the Redis server until all keys are returned" and is "intended for debugging"; `SCAN` iterates incrementally but "only offer[s] limited guarantees about the returned elements" because the collection can change. Observed `redis-cli --scan --pattern 'catalog:v1:*'` over 2,100 keys returned the 2,000 matching keys; one `SCAN 0 MATCH ... COUNT 10` call returned 9 keys and a continuing cursor (COUNT is a hint). A version segment in the key avoids scanning: bump `catalog:v1:` to `catalog:v2:` and the old keys are never read but **still occupy memory** until TTL or eviction (the keyspace in that test held 2,100 keys, 2,000 under `v1` and 100 under `v2`; nothing removed the `v1` keys). [DOC keyspace page; OBS evidence "SCAN-based deletion"]
- **A-3.9** Rails separates the **cache key** from a **cache version** stored inside the entry: when a record is touched the version changes, old versions are ignored, and the entry is overwritten under the same key, "reduc[ing] the total cache size". The two options for versioning are therefore version-in-key (old keys linger) and version-in-value (compare on read, overwrite in place). [DOC https://guides.rubyonrails.org/caching_with_rails.html, "Russian Doll Caching"]
- **A-3.10** Schema changes across deploys (derived): during a rolling deploy both versions of the code run against the same Redis. If new code writes a value shape the old code cannot parse, old instances break; if old code reads new values it may mis-parse. A schema version in the key (`product:v3:42`) keeps both sets apart and costs a cold cache for the new namespace at deploy time (hit ratio near 0, article 6 stampede risk). A schema version inside the value lets code reject old entries as misses. [DER]

### 3.2 Granularity: what to cache

- **A-3.11** Granularity trade-off, framed from Facebook's paper: it caches both individual database rows and "pre-computed results from sophisticated machine learning algorithms" (generic cache), and web requests fan out to fetch "on average ... 24 keys per request", fetched in parallel batches. Small, reusable objects give high hit ratio and fine-grained invalidation but many round trips; large composed results save work but invalidate whenever any part changes. [PAPER Nishtala §2, §3]
- **A-3.12** Unsourced engineering points for the section: reuse (how many requests share the entry), invalidation fan-out (how many entries a single change affects), size (memory and transfer), and cost to recompute. Article 5 owns fan-out remedies.

### 3.3 Strings versus hashes

- **A-3.13** Encoding rules, defaults confirmed in source: a hash is stored as a **listpack** (a compact array) while it has at most `hash-max-listpack-entries` (default **512**) fields and every field and value is at most `hash-max-listpack-value` (default **64**) bytes; beyond either it converts to a hash table. Older name `hash-max-ziplist-*`, same defaults. Strings: `int` for integers, `embstr` up to 44 bytes (`OBJ_ENCODING_EMBSTR_SIZE_LIMIT 44`), `raw` above. [SRC https://github.com/redis/redis/blob/8.10.3/src/config.c lines 3593 and 3605; https://github.com/redis/redis/blob/8.10.3/src/object.c line 337 (`OBJ_ENCODING_EMBSTR_SIZE_LIMIT 44`); DOC memory-optimisation page]
- **A-3.14** Observed thresholds. A hash of 512 one-byte-value fields: `listpack`, `MEMORY USAGE` 4,526 bytes. Adding a 513th field: `hashtable`, **22,010 bytes** (4.9x). A field value of exactly 64 bytes: `listpack`; 65 bytes: `hashtable`. Conversion is one-way: after deleting down to 502 fields the hash stayed `hashtable`. A hash with a 2,000-byte value: `hashtable`, 2,221 bytes. Implication: one long text field (a product description) converts the whole hash to the larger encoding; keep long text in its own string key or accept the overhead. APPEND to a 44-byte string turned `embstr` into `raw`. [OBS evidence "Hash encoding conversion thresholds"]
- **A-3.15** Measured memory for one product with 8 fields (`id`, `name`, `price`, `currency`, `stock`, `brand`, `category`, `rating`), 1,000 products:
  - JSON string (122-byte value, encoding `raw`): `MEMORY USAGE` 160 bytes for product 5.
  - Hash (`listpack`): 147 bytes. Totals for 1,000 keys: strings 190,690 bytes (190.7 per key, key names and values vary in length), hashes 151,652 bytes (151.7).
  - Compact hash from `HIMPORT` (new in 8.10, encoding `template-listpack`): 93 bytes for product 5; 97,951 bytes total (98.0 per key).
  Relative result worth stating: for small objects a hash is somewhat smaller than the JSON string, and the 8.10 compact hash roughly halves memory against a plain hash. Absolute bytes are libc-specific. [OBS evidence "Memory: 1000 products" and "Compact hashes (8.10)"]
- **A-3.16** Compact hashes (Redis 8.10.0): `HIMPORT PREPARE <set> f1 f2 ...` declares an ordered field list for the **connection**; `HIMPORT SET key <set> v1 v2 ...` creates a hash from values only. The fieldset is lost when the connection closes or on `RESET`; each one-shot `redis-cli` call is its own connection, so my first attempt returned `ERR no such fieldset` and worked when both commands were sent on one connection. Docs: auto-conversion is off by default (`hash-min-template-entries 0`, observed); once compact, a hash stays compact for the key's life; poor fit when field names vary per key. `MEMORY USAGE` of a compact hash includes the key's share of the shared template. Advanced and new: at most one sentence in the article. [DOC https://redis.io/docs/latest/develop/data-types/hashes/ and https://redis.io/docs/latest/commands/himport/; OBS; SRC config.c lines 3594 to 3598]
- **A-3.17** Hash command costs: `HGET` O(1); `HSET` O(1) per field-value pair; `HMGET` O(N) in requested fields; `HGETALL` O(N) in hash size; `HINCRBY` O(1). Hash values are strings only; no nesting. `MGET` is O(N) in keys. [DOC hashes page; OBS `COMMAND DOCS`]
- **A-3.18** Partial reads and updates work as expected and are the reason to choose a hash for a field that changes alone (stock level): `HINCRBY product:42 stock -1` returned 16 and left the other fields alone; `HMGET` returned nil for an absent field. A string holding JSON must be read, parsed, changed and written whole (a read-modify-write that can race, article 8). [OBS; DER]
- **A-3.19** When a string is better: the value is always read whole, is already a serialised blob (compressed, protobuf), is larger than the listpack limits, or needs a key-level atomic replace. A hash cannot nest, so nested objects need flattening or serialising into a field. [DER; DOC hashes page]
- **A-3.20** Redis JSON (`JSON.SET key $.path`) allows partial update of nested documents where the JSON type is present. Not present on this build (hazard 2), so UNCONFIRMED by observation here; do not make it a recommendation the reader can't try. [OBS negative; DOC https://redis.io/blog/agplv3/]

### 3.4 Hash-field expiry

- **A-3.21** Versions. Redis **7.4.0**: `HEXPIRE`, `HPEXPIRE`, `HEXPIREAT`, `HPEXPIREAT`, `HEXPIRETIME`, `HPEXPIRETIME`, `HTTL`, `HPTTL`, `HPERSIST`. Redis **8.0.0**: `HGETEX`, `HSETEX`, `HGETDEL`. Valkey: `HEXPIRE` since **9.0.0**. [DOC https://redis.io/docs/latest/develop/data-types/hashes/ , https://redis.io/docs/latest/commands/hexpire/ , https://redis.io/docs/latest/commands/hgetex/ , https://redis.io/docs/latest/commands/hsetex/ ; DOC https://valkey.io/commands/hexpire/]
- **A-3.22** Syntax and replies: `HEXPIRE key seconds [NX|XX|GT|LT] FIELDS numfields field [field ...]`, O(N) in fields. Per-field reply: -2 no such field or key; 0 condition not met; 1 expiry set; 2 deleted because the TTL was 0 or in the past. `HTTL` replies -1 for a field with no TTL, -2 for no such field. `HPERSIST` replies 1 (TTL removed), -1 (no TTL), -2 (no field). `GT`/`LT` treat a persistent field as infinite. [DOC hexpire page; OBS evidence: `HTTL ... stock name nosuch` gave 60, -1, -2; `HEXPIRE product:42 0 FIELDS 1 name` gave 2; `HPERSIST p FIELDS 3 f nosuch f` gave -1, -2, -1; `HEXPIRE nokey 10 FIELDS 1 f` gave -2; `NX` on a field with TTL gave 0]
- **A-3.23** Semantics observed:
  - A field TTL does not touch the key's TTL: `TTL product:42` stayed -1 after `HEXPIRE`.
  - Key TTL and field TTLs coexist (`EXPIRE` on a hash with a field TTL returned 1).
  - An expired field disappears from `HGETALL` and `HGET`; activity was visible within 0.7 s of a 300 ms TTL (`expired_subkeys_active:2`).
  - **Overwriting a field with `HSET` clears its TTL** (`HTTL` -1 afterwards); `HINCRBY` keeps it (still 100). The docs say TTLs are cleared "only by commands that delete or overwrite" the field.
  - When the last field of a hash expires, **the key itself is removed** (`EXISTS` 0, empty keyspace) and it was not counted in `expired_keys` (0), only in `expired_subkeys` (2).
  - `HSETEX key [FNX|FXX] [EX|PX|EXAT|PXAT|KEEPTTL] FIELDS n f v ...`: `FNX` on an existing field returned 0; `FXX` returned 1; `KEEPTTL` kept 100 s. `HGETEX key [EX|PX|EXAT|PXAT|PERSIST] FIELDS n f` returns values and changes or removes the TTL (`PERSIST` made `HTTL` -1). `HGETDEL` returns the value and deletes the field.
  [OBS evidence "Article 3: hashes" and "Hash whose only fields all carry TTLs" and "HGETEX PERSIST"]
- **A-3.24** **Memory cost of a field TTL**: a hash with one field TTL used the `listpackex` encoding, 187 bytes against 140 bytes for the same hash without (+34%); a key-level TTL on the same hash cost 147 bytes (+7). `INFO keyspace` shows a `subexpiry=` count of hashes with field TTLs. So use field TTLs when the fields genuinely need different lifetimes, not by default. [OBS evidence "Hash-field TTL memory cost"]
- **A-3.25** What fits a cache: a product hash where `stock` is fresh for seconds while `name` is fresh for hours; session hashes with per-field timeouts. Without field TTLs the options are one TTL for the whole hash or separate keys. [DER; DOC hashes page lists session management and event tracking as uses]
- **A-3.26** `INFO stats` has `expired_subkeys` (hash field expiration events) separate from `expired_keys`. [DOC https://redis.io/docs/latest/commands/info/ lines for `expired_subkeys`; OBS]
- **A-3.27** **UNCONFIRMED**: the CPU cost of the active expiry cycle with very many field TTLs; not measured.

### 3.5 Serialisation and compression

- **A-3.28** Redis stores bytes and compares nothing about format: a zlib-compressed payload of 51 bytes (from 1,230 bytes of JSON) was stored with `SET`, `STRLEN` returned 51 and `OBJECT ENCODING` was `raw`. Redis does **not** compress values in memory: a 100,000-byte string of repeated `x` reported `MEMORY USAGE` 114,709 bytes, larger than the input. (The excess is probably libc rounding large allocations to 16 KiB pages: 114,688 + 21; explanation inferred, not verified.) `rdbcompression yes` (default) affects only the snapshot file. [OBS evidence "Binary-safe values", "MEMORY USAGE of keys"]
- **A-3.29** Measured serialisation and compression cost, Python 3.14.5, zlib 1.2.12, Apple arm64, 2,000 iterations (200 for the largest), a synthetic product document built from a 25-word vocabulary. **The vocabulary makes the data far more compressible than real text; treat ratios as upper bounds on benefit, and microsecond figures as order-of-magnitude on this machine.**

  | JSON size | zlib level 1 | zlib level 6 | zstd level 3 |
  | --- | --- | --- | --- |
  | 1,094 B | 470 B (43%), compress 7.7 us, decompress 2.3 us | 456 B (42%), 9.8 us, 2.4 us | 470 B (43%), 5.3 us, 2.8 us |
  | 4,173 B | 1,262 B (30%), 13.3 us, 4.3 us | 1,146 B (28%), 25.0 us, 3.8 us | 1,170 B (28%), 12.7 us, 5.2 us |
  | 31,757 B | 7,805 B (25%), 60.8 us, 21.0 us | 5,907 B (19%), 487.6 us, 14.7 us | 6,694 B (21%), 52.3 us, 26.1 us |
  | 309,235 B | 72,387 B (23%), 1,108 us, 190 us | 50,315 B (16%), 6,648 us, 111 us | 60,458 B (20%), 447 us, 216 us |

  `json.loads` of the same documents: 2.7 us, 7.3 us, 49.2 us, 493 us. Takeaways that follow from the table: below about 1 KB compression saves little in bytes and costs more CPU than it saves in network time; compression level 6 on a 31 KB value took roughly 8x as long as level 1 for a 25% smaller result; compression cost lands on application CPU, not on Redis. The `json.dumps` column in the script output is unreliable (it includes a `loads`); ignore it. [OBS evidence "compress.py output"]
- **A-3.30** Python's `pickle` documentation: "The pickle module is not secure. Only unpickle data you trust ... malicious pickle data ... will execute arbitrary code". A shared cache is a trust boundary: anyone who can write to Redis can make an application that unpickles cache values run code. Use a data-only format (JSON, MessagePack, protobuf) for cached values; Redis security hardening is article 11's. [DOC https://docs.python.org/3/library/pickle.html]
- **A-3.31** Facebook's memcache clients perform "serialization, compression, request routing, error handling, and request batching" client-side. Same division of work applies with Redis. [PAPER Nishtala §3]
- **A-3.32** **UNCONFIRMED**: relative size and speed of MessagePack, protobuf and other binary formats against JSON for cache payloads. I did not measure them (no library installed). The article may describe the trade-off qualitatively (smaller, faster, not human-readable, needs a schema) but should not give numbers.

### 3.6 Negative caching

- **A-3.33** Mechanics: `GET` of a missing key returns nil, which is indistinguishable from "never cached". To remember "not found", store a sentinel with a short TTL. Observed: `SET user:999 "" EX 30` then `GET user:999` printed an empty value, whereas `GET user:1000` (never set) was `(nil)` under `--no-raw`; a sentinel string `__NOTFOUND__` also round-trips. Application code must test for nil (miss) and for the sentinel (cached absence) separately. [OBS evidence "negative caching"]
- **A-3.34** Risk (derived): if the record is created after the negative entry is written, readers see "not found" until the TTL passes. Remedies: short TTL, and delete the negative entry on the create path. Related industry term: "cache penetration" (repeated requests for keys that never exist, each reaching the database). Mitigations: negative caching, or a Bloom filter in front (Redis 8 documents `BF.*`; absent on this build, hazard 2). [DER; DOC https://redis.io/blog/agplv3/ for the Bloom-in-core claim]
- **A-3.35** Azure's sample deliberately skips caching null ("Avoid caching a null value") and Facebook's paper does not discuss negative caching in the parts I read. So negative caching is a decision to argue for, not a given. [DOC Azure]

### 3.7 Big keys and big values

- **A-3.36** Size limits: a string value and a key can each reach 512 MB; `proto-max-bulk-len` default 536,870,912. [DOC keyspace page; OBS `CONFIG GET proto-max-bulk-len`; SRC config.c line 3581]
- **A-3.37** Transfer cost of a big value, observed on loopback with `redis-cli`: `SET` of a 20 MiB string took 27 ms wall clock, `GET` took 19 ms (20,971,520 bytes). These were not slow-logged at the 10 ms threshold. The relevant point is bandwidth: at 20 MiB per request and 100 requests/s a link must carry about 2 GB/s. A real network and a real client will be much slower than loopback. [OBS evidence "Large string value"; DER]
- **A-3.38** **Blocking by deleting a big aggregate**: a hash of 1,000,000 fields took **120,341 microseconds (120 ms)** to remove with `DEL` (shown in `SLOWLOG GET`, threshold 1 ms); `UNLINK` of an identical hash took 5 ms wall clock at the client and did not appear in the slow log; background freeing completed (`used_memory` fell back to 2.0 MB, `lazyfree_pending_objects:0`). During the `DEL` no other client was served. Memory: that hash used 52,166,467 bytes by `MEMORY USAGE`. [OBS evidence "Big keys: DEL vs UNLINK"]
- **A-3.39** Docs: `DEL` is O(N) in keys and, for an aggregate value, O(M) in its elements; deleting a string is O(1). `UNLINK` returns after "O(1) for each key removed regardless of its size" and reclaims memory in another thread. Defaults: `lazyfree-lazy-user-del no` (so plain `DEL` blocks) in Redis 7.4 and 8.10.3, and `lazyfree-lazy-eviction`, `-expire` and `-server-del` also `no`; Valkey changed all four to `yes` in 8.0.0 (Valkey 7.2.4 was `no`). Execution detail is article 7's. [DOC https://redis.io/docs/latest/commands/del/ , https://redis.io/docs/latest/commands/unlink/ ; SRC https://github.com/redis/redis/blob/8.10.3/src/config.c lines 3410 to 3413 and https://github.com/valkey-io/valkey/blob/8.0.0/src/config.c]
- **A-3.40** Finding them: `redis-cli --bigkeys` samples by element count; `--memkeys` by memory. Run on a mixed keyspace it listed the 5,000-field hash (263,395 bytes) as largest. `--bigkeys` scans with `SCAN`; run it against a replica or off-peak. [OBS evidence "--bigkeys and --memkeys"; DOC keyspace page for `SCAN` guidance]
- **A-3.41** Memory accounting for many small keys, measured: 1,000,000 string keys `key:N` -> `value:N` raised `used_memory` from 1.08 MB to 60.3 MB (about 62 bytes per key and value together); 1,000,000 hashes of 5 two-character fields: 90.8 MB (`listpack`). `mem_fragmentation_ratio` 1.21 and 1.17 here; not typical of Linux. [OBS evidence "Memory footprint check"; compare stale FAQ figures, hazard 4]
- **A-3.42** **UNCONFIRMED** (article 7 territory): exact cost model by which Redis's single command thread delays other clients when it reads or writes a large value. Observation only: `DEL` of the big hash blocked (A-3.38). Do not claim a general millisecond-per-megabyte rate.

### 3.8 Batched reads (mention only)

- **A-3.43** `MGET key [key ...]`: O(N) in keys, atomic in the sense of a single command, returns nil for missing keys, counts hits and misses per key. In Redis Cluster all keys must hash to the same slot, otherwise `CROSSSLOT` (article 10). Round-trip savings: article 8. [DOC https://redis.io/docs/latest/commands/mget/ ; OBS]

### 3.9 Scenarios (keys-and-values)

1. **Product object**: JSON string versus hash versus hash with field TTLs (`stock` short, `name` long). Good for a measured size figure and for the partial-update demonstration.
2. **Listing or search result keyed by filters**: `category`, `sort`, `page`, `locale`, `currency`, customer tier. Shows key normalisation and the "leaked another user's answer" failure when a variable is missing from the key.
3. **Rendered fragment per locale and per A/B variant**: shows value size, compression and invalidation fan-out.
4. **Lookups for unknown ids on login or SKU search**: negative caching and cache penetration.

Illustrative: the product fields, sizes, request rates, TTLs. Measured on 8.10.3 and quotable with the libc caveat: A-3.3, A-3.14, A-3.15, A-3.23, A-3.24, A-3.38. Measured but synthetic (hardware- and data-dependent): A-3.29.

---

## Gaps, overlaps and corrections to the coverage map

1. **Plan wording on skew needs a qualifier** (A-1.15): "a cache holding a small fraction of items can serve most requests" depends on the exponent; the best primary evidence (Breslau, alpha 0.64 to 0.83) needs 25% to 40% of items for 70% of requests.
2. **Overlap: big keys and `DEL` versus `UNLINK`.** Article 3 owns "why big values hurt"; article 7 owns `DEL` versus `UNLINK` and lazy freeing. I have measurements for both (A-3.38, A-3.39). Decide who uses them; article 3 needs only one sentence and a link.
3. **Overlap: TTL semantics.** `SET` removing a TTL, `KEEPTTL`, and TTL-clearing writes (A-1.28, A-2.14) appear in articles 1, 2, 3 and 4. Suggest article 4 owns the full table; article 1 states only that `SET ... EX` is atomic; article 2 states the write-through trap in one sentence.
4. **Overlap: negative caching** (article 3) and **race on a negative entry** (article 5): keep the race in 5.
5. **Gap: serialisation security.** Not in the coverage map; add one paragraph to article 3 (A-3.30).
6. **Gap: read-through versus cache-aside under overload** (A-1.11, A-2.19) is the strongest sourced difference between the patterns in failure, yet the plan's article 2 entry mentions failure only generically; article 11 owns metastable recovery. Add it to article 2's failure section.
7. **Gap: open-source Redis has no built-in read-through or write-through** (A-2.9, UNCONFIRMED as an absence). Article 2 must say where such behaviour lives (application code, a library, a cache-aware framework).
8. **Gap: hit ratio from `INFO` counts every lookup** (A-1.3). Belongs in article 11's monitoring section; article 1 should avoid implying the server counter is the application's hit ratio.
9. **Gap: compact hashes (8.10)** and **`HGETEX`/`HSETEX`/`HGETDEL` (8.0)** are newer than the plan's "7.4+". Mention the versions precisely (A-3.16, A-3.21).
10. **Hazard: `SET ... IFEQ` / `IFNE` / `IFDEQ` / `IFDNE` (Redis 8.4.0)** gives native compare-and-set for versioned values (observed: `SET v:1 new IFEQ old` succeeded, a second `IFEQ old` returned nil, `IFEQ` on a missing key did not create it). Articles 5 and 8 plan WATCH and Lua for the compare-and-set; writers should know a single command now exists from 8.4. The set page also references `DIGEST` and `DELEX` commands (versions not checked). [DOC https://redis.io/docs/latest/commands/set/ ; OBS evidence "SET IFEQ"]

## Counts

Numbered facts: 103 (A-1.1 to A-1.32, A-2.1 to A-2.28, A-3.1 to A-3.43), plus 4 reader hazards and 10 map notes. Wholly or partly UNCONFIRMED: A-1.16, A-1.18, A-1.26 (Linux Foundation and fork-date detail), A-2.9 (absence claim), A-3.20, A-3.27, A-3.28 (page-rounding explanation only), A-3.32, A-3.42.
