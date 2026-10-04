# Sequential reading: transactions and concurrent updates

Audience: intelligent developer with tables, types, keys and basic SQL, learning transactions. Guidance read: first-reading.md and blind-review-voice.md only. I am reading the supplied displayed-text sections in order, writing each entry before opening the next. I have not inspected rendered pages; observations about media placement or possible visual support are provisional and do not establish rendering or interaction behaviour.

## What belongs in one transaction?

### 00 — Opening, first reaction
- The stock reduction followed by a rejected line makes the failure concrete. “Asking the application to undo each successful step ... could itself fail” answers the natural question of why application cleanup is insufficient. Preserve this sequence.
- Commit/rollback and atomicity arrive after the problem; I can follow the proposed solution without supplying transaction expertise.
- “The application needs all of those records to describe the completed action” starts the boundary question well. I expect the purchase example to distinguish truly necessary records from merely related work.
- “Tables and keys introduced in Constraints” is a declared prerequisite beyond the supplied audience. No problem yet, but I will watch whether the exact table relationships needed for the SQL are recalled locally.

### 01 — Commit and rollback, first reaction
- “Three separately committed statements give us three separate outcomes” makes the significance of BEGIN clear. The reminder about client libraries prevents treating the displayed SQL as the only way a transaction can exist.
- The paragraph about sessions asks me to picture a writer with unfinished changes, another reader with a recent view, and an older reader. I understand the distinction, but the passage introduces visibility before I have seen the purchase steps. This is modest mental effort, not a comprehension block; the caveat is necessary to avoid promising instantaneous visibility to everyone.
- “Sufficiently recent view” leaves a useful deeper question: when does a reader's view get fixed, and what operation advances it? The named Isolation and snapshots destination matches this question. I do not need its full answer to choose a transaction boundary.

### 02 — Start with the rule, first reaction
- The three “wrong story” examples supply the reasoning promised by the opening. I can decide why this boundary includes stock, order and line, rather than accepting a grouping by convention.
- The teaching aid already supports the main picturing task: hold initial stock 3, remove 2, create O14 and its line, then compare committed and rolled-back endings. Its “endings as alternatives” and exclusion of other transactions keep the scope precise. Preserve or improve this existing aid before considering another representation of the same relationship. I have only its displayed text, so cannot judge spatial clarity.
- “Does not ... discover an omitted statement” usefully prevents confusing atomicity with completeness. The line's foreign key cannot make the application insert a line in the first place. This is a strong boundary between two previously taught concepts.
- The final paragraph introduces O12 and €18 immediately after I have assembled O14/P7/C4/€20. I now have to remember whether old purchase data will matter in the forthcoming SQL. The paragraph says it will remain unchanged, so it may be guarding against confusion from another article rather than serving this reading. Preserve this initial reaction; later material may justify it.
- A question I would test: what happens if the application omits the line and still commits? The prose already answers that it can leave an otherwise valid order. No interaction is needed merely to repeat that answer.

### 03 — Working through checkout, first reaction
- The stock statement, returned row and application decision appear in the order I need them. “Zero rows is a successful SQL execution” is especially useful: it explains why the rollback decision belongs to the application instead of silently treating an unmet business condition as a database error.
- The code-to-result mapping is easy to follow for the stated audience. The separate stock table is locally defined; the order and line inserts name their columns. This resolves my opening concern about needing to recall the earlier schema merely to understand the example, although executing it still requires that schema.
- I hold three things across the two code blocks: the transaction remains open, one row must have been returned, and the connection must be the same. The bridge states all three clearly. I do not need another diagram here.
- The code displays INSERT, INSERT, COMMIT as a sequence after checking only the stock result. I expect the next section to show what the application does if one of the inserts fails; the opening already promised this failure. This is an anticipated question, not yet a gap.
- “Both O14 records” is briefly imprecise after several table names: it means the order record and the line record. The preceding code makes recovery easy; low impact.
- The earlier O12/€18 detail has not been needed here. The new inserts and their price are understandable without holding the old values.

