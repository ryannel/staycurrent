# Document databases: proposed coverage map

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/documents-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/documents-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-records.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.


18 October 2026. Planning only. The independently derived [abilities](../planning/databases-depth-2026-10-18/documents-abilities.md) were persisted before grouping. Existing outlines, inventories, coverage maps, articles and earlier field proposals were not consulted. No articles, routes or publication states change through this proposal. Article IDs start at DC53, after ability IDs DC01–DC52, so every DC identifier is unique.

The result is **23 bounded articles: nine general articles and fourteen MongoDB implementation articles**. This is an outcome of the ability chains, not a count target. The general route has three journeys: choosing and modelling; querying and correctness; changing and operating. MongoDB has three further journeys: local execution; failure and distribution; changes and operation. Readers do not need to read all 23 before making a useful choice.

## Why these boundaries

A document is simultaneously a read shape, a mutation boundary and a unit of growth. That gives modelling its own investigation. Nested query meaning deserves room apart from physical access: matching colour and size in different array elements is wrong even with an excellent index. Array index expansion, in turn, can make a correct query expensive. Neither lesson should be buried in a MongoDB syntax catalogue.

Copies, schema evolution and recovery all involve old data, but their obligations differ. A copied supplier name needs an authority, a freshness budget and repair. A renamed field needs compatible readers and writers plus proof of backfill completion. A restore needs an application-consistent target and reconciliation of valid later work. Those are separate direct entrances and separate proofs of correctness.

The MongoDB branch follows actual mechanisms. Storage, query execution, local mutations, transactions, replica history, client observation, placement, change capture and restore have different failure states and evidence. A single “MongoDB in depth” article would compress exactly the mechanisms a practitioner relies on. Conversely, a new page for each index type, aggregation stage, concern level, validator setting or backup command would charge readers for distinctions that make more sense side by side.

## General route: choosing and modelling

### DC53 — Document databases: introduction and choices

- **Reader outcome:** turn a proposed workload into a conditional database choice, including rejecting a document store when its boundary is wrong.
- **Owns:** DC01 in “What a document database persists”; DC02 in “Follow the workload as it changes”; DC03 in “Relationships, JSON columns and projections”; DC04 in “Compare product contracts”; DC35 in “Where this collection ends”.
- **Entry needs:** application records and requests. Introduce identity, nested values and atomic operations locally. No prior database collection is required.
- **Teaching form:** first show what an independently addressed nested document stores and which application operations it serves. Then use one catalogue record and workload sheet, followed by three changed requirements. A concise comparison uses MongoDB, Couchbase and a named Firestore edition/operation family. Compare actual query, index-visibility, transaction, client and operating contracts rather than points in a feature grid.
- **Necessary change/failure:** detail reads initially dominate; supplier changes and cross-product constraints then dominate. Separately, offline clients or read-based charging can favour a different service despite similar JSON shapes.
- **Decision afterwards:** choose the aggregate-oriented workload worth investigating, the requirements to test, and the representative branch to follow. A product's API compatibility claim remains a test obligation.
- **Why this page:** newcomers and selectors need a bounded entrance before any modelling prescription. Keep family orientation and product comparison together because a data-shape label alone cannot support a choice. Do not insert a vendor catalogue or general NoSQL history.

### DC54 — Modelling document boundaries

- **Reader outcome:** defend which data lives together and when growth or independent writers requires a different boundary.
- **Owns:** DC05 in “Identity and tenancy”; DC06 in “Embed data with a shared boundary”; DC07 in “Bound arrays and growing histories”; DC08 in “References and following relationships”.
- **Entry needs:** DC53's notion of an independently addressed document, supplied in a short opening for direct entrants.
- **Teaching form:** progressively change product `p104`, variants, supplier `s9` and orders. Draw reads and writes beside alternative shapes. Count round trips and copied values, not synthetic performance scores.
- **Necessary change/failure:** ten variants become thousands of independently updated variants. A tiny activity preview grows without limit. An order must retain its original shipping address after the customer's address changes.
- **Decision afterwards:** embed, reference, bucket, keep a subset, or move the relationship elsewhere; state who owns a reference and how the complete data can be reached.
- **Why this page:** boundary decisions are one connected argument. Separate pages for embedding, references, buckets and subsets would make comparison harder. Product limits and BSON layout belong in DC62; copy freshness belongs in DC58.

## General route: querying and correctness

### DC55 — Querying nested and changing documents

- **Reader outcome:** predict the selected set and intermediate results before optimising their execution.
- **Owns:** DC12 in “Match the same array element”; DC13 in “Missing values, types and ordering”; DC15 in “Unnest, join and aggregate”; DC16 in “Page through a changing result”.
- **Entry needs:** nested objects and arrays; provide the four-record fixture locally.
- **Teaching form:** inspectable predicate/result tables and a small step-through model of unnesting, joining and grouping. A stable cursor uses a tie-breaking ID. Product-specific truth tables and executable syntax are explicitly named rather than presented as universal rules.
- **Necessary change/failure:** different variants independently match colour and size. Unnesting two arrays multiplies rows and inflates a total. Two products share a timestamp, and a concurrent edit moves one across a page boundary.
- **Decision afterwards:** specify element correlation, missing-value handling, aggregate cardinality and pagination guarantees correctly. A cursor bounds work but does not freeze a changing dataset.
- **Why this page:** the selected set, the intermediate set and the ordered page are successive meanings of one query. Keep them together; move index mechanics to DC56 and actual MongoDB execution to DC64–65. Query grammar reference is external.

