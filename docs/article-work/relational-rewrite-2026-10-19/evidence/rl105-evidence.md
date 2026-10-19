# RL105 evidence

Checked 19 October 2026.

## Reader decision and observed result

Replicas versus shards → routed purchase layouts → global index owner → skew and one hot key → global query contract → implementation choice.

Executable routing model: one owner under tenant colocation, three under table split, global directory plus data owner. No native distribution performance claim.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl105-109-models.mjs
```

The script is the exact command/fixture record; `rl105-model-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Cross-partition decision RL106; snapshots RL107; implementation RL123.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [Citus 13 distribution-column choices](https://docs.citusdata.com/en/v13.0/sharding/data_modeling.html) develops tenant colocation, time keys and workload-based distribution.
- [CockroachDB distribution layer](https://docs.cockroachlabs.com/docs/stable/architecture/distribution-layer) explains range routing and independent table/index keys; [replication layer](https://docs.cockroachlabs.com/docs/stable/architecture/replication-layer) supplies each range's replicated authority.
- [Spanner architecture overview](https://cloud.google.com/spanner/docs/whitepapers/life-of-reads-and-writes) follows placement, reads and writes in another distributed SQL implementation.
