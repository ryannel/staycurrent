# Sequential first reading: implementation reader

Audience: an engineer comfortable with programming, beginning relational databases. I recorded SQL knowledge I supplied from experience instead of assuming the audience already has it.

Evidence: the supplied compiled HTML under `dist/learn/databases/relational/`, read on 2026-10-05. This is HTML extraction, not a live browser session. Scripts and styles were excluded; image alt text, captions, tables, static control labels and code were included. Closed disclosures and no-JavaScript fallbacks are explicitly marked. Static initial values cannot establish what a running script displays. I read successive heading-sized chunks and saved observations before continuing; some short adjoining chunks were delivered together. I did not inspect source, history or other reviews.

Order: introduction; modelling; constraints; tables and JSON; query results; large results; transaction boundaries; concurrent updates; isolation; conflicts and retries; the optional checkout tour. This follows the supplied order and the collection navigation. The checkout tour labels itself optional.

## Introduction: opening through relationships

The closed collection navigation is optional opened material. It lays out designing, querying and concurrent work in the requested order and separates the checkout tour. The visible opening makes the recurring shop purpose clear: shared records support both purchases and reports while purchases change them.

No unresolved question yet. “Tables, rows, and columns” defines schema, types, primary keys and the engine without requiring SQL. The P7/P8 contents table makes stock and current unit price explicit and distinguishes logical rows from physical storage. “Relationships between tables” carries P7 into Ada C4’s order O12 with quantity 2. The illustration’s alt text and caption explain all four records; extracted label geometry cannot establish its visual readability. The historical €18 purchase price versus current €20 catalogue price resolves the natural question of whether removing copies also removes purchase history. That explanation should survive revision.

## Introduction: queries through further reading

The first SQL block arrives after a verbal trace from O12/P7 to “Blue mug, 2”; its ON/WHERE/SELECT explanation and result let a programmer follow the query without already knowing SQL. Indexes carry O12 forward at €36, consistent with two €18 items; they introduce O13 as another order without claiming the earlier one-line illustration was exhaustive. The lookup table distinguishes the index entries from row contents and explicitly says it is not a measured search procedure.

Constraints lead naturally to the question “can a valid order still be incomplete?” and answer it before transactions. Atomicity, durability and outside payment effects each receive a concrete consequence. The concurrent stock example changes to a stated one-item starting state; the default caption repeats its PostgreSQL/locking assumptions. The repeated timeline prose is helpful in text extraction: the second buyer has not read stock while waiting. Older versions answer the next report-reading need, and the text immediately distinguishes reading from reserving. No unresolved explanation gap in this overview. The collection clearly labels planned coverage and says the checkout tour uses a separate, simpler shop. Source notes sharpen SQLite exceptions without disrupting the opening.

## Modelling: opening through dependencies

The schema/data drawing distinguishes rules from values; the prose defines “fact” before depending on it. The normalisation example explains why repeated IDs remain useful while repeated names create anomalies. “Choosing the records” makes O12/O13 explicit: O12 is 2 × €18, O13 is €20 + €24, consistent with the earlier totals. The assigned IDs are teaching labels and euro-only pricing is stated. Composite (order_id, line_no) identity preserves multiple same-product lines rather than slipping into product-per-order uniqueness.

Question at “determines”: can a mutable customer name be determined by the ID? The next paragraph answers exactly this: one current name per valid state, rather than an immutable value. The quantity/price comparison between O12 and O13 makes the dependency concrete. No unresolved question yet; these explanations establish meaning before formal names.

## Modelling: normal forms through practice

The normal forms each follow an operation the programmer can picture. The first-normal-form section usefully separates fixed product slots from nested values instead of calling both the same defect. The third-normal-form overlapping-key note is closed optional material; it adds formal scope without being needed for this shop. “Keeping the connections” first walks O13 line 2 into Ada and the Bowl, then shows why losing line numbers creates four matches. I can derive those wrong matches from the supplied inputs.

The historical-facts experiment explicitly restarts the catalogue at EUR 18, so its change to EUR 20 does not contradict earlier current EUR 20 examples. Its default controls and output are static evidence only. The optional model note says copying has no transaction/propagation; the fallback describes later button outcomes. No interaction was exercised. The name/address/purchased-name passages make current versus historical meaning unusually clear, and “How much separation?” prevents treating additional tables as an end in itself.

