# Collection first reading

Audience: application engineer comfortable with basic programming, learning relational databases. Reading assembled DOM text delivered one numbered chunk at a time; optional disclosures are separate. This is an agent reading, not a human usability session or live interaction audit. No author briefs, source, prior article findings or evidence are used in this assignment. Capture root: `/private/tmp/relational-completion-review/` (15 October 2026).

## Introduction

00: The title marks this as a working draft. No teaching yet; heading introduces the subject.

01: Opening establishes tables as consistent shapes for kinds of information, and queries/changes as the database's two jobs. I can explain the subject without needing the shop's details yet. Productive question: what makes tables connect?

02: Different questions over shared records make the motivation concrete; simultaneous changes raise a justified next question. No missing inference yet.

03: Row versus schema change is particularly clear: another product adds a row; weight adds a column. Primary key defined through identity that survives a name change. I can read P7/€20/5 directly. Type/physical-layout distinction is sufficiently explained for an overview. Connection question remains productively open.

04: Connection question resolved: shared IDs refer to customer/product rows, while order lines carry purchase facts. The €18/€20 distinction prevents a misleading universal rule against repeated values. Illustration labels flatten awkwardly in text, but caption supplies all relationships; visual layout not assessed here.

05: The query is derivable before its result: P7/name from products and quantity 2 from the line. SELECT/ON/WHERE glosses support a programming reader's first SQL. Strong transition from arrangement to retrieving an answer. Caller is a general request, appropriate at overview scope.

06: Sorted C4 entries explain why this helps; table versus index distinction is explicit. Illustration keeps two C4 orders and their totals available together, reducing tracking effort. Productive curiosity about the narrowing algorithm is deferred to Indexes. No requirement to explain tree internals here.

07: Constraints get a reason from the previous join, then expose their own limit: a valid customer does not make a complete purchase. This prepares the next question naturally. SQLite qualification is brief enough not to break the thread.

08: Grouping answers the incomplete-purchase problem, with exact rollback effects. External payment/email boundary is clear without needing its eventual implementation yet. Curiosity: how do two purchases decide stock safely? Next section likely addresses it.

09: Stock race question answered. The figure explicitly puts waiting before the second check, and explains why delaying an already-decided write is insufficient. Reader can predict buyer 2 sees zero. Ordinary-read older versions are clearly separated from reservation. Text extraction includes both visual table and its textual equivalent, creating apparent repetition that I do not attribute to visible-page prose without screenshot inspection.

10: Replicas and shards have distinct jobs, and planned coverage is clearly labelled. Brief enough for overview. I can distinguish extra copies from divided ownership; operational details are onward curiosity.

11: Costs follow taught mechanisms (indexes, locks, reports), supporting judgment rather than a feature list. 'The collection below gives these their own articles' may imply backup/schema/security articles exist; checking the list next for availability clarity.

12: Three next routes state outcomes. Backup/schema/security availability question remains pending full collection list.

13: List explicitly separates working drafts from planned areas. Earlier 'gives these their own articles' is mildly over-complete because operating/evolving remains planned; smallest repair is 'plans separate articles'. No obstacle to following the current route. Separate simpler shop notice for optional checkout prevents accidental identity carryover.

14 / introduction judgement: Clear orientation and orderly development. Concrete passages doing real explanatory work: row/schema distinction, historical purchase price, P7 join, lock-before-check. No consequential blocker. Mild availability wording above. SQL syntax taught so far: SELECT fields FROM, JOIN ON, WHERE; no grouping, ordering, INSERT or application APIs yet.

## Designing your data

00: Title and route only.

01: Opening frames schema design as a decision with consequences, rather than assuming table boundaries. I want to know how to judge a division.

02: Schema versus records reminder works for both route and direct entrant. No new gap.

03: Diagram gives concrete definition/record contrast, including repeated names versus unique keys. Useful repetition of foundation, no strained prose.

04: Three design questions show what a schema commits to. I can connect price-history question to introduction. Other two questions remain useful prompts awaiting derivation.

05: Fact means value with subject/context, preparing functional dependencies without assuming the term.

06: Normalisation now has a purpose and promised method. 'What they depend on' is understandable but still abstract; I expect the next worked arrangement to supply it.

07: Contents promise a coherent design journey. Opening understanding: schema declares beliefs/rules; normalisation separates independently changing facts. Good orientation before detail.

08: Dependence abstraction resolved through customer name correction, registration and deletion. Repeated IDs remain valid references; explicitly saying this avoids a common overgeneralisation. The figure is useful because both versions and the changed-row counts are held together. No gap.

09: Earlier same-product-twice question resolved by composite line key, with rejected alternative and consequence. O12/O13 figures explicitly establish continuity from introduction. Candidate-key minimality is explained in plain words. Strong passage: assigned row_id does not repair repeated customer facts.

10: Dependency given as asymmetric application rule, not statistical correlation. 'Determines does not mean never changes' is a useful clarification at exactly the right point. Can now predict customer name needs customer ID, and line price needs line identity.

11: Long single chunk contains all three normal forms. At 1NF, I wondered whether arbitrary fixed product slots also violate the form; the immediately following paragraph explicitly says scalar slots can satisfy it while remaining poor design. At 2NF, moving customer/time to order follows the dependency, with before/after facts visible. At 3NF, current product price versus agreed price is preserved consistently. Underlined-key meaning is given before diagrams. 'Non-key fields' is new vocabulary but supplied by key examples. Optional overlapping-key formalism stays closed. Final relationship figure introduces many-to-many by tracing O13/P7; no expertise needed to infer it. No consequential gap; strong support for applying the method.

12: Lossless decomposition explained by an actual failure with four product/price matches. This advances beyond tidy tables and supports judgment. Figure removes the need to mentally cross two pairs. 'Does not make splitting these fields useful' prevents another overgeneralisation. No gap.

13: Experiment clearly resets catalogue from current €20 to initial €18; no unexplained state shift. Prediction before interaction: correcting normalised name changes one row but both displays; catalogue €20 leaves O12 total €36. Default DOM supports setup, but interaction untested. Address and purchased-name examples help transfer the rule. Slight repeat of price reasoning is justified by new historical-design scope.

14: Good boundary against arbitrary fragmentation. A summary's authority and refresh choice are concrete; no implication that normalisation demands maximal joins. 'Number of tables is not a measure' follows reasoning rather than serving as a slogan. No blocker.

15: Types section gives comparative choices with consequences: lexical '10'/'2', postal zeroes, 18.005 rounding, status versus boolean, instant versus local appointment. NULL introduced as missing with ambiguous business meaning. Each choice is usable beyond shop. Long section has several subheadings but reasoning remains connected. No missing prerequisite; timestamp precision is proportionate.

16: First CREATE TABLE/INSERT arrival is introduced by who prerequisites are and how columns/declarations map. NULL check rule and NaN are explained before interpretation, so technical complexity stays purposeful. Prediction before reading model result: line (O12,2) P7 accepted; removing NOT NULL admits missing quantity because CHECK unknown isn't false; extra product uniqueness rejects permitted second line. Visible result agrees. ON DELETE forms appear early in SQL but are resolved later within section; no dependent task forces interpretation earlier. Constraints-versus-complete-operation limit is carried forward cleanly.

17: Main path explains JSON object's limited validation, then capacity/detail row before showing its result; closed setup does not hide necessary data. New term JSON null is contrasted with SQL absence enough for current decision, though fuller treatment can wait for child. Supplier-array case connects identity, writer and reference; a lock cannot recover an omitted stale object field is a particularly useful warning. More detailed input conversion intentionally delegated and promised as complete in child.

18: Receipt resets explicitly before earlier insert; aliases/arithmetic/output alias/ordering introduced before code. Adaptation prediction before optional answer: Sea-blue mug, 2, 18.00, 36.00; cannot recover original printed name because only current product name was stored. Evidence lies in query p.name versus l.quantity/l.unit_price. Good practical closure. Actual local setup not attempted by this reading.

19: Child links promise genuinely further investigation (competition, validation/migration), avoiding a redundant next step.

20 / modelling judgement: Substantive and coherent; gives enough reasoning to design a small schema and justify identity, dependencies, historical fields, types and enforcement. Writing is patient with purposeful examples; no material prose strain found. Carries forward aliases, multiplication, ORDER BY, CREATE TABLE/INSERT and three-valued CHECK behaviour. Read default main path only; optional proof/setup/answer material still separate.

Optional modelling read after main path: variation answer matches prediction. Setup gives explicit fresh-column/table prerequisites and explains ALTER and aliases. Formal overlapping-key detail appropriately optional; no main-path dependency discovered.

## Constraints


00: Supporting article role explicit.

01: Reestablishes constraint vs type, useful direct-entry orientation but familiar from parent. Waiting for added question.

02: New problem arrives promptly: two valid checks do not reserve catalogue identity. Need to know database outcome for competing writers, beyond static rule already taught.

03: Multiple caller contexts explain shared enforcement without confusing SQL ownership.

04: Shared-writer figure clear; 'passes this rule' avoids overclaiming whole-write success. Added value modest on route but useful direct entrant.

