# Whole-tree review: structure, overlap and adversarial consolidation

**Perspective:** fresh independent structure/overlap review under `staycurrent-review`.

**Inputs:** the original `commission.md`, `whole-tree/round-1/manifest.yaml` and the complete `whole-tree/round-1/tree.yaml`. I read all 39 active plans, including their headings and subheadings. I did not read previous runs, the existing relational corpus, local reviews or the other whole-tree reviews. Heading numbers below are one-based within the named article; they are not the zero-based YAML path indexes.

**Verdict: revise before writing.** The tree covers the original relational-practice goal, and most destinations have a defensible practical purpose. It does not need another major branch. It does need a smaller performance diagnosis journey, less repeated diagnosis in operations, and an explicit route through its conditional depth. The required changes below concern the organisation of teaching, not technical corrections or missing specialist curricula.

The snapshot has 39 destinations, 281 article-level headings and 86 subordinate headings. These counts establish navigation and scope commitments, not eventual word count or reading time. I have not assumed an article length. The strongest parts of the structure are the separation of representation from expression semantics, declarative enforcement from transaction protocols, database outcomes from application recovery, and replica promotion from restoration of correct data. Cutting those boundaries would save destinations by making several different engineering questions harder to answer.

## Required changes

### R1 — Complete ordinary plan diagnosis in one destination

**Locations:** a05 headings 5–6; a26 headings 1, 6–8; a27 headings 1–7.

The principal worked reporting query is split at the first consequential estimate/observation mismatch. a26 explicitly hands that point to a27, whose opening resumes it. This is a weak stopping point for a practitioner's task: the reader has learned to collect a plan and recognise a common problem, but must start another destination to explain it and choose a routine remedy. Both plans also introduce their own evidence ledger, alternative-plan reasoning and correctness-preserving intervention. Sharing the case record reduces repeated setup but does not remove this navigation cost.

**Preferred repair:** merge a26 and a27 into one destination, provisionally *Diagnosing a query from its execution plan*. Preserve a coherent sequence: safe collection; following rows and repeated work; interpreting units; locating a consequential mismatch; statistics, skew and dependencies; parameter-sensitive prepared execution; one verified remedy. Fold a27 headings 1 and 3 into that case rather than retain two restarts of the investigation. Combine a26 heading 8 with a27 headings 5–7 into its conclusion. Reduce Materialize/Memoize, parallel worker reporting and scoped planner controls to conditional examples or compact reference material when the main case does not require them. Do not concatenate fifteen headings unchanged.

A defensible alternative is to make a26 finish a complete ordinary diagnosis, including one consequential estimate error and its verified correction, and narrow a27 to genuinely conditional depth on statistics and parameter-sensitive planning. In that version, its opening must identify the extra decision requiring the detour; the first estimate mismatch must cease to be the general hand-off boundary.

**Understanding lost:** none of the required practical capabilities need be lost. The preferred compression gives up a standalone tour of less common plan nodes and some breadth of parallel/reporting variants. Those details aid unusual investigations, but they do not justify interrupting the ordinary diagnosis at its central step. Preserve rows/loops, inclusive reporting, partially consumed inputs, statistics limitations, common versus rare parameters, and the difference between an estimate fault and expensive real work.

**Acceptance:** a reader arriving with a slow query can collect evidence, interpret its significant work, explain one ordinary consequential estimate error and test a remedy without a mandatory second destination. a05 presents one route to that completed task.

### R2 — Give workload diagnosis one teaching owner; shorten monitoring and sizing

**Locations:** a05 headings 1–2 and 7–8; a28 headings 1–4; a36 headings 1.1, 2.1, 3, 5.2 and 7.

The existing owner statements are useful, but the heading briefs still commission repeated instruction. a28 establishes measurement boundaries, arrivals/completions/outstanding work, interpretation of rates and waits, competing bottleneck hypotheses, and a choice among reduced work, concurrency limits and added resources. a36 then teaches outcome denominators and rates again, works through a latency-regression diagnosis, specifies another representative-load exercise, and works through much the same intervention choice. a05 already supplies the common baseline and comparison method. These are not three independent reader decisions.

