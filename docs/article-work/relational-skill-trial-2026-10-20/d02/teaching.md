# Teaching review · article (recheck) · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · commit f786105, round d02

Inputs read: the repaired trial a00 and a03 (`src/articles/relational-trial/a00.astro`, `a03.astro`) in full; the diff of both articles against 03f972f; the a03 figure model (`src/components/relational-trial/a03/model.mjs`), including every step of the new Figure 5; the built pages in `dist/review/relational-trial/`, checked to confirm they carry the repairs; the d01 repair decisions (`docs/article-work/relational-skill-trial-2026-10-20/d01/repair-decisions.md`); my d01 report; the a03 subtree of the coverage plan and the openings of a04, a18 and a19, all read in d01 and consulted again for placement and for the a04 hand-off. Withheld as instructed: the writers' notes and the live a03.
Verdict: a00, pass; a03, repairs required

## d01 findings

| Finding | Status | Note |
| --- | --- | --- |
| teaching-1 · a00, isolation terms at the race | Fixed | A new paragraph before Figure 3 defines isolation level, Read Committed, Repeatable Read, snapshot and row lock; the following paragraph names the serialisation failure and its code. |
| teaching-2 · a00, "first three rows … the fourth" | Fixed | The opening table now has a fourth row for concurrent orders, and the transaction section says it solves the first two rows and not the last. |
| teaching-3 · a00, write-ahead log and replica before definition | Fixed | The write-ahead log is defined at first use; the replica mention has left the transactions section, and replica and backup are defined together just before Figure 4. |
| teaching-4 · a03, deadlock told only in prose | Fixed | Figure 5 steps through the opposite-order run and the ascending-order run, with the starting rows restated in the text and in the figure. |
| teaching-5 · a03, cost of the class example | Fixed | The text maps the classes onto the shop (`remaining` for stock, a reservation for an order line), and Mina and Tariq are the two customers throughout. The instructors are now Lena and Ravi. A closing paragraph applies the argument to the shop's order, which gives a04 the argument it assumes. One leftover: a19 still names its instructors Mina and Tariq, which falls to a19. |
| teaching-6 · a03, why `remaining` is stored | Fixed | A paragraph after Figure 1 explains the counter and hands the count-only case to the locking article. |
| teaching-7 · a03, choosing a protection | Fixed, with a new problem | The "Choosing a protection" table and the reason for picking the coordination row answer the finding. The table's Serializable row contradicts the article's own limit on Serializable (teaching-10). |
| teaching-8 · a03, untaught insert test | Fixed | The predicate paragraph now gives the concrete `FOR UPDATE` counting case, and step 4 of the procedure points to the worked insert race in the locking article. |

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | a00: pass; a03: pass | Every term the d01 findings named is now explained before it is relied on. a03 also defines "lock" and "predicate" at first use. |
| 2. Order | a00: finding; a03: pass | a00's transaction section now builds in order. The transposed page-count table left one stale pointer, "the last column" (teaching-9). In a03, Figure 5 sits where the deadlock is introduced, and the guard on the move follows its listing. |
| 3. Examples | a00: pass; a03: finding | a03's class example is now tied to the shop and its cast matches the collection. The closing shop paragraph names a stock column that a00 calls by another name (teaching-11). |
| 4. Showing | a00: pass; a03: pass | Figure 5 shows the deadlock, the victim, 25P02, the other move's business rejection and the retry, with committed state at each step, and its second option shows the queue. |
| 5. Judgement | a00: pass; a03: finding | The criteria for choosing a protection are now gathered in one table and the closing argument gives its reason. The table recommends Serializable for writers the team cannot change, which the article's own limit rules out (teaching-10). |
| 6. Gradual exposure | a00: pass; a03: pass | The additions stay at each piece's level and hand the depth to the child that owns it (see check 7). |
| 7. Placement of additions | a00: pass; a03: pass | Every addition belongs where it was placed; see the list below. |

### Placement of each addition

**a00**
- **Fourth row of the opening table (concurrent orders):** belongs here. It sets up the problem the transactions section answers.
- **Paragraph defining isolation level, Read Committed, Repeatable Read, snapshot and row lock:** belongs here. The section's brief asks a00 to introduce isolation as a question, and Figure 3 cannot be predicted without these terms. It gives only definitions; a19 still owns contracts and engine comparison, and a03 the levels' consequences.
- **Naming the serialisation failure (40001) in the Repeatable Read paragraph:** belongs here. The failure table in "From a request to a committed order" relies on it.
- **Write-ahead log definition and the `synchronous_commit` sentence:** belong here, as a minimum account of what an acknowledged commit means. The storage mechanism stays with the physical-storage and backup articles.
- **Replica and backup definitions before Figure 4:** belong here. Figure 4 compares exactly these two, and they are defined once rather than piecemeal.
- **Split deadline rows and the sentence on returning a connection with an open transaction:** belong here, as one-line outcomes. The mechanism stays with Building applications around a relational database and Managing connections and transaction lifetimes, which are linked.
- **Reworded NOT VALID advice and reading-route wording:** belong here, as corrections in place.

