# Editorial review · article (recheck) · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · f786105, round d02

Inputs read:
- The rebuilt rendered pages, read in full as text, including chrome, captions, control labels and the "Read this figure as text" panels: dist/review/relational-trial/index.html (a00) and dist/review/relational-trial/transactions/index.html (a03).
- The step text of a03's new Figure 5, from src/components/relational-trial/a03/model.mjs.
- The d01 repair decisions (d01/repair-decisions.md).
- The intended audience: an intelligent engineer new to relational databases, aiming to become an expert practitioner.
- The three reference articles. I read these in full in d01 and did not re-read them; they are unchanged inputs.

Withheld as before: the plan, writers' notes, sources records, live drafts and the other perspectives' reports.

Verdict:
- a00: pass. No required finding remains; two new optional findings.
- a03: repairs required. One new required finding (editorial-21).

The rejected draft banner (part of editorial-10) is not counted against either verdict.

## Status of d01 findings

- editorial-1 · fixed. The section 1 table now has four rows, and the text says a transaction "solves the first two rows… It does not, by itself, solve the last row".
- editorial-2 · fixed. "Contextual", "working-route" and "parent" are gone. The opening route advice now matches the "Read the collection" lead-in, and names the four longer articles to start with.
- editorial-3 · fixed. A new paragraph before Figure 3 explains isolation level, Read Committed, Repeatable Read, snapshot and row lock. "Serialisation failure (SQLSTATE 40001)" is named in the step text and the prose.
- editorial-4 · fixed. The commit paragraph explains the write-ahead log, and replica and backup are both defined before Figure 4. A small leftover is noted in editorial-20.
- editorial-5 · fixed. Cross-references now name sections by heading.
- editorial-6 · fixed. Results are stated directly ("In PostgreSQL 18.6 the first reported UPDATE 2"), and provenance is kept to Sources.
- editorial-7 · fixed. All five sentences are rewritten. The NOT VALID advice is now its own plain paragraph.
- editorial-8 · fixed. "Order line" is used throughout, including the Figure 1 control ("Follow an order line's keys") and the Figure 2 option labels.
- editorial-9 · fixed. The read-next table uses the article titles.
- editorial-10 · partly fixed. The "planned articles are marked below" sentence no longer appears. The draft banner, eyebrow and "Draft available" labels remain; the coordinator rejected that part, so I have not raised it again.
- editorial-11 · fixed. Mina Shah and Tariq Aziz are the customers, the instructors are Lena and Ravi, and the article says how the booking service maps onto the shop.
- editorial-12 · fixed. The heading is now "Isolation levels: a fixed snapshot is not enough", and the body says "fixed snapshot".
- editorial-13 · fixed. The heading is now "Deadlocks, retries and lost replies".
- editorial-14 · fixed. "Fixture" became "The example schema declares…". "Predicate" is explained. "Suppose class 22 becomes a paid class" replaces "workshop". "Lock" is defined where it is first used, in "Put the whole change inside one transaction".
- editorial-15 · fixed. The deadlock outcome, the lost-update definition and the companion-article sentence are all rewritten plainly. editorial-25 notes a new slip in the rewritten deadlock sentence.
- editorial-16 · fixed. a03 now says "one possible timing, replayed on PostgreSQL 18.6", and "a model of row versions; the waits and results were observed", which matches a00's use of "illustrative". Figure 1's caption describes the rows, the verdict reads "0 left + 3 booked = capacity 3", and the text summaries keep their original case.
- editorial-17 · fixed. "This procedure works for any rule" replaces "The procedure we used for this article", and Sources no longer has build details.
- editorial-18 · not fixed. The coordinator deferred it as shared layout; the breadcrumb still skips "Relational databases".

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The renamed a03 headings say what their sections cover. Figure 5's title, "The same two moves, two lock orders", is clear. |
| 2. Plain sentences | finding (a03) | The new passages are mostly plain. In a03, the predicate paragraph got denser and the 23505 retry exception is hard to apply (editorial-24, editorial-26). One rewritten sentence describes an event that did not happen (editorial-25). |
| 3. Terms | finding (both) | a00's new definitions work. a00 uses "pages" and "replication lag" just before they are explained (editorial-20). a03's new protection table and Figure 5 use names that differ from their own figure controls (editorial-22, editorial-23). The closing paragraph about the shop uses words a00 replaced (editorial-27). |
| 4. Openings | pass | The new a00 definitions paragraph and a03's new opening and Figure 5 lead-in each state something before giving an instruction. |
| 5. Reader-facing text only | pass | Notes on how the articles were made are gone from both bodies. The draft banner remains by the coordinator's decision. |
| 6. Captions and labels | finding (both) | a00's prose calls a table row a column after the table was transposed (editorial-19). Figure 5 has a select control with one option, and its text summary leaves out the deadlock (editorial-23). |

