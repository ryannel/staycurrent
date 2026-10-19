# Practitioner review: root breakdown

Reviewed `root/breakdown.yaml` against `commission.md`, independently of the existing relational corpus and previous plans. Scope: the root's headings and its immediate child briefs; descendant headings are to be planned separately.

## Verdict

The proposal provides a strong practical spine: schema meaning, statement correctness, concurrent invariants, physical work, application boundaries, operations, distribution and system evaluation all have clear owners. The order reservation gives the root a useful continuous example. The mechanisms are generally tied to decisions, and the operations/recovery and application-boundary coverage is substantially stronger than a query-centred introduction.

Repair the three omissions below in the immediate child briefs before recursive expansion. They do not require additional top-level articles. In particular, make the workload envelope explicit so that the order example does not silently define relational expertise as transactional application work alone.

## Findings

### 1. Make analytical and mixed workloads an explicit part of the workload envelope

**Locations:** “Understand the work behind a statement”; `Understanding and improving database work`; `Choosing a relational system`.

The root and all worked examples currently point towards small transactional requests. The execution brief names rows, versions, indexes and buffer behaviour, but does not explicitly require the contrasting storage and execution decisions that large scans, aggregations and mixed transactional/reporting workloads expose. “Physical storage”, “specialist capabilities” and “workload-aware capacity” leave this important scope to implication.

An engineer choosing a relational system needs to recognise when a report over a large fraction of the data is the intended work, when a row-oriented access path is the wrong comparison, and when reports and transactional requests need separate resource or data boundaries. This is a system-choice and architecture judgement, not simply a slower-query case.

**Repair:** Add a small reporting/analytical workload beside the order reservation in the root's performance or evaluation section. Explicitly require the execution child to compare row and column layouts, scan-oriented execution, parallel work, and memory/spill behaviour where these change workload fitness. Require the choice child to evaluate transactional, analytical and mixed workloads, including freshness and resource-isolation trade-offs. Expand any needed depth within those children; a separate analytics collection is unnecessary here.

**Completion test:** A descendant planner should be unable to produce a complete execution/choice branch that teaches only indexed transactional access and transactional server selection.

### 2. Give bulk data movement and reconciliation a named owner

**Locations:** `Working with SQL`; `Building applications with a relational database`; `Operating and recovering a relational service`.

The application brief explicitly covers schema migrations and backfills, and operations covers backup recovery. Neither clearly owns ordinary ingestion, bulk loading, exports, or verifying that a moved dataset is complete and correctly interpreted. These are recurring application-building and operational tasks even when no schema change or disaster is involved.

The practical judgement differs from issuing individual DML statements: choosing a staging and validation boundary; preserving identity, types and relationships; deciding transaction size and restart behaviour; handling rejected records and concurrent changes; and reconciling source and target before a cutover or destructive clean-up. An import that finishes without an error is not by itself a useful completion criterion.

**Repair:** Assign the application child ownership of ingestion and bulk movement protocols, including staging, validation, restartability and reconciliation. Let the SQL child own the semantics and limits of bulk/import/export facilities in its reference dialect, and let execution own their resource and maintenance effects. Keep backup/restore procedures with operations. This can be a short explicit addition to the existing briefs, not a new root branch.

**Completion test:** The eventual tree should offer a clear path for an engineer importing a large existing dataset and proving that the application can safely switch to it.

### 3. Cover database-resident behaviour explicitly enough to make placement decisions

**Locations:** `Designing relational data`; `Working with SQL`; `Building applications with a relational database`; `Operating and recovering a relational service`.

The proposal clearly separates declarative constraints from transaction protocols, but leaves views, triggers and database routines without an explicit owner. “Extension and ecosystem needs” in the choice brief is too distant to ensure that readers learn how database-resident behaviour changes ordinary application correctness, security and delivery.

A practitioner must be able to decide where a rule or reusable operation belongs, recognise writes and privilege boundaries hidden behind a statement, and account for those effects during migrations, bulk operations and debugging. This does not require a catalogue of procedural languages or a stored-procedure tutorial for every product.

**Repair:** Name views and database routines/triggers in the SQL or application brief. SQL should own their observable semantics; application engineering should own the choice to place behaviour in the database and its testing/deployment consequences. Modelling should distinguish declarative integrity from procedural enforcement, and operations should pick up the privilege implications where relevant.

**Completion test:** Descendant planning should give a newcomer a way to discover that a statement can invoke database-resident behaviour and a reasoned method for deciding whether to introduce it.

## Boundary checks

- Preserve the existing distinction between transaction-level retry correctness and request-level retries/idempotency. The transaction child should establish when an entire transaction must be retried; the application child should decide whether replaying the request is safe and coordinate external effects. The current ownership wording is adequate if retained during expansion.
- Execution/operations maintenance overlap is justified when execution explains why work is needed and what it costs, while operations owns scheduling, preconditions, verification and incident procedures. Do not create two generic “maintenance” articles with the same scope.
- Distribution should teach replication/failover guarantees and failure histories; operations should apply those guarantees in service-wide recovery runbooks. The current split is sound, but restore and failover exercises must retain an explicit owner when descendants are assembled.
- Root coverage should remain introductory. Its job is to make the questions and connections usable; deep mechanisms belong in the existing child branches. None of these findings justifies expanding the root into a prerequisite textbook.

## Repair recheck

**Result: pass at root/immediate-child planning scope.**

Re-read the repaired `root/breakdown.yaml`. All three findings are resolved: the root now contrasts a broad aggregate with an individual lookup; execution and choice explicitly cover analytical and mixed workloads and their consequential mechanisms; bulk facilities, movement/reconciliation and engine impacts have named owners; and database-resident behaviour has explicit semantics, integrity, placement/delivery and privilege coverage. The changes fit within the existing branches and do not require a new root article.

No unresolved practitioner finding at this scope. Descendant and whole-tree reviews must verify that these explicit obligations survive expansion and that the previously recorded ownership boundaries remain clear.

## Consolidation recheck

**Result: pass. No unresolved practitioner findings at root/immediate-child scope.**

Re-read the seven-child revision after system evaluation was folded into the root. The final section preserves the useful decision work: a worked deployment-shape shortlist, requirement-to-evidence matrix, documented/measured/assumed distinction, and tests assigned to the branches that own their mechanisms. It explicitly retains analytical and mixed workloads, recovery ownership, ecosystem and specialist needs, cost, portability and exit, and neighbouring-family fit. This is sufficient coverage for a root-owned synthesis; removing a separate evaluation child does not remove a required practitioner capability from the plan.

The three earlier repairs remain intact in the immediate child briefs: execution covers row/column and scan/parallel work across workload types; bulk movement and reconciliation have clear ownership; and database-resident behaviour retains semantic, integrity, delivery and privilege obligations. Early task entrances also make the root useful during an incident without requiring a full reread.

The final whole-tree review should verify that the synthesis can point to concrete evaluation evidence and test methods in the expanded branches. That is an expansion check, not an outstanding defect in this root breakdown.
