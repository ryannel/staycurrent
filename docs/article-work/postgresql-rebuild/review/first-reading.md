# Independent first reading of PostgreSQL collection

Audience: application engineer with basic SQL and relational transactions, without PostgreSQL internals. Read only the context-free voice reference, first-reading protocol, and supplied assembled artifacts. Delivery: numbered direct-child DOM text chunks, read in order; optional closed disclosures inspected separately; supplied screenshots provide rendered visual evidence but not live interaction. Artifact set: `/private/tmp/postgresql-rebuild-review/`, received 2026-10-15; no revision identifier supplied in manifests. No article source or research/author notes read. I have PostgreSQL expertise and explicitly distinguish knowledge supplied from it. This is an agent reading, not a human comprehension test.

## Inside PostgreSQL

### Opening, chunks 00–04, saved before first section

I can explain that a SQL table is physically pages holding multiple record versions, that indexes locate records, and that transaction information chooses the version a query can use. I can distinguish being in memory, being on disk, and belonging to a committed transaction. The first paragraph supplies these distinctions directly, with the useful surprise that a changed disk value can be uncommitted. I cannot yet explain why those distinctions hold, which is the natural task of the sections ahead.

The three-unit product, two-unit reservation, older report and competing buyer establish an unusually useful common example. I expect to learn the connection between the SQL request, storage, concurrency and commit. The outline gives a sensible route in that order. PGlite is identified as a smaller browser lesson; PostgreSQL 18.6 supplies the worked observations. I have not been told how to run anything yet, but no run is needed to follow this opening. No expertise was needed to supply a missing explanatory step here.

### Who receives the request? — chunk 05

The connection/session paragraph gives an application engineer a concrete consequence immediately: retain the connection throughout a transaction. Shared pages versus private sort state also answers a likely mistaken model of a backend owning a database copy. The background-process paragraph makes their parallel role clear, though “buffers” and “WAL” are named before defined; their exact work is still pending rather than required to interpret the SELECT.

At `fillfactor = 80`, I infer from expertise that this is a percentage. The text supplies its purpose but not its scale; the example does not yet require adjusting it. The experiment has 10,000 products and a B-tree primary key, but its setup is a closed disclosure. I can understand the visible SELECT and expect the stated one-product result; running it requires opening setup. Record 7's logical identity is explicitly separated from physical position, so no missing step there.

### How an index leads to a record — chunk 06

At “snapshot still decides” in the figure, snapshot has not yet been defined. I can carry this as the query's view because the following paragraph uses precisely that language; the visibility mechanism remains pending. The core lookup is fully traceable: key 7 → leaf entry (0,7) → item 7 on heap page 0 → tuple bytes → visibility check. The passage explaining indirection gives a reason for a detail that could otherwise feel arbitrary. “Tuple” is introduced through “stored row versions” closely enough to be understandable.

Rendered inspection: the full-page 1280 light screenshot was too reduced for reading, so I inspected a native-resolution crop of this figure. Arrows and highlights make the two levels of reference clear; the shared-buffer boundary is visible, though its meaning awaits the next section. This was supplied screenshot inspection, not live browser inspection. I did not use the tiny later sections in the full-page thumbnail as reading material.

The measured one-row Index Scan is interpretable without a full plan dump. I can explain why requesting name and stock requires the heap, and why an index containing those values still needs visibility support. No expertise needed to bridge the lookup. The index-only question is deliberately deferred and now gives me a reason to keep reading.

### Where the pages come from — chunk 07

This resolves the shared-buffer boundary in the figure and distinguishes PostgreSQL cache misses from physical device reads. The observed three hits are explicitly accesses, not three distinct disk pages: a useful limit on the evidence. Memory coordination and transaction waits remain distinct without requiring lock implementation detail. TOAST opens a useful onward question about large-value cost but does not obstruct the example. Returning stock 3 does not reserve it; that final sentence prepares the next concurrency step well. No unresolved necessary question or supplied expertise here.

### Why readers can see different values — chunk 08

The need to preserve the report's old stock supplies the reason for versions before introducing metadata. Snapshot is now defined as transaction history included in the read; the S/W example answers the earlier pending visibility question. I can decide old versus new version by creation and replacement visibility. The diagram's native-resolution screenshot crop gives the same decision clearly, with both locations and the 3→1 change attached to their versions.

The three-connection schedule is readable as an ordered procedure. I can explain step 3 without inventing page copies or reader waits. The first-read snapshot timing and instruction to end R prevent two plausible experimental mistakes. The prediction and its answer arrived in one chunk and adjacent prose, so I cannot claim a separately preserved blind prediction; the preceding schedule does supply the facts needed to predict 1 under Read Committed. Practical reservation SQL is still unstated in this section, though the action and result are understandable. Opening setup may supply it. No technical inference from expertise was needed for the visibility result.

### What a competing writer waits for — chunk 09

The explicit reset is valuable: this is a new trial with stock 3, not a continuation from stock 1. The guarded subtraction supplies the missing reservation command from the previous section. I can trace A's 3→1 update, B's wait, its fresh test 1>=2 failing, and zero returned rows. The rollback variation follows from the same account. “non-summarising index” arrives without explanation in the HOT paragraph. For the concrete B-tree decision the following sentence gives the consequence, so I can follow the example, but I would not know which other indexes qualify without the linked documentation. I supplied the meaning of HOT's name from expertise; the paragraph teaches the shortcut itself without needing the expansion.

### What commit makes durable — chunk 10

WAL and dirty buffers are now defined. I can reconstruct the crash case from the stated two ordering rules: the stored page has 3, volatile memory had 1, durable WAL records the change and commit, and replay restores 1. The native screenshot crop of the three-column figure is legible and separates lost memory, surviving storage and restart. This resolves the opening's apparent contradictions. The reverse case explains why durable physical bytes are not committed visibility. Checkpoints and asynchronous policy extend the same distinction rather than replacing it. The last paragraph raises ambiguous commit and operation identity as an onward application design problem; enough reason is supplied here to understand why it exists. No expertise bridge needed.

### Maintenance, onward reading and optional setup — chunks 11–12, then optional.txt

The index-only question is resolved: covering values plus all-visible page information. Long snapshots now have a causal maintenance consequence, not just a warning. “Freezes” and transaction-ID reuse remain brief onward topics; the promised row-version chapter is a reasonable destination. The closing path is supported by the earlier account rather than a new claim.

