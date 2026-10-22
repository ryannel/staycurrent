# Databases and storage: revised field coverage map

18 October 2026. **Proposal for discussion**, independently re-derived after the
first plan was rejected. Each collection starts from a practitioner's abilities,
then allocates teachable units to pages and sections. No existing article count
sets its depth. The [section plan](../databases-and-storage-plan.md) explains the
whole structure; the [page tree](../databases-and-storage-page-tree.md) lists titles.

The nine collection maps are the authoritative proposed allocations. Initial
abilities, first proposals, independent reviews and coordination decisions live
under [the derivation record](../planning/databases-depth-2026-10-18/README.md).
Those first artifacts preserve evidence; where coordination changes a home,
the final coverage map governs. Planning does not commission articles, claim
that proposed exercises have run, create routes or change publication status.

## Audience, depth and page boundaries

An intelligent engineer new to the subject should reach the understanding needed
to make its engineering decisions and operate the selected implementation.
Expertise in every vendor's product, implementing every engine and a prerequisite
distributed-systems course are different scopes. Each map states its limits.

A unit receives the form its consequence needs: a sentence, exact worked output,
a mechanism with figures, or a native exercise. A page earns its boundary through
an independent investigation, a direct reader question or work that would bury
its parent's argument. Counts follow those boundaries. No collection is required
to match another, and a larger count does not establish better teaching.

Introductions explain what the system is, what it is for and when to use it before
requirements worksheets or product comparisons. Small notation and prerequisites
are taught where needed. A direct entrant must not pay for a long prerequisite
journey simply to understand the first example.

## Collection entrances

| Collection | Distinct practitioner work | Proposed depth map |
| --- | --- | --- |
| Relational | Facts and SQL meaning; constraints/concurrency; access/execution; durable operation; distribution; selected conventional and distributed implementations | [Relational map](relational.md) |
| Documents | Aggregate boundaries and growth; nested query/index meaning; writes and client observations; evolution; a full selected MongoDB path | [Document map](documents.md) |
| Key-value and wide-column | Keyed contracts, ordered groups and query-shaped copies; distinct DynamoDB and Cassandra mechanisms/operation; direct entry to shared in-memory machinery | [Keyed map](key-value-and-wide-column.md) |
| Analytics and time series | Meaningful aggregates; physical/query work; corrected copies; shared tables; samples/windows; maintained results; selected executable branches | [Analytics map](analytics.md) |
| Search and vectors | Corpus/representation; lexical and approximate retrieval; pipeline eligibility and ranking; judged quality; lifecycle and serving operation | [Search map](search.md) |
| Graphs | Entity/assertion meaning; path semantics and cost; changing graphs; analytics; RDF semantics; separate Neo4j and Jena implementation paths | [Graph map](graphs.md) |
| Caches and in-memory stores | Source coherence; misses/admission; accepted state and atomic work; survival/recovery; one shared Redis implementation path | [In-memory map](caching.md) |
| Object storage | Named-byte contracts; transfers/integrity; concurrent requests; application protocols; authority/delivery; lifecycle/recovery; S3 implementation | [Object map](object-storage.md) |
| Files and block storage | File/namespace correctness; application persistence; filesystem recovery; volume/device budgets; sharing, integrity and restoration; selected Linux/cloud paths | [File and volume map](files-and-block-storage.md) |

These are overlapping approaches and reader jobs, not exclusive product bins.
Distributed relational work stays inside relational. Time-series and maintained
analytical results have their own entrances inside analytics. RDF has a separate
graph route; it is no longer a comparison paragraph that pretends to supply that
expertise. Keyed and wide-column readers enter separate paths without reading
every implementation first.

## Pages derived from the tasks

