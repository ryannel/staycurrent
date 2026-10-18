# Editorial review, 18 October 2026

Perspective: editor. I judged the page as the reference that future writers will copy for
style and tone. I read the rendered page at
http://localhost:4321/learn/drawing-systems/sequences/ from top to bottom in a browser pane
about 800px wide. I stepped through Figures 1, 2, 4, 8 and 9, and read every figure's
narration, notes and control labels in `sequence-model.ts`. I read the writer's notes only
after this review was written; the addendum at the end records what they changed.

For scale: about 6,000 words of prose in 127 paragraphs, 12 figures, eight open listings
and nine figure sources in closed panels. Sentences average 14 words and paragraphs 47,
both within the range of the reading pack. Eleven sentences run past 30 words. Sentence
length isn't a problem anywhere on the page. The findings below are about order, and about
a few individual lines.

## Passages to point to

1. **The opening, first two paragraphs.** In order, they say what a sequence diagram is,
   give three concrete kinds of message and say how to read the drawing. Then they set it
   against a boxes-and-arrows drawing the reader already knows and name three situations
   where you'd reach for one. No housekeeping comes before any of that. "You reach for one
   when that order is the question." is a plain verdict that also informs.
2. **The two paragraphs after Figure 5**, from "The worker's bar and status are the same
   every time" to "nobody sent one." The reader has just watched three cases. The prose
   says what stayed the same, what differed and why, then turns that into a drawing rule
   with its reason. This is watch, say, name at its cleanest.
