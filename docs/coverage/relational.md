# Relational databases: proposed coverage map

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/relational-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/relational-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-records.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.


18 October 2026. Planning only. Read alongside
`relational-abilities.md`, which was saved before this page allocation. Existing
articles, routes and publication states were not consulted and are not changed.
The page IDs below are new: RL76–RL132. RL01–RL75 identify teachable units in the
abilities file. Distinct ranges keep both kinds of reference unambiguous.

## What the collection promises

An engineer can design and query relational data correctly, protect invariants
under concurrent requests, choose performance changes from evidence, operate a
live service, and recover it. Two substantial implementation branches connect
those abilities to actual systems: PostgreSQL for a conventional server and
CockroachDB for distributed relational work. Taking every branch is optional.
The collection promises practitioner judgement within these boundaries, not
administration expertise in every SQL product.

The derivation yields **54 teaching pages**: 26 general relational pages,
five distributed relational pages, 13 PostgreSQL pages and ten CockroachDB
pages. The general pages form seven reader-journey groups. These counts describe
the result, not a target or a commission to write all the pages immediately.
There is no additional counted product overview or sandbox article: navigation
belongs in the collection entrance, and experiments belong with their lesson.

The cost of 54 destinations needs explicit scrutiny. Most readers follow a task
path and one implementation branch. Each page below earns its boundary through a
distinct investigation, a directly sought problem, or a different execution
environment. A short page is acceptable when it completes a real task. Equally,
the same investigation must not be split merely to make its neighbours similar.
The most contestable boundaries are named after the page allocation.

## How to read the allocations

Each unit has exactly one full teaching home below. After each unit ID comes the
section that owns it. Entry needs are concepts, not mandatory page visits: a
direct entrant gets the few local sentences needed to start. Product pages link
to general explanations rather than reproducing them, while fully teaching the
product mechanism, commands, measurements and limits they own.

“Execute” describes a future teaching requirement. No experiments were run for
this plan. Small relational result exercises can execute in a browser SQL
environment, labelled with its implementation. Native sessions, files and
independent cluster nodes are required where the property depends on them.
Every native exercise needs a seeded start, observed result, meaningful changed
condition, reset/cleanup and a record of the version and settings used.

## Choose the service — 1 page

### RL76 — Relational databases: introduction and choices

- **Outcome and sections:** state the service's contract before choosing an
  engine. RL01 — relations and transaction boundaries; RL02 — workload and
  failure budgets; RL03 — embedded, server and distributed choices; RL46 —
  self-hosted and managed responsibility.
- **Entry and teaching:** programming knowledge only. First explain what relations and transactions give an application, using a small read and change; then derive requirements for
  the workshop service, then compare SQLite, PostgreSQL, MySQL, SQL Server, distributed SQL
  and a non-relational alternative under stated conditions. Include an evaluation
  worksheet, compatibility proof and exit/restore questions.
- **Changed case and decision:** change from a local application to many writers,
  then add region survival. The reader can shortlist an architecture and explain
  what a managed service still requires. Requirements and choice stay together
  because feature comparison without a workload cannot settle the decision.

## Design facts and guarantees — 4 pages

### RL77 — Relations, keys and normalisation

- **Outcome and sections:** turn domain rules into an explainable schema.
  RL04 — entities and cardinality; RL05 — identity and key choices; RL06 —
  dependencies, update anomalies and deliberate duplication.
- **Entry and teaching:** a table is enough. Build customers, sessions, orders
  and order lines; execute changes that expose contradictory duplicated facts.
  Keep normalisation beside the anomaly that gives it purpose.
- **Changed case and decision:** an order must retain its agreed price after a
  catalogue update. The reader can separate independent facts and justify each
  retained copy. Historical querying gets its own investigation in RL80.

### RL78 — Values, missing data and equality

- **Outcome and sections:** choose values whose comparisons mean what the
  application intends. RL07 — money, units, time, text and collation; RL08 —
  NULL, absence and three-valued predicates.
- **Entry and teaching:** simple SELECT syntax is supplied locally. Execute
  exact money, repeated local-time, case/collation and NULL cases. A compact
  value/predicate display exposes the result rather than a type catalogue.
- **Changed case and decision:** a query for unpaid orders begins excluding rows
  after a NULL enters a subquery. The reader can choose a representation and
  repair its predicates. Equality and missingness belong together because both
  alter keys, joins and filters before physical optimisation matters.

### RL79 — Constraints and tenant boundaries

- **Outcome and sections:** make rules hold for every writer. RL09 — column,
  row, reference and transaction invariants; RL11 — tenant-scoped identities,
  references and access paths.
- **Entry and teaching:** schema and keys. Translate booking rules into
  constraints; let a second writer bypass the application; then attempt a
  cross-tenant reference. Demonstrate the cross-row rule a CHECK cannot settle.
- **Changed case and decision:** two individually valid reservations exhaust
  one shared capacity. The reader can place each rule in a constraint,
  authorisation layer or concurrency protocol. This page defines the obligation;
  RL90 and RL91 own its concurrent enforcement.

### RL80 — History, correction and deletion

- **Outcome and sections:** RL10 — current state, business history, dated facts,
  corrections and retention. Preserve the answer to “what did we agree then?”
  without treating every update as a complete event-sourcing programme.
- **Entry and teaching:** schema design. Compare overwritten prices, copied
  order facts and valid-time records; follow a correction and a deletion through
  foreign keys, archived data and backup retention.
- **Changed case and decision:** a backdated correction changes a report that
  was already sent. The reader can choose what history must be stored and define
  what deletion can actually promise. Time changes the meaning of a fact, which
  earns a separate page from normalisation's update-anomaly investigation.

## Query and change the right rows — 5 pages

### RL81 — Joins and the meaning of a result row

- **Outcome and sections:** RL12 — relational questions and essential SELECT;
  RL13 — grain, multiplicity and join fan-out; RL14 — absence and exclusion.
  Produce the intended answer before making it faster.
- **Entry and teaching:** small tables. Execute joins, pre-aggregations, EXISTS
  and anti-joins with expected result rows visible beside the query.
- **Changed case and decision:** a second payment per order doubles reported
  revenue; moving a predicate loses unbooked sessions. The reader can defend
  each intermediate row's meaning. These cases stay together because they all
  fail when the reader loses track of what one row represents.

