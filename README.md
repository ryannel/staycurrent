# Stay Current

A static Astro publication about engineering choices and the changes that matter.
Start with the [site direction](docs/site-direction.md). The homepage introduces
the wider coverage; Databases and storage is the first field with available reading.

## Run it

Use Node.js 24 and pnpm 11.4.0, matching the build workflow.

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # builds every page, then runs the site check
pnpm check          # every site-check issue; see scripts/check-site/README.md
pnpm test           # the site check's own tests
pnpm preview
```

Every push to `main` builds and deploys to GitHub Pages through
`.github/workflows/publish.yml`. Pull requests build without deploying.

## Reading structure

| Route | Purpose |
| --- | --- |
| `/` | Site overview, available reading and planned fields |
| `/articles/` | Directory of available reading, with a title and subject filter |
| `/search/` | Full-text search across available articles, guides and playgrounds |
| `/playgrounds/` | Guided, editable engineering experiments, with SQL and object-storage sandboxes |
| `/learn/databases/choosing/` | Databases and storage field guide |
| `/learn/databases/relational/` | Relational introduction and collection |
| `/learn/databases/relational/sandbox/` | Browser PostgreSQL sandbox with free exploration and linked tutorials |
| `/learn/databases/relational/*/` | Published relational articles, practical guides and preserved route aliases |
| `/learn/databases/column-stores/` | Illustrated column-store essay with four experiments |
| `/learn/databases/application-caching/` | Application caching introduction and eight focused articles, with Redis practice downloads |
| `/learn/databases/object-storage/` | Published introduction and thirteen focused articles, using Amazon S3 |
| `/learn/databases/object-storage/sandbox/` | Fourteen local model lessons, with 78 editable request steps |
| `/learn/databases/object-storage/practice/` | Real-S3 CLI worksheet with exact-version cleanup |
| `/learn/databases/*/` | Other draft families: documents, partitioning, distributed SQL, search and graphs |
| `/assessments/postgres-vectors/` | Dated vector-search assessment draft linked from the guide |

`src/lib/reading.ts` indexes available reading for the directory and supplies
breadcrumbs. The shared layout provides breadcrumbs and collection article
switchers. Keep new reading discoverable here as it becomes available.

Full-text search uses Pagefind through `astro-pagefind`. Each `pnpm build` indexes
only the routes listed in `reading.ts`; navigation, directory pages, route aliases
and planned articles stay out of the index. Titles and subjects come from the same
reading entries. The header opens search in a dialog, with Cmd/Ctrl+K access, arrow-key navigation,
recent searches stored in the reader's browser, and article, guide and playground
filters. `/search/` provides the same interface with shareable query URLs. Search
loads index fragments and eight result excerpts at a time. No search service is needed.

The 29 October commission publishes the nine-article application caching collection
from `src/articles/application-caching/`. Its routes, reading directory, search,
collection navigation and downloads use `/learn/databases/application-caching/`.
Redis is the worked implementation, while the collection teaches caching decisions
that apply to other stores. See the [publication record](docs/article-work/application-caching-2026-10-28/publication.md).

Run `pnpm build` before trying search in `pnpm dev`: development serves the last
built index, so rebuild after content changes. `pnpm preview` serves the complete
built site and its matching index.

`src/lib/relational-collection.ts` holds the relational reading order and publication
status. The 15 October 2026 commission explicitly authorised publication of its
34 articles, introduction, checkout and practice pages, including an eleven-article
PostgreSQL branch. The SQL sandbox has 43 article-linked lessons and 238 steps;
`/playgrounds/` is the entrance for this and future technology playgrounds. Other draft reading keeps its own publication state.
The PostgreSQL rebuild covers internals, replication and sharding, JSON, full-text
and vector search, temporal rules and spatial queries. Its experiment and review
records are in `docs/article-work/postgresql-rebuild/`. The subsequent review of all
26 remaining relational destinations, including six deeper operational examples
and four new lessons, is recorded in `docs/article-work/relational-depth-review/`.
Review alone does not
authorise publication of a new commission.

The 26 October commission publishes all 59 reviewed replacement articles from
`src/articles/relational-rebuild/` at the normal relational URLs. The accepted
foundation path, optional child articles and PostgreSQL/CockroachDB branches join
the reading directory, full-text search and collection navigation. Downloads use
`/learn/databases/relational/downloads/`; superseded article and evidence sources have been removed.
See the [publication record](docs/article-work/relational-rebuild-2026-10-25/publication.md).

The following paragraph records the previous replacement.

The 24 October commission published the 58-article Astro collection from
`src/articles/relational-collection/` at the normal relational URLs. Its collection
navigation, reading directory, search and native downloads use published routes;
review previews remain optional. The [publication record](docs/article-work/relational-collection-2026-10-24/publication.md)
records the retained reviews, final local correction and deployment checks.

The following paragraph records the previous replacement.

The 19 October relational replacement commission publishes 54 reviewed articles
from `src/articles/relational/`: 31 general and distributed relational articles,
13 PostgreSQL articles and ten CockroachDB articles. The user authorised publication
after the [teaching-tools repair](docs/article-work/relational-rewrite-2026-10-19/media-repair/README.md).
The [publication record](docs/article-work/relational-rewrite-2026-10-19/publication.md)
connects the review evidence to the public routes. The introduction offers task paths
and a subject directory. Four existing PostgreSQL specialist articles, the checkout,
practice guide and SQL sandbox remain available. Retired routes redirect to their
replacement explanations; public worksheets live below the collection's `evidence/` route.

For internal review, run
`RELATIONAL_DRAFT_PREVIEW=1 pnpm dev --host 127.0.0.1 --port 4323` and open
`/review/relational/`. Normal builds exclude the review and isolated-model routes.

The 16 October object-storage commission authorises publication of its full
collection and sandbox. `src/lib/object-storage-collection.ts` defines reading
order; `src/layouts/ObjectArticle.astro` renders focused Markdown articles. The
browser sandbox executes `src/lib/object-storage/model.mjs`, an explicitly bounded
local model, not AWS or an S3 emulator. Its 14 lessons share those transitions.
The real-service worksheet was checked against local CLI schemas without hosted
AWS execution. Evidence, independent reviews and browser screenshots are in
`docs/article-work/object-storage/`.

The site was consolidated on 4 October 2026. The old field directories, Explore overview, About, Updates and RSS were removed.
The homepage remains a site-wide overview. The column-store essay was
retained and moved into the database tree. The database collection is the first of several planned fields; the [older direction](docs/history/site-direction-2026-10-02.md) is
historical context.

## Appearance

The header offers System, Dark and Light themes. System follows changes to the
reader's device preference; an explicit choice is saved in browser storage and
applied in the head before the page is painted. `src/scripts/theme.js` also switches
picture sources so article artwork follows the selected theme. Theme-specific CSS
uses the resolved `data-theme` on the root; media queries retain system colours
when JavaScript is unavailable.

## Writing and teaching

The EU basic AI icon appears once in the site-wide footer. Article metadata,
guides and playgrounds use a plain AI-generated text link near their titles.
`/how-this-is-made/` explains the production process, reviews by separate AI
agents, the limits of human oversight and the editorial disclaimer.
`AiDisclosure.astro` supplies the footer icon; `AiTextDisclosure.astro` supplies
the text link through `TitleLine.astro` and directly where there is no title line.

Seven skills in `.agents/skills/`, symlinked from `.claude/skills/`, define production:
`staycurrent-orchestrate`, `staycurrent-breakdown`, `staycurrent-write`,
`staycurrent-figures`, `staycurrent-continuity`, `staycurrent-revise` and
`staycurrent-review`. They take an intelligent newcomer to expert practitioner,
optimising useful understanding against reader time and effort. The orchestrator
builds a provisional recursive article tree and reviews the complete learning route
once, then uses fresh planners and writers for the articles. Independent first
readers cover technical accuracy, teaching, writing and rendered behaviour.
Accepted substantive problems are repaired and confirmed in context, retaining
unaffected checks; later repairs may reuse a worker or be checked by the coordinator.
The assembled collection receives one coverage and reading-route check using the
article reviews already completed. The review skill owns the completion rule and
when a later change invalidates an earlier judgement.

Each collection keeps one running-example record beside its tree in `docs/coverage/`.
The five perspective files fix their inputs and checks in
`.agents/skills/staycurrent-review/perspectives/`. Article and heading nodes use
the singular `heading` list and `nested_article` child stubs. Applicable mechanical
evidence can be reused; fresh reader judgement and current rendered-media checks
remain separate. Reviewed drafts require publication authorisation.

The three chosen writing and teaching examples are fixed at their pre-rewrite
revision in `src/reference-articles/`: Sequence diagrams, Indexes, and Storage and
durability. To read their interactive pages, run
`STAYCURRENT_REFERENCE_PREVIEW=1 pnpm dev` and open `/review/examples/sequences/`,
`/review/examples/indexes/` or `/review/examples/storage/`. The preview routes are
excluded from normal builds. Source import paths and internal links are adapted
for their new locations; the explanations and figures are preserved.

Earlier skills are preserved in `docs/history/skills-before-2026-10-19/`. The
[editorial guide](docs/editorial-guide.md), [writing history](docs/writing-style.md),
[illustration notes](docs/illustration-style.md) and earlier coverage proposals
remain records of their work, rather than automatic additions to a worker's prompt.
Keep source evidence, runnable examples and review results under `docs/article-work/`.

Interactive model checks remain beside their models in `src/lib/explainers/`.
The repository's required check is `pnpm build`; use focused example or model
checks when the change calls for them.
