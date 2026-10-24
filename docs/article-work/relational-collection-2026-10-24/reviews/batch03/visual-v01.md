# Visual review · initial article batch · r04, r08, r10, r11, r12 · batch03-v01

Inputs read: version, hashes and preview metadata from [the fixed manifest](v01/manifest.json), SHA-256 `021ee3e14b42e9c12914f422bfe074d0eea8b7fb99e31d514a930d4833a02eeb`; the five complete rendered pieces and their isolated figure routes at the assigned `4398` origin; the three rendered fixed references at `4350`; the review skill, visual perspective, figures skill and render-check instructions. Relevant mechanical records consulted are described below. No article source, context, audience plan, author notes, earlier reports, history or decisions were read. No edits to articles, builds, delegation or publication were performed.

Highest severity: **critical** (r10). r12 has one medium finding; r11 has one low finding. r04 and r08 have no findings.

## Checks

| Piece | Check | Result | Note |
| --- | --- | --- | --- |
| r04 | 1. First reading alone | pass | All nine examples inspected on the isolated route before prose; all six time combinations used. |
| r04 | 2. Form fits content | pass | Two-time answer matrix, stored-assertion table and cascade boundary distinguish their different jobs. |
| r04 | 3. Readable at a glance | pass | Both tables have explicit headings; five SQL blocks are short, indented and contextualised. |
| r04 | 4. Interaction | pass | Six selected cells and explanations agree; native select keyboard operation retains focus. No player applies. |
| r04 | 5. Themes and phones | pass | Matrix remains legible at 375 px; both themes checked, including secondary text and code. |
| r08 | 1. First reading alone | pass | All ten examples inspected before prose; both policies and all five steps used. |
| r08 | 2. Form fits content | pass | Incoming observations and current price remain visibly distinct; two reconciliation tables expose the input and accounting. |
| r08 | 3. Readable at a glance | pass | Seven SQL blocks have clear local purposes; the comments in the publication boundary are expressly identified as a recipe. |
| r08 | 4. Interaction | pass | Price, source version, ledger, current observation and explanation agree across both policies. Endpoint focus, Play, Pause and Reset checked. |
| r08 | 5. Themes and phones | pass | Four layout/theme combinations checked. Wider input table and code scroll locally and are keyboard reachable. |
| r10 | 1. First reading alone | pass | All eight examples inspected before prose; all three keys and their full walks used. |
| r10 | 2. Form fits content | finding | visual-1: customer-only entries visibly contain the dates the explanation says they lack. |
| r10 | 3. Readable at a glance | finding | visual-1: stored key content and annotations obtained from a row are not distinguished. The measured table and five SQL blocks are otherwise clear. |
| r10 | 4. Interaction | finding | visual-1 affects the meaning of the customer-only state; counters, returned identities, other routes, endpoint focus and player controls behave coherently. |
| r10 | 5. Themes and phones | pass | No page overflow at 375 px; all key choices checked in both themes at desktop and phone widths. |
| r11 | 1. First reading alone | pass | All seven examples inspected before prose; all three join routes and every step used. |
| r11 | 2. Form fits content | finding | visual-1, low: relation values are packed into cards rather than placed under column headings. The physical-plan tree correctly separates the two inputs. |
| r11 | 3. Readable at a glance | pass | Four code/plan blocks preserve indentation; estimate and actual counts are labelled at the same scan grain. |
| r11 | 4. Interaction | pass | Six scan comparisons, two indexed searches and three build rows plus two probes have coherent matches and explanations; endpoint focus and player controls checked. |
| r11 | 5. Themes and phones | pass | Both themes and widths checked; text remains readable, including the hash-table annotations. |
| r12 | 1. First reading alone | pass | All seven examples inspected before prose; four query choices, five pruning steps and four lifecycle steps used. |
| r12 | 2. Form fits content | pass | The boundary table, candidate partitions and detached-table region communicate different facts; detach is visibly distinct from drop. |
| r12 | 3. Readable at a glance | pass | Times, half-open bounds, row identities and four SQL blocks are legible. |
| r12 | 4. Interaction | finding | visual-1: phone controls and summary remain together, but the active partition and query needed to check the explanation do not. State outcomes, endpoint focus and playback otherwise agree. |
| r12 | 5. Themes and phones | finding | visual-1: the phone stack requires scrolling between the relevant drawing and its controls. No contrast failure was found in skipped rows. |

## First reading