### RL82 — Aggregates, windows and ordered results

- **Outcome and sections:** RL15 — grouped summaries, per-row windows, frames,
  ties and top-per-group results.
- **Entry and teaching:** result grain. Execute daily totals, customer rankings
  and running bookings on one dataset; animate how grouping collapses rows and
  a window retains them.
- **Changed case and decision:** two orders share a timestamp and a default
  frame gives a different running total. The reader can select grouping or a
  window and specify ordering/frame semantics. The changed output needs a
  focused sequence of examples that would interrupt the joins page.

### RL83 — Pagination and consistent exports

- **Outcome and sections:** RL16 — total ordering, keyset cursors, offsets and
  the lifetime of an export snapshot.
- **Entry and teaching:** filtering and ordering. Step through pages while
  another writer inserts and changes records; compare a cursor with and without
  a unique tie-breaker. Use real sessions for snapshot claims.
- **Changed case and decision:** a long export misses an order moved across its
  cursor boundary. The reader can choose navigation versus a stable export and
  specify the consistency/cost contract. This earns direct entry because the
  failure can survive otherwise correct SQL and adequate indexes.

### RL84 — Updates, upserts and bulk imports

- **Outcome and sections:** RL17 — conditional atomic writes, affected rows,
  conflict handling, bulk loading and rejected input.
- **Entry and teaching:** predicates and constraints. Execute capacity updates
  and import duplicate, malformed and out-of-order records. Compare overwrite,
  ignore and version-conditional conflict contracts.
- **Changed case and decision:** an older import overwrites a corrected booking.
  The reader can define each write's precondition and failure result. Keep batch
  ingestion here as a write contract; RL100 owns proving a live backfill complete.

### RL85 — SQL at the application boundary

- **Outcome and sections:** RL18 — parameter binding, generated SQL, driver and
  ORM behaviour, result lifetimes and transaction scope.
- **Entry and teaching:** ordinary read/write SQL. Trace one request through
  a small driver example and generated ORM statements; count round trips and
  inspect a returned error without a framework survey.
- **Changed case and decision:** a list endpoint gains N+1 reads; a streamed
  result escapes its transaction. The reader can inspect the SQL actually sent,
  bind values safely and place the boundary deliberately. The network/client
  contract warrants a separate home from SQL's result semantics.

## Make query work affordable — 3 pages

### RL86 — Indexes and access paths

- **Outcome and sections:** RL19 — B-tree search, composite order, range bounds,
  covering and write cost; RL20 — expressions, partial predicates, inverted and
  coarse-range alternatives.
- **Entry and teaching:** queries and predicates. Count visited entries, fetched
  rows and index updates in one model; change one predicate, column order or
  data distribution. Native examples are labelled implementations.
- **Changed case and decision:** a selective lookup becomes a broad scan and
  the extra index slows writes. The reader can propose an index from the
  workload and reject one whose maintenance exceeds its saved work. Keep access
  alternatives here; product operator classes and physical limits have their own homes.

### RL87 — Query execution and bad plans

- **Outcome and sections:** RL21 — scans, physical joins, sorting, grouping and
  retained state; RL22 — estimates, skew, correlation and reused plans.
- **Entry and teaching:** joins and indexes. Move rows through two candidate
  plans, locate the first bad estimate, and compare remedies. A readable plan
  view matters more than a large raw-output table.
- **Changed case and decision:** a small-tenant plan spills or repeats a remote
  lookup for a very large tenant. The reader can separate a bad access path from
  a bad estimate and choose the next measurement. Execution and estimation stay
  together because the estimate matters through the work it selects.

### RL89 — Table partitioning and data lifecycle

- **Outcome and sections:** RL24 — partition pruning, key choice, enforcement,
  partition count and lifecycle changes.
- **Entry and teaching:** keys, predicates and indexes. Split dated sessions,
  show visited partitions, then attach/drop a partition and revisit uniqueness.
- **Changed case and decision:** a lookup lacks the partition key and touches
  every partition. The reader can distinguish a lifecycle benefit from a query
  benefit and assess its enforcement cost. This is table partitioning inside a
  database; RL105 owns distributing data between write authorities.

## Concurrency and durable application work — 5 pages

### RL90 — Transactions and isolation

- **Outcome and sections:** RL25 — commit, rollback, visibility and external
  effects; RL26 — snapshots, anomalous histories and invariant-driven isolation.
- **Entry and teaching:** a capacity rule and two requests. Run histories for
  lost updates, write skew and inserts into a predicate; name guarantees after
  the reader sees which results remain possible.
- **Changed case and decision:** two valid local decisions jointly oversell a
  session. The reader can choose an isolation/protection contract and identify
  which work must be retried. Keep transaction meaning and isolation in one
  argument; implementation-specific behaviour is never inferred from its label.

### RL91 — Locks, contention and deadlocks

- **Outcome and sections:** RL27 — resources protected, row/predicate scope,
  acquisition order, wait cycles and safe abort handling.
- **Entry and teaching:** transaction boundaries. Use independent clients to
  compare an atomic update, row lock and deliberately ordered multi-row lock;
  render the waiting graph beside the evidence.
- **Changed case and decision:** no matching row exists to lock; reversing
  resource order creates a deadlock. The reader can choose a protection that
  covers the invariant and recognise the cost of contention. Native scheduling
  and absent-row protection deserve more than an isolation-level footnote.

### RL92 — Row versions, storage and cleanup

- **Outcome and sections:** RL28 — version visibility and reader horizons;
  RL33 — heap/clustered layouts, large values, free space and amplification.
- **Entry and teaching:** a transaction snapshot. Follow an update through
  versions, index references and reuse; compare a PostgreSQL heap with a bounded
  InnoDB clustered/undo example, without teaching either product's commands.
- **Changed case and decision:** a long reader retains old versions after many
  updates and deleting rows does not shrink the file. The reader can explain
  why logical data size and physical work diverge. Versioning and layout stay
  together because visibility alone does not explain the resulting storage cost.

### RL93 — Retries when a commit reply is missing

- **Outcome and sections:** RL29 — known aborts, ambiguous acknowledgements,
  stable operation identity, result lookup and bounded backoff.
- **Entry and teaching:** commit and error handling. Trace and execute a client
  state machine; drop the reply after commit and inspect the database before
  replaying the purchase.
