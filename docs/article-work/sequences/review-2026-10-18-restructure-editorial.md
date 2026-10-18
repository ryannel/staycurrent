# Sequence diagrams family: editorial review of the 18 October restructure

Reviewer: editorial perspective (informed). Scope: *Sequence diagrams*
(`/learn/drawing-systems/sequences/`, "D"), *Failure, asynchrony and races in sequence
diagrams* (`/learn/drawing-systems/async-interactions/`, "C"), the redirect from
`/learn/drawing-systems/sequence-syntax/`, and the Sequence diagrams section of the
collection intro. Read on the dev server in headless Chromium (1280 px and 375 px,
reduced motion, every `<details>` opened), against the brief in
`scratchpad/style-pass/reading/brief.md`, Sam Who's *Memory Allocation*, the style and
review skills, `docs/coverage/drawing-systems.md`, the writer's note
(`restructure-2026-10-18.md`) and `derived/sequences-comparison.md`. No file changed
except this one.

## What an expert practitioner can do (written before opening the pages)

1. Read any sequence diagram fluently: participants and lifelines, calls, replies,
   asynchronous sends, self-messages, notes, activation bars, create and destroy, and
   the common frames (`alt`, `opt`, `loop`, `par`, `break`, `ref`, and what `critical`
   really means).
2. Know what the page promises and what it doesn't: order down each lifeline and from
   send to receive, no global clock, no scale for time, one run of one scenario.
3. Draw one to answer a question: pick the question, the level, the participants and
   what to leave out; happy path first; split rather than nest.
4. Review a design from its drawing: round trips on the critical path, who holds
   control, chatty interfaces and hubs, what crosses a trust boundary.
5. Draw the cases a happy path hides: lost messages and timeouts, retries and
   duplicates, crashes between steps, brokers and acknowledgements, fan-out, callbacks,
   long waits, races and stale reads.
6. Read other people's dialects (collaboration diagrams, RFC ladders, informal arrows)
   and write one as text in a common tool, knowing where the tools differ.
7. Reconstruct what happened from logs and traces, ordered by cause rather than clock.

A two-article family should therefore put 1 to 4 and 6 in a deep dive about drawing
and reading one scenario, and 5 and 7 in a companion about what goes wrong. Tool syntax
is a reference table, not an article.

**Against the map.** The map's 38 parts match this list closely, and its split is the
same one. Nothing I listed is missing a home. The map is also honest about what it
leaves to other fields (broker guarantees, saga design, locking reads), and the pages
keep those to sentences. Coverage both ways is in good shape; the findings below are
about joins and a few passages, not scope.

## Heading trees as maps

**D.** Notation (Lifelines and messages → Replies and activation bars → Synchronous and
asynchronous messages → Background workers and the transactional outbox → Actors, notes,
boxes and short-lived participants, with Flows with no caller), then How much to draw,
Ordering and gaps, Combined fragments (seven operator H3s), Reading a design from its
diagram (Round trips, Fork and stair, Chatty calls, Trust boundaries), Other dialects,
Writing a diagram as text. It reads as a map: field terms throughout, the operators
findable by their keywords, and the new "Reading a design" group clearly a different
kind of section. Two headings promise less than their sections hold: "Chatty calls"
also holds the hub participant, and "Writing a diagram as text" opens with a paragraph
on sketching order (finding 6).

**C.** Lost messages and timeouts (Nested timeouts), Retries and idempotency keys,
Failing part-way, Brokers and acknowledgements (Fan-out), Work that finishes later
(three H3s), Races and overtaking, The failure walk, Drawing what happened, Practise
with a cancellation race. It follows the failure walk's own order closely (lost, late,
twice, crash, receiver down, out of order), which makes the walk at the end feel earned
rather than appended. "Work that finishes later" is the one heading a skimmer won't
search for; the H3 "A callback is a new message" carries the terms, so this is fine.

