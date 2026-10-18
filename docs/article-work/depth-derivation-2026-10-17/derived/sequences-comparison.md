# Sequence diagrams: the existing articles against the consolidated plan

Compared: *Sequence diagrams* (deep dive, shown as 32 minutes), *Sequence diagram
syntax: Mermaid, PlantUML and others* (companion, 10 minutes) and *Drawing
asynchronous and event-driven interactions* (deep dive, 25 minutes), against
`sequences-consolidated.md`. Figures were read from the page source and
`sequence-model.ts` / `async-scenarios.ts`: all sixteen are step-through players with
case toggles and a text list of messages.

## Summary

The existing set is accurate, plainly written and strong on the expert's hardest
material: what a caller knows after a timeout, why a retry duplicates, what order the
page promises, callbacks, overtaking and compensation. It is also about 1.7 times the
plan's length. The extra time goes on four things: a syntax companion the plan doesn't
need, a Mermaid listing after nearly every figure, mechanism that belongs to the
messaging and databases fields (broker acknowledgements, outbox claims, saga design,
webhook handling), and three overlapping review checklists. Against that, one whole
ability is thin or missing: judging a design from its diagram (round trips, fork and
stair, chatty calls, trust boundaries), along with reading other dialects such as RFC
ladders and collaboration style. The failure material is split across both deep dives
rather than gathered in one companion.

## Reading time

| | Existing | Plan |
|---|---|---|
| Deep dive | 32 min (about 7,200 words of prose and captions, 800 of code, 10 figures) | 24 min (4,370 words, 12 figures, one sample) |
| Async / failure | 25 min (about 5,700 words, 600 of code, 6 figures) | 15 min (2,710 words, 8 figures) |
| Syntax | 10 min (about 3,000 words, mostly tables) | None; a 100-word table of marks in the deep dive |
| **Total** | **67 min** (57 without the syntax reference) | **39 min** |

## Layer 1