- **Changed case and decision:** the database committed but the caller timed
  out. The reader can distinguish a safe transaction retry from an operation
  requiring reconciliation. This is an application protocol with its own state,
  so it earns a full page beyond the isolation discussion.

### RL94 — Outboxes and database-backed jobs

- **Outcome and sections:** RL30 — atomic durable intent, relay restart and
  duplicate effects; RL31 — job claims, leases, expiry and overlapping workers.
- **Entry and teaching:** transactions, retries and identifiers. Begin with an
  order and its durable work row, then let an independent worker send or process
  it; crash before and after the effect. Separate the outbox and job sections.
- **Changed case and decision:** a worker returns after its lease expired. The
  reader can define replay-safe effects and the authority needed to exclude stale
  workers. Keep these patterns together because both manage durable work outside
  one transaction; broker delivery internals and a full queue product stay outside.

## Durability, copies and recovery — 4 pages

### RL95 — Write-ahead logs and crash recovery

- **Outcome and sections:** RL32 — dirty pages, record ordering, flush,
  acknowledgement, checkpoints and recovery.
- **Entry and teaching:** transactions and pages. A stepped model crashes at
  each ordering boundary and replays only justified records; native demonstrations
  make narrower claims about the selected engine/settings.
- **Changed case and decision:** a weaker acknowledgement survives a process
  crash but loses data after a wider failure. The reader can describe the
  durability domain and why checkpoint work affects recovery. Storage layout
  supplies context, but this crash-ordering investigation earns a separate page.

### RL96 — Backup, restore and reconciliation

- **Outcome and sections:** RL34 — logical/physical copies, log chains and
  recovery targets; RL35 — restore acceptance, missing dependencies, RPO and RTO.
- **Entry and teaching:** committed history and write-ahead recovery. Choose a
  recovery target, restore into an isolated destination and reconcile useful
  orders written after it. Specify a native rehearsal and application checks.
- **Changed case and decision:** a missing log segment or unavailable key makes
  an apparently complete backup unusable. The reader can defend a recovery
  contract from a drill. Keep acceptance beside restore mechanics; counting
  successful backup jobs is not an independent recovery lesson.

### RL97 — Replicas, lag and read routing

- **Outcome and sections:** RL36 — shipping, durable receipt, replay,
  acknowledgement policies and session-visible freshness.
- **Entry and teaching:** commit and recovery. Advance a write across two
  servers and route a following read; compare asynchronous and synchronous
  promises without calling every synchronous policy equivalent.
- **Changed case and decision:** the replica holds the log but has not applied
  the purchase. The reader can choose a read route and acknowledgement contract
  for a stated failure budget. Failure authority and promotion move to RL98 so
  the replication argument is not buried under cluster control.

### RL98 — Failover and fencing

- **Outcome and sections:** RL37 — uncertain detection, promotion authority,
  client routing, old-primary exclusion and rejoining.
- **Entry and teaching:** replicas and lag. Disconnect a primary from its
  controller while some clients can still reach it; trace who can authorise
  writes before and after promotion. A model teaches authority, a native drill
  validates the chosen deployment's behaviour.
- **Changed case and decision:** the former primary returns with divergent
  writes. The reader can evaluate a failover design and its manual recovery
  steps. This failure can destroy correctness even with perfect replication,
  which earns a separate investigation.

## Change and operate the service — 4 pages

### RL100 — Live schema changes and backfills

- **Outcome and sections:** RL39 — overlapping application versions, blocking
  and rewrite costs; RL40 — restartable batches, concurrent writers and a
  proof of completion.
- **Entry and teaching:** constraints, transactions and workload budgets. Run
  expand/backfill/validate/contract through two client versions and an interrupted
  batch. Native DDL behaviour is labelled by engine and release.
- **Changed case and decision:** a tiny ALTER queues behind a long transaction;
  a short backfill batch is followed by newly eligible rows. The reader can
  sequence a compatible change and establish its completion condition. The
  backfill belongs with the schema transition whose invariant it establishes.

### RL102 — Connections, overload and capacity

- **Outcome and sections:** RL42 — pools, active work, admission and deadlines;
  RL44 — storage/log growth, memory, I/O, replica and recovery headroom.
- **Entry and teaching:** query work and transaction lifetime. Follow a bounded
  queue into the database, estimate capacity from measured rates, and vary active
  concurrency rather than only increasing connections.
- **Changed case and decision:** retained logs fill disk; a larger pool worsens
  tail latency. The reader can set resource budgets and test the limiting
  resource. Keep rate, concurrency and headroom together because capacity is the
  amount of safe work admitted, not just the machine's nominal size.

### RL103 — Diagnosing a database incident

- **Outcome and sections:** RL43 — separate waiting, CPU, I/O, replication and
  storage pressure; test a reversible intervention and establish recovery.
- **Entry and teaching:** transactions and query work. Offer an incident entrance
  with a small evidence set and a branching investigation; reveal misleading
  symptoms only after the reader makes a prediction.
- **Changed case and decision:** terminating a blocker exposes queued work and
  causes a second overload. The reader can choose the next observation and
  assess an intervention's cost. A directly sought incident entrance earns its
  page; product monitoring commands are taught in their implementation homes.

### RL104 — Database access and least privilege

- **Outcome and sections:** RL45 — authentication, roles, ownership, tenant
  enforcement, transport, query safety and protected backup access.
- **Entry and teaching:** schema and application boundaries. Derive roles from
  app/migration/backup tasks and test both permitted and denied actions. Explain
  credential rotation and the limits of encryption without a compliance survey.
- **Changed case and decision:** an application has correct row filters but
  credentials that bypass its intended boundary. The reader can define and
  verify a privilege model. Cross-cutting trust deserves one general home; exact
  PostgreSQL bypass rules and CockroachDB node identity remain product teaching.

## Distribute relational work — 5 pages

### RL105 — Sharding and distributed SQL

- **Outcome and sections:** RL47 — scale-up, replicas, application sharding and
  distributed SQL; RL48 — partition keys, routing, colocation, indexes and skew.
- **Entry and teaching:** keys, indexes and one transaction. Route tenant orders
  in alternative layouts and count cross-partition work, then grow one tenant.
- **Changed case and decision:** a single hot seat counter remains serialised
  after adding nodes. The reader can decide whether distributing writes solves
  the actual limit and choose a first partitioning strategy. Partition choice
  stays with the distribution decision; table partitioning remains RL89.