Types explain numeric precision/scale and rounding, text ordering, timestamps and NULL before constraints need them. Question at “Trying the design”: how do I open an empty PostgreSQL database and load the downloaded file? The article names the prerequisite and file but supplies no execution steps in this visible passage. I could supply a client/import workflow from experience; a beginning SQL reader has not been taught it here. This is an unattempted setup uncertainty, not an execution failure. Within the query, aliases, multiplication, AS and ORDER BY are explained before the block; O12's 2 × 18 → 36 result is followable without that setup. No conceptual gap remains in the modelling argument.

## Constraints: opening through required values/checks

The visible route maps shop intentions to declarations before showing optional CREATE TABLE code. Complete definitions and seed records are closed disclosures. Optional reading question at `current_price <> 'NaN'::numeric`: what do `<>` and `::numeric` do, and why is a nonnegative price insufficient? The later “Required values and checks” passage explains NaN and why it passes a nonnegative check; the exclusion's operator and conversion notation remain unstated. I supplied “not equal” and PostgreSQL cast syntax from SQL experience. The audience can follow the prose rule but is less equipped to adapt this unfamiliar predicate.

The seed disclosure establishes only O12 and the download explicitly adds O13. The instruction to run failed writes separately outside a transaction prevents an error-state continuity trap. As with modelling, obtaining a working SQL client and loading an empty database is assumed; I have not attempted this setup. The article does explain CREATE TABLE column structure, and INSERT column/value correspondence is inferable from the listed seed.

The NOT NULL versus CHECK explanation succeeds: unknown is not false, and an accepted NULL is not declared positive. The default rule model separately labels comparison, check decision and overall acceptance; the closed model note and fallback are inspected separately, not reported as live behaviour. The decimal-scale paragraph carries forward modelling's rounding point and explicitly says checks see the converted representation.

## Constraints: keys through wider operation

The first key example now explicitly explains INSERT column/value order, resolving the earlier inferred seed mapping. It traces an accepted second P7 line and four refused variants to distinct rules. The composite reference discussion distinguishes the original (O12,2) absence from the preceding accepted insert that creates it; that state reminder matters. O13 exists in the earlier modelling/download setup, while the optional inline seed is the smaller O12-only setup. This difference is stated, though readers running only the inline seed should not treat the O13 sentence as their live contents.

Deletion is explained as two fresh attempts, and the illustration states each starting state. CASCADE does not delete the referenced product, the application still chooses who can delete completed orders, and optional references need a meaning after SET NULL. The concurrent SKU example's application branch is clearly labelled in a comment, rather than looking like SQL conditional syntax. The stored result follows from A committing before B can finish. “The wider operation” accurately limits what valid rows establish and reconnects constraints with transactions without implying a foreign key requires every parent to have children. Remaining friction: the earlier optional price exclusion syntax and first SQL environment setup.

## Tables and JSON: opening through adding attributes

The opening carries the same product identities into different descriptive attributes. JSON “key” is explicitly distinguished from primary key; nested height and care values are not separate rows. The three row-boundary sketches state which rules each arrangement supplies and which it does not. Related mug details admit a precise integer range, warn about rounded conversion, and promise an input rule later. Question recorded: how will this range/conversion rule be applied to an incoming JSON number, especially a fraction? This is pending at this point.

The JSON example expressly resets to the four-table Constraints setup after the alternative mug_details snippet. That reset prevents reading two alternative implementations as cumulative work. I recognise ALTER TABLE/ADD COLUMN and UPDATE/SET/WHERE from experience; the surrounding prose says what they do sufficiently to map this particular command to its changed row. `jsonb_typeof` is an unfamiliar function at the block, but the following explanation immediately identifies its role as the object-only check. `{}` as a default and whole-column NULL versus JSON null are spelled out. The last paragraph sets up the capacity-query question before showing operators.

## Tables and JSON: nulls through final design

“Missing keys, nulls, and types” defines `?`, `->`, `->>` and `::jsonb` before its sample query, and explains WITH/VALUES/AS. This later supplies the cast concept that was missing in Constraints' optional price code. The output table preserves SQL NULL explicitly rather than making missing cells ambiguous. The diagnostic model clearly admits a whole-column SQL NULL that the real attributes column forbids; its closed note/fallback are supplementary evidence.

