# Relational introduction — independent technical polish review

Reviewed 4 October 2026. Technical reviewer received the article, revised brief,
evidence record, and source components. No other review was read. This was a
source and primary-documentation review, not a rendered-page or engine execution
test. No page files were changed.

Revision: Git `189ff3059cfe136634103e9c0b48a87bb2f54c23`, with article SHA-256
`27532fb4074df4c3033b598e68fe5a34dab02e2fa304419f5ea0620098d12af9`.
The table component hash was
`17611d917ea02f9aee46cf4091529b9cd75cc1f58dd687c7618fdcb4d1a673d0`;
the relationship sketch component hash was
`4214341eccc63fc8bdfdd42a69bb630f8e4101baf19fd9cd4f565d599d7e7d45`.

The baseline has no material technical defect requiring repair. It meets the
commission's technical scope: the reader gets the purpose of tables, relationships,
queries, indexes, constraints, transactions, and concurrency control without being
asked to learn a particular engine's internals. The engine boundaries are generally
careful. The following are optional improvements to precision or explanation.

| ID | Location | Finding and reader consequence | Evidence | Severity and suggested disposition |
| --- | --- | --- | --- | --- |
| PT1 | Article line 79, “defined view” | The phrase is correct but leaves a novice with little picture of what multiple versions buy. | PostgreSQL 18 MVCC introduction and isolation §13.2.1. | Optional explanation improvement. Describe a query reading a snapshot while writes continue. If making the timing concrete, scope it to PostgreSQL's ordinary Read Committed query, whose view is taken at statement start. Do not imply every transaction keeps one unchanged snapshot. |
| PT2 | Line 23, adding weight | “Adding a new kind of information” sounds broader than the actual claim about a column. Later nested-data support is compatible, but a new JSON property need not alter the table definition. | PostgreSQL 18 Table Basics and JSON Types. | Optional precision. Say “Adding a weight column changes the table's definition.” This also sharpens the row/column contrast without adding a caveat. |
| PT3 | Lines 37 and 44, historical values and joined product name | The article correctly distinguishes price paid from current price, but a reader could overlook that the name returned by the join is also the name stored now. | The displayed P7 record and PostgreSQL join semantics; this consequence is our inference from the model. | Optional, if it fits the prose. Add “current” to the joined product name or mention that a historical receipt name would need its own stored fact. Do not expand this into another modelling section. |

## Claims checked

