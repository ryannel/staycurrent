# a15 — sources and verification

Checked 20 October 2026. Reference engine: native PostgreSQL 18.6, Homebrew
`/opt/homebrew/Cellar/postgresql@18/18.6_1/bin`, on the commission's disposable
loopback server. Own database: `rel3_a15_run1`. Session defaults recorded in
`native-results.json`: UTC, read committed, statement timeout 30s. The run did
not change shared server settings. Amounts are invented single-currency numeric
values. The parent fixture is imported unchanged from a02; unlike a14, receipts
belong to orders here.

## Primary sources and claim ownership

- PostgreSQL 18, [Scalar Subqueries](https://www.postgresql.org/docs/18/sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES): one output column, zero rows becomes null, multiple rows fail, outer-value references. Native checks establish the illustrated 100/101/102 and nullable-value answers, including SQLSTATE 21000.
- [Subquery Expressions](https://www.postgresql.org/docs/18/functions-subquery.html): EXISTS, IN, NOT IN, empty and nullable inner results. Figures are logical truth-table calculations, not claims about complete physical inner execution.
- [Comparison Functions and Operators](https://www.postgresql.org/docs/18/functions-comparison.html): IS NOT DISTINCT FROM and the explicit alternative null-membership policy. No general expression tutorial is duplicated.
- [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html): a derived table's column/row interface; actual source grouping supplies the one-subtotal-per-order bound. Join repairs remain with a14.
- [Combining Queries](https://www.postgresql.org/docs/18/queries-union.html), [SELECT](https://www.postgresql.org/docs/18/sql-select.html), [Type Resolution](https://www.postgresql.org/docs/18/typeconv-union-case.html): corresponding column positions, compatible types, duplicate multiplicities and precedence. Actual six-operator outputs are independently compared against JavaScript count formulas. The final ORDER BY supplies display order.
- [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html): normal view names a query definition rather than saved rows. Native test creates the complete parent composition, checks values and column types, adds a receipt and reads the changed result in the same transaction, then rolls back and reads the original value. No administration or plan promises.
- [Recursive Queries](https://www.postgresql.org/docs/18/queries-with.html#QUERIES-WITH-RECURSIVE): anchor/working-row explanation, paths, CYCLE alternative and why complete-row UNION deduplication does not stop changing depth/path rows. Executed explicit-array-path query includes a cap and per-boundary-row truncation check; figure rounds are explanatory, not observed engine rounds.
- SQLite [Subquery Expressions](https://www.sqlite.org/lang_expr.html#subquery_expressions) and [Compound Select Statements](https://www.sqlite.org/lang_select.html#compound_select_statements): first-row scalar behaviour, operator grouping and no INTERSECT ALL / EXCEPT ALL. Documentation only; no SQLite execution is claimed.
- MySQL 8.4 [Set Operations](https://dev.mysql.com/doc/refman/8.4/en/set-operations.html) and [WITH](https://dev.mysql.com/doc/refman/8.4/en/with.html): ALL variants and recursive syntax. Documentation only.
- SQL Server [EXCEPT and INTERSECT](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/set-operators-except-and-intersect-transact-sql) and [WITH common_table_expression](https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql): supported set variants, omission of RECURSIVE and MAXRECURSION. Documentation only.

## Retained evidence

- `verification.sql`: each executed statement, including the full imported fixture,
  view and bounded traversal. It is an evidence transcript, not a portable single
  session regression script: the verifier opens separate psql sessions, and the
  view mutation deliberately keeps its BEGIN/read/ROLLBACK in one call.
- `native-results.json`: exact psql stdout, stderr, status and statement text for
  each passing call. Successful deliberate error checks retain their NOTICE text.
- `src/components/relational-next/a15/verify.mjs`: native assertions and model-frame
  shape checks. Run only after creating fresh `rel3_a15_run1` on the documented
  disposable server. It resets only this database's exercise objects. It does not
  start, stop or reconfigure the server.
- `model.mjs`: JavaScript source of the five logical figure models. All selectable
  modes compared with native outputs: 4 membership modes (one null-safe), 6 set
  operations, 5 traversal modes, scalar variants and both correlated orders.

The first verification attempt exposed a harness error: separate psql calls did
not share the transaction used for the view mutation. The repaired check executes
BEGIN, insert, view read and ROLLBACK in one psql invocation, then verifies the
restored value in another. A second harness assertion incorrectly demanded three
frames for a missing root; two correctly suffice (empty anchor, empty result).
Both were repaired before retaining the passing run. No failed check is presented
as PostgreSQL result evidence.

No performance, engine execution counts, non-PostgreSQL runtime observations,
concurrency guarantees or production view deployment were measured.