### RL106 — Transactions across partitions

- **Outcome and sections:** RL49 — replicated partition authority, multi-partition
  commit, durable decisions and abandoned-transaction resolution.
- **Entry and teaching:** transactions, replicas and partition keys, recalled
  through a two-partition order. Step the commit through coordinator loss and
  one unreachable partition; distinguish quorum replication from atomic commit.
- **Changed case and decision:** one partition remains healthy while the other
  cannot participate. The reader can explain the lost availability and choose
  transaction boundaries with their network cost. This mechanism warrants its
  own investigation; consensus proofs and a shared distributed-systems course stay parked.

### RL107 — Time, snapshots and distributed reads

- **Outcome and sections:** RL50 — current versus historical reads, clock
  uncertainty, safe read times and snapshot meaning across partitions.
- **Entry and teaching:** snapshots and replicated partitions. Trace a booking
  read against a deliberately old timestamp, then require a current invariant.
  Use Spanner's external-consistency approach as a bounded contrast, with its
  actual clock assumptions rather than a universal clock story.
- **Changed case and decision:** a cheap nearby report read is reused to approve
  a booking and oversells. The reader can choose a freshness contract and know
  when time coordination enters latency. Product read syntax belongs below.

### RL108 — Regional placement and survival

- **Outcome and sections:** RL51 — local reads/writes, cross-region invariants,
  failure domains, data placement and survival requirements.
- **Entry and teaching:** replicated partitions and distributed transactions.
  Place regional tenants and global workshop information, count required
  coordination paths, then remove a region. Distinguish locality from a complete
  residency assurance that also includes copies, metadata and backups.
- **Changed case and decision:** a local booking must now update a global quota.
  The reader can defend a placement/survival design and its healthy-case latency.
  Geographic choices earn their own page because they change both failure and
  performance contracts without changing the SQL schema.

### RL109 — Rebalancing and cluster change

- **Outcome and sections:** RL52 — range movement, re-replication, headroom,
  staged versions and interacting failures.
- **Entry and teaching:** distributed placement. Follow a node addition, planned
  removal and unexpected loss with foreground requests continuing; model work
  explicitly, then require a native cluster exercise for implementation claims.
- **Changed case and decision:** adding nodes raises tail latency while data
  moves. The reader can budget a topology change and distinguish node count
  from quorum safety. This operation has different evidence and failure modes
  from transaction execution and regional design, which earns another home.

## PostgreSQL implementation — 13 pages

### RL110 — PostgreSQL processes, pages and row versions

- **Outcome and sections:** RL53 — sessions, backends, buffers, files, heap and
  index boundaries; RL54 — tuple visibility, updates and HOT.
- **Entry and teaching:** row versions and storage, with a local one-paragraph
  refresher. Inspect a seeded native server and follow an update from backend
  through tuple and index evidence.
- **Changed case and decision:** adding an indexed column to an update changes
  its physical work. The reader can explain that path and choose what to inspect.
  These internals stay together because the update makes the process/page model
  useful; vacuum's separate operational lifecycle follows in RL111.

### RL111 — PostgreSQL vacuum and transaction age

- **Outcome and sections:** RL55 — dead versions, visibility maps, autovacuum,
  freeze horizons, blockers and reusable space.
- **Entry and teaching:** PostgreSQL versions. Hold an old snapshot while
  updating a table; inspect cleanup and transaction-age evidence before changing
  maintenance settings. Compare reuse with a blocking rewrite.
- **Changed case and decision:** a slot or long transaction prevents expected
  progress. The reader can diagnose the horizon and choose a safe intervention.
  Cleanup and transaction-age safety need a full operational investigation; they
  cannot be implied by a correct explanation of visibility.

### RL112 — PostgreSQL index methods and operators

- **Outcome and sections:** RL56 — native B-tree, GIN, GiST and BRIN use,
  operator compatibility, index-only conditions and maintenance cost.
- **Entry and teaching:** generic access paths. Execute justified candidates
  over seeded ordered, sparse and containment workloads, inspect native plans
  and include their update work. This is selection, not an exhaustive method catalogue.
- **Changed case and decision:** correlation disappears or updates remove
  index-only benefits. The reader can select a method and compatible operators
  from measured work. Native capability and maintenance deserve their own home
  beyond the general search mechanism.

### RL113 — Reading and repairing PostgreSQL plans

- **Outcome and sections:** RL57 — native EXPLAIN evidence, buffers, statistics,
  extended statistics and prepared-plan behaviour.
- **Entry and teaching:** generic plan reasoning. Execute a skewed-tenant query,
  locate its estimate error, inspect native evidence and test narrowly justified
  remedies with reproducible results.
- **Changed case and decision:** a prepared query changes plan behaviour for a
  large tenant. The reader can choose the next native measurement and verify
  a remedy. Keep statistics and prepared plans together because they meet in
  the same concrete diagnosis; shared operator teaching remains RL87.

### RL114 — PostgreSQL JSON and structured alternatives

- **Outcome and sections:** RL58 — JSONB representation, operators, indexing,
  update cost, columns, arrays/ranges and extension boundaries.
- **Entry and teaching:** types and indexes. Query a flexible workshop payload,
  promote an often-tested property to a column and compare plans and updates.
  Arrays, ranges and extensions are conditional alternatives, not promised full tutorials.
- **Changed case and decision:** a small payload change causes substantial
  stored-value work or a provider lacks an extension. The reader can decide
  which facts deserve ordinary columns and which need flexibility. The entire
  investigation concerns one representation choice, not a list of PostgreSQL features.

### RL115 — PostgreSQL WAL, checkpoints and durability

- **Outcome and sections:** RL59 — native write/flush settings, checkpoints,
  recovery work and relevant storage assumptions.
- **Entry and teaching:** general crash ordering. Inspect WAL/checkpoint evidence
  and run a documented isolated restart drill. Separate process restart
  observations from power-loss claims the exercise cannot establish.
- **Changed case and decision:** weaker acknowledgement improves latency while
  changing loss exposure; checkpoint work shifts a tail. The reader can defend
  settings by failure domain. Native settings require a full home; the general
  write-ahead model remains RL95.

### RL116 — Restoring PostgreSQL to a recovery target

