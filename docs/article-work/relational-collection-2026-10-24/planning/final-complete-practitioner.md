# Practitioner review · tree · complete 58-article relational collection · final-v03

Inputs read: the complete frozen `final-v03/tree.yaml` (all 1,934 lines), `example.md`, `routes.md`, `commission.md`, `primary-sources.md`, `deferred-foreign-key-native.json`, `core.json` and `values.json`, plus `manifest.json`. Review instructions: `.agents/skills/staycurrent-review/SKILL.md` and only `perspectives/practitioner.md`.

Highest severity: none.

Role: fresh independent complete practitioner reading, tree mode. This was a new technical challenge over the complete current plan, not an informed repair confirmation. No previous plan, review, finding, decision, writer note or historical record was read. Historical references embedded in the allowed files were treated as provenance and not followed. `articles.json` was withheld by the assignment and not read. No prose, rendered article, other perspective, build, publication or production system was reviewed. No delegation occurred.

Started: 2026-10-23 23:30:19 UTC (2026-10-24 01:30:19 Europe/Stockholm).
Completed: 2026-10-23 23:35:16 UTC.
Frozen manifest timestamp: 2026-10-23T23:30:01.153829+00:00.
Manifest version: `plan-v03 with accepted E8 facts`.

## Input integrity and reading completeness

All eight permitted content-file SHA-256 values match the manifest. The manifest itself had SHA-256 `089a4f1688e75509f08b43b0529d3c40730d324383dbd2134abb96f4eb774faf` when read.

| File under `planning/final-v03/` | SHA-256 verified |
| --- | --- |
| tree.yaml | `7cc00e203f1b4cee6d036ab8818c3f285eafe6f8a94632f4a36f9688c78f91f6` |
| example.md | `8a4e7e9d45fd9ca2b43b54a918603a6b04a531c707853919eea125ca0627681a` |
| routes.md | `baf064deb54cb9b707a1541d32797dda0f672943731687d6b641789bb20db96e` |
| commission.md | `ad5c6537dfa1677737fd23bae0c3c7d1ee9a360b59450db64b30a89a1803e3b8` |
| primary-sources.md | `c7157e3a20896f067dda2fce8c8d652ab0b5fed0312e5d0df737a82eee6b6597` |
| deferred-foreign-key-native.json | `9a15262554609028c8b4d3a49c34dd329710d7d696fc6ba14b9e19e8bb2cc653` |
| core.json | `bdae3259a820ed6a81e7f3e95dabce8bcc7a03eae11ff0a1f09cbe1d2d46948c` |
| values.json | `cf6a8156fefb35db4723e837a78bc0d925ebbfb952dcb23714bfcf3817c1439c` |

Tree delivery was bounded at lines 1–210, 211–450, 451–710, 711–970, 971–1230, 1231–1490, 1491–1740 and 1741–1934. A combined output clipped part of the final tree segment; lines 1800–1934 were read again to recover it. The native record was read completely, including its results, 19 command records, tool inventory and limits. The withheld inventory's hash was not independently checked: reading it would exceed this assignment's permitted inputs.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Consequential plan premises were challenged against official PostgreSQL 18, CockroachDB v25.4, Citus, pgvector and Spanner sources; no false promise found at plan level. |
| 2. Evidence | pass | Conceptual schedules, toy data, geography and future experiments are labelled; the supplied deferred-FK run is narrow and versioned. Availability of binaries is not promoted into article execution evidence. |
| 3. Coverage | pass | All 58 destinations have useful outcomes and practical failure cases; the complete task routes cover design, correctness, performance, concurrency, recovery, security, changes and distribution. |
| 4. Depth, both ways | pass | Mechanisms develop beyond definitions into decisions and counterexamples, while product experiments and specialist retrieval stay in their owners. No missing necessary mechanism or gratuitous specialist prerequisite was identified. |
| 5. Ownership | pass | 58 article records, 58 distinct IDs and no dangling prerequisite IDs or prerequisite cycles. Every required subject has one principal owner; conceptual/native pairs have distinct explanatory and operational work. |

## Complete ownership and depth assessment

This table records the substantive owner checked for every destination, rather than treating the presence of a title as coverage. The brief, outcomes, entry understanding, prerequisites, neighbours and all headings were read for each.

