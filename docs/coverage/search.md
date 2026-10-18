# Search and vector retrieval: proposed coverage map

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/search-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/search-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-retrieval-analysis.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.


Independent proposal, 18 October 2026. Planning only. No articles, routes or changes
to publication status are authorised by this artifact. The ability decomposition in
`search-abilities.md` was persisted before this allocation. Existing search plans,
inventories and coverage maps, earlier field proposals and other collection
derivations were not consulted.

## What the collection promises

The reader should be able to build and defend a search system over an application
corpus: choose its role, represent records, retrieve and rank candidates, measure
usefulness, enforce eligibility, keep copies current, diagnose failure and recover
service. Lexical search is a full route through the collection. Vectors add a
representation and an access-method problem; they do not replace lexical matching,
structured filters or the source's permission promise.

The proposal derives **40 bounded articles**: **28 general articles** and an initial
**12-article Elasticsearch branch**. The 71 units are learning outcomes, not article
quotas. SRnn identifies an article; SRUnn identifies a unit in the abilities file.
All article destinations below are provisional names, not created routes or
available reading. One full home means one place teaches a unit; other pages give
the short local explanation their entrants need and link to that home.

| Identifiable group | Articles | Count | Work it enables |
| --- | --- | --- | --- |
| Search contracts and corpus design | SR01–SR03 | 3 | Decide what search owes the caller and what to index. |
| Lexical retrieval | SR04–SR08 | 5 | Explain matches, ranks, language processing and query assistance. |
| Vector representation and access paths | SR09–SR13 | 5 | Choose representation, exact or approximate access, compression and filters. |
| Retrieval pipelines and result semantics | SR14–SR17 | 4 | Combine candidates and return coherent ranked, faceted and paged results. |
| Quality and diagnosis | SR18–SR20 | 3 | Establish evidence, locate a failure and measure a useful tradeoff. |
| Projection lifecycle | SR21–SR23 | 3 | Ingest, make changes visible and replace or delete generations safely. |
| Permissions and application boundaries | SR24–SR25 | 2 | Enforce eligibility and contain tenant, credential and query risks. |
| Distributed search and operation | SR26–SR28 | 3 | Plan capacity, degraded service and recovery. |
| Elasticsearch: corpus, ingestion and lexical retrieval | SR29–SR32 | 4 | Build the actual mapping and follow writes into searchable segments. |
| Elasticsearch: query execution and ranking | SR33–SR35 | 3 | Trace lexical/vector/hybrid queries and tune actual candidate work. |
| Elasticsearch: protection and diagnosis | SR36–SR37 | 2 | Test access restrictions and investigate incidents. |
| Elasticsearch: deployment, evolution and recovery | SR38–SR40 | 3 | Survive node loss, index replacement, restore and upgrade. |

## A running corpus with consequences

Use a fictional equipment maker's parts catalogue and service library. The corpus
contains exact part codes (`AX-104`, `AX-104B`), variants with voltage/region pairs,
short titles, long manuals, support notes, replacement parts and current/superseded
policies. Manuals have passages; parts remain canonical parent records. Some source
files are scanned or malformed. English and Swedish content include inflections,
accents and mixed-language titles. A multilingual example teaches the need to test
the chosen languages; it cannot establish that one analyser or embedding supports
every language.

Each source has `source_id`, `source_revision`, `tenant_id`, `acl_revision`,
`language`, `effective_at`, `supersedes`, canonical URL and extraction status.
Passages add `passage_id`, `parent_id`, offsets, chunker version and embedding
manifest. Two tenants and a revocable service group make leakage observable.
Queries include an exact code, a misspelling, a paraphrase, a phrase, an ambiguous
synonym and a valid no-answer case. A fixed miniature corpus supports exact models;
a separately versioned larger workload supports native experiments.

The source is authoritative. Inventory actions and policy applicability still need
source checks. Explicit examples show which search use could tolerate lag and which
must reject a stale or unauthorised hit. This is an invented teaching dataset, not
an experiment already executed.

## Article allocation

Every entry below names its owned units and sections, the entering knowledge, the
teaching form and an essential changed case. Its final decision is the test of
whether the page earns the reader's time.

## Search contracts and corpus design

### SR01 — What a search result promises

 Outcome: distinguish matching, ranking,
eligibility and source truth. Own SRU01 in “Information needs”, SRU02 in “The result
contract”, and SRU03 in “A projection of the source”. Entry: ordinary application
reads and writes; introduce candidate and rank locally. Form: several queries and
two read/write paths. Change: the highest-scoring policy is superseded, then access
is revoked without changing its text. Decision: state acceptable result behaviour
before choosing lexical, vector or hybrid retrieval. Keep these concepts together
because one apparently good result demonstrates why all the promises matter.

### SR02 — Choosing a search or vector retrieval system

 Outcome: choose a plausible architecture
and the evidence needed to justify it. Own SRU04 in “Use the existing store”,
“Static and embedded indexes”, and “Dedicated search and vector services”. Entry:
SR01's contract, summarised in a small local checklist. Form: three workloads—public
site search, a transactional catalogue and a large permissioned service library—with
credible alternatives and operating costs. Compare a static site index (such as Pagefind), the existing PostgreSQL full-text/pgvector path, a dedicated search system (Elasticsearch), and a dedicated vector service (such as Qdrant) only where each is credible for the stated workload. Use result quality, filters/permissions, freshness, recovery, resource and operating obligations as the comparison; product operation remains separate. Current product capabilities require evidence in the later brief. Change: the catalogue acquires selective
tenant filters and rapid permission changes. Decision: keep the existing system,
trial a dedicated one or reject the extra copy. Comparison gets a separate entrance
because readers choosing a system should not need the entire mechanisms route.