**Sequences.** The opening says what the diagram shows and when to reach for one ("when
that order is the question"), and names waiting and the missing reply as what it
reveals. That is most of the model. Two parts are off. It says "Time runs down the
page", the global-clock reading the plan says layer 1 must avoid; the article corrects
it, but only in the order section, about 5,000 words later (Figure 2 corrects only the
duration half). And the opening never gives the diagram's cost: that it shows one run,
not all behaviour, and handles branching badly. That point first appears near the end
of the async article. The next two paragraphs then go to the repair service's cast and
a preview of the plot, which is about 200 words before any notation.

**Async interactions.** A good layer 1 for a companion: the arrows "promise less", and
reading them like a request and reply gets the flow wrong. It also says the article
won't teach broker behaviour, and then spends about 1,200 words on it (see below).

**Syntax.** Its opening states its job as a lookup page, which suits a reference.

## Part by part

"Plan" gives the consolidated part number and layer.

| Plan part | Existing | Judgement |
|---|---|---|
| 1. What it shows; its cost (L1) | Sequences opening | **Partly.** Model present; cost missing; "time runs down the page" needs to say "down each lifeline". |
| 2. When to draw something else (L1) | One opening sentence; async "Which view for a long-running workflow" (about 450 words and a table) | **Deeper than needed, wrong place.** The table re-teaches the collection's chooser. A sentence and a link to *States and lifecycles* would do. |
| 3. Participants, kinds, grouping boxes (L2) | "Actors, self-messages, notes and short-lived participants"; roles not instances in §1 | **About right**, though placed after the failure sections. Box grouping by trust boundary is covered in a sentence. |
| 4. Sync, async, reply; what each commits to (L2) | "Synchronous and asynchronous messages", Figure 3 | **At the right depth, and better than the plan.** "The two words describe the sender, not the protocol" with the `await fetch` example is the gap both planners missed. |
| 5. Activation bars (L2) | "Replies and activation bars", Figure 2 (database-time selector, clock, invented hatched waiting bar), two listings | **Deeper and slower than needed.** The plan gives a paragraph. Figure 2 also carries "height isn't time" and later the nested-timeout case, so keep a static version and drop the selector, clock and Mermaid bar syntax. About 250 words could go. |
| 6. Labels, notes, numbering, edge arrow, create/destroy (L2) | Spread across §1, "Messages with no sender" (about 300 words), "Actors…", "Making it readable" | **Covered, found messages deeper than needed.** Three ways to start a flow with no caller is fine as a paragraph, not a section. About 150 words. |
| 7. Marks and meanings (reference) | Syntax companion's "Arrows that change meaning between tools" | **Covered, but inside a 10-minute companion.** The one table readers need lives on a page they won't open. |
| 8. Framing one scenario (L2) | "How much to draw", Figure 10 (crowded against two focused diagrams) | **At the right depth and form**: a cluttered draft and its revision. **Placed late**: it follows the frames and the failure material, so readers draw for 6,000 words before learning to scope. |
| 9. Queues as lifeline or label; separate lifelines for instances (L2) | Sequences §1 (instances); async "The broker as a participant" | **Covered well.** |
| 10. What order the page promises (L2) | "Order, gaps and what a diagram leaves open" | **Right depth, good example** (the same diagram with the other order). **Late**: after lost messages, timeouts and retries. It belongs before them, as the plan has it. |
| 11. Time on the page (L2) | Figure 2 text; order section; delays in notes | **About right.** |
| 12–14. Frames, splitting, rare operators (L2, reference) | "Combined fragments": Figures 7, 8, 9 and seven listings for `alt`, `opt`, `loop`, `par`, `break`, `critical`, `ref` | **Deeper and slower than needed.** About 1,500 words and three animated players against the plan's 600 words and two static figures. One figure holding `alt`, `opt` and `loop` teaches the same. The `critical` section is worth keeping as two sentences: it's the most misread operator. About 700 words could go. |
| 15. Round trips and blocking chains; reading an RFC ladder (L2) | Blocking chains via Figures 2 and 3 and "Timeouts inside timeouts" | **Blocking: covered. Round trips and RFC ladders: missing.** Nothing teaches counting round trips on a critical path or reading a protocol specification's call flow. |
| 16. Fork and stair (L2) | Async "Orchestrated or choreographed" (saga only) | **Missing for ordinary flows.** The saga version covers half the idea in another context. |
| 17. Chatty interfaces, N+1, a hub participant (L2) | Not present | **Missing.** |
| 18. Trust boundaries (L3) | One sentence in the box paragraph; signature check in webhooks | **Thin.** |
| 19–20. Other dialects; tool keywords (L3, L4) | Mermaid's `critical` and `->>` noted; syntax companion covers Mermaid, PlantUML, D2 | **Tool dialects covered at more depth than needed. Diagram dialects missing**: collaboration style (C4 numbered), informal boxes and arrows, RFC legends. |
| 21. Sketching; writing as text (L2/L4) | Every example in Mermaid; syntax companion | **Far deeper than needed.** See below. |
| 22. Happy path misleads; which scenarios (L3) | "Draw the happy path first, then one diagram for each failure" | **About right.** |
| 23. Work that finishes later (L3) | Sequences polling loop and outbox poll; async "Webhooks and callbacks" (about 1,100 words, Figure 4) | **Core at the right depth.** "A callback is a new message" and the correlation id are exactly the plan's part, and "the callback that arrives first" is a fine application of the order rule. **Excess**: signature verification, store-first handling, provider retry policies. About 400 words. |
| 24. Fan-out; what an ack means (L3) | Async "Acknowledgement and redelivery", "Messages that keep failing", "Fan-out", "Queue or topic", "Competing consumers" (Figures 1, 2) | **Much deeper than needed.** The plan gives 200 words and a figure. The useful core is "draw the ack as its own arrow, after the work" and "subscribers' failures are separate". SQS visibility timeouts, RabbitMQ requeueing, Kafka offsets, dead-letter queues and durable subscriptions are broker behaviour for the messaging field. About 1,200 words. |
| 25. Timeouts and the three losses (L3) | "What the caller knows", Figure 5 | **At the right depth and in the best form**: one figure, three toggled cases, the inbox the caller can't see. The 5xx and gateway paragraph earns its place. The undici default (about 60 words) is HTTP-client configuration: a sentence at most. |
| 26. Retries and idempotency keys (L3) | "Retries and idempotency keys", Figure 6 | **Slightly deeper than needed.** The figure and "derive the key from the job" are right; key retention, backoff and jitter belong to the messaging field. Retry multiplication (27 attempts) is a drawing point and should stay. About 150 words. |
| 27. Races (L3) | Practice exercise (cancellation race); worker claim race; async "Ordering and overtaking" (Figure 3) | **Covered, in a good form.** Drawing the tempting interleaving and the conditional update is the plan's lesson. The exercise is the only place the race is taught as a worked example, and it comes last. |
| 28. Failing part-way (L3) | Sequences "Background workers and the transactional outbox" (Figure 4, three listings, `SKIP LOCKED`, claim leases); async dual write and "Sagas and compensation" (Figure 6) | **Deeper than needed.** The plan draws the dual write and one compensation. The existing set teaches outbox claiming and saga design. About 800 words could go to sentences and links. |
| 29. Failure walk (L3) | Sequences "Reviewing a design" (nine questions) and "Common mistakes"; async "Three questions" and "Questions to put to every arrow" | **Four overlapping lists**, about 800 words against the plan's 180. Merge into one. |
| 30. Drawing what happened; trace check (L3) | "To reconstruct an incident…"; "Keeping a diagram true" | **About right, missing one point**: timestamps from different machines can't order events. Only causal links can, which is the order rule applied to logs. |
| Long-running flows (no plan part; parts 11 and 23) | Async "Flows that last hours or days" (Figure 5, about 600 words) | **Deeper than needed.** "Write the gap in a note, show what holds the state, draw the clock as a participant" is a paragraph. |

## Material that serves no part of the plan

| Material | Where | Words (est.) | Why it goes |
|---|---|---|---|
| Syntax companion beyond the arrow-traps table | *Sequence diagram syntax* | 2,700 | Tool syntax, render locations, version history and D2 belong to the tools' docs and *Keeping diagrams useful*. Keep the arrow-traps table as a reference in the deep dive. |
| Mermaid listings repeating each figure, and the syntax prose around them | Both deep dives (23 listings) | 1,400 code + 400 prose | The plan keeps one sample. Listings could sit behind a "show source" control so they don't cost readers who don't want them. |
| Broker mechanics | Async | 1,200 | Messaging field. |
| Outbox claim mechanics (`SKIP LOCKED`, lease expiry) | Sequences | 400 | Databases or messaging field. |
| Saga design beyond one drawn compensation | Async | 450 | Messaging field. |
| Webhook handling (signatures, provider retry policies, store-first) | Async | 400 | Webhook design, not drawing. |
| Long-running flow figure and the which-view table | Async | 700 | The chooser is owned elsewhere; long waits need a paragraph. |
| Duplicate checklists | Both | 600 | One list does the job. |
| HTTP client defaults, key retention, backoff | Sequences | 200 | Sentences with links. |
| **Total** | | **about 8,450** | **About 34 minutes of reading** |

Missing material the plan would add is about 1,300 words: the layer-1 cost (80), round
trips and an RFC ladder (320), fork and stair (280), chatty calls (180), trust
boundaries (180), diagram dialects (200), clock skew (50).

## Placement

The deep dive teaches lost messages, timeouts, retries and the outbox before it teaches
what order the page promises, how to scope a diagram, or the frames. Those failure
sections don't depend on the order rule, so nothing reads wrong, but the reader gets
layer 3 before half of layer 2. The plan's split gathers the failure material in one
companion. The existing split puts timeouts, retries and the outbox in the deep dive,
and brokers, overtaking, callbacks and sagas in the async article.

The figures' form fits the failure cases well: one player with toggles shows three
histories faster than three static figures would. It's slower than needed for plain
notation (Figures 1, 7, 8, 9), where the reader presses play to see four arrows a static
drawing shows at once.

## Accuracy

Checked against primary sources. Most claims hold, including UML's `alt`, `loop(1,30)`,
`critical` and lost and found messages; Mermaid's arrows, `box` colours and
create/destroy from 10.3; undici's 300-second header timeout; Resend's 24-hour key
retention; SQS's 30-second default visibility timeout and best-effort ordering; Stripe's
three-day retries; and the Azure compensating-transaction points (order, parallel undo,
idempotent steps, points of no return).

- **Overstated: "the call to the broker is synchronous"** (sequences, "Synchronous and
  asynchronous messages"; async, "The broker as a participant"). RabbitMQ's publisher
  confirms are opt-in (`confirm.select`) and "emitted asynchronously"; without them a
  publish gets no reply. Kafka producers send asynchronously and can be configured
  with no acknowledgement at all. The accurate claim is narrower: draw the publish as a
  call when the publisher waits for a broker acknowledgement, and say so.
- **"Time runs down the page"** (sequences opening). Not false as a first gloss, but
  it's the reading the article later has to undo. "Read each lifeline downward" costs
  nothing more.
- **Mermaid's `-x` as "a lost message"** (syntax tables). Mermaid documents it only as
  a line ending in a cross, and in UML a cross marks a lifeline's destruction. Using it
  for loss is a reasonable convention, and the page should say it's one.
- **"Postmark retries on any non-2xx response"** (async, webhooks). Postmark's
  documented rule, for inbound webhooks, is any response other than 200, and a 403
  stops retries. I found no stated rule for bounce webhooks. This is minor, but it's a
  product claim the article doesn't need.

## Verdict

**Restructure with targeted cuts and additions, not a rewrite.** The prose, the
running example and most figures are sound, and several sections (sender-not-protocol,
the three losses, the order rule, callbacks as new messages, the race exercise) are at
exactly the depth an expert needs. The problems are scope and arrangement:

1. Move timeouts, retries and the outbox's failure case from the deep dive into the
   async article, making it the single failure-and-asynchrony companion, and merge
   the four checklists into one failure walk.
2. Cut broker, outbox, saga and webhook mechanics to sentences that link to the
   messaging and databases fields; cut the long-running figure and the which-view
   table to a paragraph.
3. Add a "reading a design" section to the deep dive (round trips from an RFC ladder,
   fork and stair, chatty calls, trust boundaries) and a paragraph on dialects.
4. Put the opening right ("down each lifeline", plus the one-run cost), and move
   framing and the order rule ahead of the frames.
5. Retire the syntax companion or reduce it to a reference table; collapse the
   listings behind a source toggle; make the notation figures static.

That would bring the set from 67 minutes to about 40, close to the plan, without
losing anything the plan asks for.
