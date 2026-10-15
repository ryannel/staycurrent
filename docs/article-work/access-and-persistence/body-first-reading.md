# Independent first reading: access and persistence bodies

Read on 2026-10-15 for an application developer comfortable with SQL joins, grouping and transactions, learning PostgreSQL internals. This is an expert agent reading, not human novice testing. I read only the blind voice and first-reading references before the manifest, then opened one extracted chunk at a time in manifest order and saved observations before proceeding. Artifact identity and revision are the per-file SHA-256 values in `body-reading/manifest.json`; the sequence is Indexes, How a query runs, Storage and durability. Delivery is assembled HTML text with scripts/styles excluded and optional disclosures marked. This establishes prose sequence and comprehension, not rendered visual clarity or live behaviour. No source or earlier review was consulted.

## Indexes

### indexes-01 — header

The working-draft status and next article establish the route. The extracted navigation runs words together; I treat this as extraction, not an observed page-layout problem. I expect an explanation of how an index changes retrieval work.

### indexes-02 — opening situation

The order-history screen gives the work a concrete purpose: ten recent orders within years of data. The distinction between expressing a request and finding records is immediately understandable. I now want to see whether the index locates one customer's records, their newest records, or both.

### indexes-03 — baseline and definition

I can picture the expensive baseline and understand that maintaining the extra structure costs work when rows change. “Discard the old ones” briefly raises a question: is this screen limited to a date window as well as ten newest orders? No cutoff has been stated yet. This is a small setup ambiguity, not a blocker; the next example may settle it. The index definition gives a useful first approximation without requiring tree terminology.

### indexes-04 — path through the explanation

This answers the opening curiosity by promising customer lookup first, then ordering. “Check dates” suggests a cutoff but still does not name it. The staged additions give me a clear reason to keep reading, with space and maintenance already attached to the benefit.

### indexes-05 — scope

The PostgreSQL version and index family set useful limits. “Row versions a query can see” introduces a new idea for the stated reader; I can supply MVCC from expertise, but nothing here yet requires that knowledge. I leave the question open for the later retrieval explanation.

### indexes-06 — section navigation

The progression matches the stated promise. “Covering” is unfamiliar but presented as a destination, so it creates no immediate prerequisite.

### indexes-07 — B-tree indexes

The sorted-list explanation gives me a starting point before the hierarchy arrives. I traced customer 42 through root range B, three leaf references D/E/F, then two table pages. The physical-reference caption prevents confusing these labels with SQL IDs. The sentence about many children explains shallow depth without relying on a complexity formula. I had to picture two different orders, but the labeled example supports that effort directly.

The heap paragraph explains why a quick index lookup can still require scattered page access. The immediately following overlapping-requests paragraph resolves the earlier row-version question enough for this lesson: a located candidate may not belong in this reader's view. I supply the term MVCC from expertise but do not need it to follow. The deeper question of how old versions are retained is appropriately offered as onward reading. Visual placement and arrow clarity remain untested because this is text extraction.

### indexes-08 — composite indexes

The February cutoff finally resolves “discard the old ones.” It arrives before the worked query needs it, so the earlier ambiguity was brief setup anticipation. The session instructions clearly identify who runs the SQL, the table lifetime, and the separate practice setup. I have not run that setup and make no claim about execution.

I traced n = 59041 through customer_id = 1 + n % 1000 to customer 42; its January start plus 59,041 minutes places it after February 1. The next IDs decrease by 1,000, matching the repeat cycle. Reading `%`, integer division, `generate_series`, and interval arithmetic uses my SQL expertise beyond basic joins/grouping. The prose provides the needed counts and pattern, so adapting the generator would need more knowledge than following the indexing lesson. The exact ten IDs make the invariant across index changes concrete.

The 60 → 15 → 10 sequence is easy to retain and gives each index improvement a purpose. “Compare the first column… tied on the first” explains composite ordering before the illustration, and the repeated February 11 across customers resolves why this is not one global date order. I can predict why date-first helps the whole-shop screen but may pass other customers for this screen. The tie-breaking paragraph and explicit ORDER BY warning prevent confusing physical index order with an SQL guarantee. The backwards-scan note introduces a further distinction with a bounded link; I can follow the main argument without exploring it.

