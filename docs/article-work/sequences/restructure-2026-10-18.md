# Sequence diagrams family: restructure to derived depth, 18 October 2026

Carries out the Sequences verdict in
`docs/article-work/depth-derivation-2026-10-17/derived/sequences-comparison.md`, checked
against the pages as they stood after the 18 October style pass. The plan executed is the
"Sequence diagrams" section of `docs/coverage/drawing-systems.md`, written first.

## Result

| Article | Before | After |
|---|---|---|
| Sequence diagrams (deep dive) | 30 min | 25 min |
| Drawing asynchronous and event-driven interactions, now *Failure, asynchrony and races in sequence diagrams* (companion) | 25 min | 19 min |
| Sequence diagram syntax (companion) | 10 min | Retired, redirects |
| **Total** | **65 min** | **44 min** |

Times are the TitleLine figures from the dev server. The derived plan is 39 minutes. The
gap is mostly material the comparison judged at the right depth and that the plan didn't
list: nested timeouts (about 350 words and a figure) and the cancellation-race practice
(about 430 words, the only worked race). Both companion and deep dive also carry
Sources lists, which the reading time counts.

## Decisions

- **Two articles, not three.** The syntax companion fails the planning test: nobody needs
  an investigation of tool syntax, the tools document it, and the one part readers need
  (which arrow means what in which tool) is a nine-row table. It moved into the deep
  dive's "Other dialects" and the page retired.
- **The async article becomes the single failure companion**, typed Companion to
  *Sequence diagrams*, and keeps its URL (`/learn/drawing-systems/async-interactions/`) so
  no redirect is needed. Retitled to name what it now holds. A separate article serves
  readers here: the failure catalogue would bury the deep dive's argument, and readers
  search for timeouts and async drawing directly.
- **The outbox happy path stays in the deep dive.** Ordering (Figure 6) and framing
  (Figure 5) are built on it. Only its failure cases (provider down, worker crash, claim
  lease) moved. The deep dive uses a new no-control scenario, `outboxPath`, which builds
  the existing `outbox` scenario's happy path; the companion uses `outbox` with all cases.
- **The cancellation race moved to the companion** as its final practice. The plan puts
  races there, and the race exercise was the only worked race.
- **Order in the deep dive** now runs: notation (lifelines, replies, sync and async,
  background workers, participants and boxes), framing, ordering, frames, reading a
  design, dialects, writing as text. Framing and the order rule come before the frames
  (verdict item 4).
- **Static figures.** `SequencePlayer` takes `still`: the finished drawing, transcript
  and source, with no controls or autoplay; it still re-lays out at each width. Used for
  Figure 1 (booking) and Figure 13 (OAuth). The `alt`/`opt`, `loop` and `par` figures
  kept their players, because each toggle teaches the frame's meaning (the faded path,
  the endless loop, either reply first).
- **Listings.** Visible listings in the deep dive drop from nine to four: the
  participants/create/destroy listing, `break`, the `ref` stand-in, and Figure 1's text
  in "Writing a diagram as text". The rest sit under each figure's *Mermaid source*.

## What moved where

| From | To |
|---|---|
| D "Lost messages and timeouts" with Figure 5 (the three losses) | C `#lost-messages-and-timeouts`, Figure 1 |
| D "Nested timeouts" with Figure 6 | C `#timeouts-inside-timeouts`, Figure 2 |
| D "Retries and idempotency keys" with Figure 7 | C `#retries-and-idempotency-keys`, Figure 3 |
| D outbox failure cases, claim lease, locking read | C `#failing-part-way`, Figure 4 |
| C dual write and saga | C `#failing-part-way`, Figure 5 and one listing |
| D "Found messages and timers" | D `#found-messages-and-timers`, now "Flows with no caller" under the participants section, three paragraphs, no listing |
| D and C queue-as-lifeline guidance | D `#one-question-one-level` |
| D "Reviewing a design" (12 questions), C "Three questions" and "Questions to put to every arrow" | One list, C `#failure-walk`, with the outbox worked application. The non-failure questions already live where they're taught (guards in `alt`, `critical` as a transaction, one level, states) |
| D incident reconstruction and "Keeping a diagram true" | C `#drawing-what-happened`; the staleness paragraph stays in D `#other-tools` |
| D "Practise with a cancellation race" | C `#practise-a-cancellation-race` |
| Syntax companion's arrow table | D `#other-dialects`, rewritten as a nine-row marks table |
| C "Flows that last hours or days" (Figure, 600 words) and "Which view" table | One paragraph in C `#when-no-callback-comes` with links to States and Processes |

## What was cut and why