### DC56 — Indexing nested data

- **Reader outcome:** connect nested shape to maintained index entries and diagnose whether an access path can serve the intended query economically.
- **Owns:** DC14 in “What one document contributes to an index”; DC17 in “Measure examined work, not returned rows”.
- **Entry needs:** the same-element predicate from DC55, restated beside the fixture. Supply a short ordered-index model locally; relational index reading is optional.
- **Teaching form:** an array-entry model with exact counts, candidate documents and fetches; compare compound order, filtering and covering. Introduce selectivity, skew and write amplification through the changed dataset. The general model states its assumptions; real plan evidence is owned by DC64.
- **Necessary change/failure:** the product returns ten results in both cases while its tag array grows from five to five hundred values. A tenant with most of the records defeats a fixture that assumed uniform selectivity.
- **Decision afterwards:** propose a small index set, identify an unindexable/expensive combination for the selected product and design a representative measurement.
- **Why this page:** the physical entry investigation would interrupt DC55's correctness argument. Keep profiling beside indexing because an index recommendation without evidence is unfinished. Specific multikey restrictions and plan-cache behaviour remain implementation teaching.

### DC57 — Preserving invariants across document writes

- **Reader outcome:** choose the smallest correct write boundary and handle an outcome the application cannot immediately know.
- **Owns:** DC18 in “Put the precondition in the write”; DC19 in “When one document is insufficient”; DC20 in “Retry a request without repeating its effect”; DC21 in “What success and a later read promise”.
- **Entry needs:** one-document identity. Define atomicity, a transaction, an acknowledgement and a replica in the local trace; shared distributed-systems teaching stays parked.
- **Teaching form:** deterministic interleavings of two reservations, then a lost response after commit. Compare conditional update, transaction and redesign. Keep logical request identity distinct from driver retries and from an external payment.
- **Necessary change/failure:** each of two writers sees remaining stock before either writes. Moving the invariant across documents defeats a one-document fix. A committed reservation is retried after the response disappears; a secondary read then returns an earlier value.
- **Decision afterwards:** locate the invariant, choose concurrency control, specify durability/visibility needs and place external effects where retry can be handled.
- **Why this page:** these are successive consequences of one application's write, not separate acronym lessons. Product transactions, replica histories and concern settings each need their own evidence and homes in DC66–68.

### DC58 — Keeping duplicated document data correct

- **Reader outcome:** maintain and remove copied data with a stated freshness and repair policy.
- **Owns:** DC09 in “Snapshots and mutable projections”; DC11 in “Deletion follows ownership and copies”; DC22 at FD04 for the generic bootstrap/checkpoint/completeness mechanism, applied here to document copies.
- **Entry needs:** references and authoritative records; introduce both locally through a supplier rename.
- **Teaching form:** a state sequence follows supplier `s9` through catalogue copies, order snapshots and a downstream search projection. Show bootstrap and stream overlap, duplicate delivery and a stopped consumer. Apply the shared FD04 protocol to document facts here; native tokens and preimages belong in DC71.
- **Necessary change/failure:** a supplier rename reaches only some products and arrives out of order on another. A deletion leaves a copied email elsewhere. The consumer returns after its replay history expires.
- **Decision afterwards:** choose immutable snapshot, synchronous update, asynchronous projection or no duplication; specify the authority, acceptable lag, repair source and deletion path.
- **Why this page:** copies are the maintenance consequence of modelling, and many readers arrive with stale data rather than a new schema. Keep capture and reconciliation together so the first half does not imply guaranteed delivery. Stream infrastructure internals and search ranking are outside the general article.

**Coordinated scope:** DC09/DC11 remain here for copied document facts, immutable
order snapshots and document/reference deletion. DC22's generic snapshot/stream,
checkpoint and replay-completeness mechanism has its full home at FD04. This
page applies that protocol to supplier/product copies instead of re-teaching a
generic connector. DC71 owns actual MongoDB tokens, preimages and history expiry.

## General route: changing and operating

### DC59 — Evolving document schemas

- **Reader outcome:** change a live document shape and prove that old data and old writers no longer threaten the cutover.
- **Owns:** DC10 in “Variation with a contract”; DC23 in “Compatible readers and writers”; DC24 in “Backfill with guarded progress”; DC25 in “Enforcement and access-path readiness”; DC26 in “Crossing an implementation boundary”.
- **Entry needs:** documents with stable identity and conditional writes. Remind readers why replacement differs from a field update.
- **Teaching form:** deployment-state tables plus a native-exercise specification; one product attribute changes name and representation. The cross-implementation section teaches the contract that must survive, not another vendor's commands.
- **Necessary change/failure:** an old writer erases the new field; a retry transforms a value twice; a short batch appears complete while a competing writer creates another old-form document. A destination accepts the exported JSON but changes numeric or missing-field semantics.
- **Decision afterwards:** design expand/backfill/verify/contract phases, stop a bad rollout and establish a migration acceptance contract.
- **Why this page:** validation and backfill are two parts of the same live transition. Separate them and readers can confuse “new writes validate” with “existing data is valid”. Product commands and BSON round-trip evidence belong in DC72.