Separately opened setup supplies schema, population, ANALYZE, transaction boundaries and repeat/reset instructions. It assumes an available disposable PostgreSQL database and a way to open multiple connections. There is no server installation, database-creation or connection command in this artifact. I have not attempted execution; this is unresolved operational context for a reader starting without a server, not an observed execution failure. The nominal schedule's “reserve” command is supplied in the following visible section, so a reader attempting the first schedule immediately must look ahead or compose that SQL. The conceptual reading remains intact.

### Writing judgment

The article is patient and coherent. The three-unit product survives all major transitions, and sentences such as “The application receives the value three. That response establishes what this read saw; it does not reserve those units against another request” give a concrete consequence to the mechanism. The connection paragraph and WAL ordering rules are especially strong. The diagram's explicit logical-to-physical route supports the prose without replacing it.

Minor strain comes from “non-summarising index” in an otherwise introductory HOT explanation and the unspecified numeric scale of fillfactor. Neither prevents the concrete example. The first concurrency schedule asks for a reservation before presenting its exact guarded SQL; moving or repeating that command would improve immediate practice. No necessary conceptual repair found. Screenshot checks: native crops of all three diagrams in 1280 light; lookup diagram in 1280 dark; 390 dark opening/navigation. These samples are clear, but this is not a complete visual or interaction test.

## Planning and executing a query

### Opening — chunks 00–03, saved before first section

I can explain that plans are selected using estimates before execution reveals actual results, and that execution operations request rows and may retain intermediate state. The opening promises three consequences: tenant-sensitive plans, small output with large work, and multiple memory allowances. The numerical setup is fully reconciled: 45,000 + 100×50 = 50,000. I carry the architecture article's planner/executor, index/heap and buffer distinctions. A direct entrant has the plan distinction defined here and an architecture link for deeper storage context. I do not yet know which customer or ordering query will exhibit each consequence, which the sections promise to establish.

### What is decided before execution? — chunk 04

The stages expand the earlier architecture account and the prepared-statement caveat is understandable. The heap-versus-index cost comparison carries over cleanly; payload's purpose is explicit. The last paragraph names scans, joins and plan estimates as prerequisites from another article. I know these from expertise, while the stated audience does not necessarily know joins as physical plan operations. I will watch whether the visible examples supply enough rather than treating the link itself as comprehension. “Cold tenant” here means small tenant by context, but could be confused with cache temperature after the preceding page's warm buffers; the 50-row count makes its intended meaning recoverable.

### One statement, unequal tenants — chunk 05

At the prediction, I know one tenant is large and 100 are small, but the default-visible text has not assigned those sizes to IDs 0 and 1. I cannot derive which EXECUTE uses the index from the visible setup alone. The next paragraph resolves the mapping retrospectively (1=50; 0=45,000), and the table then reinforces it. Optional setup may have supplied it to an experiment-running reader; this is a distinct visible-path prediction gap. Since prediction and answer arrived in one chunk, I am not claiming an isolated blind prediction.

The custom/generic distinction is otherwise fully supported. `$1` is explained; 495 is visibly unchanged while actual rows vary. I can infer 495 is near 50,000/101, but the article does not require that derivation and I supplied it myself. Automatic planning compares estimated costs rather than measured runtimes: a useful clarification that prevents an incorrect adaptive-optimizer mental model. The session/driver warning connects the mechanism to a realistic investigation. Equalising the distribution is a well-motivated variation, though exact mutation SQL remains an exercise rather than a supplied command.

### When five rows require all the input — chunk 06

The parent requesting rows from a child is taught here, so that prerequisite is not left to the linked execution article. Top-N explains both the small retained set and the need to inspect all candidates. The fixture's exact returned IDs (101, 202, …) cannot be derived from the visible setup, since priority generation lives in the closed setup, but the route comparison does not depend on deriving them. Unlike the tenant prediction this is a reported observation, so the effect is low.

The native screenshot crop of the two plan paths makes their work counts and early-stop difference clear. I carry the previous article's index-only visibility requirements and the reminder is sufficient for a direct entrant. I can predict that an added unindexed filter can require more visits. The final paragraph's hash join and incremental-sort examples are compressed and use physical-plan knowledge I already have; the core five-row case is complete without them. They work as additional instances, not as standalone instruction in those mechanisms.

### Where working memory multiplies — chunk 07

The full-payload sort changes the task explicitly, so I do not carry the earlier five-row limit into it. SET LOCAL plus BEGIN/ROLLBACK gives the setting a safe, explained boundary. The bound is traceable: 10×2×64 MiB = 1,280 MiB = 1.25 GiB. The caveat about simultaneously active operations protects the estimate from overinterpretation. Parallelism adds vocabulary and a considerable amount of new structure late in the section, but its intended claim—resource use can grow beyond the serial form—is explained with leader/worker and shared/private distinctions. I could not estimate a specific parallel plan's memory from this paragraph alone; it does not promise that. Async I/O is a brief relevant onward branch and explicitly does not explain every speed difference. No blocked central inference.

### Measurement, onward reading and optional setup — chunks 08–09, then optional.txt

The measurement paragraph gives the node-time and loops cautions before the reader is asked to diagnose a real plan. It supplies concepts rather than a worked multi-loop plan; interpreting such a plan remains an onward skill. The separation between finding rows and transferring 45,000 payloads follows naturally from the fixture.

Opened setup confirms tenant 0 is the first 45,000 jobs and all other IDs are spread across 1–100. The earlier prediction is supported for readers who opened and interpreted it, but not for the default-visible route. It also explains priority-zero multiples of 101. The modulo and md5 expression are more SQL than the basic audience necessarily knows; their exact distribution is understandable from counts and reported results without requiring independent derivation. Setup again assumes a usable server/database and connection method. No execution attempted.

### Writing judgment

The three comparisons have clear purposes and preserve their inputs well. “The large request does not become small because the generic plan was chosen for a much smaller estimated answer” is plain and memorable in context. The top-N account is particularly effective because it explains why small memory does not mean small input. The memory section remains readable but gathers several onward mechanisms (parallel state, Gather, async I/O) after the central calculation; those paragraphs demand more physical-plan background than the earlier examples. The one consequential local repair is to identify tenant 0 as the large tenant and tenant 1 as small before the prediction. No broader rewrite is warranted from this reading. Rendered inspection covered the 1280 light demand diagram; other layouts and interaction behaviour were not tested.

## Indexes in PostgreSQL

### Opening — chunks 00–04, saved before first section

