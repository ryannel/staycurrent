# Visual review · article batch · r03, r05, r06, r07, r09, r13 · batch02-v01

Inputs read: the [frozen manifest](v01/manifest.json); the six current rendered articles and their isolated figures on port 4384; the rendered drawings and tables from the three fixed references on port 4350; the visual perspective, figures skill and render checks; permitted mechanical colour/provenance records. No article source, plans, writer notes, earlier versions, reports or decisions were consulted. Administrative information about other perspectives was disregarded.

Highest severity: medium.

The observations below were made independently before the interrupted download check. Later coordinator-operated observations are identified separately. Raw state readings, screenshots, geometry and methods are in [visual-evidence](visual-evidence/review-methods.json).

## Checks

### r03 · Constraints and tenant boundaries

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | incomplete for hidden SQL | Visible code, three tables and the figure were read alone; all eight figure states were used. The initially closed deferred-reference SQL was missed before prose; root owns fresh narrow coverage of that facet. |
| 2. Form fits the content | finding | The shared shop ID and both reference paths are visible; parent-key component names require decoding the tuples (visual-1). |
| 3. Readable at a glance | pass | Tables and shown SQL are legible at desktop and phone widths; matching and missing parents are named in words. |
| 4. Interaction | pass within stated limits | Both cases and all steps agree; native keyboard endpoint focus, Back, Reset, Replay, Pause and the text alternative work. Browser saving is unverified. |
| 5. Themes and phones | pass | Fresh 1280×720 and 375×812 comparisons in both themes; no page/figure overflow. Applicable colour-pair receipts meet the required contrast. |

### r05 · Joins and the meaning of a result row

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures, both standalone result tables and all six SQL examples read before article prose. Both modes of each tool used. |
| 2. Form fits the content | finding | Four joined result rows are presented as separate cards instead of a comparable table (visual-1). |
| 3. Readable at a glance | finding | The repeated contributions must be assembled across cards; the instruction to read down an amount does not match the desktop arrangement (visual-1). |
| 4. Interaction | pass within stated limits | The two pairing shapes and ON/WHERE results agree with their explanations; keyboard selection and text alternatives work. Browser saving is unverified. |
| 5. Themes and phones | finding | Light/dark text remains legible and the layout fits, but the pair cards make the phone figure unnecessarily long and harder to compare (visual-1). |

### r06 · Aggregates, windows and ordered results

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures, the standalone aggregate table and all eight SQL examples read alone; two result shapes and all six frame/current-row combinations used. |
| 2. Form fits the content | finding | Figure 1 packs the input into a sentence and omits customer identity from the window table (visual-1). |
| 3. Readable at a glance | finding | The partition membership must be reconstructed rather than seen beside each retained order (visual-1). |
| 4. Interaction | pass within stated limits | Shape switches, all frame/current-row results, native keyboard selection and text alternatives agree. Browser saving is unverified. |
| 5. Themes and phones | pass | Fresh light/dark phone and desktop comparisons; current-row and included/outside labels remain legible. Applicable contrast samples pass. |

### r07 · Pagination and consistent exports

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures and all three SQL examples read alone; all six continuation combinations and both four-step snapshot schedules used. |
| 2. Form fits the content | pass | The ordered ID strip makes movement visible; reader and current committed views are explicitly separated. |
| 3. Readable at a glance | pass | Saved boundary, second response and current explanation remain identifiable together at phone width. |
| 4. Interaction | pass within stated limits | All 14 states agree; current playback, Replay/Pause, Back/Reset and native endpoint focus checked. No old r07 controls receipt was reused. Browser saving is unverified. |
| 5. Themes and phones | pass | Both themes inspected at verified phone width and desktop; no figure/page overflow; applicable colour samples pass. |

### r09 · SQL at the application boundary

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures and all seven code examples read alone; all 24 outcome/step states used. |
| 2. Form fits the content | pass | Separating fixed SQL structure from two values is clear; the pool/request drawing makes the session's ownership and transaction state explicit. |
| 3. Readable at a glance | pass | Status words and explanations distinguish active, failed, idle and broken states. Code preserves Python indentation and uses local horizontal scrolling at phone width. |
| 4. Interaction | pass within stated limits | All outcomes agree with their explanations; Back/Reset, Replay/Pause, native endpoint focus and the paths disclosure work. Browser saving is unverified. |
| 5. Themes and phones | pass | Initial states inspected independently in both themes and widths; coordinator warning-state screenshots and raw colours inspected after browser loss. Text contrast minima are 6.6076:1 light and 6.8298:1 dark. |