Minor effort: this is a long section combining setup, generator, baseline query, two indexes, illustration and ordering exceptions. The logic holds together, but the visible SQL load is substantial before the first comparison. This is a pacing observation, not evidence of an explanation gap.

### indexes-09 — filtering

The paid-only change is explicit and preserves the earlier table. I traced the twelve candidates with the generator: 59041 through 54041 are paid, 53041 through 50041 are pending under integer division? I paused and recalculated: floor(n/1000) is 59,58,57,56,55,54,53,52,51,50,49,48; only 55 and 50 are divisible by five. Thus 55041 and 50041 are the two pending orders. This correction was my mental arithmetic, not a text defect; the generator makes the assertion checkable but demands carrying its formula from the preceding section.

The core distinction between locating candidates and filtering status follows cleanly. Moving status before date visibly splits one customer's date run, so I can predict the effect on the original screen. The Index Cond caveat is accurate in shape but opens an unresolved mechanism question: how can a condition be checked by an index without reducing the scanned span? The later-key sentence gestures at it without a concrete example. I supply a mental composite-key range from expertise. This slows the explanation for the target reader, though it does not prevent following the paid-filter example.

Skip scan, partial index and parameterized reusable plans arrive in quick succession after the concrete example. The first has a short mechanism; the last requires imagining planning without a parameter value, which has not been taught yet. I can understand the stated restriction, but these paragraphs feel like a compact set of exceptions rather than the earlier patient progression. Useful onward questions: why does PostgreSQL reuse a plan before a parameter is known, and when does a partial index qualify? These need not become full explanations here if their limited role is clear.

### indexes-10 — covering indexes

“Return to the original” prevents carrying the paid predicate forward accidentally. INCLUDE is explained through the one missing result field, so I understand both its purpose and why it does not change sorting. Visibility is recalled from the B-tree section, then connected to the map and heap visits. I can explain why an index-only scan still reports ten heap fetches and why vacuum can change that to zero. “Run this command on its own, with autocommit enabled” is operationally useful, although a basic-SQL reader may need their editor's help to find that setting; no attempted execution occurred here.

The switch to summing 900 customers is clearly introduced as another query. The smaller-index explanation gives a reason for reading 90% of entries without assuming that indexes only help tiny result sets. The selectivity paragraph summarizes the demonstrated trade-off rather than delivering a bare rule. This is one of the stronger sections: a name, mechanism and observed counter are connected in a short sequence. I would like to see the actual plan lines next, but the final-section promise makes the deferral explicit.

### indexes-11 — storage and maintenance

The costs promised in the opening now have mechanisms: leaf splits, new positions, included-value maintenance and delayed cleanup. The measured sizes make the 90%-scan example more plausible without claiming universal ratios. Reusing the delivery note as the expensive alternative is effective continuity. The constraint-enforcement reminder protects a concrete decision about dropping indexes. The live-build warning is attached to the actual CREATE INDEX commands and supplies a sensible next investigation without derailing the temporary-table lesson.

I can explain the read/write trade-off from the text. The mechanics of when old entries become removable remain deliberately deferred to storage; no gap blocks this section.

### indexes-12 — testing an index

The three predictions at the start are well prepared by the preceding sections. The EXPLAIN ANALYZE versus standalone ANALYZE distinction arrives before I need to interpret their similar spelling. The staged table gives the promised observed evidence, and the bitmap paragraph fills in why the customer-only result may not use a simple index scan. The abbreviated plan plus direction for reading it lets me follow ten emitted rows into Limit. The warning that rows are not key comparisons is particularly useful.

A practical sequence question arose at “run the history query with EXPLAIN”: by this point I have already replaced the earlier indexes, so running that command now shows only the covering index. The next paragraph resolves this with the downloadable full experiment and plans after each replacement. This is acceptable for a read-through; someone executing inline would need to restart to reproduce every comparison. The stated new-session requirement makes that recoverable.