| Article | Principal owned understanding and useful stopping point | Deeper boundary checked |
| --- | --- | --- |
| RL76 | Shared relational facts, guarded purchase, first task choice | Preserved introductory source; deeper ownership is annotated, not commissioned as edits |
| RL77 | Row meaning, candidate/composite identity, dependencies, deliberate duplication | Values RL78, enforcement RL79, history RL80 |
| RL78 | Money precision, instants/zones, text equality, NULL and ordering | Declared rules RL79; join grain RL81 |
| RL79 | Row/identity/reference enforcement, tenant integrity, limits of cross-row checks | Concurrent protocol RL90/RL91 and authority RL104 |
| RL80 | Agreement versus current value, effective versus recorded time, correction/deletion | Partition retention RL89 and disaster recovery RL96 |
| RL81 | Result grain, multiplication, missing matches and reusable query shape | Calculations RL82; physical work RL87 |
| RL82 | Grouping versus windows, peers, frames, deterministic output | Continuation/export contract RL83 |
| RL83 | Keyset continuation versus fixed-membership export and reader lifetime | Distributed safe history RL107; resource budgets RL102 |
| RL84 | Conditional affected-row writes and replayable import conflict policy | Ambiguous result RL93; changing live representation RL100 |
| RL85 | Bound values, generated SQL, owned transaction connection, cancellation/error lifecycle | Request identity RL93; pool capacity RL102; engine move RL132 |
| RL86 | Access work, key order, selectivity, coverage, write/space cost | Whole plans RL87; PostgreSQL contracts RL112 and lifecycle RL119 |
| RL87 | Operators, estimates, loops, state, spills, parallel/network work | Initial triage RL103; product measurements RL113/RL126 |
| RL89 | Partition pruning and lifecycle, keys/references, safe retention | Cross-node distribution RL105 |
| RL90 | Atomic boundary, snapshots, one-row versus multi-row invariant and serial outcomes | Complete guard/snapshot protocol RL91; uncertain outcome RL93 |
| RL91 | Lock authority including empty sets, stale snapshots, waits, order and deadlocks | Admission RL102; initial incident evidence RL103; native wait tools RL120 |
| RL92 | Old versions, layout alternatives, retention, reusable space and write amplification | PostgreSQL pages RL110, vacuum/age RL111 and crash ordering RL95 |
| RL93 | Known abort versus unknown commit, stable request identity and payload conflict | External effect/worker protocols RL94; native CockroachDB errors RL124 |
| RL94 | Atomic outbox intention, duplicate effect boundary, claims, leases and fencing | Change-stream implementation RL118; primary fencing RL98 |
| RL95 | Log-before-page ordering, acknowledgement, crash replay and failure boundary | PostgreSQL WAL RL115; lost-storage recovery RL96; remote copies RL97 |
| RL96 | Recovery objective/chain/target plus closed-history reconciliation | PostgreSQL PITR RL116 and CockroachDB restore RL129 |
| RL97 | Received/durable/replayed progress, read-your-write routing, lag and loss | Promotion authority RL98; physical native evidence RL117 |
| RL98 | Suspicion versus authority, fencing, candidate/loss budget and divergent return | PostgreSQL promotion RL117; quorum placement RL108 |
| RL100 | Expand/migrate/contract, old/new writers, backfill convergence and reversal | PostgreSQL locks/indexes RL119; CockroachDB jobs RL130 |
| RL102 | Admission, queues, active work, limiting resources and failure headroom | Triage RL103; chosen query/lock/retention mechanism owners |
| RL103 | Evidence-led request triage, selected causal branch and bounded intervention | Branch preparation is explicit rather than a full performance syllabus |
| RL104 | Runtime/migration/support authority, trusted tenant selection, real denials | Native PostgreSQL RL121 and CockroachDB security sections RL128 |
| RL105 | Distribution key, locality, skew, fan-out and invariant scope | Atomic commit RL106; implementations specialist-sharding/RL123 |
| RL106 | Replica agreement versus multi-participant atomic outcome, durable decision and recovery | Product Parallel Commits RL124; shared snapshots RL107 |
| RL107 | Fractured observation, causality/timestamps, safe historical completeness versus authority | Native follower reads RL125; export lifetime RL83 |
| RL108 | Failure domains/votes, serving location, regional and global rule costs | Native locality RL127; movement RL109 |
| RL109 | Live catch-up, safe membership change, decommission and compatibility boundaries | Native node work RL128, binary change RL131, PostgreSQL shard movement specialist-sharding |
| RL110 | PostgreSQL backend/buffers, heap/TID, tuple visibility and HOT | Vacuum RL111, WAL RL115 and incident tools RL120 |
| RL111 | Reclamation versus shrinkage, horizons, visibility map and transaction/multixact age | Index operation RL119; incident intervention RL120 |
| RL112 | Native operator/access-method contract, B-tree/BRIN and GIN/GiST candidates | Semantics/lifecycle of JSON and the three retrieval/type specialists |
| RL113 | EXPLAIN counters, skew/statistics, custom/generic plans and comparable repairs | Waiting/service diagnosis RL120 |
| RL114 | JSON document fit, missing/null, validation, query/index match and update boundary | Relational rules RL79; live evolution RL100 |
| RL115 | PostgreSQL WAL/flush/checkpoint/commit controls and a scoped crash drill | Backup recovery RL116; remote acknowledgement/replay RL117 |
| RL116 | Base/WAL chain, exact target, isolated acceptance and later-work reconciliation | Promotion RL117; version moves RL122 |
| RL117 | Physical standby, progress states, read contract, fenced promotion and return | Logical row stream RL118; PITR RL116 |
| RL118 | Publication/subscriber/identity, conflicts, omissions, retention and cutover | Outbox semantics RL94; migration acceptance RL122 |
| RL119 | PostgreSQL DDL locks/rewrites, compatible backfill, concurrent index lifecycle | Vacuum RL111; version upgrade RL122 |
| RL120 | Native waits/session/query evidence, targeted intervention and recovery cost | Plan/vacuum/lock preparation is conditional on the selected branch |
| RL121 | Roles, ownership/RLS bypass, trusted pooled identity and safe privileged code | Local secure setup/object/session introduction avoids architecture detour |
| RL122 | Upgrade route and compatibility, complete copy/dependencies, fenced acceptance and return | CockroachDB migration RL132; cluster binary rules RL131 |
| RL123 | CockroachDB ordered keys/ranges, replication, lease and leader roles, routing and a hot key | Transaction decision RL124; performance RL126; geography RL127 |
| RL124 | Intents/record/Parallel Commits, native whole-transaction retries and uncertain result | Read/isolation contract RL125; external effect semantics RL94 |
| RL125 | Current isolation versus retained historical snapshot, exact/bounded/strong follower reads | Locality RL127; export lifetime RL83 |
| RL126 | SQL/KV fan-out/lookups, covering keys, sequential range load versus one hot row | Correctness/retry protocol RL124; placement RL127; health RL128 |
| RL127 | Database/cluster regions, locality, survival goal and honest failure evidence | Operational response RL128; SQL work RL126 |
| RL128 | Secure identity/tenant tests, then separately prepared range health and removal | Binary compatibility RL131; restore RL129 |
| RL129 | Native backup scope/history, isolated restore, fenced booking/capacity reconciliation | Generic closed-history contract RL96; engine cutover RL132 |
| RL130 | Schema-job phases, backfill load, failed uniqueness and semantic acceptance | Binary compatibility RL131; query work RL126 |
| RL131 | Supported binary rollout, mixed versions, eligibility and finalisation/return boundary | Schema jobs RL130; engine migration RL132 |
| RL132 | Actual compatibility rewrite, frozen consistent copy, single authority and target-only work | PostgreSQL upgrade RL122, row stream RL118, CockroachDB restore RL129 |
| specialist-sharding | Application shards/Citus/FDWs, co-location, constraint scope, fan-out and movement | One-service partitions RL89; generic movement RL109; CockroachDB ranges RL123 |
| specialist-full-text-search | Configuration/lexemes/phrases, expected matches, filtering/ranking and relevance | Embedding retrieval specialist-vector-search; JSON representation RL114 |
| specialist-vector-search | Toy geometry versus embeddings, eligible exact baseline, recall and ANN lifecycle | Lexical search specialist-full-text-search; extension operations specialist-extensions |
| specialist-extensions | Built-in versus extension types, ranges/exclusion, spatial units/indexes, lifecycle | pgvector retrieval specialist-vector-search; server upgrade RL122 |

