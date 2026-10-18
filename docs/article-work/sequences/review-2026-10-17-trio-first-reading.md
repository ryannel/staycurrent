# First reading: Sequence diagrams, Drawing asynchronous and event-driven interactions, Sequence diagram syntax

Date: 17 October 2026
Reader: uncued agent reading as a software engineer three years in. I can roughly follow a sequence diagram in a design doc, have never been taught the notation, and want to draw our system's message queue and third-party webhooks properly.
Material: rendered-text extractions of the three pages in the scratchpad (`sequences.txt`, `async-interactions.txt`, `sequence-syntax.txt`). These are not live browser readings. Interactive figures appear only as their caption, control labels and the default "Messages in order, as text" list, so I can't see any figure's other cases, its colours, the hatched waiting bar or the faded paths. Practice "Discussion" blocks were flattened into the page text, so I couldn't tell whether they start closed.
Granularity: I read the first article's title and four opening paragraphs alone and recorded what I understood. I then read each article in chunks of about 150 to 200 lines. I extracted the heading lists of articles 1 and 2 before reading most of their bodies, so my heading expectations are partly outline-first, not blind. Article 3 was read top to bottom without an outline.
Voice and method: the blind-review voice reference and the first-reading guidance. I read nothing else in the repository.

## The opening of Sequence diagrams, read alone

What I could explain after the four opening paragraphs:

- **What it is.** Messages between parts of a system during one interaction, in order. Each part has a vertical line, time runs down the page, and each arrow is one message. The first paragraph gave me this in three sentences.
- **What it's for.** It shows order, who sits waiting, and what each side knows when a reply never comes. The contrast with "boxes and arrows" in the second paragraph is what made the purpose land. Until then I'd thought of a sequence diagram as an architecture diagram with arrows numbered.
- **When I'd draw one.** For a request that crosses services, for a slow page, or to decide what happens when a service never answers. That list matches real moments from my job.
- **What I expect next.** One running example (Mina, Repair API, Repair DB, a worker, an email provider), Mermaid for every diagram, and a payoff question: why does sending the email inside the request make her wait, and how can a retry send two emails? I wanted that answered, and I trusted the article to answer it.

The opening sets up the example well. One small strain: the fourth paragraph adds "timeouts inside timeouts, how much to put in one diagram, and how to review a diagram", which made me expect a long article (the badge says 32 minutes). That was accurate.

## Question log, in reading order

### Article 1: Sequence diagrams

**Lifelines and messages.** I expected the basic vocabulary and got it. "Left to right carries no meaning. Put whoever starts the interaction on the left, so requests travel right and replies come back left." This is a rule I'd never been told and will use. The paragraph on a lifeline standing for a role ("Worker A" and "Worker B" or "the race has nowhere to appear") answered a question I didn't know I had. The first Mermaid listing is explained in the sentence after it, which is good pacing.

**Replies and activation bars.** Clear. Figure 2's controls (database 5 ms to 3 s, "Browser gives up after") are described well enough in text that I could follow the claim without seeing the figure. "Vertical distance shows order, not elapsed time" is the single most useful sentence in the section. The rule for when to draw a bare "OK" reply ("as long as nothing in the design hangs on that reply failing to arrive") gave me a test I can apply. I couldn't see how the hatched waiting bar differs from a working bar, so I took the prose's word for it.

**Synchronous and asynchronous messages.** This answered the opening's first question: when the API waits for the provider, Mina waits 2.5 s. "The two words describe the sender, not the protocol", followed by `await fetch` and a fire-and-forget HTTP call as examples, cleared up a confusion I really had. The one sentence on brokers ("a synchronous call to the broker ... followed by an asynchronous delivery") is the first thing that spoke to my queue. "Neither version suits a booking" is a good hinge into the next section.

**Background workers and the transactional outbox.** I followed the outbox definition and Figure 4's default. Then I slowed down at the multi-worker claim:

