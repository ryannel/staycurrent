# Editorial review · article · a00 Relational databases · c02

Inputs read: the rendered c02 page (`c02-site/review/relational-next/index.html`), including every figure's step text, stage labels, card text and outcome text from its bundled scripts (`RowsFigure`, `OrderFigure`, `RaceFigure`, `DecisionFigure`, `models` and `player`); the intended audience as stated in the assignment; my c01 report; the coordinator's message listing the accepted findings and the figure renumbering. The three reference articles were read in full for c01 and not reread. Withheld and not read: a00's plan, context files, coverage maps, the writer's notes (`writer.md`), the repair decisions (`repair-decisions.md`), other perspectives' reports, the a00 source and anything else under `docs/article-work/`.
Verdict: pass

## Checks

This recheck covers the checks the repair touched: every accepted c01 finding, and the wording of changed and added text. Added text includes the unnumbered table figure, the order 103 listing, Figure 3, and the new paragraphs on locks, idle transactions, lock-wait limits and upkeep.

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | "Running and recovering the database" names its section. The anchors were kept by the coordinator's decision, so they are not raised again. |
| Plain sentences | pass, with optional findings | Every sentence quoted in c01 editorial-4, 5, 8 and 9 has been rewritten plainly. Added text has two loose spots: the upkeep paragraph and the sources provenance sentence (editorial-4, editorial-6). |
| Terms | pass, with optional findings | "Writer" no longer collides. Primary, replica, failover, backup, reserving, constraint, item and background worker are each defined and then used consistently. "Lock" now carries added text without being explained (editorial-1); "session" and "payment references" are minor gaps (editorial-7). |
| Openings | pass | Transactions and the application section now open by saying what they cover and why. The new upkeep paragraph opens with a statement. |
| Reader-facing text only | pass | The introduction, the closing advice, the link sentences and the "Read the collection" box now speak to the reader. No planning language remains. |
| Captions and labels | pass, with optional findings | The Figure 6 caption now agrees with the prose, and every disclosure is labelled "Read this figure as text". Three added labels are worth tightening: Figure 6's "Old version orders" stages, Figure 3's "returns 0" and its caption's first line (editorial-2, editorial-3). |

### Accepted c01 findings

| c01 finding | Result at c02 |
| --- | --- |
| editorial-1 planning language | Fixed. The introduction now reads "Each section ends with a link to a longer article on its subject…". The closing reads "Read a longer article’s worked example before its shorter follow-ups." The link sentences use "Shorter follow-up articles cover…", and "before its detailed procedures" is gone. The box reads "Then read each longer article before the shorter articles that follow from it." |
| editorial-2 "writer" and Figure 6 terms | Fixed. The operations section defines the primary, the replica, promotion and failover before Figure 7, and the figure uses "Primary". The transaction wording no longer says "writer". Changing a live database now says "old application version"; its remaining "writers" are discussed under editorial-2 below. |
| editorial-3 Figure 5 premise | Fixed in Figure 6. The prose says "Existing orders have none stored in the database". The caption names the source: "from its courier records". |
| editorial-4 durability | Fixed. "Durability is the promise that a committed change survives a crash." The write-ahead log and asynchronous commit are now explained in place. |
| editorial-5 Read Committed | Fixed. The prose names "isolation levels" and follows Arun's UPDATE step by step. The `CHECK (available >= 0)` guard is shown, and the next paragraph opens with "That handles a rule about one row." |
| editorial-6 term drift | Fixed. Reserving is defined at first use. Items are called "items" throughout. `pending_payment` and "draft" are explained. Constraints are named. Figure 7 says "Backup". The background worker is defined. Indexes are deferred with a link, and pages are no longer mentioned early. |
| editorial-7 ambiguous words | Fixed. "the rows can come back in any sequence"; "Another session’s view"; "encryption keys, credentials". |
| editorial-8 compressed sentences | Fixed. All nine sentences were rewritten. |
| editorial-9 retry paragraphs | Fixed. The rewritten paragraph says plainly what to do and why: "A constraint error means the change did not happen…", then "the constraint is what stops a second order", then "ask the provider what happened before acting again". |
| editorial-10 openings | Fixed. |
| editorial-11 headings | Fixed in the part that was accepted (the section title). The anchors were kept by decision. |
| editorial-12 figure labels | Fixed. "Where customer 1’s orders are"; "Retired; its last requests finished"; "Choose what to recover from"; one disclosure label throughout. |
| editorial-13 reading-route table | Fixed. Every row is now a job, and row 1 gives one order. |

## Findings

### editorial-1 · optional · "lock" used across added text without explanation

Problem: The repair added several sentences that rest on locks: "An open transaction keeps its locks until it ends, so one checkout stalled inside a transaction can block every later buyer of the mug." Figure 4's step text says "until then the transaction keeps its locks, including the one on the mug’s row". Changing a live database says "Even a quick change must wait for a strong lock on the table, and ordinary requests queue behind it while it waits, so give the change a short lock-wait limit and retry rather than letting it wait indefinitely." Figure 3 also shows a lock without naming it: "Same UPDATE reaches the MUG row and waits for Mina’s transaction." The word itself is never explained.
Effect: The reader can guess that a lock blocks other work. They cannot connect Figure 3's wait, the stalled checkout and the queue behind a schema change as one mechanism, and "strong lock" means nothing to them. The lock-wait sentence is also long enough to need re-reading.
Repair: Name the lock once, where the reader sees it work, after Figure 3: "Arun's UPDATE waits because Mina's transaction holds a lock on the mug's row: a claim that stops other transactions changing that row until hers ends." In the live-change paragraph, split the sentence: "Even a quick schema change needs a lock that blocks all other use of the table. While it waits for that lock, ordinary requests queue behind it. Give the change a short lock-wait limit, and retry if the limit is reached."

