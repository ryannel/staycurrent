# Sequential reader log

Scope: built-page text, one numbered chunk at a time. Intelligent developer with basic SQL, new to transactions and concurrency. No judgment of rendered diagrams or interactive operation.

## Transaction boundaries — 00 opening

Understood: several successful writes may otherwise leave an incomplete purchase; a transaction commits the group or rolls it back. Boundary choice belongs to the application.

No consequential question yet. “The tables and keys introduced in Constraints” tells me this continues a sequence; I may need that table shape when SQL arrives, but have not yet had to supply it.

## Transaction boundaries — 01 commit and rollback

Understood: BEGIN groups subsequent statements until COMMIT/ROLLBACK; autocommit normally makes each statement its own committed unit. Connection/session are defined before they matter.

Question, non-blocking and explicitly deferred: “a reader using a sufficiently recent view” — what makes a view recent or old? I know other sessions cannot see unfinished changes; I can follow the boundary argument without the view mechanics. The paragraph points to Isolation and snapshots, which is adequate here.

## Transaction boundaries — 02 start with the rule

Understood: the rule is an exact correspondence between the new purchase's lines and stock reserved. Each omitted write gives a concrete bad result. Commit and rollback illustrations make both endings concrete. Constraints can validate records without requiring the application to issue every necessary statement.

Question, harmless at this point: “Ada’s earlier order O12 bought two mugs at €18 each” — why do I need this other purchase? I have not seen a reason to confuse it with O14. I assume it connects to the preceding article's examples; it does not interfere with the new example.

## Transaction boundaries — 03 working through checkout

Understood: stock setup is isolated; WHERE asks for enough mugs, RETURNING lets the application distinguish a reservation from zero affected rows, and the order/line writes follow only the successful reservation. The shared connection requirement now makes concrete use of the prior session definition.

No needed answer missing. I do supply the ordinary application ability to branch on a query result, which is reasonable for this audience. INSERT is explained more slowly than I need, but the mapping is short. The practice-schema dependency is explicit, so the missing customer/product setup is not disguised as self-contained SQL.

## Transaction boundaries — 04 a failure after the first change

Understood: invalid quantity fails the transaction, rollback discards earlier writes, and the follow-up counts distinguish committed from abandoned purchase. Savepoints allow partial error recovery only when the business rule permits abandoning that part.

Question, non-blocking: “PostgreSQL puts the explicit transaction into a failed state” — does it discard changes immediately or only when ROLLBACK is issued? The exact timing is not required for the shown procedure, which clearly says to issue rollback, but I cannot yet explain what failed state means beyond ordinary work being disallowed.

The explicit statement that rollback cannot erase an already committed order resolves a possible broader misunderstanding before it became a problem. O12 still appears to be background continuity rather than information this argument needs.

## Transaction boundaries — 05 when payment happens elsewhere

Understood: the provider owns separate state; moving its call inside BEGIN/COMMIT cannot make database rollback reverse a charge. Pending purchase, provider outcome and a later transaction give the intermediate state a useful meaning. Repeat cancellation must not restore stock twice; timeout is not decline.

Question with a local explanatory gap: “keeps its acquired locks open longer” — what is a lock, when did this transaction acquire one, and who is affected? Until this line I have learned about atomic groups and visibility, not locks. I can accept the payment-boundary conclusion from the earlier example, but cannot follow this additional reason for keeping transactions short without supplying concurrency knowledge. Small likely repair: define a lock here as making other work wait to change the same row, or defer this reason to the concurrency article.

Questions about stable payment references and reconciliation are appropriately signposted as requirements beyond this runnable schema. I do not need their implementation to follow the boundary.

## Transaction boundaries — 06 reviewing a boundary

Understood: test interruption after each step, test zero-row outcomes, and commit the completed local change. The closing paragraph explicitly separates partway failure from two successful purchases making incompatible promises.

Question, local concept deferred by the ending: “information that does not need to stay protected” / “operation that protects them” — what protection is being referred to? I know a transaction hides unfinished changes, but not what it prevents other requests doing. The available-stock example and immediate handoff make this a tolerable forward pointer, though these instructions are not yet actionable for me. The earlier unexplained lock is still unresolved.

## Transaction boundaries — 07 sources

The locking source says acquired locks last until the transaction ends. This explains duration but not what those locks do. I have completed the article with its atomicity and payment-boundary arguments intact; the lock rationale is the only place I had to supply a new technical concept to understand the stated reason.

## Transition

Now read concurrent updates in order, retaining what the first article taught me but without looking ahead.

## Concurrent updates — 00 opening

Understood: concurrency means overlapping work, including a paused request; a read can age before the application acts. Atomicity does not award ownership of the last item. The two approaches are motivated before details appear.