- **Outcome and sections:** RL60 — base backups, archives, targets, timelines,
  missing WAL and application acceptance.
- **Entry and teaching:** PostgreSQL WAL and the general recovery contract.
  Execute an isolated base-plus-WAL restore, intentionally break the archive,
  then restore before a destructive change and reconcile a valid later order.
- **Changed case and decision:** promotion creates another timeline or a target
  loses useful commits. The reader can build and test a complete restore path.
  Recovery has its own execution environment and acceptance result, so it stays
  separate from WAL internals and physical standby operation.

### RL117 — PostgreSQL physical replicas and promotion

- **Outcome and sections:** RL61 — streaming positions, slots, synchronous
  policies, replay, promotion and the explicit external fencing boundary.
- **Entry and teaching:** generic replicas/failover plus PostgreSQL WAL. Use
  independent native servers to create lag, interrupt a replica and promote a
  candidate; show client routing and how the old writer is excluded.
- **Changed case and decision:** a disconnected slot retains logs or a required
  standby stalls acknowledgement. The reader can configure a stated policy and
  assess failure behaviour. Keep native replication and promotion together:
  their shared configuration is more useful than a second nearly identical setup lesson.

### RL118 — PostgreSQL logical replication and change feeds

- **Outcome and sections:** RL62 — publications, initial copies, replica
  identity, subscriber restart, retained logs and schema coordination.
- **Entry and teaching:** generic snapshot-plus-stream handover. Execute a
  selective initial copy, update/delete, schema evolution and subscriber outage.
  Inspect the state required at both ends.
- **Changed case and decision:** new schema or sequence state leaves a
  subscriber unsuitable for replacement. The reader can choose a logical feed
  and define its missing responsibilities. Native logical replication earns a
  separate page because its contract and failures differ from physical recovery.

### RL119 — PostgreSQL schema changes under load

- **Outcome and sections:** RL63 — lock evidence, concurrent builds, invalid
  indexes, measured index bloat/rebuild/removal decisions, constraint validation,
  version-specific rewrites and backfill controls.
- **Entry and teaching:** general expand/contract and PostgreSQL monitoring.
  Execute a blocked ALTER, failed concurrent index build and validated change
  while an old client and a new client remain active. Extend that native lifecycle
  through measured sparse-index cost, supported concurrent rebuild, representative
  usage/constraint checks, safe removal and application acceptance.
- **Changed case and decision:** an interrupted build leaves an object that
  exists but is not usable as intended. The reader can sequence and recover a
  real change. Product lock/rewrite behaviour needs its own operating lesson;
  generic compatibility and completion proofs remain RL100.

### RL120 — Operating and diagnosing PostgreSQL

- **Outcome and sections:** RL64 — native activity/lock views, logs, workload
  statistics, spills, memory evidence and pool-mode assumptions.
- **Entry and teaching:** general incident and capacity reasoning. Diagnose a
  blocker, a spill and connection pressure on a native seeded server; validate
  one justified intervention in each case.
- **Changed case and decision:** transaction pooling breaks session-dependent
  code or cancellation releases an overload. The reader can obtain trustworthy
  evidence and assess the side effect of acting. This is the product interface
  to operations, not a repeat of a generic incident checklist.

### RL121 — PostgreSQL roles, policies and privileged code

- **Outcome and sections:** RL65 — native roles/ownership, grants, search paths,
  row policies and bypass conditions.
- **Entry and teaching:** general privilege model and tenant invariants. Execute
  permitted and denied actions using application, migration and tenant roles;
  test privileged-function lookup assumptions.
- **Changed case and decision:** an owner or elevated role bypasses the expected
  row boundary. The reader can implement and test a native privilege design.
  Exact bypass and name-resolution rules earn a product home because plausible
  generic advice otherwise creates a false security guarantee.

### RL122 — Upgrading and migrating PostgreSQL

- **Outcome and sections:** RL66 — dump/restore, pg_upgrade, logical cutover,
  extension/binary compatibility, collations and post-upgrade acceptance.
- **Entry and teaching:** general cutover plus native recovery. Choose a path
  from downtime and compatibility requirements, execute a small rehearsal and
  test clients, extensions, restored data and rollback stages.
- **Changed case and decision:** the binary upgrade succeeds but an extension
  or changed collation invalidates application assumptions. The reader can
  choose a supported upgrade path and its validation. This concerns an entire
  running installation, earning separation from ordinary DDL.

## CockroachDB implementation — 10 pages

### RL123 — CockroachDB keys, ranges and replication

- **Outcome and sections:** RL67 — SQL-to-key encoding, primary/secondary
  indexes, ranges, replicas, leases and request routing.
- **Entry and teaching:** partitioned relational data and replicas. Start an
  explicitly version-pinned native cluster, inspect range placement and follow
  primary/secondary lookups and a range split.
- **Changed case and decision:** sequential inserts concentrate activity despite
  spare nodes. The reader can explain the request path and locate a hotspot.
  This is the branch's implementation entrance; it does not promise to cover its
  transactions, queries or recovery inside one overview.

### RL124 — CockroachDB transactions and retries

- **Outcome and sections:** RL68 — intents, transaction records, timestamps,
  contention, resolution and automatic/client retry boundaries.
- **Entry and teaching:** generic multi-partition commit and safe retry. Execute
  conflicting transactions across ranges, inspect error/results and run a client
  that retries the whole required unit without repeating external effects.
- **Changed case and decision:** returned results make an automatic retry
  impossible. The reader can implement the retry contract and diagnose its
  contention cost. Native commit/retry behaviour needs an independent mechanism
  and programming lesson beyond key routing.

### RL125 — CockroachDB isolation and follower reads

- **Outcome and sections:** RL69 — chosen isolation, current reads, historical
  reads and timestamp/retention boundaries.
- **Entry and teaching:** generic snapshot/freshness contracts. Run a report
  and reservation check with current and historical read forms; record the
  selected release's exact behaviour and supported isolation options.
- **Changed case and decision:** a nearby historical result is reused for a
  current booking decision. The reader can choose a native read contract. This
  short direct entrance earns its page because report readers need not first
  inspect write coordination internals; merge it with RL124 only if testing
  proves that context cost exceeds the independent read journey.

### RL126 — CockroachDB query work and hot ranges

