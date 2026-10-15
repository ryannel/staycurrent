# Independent reading log

Agent reading of frozen afbf6f7, browser-rendered at 4322 initially, identical frozen preview 4324 subsequently. Intended perspective: application engineer with little database practice. I retain database knowledge; observations identify steps the prose supplies rather than impersonating a human novice. No source or other reviews inspected. Chromium 1280×1000, rendered innerText delivered in bounded sections, actual screenshot inspection for media. Closed details are marked separately. No human comprehension claims.

## Sequential observations

### Overview, opening and Tables, rows, and columns
Read every sentence of opening paragraphs and this section, including table labels and values. Opening raises how changes remain organised, without needing an immediate answer. Product table gives concrete units and identities; P7 is Blue mug, €20, 5 items. Schema, type, key and engine each receive definitions. No unresolved prerequisite. Visual table inspected: clean alignment and separation of products; its note distinguishes logical representation from disk. Limitation: first extraction delivered the whole section including prose after the table before screenshot inspection; following media boundaries will be split before continuation.

### Overview, Relationships, nodes 6–13
Schema paragraphs reread after switching to node delivery. Relationships make the duplication problem concrete. Before reading onward: references let me reconstruct Ada → O12 → P7, quantity 2. Illustration's bent connectors and repeated IDs visibly match the prose. The one-record-per-sheet caption prevents mistaking these for the entire tables. Question carried forward: an order must retain price paid if product price changes; no claim yet that current price belongs in purchase history.

Correction to preceding visual note: the pixels in overview-13 actually show labels and IDs but no visible sheet outlines or connecting strokes. My earlier phrase about bent connectors was an inference, not what the screenshot establishes. This weakens the visual's relationship explanation: repeated IDs can be read, but spatial correspondence alone must do the work. Flag for media review; investigate whether screenshot timing is involved before treating it as a stable defect.

### Overview, Relationships continuation and Queries, nodes 14–20
Price-paid question resolved exactly in next substantive paragraph, with €18 versus €20. Good pacing. SQL reads from matching IDs to WHERE order O12, then SELECT name and quantity. Can trace Blue mug, 2 without supplied expertise. Screenshot shows code and result well separated; no control implied. Query label explains that records remain unchanged.

### Overview, Indexes, nodes 21–26
Query planner defined by its job. Index explanation distinguishes orders-by-customer from customer primary key before reader could conflate them. Trace C4's two entries to O12 €36 and O13 €44 succeeds. Visual table highlighting carries the mapping; no interaction. The note honestly says it does not show searching the index. Curiosity: how sorted lookup narrows search remains outside this overview's promise.

### Overview, Indexes continuation through Concurrent access, nodes 27–43
Read sentence by sentence. Index costs and query dependence clear. Constraints → valid but incomplete order → transaction is an effective transition. Atomicity, durability and outside payments defined through outcomes. Concurrency example supplies engine and behaviour limits. Lock illustration's two lanes make the delayed stock check easy to place; waiting label clearly precedes zero-stock read. Visible figure avoids asking me to remember both buyers' timelines. No controls. Text extraction included accessible sequential descriptions after the table, not an additional ordinary visible paragraph; screenshot gives actual visible path.

### Overview, Concurrent access continuation to next-reading navigation, nodes 44–60
Check-before-change emphasis resolves why merely waiting on the write is insufficient. Earlier-view reads and reservation explicitly separated. Isolation remains broad but the default example is enough to follow. Replica/shard distinctions and competing resources explained without unexplained implementation terms. Navigation presents three main deep dives and column-store teaching reference; planned onward reading clearly marked. No new unresolved question.

### Overview, collection map and sources, nodes 61–65
All default-visible labels read. Main/depth sequence supports requested route: design → constraints → JSON; query → pagination; transactions → isolation → conflicts. Optional separate-shop tour and sandbox explicitly distinguished. Collapsed planned groups not opened as substantive reading. Sources clarify engine caveats. Overview coverage complete: nodes 0–65, all five media inspected (products, connected records, SQL result, index, lock timeline); no interactive controls.

### Design, opening and schema/data figure, nodes 0–3
Structure versus records distinction clear, with name repetition versus primary-key uniqueness made explicit. Pixels connect schema definition to concrete two-column records and another row. No controls. Root supplied capture reliability note only: lazy images may need decode after scroll; adapting capture to await this. Earlier overview image concern remains provisional.

### Design, facts and healthy design, nodes 4–11
Fact definition anchors abstraction in C4/Ada. Normalisation promises first three forms rather than assuming them. Name correction example builds on overview. Figure's side-by-side representation visibly preserves two orders; highlighting repeated Ada versus one Ada makes reference repetition distinct from repeated fact. No unsupported step.

### Design, Choosing records and dependencies opening, nodes 12–27
Each sentence and example traced. C4/O12/O13 continuity maintained; O13 adds P8 and new unit price with explicit setup. Composite key explanation identifies both ambiguity directions and then explains deliberate repeated products. Candidate-key minimality phrase “needs every column ... to do so” is precise and readable after examples. Functional dependency arrow explained as one-way, so C4's two orders cannot invert it. No unresolved issue before continuation.

### Design, dependencies continuation and 1NF, nodes 28–36
“Determines” caveat answers temporal-change question before it becomes confusion. 1NF's nested entry → identified row mapping follows both items. Visual preserves product/quantity/price association and underlines both key fields. I can predict adding line 3 changes rows only. Question at boundary: does a list-valued field always violate this, or only when entries need identity? Await continuation; earlier article promised JSON treatment.

### Design, 1NF continuation and 2NF, nodes 37–44
List question answered by useful-unit paragraph and JSON destination; fixed scalar slots explicitly distinguished from repeating nested groups. 2NF traces order → customer/time and removes duplication. Figure clearly highlights repeated order facts, then separate order and line tables. The caption accounts for quantities/prices omitted here and supplies time's date/zone. No missing fact needed to follow.