### 04 — A failure after the first change, first reaction
- The opening restates the initial state before the failed attempt. That removes the need to guess whether the previous committed purchase is still present. The table then makes the two independent outcomes explicit.
- Resolution of 03's expected insert-failure question: the failed transaction and same-connection ROLLBACK are explained immediately in the next section. This is good pacing rather than a reason to expand the previous block.
- The result queries and outcome table turn “discarding” into values I can check. The existing purchase illustration plus this table already cover success/failure well; another all-or-nothing aid would duplicate them.
- The savepoint paragraph briefly asks me to imagine abandoning part of a transaction, but gives no placement example. I can follow its warning because the line is mandatory. A deeper useful question is: which failures can legitimately be recovered with a savepoint while the rest still commits? That is optional further reading, not missing reasoning for this purchase.
- “Cancelling a completed purchase is a new change” is an excellent distinction. It answers whether rollback is a general undo facility and ties cancellation back to boundary choice. It also opens a separate business-workflow question: what must cancellation reverse once shipment or payment has happened? That question need not expand this article.

### 05 — When payment happens elsewhere, first reaction
- “Reversing the order merely changes the unfinished case” is a compact, convincing reason that rearranging the two systems' operations cannot supply one atomic outcome.
- The pending state changes the meaning of a recorded purchase: it reserves stock but cannot yet be fulfilled. The text states this explicitly before the diagram, so the shift is followable rather than a contradiction with the opening.
- The existing payment illustration gives the ordinary success/decline sequence. My largest new picturing task begins at “No confirmed answer?” and “Processing a repeated payment result must not release stock twice”: I now have to hold the local order state, reserved quantity and provider outcome separately, then imagine the same event arriving twice. The ordinary branching drawing may already express some of this visually, but its extracted text gives unresolved and repeated outcomes as cautions outside the numbered path.
- The concrete question I want to test is: if a decline result is processed once, then delivered again, which values are examined before releasing stock, and what stays unchanged on the second delivery? A second question is what the shop can safely do after a timeout followed by eventual payment success. The article explains why these cases matter but leaves the mechanism at “eligible” and “recognise ... already handled.” That is acceptable for a boundary article, though the distinction between the known local state and unknown provider outcome is worth making easier to follow.
- Medium opportunity (provisional): improve or extend the existing payment aid to make a repeated result or unresolved outcome traceable, rather than adding another complete workflow illustration. A short before/after state example may suffice; interaction would be useful only if it lets the reader change delivery order and observe the consequence.
- Useful further-reading question: how does a restartable payment workflow identify the same purchase, reconcile an uncertain outcome, and prevent duplicate effects? This has its own purpose. The “Handling waits, deadlocks, and retries” destination may address database recovery, but the text itself says the provider needs a separate contract. No need to solve that entire workflow here.
- The row-lock paragraph introduces a new mechanism exactly when its practical cost matters. “Another transaction ... must wait until this one commits or rolls back” supplies enough meaning to understand why a slow external call harms throughput. I do not need a separate lock lesson at this point.

### 06 — Reviewing a transaction boundary, first reaction
- “Pause after each statement” is a usable review procedure rather than a recap of terminology. It reconnects the zero-row result to the business rule.
- “An earlier read ... whether ... before or after BEGIN” opens a deliberate question: why does BEGIN not make the read-and-update sequence safe from another purchase? The last paragraph frames this as the next investigation. That is a sound stopping boundary: atomicity and conflicting complete purchases are now distinguishable.
- The positive-integer example makes “prepare work ... before opening” concrete. It avoids leaving the reader to guess which validation is independent of current database state.

