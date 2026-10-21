# Editorial review · article mode · a00 "Relational databases" and a03 "Making concurrent changes correct" · b5586b8

Inputs read: both pages as rendered by `pnpm astro dev --port 4523` at `/review/relational-trial-2/` and `/review/relational-trial-2/transactions/`, read in full from the DOM after scripts ran (headless Chromium), including every caption, control label, figure note, "Read this figure as text" panel, the a03 "Try a variation" answer and the engine cards; the step text and Figure 6 card text in `src/components/relational-trial-2/a00/model.mjs`, `scenes.mjs` and `RecoveryFigure.astro`, and the Figure 1 step text in `src/components/relational-trial-2/a03/model.mjs`; the intended audience (an intelligent engineer new to relational databases who wants to become an expert practitioner); the Sequence diagrams, Indexes and Storage and durability reference articles in `src/reference-articles/`, in full. Withheld and not opened: the plans, the writers' work records, the article `.astro` sources, the rest of `docs/article-work/`, `src/articles/relational-next/`, `src/articles/relational-trial/`, `src/components/relational-trial/` and every other review report.

Verdict: a00, repairs required. a03, repairs required.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | a00 finding (optional) · a03 finding (required) | a00's headings mostly work, but two lack the words a reader would look for. a03's 18 headings are claims or instructions, and the ordinary names (transactions, ACID, Serializable, deadlock) appear in none of them. |
| 2. Plain sentences | a00 pass, apart from editorial-1 · a03 finding (required) | a00 reads plainly section by section. a03 has sentence-shaped link text that produces garden-path sentences, and a set of compressed sentences the reader has to decode. |
| 3. Terms | a00 finding (optional) · a03 finding (optional) | Most terms are explained at first use in both. The slips are small: one plan named two ways, WITH never explained, request IDs reused, an invented anomaly name, two spellings of serialisable. |
| 4. Openings | a00 pass · a03 pass | Every section in both articles opens with a fact or a scenario and its reason, not a bare instruction. |
| 5. Reader-facing text only | a00 finding (required) · a03 finding (optional) | a00 ends every section with a contents list of the next article in that article's heading phrases. a03's final teaching section carries the worksheet's run record. |
| 6. Captions and labels | a00 finding (required) · a03 pass | a00's Figure 3 caption and the paragraph after it promise two queries, but the page shows only one, and some Figure 6 card text repeats itself. a03's captions and option labels say what they show and what they change. |
| 7. One piece | a00 finding (optional) · a03 finding (optional) | a00 repeats its provenance in captions and prose, and one paragraph claims a remedy it does not give. a03 has asides and a misplaced engine comparison that read as later patches. |

## Findings

### editorial-1 · required · a00, the closing paragraph of every section

Problem: Almost every section ends with a paragraph that lists the next article's contents in that article's own heading phrases, each phrase a link to one of its sections. Some examples: "It covers binding values, borrowing connections for bounded work, recovering according to what the application knows and making work beyond the transaction recoverable"; "It starts with the work people need to finish, covers giving a query a route to its rows and testing a plan hypothesis, and shows why a faster query can still make the workload slower"; "compares process and failure boundaries and tests candidates against the same application"; "recovering an incident without destroying the evidence". The link targets confirm the phrases are section slugs from the other drafts (for example `#give-the-query-a-useful-route-to-its-rows`). The paragraphs also repeat themselves. Section 2 points to Designing relational data three times, and its last sentence lists the same topics twice ("Deciding what each row means, what identifies it and which rules the schema should enforce is the subject of Designing relational data, which works through row meaning, identity, constraints and where each fact belongs"). Section 7 opens a paragraph with "Plan recovery before the first irreversible step" and closes it with "planning recovery before the first irreversible step". Section 9 ends with this paragraph straight after a reading-route table that already sends the reader to the same article.
Effect: A newcomer finishes each section on a run of undefined phrases, such as "plan hypothesis", "bounded work" and "process and failure boundaries", that read like the plan's article briefs. Each list is a table of contents in prose and gives the reader nothing to act on. The reference articles point onwards in one clause ("Indexing queries shows how to tell"; "The companion article … draws them").
Suggestion: End each section with at most one sentence that names the question the longer article answers, in the reader's own words, with one link to it. Leave the other article's contents to that article.

### editorial-2 · required · a00, Figure 3 and the paragraph after it

