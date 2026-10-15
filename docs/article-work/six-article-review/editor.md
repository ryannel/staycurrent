# Independent editorial reading of six relational articles

Read on 15 October 2026. This is an informed editorial review, not a blind novice test or a technical verification. No article files were edited.

## What I read

I read the supplied assembled text in this order: Designing your data (`modelling`), Constraints in depth (`constraints`), Tables and JSON (`tables-and-documents`), Querying your data (`query-results`), How a query runs (`query-execution`), Pagination and large results (`large-results`). I read every extract, including displayed headings, captions, controls, initial results, onward links and source descriptions. This follows the design parent and its supporting pieces, then the query parent and its supporting pieces; the navigation also permits moving directly between main deep dives.

The source of this reading is `/private/tmp/six-article-review/reading/manifest.json` and its numbered text chunks. These are extracted page text, not a rendered browser inspection. Closed disclosures were marked and their bodies were not part of the default reading. After finishing that reading, I inspected the capacity conversion disclosure, the two-orders-with-lines disclosure, the normal-form disclosure and the two prediction answers in source. I did not run examples or interactions or inspect their visual behaviour. The findings below concern explanation and writing, not whether a diagram fits on a screen.

I loaded the current style and review skills and first-reading guidance, read the writing reference and its selected original Gears passages (Disc and Transmission), and read README/site direction. I did not open prior review records or briefs. The required writing reference itself contains article revision history; this is therefore an independent judgement of the present text, but not an uninformed reading. I read each article in substantial consecutive chunks rather than preserving an observation after every sentence. The comprehension notes below are editorial observations from that reading, not a reconstructed blind question log.

## Overall judgement

The six articles substantially explain their subjects. There is no case for another broad rewrite. Their strongest passages let a reader follow named records through a change or query and then show why the result follows. The differences between current and purchased price, a missing order and an empty order, a JSON number and numeric string, and a continuation boundary and a fixed view are all developed through examples rather than merely asserted.

Writing quality is less even than comprehension. Designing your data sometimes follows a completed explanation with another general verdict. Constraints spends too long revisiting the parent's design lessons before pursuing the competing writes advertised in its opening. Tables and JSON accumulates repeated statements of the same boundary decisions towards the end. These are reasons for bounded repair, not evidence that the mechanisms are missing.

Querying your data and How a query runs sustain the strongest prose over their full length. Pagination and large results also develops naturally; its changing example requires care, but most of that care is supplied at the right point. Do not manufacture a set of edits of equal size for every page.

## Comprehension, separately from prose

### Designing your data

The opening has explained schema versus records and the purpose of normalisation before it asks the reader to follow a particular shop. The first healthy-design example lets a reader understand why a repeated ID can be useful while repeated current names cause trouble. That is enough orientation for the later dependencies.

The definition of an order line supplies the necessary unit: two identical mugs can occupy one line with quantity two; a mug and a bowl occupy separate lines. The composite-key choice then follows from the allowed purchases. The first three normal forms have a visible sequence and distinguish current catalogue facts from agreed prices. The lossless-decomposition counterexample is especially useful: it gives an actual consequence of losing the line number instead of just naming a property.

The two prices and the final receipt remain connected through the article. A reader can predict Sea-blue mug, quantity 2, €18 unit price and €36 total in the closing exercise, and can explain why the old printed name is unavailable. I checked the source answer afterwards; it agrees and adds no missing premise.

The types section is lengthy, but it does real work before the constraints and JSON sections. Removing it to shorten the page would remove the explanation for several later choices. The JSON section reaches a coherent design while leaving the exact commands optional. The line-to-order versus order-to-lines distinction is also explicit.

The main costs are repeated conclusions and the amount of subsidiary material after normalisation, not a broken argument. A useful stopping point already exists after historical facts and separation. A reader who came specifically for normalisation has enough there; the table of contents makes the later type/enforcement/representation work visible.

### Constraints in depth

The opening explains both what a constraint is and why checking in the application does not claim a unique value. It is a good opening for a supporting article. The shared-writer figure gives direct entrants a second concrete reason for database enforcement.

The main problem is delayed fulfilment: the page then teaches the parent's valid-record design, quantity/null distinction, composite line identity, repeated-product permission and deletion choices again before returning to competing writes. These are comprehensible individually. On this reading path, much of the first two-thirds is familiar.

