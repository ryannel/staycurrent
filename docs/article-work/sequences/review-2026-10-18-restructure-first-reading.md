# First reading: Sequence diagrams and its companion (restructure, 2026-10-18)

Reader: a software engineer with two years' experience. I've seen sequence diagrams in
design documents but never learned to draw or read them properly.

What I read: the rendered pages at `http://localhost:4321/learn/drawing-systems/sequences/`
and then `/learn/drawing-systems/async-interactions/`, served by the local dev server on
2026-10-18. I used headless Chromium (playwright-core 1.62.1) at a 1280 px wide viewport.
I read the text in order, one section at a time, and stepped every figure with Next or
jumped to its end, under each of its settings. I took screenshots of the states I comment
on. I opened the practice Discussion only after writing my own answer. I didn't read any
source code, project docs or review notes.

This was not an outline-first reading. But because the contents list sits under the
opening, I saw the section names before reading the sections.

## Before reading

The title and the "Deep dive, about 25 minutes" label make me expect to learn the
notation properly: what the arrows and bars mean, the boxes with `alt` and `loop` I've
seen and skimmed past, and how to draw one for my own design doc. An expert could look at
someone's diagram and say what it promises and what it leaves out.

## Sequence diagrams (the deep dive)

### Opening

**After the opening alone.** A sequence diagram shows the messages between parts of a
system during one interaction, in order, with time running down each part's vertical
line. I'd reach for one when the order is the question: a request that crosses several
services, a slow page, or what happens if a service never answers. I also learned what it
*can't* do: it draws one path, so conditional or failing steps need frames or separate
diagrams, and it says nothing about structure or about how one record changes over many
runs. The second paragraph gave me "when to reach for it" ("which call comes first, which
part sits waiting"), and the third gave me its limits. That's a clear, useful opening. I
didn't feel I was being sold anything.

The running example (Mina, Repair API, Repair DB, a notification worker, an email
provider) arrives in one short paragraph, and "each section changes one thing about that
booking" told me how to read the rest. Good.

### Lifelines and messages

Expected: the basic parts. Got: exactly that. Figure 1 is static, and that suits it. Four
arrows, and I could read them before reading the caption. The point that "left to right
carries no meaning", with the convention of putting the initiator on the left, answered
something I'd always wondered about.

The last two paragraphs (one lifeline per role, unless two copies race) seemed early to
me. I didn't yet know why a race would need its own lifeline. It made sense much later, in
the companion's practice exercise. It costs only a few seconds, though, and it plants the
idea.

### Replies and activation bars

Figure 2 ("Who is waiting") was the first figure that taught me something the sentence
alone wouldn't have. Setting the database to 3 s and watching the browser's hatched bar
grow, with the clock running, while the diagram stayed the same height, made "vertical
distance shows order, not elapsed time" stick. I wouldn't have believed that from the
sentence alone. I'd have assumed longer arrows meant longer waits.

Small things I noticed while stepping:
- When I stepped with Next at 50 ms, I never saw Repair DB labelled "working". It went
  from idle to the API "working" after the reply. In Play mode with 3 s, I did see
  "Repair DB working". Stepping skipped the state the figure was built to show.
- At 3 s, step 3/4, the line under the diagram already says "Repair DB → Repair API:
  COMMIT ok (reply)" while the reply arrow hasn't been drawn yet and the clock is still
  running. For a second I thought I'd missed an arrow.
- Twice during my session, a figure (Figures 3 and 4) jumped back to step 1 and started
  playing again while I was stepping with Next. I couldn't reproduce it reliably, so it
  may be a timing quirk of autoplay starting when the figure scrolls into view. A reader
  stepping slowly would lose their place.

The paragraph on when to leave off bars and bare "OK" replies was practical, and I'd use
it.

### Synchronous and asynchronous messages

"The two words describe the sender, not the protocol" was the most useful single sentence
so far. It cleared up a real confusion: `await fetch` counts as synchronous in a diagram.
I'd have drawn it wrong before.

Figure 3, with "Doesn't wait": the 201 arriving at about 70 ms, then the 202 landing on an
API lifeline whose bar has already ended, with the note "Nobody is waiting for this
reply", made the danger visible. That figure earned its place. The open arrowhead on the
async call is small, but I could see it once I looked for it. Colour does most of the work
there.

The section ends by rejecting both versions, which led neatly into the next section.

### Background workers and the transactional outbox

Figure 4 is clear. The second group of arrows sits visibly below "Next poll, 0.7 s later".

**Where I was stuck:** the arrow "Claim a job for 5 min", and "claims J9 for 5 minutes" in
the caption. Why five minutes? What does "claim" mean: a lock, a status change? The
article doesn't say. I carried that question through the rest of the deep dive (it
reappears in Figures 5 and 6) and only got the answer in the companion's "Failing
part-way" ("The five minutes are the claim's lease..."). Someone reading only the deep
dive never gets it.

