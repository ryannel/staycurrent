# Visual review · article batch · r00, r01, r02 · batch01-v01

Inputs read: [fixed manifest](v01/manifest.json); the three complete frozen rendered articles and their isolated figure routes on port 4370; all 34 rendered reference drawings (Sequence diagrams 1–13, Indexes 1–11, Storage and durability 1–10) and their rendered tables on port 4350; the review skill, visual perspective, figures skill and rendering checks. No context, source, author records, prior feedback or other reviews read.

Highest severity: **medium**. This is independent first coverage, not confirmation. Findings use separate numbering within each piece.

## Version, use and evidence

The manifest identifies `batch01-v01`, frozen 2026-10-23 at 23:39:05.372082 UTC, served from `/private/tmp/staycurrent-relational-batch01-v01`. First reference capture: 23:41:23 UTC; reference drawing captures completed by 23:41:54. Article reading and use continued through 23:51:44 UTC on 23 October (24 October in Stockholm). The exact capture times and page observations are retained in the evidence JSON files.

I used my own background tab. Initial reference study retained the inherited 1280 × 720, System → dark settings. The coordinator granted the QA lease before any changes. Article checks used 1280 × 720 and 375 × 812, light and dark. At 23:51:44 UTC I restored System → dark, reset the viewport override (1280 × 720), closed my tab and released the lease.

The isolated routes supplied the initial reading of every figure, standalone table and code example before article prose. I then read each complete article and revisited its visuals in place. The isolated BCNF disclosure contains only its summary; opening the full article established that its contents are prose, with no additional drawing/table/code to review.

Fresh state sweeps covered r00's 29 combinations (three customer selections; five query steps; five steps for each transaction ending; five unsafe-race and six conditional-race steps), r01's three comparisons, and r02's six predicates. These were exercised across all four width/theme contexts. See [states](visual-evidence/states.json), the `r00-*-audit.json`, `r01-*-audit.json` and `r02-*-audit.json` records and corresponding figure screenshots in [visual-evidence](visual-evidence/).

Fresh computed-colour checks included body text, captions, labels, selected controls, changing results, NULL/unknown markers and dimmed rows. They composite ancestor background colours, including browser-resolved `color(srgb …)` values, and account for opacity. Lowest recorded text ratios across states were r00 5.24:1 light / 5.71:1 dark; r01 and r02 5.24:1 light / 6.15:1 dark. No text failure was found. Meaningful green arrows, selection and change outlines remain distinguishable; matching labels and text explanations also carry their meaning. Decorative table dividers are not the sole carrier of a distinction.

After independent browser use, I read only these frozen mechanical receipts: r01 `contrast.json`, `browser-metrics.json`, `modelling-result.txt`; r02 `contrast-light.json`, `contrast-dark.json`, `native-results.txt`. Their provenance is the manifest's hashes and the author's recorded PostgreSQL 18.6 run. They support the rendered sample outputs and colour observations; they replace none of this review's visual reading or control use. Native execution was not rerun by this reviewer.

## r00 · Relational databases

Highest severity: **none**.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Four figures, two standalone data tables and five SQL examples read before prose. |
| 2. Form fits the content | pass | Actual customer/order/product/result tables expose the matching IDs. Private and committed transaction views and the race's event list suit their different questions. |
| 3. Readable at a glance | pass | Headings, values, joins and quantities remain readable. The compact labelled `Order · line` pair is explained by the preceding separate-column table in place. SQL is short and its query order is clear. |
| 4. Interaction | pass | All customer selections, query steps, transaction endings and both race schedules agree with their result and explanation. Boundary buttons retain keyboard focus. Playback advances and Pause stops it. Text alternatives cover the complete alternatives. |
| 5. Themes and phones | pass | Figures fit 375 px and both themes; changing summaries sit beside the playback controls. Wide standalone table/SQL content scrolls locally; page width remains 375 px. No contrast failure. |

### First reading

| Item alone | Apparent meaning and uncertainty before prose |
| --- | --- |
| Figure 1, One customer, several orders | Highlighting the same customer ID links one customer row to zero, one or several orders. Edda's row remains when no order matches. No unexplained link direction. |
| Create the customers table | A short complete definition gives an integer primary key and a required text name. |
| Order 103's order_items table | Two separately numbered lines carry a product, quantity and agreed price. The pair identifies a line. |
| Find Mina's pending orders | Select the pending rows for customer 1, sorted by order ID. |
| Figure 2, Putting names on order 103's lines | Select two lines, match their product IDs to names, calculate line totals, and return two result rows. Initially no result is drawn. The caption explicitly says this is an explanatory order, not a measured execution trace. |
| Build order 103's receipt lines | The aliases distinguish names from products and quantities/prices from lines; `line_total` is calculated. |
| Calculate one total per order | Group the line contributions by order ID before summing. |
| Order and payment totals table | Orders 101/102 are fully paid; 103 still owes 29.00. This is a result table, not another authoritative set of shop facts. |
| Figure 3, One purchase, one commit | Separate committed and private views show an incomplete purchase remaining invisible until commit; the alternative ending discards it. The rewind and no-competing-writer assumptions are named. |
| Take a mug only while one remains | The change and stock test occur in one conditional update, returning the new stock only when a row changes. |
| Figure 4, Who gets the last blue mug? | A cumulative event list and two counters compare two orders selling one mug with a waiting second buyer whose conditional update eventually returns no row. The last conditional step rolls that buyer back. |