- **Outcome and sections:** RL70 — distributed physical operators, remote
  lookups, secondary-index work, key/index design and locality evidence.
- **Entry and teaching:** generic plans and CockroachDB routing. Execute a
  distributed plan, inspect remote work, vary keys/indexes and measure foreground
  latency and contention under the same workload.
- **Changed case and decision:** scattering writes damages ordered-read cost.
  The reader can select a measured query/key change rather than assume nodes
  remove contention. Keeping tuning separate from the architecture entrance
  leaves room for a real failed change and its repair.

### RL127 — CockroachDB table locality and region survival

- **Outcome and sections:** RL71 — native table localities, regional identities,
  survival goals, placement and supporting system dependencies.
- **Entry and teaching:** generic regional tradeoffs and native ranges. Build
  regional and global data, inspect placement, then execute a permitted isolated
  failure drill. Separate emulated network timing from genuine regional measurements.
- **Changed case and decision:** region survival increases coordination; a
  cross-region transaction misses the local fast path. The reader can configure
  a native requirement and verify what it actually protects. Placement's own
  contract and cluster topology earn a dedicated page.

### RL128 — Operating and securing a CockroachDB cluster

- **Outcome and sections:** RL72 — range health, capacity, relocation,
  decommission and quorum incidents; RL75 — client/node identity and SQL privileges.
- **Entry and teaching:** native ranges and the general privilege model. Build
  a secure repeatable test cluster, test denied access, then lose/rejoin a node
  and attempt a planned removal. Observe health and foreground work.
- **Changed case and decision:** a secure new node cannot join, or relocation
  cannot finish for lack of capacity. The reader can distinguish trust failure,
  capacity pressure and lost authority. Security stays with cluster operation
  because identity is part of establishing and changing native membership;
  general security reasoning is not retaught.

### RL129 — CockroachDB backup and recovery

- **Outcome and sections:** RL73 — backup scope, incremental/history choices,
  dependencies, jobs, supported destinations and restore acceptance.
- **Entry and teaching:** the general recovery contract and native cluster
  boundaries. Execute a full/incremental backup and isolated restore, introduce
  a missing dependency, and check application invariants and restore time.
- **Changed case and decision:** a table restore is technically successful but
  misses an object or identity the service needs. The reader can select scope
  and prove a usable recovery. Recovery gets its own environment and pass/fail
  result; it is not buried in the cluster operation page.

### RL130 — CockroachDB schema jobs under load

- **Outcome and sections:** refined unit RL74a owns descriptor/schema changes,
  asynchronous job progress, online backfill, concurrent callers and compatibility.
- **Entry and teaching:** one local SQL table and a small job-state diagram.
  Execute a pinned schema/backfill job under live requests, inspect progress,
  interrupt the supported stage and follow its documented recovery path.
- **Changed case and decision:** a job is delayed or fails while callers still
  use the old shape. Choose whether to wait, cancel, repair or defer the next
  application release; verify rows, constraints and caller compatibility.
- **Why a page:** schema jobs have a distinct state machine and incident entrant.
  Cluster version transitions and authority transfer are different investigations.

### RL131 — Upgrading a CockroachDB cluster

- **Outcome and sections:** refined unit RL74b owns supported version transitions,
  mixed binaries, feature/version finalisation, compatibility and rollback gates.
- **Entry and teaching:** local diagram of live nodes and replicas; supply the
  actual selected source/target version procedure rather than a generic checklist.
  Rehearse a staged native upgrade, interrupt it at a supported point, inspect
  version/job/replica state and validate application traffic before finalisation.
- **Changed case and decision:** a node cannot rejoin or a version/feature gate
  closes the assumed downgrade path. Choose pause, forward repair, supported
  rollback or restore from evidence, then verify the service's recovery contract.
- **Why a page:** a blocked schema job does not teach binary coexistence or the
  last reversible upgrade step. RL128 retains steady cluster operation and node
  identity; it links here instead of absorbing a second long change procedure.

### RL132 — Moving a SQL application to CockroachDB

- **Outcome and sections:** refined unit RL74c owns native SQL/type/constraint/
  transaction compatibility, client retry changes, copy/catch-up and migration
  acceptance. FD05 owns the generic authority-cutover proof.
- **Entry and teaching:** a small existing SQL application and explicit source
  contract. Rehearse a native compatibility test, data round-trip and migration,
  including changed retry paths and inspected final records.
- **Changed case and decision:** protocol-compatible clients run while one SQL
  behaviour or invariant changes, or new writes cannot be represented in the
  old engine. Repair the application/representation or reject the move; identify
  the last reversible point and reconcile any later accepted work.
- **Why a page:** migrating an application's contract is an independently sought
  question. It requires neither memorising every schema job nor silently treating
  an upgrade exercise as proof of cross-engine compatibility.

## Paths and entrances

The order above is a useful shelf, not a required 54-page sequence. Each path
supplies small missing prerequisites locally and links to full homes for depth.

- **New application:** RL76 → RL77 → RL78 → RL79 → RL81 → RL84 → RL90 →
  RL93. Add the product execution pages as the service is built. History,
  summaries and flexible data enter when those requirements appear, not before.
- **Wrong answers:** enter RL81 for duplicate/missing rows, RL78 for value/NULL
  meaning, RL82 for summaries, or RL83 for changing pages/exports. Correctness
  comes before the performance branch.
- **Slow endpoint:** RL87 → RL86 when access is the cause → FD06 to validate;
  then RL113 for PostgreSQL or RL126 for CockroachDB. RL102 supplies the
  concurrency budget when a good individual query fails under load.
- **Concurrent correctness:** RL79 → RL90 → RL91 or RL93 as the history demands;
  RL94 only when effects or workers leave the transaction. The distributed route
  continues through RL106 and RL124, not through a generic ACID checklist.
- **Recovery owner:** RL95 → RL96 → RL116 or RL129. RL97/RL98 and RL117 cover
  availability copies and promotion; they never stand in for a restore drill.
- **Live change:** RL100 → RL119 for PostgreSQL schema changes or RL130 for CockroachDB schema jobs. Installed-version changes enter RL122 (PostgreSQL) or RL131 (CockroachDB). Whole-store authority transfer enters FD05, then RL122 or RL132 for the actual implementation.
- **Distribution decision:** RL105 → RL106 → RL107 → RL108; test against the
  actual workload before taking RL123–RL130. RL109 and RL128 cover the operation
  that a successful schema/query demonstration alone cannot prove.
