# Sequential reading: Queries and joins; Pagination and large results

Reader: intelligent developer who knows tables, types and keys and is learning SQL details. Guidance limited to first-reading.md and blind-review-voice.md. Numbered displayed sections are read in order, one at a time, and these notes are saved before opening the next section. No rendered page inspection yet; all media observations are provisional from extracted text.

## Queries and joins

### 00 Opening — first reaction

The distinction between stored arrangement and desired answer works well: customer/order/order contents gives the upcoming join a purpose before syntax arrives. “We decide what those rows represent” sets a useful test I can carry into examples. I understand that a query can change the kind of thing represented by one row, not just select some columns. No missing reasoning so far. The explicit tables/columns/keys prerequisite matches the given audience.

### 01 A query and its result — first reaction

The three-answer aid does useful work already: O13 repeats among lines but appears once as a qualifying order and once with €44 as a total. It lets me see the row meaning from the opening rather than retain only a slogan. The later query/result pair is easy to derive: two O13 rows, each quantity 1, totals 20 and 24. Explaining AS and quotes directly after the first query makes the syntax readable. “It does not create a line_total column” answers a reasonable beginner question at the right moment.

I briefly have to hold O12's two mugs and O13's mug plus bowl, but the aid immediately gives those values a place. I would preserve/reuse that aid rather than add another purchase diagram. An optional experiment I am curious about is changing quantity while watching line_total and then the per-order total change; at this stage the static arithmetic already meets the teaching need.

“Clauses ... do not prescribe an algorithm” is understandable, though I supply from expertise why FROM is explained before SELECT while SELECT is written first. This is not a blocker. The parameter paragraph usefully gives a reason for separating values; it invites the deeper question of how text becomes a command and how parameters stop it, but that is not needed for joins.

The optional runnable extension introduces INSERT, CREATE TABLE, and a timestamp before teaching them. Its explicit “Run the examples” framing makes that support material rather than an unexplained main-line SQL step. No repair requested on that basis.

### 02 Joins and matching rows — first reaction

“The lines contain product IDs, but a customer needs names” is an excellent reason for the operation. Aliases and qualified columns are introduced immediately and I can read the code. The result has the exact earlier purchase lines with names, so the example stays coherent. The primary-key/required-foreign-key explanation tells me why the count stays at three, and “Removing the line number ... does not remove ... rows” is a valuable correction before I can mistake selection for deduplication.

The small effort here is reconstructing the two source sides of the join. The code and result show l.product_id and p.product_id only in the condition; neither the previous purchase aid nor this result displays those ID columns. The following “Line 1 of O12 contains P7” supplies one match, and I infer the same ID for O13's mug and a different one for Bowl. I can follow the concept, but I mentally draw three line rows pointing to two product rows to verify which values ON actually compares. A useful opportunity is exposing those source IDs alongside the existing aid/result, not another generic join illustration. Text-only finding; I have not checked whether rendered design already makes these relationships visible.

A useful experiment question is: if two product rows matched one line, how many rows would the join return? The unique key correctly rules that out here; I expect later examples to explore multiple matches. I do not yet need another article to follow this.

### 03 Missing matches — first reaction

Ben's NULL is explained as an absent matching order rather than a damaged order row. That distinction, and the contrast with Ada's real but empty O14, make the result interpretable without supplying relational lore. WHERE keeping only true gives me the reasoning for IS NULL and later for Ben disappearing; preserve that causal chain.

The ON-versus-WHERE comparison is understandable, but this is the first point where I have to hold a small sequence in memory: Ada has three dated orders; the cutoff accepts two; Ben has a supplied NULL; filtering that NULL after the join removes him. Two almost identical SQL blocks then ask me to picture two outputs, neither shown as a table. The final sentence explains the stage distinction clearly. I would test “a customer with only an early order” because Ben has no orders at all, and that is the case most likely to reveal whether I understand matching versus later filtering. The prose mentions that hypothetical customer but no concrete row lets me follow it through both queries. This is a meaningful opportunity to compare exact results at the point of the two code blocks, or make the customer/cutoff case changeable if existing media can support it. A clearer sentence alone may not spare the need to track the two stages, but the required support can be static.

