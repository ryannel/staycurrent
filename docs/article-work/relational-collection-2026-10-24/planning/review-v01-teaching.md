# Teaching review · tree · complete relational collection · plan-v01

Inputs read: the frozen [manifest](v01/manifest.json), [commission](v01/commission.md), [tree](v01/tree.yaml), [shared example](v01/example.md) and [routes](v01/routes.md); the three complete fixed reference articles, including rendered drawings. No planner-source notes, other reports, old drafts, diagnoses or historical editorial material were read.

Highest severity: **medium**.

Actual start: **2026-10-23 22:51:15 UTC** (2026-10-24 00:51:15 Europe/Stockholm).
Actual end: **2026-10-23 22:59:44 UTC**.

This is independent initial whole-plan teaching coverage. It is not the later independent complete reading, a review of finished prose, or publication approval. The plan is broadly teachable; one task-route inconsistency needs repair.

## Fixed-input validation

The SHA-256 of every permitted frozen content input matches `manifest.json`:

| Input | SHA-256 | Result |
| --- | --- | --- |
| tree.yaml | `03e6da014d6ac36bea44aba2a481a353684ef804b4fefa091d62adac3d021b05` | match |
| example.md | `585c2c012f454239788058686ad5ce1474cb781b189bb9c6d919317e4200a0f3` | match |
| routes.md | `194654cbf3d7cb8d2bf5e3bfdc5e2a90befa771f6696aab64df2abc8841a5f10` | match |
| commission.md | `ad5c6537dfa1677737fd23bae0c3c7d1ee9a360b59450db64b30a89a1803e3b8` | match |

The manifest itself was read as the supplied version declaration; it does not declare its own hash. Manifest entries for `articles.json` and `planner-sources.md` were not opened or hashed, because neither is a permitted teaching content input in this assignment. The frozen files, rather than the mutable canonical paths mentioned inside them, were reviewed.

The complete 1,884-line tree was read in six separately bounded, non-truncated results (lines 1–330, 331–660, 661–990, 991–1320, 1321–1600 and 1601–1884). A structural check of this same tree found **58 distinct destinations**, all prerequisite IDs resolving, and **no prerequisite cycle**. This supports the progression audit; it does not establish teaching quality by itself.

## Reference exposure

All reference text was read through `python3 scripts/read-writing-reference.py`, exactly one part per tool result with a 4,000-token output allowance. Every part's END marker was received; none of these nineteen text deliveries was clipped.

| Reference | Complete bounded text exposure | Complete text SHA-256 reported by reader |
| --- | --- | --- |
| Sequence diagrams | Parts 1–6 of 6 | `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c` |
| Indexes | Parts 1–7 of 7 | `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1` |
| Storage and durability | Parts 1–6 of 6 | `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07` |

Rendered study used three dedicated temporary tabs at `http://127.0.0.1:4350/review/examples/sequences/`, `/indexes/` and `/storage/`. I inspected all **34 numbered drawings**: Sequence diagrams 1–13, Indexes 1–11 and Storage and durability 1–10, alongside their explanations. I used final-step states for the animated drawings and selected contrasts, including the crowded/focused sequence comparison and the visibility-map change. Tall or initially clipped drawing views were revisited with scrolling. This was teaching calibration, not an exhaustive control/state verification of the reference applications. Some broad browser accessibility output was clipped; no judgement depended on that clipping, because complete explanatory text came from the nineteen bounded parts and drawings were inspected separately. No viewport or theme was changed, and no user-tab inventory was requested. The browser rejected the explicit visibility option when opening the second reference; opening its dedicated tab without that option succeeded. All three owned reference tabs were closed after study.

The useful calibration is explanatory, rather than a demand to copy the reference headings or media. The references give the reader a usable answer early, hold an example steady, expose a changed condition in visible state, and use the result to explain a practical choice. They also distinguish an invented model from a native measurement and send optional detail to a companion after supplying the local answer. I applied that standard to the proposed explanations below.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | finding | Article entries and prerequisites form a coherent acyclic progression, but the safe-checkout route calls RL91 optional even though its endpoint RL94 requires locking. See teaching-1. |
| 2. Order | finding | Within the briefs, the hard cases generally follow a simpler model and receive concrete help. The same route inconsistency interrupts the novice's order before job claiming. See teaching-1; this is one issue, not a second defect. |
| 3. Examples | pass | The fixed shop carries receipts, missing payments, stock, history and failure; the class and regional variants introduce different invariants explicitly. The clean core distinguishes report, race and protected states. |
| 4. Showing | pass | Across the complete tree, briefs identify changed rows, histories, schedules, counters, paths or experiments that can show their difficult parts. They leave the writer room to choose the actual figure, table or worked example. |
| 5. Judgement | pass | Outcomes and closing comparisons lead to decisions with conditions: grain, write preconditions, invariant scope, freshness, access costs, recovery acceptance, authority and compatibility. Native articles require observable acceptance rather than nominal command success. |
| 6. Gradual exposure | pass | General parents develop the mechanism before native detail; parents retain their useful answer. Child ownership is clear and parentage is expressly not a compulsory linear syllabus. No substantive parent/child depth defect found. |
| 7. Placement of additions | not applicable | No coordinator-named added passages or figures were supplied. The whole provisional plan was considered under checks 1–6; it contains no finished added prose whose attachment or placement can be judged. |