### 07 — Sources, first reaction and article close
- The source notes distinguish runnable table changes from the proposed external workflow. No further comprehension gap appears.
- O12/€18 never became necessary to the local argument. This remains a minor effort cost; compressing the historical-price reminder would preserve the useful point that this is a fresh attempt without adding unused identifiers.
- Overall, the article's boundary argument is complete for this audience. The main opportunity is to help readers track unusual payment outcomes within the existing aid, with deeper workflow recovery kept distinct from the immediate transaction lesson. The purchase illustration and result table are already doing useful work.

## When two requests change the same data

### 00 — Opening, first reaction
- “They need not execute instructions at exactly the same instant” makes concurrency imaginable as a sequence I can trace. The pause-after-read example removes a common obstacle before any code appears.
- “Coordinate the decision as well as save its results” answers the question left by the previous article. Atomicity can preserve both wrong decisions completely; coordination needs a separate mechanism.
- Read Committed is named and scoped but not explained yet. I can accept it as the setting for the coming demonstration without importing its complete semantics. I expect any behaviour needed for the two techniques to be explained locally.
- The opening uses one available item rather than the preceding article's three mugs and purchase of two. It is clearly a general example, but I will check whether the worked values are restated before calculations begin.

### 01 — The rule we need to preserve, first reaction
- The new initial count is stated before setup, resolving the opening's change from the previous article. A/B, O14/O15 and separate sessions are also established before a schedule appears.
- “Distinct purchase requests, not retries” is helpful after the previous article's duplicate-payment concern. Two orders here are intentionally separate intentions; I should not solve this example by deduplicating them.
- “Two purchases ... perfectly non-negative zero” gives me a precise surprising outcome to investigate. I want to see which instructions can produce it. The rule is stronger than the stock CHECK, and the text makes that distinction clear.
- Again O12, two mugs and €18 introduce history I do not need for the stated invariant. The key fact is that the one currently available mug is the starting state after prior activity. This is a modest avoidable memory load, not a blocker.

### 02 — Two correct subtractions, one wrong result, first reaction
- The two SQL snippets separate the read/computation from the later literal assignment. “That command contains no trace of why zero was chosen” explains the mechanism particularly well: waiting serializes writes but cannot reconstruct the application's stale reason.
- The six-step table already does the main temporal work. Before it appears I have to picture who has read, who holds the lock and who waits; the table immediately externalizes those relationships. Preserve the table. This is a resolved effort demand rather than a need for a second static schedule.
- “The database ... was never instructed to reconsider B's permission” connects valid rows and complete transactions to the violated business rule. This answers 01's deliberately surprising zero-stock/two-purchase outcome.
- I want to change the schedule: let A commit before B's read, or let B read early but delay its write until after A commits. Does waiting change correctness, or only timing? The prose supplies the first contrast, while the second should preserve the wrong outcome because B retains the literal zero. A schedule experiment could make this distinction testable; wait to see existing media before recommending it.
- The explicit distinction between a documented schedule and a benchmark is clear and does not interrupt the explanation.

### 03 — Make the test part of the change, first reaction
- The key transition is explicit: PostgreSQL rechecks B's WHERE against A's committed row. The setting named in the opening now has a concrete local meaning; I do not need to supply Read Committed expertise to follow this result.
- The commit/rollback table provides the comparison I would otherwise calculate mentally. It also teaches that waiting does not guarantee failure: the first transaction's ending determines whether B obtains stock.
- “Otherwise it can still create a purchase without obtaining stock” connects checking RETURNING to correctness. The earlier article's application branch is reinforced for a new reason, rather than repeated mechanically.
- The final paragraph distinguishes database-side subtraction, the availability guard and the CHECK constraint. This is a useful controlled contrast; it answers whether moving the arithmetic alone is enough.
- An experiment question now becomes more precise: after B is waiting, change A's ending from commit to rollback and inspect B's returned-row count and whether it may create an order. The text and table already answer it; interaction could let the reader verify the causal steps if an existing experiment supports that.

