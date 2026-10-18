# Graph databases: independently derived practitioner abilities

18 October 2026. Planning only. This decomposition was saved before assigning units to pages. It was derived without reading existing article outlines, inventories, coverage maps, previous proposals or the other collections' derivations. The planning, style, research and depth-and-experiments guidance informed the method. No experiments have run.

## Audience and finish line

The reader can build an ordinary data-backed application but need not know a graph query language, RDF, graph algorithms or a particular database. They need to choose a representation for connected data, get the intended answer at a defensible cost, keep the graph correct as it changes, and recover and protect it in service. An expert can explain why a returned path means what the application thinks it means, and why a seemingly small graph query can examine an enormous amount of data.

A graph database collection must cover two substantial families. Property graphs make labelled entities and attributed relationships convenient to query and update. RDF graphs express statements using shared identifiers, with datasets, entailment and query semantics that introduce different correctness obligations. A knowledge graph is an application and modelling ambition, not a storage format or a promise of automatic reasoning. Either family can support one. Neither inherits the other's semantics merely because both draw edges.

The finish line includes choosing a credible alternative: indexed relational edges for bounded joins, a recursive query for modest reachability, a batch graph engine for large repeated analysis, or an RDF store when interoperable assertions and formal semantics are central. It does not require implementing every graph algorithm, mastering arbitrary ontology logic or operating every distributed engine.

## Running data

Use a software dependency and ownership graph, with explicit versions. `pkg:api@7` depends on `pkg:auth@3`; `pkg:auth@3` depends on `pkg:crypto@2`. `pkg:worker@4` also depends on `pkg:crypto@2`. Advisory `adv:17` affects the crypto version. Teams own packages, deployments install versions, and source assertions carry `source`, `observedAt` and validity intervals. A shared utility version supplies a high-degree hub. A tenant owns each deployment; public package facts are shared.

This supports impact paths, repeated paths to the same package, cycles introduced by bad imports, concurrent dependency edits, stale advisory feeds, temporal answers, private paths through shared data and lost or replayed updates. RDF uses stable IRIs for the same identifiers and named source graphs; property-graph assertions with their own identity become assertion/event nodes where needed. Do not silently treat these encodings as lossless equivalents.

## Ability chains

Each row ends in a teachable unit with a unique `GRnn` identifier. “Needs” identifies understanding rather than a required whole article. M means a visible mechanism; W means worked cases; E means real execution in an external local database; S means a short explanation; R means an explicitly bounded external reference. The variation is necessary teaching material, not a claim about an experiment already performed.

### Choose a representation and a system boundary

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure the reader must explain |
| --- | --- | --- | --- |
| Defend adding a graph store | Workload questions, traversal depth and update ownership → **GR01** compare graph storage with indexed edges, recursive queries and an analytical projection on the same question | Ordinary data modelling; W | A two-hop lookup remains cheap in the current database; an exploratory variable-depth workload changes the case |
| Distinguish the families | Graph as data model versus physical storage and application vocabulary → **GR02** choose property graph, RDF or neither, including what “knowledge graph” does and does not specify | GR01; W | Shared identifiers and inference requirements appear after an initially local relationship application |
| Decide whether the graph is authoritative | Source of truth, derived views, freshness and ownership → **GR03** define a graph's contract with its source systems | GR01; W | An advisory is withdrawn after consumers have copied it |

### Model relationships whose meaning survives change

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Keep one entity one entity | Business identity, internal IDs, identity resolution and uniqueness → **GR04** stable entity and relationship identity | GR02; W | A renamed package creates a duplicate; repeated imports create duplicate edges |
| Choose an edge or a node | Binary edges, relationship attributes and independently identifiable assertions → **GR05** encode events, n-ary facts and provenance without losing participants | GR04; W | A dependency assertion has two sources that disagree about its validity |
| State graph invariants | Direction, multiplicity, types, endpoint constraints and application rules → **GR06** write the invariants the graph must preserve | GR04–05; W | “At most one current owner” and “dependency graph is acyclic” are not ordinary endpoint checks |
| Answer historical questions | Valid time, observation time and version identity → **GR07** choose snapshot/version/event encodings for temporal answers | GR05; M/W | An advisory arrives late; yesterday's impact answer must remain reproducible |
| Change a live model | Compatibility between old readers, new writers and migrated facts → **GR08** evolve relationships and schemas safely | GR06–07; W | A relation is split into direct and optional dependencies while old writers remain |

