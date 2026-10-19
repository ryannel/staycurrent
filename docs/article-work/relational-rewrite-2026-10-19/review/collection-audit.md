# Independent collection audit

19 October 2026. Analysis and improvement plan; no draft, shared map or publication edits. Initial audit of the 54 replacement drafts in `src/drafts/relational/`, their directory and the relevant worksheet sources. I did not read the existing fresh-reader, technical or editorial findings. The independent ability account was saved first in `collection-independent-abilities.md`, before opening the coverage map, registry or planning documents.

**Repair required for the connected collection.** Its core explanations form a credible practitioner education. The remaining consequential work concerns the practical route through them, a native distributed-transaction exercise, and a specific index-maintenance home. This judgement does not establish publication readiness, repeat the native executions or certify product claims independently of the page reviewers.

## What the collection actually teaches

The strongest continuous argument is the booking invariant. Keys establish which tenant owns a fact. Constraints prove particular row and reference rules. A shared capacity rule then defeats those individually valid constraints. The counter, control-row and serializable histories supply different ways to make competing decisions meet. Missing replies lead to stable request identity; external effects lead to a recipient's authority; recovery leads to the useful accepted work missing from an earlier history. These are connected consequences, rather than an ACID vocabulary tour.

The distributed pages also retain the right distinctions. Replicating one range is separate from deciding a transaction across ranges. A consistent historical count is separate from current capacity authority. Locality is separate from survival and residency. More nodes do not divide one incompatible counter decision. The conventional and distributed branches have different investigations rather than equal-length product inventories.

The query path earns its correctness prerequisites. RL81's two independent children produce four pairs; RL82 retains or collapses the intended grain; RL83 separates a stable cursor position from a stable export. RL87's stale statistics change one input from an estimate of one to 40,000, making the chosen repeated work intelligible. The native PostgreSQL and CockroachDB plan pages then expose different implementation evidence.

There is useful restraint. The branch does not pretend to teach every SQL grammar feature, every engine, complete event sourcing, broker operation or a general distributed-systems course. JSON, arrays, ranges and extensions appear when they change a representation or access decision. I did not find a missing subject of that excluded scale that should be added merely to make the shelf look complete.

## Sequential reading log

I read the following connected paths, then read the remaining pages against their allocated jobs. The directory is `src/pages/review/relational/[...article].astro`.

| Path read | What survives the handoff | Consequential difficulty |
| --- | --- | --- |
| New application: RL76 → RL77 → RL78 → RL79 → RL81 → RL84 → RL90 → RL93; then RL85 and RL104 | Tenant identity, historical agreed facts, result grain, guarded mutation and whole-operation recovery remain connected. The newcomer gets SELECT meaning locally before more complex query work. | The examples are separate fixtures, but the early sequence does not tell a reader how to keep them separate. The named path also never reaches the connection owner or runtime privilege boundary without finding those pages independently. |
| Wrong result: RL81 → RL78 → RL82 → RL83 | The same apparent missing/duplicate answer is separated into grain, unknown predicates, aggregation and changing traversal. | No important prerequisite gap. RL83 supplies the snapshot refresher and sends resource ownership to RL85. |
| Slow endpoint: RL87 → RL86 → RL113 → RL126 → RL102 | Estimates, entries/pages, native plans and admission become different causes with different measurements. | RL86 takes the reader into older companions. The directory lists both product branches consecutively, although its introduction says to take the implementation in use. |
| Concurrent correctness: RL79 → RL90 → RL91 → RL93 → RL94 → RL106 → RL124 | The invariant, confirmed rejection, unknown outcome, external effect and distributed decision have distinct authorities. RL94 finishes the stale-worker argument at an enforcing resource. | RL124's original observed conflict is not a native test of separate participants or coordinator loss. See finding 4. |
| Recovery: RL95 → RL96 → RL115 → RL116 → RL97 → RL98 → RL117, with RL129 as the alternative native recovery branch | Durable bytes, visible replay, chosen history, lost later work and exclusive write authority remain distinct. The native chapters supply real commands and refusal outcomes. | The directory puts RL116 and RL129 in one list, and places failover before teaching its replica prerequisite. The bodies themselves provide reminders and links, so the main repair is the route. |
| Live change: RL100 → RL119; alternatively RL130; then RL122 or RL131/RL132 for installation or engine changes | Old authority, maintained writer compatibility and a global completion predicate survive the move to native jobs. Binary finalisation and first target-only work are real rollback boundaries. | A single six-page list hides three different tasks and two implementations. It looks more like mandatory continuation than a choice of investigation. |
| Distribution: RL105 → RL106 → RL107 → RL108 → RL109 → RL123 → RL124 → RL125 → RL126 → RL127 → RL128 | Routing, transaction participants, common time, placement, movement and membership build on each other. The native read-cost regression after hash sharding is especially useful. | Native range survival and decommissioning have observed outcomes. Native failed joining, identity rotation and resource-constrained relocation remain instructions to investigate rather than completed investigations. |
| Incident: RL103 → RL120, then RL128 as the alternative | Request time and server work remain separate; successful administrative requests are not mistaken for service recovery. | No new collection-level gap beyond the narrower native operational cases described below. |

