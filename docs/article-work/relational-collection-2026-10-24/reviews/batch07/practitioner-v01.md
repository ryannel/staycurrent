# Practitioner review · article mode · batch07 · v01

Inputs read: [exact frozen manifest](v01/manifest.json), all complete article sources for r23, r24, r26, r27, r28, r29, r30, their relevant components/model scripts, native verifiers/downloads, imported fixture data, mechanical observations and [applicability](v01/mechanical/applicability.md). Read the commission, shared example, per-piece briefs and individually bounded parent/sibling/child plans; identical context hashes already read in this assignment were reused. Read every final Sources/disclosure, including material outside the article body. Current exact preview: `http://127.0.0.1:4476/review/relational-collection/` and each manifest brief's assigned article route. Current review skill and practitioner perspective only. Author quality notes, history, earlier versions and peer findings were withheld.

Highest severity: critical.

Independent INITIAL article coverage only; this is not final complete or corpus review.

## Checks

| Piece | Check | Result | Note |
| --- | --- | --- | --- |
| r23 | 1. Correctness | finding | practitioner1: calling work_mem the limit for a hash operation omits hash_mem_multiplier; the default hash-table allowance is twice the base. Other connection/deadline distinctions are sound. |
| r23 | 2. Evidence | pass | Burst/queue/headroom values are labelled illustrative; model states and live extremes match the stated finite schedule. |
| r23 | 3. Coverage | finding | practitioner1 affects the per-operation memory budget. Fleet, deadline, retry, bottleneck and recovery choices are otherwise covered. |
| r23 | 4. Depth, both ways | finding | practitioner1 needs one missing per-hash allowance distinction. Other admission/test depth is proportionate; detailed plan/lock/version work stays branch-specific. |
| r23 | 5. Ownership | pass | Owns capacity/admission decisions, leaving incident selection and PostgreSQL views to r24/r41 and distribution to r26. |
| r24 | 1. Correctness | pass | Activity versus wait, blocker identity, idle-holder cancellation, failed transaction recovery and EXPLAIN execution effects are accurate. |
| r24 | 2. Evidence | pass | Frozen18.6 incident script/results support the lock and cancellation states; request timelines explicitly invent equal1500ms totals. |
| r24 | 3. Coverage | pass | Starts from a request, separates queue/lock/work, follows the root owner, bounds intervention and controls recovery demand. |
| r24 | 4. Depth, both ways | pass | Detailed lock example supplies usable judgement without requiring every plan or capacity technique first. No material gap or excess found. |
| r24 | 5. Ownership | pass | General causal method stands alone; native monitoring depth remains r41 and branch mechanisms remain their linked owners. |
| r26 | 1. Correctness | pass | Partitioning/replication/sharding, tenant reference scope, key skew, fan-out/global top-N and consensus/commit layering are sound. |
| r26 | 2. Evidence | pass | Routing and key layouts are declared conceptual; no Citus/CockroachDB execution or distribution speed is invented. |
| r26 | 3. Coverage | pass | Derives a key from operations/invariants, checks hot tenants/single keys, secondary-index owners, global queries and movement/failure cost. |
| r26 | 4. Depth, both ways | pass | Useful architecture decision with enough awkward cases; no unnecessary product implementation detail or missing key trade-off found. |
| r26 | 5. Ownership | pass | Owns choosing the distribution boundary; r27/r28 own commit/snapshots and r54/r44 own implementation. |
| r27 | 1. Correctness | pass | Prepared promises, durable decision before delivery, blocking, fenced recovery, safe forgetting and isolation versus atomicity are correct. |
| r27 | 2. Evidence | pass | Two databases/one instance and same-host decision file are expressly limited. Native prepare/restart/resolve results match the exact script. |
| r27 | 3. Coverage | pass | Includes local-commit counterexample, all-Yes versus decision, coordinator-loss cases, recovery authority, resources and external effects. |
| r27 | 4. Depth, both ways | pass | Classic model is sufficient to reason about failure and does not pretend to implement a production transaction manager. |
| r27 | 5. Ownership | pass | Owns cross-participant outcome; replica agreement, common reads and native Parallel Commits retain distinct owners. |
| r28 | 1. Correctness | pass | Common view, causal-clock one-way implication, HLC uncertainty, safe/applied/retained frontiers and qualified Spanner external consistency are accurate. |
| r28 | 2. Evidence | pass | Numeric timestamps are invented ordering values. Four rendered safe-read combinations match source logic; no native clock experiment claimed. |
| r28 | 3. Coverage | pass | Covers fractured observations, unresolved state, read-your-write versus historical consistency, bounded freshness, retention and current-write authority. |
| r28 | 4. Depth, both ways | pass | Enough clock detail to evaluate promises; no unsupported elapsed-time interpretation or missing practical decision found. |
| r28 | 5. Ownership | pass | Owns distributed read reasoning, with product follower-read modes, pagination lifetime and placement passed to r46/r07/r29. |
| r29 | 1. Correctness | pass | Fixed five-voter2–2–1 majority arithmetic, majority intersection, remote dependency and shared entitlement are sound. |
| r29 | 2. Evidence | pass | All locality/vote/quota diagrams are models. Current single-region losses retain a possible majority; isolated regions do not. |
| r29 | 3. Coverage | pass | Includes whole service path, other groups/indexes/metadata, global quota, allocated-rights alternative, degraded capacity and residency/copies. |
| r29 | 4. Depth, both ways | pass | No false latency estimate; voting-level survival is not inflated to whole-service acceptance. No material depth gap/excess found. |
| r29 | 5. Ownership | pass | Useful general placement decision; native locality settings and topology movement stay with r48/r30. |
| r30 | 1. Correctness | pass | Snapshot-plus-tail boundary, learner readiness, joint old/new majorities, catch-up surplus and drain/decommission distinction are correct. |
| r30 | 2. Evidence | pass | Movement is conceptual;600+(40-rate)*10 gives700/400/0MiB and60MiB/s clears600 in30seconds. No native transfer rate claimed. |
| r30 | 3. Coverage | pass | Covers lost tail, protocol membership, failure budget already spent, destination eligibility, movement headroom, permanent removal and software finalisation. |
| r30 | 4. Depth, both ways | pass | Provides the operational reasoning needed before a native procedure, without prescribing manual quorum edits or universal throttles. |
| r30 | 5. Ownership | pass | Owns generic cluster change; product node removal/upgrades and PostgreSQL shard transfer remain native child scopes. |