05: Opening can now explain why shared constraints matter despite application checks; enough context, definite further scope. Questions are productive.

06: Same data explicitly carried forward; optional SKU rule established before demonstrations. Practice context says separate standalone statements and warns transaction errors need rollback. 'Savepoint' is unintroduced but optional alternative, not needed to execute main route. No gap.

07: Parent overlap in CHECK/NULL/NaN is substantial but supports direct entry and adds actual probe/represented-value timing. Model prediction is derivable: missing passes CHECK alone but fails NOT NULL. The prose says false/unknown before SQL; no surprise explanation after the task. No functional blocker. Editorially this repeats an already long parent section, though concurrency promise still motivates continuing.

08: All insert outcomes can be predicted from prior rules. New SKU missing-value policy is explicit before inserts; default multiple NULL behaviour no contradiction with CHECK unknown. Case-sensitivity issue raises useful design work but isn't implemented; article promise is explain constraints, so onward decision rather than blocker.

09: Opening question resolved by committed-or-rolled-back first writer, second wait/error/proceed. Figure introduces distinct P11/P12 to avoid duplicate primary-key confusion. Minor code-context concern: one block contains SELECT then INSERT with only comment for application branch; surrounding prose explicitly says application inserts if no rows, and no operational completion is promised here, so this is understandable rather than material missing caller. Could separate blocks to make branch unmistakable.

10: Composite shipment example reuses earlier inserted line 2 explicitly and proves pair matching; useful new depth. Deletion figure resets each attempt and identifies omitted extra line, preventing false continuity. SET NULL/NOT NULL conflict directly derivable. Deferrable timing becomes a curiosity at end, not necessary for current immediate rules.

11: Wider process limit accurately built from existing rules. Repetition of parent remains but adds clear stock CHECK versus correspondence distinction. Bridge to varying attributes is concrete. No blocker.

12: Onward route fits question just opened.

13 / constraints judgement: Accurate-feeling, understandable extension of parent through unique NULL policy, competing inserts, composite references and deletion. Repeated introductory/NULL material slows a continuous reader slightly but does not strain into decorative writing. No required repair; possible separate-block clarification for SELECT/application INSERT branch. Captions keep direction and reset explicit.

Optional constraints: setup states fresh database and separate attempts, consistent with main text. It includes only O12 whereas downloadable schema also includes O13, but main already explains that difference; examples don't rely on hidden O13.

## Tables and JSON

00: Supporting role explicit.

01: Varying details problem grounded in common typed shape, consistent with parent.

02: Clear that JSON moves some structure inside a value and doesn't remove schema. Can explain tradeoff's location before example.

03: Opening sufficient: can state alternative representations and that operations determine choice. Await concrete comparison rather than generic flexibility claim.

04: Distinguishes JSON key from database key and nested value from row before these could confuse. Three arrangement figure compares same fact; captions explain types and row boundaries without claiming physical size. Product/supplier duplication connects to normalisation instead of presenting JSON as exception. No gap.

05: Nullable columns assessed by meaning and kind-specific rules, not condemned by count of blanks. Clear reasoning for when product-kind checks may suffice. No unsupported recommendation.

06: Exact integer admitted range is stated, and conversion/rounding question explicitly opened for later. SQL CREATE assumes products/P7 exist; inherited route supplies these, but direct reader's setup instructions still pending. Generic triples caution provides useful alternative without detour.

07: Practice prerequisite/reset question resolved before runnable JSON path. Alternative details snippet is explicitly separate. Can trace object versus inner capacity validation. UPDATE/SET syntax is familiar to programmer but only implicit from examples; each statement's effect is plainly inferable.

08: First WITH/VALUES introduced explicitly; no need to supply CTE expertise. Prediction number and string both text '350', JSON type separates; missing versus JSON null has_key false/true. Actual table lets verify. SQL NULL labels explicit. Clear practical reason for distinctions, no puzzle whose inputs are hidden.

09: At first integer cast, I worried about permitted bad input; immediate next paragraphs expose string/fraction failure, then finish policy rather than leaving unsafe recommendation. Previously opened rounding concern resolved by exact whole/in-range JSON number policy. Future caller policy distinct from stored check. 'Its ordinary capacity index' appears without an index created yet; can read as possible index, but wording may imply one exists. Minor precision to recheck later, not needed to derive result. Correct final query follows migration's explicit state.

10: Earlier index wording resolved by optional CREATE INDEX choices here. GIN versus ordered capacity is explained enough for conceptual decision; exact mechanism can await index chapter. Stale object example explicitly independent start, caller A/B saved copies and serialized commits: can derive finish lost despite row lock. jsonb_set path/quotes unpacked. Separate-offer diagram says only this row conflict removed, preserving limits. This is meaningful additional depth beyond parent, strongest section.

11: JSON migration tied to reader/writer versions and authority; no handwaving that flexibility removes schema changes. Concrete finish rename shows operational consequence. Good concise section.

12: Final design includes finished capacity representation/input policy and authority; gives practical choice rather than feature comparison. No material prose strain. Repeated 'can earn' mildly figurative but brief, not an extended motif.

13: Next route queries fits stored structure now established.

14 / JSON judgement: Main route successfully completes representation choice, read/change implications and conversion policy. Strong passage: sequential stale whole-object writes explain a lost change without falsely blaming lock overlap. Main path carries required semantics; exact migration can reasonably be optional.

Optional JSON: conversion explains one connection, BEGIN, error branch to ROLLBACK, successful continuation, CASE gating and NOT NULL rejection. Predict valid 350 migrates/removes original; string/fraction refuses and rollback preserves original. Existing P7 prerequisite explicit. No hidden requirement discovered.

## Querying your data

00: Main deep dive, route advances from design to transactions later.

01: Reads naturally follow design's stored boundaries; totals introduce calculation need. Clear subject motivation.

02: Query definition reinforces different questions without duplication. No gap.

03: Result row meaning positioned as central correctness choice. Can explain query versus stored table before code. Productive next question: how joins alter count/meaning.

04: Clear prerequisites and promised progression. Appropriate for route and basic SQL newcomer.

05: Headings move from semantic correctness to execution, no strained slogans.

06: Result meaning figure makes three outputs distinct before SQL. Code then gloss then result gives newcomer interpretation; quotation, semicolon and no implicit order are explicit. Parameter explanation distinguishes value/command with caller, enough at scope. All required O13 amounts available. No gap.

07: Exactly-one result explained by both existence and uniqueness constraints previously taught. Grain defined, not just asserted. Removing identifying output doesn't deduplicate is useful next inference supported by join mechanics.

08: New O14/Ben explicitly introduced before left join result; no reliance on optional setup. Null-extended row vs existing empty order distinguished. ON versus WHERE Cara example explains why post-filtering cannot invent replacement; can derive all four and two outputs. Separate copied tables protect main-state continuity. This is excellent missing reasoning often supplied by experts, but supplied here.

09: Can predict O14 COUNT(*)1 / COUNT(line)0 from prior null row; SUM null then COALESCE decision explained. HAVING difference derives from concrete excluded €20 line. No gap; fine progression in SQL complexity.

10: Join multiplication directly visible as four pairs and €88; distinct counterexample avoids deceptive repair. WITH explanation follows code (already taught in JSON child on this route); direct-entry SQL promise might benefit from moving it before code, but no ongoing-route gap. Variation prediction before answer: 3×3=9 pairs, line total64 repeated thrice=192, separate summaries64/3, SUM DISTINCT44 incorrectly collapses two €20 lines. Clear enough to derive from facts.

11: EXISTS/SELECT1/correlation explained. Can predict another mug line doesn't duplicate O13 because outer rows stay orders. O14 state inference bounded. No gap.

12: Debugging advice is derived from worked failure, then correctness provides basis for cost comparison. Good transition, no canned recap.

13: EXPLAIN introduced by possible algorithm then observed tree. Initially fractional rows=1.50 raises question; paragraph following diagram derives one then two product rows and average. Indentation, emitted versus scanned rows, Materialize and unique early stop all explained. No hidden SQL expertise needed to follow this example. ANALYZE statistics gathering appears without explanation of what statistics contain; next section likely supplies it (productive question). Slight duplicated execution warning but justified before adapting EXPLAIN to writes.

14: Model explicitly contrasts simplified full scan with earlier early-stop observed plan, so no contradiction. Prediction 200×6=1200 comparisons vs200 entries/6 probes; with1 line build remains200. Units stated unequal; no speed claim. Reuses input identities but declares separate experiment scope. Maintained index vs temporary hash distinction well explained.

15: Statistics question resolved by size/distribution estimates and ANALYZE. 'First divergence' rationale concrete via2 vs20000 repeated lookup. Ends by correctness anchor and onward pagination; no missing practical conclusion for this scope.

16: Supporting execution route clearly promises more than overview. Carry forward query semantics, row identity, aggregates, LEFT JOIN, EXISTS, cardinality, plan tree, scans/nested/hash/merge and estimated versus observed distinction.

17 / querying judgement: Strong cumulative explanation with concrete counterexamples. The observed plan goes beyond labels to actual repeated-row arithmetic. No consequential gap. Some body repeats what figure shows, but text extraction may overstate visual repetition; substantive mechanism stays clear.

