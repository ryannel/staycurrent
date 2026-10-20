# a31 source and execution record

Checked 20 October 2026. Scope: a controlled PostgreSQL-to-PostgreSQL order database move; complete fenced-copy route and built-in logical initial-copy/capture route. No engine-pair catalogue or curriculum changes.

## Primary contracts

| Source | Used for |
| --- | --- |
| [PostgreSQL 18 pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html) | Consistent single-database logical export, custom archives, schema-only export, omission of ownership/ACLs, sequence data and scope boundaries. |
| [pg_restore](https://www.postgresql.org/docs/18/app-pgrestore.html) | Custom archive load, error handling, single-transaction small-fixture choice; cannot combine single transaction and parallel jobs. |
| [pg_dumpall](https://www.postgresql.org/docs/18/app-pg-dumpall.html) | Cluster globals such as roles/tablespaces are separate from a single database dump. |
| [Logical replication architecture](https://www.postgresql.org/docs/18/logical-replication-architecture.html) | Per-table initial snapshot/copy and synchronisation with main apply; source transaction order; copy-worker retries; replica trigger semantics. The common-S figure is explicitly conceptual, not a claim of one PostgreSQL database-wide initial-copy snapshot. |
| [Publication](https://www.postgresql.org/docs/18/logical-replication-publication.html) | Operation selection, scope and replica identity for updates/deletes, FULL fallback restrictions. |
| [Logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) | No DDL, sequence-state or large-object transfer; partitions and datatype restrictions. |
| [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/18/sql-createsubscription.html) | copy_data, streaming and synchronous_commit options, defaults and outside-transaction slot creation. Fixture uses separate clusters; the same-cluster slot-creation hang restriction is avoided rather than hidden. |
| [Configuration](https://www.postgresql.org/docs/18/logical-replication-config.html) | logical WAL, slots, senders and subscriber worker capacity. |
| [Replication security](https://www.postgresql.org/docs/18/logical-replication-security.html) | Source replication/login/select permissions; subscriber ownership/role requirements. Local superuser/trust exercise does not claim production privilege acceptance. |
| [pg_subscription_rel](https://www.postgresql.org/docs/18/catalog-pg-subscription-rel.html) | Explicit expected three-table manifest plus r state; absence from this catalogue cannot count as readiness. |
| [ALTER SUBSCRIPTION](https://www.postgresql.org/docs/18/sql-altersubscription.html) | Disable/enable semantics and skipped-transaction risk. |
| [Logical monitoring](https://www.postgresql.org/docs/18/logical-replication-monitoring.html) | Worker inspection separate from table readiness and application fact visibility. |
| [ALTER ROLE](https://www.postgresql.org/docs/18/sql-alterrole.html), [privileges](https://www.postgresql.org/docs/18/ddl-priv.html) | Fixture NOLOGIN/revoke fence; explicitly incomplete for superusers, inherited/alternate privileges and external write paths. Existing-session behaviour rehearsed. |
| [Sequence functions](https://www.postgresql.org/docs/18/functions-sequence.html) | setval(value,is_called), next generated ID, gaps and nontransactional allocation/state changes. Exact-state transfer is bounded to same ascending increment-one cache-one fixture with all allocators fenced. |
| [Collation support](https://www.postgresql.org/docs/18/collation.html) | Comparison contract and provider/version dependence in compatibility manifest. |
| [DROP SUBSCRIPTION](https://www.postgresql.org/docs/18/sql-dropsubscription.html) | Normal remote slot cleanup; unreachable-publisher failure and remote resource retention after disassociation. |

All URLs were opened with the web tool during writing. Article links cite these contracts near their use. The runbook’s final-marker rule is a derived protocol under stated prerequisites, not a PostgreSQL automatic migration guarantee.

## Native evidence

- Worksheet: `src/components/relational-next/a31/rehearse.py`, Python 3 standard library; portable `--pg-bin` and exclusive `--evidence` arguments. Download uses `?url&no-inline`.
- Exact run: `python3 src/components/relational-next/a31/rehearse.py --pg-bin /opt/homebrew/Cellar/postgresql@18/18.6_1/bin --evidence docs/article-work/relational-writing-2026-10-19/nodes/a31/evidence/native-run1.json`.
- [Retained evidence](evidence/native-run1.json): all native command arguments, SQL input, stdout, stderr, exit status, durations, final exact row comparisons and server logs.
- PostgreSQL 18.6 Homebrew, Python 3.14.5, Apple-silicon macOS. Two fresh initdb clusters in one freshly allocated temporary directory, independent unused loopback ports, role drill; C/UTF8/UTC. Local trust is fixture-only. fsync, synchronous_commit, full_page_writes on. Source logical WAL. Eight-second statement limit, two-second lock limit; command deadlines and 12-second condition deadlines. No existing service was contacted or reconfigured. No temporary dependency was installed.

### Observed

1. Paused route: source pause_app fenced; final marker committed; full custom dump restored into empty destination using single transaction. Exact 2,000 order rows, 2,000 item rows and marker matched. A repeated restore was refused with `relation "items" already exists`. Destination role generated 2101, showing full-dump sequence transfer.
2. Online route: schema-only transfer, one unfiltered publication/subscription covering orders/items/move_boundary. 2,000 initial orders and lines. Immediate source transaction updated order 101 and its line, deleted 102 with cascade, inserted a new order and line. All three relations reached r; updated state appeared. The run does not establish exactly which initial-copy worker was active when that transaction committed.
3. Already connected move_app transaction survived NOLOGIN and committed old-pool. Second in-flight transaction had inserted uncommitted work before sleep; NOLOGIN plus revoked table DML/sequence usage and backend termination left that order absent. New move_app connection refused. This proves the fixture role fence only.
4. Apply disabled; zero active apply PIDs observed; source sequence advanced to 5000 and online-final marker committed. Destination marker absent, a failed admission gate. Re-enable delivered marker; all three relations ready. Disabled again and waited for apply quiescence before final equality and destination writes.
5. Exact stable comparison matched orders, items and marker. Deliberate order-103 total 999 retained equal row counts but failed value equality. After correcting it, equality and total/item invariant passed.
6. Subscriber allocator remained `101|f`. Attempted generated insert failed with SQLSTATE 23505. Source state `5000|t` copied explicitly; resulting state matched. No claim that max(id) suffices.
7. Fresh application connection committed destination-only order 5001 and its line. Fresh app read gave paid/100. Source had no such order. Negative total rejected as 23514. Reverse transfer not implemented.
8. Dropped subscription; source slot absent. Both clusters stopped cleanly (pg_ctl status exit 3), server logs retained, own temporary directory removed. No database, server process, driver dependency or data directory from this article remains.

### Timing boundaries and limits

Native timings are deliberately not promoted as service interruption measurements. Paused interval 0.223597 s starts immediately before export and ends after restore, comparison, deliberate repeated-restore failure and destination generated insert; it excludes preparation and the preceding source fence. Initial-sync interval 0.222522 s starts before subscription creation and includes the immediate source transaction and readiness checks. Final-drill interval 0.794045 s starts before the final fixture fence and includes termination, disable/marker/re-enable, equality checks, deliberately injected failures and destination application checks. Other workers used the same machine, so no production or isolated throughput inference is made.

Unperformed acceptance: production volume, sustained real workload, full administrative/infrastructure fencing, physical power loss, remote networks, pool/DNS/proxy behaviour, hosted tooling, extension/type/collation conversion, large objects, multiple subscriptions, prepared transactions, sequence-cache handoff, retention exhaustion and reverse synchronisation. Those remain explicit actual-deployment gates.

## Teaching and boundary references

Read all three fixed article sources in full: Sequence diagrams, Indexes, Storage and durability; also read their figure components. Read actual a06, a29, a30, a38 and a39. The fragment reuses a06 compatibility and lifecycle decisions, a29 physical schema execution, a30 guarded transformations, a38 replica retention/authority operation and a39 restore-readiness evidence without reproducing their procedures. a22 transport mechanics informed the local figure controls.