### DC60 — Distributing documents and tenants

- **Reader outcome:** predict whether placement can serve the actual workload and isolate the tenants that need it.
- **Owns:** DC27 in “Partition for writes and reads”; DC28 in “Moving data does not move every bottleneck”; DC29 in “Tenants and isolation”; DC30 in “Budget the maintained state”.
- **Entry needs:** document boundaries and indexed queries. Briefly introduce partitions and replicas locally without assuming a distributed-systems course.
- **Teaching form:** a placement model changes tenant weights, key distribution and query ranges; account for documents, indexes, replicas and temporary/history space. Compare tenant-qualified keys, separate namespaces and deployments through recovery and noisy-neighbour consequences.
- **Necessary change/failure:** tenant `t7` becomes most of the workload. Hashing fixes a recent-write hotspot but causes range queries to visit many partitions. A hot single document remains hot after adding servers. Equal byte counts hide unequal work.
- **Decision afterwards:** choose a partition candidate, recognise when to change the document boundary, and decide whether a tenant needs a stronger isolation boundary.
- **Why this page:** placement, tenancy and capacity share the question “what resource does this request consume, and where?” Product routing, shard-key restrictions and resharding are separate mechanisms in DC69–70. No universal claim about how document databases partition is intended.

### DC61 — Operating a document database

- **Reader outcome:** write an operating contract and choose evidence for a recovery, incident or deployment change.
- **Owns:** DC31 in “Recover an application state”; DC32 in “Choose evidence that separates causes”; DC33 in “Control who can issue which queries”; DC34 in “Change versions without losing the contract”.
- **Entry needs:** the collection's distinction between authoritative and copied data; the opening supplies it. Read the selected implementation's operating branch before running a procedure.
- **Teaching form:** one compact recovery timeline loses a bad edit and a later valid order; one diagnostic case distinguishes client queueing from server query work; an access-boundary checklist and a version-state table state the responsibilities to test. The general security section deliberately stops at database access/query construction and links to external hardening guidance. It is not a broad security course.
- **Necessary change/failure:** a backup completes but does not represent one consistent state; restored authority disagrees with a projection. A slow request is caused by an exhausted client pool. An upgrade is available but its feature change prevents the presumed rollback.
- **Decision afterwards:** set recovery objectives, demand a restore drill, select discriminating observations, and assign access/maintenance duties between the team and provider.
- **Why this page:** the general teaching is a bounded operating decision, not a portable command book. Keep these checks together as the contract demanded before production. Full execution and mechanisms have separate product homes in DC73–75; additional infrastructure, identity-provider and security internals remain external.

## MongoDB route: local execution

The branch uses native MongoDB with WiredTiger, a disposable replica set and one supported Node.js driver. A sharded disposable topology is needed only for placement and sharded recovery lessons. A managed deployment is compared where it changes operating responsibility; it is not silently substituted for self-managed commands. Select one supported stable server line, Database Tools version and driver version at commissioning. Current manual pages already include version-specific 9.0 behaviour, so “latest docs” is not a reproducible version choice.

### DC62 — How MongoDB stores documents

- **Reader outcome:** explain how a BSON mutation reaches local durable state and why cache/history pressure changes its cost.
- **Owns:** DC36, through “BSON and document bounds”, “Collections and index pages”, “Cache and compression”, “Snapshots and retained history”, and “Checkpoints, journal and restart”.
- **Entry needs:** a local MongoDB record. Explain an ordered page, snapshot and journal in the article; prerequisite relational storage reading is optional.
- **Teaching form:** mechanism figures follow one update through memory, history, journal and checkpoint; a pinned native worksheet observes storage/cache statistics. Source-code investigation is allowed when the manual cannot support an internal claim.
- **Necessary change/failure:** the working set exceeds cache, then a long reader extends retained history; terminate between checkpoints and distinguish local restart from loss of a replica-set primary.
- **Decision afterwards:** reason about document/index size, working memory, read duration, disk headroom and local durability. Do not infer a small disk update merely from a small logical field update.
- **Split:** storage is a causal investigation of its own. Elections and acknowledged replicated writes belong in DC67, and backup recovery in DC73; neither is a paragraph appended to local journalling.

### DC63 — Updating MongoDB documents safely

- **Reader outcome:** issue precise conditional mutations and interpret matched, modified and partial-success results.
- **Owns:** DC37 in “Replacement and field updates”, “Conditional reservations”, “Array element updates”, “Upserts and uniqueness”, and “Bulk results”.
- **Entry needs:** a local one-document invariant, restated in the fixture; working driver commands with setup/reset supplied.
- **Teaching form:** native driver worksheet with two writers and visible final state. Compare replacement, increment, compare-and-set, positional filters and bounded bulk execution.
- **Necessary change/failure:** two variants match the array filter, two clients race to upsert the same identity, and a bulk operation fails after some work succeeds.
- **Decision afterwards:** choose operators and guards, decide whether uniqueness is enforced, and recover from partial bulk work without blind replay.
- **Split:** local mutation semantics should be usable before transactions or replica failure. Keep operators beside their guards and result interpretation; array-update syntax needs no separate page.

