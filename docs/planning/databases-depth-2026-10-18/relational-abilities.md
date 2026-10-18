# Relational databases: abilities before pages

18 October 2026. Independent derivation for the field-depth planning commission.
This file was persisted before assigning units to pages. No existing article,
inventory, outline, coverage map or earlier proposal was consulted. The only
project reading was the commission, the planning and style skills, and the
authoring reference on depth and experiments. That reference contains examples
from earlier work; none was treated as a required article or product choice.

## Audience and the finish line

The reader can program, understands requests and persistent data, and can read a
small table. They need not know SQL, database internals or cluster operation.
An expert practitioner can design and defend a relational service, query it
correctly, diagnose its behaviour, change it while it is serving traffic, and
recover it when a machine or a person fails. They recognise when their database
cannot meet the requirement. They can use one conventional server product in
depth and reason about a genuinely distributed relational implementation.

Expertise here does not mean implementing an optimiser, proving a consensus
algorithm, administering every commercial product, or memorising SQL grammar.
It does mean knowing which of those mechanisms determines the next engineering
choice and obtaining the product evidence needed to make it.

The running service sells reserved workshop places. It has tenants, customers,
workshops, dated sessions, seats, reservations, orders, order lines and payments.
`tenant_id`, `session_id`, `reservation_id` and `order_id` remain stable across
examples. A session has a capacity; a held seat expires; one payment may be
retried; an accepted order must remain recoverable. Dates, monetary amounts and
access rules matter. Growth introduces skewed tenants, seasonal demand, a second
region and archival reporting. This provides real invariants without turning
every lesson into commerce architecture.

## From work to teachable units

Identifiers are new to this derivation. Each row is a unit, not a page. A named
understanding leads to something the reader can actually do. “Practical” means
execution against the real engine when the property depends on that engine;
models may expose states but cannot establish its durability or network behaviour.

### Decide what the database must do

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL01 | Choose a relational boundary → relations describe facts; constraints and transactions protect shared facts | Explain rows, relations, keys, declarative queries and a transaction in one worked reservation | A flexible payload fits in a row but is not thereby well modelled; SQL does not imply one machine |
| RL02 | State requirements → latency distribution, read/write mix, size, skew, growth and recovery objectives determine cost | Build a workload and failure budget from an example trace; worked design exercise | A low average hides a hot session and a strict tail target |
| RL03 | Select an engine and service arrangement → embedded/server/distributed, operational ownership, compatibility and economics differ | Conditional comparison and a proof checklist; small evidence-backed cases | Managed hosting does not transfer application correctness or restore acceptance; a wire protocol does not establish semantic compatibility |

### Represent facts and enforce their meaning

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL04 | Model entities and relationships → identity, cardinality, independent facts and join tables | Derive a small schema from reservation rules; worked cases | Shared customer details are copied into many orders and then disagree |
| RL05 | Choose keys → logical identity, uniqueness, primary/foreign keys and physical consequences are separate | Compare natural, surrogate, composite and generated identifiers; worked cases | A globally unique random key still scatters writes or enlarges secondary indexes |
| RL06 | Remove update anomalies → functional dependencies explain which fact belongs where | Decompose a relation, then deliberately retain a derived value with a repair contract; worked cases | Denormalisation speeds reading but one failed update leaves contradictory facts |
| RL07 | Choose representations → precision, range, units, time zones, collation and representation affect equality and order | Type boundary cases with exact values and executable queries | Money rounds unexpectedly; a repeated local time names two instants; text equality changes across collations |
| RL08 | Handle missingness → unknown, absent and empty have distinct meanings | NULL truth tables inside joins, predicates and uniqueness; short executable cases | `NOT IN` with a NULL excludes rows the reader expected |
| RL09 | Place invariants in the database → declarative constraints protect all writers but have scope limits | Translate rules into NOT NULL, CHECK, UNIQUE, foreign keys and transaction checks | Two individually valid inserts exceed a cross-row capacity; deferred checks fail at commit |
| RL10 | Keep history and delete safely → current truth, business history, retention and referential deletion differ | Compare current rows, immutable events and dated facts; worked retention cases | A corrected price must not change an old invoice; deletion must handle references and retained backups |
| RL11 | Isolate tenants → identity and reference boundaries must hold under every access path | Trace tenant identifiers through keys, foreign keys, queries and authorisation | A valid order references another tenant's customer |

