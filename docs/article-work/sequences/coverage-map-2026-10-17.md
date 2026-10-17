# Sequence diagrams: coverage map and depth plan, 17 October 2026

A plan, not prose. Read against `src/pages/learn/drawing-systems/sequences.astro` as
it stands after round 4 (11 h2 and 4 h3 sections, about 2,850 words of prose plus nine
animations, ten Mermaid listings and a 17-row syntax table). Nothing in the article
was edited.

Reader: a working software engineer who draws sequence diagrams to design, document
and review systems: API flows, distributed interactions, failure and retry paths,
async messaging. They want diagrams that communicate and are correct, and to use the
notation and the tools well.

Method. The topic tree in Section 1 was written from the subject and that reader
before the article body or its brief was read (only the heading list had been seen).
It was then compared with the body, the rewrite notes
(`rewrite-2026-10-16.md`), the collection's original commission
(`docs/article-work/drawing-systems/structure.md`, item 4) and the sibling articles.

Verification. Mermaid claims were checked against
https://mermaid.js.org/syntax/sequenceDiagram.html and PlantUML claims against
https://plantuml.com/sequence-diagram, both fetched 17 October 2026. The OMG UML 2.5.1
PDF was not fetched; UML claims rest on secondary references (IBM, Sparx,
uml-diagrams.org via search) and are marked V where they are recalled rather than
read. Anything else recalled from memory is marked V.

## 0. What the article already does well (keep it)

- One running story (Mina, R17, J9) that every section changes in one respect. Each
  new notation arrives because the story needs it.
- The failure sequence is the article's strongest teaching: sync vs async ->
  outbox -> lost message -> retry -> idempotency key. Each animation shows a
  consequence (Mina waits; nobody handles the error; three histories look the same;
  two emails), not just a shape.
- "Vertical distance shows order, not elapsed time", with the 5 ms vs 3 s animation,
  is taught by experiment rather than asserted.
- Practical drawing advice sits beside its fact: draw a timeout as a note, never as a
  reply labelled "failed"; write guards the chooser can check; `par` only if neither
  waits for the other.
- Accessibility and phone work on the figures are thorough (rewrite notes).

These sections are the model for the new ones: scenario, one idea, a consequence the
reader can see, the drawing advice, then the syntax.

## 1. Topic tree (derived before reading the body)

What a working engineer needs from "sequence diagrams":

1. **Purpose and choice.** What question it answers (order, who waits, what each side
   knows); one scenario per diagram; when another view answers better (architecture,
   process/activity, state, timeline, C4 dynamic diagram); how to read one.
2. **Participants and lifelines.** What a lifeline stands for (a role, a service, one
   instance, a replicated set); naming; actors; left-to-right order; creation and
   destruction; grouping by service or trust boundary; external systems; special
   symbols (database, queue).
3. **Messages.** Synchronous call, asynchronous message, reply; create message;
   lost and found messages; self-message; what goes in a label; "synchronous" means
   the sender waits, not a property of the protocol; when replies can be left out.
4. **Activation.** What an execution specification means; nesting; when to omit;
   syntax.
5. **Time and ordering.** Vertical = order, not scale; order is only defined along each
   lifeline and from send to receive, so events on unrelated lifelines are unordered;
   delays and long gaps; message overtaking; timing and duration constraints; numbering.
6. **Combined fragments.** alt, opt, loop (with bounds), par, break, critical; guards;
   nesting; ref (interaction use) for splitting; the rarer operators (seq, strict,
   neg, assert, ignore, consider) and why most engineers never need them.
7. **Failure, timeouts and retries.** Error replies vs no reply; lost request vs lost
   reply vs slow; timeouts and who owns them; nested timeouts and deadlines; retries,
   backoff, idempotency keys; crash between two steps; partial failure across several
   writes and compensation; happy-path vs failure diagrams.
8. **Async and event-driven flows.** Background workers and polling; outbox; broker or
   queue as a participant (or not); publish/subscribe fan-out; acknowledgement,
   redelivery and duplicates; ordering; callbacks and webhooks (found messages,
   correlation IDs); long-running flows across hours or days; the read that arrives
   before the update.
9. **Scope and level of detail.** One level of abstraction per diagram; what to leave
   out (logging, auth plumbing, load balancers, retries inside a client library)
   unless the question needs it; how many lifelines a page holds; when one scenario
   becomes too dense and how to split it; system-level vs code-level diagrams.
10. **Diagrams as design and review tools.** Questions a sequence diagram exposes in a
    design review; reading someone else's diagram for false guarantees; reconstructing
    an incident from logs or traces.
