# Sequence trio: informed technical and coverage review, 17 October 2026

Articles reviewed, as rendered on the local dev server and in source on branch
`voice-reference-articles` (uncommitted working tree):

- `src/pages/learn/drawing-systems/sequences.astro` (parent deep dive)
- `src/pages/learn/drawing-systems/async-interactions.astro` (deep dive)
- `src/pages/learn/drawing-systems/sequence-syntax.astro` (companion)
- Figures: `src/components/explainers/sequences/sequence-model.ts`, `async-scenarios.ts`

Reader: a working engineer who draws and reads sequence diagrams in design docs and
reviews, including asynchronous systems. Boundary: the async article teaches how to draw
these flows and what each drawing claims, not broker semantics.

No article was edited. Label: **repair required**. Nothing found is a structural failure,
but several listings and one figure teach the opposite of their own prose, and the async
article overclaims one broker behaviour.

## 0. Expected topic tree, written before reading the outlines

| Part | Expected owner |
| --- | --- |
| What a sequence diagram is for, when to reach for one, when another view is better | Parent |
| Lifelines as roles, instances, naming, order, actors, boxes, symbols | Parent (syntax in companion) |
| Call, reply, async message; "synchronous" describes the sender; when replies can go | Parent |
| Activation / execution specification; who waits | Parent |
| Lost **and found** messages; error reply vs silence; timeouts; nested deadlines | Parent |
| Retries, idempotency keys, crash between two arrows | Parent |
| Order: only along a lifeline and send-before-receive; overtaking; gaps; time notes; numbering | Parent (overtaking drawn in async) |
| Fragments: alt/opt/loop(bounds)/par/break/critical/ref; rarer operators; nesting | Parent |
| Diagrams with no human caller: timers, polls, schedulers as triggers | Parent introduces, async develops |
| Scope: one question, one level, splitting with ref; readability | Parent |
| Reviewing a design; reconstructing incidents; keeping diagrams true | Parent |
| Broker as participant vs plain arrow; queue vs topic; competing consumers | Async |
| Ack placement, redelivery, duplicates (with and without failure), dead letters | Async |
| DB write plus publish (dual write) and how the drawing shows it | Async (links parent's outbox) |
| Fan-out and independent failure; durable vs non-durable subscription as a drawing claim | Async |
| Ordering claims per key; stale reads | Async |
| Webhooks/callbacks as new messages; correlation; early callback; missing callback | Async |
| Async request-reply over HTTP (202 + status resource, poll or callback) | Async or parent's loop |
| Long-running flows, timers, sagas and compensation; when to switch to state/process views | Async |
| Mermaid vs PlantUML constructs, arrows that change meaning, version gates, where each renders, other tools | Companion |

Comparison: the three articles cover almost all of this, with sensible ownership. The
gaps against this tree are found messages in the parent, a single convention for
timer-triggered flows, the dual write in the async broker section, duplicates without
failure, and the log-based ("our Kafka flow") ack. They are listed below with the other
findings.

## 1. Parent: Sequence diagrams

### Accuracy (ranked)

**P-A1. The critical listing shows the use the section says not to make.** The prose
says to use `critical` only when "no other message may come between these ones". It
also says Mermaid's option sections are a looser reading. The listing then uses
`critical Claim a job … option no job is free`, which is Mermaid's must-happen-with-fallback
reading. A reader copies the listing, not the warning. There is a second problem.
"UML has no option sections" is stronger than the spec. UML 2.5.1 §17.6.3.14 defines
critical only as a region that "cannot be interleaved by other OccurrenceSpecifications
(on those Lifelines covered by the region)". The constraint `opt_loop_break_neg` (§17.12)
limits opt, loop, break, assert and neg to exactly one operand. It does not mention
critical. UML doesn't forbid more operands. It just gives fallback sections no meaning.
*Repair:* replace the listing with a single-operand critical region that makes a real
non-interleaving claim, or caption it as "Mermaid's documented usage, which means
something else". Reword to "UML gives a critical region no fallback sections; it only
forbids interleaving".

**P-A2. "Mermaid attaches no meaning of its own to its arrows" is contradicted by its
docs.** The Mermaid sequence page (fetched 17 Oct 2026) describes `-)` as "Solid line
with an open arrow at the end (async)". It leaves `->>` as "Solid line with arrowhead".
The claim appears twice: in "Synchronous and asynchronous messages" and again in the
closing Mermaid section. *Repair:* "Mermaid's documentation names `-)` the async arrow
but describes `->>` only as a solid line with an arrowhead. Reading it as a synchronous
call is the UML convention this article follows."

**P-A3. "This article has met several gaps: … a found message".** The parent never
defines a found message. The only definition is in the async article's webhook section.
The PlantUML listing then "adds a found message" (`[-> Worker`) to an unprepared reader.
UML defines lost and found as a pair, side by side (§17.4.4: black circle at the arrow
end or at the starting end). *Repair:* one or two sentences in "Lost messages and
timeouts" defining a found message and naming its use, such as a timer or another
system's request whose sender is out of scope. Then the async article can link to it
instead of defining it.

**P-A4. Figure 2 and its listing draw the late 201 as received.** "Timeouts inside
timeouts" says the API sends 201 "to a browser that has left". But the figure
(`waiting` scenario, `kind: 'reply'`) and the listing (`API-->>UI`) both end the arrow
on the browser's lifeline, which by the article's own rules means it was received. When
`fetch` aborts, the connection closes and nothing receives the 201. *Repair:* draw it
with the article's lost notation (`kind: 'lost'`; in Mermaid `API--xUI: 201 Created: R17`
plus the existing note). Figure 5's "Provider is slow" case has the same issue with
"202 Accepted, at 14 s". Draw it lost too, or add a "nobody is listening" note as
Figure 3 does.