### SR03 — Choose the records search will see

 Outcome: build an inspectable corpus
and choose document versus passage granularity. Own SRU05 in “Extraction and source
identity”, SRU14 in “Fields and relationships”, and SRU17 in “Passages and parents”.
Entry: records and basic JSON; explain index representation locally. Form: one manual
and one part family transformed into alternative search records. Change: extraction
returns no text; then variants cross-match; then many chunks crowd out other parents.
Decision: choose fields, record boundaries, metadata inheritance and completeness
checks. Keep lexical and vector corpus design together: otherwise a passage split
would be taught as an embedding trick rather than a source-identity decision.

## Lexical retrieval

### SR04 — How an inverted index finds the best matches

 Outcome: trace a term from
dictionary to postings to scored candidates. Own SRU06 in “Terms, positions and
stored values”, and SRU11 in “Top-k without scoring everything”. Entry: no retrieval
background; use a dozen short records. Form: inspectable postings and a step-through
safe score-bound skip. Change: a phrase needs positions, then an unsafe early cutoff
misses the winner. Decision: explain which index data the query needs and why faster
execution need not mean approximate matching. Keep skipping with postings because
the data layout makes its safety intelligible.

### SR05 — Turn text into searchable terms

 Outcome: predict and inspect analysis
at ingestion and query time. Own SRU07 in “Tokens, positions and offsets”, and SRU08
in “Languages and exact identifiers”. Entry: what a posting means; include a short
trace for direct entrants. Form: editable token/position view with paired source and
query analysis. Change: stemming helps a Swedish query but normalising a part code
merges different parts; a stopword changes a phrase. Decision: choose analysis per
field and language and know when a change needs reindexing. This investigation would
interrupt SR04's access-path argument and has its own diagnosis entrance.

### SR06 — Write lexical queries and explain their ranking

 Outcome: convert user
intent into deliberate matching and scoring. Own SRU09 in “Boolean, phrase and
field matching”, and SRU10 in “Term rarity, frequency and document length”. Entry:
tokens; introduce the needed BM25 quantities in words before calculation. Form:
visible matching sets and ranked records with one field/length/term count changed.
Change: a long manual outranks an exact short title, then a business boost buries an
exact part code. Decision: alter matching rules, field weights or ranking signals
and test the intended consequence. Keep matching and scoring distinct but adjacent
so the reader does not tune scores for records that never matched.

### SR07 — Search while the reader types

 Outcome: choose prefix, completion,
n-grams, spelling suggestions or fuzzy matching for a stated interaction. Own SRU12
in “Partial input”, “Mistakes and edit distance”, and “Request and index cost”. Entry:
term versus document matching, explained in a small local example. Form: a typing
sequence with candidate sets, expansion counts and index-size accounting. Change:
one-character input and a short part code create many false matches under fuzziness.
Decision: select the mechanism and limits per field and input length. It earns a
separate page because keystroke traffic and partial-input indexes differ from a
finished query; a full UI component tutorial remains outside scope.

### SR08 — Change query meaning with synonyms and rewrites

 Outcome: manage query
expansion without silently damaging precision or phrases. Own SRU13 in “Directional
and equivalent terms”, “Multiword token graphs”, and “Changing a synonym set”. Entry:
analysis positions; a local two-token diagram suffices for direct entrants. Form:
before/after query graphs and a regression set. Change: “notebook” retrieves paper
notebooks as well as computers, then a multiword expansion changes phrase matches.
Decision: choose expansion direction and query/index-time ownership, and decide when
to reindex or roll back. Keeping it out of SR07 avoids treating domain vocabulary
changes as spelling corrections.

## Vector representation and access paths

### SR09 — What similarity vectors preserve

 Outcome: specify a representation and
similarity contract rather than assume proximity means relevance. Own SRU15 in
“Distance and normalisation”, SRU16 in “The embedding manifest”, and SRU24 in “Sparse
and multiple-vector representations”. Entry: no vector mathematics; start with a
small picture and counted products. Form: geometry, real embedding inspection and
bounded sparse-weight/late-interaction worked cases. Change: compatible dimensions
hide incompatible models; a semantically related manual is inapplicable. Decision:
choose metric and representation and identify evaluation needed. SRU24 teaches how
sparse term weights and token-vector late interaction change retrieval/scoring and
storage; model training and a complete specialised serving branch are outside scope.

**Reading route:** dense similarity, metric/normalisation and model compatibility
are the core route to SR10's exact reference. Learned sparse and token-vector late
interaction are explicitly optional selection-level contrasts, with their distinct
score and stored-state costs. Neither is a compulsory first-vector prerequisite or
a claim to teach a specialist serving implementation.

### SR10 — Exact neighbours and HNSW graph search

 Outcome: explain approximation
against a fixed reference and tune graph effort knowingly. Own SRU18 in “An exact
reference”, and SRU19 in “Build and walk a neighbour graph”. Entry: vector similarity,
recapped with the page's metric; no graph theory prerequisite. Form: exhaustive
distance ledger and adjustable graph traversal, followed by a native worksheet.
Change: a greedy walk misses the exact neighbour; greater search breadth helps but
cannot compensate for every construction choice. Decision: use exact search for a
small eligible set or spend build/memory/query effort on HNSW. The exact baseline
stays here because it makes every later ANN experiment interpretable.

### SR11 — Search vector partitions with IVF

 Outcome: explain a trained partition
index and its failure under insufficient probes or a changing corpus. Own SRU20 in
“Train the partitions”, “Choose lists to search”, and “Distribution drift”. Entry:
similarity and the idea of exact-neighbour recall, introduced locally. Form: visible
centroids/lists and a native comparison with fixed data. Change: the best vector is
across a list boundary; newly ingested documents shift the distribution. Decision:
choose training data and query probes, or justify a different access path. IVF earns
its own mechanism investigation because a graph explanation cannot teach training
or list imbalance.