At the first capacity filter, a number-only CHECK appears to promise queryability but the following paragraph explicitly exposes 350.5 as admitted data that the integer-text cast cannot read. “Finish the capacity rule” then resolves the earlier pending input question: numeric type, exact whole value, positive finite integer range, and only then integer conversion. The resulting typed details query processes the values the design admits. The outer/inner CASE explanation is after a sizeable code block; I supplied SQL CASE expression syntax until that paragraph, but the immediately following explanation and input/result table are enough to revisit and trace 350.5 → NULL → NOT NULL refusal. Moving a one-line CASE orientation before the block would reduce effort, not repair a broken argument.

The migration includes creation, insert and removal in one transaction, says ROLLBACK after failure, and states that old JSON has not been removed in the failed case. The exact P7 migration scope and further product-kind completeness limit are explicit. The final design retains material in JSON and one authoritative capacity in mug_details.

The later old-object example expressly starts a separate two-entry P7 object. It shows why serial writes can still lose a change, then the jsonb_set expression preserves matte while setting stoneware. I can follow each submitted object. Supplier offers use a stated one-offer-per-product/supplier assumption and compare row-lock boundaries without promising complete independent operation. No remaining conceptual or practical-completion gap in the JSON design; the size of the nested CASE block is the principal reading effort.

## Queries and joins: opening through missing matches

The introduction promises to introduce SQL while assuming tables/columns/keys, which the completed route has taught. The first query explains quotes, semicolon, aliases, computed output and parameter binding; it explicitly says the displayed clauses do not dictate execution order. The optional setup now says to open files in a PostgreSQL query editor, load the base once and extension once, and use a fresh database apart from article extensions. This partially resolves prior setup uncertainty: the file execution order is supplied, though access to a PostgreSQL database/query editor remains a prerequisite.

The result-grain illustration separates lines, qualifying orders and totals before duplicate order IDs become confusing. The product join traces O12/P7 and explains how primary key plus required foreign key ensures one match per line. Added Ben and O14 are new records explicitly established by the optional extension. Ben's null order output is distinguished from a real empty order. The ON-versus-WHERE comparison uses explicitly separate copies, adding Cara/O15 without redefining the shop. Temporary-table setup is optional, says the same session must be used, and explains its lifetime. The two result tables let me trace both Ben's unknown and Cara's false condition. No unsupported SQL inference is needed for that comparison.

Artifact timing boundary: after this tranche the coordinator reported the build had changed. Earlier page notes preserve the initially supplied HTML extraction. From this point I refresh the current compiled HTML when arriving at each page. I have not read source changes or other findings. A later bounded reread can assess any changed earlier passages without replacing their original questions.

## Queries and joins: totals through checking

COUNT(*) versus COUNT(nonmissing line_no) uses O14's preserved left-join row to make the difference deriveable. COALESCE's displayed zero is explicitly a reporting choice, not completion of an order. HAVING is explained against an actual lost €20 line under an early WHERE filter.

The two-lines/two-shipments join exposes each identity and every €20/€24 pair before summing €88. The explanation that shipments do not identify which lines travelled in them prevents inventing an association the data never stored. SUM(DISTINCT) is challenged with two different €20 lines. The repair first groups each collection, shows both intermediate results and then one €44/2 row; it names the deliberate O13-only scope and separately tells all-header readers to consider left joins. WITH was already taught on the completed JSON route; here it is reiterated as temporary query naming, not a permanent table. The EXISTS example explains both the correlated order ID and SELECT 1. All concrete results are followable from the presented inputs. No remaining gap; retain the exposed-identities method and intermediate tables.

## Large results: ordering through token handoff

This article explicitly starts a fresh example: O14/O15/O16 now tie at 12:00, rather than continuing query-results' O14 at 11:00. Optional practice setup is also separate from the prior extension and rolls back changes between experiments. That reset is visible before any SQL.

The first page settles time ties with unique IDs and explains DESC/LIMIT. OFFSET's insert/delete examples trace current positions against what was already read. The paired comparison is taught left-to-right and explains why descending order needs less-than. O14, with the same timestamp, is the decisive record; the result comparison makes the time-only omission apparent. The next-page boundary is explicitly the last returned pair, including the case where the original boundary row is deleted. No outside SQL knowledge is necessary to predict these examples.