I can explain three stored-information strategies: ordered keys locate intervals, extracted elements identify containing records, and page-group minima/maxima rule groups out without identifying exact matching records. The opening's strongest contribution is the last distinction: retaining a group is not proving that all its rows match. I expect B-tree, GIN and BRIN to be tied to candidate discovery, rechecks and write costs. I carry the earlier B-tree route and index-only visibility explanation; direct entry receives enough vocabulary to follow the opening but still needs the sections to map the named methods. The two browser lessons and server-only skip-scan boundary are stated.

### Follow ordered keys — chunk 05

The event timeline supplies enough input to derive the five descending IDs and time of event 20,000. This makes the first observed result more independently checkable than the prior page's priority fixture. The B-tree description adds neighbouring-page links to what I learned earlier. Composite key runs make later-column search understandable without relying on the term “left prefix.” For the server skip-scan example, three tier runs suggest three useful seeks, but the observed counter is four. The text uses it only to prove multiple searches; why exactly four remains unexplained curiosity, not a contradiction. The separate fixture has no full creation/population commands in this visible section, so the sample EXPLAIN is illustrative rather than immediately runnable as delivered. The article marks it separately, which prevents continuity confusion with the event table.

### The operator is part of the design — chunk 06

Operator class initially arrives as an abstract contract, then the containment-versus-extracted-text comparison makes its consequence concrete. The containment syntax @> is named by the sentence introducing the SQL. I can derive twenty matches from every thousandth of 20,000 events. The reason a different predicate loses index support is explained without claiming that the two queries always mean the same thing. Path-and-value hashes remain an implementation hint; the later JSON chapter is the stated place to derive their use. No necessary comprehension gap.

### Combine the records containing each key — chunk 07

The A–D diagram and its immediate explanation make inverted lists tangible. I can intersect {A,C} and {B,C} to get C or union them to get A,B,C. The 20,000-document arithmetic is also derivable before the stated results: 40 both and 200+80−40=240 either. Prediction and answer still arrive in one chunk, but required inputs genuinely precede the question here. Native screenshot crop confirms the row/key mapping and result panels are readable.

The explanation of exact tuple references becoming whole candidate pages supplies the meaning of lossy bitmap instead of only naming it. Recheck Cond is carefully distinguished from actual false positives. I can carry the earlier demand lesson to understand why newest-ten still sorts more candidates. The concluding “may” appropriately avoids assuming every plan performs exactly six times the work. No expertise needed beyond ordinary set reasoning.

Visual detail from the GIN crop: `urgent` and `B, C` touch closely enough to read as “urgentB, C”; `audit` and its list also have little separation. The left document table is easier to scan. This is minor visual spacing friction, not missing meaning; two columns or more gap in the right mapping would help.

### Exclude ranges without identifying rows — chunk 08

This fully develops the opening's min/max distinction. The timestamp bounds and 60-second interval let me verify both exclusion and exact output count. The same data in different physical placement is an effective controlled comparison; explicitly accepting the sequential plan avoids teaching that an index must always be forced. “Lossy” now has a second, structurally inherent cause distinct from GIN's memory-pressure case. Smaller ranges versus mixed values is clearly limited: granularity cannot restore absent ordering. Unsummarised ranges and late arrivals give the maintenance consequence before the next section. No expertise bridge needed; exact fixture creation remains in the linked lesson rather than this server excerpt.

### Keep the extra information current — chunk 09

The split explanation completes B-tree write cost, and pending-list merging explains how GIN can defer work without making it disappear. HOT is a genuine carried prerequisite from the architecture page and is linked for direct entrants. BRIN's compactness is connected to the earlier failed selectivity experiment. The final query-first method follows from the comparisons rather than appearing as generic advice. optional.txt is empty; no hidden setup supplied here. Server excerpts assume fixture tables available from the lessons or a separately constructed setup; I did not run them.

### Writing judgment

This page develops structural differences well. The repeating question—what information lets us exclude what work—organises the examples without a repetitive sentence template. The min/max section is particularly strong, and GIN's two different reasons for rechecks are explained carefully. The exact-four-search skip-scan counter creates a minor unanswered curiosity, and its example is less reproducible here than the event lesson, but the narrow claim is supported. The GIN mapping's right-hand spacing strains visual reading slightly. No major conceptual repair found. Rendered inspection covered its 1280 light diagram only; this is not a full responsive review.

## Row versions, transactions, and vacuum

### Opening — chunks 00–04, saved before first section

The same 3→1 product example signals continuity with architecture, and I carry its creation/replacement/snapshot account. This opening explicitly promises three further mechanisms: visibility choice, index route preservation and safe byte reuse. For a direct entrant, multiple physical versions and the older report's need are explained in plain terms. The server experiment versus browser limitations are clear. I can explain why versions are needed, but deeper index-chain and cleanup details remain the work ahead.

### What an update leaves behind — chunk 05

The shift from product 7 to product 1 is explicitly a new small setup, so continuity does not mislead. ctid and xmin are refreshed for direct entrants, while xmax is added with a useful caveat. The two physical versions are explicitly not an ordinary SELECT result, which prevents a likely false inference. At “its tuple flags identified a lock,” the method for inspecting flags is not shown, so this is accepted as a reported observation, not a reproducible command. MultiXact is an onward mechanism; the text supplies enough to prevent treating xmax as a deletion Boolean. The actual update statement is not shown yet, but the resulting 3→1 state is clear.

### Deriving a reader's answer — chunk 06

The 784:786:784 snapshot is decoded field by field, and transaction 785 gives a concrete reason that transaction IDs alone are insufficient. I can derive that creator 783 is eligible while replacement 784 remains excluded, including after 784 commits. Shared xmin/xmax names are explicitly disambiguated. This is a successful extension of the earlier S/W picture rather than redundant repetition. Native screenshot crop confirms both versions and both readers' decisions remain visually attached. The pg_visible_in_snapshot limit is clearly explained: membership is not commit status. No hidden expertise bridge needed for the ordinary case.

### Keep an older reader open — chunk 07

This supplies executable update and two-connection scheduling. The preceding paragraph reported an already executed update, while the only visible executable setup still has stock 3; readers who ran only shown commands can follow it directly. The page explicitly explains the extra transaction 785 as a separate illustration aid, removing what otherwise would be a reproducibility mismatch. The physical-inspection command resolves my pending question about inspecting tuple flags, though output beyond normal payloads is deferred to the next section. Connection creation still assumes an existing server client; no execution attempted. The schedule's correct connection labels and “after A commits” make the cleanup dependency easy to follow.