Optional querying: prediction matches nine/192 vs64/3 and DISTINCT44. Setup gives fresh DB, extension order, no double run, temporary-table same-session context. No hidden prerequisite for main results.

## How a query runs

00: Further-depth role visible.

01: Clear execution-plan subject; repeats foundation without consuming much space.

02: Alternative work is concretely expressed; prepares plan comparisons and why small answer isn't cheap. No gap.

03: Opening provides practical investigation goal and explicit prerequisite. Can explain enough before experiment.

04: Separate numeric-ID dataset explicitly distinguished. Enough input to derive30 lines and product totals10/20/30 before result; DESC and tie-break glossed. Practical one connection/new empty DB supplied. Index availability stated, not guessed.

05: Bitmap terms explained by locations/page order before nested work. 3×10=30 traced by specific orders, repeated executions clearly within one statement. 'Can start returning matches' scoped to join before aggregate, preventing streaming inference. No blocker; supports plan adaptation.

06: Two sorts distinguished by purpose/row counts. Pull executor explanation connects to blocking without confusing locks. LIMIT1 inability derived from global sum, a useful practical counterexample. Strong passage.

07: Hash join vs aggregate use different keys explicitly; can derive10k build/30k probe/3 aggregate entries. Comparison figure would reduce memory load tracking same tree shape with different cardinalities. No unsupported speed conclusion; estimates/counts not timings. Good new depth.

08: Merge mechanics can be traced through1→2 and three lines each. Transaction-local planner changes and ROLLBACK restoration explicit, even before transaction deep dive. Order-ID output not product ordering explains remaining aggregate/sort. No gap.

09: Cost start/end and width explained, inclusive costs warning useful. Customer/region facts provided before estimation example, allowing1 predicted vs10 actual reasoning. Repair changes statistics only; limits explicit. Can distinguish stale stats from missing correlation without external expertise. No blocker.

10: Memory scales by distinct aggregation keys vs input orders, not one undifferentiated row count. Per-operation allowance and concurrent total explicit. Spill example changes query purpose and discloses PGlite measurement limits. Sensible action before configuration change. No gap.

11: Final method derives from examples; repeat experiment resets dependency stats explicitly. Sandbox uses separate1000 record dataset, stated without implying current10k one. No missing practical step in conceptual route.

12: Links follow useful remaining concerns.

13 / execution judgement: Substantial further depth, especially two sorts, different hash-table keys, inclusive costs, dependency statistics and per-operation memory. Clear concrete prose; no consequential comprehension gap or significant strained passage. Numeric dataset reset and connection-local changes are handled carefully. No optional artifacts required for understanding; actual execution not part of this reading.

## Pagination and large results

00: Supporting role explicit.

01: Motivation clear: prompt useful partial history, not arbitrary page convention.

02: UI and export share partial read need but likely different consistency promises. Productive question established.

03: Two continuation choices introduced with operational meaning. No jargon before motivation.

04: Opening resolves expected scope distinction: live list then fixed export. Enough grounding before ORDER BY.

05: Fresh dataset and changed O14 time made explicit. Why ordering/tie-break required is explained before syntax; can predict O16/O15 and boundary tie with O14. Total order vs frozen set distinction prevents false guarantee. No gap.

06: Offset insertion/repeat and deletion/skip both traced; alternatives explicitly reset. This avoids mental state confusion. Separate requests/Read Committed context explicit, and default transaction not promised fixed view. No gap.

07: Pair comparison explained before needing to adapt; timestamp-only loses O14 plainly. Saved boundary values versus lookup important and clear. Prediction before model interaction: move unread O14 to13:00 places it before saved boundary, keyset misses it; offset skips new O14/O16 then returns repeatedO15/O13. Await next section explaining mutable boundary. Default model state matches unchanged pair.

08: Caller/token context concrete, opaque defined. Fetch extra row technique names exact second-row token to prevent skip. Direct page500 limit honestly reasoned. No gap.

09: Index order leverages previous execution understanding. Paging unit reminds result grain; first twenty order IDs then lines is enough conceptual instruction, optional executable example fine. Same-view need stated for separate queries.

10: Mutable-order prediction resolved exactly. Key range vs snapshot distinction includes delayed commit and corrections, so watermark not sold as complete export solution. Contract phrased in implementable terms. No blocker.

11: Reset to original five and changed ascending/all-customer scope explicit. DECLARE/FETCH/CLOSE/BEGIN/COMMIT and same connection explained; can derive fetches O12/O13 thenO14/O15 thenO16. One cursor vs fresh queries well distinguished, with separate queries sharing RR possible. Long transaction resource cost and frozen IDs vs frozen values complete decision. No gap.

12: Checkpoint/effect boundary correctly signposted as different job; no implication pagination claims work. Closing parallel contracts useful, slightly aphoristic 'choose promise' but earned by mechanisms.

13: Transactions now motivated by fixed views and work/checkpoint boundaries.

14 / pagination judgement: Complete reasoning from ordering through boundary choice to fixed snapshot; preserves original/current state and caller context. Strong examples: O14 tie, deletion alternatives, snapshot compared in same ascending order. No consequential gap, no material prose strain.

Optional pagination: setup separates statement execution from Run all and each experiment resets. Order-page query explicitly switches oldest-first and yields3 line rows for2 orders; no main-path hidden reset. Answer/work mechanism complete.

## Transactions and concurrency

00: Main deep dive route matches commissioned sequence.

01: Transaction need grounded in one application action/multiple records. Familiar from parent, concise orientation.

02: Failure of compensating sequence explains why grouping matters beyond convenience; concrete stock/purchase mismatch.

03: Atomicity defined by observable grouping, enough to explain subject now. No gap.

04: Atomicity not conflated with concurrency correctness; next problem natural.

05: Promise includes caller failure/uncertainty, important future completion criterion. Records reintroduced instead of relying on optional setup.

06: Contents progresses from single operation to wider boundary, no title strain.

07: Model status explicit; I'll judge default extracted state as teaching artifact, not live execution.

08: Same connection/session and application gaps made explicit. Autocommit/client-library boundary nuanced but not confusing. Own unfinished reads vs other sessions/new views explained. No blocker.

09: O14 reset deliberately reverses previous query article's existing header; explicit fresh checkout prevents contradiction. Three stock state derives from new premise. Figure alternatives commit/rollback precise; transaction doesn't choose omitted line. No gap.

10: Caller/driver/pool/await all located in running request, with validated values and same connection. Zero rows explicitly success not exception; branch visible in code, not comment alone. Two fragments declared parts of one handler, cleanup/error promise deferred to next section. Can trace success stock1/O14/line and unavailable rollback; no missing operational context. Explanation slightly repetitive across prose/table but table useful at handoff between application/database.

11: Sandbox role explicitly differs from real handler, avoids prior caller confusion.

12: Error path resets state, shows skipped COMMIT and rollback same connection; no compensating stock UPDATE. Uncertain COMMIT explicitly excludes simplistic catch. Pool lifecycle responsibility explained but full cleanup code optional; okay conceptual main path, inspect optional later for operational promise. Savepoint introduced with why inappropriate here. No blocker.

13: New one-mug/two-handler/quantity1 state explicit. Unsafe code lacks stock >=1 check but both initial reads1 makes schedule sufficient to expose lost reservation; understood as deliberate unsafe example. B stale computed zero after lock resolves why atomicity insufficient. No gap.

14: Conditional recheck after A commit/rollback gives both outcomes; zero row branch previously visible. Expression subtraction versus stale number clear. Optimistic version condition's every-writer requirement explicit. No blocker.

15: Longer application decision motivates locking read; code one-mug comparison explicitly differs from partial fulfilment premise. Missing-row lock limit clear. Model prediction: unsafe commit yields2 purchases/stock0; coordinated commit1/0, rollback letsB buy1/0. Main prose already makes outcomes derivable. Same transaction/connection warning essential and present. No gap.

16: Snapshot as visibility info vs copy explicit; reporting/staff callers located. Reuses20→22 price but fresh comparison states temporal events, sufficient. RC locking read exception and RR serialization failure included near ordinary-read table. Predict old report20/new22. No blocker.

17: Variation prediction before answer: first qty2 returns stock1; second qty2 returns no row, rollback leaves stock3/noO14/no lines. Featured two-row rule explicitly changes example and caller; serial-order counterfactual makes write skew understandable. Serializable not physical serialization and retries/new decision explicit. Repeated serial-order explanation in caption and prose may feel heavy visually, but useful standalone figure; no blocker. General shared-lock protocol requires every writer, stated.

18: Deadlock table can derive cycle and ordered-lock improvement. Full-operation retry justified by failed earlier reservation and stale computation; unknown outcome branch present before retry. Named checkoutAttempt comes from optional full code not seen yet, but prose explicitly function lifecycle and control-flow pseudocode; enough for main understanding. No gap.