## Evidence and applicability

All manifest-listed bytes and each applicable mechanical source/verifier hash were independently compared with the frozen packet, with no mismatch; see [hash audit](../practitioner-working-v01/hash-applicability.json). This includes fixtures/imported data and model code, not just prose. Current actual download-href HTTP bytes were independently fetched with bounded reads and compared with frozen files; all matched ([HTTP evidence](../practitioner-working-v01/current-http.json)). No browser download-event/path/save API was used and actual saving is unverified.

Native results below are reused author observations. Their exact source, data, version, environment, verifier and acceptance queries were inspected; no success flag was treated as an independent verdict. No unresolved technical hypothesis required another native run, so no ceremonial native rerun was performed. No reviewer-owned PostgreSQL instance was started. These records do not measure production throughput, geographic latency, power loss or independent physical failure domains.

r24's exact `incident.py --bindir /path/to/postgresql/bin` creates a private cluster and checks its data directory/owner before setup. Its labelled holder stays idle in transaction after cancel, waiter changes from active/Lock to idle in aborted transaction, then rollback/fresh update yields P7=0. r27's `prepared.py --bindir ...` enables prepared state only inside its private cluster; two databases are participants. The unsafe local commits leave stock10/0 without103; both prepared identities survive immediate restart, ordinary pre-resolution reads retain12/1 and no103, then the journal's COMMIT yields complete103 and no unresolved prepared work. Both scripts clear inherited `PG*`, disable TCP, use generated private sockets and include bounded subprocess/cleanup logic. Both ran with PostgreSQL18.6/Python3.14.5 on macOS; no independent machines or HA coordinator are demonstrated.