**Repair:** retain a28 as the owner of diagnosing concurrent workload behaviour. Keep a36 as a separate, shorter operational destination centred on deployment visibility, capacity worksheets, growth and provisioning lead times, normal versus degraded headroom, and actionable alerts. In a36:

- Fold headings 1.1 and 2.1 into a compact dashboard example that applies the established units and boundaries, linking to a28 instead of teaching the rate/queue model again.
- Replace heading 3's full latency-regression investigation with a small routing table: observed service change, evidence to retain, and the owning diagnostic or incident procedure.
- Keep heading 5.2's operational acceptance criteria and reuse the load method/results, rather than commission a second load-test tutorial.
- Fold heading 7 into the capacity/alert conclusion: who acts, what capacity assumption must be rechecked, and when to escalate. Delegate the worked bottleneck/intervention comparison to a28.

Keep a05's short orientation and common measurement procedure. Its job is to let readers choose the next investigation, so a short overview is appropriate there.

**Understanding lost:** no necessary capability. Readers lose a second worked latency-regression/intervention narrative and a repeated introduction to rates and waiting. They retain a single deeper diagnostic method plus the distinct operating skill of forecasting limits and acting before them. This reduces repetition without folding essential operations into query tuning.

**Acceptance:** a36 can be read for operational signals, headroom and alert policy without reteaching the investigation that a28 already completes; its remaining examples produce an operational artefact or decision rather than another bottleneck diagnosis.

### R3 — State the short working route and the conditional routes in the root

**Locations:** a00 headings 2–9; a02 heading 1; a08 heading 3; the a18/a19, a24/a25/plan-diagnosis, and a32/a34 links.

The root offers eight broad doors, each followed by several contextual doors, but does not yet commission a concise reading route. All the introductions are individually reasonable. Taken as a tree, however, they leave the newcomer to decide which depth is prerequisite to doing ordinary work, which can be used when a problem arises, and which applies only to a deployment choice. Reciprocal references among locks/isolation and storage/indexes/plans also need an entry order. A hierarchy of destinations is not by itself that order.

**Repair:** add a compact route table or closing passage to an existing root heading, without creating a new article. Identify:

1. The initial working route: supplied disposable setup in a02; enough a01/a02/a03/a04 to build and check one ordinary application path. Tell the reader when to return to deeper value, constraint, query or concurrency work.
2. The problem-driven route: correct-but-slow work through a05 to the completed diagnosis from R1; service limits through a07/a36; a live change through a06.
3. Conditional adoption routes: a32 only for an embedded candidate, a34 only after a concrete distributed requirement survives comparison with a simpler service; common server practice stays in the main examples and the compact PostgreSQL record.

Mark this distinction where a08 links its candidates as well as at the root. Keep the supplied exercise engine a practical starting environment rather than requiring the reader to complete the full selection evaluation before writing a first query. No new platform curriculum is needed.

**Understanding lost:** none. This adds a small navigation aid in exchange for less exploratory reading and fewer premature specialist detours. It does not make the deeper material dispensable for engineers whose work requires it.

**Acceptance:** a newcomer can identify a first useful route and an engineer with a specific diagnosis, change or adoption task can identify the relevant conditional route without opening all children.

## Optional further consolidation

These are concrete candidates for a smaller corpus, not requirements to reach an arbitrary article count.

### O1 — Fold the SQLite evaluation into its parent if it remains a compact candidate record

**Locations:** a08 heading 3.1; a32 headings 1–6, especially 4.1, 5.1 and 6.

The application-specific differences that justify SQLite depth are file/process ownership, actual loaded library, connection-level enforcement, writer acquisition/busy behaviour, WAL and durability settings, and consistent file/API backup. Keep those. The general representation fixture, restart/upgrade rehearsal and final adoption record can reference the common procedures and record their SQLite-specific deltas. If that produces a compact case, fold it into an expanded a08 heading 3.1 instead of retaining a separate six-part adoption article.