> "With several workers, each claims a job with a locking read that skips jobs another worker holds. Because that lock ends when the claim commits, long before the email goes out, the claim also marks the job taken for five minutes"

I read it three times. I had to picture two workers, a lock that ends early and a separate five-minute mark, all in one sentence. I eventually got it: the lock prevents two claims at the same moment, and the five-minute mark protects the job afterwards. "Locking read that skips" is SKIP LOCKED, which the sources name but the body doesn't. The short Worker A and Worker B listing after it helped. "The diagram doesn't decide which worker wins. It says only that exactly one does" is a good sentence. The section ends by setting up the duplicate-email gap, which I wanted resolved.

**Lost messages and timeouts / What the caller knows.** Strong. Three causes that look identical to the worker, plus Mina's inbox as a lifeline the worker can't see, made "outcome unknown" concrete. "Don't draw a reply arrow labelled 'failed': nobody sent one" is a rule I'll quote in reviews. The undici 300-second default is a useful practical aside.

**Timeouts inside timeouts.** "Go back to Figure 2" made me scroll back and rebuild the figure's state in my head, which was some effort. The duplicate-booking story is clear. I read "Each caller's limit has to be longer than the longest its callee can take" twice before connecting it to "the API should stop waiting for the database at, say, 2". The rule is stated from the caller's side and the example sets the callee's limit, so I had to flip it. That was manageable.

**Retries and idempotency keys.** This answered the opening's second question. "Derive the key from the job, not from the attempt" is exactly the mistake I'd have made. The Resend 24-hour figure and the 27-attempt multiplication are concrete and memorable. In the listing, `Provider--xWorker: 202 Accepted` uses `--x`, which I hadn't been shown. I inferred it was the dotted form of the `-x` cross from the previous section.

**Order, gaps and what a diagram leaves open.** One of the best passages in the trio. "Those two rules are all a sequence diagram promises" changed how I'll read every diagram. Re-drawing the outbox with the worker's claim before the 201 proved the point. The autonumber version note ("Decimal values need Mermaid 11.15 or later") is version trivia I didn't need here.

**Combined fragments.** The intro defines operator, guard and section in one paragraph. That's dense but fine because each operator follows with an example.

- *alt and opt.* Clear. "Write guards that the participant making the choice can check" is a good, testable rule.
- *loop.* Figure 8's message list reads `Repair DB → Repair API: received`. I first took "received" as an acknowledgement ("the DB received the query") rather than the repair's status value. Only `200: scheduled` on pass 3 told me "received" was a status. Naming it ("status: received") would remove that stumble. The wasted final wait is a nice observation.
- *par.* Clear, and "If one request needs the other's reply, they aren't parallel" is a good test.
- *break.* Short and enough.
- *critical.* Here I got confused. The prose says critical is about order, not transactions, and that Mermaid reads it "more loosely" as something that must happen, with option sections UML doesn't have. It then says to use critical only "when the claim really is that no other message may come between these ones". The listing that follows wraps the worker's job claim in `critical Claim a job ... option no job is free`. Is that the UML meaning being endorsed, or the looser Mermaid meaning just warned about? I couldn't tell whether to copy the example or avoid it.
- *ref.* Clear. Splitting the outbox at the database ties back to the earlier promise.
- *Rare operators and deep nesting.* Fine as a short reference. The note that `neg` marks a sequence that must never happen is the one I might meet.

**Actors, self-messages, notes and short-lived participants.** The listing helps. The paragraph on participant symbols strained: "the same line fails to parse on 11.4.1 and parses on 12.2.0" is test-log detail, and "Like the queue symbol at the whiteboard" refers to something this article never showed me. I guessed it meant another article.

**Queues, events and callbacks.** Expected substance for my queue question and got a signpost instead. It's thin, but on purpose, and it sends me to the right place. The two rules it gives (a queue gets a lifeline when acknowledgement, retention or redelivery matter; a callback is a new message tied by an id) are the right ones to carry forward.

