# Visual review · article · relational introduction and transactions · A round 2 frozen static build

Started: 2026-10-21 20:52:47 UTC. Finished: 2026-10-21 20:59:48 UTC.

Inputs read: candidate A review skill, visual perspective and figures skill from `/private/tmp/staycurrent-skills-night-a-repair/.agents/skills/`; rendered [introduction](http://127.0.0.1:4341/review/relational-trial-3/) and [transactions](http://127.0.0.1:4341/review/relational-trial-3/transactions/) on the coordinator's frozen static server; rendered reference routes for [Sequences](http://127.0.0.1:4341/review/examples/sequences/), [Indexes](http://127.0.0.1:4341/review/examples/indexes/) and [Storage](http://127.0.0.1:4341/review/examples/storage/). Compared representative rendered stepped figures: sequence Figure 2, index Figure 3, storage Figure 5, alongside their rendered figure inventories. Read the supplied [mechanical receipts](../mechanical-receipts-r01.json) only; did not open their writing records. No earlier findings, decisions, teaching notes, proposal or quality verdicts read.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Inspected the figures, tables and listings before reading the complete surrounding sections; first impressions below. |
| 2. Form fits the content | pass | Relations use real columns, key labels and relationship arrows; duplicated join rows are visible; histories distinguish pending lanes from committed tables. The lock-wait schedule uses aligned session columns. |
| 3. Readable at a glance | pass | Captions identify models and limits; SQL is short except the deliberately expandable fixture. Narrow tables and listings remain locally scrollable rather than widening the article. |
| 4. Interaction | finding | All choices and states work, including the instructor restart; keyboard focus remains at both ends. Phone stepping hides an essential lane in transaction Figure 2 (visual-4). Current hold durations checked from rendered timers, within the hidden-browser limit below. |
| 5. Themes and phones | finding | Both themes remain legible at desktop and 375 px; sampled figure/table/listing text pairs exceed 4.5:1. Phone controls work, but their distance from the race lanes causes visual-4. |

## First reading

Introduction:

- Figure 1 looked like five relations connected by cardinality strips, with order 103 referencing Mina and the mug/tea lines. The payments initially seemed disconnected because their order identities were absent from the order table; its caption explicitly identifies them as earlier orders and the tables as selected rows. The caption and text alternative agree with the shown values.
- The positive-quantity listing reads as one enforceable column rule. The order-value query reads as a customer/order/line join followed by a sum; its stated £29 result matches the shown line values.
- Figure 2 immediately shows each line value and payment twice. The expandable wrong query and repaired query make the separate aggregates visible. I did not mistake the four rows for four stored lines after reading the caption.
- Figure 3 reads as two buyers competing over one committed stock value. The stale option ends with two accepted order identities; the conditional option shows waiting, rechecking and refusal. Its short explanation stays near the controls on a phone and identifies the changing action.
- The complete order listing makes both stock checks and the application rollback branches visible. Figure 4 reads as an ordered write path, with recoverable commit preceding later data-page writes; its caption prevents treating this as a measured timeline.
- The evaluation matrix reads as requirements paired with evidence to obtain, rather than benchmark results. Its two columns remain usable on a phone.

Transactions:

- The starting class and reservation tables establish capacity, remaining places and ownership without decoding packed cells.
- Figure 1 reads as an accepted first click followed by a rejected second click. Separate commits visibly lose a place; the transaction option retains the committed counter while describing the pending decrement. The longer pending explanation resolves that distinction. The figure alone does not name the unique pair causing the rejection, but its preceding section does.
- The unsafe listing makes the literal overwrite visible. Figure 2 reads as the same last-place comparison, with accepted reservation identities as well as a counter. All five states are meaningful. At phone control position, however, the waiting/recheck lane disappears while the nearby explanation omits it.
- The conditional CTE and comparison listing distinguish a complete booking statement from a conditional update alone. The lock-wait schedule clearly separates the old command snapshot from the later fresh count; its session columns stay readable at 375 px.
- Figure 3 reads as two independent instructor departures. Repeatable Read ends with two false values; Serializable rejects one commit and adds a new-decision restart state. The departure listing makes the count-before-update decision visible.
- The expandable schema, observed-outcome table and final counter-check query form a readable fixture/results/check sequence. The results table remains a comparison on a phone, with no clipped sentences.

## Findings

### visual-4 · medium · transactions, Figure 2, phone stepping at 3/5 and 4/5

Problem: After pressing Next at 375 × 812, the lane carrying the protected mechanism is above the viewport. At conditional step 3, “Conditional UPDATE waits” is at y = −104 px; the controls are at y = 383 px. The explanation beside them only says “Mina’s changes are pending. Other ordinary readers still see the committed 1.” At step 4 it says only that Mina commits and the committed counter becomes zero; Tariq's “Wait ends; condition rechecked” is again above the viewport.

Effect: The phone reader sees the table/explanation change but misses the waiting and recheck which distinguish Conditional change from the stale overwrite. They must scroll upwards after stepping, then return to the controls, to follow the comparison. This is a reading interruption, not a false result.

Suggestion: Keep the active action for both lanes near the controls, either by making the phone figure substantially more compact or by including the wait/recheck in the control-adjacent step explanation. Preserve the distinction between pending work and committed rows.

Evidence: Reproduced after the coordinator stopped shared browser activity, with explicit 375 × 812 viewport and theme confirmation. Dark-theme step 3 had the waiting lane wholly above the viewport (23 px high, ending at −81 px), while the explanation and Next were visible. Light-theme step 4 reproduced the missing recheck at the same reading position. The introduction's mug figure demonstrates a usable nearby explanation for the equivalent wait.

## Coverage and limits

- The introduction's two five-state choices and transactions' six choices (4/4, 5/5, 4/5 states) were stepped completely at desktop and 375 px in both themes: 148 rendered state checks in total. Used screenshots for fresh layout judgements and rendered DOM text/bounds for the complete state traversal. Inspected every static table/listing, expanded both SQL/fixture disclosures and all available figure text alternatives. Horizontal access to the wide order-line relation was operated with the keyboard.
- Operated Play/Pause for every option and checked each nonterminal state's rendered hold duration. Introduction holds range from 3.5–5.34 s. Transactions range from 3.765–7.905 s; the current Figure 1 pending text receives 7.905 s, and the instructor rejection before restart receives 7.14 s. These are fresh timer observations, not reuse of the old Figure 1 judgement. Text length and the changing fields fit these holds; pause remains available. Terminal states stop with Replay. Fresh keyboard traversal confirmed Back/Next retain focus with `aria-disabled=true` at the transaction endpoints; the mug figure uses the same observed control behaviour.
- Fresh computed foreground/background pairs for rendered text included ordinary values, muted captions, table headings and listing text. The weakest sampled dark pair was about 6.15:1; light muted text was about 6.61:1 on the page background. No faint NULL marker or dimmed data state appeared in these figures.
- Visible IAB mode is unavailable to a subagent. This was a hidden browser review: screenshots and manual steps were inspectable, but uninterrupted foreground playback and real finger gestures were not. Timings above come from current hold-bar transitions, not wall-clock animation impressions. Phone usability means a 375 px browser viewport, not a physical handset.
- The coordinator independently used the same browser origin earlier, changing shared theme/viewport settings. On receiving notice, I explicitly set and confirmed my intended viewport/theme and rechecked the finding and final state coverage after that activity stopped. Temporary viewport override was reset when finished.
- Reference comparison sampled the representative rendered figures named above, rather than independently operating every reference tool. Native database execution and technical correctness are outside this visual review; no build, server, article edit, commit or push was performed.