These impressions precede the complete prose reading. The collapsed text alternatives were opened and read subsequently; they contain prose equivalents, not additional drawings or code examples.

### r04 · History, correction and deletion

- Agreement table: one mug at 20.00 and two teas at 4.50 make 29.00; the caption says the agreement survives a catalogue correction.
- Effective-time lookup: start inclusive, end exclusive or open-ended. Before prose, the ownership of `price_history` versus the later assertion table was uncertain.
- Figure 1: columns represent effective time, rows recorded knowledge; choosing either coordinate selects one answer. The invariant order price is separately boxed. The six combinations gave rows `[20,20]`, `[20,25]`, `[20,24]`.
- Assertion declaration: two required ranges and a combined exclusion rule. Its length is manageable, but the two overlap tests require the following explanation.
- Stored-assertion table: four statements qualified by two periods. The initial “all instants” row initially needs the baseline note to explain its scope.
- Two-time lookup: both containment predicates name their time argument, with 25.00 shown as the answer.
- Active-products query: filters a retirement marker; the consequences for old receipts are not implied by this fragment alone.
- Conditional cancellation: changes only a pending order and returns the accepted identity; stock compensation is not shown in the fragment.
- Figure 2: the solid transaction region contains parent and child deletion; separate copies sit outside it. It makes the reach of the cascade clear without pretending to operate a cache or backup.

### r08 · Updates, upserts and bulk imports

- Conditional stock and expected-price updates: each puts the refusal condition in the write and returns accepted values.
- Current feed declaration: one position per product, with source and positive version.
- Conditional upsert: a newer version from the same source can replace the current one; the relationship between this guard and the later ledger is initially uncertain.
- Figure 1: four incoming cards feed one current catalogue box. Arrival-wins produces 20, 25, 24, 25, 26; source-version handling produces 20, 25, 24, 24, 24. The older identical repeat and contradictory old payload have different labels.
- Seen-version query: joins the full version identity and finds a changed payload.
- Raw-stage declaration and COPY: separates receiving text fields from changing products.
- Input table: four rows include two P7 versions and one duplicate; actual headings make the distinctions quick to compare.
- Publication boundary: a lock followed by commented application actions. Before prose, whether this is a complete runnable transaction is uncertain; the article later explicitly calls it a recipe and points to the implementation.
- Reconciliation table: four classifications account for all four input rows and identify the one current-state advance.

### r10 · Indexes and access paths

- Mina lookup SQL: the filter and requested order are explicit.
- Figure 1: unordered table rows remain fixed while an adjacent sorted index is built; page/item labels lead back to orders 101 and 103. The order-number labels are annotations, rather than complete stored rows.
- Newest-orders SQL and history-index declaration: the equality prefix, descending time and descending identity are visually easy to compare.
- Figure 2: three choices alter entry order and how soon two results are known. Customer-only still prints dates inside “Index entries in key order”, leaving uncertainty about whether these dates are stored in that index or are annotations obtained by table fetches. Full prose confirms that the distinction is consequential; see r10 visual-1.
- Measured-query SQL: clearly moves to the generated customer 42 fixture and ten-result limit.
- Observation table: four routes show 984, 62, 13 and 4 accesses; it is labelled with engine and fixture scope.
- Covering-index SQL: `INCLUDE (status)` is visually separate from the search key.

### r11 · Query execution and bad plans

- Receipt SELECT: names the line grain, product join and line-number order.
- Figure 1: two inputs converge at a join, then flow upward through sort to a two-row result. Counts make filtering and unchanged sort cardinality visible.
- Measured SELECT: clearly adds EXPLAIN options to the same receipt query.
- Figure 2: line cards and product cards highlight one comparison or lookup; results accumulate below. Scan, indexed and hash routes use explicitly different counters. The cards require unpacking “P7 × 1” into fields; see low finding visual-1.
- Statistics SQL: one query followed by a joint-statistics declaration and refresh.
- Plan extract: indentation separates the one-row aggregate from its 1,000-row scan; estimated nine and actual 1,000 are visible together.
- Estimate table: estimated nine becomes 980 while actual stays 1,000. No elapsed-time improvement is asserted by the table.

### r12 · Table partitioning and data lifecycle

