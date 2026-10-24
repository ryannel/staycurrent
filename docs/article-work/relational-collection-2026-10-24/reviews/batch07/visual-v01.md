# Visual review · article · r23, r24, r26–r30 · batch07-v01

Inputs read: the identity, restrictions and permitted-input fields of `v01/manifest.json`; the complete frozen rendered articles and their isolated media at `http://127.0.0.1:4476/review/relational-collection/`; the current review skill, visual perspective and figures/render-check guidance. No article/component source, plans, collection context files, author teaching notes, earlier reports or history were read. This is independent initial visual coverage only, with no final-reading or corpus credit.

Highest severity: medium.

## Calibration and method

Before any assigned article, I inspected all 34 rendered reference drawings at port 4350, reading their captions, text alternatives and relevant surrounding explanations. Actual viewport screenshots and scrolling covered the drawings, including the completed sequence shapes; no source was used.

- Sequences, figures 1–13: Mina books a repair; Who is waiting; Sending the email inside the request; A job in the database; One crowded diagram, or two; The same messages in another order; Checking Mina’s details; Polling in a loop; Two requests in parallel; Round trips before the first request; The same booking, fork or stair; One call per repair; What crosses the browser when Mina signs in.
- Indexes, figures 1–11: Sequential scan; Building an index; B-tree search; Range scan; Clustered-table lookup; Page visits as the range widens; Composite index order; Index-only scan and visibility map; Insert/update write costs; Ordered/random insertion; Delete/vacuum/reindex.
- Storage, figures 1–10: Page filling; Four buffer slots; Old row versions; Hypothetical database without a log; WAL; Dirty-page eviction; Group commit; Crash recovery; Flush path; `synchronous_commit` off.

I first read and used every assigned figure, table and displayed code example on its isolated route, then read the complete article and expanded its final Sources and further reading disclosure. The checks below incorporate the subsequent in-context reading rather than leaving first impressions untested.

Desktop was 1280 × 720; phone was 375 × 812. Actual `innerWidth`/`innerHeight` were checked after viewport changes. Light and dark were inspected in the complete articles, with desktop comparisons, ordinary viewport screenshots and scrolling. No full-page/clip combination was used. Tables fit the phone viewport; code examples had internal horizontal scrolling. Keyboard scrolling was exercised on the actual overflowing `pre` elements, retaining visible focus. Page width remained 375 on the phone cases.

Rendered text colours/backgrounds and ancestor opacity were checked from the current DOM. Body, captions, warnings and active labels used at least 6.61:1 in light and 6.83:1 in dark in these media; active controls on their raised surface were higher. The deliberately unavailable Back/Next buttons use reduced opacity (about 3.07:1 light / 3.82:1 dark); these are inactive controls, not body text or faded data rows. Meaningful accent outlines/bars and their surfaces were visibly distinct and exceed 3:1; labels also state their meaning. The catch-up chart uses dark green on the light surface and pale green on the dark surface.

## r23 · Connections, overload and capacity

Rendered article: `/connections-and-capacity/`; isolated route: `/figures/r23/`.

### First reading

- Figure 1, Eight requests, three places to wait: R1–R8 move between application waiting, connection ownership and completion/refusal. Increasing connections appears to relocate a queue; the work selector changes actual parallel progress. The rounds and equal work units are explicitly illustrative. Before prose I was unsure how the queue limit counted already admitted work; using the options and subsequent explanation resolved this: it limits waiting outside the lent connections.
- Figure 2, Spend the request deadline once: three allowances divide an invented one-second budget into admission, complete database work and cleanup. The note makes clear that these are allowances and earlier time reduces what remains.
- Table, Follow the wait to the resource: a useful three-column mapping from observed pressure to investigation and the reason extra connections can fail. Context confirms its diagnostic purpose.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures and the diagnostic table inspected alone before complete prose. |
| 2. Form fits the content | pass | The three queues expose the admission/work distinction; the budget strip and diagnostic comparison fit their different tasks. |
| 3. Readable at a glance | pass | Requests are short identifiers, all populations are named, and the changing sentence counts all four outcomes. No code example. |
| 4. Interaction | pass | All 18 pool × queue × work combinations, and every round in each, freshly exercised. Counts and explanations agree. Keyboard selects, Next/Back, both endpoint focus states, Play, Pause, Reset and schedule alternative used. |
| 5. Themes and phones | pass | Both themes at both widths. Phone panels stack; the changing summary remains directly above the options and playback controls. Diagnostic table wraps without page overflow. |