### 1. Make fixtures explicit before the first executable sequence

**Understanding at stake:** a reader should know whether the next command continues the same database or starts another experiment. Reusing familiar identifiers should reduce memory cost without inviting accidental continuation.

**Passages checked:** RL77 creates `customers`, `sessions`, `bookings`, `orders` and `order_lines`. RL78 later creates another `orders` with only tenant/order IDs and a `payments` table. RL79 creates `customers`, `sessions` and a differently shaped `bookings` again. RL81 creates yet another `orders`, `customers`, `sessions` and `bookings`. These are sensible local examples, but running the new-application path in one schema fails at existing names. There is no initial fresh-schema instruction or common setup destination in those early pages. RL110's “An isolated server and two clients” does supply a careful disposable native setup; RL113 explicitly asks for a fresh schema/reset. RL123 supplies a bundled native worksheet and reset contract.

**Smallest repair:** put one short fixture convention beside the directory's path instructions, and a local sentence before the first CREATE block in the affected pages: each article's SQL starts in its own empty disposable schema/database unless it explicitly continues an earlier fixture. Link a usable PostgreSQL setup, give the exact schema/reset command or downloadable per-page script, and state how to end sessions before resetting concurrency examples. Do not create another setup article. The early examples should be runnable without first discovering the PostgreSQL internals branch.

The shared workshop is a family of fixtures, not one evolving schema. For example, RL77's `o81` buys two €20 seats, RL81 adds a €5 workbook, RL93 deliberately uses a one-seat request totalling 4,000 cents, and RL110/RL116 use a €20 order. Those local meanings are supplied, so they do not falsify the explanations. A visible convention would stop a sequential reader from trying to reconcile those values as one persistent order. Preserve the invariant and identity roles; do not force every experiment into a huge common schema.

### 2. Turn directory lists into task paths with explicit forks

**Understanding at stake:** choosing a path should save the reader work. The directory says “Take the implementation branch you use”; its arrays then place PostgreSQL and CockroachDB consecutively.

**Destinations checked:** slow endpoint lists RL113 then RL126. Recovery lists RL116 then RL129 and later RL98/RL117 without RL97. Live change lists PostgreSQL DDL, CockroachDB jobs, PostgreSQL upgrade, CockroachDB upgrade and cross-engine migration in one list. Concurrent work appends distributed commit and CockroachDB retries to all ordinary cases. These are all real destinations, so file-existence checks cannot find the problem.

**Smallest repair:** show a shared route followed by labelled choices. Slow endpoint: RL87, optional RL86, then **PostgreSQL: RL113** / **CockroachDB: RL126**, with RL102 when concurrency is the limit. Recovery: RL95 → RL96, then **PostgreSQL: RL115/RL116** / **CockroachDB: RL129**; offer availability as a separate RL97 → RL98 → RL117 continuation. Live change should have three entries: application schema, installed version, whole-store migration. Ordinary correctness should offer RL106/RL124 as a distributed continuation, not another prerequisite. The exact routes can remain short.

Add RL85 and RL104 as explicit next steps for building the service. The new-application list already reaches an advanced recovery protocol; leaving parameter binding, acquired-connection ownership and runtime authority undiscoverable in that route is an odd priority. This is a navigation repair, not a claim that those subjects are absent.

### 3. Repair RL86's old continuations without losing their teaching

**Understanding at stake:** a link promising the next lesson must reach the completed home for that lesson. RL86 is the sole draft still using the old relational reading architecture. Its “Indexing queries”, “Maintaining indexes”, “Storage” and older PostgreSQL companions are offered as the natural next steps, while the new map puts those duties elsewhere.

A source-level destination inventory found 26 distinct old relational URLs, all in RL86. Every draft and evidence destination checked existed. I did not run a build or check rendered anchors. The problem is teaching ownership rather than 404s.

The table below is the exact repair list. Paths are relative to `/learn/databases/relational/` in the old column and `/review/relational/` in the proposed column. Some links cannot be replaced mechanically because the new target does not yet teach the promised operation.

