# PostgreSQL logical replication plan

## Inputs and reference exposure

Read the isolated assignment and all six supplied input files. Used the current
staycurrent-breakdown skill, its staycurrent-write reference procedure and the
continuity skill. No main-repository article files, older outlines, manuscripts,
reviews, feedback or other workers' notes were read. The accepted tree stands.

Read every bounded reference part separately through
`scripts/read-writing-reference.py`, with all 19 END markers delivered:
sequences 1–6, indexes 1–7, storage 1–6. Full-text hashes reported by the reader:

- Sequences: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`
- Storage: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`

Studied finished drawings in owned IAB tabs at port 4584: Sequences figure 4
(outbox interaction and progress narration), Indexes figure 7 (the same rows,
changed index order and explicit work counts), Storage figure 5 (separate memory
and durable state, update and commit stages). Inspected screenshots and controls;
stepped Storage to the durable-commit state. No viewport/theme changes or user-tab
operations. All four owned tabs, including the neighbouring-reading tab, closed.

The reference teaching to retain is a small concrete mechanism first, a controlled
change next, and practical judgement built from what the reader can now follow.
What needs making visible here: source commit versus target visibility; initial
snapshot and subsequent changes; old-row identity; filter membership transitions;
slot progress versus retained WAL; and the effect/checkpoint crash gap. These are
understanding requirements, not prescribed drawings or prose.

Read the finished Outboxes and database-backed jobs page at
`http://127.0.0.1:4606/review/relational-rebuild/outboxes-and-jobs/` for its handoff
to native streams. Read the PostgreSQL architecture prerequisite at
`/review/relational-rebuild/postgresql/architecture/`, including its product-key,
tuple-address and symbolic-WAL distinctions. Read the beginning of the available
backup page at `/review/relational-rebuild/postgresql/backup-and-restore/` for
physical recovery versus logical reconstruction and its separate recovery branch.
These supplied factual/prerequisite context, not prose or outline models.

## Example and continuity decisions

- Base the article on an independent products copy and the already accepted P7
  price 20.00 → 22.00 replay. P3/P7/P9 stock stays 10/0/4; order 103 remains
  pending, without payment, agreed total 29.00. No assigned currency, business
  effective time, native LSN, tuple address, throughput or measured delay is added.
- Local illustrative setup: two separate databases, one publisher and one
  subscriber, initially empty target products table, matching schema/name and
  product_id primary key, publisher-only application writes. Use distinct names
  for the publication, subscription and slot; do not turn infrastructure names
  into business entities. Start with the whole products row before discussing
  column selection. A later independent projection may omit stock on the target.
- Use a product_id filter for the simple selectable subset. For membership change,
  a separately labelled products-copy variation can use price >= 21.00 with FULL
  identity: P7's existing 20.00 → 22.00 change enters the selection. Its reverse
  is an independent illustrative reversal, not a second shared business update.
  The writer may use an abstract old/new membership comparison instead if that
  avoids another scenario. Do not filter on price while pretending the primary
  key alone supplies the old price required by an UPDATE/DELETE filter.
- Missing-identity, conflicting-row and schema-error demonstrations are independent
  disposable-table branches. Do not remove a shared key or leave a divergent
  target as the next section's unexplained starting state. A sequence illustration
  needs a clearly separate identity-column demonstration: core integer order IDs
  have no declared sequence. No new orders or payments are needed.
- The change-feed example is an explicit model of consumer effects and progress,
  not a claim that a broker, search service or connector was run. If reusing
  order-103-ack, preserve the already accepted work identity and pending-order
  meaning; link to the outbox owner for receiver semantics.

Continuity pass: the plan establishes stream roles before identity and setup,
initial-copy readiness before monitoring, progress before failure repair, and
consumer outcomes before handover. No ownership or shared-business-fact change
is proposed. No new child stub is warranted: each native lifecycle outcome fits
this article, and the distinct deeper outcomes already have accepted neighbours.

## Primary-source checks

Checked PostgreSQL 18 documentation on 26 October 2026. These are documented
behaviours and intended demonstrations; no server was run by this planner.