### r13 · Transactions and isolation

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures, two standalone tables and both SQL examples read alone; all eight snapshot states and twelve instructor states used. |
| 2. Form fits the content | pass | Logical views distinguish stored state from a report's read; instructor decisions remain separate from the shared committed rows. |
| 3. Readable at a glance | pass | Counters, read labels and committed/planned/rejected outcomes agree. Phone columns remain legible without horizontal overflow. |
| 4. Interaction | pass within stated limits | All states and native keyboard endpoints, Back/Reset and Replay/Pause passed independently; coordinator opened both text alternatives, whose contents agree. Browser saving is unverified. |
| 5. Themes and phones | pass | Initial views inspected independently in both themes and widths; coordinator screenshots confirm legible rejected/fresh-attempt phone labels. Current-source contrast receipts pass. |

## First reading

These readings precede article prose. They describe what the media appeared to show, rather than a verdict on the article's technical completeness.

### r03

- The quantity definition and four-attempt table show that positive quantities pass; zero and negative quantities fail; NULL needs the separate required-value rule. The named constraint makes the refusal recognisable.
- The primary-key fragment names the pair that must be unique. The two-writer schedule makes a separate preflight check insufficient, then shows one writer waiting and being refused after the other's commit. Empty schedule cells read as inactivity, not missing values.
- The product-reference fragment requires an existing product. The cascade fragment and deletion-actions table compare the parent's possible deletion effects; these are different policies rather than different spellings of one action.
- The tenant CREATE TABLE example uses the same shop column in two composite references. The three small declarations make the two parent identities and the line identity visible.
- Figure 1 follows one line's shop ID into the order and product keys. Shop 10 finds both; shop 20 finds the Copper mug but no matching order. The warning is explicit, and the caption identifies an illustrative matching process. The parent tuples' component names have to be recalled from the line/schema rather than read over their cells.
- The deferred-reference disclosure was still closed at this stage; its hidden SQL was not part of this blind first reading.

### r05

- The first SELECT and order/customer table attach a name to each order without collapsing Mina's two orders.
- Figure 1 shows two lines and two payments becoming four pairings, producing doubled sums. Switching to totals first changes the answer to one pair of 39.50 totals. The amounts are understandable, but separate result cards make it hard to follow a single column through all four pairings.
- The deliberately wrong SUM query adds those detailed matches. The longer CTE query first builds one total per side, then combines them. The still-due table exposes unpaid order 103 and distinguishes order total, paid and due.
- Figure 2 and its SELECT show that the card condition in ON retains the unmatched order with NULLs, while WHERE removes it. The changed row count is immediately visible.
- The EXISTS example asks whether each customer has an order, without multiplying customers. The NOT EXISTS example asks whether an order has no payment. Their correlated matching conditions are visible and their indentation makes the inner query easy to separate.

### r06

- The first aggregate query and table turn five lines into three order totals. The following CTE names that derived order input. The count example compares total joined rows with actual non-missing order keys. The HAVING example groups order values before testing a customer total.
- Figure 1 switches between two customer groups and three retained orders. The repeated 68.50 is clearly described as one customer total repeated. However, the input is a parenthesised sentence and the retained rows have no customer column, so I have to reconstruct which two orders share a partition.
- The window-sum query puts a customer total beside each order. The LAG query explicitly orders within each customer's partition, separately from final display order.
- Figure 2 shows five ordered rows, identifies the current row and marks membership. At 105 the default peer frame counts five and the ordered ROWS frame counts four; at 106 both count five. The whole partition also counts five. The corresponding SQL exposes both frame and tie-breaker choices.
- The last ROW_NUMBER example deliberately orders ties and filters outside the numbered result to retain one latest order per customer. The nesting and order of the operations are readable.

### r07