### Design, 2NF continuation and 3NF, nodes 45–51
Formal 2NF wording comes after worked movement. 3NF changes from customer chain to analogous product chain; prose signals same problem. Screenshot is larger but scan remains possible: amber catalogue columns move, agreed prices retained. I traced O12 €18 unchanged while P7 current €20. No controls. Definition of non-key field relies on familiar “not part of key”; reasonable at this point.

### Design, 3NF continuation and relationship overview, nodes 52–55
Default path: optional overlapping-keys detail closed; four-table explanation follows. Relationship visual inspected before more prose. I can trace O13 → C4 and O13 lines → P7/P8 and see why line 1 repeats across orders. Layout uses named reference arrows and explicit many/one text; this removes the need to remember three paths. Opening optional formal detail now, separately from default sequence.

Optional node 53 opened: formal overlapping-key definition is dense without a concrete example, but explicitly declares it outside this example and points to further reading. Curiosity, not a main-path blocker. I supplied mathematical comfort to parse “outside the determining set”; a novice pursuing that optional topic could use a tiny overlap example, but no expansion needed to understand current design.

### Design, connections and lossless decomposition, nodes 56–61
Definition follows a full trace of O13 line 2 to Bowl/Ada/€24. Predicted bad join yields four pairs; figure explicitly marks cross-associations with contrasting strokes. Excellent support for why complete identity matters; prose also says this hypothetical split need not be useful. No controls. One-to-many and many-to-many both grounded in observed records.

### Design, history and fact-change demo, nodes 62–68
Customer uniqueness consequence explained. Historical price receipt traces 2×18=36 versus 2×20=40. Demo explicitly resets catalogue to EUR 18, preventing false continuity with prior EUR 20. Prediction before controls: correcting copied names should leave one outdated copy; reference layout should update both displayed names with one stored change; changing catalogue should leave receipt EUR 36.

Capture limit: node 69 was an inline script inadvertently included by generic article-child extraction; it was delivered in tool output. I did not inspect it for understanding or testing and changed extraction to exclude SCRIPT/STYLE/NOSCRIPT. This prevents a wholly uncontaminated claim for this demo; all interpretations and predictions above follow visible text. Subsequent node indices shift because scripts are excluded.

Demo tested both layouts, partial and completed copied correction, catalogue change, layout reset, and opened assumptions. All predictions held; screenshot confirms current-name highlight and visually separate current/purchase prices. Assumptions explicitly exclude transactions and automatic propagation, avoiding overclaim about copying. Reset-on-layout change observed. Explicit Reset button remains unclicked at this stage; no assertion of its behaviour.

### Design, history continuation and separation, nodes 69–75
Address and product-name caveats extend exact meaning of historical facts; ID does not freeze values. Excess split explained in terms of extra coordination, not arbitrary table count. Diagram displays two related records needed to rebuild one product; arrows/IDs visible. Caption anticipates multiple-currency/history exceptions. No controls or unresolved inference.

### Design, denormalisation and types opening, nodes 76–84
Derived summary responsibility clear and grounded in application freshness tolerance. Types explain string comparison with concrete “10”/“2”; figure adds 100 to demonstrate prefix length. Can predict ascending integer 2,10,100 and text 10,100,2. Visual layout supports comparison without distraction. No issue.

### Design, type families, dates, units and missingness, nodes 85–99
Every type example traced: leading zeros, numeric(12,2) rounding 18.005→18.01, boolean inadequacy for several states, same instant in offsets. This is a long informational stretch but each paragraph supplies practical meaning. NULL's different possible reasons explicitly motivate state column. Type-to-constraint transition uses minus two/P99. No blocking gap; timestamp future scheduling is curiosity rather than a requirement to implement here.

### Design, enforceable definition, nodes 100–112
Followed CREATE TABLE line by line, then explanations. Primary key covers NOT NULL omitted on first two fields; later paragraph resolves apparent omission before insert exercise. CHECK versus NULL and unique absent SKU carefully explained. Small syntax question at code: what does `::numeric` do? “extra comparison excludes ... special numeric value” conveys purpose but does not name conversion syntax. Not blocking arithmetic or outcome; note as adaptation friction if never resolved. Deletion actions appear in code before explanation; carried forward.

### Design, insert and rule experiment default, nodes 113–115
INSERT values map unambiguously to listed columns. Default accepted repeated product uses distinct line 2. Before controls, predict missing quantity rejected only by required-value rule; zero only by positive check; P99 foreign key; repeated identity by key; extra product uniqueness disallows valid repeated P7. Screenshot clearly distinguishes stored/proposed and labels proposal not persisted. Controls visible, no hidden prerequisite.

Rule demo exercised required sequence: NULL rejected, removing NOT NULL accepts it, Restore reinstates rejection; repeated P7 accepts until extra uniqueness selected, then rejection. Opened model assumptions: six proposals, not database execution, and errors unordered. Screenshot makes rejected proposal amber and explanatory status legible. Both main teaching contrasts confirmed.

### Design, deletion and constraints boundary, JSON opening, nodes 116–129
Deletion-action question resolved with distinct product/history versus order/owned-lines roles. Caveat that cascades do not authorize completed-order deletion useful. “Every line has order” versus inverse remains memorable. JSON object introduced as alternative for varying description with type-check before UPDATE. Predict attributes required object; default {} not absent. Note visual correction: prior rejected proposal retained green field background; amber was status border/text, not entire proposal. Status words still make outcome clear.

### Design, JSON limits and details table, nodes 130–141
Read rule table row by row: object≠typed capacity; {} accepted; array and SQL NULL rejected. Mug-details query gives aliases before code, then traces P7→350. Explicit at-most-one versus every-mug requirement prevents overreading FK. Fractional input conversion correctly left for depth article. Supplier offer independent-life criteria make rows-versus-object choice actionable. Whole-object stale write warning understandable from app-code background; concurrency details appropriately deferred.

### Design, practice and prediction, nodes 142–156
Default-visible setup distinguishes browser tutorial from full PostgreSQL file and explicitly resets receipt after earlier insert. Query aliases, arithmetic and ORDER BY explained before code. Receipt 2×18=36 traced. Practice setup not executed; no claim that reading proves launch usability.

