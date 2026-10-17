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
| `/learn/databases/object-storage/` | Published introduction and thirteen focused articles, using Amazon S3 |
| `/learn/databases/object-storage/sandbox/` | Fourteen local model lessons, with 78 editable request steps |
| `/learn/databases/object-storage/practice/` | Real-S3 CLI worksheet with exact-version cleanup |
| `/learn/databases/*/` | Other draft families: documents, partitioning, distributed SQL, caching, search and graphs |
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

The [editorial guide](docs/editorial-guide.md), [writing references](docs/writing-style.md)
and [illustration style](docs/illustration-style.md) record what we have learned.
The column-store essay and relational articles are working examples. Supporting
artwork follows the theme, and interactive controls are distinct from static data.

The [coverage structure](docs/content-structure.md) guides new commissions.
`staycurrent-planning` develops collections; `staycurrent-authoring` develops
articles; `staycurrent-review` provides independent challenge. House skills live
in `.agents/skills/`, mirrored in `.claude/skills/`. Keep the review notes, source
records and runnable SQL under `docs/article-work/` with the articles they support.

Interactive model checks remain beside their models in `src/lib/explainers/`.
The repository's required check is `pnpm build`; use focused example or model
checks when the change calls for them.
