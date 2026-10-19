# Stay Current

A static Astro publication helping engineers understand choices and changes that
matter. Read `README.md` for the repository layout and `docs/site-direction.md`
for the current publication scope. Other planned fields and the shared
distributed-systems programme remain outside an article commission.

## Content work

The goal is to take an intelligent newcomer to expert practitioner, optimising
useful understanding against reader time and effort. Use the four skills in
`.claude/skills/`:

- `staycurrent-orchestrate`: manage recursive planning, corpus review and writing.
- `staycurrent-breakdown`: plan one article and its contextual child stubs.
- `staycurrent-write`: write one article using the three fixed examples.
- `staycurrent-review`: arrange independent reviews or perform an assigned perspective.

The orchestrator maintains the shared tree. Workers own their assigned piece,
including review and repair. Keep briefs and results with the work in `docs/`.
Use plain British English. Check consequential technical claims against primary
sources and distinguish illustrative models from observed execution. Use the
existing Astro article components and check rendered figures and controls.

The original Sequence diagrams, Indexes, and Storage and durability examples are
preserved in `src/reference-articles/`. Run
`STAYCURRENT_REFERENCE_PREVIEW=1 pnpm dev` to read their interactive previews at
`/review/examples/sequences/`, `/review/examples/indexes/` and
`/review/examples/storage/`. Normal builds exclude those routes.

Earlier skills are archived under `docs/history/skills-before-2026-10-19/`.
Historical editorial notes are records, not additional instructions to load.

## Delivery

Commit and push authorised work to `origin/main` at relevant delivery points.
A push to `main` deploys the site. Review, research and drafting do not authorise
publication; keep planned and draft content distinct from available reading.

## Checks

```bash
pnpm build          # builds every page, then runs the site check
pnpm check          # every site-check issue, by rule
pnpm test           # the site check's own tests
pnpm dev            # http://localhost:4321
```

The site check covers shared structure, links and theme-safe CSS. Errors fail the
build; it does not establish prose or teaching quality.