The model's default static rows/results agree with unchanged data. Its optional note and fallback distinguish alternative mutations and say neither method keeps a snapshot. The “move O14” choice raises the natural question of mutable sorting values; the fallback already warns of a miss, with the full explanation still to come. Token handoff distinguishes opaque-client storage, fixed query identity, precision, access checks and one extra lookahead row. I can trace why advancing the token to the third row skips it. No gap in this portion.

## Large results: work, mutable values and fixed export

The index explanation carries the overview's extra-route/write-maintenance model forward without promising measured speed. The optional all-lines query changes to oldest-first explicitly and selects header identities before joining; its one-statement view is distinguished from two separately issued reads. The mutable-ordering discussion resolves the O14 control question and adds membership/cutoff limits. A key range is not a snapshot, with late commits inside the bound as a concrete reason.

The export changes the filter to all customers and order to ascending in visible prose before SQL. BEGIN/DECLARE/FETCH/CLOSE/COMMIT and the same-connection requirement are explained; five original records give the three listed batches. I can follow O14's old-versus-new timestamp in the export illustration. I knew NO SCROLL and cursor lifecycle from experience, but the following paragraphs supply their required meaning. Costs, lost connection state and retained IDs versus retained values are made explicit. The final work/checkpoint section opens a later retry question without promising that pagination solves ownership. No remaining gap in this article.

## Transaction boundaries: opening through checkout

Transactions are motivated by undo work that could itself fail, and autocommit versus explicit grouping is explained before the example. Connection/session terms and old-reader visibility are supplied. The fresh checkout keeps historical O12/O13 already accounted for, starts stock at three, and says O14 is absent; it does not accidentally reuse query-results' empty O14. The optional stock setup reiterates fresh alternative attempts.

The first UPDATE uses current database stock, declares the sufficient-stock condition and explains RETURNING. The crucial zero-row branch is plainly application work: successful SQL with zero changed rows still requires ROLLBACK and stopping. The following order/line block is explicitly conditional on one returned row and same connection. A beginner can map the fields and predict one remaining mug/O14 present, without pasting both paths as an unconditional script. No pending question here.

## Transaction boundaries: failure through review

The failure attempt restarts from three mugs/no O14, labels the deliberate quantity-zero mistake, and instructs issuing ROLLBACK after the error. The result table compares independent attempts, not a successful commit followed by rollback. Savepoints are tied to optional work rather than used to excuse an absent required line. The paragraph distinguishing rollback of current work from later cancellation is a valuable completion of the example.

Payment raises the boundary question before offering an explicit pending workflow. Its figure labels the proposal as beyond the runnable schema and distinguishes confirmed decline from unresolved timeout; it does not imply a status column implements cancellation or deduplication. The repeated-result stock-release requirement is clear. This is a scoped design proposal, so absence of a complete payment implementation is not a gap in the article's local transaction example. Reviewing after each statement and moving request parsing before BEGIN are usable practical conclusions. No remaining gap.

## Concurrent updates: opening through guarded change

The stock state restarts explicitly at one and introduces A/O14 and B/O15 as distinct purchases, potentially the same customer's browser tabs. The rule includes each committed purchase consuming stock, so nonnegative zero is not treated as sufficient proof. The unsafe literal UPDATE is visibly labelled, and its timeline explains that a row lock serialises commands without replacing B's stale reasoning. The six-step schedule is enough to reproduce the mental race; sequential testing would miss it.

The guarded update repeats current-value subtraction from transaction boundaries and now explains the crucial PostgreSQL Read Committed recheck after a wait. Its result table separates A commit/rollback and B's permitted response. The conditional insertion block says B substitutes O15 in both places. Zero rows is reiterated as successful SQL, with ROLLBACK/skip required. This is followable application branching, not an unlabelled executable SQL condition. No remaining gap in this portion.

## Concurrent updates: longer decision through wider rule

The partial-fulfilment motivation explains when locking before application reasoning is useful, then explicitly returns the code to the original one-mug comparison. FOR UPDATE's scope, duration and ordinary-read coexistence are explained. Comments are expressly application branches; the program must inspect the returned row before updating. The two timing paths show why locking after an earlier read is too late.

The interaction's extracted default is a completed unsafe attempt (stock zero/two purchases). Its static panels and optional/fallback boundaries are not evidence of step navigation. The prose explains committed counters separately from unfinished changes, giving the right interpretive rule for a later live inspection. A rollback remains a possible successful reservation for B, instead of equating waits with rejection.

