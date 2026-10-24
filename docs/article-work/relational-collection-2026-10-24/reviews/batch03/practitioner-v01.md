# Practitioner review · initial article batch · r04, r08, r10, r11, r12 · batch03-v01

Inputs read: [fixed manifest](v01/manifest.json); complete frozen article sources, their figures and downloadable fixtures/implementations; `context/commission.md`, `context/example.md`, all five briefs and relevant parent/sibling/child plans in `context/tree.yaml`; applicable raw native records, environment records, source manifests and verifiers in `mechanical/`; the five assigned current rendered pages, including each expanded final Sources section. Only the practitioner perspective was loaded. No peer reports, decisions, earlier versions, author teaching notes or quality verdicts were read.

This is fresh independent **initial coverage**, not repair confirmation, final complete reading or a publication decision.

Highest severity: **medium**. One finding in r11; no findings in r04, r08, r10 or r12.

## Checks

Each piece received all five checks independently, in the prescribed order.

| Piece | Check | Result | Note |
| --- | --- | --- | --- |
| r04 | Correctness | pass | Effective/recorded axes, range exclusion, transaction rollback, retained agreements, foreign-key actions and cancellation arithmetic agree with primary sources and the applicable experiment. |
| r04 | Evidence | pass | Application-maintained recorded labels are explicitly distinguished from commit timestamps. Six query answers and boundary/rollback failures match raw records; external erasure and refunds are not claimed as observed. |
| r04 | Coverage | pass | Gives decisions for immutable agreements, corrected history, gaps, soft deletion, active uniqueness/restore collisions, cancellation, dependencies and external copies. |
| r04 | Depth, both ways | pass | Enough temporal storage and write authority to make the distinction usable; a general temporal editing library, legal retention policy and recovery implementation are sensibly outside this article. No unnecessary full treatment found. |
| r04 | Ownership | pass | Answers what must be preserved and what deletion means locally, then hands partition retention, outbox delivery and restore procedures to their owners. |
| r08 | Correctness | pass | Conditional writes, affected rows, conflict actions, exact-price validation, version identity and guarded Read Committed publication are technically coherent. |
| r08 | Evidence | pass | Displayed reconciliation accounts for all four input rows. Replay, old contradictory payload, interrupted publication and forced overlap records match the current implementation. |
| r08 | Coverage | pass | Includes ABA, missing versus insufficient stock, duplicate multiplicity, older conflicting versions, source epochs, malformed input, absence, batch/chunk visibility and external follow-up. |
| r08 | Depth, both ways | pass | The seen-version ledger and batch receipt solve different necessary problems. The coarse guard is an explicit first design; higher-throughput locking, schema coexistence and ambiguous request outcomes are bounded hand-offs. |
| r08 | Ownership | pass | Owns conditional change and batch reconciliation without expanding into full request-identity, outbox or backfill protocols. |
| r10 | Correctness | pass | Key order, residual conditions, skip scan, bitmap ordering, index-only visibility, constraint indexes and HOT qualifications agree with PostgreSQL documentation. InnoDB comparison is correctly bounded. |
| r10 | Evidence | pass | Native buffers 984/62/13/4 and zero heap fetches match the exact worksheet and raw output. Drawn page locations and entry walks are explicitly illustrative. |
| r10 | Coverage | pass | Covers optional leading predicates, range/sort directions, broad matches, visibility loss, partial/prepared eligibility, expression matching, redundant indexes and maintenance costs. |
| r10 | Depth, both ways | pass | Explains the route from key to row and the saved work without a specialised access-method or live-DDL survey. No material missing understanding or unnecessary mechanism found. |
| r10 | Ownership | pass | Gives a useful index design answer; detailed plan diagnosis, non-B-tree methods and lifecycle under load remain with their stated owners. |
| r11 | Correctness | finding | The observations and mechanisms checked are sound, but the general estimate-diagnosis instruction needs the early-stop qualification in practitioner-1. |
| r11 | Evidence | pass | Counts, statistics estimates, forced plan modes and spill sizes match the current raw record. The join figures are not misrepresented as captured native plans. |
| r11 | Coverage | finding | The promised judgement about a bad cardinality estimate does not explicitly distinguish a node stopped early by its consumer; practitioner-1. Other requested diagnosis branches are covered. |
| r11 | Depth, both ways | finding | A short prerequisite to interpreting count discrepancies is missing; practitioner-1. Native examples otherwise earn their place as evidence for the general concepts. |
| r11 | Ownership | pass | Establishes operator/estimate reasoning and general causal comparison. Full native plan repair and incident waiting/queue diagnosis remain hand-offs rather than expanded operational recipes. |
| r12 | Correctness | pass | Range routing, expression/runtime pruning, composite identity, detach references, late writes and attach validation agree with PostgreSQL 18 and applicable native evidence. |
| r12 | Evidence | pass | Four-row fixture, key/refusal tests, parent/detached counts and generic-plan pruning match raw records. Independent cross-month test also confirms E3/E4 and two surviving partitions. |
| r12 | Coverage | pass | Addresses unprunable queries, global identity, retained children, holds, late arrivals, default partitions, provisioning, lock phases, object overhead and hot current ranges. |
| r12 | Depth, both ways | pass | Supplies the parent-level pruning/lifecycle decision without pretending to provide a production archive, erasure implementation or universal partition interval. No unnecessary full treatment found. |
| r12 | Ownership | pass | Owns table boundaries and retention consequences; live change, physical distribution and historical semantics remain with their respective owners. |

