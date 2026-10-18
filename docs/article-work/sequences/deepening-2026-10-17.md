# Sequence diagrams: in-place deepening, 17 October 2026

Carries out the in-place parts of `coverage-map-2026-10-17.md` on
`src/pages/learn/drawing-systems/sequences.astro`. Nothing was committed.

## Brief

Reader: a working engineer who draws sequence diagrams to design, document and
review systems. Outcome: after the article they can draw a diagram that answers one
question, read someone else's for false guarantees, and know where Mermaid stops.
The failure sequence (sync/async, outbox, lost message, retry, idempotency key) and
the Mina/R17/J9 story are kept as they were (map section 0). Section order follows
the argument, so the failure run stays contiguous and the new sections slot in where
the story needs them.

Boundaries. Two articles are written in parallel and linked with plain links:
`/learn/drawing-systems/async-interactions/` owns brokers, fan-out, ack/redelivery,
overtaking, webhooks at length, long-running flows and sagas; `/learn/drawing-systems/sequence-syntax/`
owns full syntax tables. This article keeps syntax beside each example, a short
queue/callback bridge (about 400 words, two listings) and a short other-tools section.
`src/lib/drawing-collection.ts` was not touched. The parked distributed-systems idea
stays parked: flows are drawn, no theory is taught, and the queue section says so.

## Decisions against the map

| Map item | Done |
| --- | --- |
| 3.1 opening | one sentence on scope, timeouts and review; PlantUML mentioned |
| 3.2 lifeline = role; instances | paragraph added; two-lifeline rule |
| 3.3 omit replies/activations; wording fix; activate/deactivate | done, listing for `activate` |
| 3.4 sync/async is about the sender; Mermaid arrows carry no meaning | done |
| 3.5 poll loop, two workers | one sentence and a `Worker A/B` listing |
| 3.6 error reply vs silence; nested timeouts | h3 "Timeouts inside timeouts"; Figure 2 gained a "Browser gives up after" parameter |
| 3.7 draw attempts vs policy; stacked retries | two sentences and the 3x3x3 example |
| 3.8 critical, ref as h3, loop bounds, rare operators, nesting | done (h3s: break, critical, ref, rare operators and deep nesting) |
| 3.9 symbols, box | added to the participants section, heading renamed |
| 3.10 time and ordering | new h2 after Retries; reorder listing uses Figure 4's events |
| 3.11 async bridge | h2 "Queues, events and callbacks" |
| 3.12/3.13 scope and readability | h2 "How much to draw" with Figure 10 |
| 3.14/3.15 review, keeping in sync | h2 with nine questions, an application to Figure 4, trace paragraph, h3 on keeping true |
| 3.16 Mermaid table, other tools | table extended; new h2 with translation table and a PlantUML listing |
| 3.17 common mistakes | short h2, each item linked to the section that teaches it |
| 3.18 practice | h2 "Practise with a cancellation race", discussion in a disclosure |
| 3.19 sources | PlantUML, the two new articles and a reason line per related article |

Not done, on purpose:
- The map suggested a swap-order parameter on the `outbox` figure. Reordering in the
  existing builder would draw the worker's rows inside the browser's wait bar and
  imply the API waits for the worker, so the reorder is a second Mermaid listing in
  prose instead.
- The annotated-outbox review figure: the review questions are applied to Figure 4 in
  prose, which keeps the question list readable on a phone.
- Map note on the `option` row of `critical`: kept to one clause (see evidence).
- Collection blurb and index line ("The articles") were not changed; the coordinator
  owns `drawing-collection.ts` and the index.

## Figures

- Figure 2 (`waiting`): new parameter "Browser gives up after" (No limit / 2 s). With
  the database at 3 s and 2 s selected the browser's wait ends at a timeout note, the
  write commits at 3 s and a 201 arrives for nobody. Unchanged otherwise.
- Figure 10 (`scope`): new scenario using the existing player. "Everything in one"
  (7 lifelines, alt, 13 messages on the valid path), "Booking only" and "Email only"
  (each with a `ref` frame). Participants `gateway` and `auth` added in
  `sequence-model.ts`.
- Checked in the Browser pane: Figure 2 and Figure 10 at desktop light; Figure 10 at
  375 px dark, all three views; no horizontal page scroll at 375 px.

## Evidence

Checked 17 October 2026.

- Mermaid, https://mermaid.js.org/syntax/sequenceDiagram.html (fetched): arrow table
  (`->` and `-->` no arrowhead; `->>` filled head; `-)`/`--)` open head, async;
  `-x`/`--x` cross); `<<->>` v11.0.0+; create/destroy v10.3.0+; autonumber start and
  increment v11.15.0+; half-arrows and central connections v11.12.3+ (not used);
  `critical`/`option`, `break`, `rect`, `box` (hex colours not supported) with no
  version marker; participant types by JSON configuration, no version stated;
  no `ref`, found message or delay.
- Parsed with `mermaid.parse` under jsdom (not rendered): all 20 listings pass on
  Mermaid 11.4.1 and 12.2.0 (12.2.0 is npm latest on this date). The line
  `participant Q@{ "type" : "queue" }` fails on 11.4.1 and passes on 12.2.0; the
  article says so. `<br/>`, `box`, `rect`, `activate`, `<<->>` and `--)`, `--x` parse on both.
