# Editorial review · article · Making concurrent changes correct (relational trial, transactions) · working tree, 20 October 2026, rendered build

<!-- Fresh reviewer, arranged by the d04 coordinator under staycurrent-review. Given only the rendered page, the audience, the three reference articles and the perspective file; withheld docs/, git history, the article source and all earlier versions, reports and findings. Numbering continues from d03 (last editorial-28). Report recorded verbatim. -->

Inputs read: the rendered page at http://127.0.0.1:4391/review/relational-trial/transactions/, read three ways: as a headless Chromium DOM dump turned into text, including the contents list, captions, tables, listings, control labels and every "Read this figure as text" summary; as a 1280 px screenshot down to Figure 5; and through the figures' step text in src/components/relational-trial/a03/model.mjs. Also the stated audience, and the Sequence diagrams, Indexes and Storage and durability reference articles in full (source). Withheld, as instructed: everything under docs/, all git history, and the article's .astro source. I also left unread the unrelated files already in the scratchpad (earlier screenshots and verify output).
Verdict: repairs required

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | finding | Isolation is split between an H3 in section 2 and the H2 in section 4, so the contents list sends readers to the wrong place (editorial-41). |
| Plain sentences | finding | Several compressed or stacked sentences ("Lock order removes the deadlocks you designed for", "such as product order"). The prose-only harder-case run is the worst (editorial-31, editorial-40). |
| Terms | finding | "Lock", "condition" and "protection" are leaned on before they are explained. "Rule" and "invariant" both name the same thing. "Session" is never explained (editorial-29, editorial-39). |
| Openings | finding | "Protect the decision, not just the write" opens on a staffing scenario that the prose never set out (editorial-30). The other sections open well. |
| Reader-facing text only | finding | The heading anchors carry plan wording that the visible headings dropped (editorial-42). The review banner is shared route chrome (see Limits). |
| Captions and labels | finding | Listings have no labels. The move listing's comments read as observed output. Some figure notes repeat the prose or give away the answer (editorial-34, editorial-43). |
| One piece | finding | At least eight passages read as later patches, objection-answers or asides. One sentence contradicts the article's own schema (editorial-29 to 31, 33, 35 to 38, 44). |

## Findings

### editorial-29 · required · Start with the rule that must stay true, paragraph after Figure 1 ("Why store remaining when the bookings could be counted?")

Problem: This paragraph answers a design objection before the reader has seen any rule, protection, condition or lock. "The counter gives every booking one row to put its condition and its lock on, which makes the simplest protection in this article possible" uses three ideas the article has not yet introduced: a lock is explained two subsections later, and a condition and a protection in section 3. It sits between the figure and the definition of invariants, so it interrupts the step from "here are the rows" to "here are the rules". Its main job seems to be setting up the "harder case mentioned earlier" that comes much later (editorial-31).
Effect: A newcomer gets a justification for a choice they had no reason to question, in terms they cannot yet read, and must remember it for several sections.
Suggestion: Move the trade-off to where it pays off. That could be "Put the condition in the change", where the single row visibly carries the condition and the lock, or the harder-case run. In the opening, keep at most a clause saying that remaining is stored on purpose.

### editorial-30 · required · Figure 2 lead-in and the opening of "Protect the decision, not just the write"

Problem: The prose never describes the staffing scenario, in which each instructor counts the available instructors and then marks themself unavailable. The lead-in to Figure 2 says only "Start with One after the other, then switch to Both read before either writes". It never mentions the Example control or "Both instructors take leave". The next subsection then opens with "The staffing example is harder to see. Lena's transaction changes Lena's row and Ravi's changes Ravi's…", as if the reader had played it. Figure 2 is the first place leave-taking appears. Before that, the reader knows only that "class 21 keeps at least one available instructor".
Effect: A reader who follows the instruction plays only the last-place example. They then meet write skew, the article's hardest idea, described from a run they never saw, so they must go back and find the second example themselves.
Suggestion: Introduce both examples in the lead-in, with one sentence on what Lena's and Ravi's transactions do, and tell the reader to switch Example as well as Schedule. Or open the write-skew subsection by restating the staffing transactions in a sentence.

### editorial-31 · required · Protect the decision, not just the write, fourth paragraph ("We ran the harder case mentioned earlier…")

Problem: One paragraph tells an unseen two-session run entirely in prose, and stacks five things the reader must hold at once:
- a temporary change to the shared rows ("class 22's capacity was lowered to 2 for this run");
- a third customer, Edda, who appears nowhere else;
- "counted… with FOR UPDATE";
- a lock wait on Tariq's R7;
- a re-look that skips an uncommitted insert.