### DC64 — MongoDB indexes and query plans

- **Reader outcome:** validate a MongoDB index against real predicate semantics, write constraints and execution evidence.
- **Owns:** DC38 in “Scalar and compound entries”, “Multikey bounds and array restrictions”, “Unique, partial, sparse and wildcard choices”, “Collation and TTL”; DC39 in “Explain the examined work” and “Recheck changed selectivity and plan reuse”.
- **Entry needs:** same-element matching and entry expansion, each briefly drawn locally with links to DC55–56.
- **Teaching form:** native fixtures, index builds, rejected writes and pinned `explain` output; compare examined keys/documents, fetches and sort work. Index types share a bounded choice table; this is not a catalogue of every index service.
- **Necessary change/failure:** a second array prevents an intended compound index/write; a unique multikey index permits repeated values inside one document; a large tenant changes the good access path. Expiry is delayed rather than an exact scheduling guarantee.
- **Decision afterwards:** defend a small index set, predict its mutation constraints and choose evidence for revisiting it.
- **Split:** index representation and plan interpretation complete each other. Pipeline execution has different intermediate-state and resource questions and belongs in DC65.

### DC65 — MongoDB aggregation pipelines

- **Reader outcome:** build a correct pipeline and account for the work and resources it creates.
- **Owns:** DC40 in “Track intermediate documents”, “Move selective work”, “Lookups and access paths”, “Blocking stages and spill”, and “Execution across shards”.
- **Entry needs:** local pipeline notation and a reminder of unnest/join multiplication. Supply a simple ordered-index reminder where a lookup needs it.
- **Teaching form:** native pipelines show intermediate counts and corresponding execution evidence. Compare a filter before and after expansion; distinguish streaming stages from blocking work.
- **Necessary change/failure:** a many-to-many join inflates a total and memory footprint. Disk spilling prevents one resource failure but does not make the cardinality mistake correct. A sharded lookup changes where work occurs.
- **Decision afterwards:** alter pipeline shape, index the lookup, bound the intermediate state or move the job to an analytical system.
- **Split:** a pipeline is an investigation of transformed sets, not a longer `find` example. Keep lookup and group/sort beside the cardinality they consume. Full search/vector/analytical products stay outside this branch.

### DC66 — MongoDB transactions and retries

- **Reader outcome:** preserve a cross-document invariant and place retryable application code and external effects correctly.
- **Owns:** DC41 in “Session and transaction state”, “Read snapshots and conflicts”, “Retry the transaction or the commit”, and “External effects”.
- **Entry needs:** driver setup and conditional writes; include a short replica-set/majority explanation sufficient to run the local exercise.
- **Teaching form:** real replica-set, multi-client worksheet follows two competing reservations and injects distinguishable transaction/commit failures. Pin driver retry semantics and operation deadlines. Record exact final records and logical request IDs.
- **Necessary change/failure:** a transaction callback executes again; a payment made inside it repeats. A commit response is unknown while the transaction may already have committed. A long transaction changes conflict and history pressure.
- **Decision afterwards:** choose a transaction boundary, use the right retry scope, and design an idempotent or explicitly reconciled external effect.
- **Split:** transaction lifetime and callback replay need one complete mechanism. Replica elections are a separate history investigation in DC67, not prerequisites that readers must fully finish before the worksheet.

## MongoDB route: failure and distribution

### DC67 — MongoDB replica sets and surviving history

- **Reader outcome:** explain which history survives a primary failure and what lag, rollback and initial sync mean operationally.
- **Owns:** DC43 in “The oplog and applied history”, “Committed progress”, “Election and rollback”, and “Initial sync and lag”.
- **Entry needs:** local journal versus checkpoint, provided in a short diagram linking DC62. Define a replica set locally.
- **Teaching form:** trace model makes appended, applied, durable and committed positions visible. A separate native multi-process fault exercise must establish any claimed observed failover behaviour; a model alone cannot prove it.
- **Necessary change/failure:** an isolated primary acknowledges a weakly protected write, loses election and returns to a surviving history that omits it. A slow member crosses the available history window and needs a different recovery path.
- **Decision afterwards:** interpret lag and rollback risk, reason about member placement and recognise that adding replicas is not a backup plan.
- **Split:** write-history survival is substantial enough without a catalogue of client settings. DC68 owns how application requests select and observe this state; settings can link back to this trace.

### DC68 — MongoDB clients, reads and write acknowledgement

