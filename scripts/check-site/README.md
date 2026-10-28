# Site check

`pnpm build` builds the site, then runs these rules against the built pages in
`dist/` and the CSS in `src/`. They cover the structure every page shares: the
title line, where the contents list goes, the sources section, figure labels,
links and anchors, and theme-safe CSS. One rule, `dense-prose`, warns about
sentences that stack too many clauses, numbers and brackets, and paragraphs
that run long, with limits measured on two human-written explainers (Gears and
Load Balancing) so that their prose almost never trips them. It catches density, not unclear writing; prose quality stays
with the style and review skills.

```bash
pnpm check                                    # every issue, grouped by rule
pnpm check -- --summary                       # one line per rule
pnpm check -- --rule=title-line --page=/learn/drawing-systems/
pnpm check -- --strict                        # warnings fail too
pnpm test                                     # the rules' own tests
```

Two components do most of the work, so the rules mostly confirm they're in use:
`src/components/editorial/TitleLine.astro` writes the title line, with a reading
time that `src/middleware.ts` calculates from the rendered page (`src/lib/reading-time.ts`),
and `src/components/editorial/ArticleBody.astro` puts a contents list, built from
the page's `<h2>`s, after the opening.

Pages are classified by the kind the layout gives search (`Article`, `Guide`
or `Playground`, from `src/lib/search.ts`). Redirect stubs are skipped.

## Levels

`config.mjs` gives each rule a level. `error` fails the build, so the deploy
doesn't happen; `warn` reports; `off` skips. New rules start at `warn`. Once
every page passes a rule, raise it to `error` so it stays that way.

A page that deliberately differs goes in `exceptions` with the reason, rather
than turning the rule off.

## Adding a rule

1. Add `rules/<id>.mjs` exporting `{ id, why, kinds, check }`. `why` is one
   sentence a writer reads when the rule fires. `kinds` is `'all'` or a list of
   page kinds; a source rule has `source: [dirs]` instead.
2. Register it in `rules/index.mjs` and give it a level in `config.mjs`.
3. Add a passing and a failing case to `test/rules.test.mjs`.