Resolution of §02 multiple-matches curiosity: Ada now has three result rows and her customer ID repeats. The result demonstrates multiplicity from the other side, though it does not explicitly call back to the earlier per-line uniqueness. That is good progression, not a gap.

### 04 Grouping and totals — first reaction

O14 pays off well: COUNT(*) = 1 versus COUNT(line_no) = 0 gives an exact, inspectable consequence of the missing-match explanation. The result table and the following arithmetic make GROUP BY concrete. Explaining why O13 has no single unaggregated line number supplies a useful constraint on SELECT. COALESCE is introduced with the report's intent instead of implying NULL universally means zero.

The mental task is seeing the intermediate joined rows fold into one group. The table includes joined_rows, which reduces that burden, and the first three-answer aid already gave the resulting totals. I do not see a need for another aid merely to restate SUM. If adapting existing media, showing O14's placeholder row becoming counts 1 and 0 would be a worthwhile extension; my reader need is to see exactly which thing each count counts.

The HAVING comparison is unusually efficient: dropping the €20 mug before summing is a concrete counterexample to treating WHERE as a group filter. I supply the outcome (€24 fails the €40 threshold) from arithmetic, but the intended reader can do so without SQL expertise. That is healthy effort, not omitted reasoning. An optional experiment is swapping a line threshold and an order-total threshold to see both input rows and surviving groups. No necessary deeper article question here.

### 05 When a join inflates a total — first reaction

The existing two-lines × two-shipments aid meets the exact question I raised at §02. I can inspect all four pairs and the €88/€44 difference without drawing them mentally. “Shipment records here describe the order as a whole” also prevents me reading the result as evidence that each product physically travelled twice. Preserve this aid and its placement after the faulty query; the surprise is then explained where it occurs.

The DISTINCT counterexample is good: two separate €20 purchases clearly refute deduplicating amounts. This opens an optional experiment—give both lines the same price and compare plain SUM with SUM(DISTINCT)—but the single sentence may already be the simplest adequate support. No need to manufacture a second multiplication interactive.

The corrected WITH query is a larger syntax step. I have to retain two temporary result shapes (order_id/amount and order_id/shipment_count), then understand why each can match only once. The sentence before the block gives the strategy, and the paragraph after it explains WITH and uniqueness. I briefly supplied “named intermediate results” from expertise when reading WITH before its definition; the next paragraph resolves it, so this is minor pacing rather than a substantial gap. A genuine support opportunity is completing the existing multiplication aid with the two single-row summaries and their one-to-one combination. The current aid makes the bad result visible, while the repair's intermediate shapes remain in my head. The final table confirms 44 and 2 but does not show how the two grouped results produced those fields.

The closing left-join note correctly separates preserving empties from preventing multiplication. It leaves a useful practice question—what should O14 and an order with lines but no shipments show?—rather than blocking this deliberately bounded example.

### 06 Checking whether a match exists — first reaction

I initially notice the nested SELECT 1 and need to connect o.order_id across query scopes. The immediately following explanation does exactly that; “For each candidate order” plus the irrelevant constant is sufficient. The result O12/O13 connects back to the first three-answer aid, and the hypothetical additional mug line directly tests why this differs from a join. That passage already answers the interaction question I would have asked. No extra interactive is necessary on this evidence.

The NOT EXISTS diagnostic gives a useful boundary: relational absence alone does not establish business failure. “Application's rules and transaction boundary” introduces a larger topic than this section can explain. A useful further investigation is “how can an order header and its lines become visible together, so other queries cannot mistake work in progress for a finished empty order?” That is curiosity about lifecycle and transactions, not a prerequisite for understanding EXISTS. No dedicated new article implied; a suitable existing destination could answer it.

### 07 Checking an answer — first reaction

The debugging advice is earned by the preceding examples: expose identities and follow a familiar record. It returns to the opening's row meaning with an actionable way to detect a wrong result. The distinction between meaning, execution, and reading in pieces gives me two clear follow-up questions without trying to answer all of them here. In particular, “Even a correct result can lose or repeat records when we paginate it” makes me ready for the next article.