The set matches the commissioned shape: one introduction, 30 general/distributed articles, 13 PostgreSQL articles, ten CockroachDB articles and four PostgreSQL specialists. Parentage is not used as an implicit syllabus. The mechanical graph check parsed only the permitted frozen tree and found no prerequisite cycle or missing ID; this checks structure, not reader understanding by itself.

## Whole journey and awkward cases

The initial routes give a useful answer before demanding a product branch: facts and keys for design, a result-row meaning for reports, an invariant for concurrency, saved work and maintenance costs for indexes, and durable log ordering for a crash. SQL result construction is not postponed until physical architecture. The route to a slow-request diagnosis enters RL103 with request/connection ownership and transactions; a blocked request can stop after the lock branch rather than first acquiring all plan and vacuum knowledge.

Checkout is a complete chain: transaction boundary → connection owner → affected-row guarded write → request identity. The worker branch explicitly adds RL91 before RL94. This matters because a lease and a database claim cannot by themselves prevent an expired worker's external action. The plans require an effect authority/fencing boundary instead of promising exactly-once effects from an outbox.

The multi-row capacity and instructor examples have different failure mechanisms. RL90 develops the decision and RL91 owns the complete lock/snapshot protocol. The awkward empty-booking case is covered by an existing guard authority. The stale Repeatable Read case is explicitly challenged; the plan does not infer a refreshed snapshot merely from waiting for a row lock. All capacity-changing writers and whole-transaction retry participate in the chosen repair. No universal PostgreSQL isolation claim is silently extended to CockroachDB.

