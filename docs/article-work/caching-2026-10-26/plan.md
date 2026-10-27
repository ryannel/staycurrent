# Application caching with Redis — 26 October 2026

## Commission and delivery

The user commissions a complete collection for experienced application engineers
with no caching knowledge, through expert design and operation. They explicitly
authorise publication and a push to production when each article is complete.
Use British English, established technical names and connected prose. Each article
must teach its central argument through working illustrations as well as text.
Work alone for this experiment; no delegated writing or review.

Isolated checkout: `/private/tmp/staycurrent-caching-20261026`, branch
`codex/application-caching`, starting at ee809715. The user's primary checkout has
unrelated uncommitted modelling work; do not stage it or include it in deployment.
Publish this branch's verified commits to origin/main, fetching and reconciling any
concurrent upstream commits first. Keep unfinished routes out of builds and reading.

## Reference study (completed)

Read the full Gears and Load Balancing articles in the browser, plus web text.
On Load Balancing, ran the three-requests/second single-server illustration,
increased speed to 3, and observed 93 completed and 93 dropped requests. Started
the two-server comparison at identical arrival rate. Inspected the moving requests,
colour language and local play control. On Gears, moved the fan-speed slider from
middle to stopped to fast; scrubbed the unequal-disc path demonstration from zero
to roughly three quarters, revealing equal unrolled paths despite unequal angles.

Working standard (independent assessment, not copied prose):
- Begin with something the reader can follow before naming the abstraction.
- Preserve visual identities; add one causal complication at a time.
- Ask for a specific change, expose its result, then explain why it happened.
- Use geometry and state to carry the argument, not a dashboard of labels.
- Derive arithmetic from visible quantities. State the assumptions close to it.
- Allow pause, reset and reversible inspection. Support keyboard and small screens.
- Finish each article with a useful engineering decision and its limitations.
- Compare every article's teaching to the references; do not mistake word count,
  UI complexity or a passing build for adequate depth.

References: https://ciechanow.ski/gears/ and https://samwho.dev/load-balancing/

## Collection and dependency plan

| # | Article / route | Reader can do afterwards | Visual argument and practice |
|---|---|---|---|
| 1 | Application caching with Redis (`/caching/`) | Trace cache-aside, distinguish copy from authority, calculate whether reuse repays lookup and fill | Request paths; ordered request reuse; latency/hit-rate distribution; changed source vs cached copy. Native GET/SET/TTL/DEL. |
| 2 | Cache keys and cached values (`keys-and-values`) | Define reusable answers without tenant, permission or schema collisions; choose values and negative caching | Request equivalence and collisions; dependency fan-out; negative-result lifetime. Native strings/hashes and key encoding. |
| 3 | Cache expiration and eviction (`expiration-and-eviction`) | Set freshness budgets and reason about TTL, capacity and access locality independently | Expiry timeline; LRU/LFU working sets; byte capacity and scan pollution. Native expiry, overwrite and maxmemory. |
| 4 | Cache invalidation and consistency (`invalidation`) | Enumerate races; choose TTL, post-commit invalidation, versions or authoritative reads | Interleavable read/write race; stale refill; version/generation protocol; durable invalidation events. Native conditional fill. |
| 5 | Cache stampedes (`stampedes`) | Bound duplicate work during expiry, hot-key misses and cold starts | Concurrent misses; coalescing; jitter histogram; stale-while-revalidate and lease expiry. Native token lease. |
| 6 | Cache failures and graceful degradation (`failure-handling`) | Keep a Redis outage from becoming a database outage | Origin capacity under lost hits; timeout/retry amplification; admission and circuit-breaker recovery. Failure exercise. |
| 7 | Redis clients, latency and pipelining (`clients-and-latency`) | Build bounded request paths, batch correctly, understand client queues and ambiguous outcomes | Network round trips; pipelining vs atomicity; deadline and reconnect queues. Native client worksheet. |
| 8 | Redis transactions and Lua scripts (`atomicity`) | Compose safe Redis-local operations and identify their boundaries | Lost updates; MULTI/EXEC vs WATCH; atomic script; lease vs fencing. Native race and scripts. |
| 9 | Redis memory and performance (`memory-and-performance`) | Size and tune from workload, identify large keys and blocking work | Byte accounting; single command queue; copy-on-write headroom; eviction feedback. Native MEMORY and latency tools. |
| 10 | Redis replication, persistence and failover (`replication-and-failover`) | Choose recovery behaviour and understand acknowledged-write loss | Replication offset and promotion; RDB/AOF timelines; warm restore vs stale data; Sentinel quorum. Native isolated replicas. |
| 11 | Redis Cluster and hot keys (`redis-cluster`) | Design for hash slots, topology changes, multi-key constraints and skew | Slot routing; MOVED/ASK migration; hot key cannot be split by adding shards. Native cluster worksheet. |
| 12 | Client-side caching and cache hierarchies (`client-side-caching`) | Reason across L1/L2 caches and invalidation channels | Copies per process; invalidation disconnect; layered freshness; Redis tracking. Native tracking worksheet. |
| 13 | Operating Redis caches (`operations`) | Secure, observe, diagnose, change and recover a cache service | Correlated incident evidence; hit-rate denominators; rollout/cold-start budget; access boundaries. Incident and ACL exercises. |
| 14 | Designing a production cache (`system-design`) | Assemble a coherent tested cache contract and know when to avoid caching | Product-page system evolves under updates, load and failure; design comparisons and adversarial acceptance cases. Runnable reference application and load/failure lab. |

Scope is application caching. Redis as authoritative storage, streams, search,
vector retrieval and distributed coordination appear only where needed to make a
boundary clear. No attempt to teach every Redis command. The concrete baseline
for native worksheets is the available official Redis 8.2.2 image; later features
must be labelled and researched explicitly. Do not call it the latest release.

## Completion gate for every article

Record primary sources and date, native experiments and version, model invariants,
prose/teaching self-review against both references, keyboard/control checks,
rendered light/dark/narrow review, required build, exact commit/push and deployment
verification. Distinguish illustrative models from observed Redis execution.

## Progress

- Planning and reference interaction complete.
- Article 1 published in commit 48a88755; deployment succeeded and production interactivity verified.
- Article 2 published in commit 382a0d51; deployment and live controls verified.
- Article 3 published in commit 83a5c0a2; deployment and live controls verified.
- Article 4 published in commit 4407397d; deployment and live guarded-refill control verified.
- Article 5 published in commit fc04fb30; deployment and live shared-loading control verified.
- Article 6 published in commit5d7ce0aa; deployment and live bounded-admission control verified.
- Article 7 published in commit c3e84865; deployment and live pipeline control verified.
- Article 8 published in commit dcd369c4; deployment and live WATCH retry verified.
- Article 9 published in commit 5a7dda3a; deployment and live encoding control verified.
- Article 10 published in commit 7fd75ec9; deployment and live lost-invalidation control verified.
- Article 11 published in commit d2ad160e; deployment and live routing/migration controls verified.
- Article 12 published in commit b247be28; deployment and live pending-read/deadline controls verified.
- Article 13 published in commit e0613031; deployment and live ACL/counter/rollout controls verified.
- Article 14 published in commit b35587a0; deployment, live controls, all production URLs and download bytes verified.
- Complete collection audited against the commission; see completion-audit.md.