- **Current incident:** enter RL103, then the product's operation page. These
  need local reminders and a compact evidence path; do not make a person read
  the collection from the beginning while a service is down.

## Boundary decisions and excluded expansion

The largest scope choice is to include distributed relational expertise inside
this collection. A user choosing relational data can legitimately need distributed
writes, global constraints and region survival. Calling these another field would
leave that engineering choice unfinished. The shared distributed-systems programme
stays parked: the five general distributed pages explain only the coordination
needed for database design, then the implementation branch makes it concrete.

PostgreSQL is selected for mechanism and operating depth, not because prior
project work must survive. Its 13 pages are specific investigations, from tuple
updates through recovery and privileges. CockroachDB is selected because it gives
one inspectable distributed relational implementation, not because it needs a
matching number of pages. Its ten pages take native routing, transactions,
reads, querying, placement, operation, restore and change seriously. It is a
bounded initial branch; it does not cover every cloud service tier or internal
implementation optimisation.

MySQL/InnoDB remains a credible comparison in RL76, RL92, RL90 and RL100. Its
clustered layout, undo/locking behaviour and operation-specific DDL conditions
stop PostgreSQL examples becoming false universal rules. SQLite remains a
credible embedded choice, including its suitability for server-side applications
when writes can queue. Spanner supplies a credible regional/time-semantics
alternative in RL107/RL108; app sharding remains a credible choice in RL105.
Each comparison needs conditions and primary evidence. None is presented as a
complete product education on one page. Full MySQL, SQLite, Spanner, SQL Server,
Oracle, Aurora or YugabyteDB branches need separate ability derivations and are
outside this initial commission.

SQL grammar reference and rare language features are external reference. Views,
CTEs, generated values, stored code and triggers can receive local sentences or
worked examples where they support a mapped decision; there is no encyclopaedic
feature tour. Privileged stored code is taught to the depth needed for RL121's
trust failure. If production work requires a separate substantial programmability
ability, add it explicitly rather than hide it in an index or SQL primer.

General storage devices, broker internals, search ranking, columnar execution,
stream processors, full event sourcing and specialist ledger accounting stay
outside. PostgreSQL JSON is taught as a storage/query choice, not permission to
turn the relational branch into a complete document/search/spatial collection.
Other planned fields do not become prerequisites.

## Where independent challenge can change the page boundaries

- **RL78, values and missingness:** there are several kinds of exactness, but
  short counterexamples may teach them coherently. Split temporal modelling only
  if actual exercises reveal an independent ability beyond type/equality choices.
- **RL83, pagination:** a directly sought correctness problem warrants entry of
  its own, but it might become a bounded section in a query page if it can retain
  both concurrency and export consequences without burying their distinction.
- **RL94, outboxes and jobs:** shared durable-work machinery saves prerequisites,
  but a full job scheduler is excluded. If the worker-lease/fencing mechanism
  cannot fit without confusing the outbox contract, split them; do not omit it.
- **RL104 and native security:** the general home owns the privilege reasoning.
  Product pages must teach exact bypass, trust and command behaviour, never copy
  the general checklist to inflate the branch.
- **RL125, follower reads:** it has a distinct report-reader entrance. It is the
  strongest candidate for merging with RL124 if the native lesson is short and
  the combined transaction/read story remains easy to enter.
- **RL128, secure operation:** it has two owned units because native identity is
  part of joining and changing a cluster. A separate security page becomes
  justified if the tested SQL-role or certificate rotation cases substantially
  displace quorum/capacity diagnosis. Do not cut those operating cases instead.
- **RL130–RL132, change tasks:** independent review separated schema jobs, native
  upgrades and SQL application migration. Each must retain its own interruption,
  validation and rollback outcome; none is a complete release/reference manual.

## Evidence and commissioning gates

These primary sources were browsed for planning on 18 October 2026. They bound
scope; they are not substitutes for later verification of article examples.
The docs links named `stable` must be pinned to a release before commissioning.
No benchmark, restore or failure drill was run in this planning task.