### SR12 — Compress vectors without hiding the loss

 Outcome: account for bytes and
candidate errors under scalar, binary and product quantisation. Own SRU21 in “Encode
the values”, “Search compressed values”, “Rescore raw vectors”, and “Memory and disk”.
Entry: distance and candidate selection; introduce quantisation from rounded values.
Form: inspectable distance reversals, byte ledger and proposed native rescoring
exercise. Change: compression removes a useful candidate before a precise reranker
can inspect it; a cold working set turns saved RAM into IO. Decision: choose a
compression/rescore policy at measured quality and latency. It is separate from IVF
because quantisation also applies to graph and exhaustive paths.

### SR13 — Find neighbours inside a filter

 Outcome: choose a filtered access path
and explain too-few-hit and slow-query cases. Own SRU22 in “The eligible population”,
“Filter before, after or during traversal”, and “Exact fallback and oversampling”.
Entry: similarity and top-k; give a tiny local graph rather than require SR10 in full.
Form: one query across broad and selective tenant/region filters, compared with exact
filtered neighbours. Change: filtering a global top 10 leaves one result, despite
ten eligible neighbours existing elsewhere. Decision: adjust plan, payload/index
design or search effort while retaining the same mandatory predicate. Product
contrasts belong here; security enforcement as an application promise belongs SR24.

## Retrieval pipelines and result semantics

### SR14 — Combine lexical and vector candidates

 Outcome: design and evaluate a
hybrid candidate pool and fusion rule. Own SRU25 in “Union and intersection”, and
SRU26 in “Fuse ranks or scores”. Entry: a ranked list and top-k; provide the two
retrievers' small input lists. Form: candidate ledger and worked RRF/normalised-score
calculations. Change: vector retrieval loses an exact code; narrowing either window
changes fusion and removes a relevant record. Decision: choose windows, fusion and
weights for query slices, or keep a simpler retriever. Fusion deserves its own page
because adding two raw scores can fail before expensive reranking is considered.

### SR15 — Spend ranking work on the right candidates

 Outcome: set a multi-stage
ranking budget and produce useful, diverse final results. Own SRU27 in “First stage
and reranking”, and SRU28 in “Parents, duplicates, thresholds and ties”. Entry:
candidates versus returned hits; a local funnel supplies that context. Form: stage
ledger with CPU/inference budgets and result-list variations. Change: a reranker
cannot rescue a missing part; one manual's passages fill the page; an inference
timeout triggers a declared fallback. Decision: pick candidate/rerank counts and
collapse/diversity rules, including when to return no result. Reranker training,
personalisation modelling and generative answer construction are external.

### SR16 — What facets and counts actually count

 Outcome: make counts and facets
describe a declared result population. Own SRU31 in “Matches, candidates and hits”,
“Facet filter scope”, and “Distributed errors and limits”. Entry: structured filters;
show top-k locally for vector entrants. Form: the same request with three visible
populations and different facet counts. Change: a vector result window hides almost
all parts in a category, while a shard-local bucket cutoff misses a global bucket.
Decision: label and compute counts appropriately or omit a misleading facet. This
is an independent debugging entrance; putting it inside ANN would conceal the
problem from readers of ordinary catalogue search.

### SR17 — Fetch, explain and page through results

 Outcome: return inspectable hits
and navigate them with explicit stability limits. Own SRU29 in “Fetch and source
evidence”, and SRU30 in “Order, cursors and snapshots”. Entry: a ranked result ID;
introduce hydration and a unique tie-breaker locally. Form: result cards tied to
source offsets, then edits interleaved with paging. Change: a source revision makes
a snippet stale; refresh repeats a tied hit on the next page; a stable snapshot pins
resources. Decision: choose source hydration, snippet provenance and a paging
contract, including bounded ANN result windows. Both units follow the same hit from
candidate identity to a displayed, navigable result.

## Quality and diagnosis

### SR18 — Evaluate retrieval against what readers need

 Outcome: create an honest
judged test set and interpret its measures. Own SRU33 in “Queries and judgements”,
SRU34 in “Usefulness, neighbour agreement and hard checks”, and SRU35 in “Incomplete
labels and uncertainty”. Entry: result lists; formulas follow worked relevance
grades. Form: build a small query set, calculate precision/MRR/nDCG and compare with
an ANN reference. Change: ANN recall improves while current-policy relevance falls;
unjudged records make a new system look worse. Decision: choose metrics and slices,
and state what evidence supports a ranking change. Eligibility/freshness violations
are failures, never averaged away as a small relevance penalty.

### SR19 — Diagnose a search miss and validate the repair

 Outcome: locate the stage
that lost a useful record and test a change without trusting raw click totals. Own
SRU37 in “Trace source to result”, and SRU36 in “Online evidence and feedback”.
Entry: no full internals route required; a local source/analysis/candidate/rank/fetch
trace defines the stages. Form: missing-hit incidents followed by a controlled
ranking rollout. Change: a click increase comes from a harder-to-find answer and
exposure changes, while a source-pipeline fault never reaches retrieval. Decision:
repair extraction, representation, retrieval, ranking or display; then choose
offline regression and online guardrails. The online material stays a bounded
validation section; a general experimentation course is external.

### SR20 — Measure the retrieval tradeoff on your workload

 Outcome: produce a