### 04 — Lock before making a longer decision, first reaction
- The partial-fulfilment example gives a reason to inspect a protected value in application code. Without it, FOR UPDATE could seem an unexplained extra step beside the already sufficient conditional update. The acknowledgement that SQL could express the decision avoids presenting locking reads as uniquely necessary.
- There is a brief example switch: request three/two remain, then return to the one-mug comparison. The text flags the switch clearly. I can follow it, although the partial-purchase logic remains conceptual rather than worked through. This is acceptable motivation, not a missing prerequisite.
- “These comments mark application branches, not SQL” is an important practical clarification. It prevents a learner from treating the runnable-looking block as a program that automatically rejects zero stock.
- The point where B waits moves from its UPDATE to its SELECT. That is the mental relationship I need to picture; the existing illustration immediately compares those two sequences. Its caption “Both attempts encounter a lock” isolates exactly why merely seeing a wait is not evidence of correctness. Preserve this aid.
- The final ordinary-read caveat raises a useful test: while A holds the lock, can B perform an ordinary SELECT, then later try SELECT FOR UPDATE? Which value can the application trust? The section answers the principle—ordinary reads may proceed and old values must not drive the later decision—without needing a new mechanism.
- “All relevant write paths ... compatible protocol” is a real boundary. A deeper question would be how to audit several services, jobs and admin scripts so every change obeys the same stock rule. This is implementation-design curiosity beyond the two-session teaching example.

### 05 — Change the first transaction's ending, first reaction
- Resolution of 03's experiment question: the existing experiment explicitly lets me switch A between commit and rollback for all three methods. This is the right existing support; do not add a duplicate interaction for that comparison.
- The explanatory paragraph before the controls states the causal question: waiting cannot reject B until A's ending is known. The fixed schedule is a useful limitation because it isolates method and ending.
- A new accounting effort appears in “The counters show committed records; the request panels describe unfinished changes.” While stepping through, I must distinguish the displayed committed stock of one from A's tentative reduction and the row lock that prevents B from acting on it. This is necessary to understand why a visible one does not mean permission to reserve. The final paragraph explains it well, but only after the experiment; the more explicit counter/panel explanation is inside optional material.
- Provisional medium opportunity: make the committed-versus-pending distinction explicit next to the experiment's state display, or move the final explanatory sentence to where the reader first sees A's pending update. The extracted labels already say “Committed,” so this is about why those numbers stay unchanged, not missing labels. The current control and panel behaviour needs rendered inspection before judging how much support is actually absent.
- The supplied artifact shows “Completed unsafe attempt” while the instruction says “Advance the unsafe attempt to its end.” I cannot establish initial UI state or a mismatch from this text extraction. Record it for rendered verification, not as a confirmed defect.
- Resolution of 02's schedule curiosity: the experiment intentionally does not let me move B's read relative to A's commit. The text already explains the serial case and the main experiment has a coherent narrower question. I do not recommend a free scheduling UI merely because I could ask that question.

### 06 — When the rule grows, first reaction
- The cart paragraph first shows a wider operation that still uses the existing rule. This prepares the distinction with the two-bin rule: “more rows” is not automatically “a different kind of decision.” Preserve that comparison.
- At “hold the mug row and wait for the bowl ... hold the bowl and wait for the mug,” I mentally draw a two-way waiting cycle. The two clauses supply all the reasoning, and the recovery article is a reasonable next destination. A drawing could reduce effort but is not necessary to follow these two sentences.
- The stronger effort demand is the two-bin example. I hold bin X=1 and bin Y=1, each transaction's observed total=2, A subtracting from X and B from Y, then final total=0. Earlier aids externalized a single contested row; here the key difference is that the writes never compete for the same row even though the decisions share one condition. I supplied the separate read/write footprint from the prose, but it is not laid out as explicitly as the earlier six-step schedule.
- Meaningful support opportunity: a compact before/read/change/after table for the two bins could show both locally valid writes and the failed total without adding a full new experiment. If illustration is used, show the rows each decision reads as well as the one it changes. This is a reader-effort observation; I have not established that an image is necessary.
- Useful question for the next article: why can both transactions hold a stable view of total two yet fail to preserve “leave one,” and what extra guarantee forces one to reconsider? “A stable view and a protected decision ... are not interchangeable” names precisely that unresolved question. I can proceed to the next article; full serializable mechanics do not belong here.
- The proposed solutions—common record, wider lock protocol, serializable with retries—are signposts rather than recommendations I am asked to implement now. Their local explanation need only keep that distinction clear.

