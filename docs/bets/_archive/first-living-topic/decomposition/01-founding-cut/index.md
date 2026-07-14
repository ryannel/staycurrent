# Milestone 1: Founding cut

**Type:** capability — the content contract proven at the module API and through the workbench CLI: slices 1–3 prove at the core module API, slices 4–6 through the CLI.

**Consumer:** the operator at `workbench/cli.mjs`.

**Demonstrable goal:** `topics/databases/` exists at v1, cut through the mechanical publish gate — article, skill, founding changelog entry, and provenance all landed by one `cut(databases): v1` commit; `status` shows `databases v1 current`.

**Sequencing rationale:** The content contract, gate semantics, and cut mechanics are the bet's biggest unknown, and every later rung consumes their output; `topics/databases/` may only come to exist through the gate — 04-data-design's seed rule states plainly that there is no hand-seeded exemption anywhere in the schema. This milestone also lands the agentic-protocol design track — the state block, the halt template, and the CLI's closed verb set — in a running tool, the foundation every later workbench interaction builds on.

**Acceptance criteria (agreed front-door cases):**
- [ ] `create databases` seeds a staged skeleton that FAILS the gate, naming the missing artifacts — the founding run's TODO list.
- [ ] After the article, changelog, provenance, and skill are authored into the staged tree, `gate databases` prints `PASS databases v1`.
- [ ] `cut databases` lands exactly one commit carrying the four committed artifacts (snapshot trio + `## v1` changelog entry; the fifth invariant artifact — the RSS item — follows at site build) and prints the cut report.
- [ ] Re-running `cut databases` after a successful cut exits `0` with `Nothing to cut — v1 is complete.`
- [ ] `status` renders the state-block row showing `databases` at `v1`, `current`.

## Proof of work

**Proves:** The operator can take `topics/databases/` from nothing to a gate-passing v1 — article, skill, founding changelog entry, and provenance landed together — by exactly one `cut(databases): v1` commit, and see that state confirmed afterward by `status`.

**How we prove it:** In a real shell against the real repository, the operator runs `create databases` and observes `gate databases` fail, with `FAIL` lines naming the still-missing founding artifacts; authors the article, changelog entry, provenance, and skill into the staged tree; re-runs `gate databases` and observes `PASS databases v1`; runs `cut databases` and observes exactly one commit land, the cut report naming the four committed artifacts and noting the RSS item follows at site build; runs `cut databases` again and observes exit `0` with `Nothing to cut — v1 is complete.`; and runs `status` and sees the state-block row reporting `databases` at `v1`, `current`. Every step drives the real `workbench/cli.mjs` against the real repository and the real publish gate — no stubbed gate result, no scripted stand-in for any of the nine checks.

**Test file:** `tests/bets/first-living-topic/test_milestone_1_founding_cut.py` — generated red at Delivery start; drives the `workbench` surface's `subprocess-cli` medium over the `workbench/cli.mjs` command contract and the `runPublishGate`/`executeCut` interfaces in `technical-design/03-api-design.md`, against the `topics/databases/` tree `technical-design/04-data-design.md` specifies.

## Slices

- [Slice 1.1 — core: Core Contract](./01-core-contract.md)
- [Slice 1.2 — core: Publish Gate](./02-publish-gate.md)
- [Slice 1.3 — core: Cut Mechanics](./03-cut-mechanics.md)
- [Slice 1.4 — workbench: Workbench CLI](./04-workbench-cli.md)
- [Slice 1.5 — workbench: Databases Content](./05-databases-content.md)
- [Slice 1.6 — workbench: Founding Cut](./06-founding-cut.md)
