# Editorial review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" · 6ca25b8

Inputs read: both pages as rendered by `pnpm astro dev --port 4563` at 6ca25b8 (`/review/relational-trial-2/` and `/review/relational-trial-2/transactions/`), taken from headless Chromium after scripts ran, including every caption, figure note, control label, step text and "Read this figure as text" panel; the step strings in `src/components/relational-trial-2/a03/model.mjs`, and a search of `src/components/relational-trial-2/a00/` for Figure 6's scenario text and note; the intended audience (an intelligent engineer new to relational databases who wants to become an expert practitioner); the Sequence diagrams, Indexes and Storage and durability reference articles in `src/reference-articles/`, in full. Withheld and not opened: plans, writers' work records, the article `.astro` sources, everything else under `docs/article-work/` (including earlier reports), git history, `src/articles/relational-next/`, `src/articles/relational-trial/` and `src/components/relational-trial/`. The review banner and the cross-links to `/review/relational-next/` were treated as trial set-up, and the heading anchors as fixed.

Verdict: repairs required (a00: repairs required; a03: repairs required)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | a00 pass; a03 finding | a00's headings are plain and descriptive. a03 nests three subsections under parents they do not belong to (editorial-39). |
| Plain sentences | a00 finding; a03 finding | Most sentences in both are plain. a00's "contract" paragraph does not say what "it" is (editorial-36). a03 has a handful of compressed phrases (editorial-44). |
| Terms | a00 finding; a03 finding | a00 defines "inner join" only inside Figure 3's steps (editorial-37). In a03, Figure 1 contradicts the autocommit definition and the commands are defined after use (editorial-40). Error handling and `RETURNING` are described differently within a03 and between the two pieces (editorial-42). |
| Openings | a00 pass; a03 finding | Every a00 section opens with a statement. a03's "Retrying a transaction" opens with an instruction to replay a figure from several sections back (editorial-43). |
| Reader-facing text only | a00 pass; a03 finding | Provenance sections read as provenance. a03 refers to "the visibility cards", a name the page never uses (editorial-45). |
| Captions and labels | a00 finding; a03 pass | Control labels in both say what they change. a00 Figure 6's fixed note states a deletion under all three failures, including the two where none happened (editorial-34). |
| One piece | a00 finding; a03 finding | a00's lost-reply passage teaches a method and then hedges it, against a03's teaching (editorial-33). The CockroachDB aside splits a paragraph (editorial-38). a03 has a sentence left over from another order of the listing (editorial-35) and a run of asides in its transactions subsection (editorial-41). |

## Findings

### editorial-33 · required · a00, "From a request to a committed order": Figure 5's "Breaks before COMMIT" and the paragraph after it

Problem: The figure and the paragraph present "look up order 103, then repeat if it is missing" as the way to settle a lost reply. Figure 5's steps hedge it: "has not committed, at least so far" and "The first attempt really was rolled back". The paragraph then undercuts the method: "That is not quite proof that the first attempt failed, because on a slow network it may still be on its way", and hands the fix to a03. In a03, Figure 5's "Look up R8 first" option shows the same lookup as a trap that ends with "The lookup didn't help". a00's own listing already inserts order 103 first, which is the protection a03 teaches, but a00 credits the safety to the lookup. The hedge reads as a patch added to answer a later objection.
Effect: A reader who stops at a00 carries away "look it up, then repeat", which a03 shows to be unsafe. A reader who goes on meets a contradiction between the introduction and the article it points to, and cannot tell from a00 what the shop should actually do.
Suggestion: Make a00 say plainly why its repeat is safe. The repeat inserts the same order number, so it either meets the first attempt (it waits, then gets "already exists" and confirms) or finds that number free (it goes ahead). Keep the lookup only as a way to answer Mina, or drop it, so that the figure, the paragraph and a03 agree. The hedging phrases can then go.

### editorial-34 · required · a00, Figure 6 "Which recovery fits which failure?": the note under the cards

Problem: The note under the cards is the same for all three choices: "The mistaken deletion of order 101 commits at 10:10." With "Server process crashes" or "Database machine is lost" selected, the cards report order 101 as present after crash recovery or promotion. The note tells the reader that a deletion committed, but the cards show it gone.
Effect: The figure exists to separate failures that lose committed work from a committed mistake. With the note as it is, a reader on the crash view can conclude that crash recovery brings back a committed deletion, which is the misunderstanding the figure is meant to remove.
Suggestion: Keep only what holds for every choice in the fixed note (who orders 101 and 103 belong to, and what a replica is). Let each failure's own description carry its timeline, as the "Order 101 deleted by mistake" description already does.

