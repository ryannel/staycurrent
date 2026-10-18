# Document databases: proposed coverage map

18 October 2026. Proposal for discussion within the [field plan](../databases-and-storage-plan.md),
before independent planning review or writing. Use the [shared map conventions](databases-and-storage.md#map-conventions).

An expert user can choose document boundaries, query nested facts correctly,
preserve invariants while updating them, evolve structure and operate distribution
without treating flexible records as an absence of design. MongoDB is the first
worked engine; CouchDB supplies a distinct replication/conflict example. PostgreSQL
JSON is a credible alternative, not a nominal comparison.

Running example: shop products P7 (mug) and P8 (lamp), their variant arrays, shared
manufacturer M3, customer 42 and a versioned repair form R17. Keep each field's
meaning and identity consistent across embedding, querying and migration.
Base: `/learn/databases/documents/`; the entrance keeps its existing URL.

| ID | Proposed page and role | Owned sections and reader outcome | Teaching form | Entry needs; onward homes | Existing material / destination |
| --- | --- | --- | --- | --- | --- |
| D01 | Document databases — introduction | Documents/collections and nested values; what is read and changed together; flexible structure; queries/indexes; atomic boundary and distribution in outline; useful workloads and limits. | P7/P8 documents beside their actual read results; one changed shared fact. | No document-store knowledge. D02/D03/D10. | Existing `/learn/databases/documents/`; current single article supplies material across several proposed pages. |
| D02 | What belongs in one document? — deep dive | Aggregate ownership; embed/reference/duplicate; cardinality and unbounded arrays; document growth; update contention; snapshots against shared truth. Choose a boundary from operations and invariants. | Manufacturer address update, product variants and an ever-growing order history; finish each design decision. | D01-level model. R02 owns normalisation principles; D05 atomic operations, D06 evolution. | New `document-boundaries/`; derive from existing introduction. |
| D03 | Querying nested records — deep dive | Missing/null/type distinctions; nested paths; same-element array matching; unwinding and result multiplication; grouping/lookup; stable ordering and pagination. Predict which documents and rows a query returns. | Small documents and exact outputs, including a false variant match; real engine queries. | D01; D04 access paths; PG08 owns PostgreSQL syntax. | New `queries/`. |
| D04 | Indexes for document queries — deep dive | Compound paths; arrays/multikey expansion; query and sort compatibility; coverage; partial/sparse/unique semantics; index-set write cost; explain plans. Design for the actual query shape. | Same P7 variant query with wrong/correct indexes; measure work and entry growth. | D03; R12 supplies the B-tree mechanism with a local reminder. D08 owns MongoDB particulars. | New `indexes/`. |
| D05 | Atomic document changes and transactions — deep dive | Conditional updates and revision checks; one-document invariants; array updates; multi-document transactions; isolation and retry identity; read/write acknowledgement and failover consequences. Locate the guarantee's actual boundary. | Two stock updates and a changed manufacturer; lost reply followed to resulting state. | D02; F03/R09 vocabulary summarised locally; D08 product protocols. | New `concurrency/`. |
| D06 | Evolving document structure — practical guide | Validation; schema/version markers; mixed readers/writers; migration on read against backfill; field renames and types; index changes; proving completion and rollback. Change structure while old records remain. | Two versions of R17 coexist; interrupt and reconcile a backfill. | D02/D03; F06 cross-store moves and F05 copy protocol. | New `schema-evolution/`. |
| D07 | Distributing and operating documents — practical guide | Shard-key/access alignment; hot aggregates and cross-shard work; replication/freshness; capacity and slow-query diagnosis; permissions; retention; backup, restore and upgrade tests. Run the document design under pressure. | Hot manufacturer, lagging reader and a restored dataset with validation. | D02/D05; R22 explains general placement, D08/D09 actual engine contracts. | New `distribution-and-operations/`. |
| D08 | MongoDB's storage and request path — product deep dive | BSON/type and size boundaries; WiredTiger cache/checkpoints in context; replica-set requests and elections; read/write concern; sharding routes; transaction/driver retry behaviour; inspection and backup tools. Interpret MongoDB's implementation. | Versioned driver/request trace and native explain/replica experiments; measured limits kept separate from schematics. | D03–D07 as needed; F04 owns general LSM and does not define WiredTiger. | New `mongodb/`; split only if its mechanisms overwhelm the bounded request-path investigation. |
| D09 | Replicated documents and conflicts — product deep dive | CouchDB revisions and conflict trees; winning revision against application truth; local/remote replication; deletion tombstones; interrupted sync and conflict resolution; access and backup implications. Resolve concurrent offline changes deliberately. | R17 edited offline twice, synced, resolved and deleted; native revision evidence. | D01/D05; a short replication primer is local. A full CRDT/local-first programme remains deferred. | New `replication-and-conflicts/`. |
| D10 | Choosing a document store — comparison | MongoDB, CouchDB and relational JSON for distinct workloads; boundaries, nested queries, transactions, distribution, offline work and operating cost; service/edition differences. Choose the simplest credible arrangement. | Three workload comparisons using the same facts and constraints. | D01/F02. F07 evaluation; R05/PG08 relational option. | New `choosing/`. |

No separate document playground is presumed. Query and concurrency lessons should
use a native engine where semantics are the lesson; a browser model can expose
aggregate growth or an offline conflict but cannot establish product guarantees.
Product-specific inspection and recovery instructions belong at D08/D09, not in
every general paragraph. Broader security/deletion policy stays at F08.
