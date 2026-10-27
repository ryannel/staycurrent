# Teaching review, round 1: Cache stampedes and the thundering herd

Reviewer: independent editor, fresh to this article. Date: 2026-10-27.

**Verdict: publishable after required fixes.** 5 required, 15 suggested.

## How I reviewed it

- I re-read `brief.md` and the article's entry, with its neighbours, in `plan.md`. I also read the full text of Gears and Load Balancing. I used six of their demonstrations in Playwright: Gears sliders 0, 5 and 12, and Load Balancing simulations 0, 2 and 5, each played and with its slider moved.
- I read the rendered article at `http://localhost:4456/learn/databases/caching/stampedes/`, top to bottom, with `CACHING_DRAFT_PREVIEW=1`.
- I used every figure:
  - Figures 1, 3, 5 and 7: stepped with "Step 1 s" through an expiry, and played mid-rebuild.
  - Figure 1: rate set to 5 and 40.
  - Figure 2: rate set to 100 and 1,000.
  - Figures 3, 5 and 7: both choices.
  - Figure 4: all 11 steps.
  - Figure 6: all 8 steps with DEL and with DELEX.
  - Figure 8: β set to 0.5, 1 and 2, then stepped through two cycles.
  - Figure 9: four combinations of β and traffic.
  - Figure 10: capacity set to 60, 100 and 150.
- I checked reduced motion: Figure 1 stays paused at 0.0 s.
- Screenshots in light and dark, desktop and 375 px, are in `review-screens/` (40 files). I also took ad hoc captures while using the figures. No console errors and no page overflow appeared at 375 px.
- The dev server reloaded the page several times during my runs because other work was hot-reloading. Retries fixed it, and the article itself is not at fault.
- I checked the derivations by hand.
- Against primary sources I checked:
  - the Redis distributed-locks page (both quotations are exact);
  - `DELEX`: since 8.4.0, `IFEQ`.
- I compared the numbers with `evidence/stampedes.txt`.
- I ran the `hotkey-model.mjs` model for 300 s per mode, and the model tests (10 pass).

**Links to other articles.** All ten links go through `src/components/caching/shared/ArticleRef.astro`, imported at line 3. There is no local copy in `src/components/caching/stampedes/`. Every slug exists, and every anchor resolves: `#jitter`, `#leases`, `#variations` and `#read-through`. Outside this article, `src/components/caching/caching-patterns/ArticleRef.astro` is a local copy, which the brief forbids. Raise that with article 2's owner.

## Overall

This is a strong article. The core sequence is very good teaching.

- Figures 1, 3, 5 and 7 use one scene, with one choice changed each time. The reader watches a stampede, then single-flight, then the lock, then serving stale. They can attribute every change to the defence, which is exactly what the brief asks for.
- Figure 2 makes the "δ squared" point visible.
- Figures 4 and 6 are clean stepped sequences of observed commands.
- Each model result is followed by a real-Redis measurement. That is honest about what is modelled and what was observed.
- The voice is plain and the paragraphs build. The closing table and the four questions turn the article into decisions.

The weak stretch is XFetch: Figure 8, the derivation and the paragraph about the paper's bound. It is the hardest material, and it has the least legible figure. It also contains a mislabelled quantity, and it ends in a scholarly aside that makes a newcomer read without return.

## Required

### R1. The opening's hit ratio is wrong for its own numbers

Line 16 says: "The site serves about 500 page views a second. The hit ratio for the key is above 99.9%…"

With `EX 60` at 500 reads a second, a minute holds 30,000 reads. The article's own count is 100 misses per expiry, so the miss ratio is 0.33% and the hit ratio is about 99.7%, not above 99.9%. A reader who checks the arithmetic, as the article invites, will find the opening scenario inconsistent.

**Fix:** "The hit ratio for the key is about 99.7%". Alternatively, change the TTL or the rate so that 99.9% holds.

### R2. The derivation mislabels H(y), so the argument reads backwards

Line 148 says: "the expected number of starts still to come from y on is: H(y) = rβδ × e^(−y/βδ)."

<var>y</var> is defined as the time left before expiry. The starts still to come between <var>y</var> and the expiry number rβδ(1 − e^(−y/βδ)). That count is zero at y = 0 and does not equal the formula given.

