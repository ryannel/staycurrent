# Editorial review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" · a6e6a33

Inputs read: both pages as rendered by `pnpm astro dev --port 4543` at `/review/relational-trial-2/` and `/review/relational-trial-2/transactions/`, read in full from the served HTML (every heading, paragraph, caption, table, control label and every "Read this figure as text" panel); the step text, step labels, lane labels and option labels of the scripted figures in `src/components/relational-trial-2/a00/scenes.mjs` and `a03/model.mjs`; the intended audience (an intelligent engineer new to relational databases who wants to become an expert practitioner); the Sequence diagrams, Indexes and Storage and durability reference articles in `src/reference-articles/`, in full. Withheld and not opened: the plans, the writers' work records, the article `.astro` sources, everything else under `docs/article-work/`, git history, `src/articles/relational-next/`, `src/articles/relational-trial/`, `src/components/relational-trial/` and every other review report. The shared review banner ("38 of 38 drafts available") is route text and is not reviewed.

Verdict: repairs required (a00: repairs required; a03: repairs required)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | a00 pass; a03 finding | a00's headings say what each section covers. In a03 several h3 sections sit under h2 headings that do not name them (editorial-24). The anchors of both articles are planning claims (editorial-32). |
| 2. Plain sentences | finding (both) | Mostly plain and one idea per sentence in both. Exceptions: a00's plan-reading paragraph (editorial-18); a03's opening summary (editorial-26) and a stacked method sentence (editorial-31). |
| 3. Terms | finding (both) | a00 uses "planner", bitmap scans and other plan terms before it explains them (editorial-17). a03 names thirteen other articles by unlinked descriptions that are not their titles, one of them ambiguous (editorial-23). |
| 4. Openings | a00 pass; a03 finding | Sections open by telling the reader something. a03's "Retrying a transaction" opens with a bare instruction to replay a figure three sections back (editorial-29). |
| 5. Reader-facing text only | finding (both) | No planning or editing notes in the prose. The heading anchors, which readers see in the address bar and in shared links, are the plan's claim sentences (editorial-32). |
| 6. Captions and labels | a00 pass; a03 finding | a00's captions, legends and option labels are clear. In a03, "Record R8 first; attempt lost" does not say what is lost, and Figure 5's step text leaves it unclear how a COMMIT on a failed connection can arrive later (editorial-30). |
| 7. One piece | finding (both) | a00: one sentence that answers an objection after the point is made (editorial-19), a change of example inside a paragraph (editorial-20), a lab-report paragraph after Figure 6 (editorial-21) and a closing metaphor applied after the fact (editorial-22). a03: a set-up paragraph contradicted by its own figure caption (editorial-25), an aside on sequences and DDL (editorial-27) and an objection answered with a different example (editorial-28). |

## Findings

### editorial-17 · required · a00, "Indexes and the work behind a query", second paragraph

Problem: Before the reader has seen a single plan, the paragraph lists what the plans leave out: "the cost figures, row widths, the sort's method and its own page count, two detail lines of the bitmap scans, and the planning summary. The planner's row estimate is labelled." None of these has been explained yet. The planner is introduced two paragraphs later and bitmap scans after the second plan, and "cost figures" and "planning summary" are never explained. "The planner's row estimate is labelled" can't be understood at this point: labelled how, and as distinct from what? This passage is the article's first close look at physical work, and the experiment set-up the paragraph exists to give ("the shop's tables were copied and grown…") is buried under the list.
Effect: A newcomer starts the hardest passage of the introduction by decoding a list of omissions written in terms they don't yet know. Either they push through without understanding it, or they lose the thread of the experiment. Check 3 fails outright here.
Suggestion: Keep this paragraph to the scaled copy and what `EXPLAIN (ANALYZE, BUFFERS)` reports. Move the trimming note under the first plan as a short note, after the reader can see what a plan looks like, and say plainly that "estimated rows" is this article's label for the planner's guess.

### editorial-18 · optional · a00, "Indexes and the work behind a query", the paragraph after the first plan