## Findings

### practitioner-1 · medium · r11, “Estimated work and measured work” and “Find the first wrong count”

Problem: The article tells the reader to compare estimated and actual rows at a node, then to find the first material disagreement from the leaves upwards as the origin of a bad count. It does not explain that the estimate normally describes output if the node runs to completion, whereas its actual count can reflect a consumer stopping it early. The earlier discussion correctly says that `LIMIT` stops requesting rows and may use only part of a child's work, but connects that to cost rather than to this cardinality diagnostic. The reader must supply the connection when following the later instruction. The relevant frozen locations are `r11.astro` lines 45–47 and 69–73.

Effect: A newcomer can diagnose a large, entirely expected difference under `LIMIT` as a statistics problem and investigate or alter an accurate plan. Early termination can also happen with a merge join, so this is part of interpreting the plan before choosing a repair, not an optional specialist optimisation.

Suggestion: Qualify the estimate/actual comparison before using it to locate an estimation error: first establish that the child was consumed to completion, and account for early stopping by its parent. A small `LIMIT` counterexample, or an explicit connection to the already-taught demand model, is enough; no wider plan chapter is needed.

Evidence: An independent disposable PostgreSQL 18.6 run with a freshly analysed 100,000-row relation reported `Seq Scan ... rows=100000` and `actual rows=1 loops=1` beneath `LIMIT 1`. Running the same scan to completion returned `actual rows=100000`, matching the estimate. See [own raw native output](practitioner-v01-native.txt) and [exact SQL, endpoint ownership and cleanup receipt](practitioner-v01-native.json). PostgreSQL's [Using EXPLAIN, caveats](https://www.postgresql.org/docs/18/using-explain.html#USING-EXPLAIN-CAVEATS) explicitly distinguishes such early-stop count differences from estimation errors and describes the related merge-join case.

## Evidence applicability and challenge

[Own verification receipt](practitioner-v01-receipts.json) records 120 permitted manifest entries with no hash mismatches, five current HTTP pages and all ten served downloads byte-for-byte equal to their frozen files. The canonical rendered file links returned HTTP 200. This checks transport bytes; it does not establish browser save completion.

The supplied evidence was reused only after reading the relevant raw records, environment, current fixture/implementation and verifier. Author pass labels were not treated as evidence:

- **r04:** `native-history.jsonl` and `run-history.py` use the current `history.json` labels and core rows, PostgreSQL 18.6/Psycopg 3.2.12, an owned socket and a verified data directory. The numerical matrix, half-open boundaries, overlap refusal, rollback, unchanged agreement, retirement-filter counterexample, once-only cancellation and independent-copy result are supported. I also challenged whether the example promises actual commit-time history, gap-free coverage, active-parent enforcement or an external refund; the prose explicitly limits those promises.
- **r08:** `native-imports.jsonl` and `run-imports.py` match the current feed and implementation. I traced every validation and publication branch, including all seen versions before winner selection, canonical duplicate multiplicity and persistent reads after the source guard. The raw log supports two waiting publishers and a final version 3; the argument also covers source resets, bypass writers and Repeatable Read. No throughput result is inferred.
- **r10:** `native-output.txt`, `native-environment.json` and `run-native.py` refer to the exact current deterministic 60,000-row worksheet. The displayed counts use hit plus read buffers, not written buffers added a second time. Broad scans, optional leading conditions, loss of visibility-map eligibility and the cost of included values are addressed rather than inferred from the successful covering case.
- **r11:** The exact current 100,000-row worksheet and raw output support sampled estimates 9/980, the forced custom/generic comparison and 9,344/13,229 kB sort observations. Its section labelled “Repeated inner lookup” actually chose a hash join in the raw run; the article appropriately makes no claim that a native nested loop was observed. The separate early-stop challenge is my own evidence and produces practitioner-1.
- **r12:** The exact current SQL/CSV and verifier support routing, literal October pruning, endpoint/wrapped-key scans, generic October runtime pruning, uniqueness failures, reference-blocked detach, late-write refusal and reattachment. Those are the four native query shapes in the supplied worksheet; the drawing also has a cross-month selection. I independently checked that latter case with the same explicit instants in my own disposable relation: only October/November were scanned and the answer was E3/E4. No archive, external erase, geographic placement or retention performance is established.