### editorial-35 · required · a03, "The complete booking and version checks": the paragraph after the booking listing

Problem: "A class that doesn't exist also returns no row, so check separately if that difference matters." In the listing just above, the insert into `reservations` runs first, and `reservations.class_id` references `classes`. A booking for a class that doesn't exist is therefore refused at the insert with a foreign-key error, and the update never runs. The sentence fits a booking that updates first, which is the order Figure 5's first two options use, and reads as a leftover from it.
Effect: The paragraph is the reader's guide to what each outcome means. This sentence describes an outcome the listing cannot produce, tells the reader to write a check they don't need, and leaves out the outcome they will actually see.
Suggestion: Say what this listing does with an unknown class (the insert is refused by the foreign key), or drop the sentence.

### editorial-36 · optional · a00, "Transactions and competing buyers": the "contract" paragraph

Problem: "Whatever the protection, think of it as a contract with three parts." The reader has just met a conditional update and isolation levels as protections, and none of them is a contract with parts. The three parts are isolation, constraints and durability. Durability and the write-ahead log then appear for the first time in the middle of a section about two buyers, with no lead-in.
Effect: The reader has to work out that "it" means the database's guarantees, not the protection they just chose, and meets a new idea, durability, as an aside.
Suggestion: Name the subject directly, for example "What the database guarantees has three parts". Give durability one sentence that says why it belongs here: the remedy at the start of the section promised that a crash cannot leave a half-made order.

### editorial-37 · optional · a00, "Asking questions with SQL": the paragraph after Figure 3

Problem: The paragraph says "the inner join drops it entirely", but "inner join" is explained only in step 2 of Figure 3's first option, not in the prose. The rest of the paragraph retells most of the figure's nine steps over seven sentences, including the `WITH`, `LEFT JOIN` and `coalesce` explanations already given in the steps.
Effect: A reader who reads the prose without stepping through the figure meets an undefined term. A reader who stepped through reads the same explanations again.
Suggestion: Define the inner join in the prose at its first use. Keep the paragraph to what the figure showed and why it matters, as the reference articles do after a figure ("The first query for page 12 paid for a read…").

### editorial-38 · optional · a00, "Choosing a database, and what to read next": the third paragraph

Problem: The paragraph asks disqualifying questions, breaks off for five sentences on when CockroachDB is worth its costs, and then says "Each answer rules out candidates quickly." By then "each answer" is a long way from the questions it refers to.
Effect: The reader loses the thread, which is "ask these questions first, then run the shop's experiments on what remains".
Suggestion: Finish the questions and their effect first. Then give the distributed option its own short paragraph, or move it next to the routing table that already points to the CockroachDB article.

### editorial-39 · optional · a03, heading structure (visible in the nested contents list)