The outbox definition ("committed together, or neither is") was clear, and so was why it
matters.

### Actors, notes, boxes and short-lived participants

Here my effort went up sharply. This section is a catalogue: actor, self-message, note,
create/destroy, participant symbols (with a Mermaid version number), boxes, then a
subsection on flows with no caller, which has three options. None of it has a figure. The
one example is a Mermaid listing, and I had to picture the diagram from the text. I hadn't
been taught Mermaid syntax yet: the article says "Writing a diagram as text explains the
format", and that's the last section. I worked out `->>` and `-->>` by comparing with
Figure 1, but `create participant` and `destroy` before the reply was confusing. Why is
the participant destroyed *before* it replies?

What I'd keep: "a note holds anything that isn't a message", and the three-way choice for
flows with no caller (note, found message, scheduler lifeline). The last one is a real
design judgement. What I'd lose without noticing: the Mermaid 11.11 participant-type
syntax and the PlantUML keyword list. Those read as reference material.

Mentions of "the whiteboard shape vocabulary" and "the layout article" made me feel I'd
skipped a prerequisite. I couldn't tell whether I needed them.

### How much to draw

"Each diagram should answer one question" plus the list of things to leave off (a gateway
that only forwards, logging, a cache that only saves time) was practical. It's the advice
I most needed for my own design docs.

**Forward references:** this section says "rather than one diagram whose alt branches hold
them all", Figure 5 draws an `alt` frame, and the Booking-only view ends in a `ref` frame.
Neither `alt` nor `ref` has been taught yet. They come in Combined fragments. I could guess
`alt` from the guards. I couldn't tell what the `ref` box was until I reached the `ref`
section several screens later.

Figure 5: honestly, "Everything in one" didn't look too crowded to me at desktop width.
Seven lifelines, readable. The claim that it fits poorly (and the phone-screen point)
rests on the text rather than on what I saw. The two focused views were cleaner, though,
and seeing the gateway and auth service drop out made the "only what changes the answer"
rule concrete.

Lifeline order, labels and numbering: quick and useful. `autonumber` so a reviewer can say
"step 7 has no timeout" is something I'll use.

### Ordering and gaps

The section I most needed to read slowly. The rule (order down one lifeline, and send
before receive, and nothing else) is stated clearly in three sentences.

Figure 6 worked. Switching between "Just after the commit" and "0.7 s later", and seeing
only the 201 and the claim trade rows, with the text "The 201 moves above the worker's
poll. Every lifeline keeps its own order", showed me that the picture's vertical position
across lifelines isn't a promise. Before this I'd have read anything drawn higher as
happening first.

One thing I had to hold onto: the article says the two drawings "describe the same
interaction", but the button names describe different timings (early poll, late poll). I
squared it as "same partial order, different real timing", but I had to work that out. A
sentence saying "the timings differ, but the diagram can't tell them apart" would have
saved me the detour. The "Mermaid source, for the early poll" label stays the same in both
settings, which added to the doubt.