11. **Keeping diagrams in sync with the system.** Source beside code; review on
    meaningful change; traces as evidence; generated diagrams and their limits;
    labelling current vs proposed.
12. **Tools and syntax.** Mermaid; PlantUML; other text tools (D2, sequencediagram.org
    family) and manual editors; what each cannot express; renderer versions and where
    they render (GitHub, GitLab, docs builds).
13. **Readability and layout.** Participant order that minimises arrows skipping
    lifelines; label length; numbering for discussion; notes sparingly; width;
    colour and highlight boxes; splitting.
14. **Common mistakes.** Reply drawn as an async arrow and vice versa; arrows for
    things that are not messages (data flow, "uses"); a "failed" reply nobody sends;
    guards nobody can evaluate; `critical` read as "database transaction"; mixing
    levels.

## 2. Collection check: what already exists elsewhere

Checked by heading lists and grep across `src/articles/drawing-systems/*.md` and the
relational pages linked from this article.

| Topic | Covered elsewhere? | Consequence |
| --- | --- | --- |
| Choosing a diagram by question; sequence vs C4 dynamic vs timeline | `index.md` table and "Sequence diagrams", "Decision tables, timelines..." sections; `architecture.md` mentions C4 dynamic | link only; the opening here is enough |
| Tool choice by editing method, renderer version pinning, versioning sketches | `maintaining.md` "Select a tool by the work it must support" | link; do not repeat. It says nothing sequence-specific and nothing about PlantUML beyond the index's one sentence |
| Review for meaning, current vs proposed status, review triggers, generated views | `maintaining.md` "Review meaning before appearance", "Give the maintained view a home", "Review on meaningful change" | general rules live there; this article owes only the sequence-specific review questions and a link |
| General layout, label size, arrows, splitting dense drawings, colour roles | `layout.md` (box-and-line drawings only; no sequence layout) | sequence-specific layout has no home; keep it here, short, and link to layout for the general principles |
| Dashed reply must not be repurposed as "uncertain" | `layout.md` line 50 | consistent with this article; no action |
| Queue and topic symbols at the whiteboard | `vocabulary.md` "Queue and pub/sub topic" (says the symbol specifies no broker behaviour) | link from the async section; no sequence-diagram treatment exists anywhere |
| Races between cancellation and starting work | `states.md` "Cancellation and starting work can race", "Try the lifecycle against a sequence" | strong candidate for this article's practice exercise; link both ways |
| Parallel work, joins, waiting in a process | `processes.md` | link only; `par` here is about messages, not work |
| Retries, unknown commit outcomes, operation keys on the database side | `relational/conflicts-and-retries.astro` (deep) | already linked in Sources; keep |
| Locking read with `SKIP LOCKED` | `relational/transaction-boundaries.astro#locking-read` (anchor exists, line 292) | already linked; OK |
| Messaging semantics (brokers, delivery guarantees, ordering) | nowhere; no messaging field exists, and the shared distributed-systems programme is parked | this article and any breakout teach how to draw these flows and what a drawing commits to, not broker semantics; say so |
| Practice with discussed answers | every sibling ends with one ("Try...", "Practise..."); `structure.md` requires it for all ten articles | this article has none: a collection-level gap |

## 3. Per-section plan

Legend. OK = covered well; THIN = covered but thin (what is missing); ABSENT-E =
absent and essential; ABSENT = absent, useful; ELSEWHERE = belongs elsewhere
(destination checked); OUT = deliberately out of scope. Depth: keep, light, moderate,
substantial, breakout.

### 3.1 Opening (260 words)
Needs: what the diagram is, what it is for, when to reach for one, the running
example, the question the article builds to.
- All five: OK (round 4 repairs worked).
- The opening promises "how one retry sends her the same email twice", which the
  article answers. It does not promise review, scope or tools; if Sections 3.12-3.15
  below are added, add one sentence naming that the article also covers how much to
  draw and how to use the diagram in review.
- Collection blurb says "Messages, time, replies and uncertain outcomes"; the
  index's "The articles" line says "calls, replies, fragments and lost messages, in
  Mermaid". Update both if PlantUML or scope sections arrive.
Depth: keep, +30 words.

### 3.2 Lifelines and messages (176 words, Figure 1)
Needs: lifeline, message, reading order, left-to-right convention, labels.
- Lifeline and message defined; order read down the page; initiator on the left; label
  guidance with a bad-label counterexample: OK.
- What a lifeline stands for: ABSENT-E. "Repair API" is a role played by whichever
  instance takes the request. When two instances matter (two workers claiming jobs, two
  API replicas racing on the same booking) they need two lifelines, "Worker A" and
  "Worker B". Without this the reader cannot draw the race the outbox section and
  `states.md` both raise. Two to three sentences here; use it again in 3.5 and the
  practice exercise.