| Old destination | Checked completed home or smallest honest repair |
| --- | --- |
| `storage/#pages` | `rl92/#a-row-lives-inside-a-page`; native tuple inspection is `rl110/#from-a-key-to-tuple-bytes`. |
| `storage/#fill-factor` | `rl110/#hot-preserves-the-existing-index-route`, which teaches the same-page trade and the limit of fillfactor. |
| `storage/` | Split its combined promise: RL92 for layout/history; RL95 for write-ahead recovery. Do not label either “Storage and durability” as if it owned both. |
| `query-execution/` | `rl87/#read-the-plan-as-rows-flowing-towards-the-result`. |
| `indexing-queries/#diagnosis` | RL87's statistics/parameter investigation; PostgreSQL-specific repair continues at RL113. |
| `indexing-queries/#bare-column` | The existing RL86 `#expression` explains matching expressions. Retain the measured bare-column cases as a link to the actual `rl86-experiment.sql` evidence if their measurements remain promised. RL113 is not an equivalent worked bare-column lesson. |
| `indexing-queries/#breaks` | RL86's own `#order` already covers mixed direction, NULL placement, collation and LIMIT. Remove the redundant outgoing promise or link locally. |
| `indexing-queries/#soft-delete` | RL79 “Uniqueness needs the business condition” for conditional uniqueness; RL80 “Deletion has several destinations” for reuse/lifetime. Change the wording to those actual lessons. |
| `indexing-queries/#foreign-keys` | RL86 `#unique` already gives the necessary referencing-index consequence. Remove “measures the difference” unless linking the actual measurement. No checked new page supplies that exact measurement as an article section. |
| `indexing-queries/#joins` | RL81 for grain/reference correctness, RL87 for join execution. Label the intended job. |
| `indexing-queries/#order-limit` | RL86 `#order`, followed by RL83 for continuation correctness. |
| `indexing-queries/#plans` | RL113 for the completed PostgreSQL plan lesson. Retain the small cross-engine terminology comparison locally if it is needed; RL113 does not claim to teach plans in four engines. |
| `indexing-queries/` | Replace the generic companion promise with specific RL87/RL83/RL113 routes. Optional-condition patterns not taught there should not inherit the old title's promise. |
| `large-results/#page-cost` | RL83's “A keyset cursor remembers values”, with RL86's existing key geometry for access cost. |
| `maintaining-indexes/#build` | RL119 “A failed concurrent index can remain” plus its lock/rewrite section. Preserve engine-specific online-operation qualifications in the local comparison. |
| `maintaining-indexes/#measure` | **Needs a completed native index-maintenance section.** RL111 measures heap reuse and transaction age; it does not replace index-density/baseline diagnosis. See allocation below. |
| `maintaining-indexes/#rebuild` | **Needs that same home.** RL119 handles concurrent creation and invalid remnants but does not yet teach choosing and executing REINDEX CONCURRENTLY. |
| `maintaining-indexes/#drop-safely` | **Needs that same home.** A safe unused-index decision needs counter interval/reset/replica/constraint evidence and a deployment recovery path. |
| `maintaining-indexes/` | Replace only after those lifecycle duties have an actual home, or explicitly retain the older page as separate available reference and record the dependency. Do not imply the replacement collection already contains its full lesson. |
| `postgresql/indexes/#gin` | `rl112/#gin-extracts-keys-from-a-value`. |
| `postgresql/indexes/#brin` | `rl112/#brin-excludes-physical-page-ranges`. |
| `postgresql/indexes/` | RL112 for methods/operators, RL113 for planner evidence, RL110 for HOT, RL119 for live builds. The old bundled description must be split. |
| `postgresql/json/` | RL114, which actually teaches representation, operators, shape rules and update cost. |
| `postgresql/full-text-search/` | A specialist published reference is defensible, but label it as such. RL112/RL114 only bound extension/type choices; they do not replace a full text-search investigation. Alternatively stop the generic index list at the explanation it needs and link official reference. |
| `postgresql/vector-search/` | Same decision as full-text search. Keep explicitly optional specialist reading or remove this expansion; do not relabel RL114 as a vector-search tutorial. |
| `sandbox/?tutorial=indexes` | Keep as the explicitly labelled PGlite 18.3 counterpart to retained measurements. It is a real practical destination with a different execution setting, not an obsolete native lesson. |

**Recommended ownership repair:** RL119's RL63 should own the PostgreSQL index lifecycle under live load, extending its existing concurrent-build/invalid-remnant responsibility. It is the closest complete existing home. Add a contiguous investigation of:

- measured index size/density against a useful baseline, with inspection cost and reusable space distinguished from an immediate need to shrink;
- deciding whether a rebuild earns the I/O, WAL, temporary-copy, replica and lock cost, then REINDEX CONCURRENTLY's supported procedure, restrictions and failed-copy inspection;
- removal from a representative usage interval, including counter resets, read-serving replicas, constraint/reference duties, prefix/uniqueness/collation differences, replacement/rollback and post-drop request acceptance.