### Ask for the right answer

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL12 | Express a relational question → filtering, projection, joins and duplicate multiplicity compose | Construct SELECTs from expected result relations, with a compact SQL primer | SQL returns bags; an apparently harmless join duplicates an order |
| RL13 | Preserve result grain → one-to-many joins and aggregation change what a row counts | Follow order and payment fan-out through joins, EXISTS, pre-aggregation and outer joins | Joining two child collections doubles revenue |
| RL14 | Express absence and exclusion → anti-joins and NULL interact | Derive unbooked sessions and customers without paid orders; executable cases | A right-table predicate accidentally turns an outer join into an inner join |
| RL15 | Summarise and compare rows → grouping and windows preserve different grains | Work through totals, running totals, ties and top-per-group; executable cases | A default window frame changes the result when dates tie |
| RL16 | Page and export predictably → total ordering, cursors and snapshot boundaries matter | Offset versus keyset pagination and a changing export; practical cases | Concurrent inserts skip or repeat results; a cursor lacks a tie-breaker |
| RL17 | Change many rows correctly → atomic expressions, conditional updates, upserts and bulk loading have different contracts | Reserve capacity and import a file; inspect affected rows and rejected records | Read-then-write loses an update; an upsert silently overwrites newer information |
| RL18 | Cross the application boundary safely → parameter binding, transaction scope and returned errors are part of query meaning | Trace one request through driver/ORM SQL and result handling | An ORM generates N+1 queries or an injected sort expression; a lazy iterator outlives its transaction |

### Make work proportional to the question

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL19 | Design access paths → ordered indexes reduce search but consume space and write work | Traverse a small B-tree; vary composite order, range bounds, covering and selectivity | An index exists but the leading predicate is absent or the match touches most rows |
| RL20 | Match unusual predicates → expressions, partial predicates and non-ordered access need different structures | Compare ordered, inverted and coarse-range access on one workload; mechanism models | A function or incompatible operator prevents the expected access; an index cannot make an unselective query cheap |
| RL21 | Understand execution cost → scans, joins, sorts, grouping and materialisation move and retain rows | Follow row counts and memory through alternative physical plans | A join that is cheap for ten rows spills when it receives a million |
| RL22 | Diagnose a bad plan → estimates, skew, correlation, parameters and cached choices can diverge from reality | Find the first estimate error and test statistics/query/index remedies | A typical tenant gets a good plan while a large tenant gets a disastrous reused plan |
| RL23 | Measure without fooling oneself → cache state, concurrency, data distribution and measurement overhead alter results | Design a reproducible workload and compare latency, throughput and resource use | One warm microbenchmark suggests an index helps, but concurrent writes lose throughput |
| RL24 | Partition for a reason → pruning, partition keys, local/global enforcement and lifecycle operations interact | Split dated sessions, count partitions visited and follow a uniqueness rule | A query omits the partition key; adding partitions changes planning and maintenance cost |

### Preserve invariants under concurrency

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL25 | Define a transaction → atomic state change, commit, rollback and visibility are different promises | Follow a reservation and payment record through commit/abort; timeline model | A rolled-back identifier is not necessarily reusable; an external charge cannot be rolled back by SQL |
| RL26 | Choose isolation from an invariant → statement snapshots, transaction snapshots and serial execution permit different histories | Run lost-update, write-skew and predicate-insert histories, then choose a protection | Both transactions see one seat remaining and jointly violate capacity |
| RL27 | Use locks deliberately → locks protect resources, order creates waits, and predicates may cover missing rows | Derive locking or atomic-update designs and a deadlock cycle; multi-client exercise | Locking existing rows does not necessarily protect a row that has not been inserted |
| RL28 | Understand concurrent reads → versions and visibility permit old reads, but retained history has a lifecycle | Follow versions through readers, writers and reclamation; mechanism model | A long reader prevents cleanup even after the writer commits |
| RL29 | Retry safely → abort, timeout and unknown commit outcome require different responses | Build a bounded retry loop with stable operation identity and result lookup | A connection drops after commit; a blind retry creates a second purchase |
| RL30 | Coordinate work beyond the database → durable intent and replay are different from atomic delivery | Commit order plus outbox row, crash a relay, and deduplicate application effects | A message sends twice; a consumer changes business behaviour between deliveries |
| RL31 | Use database-backed work queues → claiming, lease expiry and fairness interact with transactions | Competing workers claim and recover jobs; worked multi-client histories | A worker resumes after its lease expires and overlaps its replacement |