Correct reporting covers the two independent many sides in order 101, missing order-103 payments, customer Edda without orders, NULL predicates, empty aggregates, ties/default peers and final ordering. Pagination distinguishes a moving list from a fixed export; retained versions, connection ownership and cancellation have named owners. These are useful practitioner boundaries rather than a catalogue of SQL keywords.

Imports and migrations own different lifecycles. RL84 resolves input identity/version/conflict and reject evidence; RL100 develops old/new caller compatibility and late rows behind the backfill cursor. RL119/RL130 then verify engine-specific locks/jobs/index failure and final equivalence. The money conversion uses agreed line prices rather than inventing a stored order total. Counts/checksums are not presented as complete semantic proof.

Recovery distinguishes a crash, storage loss, backup history and replica promotion. E6 plus RL96/RL129 closes the old write history before final enumeration, settles uncertain work, and keeps it fenced until acceptance/handover. The native CockroachDB promise includes a booking attempt at the fence boundary; B203 is not assumed to be the exhaustive excluded-work set. The PostgreSQL/native routes also retain stable identities, stock effects and independent provider reconciliation. Restoring pre-mistake time is not treated as proof that all later legitimate effects have been recovered.

Security enters from application ownership and integrity, then introduces the secure native deployment and needed object/session vocabulary locally. It does not require heap-page or range study before a tenant-policy test. RL128 separately names range/rebalancing/survival preparation for health/removal, and RL131 explicitly uses that prepared branch. Permission testing includes allowed work, forbidden reads and writes, caller spoofing and the chosen bypass boundary. Composite references alone never stand in for tenant access control.

Distribution follows measured capacity, replica semantics and the invariant's scope. One hot stock key, a hot shop/range and many independently placeable rows remain distinct. Consensus, atomic commit, a shared read snapshot and current booking authority have separate owners. Quorum arithmetic is a model; native locality, membership and failure tests must expose actual placements and failure domains. A local multi-process run cannot establish WAN latency or regional resilience.

Specialist depth is proportional to its decisions: lexical matching versus ANN recall versus human relevance; JSON shape versus relational identity; interval overlap versus capacity; extension object dependencies versus server upgrade. No route requires every specialist merely to implement a correct purchase or report. I found no unnecessary full treatment duplicated across neighbours: local summaries plus native experiments serve different reader tasks.

## Primary-source challenge

The following sources were opened during this review, with relevant sections retrieved to check the consequential assumptions. These are checks of planning promises, not certification that the promised experiments have run. Documentation was consulted on 2026-10-23 UTC; versioned PostgreSQL 18 and CockroachDB v25.4 pages were preferred. Unversioned Citus/pgvector sources validate the proposed investigation, while the writer must pin the tested release.

