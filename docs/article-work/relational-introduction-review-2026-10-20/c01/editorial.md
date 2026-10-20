# Editorial review · article · a00 Relational databases · c01

Inputs read: the rendered c01 page (`c01-site/review/relational-next/index.html`), including every figure's step text, card text and result captions from its bundled scripts (`RowsFigure`, `OrderFigure`, `DecisionFigure` and `models`); the intended audience as stated in the assignment; the Sequence diagrams, Indexes and Storage and durability reference articles, read in full from `src/reference-articles/`. Withheld and not read: a00's plan, context files, coverage maps, earlier approvals and reviews, the writer's notes, the a00 `.astro` source (including `c01/article.astro` and `c01/components/` in this folder), and everything else under `docs/article-work/`.
Verdict: repairs required

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | finding | Most headings name their subject plainly. "Keeping the service and its data" is vague, and every heading's anchor still carries an older title (editorial-11). |
| Plain sentences | finding | The early sections read plainly. Compression builds from Transactions onwards, especially around durability, Read Committed and retries (editorial-4, 5, 8, 9). |
| Terms | finding | "Writer" carries three meanings and is never defined for the database server (editorial-2). "Reservation", "line", "backup" and others drift or arrive undefined (editorial-6). |
| Openings | finding | Most sections open with a scenario or a definition. Transactions opens with a bare instruction, and the application section opens without its reason (editorial-10). |
| Reader-facing text only | finding | The introduction and the closing advice describe the collection in planning terms: "working case", "deeper links", "main article", "parent articles" (editorial-1). |
| Captions and labels | finding | Figure titles and control labels mostly say what changes. The Figure 5 caption contradicts the prose (editorial-3), and some card and stage labels use the figure's own private words (editorial-12). |

## Findings

### editorial-1 · required · introduction, paragraph 3; closing paragraph of "Choosing a database and a reading route"; section link sentences; "Read the collection" box

Problem: The article describes how the collection was planned instead of telling the reader what to read next. Paragraph 3 ends: "Each main article completes a working case before its deeper links take up particular questions." The closing paragraph says: "Finish each main article’s working case before selecting its deeper investigations. An article entered for a particular task names any earlier section it depends on." The same register appears in the link sentences: "Its deeper articles develop values, constraints, normalisation and history." and "connects those requirements to access, monitoring, maintenance and incident decisions before its detailed procedures." The box under the sources says: "Start with this introduction and read the parent articles before choosing their contextual detail."
Effect: "Working case", "main article", "deeper links", "deeper investigations", "an article entered for a particular task", "parent articles" and "contextual detail" are the planners' words. A newcomer cannot tell which articles count as "main", what a "working case" is, or what they are being asked to do. These sentences come at the two points where the reader decides how to continue: the end of the introduction and the end of the article.
Repair: Say the same thing in reader terms. For example, in the introduction: "Each section below ends with a link to a longer article on its subject. Each of those articles works through one complete example of the shop first, then links to shorter articles on single questions." For the closing: "Read a longer article's worked example before its shorter follow-ups. If you start partway through the collection for a particular task, each article says which earlier sections it relies on." Replace "Its deeper articles develop…" with "Shorter follow-up articles cover…", and drop "before its detailed procedures". If the "Read the collection" box ships, write "Start with this introduction, then read each longer article before its follow-ups."

### editorial-2 · required · "Keeping the service and its data" and Figure 6; also "Changing a live database" and "Transactions and competing buyers"

Problem: "Writer" means three different things, and the meaning Figure 6 depends on is never defined. In Transactions, "a competing updater waits for this row’s writer" means the transaction that changed the row first. In Changing a live database, "A required delivery instruction meets an old writer" and "retire old writers" mean an older version of the application. In the operations section, "It may help replace a failed writer", the Figure 6 option "Writer and its storage are lost" and the step text "A suitable surviving replica may supply the new writer" mean the database server that accepts changes. Nothing tells the reader so. The same passage uses "promoting the replica", "Safe promotion" and "No failover or restore is executed" without explaining either term.
Effect: The reader arrives at Figure 6 straight after a section where "old writer" meant an application release. "Writer and its storage are lost" can then be read as the application server failing. The distinction the figure teaches, between a current copy and an earlier copy, rests on the reader knowing which machine has gone. Promotion and failover are the actions the figure asks the reader to judge.
Repair: Define the server at first use in the operations section. For example: "The shop runs one main database server, the primary, which accepts every change. A replica is another server that receives a copy of each change. If the primary fails, the replica can be promoted to take its place; that switch is called failover." Then use "primary" in the Figure 6 option, card and step text ("Primary and its storage are lost"; "may become the new primary"). In Changing a live database, use "the old application version" or "old application instances", which the section's first paragraph already uses. In Transactions, write "waits for the transaction that changed this row first".

