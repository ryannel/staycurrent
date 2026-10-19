# RL91 evidence

Checked 19 October 2026.

## Reader decision and observed result

Existing shared resource → empty locking read failure → uniqueness and parent-row repair → wait graph → deadlock and consistent order.

Native missing reads both empty; second same-key INSERT 23505. Waiter blocks on root idle transaction. Opposite order yields 40P01 and other statement completes.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl91-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Isolation contract RL90; recovery RL93; incident root blocker RL103.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL 18: Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html) specifies lock conflicts, lifetime and deadlock handling.
- [InnoDB locking](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html) explains record, gap and next-key locks. Read it alongside the [isolation levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html).
- [SQL Server's locking guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-ver17) explains escalation, range locks and versioned reads.
- [SQLite isolation](https://sqlite.org/isolation.html) supplies its different write-serialisation boundary.
- [Retries when a commit reply is missing](/review/relational/rl93/) distinguishes confirmed victim handling from an unknown outcome.