### Following the index through cleanup — chunk 08

The index-preservation promise is met. I can follow index (0,1) through the old tuple to (0,2), then through the retained slot-one redirect after old payload removal. The native screenshot crop makes both states clear; preserving the same reference in each row is useful. This is the explanation I needed beyond “vacuum deletes old versions.” The covering-index variation ties a read optimisation to loss of HOT, and explicitly marks its observed two-entry fixture as fresh. The indexes page now supplies the summarising distinction that was terse in architecture; direct entry still gets BRIN named as the exception. Fillfactor's space tradeoff is clear even though its percentage scale is never stated explicitly.

### When an index can skip the heap — chunk 09

This refines the earlier visibility-map explanation with all-visible versus all-frozen. The clear-bit caveat is particularly useful: lack of proof is not proof of invisibility. The separate 2,000-product fixture is labelled, so the table switch is deliberate. The before/update/vacuum sequence holds the query and final stock answer constant while heap fetches change. The exact update command and table setup are in the linked lesson rather than fully supplied here; the account is conceptually complete, and the instruction explicitly sends the practising reader there. The combined HOT/read-visibility tradeoff is now explainable from the previous section.

### Why old transaction IDs need freezing — chunk 10

The circular half-range explanation makes freezing's purpose understandable. I had to picture a numbered ring at “ahead/behind,” but the following consequence—an ancient creator appearing future—keeps the needed inference short. A small ring drawing might reduce effort, but no central explanation is absent. The unchanged numeric xmin with a frozen flag extends the earlier warning about reading system columns alone. All-visible versus all-frozen is now fully differentiated: safe read shortcut versus no remaining freezing work. The static-table consequence is earned by cluster-wide ID consumption.

### Diagnosing maintenance — chunk 11

Eligibility versus processing capacity makes the diagnostic sequence purposeful. The monitoring query's output fields are explained by the retained report, including client-read wait and two different notions of age. I can interpret that snapshot retention is possible while application activity is absent. The counters paragraph carefully limits n_dead_tup and timestamps. The later alternatives remain operational choices to investigate, not magic settings. The ordinary-vacuum/file-size distinction follows from reusable page space already taught. No concrete output table is shown for the counter query; I would need to practise interpretation separately, but the article does not prescribe a decision from unspecified numbers.

### Stable views and onward reading — chunks 12–13

The two-doctor example changes domain explicitly to distinguish version selection from business-invariant protection. Its two different row updates explain why ordinary write conflicts need not occur. Full-transaction retry follows from rereading the count, not just from quoting SQLSTATE. This is enough for the limited closing distinction; the detailed isolation schedule is reasonably linked elsewhere. No optional disclosure content.

### Writing judgment

The page fulfils all three opening promises. The strongest passages are the out-of-order 784/785 example and the surviving slot-one redirect; both explain mechanisms the overview had only named. The pictures preserve identities and states clearly. The diagnostic section is long but follows a useful decision order and keeps observations distinct from exact inventories. The freezing ring requires a little mental drawing, and some physical inspection results are narrated rather than printed, but neither blocks the explanation. No necessary conceptual repair found. Operationally it assumes an existing disposable PostgreSQL database/client, and some later experiments live in linked lessons; execution was not attempted. Screenshot inspection covered both 1280 light diagrams, not all responsive variants.

## Initial four-page handoff

The sequence successfully carries a reader from logical request through physical lookup, execution choices, index information and retained-version cleanup. Main repair: establish tenant 0/1 sizes before the query-execution prediction on the default-visible path. Smaller opportunities: supply architecture's reservation command at its first schedule, loosen GIN mapping spacing, and optionally illustrate circular transaction-ID ordering. The unresolved server connection/setup context is practical completion for readers starting without PostgreSQL, distinct from the conceptual explanation. No article edits made.

## WAL, checkpoints, and recovery

### Opening — chunks 00–04, saved before first section

I can explain why durable WAL can preserve an acknowledged change while its page remains only in memory. Physical recovery and transaction visibility are explicitly separate, continuing the architecture and version chapters. A direct entrant gets those two jobs stated here. The promised new detail is how checkpoints and page positions bound replay. The immediate-shutdown experiment is carefully scoped away from a power-failure/storage-flush test; its settings and browser limitations are explicit.

### A logged change is not a commit — chunk 05

Storage effects rather than replayed SQL is explained with concrete reasons: snapshot/function/concurrency dependence. At the rollback prediction, the preceding text says WAL records work before commit but has not yet explained why rollback cannot erase it. My prediction that the log stays ahead uses expertise about append-only logs; the following paragraph supplies interleaved later records as the missing reason. This is a discovery exercise rather than an unsupported subsequent recommendation. The lesson's marker table is explicitly external setup; this excerpt alone is not runnable. Statement-level versus global WAL counters is a useful measurement limit.

### Insertion, writing and flushing — chunk 06

LSN and the three progress stages are defined before the counter table. The hexadecimal positions require recognising ordering in an unfamiliar notation, which I supply from expertise, but the following prose explicitly states which is ahead and avoids depending on reader arithmetic. The two waiting rules are already familiar from architecture and stand alone here. Group commit follows from a flushed prefix covering multiple required positions; no missing inference. I can distinguish global counters from the acknowledged transaction's guarantee.

### Crash with an older table file — chunk 07

The separate two-record fixture is introduced clearly. I can track A=committed 1 and B=uncommitted 0 while both WAL changes are flushed, and derive recovered values 1 and 3. The unrelated marker commit has an explicit purpose rather than appearing as incidental lab machinery. The physical-file comparison makes redo necessary rather than merely asserting that restart succeeded. No execution commands for this destructive test are supplied here; it is a reported test, with the browser variation separately bounded. The explanation needs no expertise bridge.

### Decide which page changes need redo — chunk 08

The danger of applying work twice supplies the need for a page LSN before introducing it. P20/P30/P40 are explicitly ordered WAL positions rather than transaction IDs. I can decide skip P20/apply P40 from a P30 page without supplying anything from expertise. The native screenshot crop shows the P30 source above the two comparisons clearly. The actual update-page LSN versus later commit-record LSN then returns the abstraction to the measured experiment. The full-page-image exception is flagged as additional handling, which I expect next.

### Bound replay and repair partial pages — chunk 09

