# RL90 evidence

Checked 19 October 2026.

## Reader decision and observed result

Counter lost update → atomic predicate; statement snapshot → predicate write skew → Serializable abort and fresh decision.

Native separate clients return 3 bookings under Repeatable Read, 2 under Serializable with B 40001, then B rereads 2. Atomic contender waits and updates zero.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl90-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Lock scope RL91; outcome recovery RL93; MVCC physical cost RL92.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL 18: Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) defines statement snapshots, changed-row handling and Serializable. The workshop histories above were independently executed on PostgreSQL 18.6.
- [PostgreSQL: Serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) explains why the retry includes application decisions.
- [InnoDB isolation levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html) and [locking](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html) distinguish consistent reads, locking reads and gap protection.
- [SQLite isolation](https://sqlite.org/isolation.html) explains the single writer and stale-snapshot write failure.
- [SQL Server's locking and row-versioning guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-ver17) distinguishes locking, statement versioning, SNAPSHOT and key-range locks.
