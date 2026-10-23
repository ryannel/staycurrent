# Practitioner review · article · complete relational introduction · v1

Inputs read: [assignment](../assignments/first-practitioner.txt), [frozen manifest](../frozen-v1.json), [audience](../review-audience.md), [complete outcomes and parent/child scope context](../reader-outcomes.json), [shared example facts](../example-facts.md), [published child metadata](../child-reading.json), the complete `src/articles/relational-full-reference/introduction.astro`, all five owned supporting files, the shared stepper, [native evidence](../native-check.json) and [mechanical receipt](../mechanical-receipt-v1.md). Read repository instructions, README, site direction, the review skill and only its practitioner perspective. Read the current rendered preview at <http://127.0.0.1:4360/review/relational-full-reference/> and personally advanced all five states of both race protocols. No previous draft, review, decision, handoff or author notes consulted.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | The consequential SQL, concurrency, durability, application, replication, recovery and product-choice claims checked against primary sources support the stated parent-level conclusions. Sources and boundaries are recorded below. |
| 2. Evidence | pass | Current query/data/verifier/figure hashes match the frozen manifest. The native evidence applies to the displayed query and stock protocols; the article explicitly distinguishes these observations from illustrative histories and unmeasured operational behaviour. |
| 3. Coverage | pass | All nine intended outcomes receive useful answers, including unsuccessful partial reservation, transaction abort versus missing reply, duplicate external effects, stale following reads, fencing, and later valid purchases lost by an earlier restore target. |
| 4. Depth, both ways | pass | The introduction supplies enough mechanism to explain its decisions without requiring a child article to complete the main argument. No missing understanding or unnecessary specialist treatment warrants a finding. |
| 5. Ownership | pass | The parent answers what the database promises and what to investigate or choose next. Full SQL construction, multi-row concurrency protocols, plan diagnosis, operational procedures and distributed mechanisms remain with the named children. |

## Findings

No findings.

The stock example earns its practical conclusion: a non-negative count and a transaction boundary do not prevent two accepted orders following stale reads. The conditional protocol combines the condition and subtraction, explains the waiting update's recheck, requires the application to inspect the returned row, and rolls back the whole purchase when tea cannot be taken. The text limits that reasoning to one existing product row before directing multi-row rules to the transaction children. It therefore avoids presenting the SQL statement as a universal invariant mechanism.

The later application and recovery sections preserve the distinctions needed to use those guarantees. A successful local commit, a success reply, a delivered email, a caught-up replica and recovery after storage loss are different promises. The system-choice section offers explicit first candidates and evidence that could overturn them, includes analytical work, and does not infer distributed necessity from table size alone.

### Primary-source checks

Checked on 23 October 2026:

- Keys, constraints, join multiplicity and outer-join absence: PostgreSQL 18 [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) and [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html). The four history rows, arithmetic and two-lines-by-two-payments multiplication also agree with the supplied fixture and native result.
- Atomicity, Read Committed statement snapshots, own writes, updater waiting and condition re-evaluation: PostgreSQL 18 [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), and [UPDATE](https://www.postgresql.org/docs/18/sql-update.html). These support the precise unsafe/protected histories shown.
- Access paths, planning, actual execution, page size and memory spills: PostgreSQL 18 [Introduction to Indexes](https://www.postgresql.org/docs/18/indexes-intro.html), [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html), [Database Page Layout](https://www.postgresql.org/docs/18/storage-page-layout.html), and [Resource Consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html). The article correctly warns that analysing a modifying statement executes its changes.
- Local WAL durability and relaxed acknowledgement: PostgreSQL 18 [Write-Ahead Logging](https://www.postgresql.org/docs/18/wal-intro.html) and [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html). Figure 3 is a labelled conceptual history in which page writes follow the reply; the prose says they *can* reach their files later and does not require that timing for every execution.
- Replica receipt, durable flush and replay; stale reads; failure authority; earlier recovery targets: PostgreSQL 18 [Log-Shipping Standby Servers](https://www.postgresql.org/docs/18/warm-standby.html), [Failover](https://www.postgresql.org/docs/18/warm-standby-failover.html), and [Continuous Archiving and Point-in-Time Recovery](https://www.postgresql.org/docs/18/continuous-archiving.html). These support the article's separation of freshness, storage survival, fencing and restore. Also consulted [Message Flow](https://www.postgresql.org/docs/18/protocol-flow.html) for the client/server boundary.
- Stable caller identity and changed request parameters: Amazon Builders' Library [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/). Durable intent with remaining duplicate-delivery risk: AWS [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html). Workload recovery objectives: AWS [Define recovery objectives for downtime and data loss](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_planning_for_recovery_objective_defined_recovery.html).
- Embedded operation and the single-writer boundary: SQLite [Serverless](https://www.sqlite.org/serverless.html), [Appropriate Uses](https://www.sqlite.org/whentouse.html), and [Isolation](https://www.sqlite.org/isolation.html). Embedded analytical and columnar operation: DuckDB [Why DuckDB](https://duckdb.org/why_duckdb) and [FAQ](https://duckdb.org/faq). Cross-partition atomic coordination and replicated copies: CockroachDB [Transaction Layer](https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer) and [Replication Layer](https://docs.cockroachlabs.com/docs/stable/architecture/replication-layer).

### Native evidence applicability

Read `verify.mjs` in full before reusing the receipt. It creates a fresh owned data directory and socket, starts PostgreSQL with explicit durability settings, checks its server identity, and uses separate sessions. The unsafe test makes both reads before either literal stock write. The protected test observes Tariq waiting on a lock before Mina commits, then asserts his empty returned result, the final stocks and order 103 alone. The separate tea-failure test verifies that rollback returns the already-taken mug and leaves no order.

The recorded environment is PostgreSQL 18.6 (Homebrew, aarch64 macOS), Read Committed, `fsync=on`, `synchronous_commit=on`; the owned verifier uses port 56823. I compared SHA-256 values for the article, every owned supporting file, the shared stepper, and both supplied evidence files with `frozen-v1.json`: all matched. I did not execute that verifier or connect to its former server. No independent native reproduction was needed to resolve a doubtful outcome.

## Limits

- This is the assigned complete practitioner review, not a visual, editorial or corpus review. Child metadata and scope briefs supplied ownership context; finished child prose was deliberately not read or judged.
- Native SQL/concurrency observations are reused evidence whose implementation and applicability I inspected, not observations I independently reran. There is no independent crash, network-loss, replication, failover, restore, capacity or latency experiment in this review. The article does not claim such measured results.
- The browser check used a separate background in-app-browser tab and verified the race's visible state text through all ten states and the protocol switch. I did not alter Chrome, viewport or theme settings. I did not repeat the visual reviewer's responsive, contrast or full playback/accessibility work.
- No site build was run. No article, component, skill or shared file was changed; this named report is the only written output. This review does not authorise publication.