### editorial-2 · optional · Figure 6 stage labels and the remaining "writers"

Problem: Two stages read "Old version orders" and "Old version orders again". "Orders" is meant as a verb, but in this article it is almost always a noun, so the label first reads as "the old version's orders". The control option "After writers and old rows are ready", the staged stage "Replace writers, convert rows" and the prose "waiting until the writers and existing rows are ready" still use "writers" for application versions. The rest of the figure now says "old application version".
Effect: The reader stops to work out the stage labels. "Writers" no longer collides with the database server, but it is an extra name for something the figure otherwise calls the application version.
Repair: Stages: "Old version places an order" and "Old version places another order". Control and prose: "After every application version sends it and old rows are filled". Stage: "Replace old version, convert rows".

### editorial-3 · optional · Figure 3 schedule text and caption

Problem: In the conditional schedule, Mina's first row reads "UPDATE … WHERE available >= 1: row changed, returns 0 (not committed)". The listing just above taught "one row back" against "no row back", so "returns 0" can be read as "returns no rows", the opposite of what happens. The caption opens with a fragment, "Read Committed, PostgreSQL’s default isolation level.", and so introduces the term before the prose explains it in the paragraph after the figure.
Effect: A reader comparing the two schedules can misread Mina's successful reservation as a failure. The caption's first line reads like a label rather than a sentence.
Repair: "UPDATE … WHERE available >= 1: one row changed and returned, with available = 0 (not committed)". Caption: "Both transactions run at Read Committed, PostgreSQL's default isolation level, explained below the figure. Each has already inserted its order and MUG item; only the stock decision is shown…"

### editorial-4 · optional · "Running and recovering the database", the new upkeep paragraph

Problem: "In PostgreSQL, updated and deleted rows leave old versions that `VACUUM` reclaims, and the statistics that guide query plans need refreshing. A transaction left open holds that cleanup back, so neglected upkeep shows up as storage growth and slower plans." Nothing earlier says that an update leaves an old version of the row behind, or what the planner's statistics are. The "so" joins two different causes, a transaction left open and neglected upkeep, as if the first explained the second.
Effect: The reader meets two new mechanisms in one clause. They have to work out how an open transaction relates to "neglected upkeep".
Repair: Something like: "In PostgreSQL, an update or delete leaves the old version of the row in place for a while, so that transactions already running can still read it. Routine cleanup, `VACUUM`, later reclaims that space, and the engine also needs fresh statistics about the data to choose good query plans. A transaction left open stops cleanup removing versions it might still need. When cleanup falls behind, for that or any other reason, tables grow and plans get slower." (The practitioner perspective should confirm how statistics are refreshed before this wording is fixed.)

### editorial-5 · optional · "Transactions and competing buyers", the paragraph after Figure 3

Problem: One paragraph now holds three topics in nine sentences. It summarises Figure 3's outcome, explains Read Committed step by step, warns that "MySQL’s InnoDB starts at Repeatable Read" and adds the `CHECK` guard.
Effect: The core explanation of why the conditional UPDATE is safe sits in the middle of a long paragraph, between a recap and two caveats, so it is harder to find on a second reading.
Repair: Split after "and roll back his order." Put the other-engines warning and the `CHECK` guard in a short paragraph of their own.

### editorial-6 · optional · provenance wording in the sources and the Figure 6 caption

Problem: The sources paragraph says: "Separately, on native PostgreSQL 18.6: the shop’s rows, the SQL results, the outcomes in Figures 2 and 3 with the order 103 listing, the two rejections in Figure 6 and the retry under a unique purchase-attempt identifier in Figure 4 were run and matched." The colon fronts a long list, "native" is unclear, the figures are listed out of order, and "matched" does not say what they matched. The Figure 6 caption says "Both rejections were checked with these statements on PostgreSQL 18.6", but the figure shows no statements, only a card reading "ADD COLUMN … NOT NULL".
Effect: The reader must reread the sentence to learn what was tested, and looks in vain for "these statements".
Repair: "We ran the shop's rows, the SQL results, the order 103 listing and the outcomes shown in Figures 2, 3, 4 and 6 on a PostgreSQL 18.6 server; each gave the result the article shows." Caption: "Both rejections were reproduced on PostgreSQL 18.6; the figure itself is a model."

### editorial-7 · optional · two small term gaps

Problem: "Session" first appears in the Transactions opening, "other sessions do not", without explanation. It then carries Figure 2's "Another session’s view" and Figure 4's "the server notices the session has ended". Separately, the recovery checklist says "check orders with their items, stock reservations and payment references", although the article introduced the term "payment-request identifier" for the same thing.
Effect: Both are small. A newcomer may not know that a session is one connection's conversation with the database, and "payment references" looks like a new thing.
Repair: At first use: "other sessions (other connections to the database) do not". In the checklist: "…stock reservations and payment-request identifiers".

## Limits

This recheck covers the accepted c01 findings and the wording of changed or added text. I did not re-review unchanged text beyond confirming that the repaired sentences sit well in their paragraphs. Technical accuracy, teaching order, coverage, the added length (the reading time rose from 16 to 19 minutes) and the drawn appearance of the new table figure and Figure 3 belong to the other perspectives. In particular, I could not see whether the table figure's arrows run the way its caption says. Figure text was read from the bundled scripts for every option and step, not by playing the figures in a browser. The review-route chrome was again treated as layout.
