# a03 trial: sources, commands and versions

## Primary sources (checked 20 October 2026)

- PostgreSQL 18: Transactions (tutorial-transactions); SAVEPOINT (sql-savepoint); Transaction isolation (transaction-iso); Concurrency control introduction (mvcc-intro); Explicit locking (explicit-locking); Serialization failure handling (mvcc-serialization-failure-handling); Constraints (ddl-constraints); UPDATE (sql-update); Error codes (errcodes-appendix); Message flow (protocol-flow); libpq connection status (libpq-status); Write-ahead logging (wal-intro); Asynchronous commit (wal-async-commit); WAL configuration (runtime-config-wal); Log-shipping standby servers (warm-standby). All at https://www.postgresql.org/docs/18/.
- MySQL 8.4: Consistent nonlocking reads (innodb-consistent-read), for InnoDB Repeatable Read applying its snapshot to reads but not to DML.

## Environment

- PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, binaries in `/opt/homebrew/bin/`.
- Settings reported by the server during verification: `default_transaction_isolation = read committed`, `synchronous_commit = on`, `fsync = on`, `deadlock_timeout = 1s`.
- Node from the repository toolchain; Astro 5.18.2 (dev server banner).

## Commands run

Scratchpad `S=/private/tmp/claude-501/-Users-ryannel-Workspace/67ac3f49-84c4-49a9-b342-63b83f99fa7e/scratchpad`.

```sh
export LC_ALL=C   # without it, pg_ctl start failed: "postmaster became multithreaded during startup"
initdb -D $S/pgdata --locale=C -U staycurrent -A trust
pg_ctl -D $S/pgdata -l $S/pg.log -o "-p 57502 -c listen_addresses=127.0.0.1 -c unix_socket_directories=''" start
psql -X -h 127.0.0.1 -p 57502 -U staycurrent postgres   # exploratory sessions while drafting the schedules
node src/components/relational-trial/a03/verify.mjs > $S/result.json 2> $S/verify.err   # several runs; last run exit 0
LC_ALL=C pg_ctl -D $S/pgdata stop
pnpm astro dev --port 4402   # background; stopped with pkill after checking
pnpm build
```

`verify.mjs` defaults: `PG_BIN=/opt/homebrew/bin/`, `PGHOST=127.0.0.1`, `PGPORT=57502`, `PGUSER=staycurrent`, database `trial_a03_check` (refuses to run if it exists; created and dropped by the script).

## Observed results used in the article (last verification run)

- Figure 2 and 3 schedules: every reply and committed state as in `model.mjs`.
- Figure 4: ordinary SELECT returned 1 while A was open, a new SELECT after commit returned 0; FOR UPDATE waited, then returned 0; the conditional UPDATE waited, then changed 0 rows.
- Two-statement listing: `BEGIN`, `1`, `UPDATE 1`, `ERROR 23505`, then `25P02`, and COMMIT answered `ROLLBACK`.
- Savepoint endings: rollback leaves 2 places and R7; savepoint after the update then commit leaves 1 place and R7 (rule broken); savepoint before the update leaves 2.
- Isolation levels: Repeatable Read, place: Arun's update `40001`; staff: both commit, nobody available. Serializable, place: `40001`; staff: Tariq's COMMIT `40001`, Tariq still available.
- Retrying only Tariq's UPDATE after the 40001: `BEGIN`, `UPDATE 1`, `COMMIT`; nobody available.
- Deadlock, opposite order: Mina's transaction was the victim (`40P01`), her next statement `25P02`; Arun's move found class 21 full (`UPDATE 0`) and rolled back; Mina's whole retry committed. Ascending order: Arun waited for row 21, then both committed.
- Lost reply: client killed before COMMIT left 1 place and no bookings; killed 300 ms into a COMMIT held open 1.5 s by a deferred constraint trigger, the booking committed (0 places, R8). A blind repeat returned no row; looking up R8 showed owner 1.

## Not tested

- The durability table (`synchronous_commit = off`, replicas, `fsync = off`) is from the documentation.
- MySQL behaviour is from the documentation only.
