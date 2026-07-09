# Slice 1.6 — workbench: Founding Cut

**Owner service:** workbench

**Surface:** workbench

**Complexity:** S

**Prerequisite:** Slice 1.5 merged

## Scope

This slice closes the milestone. It authors the companion skill to the article's stance, then executes the founding cut itself — `gate databases` passing, `cut databases` landing the atomic five-artifact set as one commit, and `status` confirming the result. This is the milestone's headline proof: everything the five slices before it built is exercised together, for real, for the first time.

**Required Capabilities:**
- The staged `skill/SKILL.md` frontmatter states `name: databases`, a `description` written as routing triggers (per `04-data-design.md`'s SKILL.md entry), and `article_version: 1`, plus a `references/` directory — matching the `name`/`description`/`article_version` field table `04-data-design.md` fixes for the companion skill.
- With the skill authored, `gate databases` reports `ok: true` with an empty `failures` array — including the `skill-version-match` and `skill-byte-identical` checks Slice 1.5 explicitly left failing — and prints `PASS databases v1`.
- `cut databases` against the now-passing staged tree lands exactly one git commit `cut(databases): v1` and prints the `CutReport`'s paths. The cut is atomic across the invariant's five artifacts — the snapshot trio (`versions/v1/article.md`, `versions/v1/skill/`, `versions/v1/provenance.md`), the `## v1` entry atop `changelog.md`, and the RSS item generated verbatim from that entry at site build; the live `article.md`/`skill/` updates ride in the same commit but are not invariant artifacts (per `04-data-design.md`'s atomic-cut invariant).
- `status` afterward reports `databases` at `v1` with state `current` in its state-block row.

## Design

Authors `topics/databases/skill/SKILL.md` and `references/` per `technical-design/04-data-design.md`'s SKILL.md Frontmatter and Document-anatomy subsections, then drives Slice 1.4's `gate` and `cut` commands — which call Slice 1.2's `runPublishGate` and Slice 1.3's `executeCut` — to close the milestone's atomic five-artifact cut, per the Integrity Invariant `technical-design/04-data-design.md` states: "A cut is atomic across five artifacts."

## Proof of work

**Proves:** The companion skill is authored to the article's stance, and the full five-artifact founding cut lands as exactly one `cut(databases): v1` commit, visible afterward in `status`.

**How we prove it:** Author the skill content into the staged tree, then in a real shell run `gate databases` and observe `PASS databases v1`; run `cut databases` and observe the cut report naming the artifacts written — the snapshot trio and the `## v1` changelog entry, with the live `article.md`/`skill/` updates riding in the same commit (the fifth invariant artifact, the RSS item, is generated verbatim from the entry at site build); inspect `git log` and observe exactly one `cut(databases): v1` commit; run `status` and observe the `databases` row reporting `v1` and `current`. This is the milestone's headline proof, run against the real repository with no staged or scripted stand-in for any artifact.

**Test file:** `tests/bets/first-living-topic/test_slice_6_workbench_founding_cut.py` — generated red at Delivery start; traces to `runPublishGate`, `executeCut`, and the `workbench/cli.mjs` `gate`/`cut`/`status` commands in `technical-design/03-api-design.md`, and the five-artifact atomic-cut invariant in `technical-design/04-data-design.md`.