One small missing premise occurs at the product/SKU insert examples. The main text has established that SKUs may be missing, but not yet that P7 owns MUG-BLUE and P8 has no SKU. Those facts appear in the explanation after the statements (and in optional setup), so a reader cannot independently predict both outcomes at the point the statements appear. Add them immediately before the statements.

The composite foreign-key paragraph requires undoing the earlier successful `(O12, 2)` insert mentally. It explicitly asks for the reset, so this is not an undisclosed state error. It is avoidable effort in an explanatory example. Use an empty hypothetical order instead.

The concurrent-write explanation gives both commit and rollback outcomes and says the caller must handle the insert result. The example is sufficiently placed in an application for the article's present purpose; a full handler is unnecessary. The final transaction handoff correctly leaves the required operation to the application rather than pretending constraints discover it.

### Tables and JSON

The opening introduces columns, nested values and the location of structure before choosing the representation. The JSON-key/primary-key distinction is helpful, as are the row outlines and the explicit definition of a document in this article.

The number/string/null cases are fully supplied before interpreting the query results. The direct integer cast is allowed to fail, and the text then explains why the number-only check still admits fractions that the cast cannot read. The input-policy table finishes that issue. Keeping the implementation disclosure optional allows a reader to follow the design decision without already knowing nested CASE or transaction syntax.

I inspected the conversion disclosure afterwards. It names the connection and caller action on rejection, explains the CASE evaluation boundary, and says why the insert and removal stay together. This is meaningful optional implementation, not a missing visible prerequisite. The prose also preserves the difference between validating original input and checking the integer received by the database.

The whole-object replacement example is unusually clear. It says both reads happen early, identifies the saved object B later sends, and explicitly separates that from simultaneous writes. The `jsonb_set` explanation tells the reader which object is being changed. Preserve that distinction and the local configuration details.

The later reappearance of supplier references and repeated design summaries slows the article; it does not add a missing technical step.

### Querying your data

The opening explains why query results need not share the stored arrangement and why one result row's meaning matters. This prepares the receipt, left-join and grouping examples well.

O14's empty header and Ben's lack of orders are now introduced before the left-join result. Cara's separate filter fixture is also explained before the ON/WHERE comparison. The reader can derive why filtering Cara's existing joined row does not manufacture a new null row. This is patient explanation worth protecting.

The shipment example makes multiplication visible before aggregation hides it. The separate summaries then repair the problem using the same records. The prediction exercise can be solved from the preceding work: nine pairs, €192 inflated total, €64 true goods total, three shipments; DISTINCT loses the second €20 line. The source answer confirms that reasoning.

The move to execution is earned by having an answer to preserve. The emitted-versus-inspected row distinction and 1.5 average are explained using concrete passes through P7/P8. The conceptual full-scan model explicitly differs from the observed early-stopping plan; this qualification prevents a real misunderstanding and should stay.

No consequential comprehension gap found in the supplied reading. There is a useful stopping point at “Checking an answer”; the remaining part supplies a first execution-plan model before the dedicated execution article. That overlap is productive because the child scales the example and adds measured plan changes, statistics and spills.

### How a query runs

The opening establishes what an execution plan is and why the work can differ. The generated dataset is clearly separate, and its customer/order mapping lets the reader work out 10/20/30 totals before accepting the plan.

The article explains the nested-loop branches, the two different sorts, the blocking operation, and the distinction between join and aggregate hash tables with the same quantities. The broad report changes how much data qualifies, making the plan change meaningful. The statistics example supplies the north/customer correlation before asking the reader to interpret the bad estimate. This is not merely a list of operator definitions.

The practical setting is clear: a practice database and one connection, local settings restored by rollback, observed rather than universally promised plans. No consequential comprehension gap found. Preserve the explicit limits on extended statistics and memory, which affect what a reader could apply to their own database.

### Pagination and large results

The opening develops the need for partial reads, then the difference between live browsing and a fixed export. The ordering section explains why “next” needs a sequence before introducing SQL syntax. This is the most important thing for its opening to do, and it does it.

The repeated timestamp gives the saved pair a reason to exist. Insertion, deletion and changed ordering values each test a distinct consequence. The saved-value boundary surviving deletion of O15 is a particularly useful explanation of what the token contains. The extra-row flag also makes its continuation rule operational.

