# b03 — adversarial editor, round 1

Reviewed the three assigned plans and contexts against the original relational-practice commission. No other review report was read. Findings concern planned scope and reading/navigation cost.

## a06 — Changing a live database

**Pass.** The three child splits earn their destinations: physical/schema operations, resumable data work, and transfer of write authority have different completion and recovery arguments. Folding them together would conceal important differences or create an excessively broad procedure article.

- Keep one complete, modest staged change in the parent. Its child introductions should expose the deeper problem without repeating the full compatibility/rehearsal/validation method three times. Children should start with their additional failure case.
- “Changing schemas without breaking applications” owns locks, rewrites and constraint/index deployment. Keep general application-version compatibility in the parent and reuse it in the child. Avoid turning representative column/type/table operations into separate syntax-based descendants.
- “Running reliable data changes” should use one backfill to develop checkpoints and concurrent-write ownership, then contrast imports and corrections only where their input, duplicate or recovery contracts differ. Three parallel procedural walkthroughs would repeat the same method. The useful loss from this consolidation is none; the distinctions remain explicit.
- “Moving databases with a controlled cutover” owns copying plus final change boundary and write authority. Operations owns steady replication, promotion and backup procedures. Reuse their evidence rather than teach a second replication/restore course. Cross-engine compatibility belongs here only for the actual move; do not grow migration guides for every engine pair.
- Retain lifecycle retirement in the parent. Data design owns the intended retention meaning; this branch owns changing and retiring the live representation; operations owns recovery copies and restore behaviour. No separate deletion curriculum is justified by this plan.

## a07 — Running a relational service

**Repair: fold “Recovering a relational incident” into the parent's closing incident section.** The proposed child lists seven failure classes but delegates their distinguishing diagnosis and recovery procedures to existing owners. Its remaining unique contribution is the common decision sequence: preserve options, classify impact, contain damage, select a prepared procedure, and validate before reopening traffic. That is necessary relational practice, but it can be taught once in the parent with a compact contrast between, for example, overload and accidental deletion, plus a failure-to-procedure table.

Keep explicit go/no-go criteria, evidence preservation, actual loss/interruption and application handoffs in that section. Link to monitoring/performance for saturation or blockage, security for compromise, topology for writer loss, and restoration for corruption or operator error. **Useful understanding lost by removing the separate child: none**, provided this decision method and worked contrast remain. The cut saves an additional navigation stop and avoids repeating the same operating checklist across seven incident stories. Do not replace it with seven separate incident articles.

The other five children are justified:

- **Security:** retain the operational boundary and negative access tests. Application authorisation/injection stays with integration; general security architecture does not require another branch.
- **Monitoring and sizing:** retain service objectives, actionable signals and operational headroom together. Use performance's resource/workload explanations; do not repeat its benchmarking or query diagnosis course.
- **Maintenance and upgrades:** retain as one controlled-change article. Link storage mechanisms to performance and database moves to a06; avoid a second live-change curriculum or one article per upkeep mechanism.
- **Replicas and partitioned data:** retain, but keep distribution requirement-driven. Local partition pruning belongs to performance, while this child owns write placement, read freshness and failure/recovery obligations. Routing/resharding/consensus should not grow into independent specialisms merely because partitioning appears in the brief.
- **Backups and restoration:** retain. Recovering correct data is distinct from replacing a failed writer. Its tested restore procedure should be the single owner used by incidents, migrations and adoption checks.

The parent should leave a reader with a service responsibility/failure map and a safe next action, rather than require all five children before it becomes useful.

## a08 — Choosing a relational database

**Pass.** The three adoption children can serve the original goal because embedded, server and distributed arrangements have materially different process/failure boundaries. They must remain conditional verification paths, not a required three-product course.

- **SQLite:** retain its file ownership, writer coordination, connection settings and backup/deployment checks. These are concrete adoption differences, not a reason to open a SQLite internals branch. Link common query, schema and transaction teaching.
- **PostgreSQL:** retain only a candidate acceptance path and the implementation facts that change it. The common branches already promise selected-engine SQL, concurrency, integration, tuning and recovery evidence. Reuse that evidence to produce a starting configuration and explicit acceptance gaps; do not reproduce those lessons beneath a PostgreSQL heading. If the common worked engine is PostgreSQL, this child should become especially compact.
- **CockroachDB:** retain placement, coordination latency, compatibility and failure checks that decide whether the distributed requirement is met. Minimal topology and measured acceptance cases are sufficient. Do not let every mechanism named in the brief become a separate CockroachDB article; common correctness, retries, migration and operating methods retain their existing owners.

The parent's comparison should eliminate unsuitable process/deployment arrangements before asking readers to enter these follow-ups. They need not read all three to make a defensible choice. Other engines should enter only through an unmet requirement, not to complete a vendor roster. No further adoption branches are justified by this batch.

Across a08, a07 and a06, reuse one deployment responsibility table and the common restore/cutover evidence. Selection asks whether the contract is acceptable; operations demonstrates how to fulfil it; evolution demonstrates how to change it. Repeating the full procedures in all three would add reading without another capability.
