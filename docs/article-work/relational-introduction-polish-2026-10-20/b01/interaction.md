# Introduction interaction review

Perspective: interaction only. Review date: 20 October 2026. No earlier writer or review reports read. No source edits, build or Git operations.

## First encounter in isolation

These observations were recorded after exercising all six frozen fixtures, before reading article prose or component source. Desktop viewport was 1280 × 720 with System theme (rendering dark).

| Figure | First-reading judgement |
| --- | --- |
| 1: join and grouping | Clear question and meaningful comparison. The source rows, distinct-order count, missing order and grouped total agree. The LEFT JOIN switch at the same step makes the difference easy to see. Input tables and result are vertically separated enough to require scrolling at desktop height. |
| 2: transaction | Clear purpose and unusually useful simultaneous request/new-reader views. Stepping each statement, failure, rollback and successful commit makes publication of changes understandable independently. Both selectors produce meaningful changes. |
| 3: missing commit reply | Clear independent comparison: database fact and application knowledge differ. Switching the failure point at the last step preserves the identical missing-confirmation state and changes the stored outcome. The separate-inspection caveat prevents the display implying that the application already knows the answer. |
| 4: access path | Clear objective, same result and different work counts. Model limits are explicit. The first Next changes only the narration; candidate discovery is described rather than visibly enacted. It remains understandable, but offers a weaker visual explanation than its work-count ending. |
| 5: required value rollout | The immediate/staged comparison and changed acceptance state are understandable. “Instruction” is an unspecified field: I can infer the intended schema change, but the figure does not say what kind of instruction is newly required. The immediate path correctly explains that adding the rule fails before testing the old writer. |
| 6: replica versus retained history | Clear two-failure comparison. Present/deleted/unavailable labels explain the states without relying on colour. The final text identifies the appropriate input and the remaining recovery work. |

## Detailed checks and findings

No required interaction repair found. The six figures are independently understandable overall, their selectors expose meaningful alternatives, and the exercised explanations agree with the displayed outcomes. Two optional improvements would reduce the remaining reader effort.

### Optional P3: identify Figure 5’s new field inside the figure

- **Reproduction:** open `/isolated/figure-5/` at step 1, then inspect either rollout. The title, selector, cards and explanation all call the field an “instruction”, without identifying what it instructs.
- **Effect:** the rollout mechanism is clear, but the reader has to invent the example’s missing detail. Reading the article afterwards supplied “delivery instruction”, confirming that the missing context lives outside the figure.
- **Repair:** use “delivery instruction” in the initial explanation and selector; optionally show one short legitimate example value in the final existing-order card. Do not add another paragraph or remove the historical-value caveat.
- **Location:** `src/components/relational-next/a00/DecisionFigure.astro`, change-case configuration at lines 20–26 and messages at lines 83–91.

### Optional P3: give Figure 4’s candidate step a visible intermediate result

- **Reproduction:** start Figure 4 in either mode and press Next once. The highlighted stage and narration change, but the page diagram and both result/work cards remain the same as at Start. In index mode, “Search index for 9 → table page 3” is already displayed before the search step.
- **Effect:** the reader understands the final page-count comparison, but the intermediate step says what happened without showing anything newly discovered. This is weaker than the reference Indexes figures, whose changed counters and selected entries expose the work.
- **Repair:** keep the introductory scope small: reveal the route to page 3 only at “Find candidates”, perhaps as one `9 → page 3` index entry. For the scan, show that no candidate location is available before reading. Alternatively merge the narration-only step into the following step. A full B-tree is unnecessary here.
- **Location:** `src/components/relational-next/a00/DecisionFigure.astro`, lines 73–80.

### Coverage and evidence

| Area | Actual checks |
| --- | --- |
| Figure 1 | Stepped ordinary JOIN through matching and grouping; switched to LEFT JOIN at grouping and returned to matching. Checked two versus three joined rows, one versus two distinct orders, £36 and NULL. Opened the text alternative. |
| Figure 2 | Stepped separate-commit failure through all five states; switched to one transaction and checked rollback and the uncommitted request/new-reader difference. Checked transaction success at reserve and commit, then separately checked successful individual commits at reserve and finish. |
| Figure 3 | Stepped the before-COMMIT path through all four states; changed the failure point at the end and went back to connection loss. Both application-knowledge labels stayed “No commit confirmation”; stored outcomes changed. |
| Figure 4 | Stepped all scan stages; changed to index at the final comparison, reset and checked the index candidate explanation. Checked the phone scan page/result state. |
| Figure 5 | Stepped immediate enforcement through all stages; changed to the staged final state and stepped back through old-writer acceptance and optional-column states. |
| Figure 6 | Stepped writer/storage loss through all stages; changed to mistaken deletion at the final state and went back to replication of deletion. Checked that retained history stayed present while both current copies lost 101. |
| Keyboard | Activated Next with Return in Figures 1, 3, 4, 5 and 6; used Tab between Figure 6 controls and observed a clear focus ring. Opened Figure 1’s native selector with Space, then Down and Return, and verified LEFT JOIN output. Opened its text disclosure. Source inspection confirms the same native-button pattern in Figure 2. No full assistive-technology audit performed. |
| Phone | Inspected all six at 390 × 844. Controls wrap, cards stack, labels remain legible and page-level width fits. Exercised phone states rather than checking only initial screens. Figure 1 was additionally inspected at 320 × 740: the grouped result requires horizontal reading to see its long caption/header, while the value and controls remain visible; this was not established as a broken scroll interaction. This was viewport emulation, not a physical touch-device test. |
| Playback | Started and paused Figure 2 in isolation and in article context. In the timed context check it remained at Start at 19 seconds and was at Insert order on the later observation; Pause stopped it. Component source counts the whole visible figure at 180 words/minute plus a margin, so the initial Figure 2 hold is approximately 40 seconds (115 DOM words). This permits reading, though it also rereads unchanged labels/caption in its allowance. Full automatic completion of every figure was not timed. Next/Back and selector changes stop timers in the source. |
| Themes | Default System resolved dark. Checked phone figures in dark and Figure 2 in explicit light; borders, current-stage accent, text and focus ring remained distinguishable. Restored the 4438 origin to System. |
| Context | Read the complete rendered introduction after recording the six isolation judgements. Its prompts match the implemented controls and requested comparisons. Read the three relevant component implementations and model output logic afterwards. No mismatch between the exercised model outputs and their explanations found. |
| Reference standard | Consulted reference article source and rendered Indexes controls, particularly its scan/search progression. This was supporting comparison, not a new interaction audit of the reference collection. The interaction skill mandates full three-reference reading for editorial/teaching perspectives; this review does not claim that separate work. |

The frozen fixtures were treated as review-only snapshots. No claims about native PostgreSQL execution were inferred from them. No source edits, builds, Git operations or nested agents were used. The only written artefact is this review. Temporary viewport override reset; original 4438 System theme restored; temporary review tab closed at handoff.
