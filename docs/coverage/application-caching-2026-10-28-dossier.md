# Application caching: expert dossier

**Scope of this version.** This dossier currently covers only the items owned by
**Handling cache misses** (`cache-misses`), written 6 November 2026 for the
[cache-misses pilot](../article-work/cache-misses-pilot-2026-11-06/README.md). Items
that touch neighbouring articles are listed under Boundary and in the ownership table
so that later planning can extend this file rather than start again. The other eight
articles' items have not been researched here.

Entries marked **Observed** were run on 6 November 2026 on a disposable local setup:
PostgreSQL 16.15 and Redis 7.0.15 on one Linux host over loopback and Unix sockets,
Go 1.24.7 with `golang.org/x/sync` v0.10.0, `go-redis` v9.7.0 and `pgx` v5.7.1. In
the stampede runs the source query adds `pg_sleep` to model the cost of assembling a
card, so the **durations are modelled while the counts, states and outputs are
observed**. Entries marked **Computed** are arithmetic or simulation from stated
assumptions, not measurements of a system.

## Decisions

**D1. Does this key need stampede protection at all?** Duplicate fills after one
expiry are roughly *arrival rate × fill time*. The XFetch paper's own example: 10
requests a second and a 3-second recomputation give 30 recomputations. For the shop's
mug card (about 250 requests a second, 20 ms fill: see the proposed scale facts) that
is about 5 duplicate reads, which a database absorbs without notice. For the under-GBP
21.00 list (about 400 a second, 150 ms) it is about 60, each costing 150 ms, more than
the whole fleet's fill allowance. Estimate before building machinery. Vattani,
Chierichetti and Lowenstein, "Optimal Probabilistic Cache Stampede Prevention", PVLDB
8(8), 2015, §1: https://www.vldb.org/pvldb/vol8/p886-vattani.pdf.

