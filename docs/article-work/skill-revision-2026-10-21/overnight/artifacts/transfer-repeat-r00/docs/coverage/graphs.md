# Graph databases: proposed coverage map

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/graphs-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/graphs-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-retrieval-analysis.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.


18 October 2026. Planning only. The independently saved [ability decomposition](../planning/databases-depth-2026-10-18/graphs-abilities.md) comes first. This proposal assigns its 60 units to bounded teaching homes. It does not change articles, routes or publication states. Titles and article identifiers below are proposed reading, not available reading. No experiment has run.

## Shape of the collection

The derivation produces four article groups: 14 general graph articles, four RDF articles, nine Neo4j articles and five Jena TDB2/Fuseki articles: **32 proposed articles**. This count is the consequence of the boundaries below. It is neither a quota nor a request to commission them all at once. GR58 is a boundary explanation, not another article. Each other unit has one full teaching home below; reminders and onward links do not acquire ownership.

Graph databases includes property graphs and RDF. The general entrance makes the choice explicit, then offers distinct journeys. RDF is substantial because identity, dataset scope, entailment, validation and property paths change what an answer means. A property-graph reader should not have to read RDF to operate Neo4j. A reader evaluating knowledge graphs should not be led to assume that Neo4j implements RDF semantics by default.

The shared example is the versioned software dependency graph specified in the abilities document. Product lessons use matching identifiers, data changes and application questions. They preserve each model's actual semantics rather than claiming that an edge with properties is equivalent to an RDF assertion in every circumstance.

## Reader entrances and local prerequisites

- **Choosing a system:** GR-A01 → GR-A02 → GR-A04 → GR-A06. Then take GR-A15–18 if shared assertions and inference determine the choice, or the relevant product branch if deployment mechanics determine it.
- **New to property graphs:** GR-A02 → GR-A04–08, followed by GR-A10–11 when analysis is needed. GR-A03 supplies history when the application needs it. Deployment and security enter through GR-A12–14.
- **A query is wrong or too expensive:** GR-A04 or GR-A05 for meaning, GR-A07 for work, then GR-A20 for actual Cypher or GR-A28 for TDB2/ARQ. Each diagnostic page supplies a small graph and a minimal description of its query bindings.
- **Building a graph from other systems:** GR-A02–03 → GR-A08–09 → GR-A13–14. The Neo4j import path is GR-A21–22; Jena's is GR-A29 and GR-A32.
- **RDF or knowledge-graph work:** GR-A01 → GR-A15 → GR-A17 → GR-A16. Add GR-A18 for federation and GR-A28–32 for Jena. GR-A15 introduces entity and assertion identity locally; this reader need not first finish all property-graph modelling.
- **Operating a chosen engine:** Neo4j GR-A19–27, or Jena GR-A28–32. Each product page names exact prerequisite units and gives enough local context to recognise their use. These branches are not nine-page and five-page mandatory onboarding sequences.

Common ideas such as a durable log, a read replica or a transaction conflict receive enough local explanation to support graph decisions. Their full shared distributed-systems teaching remains parked. The coordinated shared homes preserve these entrances.

## General graph group: GR-A01–14

### GR-A01 — Graph databases: introduction and choices

**Outcome:** defend the extra store and the graph family against the actual workload. **Entry:** ordinary data-backed application experience.

**Owned sections:** “The question and the existing database” — GR01; “Property graphs, RDF and knowledge graphs” — GR02; “Authoritative data or a projection” — GR03; “What a query language does not guarantee” — GR57. The short closing boundary “When the work becomes another subject” owns GR58 as an explicit boundary/reference status.

**Teaching and necessary change:** first explain nodes, relationships and what a connected-data question asks of them, using a tiny inspectable graph. Then work through answers to the same impact question using bounded joins, recursive reachability, graph traversal and a batch projection. Add interoperability or inference requirements, then a source withdrawal. Include JanusGraph's backend-dependent consistency as the contrasting architecture, and language portability as a separate question from storage guarantees.

**Decision and boundary:** choose a family, an authority contract or no new store. Keep these comparisons together because choosing a product before the data contract would hide its real costs. Do not expand into a vendor ranking, a Gremlin reference or graph-RAG construction.

### GR-A02 — Modelling entities and relationships

**Outcome:** produce a model with explicit identity, assertion meaning and enforceable invariants. **Entry:** the property-graph/RDF distinction from GR02, repeated in a short opening.

**Owned sections:** “Stable identity” — GR04; “Edges, events and assertions” — GR05; “Direction, multiplicity and invariants” — GR06; “Changing the model while readers remain” — GR08.

**Teaching and necessary change:** redraw a dependency edge as an assertion node when it gains independent provenance and validity. Rename a package, reimport an edge, then split a relationship type while old writers remain. The final model includes what the database can constrain and what the application must coordinate.