- **Schema, keys, and physical layout:** [Table Basics](https://www.postgresql.org/docs/18/ddl-basics.html) supports named columns, variable rows, and typed values. The article presents primary keys as a declared design choice. It does not claim every SQL table automatically gets one. [InnoDB's layout](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html) confirms that primary keys can influence storage; the article only says an ID is not a disk position, so it does not contradict this.
- **Joins and indexes:** The answer “Blue mug, 2” follows from the actual illustration labels. [Joins Between Tables](https://www.postgresql.org/docs/18/tutorial-join.html) supports matching records to produce a combined result. The [index introduction](https://www.postgresql.org/docs/18/indexes-intro.html) supports lookup, maintenance costs, and the planner sometimes preferring a scan. No exact speed or physical lookup count is claimed.
- **Constraints:** [PostgreSQL's constraints chapter](https://www.postgresql.org/docs/18/ddl-constraints.html) supports the separation between required values and foreign keys. The article does not falsely promise that a child reference forces every parent to have a child. SQLite's [foreign-key setting](https://www.sqlite.org/foreignkeys.html#fk_enable) and [primary-key exceptions](https://www.sqlite.org/lang_createtable.html#the_primary_key) support the note. It is appropriately short for this introduction.
- **Atomicity and durability:** [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html) supports the grouped purchase changes and rollback. The claim is scoped to those changes, avoiding a promise to reverse sequences or external effects. [WAL](https://www.postgresql.org/docs/18/wal-intro.html) supports recovery; [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html) confirms why settings matter. The article does not promise that acknowledged commits survive every storage loss.
- **Locks:** [Row locking](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS) and [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED) support the stated wait-and-read-updated-row outcome. Both buyers take the protecting lock before deciding. The engine/default qualification matters: a stronger isolation mode may reject a transaction rather than return that row. The article correctly avoids claiming that ordinary readers all wait behind the row lock.
- **Versions, conflicts, and retries:** The [MVCC introduction](https://www.postgresql.org/docs/18/mvcc-intro.html) supports overlapping reads and writes. The isolation chapter supports why a snapshot alone does not guarantee safe competing business decisions. The warning about an uncertain result after connection loss is sound; [libpq connection status](https://www.postgresql.org/docs/18/libpq-status.html) also exposes unknown transaction status on a bad connection. This is an uncertainty warning, not an assertion that all lost connections committed.
- **Fit and deployment:** [SQLite's serverless explanation](https://www.sqlite.org/serverless.html) supports in-process deployment. [JSON Types](https://www.postgresql.org/docs/18/datatype-json.html) and [text search](https://www.postgresql.org/docs/18/textsearch-intro.html) support overlapping capabilities. The article makes a conditional fit argument rather than claiming relational systems uniquely provide these features or establishing a performance ranking.

All linked sources above were opened during this review on 4 October 2026.
PostgreSQL sources are pinned to version 18 and MySQL to 8.4; SQLite sources are
unversioned. Recheck the SQLite defaults and the PostgreSQL default-isolation
example if their engine/version scope changes. No broader review cadence is needed
for these stable introductory claims.

No runnable SQL or interactive model is present in this page. The illustrative
join was checked against component data, not executed. Builds, mobile rendering,
themes, keyboard behaviour, and the destinations of local reading links remain
the coordinator's checks. This technical pass does not independently establish
the assembled draft's editorial acceptance or authorise publication.

## Recheck of the expanded prose and SQL example

The coordinator requested a focused recheck later on 4 October 2026. Article hash:
`ac6b426382f3d391f2850a6c5285ac885ca8127049136ca67e14794739f74104`.
New `RelationalJoinExample.astro` hash:
`9028a7d3e3bf23aedfb1da0605237af4646e77855278d3b46db3fab6b22d0a71`.
This supersedes the earlier statement that the page has no SQL example.

| ID | Location | Finding and reader consequence | Evidence | Disposition |
| --- | --- | --- | --- | --- |
| PT4 | Concurrent access, “each query gets a view from when that query began” | The new statement is broader than the PostgreSQL guarantee. A locking read can wait and return a newer row, exactly as the preceding purchase example teaches. A reader could infer contradictory rules for those two queries. | PostgreSQL 18, Read Committed §13.2.1 distinguishes ordinary `SELECT` from `SELECT FOR UPDATE/SHARE`. | Narrow repair required: scope this to an ordinary read without a locking clause, and describe committed data at query start. No isolation survey is needed. Sent to the coordinator; repair not yet checked. |

The other requested checks pass:

- **Sorted index search:** [Index Types §11.2.1](https://www.postgresql.org/docs/18/indexes-types.html) establishes B-tree equality/range lookup; [Indexes and ORDER BY](https://www.postgresql.org/docs/18/indexes-ordering.html) establishes ordered entries. “A common kind” correctly avoids claiming that all indexes use sorting. Equal customer keys group together in the index without requiring corresponding table rows to be adjacent. The prose makes no comparison-count or speed promise.
- **Persistent log:** [PostgreSQL WAL](https://www.postgresql.org/docs/18/wal-intro.html) and [InnoDB redo logs](https://dev.mysql.com/doc/refman/8.4/en/innodb-redo-log.html) support this as a common recovery mechanism. “Commonly” leaves room for other designs. The retained engine/settings/storage qualification avoids an unconditional guarantee, and the backup sentence concerns loss of stored data rather than an ordinary recoverable crash.
- **Query-level views:** [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED) supports different views for successive ordinary reads in a transaction. The old-price example and the distinction between reading stock and reserving it are correct. Apply PT4 to keep this consistent with the locking example.
- **Exact SQL and result:** The query joins `order_lines` to `products` on their qualified `product_id` columns, filters `order_lines.order_id = 'O12'`, and projects `products.name` plus `order_lines.quantity`. With the stated P7/Blue mug product and sole O12/P7/2 order line, it returns one row, `Blue mug | 2`. The shown names, quantity, projection order, and column headings agree. The prose correctly attributes each result field to its table and does not imply that the query changes those tables. [The PostgreSQL join tutorial](https://www.postgresql.org/docs/18/tutorial-join.html) supports the syntax and meaning. A single-row result has no unresolved result-order issue.

These sources were opened again for the recheck. SQL review was semantic and
source-based; the coordinator will execute it in SQLite and record that separately.
No PostgreSQL execution was claimed. Identify that execution environment in the
example's validation record; the syntax here is also valid PostgreSQL SQL. The new
index and locking illustrations were not part of this focused technical assignment.

PT4 repair checked in the saved page: “For an ordinary read without a row lock,
PostgreSQL’s default mode uses a view of data committed before the query began.”
This resolves the scope problem and remains consistent with the prior locking
example. No material technical finding remains from this focused recheck.
Article SHA-256 for this repair check:
`de0f596823e4d8b9f0d5f639aac4992a3cb1be013fe7dfd72e6bce33eb02719b`.

## Final technical check of index and locking illustrations

Checked the saved components and connected prose on 4 October 2026. This is a
technical meaning check from the source; it does not substitute for the separate
rendered and independent first-reading checks.

- `RelationalIndexLookup.astro`:
  `0e70b8e299117b085ef379bb608a174de7cc4b3149f7ca84551549079e81cb36`.
- `RelationalLockTimeline.astro`:
  `830253453c7dedcb82d295fff3e17cc94ef934bc3a068e4082187adaa2ab3314`.
- Connected article:
  `b8beb9cd1b03d6da73ad70da2af8495262f3e56d29bc2a1b43951bb25c67a59f`.

**Index illustration: pass.** C4 occurs in two index entries, pointing to O12 and
O14; those orders belong to C4 and contain totals of €36 and €60. The totals are
absent from this index, so the depicted follow-up lookup has a purpose. The caption
explicitly distinguishes the order IDs used as labels from engine-specific record
locators. This avoids implying that PostgreSQL secondary indexes universally store
primary-key IDs, or that every indexed query must visit the table. The caption also
states that the figure does not model the work of searching the index. The connected
prose scopes sorted entries to a common index kind. The technical basis remains
[PostgreSQL index types](https://www.postgresql.org/docs/18/indexes-types.html),
[ordered entries](https://www.postgresql.org/docs/18/indexes-ordering.html), and
[InnoDB's different locator arrangement](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html).
No exact performance claim or universal physical layout is implied.

**Locking timeline: pass.** It begins with both transactions targeting the same row
and one item available. Buyer 1 obtains the protecting lock before its stock check;
Buyer 2 waits until Buyer 1 commits the stock change and releases the lock. Buyer 2
then obtains the lock and checks zero stock. The caption explicitly scopes this
sequence to PostgreSQL's default Read Committed behaviour and says that spacing is
not measured duration. It does not claim all reads wait, or that merely beginning a
transaction reserves stock. The visible sequence and the alternative ordered list
agree. [PostgreSQL row locking](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS)
and [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED)
support the sequence. No engine execution is claimed. The timeline itself contains
no SQL; the page's SQL example is the separately reviewed join.

The corrected ordinary-read qualification remains in the connected prose. No
material misleading implication was found in these final components or their
connected explanations, and no repair is requested by this technical check.