- PlantUML, https://plantuml.com/sequence-diagram (fetched): `->`, `-->`, `->>`, `->x`,
  `->o`, `[->`, `->]`, `->(10)`; participant keywords; `box ... end box`; `ref over`
  with `end ref` for the long form; `...text...`; `== x ==`; `autonumber`; `++`/`--`
  shortcuts; `autoactivate`, `return`; `&` parallel messages need `!pragma teoz true`.
  **The PlantUML listing and the translation table were written from the docs and
  not rendered: no Java runtime or PlantUML jar is available and downloading one was
  not authorised.** Render with a named release before publication.
- UML 2.5.1: the OMG PDF could not be fetched (over the fetch size limit). Claims
  resting on secondary sources only (uml-diagrams.org and Sparx were unreachable;
  search results from IBM Rational and MEGA documentation):
  `loop(minint, maxint)` notation; `critical` as a region whose events other events
  cannot interleave with; a found message as a message with no drawn sender;
  `neg` meaning a forbidden trace; `seq, strict, neg, assert, ignore, consider` as the
  remaining operators. The article words each as UML's definition, not as exact
  spec text. Still unread: UML 2.5.1 chapter 17 for critical, loop bounds, found
  message, duration constraints and the "UML has no `option` sections" clause.
- Not verified: which Mermaid version GitHub and GitLab currently render with, so
  the article says only to check the host's version. Not verified: that a 5xx never
  hides a completed side effect, so the article says to check the provider's documentation.
- Retry arithmetic (3 x 3 x 3 = 27) is illustrative.
- The practice answer's `UPDATE ... WHERE status = 'Approved'` reporting rows
  changed is generic SQL behaviour; no engine was run.

## Open points for review

- Independent review (staycurrent-review), including a reader new to sequence
  diagrams for the scope, review and practice sections, has not been run.
- `async-interactions.astro` links to `#break-and-ref`, which no longer exists here:
  the h3 is now `#break` and `#ref`. Update that link to `#ref`.
- `pnpm build` fails on this checkout for a reason outside this article:
  `indexing-queries.astro` declares a companion of a deep dive the TitleLine cannot
  find. With the two unfinished relational pages removed in a scratch copy, the build
  and all other check-site rules passed; only the expected internal links to
  `/learn/drawing-systems/sequence-syntax/` and `#break-and-ref` failed.

## Ownership repair (coordinator request, same day)

- The 20-row Mermaid reference table, the translation table and the arrow-mismatch
  paragraph were removed; the companion owns them. "Mermaid syntax reference" no
  longer exists as an h2: the tools section ("Mermaid, PlantUML and what Mermaid can't
  draw", `#other-tools`) lists the four arrows and activation markers the examples use,
  advises checking the host's Mermaid version, and links to the companion and to
  maintaining.
- "Queues, events and callbacks" is now two short paragraphs, no h3s, no listings. The
  queue and bounce listings were removed. It links to the async article's broker,
  redelivery, fan-out and webhook sections. The "Common mistakes" callback item now links
  to `async-interactions/#webhooks-and-callbacks`.
- Version facts now follow `docs/article-work/sequence-syntax/evidence.md`: participant
  symbols need Mermaid 11.11 or later (the article names no other version-gated syntax
  except decimal autonumber, 11.15; whole-number `autonumber 10 5` works in older
  releases). Version label is "Mermaid 12". All listings still parse on 11.4.1 and 12.2.0.
- PlantUML: `->o` is a filled circle in 1.2026.9 per the companion's renders, matching UML;
  the article now says so. The PlantUML listing's constructs (`[->`, `->x`, `...`,
  `ref over`) are in the companion's parsed-and-drawn list for 1.2026.9; the exact
  listing was not itself rendered here.
- Figure 10 re-checked at 375 px: "Booking only" ref frame now spans the diagram and
  holds its text; "Everything in one" headers collided, so its lifelines are labelled
  Web app, Gateway, Auth, API, DB, Job worker, Provider with short forms.

## Repair after the trio reviews (17 October)

Per `conventions-2026-10-17.md`. Changes in `sequences.astro`: `critical` listing now a single
region (no `option`), prose says UML forbids interleaving and gives no fallback sections,
Mermaid's `option` reading is named as Mermaid's own; Mermaid's `-)` is documented async
(two places reworded); new h3 `#found-messages-and-timers` defines a found message and says
when to use a note, a found message or a scheduler lifeline; Figure 2 and Figure 5 late
replies get a "Nobody is listening / waiting" note; 5xx names 502/504; `autonumber` moved
to "Making it readable"; order section starts from Figure 2's no-scale point; alt says
several guards may be true; loop/break wording; race exercise re-reads the status before
the 409; locking-read sentence split; release numbers and the closing tool list/PlantUML
listing removed (companion owns them); C4, "whiteboard" and "state lifecycle" explained or
linked. Figures: Figure 10 uses the same names as every other figure; the alt frame ends at
Repair DB; phone headers are solved in `layout()` by staggering two rows of wider boxes and
clamping boxes inside the svg (shared by all scenarios).
Not re-checked at 375 px: Figure 5's slow case after the note was added (same note
mechanism as Figure 3).