**Decision and boundary:** choose identity keys, edge/node boundaries and a compatibility sequence. Keep these together because the changed model tests the original meaning. Temporal encodings get their own investigation in GR-A03; actual constraint syntax belongs to the products.

### GR-A03 — Graph history and late information

**Outcome:** answer “what was true?” separately from “what did we know then?” **Entry:** entity/version identity and assertion nodes; supply a compact reminder.

**Owned sections:** “Versions and valid intervals”, “Observation time and late facts”, “Reproducing a past answer” — GR07 in full.

**Teaching and necessary change:** an interactive time view compares in-place current edges, immutable package versions and assertion/event history. Advisory `adv:17` arrives after a deployment, then is corrected. Readers inspect which historical query each encoding can support and the extra data/query work it creates.

**Decision and boundary:** choose temporal representation and retention from the promised answer. This earns a page because late facts break otherwise plausible models, and direct entrants look for historical reachability. It does not teach a general event-sourcing architecture or pretend time travel is a standard graph feature.

### GR-A04 — Patterns, paths and duplicate answers

**Outcome:** predict the bindings and multiplicity of a graph query. **Entry:** nodes, directed relationships and properties, introduced on a tiny fixture.

**Owned sections:** “From matches to rows” — GR09; “Which paths are different?” — GR10; “Existence, endpoints or every path” — GR11.

**Teaching and necessary change:** step through a diamond with two paths to `pkg:crypto@2`. Show bindings, optional matches, missing values and aggregation, then add a cycle and a zero-length case. Switch the requested result from every path to one witness to a distinct endpoint set.

**Decision and boundary:** specify the answer before choosing syntax. Keep uniqueness and duplicate counting together because they explain the same surprising result. Use illustrative notation with explicit assumptions; GR-A20 and GR-A17 own Cypher and SPARQL meanings rather than a false universal query language.

### GR-A05 — Shortest paths and bounded searches

**Outcome:** specify the route the application actually wants and keep search within its service budget. **Entry:** path meaning, witness versus enumeration and edge direction; a local diagram supplies these.

**Owned sections:** “Shortest by hops or by weight”, “Eligible routes before and after selection” — GR12; “Bounding the search and its output” — GR13.

**Teaching and necessary change:** animate an excluded shortest route beside a longer permitted route. Then vary depth, fan-out and the number of equal shortest routes. Show that a result limit is not automatically a bound on examined work. Explain the weight assumptions needed by the chosen algorithm, without a proof catalogue.

**Decision and boundary:** choose weighted/unweighted semantics, eligibility placement, tie policy and execution budget. Search meaning and its explosion remain together; planner diagnosis and product syntax live elsewhere.

### GR-A06 — How graph storage finds neighbours

**Outcome:** explain where graph-query work happens in different physical layouts. **Entry:** a selective entity lookup followed by a dependency expansion.

**Owned sections:** “Adjacency and property access” — GR14; “Indexes find starts; expansions find neighbours” — GR15.

**Teaching and necessary change:** show an indexed relational edge table, a native adjacency layout and RDF term/permutation indexes on the same small graph. Count illustrative accesses rather than report timings. Add a high-degree node, then require large relationship properties in the result.

**Decision and boundary:** choose an anchor/index/model change with the right cost model. Storage and indexes stay together because either alone encourages “index-free traversal” folklore. Exact Neo4j formats belong to GR-A19; exact TDB2 structures belong to GR-A28. No format is presented as the defining implementation of graphs.

### GR-A07 — Why a small graph query does so much work

**Outcome:** diagnose excessive work before changing hardware. **Entry:** bindings, selective anchors and expansion; a small local fixture restores the context.

**Owned sections:** “Degree skew and cardinality estimates” — GR16; “Streaming, sorting and retained results” — GR17; “A representative workload test” — GR18; “Concurrency and the working set” — GR30.

**Teaching and necessary change:** compare estimated and actual intermediate counts, then replace uniform data with a utility hub. Add `distinct`, collection and concurrent requests; trace retained state, cache pressure and cancelled work. Finish with a reproducible benchmark specification covering equal semantics, cache state, update load and tail latency.

**Decision and boundary:** choose query/model repair, budgets, indexes or capacity, and know what evidence would distinguish them. Keep measurement beside diagnosis so readers cannot mistake fewer returned rows for less work. Product metrics and exact operators remain in their branches.

### GR-A08 — Correct graph mutations under concurrency

**Outcome:** derive the transaction/locking requirement from an invariant and make retries safe. **Entry:** explicit graph invariants; introduce read visibility and conflicting writes locally.

**Owned sections:** “Atomic endpoints and cross-graph rules” — GR19; “Identity, retries and uncertain completion” — GR20.

