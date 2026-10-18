# Graph databases: proposed coverage map

18 October 2026. Proposal for discussion within the [field plan](../databases-and-storage-plan.md),
before independent planning review or writing. Use the [shared map conventions](databases-and-storage.md#map-conventions).

An expert user can model the meaning and direction of relationships, formulate
bounded path questions, predict expansion work, choose algorithms and keep the
graph correct as it changes. This is depth in using graph storage, not a complete
graph-theory or semantic-web curriculum.

Running example: the repair service's Checkout → Orders → Inventory dependencies,
with stable service IDs and typed, dated edges. Introduce a small separate route
graph only for weighted shortest-path questions where a dependency is misleading.
Base: `/learn/databases/graphs/`; retain the existing entrance.

| ID | Proposed page and role | Owned sections and reader outcome | Teaching form | Entry needs; onward homes | Existing material / destination |
| --- | --- | --- | --- | --- | --- |
| G01 | Graph databases — introduction | Nodes/edges/properties; paths and the questions they answer; graph representation against traversal work; relational recursive queries; property graphs against RDF/triples and inference in outline. Recognise when graph queries earn a specialised store. | Follow an indirect dependency and contrast storing a relationship with querying a path. | No graph-store knowledge. G02/G03/G07. | Existing `/learn/databases/graphs/`; reuse diagrams and model after reassessment. |
| G02 | Modelling relationships — deep dive | Identity/direction/type; properties on nodes or edges; many-to-many and hyperedge alternatives; temporal edges; provenance; duplicate relationships and integrity. Make the query mean the right thing. | One dependency network modelled three ways; change a service owner and an edge's validity. | G01; R02 identity reminder, R03 temporal values. | New `modelling/`. |
| G03 | Paths, cycles and traversal cost — deep dive | Pattern and variable-length matching; walks/trails/simple paths; cycle handling; uniqueness and result multiplicity; anchors/indexes; branching factor, bounds and query plans. Ask a path question without accidental explosion. | Expand one hop at a time, add a cycle and a high-degree node, inspect exact results and native work. | G02; R30 recursive SQL is the contrasting implementation, not a replacement for path semantics. | New `traversal/`. |
| G04 | Graph algorithms for application questions — practical guide | Reachability/impact; shortest paths and weights; connectivity; centrality/community purpose and limits; graph projection; stale results and interpretation. Pick an algorithm from the question. | Dependency impact plus a weighted route; change topology and show why “most central” is not automatically most important. | G03; algorithm proofs/catalogues remain reference links. | New `algorithms/`. |
| G05 | Changing and operating a graph — practical guide | Atomic updates and constraints; concurrent relationship creation; ingestion identity; deletion and dangling meanings; schema/index evolution; permissions; capacity, partition crossings and supernodes; backup/restore. Keep a changing graph usable. | Two imports collide, a service retires and a restored graph is validated against the source. | G02/G03; F05 copy protocol, F08 policy, G06 native procedures. | New `operations/`. |
| G06 | Following a query through Neo4j — product deep dive | Storage/adjacency and indexes; Cypher patterns/paths; execution plans; locks/transactions; memory/cache; replication/deployment and edition boundaries; import and recovery tools. Relate a query to the engine's actual work. | Native explain/profile, concurrent update and restore examples with version/edition evidence. | G02/G03/G05; do not generalise Neo4j adjacency or path semantics to every graph engine. | New `neo4j/`. |
| G07 | Choosing a graph representation and store — comparison | Relational joins/recursive SQL; Neo4j/property graphs; distributed alternatives such as JanusGraph; RDF store where inference/interchange matters. Compare query shapes, semantics, scale, operating work and copied-data lifecycle. | Dependency, routing and knowledge-representation cases with different outcomes. | G01/F02; G03 work, F07 evaluation. Full SPARQL/ontology series deferred. | New `choosing/`. |

Graph drawing belongs to the published drawing-systems collection; it does not
teach database traversal. The graph collection may link to that practice without
duplicating it. No general distributed graph-processing or offline graph-analytics
platform series is implied by the algorithms page.
