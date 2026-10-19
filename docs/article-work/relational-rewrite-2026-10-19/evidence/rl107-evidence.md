# RL107 evidence

Checked 19 October 2026.

## Reader decision and observed result

Mixed local cuts → one safe frontier → stale consistent report cannot authorise booking → logical/physical time → bounded Spanner clock wait → interface contract.

Executable versions at 10/20; P25/Q15 yields mixed state, common15 yields coherent past, Q25 permits new cut. Bounded-clock numbers invented.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl105-109-models.mjs
```

The script is the exact command/fixture record; `rl107-model-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Cockroach follower reads RL125; local apply barrier RL97; invariant write RL90.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [CockroachDB follower reads](https://docs.cockroachlabs.com/docs/stable/follower-reads) describes historical read eligibility; [transaction-layer closed timestamps and clocks](https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer) supplies the supporting promises.
- [Spanner TrueTime and external consistency](https://cloud.google.com/spanner/docs/true-time-external-consistency) explains proper timestamping and its serializable contract. [Spanner's original paper](https://research.google.com/archive/spanner-osdi2012.pdf) gives the interval and commit-wait mechanism in detail.
- [Spanner reads](https://cloud.google.com/spanner/docs/reads) defines strong and historical read interfaces and their timestamp bounds.
- [Replicas, lag and read routing](/review/relational/rl97/) connects a single-primary apply barrier with the more general snapshot problem here.