It points back to editorial-29's aside ("mentioned earlier"). It also sits between the locking-read definition and the isolation subsection, so it interrupts that line of argument. It reads as added after the section was written.
Effect: This is the article's only demonstration of a row that starts matching, the case the later protections are judged against. Most newcomers will not be able to rebuild the schedule from the prose, so they take the conclusion on trust.
Suggestion: Show the run as steps, either as a short listing or a figure option on the existing rows. Or cut it to the one point it makes: "a locking read cannot lock a booking that does not exist yet, so a second count misses it". Leave the full run to "Designing changes that coordinate with locks", which the article already says takes this case up.

### editorial-32 · optional · Isolation levels: a fixed snapshot is not enough, last paragraph; and Stronger isolation can refuse instead of waiting, second paragraph

Problem: "Two limits are worth stating now" gives two limits, then a third point that is not a limit ("What changes the application's reasoning is the 40001 error…"). The opening "worth stating now" signals an early pass at material that comes back later. "This has two consequences" in the later subsection does the same: it gives two, then adds false positives. The later passage repeats the earlier one: any statement including COMMIT can fail, only a successful COMMIT counts, and the transaction must be retried from the start. The point recurs in the Serializable bullet and in the retry subsection too.
Effect: The reader meets the same warning three or four times and cannot tell which passage is the main treatment. The miscounted lists make them recount.
Suggestion: Make one place the main explanation of the 40001 retry, probably "Stronger isolation can refuse instead of waiting", and keep only a forward pointer in section 2. Match each count to its list or drop the count.

### editorial-33 · optional · Coordinate decisions that span several rows, the paragraph "Code you own can be changed to take the lock…" and the Serializable row of the choice table

Problem: This paragraph answers an objection the reader never raised: a vendor program you cannot change. It also points to itself in the table ("The table's last row describes this"). The table cell it points to is a patch too: "Run at Serializable, and be retried or rerun after error 40001. For a program you cannot edit, set default_transaction_isolation for its database role, and check that the program does not choose a level of its own." The rule-shape cell adds a further condition ("when every writer can be run at Serializable"). Elsewhere the table gives two- to five-word cells.
Effect: The summary table stops being scannable at the row where it matters most. The paragraph also leaves unsaid what it implies: if one staffing writer runs at Serializable, the coordination-row choice no longer covers the staffing rule.
Suggestion: Keep the table to short cells. If the cannot-edit case stays, give it one sentence in prose that states the consequence plainly: every staffing writer then runs at Serializable, or the program must not touch these rows.

### editorial-34 · required · Deadlocks, retries and lost replies, Mina's move listing

Problem: The listing's comments ("-- UPDATE 0: R8 has already moved. -- ROLLBACK." and "-- UPDATE 0: class 22 is full. -- ROLLBACK.") describe what the application should do if a guard changes no row. Yet they are followed by further statements and COMMIT. The article's first listing uses the same comment form for observed output ("-- 1: a place was taken", "-- ERROR: …"). So a reader takes these comments as what happened, and the listing then contradicts itself.
Effect: The reader cannot tell whether this move rolled back or committed, and that is the listing's whole point.
Suggestion: Mark the comments as conditions ("-- If this changes no row, R8 has already moved: roll back"), or show the guards' expected results as in the first listing. Give the listing a label, as the reference articles do.

### editorial-35 · optional · Deadlocks, retries and lost replies, paragraph "The first update is a guard as well as a change…"

Problem: A duplicate-request failure is inserted into the deadlock argument, between "turned the cycle into a queue" and "Lock order removes the deadlocks…". It relies on another unseen run with altered rows ("We ran that case with class 21 at capacity 3"). It mentions "a repeat after a lost reply" two subsections before lost replies are covered. "Released and took places twice" is compressed.
Effect: The reader's attention leaves lock order for idempotency, and comes back with a second invented fixture to keep apart from the real one.
Suggestion: Explain the guard in one sentence beside the listing ("it moves R8 only if R8 is still in class 21, so a repeated move changes nothing"). Move the twice-sent case to the lost-reply subsection, where repeats are the subject.

### editorial-36 · optional · Retrying one statement keeps a stale decision, last paragraph (the 23505 exception)