Model code and mechanical arithmetic were checked directly. Current browser use challenged pool2 versus8 at equal work width (both four rounds), queue0 (two completed/six refused), one shared row (eight rounds), all tenant-routing alternatives, all three coordinator histories, all four common-read cases, each single-region loss, full regional isolation, and the six-stage replacement. The model/native distinctions and outputs agree with prose.

## Primary sources checked

- [PostgreSQL18 administration/signalling](https://www.postgresql.org/docs/18/functions-admin.html), [resource settings](https://www.postgresql.org/docs/18/runtime-config-resource.html), [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) and [PREPARE TRANSACTION](https://www.postgresql.org/docs/18/sql-prepare-transaction.html): cancellation/termination, operation memory, measured work and external-manager prepared state.
- [PgBouncer modes](https://www.pgbouncer.org/features.html): session/transaction promises and feature support.
- [Citus13 distribution modelling](https://docs.citusdata.com/en/v13.0/sharding/data_modeling.html): tenant locality and skew.
- [Gray/Lamport transaction commit](https://lamport.azurewebsites.net/video/consensus-on-transaction-commit.pdf): participant agreement, durable decision and blocking; [Raft extended paper](https://raft.github.io/raft.pdf), section6/7: joint majorities and snapshot boundaries.
- [CockroachDB25.4 transaction layer](https://www.cockroachlabs.com/docs/v25.4/architecture/transaction-layer): HLC, uncertainty, transaction records, Parallel Commits, closed timestamp plus applied state; [survival goals](https://www.cockroachlabs.com/docs/v25.4/multiregion-survival-goals) and [node shutdown](https://www.cockroachlabs.com/docs/v25.4/node-shutdown): native framing and drain/decommission distinction.
- [Spanner external consistency](https://cloud.google.com/spanner/docs/true-time-external-consistency): qualified Serializable and real-time-order contract. [etcd3.6 learners](https://etcd.io/docs/v3.6/learning/design-learner/): catch-up before voting promotion.

## Findings

### practitioner1 · critical · r23, “A pool is a budget”, work_mem paragraph (frozen source line37)

Problem: The paragraph calls `work_mem` “a limit for a sort or hash operation”. For PostgreSQL18 it is a base amount: the hash-table allowance is `work_mem × hash_mem_multiplier`, whose default is2.0. The surrounding warning correctly multiplies operations/workers/sessions, but leaves a reader with the wrong per-hash starting limit.

Effect: An engineer using this capacity explanation can underestimate the allowed hash memory by a factor of two at defaults, or more after configuration changes, while believing they accounted for concurrency. This is a false technical statement in the very passage teaching memory budgets, rather than an optional catalogue of tuning settings.

Suggestion: Identify work_mem as the per-operation base and state the hash multiplier before explaining concurrency; keep the warning that this still does not give one exact whole-server or whole-query allocation.

Evidence: [PostgreSQL18 Resource Consumption, work_mem and hash_mem_multiplier](https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-WORK-MEM) explicitly defines the product and default2.0. The exact frozen source at `v01/source/src/articles/relational-collection/r23.astro:37` contains the unqualified limit claim. No native challenge is needed to establish this documented configuration rule.

## Limits

Native receipts are reused observations, not fresh reviewer execution. No production capacity, WAN timing, external effect, independent storage/power boundary or user-relevance result is accepted from these fixtures. Installed capability alone establishes neither a successful experiment nor production acceptance. Actual browser saving is unverified. No build, article edit, publication or global machine setting was performed. The report does not replace independent teaching, editorial, visual, final-complete or corpus coverage.