- **Reader outcome:** configure what a client may observe or retry, and bound the time and resources it spends waiting.
- **Owns:** DC44 in “Write acknowledgement and journal conditions”, “Read concern and preference”, “Causal sessions and failover”; DC42 in “Discovery, pools and deadlines” and “Cursors and bounded work”.
- **Entry needs:** a concise replica-state trace is local; DC67 supplies full mechanism. Supply a minimal driver connection and safe fixture setup.
- **Teaching form:** native driver exercises plus configuration-to-outcome timelines. Cursor batches and connection queues are visible. Separate server execution, server selection and pool wait in request latency.
- **Necessary change/failure:** majority-acknowledged data is read from a stale secondary under an unsuitable read contract. Failover exhausts a deadline. A slow cursor consumer or too many concurrent jobs ties up application resources without a slow server query.
- **Decision afterwards:** choose concern, preference, session, deadlines and pool/batch limits for a stated user-visible promise. Driver retry is not a replacement for logical request identity.
- **Split:** these controls meet at the client operation. Keep them together so a guarantee is not configured without its waiting behaviour. Transaction callback control flow stays in DC66; security and version maintenance in DC75.

### DC69 — Choosing MongoDB shard keys

- **Reader outcome:** choose and test a shard key against actual query routing, write skew and invariant constraints.
- **Owns:** DC45 in “Ranged, hashed and compound keys”, “Cardinality, frequency and time”, “Targeting and zones”, and “Index and uniqueness restrictions”.
- **Entry needs:** one local routing model introduces ranges and shards. Recap the hot-document limit from DC60.
- **Teaching form:** a distribution model changes the fixture's tenant weights and recent-write rate. A native sampled workload and key-analysis tooling, where available in the chosen version, test the candidate rather than merely show a command.
- **Necessary change/failure:** a tenant-only key cannot split a dominant tenant effectively; a time-ordered key concentrates writes; hashing improves distribution but weakens range targeting. A requested unique constraint is incompatible with the chosen distribution.
- **Decision afterwards:** accept or reject a candidate and state the query and invariant cost of the alternative.
- **Split:** selecting a key and changing a running cluster are different jobs. Keep variants side by side here; DC70 owns migration, coordination and interruption.

### DC70 — Changing a MongoDB sharded cluster

- **Reader outcome:** plan a placement change and interpret progress or interruption without mistaking balanced bytes for a solved bottleneck.
- **Owns:** DC46 in “Routers and metadata”, “Range migration and balancing”, “Scatter-gather and coordination”, “Refine or reshard”, and “Interrupted changes”.
- **Entry needs:** a shard-key choice. Supply enough replica-set context to explain why each shard has its own replicated history.
- **Teaching form:** topology and routing figures plus a disposable native cluster exercise; inspect target selection and data movement, then interrupt a supported change and follow the documented recovery path.
- **Necessary change/failure:** adding a shard moves data but leaves a hot value unchanged. A broadcast aggregation remains expensive. Resharding is interrupted while the application still writes, so readiness is not certified by one completed command.
- **Decision afterwards:** distinguish adding capacity, changing a key, changing query shape and changing a document boundary; plan the topology and operational checks required.
- **Split:** active-cluster coordination needs its own practical route. Sharded backup constraints belong in DC73 and are linked at the point a change threatens recovery coverage.

## MongoDB route: changes and operation

### DC71 — MongoDB change streams and projection repair

- **Reader outcome:** build a restartable consumer and recover when its saved position can no longer be resumed.
- **Owns:** DC47 in “Events and resume positions”, “Lookup and preimages”, “Bootstrap and checkpoint”, “Invalidate and resume”, and “History expiry and repair”.
- **Entry needs:** the authority/projection distinction and a short local oplog reminder. Full replica internals are optional.
- **Teaching form:** real replica-set consumer writes a checkpoint and an idempotent sink; restart between effect and checkpoint. A labelled trace handles the expired-token path if a timed native test would be expensive, with article claims limited to what was documented or observed.
- **Necessary change/failure:** a process stops after applying an effect but before checkpointing. Full-document lookup observes a different state from the triggering change. The consumer returns after the available history expires.
- **Decision afterwards:** choose event material, checkpoint ordering, replay handling and a resnapshot/reconciliation procedure. A change stream is not promised as an unbounded event archive or backup.
- **Split:** streams need their own crash/restart investigation. Schema changes can use them, but should link here instead of reteaching delivery and retained history.

### DC72 — Migrating MongoDB document schemas

- **Reader outcome:** execute a shape change or typed-data migration with verifiable coverage and explicit compatibility gates.
- **Owns:** DC48 in “Validators and existing data”, “Rolling readers and writers”, “Guarded backfill”, “Index readiness and cutover”, and “TTL and deletion”; DC52 in “BSON round-trip and exit acceptance”.
- **Entry needs:** general compatibility and guarded-write reasoning, supplied in a short state table; driver worksheet setup is local.
- **Teaching form:** native version-pinned migration with a competing old writer, persisted progress and verification queries. Export/import a small BSON fixture through the selected Extended JSON/BSON path and verify types, identity and query behaviour. The exit section defines a small acceptance suite; it does not claim to implement every destination.
- **Necessary change/failure:** stricter validation governs future operations without necessarily certifying historical records. A replacement writer removes the new shape. A date or number survives syntactically in exported JSON but changes meaning on import. An interrupted scan must resume without declaring false completion.
- **Decision afterwards:** choose validation modes, phase changes, prove backfill completion and distinguish a data-copy success from a semantically compatible migration.
- **Split:** validators, backfill and cutover share the same live state machine, so keep them together. BSON exit checks earn a section here because they extend the same compatibility proof; every compatible service does not earn a separate page. DC71 owns any stream catch-up mechanism.