The 18 schedules contain 2–9 displayed states. With two independent workers, the no-refusal schedules finish eight requests in four rounds regardless of pool size; with one shared row they take eight rounds. Two connections/queue zero finishes two and refuses six; four connections/queue zero finishes four and refuses four. Intermediate queue-four cases correctly admit six or eight. The final summary agrees with the visible request chips. The complete text alternative describes the contrasting schedules without requiring animation.

Keyboard Enter on the final Next and Space on the first Back retained focus on the same button with `aria-disabled="true"`. Each native select was operated with Space/ArrowDown/Enter. In the hidden browser, sampled playback held the first round for several seconds and advanced to round 2 by approximately six seconds; Pause held the displayed result stable over a subsequent two-second sample. Reset returned to round 1.

Findings: none.

## r24 · Diagnosing a database incident

Rendered article: `/slow-queries/`; isolated route: `/figures/r24/`.

### First reading

- Figure 1, One symptom, three different waits: three equal total-duration rows compare a pool wait, lock wait and expensive execution. The shared scale makes the principal distinction immediate, but the small desktop segments split “Other 100” into fragments. On phones the visible label becomes only “100”. Context identifies this as the remaining application/transport time, but does not repair the labelling problem.
- First code example, The two owned sessions in the experiment: explicitly separate Holder and Waiter blocks establish a held row lock and a blocked conditional update. The comments identify the connection boundary and the intentionally open transaction.
- Second code example, A PostgreSQL activity snapshot with blocker identities: a single query gathers identity, state, transaction age, waits and blocker PIDs. Indentation makes the selected evidence easy to locate.
- Figure 2, What the cancellation actually changed: four numbered state cards distinguish cancelling the idle holder, cancelling the waiter, and ending transactions. Its observation/version caption prevents reading it as a timed trace. The prose confirms each transition.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures and both code examples inspected alone, then checked against the complete article and final disclosure. |
| 2. Form fits the content | pass | Equal-scale timelines fit attribution of delay; ordered state cards fit the cancellation observation. |
| 3. Readable at a glance | finding | Figure 1’s small “Other 100” segments need decoding at desktop width; see r24 visual-1. Both code examples and Figure 2 are readable. |
| 4. Interaction | pass | Media are static. Both overflowing phone code examples scroll horizontally by keyboard with visible focus. Download link inspected and exact HTTP target byte-checked. No playback controls are present. |
| 5. Themes and phones | finding | The label problem occurs in both desktop themes; phone removes the word “Other” from the segment. Other text, state cards and internal code scrolling remain usable in both themes. |

### r24 visual-1 · medium · Figure 1, the 100 ms Other segments

Problem: At 1280 × 720 the 100 ms segment is so narrow that “Other” appears as “Oth” / “er”, while “100” breaks as “10” / “0”. This occurs at the right of row A and left of rows B/C. At 375 px the segment contains “100” without a visible category name.

Effect: The reader has to reconstruct a basic label while comparing where the same request time went. This is the figure’s main task, not optional ornament. The caption explains what Other means but does not connect a readable name and value to those narrow intervals.

Suggestion: Keep the proportional widths and put short segment labels outside the narrow bands, or use an adjacent clearly keyed label/legend. Preserve the value as an unbroken number.

Evidence: Fresh isolated and complete-article viewport inspection on preview 4476, Figure 1, desktop light/dark and phone light/dark. The small segment has an accessible name “Other time: 100 milliseconds”; that helps the text alternative but leaves the visible label problem.