Keep the old companion's causal examples and operational depth for those decisions. I checked its `#measure`, `#rebuild`, `#build`, `#drop`, `#drop-safely` and `#rollout` sections: it supplies real material that would disappear under a blind replacement, including why an apparently unused constraint index cannot be judged from scan counts. The repair is not simply a new link label.

RL86/RL19–20 should keep general access choice, the sparse-page cost and the decision to maintain/remove, with a compact comparison where engines charge differently. RL111/RL55 remains heap cleanup, horizons and age safety. RL112/RL56 remains method/operator selection, linking to RL119 for lifecycle. If a full index lifecycle makes RL119's separate column-change/backfill investigation difficult to enter, a focused maintenance page would earn a boundary; preserving 54 is not a reason to bury it. Try the existing home first and review the assembled result.

### 4. Complete the native distributed transaction handoff

**Understanding at stake:** seeing a native conflict on one shared record does not establish how a distributed transaction recovers when different required authorities are unavailable.

**Passages and code checked:** RL106 separates the two-phase teaching model from product behaviour. Its final native-evaluation paragraph asks for coordinator/relevant-node loss at a documented boundary, one participant healthy while another cannot participate, and a lost client reply. RL124's Figure 1 expressly says its actual keys need not occupy different ranges. The observed schedule in `lab/cockroach_extra.py::concurrency` opens two serializable clients, lets both read capacity, commits A, receives `40001` on B and rereads zero. The main scenarios split the events table, not the session/order participants used in this history. Process stops elsewhere cover upgrades, regional availability and membership, rather than this transaction's decision boundary.

**Initial finding:** RL106/RL49 and RL124/RL68 have good mechanism teaching and a native retry history, but the native distributed decision/recovery outcome has no demonstrated home in the original audit artifact. This is the main substantive gap found against the collection's distributed practitioner promise.

**Smallest complete repair:** add one bounded native supplement to RL124. Establish and observe separate participant ranges and their authority placement. Lose the client completion/gateway at a controlled externally observable boundary, recover the same request, and check the complete capacity/order result. Separately make one required participant unavailable while an independent participant is healthy, record the permissible failure/uncertainty, restore it and verify one final outcome. Keep the client protocol, range evidence and final invariant together. Do not claim to have observed an internal STAGING instant from SQL results. Retain the distinction between a lost reply after a server completion and a crash before an unobserved internal decision.

The coordinator reported that it is adding this supplement after I raised the initial finding. This report preserves the finding before that change. It needs a later check against the actual new worksheet and passages; the proposed exercise is not yet evidence in this audit.

### 5. Be precise about completed native operation coverage

RL128 is substantial: it establishes real TLS/client identity, an allowed read and denied write, range/member inspection, region-group failure via RL127, and completed decommission with replica removal and preserved foreground records. RL129 also has a separate destination-cluster acceptance drill that exposes missing user/grants rather than silently using the administrator. RL130's pause-requested/paused/resume history and RL131's failed low-memory finalisation are real changes of condition with useful consequences.

The map nevertheless assigns RL128 a secure node failing to join, constrained relocation and a bounded privilege/rotation procedure. The draft says certificate renewal/revocation needs a tested procedure; it does not teach one. It explains what to inspect when relocation stalls, but the native drill explicitly does not test disks full or constraints preventing removal. The source scripts establish successful node identity, not a failed join repaired without disabling trust. These specific units are thin or unexecuted, not absent cluster operation as a whole.

Smallest repair: either add a bounded failed-join/identity replacement investigation to the existing RL128 worksheet and give the reader the supported overlap/verification/revocation steps, or mark those execution requirements as unfinished in the delivery map. A capacity/constraint-blocked removal case should show the relevant native health/placement evidence, the decision to keep the member, a bounded repair and completed foreground acceptance. Do not turn a list of possible causes into a claim that this changed case ran. This finding should be reconciled with the fresh native reviewer before commissioning additional work.

## Coverage map audit in both directions

The following records what the bodies teach, not their frontmatter status. “Present” means I could trace the allocated decision through an example and its consequences; it does not mean I reran its native evidence or independently verified every product claim.

