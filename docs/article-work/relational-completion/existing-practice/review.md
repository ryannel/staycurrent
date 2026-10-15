# Existing articles and SQL practice

Prepared 15 October 2026. Author self-check complete; independent review and the
collection’s rendered-page review remain with the coordinator. Publication status
has deliberately not been changed by this pass.

## The work

The existing eleven full articles explain substantial mechanisms, but only three
linked readers to executable browser lessons. The new work preserves their prose
and adds practice where readers have enough context to predict an outcome. The
introduction links to the existing query lesson. The checkout model links to the
existing checkout and rollback lessons and identifies the different sample IDs.
The local practice page now describes the broader browser coverage while retaining
its role for full scripts and separate database connections.

Eight new lessons in `src/lib/sql-lessons/foundations.ts` contain 39 runnable steps.
Each prepares separate `lesson_` tables, states its starting records, gives a reason
to predict a result, interprets that result, offers a variation, and explains how to
restore the starting state. The existing four lessons remain a separate coordinator
review responsibility.

| Article | Browser practice | What the reader can test |
| --- | --- | --- |
| Designing your data | `history`, existing `constraints` | A product’s current price and name can change while purchase-line prices stay fixed; identity does not preserve every historical field. |
| Constraints in depth | existing `constraints` | A valid write, rejected write, and the value left stored. |
| Tables and JSON | `json-rules` | Missing keys, JSON null, string versus number, a checked conversion, and a required typed capacity. |
| Querying your data | existing `queries`, `join-totals` | A line-by-delivery join multiplies rows; separate aggregates prevent multiplication and left joins preserve empty orders. |
| Pagination and large results | `pagination` | An insertion shifts offsets; a saved pair survives that shift but does not freeze a mutable ordering key. |
| Transactions and concurrency | existing `checkout`, `rollback` | The handler’s conditional progression, explicit transaction boundary and rollback branch. |
| Isolation and snapshots | `transaction-state` | Repeatable Read still sees its own writes; observing a changed value is different from committing it. |
| Handling conflicts and uncertain outcomes | `retry-identity` | Only a new operation claim reserves stock; a duplicate reads and verifies the original purchase. |
| Indexes | `index-selectivity` | A customer index changes a narrow lookup’s work; a broad read may still scan the table. |
| How a query runs | `query-plans` | Filtering, aggregation and sorting have distinct inputs and outputs; estimates differ from executed row counts. |
| Storage and durability | `transaction-state` | COMMIT and ROLLBACK change the SQL transaction state; this memory-only lesson deliberately cannot prove crash durability. |

Redirects `normalisation.astro` and `concurrent-updates.astro` are not additional
articles. Their destinations supply the appropriate practice.

## Execution evidence

Run from the repository root with Node 24 and installed dependencies:

```sh
node docs/article-work/relational-completion/existing-practice/verify.mjs
```

The runner imports the exact lesson definitions and sends each step through
PGlite’s raw PostgreSQL protocol, preserving transactions between steps and
recording ReadyForQuery state. This avoids a convenience API’s transaction wrapper
changing the behaviour under test. PGlite is pinned to 0.5.8. `execution.json`
records command responses, rows, errors and transaction state for all steps.

All 39 steps passed. Assertions check the meaningful outcomes: €36 versus €40
receipts, €88 inflated versus €44 corrected totals, €40 versus €20 for distinct
equal amounts, page IDs before and after changes, 20/19 matching indexed rows,
scan/aggregate row counts, prices 20 → 25 → 20 → 30 and transaction states, empty
duplicate claim results, one remaining mug and a mismatched retry payload. The
JSON rejection produces the expected SQLSTATE 23514 and leaves capacity 350.
Additional conversion cases check 350.5, zero, an out-of-range integer and 350.0.

The checked index plans use a sequential scan before the customer index, bitmap
index/heap scans for the selective lookup afterwards, and a sequential scan for
18,000 of 20,000 rows. Lessons identify these as observed choices and permit plans
to differ. The plan-reading example estimates ten groups where three actually
survive the filter; the text explains this difference without promising estimates
are exact. PostgreSQL 18 displays actual row counts with decimals in this run;
the assertions accommodate that formatting.

## Evidence and scope

Primary documentation checked on 15 October 2026:

- [PostgreSQL 18 constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)
  supports the distinction between presence, a successful check and relational
  references. The JSON lesson’s typed record does not establish that every product
  must have such a record.
- [PostgreSQL 18 JSON operators](https://www.postgresql.org/docs/18/functions-json.html)
  supports key existence, JSON type inspection, text extraction and key removal.
  Boundary conversion outcomes were executed separately as well as read.
- [PostgreSQL 18 LIMIT and OFFSET](https://www.postgresql.org/docs/18/queries-limit.html)
  explains ordering and skipped rows. The inserted and moved-order examples are
  our own deterministic executions, not observations of concurrent sessions.
- [PostgreSQL 18 using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
  supports estimated versus actual rows, planner costs and repeated loops. Browser
  timings do not support production latency or throughput claims.
- [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
  supports visibility of a transaction’s own writes. The lesson has one connection
  and does not test another session’s snapshot, waiting or serialization failures.
- [PostgreSQL 18 INSERT](https://www.postgresql.org/docs/18/sql-insert.html)
  supports `ON CONFLICT DO NOTHING` and the returned-row branch. The retry lesson
  executes a duplicate request after a known commit; it does not manufacture a
  lost reply or claim to demonstrate an overlapping claim wait.

## Self-review and repairs

The learning order follows the records. The join lesson shows all four pairs
before aggregating them, then tests the tempting DISTINCT repair with two equal
legitimate amounts. Pagination saves the first page’s exact pair before changing
the table. The retry lesson separates claim, response, reservation and commit;
no instruction invites a reader to continue after an empty reservation result.
The repeated request explicitly skips reservation and compares all request fields.

The JSON lesson first observes representations, then examines a conversion policy
without changing data, and only then migrates a value under a transaction. It
gives an explicit rollback instruction if a changed input makes migration fail.
The subsequent deliberate constraint error occurs outside an explicit transaction,
so the next verification query is runnable. It also distinguishes stored integer
validation from a caller that rounded a fractional input before insertion.

An initial article-link pass placed the own-write exercise before the isolation
section had explained own-write visibility. It now follows that explanation and
its SQL. Existing prose and figures remain intact. Each added callout names what
the reader will do rather than merely advertising the sandbox.

Known limits: independent top-to-bottom reading, phone/light/dark rendering and
the complete build belong to the coordinated final pass. These SQL executions do
not establish multi-session isolation, crash recovery, real server performance or
the correctness of external side effects.