### Interaction details

The three customer controls changed matching-row emphasis and the explanatory paragraph. Query steps produced zero, then one, then two receipt rows; neither input table changed. The two transaction paths ended with stock 0/10 and order 103 present, or stock 1/12 with it absent. Unsafe stock writes committed 103 and 104; the conditional schedule ended with only 103.

Enter-operated Next/Back retained `:focus-visible` on the `aria-disabled` button at the final/initial step for all three players: [focus record](visual-evidence/r00-keyboard-focus.json). Page-timer samples, rather than hidden-tab screenshot refresh, observed query and transaction first-step dwell of roughly six seconds; the shorter race opening held for several seconds. Changed text was readable, and manual stepping remains available. Pause held the observed state: [query playback](visual-evidence/r00-query-playback-check.json), [transaction/race playback](visual-evidence/r00-playback-check.json). Every state's content was separately inspected by stepping; this is not a claim to have timed every complete automatic run.

### Findings

None.

## r01 · Relations, keys and normalisation

Highest severity: **medium**.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | All three figures, the alternative key fragment, dependency notation and reconstruction query read before prose. |
| 2. Form fits the content | pass | The dependency map shows determinants; the alternative designs use rows and named columns; the price comparison separates two differently owned facts. |
| 3. Readable at a glance | pass | No clipped labels or undecipherable values in either width. The separate customer/order relationship is visibly named. |
| 4. Interaction | pass | All three comparisons change their marked rows and explanations appropriately. Enter activates each option and retains visible focus. The complete text alternative agrees. No playback applies. |
| 5. Themes and phones | finding | Text and colours pass, but the stacked comparison separates its selector from the second design and complete conclusion: r01 visual-1. |

### First reading

| Item alone | Apparent meaning and uncertainty before prose |
| --- | --- |
| Surrogate key fragment | A generated line ID still needs a unique order/line pair; the caption identifies this as an alternative fragment. |
| Functional dependency notation | The order/line pair determines the product, quantity and price; the subsequent map explains the arrow rather than treating it as a data-flow arrow. |
| Figure 1, Different facts, different determinants | Each row associates an identifying grain with the facts determined there. The caption expressly limits equality to one valid state, avoiding an implication that values never change. |
| Figure 2, Where a change has to go | Compare many edit locations against one, a customer who cannot fit in the sales sheet, and loss of Tariq's only sale versus retention of his customer record. The marks are hypothetical changes, not modifications of the running data. |
| Reconstruction SQL | Two retained ID joins recreate one result per line, sorted by order and line. The supplied receipt corroborates five rows. |
| Figure 3, Two prices that are allowed to disagree | The catalogue advances from 20.00 to 25.00 while the agreed line price remains 20.00. Dates and ownership identify different facts. |

### Findings

#### visual-1 · medium · r01 Figure 2, phone comparison

Problem: At 375 × 812, the options sit above two vertically stacked designs. With **Remove order 102** selected, the control occupies figure y=90–128, but the separate-design result (“Order 102 goes; customer 2 remains”) is at y=899–919 and the full comparison conclusion at y=932–1047. The latter cannot share this viewport with the selected option. After a normal selection the viewport shows the sales-sheet effect and just the start of the second design; after scrolling to the conclusion the selector and first design have disappeared.

Effect: The exercise explicitly asks the reader to compare three changes across two designs. On a phone each comparison needs a scroll down to discover the contrasting result and a return up to change the option, while retaining the first design in memory. That adds effort precisely where the side-by-side desktop arrangement makes the comparison direct.

Suggestion: Keep a concise statement of **both** designs' outcomes next to the options on narrow screens, or provide controls beside the concluding comparison. The detailed tables can retain their current form.

Evidence: [after selection](visual-evidence/r01-phone-light-controls-viewport.png), [after scrolling to the result](visual-evidence/r01-phone-light-result-viewport.png), [full phone figure](visual-evidence/r01-phone-light-figure2.png), [measured geometry](visual-evidence/phone-control-result-geometry.json). The same separation appears in dark theme. This finding concerns the observed comparison workflow, not the height of a figure by itself.

## r02 · Values, missing data and equality

