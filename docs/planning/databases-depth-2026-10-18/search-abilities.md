# Search and vector retrieval: practitioner abilities

Independent derivation, 18 October 2026. This is a planning artifact, saved before
assigning units to pages. It does not commission articles or change publication.
The derivation uses the commission, house skills and publication structure. It has
not used existing search outlines, inventories, coverage maps or other collection
derivations. The required general project documents were read for their editorial
rules; their existing article inventories did not supply this breakdown.

## The practitioner and the job

The reader builds search over an application corpus: documents, catalogue entries,
support material, or similar records. They can program, read a request and response,
and reason about an application's authoritative data. They need no prior information
retrieval, vector algebra or cluster administration course.

An expert can turn an information need into a retrieval contract; represent the
corpus; explain which records each stage can find; measure usefulness; protect
restricted content; keep the projection current; and recover and operate it within
a budget. They can distinguish a bad representation from an approximate-index miss,
a lost update, a forbidden result and an overloaded service. They can defend keeping
search inside an existing database as well as adding a dedicated engine.

Search returns records and evidence. Generating an answer from them belongs to AI
application engineering. Embedding and reranker inference are dependencies here;
training those models is outside scope. Building a web crawler, a recommendation
business, or a general distributed-systems course is also outside scope.

## From tasks to teachable units

Each chain starts with work the practitioner must perform, follows the understanding
that makes the work reliable, and stops at a unit with a plausible teaching form.
The SRU identifiers belong to this derivation. No page homes are assigned here.
“Execution” below is proposed future execution, not a claim that an experiment ran.

### Specify what the search must return

A request such as “find the refund policy” could mean the exact policy identifier,
the current policy for one region, or any useful explanation. The practitioner must
separate these needs before choosing an access method. They then need a contract
for the projection and a way to decide whether another service earns its cost.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU01 | Information need, known-item lookup, term match, semantic similarity and exploratory search; a similar policy can be the wrong policy. Mandatory predicates are separate from ranking preferences. | Several queries over one corpus, with explicit acceptable results. |
| SRU02 | A search contract names useful top results, eligible population, ordering, counts, latency, freshness and partial-result behaviour. These promises can fail independently. | Request/result contract with three changed conditions. |
| SRU03 | Search as an authoritative store or a derived projection; source identity, hydration and rebuildability. A search hit cannot reserve stock or prove the source still exists. | Two write/read paths and a stale-hit case. |
| SRU04 | Existing-database full-text/vector facilities, static or embedded search, dedicated search engines and vector services solve different workloads; another copy adds synchronisation and operation. | Bounded alternatives against the same three workloads. |
| SRU05 | Corpus extraction, canonical records, stable source and revision IDs, metadata, language, provenance, failed extraction and deduplication. Missing text cannot be repaired by ranking. | Before/after corpus inspection, including a scanned or empty document. |

### Make lexical retrieval express what the query means

The practitioner must predict which records match and why one ranks first. That
requires following text into searchable terms, following a query through the same
representation, and inspecting candidate selection and scoring separately. Real
queries add identifiers, languages, misspellings, synonyms and structured conditions.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU06 | Term dictionary, postings, frequencies, positions and stored fields; an inverted index is not the original document. Column-oriented values serve sorting and aggregation differently. | Inspectable tiny index with phrase and field retrieval. |
| SRU07 | Index-time and query-time tokenisation, normalisation, stemming, stopwords, offsets and token graphs. A phrase can break when positions or analysis disagree. | Editable token/position trace. |
| SRU08 | Language-specific analysis, mixed scripts, accents, compounds and exact identifiers. Aggressive normalisation can merge distinct catalogue codes. | Contrasting cases with explicit expected matches. |
| SRU09 | Boolean matching, phrases, proximity, field combinations and minimum matching terms; user text must become deliberate query semantics. | Query builder with matching documents visible. |
| SRU10 | BM25-style term rarity, saturation and length normalisation, field boosts and business signals; a score is neither probability nor comparable across arbitrary queries. | Ranked documents with one changed term count or length. |
| SRU11 | Efficient top-k lexical retrieval: ordered postings, skipping and safe score bounds; saving scoring work differs from discarding potentially useful candidates. | Step-through top-k with a bound and a counterexample to an unsafe shortcut. |
| SRU12 | Prefix, n-gram, completion, edit-distance and spelling suggestions; latency and false matches change when every keystroke is a request. | Typing sequence with candidate and index-size changes. |
| SRU13 | Synonym expansion and query rewriting, direction, multiword phrases, index/query-time ownership and update cost; “notebook” has more than one sense. | Token graph and regression queries before/after a synonym change. |
| SRU14 | Search document modelling: text versus exact values, denormalisation, arrays of objects, nested relationships and source joins. Flattened variants can create matches that no single variant satisfies. | Schema and false-match repair over catalogue variants. |