19: Known rejection vs lost answer distinct, stable intent identity and claim-before-reservation branches concrete. Compare request content, retention and authoritative state all explained by duplicate effect. No-return branch read subsequently at RC addresses waiting snapshot. Model explicitly changes stock to5, preventing carryover confusion. Prediction sameK14 committed recovers1 order/stock3; mistakenK15 duplicates2 orders/stock1; rolled-back first permits original claim1/3. Full implementation rightly deferred to supporting child.

20: External payment limit resolved via explicit pending workflow, not claim of distributed rollback. Cancellation repeat/uncertain provider outcome acknowledged as required operations not supplied status column. Scope marked proposed beyond runnable schema. Useful thought experiment without overpromising implementation.

21: Outbox closes post-commit/pre-send crash gap without exactly-once claim. Adequate overview, full worker implementation outside scope.

22: Review method ties directly to worked branches. Clear distinction between preparable validation and state-dependent availability; old read inside BEGIN still not authority. Summary is earned and useful though long chapter. No blocker.

23: Available Indexes was listed working draft earlier, but link here calls it 'Planned deep dive.' Concrete navigation status mismatch; repair final publication metadata. Child roles clear.

24 / transaction judgement: Complete main explanation from atomic changes through concurrency and ambiguous outcomes. Caller and branch placement particularly strong. Repetition of principles across prose/table/model can make chapter feel long but no strained metaphor or missing mechanism. Material status mismatch in next Indexes link; otherwise no required explanation repair yet. Will inspect full optional handler now.

Optional transaction: full handler meets main promise for cleanup, distinguishing commitSent+unconfirmed rejection as unknown and discarding session. Adapter narrow contract explicitly excludes08007/40003 and transport failures; application implementation intentionally outside. Confirmed check rollback path and unavailable branch complete. psql exercises distinguish commands/results and same/fresh connection states. Variation answer matches prediction3/0/0. No material hidden assumption found.

## Isolation and snapshots

00: Further-depth route explicit.

01: Read/write overlap motivates isolation directly, though familiar from parent.

02: Multi-query report has clear need; question is versions after commit, not uncommitted dirty read.

03: Isolation definition covers sees/does/rejection, avoids treating as only read freshness. Opening substantive enough.

04: Child new scope is cross-row guard that looks like local safe UPDATE; important test beyond repeated parent visibility.

05: Snapshot rationale and ordinary-read scope explicit; reader can explain consistent query through concurrent commit.

06: Prediction RC20/22, RR20/20 derives before model. Two-editor connection and pause schedule unambiguous; read-only scope explained. Single-statement RC already one view prevents overusing RR. Parent overlap substantial but child harder case promised; no gap.

07: Own-write exception tested on separate reset20 example; rollback20 clear. RR conflicting target rule names unchanged productID, sufficient condition. RC guarded update contrasted with reporting RR, avoids hierarchy-as-universal-fix. No blocker.

08: Cross-row guarded UPDATE explains new subject: one statement isn't enough when predicate reads other row. EXISTS known from querying, boolean enabled gloss supplied. Concrete valid schedule says both snapshots before commits, A/B different targets. Same figure as parent helps recall but added query gives substantial additional reasoning. No gap.

09: Serializable retry changes outcome rather than forces original wish; provisional results until commit explicit. Shared control lock then subsequent RC statement explains freshness, and RR unchanged-control-row caveat prevents incorrectly generalising locking magic. Clear meaningful further depth. No gap.

10: Conclusion separates report view from write dependency and leads to outcome recovery. No additional unresolved query.

11: Onward distinctions motivated by article.

12 / isolation judgement: Repeats parent visibility but earns child scope through cross-row UPDATE and shared control-row protocol, with subsequent statement freshness explicit. No consequential blocker or strained prose identified. Optional model note next.

Optional isolation: model scope consistent; explicitly unchanged historical€18 price prevents current/purchase conflation. No hidden necessary premise.

## Handling conflicts and uncertain outcomes

00: Further-depth recovery title clear, though long, accurate.

01: Opening operational exchange provides understandable subject; established caller retained.

02: Wait/rejection/missing answer distinguished before recommending retries. Good foundation.

03: Repetition consequence concrete; no generic retry advice. Can explain subject's importance now.

04: Prerequisite states parent grouped purchase; clear further scope.

05: Deadline/cancel distinction adds meaningful child depth. Confirmed cancellation cleanup vs broken connection vs COMMIT uncertainty each grounded. No gap.

06: Deadlock diagram direct and simple; victim unpredictability/other lock dependencies stated. Inspection SQL ends rollback and explicitly not complete checkout. IN explained. No blocker.

07: Retry whole decision reinforced with concrete lost prior reservation. Pseudocode explicit adapter responsibility and unknown COMMIT branch includes non-network errors; matches parent complete handler contract. Three attempts illustrative; deadline/random delay after release explained. No gap.

08: Alternative histories diagram preserves application's limited knowledge. Clear why new connection isn't rollback proof. No gap; leads naturally to recovery implementation.

09: Claim success/no-row branches fully located in one handler/transaction; separate reservation result check prevents unreserved order. Existing request comparison complete. Potential practical gap: pseudocode 'require existing matches' precedes ROLLBACK, but on-any-error cleanup explicitly covers failure, so reader need not infer leaked transaction. Commit sentence says durable together without settings caveat locally; overview/coming storage supplies durability bounds, acceptable route. Can derive repeated proposedO15 returns originalO14, stock unchanged1.

10: Recovery figure includes pending invisible order and both commit/rollback paths, uniqueness wait before any new reservation. State trace sufficient to predict. Variation prediction: keepK14/reenter claim, no failure/newK15; confirmed deadlock permits fresh complete attempt under same intent after rollback cleanup. Retention and authoritative committed-state assumption explicit. No gap.

11: Evidence/action table useful portable reference, all cells supported by preceding reasoning. No new unsupported policy.

12: Return link suggests performance/integration; availability should match final publication scope (not yet judged).

13 / conflicts judgement: Further practical completion of parent promise, especially cancel acknowledgement, branch-by-claim SQL, pending transaction recovery and key retention. Repetition warranted by full recovery path; no consequential gap or significant prose strain. Literal-value SQL framed as handler queries not runnable control-flow by itself.

Optional conflicts: fresh stock/nullable historical operation key explained. Answer matches retained prediction. No main-path missing prerequisite.

## Indexes

00: Main deep dive; next route query execution already read as child, consistent alternate route.

01: Opening states contents and purpose directly; reader can already explain index separate selected values plus row references.

02: Ordered grouping explains benefit, but how first entry found remains productive question for tree section. Similar intro foundation recalled without circular 'index finds' claim.

03: Arrangement connects to date order and maintenance; complete orientation, not merely invitation. No gap.

04: Headings plain topics, appropriate deep dive.

05: First-match question resolved by root ranges excluding others, then ordered leaves. Diagram row letters clearly physical references, not SQL IDs. Pages introduced before use; heap visibility connects to learned snapshot. Real fanout/depth statement sufficient without arithmetic; no blocker.

06: Separate60k temporary setup and session lifetime explicit. Main counts60/45/15/10 given before plan, so reader needn't derive generator arithmetic to follow index choice. Generator introduces generate_series/interval/CASE/% with little gloss; basic programmer can infer much, but SQL novice cannot readily modify dataset. This is optional setup complexity, not main reasoning blocker; brief 'one row per n' gloss could reduce effort. Composite lexical ordering and date-first counterexample clear, tie requirement and backward scan correctly scoped.

07: Residual filter12 candidates/10 results distinct from index range. Alternative status ordering consequence for original query explicit. Skip scan later-key caveat bounded, not false universal leftmost rule. Partial index parameter plan explanation sufficient to understand implication; no detailed implementation needed.

08: Return original paid+pending query explicit. INCLUDE versus sort key and index-only visibility-map condition clearly distinguished, including actual10 heap fetches then0. VACUUM autocommit requirement before command. Broad54k case rejects simplistic selectivity rule with row width/index size explanation. No gap.

09: Maintenance concrete leaf split, key relocation, included-value updates; constraints supporting indexes not casually redundant. Size comparison tied to test runtime and long note tradeoff. Live build impact distinguished from isolated table. No blocker.

10: Final verification compares same answer/routes with counters and separates standalone ANALYZE from EXPLAIN ANALYZE. Mutation count60900 derives60000+1000-100, corrected26 clear. Honest limit: script checks maintenance effects, not production write cost; gives representative durable-table comparison to finish actual choice. No claim10 emitted means10 operations. Good practical completion; no blocker.

11 / indexes judgement: Opening and tree answer the first-match mechanism; composite alternatives, residual filters, covering visibility and measured limits give an engineer useful choices. Strong passages: customer/date ordering, vacuum10→0 heap fetches, actual rows not operations. Small novice effort in generator syntax, optional improvement rather than blocker. No major editorial strain or factual inference needed on this route.

## Storage and durability

00: Title only, subject clear.

01: Physical arrangement introduced by bytes/files/memory and consequences, not assuming page/cache knowledge. Can explain storage subject before crash scenario.

02: Persistent recovery info versus finished table bytes central distinction explained before WAL details. Productive question: what ordering makes this safe?