**Lost understanding:** a separately navigable end-to-end SQLite lab and some deployment fault examples. **Retained:** the differences that accept or reject SQLite for the application. If the writer can deliver a tightly bounded real-driver lab whose distinctive outcomes need the space, retaining a32 is also defensible; its present optional status is right. Do not fold a full six-section lab unchanged into the already substantial chooser.

### O2 — Cut the overlapping-key normal-form detour before cutting practical normalisation

**Locations:** a11 headings 2.2 and 3.1; retain headings 1–3, 4 and 5–7.

The alternative-key/BCNF/dependency-preservation counterexample is the first theory depth I would remove if the worked design becomes long. Basic candidate keys, partial/transitive dependencies, safe reconstruction and independent versus real associations already give the engineer considerable practical reasoning power. Retain the independent-set example in heading 4: it prevents a recognisable modelling mistake and is more useful here than a normal-form survey. The normal-form names should remain short labels for the reasoning.

**Lost understanding:** recognising a narrower class of redundancy involving overlapping candidate keys and explicitly comparing dependency preservation with lossless decomposition. That is real value, so make this a conscious cut rather than pretending it is already covered elsewhere. It is less central than enforcing ordinary business identity or maintaining a derived total correctly.

### O3 — Use one shared value contract across design, SQL and driver checks

**Locations:** a09 heading 7; a13 headings 1 and 9; a04 heading 2.1 and acceptance heading 7.

Keep the three ownership boundaries. Reuse a small expected-value contract rather than introduce three substantially similar decimal/null/text/time round-trip exercises. a09 should establish what must survive; a13 should test database expression outputs; a04 should own the actual driver's parameter/result conversions. a09's final heading can give expected cases and hand off execution of the driver-specific checks.

**Lost understanding:** no boundary reasoning, only duplicate fixture setup and conversion demonstrations. Distinct SQL-cast and driver-conversion failures must remain visible.

### O4 — Keep distributed ownership in operations to a decision boundary

**Locations:** a38 headings 5–5.2 and 6; a34 headings 2–2.1, 5–7; a31 headings 3–6.

a38 needs enough routing-key, cross-owner constraint/transaction, skew and recovery analysis to show that read replicas do not solve every write-capacity or locality problem. Keep that warning. Compress heading 5.2 to the obligations to check, and reuse a31 for a complete ownership-transfer sequence. Do not turn it into a resharding procedure. a34 should then carry only the measured CockroachDB-specific placement and failure evidence, using a38's operating questions and the same acceptance-record format as a08.

**Lost understanding:** a second general account of moving ownership, not the ability to judge whether distributing ownership changes the contract. a34 remains a conditional application of relational practice, not compulsory expertise in distributed systems.

### O5 — Bound the external-work alternatives around one complete recovery case

**Locations:** a23 headings 3–7.

Retain the atomic work record, short claim transaction, duplicate external success, lease expiry and reconciliation case. Those are directly useful relational application engineering. Give polling/change capture a compact comparison unless the worked case actually requires capture, and teach event version/order/retention only where it changes that case's recovery. The present boundaries already prohibit connector or broker specialism; enforce them in drafting rather than add destinations.

**Lost understanding:** some alternative publication-path detail and less event-contract breadth. No loss of the central understanding that committing intent is different from completing an external effect.

## Destination and major-section audit

The table records a decision for every active destination. “Retain” means its distinct practical task earns the navigation cost at this planning stage; it does not approve arbitrary length. All headings and subheadings were considered. The location ranges identify where depth or consolidation matters most.