## Whole-journey judgement

The plan has a sound conceptual spine. Row meaning precedes values and rules; result grain precedes aggregates and query costs; transaction boundaries precede retries and external work; stored versions precede crash recovery; local recovery and replicated progress precede sharding, distributed commit and distributed snapshots. The native branches retain the relevant general understanding instead of treating PostgreSQL or CockroachDB commands as self-explanatory.

The strongest proposed teaching is where a small altered state forces a decision: two lines and two payments produce four pairs; a tied timestamp changes continuation; a late row appears behind a backfill cursor; an expired worker resumes; a restore excludes a later valid order or booking. These are suitable foundations for the references' way of teaching. The four-head outlines do not themselves limit the space a writer may spend on these explanations, and their compactness is not a defect.

The shared example also avoids forcing one physical or logical model onto every article. Tenant-scoped keys, time history, class capacity, instructor write skew, region-owned stock and restore histories are marked variants. The writer can use the subset needed for a local argument without making readers learn all extensions first. Their proposed status still requires the coordinator's settlement before dependent writing, as the example record states.

## Destination coverage

Every destination below was read with checks 1–6 applied: its entry and prerequisites, order of ideas, example, proposed showing, intended decision, and parent/child depth. “Pass” is a judgement of the brief's capacity to support the intended teaching, not approval of an unwritten article. Check 7 is not applicable throughout this initial plan.