**Teaching and necessary change:** two concurrent dependency additions each pass a cycle check but jointly introduce a cycle. Contrast uniqueness with traversal-dependent rules. Drop a commit acknowledgement, retry the mutation, and inspect stable keys, duplicate prevention and external side effects.

**Decision and boundary:** choose an atomic operation, constraint or serialisation strategy with a known contention cost. Keep retries with mutation correctness because failure changes what “apply once” means. This is graph-specific invariant reasoning; it does not derive general isolation theory or promise one engine's locks everywhere.

### GR-A09 — Loading and synchronising a graph

**Outcome:** complete a verifiable load and keep a derived graph aligned with its source. **Entry:** identity and retry-safe mutation; a local source/graph diagram states the authority contract.

**Owned sections:** “Resolving endpoints and choosing a loader” — GR21; “Ordered changes, tombstones and reconciliation” — GR22.

**Teaching and necessary change:** load nodes and edges with one missing endpoint, then move from initial load to live changes. Delay a create until after its delete and show the resurrected fact. Track a watermark, exceptions and source-to-graph reconciliation rather than declaring a batch complete because it ran.

**Decision and boundary:** choose bulk or online ingestion, cutover, freshness measurement and repair. Keep initial and ongoing loads together because the handover is where apparently correct imports become incorrect services. Queue delivery implementation stays outside; product commands stay in GR-A21 or GR-A32.

**Coordinated scope:** FD04 owns generic transport order, replay and capture
completeness. GR21/GR22 here own graph endpoint resolution, assertion/edge identity,
dangling relationships and graph-specific deletion/reconciliation. The missing
endpoint and stale-edge cases must still finish at a checked graph state.

### GR-A10 — What graph algorithms tell you

**Outcome:** select and interpret a small useful family of computations. **Entry:** directed paths and an explicit sentence defining the analysis graph.

**Owned sections:** “Reachability and components”, “Weighted routes”, “Centrality and communities” — GR25 in full.

**Teaching and necessary change:** use the package graph to compare dependency impact, weak/strong components, weighted routes and a chosen centrality/community example. Change edge direction or add a popular utility package; explain why a large component is not automatically a meaningful community and a high rank is not an application risk score.

**Decision and boundary:** choose an algorithm because its output answers a decision. A focused set of worked outputs is faster than an algorithm catalogue. Projection mechanics and running cost get GR-A11; graph ML, embeddings and proofs are explicit boundaries under GR58.

**Ownership clarification:** weighted shortest-route semantics and algorithm
assumptions have one full home at GR-A05/GR12. Here they receive only a reminder
and application. GR25 owns interpretation of the chosen reachability/component
and centrality/community outputs; use the dependency decision to choose which
outputs matter rather than introducing a catalogue of algorithms.

### GR-A11 — Building and running an analytical graph

**Outcome:** make an analysis reproducible and fit it to a computation setting. **Entry:** the selected algorithm and its output meaning.

**Owned sections:** “Projection choices change the question” — GR24; “Memory, iterations and execution setting” — GR26; “Versioning and retiring results” — GR27.

**Teaching and necessary change:** filter a time slice, reverse edges, collapse parallel assertions and project only needed properties. Expose projected edges and work arrays. Grow the dataset beyond memory and change the source while analysis runs; follow stale labels into a consumer's wrong answer.

**Decision and boundary:** choose online traversal, in-memory projection or a batch engine; define snapshot and result provenance. Keep projection, cost and result lifecycle together because the purported answer is one computation over one input. GR-A27 supplies an actual GDS implementation; no browser model is a real distributed computation.

### GR-A12 — Replicating and partitioning connected data

**Outcome:** choose an availability and placement design with explicit answer guarantees. **Entry:** transaction completion and graph expansion, reintroduced locally.

**Owned sections:** “Copies, routing and reads after writes” — GR28; “Cuts, remote expansions and transaction scope” — GR29.

**Teaching and necessary change:** compare a replicated graph with a graph split across tenants. Route a read to a lagging copy after an edge insertion. Then add shared package nodes and inspect remote hops, a hot vertex and an invariant whose writes cross the cut.

**Decision and boundary:** distinguish read scaling from graph-capacity scaling, and identify a viable partition key or choose a single-machine graph. Keep the two designs together because confusing copies with partitions is a consequential deployment error. Consensus proofs remain parked; actual Neo4j architectures belong to GR-A24.

### GR-A13 — Recovering a graph service

**Outcome:** specify and test recovery of the useful application state. **Entry:** authoritative versus projected data, durable commit and a snapshot definition, all supplied briefly.

**Owned sections:** “Restart, backup and recovery target”, “Dependent state and reconciliation”, “Proving a restore useful” — GR31 in full.

**Teaching and necessary change:** show a crash before/after durable commit, then recover before a bad deletion. Follow a later valid dependency change, ingestion position, vocabulary/configuration version and analytical output into the recovered service. Readers specify what is replayed, rebuilt or manually reconciled and measure RPO/RTO against the complete operation.

