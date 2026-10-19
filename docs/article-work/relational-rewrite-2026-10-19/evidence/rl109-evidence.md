# RL109 evidence

Checked 19 October 2026.

## Reader decision and observed result

Snapshot-plus-tail and equal-count trap → learner/catch-up → named joint membership protocol → drain/decommission → resource budget → restart and mixed-version boundary.

Executable movement model includes update/delete/insert during copy, durable restart boundary, complete row comparison and old/new majority checks. Generic model, not native cluster movement.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl105-109-models.mjs
```

The script is the exact command/fixture record; `rl109-model-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Root Cockroach operations/upgrade continuation RL128/RL131 must carry native implementation exercise. No generic protocol is attributed universally.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [Raft paper, membership changes](https://raft.github.io/raft.pdf) supplies the joint-consensus model and the reason independently switched majorities are unsafe.
- [CockroachDB node shutdown](https://docs.cockroachlabs.com/docs/stable/node-shutdown) distinguishes draining, decommissioning and final removal; [replication layer](https://docs.cockroachlabs.com/docs/stable/architecture/replication-layer) describes replica repair and authority.
- [Citus cluster management](https://docs.citusdata.com/en/v13.0/admin_guide/cluster_management.html) explains a different shard-movement implementation and its operational constraints.
- [CockroachDB upgrade overview](https://docs.cockroachlabs.com/docs/stable/upgrade-cockroach-version) defines supported paths, mixed versions and finalisation. Its exact release procedure belongs with the chosen deployment version.