| Destination | Result | Teaching assessment |
| --- | --- | --- |
| RL76 · Relational databases | pass within supplied scope | The preserved root's plan establishes tables, receipt grain, rules, atomic purchase and the guarded race before branching. Actual preserved prose was withheld; see limits. |
| RL77 · Relations, keys and normalisation | pass | Receipt 103 supplies row meaning before candidate/composite identities and dependencies; agreed price makes useful duplication intelligible. |
| RL78 · Values, missing data and equality | pass | Fixed amounts, an instant versus a named local time, text identity and missing values give each abstraction a concrete comparison before later queries rely on it. |
| RL79 · Constraints and tenant boundaries | pass | Row checks precede identity and references, then scoped shop references; a between-row rule explicitly hands off to concurrency instead of pretending a row check solves it. |
| RL80 · History, correction and deletion | pass | Catalogue change preserves the line agreement before effective versus recorded time and deletion consequences; the price correction can be worked through as states. |
| RL81 · Joins and the meaning of a result row | pass | One line per result precedes independent many-side multiplication; order 101 and missing order 103/Edda are strong easy and awkward cases. |
| RL82 · Aggregates, windows and ordered results | pass | Group collapse precedes a calculation beside each row; tied timestamps and explicit expected rows support peers, frames and deterministic output. |
| RL83 · Pagination and consistent exports | pass | A tied ordered list precedes concurrent movement, then a fixed-set export and its resource cost. The two contracts remain distinct. |
| RL84 · Updates, upserts and bulk imports | pass | The stock precondition and affected rows lead into conflicting source identity/version, partial acceptance and replay checks; reader decisions are domain policies rather than syntax alone. |
| RL85 · SQL at the application boundary | pass | Parameters and generated query work lead to explicit connection/transaction ownership; commit timeout points naturally towards RL93 instead of being silently retried. |
| RL86 · Indexes and access paths | pass | A small B-tree/page lookup precedes order/selectivity, covering variants and write cost. The planned counters can make the practical trade visible without a fabricated benchmark. |
| RL87 · Query execution and bad plans | pass | Rows flow through known joins before estimates, repeated work, state and parallel movement; repairs compare a fixed workload rather than rewarding one smaller number. |
| RL89 · Table partitioning and data lifecycle | pass | A dated session boundary supplies pruning, keys and references before retention; physical placement is distinguished from a partition's logical boundary. |
| RL90 · Transactions and isolation | pass | Atomic purchase, overlapping snapshots and one-row conflict precede the harder multi-row rules and serial outcomes; both instructor and capacity schedules can make the failure visible. |
| RL91 · Locks, contention and deadlocks | pass | An existing session guard, including empty bookings, precedes waiting/rechecking, a wait cycle and bounded contention. It owns the knowledge RL94 needs. |
| RL92 · Row versions, storage and cleanup | pass | An old report and changed price establish why versions exist before physical layouts, retention and write amplification; logical deletion and file shrinkage are separated. |
| RL93 · Retries when a commit reply is missing | pass | Two possible histories precede request identity and resolution; absence is not presented as proof of abort, and the retry boundary excludes provider effects. |
| RL94 · Outboxes and database-backed jobs | finding on incoming route only | Its own sequence from atomic intention through repeated delivery, claims and expired authority is sound; its locking entry contradicts the optional branch in the checkout route. |
| RL95 · Write-ahead logs and crash recovery | pass | A purchase's memory/log/page states precede crash/replay, checkpoints and the durability boundary; small traces can expose the required ordering. |
| RL96 · Backup, restore and reconciliation | pass | Objectives precede a chain and deliberately missing link, then target acceptance and later-work reconciliation. Restoring files alone cannot be mistaken for business recovery. |
| RL97 · Replicas, lag and read routing | pass | One purchase's receipt/flush/replay progress precedes a following read and lag under load; the reader must choose a freshness promise before read routing. |
| RL98 · Failover and fencing | pass | A suspected failure precedes enforceable write authority, promotion loss and divergent return; the old writer's rejection point is explicitly required. |
| RL100 · Live schema changes and backfills | pass | Old/new callers precede the operation, concurrent backfill and contraction. A late row behind the cursor supplies the hard convergence case. |
| RL102 · Connections, overload and capacity | pass | Requests, connections and active work are separated before the limiting-resource curve and controlled overload; failure headroom follows the ordinary load model. |
| RL103 · Diagnosing a database incident | pass | Missing request time precedes a causal wait chain and a bounded intervention; recovery includes queued work and rollback instead of ending at lower latency. |
| RL104 · Database access and least privilege | pass | Tasks and identities precede object authority and trusted tenant context; runtime-role denials make the intended boundary demonstrable. |
| RL105 · Sharding and distributed SQL | pass | Alternatives and partition keys precede locality, fan-out and skew; a hot shop, single stock row and global quota prevent treating all load as independent. |
| RL106 · Transactions across partitions | pass | A split purchase precedes a labelled teaching commit protocol and coordinator loss; the replicated log/transaction-decision distinction is maintained before native optimisation. |
| RL107 · Time, snapshots and distributed reads | pass | A fractured purchase observation supplies the need for a common snapshot before clock and safe-progress mechanisms; the historical report is contrasted with authority to book. |
| RL108 · Regional placement and survival | pass | A countable five-voter layout precedes request placement and a global rule; the evidence boundary prevents local process tests becoming geographical claims. |
| RL109 · Rebalancing and cluster change | pass | Snapshot/catch-up precedes voting-set change and removal; compatibility and finalisation are introduced after the ordinary transfer of authority. |
| RL110 · PostgreSQL processes, pages and row versions | pass | A request gives purpose to processes and buffers before tuple identity and updates; indexed/non-indexed changes can show HOT's physical conditions. |
| RL111 · PostgreSQL vacuum and transaction age | pass | Reclaimable old state and horizon holders precede visibility and age safety; observed space and file size make maintenance decisions assessable. |
| RL112 · PostgreSQL index methods and operators | pass | Operator/index contracts precede B-tree/BRIN and GIN/GiST examples; candidates and rechecks can be inspected before specialist retrieval. |
| RL113 · Reading and repairing PostgreSQL plans | pass | Native counters precede skew and prepared-plan sensitivity; the same workload and multiple parameter values provide a meaningful repair comparison. |
| RL114 · PostgreSQL JSON and structured alternatives | pass | Optional product attributes establish the document boundary before missing/null meanings, operators/indexes and concurrent updates; independently identified lines remain related facts. |
| RL115 · PostgreSQL WAL, checkpoints and durability | pass | WAL progress precedes pressure and acknowledgement settings, then an owned crash drill; visibility, durability and storage-loss assumptions stay separate. |
| RL116 · Restoring PostgreSQL to a recovery target | pass | A verifiable chain precedes target inclusion and isolated acceptance; a missing segment and valid later work make limits visible before service resumes. |
| RL117 · PostgreSQL physical replicas and promotion | pass | A seeded physical history precedes receipt/replay and routing, then fenced promotion/return; native progress signals must support the stated promise. |
| RL118 · PostgreSQL logical replication and change feeds | pass | A selected row stream precedes identity/conflicts, an omitted continuation and lifecycle; the reader sees why row replication is not an external event guarantee. |
| RL119 · PostgreSQL schema changes under load | pass | Native lock/rewrite costs precede the shared migration, index lifecycle and contraction; final discrepancies and old callers are explicit. |
| RL120 · Operating and diagnosing PostgreSQL | pass | Request/pool/server evidence precedes a blocked purchase, pressure and targeted intervention; measurement limits and recovery cost are part of the decision. |
| RL121 · PostgreSQL roles, policies and privileged code | pass | Roles/ownership precede tenant checks, pooled identity and privileged execution; bypass and name-shadowing attempts are concrete denied cases. |
| RL122 · Upgrading and migrating PostgreSQL | pass | The kind of change and route precede a bounded rehearsal and acceptance; target-only work makes the return boundary showable. |
| RL123 · CockroachDB keys, ranges and replication | pass | SQL keys precede ranges/replicas, split/hot-key behaviour and routing; the distinction between a conceptual request path and captured RPC evidence is useful. |
| RL124 · CockroachDB transactions and retries | pass | Cross-range purchase state precedes commit proof, known retry errors and ambiguous results; one request identity links native protocol to application behaviour. |
| RL125 · CockroachDB isolation and follower reads | pass | Current observations precede historical snapshots and actual serving paths; authority to book tests the consequence of choosing an old view. |
| RL126 · CockroachDB query work and hot ranges | pass | SQL/KV work precedes covering access and hot-key alternatives; the final comparison separates contention, range pressure and general capacity. |
| RL127 · CockroachDB table locality and region survival | pass | Region terms precede workload locality, inspected placement and failure evidence; the native contract builds on the general survival model. |
| RL128 · Operating and securing a CockroachDB cluster | pass | Certificate/SQL identity precedes permission tests, range health and removal; the topology's stated failure goal remains part of acceptance. |
| RL129 · CockroachDB backup and recovery | pass | Coverage precedes a chosen history, isolated acceptance and B203 reconciliation; the booking's one capacity effect is the appropriate awkward case. |
| RL130 · CockroachDB schema jobs under load | pass | Visibility/job phases precede the shared backfill, a failed unique index and acceptance/cancellation; job completion is separated from application correctness. |
| RL131 · Upgrading a CockroachDB cluster | pass | Supported version boundaries precede readiness, mixed binaries and finalisation; explicit refusal/return limits can show the loss of an easy reversal. |
| RL132 · Moving a SQL application to CockroachDB | pass | A real semantic incompatibility precedes the target protocol and consistent copy; target-only purchases expose the reconciliation needed for return. |
| specialist-sharding · Where distributed PostgreSQL work runs | pass | Placement alternatives precede co-location, cross-shard work and movement; shared quota and report work prevent topology names substituting for a decision. |
| specialist-full-text-search · Full-text search in PostgreSQL | pass | A displayed corpus and configurations precede terms/phrases, ranking under filters and ongoing change; exact matches and relevance judgements are distinct. |
| specialist-vector-search · Vector search in PostgreSQL | pass | Toy geometry precedes an exact eligible baseline, approximate access and filter loss; semantic relevance and neighbour recall remain separate decisions. |
| specialist-extensions · Types and extensions in PostgreSQL | pass | Typed operators precede adjacent/conflicting ranges and spatial units, then lifecycle dependencies; the examples give specialised predicates a concrete purpose. |

