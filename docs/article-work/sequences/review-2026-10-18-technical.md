# Sequence diagrams: technical and figure review, 18 October 2026

Perspective: technical reviewer and figure tester, after the 18 October style pass. I read
the rendered page, then the style-pass note, then the exact changes. The working-tree diff
also holds the 17 October deepening, so I diffed against the pre-pass snapshot in the
style-pass scratchpad (`before/snapshot.tar`) to isolate this pass.

How I tested: a private headless Chromium (Playwright's cached `chrome-headless-shell`,
driven over the DevTools protocol) against the dev server, with the dev server's
live-reload client blocked. The shared browser pane was in use by other agents, and the
dev server reloads open pages whenever another writer saves a file; my pane tab reloaded
mid-test. Every new or changed figure was driven from the keyboard through every setting,
in light and dark, at 846 px and 375 px, and with `prefers-reduced-motion: reduce`.

## What works

These passages are accurate and the figures do what the prose says. Keep them.

- **Figure 6, The browser gives up after 2 seconds.** Moving the timeout out of Figure 2
  gives each figure one job. The clock reads 2.00 s at the timeout note and 3.00 s at
  `COMMIT ok`, which matches "an error at 2 seconds" and "commits at 3 seconds" exactly.
  The note "Nobody is listening. R17 is stored." settles the 17 October objection that the
  late `201` was drawn as received.
- **Figure 8, The same messages in another order.** The row slide is the clearest
  demonstration of the ordering rule on the site. I checked the claim directly: in both
  drawings every lifeline has the same events in the same order and every message has the
  same sender and receiver, so under UML 2.5.1's trace semantics they describe the same
  interaction. Transcript, summary, narration and the early-poll source all agree with the
  drawing. Interrupting a slide with Play finishes it cleanly. With reduced motion the
  drawing jumps and the narration line says what moved.
- **Figure 11's new note** makes the figure, its listing and "as the figure does" agree.
- **The 5xx split.** "Only silence is drawn as a timeout" now closes the reply paragraph,
  and the 502/504 gateway case still follows. Both match RFC 9110.
- **The broker paragraph** (the 17 October fix) is intact and correct. If an editor moves
  it, the content should go with it unchanged.
- **The merged review list** keeps every condition from the old "Common mistakes" list:
  callbacks as new messages, no "failed" reply, nested limits, checkable guards, `par`
  dependencies, `critical` as a transaction, non-message arrows and mixed levels. No page
  linked to `#common-mistakes`.