03: Default logged-table/one-server/storage surviving scope stated. Ordering question partly answered required log before ack, table later. Opening concrete and sufficient.

04: Heap/page/shared buffer/OS cache introduced in usable sequence. Extra P3/P9 specific physical example, no claim prior catalogue only2 products persists. Read whole page vs result row and TOAST conditional avoids oversimplifying all row bytes. Figure makes cache/page reuse concrete. No gap.

05: Successful handler path includes check before commit, despite SQL compact block. Dirty page independent from transaction state is explicitly stated, critical distinction. New tuple versions connect isolation to storage; HOT named with enough condition, internals optional curiosity. No gap.

06: WAL-before-data and commit-record-before-ack distinguished. Why physical log replay rather than SQL rerun explained with +2 example; page LSN duplicate prevention concept no missing term. Diagram later-table-write is example not mandatory ordering, caption says earlier write possible. Storage durability dependency explicit. No blocker.

07: Redo uncommitted physical changes vs visible committed data resolved directly, a difficult but coherent mechanism. Can derive A20/B22/C22 and C unknown client result from artifacts. Torn-write/full-page-image introduces checkpoint before definition; clearly a reference point for timing, expect next section. No dependent judgment blocked.

08: Checkpoint reference resolved by redo starting point and dirty-page completion, with live writes allowed. Durability already at WAL flush vs recovery length clear. No gap.

09: Logical1 product vs physical versions explains growth; older report delays cleanup consistent with isolation. VACUUM reuse vs shrink/lock and checkpoint distinct purposes clear. No gap.

10: Named settings give concrete durability scope; asynchronous acknowledgment vs fsync corruption difference explicit. Unlogged loss and accidental committed deletion distinguish disaster types. Backup+unbroken archive requirement prepares upcoming operations article. No blocker.

11: Backup planned label will need final publication-status reconciliation once new article joins collection. At capture moment not intrinsically contradictory to intro.

12 / storage judgement: Clear foundation and rigorous separation of row visibility, dirty pages, WAL persistence, acknowledgement, checkpoint and vacuum. Particularly useful crash A/B/C diagram aligns database reality with application's evidence from prior recovery chapter. No consequential comprehension blocker or prose strain. Figures illustrative and text-delivered only; no crash execution claimed.

## Understanding a slow query

Continuation commissioned after original twelve-page route: performance, then operations, then capacity/PostgreSQL/choice articles when provided. This remains the same reader; existing definitions and examples carry forward.

00: Captured title is 'Understanding database performance' (slug slow-queries); use title for judgement.

01: New main subject distinguishes database work from request wait; promises broader diagnosis than plan-only chapters. Clear opening.

02: Clear investigation questions connected to caller. Expected next need concrete evidence collection.

03: Invented vs measured scope up front; no benchmark extrapolation. Opening enough to explain performance subject.

04: Plain headings align with diagnosis stages.

05: Nonoverlapping180ms trace bounds explicit, so arithmetic80+12+70+18 usable. ORM batch motivation concrete, pool total20×20 clear. Warns double-count server within app span. New diagnostic reasoning beyond plan article, no gap.

06: Monitoring connection/privilege context explicit; explains pid/wait/age fields before interpreting active versus idle. SQL includes clock_timestamp/current_database functions not glossed individually but names and defined durations sufficient. Action preserves payment guarantee rather than commit early. No gap.

07: Performance experiment explicitly needs sandbox prepared table; counts10000/10/4990→5000 and restoring10 clear. 'Stored distribution' could briefly mean actual data, but context says statistics/planner info, no true ambiguity. Distinguishes correctness from estimates and index usage from result. Measurements boundaries/cost not time reinforce prior learning.

08: Builds directly on storage: state changes despite same query. Old transaction prevents cleanup, ending doesn't immediately compact distinguishes cause/action. Sustained test motivation concrete. No gap.

09: Test design includes offered load feedback problem and percentiles/timeouts, enough definition for programming reader. pg_stat_statements scope/config caveat practical. Predictions tied to earlier mechanisms rather than generic benchmark checklist. No blocker, prose direct.

10 / performance judgement: Successfully expands plan understanding to latency ownership, waits, input distribution and credible end-to-end tests. No consequential gap or prose strain. Most useful passages:180ms nonoverlap trace, idle-in-transaction blocker interpretation, closed-loop test lowering offered load. Main theme more complete than a list of tuning knobs.

## The work behind one request

00: Captured title 'The database work behind an application request'; child performance route.

01: Scope concrete larger response vs row; sequential exchange cost intuitive, not one-query dogma.

02: ORM defined and eager/lazy behaviour in plain terms; newcomer needn't know framework. Good explanation.

03: Opening can explain query sequence as work unit. Tiny dataset promise sets expectation for exact result tracing.

04: Headings signal batching then fanout caveat and lifecycle, appropriate.

05: New numeric orders/people explicitly independent sandbox data; must retain empty103. Counts1+3 and20×5ms derived, no measured latency claim. Authorization/bounded parent page defined before child query. No gap.

06: Array ANY explained; authorised parent-derived IDs and empty-child initialisation keep result/access semantics. Parent ordering preserved independently. Child explosion and concurrent queries cost named, not batching universal. No blocker.

07: Applying prior fanout to application transfer/ORM dedup adds new consequence. Derivable4Ada+1Lin+1Sam=6, summed50/50 false. Preaggregate3 rows and zero convention explicit; restrict authorised IDs at scale. Exercise gives answer immediately so prediction opportunity weak, but not comprehension gap. Could move last outcomes into disclosure if intended assessment; minor media/pedagogy opportunity.

08: Batching consistency implications tied to prior isolation; single connection vs pool convenience explicit. Release timing includes transaction ended, no unsafe return. No gap.

09: Response invariants concrete, then full request metrics. No unrelated checklist; all follows shown hazards. Clear completion.

10 / request judgement: New application scope earns repetition of fanout, with authorised-parent membership, transfer volume, pool ownership and snapshot semantics. No consequential gap or prose strain. Optional improvement: prediction prompt reveals its answer in same paragraph; disclosure could preserve challenge.

## Reporting on operational data

00: Child reporting subject and performance parent clear.

01: Operational vs broad reporting workload introduced by questions, no architecture assumption yet.

02: Read-only competition beyond locks motivates reuse/separation. Good mechanism established upfront.

03: Opening practical choice tied to meaning/work/freshness. Can explain subject and stakes before example.

04: Logical path from semantics to cost to copies, no strained headings.

05: Source grain/day semantics explicit and limited, so count2/€50 plus1/€8 derivable. Missing dates no row explained; business-day/timezone concern grounded. No gap.

06: Prior plan/memory/cache concepts now applied to mixed workload; sum not precomputed merely by covering index useful clarification. 365 is illustrative year (could leap), not material. No gap.

07: Materialized vs ordinary view distinction clear. Correction existing amount keeps count2; live55/stored50 then refresh55 derivable. First UNION ALL introduced without gloss; programming reader may infer from two labelled source outputs but SQL novice has not learned set concatenation. Small explanation needed ('UNION ALL appends both results without removing duplicates') would prevent supplying syntax knowledge. Consequence limited to running comparison, not freshness argument.

08: Publication time vs source snapshot explained with12:00→12:04; schedule not max-staleness guarantee. Incremental correction delta+5/count unchanged and date movement/deletion/retry all traced, making complexity concrete. Unique-index concurrent-refresh rule supplied sufficient at conceptual scope; exact command onward technical task. No gap.

09 (recorded on resumption immediately after 10 was opened): Moving reporting to replica or column store retains freshness/correction responsibilities. The €50→€55 path makes lag observable; stable IDs, updates/deletes and reconciliation avoid treating copy as solved. No consequential gap.

10: Further-reading links match freshness practice and next-system decision. Article judgment: clear operational mechanism and sensible boundary. Minor UNION ALL syntax gloss remains useful. Extraction review does not validate live exercise.


## 16. Changing a schema while the application runs

00: Title promises live compatibility rather than one DDL command. Expect old/new application versions and data transition.

01: Separate events despite one deployment command is a strong concrete opening. No question yet.

02: Four jobs make compatibility an inspectable stage property. Incoming writes explicitly included.

03: Same meaning deliberately isolates interface change. Good bounded example; conversion not an unexplained omission.

04: Sequence follows caller agreement through retirement. Await mechanism synchronising live writes/backfill.

05: A/B/C releases and reads/writes table excellent. Old remains source through backfill; fallback familiar. Question: mixed B old-write and C new-write stage could stale trigger overwrite new—await trigger predicate. B everywhere before omitted-old C explicit.

06: Trigger fires only old-column update, so mixed-version question resolved. Prose explains unfamiliar PL/pgSQL trigger enough to inspect behavior. Setup/run/substitute timeout block distinctions explicit. Schema lock queue concern useful. Reporting UNION ALL gloss repair reported by parent; original reading preserved, recapture not yet read.

07: Bounded batches and resume condition concrete. Current-row copy plus recheck explains race rather than asserting safe backfill; disclosed browser no concurrent sessions. Progress after commit ties earlier checkpoint lesson. No gap.