reproducible quality/recall/latency/cost comparison. Own SRU38 in “Freeze the reference”,
“Vary one search condition”, and “Load, builds and the working set”. Entry: quality
versus ANN recall, briefly restated with explicit denominators. Form: an executable
benchmark worksheet for actual engines, with corpus/query/filter/update manifests.
Change: a warm, unfiltered single-client winner loses under selective filters,
concurrent ingestion or cold IO. Decision: select a feasible configuration and
identify the limiting resource. Keep benchmarking outside SR18: judging usefulness
and applying load answer different questions, and a tiny illustration is not a
production benchmark.

## Projection lifecycle

### SR21 — Keep source changes in order

 Outcome: build an ingestion path that can
retry and prove completeness. Own SRU39 in “Identity and revision order”, SRU40 in
“Partial batches and backpressure”, and SRU45 in “Lag and reconciliation”. Entry:
source IDs and revisions, taught locally with two events. Form: replayable event and
checkpoint ledger plus a bulk-ingestion worksheet. Change: an old embedding job
finishes late, an item in a successful HTTP batch fails, and a lost delete is found
by reconciliation. Decision: choose version guards, retry boundaries, checkpoints
and repair. Keep these steps together: retry correctness without a completeness
check leaves a quiet failure path.

**Coordinated scope:** FD04 owns the generic source/snapshot/replay/checkpoint
protocol. SR21 applies it to revision-bound indexing jobs, partial item work,
late embedding completion and search reconciliation. Keep those search-specific
consequences; do not reproduce another general change-capture tutorial.

### SR22 — When indexed changes become visible

 Outcome: distinguish acceptance,
durability, search visibility and maintenance state. Own SRU41 in “Three write
boundaries”, SRU53 in “Segments and merging”, and SRU23 in “Changing vector indexes”.
Entry: an index as a derived access path. Form: write/search/crash timelines, segment
states and a vector-mutation sequence. Change: an acknowledged write is not yet
searchable; deletes leave space behind; merge or graph maintenance competes with
queries. Decision: set a visibility requirement and maintenance policy without
assuming every engine uses Lucene segments or the same graph-delete mechanism.
General consequences are taught here; commands and exact crash guarantees stay in
the implementation branch.

### SR23 — Replace an index generation while writes continue

 Outcome: migrate
schema, analysers, chunks or embeddings without serving a silently incomplete copy.
Apply FD04 for SRU42’s generic “Backfill and catch-up” proof; own SRU43 in “Compatible query and corpus versions”,
and SRU44 in “Deletion through migration and recovery”. Entry: source revisions and
search visibility, summarised in the generation diagram. Form: cutover timeline and
record/permission/deletion ledgers. Change: a delete occurs during backfill, then an
embedding change mixes incompatible spaces; rollback or restore revives a deletion.
Decision: set a catch-up fence, validate generations, switch service pointers and
retain enough deletion evidence for replay. Deletion stays a substantial section
because every replacement path must preserve it; SR24 owns immediate eligibility.

**Coordinated scope:** FD04 owns SRU42's generic backfill/catch-up proof. This
page owns compatible query/corpus/model generations and preservation of deletes
through cutover and recovery (SRU43/SRU44). Native Elasticsearch alias/version
procedures remain SR39. Direct entrants receive the needed local fence diagram.

## Permissions and application boundaries

### SR24 — Make every retrieval stage respect access

 Outcome: enforce the source's
eligibility promise and explain its race windows and leakage limits. Own SRU46 in
“One mandatory predicate through the pipeline”, SRU48 in “Permission changes and
revocation”, and SRU50 in “Counts, terms and untrusted content”. Entry: users, groups
and document IDs; explain candidate filtering locally. Form: two-principal denied
tests across hits, facets, suggestions, reranking, caches and source fetch. Change:
a group loses access between retrieval and hydration; a non-hit endpoint reveals
restricted vocabulary. Decision: choose enforcement and revalidation points and a
fail-closed policy. A top-k recall improvement cannot justify dropping the predicate.

### SR25 — Isolate tenants and bound search requests

 Outcome: choose a tenancy,
credential and API boundary that fits trust and workload. Own SRU47 in “Index and
service boundaries”, SRU49 in “Credentials and private diagnostics”, and SRU32 in
“Translate and limit requests”. Entry: tenant IDs and ordinary service authentication;
no prerequisite cluster course. Form: data-flow diagram, tenant-skew cases and
bounded request examples. Change: one tenant floods an expensive expansion or
reranker, a shared cache omits principal identity, and an inference endpoint receives
private text. Decision: choose shared/separate resources, least-privilege identities,
cache keys and admission limits. SR24 teaches content eligibility; this page teaches
the surrounding resource and trust boundary rather than repeating ACL matching.

## Distributed search and operation

### SR26 — Search across shards and replicas

 Outcome: predict distributed top-k,
term statistics, routing and partial-result behaviour. Own SRU51 in “Local retrieval
and global merging”, and SRU52 in “Copies, acknowledgements and failures”. Entry:
ranked candidates and a visibility boundary; supply both in a local two-shard
example. Form: scatter/gather and node-failure traces. Change: rare terms are uneven
across shards, a hot tenant dominates one shard, and an unavailable shard produces
an apparently plausible partial list. Decision: choose routing and replica policy
and declare when partial service is acceptable. Teach only mechanisms needed to
reason about search; consensus and general replication theory remain parked.

### SR27 — Keep search inside its resource budget

 Outcome: account for capacity,
recognise overload and choose a safe response. Own SRU54 in “Working set and build
headroom”, SRU55 in “Admission and competing work”, and SRU56 in “Signals that explain
the failure”. Entry: candidate work and index maintenance, locally recapped. Form:
byte/work accounting and an incident dashboard. Change: increased ANN effort and a
rebuild exhaust headroom; cluster health stays green while source lag grows.
Decision: change resources, candidate budget, concurrency or ingestion rate based
on evidence. The incident view joins accounting to action; a full observability
platform or search-engine log-analysis product is outside scope.