Checkpoint writes and concurrent redirtying explain why completed checkpoint does not mean clean buffers or committed transactions. The torn-page problem supplies the reason for full-page images, resolving the prior exception. The surprisingly small 216-byte image-bearing update is explained by omission of unused space/compression, so it does not contradict the 8 KiB page. The interval tradeoff follows from repeated first-change images versus replay volume. I can understand the balance, though computing a production checkpoint setting remains rightly outside this example.

### Choose the success promise — chunk 10

The asynchronous-commit versus fsync distinction is derived from the earlier ordering rules: allowed acknowledged loss versus damaged recoverability. Remote acknowledgement and ambiguous client result are bounded extensions of the same promise. I can explain why synchronous_commit=on alone does not create a second copy. No new missing prerequisite.

### Recover a different history — chunk 11

The committed DELETE is a concrete reason restart is not undo. Base backup plus uninterrupted required WAL gives PITR its prerequisites, and excluding legitimate later commits gives it an application consequence. Timeline history and slots are named ahead of full explanation; the next replication page is a natural place for slots. No claim here requires me to operate them. optional.txt is empty.

### Writing judgment

The argument is clear and cumulative. The strongest section is the two-record restart experiment: both updates' WAL is durable, only one transaction commits, and the final values distinguish the two jobs. P20/P30/P40 reduces numeric burden. The warning about fsync is grounded in the preceding mechanism. The final backup/retention section opens several operational topics quickly but keeps its claim bounded to recoverability prerequisites. No conceptual repair found. Most server observations are reports rather than complete runnable labs; the browser setup link is explicit, and no execution was attempted. Native 1280 light page-LSN diagram inspected.

## Following a change to another PostgreSQL server

### Opening — chunks 00–04, saved before first section

I can explain that receiving log records and replaying them to a query-visible state are separate, using the price example. Physical replication copies recovery work into another database copy, while logical replication decodes table changes into independently stored tables. The opening promises both plus promotion and former-primary return. I carry WAL/replay from recovery; a direct entrant gets their rough roles but would benefit from that prior reading. Product 7 now has price 20 rather than stock 3; the new two-server fixture makes the changed attribute and purpose explicit. These are server observations, not a browser lab.

### Receive, flush, replay — chunk 05

This adds process ownership to the earlier physical-recovery model. The post-commit marker's conservatism is explained, so I do not mistake it for a transaction ID. The paused-replay experiment provides a concrete received/replayed/price comparison, then requires a new read after resume. Native screenshot crop shows both server paths and the paused boundary clearly. LSN hexadecimal notation is now explicitly described, resolving the minor notation assumption in recovery. To run “compare as pg_lsn” I would need to write the SQL comparison myself; no exact wait query is shown here, but the required condition is clear.

Visual detail: in the receive/replay figure, the central “WAL stream” label runs into/under B's box; the arrow is visible but its label is partly obscured. The prose explains the relationship, but the rendered graphic needs more space between server columns or a different label placement.

### Route a read to visible data — chunk 06

The reload-after-save example makes stale reads an application behaviour, and the marker/wait/new-snapshot sequence specifies the whole freshness condition. The existing Repeatable Read snapshot caveat is understandable from earlier teaching. The two synchronous policies then demonstrate flush versus apply with prices 26 and 27, preserving the current 25 from the prior experiment. SyncRep is named through the observed waiting state. The cancellation ambiguity follows from local commit already being complete. Standby conflict handling introduces a new direction of cost—primary cleanup constrained by reports—but directly connects to old-version retention. The section is dense, yet each paragraph has a concrete decision. No central missing inference.

### Keep enough history — chunk 07

Replication slots are now explained, resolving their brief appearance at recovery's end. The consumer requirement gives restart_lsn a purpose, and the distinction between byte distance, disk use and catch-up time prevents overreading the counters. The cap's tradeoff is clear: protect primary space at possible cost of a new replica copy. No operational result is promised without diagnosing the consumer. No expertise bridge needed.

### Apply table changes — chunk 08

The independent storage explanation earns different indexes and separately maintained schema. The tenant-filter transition is fully traceable: (7,101) moves outside the subscriber's set and therefore becomes a DELETE; return becomes INSERT. The composite primary key has an explicit purpose as old-row identity. Sequence state is another independently stored object, so its failure to advance follows the distinction; the concrete duplicate 101 demonstrates the practical consequence. Conflict examples distinguish overwrite, uniqueness stop and missing-target skip instead of promising automatic multi-writer behaviour. This is a lot of new operational detail, but each follows the ownership distinction. The publication statement is explicitly incomplete setup, so I do not mistake it for a full runnable replication recipe.

### Promote and rejoin — chunk 09

The reset of the synchronous requirement is explicit, so A's acknowledged 35 being absent from B does not contradict the preceding synchronous example. The shared 27 → divergent 35/new-authority 27 → later 30 path is traceable. Native screenshot crop shows the two branches and rejoin, although its text is relatively dense. Fencing is explained through the concrete distinction between controller reachability and other clients' write access. Rewind's loss of acknowledged divergent work is clearly stated, as are its failed first attempt and WAL prerequisites. Patroni and managed-service topology are useful onward context, but introduce external systems after the core mechanism; they do not interrupt the example. No central gap.

### Keep a logical subscriber through failover — chunk 10

At “Now add a logical subscriber C to primary A while B remains A's physical standby,” the roles no longer match the state just established: B was promoted, and A rejoined B. I can infer this is a new hypothetical scenario that reuses the initial topology, but the text does not say it resets. This creates avoidable continuity friction precisely where a third server is being added. A short “Return to the original topology” would resolve it without extra mechanism.

Once that reset is supplied, the slot/readiness explanation follows: C needs a usable continuation point on B, and B must possess the history C already consumed. Asynchronous slot metadata and synchronized standby receipt are distinct prerequisites. No exact setup is promised for this advanced configuration; documentation is the explicit next step.

### Optional setup and writing judgment

Opened setup is substantially more operationally complete than earlier pages: required version/tools, unused ports, temporary directory, shell versus SQL terminals, socket connections, expected recovery roles, initial price, and stopping both servers are all supplied. It assumes PostgreSQL 18 binaries already installed on PATH. I have not run it; no failure is observed.

The writing uses observed prices and explicit boundaries well. The flush/apply comparison and promotion loss make abstract guarantees tangible. Necessary local repair: make the topology reset before logical-subscriber failover explicit. Visual repair: the receive/replay figure's central WAL label overlaps B's box. The final slot section is dense but motivated by a real continuation failure rather than a feature inventory. Native 1280 light crops of both diagrams inspected; other responsive/theme variants and live behaviour untested.