### editorial-3 · required · Figure 5 caption and final step, against the opening of "Changing a live database"

Problem: The prose sets the premise: "Existing orders have no delivery instruction, and older application instances never send one." The Figure 5 caption then says: "Existing orders have confirmed delivery instructions available for conversion in this example." The staged path ends with "existing rows have honest values" and the card "Confirmed delivery instruction stored". The text never says where those confirmed values come from.
Effect: The reader is told that the old orders have no delivery instruction and also that they do. The figure's successful ending depends on values whose source is never given, so the lesson the prose draws ("convert existing data only where a valid value can be established") looks as if the figure has assumed the problem away.
Repair: Give the values a source in the caption, and make the prose agree. For example: "In this example, the shop can recover each existing order's delivery instruction from its courier records, so the old rows can be filled with real values. If no valid value can be found, the final rule has to allow historical orders without one." Change the opening sentence to "Existing orders have no delivery instruction stored in the database…".

### editorial-4 · optional · "Transactions and competing buyers", the ACID and durability paragraphs

Problem: The definition of durability is compressed and leans on terms that are never explained. "Durability is the commit’s survival promise." is a noun stack. The next sentence introduces "local write-ahead log to be flushed" without saying what either term means, then "Asynchronous commit can reply earlier". The paragraph closes with "Establish the engine, settings and failures covered before relying on a success reply." The ACID paragraph before it names durability before this definition, and says "the initials cannot supply missing rules or correct a mistaken change", which gives agency to an acronym.
Effect: The reader has to unpack the definition of one of the four properties the section names, and meets "write-ahead log" and "flushed" as unexplained jargon. The Storage reference does the same job in one plain sentence: "Durability is the promise that a committed change survives a crash."
Repair: "Durability is the promise that a committed change survives a crash. Before PostgreSQL replies that a commit succeeded, it normally waits until a record of the change, its write-ahead log, has been saved to disk, so the change can be rebuilt after a crash. A setting called asynchronous commit replies before that save, and a crash can then lose the last few commits. Neither protects against losing the disk itself. Before relying on a success reply, check which engine and settings you have and which failures they cover." In the ACID paragraph: "ACID cannot add rules you never wrote down or undo a mistaken change."

### editorial-5 · optional · "Transactions and competing buyers", the Read Committed paragraph and the paragraph after it

Problem: The sentence that explains why the conditional update is safe is the densest in the article: "At PostgreSQL’s default *Read Committed* isolation, a competing updater waits for this row’s writer, then rechecks the condition against its committed version." The reader must work out who the "updater" and the "writer" are and what "its" refers to. "Read Committed" arrives as a name without the term "isolation level". The paragraph ends with "A non-negative stock check is an extra guard; checking the statement’s result remains necessary.", which refers to a `CHECK` constraint the text never shows. The next paragraph opens with "That settles one counter. Rules over several rows need an argument about constraints, locks or stronger isolation that covers every writer."
Effect: The outcome is clear ("the second gets no returned row"), but the reason for it has to be decoded. "Counter" and "an argument about" are writerly, and "locks" is used without explanation.
Repair: "PostgreSQL offers several isolation levels; its default is called Read Committed. At that level, when Arun's UPDATE reaches the mug row that Mina's transaction has already changed, it waits until Mina's transaction commits. It then tests `available >= 1` again against the new value, 0, and changes nothing." Then: "A `CHECK (available >= 0)` constraint adds a second guard, but the application must still check whether the UPDATE returned a row." Then: "That handles a rule about one row. A rule that spans several rows needs a design that covers every program changing them, using constraints, locks or a stricter isolation level."

### editorial-6 · optional · terms used before explanation or under several names