- One level of abstraction per lifeline set (services, not a mix of services and
  classes): belongs in the new scope section (3.12); one forward sentence here at most.
Depth: light, +80 words. No h3.

### 3.3 Replies and activation bars (294 words, Figure 2)
Needs: call/reply pairing, activation meaning, nesting, order-not-time, the UML name,
syntax.
- Call, reply, activation bar, nesting of waits, vertical = order: OK. The 5 ms vs 3 s
  experiment is the best single teaching moment in the article.
- When to leave replies and activations out: THIN. Many working diagrams omit
  activation bars entirely and omit replies that carry nothing ("OK"); UML permits
  omitting replies (V). One paragraph: draw replies when they carry data or a decision,
  draw activations when who-is-blocked is the question (as in Figure 2).
- Wording: "Mermaid draws one only for the participant handling the call" can be read
  as "Mermaid cannot activate a caller". Mermaid draws a bar wherever `activate` or `+`
  is placed, and activations stack (docs). Say instead that Mermaid has one kind of
  bar, so it cannot distinguish working from waiting. Small fix.
- Long-form `activate X` / `deactivate X`: ABSENT from prose and table. Needed when a
  bar starts without a message (a worker's poll cycle). One line plus a table row.
Depth: light, +90 words.

### 3.4 Synchronous and asynchronous messages (222 words, Figure 3)
Needs: the two arrowheads, what "the sender waits" means, the consequence, syntax.
- Definitions, consequence (Mina waits; an ignored error), Mermaid `-)`: OK.
- Sync vs async is about the sender, not the transport: THIN. An `await fetch(...)` is
  a synchronous message in diagram terms even though the code is "async"; an HTTP call
  whose response is ignored is asynchronous; a message to a broker is a synchronous
  call to the broker (it returns an acknowledgement) that starts an asynchronous
  delivery. Engineers mislabel arrows on exactly this point. One paragraph, ideally
  before "Suppose the API also sends...".
- Mermaid attaches no meaning to its arrows: THIN. The docs describe `->>` only as
  "solid line with arrowhead" and `-)` as "open arrow at the end (async)". The mapping
  "`->>` = call" is a convention this article adopts from UML. Say so once, here or in
  the syntax table, so readers do not take Mermaid output as UML-exact.
Depth: light, +100 words.

### 3.5 Background workers and the transactional outbox (338 words, Figure 4)
Needs: why move work out of the request; the outbox; polling; two entry points; the
remaining duplicate.
- All: OK. Two starting points and the split at the database are well handled.
- Two workers: the prose mentions "With several workers..." but every figure draws one
  Worker. If 3.2 adds instance lifelines, consider a one-line Mermaid variant with
  Worker A and Worker B both polling, to show what the skip-locked claim prevents.
  Optional.
- Drawing a polling loop honestly (the worker's poll is itself a `loop`; the diagram
  shows one pass): ABSENT, one sentence; the loop section can refer back.
Depth: keep, +40 words.

### 3.6 Lost messages and timeouts (291 words, Figure 5)
Needs: lost message notation; the three indistinguishable cases; what a timeout knows;
how to draw it; setting timeouts.
- All: OK. Notation claim checked: UML lost message ends in a small filled circle;
  PlantUML documents that it supports only an open circle (`->o`) or a cross (`->x`);
  Mermaid has only the cross. The Mermaid advice is right.
- Error reply vs no reply: THIN. The article draws the 422 in `alt` but never contrasts
  a 500 reply (the provider answered: you know it failed, mostly) with silence (you
  know nothing). One or two sentences: a 5xx is a reply and is drawn as one; only
  silence is drawn as a timeout note. Also: a 5xx can still hide an applied side effect
  (V; check a provider's documentation before stating).
- Found message: ABSENT. The mirror image of a lost message: a message whose sender is
  outside the diagram (a cron trigger, an inbound webhook). UML draws it starting from
  a filled circle (V, secondary sources agree); PlantUML writes `[->`; Mermaid has no
  form (docs list none) so use a participant for the outside world or a note. Belongs
  with webhooks in 3.11, cross-referenced here.
- Nested timeouts: ABSENT-E. Figure 2 already shows the browser's wait containing the
  API's wait containing the database's. The working consequence is that each caller's
  timeout must be longer than the work it waits for, or the outer caller gives up while
  the inner work continues and commits (the browser shows an error, the booking exists).
  This is the commonest timeout bug in multi-hop flows and the diagram is the tool that
  reveals it. New h3 or a closing paragraph with a figure variant: Figure 2 with a
  browser timeout of 2 s and the database at 3 s.
Depth: moderate, +180 words; h3s "What the caller knows" (existing) and "Timeouts
inside timeouts" (new). Interactive: add a "Browser timeout" parameter to the
`waiting` scenario rather than a new figure.

### 3.7 Retries and idempotency keys (302 words, Figure 6)
Needs: retry; when it duplicates; idempotency key; key lifetime; backoff and jitter.
- All: OK.
- How to draw a retry: THIN. The Mermaid listing shows two attempts drawn out in full;
  the prose never says when to draw attempts explicitly and when to write
  `loop up to 3 attempts` or a note "retried up to 3 times with backoff". Rule of thumb:
  draw attempts out when the difference between attempts is the point (as here); use a
  loop or a note when it is policy. Two sentences.
- Retries at several layers (client library retries inside a worker retry inside a
  queue redelivery) multiply attempts: ABSENT, one sentence with a pointer to the
  scope section's "what to leave out" (a library's retries are usually left out unless
  they multiply).
Depth: light, +70 words.

### 3.8 Combined fragments (67-word intro; four h3s, Figures 7-9)
Needs: what a fragment is; operator; guard; operands; each common operator; nesting;
when fragments stop helping.
- Intro defines fragment, operator, guard, operand separator: OK.
- alt and opt (198): OK. "With an else section, exactly one runs" agrees with UML
  (else is true when no other guard is) (V for the spec wording).
- loop (124): OK. Missing the UML bound notation `loop(1,30)` / `loop(30)` (V, UML
  2.5 defines `loop(min, max)`), which is what a reader will meet in UML tools and
  PlantUML diagrams drawn by others. One sentence; Mermaid writes the bound in the
  label text.
- par (139): OK. Good on "if one needs the other's reply, they aren't parallel".
- break and ref (103): THIN. Break is fine. `ref` gets two sentences and a Mermaid
  workaround; it deserves its own h3 because it is the main tool for splitting dense
  diagrams (3.12). Move ref to a new h3 "ref: splitting one interaction into several"
  and pair it with PlantUML's `ref over A, B : name` (docs), which draws the real frame.
- critical: ABSENT-E. Mermaid supports `critical ... option ... end` (docs) and the
  Sources line names it, but the body never explains it. It is also the most misread
  operator: UML `critical` means the region cannot be interleaved with other events on
  its lifelines (V: spec wording), which is not the same thing as a database
  transaction or a lock, though engineers use it that way. Mermaid's docs example
  uses it for "must happen, with fallback options", a third reading. Teach what it
  means, what Mermaid's `option` adds, and recommend a note ("one transaction, ending
  at COMMIT", as the alt example already does) for transactions. New h3, ~130 words.
- Nesting and density: ABSENT-E. When fragments nest more than two deep, or `alt`
  branches each hold several messages, the diagram has become several scenarios. Say
  so here and point to 3.12.
- The rarer operators (seq, strict, neg, assert, ignore, consider): OUT with one
  sentence naming them and saying they are rarely needed outside formal specification
  (secondary sources confirm the set and describe ignore/consider inconsistently). A
  short reader may meet `neg` ("this must never happen") in a review; one clause.
- `rect` highlight and `box` grouping: belong in 3.13 (layout) and the syntax table.
Depth: moderate, +330 words; h3s become: alt and opt; loop; par; break; critical;
ref. Figure: none new for critical (a Mermaid listing suffices); the split-with-ref
figure is in 3.12.

### 3.9 Self-messages, notes and participants (156 words)
Needs: actors, self-messages, notes, create/destroy.
- All four: OK. Create/destroy claims verified: v10.3.0+, only the receiver can be
  created, either end destroyed (Mermaid docs).
- Heading is a grab bag. With 3.2 taking over "what a lifeline stands for", rename to
  "Actors, self-messages, notes and short-lived participants" or fold actors into 3.2.
- Participant symbols (database, queue, boundary, control, entity, collections): ABSENT.
  PlantUML has keywords for each (docs); Mermaid sets them with JSON configuration
  syntax (docs; version not stated, V). Useful for async diagrams where the queue is a
  participant. One sentence plus table rows.
- `box` to group participants by service, owner or trust boundary: ABSENT. Mermaid
  `box` (docs; hex colours unsupported), PlantUML `box ... end box`. Relevant for
  "which of these calls cross into the provider's systems". Two sentences; link to
  `layout.md` on saying what a boundary means.
Depth: light, +110 words.

### 3.10 Time and ordering (no section today)
Needs: order vs scale (covered in 3.3); partial order across lifelines; delays and long
gaps; overtaking; timing constraints; numbering.
- Vertical = order, not scale: OK (3.3).
- Partial order: ABSENT-E. A sequence diagram orders events along each lifeline and
  each send before its receive; two events on unconnected lifelines have no order even
  though one is drawn higher (V: UML trace semantics; secondary sources agree on the
  weak-sequencing default). This is what makes `par` necessary and what lets readers
  avoid false conclusions such as "the worker claims J9 after the browser gets 201"
  in Figure 4: nothing in the diagram orders those two. Teach with Figure 4: the
  browser's 201 and the worker's claim can swap.
- Long gaps: ABSENT. "2 days later" between messages. PlantUML has `...` delay with text
  and `==` dividers (docs); Mermaid has neither, so use a note across all lifelines.
  One paragraph.
- Message overtaking (async messages arriving out of send order, drawn as crossing
  slanted arrows; PlantUML `->(10)` slants an arrow, teoz needed for some layouts; V):
  ABSENT. Belongs in the async breakout; one sentence here.
- Duration and timing constraints (`{< 2 s}` style annotations, UML DurationConstraint;
  V): ABSENT. Mention as notes; the article already advises writing times in notes.
- `autonumber`: in the table only. One sentence: number steps when the diagram will be
  discussed ("step 7 has no timeout"). Mermaid `autonumber <start> <increment>` is
  documented with a v11.15.0 marker on the docs page (checked); plain `autonumber`
  predates it.
Depth: new h2 "Order, gaps and what the diagram does not say about time", ~280 words,
placed after "Replies and activation bars" or after the outbox (where Figure 4 gives
the example). Interactive: a small two-lifeline-pair animation with a "swap" control
showing that both orders satisfy the same diagram. Could reuse `SequencePlayer` with a
parameter on `outbox` ("Worker polls early").

### 3.11 Async and event-driven flows (partly in 3.4 and 3.5; otherwise absent)
Needs: see tree item 8. The reader explicitly draws "async messaging".
- Background worker + polling + outbox: OK (3.5).
- Broker or queue as a participant: ABSENT-E. When to draw the broker as a lifeline
  (its acknowledgement, retention or redelivery affects the outcome) and when to draw a
  direct async arrow from producer to consumer (it does not). One paragraph and a
  Mermaid variant of the outbox with a queue.
- Publish/subscribe fan-out: ABSENT-E. One event, several subscribers: separate async
  arrows from the topic, which are not ordered with respect to each other (ties to 3.10)
  and may be wrapped in `par`. One paragraph and a listing.
- Acknowledgement, redelivery and duplicates: ABSENT. The article's idempotency key
  already answers the duplicate; show that redelivery is the same picture as the
  worker crash. Short.
- Webhooks and callbacks: ABSENT-E. A request now and a reply hours later from the
  other side (payment provider calls back; email provider posts a bounce). Draw the
  callback as a new message from the provider, carrying a correlation ID that ties it
  to the original; found message notation where the sender is outside scope. This is
  the shape engineers most often get wrong (they draw it as a reply). The email
  provider's bounce webhook fits the running story.
- Read before update (Mina's page polls before the worker or a projection has
  updated): partly covered by the loop example; ABSENT as a named idea. One sentence
  linking the loop.
- Sagas and compensation across services: OUT here, IN breakout.
Depth: substantial. In this article: a new h2 "Queues, events and callbacks" (~400
words, two Mermaid listings: queue as participant; bounce webhook with correlation ID).
Full treatment: breakout B1.

### 3.12 Scope and level of detail (absent)
Needs: tree item 9. Commissioned in `structure.md` ("when one scenario becomes too
dense") and never delivered.
- One question per diagram; one level of abstraction: ABSENT-E.
- What to leave out unless it changes the answer: ABSENT-E. Load balancers, gateways,
  auth token checks, logging, client-library retries, cache hits. Each earns a lifeline
  only when the question is about it (a gateway timeout question needs the gateway).
- How many lifelines: ABSENT. A calibration, not a rule: the repair service's five
  lifelines fit a phone; beyond about eight, labels shrink and readers start scrolling
  sideways (state as observation of this site's figures, not a law).
- Happy path vs failure diagrams: ABSENT-E. Draw the happy path first, then one diagram
  per consequential failure, rather than one diagram whose `alt` branches hold every
  failure. The article's own structure (one figure per failure) is the example; say so.
- Splitting with ref: link to the new ref h3 (3.8).
- System-level vs code-level (method calls between classes): one sentence; code-level
  diagrams go stale fastest and are best generated or not drawn (`architecture.md`
  makes the same point for C4 code diagrams).
Depth: new h2 "How much to draw", ~400 words, near the end (after fragments, before
tools). Figure: a static before/after: a dense diagram (gateway, auth, cache, three
alt branches, nine lifelines) beside the two diagrams it should have been, linked by a
`ref`. A static SVG is enough; the point is the comparison, not the motion.

### 3.13 Readability and layout of a sequence diagram (absent; `layout.md` is box-and-line only)
- Order lifelines so most arrows travel between neighbours; arrows that skip lifelines
  cross bars and are hard to follow: ABSENT.
- Put external systems at the right edge, people at the left: partly OK (initiator on
  the left is stated).
- Label length (labels widen the whole diagram in Mermaid; break long labels with
  `<br/>` (Mermaid docs say line breaks work in messages and notes)): ABSENT.
- `rect` to highlight a region, `box` for grouping, notes sparingly: ABSENT.
- Renders in light and dark themes on GitHub: OUT (layout.md covers colour).
Depth: fold into 3.12 as an h3 "Making it readable" (~150 words) rather than a
separate h2.

### 3.14 Reading and reviewing a sequence diagram (absent)
Needs: tree item 10. The reader "reviews systems".
- Review questions: ABSENT-E. The article teaches each question implicitly; a working
  engineer needs them consolidated as what to ask of any diagram put in front of them:
  - Who is waiting at each point, and for how long at worst?
  - Does every call that can hang have a timeout, and is each caller's timeout
    longer than what it waits for?
  - For every asynchronous message, who notices if it fails?
  - What does each participant know after a timeout?
  - Which arrows can be retried, and what makes them safe to repeat?
  - Where does a crash between two arrows leave the data?
  - Which guards can the chooser actually evaluate?
  - Which events are drawn in an order the system does not guarantee?
  - Do the diagram and the state lifecycle agree (`states.md`)?
- Reconstructing an incident from logs or distributed traces: ABSENT. Traces
  (OpenTelemetry spans) record actual calls and durations; a span waterfall is a
  timeline, not a sequence diagram, but it is the evidence for drawing one (V for any
  tool that converts traces to sequence diagrams; do not name one without checking).
  Two sentences plus link to `index.md` timelines.
Depth: new h2 "Reviewing a design with a sequence diagram", ~350 words. Figure: the
completed outbox diagram annotated with numbered review questions at the arrows they
apply to (static, or the existing player with an "annotations" toggle). This is the
best candidate for the article's closing worked example.

### 3.15 Keeping diagrams in sync (absent here; ELSEWHERE in `maintaining.md`)
- General rules (review on meaningful change, generated views, status): ELSEWHERE,
  `maintaining.md` covers them (checked). Do not repeat.
- Sequence-specific triggers: ABSENT, one paragraph: a sequence goes stale when a call
  is added, a timeout or retry policy changes, or work moves between sync and async;
  renaming a function does not matter. Keep the Mermaid source beside the code that
  implements the flow; compare against a trace when a reviewer doubts it.
Depth: one paragraph (~90 words) at the end of 3.14, linking `maintaining.md`.

### 3.16 Tools: Mermaid syntax reference (36 words + table) and other tools (absent)
Needs: tree item 12.
- Mermaid table: OK for what it lists. Missing rows: `activate`/`deactivate`,
  `critical ... option`, `rect`, `box`, `<<->>` (v11.0.0+, docs), `--)` / `--x`
  (dotted async and dotted cross; the article's retry listing uses `--x` without
  explaining it), `<br/>` in labels, participant types via JSON config (V for
  version). Add a "Mermaid can't draw" list: `ref` frames, found messages, lost-message
  circles, delays and dividers, duration constraints, slanted arrows; the article
  mentions two of these in passing. The docs page also lists half-arrows and "central
  connections" tagged v11.12.3+; leave these out until the version is confirmed against
  Mermaid's release notes (the page's own listing of them is inconsistent).
- Version note: the meta line says Mermaid 11; GitHub and GitLab render with their own
  bundled version, which may lag (V). One sentence telling readers to check the
  renderer before using recent syntax (create/destroy is 10.3+); link `maintaining.md`
  on pinning.
- PlantUML: ABSENT-E for this reader. The index says PlantUML "covers more of UML" and
  the task's reader uses it; this article never shows it. The gaps the article itself
  hits (ref, lost circle, delays, found messages, parallel messages with teoz `&`,
  `return`, `autoactivate`) are all PlantUML features (docs). Add an h2 "Other tools,
  and what Mermaid can't draw" with one PlantUML listing of the retry or outbox
  diagram and a translation table (Mermaid / PlantUML / meaning) for the common
  constructs. Note: PlantUML's `->>` is a thin arrowhead, not a dotted reply, and its
  `-->` is the dotted reply; Mermaid's `->` and `-->` have no arrowhead at all (both
  docs). This mismatch catches people translating between the two.
- Other text tools (D2's sequence diagram shape, the sequencediagram.org /
  websequencediagrams syntax) and manual editors (draw.io UML shapes, Excalidraw):
  one sentence each at most, all V; or OUT with a pointer to `maintaining.md`.
Depth: substantial if kept in-article (~450 words plus table). Recommended instead:
keep a short in-article section (~200 words: when to switch to PlantUML, the arrow
mismatch, the "can't draw" list) and move the full tables to breakout B2.

### 3.17 Common mistakes (scattered)
- "A failed reply nobody sent": OK (3.6). Unreachable guards: OK (3.8). `par` for
  dependent calls: OK (3.8).
- Callback drawn as a reply; `critical` as transaction; structural "uses" arrows in a
  sequence; mixing levels: ABSENT, each covered by the sections above. No separate
  section; the review questions in 3.14 consolidate them.

### 3.18 Practice (absent; every sibling has one)
- ABSENT-E at collection level (`structure.md` requires exercises with discussed
  answers). Proposal: "Practise with a cancellation race". Mina cancels R17 while a
  technician's app starts the repair (the race in `states.md`). The reader draws the two
  instances and the API, decides what each knows, adds the guard the API checks, and
  compares with a discussed answer that uses two lifelines for two clients, a partial
  order point, and a `critical` or note for the atomic state check. Ties 3.2, 3.8 and
  3.10 together and gives `states.md`'s "Try the lifecycle against a sequence" a
  destination.
Depth: new h2, ~300 words including the discussed answer; Mermaid listing in a
closed disclosure.

### 3.19 Sources and further reading (113 words)
- Add PlantUML sequence documentation; a UML combined-fragment reference if the
  OMG chapter cannot be quoted directly; `maintaining.md`, `layout.md`, `vocabulary.md`
  and `states.md` with a line each on why (house rule from commit 851380e: each
  related article gets a reason line). Keep last.

## 4. Depth summary

| Section | Words now | Verdict | Target | New h3s | Figure / example |
| --- | --- | --- | --- | --- | --- |
| Opening | 260 | keep | 290 | no | no |
| Lifelines and messages | 176 | light | 255 | no | no |
| Replies and activation bars | 294 | light | 385 | no | no |
| Sync and async messages | 222 | light | 320 | no | no |
| Workers and outbox | 338 | keep | 380 | no | optional two-worker listing |
| Lost messages and timeouts | 291 | moderate | 470 | 2 | `waiting` scenario gains a browser-timeout parameter |
| Retries and idempotency keys | 302 | light | 370 | no | no |
| Order, gaps and time (new) | 0 | new | 280 | no | swap-order parameter on `outbox` |
| Combined fragments | 492 | moderate | 820 | 6 (alt/opt, loop, par, break, critical, ref) | critical listing; PlantUML `ref over` |
| Queues, events and callbacks (new) | 0 | new, bridge to B1 | 400 | 2 (queues and topics; callbacks) | two Mermaid listings |
| Actors, notes, short-lived participants | 156 | light | 265 | no | no |
| How much to draw (new) | 0 | new | 550 | 1 (making it readable) | static before/after split figure |
| Reviewing a design (new) | 0 | new | 440 | no | annotated outbox diagram |
| Other tools (new) + Mermaid reference | 36 + table | substantial or B2 | 200 + table | no | PlantUML listing; "can't draw" list |
| Practice (new) | 0 | new | 300 | no | exercise with discussed answer |
| Sources | 113 | update | 180 | no | no |

About 2,850 words now; about 6,000 after, with nine existing animations, three
parameter additions, two new static figures and four or five new listings. The order
in the table is a suggestion; the argument should decide it. The failure sequence
(3.4 to 3.7) should stay contiguous.

## 5. Proposed breakouts in the drawing-systems collection

**B1. Drawing asynchronous and event-driven interactions** (new article; Deep dive).
Why: the reader named async messaging as a core use, and a proper treatment (broker
as participant, fan-out, acknowledgement and redelivery, ordering and overtaking,
webhooks and correlation, long-running flows over days, sagas and compensation drawn
as sequences, choosing between a sequence diagram and a state or process view for a
long-running workflow) would double this article and swamp its single-request story.
Readers arrive for it directly ("how do I draw our Kafka flow?"). Boundary: it teaches
how to draw these flows and what each drawing claims; it does not teach broker
semantics, which belong to a messaging field that does not exist yet, and it must not
activate the parked distributed-systems programme. Running example: the repair
service's notification and bounce webhooks, plus a scheduling event fanned out to
technician app and billing. Destination check: nothing in the collection covers it
(`vocabulary.md` draws queue and topic symbols only and says they specify no
behaviour). Use `staycurrent-planning` before commissioning.

**B2. Sequence diagram syntax: Mermaid, PlantUML and others** (Companion to this
article). Why: a lookup reader with different needs from the learner; syntax changes
with renderer versions (Mermaid has added create/destroy at 10.3, bidirectional arrows
at 11.0 and numbering options at 11.15 by its own docs), so a dated companion keeps the
main article stable. Contents: full Mermaid and PlantUML tables side by side with
meanings, the arrow mismatches, "can't draw" lists, where each renders (GitHub,
GitLab, docs builds), a note on D2 and manual editors (V). The main article keeps the
syntax beside each example and a short "other tools" section. Destination check:
`maintaining.md` covers choosing a tool by editing method, not syntax; nothing else
exists.

Considered and not proposed:
- **Reviewing designs with sequence diagrams** as its own article: the review questions
  depend on everything this article teaches, and the section is about 450 words. Keep
  it in-article. If a later Worked example article is wanted (a full design review of a
  new flow, start to finish), it would fit the Worked example type.
- **Keeping sequence diagrams in sync**: `maintaining.md` already owns this; one
  paragraph here and a link.
- **UML formal semantics** (all twelve operators, gates, state invariants, timing
  constraints): OUT. A working engineer rarely meets them; one sentence and the OMG
  link.

## 6. Ranked by improvement to a working engineer's drawing and reading

1. **Scope and level of detail** (3.12, with the before/after figure): the commission
   asked for it and it is absent; dense, mixed-level diagrams are the commonest reason a
   sequence diagram fails to communicate.
2. **Reviewing a design with a sequence diagram** (3.14): turns the article's implicit
   lessons into the questions a reviewer asks of anyone's diagram; the reader's stated
   job.
3. **Queues, events and callbacks** (3.11) as an in-article bridge, with B1 for the full
   treatment: async messaging is a named use and the article covers only polling
   workers; callbacks drawn as replies are a frequent error.
4. **Partial order and time** (3.10): prevents reading order into a diagram that does
   not guarantee it; underpins `par`, fan-out and race diagrams.
5. **Nested timeouts** (3.6): the most consequential multi-hop failure the existing
   Figure 2 already sets up; small change, big payoff.
6. **critical and ref as full h3s** (3.8), plus nesting guidance: critical is in
   Mermaid, named in Sources, untaught and widely misread; ref is the splitting tool.
7. **PlantUML and the limits of Mermaid** (3.16): fills every gap the article itself
   works around; the arrow-syntax mismatch between the two catches translators.
8. **Practice exercise** (3.18): the only drawing article without one; the cancellation
   race exercises instance lifelines, guards and order together.
9. **What a lifeline stands for; sync vs async is about the sender** (3.2, 3.4): two
   short paragraphs that prevent the most common labelling errors.
10. **Smaller completions**: omitting replies and activations; how to draw retries as
    policy; error reply vs silence; participant symbols and `box`; table rows;
    activation wording fix; Sources update.

## 7. Factual notes for the author (no change made)

- Activation wording in 3.3 (see above): Mermaid can activate any participant; the
  difference is one bar style.
- Syntax table row `A->>B: text` "A call: A waits for the reply": the meaning is the
  article's convention, not Mermaid's; say so once.
- The retry listing uses `--x` (dotted line with a cross), which neither the prose nor
  the table explains. Add a row.
- Mermaid `autonumber` start/increment is marked v11.15.0+ on the docs page; plain
  `autonumber` is older. If the article teaches numbering, show plain `autonumber`.
- UML claims in the article (filled vs open arrowhead, dashed reply, lost message
  circle, break semantics, alt/else) agree with secondary references. The OMG 2.5.1
  chapter 17 should be read directly before adding critical, loop bounds, found
  messages or partial-order wording (all V above).

## 8. Checks before drafting

- Read UML 2.5.1 chapter 17 for: critical, loop bounds, found message, create message
  notation, general ordering and the default weak sequencing of a diagram.
- Render every new Mermaid listing with the pinned Mermaid version, and every PlantUML
  listing with a named PlantUML release; record both in the rewrite notes.
- Check GitHub's and GitLab's current Mermaid versions before saying which syntax they
  render.
- Do not name a trace-to-sequence-diagram tool without checking it exists and works.
- Use `staycurrent-planning` for B1 and B2 before writing either; keep both listed as
  planned, not available, until written.
- Run the independent review the authoring skill requires after any redraft, including
  a reader new to sequence diagrams for the new scope and review sections.