Problem: After "a constraint error… is usually an answer", the paragraph adds an exception the running example never meets: a key chosen by reading the table under Serializable. It then adds a sentence to tie the exception back to the example ("Tariq's request repeated a booking he already held, so his error is a real duplicate"). The exception carries over into the lost-reply table ("except in the Serializable case above").
Effect: A simple, usable rule (retry 40001 and 40P01; report constraint errors and empty results) arrives wrapped in a caveat that the reader's own system may never hit, and they carry it into the next table.
Suggestion: State the rule plainly and put the exception in one short sentence or in the linked retries article. Take the cross-reference out of the table.

### editorial-37 · required · A lost reply does not prove rollback, paragraph after the table ("With a free place, it could have booked her twice.")

Problem: The article's own schema forbids this outcome. Figure 1 and the constraints table establish UNIQUE (class_id, owner_id), and Figure 3 shows that constraint refusing Mina's second booking. A repeat with request R8 would also hit the primary key.
Effect: A careful reader who has followed the constraint argument meets a contradiction. They then have to wonder whether the constraint really protects them, or whether the lost-reply advice is wrong.
Suggestion: Make the risk one this schema actually has. One option is a repeat that gets 23505 and wrongly reports "you already booked" as a failure. Another is to name a booking without the unique constraint.

### editorial-38 · optional · Asides that interrupt their paragraphs

Problem: Several sentences break off the paragraph they sit in:
- "Keep transactions short as well: an open transaction holds its locks, and it stops PostgreSQL clearing away data that later changes have replaced…" is tacked onto the savepoint advice, and "data that later changes have replaced" means old row versions, which have not been introduced.
- "The same idea works with a version number: read a row with its version, then update it only WHERE version = the value read…" brings in a different technique in a code-and-prose hybrid at the end of the business-rejection paragraph.
- The two-sentence lock definition in "Put the whole change inside one transaction" stands alone between the commit explanation and the failed listing.
- "Keeping transactions short reduces how often anyone waits" repeats the first aside in the deadlock section.
- The parenthesis in step 4 of the checking procedure ("the worked insert race is in Designing changes…") ignores that this article ran an insert race itself.

Effect: Each one costs a little attention. Together they make the article read as assembled rather than written.
Suggestion: Give "keep transactions short" one home, with its reason. Either develop the version-number technique or drop it. Move the lock definition to just before its first use, which is the savepoint paragraph. Take the parenthesis out of the checklist.

### editorial-39 · optional · Terms across the article

Problem:
- "Invariants" is defined once ("What we actually need is a set of invariants"). The article then uses "rule" throughout, until "Write the invariant…" comes back in the closing checklist.
- The rules are stated twice in a row: in Figure 1's note "Rules the examples protect", then as the bulleted list.
- "Session" is used throughout ("other sessions", "one step by one session") and never explained.
- The intro uses "schedule" and "isolation level" before section 2 explains them.
- "Serialisation failure" and "serialisation error" both appear.
- "Aborted", "rolled back" and "refused" overlap. "PostgreSQL has rolled the transaction back" after 40001 sits uneasily with Figure 5, where the aborted transaction "had to roll back".

Effect: A newcomer has to work out that two words mean one thing, or that a slightly different phrase means nothing new.
Suggestion: Pick "rule" and give "invariant" once as its technical name, or the reverse. State the three rules once. Add a short gloss on "session" at first use. Use one name for the 40001 outcome, and say once what the application must do after an abort.

### editorial-40 · optional · Compressed or stacked sentences

Problem:
- "Each part maps onto the shop."
- "The first race below is the mug race with the booking row made visible."
- In the constraints table, "Nothing: the check also counts bookings that another transaction has not yet committed": "check" collides with the CHECK constraint, and uniqueness does not "count".
- "Where a rule fits a key, uniqueness, reference or check, declare it."
- "Because the count is a new statement after the lock is granted, at Read Committed it sees the change the first transaction committed."
- The coordination-row bullet cites "a booking moved into it" for the staffing rule, which mixes in the capacity example.
- "Lock order removes the deadlocks you designed for."
- "Her next statement failed… and she had to roll back": the person stands in for her transaction.
- "The second part has to be stated."
- "such as product order", which reads as an order for a product.

Effect: Each one makes the reader stop and decode before they can move on.
Suggestion: Rewrite each as one plain idea. For example: "uniqueness is checked against uncommitted bookings too"; "a fixed lock order prevents deadlocks between transactions that follow it"; "lock the stock rows in order of product_id".

### editorial-41 · optional · Section structure for isolation (contents list)

Problem: Isolation levels are defined under "Two correct-looking transactions, one wrong result", whose heading names the problem rather than the fixes. The H2 "The isolation contract behind the choice" comes two sections later and assumes them. The contents list shows only H2s, so a reader looking for Read Committed, Repeatable Read and Serializable would go to section 4 and find them explained earlier.
Effect: The contents list sends readers to the wrong place, and isolation reads as covered twice.
Suggestion: Give the isolation subsection a heading or position that shows up in the contents, or gather the isolation material under one H2.