### Ask a precise question and bound its work

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Read the answer rather than the drawing | Match bindings, multiplicity, missing properties, optional matches and aggregation scope → **GR09** derive pattern results row by row | GR04–06; M/W | Two paths reach one affected package and double-count it; an optional filter discards unmatched rows |
| Specify which paths count | Walk, trail and simple path; length zero, direction and cycles → **GR10** state path uniqueness and length semantics independently of syntax | GR09; M | Adding one reverse edge changes termination and the number of paths |
| Avoid enumerating what was not requested | Reachability, existence, endpoint sets and witness paths → **GR11** choose the smallest sufficient result | GR09–10; M | The application wants one affected deployment but asks for every possible witness |
| Obtain the intended “shortest” result | Hops versus weights, admissibility, ties and filter placement → **GR12** distinguish constrained shortest path from filtering the shortest answer | GR10–11; M/W | The shortest route crosses an excluded dependency; a longer valid route exists |
| Make path queries safe in service | Branching, depth, output size, timeout and cancellation → **GR13** put bounds and resource budgets on exploratory queries | GR10–12; M/W | One shared utility hub increases candidate paths while result count stays small |
| Explain storage cost | Adjacency, edge lists, triple permutations and property fetches → **GR14** trace graph access without assuming all stores use pointer chains | GR04, GR09; M | A query returns only IDs, then begins fetching large properties |
| Index the right part | Selective anchors, adjacency expansion, relationship properties and alternative join starts → **GR15** separate finding a start from traversing neighbours | GR14; M | An index fixes a scan but the next high-degree expansion remains expensive |
| Diagnose growth | Degree distribution, cycles, intermediate cardinality, join order, statistics and correlation → **GR16** explain plan estimates and actual work on skewed graphs | GR09, GR13–15; M/W | An average-degree fixture misses a production hub; stale estimates choose a bad start |
| Handle blocking work | Sort, distinct, collect, aggregation and materialised intermediate results → **GR17** budget memory and streaming at each query stage | GR09, GR16; M | A streamed expansion becomes a large retained result after `collect` |
| Compare systems fairly | Data distribution, semantics, cache state, concurrency, latency tails and maintenance → **GR18** construct a workload test that preserves the actual question | GR01, GR13–17; W/E | A benchmark caps paths in one engine but enumerates all paths in another |

### Preserve correctness while facts change

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Choose atomic work | Read visibility, write conflict, lost update, endpoint lifetime and cross-record invariants → **GR19** relate a graph invariant to the transaction guarantee it needs | GR06, GR09; two-writer M/E | Two individually valid edits jointly introduce a dependency cycle |
| Ingest under retries | Stable keys, constraints, idempotency, uncertain commit and partial batches → **GR20** make repeatable graph mutations | GR04, GR19; W/E | The server commits a batch but the client misses the acknowledgement |
| Load and migrate large graphs | Endpoint resolution, ordering, missing references, index build and cutover → **GR21** choose bulk loading versus online ingestion | GR08, GR20; W/E | The edge file arrives before its nodes; an incremental load races with a rename |
| Keep a projection honest | Change order, tombstones, late events, reconciliation and replay boundaries → **GR22** maintain a source-derived graph with measurable freshness | GR03, GR07, GR20; M/W | Delete is followed by delayed create; repair brings the dead entity back |
| Delete what the application promised | Detachment, shared nodes, evidence retention, derived scores, exports and backups → **GR23** define deletion and erasure across graph copies | GR03, GR05, GR22; W | Deleting a tenant must preserve shared package facts while removing private assertions |

### Use graph algorithms as accountable computations

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Prepare the right graph | Directed versus undirected, weighting, deduplication, self-loops and time cutoff → **GR24** make an explicit analytical projection | GR07, GR10; M/W | Collapsing parallel dependencies changes weights and the rank order |
| Pick an algorithm for a decision | Reachability and components, weighted routing, centrality and community assumptions → **GR25** interpret a small useful set of algorithm outputs | GR12, GR24; M/W | A large component is mistaken for a tightly connected cluster; popularity is mistaken for risk |
| Bound computation and freshness | Memory, repeated global passes, convergence and immutable snapshots → **GR26** choose online traversal, in-memory projection or batch analysis | GR13–14, GR24–25; M/W | A graph fits on disk but its projected properties and work arrays do not fit in memory |
| Use a result safely | Model version, run identity, parameters, staleness and write-back → **GR27** attach provenance and lifecycle to derived graph results | GR22, GR24–26; W | A new graph is loaded while an old component label remains on every package |