- Partition declaration: timestamp plus event identity, with an explicit UTC October interval.
- Four-event table: exact boundary instants visibly assign E1/E2/E3/E4 to the three months.
- Direct-bound query: the included October start and excluded November start match the declaration.
- Figure 1: each query first marks candidates, then outlines qualifying events. Final answers are E2/E3 from one candidate, E3/E4 from two, E1/E2/E4 from three, and E2/E3 from three for the UTC date expression. On the phone the stacked partitions are already much taller than the useful control area.
- Composite-reference declaration: the child carries both values from the event key.
- Figure 2: September first remains in the parent, then leaves it while E1 remains in a separate table; a further step drops that table. Counts remain four then three. The separate region makes detach versus deletion clear.
- DETACH SQL: a short operation whose relationship to eligibility and references needs its surrounding prose.

## Findings

### visual-1 · critical · r10 · Figure 2, “Customer only”

Problem: The selected key is `(customer_id)`, and the first-step explanation says “These entries do not tell us each order’s date.” Nevertheless, every card under **Index entries in key order** already prints a date, for example `1 12 Oct · order 101`. Those dates remain visible through the complete customer-only walk. The surrounding article and text alternative correctly say that the dates must be obtained by checking table rows, but the drawing never separates those fetched values from the index entries.

Effect: The comparison teaches the contents of the access path incorrectly. A newcomer can reasonably conclude that the customer-only index already supplies dates and cannot see why this route pays for table checks while the history key avoids rejected fetches. The contradiction concerns the central reason for choosing the composite key.

Suggestion: Separate index keys and row locations from fetched row values. A small table with explicit headings, and a visibly linked row-fetch area that reveals dates only after lookup, would expose the extra work. Alternatively, explicitly mark supplemental annotations outside the entry contents; the comparison still needs to show where the customer-only route learns each date.

Evidence: Reproduced in every layout/theme combination and all four customer-only steps; see [desktop light final](visual-evidence/r10-desktop-light-final-figure2.png), [phone light final](visual-evidence/r10-phone-light-final-figure2.png), and the customer-only records in [the state matrix](visual-evidence/state-matrix.json). The correct text alternative is preserved in [text-alternatives.json](visual-evidence/text-alternatives.json).

### visual-1 · low · r11 · Figure 2, input relation cards

Problem: Order-line fields are packed into `Line 1 / P7 × 1` cards, and product fields into `P3 / Green tea, 50 g` cards. There are relation headings, but no actual `line_no`, `product_id`, `quantity` and `name` column headings.

Effect: The reader has to unpack the card notation and map its parts back to the SQL before comparing the join keys. The labels and simple fixed data make this possible, so this is a small additional effort rather than a blocked explanation.

Suggestion: Use one compact table per input relation, with real column headings and the same current-row highlighting. Keep the visible association on `product_id` as the algorithms change.

Evidence: [Desktop light figure](visual-evidence/r11-desktop-light-final-figure2.png) and [phone light figure](visual-evidence/r11-phone-light-final-figure2.png). This applies to all three routes, although their counters and results are coherent.

### visual-1 · medium · r12 · Figure 1 at 375 × 812

Problem: The phone layout stacks the three partition cards above the answer, explanation and playback controls. The figure is about 1,352 px tall. At step 2, Next changes September to “Skip · outside query range”, while the viewport around Next shows November and the September explanation; the September range and query are above the screen. The query, active partition and controls cannot be inspected together at this width.

Effect: To check the claimed exclusion against the declared bounds, the reader must scroll away from the controls, find September, then return before advancing. The text summary remains understandable, but the drawing no longer lets the reader follow the proof as it changes. That is particularly costly in the boundary-crossing and date-expression comparisons, where seeing which ranges remain candidates is the teaching work.

Suggestion: Give the phone an appropriately compact comparison: for example, short partition rows with events disclosed for the active row, or a current-partition panel beside a compact persistent range overview. Keep the selected predicate, active bounds and Next/Back summary within one useful view.

Evidence: [Step 2 actual phone viewport](visual-evidence/r12-phone-dark-september-step-viewport.png), [complete phone figure](visual-evidence/r12-phone-light-final-figure1.png), and [final controls viewport](visual-evidence/r12-phone-dark-controls-viewport.png). The same layout occurs in light and dark; desktop keeps the ranges side by side.

## Coverage and evidence

Calibration complete: visually studied all **34 rendered fixed-reference drawings** (13 sequence, 11 index and 10 storage), their rendered tables and the teaching passages that introduce and interpret them. This included actual rendered pixels, not only extracted text. Reference controls were used to expose several changed/settled states; this was calibration, not an exhaustive reference-player test. Drawing/table screenshots were emitted during browser work and were not saved as local files. The reference code blocks were also inspected as rendered pixels; their saved captures use `reference-{sequences,indexes,storage}-codeN.png`, with [their inventory](visual-evidence/reference-code-inventory.json).