### SR28 — Recover a search service and change its version

 Outcome: choose restore
or rebuild and return only a compatible, sufficiently current service. Own SRU57 in
“Recovery inputs and objectives”, and SRU58 in “Upgrade and rollback limits”. Entry:
source projection and generation identity, stated locally. Form: recovery and
upgrade rehearsal worksheets covering index, templates, ACLs, model artifacts and
query service. Change: a good snapshot has old permissions and incompatible query
vectors; an upgraded format cannot be downgraded. Decision: choose recovery targets,
replay/fencing and rollout strategy. Recovery and upgrade stay together because
both require a usable whole system, not merely readable index bytes.

## Elasticsearch: corpus, ingestion and lexical retrieval

The branch is an **initial representative implementation proposal**, using a pinned
self-managed Elasticsearch release in isolated local environments. It is not a
generic recipe for Cloud Serverless, every managed service, OpenSearch or Lucene
directly. A version/licence/deployment manifest is required in each practical
commission. Fixed precomputed vectors make core exercises possible without model
credentials; an optional pinned local inference path can exercise genuine text
embedding and reranking. A model of a crash or permission system cannot substitute
for the native test where that behaviour is the lesson.

### SR29 — Map and inspect an Elasticsearch corpus

 Outcome: create mappings that
preserve the corpus's fields and relationships. Own SRU59 in “Source and indexed
representations”, “Mappings and nested records”, and “Inspect analysis”. Entry:
basic JSON; introduce index and mapping before requests, and link SR03/SR05 for the
general mechanisms. Form: native create/index/analyse/term-inspection worksheet.
Change: dynamic mapping picks the wrong type, then flattened variants match an
impossible pair. Decision: choose explicit mappings, analysis and source retention.
This owns actual field settings; it does not re-teach all corpus design.

### SR30 — Diagnose Elasticsearch lexical queries

 Outcome: read a failed or poorly
ranked lexical request and improve it against a regression set. Own SRU63 in
“Query DSL match and filter”, “Explain a score”, “Synonym graphs”, and “Rank evaluation”.
Entry: an index with text/exact fields; a local match trace supplies basic analysis
context. Form: actual analyse/explain/search/rank-evaluation requests and responses.
Change: a term-level query targets analysed text, then a synonym change breaks a
phrase. Decision: choose the request or analyser repair and validate query slices.
Keep this separate from mappings: someone debugging a request should enter without
following the entire provisioning lesson.

### SR31 — Ingest source revisions into Elasticsearch

 Outcome: retry ingestion
without older source state replacing newer state. Own SRU60 in “Bulk item outcomes”,
“Source versions and concurrency tokens”, and “Ingest pipelines and checkpoints”.
Entry: stable source identity; teach the distinction between source revisions and
Elasticsearch sequence numbers locally. Form: executed partial-batch, conflicting
update and out-of-order job exercises. Change: an HTTP-successful bulk contains
failures and a delayed embedding completion arrives after a newer delete. Decision:
choose external revision handling, conditional writes and retry granularity. Native
API semantics earn a page beyond the general pipeline ledger.

### SR32 — Follow an Elasticsearch write through refresh and recovery

 Outcome:
explain exactly why a write is acknowledged, visible or recoverable under stated
settings. Own SRU61 in “The translog and acknowledgement”, “Refresh versus flush”,
and “Segments, replacement and merges”. Entry: an indexed document; the three write
boundaries are restated before the first request. Form: isolated process/crash and
search execution plus segment/log diagrams. Change: immediate search misses an
acknowledged record, then a declared durability change alters crash loss exposure.
Decision: choose refresh and durability behaviour and interpret maintenance work.
This is substantial implementation depth; it cannot become a refresh-setting note
inside an Elasticsearch overview.

## Elasticsearch: query execution and ranking

### SR33 — Trace an Elasticsearch query across shards

 Outcome: connect the actual
query/fetch response to candidate work, scoring and paging. Own SRU62 in “Query and
fetch”, “Shard statistics, routing and caches”, and “PIT and search-after”. Entry:
search request/result basics; introduce two shards locally. Form: profile/explain
responses, a changed shard layout and concurrent paging exercise. Change: term skew
changes ordering, a shard fails, and a refresh causes pagination drift without a
stable view. Decision: change query/routing or paging contract and distinguish
profiled engine work from end-to-end latency. Node resource diagnosis belongs SR37.

### SR34 — Build and tune filtered vector search in Elasticsearch

 Outcome: select
and verify actual vector mapping and query behaviour. Own SRU64 in “Dense-vector
mapping and index choice”, “Exact reference and candidate effort”, and “Filter
placement and rescoring”. Entry: a metric and embedding manifest, restated locally;
SR10/SR12/SR13 provide mechanism depth. Form: native exact/ANN queries over identical
vectors, selective filters and a pinned compression choice. Change: moving the same
predicate outside the kNN prefilter loses eligible hits; changed effort trades work
for agreement. Decision: choose settings based on filtered exact-neighbour recall
and judged quality separately. Defaults and supported index types need release checks.

### SR35 — Assemble an Elasticsearch hybrid ranking pipeline

 Outcome: configure a
working lexical/vector/fusion/rerank path and inspect where records disappear. Own
SRU65 in “Retriever windows”, “Fusion and reranking”, and “Inference failure and
fallback”. Entry: two ranked lists; supply a small candidate ledger so SR14 is useful
but not a gate. Form: native pipeline requests with stage IDs and a version/licence
manifest. Change: a small retrieval window drops an exact-code match; a reranker or
inference dependency times out. Decision: choose pipeline windows, fallback and
whether the extra stage earns its latency and operating cost. Do not promise that
all shown features run on every free or hosted deployment.