Prediction saved before answer: current product name Sea-blue mug; quantity 2; unit price 18; total 36. Original printed name cannot be recovered from fields shown because only current name retained. Relevant support: nodes 69–71 history, 147 fresh load, 148–152 query. Opening answer next.

Opened prediction answer matches saved reasoning. No unexpected dependency.

Design coverage complete: all default-visible nodes 0–159 (original indices 0–161 before script filtering), every sentence/code statement/result and labels; optional node 53, both demo assumptions, final answer opened separately. Media: schema/data, name normalisation, 1NF, 2NF, 3NF, relationships, lossless split, fact-change demo, excessive split, type ordering, rules demo. Source descriptions read, external references not followed (blind reading).

### Constraints, opening and shared-enforcement illustration, nodes 0–4
Earlier design carried forward but introductions are self-contained. Figure's three writers converge on one requirement; passing foreign key explicitly not enough to pass all constraints. Actual arrows and contrasting P7/P99 outcomes visible. No questions unresolved.

### Constraints, scope and practice setup, nodes 5–22
Rule scope reinforces valid repeated product and per-order line identity. Same-facts claim matches prior design. Optional SKU semantics explicit. Default path names fresh database and failed examples as separate statements; this is enough to avoid carrying earlier mutations blindly. Link text “Designing a relational schema” differs from page title “Designing your data”: minor naming inconsistency, not confusing destination in sequence. Opening optional definitions/records before proceeding to runnable snippets.

Opened definitions and records: all CREATE/INSERT statements read and mapped. Difference from downloaded file explicit: inline records only O12 whereas download also O13. No needed missing field. SQL execution not attempted.

### Constraints, CHECK and required values, nodes 23–28
SQL probe outcomes follow prior explanation. Default demo makes comparison TRUE separate from CHECK Pass; predict NULL comparison UNKNOWN with Pass until NOT NULL independently rejects it. Screenshot's simple stacked result keeps distinction clear. This repetition adds observable mechanism beyond prior design demo.

Quantity demo tested all four choices plus NOT NULL and opened meaning. Outcomes matched saved prediction; positive restored accepted with NOT NULL enabled. Screenshot confirms clear independent rule statement. No control friction.

### Constraints, checks/types and uniqueness, nodes 29–43
Earlier `::numeric` syntax question now explicitly resolved in node 30, alongside <>. Moving that short gloss to first design appearance would reduce forward dependency but current reading resolves it. Each five-line insert attempt traced: accepted line 2 persists, attempted line 1 duplicate, P99 absent, zero false, NULL missing. Failed line-3 attempts do not persist, so reuse of 3 is coherent. SKU NULL versus assigned duplicate mapped to P8/P9 and P7/P10. No unresolved conceptual question.

### Constraints, references and deletion, nodes 44–51
Composite FK passage carefully accounts for earlier successful O12 line 2 insert, avoiding stale example. Some memory effort: “before it runs” requires mentally reverting that prior insertion; explicit sentence makes it possible. Diagram starts each deletion attempt fresh and shows first line only. Pixels distinguish refusal with all kept versus crossed-out order/line and kept product. Arrow direction changes for cascade but caption explicitly explains it. No controls.

### Constraints, deletion timing and concurrency, nodes 52–61
SET NULL conflict with required reference explicit. NO ACTION deferral concept introduced briefly; sufficient distinction, deeper implementation curiosity. SELECT/conditional INSERT comment marks application branch rather than unconditional executable sequence. Separate P11/P12 IDs in timeline prevent primary-key collision masking SKU point. Visual wait spans A's uncommitted insertion through commit, and final error/result clear. No controls.

### Constraints, wider operation and sources, nodes 62–73
Precise SKU guarantee stops overgeneralising concurrency protection. Empty order, stock-read staleness and accepted price/payment examples mark what stored rules cannot know. Transition to JSON natural. Coverage complete: 0–73 every sentence/code/result; details 18/19 and demo explanation opened. Four media inspected: writers, quantity model, deletion, SKU timeline. Only quantity model interactive, all input choices tested. No substantive repair beyond earlier minor naming/syntax friction.

### JSON, opening and nested-values illustration, nodes 0–7
JSON key versus primary key explicitly separated. Figure's nesting supplies path to height and array distinction; app engineer already knows object shape, but new point is one stored row. Pixels show container hierarchy and braces clearly. No controls.

### JSON, broader schema and three arrangements, nodes 8–12
Document scope limited to relational JSON value. Supplier duplication versus product-owned details distinguishes normalisation from storage nesting. Three-column figure is wide but legible at desktop: identical P7/350 values, nested versus separate row boundaries explicit. Rule limitations displayed at each alternative. No controls; no extra knowledge needed.

### JSON, typed columns and related records, nodes 13–26
Read every sentence and DDL. Optional applicability versus missingness acknowledged. Range 1–2,147,483,647 concrete; incoming fractional treatment explicitly deferred to later, so no premature integer validation assumption. Supplier identities and generic triples give operational criteria rather than slogan. No unresolved gap; await promised input rule.

### JSON, runnable reset and null/type query, nodes 27–42
Reset after alternative mug_details snippet explicitly stated on default path. JSONB preservation limits clearly bounded. CTE syntax explained before sample query. Trace all five rows: missing key false/NULL/NULL; JSON null true/'null'/NULL; number/string same text but differing json_type; SQL NULL all NULL. Quoted 'null' versus SQL NULL formatting prevents conflation. No missing prerequisite for this trace.

### JSON, extraction demo default, nodes 43–44
Prediction follows five-row table: JSON extraction preserves number/string/null distinctions; text loses them. Default screenshot pairs exact expression with value, legible code. Whole SQL NULL probe explicitly allowed only diagnostically, not current schema. Exercise all alternatives next.

JSON probe all alternatives tested and assumptions opened. All match saved prediction; NULL existence returns UNKNOWN, not false. Last screenshot confirms SQL NULL repeated in expression outputs. No adaptation gap beyond promised subsequent numeric casting.

