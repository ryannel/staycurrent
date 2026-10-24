# Practitioner review · article batch · r03/r05/r06/r07/r09/r13 · batch02-v01

Inputs read: [frozen manifest](v01/manifest.json), all six assigned complete source articles and their figures/downloads/verifiers in `v01/source/`; [commission](v01/context/commission.md), [briefs](v01/context/briefs.json), [example](v01/context/example.md), and relevant parent/sibling/child ownership in [tree](v01/context/tree.yaml); applicable `v01/mechanical/` records; the six assigned rendered pages on immutable port 4384. Review skill and practitioner perspective read. No earlier versions, author notes, other reviews, decisions or history read. This is independent first coverage; no editing or delegation.

Highest severity: **critical**. Findings: one critical in r13 and one medium in r09. Numbers restart per article as assigned.

## Verification and evidence applicability

The [independent receipts](practitioner-v01-receipts.json) verify all 139 frozen manifest hashes without a mismatch. All seven current download URLs returned 200 and bytes identical to the frozen downloads. The static responses had no `Content-Disposition`; this establishes reachable exact bytes and MIME types, not browser save behaviour. The current no-trailing-slash URLs were checked directly.

I read the supplied native runners/SQL, fixture construction and assertions before reusing observations. The PostgreSQL 18.6 observations below support their stated small functional examples, not a universal algorithm, performance result or production protocol. The original disposable clusters and Python package environments were deliberately unavailable, so this review did not re-run those supplied experiments or independently reinstall their packages. Version/command/output records were retained and assessed. No quality verdict was reused.

The r03 and r13 model verifiers were newly run against the frozen source: eight tenant states and the snapshot/skew outcomes passed. These are model consistency checks, not native SQL observations. I also made a new owned PostgreSQL 18.6 reproduction of r13's snapshot-start boundary; its [raw commands, identities, SQLSTATEs, outputs and cleanup](practitioner-v01-snapshot.json) are retained. It used a new private-socket cluster, removed inherited `PG*` settings, verified the data directory and role on both connections, then stopped the server and removed the directory. No existing database or shared configuration was used.

Fresh rendered interaction covered the tenant alternative and final refusal, detail/totals and ON/WHERE choices, group/window results, default/ROWS/whole-partition frames with both tied rows, cancelled/moved pagination and both export views, the application success/refusal/cancellation/lost-session endings and failed-transaction step, and both snapshot and instructor isolation outcomes. The temporary browser tab was closed. I made no viewport or theme changes.

## r03 · Constraints and tenant boundaries

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Row/null, composite identities, references, actions, deferral and concurrency checked against primary PostgreSQL sources. |
| 2. Evidence | pass | Frozen worksheet/native hashes apply; reference figure is explicitly a model, not check order. |
| 3. Coverage | pass | Covers wrong-shop existing parents, required composite components, parent changes, authority and limits of checks/triggers. |
| 4. Depth, both ways | pass | Optional deferral detail earns its place; no missing practical decision within the brief found. |
| 5. Ownership | pass | Gives schema decisions and useful protocol/access boundaries, leaving full locks and authorisation to their owners. |