The page explicitly resets to five original orders and changes to ascending order for the export. I could follow that change without reading setup. The read-only Repeatable Read and cursor explanation is enough to distinguish retained database state from an API token. The costs and lost-connection limit appropriately bound the proposal.

The optional orders-with-lines example is stronger than the main paragraph's wording: it uses one statement, and explicitly says the two stages share that statement's view. The visible paragraph says “When both reads must share one view”, which can make separate statements sound inherent. Clarify that the two stages can be one statement before discussing the separate-statement case.

## Recommended repairs, in reading order

These are proposed alternatives for meaningful repairs. Preserve the neighbouring mechanisms and qualifications. Some recommendations delete already-repeated conclusions instead of replacing them with new ones.

### 1. Modelling: remove the extra verdicts after explanations that already finish

In `modelling-15.txt`, after the example comparing ordinary product facts with fragmented tables:

> Too little separation tends to show up as repeated corrections and contradictory answers. Unnecessary separation tends to show up as ordinary operations navigating fragments that always belong together. Both are reasons to revisit what the rows represent. A schema should explain the application more clearly as it develops.

This steps back from the two concrete designs and restates their lessons in a more abstract register. The following paragraph introduces a genuinely new reason to duplicate data for reads. I would delete this paragraph and connect that turn directly to the figure:

> Keeping a product's ordinary details together avoids that extra coordination. A sound normalised design can still be inconvenient for a particular read workload. A dashboard might repeatedly calculate totals over millions of order lines…

The proposed first sentence is optional; the existing “A sound normalised design…” can follow the caption on its own. The important repair is to let the example finish before beginning denormalisation.

In `modelling-17.txt`:

> A constraint is a rule declared in the schema that the database applies when records change. It turns an assumption made by readers into an obligation for writers. The checkout service, an administration screen and an import script can all use different application code, while their writes must satisfy the same database rule.

The middle sentence announces the lesson in abstractions; the following sentence already makes the relationship concrete. Delete the middle sentence. No replacement is needed.

After the interactive constraint results, the exact ending is:

> No single “validate this row” switch expresses all of those decisions.

Delete this ending. The preceding sentence has named the distinct rejected cases; inventing a generic switch adds no further explanation.

Near the end of `modelling-19.txt`:

> The schema now records several kinds of decision: what each row represents, which other records it refers to, what its values mean, and which changes are permitted. Trying ordinary operations alongside incorrect ones helps reveal assumptions that a diagram alone cannot expose.

Delete this paragraph. The immediately preceding paragraph already asks the reader to apply the schema-review questions. The variation exercise then lets them do it. A second general conclusion weakens that ending.

### 2. Modelling: make two small pieces of framing concrete

Figure title in `modelling-15.txt`:

> Three tables do not improve this dependency

Proposed:

> One product's details, together or apart

“Improve this dependency” is an awkward operation to ask a reader to imagine. The figure compares arrangements; its labels and caption explain why the extra split has not removed redundancy.

End of the local-time paragraph in `modelling-16.txt`:

> A timestamp chosen simply because its name sounds more complete will not decide this for us.

Delete it. The two preceding sentences already explain why local meaning may need preserving. This imaginary mistaken chooser adds an admonishing note where the actual time distinction is enough. Do not remove the sentence about preserving local meaning.

### 3. Constraints: bring the opening problem forward and shorten the repeated prelude

The opening starts:

> Two requests can both check that a catalogue code is available before either inserts a product.

The worked continuation does not arrive until “Concurrent writes”, after Choosing the rules, The shop's rules, Required values and checks, Unique values and keys, and References and deletion.

Recommended structure: keep the opening and shared-enforcement illustration; go to a shortened “The shop's rules”; then “Concurrent writes”; then the detailed value, key and reference sections. Drop “Choosing the rules” as a separate section. Its positive-quantity, line-identity and wrong-constraint examples all receive fuller treatment below and were just developed in the parent.

A compact replacement for the repeated prelude could be:

> The shop gives each product an ID, and may also assign it a catalogue code, or SKU. Assigned codes must be unique, while several products may still be waiting for one. We declare that rule with `sku text UNIQUE`. Let's follow two requests trying to use the same code.

Put the existing concurrent-write sequence after this. The wider shop facts and optional setup can remain before the later detailed declarations. This supplies the point-of-use rule without requiring the reader to read all declaration syntax first. If retaining the present section order is preferred, at least move “Concurrent writes” immediately after the SKU outcomes in “Unique values and keys”, and cut “Choosing the rules” to one short bridge. That is a smaller improvement, but leaves much of the advertised new question delayed.