**P-A5. The cancellation race gives instance B knowledge it doesn't have.**
`B-->>Tech: 409 Already cancelled`. B only learns `0 rows changed`. It doesn't know why
unless it reads the row again or uses `RETURNING`. Given the article's emphasis on what
each participant knows, this matters. *Repair:* label it `409: not Approved any more`,
or add a re-read.

**P-A6. Smaller wording errors.**
- "break adds the cap and removes the wasted wait". In the break section the cap moves
  into the loop's guard (`loop up to 30 times`). break only removes the wait. Say
  "A cap in the guard and a break fix both".
- alt: "the one whose guard is true". UML allows several true guards, with one operand
  chosen (§17.6.3.7). Use "one whose guard is true".
- The intro says PlantUML appears "beside it where Mermaid can't draw what the diagram
  needs". It appears once, at the end. Say "with PlantUML at the end for what Mermaid
  can't draw".
- 5xx (flagged claim): accurate. RFC 9110 §15.6 defines 5xx only as the server erring
  or being unable to perform the request, not as proof that nothing happened. The text
  would be stronger with the clearest case: a 502 or 504 from a gateway in front of the
  provider, where the upstream may have finished the work. One clause.

**Verified as stated** (UML 2.5.1 PDF, chapter 17, read directly): lost message as a
filled circle at the arrow end; async open head and sync filled head; reply dashed;
execution specification; interaction use; `loop(minint, maxint)` with `loop(1, 30)`
read as min 1, max 30; neg as invalid traces; break replacing the rest of the enclosing
fragment; par interleaving; and the operator list seq, strict, neg, assert, ignore,
consider. Also verified: Mermaid create/destroy from 10.3.0, and only the receiver can
be created; Mermaid box doesn't support hex colours (docs say so explicitly); Resend
keeps keys for 24 hours; undici 300 s header timeout. On `autonumber 10 5`, the docs now
head that feature "v11.15.0+", but the syntax evidence shows it rendering from 11.1.0.
The parent is right. Add "despite the docs' heading" so a reader who checks isn't confused.

### Coverage and depth

**P-C1. Diagrams with no human caller get three unreconciled conventions.** The parent
starts the worker with `Note over Worker: Poll timer fires` plus `activate`. Its
PlantUML listing uses a found message `[-> Worker`. The async article says "Draw the
clock as a participant" (Scheduler). Each is defensible, but no article says when to use
which. This is a frequent design-doc question (cron jobs, pollers, scheduled
reconciliation). *Repair:* a short paragraph in the parent, beside the new found-message
sentence: use a note when the trigger is incidental, a found message when its source is
out of scope, and a scheduler lifeline when the timer's own behaviour (cancel,
reschedule, firing late) matters. Link that last case to the async article's 48-hour flow.