**Decision and boundary:** choose protection and a recovery runbook that restores correct answers. It earns a direct operations entrance because a structurally sound graph can still return a historically inconsistent application answer. Product backup formats and commands belong to GR-A25 and GR-A32.

### GR-A14 — Access, disclosure and deletion in graphs

**Outcome:** define and verify the visibility contract for connected answers and the lifetime of private facts. **Entry:** tenant ownership and a query that returns a path.

**Owned sections:** “Visible entities and hidden paths” — GR32; “Deleting facts across copies and derivations” — GR23.

**Teaching and necessary change:** put a private deployment between public package nodes, then ask for a path, a count and an analytical score. Delete one tenant while preserving shared package facts; inspect assertions, projections, derived outputs, exports and backup policy.

**Decision and boundary:** choose a database/graph boundary or enforceable policy, plus an erasure contract. Keep read visibility and deletion together because both define which facts an application is entitled to retain and disclose. Identity-provider design and a general legal compliance programme are external boundaries; actual grants and endpoint access tests belong to the products.

## RDF group: GR-A15–18

### GR-A15 — RDF identity, datasets and provenance

**Outcome:** combine assertions without silently merging identities or losing their source. **Entry:** a brief RDF/property-graph distinction; no Cypher prerequisite.

**Owned sections:** “IRIs, literals and blank nodes” — GR33; “Default graphs, named graphs and assertions” — GR34.

**Teaching and necessary change:** import two advisory datasets with reused blank-node labels, language/datatype variants and conflicting facts. Show exactly what an IRI identifies, what a named graph scopes, and why a graph name alone does not establish truth, authorship or trust. Compare a versioned assertion resource with release-specific RDF annotation facilities without assuming they have identical semantics.

**Decision and boundary:** choose stable identifiers, source graph boundaries and a provenance encoding. Identity and dataset scope stay together because merging is the operation that exposes their difference. Recheck RDF 1.2 status and engine support at commissioning; the initial portable baseline is RDF 1.1.

### GR-A16 — Inference and validation in RDF

**Outcome:** say which answers are asserted, derived, unknown or rejected, including after updates. **Entry:** terms and dataset scope; supply one example triple locally.

**Owned sections:** “What absence and vocabulary statements mean” — GR35; “What a shape checks, and when” — GR36; “Computing and maintaining entailments” — GR39.

**Teaching and necessary change:** use a domain declaration to derive a type, then show why this is not a validation error. Apply a shape to the selected data view. Delete an asserted edge with two derivations of the same inferred fact, then change the vocabulary. Trace materialised versus query-time work and the transaction boundary around validation.

**Decision and boundary:** choose an entailment fragment, validation scope and update contract. Keep inference and validation together because confusing them produces the wrong data acceptance policy. Full ontology design and arbitrary OWL reasoning stay outside; Jena configuration and actual support live in GR-A30.

**Equality case:** combine two sources that use different IRIs for a possibly
identical package. Compare keeping both names, asserting equality supported by the
chosen entailment fragment, and recording only a weaker correspondence. Show the
changed inferred query answers and the effect of a source withdrawal. If equality
reasoning is outside the selected reasoner, preserve the mapping as data rather
than silently merging entities. GR-A15 links to this case; no full OWL catalogue
is implied.

### GR-A17 — SPARQL answers and property paths

**Outcome:** predict bindings and reachability under an explicit dataset and entailment regime. **Entry:** RDF terms and datasets; give a two-triple join locally.

**Owned sections:** “Joins, optional values and missing facts” — GR37; “What a property path returns” — GR38.

**Teaching and necessary change:** step through a small query with duplicate bindings, `OPTIONAL`, filters, aggregates and a negation case. Add a cycle, a zero-length path and a second named graph. Contrast endpoint reachability with the witness/path/weight questions a property path does not automatically answer.

**Decision and boundary:** choose a query and graph scope with the intended meaning. Keep patterns and paths together because a path expression participates in the same solution bindings. Avoid a syntax reference; physical plans belong to GR-A28, federation failures to GR-A18.

### GR-A18 — Querying across RDF endpoints

**Outcome:** decide whether federation can provide a sufficiently complete, private and reproducible answer. **Entry:** SPARQL bindings and dataset scope; a local endpoint diagram supplies the deployment context.

**Owned sections:** “Moving bindings between endpoints”, “Failure and partial answers”, “Source versions and query disclosure” — GR40 in full.

**Teaching and necessary change:** join a local deployment graph to two remote advisory endpoints. Count the bindings sent, time out one source and change another mid-query. Compare failing the request, explicitly marking a partial result and importing a versioned local copy. Include controls over remote targets and credential forwarding.

