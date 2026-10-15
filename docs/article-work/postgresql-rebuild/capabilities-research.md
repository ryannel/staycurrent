# PostgreSQL capabilities: research and proposed scope

Checked 15 October 2026. This is research for a new commission, not article text or
publication approval. Sources below are primary documentation and release records.
The proposed experiments have not been executed in this research pass.

## Version baseline

Keep the teaching baseline at **PostgreSQL 18**. The official [version policy](https://www.postgresql.org/support/versioning/)
currently lists 18.6 as its supported minor release; [18.6 release notes](https://www.postgresql.org/docs/18/release-18-6.html)
date it to 13 August 2026 and explain that 18.5 was not released. The documentation
announces PostgreSQL 19 RC1 on the access date. A release candidate does not justify
quietly moving this collection's stable baseline.

The repository currently pins PGlite 0.5.8. Earlier recorded executions identify
its PostgreSQL runtime as 18.3. Authors must record the version actually returned by
their experiment, separately from the current upstream patch release. The 18.6
notes include follow-up actions for some GIN and btree_gist users, so an embedded
18.3 result should not be presented as validation of a current production install.

pgvector's checked upstream instructions identify **0.8.7**. Its [tagged changelog](https://github.com/pgvector/pgvector/blob/v0.8.7/CHANGELOG.md)
dates that release to 1 October 2026. Use an exact extension version in the eventual
server experiment. Installation defaults and hosted availability are separate
questions from PostgreSQL's version.

## The reader journey

The new branch should explain how PostgreSQL accommodates different kinds of data
and questions inside its transaction and query machinery. An object, a document's
words, an embedding, a booking interval and a geographic location need different
operators and access paths. Their presence in one database lets a query combine
them with ordinary ownership and business records; that does not make their search
semantics interchangeable or their operating costs disappear.

Recommend five bounded investigations, connected by a short orientation in the
rebuilt PostgreSQL main article. The first three deserve separate articles. The
fourth and fifth should also remain separate if both are commissioned in depth:
combining bookings, geospatial distance and extension management in a single short
piece would recreate the breadth problem. Extension installation and lifecycle can
be taught once in the spatial article and linked from the vector article.

The existing family article `tables-and-documents.astro` already teaches missing
keys versus JSON null, typed extraction, promotion into relational columns and
row-level contention. The PostgreSQL JSON child must begin a new investigation
instead of retelling that representation decision. Likewise, full-text search and
vectors should not be compressed into the index-method survey. The access-method
article provides the physical foundation; these articles own useful query results
and application decisions.

## JSON queries and indexes

**Proposed outcome:** choose a predicate and index for a catalogue whose varying
attributes remain in JSON, and explain the result from the stored objects.

Begin with how `jsonb` exposes structure to operators. Follow three actual requests:
products containing a material/tag combination, products with a numeric capacity
range, and a supplier document expanded into rows for a join. Give the objects
before the queries, including one awkward object that changes the answer.

The [PostgreSQL 18 JSON type chapter](https://www.postgresql.org/docs/18/datatype-json.html)
distinguishes whole-document GIN from targeted expression indexes. `jsonb_path_ops`
supports containment and jsonpath match operators but not key-existence operators;
it is not a universally better default. A capacity range can justify a typed
expression B-tree or an ordinary typed column. Index support follows the operator
and expression, rather than the presence of a JSON column.

Use [JSON functions and operators](https://www.postgresql.org/docs/18/functions-json.html)
for a bounded `JSON_TABLE` example that expands nested supplier offers and joins
them to owned products. Missing paths, JSON null and conversion errors need an
explicit policy. SQL/JSON extraction creates query rows; it does not install foreign
keys on objects or make incoming documents valid business records. `JSON_TABLE`
arrived in [PostgreSQL 17](https://www.postgresql.org/docs/17/release-17.html), so do
not label it an 18 novelty.

**Experiment to commission:** start with five readable objects, predict three
answer sets, then add a deterministic larger fixture for `EXPLAIN (ANALYZE,
BUFFERS)`. Compare the same answer before and after whole-object GIN, a focused
expression index and a typed range index. Include a query whose syntax does not
match the proposed index and explain why. Keep answer correctness separate from
plan choice and browser elapsed time. A final edit adds a malformed capacity and
shows the chosen ingestion/extraction policy, rather than silently casting it.

## Full-text search

**Proposed outcome:** implement understandable lexical search over articles or
support documents, including filters, ranking and updates.

Introduce a document, its normalised lexemes and a parsed query before showing an
index. Use a small corpus in which inflection, stop words, a phrase and a misspelling
produce different results. The [text-search controls](https://www.postgresql.org/docs/18/textsearch-controls.html)
document `websearch_to_tsquery`, title/body weights and ranking. Ranking is an
application relevance choice, not a probability of correctness. The same source
warns that `ts_headline` output is not safe HTML for untrusted input; present it as
text in the playground unless the renderer sanitises it.

Use an explicit language configuration and a **stored** generated `tsvector`, as
in [Tables and indexes](https://www.postgresql.org/docs/18/textsearch-tables.html).
Explain how editing a title changes its search representation in the same write.
The [index documentation](https://www.postgresql.org/docs/18/textsearch-indexes.html)
describes GIN's lexeme postings and the need to recheck weight-sensitive matches.
Finding matching rows and calculating their ranked order are distinct work.

**Experiment to commission:** inspect vectors and queries, predict phrase matches,
weight title matches, apply a tenant/publication filter, edit one document and
observe the changed result. Then inspect a selective GIN plan on a larger fixture.
Make a typo fail lexical matching before trying [pg_trgm](https://www.postgresql.org/docs/18/pgtrgm.html)
as a separately enabled extension. Trigram similarity, linguistic matching and
semantic similarity answer different questions. A short search-quality evaluation
with known desired documents is more useful than declaring PostgreSQL a replacement
for every search product. Keep autocomplete, extensive multilingual dictionaries and
distributed search operation outside this first commission.

## Vector similarity with pgvector

**Proposed outcome:** distinguish exact distance retrieval from approximate candidate
search, then evaluate a filtered result against an exact baseline.

[pgvector's upstream documentation](https://github.com/pgvector/pgvector) describes
an extension, not a built-in PostgreSQL vector facility. Exact nearest-neighbour
search is the default; HNSW and IVFFlat trade recall for speed. Approximate scans
apply filters after scanning candidates, so a selective tenant/status predicate can
leave fewer than the requested results. Iterative scans, available since 0.8.0,
search further subject to limits; strict distance ordering does not establish
perfect recall. The distance operator and index operator class must agree.

**Experiment to commission:** first use hand-authored three-dimensional vectors
whose distances readers can inspect. Label them synthetic numeric vectors: they do
not demonstrate semantic quality. Then use a fixed, documented embedding fixture
for a realistic query, keeping the model/version and dimensions with the fixture.
Record the exact filtered top-k, build HNSW, and compare returned identities at
several search settings. Include a deliberately selective tenant filter. Report
recall against that baseline, rows returned and plan work, not just milliseconds.
Use a deterministic tie-break when comparing identities at equal distance.

The application explanation must show who creates embeddings and how an updated
document obtains a replacement. A vector remaining in the same row does not mean
an asynchronous embedding job is current. Carry a source revision/model identity;
reject a late embedding for an old revision. Connect this to the existing derived
copy article without repeating its full outbox lesson. Hybrid lexical/vector
retrieval is a useful closing investigation with explicit candidate combination;
do not imply that raw distance and lexical rank share a comparable numeric scale.

The installed PGlite package inspection found no vector or PostGIS bundle under
its `dist` tree. That is not proof that no browser package exists. Until a compatible
bundle and version are verified, commission a pinned PostgreSQL/pgvector server
exercise and give an honest runnable download. Do not replace pgvector with array
arithmetic while claiming to have tested its index behaviour.

## Ranges and temporal constraints

**Proposed outcome:** represent a booking interval and make invalid overlaps or
uncovered reference periods fail at the database boundary.

The [range chapter](https://www.postgresql.org/docs/18/rangetypes.html) gives range
values, overlap operators and exclusion constraints. Teach endpoint meaning with
adjacent bookings: `[10:00,11:00)` and `[11:00,12:00)` can coexist. Add a second
resource before combining equality on its identity with overlap on its range.
[btree_gist](https://www.postgresql.org/docs/18/btree-gist.html) supplies GiST
operator classes for scalar types; it is a supplied extension that still needs
enabling, rather than an invisible part of the example.

PostgreSQL 18's [CREATE TABLE reference](https://www.postgresql.org/docs/18/sql-createtable.html)
defines `WITHOUT OVERLAPS` temporal keys and `PERIOD` foreign keys. The latter
requires matching referenced periods to cover the referencing period in full;
several referenced rows can provide that coverage. Empty temporal-key ranges are
not allowed. Scalar identity columns commonly require btree_gist. These constraints
do not automatically retain earlier versions or record every historical change.

**Experiment to commission:** accept adjacent reservations, reject a true overlap
for the same resource, accept it for another resource, and correct the attempted
booking. Then model a worker assignment supported by two adjacent authorisation
periods; create a gap and show the full-period reference failure. Test the precise
DDL on the chosen runtime before promising the lesson. An illustrated two-session
schedule can explain why checking availability in application code is weaker, but
a single-connection browser run must not be labelled a concurrency test. Types,
operators and index support become understandable through this one invariant.

## Spatial queries and the extension boundary

**Proposed outcome:** find an eligible pickup point within a real distance, joining
spatial facts with stock or opening-state records, and understand what adopting
the extension commits the operator to support.

[PostGIS](https://postgis.net/) is a separate extension adding spatial types,
operators and indexes. Its [3.6-family ST_DWithin documentation](https://postgis.net/docs/manual-3.6/ST_DWithin.html)
distinguishes geometry units from geography metres. Geography uses spheroidal
distance by default; geometry operands need the same reference system. The function
can use a bounding-box index check before its distance test. Two numeric longitude
and latitude columns alone do not establish a distance in metres.

**Experiment to commission:** give a small set of known coordinates, ask which
pickup points are within a stated radius, and vary both radius and stock filter.
Show candidate bounding regions and actual distance separately. Use a real PostGIS
server and assert identities with points comfortably inside/outside the boundary;
avoid a result dependent on rounding at the threshold. A bigger fixture can expose
the plan's spatial index use. Route planning, raster processing and a general GIS
curriculum stay outside this article.

The fetched 3.6 manual identifies itself as **3.6.5dev**, not a stable 3.6.5 release.
This research establishes documented 3.6-family semantics, not an installed stable
minor or server compatibility matrix. Pin an actual released package and record
`PostGIS_Full_Version()` during authorship. The attempted `postgis_installation.html`
URL failed; do not cite it as checked installation evidence.

[CREATE EXTENSION](https://www.postgresql.org/docs/18/sql-createextension.html)
loads available extension files into one database; it is not a package downloader.
Privileges depend on the extension and its trusted status. The
[extension packaging documentation](https://www.postgresql.org/docs/18/extend-extensions.html)
explains versioned objects and update scripts. Show server package availability,
database enablement and the installed extension version as distinct states. The
adoption decision also needs an upgrade and restore exercise on the target service;
SQL syntax alone cannot establish its allowlist or compatible libraries.

## Recent facilities that earn room in the rebuilt branch

Use the [PostgreSQL 18 release notes](https://www.postgresql.org/docs/18/release-18.html)
to date introductions, then teach mechanisms in their natural article. Do not add
a detached catalogue of release highlights.

| Facility | Where it helps the explanation | Necessary limit |
| --- | --- | --- |
| Temporal keys and period foreign keys, 18 | Ranges article's progression from overlap to coverage | Valid time is not automatic system-versioned history |
| B-tree skip scan, 18 | Index article: vary distinct leading values while filtering a later column | Plan choice depends on distribution and cost; column order still matters |
| Asynchronous I/O, 18 | Architecture: several eligible reads can be outstanding | It is local I/O concurrency, not another write owner or browser-proven server speedup |
| Virtual generated columns, 18 | Contrast read-time calculation with persisted search representation | Explicitly request STORED for the full-text lesson; virtual columns restrict user-defined types/functions |
| uuidv7(), 18 | A short identity/index-locality example if it advances that argument | Timestamp ordering is not commit ordering or an application event clock |
| OLD/NEW in RETURNING, 18 | Show the handler receiving before/after values from one change | Returned rows are not independently a durable audit service |
| SQL/JSON query functions and JSON_TABLE, 17 | JSON-to-relational query path | These are available in 18 but were not introduced there |

For skip scan, the [multicolumn-index documentation](https://www.postgresql.org/docs/18/indexes-multicolumn.html)
explains why a small number of leading values can make repeated searches useful.
Test low and high leading cardinality rather than writing a universal leftmost-column
prohibition. For AIO, [resource settings](https://www.postgresql.org/docs/18/runtime-config-resource.html)
name worker, io_uring and synchronous methods; default worker mode and server-start
configuration matter. Explain architecture in the browser, but use a real server
for any I/O performance claim.

[Generated columns](https://www.postgresql.org/docs/18/ddl-generated-columns.html)
documents virtual as the new default and its restrictions, including indirect use
of user-defined functions/types. This is consequential when extensions supply the
types. [UUID functions](https://www.postgresql.org/docs/18/functions-uuid.html)
provides the uuidv7 timestamp extraction behaviour for a small inspectable example.

OAuth, upgrade-statistics preservation and default checksums are meaningful 18
changes, but belong in access/upgrade/recovery work if commissioned. They should not
consume the capabilities articles merely to make the branch appear current.

## Commissioning and evidence limits

Start with full-text search and JSON: their outcomes are distinct, practical and
likely supportable in the existing browser engine. Then ranges, with btree_gist
registration verified; its bundle is present locally. Commission vectors and
PostGIS with explicit runtime acquisition and verification work. Presence of
btree_gist and pg_trgm package files is the only new local runtime observation in
this pass; no SQL results, latency measurements or extension installation successes
are claimed here.

The coordinator should challenge this proposed map through the planning skill's
independent reader perspectives before final briefs. Each brief needs one connected
question, a substantive subject introduction, state that can be derived before a
query runs, and an experiment whose edited result teaches something new. Keep the
family's representation/design work and the horizontal-scaling commission linked
but separately owned. Adding JSON, search or vector operators does not by itself
answer how more machines share write authority.

Revisit these notes if PostgreSQL 19 becomes the chosen stable baseline, a target
service exposes a different extension release, or the browser runtime changes.
The author must recheck version-sensitive syntax and document any deviation from
the proposed experiments. All URLs in this note were accessed on 15 October 2026;
the failed PostGIS installation URL is disclosed above rather than treated as a
source.