## Route coverage

All five first-question entrances are coherent at the planned-understanding level. They also name the missing foundations for reports, index costs and crash recovery rather than assuming SQL syntax supplies them. The 23 task rows were assessed as follows; prerequisites are understanding, not an instruction to complete every page in a transitive branch.

| Route row | Result | Progression judgement |
| --- | --- | --- |
| Design shared shop data | pass | Row meaning → values → enforcement → history; runtime authority adds application ownership first. |
| Produce a correct report or export | pass | Grain precedes calculations; snapshots explicitly precede exports; costs are an optional next question. |
| Implement safe checkout | finding | The proposed path reaches locking-dependent RL94 while naming RL91 an optional addition. See teaching-1. |
| Run a repeatable import | pass | Rules and transaction ownership precede write/conflict policy; ambiguity branches to request identity. |
| Diagnose slow service | pass | Known correct work, locks and pool behaviour precede access/plan/version/capacity/incident reasoning. |
| Depend on recoverable data | pass | Atomicity, versions and history precede log recovery, backup acceptance and chosen native execution. |
| Add read copies or transfer authority | pass | Durable progress and routing precede freshness, then authority transfer and return. |
| Change a live schema | pass | Constraints, owned writes and bounded batches precede compatibility and native operations. |
| Decide whether to distribute | pass | Measured capacity, local queries, transactions and replicas precede partitioning, commit, snapshots, placement and movement. |
| Retain or delete dated data | pass | Time/history and indexes precede pruning and key/reference consequences; distributed placement is a separate choice. |
| Secure shop boundaries | pass | Integrity and connection identity precede privileges and native runtime tests. |
| PostgreSQL: explain and maintain | pass | Index/version/WAL understanding precedes architecture and maintenance, with diagnosis requiring plans and incident reasoning. |
| PostgreSQL: repair query work | pass | General plans and types precede native access contracts and measured repair. |
| PostgreSQL: richer representations/retrieval | pass | Four distinct query needs branch from shared values and native contracts; JSON, lexical, vector and spatial semantics are not collapsed. |
| PostgreSQL: recovery and replication | pass | General progress/authority precedes WAL and the appropriate restore or physical/logical branch. |
| PostgreSQL: change, secure and upgrade | pass | Compatibility and authority precede implementation; recovery and logical-copy knowledge are explicitly required for the upgrade route. |
| PostgreSQL: placement across servers | pass | General sharding/atomic commit and native architecture precede placement choices. |
| CockroachDB: locate work and commit purchases | pass | Ranges, distributed commit and request identity precede native transactions; distributed snapshots precede the read-contract branch. |
| CockroachDB: expensive or hot work | pass | Plan/index/range understanding precedes work diagnosis; retries explicitly branch to transaction contention. |
| CockroachDB: regions | pass | Placement and distributed-read contracts precede native locality; failure-boundary limits are stated. |
| CockroachDB: operate and recover | pass | Access, movement and restore reasoning precede the respective native routes. |
| CockroachDB: schema/software change | pass | Shared live-change reasoning precedes jobs; secure operations and backups precede the version boundary. |
| CockroachDB: move an existing application | pass | Application semantics, compatibility, request identity and native transactions precede semantic rewrite, copy and handover. |