Problem: The lead-in says "Figure 3 shows two queries that both look reasonable, and both run without error." The caption says "Both queries and their results were run on PostgreSQL 18.6", and the paragraph after the figure ends "Both queries and their outputs were run on PostgreSQL 18.6:". Neither the figure nor the prose ever shows the first query's SQL. The figure's steps show joined rows and totals but no statement. The listing that follows the colon is only the second, correct query, and it comes with no output.
Effect: The point of the section is that a query can look reasonable and still answer the wrong question, but the reader never sees the query that looks reasonable, so they can't judge its plausibility or learn to spot its shape. The colon promises two queries and their outputs and delivers one query with none.
Suggestion: Show the join-then-sum query, in the figure for its option or in the prose, so the reader can compare the two statements. Then make the lead-in, the caption and the colon sentence describe what the page actually shows.

### editorial-3 · optional · a00, "One order changes several facts", the paragraph after Figure 1

Problem: After showing four contradictory intermediate states, the text says "Avoiding this is the database's first job, and it does three things towards it." The three things are storing the facts in one place, answering questions about them, and enforcing stated rules. None of them prevents what Figure 1 has just shown, which happened with the facts stored in one place. The real remedy, transactions, arrives three sections later ("Figure 1's problem has a direct remedy").
Effect: The reader is told the next three points avoid the problem, checks them against the figure, and finds they don't. Until section 4 the reader may believe that keeping the data in one place is the fix.
Suggestion: Present the database's three jobs as its general purpose, and say plainly that keeping Figure 1's in-between states invisible is the job of transactions, which a later section explains.

### editorial-4 · optional · a00, headings

Problem: "Ask for a result, then check what it means" is the section that introduces SQL queries and changes, but no heading names querying. "Correct SQL still has to do physical work" covers indexes and performance without naming either. "Choosing a database and a reading route": "reading route" is the plan's word for the reading-order table. The opening's task list then calls the section "choosing a database".
Effect: A reader scanning the contents for "querying", "indexes" or "performance" doesn't find them. The task box at the top makes up for some of this.
Suggestion: Name what each section covers in the words a reader would search for, and use the same name everywhere the section is mentioned.

### editorial-5 · optional · a00, terms in "Ask for a result…", "Transactions and competing buyers" and "Correct SQL still has to do physical work"

Problem: The second plan in the physical-work section is a `Bitmap Heap Scan`, but the table below it calls the same run "Index scan, 6 pages". The correct query opens with `WITH value AS (...)`, and the article never says what `WITH` does, although it explains `coalesce` and the left join. "SQL Server implements it with locks unless row versioning is turned on" uses "row versioning" without explaining it. The scaled copy is described as having "199,000 more orders … alongside Mina's two", but the original table held three orders, which is how the table reaches 199,003. Two references are informal: "which the applications article covers" (Figure 5 note) and "the choosing article says what to check".
Effect: These are small decoding costs. The plan and table mismatch matters most, because the reader has just been taught to read plan node names.
Suggestion: Use the plan's own name in the table, add a short gloss for `WITH` and for row versioning, and name linked articles by their titles.

### editorial-6 · optional · a00, repeated provenance and the "contract" paragraph in "Transactions and competing buyers"

Problem: "PostgreSQL 18.6" appears 14 times. Several prose sentences repeat their figure's caption almost word for word. The paragraph after Figure 5 ends with the caption's sentence about ending the session before and after COMMIT. The conditional-update paragraph ends "All three schedules were run as two concurrent sessions on PostgreSQL 18.6, and the outcomes were as Figure 4 shows", which restates Figure 4's caption. Separately, the paragraph that begins "Whatever the protection, think of it as a contract with three parts" runs through isolation, constraints and durability. It then adds the write-ahead log, "Each part has limits worth knowing", and every engine's default isolation level in one sentence.
Effect: The repeated evidence notes break the argument at the point where the reader is taking in a result. The contract paragraph stacks four topics, so its main point, that the guarantee has three parts, gets lost.
Suggestion: State provenance once, in the caption or the sources, and keep the prose on what the result means. Split the contract paragraph so that the engine defaults stand on their own.

### editorial-7 · optional · a00, Figure 6 card text and the Figure 4 legend

Problem: On the Figure 6 cards the verdict label is followed by a note that starts with the same verdict: "Works, at a cost" then "Works, but only keeps order 103…"; "The right tool" then "Fits. Order 103 survives…"; "The right tool" then "Fits, in a separate copy…". The text panel reads "Works, at a cost. Works, but only…". For "Database machine is lost", the Restore card's Order 103 value reads "only if the copy received it", the phrase used for the replica, while its note explains that the outcome depends on whether the log was archived. In Figure 4 the legend "Protection" labels an option, "Read, then write", that has no protection.
Effect: The repetition reads as two drafts of the same label. "only if the copy received it" points the reader towards replication when the card is about archiving.
Suggestion: Drop the repeated verdict word from each note. Give the Restore card its own condition, for example that the log was archived. Consider a legend such as "How the shop sells the mug".

### editorial-8 · required · a03, headings

