# Sequential reader log

Scope: read one supplied section at a time; no author history or implementation. Reader knows basic SQL, transactions, conditional stock UPDATE and row locking. Plain text cannot establish rendered aid clarity or interaction behaviour.

## Isolation — 00 opening

I understand the report problem: summary and details can disagree if commits become visible between queries. “Stable view” is an intelligible promise to investigate next. No question that blocks following this opening. I do not yet know how stronger protection rejects work, but the opening explicitly defers the writing case, so that is harmless anticipation.

## Isolation — 01 snapshots

“Visibility information is called a snapshot” gives me enough of a mechanism: retained record versions plus a rule for choosing visible ones. I can follow without knowing the storage internals. “Previously committed price” raises no question because the next paragraph anchors it to when the query begins. The SELECT versus locking-read boundary is explicit; I carry forward the promised return to locking reads.

## Isolation — 02 statement and transaction views

The EUR 20 → EUR 22 schedule resolves the opening's central question. I know exactly which event changes the committed row and which event changes the report's visible value. The explicit first-query versus BEGIN distinction prevents a timing assumption I might otherwise make. The separate-connection instructions also explain how to create the overlap.

Question I am carrying: the report stays aligned “provided it uses ordinary reads and does not itself change the facts it is reporting.” If the transaction writes a fact, does its later read see that write despite its old snapshot? This is curiosity at this point, because the example is explicitly read-only and the article has promised writes next. Trigger: the quoted proviso and the model's exclusion of “the report’s own writes.”

Minor distraction, not a comprehension blocker: the model note introduces “O12’s recorded EUR 18 purchase price” although this article's running example has only needed P7. I supply that purchase-price-versus-catalogue-price distinction from basic table knowledge; the text says it is unrelated, so I can ignore it.

## Isolation — 03 writes and locks

Resolved the question from section 02 immediately: own writes remain visible. The price increment and rollback make the exception concrete.

New question: “PostgreSQL can reject it with a serialization failure” — does “can” mean this particular changed-row schedule necessarily fails, or that PostgreSQL might choose either result? I already know the transaction read P7, someone else committed a P7 update, and the first transaction then updates P7. I can follow the practical instruction to retry, but cannot yet predict the schedule's result confidently. This matters a little more than a terminology curiosity because the section contrasts update behaviour by isolation level. I do not need the exact error code yet.

The locking-read promise from section 01 is discharged: Read Committed can wait and return an updated row; Repeatable Read can reject a conflicting change since its snapshot. “Ordinary-read snapshot” is now a useful boundary, rather than a caveat I have to hold unexplained.

## Isolation — 04 multirow rule

The featured-display rule earns its example: I can see why two locally valid changes produce a forbidden result, and why the earlier same-row stock guard does not cover this case. I briefly wonder why putting EXISTS inside UPDATE has not made this safe; the paragraph after the code answers that exact question by distinguishing the application gap from coordination between different rows. No unresolved comprehension question here.

“Both products disabled matches neither serial order” is understandable before a formal definition because the preceding sentences actually run the two possible orders. I am not supplying isolation theory to make this step work. The example also says explicitly that hiding is unrelated to stock or deleting records.

The earlier “can reject” question remains open; this section uses “both can commit” for a schedule whose visibility has been specified, but the aid subsequently says both commit in that schedule, so the multirow case itself is clear.

## Isolation — 05 serializable

The fresh retry finding no eligible change is an important answer: I understand why “retry” is not a promise to satisfy B's initial wish. The article says what has to be repeated and why repeating only the write would be wrong. No blocker here.

Small momentary question: “For the display, imagine A finishes first. B then sees P7 disabled” — why would an overlapping B see A's change? At this point I know snapshots retain earlier views. Reading the rest of the paragraph, I resolve this as a hypothetical serial order, not a claim about the actual overlapping schedule. The phrase “either serial order” supplies the answer, but “imagine A runs completely before B” would avoid that momentary fork in interpretation.