## Findings

### editorial-19 · optional · a00, "The work behind a query", paragraph after the page-count table

Problem: The page-count table has been transposed. Order counts now run across the columns, and "One customer, with an index, pages" is the last row. The prose still says "The last column carries a second lesson. With an index on customer_id…". The last column now holds the 1,000,000-order figures for every query.
Effect: The reader looks at the last column and finds all the million-row numbers, not the indexed lookup the sentence goes on to discuss. The next sentence helps them recover, but only after a mismatch.
Repair: "The last row carries a second lesson."

### editorial-20 · optional · a00, the commit paragraph and the opening of "Running and recovering the database"

Problem: The new WAL sentence ends "It copies the changed pages into the table files later". "Pages" are only explained two sections later ("Rows live in fixed-size pages, 8 kB each in PostgreSQL"). Similarly, "replication lag" appears in the list of signals to watch, one paragraph before the replica is defined.
Effect: These are small stumbles in otherwise repaired passages. The reader meets a word whose meaning they have to assume for a paragraph or two.
Repair: Write "It copies the changes into the table files later", or add "(rows are stored in fixed-size pages)". For the second, move the replica definition into the duties paragraph, or write "how far a replica, a second server copying the primary, has fallen behind".

### editorial-21 · required · a03, "Choosing a protection" table (last row) and the closing argument

Problem: The table's last row gives the rule shape "Any, including writers you cannot change" for Serializable. In the same row, "What every writer must do" says "Run at Serializable and retry on 40001". The paragraph just above says Serializable protects "only between transactions that all run at Serializable". The closing argument then advises: "A writer that cannot be made to take the lock, such as a vendor's import tool, would point to Serializable instead." As written, the reader can't tell how a writer they cannot change will run at Serializable and retry.
Effect: This is the table and recommendation the reader will act on when choosing a protection, and it contradicts itself. A reader could choose Serializable for an import tool that runs at Read Committed and never retries, and believe the rule is protected.
Repair: Say what makes Serializable work for such a writer. One option: "writers whose code you cannot change but whose isolation level you can set, for example as the default for their database role, and which retry or can be rerun". Use the same wording in the closing argument. Alternatively, drop "you cannot change" and make the row "Several rows, when you would rather retry than coordinate locks". Practitioner should confirm the technical condition.

### editorial-22 · optional · a03, "Choosing a protection" table against Figure 3's controls

Problem: The table names the protections "Lock the rows read" and "Coordination row". Figure 3's Protection control, and the paragraphs that explain them, say "Lock the rows you counted" and "Lock the class row first".
Effect: The reader has to work out that each pair names the same protection, in the very table meant to summarise the figure.
Repair: Use the figure's names in the table, adding "(coordination row)" after "Lock the class row first" if that term should stay.

### editorial-23 · optional · a03, Figure 5 (labels, caption and text summary)

Problem:
- The prose says "Step through the opposite-order run", but the control option is labelled "Each locks its own source class first".
- The caption says "The victim in the opposite-order run…" before the prose has used the word "victim".
- The "Example" select has a single option ("Mina and Tariq swap classes"), so it changes nothing.
- The "Read this figure as text" lines give only the final counts, "Rule holds" for both options. They leave out that the first option deadlocked, that Mina's move was aborted and rerun, and that Tariq's move was refused, which is the point of the figure.