### DC73 — Backing up and restoring MongoDB

- **Reader outcome:** choose a topology-appropriate recovery method and demonstrate a restored application state.
- **Owns:** DC49 in “What the backup covers”, “Logical and snapshot methods”, “Oplog coverage and PITR”, “Sharded consistency”, and “Restore, verify and reconcile”.
- **Entry needs:** one local distinction among local journal recovery, replica history and independent backup. Link to DC62 and DC67 for full mechanisms.
- **Teaching form:** a real disposable replica-set restore drill with identities, indexes and invariants checked after restore. Compare documented managed PITR and self-managed methods. A sharded method requires its own documented coordinated procedure; do not extrapolate a replica-set dump recipe.
- **Necessary change/failure:** a dump taken during writes is not automatically one point in time. Replay capture covers the dump interval rather than indefinitely archiving future writes. Restoring before an accidental delete loses a later valid purchase that must be reconciled separately.
- **Decision afterwards:** choose a method, retention and drill that meet recovery objectives; specify what cannot be restored and what application reconciliation remains.
- **Split:** recovery is not the final section of replication or deployment. Keep method choice and restore verification together because a successful backup command proves neither consistency nor recoverability.

### DC74 — Diagnosing MongoDB incidents

- **Reader outcome:** narrow a production symptom to a supported cause and choose a targeted remedy.
- **Owns:** DC50 in “Slow request or queued client”, “Examined work and indexes”, “Cache, history and write stalls”, “Lag and history headroom”, and “Disk and skew”.
- **Entry needs:** each case supplies a small topology and the counters needed. Link to the relevant mechanism after making the symptom recognisable; no complete prior read is required.
- **Teaching form:** a bounded set of diagnostic packets with deliberately discriminating evidence, then native observation commands for the selected version. Avoid an undirected metrics catalogue or tuning cookbook.
- **Necessary change/failure:** aggregate latency suggests more CPU while a long transaction retains history; average balance hides a whale tenant; an application queue resembles a server slowdown; lag threatens a stream or replica's recoverable history.
- **Decision afterwards:** request the next useful measurement, stop a harmful change and choose query repair, workload bounding, history relief or capacity with a reason.
- **Split:** diagnosis is a direct reader entrance across several mechanisms, but it teaches the evidence-to-cause reasoning rather than reproducing those mechanisms. This is the place for operational cases, not one overloaded “advanced MongoDB” page.

### DC75 — Securing and maintaining MongoDB

- **Reader outcome:** establish a bounded production access baseline and change a supported deployment without losing a tested rollback/recovery path.
- **Owns:** DC51 in “Managed and self-managed responsibilities”, “Authentication, roles and transport”, “Bound the application's authority”, and “Server, driver and feature compatibility”.
- **Entry needs:** a named topology, driver and deployment environment. The article supplies a small least-privilege application role and separates database authentication from tenant authorisation.
- **Teaching form:** an executable allow/deny access test, a responsibility checklist and one version-pinned rolling-maintenance worksheet linked to the exact official procedure. Network hardening, key management, identity-provider setup and every release's upgrade path remain maintained external references.
- **Necessary change/failure:** a role that passes a basic connection test still allows another tenant's data or administrative writes. A rolling upgrade preserves serving traffic but enabling an incompatible feature closes the assumed downgrade path. A missing/lagging member makes the original maintenance sequence unsafe.
- **Decision afterwards:** assign operating duties, test application authority and choose a supported maintenance sequence with a real recovery route.
- **Split:** access baseline and maintenance are bounded production-admission checks, not new deep mechanisms. Keep their executable checks together and link to DC67/DC73 for history and recovery. If commissioning uncovers substantial deployment-specific mechanics, split only on that evidence; do not expand this into a platform administration manual.

## Unit-to-home audit

Every ability has one full teaching home below. Product pages give local reminders of general reasoning and link to its full home; this is not duplicate ownership. “External” describes the part deliberately beyond the ability, not a substitute for its stated database lesson.