The common-control-record alternative is denser than the worked examples but follows from knowledge already established: a shared row makes writers wait, and a subsequent Read Committed statement sees the preceding commit. Its final sentence uses the snapshot timing lesson rather than demanding another mechanism.

## Isolation — 06 choosing

I can use both questions because the preceding examples have shown the two jobs separately: consistent report reads and preservation of a write rule. “Commit without its reply reaching us” is new, but explicitly hands off to the next article. No need to answer it before following the conclusion.

## Isolation — 07 further reading

The evidence boundary is legible: the overlapping examples are documented-rule explanations, not claimed demonstrations. I do not open the sources during this reading pass. The one remaining wording uncertainty is section 03's “can reject” in its specific changed-row schedule; everything needed to follow the report and featured-display examples has been supplied.

## Waits and retries — 00 opening

The motivating distinction is clear: lack of a response does not tell me whether there is still work running, definite rollback, or a possible commit. I know enough about a purchase transaction to see why blindly repeating it can double the work. I am expecting the article to tell me how to distinguish these states, rather than merely label them. No unresolved question in the opening itself.

## Waits and retries — 01 waiting

The insufficient-stock result is correctly separated from a failed attempt. I can see why another checkout would add work rather than fix the existing wait.

Question to carry: “use a request deadline or cancellation policy” and “A server-reported timeout or cancellation needs transaction cleanup” — what is cleanup here, and does an application deadline prove the database stopped? At this point I know locks release on commit/rollback and that a lost connection during possible commit needs a later recovery path. I do not yet know whether a timed-out command leaves the enclosing transaction open. This needs an answer before I could implement the advice, but does not block following the wait example. The final sentence suggests the answer is coming.

## Waits and retries — 02 deadlocks

The cycle is understandable from the prose before the aid. The same-order repair shows why B waits before it owns the resource A needs. The article supplies SQLSTATE as an observable indication of this kind of failure; that begins answering the opening's classification problem.

Small terminology question, immediately recoverable from context: “acquire shared records” could mean a shared-lock mode rather than records both transactions need. The following P7/P8 schedule and FOR UPDATE make the intended meaning clear. “Lock records needed by both transactions in the same order” would remove that ambiguity, but I would not call it a consequential repair.

The rollback/cleanup question remains: the section says PostgreSQL aborts a transaction and releases its locks. I need the next recovery section to reconcile that with the application still doing cleanup. I can follow the deadlock outcome without that answer.

## Waits and retries — 03 known rollback

Resolved most of the cleanup question: rollback finishes a failed transaction block before a usable connection is returned; a broken connection is discarded. That explains the application's action after the database has already rejected the changes. The advice is bounded at the driver contract instead of pretending there is one API.

Question still open from section 01: does a local request deadline itself establish that the existing database attempt has stopped? The pseudocode only checks the deadline after a received 40001/40P01 rejection. That is a safe-looking boundary, but I still need to distinguish expiring a local timer from receiving a database cancellation. This matters to applying the earlier “use a request deadline” advice.

New but explicitly deferred question: what is “operation_id = original_request.checkout_token,” and how does recover_same_operation avoid a second checkout? I know the intent is preserved across attempts and process restarts, but not the mechanism. This is necessary for implementing the lost-connection branch, not for following known-rollback retry. The article's outline promises recovery next, so I carry it forward.

The mugs-then-bowls failure explains whole-transaction replay without requiring me to infer why retrying one UPDATE is incomplete. SQLSTATE 40001 also connects directly to the preceding isolation article; that article's precise “can reject” wording uncertainty remains, but the application response is now definite.

## Waits and retries — 04 unknown commit

The two histories make the missing-answer problem concrete. A new connection is correctly described as another way to ask, not evidence of rollback. K14 now has a clear purpose even though its implementation is still deferred.