### Build vector retrieval that preserves the intended neighbours

The practitioner first needs to know what vector similarity promises. Then they can
trade exhaustive scoring for candidate selection and memory savings. The relevant
question is not “which ANN algorithm is fastest?” but which representation and
access path preserve useful candidates under this corpus, filter and update load.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU15 | Vectors, dot product, cosine and Euclidean distance, normalisation, dimensionality and metric compatibility; nearest does not mean relevant or sufficiently close. | Small geometric model followed by real embedding distances. |
| SRU16 | Embedding contract: model/revision, query/document roles, preprocessing, truncation, dimensions and normalisation; equal dimensions do not make models compatible. | Corpus/query manifest with an intentionally mixed model. |
| SRU17 | Retrieval granularity: document, passage, overlap, parent identity, metadata inheritance and multi-vector representation. Many passages from one document can crowd out other documents. | Same source split three ways; inspect missing context and duplicated hits. |
| SRU18 | Exact exhaustive similarity over the eligible population supplies an ANN reference and can be the right production plan for small filtered sets. Fix the metric, snapshot, ties and k. | Exact execution and counted distances; no tiny-run speed verdict. |
| SRU19 | HNSW graph construction and traversal, entry layers, candidate breadth, connectivity and build/search tradeoffs; a greedy route can miss the actual neighbour. | Graph walk with adjustable construction and query effort. |
| SRU20 | IVF partitioning, centroid training, list balance, probes and distribution drift; an unprobed list can contain the best neighbour. | Points assigned to lists, then a shifted corpus and more probes. |
| SRU21 | Scalar/binary/product quantisation, raw-vector rescoring, memory versus storage and disk access; compression can change candidate order before reranking sees it. | Quantised distances and byte accounting with exact rescore. |
| SRU22 | Filtered nearest-neighbour retrieval: prefilter, postfilter, traversal-aware filtering, oversampling and exact fallback. Selective filters can leave too few hits or make approximate search expensive. | Same query across filter selectivities, compared with filtered exact ground truth. |
| SRU23 | Vector-index writes, deletion marks, graph repair or rebuild, segment/index coexistence and compaction; query knobs cannot cure every degraded index. | Mutation sequence with build cost and eligible-neighbour changes. |
| SRU24 | Learned sparse retrieval and late-interaction/multi-vector retrieval occupy different representation and scoring points from one dense vector per document. | One worked comparison; mathematical training and model implementation remain external. |

### Assemble results a person or application can use

