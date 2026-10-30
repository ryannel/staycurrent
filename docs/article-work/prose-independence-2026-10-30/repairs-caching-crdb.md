# Repairs: application caching and CockroachDB

Completed 30 October 2026. Scope: all nine application-caching articles and all
ten CockroachDB articles. This follows the independent first review in
[baseline-caching-crdb.md](reviews/baseline-caching-crdb.md), using the revised
write, revise, continuity, figures and review skills. All accepted substantive
prose-independence findings in that review are repaired. The eight independently
reviewed core articles are owned by the coordinator and are not edited here.

## Completed article work

Every row below includes a complete finished read with visual components,
figure contents, captions and controls omitted. Ordinary explanatory tables,
SQL and textual code remain article content. Later small changes were checked
again through their affected explanation and dependencies. The coordinator’s
integrated density check prompted the retention trace’s ordinary four-row table,
which preserves the exact input without a crowded sentence.

| Article | Repair and final reading result |
| --- | --- |
| application-caching/index | Explained miss/fill/hit directly; established two servers receiving all three products before the six-versus-three fill count; stated commit/delete and late-fill orders; explained four callers versus one shared read and LRU without a depicted victim. Complete prose-only read passes. |
| application-caching/cache-benefits | Rebuilt the numerical explanation around the exact eight-request trace, explicit lookup/source/fill costs, two twenty-request hit mixes and the nearest-rank p95 definition. Named independent local-copy fill/expiry times before deriving a possible backwards price. Complete prose-only read passes. |
| application-caching/cache-keys | Introduced the complete key in the body and supplied both distinct field tuples that collide under naïve colon joining. Kept this relaxed identifier domain separate from the validated baseline. Complete prose-only read passes. |
| application-caching/cache-memory | Rebuilt retention around the exact eighteen requests in a compact phase table, initially empty budget, charged entry sizes, entry limits, costs and policy rules. Derived the large-result eviction, preserved favourites, LFU failure, admission trade and saved-work totals. The reread additionally caught and repaired definition order, LFU tie handling and the second-request policy’s LRU eviction rule. Complete prose-only read passes. |
| application-caching/cache-misses | Established all arrival/completion, lease-expiry and queue/deadline inputs before deriving duplicate reads, overlapping owners or missed deadlines. Named the recovery and failure cases directly. Complete prose-only read passes. |
| application-caching/freshness | Joined the read-old/commit/delete/late-fill race into one continuous explanation and related the outbox limitation to that race directly. Preserved age, dependency and revision reasoning. Complete prose-only read passes. |
| application-caching/operating-caches | Stated acknowledged deletion, asynchronous replica lag and promotion order; supplied the illustrative rollout’s traffic share and source allowance directly. Complete prose-only read passes. |
| application-caching/redis | Introduced the simplified source-read/encode/optional-fill code directly. Its existing prose already carried the implementation and limitations independently. Complete prose-only read passes. |
| application-caching/versioned-fills | Stated the exact accepted old publication while invalidation remains unheard, then explained why matching permission does not establish the latest source version. Complete prose-only read passes. |
| relational-rebuild/crdb-architecture | Established gateway/serving owners, customer-index lookup, agreement/application boundary, local log responsibilities and the P3 versus P7/P9 split/move/lease example in prose. Complete prose-only read passes. |
| relational-rebuild/crdb-backup | Stated both restore choices against the event order, named full A/increment B/increment C before dependency reasoning, and explained provider-result branches directly. Kept the observed revision-history default discrepancy. Complete prose-only read passes. |
| relational-rebuild/crdb-locality | Explained North/West request paths and loss of one West zone versus all West before the majority consequences. Kept declared policy distinct from observed placement. Complete prose-only read passes. |
| relational-rebuild/crdb-migration | Distinguished purchase and acknowledgement identities, stated the first retained target work’s effect on return, and explained the fresh reverse candidate and state that must return. Complete prose-only read passes. |
| relational-rebuild/crdb-operations | Established A/B/C voters and D’s learner/catch-up role before membership reasoning; explained the actual RLS query/context case, remaining destinations and removal sequence directly. Complete prose-only read passes. |
| relational-rebuild/crdb-performance | Supplied both processors’ partial contributions and final aggregation, including the no-saving tiny case; established same-customer hash inputs and read costs. The final reread found A/B’s lock-holder/updater setup only inside the figure and added it to the body. Complete prose-only read passes. |
| relational-rebuild/crdb-reads | Stated the read/commit/read isolation schedule, both payment attempts accepting against zero and committing forty against twenty-nine, and the closed-time versus applied-history distinction. Complete prose-only read passes. |
| relational-rebuild/crdb-schema-change | Established the backfilled-P7/update/missing-P9 dependency directly. A consequential source check also corrected the mechanism to temporary-index capture followed by merge, rather than literal concurrent maintenance of the same backfilled index. The finished explanation preserves its simplified-stage limit. Complete prose-only read passes. |
| relational-rebuild/crdb-transactions | Defined native T separately from the durable logical request, then explained listed-write evidence, implicit commitment and unchanged/conflicting read refreshing without playback. Retained the textual retry pseudocode. Complete prose-only read passes. |
| relational-rebuild/crdb-upgrades | Established A/B/C’s rolling binaries and held versus finalised compatibility version in prose; retained the actual incomplete finalisation observation and the beginning-of-finalisation return boundary. Complete prose-only read passes. |

