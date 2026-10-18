# Drawing asynchronous and event-driven interactions: brief and topic tree

Deep dive, `src/pages/learn/drawing-systems/async-interactions.astro`. Plan source:
`docs/article-work/sequences/coverage-map-2026-10-17.md` section 5 (B1). Drafted 17 October 2026.
Draft, not published: the collection entry in `src/lib/drawing-collection.ts` is the
coordinator's to add.

## Reader and job

A working engineer who already draws request-and-reply sequence diagrams (the parent,
`sequences.astro`) and now has to draw "our Kafka flow", a webhook integration, or a
workflow that spans days. They arrive with one worry: an arrow that looks like the
request diagrams but promises much more or much less. They leave able to (1) choose what
the broker, the fan-out, the acknowledgement and the callback must look like, (2) say in
the drawing what it claims and what it leaves open, (3) tell when a sequence diagram has
stopped being the right view.

Boundary. This article teaches how to draw these flows and what each drawing commits to.
It does not teach broker semantics or distributed-systems theory (the shared programme is
parked). Where a drawing depends on a guarantee, the article says which question the
drawing must answer and sends the reader to the vendor or standard documentation for the
actual behaviour, with the product named.

## Topic tree (derived from the subject and reader, before reading the parent body)

What a working engineer needs to draw and read an asynchronous flow:

1. **What changes when the sender does not wait.** The reply no longer carries the
   outcome; the arrow has to say who holds the message, how the sender learns, and what
   happens if nothing arrives. Three questions per arrow. (Parent keeps sync vs async
   arrowheads; this article adds the questions.)
2. **The broker (queue, topic) in the picture.**
   2.1 A send to a broker is a synchronous call to the broker plus an asynchronous delivery.
   2.2 Draw it as a participant when its behaviour changes the outcome (acknowledgement,
       retention, redelivery, ordering); draw a direct async arrow when it does not.
   2.3 Queue (one consumer gets each message) vs topic (every subscriber gets it) as drawn.
