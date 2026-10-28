# Deciding what and where to cache

Draft delivered 28 October 2026. Owns benefit, placement and evaluation; mechanisms
for keys, freshness, miss admission, memory, Redis integration and operation stay
with their planned articles. Metadata remains `draft`, parent `index`, order 10.

## Reference preparation

Read all nineteen bounded parts individually through
`python3 scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7, storage
1–6, each with a 4,500-token output allowance and its END marker received. Inspected
the provided render captures `sequences-figure-3.png`, `indexes-figure-1.png` and
`storage-figure-2.png` in `/private/tmp/application-caching-references/`.

The visible work paths follow Sequence diagrams' waits and returned result.
The fixed eight-request trace and counters follow Indexes' counting over a small
complete population. The same local/shared history follows Storage's comparisons
that hold the example steady and change one mechanism.

## Figures and assumptions

- Figure 1 compares record and assembled-card reuse. Layout conveys work order,
  not measured duration. Common response work remains visible.
- Figure 2 starts empty and keeps all entries. The coordinator accepted P3 and P40
  as unnamed public north products with the same locale/currency. They add no
  canonical price facts. Trace: P7, P3, P7, P7, P40, P7, P3, P7; five hits, three
  source reads. No expiry, update, eviction, concurrency or failed fill.
- Figure 3 uses constant C=2 ms, S=20 or 2 ms, W=3 ms. The fill is synchronous;
  common response work is excluded. No overlap, failures, refresh work or queueing;
  source cost does not change under load in the model. The twenty explicit times
  supply the nearest-rank p95; no percentile is inferred from the mean. The body
  describes why real contention invalidates the constant-time simplification.
- Figure 4 uses the shared player and a common `placement.mjs` data record for the
  live drawing and complete text alternatives. Local/shared setting preserves the
  current step. A fills at t0, B asks at t10, source changes to revision 2 at t20,
  A asks at t31 and B at t32. Insertion TTL is 30 seconds; reads do not extend it.
  This approved TTL-only variation omits invalidation deliberately. Source reads
  and fills are sequential and instantaneous in model time. Local ends A=22/B=20,
  three source reads; shared ends22, two source reads and four remote lookups.
  Shared cache fills also use the network, explicitly excluded from lookup count.

## Primary-source checks

Opened on 28 October 2026:

- https://aws.amazon.com/builders-library/caching-challenges-and-strategies/ —
  first-hand local/shared and cold-cache operational concerns.
- https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside —
  lookup/source/fill path and the independent-copy consistency limitation.
- https://sre.google/sre-book/monitoring-distributed-systems/ — latency
  distributions versus averages.
- https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/
  — benchmark workload and environment parameters.
- https://github.com/ben-manes/caffeine and its wiki/Statistics — in-memory
  implementation, size and expiry controls, hit/load statistics.
- https://docs.memcached.org/ — key/value storage of assembled data.
- https://valkey.io/topics/introduction/ — shared in-memory store and data operations.

No native Redis, database or performance execution is claimed for this article.

## Model checks and continuity

A Node assertion run checked all 42 combinations of hit count 0–20 and S=2/20.
Explicit populations agree with the weighted mean and nineteenth-order p95.
Default mean6.6 ms; cheap-source mean3 ms; layer example80 +20×.75=95 checked.
Final placement counts, expiry times and returned prices checked against the data.

Reread complete article and figure explanations in reader order. Identity is
introduced before the reuse trace depends on it; one lookup per card stays the
unit. Source-work savings are distinct from latency and CPU. P7's north/en-GB/GBP
context, GBP20→22 and revisions1→2 match the shared example. Checkout retains
source transaction and stock checks. TTL is insertion retention, never a universal
source-age bound. Shared placement does not claim coherence or transactional
agreement. Local/shared comparison is explicitly one history. Link titles use
canonical node titles where naming whole articles.

Coordinator owns build, built dense-prose check, rendered desktop/375px light/dark
inspection and control/keyboard checks. These are pending at handoff. No server,
build, review team, commit or publication was started by this writer.
