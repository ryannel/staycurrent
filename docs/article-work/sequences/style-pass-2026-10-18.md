# Style pass on Sequence diagrams, 18 October 2026

Carries out the Sequence diagrams section of `docs/article-work/style-dogfood-2026-10-18.md`
and the shared fixes in the style-pass brief. A light pass: depth, mechanisms and the
17 October accuracy fixes are unchanged.

## What changed and why

- **Opening.** Dropped the preview paragraph and the PlantUML sentence. "Time runs down
  the page" became "time runs down each line", the reading the order section relies on
  (the depth comparison flagged the old phrase). Added the diagram's cost, which the
  shared fixes ask for and the opening lacked: one diagram shows one run, so branches,
  repeats and failures need a frame or a diagram of their own. The Mermaid housekeeping
  moved beside Figure 1, where the first "Mermaid source" disclosure appears. The
  opening now runs: what it is, what it's for and when to reach for one, its cost, then
  Mina's booking.
- **Code listings.** `SequencePlayer` takes an optional `source` (and `sourceLabel`) and
  renders it as a closed "Mermaid source" disclosure under the transcript. Listings
  that redraw a figure moved there; listings that teach a notation decision, or depict
  something no figure shows, stay visible.

  | Listing | Now | Why |
  |---|---|---|
  | booking | Figure 1 source | Redraws Figure 1. Its three syntax points (`participant`, `->>`, `-->>`) kept in one sentence of prose. |
  | activations | Figure 2 source | Redraws Figure 2. The `+`/`-` sentence stays in prose. |
  | asyncSend | Visible | `-)` against `->>`. |
  | outbox | Figure 4 source, "when both work" | Redraws Figure 4. |
  | twoWorkers | Visible | No figure shows two workers claiming. |
  | lost | Visible | `-x` for a lost message. |
  | nested | Figure 6 source, "for the 3-second write" | Redraws the new Figure 6. |
  | retry | Figure 7 source, "with the key sent" | Redraws Figure 7 with the key on. |
  | pollCycle | Visible, moved to Found messages and timers | It is the Mermaid workaround for a flow with no caller (note plus `activate`), so it sits with that decision rather than in the bars section. |
  | reorder | Figure 8 source, "for the early poll" | Redraws the new Figure 8's default state. |
  | altOpt, loop, par | Figures 9, 10, 11 sources | Redraw their figures. Each draws every path, so no state label is needed. |
  | breakLoop, critical, ref, participants | Visible | Only depiction of `break`; Mermaid's reading of `critical`; the note that stands in for `ref`; actors, self-messages and create/destroy. |
  | race | Unchanged, inside the practice discussion | Already out of the reading path. |

  A disclosure shows one state of the figure, so the three figures whose drawing changes
  with a setting name that state in the summary text. No listing's text changed.
- **Order and gaps.** New Figure 8 (below). "Both listings are the same diagram" became
  prose about what the reader just watched.
- **Timeouts inside timeouts.** New Figure 6 (below). Figure 2 lost its *Browser gives up
  after* control and now has only the database time. The section no longer sends the
  reader back to Figure 2.
- **Outbox.** Opens with the fix happening (the job written with the booking, a worker
  picking it up), shows Figure 4, then names the transactional outbox and the background
  worker. Definition-first openings stay for lifeline, activation bar, lost message,
  found message and the fragments. Dropped the closing signpost to the next two sections;
  the section now ends on the duplicate email.
- **Review list and common mistakes.** Merged into one twelve-question list under
  "Reviewing a design with a sequence diagram". The "Common mistakes" h2 is gone (no page
  linked to `#common-mistakes`). Each mistake became a question or a clause on one; the
  worked application ("Try three of them on the outbox diagram") is unchanged.
- **Figure renumbering.** Figures now run 1 to 12. Text references updated: Figure 4
  (provider down, worker crash), Figure 2 (no scale), Figure 6, 7, 8, 9 and 12 (the
  `ref` split and How much to draw). "As in the listing below" and "as below" now point
  at figures.
- **Shared fixes.** Split paragraphs at reasoning steps (lifeline roles, sender not
  protocol, the claim lease, 5xx replies, nested limits, idempotency keys, three ways to
  start a flow, critical, queues, readability). Split the two sentences over 35 words.
  Heading "Messages with no sender in the diagram" became "Found messages and timers",
  the field's term (id unchanged). Dropped one research note ("That is an observation
  about these figures, not a rule") and two signpost endings ("How much to draw returns
  to this", the parenthetical pointer after retry stacking). The queues paragraph now
  names the async article once instead of four deep links.

Measured with the same rough script as the assessment, on the rendered page: prose about
6,230 words, mean paragraph 45 words (was 49), mean sentence 14 words, one sentence over
35 words. Twelve figures (was ten).

## Figures

- **Figure 2, Who is waiting** (changed). Its one job is now the nested wait and that
  height isn't time: one control, the database time.