| ID | Page and reader outcome | Owned units/sections | Concrete change or failure | Teaching form and prerequisites | Why a page |
| --- | --- | --- | --- | --- | --- |
| FD01 | Databases and storage: understand what kinds of systems are available and which problem to investigate | Records/bytes/queries; exact/ranked/path/analytical work; model/layout/deployment/role; overlapping families and modest starting designs | A catalogue needs both a purchase invariant and ranked discovery; one family name cannot answer both | Small operations with actual input/output; no database knowledge | The field entrance must orient rather than compress the mechanisms of every family. |
| FD02 | Describe the workload: turn an application's needs into a testable design brief | Workload access/invariant/size/skew/concurrency/freshness/recovery/location/operating units from the ability map | A few tenants dominate writes and latency; an average hides them | Three worked briefs with units and changed distributions; local vocabulary from FD01 | An engineer arrives to specify needs before comparing products or reading internals. |
| FD03 | Read and write promises: interpret an interface's guarantees | Atomic scope, visibility, durability, replica/failure scope, missing responses and retry identity | A request commits but the caller times out; a stale replica misses the accepted change | Trace one record and two clients; separate histories from product/protocol details | One shared vocabulary helps all collections; deriving every protocol here would be an expensive detour. |
| FD04 | Keep a derived copy correct: design a copy that can be rebuilt and reconciled | Source ownership/revision; snapshot/live boundary; order/duplicates/deletes; checkpoints/retention; backfill; repair and schema changes | Old revision arrives late, deletion is missed, capture expires while the copy catches up | One continuous source/target trace plus a reconciliation procedure; brief local contract reminder | Copy completeness and repair form an investigation independent of a target store's indexing machinery. |
| FD05 | Move between stores: switch authority without losing later work | Compatibility; copy/catch-up; validation; mixed application versions; cutover; rollback and divergence; retirement | Reads are switched back after new writes have reached only the replacement | Work through migration states and acceptance checks; local FD04 reminder | Authority transfer and rollback deserve their own endpoint rather than burying the copy mechanism. |
| FD06 | Evaluate a storage design: test the full candidate against a credible baseline | Representative workload; distributions and load; correctness/quality; sustained/warm/cold; overload/maintenance/recovery; costs and reproducibility | Fast isolated queries lose under ingestion or recovery; the client becomes the benchmark bottleneck | Worked evaluation record, misleading test and defensible decision; FD02's brief explained locally | An independently useful practice, shared by comparisons without repeating test methodology. |
| FD07 | Protect and retire data across stores: retain control through copies and recovery | Privilege/tenancy; sensitive derivatives; encryption/key recovery; audit; retention; erasure; restored state | A backup restore reintroduces a deleted record and its obsolete search permissions | One person's data and authority tracked through primary, derived and backup copies | Cross-store ownership cannot be established by any one product's permission page. |


## Shared ownership after coordination