Evidence and challenge: [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [Index Uniqueness Checks](https://www.postgresql.org/docs/18/index-unique-checks.html) and the [SET CONSTRAINTS command linked by the article](https://www.postgresql.org/docs/18/sql-set-constraints.html) support the important distinctions. In particular, tenant references reuse the same required shop column, so a P7 in another shop cannot satisfy the requested order reference. Default composite-reference null escape is stated accurately. The row check is not presented as proof that every sale reduced stock or that a multi-row count is safe.

The [native summary](v01/mechanical/r03/native-summary.txt) names exact source hashes, version, commands, private instance identity, `Lock:transactionid`, a duplicate error, one protected row and two unchecked copies. [Worksheet output](v01/mechanical/r03/worksheet-output.txt) applies to the current downloaded SQL. The concurrent test uses scratch key-only relations; it substantiates uniqueness under overlap, not a complete order insertion or tenant-authorisation protocol. The article makes that boundary clear. The primary-key rollback alternative is a documented conditional claim, not incorrectly labelled as a second observed schedule.

### Findings

None.

## r05 · Joins and the meaning of a result row

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Matching pairs, multiplication, outer predicate placement, absence and missing totals are sound. |
| 2. Evidence | pass | Exact frozen SQL/core data match the native output; figures model result construction. |
| 3. Coverage | pass | Separates zero/one/many matches, equal-valued distinct facts, partial payment and missing line totals. |
| 4. Depth, both ways | pass | Enough reusable grain/predicate judgement without expanding into a SQL syntax catalogue. |
| 5. Ownership | pass | Aggregation and CTE explanations support the report; physical execution and full windows remain elsewhere. |

Evidence and challenge: [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html), [Subquery Expressions](https://www.postgresql.org/docs/18/functions-subquery.html), [WITH Queries](https://www.postgresql.org/docs/18/queries-with.html) and [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html) support the consequential semantics. I checked the grain at each step: the two independent many sides produce four pairs; each subtotal is one row per order before combination; missing payments become zero while a missing established order value remains missing. The text's non-card-only counterexample correctly defeats a later `OR payment_id IS NULL` repair. `NOT EXISTS` remains a different question from positive due.

The [source manifest](v01/mechanical/r05/source-manifest.json), [owned runner](v01/mechanical/r05/run-owned.py), frozen [SQL experiment](v01/source/src/components/relational-collection/r05/downloads/joins-experiment.sql) and [native output](v01/mechanical/r05/native-output.txt) agree on the core inputs, 79.00/79.00 incorrect sums, corrected report and optional/absence results. The runner clears inherited connection settings and checks its own instance. The old mechanical metadata hash differs from the renamed frozen metadata record, but the SQL/article/core/figure hashes relevant to the observed results match; the changed metadata is not relied on as execution evidence.

### Findings

None. Omitting a full UNION/views tutorial is not a brief-outcome defect: the article's reusable result reasoning and worked report are complete, and more syntax alone would not establish missing practitioner understanding here.

## r06 · Aggregates, windows and ordered results

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Counts, input/group filtering, partitions, peers, frames and rank/position choices are sound. |
| 2. Evidence | pass | Frozen SQL/data/figures apply to the supplied native outputs; later headers add no sales amounts. |
| 3. Coverage | pass | Handles unmatched-parent count, averaging denominator, post-window filtering, tied positions and LAST_VALUE. |
| 4. Depth, both ways | pass | Explicit frame and tie-breaker effects are useful; no extra frame catalogue is needed. |
| 5. Ownership | pass | Keeps calculation semantics here and passes continuation and physical sort costs to their owners. |

Evidence and challenge: [Window Functions](https://www.postgresql.org/docs/18/functions-window.html), [Window Function Calls](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS), [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html) and [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html) support the calculation rules. The argument does not treat an order-level window total as another sale. It explicitly distinguishes ROWS from the separate determinism supplied by the ID. Ranking by time intentionally retains peers; appending IDs would change that answer.

The [source manifest](v01/mechanical/r06/source-manifest.json), [owned runner](v01/mechanical/r06/run-owned.py), frozen [SQL](v01/source/src/components/relational-collection/r06/downloads/windows-experiment.sql) and [native output](v01/mechanical/r06/native-output.txt) agree on grouped totals, 68.50 repeated beside Mina's orders, default counts 1/2/3/5/5, explicit counts 1/2/3/4/5 and latest-order selection. The later headers are inserted only after the core amount examples. As for r05, the relevant execution hashes apply although its earlier metadata hash is not the frozen filename's hash. The frame controls' current 105/106 counts match the SQL, not merely a static caption.

### Findings

None.

## r07 · Pagination and consistent exports

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Tuple continuation and separate query/cursor/transaction views are correctly distinguished. |
| 2. Evidence | pass | The exact small fixture and 20,000-row scratch plan support only the stated local results. |
| 3. Coverage | pass | Covers look-ahead boundary, precision, nulls, filters, moving keys, late commits, lost connections and retained versions. |
| 4. Depth, both ways | pass | Enough to select a live-list or exact-export contract without a distributed-snapshot digression. |
| 5. Ownership | pass | Delivers the local contract; detailed budgets, access paths and distributed snapshots remain with their owners. |

Evidence and challenge: [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [DECLARE](https://www.postgresql.org/docs/18/sql-declare.html), and the [row comparison reference](https://www.postgresql.org/docs/18/functions-comparisons.html#ROW-WISE-COMPARISON) support the key and view distinction. A plain cursor's continued query view is correctly separated from the stronger shared view required by an independent count. Saving fields rather than only membership is the right materialisation boundary. The text does not promise that an upper key, immutable ordering or ID deduplication recovers a starting set.

The [source manifest](v01/mechanical/r07/source-manifest.json), frozen [runner](v01/source/src/components/relational-collection/r07/downloads/run-pagination.py) and [native output](v01/mechanical/r07/native-output.txt) agree. The runner verifies all three private sessions, clears inherited connection settings, sets UTC and resets the five headers between histories. Its plan case uses a separate indexed integer table, VACUUM ANALYZE and direct scan assertions. Thus 10,002 versus two produced scan rows applies to that fixture; the article correctly does not turn it into a timing or universal scan-cost claim. Earlier metadata hash differences do not affect these observations. Native cursor tests include both subsequent fetches and the separate count, rather than assuming that a token and a cursor are interchangeable.

### Findings

None.

## r09 · SQL at the application boundary

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Binding, identifier selection, result cardinality, transaction contexts and settled cancellation are coherent. |
| 2. Evidence | pass with limits | Native records apply to selected driver mechanisms; they are not execution of the undefined complete purchase helper. |
| 3. Coverage | finding | The repeat procedure omits a platform/path prerequisite; practitioner-1. |
| 4. Depth, both ways | pass | The driver-specific example teaches reusable ownership decisions; no pool-sizing or ORM framework survey is needed. |
| 5. Ownership | pass | Explains what the caller must settle and delegates uncertain-commit resolution and capacity policy appropriately. |

Evidence and challenge: Psycopg's [Passing parameters](https://www.psycopg.org/psycopg3/docs/basic/params.html), [SQL composition](https://www.psycopg.org/psycopg3/docs/api/sql.html), [Transaction management](https://www.psycopg.org/psycopg3/docs/basic/transactions.html), [Connection pools](https://www.psycopg.org/psycopg3/docs/advanced/pool.html), [type adaptation](https://www.psycopg.org/psycopg3/docs/basic/adapt.html) and [cancel_safe](https://www.psycopg.org/psycopg3/docs/api/connections.html#psycopg.Connection.cancel_safe), plus PostgreSQL's [statement_timeout](https://www.postgresql.org/docs/18/runtime-config-client.html#GUC-STATEMENT-TIMEOUT), support the mechanisms. Current Psycopg documentation identifies itself as a later development version; pinned 3.2.12/3.3.3 native output independently supports the actual API use shown. I did not infer compatibility with every driver/version/proxy from that output.

The [source hashes](v01/mechanical/r09/source-hashes.json), frozen [runner](v01/source/src/components/relational-collection/r09/downloads/run-boundary.py), frozen [shop data](v01/source/src/components/relational-collection/r09/downloads/shop.json) and [native JSONL](v01/mechanical/r09/native-boundary.jsonl) match. Its fixture uses products after order 103. The refusal check deliberately raises after reducing P3, showing exception-driven rollback; the no-row conditional update is checked separately. It does not claim a complete checkout implementation or an HTTP cancellation integration. Explicit cancellation waits for the sleeping query and cleanup before reuse. Closed pooled connection replacement is observed; general broken-network detection/commit resolution is not.

An evidence limit: the runner's cleared `env` dictionary is passed to subprocesses, but its in-process Psycopg connections still inherit the Python process's ambient libpq environment for parameters not explicitly supplied. Endpoint/user/database are explicit, and the admin data-directory check and result assertions support the recorded local observations. The record does not establish that all driver-side inherited options were cleared; I do not reuse it for that stronger environment claim. The article itself makes no such claim.

### Findings

### practitioner-1 · medium · r09, “Repeat the driver checks” and run-boundary.py:18

Problem: The repeat instructions give Python packages and `--bindir` as the setup, but the downloadable runner unconditionally creates its cluster under `/private/tmp`. That directory is specific to the author's macOS setup and need not exist on a Linux machine with the stated Python/PostgreSQL prerequisites. There is no temporary-base argument, and setting TMPDIR does not override the explicit `dir`.

Effect: A reader following the stated procedure on such a system stops with `FileNotFoundError` before any database check, and must inspect/change the experiment or create a system directory. The experiment's actual platform requirement is unstated.

Suggestion: Use a suitable configurable temporary location and a short socket path, or state the supported platform and provide the necessary alternative invocation/setup. Keep ownership and cleanup guarantees.

Evidence: Frozen [runner, line 18](v01/source/src/components/relational-collection/r09/downloads/run-boundary.py) calls `tempfile.mkdtemp(..., dir='/private/tmp')`; [Python's tempfile documentation](https://docs.python.org/3/library/tempfile.html#tempfile.mkdtemp) defines an explicit directory as the target rather than choosing the platform default. The Linux failure is a source-based consequence when that parent is absent; no Linux execution is claimed. The successful macOS native run remains applicable to its recorded environment.

## r13 · Transactions and isolation

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | finding | Snapshot-start rule is overbroad for SET/LOCK/SHOW; practitioner-1. Worked purchase and skew logic otherwise holds. |
| 2. Evidence | pass | Supplied exact schedules support their stated outcomes; the new probe exposes a case they did not test. |
| 3. Coverage | pass | Requires returned-row checks, all-product rollback, fresh decisions on retry and participation by every writer. |
| 4. Depth, both ways | pass | Gives useful single-/multi-row choices and their failure modes without re-teaching complete lock or retry machinery. |
| 5. Ownership | pass | Provides a Serializable multi-row answer and correctly routes complete guard/empty-set protocols to RL91. |

Evidence and challenge: [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [Serialization Failure Handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) and [SET TRANSACTION](https://www.postgresql.org/docs/18/sql-set-transaction.html) support the principal promises. The application must actually decide to stop or retry; Serializable cannot repair an unconditional incorrect operation. The Read Committed row recheck does not refresh other read facts. The instructor cycle has no valid serial explanation under the stated count-and-decide rule, while the fresh retry does.

The [source hashes](v01/mechanical/r13/source-hashes.json), frozen [runner](v01/source/src/components/relational-collection/r13/downloads/run-isolation.py), [full native transcript](v01/mechanical/r13/native-transcript.json) and [summary](v01/mechanical/r13/native-summary.json) agree on version, owned instance and the displayed fixtures. The conditional native test uses `stock > 0` rather than the displayed `stock >= 1`; these are equivalent for the declared non-null integer stock. It resets to empty order tables and pre-103 stock, so historical 101/102 do not create extra deductions. Snapshot tests change P7 separately, and the two instructor rows are a distinct history. The observed victim and failure point are explicitly only one schedule. The full purchase helper includes the P3 deduction and both order lines, so the protected result is not inferred solely from a stock value.

### Findings

### practitioner-1 · critical · r13, “What a snapshot keeps”, source line 72

Problem: “established by its first query or other non-transaction-control statement” overgeneralises the event that fixes a Repeatable Read snapshot. `SET LOCAL`, `LOCK` and `SHOW` are non-transaction-control statements that intentionally do not establish one. The useful contrast with BEGIN is correct, but the added category is false.

Effect: A reader can place the report's fixed view at a transaction's configuration or explicit-lock step and reason that intervening commits are excluded. In fact, a later first snapshot-taking query may include them. This matters to the article's promise of choosing a snapshot/protocol, even though its displayed first-SELECT schedules remain correct. Proposed critical follows the skill's rule for a false technical sentence; the affected scope is this generalisation, not the worked outcomes.

Suggestion: Describe the first operation that actually needs/acquires the transaction snapshot; a first ordinary query or data-modifying statement is a useful normal case. Avoid implying that every other statement fixes it. Preserve the distinction between BEGIN, snapshot acquisition and later waiting.

Evidence: New owned PostgreSQL 18.6 test: reader executes `BEGIN ISOLATION LEVEL REPEATABLE READ; SET LOCAL application_name = 'practitioner-marker';`; another connection changes stock 1→2 and commits; reader's first SELECT returns **2**. Control: reader's first SELECT returns 1 before that commit, and its later SELECT still returns **1**. The [raw receipt](practitioner-v01-snapshot.json) retains exact commands, connection ownership checks, statements and cleanup. PostgreSQL's [SET TRANSACTION documentation](https://www.postgresql.org/docs/18/sql-set-transaction.html) describes the first query/data-modification boundary. More decisively, [PostgreSQL 18 `PlannedStmtRequiresSnapshot`](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/tcop/pquery.c#L1620) explicitly exempts transaction control, LOCK, SET and SHOW so they do not freeze a transaction snapshot. This is a fresh source/native challenge, not an inference from the article's supplied successful schedules.

## Limits

This review covers all five practitioner checks on each assigned complete frozen article. It is not the collection's required final complete check, a visual/design verdict or a review of unassigned drafts. Source/hash/HTTP verification and applicable native observations establish only their stated scope. No attachment header or browser save behaviour is inferred from download bytes. No full production checkout, network failure, HTTP cancellation, pool-sizing, distributed snapshot, throughput or latency result is claimed. The portability finding is source-based; no Linux or Windows run was performed. Original package environments remained unavailable as assigned. The new snapshot reproduction used the installed PostgreSQL 18.6 binaries only and left no running cluster.
