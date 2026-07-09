# Milestone 4: Loop closes

**Type:** capability — the research loop, proven through the workbench surface.

**Consumer:** the operator (and the returning reader, via the changelog).

**Demonstrable goal:** The research loop closes against the live topic — `STAYCURRENT.md` (≤150 lines) plus the research and writer workbench skills exist; the operator convenes a run (`convene databases`), the session produces a ranked digest and a verdict stated as a position, and the run resolves through the same gate to a v2 cut (or an honest no-cut via `log databases`) with zero hand-edits outside the machinery; the site rebuild shows v2's changelog entry standing alone.

**Sequencing rationale:** This is the hypothesis test itself — Success Signal 3. Everything before it exists so this rung can be driven honestly, against the real gate and the real cut mechanics Milestone 1 proved and the real published site Milestones 2 and 3 proved.

**Acceptance criteria (agreed front-door cases):**
- [ ] Convene → digest → verdict → operator go → cut v2 (or no-cut logged) resolves as one commit, with zero hand-edits outside the CLI and the skills.
- [ ] The deployed site shows the new state after the resulting rebuild.
- [ ] The discard path leaves zero trace — nothing published changes, and no research-log entry is written.

## Proof of work

**Proves:** The operator can convene a real research run against the live `databases` topic and have it resolve — cut or honest no-cut — through the same mechanical gate Milestone 1 proved, with no hand-edit outside the workbench machinery.

**How we prove it:** The operator runs one real research session end-to-end in Claude Code — convening the run with `convene databases`, producing a ranked digest and a verdict stated as a position, then either directing a v2 cut through `cut databases` or an honest no-cut through `log databases`. The operator then inspects the resulting `git diff`, confirming every changed file is one the workbench's session, gate, and cut mechanics produced; inspects the new changelog entry, confirming v2 stands alone and a reader current on v1 is done after reading it; and inspects the live site after its rebuild, confirming the new state is visible there. Finally, to prove the discard path leaves zero trace, the operator convenes a second session and discards it — then observes `git status` clean, `status` output unchanged, and no new entry in `research-log.md`.

**Test file:** `tests/bets/first-living-topic/test_milestone_4_loop_closes.py` — generated red at Delivery start; drives the `workbench` surface's `subprocess-cli` medium over the `convene`, `recordNoCut`, and `executeCut` interfaces in `technical-design/03-api-design.md`, against the `research-log.md` and `changelog.md` stores in `technical-design/04-data-design.md`.

## Slices

> *Slices authored on arrival.*