Problem: One paragraph introduces how to read a plan, the order of steps, `Buffers`, a hit, actual against estimated rows, the planner, its statistics and why a gap between estimate and actual matters. Nine sentences each bring something new. One of them reads wrongly on the first pass: "The estimate is the guess of the planner, the part of the database that chooses the route, made before running from statistics it keeps about each table's values". "Running from statistics" reads as a phrase until the end of the sentence.
Effect: The reader has to slow down and re-read the densest paragraph in the introduction. The point about estimates, which the sequential-scan plan doesn't need, competes with the point about pages, which it does.
Suggestion: Split the paragraph into how to read this plan (steps, pages, hits) and the estimate. Give the planner its own plain sentence, such as "The planner chooses the route before the query runs, using statistics it keeps about each table."

### editorial-19 · optional · a00, "Transactions and competing buyers", the paragraph after Figure 4

Problem: The paragraph explains why read-then-write oversold and ends on a strong point: the rule "lived in the gap between the application's read and its write". Then it adds "The same race oversold the mug when each statement ran on its own without BEGIN." That sentence answers a question the reader hasn't asked. It reads as a later patch.
Effect: The paragraph loses its strong ending, and the reader stops to ask why autocommit is mentioned here.
Suggestion: Drop the sentence, or fold it into the earlier statement that a transaction "does not, by itself, decide what happens when two buyers compete", where it supports the point.

### editorial-20 · optional · a00, "Changing a live database", last paragraph

Problem: "Expanding and deploying can be undone by deploying the old code again. Contracting cannot always be. Dropping a column destroys its values…" The table the reader has just followed defines contracting as `SET NOT NULL`, which drops nothing. Mid-paragraph the example becomes a different kind of contract step, a column drop, without saying so. Redeploying old code also doesn't undo the expand step: the column stays.
Effect: The reader tries to match "dropping a column" to the five stages and can't, so the point about irreversible steps arrives blurred.
Suggestion: Say that contracting often also means removing the old column or table, and that this is the irreversible kind. Alternatively, state the reversibility of each of the article's own stages.

### editorial-21 · optional · a00, "Running and recovering the database", the paragraph after Figure 6

Problem: The paragraph opens with test procedure: "After an immediate stop, which skips the normal shutdown, the restarted server replayed its write-ahead log…" It never says that an immediate stop stands in for a crash. It goes on like a lab report ("A copy restored from a base backup … stopped at a point before the deletion, had order 101 back and lacked order 103"), and the teaching point arrives only in the fourth sentence.
Effect: A newcomer meets an unexplained operator term first and must work out that this is how a crash was simulated before the paragraph tells them what to conclude.
Suggestion: Open with the conclusion, that recovery brings back committed changes, mistakes included. Then give the observed evidence, with "an immediate stop, which behaves like a crash" or similar. The same holds for the method sentence in Sources ("holding its COMMIT back, waiting for a synchronous standby that never connects").

### editorial-22 · optional · a00, "Choosing a database, and what to read next", first paragraph

Problem: "Every section above described a contract: … how much physical work a question costs, how the tables can change and how the data comes back." Earlier, only the transactions section framed anything as a contract ("a contract with three parts"). Calling plan costs and staged schema changes "contracts" applies a unifying metaphor after the fact. It is the kind of clever framing the reader must accept rather than recognise.
Effect: The reader is told the article meant something it didn't say, and "contract" loses the precise meaning it had in the transactions section.
Suggestion: Say it directly. For example: choosing a database means writing down what the application needs in each of these areas (the rules it must enforce, what concurrent users may see, what a commit must survive, and so on) and testing candidates against that list.

### editorial-23 · required · a03, references to other articles throughout