| ID | Disposition and reason against the original commission |
| --- | --- |
| a00 Relational databases | Retain headings 1–9 as orientation, with R3. Each introduces a different responsibility; develop examples only enough to make the route intelligible. |
| a01 Designing relational data | Retain headings 1–7. Facts, row meaning and identity are the necessary spine; values, constraints, normalisation and history are different design decisions. Do not repeat child walkthroughs in the gateways. |
| a02 Working with SQL | Retain headings 1–10. This is the usable core rather than a menu: it already completes a staged report and basic changes. Keep pagination here; it does not need a separate destination. |
| a03 Making concurrent changes correct | Retain headings 1–7 and both children. Atomicity, decision coverage, visibility, aborts and commit evidence are not interchangeable. Keep retry policy and external delivery as short hand-offs in headings 5–6. |
| a04 Building applications around a relational database | Retain headings 1–7. Binding and authority stay here; resources, generated work, operation recovery and external work earn their different follow-ups. Apply O3 to repeated conversion exercises. |
| a05 Understanding and improving database performance | Retain headings 1–4 and 7–8 as the diagnosis spine. Consolidate headings 5–6 and their descendants under R1; use this article's measurement method throughout the branch. |
| a06 Changing a live database | Retain headings 1–7. Compatibility and authority are the organising argument; physical DDL, resumable data work and service cutover are legitimately distinct procedures. Keep lifecycle retirement here as an application of staged change. |
| a07 Running a relational service | Retain headings 1–7. Shared requirements/responsibility and incident selection belong here. Separate security, capacity, upkeep, promotion and restoration are justified by their different next actions. |
| a08 Choosing a relational database | Retain headings 1–6, with R3 and O1. Keep one common evaluation/decision-record structure; candidates supply consequential differences and evidence. Do not make all candidate labs a required route. |
| a09 Choosing types and representing missing values | Retain headings 1–6 and a shorter application-boundary conclusion under O3. Numeric, text, temporal, absent and structured values are distinct common mistakes, not a type catalogue. |
| a10 Expressing rules with constraints | Retain headings 1–8. Tenant references, conditional uniqueness, timing and interval conflicts earn their space through enforcement decisions. Keep the trigger/transaction comparison at the boundary in heading 8, not a second concurrency course. |
| a11 Normalisation and deliberate redundancy | Retain the destination. Consider cutting headings 2.2/3.1 under O2. Keep safe reconstruction, independent associations and the derived-copy maintenance contract; they change practical design. |
| a12 Modelling history and data lifecycles | Retain headings 1–6. Agreement snapshots, recorded changes and effective versions answer different questions. Heading 4.2's second time dimension is justified only by its stated correction/report-reproduction requirement; it must not become the default design. |
| a13 Getting SQL values right | Retain headings 1–9, with O3. Expression semantics differ from storage choices. Keep headings 7–8 tied to one reporting boundary and calendar/elapsed distinction; no calendar specialist destination. |
| a14 Joining and summarising data | Retain headings 1–7. Multiplicity, preserved rows, counts and independent totals are central correctness skills. Heading 6's subtotals stay conditional; no grouping-extension survey. |
| a15 Composing larger SQL queries | Retain headings 1–5 and 7. Keep heading 6 explicitly optional, as planned: one terminating traversal with cycle and duplicate policy earns its bounded inclusion but not another article. |
| a16 Calculating across related rows | Retain headings 1–8. Latest-per-entity, ties, denominators, frames and predecessor meaning justify a distinct window-calculation task. Two shared datasets and no function catalogue are appropriate limits. |
| a17 Changing data with SQL | Retain headings 1–7. Target sets, ambiguous sources, conflict outcomes and postconditions justify more than basic DML. The consolidated upsert/MERGE heading is preferable to separate command destinations. |
| a18 Designing changes that coordinate with locks | Retain headings 1–7. A stable coordination identity, fresh decision after waiting and an all-writers argument provide a complete practical protocol. The optional skip-locked contrast must stay short; queues belong in a23. |
| a19 Reading and testing isolation guarantees | Retain headings 1–7. This interprets the engine guarantee rather than constructs a lock protocol. The InnoDB comparison earns space only where a changed observation changes the decision. Real-time ordering stays a compact limitation, not a distributed ordering branch. |
| a20 Managing connections and transaction lifetimes | Retain headings 1–7. Safe reuse, cancellation, pooling state, streams and shutdown are one coherent resource-ownership task. Keep service capacity and operation-outcome decisions in their owners. |
| a21 Controlling the queries your application performs | Retain headings 1–7. Hidden loading, collection multiplication, object retention and implicit flushes are application-generated work, not physical plan tuning. Heading 6 applies the parent's authority rules rather than deriving them again. |
| a22 Recovering database requests safely | Retain headings 1–6. Deadline, outcome evidence and durable operation identity must stay together. Splitting retries from idempotency would make the ordinary unknown-outcome task harder. |
| a23 Connecting transactions to background work and events | Retain headings 1–4 and 7; bound alternatives in 5–6 under O5. Worker ownership and external duplicate outcomes are sufficiently distinct from synchronous request recovery. |
| a24 How stored rows become physical work | Retain headings 1–7. Pages, locality, wide/retained rows and cleanup explain physical work; they are not a second index-design lesson. Local pruning is one justified layout intervention, not an invitation to a partitioning subcourse. |
| a25 Choosing indexes for a workload | Retain headings 1–7. Traversal, composite order, coverage, eligibility and write obligations form one decision. Heading 5.2's single alternative-family contrast is enough; no access-method catalogue. |
| a26 Following a query through its execution plan | Consolidate with a27 or complete the ordinary diagnosis here under R1. Preserve safe collection, physical work and reporting units; compress optional node/reporting variants. |
| a27 Explaining and correcting plan choices | Consolidate under R1. Statistics, skew and prepared-parameter behaviour remain necessary understanding; they do not all need a second mandatory destination for the same query. |
| a28 Improving performance under concurrent load | Retain headings 1–5 as the single deep owner under R2. The stable-population and arrival-schedule cautions earn space because they prevent false capacity conclusions; avoid a general queueing theory branch. |
| a29 Changing schemas without breaking applications | Retain headings 1–8. Locks behind waiting DDL, runner boundaries, staged constraints, failed index builds and representation replacement justify this depth. Keep one operation table and two linked procedures instead of a DDL catalogue. |
| a30 Running reliable data changes | Retain headings 1–8. Enumeration completeness, stale-write protection, durable progress and reconciliation are a distinct long-running change task. Imports/corrections remain short adaptations, as planned. |
| a31 Moving databases with a controlled cutover | Retain headings 1–7. Snapshot/change boundary and exclusive write authority earn a destination. A complete write-pause path prevents unnecessary online-migration complexity; reuse it from upgrades and adoption exits. |
| a32 Checking an embedded choice with SQLite | Conditional retain or fold under O1. Its engine-specific file, writer, enforcement, durability and backup checks are relevant; repeated generic acceptance machinery is not an additional skill. |
| a34 Checking a distributed choice with CockroachDB | Retain conditionally. Headings 2/2.1, 4–6 earn their space only against a named distributed requirement. Fold general requirements, compatibility method and decision-record instruction into references/application under R3/O4. |
| a35 Securing a relational service | Retain headings 1–8. Reachability, effective authority, copy/key protection, rotation and revocation are concrete operating tasks. The negative-test exercise matters; compromise response remains a database-specific application of a07. |
| a36 Monitoring and sizing a relational service | Retain a shorter destination under R2. Deployment telemetry, space/growth budget, degraded headroom and actionable alerts are its unique contribution. Remove the second full workload diagnosis. |
| a37 Maintaining and upgrading a relational service | Retain headings 1–7. Mechanism-driven upkeep plus a controlled engine-version transition is useful relational operations. Reuse cutover and restore procedures instead of another full movement/recovery walkthrough. |
| a38 Operating replicas and partitioned data | Retain headings 1–4 and 6–7. Promotion, exclusion, reconnection and rejoin are one complete operating task. Keep distributed ownership conditional and compressed under O4; do not equate local partitioning with distribution. |
| a39 Backing up and restoring relational data | Retain headings 1–7. Copy consistency, recoverable history, independent dependencies, timed restoration and selective versus whole recovery form an essential procedure. Keep this the sole shared restore owner. |

## Consolidation balance

My preferred minimum repair removes one destination by combining a26/a27, trims repeated methods without deleting operational capability, and makes conditional depth explicit. O1 can remove one more destination if the SQLite-specific case remains readable in the chooser. I would not obtain further numerical reductions by folding request recovery into connection management, constraints into transactions, failover into backups, or all live changes into generic operations. Each such merger discards a useful problem boundary and gives the practitioner a longer search for the next safe action.

No additional leaf articles are needed to repair the findings. Keep the work at planning stage; this review does not authorise prose writing, public navigation changes or publication.
