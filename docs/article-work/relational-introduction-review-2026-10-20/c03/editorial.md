# Editorial review · article · a00 Relational databases · c03

Inputs read: the rendered c03 page (`c03-site/review/relational-next/index.html`) and the strings in its figure scripts (`RowsFigure`, `OrderFigure`, `RaceFigure`, `DecisionFigure` and `models`), each compared line by line with c02; the intended audience as stated in the assignment; my c02 report; the coordinator's list of changes. Withheld and not read: a00's plan, context files, coverage maps, the writer's notes, the repair decisions, other perspectives' reports, the a00 source and anything else under `docs/article-work/`.
Verdict: pass

## Checks

This narrow recheck covers only text that changed between c02 and c03. That includes: the seven c02 repairs; the lock definition; the `purchase_attempt` column in the prose and the Figure 4 caption; the relabelled order 103 listing and the COMMIT and ROLLBACK sentences now beside it; the moved follow-up links; the Figure 2 and table-figure legends; the renumbered orders in Figures 5 and 6.

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | not applicable | No heading changed. |
| Plain sentences | pass | The lock-wait advice is now three short sentences. The upkeep and provenance passages read plainly. The new COMMIT and ROLLBACK sentences under the listing are clear. |
| Terms | pass, with an optional finding | "Lock" is defined where Figure 3's wait happens, and later uses agree with it. "Session" and "payment-request identifiers" are fixed. `purchase_attempt` is named in both places it appears. "Its follow-up" implies a single follow-up article where there are several (editorial-1). |
| Openings | not applicable | No section opening changed. |
| Reader-facing text only | pass | The provenance sentence now says plainly what was run and what it showed. |
| Captions and labels | pass, with an optional finding | The Figure 3, 5 and 6 captions and stage labels are fixed. The new Figure 2 legend says what each outline means. One phrase in the Figure 4 caption attaches ambiguously (editorial-2). |

### c02 findings

| c02 finding | Result at c03 |
| --- | --- |
| editorial-1 lock | Fixed. The paragraph after Figure 3 now says "her transaction takes a lock on that row: a claim that stops other transactions changing it until hers commits or rolls back". Figure 3's row reads "reaches the locked MUG row". The schema-change advice is split into "needs a lock that blocks all other use of the table. While it waits for that lock, ordinary requests queue behind it. Give the change a short lock-wait limit…". |
| editorial-2 Figure 6 labels and "writers" | Fixed. The stages read "Old version places an order" and "Old version places another order", and the staged path reads "Replace old version, convert rows". The control reads "Once every version sends it and rows are filled", and the prose and text alternative say "every application version". |
| editorial-3 Figure 3 | Fixed. Mina's row reads "one row changed and returned, with available = 0; not committed, and the row is now locked". The caption is a full sentence that points below the figure for the explanation. |
| editorial-4 upkeep paragraph | Fixed. It explains old row versions, `VACUUM`, the planner's statistics with `ANALYZE` and the effect of an open transaction, each in its own sentence. |
| editorial-5 paragraph after Figure 3 | Fixed. The material is now three paragraphs: the outcome and the lock, Read Committed, then other engines and the `CHECK` guard. |
| editorial-6 provenance | Fixed. The sources say "Separately, we ran the shop’s rows, the SQL results, the order 103 listing and the outcomes shown in Figures 2, 3, 4 and 6 on a PostgreSQL 18.6 server; each gave the result the article shows." The Figure 6 caption says "Both rejections were reproduced on PostgreSQL 18.6". |
| editorial-7 session and payment references | Fixed. "other sessions (other connections to the database) do not"; "stock reservations and payment-request identifiers". |

## Findings

### editorial-1 · optional · the moved follow-up links in three sections

Problem: Three link sentences now read "Its follow-up, Managing connections and transaction lifetimes, sets the pool and idle-transaction limits.", "Its follow-up, Changing schemas without breaking applications, sets lock-wait limits for PostgreSQL." and "Its follow-up, Maintaining and upgrading a relational service, makes upkeep routine." The collection list shows four, three and five follow-up articles under those longer articles.
Effect: "Its follow-up" tells the reader there is just one. When they reach the longer article and find several, the sentence turns out to have been misleading. The effect is small.
Repair: "One of its follow-ups, Managing connections and transaction lifetimes, …", and the same in the other two sentences.

### editorial-2 · optional · Figure 4 caption

Problem: "Two illustrative paths for purchase attempt R103, stored in the purchase_attempt column the shop adds to orders under a unique constraint." The phrase "under a unique constraint" can attach to "orders" ("adds to orders under a unique constraint") rather than to the column.
Effect: The reader may pause over which thing the constraint covers. The prose above the figure makes it clear, so the cost is a brief pause.
Repair: "Two illustrative paths for purchase attempt R103. The shop stores R103 in a new purchase_attempt column on orders, which has a unique constraint."

## Limits

Only changed text was read closely, as the coordinator asked. Unchanged text was not reviewed again. Figure text was read from the script strings for every option, not by playing the figures. The contrast changes and the new outline colours in Figure 2 are for the visual perspective. Whether the wording of the technical changes is correct (the purchase-attempt retry, the renumbered orders, autovacuum) is for the practitioner perspective. On wording alone, the renumbered orders read consistently: order 104 is explained as refused in both the Figure 5 caption and its first step, and Figure 6 now uses orders 114 and 115.