Combining lexical and vector candidates does not by itself make a useful result.
The practitioner has to preserve complementary candidates, spend expensive ranking
work deliberately and return stable, intelligible results. Facets and pagination
must describe the same population the application thinks it is searching.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU25 | Candidate union versus intersection, per-retriever windows and missing candidates; an exact code and a paraphrase need different retrieval paths. | Candidate ledger through two retrievers. |
| SRU26 | Rank fusion, score normalisation, weighted combinations and calibration. RRF discards score margins; normalisation depends on returned candidates. | Worked ranks/scores with one window changed. |
| SRU27 | Multi-stage ranking, inexpensive first stages, cross-encoder or other rerankers, bounded inference, batching, failure and fallback; a reranker cannot recover an absent record. | Stage funnel with budgets and a dropped relevant candidate. |
| SRU28 | Collapse to parents, duplicate control, diversity, tie-breaking, business constraints and score thresholds; top k can be k near-copies. | Before/after result list with explicit product rules. |
| SRU29 | Fetch and hydration, highlights, snippets, provenance and source links; a highlighted match is evidence of text matching, not a proof that an answer is supported. | Result cards tied to source offsets and a changed source revision. |
| SRU30 | Offset versus cursor pagination, stable sort/ties, snapshots and bounded approximate result sets; refreshing between pages can repeat or skip records. | Concurrent edit while paging; snapshot resource cost. |
| SRU31 | Facets, counts and aggregations over all matches, candidates or displayed hits; distributed counts may need error bounds. A vector top-k histogram is not a corpus distribution. | Three populations and visibly different counts. |
| SRU32 | Search API design, safe query translation, cost limits, timeouts and cancellation; untrusted regular expressions, scripts or expansions can consume the service. | Bounded request contract and an adversarial request. |

### Improve quality without confusing its causes

Experts can say which change improved search, for which users, and what evidence is
missing. That needs representative judgements and stage-level diagnosis. It also
needs a clean separation between human usefulness, approximate-neighbour agreement,
and hard permission or currency requirements.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU33 | A judged query set needs real intents, graded relevance, slices, difficult negatives, languages, long-tail and no-answer queries; tuning on a convenient demo misleads. | Construct and split a small judgement set. |
| SRU34 | Precision, recall, MRR and nDCG against relevance judgements; exact-neighbour recall against a fixed vector reference; eligibility and freshness as independent checks. | One result list that improves ANN recall but worsens usefulness. |
| SRU35 | Incomplete judgements, pooling, annotator disagreement, leakage and uncertainty; an unjudged record is not automatically irrelevant. | Two systems evaluated against a biased pool, then repaired. |
| SRU36 | Click and conversion signals, position/exposure bias, experiments, guardrails and feedback loops; more clicks can reflect worse answers. | Changed ranking with controlled exposure and a misleading click total. |
| SRU37 | Diagnose extraction, analysis, representation, candidate loss, ranking, eligibility, staleness and display separately; a zero-results page has several causes. | Query trace with IDs at each stage and a decision path. |
| SRU38 | Reproducible corpus/query/filter/update workload; recall-quality-latency-cost frontier; cold/warm and concurrency effects, p95/p99, build time and resource accounting. | Benchmark worksheet with one controlled variation per question. |

### Keep the projection current while it changes

Source writes, extraction, embedding and indexing finish at different times. Experts
need identity and ordering rules before retries, a way to tell whether the projection
is complete, and a migration procedure that survives ongoing writes and deletes.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU39 | Stable IDs, source revision ordering, idempotent upserts/deletes and checkpoints across retries. An older embedding job can overwrite a newer source revision. | Out-of-order event replay with version assertions. |
| SRU40 | Bulk ingestion, partial item failures, retries, backpressure, extraction/embedding rate limits and poison records; one HTTP success need not mean every item succeeded. | Partial batch ledger and bounded retry loop. |
| SRU41 | Accepted write, durable write and search-visible write are different states; refresh, commit/log and replication have implementation-specific boundaries. | Three clocks and crash/search cases. |
| SRU42 | Full rebuild, backfill plus change capture, catch-up fence, validation, atomic serving-pointer switch and rollback. A completed scan can still miss concurrent deletes. | Cutover timeline and reconciliation ledger. |
| SRU43 | Embedding, chunker, analyser and schema version changes; side-by-side generations and dual-query evaluation. New query vectors cannot safely search an old incompatible vector space. | Versioned generations and controlled switch. |
| SRU44 | Deletion and retention across children, vectors, snippets, caches, replicas and backups. Logical removal and physical erasure differ; restoration can revive deleted content. | Deletion inventory and restore/replay case. |
| SRU45 | Lag, completeness, source reconciliation, dead-letter repair and missing events. A healthy engine can serve an incomplete corpus. | Source/index manifests and missing-revision detection. |