### Explain persistence and repair

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL32 | Explain a durable write → dirty pages, write-ahead records, flush order and checkpoints separate recovery from acknowledgement | Crash a small page/log model at each ordering boundary | Acknowledged data survives a process crash but not a lost durability domain under weaker settings |
| RL33 | Account for storage growth → heap/clustered layouts, version placement, large values and free space change read/write amplification | Compare update paths and reclaimable versus physically returned space | A deleted table's bytes do not immediately return to the filesystem |
| RL34 | Choose backup and restore → logical/physical copies, log chains and consistency define recoverable states | Restore to a target and reconcile later valid writes; recovery rehearsal design | Restoring before a bad delete also loses a later valid order |
| RL35 | Prove recoverability → completeness, permissions, keys, integrity and restore time determine usable backups | Design and accept a restore drill against explicit RPO/RTO | The archive exists but is missing a segment or the decryption key |
| RL36 | Add replicas for a stated promise → shipping, acknowledgement and replay positions differ | Follow write, durable copy, replay and client read on a timeline | A replica is durable but has not replayed the write; read-your-writes fails |
| RL37 | Fail over without two writers → detection is uncertain, promotion needs authority and old writers need fencing | Partition primary and standby, promote, then reconnect the old primary | A health check sees a dead primary that can still accept other clients |
| RL38 | Move changes to another system → initial snapshot, change position, ordering, schema and replay determine correctness | Snapshot-plus-stream handover and consumer restart; mechanism and integration exercise | A row changes during the snapshot; a consumer falls behind retention |

### Change and operate a live service

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL39 | Evolve schemas without breaking callers → application versions overlap and DDL can block or rewrite | Expand/backfill/validate/contract across old and new clients | An apparently tiny ALTER waits behind a long query and blocks later requests |
| RL40 | Backfill and import completely → progress, idempotence, concurrent writers and validation require a proof | Restart batched work and establish a completion watermark | A short batch means rows were temporarily ineligible, not that the job finished |
| RL41 | Move databases or versions → compatibility, copied data, final catch-up and rollback windows are separate | Rehearse a cutover with changed clients and both reversible and irreversible stages | Old code cannot read new data; rollback after new writes loses information |
| RL42 | Bound resource use → connections, active transactions, queueing and memory per operation determine overload | Follow request load through pool and server; choose admission and timeout budgets | Increasing pool size increases contention and pushes the database into collapse |
| RL43 | Diagnose an incident → symptoms must separate waiting, CPU work, I/O, replication and storage pressure | Work a branching incident from evidence to a reversible intervention | Cancelling a blocking session rolls back useful work and still does not remove its root cause |
| RL44 | Budget capacity → indexes, logs, retained versions, replicas and backup throughput consume different resources | Estimate capacity from measured rates and headroom, then load-test the weakest limit | Disk fills because of retained logs rather than live tables |
| RL45 | Protect data → authentication, roles, object ownership, query safety and transport boundaries differ | Derive least-privilege application/migration/backup roles and test denied actions | The connection is encrypted but the app role can drop tables or bypass tenant protection |
| RL46 | Operate with a provider → shared responsibility, limits, maintenance windows, backup access and exit paths vary | Apply an acceptance checklist to self-hosted and managed deployments | A failover changes endpoint behaviour; service limits prevent a required extension or restore |

### Keep relational guarantees when the data is distributed

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL47 | Decide whether to distribute writes → scale-up, replicas, application sharding and distributed SQL solve different limits | Compare a hot record, a capacity limit and a regional availability requirement | More shards cannot parallelise a single conflicting seat counter |
| RL48 | Choose partition keys → routing, colocation, skew, secondary indexes and repartitioning determine network work | Route tenant orders, then change tenant size and join location | One tenant becomes most of the dataset; a secondary lookup fans out |
| RL49 | Preserve a transaction across partitions → replicated partitions and multi-partition commit solve different problems | Trace intent, coordination, commit decision and abandoned transaction resolution | One shard quorum survives while another is unreachable; an atomic transaction cannot finish |
| RL50 | Choose read and time semantics → clocks, uncertainty, closed read times and snapshots affect freshness and invariants | Contrast a fresh quorum/leader read with a deliberately historical read | A low-latency historical read cannot safely approve a current seat reservation |
| RL51 | Place data across regions → read locality, write coordination and survival goals impose latency/failure costs | Count coordination paths for regional and global data before and after a region loss | A region-local write is fast until a cross-region invariant enters its transaction |
| RL52 | Operate redistribution and upgrades → rebalancing consumes foreground capacity; versions and schema coexist | Observe a node addition, node loss and staged upgrade in a real cluster | Adding nodes worsens tail latency while ranges move; surviving machines do not guarantee surviving quorum |

### Follow one conventional server implementation all the way through