**P-C2. The order section carries an unrelated topic.** "Order, gaps and what a diagram
leaves open" also teaches `autonumber`, which is about discussion and readability. A
reader looking for numbering won't look under order. *Repair:* move the autonumber
paragraph to "Making it readable", which already says "Number the steps".

**P-C3. Over-long: the closing "Mermaid, PlantUML and what Mermaid can't draw".** About
350 words plus a PlantUML listing that repeat the companion's "What each tool can't draw"
(see R1). The version detail in "Actors, self-messages, notes…" ("needs Mermaid 11.11 or
later: the same line fails to parse on 11.4.1 and parses on 12.2.0") is companion
material too. *Repair:* keep two sentences and the link, and let the companion own the
lists and the PlantUML example. Keep the "every listing parses on 11.4.1 and 12.2.0"
line.

Depth elsewhere is well matched: the failure sequence (sync to outbox to lost to retry),
fragments, scope and review all give the reader something they can use. Nothing else is
under-served.

## 2. Async: Drawing asynchronous and event-driven interactions

### Accuracy (ranked)

**A-A1. Fan-out redelivery to a down subscriber is stated as a property of topics. It
depends on the product and configuration.** The relevant passages:
- "Billing hears about A5 twenty minutes later, from the topic's redelivery"
- Figure 2's "Billing is down" case, which draws a lost delivery and then "Scheduled A5 (again)"
- the exercise discussion: "billing receives the event on redelivery an hour later"

This holds only for a durable subscription, such as a queue per subscriber, a Kafka
consumer group, or SNS to SQS. It fails for non-durable subscribers (Redis pub/sub,
non-durable JMS or MQTT subscribers) and for push delivery whose retry policy runs out.
This is exactly the kind of semantics the brief says the article shouldn't assert.
*Repair:* one sentence plus a matching caption and discussion: "if billing's subscription
is durable, which is a property of the product and its setup, so write it in a note,
billing receives A5 when it returns; if not, A5 is gone". The "Competing consumers or
subscribers" paragraph already mentions a private queue per subscriber. Point to it.

**A-A2. The ordering listing contradicts its own note.** The note says `Ordered per
appointment id`, and the listing then delivers `Cancelled v3` before `Moved v2`, both
for A5, with no redelivery drawn. A reader concludes that per-key ordering doesn't hold
at all. *Repair:* change the note to the claim the figure makes, for example
`No ordering promise (e.g. SQS standard)`. Or keep the note and draw the redelivery that
breaks it, as the prose describes.

**A-A3. Error replies are drawn as lost messages in the listings.** In the 48-hour
listing, `API--xMina: 409: A5 released`. In the saga listing, `Billing--xBooking: Declined`.
The parent teaches `-x` as Mermaid's stand-in for a lost message, and says an error
reply "is a reply, so draw it as one". The animated figures already draw both as dotted
error replies. *Repair:* use `-->>` in both listings.

**A-A4. Duplicates are presented as coming only from crashes and deadlines.** The ack
section implies a second delivery needs a crash, a closed connection or an expired
deadline. SQS standard queues document at-least-once delivery, where "more than one copy
of a message might be delivered" with no failure. The visibility-timeout page adds that
a message can be delivered more than once within the timeout. Stripe documents duplicate
webhook deliveries. *Repair:* one sentence in "Acknowledgement and redelivery": some
brokers can deliver a copy twice even when nothing failed (SQS standard says so). The
idempotency key covers both cases.

**A-A5. Smaller points.**
- The stale-read paragraph says "The polling loop in the sequence article is the usual
  fix", but the linked `#loop` section polls a status and never discusses projections or
  stale reads. Polling is one remedy. Reading from the source of record after a write is
  at least as common. *Repair:* "one fix is to poll until the update shows, as in the
  loop example". Or name both remedies without the link.
- On correlation ids, "Some providers let you attach your own reference": Postmark is
  itself one of them. Its bounce payload includes `Metadata`, "Custom data that was
  included in the email". *Repair:* "Postmark returns both its MessageID and any
  Metadata you sent".
- In SQS the ack is `DeleteMessage`, a call with a reply. Drawing it as an open arrow
  fits RabbitMQ's `basic.ack` but hides that a failed delete also causes redelivery.
  A note is optional.

**Verified as stated:**
- SQS: stores redundantly in multiple AZs "before acknowledging it"; visibility timeout
  default 30 s; ChangeMessageVisibility; DLQs; standard queues "may occasionally arrive
  out of order" (docs fetched 17 Oct).
- Stripe: up to three days of retries in live mode; no ordering guarantee; track event
  ids; return 2xx before complex logic; fetch missing objects (fetched).
- Postmark: "retries on any non-2xx response or when your endpoint times out"; MessageID
  in payload; `X-PM-Webhook-Trace-Id` header (fetched).
- Azure compensating transaction: not exactly reverse order, some steps in parallel,
  record progress, idempotent steps, and "points of no return", where irreversible steps
  come only after critical validations (fetched).
- Richardson's saga page: lack of isolation as a drawback (fetched).
- Kafka per-partition order and the RabbitMQ requeue on channel or connection close:
  consistent with the vendor docs as I know them, but not re-fetched in this review.

### Coverage and depth

**A-C1. The broker section silently drops the parent's outbox guarantee.** The parent
spends a section on why the booking and job J9 must commit together. The async article
then has the API "publish J9 to an email queue" with no database write in the picture.
A reader may conclude that a queue replaces the outbox. In fact a commit followed by a
separate publish reintroduces the gap: a crash between the two gives a booking with no
email, and publishing first gives an email for a booking that rolled back. Richardson's
saga page lists "atomic updates and messaging" as an issue that needs an outbox. This is
a claim about the drawing, not broker theory. *Repair:* a short paragraph and a
three-line listing in "The broker as a participant". Draw `INSERT booking`, `COMMIT`,
`Publish J9` as separate arrows and ask the parent's question, "where does a crash
between two arrows leave the data?". Then point to the outbox (a relay that reads the
outbox table and publishes) as the usual answer.