| Source | Consequence for this plan | Later verification |
| --- | --- | --- |
| [PostgreSQL 18 isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | Names alone are insufficient; RL90 needs actual histories and product labels | Reproduce selected histories with independent clients and fixed settings |
| [PostgreSQL 18 vacuum](https://www.postgresql.org/docs/18/routine-vacuuming.html) | RL111 needs cleanup, visibility and age safety, not just reclaiming disk | Observe blockers, reuse and age evidence in the pinned engine |
| [PostgreSQL index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html) | Native covering claims belong in RL112 and depend on visibility evidence | Change updates/visibility state and inspect actual heap work |
| [PostgreSQL physical standby](https://www.postgresql.org/docs/18/warm-standby.html) | RL117 must separate receipt/replay and acknowledgement policy | Independent-server lag/promotion with explicit fencing |
| [PostgreSQL logical restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) | RL118 must not imply a logical subscriber is automatically a complete replacement | Reproduce relevant schema/sequence/identity limitations |
| [PostgreSQL row policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) | RL121 must test bypass conditions | Use actual roles, ownership and denied requests |
| [PostgreSQL pg_upgrade](https://www.postgresql.org/docs/18/pgupgrade.html) | RL122 needs binary/extension compatibility and application acceptance | Rehearse a pinned source/target version pair |
| [MySQL 8.4 clustered indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html) | RL92 needs a credible contrasting physical layout | Verify secondary lookup and key-size examples in the chosen release |
| [MySQL 8.4 online DDL](https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html) | RL100 cannot equate “online” with no blocking/rebuild | Use exact operation and release conditions |
| [SQLite appropriate uses](https://www.sqlite.org/whentouse.html) | RL76 compares embedding and writer concurrency, not “toy” versus “real” databases | Verify current concurrency and deployment assumptions; avoid stale traffic heuristics |
| [Spanner time and external consistency](https://docs.cloud.google.com/spanner/docs/true-time-external-consistency) | RL107 includes a real alternative to one generic clock mechanism | Check which transactions and reads receive which guarantee |
| [CockroachDB transaction layer](https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer) and [developer basics](https://www.cockroachlabs.com/docs/stable/developer-basics.html) | RL124/RL125 need implementation-specific isolation and client handling | Pin release, reproduce returned errors and automatic/client retry boundaries |
| [CockroachDB multi-region](https://docs.cockroachlabs.com/docs/stable/multiregion-overview) | RL127 needs explicit localities, survival goals and supporting dependencies | Inspect real placement and chosen failure cases; do not infer guarantees from labels |
| [CockroachDB backup overview](https://docs.cockroachlabs.com/docs/stable/backup-and-restore-overview) | RL129 needs scope, supported storage, history and actual restore acceptance | Pin support matrix, credentials, job behaviour and isolated restored service |
| [CockroachDB licensing](https://docs.cockroachlabs.com/docs/stable/licensing-faqs) | Native multi-node lessons have a real licence/telemetry/expiry feasibility question | Choose a lawful reproducible environment before promising readers an unqualified local exercise |

CockroachDB's branch is the major decision needing discussion. The browsed
licensing documentation distinguishes single-node development from multi-node
use and describes grace/telemetry conditions. A single-node demonstration cannot
replace the promised distributed failures. Before article commissioning, prove
that the intended reader can run the selected multi-node release in a bounded
exercise, or explicitly commission another distributed product's abilities and
re-derive that branch. Do not silently substitute a browser simulation.

The other uncertainty is deployment architecture. The implementation branch
must name its selected deployment and version; newer disaggregated/cloud
architectures cannot inherit every self-hosted assumption. This affects source
verification and experiments, not the need for transaction, placement, recovery
and operation abilities.

## Allocation audit and handoff

Every RL01–RL75 unit has one full home. Coordination moves RL23 to FD06, RL38 to FD04 and RL41 to FD05; their full shared investigations are linked rather than repeated. The original broad CockroachDB
operation/recovery unit was decomposed before page assignment into RL72 and
RL73; change/migration is RL74, and native identity/privileges is RL75. This
prevents operation and recovery becoming one nominal product section.

Shared teaching homes follow the coordinated field map. Eventual public route
names remain a later implementation decision. The first isolated derivation did not read the other collections or use an
existing inventory to justify scope or count. The independent challenge and
coordination repairs are recorded below and in the linked review. Next work is
user discussion of scope, native branches and connected production journeys.
Article production, route changes and publication remain uncommissioned.

## Shared homes after coordination

RL23 (reproducible workload evaluation) belongs to **FD06**. RL38 (snapshot,
change positions, replay and retained history) belongs to **FD04**. RL41
(authority cutover and rollback) belongs to **FD05**. These moves retire the
first proposal's RL88, RL99 and RL101 destinations; they do not remove the
relational or native cases needed by the remaining articles.

The relational query/transaction, replication and backup mechanisms remain here.
Shared vocabulary at FD03 supplies context rather than another full derivation of
relational isolation. Family-specific cases at DC57, K03 and CA-A06 must state
their own invariant and atomic boundary instead of retelling these SQL histories.

## Review repairs: native execution and entrances

RL90, RL91 and RL93 explicitly own native PostgreSQL reservation, absent-row/
deadlock and uncertain-commit exercises respectively, alongside their labelled
general histories. Pin server and driver; show statements, connection/role, error
branch, request identity and final state. Contrasts with InnoDB, SQL Server and
SQLite change the prediction rather than interrupting every explanatory step.
RL110 provides the reusable native fixture, independent-client setup, reset and
cleanup resources, not an extra setup article.

RL94's stale-worker case must finish at the authority that rejects the late
effect. A lease expiry alone does not complete the safety argument. RL128 retains
node identity and joining as part of cluster operation, with a direct denied-action
access test and bounded privilege/rotation procedure.

The review decomposes original RL74 into RL74a (schema jobs), RL74b (cluster
upgrade) and RL74c (SQL application migration), owned by RL130, RL131 and RL132.
These are the three precise parts of the formerly broad unit, not three claims
to own the same subject. The initial derivation remains unchanged as evidence.

## Production reconciliation: 19 October 2026

The user commissioned the whole allocation for authoring, practical work and
independent review. Replacement sources and their production status are tracked
in `docs/article-work/relational-rewrite-2026-10-19/`; this does not publish them
or change the existing live routes. The earlier proposal notes above retain
the planning state in which they were written.

The independent assembled-collection audit found that native index maintenance
had no complete new home: some RL86 links still relied on the old Maintaining
indexes companion. RL119/RL63 now explicitly owns PostgreSQL index lifecycle
under load, including bloat measurement, rebuild budgets/REINDEX, safe removal
and post-change acceptance. RL111 retains heap horizons/reuse/freeze; RL112
retains access methods/operators. RL86 keeps the general mechanism and engine
comparison and links to RL119 only after that destination teaches the promised
operation. This is a deeper existing home, not a new counted page.

All 54 articles are now ready as drafts after independent article and collection
review, native execution and rendered checks. The [final production handoff](../article-work/relational-rewrite-2026-10-19/handoff.md)
records the delivered coverage and remaining experiment limits; the registry
pins each final source and its review. Publication remains separate.

### Learning-tools review reopened

After delivery, the user's reading exposed insufficient interactive teaching
support compared with Indexes. The [follow-up review](../article-work/relational-rewrite-2026-10-19/review/learning-tools-gap.md)
supersedes the blanket ready-as-draft judgement above. Coverage allocation and
native evidence remain useful; the collection needs a substantive learning-tools
pass and proportional independent review before acceptance.

### Learning-tools repair completed

The user commissioned skill hardening and repair after that finding. All 54 pages
have now been reassessed, with visible causal models, suitable retained examples,
independent media-first review and rendered repairs. The [repair handoff](../article-work/relational-rewrite-2026-10-19/media-repair/README.md)
records per-page decisions, verification and limits. The collection is ready as
drafts within that scope; the allocation remains 54 pages and publication remains
separate. Earlier readiness and rejection records remain historical evidence.


## Publication, 19 October 2026

After the completed teaching-tools repair, the user authorised publication of all
54 articles. Sources are now in `src/articles/relational/`. The registry retains
the reviewed draft hashes and records the public destinations and published hashes.
The publication changes status and links, reuses the reviewed renderer and models,
and connects task paths, search, navigation and downloadable evidence. The
[publication record](../article-work/relational-rewrite-2026-10-19/publication.md)
records the integration checks. The earlier draft-only boundaries above describe
those earlier deliveries.