The added mutations are easy to trace: 60,000 + 1,000 - 100 = 60,900; the amount update changes no count. However, “This checks that queries still return the expected results after the changes” follows only a stated row-count verification and sizes. Those checks alone do not establish history-result or amount correctness. I have not inspected the downloadable script, so I cannot tell whether it contains additional checks. The prose should name those checks if it makes that broader claim, or confine the claim to the count.

The last two paragraphs separate teaching observations from production measurements clearly. They give a practical next experiment without presenting this temporary dataset as latency evidence. The closing returns to the original screen and its trade-off rather than introducing another index type.

### indexes-13 — onward route

The next article matches the pending curiosity about plans, scans and sorting. Storage follows the repeated promise about versions and maintenance. The PostgreSQL documentation link has a specific purpose. After this article I can explain why customer/date/order plus INCLUDE(total) serves the stated screen, what it costs, and what observed evidence would support choosing it. Remaining friction concerns compressed exceptions and the scope of the mutation-check claim, not the main explanation.

## How a query runs

### query-execution-01 — header

This page calls itself further depth under Querying your data, while Indexes directed me here as its next reading. I carry the index article's actual teaching forward, but have not read the named main article. The supplied audience already knows basic joins and grouping, so that route mismatch is not yet a prerequisite problem.

### query-execution-02 — opening

The new support report clearly changes the task from order history. Same three output products versus a thousand times more input lines gives a precise reason to care about execution rather than result size. I expect to compare a narrow customer lookup with a whole-shop scan and join.

### query-execution-03 — promise and prerequisite

The two candidate strategies are described as actions before their formal names, which makes the comparison approachable. The stated joins/grouping prerequisite matches the audience. Estimates are introduced as the later cause of a poor choice; I want to know what evidence produces those estimates.

### query-execution-04 — example query

The explicit separate-dataset sentence prevents treating customer 42's order IDs and 60-order count from Indexes as continuous. This is necessary because both examples reuse the customer and shop. The new counts are simple: ten orders × three lines = 30 joined rows, then product totals 10/20/30. I can trace order 42's line 3 into product 3's total of 30 and see why it sorts first. The line table and result table reduce the amount I need to reconstruct mentally.

The index on (order_id, line_no) has a reason already supplied by Indexes: one order's lines are contiguous. No new generator syntax intervenes in the explanation. Setup is linked rather than shown; I can judge meaning from this chunk but have not opened or run the setup, so practical setup completeness remains outside this reading.

### query-execution-05 — nested-loop joins

At the plan block I meet GroupAggregate and two Sort nodes before their mechanisms, but the paragraph immediately tells me where to start. I can leave the upper nodes pending and trace the bottom branches. The extraction appears to flatten indentation, so I cannot verify the visual branch hierarchy that the prose says is preserved; this is a delivery limitation, not an established article defect.

The bitmap explanation repeats the needed physical-location distinction from Indexes and adds why page ordering helps. The concrete order 42 → lines 42/1, 42/2, 42/3 → order 1042 sequence gives outer/inner a meaning. The per-loop average explanation is sufficient to read 3 × 10 = 30 without equating loops to ten SQL statements. The final sentence makes me ready to learn why aggregation delays the answer. This is well-paced explanatory prose once the initial plan is treated as something to walk through rather than decode unaided.

### query-execution-06 — sorting and aggregation

The pending two-sort question is fully answered. I can picture rows arriving 1/2/3 per order, being regrouped into ten adjacent copies per product, then three totals being reordered. Each paragraph adds one operation to the previous one. “Blocking” is explained with the exact input it must finish and explicitly distinguished from locks. The LIMIT 1 contrast with the preceding Indexes article is valuable: it cannot stop at the first order because the total depends on later input. Although this regular dataset gives each order the same ranking, the stated general reason remains clear. No outside execution knowledge was needed for the central sequence.

### query-execution-07 — hash joins and aggregation