Anchor ids that no longer match their headings (`#found-messages-and-timers`,
`#one-question-one-level`, `#other-tools`, `#webhooks-and-callbacks`) were kept on
purpose so links survive. Readers see them only in copied URLs. No action needed.

## Findings

Ordered by consequence. Each gives the passage, what happens to the reader, and the
smallest repair.

### 1. C's saga figure shows the case the prose doesn't describe (repair)

C `#failing-part-way`: "Figure 5 books an appointment in three services, then declines
the deposit at the end." The figure's default is `deposit: 'paid'`
(`async-scenarios.ts`, the `saga` scenario), so the reader watches every step succeed
and the caption ends "the booking is confirmed". The next paragraph, "Draw the undo as
what it is: new requests with their own replies", describes compensation they haven't
seen, and "which is why Scheduling shows held" points at a status that is also shown on
the happy path. This is the only drawn compensation in the family, so a reader who
doesn't think to change the control misses the part.

Repair: change the sentence to "Figure 5 books an appointment in three services. Play
it, then set Deposit to Declined." (Every other figure in both pages gives this
instruction; this one lost it.) Or default the figure to Declined.

### 2. The style skill now points at a passage that left the deep dive (owner action)

`.claude/skills/staycurrent-style/SKILL.md` names, as a reference passage in D, "the two
paragraphs after Figure 5, where three cases the reader has watched become a drawing
rule". Those paragraphs ("The worker's bar and status are the same every time…", "A
timeout records only…") moved unchanged to C after its Figure 1. D's Figure 5 is now the
crowded-diagram figure, so a future writer following the skill will study the wrong
paragraph. The writer flagged this; it needs someone allowed to edit the skill. See
"The deep dive as a style reference" below for a replacement.

### 3. Framing now precedes the frames, and uses `alt` before it is taught (repair)

The verdict moved How much to draw ahead of Combined fragments, which is right. The
move left two terms used before their home. "Choosing what to draw" ends: "rather than
one diagram whose alt branches hold them all". Figure 5 then shows an `alt` frame with
`[token valid]` and `[token invalid]`, and the paragraph after it introduces `ref` in a
clause. `ref` is glossed; `alt` is not. A newcomer meets a framed operator with no word
of what the tag means, and the full explanation is four screens later.

Repair: one clause at first use, "an alt frame, which holds alternative paths (Combined
fragments explains frames)". The same pattern in Ordering and gaps ("This is also why par
exists: it says openly that the order between its sections is open") already glosses
itself and needs nothing.

### 4. "Claim a job for 5 min" is unexplained in the deep dive (small repair)

The claim lease moved to C, but its label stayed on D's Figures 4 and 6 and the `ref`
listing, and Figure 4's caption says "the worker claims J9 for 5 minutes". D never says
why a claim has a duration; C explains it in Failing part-way. A reader of D notices a
specific number with no reason, which is the kind of detail the house style uses only
when it carries meaning.

Repair: one clause in D after Figure 4, "Claiming J9 for 5 minutes keeps other workers
off it while this one works; the companion's Failing part-way shows what happens when a
worker dies holding it." Or relabel to "Claim the next job" in D's figures only.

### 5. "Chatty calls" never says what chatty means (small repair)