**a03**
- **Mapping paragraph and the new cast:** belong here. They are what makes the class example continue the introduction.
- **"Why store `remaining`" paragraph:** belongs here. It answers the question a03's own design raises, in three sentences, and hands the count-only design to a18 without doing a18's work.
- **Definition of a lock in "Put the whole change inside one transaction":** belongs here. Every later protection depends on it.
- **Predicate paragraph's new and moved rows, and the `FOR UPDATE` counting example:** belong here as the coverage argument a03's brief requires. The worked insert race stays with a18 and is linked.
- **Coverage clauses on each multirow protection, and the "Choosing a protection" table:** belong here. Choosing a protection is a03's own decision; the table sums up what the section has already shown, and a18 and a19 are not pre-empted. Its content needs one correction (teaching-10).
- **Figure 5 (deadlock, both lock orders):** belongs here. The a03 brief asks it to follow a deadlock to rollback and explain consistent lock order. The figure shows one observed cycle and one queue, then hands the acquisition procedure, cancellations and capacity changes to a18, which owns lock ordering. It does not build a protocol.
- **Move listing with its R8 guard, and the repeated-move paragraph:** belong here. They correct a03's own listing, and the paragraph is the minimum the listing needs to be right.
- **Retry exception for 23505/23P01 under Serializable:** belongs here, beside the retry rule it qualifies. Retry machinery remains with Recovering database requests safely.
- **Capacity-check result table:** belongs here. It shows the reader what a passing check looks like.
- **Reason for choosing the coordination row:** belongs here. It is the judgement the closing argument exists to state.
- **Closing paragraph applying the argument to the shop:** belongs here. a04 relies on this argument by name, and a03 is the article that owns it.

## Findings

### teaching-9 · optional · a00, "The work behind a query", paragraph after the page-count table

Problem: The page-count table was turned so that sizes are columns and measurements are rows. The prose still says "The last column carries a second lesson. With an index on `customer_id` … at a million orders it still read about a thousand pages". The indexed lookup is now the last row; the last column is the million-order table.
Effect: A reader looking for the lesson scans the million-order column and finds every measurement there, not the one the sentence means. The confusion is small, because the sentence names the index and the million orders.
Repair: Say "The last row carries a second lesson", or name it: "The indexed lookup carries a second lesson".

### teaching-10 · required · a03, "Choosing a protection" table and the closing argument

Problem: The table's last row offers Serializable for "Any, including writers you cannot change", with "Run at Serializable and retry on 40001" as what every writer must do. The closing argument repeats it: "A writer that cannot be made to take the lock, such as a vendor's import tool, would point to Serializable instead." Yet the bullet just above the table says Serializable covers conflicts "only between transactions that all run at Serializable", and the article says every Serializable transaction needs a retry path. A writer you cannot change may run at the default level and may not retry.
Effect: The reader takes away a decision rule that fails in exactly the case it is offered for. A team that leaves a vendor import at Read Committed and puts its own code at Serializable has no protection against that import. If the import does run at Serializable but cannot retry, its refused runs are simply lost. This is the decision a03 exists to teach.
Repair: Reword the row as "Several rows, when some writer cannot take your lock", and keep "every writer must run at Serializable and retry on 40001". Add one sentence in the closing argument: a writer you cannot edit can often be made to run at Serializable by setting the default isolation level for the database role it connects as, but someone must still retry or rerun its refused transactions; if neither can be arranged, no protection in this table covers it, and the writer must be changed or kept out of the rule's tables.

### teaching-11 · optional · a03, closing paragraph applying the argument to the shop

Problem: The new shop paragraph says the order reduces "the mug's `available` count". In the introduction, the shop's products table and Figure 3 call that column `stock`, and a00's guarded statement reads `stock >= 1`.
Effect: The paragraph exists to reconnect the reader to the introduction's shop, and the reader meets an unfamiliar column name at that moment. It is a brief stall, not a misconception.
Repair: Use `stock`, as a00 does.

## Limits

As in d01, I read the figures from their step notes and the built text, not by playing them, so the layout and controls of Figure 5 are left to the visual review. Whether the setting a teaching-10 repair would mention behaves as described for a given tool's connection is a practitioner matter. I noticed in passing a paragraph nested inside another in a00's "Changing a live database" (`<p>PostgreSQL 18 offers …` inside the preceding `<p>`), which is outside this perspective and is left to editorial and the site check. I did not read the live a03, so I cannot say whether a19's instructor names were chosen to match it.