### JSON, queries and completed capacity policy, nodes 45–59
Initial integer query traced: P7 returns, P8 omitted by UNKNOWN. Type-only check deliberately insufficient, with fraction 350.5 called out before replacement. Final conversion policy stated before code, CASE evaluation boundary explained. Trace 350: number→range true→trunc equal→integer 350→insert→remove key→commit. Predict 350.5 reaches numeric but fails whole-number test, NULL causes insert failure; transaction should then be rolled back (next text expected to explain recovery). Practical input-policy promise appears fulfilled, subject to outcome continuation.

### JSON, conversion results and indexes, nodes 60–72
Rollback and preserved JSON resolve previous question immediately. Read all input-policy rows, including 350.0 permitted but string “350” not. Final mixed query matches all stored capacities; GIN versus capacity B-tree explanations give jobs before index syntax. Stale whole-object warning explicitly resets to separate illustration, avoiding assumption capacity still in JSON. No unresolved requirement.

### JSON, stale whole-object illustration, node 73
Tracked both snapshots, A's matte, then B's stoneware with old gloss. Diagram numbered steps and highlighted final lost field make causal sequence clear. jsonb_set current-column contrast restores matte without unexplained lock magic. No actual overlap/wait carefully stated. No controls. A concrete version-comparison alternative is onward curiosity, not needed for this mechanism.

### JSON, targeted update and offer rows, nodes 74–78
Each jsonb_set argument explained, including string's double quotation. Offer diagram ties row outline to conflicting update target, and separate rows clearly share P7 but differ S1/S2. Caption prevents treating separate rows as globally independent transactions. No control. This is useful visual support for an otherwise abstract row-lock boundary.

### JSON, migration and final design, nodes 79–93
Readers/writers rollout illustrated by finish rename, consistent with earlier duplication reasoning. Final design restates input policy and authoritative capacity home, fully resolves earlier intermediate failure exercise. Coverage complete: all 94 rendered nodes, all code/result rows; four static illustrations and extraction demo visually inspected, all demo alternatives and assumptions read. No substantive comprehension finding.

### Query, opening and result-grain illustration, nodes 0–8
Continuity O12/O13 matches earlier values. Promise includes physical work after result semantics. Figure shows three possible answers from three source lines, one-row meaning named for each. Can trace 36 and 20+24=44. Visual helps distinguish repetition from error before joins. No controls or questions.

### Query, first SELECT, joins and missing matches, nodes 9–31
Read queries and rows in sequence. Aliases and result grain now familiar. FK+PK exactly-one explanation is strong. Question at left-join result: where did O14 come from? Opening and earlier joined-lines result only established O12/O13. Next paragraph resolves that it is Ada's empty header; no lasting logical gap, but first result requires accepting a new source row before setup is stated. Ben's addition is announced before query, whereas O14's is after. Small sequencing repair candidate: introduce O14 beside C5 before query. Optional Run examples still closed on this default path; opening now separately.

Optional setup supplies O14 and two shipments explicitly before runnable path. Thus O14 issue confined to default-visible reading, minor pacing rather than omitted information. All setup SQL traced; no execution attempted.

### Query, NULL filtering and grouping, nodes 32–52
ON versus WHERE traced with both never-ordered Ben and earlier-only Cara: latter is key to understanding no replacement null row. All result rows follow. Group counts O14 = joined 1/real lines 0/SUM NULL, then COALESCE explained as display choice. HAVING prediction: only O13 44 qualifies. Separate filter copies prevent contamination of later totals. Optional filter setup pending, open next.

Optional filter setup read: temporary-table lifetime and one-time execution spelled out. SELECT * gloss via copying rows supplies meaning. No new issue.

### Query, HAVING result and multiplication, nodes 53–57
HAVING result matches prior prediction. Shipments announced before join, unlike earlier O14. Traced all four line×shipment pairs and 88 inflated sum. Figure visibly gives four result tiles and contrasts actual 44. Caption stops interpreting pairs as actual shipment contents. No controls. Need fix preserving both counts/totals anticipated next.

### Query, summary-before-join repair, nodes 58–62
DISTINCT wrong-fix warning justified with two equal €20 purchases; no handwave. CTE summaries traced independently then O13 matches once each. Figure includes O12 in intermediate totals but final filter O13 explained, so no phantom omission. At this point code WITH syntax has been introduced in prior JSON page; direct entrant to query main article has not yet had a definition here. Await following prose before flagging, because diagram sufficiently shows function.

### Query, WITH explanation, variation, EXISTS and work transition, nodes 63–82
WITH explanation immediately follows figure, resolves direct-entry syntax question. Prediction before opening node 65 answer: 3 lines×3 shipments=9; line total 20+24+20=64 repeated thrice=192; separate summaries 64 and 3; SUM DISTINCT 44 wrongly collapses two €20 lines. Main-path subsequent receipt explicitly returns to unchanged O13 two lines, so variation isolated.

EXISTS constant 1 and outer correlation explained after code; result once per order intuitive. NOT EXISTS O14 fits prior empty header. Physical-work transition uses same receipt and states inner/left rearrangement difference with prior cutoff example. No new gap.

Opened variation answer matches all predictions. No explanation supplied by outside knowledge.

### Query, observed plan and flow illustration, nodes 83–90
Read every plan row. New ANALYZE statistics command named, outcome context clear. Emitted-versus-inspected count explicit. Materialize and unique-key early stop explain P7 then P7/P8 sequence. Question at plan number 1.50 loops=2: fraction of a row needs averaging explanation; not yet given, likely next. Diagram shows two branches and retained product input, resolves direction of nested indentation. No controls.

### Query, averages and algorithm experiment, nodes 91–101
Fractional-row question resolved immediately with 1+2 over two loops; no repair needed. Algorithm model states full scanning even after a match before experiment, so differing count from actual plan is explained. Prediction: 200×6=1200 comparisons versus 200 entries+6 probes; one receipt line leaves build 200 and probe 1. Screenshot boundary limitation: experiment is plain section (no figure/custom tag), so initial extraction also delivered three following paragraphs before stopping. Updated detector to include ordinary controls. Those paragraphs reinforce but do not supply calculations above. Inspecting pixels and controls now.