D `#chatty-calls` opens "Figure 12 is a page that lists today's repairs." The heading
term is never defined; the reader infers it from the N+1 figure, and the second
paragraph then introduces a different shape (a lifeline every message passes through)
under the same heading. Every other new section opens by naming its term ("A round trip
is a message and the reply its sender waits for."; "A drawing also shows who holds the
flow.").

Repair: a first sentence such as "An interface is chatty when one result takes many
small calls across the network, and a diagram shows two shapes of it." Then the figure.

### 6. "Writing a diagram as text" opens on sketching (small repair)

The first paragraph ("Sketch in the order the reader will read. Place the participants
first…") is advice on drawing order, not on text. It is useful, but a reader arriving
from the heading, or from the retired syntax page, expects text. Repair: move the
paragraph to the end of "Choosing what to draw", where happy path first already sits, or
rename the section "Sketching and writing a diagram as text".

### 7. C's stale-read paragraph asks for a remedy it never names (small repair)

C `#ordering-and-overtaking`: "Say which remedy the design relies on, or the reader will
assume the page always sees the new row." No remedy is named, so the reader is told to
write down something the page hasn't given them. Repair: a clause of examples, "such as
reading from the source after a write, or waiting until the consumer reports that
version". Remedy design stays with the databases and messaging fields.

### 8. Smaller joins and strains

- D opening, paragraph 1: "the arrows are what order events on different lines" is the
  one awkward sentence in the most-copied passage. "and only the arrows order events on
  different lines" says it plainly.
- D opening, paragraph 4: "Each section changes one thing about that booking." True up
  to Reading a design, whose four subsections each bring a new scenario (a TLS
  handshake, a booking with a deposit, a list page, a sign-in). A clause at the start
  of Reading a design ("These readings borrow real protocols where they show the shape
  best") keeps the promise honest.
- D `#lifelines-and-messages`: the paragraph "Each figure's text form, in Mermaid, sits
  under Mermaid source…" interrupts a section about lifelines with a page instruction.
  It would sit better as the last sentence of the opening, after the contents.
- D `#making-it-readable`: "shades a region, such as the one transaction" refers to a
  transaction the reader hasn't met yet (it's in the `alt` figure). "such as one
  transaction".
- C opening: "Sequence diagrams draws Mina's repair booking…" reads as a plural subject
  with a singular verb. "The deep dive, Sequence diagrams, draws…".
- C Figure 4 has the same title as D's Figure 4 ("A job in the database") and opens on
  the same happy path. The prose tells the reader to switch cases, so this costs little,
  but a title such as "When the outbox's worker fails" would stop it looking like a
  repeat.
- C `#a-callback-is-a-new-message`: two paragraphs averaging 100 words. The first says
  the bounce is not a reply three times ("Drawing the bounce as a reply…", "The
  provider's 202 Accepted was the reply…", "A dotted arrow… would say that the worker
  was still waiting"). Keep the dotted-arrow sentence, which is the vivid one, and cut
  the middle restatement.
- C `#when-no-callback-comes`, paragraph 2: one 100-word sentence of three semicoloned
  items. Split into three sentences, or a three-item list like the failure walk's.

## The new sections

**Reading a design from its diagram.** The best new material in the family. Each
reading names its term, shows it in one figure on the shared player, and ends on what a
reviewer does with it. Trust boundaries is the standout: "Follow what crosses into
Mina's device" leads by plain steps from the code passing through the browser to why
RFC 6749 makes it short-lived and single-use. That is the house style's chain of
consequences, applied to a real protocol. Round trips ends well by bringing the count
back to Figure 2's nested waits. Fork and stair names the shapes, gives the RUP rule
for choosing, then the stair's cost ("a slow deposit holds three services") and links
forward to C's orchestrated saga, which picks it up correctly. Chatty calls is the weak
one (finding 5).

**Other dialects.** Works. "You will read more of other people's diagrams than you
draw" is a good opening because it says why the section exists. The four-item list fits
material that is genuinely a catalogue. The swimlanes item heads off a real confusion
in one sentence. The table is the right size for what the syntax page owed readers. The
two sentences before it ("Mermaid's documentation describes its arrows by their
shape…") are compressed but carry a point no other page makes.

**The failure walk.** Works, and it is much better than the four lists it replaces. Six
short items, each a question, then three of them worked on the outbox in short
question-and-answer sentences (10 words a sentence, the shortest section in the
family). Because C's sections already followed the same order, the walk reads as a
summary of a method the reader has just used. The closing pair ("A question the drawing
can't answer has found a gap…") is the one place it ends on a maxim; acceptable once.

**Joins left by the moves.** Mostly clean. D's outbox section now ends "Moving the email
out of the request doesn't remove its failures. It moves them to the worker, where
nobody is waiting to notice." and hands off to the companion by name, which is a better
ending than the old one. C's Nested timeouts re-enters from "The deep dive's booking
held waits inside waits", and its double booking ("She tries again, and now there are
two bookings") sets up idempotency keys in the next section. Every cross-page link in
both pages resolves to a live anchor whose heading matches the link text (checked: 26
internal links). The remaining joins are findings 3, 4 and 7.

## Is the deep dive still a style reference?

Yes, with the skill pointer fixed. Measured on prose outside figures: 5,533 words, 15.5
words a sentence, 47 words a paragraph, against the calibration of 15 to 20 and 40 to 45.
The opening and the end of "Synchronous and asynchronous messages" are unchanged and
still the clearest passages. The sync → async → outbox run is a complete break, fix,
new cost arc on one running model.

What it lost is its best "watch, then name the rule" passage, the three losses, which
now lives in C. The nearest replacement in D is the two paragraphs after Figure 6 in
Ordering and gaps: the reader watches two rows trade places, then "So the two drawings
describe the same interaction. Figure 4 drew the 201 first, but nothing in the diagram
promises that order." I'd name that, and the Trust boundaries reading, in the skill. The
alternative is to name C's paragraphs where they now are; that makes the companion part
of the reference, which is fine if the owner wants it.

One caution for writers who copy it: the new design readings use define-then-show
rather than watch-then-name, and four separate mini-scenarios rather than one model
changed one thing at a time. Both suit this section, which is a set of independent
review lenses. A future writer shouldn't take it as licence to replace a running model
with a catalogue where the subject has one thread.

## The companion's extra 4 minutes

The writer's open question: C is 19 minutes against the plan's 15 (3,925 words of prose
against 2,710), and the writer attributes most of it to Nested timeouts and the
cancellation-race practice.

**Both earn their place; keep them.**

- *Nested timeouts* (343 words, one figure) is the only place the family teaches that
  timeout limits must nest and that work finishes after nobody is listening. An expert
  needs both. It also produces the duplicate booking that motivates the next section,
  so cutting it would leave idempotency keys opening without a reason the reader has
  felt. Its prose is in good shape: the API-limit toggle runs break, fix, new cost ("The
  browser gets an answer instead of silence, but the uncertainty remains").
- *The practice* (about 430 words with the listing) is the family's only exercise and
  its only worked race. It reuses three things D taught in passing (a lifeline per
  instance, `par`, `critical`'s misreading) and ties them to the database's conditional
  update. It is the strongest test of whether the reader can apply the order rule.

If the time needs to come down, the cheaper source is tightening rather than cutting a
part: the repeated point in "A callback is a new message" and the long sentence in "Long
waits" (finding 8), and the backoff-with-jitter sentence in Retries, which is messaging
material. Together that's about 120 words, under a minute. I wouldn't chase the rest.
The plan's 15 minutes didn't price the two sections above, and the comparison had
already judged both at the right depth.

## The site stays whole

- **Redirect.** `/learn/drawing-systems/sequence-syntax/` returns 302 to
  `/learn/drawing-systems/sequences/#other-dialects` on the dev server and lands on the
  heading. It follows the relational aliases pattern. Someone arriving from an old
  syntax link wants the marks table, which sits one list below the heading, and "what
  Mermaid can't draw", which is in the next section. Acceptable. An id on the table, used
  as the target, would be marginally better. I didn't check the static build's
  meta-refresh output, since the brief rules out `pnpm build`.
- **Collection list and companion lines.** The collection entry types C as
  `companionOf: 'sequences'`, its TitleLine reads "Companion to Sequence diagrams", the
  pager runs D → C, and both Sources lists name the other page with its role.
- **Collection intro.** Its Sequence diagrams section now says lifeline events happen in
  order from top to bottom (the writer's note still lists "time runs downwards" as
  outstanding; it has been fixed in the working tree). The reading list names the
  companion. One wording point: "The sequence article writes each example in Mermaid"
  labels the deep dive by its format, not by what the reader gets. "The sequence article
  teaches the notation and how to read a design from it" would label it by role.
- **Planned coverage.** C says broker and saga design belong to "messaging, a field this
  site hasn't covered yet", unlinked, as the map requires. Nothing presents planned
  reading as available.
- **Phone width.** No horizontal scroll at 375 px on either page.

## Verdict

**Ready after the listed repairs.** The restructure did what the comparison asked:
each part has one home, the failure material is gathered in a companion with a clear
method, framing and order now come before the frames, and the new design readings fill
the family's one real gap with some of its best writing. Nothing was lost that the
reader needs. The repairs are small and local. Finding 1 (the saga figure shows the case
the prose doesn't describe) and finding 3 (`alt` used before it is taught) affect what
a reader understands and should be fixed before the draft is marked ready. Findings 4
to 7 are sentence-level. Finding 2 sits outside the writer's permissions: the style
skill should be updated so future writers copy the passage it means. The companion's
extra four minutes are justified.

## Re-read after repairs

I re-read both pages from top to bottom on the dev server after the writer's repairs
(listed in `restructure-2026-10-18.md`, "Repairs after the three reviews"), with every
`<details>` open, at 1280 px and 375 px, and diffed the rendered text against my first
reading. Prose outside figures: D 5,841 words (up 308), 15.7 words a sentence, 48 a
paragraph; C 4,013 words (up 88), 15.7 and 51. There's no horizontal scroll at 375 px,
and every internal link still lands on its heading.

All of my first-round findings are repaired: the saga figure, `alt` before it is taught,
the lease, chatty, the sketching paragraph, the stale-read remedies and the smaller
joins. Two of the repairs leave small new strains (items 1 and 2 below).

### The passages asked about

- **Lease paragraph after Figure 4.** "To claim J9, the worker marks it as taken for five
  minutes. Any lock the database holds… If the worker dies, the lease runs out and J9
  comes free again." It works. It supplies the reason for the number, and it keeps the
  condition the technical review wanted: a lock ends at commit, so the lease is what
  protects the job. "Any lock" arrives without introduction, but it is hedged as a
  possibility and the companion explains the locking read, so it needs nothing more. C's
  matching passage now adds that the lease must outlast the longest attempt. That point
  belongs there, and the two pages don't repeat each other.
- **Mermaid key under Figure 1.** This passage needs a small fix. "In Figure 1's, each
  participant line declares a lifeline, as gives the name shown in its box…" The bare
  possessive makes the reader stop and work out "Figure 1's what?". Suggested fix: "Figure 1's
  source reads like this: each participant line declares a lifeline…". The same key is
  now restated in "Writing a diagram as text" (see the reading-time note below).
- **OpenID Connect and PKCE.** Figure 13 and its caption now agree with the prose
  (code_challenge out, code_verifier back, ID token and access token, the sign-in note on
  the provider alone). The new paragraph follows one reason through plain steps: the
  secret identifies the app, not the browser, so PKCE ties the code to this sign-in. "A
  code copied from a URL is useless without it" is a fair close. It is the most
  security-specific paragraph in the family. It earns its place because the figure's
  labels need it, and a house reference shouldn't draw an outdated flow.
- **Marks-table warning.** "The same characters mean different things in the two tools…
  Check which tool a listing is written for before reading its arrows." This is the most
  practical addition on the page: three plain sentences that prevent a real misreading.
  The table rows for `->x` and `[o->` read cleanly.
- **`critical`, two paragraphs.** Better. The definition and "rarely need it" come first,
  followed by the transaction misreading and Mermaid's second reading. The switchboard
  example went, and nothing a practitioner needs went with it. The companion's practice
  still leans on "having it read as a transaction", and that warning survives.
- **Opening.** "only the arrows order events on different lines" fixes the one awkward
  clause in the most-copied passage. "Up to the design readings near the end, each section
  changes one thing about that booking" keeps the promise honest. The design-readings
  intro now says why they leave the booking. Both are good.
- **Companion's saga.** The figure opens on Declined, and the prose tells the reader to
  compare it with Accepted. The compensation is now seen, which fixes the finding. One
  small strain is left (item 2).
- **Companion's stale read.** It now names two remedies in a clause. "reading from the
  record the write went to" is slightly abstract, but it's adequate for a pointer into
  another field.

### New strains

1. **Ordering and gaps, second paragraph after Figure 6.** The new first sentence reads:
   "The real timing differs between the two settings, but a sequence diagram can't tell
   them apart, so the two drawings describe the same interaction." The reader has just
   watched two rows trade places, so the drawings plainly can be told apart. What the
   sentence means is that the diagram doesn't record timing. Fix: "The real timing
   differs between the two settings, but a sequence diagram doesn't record timing, so the
   two drawings describe the same interaction." This matters more than its size, because
   this is one of the two passages proposed for the style skill.
2. **Saga, paragraph after Figure 5.** "Between the hold and its release, A5's time was
   taken and anyone asking for it was refused, which is why Scheduling shows held." The
   new caption already says "Between the first hold and the last release, other customers
   could not book A5". At the end of the default run, Scheduling's status reads "free",
   not "held". Fix: cut the sentence from the prose, since the caption says it, or end it
   "which is why Scheduling shows held until the release".

### Whether the extra two minutes earn their place

Mostly yes. The deep dive gained about 310 words of prose and 44 of sources. Almost all
of the prose is a condition the reader needs: why a claim has a lease, which characters
mean what in which tool, why the code needs PKCE, and that the TLS count is for a first,
full connection ("Resumed sessions, and TLS 1.2 with the False Start extension, can send
sooner"). The chatty definition also earns its words. All of these change what a reader
would conclude or do.

These could go without losing a condition:

- **"Writing a diagram as text" repeats Figure 1.** It prints Figure 1's nine-line
  listing again, already one click away under the figure, and restates the key that now
  sits under Figure 1 ("The key under Figure 1 reads it: participant lines declare…").
  Replace both with one sentence: "Figure 1's source, with the key under it, is a
  complete example." Keep the sentence on which versions it parses on. This saves about
  60 words and the listing, roughly half a minute.
- **The `alt` gloss in "Choosing what to draw" is three sentences** ("The alternative is
  one diagram with an alt frame, a box whose sections hold alternative paths, around
  every failure. Combined fragments explains frames. The companion takes the first
  approach…"). It could be one clause, as I first suggested: "…rather than one diagram
  whose alt frame (a box of alternative paths, explained under Combined fragments) holds
  them all."

With those two cuts the deep dive would come back to about 26 minutes. I'd keep
everything else.

### The style skill's pointer

I confirm both passages, the first once its strain is fixed.

- **Ordering and gaps, the two paragraphs after Figure 6.** It runs from "With the early
  poll, the worker claims J9 before the browser has R17…" to "…the booking it confirms
  already exists." The reader watches two rows trade places, then the rule is stated as
  the name for what they saw. That makes it the closest replacement for the three-losses
  passage. Confirm it once item 1 is fixed. As it stands, its pivot sentence says
  something the reader can see is untrue.
- **Trust boundaries.** The section runs from "When boxes mark trust boundaries, the
  diagram answers which messages cross them." to "A diagram without boxes can't answer
  the question at all." The PKCE paragraph is denser, so if the skill names one
  paragraph, name "Follow what crosses into Mina's device…" through "…and to be used only
  once." That paragraph is the chain of consequences worth copying.

### Updated verdict

**Ready as a draft after two one-sentence fixes:** the Ordering and gaps sentence (item 1)
and the saga sentence (item 2). The Mermaid-key wording and the two cuts above are
optional. The first-round repairs landed without adding the hedging or repetition that
stacked fixes often leave. The new paragraphs (lease, PKCE, the tool warning) are plain
and each carries a condition. The deep dive still works as a style reference, and so do
the two passages proposed for the skill, once item 1 is fixed. The style skill's pointer
remains the owner's change to make. As before, passing review doesn't authorise
publication.