The two-bin example scales the rule explicitly: both read 1+1 before changing different rows, yielding 0+0 without a local constraint failure or shared row wait. This is a successful bridge to isolation. “Serializable transactions with whole-transaction retries” is a named next mechanism rather than a promise that a snapshot already supplies it. No remaining explanation gap.

## Isolation: opening through the view's limits

The snapshot definition as visibility information, rather than a table export, answers a possible misleading image before it takes hold. The ordinary SELECT versus locking-read boundary is established early. The price example restarts at EUR 20 and separates catalogue EUR 22 from the recorded historical EUR 18 in its optional note. Read Committed's statement start and Repeatable Read's first query/data-changing statement are both explicit; BEGIN is not incorrectly treated as establishing the latter view.

The default model has not run its first SELECT; static evidence cannot establish advancing or resetting. The real practice instructions now explain two query-editor connections, the exact pause/commit sequence, and resetting P7 before changing level. This resolves where the reader should execute overlapping blocks, assuming access to PostgreSQL/query editor. Own-write visibility is tested in a separate rollback example. The changed-row failure and differing locking-read outcome are stated with PostgreSQL level assumptions, and the application is told to repeat the whole transaction. No unresolved gap in this portion.

## Isolation: write skew through chosen protection

The two-bin stock rule changes to a featured-display rule with an explicit explanation: product visibility, not stock or catalogue deletion. P7/P8 identities persist without importing earlier inventory counts. Both enabled flags and opposite staff decisions are provided. The drawing's comparison with both possible serial orders makes “neither serial order” concrete; I do not need to supply the formal anomaly from expertise.

The guarded EXISTS UPDATE has already-supported syntax and explains its boolean use. Its failure to coordinate a predicate on the other row is contrasted with the prior same-stock-row guard. The Serializable section repeats the complete decision, explains that rejection may arrive at commit, and traces retry to a valid zero-row result rather than fulfilling the original wish regardless of the rule. The shared control-row alternative expressly uses Read Committed and a subsequent flag-reading statement. Its four steps and caution about unchanged control locks at Repeatable Read make the refreshed view timing followable. No remaining gap. Preserve the serial-order explanation and the exact subsequent-statement boundary.

## Waits and retries: opening through known rejection

The opening distinguishes a live attempt, known rollback and possible commit; the reader is ready for the different recovery actions. The wait section does not turn zero-row insufficient stock into an indefinitely retryable error. Cancellation receipt versus server confirmation and failed-transaction cleanup are precise.

The P7/P8 cycle has each held/wanted row explicit, and the sorted-acquisition alternative is explained in terms of B waiting before owning the opposite half. The locking SQL is labelled as inspection, with no purchase changes and an ending ROLLBACK. It names a fresh stock prerequisite before that setup arrives later. No falsely runnable completed checkout is implied.

The retry section connects 40001/40P01 to the whole rolled-back mug/bowl attempt and carries forward changed business outcomes. The code is explicitly application pseudocode. Question on arrival of `original_request.checkout_token`: where does this stable identity come from, and how does recovery know whether that operation committed? The comment states retention across requests/restarts but does not yet define recording or recovery. This is a pending question for the next section, not a gap claim. The bounded loop and random wait outside the transaction are interpretable from programming knowledge.

## Waits and retries: uncertain commit through recovery

The two missing-reply histories make the uncertainty concrete without equating it with rollback. K14 is then defined as an intent distinct from a proposed O14/O15 order. The caller/restart retention paragraph resolves the earlier checkout-token origin question. Customer, complete lines, agreed price and EUR are bound to the operation; repeated use for a changed intent is explicitly refused.

Question at the first `INSERT ... ON CONFLICT ... RETURNING` fragment: do I issue BEGIN before pasting this, and exactly where do I commit the two branches? It is called the transaction's first operation and later prose says provisional, but this first displayed runnable SQL block does not contain BEGIN or an explicit pre-block command. I supplied the necessary BEGIN from the earlier transaction lesson. The later `record_or_find_checkout` pseudocode resolves the complete boundary and both commits/rollback. This is a practical sequencing friction, not a missing final protocol: someone experimenting when first reaching the SQL could autocommit the order header before the stock/line fragments. The smallest improvement is to state before the first fragment that these fragments must be run inside one open Read Committed transaction and show its BEGIN, with a reminder that the branch diagram/pseudocode governs their execution.