The changed predicate explicitly includes every customer, preserving the report while multiplying input. The direction to start under Hash again makes the plan readable in sequence. The temporary table keyed by order ID lets me understand build then probe, and the second table keyed by product ID distinguishes matching rows from accumulating totals. The product-2 increment is a helpful concrete anchor.

I supply the mechanics of a hash function and collisions from expertise. “Uses a hash… possible matches… compares the IDs” indicates the required correctness check without defining the transformation; for this article I can follow the choice as keyed temporary lookup. A reader wanting to implement or reason about collision cost would need another explanation, but that is onward curiosity, not a blocker.

The side-by-side text counts reinforce what the prose has established. I can trace 30,000 joined rows into three running totals and explain why output size hides work. The caption explicitly limits counts to work rather than elapsed time. No new identities or unexplained resets occur.

### query-execution-08 — merge joins

The ordered two-stream description is understandable using the already-known primary keys. I can trace order 1 through three matching lines, then move to order 2. The extracted diagram's “1 · 1 · 12 · 2 · 23” runs groups together; surrounding prose resolves it, and I cannot attribute that to the actual rendering. The uniqueness qualification explains why this simple example does not represent every join multiplicity.

The transaction-scoped demonstration clearly changes planner choices and then restores them. I understand why showing a possible merge plan does not prove it was preferable. The final paragraph links order ID ordering back to product grouping, preventing an easy mistaken inference that any sorted input removes every sort. This section broadens the mechanisms while keeping the same report; the transition is justified.

### query-execution-09 — planner estimates

This answers the opening estimate question with concrete sources of information. The estimated/actual inner scan pair teaches cost, rows and width against a familiar operation; cost inclusion and non-time units prevent two misleading readings. “First operation” could mean first in displayed order or first along execution/data flow; I infer the latter from the instruction to inspect operations above it. A small wording clarification could reduce that navigation ambiguity for a new plan reader.

The new region field is introduced with its full distribution before the query. I can reproduce the wrong estimate: ten orders × 10% north = one, versus ten when the dependency is known. This is especially effective because it explains why another ordinary ANALYZE would not fix accurate single-column distributions. The unchanged plan is explicitly stated, so the repair does not overclaim a speedup. The equality-only scope and documentation links make a suitable boundary. No substantial inference was required beyond arithmetic.

### query-execution-10 — memory and temporary files

The opening distinguishes growth with orders from growth with distinct products, using the already-understood two hash tables. That makes the memory discussion causal rather than a tuning list. Separate per-operation allowances explain why work_mem is not a total connection budget. The new sort is expressly a different query, avoiding the impression that sorting three report totals spilled 544kB.

I can interpret external merge and temporary blocks as evidence of spill while retaining the stated PGlite limitation. ROLLBACK's purpose is recalled. The final paragraph returns the setting to the application's required result, which is a useful decision sequence. I would explore how to observe memory across concurrent operations separately; the local lesson is complete without that expansion.

### query-execution-11 — reading a plan

The “scans near the bottom… follow those rows” instruction resolves the earlier possible ambiguity about where to begin comparing estimates. Each investigation in the summary has been demonstrated. Comparing the result as well as the plan preserves query correctness as part of tuning. The dependency-statistics reset is stated before a repeat attempt. I have not run the linked files, but the prose makes their order clear.

### query-execution-12 — related navigation

The links identify their purposes. This page's route offers Pagination rather than Storage as onward reading, so the supplied three-article order is a selected route supported by Indexes' storage link, not an unbroken Next chain. No reading claim should imply that this navigation automatically sends readers to Storage.

### query-execution-13 — sources and scope

The verification statement consistently limits observations to the teaching runtime and discloses the forced merge alternative. The links answer specific next questions. I finish able to trace both reports, distinguish the three joins, explain the two aggregate methods, and reproduce the statistics arithmetic from the prose. The main limitation of this reading is that I did not see rendered plan indentation or execute the practice setup. Hash-function mechanics are an optional follow-on, not a missing step in the current explanation.