3. **The end of "Synchronous and asynchronous messages"**, from "When the API doesn't
   wait" to "The repair service moves the email out of the request instead." Short
   sentences carry a chain of consequences ("Nothing is waiting for it. Had that reply been
   an error, nothing would have handled it."). The last paragraph shows both versions
   failing, then opens the next section from where the reader now is.

Three smaller examples are also worth keeping. "The diagram didn't get taller." after
Figure 2 turns something the reader noticed into the rule about vertical distance. "The
same key closes the outbox's gap too" shows the running model paying off across three
sections. And the figure controls are written as plain choices: "Waits for the reply /
Doesn't wait", "Request is lost / Reply is lost / Provider is slow".

## Findings, most consequential first

### 1. Combined fragments names the parts before the reader sees a frame

"Combined fragments" and "alt and opt" give nine sentences of definition before Figure 9.
They define combined fragment, operator, guard and section, then give three rules for `alt`
("at most one section runs", "If several guards could be true, one of those sections is
chosen", "With an `else` section, exactly one runs") and one for `opt`. The reader has to
hold four new terms and the selection rules with nothing to attach them to. This is the one
place where the page reverses its own pattern. Everywhere else, the term arrives as the
name for something the reader has just seen.

Repair: keep the first two sentences of "Combined fragments", which say what a frame is and
why you'd draw one. After Figure 9, name the parts on the drawing: the `alt` in the corner
is the operator, `[details valid]` is the guard, and the dashed line separates the sections.
Move the several-guards rule after the figure too, or out to the syntax companion. Figure 9
already draws each of these parts clearly.

### 2. The outbox section loses its thread after Figure 4

After Figure 4 the section runs to ten paragraphs and a listing. It goes from what the
reader saw, to the term, background workers and *Provider down*. Then come two asides
about drawing ("This diagram has two starting points…" and "The diagram draws one pass of
the worker's poll…"). After those come several workers and the five-minute claim, then the
two-worker listing. Only then does the reader get "Set *Worker crashes* in Figure 4",
which sends them back up past the listing. The asides interrupt the mechanism that the
crash case depends on, and the page makes both points again later. Figure 12's aftermath
repeats the two starting points ("It holds two jobs with different timing, a request and a
worker's poll"), and "ref" repeats the split.

The section also describes a lease without naming it: "the claim also sets the job's 'taken
until' time five minutes ahead". A reader who later meets "lease" or "visibility timeout" in
a queue's documentation won't connect the two.

Repair: cut "This diagram has two starting points…", because ref and Figure 12 cover it.
Move "The diagram draws one pass of the worker's poll…" to "loop", where it answers a real
question: when not to draw a loop frame. Name the term, for example "So the claim also takes
a lease: it sets the job's 'taken until' time five minutes ahead." The crash prompt then
follows straight on from the mechanism it depends on.

### 3. "Lost messages and timeouts" is cut in the wrong places

- **The h3 "What the caller knows" splits one thought.** The paragraph above it ends "To
  the worker, all three look the same." The paragraph below it begins "All the worker has
  is a timeout". The heading breaks the line of reasoning, and it isn't a term anyone would
  search for. Removing it lets the h2 run straight into Figure 5.
- **A forward reference misses its target.** "Timeouts inside timeouts" ends by pointing
  ahead: "a key on the booking request, like the one on the email in the next section,
  makes Mina's second attempt safe." The next thing the reader meets is "Found messages and
  timers", not retries. Found messages are the mirror of lost messages, so they belong
  straight after the lost-message material and before nested timeouts. Nested timeouts can
  then hand over to "Retries and idempotency keys" directly.
- **The nested-timeout fix has no figure, and the reader needs one.** This is the one
  stretch where the reader has to track changing state with no help. "If the browser waits
  5 seconds, the API should stop waiting for the database at, say, 2." Then: "That doesn't
  remove the uncertainty… But the part of the system that learns of the failure is then one
  that can do something about it." The reader has to work out alone that the database may
  still commit at 3 seconds, so Mina can again be told the booking failed when it didn't.
  "Can do something about it" doesn't say what the API does. The smallest repair is to name
  one action, such as the API cancelling the write, or answering with an error that tells
  the browser to retry with the same key. A fuller repair is a third option on Figure 6,
  "API gives up at 2 s". It would show the API's timeout note, its error reaching a browser
  that is still listening, and the write committing anyway. That would give this fix its
  break, fix and new cost, as every other fix on the page has.
- **The heading isn't the field's term.** The field, and the page's own description, call
  these "nested timeouts". "Timeouts inside timeouts" is plain, but it isn't what a reader
  would search for.

### 4. The critical listing shows the use the section warns against

The section says engineers misread `critical` as a database transaction, and that "Where
you mean a transaction, a note says it more plainly". Then it gives one example of correct
use, "as in the listing". The listing puts a critical frame around the worker's claim on
Repair DB. To the reader, that looks like the misreading they were just warned about, and
nothing says what non-transactional claim it makes. It also contradicts the page's own
two-worker listing, where Worker B's claim reaches the database between Worker A's claim and
its reply. A critical region over those lifelines forbids exactly that. The reader leaves
without one working example of when `critical` is right.

Repair: either choose an example where "no other message comes between these" is the real
claim and is true, or drop the listing. If you drop it, say plainly that service-level
diagrams rarely need `critical`, and what it means when you meet one. Two smaller fixes in
the same section:

- "It says something about order, and nothing about databases or fallbacks." mentions
  fallbacks two paragraphs before Mermaid's `option` sections explain why they would come
  up. Drop "or fallbacks" there.
- "That is Mermaid's own reading." repeats "a second reading" from the sentence before it.

### 5. Mermaid: the reader hears about the syntax before seeing any

The first Mermaid a reader can see without opening a panel is in section 3, for `-)`.
Before that, two paragraphs describe syntax only in prose. The first says "`participant`
declares a lifeline, `->>` draws a call as a solid arrow, and `-->>` draws its reply as a
dotted one". The second holds the longest sentence on the page, at 42 words: "In Mermaid,
a `+` after a call's arrow starts a bar on the participant receiving it, and a `-` after a
reply's arrow ends the bar of the participant sending it." The reader has to picture four
characters from a description. This is what moving the listings into panels lost. The
Figure 1 and Figure 2 sources are only seven or eight lines long, and they were the reader's
first look at the format.

Repair: show Figure 1's listing open after "Most figures here also come written in
Mermaid…", so the three tokens that paragraph names are on the page. In "Replies and
activation bars", show the two lines that change (`UI->>+API: POST /repairs` and
`API-->>-UI: 201 Created: R17`), and cut the long sentence to "A `+` starts a bar and a
`-` ends it." After that, the closed panels work, because the reader knows what's inside
them. The open listings already appear where new syntax arrives: `-)`, `-x`, `activate`
with no message, `break`, the `ref` note, and `create` and `destroy`. That part is well
judged.

The paragraph after the `-)` listing reads as a sourcing note: "Mermaid's documentation
names `-)` the asynchronous arrow, but describes `->>` only as a solid line with an
arrowhead. Reading `->>` as a call is the UML convention this article follows, so say so if
your readers might take Mermaid's output as exact UML." The advice at the end doesn't change
what most readers do. One clause would cover it ("Mermaid doesn't promise that `->>` means
a call; that is the UML reading used here"), or the point could move to the syntax
companion.

## Line edits

Each of these is small, but they are exactly the habits a writer copying this page would
pick up.

- **Loop, the "Now set *Never*" paragraph.** "Real code needs a cap, such as 30 attempts,
  and the last wait is wasted. A cap in the loop's guard and a break fix both." The wasted
  wait was already covered in the previous paragraph, so this reads as a seam left from an
  edit. Say what fixes what: "A cap in the guard stops the endless loop, and a break stops
  the wasted wait."
- **Order section.** "Here the difference doesn't matter, because the page for R17 exists
  from the commit onward." No page for R17 has been mentioned. Perhaps the email links to
  one, but the page never says so, and the reader stops here. Say what the page is and why
  it matters, for example "because the link in the email to R17's page works from the
  commit onward", if that's the intent.
- **After the 503 example.** "the worker knows the provider says it didn't take the
  request" is careful wording, and the next paragraph then explains why a 5xx doesn't prove
  even that. The reader works through the hedge only to have it undone. End the paragraph
  at "That is a reply, so draw it as one. Only silence is drawn as a timeout." and let the
  5xx paragraph follow.
- **After Figure 12.** "On this site's figures, seven lifelines already push the phone
  layout onto two rows of headers, and past about eight the labels start to shrink." This
  describes our renderer, not the reader's diagrams. Either make it general (on a phone,
  more than six or seven lifelines no longer fit across the screen) or cut it.
- **Before Figure 2.** "The status under each name and the clock in the corner give the
  same information as words and numbers." This explains the figure's accessibility design
  rather than telling the reader what to watch. Replace it with what the status is ("The
  word under each name says what that participant is doing"), which Figure 5 relies on.
- **"Reviewing a design".** "Each section above ended with something to look for." This
  announces structure, and not every section did end that way. Cut it; the list works on
  its own.
- **"Synchronous and asynchronous messages".** The broker paragraph ("Sending to a message
  broker can be both…") is an aside that comes before the figure. It concerns a participant
  the page doesn't draw until "Queues, events and callbacks", so move it there. Keep "Label
  each arrow by what its sender does next" where it is.
- **break.** The section ends on its listing, with nothing after it. Add one sentence
  saying what to notice: the loop now stops at the first scheduled status, before the wait,
  or after 30 passes.
- **Terms used without being introduced.**
  - "Participant" is used from the first section on but never introduced. The opening's
    "Each part gets a vertical line" could become "Each part, called a participant, gets
    a vertical line".
  - "Backoff" appears in "Retried up to 3 times with backoff", but the term isn't given
    where the technique is described ("Wait longer after each failed attempt").
  - "Happy path" is never defined, though most readers will know it.
- **Repetition.** "Keep the lifelines at one level" (Lifelines) and "Keep to one level of
  detail" (How much to draw) make the same point. The first is tacked onto a paragraph about
  copies of a service and can go. "Put whoever starts the interaction on the left" and "Put
  the initiator on the left" also say the same thing twice.
- **The opening against alt.** The opening says "one diagram shows one run of the
  interaction". After Figure 9 the page says "the diagram describes every path the
  interaction can take". The second could become "because the frame describes both paths".
- **Verdicts that end paragraphs without adding anything.** "A limit only matters when the
  work takes longer than it.", "a note is read by everyone" and "The differences are the
  finding." Each is fine on its own. Together they form the habit the style skill warns
  about. Cut the first; the other two are judgement calls.
- **Figure 1 prompt.** "Press play and watch…" Each figure starts playing by itself once
  half of it is in view, so by the time the reader reaches this sentence the figure may
  already be playing. "Watch the order in which the four messages arrive." works either way.

## Headings

Most headings use the field's terms and lead into what the section develops: "Lifelines
and messages", "Replies and activation bars", "Synchronous and asynchronous messages",
"Background workers and the transactional outbox", "Retries and idempotency keys",
"Combined fragments" and the operator subheadings. These are the model.

The weaker ones:

- "What the caller knows" and "Timeouts inside timeouts", covered in finding 3.
- "Order, gaps and what a diagram leaves open". The last part is writerly. "What order a
  diagram promises" or "Ordering and gaps" names the subject.
- "ref: splitting one interaction into several" is the only operator heading with a
  subtitle.
- "One question, one level of detail" and "Making it readable" are the only headings
  phrased as general advice. Something like "Choosing what to draw" and "Lifeline order,
  labels and numbering" would name what each section covers.
- "Queues, events and callbacks" promises callbacks, but the body never uses the word.

## Figures

Figures 1 to 11 follow the pattern almost without exception. A sentence says what to watch
and what to change, the reader watches, and the next paragraph says what they saw and names
the term. Figure 8, which slides the drawing between the two poll times, is the strongest
single device on the page: it makes "the two drawings are the same diagram" something the
reader sees rather than takes on trust. Figure 12 makes its point with one toggle.

The pattern lapses in three places: at Figure 9 (finding 1), in the distance between Figure
4 and its crash case (finding 2), and in the stretches without figures. After "par", the
remaining 2,200 words or so have one figure. Most of that is a catalogue (notes, actors,
boxes) or guidance, where listings are the right tool. Two places ask the reader to track
changing state with no help. One is the nested-timeout fix (finding 3). The other is the
"tempting drawing" in the race discussion: select, select, update, update. That one is an
exercise answer, so prose is acceptable there.

## Verdict

**Ready after the listed repairs.** At sentence level the page already reads as the house
style should: short, plain sentences, terms defined at first use, exact numbers from real
systems, and an opening that teaches before it organises. Most figures are set up and
followed through the way the reading pack does it. What would mislead a writer who copies
this page is structural, in four places:

- one section names everything before showing it;
- one runs its asides into the middle of a mechanism;
- one subsection sits between a forward reference and its target;
- the `critical` example teaches the opposite of its own text.

Each of these is fixed by moving or cutting a few paragraphs, plus replacing one listing.
Showing the first two Mermaid listings open restores what the panels took away. The line
edits are small, but make them before the page is held up as an example: a copying writer
is exactly the reader who reproduces a duplicated clause or a site-specific aside.

## Addendum, after reading the writer's notes

I read `style-pass-2026-10-18.md`, `conventions-2026-10-17.md` and the parts of
`review-2026-10-17-trio-technical.md` and `deepening-2026-10-17.md` that touch these
findings. None of the findings changes. Four need context:

- **Finding 1.** The style pass kept definition-first openings for the fragments on
  purpose, for skimming readers. The repair above keeps that: the section still opens
  with what a combined fragment is. Only the parts (operator, guard, section) and the
  selection rules move to after Figure 9.
- **Finding 3.** The technical review (P-A3) asked for found messages inside "Lost
  messages and timeouts". Moving the h3 ahead of "Timeouts inside timeouts" keeps it in
  that section, and nested timeouts can then hand straight over to retries.
- **Finding 4.** The 17 October repair removed Mermaid's `option` from the critical
  listing but kept the same content, a claim on Repair DB. `conventions-2026-10-17.md`
  says the parent "must not show a listing that does what its prose warns against". The
  single-region version still reads as a transaction, and it contradicts the two-worker
  listing, so the convention isn't met yet.
- **Finding 5.** The writer flagged this under "Unsure": if the editor wants one visible
  sample to teach the format, the booking listing is the candidate. I recommend it, plus
  the two `+`/`-` lines in "Replies and activation bars".

One more line, against the conventions note ("release numbers and parse results don't
interrupt the parent's teaching"). "Each one parses on Mermaid 11.4.1 and 12.2.0." in the
tools section is a parse result. "Since version 10.3" and "(the syntax companion gives the
version)" in the actors section are release details. These are minor, because they sit
late on the page, but the companion owns them.

## Re-read after repairs

I re-read the assembled page from top to bottom: prose, captions, figure narration and
control labels. I used the pane at 375px and drove Figure 6 through its new *API gives up
after 1.5 s* state. The page has no horizontal scroll, including the two quoted Mermaid
lines.

**Findings.** All five are resolved.

1. Combined fragments now gives a one-sentence definition, then Figure 9. The operator,
   sections and guard are then named on the drawing.
2. In the outbox section, *Worker crashes* follows *Provider down* straight away, the
   asides are gone or moved, and the lease is named.
3. In "Lost messages and timeouts", the mid-thought h3 is gone. Found messages now come
   before "Nested timeouts", and that section hands over to retries by name. Figure 6
   shows the fix and its cost: the API answers 503 in time, and the write commits anyway.
4. The `critical` section has no listing. It now uses the two-worker listing to show why a
   database isn't a critical region, which is better teaching than any listing would be.
5. Figure 1's Mermaid is open where the format is introduced. "Replies and activation
   bars" quotes the two `+`/`-` lines inline.

**Line edits and headings.** All done. Two release details remain by the writer's choice:
the parse sentence, and "(the syntax companion gives the version)". Both sit late on the
page and don't interrupt the teaching. I accept that.

**Example passages.** All survive unchanged: the opening's first two paragraphs, the two
paragraphs after Figure 5, and the end of "Synchronous and asynchronous messages". "The
diagram didn't get taller" and "The same key closes the outbox's gap too" survive as
well.

**New strain.** Three small things, all from the joins.

- **Nested timeouts paragraphs.** The new paragraphs carry the most reasoning on the page.
  "With a 500 ms write the limit is still there, but it never fires." is fused onto the
  rule that follows it ("Each caller's limit has to be longer…"), although the rule comes
  from the 3-second failure, not from the 500 ms case. The last paragraph runs to 98 words
  in four steps: the 503 is wrong, a cancel wouldn't help, a key fixes it, and how the key
  works. Start a new paragraph at "Each caller's limit" and another at "What makes her
  second attempt safe".
- **Outbox.** "That is how J9 survived the crash." The worker crashed, not the job, so
  "survived" makes the reader pause. "That is why J9 was claimed again after the crash"
  says it directly.
- **Queues.** "Publishing to a queue can be both kinds of message." The two kinds were
  named six sections earlier, now that the broker paragraph has moved. Name them: "both a
  call and an asynchronous message".

**Updated verdict: ready as a reference.** The structural problems that would have
misled a copying writer are gone. The repairs didn't add repetition: the two places where
the page now refers back (the two-worker listing in `critical`, the outbox's two starting
points in `ref`) are deliberate uses of the running model. The three edits above are
one-line fixes worth making in the same pass, but none of them blocks.
