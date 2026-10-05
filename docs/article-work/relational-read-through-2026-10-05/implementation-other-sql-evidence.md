# Other runnable repairs

Independent technical check, 5 October 2026. No article or download source was
edited. `implementation-other-sql-verify.mjs` extracts the actual Astro constants;
`implementation-other-sql-results.json` records statements, source hashes,
environment and outcomes. Twenty-five checks passed in the existing PostgreSQL
18.3 / PGlite 0.5.8 runtime.

## Constraint and receipt examples

The exact `constraints.astro` schema and fixture execute successfully. The five
`lineWrites` attempts are sent as separate statements outside an explicit
transaction: repeated P7 on new line 2 succeeds; duplicate identity fails with
`23505`; nonexistent P99 with `23503`; zero quantity with `23514`; null quantity
with `23502`. The two `skuWrites` attempts accept a second missing SKU and reject
the assigned duplicate with `23505`. The same outcomes pass against the named-
insert shared download instead of the inline fixture. Rejected statements do not
prevent later attempts, and they leave O12 with its original line and new line 2.

The exact modelling `receiptQuery` against the fresh shared download returns
Blue mug, quantity 2, unit price 18.00, line total 36.00. Naming the inserted
columns preserves the example's mapping and outcomes.

The inline constraint fixture contains only O12; the download also contains O13.
The composite-reference explanation later refers to the original O13 line 2.
That is available in the downloaded and preceding modelling example. This is a
minor fixture-scope distinction rather than a failure of the tested inserts;
if the inline setup is intended to supply every referenced record, give it the
O13 fixture too or identify the download at that illustration.

## Header-first pagination

The exact `pageWithLines` source selects the two oldest headers, O12 and O13,
then returns their three purchased lines without an outer line limit. The
appended query in `query-pagination.sql` matches it exactly. The complete
download executes successfully when each statement is sent separately, and its
experiments leave the five original order headers in place.

Additional probes delete O12's lines inside a rolled-back test transaction:
the unchanged source query retains O12 with null line number, product ID and
quantity, followed by O13's two lines. Removing O13's lines too returns both
headers, each with null line fields. These probes establish the stated empty-
header behaviour without changing the downloaded fixture.

**Execution guidance needs one clarification.** Sending the entire pagination
download as one multi-statement `db.exec` batch fails with SQLSTATE `25001`
at its later isolation-setting `BEGIN`. The earlier added orders also disappear
when their implicit batch work is included in the first experiment's rollback.
The probe reproduces this outcome, then verifies the successful statement-by-
statement route. Tell readers to send statements separately, for example with
`psql -f` script execution, rather than submitting the whole file as one query.
Current instructions merely say to open the files in a query editor and execute
them in order, which does not distinguish those modes.

This follows PostgreSQL's [multiple-statement protocol rules](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-MULTI-STATEMENT):
several commands in one simple-query message share an implicit transaction;
a later `BEGIN` can include earlier commands rather than first committing them.
It is an execution-mode boundary, not a defect in the appended header query.

## Retry response reference

The six response rows agree with the existing protocol and checked primary
documentation. They keep ordinary unsuccessful business outcomes, known
transactional rejection and unknown commit outcomes distinct.

| Reference row | Evidence and assessment |
| --- | --- |
| Guarded stock update returns no rows | The copied protocol's insufficient-stock branch executes successfully with zero affected rows, then rolls back the provisional key and order. Stock stays unchanged. PostgreSQL's [UPDATE output documentation](https://www.postgresql.org/docs/18/sql-update.html#SQL-UPDATE-OUTPUTS) explicitly distinguishes zero rows from an SQL error. |
| Statement waiting | Its outcome remains unresolved. Budget and cancellation are application choices; the preceding prose requires known cancellation cleanup or unknown-commit recovery before repetition. [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-DEADLOCKS) documents waits and aborting a deadlock participant. |
| Known 40001 or 40P01 | The whole rejected attempt must be restarted, including decisions. [Serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) supports both code distinctions and whole-transaction retry. Keeping the operation identity and bounding the retry budget are the article's protocol choices. |
| Lost COMMIT reply | A failed connection does not establish rollback. [libpq status](https://www.postgresql.org/docs/18/libpq-status.html#LIBPQ-PQTRANSACTIONSTATUS) distinguishes unknown transaction state on a bad connection. Recovery must ask authoritative retained state about the same intent. |
| Empty lookup while original may be active | The lookup has not established absence. [Index uniqueness checks](https://www.postgresql.org/docs/18/index-unique-checks.html) document waiting for a competing insert's commit or rollback; [Read Committed rules](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED) allow DO NOTHING to detect an outcome absent from its own view, hence the later lookup statement. |
| Authoritative database unavailable | Keeping the result pending follows from the absence of evidence. It is a protocol judgement, not a documented server outcome or promise that a deadline establishes failure. |

The source protocol's fresh claim, stock reservation, line and commit were
executed; duplicate claim inserts nothing and recovers the same O14. The source
table's uncertain-commit, overlapping-claim, cancellation and deadlock cases were
reviewed against documentation, not reproduced in this one-connection runtime.
No response-table correction is required.

Re-run with:

```sh
node docs/article-work/relational-read-through-2026-10-05/implementation-other-sql-verify.mjs
```

Runtime: `/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js`.
No project dependencies were changed.

## Final claim and execution-mode recheck

The final retry `claim` constant now begins with `BEGIN ISOLATION LEVEL READ
COMMITTED`. The preceding prose keeps that transaction on the same connection
through the selected branch. A targeted independent recheck extracts this final
fragment and executes it directly, without an extra manually supplied `BEGIN`.
The successful branch commits O14/K14, its two-mug line and stock reduction to
one. A repeated K14 proposing O15 returns no inserted row, then reads O14 and
commits the recovery branch without another stock reservation. On a fresh
fixture with only one mug available, the exact claim remains provisional: the
copied guarded UPDATE returns no rows, its line INSERT is skipped, and explicit
rollback removes O14 and K14 while retaining that one mug. All three outcomes
pass. No transaction-opening correction remains.

`implementation-other-sql-claim-verify.mjs` preserves this targeted recheck;
`implementation-other-sql-claim-results.json` records exact source fragments,
hashes and outcomes. The broader verification script was adjusted to let this
new claim open its own transactions, so it remains usable after the source edit;
the completed broader checks were not rerun for this narrow change.

The final pagination article now says to send statements one at a time or use
`psql -f` script mode, and explains that an editor's Run All may change the
transaction boundaries. The download repeats the statement mode and forbids
sending the whole file as one multi-statement server query. That addresses the
batch failure recorded above by making the already-verified successful execution
mode explicit. No further pagination instruction repair is required.
