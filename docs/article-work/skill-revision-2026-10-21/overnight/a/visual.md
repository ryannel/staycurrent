# Visual review · article · trial-3 a00 and a03 · initial 80276a4

Inputs read: frozen visual perspective and figures skill using `git show 80276a4`; rendered introduction and transactions at port 4340; rendered Sequence diagrams, Indexes and Storage and durability references; authorised initial `a00-writing.md` and `a03-writing.md` mechanical evidence. No earlier review, decision, result report or proposed repair was read. The writing records include authors’ descriptions of their teaching choices; figure-only impressions below precede reading the surrounding rendered prose, but are not blind to those descriptions.

Highest severity: medium.

Start: **2026-10-21 20:32:25 UTC**. End: **2026-10-21 20:38:21 UTC**. Elapsed: **5 minutes 56 seconds**. Preview dependency interval: start to coordinator’s restored-server timestamp **20:33:47**, 1 minute 22 seconds; this includes useful instruction/evidence reading, so is not entirely idle waiting. Initial browser attempts met connection refusal and then a missing frozen registry import; coordinator restored it. I did not start a server, build, edit content, commit or push.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Inspected figure/table/listing content apart from surrounding rendered prose, then in place; initial uncertainty recorded below. |
| 2. Form fits the content | pass | Actual relation rows, column headings and keys; cause-changing options earn interaction; static joins, code, comparison cards and evidence tables suit their content. |
| 3. Readable at a glance | finding | Atomicity lanes change the request they describe; one spatial direction is wrong; root relationship chain has a dangling link at 375 px. |
| 4. Interaction | finding | All eight option histories inspected state by state using controls; results and committed/pending distinctions agree with prose, except the atomicity lane attribution. Unchanged shared keyboard/timing mechanics reused as detailed below. |
| 5. Themes and phones | finding | Both themes and 375 px/1280 px inspected. No document overflow; table/code overflow stays local. Root schema chain wraps awkwardly. Measured visible visual-text contrast exceeds 4.5:1. |

## First reading

- **a00 Figure 1:** five relations with distinct headings, identifiable keys and a small multiplicity chain. Order 103 joins Mina to its mug and tea lines. Payments initially look disconnected because their orders are absent; the caption explicitly explains that these are earlier orders. No incorrect relationship is implied after reading that boundary. At phone width the orders-to-lines connector ends one line before its target.
- **a00 quantity listing:** a required positive whole-number column. **Order query:** one order’s customer and sum of line values. **Wrong/repaired join listings:** direct detail-to-detail sum versus separate per-order totals; the disclosure makes their contrast findable.
- **a00 Figure 2:** repeated line/payment pairs make multiplication visible without animation. The caption gives the wrong total and distinguishes this result from stored rows.
- **a00 Figure 3:** one committed stock row, two buyers’ pending actions, then either two accepted orders or one refusal. The options meaningfully alter the outcome. The explicit committed label explains why stock remains 1 while Mina’s change is pending. **Complete order listing:** reserve mug, reserve tea, insert order/lines, commit, with application result checks distinguished from executed SQL.
- **a00 Figure 4:** a concise ordered explanation of finding/changing the row, making commit recoverable, and later data-page writes. It reads as an illustrative path rather than a measured trace. **Recovery and shortlist cards:** separate mechanisms/candidates rather than a cramped comparison grid. **Evidence table:** requirements paired with evidence still to obtain.
- **a03 starting tables:** class capacity/remaining and a reservation’s customer ownership, with the class-key arrow between them. Names are supplied nearby rather than inventing extra columns.
- **a03 Figure 1:** initially two requests from Mina; after R10 commits, the first lane unexpectedly starts describing the second decrement and R11’s rejection. I had to abandon lane identity and reconstruct the action from the explanation and tables. Both final arithmetic outcomes remain clear.
- **a03 Figure 2:** stale reads authorise two bookings, whereas a conditional change waits, rechecks and refuses R9. **Figure 3:** two instructor decisions modify different rows; one mode accepts zero availability, the other rejects a commit and shows a fresh decision that stays. Outcomes are visible in actual table rows.
- **a03 listings:** unsafe overwrite; complete conditional decrement-and-insert; explicitly partial optimistic comparison; instructor count/check/update/commit; disclosed schema/seed; independent invariant query. Formatting and labels distinguish their purposes and application branches. **Engine cards:** each names its contract; **native-results table:** forced case and observed outcome remain paired.

## Findings

