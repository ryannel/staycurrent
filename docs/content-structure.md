# Coverage and article structure

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

## Production order

Establish this coverage map and validate the authoring/review workflow before
commissioning a broad batch. Start with a bounded relational piece that exercises
the intended teaching quality, then use its results to improve the skills. Choose
the next comparison or PostgreSQL piece because it answers a reader need, rather
than automatically filling all positions in this map.

The production entry point is `staycurrent-authoring`; independent review uses
`staycurrent-review`. House voice remains example-led in `staycurrent-style`, and
technical evidence follows `staycurrent-research`. Review completion makes a draft
ready for an editorial decision; publication is separately authorised.