PostgreSQL is the provisional representative because its inspectable storage,
versioning, planner, extensibility and operational interfaces let the reader connect
the general decisions. This is a reason to select it, not evidence that another
product works the same way. The initial branch must supply the following units.

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL53 | Read PostgreSQL's process and storage boundaries → sessions, backends, buffers, files, heap tuples and indexes connect | Inspect a native server and a page/tuple model; practical plus mechanism | Many connections consume resources before they do useful query work |
| RL54 | Predict PostgreSQL version visibility → tuple metadata, snapshots, updates and HOT determine work | Trace the same update with and without indexed-column changes; inspect native evidence | An added index prevents the formerly cheap update path |
| RL55 | Maintain PostgreSQL → vacuum, visibility maps, freeze horizons and blockers govern reuse and safety | Reproduce retained versions; inspect autovacuum progress and transaction age | A slot or old transaction pins cleanup; emergency freezing cannot be postponed indefinitely |
| RL56 | Choose PostgreSQL index methods → B-tree, GIN, GiST and BRIN have implementation-specific capabilities | Query and update the same seeded data through justified candidate methods | A GIN index helps containment reads but changes write/maintenance costs; BRIN depends on physical correlation |
| RL57 | Diagnose PostgreSQL plans → EXPLAIN fields, buffers, statistics and prepared plans expose specific evidence | Compare estimates/actual rows and test ANALYZE, extended statistics and plan modes | A prepared query changes from custom to generic and regresses for a skewed value |
| RL58 | Store specialised PostgreSQL data intentionally → JSONB, arrays, ranges and extensions have representations and operator contracts | Trace a flexible payload into predicates, indexes and updates; compare normalised columns | One small logical JSON field change still updates a stored value; extension availability differs by host |
| RL59 | Set PostgreSQL durability → WAL records, flush settings, checkpoint/recovery work and storage assumptions connect | Native restart drill plus explanatory log timeline; settings with failure-domain conditions | Faster acknowledgement changes what a crash may lose; a checkpoint spike changes latency |
| RL60 | Restore PostgreSQL → base backup, WAL archive, recovery target and timelines form one recoverable chain | Actual isolated restore, missing-WAL failure and reconciliation acceptance | The target precedes useful commits; a promoted timeline needs the right history and WAL |
| RL61 | Replicate and promote PostgreSQL physically → sender/receiver/replay positions, slots and synchronous choices differ | Two-server lag/promotion drill with fencing handled explicitly | A disconnected slot grows WAL; synchronous policy stalls writes when required standbys disappear |
| RL62 | Replicate PostgreSQL logically → publications, replica identity, schema coordination and subscriber state matter | Initial copy, update/delete, schema change and interrupted subscriber exercise | DDL and sequence state do not automatically make a subscriber a ready replacement |
| RL63 | Change PostgreSQL live → lock modes, concurrent index builds, validation and backfill mechanisms impose exact limits | Native blocked-DDL and resumable change exercise | A concurrent build leaves an invalid index; a default or type change has version-specific rewrite behaviour |
| RL64 | Operate PostgreSQL → server views, logs, workload statistics, memory and pool modes link evidence to action | Diagnose blocker, spill and connection pressure; validate intervention | A transaction-pooling mode breaks a session assumption; monitoring query text exposes sensitive values |
| RL65 | Secure PostgreSQL → roles/ownership, privileges, search paths and row policies have exact bypass rules | Test app, migration and tenant roles including a hostile query path | An owner or privileged role defeats a policy; an unsafe search path changes a privileged function's meaning |
| RL66 | Upgrade PostgreSQL safely → binary format, extensions, collations and logical migration constrain paths | Choose and rehearse dump/restore, pg_upgrade or logical cutover | A successful binary upgrade still needs extension and application validation; changed collation invalidates assumptions |

### Follow one distributed relational implementation through failure

CockroachDB is the provisional distributed representative: it exposes partitioned
relational data, replicated ranges, transaction retries and regional placement in
one system. Its operational/licensing requirements and changing deployment
architecture need a version-pinned feasibility check before commissioning. This
is deliberately a second implementation branch, not a paragraph claiming that
PostgreSQL becomes distributed when replicas are added.

