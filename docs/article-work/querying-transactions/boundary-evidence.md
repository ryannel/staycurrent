# Transaction boundaries: evidence and media

Draft prepared 4 October 2026. Commission: explain how to choose a local transaction
boundary from an application rule, then show where an outside payment changes the
workflow. The root agent owns independent review, browser verification and the
collection build. This is draft production, not publication.

## Primary evidence

All links checked on 4 October 2026; PostgreSQL 18 documentation.

| Source | What it supports | Reader use |
| --- | --- | --- |
| https://www.postgresql.org/docs/18/tutorial-transactions.html | Atomicity, own unfinished work, errors and recovery with savepoints | Introductory companion after the article |
| https://www.postgresql.org/docs/18/sql-begin.html | Explicit transaction boundary; default per-statement transactions | Exact command semantics |
| https://www.postgresql.org/docs/18/sql-commit.html | Ending a successful transaction | Command reference |
| https://www.postgresql.org/docs/18/sql-rollback.html | Discarding the current transaction’s updates | Distinguish rollback from a later cancellation |
| https://www.postgresql.org/docs/18/sql-savepoint.html | Partial recovery remains within the enclosing transaction | Optional extension; no suggestion to omit required order work |
| https://www.postgresql.org/docs/18/sql-update.html | No affected rows is not an error | Explains the application’s explicit stock-result branch |
| https://www.postgresql.org/docs/18/dml-returning.html | Returning modified rows and their new values | Result inspection |
| https://www.postgresql.org/docs/18/explicit-locking.html | Transaction lock lifetime | Explains the cost of an outside call inside an open transaction |
| https://www.postgresql.org/docs/18/transaction-iso.html | Ordinary-read visibility and row update rechecking | Bounds visibility wording; concurrency is developed in the next page |

The pending-payment workflow is an explicitly proposed design, not a claim about
an actual provider or a complete implementation. Local rollback cannot reverse an
independent remote operation. The diagram makes unknown outcomes unresolved,
requires a stable reference and reconciliation, and warns against releasing stock
twice. Provider-specific recovery is outside scope.

## Executed examples

`boundary-concurrent-verify.mjs` extracts literal SQL constants from both article
sources. Run from the repository root with Node and the existing PGlite install at
`/private/tmp/staycurrent-design-sql`. Executed successfully on PostgreSQL 18.3,
PGlite 0.5.8 on 4 October 2026:

- Successful reservation returns P7/1; commit leaves availability 1, one O14 and
  one line.
- Invalid quantity 0 produces SQLSTATE 23514. An ordinary statement then produces
  25P02 until rollback. Rollback leaves availability 3 and no O14 or line.
- Only one available mug produces an empty reservation result; explicit rollback
  leaves that stock unchanged and no purchase.

The fixture imports the unchanged designing-data practice schema. New checkouts
use O14; O12’s historical quantity and price remain untouched. Each test starts in
an independent in-memory database. No multi-session or recovery test is claimed.

## Media intentions

- `BoundaryOutcomes.astro`: one visibly enclosed set of stock/order/line changes,
  branching into alternative commit and rollback states. The alternatives carry
  exact counts and presence/absence labels. It excludes other transactions.
- `BoundaryPayment.astro`: two local transaction stages separated by an outside
  operation. Success and confirmed decline lead to different second transactions;
  an unknown outcome has its own note. It is explicitly beyond the runnable schema.

Both use existing SketchSheet/SketchArrow drawing components and theme-aware
schema-sketch colours. They carry HTML labels and captions; no generated image or
new image prompt is involved. Narrow layouts stack record sheets in reading order.
