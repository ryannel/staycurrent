# Research dossier F: operating a cache and designing a cache (articles 11 and 12)

Prepared 2026-10-27 for the writers of `operating-a-cache` and `designing-a-cache`.
Raw command transcripts and the scripts behind every observed number are in
`docs/article-work/caching-2026-10-27/evidence/research-F.txt`; entries below cite
them as E1, E2 and so on.

## How to read this

Each fact has an identifier, a tag and a source.

- **[OBS]** observed on a real server: Redis 8.10.3, macOS arm64, libc malloc (not
  jemalloc), port 7206, loopback. The evidence entry is named.
- **[DOC]** stated in Redis documentation, `redis.conf` or the Redis source. Source
  URL given. Source files were read from `unstable` unless a tag is named.
- **[PAPER]** stated in a primary paper or book chapter.
- **[MODEL]** computed by me from a stated model; script in the evidence file. A model
  is not a measurement of Redis.
- **[JUDGEMENT]** my recommendation, not a sourced fact. Writers may adopt it but
  should not cite it as established.
- **UNCONFIRMED** could not be verified. Do not state as fact.

Caveats that apply everywhere:

- This macOS build uses libc malloc. Memory ratios here (E4, E9) are not typical of a
  Linux server with jemalloc. Per-key byte counts are close to what a Linux build
  reports for the same data, but fragmentation is not.
- The machine is a fast laptop-class arm64 Mac over loopback. Throughput and latency
  numbers show shape, not capacity. Do not quote them as Redis performance.
- The server was started with no config file, so E1 lists compiled-in defaults. The
  shipped `redis.conf` differs in places (noted where it matters).
- Redis versions: observed 8.10.3. The documentation fetched describes 8.10 (it
  lists fields "added in Redis 8.10"). Where a feature has an earlier version, it is
  named.

---

# Article 11: `operating-a-cache`

## 11.1 The cache as a load-bearing dependency

**What the database sees when the hit ratio changes.** The database receives only
the misses.

- **F11.1** [MODEL, arithmetic] Database reads per second = read requests per second
  x miss ratio. With hit ratio h, losing the whole cache multiplies database read
  load by 1/(1-h): h = 0.8 gives x5, 0.9 gives x10, 0.95 gives x20, 0.99 gives x100,
  0.999 gives x1000. Moving from 95% to 99% hit ratio cuts database reads fivefold
  (5% to 1% misses). Output of `arith.py`, E23.
- **F11.2** [MODEL] A database that can serve C queries per second survives an offered
  read load of at most R_max = C / (1-h) with a warm cache, but only R <= C with an
  empty one. For C = 300/s: h = 0.9 gives R_max 3,000/s; h = 0.99 gives 30,000/s.
  E23. This reproduces the worked example in Bronson et al. (F11.3).
- **F11.3** [PAPER] Bronson, Aghayev, Charapko, Zhu, "Metastable Failures in
  Distributed Systems", HotOS '21 (31 May to 2 June 2021, Ann Arbor), DOI
  10.1145/3458336.3465286. Section 2.2 "Look-aside Cache": a database answers in
  under 100 ms below 300 queries per second and about ten times slower above. With a
  90% hit rate the application handles 3,000 QPS "because only 1 out of 10 user
  requests result in a database query", but "loads above 300 QPS are in the
  vulnerable state". If the cache contents are lost, the database is overloaded, the
  application's timeout makes the queries count as failed, the cache is never
  refilled, and the system is trapped. Quote: "losing a cache with a 90% hit-rate
  causes a 10x query amplification." Local copy of the text read via `pdftotext`.
  URL: https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf
