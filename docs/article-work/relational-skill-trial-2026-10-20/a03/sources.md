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

## d01 repairs: new evidence (20 October 2026)

Same cluster and settings (PostgreSQL 18.6, port 57502, started with the same `pg_ctl` command, stopped afterwards). `node src/components/relational-trial/a03/verify.mjs` run in full twice after the repairs; both exited 0.

- Fixture now has customers Mina Shah (1), Tariq Aziz (2), Edda Berg (3); instructors Lena and Ravi. All schedules re-asserted with the new names.
- Figure 5, opposite order (after Mina's R8 booking): A locks 21 (`BEGIN`, `21`), B locks 22, A waits for 22, B waits for 21 (both confirmed in `pg_stat_activity`); A gets `ERROR: 40P01`; B's lock is granted (`21`) before A rolls back; A's next statement `ERROR: 25P02`; A `ROLLBACK`; B's reservation guard `UPDATE 1`, place in 21 `UPDATE 0`; B `ROLLBACK`; A's whole move `BEGIN, 21, 22, UPDATE 1, UPDATE 1, UPDATE 1, COMMIT`. Final: class 21 1 left, class 22 1 left, R7 and R8 in 22.
- Figure 5, ascending order: B waits for 21; A locks 22, moves, commits; B gets 21 and 22, moves, commits. Final: 21 0 left, 22 2 left, R7 in 21, R8 in 22.
- Repeated move (class 21 capacity 3, 0 left, R8 Mina, R20 Tariq, R21 Edda; class 22 2 left, R7): unguarded listing, second run `UPDATE 1, UPDATE 1, UPDATE 1, COMMIT`, check `21|3|2|2|f`, `22|3|0|2|f`; guarded listing, second run `UPDATE 0`, `ROLLBACK`, check `21|3|1|2|t`, `22|3|1|2|t`.
- Capacity check on the starting rows: `21|1|1|0|t`, `22|3|2|1|t`.
- New source cited: PostgreSQL 18, Serialization failure handling, on retrying 23505 and 23P01 under Serializable; Error codes for 23P01.
