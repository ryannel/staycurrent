# Coverage and article structure

The [18 October field proposal](databases-and-storage-plan.md) and its
[page tree](databases-and-storage-page-tree.md) develop the whole Databases and
storage section against the current skills. They are steps 1 and 2 of the new
planning commission, independently challenged and revised for discussion before writing. Their
coverage maps extend this document's content jobs; they do not replace current
publication status or commission the proposed articles.

Current status, 19 October 2026: the user authorised publication of the revised
54-article relational collection after its teaching-tools repair and independent
reviews. It covers the general and distributed mechanisms, a 13-article PostgreSQL
branch and a ten-article CockroachDB branch. Task paths, public worksheets and the
subject directory connect the articles. Four earlier PostgreSQL specialist articles,
the checkout and SQL sandbox remain available; the practice entrance now uses
independent article fixtures. `src/lib/relational-collection.ts` records available
reading. The [publication record](article-work/relational-rewrite-2026-10-19/publication.md)
links the production and review evidence. Other fields and the shared
distributed-systems programme remain outside this commission.


Working editorial direction, 4 October 2026. This records the requested coverage
and the structure for commissioning it. It does not commission every candidate
article, publish existing drafts, or require a new page for every row below.

## The collection and the article

The field guide helps a reader recognise the territory. A family collection gives
them a deeper understanding of an approach and the skills to use it. Comparisons
introduce the important implementations; selective product deep dives show how
those ideas are built in a particular engine. Current assessments revisit choices
when the evidence changes. Readers can enter at any of these points.

Completeness belongs to the collection. Each article needs a bounded question and
a useful outcome. These content jobs are editorial distinctions, not compulsory
navigation levels or a sequence every reader must complete.

| Content job | What it should give the reader | Where to stop |
| --- | --- | --- |
| Field guide | What the field solves, major approaches, roughly when to investigate each, and how they overlap | An orientation, not a compressed internals textbook or exhaustive decision tree |
| Family introduction | The approach, the capabilities it offers, the decisions behind it, and its fit and limits | Establish the family; route deeper questions into focused pieces |
| Focused explanation or practical article | Understanding of a mechanism, a skill, a diagnosis, or a bounded engineering choice | Cover what the question needs; do not trace every subsystem |
| Major-product comparison | Consequential differences among credible alternatives for stated uses | Explain differences in context; no feature-count ranking or vendor directory |
| Product deep dive | How an implementation realises and extends the ideas, and why its particular choices matter | One essay or a connected series as needed; no obligation to give every product equal depth |
| Current assessment | Whether a development changes advice, for whom, and on what evidence | Dated and scoped; feature existence alone does not establish suitability or production readiness |

## Relational databases: coverage to develop

The [relational collection proposal](relational-collection-plan.md) develops this
map into an introduction, independent reader journeys, bounded article candidates,
and a small first production slice. It remains a working plan.

The following are outcomes for the collection, not mandatory article headings.
All destinations below are proposals. Existing pages are reusable drafts to assess
against a commission; their presence does not establish that an outcome is covered.

| Area | Reader outcome | Possible article-sized question |
| --- | --- | --- |
| Construction and tradeoffs | Connect storage, access paths, execution, concurrency, and durability to behaviour; distinguish the model from the engine | What happens between a SQL query and the records it returns? |
| Schema design | Represent identity, relationships, history, ownership, and shared facts; reason about normalisation, duplication, and documents | Which facts should we store together, and which should we reference? |
| Constraints and correctness | Express invariants and understand where a constraint's guarantee stops | Which rules can the database enforce for every caller? |
| Query design | Reason about joins, aggregation, missing values, and result cardinality | Why did this join multiply the rows? |
| Indexes | Design for access patterns and weigh read savings against write and maintenance work | Which index helps this query, and what does it cost? |
| Transactions and concurrency | Understand atomic changes, isolation, waiting, conflicts, and retries | Can two buyers reserve the last item? |
| Performance and profiling | Investigate with plans and measurements; separate query work, waiting, and application request patterns | This query was fast last month. Where did the time go? |
| Application integration | Reason about connection use, ORM-generated work, batching, pagination, transaction boundaries, and ambiguous outcomes | How much database work does one application request create? |
| Live evolution | Change schemas, indexes, and data while versions of an application coexist | How do we change this schema while the application keeps running? |
| Operations and recovery | Understand maintenance, monitoring, restore, replication, failover, and their limits | What do we need to recover after this failure? |
| Access and data lifecycle | Reason about privileges, sensitive data, auditing, retention, and deletion | Who should be able to read or change these records? |
| Fit and boundaries | Identify useful workloads, warning signs, alternatives, and evidence needed before adding another system | When does reporting justify a separate analytical store? |