Highest severity: **medium**.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Two figures, the agreed-price table and all seven SQL blocks read before prose. |
| 2. Form fits the content | pass | One instant branches into two clock readings. The predicate tool retains three stored values and separates true/false/unknown from keep/discard. |
| 3. Readable at a glance | pass | NULL, empty quotes, condition result and WHERE outcome are distinguishable without relying only on colour. Examples are short and consistently formatted. |
| 4. Interaction | pass | All six predicates give the expected per-row truth and result. Arrow keys change the selected radio and visible focus remains. The full text alternative covers all six conditions. No playback applies. |
| 5. Themes and phones | finding | No clipping, page overflow or text contrast failure; the phone selector is separated from the row the reader is told to watch: r02 visual-1. |

### First reading

| Item alone | Apparent meaning and uncertainty before prose |
| --- | --- |
| Agreed-price table | One mug and two packs of tea contribute 20.00 and 9.00. |
| Decimal/floating comparison | The explicitly typed decimal sum compares equal; the double-precision sum does not. |
| Rounding comparison | Rounding after multiplying three units yields 1.01; rounding each unit first yields 1.02. The block labels these two distinct calculations. |
| Figure 1, One session, one instant, two clock readings | One stored instant is displayed as 18:00 UTC and 19:00 Stockholm, with the display zone retained separately. No suggestion of two different session times. |
| Local-zone conversion | Render the specified instant as a Stockholm clock reading. |
| Local-day boundary query | Include local midnight and exclude the next local midnight, then order the selected events. |
| Unicode comparison | Distinct encodings compare different under C; applying NFC to both makes this pair equal. |
| Figure 2, Which notes pass the condition? | Compare known non-empty text, empty text and missing text, keeping all three visible. Equality initially selects 102. Its apparent opposites still exclude missing 103; explicit missing-aware tests include it. The tool states it illustrates logic rather than querying a live database. |
| Empty-payment-set COALESCE | Supply zero for an absent aggregate amount. |
| Optional codes definition/inserts | A unique optional code permits one supplied value and multiple missing codes; this is a scratch table rather than a shop schema change. |

All predicate results agreed with both the changing explanation and the static text alternative: `=` → 102; `<>` and `NOT (=)` → 101; `IS NULL` → 103; the missing-inclusive OR and `IS DISTINCT FROM` → 101/103. The native receipt corroborates the displayed arithmetic, time and predicate outputs.

### Findings

#### visual-1 · medium · r02 Figure 2, phone predicate selection

Problem: At 375 × 812, six single-column radio options precede the query, three comparison rows and final result. Selecting or keyboard-focusing the first condition leaves the result below the viewport: the screenshot shows only the beginning of row 101 at its lower edge. Order 103, which the prose tells the reader to watch when switching `=` to `<>`, and the result explanation require scrolling down. The condition controls then leave the screen.

Effect: The central comparison asks the reader to change the condition while watching the missing-value row. On a phone they must move between the options and the evidence, remembering which predicate was selected. Repeating this for six conditions obstructs the direct experiment that works on desktop.

Suggestion: Put a compact current result near the controls on narrow screens, or keep the condition selector accessible beside the comparison rows. Preserve the useful distinction between the row's truth value and WHERE's keep/discard result.

Evidence: [focused first condition](visual-evidence/r02-keyboard-phone-light.png), [after selection](visual-evidence/r02-phone-light-controls-viewport.png), [after scrolling to result](visual-evidence/r02-phone-light-result-viewport.png), [complete phone figure](visual-evidence/r02-phone-light-figure2.png). The same arrangement occurs in dark theme. Arrow-key operation and actual predicate results pass; the problem is following the experiment without repeated scrolling.

## Limits

- Hidden background panes can refresh animation screenshots slowly. Playback timings above use page `Date.now()` samples with page timers. Screenshots establish layout/state, not frame timing. Native timer evaluation above approximately three seconds timed out; samples were kept to 1.2 seconds. One overly large browser-tool batch timed out and reset its working variables; the persisted four-context audit sweeps were then completed in bounded calls. Neither tool timeout was treated as an article defect.
- Contrast evidence measures browser-computed foreground/background pairs, including dimmed content, rather than anti-aliased edge pixels. It is not a separate screen-reader, forced-colours or zoom audit. Native radios, headings, tables, live text and disclosure alternatives were inspected through browser accessibility output; a separate assistive-technology application was not used.
- I did not rerun native PostgreSQL or inspect frozen source. The author receipts support only their recorded outputs. r00's figures expressly depict illustrative schedules; this review does not convert them into observed database traces.
- Reference drawings were calibration inputs, not subjects of an exhaustive control/compatibility audit. Article control use, state results, keyboard boundaries, text alternatives and responsive/theme checks were fresh.
- No article or component source was changed. Review completion does not authorise publication.