Problem: Several terms drift or arrive undefined.
- Reservation: the shop first "reduce[s] available stock". Then "Every accepted order has reserved its items" talks about "orders and reservations", although the schema has no reservations table. Later come "stock reservation", "commits the reservation" and "stock reservations". Nothing says that reducing available stock is what the article calls reserving.
- Item rows: "item", "item row", "order–item pair", "lines" ("GROUP BY gathers order 101’s two lines") and the column header "line £" name the same thing, and "Separate discount lines" uses "line" in a different sense.
- Order status: the prose says "waiting for payment", while Figure 2 shows the stored value `pending_payment`. Arun's order is a "draft", which is never explained.
- Rules and constraints: the schema section says "rules" (`NOT NULL`, `CHECK`). Later sections switch to "violates a constraint" and "under a uniqueness rule" without connecting the two words.
- Backup: the prose defines "backup". Figure 6 then calls it "Retained earlier state", "retained earlier copy" and "the recovery input", and the prose also says "retained change history".
- Worker: "lets a worker perform that work" and "while an old worker can still write the old format" use "worker" without saying it is a separate background process.
- Indexes and pages: "Files, pages and indexes are how the engine stores and finds them" appears two sections before either term is defined.
Effect: Each change of name makes the reader wonder whether a new thing has appeared. The reservation wording in particular sends the reader looking for a table that does not exist.
Repair: At first use, write "reduce available stock, which we will call reserving it", then keep "reserve". Choose "item" and use it everywhere: "GROUP BY gathers order 101’s two items"; column header "item £". Say once that "waiting for payment" is stored as `pending_payment`. In the schema section, say that "the database calls these rules constraints", then use "constraint" and "unique constraint". Label Figure 6's third card "Backup (from before this failure)". Introduce the worker as "a background worker, a separate process that…". In the tables section, either drop "pages and indexes" or add "(both explained later)".

### editorial-7 · optional · ambiguous everyday words in "Asking questions with SQL", Figure 2 and "Keeping the service and its data"

Problem: Three ordinary words collide with the article's own subject matter.
- "Without it, an order you happen to observe is not promised." In an article about shop orders, "an order" first reads as a customer's order, not the order of the rows.
- Figure 2's panel "A new reader’s view" and its note "The reader starts a new read at each step." use "reader" for a database session, while the article also addresses its own reader.
- "Time an isolated restore and application checks, including the keys, configuration and capacity needed to use it." In a relational article, "keys" means primary and foreign keys. Here it presumably means encryption keys or credentials.
Effect: The reader pauses to choose the right meaning, and may choose the wrong one for "keys".
Repair: "Without `ORDER BY`, the rows can come back in any sequence, even if they look sorted today." "Another session's view"; "A separate session reads afresh at each step." "…including the encryption keys, credentials, configuration and capacity needed to run it."

### editorial-8 · optional · compressed sentences across the article

Problem: Some sentences ask the reader to decode them:
- "Reordering the writes changes which partial result can remain." Plain alternative: "Saving them in a different order only changes which half-finished state is left behind."
- "…with a next action for an interrupted or declined attempt." Plain alternative: "…and a defined next step when a payment attempt is interrupted or declined."
- "Separate discount lines would need a different identity." Plain alternative: "If the shop recorded a discount as a separate line, it would need a different primary key."
- "Figure 1 starts after matching customers, so the names are already present." Plain alternative: "Figure 1 has already joined each order to its customer, so the names are shown."
- "Neither a successful query nor an attractive sample proves that the question was right." Plain alternative: "A query that runs and returns plausible rows can still be answering the wrong question."
- "…carries a report from its first query to a checked answer…" Plain alternative: "…builds one sales report from its first query to an answer you have checked…"
- "Each can read one available before either commits." Plain alternative: "Each can see that one mug is available before either commits."
- "Reading thousands of rows to return ten supports investigating the access path; a long lock wait raises a different question." Plain alternative: "If the plan reads thousands of rows to return ten, look at how it finds them. If it spends its time waiting for a lock, the problem is elsewhere."
- "It performs changes too, so collect execution evidence for changing statements in a suitable disposable environment." Plain alternative: "It really runs the statement, so an `UPDATE` or `DELETE` really changes data; measure those on a throwaway copy."
Effect: Each sentence is short, but compressed. The reader slows down at each one, and together they add effort that the plainer early sections do not ask for.
Repair: Use the plain alternatives above, or similar wording.

### editorial-9 · optional · "From a request to a committed order", the connection-loss and retry paragraphs

Problem: The practical rules on uncertain outcomes are written as abstract nouns and bare imperatives. "A database rejection and a broken connection carry different evidence." "A connection lost during commit may conceal success." "A lookup that finds nothing must also account for an overlapping attempt still able to commit; it is not permission for an uncoordinated retry." "Reconcile uncertain external outcomes." "Bound retries and connection demand together, because immediate retries can deepen an overload."
Effect: This is advice the reader is meant to act on, but "account for an overlapping attempt", "uncoordinated retry", "reconcile" and "bound … together" do not say what to do. The Sequences and Storage references state the same ideas as concrete events: "the application saw only a dropped connection, the same whether its change was kept or lost".
Repair: "A constraint error means the change did not happen. A connection that breaks during COMMIT tells you nothing: the order may have been saved without the application hearing. …If the lookup finds no order for R103, another retry of R103 may still be in progress and about to commit, so the unique constraint on the purchase-attempt identifier, not the empty lookup, is what stops a second order." "When a payment's outcome is unknown, ask the provider what happened before acting again." "Limit how many times and how quickly requests retry, and how many connections they may open, because retrying at once makes an overloaded database worse."

