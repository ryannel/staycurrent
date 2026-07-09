# Hand-off from scaffold

> Post-commit context drop from the phase that just committed. The next phase reads this file once at init and deletes it on its own commit.

---

## Deferred Decisions

- GitHub Actions deploy workflow — deliberately not scaffolded; the first bet's publish milestone builds it together with the gate it runs, so the pipeline is proven with real content — revisit at that milestone.
- Framework `./dev health` defect (unconditional Jaeger probe in `.dev/dev-bundle.js`, always exits 1 here) — documented in dev-cli-reference.md; a framework fix, not project scope — revisit on the next `groundwork-method update`.

## User Instincts

- Operator confirmed GitHub Pages hosting with the registered staycurrent.dev domain (2026-07-09); DNS is the operator's manual step when the deploy workflow lands — surface the exact records then.
- Zero-cost operations remains binding: public repo keeps Pages free.

## Context Drop

- MVP Planning inputs: the first topic is **databases** under system design (operator directive) — article covering relational/document/vector/graph (+key-value/columnar), selection heuristics, pros/cons, the convergence trend, practitioner mental models; article + companion skill cut together as v1; maintenance loop commands are part of the MVP's value proposition.
- Everything the bet needs exists and boots: `./dev start` serves the export at 4173; `pytest system/` green (4 passed; skips are visual-regression opt-in and empty parameter sets); `./dev test`, `./dev new milestone|slice` available for the bet loop.
- The bet builds, in order of dependency: `core/` (content contract + gate + loading API + RSS), `topics/databases/`, site routes over the content, `workbench/cli.mjs` + skills, the deploy workflow.
- repo-map has no mappable sources until `core/` lands — re-run `npx groundwork-method repo-map` in the bet worktree after core exists.