**Decision and boundary:** choose federation, caching/materialisation or a narrower answer contract. It earns a page because endpoint failure and disclosure are not SPARQL punctuation. It does not teach distributed join algorithms exhaustively or promise a transaction across independent services.

## Neo4j group: GR-A19–27

This is a coherent initial product branch, not a single “Neo4j” overview. Use a pinned supported release with an explicit Cypher version. Community supplies accessible model/query/local transaction exercises. Enterprise-only clustering, fine-grained permissions and online backup need a separately labelled environment; Aura has a separate service boundary. GDS is an additional component. Licence/access limits are environment requirements, not lessons inferred from a local Community instance.

### GR-A19 — Neo4j stores, caches and resource pressure

**Outcome:** connect an observed access pattern to the specified storage format and memory budget. **Entry:** GR14–15; a local diagram distinguishes graph structure from properties.

**Owned sections:** “Aligned and block storage” — GR41; “Page cache, heap and transaction memory” — GR60.

**Teaching and necessary change:** source-backed layout figures show actual format differences, density and property access. Real plan/metric exercises compare a selective read, a hub expansion and a retained result under concurrent requests. Change heap/page-cache allocation and explain why more heap may not fix the problem.

**Decision and boundary:** choose a format/environment or repair the measured bottleneck. Store layout and its memory consequences remain together. Durable log/restart gets GR-A23; a capacity number is not a universal sizing recommendation.

### GR-A20 — Reading and improving Cypher plans

**Outcome:** execute precise Cypher and diagnose the work it performs. **Entry:** GR09–17; a minimal fixture and binding reminder support direct entrants.

**Owned sections:** “Cypher and path-version semantics”, “Anchors, indexes and statistics”, “Estimated and actual operators” — GR42 in full.

**Teaching and necessary change:** execute the diamond/cycle fixture, constrained shortest-path case and skewed utility hub with pinned syntax. Inspect `EXPLAIN`/`PROFILE` results, row estimates, actual rows, database hits, memory and available timing evidence. Add an index, then change the start/selectivity; keep the expensive expansion visible.

**Decision and boundary:** choose a rewrite, useful index, bound or updated statistics. One query investigation can hold syntax and operators because readers see how their exact request becomes work. It does not re-teach all pattern semantics or imply that a plan observation establishes a benchmark.

### GR-A21 — Neo4j schema, import and cutover

**Outcome:** build and migrate the versioned graph with verified identity and a complete ingestion handover. **Entry:** GR04–08 and GR20–22; local entity keys are restated.

**Owned sections:** “Constraint and index readiness” — GR43; “Bulk import, transactional batches and live cutover” — GR47.

**Teaching and necessary change:** real commands create supported constraints and import the fixture. Show two simultaneous imports without the required uniqueness protection; then add a missing endpoint, a retry and a live writer during migration. Inspect reconciled counts/keys and query results, not only loader success.

**Decision and boundary:** choose a loader and compatibility/cutover sequence. Keep schema with import because loader identity assumptions must match installed constraints. Administrative imports are not represented as ordinary online transactions; exact availability and edition must be verified.

### GR-A22 — Neo4j concurrent writes and driver requests

**Outcome:** defend the complete request's correctness under concurrency and retry. **Entry:** GR19–20; show two short sessions locally.

**Owned sections:** “Read committed, lock scope and deadlocks” — GR44; “Managed retries, results and bookmarks” — GR45.

**Teaching and necessary change:** run a lost-update or read-check-write case and the graph invariant case with competing sessions. Inspect the corrected lock/constraint strategy and its contention. Then fail a request after commit, retry a managed callback and expose a duplicated external side effect; show result consumption and the causal context handed to a later read.

**Decision and boundary:** choose an implementable mutation and retry protocol. Keep database and driver together because the application request is the unit the user cares about. Cluster topology is GR-A24; do not claim a bookmark creates serializable isolation.

### GR-A23 — Neo4j durable commits and restart

**Outcome:** explain what survives a crash and what checkpointing and retention change. **Entry:** GR19 and GR31; a short log/store diagram provides local context.

**Owned sections:** “Commit and the transaction log”, “Checkpoint and restart”, “Retention and disk exhaustion” — GR46 in full.

**Teaching and necessary change:** source-backed state diagrams follow a committed graph update from log to store, with a pinned local crash/restart exercise where feasible. Vary checkpoint timing and retention, distinguish an acknowledged commit from an unacknowledged request, and inspect the recovered graph. A separate disk-pressure case explains why retaining logs has an operational cost.

**Decision and boundary:** choose a retention/restart policy with the actual failure assumptions. This deserves its own mechanism investigation; a backup checklist cannot explain it. Backup-chain restoration and its commands belong to GR-A25.

### GR-A24 — Neo4j clustering and scaling choices