The Lamport mention was fine. It told me the rule has a pedigree without asking me to
learn more.

### Combined fragments

alt and opt (Figure 7): clear. The faded untaken branch helped. Toggling Customer to New
and watching the opt run inside the alt let me check I understood nesting. The rule about
guards ("Write guards that the participant making the choice can check") was a good
judgement point. One small inconsistency: with Invalid selected, the caption says "the
else section runs", but the guard on the page reads `[details invalid]`, not `[else]`.

loop (Figure 8): the pass counter in the frame corner was a good touch. Choosing "3" and
seeing the wasted last 2 s wait, then "Never", made both problems obvious without the
text. I wanted to try a variation here: put the wait *before* the request instead of after
it. The break example that follows partly answers that.

par (Figure 9): "Status never arrives" was valuable. I hadn't thought of par as hiding a
hang. One point of confusion: the par sections are stacked vertically, so the status
request is drawn above the slots request, yet I'm told they leave together. The text does
say messages in different sections can interleave, so I got there, but stacking looks like
ordering at first glance, especially right after the ordering section.

break: only a Mermaid listing, no figure. I could follow it because the loop figure had
just set it up, but I had to picture where the break box sits.

critical: four paragraphs about an operator the article itself says service diagrams
rarely need. The switchboard example was abstract and I didn't come away with a use for
it. What I'd keep is the warning: don't draw `critical` around a transaction, use a note.
That's one or two sentences. The rest felt like time without much return. (It did come
back once, in the companion's practice Discussion, as the reason to use a note instead.)

ref: clear, and it finally explained the box from Figure 5.

Rare operators: short and fine. "neg marks a sequence that must never happen" is the one
I'd remember.

### Reading a design from its diagram

This part felt like the payoff, where the notation becomes a review tool.

Round trips (Figure 10): comparing TLS 1.2 and 1.3 by clock was a good demonstration of
"count round trips for a latency floor". The legend paragraph about `+`, `*`, braces and
brackets was more than I needed. The takeaway "read a ladder's legend before its arrows"
is the useful part. The explanation of why TLS 1.3 saves a trip (key share guessed up
front) was interesting, but it's a TLS lesson rather than a diagram lesson.

Fork and stair (Figure 11): very good. Seeing the activation bars nest in the stair, with
every caller hatched while Billing works, made "a slow deposit holds three services" true
in the picture. I liked that the call label changes from "Hold time" to "Book A5" in the
stair. It shows the delegation.

Chatty calls (Figure 12): the clock comparison (about 265 ms against about 87 ms) did the
job. The "lifeline every message passes through" paragraph has no figure. Fine, it's
easy to picture.

Trust boundaries (Figure 13): the boxes made "what crosses into Mina's device" a
question I could answer by looking. Two things snagged:
- The note "Mina signs in and approves" sits over the Repair app server column, inside the
  Repair service box. Mina signs in at the provider, so for a moment I thought the app
  server was involved.
- "302 to provider (client id, state)": `state` is never explained. Not needed for the
  lesson, but I noticed I didn't know it.

### Other dialects

Useful for reading other people's diagrams, especially the warning that informal arrows
have no fixed meaning and that "swimlane" means different things. The table is reference
material I'd come back to. It arrives late, though. By this point I'd already read four
Mermaid listings, and this is the first place the arrow marks are set out side by side.

### Writing a diagram as text