## Exact example provenance and arithmetic

The numerical repairs use the existing implementations; no replacement trace was
invented while retaining old totals.

- `src/components/application-caching/stories/choice.mjs`: the eight requests are
  mug, mug, spoon, mug, bowl, mug, spoon, mug. The cost comparison uses lookup 2 ms,
  source 20 ms, fill 3 ms; its cheaper-source case uses 2 ms and its additional-hit
  case uses nineteen hits. These produce 6.6 ms and 3 ms means, and the threshold
  above approximately 21.7%, as stated.
- `src/components/application-caching/memory/model.mjs` and the capacity story:
  P7=mug, P3=jug, P8=spoon, P9=bowl, P40=vase, Q=catalogue. The eighteen-request
  trace, 1 KiB cards/3 KiB catalogue and two/twelve/twenty source-work charges are
  preserved. Executing the existing replay confirmed default ten hits/fifty
  saved units out of ninety-four, and with a 1 KiB entry limit: LRU at 2 KiB saves
  fifty; at 3, 5 or 8 KiB saves fifty-four; LFU saves twelve; second-request saves
  thirty-six. Entry fills count as uses; LFU breaks frequency ties by recency.
- `src/components/application-caching/misses/model.mjs`: checked arrivals at
  0/20/40/60 ms, completion before a same-time arrival, the lease overlap and the
  six-distinct-key/two-slot/two-queue/deadline examples before using their results.
- CockroachDB examples were checked against their existing model definitions and
  original source labels. Illustrative processor contributions, replicas,
  request identities, backfill updates and version states remain separate from
  native observations.

## Primary-source checks

Expanded consequential mechanisms were checked against the primary sources
already cited by the articles. These checks preserve the existing evidence
boundary; they do not turn a teaching schedule into a new execution result.

- [Microsoft Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside): source update before cache deletion and independent local copies.
- [Redis scripting](https://redis.io/docs/latest/develop/programmability/eval-intro/) and [replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/): atomic comparison/replacement; asynchronous replicas, lost acknowledged writes and WAIT’s limits.
- CockroachDB v26.2 [replication layer](https://docs.cockroachlabs.com/docs/v26.2/architecture/replication-layer), [transaction layer](https://docs.cockroachlabs.com/docs/v26.2/architecture/transaction-layer), [SQL layer](https://docs.cockroachlabs.com/docs/v26.2/architecture/sql-layer), [Read Committed](https://docs.cockroachlabs.com/docs/v26.2/read-committed) and [hash-sharded indexes](https://docs.cockroachlabs.com/docs/v26.2/hash-sharded-indexes): voter versus replica/application boundaries, STAGING plus required writes, refresh, processor distribution, write skew and full-key versus prefix hashing.
- [Online schema changes](https://docs.cockroachlabs.com/docs/v26.2/online-schema-changes) and [MVCC bulk ingestion and index backfills](https://www.cockroachlabs.com/blog/bulk-ingestion-and-index-backfills/): descriptor coordination, temporary capture of concurrent changes and merge before availability. This check prompted the scoped technical clarification above.
- [Self-hosted upgrades](https://docs.cockroachlabs.com/docs/v26.2/upgrade-cockroach-version): rolling replacement, automatic finalisation, testing hold and return boundary.

The existing index-build animation deliberately compresses maintenance into one
index and selected phases. It omits the temporary capture/merge structure now
explained in the article. Any further illustration-specific qualification belongs
in its caption; this limitation is recorded here so it creates no dangling prose
if the animation is removed. The visual implementation was preserved for the
coordinator’s integration check.

## Continuity and preservation

The caching collection still uses public display cards in shop north, P7 at GBP
20.00/revision 1 changing to GBP 22.00/revision 2, the complete format-v1 key and a
thirty-second insertion TTL distinct from observation age. Checkout remains an
authoritative transactional decision. The retention names are local illustrative
identities; their charged bytes and work units do not claim Redis allocation or
latency measurements.

CockroachDB experiments remain independent branches of the shared shop. The
purchase starts with P3/P7/P9 stock 12/1/4 and leaves 10/0/4, pending order 103,
two agreed lines totalling 29.00 and no payment. Separate catalogue updates do not
reprice the agreement. Recovery’s provider payment 504 and isolation’s 601/602
attempts remain separate cases. Request identity, outbox work, native transaction
identity, backup history and compatibility version remain distinct.

A scoped Astro-AST comparison with HEAD confirmed unchanged frontmatter,
imported component invocations (including Sql/Code), complete static figures,
SVG, scripts and styles for all nineteen files. Routes/status, SQL, downloadable
labs, native observations and model implementations are unchanged. `git diff
--check` passed for the assigned articles. Astro parsing succeeded during the
prose extraction/integrity checks.

No build, new native database/lab execution, browser rendering, commit or push was
performed. The coordinator owns integration, rendered checks and final review.