The inserted branch's zero-row stock failure rolls back the provisional claim; the repeated branch skips reservation. The final pseudocode connects these fragments rather than pretending ON CONFLICT performs the entire branch. After a lost reply, the recovery section correctly makes an empty lookup inconclusive, then traces the same-key wait to commit/no-insert/fresh-read versus rollback/new-insert/reservation. The committed counter changes and alternative O14/O15 outcomes are followable. Retaining the database key/result, authoritative reads, pending state after budget expiry and separate provider outcome are explicit. The response table preserves the evidence-based distinctions. These are strong explanations to retain.

## Optional checkout tour: opening through concurrent purchase

The opening makes the separate Alice/mug_42 shop explicit and says orders directly name one product while stock lives on the product row. This removes the collection-wide identity/shape ambiguity. Its earlier-order illustration explicitly says after Alice's purchase and a later price change, with stock zero and paid €18/current €20.

Question at “Finding the mug without visiting every product”: the index lookup reaches Blue mug, stock 1. Are we returning to the moment before Alice's purchase? The section does not state that reset, and its “row version visible to this reader” line opens the possibility of an old snapshot. I infer that it shows the initial checkout lookup because the opening began with one remaining mug and the next section starts the purchase, but that event position is supplied rather than made explicit. This is local continuity friction; a caption saying the lookup is before checkout would settle it without adding a new concept.

The B-tree separator/leaf explanation gives enough text to follow the selected route and labels disk/cache limits. It is a further mechanism than the focused overview, appropriate to a supplemental tour. The next concurrency passage explicitly reads stock 1 and explains stale literal zero versus a guarded decrement. Its SQL comments are application branches and links identify where the complete statements/result checks live. The static interaction is initially stock 1/orders 0/no owner and the closed note/fallback describe the expected alternatives; no buttons were tested. All stock/order protection reasoning is already supported on the completed route.

## Optional checkout tour: versions through ending

The report-stock example defines its timeline explicitly: first read 1, Alice commits, second read 0 or 1 by level. That reinforces the snapshot/claim distinction, but does not resolve where the earlier index lookup occurs. MVCC, cleanup and durable log concepts each have a concrete purpose and a further-reading link. Lost replies carry the same checkout identity; the focused recovery article has already supplied how that works. The final several-products extension names order headers/lines and all-reservation atomicity, reconnecting to the focused collection without presenting the separate shop as its prior history.

## Remaining repairs, in reading order

These are observations from an HTML extraction. They do not assess visual layout or live interaction behaviour, and are not a technical source verification.

1. **Small optional syntax aid — Constraints, “Complete PostgreSQL table definitions.”** The price rule uses `<> 'NaN'::numeric` before explaining either notation. Later text supplies NaN's purpose and the JSON article supplies casting. State here that `<>` means not equal and `::numeric` interprets the literal as that type. Recheck that a reader can explain both clauses of the nonnegative/non-NaN rule without prior SQL.
2. **Practical sequencing — Waits and retries, “Give the checkout an identity that survives attempts,” before its first ON CONFLICT insert.** The boundary is complete in later pseudocode, but the first copyable fragment omits BEGIN. Give the opening Read Committed command and say to keep the branch work on that transaction/connection until its indicated ending. Recheck an ordinary first-time practice walkthrough: no provisional order should commit before reservation and line creation, and the duplicate branch should skip reservation.
3. **Reduced continuity effort — optional checkout, “Finding the mug without visiting every product,” lookup caption.** The prior figure is stock zero after Alice's purchase, while lookup yields stock one. Mark this lookup as the pre-checkout state. Recheck that the reader does not infer an old snapshot or restocking event.

An optional practice-entry aid could link the first downloadable schema mention in Modelling to a short PostgreSQL/query-editor setup prerequisite. Later optional practice notes explain file order and two-connection execution well. I did not attempt installing/opening a database, so this is an entry uncertainty rather than a failed example. The nested CASE orientation in Tables and JSON could move just before its migration block to reduce revisiting effort; its explanation and outcomes are already complete.

## Explanations worth retaining

