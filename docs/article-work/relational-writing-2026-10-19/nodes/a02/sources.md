# a02 — source and execution record

Checked 19 October 2026. Article: **Working with SQL**. This is a draft for the orchestrator’s independent review, not a publication decision.

## Teaching references and scope

Read the three complete fixed reference sources: `src/reference-articles/sequences.astro`, `indexes.astro` and `storage.astro`, including all figure call sites, instructions and surrounding explanations. Read each rendered figure’s content, captions, model boundaries and controls on the reference preview server at `http://127.0.0.1:4337/review/examples/`; inspected rendered drawings visually as well. Read the complete actual a14 draft and the parent, sibling and all child section plans supplied in context.

The draft follows the references’ concrete evolving example, prediction before controls, explanation after controls, source/observation distinction and limited contextual depth. This parent introduces the first complete useful report and the small WITH prerequisite for a14; a14 owns detailed cardinality, outer-filter, count/completeness and independent-customer-total repairs.

This fixture deliberately links each payment to an order. The child a14 links payments to customers and reports activity totals rather than settlement. Both distinctions are explicit where the child is linked. No shared schema or misleading interchangeable example is implied.

## Primary sources

All sources below were opened with the web tool. No secondary technical source was used.

| Claim or decision | PostgreSQL 18 source |
| --- | --- |
| Client commands, inspection, semicolons and null display | [psql](https://www.postgresql.org/docs/18/app-psql.html) |
| Disposable database creation/removal | [createdb](https://www.postgresql.org/docs/18/app-createdb.html), [dropdb](https://www.postgresql.org/docs/18/app-dropdb.html) |
| SELECT, duplicate policy, query clauses, ordering and fetch | [SELECT](https://www.postgresql.org/docs/18/sql-select.html) |
| Matching pairs, preserved unmatched rows, grouping and filtering | [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html) |
| SUM/COUNT and null or absent inputs | [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html) |
| Ordinary comparisons versus missing-value tests | [Comparison Functions and Operators](https://www.postgresql.org/docs/18/functions-comparison.html) |
| Three-valued compound conditions | [Logical Operators](https://www.postgresql.org/docs/18/functions-logical.html) |
| CASE and COALESCE | [Conditional Expressions](https://www.postgresql.org/docs/18/functions-conditional.html) |
| Integer division and numeric division | [Mathematical Functions and Operators](https://www.postgresql.org/docs/18/functions-math.html) |
| Instant representation, offsets, display zone | [Date/Time Types](https://www.postgresql.org/docs/18/datatype-datetime.html) |
| WITH names, statement scope, logical versus physical organisation, recursive optional follow-on | [WITH Queries](https://www.postgresql.org/docs/18/queries-with.html) |
| Correlated EXISTS only supplies presence | [Subquery Expressions](https://www.postgresql.org/docs/18/functions-subquery.html) |
| UNION/INTERSECT/EXCEPT and ALL policy | [Combining Queries](https://www.postgresql.org/docs/18/queries-union.html) |
| Window inputs, partitions, retained detail and ordering | [Window Functions](https://www.postgresql.org/docs/18/tutorial-window.html) |
| Final sort/ties/null placement | [Sorting Rows](https://www.postgresql.org/docs/18/queries-order.html) |
| Page subset, required order and skipped-row cost | [LIMIT and OFFSET](https://www.postgresql.org/docs/18/queries-limit.html) |
| Composite cursor comparison shorthand | [Row and Array Comparisons](https://www.postgresql.org/docs/18/functions-comparisons.html) |
| UPDATE preconditions and direct row count | [UPDATE](https://www.postgresql.org/docs/18/sql-update.html) |
| RETURNING inserted/updated/deleted rows | [Returning Data](https://www.postgresql.org/docs/18/dml-returning.html) |
| BEGIN, COMMIT, ROLLBACK and failed transaction state | [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html) |

No other engine was run. Dialect notes distinguish PostgreSQL-specific spellings and state only that support/defaults can differ; there is no unsupported cross-engine comparison table.

## Native execution

Runtime: `/opt/homebrew/Cellar/postgresql@18/18.6_1/bin`, native PostgreSQL **18.6 (Homebrew)** on aarch64 Apple Darwin. Used the already running shared verification cluster at `127.0.0.1:57319`, role `staycurrent`; did not start, stop, reconfigure or restart it.

Own databases: `rel3_a02_run1`, then expanded final verification in `rel3_a02_run2`. All connections closed. Databases remain disposable within the orchestrator-owned cluster for review. Session setting: UTC, set by the fixture; no server setting was altered.

Reproduce using a fresh numeric suffix:

```sh
node src/components/relational-next/a02/verify.mjs rel3_a02_run3
```

The script creates only its own `rel3_a02_runN` database, executes the source query exports, asserts outcomes, and writes `src/components/relational-next/a02/native-evidence.json`. It needs the local execution permission described by the shared runtime note because the restricted shell cannot make the loopback connection. Both runs passed; the final retained JSON is run2.

The final executable evidence includes:

- All displayed exported queries: setup, candidates, inner/left pairs, grouped totals, small WITH, full report, windows, both page requests and symmetric EXCEPT ALL comparison.
- Exact expected final rows: `(101,Mina,15,true)`, `(102,Mina,20,false)`, `(106,Edda,NULL,false)`, in promised order. No symmetric-difference rows.
- Actual output types: due numeric, has_payment boolean. Integer division 2 versus numeric division 2.5; equality-to-null returns null for both stored cases.
- Independent stage counts/values: six line totals, three payment totals, five candidate balances, known candidate line value 100 and receipts 65. Wrong direct detail join returns `(101,60,30)`.
- HAVING’s IDs; AND/OR precedence; DISTINCT multiplicity; ROW_NUMBER numbering; FETCH equivalence; row-comparison keyset equivalence.
- UPDATE one then zero, INSERT and DELETE returned rows, post-change inspection and restored post-rollback state. Separate missing-ID UPDATE 0 and customer UPDATE 3.
- Empty input, absent payments, duplicate detail values as additional legitimate line/payment identities, sub-second January boundary inclusion and February boundary exclusion.
- Every pagination figure variant (unchanged/insert/delete/move × offset/keyset) compared with actual SQL. Inner and left join figure rows compared with actual SQL.

These are single-session correctness observations, not concurrency, failure/durability, performance or production measurements.

## Render and targeted checks

- Astro compiler 2.13.1 transformed the staged fragment and its owned figure with no diagnostics.
- Root promoted the staged draft for local review. Inspected `/review/relational-next/sql/` in Chrome: both figures render; selected left join; Reset and Next produce the expected partial row set; insertion changes offset to 101/102 and keyset to 102/105; moved 102 changes keyset to 105/106. Both final-step Next buttons are disabled as intended.
- Inspected light and dark theme rendering. Dynamic span styling was repaired after browser inspection exposed that Astro-scoped selectors did not cover newly created nodes. Selected page chips are now visibly outlined after parameter changes.
- Playback is manual, discrete steps with narration, pause/back/next/reset controls. It does not animate spatial movement and has no autoplay. Completed server-rendered examples remain visible without JavaScript; controls are hidden until connected.
- Shared full build belongs to root after assembly; not run redundantly by this worker.

No tree change is proposed. Preserve the reserved `#checkable-stages` anchor.

## B01 repair evidence — latest state

The preceding render notes record the initial draft. The B01 teaching repair now supersedes the two-figure implementation. Reread the updated staycurrent-write skill and final B01 teaching/practitioner findings before editing. Scope and fixture are unchanged.

**New complete-report model.** `ReportFigure.astro` displays source line/receipt identities, independent named subtotals, the left-joined balance with deliberate defaults and EXISTS, and final filtering. Five candidate identities stay aligned; discarded rows are explicitly labelled comparison rows. Four input states show the baseline, another five-unit receipt for 101, a fifteen-unit settlement receipt for 101, and the first ten-unit line for 106. Narration and displayed SQL fragments update with the current stage and input. The baseline visibly produces 101: 30 − 15 = 15, 102: 20 − 0 = 20, and 106: NULL − 0 = NULL.

**Repaired pagination model.** Retains the saved first page and cursor, shows a boundary after 101, annotates original→current positions and uses persistent row elements. Offset’s skipped positions are explicit, as are the inserted 107, deleted first-page 100 and 102’s movement across the saved boundary. Keyset and offset keep the same eight previously executed outcomes.

**Native check.** Expanded `verify.mjs` executed successfully on native PostgreSQL 18.6 in fresh `rel3_a02_run21`. The retained `native-evidence.json` is now run21, not run2. It includes `reportModels`: every report input’s independent subtotals, balance, presence and final rows match the actual report SQL. The full earlier assertion set also passed. No shared server setting or other article database was touched. Sessions closed; run21 remains disposable. For a new run, choose an unused suffix such as run22.

**Controls.** All figures now use owned `player.ts`. Narration-aware holds use max(4200 ms, 1600 ms + 280 ms per word), with manual playback and sticky in-figure narration/transport. Endpoint focus moves to enabled Play/Replay before disabling the active endpoint. Actual Enter tests passed for both ends of inner join, left join, offset pagination, keyset pagination and report playback. Play/Pause also worked. No travelling/fading animation or autoplay.

**Browser check.** On the root-promoted preview, inspected the report’s source, subtotal, balance and final stages; changed receipts at the subtotal stage and observed 101’s subtotal 20 and due 10; settling 101 removed it; valuing 106 changed its NULL balance to 10. Rechecked all eight paging results and the visibly skipped positions and cursor movement. Inspected desktop and 390 × 844 phone layouts in the observed light/dark appearances; no page overflow (document scroll width 390, viewport 390). Narration, changing rows and controls can remain in view together. Restored the normal viewport. Browser error log contained no errors.

**Type clarification.** Added the short practitioner O1 distinction between pg_typeof checks of original types and EXCEPT ALL’s value/multiplicity comparison after compatible-type conversion. Opened [PostgreSQL 18 Type Resolution](https://www.postgresql.org/docs/18/typeconv-union-case.html) on 19 October 2026; it states that EXCEPT resolves types in the same manner as UNION. Native original-type assertions were already present and still pass.

Final Astro transforms: staged article, SqlFigure and ReportFigure all zero diagnostics. Shared build and independent mechanism recheck remain root’s responsibility. The staged article requires re-promotion only for its latest source-paragraph wording and primary type-resolution link.