**How much to draw.** "Each diagram should answer one question" is well argued. Figure 10's text version describes the crowded diagram, but I couldn't see the two focused diagrams. "On this site's figures, labels start to shrink past about eight lifelines ... not a rule" is honest calibration. References to "the architecture article" and "C4's code level" assume I've read something I haven't.

**Reviewing a design with a sequence diagram.** The checklist is the most reusable thing in the article, and "Try three of them on the outbox diagram" shows me how to use it. That worked very well. One item, "Does the diagram agree with the request's state lifecycle?", brings in a state lifecycle that this article hasn't introduced. The trace-versus-diagram paragraph for incidents is good.

**Common mistakes.** A useful recap. The first item points to "(Webhooks and callbacks)", a section in the next article, not this one. That's fine if it's a link.

**Mermaid, PlantUML and what Mermaid can't draw.** "This article has met several gaps: a ref frame, a found message, ..." I hadn't met a found message. The term isn't defined anywhere in article 1. The PlantUML listing that follows uses `[->` with "It adds a found message", so I inferred the meaning from the syntax. The definition arrives in article 2's webhook section. This section also overlaps the syntax companion, as it says itself.

**Practise with a cancellation race.** A good exercise, and the discussion answers it in a way that reuses the order section. My questions:

- "409 Already cancelled": instance B gets "0 rows changed". How does it know the repair was *cancelled*, not just no longer Approved? It would need another read. The drawing skips that step.
- The listing's closing note reads "The other winner is equally valid", which I had to parse. I think it means the other order is equally valid.
- R42 and the status Approved are new, but the setup introduces them, so continuity was fine.

### Article 2: Drawing asynchronous and event-driven interactions

**Opening.** After it I could say what the article is for: arrows that promise less than a call, and reading other people's diagrams for what they leave out. It says plainly that it doesn't teach broker behaviour, which set my expectations correctly. The "invented for this article" disclaimer is fine. The continuity back to R17, J9 and the provider helped.

**Three questions for every asynchronous arrow.** Clear and immediately useful for my queue. "That sentence in a note, with the product named, is worth more than an arrow that lets readers assume" is a good working rule.

**The broker as a participant.** This repeats article 1's broker sentence (synchronous publish, asynchronous delivery), expanded with SQS and RabbitMQ. I expected the repeat to bore me, but the expansion paid for it. The rule for when to draw the broker as a lifeline versus a direct arrow, and "Don't draw both for the same hop in one diagram, because a reader will count two messages", directly answered how to draw our queue.

**Queue or topic.** Short and enough: "let the arrows count".

**Acknowledgement and redelivery.** The best section for my purposes. "Where the acknowledgement sits decides what a crash costs", with three cases, is a clear frame. The link back to the outbox's expired claim ("A claim that expires and a deadline that passes are the same event") joined the two articles well. The listing matches the prose.

**Messages that keep failing.** The dead-letter branch is described ("an alt after the Nth delivery") but not drawn. I wanted to try it and had to build it in my head. "A diagram that ends at a dead-letter queue claims that someone looks there" is a sharp point.

**Fan-out to several consumers.** Clear. "The arrows to the subscribers leave the topic, not the scheduling service" is the claim I'd most often get wrong. This is where I first had to keep a new identifier straight: A5 is a scheduled visit here.

**Competing consumers or subscribers.** Useful distinction. It partly repeats the Worker A and Worker B material from article 1, which is fine.

**Ordering and overtaking.** The opening paragraph restates article 1's "only two places" rule almost word for word. As a reminder it's acceptable, but I noticed it. Then two confusions:

- The listing begins with `Note over Sched,Topic: Ordered per appointment id`, and then the topic delivers v3 before v2 for the same appointment. If ordering per appointment is guaranteed, how did they swap? The next paragraph says even a per-key order can break through redelivery or parallel workers, but the listing doesn't show either. As drawn, the note and the arrows contradict each other.
- Why does applying "Moved" last leave billing with an invoice? I supplied the step: billing raises or re-raises an invoice on any scheduled or moved event. That's reasonable, but the article doesn't say it.