- Broker mechanics: SQS visibility timeouts, RabbitMQ requeueing and confirms, Kafka
  offsets, dead-letter queue drawing, competing consumers as a section, durable
  subscriptions in detail. Messaging field (planned). Kept: the ack as its own arrow after
  the work, "write the broker's promise in a note with the product named", SQS duplicates
  without failure as one example, dead-letter readers in a clause.
- Saga design beyond one drawn compensation; orchestration and choreography reduced to
  two sentences tied to the deep dive's fork and stair.
- Webhook handling: signature verification, store-first rationale with provider retry
  policies (including the Postmark retry claim the comparison flagged), Stripe's
  retry and ordering details.
- The long-running figure (`confirm` scenario removed from `async-scenarios.ts`) and the
  which-view table.
- The completed-repair practice (fan-out, duplicates and overtaking again).
- HTTP client defaults reduced to a clause; key retention and backoff to one sentence.
- Mermaid's `+`/`-` activation syntax, `-)`, `-x` and version details as prose; they're in
  the marks table or the figure sources.
- The `twoWorkers`, `lost`, `pollCycle`, `asyncSend` (now a source), `redelivery`,
  `deadLetter`, `broker`, `fanout`, `overtaking`, `webhook`, `confirm`, `saga`,
  `choreography` and `practiceAnswer` listings.

## What was added, with sources

- D opening: one clause that arrows order events on different lines, and a sentence that
  the diagram doesn't show structure or one record across runs, linking the collection's
  chooser (layer 1 cost and part 2).
- D `#reading-a-design` (new), four readings, each with a new figure built on the shared
  model (`design-scenarios.ts`):
  - Round trips, Figure 10 (`tls`): TLS 1.2 two round trips, TLS 1.3 one, labels and
    legend from RFC 8446 §2 (`+` extension, `*` optional, `{}` handshake keys, `[]`
    application keys) and RFC 5246 §7.3 Figure 1.
  - Fork and stair, Figure 11 (`control`): IBM RUP "Guidelines: Sequence Diagram"
    (archived copy at files.defcon.no): centralised control gives a fork, decentralised a
    stairway; fork when order may change or new steps are expected, stair for tightly
    bound steps in fixed order.
  - Chatty calls, Figure 12 (`chatty`): N+1 loop, links the relational
    `request-cost/#repeated` section. Timings are invented.
  - Trust boundaries, Figure 13 (`oauth`, still, with group boxes): RFC 6749 §4.1 steps
    A–E; §4.1.2 "MUST expire shortly after it is issued", ten-minute maximum
    recommended, "MUST NOT use the authorization code more than once".
- D `#other-dialects` (new): C4 dynamic diagram (c4model.com/diagrams/dynamic:
  collaboration and sequence styles show the same information); marks table checked
  against plantuml.com/sequence-diagram (`->x`, `[->`, `ref over`, `...text...`, slanted
  `A ->(20) B`) and the Mermaid syntax page. PlantUML's `->o` is not listed: its docs
  describe it as a circle head, not a lost message, so the old syntax table's row was
  dropped.
- D ordering: one sentence on Lamport's 1978 space-time diagrams; one on slanted arrows.
- D framing: take participant names from the architecture view at the same level.
- D `break`: one sentence on `break` as an early failure path outside a loop.
- C `#drawing-what-happened`: cross-host timestamps can't order events; causal links can
  (the order rule applied to evidence).
- C races: the Facebook memcache stale set (Nishtala et al., NSDI 2013, §3.2.1) as a real
  race, in one sentence with a source.
- Model: `groups` on `Builder`/`Scenario` draws dashed boxes behind participants with a
  label under the last row (`.seq-group-box`, `.seq-group-text`, theme tokens only).

## Redirects and anchors

- `/learn/drawing-systems/sequence-syntax/` redirects to
  `/learn/drawing-systems/sequences/#other-dialects`, through a new `drawingAliases` map in
  `src/lib/drawing-collection.ts` and a branch in `[...article].astro`, following the
  relational pattern. The page file is deleted (not staged).
- D ids removed: `lost-messages-and-timeouts`, `timeouts-inside-timeouts`,
  `retries-and-idempotency-keys`, `queues-events-and-callbacks`, `reviewing-a-design`,
  `keeping-a-diagram-true`, `practise-a-cancellation-race`. The first three and the last
  now exist on C with the same id. No page outside the family linked any of them.
- D ids kept with new headings: `found-messages-and-timers` ("Flows with no caller"),
  `actors-notes-and-participants`, `other-tools` ("Writing a diagram as text").
- D ids added: `reading-a-design`, `round-trips`, `fork-and-stair`, `chatty-calls`,
  `trust-boundaries`, `other-dialects`.
