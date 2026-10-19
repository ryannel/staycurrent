# RL92 evidence

Checked 19 October 2026.

## Reader decision and observed result

Page and locator layouts → retained versions → measured old-reader horizon → free space versus file shrinkage.

Native 1,000 current rows and 5,000 retained dead versions; ending old reader permits VACUUM to remove dead versions while file stays 851,968 bytes.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl92-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Indexes RL86; PostgreSQL vacuum RL111; crash ordering RL95.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html) covers reusable space, visibility and file shrinkage; [page layout](https://www.postgresql.org/docs/18/storage-page-layout.html) and [TOAST](https://www.postgresql.org/docs/18/storage-toast.html) explain physical overhead and large values.
- [InnoDB multi-versioning](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html) explains undo reconstruction, secondary indexes and purge.
- [SQLite WAL](https://sqlite.org/wal.html) explains end marks, checkpoints and long-reader growth.
- [SQL Server locking and row versioning](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-ver17) identifies the version stores and the isolation options that use them.