## Storage and durability

### storage-01 — header

I arrive with heap pages, row visibility and vacuum from Indexes still partly explained, and now expect the persistence mechanism and lifecycle behind them.

### storage-02 — opening

Files, memory copies and the commitment to survive restart give the article a concrete problem. “Make that change survive” leaves open whether it writes the changed table page immediately or records enough to reconstruct it. I expect the next passage to resolve that mechanism.

### storage-03 — log and recovery

The immediate next paragraph answers the table-write question. Saving a reconstruction record makes deferred table writes understandable before the WAL term appears. Following one price change is a clear promise, with loss boundaries part of the inquiry rather than an afterthought.

### storage-04 — scope

Ordinary logged tables explicitly change the storage assumptions from Indexes' temporary table. One server and reliable persistent storage give a useful boundary for the forthcoming durability claims. I do not yet know the term “logged table” from the text alone, but the preceding log paragraph makes its role inferable.

### storage-05 — rows and pages

P7, price 20.00 and page 12 form a small state I can carry. The page header and row header distinction introduces physical layout without burying the request. The TOAST aside qualifies the compact-row picture, though it briefly opens a separate mechanism before the main page read; the simple sentence about extra reads is enough here.

The shared-buffer versus operating-system cache distinction is clear and prevents treating every buffer miss as drive I/O. The paired page contents let me trace reading P7 as bringing P3 and P9 too. That reinforces the earlier Indexes distinction between row count and page work. The final row/column contrast has a concrete price-only query behind it, so it feels useful rather than a detached taxonomy. I understand the main path without extra expertise; the low-level page-directory layout is onward curiosity.

### storage-06 — updates and row versions

The handler description clearly distinguishes the application success branch from the three SQL statements and holds them on one connection. The two prices make versions concrete, and the older snapshot sentence supplies the missing lifecycle context from Indexes. The precise isolation rules remain linked depth; the stated “may” avoids promising that every older request retains a snapshot indefinitely.

The heap-only tuple sentence adds a named optimization with two vague conditions (“changed columns and available space”). I supply from expertise why indexed-column changes and same-page room matter. Because it is qualified as optional and unused in the main argument, it is not a blocker, but the new term earns little explanatory work here and briefly interrupts the price-change sequence.

Dirty pages containing unfinished changes is the first potentially surprising step. The next sentence states the important independence of page writes and commit, but I still want the mechanism that keeps unfinished changes from becoming visible after recovery. I understand the statement from transaction-status expertise; I preserve the question for the WAL section rather than filling it in silently. The final paragraph properly motivates the log from the crash risk.

### storage-07 — write-ahead log

The difference between reconstruction records and rerunning SQL is explained with a clear double-increment example. The write-ahead rule precisely orders durable WAL before a data-file write while allowing earlier memory changes. Page log positions explain both the ordering check and avoiding duplicate replay; I can follow their purpose without knowing the name LSN.

The 20.00 file / 22.00 memory / durable commit record sequence preserves P7's state. The caption allows an earlier table write, so the depicted sequence is not mistaken for the sole legal order. “Synchronous commit” appears here before a definition; I infer it is the acknowledge-after-flush path just shown, and expect the next section to contrast it. The benefit paragraph connects sequential appends, shared flushes and deferred page writes to work saved.

My unfinished-transaction question is narrowed but still open: a commit record establishes success, but what does recovery do with logged page changes that lack it? The current section does not yet say. The final paragraph defines flush through the operating-system/device contract, making reliable persistent storage in the introduction concrete rather than magical.

### storage-08 — after a crash

The first two paragraphs directly resolve the question preserved from updates: WAL can restore an uncommitted version, but transaction status governs visibility. This delayed answer is productive pacing because the preceding section established the two kinds of durable record it depends on.

I can predict A = 20.00, B = 22.00 and C = 22.00 from the prose before reading each stated result: commit record survival is the distinction, not table-file freshness or acknowledgement receipt. The scenario setup explicitly resets P7 and rules out another writer, avoiding accidental continuity across cases. C gives the application a separate uncertainty while the database outcome is known. The linked uncertain-outcome article is a justified onward question; repeating a general operation may be unsafe even though this particular fixed-value assignment looks repeatable.

