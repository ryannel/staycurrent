# Stay Current

One place developers look to stay current on the major topics and fields of their work. A static Astro site built from the markdown in `topics/`. Read `README.md` for the layout and `docs/product-brief.md` for what the site is for.

## House voice

Every word written here, from articles and changelog entries to commit messages and chat replies, follows the `staycurrent-style` skill in `.claude/skills/staycurrent-style/`. Load it before drafting anything longer than a sentence.

## Research runs

`.claude/skills/staycurrent-research/` is how a topic gets researched, argued, and cut or logged. It owns the shape of every file under `topics/`. Nothing under `topics/` is committed without the operator's explicit go.

## Checks

```bash
pnpm install
pnpm build          # the only check: every page and the feed must build
pnpm dev            # http://localhost:4321
```
