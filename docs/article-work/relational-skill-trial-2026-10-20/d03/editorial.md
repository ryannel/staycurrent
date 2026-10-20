# Editorial review · article (narrow recheck) · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · 5a49e8c, round d03

Inputs read:
- The rebuilt rendered pages: dist/review/relational-trial/index.html (a00) and dist/review/relational-trial/transactions/index.html (a03).
- How I read them: I extracted the text of each page, compared it line by line with the d02 build, and read every changed passage in context. Labels, captions and the "Read this figure as text" panels were included.
- docs/article-work/relational-skill-trial-2026-10-20/d02/repair-decisions.md.

Withheld as before: the plan, writers' notes, sources records, live drafts and the other perspectives' reports. I did not re-read the reference articles; my d01 reading stands.

Verdict:
- a00: pass. One optional finding remains: the "pages" half of editorial-20.
- a03: pass. One new optional finding (editorial-28); no required finding remains.

## Status of d02 findings

- **editorial-19 · fixed.** The text now reads "The last row carries a second lesson".
- **editorial-20 · partly fixed.**
  - Fixed: "replication lag" is now explained where it first appears ("how far a replica (described below) has fallen behind the primary").
  - Fixed: "pages" is now defined well ("fixed-size blocks, 8 kB each in PostgreSQL, that the database reads from storage or memory as a unit").
  - Not fixed: that definition sits in "The work behind a query". The commit paragraph in "Transactions and competing buyers" uses the word two sections earlier: "It copies the changed pages into the table files later".
  - Repair: write "It copies the changes into the table files later". The finding stays optional.
- **editorial-21 · fixed.** The Serializable row now reads "Several rows, when every writer can be run at Serializable". Its "What every writer must do" cell says how to set default_transaction_isolation for a program you cannot edit. The closing argument matches. One word in the closing argument is new: see editorial-28.
- **editorial-22 · fixed.**
  - The table lists protections under the Figure 3 control's names: "One conditional statement", "Unique constraint", "Lock the rows you counted", "Lock the class row first (coordination row)" and "Run at Serializable". The prose uses the same names.
  - The caption's added sentence ("The names match Figure 3's Protection control") is harmless, but it could go.
- **editorial-23 · fixed.**
  - Figure 5 now uses one name for each option, "Opposite lock orders", in both prose and control.
  - The one-option select is gone, and "victim" is replaced by "the transaction aborted".
  - The text summary now states the deadlock, which transaction was aborted, Tariq's refusal and Mina's rerun. "After step 5" matches the figure's displayed step numbers, which count the starting row as step 1.
- **editorial-24 · fixed.** The predicate paragraph is split in two. The second half introduces SELECT … FOR UPDATE before using it. Its observed example makes the gap concrete: class 22 at capacity 2, with three bookings for two places.
- **editorial-25 · fixed.** The text now reads "rolled back before it changed anything, so R8 was still in class 21". The listing comment reads "R8 has already moved".
- **editorial-26 · fixed.** The text now says how the application recognises the case from its own code: a transaction at Serializable that read the table to choose a new key, then inserted it. It also says that Tariq's repeated key is still a duplicate. "Exclusion error" no longer appears in the body.
- **editorial-27 · fixed.** The text now uses "its order lines" and "the mug's stock". The deadlock claim is now conditional: "If orders updated… in one agreed order… could not deadlock on each other's stock rows".

## Coordinator's correction: a00 Sources

a00's rendered Sources section does list both items:
- "PostgreSQL 18, Index types and Using EXPLAIN: B-trees, plans and buffer counts";
- "On this site, the eight articles this one introduces", followed by the eight titles.

My d02 note was wrong. I read that part of the page through a filter that dropped short lines, and both entries were among the dropped lines. Nothing is missing.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | No headings changed in this round. Figure 5's title and control label read clearly. |
| 2. Plain sentences | finding (a03) | The new passages are plain. One sentence in a03's closing argument contradicts the rule it follows (editorial-28). |
| 3. Terms | finding (a00) | Protection names are now consistent in a03. In a00, "pages" still appears before its definition (editorial-20, remaining part). |
| 4. Openings | pass | No section openings changed. |
| 5. Reader-facing text only | pass | No notes about how the articles were made were added. The draft banner remains, by the coordinator's d01 decision. |
| 6. Captions and labels | pass | Figure 5's caption, control and text summary now agree with the prose, and Figure 3's control names match the table. |

## Findings

### editorial-28 · optional · a03, "Check the argument with competing sessions", closing argument

Problem: The argument says a vendor's import tool "points to Serializable only if two things can be arranged". The two things are that the tool runs at Serializable, and that its refused runs are retried or rerun. The next sentence then says "If neither can be arranged, no protection in the table covers that tool". The rule needs both conditions, so the protection already fails when either one cannot be arranged. "Neither" suggests that one condition alone might be enough.
Effect: A reader whose tool can be set to Serializable but never retries may read "neither" and believe the tool is covered. The table row and the sentence before it say otherwise, so a careful reader will probably catch the contradiction. That is why this is optional, but it sits exactly at the decision point.
Repair: "If either cannot be arranged, no protection in the table covers that tool…"

### editorial-18 · deferred (unchanged)

The breadcrumb still skips "Relational databases". The coordinator deferred this as shared layout, and it is listed here only for completeness.

## Limits

- I did not play the figures in a browser. I read Figure 5's options and summary from the built page.
- This was a narrow recheck. Apart from the changed passages, I did not re-read the unchanged text of either page; the d02 assessment stands for it.