### Enforce the source's permission promise

The expert treats eligibility as a hard part of retrieval. They must follow identity
and permissions into every result-producing stage, then account for propagation
delay, caching, diagnostics and metadata leakage. Relevance work does not replace it.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU46 | Mandatory tenant/ACL predicates across lexical, vector, reranking, fetch, facets, suggestions and caches; filtering only displayed hits is insufficient. | Two principals and a deliberately bypassed stage. |
| SRU47 | Shared filtered index, partition/namespace, separate index and separate service trade resource isolation, recall, administration and security boundaries. | Tenant size/skew cases with explicit trust assumptions. |
| SRU48 | ACL materialisation, group changes, revocation windows and source revalidation races; correct document content can carry an obsolete permission. | Revocation timeline with a declared fail-closed policy. |
| SRU49 | Service credentials, read/write/admin separation, sensitive query logs, encryption and external inference data handling. Search traces themselves may contain private content. | Principal/data-flow diagram and redacted diagnostic trace. |
| SRU50 | Leakage through counts, terms, scores and suggestions; query abuse, poisoned corpus and inappropriate trust in retrieved text. Database controls cannot solve every application disclosure. | Denied-document probes and a poisoned source case; broader security teaching external. |

### Operate and recover the retrieval service

The expert connects logical retrieval work to shards, replicas, memory and disk,
then measures the bottleneck and plans recovery. They need search-specific failure
consequences locally; this does not require activating a general distributed course.

| Unit | Understanding to teach, including the awkward case | Smallest useful teaching form |
| --- | --- | --- |
| SRU51 | Shard fan-out, local top-k and global merging, shard-local term statistics, routing/skew and partial failures; more shards can change scores and cost. | Distributed query trace with an omitted shard and a rare-term skew. |
| SRU52 | Replica reads, primary writes, acknowledgement, promotion and retry consequences; replica count is neither a backup nor a guarantee of fresh search. | One node failure and client retry timeline. |
| SRU53 | Immutable segments, updates as replacement/deletion, merging, cache invalidation and write amplification; deleted records can still consume storage. Other engines use different maintenance paths. | Segment state sequence and a merge backlog. |
| SRU54 | Capacity model for postings, vectors, graph edges, raw values, replicas, working set, rebuild/merge headroom and inference. Index bytes alone understate the budget. | Accounted capacity worksheet with an out-of-memory or disk-pressure change. |
| SRU55 | Admission control, query concurrency, bulk throttling, queues, retries and overload feedback. Increasing candidate breadth for quality can cause latency collapse. | Load trace and bounded degraded-service policy. |
| SRU56 | Stage latency, error/partial response rates, merge/index backlog, cache/IO, source and ACL lag, and quality regression monitoring; green cluster health does not prove useful search. | Incident dashboard with a source-pipeline failure. |
| SRU57 | Restore versus rebuild, recovery time/data-loss objectives, snapshots, configuration, model/chunker artifacts and source replay. A restored index can be incompatible with today's query service. | Recovery worksheet and fenced return to service. |
| SRU58 | Safe upgrades and configuration rollouts, compatibility, snapshot constraints, canaries and rollback limits; an index format change may block downgrade. | Rehearsal plan with an intentionally invalid rollback. |

### Explain and control one real implementation

