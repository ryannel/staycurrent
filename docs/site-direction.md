# The current site

Consolidated on 4 October 2026 at the operator's request. Stay Current remains a
publication covering many engineering fields. **Databases and storage is the first
field**, not the scope of the whole website. The cleanup retains the site-wide
overview and the database guide's linked reading, while removing obsolete content
and unused infrastructure. The [earlier direction](history/site-direction-2026-10-02.md)
records the wider coverage discussion.

## Application caching experiment, 27–28 October 2026

A twelve-article collection on application caching with Redis was written from a
single commission prompt, without the Stay Current skills, and published. Its prose
proved much denser than the relational collection's (the site check's
`dense-prose` rule found about 20 times as many problems per 1,000 words), so the
user judged it a failed experiment. It was removed on 28 October 2026 with its
work records, and the seven skills were restored with the `dense-prose` check in
their writing and repair steps. Both versions remain in Git history.

## Relational collection publication, 26 October 2026

The user authorised full publication of all 59 reviewed replacement articles from
`src/articles/relational-rebuild/`. They replace the normal relational reading,
with the accepted foundation route, optional depth and both implementation branches.
The directory, search, current-article tree and downloads use public routes.
Old article URLs redirect to their replacements. Superseded content and evidence
endpoints are removed; the SQL sandbox and local practice remain separate tools.
The reviewed article bodies and interactive teaching are unchanged. Publication
checks reuse the completed article and assembled reviews; there is no new corpus review.
See the [publication record](article-work/relational-rebuild-2026-10-25/publication.md).

## Relational collection publication, 24 October 2026

The user authorised publication of the complete 58-article collection, replacing
its review-only state. The current Astro articles in `src/articles/relational-collection/`
use the normal `/learn/databases/relational/` URLs and join available reading,
search and collection navigation. Their native worksheets are public downloads.
The compact tree shows the current article; subject groups and Sources and further
reading start closed, with sources at the bottom. Older useful routes and the
practice, checkout and sandbox remain available.

The review workflow now retains completed checks and confirms repairs in context;
there is no additional full collection review for the final local correction.
See the [publication record](article-work/relational-collection-2026-10-24/publication.md).

## Relational replacement publication, 19 October 2026

The user authorised publication of all 54 revised articles once the learning-tools
repairs were complete. The public collection now contains 31 general and distributed
relational articles, 13 PostgreSQL articles and ten CockroachDB articles. The
introduction offers task paths and a subject directory; every article joins the
switcher, reading directory, search and previous/next navigation. Interactive models
and native worksheets retain their reviewed boundaries. Four PostgreSQL specialist
articles and the SQL sandbox remain available. The practice guide now starts each
article in a fresh disposable database. Earlier routes resolve to the revised
explanations. See the [publication record](article-work/relational-rewrite-2026-10-19/publication.md).

The following dated sections record earlier publication decisions.

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

## Drawing systems publication, 16 October 2026

The user authorised publication of the drawing-systems collection, which had been
complete as an unlisted draft. Its ten articles, 54 editable SVG illustrations and
printable shape reference now sit at `/learn/drawing-systems/`. The draft label and
noindex markers are gone. The collection joins the reading directory, site search,
breadcrumbs, the header and the footer. The homepage presents it beside Databases
and storage as a practice that applies in every field, rather than as another
engineering field.

## Where readers enter

`/` is the site-wide overview. It introduces the purpose of the publication,
links to the database reading and the drawing-systems collection, and shows the other planned fields:
APIs and service communication, messaging and event-driven systems, observability,
and AI application engineering. Planned fields are plain descriptions, not empty
article destinations. There is no invented news or updates section to fill.

The shared navigation offers the overview, All articles, Playgrounds, Databases and
storage, Drawing systems and Search. Search opens over the current page, with Cmd/Ctrl+K access,
keyboard navigation, recent searches and filters for articles, guides and playgrounds.
`/search/` provides the same full-text search with shareable URLs, excerpts and
links into matching sections. Its static index
is rebuilt with the site and follows the reading directory's available routes. `/playgrounds/` lists actual available tools, starting with the SQL
sandbox; future technologies can join this entrance when useful experiments exist.
`/articles/` lists available reading with a subject filter. Breadcrumbs expose the hierarchy on reading pages,
and a compact collection switcher connects relational articles without requiring
a return through the introduction. The current relational collection groups start closed. Within that
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
