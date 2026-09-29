# Stay Current

One place developers look to stay current on the major topics and fields of their work. Each topic is a living article with a stance, rewritten when the field moves, with version history, a changelog, and honest provenance. The site is [staycurrent.dev](https://staycurrent.dev).

## Layout

| Path | What it is |
|---|---|
| `topics/<slug>/` | One topic: `article.md`, `changelog.md`, `research-log.md`, `versions/vN/`, `evidence/` |
| `src/` | The Astro site: content collections over `topics/`, six page types, and the feed |
| `scripts/prose-metrics.mjs` | The measuring tool for the house voice's countable tells |
| `.claude/skills/` | The two skills a research run uses: `staycurrent-research` and `staycurrent-style` |
| `docs/` | The product brief and the content-research notes for the databases catalogue |

## Running it

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static site in dist/
```

Every push to `main` builds and deploys to GitHub Pages through `.github/workflows/publish.yml`. A pull request builds without deploying.

## URLs

| Route | Page |
|---|---|
| `/` | The topic library |
| `/<slug>/` | The living article, with the current version's provenance |
| `/<slug>/changelog/` | Every version's entry, newest first |
| `/<slug>/history/` | Every version with its cut date and stance, plus the research log |
| `/<slug>/v/<n>/` | An archived version as cut; the current one redirects to the article |
| `/changelog/` and `/rss.xml` | Every entry across every topic |