| Derived part | One full home | What remains in the collection |
| --- | --- | --- |
| Reproducible whole-workload evaluation, relational RL23 | FD06 | Relational plan diagnosis, search quality/ANN load tests at SR20, and filesystem-specific safe I/O tests at FS-G14 apply the method to distinct evidence. |
| Snapshot/change boundary, generic replay and copy completeness: RL38, DC22, KV09, ANU27 and SRU42's transport part | FD04 | DC58 owns copied document facts/deletion; AN12 owns semantic control totals/lineage; SR21 owns indexing jobs/partial work and SR23 compatible search generations. Native tokens/APIs remain in their product branches. |
| Whole-store authority transfer/rollback: RL41 and KV12's shared proof | FD05 | RL100/DC59 native schema compatibility; D11/C17 actual keyed model changes; RL122/RL132 native engine migration; OB-A16 namespace/metadata/URL compatibility. |
| Graph loading GR22 | FD04 owns its generic transport protocol; GR-A09 owns graph-specific endpoint/order/deletion reconciliation | The graph application must demonstrate dangling/missing endpoints and stale edge resurrection, not retell a general connector tutorial. |
| Cache coherence, general admission and source load | CA-A02, CA-A04 and CA-A03 respectively | Redis client tracking at CA-A12 has its own boundary; HTTP object delivery is OB-A09/OB-S05. |
| Redis units derived in the keyed review | CA-A11–CA-A17, with common decisions at CA-A02/CA-A03/CA-A06 | There is one implementation branch, reached by two role-specific routes. The keyed map gives the exact unit reconciliation. |
| Relational B-tree access, isolation and WAL | RL86, RL90/RL91 and RL95 | Other collections supply local context and teach their distinct array, graph, file or request contracts. PostgreSQL details remain native. |
| Compaction/read amplification in a named engine | Cassandra C03/C04/C08, search SR22/SR32 and analytics AN07/AN34–AN38 each own their distinct mechanisms | No extra generic log-structured-storage prerequisite is imposed. A writer must not turn one engine's merge/deletion mechanism into a universal promise. |
| Multi-file generation publication versus table commits | OB-A06 owns arbitrary application release/reader/reclamation protocol; AN17–AN22 own table/catalogue/schema/delete semantics | S3 resource recognition is OB-S01; it does not repeat a general Iceberg or vector curriculum. |
| Vector representation/index/quality | SR09–SR20 | Existing pgvector and S3-vector reading is candidate implementation/reference material; no fragment becomes the new general home by being available. |
| Cross-store protection/retirement policy | FD07 | Every interface still teaches actual enforcement and failure: cache revocation, search side channels, raw analytical-file access, object delegation, SQL policies and filesystem path/key boundaries. |

A named unit with several originally bundled obligations may be refined into named
parts during coordination. For example, keyed KV18 separates source/fill coherence
from miss-load protection; relational RL74 separates schema jobs, cluster upgrade
and SQL migration. Each refined part has one home. First derivations remain intact
and the refinement is recorded in the final map and decision record.

## Scope that remains explicit

| Scope | Status |
| --- | --- |
| Selected product operation | Fully planned only for the named initial branches. A comparison with SQL Server, MySQL, SQLite, Couchbase, Firestore, Bigtable, managed warehouses, OpenSearch, Valkey or OpenZFS does not confer operator expertise there. |
| Embedded and transactional key-value alternatives | Conditional exits/comparisons in keyed and relational selection. A RocksDB/FoundationDB/coordination-store implementation branch requires its own ability derivation. |
| RDF and SPARQL | In scope at graph-family depth with a Jena TDB2/Fuseki path. Full ontology engineering, every OWL profile and graph ML remain outside the stated practitioner route. |
| Spatial and scientific specialist work | Practical value/index boundaries remain locally explained; existing PostGIS reading remains available candidate reference. Full GIS/raster/scientific-array/HPC storage curricula are deferred, not silently claimed complete. |
| Managed warehouse, maintained-SQL service and offline-document operation | Credible selection alternatives with explicit boundaries. Full Snowflake/BigQuery, Materialize/RisingWave and offline-sync product operation are not represented by the selected native branches. |
| Other fields | Messaging delivery/broker internals, instrumentation, model training and AI generation stay in their planned fields. Storage-local replay, source ordering and retrieval preparation are taught where needed. |
| General distributed systems | Parked. Database-local coordination, replication, fencing and recovery are taught only to support their named database decisions. |
| Reference manuals and implementation curricula | Link for complete SQL/API/setting catalogues, firmware, full filesystem/engine development and formal proofs. A needed practical case cannot be dismissed as reference merely to keep a page short. |
| Assessments, tools and aliases | Separate from the explanatory page count. Current SQL/object tools, dated vector assessment and compatibility aliases retain their actual status and purpose. |
| Publication | Unchanged. These maps are a revised plan for discussion; they do not authorise rewriting or publishing their articles. |

## Source and execution status

Primary-source scope checks are recorded per derivation. They establish planning
distinctions and reveal version/deployment questions. Later briefs must pin actual
server, client, extension, edition and service modes, record what ran, and check
all consequential claims. No benchmark, failure drill, restore or hosted request
has been run for this planning task. Native environment access is part of
commissioning each exercise, not a reason to imply that a browser model executes it.
