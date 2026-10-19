# Design aids: independent first reading

Audience: application engineers new to relational design. I know SQL and supplied that background where stated. This is an aid-only reading before article bodies, source, author notes or model intentions. I read each initial rendered full-page screenshot and its DOM snapshot. Browser operation is delegated to the coordinator because the child CUA session exposes no IAB. I choose the inputs and record predictions before the coordinator executes them. This establishes observed rendered states, but does not establish how easy the native controls feel to operate.

## RL76-1

The three panels keep initial, private and published values together, so I can see the intended distinction without remembering the old values. The numbered statement list is a useful sequence. I expect advancing one statement to reduce the private seats to 1 while the published seats remain 2. The caption says the related changes publish together, but a transaction does not itself know that both statements must have run. I want to test committing at step 1: I predict published seats 1 with no order, unless the model forbids that decision. That is the consequential boundary between atomic publication and business completeness. With both statements done and rollback, I predict the private produced values show 1/present, while publication stays 2/absent; I am unsure whether the private panel preserves the attempted work or resets it.

## RL77-1

The two physical designs are concrete: the copied table visibly disagrees, and both references point to one separate session row. The price panel initially feels like a second lesson alongside the room lesson, but the caption distinguishes their meanings. Deleting both bookings should erase the room fact in the copied table while retaining the separate session and the order agreement. Changing catalogue price to 25 should update only the current offer (50 for two seats), leaving the agreement 20/40. These are worthwhile controls because the same action has different consequences across the panels. I predict updating both copies to South removes disagreement without removing the redundant storage obligation; the second design should be unchanged.

## RL78-1

The matrix makes each UNKNOWN contribution and the final filter visible. I infer the combined column is AND across all the not-equal cells from “each order must differ from every input”; I supply the SQL equivalence from experience. NOT EXISTS has an answer column but no visible calculation explaining its contrast, so a new reader may accept that result on trust until the article explains it. With only o81, I predict o82 TRUE/kept and o81 FALSE/dropped for both approaches. With no payment rows, I predict both orders kept, with TRUE in the combined column despite no comparisons. That empty-set result is a useful boundary the caption does not itself explain.

## RL79-1

The stored keys and proposed booking make the composite ownership mismatch readable. All three gate results are shown even when one already blocks the insert; this helps keep their purposes separate. Choosing session-ID-only should admit the cross-tenant reference (seats 1), demonstrating the missing ownership condition. With valid (t4,s7), seats NULL and CHECK only, I predict CHECK UNKNOWN passes and the booking enters; the NOT NULL row should say it is not required. The table should explain UNKNOWN's permissive CHECK behavior, since the current TRUE/✓ default does not.
## RL80-1

The selected band and persistent former bands show that a correction does not overwrite earlier belief. I can match effective day 9 against “1–10 excl.” and the known date against “known 1–15 (excluded)”. The chart is not a two-axis plane: I read it as four labelled alternatives, which is workable. Its absence of tick marks means interval labels do the exact work and the rectangles convey span. Changing known day to 15 should select corrected €22 for effective day 9. Keeping the old known day 12 and moving effective day to exactly 10 should select the old €22 band; this tests both excluded-end rules. No vanished-state memory is needed.

## RL81-1

This is a particularly clear spatial explanation: every line/payment cell is one row and repeats its own line amount, so 40+40+5+5 gives 90. The two source tables preserve the actual purchase total 45. Switching to summaries should make one joined row, with 45 on each side and line total 45. Removing all payment records in the raw join should yield no output pairs and a zero selected sum, despite the actual purchases still 45. The aid does not name INNER JOIN in its visible default; I supply this to predict no rows, and want to see whether the empty state makes the join kind clear.

## RL81-2

