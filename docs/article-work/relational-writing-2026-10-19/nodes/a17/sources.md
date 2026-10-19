# a17 primary-source and execution record

Checked 20 October 2026. Reference engine: native Homebrew PostgreSQL 18.6,
server_version_num 180006, shared commissioned loopback instance 57319. Article
fixture is an invented two-tenant extension of the parent's order/receipt shop;
its temporary table names do not modify the parent's tables. All declared source
rows are genuine arrivals; summation is explicitly conditional on that meaning.

Primary sources read through the web tool:

- https://www.postgresql.org/docs/18/sql-insert.html — omitted columns, DEFAULT,
  RETURNING, exact unique conflict target, EXCLUDED, conditional conflict action,
  repeated source-key cardinality error and documented insert/update guarantee.
- https://www.postgresql.org/docs/18/sql-update.html — full target set, stored-value
  expressions, UPDATE FROM's unspecified source winner and same-value row count.
- https://www.postgresql.org/docs/18/sql-delete.html — direct deleted-row count,
  returned old row and related-table targeting.
- https://www.postgresql.org/docs/18/sql-merge.html — ordered WHEN actions,
  returned merge_action(), repeated target changes and guarantee differences.
- https://www.postgresql.org/docs/18/dml-returning.html — direct modified rows.
- https://www.postgresql.org/docs/18/ddl-constraints.html — NOT NULL/default
  distinction, complete-key referential actions and failed statement effects.
- https://www.postgresql.org/docs/18/functions-sequence.html — nextval allocations
  are not reclaimed by rollback; gapless numbering cannot be inferred.
- https://www.postgresql.org/docs/18/tutorial-transactions.html — explicit
  transaction completion/rollback.

`verify.py` creates only database `rel3_a17_run1`, supplies the article's exact
setup and query exports to psql, compares hand-written expected output, captures
SQLSTATE-bearing errors, then drops the database in `finally`. It was run on the
commissioned native instance with elevated execution (required for loopback).
`native-results.json` retains all 27 queries, expected answers, actual stdout,
stderr, exit status and pass decision, plus exact setup. It checks failure then
25P02 then ROLLBACK in the same session. No server settings or roles were changed.
Every verification session is bounded by 35-second subprocess limits; the shared
server's own statement/lock/idle limits remained in force. Database removed.

The initial full-state exercise expectation assumed a RETURNING order. Actual
rows arrived as P9 then P7. The expectation was corrected to retain that observed
order and the article explicitly treats it as an unordered key/value set; the
separate ordered final-state comparison verifies the postcondition. No query was
changed to force an unsupported output-order promise.

Observed ambiguous UPDATE FROM returned P7=7, using the 2-unit row. This is an
observation of this run, not a promised winner. Corrected aggregation returns10.
MERGE returned UPDATE P7=8, DELETE P8 with old available2, INSERT P9=4. Native
checks do not establish concurrent correctness, latency, throughput or recovery.

`src/components/relational-next/a17/check.mjs` checks all 63 logical figure frames
across21 option combinations, panel dimensions and stock-unit meters. Named final
states are checked against retained native outputs. Models explain reasoning;
none executes SQL or models a scheduler. All prose quantities concern this
fixture; no cross-engine measurements or unexecuted performance claims.

## Independent conflict-boundary check

The practitioner review added three PostgreSQL 18.6 checks using the exact receipts fixture. A conflicting bank-1 proposal with missing order 999 was skipped, returned zero rows and left bank-1 linked to 101. A new reference against 999 failed with 23503; a negative amount on conflicting bank-1 failed with 23514. Exact SQL, fixture, expected results and raw output are retained in `batches/b17/practitioner-a17-conflict-native.json`. The conflict-policy paragraph now distinguishes an ignored proposal from an inserted row. No displayed query or figure changed.