**Outcome:** operate a replicated database and recognise when a different scaling mechanism is needed. **Entry:** GR28–29 and GR45–46; locally distinguish a database copy from a partition.

**Owned sections:** “Primaries, secondaries, routing and failover” — GR48; “Whole copies, composite databases and property sharding” — GR49.

**Teaching and necessary change:** in a labelled Enterprise environment, route a write/read chain and remove a member, verifying observed behaviour and bookmarks. Compare documented architectures when properties grow beyond the intended host but the structural graph remains manageable. Explain that current property sharding separates property storage from a graph shard; it is not arbitrary graph-structure partitioning.

**Decision and boundary:** choose replication, explicit federation or an eligible property-sharding design. Keep the comparison near operational topology so “add replicas” is not offered as every capacity fix. The initial hands-on scope is standard clustering. Full Infinigraph provisioning/resharding is deferred external implementation work requiring subscription access and a separate commission; no production proficiency claim is made for it.

### GR-A25 — Neo4j backup, restore and reconciliation

**Outcome:** recover a known application state from a verified product backup chain. **Entry:** GR31 and GR46/48; standalone readers receive a short topology distinction.

**Owned sections:** “Full and differential artifacts”, “Restore destination and recovery target”, “System state and application reconciliation” — GR59 in full.

**Teaching and necessary change:** run a real backup/restore in the eligible environment, remove an artifact to expose a broken chain, and recover the bad-delete case to a separate database. Verify identity constraints, later valid changes, ingestion positions, dependent GDS results and relevant configuration/security state. Include the clustered restore boundary and version compatibility.

**Decision and boundary:** choose cadence, retention and a tested destination/runbook from RPO/RTO. Recovery gets a separate page because success is a demonstrated restored service, not restart or replication. Do not imply a data backup automatically includes every system, credential or external component.

### GR-A26 — Verifying Neo4j access controls

**Outcome:** prove the chosen tenant/role policy for actual queries, properties and procedures. **Entry:** GR32; locally state the protected private deployment and its intended visibility.

**Owned sections:** “Edition and privilege scope”, “Path and property visibility”, “Procedures and adversarial checks” — GR50 in full.

**Teaching and necessary change:** execute allowed/denied operations as actual principals in the specified edition. Test direct reads, paths, counts, schema/metadata exposure, a procedure and analytics access. Add one shared public package and verify that the policy still excludes private associations.

**Decision and boundary:** choose database separation or a supported policy that passes the tests. This earns a direct operations entrance because a correct query as administrator proves nothing about isolation. Network/TLS configuration is enough to define the test environment; a general identity platform is outside.

### GR-A27 — Neo4j Graph Data Science in practice

**Outcome:** run one accountable analytical workflow and distinguish its state from the transactional graph. **Entry:** GR24–27; a local paragraph defines the projection and intended result.

**Owned sections:** “Projection and catalogue lifetime”, “Memory estimate and execution modes”, “Writing and retiring a result” — GR51 in full.

**Teaching and necessary change:** execute a supported projection and one justified component/centrality workflow. Inspect memory estimates, run identity and `stream`/`mutate`/`write` effects. Change the source after projection and show the stale analytical answer; refresh and retire results deliberately. Label GDS version and edition separately from database version.

**Decision and boundary:** choose projection scope, memory budget and result publication/lifecycle. Keep this workflow together because projection-only or algorithm-only instructions hide stale state. Algorithm taxonomy stays in GR-A10; GDS installation does not establish that every advanced feature is licensed or available.

## Jena TDB2/Fuseki group: GR-A28–32

This branch provides coherent RDF implementation depth rather than scattering unexecuted Jena snippets across general pages. Pin Jena, JVM and Fuseki versions. TDB2 is a single-machine store; Fuseki is the endpoint layer. A reverse proxy or multiple endpoint processes does not turn one TDB2 directory into a distributed database. No Jena cluster implementation is promised.

### GR-A28 — TDB2 storage and SPARQL execution

**Outcome:** explain the physical work of an RDF query and inspect ARQ/TDB2 behaviour. **Entry:** GR14–17 and GR33–38; local terms and a two-pattern join support the direct entrant.

**Owned sections:** “Term IDs and triple/quad indexes”, “ARQ algebra and join ordering”, “Statistics and observed work” — GR52 in full.

**Teaching and necessary change:** source-backed diagrams trace term lookup and an index order. Real queries compare a restricted named graph and a larger union, then add skew and inspect available explanation/logging facilities. Identify which evidence is a plan, a documented mechanism or an observed result.

**Decision and boundary:** choose dataset scope, query shape, statistics or model repair. Keep layout and execution together because RDF indexing is how these joins obtain facts. Verify TDB2 details against generation-specific source; TDB1 journal behaviour is not a substitute.

### GR-A29 — Transactions and updates in TDB2/Fuseki

