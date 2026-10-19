# RL94 evidence

Checked 19 October 2026.

## Reader decision and observed result

Atomic order/intent → relay crash duplication → queue claim → lease expiry → effect-authority fencing → completion and parked jobs.

Native rollback removes purchase and intent; commit retains both. SKIP LOCKED claims j83 while j82 held, then j82 after release. Old epoch produces zero effect rows at authority; current epoch inserts one and duplicate inserts none.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl94-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Stable identity RL93; lock cost RL91. Effect authority is SQL, not an email or payment product.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [Transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html), the pattern author's account of atomic intent and relay duplication.
- [PostgreSQL SELECT](https://www.postgresql.org/docs/18/sql-select.html) documents SKIP LOCKED's inconsistent-view tradeoff; [explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html) supplies transaction lifetime.
- [InnoDB locking reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html) defines its SKIP LOCKED and NOWAIT behaviour.
- [SQL Server table hints](https://learn.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-table?view=sql-server-ver17) states READPAST's restrictions.
- [SQLite isolation](https://sqlite.org/isolation.html) explains the single-writer claim boundary.
- [Retries when a commit reply is missing](/review/relational/rl93/) develops the identity/result protocol that each recipient needs.