The formula is actually the expected number of starts that have already happened by the time <var>y</var> seconds remain, counting from far in the past. The rest of the argument uses it in exactly that sense:
- "the first refresh happens where about one start is expected";
- "the value of H at the first start averages 1";
- H(y − δ) − H(y) is the number of starts during the rebuild.

The next sentence repeats the inversion: "The first refresh happens, on average, where about one start is still expected."

The algebra and the result, e^(1/β), are correct. I checked them, and the lead formula βδ(ln rβδ + γ) matches the measured 1,028 ms against a predicted 1,036 ms. But a careful reader following the words will get lost at exactly the point the article calls "surprising".

**Fix:** Define H(y) as "the expected number of refreshes that have started by the time y seconds are left". Change line 150 to "where about one start is expected to have happened". Add a reason clause for "H at the first start averages exactly 1". For example: "if you count how much expected traffic has gone by when the first start comes, that amount is random with an average of exactly 1. A Poisson process has this property."

### R3. A write that deletes a hot key causes a stampede, and the article never says so

The article presents stampedes as caused by expiry: the opening, Figure 1, the stale section and XFetch. But the collection's default invalidation is to delete the key on write (article 5). Deleting a hot key starts the same stampede, and the plan's sources call this case the thundering herd: Facebook's narrower sense, a key both heavily read and frequently written.

For a practitioner, this changes the choice of defence:
- Single-flight and the lock still work.
- Serving stale has nothing to serve if the write deleted the copy.
- XFetch cannot act ahead of a delete.

The table on lines 193–199 and the questions on lines 204–207 would then mislead a reader whose hot key is invalidated on write. Line 137 mentions Facebook keeping deleted values as stale, but does not draw this conclusion.

**Fix:** Add a short paragraph, in the stampede-size section or the stale section, covering:
- a delete on write is an expiry at a moment you do not choose;
- which defences still apply;
- the remedy if readers can accept a slightly old value: mark the copy stale instead of deleting it (rewrite the soft expiry to now), or keep the old value briefly as memcache does. Link `invalidation` through `ArticleRef`.

Add a "Triggered by" note, or a row, to the table.

### R4. Figure 8 hides the duplicates the prose asks the reader to watch

Line 147 says: "the first rebuild is rarely the only one… Those are duplicate rebuilds, a small stampede."

In the figure, every rebuild is drawn as a rectangle in the same single "Rebuilds" band, and the rectangles overlap. In my captures (`f8-t14`, `f8-t16`), two or three rebuilds look like one smudged box, so only the readout shows that there were several.

The legend also shows "Head start reaching the expiry" as a dotted brown circle. The figure never draws that marker: it draws a solid brown line from the request to the expiry.

The rest of the figure is dense for a first look: rows with no meaning, the previous cycle faded to the right of a sweeping "now" line, and a probability curve. Of all the figures, it is the one a newcomer could not follow without the prose.

**Fix:**
- Stack each rebuild on its own lane in the band, or draw each rebuild bar on the requesting dot's row, and number them 1, 2, 3.
- Make the legend marker match the drawn line.
- Consider dropping the faded previous cycle: clear the rows at the start of each cycle, so the reader sees one cycle at a time.

### R5. Figure 9's caption and the prose misdescribe the paper's line

The caption says: "the dotted line is the formula the paper quotes for β = 1." But the chart plots that line across all β, from 0.5 to 3, as Theorem 7's expression. The paper quotes only its value at β = 1.

Line 155 says: "The dotted line needs explaining". The figure has two dotted lines, "Paper's formula" and "Chosen β", so the reader cannot tell which one is meant.

The article's case against a published theorem rests on this line, so the caption must be exact.

**Fix:**
- Caption: "the dotted brown line is the paper's Theorem 7 expression at each β (2.35 at β = 1), which the paper states as a bound."
- Prose: "The paper's line, dotted, needs explaining".

## Suggested

### S1. Shorten the paragraph about the paper's bound in the body (line 155)

The paragraph runs to about 180 words of method detail: "request by request with random or evenly spaced arrivals, and with a faster exact method…", the Goodreads plot reading, and "My reading is that the proof's estimate is too optimistic…". That is evidence for a specialist, not something a newcomer needs.