- **Figure 6, The browser gives up after 2 seconds** (new, scenario `nested`). Figure 2's
  model with the browser's 2-second limit in play. Job: an outer limit shorter than the
  inner work leaves the work finishing after nobody listens. One control, *Repair DB
  takes* 500 ms or 3 s (default 3 s), so the reader sees the limit matter only when the
  work outlasts it. The 3 s drawing is the former Figure 2 timeout branch, moved.
- **Figure 8, The same messages in another order** (new, scenario `order`). Figure 4's
  participants and messages up to the email request, without bars or clock. Job: show
  that two vertical orders are one interaction. Control: *Worker polls*, just after the
  commit (default, matches the existing `reorder` listing) or 0.7 s later (Figure 4's
  order). Changing it doesn't replay: the player slides the 201 and the worker's poll
  (note, claim, reply) past each other over 0.9 s while every other row stays still, then
  says what moved in the narration line. This is a new opt-in `morph` flag on the
  scenario; reduced motion jumps straight to the new drawing. Play, step and reset work
  as on the other figures.
- **Figure 11, Two requests in parallel** (changed). Gained the note after the frame,
  "Show the page once both replies are in", so the figure matches its listing and the
  text's "as the figure does".

Checked in the browser on the dev server at desktop width and at 375 px: no console
errors, no horizontal scroll, all twelve players start, Figure 8's morph completes and
announces its note, disclosures open. `async-interactions` (which shares the player)
still renders. Not checked: the light theme and reduced-motion path by eye.

## Claims checked

- Every listing (18) parses with `mermaid.parse` under jsdom on Mermaid 11.4.1 and
  12.2.0, using the installs from the 17 October check. No listing text changed, so the
  article's two claims ("complete Mermaid", "parses on 11.4.1 and 12.2.0") stay true.
- "Mermaid adds the brackets when it draws the frame": Mermaid 12.2.0's sequence renderer
  wraps fragment labels as `` `[${msg.message}]` `` (`adjustLoopHeightForWrap`).
- Figure 8's claim that both orders are one diagram follows from the article's own two
  ordering rules (UML 2.5.1 weak sequencing): each lifeline's events and every
  send-before-receive pair are identical in both drawings.
- New prose otherwise restates existing, already-checked claims.

## Unsure

- **Booking listing.** The assessment's four visible listings don't include the first
  booking listing, so it moved into Figure 1's disclosure and its syntax became one
  sentence. The consolidated depth plan keeps "one short code sample"; if the editor
  wants one visible sample to teach the format, booking is the candidate.
- **pollCycle and twoWorkers stay visible** as the only depictions of their ideas. Either
  could go into a disclosure if the editor wants fewer visible listings.
- **The cost sentence in the opening** is new prose, added because the shared fixes ask
  for the main cost. It restates How much to draw.
- **Coverage map.** `coverage-map-2026-10-17.md` still lists "Common mistakes" as its own
  section (§3.17) and its figure numbers are pre-pass. No coverage changed; only the
  arrangement did.

## Repairs, after the editorial and technical reviews

Both reviews (`review-2026-10-18-editorial.md`, `review-2026-10-18-technical.md`) said
"ready after the listed repairs". The coordinator accepted their findings and decided the
choices. Where this section differs from the sections above, this section is current.

- **Opening cost.** It now says "the arrows draw one path through the interaction", not
  "one diagram shows one run". The old wording contradicted `alt` and Figure 8.
- **Mermaid's first appearance.** Figure 1's listing is open again, straight after the
  paragraph that introduces Mermaid, and Figure 1 has no source panel. The prose again says
  that the order of the `participant` lines sets left to right; Mermaid draws participants
  in order of appearance, and the ordering advice depends on that. Replies and activation
  bars quotes the two changed lines inline (`UI->>+API`, `API-->>-UI`) instead of the
  42-word sentence. They stay inline rather than as a two-line block, so "every listing is
  complete Mermaid" stays true. A `seq-line` class keeps each quoted line unbroken at
  phone width.
- **Combined fragments.** One-sentence definition, then Figure 9, then operator, sections
  and guard named on the drawing. The several-guards rule became "one whose guard is true"
  plus the [else] rule (UML 2.5.1 §17.6.3.7).
- **Outbox.** Cut "two starting points" (now one clause in `ref`, where it motivates the
  split). Moved "one pass of the worker's poll" to the end of `loop`, as when not to draw a
  loop frame. The *Worker crashes* prompt now follows *Provider down* directly; the claim,
  the two-worker listing and the newly named **lease** come after it and end on why the
  second email goes.
- **Lost messages and timeouts.** Removed the h3 "What the caller knows" (no page linked to
  it). Found messages and timers moved ahead of the nested-timeout section (id kept), so
  that section now hands straight to retries, linked by name. Heading is "Nested
  timeouts" (id `timeouts-inside-timeouts` kept). The 503 paragraph ends at "Only silence
  is drawn as a timeout".