The stale-read paragraph is a good, brief extension.

**Webhooks and callbacks.** This is the section I came for, and it delivered.

- *A callback is a new message.* The best explanation of the error in the trio. "A dotted arrow ... labelled 'bounced', would say that the worker was still waiting hours later" makes the mistake visible. The found message is defined here, one article after it was first used.
- *The correlation id.* Clear: three arrows carry m-481. The note that some providers let you attach your own reference was practical.
- *The callback that arrives first.* Excellent. I wouldn't have thought of a callback arriving before the save. The trade-off between store-first and returning 5xx so the provider retries is reasoned, with sources. Signature verification gets one sentence ("belongs in the same place") and no drawing. For a team drawing third-party webhooks that felt thin. Where does verification sit, and what is drawn when it fails?
- *When no callback comes.* "An absent arrow is the hardest thing in a diagram to notice" is good.

**Flows that last hours or days.** The three questions (how long, what holds the flow, what wakes it) are a clear frame. "Draw the clock as a participant" is new and useful. Two strains:

- The "vertical distance shows order, not elapsed time" point and "Mermaid has no marker for a delay, so a note" both repeat article 1.
- The listing ends `API--xMina: 409: A5 released`. Article 1 taught `-x` as a lost message. Here the cross marks a refusal that *was* delivered. The saga listing does the same with `Billing--xBooking: Declined`. Article 3's table later calls the cross "A lost or failed message", but by article 1's teaching a reader will read these as lost replies.

A5 was "a visit" in the fan-out and ordering sections and is "slot A5" here. I wasn't sure whether A5 names a slot or an appointment, and whether it's the same A5.