**Outcome:** place a business change within a real atomic RDF update boundary. **Entry:** GR19–20 and RDF graph scope, repeated with one update.

**Owned sections:** “TDB2 readers, writer and snapshots”, “Java transaction scope”, “HTTP update and graph-store boundaries” — GR53 in full.

**Teaching and necessary change:** inspect the documented copy-on-write transaction mechanism and run competing reader/writer cases. Contrast a single transactional update with two independent HTTP operations. Fail a multi-step business edit between calls, then implement a supported atomic or explicitly reconciled version and verify resulting triples.

**Decision and boundary:** choose an API/update boundary, retry identity and appropriate contention expectations. This page earns its space because a SPARQL language standard does not by itself define a server's multi-request transaction. Do not promise unlimited practical transaction size merely because TDB2 removes a TDB1 limit.

### GR-A30 — Configuring inference and validation in Jena

**Outcome:** expose exactly the asserted, inferred and validated view the application expects. **Entry:** GR35–39 and the transaction boundary from GR53.

**Owned sections:** “Storage and configured inference views”, “Supported reasoners and dataset composition”, “SHACL invocation and update/restart behaviour” — GR54 in full.

**Teaching and necessary change:** configure a small supported reasoner and a shape check, identifying the storage layer, view and actual validation call. Remove one of two justifications, alter the vocabulary, make a concurrent update and restart the service. Record which result follows automatically and which requires rebuilding or application orchestration.

**Decision and boundary:** choose the supported inference fragment and acceptance/view lifecycle. Keep configuration and failure cases together: the feature name cannot prove that a deployed endpoint uses it. Full ontology engineering and unsupported global materialisation promises stay outside.

### GR-A31 — Serving RDF safely with Fuseki

**Outcome:** expose a least-privilege endpoint with an explicit dataset and remote-access policy. **Entry:** GR32, GR34 and GR40; provide the desired read/update/admin permissions locally.

**Owned sections:** “Datasets and service operations”, “Authentication and access scope”, “Remote services and adversarial requests” — GR55 in full.

**Teaching and necessary change:** configure actual query/update and administrative boundaries, using the server variant's documented security facilities. Try a write as a read-only user, access a different graph/dataset and attempt an unintended remote service target. Distinguish operation-level protection from graph-level filtering rather than assuming both are supplied by the same switch.

**Decision and boundary:** choose separate datasets/services or an implemented policy with tests. Endpoint security gets its own page because opening a query URL changes the trust boundary. Networking and credentials are environment prerequisites, not a general security course.

### GR-A32 — Maintaining and restoring TDB2/Fuseki

**Outcome:** load, compact, back up and restore the complete chosen RDF service. **Entry:** GR21–23, GR30–31 and GR52–55; locally identify storage versus service configuration.

**Owned sections:** “Loader and process ownership”, “Compaction generations and write pauses”, “Consistent RDF backup and a verified reload” — GR56 in full.

**Teaching and necessary change:** run an eligible loader and validate endpoint coverage; show why two processes must not directly share a live directory. Observe compaction and retained generations in a disposable local dataset. Restore a consistent backup after a bad deletion, reconcile later valid data, then restore the endpoint configuration and inference/validation view separately. Measure the whole recovery operation.

**Decision and boundary:** choose maintenance windows, backup/export policy and a tested reload procedure. These stay together because TDB2's small operational model lets one lifecycle investigation carry the necessary mechanisms. The page explicitly differs from Neo4j log-chain recovery; it does not invent TDB2 point-in-time recovery or clustering.

## Boundary register

| Unit or subject | Full home or explicit status | Why |
| --- | --- | --- |
| GR58 | GR-A01, brief boundary plus references | Enough to recognise graph ML, graph theory, extraction and ontology work that needs a separate commission; no extra article |
| Gremlin and other property-graph languages | GR57 in GR-A01, one portability comparison and external reference | Show traversal order/execution and backend-dependent guarantees; a second language manual does not improve the selected branch |
| JanusGraph internals and operation | Contrasting documented mechanism under GR57; full product branch deferred | Useful evidence against universal Neo4j guarantees; backend combinations need their own coherent commission |
| Infinigraph operations | GR49 comparison in GR-A24; full deployment/recovery exercise deferred | Subscription availability and architecture are material; current primary docs permit a scoped choice but not an unrun operational proficiency claim |
| Other RDF products and managed Neptune | Conditional alternatives in GR-A01/18; full product mechanisms deferred | Compare model, query and deployment contracts when they affect the decision; do not borrow Jena limits or Neo4j internals |
| RDF 1.2 and SPARQL 1.2 | Current-status note in GR-A15/17; exact adopted features require rechecking | Draft/candidate status and product adoption cannot be inferred from a standard's existence |
| Full ontology design and OWL reasoning | GR58 boundary; GR35/39 teach only the fragment needed for storage/query choices | These can become separate disciplines without improving this reader's data-system decision |
| Graph ML, embeddings, graph RAG and extraction evaluation | GR58 boundary and onward reference | Algorithm output, vector retrieval, extracted-fact quality and storage correctness are different obligations |
| Generic consensus, messaging delivery, identity platforms and distributed-systems programme | Parked/shared-field boundaries | Teach local database consequences; do not start the parked shared programme |
| General relational engine internals | External home in the relational collection (RL86–RL87, RL92, RL95); a small indexed-edge example in GR-A01/06 is local | The comparison must be credible without requiring a whole prior collection |