Algorithm controls tested prescribed 200 products/6 lines, both methods, then one line; all predicted counts and receipt rows match. Pixels show textual step list plus table. It is an interactive worked calculation rather than animated search; adequate to isolate repeated work, with explicit unequal cost units. No usability break.

### Query, strategies and planner close, nodes 102–114
Merge join described only enough to distinguish work, appropriate planned depth. Cardinality/statistics and estimate divergence grounded in repeated work; no claim that own model proves speed. Final wrong-fast €88 versus correct €44 connects performance to semantics. Coverage complete: 115 nodes all sentences/query lines/results, optional setups and predicted exercise answer; four static figures plus algorithm model visually inspected. Main small repair: introduce empty O14 before its first result row.

### Pagination, opening and total order, nodes 0–15
Fresh example reset explicitly separates O14 times from previous article. Trace descending tuple: O16,O15 at 12:00; O14 deferred despite same time. Total-order versus frozen-set distinction directly stated. Text IDs not commit order caveat prevents chronology inference. No missing premise.

### Pagination, offset and saved boundary, nodes 16–37
Each offset table row traced, alternate changes explicit. Tuple explanation handles tied O14 and deleted boundary values. Statement snapshot distinction already learned in overview, repeated clearly. Demo default pixels show source sequence above two result panels. Predict insertion: offset O15/O14, keyset O14/O13; deletion O13/O12 vs O14/O13; moved unread O14 to 13:00 crosses before boundary, keyset misses it; offset now O15/O13 repeats O15. Save before controls.

Pagination model all mutations and assumptions read; predictions match, including mutable-key limitation. Pixel positions and already-read labels make shifted sequence legible; model genuinely helps compare identical second-read rows. Optional setup from earlier opening now inspected separately.

Optional setup read: fresh database, statement-by-statement and rollback alternatives explicit. No execution attempted. It adds headers only consistent with default grain.

### Pagination, token, work and live-list contract, nodes 38–54
Opaque cursor explained from client/server roles; extra-row lookahead instruction precise (token from displayed second). Index candidate introduced as possible route, cost claims bounded. Grain warning connects directly to query article. Live-list limits follow tested move case. Optional page-of-orders detail opened next; predict two order identities limit, followed by all matching lines.

Optional order page trace matches predicted two headers/three lines. Oldest-first switch explicit, single-statement view assurance anticipates export. No missing join/setup premise.

### Pagination, fixed export and visibility figure, nodes 55–64
Cutoff versus snapshot distinction concrete via late commit inside bound. API cursor versus database cursor clearly named. Export changes all-customers and oldest-first explicitly. Fetch trace 12/13,14/15,16 fits original five; main prose says original five but does not give executable cleanup after earlier standalone O17 insert. Optional setup says downloaded experiments roll back, so runnable-download path is clear; reader manually copying only default snippets needs to reset O17. Minor practice continuity issue, not conceptual blocker.

Figure visually contrasts corrected O14 postponed in fresh view versus old 12:00 retained in snapshot. Two query mechanisms not conflated; caption also allows separate page statements under one repeatable-read transaction. No controls.

### Pagination, resource cost and resumable work, nodes 65–74
Long snapshot costs and fixed-artifact alternative actionable. IDs versus values snapshot distinction reinforces history design. Checkpoint/effects failure pair sets up next collection without pretending pagination claims work. Coverage complete: all 75 nodes, optional run/setup and order-line detail, all model mutations/assumptions, export figure pixels. No substantial comprehension defect; minor manual-snippet reset caution retained.

### Transactions, opening and boundaries, nodes 0–12
Scope promise explicit: grouped purchase, concurrent requests, multi-record rule, errors/missing reply/payment. Definitions ACID and session supplied, autocommit client caveat not assumed. Own uncommitted writes versus other snapshots explained before operation. No unresolved prerequisite; preceding pagination knowledge reinforces connection lifetime.

### Transactions, checkout rule and endings, nodes 13–16
Explicit fresh O14 absent despite earlier pages' header prevents continuity error. Three available, buy two→one traced. Figure shows all three changes within common boundary and alternatives below, with rollback preserving prior three. No controls; useful whole-operation depiction.

### Transactions, application handler, nodes 17–30
All JavaScript/SQL statements traced. Driver/pool/session and awaited result/error explained for app-code audience, no implicit interactive prompt. Conditional UPDATE reserves same quantity inserted; zero rows distinguished from exception. Early snippet lacks catch/release but clearly first part; await continuation for cleanup. Stock 3→1 and inserts before commit consistent.

### Transactions, error path and cleanup, nodes 31–45
Normal-branch incompleteness explicitly labelled immediately, then failure path. 23514 explained as CHECK rejection and catch rollback removes provisional stock/order without compensating update. Unknown COMMIT distinguished before broad handler shown. Cleanup responsibility gives reason for pool release/discard. Opening whole-handler optional detail next; no inference that snippets are standalone complete code.

Optional full handler read line by line. commitSent guards unknown outcome; reusable false drives discard if cleanup fails. Adapter is deliberately not implemented but precise narrow contract and examples prevent treating any SQL error as confirmed rollback. Application engineer can follow branches without database internals. Retry and durable recovery explicitly outside function and promised later, so no false production-completeness claim.

### Transactions, unsafe stale write and guarded alternative, nodes 46–62
One-mug reset and distinct O14/O15 explicit. Unsafe code both computes 0; locks serialize writes without recomputing app value. Guarded SQL rechecks condition after A commit and zero rows choose rollback. A rollback branch reserved instead, so waiting remains undecided. Optimistic-version idea answers curiosity from JSON stale object without derailing. Optional psql details opened next.

Optional psql full path read: fresh reset before alternative, successful reservation branch condition explicit, expected error not command, final inspection counts 1/1/1 versus 3/0/0. No execution attempted. Main stock setup is conceptual, optional executable table supplies constraint needed by prior argument.

### Transactions, longer decision and locking read, nodes 63–68
Partial-fulfilment motivation explains when lock-first differs from single SQL condition. Example intentionally simplifies back to one mug, clear. Application if only runs after awaited read returns; state transition not magic DB branch. Figure juxtaposes B's planned-zero path versus delayed read-zero decision. Pixels support causality; no controls.