| Plan premise tested | Primary source and assessment |
| --- | --- |
| PostgreSQL statement versus transaction snapshots; guarded UPDATE rechecks; whole-transaction retry; sequence gaps | [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html), especially Read Committed/Repeatable Read. Supports the conditional one-row protocol and the refusal to treat generated IDs as gapless or commit ordered. |
| Lock acquisition cannot refresh an already frozen Repeatable Read snapshot | [Application-level consistency](https://www.postgresql.org/docs/18/applevel-consistency.html), explicit blocking-lock section. RL91's fresh separate Read Committed count and stale-snapshot challenge are appropriate; native sessions remain to be run. |
| CHECK permits unknown; tenant composite keys enforce references rather than access; NULL uniqueness is a distinct choice | [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html). RL78/RL79 own the required distinctions and do not assert a universal NULL uniqueness rule. |
| Deferred FK capability on PostgreSQL | [CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html), DEFERRABLE/INITIALLY DEFERRED. Consistent with the supplied narrow probe; not support for deferring CHECK/NOT NULL. |
| PostgreSQL owner/superuser/BYPASSRLS and privileged-code name resolution | [Row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) and [CREATE FUNCTION](https://www.postgresql.org/docs/18/sql-createfunction.html), safe SECURITY DEFINER section. RL121 requires ownership, force/bypass, controlled search_path and execution-grant tests. |
| Role membership and secure-entry scope | [Role membership](https://www.postgresql.org/docs/18/role-membership.html) and [client-authentication chapter](https://www.postgresql.org/docs/18/client-authentication.html). These validate the native identity vocabulary; no particular authentication configuration is yet certified. |
| Partition-local indexes do not imply arbitrary cross-partition uniqueness | [Table partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html), limitations. RL89 explicitly owns key/reference consequences and does not promise a global index. |
| Indexable operator contracts, lossy work and HOT eligibility | [Index types](https://www.postgresql.org/docs/18/indexes-types.html) and [HOT](https://www.postgresql.org/docs/18/storage-hot.html). Consistent with RL112's query-dependent method choice and RL110's conditional HOT experiment. |
| EXPLAIN rows/time per execution, loop multiplication and modifying side effects | [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html). RL113 requires the necessary counter interpretation, overhead and modifying-query care. |
| Vacuum reuse versus file rewrite/shrinkage and age safety | [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html). RL92/RL111 preserve the relevant distinctions; no inference from a file-size reading alone is promised. |
| Commit flush settings and lost acknowledged work versus corruption risk | [Asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html). RL115's separate synchronous_commit/fsync/storage assumptions are necessary and sound at plan level. |
| Restorable physical history requires the required continuous WAL chain | [Continuous archiving/PITR](https://www.postgresql.org/docs/18/continuous-archiving.html). RL116's missing-segment and exact-target acceptance requirements match that premise. |
| Logical replication does not carry DDL or sequence state automatically | [Logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html). RL118/RL122 correctly retain schema/sequence and cutover duties. |
| CockroachDB lease and Raft leader are distinct concepts with version-dependent relationship | [Replication layer v25.4](https://docs.cockroachlabs.com/docs/v25.4/architecture/replication-layer). Leader leases align the roles in normal operation; RL123 asks for version-specific behaviour rather than promising they are always different nodes. |
| Intents, transaction record, STAGING and implicit versus explicit commit | [Transaction layer v25.4](https://docs.cockroachlabs.com/docs/v25.4/architecture/transaction-layer). RL124's labelled Parallel Commits trace is supportable and distinct from textbook two-phase commit. |
| Exact/bounded stale follower reads, strong follower reads and retained history | [Follower reads v25.4](https://docs.cockroachlabs.com/docs/v25.4/follower-reads). RL125 does not conflate all follower reads with stale reads or old observations with current booking authority. |
| Cluster/database region, table locality and survival goal are separate settings | [Multi-region overview v25.4](https://docs.cockroachlabs.com/docs/v25.4/multiregion-overview). RL127 requires actual configuration and placement evidence rather than relying on the five-voter model. |
| CockroachDB tenant policies, privilege/bypass boundaries and secure transport | [RLS v25.4](https://docs.cockroachlabs.com/docs/v25.4/row-level-security) and [TLS/PKI v25.4](https://www.cockroachlabs.com/docs/v25.4/security-reference/transport-layer-security). RL128's chosen native mechanism and spoofing/denial tests are necessary; RLS is not assumed to filter every backup/CDC path. |
| Arbitrary historical CockroachDB restore depends on revision history/coverage and scope | [RESTORE v25.4](https://docs.cockroachlabs.com/docs/v25.4/restore). RL129 explicitly asks whether revision history and metadata are included and requires a supported target. |
| Removal requires feasible replica relocation/headroom, not merely a stopped process | [Node shutdown v25.4](https://www.cockroachlabs.com/docs/v25.4/node-shutdown). RL128's drain/decommission and remaining survival-budget acceptance are well scoped. |
| Mixed binaries and finalised cluster compatibility have different return rules | [Upgrade self-hosted v25.4](https://docs.cockroachlabs.com/docs/v25.4/upgrade-cockroach-version). RL131 requires a supported transition and deliberate control of auto-finalisation before testing permitted return. |
| Wire/syntax familiarity does not establish PostgreSQL application compatibility | [PostgreSQL compatibility v25.4](https://docs.cockroachlabs.com/docs/v25.4/postgresql-compatibility) and [foreign keys v25.4](https://docs.cockroachlabs.com/docs/v25.4/foreign-key), plus the supplied probe. RL132 inventories semantic dependencies and tests a rewrite before copy/handover; the pages alone were not used as proof of the exact deferred-DDL rejection. |
| Citus distribution/co-location affects SQL, transaction and reference support | [Choosing distribution column](https://docs.citusdata.com/en/stable/sharding/data_modeling.html). specialist-sharding explicitly reserves exact restrictions for the pinned release and does not assign FDWs a general distributed-commit guarantee. |
| Lexemes, linguistic configuration and ranking are different from substring matching | [PostgreSQL text-search introduction](https://www.postgresql.org/docs/18/textsearch-intro.html). The text-search specialist requires a displayed corpus and declared expected matches/relevance judgements. |
| ANN filtering can lose candidates; iterative scans and exact baselines must be evaluated separately | [pgvector README, filtering/iterative scans](https://github.com/pgvector/pgvector#filtering). The vector specialist's filtered eligible set, exact top-k and measured recall are the right boundaries; toy vectors prove no semantic quality. |
| Safe distributed snapshots require timestamp/commit ordering, not physical clocks alone | [Spanner TrueTime/external consistency](https://docs.cloud.google.com/spanner/docs/true-time-external-consistency). Supports RL107's distinction between timestamped observation and a complete transaction protocol, without adding a Spanner implementation branch. |

## Supplied observations versus proposed work

The deferred-FK record says it was checked at 2026-10-23T22:53:29.389411+00:00. It records PostgreSQL 18.6 (Homebrew) and CockroachDB v25.4.17 in disposable local deployments. Its immediate-FK child-before-parent transaction fails with 23503 on both engines. PostgreSQL's `DEFERRABLE INITIALLY DEFERRED` variant commits and its join count is 1. CockroachDB rejects that deferred table declaration with 42601. Those are the supplied observations; I checked their commands/results for consistency rather than rerunning the servers or inspecting the external verifier named by hash.

The record includes two initial CockroachDB connection-refused readiness attempts followed by a successful readiness query and the substantive commands. They are not evidence that the later deferred constraint would work. The probe does not test cyclic references, arbitrary portability, target application roles, cutover, RLS, retry handling or migration correctness. RL132 still commissions an actual pinned compatibility transaction and a verified replacement protocol. The binary inventory is availability evidence only.

All other native experiments in the tree are proposals for writing: the guard/snapshot comparison, crash and restore drills, index/plan measurements, secure-role tests, range splits, follower paths, schema jobs and upgrade transitions. No command promised in those briefs is reported as an observed article result. Performance workloads must record size/seed/distribution; local process drills must state their actual failure boundary. The five-voter geography and toy vectors are expressly illustrative.

A separate read-only arithmetic check over `core.json` confirmed totals/paid/due for orders 101–103 and each product's before/after-103 stock. E8's values are 101=`Leave by door`, 102=empty text, 103=SQL NULL, and remain an optional variant. E1 tenant identity, E2 booking/instructor/room rules, E3 history/ties, E4 request/effect identities, E5 geography/quota, E6 recovery and E7 specialist corpus facts have distinct roles and starting states. No continuity contradiction was found in their planned use.

## Findings

None. No critical, medium or low practitioner defect was identified in this complete plan reading. The supplied next finding number, practitioner-4, remains unused. The concrete reader effects examined are recorded above; this conclusion is not a repair confirmation and does not rely on an earlier verdict.

## Limits

This approves the technical adequacy, ownership and depth of the frozen plan within the commissioned relational scope. It does not review article prose, learning presentation, visuals or interactive behaviour and cannot establish that a future draft teaches the promised understanding. Native experiment commands, data, driver versions, licences/settings and outcomes generally do not yet exist in these inputs; their successful execution and interpretation remain writing/article-review obligations.

No database server was started, no production service contacted, no native probe rerun, and no external verifier/tool binary independently authenticated. Primary documentation checks establish support for planning premises, not exhaustive implementation correctness. Online documentation may evolve even at a versioned URL; article evidence should pin the tested version/configuration. The supplied manifest's inventory and original introduction were outside permitted reading, so exact correspondence to those withheld files was not re-established here. The review nevertheless covers every article record present in the frozen complete tree.

Only this report was written. No frozen source, plan or evidence file was edited; no build, commit, push or publication was performed. Integration and any further review scheduling remain with the root coordinator.