### editorial-42 · optional · Heading anchors

Problem: The visible headings are plain, but their anchors keep earlier, plan-like wording. Examples:
- #start-with-the-fact-that-must-remain-true
- #choose-protection-for-the-invariant-you-actually-have
- #an-aborted-transaction-must-be-reconsidered-as-a-whole, for "Deadlocks, retries and lost replies"
- #commit-has-a-durability-boundary-and-a-system-boundary, for "What a commit promises"
- #a-repeatable-view-does-not-by-itself-prove-the-rule

They appear in the address bar whenever a reader uses the contents list or shares a link.
Effect: Readers see wording from how the article was made, and the shared links do not match the headings.
Suggestion: Regenerate the anchors from the current headings. Check that the in-article link to "Put the condition in the change" still resolves.

### editorial-43 · optional · Captions, figure notes and labels

Problem:
- No listing has a label. The failed attempt, the conditional booking, the move and the rule check are all bare. The reference articles label every listing.
- Figure 2's note says "Run one at a time, both examples keep their rule. Interleaved, both break it, and no statement reports an error", which answers the question the prose asked the reader to predict.
- Figures 2 and 3 repeat the rule line under the table ("Last place in class 21. Rule: remaining + bookings = capacity 1…"), and "= capacity 1" reads awkwardly.
- Figure 4's note repeats the prose word for word ("PostgreSQL keeps more than one version of a changed row") instead of saying what is drawn.
- The lost-reply table caption gives a test-rig detail without explanation ("the server held COMMIT open for 1.5 seconds"), which a reader may take for PostgreSQL behaviour.
- In the same table, "Empty result, then COMMIT" disagrees with Figure 3, where the empty result ends in ROLLBACK.
- The durability table's column "Service moves to another copy" contains "Restoring a backup…" in its first row.

Effect: The reader loses small amounts of trust and time at each one, and the prediction prompt in Figure 2 is spent.
Suggestion: Label each listing with what it shows. Move Figure 2's outcome sentence into the summary, or below the prose that follows the figure. Make Figure 4's note describe the drawing. Explain the 1.5-second hold as a test arrangement. Make the empty-result row match Figure 3. Fix the column-and-cell mismatch.

### editorial-44 · optional · Provenance repeated

Problem: The claim that every schedule was run on PostgreSQL 18.6 and shows its real replies appears in the intro's second paragraph. It is repeated almost word for word in section 2 ("we ran each one step by step on PostgreSQL 18.6, and the replies shown are the ones it gave"), in each figure kicker, in table captions and in Sources. Section 2's restatement interrupts the lead-in to Figure 2.
Effect: The repetition reads as reassurance added in passes, and it pushes the instruction for Figure 2 further from the figure.
Suggestion: State the method once in the intro and once in Sources, and keep the short kickers. Cut the restatement before Figure 2.

## Limits

- I played no figure beyond its first frame. The step text came from model.mjs and the built "Read this figure as text" summaries, so step-by-step on-screen wording, timing and control behaviour were not checked; that belongs to the visual review.
- The screenshot stops at Figure 5. Everything after it was read as rendered text, not as layout.
- I did not check technical claims against sources. The contradiction in editorial-37 is with the article's own schema, not an external check.
- I followed no links, so I did not check whether linked article titles match their targets.
- I did not check mobile width or dark theme.
- I treated the banner ("Relational databases · New draft review", "Draft available · 38 of 38 drafts available") and the "Continue into the detail" block as shared review-route chrome belonging to the coordinator, not the writer. If the banner is meant to stay for readers, it is review-process language.

## Coordinator notes (d04)

Checked against the source, not decided or repaired:

- editorial-34 is real: the comments at `model.mjs` lines 404–409 read like observed replies, yet COMMIT follows.
- editorial-37 is real: `UNIQUE (class_id, owner_id)` and the R8 primary key both prevent a second booking for Mina, so "could have booked her twice" is false for this schema. The sentence predates d04.
- editorial-43's "no listing has a label" is real: the `Sql` component puts `label` only in `aria-label` (`src/components/explainers/querying/Sql.astro:6`), so sighted readers never see it. Shared component, not a writer fix.
- editorial-42's anchors are a03's own ids (`sections` at the top of the file); renaming them means updating the in-page link to `#express-a-change-and-its-condition-together`.
