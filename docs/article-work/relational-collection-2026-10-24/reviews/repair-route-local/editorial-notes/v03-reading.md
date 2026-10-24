# Editorial reading notes · v03

Fixed manifest SHA-256: `cf981fca0a63e3e6fc27709282996febc1e95ad2baf9a93e59b0dd79412c4d63`. Preview root: `http://127.0.0.1:4566/`. These are direct editorial observations of the current finished rendering, not mechanical receipts or execution evidence.

## Complete current pieces

Read each body from opening through its final handoff, including every code block, table, caption and Sources text:

- r20 — `review/relational-collection/replicas-and-read-routing/`; all five progress states in the complete text alternative. Fourth: “Replay remains at 0, so fresh queries still lack order 103.” The flush-contract qualification is retained.
- r37 — `review/relational-collection/postgresql/backup-and-restore/`; whole-article reading, including base/WAL commands, recovery settings, recorded target excerpt, reconciliation table and Sources. There is no displayed recovery sequence to replace the current table.
- r40 — `review/relational-collection/postgresql/schema-changes/`; complete lock-dependency alternative, both figures, all code/tables and Sources. The complete intended-scope query is the bridge from the observed empty batch to validation.
- r46 — `review/relational-collection/cockroachdb/follower-reads/`; isolation schedule, SQL examples, snapshot-model controls/labels/caption and Sources. Native range model starts the follower-safety section before its operational uses.
- r47 — `review/relational-collection/cockroachdb/query-performance/`; all three access-path renderings and their explanatory text, numeric work table, SQL and Sources. Returned control to Customer only.
- r48 — `review/relational-collection/cockroachdb/locality/`; all six policy/operation comparison renderings, complete code, observed-placement explanation and Sources. Returned controls to REGIONAL BY TABLE / Current point read.
- r49 — `review/relational-collection/cockroachdb/operations/`; security policy/table, health/removal instructions, all five drawing states in “Drawing as text”, complete capability limits and Sources. The local-check account is now direct reader-facing prose.
- r50 — `review/relational-collection/cockroachdb/backup-and-restore/`; whole-article reading, including complete backup/inspection/restore SQL, acceptance table and Sources. The recorded-timestamp placeholder is explicitly labelled; it is not presented as executable literal evidence.

Collapsed full alternatives and Sources were read from the built page's DOM text; no source implementation or script data was read. Navigation repetitions were excluded from prose assessment.

## Focused rendered reference calibration

- `review/examples/storage/`: opening; complete **Write-ahead log** development (including the log, writer and group-commit figures and text alternatives); complete **Crash recovery** development (including the three-moment recovery figure/alternative, unfinished transactions, recovery time and limits); complete **Where the numbers come from**. Used to calibrate native mechanism development, qualifiers, observed/model distinction and a linked next lesson.
- `review/examples/indexes/`: opening; complete **Sequential scan** and **Index entries and row locations** through the heap explanation; complete **Covering indexes and index-only scans** and its comparison figure/table; complete **Write cost and upkeep** development, including its page-split/deletion examples and **Building, finding and dropping indexes**. Used to calibrate stable-result comparisons, local mechanism detail, captions and the proportionate handoff to a deeper owner.
- `review/examples/sequences/`: opening; complete **Lifelines and messages**, **Replies and activation bars** and **Synchronous and asynchronous messages**, with their figures/captions; the **Background workers and the transactional outbox** development through the lease, outbox and polling explanations and its transition to failures. Used to calibrate prerequisite order and how a new constraint belongs with the interaction it changes. No reference controls were changed.

These were the actual fixed rendered references served by the supplied preview, not summaries or substitute articles. No all-reference reload was needed for this informed local assignment.

## Reading judgement

The two recovery articles have a useful native spine after the omissions. They do not ask the reader to rebuild a missing chain of reasoning: the introductory S503 state supplies the invariant; native backup and target details supply the procedure; short closure observations and state tables supply the local result. Their final limits qualify the evidence at the point the reader might otherwise overgeneralise it. The range-model additions serve the same purpose locally in r46/r47/r48 and do not interrupt their arguments. No new substantive editorial finding arose.