| ID | Task and necessary understanding | Teachable unit and form | Awkward case or limit |
| --- | --- | --- | --- |
| RL67 | Map CockroachDB SQL to storage → primary/secondary index keys, ranges, replicas and leases determine routing | Inspect keys/ranges and follow a primary and secondary lookup in a native cluster | Sequential inserts create a hot range; a secondary index changes the distributed write path |
| RL68 | Program CockroachDB transactions → intents, transaction records, timestamps, contention and client retries connect | Trace a conflicting multi-range transaction and execute a retrying client | A result already returned to the client prevents an automatic retry; external side effects repeat |
| RL69 | Read CockroachDB consistently → isolation choice, follower reads and timestamps change application meaning | Compare current and historical reads, then rerun an invariant check | A follower read is suitable for a report but unsafe as the sole availability check |
| RL70 | Tune CockroachDB queries and keys → distributed operators, locality, range hotspots and index design determine cost | Explain a remote lookup and change keys/indexes while measuring network and contention | Scatter distributes writes but makes an ordered read more expensive |
| RL71 | Configure CockroachDB regions → table localities and survival goals translate requirements into placement | Build regional and global tables, change placement and lose a region | A promised region-survival policy raises healthy-case write latency; a remote transaction overrides the local fast path |
| RL72 | Operate CockroachDB → range health, quorum, capacity and relocation work determine availability | Native node-loss/rejoin and decommission drills with capacity evidence | A decommission lacks capacity; too many simultaneous failures lose quorum despite surviving machines |
| RL73 | Recover CockroachDB → backup scopes, history, dependencies and restore constraints define recovery | Actual backup and isolated restore with a changed schema and a missing dependency | Restoring rows does not automatically restore every operational dependency or meet recovery time |
| RL74 | Change and migrate CockroachDB → online jobs, compatibility, sequence/SQL differences and staged versions matter | Interrupt a schema job and rehearse a small PostgreSQL migration with semantic tests | PostgreSQL protocol compatibility hides unsupported features or changed transaction behaviour |
| RL75 | Secure CockroachDB → node/client identity, SQL privileges and deployment boundaries differ | Test a restricted client and an unauthorised node or client connection in an isolated cluster | SQL privilege checks do not by themselves establish trusted cluster membership |

## Boundaries before packaging

- SQL syntax reference, rare window options, recursive-query grammar and full
  relational algebra proofs are external reference. The units above teach enough
  SQL to express and debug the service's decisions. A query-language reference is
  a different reading product.
- MySQL/InnoDB is a credible comparison for clustered storage, version storage,
  isolation/locking and DDL. SQLite is a credible comparison for embedding and
  writer concurrency. Neither receives a nominal “complete” page. A full branch
  for either would require its own derived abilities and operating lessons.
- Spanner and application-sharded SQL are comparison cases for distribution and
  regional design. They receive enough mechanism to make a fair conditional
  comparison, not a claim to teach their complete operation.
- Internal row layout and write-ahead reasoning belong here. A general B-tree,
  consensus, queueing or distributed-systems course remains parked; local models
  teach only what the database decision requires. No missing planned field is a
  compulsory prerequisite.
- Columnar analytics, stream processing, search relevance, object storage and
  financial ledger design retain their own boundaries. Reporting queries and
  an outbox are included only to the depth needed to operate a relational service.
- Native engine drills require isolated environments and cleanup. Browser SQL
  can teach relational results. It cannot establish independent-client locking,
  physical replication, quorum failure, filesystem durability or recovery time.

## Planning evidence and uncertainty

Primary documentation checked on 18 October 2026 challenges four consequential
assumptions. These are planning sources; article examples, commands and performance
claims still need version-specific verification and execution. No experiments ran.

- [PostgreSQL isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
  distinguishes its actual snapshot behaviour and required retries from the
  standard names. This supports separate invariant histories and native product
  evidence rather than a universal four-row isolation table.
- [PostgreSQL vacuum](https://www.postgresql.org/docs/18/routine-vacuuming.html)
  connects reuse, visibility and transaction-age safety. Maintenance is an ability
  of its own, not a footnote to MVCC.
- [PostgreSQL physical standby](https://www.postgresql.org/docs/18/warm-standby.html)
  and [logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html)
  justify different physical and logical replication abilities.
- [MySQL 8.4 online DDL](https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html)
  makes operation-specific rebuild and concurrency conditions explicit. “Online
  schema change” cannot be taught as a universal absence of blocking.
- [CockroachDB transactions](https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer)
  and [multi-region capabilities](https://docs.cockroachlabs.com/docs/stable/multiregion-overview)
  support separate application-retry and placement abilities. Pin the selected
  release before relying on its defaults or naming.

The product decision remains provisional until a real local/hosted exercise is
feasible. A distributed branch cannot silently substitute simulation for native
operation. The split between a fresh general mechanism and its implementation
exercise also needs independent challenge: duplication adds reader cost, while a
purely abstract treatment can hide the behaviour the reader needs to predict.