08: Non-null not equal distinction useful. IS DISTINCT FROM new syntax meaning understandable from equality text but null behavior not explicitly taught here; prior null teaching likely sufficient. Stronger lock retained in single browser block explicitly contrasted with real operator separate commits—prevents dangerous transfer. No blocker.

09: Order4 null old gives precise rollback boundary; keeping column insufficient. B/C mixed state now fully explained. CASCADE warning belongs to known dependency mechanism. No gap.

10 and judgment: Article closes its promised transition completely. Trigger state, bounded work, validity scan and rollback are mutually coherent. No consequential missing reasoning. Main SQL setup requires named lesson, appropriately explicit.


## 17. Backups and recovery

00: Expect distinction from WAL crash recovery and tested restoration, based on Storage's handoff.

01: Defines recovery with application reconnection and nearby work, not just files. Concrete testable promise.

02: Surviving authority/account clear extension of hardware loss. Replica deletes explained before relying on it.

03: Acknowledged requests ties durability/unknown result to actual customer reconciliation. Await durable independent evidence source.

04: Plan takes requirements to drill and service validation. No question beyond evidence provenance.

05: Independent request/external records answers provenance at conceptual scope. RPO acknowledges acceptable loss still business discrepancy; missing req-b within2min does not establish actual recovery point, which text explicitly distinguishes. No gap.

06: Logical vs physical/WAL distinction sharp; point before bad write excludes good later writes traced. Keys/object dependencies concrete. No gap.

07: Command caller, disposable target, credentials, failure handling and permission shortcuts explicit. Honest unexecuted server-drill limitation important; browser SQL not integrity evidence. Thus article can teach reasoning, but actual supplied downloadable procedure remains an implementation confidence limitation outside first-reading validation. No prose missing step.

08: VALUES presented as independent receipt stand-in so derivable req-b. Count+amount counterexample useful. External side effects and deletion replay explicitly part of reopening traffic. No gap.

09: Evidence-led closing demonstrates restored boundary instead of job checkbox. Integrity check not restore replacement explicit. No gap.

10 and judgment: Complete conceptual recovery story, with unusually clear validation scope. Supplied server drill not executed is disclosed; recommend parent verify when server environment available, not falsely report as validated. No blocking first-reader omission.


## 18. Controlling access

00: Expect application vs database identity, privileges and row boundaries. Prior restore introduces real-role verification.

01: Authority attached to connection concrete; owner risk mechanism intelligible.

02: Four boundary questions useful; await how pooled shared role gets user tenant context.

03: Specific least-privilege task establishes forbidden properties to verify. No gap.

04: Role, columns, rows then real identity testing sequence appropriate.

05: LOGIN/NOLOGIN membership and owner-path escalation explained; sandbox role switch limits explicit. No misleading authentication test claim.

06: WHERE/RETURNING read privileges and SELECT* consequences give concrete successful operation contract. USAGE vs table permission explicit. No gap.

07: Fixed tenant worker avoids handwaving trusted session state; prior question answered by bounded task and explicit multi-tenant boundary. Policies don't grant verbs and owner bypass both clear. No gap.

08: Effective role, returned/zero/error branches and autocommit context all explicit. SET ROLE test not an auth simulation clarified previously. Workflow success and forbidden checks produce useful test, no gap.

09: Defaults new role example distinctly separate from shipping narrow grants; no accidental broadening recipe. Shared DB role not person ties auditing to authenticated caller. No gap.

10 and judgment: Least-privilege story complete at deliberate fixed-tenant worker scope. Actual identity, role reset and error/zero-row distinction concrete. No consequential gap; broad multi-tenant auth design properly deferred rather than presumed.


## 19. Retention and deletion

00: Prior backup promises replayable deletion; expect copies and retained transaction history distinction.

01: Copies as concrete paths, not abstract deletion disclaimer. No gap.

02: Retained inaccessible copies vs active deletion states named. Await enforcement/reintroduction mechanism.

03: Bounded engineering policy does not pretend prescribe legal retention. No gap.

04: Live related records → copied data → restore → expiry follows promised lifecycle.

05: Concrete Ada/Lin scope and minimal ledger; explicit soft-delete distinction. Ledger stable ID privacy/access deferred to later plausible. No gap.

06: Counts1/1/2 explicitly scope saved remaining copy. Parent error outside transaction by sequence; atomic ledger/removal clear. Large deletion coordination obligations concrete. Vacuum reused space versus erasure correct pedagogical boundary. No gap.

07: Outbox introduced by purpose, same-transaction durable decision and harmless repeated delete. Delayed update resurrection demonstrates ordering requirement without broad distributed detour. Good concrete completion states.

08: Independently surviving post-restore decisions explicitly answers most consequential ledger issue. ID non-reuse, delayed inputs and suppression expiry explain boundary. Replay no-row+Lin checks and isolated side effects complete. No gap.

09: First partition idea lightly introduced by whole date range; explicit detachment leaves data prevents false deletion. Capacity article follows later for mechanism. Reasonable preview at operation scope. No gap.

10 and judgment: Clear full lifecycle, with ledger independence and resurrection handled. Partition forward link useful just-in-time. No consequential first-reader gap. Operations batch successfully adds real operating context, not list of cautions.


## 20. Scaling a relational database

00: Expect resource capacity choices grounded in prior performance trace, before replicas/shards.

01: Size/compute/hot-record boundaries separates symptom from hardware count. No gap.

02: “What added resource allows next request to do” strong causal test for scaling choice.

03: Uneven tenants and checkout write group gives concrete shard/failure later. Fresh tenant IDs not confused with previous single worker.

04: Work limit before topology; failure capacity is promised. No question.

05: Same workload completed operations avoids CPU microbenchmark inference. Hot last mug repeats learned invariant productively. No gap.

06: Concrete optimisations recap without excessive repetition. Working set accessible from Storage. Local partition shares resources clearly; no gap.

07: Cache TTL, miss burst and stock authority coherent. Diagram extracted order awkward (“Tenant7Tenant8”), artifact limitation; caption supplies complete mechanism. Address write/read old gives replica lag concrete, onward article apt. No missing reasoning.

08: Different owners vs copies visual caption and globally unique local constraint counterexample useful. Tenant8 skew demonstrates key limits. Distributed transaction scope cautiously stated and useful. No gap.

09: Cluster ambiguity practical, table compares next checkout and shared resource. No product-generalised guarantee. No gap.

10: Degraded capacity and failure-domain dependent control service concrete. Prior unknown commit identity reused; no accidental duplicate path. No gap.

11: Links continue exact mechanisms previewed.

12 and judgment: Model notes useful scope. Coherent capacity overview; no consequential gaps. Two topology diagrams convey copied data vs split authority with distinct captions, though this extraction cannot judge spatial layout.


## 21. Replication and failover

00: Scaling promised copied/readable/promotable distinction. Ready for WAL progress points.

01: Arrived/durable/visible immediately separated, clear promise.

02: Memory/log/table chain linked to purchase and next price, accessible given WAL article.

03: Reset €20→25 clear, version-scoped mechanism not universal replication. No gap.

04: Copy→ack→read→authority appropriate causal sequence.

05: Saved log but old price table useful media: causal stages and explicit new snapshot. LSN invented markers disclosed; logical limits bounded. Browser model no actual WAL clear.

06: Configured standby condition and remote_write/on/apply table avoids common guarantee confusion. Quorum count/placement and cancelled-wait unknown outcome explicit. No gap.

07: Progress wait before new snapshot, timeout branches and lineage limit clear without pretending portable recipe.100ms no proof concrete. No gap.

08: Two locally valid last-mug sales proves need for exclusive authority. Fencing endpoints vs existing connections clear. Steps authority/candidate/recovery/client/protection complete at architecture scope. No gap.

09: Failure domains reuses RPO/RTO meaning without confusing current copy with service recovery. No gap.

10: Monitoring privileges/context explicit, byte lag not time explained. Retention storage debt and standby query conflict connect earlier sections. No gap.

11: Model distinctly labelled; documentation links align operating caveats.

12 and judgment: Copy→durability→replay→authority distinctions well supported by one price transition and last-mug divergence. Scope honest. No consequential reader gap or prose repair.


## 22. Partitioning and sharding

00: Prior local partitions versus authoritative owners established. Expect actual key/pruning and movement mechanism.

01: Boundary consequences introduces locality without jargon. No gap.

02: Parent/child route and router examples distinguish same logical collection from physical owner. No gap.

03: Product vocabulary scoped, two-stage local concrete then distributed design useful.

04: Promise key, rules and live movement. Await write fencing already learned.

05: Three records derive pruning2 vs tenant2 across children; tableoid syntax glossed, setup not double-run explicit. Composite PK question arises: why date in key? likely next. No unresolved operation context.

06: PK date question answered and consequences repeated ID concrete. Identity table relationship hinted but scope decision rather than promised recipe. December missing availability and detach separate deletion good. No gap.

07: Key vs bucket-to-node directory explained; tenant authority before route important grounded extension access-control. Co-location bad order/product keys proves need. No gap.

08: Global top20 candidates needs common order but prior pagination teaches; appropriate overview. Cross-owner snapshot/uniqueness race derive from prior transactions. No gap.

