# Isolation: bounded practical repair

## Commission and depth checkpoint

The existing article explains snapshots, write skew and serializable decisions accurately. Its missing practical ending was an exact sequence for reproducing the multi-row rule, cleaning up a rejected attempt and retrying the decision against the survivor. The repair preserves that explanation and adds an optional ordered exercise with reset rules, a complete retry branch, and the actual control-lock alternative. No tuple-header internals or simulated concurrent browser connections were added.

The reader can now predict and reproduce these different outcomes from the same P7/P8 display: both disabled after Repeatable Read write skew; one remains after Serializable rejection and whole-decision retry; one remains after a shared control lock plus a fresh Read Committed read. The counterexample demonstrates why substituting Repeatable Read for that last protocol is not an automatic improvement.

## Executed evidence

`verify.mjs` uses the actual `designing-data/schema.sql` products and two participating connections to a disposable PostgreSQL 18.6 database. Its third connection observes the lock wait and reads final state. It replaces only its own `isolation_review` schema in `sc_depth_isolation`; no other project database is touched. `observed.json` records asserted outcomes.

- Read Committed report: 20.00, then 22.00 after the writer commits; fresh read 22.00.
- Repeatable Read report: 20.00 twice; fresh read 22.00.
- Repeatable Read display: both conditional updates return their product IDs and both commit; both flags become false.
- Serializable display: both updates return provisionally; A commits, B's commit fails with 40001. B rolls back/cleans up and repeats its whole conditional decision; it returns zero rows, commits, and leaves P8 enabled. The article explicitly does not promise that every execution chooses that victim or error location.
- Shared unchanged control row, Read Committed: B is observed waiting for A's lock. After A commits, B's subsequent statement sees P7 disabled, and its conditional update returns zero rows.
- Same unchanged control row, Repeatable Read: B is observed waiting, then reads the older flags and disables P8. Both end false. The row lock alone does not refresh B's snapshot.

All assertions passed on 15 October 2026. The script ends both participant transactions and restores P7's price to 20 and both flags to true. Its test connection settings are session-local and all connections close.

To repeat in the prepared workspace runtime:

```sh
node docs/article-work/relational-depth-review/isolation/verify.mjs
```

`PGHOST`, `PGPORT`, `PGUSER` and `PG_MODULE_PATH` can select the disposable server and installed `pg` module; the database name remains intentionally fixed. The downloadable `session-worksheet.sql` is for human-directed execution across two sessions, not `psql -f`: each block names its connection and pause. The article states this before linking it.

## Primary sources

Checked 15 October 2026:

- [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): statement versus transaction snapshots, updates and locking reads, write skew and Serializable.
- [PostgreSQL 18 explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html): row locks and their transaction lifetime.
- [PostgreSQL 18 serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html): repeat the complete transaction and the logic deciding its SQL.

The native counterexample is an inference from these documented mechanisms checked by execution, not a separate guarantee invented for the teaching diagram.

## Review state

The initial independent review is saved in `../review/foundations-initial.md` before author edits. Root is arranging independent technical/editorial rereading of the repair and the sequential reader remains uncued on the original assembled pages. Root owns builds and rendered checks. These are pending at this handoff.