### Deploy, protect and recover a connected service

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Separate availability from larger capacity | Replication, leader routing, read lag and causal dependencies → **GR28** reason about reads after writes and failover | GR19–20; M | An impact page routes to a replica that has not seen the newly added edge |
| Place connected data | Partition cuts, remote expansion, hot vertices and distributed transaction scope → **GR29** decide when to partition and what guarantee crosses the cut | GR13–16, GR19, GR28; M/W | Tenant partitioning is cheap until shared-package paths cross every tenant |
| Operate the workload | Working set, caches, heap, concurrent budgets, transaction/log growth and maintenance → **GR30** diagnose pressure from graph-specific work before resizing | GR13–17, GR19; W | New concurrent path queries evict the useful working set and grow transaction memory |
| Recover a useful service | Durable commits, replay/checkpoint boundary, backup consistency, RPO/RTO and source reconciliation → **GR31** restore graph data and dependent state together | GR20, GR22, GR27–28; M/W/E | Restore fixes a bad deletion but loses a later valid dependency change and its derived output |
| Protect paths and endpoints | Tenant boundaries, indirect disclosure, row/edge/property visibility, counts and procedures → **GR32** specify authorisation for the answer, not just the start node | GR09–12, GR23–24; W | A visible package becomes linked through a private deployment; a count discloses its existence |

### Query and govern shared assertions in RDF

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Merge data without accidental identity | IRIs, literals, blank-node scope, language/datatype and RDF statement identity → **GR33** model RDF identity and preserve terms during import/export | GR02, GR04; W | Two blank nodes from different files are treated as the same entity; a lexical change alters matching |
| Keep source and statement distinct | Triples, datasets, default/named graphs, assertions about assertions and versioned vocabularies → **GR34** represent provenance and conflicting RDF claims | GR05, GR07, GR33; M/W | Two source graphs disagree; unioning them discards the distinction an answer needs |
| Interpret what is known | Open-world reading, absence, vocabulary entailment and equality → **GR35** distinguish asserted, inferred, unknown and inconsistent information | GR33–34; M/W | An added domain axiom infers a type rather than rejecting a bad record |
| Validate instead of assuming | Shapes, target selection, dataset scope and validation transaction boundary → **GR36** use validation alongside inference | GR06, GR35; W | Data conforms before a concurrent update but violates a shape after it |
| Predict SPARQL answers | Triple-pattern joins, solution multisets, optional, filter, union, negation and graph scope → **GR37** derive SPARQL answers on small datasets | GR09, GR33–35; M/W | An optional value disappears under a filter; a duplicate binding changes an aggregate |
| Ask for RDF reachability correctly | Property-path endpoint semantics, zero length, graph scope and entailment regime → **GR38** separate property paths from enumerated or weighted paths | GR10–12, GR37; M/W | A source union or an inferred edge changes endpoint reachability |
| Keep inference current | Materialisation versus query-time reasoning, supported fragments and deletion dependencies → **GR39** choose an inference strategy and update contract | GR22, GR35–38; M | Removing one asserted edge must not remove a fact still justified by another derivation |
| Query outside one store | Endpoint failure, source version, completeness, query leakage and intermediate bindings → **GR40** bound RDF federation | GR29, GR32, GR37; W | One remote source times out; treating a partial result as complete changes the impact decision |

### Explain and operate a concrete property-graph implementation