Do not remove the NULL/check experiment, deletion diagram or commit-versus-rollback alternative merely to reduce length. They teach mechanisms worth retaining for direct entrants.

### 4. Constraints: supply the SKU facts before the prediction, and remove a needless reset

Immediately before the two product inserts in `constraints-10.txt`, add:

> P7 already has the SKU MUG-BLUE. P8 has no assigned SKU. These two inserts try another missing code and a code that is already taken:

This makes both outcomes derivable from visible facts. The following explanation of PostgreSQL's null treatment should remain.

In `constraints-11.txt`, the composite-reference paragraph currently asks:

> Return to the original two-order example from Designing your data, before the accepted insert above adds O12's second line.

It then explains why separately finding O12 and line 2 would accept a nonexistent line. Replace the reset-dependent part with:

> Suppose a new order O14 exists but has no lines yet. A shipment for `(O14, 2)` must be refused. O14 is a valid order ID, and line number 2 exists on another order, but that pair identifies no purchase line. The foreign key must match both values on the same row.

This illustrates the same requirement without undoing a successful example the reader has just followed. It is explicitly hypothetical, so it does not silently change the SQL fixture.

### 5. Tables and JSON: keep the enforcement decision in its established place

At the end of `tables-and-documents-10.txt`:

> References deserve particular care. Putting supplier_id inside an attribute object does not create a foreign key to a supplier table. If supplier identity must be shared and enforced, an ordinary reference column or related offer row is a natural place for it. JSON can carry descriptive supplier notes alongside that reference.

Delete this paragraph here. “Related records” already introduced supplier offers and why a JSON supplier ID is not a foreign key, and “Reading and changing a product” soon returns to those offers for their independent updates. The present paragraph interrupts the completed capacity conversion to repeat another boundary decision. Let the successful hybrid query lead into reading and changing the resulting product.

### 6. Tables and JSON: end the index qualification after it has done its job

In `tables-and-documents-11.txt`:

> These are different routes for different questions, not a requirement to create both. Neither declaration needs to reinterpret capacity text while building or maintaining the index. An expression index could instead index a value derived from JSON, but its conversion and validation would need to agree for every permitted input. As with an ordinary index, we must check actual queries and plans and account for the extra storage and write work. Native JSON support is a capability, not evidence of a performance result.

The useful conditions are the matching workload, validated conversion, and storage/write work. The final capability-versus-evidence sentence restates the caution without adding a condition. Proposed replacement:

> Choose the index for the queries the catalogue needs. Neither of these indexes has to reinterpret capacity text. An expression index could instead index a value derived from JSON, but its conversion would need to work for every input the validation permits. Check the actual query plan and whether the read benefit justifies the extra storage and write work.

This retains the expression-index alternative and the need to assess performance, while avoiding a sequence of verdicts about what the demonstration does and does not establish.

### 7. Tables and JSON: let the final design finish once

In `tables-and-documents-13.txt`, the final section describes the chosen columns and JSON/details split, then repeats its reasons in:

> This mixture is often called a hybrid design. It remains understandable because each group of facts has a reason for being where it is. Purchase lines need separate identities and product references. The descriptive object belongs to one product. If we later add supplier offers that change independently, those can have their own rows without moving every descriptive detail out of JSON.

The first two paragraphs already describe those choices. Replace this paragraph with only:

> This combination of ordinary columns, related rows and JSON is often called a hybrid design.

Then retain the final paragraph's concrete transfer exercise: follow a read, a change, an invalid value and a missing reference. Its practical questions are a better ending than another recitation of why the current design works. Consider removing “earn” in the preceding paragraph if revising it for flow, but it is not independently a repair requirement.

### 8. Pagination: distinguish the two query stages from two statements

In `large-results-10.txt`:

> To display twenty orders with all their lines, first select the twenty order identities, then retrieve their lines. When both reads must share one view, their transaction and isolation choice matter.

Proposed:

> To display twenty orders with all their lines, first select the twenty order identities, then join those orders to their lines. Both stages can be part of one statement, as in the example below. If the application sends them as separate queries, it must also decide whether they need the same view of the data.

This matches the optional example and prevents a reader from assuming that limiting parent records inherently requires two round trips and a special transaction. It also connects the practical choice to the later fixed-export section.

