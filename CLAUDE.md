# Stay Current

A static Astro publication helping engineers understand choices and changes that
matter. Use plain British English throughout.

## Where to look

- Repository layout, routes and commands: `README.md`.
- Publication scope, and what is planned rather than available: `docs/site-direction.md`.
- How article figures look: `docs/figure-style.md`.
- Writing voice and the four current reference essays:
  `.agents/skills/staycurrent-write/references/voice.md`.
- The preserved worked articles (Sequence diagrams, Indexes, and Storage and
  durability): `src/reference-articles/`. Run `STAYCURRENT_REFERENCE_PREVIEW=1 pnpm dev`
  to see them at `/review/examples/sequences/`, `/review/examples/indexes/` and
  `/review/examples/storage/`. Normal builds exclude those routes.
- `docs/article-work/` and `docs/history/` are records of earlier work, not instructions.

## Content work

Articles aim to take an intelligent newcomer to expert practitioner, at the least cost
in reading time and effort. Editorial work uses the skills in `.claude/skills/`;
ordinary site maintenance does not need them.

- `staycurrent-plan`: research what an expert knows, then outline articles and exit
  questions.
- `staycurrent-write`: write, rewrite or repair an article and its figures.
- `staycurrent-review`: review a plan, article or collection, or confirm a repair.
- `staycurrent-orchestrate`: run a multi-article commission from plan to delivery.

Explicit instructions from the owner take precedence over the skills. Follow the
commission's stages and stopping point, and resolve routine choices within that scope.
The coordinator is whoever assigned the work: the orchestrator in a collection,
otherwise the owner.

Check consequential technical claims against primary sources, and keep illustrative
models distinct from observed execution.

## Delivery

A push to `main` deploys the live site.

- Work the owner asks for directly, such as site maintenance, is authorised: commit and
  push it when it is done.
- Article content is published only when the owner authorises publication. Planning,
  drafting and review do not. Until then it stays off `main`. Develop on a branch, and
  preview new articles on a `/review/` route behind a draft-preview flag, as
  `APPLICATION_CACHING_DRAFT_PREVIEW` does. A rewrite of a published article stays on
  its branch.
- To publish, integrate the article's routes, its reading entry in `src/lib/reading.ts`,
  navigation, search and downloads, run `pnpm build`, and push to `main`.

## Checks

```bash
pnpm build          # builds every page, then runs the site check
pnpm check          # every site-check issue, by rule
pnpm test           # the site check's own tests
pnpm dev            # http://localhost:4321
```

Builds, the site check, local previews and disposable local databases are safe to run,
fix and rerun without asking. The site check covers structure, links and theme-safe CSS.
It does not establish prose or teaching quality.