- C ids removed: `three-questions-for-every-asynchronous-arrow`,
  `the-broker-as-a-participant`, `queue-or-topic`, `acknowledgement-and-redelivery`,
  `messages-that-keep-failing`, `competing-consumers-or-subscribers`,
  `the-correlation-id`, `flows-that-last-hours-or-days`, `sagas-and-compensation`,
  `orchestrated-or-choreographed`, `which-view-for-a-long-running-workflow`,
  `questions-to-put-to-every-arrow`, `try-a-completed-repair-event`. None was linked
  from outside the family.
- Links changed outside the family: `src/articles/drawing-systems/index.md` lines 51 and
  108 (the timeout now lives in the companion; the reading list names the companion).

## Style-reference passages

- D opening: kept, with two small additions (the arrows order events on different lines;
  what the diagram doesn't show, with a link).
- The two paragraphs after the three-losses figure ("The worker’s bar and status are the
  same every time…", "A timeout records only…") moved unchanged to C, after its Figure 1.
  `.claude/skills/staycurrent-style/SKILL.md` names them as being in the deep dive; that
  skill needs updating by someone allowed to edit it.
- The end of "Synchronous and asynchronous messages": unchanged and still in D.

## Checks

- Headless Chromium, phone (375 px, light) and desktop (1280 px, dark), reduced motion:
  no console errors, no horizontal scroll, every figure ready. New figures inspected at
  both widths, including the alternate states of Figures 10–12; Figure 12's loop guard
  was shortened after it overlapped the pass counter at 375 px.
- Site-check page rules run against the two dev-server pages and their link targets:
  no issues. Source rules: no issues. `pnpm build` not run, per the brief.

## Unsure

- The companion is 19 minutes against the plan's 15. Further cuts would come from nested
  timeouts or the practice; both were judged worth their cost.
- The collection intro is fixed: `index.md` line 49 now reads "whose events happen in order
  from top to bottom". `docs/article-work/drawing-systems/` may still say "time runs
  downwards"; outside this assignment.
- The style skill's reference list now points at a passage that has moved (above).
- The fork/stair source is an archived copy of IBM's RUP pages; IBM no longer hosts them.

## Repairs after the three reviews (18 October)

From the editorial, technical and first-reading reviews in this folder.

- Ordering gaps. The deep dive now explains the five-minute claim as a lease after
  Figure 4. `alt` is glossed where "How much to draw" first uses it (`ref` already was).
  A short key to reading Mermaid sits under Figure 1, and the closing section points back
  to it. The sketching paragraph moved to the end of "Choosing what to draw".
- Correctness. The saga figure opens on Declined, and the prose says to compare it with
  Accepted. Its lost-reply circle now sits between Booking and Scheduling. Figure 13 is
  OpenID Connect sign-in on the OAuth code flow, with `code_challenge` and
  `code_verifier` in the labels, a paragraph on why the client secret isn't enough, the
  sign-in note over the provider alone, and RFC 9700, RFC 7636 and OpenID Connect Core
  in Sources. The marks table calls PlantUML's `->x` a lost message and adds `[o->`, and
  a sentence after it restores the `->` warning. TLS says "a full handshake", notes
  False Start and resumption, and adds `ServerKeyExchange*` to the server flight (as
  "ServerHello … ServerKeyExchange*, ServerHelloDone", to fit 375 px; the summary names
  the whole flight). "Each figure's text form" became "Most figures". The companion
  restores the booking key being stored in the same transaction, the reason for jitter
  and why the lease must outlast an attempt. Smaller: RUP "describe", Lamport includes
  order on one lifeline, `--)` is asynchronous too, and Figure 7's caption names the
  `[details invalid]` section.
- Writing. "Chatty calls" defines chatty. The stale-read paragraph names two remedies.
  The opening says "only the arrows order events on different lines", limits "each
  section changes one thing" to the sections before the design readings, and those
  readings say why they leave the booking. The callback paragraphs lost a repeated
  sentence, and the long-waits sentence became three. Ordering and gaps says the timing
  differs but the diagram can't tell the settings apart. `critical` is down to two
  paragraphs, keeping the definition and the transaction warning.
- Figures. While playing, the narration under a figure keeps naming the last step until
  the next one starts, so Figure 2 at 3 s no longer names the reply early. A Next pressed
  while an earlier Next is still animating now finishes that step and moves on, where
  before it was swallowed.
- The "jump back to step 1" report: reproduced, and it is the dev server. Edits by other
  agents trigger Vite full-page reloads, and the reloaded figure autoplays from the start
  when in view. No published page does this.
- Reading time on the TitleLine: the deep dive rose from 25 to 27 minutes with the added
  explanations (lease, Mermaid key, PKCE, the `->` warning, False Start, chatty), less
  the `critical` cut. The companion stays at 19.