### Transactions, lock scope and concurrent model default, nodes 69–71
Absent-row lock limitation stated; later multi-row coordination promised. Default model shows committed values separate from in-flight request state. Predict unsafe commit ends two purchases/stock0; guarded and locking commit ends one/0 with B declines; if A rolls back then B purchases so final one/0 across methods. Will inspect intermediate waits as well as ends. Screenshot's control/step and request panels clear.

Concurrent model tested all five steps for unsafe commit, conditional commit, lock commit, lock rollback; Previous and Start again verified, assumptions opened. All observed outcomes match prediction; committed counter stays 1/0 during pending reservation, then reflects transaction ending. Did not exercise unsafe/conditional rollback combinations; those remain untested UI branches. Screenshots of default, conditional end and lock rollback end inspected.

### Transactions, versions and multi-row rule, nodes 72–86
MVCC visibility metadata not copied tables distinction helps. Price table traces statement vs transaction views and new report. Repeatable-read locking may fail explicitly contrasted to earlier default behaviour. Multi-row display rule introduces separate scenario; count two allows both individually but empty combined. Need serialisation/coordination solution anticipated. Optional report commands opened next.

Optional report exercise read: pause point and other connection ordering explicit, fresh price reset. No execution attempted. No hidden default-path premise.

### Transactions, featured-product anomaly figure, node 87
Pixels show same initial enabled pair feeding different-row writes and empty combined result. Caption's serial-order counterfactual proves why outcome invalid under serializable instead of asserting it. No controls; stable view versus coordinated decision clearly separated. Question: how to lock a common coordination record is useful practical next step, likely following.

### Transactions, serializable, coordination and retry, nodes 88–101
Common-lock question answered with fixed two-row order versus dynamic shared display record; every writer protocol explicit. Deadlock table exposes cycle and consistent order without overclaiming all deadlocks solved. Retry whole decision after releasing connection is concrete; pseudocode clearly labelled. Await pending recovery promise. Optional featured SQL opened separately.

Optional featured SQL read. Human-as-handler branch test explicitly distinguished from SQL comments, both count before updates and error location/victim unspecified. No execution attempted.

### Transactions, unknown commit and stable operation identity, nodes 102–112
Known failure vs missing answer causality clear. Claim-before-stock reorder explicit; no-returned-row branch reads existing result, verifies request and closes read-only attempt. Nullable operation_id historical rows acceptable because extension active paths carry K14. Same proposed O14 in replay assumes no unrelated order-ID collision; later scope may address. Demo changes stock to five explicitly so duplicate purchase can succeed. Predict committed+same key ends stock3/orders1; committed+new ends stock1/orders2; rollback+same ends stock3/orders1. Pixels separate database reality from application knowledge, essential distinction.

Recovery model: every step of committed/same, committed/new, rollback/same tested. Predictions matched; application unknown at step2 identical despite counters differing. Opened assumptions explicitly disclose original transaction already ended; live repeated claim may wait. Did not test rollback/new branch or Previous/Start again on this second widget; selection reset observed. Screenshots inspected default and both final hidden-history contrasts.

### Transactions, authoritative recovery and payment, nodes 113–119
Missing-row lookup not proof of failure, subsequent Read Committed statement after conflict wait, lagging-replica concern all addressed. Payment workflow explicitly beyond runnable schema; pending means not fulfilment-ready. Figure shows confirmed success/decline branches and unresolved timeout separately. No magical rollback across external provider; repeated cancellation warned. No controls.

### Transactions, durable external workflow and review, nodes 120–131
Pending restart gap motivates outbox, repeated delivery limit explicit. Final review connects zero rows/rejection/missing reply to distinct decisions. Coverage complete: 132 nodes, complete handler + three practice details read separately; commit/rollback, lock timing, featured anomaly, payment workflow static media and two demos inspected. All central interactive contrasts exercised, remaining combinations disclosed. No substantial comprehension issue.

### Isolation, ordinary snapshots and demo default, nodes 0–14
Repeated prerequisite now concise and focused; ordinary SELECT excludes lock behaviour explicitly. Predict Read Committed report20 then22, Repeatable20 then20 while committed box22 both. Default pixels show writer between report's two reads, report boundary implicit in heading. No unexplained transition.

Snapshot demo both schedules all three steps, Reset and assumptions inspected. Results match predictions. Screenshot keeps returned20 historical labels after committed22 updates, so view distinction survives without remembering earlier frame. O12 agreed18 explicitly unrelated in assumptions, though default narrative already catalogue-specific.

### Isolation, runnable schedule and own writes, nodes 15–28
Every command followed; two connections/default reset instructions explicit. Own update20→21 then rollback20 concrete. Changed-row rejection at Repeatable Read described separately from ordinary snapshots. “Concurrent changes” link label differs from current main title, another minor navigation-name inconsistency. No conceptual gap.

### Isolation, featured display, nodes 29–35
Scenario explicitly separate inventory/catalogue, same anomaly from main retained. Figure reused, visually checked again; no changed identities or values. Read setup flags and two decisions, no unsupported step. For complete route repetition is substantial but depth article self-contained entry justifies recap.

### Isolation, write skew SQL and common control row, nodes 36–48
Deeper value over main: single conditional UPDATE still depends on other row, so guarded-write slogan alone insufficient. Trace EXISTS true on old other flag; same SQL Serializable can reject; retry can legitimately affect zero. Common control row sequence makes waiting plus subsequent fresh statement explicit. Figure table shows B hasn't read flags during wait and uses next statement after acquiring. Caption's Repeatable Read caveat important and legible. No controls, no issue.

### Isolation, decision summary and sources, nodes 49–57
Common-control caveat restated, reader decision follows actual rule. Coverage complete: 58 nodes sentence-by-sentence, all SQL traced, snapshot demo all states/Reset/assumptions, featured and control-row figures visually inspected. No optional practice disclosure beyond model; no external references opened. No substantive comprehension issue.