"Sketch in the order the reader will read" is a good short method. The explanation of the
Figure 1 listing is the explanation I wanted back at the Actors section. On my first time
through, the order felt reversed: the code came before the key to reading it. The staleness
paragraph (what makes a diagram stale and what doesn't) was practical.

The note that every listing parses on two named Mermaid versions gave me confidence to
copy them.

## Failure, asynchrony and races (the companion)

### Opening

The opening links back clearly, restates the order rule in one line, and gives a test for
which failures to draw ("when it changes what someone sees or what the data ends up
holding"). That test is the most reusable sentence across both pages.

### Lost messages and timeouts

Figure 1 is excellent. Three cases, the worker's lifeline and status identical in all
three, and Mina's inbox, which the worker can't see, different. "To the worker, all three
look the same" is shown, not just asserted. "Don't draw a reply arrow labelled 'failed':
nobody sent one" is a rule I'd have broken.

The 5xx-from-a-gateway paragraph was a new idea to me and worth the space.

Nested timeouts (Figure 2): setting the API limit to 1.5 s and seeing the 503 reach the
browser, while the commit still lands at 3 s with "R17 is stored anyway", showed that
fitting the limits together fixes the silence but not the uncertainty. It was clear and a
little alarming, which is the right reaction. The jump to idempotency keys at the end
pointed forward at the right moment.

### Retries and idempotency keys

Clear. "Derive the key from the job, not from the attempt" is concrete. The 27-attempt
multiplication made retry stacking memorable.

### Failing part-way

This is where "claim for 5 min" was finally explained, as a lease. Figure 4 with Worker
crashes, showing "5 min later, the claim on J9 expires" and a second claim and email, was
clear.

A small tension: the deep dive said two workers on the same job need a lifeline each. Here
the crashed worker and the one that claims J9 again share one lifeline. It's sequential,
not a race, so I think it's fine, but I paused over it.

The saga figure (Figure 5): in "Declined, reply lost", the lost reply from Inventory ends
in its filled circle exactly on the Scheduling lifeline. It looked as if the reply had gone
to Scheduling. I had to read the caption to learn it was lost on the way to Booking.

Linking orchestration back to fork and choreography back to stair was satisfying. It made
the deep dive's section pay off a second time.

### Brokers and acknowledgements

Ack placement (Figure 6) was clear, and so was the conclusion: ack after the work and make
the work repeatable. Fan-out: "the arrows leave the topic, not the scheduling service,
because the publisher doesn't know who listens" is a drawing rule with its reason attached.
Good. The last paragraph (two workers on one queue look the same as fan-out, so a note
must say which) was a useful catch.

### Work that finishes later

The webhook section corrected something I'd have drawn wrong: the bounce as a dotted reply
to the original POST. The explanation of why that's wrong ("would say that the worker was
still waiting hours later") is exactly the reasoning I needed.

Figure 8, "Early, answered 200": the API status reads "lost, bounce dropped", and "Save
m-481 on J9" arrives after it. That made the race concrete. I liked that the order lesson
from the deep dive showed up again here without being re-explained.

### Races and overtaking

Figure 9 is simple and clear. Version numbers in the labels made the overtaking visible, as
the text says they must.

### The failure walk

A good checklist, and the worked example on the outbox used things I'd already seen. This
is the part I'd print.

### Drawing what happened

Short and useful: order by cause, not timestamps, because clocks disagree.

### Practise with a cancellation race

My answer before opening the Discussion: five lifelines (Mina's browser, technician app,
two API instances, Repair DB). Each instance does a conditional update; one gets a row and
the other gets zero and returns a conflict. Mina is told "cancelled" or "already started"
depending on who wins. Facts I used: one lifeline per instance (deep dive, Lifelines),
par for independent requests, the order rule. I didn't get from either article the idea of
a single conditional `UPDATE ... WHERE status = 'Approved'`. I brought that from
experience. The pages hint at it only through the companion's link to "Handling conflicts
and uncertain outcomes".

The Discussion matched my answer, and added two things I'd missed: re-reading the status
to give a 409 with a reason, and the technician waiting for the reply before starting the
physical repair. Both were worth it.

## At the end

**What I can now draw or judge that I couldn't before:**
- Read any arrow correctly: call, reply, async. And I know "async" describes the sender's
  behaviour, not the protocol.
- Put activation bars in only when "who is blocked" is the question, and know that height
  means order, not time.
- Look at two events on different lifelines and ask whether anything actually orders them.
- Use alt, opt, loop, par, break and ref, and spot the classic mistakes: a loop with no
  cap, a par that hangs on one reply, critical drawn around a transaction.
- Review a design by counting round trips, spotting a loop around a remote call, telling
  fork from stair, and checking what crosses a trust boundary.
- Draw a timeout as a note and not as a reply, a webhook as a new call and not as a late
  reply, and an ack as its own arrow.
- Walk each arrow of a happy path for lost, late, twice, out of order, receiver down, crash
  between.
- Write the basics in Mermaid.

**What I'd still get wrong:**
- Mermaid syntax beyond the basics (`create`/`destroy`, notes over several participants)
  without copying an example. The Actors section listed them without showing them drawn.
- When to use a found message versus a scheduler lifeline in practice. I have the rule,
  but no figure fixed it.
- Whether my par sections look ordered to readers because they're stacked.
- The single-statement check-and-change in a race. I knew it already; the articles alone
  wouldn't have taught it to me before the Discussion.

## Observations sorted by consequence

**Stops me following (only briefly):**
1. "Claim a job for 5 min" is unexplained in the deep dive and used in three of its
   figures. The answer appears only in the companion. *Smallest change:* one clause in the
   outbox section on what a claim is and why it expires. *Recheck:* a deep-dive-only
   reader can say what happens to J9 if the worker dies.
2. `alt` and `ref` appear in How much to draw (text and Figure 5) before Combined
   fragments teaches them. *Smallest change:* a parenthetical gloss at first use, or a
   pointer forward. *Recheck:* a reader can say what the ref box in Booking-only stands
   for when they first see it.
3. Mermaid listings appear from the Actors section on, but the syntax is explained only in
   the final section. *Smallest change:* move the short "how to read the listing" paragraph
   up to the first listing, or to just after Figure 1. *Recheck:* a reader can predict what
   the Actors listing draws before seeing it rendered.

**Slows me:**
4. The Actors section is a dense catalogue with no figure, and the create/destroy example
   reads oddly (destroyed before it replies).
5. In Ordering and gaps, "the same interaction" against two differently timed settings
   needed working out.
6. Par sections stacked vertically look ordered at first glance.
7. Figure details: the status line runs ahead of the arrow in Figure 2 at 3 s; Next steps
   past the DB "working" state; the OAuth sign-in note sits on the app server column; the
   saga's lost-reply circle sits on the Scheduling lifeline; Figure 7's caption says "else"
   for a guard written `[details invalid]`.
8. Possible autoplay restart while stepping with Next (seen twice, not reliably
   reproduced).

**Costs time without much return:**
9. critical: four paragraphs. The transaction warning is the part I'd miss.
10. The TLS legend and key-share explanation go beyond what the round-trip lesson needs.
11. Participant symbol syntax and version numbers in the Actors section.

**Answered just as I was ready to ask:**
- "Left to right carries no meaning", right after I wondered about it in Figure 1.
- "The diagram didn't get taller", right after I watched the 3 s wait.
- "Nobody is waiting for it" in Figure 3, just as I asked what happens to the 202.
- The note on the companion's webhook drawing error, just as I was about to draw it as a
  reply.
- The orchestration/choreography link back to fork and stair.

**Worth keeping as they are:** Figures 2, 3, 6 and 11 in the deep dive, and Figures 1, 2
and 8 in the companion. Each showed something I'd have doubted or misdrawn from the
sentence alone. The "describe the sender, not the protocol" passage and the failure walk.

**Useful curiosity (beyond these articles):** what `state` does in the OAuth redirect; how
the lease is implemented (locking read, `SKIP LOCKED`?); how to choose timeout values in
practice beyond "inner shorter than outer".