### 08 Sources and further reading — first reaction

The links have useful descriptions tied to the main questions. None explicitly answers the order-visibility/transaction-boundary curiosity from §06; that remains a possible onward connection, with no implication that this article should expand into it.

### Queries and joins — synthesis after first reading

No consequential comprehension blocker remained. Prioritise (1) making the ON/WHERE two-stage results inspectable, including a customer with only earlier orders, and (2) extending the existing multiplied-rows aid to expose the corrected grouped intermediate results. These are effort findings rather than claims that the explanation is absent. A smaller opportunity is exposing product IDs on the source sides of the first join. Preserve the three-answer opener, count comparison for O14, and four-pair shipment aid. Experiment questions are captured above; they do not establish that interaction is required. All medium suggestions remain provisional because this pass used displayed text without rendered inspection.

## Pagination and large results

### 00 Opening — first reaction

The distinction between recent-history browsing and a bounded-memory export is concrete, and both motivate continuation before naming pagination/batches. “Count past ... or ... remember the last record” gives me a useful pair of mechanisms to compare. I am ready to ask what happens when records arrive or disappear, and the last paragraph explicitly makes that the upcoming concern. No gap. The navigation's “Continue: Transaction boundaries” also now offers a natural destination for the prior article's O14 lifecycle curiosity, though it is one article later.

### 01 Ordering the result — first reaction

The time tie is motivated before the composite ORDER BY appears, and the five-row table makes the exact boundary O16/O15 visible. Explaining “at most” for LIMIT is precise without slowing the example. The warning that timestamp precision is not uniqueness answers an obvious attempted shortcut. The final distinction between total order and frozen data is well placed: I have learned what ordering guarantees before being told its limit.

The example now has five orders rather than the preceding article's three. The explicit table and fresh-database setup reset that context adequately; I do not have to reconstruct dates from the previous article. Text IDs as labels, not commit order, raises “then what does commit order change?” as deferred curiosity, not confusion in newest-placement ordering. No media need beyond the existing table is apparent yet.

### 02 Counting past earlier rows — first reaction

The unchanged page arithmetic is simple. The insertion example then makes the bug traceable: skip O17/O16, receive O15/O14. The deletion reset is explicit, so I do not mistakenly remove O16 from the insertion scenario. Read Committed's statement view arrives at the moment a changed next page needs explanation. The warning about one default transaction is useful and earns the Isolation destination.

Effort begins at “The next query sees O17, O16, O15...” and continues through the deletion paragraph. I have to hold the old first page (O16/O15), lay out the changed list, mark the two skipped positions, then compare the returned IDs to the earlier page. The prose includes all necessary values, but the relationship is temporal and spatial, while the only table is in the prior section. I would want to change insert versus delete and watch which IDs are already seen, skipped now, repeated, or missed. A static pair of sequences could meet the need; first check later/existing media before recommending another aid. This is meaningful even though there is no conceptual gap.

A deeper question now ready for another article: what exactly does a statement's view include when another transaction begins before it but commits during it? The brief Read Committed explanation is sufficient here; Isolation is appropriately named for that investigation.

### 03 Continuing from a value — first reaction and later resolution

The saved pair and the expanded verbal comparison make composite keyset syntax understandable. “Even deleting O15 itself” answers a subtle question immediately: the key is a boundary value, not a pointer that must still resolve. The strict comparison and returned-last-pair rule show how to continue, and the ascending/mixed/null caveat bounds the example without derailing it.

Resolution of §02's media/effort observation: the existing “Continuing after a change” interactive contains exactly the visible sequence, already-read labels, alternatives, and two continuation rules I wanted to inspect. It also offers the insert/delete experiment I recorded before seeing it. Do not add a duplicate aid. Placement may be the opportunity: the offset reader reconstructs both changed sequences before reaching this model after several keyset paragraphs. Consider introducing its offset view in the preceding section, then using the same model here for comparison. That is a sequencing idea grounded in the earlier effort, not proof the current rendered distance is excessive.