**D2. Coalesce within the process, or across the fleet?** A per-process in-flight map
(Go `singleflight`, a promise or future cache, Caffeine's atomic `get(key, fn)`) caps
duplicate work at one fill per key per instance with no new dependency. A shared lease
(memcached leases or meta `N` flag; Redis `SET … NX PX`) caps it near one per fleet
but adds a round trip, a store that can fail, and a slow-owner case. Signal: instance
count × fill cost against the source allowance. With 20 instances, per-process
coalescing permits up to 20 concurrent copies of the 150 ms list, half the fleet's 40
fill slots; for the 20 ms mug card it hardly matters. **Observed:** 400 requests for
one expired key at 2,000 a second with a 50 ms fill made 110 source queries with plain
cache-aside, 1 with one `singleflight.Group`, and 2 with two groups standing for two
instances.

**D3. Is the refresh lease an efficiency lock or a correctness lock?** Kleppmann's
distinction decides the design: an efficiency lock may occasionally admit two holders,
costing duplicate work; a correctness lock needs a fencing token checked by the
resource. A refresh lease is an efficiency lock. Correctness of what gets published
comes from a conditional write (owner token or version checked atomically at the
store), which Versioned cache fills owns. Kleppmann, "How to do distributed locking",
8 February 2016: https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html.

**D4. What does a caller do while someone else fills?** Wait with its own deadline,
take a still-permitted stale copy, receive a reduced answer, or fail fast. It must not
turn its own timeout into a fresh source read. Facebook's lease clients are told to
"wait a short amount of time" and retry the cache; the memcached `Z` flag tells a
client to "retry, wait, or try something else". nginx is the counter-example: when
`proxy_cache_lock_timeout` (default 5 s) expires, "the request will be passed to the
proxied server, however, the response will not be cached". Every waiter then becomes
uncached source work at the worst moment. https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_lock_timeout.

**D5. Whose cancellation stops the shared load?** The loader must not run under the
first caller's request context, or that caller's timeout cancels work others are
waiting for. In Go, `context.WithoutCancel` (Go 1.21) detaches the loader from caller
cancellation, and the loader then gets its own deadline. Callers use `DoChan` and
`select` on their own `ctx.Done()`.
https://pkg.go.dev/context#WithoutCancel; https://pkg.go.dev/golang.org/x/sync/singleflight.

**D6. Refresh on a timer, on request, or probabilistically?** Background
re-computation prevents stampedes but refreshes keys nobody reads and needs its own
daemon, monitoring and key list (XFetch paper §1, "External re-computation").
Request-triggered refresh ahead of expiry (Caffeine `refreshAfterWrite`, memcached
`R` flag, a soft TTL) does no work for unused keys. XFetch randomises the trigger so
no coordination is needed. Signals: popularity distribution, fill cost, and whether a
stale-serving allowance exists.

**D7. Spread expiry or refresh times across keys?** Use jitter when many keys were
written together, for example after a warm-up or a deploy, so that they would
otherwise expire together. Take the jitter out of the refresh point or subtract it
from the TTL; never add it beyond the freshness allowance. AWS adds jitter "to all
timers, periodic jobs, and other delayed work". Jitter does nothing for one hot key or
a whole-cache loss. https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/.

**D8. What limits source work across all keys?** The choice is between a concurrency
limit (slots), a rate limit (token bucket), or an adaptive limit. Size concurrency
with Little's law: limit = rate × latency. Netflix's concurrency-limits library argues
for concurrency over RPS because RPS limits "quickly go out of date". Add a small
waiting area: SRE recommends queues of 50% or less of the thread pool. Check the
remaining deadline when a request leaves the queue. Per-instance limits add up across
the fleet, and autoscaling multiplies them.
https://github.com/Netflix/concurrency-limits;
https://sre.google/sre-book/addressing-cascading-failures/ ("Queue Management").

**D9. What happens to work the limit refuses?** Shed early and cheaply (HTTP 503 or a
reduced card). Serve a still-permitted local copy where freshness allows. Or let
clients self-throttle: SRE adaptive throttling rejects locally with probability
max(0, (requests − K·accepts)/(requests + 1)), with K = 2.
https://sre.google/sre-book/handling-overload/.

**D10. When the shared cache is unavailable, where do misses go?** Options: fall back
to the source through the same admission limit; fall back to a small in-process copy;
send failed shards' keys to a reserved gutter pool (Facebook); or rehash onto the
surviving cache nodes. AWS prefers an in-memory fallback cache or load shedding that
caps requests to the dependency over direct fallback. They also "test service behavior
with caching disabled". Facebook rejected rehashing because "a single key can account
for 20% of a server's requests". Moving that key moves the overload.
https://aws.amazon.com/builders-library/caching-challenges-and-strategies/; Nishtala
et al., "Scaling Memcache at Facebook", NSDI 2013, §3.3:
https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf.

**D11. Where do retries live?** Retry at one layer, with a per-request cap and a
budget across requests. SRE allows three attempts per request and retries only while
retries stay below 10% of a client's requests. AWS SDK standard mode allows 3 attempts
from a 500-token retry quota. Prefer an overload response that callers do not retry.
https://sre.google/sre-book/handling-overload/;
https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html.

**D12. How do you return from a cold cache?** Options: demand fills under admission;
a bounded warm-up of recently popular keys; reading from a warm peer cache (Facebook's
cold cluster warm-up); or keeping the data across a restart. Ramp the traffic and stop
when the source nears its allowance. Slack recovered by throttling client boot and
raising the limit "by smaller increments" after a first increase overloaded the
database again. https://slack.engineering/slacks-incident-on-2-22-22/.

**D13. Bound the work at the source, not only the wait at the client.** A client
timeout or a closed connection does not stop a running query. PostgreSQL
`statement_timeout` enforces a limit at the server. `client_connection_check_interval`
makes the backend notice a vanished client. Set the server limit no longer than the
caller's remaining budget.
https://www.postgresql.org/docs/current/runtime-config-client.html;
https://www.postgresql.org/docs/current/runtime-config-connection.html.

**D14. Batch distinct misses?** A page that renders 24 or 40 cards can collect its
misses and fill them with one `WHERE id = ANY($1)` query, the DataLoader pattern.
That cuts source round trips for distinct keys, which per-key coalescing cannot
combine. Not in the current brief; see open scope questions.

## Vocabulary

- **Cache stampede**, also **thundering herd**, **dog-piling**, **cache miss storm**:
  many requests miss the same popular key and recompute it at once. The XFetch paper
  lists these synonyms in §1. Facebook's paper uses "thundering herd".
- **Request coalescing** (AWS), **request collapsing** (CDNs), **singleflight** (Go),
  **duplicate suppression**, **promise or future caching**: share one in-flight fill
  among callers for the same key.
- **Lease**: time-limited permission held in a coordinating store (Gray and Cheriton,
  1989, cited by Facebook). In memcached at Facebook it is a 64-bit token bound to a
  key. It addresses both **stale sets** and thundering herds.
- **Stale set**: a delayed fill overwrites newer data. The term is Facebook's; the
  freshness article owns the race.
- **Probabilistic early expiration**, **XFetch**: each request refreshes early with a
  probability that rises towards expiry, scaled by recompute time Δ and a tuning
  parameter β.
- **Early recache**, **refresh-ahead**, `refreshAfterWrite`: refresh a still-usable
  entry before it expires.
- **Soft TTL and hard TTL** (AWS, used in the IAM client): refresh after the soft
  limit, and serve the old value until the hard limit if refresh fails.
- **stale-while-revalidate** and **stale-if-error** (RFC 5861): the HTTP names for
  serving stale during revalidation or after errors. Practitioners use them for
  application caches too, and memcached's documentation borrows them.
- **Jitter**: randomness added to timers or backoff so that correlated work spreads
  out.
- **Admission control**, **load shedding**, **goodput** versus **throughput**,
  **brownout**: AWS load-shedding vocabulary.
- **Concurrency limit**, **Little's law**, **token bucket**, **adaptive concurrency**
  (Vegas, Gradient2, AIMD).
- **Backpressure**, **deadline propagation**, **cancellation propagation**: SRE book
  vocabulary.
- **Retry storm**, **retry amplification**, **retry budget** or **retry quota**.
- **Circuit breaker**: stops calls after an error threshold. AWS warns that it
  introduces "modal behavior".
- **Gutter pool**: a small reserve cache pool that absorbs failed shards' traffic
  with short TTLs (Facebook).
- **Cold start**, **cold cache**, **warm-up**, **cold cluster warmup**.
- **Cascading failure**; **metastable failure**, with its **trigger** and
  **sustaining effect** (Bronson et al.; Huang et al.).
- **Fencing token**: a monotonically increasing number that the protected resource
  checks (Kleppmann).
- **Efficiency lock** versus **correctness lock** (Kleppmann).

## Canonical sources

| Source | What it establishes |
| --- | --- |
| Vattani, Chierichetti, Lowenstein, "Optimal Probabilistic Cache Stampede Prevention", PVLDB 8(8), VLDB 2015. https://www.vldb.org/pvldb/vol8/p886-vattani.pdf | Names the problem and its synonyms. Stampede size depends on rate × recompute time. XFetch: refresh if `Time() − Δ·β·log(rand()) ≥ expiry`, storing Δ with the value; β defaults to 1 "and already provides effective prevention"; β > 1 refreshes earlier. The exponential gap is optimal. Lists the drawbacks of background refresh and locking. |
| Nishtala et al., "Scaling Memcache at Facebook", NSDI 2013. https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf | Leases for stale sets and thundering herds (§3.2.1). Serving stale values to clients waiting on a lease. Gutter pool rather than rehashing (§3.3). Cold cluster warm-up (§4.3). Upgrade time limited by database load (§6.4). The primary production numbers in this subject. |
| Go `golang.org/x/sync/singleflight` (documentation read at v0.24.0, 23 September 2026; source read at master). https://pkg.go.dev/golang.org/x/sync/singleflight | The reference in-process coalescing API: `Do`, `DoChan`, `Forget`, `shared`. Its source re-panics a loader panic in every waiter and handles `runtime.Goexit`. It has no deadline, waiter limit or source budget. |
| Caffeine: `Cache.get(key, fn)` Javadoc and the Refresh wiki. https://github.com/ben-manes/caffeine/wiki/Refresh | The compute is atomic, "applied at most once per key", but blocks other updates, so "should be short and simple"; AsyncCache stores futures. `refreshAfterWrite` refreshes only when the entry is queried, returns the old value while refreshing, and keeps the old value if refresh throws. |
| memcached meta protocol. https://docs.memcached.org/protocols/meta/ | Server-side anti-stampede in one round trip: `N` (create a placeholder on miss), `W` (won), `Z` (someone else won), `R` (early recache when TTL is below a threshold), `md … I` (mark stale), `X` (stale). Uses CAS for conditional recache. |
| Redis, "Distributed locks with Redis". https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/ | Single-instance lease `SET resource_name my_random_value NX PX 30000`. Owner-checked release by Lua script or, from Redis 8.4, `DELEX key IFEQ value`. Asynchronous replication can grant the lock twice after failover. TTLs do not use a monotonic clock. "You should implement fencing tokens." Redis 8.4 also adds `SET … IFEQ` for owner-checked publication: https://redis.io/docs/latest/commands/set/. |
| Kleppmann, "How to do distributed locking", 2016. | Efficiency versus correctness locks. A GC pause can outlast the lease. Fencing tokens. |
| RFC 5861, "HTTP Cache-Control Extensions for Stale Content". https://www.rfc-editor.org/rfc/rfc5861.html | The standard names stale-while-revalidate and stale-if-error, with the separate stale allowance (`max-age=600, stale-while-revalidate=30`). |
| AWS Builders' Library: "Caching challenges and strategies" (Brinkley, Chhabra). https://aws.amazon.com/builders-library/caching-challenges-and-strategies/ | Downstream load grows with fleet size for local caches. Cold starts. Fallback to the dependency during a cache outage causes an "atypical spike". Soft and hard TTL. Request coalescing. Negative caching of errors. Load-test with caches disabled. |
| AWS Builders' Library: "Using load shedding to avoid overload" (Yanacek). https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/ | Goodput versus throughput. Bound time in queue, not only queue length. Do not pollute latency metrics with rejected requests. Load-test "far beyond the point where it breaks". |
| AWS Builders' Library: "Timeouts, retries, and backoff with jitter" (Brooker). https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ | Three tries at each of five layers is 243× database load. Retry at one point in the stack. Jitter on all timers. Circuit breakers are modal. |
| Google SRE book, ch. 21 "Handling Overload" and ch. 22 "Addressing Cascading Failures". https://sre.google/sre-book/handling-overload/ | Adaptive throttling formula. Per-request retry budget (3) and per-client retry ratio (10%). Queue sizing. Deadline and cancellation propagation. LIFO and CoDel queues. A cascading failure does not stop when load falls just below the trigger point. |
| Bronson, Aghayev, Charapko, Zhu, "Metastable Failures in Distributed Systems", HotOS 2021. https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf | The look-aside cache example: at a 90% hit ratio, losing the cache is 10× query amplification, and the application cannot refill the cache while its queries time out. |
| Huang et al., "Metastable Failures in the Wild", OSDI 2022. https://www.usenix.org/system/files/osdi22-huang-lexiang.pdf | Retries sustain more than 50% of the studied incidents. Reproduces look-aside metastability (MySQL, memcached, Zipf requests, 1 s timeouts; triggered by deleting the hottest items). |
| Netflix concurrency-limits README. https://github.com/Netflix/concurrency-limits | Little's law sizing (`Limit = Average RPS * Average Latency`). Why fixed RPS limits go stale. Vegas, Gradient2 and AIMD limiters. |
| PostgreSQL 16+ documentation: `statement_timeout`, `client_connection_check_interval`. | Server-side bounds on abandoned work. Both default to 0 (off). |
| Maurer, "Fail at Scale", ACM Queue 13(8), 2015. | Adaptive LIFO and controlled-delay queues in Facebook's servers. Cited by the SRE book as [Mau15]. **Not re-read for this dossier**: queue.acm.org was not reachable from this session. Cite through the SRE book, or re-check before quoting its parameters. |

## Magnitudes and defaults

**M1. Stampede size ≈ rate × fill time.** **Observed:** 2,000 requests a second for
one expired key with a 50 ms modelled fill gave 110 source queries (prediction about
100). With a 5 ms fill, 17 queries. With a 200 ms fill, all 400 requests missed and
400 queries ran: queueing for 50 connections stretched each fill, so the miss window
never closed (median caller 910 ms). A slower source widens its own stampede.

**M2. Leases at Facebook.** Without leases, a set of herd-prone keys produced a peak
of 17,000 database queries a second; with leases, 1,300. That is a 13× reduction, and
Facebook provisions databases for peak. A server issues a lease token for a key at
most once every 10 seconds. The holder "typically" sets the value "within a few
milliseconds". NSDI 2013 §3.2.1.

**M3. Look-aside amplification is 1 / (1 − hit ratio).** At 90%, losing the cache
means 10× the source queries (HotOS 2021: a database good for 300 QPS fronts 3,000
QPS, and every load above 300 QPS is in the vulnerable state). At 95% it is 20×. A
fall from 95% to 90% doubles source load while the hit ratio still looks good.

**M4. Gutter.** About 1% of memcached servers in a cluster. It reduces client-visible
failures by 99% and converts 10–25% of failures into hits each day. After a server
fails entirely, gutter hit rates "generally exceed 35% in under 4 minutes and often
approach 50%". NSDI 2013 §3.3.

**M5. Cache lookup cost.** Facebook memcache get: median 333 µs, p75 475 µs and p95
1.135 ms over 7 days, including network (NSDI 2013 §6). It is the right order for a
same-zone shared cache, and two orders below the fill costs that make stampedes matter.

**M6. Warm-up times at scale.** A Facebook memcached server "can reach 90% of its
peak hit rate within a few hours", so upgrading a set of servers took over 12 hours to
keep database load safe. Cold cluster warm-up from a warm cluster cut bringing a
cluster back "to full capacity" from "a few days" to "a few hours". NSDI 2013 §4.3 and
§6.4. These are long-tail social workloads, so recovery time depends on popularity
skew (compare M13).

**M7. Retry multiplication.** 3 tries at each of 5 layers = 3⁵ = 243× (AWS). SRE
limits: 3 attempts per request, retry ratio below 10% per client, and an example
server-wide budget of 60 retries a minute. AWS SDK standard mode: 3 max attempts and a
500-token quota, with 5 tokens per retry or 14 per timeout retry, restored on success.

**M8. Queues.** SRE example: a queue 10× the thread count with 100 ms of work per
request makes a full-queue request take 1.1 s. Keep queues at 50% of threads or less.
Deadlines "several orders of magnitude longer than the mean request latency" led to
thread exhaustion.

**M9. XFetch behaviour.** β = 1 by default. **Computed** (Poisson arrivals, 1,000
trials per case, Python 3.13): the first early refresh starts about Δ·β·ln(rate·Δ·β)
before expiry. For the shop's list (rate 400/s, Δ = 150 ms) that is about 0.6–0.7 s
before expiry. Each expiry still triggers about 2.6–2.8 refreshes on average across
the fleet, almost independent of rate, with a maximum of 15–19 in 1,000 trials. β = 2
roughly doubles the lead and cuts mean refreshes to about 1.7. XFetch bounds a
stampede to a few refreshes rather than one, so pair it with per-process coalescing.

**M10. Defaults that start source work or fail to stop it.**
- nginx: `proxy_cache_lock` is off by default. `proxy_cache_lock_timeout` is 5 s,
  after which the request goes to origin uncached. `proxy_cache_lock_age` is 5 s,
  after which another request may be passed.
- PostgreSQL: `statement_timeout` is 0 (off), `client_connection_check_interval` is
  0 (off), and `max_connections` is 100.
- Redis's lock documentation suggests a 20-byte random owner value. For Redlock it
  suggests 5–50 ms per-node acquire timeouts against a 10 s auto-release.

**M11. Concurrency from Little's law.** Concurrency = throughput × latency. **Computed**
for the proposed example scale: an allowance of 2,000 fills a second at a 20 ms
median is 40 fills in flight fleet-wide, or 2 slots on each of 20 instances. If fill
latency doubles to 40 ms, the same 40 slots deliver only 1,000 a second. A concurrency
limit protects the source but makes throughput fall as the source slows.

**M12. Metastable outages.** In Huang et al.'s study, outages ranged from 1.5 to 73.53
hours, with 4–10 hours most common. Retries sustained more than half of them.

**M13. Cold-cache recovery under skewed popularity.** **Computed**, using the
proposed example: 50,000 cards with popularity Zipf-like with exponent 1, 20,000
requests a second, 20 instances, 20 ms fills.
- The 1,000 most popular cards carry about 66% of requests, and 5,000 cards about 80%.
- At a 2,000-a-second fill allowance, demand-driven fills restore the top 1,000 in
  about 0.5 s and the top 5,000 in about 2.5 s, provided fills complete within their
  deadlines.
- Prewarming all 50,000 would occupy the entire allowance for 25 s.
- In a total cache loss, per-process coalescing absorbs only about 12% of requests,
  and fleet-wide coalescing about 36%. Most cold misses are for different keys.
- A 30-second TTL at this scale gives a steady hit ratio near 94%, about 1,200 fills
  a second.

**M14. Connection pools do not remove duplicates.** **Observed:** the same 2,000-a-
second stampede with a 10-connection pool instead of 50 made 107 source queries
instead of 110. Peak active queries fell from 49 to 9, but p99 caller latency rose
from 107 ms to 507 ms. The pool converted concurrency into queueing; it neither
coalesced nor shed anything.

## Tools and output

**T1. `pg_stat_activity` during a stampede.** Many identical active statements of the
same age are the signature. **Observed** 150 ms into a 2,000-a-second burst with a
200 ms modelled fill and a 50-connection pool:

```text
 state  | wait_event_type | wait_event | count |    oldest    |                      query
--------+-----------------+------------+-------+--------------+--------------------------------------------------
 active | Timeout         | PgSleep    |    50 | 00:00:00.163 | select name || ':' || price_pence from products,
```

In production the wait event would be IO, Lock or CPU rather than `PgSleep`. The
grouping query is the practitioner's tool:
`select state, wait_event_type, wait_event, count(*), max(now()-query_start), left(query,48) from pg_stat_activity group by 1,2,3,6 order by 4 desc`.

**T2. `pg_stat_statements` call counts** show source work per query shape over an
interval, separate from any cache counter. **Observed** after the 200 ms run:

```text
 calls | mean_ms | max_ms |                            query
-------+---------+--------+--------------------------------------------------------------
   400 |   201.2 |  202.3 | select name || $3 || price_pence from products, pg_sleep($2:
```

**T3. Redis `INFO stats`** counts lookups, not fills or useful answers. **Observed**
after the runs above: `keyspace_hits:1557`, `keyspace_misses:849`, `expired_keys:1`,
`evicted_keys:0`. The miss count includes coalesced loaders' recheck GETs and every
duplicate miss in a stampede, so it does not equal source reads (compare T2). Read
both counters as differences over the same interval.

**T4. In-process coalescing counters.** Go `singleflight` returns `shared bool` from
`Do`, and `Result.Shared` from `DoChan`. Counting shared results gives the number of
coalesced callers. Caffeine `CacheStats` exposes `hitCount`, `missCount`,
`loadSuccessCount`, `loadFailureCount`, `totalLoadTime` and `averageLoadPenalty`.
`loadCount` against `missCount` shows how much coalescing saved.

**T5. memcached meta responses** (from the protocol documentation):

```text
mg foo f c v N30      ->  VA 0 f0 c2 W     (miss; this client won the right to fill)
mg foo f c v N30      ->  VA 0 f0 c2 Z     (another client already won)
mg foo v t R30        ->  VA 2 t29 W       (TTL below 30 s; this client should recache)
md foo I T30          ->  HD               (mark stale, serve for at most 30 s)
mg foo t c v          ->  VA 4 t29 c777 W X   (stale data, and this client won)
```

**T6. Redis lease handover.** **Observed** on Redis 7.0.15:

```text
> SET lease:product:v1:north:P7:en-GB:GBP tokA NX PX 80      OK
> SET lease:... tokB NX PX 80   (at once)                    (nil)
> PTTL lease:...                                             72
  ... 100 ms later ...
> SET lease:... tokB NX PX 80                                OK
> EVAL "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end" 1 lease:... tokA
                                                             0    (A's late release refused)
> DEL lease:...                                              1    (plain DEL removes B's lease)
> DELEX lease:... IFEQ tokB     ERR unknown command 'DELEX'       (8.4+ only)
```

**T7. Source-side errors a practitioner sees.** **Observed**, PostgreSQL 16.15:
- `ERROR:  canceling statement due to statement timeout`, from a server-side bound.
- `FATAL:  sorry, too many clients already`: 5 of 105 simultaneous connections
  refused at the default `max_connections = 100`. Adding application instances, each
  with its own pool, reaches this limit.
- A client killed one second into an 8-second query left the backend `active` until
  the query finished, with `client_connection_check_interval = 0`. With it set to
  250 ms, the backend was gone within a second.

**T8. Application metrics the design needs.** None of these comes from the cache
server. AWS: emit hits, misses and "the number of requests made to downstream
services". Add:
- fills started, coalesced waiters, and fills rejected by admission;
- time spent queued, and source work in flight;
- stale answers served and reduced answers served;
- lease acquired, lease denied and lease lost at publish.

Keep goodput (useful replies in time) separate from throughput. Keep the latency of
fast rejections out of success latency (AWS load shedding).

## Failures and incidents

**F1. Facebook, 23 September 2010.** An automated configuration checker treated a
database error as an invalid value and deleted the cache key. "As long as the
databases failed to service some of the requests, they were causing even more requests
to themselves." The site was turned off to break the feedback loop. Shows up as
falling hit ratio while database errors rise. Lesson: a source error is not a reason
to discard or refill a cached answer.
https://engineering.fb.com/2010/09/23/uncategorized/more-details-on-today-s-outage/.

**F2. Slack, 22 February 2022.** Consul agent restarts caused the memcached control
plane (Mcrib) to replace and flush cache nodes at peak, so the hit rate dropped. On
miss, a group-DM membership query had to run on every shard. Database load rose
"superlinearly" relative to the miss rate. Queries timed out, so "the cache could not
fill". Client retries contributed. Recovery took three steps:
- throttle client boot, then raise the limit in small increments after a too-large
  increase re-overloaded the database;
- read only the missing keys;
- serve the immutable data from replicas.

Slack's write-up names the HotOS metastability paper. Mcrib "was faster and more
efficient" than its predecessor, and that efficiency increased churn. Shows up as hit
ratio and database timeouts stuck together, even after the trigger stopped.
https://slack.engineering/slacks-incident-on-2-22-22/.

**F3. Metastable look-aside cache.** Huang et al. induced it by deleting the hottest
items: backend traffic rose, requests hit the 1 s timeout, "no new data is added to
the cache", and the low hit rate sustained itself for more than an hour. Shows up as
a flat low hit ratio, saturated source, and fills that start but never publish.

**F4. Slow owner outlives its lease.** A GC pause or slow query exceeds the lease;
another owner starts; both run; the late owner's release or publish can damage the
new owner's state unless it is owner-checked (T6). Lease lifetime bounds permission,
not work. Redis lock documentation; Kleppmann.

**F5. Synchronised expiry.** Keys written together by a warm-up, deploy or bulk import
expire together one TTL later. Shows up as periodic spikes in source queries at the
TTL interval after an event. AWS's EBS and Lambda observation: clients on regular
intervals "line up".

**F6. Retry storm.** Timeouts trigger retries at several layers, multiplying load on
the slowest dependency (M7). The sustaining effect in most metastable incidents (M12).

**F7. Waiter timeout becomes origin traffic.** nginx's lock timeout passes waiting
requests to origin uncached (D4). Any application design where a timed-out waiter
"just loads it itself" behaves the same way.

**F8. Abandoned queries at the source.** Client timeouts release application slots
while the database keeps executing (T7). A local concurrency limit then admits
replacement work and the source runs more than the limit intended. Shows up as more
active backends in `pg_stat_activity` than the application believes it has in flight.

**F9. Rehashing a failed shard onto survivors.** The hot key moves and overloads its
new server (Facebook §3.3). Hence the gutter pool.

**F10. Fleet growth multiplies per-instance allowances.** Shows up after an
autoscaling event or a larger deploy. AWS notes that with local caches "the
downstream load is now proportional to the service's fleet size". T7's
`too many clients` is the blunt form.

## Misconceptions

- **"Our hit ratio is 99%, so the database is safe."** Source load is proportional to
  the miss ratio and arrives in bursts. A daily average hides a hundred overlapping
  fills. The source must be sized for a cache loss, or protected from it (M3).
- **"A lock or lease means the fill runs once."** It reduces duplicates while the
  holder is quick. Expiry admits a second holder while the first still runs (F4).
  XFetch also allows a few refreshes per expiry (M9).
- **"Coalescing protects the database."** Only for repeated keys. In a cold or
  unavailable cache, most misses are for different keys (M13: about 12% absorbed).
- **"The connection pool is our admission control."** It bounds connections in one
  process, not waiting time or fleet total, and it does not remove duplicates (M14).
- **"Timing out the request stops the query."** Not without server-side limits (T7).
- **"If the cache is down, read from the database."** Without admission this is 10–20×
  the source's normal load (M3; AWS "atypical spike").
- **"Prewarm everything after a restart."** Skewed popularity means a few thousand
  keys restore most hits within seconds. A full prewarm competes with users for the
  same allowance (M13).
- **"Refreshing early keeps data fresher for longer."** Refresh spends time within the
  allowance; it does not extend it. Failure to refresh leaves the last-allowed time
  unchanged.
- **"Jitter fixes stampedes."** It separates keys, not callers of one key.
- **"Backoff creates capacity."** It spreads attempts; the work still arrives (AWS).
- **"A cache error is a miss."** It has already spent part of the deadline, and says
  nothing about the key. Treating it as a miss sends every request to the source.
- **"A higher timeout is safer."** Long deadlines hold resources for answers nobody
  waits for (SRE: deadlines "several orders of magnitude longer" than mean latency
  exhausted threads).

## Boundary

- **HTTP and CDN caching** (RFC 9111, nginx, Varnish request collapsing and grace):
  vocabulary only. No Stay Current collection owns it. The 5 November process review
  lists CDN and HTTP caching among acceptable omissions.
- **Which stale answers are acceptable**, stale-serving allowances and age limits:
  Freshness and invalidation.
- **Conditional publication and fencing** (owner tokens checked at publish, revision
  checks): Versioned cache fills. This article uses the result: a lease is an
  efficiency mechanism.
- **Client pool lifetime, command timeouts, retry configuration of the Redis client,
  and the optional-fill branch**: Caching with Redis.
- **Rollout procedure, failover topology, replication and persistence choices, hot
  keys on one Redis Cluster slot, and rebuilding after a namespace change**: Operating
  a cache.
- **Eviction and admission to memory**: Cache memory and eviction.
- **Lookup fan-out and `MGET` versus sequential GET latency**: Deciding what and where
  to cache, or Caching with Redis. Not miss handling; see open scope questions.
- **Database client pool sizing, driver-specific cancellation and timeouts, and
  overload rejection at the database client**: planned in the relational collection
  as "Making bounded database calls" (`docs/coverage/relational-2026-10-19.yaml`). Not
  yet written. This article sets the cache-side requirement and links there once it
  exists.
- **Safe retry of writes and uncertain outcomes**: relational-rebuild's published
  retry-outcomes article. This article covers read retries only.
- **Distributed consensus and locking for correctness** (Redlock analysis, ZooKeeper
  or etcd leases): omitted. Nothing in this collection needs mutual exclusion for
  correctness.
- **General overload control** (adaptive concurrency algorithms in depth, LIFO and
  CoDel queues, client-side throttling): named and used here at the depth the cache
  needs. A general reliability collection would own the full treatment; none exists
  yet.

## Ownership

| Item | Owner |
| --- | --- |
| D1 stampede size estimate, M1 | Handling cache misses |
| D2 per-process versus shared coalescing | Handling cache misses |
| D3 efficiency versus correctness lease | Handling cache misses (statement and slow-owner trace); Versioned cache fills (conditional publication protocol) |
| D4 what waiters do | Handling cache misses; Freshness owns whether stale is permitted |
| D5 loader cancellation detached from caller | Handling cache misses |
| D6 refresh timing, XFetch, refresh-ahead, soft and hard TTL, M9 | Handling cache misses |
| D7 jitter across keys | Handling cache misses |
| D8 concurrency or rate limit, Little's law, queue bounds, fleet sum, M8, M11 | Handling cache misses |
| D9 shedding and reduced answers, adaptive throttling | Handling cache misses (decision and outcomes); formula named only |
| D10 cache unavailable: fallback, local copy, gutter, rehash | Handling cache misses; Operating a cache owns topology and failover |
| D11 retries and retry budgets, M7 | Handling cache misses (read path); relational retry-outcomes for writes |
| D12 cold-cache return, warm-up, ramp, M6, M13 | Handling cache misses (mechanism and sizing); Operating a cache (rollout procedure) |
| D13 source-side execution bounds | Handling cache misses (requirement and one PostgreSQL example); relational "Making bounded database calls" (driver detail) |
| D14 batching distinct misses | **Open**: proposed as one short section in Handling cache misses, otherwise Caching with Redis. See scope questions |
| M2 Facebook lease numbers, M4 gutter, M5 lookup cost | Handling cache misses (M5 is also material for Deciding what and where to cache) |
| M3 amplification 1/(1 − h) | Handling cache misses |
| M10 defaults (nginx, PostgreSQL, Redis lease) | Handling cache misses |
| M12 metastable statistics, F3 | Handling cache misses |
| M14 pools do not deduplicate | Handling cache misses |
| T1, T2, T7 source-side views | Handling cache misses (miss-specific reading); Operating a cache (ongoing diagnosis) |
| T3 Redis `INFO stats` | Operating a cache owns it; this article uses it only to show lookup counts are not fills |
| T4, T8 coalescing and admission counters | Handling cache misses |
| T5 memcached meta flags | Handling cache misses (as the server-side alternative) |
| T6 Redis lease output | Handling cache misses; Caching with Redis may reuse it |
| F1 Facebook 2010, F2 Slack 2022, F4–F10 | Handling cache misses (F2's rollout lesson is also Operating a cache material) |
| Vocabulary list | Handling cache misses, except stale set (Freshness) and fencing token (Versioned cache fills) |
| HTTP and CDN caching | Omitted: no collection; process review accepts the omission |
| Consensus locking, Redlock analysis | Omitted: no correctness lock is needed in this collection |
| General overload-control theory | Omitted beyond what this article uses: no reliability collection exists |
| `MGET` fan-out latency | Deciding what and where to cache, or Caching with Redis (open; see scope questions) |
| Fail at Scale (Maurer 2015) | Cited only through the SRE book until re-read |
