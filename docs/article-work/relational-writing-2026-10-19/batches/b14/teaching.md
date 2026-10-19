# b14 independent teaching, style and interaction review

## Verdict

**a16 — Calculating across related rows: REVISE, narrowly.** Two required narration corrections, T16-1 and T16-2. The complete prose, scope, calculation teaching, controls, playback and responsive presentation otherwise pass. One optional copy correction is recorded separately.

Reviewed the immutable b14 candidate at `http://127.0.0.1:4439/review/relational-next/window-functions/` against the original relational-practice goal under `.agents/skills/staycurrent-review/SKILL.md`. No practitioner report was read or used.

## Reading, scope and reference style

Retained the complete source and rendered-figure reading of Sequence diagrams, Indexes, and Storage and durability from the earlier teaching assignments. Read the complete b14 article, context, model, player, query module, source record and writer handoff. Family judgement uses the actual a02 parent and a13/a14/a15 siblings, already read in full; the parent's staging and first-window sections were also re-read for this assignment. There are no child plans to assess.

The article extends the parent's useful first window calculation rather than repeating a SQL introduction. The opening links the two genuine prerequisites. Input grain and multiplicative joins remain with a14; arithmetic, unknown values and reporting calendars remain with a13; staging notation is assumed from a02 rather than requiring a detour through a15. Performance is correctly deferred after answer verification. The depth is appropriate for ordinary application and reporting practice, without a function catalogue or analytical-specialist branch.

The two small fixtures earn their reuse. A hand-calculated known total comes before syntax; the prose explicitly avoids calling an incomplete sum a balance. Tied timestamps, tied sales, missing dates, an unknown amount and a zero-total singleton produce visible differences rather than ornamental edge cases. Like the references, prose directs readers to a particular row and asks them to change one condition before explaining the outcome. Figure steps are explicitly logical models, while PostgreSQL 18.6 results are separately identified as observations.

## Mechanism teaching

- **Figure 1:** partition shading and reversed display preserve row identity and attached totals. The surrounding annotated OVER expression distinguishes input, partition, window order, peers and final display order.
- **Figure 2:** row position, rank and dense rank appear together. Cutoffs one and two distinguish fixed row counts, competition positions and distinct sales values. The prose explains why an item tie-breaker belongs in ROW_NUMBER but would destroy intended ranking peers; the latest-event query also explains that an ID is a chosen repeatability rule, not proof of event chronology.
- **Figure 3:** moving the positive-amount test visibly changes which rows are numbered, then returns event 6 versus events 3 and 6. The separate cumulative-history SQL case is complete and useful: 25/25 with history versus −5/−5 after a premature date restriction. It needs no added figure. Whole-partition filtering versus cutting through history is explained locally.
- **Figure 4:** numerator, denominator and percentage are visible together, making 110 versus 40/80/100/110 causal. Zero totals, missing contributions, rounding to 99.99%, and the winners' shares of the complete group are handled explicitly rather than hidden behind defaults.
- **Figure 5:** event 2's frame changes from events 1/2 to 1/2/3 when peers enter together; known total changes from 10 to 30. Complete event ordering and explicit ROWS are separate decisions. The missing-contribution count supplies a practical way to detect an incomplete total.
- **Figure 6:** the selected contributors explain row-count totals 10/30/70/110 versus date-distance totals 10/30/60/90, including the lower boundary and partial opening frames. Calendar preparation, absent reports versus confirmed zeroes, and 45 versus 30 averages are sufficiently explained in prose.
- **Figure 7:** predecessor identity distinguishes absence from a present NULL. The default changes only the absent-row case, and the signed change is correctly described as a comparison of event sizes. Previous recorded row versus previous calendar day and the opening report boundary are explained without expanding into unrelated LAG variants.

