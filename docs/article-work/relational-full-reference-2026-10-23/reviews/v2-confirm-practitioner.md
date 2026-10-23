# Practitioner review · informed repair confirmation · complete introduction · v2

Inputs read: [assignment](../assignments/confirm-practitioner-v2.txt), [confirmation scope](../confirmation-scope-v2.md), [frozen v2 manifest](../frozen-v2.json), [audience](../review-audience.md), [outcomes and child scopes](../reader-outcomes.json), [example facts](../example-facts.md), [child reading](../child-reading.json), [mechanical receipt](../mechanical-receipt-v2.md), [native evidence](../native-check.json), [applicability record](../evidence/native-applicability-v2.json) and [display comparison](../evidence/repair-v2-data-check.json). Read AGENTS.md, the review skill and practitioner perspective; README.md and site-direction.md supplied repository scope. Read the complete current introduction and all six files in `src/components/relational-full-reference/`, including the native verifier. Inspected the frozen article HTML's figure text and structure. No earlier draft, other reviewer report or author quality note was read.

Version: frozen v2, r07, article at `http://127.0.0.1:4362/review/relational-full-reference/`, freeze time 2026-10-23 17:41:37 UTC. All source and evidence hashes in the manifest matched current files; both frozen review-page HTML hashes matched their recorded values.

Highest severity: none.

This is focused, informed confirmation of changed technical meaning and affected dependencies. It is not the later complete independent practitioner challenge.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass in scope | Table/identifier meaning, post-purchase stock, the explicit rewind, history result, transaction/race dependencies and new application duties agree with the fixture and primary sources below. |
| Evidence | pass in scope | The new display is derived data; the figures remain labelled illustrations. Reused PostgreSQL results cover the unchanged query and protocols, with fresh applicability and data checks described below. |
| Coverage | pass in scope | The repairs give a concrete row/column reading and identifier path, establish the example moment, and explain caller identity, record permission, supplied values and coexistence during schema change. No new substantive omission found in these repairs or dependencies. |
| Depth, both ways | pass in scope | The introduction gives enough cause and consequence to understand these duties; it does not need driver syntax or a full migration procedure here. |
| Ownership | pass in scope | Modelling, SQL row meaning, transaction protocols, application SQL, retry/outbox work and schema-change detail retain useful parent explanations and named deeper owners in the supplied child scopes/reading. |

## Accepted problems and pass conditions

### D1 · first table and relationships · confirmed

The opening now establishes rows and columns using one visible product table before asking the reader to follow relationships. Figure 1 has P7/Blue mug/0 on one row and stock 10/0/4 down one column. Figure 2 follows named identifiers through Mina's customer row, orders 101/103, the two lines of 103 and P7's product row. The selected rows do not imply that they are the full tables.

