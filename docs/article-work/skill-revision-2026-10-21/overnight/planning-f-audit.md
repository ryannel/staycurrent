# Candidate F static planning-policy audit

UTC start: 2026-10-21T22:36:50Z  
UTC end: 2026-10-21T22:37:58Z

F is untested and not adopted. This inspection establishes textual properties and conflicts only; it does not establish behavioural reliability.

## Inputs and boundary

Read repository `AGENTS.md`, `README.md`, `docs/site-direction.md`, and the live `.agents/skills/staycurrent-review/SKILL.md` for the assignment rules. Read all 14 Markdown files in `docs/article-work/skill-revision-2026-10-21/overnight/candidates/f/.agents/skills/`:

- Seven roots: `staycurrent-breakdown`, `staycurrent-continuity`, `staycurrent-figures`, `staycurrent-orchestrate`, `staycurrent-review`, `staycurrent-revise`, `staycurrent-write` (`SKILL.md` in each).
- Figure references: `references/database-verification.md`, `references/stepper.md`.
- Review perspectives: `editorial.md`, `practitioner.md`, `teaching.md`, `value.md`, `visual.md`.

Compared every corresponding file with sibling `candidates/d/.agents/skills/` (D-02), including the full D orchestrate/review roots. No article bodies, experiments, reports, findings, planning-F narrative or prior quality opinions were inspected. No teams, source edits, builds, browser use, commits or pushes.

## Checks

| Requirement | Static result |
| --- | --- |
| Only orchestrate/review roots differ | Pass: both trees contain the same 14 Markdown paths; the other 12 are byte-identical. |
| All 29 checks retained | Pass: practitioner 5, value 5, teaching 7, editorial 7, visual 5; perspective files unchanged. |
| Fresh assignments and independent first coverage | Retained: review lines 19–23 and orchestrate line 8 cover full reviews, repairs, confirmations and final readings; plans get all three mode perspectives on a complete frozen plan (review line 85). |
| Current complete inputs and relevant confirmations | Retained: frozen/versioned context, permitted reference inputs, repaired surroundings/dependencies and widened assessment remain explicit. |
| Complete learning journey | Added explicitly: a fresh blind complete teaching reading, including clean first batches, practical judgement and article boundaries (review line 87). See finding 1 for its conflict with the general report rule. |
| Stable substantive acceptance | Retained unchanged: reader-effect acceptance, all accepted critical/medium defects repaired whenever found, no rising floor/cap escape (review lines 61–71). |
| Article criteria/schedule | Unchanged: review lines 73–81 are identical to D. |
| Corpus criteria/schedule | Same perspectives, complete rounds through round 3, then relevant confirmations; however the corpus paragraph loses an explicit placement-check handoff (finding 2). |
| Publication boundary | Retained: completed review does not authorise publication; drafts remain distinct from available reading. |
| Compactness | Planning changes are confined to three orchestrate paragraphs and the review ending. No checklist expansion or repeated per-node default gate. The conflicts below, rather than length, are the concrete concern. |

## Findings

### 1 · Medium · review/SKILL.md:59 versus :87

The inherited general report instruction says **“Final readings use editorial checks plus the whole-article judgement below.”** F now adds a final complete **teaching** reading for plans at line 87, applying all teaching checks. Line 15 also excludes plan wording review, while line 19 gives every reviewer exactly one perspective and only its listed inputs.

Taken literally, the new plan final reader must apply both editorial and teaching checks despite the one-perspective and no-plan-wording-review rules. The plan-specific paragraph makes the intended teaching role clear, but does not scope the earlier universal sentence. Scope line 59's editorial instruction to article final readings, leaving plan final readings under their teaching rule. This is an instruction conflict introduced by adding the plan final stage, not a request for different prose style.

### 2 · Medium · review/SKILL.md:89 compared with D:85

D's shared breakdown/tree/corpus schedule explicitly required the coordinator to **“name additions to teaching without prior findings.”** F retains an equivalent handoff for plans at line 85 and for article confirmations at line 76, but not for corpus at line 89.

That is a corpus-policy semantic loss: teaching check 7 is specifically for coordinator-named additions, so a standalone corpus repair no longer requires the coordinator to identify additions for that check. The orchestrated article-repair route partly mitigates this through orchestrate line 32, but it does not preserve the former corpus rule itself. Retain that handoff in the corpus schedule without changing its review rounds.

## Assessment and limits

The intended planning sequence is coherent: provisional recursive planning, full independent practitioner/value/teaching coverage, fresh informed confirmations with widening, then a blind complete teaching reading whose judgement must remain current. Its acceptance and publication rules remain substantive and stable. The two bounded conflicts above should be resolved before treating the text as internally consistent; neither requires another review stage.

No behavioural trial was run. This audit cannot show that an agent will supply sufficient context, choose the right widening scope, retain full practical depth, or stop correctly in execution.