### 9. Pagination: remove one redundant defensive opening

In the same section:

> This is an available route, not a performance measurement. Joins, additional filters, or a sort the index cannot provide may require more work before twenty qualifying rows are ready. Inspect the execution plan and test a representative later page as well as the first one.

Delete the first sentence. The preceding paragraph already says the actual plan depends on the data and query. The remaining two sentences name exactly what can add work and how to investigate it. Keep them.

## Passages to preserve

- Modelling: “Knowing an order ID tells us which customer placed it…” through the reversed-direction counterexample. The dependency is introduced through the records, and “determines” is then carefully distinguished from “never changes”.
- Modelling: “If the receipt used today's catalogue price, a correct join would produce a historically wrong €40 receipt.” This carries a difficult modelling distinction in a concrete consequence.
- Constraints: “PostgreSQL has not decided that a missing quantity is positive. It has been given a check whose expression did not prove false.” This is an effective correction of the plausible interpretation the probe just invited.
- Tables and JSON: “Once we extract only that text, we have discarded distinctions present in the document.” The preceding table earns this conclusion. Keep the type/null distinctions rather than flattening them to “validate JSON”.
- Tables and JSON: the description of B sending its earlier complete object, followed by the explanation that `attributes` in `jsonb_set` is the current row value. It places the operation correctly and preserves the mechanism.
- Querying: Cara's matched 08:00 order is filtered out and does not receive a replacement null row. This is more useful than a generic warning that WHERE can turn a left join into an inner join.
- Querying: the €88 result, DISTINCT counterexample and two summaries. The repeated amounts make the reason for separate aggregation visible.
- Query execution: product 1 finishing when product 2 begins, followed by the second sort over only three totals. The prose explains why both sorts are present without merely labelling operators.
- Query execution: the planner applying the table-wide north proportion to customer 42, then changing the dependency statistics while preserving data and indexes. This lets a reader understand an estimate repair rather than memorise ANALYZE as a remedy.
- Pagination: the strict pair comparison and the explanation that deleting O15 does not invalidate saved values. Those details make the continuation mechanism transferable.

## Collection transfer and stopping points

The design-to-query handoff works. The reader has learned what a line represents, why product IDs repeat, which values are current and which are historical, and which keys make the receipt join unique. Querying uses those facts rather than silently redefining them. The changed pagination fixture and generated execution dataset are also explicitly declared.

Constraints has the weakest marginal value early in its reading path. Its concurrent uniqueness guarantee, null variants and deletion timing deserve the supporting article, but the current order makes returning readers wait to see that. The proposed reorder is the most consequential editorial repair in the collection.

Tables and JSON repeats enough of the parent's basic choice to stand alone, then adds operator results, input policy, conversion, indexes, stale-object updates and migration. That is useful additional depth. The repair should trim repeated conclusions, not remove its worked conversion.

Querying already teaches a first execution plan, but the execution child extends it through a different, explicitly generated workload. The overlap gives the child usable prerequisites and does not feel like another full introduction. Its current prose does not need a compensating rewrite merely because the other five are being reviewed.

Pagination has a useful local stopping point after “A live list is still changing”. A reader implementing a browseable list has the contract, token, next-page flag, index candidate and limits. The export section answers a different need that the opening has already established. The short maintenance-job ending identifies what pagination does not settle and points onward; it need not become a full job-processing tutorial.

## Handoff

Editorial repair is warranted in modelling, constraints and tables-and-documents, with two small local repairs in large-results. Query-results and query-execution are ready as drafts from this editorial reading, with no substantive prose repair requested. These judgements do not replace technical or rendered-media review and do not authorise publication.

After editing, reread the whole Constraints opening through the SKU section to check the new sequence and point-of-use explanations. Reread the ends of modelling and Tables and JSON as connected passages, not just resolved findings. Check the pagination paragraph beside its disclosure to preserve the distinction between one statement and separate queries. Do not expand the remaining prose merely to compensate for deleted conclusions.

## Final continuous rereading after repair

I reread all six current assembled articles on 15 October 2026, in the same collection order, including headings, figure copy, captions, initial interactive text and onward reading. I also reread the orders-with-lines disclosure beside the revised pagination paragraph. This was a reading of the refreshed manifest-listed extracts, not a browser or SQL run. The initial glob for Constraints included a stale `constraints-15.txt` source-list extract; the refreshed manifest ends at `constraints-14.txt`, so the stale duplicate is not an article finding. No repository files were edited during this recheck.