- [Logical replication](https://www.postgresql.org/docs/18/logical-replication.html):
  selective data replication differs from physical blocks; transactional order is
  scoped to publications in one subscription. A writable subscriber permits
  conflicts. Use PostgreSQL 18 as the explicit example version, not an unqualified
  promise across releases.
- [Architecture](https://www.postgresql.org/docs/18/logical-replication-architecture.html):
  walsender decodes WAL through pgoutput; the target applies transactions locally.
  Table-copy workers snapshot, copy and catch up before handing over. Apply runs
  with replica trigger behaviour. Distinguish initial COPY trigger behaviour from
  later apply; never claim the subscriber repeats ordinary application triggers.
- [Publication](https://www.postgresql.org/docs/18/logical-replication-publication.html)
  and [ALTER TABLE replica identity](https://www.postgresql.org/docs/18/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY):
  default identity uses the primary key; UPDATE/DELETE without usable identity can
  fail at the publisher. A chosen unique index must be non-partial, non-deferrable
  and use NOT NULL columns. FULL records the old row and can make target search
  costly; a suitable target index can help. Avoid claiming every FULL apply scans.
- [Subscription](https://www.postgresql.org/docs/18/logical-replication-subscription.html)
  and [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/18/sql-createsubscription.html):
  fully qualified table names and column names match, schema is created separately,
  initial copying is normally enabled and slots are normally created automatically.
  copy_data=false is a responsibility transfer, not validation of preloaded data.
  Subscriber asynchronous commit can recover by resending source transactions;
  do not transfer that promise to a general external consumer.
- [Configuration](https://www.postgresql.org/docs/18/logical-replication-config.html)
  and [Security](https://www.postgresql.org/docs/18/logical-replication-security.html):
  logical WAL, sender/slot capacity and worker capacity need preparation. Initial
  copy requires SELECT; connection and subscription ownership have distinct
  privileges. Publications have no separate access privileges. Include enough
  preparation for a reproducible example without writing a general security guide.
- [CREATE PUBLICATION](https://www.postgresql.org/docs/18/sql-createpublication.html),
  [Row filters](https://www.postgresql.org/docs/18/logical-replication-row-filter.html)
  and [Column lists](https://www.postgresql.org/docs/18/logical-replication-col-lists.html):
  UPDATE/DELETE filters require identity-covered columns, and published columns
  must include identity. Old/new filter membership can transform UPDATE into
  INSERT/DELETE. Operation lists do not govern initial copy; TRUNCATE ignores row
  filters and column lists. Multiple publications can broaden selection; column
  lists are not a security boundary. Stored generated-column support is
  version-sensitive, so avoid an all-version claim about every added column.
- [ALTER SUBSCRIPTION](https://www.postgresql.org/docs/18/sql-altersubscription.html):
  refresh discovers newly published tables; it does not recopy previously
  subscribed tables after filter changes. SKIP omits the entire remote transaction.
- [Restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html):
  DDL, sequences and large objects are not replicated. Sequence-backed column
  values do replicate. Additive schema changes often belong on the target first;
  this is not a universal DDL-ordering rule. TRUNCATE involving references outside
  the subscription can fail. Partition mapping deserves a short limitation or
  source pointer if needed, not a second partitioning lesson.
- [Conflicts](https://www.postgresql.org/docs/18/logical-replication-conflicts.html):
  incoming writes can overwrite local changes; constraint errors can stop apply;
  missing UPDATE/DELETE targets can be skipped. Thus absence of a worker error is
  not proof of equality. Repair root cause and account for omitted facts before
  choosing a skip or resynchronisation.
- [Monitoring](https://www.postgresql.org/docs/18/logical-replication-monitoring.html),
  [Subscription statistics](https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION),
  [Table readiness](https://www.postgresql.org/docs/18/catalog-pg-subscription-rel.html)
  and [Origin progress](https://www.postgresql.org/docs/18/view-pg-replication-origin-status.html):
  inspect worker types, received positions, errors and per-table ready state.
  received_lsn is receipt evidence. Origin remote_lsn tracks the source position
  applied locally; local_lsn belongs to a different server history. Do not compare
  local and remote numeric positions as if they were one log.
- [Logical decoding concepts](https://www.postgresql.org/docs/18/logicaldecoding-explanation.html)
  and [Replication progress tracking](https://www.postgresql.org/docs/18/replication-origins.html):
  slots outlive connections and can redeliver after crash recovery. A general
  consumer must coordinate safe repetition with durable progress. Snapshot-plus-
  stream bootstrapping needs a coordinated boundary. The built-in subscriber's
  origin tracking is distinct from a remote service's business outcome.
- [Slot state](https://www.postgresql.org/docs/18/view-pg-replication-slots.html)
  and [Replication settings](https://www.postgresql.org/docs/18/runtime-config-replication.html):
  restart_lsn governs oldest required WAL; confirmed_flush_lsn records consumer
  confirmation. Inspect retention and invalidation explicitly. Retention limits
  and idle expiry operate at checkpoints and can make resumption impossible;
  they are not exact per-consumer disk quotas or automatic recovery procedures.
- [DROP SUBSCRIPTION](https://www.postgresql.org/docs/18/sql-dropsubscription.html):
  ordinary removal cleans remote slots; failed remote cleanup needs deliberate
  handling. Disabling keeps the slot. Disassociation can leave remote resources
  that must be accounted for when the publisher is reachable again.
- [Logical replication failover](https://www.postgresql.org/docs/18/logical-replication-failover.html):
  failover-enabled slots need synchronisation to the intended physical standby
  and readiness verification, including relevant finished-copy slots. The setting
  alone is insufficient. This article explains the feed's additional obligation;
  it does not operate physical promotion or prescribe application write handover.

## Handoff and unresolved work

Keep contextual links to the accepted outbox, physical replication and upgrade
owners. Physical replication is unfinished and was not read. There is no request
to change the tree. Full migration inventory, a final write barrier and application
acceptance stay with pg-upgrades; logical replication supplies the replication
component and evidence they depend on.

The fresh writer should choose final prose and illustrations from renewed
reference exposure. Before claiming observed results, arrange an owned native
publisher/subscriber fixture with the coordinator: record exact versions and
settings, initial copy and P7 catch-up, update/delete identity behaviour, selection,
one schema/conflict repair, paused retention and complete cleanup. Native failover
procedures need observed evidence if supplied as executable instructions; a
documented conceptual account must be labelled as such. No timing or resource
quantity is established here. The root owns preview, build, integration and
article review. This assignment performed no article writing, implementation,
delegation, tests, builds, server work, commits or publication.
