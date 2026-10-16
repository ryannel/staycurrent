# The current site

Consolidated on 4 October 2026 at the operator's request. Stay Current remains a
publication covering many engineering fields. **Databases and storage is the first
field**, not the scope of the whole website. The cleanup retains the site-wide
overview and the database guide's linked reading, while removing obsolete content
and unused infrastructure. The [earlier direction](history/site-direction-2026-10-02.md)
records the wider coverage discussion.

## Relational publication, 15 October 2026

The user explicitly commissioned completion and publication of the aligned relational
collection. All 34 article destinations now contain finished reading, alongside the
introduction, checkout and local practice guide. The SQL sandbox has 43 linked lessons
covering design, queries, transactions, performance, operations, capacity, PostgreSQL
and product choices. The subsequent PostgreSQL commission rebuilt its four short
chapters into eleven connected articles, with three entrances: server internals,
distribution across servers, and richer queries and types. The practical work
includes isolated PostgreSQL, pgvector and PostGIS experiments alongside browser
lessons. This publication does not change other families’ draft status.

## Object-storage publication, 16 October 2026

The user commissioned the complete object-storage collection, using one leading
technology, and a practical sandbox. Amazon S3 is the concrete implementation.
An introduction and thirteen focused articles explain objects, transfers,
concurrency, publication, application lifecycles, access, delivery, events, recovery,
cost and S3 resource choices, including Tables and Vectors.

The object-storage sandbox has fourteen lessons and 78 steps. It executes a local
teaching model without AWS credentials; it does not run the hosted S3 service.
A separate CLI worksheet supports real-service practice and states its execution
evidence. The homepage, reading directory, field guide and Playgrounds expose both
published collections. Other families retain their existing publication status.

## Where readers enter

`/` is the site-wide overview. It introduces the purpose of the publication,
links to the available database reading, and shows the other planned fields:
APIs and service communication, messaging and event-driven systems, observability,
and AI application engineering. Planned fields are plain descriptions, not empty
article destinations. There is no invented news or updates section to fill.

The shared navigation offers the overview, All articles, Databases and storage,
Playgrounds and Search. Search opens over the current page, with Cmd/Ctrl+K access,
keyboard navigation, recent searches and filters for articles, guides and playgrounds.
`/search/` provides the same full-text search with shareable URLs, excerpts and
links into matching sections. Its static index
is rebuilt with the site and follows the reading directory's available routes. `/playgrounds/` lists actual available tools, starting with the SQL
sandbox; future technologies can join this entrance when useful experiments exist.
`/articles/` lists available reading with a subject filter. Breadcrumbs expose the hierarchy on reading pages,
and a compact collection switcher connects relational articles without requiring
a return through the introduction. Available groups in the collection map open
by default. Within that
field, `/learn/databases/choosing/` introduces the problems storage solves and helps
readers find an approach worth understanding. Its family sections link to deeper
explanations.

The retained reading includes:

- The published relational collection: design, queries, transactions, indexes,
  storage, performance, operations, capacity, PostgreSQL internals and product choices;
  its checkout example, practice guide and SQL sandbox.
- Documents, partitioned stores, distributed SQL, caches, search, graphs and
  object storage.
- Column stores, moved from Explore to `/learn/databases/column-stores/`.
- The Postgres vector-search assessment already linked by the field guide.

The assessment remains a dated working draft. Its presence does not establish
publication or current production-readiness beyond its stated evidence. The relational
commission is complete; former outline aliases resolve to the articles that own them.

## What was removed

The old Explore database overview, separate fields directory and database landing
page, About, Updates and RSS have been removed. The homepage remains the overview
for the wider publication. Their unused
components, metadata and dependencies were removed too. The former Next.js site's
generated output and dependencies are not part of the Astro project.

The old column-store URLs were replaced in active site links. The essay, teaching
models and theme-aware artwork remain intact at their new location. Earlier
editorial records may mention the old URL; those are records of the work at that
time, not current route instructions.

## How we continue

Extend the database field guide's reading tree first; add other fields as useful
reading becomes available. Use the relational collection as the current
worked example of an introduction leading to focused articles with meaningful
reading order. Keep coverage and publication status in `src/lib/relational-collection.ts`
aligned with the available reading. Future planned items must remain distinguishable.

The broader purpose is still to help engineers understand choices and developments
that affect them. That does not require building navigation or empty destinations
for every future field now. The earlier wider coverage discussion remains available
in the history, and [Reasoning about distributed systems](reasoning-about-distributed-systems.md)
remains a parked idea.

Preserve the writing, illustration, authoring and review skills and their evidence.
The column-store essay remains a teaching reference alongside the current relational
work. The text should stand alone; illustrations and interactive tools support the
explanation where they reduce the reader's work. Use the current technical sketch
style, matching light and dark themes, with controls recognisable as controls.

Researching, drafting and reviewing remain separate from publishing. There is no
updates feed in this version of the site. Do not invent publication entries or
restore removed sections merely to fill out the navigation.