Before a production batch, assign only its selected outcomes to specific briefs.
Record each as planned, drafting, in review, ready as a draft, or blocked, with its
file/route when one exists. Record published status only after authorised publication.
Do not create empty routes or describe planned coverage as available reading.

## Major products and selective depth

The first relational comparison should include **Microsoft SQL Server, MySQL, and
PostgreSQL**. SQLite is a useful additional contrast when embedded deployment is
relevant. Other systems earn space through a meaningful difference for the reader,
not a desire to complete a market list.

Compare the same jobs and constraints. Dimensions may include deployment, data and
query facilities, concurrency, operating work, recovery, ecosystem, and licensing
where relevant. Distinguish core engine, extension, edition, and hosted service.
Research current differences and state the versions and conditions behind claims.
No product ranking or capability conclusion is established by this planning note.

**PostgreSQL is the initial product deep-dive candidate.** It is enough to begin
with one substantial implementation example. Give its readers a coherent picture
across focused pieces where necessary. Do not repeat the family material in full,
and do not present PostgreSQL-specific storage or maintenance as universal SQL
behaviour. A comparison does not commit us to a deep dive into every alternative.

In October 2026 the user found that the relational Storage and Indexes deep dives
broke this rule while every review passed them. Storage opened with "Once
PostgreSQL tells your application that COMMIT succeeded" and named PostgreSQL in
nearly every section heading; Indexes assumed throughout that a table is a heap
that index entries point into, which is PostgreSQL's design rather than InnoDB's
or SQLite's. Both were accurate about PostgreSQL. Neither taught what a reader of
the general collection needs: the mechanism relational databases share, and the
places where a choice of engine changes it.

A general article therefore names the shared mechanism in general terms (pages,
buffer pool, write-ahead log, row location) and says where the major engines
differ when the difference changes what a reader would predict or decide.
PostgreSQL, MySQL's InnoDB and SQLite are the usual comparison; others earn a
mention where they differ instructively. PostgreSQL can remain the worked example,
because the sandbox runs it, provided the article presents it as one
implementation. Settings, maintenance commands and data structures that exist only
in PostgreSQL belong in the PostgreSQL series, linked from the general article.

For a future messaging field, Kafka and RabbitMQ are candidate implementation
examples. Their contrasts should follow from the messaging workloads and guarantees
being taught. This is an example of the structure, not a messaging production brief.

## Convergence is part of the explanation

Families are overlapping approaches, not exclusive product bins. Keep data model,
storage layout, access method, deployment, and operational role distinct. A product
can appear in several guides; give substantial shared teaching one home and link
it where needed. Brief local explanation must still make each article intelligible.

When a product supports another kind of work, ask whether using that capability or
adding another system better serves the stated workload. Compare behaviour, resource
competition, guarantees, operating effort, and the cost of keeping additional copies
current. Distinguish an available feature from a good fit and a measured result.
Do not equate storing binary content with an object-store service, or native support
with an optional extension. Changes to capabilities belong in maintained comparisons
or dated assessments, rather than being scattered through otherwise durable prose.

## References across the collection

Each article should offer a small, annotated set of useful next readings alongside
precise citations for its claims. Keep reusable source details in the article's
evidence notes: topic, URL, what it teaches or substantiates, audience/prerequisites,
and relevant version or access date. Primary documentation and excellent teaching
can both be useful, but serve different purposes.

A shared reference library is a proposed future view of that material, organised
by field and reader question, with links from the relevant articles. It should help
someone find a good explanation or authoritative detail, rather than become a large
unannotated bookmarks page. This is a direction to evaluate, not a commissioned new
site section or a replacement for article-local sources.

## Shared systems teaching stays parked

[Reasoning about distributed systems](reasoning-about-distributed-systems.md) remains
a parked idea. Explaining a necessary database mechanism does not activate that
programme. Its eventual home and scope need a separate decision.

## Production workflow, 19 October 2026

Use `staycurrent-orchestrate` for the requested planning and writing stages.
`staycurrent-breakdown` plans one article and returns child briefs for recursion;
`staycurrent-write` follows the three fixed example articles; and
`staycurrent-review` provides the appropriate independent perspectives. The
orchestrator maintains the complete tree and reconciles corpus-wide changes.

The earlier coverage reasoning above remains historical context. It does not
add instructions to these skills or authorise writing every proposed article.
Review completion does not authorise publication.
