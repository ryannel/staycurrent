# Slice 1.3 — core: Cut Mechanics

**Owner service:** core

**Surface:** core

**Complexity:** M

**Prerequisite:** Slice 1.2 merged

## Scope

This slice builds the functions that move a topic between the `.staycurrent/staged/` quarantine and published `topics/` truth — the mechanical half of the stage → gate → commit action contract, plus the research-run lifecycle functions around it. It is what makes a founding cut possible at all: `createTopic` seeds a skeleton that deliberately fails the gate, and `executeCut` is the one function that ever writes to `topics/`, and only when handed a passing `GateResult`.

**Required Capabilities:**
- `createTopic(root, slug, { title })` returns `StagedCut { dir, topic, version: 1 }`, seeding the complete gate-shaped founding skeleton at `.staycurrent/staged/<slug>/` — `article.md`, a founding changelog stub, `skill/SKILL.md`, `versions/v1/` stubs, and `research-log.md` — and that skeleton fails `runPublishGate` (empty provenance, at minimum).
- `stageCut(root, slug)` copies the complete committed `topics/<slug>/` tree into `.staycurrent/staged/<slug>/` and returns `StagedCut { dir, topic, version: liveVersion + 1 }`; a second call against an already-staged tree leaves it intact and returns it unchanged (idempotent re-seed).
- `convene(root, slug)` stamps `status: in-research` in the live `article.md` frontmatter and seeds the staged tree via `stageCut` in one call, returning `ConveneResult { topic, againstVersion, stagedDir }`; throws `ContentValidationError` when `status` is already `in-research`.
- `executeCut(root, slug, gateResult)` throws `GateNotPassedError` immediately, before touching `topics/`, when `gateResult.ok !== true`; given a passing `GateResult`, writes the staged tree's artifacts into `topics/<slug>/` and returns `CutReport { topic, version, paths }` naming every artifact path written.
- `recordNoCut(root, slug, input)` updates `last_researched`, reverts `status` to `current`, and returns a `ResearchLogEntry` with `outcome: 'no-cut'` and no `version` field; `discardSession(root, slug)` reverts the working-tree `in-research` stamp with zero other `topics/` writes; `reconcile(root, slug, opts)` reverts `status` to `current` only for topics whose `in-research` status has no session file reported present in the caller-supplied `sessions`/`sessionExists` facts.

## Design

Implements the "Cut mechanics" and "Session mechanics" sections of `technical-design/03-api-design.md` in full — `stageCut`, `createTopic`, `convene`, `executeCut`, `recordNoCut`, `discardSession`, `reconcile` — against the staged-tree layout (`.staycurrent/staged/<slug>/`) and the core-only-mutates-`topics/` rule fixed in `technical-design/04-data-design.md`'s Directory Layout and Integrity Invariants sections. Built on Slice 1.2's `runPublishGate` (the gate `executeCut` requires a passing result from before it writes) and Slice 1.1's loaders (which read the same topic `stageCut` copies forward).

## Proof of work

**Proves:** The staged-tree lifecycle — seed, stamp, gate-gated commit, no-cut, discard, reconcile — moves a topic between `.staycurrent/staged/` and `topics/` only ever through a passing gate, and never partially.

**How we prove it:** Call `createTopic`/`stageCut` against a fixture topic and observe the staged tree seeded at `.staycurrent/staged/<slug>/` with the right artifact set; call `executeCut` with a `GateResult` whose `ok` is `false` and observe it throw `GateNotPassedError` with nothing written under `topics/`; call it again with the real `GateResult` `runPublishGate` returns once that staged tree passes, and observe the staged set land in `topics/<slug>/` byte-identically, with `CutReport.paths` naming every artifact written.

**Test file:** `tests/bets/first-living-topic/test_slice_3_core_cut_mechanics.py` — generated red at Delivery start; traces to the Cut mechanics and Session mechanics functions in `technical-design/03-api-design.md`.