The final combined report is a useful consolidation of three distinct partitions/filtering requirements. Its answer key checks the 110 denominator and preserved moving history, rather than merely counting winners. Reverse insertion-order observations are qualified appropriately; tested correctness is not presented as evidence of acceptable execution cost.

## Interaction and visual evidence

Manually traversed and read **all 78 states across all 18 choices**: partition 2×6, rank 6×4, filter 2×3, share 2×4, frame 2×5, moving 2×4 and LAG 2×5. Table values, rule, result and narration were inspected, producing the findings below.

For every choice, exercised slider Home/End and intermediate steps, keyboard activation of Back/Next at both endpoints, Play/Pause, slider interruption of playback and Reset. Both endpoint buttons retained keyboard focus and clamped their state. Reset returned to the first step while retaining the selected calculation. Each scene also passed Replay from its final state, manual Next stopping playback, and selector changes stopping playback while retaining the comparison step. Controls remain mounted while the board changes.

Playback counts the entire changing scene: rule, headers, every table cell, result and explanation, at 200 words/minute plus two seconds. The dense Figure 5 default-frame event-2 state has 88 words and a **28.4-second** budget. In actual playback it was still at step 2 after 21.345 seconds, then at step 3 after 35.402 seconds, with Pause still active. This validates the shared timing mechanic against a dense rendered case. Source inspection confirms the final state receives its own hold before stopping. I did not wait through every complete sequence. Fixed captions and controls can be read before starting playback and are not included in the changing-scene count.

At **390×844**, inspected all seven figures in both dark and light themes, including their important changed-choice comparisons. Rule text and long headings wrap; table cells, excluded rows, current-row outlines, NULL/pending distinctions and results remain legible. Tables fit their 335 px inner region without horizontal overflow; page width remained 390 px. Taller scenes need ordinary vertical scrolling to read their narration. Desktop manual inspection used the normal 1488 px viewport; figures and tables also fit, with readable contrast in both themes. No visual or control repair is required.

The worksheet was not clicked and no download event was awaited. Root's `b14/download-check.json` owns URL/byte verification; this report makes no browser-download-UI claim. No native SQL execution or build was run by this reviewer.

## Required findings

### T16-1 — Give opening date frames real calendar boundaries

**Location:** `src/components/relational-next/a16/model.mjs:50`, Figure 6, “Current day and two before”, steps 1 and 2.

The narration says “include dates Jan -1 through Jan 1” and “Jan 0 through Jan 2”. Those are impossible dates in the article's January 2026 fixture. This figure specifically teaches date-distance frames and opening boundaries, so readers need the actual calendar interval: **30 December 2025 through 1 January 2026**, then **31 December 2025 through 2 January 2026**, both inclusive. The selected rows and totals are already correct. Format a real date or use explicit opening-boundary labels; retain the useful explanation that no earlier fixture rows exist. Recheck both opening states and the January 4/5 comparisons.

### T16-2 — Match the peer explanation to the current event

**Location:** `src/components/relational-next/a16/model.mjs:46`, Figure 5, “Default, time only”, step 3.

The state begins “At event 3” but ends “both enter even while inspecting event 2”. The solid outline correctly marks event 3. The event-2 wording is useful at step 2 but was reused for both tied events. Make it conditional on event 2, or give event 3 an explanation that both peers share the same frame/total. Preserve the event-2 demonstration that event 3 contributes before the model inspects its own result. Recheck steps 2 and 3 with selector changes retaining the step.

## Optional finding

**T16-O1 — Singular result label.** `model.mjs:31`, Figure 2, “One row”, currently says “keeps A (1 rows)”. Use “1 row”. This is a small copy correction and does not affect understanding.

## Cleanup and retained pass

System theme and the normal viewport were restored, and the owned Chrome tab was closed. No article/component edits, shared builds, Git operations or nested reviewers were used. The only saved mutation is this report. After the two narration repairs, a narrow state/phone recheck is sufficient; retain the other prose, scope, interaction and playback passes above.
