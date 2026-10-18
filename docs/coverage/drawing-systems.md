# Drawing systems and processes: coverage map

One map for the drawing collection (`src/lib/drawing-collection.ts`). Each part has one
home: an article and section, or an explicit status. Layers follow
`docs/article-work/depth-derivation-2026-10-17/consolidate.md`.

Families not yet mapped: architecture, processes, domains, states, whiteboarding,
vocabulary, layout, maintaining.

## Sequence diagrams

Two articles, restructured 18 October 2026 from three (see
`docs/article-work/sequences/restructure-2026-10-18.md`):

- **D**, *Sequence diagrams* (`/learn/drawing-systems/sequences/`), the deep dive. How to
  draw and read one scenario clearly: vocabulary, framing, the order the page promises,
  frames, judging a design, dialects and writing one as text.
- **C**, *Failure, asynchrony and races in sequence diagrams*
  (`/learn/drawing-systems/async-interactions/`), its companion. The cases where a
  happy-path drawing misleads, ending with the failure walk and drawing what happened.
- *Sequence diagram syntax* is retired. Its URL redirects to D's dialects section, which
  keeps its arrow table as reference.

Running example: Mina's dishwasher repair. The browser, Repair API, Repair DB (PostgreSQL
in the examples), notification worker and email provider; booking R17, notification job
J9, appointment A5, repair R42 for races. Real protocols (TLS, OAuth) carry D's design
readings, because readers meet them in specifications.

Layers: 1 model, 2 working mechanism, 3 expert cases, 4 product specifics; reference for
lookup material. "Needs" gives the intended scale.

| # | Part | Layer | Home | Needs |
|---|---|---|---|---|
| 1 | What it shows: one run of one scenario, lifelines read downward, arrows carry order between them; its cost | 1 | D opening | Prose, then Figure 1 |
| 2 | When to draw something else | 1 | D opening (sentence); full chooser in *Drawing systems and processes* | Sentence and link |
| 3 | Participants as roles; separate lifelines for instances that behave differently | 2 | D `#lifelines-and-messages` | Paragraph |
| 4 | Calls and replies; draw a reply only when it carries something | 2 | D `#replies-and-activation-bars` | Figure with database-time control |
| 5 | Activation bars, optional; height is not time | 2 | D `#replies-and-activation-bars` | Same figure |
| 6 | Sync and async describe the sender, not the protocol; what each commits to | 2 | D `#synchronous-and-asynchronous-messages` | Figure with two cases |
| 7 | Moving work off the request: a job written with the change, a background worker | 2 | D `#background-workers-and-the-transactional-outbox` | Figure, happy path only |
| 8 | Actors, self-messages, notes, create and destroy, participant kinds, boxes | 2 | D `#actors-notes-and-participants` | Short paragraphs, one listing |
| 9 | Flows with no caller: note, found message, clock as a lifeline | 2 | D `#found-messages-and-timers` | Paragraph |
| 10 | Framing: one question, one level, what to omit, happy path first | 2 | D `#how-much-to-draw` | Crowded draft and its split, 1 figure |
| 11 | Queue as a lifeline or a name on the arrow | 2 | D `#one-question-one-level` | Paragraph |
| 12 | Lifeline order, labels, numbering, colour | 2 | D `#making-it-readable` | Paragraph |
| 13 | What order the page promises: per lifeline, send before receive, the rest open | 2 | D `#order-gaps-and-time` | Figure that swaps two rows |
| 14 | Time: gaps, delays and durations in notes; slanted arrows where tools allow | 2 | D `#order-gaps-and-time` | Paragraph |
| 15 | `alt`, `opt`, `loop`, `par`, `break`, `ref` with guards | 2 | D `#combined-fragments` | Three figures, two listings |
| 16 | `critical` and its misreadings | 2 | D `#critical` | Two paragraphs: the definition and the transaction warning |
| 17 | Rare operators; split rather than nest | Reference / 2 | D `#rare-operators-and-deep-nesting` | Sentences |
| 18 | Round trips on the critical path, read from an RFC ladder and its legend | 2 | D `#round-trips` | TLS 1.2 against 1.3, 1 figure |
| 19 | Fork and stair: central against delegated control | 2 | D `#fork-and-stair` | Same booking both ways, 1 figure |
| 20 | Chatty calls, N+1 loops, a participant every message passes through | 2 | D `#chatty-calls` | 1 figure |
| 21 | Trust boundaries: what crosses which boundary | 3 | D `#trust-boundaries` | OpenID Connect sign-in on the OAuth code flow, with PKCE and boxes, 1 figure |
| 22 | Other dialects: numbered collaboration style, informal arrows, RFC legends, "swimlane" tools | 3 | D `#other-dialects` | Paragraph |
| 23 | Marks and their meanings in UML, Mermaid and PlantUML | Reference | D `#other-dialects` | Table |
| 24 | Tool keywords that change meaning (Mermaid `critical`, `-x`) | 4 | D `#critical`, `#other-dialects` | Sentences |
| 25 | Sketching order; writing one as text; what Mermaid can't draw; keeping it true | 2 (sample 4) | D `#other-tools` | One listing, short list |
| 26 | Why the happy path misleads; which scenarios to draw | 3 | C opening | Paragraph |
| 27 | Lost messages, timeouts and the three losses that look alike | 3 | C `#lost-messages-and-timeouts` | Three-case figure |
| 28 | Error replies against silence; 5xx from a gateway | 3 | C `#lost-messages-and-timeouts` | Paragraphs |
| 29 | Nested timeouts and the work that finishes after nobody listens | 3 | C `#timeouts-inside-timeouts` | Figure |
| 30 | Retries, duplicates, idempotency keys; drawing attempts or policy; retry multiplication | 3 | C `#retries-and-idempotency-keys` | Figure |
| 31 | Failing part-way: crash between two arrows, the outbox's duplicate, dual write, compensation | 3 | C `#failing-part-way` | Two figures, one listing |
| 32 | Broker as participant; acknowledgement after the work | 3 | C `#brokers-and-acknowledgements` | Figure |
| 33 | Fan-out: one publish, separate deliveries, separate failures | 3 | C `#fan-out-to-several-consumers` | Figure |
| 34 | Work that finishes later: 202 and polling, callbacks as new messages, correlation ids, the early callback, long waits, streams | 3 | C `#webhooks-and-callbacks` | Figure, paragraphs |
| 35 | Races and overtaking; the stale read | 3 | C `#ordering-and-overtaking` | Figure; worked race in the practice |
| 36 | The failure walk: lost, late, twice, out of order, receiver down, crash between arrows | 3 | C `#failure-walk` | One list, worked on the outbox |
| 37 | Drawing what happened: traces and logs, causal order over cross-host timestamps, checking a design | 3 | C `#drawing-what-happened` | Paragraphs |
| 38 | Practice: a cancellation race | 3 | C `#practise-a-cancellation-race` | Exercise with discussion |

