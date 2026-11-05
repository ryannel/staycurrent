# Stay Current

A static Astro publication helping engineers understand choices and changes that
matter. Use plain British English throughout.

## Where to look

- Repository layout, routes and commands: `README.md`.
- Publication scope, and what is planned rather than available: `docs/site-direction.md`.
- How article figures look: `docs/figure-style.md`.
- The preserved reference articles (Sequence diagrams, Indexes, and Storage and
  durability): `src/reference-articles/`. Run `STAYCURRENT_REFERENCE_PREVIEW=1 pnpm dev`
  to see them at `/review/examples/sequences/`, `/review/examples/indexes/` and
  `/review/examples/storage/`. Normal builds exclude those routes.
- `docs/article-work/` and `docs/history/` are records of earlier work, not instructions.

## Content work

Articles aim to take an intelligent newcomer to expert practitioner, at the least cost
in reading time and effort. Editorial work uses the skills in `.agents/skills/`;
ordinary site maintenance does not need them.

- `staycurrent-plan`: research what an expert knows, then outline articles and exit
  questions.
- `staycurrent-write`: write, rewrite or repair an article and its figures.
- `staycurrent-review`: review a plan, article or collection, or confirm a repair.
- `staycurrent-orchestrate`: run a multi-article commission from plan to delivery.

Explicit instructions from the owner take precedence over the skills. Follow the
commission's stages and stopping point, and resolve routine choices within that scope.
Check consequential technical claims against primary sources, and keep illustrative
models distinct from observed execution.

## Delivery

Planning, research, drafting and review do not authorise publication. Keep draft content
distinct from available reading. When work is authorised for publication, commit and
push it to `origin/main`; a push to `main` deploys the site.

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
