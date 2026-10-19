# RL108 evidence

Checked 19 October 2026.

## Reader decision and observed result

Fixed voter failure-domain arithmetic → latency floor → new global quota changes dependency → degraded reads → residency scope → product contrasts.

Executable region-removal model checks 2/1,1/1/1 and2/2/1 layouts. Quorum sufficient only for declared connected group; no cloud region or latency test.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl105-109-models.mjs
```

The script is the exact command/fixture record; `rl108-model-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Native locality RL127; coordination RL106; failover authority RL98.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [CockroachDB multi-region overview](https://docs.cockroachlabs.com/docs/stable/multiregion-overview) separates locality and survival, including system-range caveats; [topology patterns](https://docs.cockroachlabs.com/docs/stable/topology-patterns) connects deployment choices to performance.
- [Spanner replication](https://cloud.google.com/spanner/docs/replication) defines its distinct replica roles and quorum responsibilities.
- [Transactions across partitions](/review/relational/rl106/) explains the extra decision when the local booking reaches a global quota.
- [Failover and fencing](/review/relational/rl98/) supplies the authority question for primary/standby deployments outside this fixed-quorum model.