**Final editorial judgement: all six are ready as drafts. No new material writing or comprehension problem found.** The original report remains useful evidence of what was changed; the earlier repair-required judgement is superseded by this rereading. This is an editorial judgement, separate from technical verification, rendered-media checks and permission to publish.

### Flow and voice in the revised pieces

Designing your data now moves from the figure about splitting product details directly into the dashboard-summary example. The transition works because the figure has finished explaining an unnecessary split, while “A sound normalised design can still be inconvenient for a particular read workload” opens a different reason to change the arrangement. No replacement lesson paragraph is needed. The revised figure title identifies the actual comparison. The time discussion also finishes naturally at preserving a future appointment's local meaning; the removed admonition has left no missing conclusion.

The constraints section's definition now leads straight to the checkout service, administration screen and importer. Those writers give the definition substance without the removed abstract sentence. The accepted and rejected line cases still establish the separate rules before the deletion question. At the article's end, the receipt result, realistic invoice qualification and schema-review questions now lead directly to the variation exercise. The reader is invited to apply the reasoning rather than hearing another general summary first. The article remains long, but its normalisation, type and representation work has not been reduced to slogans.

Constraints now begins with the definition, then tests why application validation is insufficient. That is a sound entry for a direct reader. Removing “Choosing the rules” allows the actual shop and declarations to arrive without another general design prelude. The detailed quantity/null and key examples still teach what each declaration does. The strongest sequencing improvement is later: assigned-code uniqueness, missing codes and comparison policy now lead into two requests claiming CUP-GREEN. These are successive questions about the same rule, so the new placement feels like continuing an investigation. The following references section can introduce a different rule without needing an invented connecting sentence.

The newly supplied P7 and P8 SKU facts let the reader anticipate the insert outcomes. The hypothetical O14 paragraph now uses the successful O12 line-2 insert instead of asking the reader to undo it. “Suppose a new order O14 exists but has no lines yet” clearly marks the hypothetical state. The composite foreign key then has a specific missing pair to reject. There is no need for the larger structural change proposed in the original report: the smaller repair has improved the continuous read sufficiently, and the remaining foundational repetition supports direct entry.

Tables and JSON now lets the successful ceramic-mug query close the capacity conversion. The next section takes up reading that design and finding records across the catalogue; the removed supplier-reference paragraph does not leave a gap. Supplier offers still appear earlier for identity and references, then later for independent changes, where they have new work to do. The index paragraph retains the conversion requirement, actual-plan check and maintenance cost without an extra verdict about capabilities. After the stale-object and row-lock examples, schema evolution remains a useful change of timescale. The final design summary now names the chosen arrangement once and ends with operations a reader can try on another design. It is still careful prose, but the repeated conclusions no longer dominate the latter part of the article.

Pagination's revised paragraph connects the unit being limited to a concrete implementation: select order identities, then join their lines, with both stages possible in one statement. Its disclosure follows through with two headers producing three lines and explains the shared statement view. The default path also remains complete when the disclosure stays closed. Removing the redundant performance disclaimer leaves the useful account of additional filters and sorts in place. The later sequence from changing lists to fixed exports and resumable work is unchanged and still follows the distinctions introduced at the start.

### The two unchanged pieces in the collection

I reread Querying your data in full after the revised design articles. The customer, order and line meanings remain compatible, and the page introduces its additional records before using them. Its movement from receipt rows to missing matches, groups and the shipment multiplication is still the clearest sustained explanation in this set. The second half earns its shift to execution by preserving an already-understood answer. Its repeated use of result identity is productive: each occurrence explains a different error or operation, rather than merely repeating a lesson.

I also reread How a query runs in full. Its generated workload is explicitly separate and produces a new investigation after the parent's small receipt plan. The change from ten orders to all orders, followed by the statistics and memory examples, supplies enough additional depth to justify the supporting piece. Its concrete account of the two sorts and of the two hash tables remains effective. No prose repair is requested for either unchanged article.

The revised collection still offers useful stopping points: a normalisation reader can stop before types and enforcement; a query reader has a usable correctness method before following plans; a pagination reader can finish the live-list contract before choosing whether to study fixed exports. The cuts and relocation have not weakened those independent reading paths.
