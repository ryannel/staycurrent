# RL82 author evidence

19 October 2026. Authored explanation; independent review remains outstanding.

## Scope and observed execution

Daily totals 90/10; per-customer windows 60/40; default tied-time running totals 60/60 versus explicit ROWS 40/60; empty aggregate 0/NULL; ranking tie variation executed.

Native PostgreSQL: 18.6 (Homebrew), aarch64-apple-darwin25.6.0. Isolated cluster under a unique temporary directory, Unix socket and port 56679; default services were not touched. Ordinary examples used unique author_rl82 schemas; retained index experiments use temporary tables plus dedicated author_rl86 tables. Python driver: 3.14.5, bundled SQLite 3.54.0. No MySQL or SQL Server execution is claimed.

## Reproduce and reset

The batch verifier is `evidence/rl77-89-verify.py`. Run it with the root of an already initialised disposable PostgreSQL 18 cluster listening on 56679. It creates and resets only its named author schemas. Expected constraint and cursor errors are asserted by SQLSTATE; unexpected SQL errors stop it. Its raw libpq result text prints NULL as an empty field.

`rl82-native.txt` records commands, rows and expected errors. Stop the disposable instance with `pg_ctl -D <lab>/data stop -m fast`; remove only that owned lab directory afterwards. Commands and observations remain in this work folder.

## Evidence limits

Native runs establish these examples on the recorded versions, not universal performance numbers. Invented figures are models of stated inputs. Other-engine contrasts use the annotated primary documentation, not local measurements. Browser checks and final whole-collection review belong to the coordinator.

## Primary source ledger

Sources below are annotated at their reading positions or in the article’s Sources section. PostgreSQL 18 manual pages, Python sqlite3 documentation, SQLite documentation and the listed MySQL 8.4/SQL Server pages were browsed on 19 October 2026 where they carry new claims. RL86 also retains its earlier 17–18 October source record and explicitly labelled PGlite 18.3 measurements.

- https://www.postgresql.org/docs/18/functions-aggregate.html
- https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-AGGREGATES
- https://www.postgresql.org/docs/18/tutorial-window.html
- https://www.postgresql.org/docs/18/functions-window.html
- https://www.sqlite.org/windowfunctions.html
- https://dev.mysql.com/doc/refman/8.4/en/window-functions.html
