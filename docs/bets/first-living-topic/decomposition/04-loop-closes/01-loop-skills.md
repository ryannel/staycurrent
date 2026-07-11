# Slice 4.1 — workbench: Loop Skills & Doc

**Owner service:** workbench

**Surface:** workbench

**Complexity:** M

**Prerequisite:** none (Milestone 3 delivered — the gate carries eleven checks (change-proposal-7); the site serves the trust apparatus)

## Scope

This slice gives the operator's agent its instructions: `STAYCURRENT.md` (the ≤150-line session contract every workbench session opens from) and the two skills — research and writer — that turn the design's agentic-protocol choreography into loadable, executable guidance. After this slice a fresh Claude Code session can open the workbench correctly (state block, proposal, closed vocabulary) and knows exactly how to author a run's artifacts into the staged tree; the loop rehearsal (Slice 4.2) then proves the machinery those instructions drive.

**Required Capabilities:**
- `STAYCURRENT.md` exists at the repo root, ≤150 lines, and carries the session contract: the session-opening state block (filesystem-derived, `node workbench/cli.mjs status` as its data source, followed by a proposal — never an open question), the closed status vocabulary (`current`, `due`, `in-research`, `superseded`, `cut`, `no-cut`, `sourced`, `synthesis` — verbatim strings only), the seven-command CLI set, the halt template, the one authority rule (the system never cuts without the operator's explicit go), and pointers to the two skills — per `01-ui-design.md` § workbench and `docs/design-system.md` § Agentic Protocol.
- A research skill exists under `.agents/skills/` (name carries `research`): it encodes convene choreography (fresh vs resume microcopy verbatim), research progress reporting (completed facts only; the bounded-retry degraded-source rule recorded as a provenance gap), the ranked digest table (finding · source · consequence, ranked by consequence), and the verdict templates (cut and no-cut, verbatim) — with the verdict stated as a position inviting pushback, never an open question.
- A writer skill exists under `.agents/skills/` (name carries `writ`): it encodes what a cut's staged artifacts must be — the article rewrite rules (stance restated at the opening, the document anatomy in `technical-design/04-data-design.md`), the changelog entry as a self-contained mini-essay (a reader current on v(N−1) is done after reading it; `**Stance:** held | bent | reversed` on every non-founding entry), `provenance.md`'s two-section anatomy with `sourced`/`synthesis` labelling, and the skill snapshot rule (the placeholder rides unchanged per change-proposal-2) — all authored directly into `.staycurrent/staged/<slug>/`, never into `topics/`.
- Both skills instruct through the real machinery only: draft artifacts are authored into `.staycurrent/staged/<slug>/` (the sanctioned authoring surface), and every `topics/` mutation goes through `workbench/cli.mjs` (`convene`, `gate`, `cut`, `log`, `discard`) — a skill that hand-edits `topics/` would violate the action contract, and the skills say so in the operator's own halt vocabulary.
- The milestone test's artifact half (`test_staycurrent_doc_and_workbench_skills_exist`) passes: the doc within its line budget, both skills discoverable.

## Design

Implements the workbench surface's session choreography in `technical-design/01-ui-design.md` (§ Session Opening, Convene, Research Progress & Findings Digest, Verdict, Cut Execution & Report, Resume & Reconciliation, Error & Halt) as loadable agent instructions, normative microcopy verbatim from `docs/design-system.md` § Agentic Protocol; the staged-tree authoring path and Research-Run Flow in `technical-design/02-data-flows.md`; the CLI contract in `technical-design/03-api-design.md` § workbench/cli.mjs. Content rules trace to `technical-design/04-data-design.md`'s document anatomy and frontmatter schema (as amended by change-proposal-6).

## Proof of work

**Proves:** A fresh agent session, loading only these instructions, opens the workbench the way the design commits — and the instructions it follows name the real commands, the real staged paths, and the verbatim templates, so following them cannot produce a hand-edit.

**How we prove it:** Assert the artifacts' shape mechanically: `STAYCURRENT.md` exists, ≤150 lines, and names the state block source (`workbench/cli.mjs status`), all seven CLI commands, the halt template's four lines, and the explicit-go authority rule; each skill file carries valid frontmatter, the verbatim microcopy templates it owns (convene fresh/resume, verdict cut/no-cut for research; the changelog mini-essay and provenance labelling rules for writer), the staged-tree path `.staycurrent/staged/`, and no instruction to write into `topics/`. Then load the skills in a live session and open the workbench once against the real tree — the state block renders from `status` output with a proposal sentence — as the slice's human check (recorded in the delivery notes, mechanical assertions being the suite's guard).

**Test file:** `tests/bets/first-living-topic/test_slice_14_workbench_loop-skills.py` — generated red at Delivery start; traces to the workbench choreography in `technical-design/01-ui-design.md` and the CLI contract in `technical-design/03-api-design.md`.