Resolution in part of transaction-boundaries 06: protection is now evidently coordination of a read-dependent decision against another request acting in the gap. I still do not know what locking does; this opening promises to teach it. Read Committed is named as the example's setting and isolation is briefly defined, which gives me enough to proceed without knowing its full behavior.

## Concurrent updates — 01 the rule

Understood: A and B are genuinely separate purchases, not duplicate attempts to deliver one purchase; both need the same sole remaining item. Non-negative stock is insufficient because two orders can agree with a final zero while consuming the same stock.

No blocking question. Again O12 is background continuity, not a premise I have needed. Fresh independent setup and new order IDs prevent accidental mixing with the completed prior example.

## Concurrent updates — 02 two correct subtractions

Understood: a constant computed in application memory loses the permission check. Both writes can serialize correctly and still preserve the wrong pair of purchases. The event table establishes exactly when B waits and why waiting alone does not refresh its decision.

Resolution of transaction-boundaries 05: “a row lock: a claim that makes a conflicting writer wait until A’s transaction ends” finally supplies what acquired locks do. It also resolves the remaining vague protection language from that article. The explanation would have been sufficient at its first mention there.

Question, harmless: what precisely counts as a conflicting writer? Both writers here target the same stock row, which is enough for this example. No need for a wider lock compatibility taxonomy.

## Concurrent updates — 03 make the test part of the change

Understood: B waits and PostgreSQL rechecks the condition against A's committed value; A's rollback leaves the mug available to B instead. RETURNING is the permission evidence for creating the purchase. The table connects each A outcome to B's action without requiring me to infer rollback behavior.

No consequential question. The closing explanation of SQL subtraction without a guard prevents me taking the wrong lesson that arithmetic location alone solves it. I can distinguish a constraint rejection from zero returned rows because both were already explained.

## Concurrent updates — 04 lock before making a longer decision

Understood: FOR UPDATE moves waiting before the value used for the application's decision; same transaction retains the lock through the update. Plain reads remain possible. The paired aid makes the different placement of the decision explicit.

Question affecting the promised comparison, not the mechanics: “A locking read is useful when the application needs several decisions based on the protected row.” What is one such decision in this shop? The only demonstrated decision is still available >= 1, and I have just seen it expressed more directly as a conditional update. I understand how to use FOR UPDATE but must invent the use case that makes it worth choosing. A single concrete example of inspecting the row for a decision that application code needs to make would complete the comparison; a second worked SQL example is unnecessary.

No confusion about the unguarded UPDATE in this example: the acquired lock plus application branch explain why it is safe here. The ordinary-read versus locking-read distinction is now clear enough to answer my earlier conflicting-writer curiosity within the example's scope.

## Concurrent updates — 05 change the first transaction's ending

Understood from the static text: waiting can end with success as well as rejection; rollback releases the reservation. Committed counters differ deliberately from unfinished request state. The unsafe algorithm can happen to produce a correct result when A rolls back, which follows from both computing zero and only B committing.

No new consequential question. Cannot establish whether controls, initial state or intermediate diagrams support this explanation from the text artifact. The stated completed unsafe initial result and instruction to advance it read a little awkwardly together, but without interacting I cannot call that a functional or comprehension defect.

The practical reason to choose the longer locking-read route remains unanswered.

## Concurrent updates — 06 when the rule grows

Understood: a cart's independent stock requirements compose under one atomic transaction, but a cross-bin total does not. Opposite lock acquisition order explains mutual waiting in a concrete way before deadlocks are deferred. The bin example shows why locking only changed rows leaves a shared condition unprotected.

Non-blocking forward questions: what is a common reservation record and how do serializable retries enforce the cross-bin rule? These are introduced as choices that require the next article, not as instructions I should already implement. The failure is concrete enough that I can follow the need for wider protection without those details.

The cross-bin example broadens locking's scope but does not answer why application decisions on the single row would require the earlier locking-read method.

## Concurrent updates — 07 sources

No new question. The Read Committed source description ties both demonstrated protection mechanisms to their setting. The article's algorithmic explanations were followable; the unresolved decision is when a realistic application needs the extra read-and-decide route.

## Consequential findings after both articles

1. Transaction boundaries introduces “acquired locks” in the payment section before explaining a lock's effect. The reader can understand the payment boundary, but must supply an extra concurrency concept to understand why a slow call prolongs a problem. The next article eventually gives the needed one-line definition. Small repair: add here that other work needing to change the same row must wait until the transaction ends.
2. Concurrent updates teaches how SELECT FOR UPDATE works but does not give a concrete reason to choose it over the conditional update. “Several decisions” remains abstract after every demonstrated stock decision reduces to available >= 1. Small repair: add one real example of an application decision based on a protected record, then explain why it cannot be expressed as the shown single conditional update. Avoid expanding this into another tutorial.

Neither finding invalidates the core arguments. The remaining logged questions are harmless curiosity or explicitly deferred material. Plain text does not verify diagram clarity or interactive behavior.
