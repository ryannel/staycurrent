# Milestone 1: The catalogue contract answers — extraction and accessors proven headless

**Type:** capability

**Consumer:** a programmatic caller of `@staycurrent/core` and `services/site/lib` — the site's own build, and any future adopter of the catalogue pattern — calling `validateTopicFrontmatter`, `getCatalogues`, `getReadingPosition`, and `summarizeCatalogueFreshness` against a real `topics/` tree.

**Demonstrable goal:** The bet's entire new contract works headless: the seven additive keys extract per their exact rules without ever producing a validation issue, and the three accessors return correct catalogue state — grouping, tie-breaks, derived reading positions, freshness rollup — over real swept frontmatter, including every interim state the program ships through (no areas at all, hub-only, hub plus one foundation, unannotated topics).

**Sequencing rationale:** The contract is the bet's riskiest code assumption (additive extraction that can never fail a build, parity with an unchanged gate), and the house convention proves new capability at its own front door before any surface asserts on it. Everything visible in Milestone 2 renders from these functions; proving them first means the surface milestone debugs rendering, never contracts.

**Acceptance criteria (agreed front-door cases):**
- [ ] `validateTopicFrontmatter` extracts each of the seven keys per `03-api-design.md`'s per-field rules, and no valid, invalid, or absent additive key ever adds to `issues` — the full existing core suite passes unchanged (gate↔loader parity by construction).
- [ ] `getCatalogues` over fixture sweeps with no `area` keys returns `[]`, and over annotated fixtures it groups, orders, tie-breaks the hub slug-alphabetically, and routes unannotated topics to `ungrouped`, per the contract shapes; over the real repo tree it runs without error and returns state consistent with whatever annotation the tree carries at run time (the tree's pre-annotation `[]` is a point-in-time observation, retired the moment Slice 2.2 annotates the hub — the standing assertion is fixture-scoped so the milestone test never goes red by design).
- [ ] `getReadingPosition` is total: `null` on every inapplicable input, correct derived positions among movement-carrying foundations, derived `next` that names only swept slugs, `null` next on the last piece.
- [ ] `summarizeCatalogueFreshness` keys on cut dates via the existing `isFresh` oracle — a no-cut run does not light the count.

## Proof of work

**Proves:** The catalogue's data contract holds exactly as designed, headless, before any pixel depends on it.

**How we prove it:** Drive the real functions through their public API over the real `topics/` tree and over fixture sweeps covering the interim states above; run the untouched existing core and site suites green beside the new ones.

**Test file:** `tests/bets/databases-catalogue/test_milestone_1_catalogue_contract.ts` — generated red at Delivery start; traces to the `validateTopicFrontmatter`, `Catalogue`, `ReadingPosition`, and `CatalogueFreshness` contracts in `03-api-design.md`.

## Slices
- [Slice 1.1 — core: additive frontmatter extraction](./01-additive-frontmatter.md)
- [Slice 1.2 — site: catalogue accessors and freshness rollup](./02-catalogue-accessors.md)

*Absorbed here:* maturity item G3 — `npx groundwork-method repo-map` runs before Slice 1.1 so the display patch's impact analysis has the code map.
