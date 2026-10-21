# Visual review · article · relational introduction and transactions · A-r02

Inputs read: [A-r02 manifest](../repaired-r02-manifest.json), inheriting [A-r01 manifest](../repaired-manifest.json); fixed rendered introduction at `http://127.0.0.1:4341/review/relational-trial-3/` and transactions at `/review/relational-trial-3/transactions/`; rendered reference examples at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`. Applied `/private/tmp/staycurrent-skills-night-a-repair/.agents/skills/staycurrent-review/SKILL.md`, its `perspectives/visual.md`, and the neighbouring `staycurrent-figures/SKILL.md`. Read only the assigned [mechanical receipt](../mechanical-receipts-r01.json) and [current source-check receipt](../a03-evidence/r02-source-checks.json). Frozen source root: `/private/tmp/staycurrent-skills-night-a-repair`. No earlier findings, author narratives, decisions, reports or other candidates were read.

Highest severity: low

Review started: 2026-10-21 21:07:20 UTC  
Review ended: 2026-10-21 21:16:40 UTC

## Checks

| Check | Result | Note |
| --- | --- | --- |
| First reading alone. | pass | Every current figure, table and listing was inspected as an item before deliberately reading its surrounding explanation; the first interpretations are recorded below. All eight selectable histories were used. |
| Form fits the content. | pass | Relations use real column headings and separate tables; keys and relationships are marked; schedules keep participants in distinct columns or lanes. Values and identities remain consistent within the stated independent experiments. |
| Readable at a glance. | pass | Query listings are indented, small examples are bounded, numerical joins remain tabular, and committed rows are distinct from pending work. Long code and the widest relation tables scroll inside their frames on phones. |
| Interaction. | pass | All states and options were stepped, playback and terminal states checked, text alternatives opened, and first/last keyboard focus checked. Current timer observations and a fresh reading judgement are recorded below, with visibility limits. |
| Themes and phones. | finding | Light/dark text contrast passed the measured minimums; page width remained contained at 375 px. Figure 1 in transactions needs a little extra vertical movement to compare all changing areas at its longer phone states: visual-5. |

## First reading

These are the interpretations from looking at the items themselves, followed by reading them in place. The browser's initial accessibility output included surrounding article text automatically; I used the visual inventory and selected items for this first pass before deliberately reading that surrounding prose.

### Introduction

- **Figure 1, shop relations:** one accepted order is assembled from customer, order, line, product and payment facts. `PK`/`FK` and the small relationship drawings make the joins apparent. The five tables identify Mina as 1, order 103 as hers, P7/P3 as its two lines, and the product stock after acceptance. The payment rows initially looked detached from the single displayed order; the figure's own caption resolves this by explicitly naming earlier orders 101/102 and saying that the order/line tables show only 103. Its text alternative gives the same £29.00 order and no payment. This is a subset of a shop, not an assertion that its displayed payment keys are dangling.
- **The one-line quantity constraint:** a required positive quantity, shown as a column rule rather than a complete schema. No uncertainty about its form.
- **The order-value query:** join order 103 to its customer and lines, multiply quantity by price, and produce one grouped total. The aliases and grouping are visible in seven short lines.
- **Figure 2, line/payment fan-out table:** each of two line values repeats against each of two payment identities. Four joined rows are visibly different from two stored order lines. Its caption supplies the doubled £79.00 total and calls the rows an intermediate query result. The four real columns remain readable together at 375 px.
- **The two listings under “The wrong join, and the repair”:** the first aggregates after a many-to-many fan-out; the second produces one aggregate per order on each side before joining. The visual distinction is visible through the two subqueries and their matching `order_id`. Opening the disclosure reveals both complete examples in that order.
- **Figure 3, last blue mug:** two named buyers contend for stock 1. The “Read, calculate, write” option accepts 103 and 104 while stock says 0; “Conditional subtraction” makes Tariq wait, recheck and refuse 104. The displayed committed stock remains 1 during Mina's pending change, which the lane explains. The five steps of each option state new events rather than repeating the outcome. The text alternative states both histories.
- **The complete stock-taking protocol:** a transaction changes mug stock, checks its returned row, changes tea stock, checks again, and inserts the order and both lines before commit. The comments visibly label application decisions rather than pretending to execute them in SQL. Horizontal scrolling is needed on a phone for long lines; the page itself does not widen.
- **Figure 4, write path:** a compact ordered path from finding P7 to the in-memory change, durable WAL and later data-page write. It reads as an ordered schematic explanation, not as a measured latency chart. Its caption explicitly says illustrative and unmeasured and names the omissions. The memory/log/data-file distinction is simpler than the reference storage figure's explicit memory/disk drawing, but remains adequate for this introduction's four stages.
- **“What would make this shortlist defensible?” table:** requirements paired with the evidence needed to test them. Each column holds one kind of content. The two-column form stays readable at phone width, including wrapped sentences and links.

### Transactions

- **Starting classes and reservations:** Tea tasting has the last place; Mug painting has capacity 3, remaining 2 and Tariq's R7. The two actual tables and their `class_id` relationship show the counter/owner split. The owner IDs refer to the customers identified immediately beside the example.
- **Figure 1, rejected double click:** a first accepted R10 is followed by Mina's duplicate R11. Separate commits consume a place without a second reservation; one transaction rolls back the second decrement. At the protected pending step, the second lane says its decrement is pending while committed remaining stays 1 and R7/R10 stay displayed. The longer explanatory sentence explicitly names both tables, removing any need to infer whether they show pending or committed values. All four states in each mode are distinct.
- **Unsafe booking SQL:** both callers write a previously calculated zero, then insert different reservations. The precondition comment and the differing R8/R9 identity are apparent. It is labelled unsafe, not presented as a recommended complete protocol.
- **Figure 2, last class place:** reads are evidence, not ownership. Mina's pending decrement leaves the committed table unchanged. The overwrite option subsequently admits both reservations; the conditional option visibly waits, rechecks the changed row and creates no R9. The state tables use separate real columns, and the caption/footnote identify a selected illustrative schedule rather than a live database run. All five states in each mode are meaningful.
- **Conditional update/insert SQL:** a returned class row feeds the reservation insert. The layout makes the dependency through `taken` visible; no returned row means no inserted reservation. It is presented as one statement.
- **Optimistic-comparison SQL:** update only if the old value remains 1. Its three-line form communicates a comparison step. The surrounding qualification says it still needs ownership recorded in the same transaction.
- **Count-before/after-lock-wait schedule table:** a numbered schedule with Mina and Edda in separate columns. Edda's initial command retains count 1, but a subsequent command sees count 2 and refuses R14. The caption fixes capacity 2 and the starting R7, so this variation does not silently reuse capacity 3. The three-column schedule remains legible at 375 px, although it grows vertically.
- **Figure 3, instructors:** each transaction counts two but changes its own row. Repeatable Read commits both departures and leaves both availability values false. Serializable rejects Ravi's selected commit, then its fifth step explicitly restarts the count and keeps him available. The figure says another schedule may choose another victim. The text alternative preserves that comparison; the terminal state is the reconsidered decision, not just an error.
- **Serializable departure SQL:** count first, conditionally change Lena, then commit. The conditional comment is recognisable as an application branch. The code is short enough to scan as one decision.
- **Engine-contract comparison:** labelled blocks distinguish PostgreSQL, MySQL/InnoDB and SQLite instead of squeezing long explanations into a wide comparison table. Names and scope stay visible.
- **Exact-schema disclosure:** four tables, their key/constraint declarations and the starting inserts. It is long because it is the reproducible fixture, and is sensibly collapsed until requested. Its order creates referenced relations before inserting the dependent reservations/instructors. I inspected the displayed listing; I did not execute it.
- **Native worksheet results table:** forced case paired with observed result. Its title and preceding text distinguish these recorded native results from the interactive models. Two columns remain readable on a phone. The rows cover the unsafe and protected outcomes without combining several unrelated value types in one column.
- **Final reconciliation query:** grouped per-class count and equality check, with the left join retaining classes with no reservations. Its format makes `reserved` and `agrees` visible as output names. This is a diagnostic query, rather than a substitute for the transaction protocol.

### Reference comparison

I opened all three prescribed rendered reference articles. The comparison included the sequence example's “Who is waiting” figure, the indexes example's “Building an index on customer_id” figure and the storage example's write-ahead-log figure, with their rendered figure inventories/labels available beside them. The current articles retain the useful qualities of those examples: a concrete repeated identity, one question per visual, controls attached to a defined state, and a stated distinction between a model and measurements. The current tables are generally more direct than turning small database relations into a drawing. The instructor comparison also earns its interaction because its final protected step teaches a different decision after restart.

## Interaction, layout and timer observations

The current rendered state matrix was exercised at **375 × 812** and **1280 px desktop width**, in **Light** and **Dark**. Each of the introduction's two five-step options and all six transactions options was stepped in every width/theme combination: atomicity 4 + 4 states, booking race 5 + 5, and staffing 4 + 5. No interactive figure had `scrollWidth` greater than its frame's `clientWidth`. Both documents retained a 375 px document width on the phone. The broad `order_items` and `payments` tables and long SQL lines use local horizontal scrolling; their column names stay intact. The join-result table fits without that extra movement.

All eight options were also started with Play in the IAB and left running while the reference comparison proceeded. Protected atomicity, booking and staffing, the unprotected atomicity/staffing options, and the protected mug run were observed at Replay; the last explicit automatic-playback samples of the overwrite booking/mug runs were their fourth states. Their terminal outcomes were directly checked by manual stepping. Play/Pause was used directly on the current mug and atomicity figures. Keyboard Enter was used for forward/backward stepping; focus remained on terminal Next with `aria-disabled="true"`, including staffing's fifth Serializable step, and on initial Back with `aria-disabled="true"` for all four tools. Reset restored the starting rows. Every figure's text alternative and the two code/schema disclosures opened successfully. The assigned unchanged-mechanics receipt supports the remaining shared-control details; the shared stepper hash was independently confirmed as `c308058a03fe9893d3cb7342a14471fcc1bc9aeface1de78a06c3f119d0239cf`.

Actual current rendered hold styles observed during playback included:

| Tool and state | Rendered hold observed |
| --- | --- |
| Introduction mug, initial state | 3500 ms |
| Introduction mug, conditional state 2 | 6690 ms |
| Introduction mug, overwrite state 4 | 6600 ms |
| Transactions atomicity, initial state | 4305 ms |
| Transactions atomicity, continuous state 2 | 5970 ms |
| Transactions atomicity, protected pending state 3, observed in Chrome | 9480 ms |
| Transactions booking race, initial state | 4845 ms |
| Transactions booking race, continuous state 2 | 6780 ms |
| Transactions booking race, overwrite state 4 | 7995 ms |
| Transactions booking race, conditional state 4 | 9750 ms |
| Transactions staffing, initial state | 5070 ms |
| Transactions staffing, continuous state 2 | 8220 ms |
| Transactions staffing, Serializable state 4 | 9030 ms |

These are observations of the live page's hold-bar timer styles, not measurements of uninterrupted visible elapsed playback. I read the changed lane text, values and explanations afresh. The holds provide reasonable reading time for their current changed content: notably the atomicity pending explanation has 9.48 seconds, and the longer conditional recheck explanation has 9.75 seconds. Terminal outcomes remain displayed. The supplied source-check receipt's expected holds were not counted as rendered observations and its numbers did not replace this judgement. Starting Play from a manually selected state can have a different hold from arriving through continuous playback; the 5070 ms atomicity state-2 resume observed during the Chrome check is not the 5970 ms continuous transition above.

Computed foreground/background contrast for rendered text within figures, tables, listings and the engine comparison was measured in both themes, including currently changed/underlined states, captions, boundaries and disabled endpoint labels. The lowest sampled introduction pair was **6.03:1 in light** and **6.15:1 in dark**; transactions was **6.61:1 in light** and **6.83:1 in dark**. These exceed 4.5:1. No NULL marker or dimmed row appears in these two pieces. Focus indication was visible. Tables and code remain readable in the screenshots; code uses local scrolling on the phone instead of breaking identifiers across lines.

## Findings

### visual-5 · low · Transactions, Figure 1 at phone width

Problem: The duplicate-click comparison is slightly taller than a phone viewport from the top of its request lanes to the bottom of its controls. At 375 × 812, “One transaction” step 3 spans about 853 px and step 4 about 847 px across those areas. A reader cannot keep both full lanes, both committed tables, the explanation and all controls on screen together.

Effect: Comparing the pending decrement with the committed counter requires a little vertical movement. The explanation and manual stepping still make the state understandable, so this is a small usability cost, not a blocked argument or a contradictory outcome.

Suggestion: Reduce the vertical gaps between the two small tables and the relationship label, and/or keep the controls and counter on one compact row at phone width. Preserve the real table headings and the explicit pending/committed explanation.

Evidence: Fresh Chrome CUA review with `innerWidth = 375`, `innerHeight = 812`; DOM rectangle readings gave lane-to-controls spans 852.953125 px at protected step 3 and 847.1875 px at protected step 4 in both themes. The phone screenshots showed the lower table, explanation and controls with the upper request lanes above the viewport. No horizontal figure overflow occurred.

## Limits

- IAB visibility is unsupported in a subagent thread. The initial attempt to open a visible pane failed. Subsequent IAB playback therefore used a hidden pane, which can throttle animation and return stale screenshots. I assessed its timers through the actual rendered timer styles and state changes; I do not certify uninterrupted foreground playback or exact wall-clock dwell times.
- The IAB viewport capability returned success for 375 × 812 but left existing and newly opened tabs at 1280 × 720. Those attempts were not counted as phone checks. I switched to the available Chrome CUA extension, whose viewport reported 375 × 812 and produced actual phone screenshots. Chrome screenshots could retain a scaled surface after navigation; resetting and reapplying the documented viewport override restored the proper screenshot. The report's phone layout judgements use the corrected Chrome rendering and independently checked DOM dimensions.
- Current source/component hashes were checked only in the frozen archive. The shared stepper, transaction figure shell and shop table shell match the supplied receipt/manifests; the current transaction model hash matches the A-r02 manifest. No main-workspace article source was substituted.
- The two permitted mechanical inputs were the only prior proof used. The current source-check file explicitly contains calculations, not browser timing evidence. Its unchanged-native-SQL statement helps establish scope, but I did not independently run a database, execute listings, test a power cut or review the underlying native execution receipt. This is a visual review, not a renewed claim that the illustrative controls execute PostgreSQL.
- Reference comparison sampled representative rendered figures and their labels; it was not a fresh review of every reference interaction.
- No source edits, builds, servers, agents, commits or pushes were made. Only this report was written. Temporary review tabs were closed and viewport overrides reset.