The assigned articles contain **41 examples: nine figures, seven tables and 25 code/plan blocks**. Coverage by piece is r04 2/2/5, r08 1/2/7, r10 2/1/5, r11 2/1/4 and r12 2/1/4, in figure/table/code order. All were inspected in isolated first reading, then in their complete articles. Each complete final Sources disclosure was opened and read, including the disclosures outside the article element. Closed figure text alternatives were also read.

Actual desktop dimensions were 1280 × 720, phone dimensions 375 × 812. All four light/dark and desktop/phone combinations were checked. [State matrix](visual-evidence/state-matrix.json) records **260 state observations**: all 65 combinations of player choice and step in each of those four combinations. [Keyboard endpoints](visual-evidence/keyboard-endpoints.json) records 112 first/last endpoints; focus remained on the corresponding Back or Next button with `aria-disabled="true"`. [History choices](visual-evidence/r04-time-choices.json) separately records all six select combinations in all four layout/theme cases and select keyboard use. [Initial states](visual-evidence/initial-states.json) records the earlier isolated use.

All six players were observed advancing automatically with page-clock timestamps. First changed states were observed after approximately 4.1–8.1 seconds, depending on the explanation. Pause was available, bounded post-pause samples were stable, and Reset returned the initial state. See [playback trials](visual-evidence/playback-trials.json). The initial short observation was insufficient for these reading holds; it is not treated as a defect. No claim of exact frame timing is made for the hidden browser pane.

All page widths remained within the actual viewport. Code uses local horizontal scrolling on phones. The r08 input table also scrolls locally; keyboard focus and movement reached its concealed 30 px edge. See [responsive geometry](visual-evidence/responsive-geometry.json) and [scroll access](visual-evidence/scroll-access.json). Screenshot receipts use `rNN-phone-{light,dark}-exampleN.png` and `rNN-desktop-dark-exampleN.png`, numbered in rendered example order, plus specifically named figure/state captures.

Fresh resolved-colour calculations covered visible text on both surfaces in both themes, including selected/read/hash annotations and skipped partition rows; no non-disabled text below its 4.5:1 normal-text or 3:1 large-text threshold was found in the recorded states. See [rendered contrast](visual-evidence/rendered-contrast.json). Meaningful highlighted outlines/arrows use the visible accent and are distinguishable with text or shape as well as colour. Calculations are CSS-based, not pixel sampling or a screen-reader audit.

Mechanical reuse was limited to observations: r04/r08 source-hash receipts match the manifest's article, figure and download hashes; their execution metadata and native JSONL records identify PostgreSQL 18.6/Psycopg 3.2.12 and the applicable functional examples. r10/r11/r12 native-environment records identify the download hashes also present in the manifest, their synthetic fixtures and PostgreSQL 18.6; the native outputs support the displayed counts/plan extracts. Their source-manifest records identify the assigned article and components. Supplied contrast records were consulted as token calculations, then checked against the fresh rendered styles. Older render/structure receipts were not reused as current visual verdicts. Their different preview origins and limited assertions do not replace this inspection.

## Limits

- This is a visual review, not an independent native-database execution or primary-source technical review. The applicable native receipts establish only the mechanisms and fixtures they record. The diagrams themselves remain labelled conceptual models.
- Automatic playback was sampled through the first transition of each player and bounded pause checks; every state and option was separately traversed manually. This is not an exact dwell-time trace of every automatic transition or an exhaustive reduced-motion/browser matrix.
- Contrast calculations cover the recorded rendered states and their resolved styles, not every possible operating-system rendering or pixel-level antialiasing.
- Actual browser file saving was not tested. No download-event or download-path waits were used.
- An initial viewport operation targeted only the reviewer's own reference tab, not the article tab. That was reset; the reference tab was closed, actual article `innerWidth`/`innerHeight` were then verified, and the phone captures were replaced. Only the subsequently verified measurements are retained in the geometry receipt.
- Own tabs were closed after controls were reset; actual 1280 × 720 dimensions and System theme were restored. See [restoration](visual-evidence/restoration.json). Other reviewers' origins and tabs were not changed.

No repairs are included. Findings use a fresh `visual-1` sequence per piece as commissioned.