| Ability | Full home and section |
| --- | --- |
| DC01 | DC53 — What a document database persists |
| DC02 | DC53 — Follow the workload as it changes |
| DC03 | DC53 — Relationships, JSON columns and projections |
| DC04 | DC53 — Compare product contracts |
| DC05 | DC54 — Identity and tenancy |
| DC06 | DC54 — Embed data with a shared boundary |
| DC07 | DC54 — Bound arrays and growing histories |
| DC08 | DC54 — References and following relationships |
| DC09 | DC58 — Snapshots and mutable projections |
| DC10 | DC59 — Variation with a contract |
| DC11 | DC58 — Deletion follows ownership and copies |
| DC12 | DC55 — Match the same array element |
| DC13 | DC55 — Missing values, types and ordering |
| DC14 | DC56 — What one document contributes to an index |
| DC15 | DC55 — Unnest, join and aggregate |
| DC16 | DC55 — Page through a changing result |
| DC17 | DC56 — Measure examined work, not returned rows |
| DC18 | DC57 — Put the precondition in the write |
| DC19 | DC57 — When one document is insufficient |
| DC20 | DC57 — Retry a request without repeating its effect |
| DC21 | DC57 — What success and a later read promise |
| DC22 | FD04 — Snapshot/stream boundary, checkpoint, replay and copy completeness; DC58 applies it to document copies and DC71 executes MongoDB streams. |
| DC23 | DC59 — Compatible readers and writers |
| DC24 | DC59 — Backfill with guarded progress |
| DC25 | DC59 — Enforcement and access-path readiness |
| DC26 | DC59 — Crossing an implementation boundary |
| DC27 | DC60 — Partition for writes and reads |
| DC28 | DC60 — Moving data does not move every bottleneck |
| DC29 | DC60 — Tenants and isolation |
| DC30 | DC60 — Budget the maintained state |
| DC31 | DC61 — Recover an application state |
| DC32 | DC61 — Choose evidence that separates causes |
| DC33 | DC61 — Control who can issue which queries; wider security external |
| DC34 | DC61 — Change versions without losing the contract |
| DC35 | DC53 — Where this collection ends; specialised engine internals excluded |
| DC36 | DC62 — BSON through local restart |
| DC37 | DC63 — Replacement through bulk results |
| DC38 | DC64 — Index choices and constraints |
| DC39 | DC64 — Explain work and changing selectivity |
| DC40 | DC65 — Intermediate documents through sharded execution |
| DC41 | DC66 — Transaction state through external effects |
| DC42 | DC68 — Discovery, pools, deadlines, cursors and bounded work |
| DC43 | DC67 — Oplog through initial sync and lag |
| DC44 | DC68 — Acknowledgement, read contracts and causal sessions |
| DC45 | DC69 — Shard-key choice and constraints |
| DC46 | DC70 — Routing through interrupted cluster changes |
| DC47 | DC71 — Events through history expiry and repair |
| DC48 | DC72 — Validators through cutover and expiry |
| DC49 | DC73 — Backup coverage through verified reconciliation |
| DC50 | DC74 — Evidence-to-cause diagnostic cases |
| DC51 | DC75 — Access baseline and supported maintenance; wider administration external |
| DC52 | DC72 — BSON round-trip and exit acceptance; other products' internals deferred |

## Reader entrances and economical routes

- **New to document persistence:** DC53 → DC54 → DC55 → DC57. Add DC56 when choosing access paths; DC58 when the design duplicates mutable data. This route can end with a reason to use relational tables plus JSON instead.
- **Choosing a service:** DC53 → the needed modelling or correctness case in DC54/DC57 → DC60–61's distribution/operating contract. Continue into the chosen implementation mechanism only when that decision depends on it.
- **Wrong array results or inflated totals:** enter DC55 directly, then DC64 or DC65 for MongoDB evidence. A fast plan is not proof of the intended result.
- **Slow MongoDB query:** enter DC74's examined-work case → DC64; DC56 supplies index-entry reasoning if needed. Pipelines go to DC65 rather than through every general page.
- **Lost updates or duplicate effects:** DC57 → DC63 for one-document changes or DC66 for cross-document transactions; DC68 when failure/visibility settings determine the user-visible result.
- **Acknowledged write appears missing:** DC68 supplies the client observation first; DC67 explains surviving history. The reader need not start with a storage-engine article.
- **Growing tenant or hot shard:** DC60 → DC69 → DC70, with DC54 if the bottleneck is one document. Do not prescribe a larger cluster before identifying the unit of contention.
- **Live schema migration:** DC59 → DC72; DC71 only when a projection or online catch-up requires streams. Migration is not made dependent on learning all of sharding.
- **Stale projection or expired stream token:** DC58 → DC71; include the repair path even when native replay is no longer possible.
- **Backup/incident/on-call work:** enter DC73 or DC74 directly. Their local diagrams expose prerequisites and point to storage, replica, query or client mechanisms only as needed. DC75 is the access/maintenance entrance.

## Evidence that changed or constrained the proposal

All sources below were browsed for scope checks on 18 October 2026. They support planning choices. Later authors must verify version, edition, defaults, commands and limits against a pinned implementation and report what actually ran. No experiment results are claimed here.