Problem: All 18 headings are claims or instructions: "Put the complete change inside a boundary", "A repeatable view does not by itself prove the rule", "Choose protection for the invariant you actually have", "Understand the isolation contract behind the choice", "Stronger isolation can reject a result instead of waiting", "An aborted transaction must be reconsidered as a whole", "Commit has a durability boundary and a system boundary". The section that introduces BEGIN, COMMIT, autocommit, ACID and savepoints is called "…inside a boundary", and that section never uses the word "boundary". The Serializable section, the deadlock section and the Repeatable Read and write-skew section don't name what they cover. The contents list nests the transaction basics under "Start with the fact that must remain true".
Effect: A reader who comes back to find Serializable, deadlocks, savepoints, lost updates or write skew can't find them from the contents. A newcomer reading 18 sentence-length headings gets a summary of an argument rather than a map of the subject. The reference articles name their sections plainly ("Range scans", "Write-ahead log", "Group commit").
Suggestion: Give each section a short heading that names its subject in the reader's words, such as "Transactions and autocommit", "Lost updates", "Repeatable Read and write skew", "Serializable" and "Deadlocks and retries". Keep each section's claim in its first sentence.

### editorial-9 · required · a03, link text in "Let the database reject…", "An aborted transaction…", "Retrying one statement…", "Losing the reply…", "Commit has a durability boundary…" and "A database rollback cannot undo…"

Problem: The links to other drafts use those drafts' heading claims as their text, and use them as the subject of a sentence, which produces garden-path sentences. Examples: "A hot row can limit a mostly idle database shows how to recognise that."; "Deciding what waiting and skipping mean covers when each fits."; "Deciding what an acknowledgement promises covers that."; "Accounting for rules the schema cannot express covers the options in constraint design."; "Committing the business change and the intent together develops it, and Managing connections…"; "Acquiring several resources in a consistent order develops the move in full."; "…are covered in Resolving an outcome the caller did not receive and Making the operation identity part of the data contract."
Effect: The reader takes the first clause as a statement ("a hot row can limit a mostly idle database"), meets a second verb and has to reread to see that the clause is a title. Six or seven of these in one article add up to real decoding effort, and the target pages are hard to tell apart.
Suggestion: Write each pointer as an ordinary sentence about the question, with the link on a noun phrase. For example, the article on concurrent load shows how to recognise a hot row.

### editorial-10 · required · a03, compressed sentences in the opening, "Express a change and its condition together", the engine comparison and the final section

Problem: Several sentences pack in more than one idea or use phrasing the reader has to decode:
- In the opening: "A rule that spans several rows needs every writer to meet at one shared lock, or the database's strictest checking, which refuses one of two incompatible transactions so that it can be repeated." This "short answer" paragraph runs eight ideas together before the reader has any example.
- "A constraint error is a domain answer, not a passing fault."
- "A conditional update decides from the committed row; it does not wait for changes it has no reason to."
- "Other engines reach for different mechanisms at the same names, and the difference changes what code you write. SQLite appears in WAL mode, its write-ahead log setting, …" Here "appears in WAL mode" means that the cards assume WAL mode.
- "A protection is an argument: this rule, these writers, these reads, this mechanism, so the bad outcomes can't commit."
- "The worksheet raced 20 clients, customers 101 to 120 used only for this test, for class 21's one place, 20 rounds for each protocol."
Effect: Each needs a second reading. The opening one comes at the moment the reader decides whether the article is for them. The last one stacks three appositives between the verb and its object.
Suggestion: One idea per sentence, in ordinary words. For example: "If a rule depends on several rows, either make every writer lock the same row first, or run every writer at Serializable, which refuses one of two conflicting transactions so that it can be run again." Split the load-test sentence into who took part, what they raced for, and how often.

### editorial-11 · required · a03, the third opening paragraph

Problem: "The introduction raced two customers for the shop's last mug in A transaction protects a change within a stated contract." The introduction on this route has no section by that name. Its section is "Transactions and competing buyers", and the old wording survives only in that section's anchor (`#a-transaction-protects-a-change-within-a-stated-contract`). The link also goes to `/review/relational-next/`, not to the introduction on this trial route. The same applies to "Read in context: Relational databases" and the later back-links.
Effect: A reader who has just read the trial introduction finds no section with that title. The sentence also reads as a garden path, because the title is a full sentence (see editorial-9).
Suggestion: Name the introduction's section as it now appears, or say "the introduction's section on transactions". The coordinator should decide where the trial pages' back-links should go, and whether a00's anchor slugs should be brought into line with its headings.

### editorial-12 · optional · a03, asides in "Put the complete change inside a boundary" and "Coordinate decisions that span several rows"