The route explains its difficult choices through the same meaningful facts. O12's agreed €18 price remains distinct from P7's current €20; O13's two lines support keys, dependencies, joined grain, totals and many-to-many relationships. Fresh pagination/checkout setups are explicitly reset. Joined identities and intermediate summaries make multiplied totals inspectable. The JSON design follows an admitted fraction through query failure into a completed whole-number policy. Zero-row UPDATE outcomes are distinguished from errors. The concurrency lessons coordinate the decision before the write, then carry that distinction into snapshot versus protection. The shared control-row sequence specifies the subsequent Read Committed statement. K14 recovery retains intent, separates missing lookup from established absence, and waits on uniqueness before deciding which order exists. These are complete explanations, not passages that need general expansion.

## Bounded reread of rebuilt earlier pages

After completing the full route, I compared the current compiled text with the preserved initial extraction for Introduction, Modelling, Constraints, and Tables and JSON, then read the changed passages with their surrounding paragraphs. Modelling has no text changes. This is an informed reread, not another blind first reading.

The introductory index illustration now uses O21/O22/O23 for other customers while preserving C4's O12/O13 amounts and both lookup associations. That avoids inviting later interpretation of O14/O15/O16 as those other customers' persistent orders. Its same-answer/changed-work explanation still holds.

Constraints now explains `<>` and `::numeric` in “Required values and checks,” next to NaN's purpose. The earlier optional-code question is therefore resolved within that article; repair 1 above is no longer outstanding. The initial question and its earlier cross-page resolution remain in the historical reading log.

Tables and JSON now orients BEGIN/COMMIT, INSERT … SELECT destination mapping, and JSON key removal before the migration; it moves CASE's full explanation before the code. The earlier revisiting effort is resolved, and a reader can map P7/350 into the destination before reading the expression. The current jsonb_set illustration also explicitly identifies its attributes argument as the current row, rather than B's saved copy. These changes preserve the earlier complete input policy and sharpen its practical trace.

Current outstanding observations are therefore repair 2 (first operation-claim SQL boundary before the later pseudocode) and repair 3 (pre-checkout moment in the optional tour's index lookup). The practice-entry suggestion is optional; no attempted execution demonstrated a setup failure. No new conceptual gap appeared in the bounded reread.

## Final bounded reread of the rebuilt HTML

I refreshed the compiled Constraints, Tables and JSON, Waits and retries, optional checkout and Pagination pages, then read only the requested changed passages with their local context. This remains an informed HTML reread, not a live execution check. The original questions above are preserved.

- **Constraints, NaN:** `<>` and `::numeric` are now explicitly explained beside the NaN reason. The original optional-code syntax question is resolved within the article.
- **Constraints, composite reference:** the paragraph now identifies the two-order example as belonging to Designing a schema. That makes O13's line 2 a referenced teaching state rather than implying it exists in the smaller inline seed. It still says that the earlier accepted insert creates (O12,2), preserving before/after execution continuity.
- **Tables and JSON, conversion:** BEGIN/COMMIT, INSERT … SELECT destination mapping, the JSON removal operator and CASE evaluation are oriented before the migration block. The earlier effort of supplying SQL CASE understanding before its explanation is resolved. The complete accepted/rejected input policy remains intact.
- **Tables and JSON, jsonb_set:** the illustration identifies attributes as the current stored column. The code explanation now maps all three arguments, including the one-key path and the JSON string's quotation marks. A programmer can trace the expression without supplying PostgreSQL argument conventions from experience.
- **Waits and retries, first claim:** the passage now instructs starting a new Read Committed transaction on one connection and retaining it through the chosen branch; the first fragment contains BEGIN. The original premature-autocommit question is resolved before the copyable insert. The existing zero-row branch and later complete pseudocode still govern which statements run and where the transaction ends.
- **Optional checkout, index lookup:** both the opening sentence and caption place stock 1 before Alice's purchase. The earlier stock-zero illustration therefore no longer leaves the reader to invent a snapshot or restocking explanation. The original continuity question is resolved.
- **Pagination, practice instructions:** the closed setup now says to execute statements one at a time in order or use script mode such as `psql -f`, and explains why a query editor's “Run all” can change these experiments' transaction boundaries. This makes the practice instruction operationally more precise while retaining fresh setup and rolled-back alternative experiments. I did not execute the setup, so this is verification of the instructions' meaning only.

No material remaining comprehension or practical-sequencing concern in these reread passages. The prior optional suggestion for a first PostgreSQL/query-editor entry aid remains an unattempted setup uncertainty, not a demonstrated failure or required repair.