Problem: "Transactions, autocommit and ACID" and "Constraints" are subsections of "Invariants". "A lost reply to COMMIT" sits under "Aborts and deadlocks". "Emails and other external effects" sits under "Durability". None of these is a part of its parent: transactions are the mechanism, not part of the rules; a lost reply is not an abort; an email is about the edge of a transaction, not about what survives a crash.
Effect: The contents list is the reader's map of a 33-minute article. A misleading hierarchy makes topics harder to find and tells the reader to file them under the wrong idea.
Suggestion: Promote these to their own sections, or regroup them so that each parent heading covers its children (for example, a lost reply and external effects together under the transaction's edges). The anchors can stay as they are.

### editorial-40 · optional · a03, "Transactions, autocommit and ACID": terms used before or against their definitions

Problem: The prose defines autocommit as "PostgreSQL runs each statement as a transaction of its own". Figure 1's first option then says "With no transaction, this statement commits as soon as it finishes". "The three commands are short. BEGIN starts a transaction…" defines `BEGIN`, `COMMIT` and `ROLLBACK` only after the section has used all three, including the claim that a `COMMIT` is "reported back as ROLLBACK". "The three commands are short" also doesn't tell the reader anything.
Effect: A newcomer, whom the opening invites to start here, meets two descriptions of autocommit that contradict each other and has to guess at the commands until the definition arrives.
Suggestion: Use the prose's wording in the figure step ("as its own transaction"). Define the three commands where the section first uses `BEGIN`, and replace the opening "short" sentence.

### editorial-41 · optional · a03, "Transactions, autocommit and ACID": the savepoint, sequence and implicit-commit paragraphs

Problem: After the ACID list come three paragraphs the reader has no reason yet to expect: savepoints ("Savepoints also make it easy to undo too little", with no earlier benefit for "also" to follow), sequence gaps, and MySQL's implicit commits. The paragraph that does follow from Figure 1, how much an error undoes in InnoDB, comes after them.
Effect: The argument runs from Figure 1 to "send ROLLBACK after an unplanned error", and these asides break it up. The paragraph that completes it reads as an afterthought.
Suggestion: Put the InnoDB error paragraph straight after the 25P02 paragraph, where it belongs. Gather the savepoint and sequence facts into one short "what a rollback does not undo" passage, or move them to the articles that develop them.

### editorial-42 · optional · a03, Figure 2 "Subtract one, no condition", last step, and "Conditional updates"

Problem: The figure step ends "his application received an error, not an answer". Earlier, in "Constraints", the article says "A constraint error is an answer about the data, not a passing fault". a00 says the same: "A database error such as a check violation is an answer". The outcomes table lists 23514 among the errors to report as an answer. Separately, "RETURNING is what lets the application tell the two answers apart" sits beside a version-check listing in the same article that tells the outcomes apart by `UPDATE 1` and `UPDATE 0`, and beside a00's driver code, which checks `rowCount`.
Effect: The reader is building a rule for how to handle each kind of error, and the two pieces give conflicting rules for 23514. They may also come away thinking `RETURNING` is required to detect a full class.
Suggestion: Align the figure step with the prose ("an error rather than a clear answer", or say what the error does tell him). Present `RETURNING` as one way to read the outcome, alongside the row count.

### editorial-43 · optional · a03, "Retrying a transaction": the opening

Problem: The section opens with the bare instruction "Switch Figure 3 to Serializable, repeat only the write." Figure 3 is several sections and two large tables back, before "Choosing a protection", "Isolation levels" and Figure 4. The section's point, that a retry has to rerun the reads and the decision, only arrives in the third sentence.
Effect: The reader has to scroll back a long way before they learn why, and the section starts with an order instead of a claim.
Suggestion: Open with the point: retrying only the statement that failed keeps a decision made from out-of-date data. Then point to the option in Figure 3, or describe its outcome in a sentence so that replaying it is optional.

### editorial-44 · optional · a03, compressed phrases (several places)

Problem: Several phrases have to be decoded:
- "the application has to find out what happened through the operation's own identity" (opening summary, before request_id has been introduced);
- "That refusal is PostgreSQL's contract, not a property of the name" (Repeatable Read and write skew);
- "PostgreSQL's Repeatable Read is snapshot isolation, and write skew is the outcome snapshot isolation allows", which introduces a named term in the section's last sentence without saying what it is;
- "so the receiver should recognise R8" (emails table: the receiver could be Mina or the mail service);
- "by naming a synchronous standby, a replica that must confirm each commit, that never connects" (Where the results come from).
Effect: Each costs a re-read, and the first two arrive at points where the reader is still forming the basic idea.
Suggestion: Say each in ordinary words. For example, "by looking up the request's own ID"; "Other engines use the same name for a different rule"; "PostgreSQL calls this kind of fixed view snapshot isolation"; "so the mail service should ignore a second message for R8"; "by making the commit wait for a standby replica that never connects".

### editorial-45 · optional · a03, "Where the results come from"

Problem: "The script also checks … the visibility cards, the rollback prediction…" The page never calls anything the "visibility cards". The cards are introduced as what one statement from Tariq does while Mina's change is uncommitted. The load test also uses "customers 101 to 120", while 101 to 103 are the order numbers in the introduction this article builds on.
Effect: The reader can't tell which content the check covers, and numbers they know as orders reappear as customers.
Suggestion: Name the cards as the reader met them, and give the load-test customers numbers that don't clash with the shop's orders.

## Limits

- I did not play the figures in a visible browser. Step text came from the "Read this figure as text" panels and a03's model file, and the controls and first states from the rendered DOM. Layout, themes, phone width and animation are left to the visual review.
- I judged technical claims only where the wording made a problem visible to a reader (editorial-33, -34, -35, -42). For the practitioner review: a00's measurement table gives `orders` and `order_items` the same 1,268 pages, which may be right but is worth confirming. a00's plans relabel PostgreSQL's estimate as "estimated rows", which the article discloses but which won't match what a reader sees in real output.
- Consistency between pieces was checked only between these two articles, not across the rest of the draft collection.