The exact displayed download href `/evidence/r24/incident.py` returned HTTP 200 and 7,367 bytes. SHA-256 `7369e8d8798d560dd05a49db0bdb76bb466ce1545330f6959b431f43b427dc5e` matches the permitted mechanical source-hash receipt. The applicable native receipt records PostgreSQL 18.6 on macOS/aarch64, the Lock waiter, still-blocking idle holder after cancellation, aborted waiter and successful fresh stock-0 retry. Those unchanged execution observations are reused only for the displayed observation sequence; this reviewer did not rerun the database fixture.

## r26 · Sharding and distributed SQL

Rendered article: `/partitioning-and-sharding/`; isolated route: `/figures/r26/`.

### First reading

- Table, Which change addresses which pressure?: separates lifecycle partitions, read copies, independent tenant shards and a single serial rule. It is a useful decision comparison; context confirms its scope.
- Code example, The tenant boundary in a reference: the abbreviated keys and two composite foreign keys show that shop identity travels with both order and product references. It is labelled a schema abbreviation, not a runnable complete DDL script.
- Figure 1, The shop key decides where the request goes: buttons contrast one-shop routing, ambiguous P7 identity and a global list. Two shard boxes make contacted owners visible. Before prose, I had to decode the tuple positions and mixed product/order/line strings to understand the receipt. Context explains those positions but leaves the figure dependent on looking back at prose/schema. It also says all receipt products are local while only P7’s product row is drawn.
- Figure 2, Local order and spread are different aims: ordered intervals compare with hash buckets; the accompanying sentences explicitly retain the range-read/merge trade and avoid claiming measured balance. Context confirms this conceptual reading.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Table, abbreviated schema and both figures read alone before the article. |
| 2. Form fits the content | finding | Figure 1 packs several relations into tuple strings rather than rows with real column headings and visible references; see r26 visual-1. |
| 3. Readable at a glance | finding | Individual strings are legible, but identifying tuple fields and tracing a receipt requires decoding. Other media are clear. |
| 4. Interaction | pass | All three route buttons freshly used, including keyboard Enter and visible focus; owner highlight, routing sentence and result agree in every option. Routing alternative opened. Code scrolls horizontally by keyboard on phones. No playback exists. |
| 5. Themes and phones | pass | Both themes at 1280 and 375. Phone buttons and shard boxes stack without page overflow; active/inactive owner labels remain explicit. Table fits; code scroll stays internal. |

### r26 visual-1 · medium · Figure 1, shard data panels

Problem: Each panel mixes different relations as prose-like strings: `products: (10, P7) · Blue mug · 20.00`, `orders: (10, 103) · Mina · pending` and `order_items: (10, 103, 1) · P7 × 1 at 20.00`. There are no column headings or drawn references. The default asks the reader to read order 103’s receipt, but P3’s referenced product is not shown while the result says the receipt’s products are all on A.

Effect: A newcomer must infer which positions are shop/order/line keys, distinguish unlike values sharing a visual row shape, and mentally reconstruct the joins to see why the receipt is local and shop 20’s P7 is excluded. Earlier schema prose supplies that work instead of the figure making the relation visible.

Suggestion: Put compact, separately headed products, orders and order_items tables inside the shard boxes, showing the relevant product rows and connecting/highlighting the composite references. The three routing choices can keep the existing contacted-owner highlight.

Evidence: Fresh first isolated reading and complete-article checks at preview 4476, all three request options, desktop and phone in both themes. The complete prose explains `(shop_id, product_id)` and `(shop_id, order_id)` but the current visual still requires reconstruction. This is a form/reader-effort problem, not a claim that primary-key syntax was presented as placement configuration: the caption correctly disclaims that.

## r27 · Transactions across partitions

Rendered article: `/distributed-transactions/`; isolated route: `/figures/r27/`.

### First reading