## Elasticsearch: protection and diagnosis

### SR36 — Enforce and test Elasticsearch access boundaries

 Outcome: demonstrate
what the chosen security configuration permits, denies and can still disclose. Own
SRU67 in “API keys and roles”, “Document and field rules”, and “Non-hit endpoints and
limitations”. Entry: users and tenant/ACL fields; introduce principal-specific
queries locally. Form: executed two-principal suite across searches, aggregations,
suggestions, profiling, direct fetch and relevant administrative APIs, with explicit
licence/deployment prerequisites. Change: combined roles widen access or a metadata
probe reveals information beyond returned hits. Decision: choose product controls,
application enforcement and resource isolation; never sell filtered aliases as a
universal security boundary.

### SR37 — Investigate a slow or incomplete Elasticsearch search

 Outcome: use
engine evidence and source traces to identify one cause before tuning. Own SRU68
in “Query evidence”, “Node, index and merge evidence”, and “Source and quality traces”.
Entry: a search request; local diagrams distinguish queue, execution, fetch and
outside-engine work. Form: incident packets with profile, slow logs, statistics,
rejections and ingestion revision lag. Change: the same slow response arises from
query expansion, cold vector IO or source/inference delay. Decision: make a measured
corrective change and rerun the relevant query/load/quality check. This page is a
diagnosis entrance, not another compressed reference manual of every setting.

## Elasticsearch: deployment, evolution and recovery

### SR38 — Place shards and recover from node loss in Elasticsearch

 Outcome:
explain allocation and restoration of service after a copy disappears. Own SRU66
in “Roles and allocation”, “Replication and promotion”, and “Placement and lifecycle”.
Entry: an index and replicas; a local cluster diagram supplies the rest. Form:
isolated multi-node worksheet using allocation and recovery evidence. Change: a
node fails, a disk watermark prevents reassignment, or tenant skew makes nominally
balanced shard counts misleading. Decision: choose shard/replica placement, recovery
headroom and partial-service behaviour. Index lifecycle/tiering is taught only as
needed for application search; a complete observability-data platform stays out.

### SR39 — Replace an Elasticsearch index without losing changes

 Outcome: perform
a generation migration with source-aware catch-up and serving cutover. Own SRU70
in “Templates and destination setup”, “Reindex tasks and source revisions”, and
“Alias cutover, verification and rollback”. Entry: source revisions and generation
identity, introduced in the opening ledger. Form: native reindex/alias worksheet
with concurrent upserts and deletes and deterministic verification. Change: reindex
finishes but a deletion or mapping change is absent from the destination; switching
back serves an older state. Decision: use reindex, rebuild from source or dual-write
with a verifiable catch-up fence. This is separate from allocation because moving
shard copies cannot transform a corpus or prove migration completeness.

### SR40 — Restore and upgrade Elasticsearch as a usable system

 Outcome: recover
compatible data and configuration, then re-establish current service safely. Own
SRU69 in “Repository, snapshot contents and restore”, and SRU71 in “Upgrade paths
and rollback limits”. Entry: source generations and cluster identity; give a local
inventory of query/model/security dependencies. Form: isolated snapshot/restore and
version-pinned upgrade rehearsal with fenced credentials and source replay. Change:
a restore lacks required external configuration, reintroduces a deleted record or
targets an incompatible version. Decision: choose restore versus rebuild and a
supported upgrade path. Keep recovery and compatibility together; complete upgrade
commands for every historical version remain an external reference.

## One full home for every derived unit

This is the auditable allocation, not a second decomposition. Section ownership is
spelled out in each article above. Every SRU unit appears once in this table.

| Full home | Units | Full home | Units |
| --- | --- | --- | --- |
| SR01 | SRU01, SRU02, SRU03 | SR21 | SRU39, SRU40, SRU45 |
| SR02 | SRU04 | SR22 | SRU23, SRU41, SRU53 |
| SR03 | SRU05, SRU14, SRU17 | SR23 | SRU43, SRU44; SRU42 shared proof is FD04 |
| SR04 | SRU06, SRU11 | SR24 | SRU46, SRU48, SRU50 |
| SR05 | SRU07, SRU08 | SR25 | SRU32, SRU47, SRU49 |
| SR06 | SRU09, SRU10 | SR26 | SRU51, SRU52 |
| SR07 | SRU12 | SR27 | SRU54, SRU55, SRU56 |
| SR08 | SRU13 | SR28 | SRU57, SRU58 |
| SR09 | SRU15, SRU16, SRU24 | SR29 | SRU59 |
| SR10 | SRU18, SRU19 | SR30 | SRU63 |
| SR11 | SRU20 | SR31 | SRU60 |
| SR12 | SRU21 | SR32 | SRU61 |
| SR13 | SRU22 | SR33 | SRU62 |
| SR14 | SRU25, SRU26 | SR34 | SRU64 |
| SR15 | SRU27, SRU28 | SR35 | SRU65 |
| SR16 | SRU31 | SR36 | SRU67 |
| SR17 | SRU29, SRU30 | SR37 | SRU68 |
| SR18 | SRU33, SRU34, SRU35 | SR38 | SRU66 |
| SR19 | SRU36, SRU37 | SR39 | SRU70 |
| SR20 | SRU38 | SR40 | SRU69, SRU71 |

The following are explicit boundaries rather than missing unit homes:

| Subject | Boundary/status and sufficient local treatment |
| --- | --- |
| AI generation and answer evaluation | Another planned field. Search returns records, provenance and scores. SR17 explains why a snippet is not answer proof; no answer-generation tutorial. |
| Embedding/reranker training | External. SR09/SR15 teach inference contracts, representation/scoring and operating consequences. Training recipes, fine-tuning and model research are not required to operate retrieval. |
| General distributed systems | Parked. SR26/SR38 teach only search-specific fan-out, replicas, failure and recovery. No new consensus, coordination or messaging programme. |
| Source transactions, CDC delivery and application invariants | FD03 owns the shared contract vocabulary; FD04 owns generic copy handover/replay/completeness. SR01/SR21 explain source truth and indexing delivery locally, with duplicate/out-of-order events. Native source transaction/CDC protocols remain in their implementation branches; all destinations are proposed reading. |
| Web-scale crawling, search advertising and PageRank/link analysis | Outside this application-corpus collection. SR03 covers extraction completeness and provenance only. |
| Recommendation and personalisation systems | Outside scope. Similar-item retrieval is one possible use of SR09; user modelling, exploration and recommendation evaluation need their own commission. |
| Multimodal retrieval | Representation contract in SR09 and comparison conditions in SR02. A complete image/audio extraction and evaluation branch is deferred until an actual workload warrants it. |
| Learned sparse and late interaction | Bounded general teaching in SR09, with primary-paper references. No separate implementation branch initially; promotion needs evidence that one-vector/lexical teaching leaves a consequential task unearned. |
| Geography and spatial access | Local structured filter examples only. Geometry indexing belongs to its own database topic. |
| Security, cryptography and privacy engineering | SR24/SR25 teach the retrieval boundary and concrete disclosure paths; general cryptography, threat modelling and legal retention advice remain external. |
| Other product deep dives | Comparisons are in SR02 and mechanism-specific contrasts. No implied full branch for every vendor. |

## Entrances and reading cost

A newcomer can take SR01 → SR03 → SR04 → SR05 → SR06 → SR18. They can build and
evaluate useful lexical search before adding vectors. SR07/SR08 answer specific
query-assistance needs. SR02 is a separate decision entrance, not compulsory opening
reading. A reader implementing search then takes SR21/SR24 before returning results;
lifecycle and access are not optional polish.

A vector entrant can start SR09 → SR10 → SR13 → SR18. SR11/SR12 answer a particular
access-path or memory constraint; they need not be gates on a first vector trial.
SR03 supplies passage identity, SR14/SR15 supply hybrid/reranked pipelines. A reader
already holding an ANN benchmark should enter SR20, whose opening restates why an
exact-neighbour reference does not judge search usefulness.

A missing-result entrant starts SR19; an access incident starts SR24; stale or
missing source changes start SR21/SR22. A production operator starts SR26/SR27/SR28.
Each includes a local model of the prerequisite mechanism instead of sending the
reader through the whole collection. These reminders do not become second full
homes.

An Elasticsearch entrant uses SR29 as a practical setup entrance, then chooses
SR30/SR31 or SR34/SR35. SR32 and SR36 are necessary before relying on write/search
and permission behaviour. An operating journey continues SR33 → SR37 → SR38 → SR39
→ SR40, with mechanism links as needed. Twelve articles buy actual request-level
understanding through failure and recovery; they are not twelve instalments of an
unbounded product catalogue.

The notable page costs are intentional. Autocomplete and synonym management have
different representations, traffic and regression failures. HNSW, IVF and compression
need different visible mechanisms; a catalogue paragraph would not teach their
failure modes. Filtered retrieval, facets and result paging each have direct
debugging entrances and different population/stability promises. Quality judgement
and performance benchmarking cannot share an undifferentiated “evaluation” page.
Conversely, exact search stays with HNSW as the reference; parent collapse stays
with reranking; deletion stays with migration; upgrade compatibility stays with
recovery. These combinations reduce context changes without erasing decisions.

## Product comparisons and the initial branch decision

SR02 should compare **PostgreSQL full-text plus pgvector**, **Elasticsearch and
OpenSearch**, **Qdrant**, **Vespa**, and a **static/embedded index** against concrete
workloads. These are credible architectural contrasts, not an exhaustive vendor
list or ranking. Compare source synchronisation, lexical expressiveness, filtered
retrieval, ranking stages, update visibility, tenancy, operation and recovery.
Faiss supplies an algorithm-library contrast: an ANN index library is not by itself
a service with the application's access, durability and lifecycle promises.

The recommendation to investigate Elasticsearch first is a planning judgement:
its lexical/vector query surface, Lucene mechanisms and operational APIs let one
branch exercise the full chain. It is not evidence that Elasticsearch is the best
choice for the three example workloads. OpenSearch's pipeline and Qdrant's filtering
provide useful counterexamples to product-shaped general explanations. Vespa's
phased ranking keeps ranking depth from collapsing into an RRF-only story.

The consequential unresolved choice is the branch's access to licensed or
deployment-specific features. Native DLS/FLS, fusion/rerank facilities and model
serving need an exact availability check at commission time. A trial environment
can verify a scoped lesson if its expiry and edition are explicit; it cannot be
presented as an unqualified free path. If a sustainable reproducible path cannot be
provided, discuss choosing OpenSearch or Vespa as the initial branch, or retain a
smaller application-enforced Elasticsearch exercise with its true limits. Do not
silently replace real permission tests with a browser model or relabel one product's
guarantees as general.

## Primary-source scope check

Checked 18 October 2026. These are **planning sources**, read to challenge the
breakdown. They do not verify a completed article, a benchmark or an executed
worksheet. Rolling documentation must be pinned to a release/deployment/licence
when commands, defaults, limits or guarantees become article claims. No experiments
have run. The observations below are deliberately narrow; the page allocation is
our inference from them.