The surrounding explanation correctly distinguishes customer identifier 1 from line number 1, gives `(order_id, line_no)` as the line identity, permits Mina's several orders and Edda's zero orders, and separates the current offer from the line's agreed price. The subsequent history join uses precisely those identifiers and the agreed price. These meanings agree with PostgreSQL's [table concepts](https://www.postgresql.org/docs/18/tutorial-concepts.html), [primary/foreign key constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) and [join explanation](https://www.postgresql.org/docs/18/tutorial-join.html). The concrete customer reference is non-null in the supplied schema; this confirmation does not treat the introductory example as an exhaustive account of nullable or self-referential foreign keys.

### D2 · one coherent example moment · confirmed

Figures 1 and 2 explicitly show the accepted, unpaid order 103. Its P7 × 1 and P3 × 2 lines subtract from the pre-103 fixture to give P3 10, P7 0, P9 4. `pending` describes payment state here, not an unfinished database transaction: Figure 2 says that the order is recorded and stock has been taken, while the later query discussion says there is no payment.

Before Figure 3 the text explicitly rewinds to no order 103 or lines, mug stock 1 and tea stock 12. Both five-state histories start from that moment. The unsafe history permits both orders despite non-negative stock; the conditional history commits 103 alone after Tariq waits and obtains no updated row. The prose requires both the tea and mug changes to succeed in the same transaction, with rollback restoring any earlier stock change on failure. PostgreSQL's [transaction tutorial](https://www.postgresql.org/docs/18/tutorial-transactions.html), [Read Committed behaviour](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED) and [UPDATE/RETURNING definition](https://www.postgresql.org/docs/18/sql-update.html) support these outcomes.

Rechecked downstream uses of 103 through the query result, commit figure, missing reply, outbox, replica lag, recovery/reconciliation and workload-choice discussion. They preserve the same accepted purchase; the unsafe race is a labelled counterexample rather than a second canonical shop state. Figure 4's abbreviated mug/order example is consistent with the surrounding complete transaction. The durability and replica dependencies agree with [WAL ordering](https://www.postgresql.org/docs/18/wal-intro.html), [commit settings](https://www.postgresql.org/docs/18/runtime-config-wal.html) and [standby receipt/durability/replay distinctions](https://www.postgresql.org/docs/18/warm-standby.html).

### D3 · causal application explanation · confirmed

Replacing customer number 1 with 2 in this query selects Tariq's order, so correct SQL alone does not establish the caller's right to see it. The new paragraph requires both establishing who is asking and checking which orders they may read. It then explains a different boundary: parameter values travel separately from the statement text and cannot become that statement's SQL syntax. This is supported by PostgreSQL's [PQexecParams contract](https://www.postgresql.org/docs/18/libpq-exec.html#LIBPQ-PQEXECPARAMS) and OWASP's [request permission and user-controlled identifier guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html). The paragraph does not suggest that binding a customer number supplies permission.

The route to application SQL now names parameter binding and the connection used without presupposing a pool-borrowing procedure. The next sentence explains why schema change must accommodate old and new application versions together. Amazon's first-hand [deployment compatibility account](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/) supports this coexistence requirement. The supplied schema-change child scope owns its working procedure.

The preceding missing-reply, whole-decision retry and outbox explanations remain compatible with those duties. Checked the surrounding claims against PostgreSQL's [whole-transaction retry guidance](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html), Amazon's [stable request identity and changed-parameter account](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) and AWS's [transactional outbox discussion](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html). The durable intent is distinct from actual external delivery, and the same identity remains necessary across uncertain attempts. Later replica routing and system choice do not transfer these application duties to the database engine.

### D4 · race caption evidence language · confirmed

The caption now says both outcomes were reproduced in PostgreSQL 18 while explicitly calling the figure a stepped illustration that runs no database in the page. This accurately distinguishes the teaching history from the applicable observed query/concurrency evidence. It claims no timing measurement.

### D5 · labels and numbering · confirmed for technical/structural dependencies

Current source and frozen HTML contain Figures 1–4, corresponding article references and no headings inside figures. The changed paragraph labels preserve the buyer and protocol identities. Figure 3's control group names Figure 3. No changed label alters the technical meaning. Contrast, appearance and live control usability belong to the assigned visual confirmation and were not judged here.

## Evidence applicability and fresh verification

The allowed applicability record reports all eight original data exports unchanged and identifies the same verifier and native-evidence hashes. I independently checked those files against the frozen manifest, read the verifier's imported SQL/data and owned-instance setup, and inspected its complete query, unsafe-race, observed-wait, conditional-result and rollback assertions. Its recorded PostgreSQL 18.6 session used Read Committed with `fsync` and `synchronous_commit` on, a unique data directory/socket and verified server identity. The changed opening display does not alter any of those executed statements or protocols.

A fresh read-only `node --input-type=module` assertion imported current `data.mjs`, derived all three `productsAfter103` counts and the exact four displayed history rows, and compared them directly with `native-check.json`. Both comparisons passed. Order 103 remains `pending`; both protocol models still have five states. A separate read-only HTML parse found four figures and no headings within them, and exposed the current stock, price and identifier text as described above.

The native history query and protected stock outcome were recorded by separate stages of the verifier; the query does not read stock, and both stages use the same order/line facts. Their reuse together therefore supports this post-purchase display without suggesting one continuously captured engine trace. No changed native behaviour required reproduction, so no database was started or contacted and disposable port 56826 was unused. No fresh native observation is claimed.

## Findings

None in the assigned repair-confirmation scope. Finding number practitioner-1 remains available.

## Limits

All article sections were read to trace the affected example and application dependencies, but this was not a fresh complete technical challenge of every unchanged claim or product comparison. Child routes were assessed through the supplied scopes/reading metadata, not reread as complete articles. No child article, plan, article source, component, build, commit or publication state was changed.

No browser interaction, viewport or theme change was performed while the visual reviewer held the lease. Frozen HTML/source checks and permitted unchanged-mechanics evidence do not replace that reviewer's current rendering and control checks. No database rerun, crash/network/replica experiment, performance measurement or recovery-time measurement was performed. Primary sources were checked on 23 October 2026. Only this report was written.