Problem: a03 points to other articles thirteen times by descriptions that are not their titles, and none of these pointers is linked: "the article on locks" (four times), "the article on constraints", "the article on changing data", "the article on isolation guarantees" (in the prose), "the article on physical storage", "the article on concurrent load", "the article on request recovery" (twice), "the article on replicas" and "the article on background work". Only two prose references are linked (backup and restore, and connections). "The article on changing data" could be "Changing data with SQL", "Changing a live database" or "Running reliable data changes". The introduction names and links every article by its title, such as "Expressing rules with constraints" and "Recovering database requests safely", so the two articles name the same pieces differently.
Effect: A reader who wants the deeper treatment the article promises, for example ON CONFLICT, guard-row protocols, hot rows or replica acknowledgements, can't follow the pointer. They have to guess which title in the collection list is meant, and for "changing data" they may guess wrong. The collection's names stop being consistent between the introduction and its first long article.
Suggestion: Name each article by its title, as a00 does, and link it, at least at first mention.

### editorial-24 · optional · a03, heading hierarchy and the "In this article" list

Problem: Several h3 sections sit under h2 headings that don't cover them, and the nested contents list shows this. "Transactions, autocommit and ACID" and "Constraints" are under "Invariants". "Conditional updates" and "Repeatable Read and write skew" are under "Lost updates". "Retrying a transaction" and "A lost reply to COMMIT" are under "Aborts and deadlocks". "Emails and other external effects" is under "Durability". Each h2 names only its opening topic, not the section it heads.
Effect: The contents list misrepresents the argument. A reader scanning for where transactions are explained, or how to handle a lost reply, looks under the wrong parent or concludes the topic is a footnote to invariants or deadlocks.
Suggestion: Rename the h2s for what their sections cover (for example "How a transaction can end" for the aborts section), or promote the h3s that are topics of their own.

### editorial-25 · optional · a03, "Lost updates", the paragraph before Figure 2

Problem: "Both requests run at Read Committed." Three sentences later: "The last runs the same code at a stricter level, Repeatable Read". The figure's caption states the reverse of the first sentence correctly ("The first three options run at Read Committed"). The same paragraph calls the first option "the race you have already seen", although the opening told readers "you can start here".
Effect: The reader gets a flat statement that the paragraph then contradicts. A reader who started at this article is told they have seen something they haven't.
Suggestion: Say "The first three options run at Read Committed" in the prose. Describe the first option as the introduction's race, reworked for class 21, without assuming the reader saw it.

### editorial-26 · optional · a03, the "In short" paragraph

Problem: The summary packs the whole article into one paragraph. It ends on phrasing a newcomer can't decode yet: "the application has to find out what happened through the operation's own identity". "Make every writer lock the same row first" also comes before any example of a shared row.
Effect: The summary is useful to a returning reader. A newcomer reads its last sentences as riddles, which weakens an otherwise clear opening.
Suggestion: Keep the summary but use words the reader already has. For example: "give each request its own ID and use it to check whether the first attempt committed".

### editorial-27 · optional · a03, "Transactions, autocommit and ACID", the paragraph on sequences and schema changes

Problem: "A rollback undoes a transaction's changes to data, but not quite everything." The paragraph then covers sequence gaps and MySQL's implicit commit on schema changes. Neither has anything to do with the booking rules, the savepoint paragraph before it, or the error-scope paragraph after it.
Effect: The paragraph is an aside between two connected paragraphs about how much an error or rollback undoes, and the reader has to pick the thread up again.
Suggestion: Move it to a short note at the end of the section, or trim it to the one fact a booking developer needs, such as that ID gaps are normal.

### editorial-28 · optional · a03, "Rules that span several rows", third paragraph; also the Phantom card

Problem: "Locking the rows you counted instead is not enough. … If two requests each lock and count a class's reservations, neither lock stops the other inserting a booking it never counted." The section is about rule 3, instructors, where both requests update existing rows. The paragraph answers this objection with a different example, counting bookings, where the problem is new rows. The Phantom card ("Another transaction can still add a row that breaks a rule you checked, as write skew shows") likewise points at write skew as a case of adding rows. The article's write-skew example only updated existing rows.
Effect: A reader can take away that locking the counted instructor rows would fail for rule 3. The paragraph doesn't show that, and the article's own example doesn't support it. The switch of example breaks the section's single line of argument.
Suggestion: State the limit in terms of new rows ("a row lock can't cover a row that doesn't exist yet, such as a new booking"), and say that this is why a stable guard row is preferred. Make the Phantom card's cross-reference match the example the reader saw. Practitioner review may want to confirm the claim for rule 3.