The torn-write paragraph introduces “checkpoint” before explaining it. I understand from expertise why first-modification-after-checkpoint matters, but the target reader has not been given that boundary yet. The immediate point still follows: a full page image can replace an unusable mixture. I expect the next section to define checkpoint; the temporal detail is a short deferred question, not currently a blocker.

### storage-09 — checkpoints

The checkpoint term is defined immediately in the next section through its recovery purpose, resolving the outstanding term question. The completed-checkpoint condition gives a reason older WAL can eventually be reused. The durability-versus-checkpoint distinction is explicit and tied back to the same price update. I can now connect more checkpoints to more first-modification full-page images using the previous section.

I supply some technical detail from expertise about the exact redo boundary during concurrent checkpoint activity; the prose's “needed… before that position” is appropriately cautious for this level. No exact checkpoint algorithm is required to follow the trade-off.

### storage-10 — vacuum and space reuse

One product versus several physical versions clearly separates logical row count from storage growth. The older snapshot now has a second consequence: delayed cleanup. Reusable internal space versus a smaller file is directly explained, so VACUUM FULL's cost has a reason. The final paragraph makes checkpoint and vacuum noninterchangeable by their actual jobs.

Autovacuum, pruning, the free space map and transaction-age maintenance add several names, but only the last is unexplained. I know wraparound prevention from expertise; the reader can treat it as a sign of additional maintenance outside this article. It is optional curiosity rather than required support for the version-reuse account. The visibility map from Indexes is not revisited by name, but earlier teaching remains enough to connect vacuum and index-only scans along this supplied route.

### storage-11 — durability guarantees

The concrete settings now define the synchronous path I inferred earlier. I can distinguish acknowledged-but-lost recent transactions with synchronous_commit off from corruption risk when fsync is disabled; this is a meaningful practical difference. UNLOGGED tables receive a direct consequence and usable boundary, with no assumption that a committed result is therefore durable there.

The local storage-loss and accidental-deletion examples explain why the log is not sufficient backup. “Physical base backup” is a new term, but its role as the starting copy plus an unbroken WAL sequence is clear enough to understand the recovery requirement. The final price-update statement remains scoped by the preceding settings. The article ends by connecting its mechanism to what a successful commit can and cannot establish, without implying that ordinary crash recovery undoes valid but unwanted work.

### storage-12 — onward navigation

The backup guide is explicitly planned, keeping unavailable reading distinct from the linked PostgreSQL material. The Indexes return link closes the physical-location and maintenance connection. A reader seeking a complete restore exercise would still need the external guide named in the body or future coverage.

### storage-13 — evidence and onward questions

The source note clearly distinguishes invented page examples and documented crash reasoning from an actual crash test. I finish able to trace P7 through page loading, versions, WAL-before-data ordering, acknowledgement, replay and eventual space reuse. The most important questions raised mid-reading were answered in the following sections. The smaller HOT and transaction-age mentions rely on expertise for depth but do not carry the main argument.

## Scoped judgement after the frozen first reading

The three bodies support their main explanations for the stated audience. Indexes develops one read workload through increasingly useful structures and their costs. How a query runs connects concrete inputs to intermediate rows, join choices, estimates and memory use. Storage keeps one price change visible through the durability mechanism and carefully separates physical recovery from row visibility and acknowledgement receipt. These strengths should survive revision.

The most consequential remaining question is the Indexes mutation-check claim: the described count and size checks do not by themselves establish that history queries and changed amounts remain correct. A source or execution check could confirm additional assertions; the prose should state what was actually verified. Lesser friction is concentrated in Indexes' filtering exceptions, especially an Index Cond that does not shorten the scanned span and a reusable plan without a known parameter. The main example remains understandable, but those compact additions use knowledge not otherwise developed. Setup-generator arithmetic is readable with expertise and stated counts, though adapting it asks more than the audience's basic SQL prerequisite.