## Where distributed PostgreSQL work runs

### Opening — chunks 00–04, saved before first section

I can distinguish dividing storage into native partitions from distributing ownership/work across machines. The shop/tenant example supplies a locality reason for assigning related rows to one owner, and multi-owner requests promise a different execution/transaction problem. Citus is named as the distribution extension, with its diagrams explicitly documented architecture rather than measured cluster results. This is a clear change of subject from copying histories on the previous page. No expertise is required to understand the opening's ownership distinction.

### Choose local children — chunk 05

The four-row/two-month fixture makes pruning derivable, and the generic-plan example extends the earlier custom/generic lesson with a different mechanism. Append is defined at first result. The tenant-only query explains why partition count does not imply selectivity. The duplicate event ID across distinct date pairs makes the unique-key consequence concrete. FDW is a substantial new branch after native partitioning; its local/remote snapshots can be followed using earlier isolation teaching, but a direct entrant would need that background. The two-phase-commit limitation is named before two-phase commit is explained; I expect the multi-owner section to supply the mechanism. No central native-partition gap.

### Carry the tenant identity — chunk 06

Ada and Bo sharing customer_id=1 make both the compound foreign key and complete join condition necessary. I can derive four wrong rows from the incomplete join and the intended one-row tenant-7 answer from both equalities. The total 25 carries from replication's orders example, but this section does not explicitly assign totals before reporting the answer; its numeric value is incidental to the identity lesson. The distinction between a constraint and a SELECT's correctness is especially clear. No expertise bridge needed.

### Route to colocated shards — chunk 07

Hash→range→placement identifies the routing steps, and shard-as-local-table ties them to the internals already learned. The distinction between identical tenant distribution and guaranteed co-location is explicit. The native diagram preserves Ada/Bo and the local-join relationship; its two-worker schematic is labelled, avoiding a false shard-per-tenant inference. The all-tenant sum 25+40=65 is derived and contrasts naturally with one-owner work. Global unique-email constraints follow from each worker's limited view, while reference-table copies introduce their corresponding write cost. This is a strong section with no missing central explanation.

### Finish work on several owners — chunk 08

Two-phase commit is now explained, resolving its earlier FDW mention. Durable prepared state plus retained locks makes the coordinator-failure consequence concrete. The native screenshot schedule highlights A committed/B prepared, making the mixed observation easy to see. I can distinguish eventual all-or-none outcome from simultaneous cross-worker snapshots, though the phrase “atomic outcome” runs against a common intuition about atomic visibility; the explicit example handles that tension. The final implementation paragraph narrows the activation claim to a two-owner write sequence and distinguishes read-only participation. No required expertise bridge.

### Move work when the load changes — chunk 09

Capacity, placement movement, tenant isolation and splitting one tenant's workload are separated with useful causal steps. The “initial copy reached 100%” sentence gives a clear reason to inspect change-stream catch-up. The project-ID alternative names the changed application boundary and its lost tenant-wide locality rather than offering a mechanical hash fix. Coordinated restore points introduce a further operating requirement that follows from multi-worker commit decisions. No central gap; exact rebalancing commands are appropriately left to the deployment guide.

### Recognise a different system — chunks 10–11

The layer comparison prevents applying PostgreSQL page/WAL mechanisms to a wire-compatible system automatically. The final recap ties compatibility questions back to the concrete shop requests. No optional disclosure content. Browser examples supply native experiments; Citus diagrams and claims are explicitly documentation-based and not an observed distributed run.

### Writing judgment

This is a coherent teaching progression from local child selection through identity and placement to multi-owner completion. Ada/Bo and tenant 7/8 persist well. The two-phase schedule is particularly valuable because it distinguishes atomic completion from a distributed snapshot through an actual intermediate state. FDW and other engines are broader excursions but their role is clear. The total 25 first appears as a result before its fixture assignment, a minor illustrative detail rather than an argument gap. No necessary conceptual repair found. Both 1280 light diagrams inspected at native scale; no live or complete responsive inspection.

## JSON queries in PostgreSQL

### Opening — chunks 00–04, saved before first section

I can explain that querying JSON requires preserving relationships inside nested structure, and that index support attaches to particular operations/expressions. The seller-A-under-15 contrast gives the first problem a concrete shape before showing SQL. A numeric type policy is the third promised topic. The opening explicitly takes the representation as given, with a separate destination for choosing JSON versus related records. I carry operator-class and extracted-expression lessons from indexes; direct entry receives the question but needs the examples for mechanics. The page is visibly marked Working draft.

### Objects and containment — chunk 05

All four records and their differences are supplied before the query. I can derive matches 1 and 4 from ceramic+blue and explain why extra structure and string capacity do not alter the result. The dedicated generated index fixture is announced early, preventing later data-count confusion. jsonb's loss of message formatting/repeated keys is connected to a different requirement rather than presented as trivia. Array-order independence is a useful boundary on the tag example. No missing inference.

### Conditions on one offer — chunk 06

The target answer is established before syntax. The JSON path operators are decoded immediately after the code, so I momentarily rely on unfamiliar @?/$/@ notation but the next paragraph resolves it. The result table and explanation of discarded identity make the false positive on product 2 derivable. The 20-price variation follows the same data. Error suppression is introduced as a search-versus-validation boundary, giving a reason for the later type-policy section. Strong explanation, no necessary repair.

### JSON as query rows — chunk 07

The four intermediate offer rows are printed explicitly, so I can trace cardinality and final 1/A/12 without imagining a lateral expansion. ERROR ON ERROR versus missing-value policy is explained before any recommendation relies on it. A direct entrant needs basic SQL table aliases/joins but no PostgreSQL internals. The storage-invariant limit of query-time expansion is a useful onward representation question. No gap.

### Indexing the expression — chunk 08

The four-product diagram explicitly changes the question from ceramic+blue to blue membership, so including steel product 3 is correct. Native crop shows the expression→entries→candidate route clearly. The larger fixture's 500/9,500 distribution and matching expression make both plan change and unchanged answer derivable. I recognise bitmap scans from prior pages; the brief description suffices for direct entry. The jsonb_ops/path_ops difference now has a specific choice attached: preserve ?. No missing inference.

### Numeric values and invariants — chunk 09