I cannot verify control behaviour from the extracted text. The shown default state agrees with the earlier results, the control labels give concrete events, and the “alternatives, not cumulative” instruction avoids a likely interpretation error. Moving unread O14 to 13:00 exposes a new limitation before the prose explains it in detail; that makes me ask whether keyset stabilises position only when keys stay put. The final sentence confirms that intuition, and I expect a fuller treatment later.

The tied-timestamp reasoning is stated well but the chosen first page consumes both tied records. Thus I never directly see a still-unread 12:00 order survive the pair comparison. A useful experiment would be page size one (boundary O16) or a third tied order, then compare time-only with pair filtering. This is a smaller opportunity than reuse/repositioning of the existing change model; it need not become a separate interactive.

### 04 Passing the continuation to a caller — first reaction

The cursor explanation makes “opaque” concrete and connects the token to this customer's particular filtered/ordered query. It answers how the values survive between requests without requiring token implementation details. The timestamp-precision warning now has a reason because the comparison boundary was explained first.

The extra-row paragraph is excellent: request three, display two, and advance from the second is exactly where I might accidentally skip a row. I have a small urge to run this with O16/O15/O14 and see O14 reappear as next page's first row, but the prose supplies every necessary step. A result table could help if this section gains runnable code; no present need to insist on a diagram. “More available” can later be false is explained as an observation of this read rather than a guarantee.

The page-500 tradeoff is earned by the two mechanisms. Potential deeper investigation: how an API encodes/version-checks a cursor while binding it to filter/sort and validating access. That is an implementation topic with its own purpose, not missing pagination reasoning. Avoid expanding this paragraph into a token security checklist.

### 05 The work behind a page — first reaction

“Limits transfer, not necessarily ... work” makes the performance question distinct from correctness. The index paragraph describes customer region and ordered entries enough that I can picture a seek without being required to know an index implementation. CREATE INDEX is new syntax, but its purpose and column sequence are immediately explained. The article correctly leaves measurement to a plan and representative later-page test.

I mentally draw a run of index entries for C4 and a boundary inside it. The prose is sufficient for the high-level claim; a generic tree diagram would exceed this section's purpose. A useful onward question is “How does an execution plan show whether PostgreSQL starts near this key or reads many rows and filters/sorts them?” That belongs with indexing/execution plans, and an available destination would be more valuable than a fresh aid here.

The last paragraph connects to the previous article's grain idea well. “First select the twenty order identities, then retrieve their lines” is a real recipe but I supply from expertise how the selected IDs constrain the second read, and how to preserve their page order when assembling the response. For this audience it is enough to understand why LIMIT 20 on the joined lines is wrong; implementing a nested orders-with-lines endpoint is a useful deeper question. It should not silently become a full new subtopic in this article. A compact worked example elsewhere could show exactly which lines belong to one selected order page.

### 06 A live list is still changing — first reaction and later resolution

Resolution of §03's mutable-key question: this section explains both directions of movement and states an explicit browsing contract. The interactive introduced the unread-O14 correction, so the prose can build on a concrete case. The distinction between key ranges and visible record versions is the exact reason a cutoff is weaker than a snapshot; preserve that final sentence.

I can follow “an older transaction may commit afterwards with a value inside that bound,” but here I supplied a small timeline: one transaction chooses an older placement time/ID, the export saves its cutoff, then that transaction commits and becomes visible. The article has explained statement views, so this is reconstructable, but it is the first sentence where commit timing and key assignment timing must be separated. A concrete two-event or three-event example could remove the mental burden if this matters for the upcoming export recommendation. A full animation is not warranted by this observation alone.

The interactive offers unread-row movement, while the paragraph adds already-read movement and backdated arrivals. Useful experiment questions are “can I repeat an already-read row despite keyset?” and “can a newly committed row appear on page two even though the cursor was created before it?” These would extend the existing model's question set rather than require a new one. They are secondary to its current central insertion/deletion comparison.

### 07 A fixed export — first reaction

The overloaded word “cursor” is resolved before database syntax appears. Changing the query to all customers and oldest-first is explicit, which prevents me applying the earlier C4/descending assumptions. Repeatable Read's first-query snapshot plus same connection explains why three FETCH calls belong to one traversal. “Two is simply our demonstration batch size” helps separate mechanics from an operational recommendation.