Problem: Several passages read as later patches.
- The parenthesis "(PostgreSQL labels each error with a five-character code: 23505 is a unique-constraint violation.)" comes after 25P02 has already been used, and it explains 23505, which the prose has not yet mentioned.
- "Two other behaviours vary between engines" breaks into the booking argument with transactional `CREATE TABLE` and sequence gaps, neither of which bears on the class rules.
- "(Rolling back to a savepoint taken before the lock also releases it.)" interrupts the guard-row explanation.
- The paragraph beginning "A conditional update decides from the committed row" answers a case the reader was never shown: a place being freed while Tariq's update runs.
Effect: Each one pulls the reader off the argument to absorb a fact they have no use for yet.
Suggestion: Explain error codes before 25P02 is first used. Move the engine behaviours and the savepoint detail to the engine comparison, or to the article that develops them. Cut the freeing-a-place case, or set it up first.

### editorial-13 · optional · a03, the engine cards in "Stronger isolation can reject a result instead of waiting"

Problem: The cards follow a lead-in about "Other engines", but the first three cards are PostgreSQL's own three levels. They also sit under the Serializable heading, although they compare every level in three engines. The PostgreSQL cards repeat the isolation table and the waiting table from two sections earlier.
Effect: The reader expects a comparison of other engines and gets a summary of PostgreSQL first. The heading suggests that the cards are about Serializable.
Suggestion: Give the comparison its own short section with a heading that says it compares engines. Either open it with the PostgreSQL cards as the baseline and say so, or drop them in favour of the earlier tables.

### editorial-14 · optional · a03, the counting variation in "Coordinate decisions that span several rows"

Problem: "Take a stated variation of the example in which class 22 has two places…" changes the class's capacity from three to two. It then gives Mina the request ID R10 and Edda R11. Earlier in the article, R10 and R11 were Mina's two clicks in Figure 1. The article also stresses that a request ID identifies one operation.
Effect: The reader has to drop what they know about class 22 and about R11 in order to follow a dense paragraph with no figure, at the point where the argument is subtle (row locks don't stop new rows appearing).
Suggestion: Use new request IDs and a clearly separate class or setup for the variation, and drop the word "stated".

### editorial-15 · optional · a03, terms

Problem: The isolation table invents the name "Changed reread" and puts the standard term "non-repeatable read" in brackets. The concept is spelt "serialisable" in one sentence and "serializable" on the SQLite card, while the level is "Serializable". The a00 page writes "serializably". The outcomes table uses NOWAIT, `lock_timeout` and `statement_timeout`, and NOWAIT is explained only two sections later. "That is different from turning fsync off" uses fsync without saying what it is. "Lost update" first appears in the prose only after the reader has played the figure that shows one. That is fine, but it is the only one of the three anomalies introduced after its demonstration and not before.
Effect: These are small costs. The invented anomaly name is the one that matters, because the reader will meet "non-repeatable read" everywhere else.
Suggestion: Use the standard anomaly name. Pick one spelling for the general concept and keep "Serializable" for the level name. Gloss NOWAIT and fsync briefly where they first appear.

### editorial-16 · optional · a03, "the worksheet" throughout and "Check the argument with competing sessions and failures"

Problem: "The worksheet" is a Node script (`verify.mjs`) and appears 16 times, often as a report of what it did ("In the worksheet, Edda waited on R7's lock"). The last teaching section moves from how to test your own protocol into the article's own run record. It gives the list of everything the script checks, a port number from the author's setup (`--port 57612`), the platform, and "All 235 checks passed".
Effect: Calling a script a "worksheet" sets the wrong expectation. The run record breaks into the practical method the section is teaching. The reference articles keep this material in a separate "Where the numbers come from" section.
Suggestion: Call it a verification script, and move the run record and the download instructions to a section of their own before the sources. Keep the final section on the method a reader applies to their own system.

## Limits

- The animations were not watched frame by frame. Step text came from the rendered "Read this figure as text" panels and the model files, and the initial state of each figure came from the rendered DOM. Layout, contrast, mobile width and dark mode belong to the visual perspective and were not judged.
- Technical correctness was not checked. Where a finding touches a fact (editorial-5's plan name, editorial-7's Restore condition), it is raised for the wording only.
- The shared review layout on both pages ("Relational databases · New draft review", "Draft available · 38 of 38 drafts available", the "Draft available" tags in the reading lists) is site or route text that belongs to no writer. It was not judged as article text. The coordinator may want to check whether "38 of 38 drafts available" is right for this trial route.
- The linked pages under `/review/relational-next/` were not opened, so editorial-11 does not confirm what the older introduction calls its section.
- Corpus checks (consistency of the running example between the two articles) are outside article mode. One cross-article term note, the spelling of serialisable, is recorded in editorial-15 because it also varies within a03.
