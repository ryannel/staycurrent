# Inside CockroachDB: planning notes

## Reference exposure and intended teaching

Read the six supplied inputs. Read all bounded reference parts separately with
`scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7 and storage 1–6;
every END marker was delivered. Studied the finished sequence booking drawing,
the clustered-table secondary lookup and the storage WAL lanes in owned IAB tabs
at port 4584. Also read the complete rendered Sharding and distributed SQL and
Regional placement and survival drafts at port 4606. No old body, outline,
review or worker notes were consulted.

The comparable teaching is the references' concrete lookup, secondary lookup,
changing one part of a model and separating durable storage from visible state.
The writer should establish the row/key/range/replica distinctions before using
them to explain the hotspot. Make those relationships and the effect of a split
visible; this plan leaves drawing form, interaction and prose development open.
The final range observation should let the reader recognise the model in real
output without turning this parent into a diagnostic runbook.

## Version and deployment scope

Recommend **CockroachDB v26.2.8**, official image
`cockroachdb/cockroach:v26.2.8`, for later owned evidence. The
[versioned release notes](https://docs.cockroachlabs.com/docs/releases/v26.2#v2628)
list its release on 16 October 2026 and the exact image. It gives the writer a
recent, fixed patch within the documentation line checked here; this is not a
claim that it is the newest CockroachDB release. Root owns procurement and runtime.

Describe the ordinary self-hosted SQL/KV/Pebble deployment being examined. Current
[vendor architecture material](https://www.cockroachlabs.com/blog/continuum-architecture/)
also describes Continuum's Plenum disaggregated storage and virtual clusters.
Do not generalise a local-store drawing to every hosted offering. Detailed cloud
deployment comparison is unnecessary to this article's accepted outcome.

## Primary sources checked on 25 October 2026

- [SQL layer, v26.2](https://docs.cockroachlabs.com/docs/v26.2/architecture/sql-layer):
  gateway, PostgreSQL wire protocol, SQL-to-KV translation and physical execution.
  A gateway can route to data elsewhere. Connection compatibility does not
  establish identical PostgreSQL implementation or application semantics.
- [Distribution layer, v26.2](https://docs.cockroachlabs.com/docs/v26.2/architecture/distribution-layer):
  ordered keyspace, table/index encoding, range descriptors, cached metadata,
  routing and boundary changes. A split initially creates another Raft group on
  the same members; splitting itself does not relocate its bytes. Avoid copied
  numerical size defaults: they are unnecessary and some rendered documentation
  values were absent from the extracted text.
- [Column families, v26.2](https://docs.cockroachlabs.com/docs/v26.2/column-families)
  and [Indexes, v26.2](https://docs.cockroachlabs.com/docs/v26.2/indexes): columns
  default to one family; secondary entries are additional KV data. `STORING`
  can avoid a primary-index lookup. Check the exact created schema and implicit
  columns before showing native key details; do not copy the obsolete one-key-per-column
  encoding from historical blog examples.
- [Replication layer, v26.2](https://docs.cockroachlabs.com/docs/v26.2/architecture/replication-layer):
  one Raft group per range, voters versus non-voters, leases, transfer and
  rebalancing. **Leader leases colocate leader and leaseholder except briefly
  during transfers.** Separate their responsibilities without depicting the older
  epoch-lease arrangement as the current normal case. No failover-duration claim
  or vendor benchmark is required.
- [Storage layer, v26.2](https://docs.cockroachlabs.com/docs/v26.2/architecture/storage-layer):
  store, Pebble, memtable/WAL, immutable sorted files, compaction and retained
  versions. Raft's per-range replicated ordering and the storage engine's local
  WAL answer different recovery questions. A logical range is not an SST file;
  avoid inventing file placement, write amplification or storage timings.
- [Transaction layer, v26.2](https://docs.cockroachlabs.com/docs/v26.2/architecture/transaction-layer):
  transactions spanning ranges, provisional work, version timestamps and read
  qualification. Parent treatment stops at why transaction coordination and safe
  read history are needed. Intents, Parallel Commits, retry paths, isolation-level
  choice, closed timestamps and retention procedures belong to existing children.
- [Load-based splitting, v26.2](https://docs.cockroachlabs.com/docs/v26.2/load-based-splitting)
  and [Understand hotspots, v26.2](https://docs.cockroachlabs.com/docs/v26.2/understand-hotspots):
  useful split points depend on the demand distribution; one hot point and an
  advancing index edge can remain concentrated. Distinguish row count, key count
  and request load. Leave thresholds, hash-sharded-index selection and native
  hotspot diagnosis to performance.
- [SHOW RANGES, v26.2](https://docs.cockroachlabs.com/docs/v26.2/show-ranges),
  [SHOW RANGE FOR ROW](https://docs.cockroachlabs.com/docs/v26.2/show-range-for-row)
  and [SHOW INDEX](https://docs.cockroachlabs.com/docs/v26.2/show-index): suitable
  later evidence for bounds, implicit index columns, voter identities and
  leaseholder. `DETAILS` adds work; a placement observation is time-specific.
- [Online schema changes, v26.2](https://docs.cockroachlabs.com/docs/v26.2/online-schema-changes)
  and [Upgrading self-hosted CockroachDB](https://docs.cockroachlabs.com/docs/v26.2/upgrade-cockroach-version):
  background schema work consumes resources; a major-version binary rollout and
  finalisation are separate. The child stubs retain their respective working
  procedures. Avoid treating “online” as an absence of load or compatibility cost.

## Example decisions and continuity pass

Use the existing post-103 shop rows for lookups. An optional local secondary
history index on `(customer_id, placed_at DESC, order_id DESC)` reuses the agreed
history-query shape; it adds no business fields or rows. Inspect existing automatic
foreign-key indexes before calling any plain customer index new. A secondary
lookup may cross ranges; neither these small tables nor adding an index proves
that it actually does in the owned runtime.

Reuse the independent P7 catalogue-price change 20.00→22.00 for replica and
version explanations: stock remains 10/0/4, order 103 stays pending with no
payment and agreed total 29.00. Rewind separately to before purchase 103 only
when discussing the purchase and shared stock authority. No new orders, payments,
inventory allowances or native timestamps are proposed.

Use symbolic range/node labels and explicitly illustrative boundaries and load
patterns. The tiny shop does not naturally demonstrate automatic splitting.
Do not import the prerequisite's illustrative customer shards A/B/C and product
shard P as CockroachDB's actual layout. Table/index keys determine native ranges;
foreign keys alone do not colocate rows across tables. A manual split, if later
chosen, must be labelled manual rather than an observed automatic response.

Continuity pass: the outline builds keys before ranges, ranges before replicated
roles, and local version storage before read qualification. Range agreement is
never presented as the whole purchase commit. A replicated provisional write is
not automatically visible business data. The same stock decision remains shared
after any split, lease transfer or cluster expansion.

## Boundaries and remaining evidence

Retain all nine accepted child outcomes and titles; no ownership or shared-fact
changes are proposed. Their stubs establish why the deeper work is needed, without
requesting that work in this parent. The accepted recovery child's booking
scenario remains its commission; this outline does not invent its missing facts.

Later owned evidence should establish exact binary/cluster version, actual DDL
and implicit indexes, one row's range and a small annotated range listing. Native
identifiers and placement must come from that evidence. No measurements, SQL
results, automatic split, failover behaviour or scaling improvement have been
observed by this planner. Root remains the sole preview/build/integration owner;
there was no writing, implementation, review, build, provisioning or publication.