- Figure 1: the transaction decision sits over two separately replicated participants. A1–A3 and B1–B3 are expressly copies within their own groups. I initially asked whether the six labels implied six machines; the caption explicitly says they are roles, and context reinforces the distinction between per-participant and global agreement.
- Figure 2: one durable decision and two participant-state panels change through prepare, final decision and delivery/recovery. Before prose I could distinguish “Prepared” from “Committed”; all three histories confirmed that a missing reply does not authorise a contradictory local decision.
- Code example: preparation occurs inside the participant transaction; committing prepared state is a later command outside a transaction block and only after resolving authority. The comments carry the crucial boundary. The surrounding article clearly identifies it as a building block for an external manager.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures, all histories and the displayed participant commands inspected before prose. |
| 2. Form fits the content | pass | Separate scopes of agreement and explicit participant/decision states expose the intended distinction. No relational row table is being represented by the state panels. |
| 3. Readable at a glance | pass | State names, explanation and history selection agree; long recovered-authority state wraps on phones. The short code fragment states its execution boundary. |
| 4. Interaction | pass | All 20 states across normal/prepared-loss/decision-loss histories freshly used; text alternative, History keyboard menu, Back/Next endpoint focus, Play/Pause and Reset checked. |
| 5. Themes and phones | pass | Both themes at both widths, including the long recovered-ABORT state. Phone explanation stays with state panels and playback; code scrolls internally with keyboard focus. |

Normal history has six states; loss after prepare has six; loss after A commits has eight. The first loss keeps both prepared until authorised recovery records ABORT. The second preserves COMMIT while B is unresolved, then resolves B to the same decision. Both endpoint buttons retain focus with `aria-disabled`. Playback advanced from 1/6 to 2/6 within a 6.8-second hidden-browser observation; Pause remained stable over 1.6 seconds. No diagram represents elapsed database time.

Findings: none.

The actual `/evidence/r27/prepared.py` href returned HTTP 200 and 7,303 bytes. SHA-256 `3ec3d92ea1821ab85e2d70a2338367cc8cd4dc0237ccdabe52280b2aa38d3c51` matches the permitted mechanical source-hash receipt. The applicable PostgreSQL 18.6/macOS/aarch64 receipt records both prepared identities before/after restart, stock 1/12 and no order before resolution, then stock 0/10 and order 103 with its original two lines and no prepared residue. It also records the unsafe independent-local-commit counterexample. These unchanged native observations support the displayed fragment and disclosure; the conceptual animation is reviewed separately and is not treated as a native trace.

## r28 · Time, snapshots and distributed reads

Rendered article: `/distributed-reads/`; isolated route: `/figures/r28/`.

### First reading

- Figure 1: before and after purchase are coherent pairs; a third panel combines old stock with a new order. The historical direction and “two independently current queries” label prevent mistaking this for two physical mugs. Context explains the separate statement snapshots and why P3 is omitted.
- Figure 2: chosen read timestamp and B’s safe applied frontier are different controls. At 100 both can answer even with B behind; at 115 the behind B cannot complete its portion. Catching up permits the after-purchase pair without altering the old snapshot. The safe-frontier caption answers the uncertainty about unresolved writes, not just transport lag.
- Freshness table: maps reports, read-your-write confirmation, catalogue tolerance and purchase decisions to distinct contracts. It does not treat an old stock observation as a reservation. Context confirms the table’s practical purpose.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures, four combinations and freshness table inspected before complete prose. |
| 2. Form fits the content | pass | Before/after comparison and independently selectable timestamp/frontier make the distinction visible. |
| 3. Readable at a glance | pass | Explicit “Cannot certify timestamp 115” replaces an invented answer; units are disclosed as ordered history values. |
| 4. Interaction | pass | All four cases used; native menu keyboard operation changed the timestamp with focus retained. Alternative opened. No playback or reset control is present; selections restored manually. |
| 5. Themes and phones | pass | Both themes at both widths, old/safe, new/blocked and new/caught-up phone results inspected. Both controls, panels and result remain in their figure; table fits without page overflow. |

Findings: none.

## r29 · Regional placement and survival

Rendered article: `/regional-placement/`; isolated route: `/figures/r29/`.

### First reading