**Fix:** Keep two sentences in the body: the paper quotes about 2.4, a bound; simulation, its own Goodreads data and the Redis run all give about e^(1/β), so plan for about three. Move the rest into a short note under Sources, or into the Vattani source entry.

### S2. Make the XFetch derivation easier to follow, or easy to skip

"0.58 is Euler's constant" is ambiguous: many readers know e as Euler's number. Write "the Euler–Mascheroni constant, γ ≈ 0.577".

Gears derives each result in three short steps. Here the steps are longer, and the reader needs the result (e^(1/β), with the rate dropping out) more than the proof.

**Fix:** Open with one sentence that gives the result, then mark the derivation as the reasoning for readers who want it.

### S3. Move "Many keys expiring together" (lines 45–49) next to the cold start

The section interrupts the run of single-key defences, between the database section and single-flight. It belongs with the other many-keys case at the end. The cold-start section already contrasts one key with every key.

**Fix:** Move it to sit before or inside "A cold start stampedes every key at once", under a heading such as "When many keys miss at once".

### S4. Note the narrower "thundering herd" in the body

The plan asks article 6 to note that "thundering herd" has a narrower meaning in Facebook's memcache paper. That note is currently only in Sources (line 221).

**Fix:** Add one clause to line 17, or to the lease paragraph. This also supports R3.

### S5. Figure 10: lead with the queue, and say what the queue does to users

The two hit-ratio lines nearly overlap, so the 10 s against 7 s difference is subtle on the chart. The lower chart carries the lesson.

The text alternative says the key consequence, "for those seconds most misses give up before their answer arrives", but the body prose never does. With a 4.4 s queue and a 1 s give-up, nearly every miss fails for about ten seconds.

Other details:
- The series name "Every miss queries" reads as a sentence. "No coalescing" and "Coalesced", or "One query per key", are clearer.
- The "4.4 s against 1.5 s" readout is blue, which matches neither series.

**Fix:** In the prose, describe the queue chart first and state the give-up consequence. Rename the series. Colour or split the readout to match its series.

### S6. Figure 2: label the axis in seconds, and mark the other page's query

The axis reads "500, 1k, 1.5k, 2k" milliseconds. The prose and the readouts use seconds ("1.2 s").

The prose asks the reader to follow "one query for an unrelated page… joins the same line", but that query appears only in a readout.

**Fix:**
- Use seconds on the axis.
- Mark the other page's arrival at 100 ms and the moment it gets a connection, at about 0.42 s, as a small bracket or marker.

### S7. Figure 9: make the notation and the colours consistent

- The legend and readout write "e^(1/β)", where the prose uses superscripts.
- "5.2 rebuild times (formula 5.2)" wraps awkwardly at large size.
- The "First rebuild starts…" and "Expiries reached…" readouts are in the brown of "Paper's formula", which suggests a connection that does not exist.

**Fix:** Use a superscript, or "e to the 1/β", consistently. Use a smaller secondary readout, or drop "(formula 5.2)" into the label. Use neutral colours for readouts that are not tied to a series.

### S8. Fix the phone-width layout of the sequences and labels

At 375 px:
- Figure 6: the "slow query" and "query fails" notes sit left of lane A, outside its line, and cover step numbers 2 and 5 (`use/phone-f6-end.png`).
- Figures 4 and 6: "Request A" and "Request C" wrap onto two lines inside their boxes, while "Request B" does not.
- Figure 7: the "fresh copy · no lock" label runs to the right edge.
- Figure 8: the β value wraps onto its own line.

**Fix:** Use shorter lane labels on narrow screens ("A", "B", "C"), anchor the notes inside the lane, and wrap or shorten the Redis state label.

### S9. Explain how a practitioner finds the keys that can stampede

Line 33 says these keys "are usually few, and you can name them", and the decision rule needs reads a second times rebuild time. The article never says how to measure either in production. A practitioner needs:
- per-key read rates, from application metrics or sampling;
- rebuild time, logged around the loader;
- duplicate identical queries in the database's statement statistics.

**Fix:** Add one paragraph, with a pointer to article 10 for hot-key detection and to article 11 for monitoring.

### S10. Name the source and tighten the link on line 42

