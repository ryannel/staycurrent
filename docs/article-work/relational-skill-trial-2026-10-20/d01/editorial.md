# Editorial review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · 03f972f, round d01

Inputs read: the rendered pages dist/review/relational-trial/index.html (a00) and dist/review/relational-trial/transactions/index.html (a03), read in full as text, including page chrome, captions, control labels, "Read this figure as text" panels and the collection lists; figure step text for a03 Figures 2, 3 and 4 from src/components/relational-trial/a03/model.mjs, ScheduleFigure.astro and schedule-view.mjs (a00's step text is fully present in its built "Read this figure as text" panels); the intended audience (an intelligent engineer new to relational databases, aiming to become an expert practitioner); the reference articles src/reference-articles/sequences.astro, indexes.astro and storage.astro in full. Withheld as instructed: the plan (registry, coverage YAML), writers' notes, sources records, the live drafts of these articles and earlier review folders.
Verdict: a00: repairs required · a03: repairs required (only because of the shared-layout finding editorial-10; a03's own text has no required finding)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | a00 pass · a03 finding | a00's headings name their subjects plainly. In a03, "A steady view does not prove the rule" uses a coined phrase, and "Retry an aborted transaction as a whole" heads a section that opens on deadlocks (editorial-12, editorial-13). |
| 2. Plain sentences | finding (both) | Mostly plain and one idea per sentence. A few compressed or writerly sentences remain in each piece (editorial-7, editorial-15). a00 also contradicts its own first table (editorial-1). |
| 3. Terms | finding (both) | a00 uses isolation-level names, snapshot, row lock, write-ahead log and replica before explaining them (editorial-3, editorial-4), and lets "order line" drift (editorial-8). a03 defines its main terms well but has minor drift, and reuses the introduction's names for different people (editorial-11, editorial-14). |
| 4. Openings | pass | Every section in both pieces opens by telling the reader something. The instructions before figures ("Start with One after the other…", "Try the ordinary SELECT first…") follow an explanatory opening, so they pass. |
| 5. Reader-facing text only | finding (both) | a00's closing paragraphs use planning vocabulary ("contextual articles", "working-route articles", "parent") (editorial-2). Both pieces narrate the verification process in body text (editorial-6, editorial-17). The shared layout shows draft-status and "planned articles" text (editorial-10). |
| 6. Captions and labels | a00 pass · a03 finding | a00's captions say what is shown and what was observed, and its control labels name what they change. a03 uses "illustrative" in a different sense from a00, Figure 1's caption repeats the prose, and one verdict line drops its units (editorial-16). |

## Findings

### editorial-1 · required · a00, "Transactions and competing buyers", paragraph after the transaction listing

Problem: "That solves the first three rows of the table in section 1. It does not, by itself, solve the fourth: two complete, correct-looking transactions running at once." The table in section 1 ("Where a sequence of separate writes can stop") has three rows. A transaction fixes the first two (stopping after the order and stopping after the lines). The concurrency problem is the third row, which the text after that table called "the last row… the harder problem".
Effect: The reader goes back to the table looking for a fourth row that isn't there. They then have to work out for themselves which rows a transaction fixes. This is the article's central distinction, between atomicity and protection against concurrent changes, and the sentence that states it miscounts.
Repair: "That solves the first two rows of the table in section 1, where the work stopped part-way. It does not, by itself, solve the last row: two complete, correct-looking transactions running at once." Refer to the section by its heading as well (see editorial-5).

### editorial-2 · required · a00, the closing paragraph of each section, the opening route paragraph and "Read the collection"

Problem: The article's closing paragraphs use the collection plan's vocabulary. Each section ends "Its contextual articles cover…" (seven times). The introduction tells the reader to read "the four working-route articles in order". The last section says "Each deeper article assumes particular sections of its parent". None of these terms is explained. The "Read the collection" list does not mark which articles are the "working-route" ones or which are "contextual". That list also gives a different instruction: "read each longer article before the shorter articles that follow from it". This implies reading everything, while the introduction says to read the deeper articles "only when a question in front of you needs them".
Effect: A newcomer can't tell what a "contextual" or "working-route" article is, or which four articles to read first, without matching the lowercase names in the opening paragraph against the list. The two reading instructions disagree, so the reader has to guess the intended route.
Repair: Replace the plan terms with reader words. For example: "Its shorter companion articles cover…"; "read this article, then these four in order: Designing relational data, Working with SQL, Making concurrent changes correct and Building applications around a relational database"; "Each companion article names, at its start, the section of the main article it assumes." Make the "Read the collection" lead-in match the introduction's advice. Its text comes from the shared collection-list component, so the coordinator may need to change it (see editorial-10).

### editorial-3 · required · a00, Figure 3 and the paragraphs around it ("Transactions and competing buyers")

Problem: Figure 3's controls are labelled "(Read Committed)" and "(Repeatable Read)". Its step text uses "row lock", "his snapshot" and "a serialisation error". None of these has been explained when the reader meets them. Before the figure the prose says only "a stated isolation level". After it, the prose says "The isolation level is a contract", without saying what either level promises. "Snapshot" next appears in the InnoDB sentence ("the snapshot applies to plain reads"), still unexplained. The reference articles define each such term at first use, in plain words (for example storage's "buffer pool" and indexes' "selectivity").
Effect: The reader has to choose between two options named after concepts they have never been given. They can follow what happens step by step but can't connect it to a rule. The paragraph comparing the two protections ("the database refuses to let Tariq overwrite a row that changed after his transaction began") then has to carry the definition after the fact. The MySQL caution, which depends on knowing what a snapshot is, is hard to take in.
Repair: Before Figure 3, add two or three sentences. An isolation level states what a transaction can see of others' changes. At Read Committed, each statement sees what was committed when that statement began. At Repeatable Read, the whole transaction sees a fixed snapshot: the data as committed when it started. A transaction that changes a row holds a lock on it until it ends, so a second writer waits. Then name "serialisation failure (40001)" where the figure first shows it.

### editorial-4 · required · a00, "Transactions and competing buyers" (commit paragraph) through "Running and recovering the database" (Figure 4)

Problem: "Write-ahead log" first appears in "the change has been written to its write-ahead log on durable storage" with no explanation. "A replica may not yet have the change" uses "replica" in the same paragraph. Figure 4 is built on "the replica replays the primary's log" and "log segment is also archived". "Replica" is defined only after the figure ("A replica is a second server that continuously replays the primary's changes"). The log is never explained. The reference storage article defines the write-ahead log at length before relying on it.
Effect: Figure 4 depends on the idea that the database records every change in a log that can be replayed and archived. Without that idea, "Copy from 02:00, log to 11:05" and "restores the copy and log to 11:09:59" are opaque. The reader has to accept the recovery mechanism without being able to picture it.
Repair: At the first use, add one sentence: "Before acknowledging a commit, PostgreSQL appends a record of the change to its write-ahead log, a file it can replay after a crash, and later copies the changed pages into the table files." Move the replica definition so it comes before Figure 4, for example into the paragraph that introduces the figure. Then the figure's "replays the primary's log" uses two terms the reader already has.

### editorial-5 · optional · a00, cross-references "section 1", "section 4", "section 6"

Problem: The prose refers to "the table in section 1", "as section 4 showed" and "a theme section 6 returns to", but the headings and the contents list have no numbers.
Effect: The reader has to count headings to follow each reference.
Repair: Refer to sections by heading, for example "the table in One order changes several facts" or "as Transactions and competing buyers showed". Alternatively, number the headings.

### editorial-6 · optional · a00, "the verification run/script" in body text and Sources

Problem: The body text narrates the process ten times: "the article's verification script loaded", "In the article's verification run…", "which the verification run confirmed", "the verification run built an orders table", "the verification run showed…". Sources says "the verification script kept with this article's components". "Verification run" is never explained, and "components" is build vocabulary. The reference articles state observed results directly ("On the 60,000-order table, …") and gather how they were obtained in one "Where the numbers come from" section.
Effect: The repetition reads as notes on how the article was made. It lengthens sentences that would otherwise state a fact, and the reader has to work out what a "verification run" is.
Repair: State results directly, for example "PostgreSQL 18.6 reported UPDATE 2" or "Measured in PostgreSQL 18.6, …". Keep one short provenance paragraph in Sources, saying "a script that replays every example", without "components".

### editorial-7 · optional · a00, compressed or writerly sentences

Problem: Several sentences take decoding:
- "It is an illustration of reasoning, not an execution." (first table)
- "which waited for the reported lock before continuing" (Figure 3 caption)
- "Settings such as synchronous_commit = off trade a short window of recent commits for speed"
- "PostgreSQL 18 can also add the requirement as NOT VALID first, which the verification run showed refuses new empty values straight away and is then validated after the backfill, separating the fast part of the change from the slow check of existing rows." (four ideas in one sentence)
- "a cheerful save()"

Effect: Each one makes the reader stop and unpack it, and the NOT VALID sentence hides a useful technique.
Repair:
- "These outcomes are reasoned out, not observed."
- "The script waited until PostgreSQL reported the lock wait before sending the next statement."
- "With synchronous_commit = off, PostgreSQL replies before the log reaches storage, so a crash can lose the last fraction of a second of commits."
- Split the NOT VALID sentence into three sentences.
- "an innocent-looking save()" → "a single save()".

### editorial-8 · optional · a00, terms for order lines

Problem: The same fact is called "order lines (order_items)", "order line", "item line" (Figure 1 control label "Follow an item line's keys"), "items" ("Order 101 has two items") and "lines".
Effect: The reader may wonder whether "item line" and "order line" are different things, especially at the figure control.
Repair: Use "order line" throughout, in the control label too ("Follow an order line's keys"), and keep order_items only as the table name.

### editorial-9 · optional · a00, "Where to read next" table

Problem: The link text uses short names that don't appear in the collection list below it: "Performance", "query plans", "concurrent load", "Operations", "monitoring and capacity". The articles are titled "Understanding and improving database performance", "Diagnosing a query from its execution plan", "Improving performance under concurrent load", "Running a relational service" and "Monitoring and sizing a relational service".
Effect: A reader who wants to find these articles in the list, or remember them, has to translate the names.
Repair: Use the article titles, or titles shortened in a way that is still recognisable ("Running a relational service, then Monitoring and sizing").

### editorial-10 · required · a00 and a03, shared page layout (draft-status banner, eyebrow, collection lists) — route to coordinator

Problem: Both pages show text about the drafting process, from the shared layout rather than the article:
- the eyebrow "Relational databases · New draft review";
- the banner "Draft available · 38 of 38 drafts available. The complete draft collection is available for review. See the new draft collection.";
- "Draft available" beside every entry in "Read the collection" (a00) and "Continue into the detail" (a03);
- "All articles in the new draft collection →" (a03).

Both lists also say "Available drafts are linked; planned articles are marked below", when no entry is marked as planned.
Effect: The first thing the reader sees after the title is editorial status, not the subject. The "planned articles are marked below" sentence describes something that is not on the page.
Repair: On reader-facing builds, drop the draft banner, the eyebrow suffix and the per-entry "Draft available" labels. Keep "planned" markers, and their lead-in sentence, only when some entry is actually planned. If this review route is never shown to readers, the coordinator may decide it is exempt. Even so, the stale "planned articles are marked below" sentence should only appear when it is true.

### editorial-11 · optional · a03, "Start with the rule that must stay true" and Figure 1

Problem: a03 says "The shop from the introduction now runs short classes" and "Mina and Arun are its customers", and makes Tariq an instructor. In the introduction, customer 2 is Tariq Aziz, who raced Mina for the last mug. Here customer 2 is Arun, and Tariq asks for leave as a teacher.
Effect: A reader arriving from the introduction carries Tariq as Mina's competing buyer. When "Tariq asks for leave" appears in Figures 2 and 3, they have to stop and work out that it is a different role, or a different person.
Repair: Give the second instructor a name not used in the introduction, for example "Lena and Joel". Alternatively keep Tariq as the competing customer, and add "a new customer, Arun" only if a third customer is needed.

### editorial-12 · optional · a03, heading "A steady view does not prove the rule"

Problem: "Steady view" is a coined phrase, used again in "A steady view stops a transaction seeing others' changes partway through". The section introduces PostgreSQL's three isolation levels, but the heading doesn't say so. A reader scanning the contents list for "isolation levels" won't find it here.
Effect: The reader has to work out what the phrase means, and the section is harder to find again.
Repair: Use a heading such as "Isolation levels: a fixed snapshot is not enough". In the body, say "a fixed snapshot" or "the same data throughout" instead of "a steady view".

### editorial-13 · optional · a03, heading "Retry an aborted transaction as a whole"

Problem: The section opens with deadlocks, lock order and error 40P01. Its retry advice comes in the first subsection, and lost replies come in the second. The heading is an instruction that describes only the middle part.
Effect: A reader looking for deadlocks, or for what to do when the connection drops, won't recognise this section from its heading or the contents list.
Repair: Use a heading such as "Deadlocks, retries and lost replies", or "When a transaction is aborted or its reply is lost".

### editorial-14 · optional · a03, small term gaps and drift

Problem:
- "The fixture for these examples does this for three of them": "fixture" is test-suite jargon.
- "That read may be one value, or a predicate": "predicate" is not explained, though the examples in quotation marks help.
- "Suppose the paid workshop needs a card payment": until here the article says "class", and no class was described as paid.
- "Lock" is used from the transaction section onward ("holds its locks", "waits for the first transaction's lock", "SELECT … FOR UPDATE locks") but is only defined in "Versions and locks answer different questions".

Effect: These are small pauses, but they add up for a newcomer.
Repair:
- "The example schema declares three of them."
- "or a condition that selects rows (a predicate): …"
- "Suppose class 22 becomes a paid class."
- One sentence at the first use of "lock": "A transaction that changes a row holds a lock on it until it ends; another transaction that wants to change or lock the same row waits."

### editorial-15 · optional · a03, compressed sentences

Problem:
- "Arun's move then continued, found class 21 full, because Mina's release of her place there had been undone, and rolled back as a business rejection." (deadlock paragraph; four ideas in one sentence)
- "This pattern is called a lost update when one write overwrites another made after the read." (the definition is phrased as a condition)
- "Designing changes that coordinate with locks takes the capacity rule without its stored counter and builds…"

Effect: The deadlock outcome, which the reader needs in order to see why lock order matters, is the hardest sentence in the section to follow.
Repair:
- "Arun's move then continued. Because Mina's transaction had been rolled back, her place in class 21 was never released, so Arun's move found class 21 full and rolled back."
- "When a write overwrites a change committed after the writer's read, the result is called a lost update."
- "…works the capacity rule again without the stored remaining counter, and builds…"

### editorial-16 · optional · a03, figure captions and labels

Problem:
- The Figure 2 and Figure 3 eyebrows read "illustrative schedule, replayed on PostgreSQL 18.6". Sources adds "The figures themselves are illustrative models drawn from those runs". In a00, "illustrative" means not executed ("Figure 4 and the first table are illustrative models"). In a03 it means executed, but drawn in one possible timing.
- Figure 1's caption repeats the opening sentence word for word ("The shop from the introduction now runs short classes").
- One Figure 3 verdict reads "Mina holds 2 bookings in class 22, though 0 + 3 = capacity 3", without the "left"/"booked" labels the other verdicts use.
- The "Read this figure as text" lines lowercase names ("unique (class_id, owner_id)", "at serializable").

Effect: A reader of both pieces gets opposite signals from the same word about what was run. The other issues are small frictions.
Repair:
- Label a03's schedules "one possible timing, replayed on PostgreSQL 18.6", and keep "illustrative" for figures that were not run.
- Replace Figure 1's repeated sentence with what the tables show: "The starting rows for every example: two classes, one existing booking and two instructors for class 21."
- Change the verdict to "0 left + 3 booked = capacity 3".
- Keep SQL and level names in their original case in the text summaries.

### editorial-17 · optional · a03, notes on how the article was made

Problem:
- "The procedure we used for this article works for any rule" (final section);
- in Sources, "(Homebrew, aarch64)" and "A script kept with the figures replays every step and checks each reply and final state against the article. The figures themselves… do not contact a database."

The body's "we ran each one" and "In our run" are useful evidence and can stay.
Effect: These describe the production process rather than the subject. The checklist is stronger presented as the reader's procedure.
Repair:
- "This procedure works for any rule:"
- Shorten the Sources provenance to the engine version, the settings that matter and "every schedule was replayed by a script".

### editorial-18 · optional · a03, shared page layout (breadcrumb) — route to coordinator

Problem: The breadcrumb reads "Home › Making concurrent changes correct" and skips the parent "Relational databases". The parent appears only in the eyebrow and in "Read in context".
Effect: The breadcrumb doesn't show where the article sits in the collection.
Repair: Show "Home › Relational databases › Making concurrent changes correct".

## Limits

- I read the figures as built text and as step text in the model files. I did not play them in a browser, so the order in which labels, highlights and step notes appear during playback was not checked.
- Links in the trial a00 point to /review/relational-next/… (including a03's anchors there), not to the trial a03. A reader moving between the two trial pieces therefore reaches a different version, and the link wording in a00 ("express a change and its condition together", "the isolation contract") does not match the trial a03's headings. Routing is outside this perspective. The coordinator should confirm that the trial pages are meant to link this way.
- Technical correctness was not judged. Findings that touch facts (editorial-1, and the definitions proposed in editorial-3 and editorial-4) are about wording as the reader meets it. The practitioner perspective should confirm the proposed definitions.
- This review ran in article mode, so the corpus check of consistency across articles was not performed. editorial-11 and the "illustrative" item in editorial-16 are noted because a03 explicitly builds on a00's shop.