The stored table followed by constructed rows is the right sequence for seeing why filtering cannot create a replacement NULL row. The default already has b18 cancelled, despite “s8 starts without a booking; give it a cancelled one”; that instruction briefly sent me looking for a change that has already happened. With cancelled b18 and the OR predicate in WHERE, I predict s8 remains a constructed real match but is dropped. With no s8 booking and the same OR predicate, I predict its constructed NULL row is retained. This directly tests why the apparent OR repair works for one case and not the other. The result needs no separate final table because the retained column and summary preserve both stages.
## RL82-1

The current order and input rows stay visible alongside the grouped answer, which should distinguish row-preserving windows from grouping. But the rendered half-width input table clips after Amount; the DOM's Contributes? column is outside its horizontal viewport. I cannot see the marked contribution set the introduction asks me to inspect. I have to infer the set from the final “40+20=60” and the equal timestamps. That is a central visual failure, not a request for another diagram. Switching ROWS at current row 1 should include only o81 and yield 40. Choosing previous/current at row 3 should include only o83 and yield 30 because a customer partition boundary blocks o82; I supply that partition rule from expertise, as the visible introduction does not state PARTITION BY customer explicitly.

## RL83-1

The retained first page and three sequences make the starting boundary available throughout the experiment. At this width the source panel falls onto a second row, so comparing live and retained source takes a little scanning, but the exact highlighted next rows are useful. With insert plus skip-two, I predict o84 repeats and o83 follows; the live list visibly justifies this. With corrected o83 total and captured IDs/current values, I predict unchanged membership o83/o82 but €99 appears. This probes the distinction between captured membership and captured values. I would also want to test moving an unseen row across the cursor, but that is beyond the two chosen cases; the current options at least expose that question.

## RL84-1

Every source row has its own disposition and the accounting sum equals six, so rejected and duplicated rows cannot silently disappear. However the default only tells me what was classified, not the order of gates: rows 3/5 are contradictory rather than stale because revision 9 is newer than destination 8. I want the boundary at destination 10 to see whether contradiction remains diagnosed when the data cannot update anyway. I predict contradictions remain contradictions (source inconsistency is independent of current destination), while destination remains 10. After repairing rows 3/5 at destination 8, I predict row 3 applied, row 5 duplicate, row 2 stale, b17 revision 9/cancelled, and b18 unchanged. This table buys useful traceability; it does not need an additional flowchart merely to decorate dispositions.
## RL85-1

The three versus two tiles make command multiplication visible at the default two parents. The connection sequence underneath is unrelated to both controls, so it functions as a static reminder; I cannot use the model to explore an early release or missing empty-parent entry despite the caption mentioning those points. This may be acceptable integration if those are explained separately. At zero orders I predict only the parent command in both designs, 5 ms each, with no child batch. At twenty orders and 10 ms I predict 21 commands/210 ms versus 2/20 ms; the displayed tiles should still explain which work repeats, rather than just printing those formulae. The values are explicitly assumed exchange overhead, so I do not read them as measured query latency.

## RL87-1

The actual matching keys are distinct from the planner estimate, so the default poor estimate drives 40,000 probes even though it expected one row. The table places a hash alternative beside it, avoiding a claim that one selected plan is inevitable. But I do not see individual matching keys or loop events: it is an operation-count model, not an animated execution trace. Selecting the large estimate and 10,000-key memory should choose a hash route and expose four batches (or an explanation of external work), while result cardinality stays 40,000. Setting actual matches to one while keeping the large estimate should retain that hash route and scan all 90,000 delivery rows for one match. This is a useful counterexample to blindly preferring a scan/hash plan. The caption explicitly reserves actual PostgreSQL choice for native plans below.

## RL89-1

The attached ranges remain beside parent-read eligibility, and the insert rejection makes missing future partitions operationally concrete. Switching to 1 November and inserting exactly 1 November should prune October and route to November (despite its existing example row being on 2 November). With October detached, read all dates and insert 31 October, I predict October stays visibly present but the parent cannot visit it and the insert fails because no attached range accepts that date; a direct October-table read still finds s7. This compares parent membership with physical data existence without needing to remember a disappeared partition. The default title “share one boundary” means the range boundary and the attached-set boundary together; that is slightly abstract but the controls make it testable.