Potential small repairs, separate from observations: narrow or substantiate the mutation-check sentence; give the later-key Index Cond caveat a small concrete span example or keep it clearly optional; give parameterized-plan restrictions a brief planning-time explanation or reserve them for linked depth. HOT and transaction-age mentions in Storage could be shortened if they are meant only as caveats. These are scoped improvements, not reasons to rewrite the working central explanations.

No human novice session, browser layout check, interaction test, source validation or execution test was performed. No optional closed disclosure appeared in these delivered chunks. The selected route is supported by Indexes' links; Query execution's own onward navigation does not directly point to Storage.

## Separate post-reading recheck

After all original observations above were saved, the coordinator supplied `body-plan-layout.txt`, described as exact built-HTML preformatted text preserving whitespace, and described three later local edits. This recheck is informed review and does not replace the frozen first reading.

The corrected plan export shows the branch hierarchy clearly. In the narrow plan, Bitmap Heap Scan and the repeated order_lines Index Scan are siblings under Nested Loop, while Bitmap Index Scan belongs beneath the heap scan. In the broad plan, the lines Seq Scan and Hash are siblings under Hash Join, and orders Seq Scan belongs under Hash. This resolves the extraction limitation concerning text indentation. I still have not observed browser font, width, wrapping or mobile overflow, so this is not a rendered-layout approval.

The reported B-tree edit from “Each page…” to “The root and other branching pages…” improves precision. My initial reading inferred branching pages from context, but the old wording could have implied leaves also point to child pages. The new wording removes that expert repair without altering the explanation.

The reported statistics-reset edit now tells the reader to start a new empty practice database. This is more dependable than my original reading of “reload the setup,” which assumed the setup could remove the added statistics and recreate state. It clearly reestablishes the experiment's starting point. I have not executed that reset.

The reported storage-opening edit explicitly ties the initial durability claim to default durability settings. That supports a direct-entry reader before the final section names the settings. The frozen article already scoped its crash diagrams and later explained asynchronous commit; stating the assumption up front is a useful local clarification, not a change to the central recovery account.

### Final informed recheck — mutation checks and reusable plans

After the frozen reading and first recheck, the coordinator supplied two further revised passages and reported checking the experiment's assertions and subsequent statements. I assess the supplied wording here; I did not independently inspect or execute the script.

The mutation passage now says: “The script checks that the table contains 60,900 rows and that all 200 corrected orders have a total of 26.00. It then reports table and index sizes and shows the history query’s plan again.” This addresses my consequential concern. It distinguishes the two asserted results from the size reports and displayed plan, and no longer implies that those actions establish every history-query result. The numbers also follow from the shown mutation SQL: 60,000 plus 1,000 minus 100 rows, and 25.00 plus 1.00 for the 200 corrected orders. The coordinator reports that the script performs exactly these checks and actions. Subject to that independently reported source check, the claim is now concrete and appropriately bounded.

The parameter passage now says: “If status comes from a parameter, PostgreSQL may build a plan to reuse with different parameter values. That plan must also work for other statuses, which the pending-only index cannot supply.” This supplies the missing reason a reusable plan cannot rely on the pending-only index. A reader can now follow the restriction without already knowing the generic-plan mechanism: reuse across values requires validity for statuses absent from that index. “May” preserves the scope rather than implying every parameterized query behaves this way. My reading concern is addressed.

The later-key Index Cond caveat remains concise with linked multicolumn depth. I still regard the exact scanned-span mechanism as optional further investigation: how can an index reject entries using a later key while still traversing the same interval? The main worked choice is already supported by customer equality, ordered dates, the date boundary and stopping after ten results, so this unanswered depth question does not block the argument or require expansion here. The narrower, now-explained reusable-plan paragraph also reduces the surrounding density.

With these changes, I have no remaining consequential meaning concern from this body reading. Optional depth remains optional, and the original limitations still apply: no human novice testing, live execution, or rendered-layout validation was performed by this reader.