Line 42 says: "The paper behind the early-refresh technique later in this article notes that stampedes are often called cascading failures". That is an awkward forward reference.

**Fix:** "Vattani and colleagues, whose early-refresh rule appears later, note…". The `caching-patterns` link in the same paragraph cites "Figure 4 there", so give it `hash="read-through"` as line 181 does.

### S11. Trim the lease paragraph (line 115)

At about 170 words, the paragraph repeats article 5's lease mechanism and the 17,000 to 1,300 figure, which article 5 already quotes.

**Fix:** Keep: the lease is the same primitive; readers who find a placeholder should wait and read again; a separate lock key combines more easily with serving stale. Cut the repeated mechanism.

### S12. Break up the lock-limits sentence (line 124)

"Several things can let two holders in: a holder that pauses…; a failover to a replica that had not yet received the lock, because Redis replication is asynchronous; and clock changes, since, as the same page notes, '…'". This one sentence carries three mechanisms and a quotation.

"Fencing tokens" is also used without a definition.

**Fix:** Make the three causes a short list, and add a clause such as "a fencing token: a number that increases with each grant, which the protected resource checks".

### S13. Figure 6: show B's query

The step text says "Two requests are now rebuilding the same key", but only A's query appears, as a note. B's rebuild is not drawn.

**Fix:** Add a "query" note on lane B at step 5, and on lane C at step 8 in the DEL variant.

### S14. Show the query timeout in the lock code

The hazard section depends on "set the database query's timeout comfortably below the lock's expiry". The code on lines 83–105 has no timeout.

**Fix:** Write `db.trending(timeout=2.0)`, or add a comment, so the code matches the advice.

### S15. Small wording points

- Figure 10's caption says "Zipf popularity", which is not defined in this article. Write "a few keys very popular and most rarely read (Zipf-like, as in the introduction)".
- Two lines read as slogans next to the brief's "no aphorisms": "Ninety-nine of them are pure waste." and "The lock saves the database, not the readers." The second is explanatory and can stay. Consider folding the first into the sentence before it: "All hundred return the same rows, so ninety-nine are wasted."

## Questions answered

1. **Teaching.**
   - Figures 1, 3, 5 and 7 can be followed from the figures alone. Each isolates one choice, and the prose says what to notice ("Notice the dotted line…", "Switch to…", "Notice the stale responses…").
   - Figure 2 teaches the pool effect well. Figures 4 and 6 are clear step by step.
   - Figure 8 does not stand alone (R4), and the derivation after it is where a reader gets lost (R2, S2).
   - The paragraph about the paper's bound (S1) is where a reader reads without return.
   - Nothing important is used before it is defined, except "Zipf" in a caption and "fencing tokens" (S12, S15).
2. **Depth.**
   - It reaches practitioner depth on single-key stampedes, the lock and its hazards, serving stale, and XFetch, with measurements.
   - Missing: write-triggered stampedes (R3) and how to find candidate keys (S9).
   - Could be cut: most of the paper-dispute paragraph and part of the lease paragraph (S1, S11).
   - It stays within its coverage map. Cold-start operations go to article 11, hot keys to article 10, and jitter is referred back to article 4.
3. **Writing.**
   - Plain British English, short sentences, informational ledes and connected paragraphs.
   - Terms are defined at first use: rebuild lock, soft and hard expiry, request coalescing and head start.
   - Failures are few and are quoted above (R1, R2, S10, S12, S15).
4. **Figures as artefacts.**
   - Both themes are legible, and controls are labelled.
   - Reduced motion is respected, and every live figure has a "Step 1 s" button.
   - Text alternatives convey the results.
   - Problems: Figure 8's legibility (R4), Figure 9's caption (R5), the Figure 10 and Figure 9 readout colours (S5, S7), and phone layout of the sequences (S8).
5. **Beside the references.** Yes, mostly. The hot-key figures and the stepped lock sequences would not look out of place beside Load Balancing's simulations. **The single biggest gap is the XFetch section.** It is the one place where the article explains by algebra and argument instead of by a figure the reader can read at a glance. Its figure is the least legible in the article, and its derivation contains the article's one real error of exposition. Gears would show this with one clean picture and a three-line derivation.