- The first query skips two ordered rows. Figure 1 has already delivered 101 and 102, then changes the eligible order strip. Offset skips the wrong rows after cancellation; key continuation preserves the boundary but still misses an order moved behind it. I could read the outcomes from the controls and strip without article prose.
- The tuple-boundary SQL uses time and order ID together, visibly retaining a time peer after 105.
- Figure 2 separates the reader's eligible rows from current committed rows. Following a writer's cancellation makes a fresh statement return 105/106, while a fixed snapshot still returns 103/105. The two views remain distinct and the writer's commit is not presented as undone.
- The export SQL keeps a count and batched cursor reads in one read-only Repeatable Read transaction. Begin, declaration, fetch, close and commit appear in usable order; the repeat-fetch comment is explicit.

### r09

- The unsafe concatenation and bound-query examples contrast incoming text becoming command syntax with occupying one value slot. Figure 1 holds the SQL structure fixed while P7 and the hostile-looking whole value produce different product matches. Its apparent meaning is unambiguous.
- The identifier example maps permitted sorts before composing a quoted SQL name. The authorised-customer lookup distinguishes no visible row from a result to unpack.
- The pool example visibly nests a transaction within the connection's borrowed lifetime. Figure 2 then follows that same C through success, application refusal, statement cancellation and connection loss. I initially wondered whether showing C's status inside the request before borrowing implied ownership; the explicit “Not started”, borrow arrow and subsequent ownership step resolve the drawing as a lifetime/status model.
- The reservation helper treats zero returned rows as an application failure that must leave the transaction. The timeout example scopes its setting and purchase inside the transaction. Python indentation and the order of the contexts remain clear.

### r13

- The stock-effects table separates the amounts taken from the before/after stock. The conditional UPDATE combines a stock test and reduction within the purchase transaction.
- Figure 1 retains two labelled logical views of P7. The Read 1 and Read 2 labels show whether the second result belongs to the older view or the newer committed state. Read Committed finishes at 0, Repeatable Read at 1, while current stock is 0 in both final states. The caption prevents interpreting the columns as elapsed time or physical pages.
- The instructor SQL reads the count before deciding whether to change its own row. Figure 2 keeps each person's read and decision separate from the shared rows. Repeatable Read can reach zero instructors; Serializable rejects one attempt, then shows a fresh read, changed decision and committed fresh attempt. The three latter states are distinct in both result and explanation.
- The final table compares needs, designs and application obligations. Its rows make the protection a choice about the required rule, rather than a universal ranking of isolation names.

## Findings

### visual-1 · low · r03, Figure 1 parent rows

Problem: The child line has real column headings, but Orders and Products reduce their parent keys to unlabelled tuples such as `(10, 103)` and `(20, P7)` beside a name.

Effect: A newcomer must carry the positional meaning of the parent key from the preceding schema into the drawing, rather than compare the same named shop column on both sides. The matching remains understandable, so this is local polish rather than a failure of the explanation.

Suggestion: Give each parent relation short named columns for the shop and its parent ID, retaining the whole-key outline or matching marker.

Evidence: [isolated desktop first reading](visual-evidence/r03-first-figure-1.png), [phone light](visual-evidence/r03-phone-light-figure-1.png), and all current states in [the raw control record](visual-evidence/current-controls.json).

### visual-1 · medium · r05, Figure 1 “Two lines meet two payments”

Problem: The four joined result rows appear as four cards, each repeating two field labels. At desktop they form a two-by-two grid, so the explanation's “Read down either amount” does not offer one line-amount or payment-amount column through all four rows. On the phone the cards become a long stack.

Effect: The reader must reconstruct a relation from separate panels before seeing which contributions repeated. That reconstruction is precisely the work this figure should make visible: why two independent many-sided inputs produce four rows and why summing those rows doubles each contribution. The numbers are correct, but the form spends effort on decoding the result.

Suggestion: Show the two inputs as small relations and the four pairs as one four-row result table with line identity, payment identity, line amount and payment amount under shared headings. The totals-first control can replace those rows with one comparable row.

Evidence: [desktop light](visual-evidence/r05-desktop-light-figures.png), [phone light](visual-evidence/r05-phone-light-figure-1.png), [phone dark](visual-evidence/r05-phone-dark-figure-1.png). Fresh switching confirms that the 79.00/79.00 and 39.50/39.50 results themselves agree with their explanations: [control record](visual-evidence/current-controls.json).

### visual-1 · medium · r06, Figure 1 “A total beside a group, or beside each order”