These are product-specific abilities, not additions to the family definition. Neo4j is the provisional representative. Its Community, Enterprise, Aura and optional GDS capabilities must be labelled separately.

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Connect graph access to physical representation | Current store formats, relationship density, locality and properties → **GR41** trace Neo4j storage and cache access in a specified format | GR14; M/source-backed | Switching Community `aligned` to Enterprise `block` invalidates a universal linked-record explanation |
| Execute and diagnose Cypher | Language version, match/path modes, index capabilities, planner statistics and actual operators → **GR42** inspect Cypher plans and results for the running graph | GR09–17, GR41; E | A selective index is used yet a hub expansion dominates; path-mode syntax changes with version |
| Preserve model identity | Actual constraint types, `MERGE`, relationship identity, schema/index readiness → **GR43** implement the model and migration contract in Neo4j | GR04–08, GR20–21; E | Two imports use `MERGE` without an appropriate uniqueness constraint |
| Explain concurrent writes | Read committed, automatic and explicit locks, deadlocks and transaction scope → **GR44** test Neo4j invariants with competing sessions | GR19, GR43; E | A read-check-write passes twice; a lock strategy serialises the required conflicting edits |
| Use the driver as part of correctness | Managed retries, session/database routing, bookmarks, lazy result consumption and uncertain completion → **GR45** implement a bounded retry-safe Neo4j request | GR20, GR28, GR44; E | A callback sends an external notification twice; a newly routed read lacks the needed bookmark |
| Understand durable and maintainable state | Write-ahead log, checkpoint and retention → **GR46** explain Neo4j durable commit and restart | GR31, GR41, GR44; M/E | Log-retention settings exhaust disk; checkpoint completion does not equal backup |
| Load without breaking service | Administrative import, transactional batches, online updates, schema verification and reconciliation → **GR47** execute a versioned Neo4j ingestion/cutover | GR21–22, GR43–46; E | A faster import method cannot run under the assumed live-service conditions |
| Operate replicas and recovery | Database topology, primary/secondary routing and failover → **GR48** operate and validate a replicated Neo4j deployment | GR28, GR45–46; E | A write succeeds but an unqualified read routes to a lagging copy |
| Choose a scale architecture | Replicated whole database, composite federation and current property-sharded architecture → **GR49** distinguish Neo4j scaling mechanisms and their limits | GR29, GR41, GR48; M/documented cases | Large property payloads and cross-partition traversal impose different scaling demands |
| Apply actual access controls | Privileges, deny rules, graph entities/properties, procedures, network and edition → **GR50** verify Neo4j isolation with adversarial queries | GR32, GR42–43; E | A user denied a property can still call an overprivileged procedure |
| Restore actual product state | Full/differential backup chain, restore target, system/security metadata and post-restore reconciliation → **GR59** execute and validate Neo4j recovery | GR31, GR46, GR48; E | A missing chain artifact or an in-place clustered restore invalidates the recovery plan |
| Diagnose product resource pressure | Page cache, heap, transaction memory, concurrent queries and metrics → **GR60** distinguish Neo4j working-set pressure from expansion and retention pressure | GR30, GR41–42, GR46; E | Adding heap reduces memory available for the page cache and fails to fix hub expansion |
| Run accountable analytics | GDS graph catalogue, projection, estimated memory, execution modes and snapshot lifecycle → **GR51** execute and retire a GDS analysis | GR24–27, GR41–42, GR50; E | `mutate` changes the projected graph while a reader expects a persisted property; the source changes after projection |

### Explain and operate a concrete RDF implementation

Jena TDB2 with Fuseki is a provisional second representative because it makes RDF indexing, transaction boundaries, endpoint operation and reasoning composition inspectable without assuming a commercial service. Its purpose is narrower than a survey of RDF products.

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Trace a SPARQL read | Node table, triple/quad permutation indexes, ARQ algebra and statistics → **GR52** explain and inspect Jena TDB2 query execution | GR14–17, GR33–38; M/E | A named-graph restriction changes the useful index order; skew changes join cost |
| Know what commits together | TDB2 transaction snapshots, one writer/multiple readers, API/HTTP transaction boundaries and copy-on-write state → **GR53** implement a concurrent RDF update safely | GR19–20, GR36–39, GR52; E | Two independent HTTP requests are mistaken for a single atomic business update |
| Compose inference and validation | TDB2 storage versus configured Jena inference models and SHACL facilities → **GR54** configure and verify asserted, inferred and validated views | GR35–39, GR53; E | A restart loses an in-memory view or a configuration never applies the advertised reasoning |
| Expose an endpoint safely | Fuseki dataset/service configuration, authentication, operation/graph access, updates and remote service calls → **GR55** test a least-privilege RDF endpoint | GR32, GR34, GR40, GR53–54; E | A read-only consumer reaches an update/admin path or a federated query reaches an unintended address |
| Maintain and recover the store | Loader choice, single-JVM ownership, compaction generations, consistent backup and reload → **GR56** operate and restore Jena TDB2/Fuseki | GR21–23, GR30–31, GR52–55; E | Compaction stalls writes; restoring an RDF dump does not restore endpoint credentials and configuration |

### Know where to stop

