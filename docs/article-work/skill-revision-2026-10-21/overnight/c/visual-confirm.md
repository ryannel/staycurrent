# Visual repair confirmation · Figure 2 · C-02 / A-r02

Started: 2026-10-21 21:17:17 UTC. Checks ended: 2026-10-21 21:21:55 UTC.

Highest severity: none within the declared scope. Accepted problem: **confirmed repaired**.

## Scope and inputs

This was an informed, focused confirmation of Figure 2 steps 3–4 in both modes, not a blind first reading or a whole-article review. The accepted problem was that phone readers operating the controls could lose Tariq’s off-screen lane while the adjacent explanation described only Mina. The pass condition was to understand both requests and committed versus pending state beside the controls.

Used the [C frozen manifest](../c-frozen-manifest.json), [A-r02 manifest](../a/repaired-r02-manifest.json), and C-02 review, visual-perspective and figures skills under `/private/tmp/staycurrent-skills-night-c/.agents/skills/`. Inspected the fixed [transactions preview](http://127.0.0.1:4341/review/relational-trial-3/transactions/), Figure 2’s complete five-state histories in both modes, its text alternative, boundary note, and the surrounding stale-write/conditional-statement explanation. Read the relevant rendered Sequence diagrams “Who is waiting” figure and surrounding activation-bar passage; stepped its first two actions to calibrate participant attribution, state and adjacent explanations. Did not reload all three reference articles.

Permitted evidence: [mechanical receipts](../a/mechanical-receipts-r01.json) and [current source checks](../a/a03-evidence/r02-source-checks.json). Current article/model hashes match A-r02; the shared stepper hash matches the mechanical receipt. The latter supports unchanged mechanics only. The source checks identify unchanged native SQL, data and verifier; they are not rendered or observed timing evidence. No earlier reviews, decisions, repair narratives or author judgements were read.

## Checks

| Check | Result | Observation |
| --- | --- | --- |
| First reading alone | Not applicable | Informed repair confirmation; no independent-first-reading claim. |
| Form fits the content | Pass in affected scope | Request lanes distinguish actions; separate committed tables keep actual column headings and R8/R9 ownership visible. The repair changes explanations, not the model’s states or form. |
| Readable at a glance | Pass | All four changed explanations name Mina and Tariq. They wrap cleanly above the controls at phone width. |
| Interaction | Pass | Fresh manual use traversed all five states in each mode; option changes reset the history. Current automatic transitions, Pause, Reset and keyboard endpoints worked. |
| Themes and phones | Pass | Inspected steps 3–4 in both modes at 1280 × 900 and **verified `innerWidth=375`, `innerHeight=812`**, in light and dark themes. Phone document width was 375, with no horizontal page overflow. |

## Pass conditions

| Condition | Result | Evidence |
| --- | --- | --- |
| Pending work is distinguishable from committed state | Pass | Step 3 says Mina’s work is pending and the committed counter remains 1. Committed reservations is empty. In guarded mode it also explicitly says Tariq’s UPDATE waits for her transaction to end. |
| Both actions remain understandable beside phone controls | Pass | The entire changed explanation and all four buttons fit together in each inspected phone state. Tariq’s lane can be above the viewport, but the explanation carries his stale decision or wait/recheck without requiring a scroll back. See [guarded step 3](visual-evidence/phone-light-guarded-3.png), [guarded step 4](visual-evidence/phone-light-guarded-4.png), and their dark-theme counterparts. |
| Commit and recheck are distinguished | Pass | Step 4 shows committed remaining 0 and R8. Stale mode says Tariq still intends to overwrite with his earlier calculation; guarded mode says his wait ends and `remaining > 0` is rechecked against that committed row and is false. Final states agree: R8/R9 versus only R8. |
| Captions and boundaries still agree | Pass | Caption calls this an illustrative model. The boundary note separates committed tables from pending lane work and explicitly excludes real timing/database execution. The text alternative gives both outcomes. |
| Longer explanations have usable holds and controls | Pass, with visibility limit below | Observed current continuous-transition hold styles: stale steps 3/4 = 8895/7995 ms; guarded = 9705/9750 ms. These agree with the current source calculations and allowed time to read the changed material. Pause worked at stale step 4; both modes reached terminal Replay. Enter at the first Back and last Next kept focus on that button with `aria-disabled=true` and did not advance past the endpoint. |

Fresh screenshots are in [visual-evidence](visual-evidence/): all changed state/theme/width combinations were inspected; 15 of those 16 views were saved, plus a phone lane/caption view. Desktop-light stale step 3 was observed in the CUA screenshot but not saved separately. Rendered text-colour checks found minimum sampled text contrast 6.61:1 in light and 6.83:1 in dark, including the muted boundary note; the small illustrative caption uses the same muted colour. See [light measurements](visual-evidence/contrast-light.json), [dark measurements](visual-evidence/contrast-dark.json) and [small dark labels](visual-evidence/contrast-dark-small-text.json).

## Findings and limits

No new defect seen in the affected figure, surroundings or controls; no change invalidated a broader judgement requiring widened review.

This does not certify the rest of the article, other figures, every code listing, or whole-article teaching/coherence. Native PostgreSQL was not rerun. The Mac reported locked, although the extension browser worked and the page reported `document.hidden=false` and `visibilityState=visible`. Thus screenshots and current DOM hold styles were checked, but uninterrupted physical foreground playback is not claimed. Browser viewport override and the original System theme selection were restored. No source edits, builds, servers, commits or pushes were made.