| Article home(s) | Actual teaching and allocation judgement |
| --- | --- |
| RL76 | Present: relations/transactions, architecture/responsibility choices and an acceptance trial. The comparison is conditional rather than a product ranking. |
| RL77 | Present: grain, keys/cardinality, dependencies/anomalies and agreed-price versus derived-copy meaning. |
| RL78 | Present: exact value/unit, instant/local time, comparison/collation and unknown-predicate decisions, including a failing NOT IN. |
| RL79 | Present: row/reference/conditional uniqueness, tenant ownership, check timing and the cross-row enforcement boundary. |
| RL80 | Present: retained agreement, effective and recorded time, correction/report meaning, audit distinction and deletion across copies/restores. Full event sourcing remains appropriately excluded. |
| RL81 | Present: basic SELECT, join multiplicity, child pre-aggregation, outer-join predicate placement and existence/exclusion. |
| RL82 | Present: group/window grain, empty inputs, denominators, peer frames and tie/ranking policy. |
| RL83 | Present: keyset/offset positions, mutable ordering, one-snapshot exports, connection lifetime and restartable materialisation. |
| RL84 | Present: conditional mutations/results, version-aware conflicts, staged rejects and per-input reconciliation, including concurrent outcome classification. |
| RL85 | Present: bound values versus SQL structure, driver conversions/errors, ORM work, transaction/stream ownership and timeout uncertainty. Its omission from the new-application route is a discoverability issue. |
| RL86 | Present and unusually deep access-path teaching. It also retains old companion boundaries. Index lifecycle needs the specific ownership repair above; extending this already long page with another operational tutorial is unlikely to minimise reader cost. |
| RL87 | Present: physical operators/state, stale/skewed/correlated estimates, prepared-plan variation and cause-led measurement. Native EXPLAIN interpretation overlaps RL113; it supports the worked shared example, though a native continuation can skip the repeated primer. |
| RL89 | Present: pruning versus local access, key/reference consequences, future/default partitions, attach proof and detach versus erasure. |
| RL90 | Present: transaction boundary, snapshots, lost update, write skew and a native serializable rejection/whole-decision retry. |
| RL91 | Present: atomic-lock lifetime, existing control row, missing-row trap, wait graph, deadlock and changed selection under SKIP LOCKED. |
| RL92 | Present: layouts/version representation, old-reader horizon, retained physical bytes, reuse versus compaction and wide values. |
| RL93 | Present: actual withheld COMMIT completion, stable owner-scoped intent/result, claim-before-effects, pending recovery and retention/restore boundary. |
| RL94 | Present: atomic intent, duplicates/ordering, short lease claims, stale effect rejection at the authority, deduplication and work admission. The highest-seen fencing-token qualification avoids a false expiry guarantee. |
| RL95 | Present: WAL/data ordering, crash boundaries, group commit, checkpoints, torn-page safeguards and failure-domain scope. |
| RL96 | Present: backup types/dependencies, target selection, isolated restore, later-work reconciliation and service acceptance. Native procedural detail overlaps RL116, but preserves the complete general worked argument; do not remove its later-work branch. |
| RL97 | Present: receive/flush/apply positions, native paused replay, read-your-writes barriers, history-aware tokens, synchronous contracts and retention. |
| RL98 | Present: uncertain failure detection, verified process fence, acknowledged asynchronous loss, promotion, native rewind and refused writes after rejoin. |
| RL100 | Present: explicit old/new authority, lock wait, guarded batches, skipped/late rows, maintained whole-population equality and rollback stages. |
| RL102 | Present: occupied-time concurrency, fleet-wide pools, measured hot-row limit, bounded admission, retained-byte/catch-up and degraded capacity budgets. |
| RL103 | Present: incident branches, native wait ownership/cancellation distinction, released-queue model and request-level recovery. |
| RL104 | Present: task-derived authority, trusted context, actual denials, owner/bypass, privileged code and connection/backup/rotation responsibilities. |
| RL105 | Present: alternatives, ownership/routing, colocation, global identity/index authorities, skew/hot keys and coherent global queries. |
| RL106 | Present mechanism/model for replicated participants, prepare, durable decision, coordinator uncertainty and workflow trade. Native handoff incomplete at initial audit; finding 4. |
| RL107 | Present: mixed versus common cuts, settled frontier, retained history, current decision boundary, HLC contrast and bounded-clock wait. |
| RL108 | Present: failure-domain quorum arithmetic, communication floor, global-rule dependency, degraded routes and residency/copy scope. |
| RL109 | Present: snapshot/tail movement, equal-count failure, learner/membership distinction, joint-majority model, drain/decommission and movement/upgrade budgets. |
| RL110 | Present: disposable sessions, backend/shared-buffer/private-state distinction, physical tuple identity, cache replacement model, versions and observed HOT boundary. |
| RL111 | Present: held horizon, exact reclaim/reuse, blocking rewrite, visibility/freeze distinction and age/autovacuum diagnosis. It is not an index-maintenance replacement. |
| RL112 | Present: native B-tree/GIN/GiST/BRIN, visibility, operators/classes, rechecks, changed physical correlation and write-cost choice. |
| RL113 | Present: skewed native prepared plans, correlated statistics, actual plan interpretation, spill removal and request-level verification. |
| RL114 | Present: JSONB representation/null, operator-specific access, stronger shape rules, same-member conditions, promotion authority and physical row/update cost. Arrays/ranges/extensions are appropriately conditional. |
| RL115 | Present: native progress/settings, committed/unfinished/unlogged crash outcomes, checkpoint/log evidence, torn-write and asynchronous-acknowledgement scope. |
| RL116 | Present: verified base/archive, target pause/timeline, conflict-aware reconciliation and a deliberately unreachable target. |
| RL117 | Present: independent native standby, replay lag, synchronous wait, slot/feedback budgets, process fence, promotion/routing/rejoin boundary. |
| RL118 | Present: selective initial copy plus stream, row identity, schema failure/repair, unchanged sequence, apply ownership and sink responsibilities. |
| RL119 | Present: native lock/rewrite, failed concurrent object, old/new writer compatibility and maintained completed backfill. Best existing home for the missing native index lifecycle. |
| RL120 | Present: bounded native request/activity evidence, blocker cancellation, reused spill investigation, connection observation, pool assumptions and interval statistics. The link to RL113 saves a second full spill tutorial. |
| RL121 | Present: actual runtime roles, trustworthy versus spoofable tenant identity, owner/BYPASSRLS/FORCE, policy composition and privileged temporary-name lookup. |
| RL122 | Present: route choice, inventory/collation, fenced dump/restore, actual 17.6→18.6 copy-mode upgrade, positive/negative acceptance and later-write rollback boundary. |
| RL123 | Present: native setup/licensing boundary, table/index encoding model, actual range/replica inspection, gateway/lease roles and sequential hotspot. |
| RL124 | Present: intent/record/parallel-commit mechanism, exposed serializable retry, callback/effect boundary. Separate-participant recovery incomplete in the original exercise; finding 4. |
| RL125 | Present: actual selected isolation, exact and bounded historical syntax/restrictions, common historical transaction, safe follower eligibility and retention/current-authorisation distinction. Follower routing performance is honestly unclaimed. |
| RL126 | Present: native index-join removal, SQL/KV placement distinction, actual hash-sharded ordered-read regression and unmeasured write-benefit limit. |
| RL127 | Present: native locality/region settings, five-voter placement gate, process-group loss, accepted foreground result and rejoin. Host/WAN limits remain clear. |
| RL128 | Present native trust/privileges, member/range distinction, successful decommission and acceptance. Failed joining, rotation and constrained removal thin against map; finding 5. |
| RL129 | Present: native full/incremental/history recovery, selected earlier/later outcomes, same-cluster inspection, separate destination identity/grant failure/repair and bounded acceptance. |
| RL130 | Present: computed-column work, job state, real pause/resume with concurrent callers, wrong unique-rule rejection and final access-path acceptance. |
| RL131 | Present: actual supported-pair mixed versions/return, logical finalisation, low-memory internal failure, post-finalisation old-binary refusal and preserved foreground records. |
| RL132 | Present: actual deferred-reference incompatibility/repair, source role fence, one-snapshot offline copy, identity-level acceptance obligation and target-only work before return. It does not claim live CDC. |