Question: could the original COMMIT still be finishing when the new connection asks? The section shows two endings and promises “find or safely resume”; at this point I do not know why failing to find K14 would license resuming it. This is needed for the recovery mechanism rather than for understanding the two endings, and I expect the uniqueness section to answer it.

The local-deadline question is partially illuminated: no reply alone proves neither ending. It has not yet been explicitly connected to a local timer or cancellation request.

## Waits and retries — 05 operation identity

Resolved the section 03 token question: K14 represents the customer's intent; a single committed transaction binds it to order, stock and lines. The inserted/no-row branches explain why a replay does not reserve stock again. The comparison of customer and complete line details answers why reusing a random string cannot alone establish a matching purchase.

Question from section 04 remains specifically at “No returned row means that key already has an order”: what if the first attempt has inserted K14 but not yet committed? Does the second INSERT wait, return no row immediately, or fail? I know about row UPDATE waits and unique keys, but do not know how uniqueness handles an uncommitted competing insert. I need this answer to understand recovery while the first attempt is still finishing. The sequence works clearly for an already committed first attempt.

Momentary question resolved within this chunk: the SQL fragments do not show BEGIN/COMMIT around the fresh branch, but the prose repeatedly says “same transaction,” and the final pseudocode supplies the complete boundary and checks. No repair needed for that.

“Existing matches the complete request” follows from the preceding concrete fields. I am not forced to supply a hidden meaning of idempotency to understand the mechanism; the article has shown it without that term.

## Waits and retries — 06 recovery and effects

Resolved sections 04/05's in-progress-first-attempt question exactly: absence is inconclusive, the same unique-key insert can wait, and the following Read Committed SELECT gets a fresh view. This supplies the missing link rather than merely repeating “reuse the key.”

The statement “A retry budget expiring does not establish that an uncertain checkout failed” partially answers the remaining deadline question. I can now infer that a local timeout cannot establish rollback. The article still never says explicitly that asking for cancellation is not the same as receiving confirmation, or what to do when a local request deadline expires while the database command is active. Because section 01 recommended a request deadline/cancellation policy, a reader implementing that advice has to supply this last boundary themselves. This is my only consequential remaining gap in this article, and it needs only a short bridge, not a driver-specific tutorial.

The external-effect paragraphs establish the limit of the local unique key. “Durable work record” is an understandable sketch because it is introduced as recording an intention, and duplicate delivery is explicitly retained as a separate concern. The callback to the earlier article provides a reasonable boundary for this topic.

## Waits and retries — 07 further reading

The execution limits are again clear. I finish with the unique-key recovery sequence understood, including a competing attempt still finishing. No sources were opened, so this log records comprehension, not independent factual verification.

## Consequential findings and smallest repairs

1. Waits and retries, section 01: “use a request deadline or cancellation policy” leaves a small operational gap that later sections only answer by inference. A deadline while waiting is not the same observable event as a received rejection. Add one sentence beside the advice: a local deadline or cancellation request does not itself prove the database attempt stopped; await a known outcome/cleanup where possible, and preserve the operation as uncertain if commit may have occurred. This closes the article's classification loop at the exact place it recommends deadlines.
2. Isolation, section 03: “PostgreSQL can reject it” makes the fully described changed-row schedule sound discretionary. If that schedule is intended to establish a definite conflict outcome, say it fails with a serialization failure and retain qualifications for the general case. Verify the precise condition during repair. This is a smaller precision issue, not a breakdown of the article's central explanation.
3. Isolation, section 05: “imagine A finishes first. B then sees” momentarily resembles overlapping completion order, which conflicts with the snapshot lesson. Say “imagine A runs completely before B.” The later mention of serial order already resolves it, so this is a low-cost wording repair rather than a missing explanation.

No broader restructuring is indicated by this sequential read. Questions about own writes, retry outcomes, the identity key, and a still-finishing first claim all received concrete answers in the next relevant section. Diagram rendering and interactive behaviour were not assessed.