The guard defines tolerant reads before casting; product 4 remains stored but yields SQL null, and later comparisons omit it. I can derive 200 large capacities from ten values (590–599) repeated twenty times. The same expression in index and predicate is visible. The constraint's initially failing state is announced before the command, and the verified-source repair turns it into a complete successful path. Missing key, JSON null and numeric value policies are explicitly distinguished. I can adapt the rule without assuming every product is a container. This is a particularly complete practical example.

### Changing a document and onward reading — chunks 10–11

The relative-to-current-object patch is connected to concurrent ownership, and the row-lock boundary prevents imagining independent JSON-key transactions. TOAST carries from architecture and is briefly explained for direct entry. The final recap has concrete distinct choices rather than generic JSON advice. optional.txt is empty; the page directs practice to its lesson.

### Writing judgment

The four records are excellent teaching material: each difference has a later job, and the separate scale fixture is introduced before use. The same-offer example explains lost relationships clearly, and the capacity section completes both tolerant reading and enforced-write policy. Code precedes some operator definitions by one paragraph, but those immediate explanations remove the brief syntax burden. No necessary repair found. The expression-index diagram is clear in its 1280 light native crop. No live lesson execution or full responsive check.

## Full-text search in PostgreSQL

### Opening — chunks 00–04, saved before first section

I can explain document representation, matching and ranking as separate operations, with word normalisation and position-sensitive phrases as examples. tsvector and tsquery are assigned their roles before syntax. Reader permission is explicitly a separate question. The page promises a small collection followed by a scale plan and a boundary with spelling/semantic/search-service work. I carry GIN candidate reasoning, but direct entry has enough to understand the opening. Working draft is visible.

### Words and positions — chunk 05

The exact vector and three query forms make normalisation and position gaps independently traceable. I can derive all-words yes, adjacency no, two-position gap yes from run@1/road@3. Native screenshot crop keeps the original three positions aligned with the retained lexemes and three results. The configuration limitation is connected to names/codes/other languages rather than an abstract caveat. No missing inference or supplied expertise.

### A searchable collection — chunk 06

The five rows establish eligibility before relevance, with tenant and publication distinctions attached to each ID. Generated-vector weighting has a clear reason, and concatenation's shifted positions are explained. STORED's write/read tradeoff connects to previous index-maintenance discussion. Null concatenation is a useful edge case, but current title/body are required, so it does not complicate the exercise. I now wonder whether concatenating title and body can create a phrase across their boundary; this is an onward query-semantic question rather than a current failure. Saving it before the phrase section.

### Queries and phrases — chunk 07

The phrase outcomes are derivable from the earlier position example and visible document bodies. My saved title/body-boundary question is answered directly in this section, with an alternate query and its cost. This is good sequencing: the preceding storage choice creates a question the next section is ready to resolve. SQL parameter binding is distinguished from search-query parsing without derailing the example. No missing inference.

### Ranking and eligibility — chunk 08

The eligible set {1,2,5} and title-weight advantage explain the ranking without requiring the exact formula. The approximate scores are reported measurements, not probabilities. The second query idea narrows to document 1 and preserves exclusion of perfect-word-match documents 3/4. This makes permission filtering a separate invariant, with the trusted tenant source acknowledged. No unsupported inference.

### Finding candidates — chunk 09

The separate scale fixture is explicit, and fifty matches follow from 10,000/200. GIN's retained lexemes versus absent weight labels connects to the broader index-information principle. Ranking best ten still requiring candidate scoring carries from the demand lesson and is explained locally. Phrase requirements are mentioned generally at the end; the stored-vector position explanation makes the need for richer row information understandable even without a phrase plan. No gap.

### Updates and search quality — chunks 10–11

The document-2 edit has a derivable changed answer while preserving its body, demonstrating stored generation rather than asserting freshness. The typo produces a valid but empty match rather than a syntax error, and trigram similarity is bounded to comparing supplied candidates. The missing production vocabulary/policy/evaluation are identified without pretending two similarity calls solve spelling correction. Search evaluation questions follow directly from the corpus's features. optional.txt is empty.

### Writing judgment

The page teaches a modest corpus deeply. Positions, field boundaries, weights and eligibility each have a distinct observable consequence. My phrase-across-fields question was answered exactly where it became relevant. The lexical-versus-spelling-versus-semantic boundary is concrete and does not oversell built-in search. No necessary repair found. The positions diagram is clear at native 1280 light scale; live lessons and other variants untested.

## Vector search in PostgreSQL

### Opening — chunks 00–04, saved before first section

I can distinguish embedding usefulness from retrieval accuracy, then exact retrieval from approximate candidate search. The opening defines a vector plainly before naming pgvector and HNSW. It promises calculable distances followed by a filtered synthetic benchmark, explicitly not model-quality evidence. The preceding full-text chapter supplies a reason to explore related meaning, but no specialist vector knowledge is needed for this opening. The page is a working draft pinned to PostgreSQL 18/pgvector 0.8.7.

### Exact neighbours — chunk 05

The table and worked distance for point 3 make the geometric answer reproducible. I can choose eligible IDs 1/3 and explain why global top-two then filtering leaves only 1. Native screenshot crop shows all four points with tenant labels, and the zero third-coordinate statement justifies the flat plane. The browser numeric model versus real pgvector distinction is explicit. Cosine versus Euclidean is only a brief metric introduction, but the required choice is bounded to matching the model's contract. No missing inference.

### Searching fewer candidates — chunk 06

The HNSW traversal is explained as successive local searches and a bounded candidate set, enough to see how an unseen closer vector can be missed. I had to mentally picture layers and descending entry points across two paragraphs; a diagram could reduce that effort, though the result/cost argument is understandable. ef_search is linked to candidate breadth, and post-candidate SQL filtering reuses the four-point example for a new approximate mechanism. “Recall” is introduced before formally defined; ordinary meaning suggests retrieved-neighbour coverage, and I expect the named recall section to make it exact. IVFFlat is onward comparison rather than a second mechanism fully taught here.

### A filtered experiment — chunk 07

The experiment defines source generation, tenant assignment and query row, so the zero-distance self-match's ineligibility is derivable. Exact top ten is stored before the approximate index, keeping the comparison meaningful. The table and following paragraphs distinguish empty approximate output, an exact fallback at ef_search 200, and ten returned with nine exact overlaps. This avoids the tempting but wrong conclusion that a higher HNSW setting achieved perfect recall. SET LOCAL's transaction boundary is supplied. I still need the next section for formal recall interpretation, but 9/10 is already understandable. The download command supplies execution context more completely than earlier excerpts, assuming installed pgvector and an existing disposable database. I have not opened or run the script during this blind reading.