### Conflicts, waits and deadlock figure, nodes 0–15
Cancellation-sent versus confirmed distinction adds practical depth. No-row business result not automatic retry clearly stated. Deadlock figure holds/needs labels and two opposing arrows make cycle explicit; victim unspecified. No controls. Every sentence aligns with preceding transaction model; no new gap.

### Conflicts, ordered locks and retry pseudocode, nodes 16–28
FOR UPDATE inspection rollback explicit. Whole retry retains customer intent but may discover changed feasibility; SQLSTATE recognition clear. Pseudocode carries operation ID across process restarts and wait outside transaction. “Original request” retention implies durable caller state already stated; actual storage mechanism left to application. No blocker.

### Conflicts, missing commit reply figure, nodes 29–33
Alternative histories again explicit; visual routes two histories into same application knowledge statement. No controls. Identity K14 cannot be replaced without changing operation, already established but diagram makes indistinguishability strong. No unsupported inference.

### Conflicts, identity across attempts and repeat illustration, nodes 34–40
Durable caller/service identity examples address restart mechanism sufficiently. New proposed O15 with same K14 explicitly explains order ID versus intent. Timeline figure labels repeated O14 as state across moments, stock1→1 clear. Three-stock setup explicitly separate from main's five-stock demo. No controls.

### Conflicts, complete claim branches, nodes 41–57
Primary-key collision question from main explicitly resolved: ON CONFLICT applies only operation key. Every statement mapped: insert provisional, reserve2, condition rowcount, line, commit; existing branch lookup complete details, close branch. Main article existing read branch used ROLLBACK, this depth uses COMMIT when same request; both end no-write branch so no contradiction, but novice might wonder why command differs. Minor possible cross-article consistency polish, not faulty behaviour. No substantive unsupported step. Opening setup separately.

Optional setup read: fresh stock P7=3/P8=2, historical nullable operation keys rationale explicit. No execution attempted.

### Conflicts, recovery of pending original attempt, nodes 58–62
Current-stock reevaluation versus unchanged agreed intent explicit. Pending-key figure adds case omitted by main demo: empty read, claim waits, commit returns O14 vs rollback enables O15. Pixels distinguish alternative branches and final same stock1, operation K14 invariant. No controls. New connection/next-statement visibility fits learned Read Committed rule.

### Conflicts, retention and final response table, nodes 63–75
Key/result retention caveat closes expiry hole. All six response-table rows read, matching article evidence. Exercise prediction before opening answer: keep K14, empty lookup cannot settle active original; new key risks duplicate; confirmed deadlock means known noncommit and whole-transaction retry with same intent. Delivery caveat: closing chunk included response table after exercise, so this prediction is not independent of that visible recap, though its reasoning already followed nodes 60–64. Answer remains closed until next call.

Final answer matches recorded reasoning. Final article coverage complete: all 76 nodes, optional practice setup and exercise answer; four static illustrations visually inspected, no interactive model on this page.

## Capture recheck after completing original reading

Overview relationship illustration revisited with scroll-into-view and `img.decode()` before capture. `overview-relationship-loaded.png` visibly includes the four paper sheets, customer/product artwork and reference arrows. Earlier missing-stroke observation was an unloaded bitmap capture, not an established page defect. Withdraw it as a repair finding. Other media captures after this issue explicitly awaited image decoding. The reopened overview is an informed visual check, not a second blind interpretation.

## Prioritised findings and smallest repairs

No blocking conceptual gap emerged in this complete-route agent reading. This is not evidence that a novice human will understand every passage; it records what the assembled explanation supplied to this reader. The useful findings are small sequencing and practice-continuity repairs.

1. **P3 — Introduce O14 before its first result row.** Querying your data, Missing matches. Trigger: “Our added customer C5, Ben, has no orders,” followed by a result containing O14, then “O14 is different: it is a real order header belonging to Ada, though it has no lines yet.” I could not derive that extra result row from the default-visible setup until the following paragraph. The optional Run the examples detail does introduce O14, so the runnable setup is complete. Smallest repair: announce Ada’s empty O14 beside Ben before the query. Recheck: a reader can predict C4/O12, C4/O13, C4/O14 and C5/NULL before reading the result.

2. **P3 — State the fresh export setup beside the cursor example.** Pagination and large results. Trigger: visible `INSERT INTO orders ... ('O17', 'C4', '2026-10-04 13:00:00+00')`, later “Our practice table contains only the original five orders.” The optional setup says downloaded change experiments roll back, and the deletion discussion says to start again, but a reader manually following default snippets may still have O17. The conceptual explanation is clear; this is potential execution-state friction, not an observed failure. Smallest repair: say to restore the original five-order setup before the export, or link a concrete reset. Recheck: three fetches return exactly O12/O13, O14/O15, O16 from the named state.

3. **P3 — Gloss numeric-cast syntax at its first appearance.** Designing your data, enforceable order_lines declaration. Trigger: `unit_price <> 'NaN'::numeric`. The following prose explains the special value and comparison’s purpose, but `::numeric` itself is first explained in the later Constraints article: “::numeric interprets the quoted value as a numeric value.” I could follow the constraint’s outcome, but adapting unfamiliar syntax needed that later explanation. Smallest repair: move or repeat this short gloss at first occurrence. This is reduced effort, not missing argument.

4. **P3 — Align reading-link titles and the no-write replay ending.** Constraints refers to “Designing a relational schema” and “Designing a schema”; Isolation refers to “Concurrent changes” and “Handling waits, deadlocks, and retries,” while destination titles are Designing your data, Transactions and concurrency, and Handling conflicts and uncertain outcomes. These are understandable in sequence but make navigation less certain. Also the main transaction article says the existing-order/no-change branch “sends ROLLBACK”; the depth article says “enter COMMIT; to end that branch.” Both end a branch that made no writes. Use one convention or briefly explain why either ending preserves the same purchase. Recheck: readers recognise the same destination/protocol without wondering whether a different mechanism has been introduced.

None of these warrants expanding the collection. Useful onward curiosities already have reasonable destinations: overlapping candidate keys/BCNF, index search mechanics, query execution strategies, and complete payment workflows. Keep the successful concrete explanations: full line identity preventing invented pairs; UNKNOWN passing CHECK but not WHERE; repeated result grain versus stored duplicates; statement/transaction snapshots; and application evidence separated from database reality.