3. **Acknowledgement and redelivery.**
   3.1 Delivery, work and acknowledgement are three separate messages; where the ack sits
       decides what a crash costs.
   3.2 Crash before ack = redelivery = a duplicate; crash after ack but before the work
       finished = lost work. Same picture as the parent's worker crash.
   3.3 Consumer must be safe to run twice (link to the parent's idempotency key).
   3.4 Poison messages and dead-letter queue: a branch the drawing should show once.
4. **Fan-out to several consumers.**
   4.1 One publish, one arrow per subscriber, no order between them.
   4.2 Independent failure: one consumer down does not change the others or the publisher.
   4.3 The publisher does not know its subscribers: what the drawn list is (documentation
       of today's subscribers, not a dependency the publisher holds).
   4.4 Competing consumers of one queue vs subscribers of one topic.
5. **Ordering and overtaking.**
   5.1 Vertical order is only guaranteed along one lifeline and from send to receive.
   5.2 Overtaking: two messages sent in order, received swapped; draw the order *received*
       at the consumer and say what ordering the design relies on (per key? at all?).
   5.3 What the consumer does about it (version or sequence number): a design question
       the drawing exposes; semantics sent to Kafka/SQS docs.
   5.4 Read-your-write on a projection (stale read) named, linking the parent's loop.
6. **Callbacks and webhooks.**
   6.1 A request now and a result hours later from the other side: the callback is a new
       message, not a reply.
   6.2 Correlation id: where it is created, where it is stored, where it is read.
   6.3 The race: the callback arrives before the id was saved.
   6.4 The receiver's side: verify, return 2xx, then work; the provider's retries mean
       duplicates (vendor docs).
   6.5 Silence is not success: no bounce does not mean delivered.
   6.6 Found messages: Mermaid cannot draw one; what to do.
7. **Flows that last hours or days.**
   7.1 Draw the gap and say what holds the state across it (a row, a timer) and what wakes
       the flow up (a timer message, an event).
   7.2 A scheduler/timer as a participant.
   7.3 What happens to a reply that arrives after the deadline passed.
   7.4 Splitting one long flow into linked diagrams (parent's `ref` idiom).
8. **Sagas and compensation as sequences.**
   8.1 Forward steps; one fails; compensation messages run in reverse as new messages.
   8.2 Compensation is not rollback: other readers saw the intermediate state.
   8.3 Compensation can fail and must be repeatable; points of no return.
   8.4 Orchestrated (one coordinator participant) vs choreographed (a chain of events):
       how each looks in a sequence diagram.
9. **When a state or process view serves better.**
   Sequence diagrams show one run; a long-running workflow needs "what can happen next at
   any moment" (state) or "who owns the wait" (process). Rules for choosing, and how the
   views are kept consistent (each transition names the message that causes it).
10. **Reviewing an asynchronous diagram.** Questions to put to every arrow (what if the
    consumer is down, if it runs twice, if it arrives late, if it never arrives).
11. **Practice** with discussed answers (every sibling ends with one).

## Where each part lives

| Part | Home | Depth |
| --- | --- | --- |
| 1 | opening + short section | paragraph and the three questions |
| 2 | section "The broker as a participant" with two small listings | section, h3 for queue vs topic |
| 3 | section "Acknowledgement and redelivery" + Figure 1 | full section, h3 for the three ack positions and for dead letters |
| 4 | section "Fan-out" + Figure 2 | section, h3 competing consumers |
| 5 | section "Ordering and overtaking" + Figure 3 | full section |
| 6 | section "Webhooks and callbacks" + Figure 4 | largest section: it is the commonest mistake (callback drawn as a reply) |
| 7 | section "Flows that last days" + Figure 5 | section |
| 8 | section "Sagas" + Figure 6 | section, h3 orchestrated vs choreographed |
| 9 | section "Which view for a long-running workflow" + table | section |
| 10 | section "Questions to ask of every arrow" (table) | short |
| 11 | "Try a different flow" | practice |

Left to the parent (linked, not repeated): the arrowheads, "the sender waits" definition,
outbox and worker polling, lost message vs timeout, idempotency key mechanics, combined
fragments, Mermaid syntax table. Left to `vocabulary.md`: the whiteboard queue and topic
symbols.

## Left out on purpose

- Broker semantics (delivery guarantees, partitions, consumer groups, exactly-once claims,
  retention): parked; sources named instead.
- Event sourcing, CQRS, stream processing topologies: other drawing questions.
- Workflow engines (Temporal, Step Functions, BPMN engines): named only as the thing that
  holds saga state; no product teaching.
- Security of webhooks (signing, replay): one sentence and a vendor link.
- A messaging field: does not exist. No claim that it will.

## Running example

The repair service from the parent (Mina, R17, job J9). New pieces: the email provider's
202 carries a message id (invented value `m-481`) and later posts a bounce webhook; the
scheduling service publishes `AppointmentScheduled` / `AppointmentMoved` /
`AppointmentCancelled` events consumed by the technician app and billing; Mina has 48 hours
to confirm an offered slot (invented policy); a booking saga reserves a slot, a part and a
deposit (invented). All names, ids, timings and policies are invented teaching values.

## Figures (all `SequencePlayer`, scenarios in `async-scenarios.ts`)

1. Acknowledgement and redelivery (3 cases).
2. Fan-out (healthy / billing down / technician app slow).
3. Overtaking (in order / swapped x consumer checks version or not).
4. Webhook with correlation id (normal / early and dropped / early and retried).
5. A 48-hour confirmation (replies in time / after the reminder / never).
6. Booking saga (accepted / declined / declined and a release fails first).

Mermaid listings accompany most figures. Mermaid has no found-message arrow, no delay
marker and no `ref`; the article says so and shows the note idiom.

## Evidence record (checked 17 October 2026)

- SQS standard queues: at-least-once, duplicates possible, best-effort ordering
  (docs.aws.amazon.com SQS standard queues). Visibility timeout default 30 s; unprocessed
  message becomes visible again; FIFO ordering is per message group ID.
- RabbitMQ consumer acknowledgements: unacked deliveries requeued when the channel or
  connection closes; `redelivered` flag; consumers should be idempotent. Publisher confirms
  exist and may arrive out of order.
- Kafka intro: events with the same key go to the same partition; a consumer reads a
  partition's events in the order written.
- Stripe webhooks: retries for up to three days in live mode; no ordering guarantee; track
  event ids for duplicates; return 2xx quickly before complex logic.
- Postmark bounce webhook: payload carries RecordType, MessageID, Type, Email, BouncedAt;
  retries on non-2xx or timeout; schedule not documented on that page.
- Saga (microservices.io): sequence of local transactions; compensating transactions must
  be designed; lack of isolation. Azure compensating transaction pattern: compensation may
  fail so make it idempotent; not always exact reverse; define points of no return.
- Mermaid: `--)` open arrow (async); `box`; `rect`; notes over several participants;
  `autonumber` start/increment from v11.15.0; no delay or found-message syntax.
- Recalled, not read: UML 2.5.1 weak sequencing wording (unchanged from the coverage map's V
  marks). The article states only the weaker, widely documented claim: order is drawn, but
  guaranteed only per lifeline and send-before-receive.
- Not verified: the exact Kafka consumer-group assignment rules and delivery semantics;
  the article does not claim them.

## Uncertainties for the coordinator

- `async-scenarios.ts` registers into `scenarios` from `sequence-model.ts`; this needs
  `export class Builder` there and an import in `SequencePlayer.astro`. Both are one-line
  edits; the parent's deepening agent also works in these files.
- The deck of cross-links assumes sibling pages exist under their current slugs.

## Restructured, 18 October 2026

Now *Failure, asynchrony and races in sequence diagrams*, the single failure companion to
*Sequence diagrams*. Timeouts, retries and the outbox's failure cases moved in; broker,
saga and webhook mechanics were cut to sentences. See
`docs/article-work/sequences/restructure-2026-10-18.md` and the coverage map in
`docs/coverage/drawing-systems.md`.
