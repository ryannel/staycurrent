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
| `/learn/databases/choosing/` | Databases and storage field guide |
| `/learn/databases/relational/` | Relational introduction and collection |
| `/learn/databases/relational/*/` | Written articles and clearly labelled planned outlines |
| `/learn/databases/column-stores/` | Illustrated column-store essay with four experiments |
| `/learn/databases/*/` | Documents, partitioning, distributed SQL, caching, search, graphs and object storage |
| `/assessments/postgres-vectors/` | Dated vector-search assessment draft linked from the guide |

`src/lib/reading.ts` indexes available reading for the directory and supplies
breadcrumbs. The shared layout provides breadcrumbs and a relational article
switcher. Keep new reading discoverable here as it becomes available.

`src/lib/relational-collection.ts` holds the relational reading order and draft
status. Preserve the difference between available articles and planned coverage.
Articles remain working drafts with `noindex`; review does not publish them.

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