Status of parts that live elsewhere:

| Part | Status |
|---|---|
| Comparison of all diagram types | *Drawing systems and processes*; D and C give a sentence and link |
| C4 levels and dynamic diagrams as a C4 concept | *Architecture diagrams*; D gives collaboration style a sentence as a dialect |
| One object's states across scenarios; long-running workflows as states or processes | *States and lifecycles*, *Processes and swimlanes*; C gives a paragraph and links |
| Layout, labels, colour, whiteboard technique, queue and topic symbols | *Layout, labels and five colours*, *Drawing at the whiteboard*, *A whiteboard shape vocabulary* |
| Tool choice, versions, keeping views current | *Keeping diagrams useful* |
| Broker delivery guarantees, visibility timeouts, offsets, dead-letter queues, ordering guarantees, saga and outbox design, webhook signatures and retry policies | Messaging field, planned and not written; C gives each a sentence without a link and names the assumption the drawing must state |
| Locking reads, claim leases, transactions behind the dual write | Databases field; D says in one paragraph why a claim needs a lease, and C links to *Transaction boundaries* where it needs the locking read |
| Retries on the database side | *Handling conflicts and uncertain outcomes* (relational), linked from C |
| Happens-before and logical clocks | Parked shared distributed-systems idea; D cites Lamport in a sentence |
| Tool syntax beyond the arrow table; where each tool renders; D2 | Left out: the tools document their own syntax. The retired syntax page's evidence stays in `docs/article-work/sequence-syntax/` |
| Remaining UML machinery (gates, coregions, general orderings, state invariants, formal timing), MSC, formal semantics, code generation | Left out; D names the rare operators in one sentence |