### visual-1 · medium · a03 Figure 1, steps 3–4, both options

Problem: the first lane is headed “Mina’s request”, initially contains the R10 request and then “R10 committed”. At step 3 it instead says “Second decrement pending/committed”, while “Mina’s second request” says “R11 not yet inserted”. At step 4 the first lane says “R11 rejected: duplicate customer”; the second contains its rollback/consequence. These are actions from the same second request split across the two request lanes. This occurs at desktop and phone widths. Frozen source corroboration: `TransactionFigure.astro:10`, `model.mjs:54–55`.

Effect: a reader tracking one request per lane cannot follow which transaction changed or rolled back. They must infer the intended timeline from the explanation, in a figure whose lesson depends on keeping those boundaries clear.

Suggestion: retain R10’s completed result in the first lane and put the second request’s decrement, insertion failure and rollback in its own lane, or choose consistently labelled operation lanes.

### visual-2 · low · a03 Figure 1, One transaction, step 3

Problem: the explanation says “The table below still shows committed rows.” Both committed tables are above this explanation at both widths.

Effect: the reader searches in the wrong direction when reconciling the pending zero with the displayed committed one.

Suggestion: refer to the committed tables by name or use the correct direction.

### visual-3 · low · a00 Figure 1 relationship chain at 375 px

Problem: the chain renders `customers → orders →` on its first line, with `order_items → products` on the next. The `1 → many` link after orders is separated from its target; it is not a connected edge across the wrap.

Effect: the reader has to infer that the next line continues the relationship rather than starts a separate one.

Suggestion: keep each relationship and its two endpoints together, or give the phone layout explicit connected rows.

## Coverage, reused evidence and limits

Fresh current inspection covered all four a00 figures, its five SQL listings (including the two disclosed join listings), recovery/shortlist cards and evidence table; both starting a03 relations, all three a03 figures, all six SQL listings including disclosed schema, engine cards and native-results table. Every state of both a00 options and all six a03 options was read through actual Next/Reset/select controls. Text alternatives and boundary notes state outcomes and illustrative/native distinctions correctly. Captions and changing values were checked against their displayed states and adjacent prose. Rendered references were consulted for their labelled scenes, explanations and spatial presentation, particularly sequence waiting, index construction and WAL memory/storage separation; this was a comparison, not a fresh full reference audit.

Desktop was 1280×900; phone was 375×812. Both themes were inspected with screenshots and computed styles. Root and transactions document widths stayed equal to their viewport widths. Wide schema columns and code retain local scroll containers; phone lanes stack. Visible text in figures, tables, listings and comparison cards had minimum computed foreground/background ratios **6.03:1 light / 6.15:1 dark** in a00 and **6.61:1 / 6.83:1** in a03. This checks text, not decorative border contrast or a formal accessibility audit. No NULL/dimmed-row state exists in these trial figures. Changed text is underlined as well as emphasised.

Reused evidence, exactly:

- `a00-writing.md`, Rendered checks: Back/Reset, terminal option change, keyboard Enter stepping and focus retention on terminal Next (`aria-disabled=true`); Play/Pause and initial **3500 ms** hold transition. Its record explicitly does not establish uninterrupted foreground playback.
- `a03-writing.md`, Checks and browser evidence: all six keyboard endpoints, Play/Pause, focus retention, **4845 ms** initial and **6780 ms** subsequent race holds. Its record explicitly limits this to hidden-pane/timer evidence.
- Frozen byte identity was independently checked against original commit 80276a4 for shared `stepper.mjs`, a00 `Race.astro`/`model.mjs`, and a03 `TransactionFigure.astro`/`model.mjs`. They match. Thus unchanged keyboard/focus/hold mechanics were not repeatedly tested. Native-database and build passes in those records were not used as visual-quality evidence.

Invalidated/non-transferable evidence: prior overall “no defect” or readability judgements were not adopted; current content and responsive layout required the fresh inspection above. Old port numbers and HMR-interrupted authoring attempts do not establish current rendering. Native model passes cannot establish lane attribution or spatial usability. The initial failed server attempts establish no content defect.

Browser visibility API returned **false**, and creating with a visibility option reported that IAB visibility is unsupported in a subagent thread. Consequently all current screenshots/DOM checks were in a hidden pane. I do not claim smooth foreground animation observation or a new uninterrupted Play run for every option. Timing comes from the specifically reused timer evidence; manual state transitions were freshly inspected. No database behaviour was executed during this visual review. Viewport override was reset at completion.