## Findings

### teaching-1 · medium · Safe-checkout route before RL94

**Problem:** [routes.md:25](v01/routes.md#L25) gives the route `RL90 → RL85 → RL84 → RL93 → RL94`, then says “Add RL91 when lock scope or contention matters.” But RL94 explicitly declares “Transactions, uncertain outcomes and locking” as its entry ([tree.yaml:699](v01/tree.yaml#L699)), lists RL91 as a prerequisite ([tree.yaml:703](v01/tree.yaml#L703)), and develops lock-held processing versus leases followed by an expired-authority case ([tree.yaml:714](v01/tree.yaml#L714)). The route describes necessary entry understanding as optional at the point its endpoint relies on it.

**Effect:** A newcomer following the advertised checkout route has no reason to take the locking explanation before comparing job claims, lock-held processing and leases. They must stop to discover the missing prerequisite themselves, or treat the route's stopping point as achieved before they can explain its worker protocol. This is a progression defect, rather than a preference for a particular ordering of headings.

**Suggestion:** Make the locking understanding explicit before the RL94 portion of this route, or give the checkout route an earlier stopping point and present the deeper worker/claim route with its actual entry understanding. The planner can choose the smallest coherent route; no article split or specific new figure is required.

**Evidence:** The route row and RL94 entry, prerequisite and claim/authority briefs conflict within the same hash-validated snapshot. RL91 already supplies the needed concepts, including lockable authority, waiting/rechecking and contention. There is no missing content owner.

## Limits

- This evaluates a complete provisional plan, not written or rendered destination articles. First-use definitions, actual prose coherence, precise figure placement, control behaviour and native outcomes remain to be checked when they exist.
- The preserved introduction's actual source/prose was outside the assignment's permitted inputs. RL76 was assessed through its complete root plan and the commission's preservation boundary; this is not a fresh judgement of its finished text.
- Proposed shared extensions E1–E7 are reviewed for teachability and consistency as proposals. Coordinator acceptance was not assumed, and no new facts or rows were added.
- No primary-source technical verification, native experiment, site build or serving was performed. Teaching findings here concern the plan's reader effects; technical guarantees and operational evidence remain with their commissioned review and implementation work.
- Rendered reference exposure covered every numbered drawing and selected contrasting states, not every control combination, theme or viewport. No accessibility snapshot or static screenshot is being claimed as exhaustive media verification.
- No plan, example, prose, skill, publication state or repository delivery was changed. Only this assigned report was written. A fresh final complete teaching reading remains required after accepted repairs under the review schedule.