## Coverage manifest

Delivery used rendered Chromium DOM text, in document order, usually up to roughly 4,200 characters, stopping at figures or interactive controls. Each chunk’s questions and resolved interpretations were saved before requesting the next chunk. All prose sentences, code statements, result rows and labels in these chunks were read, not sampled. The sequential entries above identify every substantive heading group and media boundary.

| Page, requested order | Default-visible node coverage | Optional opened material | Media inspected as pixels |
|---|---:|---|---|
| Relational databases | 0–65 | No substantive details; planned groups remained closed | Products table; connected-records illustration; join SQL/result; index lookup; locking timeline |
| Designing your data | 0–159 after script exclusion | Overlapping-key 3NF; both demo assumptions; catalogue-change answer | Schema/data; name normalisation; 1NF; 2NF; 3NF; relationships; lossless association; fact-change model; unnecessary split; type ordering; rule model |
| Constraints in depth | 0–73 | Table definitions; initial records; quantity-model explanation | Shared enforcement; quantity model; deletion; concurrent SKU claims |
| Tables and JSON | 0–93 | JSON-model assumptions | Nested values; three row arrangements; extraction model; stale whole-object write; separate offers |
| Querying your data | 0–114 | Run setup; filter-copy setup; extra-line/shipment answer | Three answer grains; pair multiplication; grouped summaries; plan flow; algorithm model |
| Pagination and large results | 0–74 | Run setup; two orders with all lines; model assumptions | Mutation pagination model; fixed-export view comparison |
| Transactions and concurrency | 0–131 | Whole handler; commit/rollback psql; two report reads; featured-products psql; both model assumptions | Purchase endings; locking-decision timing; concurrent model; featured anomaly; recovery model; payment boundary |
| Isolation and snapshots | 0–57 | Model assumptions | Snapshot model; featured anomaly; common-control-row sequence |
| Handling conflicts and uncertain outcomes | 0–75 | Practice setup; lost-reply answer | Deadlock; alternative missing-reply histories; repeated K14; pending-claim recovery |

The requested nine-page route is complete. Optional last-blue-mug tour, sandbox tutorials, shared setup page, downloaded SQL files, external sources and planned articles were not traversed; none is counted as reviewed. Ordinary code/result tables were read through rendered text; the listed teaching media were also captured and visually inspected.

## Limits of this pass

- This is agent reasoning with existing database knowledge, not a commissioned novice human session or a claim of human surprise.
- No repository article source, author history, intended answers or other reviewer findings were consulted. One accidental inline script delivery and two media-boundary extraction overruns are disclosed in the sequential log; these prevent claiming a perfectly controlled blind delivery for those individual moments. The script was excluded from subsequent extraction and not used to derive behaviour.
- Default-visible text and subsequently opened details are distinguished. Rendered innerText occasionally includes accessibility-only captions/descriptions; screenshots establish the actual media appearance. No-JavaScript fallbacks were excluded.
- Browser models were exercised through their visible controls. Their results are model observations, not concurrent PostgreSQL runs. Main contrasts were tested; not every combination was exhausted. In particular, unsafe/conditional rollback and rollback/new-identity combinations remain untested, and some secondary reset/checkbox combinations were not exercised.
- Desktop viewport was 1280×1000. No mobile, keyboard-only, screen-reader or long-duration performance audit was performed.
- SQL was traced, not executed. Practice observations distinguish possible state ambiguity from observed execution failure.
- Screenshots are retained under `docs/article-work/collection-reader-passes/blind/`. This report was completed against the original frozen afbf6f7 preview before receiving repairs.

## Informed bounded recheck — revised preview on port 4322

Performed after the complete original pass and after receiving the coordinator’s repair targets. This is an informed transition check, not a fresh blind reading. Read only the affected rendered passages with nearby paragraphs, SQL and result rows; no article source or other review was consulted. The original observations above are retained unchanged. No code edits or commit made.

- **O14 before the left join: resolved.** “Alongside O12 and O13, Ada now has order O14, whose header exists but has no lines yet” now precedes both join explanation and SQL. The later table’s three Ada rows are predictable from this setup. The following paragraph now interprets the empty header rather than introducing it for the first time.
- **Original five orders before export: resolved.** Before the cursor code, the passage explicitly says to return to O12–O16 with original placement times and reload the practice setup after earlier insertions, deletions or corrections. The following three-fetch result is now tied to a visible reset instruction. This checks explanatory continuity; I did not execute the reset.
- **First numeric cast gloss: resolved.** The order-line constraint explanation now states that `<>` means not equal and `::numeric` interprets the quoted value as numeric. It sits beside the NaN explanation, so adapting that first declaration no longer depends on the depth article.
- **Composite foreign-key example reset: improved and resolved.** The passage now says “Return to the original two-order example ... before the accepted insert above adds O12’s second line” before asserting O12 has only line 1. The reader can distinguish this hypothetical original state from the successful earlier insertion without mentally repairing the timeline afterward.
- **Existing-operation cleanup: resolved.** The replay branch now sends ROLLBACK and releases its connection after inspecting the existing purchase, matching the main article. It immediately explains that ending this attempt cannot undo the already committed original purchase. The pseudocode also uses ROLLBACK on that no-new-order branch. Intent mismatch still rejects rather than treating a reused key as success.
- **Reservation/check/line sequence: resolved.** The guarded UPDATE now has its own code block. The following prose explicitly says zero returned rows means rollback, with no line INSERT or commit. Only then does “The handler checks that returned row before sending the line INSERT” introduce a separate line-insert block. The successful insert leads to a separately stated COMMIT and acknowledgement. This makes the application branch visible instead of relying on a comment between executable SQL statements.

No new comprehension issue found in these revised transitions. Existing limits remain: rendered explanatory recheck only, no PostgreSQL execution or fresh-reader claim. The original report’s broader link-title consistency observation was outside this targeted recheck, except that the revised composite-key passage now uses Designing your data.
