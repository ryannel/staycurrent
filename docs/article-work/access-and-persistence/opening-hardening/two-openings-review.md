# Bounded independent reading of two openings

Artifact: assembled HTML text in `/private/tmp/opening-hardening/current-reading/`, identified by `manifest.json`. This is an HTML extraction reading, not a rendered browser or interaction review. The manifest marks each article's chunks 01–04 as its header and three introductory paragraphs and chunk 05 as its first section. I read both openings, recorded the following observations, and only then requested either first section. I did not read author history, previous reviews, later sections, or implementation source.

## How a query runs: opening observations

Audience: a developer who knows basic SQL joins and grouping but not query execution. Read chunks 01–04.

The opening supplies an explanation I can use. SQL states a result; the database chooses operations that produce it. The first paragraph names an execution plan and gives its concrete contents: reading, joining, grouping and sorting. The second paragraph explains why this choice matters by contrasting repeated index lookups with reading tables and making a temporary lookup. I can explain why a plan that is economical for a few matches can become costly for many: its work repeats. I can also explain why a short final result does not establish that little work happened along the way.

The third paragraph establishes that PostgreSQL chooses using estimates. It distinguishes inspecting a chosen plan with EXPLAIN from running the query with EXPLAIN ANALYZE, then connects that comparison to three things worth investigating: accumulated rows, repeated work and inaccurate estimates. These are taught relationships, not just a list of future topics.

What is promised or still unknown: I cannot yet read a printed plan, recognize the operations in one, calculate their work, or decide whether an estimate is wrong enough to matter. Those are natural next questions, not missing prerequisites for this introduction. The opening does assume the rough idea of an index lookup. The comparison supplies enough of its role here—finding matching rows individually—that I did not need an explanation of index internals to follow the argument. It also assumes the reader understands equivalent join results, consistent with the stated audience.

No blocking inference or concrete factual concern arose in the opening. The comparison of a few searches with thousands preserves the conditional word “may”; it does not claim that one join strategy always wins at a fixed count.

## Storage and durability: opening observations

Audience: a developer who knows tables, simple queries and the purpose of transactions but not storage internals. Read chunks 01–04.

I can now explain the relationship between a table and its storage: rows and columns are the presented structure, while PostgreSQL keeps a physical arrangement in files and reads parts into memory. The first paragraph gives that arrangement three consequences: reading for queries, room for inserts and work required by updates.

The second paragraph explains why durability requires more than modifying memory. It defines the promise around a committed transaction, gives the ordering constraint—save sufficient recovery information before acknowledging success—and explains that this information can be a change log instead of completed table files. The third paragraph applies that mechanism to PostgreSQL's ordinary logged tables, explicitly permitting later table writes and explaining the log's recovery role. I can describe the basic crash case: a committed change absent from table files can be reconstructed from the saved log.

What is promised or still unknown: the physical arrangement within files; how the log represents changes; the exact recovery procedure; and how settings or failed storage limit recovery. The first three are natural questions, and the last is explicitly deferred to the final section. The dependency on surviving storage and correctly saved writes prevents the opening's durability statement from sounding like a guarantee against destroyed storage. The stated audience can supply the meaning of a committed transaction; no storage expertise is needed to connect the steps given here.

No blocking inference or concrete factual concern arose in the opening. The phrase “ordinary logged tables” narrows the claim without requiring the reader to understand alternatives at this point.

## How a query runs: first-section transition

Read chunk 05, “The example query,” after saving the opening observations. The transition provides the concrete answer that the execution plan must preserve. This follows naturally from the opening's claim that different operations can produce the same answer: before inspecting those alternatives, the reader can establish what the query means.

I traced customer 42's ten orders to 30 joined lines, then to three grouped totals. Each order contributes quantities 1, 2 and 3, so the ten orders produce totals 10, 20 and 30. Sorting descending produces the printed product order 3, 2, 1. The supplied data and the stated SQL prerequisites are enough for that trace. The final sentence then returns to the open question of execution: which table comes first, and how does PostgreSQL locate matches?

The setup explicitly distinguishes this dataset from both earlier receipt examples and the Indexes shop. That prevents a reader arriving through the collection from silently carrying over old row counts or product meanings. The index paragraph provides the two available lookup routes before the query appears. Its statement that the compound primary-key index can locate an order's lines together gives enough functional meaning for this stage; how its column order permits that lookup remains onward curiosity.

No blocking explanatory or concrete technical concern arose within this bounded section. I have not attempted the practice setup or inspected its linked/generated content, so this does not establish that the setup executes successfully. No plan output has yet appeared; the transition prepares for it without requiring the reader to interpret unexplained plan notation.

## Storage and durability: first-section transition

Read chunk 05, “Rows and pages,” after saving the opening observations. It takes up the physical-arrangement thread of the opening immediately: a single requested price leads to the page that contains its row. The durability mechanism is waiting for later sections, but the opening has already supplied its causal outline, so this first section does not force the reader to hold an unexplained durability promise.

The concrete trace is complete: the query requests P7's price, P7 is stipulated to be on page 12, and PostgreSQL reads that page into shared buffers if absent. The extracted illustration labels both the file page and buffered page with P3, P7 and P9 and gives the result 20.00. The following paragraph explains the consequence of having moved the entire page: the other two products are available for subsequent reads. The final comparison with three separate pages gives an understandable reason why physical placement affects read work.

The distinction between shared buffers and the operating system's file cache is useful and locally explained. It prevents “not in PostgreSQL's memory cache” from silently becoming “read from the drive.” “Heap” is defined where introduced; locating the row by index is deliberately stipulated, so understanding index internals is not required to follow the page read.

Two terms open later questions without blocking this trace. Row headers contain transaction information, and the text explicitly defers why there can be several stored versions. TOAST raises the exception that large values may live elsewhere; the text supplies both its function and its immediate consequence. These are bounded explanations rather than unexplained prerequisites.

The extracted illustration repeats the row contents in both places, which supports the whole-page transfer. I cannot establish its visual layout, legibility or loading from text extraction. No interaction behaviour was reviewed.

No concrete factual or writing defect requiring repair emerged from this section. The final column-store comparison is a plausible onward reading prompt: what changes when a query reads one column across many rows? It does not need expansion to explain this article's page example.

## Scope and revision check

All ten reviewed chunks matched their manifest SHA-256 hashes when checked after reading. Conclusions apply only to these openings and first sections. They do not establish the quality of later explanations, rendered media, practice execution or novice comprehension in a human session. There are no consequential repairs to recommend within this bounded reading.