Problem: The input relation is compressed into “orders 101 (Mina, 39.50), 102 (Tariq, 40.00), 103 (Mina, 29.00)”. In the window state the output table shows Order, Value and Customer total, but omits the customer that defines each partition.

Effect: To see why orders 101 and 103 receive the same total while 102 does not, the reader must decode and retain the parenthesised input sentence. The grouped result is visibly organised by customer; the window result hides the very relationship that is meant to remain beside the original rows. This weakens the comparison at its central teaching point.

Suggestion: Put the input orders under Order, Customer and Value headings, and keep Customer beside each retained window row. Consistent grouping marks could then connect the two Mina orders to the single grouped total without relying on memorised associations.

Evidence: [desktop first reading](visual-evidence/r06-first-figure-1.png), [phone light](visual-evidence/r06-phone-light-figure-1.png), and the current window table in [keyboard/control observations](visual-evidence/more-controls.json). The arithmetic and both mode explanations agree; this finding concerns their visible organisation.

No critical findings. No additional findings for r07, r09 or r13 on the independently completed checks.

## Evidence and reuse

The reference comparison concerned the drawings' reasoning. Sequence diagrams Figure 1 names each participant and labels the messages on the actual path; Figure 2 connects waiting status with that same path. Indexes Figure 2 aligns like index values and connects their entries back to the relevant table rows, making repeated keys and different row identities directly comparable. Storage Figure 3 keeps the old value and the reader marks visibly attached to the versions they concern. That standard is met by the current frame-membership table, the two snapshot views and the ownership path. It is the reason for asking the joins and group/window figures to expose their row relationships directly. The reference screenshots/contact sheets are retained in `visual-evidence/reference-*`.

- [Current figure states](visual-evidence/current-controls.json) record every meaningful state combination, without using old control verdicts. [Additional controls](visual-evidence/more-controls.json) record keyboard endpoints, retained focus, Replay/Pause and opened text alternatives.
- [Phone geometry](visual-evidence/phone-records.json) records actual 375×812 dimensions on every tested page, document width 375 and figure widths within the page. Several code blocks have local horizontal scrolling; this was not mistaken for page overflow. Screenshots in both themes were read, not merely measured.
- [Desktop records](visual-evidence/articles-desktop.json) and [desktop light records](visual-evidence/desktop-light.json) accompany fresh full-page screenshots and figure crops at 1280×720.
- Contrast reuse is limited to the frozen colour pairs: [r03](v01/mechanical/r03/contrast.json), [r05](v01/mechanical/r05/final-contrast.json), [r06](v01/mechanical/r06/final-contrast.json), [r07](v01/mechanical/r07/final-contrast.json), and [r13 owner receipt](v01/mechanical/r13/owner-qa/receipt.json). Their component/data hashes are identified by the frozen manifest and the supplied source manifests/hashes. [Receipt hash checks and independent numerical recomputation](visual-evidence/contrast-reuse.json) confirm the supplied r05/r06/r07 samples. [Current r09 warning-state text contrast](visual-evidence/r09-coordinator-contrast.json) and [graphical boundaries](visual-evidence/r09-coordinator-borders.json) use the coordinator's computed RGB/opacity observations, independently calculated by this reviewer. Essential r09 boundaries exceed 6.03:1 in light and 6.14:1 in dark; the faint outer enclosure is decorative, with ownership carried by named boxes, the session bar, transfer direction and words. The samples use computed rendered colours and WCAG relative luminance; they are not antialiasing measurements. Prior layout/control conclusions were not reused as current visual verdicts.
- [Direct HTTP checks](visual-evidence/http-downloads.json) verify 200 responses and exact frozen hashes for all seven observed experiment/data hrefs across the six articles, using Python 3.14.5 and a five-second request timeout. This establishes served bytes only.

## Coordinator-operated completion

The coordinator operated the browser on the unchanged frozen preview after this worker lost access. This reviewer read the [raw rendered observations](visual-evidence/coordinator-visual/observations.json) and inspected all supplied screenshots; these are current UI observations, not another perspective's quality verdicts.

