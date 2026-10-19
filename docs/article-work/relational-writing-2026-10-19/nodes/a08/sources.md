# a08 source and execution record

Article: Choosing a relational database. Checked 19 October 2026.

## Reference reading

Read the full Sequence diagrams, Indexes, and Storage and durability reference
articles, including their figure scenarios, captions, instructions and evidence
qualifications. Opened the live reference previews on dev4337 and inspected the
sequence waiting step, index composite comparison, and WAL path visually. Used
their progression: concrete promise, controlled comparison, observation, consequence.

## Primary documentation

- PostgreSQL 18 [Connections and Authentication](https://www.postgresql.org/docs/18/runtime-config-connection.html):
  max_connections and reserved connection budgets. The candidate values were also
  read back from the native instance.
- PostgreSQL 18 [WAL configuration](https://www.postgresql.org/docs/18/runtime-config-wal.html):
  fsync, full_page_writes, synchronous_commit and the dependency on configured
  synchronous standbys. An empty synchronous_standby_names does not establish a
  remote durable copy. Settings are documented evidence, not a power-loss test.
- PostgreSQL 18 [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  read committed and guarded UPDATE re-evaluation against a concurrent update.
- PostgreSQL 18 [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)
  and [WITH queries](https://www.postgresql.org/docs/18/queries-with.html): the
  schema and data-modifying CTE used for the bounded reservation acceptance case.
- PostgreSQL 18 [SQL dump](https://www.postgresql.org/docs/18/backup-dump.html):
  logical export and re-import. The observed case is same-engine, same-host,
  tiny-data export and re-import. No physical recovery or PITR claim follows.
- [PostgreSQL Licence](https://www.postgresql.org/about/licence/): permissive
  engine terms; no product price or support entitlement inferred.
- SQLite [Appropriate uses](https://www.sqlite.org/whentouse.html) and
  [Write-ahead logging](https://www.sqlite.org/wal.html): embedded boundary,
  one writer and same-host WAL access. No loaded SQLite library/version was tested.
- RDS [Multi-AZ DB instance deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html):
  synchronous standby in another zone, no standby read service for this specific
  deployment type. Does not claim the same for Multi-AZ DB clusters.
- RDS [rds_superuser](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Roles.rds_superuser.html):
  restricted elevated role rather than engine superuser/host OS access, only
  supported extensions. No invented selected region, instance class or tier.
- RDS [PostgreSQL upgrades](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html):
  selected workflow and deployment type matter; Multi-AZ DB instance upgrade
  unavailability. The article does not promise a particular upgrade duration.
- CockroachDB [26.3 Multi-region overview](https://www.cockroachlabs.com/docs/v26.3/multiregion-overview):
  locality and survival controls are different choices. No executed deployment,
  compatibility, performance, price, licence or acceptance claim. The conditional
  child owns exact topology/tier/licence depth.

## Observed native candidate

Run: `src/components/relational-next/a08/verify.py`.
Retained result: `src/components/relational-next/a08/observed.json`.

PostgreSQL 18.6 (Homebrew), native Apple silicon, psql 18.6/libpq directly over
IPv4 loopback. Shared orchestrator-owned disposable primary at 127.0.0.1:57319.
No TLS, pooler, application driver or ORM. Own databases were rel3_a08_run1 and
rel3_a08_restore1. Both were dropped after the run; the shared server was neither
reconfigured, restarted nor stopped. No session overrides were made.

Read back: read committed; fsync/full_page_writes/synchronous_commit on;
synchronous_standby_names empty; 12 total connections, 3 superuser reserved,
0 other reserved; statement_timeout 30 s, lock_timeout 5 s,
idle_in_transaction_session_timeout 60 s. Runtime.md owns the other server limits.

Observed gates:

1. Negative stock, orphan product and null amount rejected with expected SQLSTATEs.
2. First claim accepted; repeat identity rejected with 23505; statement rolled
   its stock change back, leaving six units.
3. Four concurrently launched persistent psql sessions, each executing 25 distinct
   guarded claims: final stock 0, 7 reservations including first claim, total 140.00.
   This is final-state invariant evidence, not a deterministic lock-wait schedule
   and not a measured throughput/capacity/latency result.
4. pg_dump custom format/pg_restore into fresh database: inventory and aggregates,
   plus all seven reservation rows in explicit request order, matched.

The original hard production gates remain untested, with named owners in the
article. No host failure, process crash, power loss, standby, network partition,
restore onto another host, point-in-time recovery, full-volume workload, slow-client
test, production role, TLS, driver, pool mode or supplier price was exercised.

## Illustrative material

The shop, its forecast quantities and budgets, all diagram paths and candidate
screening scenarios are illustrative. Cost allowances are invented in GBP/month,
not supplier prices: self = 180 + 80 + 80h; managed = 360 + 100 + 4×80 = 780;
break-even self hours = 6.5. No real commercial commitment is recommended from
these figures. The article explicitly calls for a dated quote of the passing
deployment and a measured workload before cost acceptance.

## Scope choices

Complete first case lives here: requirements → relational fit → boundary rejection
→ PostgreSQL record → bounded SQL/concurrency/export evaluation → adopt prototype,
reject measured production topology, defer production service adoption with owners.
It intentionally does not manufacture a passing production deployment. SQLite and
CockroachDB are alternative follow-ups, not mandatory reading. General transaction,
driver, workload, operation and cutover depth stays in its existing family owners.

## Root repair, 20 October 2026

Qualified the claim-statement outcome after b06 practitioner finding a08-P1. With stock exhausted, a repeated request gives the INSERT no input and returns `INSERT 0 0`, without a uniqueness check; a claimed row that collides does raise 23505 and rolls back its decrement. Existing-request argument/outcome resolution is required before response classification. The independent b06 report retains that additional native observation. SQL, models, retained acceptance JSON, evidence limits and adoption decision are unchanged.
