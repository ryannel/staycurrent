# The next shape of Stay Current

Agreed working direction, 2 October 2026. This is the starting point for building
and learning, rather than a commitment to publish an encyclopedia.

## The promise

Understand the important choices in engineering—and know when those choices change.

The original purpose remains: help a working engineer keep up with a field without
following every release. Teaching fundamentals makes the guidance understandable
and useful beyond one product. It also gives readers a reason to discover the site.
Maintained guidance gives them a reason to return.

## Three connected reading needs

- **Orientation:** a field guide maps the major approaches, problems, and tradeoffs.
- **Understanding:** a focused explanation teaches the mechanism behind a choice.
- **Reassessment:** a dated, sourced assessment explains whether a development
  changes the advice, for which workloads, and with what remaining uncertainty.

These are not beginner, intermediate, and advanced levels. Depth and freshness
are separate dimensions. The same reader may know databases well and be new to
observability. Route them by field or question, with links to supporting explanations.
Do not make an experienced reader complete a lesson before reaching an assessment.

An assessment that changes a recommendation should lead to a revision of the
field guide. A mechanism explanation may remain unchanged. Each needs its own
review cadence. Production-readiness claims create a greater ongoing maintenance
obligation than a stable explanation of a data layout.

## Homepage

A compact publication introduction leads into useful reading, not a full-screen
marketing hero. The headline in the first implementation is “Understand the
choices. Know when they change.” Navigation is Topics, Updates, About, and RSS.

1. **What's changed:** two or three meaningful, dated updates with their practical
   consequence in the preview. First publications and editorial improvements are
   identified as such. Do not invent news or fresh review dates to fill the page.
2. **Explore a field:** available fields, described through the questions they help
   answer. One route into each field; no exhaustive article lists on the homepage.
3. **Featured explanation:** one generous, theme-aware illustration and a concrete
   invitation into an essay. The experiment itself belongs inside the article.
4. **How the publication works:** sources, history, and a quiet RSS invitation.

The operator chose a clean slate: remove the old library and retain only the
Explore work as our content reference. The homepage explains that we are starting
with database drafts. Publication entries in `src/lib/updates.ts` are empty until
real articles or assessments are ready; the homepage, Updates page, and RSS share
that source. Editorial revisions must be distinguishable from field developments.

## Routes and field pages

- `/`: editorial homepage.
- `/fields/`: available fields followed by explicitly planned coverage.
- `/fields/databases/`: first field landing page, connecting orientation,
  explanations and future updates.
- `/updates/`: actual publications and assessments, with their kind identified.
- `/rss.xml`: those same entries, currently an empty feed.
- The old article, changelog, and version-history routes have been removed.
- `/explore/databases/` and `/explore/column-stores/` stay intact as the working
  examples of the reading experience. Keep their draft status and noindex until
  an editorial decision replaces or publishes them.

Only build a field landing page when useful reading exists. Planned fields are
plain entries in the coverage plan, not dead links or empty article templates.
The old topic files, collection loader, and versioned-page components were removed.
Do not restore them as filler or carry their conclusions into new assessments.

## The first five fields

| Field | Initial questions and boundaries |
| --- | --- |
| Databases and storage | Storage choices by workload, correctness, access patterns, and scale. Our first complete example. |
| APIs and service communication | REST, GraphQL, RPC, contracts, compatibility, caching, retries, webhooks, SSE, and WebSockets. |
| Messaging and event-driven systems | Queues, durable streams, asynchronous processing, ordering, duplicate delivery, and replay. Links to APIs where requests become background work. |
| Observability | Logs, metrics, traces, profiling, investigation, signal quality, and collection cost. |
| AI application engineering | Retrieval, tools, evaluation, failure handling, latency, and cost around model-based applications. |

Only databases currently has working explanations. The other four are planned coverage, not
fields we claim to be actively maintaining. Start with a database field guide,
a few necessary explanations, and a researched assessment answering a real
question. “When is Postgres enough for vector search?” is a candidate question,
not an established conclusion or a published assessment.

## The wider map

Candidates discussed, without a promise to cover all of them:

- Distributed systems
- Caching and content delivery
- Search and retrieval
- Data engineering and analytics
- Machine learning systems
- Reliability and incident response
- Performance and capacity
- Security engineering
- Identity and access
- Networking
- Cloud infrastructure and compute
- Delivery and platform engineering
- Testing and verification
- Software architecture and evolution
- Programming languages and runtimes
- Frontend and browser engineering
- UI engineering and accessibility
- Mobile and client applications
- Developer tooling and workflows

Possible later specialisms: real-time collaboration and local-first software;
media systems; privacy and data lifecycle; workflow orchestration; scientific
and high-performance computing; embedded and edge systems.

Shared mechanisms get one clear home and links from the fields that use them.
Cost, operational burden, migration, team size, build versus buy, and production
readiness are perspectives within an article, rather than more top-level fields.

## Editorial and visual reference

Preserve the Explore work as our example of the intended teaching quality.
The text stands alone. Illustrations support the nearby explanation, and tools
let readers explore a consequence rather than supply a missing argument.
Paper illustrations follow the theme. Controls have distinct affordances;
results and static data do not imitate buttons. The existing editorial and
illustration guides carry the detailed examples and lessons.

New navigation pages should use that publication's typography, spacing, restrained
palette, and meaningful artwork. They do not need an interactive toy of their own.
Use the existing light/dark artwork with readable HTML labels for the featured essay.

## Coverage and agent production

The [coverage structure](../content-structure.md), developed on 4 October 2026, separates
field orientation, family understanding and practice, major-product comparisons,
selective product deep dives, and current assessments. It is the commissioning
reference for new work; earlier page inventories are not a complete coverage contract.
The first relational comparison includes Microsoft SQL Server, MySQL, and PostgreSQL.
PostgreSQL is the initial implementation deep dive. Kafka and RabbitMQ are future
messaging examples, not active commissions.

Use `staycurrent-authoring` to produce a scoped article and `staycurrent-review` for
independent review and repair. The immediate work is validating this process, not
generating the entire map. Passing review makes a draft ready; publication remains
a separate decision.

## Next steps after this first build

Parked for a later discussion: [Reasoning about distributed systems](../reasoning-about-distributed-systems.md),
a possible shared teaching area exploring recurring design problems across databases,
event queues, and other systems. The note captures the motivation and an example
learning journey. Its title and place in the site remain provisional; no build is
scheduled.

Finish the database guide's editorial shape, then prepare a genuinely researched
assessment and decide its content model, evidence requirements, and feed treatment.
Keep that distinct from formatting changes and first publications. Use that complete
reader journey to decide how the second field should be built. No new research
conclusions or topic publication are implied by this navigation work.
