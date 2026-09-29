# Stay Current

One place developers look to stay current on the major topics and fields of their work. Read `README.md` for the layout and `docs/product-brief.md` for what the site is for.

## House voice

Every word written in this project, from articles and changelog entries to docs, commit messages, and chat replies, follows the `staycurrent-style` skill in `.claude/skills/staycurrent-style/`. Load it before drafting anything longer than a sentence.

## Operating the site

`STAYCURRENT.md` is the operator contract: the workbench CLI, the status vocabulary, and the one authority rule. The research loop's skills live in `.claude/skills/`: `staycurrent-research` runs a research run, `staycurrent-writer` authors a cut's artifacts, `staycurrent-editor` reviews them in fresh context.

`topics/` is only ever changed through `workbench/cli.mjs`. Never hand-edit it.

## Checks

```bash
cd core && pnpm build && pnpm test            # content contract and gate
node scripts/publish-gate.mjs                 # every topic through the gate
cd services/site && pnpm lint && pnpm test    # the site
node --test workbench/cli.test.mjs workbench/lib/format.test.mjs scripts/prose-metrics.test.mjs
```

`.github/workflows/publish.yml` runs the same steps, then the system suite in `tests/`, before deploying.