- **F11.4** [PAPER] Same paper, section 1 and Figure 1: a system moves from a *stable*
  state to a *vulnerable* state (healthy, but one trigger away from failure) and, after
  a *trigger*, into a *metastable* state sustained by a feedback loop (a "sustaining
  effect") that persists after the trigger is removed. The authors treat the
  sustaining loop, not the trigger, as the root cause: "There are many triggers that
  can lead to the same failure state, so addressing the sustaining effect is much more
  likely to prevent future outages." Many systems run in the vulnerable state on
  purpose "for efficiency reasons".
- **F11.5** [PAPER] Same paper, section 3 ("Organizational Incentives"): "an improved
  cache eviction algorithm will reduce average database load, which makes it seem
  desirable to reclaim database resources ... a false economy if the system can no
  longer recover from cache loss." Incentivise "application changes that reduce cold
  cache misses".
- **F11.6** [PAPER] Same paper, section 3: a read-through cache can keep filling after
  the client gives up. Quote: "filling the cache should have a higher priority than
  serving the clients. This prioritization is unenforceable with a look-aside cache
  but trivial with a read-through cache. A read-through cache can have a permissive
  timeout for database queries; although the web application will give up on the
  request, the cache will still be filled." Useful for the cache-aside versus
  read-through trade-off under failure.
- **F11.7** [PAPER] Beyer, Jones, Petoff, Murphy (eds.), *Site Reliability
  Engineering*, chapter 22 "Addressing Cascading Failures", section "Cold caching":
  distinguishes a **latency cache** (service sustains its expected load with an empty
  cache) from a **capacity cache** ("a service using a capacity cache cannot sustain
  its expected load under an empty cache"). Quote: "Sometimes caches are added to a
  service to improve performance, but actually wind up being hard dependencies."
  Cold-cache triggers listed: new cluster, cluster returned from maintenance,
  restarts. Remedies: overprovision, general cascading-failure prevention, and "When
  adding load to a cluster, slowly increase the load." Same chapter, "Reduction in
  cache hit rates": reduced RAM lowers hit rate and sends more RPCs to backends.
  URL: https://sre.google/sre-book/addressing-cascading-failures/
- **F11.8** [PAPER] Nishtala et al., "Scaling Memcache at Facebook", NSDI '13, pages
  385-398. Section 3.3 (Gutter): when a few memcached servers fail, load on the
  backing store rises; Facebook dedicates a pool about 1% of the servers in a
  cluster; a client that gets no answer retries against Gutter, fills it after
  querying the database, and Gutter entries "expire quickly". Reported: the system
  "reduces the rate of client-visible failures by 99% and converts 10%-25% of
  failures into hits each day"; after a full memcached server failure, Gutter hit
  rates "generally exceed 35% in under 4 minutes and often approach 50%". They reject
  rehashing keys onto surviving servers because "a single key can account for 20% of
  a server's requests". URL:
  https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf

**Scenario numbers to use** (all [MODEL], E22): offered load 2,000 requests/s, database
capacity 300 queries/s, one-second client timeout, item popularity Zipf with exponent
1.0 over 100,000 items, cache holds every item once filled. After 120 s of traffic
the warm hit ratio is 0.898 and the database sees about 204 queries/s, which looks
safe (68% of capacity). Losing the cache then gives these results (hit ratio of
admitted traffic at selected seconds after the loss):

| second | no protection | retry once | shed misses | gradual ramp, no shedding |
| --- | --- | --- | --- | --- |
| 1 | 0.28 | 0.28 | 0.27 | 0.18 |
| 10 | 0.39 | 0.39 | 0.60 | 0.53 |
| 60 | 0.39 | 0.39 | 0.79 | 0.73 |
| 120 | 0.39 | 0.39 | 0.88 | 0.85 |
| 240 | 0.40 | 0.40 | 0.93 | 0.92 |

- **F11.9** [MODEL] Without protection the database queue grows until every answer
  arrives after the timeout, no fill ever succeeds, and the hit ratio stays near 0.4
  for the remaining 300 s of the run. With one retry the queue is saturated by 3 s instead of about 10 s and the database sees up to 2,562 queries in one second
  against a capacity of 300. With the application refusing misses it could not answer
  within the timeout (queue-delay admission control), the database stays busy but
  useful and the hit ratio climbs: 0.79 at 60 s, 0.86 at 90 s, 0.88 at 120 s. Database
  load falls back under capacity (300/s) once the hit ratio passes 1 - 300/2000 =
  0.85, about 90 s in. Routing only 5% of traffic to the cold application at first
  and ramping to 100% by about 140 s (admit fraction 0.05 + t/150) also recovers (hit ratio 0.85 at 120 s) with no
  shedding at all. These are illustrative: the model has a single FIFO database
  server, no cancellation of timed-out queries, and a cache that never evicts. Say so
  in the caption. Script `metastable.py`, E22.

## 11.2 Graceful degradation: timeouts, retries, circuit breakers, load shedding

- **F11.10** [PAPER] SRE book, chapter 22, "Retries": "Consider having a server-wide
  retry budget. For example, only allow 60 retries per minute in a process, and if the
  retry budget is exceeded, don't retry; just fail the request." Also: retries at
  several layers multiply: "If the database can't service requests because it's
  overloaded, and the backend, frontend, and JavaScript layers all issue 3 retries (4
  attempts), then a single user action may create 64 attempts (4^3) on the database."
  URL as F11.7. 4^3 = 64 checked in E23.
- **F11.11** [PAPER] SRE book, chapter 21 "Handling Overload", "Deciding to Retry": a
  per-request retry budget of up to three attempts; a per-client retry budget:
  "A request will only be retried as long as this ratio [of retries to requests] is
  below 10%." Also **adaptive throttling**: each client keeps requests and accepts
  over the last two minutes and rejects locally with a probability that grows once
  requests exceed K times accepts; the page text says K is a tunable multiplier ("Reducing
  the multiplier will make adaptive throttling behave more aggressively"). The
  numeric formula max(0, (requests - K x accepts) / (requests + 1)) with K = 2 is an
  image on the page and is **UNCONFIRMED** here (I know it from memory of the
  book). URL: https://sre.google/sre-book/handling-overload/
- **F11.12** [PAPER] SRE book chapter 22, "Load Shedding and Graceful Degradation":
  load shedding "drops some proportion of load by dropping traffic as the server
  approaches overload conditions"; graceful degradation "takes the concept of load
  shedding one step further by reducing the amount of work that needs to be
  performed", for example serving lower-quality, cheaper-to-compute results. Warning
  that degraded modes are rarely exercised: "the code path you never use is the code
  path that (often) doesn't work." URL as F11.7.
- **F11.13** [PAPER] Bronson et al. section 3 ("Change of Policy during Overload"):
  disable failover and retries or set a retry budget, switch to LIFO scheduling,
  reduce queue sizes, enforce priorities, "shed load by rejecting a fraction of
  requests or clients, or even use the Circuit Breaker pattern to block all
  requests". Notes that detecting persistent overload versus a spike is hard; they use
  minimum queueing latency over a sliding window as in CoDel.
- **F11.14** [DOC] Circuit breaker: Michael Nygard popularised the pattern in
  *Release It!*; a wrapper counts failures and, once they reach a threshold, "the
  circuit breaker trips" and further calls return without calling the dependency;
  after a timeout a trial call is allowed. Martin Fowler's description names the
  states closed, open and half-open. URL:
  https://martinfowler.com/bliki/CircuitBreaker.html
- **F11.15** [OBS] A client that is refused or too slow sees these Redis-side errors
  (E3, E11, E20). Under `noeviction` at the memory limit: `OOM command not allowed
  when used memory > 'maxmemory'.` (counted in `errorstat_OOM`). Above `maxclients`:
  `ERR max number of clients reached`. During startup load: `-LOADING Redis is
  loading the dataset in memory` (about 0.85 s for 1,000,000 keys). A client's
  degradation logic should distinguish these from timeouts.
- **F11.16** [DOC] The `timeout` setting closes idle client connections and is 0
  (never) by default; it does not apply to Pub/Sub clients. `tcp-keepalive` default
  300 s. URL: https://redis.io/docs/latest/develop/reference/clients/
- **F11.17** UNCONFIRMED. Default command timeouts differ by client library and I did
  not survey them. Write "set an explicit timeout in your client" without quoting a
  default. Round-trip cost context (owned by article 8): redis.io says a 1 Gbit/s
  network round trip is about 200 us and a Unix socket can be as low as 30 us
  ([DOC] https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/).
- **F11.18** [JUDGEMENT] A reasonable degradation ladder for a cache outage: (1) a
  short timeout on the cache call so a dead cache costs milliseconds; (2) a per-process
  bound on concurrent database fallbacks, sized to database capacity minus normal
  traffic; (3) shed or serve stale or cheaper data for requests beyond the bound; (4) a
  circuit breaker that stops calling a cache that is clearly down so every request
  does not pay the timeout. Tie each rung to F11.9: the ladder is what turns the "no
  protection" column into the "shed" column.

## 11.3 Warming a cold cache and controlled restarts

- **F11.19** [OBS] Restarting from an RDB file restores the cache but is not free (E9d,
  E20): 1,000,000 keys with 200-byte values: `SAVE` took 547 ms; the restarted server
  logged `DB loaded from disk: 0.870 seconds` (0.887 s on an earlier run); during
  that load every command got `-LOADING`, and in a probe at 5 ms intervals the first
  successful `GET` came 0.87 s after launch. Caution: the values were highly
  compressible (the RDB was 22.9 MB for roughly 270 MB in memory); real data loads
  more slowly per byte. Loading is on one thread.
- **F11.20** [OBS] Refilling a flushed cache from the application is limited by the
  database, not Redis: Redis accepted 1,000,000 pipelined `SET`s of 200 bytes in 2.36
  s total on one connection (E9). The lower bound to refill N items from a database
  with S spare queries per second is N / S: 100,000 items at 100 spare queries per
  second is 1,000 s, about 17 minutes ([MODEL], E23).
- **F11.21** [OBS] `FLUSHALL` on 1,000,000 keys blocked for 275.8 ms (synchronous) and
  `FLUSHALL ASYNC` returned in 0.2 ms with `lazyfree_pending_objects:1000000`,
  emptied within about a second (E9c). `lazyfree-lazy-user-flush` defaults to `no`, so
  a bare `FLUSHALL` is synchronous in Redis 8.10.3. Valkey 8.0 ships these lazyfree
  settings as `yes` (F11.65). An operator "flush the cache" is itself an incident.
- **F11.22** [DOC] A restarted or promoted master with an empty dataset wipes its
  replicas: "if a master restarts with an empty data set, replicas will be wiped as
  well", so "either your master has persistence enabled, or ... it does not
  automatically restart on crashes". URL:
  https://redis.io/docs/latest/operate/oss_and_stack/management/admin/ (ownership of
  replication: article 9).
- **F11.23** [DOC] Replacing an instance without downtime: start the new instance as a
  replica, wait for sync, compare key counts with `INFO`, make it writable, repoint
  clients (optionally `CLIENT PAUSE` so no client writes to the old master), then
  `REPLICAOF NO ONE`. With Sentinel or Cluster, upgrade replicas one at a time, then
  fail over. The new instance arrives warm. Same URL as F11.22.
- **F11.24** [PAPER] Nishtala et al. section 4.3 "Cold Cluster Warmup": a new, failed
  or maintained cluster has an empty cache; clients in the cold cluster read from a
  warm cluster instead of the database. "With this system cold clusters can be brought
  back to full capacity in a few hours instead of a few days." The race: a delete in
  the cold cluster could be followed by a read of a stale value from the warm cluster.
  Mitigation: memcached deletes carry a non-zero hold-off, "all deletes to the cold
  cluster are issued with a two second hold-off", during which adds are rejected, and
  a failed add tells the client to refetch from the database. They say "there is
  still a theoretical possibility that deletes get delayed more than two seconds". Turned
  off once the hit rate stabilises. Same URL as F11.8.
- **F11.25** [PAPER] Nishtala et al. section 3.2.1 (Leases): to stop thundering herds,
  "we configure these servers to return a token only once every 10 seconds per key";
  other requests are told to wait briefly. Their measurement over a week for keys prone
  to herds: peak database query rate 17K/s without leases, 1.3K/s with them. This is the
  cache-side cousin of a rebuild lock (article 6) and the reason cold-start stampedes
  matter to operators.
- **F11.26** [PAPER] SRE book chapter 22: for cold caches, ramp traffic slowly so "the
  initially small request rate warms up the cache; once the cache is warm, more traffic
  can be added", and keep standby clusters' caches warm with nominal load. Moving the
  cache out of the server process (to a shared memcache or Redis) means restarts of the
  application stop emptying it, "albeit at the cost of introducing another RPC".
- **F11.27** [JUDGEMENT] Warm-up options in order of preference: keep it from emptying
  (replica promotion, persistence for restarts); ramp traffic (E22 shows a 5% start
  recovering with no shedding); replay the hottest keys from a recorded key list
  (needs the database to have spare capacity: F11.20); never open the doors at full
  traffic.

## 11.4 Monitoring: which INFO fields, what they mean, what to alert on

All field definitions from https://redis.io/docs/latest/commands/info/ (documents
8.10). "Section" is the `INFO <section>` argument.

- **F11.28** [DOC][OBS] **Hit ratio.** `keyspace_hits` and `keyspace_misses` (section
  `stats`) are the "Number of successful/failed lookup of keys in the main dictionary".
  The documented hit-ratio formula is `keyspace_hits / (keyspace_hits +
  keyspace_misses)`; the eviction page adds that an `EXISTS` on an absent key is
  counted as a miss. URL: https://redis.io/docs/latest/develop/reference/eviction/ .
  Observed on 8.10.3 (E2): counted are read lookups: `GET`, `MGET` (once per key),
  `EXISTS`, `TTL`, `TYPE`, `STRLEN`, `GETEX`, `GETDEL`, `SET ... GET`, `HGET`,
  `HGETALL`, `HEXISTS`, `SISMEMBER`, `LRANGE`, and `GET` called inside `EVAL`. For
  hash commands the lookup is of the key, not the field: `HGET h g` where `h` exists
  but field `g` does not counts as a hit. Not counted: plain `SET`, `SET NX/XX`,
  `INCR`, `APPEND`, `DEL`, `UNLINK`, `EXPIRE`, `SCAN`. A lookup of an expired key
  counts as a miss.
- **F11.29** [OBS] The counters are cumulative since server start or `CONFIG
  RESETSTAT`. A dashboard must use deltas over a window: hit ratio over the last
  minute = delta hits / (delta hits + delta misses). A lifetime ratio hides a drop
  after a long healthy period. `INFO commandstats` gives calls per command but not
  hits (E2).
- **F11.30** [JUDGEMENT] Limits of the server-wide ratio: it mixes every client and
  key namespace; it counts a cached "not found" marker (negative caching) as a hit; it
  cannot see in-process near-cache hits (article 10); a reader hitting a replica
  counts on the replica. An application-level ratio per key namespace (for example
  `product:`, `price:`, `session:`) is what you can act on. Say the server figure is
  the cheap first signal.
- **F11.31** [DOC] `evicted_keys`: "Number of evicted keys due to `maxmemory` limit";
  `expired_keys`: total key expiration events; `evicted_clients` (Redis 7.0): clients
  evicted for `maxmemory-clients`; `evicted_scripts` (Redis 7.4); `total_eviction_exceeded_time`:
  total ms `used_memory` was above `maxmemory`; `current_eviction_exceeded_time`: ms
  since it last rose above. The eviction page explains using them: low hit ratio with
  high `evicted_keys` points to the wrong policy or too little memory; low
  `evicted_keys` with high `expired_keys` points to a TTL that is too short.
- **F11.32** [OBS] Observed evictions (E8): `allkeys-lru`, `maxmemory 8mb`, 100,000
  writes of 200-byte values: `used_memory` stayed at 8,388,560 (cap 8,388,608); 27,053
  keys remained; `evicted_keys` 73,135 (writes kept succeeding). Eviction happens before
  a command that needs memory, so memory can briefly exceed the cap.
- **F11.33** [OBS] A value larger than the cache (E8b): a 30 MiB `SET` into a 10 MiB
  `maxmemory` returned `+OK`, memory rose above the cap, `total_eviction_exceeded_time`
  recorded 2 ms, and afterwards `GET big` was empty, `DBSIZE` had fallen from 27,053 to 21,512,
  `evicted_keys` had risen by 5,354 and `used_memory_human` read 6.65M, so the oversized
  value did not survive. The docs say a command that adds a lot of data "might
  temporarily exceed the limit by a large amount" (eviction page). Large writes are
  therefore an eviction storm, not an error.
- **F11.34** [DOC] Memory section: `used_memory` (what Redis allocated),
  `used_memory_rss` (what the operating system reports), `used_memory_dataset`,
  `used_memory_overhead`, `maxmemory`, `maxmemory_policy`, `mem_fragmentation_ratio`
  ("Ratio between `used_memory_rss` and `used_memory`" and it "doesn't only include
  fragmentation"), `mem_fragmentation_bytes`, `allocator_frag_ratio` ("the true
  (external) fragmentation metric"), `mem_not_counted_for_evict` ("transient replica and
  AOF buffers"), `mem_clients_normal`, `mem_replication_backlog`,
  `mem_total_replication_buffers` (7.0), `mem_aof_buffer`,
  `mem_overhead_db_hashtable_rehashing` (7.4). The page's own caution: when the
  fragmentation bytes are only a few megabytes "a high ratio (e.g. 1.5 and above) is
  not an indication of an issue". Reading rule from the page: rss much greater than used
  suggests fragmentation; used much greater than rss means the operating system has
  swapped part of Redis out, "expect some significant latencies".
- **F11.35** [OBS] On this libc build `mem_fragmentation_ratio` was 5.4-6.6 on an
  empty server (RSS 5-6 MB against 1 MB used, meaningless at that size), 1.22 with
  100,000 keys and 1.06 with 1,000,000 keys (E3, E4, E9). A writer must not present these
  as typical; the point is "small servers give silly ratios".
- **F11.36** [DOC] Clients section: `connected_clients`, `blocked_clients`,
  `maxclients`; stats: `total_connections_received`, `rejected_connections` ("rejected
  because of `maxclients` limit"), `instantaneous_ops_per_sec`, `total_net_input_bytes`,
  `total_net_output_bytes`, `instantaneous_input_kbps`, `instantaneous_output_kbps`,
  `total_error_replies`. `errorstats` section counts errors by prefix (for example
  `OOM`). Observed: with `maxclients 5`, connections 6 to 8 each received `-ERR max
  number of clients reached` and `rejected_connections` read 3 (E11).
  `maxclients` defaults to 10,000 and is capped by the file-descriptor limit minus 32
  (https://redis.io/docs/latest/develop/reference/clients/).
- **F11.37** [DOC] Persistence and replication fields to watch even for a cache that does
  not persist: `latest_fork_usec` ("Duration of the latest fork operation in
  microseconds"), `rdb_last_bgsave_status`; on a replica `master_link_status`,
  `master_last_io_seconds_ago`, `slave_repl_offset`; on a master `master_repl_offset`
  and one `slaveN:` line per replica with "id, IP address, port, state, offset, lag".
  Replication lag in bytes is master_repl_offset minus a replica's offset. (Replication
  semantics: article 9.)
- **F11.38** [DOC][OBS] `INFO commandstats` gives `calls`, `usec`, `usec_per_call`,
  `rejected_calls`, `failed_calls`, and from Redis 8.8 `slowlog_count`,
  `slowlog_time_ms_sum`, `slowlog_time_ms_max`. `INFO latencystats` gives
  per-command latency percentiles p50, p99, p99.9 by default (`latency-tracking yes`,
  `latency-tracking-info-percentiles "50 99 99.9"`). These measure server execution
  time only, not network or queueing. On my machine `latencystats` for `GET` read
  `p50=0.001` microseconds after a restart, which looks like a clock-resolution
  artefact; do not show it (E15).
- **F11.39** [DOC] Slow log: "The execution time does not include I/O operations like
  talking with the client, sending the reply and so forth, but just the time needed to
  actually execute the command". Defaults observed: `slowlog-log-slower-than 10000`
  (microseconds), `slowlog-max-len 128`; entries have an id, timestamp, duration in
  microseconds, arguments (truncated to `slowlog-max-argc`, default 32), client address,
  client name and, from 8.10, the total argument count. URL:
  https://redis.io/docs/latest/commands/slowlog-get/
- **F11.40** [DOC][OBS] Latency monitor: `latency-monitor-threshold` is 0 (off) by
  default; when it is off `LATENCY DOCTOR` says so (E15). Each event keeps a series of
  160 samples, merged per second by the maximum. Events include `command`,
  `fast-command`, `fork`, `aof-write`. URL:
  https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/
- **F11.41** [DOC] `redis-cli` diagnostics present in the installed build (E14):
  `--latency`, `--latency-history`, `--latency-dist`, `--stat`, `--bigkeys`, `--memkeys`,
  `--keystats`, `--hotkeys`, `--scan`, `--intrinsic-latency <seconds>` (must run on the
  server, not the client), `--rdb`, `--pipe`, `--tls`. Redis 8.6 added `HOTKEYS START`
  (per-key CPU and network share) (https://redis.io/docs/latest/commands/hotkeys-start/);
  hot-key handling is owned by article 10. `MEMORY DOCTOR` refuses to diagnose very small
  instances (E15).
- **F11.42** [JUDGEMENT] Alert set to propose (mark as starting points to tune):
  hit ratio over 5 minutes falling well below the same hour yesterday; database
  queries per second (from the database, not Redis) rising; `evicted_keys` rate above its
  normal; `used_memory / maxmemory` above about 90% under `noeviction` or any `OOM`
  entry in `errorstats`; `rejected_connections` above 0; `connected_clients` above 80%
  of `maxclients`; client-observed p99 latency (the server numbers omit the network);
  `latest_fork_usec` jumps; replica `master_last_io_seconds_ago` rising or
  `master_link_status:down`; `expired_time_cap_reached_count` climbing (F11.52). One
  reason for the first alert: a hit-ratio fall is the earliest signal of F11.3.
- **F11.43** [DOC] ElastiCache publishes these cache metrics derived from `INFO`
  (the managed-service naming a reader will see): `CacheHits`, `CacheMisses`,
  `CacheHitRate` ("If the cache ratio is lower than about 0.8, it means that a
  significant amount of keys are evicted, expired, or don't exist"), `Evictions`,
  `Reclaimed` (expired keys), `CurrConnections`, `NewConnections`, `RejectedConnections`,
  `DatabaseMemoryUsagePercentage` (used_memory/maxmemory),
  `DatabaseCapacityUsagePercentage`, `EngineCPUUtilization` (the single engine thread;
  watch it separately from host CPU), `ReplicationLag`, `SaveInProgress`,
  `MemoryFragmentationRatio`, `SwapUsage` is host-level. URL:
  https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/CacheMetrics.Redis.html
  The 0.8 figure is vendor guidance, not a universal threshold.

## 11.5 Capacity planning

- **F11.44** [OBS] Memory per entry (E4, E9): 100,000 and 1,000,000 string keys with
  7-character names and 200-byte values used 271.3 and 270.0 bytes each from the
  `used_memory` delta, i.e. about 64 bytes beyond the 207 bytes of key and value;
  `MEMORY USAGE` reported 250 for one such key (it omits some per-key table overhead).
  Per-key overhead is constant, so memory scales linearly with key count. The
  redis.io FAQ says an empty instance uses about 3 MB and "1 Million small Keys ->
  String Value pairs use ~85MB". An empty server here showed 0.9-1.2 MB baseline
  (`used_memory_startup` 867,280 bytes). URL:
  https://redis.io/docs/latest/develop/get-started/faq/ . Overhead for expiry: the
  eviction page notes that "setting an `expire` value for a key costs memory".
- **F11.45** [OBS] A product-shaped value (E5): a 806-byte JSON document stored as a
  string had `MEMORY USAGE` 926; the same fields as a 12-field hash with a 480-byte
  description used the `hashtable` encoding and reported about 1,226-1,290 (two
  readings of the same hash differed, so quote "about 1.3 times the string"); a small
  345-byte JSON product reported 414 as a string and 336 as a `listpack`-encoded hash.
  A hash wins on memory only while it stays small enough for listpack
  (`hash-max-listpack-entries 512`, `hash-max-listpack-value 64`, E19).
- **F11.46** [MODEL] Sizing arithmetic for the memory budget: bytes = items x (key
  bytes + value bytes + about 64) x (1 + headroom). For 2,000,000 catalogue items of
  3 KiB: 5.9 GiB; caching only the hottest 20% needs 1.2 GiB (E23). Then add what is
  not data: client buffers (`mem_clients_normal`), the replication backlog (default 1 MB,
  `repl-backlog-size 1048576`; Valkey 8.0 defaults to 10 MB, F11.65), and fragmentation.
- **F11.47** [DOC] Headroom guidance from redis.io admin page: set an explicit
  `maxmemory` "so that it will report errors instead of failing when the system memory
  limit is near"; "maxmemory should be set by calculating the overhead for Redis, other
  than data, and the fragmentation overhead. So if you think you have 10 GB of free
  memory, set it to 8 or 9"; while saving an RDB or rewriting the AOF "Redis can use up
  to 2 times the memory normally used" for write-heavy loads (copy-on-write pages);
  keep swap enabled so memory exhaustion is a visible latency spike rather than an
  OOM kill; set `vm.overcommit_memory = 1`; disable Transparent Huge Pages
  (`echo never > /sys/kernel/mm/transparent_hugepage/enabled`) because after a `fork`
  they cause "big latency and big memory usage". URL:
  https://redis.io/docs/latest/operate/oss_and_stack/management/admin/ and
  https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/
  Not observable on macOS (overcommit, THP).
- **F11.48** [DOC] Memory not counted against `maxmemory`: replica and AOF buffers.
  Reason from the docs: evictions generate updates (`DEL`s) for the buffer, so counting
  the buffer would let eviction feed itself ("the resulting feedback loop could evict
  many items from the cache unnecessarily"). Advice: with replication or persistence
  "set `maxmemory` to leave a little RAM free to store the buffers"; use
  `mem_not_counted_for_evict` to estimate how much. Not needed under `noeviction`.
  Source: eviction page above, and the `redis.conf` comment block for `maxmemory`
  https://raw.githubusercontent.com/redis/redis/unstable/redis.conf . Source code:
  `freeMemoryGetNotCountedMemory()` in `src/evict.c`.
- **F11.49** [DOC] Client memory control: output buffer limits default `normal 0 0 0`
  (unlimited), `replica 256mb 64mb 60`, `pubsub 32mb 8mb 60` (E1); query buffer hard
  limit 1 GB; `maxmemory-clients` (client eviction, Redis 7.0) default 0 (off),
  "for any large production deployment, it is highly recommended to configure some
  non-zero `maxmemory-clients`"; replica and master connections are never evicted;
  `CLIENT NO-EVICT on` exempts one connection. URL:
  https://redis.io/docs/latest/develop/reference/clients/ . I could not make client
  eviction fire in a test: Redis 8 accounts large shared reply payloads separately
  (`mem_clients_normal_shared`), so my slow-reader test did not grow the buffer (E12).
  Describe client eviction from the docs only.
- **F11.50** [OBS] Throughput shape on this machine (E13), 200-byte values, loopback,
  `redis-benchmark`: one client with one request in flight: 10,204 `GET`/s (0.098 ms
  round trip); 50 clients, no pipelining: 127,389 `SET`/s and 145,455 `GET`/s; 50 clients
  with pipeline depth 16: 1,204,819 `SET`/s and 1,287,001 `GET`/s. The redis.io benchmark
  page shows the same pattern (about 180,000 `SET`/s without and about 1.5 million with
  pipelining of 16 on its reference machine) and says "Naively iterating on synchronous
  Redis commands does not benchmark Redis itself, but rather measure your network ...
  latency". URL: https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/
  Use these to show that the limit is usually round trips, not Redis. Do not give them as
  production figures.
- **F11.51** [MODEL] Network bandwidth = operations per second x average reply bytes
  x 8. 50,000 `GET`/s of 2 KiB values is 102 MB/s, 0.82 Gbit/s: close to a 1 Gbit/s link
  even though Redis is nowhere near its command limit (E23). Connection count (Little's
  law, L = arrival rate x time in system): 40 application instances x a pool of 20 is
  800 connections against `maxclients` 10,000; a reconnect storm after a restart is
  bounded by the listen backlog (`tcp-backlog 511`, E21).
- **F11.52** [OBS][DOC] Expiry storms (E17, E18). 500,000 keys written with a 3 s TTL all
  expired within about 2.2 s of the first expiry; during it a second connection timing
  `GET` saw a median of 0.1 ms but spikes to 25.7 ms (baseline max 0.2 ms).
  `expired_time_cap_reached_count` rose by 33 and `expire_cycle_cpu_milliseconds` by 360
  for the 500,000 keys. Source (Redis 8.0.0 `src/expire.c`): active expiry samples 20
  keys per loop, may use up to 25% of each `hz` period (25 ms at the default `hz 10`), and
  repeats while more than 10% of sampled keys were expired
  (`ACTIVE_EXPIRE_CYCLE_ACCEPTABLE_STALE 10`); the `active-expire-effort` default of 1
  uses those base values. **The redis.io latency page says 25%, which does not match the
  source.** Prefer the source:
  https://raw.githubusercontent.com/redis/redis/8.0.0/src/expire.c . Owner of the
  mechanism: article 4; operators need the symptom.
- **F11.53** [OBS] Slow commands block everyone (E9b). `KEYS *` over 1,000,000 keys ran
  for 65 ms (`SLOWLOG` recorded 65,096 us, `cmdstat_keys` `usec_per_call=65096`); a second
  connection timing `GET` saw 0.093 ms median when idle and a worst case of 52.7 ms
  during the `KEYS`. Redis docs: "a VERY common source of latency ... is the use of the
  `KEYS` command in production environments"; use `SCAN`. The ACL category `@dangerous`
  includes `KEYS` (F11.57). Mechanism owner: article 7.
- **F11.54** [JUDGEMENT] Capacity planning checklist with reasons: size memory from the
  working set (F12.2), not the whole data set; leave 10-25% headroom for fragmentation
  and buffers (F11.47) and more if the instance forks; size the database for the cold-cache
  rate you can survive, not the warm one (F11.2); check bandwidth (F11.51); size connection
  pools so total connections are comfortably below `maxclients`.

## 11.6 Security essentials

- **F11.55** [DOC] Model: "Redis is designed to be accessed by trusted clients inside
  trusted environments ... usually it is not a good idea to expose the Redis instance
  directly to the internet". Firewall the port. "a single FLUSHALL command can be used by
  an external attacker to delete the whole data set." Protected mode (since 3.2.0) makes a
  default-configured, password-less instance answer only loopback clients. URL:
  https://redis.io/docs/latest/operate/oss_and_stack/management/security/
- **F11.56** [OBS][DOC] With no config file the server's `bind` was `* -::*` (all
  interfaces) and `protected-mode yes`; the `redis.conf` shipped in the source sets `bind
  127.0.0.1 -::1` (E1; redis.conf line 88). The admin page: "By default, Redis does not
  require any authentication and listens to all the network interfaces." A packaged install
  and a container may differ; check `CONFIG GET bind`.
- **F11.57** [DOC][OBS] ACLs (Redis 6.0): the default user is `on nopass ~* &* +@all`;
  create named users with `ACL SETUSER name on >password ~prefix:* +@read +@write -@dangerous`.
  Observed (E10): such a user could `SET`/`GET`/`DEL` keys under `app:*` but got `NOPERM` for
  other keys and for `KEYS`, `FLUSHALL`, `CONFIG GET` and `INFO` (`INFO` is in `@dangerous`, so a
  monitoring user needs `+info` or a `+@dangerous -...` selection). `ACL LOG` records each
  denial with the client details. Key patterns do not restrict commands that take no key
  arguments: a user with `~tenant1:* +@all` still ran `FLUSHALL` and emptied the whole
  database (E10b); the docs prescribe `-flushall -flushdb -swapdb`. Key read/write selectors
  (`%R~`, `%W~`) and selectors are Redis 7.0. `acl-pubsub-default` is `resetchannels` since 7.0.
  Passwords are stored as SHA-256 and are meant to be long random secrets (`ACL GENPASS`
  makes 64 hex characters). URL: https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/
  The `requirepass` setting still works and sets the default user's password.
- **F11.58** [DOC] TLS is optional on every channel (clients, replication, cluster bus).
  `tls-port` is added to `port`; `port 0` disables plaintext; client certificates are
  required by default (`tls-auth-clients no` turns that off); replicas need `tls-replication
  yes`; the cluster needs `tls-cluster yes`. TLS "results in a decrease of the achievable
  throughput per Redis instance". Redis 8.0 supports I/O threads with TLS. URL:
  https://redis.io/docs/latest/operate/oss_and_stack/management/security/encryption/
  Figures for the TLS throughput loss: UNCONFIRMED (the page links an issue, not a number).
- **F11.59** [DOC] `rename-command` is deprecated in favour of ACLs. Code-security
  warning: `CONFIG SET dir` / `dbfilename` let a client write an RDB file to arbitrary paths,
  so deny `CONFIG` to application users; run Redis as an unprivileged user. `enable-debug-command`,
  `enable-protected-configs` and `enable-module-command` default to `no` (E1; `DEBUG SLEEP`
  was refused on this server).
- **F11.60** [DOC] Dangerous command categories for application users: `@dangerous`
  (`FLUSHALL`, `MIGRATE`, `RESTORE`, `SORT`, `KEYS`, `CLIENT`, `DEBUG`, `INFO`, `CONFIG`, `SAVE`,
  `REPLICAOF`, ...) and `@admin`. `ACL CAT <category>` lists exact members for a given version.
  Command categories other than `+@all` never include module commands.

## 11.7 Managed services and Valkey

- **F11.61** [DOC] ElastiCache: `maxmemory` is derived, not set by you. `reserved-memory-percent`
  (ElastiCache-specific, "isn't part of the Valkey or Redis OSS open source code") defaults
  to 25% and reserves memory for replica output buffers, fragmentation and copy-on-write
  during forked saves; example "13.5 GB of advertised memory and a 25% reserve, the `maxmemory`
  is about 10.1 GB." AWS says not to reduce it. Suggested 30% on small and 50% on micro
  instances. Under memory pressure ElastiCache "automatically switches to a forkless save
  mechanism", which "can add client latencies". URL:
  https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/redis-memory-management.html
  The practical lesson for a reader: the node size you buy is not the cache size you get.
- **F11.62** [DOC] ElastiCache notes `EngineCPUUtilization` is the main-thread view,
  recommends alarms on authentication and authorisation failure counters, and that
  `DB0AverageTTL` is only meaningful on primaries. Same metrics page as F11.43.
- **F11.63** UNCONFIRMED. Other providers (Google Memorystore, Azure Cache, Redis Cloud)
  were not checked. Do not make provider-specific claims beyond ElastiCache without
  checking. Whether a managed service lets you run `CONFIG SET`, `INFO` or `MONITOR` varies and
  was not surveyed.
- **F11.64** [DOC] Licensing by version (primary: Redis README):
  7.2.x and earlier are BSD-3-Clause; 7.4.x to 7.8.x "are subject to your choice of RSALv2 or
  SSPLv1"; 8.0.x and later are "subject to the tri-license RSALv2/SSPLv1/AGPLv3 at your
  option". URL: https://raw.githubusercontent.com/redis/redis/unstable/README.md (lines
  497-503). Valkey is a Linux Foundation fork of Redis 7.2.4 under BSD-3-Clause (its `COPYING`
  file: "BSD 3-Clause License"; source `REDIS_VERSION "7.2.4"` compatibility define in
  `src/version.h`). https://github.com/valkey-io/valkey . Dates (7.4 in March 2024, 8.0 on 1 May
  2025) come from news reports: treat the month and year as UNCONFIRMED against a primary
  source.
- **F11.65** [DOC] Differences that affect operation, checked in source:
  `lazyfree-lazy-eviction`, `lazyfree-lazy-user-del` and the other lazy-free settings default
  to `no` in Redis 7.2, 7.4, 8.0 and 8.10.3 (E1) and to `yes` in Valkey 8.0.0, 8.1.0 and 9.0.0
  (`config.c` and `valkey.conf`; Valkey 7.2.5 had `no`). Valkey 8.0 raises the default
  `repl-backlog-size` from 1 MB to 10 MB (`config.c`: `10 * 1024 * 1024`; release notes
  line "Change repl-backlog-size from 1MB to 10MB by default"). Valkey 8.0 reworked I/O
  threading; its announcement claims up to 1.2 million QPS on AWS r7g against a previous limit
  of 380K QPS (vendor figures, not verified), dual-channel replication, and "9-10%
  reduction in overall memory usage" from embedding keys in dictionary entries. URLs:
  https://valkey.io/blog/valkey-8-0-0-rc1/ ,
  https://raw.githubusercontent.com/valkey-io/valkey/8.0.0/src/config.c ,
  https://raw.githubusercontent.com/valkey-io/valkey/8.0.0/00-RELEASENOTES . I did not run
  Valkey; all Valkey behaviour here is read from source and announcements.
- **F11.66** [DOC] Redis-only items that matter to a decision: `allkeys-lrm` and
  `volatile-lrm` (least recently modified) eviction, Redis 8.6 (accepted by `CONFIG SET` on
  8.10.3, E16); `HOTKEYS` command, 8.6; Redis 8.10 compact hash templates
  (`used_memory_hash_templates`, `hash_templates` in INFO). Whether Valkey 9 has equivalents:
  UNCONFIRMED. Say Redis throughout and note Valkey only where behaviour differs.

## 11.8 Running examples for article 11

1. **Product catalogue API behind a database that is provisioned for the cache.** Hit
   ratio 90-95%, database sized with some headroom against the warm miss rate. A
   deploy flushes the cache. Fits F11.1-F11.9 and the figure in E22.
2. **A session or profile cache that has silently become a capacity cache.** Cache added
   as an optimisation; two years later the database could not serve the traffic without
   it (SRE book wording, F11.7). Fits the "what happens if Redis is down" drill.
3. **A cache node that fills memory during a traffic spike.** Big values, `noeviction` left
   at default, writes begin returning `OOM` while reads keep working (E3), versus the same
   spike under `allkeys-lru` where the hit ratio drops instead (E8).

**Illustrative versus measured numbers in article 11.**

- Measured on real Redis (say "on my machine, Redis 8.10.3"): command-level hit/miss counting
  (E2); OOM and eviction behaviour (E3, E8); bytes per key (E4); `FLUSHALL` sync versus
  async (E9c); `LOADING` window and restart load time (E20); `KEYS` blocking (E9b);
  expiry-storm spikes (E18); ACL results (E10); connection limit (E11). Attach the
  environment line (macOS, libc malloc, loopback) to each.
- Illustrative only: the whole metastable recovery model and its table (E22); arithmetic
  tables (E23); any database capacity or hit ratio the figure uses.
- Quoted from sources: Bronson's 90% to 10x example, Nishtala's 17K/s to 1.3K/s, the
  SRE 4^3 = 64.

---

# Article 12: `designing-a-cache`

The article applies articles 1-11. This section gives the facts the design needs that
the other dossiers will not hold: measured miss-ratio curves for Redis's own eviction,
sizing arithmetic, evidence for what to leave out, and models for the playground.

## 12.1 Workload shape and what a cache of a given size achieves

- **F12.1** [PAPER] Breslau, Cao, Fan, Phillips, Shenker, "Web Caching and Zipf-like
  Distributions: Evidence and Implications", IEEE INFOCOM 1999. Abstract: request
  popularity "does not follow Zipf's law precisely, but instead follows a Zipf-like
  distribution with the exponent varying from trace to trace"; a model of independent
  requests with Zipf-like popularity "yields asymptotic behaviors that are consistent with
  the experimental observations"; and there is a weak correlation between access frequency
  and page size and between frequency and rate of change. Their companion technical report
  ("On the Implications of Zipf's Law for Web Caching") states hit ratio grows
  logarithmically with cache size, and, for five large proxy traces, an exponent "ranging
  from 0.57 to 0.67" (and 0.97 for a small department in earlier work they cite). Their
  conclusion also warns that a naive LFU "performs poorly" when counters exist only for
  items in the cache. URLs: https://pages.cs.wisc.edu/~cao/papers/zipf-implications.html ,
  https://pages.cs.wisc.edu/~cao/papers/zipf-implication/cachehit.html . **UNCONFIRMED:**
  the exponent range "0.64 to 0.83" that I had expected for the INFOCOM version; I could
  not find it. Use "an exponent below 1, varying by trace".
- **F12.2** [MODEL] If the cache holds the C most popular items out of N with exponent a,
  the best a static cache can do is sum of the top C probabilities. For N = 1,000,000 items:

  | exponent | top 0.1% | 1% | 5% | 10% | 20% | 50% |
  | --- | --- | --- | --- | --- | --- | --- |
  | 0.8 | 0.207 | 0.362 | 0.523 | 0.609 | 0.708 | 0.863 |
  | 1.0 | 0.520 | 0.680 | 0.792 | 0.840 | 0.888 | 0.952 |
  | 1.2 | 0.822 | 0.910 | 0.951 | 0.965 | 0.977 | 0.991 |

  (E23). The claim "a cache holding 1% of items serves most requests" holds for exponent
  1.0 and 1.2 but not for 0.8 (36%). The exponent of the reader's own workload
  (measure it from a sample of keys) decides how big the cache must be. Real catalogue
  exponents: UNCONFIRMED. Say so.
- **F12.3** [OBS] Redis's own policies against Zipf traffic (E6, E6b, E7). Setup: 100,000
  items, exponent 1.0, 200-byte values, cache-aside in the client (`GET`, then `SET` on a
  miss), 300,000 warm-up and 300,000 measured requests, `maxmemory` sized for the stated
  fraction of items; hit ratios measured with `keyspace_hits` and `keyspace_misses`.
  "Best static" is the top-C ceiling for the number of keys actually held.

  Full speed (about 50,000 requests/s):

  | cache fraction | keys held | allkeys-lru | allkeys-lfu | allkeys-random | best static |
  | --- | --- | --- | --- | --- | --- |
  | 1% | 1,172-1,254 | 0.465 | 0.611 | 0.481 | 0.632-0.638 |
  | 2% | ~2,220 | 0.531 | 0.654 | 0.541 | 0.685 |
  | 5% | ~5,180 | 0.623 | 0.719 | 0.627 | 0.755 |
  | 10% | ~10,090 | 0.701 | 0.773 | 0.699 | 0.810 |
  | 15% | ~15,050 | 0.748 | 0.809 | 0.744 | 0.843 |
  | 20% | ~19,900 | 0.785 | 0.834 | 0.778 | 0.867 |

  With exponent 0.8 (full speed): 1% LRU 0.191, LFU 0.326, best static 0.36; 10% LRU 0.427,
  LFU 0.530, static 0.596; 20% LRU 0.550, LFU 0.631, static 0.697. Random is within 0.02 of
  LRU at every size at full speed.
  Readings: the hit ratio rises slowly and logarithmically with size (doubling the cache
  adds about 4-8 points here, not doubling the hit ratio); LFU beats LRU by 5-15 points
  on this stationary skewed workload; and no policy reaches the static ceiling.
  Limits: popularity is stationary and requests are independent, which favours LFU;
  scan pollution and shifting popularity were not tested (owner: article 4). Requests were
  pipelined in batches of 200, so a few misses inside a batch repeat. All Redis settings
  were the defaults (`maxmemory-samples 5`, `lfu-log-factor 10`, `lfu-decay-time 1`).
- **F12.4** [OBS][MODEL] Why LRU ties with random at full speed, and what changes when the
  workload is slower (E7, E16, E23). Redis's LRU timestamp has **one-second resolution**
  (`LRU_CLOCK_RESOLUTION 1000`, 24 bits, `src/object.h`/`src/server.h` at 8.0.0; confirmed by
  `OBJECT IDLETIME` reading whole seconds, E16). If the time an item survives in the cache
  (Che's "characteristic time") is around a second or less, most sampled keys look equally
  idle and LRU degrades toward random. Pacing the same workload at 5,000 requests/s at a 15%
  cache (characteristic time about 10 s): LRU 0.780, LFU 0.807, random 0.744, best static
  0.843. At full speed with the same cache: LRU 0.748, LFU 0.809, random 0.744. LFU is
  unaffected; random is unaffected; LRU gained 3 points. The analytic Che approximation for
  LRU under independent Zipf requests predicts 0.781 for the paced run (measured 0.780) and
  a characteristic time of 10.0 s at 5,000/s but only 0.84 s at 60,000/s (E23). Reference for
  the approximation: Che, Wang, Tung, "Analysis and Design of Hierarchical Web Caching
  Systems", IEEE INFOCOM 2001 (https://crystal.uta.edu/~hche/publications/papers/webcaching-infocom2001.pdf);
  the journal version's reference (IEEE JSAC 2002, author order) is UNCONFIRMED. Practical
  consequence for the design: on a small, very busy cache, `allkeys-lfu` is the safer default;
  the redis.io rule of thumb recommends `allkeys-lru` "if you have no reason to prefer any
  others" (eviction page). Caution before claiming this in general: one workload shape,
  one machine.
- **F12.5** [DOC] Eviction mechanics a design review should know. Approximated LRU samples
  `maxmemory-samples` keys (default 5; the config file says 10 "approximates very closely
  true LRU", 3 is faster, maximum 64) and keeps a pool of good candidates (`EVPOOL_SIZE 16`,
  `src/evict.c`, unchanged between 8.0.0 and unstable). LFU is a Morris counter (8 bits)
  with `lfu-log-factor 10` and `lfu-decay-time 1` minute; docs table for factor 10: after 100
  hits the counter is about 10, 1,000 hits about 18, 100,000 hits about 142, saturation
  about one million hits. `maxmemory-eviction-tenacity` (default 10) bounds time spent per
  eviction round: 0-10 maps linearly to 0-500 us, then 15% geometric growth (`evictionTimeLimitUs`).
  URL: https://redis.io/docs/latest/develop/reference/eviction/ ; source
  https://raw.githubusercontent.com/redis/redis/unstable/src/evict.c . Note: article 4 owns
  these; article 12 chooses.

## 12.2 Sizing a cache for the worked example

- **F12.6** [MODEL] Method, in order: (1) decide the target hit ratio from the database's
  spare capacity (F11.2): required miss ratio = (database capacity) / (peak read rate); (2)
  from the access skew find the fraction of items that achieves it (F12.2 for the static
  ceiling, F12.3 for what Redis delivers); (3) multiply items by bytes per entry (F11.44); (4)
  add headroom (F11.47, 25% is the ElastiCache default reserve, F11.61); (5) check bandwidth
  (F11.51) and connections. Example numbers (all illustrative): 2,000,000 products, average
  cached document 3 KiB, peak 6,000 product reads/s, database safe at 600 reads/s, so the
  miss ratio must stay under 10% (hit ratio 90%). Exponent 1.0: the static ceiling reaches 0.84
  at 10% of items, 0.888 at 20%, 0.90 at 24% and 0.93 at 37% (E23 and a follow-up
  computation). LFU in E6 sat 3-4 points under the ceiling at 15-20% of a 100,000-item set,
  so to deliver 0.90 plan for a ceiling near 0.93: about 37% of items, or 2.2 GiB of data
  out of F11.46's 5.9 GiB total, plus headroom. (Assumes the 100,000-item gap carries over to
  1,000,000 items; that is untested.) Exponent
  0.8: 20% only reaches 0.708, so the design cannot meet the target by cache size alone. State
  these as an illustration of the method, never as a recommendation.
- **F12.7** [MODEL] Cold-cache survivability test: required capacity with an empty cache
  is the whole read rate (6,000/s) against 600/s. The design needs a plan from article 11
  (shedding, ramp, warm replica), or a database that can take 6,000/s (then the cache is a
  latency cache, F11.7, not a capacity cache).

## 12.3 What not to cache, and why

- **F12.8** [JUDGEMENT, with sources for the reasoning] Candidates to leave out: the price
  used to charge a customer; stock when it is reserved at checkout; authorisation decisions;
  anything whose staleness cannot be bounded by a TTL the business accepts. Reason: a cache
  is a copy that can be stale (articles 4-5), and a stale price becomes a wrong charge.
  Display the cached price on listing pages and read the authoritative price at order time.
  Supporting evidence that even a very large operator accepts stale data on the read path
  and fixes it with leases and deletes rather than strict consistency: Nishtala et al. say
  Gutter "limits the load on backend services at the cost of slightly stale data" and the
  cold-cluster warm-up accepts "rare cache consistency issues" (F11.8, F11.24).
- **F12.9** [PAPER] Facebook's separation of items by access pattern and size is a
  design-level precedent: "regional pools" hold large, rarely accessed items once per
  region instead of replicating them in every cluster; their category B items were
  accessed "an order of magnitude less" than category A. Section 4.2. Use as the argument
  for separate Redis instances or key spaces by workload (for example product pages versus
  sessions), which also isolates eviction pressure and failure.
- **F12.10** [JUDGEMENT] Do not share one Redis between a cache and data that cannot be
  lost. The eviction page itself says `volatile-*` policies are mainly for "a single Redis
  instance for both caching and for a set of persistent keys. However, you should consider
  running two separate Redis instances".

## 12.4 Decisions the article makes (facts from other dossiers)

These facts live in other articles' dossiers; the writer should take them from there, not
from here. Listed so the design walk-through covers each decision.

- What to cache and key design: article 3 (keys and values). Hash versus string memory: F11.45.
- Pattern (cache-aside versus others): article 2. Failure behaviour of cache-aside versus
  read-through: F11.6.
- TTL and jitter, eviction policy: article 4; measured policy results: F12.3-F12.4.
- Invalidation and consistency: article 5; leases: F11.25.
- Stampede protection: article 6.
- Topology: replication and failover article 9; cluster article 10.
- Failure plan and metrics: article 11 (F11.9-F11.42).

## 12.5 The playground simulation

Knobs, with the model they exercise and the honest limits:

- **F12.11** [MODEL] Cache size (fraction of items) with Zipf exponent: use the static
  ceiling (F12.2) or the Che approximation for LRU. The Che fixed point solves sum over items of
  (1 - exp(-p_i x t)) = C for t, then hit ratio = sum of p_i x (1 - exp(-p_i x t)); validated
  against real Redis within 0.002 at the one paced point (0.781 predicted, 0.780 measured,
  F12.4). For N = 100,000 and exponent 1.0 the Che LRU curve sits 5-11 points below the
  static ceiling (E23). It models independent requests only and ignores the one-second
  clock (F12.4), so it is optimistic for a busy small cache: at full speed Redis measured
  0.701 against Che 0.738 at 10%, and 0.785 against 0.812 at 20%.
- **F12.12** [MODEL] Policy (LRU, LFU, random): to be honest the simulation either runs a
  small discrete simulation with the same sampling rule or draws the measured table (F12.3)
  and labels it "measured on Redis 8.10.3, default settings".
- **F12.13** [MODEL] Traffic and database capacity: miss rate = traffic x (1 - hit ratio);
  show database utilisation against 100% (F11.1-F11.2).
- **F12.14** [MODEL] Cold-start recovery with and without shedding or ramp: the E22 model
  with parameters offered load, database capacity, timeout, shedding on/off, ramp on/off. Its
  recovery times for the default parameters are in F11.9.
- **F12.15** [MODEL] TTL and jitter and stampede knobs belong to articles 4 and 6; the playground
  should expose them only if those articles' models are reused unchanged.

## 12.6 Design review checklist (questions, each with its reason and source)

1. If the cache vanished right now, what would the database see, and can it take it?
   Reason: F11.1-F11.9, F11.7.
2. Is each cached thing allowed to be stale, and for how long? What is the TTL bound on
   that? Reason: a stale price is a wrong charge (F12.8).
3. What hit ratio do you need, and what working set and exponent does that imply?
   Reason: F12.2, F12.6.
4. What does `maxmemory` leave for buffers and forks? Reason: F11.47, F11.48.
5. Which eviction policy and why? Reason: F12.3-F12.4 (LRU can behave like random on a hot,
   small cache).
6. What happens at the memory limit: errors (`noeviction`) or lost entries? Reason: F11.15,
   E3 versus E8.
7. Is any single value or command big enough to stall everyone? Reason: F11.33, F11.53.
8. Who can run `FLUSHALL`, `KEYS`, `CONFIG`? Reason: F11.57.
9. How many connections will exist at full scale, plus a restart storm? Reason: F11.51.
10. What are the alarms, and which one fires first when the hit ratio falls? Reason: F11.42.
11. How is it warmed after a restart or flush? Reason: F11.19-F11.27.
12. Who sheds load, and is that path ever exercised? Reason: F11.10-F11.12 ("the code path you
    never use").

## 12.7 Running examples for article 12

1. **Product catalogue and checkout** (the commissioned example): catalogue read heavy and
   skewed, checkout must see current prices and stock. Numbers: F12.6.
2. **Content or documentation site with a search-results cache**: results keyed by normalised
   query, long tail of one-off queries (good for scan pollution and why LFU helps) and a small
   hot head.
3. **Per-user dashboard**: personalised data, key must include user and permission set,
   invalidation fan-out when shared data changes. Useful for the "what not to cache" argument.

**Illustrative versus measured numbers in article 12.**

- Measured on Redis 8.10.3: the hit-ratio table by policy and size (F12.3), the paced/unpaced
  LRU finding (F12.4), bytes per entry (F11.44), product value sizes (F11.45). State the
  workload (synthetic Zipf, 100,000 items, 200-byte values), the exponent, and that the
  machine is a laptop.
- Illustrative: the 2,000,000-product catalogue, 3 KiB documents, 6,000 reads/s, 600/s database;
  every figure from the playground; the Che curve; the cold-start model.
- Never present the exponent of a real catalogue as measured; there is no data here.

---

# Gaps and overlaps in the coverage map

- **Overlap, article 6 versus 11 (cold start).** Article 6 lists "Cold-start stampedes ...
  (operational response: article 11)". Article 11 lists "Warming a cold cache" and
  "metastable failure". Suggested split: 6 owns the per-key stampede and single-flight
  mechanics; 11 owns whole-cache loss, shedding, ramp and warm restarts. Lease numbers
  (F11.25) fit both; give them to 6 and cite from 11.
- **Overlap, article 8 versus 11 (timeouts and retries).** Article 8 owns client mechanics
  (timeouts, retries, behaviour on overload); article 11 lists "timeouts, circuit breakers,
  falling back, load shedding". Suggested split: 8 gives the per-request mechanics; 11 gives the
  system-level policy (retry budgets, breakers, shedding, F11.10-F11.13).
- **Overlap, article 7 versus 11 (memory).** Article 7 owns `MEMORY USAGE`, encodings and
  fragmentation; 11 owns sizing. 11 should reuse 7's per-key overhead and not re-derive it.
  (F11.44-F11.46 are provided as the measured basis; reconcile numbers with dossier E.)
- **Overlap, articles 9/10 versus 11 (monitoring).** Replication lag fields (9) and hot-key
  detection (10, `--hotkeys`, `HOTKEYS` command in 8.6) appear in 11's monitoring list; 11
  should name them in a sentence and link.
- **Overlap, article 4 versus 12 (miss-ratio curve).** 4 lists "hit ratio as a function of
  cache size"; 12 needs it for sizing. 12 should link to 4 and add only the sizing method.
- **Gap, no article owns testing failure.** SRE and Bronson both say to test the cold-cache and
  overload paths (the unexercised path rots; production stress testing). A short "game day"
  section fits article 11.
- **Gap, application-level metrics.** The server-wide hit ratio is a poor decision tool
  (F11.30); no article owns instrumenting the application per key namespace. Article 11 should
  state it.
- **Gap, version and licensing note.** The commission asks that licensing is named by version.
  No article currently carries it; F11.64-F11.66 suggest a short note in article 11 (or the
  introduction).
- **Gap, client eviction and output-buffer protection** are only in 11's bullet "connections";
  fine, but a sentence is needed (F11.49).
- **Possible inconsistency with article 4.** The redis.io latency page says active expiry loops
  when more than 25% of sampled keys are expired; the source uses 10% and a 25% CPU cap (F11.52).
  Article 4's writer will meet the same page; make sure both articles use the source.

# Items I could not confirm (do not state as fact)

1. Breslau et al. INFOCOM 1999 exponent range "0.64 to 0.83" (the technical report says 0.57-0.67).
2. Journal reference and author order for Che et al. JSAC 2002 (INFOCOM 2001 version confirmed).
3. The adaptive-throttling formula in the SRE book (an image); text confirms the idea and K.
4. Typical Linux/jemalloc fragmentation ratios; THP/overcommit effects (not observable on macOS).
5. Client-library default timeouts.
6. Client eviction (`maxmemory-clients`) firing: documented, but my test did not trigger it.
7. TLS throughput cost (docs give no number).
8. Valkey runtime behaviour (never run); Valkey 8.0 performance claims are vendor figures.
9. Providers other than ElastiCache.
10. Real catalogue Zipf exponents.
11. Months of Redis licence changes (from news reports, version boundaries are from the README).
12. `INFO latencystats` microsecond values on this machine (the `0.001` p50 looks like a
    resolution artefact).
13. Whether Valkey has equivalents of Redis 8.6 `LRM` eviction and `HOTKEYS`.
