# PostgreSQL heading and coverage review

16 October 2026. Initial expectations below were recorded from the captured title
and opening before reading this pass's heading trees or bodies. The reviewer has
prior project context; this is an informed outline-first review, not a novice test.
The artifacts are built HTML text extractions with optional disclosures marked.
Scripts and SVG content are excluded; they do not establish visual or live behaviour.

## Expected understanding before the outline

| Article | Expected understanding from its promise |
| --- | --- |
| Inside PostgreSQL | Connect a connection's request to server execution, pages, indexes, version visibility and commit persistence through the promised concurrent purchase; distinguish memory, durable pages and committed data. |
| Planning and executing a query | Explain estimates versus execution, parameter-sensitive plans, streaming versus blocking work and the scope of memory allowances; interpret the stated tenant experiment. |
| Indexes in PostgreSQL | Explain B-tree, GIN and BRIN contents, candidates/rechecks and write maintenance; locate their appropriate uses without implying a complete access-method catalogue. |
| Row versions, transactions, and vacuum | Follow replacement versions through snapshot visibility, index access and safe reclamation; explain vacuum's consequences and why old readers matter. |
| WAL, checkpoints, and recovery | Derive durable commit from the log, distinguish redo from visibility, explain checkpoint/redo positions and the limits of the demonstrated crash. |
| Following a change to another PostgreSQL server | Trace receipt, persistence, replay and visibility; distinguish physical/logical replication; complete the promised promotion and former-primary return with data-loss and routing implications. |
| Where distributed PostgreSQL work runs | Distinguish native partitioning from ownership across servers; follow tenant-local and cross-owner queries/transactions, and explain design consequences and operational boundaries. |
| JSON queries in PostgreSQL | Demonstrate same-element predicates, operator/index matching and an enforceable numeric type policy; leave representation design to the named related article. |
| Full-text search in PostgreSQL | Explain document/query normalization, positions, candidate lookup, ranking and authorization; show language/configuration and limits of built-in lexical search. |
| Vector search in PostgreSQL | Distinguish model relevance from retrieval quality; derive a small distance example, explain approximate/filter tradeoffs and interpret measured recall honestly. |
| Types and extensions in PostgreSQL | Explain the relationship of types/operators/indexes through booking overlap and spatial distance, temporal coverage, and the deployment/maintenance responsibility of extensions. |

These expectations do not require each article to repeat the whole collection or
the supporting SQL handbook. The body must still supply its own consequential steps.

## Reading and repairs

All eleven captured bodies were read through, including their marked optional
material and explanatory captions. The complete before trees are preserved in
`before-inventory.json`. The findings below concern the actual sections, rather
than words absent from a heading list.

| Article | Heading/structure finding and repair | Coverage judgment |
| --- | --- | --- |
| Architecture | Retained the useful sequence of concrete questions; renamed the final mechanism section to expose vacuum and maintenance. | The promised read, competing write, memory/WAL and cleanup path is complete. Pool ownership and background processes are explained without turning this into a server-setup manual. |
| Query execution | Named parsing/planning, custom/generic plans, streaming/blocking execution, memory/parallelism and total request time. “One statement, unequal tenants” hid the technique that a returning reader would seek. | The uneven fixture, actual plan changes and work/memory consequences supply the promised depth. Scans/joins are explicitly prerequisite teaching in the family query-execution article, not unexplained new promises here. |
| Indexes | Replaced five indirect instructions with B-tree, operator classes, GIN, BRIN and write maintenance landmarks, retaining their original order. | Each chosen method explains stored information, candidate work and maintenance. The opening explicitly selects three methods; a catalogue of every access method is not required. GiST has a substantive onward home in types/extensions. |
| Row versions | Exposed snapshot visibility, long-lived snapshots, HOT, the visibility map, vacuum diagnosis and write skew. | The tuple/snapshot distinction, retained-reader schedule, HOT redirect, heap-fetch experiment, freezing and operational investigation complete the promised path. |
| Recovery | Named WAL progress, crash recovery, page LSNs, checkpoints/full-page images, durability settings and point-in-time recovery. | Redo and visibility are distinguished; checkpoint/torn-page reasoning and durability policy are explained. Restore dependencies and valid later work lost by a restore point are present, with a focused recovery guide onward. |
| Replication | Named physical and logical replication, read freshness, slots, promotion/fencing and logical failover. | Receipt versus replay, routing, conflicts, retention, schema/sequence limits and rejoining the authoritative history are already taught. No new failover mechanism is needed to make this article complete. |
| Sharding | Named partition pruning, tenant keys, Citus colocation, two-phase commit, rebalancing and compatibility. Split the existing FDW explanation into its own H2 and contents entry: it had been buried under “Choose local children.” Adjusted the opening to announce that distinction. | Local constraints, locality, distributed visibility versus atomicity, dominant tenants and coordinated recovery boundaries are explained. Citus is documented rather than presented as an executed cluster experiment. |
| JSON | Named same-array-element predicates, GIN expressions and numeric validation/indexing. | Object containment, JSON_TABLE cardinality, index/operator matching, guarded numeric conversion and row-level write costs complete the stated questions. Representation design is explicitly taught in the linked family article. |
| Full-text search | Named the stored weighted-vector section and GIN candidate matching. Retained concrete words/positions and query/phrase headings. | Normalisation, positions, field boundaries, eligibility, ranking, matching, updates and search-quality limits are present; no separate search-service survey is owed here. |
| Vector search | Named HNSW, tenant filtering/iterative scans and measured recall. | Small exact arithmetic, synthetic experiment, plan changes, limited recall, model identity, stale embeddings and deployment tradeoffs are supplied. HNSW is the promised experiment; the brief IVFFlat comparison does not promise a second complete lab. |
| Types/extensions | Named exclusion constraints, temporal foreign keys, PostGIS and extension installation/maintenance. | The booking decisions include rejected/accepted alternatives and a concurrency observation. Temporal coverage differs from overlap; distance units, candidate rechecks and extension restore dependencies are explained. |

The PostgreSQL repair adds no SQL behaviour or new technical claim. Existing section
IDs remain stable and contents labels are updated with their headings. Technical
source revalidation is therefore not claimed for this editorial pass. The complete
rendered result and an independent repair check remain to be recorded.
