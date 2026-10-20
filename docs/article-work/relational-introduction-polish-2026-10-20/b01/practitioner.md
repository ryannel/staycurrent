# a00 practitioner review

**Decision: pass.** No actionable practitioner findings or required repairs.

Reviewed on 20 October 2026 against the original relational commission, the introduction brief, all eight direct-child plans and their actual destinations in `context.yaml`. Read the complete current `src/articles/relational-next/a00.astro`, all three figure components, the SQL fixture, models and verifier, and the original native source/execution record. Inspected and operated the frozen rendered introduction at `http://127.0.0.1:4438/review/relational-next/`.

## Useful first answer and scope

The introduction supplies a usable answer before its links: row meaning and identity; required references and checks; a checked join and grouped result; a complete single-counter reservation argument; connection and uncertain-outcome responsibilities; a diagnosis-and-comparison method; a compatible rollout; and the distinction between restoring service and restoring correct data. Detailed value modelling, multirow concurrency, retry machinery, physical access, migration procedures and restoration commands remain with the assigned children.

The final routes match the commissioned parent-first contract. First-application practice begins with the SQL setup, then design, SQL, transactions and integration. The performance parent precedes optional investigations, and SQLite and CockroachDB remain conditional adoption paths. PostgreSQL supplies the concrete behaviour without implying that shared SQL gives all engines the same guarantees.

## Figure and technical observations

| Location | Practitioner assessment |
| --- | --- |
| Figure 1 — `RowsFigure.astro`, `models.mjs`; article lines 50–56 | Correct row multiplicity, £36 aggregate, omitted empty order under the inner join, and retained NULL sum under the left join. `COUNT(*)` versus the non-null product count is correctly distinguished. Rendered grouped results agreed with the stated comparison. |
| Figure 2 — `OrderFigure.astro`, `orderState`; article lines 62–71 | Correctly separates intermediate committed states from one transaction's private writes and its final commit or rollback. The model explicitly has one buyer and a fresh read at every step. The separate two-buyer conditional-update explanation states PostgreSQL Read Committed, requires checking the returned row and rolling back the unsuccessful order, and does not generalise the one-counter argument to multirow invariants. Rendered separate-commit and rollback outcomes agreed. |
| Figure 3 — `DecisionFigure.astro` lines 4–10 and 62–71; article lines 78–81 | The two paths correctly preserve the distinction between stored outcome and client knowledge. The later independent inspection is labelled; a connection error alone is not offered as proof of rollback. Stable operation identity, uniqueness and retained results are introduced, with the important qualification that an empty lookup must account for an overlapping attempt. Rendered paths showed absent versus committed orders with the same missing confirmation. |
| Figure 4 — `DecisionFigure.astro` lines 12–18 and 72–81; article lines 84–90 | The scan and index routes return the same order while examining three versus one table pages in this invented layout. Index-page work is explicitly excluded from the drawing and acknowledged separately; the counts are neither timings nor a captured plan. The prose accounts for broad reads, index maintenance, measured plans and competing work. Both rendered comparisons agreed. |
| Figure 5 — `DecisionFigure.astro` lines 20–26 and 82–92; article lines 93–98 | Correctly exposes both existing missing values and incompatible writers. The immediate rule is shown as blocked rather than silently succeeding. Its old-writer explanation explicitly considers the hypothetical case where existing rows were filled. The staged path requires compatible writers, drained old work and verified honest values; the caption handles history for which a valid instruction cannot be established. Both rendered comparisons agreed. |
| Figure 6 — `DecisionFigure.astro` lines 28–34 and 93–103; article lines 102–107 | Correctly contrasts writer/storage loss with an applied mistaken deletion. Replica progress and independent usable recovery input are explicit assumptions. Promotion is conditional, restoration is separate, and reconciliation of valid later work is required. The model does not present replicas as backups or a running server as proof of recovered correctness. Both rendered comparisons agreed. |

Other consequential claims are appropriately qualified: the transaction example assumes ordinary logged tables; asynchronous commit is distinguished from normal local log flushing; a durable local commit does not survive loss of its only storage; parameter binding is distinguished from authorisation; `EXPLAIN ANALYZE` executes changes; and a successful backup job does not establish recovery objectives.

## Documentation and evidence boundary

Rechecked the relevant primary PostgreSQL 18 documentation:

- [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): Read Committed snapshots, own-write visibility, waiting and conditional rechecking.
- [Message flow](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-TERMINATION): open-transaction rollback on termination and the possibility of work completing before a disconnect is noticed. Figure 3 is a final-outcome comparison, not a disconnect-detection timing claim.
- [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html): existing-value validation, new-write enforcement and physical work when strengthening rules.
- [Database page layout](https://www.postgresql.org/docs/18/storage-page-layout.html), [index introduction](https://www.postgresql.org/docs/18/indexes-intro.html) and [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html): page-based storage, access paths and maintenance, estimates versus execution evidence.
- [Asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html) and [log-shipping standby servers](https://www.postgresql.org/docs/18/warm-standby.html): acknowledgement, log flush and replication progress have distinct failure boundaries.

The article clearly labels all six figures as illustrative and attributes native SQL, rollback and competing-update evidence to the earlier PostgreSQL 18.6 run. The retained fixture and verifier support that narrow description. No new native database execution, crash, connection-failure, failover, restore, payment or load test was performed or claimed in this review. The stopped runtime was not accessed.

No source edits, build or Git operations were performed. No other new reviewer report or writer rationale was consulted. The temporary preview tab was closed; I did not change theme or viewport settings.