- Figure 1: five explicit votes occupy 2/2/1 regional groups; the reader can remove regions or isolate communication. “Largest communicating group” distinguishes process survival from quorum reachability. The initial uncertainty about whether a possible majority guarantees service is explicitly ruled out by the caption and full prose.
- Figure 2: two local votes are insufficient for three of five, so the local row’s write depends on a remote vote. It isolates one group and explicitly preserves the complete purchase’s other effects. No latency scale or measured route is implied.
- Voucher table: independent old-copy checks overspend one remaining entitlement; a protected global decision permits only one. Context supplies the initial 99 and maximum 100 and confirms the table’s arithmetic.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures, every outage/connectivity combination and voucher table read alone. |
| 2. Form fits the content | pass | Region groups contain individual votes; the dependency panel and two-row decision comparison fit their claims. |
| 3. Readable at a glance | pass | Available/unavailable is stated in words and ticks/crosses, not colour alone. Singular-vote and zero-vote summaries are readable. |
| 4. Interaction | pass | All 16 combinations of three region checkboxes and two communication modes freshly checked. Checkbox Space and menu Space/ArrowDown/Enter used; text alternative opened. No playback exists. |
| 5. Themes and phones | pass | Both themes at both widths. Phone region cards stack; each checkbox has its changed local state beside it, followed by communication control and global result. Table remains readable without overflow. |

Every single-region failure with connected survivors permits three or four votes. Every two-region failure leaves at most two. Isolated regions have maximum communicating groups of two, two or one even with all processes running; no isolated case invents a majority. All unavailable yields zero. None of these outputs claims a native outage test or service availability.

Findings: none.

## r30 · Rebalancing and cluster change

Rendered article: `/rebalancing/`; isolated route: `/figures/r30/`.

### First reading

- Figure 1: membership, write authority, destination readiness and purchase history change separately. A copied/installed snapshot is not yet current or a voter. The joint configuration explicitly requires a majority of both sets. Before prose I asked why stock and order occupied one group here; the caption deliberately chooses that placement and identifies omitted purchase effects, and context makes the transfer boundary clear.
- Figure 2: four equally scaled backlog bars show 600 initially, 700 at 30 MiB/s, 400 at 60 and zero at 100 after ten seconds against a 40 MiB/s incoming stream. The 0–800 MiB scale and explanatory numbers make the comparison readable without inferring throughput from bar width. Context confirms the surplus arithmetic and its excluded work.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both figures and all six membership stages inspected alone before prose. |
| 2. Form fits the content | pass | Independent state panels distinguish readiness from authority; the fixed-scale chart directly compares remaining backlog. |
| 3. Readable at a glance | pass | Joint-membership condition wraps clearly, all chart quantities/units are named, and zero backlog retains a labelled empty track. |
| 4. Interaction | pass | All six states, text alternative, keyboard Back/Next and both endpoint focus states, Play/Pause and Reset freshly used. Static chart has no controls. |
| 5. Themes and phones | pass | Both themes at both widths, including the long joint stage. Phone panels retain explanation and controls together; chart bars and labels fit without horizontal page scrolling. |

Playback advanced to the copying stage by a 6.8-second hidden-browser observation; Pause remained stable for 1.6 seconds. State and purchase explanation agree at all six steps. The green chart bars contrast with their tracks in both themes; numeric labels provide the quantities independently.

Findings: none.

## Limits, evidence reuse and cleanup

The permitted `mechanical/applicability.md`, r23 browser scenarios and r24/r27 native and source-hash receipts were read. These establish exact-version applicability, not visual quality. All media received fresh actual rendered reading and control use. No database code, native engine test, build or content edit was performed by this reviewer. The abbreviated r26 schema is not claimed executable by itself. The r24/r27 downloaded bytes were hashed without reading their implementation.

Browser download saving was not tested: exact actual-href HTTP responses/bytes and receipt hashes were checked instead. Default sandbox networking initially could not reach the preview; the bounded read-only checks succeeded with the network escalation. There was no approval rejection.

Hidden-browser playback can be throttled and screenshots stale between observations. Timed samples established advancement, a reading interval of several seconds and stable Pause in this environment; they do not establish foreground animation timing or production timings. Manual every-state reading supplies the content/state check independently. No screen-reader session was run; labelled DOM text alternatives, semantic controls and actual keyboard focus/scrolling were inspected.

The coordinator granted the global responsive/theme lease after calibration/default inspection. At the batch boundary I reset the players and option tools, restored and verified 1280 × 720 and System, closed only my own review tab, and explicitly released the lease for the queued author check. Reference tabs were also closed. No publication or build was authorised or performed.