| Primary source | Planning consequence | What still needs article verification |
| --- | --- | --- |
| [MongoDB embedding](https://www.mongodb.com/docs/manual/data-modeling/embedding/) | Growth and atomic boundaries need sustained modelling; the size bound belongs to MongoDB, not the family definition | Exact BSON limits, chosen model's growth and observed update cost |
| [Multikey indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/) | Array expansion, parallel-array restrictions and uniqueness semantics justify DC56/DC64 | Current-version behaviour, rejected-write cases and actual bounds/plans |
| [WiredTiger](https://www.mongodb.com/docs/manual/core/wiredtiger/) | Cache/history/checkpoint/journal need DC62, rather than a storage paragraph in a product overview | Supported internal claims, chosen-version configuration and measurements |
| [Isolation, consistency and recency](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/) | Surviving replica history and client observation are distinct teaching jobs | Settings, session constraints and failover traces under the pinned server/driver |
| [Transaction API specification](https://specifications.readthedocs.io/en/latest/transactions-convenient-api/transactions-convenient-api/) and [Node driver transactions](https://www.mongodb.com/docs/drivers/node/v6.x/crud/transactions/) | Callback replay and commit retry justify DC66's own control-flow investigation | Selected driver version, timeouts, retry conditions and fault observations |
| [Choose a shard key](https://www.mongodb.com/docs/v8.3/core/sharding-choose-a-shard-key/) and [troubleshoot shard keys](https://www.mongodb.com/docs/manual/core/sharding-troubleshooting-shard-keys/) | Key choice must balance routing, skew and growth; active changes deserve another page | Selected release's analysis tool, uniqueness rules and change procedure |
| [Change streams](https://www.mongodb.com/docs/manual/changestreams/) | Resume-history limits require a bootstrap and repair lesson, not merely an API sample | Invalidation, lookup/preimage semantics, retained-history settings and observed restart states |
| [Validation levels](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/) | Validator rollout and historical validity are different states. Current docs include a new version-specific validation level, so a vague “strict validation certifies all data” claim would be unsafe | The exact server release and whether enforcement validates old data; native interrupted-backfill evidence |
| [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) and [backup methods](https://www.mongodb.com/docs/v8.0/core/backups/) | Replica-set dump/replay cannot stand in for arbitrary PITR or sharded consistency; DC73 needs a real restore drill | Tools/server compatibility, complete method prerequisites, managed-tier availability and sharded coordination |
| [Couchbase Query Service](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/query-service.html) and [SDK SQL++ consistency](https://docs.couchbase.com/cxx-sdk/current/concept-docs/n1ql-query.html) | Credible alternative for queryable documents; index visibility cannot be inferred from JSON shape or key-value read semantics | Chosen release, scan consistency and access paths. A Couchbase implementation branch is not yet commissioned |
| [Firestore indexing](https://firebase.google.com/docs/firestore/query-data/indexing), [offline data](https://firebase.google.com/docs/firestore/manage-data/enable-offline) and [billing](https://firebase.google.com/docs/firestore/pricing) | Client synchronisation, index requirements and charging can change the choice. The documentation's edition/operation distinctions prevent a single timeless Firestore feature verdict | Named edition/operation family, transaction/offline limits, workload charging assumptions; no invented cost benchmark |

## Hard choices, exclusions and independent-review questions

**Representative product.** MongoDB is recommended because the same implementation exposes nested indexing, flexible querying, local storage, transactions, replica history and user-chosen sharding. That lets the branch follow a single system to operational depth. This choice does not establish that MongoDB is universally preferable. Native execution avoids assuming Atlas credentials, but does not pretend that self-managed drills teach provider-specific recovery. Select the exact release at commissioning.

**Alternatives change the scope.** Couchbase would require its own data/index/query-service visibility and operation path; it is not another syntax panel inside DC64. A Firestore branch would centre client listeners, offline behaviour, security rules, query/index constraints and charging, and must name its edition/operations. A CouchDB-style offline replication/conflict branch could serve another important journey, but would need independent derivation; MongoDB replication is not a substitute. These branches are deferred, not covered by DC53's comparison. The major question for coordination is whether this initial publication should promise MongoDB operating expertise or only family-level selection; the former is the coherent scope derived here.

**Page cost.** DC61 and DC75 are the most vulnerable boundaries. They deliberately teach operating/access contracts and bounded checks, with actual deep mechanisms elsewhere and broad administration external. Independent review should challenge whether their outcomes remain coherent once briefs exist. Cutting them merely to reduce count would leave expert tasks without a route; expanding them into infrastructure textbooks would exceed the subject. DC55 also needs disciplined examples so query semantics, aggregation cardinality and pagination remain connected rather than a syntax tour.

**No inherited count.** The fourteen-product-page branch follows fourteen different investigations or practical outcomes. Its size should be challenged through duplicated teaching, omitted ability chains and the work a direct entrant must do, not by comparison with another database collection. DC64 keeps index types together, DC68 keeps client controls together and DC72 keeps compatibility work together precisely to avoid unnecessary page boundaries.

**Other boundaries.** General distributed-systems foundations remain parked; each page teaches the small local mechanism needed. Search ranking, vector indexing, time-series internals, file/blob storage, analytical engines, legal retention policy, broad application security and cloud infrastructure are outside this collection. DC35 gives a decision boundary and routes to future/external reading rather than claiming those subjects are available. Full SDK coverage and a managed-provider operations manual are excluded. Cross-family shared homes follow the field allocation; each direct entrance retains sufficient local context.

Independent review should now look for missing abilities, a better split with lower reader cost, hidden general/product duplication, an implementation page promising more mechanisms than it can teach, and a direct entrant left without a usable first step. This plan commissions no articles and authorises no publication.

## Native starting resources and review boundaries

DC62 owns the reusable pinned server/driver fixture, independent clients/roles,
reset and cleanup. DC66/DC67/DC69/DC70 extend it only for their required replica
or sharded topology. DC61 is a production-admission contract and route into actual
mechanisms, not a claim to teach every operation through a checklist. DC75's local
maintenance worksheet must demonstrate its lagging-member stop gate and the feature-
compatibility/rollback boundary; an external procedure link alone cannot replace it.
