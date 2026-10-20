# a00 Relational databases: sources and commands (skill trial, 20 October 2026)

## Versions

- PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0; psql 18.6;
  binaries in `/opt/homebrew/bin`.
- Node v24.16.0; pnpm 11.4.0; Astro 5.18.2.
- macOS (Darwin 25.6.0).

## Primary sources cited

- E. F. Codd, “A relational model of data for large shared data banks”, CACM 13(6), 1970. https://doi.org/10.1145/362384.362685
- PostgreSQL 18 documentation: Constraints (ddl-constraints), Error codes
  (errcodes-appendix), Transaction isolation (transaction-iso), Asynchronous
  commit (wal-async-commit), ALTER TABLE (sql-altertable), Index types
  (indexes-types), Using EXPLAIN (using-explain), Routine vacuuming
  (routine-vacuuming), Continuous archiving and PITR (continuous-archiving),
  Log-shipping standby servers (warm-standby). https://www.postgresql.org/docs/18/
- MySQL 8.4 Reference Manual: Consistent nonlocking reads, Transaction
  isolation levels, Statements that cause an implicit commit. Used for the
  InnoDB Repeatable Read and implicit-commit statements, which were not run.
- SQLite: Appropriate uses for SQLite. https://www.sqlite.org/whentouse.html

## Commands that ran

Scratch directory: `$SCRATCH` = the session scratchpad
(`/private/tmp/claude-501/-Users-ryannel-Workspace/67ac3f49-84c4-49a9-b342-63b83f99fa7e/scratchpad`).

```sh
/opt/homebrew/bin/initdb -D "$SCRATCH/pg/data" --locale=C --encoding=UTF8 -U staycurrent --auth=trust

# First start failed: "postmaster became multithreaded during startup",
# hint "Set the LC_ALL environment variable". Restarted with LC_ALL=C:
LC_ALL=C /opt/homebrew/bin/pg_ctl -D "$SCRATCH/pg/data" -l "$SCRATCH/pg/server.log" \
  -o "-c port=57501 -c listen_addresses=127.0.0.1 -c unix_socket_directories=''" -w start

# Verification (repeated after each model change; last run exit 0, "All checks passed")
cd /Users/ryannel/Workspace/staycurrent/src/components/relational-trial/a00
LC_ALL=C node verify.mjs            # defaults: 127.0.0.1 57501 staycurrent; writes observed.txt

# Viewing
cd /Users/ryannel/Workspace/staycurrent
pnpm astro dev --port 4401          # background; page checked at /review/relational-trial/, then stopped

# Build
pnpm build                          # exit 0; site check: 142 pages, 13 rules, all ok

# Cleanup
LC_ALL=C /opt/homebrew/bin/pg_ctl -D "$SCRATCH/pg/data" -m fast stop
```

`verify.mjs` creates databases `a00_verify` and `a00_scan`, runs each step via
`psql` sessions with `\set VERBOSITY verbose`, waits for lock waits by polling
`pg_stat_activity` (no fixed sleeps), and uses
`EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF, SUMMARY OFF)` with
`max_parallel_workers_per_gather = 0` for page counts. Observed server
defaults: `default_transaction_isolation` read committed,
`synchronous_commit` on, `fsync` on.

What it checks: receipt join; six refused or accepted changes and their
SQLSTATEs (23503, 23505, 23514, 23514, 23503, accepted); Mina’s orders;
broad (UPDATE 2) and narrow (UPDATE 1) cancellation; the three Figure 2
queries; the order-103 transaction; the unguarded decrement refused with
23514; all steps and final states of the three Figure 3 options; the five
tax-country cases and the PostgreSQL 18 `NOT NULL … NOT VALID` then
`VALIDATE` path (table file node unchanged where no rewrite is claimed); pages
read at 1,000, 100,000 and 1,000,000 rows.