### What recall tells us — chunk 08

Recall is now formally defined, resolving the pending term. Ordering the returned set versus retrieving the exact set is explicitly distinguished. Build variation and boundary ties explain why a single 0.9 result is not a universal quality bound. The separation between synthetic retrieval and semantic usefulness returns to the opening promise. No missing inference.

### Keeping embeddings current — chunk 09

Revision 5 versus 6 makes the stale-worker race concrete. All four bound parameters are mapped to meanings immediately after the pattern; returned versus missing row has an explicit application branch. The pattern is clearly distinguished from the downloadable fixture. The follow-on decision about temporarily missing current embeddings completes the consequence rather than pretending the conditional update removes the lag. No gap.

### Choosing the search design — chunks 10–11

The closing choices are earned by the filtered experiment: exact eligible-set size, approximate measurement, tenant-specific distribution and actual plan. Hybrid score incompatibility is a useful onward warning without pretending to teach fusion. optional.txt is empty. The browser/real extension boundary is repeated clearly at the download links.

### Writing judgment

The two independent quality questions are sustained throughout. The four points make filter order visible; the measured table then shows the additional approximate-search failure. The ef_search 200 exact fallback and strict-order distinction are especially effective. HNSW's layered description requires a little mental drawing, making a small layered-search diagram a possible effort reduction, but no central gap was found. Native 1280 light geometric figure inspected. The exact/approximate script and browser lesson were not executed during this reading.

## Types and extensions in PostgreSQL

### Opening — chunks 00–04, saved before first section

I can explain why a type's permitted values and operations matter to interval overlap and geographic distance. Types/operators/index support form the promised combination; extensions package some combinations and add installation/maintenance responsibility. The booking/venue and worker-authorisation examples identify concrete business questions before features. I carry operator classes, pgvector extension and relational identity from earlier pages, but direct entry's opening is self-contained.

### A range as one value — chunk 05

The endpoint convention is defined before notation and overlap. I can derive adjacent non-overlap and the third request's overlap with both. Native screenshot crop shows the third bar spanning the join and labels the half-open intervals; exact endpoint policy is supplied by text rather than relying on bar styling. Local civil time versus absolute instants is scoped to the fixture. Empty/unbounded values are identified as meaningful but disallowed here, making me expect explicit checks in the table. No gap.

### Preventing overlap — chunk 06

The check encodes the promised nonempty finite range policy. Exclusion's “all comparisons true” is made concrete with same-room/disjoint and different-room/overlap cases. GiST plus built-in range/btree_gist scalar support gives the extension a specific job. The rejected Cedar insert, rollback instruction and successful Birch retry complete the application branch. Concurrent A/B results are explicitly separate from the one-connection browser lesson and connect to earlier writer waits. No central gap. The table permits range values with endpoint policies other than the fixture's [); the article uses [) consistently, but it does not enforce that convention. This is a possible adaptation question rather than a failure of the shown reservations.

### Covering an entire period — chunk 07

The continuous pair versus day-long gap makes coverage stronger than overlap. I can trace why neither authorisation alone is sufficient, why the pair satisfies 10–20 October, and why deleting one must fail. The transition to the deliberately gapped state explicitly removes the assignment first, so no impossible mutation is silently assumed. The btree_gist dependency carries directly from the preceding section. Historical audit versus valid-time constraints is clearly separated. No gap.

### Geographic distance — chunk 08

The four venues give every filter a job: Centre size, East availability, Far north radius, North success. I can derive the 1 km and 3 km results before running anything. Longitude/latitude order, SRID declaration versus transformation, and metres are all explained after the SQL. EXISTS's no-duplicate-venue consequence is useful basic-SQL support. The scale grid's 189−66=123 makes candidate bounds versus exact distance concrete and carries the index-information principle into spatial data. The final reservation boundary returns the reader to the opening's first decision. No missing inference.

### Operating an extension — chunks 09–10

The built-in/supplied/external boundaries are distinguished using exactly the mechanisms just taught. CREATE EXTENSION versus package installation resolves the practical assumption behind earlier pgvector and spatial downloads. Availability and per-database enabled versions have separate queries and meanings. Restore/upgrade dependencies follow from typed columns and operator support, rather than becoming a generic operations checklist. optional.txt is empty. I did not attempt the browser or downloaded server experiments.

### Writing judgment

The range and venue examples each lead from business meaning to typed values, operators, index support and operational responsibility. Both failed writes and successful alternatives are supplied; the temporal coverage exercise explicitly establishes its intermediate state. The geographic result set is independently derivable from a compact table. The final operations section is concrete and closes the extension question. The only optional adaptation question is whether the booking API should enforce one endpoint convention; the shown queries themselves consistently use [). No necessary repair found. Native 1280 light range diagram inspected; other responsive variants and live lessons untested.

## Full eleven-page first-reading handoff

The collection teaches a consistent set of distinctions across mechanisms: logical identity versus physical location; candidate discovery versus visibility/predicate validation; estimate versus measured execution; retained information versus the work it can eliminate; local commit versus reply receipt or remote visibility; storage ownership versus copied histories. The repeated small fixtures usually carry identities and state well, and later chapters refresh enough context for direct entry without replaying the entire overview.

Consequential local repairs found in reading order:

1. Query execution: identify tenant 0 as large and tenant 1 as small before the default-visible prediction. The optional setup contains the mapping, but the visible explanation reveals it only after the commands.
2. Replication: explicitly reset to A-primary/B-standby before adding logical subscriber C. The immediately preceding experiment ended with the opposite roles.
3. Replication diagram: move the central WAL-stream label out from under B's box in the 1280 light rendered figure.

Smaller improvements supported by this reading: show the architecture reservation command at its first concurrency schedule; loosen the GIN diagram's right-hand key/reference spacing; consider a small ring for transaction-ID circular ordering or a layered HNSW drawing where readers otherwise have to picture those structures. These are effort/practice improvements, not proof of failed central comprehension.

Execution-context limits remain explicit in each page log. Many examples direct the reader to independent browser fixtures or downloadable server scripts; this reading followed article text/screenshots only. Earlier server excerpts assume an existing database/client, whereas replication includes detailed local-cluster setup. No execution failures were observed because none were attempted. Screenshot inspection used native crops at figure locations, mainly 1280 light, with limited architecture dark/mobile samples. It does not establish all responsive states or interaction behaviour. No source files, author notes, research notes, prior reviews or external references were read; no article files were edited.