Effect: A reader who uses the controls has to match two names for the same option. A reader who relies on the text version learns that both orders keep the rule, but not why lock order matters.
Repair:
- Use one name throughout, such as "Opposite lock orders" against "Both lock class 21 first".
- Write "the transaction PostgreSQL aborted" in the caption.
- Remove the one-option select, or show the example as plain text.
- Add one sentence for each option to the text summary: for the first, "deadlock after step 4; PostgreSQL aborted Mina's move; Tariq's move found class 21 full and rolled back; Mina's rerun committed"; for the second, "Tariq waited, then both moves committed".

### editorial-24 · optional · a03, "Protect the decision, not just the write", second paragraph

Problem: The repaired paragraph now contains:
- three ways a predicate's answer can change;
- a sub-case of the third;
- an example of that sub-case ("Moving a booking into class 21");
- the limit of row locks;
- a hypothetical that uses FOR UPDATE.

SELECT … FOR UPDATE is only introduced in "Coordinate decisions that span several rows".
Effect: It is the densest paragraph in the article, and its last example depends on a statement the reader hasn't met.
Repair: Split it after "Moving a booking into class 21 is that last kind." Begin the second paragraph by introducing the locking read: "A query can lock the rows it returns (SELECT … FOR UPDATE). That protects against the first two kinds of change, but not a row that did not match yet…"

### editorial-25 · optional · a03, "Deadlocks, retries and lost replies", paragraph after Figure 5 (and the matching Figure 5 step note)

Problem: "Because Mina's transaction had been rolled back, R8 was back in class 21 and its place was still taken". The step note says "Mina's rollback put R8 back in class 21". In this version each move locks both rows before changing anything, and the deadlock happens while locking. Mina's transaction never moved R8.
Effect: The reader may think Mina's move had already moved R8 before the deadlock. That blurs the point that lock ordering happens before any change.
Repair: "Mina's transaction had been rolled back before it changed anything, so R8 was still in class 21 and class 21 was still full." Make the same change in the step note.

### editorial-26 · optional · a03, "Retrying one statement keeps a stale decision", last paragraph

Problem: "A unique-key error (23505) or an exclusion error (23P01) can stand in for a serialisation failure when the key was chosen from data another transaction was changing, so retry those only in that case." "Exclusion error" is not explained. "When the key was chosen from data another transaction was changing" describes something the application cannot see when the error arrives.
Effect: The reader learns there is an exception but not how to recognise it. The lost-reply table then points back to it ("except in the Serializable case above").
Repair: Say how an application recognises the case, for example: "under Serializable, if the transaction read the table to choose a key and then inserted it, treat 23505 as you would 40001 and retry the whole transaction". Either explain "exclusion constraint" in a clause or leave 23P01 to Sources.

### editorial-27 · optional · a03, closing paragraph "The same argument covers the shop's order"

Problem: The new paragraph says "inserts the order and its items" and "reducing the mug's available count". After its own d01 repair, a00 uses "order lines" and "stock" throughout. This article's own mapping paragraph also says "a reservation plays the part of an order line".
Effect: The terms drift right at the paragraph meant to connect this article back to the introduction's shop.
Repair: "inserts the order and its order lines and reserves stock…", "reducing the mug's stock only where enough remains".

## Limits

- I did not play the figures in a browser. I read Figure 5's steps from model.mjs and the other figures from their built text.
- I did not re-read the reference articles; my d01 reading stands.
- editorial-21 depends on what PostgreSQL actually requires of a writer's isolation level. The practitioner perspective should confirm the condition proposed in the repair.
- The Sources list in a00 no longer includes the "Index types and Using EXPLAIN" line or the list of eight articles that d01 showed. That is not an editorial problem in itself, but the coordinator may want practitioner to confirm it was intended.