09: Same2 rows but wrong amount/deleted/missing is excellent small counterexample. Snapshot-stream no gap, replay idempotence and co-location explicit. Model limitations correct. Await cutover authority generation.

10: EXCEPT gloss clear, prior reporting UNION ALL now learned. Drain earlier admissions before final position closes key race; generation enforced and no check/write gap explicitly distinguished model from protocol. Amount35vs30 rollback shows why source retention insufficient. Strong complete mechanism.

11: Real pruning vs model move labels match evidence.

12 and judgment: Long final section earns length by completing ownership, recovery and stale-writer branches. No consequential gap. Whole capacity batch builds from workload to read copies to authoritative subsets without flattening guarantees.


## 23. Inside PostgreSQL

00: Existing pages extensively used PostgreSQL; expect coherent internal path linking learned features, not unexplained new implementation assumptions.

01: Four obligations recap established concepts with implementation focus. No gap.

02: One reservation trace promises join mechanisms, useful after breadth.

03: Server versus embedded observability explicit upfront. No gap.

04: Connection→row→change→commit→maintenance follows request chronologically. No gap.

05: Backend connection not private tables; shared/private memory and background roles precise enough. Fresh product7 stock3 explicit. No gap.

06: Candidate then visibility table useful connective media. ctid location not identity concrete. TOAST introduced only to explain row-width cost, no unnecessary internal branch. No gap.

07: Stock-only lesson vs full checkout boundary explicit. Conditional SQL block contains unconditional COMMIT but prose says handler checks row before proceeding; scoped stock-only0 safe. HOT possible not promised. No gap.

08: Commit/WAL/data page ordering reprises storage compactly to close request path. Uncommitted physical effects visibility explicit; no gap.

09: Freeze first mentioned without detailed ID reuse mechanism, suitably promise next row versions. Clear ANALYZE vs vacuum. No gap.

10 and judgment: Effective integration article. Purposeful recap connects state layers rather than merely repeating introductions. No consequential reader gap.


## 24. Indexes in PostgreSQL

00: General index page/architecture B-tree now known; expect access method matching operators beyond ordered keys.

01: Order/containment/summary distinctions concrete and motivating.

02: Stored information constrains possible answer, useful recurring reasoning. No gap.

03: Scope beyond prior article stated without retreading. Await table state.

04: Query first then methods and compare, clear.

05:20k one-second progression and20 priority derivable. Method table helps compare stored info; heap not physically reordered clear. No gap.

06: Tiebreaker and stop-after5 familiar; operator class defined before GIN, meaningful concept. Expression index vs arbitrary containment clear.

07: Inverted/hash path example and bitmap order loss explain real access path; equivalent-result different operator sequential scan derives principle. Pending list introduces observed workload variability not unexplained tuning knob. No gap.

08: Four minmax ranges demonstrate lossy pages clearly.60seconds result derivable; BRIN preserves correctness as bounds weaken. DROP Btree for exposed alternative and teaching4 pages explicit. No gap.

09: Other methods not name-dump; boundary of what was taught clear. Build failure context tied migration. No gap.

10 and judgment: Strong method comparison at right depth; exact-expression variation has genuine insight, BRIN summary table useful. No consequential reader gap.


## 25. Row versions, transactions, and vacuum

00: Snapshot/version/HOT known; expect cleanup eligibility and visibility map demonstrated, freeze explained.

01: MVCC term attached to already learned mechanism. No gap.

02: Routine obligation motivated by versions, no “maintenance magic”.

03: Single connection counters versus two-session schedule explicitly separated. No gap.

04: Version existence→need→access implications→maintenance progression clear.

05: ctid/xmin new after commit shows logical stable identity; xmax not simple deleted flag prevents misuse. No raw-header decoding promised, enough scope.

06: Server setup commit, A first SELECT snapshot, B autocommit and ordered vacuum all explicit. Unexecuted server schedule disclosed. Reader old snapshot retention beyond single queried product important. No gap.

07: Unset visibility bit not invisible, Index Only name not zero fetches, and samevalues aftervacuum three useful distinctions. Small chronology ambiguity:05 already described update to1;07 “next update ... three toone” implicitly resets to lesson start? It describes full first-vacuum/update/vacuum sequence, but previous paragraph05 sounded as already executed. Need check next section/log as minor state-context clarification, not consequential mechanism.

08: HOT chain and INCLUDE prevents optimisation explains read/write tradeoff concretely. No further reset clarification; minor07 observation remains.

09: Freeze finite ID representation answered appropriately, vacuum repeated can't outrun snapshot retention. No gap.

10 and judgment: Coherent deeper version/visibility explanation. One small state-signposting opportunity:05 says “After a committed update sets available to one” before07 restarts baseline atthree; label05 prediction or07 reset/revisit lesson's initial state. No consequential missing reasoning. Parent reports all152tutorial steps checked separately; this log remains extracted reading only.


## 26. WAL, checkpoints, and recovery

00: General durability known; expect PostgreSQL observables and operational limits, not repeat whole tutorial.

01: Motivates WAL by scattered page write cost, not just defines acronym. No gap.

02: Distinct insert/flush/commit/page moments established, order list could look temporal but says coordinated notall once; later resolves.

03: Relevant commit assumptions explicit; ordinary logged excludes unlogged silently broadening. No gap.

04: New emphasis starts logging before commit, expected.

05: Run inside explicit open transaction, own1 then rollback3 with log advances concrete. Shared stream vs attributed bytes explains limits; useful medium counterexample no durability overclaim.

06: Possible sequence qualified handles02 apparent order. Page beforecommit described separately, group flush purpose clear. No gap.

07: Redo position not completion end, no commit pending tx, torn page fullimage mechanism adds actual depth. Checkpoint-frequency tradeoff causally explained. No gap.

08: Off consistency-loss vs fsync corruption distinct. Actual PGlite fsyncoff disclosed avoids modelling-as-physical proof. No gap.

09: Log retention slot consumer first term minimally described sufficiently (consumer no advance retains); operating deletion advice grounded. No gap.

10 and judgment: Strong internal mechanism and observability boundaries. No unresolved consequential issue. Parent reports repaired row-versions forecast; will inspect recaptured context at end.


## 27. Choosing a relational database

00: Broad mechanisms now learned; expect workload/failure/deployment contract rather than product ranking.

01: Same feature different waiting/retry contextualises selection. No gap.

02: Three applications distinct deployment/workflow purpose. No gap.

03: Version/deployment specificity needed and given. No factual verification performed under reader-only scope.

04: Deployment→semantics→access→operations→trial logical selection path.

05: SQLite behind HTTP vs shared network file distinction useful; serialised writes doesn't equal user count simplistic judgement avoided. Existing estate table concrete without endorsement blank cheque. No gap.

06: Different snapshot settings tested with two SELECTs material decision. Numeric rounding18.005→18.01×2=36.02 useful portable-contract counterexample. Candidate-specific evidence scope explicit. No gap.

07: PG heap vs InnoDB secondary→PK→row explains key width consequence; SQLServer cluster≠PK clear. Feature names not interchangeable tied exact query tests. No gap.

08: Engine/edition/service permissions actual migration paths clear. Licence claim referenced exact current version; reader scope no external verify. Practical no universal ranking. No gap.

09: Same outcomes not same physical schema sound comparison principle. Stored decision conditions useful result. No gap.

10 and judgment: Useful product comparison remains tied to observable application behavior and deployment, with enough specific differences to inform experiments. No consequential gap; no unsupported universal winner inferred.


## 28. When should you add another data system?

00: Prior copy paths/deletion/reporting set up exact cost of new service. Expect capability/deployment boundary.

01: Two plausible needs and copy burden grounded. No gap.

02: Capability before system name matches collection purpose; no gap.

03: Search as bounded new mechanism then copy; ownership/freshness familiar. PGlite model context explicit.

04: Full derived-copy lifecycle clear. No question.

05: Representative typo/withdrawn result acceptance and time semantics operationalise search feature. No gap.

06: Fulltext syntax AND/@@ explicitly glossed, singular stemming vs typo meaningful expected result. Generated same transaction removes copy lag and rename counterexample concrete. No gap.

07: Stale-positive recheck not missing-new discovery especially useful distinction. Version2 tombstone protects late old update. Single database model boundary clear.

08: Outbox two failure gaps and atomic conditional version upsert clear. Full-state vs increments changes correctness, necessary reasoning included. EXCLUDED first syntax? Prior idempotency uses? Here SQL and following comparison replacement explain enough though pseudorow name not directly defined. Small optional gloss “EXCLUDED is proposed insert row” useful for novice, not blocker because prose already states rule. Tombstone/version retention tied deletion.

09: Snapshot stream boundary retains earlier movement knowledge; overlap version alternative scoped not ungrounded timestamp. Empty rebuild and lag probe meaningful. No gap.

10: Decision states evidence and copy duties with specific search/report constraints. No gap.

11 and judgment: Strong ending to collection; concrete capability then derived-state protocol integrates prior transaction, freshness, deletion and movement teaching. No consequential gap. Optional EXCLUDED gloss could ease first encounter; rule understandable from surrounding text.


