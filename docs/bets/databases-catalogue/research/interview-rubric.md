# Research digest: the principal-interview data-layer rubric

> Discovery input to the `databases-catalogue` bet (researched 2026-07-16). This is the
> yardstick the pitch's success signal cites: the competencies and archetypes the finished
> catalogue must map to live, provenance-cited sections. Sources listed at the end seed
> per-piece provenance at authoring time.

## How principal is scored differently

The level ladder across credible rubric sources: **senior** is scored on tradeoff reasoning
(name each choice, alternatives, failure modes; be decisive). **Staff** adds end-to-end
operational ownership — monitoring, rollback, cost, evolution; an answer that "stays in the
design lane" is an explicit staff-level reject. **Principal** adds problem definition — push
back on requirements, decide what does *not* need to scale, build-vs-buy. The dominant
anti-signal is breadth-as-bluff: twenty technologies reasoned shallowly scores below three
decisions reasoned deeply.

**The teachable unit this implies (adopted as the catalogue's house format):** for every
mechanism, the quadruple — *decision enabled → downside accepted → failure mode → the estimate
that triggers reaching for it*.

## The 11 competencies

| # | Competency | The principal separator (vs the senior baseline) |
|---|---|---|
| 1 | Requirements → access patterns | Interrogates the prompt into concrete read/write patterns, SLOs, freshness tolerance; enumerates the exact queries; scopes what does NOT need to scale |
| 2 | Capacity / back-of-envelope | Numbers drive a decision, not ritual: QPS + peak factor, storage = writes × retention × RF, Little's Law, working-set-in-RAM via the memory hierarchy, physical ceilings deciding when sharding is real |
| 3 | Schema & indexing | Keys designed from access patterns; index = write amplifier + consistency surface; local vs global secondary indexes; covering indexes; deliberate single-table denormalization |
| 4 | Normalization vs denormalization | Framed as read/write + consistency trade bound to ratio and freshness; names who owns truth and how copies converge (rebuild, CDC, versioning) |
| 5 | Replication & consistency selection | Consistency chosen per access path; quorum math (W+R>N) and why quorums aren't linearizable under LWW/sloppy quorums; leaderless/Dynamo with its price (read-repair, hinted handoff); PACELC for the normal case; weakest consistency that preserves the product invariant |
| 5b | Consensus | Raft/Paxos conceptually, leader election, linearizable reads (read-index/lease), where it lives (etcd/ZooKeeper; Raft-based engines) |
| 6 | Partitioning & hot keys | Partition key matches dominant access pattern AND spreads load; the mitigation toolkit — salting, splitting, write-sharding, hybrid fanout for celebrities; rebalancing cost; scatter-gather price |
| 7 | Transactions across partitions | 2PC's blocking cost named; Saga + compensation; idempotency as a first-class data concern (key → request_hash/response/status); outbox for exactly-once effects; Spanner/TrueTime as the "buy it" option |
| 8 | Caching & invalidation | Pattern chosen from the consistency/latency trade (aside / through / behind); stampede & thundering herd mitigations (coalescing, jitter, probabilistic early expiry); hot keys; sized from the working-set estimate |
| 9 | Derived data / CDC / search sync | Dual writes recognized as unsafe; outbox + CDC (WAL tailing); derived stores as deterministically rebuildable views; backfill/replay as the rebuild story |
| 10 | Multi-region | Topology per consistency need (leader-per-region, active-active + LWW/CRDT conflict resolution, Spanner-global); read-local/write-home; RPO/RTO; data residency |
| 11 | Failure modes & operations | Proactively enumerated: replication lag as user-visible correctness, backpressure/DLQ, retry storms, compaction stalls, graceful degradation, migrations/backfill, cost. The #1 separator — woven through every piece via the quadruple's failure-mode slot |

## The 10 question archetypes and their data-layer crux

1. **Feed/timeline** — fanout-on-write vs read; celebrity hot key; hybrid push/pull; denormalized timeline cache; ~100:1 read/write justifying precompute.
2. **Money ledger/payments** — double-entry append-only immutability; deliberate CP; idempotency keys; reconciliation; Saga + outbox over 2PC.
3. **Chat store** — wide-column for write throughput + time-ordered reads; `(conversation_id, message_id DESC)`; media in object storage; queue decoupling delivery from persistence.
4. **Metrics/observability (TSDB)** — cardinality as the design constraint; rollups/downsampling; tiered retention; OLTP/OLAP separation.
5. **URL shortener** — coordination-free ID generation (KGS, range allocation); extreme read ratio → cache + CDN; 301/302 semantics.
6. **Rate limiter's store** — algorithm → state shape; shared store with atomic updates; fail-open vs fail-closed.
7. **Notification system** — at-least-once + application-level dedup; priority queues; outbox; DLQ; delivery state machine.
8. **Search/typeahead** — trie with precomputed top-K (rank at write time); inverted index kept in sync via CDC (derived data).
9. **Ride-hailing geo** — geospatial index families (geohash/quadtree/S2/H3); high-frequency location writes; hot dense cells.
10. **Distributed KV/object store** — consistent hashing; N/W/R tuning; versioning; anti-entropy (the purest test of #5).

## v2 coverage map (the gap evidence the pitch cites)

The live `topics/databases/article.md` (v2, 2026-07-16) against the rubric:

| Competency | v2 status |
|---|---|
| 1 Requirements → patterns | Partial — choose-by-access-pattern exists; the derivation *skill* (enumerate queries, scope what doesn't scale) is absent |
| 2 Capacity/BOE | **Missing** |
| 3 Schema & indexing | Partial — index economics exist; active key design, covering/composite, local-vs-global absent |
| 4 Normalization vs denorm | **Missing** (as a taught trade) |
| 5 Replication & consistency | Partial — single-leader, sync/async, RYW/monotonic, CAP/PACELC present; quorums, leaderless, linearizability absent |
| 5b Consensus | **Missing** |
| 6 Partitioning & hot keys | Partial — range/hash, hot keys named; the mitigation toolkit and secondary-index partitioning absent |
| 7 Cross-partition txns | Partial — 2PC named; Saga, idempotency, outbox, Spanner absent |
| 8 Caching | **Missing** (named as a Redis exit only) |
| 9 Derived data/CDC | **Missing** (HTAP brush only) |
| 10 Multi-region | Partial — PACELC only; topologies and conflict resolution absent |
| 11 Failure/operational lens | Partial — failover, compaction stalls present; not systematic |

Net: four competencies missing outright (2, 5b, 8, 9 — with 4 missing as a taught trade),
seven partial. Prioritized additions by impact × recurrence: capacity estimation; caching +
invalidation; deep consistency + consensus; derived data/CDC/outbox; idempotency + Saga;
multi-region topologies; the operational lens woven throughout.

## Sources

Evaluation criteria / level differentiation:

- [Hello Interview — 5 Keys to Staff-Level System Design](https://www.hellointerview.com/blog/staff-level-system-design) — staff/senior separators; crux-finding; decision-making over enumeration.
- [Hello Interview — What Your System Design Interviewer Is REALLY Judging](https://hellointerview.substack.com/p/what-your-system-design-interviewer) — scored dimensions; trade-off navigation; missing-operations red flag.
- [DesignGurus — System Design Interview Expectations by Company and Level](https://designgurus.substack.com/p/faang-system-design-interviews-by) — L5/L6/L7 differentiation; the design-lane reject criterion.
- [AssessAI — Rubric-Based System Design Evaluation](https://getassessai.com/blog/how-to-evaluate-system-design) — rubric weighting by level.

Estimation and canon:

- [DesignGurus — Back-of-the-Envelope Estimation](https://www.designgurus.io/blog/back-of-the-envelope-system-design-interview) — QPS/peak, storage, bandwidth, Little's Law.
- [Latency Numbers Every Programmer Should Know (jboner gist)](https://gist.github.com/jboner/2841832) — memory hierarchy for working-set and cross-region reasoning.
- [System Design Primer — Twitter solution](https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/twitter/README.md) — worked capacity example; fanout; timeline cache.
- DDIA chapter summaries: [Ch.5 replication](http://muratbuffalo.blogspot.com/2024/09/ddia-chp-5-replication-part-2.html), [leaderless](https://www.clemsau.com/posts/designing-data-intensive-applications-replication-part-4-leaderless-replication/), [Ch.6 partitioning](https://xgwang.me/posts/ddia-6-partitioning/), [Ch.9 consistency](https://timilearning.com/posts/ddia/part-two/chapter-9-1/) — quorums, LWW non-linearizability, secondary-index partitioning.
- [Secondary Index Partitioning Strategies](https://primitives.pub/distributed-systems/monographs/secondary-index-partitioning) — local vs global tradeoffs.
- [Raft paper](https://raft.github.io/raft.pdf); [Paxos vs Raft (GfG)](https://www.geeksforgeeks.org/system-design/paxos-vs-raft-algorithm-in-distributed-systems/) — consensus, linearizable reads.
- [YugabyteDB — Percolator vs Spanner](https://www.yugabyte.com/blog/implementing-distributed-transactions-the-google-way-percolator-vs-spanner/) — TrueTime external consistency and its cost.
- [Baeldung — 2PC vs Saga](https://www.baeldung.com/cs/two-phase-commit-vs-saga-pattern) — blocking vs compensation.
- [Levelop — Caching Strategies + Failure Modes](https://levelop.dev/blog/caching-strategies-system-design-four-patterns-failure-modes) — patterns, stampede, hot key.
- [Thorben Janssen — Outbox with CDC and Debezium](https://thorben-janssen.com/outbox-pattern-with-cdc-and-debezium/); [AlgoMaster — CDC](https://algomaster.io/learn/system-design/change-data-capture-cdc) — dual-write hazard; WAL tailing; CQRS/search sync.
- [Redis — Active-Active vs Active-Passive](https://redis.io/blog/active-active-vs-active-passive/); [Oracle — CRDTs](https://blogs.oracle.com/nosql/global-active-tables-and-conflict-free-replicated-data-type-crdt) — multi-region conflict resolution.
- [AWS — DynamoDB NoSQL modeling](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql.html); [Alex DeBrie — Single-Table Design](https://www.alexdebrie.com/posts/dynamodb-single-table/) — access-patterns-first schema design.

Archetype-specific:

- [techinterview — Twitter feed](https://www.techinterview.org/post/3233474168/system-design-twitter-news-feed-timeline-fanout-on-write-fanout-on-read-celebrity-problem-ranking-caching/); [System Design Handbook — Payments](https://www.systemdesignhandbook.com/guides/design-a-payment-system/); [Prachub — Ledgers/Idempotency/Reconciliation](https://prachub.com/concepts/payment-systems-ledgers-idempotency-and-reconciliation); [Pragmatic Engineer — Payment System](https://newsletter.pragmaticengineer.com/p/designing-a-payment-system); [DesignGurus — WhatsApp](https://designgurus.substack.com/p/designing-whatsapp-in-45-minutes); [techinterview — Chat](https://www.techinterview.org/post/3233465319/system-design-chat-application/); [Netdata — Metric Cardinality](https://www.netdata.cloud/academy/metric-cardinality-in-observability/); [ClickHouse — Retention/Rollups](https://clickhouse.com/blog/three-villains-agentic-observability); [systemdesign.one — URL Shortener](https://systemdesign.one/url-shortening-system-design/); [karanpratapsingh — URL Shortener](https://www.karanpratapsingh.com/courses/system-design/url-shortener); [Hello Interview — Rate Limiter](https://www.hellointerview.com/learn/system-design/problem-breakdowns/distributed-rate-limiter); [Redis — Rate Limiting](https://redis.io/tutorials/howtos/ratelimiting/); [Ajit Singh — Notifications](https://singhajit.com/notification-system-design/); [DesignGurus — Notifications](https://designgurus.substack.com/p/system-design-case-study-how-to-design-75c); [System Design School — Typeahead](https://systemdesignschool.io/problems/typeahead/solution); [Educative — Typeahead](https://www.educative.io/courses/grokking-the-system-design-interview/system-design-the-typeahead-suggestion-system); [intervu — Ride-Sharing](https://intervu.dev/blog/ride-sharing-uber-lyft-system-design/); [Location Indexing Guide — Geohash/Quadtree/S2/H3](https://joudwawad.medium.com/location-indexing-complete-guide-36a143569555).
