# Stay Current

A static Astro publication about engineering choices and the changes that matter.
Start with the [site direction](docs/site-direction.md). The homepage introduces
the wider coverage; Databases and storage is the first field with available reading.

## Run it

Use Node.js 24 and pnpm 11.4.0, matching the build workflow.

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # builds every page
pnpm preview
```

Every push to `main` builds and deploys to GitHub Pages through
`.github/workflows/publish.yml`. Pull requests build without deploying.

## Reading structure

| Route | Purpose |
| --- | --- |
| `/` | Site overview, available reading and planned fields |
| `/articles/` | Searchable directory of available reading |
| `/playgrounds/` | Guided, editable engineering experiments, starting with the SQL sandbox |
| `/learn/databases/choosing/` | Databases and storage field guide |
| `/learn/databases/relational/` | Relational introduction and collection |
| `/learn/databases/relational/sandbox/` | Browser PostgreSQL sandbox with free exploration and linked tutorials |
| `/learn/databases/relational/*/` | Published relational articles, practical guides and preserved route aliases |
| `/learn/databases/column-stores/` | Illustrated column-store essay with four experiments |
| `/learn/databases/*/` | Documents, partitioning, distributed SQL, caching, search, graphs and object storage |
| `/assessments/postgres-vectors/` | Dated vector-search assessment draft linked from the guide |

`src/lib/reading.ts` indexes available reading for the directory and supplies
breadcrumbs. The shared layout provides breadcrumbs and a relational article
switcher. Keep new reading discoverable here as it becomes available.

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

The site was consolidated on 4 October 2026. The old field directories, Explore overview, About, Updates and RSS were removed.
The homepage remains a site-wide overview. The column-store essay was
retained and moved into the database tree. The database collection is the first of several planned fields; the [older direction](docs/history/site-direction-2026-10-02.md) is
historical context.

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
