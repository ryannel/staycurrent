# The current site

Consolidated on 4 October 2026 at the operator's request. Stay Current remains a
publication covering many engineering fields. **Databases and storage is the first
field**, not the scope of the whole website. The cleanup retains the site-wide
overview and the database guide's linked reading, while removing obsolete content
and unused infrastructure. The [earlier direction](history/site-direction-2026-10-02.md)
records the wider coverage discussion.

## Where readers enter

`/` is the site-wide overview. It introduces the purpose of the publication,
links to the available database reading, and shows the other planned fields:
APIs and service communication, messaging and event-driven systems, observability,
and AI application engineering. Planned fields are plain descriptions, not empty
article destinations. There is no invented news or updates section to fill.

The shared navigation offers the overview, All articles and Databases and storage.
`/articles/` lists available reading with a subject filter; planned outlines stay
in the relational collection. Breadcrumbs expose the hierarchy on reading pages,
and a compact collection switcher connects relational articles without requiring
a return through the introduction. Available groups in the collection map open
by default. Within that
field, `/learn/databases/choosing/` introduces the problems storage solves and helps
readers find an approach worth understanding. Its family sections link to deeper
explanations.

The retained reading includes:

- Relational databases, their design/query/transaction articles, the checkout
  example, and the explicitly labelled planned outlines in that collection.
- Documents, partitioned stores, distributed SQL, caches, search, graphs and
  object storage.
- Column stores, moved from Explore to `/learn/databases/column-stores/`.
- The Postgres vector-search assessment already linked by the field guide.

The assessment remains a dated working draft. Its presence does not establish
publication or current production-readiness beyond its stated evidence. Planned
relational pages remain outlines, clearly distinct from written articles.

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
reading order. Keep the planned coverage in `src/lib/relational-collection.ts`
aligned with available drafts as articles are completed.

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