## Implementation and evidence conditions

The primary-source checks in the abilities artifact remain part of this proposal's evidence. The following checks sharpen the product and standard boundaries. They were inspected on 18 October 2026 as planning sources, not executed article claims.

- [Neo4j property-sharding overview](https://neo4j.com/docs/operations-manual/current/scalability/sharded-property-databases/overview/) describes one structural graph shard with separate property shards and an additional Infinigraph subscription; [administration](https://neo4j.com/docs/operations-manual/current/scalability/sharded-property-databases/admin-operations/) adds log-retention/replica-lag consequences. This supports a deliberately limited architectural comparison, with a separate implementation commission if chosen.
- [Neo4j restore](https://neo4j.com/docs/operations-manual/current/backup-restore/restore-backup/) has clustered-destination and version constraints; [online backup](https://neo4j.com/docs/operations-manual/current/backup-restore/online-backup/) describes full/differential chain requirements. These justify a separate restore investigation rather than treating clustering as recovery.
- [TDB2](https://jena.apache.org/documentation/tdb2/) establishes transactional-only and single-machine scope. [TDB architecture](https://jena.apache.org/documentation/tdb/architecture.html) is shared documentation with generation differences. GR-A28–29 must verify the exact TDB2 transaction/layout account in pinned source and runtime rather than repeat a TDB1 journal explanation.
- [Jena inference](https://jena.apache.org/documentation/inference/) and [Jena SHACL](https://jena.apache.org/documentation/shacl/) describe facilities that must be composed with the selected store/endpoint. They do not prove that an arbitrary Fuseki configuration applies inference or validates every update.
- [Fuseki security](https://jena.apache.org/documentation/fuseki2/fuseki-security.html) makes server variants and configured access relevant; it does not license assuming graph-level permissions from a protected HTTP endpoint.
- [RDF 1.2 concepts](https://www.w3.org/TR/rdf12-concepts/) was a Candidate Recommendation Snapshot dated 7 April 2026 when inspected. [SPARQL 1.2 query](https://www.w3.org/TR/2026/WD-sparql12-query-20261011/) is a Working Draft dated 11 October 2026 and identifies SPARQL 1.1 as its latest Recommendation. The initial portable teaching baseline remains RDF/SPARQL 1.1, with a bounded current-development note and recheck at commissioning.

A browser graph model can reveal binding multiplicity, path explosion, layouts, lock schedules and projection memory. It cannot establish real isolation, durability, permission enforcement, cluster recovery or engine performance. Those require the labelled external exercises above, with version/configuration, request, output and resulting state saved. If the required environment is unavailable, publish no claim that it ran; narrow the lesson to a documented mechanism or leave execution uncommissioned.

## What reviewers should challenge

The hardest scope decision is the second implementation family. Jena adds five pages, but it avoids promising RDF expertise after only an RDF vocabulary comparison. Reviewers should test whether the intended finish line truly includes operating an RDF system. If it does not, narrow the stated finish line and defer the whole Jena branch visibly rather than compress five mechanisms into a token product page.

Page-cost pressure is highest at GR-A03 (one temporal unit but a distinct investigation), GR-A10/11 (interpreting algorithms versus operating an analysis), GR-A16 (three related semantic obligations), GR-A18 (federation's direct entry), and GR-A30 (configured views rather than storage). Try removing or merging each and identify the reader mistake that returns; do not decide by matching another collection's count. GR-A07 and GR-A24 are the main risks of overpacking. The former must stay a coherent diagnosis with a measured next decision; the latter has a standard-cluster execution core and explicitly bounded architecture comparisons.

The major uncertainty is access to current Enterprise/Infinigraph environments and the exact Jena inference/validation composition needed by the running application. Neither uncertainty permits inventing guarantees. Product commands, permissions, current defaults, standard adoption and measured costs need new verification during authoring. The model and source contracts also need independent practitioner review: package dependency semantics differ by ecosystem, so the teaching fixture must state optional, transitive and version-resolution assumptions rather than masquerade as a complete package manager.

No article count is sacred. A defensible revision changes an ability chain, its teaching form or a reader's route and then updates both artifacts. Independent review should first derive missing abilities without being led through this page tree.