- Full final Sources disclosures for all six articles were read. The r05/r06 “Download the SQL experiment” anchors are present and their disclosures open with native Return: [r05](visual-evidence/coordinator-visual/r05-sources.png), [r06](visual-evidence/coordinator-visual/r06-sources.png). The provisional article-only absent-anchor observation is withdrawn; there is no missing-download finding.
- Both r13 text alternatives open and contain the eight snapshot and twelve instructor steps. They agree with the independently used current states. Serializable states 4, 5 and 6 remain distinct on the phone; the rejected and fresh-attempt diagrams are readable: [step 4 dark](visual-evidence/coordinator-visual/r13-serializable-step4-phone-dark-diagram.png), [step 5 light](visual-evidence/coordinator-visual/r13-serializable-step5-phone-light-diagram.png).
- Native keyboard operation selects “Connection lost” in r09 and the moved-order/key-boundary choices in r07. Their results and explanations agree with the selections. The r09 broken/cancelled phone screenshots remain legible: [broken step 4 light](visual-evidence/coordinator-visual/r09-broken-step4-phone-light.png), [broken step 6 dark](visual-evidence/coordinator-visual/r09-broken-step6-phone-dark.png), [cancelled step 4 light](visual-evidence/coordinator-visual/r09-cancelled-step4-phone-light.png). Raw colour ancestry has no non-unit text opacity in these samples; the independent text-contrast calculation passes.
- The r03 deferred-reference disclosure opens by native Return. Its declarations are short and correctly ordered as shown; at actual 375×812 the SQL has client/scroll width 343 and remains readable: [opened context](visual-evidence/coordinator-visual/r03-deferral-phone-light-top.png), [complete code and explanation](visual-evidence/coordinator-visual/r03-deferral-phone-light-code.png). This later observation closes the readability/control check, not the blind-first-reading gap.
- The coordinator supplied later reference states and the complete table text. This reviewer inspected their pixels, including the buffer slots, old-version cleanup, lost commit, later page write and durable flash result, plus the ordered/random key fill comparison. Three nominally settled screenshot files restarted at their first step. The corrected [crash recovery](visual-evidence/coordinator-visual/reference-storage-8-settled-current.png), [asynchronous commit](visual-evidence/coordinator-visual/reference-storage-10-settled-current.png) and [full-range page visits](visual-evidence/coordinator-visual/reference-indexes-6-settled-current.png) captures visibly show their terminal states and explanations. All 34 drawings and the rendered tables across all three references have now been inspected for calibration.
- The coordinator restored its own fallback tab to actual 1280×720 with System selected and resolved dark, then reset the temporary override and closed that tab. Reference-origin theme settings were unchanged. The unavailable worker tab could not be addressed from the resumed session; no unrelated tab was closed by guessing a worker-local ID.

- A fresh [r09 playback record](visual-evidence/coordinator-visual/r09-playback.json) shows automatic progress from 1/6 to 6/6 across 30,917 ms. The first 15-word explanation has a computed 4.305-second progress transition, which permits reading it; Replay followed by Pause retains the identical first state across separate page-clock observations 51,491 ms apart. This supports automatic progression and a stable pause, without asserting the exact dwell of every later step. The coordinator reset the figure and closed the new timing tab after restoring actual 1280×720, System and resolved dark.

## Limits

- r03's deferred-reference SQL remained closed during the initial isolated first reading. Its later readability/control check cannot recreate a blind first impression. Root will arrange fresh narrow coverage of that missing facet separately.
- A browser download-event call started at 01:01:56 UTC and produced no result until it was interrupted around 01:29 UTC, despite its bounded timeout arguments. Roughly 27.5 minutes were stalled tool time, not additional review effort. No browser download-event, file-path or save success is claimed. No such wait was repeated. HTTP byte equality and headers do not settle browser saving.
- After resumption, the worker's browser 3 was unavailable. A single browser inventory showed no IAB session accessible to this worker. The coordinator therefore operated the listed remaining UI actions under the visual skill's fallback. Worker tab IDs are session-local; the worker could not restore/close its unavailable tab and the coordinator was not asked to close an unrelated tab by guessing its identity.
- Hidden-window playback is not a foreground timing benchmark. Fresh r07 automatic progression was observed from step 2 to its terminal state with page-clock timestamp reads, and Pause/Replay were used. A longer asynchronous DOM timing read timed out; no precise per-step timing claim is based on it. The separate current r09 observation above establishes progression and its initial explanation hold; it does not measure every later dwell. No old r07 control verdict was substituted.
- No reduced-motion or colour-vision simulation, native database rerun, production access-policy test or performance measurement was performed in this visual perspective.