The existing fixed-view aid is strong. I can compare O14 at 13:00 in a new view with O14 at 11:00 in the retained snapshot, so “record versions” now has a concrete referent. The note that separate page queries can share the same snapshot prevents me attributing consistency exclusively to the database-cursor object. Preserve that qualification. The prior mutable-row question is resolved through actual output values, not a promise of consistency.

A modest effort remains in the direction switch: in the live-list interactive, O14 moving to 13:00 moves before the descending boundary and is missed; in this oldest-first comparison it moves after O16 and is still ahead to be read later. Both descriptions are correct and the aid explicitly states ascending order, but I pause to redraw the list because the same mutation now has a different continuation consequence. This is not a correctness problem. If the rendered aid makes the ordering unmistakable, it may be fine. A tiny emphasis that this comparison follows the export's ascending order may be enough; I would not add another diagram.

The cutoff/late-commit timeline from §06 remains a separate curiosity; this aid demonstrates correction and versions, not delayed commit inside a key bound. No need to alter it merely to cover that second mechanism.

The resource paragraph explains why not to leave the transaction open through human pauses. It opens a useful deeper question: how snapshots keep older versions needed, and how that affects cleanup. That belongs with isolation/MVCC or operational treatment. The retained-export ending also clearly distinguishes fixed identities from fixed values; it is a useful alternative, not a detour into implementation.

### 08 Reading batches that do work — first reaction

The two crash positions make checkpoint versus effect agreement concrete. I mentally lay out work→checkpoint and checkpoint→work, but that two-step reasoning is modest and the consequences are stated directly. The paragraph correctly says pagination does not settle ownership for several workers.

This opens substantial questions that could distract if expanded here: “How do I retry a job after the message may have been sent but its checkpoint was not saved?” and “How do two workers claim different records while surviving a crash?” The linked waits/deadlocks/retries topic seems aimed at the former decisions; I cannot assess the destination from this artifact. Treat these as useful onward questions, not missing prerequisites for pagination. The final three promises separate browsing, fixed reporting and resumable effects well.

### 09 Sources and further reading — first reaction

The sources distinguish the illustrative separate-read model from single-connection checked results. Routine vacuuming offers an explicit destination for the retained-version/cleanup curiosity; the named row-comparison and isolation references likewise map to real questions raised in the text.

### Pagination and large results — synthesis after first reading

No substantial explanatory gap remained. The main opportunity is sequencing an existing aid: offset's insertion/deletion paragraphs require the reader to reconstruct changed positions before the later “Continuing after a change” model provides the very sequence and labels needed. Reuse or reveal that model's offset view earlier if rendered inspection confirms the distance causes friction. Do not add a second insertion/deletion aid. The same model could optionally let a page boundary split the 12:00 tie, making the complete-key requirement observable. Its current default consumes both tied orders, so the wrong time-only continuation has no concrete missed row in the displayed example.

Lower-priority support questions: make the late-commit-inside-cutoff timeline concrete if readers need help separating assignment time from commit time; consider the ascending-direction switch when inspecting the fixed-export aid. These are not claims that the article needs more media. The existing fixed-view comparison, pair-comparison explanation, deletion-of-boundary-row explanation, and extra-row cursor paragraph already do their jobs well.

Useful deeper reading questions are execution-plan evidence for a keyset seek, selecting order identities before loading their lines, token implementation tied to query scope, retained record versions, and coordinating checkpoints with effects or ownership. These are invitations with distinct purposes, not proposals to create all of them. Several already have named destinations. An article about page size alone would not answer the meaningful questions this reading raised.

## Handoff limits

This pass used only successive supplied displayed-text chunks plus the two permitted guidance references. Every first reaction was written before reading the next chunk; later resolutions are appended rather than replacing the original observations. I did not read histories, briefs, source implementations, outside references or other reviewers. I did not inspect rendered pages or exercise controls, so all placement/design/interaction opportunities require rendered inspection before implementation. Repository files were not changed.