## Observed initial interactions

These results were inspected after all predictions above were saved. I then loaded the full review/style guidance and model tests before inspecting the result packet, so the result assessment is informed; the original predictions remain unchanged. The coordinator operated all 26 chosen cases through CUA, resetting between cases. All 26 rendered result screenshots were inspected. DOM was used for the clipped Windows content and precise import classifications.

| Aid | Changes and persistent facts | Does the rendering explain the outcome? |
| --- | --- | --- |
| RL76 | Partial Commit leaves publication 2/absent and asks to complete both writes. Full rollback keeps attempted 1/present beside final 2/absent. | Rollback is legible; partial Commit incorrectly acts like a database guard. Repair required. |
| RL77 | Delete-all removes flat rows while session South/capacity2 and agreement20/40 survive; catalogue becomes25/50. Update-all makes both flat rooms South. | Yes. Persistent panels and row counts explain both changes. |
| RL78 | Known-only keeps o82; empty input keeps both. Comparison columns shrink with the input. | Yes for NOT IN. NOT EXISTS's reason arrives in the article. Empty-input TRUE is stated within the aid rather than derived. |
| RL79 | ID-only admits t4→s8. NULL/CHECK-only admits the row with UNKNOWN and undeclared NOT NULL. | Yes. Independent gates show which relaxation changes acceptance; the article teaches why UNKNOWN passes CHECK. |
| RL80 | Known15 selects corrected22; effective10/known12 selects former22. All four beliefs remain. | Yes. Labels and selected band expose both excluded-end boundaries. |
| RL81 pairs | Summaries produce one45/45 pair. No payments produces no occupied cells,0 output rows and displayed sum0. Source purchases45 remain. | Multiplication and summary repair are clear. Empty arithmetic0 needs separation from SQL SUM over no rows (NULL), already taught in78. |
| RL81 outer | Cancelled+OR creates real b18 then drops s8. Absent+OR creates and retains NULLs. | Yes. Rejected constructed rows remain visible. Long native-select text clips but repeats in full in the update status. |
| RL82 | ROWS first gives40. Previous/current row3 gives20+30=50, not my predicted30. Four orders and grouped totals persist. | My partition assumption was wrong: these three frames are tenant-global. Pixels hide Contributes? in both states. In article order the aid follows customer-partition SQL and defaults to global peers before the distinction is explained. Repair required. |
| RL83 | Insert+offset repeats o84 then o83. Captured IDs/current values retains o83/o82 while o83 becomes99. | Yes for these cases. Source review found the separate moving-key capture failure; that was not observed in this initial browser packet. |
| RL84 | Resolving the contradiction applies revision9, marks its repeat duplicate and revision6 superseded. Destination10 leaves source contradictions diagnosed. Six-row accounting persists. | My predicted stale label for resolved revision6 was wrong: source reduction marks it superseded before destination comparison. Scope and the article explain that order. |
| RL85 | Zero parents gives1 command/5ms each. Twenty gives21/210ms versus2/20ms. All repeated commands remain visible. | Yes for exchange counts. The unchanging ownership path takes a large extra panel and repeats later Figure2. |
| RL87 | High estimate/low memory chooses4 hash batches. High estimate/one actual key scans90000 for1 match. | Yes as bounded operation counts, not a real planner or measured spill. The article entrance switches examples twice and needs repair. |
| RL89 | 1Nov prunes October/routes November. Detach keeps physical s7; parent sees November only and31Oct insert fails. | Yes. Detached physical table and direct-read result distinguish visibility from deletion. |

The raw initial screenshots, schemas, recorded cases and resulting screenshots are in `/private/tmp/staycurrent-media-review/design/`. They are local session evidence, not committed publication assets.