### From the map to the teaching

All allocated general subject areas have real passages, and all native articles have substantive content. The two material native exceptions are the changed histories above. Index upkeep is a discovered ownership hole rather than a missing page count: the older continuation supplies operational depth that the mapped native homes have not absorbed.

The map still calls the allocation a proposal and describes execution as future work. That is valid planning evidence, but it cannot serve alone as the delivery coverage record for these completed drafts. Keep a dated actual-coverage overlay or explicit handoff status with the map, including unfinished changed cases. Do not change historical planning prose to imply that experiments existed when the plan was written.

FD04, FD05 and FD06 are allocated external shared homes. The drafts supply local snapshot/tail, cutover and measurement essentials rather than link to nonexistent field articles. I found no ghost FD link. This is the right immediate reader behaviour, but the delivery map should record that those full field homes remain unavailable. In particular, RL76/RL102/RL126 give useful trial and measurement judgement; they are not a completed general workload-evaluation course. A later shared FD06 can replace local reminders only when it actually exists and teaches the promised method. The parked distributed-systems programme need not be opened.

### From the teaching back to the map

Most apparent overlap buys a direct entrant a necessary reminder. RL79's capacity failure earns RL90; RL93's authoritative lookup earns RL97; RL114's typed-column promotion earns RL119. Cutting those reminders would increase prerequisite travel. RL120's link to the existing spill experiment is a good model for avoiding an unnecessary second lesson.

RL86 is the exception requiring an allocation decision. Its retained layout, HOT, visibility, bloat and maintenance companions reflect the older collection. Keep the counted B-tree/composite/selectivity/write-cost model, which is coherent and deeply taught. Rehome native operational depth and retarget links. Specialist text/vector tutorials can remain explicitly optional available reading; their existence must not expand RL114 into a promised replacement for both.