**A-C2. No log-based ack, though the brief's reader arrives with "our Kafka flow".**
"Receives, does the work, tells the queue it is finished" fits SQS and RabbitMQ. In a
log, the consumer commits an offset that covers every earlier message, so a crash
replays everything since the last commit. Without this, a Kafka reader draws per-message
acks that misstate what a crash costs. *Repair:* two sentences and a label convention,
for example `Commit offset 42 (acks all before it)`, sending the reader to Kafka's
consumer documentation. Stay inside the boundary.

**A-C3. Async request-reply over HTTP (202 Accepted plus a status resource) isn't
named.** It is probably the most common asynchronous flow in API design docs. The parent
has the polling loop, and this article has the webhook, but neither connects them as two
ways to deliver the same deferred result. *Repair:* one paragraph at the start of
"Webhooks and callbacks": the result comes back by polling (link the parent's loop) or by
callback, and the drawing differs in who sends the last arrow. A useful extension, not
essential.

**A-C4. The figure and prose disagree on the 48-hour flow's state.** The prose says
"Draw that write, or the reader will assume an object lives in memory for two days". The
figure and the listing record it as a note (`Row saved: …`) with no database lifeline.
*Repair:* reword to "Show that write, as an arrow to the database or a note that names
the row". Or add the DB lifeline to the figure. The first is smaller.

**Over-long:** "Questions to put to every arrow" repeats the opening "Three questions"
almost word for word in its first two rows, and its fifth row repeats "When no callback
comes" ("A missing arrow is the hardest thing…" appears twice). *Repair:* point the
table's opening sentence back to the three questions and drop the repeated sentence.

The webhook, saga and which-view sections are well calibrated and are the article's
strongest teaching.

## 3. Companion: Sequence diagram syntax

### Accuracy (ranked)

**S-A1. The frames table defines critical with the meaning the parent calls a
misreading.** The row reads "A region whose steps happen together, with fallbacks" and
links to the parent's `#critical`, which says critical means no interleaving and that
UML gives it no fallback sections. *Repair:* "A region no other message may interleave
(Mermaid adds fallback cases)". Keep the syntax columns.

**S-A2. The opening booking puts a timeout on a message nobody waits for.** The API
sends `-)` (asynchronous) and answers Mina. Then
`Note over API,Provider: No reply within 10 s: outcome unknown`. Under the parent's
teaching (Figure 3: "Nobody is waiting for this reply"), no one is timing out here. A
reviewer who has read the parent will flag the drawing as wrong. *Repair:* change the
note to `Nobody waits for this reply`. Or make the provider call synchronous from a
worker. The first keeps the listings' purpose.

**S-A3. Release mismatch.** The version table says participant types were "Rejected by
11.4.0". The parent says "fails to parse on 11.4.1", and the evidence file records 11.4.0
and 11.1.0. *Repair:* align the parent with the evidence (11.4.0), or record the 11.4.1
render in the evidence file.

Everything else checked against `docs/article-work/sequence-syntax/evidence.md` and the
Mermaid page holds:
- arrow table and traps
- `par … else` and `critical … else` in PlantUML
- destroy position
- `#` entity handling
- version table (with the useful finding that the docs' 11.12.3 tag is a release early)
- GitHub's four syntaxes
- GitLab "Mermaid version 11"

### Coverage and depth

**S-C1. "Where each one renders" leaves out where this reader's design docs live.** The
reader writes design docs and reviews. Confluence, Notion and Google Docs are at least as
likely destinations as Sphinx or Asciidoctor, and the table is silent on them. *Repair:*
check and add rows for Confluence (marketplace apps), Notion (Mermaid in code blocks) and
Google Docs. If unchecked, add one sentence saying they weren't checked. Verify before
writing; I haven't.

**S-C2. "and others" covers D2 and draw.io only.** ZenUML (which Mermaid embeds as a
separate diagram type) and sequencediagram.org / WebSequenceDiagrams are common in design
docs. The evidence file says sequencediagram.org was "not checked, not mentioned". This
is a useful extension rather than essential. A sentence naming them as unchecked would
make the title honest.

Depth is right for a companion. The trap list and version table are the parts a reader
will return to.

## 4. Repetition and ownership across the trio

Ranked by cost to the reader:

**R1. The list of what Mermaid can't draw, and a PlantUML example, appear in both the
parent and the companion.** The parent's closing section lists ref, found message,
circle, delay and slanted arrow, then gives a PlantUML listing. The companion's "What
each tool can't draw" covers the same ground in more detail. The companion should own
it, as in P-C3.

**R2. Delay notes are taught four times:**
- the parent's order section ("Mermaid has no delay marker, so put a note across every
  lifeline … PlantUML has …")
- the parent's closing section
- the async "Flows that last hours or days" ("Mermaid has no marker for a delay, so a
  note across the lifelines is the idiom")
- the companion

*Repair:* in the async article, cut to "write the gap in a note across the lifelines".
It already links the parent for the scale point.

**R3. The ordering rule is restated.** The async "Ordering and overtaking" first
paragraph re-teaches the parent's two rules: along a lifeline, and send-before-receive.
*Repair:* one sentence plus a link to the parent's `#order-gaps-and-time`, then go
straight to "With asynchronous messages it becomes the point of the diagram".

**R4. "Vertical distance shows order, not elapsed time" is said twice in the parent.**
It appears under Figure 2 and again in the order section ("A diagram has no scale
either…"). The second can start from the first: "As Figure 2 showed, …".

**R5. Broker as a sync call plus async delivery.** The parent's sync/async section and
the async broker section both teach it. The parent's sentence is fine as a preview. The
async article's longer version is the owner. Acceptable; no repair needed unless the
parent is trimmed further.

**R6. Within the async article, the three questions and the questions table overlap**
(above).

**Cross-links.** Every in-page and cross-article anchor in the three pages resolves
(checked against the rendered HTML). Semantic landing:

| Link | Lands on | Verdict |
| --- | --- | --- |
| Parent's Common mistakes → `#webhooks-and-callbacks` | Correct section | Good |
| Parent → broker, redelivery and fan-out anchors | Correct sections | Good |
| Parent's "Messages can also overtake … covers how to draw it" | Async ordering section (version labels, swapped delivery) | Good |
| Async → parent `#replies-and-activation-bars` for "vertical distance shows order" | Where the point is taught | Good |
| Async "polling loop … is the usual fix" for stale reads → parent `#loop` | Never mentions stale reads | **Doesn't land** (A-A5) |
| Companion critical row → parent `#critical` | Contradicts the row's meaning | **Contradicts** (S-A1) |
| Parent "a found message" in its list of met gaps | No definition anywhere in the parent | **No target** (P-A3) |

## 5. Figures

Checked in source and against the prose. The renderer draws the lost kind as a filled
circle partway along the arrow, matching UML, and the error kind as a dotted coral reply.

| Figure | Finding | Repair |
| --- | --- | --- |
| Parent Fig 2, Who is waiting | Timeout case is correct in timing and status, but the late 201 lands on the browser's lifeline (P-A4). "Browser gives up after 2 s" changes nothing unless the DB is set to 3 s. Readers who try 2 s first see no effect. | Draw the late 201 as lost. Optionally have the caption say the 2 s limit only bites with the 3 s write. |
| Parent Fig 4, Provider down | 503 drawn as an error reply: consistent with the prose | — |
| Parent Fig 5, slow | Late 202 drawn as a normal reply to a worker that gave up | Lost kind, or a note |
| Parent Fig 10, scope views | Counts are right: seven lifelines, thirteen valid-path messages, ref frames in the focused views. On narrow screens the header shows **GW**, **Web** and **Email**. The scenario overrides the shared short "Gateway" with "GW", and "Email" for the provider reads like a message. The dense view also renames Browser to "Web app" and Notification worker to "Job worker" without saying why, so it looks like different participants from every other figure. The alt frame stretches to the worker lifeline, which has no part in the token check. | Drop the `short: 'GW'` override (use "Gateway"); use "Provider". Keep Browser and Notification worker. End the alt frame at the Repair API. |
| Async Fig 1, ack | Shows the three ack cases faithfully | Optionally note that SQS's ack is a delete call (A-A5) |
| Async Fig 2, fan-out | "Billing is down" draws a lost delivery, then a redelivery, which assumes push delivery and a durable subscription (A-A1). With pull-based brokers there is no lost arrow at all; the event waits. | Caption: "with a durable subscription"; consider drawing the down case as a note "A5 waits for billing" rather than a lost arrow |
| Async Fig 3, overtaking | The figure is right. The listing's note contradicts it (A-A2). | Fix the listing note |
| Async Fig 4, webhook | All three cases match the prose. "Next matching pass" has no visible trigger. | Fine as is; optionally "Matching job runs" |
| Async Fig 5, 48 hours | "Reminded" summary says it "cancels the release timer" while the arrow says "Cancel timers". The write the prose asks for is drawn as a note (A-C4). | Align the label; reword the prose |
| Async Fig 6, saga | **"Declined, release lost" draws the request as lost**, so Inventory never receives the first release. The prose says "the inventory service has to cope with seeing the release twice", which this figure can't show: the retry is harmless, exactly as in the parent's Figure 6 request-lost case. | Lose the reply instead: Inventory releases P3, `Released` is lost, the booking service retries, and Inventory sees the release twice |

## 6. Summary of repairs by size

One-line or label fixes:
- P-A2, P-A5, P-A6
- A-A2, A-A3, A-A5
- S-A1, S-A2, S-A3
- Fig 10 labels; Fig 5 (async) label

Paragraph-sized:
- P-A1 (critical listing and wording)
- P-A3 with P-C1 (found messages and timer triggers)
- A-A1 (durable subscription)
- A-A4 (duplicates without failure)
- A-C1 (dual write)
- A-C2 (offset commit)
- P-C3 with R1 (trim the parent's closing tool section)

Figure logic:
- P-A4 (Figs 2 and 5 lost replies)
- Async Fig 6 (lose the reply, not the request)

Useful extensions, not blocking: A-C3 (202 and poll vs callback), S-C1 and S-C2 (render
destinations, other tools).

Remaining uncertainty:
- Kafka and RabbitMQ claims were not re-fetched.
- Confluence, Notion and ZenUML rendering are unverified.
- The parent's claim that engineers often draw critical around a transaction is
  plausible but unsourced. That is acceptable as framing.