**Sagas and compensation.** Clear and well sourced. The four claims about compensation (new messages, order is a choice, compensation can fail, some steps can't be undone) are the right structure. "which is why the figure's status line shows held at the slot": I couldn't see this in text. The "release lost" case isn't in the listing, so I'd want to try drawing it.

**Orchestrated or choreographed.** The paired listings make the difference visible in a way prose alone wouldn't. "Mark each diagram as orchestrated or choreographed in its title" is practical.

**Which view for a long-running workflow.** The table is clear and the A5 state example makes it concrete. Two sentences read as broken in extraction because other articles' titles serve as the subject: "Cancellation and starting work can race works through a case ..." and "Waiting, reminders and cancellation draws a timer ...". If these are links they may read fine on the page. As text, I tripped on both.

**Questions to put to every arrow.** Bookends the opening's three questions with a fuller table. Some repetition, but this is the version I'd keep for reviews. "What did other readers see in the middle?" is a question I wouldn't have thought to ask.

**Try a completed-repair event.** A good exercise that exercises fan-out, duplicates and overtaking in one scenario. There's no reference listing for the answer, so I can't check my drawing against one. Article 1's practice had one.

### Article 3: Sequence diagram syntax

**Opening.** Clear about its job ("you know the picture you want and need the text that draws it"). Dating every listing is right for a syntax page.

**One booking in both syntaxes.** The side-by-side listings and the paragraph of differences are a good first lesson. One question about the scenario: the API sends the email asynchronously and doesn't wait, yet the note says "No reply within 10 s: outcome unknown". Article 1 taught that nobody is waiting for a reply to an asynchronous message, so who is timing the 10 seconds? It contradicts what the main article taught about this exact arrow.

**Constructs side by side.** The tables are the reason to visit this page, and they're easy to scan. Observations:

- The participant-type example `participant DB@{ "type": "database" } as Repair DB` uses the alias-after-type form, which the version table later says needs 11.13.0. GitLab "supports Mermaid version 11", so a reader copying this row could hit a parse error without knowing why. The row doesn't warn.
- The `#` entity-code trap is the kind of thing I'd lose an hour to. Good to have.
- The activation paragraph ("do the same job from opposite sides of the arrow ... Read them as 'start a bar on the receiver' and 'end the sender's bar'") needed two reads, but the summary rule worked.
- The frames table describes critical as "A region whose steps happen together, with fallbacks". Article 1 said critical means nothing else may interleave, and warned against looser readings. "Happen together" is a third meaning.

**Arrows that change meaning between tools.** Very useful. The three traps are concrete, and the `->>` trap alone justifies the page. "A lost or failed message: cross" widens what article 1 taught for `-x` (see the article 2 note above).

**What each tool can't draw.** Clear, with honest notes that Mermaid often accepts a wrong line and draws something else ("creates a participant called 'oB'"). This overlaps article 1's last section, which is expected for a companion.

**Where each one renders.** The table is practical. The `info` trick for finding GitHub's Mermaid version is useful.

**Mermaid syntax by version.** Dense but appropriate for a reference. I would only consult it when something fails to render.

**D2 and drawing by hand.** Brief and honest ("this page didn't"). Enough for a side note.

## Navigation: could I find my way back?

- **Article 1.** The headings work as a map for notation: lifelines, replies, sync/async, outbox, lost messages, retries, order, fragments by operator, then how much to draw, review and mistakes. I could find "where did it say the timeout rule?" again. Two headings didn't predict their content well. "Background workers and the transactional outbox" is really where the duplicate-email gap opens, and that isn't obvious from the title. "Queues, events and callbacks" is a signpost, not a section. "Order, gaps and what a diagram leaves open" is a good heading for a key idea. Four empty `##` headings at the end of each extraction are presumably layout noise.
- **Article 2.** The headings follow the opening's promised order exactly, so the map is reliable. "Which view for a long-running workflow" correctly signals a change of subject.
- **Article 3.** Built for lookup, and its headings work that way. "Arrows that change meaning between tools" is the heading I'd search for first.

## Comprehension, per article

**Sequence diagrams.**
Now I can: draw a request flow with calls, replies and activation bars, and decide which replies and bars to leave out. I can tell a synchronous from an asynchronous message by what the sender does next. I can draw a timeout as a note, not a reply. I can draw retries with an idempotency key derived from the job. I can use alt, opt, loop, par, break and ref correctly. I can split a crowded diagram by question, and review a diagram with the checklist, including spotting order the diagram doesn't guarantee.
I still can't: say confidently when to use `critical` in Mermaid (the example and the warning disagree), or define a found message from this article alone. I'd also struggle with the race exercise's step from "0 rows changed" to a specific 409 message.

**Drawing asynchronous and event-driven interactions.**
Now I can: draw our queue as a lifeline with publish, store, deliver and ack. I can place the ack and explain what a crash costs at each position. I can draw fan-out from the topic, not the publisher. I can draw a webhook as a new call with a correlation id, and handle the early-callback case. I can draw a timer as a participant, draw an orchestrated or choreographed saga, and know when to switch to a state diagram.
I still can't: draw a dead-letter branch or a failed compensation without inventing it. I can't place webhook signature verification in a drawing. I'm also unsure what `--x` means now, since it marks both lost and refused replies.

**Sequence diagram syntax.**
Now I can: translate a diagram between Mermaid and PlantUML without the `->`, `-->` and `->>` traps, choose a tool by where it renders, and check GitHub's Mermaid version.
I still can't: trust the participant-type row on an 11.x renderer, or reconcile its description of critical with the main article's.

## Writing, per article

**Sequence diagrams.** Passages that work:

- "Left to right carries no meaning." Short, true, and immediately changes how I draw.
- "The two words describe the sender, not the protocol." The rule comes first, then two examples that break my assumption. That's the pattern that works best across the trio.
- "Don't draw a reply arrow labelled 'failed': nobody sent one." It names the mistake, gives the reason, and fits in one line.
- "Those two rules are all a sequence diagram promises." It sums up the order section and sticks.
- "Try three of them on the outbox diagram." Showing the checklist in use is worth more than the list alone.

Passages that strain:

- The "locking read that skips ... lock ends when the claim commits ... marks the job taken for five minutes" sentence. It holds three mechanisms in one sentence, and only one of them (the five-minute mark) is drawn.
- The critical section's prose and listing pull in opposite directions (see the log).
- The version detail in "Actors" and "Order" ("fails to parse on 11.4.1 and parses on 12.2.0", "Decimal values need Mermaid 11.15 or later"). These belong to the companion and break the teaching flow here.
- "This article has met several gaps: ... a found message". The article never met one.

Thin: "Queues, events and callbacks", deliberately. Padded: little. The version detail and parts of the final Mermaid/PlantUML section overlap the companion.

**Drawing asynchronous and event-driven interactions.** Passages that work:

- "Where the acknowledgement sits decides what a crash costs." Strong framing for the most decision-relevant section.
- "A claim that expires and a deadline that passes are the same event." It ties the two articles together in one line.
- "A dotted arrow from the provider back to the worker, labelled 'bounced', would say that the worker was still waiting hours later." It makes the mistake visible by spelling out what the wrong drawing claims.
- "Draw the clock as a participant." Concrete and new.

Passages that strain:

- The ordering listing's "Ordered per appointment id" note next to swapped delivery of the same appointment.
- `--x` used for delivered refusals (409, Declined) after article 1 taught the cross as lost.
- A5's shifting identity (visit, appointment, slot).
- The repeated "only two places" ordering rule and delay-note advice from article 1.
- Article titles used as sentence subjects in "Which view", which read as broken sentences in text.

Thin: dead-letter queues (described, not drawn), webhook verification (one sentence), and the practice exercise (no reference listing). Padded: nothing stood out.

**Sequence diagram syntax.** Passages that work:

- The three arrow traps. Each names the copy-paste mistake and its consequence.
- "Where a line looks plausible, Mermaid often accepts it and draws something unintended, so look at the result." Practical and specific (the "oB" participant).

Passages that strain:

- The opening example's 10-second note on an asynchronous message nobody waits for.
- The critical row's "steps happen together".
- The participant-type row's example needs a newer Mermaid than the row admits.

Thin: nothing for its purpose. Padded: the version table is dense, but it's reference material and clearly marked.

## Things I'd have liked to try

- In article 1's Figure 2, setting the API's database timeout below the browser's limit to watch the error arrive in time. The prose describes this setting but the controls don't seem to offer it.
- Drawing the dead-letter branch and comparing it with a reference.
- The saga's "release lost" case as a listing.
- A reference listing for the completed-repair exercise.
- Webhook verification failure: what the receiver answers, and what the provider does next.

## Repair ideas, separate from the observations

In rough priority, by the understanding at stake:

1. **critical.** Make the article 1 listing match the advice: either drop it, or say explicitly that it shows Mermaid's looser meaning and why the claim example does or doesn't meet the UML meaning. Align article 3's table description. Recheck: can a reader say when to use critical after reading only that section?
2. **The cross arrow.** Decide whether `--x` means lost, or lost-or-failed. Use a plain reply arrow for delivered refusals (409, Declined), or teach the wider meaning in article 1. Recheck: shown `API--xMina: 409`, does the reader think Mina got the 409?
3. **Article 3's opening note.** Put the 10-second timeout on a waiting call, or reword the note so it doesn't imply someone is waiting on an asynchronous message.
4. **Ordering listing.** Either drop "Ordered per appointment id", or add the redelivery that breaks it, so the note and arrows agree.
5. **Found message.** Define it where article 1 first uses it, or drop it from article 1's list of gaps it "has met".
6. **Smaller fixes.** Name the loop's status value ("status: received"). Show how instance B learns "Already cancelled", or change the reply to "409 Not Approved". Fix A5's identity. Flag the 11.13 requirement on article 3's participant-type row. Split the locking-read sentence and say the lock is SKIP LOCKED.
7. **Optional additions.** A dead-letter listing, a reference listing for the completed-repair exercise, and one sentence placing webhook verification in the drawing.
