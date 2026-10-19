# RL106 evidence

Checked 19 October 2026.

## Reader decision and observed result

Per-partition consensus → prepare/intents → coordinator loss and durable outcome → staggered apply/read resolution → unavailable participant → product differences/workflow alternative.

Executable two-phase model retains provisional state during coordinator loss. One durable commit controls P/Q; Q read resolves to committed order before physical intent cleanup. No native protocol guarantee claimed.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl105-109-models.mjs
```

The script is the exact command/fixture record; `rl106-model-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Actual Cockroach intent protocol RL124; clocks RL107; operation identity RL93.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [Raft paper](https://raft.github.io/raft.pdf), particularly log replication and membership change, defines one replica-agreement protocol. Its unit of agreement is distinct from this transaction-wide decision.
- [CockroachDB transaction layer](https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer) explains intents, transaction status recovery and parallel commits. Read its actual STAGING condition rather than substituting the generic two-phase picture.
- [YugabyteDB distributed transaction fundamentals](https://docs.yugabyte.com/stable/architecture/transactions/transactions-overview/) follows another implementation's transaction and status records.
- [Spanner life of reads and writes](https://cloud.google.com/spanner/docs/whitepapers/life-of-reads-and-writes) explains replicated participants and distributed transactions in that service.
- [PostgreSQL prepared transactions](https://www.postgresql.org/docs/18/sql-prepare-transaction.html) shows the responsibilities left to an external transaction manager.