RL96 and RL116 repeat the same restore/mistake/later-order shape with different fixtures. That is noticeable reading cost but also the shared mechanism's natural native realisation. My smallest repair is to let the general route clearly fork into the native worksheet and identify the native chapter as the executable continuation; retain the recovery argument in both direct entrances. I would not cut the valid-later-work branch to save repeated words.

## Limits and recheck plan

This was a complete source read-through, not a rendered-media or execution review. The component props and figure prose establish their intended scope, but I did not operate every widget, test mobile/theme behaviour, rerun the databases or verify the precise HTML anchors. The source destination inventory established available files, not rendered link correctness. Existing article reviewers remain the evidence for their specialist technical and visual checks.

The native scripts use several local binary/driver assumptions. RL110 and the CockroachDB bundle explain them; the early general pages need the same usable entry, as finding 1 describes. I did not infer portability from a successful captured run.

Recheck the actual repaired journeys after edits: one new-application fixture sequence; one slow-query route using a single implementation; one recovery route distinguishing availability from restore; RL86 through each promised continuation; and the added native distributed outcome. Re-read RL119 as an assembled article after lifecycle additions, with a fresh practitioner checking both diagnosis and action. Use a rendered link/anchor check after source repairs. No collection-wide rewrite or full execution rerun follows merely from the number of pages reviewed.

### Handoff after the initial audit

The coordinator subsequently reported a completed native two-range fault supplement, sent for independent CockroachDB review, and commissioned the bounded RL119 lifecycle repair with its own fresh recheck. It also reported adding the early fixture convention and setup/cleanup resource. I have kept the initial findings intact rather than treating those reports as my independent acceptance of the repaired artifacts. The exact RL86 destination list above is the source for its navigation repair; the directory fork repair remains with the coordinator.

## Independent recheck of the actual repairs

19 October 2026. **Ready as a draft at the collection level.** I reread the repaired directory, fixture entry, RL86 continuations, expanded RL119 lifecycle, RL124 fault history, RL128 identity cases and revised RL129 recovery. I also checked the relevant native source and recorded results. The preserved initial findings above describe the earlier artifacts; this verdict supersedes their unresolved status. I found no remaining consequential collection-level gap in this bounded recheck.

This accepts the teaching routes, ownership and bounded practical outcomes. It does not replace the ongoing fresh-reader/technical/editor recheck of RL119 or the coordinator's final rendered-anchor, build and browser checks. I made no draft/map changes and did not rerun the servers.

### Fixture and path repairs accepted

The directory now separates the shared route from named implementations (`src/pages/review/relational/[...article].astro`, journey definitions at line 22). Recovery and availability are different entrances; schema changes, installed-version upgrades and moving an application are separate tasks. The new-application route includes RL85 and RL104 before choosing its native branch. These changes remove the earlier implication that a reader must follow PostgreSQL recovery with CockroachDB recovery or take every migration task in sequence.

The same directory states the independent-fixture convention before the paths. RL77–85, RL87 and RL89 repeat it locally before their first investigation. `evidence/relational-fixtures.md` supplies concrete `createdb`, `psql` and cleanup commands, expected-error handling and the boundary between an ordinary disposable database and the isolated clusters needed for crash/replica exercises. Reading RL77 → RL78 → RL79 now makes the repeated table names an explicit new fixture rather than an unexplained failed migration. The change preserves familiar identifiers without promising one persistent order history.

### Index ownership and continuations accepted

RL86 now routes its owned continuations into the completed drafts. I checked the actual surrounding promises, including layouts to RL92, WAL to RL95, HOT/fillfactor to RL110, query diagnosis to RL87/RL113, pagination to RL83, native methods/JSON to RL112/RL114 and index lifecycle to RL119. The body no longer promises an absent four-engine maintenance tutorial through a generic companion label. Its compact engine-operation comparison distinguishes PostgreSQL concurrent work, InnoDB metadata/algorithm conditions, SQLite's writer boundary and SQL Server's operation/edition limits.

A repeated source inventory found only three old relational destinations in RL86: explicitly optional published full-text and vector investigations, and the PGlite sandbox paired with its preserved measurements. Those roles are honest. The draft/evidence destination inventory found no missing source files; rendered anchors remain outside this recheck.

The new RL119 sections repay those links. “Measure an index before rebuilding it” (line 109) compares 1,507 sparse leaves at 9.30% density with the same surviving keys freshly built into 151 leaves at 89.71%. “Emptied pages can be useful capacity” then demonstrates reuse, so file size does not become an automatic rebuild rule. “Rebuild within a resource and recovery budget” (line 159) connects temporary space, WAL, old-snapshot waits and foreground results to a supported concurrent operation. “Recover the failed rebuild's copy” (line 204) distinguishes the still-valid original from an invalid but maintained `_ccnew` copy. “Remove an index only after accounting for its duties” (line 224) carries the usage interval through resets, replicas, uniqueness, foreign keys, definition differences, replacement, removal and a real restoration budget.