### editorial-10 · optional · openings of "Transactions and competing buyers" and "From a request to a committed order"

Problem: Transactions opens with instructions: "Return to the last mug and a new order, 103. Put the order insertion, item insertion and stock reduction between `BEGIN` and `COMMIT`." The reader is told what to do before being told what the section will show. The application section opens with a definition, "A **driver** sends the application’s statements and translates returned values.", and never says why the application's side matters.
Effect: The reader starts each section following orders without knowing what the section is for. The other sections open by telling the reader something: "Returning one order can mean testing every row in a table."
Repair: Transactions: "A transaction is how the shop makes the three changes for order 103 succeed or fail together. In SQL, you put them between `BEGIN` and `COMMIT`…" Application section: "Every statement reaches the database through the application's code, and several of the shop's worst failures happen there: values mistaken for SQL, transactions split across connections, and retries that create duplicate orders. A **driver**…".

### editorial-11 · optional · headings and their anchors

Problem: Every heading's anchor still uses an older title: `#one-action-changes-several-facts`, `#ask-for-a-result-then-check-what-it-means`, `#a-transaction-protects-a-change-within-a-stated-contract`, `#the-application-is-part-of-the-database-system`, `#correct-sql-still-has-to-do-physical-work`, `#data-and-applications-change-at-different-speeds`, `#operate-for-the-failure-you-must-recover-from` and `#choose-a-system-by-testing-the-contract-you-need`. The anchors appear in the address bar whenever the contents list or the introduction's "reading routes at the end" link is used, and in any link a reader shares. Separately, "Keeping the service and its data" does not say what the section covers: access, monitoring, replicas, backups and recovery targets.
Effect: The anchors show editing history, and some read as slogans rather than names. The vague heading makes the contents list less useful for finding the replica and backup material.
Repair: Derive each anchor from its current heading, for example `#transactions-and-competing-buyers`. Rename the section to something like "Running the database: access, replicas and backups".

### editorial-12 · optional · figure labels and disclosure text

Problem: Some labels use words that only the figure defines. Figure 4's cards and step text say "Candidate location", "No candidate location has been sought yet" and "Unknown until rows are read". Figure 5's card and step text say "Replaced; old work drained" and "old work has drained". Figure 6's last stage is "Choose the recovery input". The text-only disclosures are labelled "Read the model without animation" in Figures 1 and 2 but "Read the comparison as text" in Figures 3 to 6.
Effect: The reader works out a small private vocabulary for each figure, and the disclosure that does the same job has two different names.
Repair: "Where order 9 is: not looked up yet / page 3, from the index / page 3, found by scanning". "Old version retired; its last requests finished". "Choose what to recover from". Use one disclosure label throughout, for example "Read this figure as text".

### editorial-13 · optional · "Where to continue" table

Problem: The column heading is "Your next job", but two rows describe situations rather than jobs: "Correct work is slow" and "The service is reaching a limit". "Correct work is slow" is an odd phrase in its own right. The first row sends the reader to Working with SQL twice: "Get the setup from Working with SQL, then read Designing relational data → Working with SQL → …".
Effect: The reader has to read the row labels as situations rather than tasks, and may wonder whether to read Working with SQL before or after Designing relational data.
Repair: Phrase every row as a job: "Speed up queries that already give the right answer", "Keep a service running as it grows". In row 1, write "Set up the practice database from the first section of Working with SQL, then read Designing relational data, the rest of Working with SQL, …".

## Limits

This review judged wording only, as a reader meets it. It did not check technical accuracy, coverage, depth, teaching order or the drawn appearance of figures; those belong to the practitioner, teaching and visual perspectives. Figure step text was read from the bundled scripts and checked against the static markup, not by playing each figure in a browser, so the order and timing in which text appears were not seen. The review-route chrome (the eyebrow "New draft review", the "Draft available · 38 of 38 drafts available" notice and the "Read the collection" tree) was treated as belonging to the review layout. Only the wording of the last of these is raised, in editorial-1. The reference articles were read as source, so their figure step text was seen only where it appears in their markup.