## 29. Optional entry/support: The last blue mug

00: Now read with collection knowledge, so cannot recreate novice first exposure. Assess abridged/full boundary and consistency. Title promises lookup, atomic multi-record change and competition.

01: Distinct Alice/mug42 singleproduct order vs full header/lines/stock explicit, prevents conflation. Good optional entry scope.

02: Atomicity and last-item invariant clear. No gap.

03: Distinguishing multiwrite atomicity from concurrent winner exactly useful first mental model. No gap.

04: Postpurchase+laterprice explicitly states model time, historical18/current20 meaningful. Join definition new-reader sufficient, constraint examples concise. Image extraction has label concatenation, not evidence actual visual issue. No gap.

05: Explicit reset before purchase and tree separator route good. Index matching buyer/time teaches applicability rather than magical fast. No gap.

06: Comment explicitly conditional branch into order, not executable unconditional zero-reservation insert. Lost update2orders stock0 derivable and rule recheck. Model initial1stock0orders consistent extraction though compact. Distinct model A/B vs SQL P7/O14 oneconnection stated. Good abridged/fullboundary.

07: Snapshot example1→0 and two bins display rule bounded. Prior learnt detail but readable independent intro with onward links. No gap.

08: WAL durable settings qualifier, request key and external payment not atomic appropriate abbreviated scope. No misleading completeness.

09: Workload-driven relational starting point, whole-cart extension tied earlier collection structure explicit. “payments recorded locally” differentiates separate provider discussed08. No gap.

10: Model scope clear. Read optional disclosure separately next.

Optional: Scope includes ordinary committed reads, pending grouping, lock lifetime and nonmeasured steps. Main article already supplied essential boundary; optional detail not hiding required correctness. Judgment: strong optional fast tour, identifies its distinct data shape and provides full-route continuation. Live model behavior left to separate review.


## 30. Optional support: Start the SQL practice

00: Expect concrete browser/server setup, which article schema and state; authoring docs not used.

01: Reading selfcontained and fresh database perstate explicit. No gap.

02: Browser vs full/multipleconnections clearly routed, now all lesson topics availability current. No gap.

03: Docker prerequisite, no port, image client, readiness response and named collision clear. Disposable stop semantics await cleanup. No installation assumption beyond linked install.

04: Host vs container paths and download names clearly explained. Only first4 files listed as initial route not whole collection scripts; later links can extend. No gap.

05: Terminal→psql prompt/commands semicolon and expected2/36 checkpoints excellent novice support. Failedtx rollback and result-based branch explicit. No gap.

06: Reconnect temporary tables and whole extension duplicates explicit, stateful SQL trap addressed. Schema→query base/extension and two terminals sameDB clear. “Concurrent updates” row likely no separate current article? This is a table reading category; possible stale title/route absent in extraction not material but flag for final nav check if linked. No demanded content.

07: Independent lessons no foundationfiles and ownnames addressed, VACUUM alone privilege context explicit. Browser vs server questions navigable. No gap.

08: Stop disposesDB explicit, downloads persist and restart newstate. No gap.

09: Return foundation route suitable.

10: References focus actual setup. Read optional disclosure separately.

Optional: Full scripts endstate vs article stepwise freshDB well distinguished. Pagination experiments rollback and final oldestfirst outputs explicitly orient. Existing PG alternative leaves installation-specific creds appropriately with fullDocker available. Judgment: practical entry route complete, no consequential missing step. This reading does not execute Docker or downloads.


## End-of-route availability audit

After all article reading, revisited original introduction13 capture. It still presents foundations as working drafts and later performance/capacity/operations/choices/PostgreSQL groups as closed planned disclosures. This is stale captured navigation, not a claim about parent’s current page; parent reports repairing final presentation. The visible collection map should expose all available reading, correct counts and links, with no planned labels for completed articles. Read its original optional map text separately next, solely to enumerate publication labels after learning those topics.

Optional map audit: confirms27 articles across design3, querying3, transactions3, indexes1, storage1, performance3, capacity3, operations4, choosing1, adding1, PostgreSQL4. Existing first-reading stale labels also include transaction-boundaries23 “Indexes — Planned deep dive” and storage11 “Backups and recovery — Planned guide”. Publication must reconcile links/availability and the introduction11 assertion that operations have their own articles. Parent reports final sweep complete; original reactions remain intact.

## Collection editorial judgment

Completed one continuous sequential reading of the introduction,27 main articles and2 optional support routes. The reader role remained an application engineer comfortable with programming and learning SQL through prior pages. Numbered assembled-DOM chunks were read in order with reactions logged before the next, except reporting09's reaction was recovered from prior reading notes immediately after10 on context resumption, explicitly marked above. Closed disclosures were kept separate. No author source, briefs, evidence files, production history or another reviewer’s findings were read during this first-reading assignment.

The collection is editorially ready once the reported small repairs are confirmed in rendered context. No unresolved material missing reasoning, caller ambiguity or contradictory worked state emerged. It builds a useful chain: records and invariants → answers and query work → overlapping transactions and unknown outcomes → physical access and recovery → workload and operational choices → copies, ownership and product decisions. Later pages use earlier ideas to explain a new consequence. The recurring shop facts and deliberate fresh examples are labelled well enough to prevent silently carrying an old state into a new exercise.

Particularly effective passages include the left-join filter distinction; multiplied line/payment totals; the zero-row versus SQL-error versus missing-reply transaction branches; migration A/B/C read-write stages and order4’s rollback boundary; copied WAL versus replayed price; the shard move with equal row counts but three wrong facts; BRIN’s min/max page-range table; and search rechecking that removes stale positives but cannot discover missing new products. These are consequential explanations with small enough states for the reader to predict the answer. They turn advice into a mechanism the reader can inspect.

Writing remains direct and mostly unstrained across the long route. The late overview articles repeat necessary boundaries, but add an operational decision rather than re-listing features. Technical terms are usually defined where they first matter. SQL is progressively demanding, with complex examples preceded by actor, dataset and expected result. The main paths are understandable without opening optional setup or verdict disclosures. Media earns its place where it shows relationship, ordering, state or competing actions; the extracted diagrams’ captions retain the key meaning. This review cannot establish layout, focus behavior, live controls, query execution, source validity or deployment durability.

### Repairs and remaining limitations

- Publication availability: original capture’s introduction map hides completed later groups as planned, and older further-reading labels describe Indexes and Backups as planned. Parent reports the map and stale draft/planned labels repaired and navigated. Required publication repair, not a content gap; final rendered verification belongs to that sweep.
- Reporting: first UNION ALL comparison lacked a syntax gloss. Parent reports adding an explicit appends-results-without-deduplication explanation. Small teaching repair; not a freshness reasoning gap.
- General Indexes: generated test data uses generate_series, interval, %, CASE with limited first-use orientation. Parent reports adding generator/modulo/CASE orientation. Optional adaptation aid, not a blocker to reading the derived counts.
- Row versions: opening previously narrated stock3→1 before the later section performed that update. Parent reports changing it to a forecast. Rendered recapture confirmation pending below.
- Optional polish: adding-another-system’s EXCLUDED could be defined as the proposed insert row. Surrounding prose already explains the atomic version comparison, so this is not a material barrier.
- Optional practice label audit: “Concurrent updates” appears as a setup-table reading label. Extraction does not show its link target; parent should ensure it names the intended current route. No missing setup mechanism found.
- Evidence limits are disclosed in the reading: server restore drill and two-connection version schedule are documented procedures not executed authoring checks; embedded SQL models do not test real failover, network partition, physical crash, storage flushes or live distributed migration. Preserve these limitations. They do not undermine the stated teaching claims, and this first reading does not convert them into executed evidence.

No additional topic is necessary to complete the promised reader journey. A larger catalogue of features or production recipes would dilute the current scope. The collection gives readers a basis for asking precise questions and validating their actual application rather than suggesting that one example is a complete operating system.


### Rendered repair confirmation

Re-read recaptured row-versions05 after the complete journey. “Later in the lesson, we will commit an update...” now explicitly forecasts the change rather than implying it has happened. Product1 remains atthree for the later baseline. Original question resolved; inspecting the later section next.

Re-read recaptured row-versions07: baseline vacuum, update3→1, second vacuum now follows forecast coherently. Repair confirmed in context.

Re-read recaptured adding-another-system08: EXCLUDED proposed versus choice_copy stored row now named beside atomic comparison explanation. Optional syntax friction resolved without bloating example.

Re-read recaptured practice06: obsolete duplicate Concurrent updates row removed; Transaction boundaries names its database and second session for overlap. Two-session instructions remain immediately below. Repair confirmed in context; link target is outside plain-text evidence and parent reports link audit.

Final judgment after repair confirmation: the collection is ready on writing and explanatory quality. No unresolved material findings from this continuous first reading. All three final contextual repairs resolve their specific observations. Parent separately reports final build, repaired-page render checks and link audit; those are not checks performed by this reader. Remaining server/protocol execution limitations are already accurately disclosed in the articles and remain limitations rather than hidden claims.