### 07 — Sources, first reaction and article close
- Scope is clear: PostgreSQL Read Committed, documented model, not live connections or other isolation levels. No additional comprehension issue.
- This article supplies the needed reasoning for the one-row rule. I did not find a consequential unexplained jump in either safe technique.

## Handoff: observations first, possible repairs second

These are opportunities grounded in effort and curiosity, not a required media inventory. No rendered pages were inspected, so layout, initial interaction state and live behaviour remain unverified.

### Most useful opportunities

1. **Make the wider condition visible at the moment the one-row lesson stops applying.** In “When the rule grows,” the two-bin example requires retaining two quantities, two observed totals and two distinct write targets. The earlier article has carefully externalized simpler sequences; this important contrast is left in prose. A compact worked table or drawing of read sets and write targets could show why independent row locks never coordinate the shared “leave one” condition. Keep the existing cart comparison; it explains why simply counting rows is not the criterion.

2. **Explain the experiment's pending state at the point of use.** In “Change the first transaction's ending,” committed availability stays one while A holds an unfinished reduction and its lock. The reason is present after the experiment and in optional model notes. If the rendered step view does not already make the relation clear, move or repeat a short explanation beside that step, using the existing counters and request panels. Do not add a second model. The question is why visible committed stock is not permission to buy, not merely what “committed” means.

3. **Give the unusual payment outcomes a traceable state.** In “When payment happens elsewhere,” the existing aid shows normal success and decline, while timeout and repeat delivery add local/provider state and duplicate-effect reasoning mostly as cautions. A brief state trace within that aid could show what remains unresolved after timeout or why a second cancellation does not add stock again. This is optional support for understanding the boundary, not a request to implement a complete payments tutorial. A later article has a distinct useful question: how to restart, reconcile and deduplicate this workflow safely.

### Smaller editorial point

Both articles introduce old order O12, its two mugs and €18 price even though those values do not participate in either argument. The essential reminder is that starting stock already accounts for previous activity. Consider retaining that reminder and dropping the unused historical identifiers unless rendered context gives them a clear role.

### Preserve

- The “wrong story” argument for grouping stock, order and line, and the existing commit/rollback illustration.
- Zero affected rows as an application decision, shown beside the SQL and its result.
- The independent failure attempt, reset state and observable outcome table.
- “That command contains no trace of why zero was chosen,” followed by the unsafe six-step schedule.
- The explicit recheck of B's condition, commit/rollback outcome table and connection/branching reminders.
- The existing unsafe-versus-locking-read comparison, especially “Both attempts encounter a lock.”
- The experiment's current commit-versus-rollback comparison, which already answers the most useful interactive question raised during reading.

### Further-reading questions that arose naturally

- When does a reader acquire or advance its view? Existing Isolation and snapshots destination fits.
- Which partial failures are legitimate candidates for savepoints, and what must remain atomic? Optional deeper treatment, not required here.
- How do cancellation and payment recovery work after external effects already happened? A separate workflow question, beyond rollback.
- Why does a stable view fail to protect some cross-row conditions, and how do shared locks or serializable retries change that? The next isolation article is the right place to develop it.

No repository changes, outside research, rendered inspection, prior-history reading or other-reviewer reading were performed.
