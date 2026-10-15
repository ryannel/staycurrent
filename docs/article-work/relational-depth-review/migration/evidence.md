# Schema-change evidence

The isolated PostgreSQL 18.6 server uses Unix socket
`/private/tmp/staycurrent-relational-depth/socket`, port 55439, database
`sc_depth_migration`. The native harness imports the existing schema-evolution
lesson's exact setup, trigger and bounded batch. It uses independent application,
backfill and monitoring connections; the DDL trial adds a third caller.

`node --experimental-strip-types docs/article-work/relational-depth-review/migration/verify.mjs`
passes the following assertions, recorded in `observed.json`:

- A stale application value copied after a committed old-column edit creates a
  real mismatch: Reception in old, Front desk in new.
- When the old writer holds order 1, the backfill blocks on it. After the writer
  commits, the batch returns only order 2/Ring bell; order 1 stays Reception in both
  columns. Order 3 remains missing until the next batch.
- When backfill holds the row first, the old writer blocks. After backfill commits,
  its update and trigger leave Reception in both columns.
- An ordinary open read transaction holds up the column addition. A later read
  waits behind the queued AccessExclusiveLock. The two-second lock timeout gives
  55P03, frees the later read, and leaves B in failed-transaction state 25P02 until
  rollback. The column is absent. Once A commits, retry adds it successfully.

The downloadable session worksheet has the same connections and conditions. Its
manual DDL wait is ten seconds to allow switching terminals; the automated trial
uses the article's two-second bound. Neither measures production migration cost.
Each reset finishes sessions first and replaces only the disposable lesson table
and helper. The final DDL example explicitly returns to the old schema so it does
not add an existing column twice.

Primary references checked 15 October 2026:

- https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED —
  waiting target-row updates and predicate rechecking; not a guarantee for cached
  application values or every isolation level.
- https://www.postgresql.org/docs/18/explicit-locking.html — table-lock conflicts,
  transaction lifetime and implicit locking by reads/DDL.
- https://www.postgresql.org/docs/18/sql-altertable.html — lock strength and operation
  scope; the small nullable addition is not a universal no-lock migration.

The prose preserves the existing A/B/C deployment-stage names. In the separate
server schedules, A/B/C explicitly name connections and their jobs. The schedules
supply an operational observation for the earlier compressed recheck claim.

The uncued reader identified an unexplained validation operator. The final prose
now derives why IS DISTINCT FROM catches a missing copied value while <> would
produce unknown and omit that row. This was checked against PostgreSQL 18's
[comparison documentation](https://www.postgresql.org/docs/18/functions-comparison.html).
The cutover section also names application release B explicitly after the separate
connection A/B schedules.

A final native SELECT checked the reader's three NULL cases: a text value IS
DISTINCT FROM NULL returned true; ordinary <> returned unknown; two NULL text
values IS DISTINCT FROM each other returned false. This is a check of the new
explanation, not a new migration workload experiment.