- **Listings and links.** All 18 listings parse on Mermaid 11.4.1 and 12.2.0 (rechecked
  with `mermaid.parse`, using the 17 October installs). The bracket claim ("Mermaid adds
  them when it draws the frame") holds in both renderers. Every internal link and anchor
  on this page and on the async article resolves. Figure numbers 1 to 12 match every text
  reference. Without JavaScript the server renders each figure's finished default drawing.

## Findings, most consequential first

### 1. The opening's cost sentence contradicts the rest of the article

"The cost is that one diagram shows one run of the interaction." Later, the `alt` section
says "the diagram describes every path the interaction can take". The order section, the
point of Figure 8, says one diagram covers two orders of the same events. UML 2.5.1
(chapter 17) gives an interaction's meaning as a set of valid traces, not one run. A reader
who takes the opening at its word learns the opposite of what Figure 8 teaches.

The sentence is new in this pass. Smallest repair: "The cost is that the arrows draw one
path through the interaction." The rest of the paragraph can stay as it is.

### 2. Figure 6 at 500 ms shows no limit, under a title that says the browser gave up

At *500 ms* the drawing is identical to Figure 2 at 500 ms. Nothing in it shows a 2-second
limit; only the summary text mentions one. The title still reads "The browser gives up
after 2 seconds", which is false at that setting. The prose asks the reader to see that
"the same limit never comes into play", but there is no limit to see. The article's own
advice is to "write deadlines and durations in notes too, such as 'reply within 2 s'".

Repair: put a note on the browser's lifeline before `POST /repairs` in both states, such
as "Gives up after 2 s", and retitle the figure "The browser's 2-second limit". While
there, the figure labels the reply `COMMIT ok` and its source labels it `COMMIT ok, at 3 s`.
Figure 5 already writes "202 Accepted, at 14 s" in the drawing, so adding ", at 3 s" to the
figure label matches both.

### 3. The Mermaid sentence lost how lifeline order is set

Before: "`participant` declares the lifelines from left to right, and `as` gives each one a
readable name." Now: "`participant` declares a lifeline". Mermaid's documentation says
participants are "rendered in order of appearance in the diagram source text". The article
tells the reader twice to choose the order (initiator on the left; arrows between
neighbours), and no longer says how to get that order in Mermaid.

Repair: "`participant` declares a lifeline, and the order of those lines sets the order
from left to right."

### 4. Two source disclosures don't match the drawing they sit under

The pass added labels so a disclosure names the state it shows. Two still don't.

- **Figure 7**, "Mermaid source, with the key sent". The listing is the *Reply is lost*
  history with the key. With *Request is lost* and *Sent*, the drawing has a lost request
  and no "Key seen before" note. Repair: "Mermaid source, reply lost and key sent".
- **Figure 10**, "Mermaid source". The finished drawing shows the last pass's labels,
  `status: scheduled` and `200: scheduled`. The listing says `status: received` and
  `200: received`. Repair: write the replies generically in the listing, `status` and
  `200: status`, as the `break` listing already does. Rerun the parse check after.

### 5. Figure 8's prose says slightly more than the figure shows

- "So the two drawings are the same diagram." They differ in the worker's note ("Polls
  just after the commit" against "Next poll, 0.7 s later"), and the slide changes that
  text. What is true, and what the figure's own narration says, is that they describe the
  same interaction. Repair: "So the two drawings describe the same interaction."
- "Figure 4 put the `201` first only because the rows have to go somewhere." In Figure 4's
  run the worker polled 0.7 s later, so the `201` really did come first. The point is that
  nothing in the diagram promises it. Repair: "Figure 4 drew the `201` first, but nothing
  in the diagram promises that order."

### 6. "The next section" points to the wrong section

In Timeouts inside timeouts: "a key on the booking request, like the one on the email in
the next section". The next section is Found messages and timers; idempotency keys come
one section later. This was there before the pass, but the pass rewrote the paragraph.
Repair: name and link it, "like the one on the email in
[Retries and idempotency keys](#retries-and-idempotency-keys)".

### 7. Figure 11: the *Status never arrives* ending, and stepping

- In the *Status never arrives* case, playback ends by narrating the plain note "Show the
  page once both replies are in" as the last step. It reads as if the page appeared, which
  is the opposite of the case. Repair: in that case only, give the note the warning tone
  with the text "Page not shown: still waiting for the status", or end playback at the
  frame.
- Stepping with the scrubber's arrow keys misreports overlapping events. After a reset,
  the first press shows 2 / 7, the second jumps to 4 / 7, and the next two presses stay
  at 4 / 7 with the narration still on `GET /slots`. The two "section begins" events in
  the transcript are never narrated. The cause is in the player: `stepAt()` picks the
  last event whose start time has passed, so events that start close together collapse
  into one step. This predates the pass and only shows where events overlap. It doesn't
  block, but a keyboard or screen-reader user stepping through `par` gets a confusing
  account of the one figure about overlap.

### 8. The lifeline-count sentence now states something the renderer doesn't do

"Past about eight the labels start to shrink." The pass dropped "That is an observation
about these figures, not a rule", so this now reads as fact. The figure code keeps the
font fixed (11.5 px on phones, 13 px otherwise; `layout()` in `sequence-model.ts`). Past
about eight lifelines the header boxes get narrower than the names, which then overflow
their boxes; nothing shrinks. The editorial review suggests generalising the sentence or
cutting it. Either repair also fixes the inaccuracy.

### 9. Small, optional

- The async article links to `#found-messages-and-timers` twice with the text "section on
  messages with no sender", the old heading. Both links resolve. Changing the text to
  "Found messages and timers" would match the renamed heading.
- On every figure with status text (2, 3, 4, 5, 6, 7), the dashed lifeline runs through
  the status words ("gave up", "has R17", "idle"). Message labels have a halo stroke and
  the status text doesn't. This predates the pass; it's cosmetic.
- Figure 8's narration of what moved is replaced by the last message's text on any
  redraw, such as a window resize. It's harmless.

## Figures tested

| Figure | Settings driven | Light / dark | 375 px | Reduced motion | Transcript | Source |
|---|---|---|---|---|---|---|
| 2 Who is waiting | 5 ms, 50 ms, 500 ms, 3 s | both | yes | starts finished; changes jump | matches | matches; bars on browser absent, as the prose says |
| 6 Browser gives up | 500 ms, 3 s | both | yes | yes | matches both states | matches 3 s state except "at 3 s" (finding 2) |
| 8 Same messages, another order | both polls, slide, play during slide, back | both | yes | yes | matches both states | matches early poll exactly |
| 11 Two requests in parallel | all three | both | yes | yes | matches | matches |

At 375 px no figure causes horizontal page scroll, including with every disclosure open.
Long source lines scroll inside their code block. All controls work from the keyboard:
Tab reaches each option, Enter selects it and keeps focus, Back and Next respond to
Enter, and the scrubber's arrow keys step. Focus rings are visible in both themes. The
console showed no errors on either page.

## Async interactions

`/learn/drawing-systems/async-interactions/` renders at 846 px in dark and 375 px in light.
All six figures start, each has its transcript, there's no horizontal scroll and no console
error. Its thirteen links into this article resolve, including both links to the renamed
heading's anchor.

## Not checked

- The site's theme switch itself. I emulated the system colour scheme instead. The CSS path
  is the same, because both set `data-theme`, but the switch writes `localStorage` and would
  have changed other agents' open tabs.
- Screen-reader output. I only checked the `aria-live`, `aria-pressed` and text-alternative
  markup.
- Safari, Firefox and real touch devices. All testing used headless Chromium.
- Figures 1, 3, 4, 5, 7, 9, 10 and 12 through their settings. I only compared their
  default drawings with their transcripts and sources.
- PlantUML syntax claims, which this pass didn't change.

## Verdict

**Ready after the listed repairs.** The pass kept the article accurate where it counts.
Every listing parses, every link resolves, and the 17 October fixes are intact. The two new
figures teach their points cleanly at every setting, in both themes, at phone width and
with reduced motion. Findings 1 to 3 should be fixed before the page becomes the reference.
The new opening sentence contradicts the article's own model of what a diagram means.
Figure 6 asks the reader to see a limit it never draws. A condition the reader needs for
Mermaid was lost when two sentences were merged. Each is a one-sentence or one-label
repair. Findings 4 to 8 are small and could ride along. Finding 7's stepping fault is a
player issue to schedule separately.

## Recheck after repairs

I rechecked the writer's repairs, listed in "Repairs" in `style-pass-2026-10-18.md`, using
the same private headless Chromium against the dev server. I covered both pages, light and
dark, 846 px and 375 px, and reduced motion.

### Earlier findings: all fixed

- **1, opening.** It now reads "the arrows draw one path through the interaction".
- **2, Figure 6.**
  - The figure is retitled "The browser's 2-second limit".
  - "Gives up after 2 s" sits at the top of the browser's lifeline in all four states.
  - The figure and the listing both say `COMMIT ok, at 3 s`.
  - The panel is now labelled "3 s write and no API limit". Its listing matches that
    drawing event for event.
- **3, lifeline order.** "The order of those lines sets the order from left to right" is
  back. It matches Mermaid's "order of appearance".
- **4, source labels.**
  - Figure 7's panel names its state.
  - Figure 10's listing now uses generic replies, so it holds for every pass.
- **5, Figure 8 prose.** It now says the drawings "describe the same interaction", and that
  nothing promises the 201 comes first.
- **6, pointer.** The pointer now links to Retries and idempotency keys by name.
- **7, Figure 11.**
  - *Status never arrives* now ends on the warning note "Page not shown: still waiting for
    the status".
  - Stepping goes 1 to 7, and both section starts are narrated.
- **8, lifeline count.** The sentence is gone.
- **9, status words.** They now have the label halo.

### New material checked

- **Figure 6, *API gives up after*.** I drove all four states from the keyboard.
  - At 1.5 s, the API's timeout note lands at 1.53 s, and the `503` reaches the browser at
    1.56 s, inside the browser's 2 s.
  - The database stays "working" after the API has given up, and `COMMIT ok, at 3 s` follows
    at 3.00 s.
  - In both 500 ms states the notes are drawn and no limit fires, as the summary says.
  - Transcripts match the drawing in every state.
  - Answering `503` matches RFC 9110's "unable to handle the request". It also ties back to
    the article's own point that a 5xx doesn't prove nothing was done.
- **`critical`.** Every claim matches UML 2.5.1.
  - §17.6.3.14 says a region "cannot be interleaved by other OccurrenceSpecifications (on
    those Lifelines covered by the region)". It names `par` as the case this prevents.
  - Figure 17.12 is the 911-call example, and the article describes it accurately.
  - The two-worker listing does put Worker B's claim on Repair DB between Worker A's claim
    and its reply.
  - "UML gives a critical region no such sections" is fair: §17.12's one-operand
    constraint doesn't cover `critical`, but the spec gives fallback sections no meaning.
  - The page cites chapter 17 with `critical` regions named. That is enough for a reader to
    find the clause.
- **`alt` rule.** "At most one … one whose guard is true" and the `[else]` rule match
  §17.6.3.7.
- **Inline `+`/`-` lines.**
  - They are correct: in Mermaid, `+` starts the receiver's bar and `-` ends the sender's.
  - Each stays on one line, even at 324 px.
  - Because they are inline code, not listings, "every listing is complete Mermaid" still
    holds.
- **Listings.**
  - There are 17, and all parse on Mermaid 11.4.1 and 12.2.0.
  - Figure 1's listing follows the paragraph that introduces Mermaid, and Figure 1 has no
    source panel.
- **Stepping.** I swept all 12 players here and the 6 on the async article.
  - Each press of the scrubber's arrow keys raises the counter by one, and the narration is
    the matching transcript line.
  - Time never runs backwards, and Back returns to 0.
  - Reduced-motion playback visits every step in order.
  - Figure 8's slide still works.
  - Neither page logged a console error.
- **Links and layout.**
  - None of the 56 links here or the 57 on the async article is broken.
  - At 375 px there's no page scroll with every disclosure open.

### New findings, all small

**R1. Figure 6 leaves one condition unstated: the API only stops waiting.** "The write
still commits at 3 seconds" holds because nothing tells the database. A reader who builds
the API's limit into the database, such as PostgreSQL's `statement_timeout`, gets the
statement rolled back and reported. Their `503` would then be right. The idempotency key is
still needed, because that reply can be lost too. Smallest repair, in the paragraph after
the figure: "The API only stops waiting. Nothing tells the database, so the write still
commits at 3 seconds."

**R2. Steps that share a moment.** In Figures 9, 11 and 12, and in Figure 2 of the async
article, two events start together. So two steps in a row show the same drawing.
- In Figure 9, steps 2 and 3 narrate the `alt` sections, but no frame is drawn yet. Only the
  faded `422` from the skipped section shows. The frame appears at step 4.
- In Figure 11, step 2 already shows the slots request 81% drawn.
- Continuous playback was left as it was, and it never narrates Figure 9's three frame
  events.

None of this misleads, because the transcript has every event. Repair, in the player: pin
a frame event's step to the end of the frame's fade-in rather than its start.

**R3. One empty press at each end.** Next on the last step moves to the finished drawing
without changing the count. Back from the finished drawing does the same in reverse. In
Figure 11 nothing visible changes either way. Repair: take the last step's time as the end
of the figure.

**R4, optional.** Figure 4 and the paragraph about it say `503 Unavailable`, while Figure 6
says `503 Service Unavailable`. RFC 9110's name for 503 is "Service Unavailable".

### Updated verdict

**Ready as a reference.** Every finding from both reviews has been repaired. The new Figure
6 control and the `critical` section are accurate against RFC 9110 and UML 2.5.1. The
stepping change does what it claims on all 18 players across the two pages. R1 is worth the
one sentence at the next edit, because it states a condition the figure relies on. It
doesn't change what the reader should draw or do. R2 and R3 are player polish to schedule
with other player work.