Concepts alone do not teach the API, visibility, maintenance or recovery behaviour
of a running engine. The initial representative branch should let a practitioner
connect a real request and response to the general mechanisms, then carry it through
ingestion, retrieval, access control, failure and recovery. Elasticsearch is a
candidate because one branch can expose lexical, vector and hybrid work. This is a
scope choice to challenge, not a product recommendation or assumption that all
features are available under one licence or deployment type.

| Unit | Implementation understanding to teach | Smallest useful teaching form |
| --- | --- | --- |
| SRU59 | Elasticsearch mapping, `_source`, text/keyword, doc values, nested documents, analysis APIs and dynamic mapping limits. | Version-pinned requests with a wrong-type and variant false-match repair. |
| SRU60 | Elasticsearch bulk item outcomes, external source versions versus sequence-number/primary-term concurrency, update/delete retries and ingest pipelines. | Executed out-of-order and partial-failure worksheet. |
| SRU61 | Elasticsearch refresh, translog, flush, Lucene segments and merges; visibility and crash recovery with declared durability settings. | Multi-process execution plus segment/log state figures. |
| SRU62 | Elasticsearch query/fetch, shard scoring, candidate distribution, routing, caches, profile, explain, PIT and pagination limits. | Request trace, changed shard layout and concurrent paging exercise. |
| SRU63 | Elasticsearch lexical Query DSL, field choices, synonym graphs, analysis/explain and rank evaluation output. | One diagnosed miss, then a scored regression set. |
| SRU64 | Elasticsearch vector mappings, metric, chosen index type/compression, exact versus approximate requests, filter placement and tuning parameters. | Exact-reference experiment with selective filters and changed search effort. |
| SRU65 | Elasticsearch retriever composition, hybrid windows, fusion/rerank behaviour, inference dependency failure and deployment/licence limits. | Candidate ledger from actual responses and bounded fallback. |
| SRU66 | Elasticsearch shard/replica allocation, recovery, routing, node roles and index lifecycle placement. | Isolated multi-node failure and allocation diagnosis worksheet. |
| SRU67 | Elasticsearch roles/API keys, document/field security, endpoint restrictions, role combinations, metadata limitations and licence/deployment availability. | Two-principal denied-request suite, explicitly including non-hit APIs. |
| SRU68 | Elasticsearch operational diagnosis from query profile, slow logs, node/index statistics, rejection/merge/IO evidence and quality/source-lag traces. | Incident investigation with one measured corrective change. |
| SRU69 | Elasticsearch snapshot repositories, snapshot contents, restore compatibility, security/configuration state and source replay after restore. | Isolated restore into a fenced cluster and return-to-service checklist. |
| SRU70 | Elasticsearch templates, reindex tasks, aliases, source revisions and live index-generation cutover; copying records alone is not migration completeness. | Reindex with an interleaved delete, catch-up and serving-alias switch. |
| SRU71 | Elasticsearch supported upgrade paths, client/index compatibility, rolling versus replacement deployment and downgrade limits. | Version-pinned rehearsal with a rejected incompatible restore or rollback. |

## Limits and checks still needed

These 71 units are a decomposition, not 71 articles. Some need a sentence beside a
worked case; others need their own mechanism investigation or real execution.
SRU24 may remain a bounded comparison until its extra representation cost earns a
larger investigation. Website search UI implementation, crawling at web scale,
geospatial databases, recommendation modelling and observability storage are not
additional tasks hidden inside this collection.

The primary-source check found consequential reasons to keep units separate:
pgvector describes post-scan filtering and iterative scans; Elasticsearch documents
a different prefilter interface; Faiss distinguishes flat, graph, IVF and compressed
indexes; Vespa exposes several ranking phases. No one product should silently
define the family. Search visibility and log durability also have separate
Elasticsearch documentation, so neither should stand in for the other. Source URLs
and the page consequences are recorded in the proposal after allocation.

Independent review should especially challenge relevance evaluation depth, ordinary
lexical search entrances, multilingual corpus preparation, revocation behaviour and
the operating cost of the representative branch. No experiments have run.