| Expert task | Understanding needed → teachable unit | Needs; form | Changed case or failure |
| --- | --- | --- | --- |
| Avoid treating an API as a guarantee | Gremlin traversal execution, GQL/Cypher/SPARQL portability and backend-dependent transaction/index behaviour → **GR57** assess portability and a distributed alternative | GR02, GR19, GR29, GR42; S/W + R | JanusGraph with an eventually consistent backend exposes index/graph discrepancies a Neo4j-only account misses |
| Recognise different work | Graph theory proofs, arbitrary algorithm catalogues, ontology engineering, graph ML and retrieval pipelines → **GR58** identify the boundary and request the appropriate expertise | GR02, GR25, GR35; S/R | A “graph RAG” request actually requires extraction evaluation and retrieval quality work |

## Scope checks against primary sources

Checked 18 October 2026. These sources test planning assumptions; they do not verify the future article's exact commands, release-specific guarantees or observed performance. Every execution lesson still needs a pinned version, documented configuration, inspectable state and changed case.

- [Neo4j store formats](https://neo4j.com/docs/operations-manual/current/database-internals/store-formats/) distinguishes `block` and `aligned` by edition and explains locality/density differences. This rules out one universal pointer-chain account of graph storage.
- [Cypher match and path modes](https://neo4j.com/docs/cypher-manual/current/patterns/reference/match-modes-and-path-modes/) includes recent path-mode/version distinctions. Portable path meaning must be taught separately from current syntax.
- [Neo4j concurrent access](https://neo4j.com/docs/operations-manual/current/database-internals/concurrent-data-access/) documents read committed and lock behaviour. ACID alone cannot establish the cycle-prevention invariant.
- [Neo4j scaling](https://neo4j.com/docs/operations-manual/current/scalability/scaling-with-neo4j/) now distinguishes clustering, composite databases and property sharding. A dated “Neo4j cannot shard” simplification would make the collection wrong.
- [Neo4j transaction logging](https://neo4j.com/docs/operations-manual/current/database-internals/transaction-logs/) and [restore](https://neo4j.com/docs/operations-manual/current/backup-restore/restore-backup/) make retention, backup-chain replay and clustered restore distinct operational concerns.
- [GDS introduction](https://neo4j.com/docs/graph-data-science/current/introduction/) explains the in-memory graph catalogue and separate Enterprise features. Algorithms have their own data and resource lifecycle.
- [RDF concepts](https://www.w3.org/TR/rdf11-concepts/), [RDF semantics](https://www.w3.org/TR/rdf11-mt/), [SPARQL query](https://www.w3.org/TR/sparql11-query/) and [SHACL](https://www.w3.org/TR/shacl/) establish distinct identity, entailment, querying and validation work. Use stable recommendations as the initial semantic baseline; check the status of newer RDF/SPARQL work when commissioning.
- [TDB architecture](https://jena.apache.org/documentation/tdb/architecture.html) covers both generations with differences; [TDB2](https://jena.apache.org/documentation/tdb2/) is the generation-specific authority. Do not carry TDB1 transaction or journal claims into TDB2 without checking them.
- [TDB2 administration](https://jena.apache.org/documentation/tdb2/tdb2_admin.html) distinguishes compaction, consistent RDF dumps and process ownership. [Fuseki](https://jena.apache.org/documentation/fuseki2/) supplies the server layer rather than distributed storage by implication.
- [JanusGraph eventual consistency](https://docs.janusgraph.org/advanced-topics/eventual-consistency/) explicitly exposes temporary graph and index inconsistencies. This is a credible contrasting architecture, not a reason to require a second complete property-graph product branch immediately.

## Open decisions before commissioning

Including RDF as serious graph-database coverage enlarges the subject, but excluding it would leave “graph databases” with an unstated property-graph-only definition. The proposed scope is both families with separate reader entrances; ontology design beyond what storage/query decisions require remains outside. Neo4j plus Jena is provisional, subject to reviewer challenge about product cost and the reader's actual operating needs. Jena's lack of a built-in distributed-store story must stay explicit. JanusGraph warrants a mechanism comparison, not unsupported claims that every backend behaves alike.

The future source audit must establish the current status of RDF 1.2/SPARQL 1.2 and exact Neo4j/GDS versions and editions. Recent Neo4j property sharding may deserve deeper implementation work if it becomes the chosen deployment; it must not be squeezed into replication or asserted from historical Neo4j behaviour. General consensus, queue delivery, identity management, ML and full ontology engineering remain separate fields or parked teaching programmes. Give direct entrants the local prerequisite sentence they need.