| Primary source | What it challenges and the resulting planning decision | Later verification |
| --- | --- | --- |
| [Lucene BM25Similarity, 10.3.1](https://lucene.apache.org/core/10_3_1/core/org/apache/lucene/search/similarities/BM25Similarity.html) | Exposes rarity, saturation and length normalisation. SR06 must explain score changes, not present a relevance score as confidence. | Exact formula/implementation and score explanations in the chosen engine release. |
| [Elastic analysis concepts](https://www.elastic.co/docs/manage-data/data-store/text-analysis/concepts), [synonym configuration](https://www.elastic.co/docs/solutions/search/full-text/search-with-synonyms) | Separates analysis, token graphs and synonym management. SR05 and SR08 need visible positions and regression cases. | Exact analyser chains, reload behaviour and reindex requirements. |
| [Faiss index catalogue](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes) | Distinguishes flat, HNSW, IVF and several encodings, including different mutation support. SR10–SR12 and SR22 must not imply one universal ANN index lifecycle. | Pin a Faiss commit for native comparisons; inspect actual delete/build capabilities. |
| [pgvector README](https://github.com/pgvector/pgvector) | Documents exact/approximate retrieval, post-scan filtering and iterative scans. SR13 must compare filtered exact references and actual execution strategies. | Pin extension/Postgres versions and query plans; do not transfer its filtering rule to other engines. |
| [Elasticsearch kNN query](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-knn-query) | Documents filter placement and query-dependent aggregation populations. SR13/SR16/SR34 must separate eligible population, candidates and reported counts. | Reproduce exact query form, index type and shard count; inspect partial and too-few-hit cases. |
| [Qdrant filtering](https://qdrant.tech/documentation/search-patterns/vector-search-filtering/) | Describes payload indexes and filterable HNSW edges. Filtering is part of planning/index construction, not merely a final predicate. | Chosen version's planner, index build sequence and observed filtered workload. |
| [SPLADE paper](https://arxiv.org/abs/2107.05720), [ColBERT paper](https://arxiv.org/abs/2004.12832) | Sparse learned weights and token-level late interaction challenge a dense-vector-only family description. SR09 needs their mechanism and resource consequences. | Read the relevant method sections and verify the precise serving form before article claims; no transfer of paper benchmark numbers. |
| [OpenSearch hybrid search](https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/index/), [normalisation processor](https://docs.opensearch.org/latest/search-plugins/search-pipelines/normalization-processor/) | Score-based and rank-based fusion preserve different information; normalisation depends on returned results. SR14 must show a changed candidate window. | Version-specific processor behaviour and all candidate/score outputs. |
| [Vespa phased ranking](https://docs.vespa.ai/en/ranking/phased-ranking.html) | Separates retrieval, local phases and global reranking, with explicit bounds. SR15 must teach staged work and candidate ceilings beyond one fusion API. | Pin syntax and distinguish per-node from global budgets; execute chosen reranker. |
| [Elastic rank evaluation](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-rank-eval) | Works from rated queries/documents and identifies unjudged results. SR18 must teach judgement quality and incompleteness, not simply invoke an API. | Independent metric calculations and actual judgement/response records. |
| [Near-real-time search](https://www.elastic.co/docs/manage-data/data-store/near-real-time-search), [translog settings](https://www.elastic.co/docs/reference/elasticsearch/index-settings/translog) | Visibility and recovery have separate mechanisms. SR22/SR32 must distinguish refresh from durability. | Chosen acknowledgement/durability settings, allocated copies and real crash evidence. |
| [Pagination](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/paginate-search-results) | Describes refresh drift, tie breakers and PIT/search-after. SR17/SR33 need concurrent-edit and resource-retention cases. | Actual sort keys, PIT lifetime, cleanup and vector/hybrid restrictions in the chosen release. |
| [Document and field access](https://www.elastic.co/docs/deploy-manage/users-roles/cluster-or-deployment-auth/controlling-access-at-document-field-level) | Documents restrictions beyond hit filtering and limits around index statistics/metadata. SR24/SR36 need non-hit denied tests and explicit trust assumptions. | Exact licence, deployment, role combinations and endpoint-specific disclosure behaviour. |
| [Optimistic concurrency](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/optimistic-concurrency-control), [reindex API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-reindex) | Native concurrency tokens and reindex destination setup do not themselves prove source-ordered migration completeness. SR31/SR39 need a source revision ledger and live changes. | External version/delete retention semantics, partial outcomes and catch-up execution. |
| [Snapshot and restore](https://www.elastic.co/docs/deploy-manage/tools/snapshot-and-restore) | Snapshot contents and compatibility constraints make backup more than copied documents. SR28/SR40 need configuration inventory and compatibility rehearsal. | Repository/restore test and the exact upgrade path; do not assume snapshots include all external configuration or model artifacts. |

## What independent review should decide

Challenge whether SR03's corpus/relationship/passage investigation remains coherent
with one source example; split only if the actual explanation needs two incompatible
threads. Challenge whether SR22's vector mutation material can sit beside segment
maintenance without implying Lucene is universal. SR23 needs a deletion inventory
substantial enough to survive restore, not a reassuring sentence at the end.

Check that SR18/SR19 teach enough judgement and online-evidence reasoning for an
expert to avoid tuning to a biased query pool. Check that the ordinary lexical route
reaches useful search without ANN prerequisites. Check that multilingual extraction
and query analysis receive actual difficult cases rather than a language-name list.

The largest implementation uncertainty is the Elasticsearch branch's reproducible
permission and inference environment. Its twelve pages are coherent only if actual
native worksheets carry the declared behaviour. Review can change that product
choice or the bounded sparse/multi-vector depth. It must not resolve uncertainty by
compressing all operations into an overview or treating more article titles as proof
that the abilities are taught.
