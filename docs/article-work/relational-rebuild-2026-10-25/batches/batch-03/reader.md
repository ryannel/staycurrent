# Independent reader review — batch 03

Reviewed the fixed history, writes and application-sql sources in `review-source.json`, rendered at port 4606. Editorial/teaching and actual visual read, without editing or delegation. Illustrations, labels/captions and controls preceded body reading; `initial-notes.md` was saved before plans and example records were consulted. No earlier verdicts or author quality notes read.

## Findings

### Medium — the large-result route has no driver-streaming explanation

Location: `src/articles/relational-rebuild/application-sql.astro`, between “Choosing what to load” (line 141) / “Several queries and one result” (148) and “Deadlines and cancellation” (186); missing topic rather than an incorrect sentence.

The accepted collection map assigns driver result streaming to application SQL (pagination node, `planning/accepted-map/collection-map.json:374`). Pagination's current plan repeats that ownership in its brief and “One snapshot for an export”: it deliberately leaves the mechanics of reading one result in batches to this article. The finished application article only demonstrates a complete `rows` array, small relationship loads and cancellation. It never explains how the driver can consume one large result incrementally, what stays borrowed/open while doing so, or how completion/early abandonment closes that result before the connection is returned.

Reader effect: the export route sends the reader here to make its memory and connection-lifecycle contract concrete, but the missing bridge requires outside knowledge. The local detailed article outline also omitted this ownership, so the coordinator should reconcile that mismatch rather than treating literal outline coverage as sufficient. Supply a bounded explanation of incremental result consumption and its completion/abandonment lifecycle, connected to the existing ownership and cancellation reasoning; pagination should retain snapshot and continuation correctness.

### Low, optional — show the joined rows before grouping them

Location: application SQL Figure 2, `src/components/relational-rebuild-application-sql/Loading.astro` joined strategy.

The final joined state shows two fully assembled order cards and says “1 query · 4 returned rows”; the note explains that each order's columns travel twice. It does not display the intermediate four returned rows. The caption and body do state the relationship accurately and the audience already has result-row prerequisites, so this is optional polish. Showing repeated parent columns beside the four lines would make that particular trade-off as directly inspectable as the counters and re-sorted entries in the Indexes comparison.

## Teaching and editorial judgement

Apart from the scope gap, the pieces can sit beside the fixed references. They use established terms, concrete initial conditions, meaningful comparisons and explicit conclusions. History earns its two clocks through scheduled and corrected boundaries, then separates correction from later action and deletion. The unchanged order agreement is visible throughout. Writes develops the guard, result, conflict meaning and durable batch identity before the longer set-based transaction; the known pre-start interruption keeps its example distinct from uncertain commit. Application SQL progresses from driver values/results through relationship loading to one-client ownership and cleanup; its discarded connection and unknown purchase outcome are distinct visible results.

All three use connected plain prose. Qualifications generally prevent specific mistaken actions rather than reading as appended objections. The repetition of current versus agreed price is short and applies it to each new operation rather than reteaching modelling. Scope checks against the three article plans, relevant collection-map entries and pagination plan found no other unowned promise. Shared example/fact checks found the displayed amounts, order/line identities, time boundaries, B17 states and purchase replay coherent. The planned transaction, recovery, worker and access readings remain explicit handoffs.

Calibration used bounded source passages and rendered figures from Sequence diagrams (lifelines/waiting/outbox and chatty calls), Indexes (composite-index comparison) and Storage and durability (old P7 versions). These establish the compare/change/conclude standard; no complete reference reread was needed.

## Rendered coverage and real limits

Read all figure sequences and their text alternatives; inspected current screenshots of every figure across the three articles, including meaningful temporal, guard/replay, batch-stop, joined-loading and lost-commit states. Operated selectors, step/reset controls and representative keyboard paths. At the final lost-commit step, Next retained keyboard focus while disabled. Representative 375×720 light samples covered loading/lifecycle and B17 tables; dark phone inspection covered both temporal accounts. Desktop inspection used 1280×720. No clipping or unreadable figure label was found in those samples. The two tall phone workflows require vertical scrolling, but state, summary and controls remain in a coherent order.

Retained the supplied current-source mechanical evidence for exhaustive control options, both viewport/theme combinations and SQL contrast (minimum 4.846 light / 4.591 dark), rather than repeating all states and timing tests. This reader did not run database experiments, audit every contrast pair, inspect every state in every theme/viewport, or observe foreground playback. Hidden IAB repainting can lag; stepped DOM state was used for explanation/focus checks, with actual screenshots for spatial judgement. No new animation-timing claim is made.

No player was left running. Restored 1280×720/System and closed the single owned IAB tab; user tabs were untouched. Viewport/theme lease released. No source changes, server starts, commits or publication.