### editorial-29 · optional · a03, "Retrying a transaction", first sentence

Problem: The section opens with a bare instruction, "Switch Figure 3 to Serializable, repeat only the write", and doesn't say why. Figure 3 is three sections and several screens back.
Effect: The reader has to scroll back to find the figure before learning what the section is about. They meet the point, that a retry must rerun the reads and the decision, only after the replay.
Suggestion: Open with the point, that a retry that repeats only the failed write keeps the stale decision. Then send the reader to Figure 3's last option, or restate its outcome in a sentence.

### editorial-30 · optional · a03, Figure 5 step text and the option "Record R8 first; attempt lost"

Problem: In "Look up R8 first" and "Record R8 first" the step reads "The service sends COMMIT and the connection fails. The COMMIT has not reached the database yet, so the first attempt is still open there". A later step reads "The first attempt's COMMIT reaches the database late". A newcomer will ask how a COMMIT can arrive over a connection that has already failed. The prose after the figure helps ("with its COMMIT on the way"), but the figure, where the reader learns this, doesn't. The option label "Record R8 first; attempt lost" doesn't say what is lost. In that option it is the COMMIT that never arrives, whereas in the other options it is the reply.
Effect: The figure's central lesson, that a missing R8 doesn't prove the first attempt failed, depends on the reader believing the first attempt is still in flight. The step text makes that look contradictory, and the last option's label doesn't say how it differs from the one before.
Suggestion: Say the COMMIT was sent before the service saw the failure and is still on its way to, or being processed by, the database. Label the option for what changes, for example "Record R8 first; COMMIT never arrives".

### editorial-31 · optional · a03, "Where the results come from", second paragraph

Problem: "A separate check held a COMMIT that had reached the server, by naming a synchronous standby, a replica that must confirm each commit, that never connects." Two clauses beginning "a replica…" and "that never connects" stack after "by naming", and the last attaches to the wrong noun on a first reading.
Effect: The one sentence that explains how the in-flight case was produced has to be read twice.
Suggestion: Split it, for example: "A separate check made a COMMIT wait on the server. It named a synchronous standby, a replica that must confirm each commit, and never started one, so the commit could not finish."

### editorial-32 · optional · a00 and a03, heading anchors

Problem: Every heading's anchor is a planning claim rather than the heading. In a00, "Transactions and competing buyers" is `#a-transaction-protects-a-change-within-a-stated-contract` and "From a request to a committed order" is `#the-application-is-part-of-the-database-system`. In a03, "Transactions, autocommit and ACID" is `#put-the-complete-change-inside-a-boundary` and "Durability" is `#commit-has-a-durability-boundary-and-a-system-boundary`. Readers see these in the address bar and in any link they share.
Effect: Planning language leaks into reader-facing URLs, and a shared link names a different idea from the heading it opens.
Suggestion: Derive each anchor from its heading. If other articles already link to the current anchors, keep those as aliases.

## Limits

- I read both pages from the HTML the dev server sent, and the step text from the figure model files. A headless screenshot came back blank in dev mode, so I didn't check rendered layout, figure legibility or how controls behave when played. That belongs to the visual review.
- Technical accuracy is outside this perspective. editorial-20 (what redeploying undoes) and editorial-28 (whether locking the counted instructor rows suffices) touch correctness and are raised only as wording and argument problems. The relabelled plan output in a00 ("estimated rows=10", which PostgreSQL itself doesn't print in that form) is noted in editorial-17 only as a disclosure problem.
- a00 links "Making concurrent changes correct" to `/review/relational-next/transactions/`, not to this trial's a03. I take that to be how the trial route is arranged and didn't treat it as a finding.
- In corpus terms I checked only that names and the running example agree between these two articles. Mina, Tariq, Edda, the shop and the class bookings are consistent. Article names are not (editorial-23).