The lifecycle record supports those particular observations: `history_sparse`, `history_baseline`, `history_rebuilt`, `failed_reindex_catalogue`, `failed_reindex_cleanup`, `usage_before_drop` and `acceptance` in `evidence/rl119-lifecycle-observed.json`. The final acceptance retains t4/o81/r81 at 20.00 and the independently scoped t5/o81/r81 at 90.00. The index change does not silently redefine identity or historical price.

I reread this expansion into the existing compatibility/backfill argument. The page is considerably deeper, but its headings provide direct maintenance entrances, its opening announces the lifecycle, and the final transition connects replacement index storage to replacement data representation. I do not find a collection-level reason to split it merely because it is longer. A fresh assembled-page editor can still improve reading cost without removing the operational duties. The map now assigns this native lifecycle explicitly to RL119/RL63 and adds a dated production reconciliation (line 926), while RL111 and RL112 retain their distinct jobs.

### Distributed transaction handoff accepted within its stated scope

RL124's “Observe two ranges across a lost reply” (line 68) now has a real native continuation beyond one-row contention. I checked `lab/cockroach_atomicity.py` and `evidence/cockroach-atomicity-observed.json`. The final placement observations show left ranges 83/79 on `us2` with one voter and right ranges 81/80 on `ap3` with one voter. This is actual different authority placement, not an inference from table names.

`RL124-discard-commit-and-lose-gateway` records the intercepted COMMIT completion and the reply discarded before application delivery. `RL124-after-gateway-loss` returns `1,1` through a surviving gateway. The unavailable-participant history separately leaves an independent left health row readable at zero, receives `57014` for the required right update and ends after rollback/rejoin with `1,1` in `RL124-no-partial-visible-unit`.

The prose states the two important limits: singleton replicas deliberately expose participant availability, and a server completion followed by gateway death does not reveal the internal decision/intent-cleanup stage. It does not turn this observation into a traced STAGING recovery claim or a resilient topology recommendation. The generic RL106 mechanism and native RL124 outcomes now meet without replacing one with the other. Rejected transaction retries and unknown outcomes still point to their separate application protocols.

### Native identity and recovery continuity accepted

RL128's new trust and identity sections (lines 64 and 80) finish the changed secure-join case. The identity record shows three members and a working foreground read during the unknown-CA join failure, then four members and the same session after trust repair. It also records a replacement certificate working while the saved old certificate still works; both become unable to establish a new connection after `NOLOGIN`, while the new read-only identity can read and remains unable to mutate. The source and prose keep renewal, login retirement and already-established sessions separate.

The map's changed operational case is a failed secure join **or** a constrained relocation. The repaired failed-join investigation fulfils that alternative; my initial wording should not be read as requiring both cases to run. Disk/constraint-limited removal and established-session retirement remain stated deployment conditions, not secretly completed experiments. Their unexecuted status does not leave this bounded changed case unfinished.

RL129 now carries one valid booking contract through backup and replay. The main article uses the separate destination worksheet throughout: an atomic guarded statement accepts r82 and consumes one place; the incremental includes both changes; the latest restore returns r80/r82 with one place remaining; the earlier restore returns only r80 with two. The later-work section identifies retained acceptance evidence rather than treating an attempted request as a committed purchase.

I checked the `RL129-valid-*` observations and the `RL129-coupled-reconciliation` command sequence in `evidence/cockroach-restore-observed.json`. The first replay claims r82, decrements and commits; the second gets no new claim, compares customer/amount and skips the decrement. Both post-states show r80/r82 and one remaining place. The separate missing-user/grant acceptance still uses an ordinary identity and retains denied mutation/invalid-capacity checks. The older accumulated worksheet is now explicitly distinguished from this valid booking test, so it no longer supplies an uncoupled marker as evidence of a preserved booking invariant.

### Source pins and remaining limits

The principal source snapshots at this recheck had these SHA-256 prefixes: directory `cd993dfcb28147c8`; RL86 `c9769309cc6ea682`; RL119 `d29f03df3a2f1576`; RL124 `b7a020a3a1afc419`; RL128 `1b5ac5c1a1f12cdd`; RL129 `132478324dbe43c5`; coverage map `36f51e7ea8c91d29`. Line references above locate the checked sections in those snapshots; later editorial changes need proportional rechecking.

The remaining limits are practical boundaries already named by the text: native exercises share a host, do not benchmark production capacity or establish geographical/power-loss survival, and do not reveal every internal commit state. The full shared FD04/FD05/FD06 investigations are still outside this replacement collection; local essentials remain sufficient to follow these bounded paths. Optional specialist reading does not become a hidden prerequisite. None of those limits calls for reopening the parked general distributed-systems programme or adding a product catalogue.