- **Figure 6, retitled "The browser's 2-second limit".** The limit is a note at the top of
  the browser's lifeline in every state. A second control, *API gives up after* (no limit
  or 1.5 s), shows what the API does at its own limit. Its note reads "Timeout after
  1.5 s. Outcome unknown.", it answers `503 Service Unavailable` while the browser is still
  listening, and the write commits anyway at 3 s. The prose gives the fix and its cost.
  The cost is that the 503 is wrong, and a cancel after the commit changes nothing. The
  idempotency key resolves it. Listing and figure both say `COMMIT ok, at 3 s`. The
  listing gained the "Gives up after 2 s" note, and its panel is labelled "3 s write and
  no API limit".
- **critical.** No listing now. A critical region forbids other events on its lifelines
  between its first and last message (UML 2.5.1 §17.6.3.14). That isn't true of a claim
  on Repair DB, and the two-worker listing shows it isn't. The prose gives its natural
  home, inside a `par`, with UML's own example (Figure 17.12, an operator who forwards an
  emergency call before anything else). It says service-level diagrams rarely need it,
  and that a `critical` with options means Mermaid's reading. 17 listings now; all parse
  on 11.4.1 and 12.2.0.
- **Figure details.**
  - Figure 7's panel says "reply lost and key sent".
  - Figure 10's listing replies are generic (`status`, `200: status`).
  - Figure 8's prose says the drawings "describe the same interaction" and that nothing
    promises the 201 comes first. The "page for R17" became the booking already existing
    when the email arrives.
  - Figure 11 ends *Status never arrives* on a warning note, "Page not shown: still
    waiting for the status", and its panel says "when both replies arrive".
- **Stepping (player).** Back, Next and the scrubber's arrow keys now step one event at a
  time; reduced-motion playback does the same. Each event is drawn no earlier than the
  step before it, so overlapping events no longer collapse into one step. Figure 11 now
  steps 1 to 7 with each section start narrated. All six async-interactions figures step
  through every event with a rising count. Continuous playback is unchanged.
- **Removed** the lifeline-count sentence about this site's renderer, "Since version 10.3"
  and the three closing verdicts.
- **Line edits.** "Participant", "backoff", "happy path" and "callback" are now
  introduced at first use. The repeated "one level" and "initiator on the left" points are
  gone. The broker paragraph moved, unchanged in substance, to Queues, events and
  callbacks. `break` ends on what the reader should notice. The accessibility note before
  Figure 2 and "Each section above ended…" are gone.
- **Headings.** "Ordering and gaps", "ref", "Choosing what to draw" and "Lifeline order,
  labels and numbering", with ids kept.
- **Also.** Status words under each name now have the same halo as message labels, and a
  coral `error` status for Figure 6's 503.

Checked on the dev server at desktop width and 375 px:
- All 12 players start, figure labels run 1 to 12, and there are no duplicate ids or
  missing anchors.
- No horizontal scroll with every disclosure open.
- Figure 6 was driven through all four states and Figure 11 stepped from the keyboard and
  with Next.
- async-interactions renders and steps.

The prose now runs to 6,425 words: paragraphs average 45 words, sentences 14, and none
runs over 35. I didn't run `pnpm build`.

Decided against:
- Changing the async article's link text ("section on messages with no sender"). It is
  another writer's page, and the link resolves.
- Moving the "parses on 11.4.1 and 12.2.0" sentence to the companion. The brief required
  that claim to stay true on this page.
- Fixing Figure 8's narration being replaced on a resize. It's harmless.

After the technical recheck (R1 to R4):
- **R1.** The paragraph after Figure 6 now says the API only stops waiting and nothing tells
  the database, and contrasts PostgreSQL's `statement_timeout`, which rolls the write back.
  The old sentence about cancelling the statement went, because the new one covers it.
- **R2.** A frame event's step now ends when the frame has faded in, and events that end
  together are merged into one step. The current message or note is drawn slightly bolder,
  so each loop pass looks different from the one before. Continuous playback now narrates
  Figure 9's frame step.
- **R3.** The last step is the finished drawing, so there is no empty press at either end.
- **R4.** Figure 4, its summary and the paragraph about it say `503 Service Unavailable`.
- **Also.** At 375 px, two notes covered a reply label. Figure 5's timeout note has more
  room, and Figure 7's key note is shorter, with its listing changed to match.
- **Crowded labels at 375 px.** Figure 4's *Provider down* drops "no email" under the
  provider, because "down" already says it. On the async article, Figure 2's status words are
  "on route" and "invoiced", the saga's billing status is "paid", and the ack scenario's
  line is "The ack deadline passes, so J9 is offered again", which fits on one line. Each
  pair now has at least 12 px between them at 375 px, and the desktop layout is unchanged.

Checked on both pages in my own tab and in headless Chromium, at 846 and 375 px, with and
without reduced motion. Every player steps one event per key press and per Next, forwards
and back. Each step looks different from the last, and the narration matches the
transcript. Neither page logs a console error. All 17 listings still parse on Mermaid
11.4.1 and 12.2.0.