Current rendered use was independent: r04's two time selectors; r08's policy switch through its final stale/conflicting arrivals; r10's entry construction and all three complete key walks; r11's three complete join routes; r12's four complete pruning selections and detach/drop states. Each final Sources disclosure was opened outside the article body. The one background review tab was closed; viewport and theme were untouched.

## Primary sources checked

The following primary passages were checked directly, rather than relying on source-list or author-verdict records:

| Pieces | Sources and checked claim groups |
| --- | --- |
| r04 | Jensen/Snodgrass's [temporal database entries](https://www2.cs.arizona.edu/~rts/pubs/TRmerged.pdf), valid/transaction-time definitions; PostgreSQL 18 [Range Types](https://www.postgresql.org/docs/18/rangetypes.html), containment, half-open/unbounded periods and combined exclusions; [Date/Time Functions](https://www.postgresql.org/docs/18/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT), transaction-start timestamps; [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), reference actions. |
| r08 | PostgreSQL 18 [UPDATE](https://www.postgresql.org/docs/18/sql-update.html), counts and multiple source matches; [INSERT](https://www.postgresql.org/docs/18/sql-insert.html), conditional conflict action; [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), waiting/rechecking and snapshots; [COPY](https://www.postgresql.org/docs/18/sql-copy.html), connection/server path and CSV missing values; [Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html), scale rounding/special values; [MERGE](https://www.postgresql.org/docs/18/sql-merge.html), branch/concurrency distinction; Psycopg [Using COPY](https://www.psycopg.org/psycopg3/docs/basic/copy.html), client streaming/transaction behaviour. |
| r10 | PostgreSQL 18 [Multicolumn Indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html), bounds/residual checks/skip scan; [Indexes and ORDER BY](https://www.postgresql.org/docs/18/indexes-ordering.html), direction and early stopping; [Combining Multiple Indexes](https://www.postgresql.org/docs/18/indexes-bitmap-scans.html), bitmap page order; [Index-Only Scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html), visibility; [Partial Indexes](https://www.postgresql.org/docs/18/indexes-partial.html), implication; [HOT](https://www.postgresql.org/docs/18/storage-hot.html), update eligibility; [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), key versus referencing indexes; MySQL 8.4 [Clustered and Secondary Indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html), primary-key lookup route. |
| r11 | PostgreSQL 18 [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html), operators/counters/caveats; [Planner Statistics](https://www.postgresql.org/docs/18/planner-stats.html), sampling/correlation; [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html), custom/generic comparison; [Resource Consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-WORK-MEM), concurrent operation allowances/hash multiplier; CockroachDB [EXPLAIN ANALYZE](https://docs.cockroachlabs.com/docs/stable/explain-analyze), network/row/placement measurements. |
| r12 | PostgreSQL 18 [Table Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html), bounds, routing, key restrictions and runtime pruning; [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html), validation/default-partition checks, detach phases and remaining standalone table; [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), complete referenced identity. |

## Limits

All five fixed checks were completed for each piece. No claim of corpus-wide ownership coverage is made: neighbouring plans were context, and only these five complete pieces were reviewed.

The supplied native experiments were not all rerun. Their unchanged inputs, commands, environment and raw results were checked for applicability as above. My independent PostgreSQL run was limited to the early-stop counterexample/control and cross-month pruning; its endpoint was verified, TCP was disabled and its owned data directory was removed. Two initial sandbox-blocked initialisations were cleaned up before the authorised escalated run. No existing server, credentials, global configuration or dependency installation was used.

Browser saving was not exercised; exact served bytes were checked by bounded HTTP requests. This was a practitioner control/content inspection, not a replacement for the separate visual review: no responsive/theme/accessibility certification is claimed. Current Psycopg documentation has moved beyond the pinned driver; the pinned functional claims rely on the applicable 3.2.12 execution record. No native InnoDB, CockroachDB, external archive, deletion service, provider or backup-restore execution was performed or inferred. No build, source repair, delegation, commit, push or publication was performed.
