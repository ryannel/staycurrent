# Collection plan

The recurring application is a small ceramics shop. Public product descriptions,
prices, personalised responses and checkout have different reuse and correctness
requirements. Extend this example only where the extension helps explain a new
mechanism. All model timings and traffic are invented unless explicitly measured.

| Order / slug | Article and resulting understanding | Visual argument and practice |
| --- | --- | --- |
| 1 / introduction | **Keeping a copy of the answer.** Repeated work, cache-aside, hit/miss, saved work versus latency, workload locality, copies versus authority, Redis GET/SET/DEL and expiry. | Follow a request through miss and hit; vary reuse and source cost; concentrate requests; update a source while its copy stays still. Execute a first Redis conversation. |
| 2 / keys-and-values | **Which answer belongs under this key?** Equivalence of requests, tenant and authorisation scope, canonicalisation, negative caching, serialisation, schema versions, object size and choice of Redis types. | Merge and separate requests by omitted inputs; assemble a key; compare whole-value and field updates; test absence versus a cached negative result. |
| 3 / freshness | **How old is this answer?** TTL, absolute deadlines, stale-while-revalidate, dependency invalidation, commit/delete ordering, slow fills, source lag, read-your-writes, versioned publication and durable change delivery. | Scrub a source/cache timeline, move read/fill around writes, carry observation time into an expiry deadline. Execute TTL and old-fill races. |
| 4 / stampedes | **When everyone misses together.** Per-key request coalescing, cross-process leases, ownership-checked release, fencing limits, TTL jitter, probabilistic early refresh and bounded refresh concurrency. | Fan requests into one origin operation, expire a lease while its old owner runs, spread deadlines, compare hot-key and many-key bursts. |
| 5 / memory | **Making room for useful answers.** Working set, reuse distance, admission, approximate LRU/LFU, volatile/allkeys/noeviction, memory overhead, fragmentation, buffers, expiry versus physical reclamation, large keys and UNLINK. | Sweep a repeated trace through finite slots, interleave scans, budget bytes rather than keys, inspect real MEMORY/INFO/eviction behaviour. |
| 6 / the-redis-server | **Inside a Redis request.** Client/socket/queue/command/reply, main execution and I/O, bounded command work, data structures and encodings, slow commands, transactions, scripts/functions and atomicity without rollback. | Queue a tiny request behind a large operation, open a hash, interleave commands then execute an atomic bounded script. |
| 7 / clients-and-latency | **The journey between application and Redis.** Round trips, connection reuse, pooling/multiplexing, pipelining and bounded batches, timeouts versus cancellation, retries, reconnect/offline queues, local caches and client tracking. | Pack requests into network flights, vary batch size, lose a reply after execution, disconnect an invalidation stream. Measure a bounded local workload. |
| 8 / failure-and-overload | **When the fast path disappears.** Cold starts, failure budgets, origin capacity, bulkheads, circuit breakers, load shedding, deadlines, stale fallback, warm-up and recovery feedback. | Remove a cache from a live flow, queue excess origin work, recover without synchronised retries; run an application failure drill. |
| 9 / replication-and-failover | **A second copy is not the same promise.** Async replication, offsets/backlog/full sync, stale reads, primary loss, Sentinel quorum/election and client discovery, WAIT scope and lost invalidations. | Pause the replication stream, promote a lagging replica, return a deleted key, partition observers; run a disposable failover lab. |
| 10 / clustering | **Dividing the keyspace.** Hash slots, CRC16/hash tags, same-slot operations, MOVED/ASK, resharding, cluster quorum/failure, hot keys, replica reads and capacity per shard. | Place keys into slots, migrate a slot while clients run, saturate one shard despite spare total capacity; execute a local cluster exercise. |
| 11 / persistence-and-recovery | **What should survive a restart?** Rebuildable cache versus authoritative Redis state, RDB/AOF/fsync, fork/COW memory, replay/expiry, backups, restore and freshness, RPO/RTO, restore traffic budgets. | Cut a timeline at snapshot/log/fsync points, rewrite while changing pages, restore an old copy against a changed source; run isolated recovery checks. |
| 12 / coordination | **When Redis stops being just a cache.** Counters, rate limiting, idempotency, leases versus locks, sessions, queues/Streams versus Pub/Sub, expiry and eviction implications, correctness at an authoritative resource. | Race counter/expiry operations, cross a fixed-window boundary, let an expired worker write, lose a deduplication record; derive boundaries for each use. |
| 13 / operating-redis | **Keeping Redis useful in production.** Workload-led metrics, hit-rate denominators, tail latency, saturation, stale/error measures, ACL/TLS/network isolation, tenant privacy, upgrade/client compatibility, maintenance, managed-service responsibilities, capacity and cost. | Diagnose several incidents from changing evidence, separate command latency from app latency, scope a credential, roll a client/schema change. Runnable observation worksheet. |
| 14 / designing-a-cache | **Designing the whole path.** A worked application from measured need to keys, consistency, capacity, rollout and deliberate failure. Compare no cache, local, shared and layered designs; review operational and correctness guarantees. | Editable integrated workload with independent freshness/failure/capacity choices; runnable reference application and drills; design exercises with explained answers. |

## Boundaries and progression

The first five articles build the application model. Six and seven open the
implementation. Eight through eleven explain failure and distribution. Twelve
distinguishes cache use from authoritative coordination. Thirteen and fourteen
bring the mechanisms into daily operation and whole-system design. Each article
recalls only the prerequisites it needs and links back to their owner.

This collection does not attempt a command encyclopaedia, Redis Search/vector
retrieval tutorial, or general database course. Explain relevant version/product
differences where used, and record the exact Redis version tested. Avoid claims
about an unverified latest version or the properties of a managed service based
solely on Redis Open Source behaviour.

## Delivery ledger

- Planning and reference study: complete.
- Article 1: published and production interaction verified; see `publication.md`.
- Article 2: complete; publication in progress.
- Articles 3–14: planned, not published.
- Whole collection: in progress; do not mark the goal complete until all articles,
  practical materials, navigation and production checks are complete.
