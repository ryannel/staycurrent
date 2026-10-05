# Reading the relational collection in the browser

5 October 2026. Reviewed the working tree at `985e5f71da2e346faf322bf48765a3124c740cbf`.
The starting working tree was clean. The coordinator had read the review guidance
and its case histories; this is an informed reading, not independent blind evidence.
The independent sequential log is in [first-reader.md](first-reader.md).

I read every assembled article's prose, examples, captions and default controls in
the local Astro preview, in collection order. The audience is an application engineer
who can program but is learning relational design and SQL. I followed the opening
introduction into schema design, constraints, JSON, queries, pagination, boundaries,
concurrent updates, isolation and retries. I read the checkout essay afterwards.
The normalisation route redirects to a section of schema design; it is not another
article. The 25 planned routes share an outline template, not teaching to assess as
complete. Their status is clear in the map and switcher.

## Observations in reading order

| Reading point | What the reader can follow; friction at that point | Later answer or proposed treatment |
| --- | --- | --- |
| Introduction, tables and relationships | Table versus schema, identity versus physical position, and a purchase's historical price receive usable meanings. The four-record drawing gives the relationships a visible home. | Preserve the concrete €18 paid versus €20 current example. No need for a longer general opening. |
| Introduction, queries and indexes | The one-row join result connects matching IDs to an answer. The index explains sorted customer IDs and finding totals held in the table. The index figure uses O13 for C8, whereas the next article assigns O13 to C4. | This is a continuity problem between examples, not a broken join. Align the illustration or explicitly identify its independent sample. |
| Introduction, constraints through concurrent access | The empty order motivates transactions. Locks arrive because an earlier stock read is insufficient; ordinary and locking reads are qualified separately. | Preserve the transitions and the distinction between atomicity and coordinating a decision. Planned deeper reading remains labelled. |
| Schema design, dependencies and normal forms | Each transformation explains the fact it moves. Partial and transitive dependencies have business examples. The lossless split visibly demonstrates the wrong product/price pairs. | Keep the transformation drawings. An agreed-price column in the third-normal-form drawing could make the preserved purchase fact visible; it is already explained in prose. |
| Schema design, types and practice query | Types, units, precision, instants and missing values now receive sufficient explanations. The final receipt query uses table aliases before the query article explains them. | Treat the query as a preview with a brief alias/mapping explanation and an onward link. This need not become a SQL course inside modelling. |
| Constraints, rules and probes | The distinction between a valid type and a business rule is clear. The one-column quantity probe is easy to map. Multi-column positional INSERT examples require remembering the column order in a collapsed setup. | Use named columns for those examples, with one explanation of VALUES mapping. The transaction-boundary article already demonstrates a readable version later. |
| Constraints, deletion and concurrency | Restrict versus cascade and their limits are concrete. The unique-write schedule explains why two accurate prechecks do not reserve a code. The final empty-order example hands off to a larger operation. | Preserve these aids and limits. The composite-reference paragraph could benefit from one invalid crossed order/line example if readers cannot derive it. |
| JSON, row boundaries | Nesting a product's own description is reconciled with normalisation; shared supplier facts and independent offers give reasons to use related rows. JSON keys are explicitly distinguished from database keys. | Preserve this reconciliation. The row-boundary drawing explains more than another generic JSON illustration would. |
| JSON, extraction and rules | The operator meanings are explained, but the WITH/VALUES/cast syntax appears before its introduction in the query branch. The number check intentionally permits a fraction that the subsequent integer query/index rejects. | Add a short reading map for the diagnostic query. Finish the runnable path with compatible validation and conversion, or work through moving capacity to the already introduced typed details table. Accurately naming the failure is not yet a completed practical choice. |
| JSON, updates | Row locking and the benefit of jsonb_set are explained. To understand whole-object replacement losing an intervening change, the reader still has to reconstruct two early reads and two later writes. | A small before/read/write/result schedule is justified. Show the stale object's material overwriting another writer's new material; keep jsonb_set alongside it. |
| Queries, results through missing matches | The article teaches the clauses, aliases and row identities patiently. Ben's no-match row is distinguished from O14's real empty order. The cutoff-in-ON versus cutoff-in-WHERE examples show both absent and nonqualifying matches. | Preserve this pace and the Cara counterexample. Basic query meaning is well covered within the article's scope. |
| Queries, grouping, fanout and existence | COUNT(*) versus COUNT(line_no), empty SUM, wrong €88 and separate summaries all have exact results. EXISTS explains why a qualifying order appears once. | The static drawings already expose the necessary relationships. No new interaction is needed unless a specific prediction cannot be made from them. |
| Pagination, ordering and continuation | The need for a sequence precedes ORDER BY. Time ties, strict pair comparison, insert/delete/move cases and API token precision are explained. O14 changes from 11:00 in Queries to 12:00 here, without an explicit example reset in the main prose. | Mark the new pagination dataset before its starting table. This is a useful change for teaching ties; it should not appear to contradict the prior example. |
| Pagination, work and fixed exports | Index cost follows the access question. API token versus database cursor and live boundary versus stable values are clear. Paging orders with all their lines is recommended but not worked through. | Optional compact query/result example: select two order IDs, then retrieve all their lines. The cursor's Repeatable Read setting has enough local explanation before the isolation article. |
| Boundaries, checkout and rollback | A successful zero-row UPDATE is explicitly a branch, not an exception. Named INSERT columns, one connection, failed-block cleanup and rollback's scope receive clear explanations. | Preserve this worked example. Savepoints and the payment workflow are bounded onward questions rather than obligations to implement every detail here. |
| Concurrent changes, guarded update and locking read | Waiting after a stale decision is contrasted with waiting before deciding. Partial fulfilment explains why application logic might use a locking read. The wider rule across two bins earns the isolation handoff. | The current aids support the argument. A partial-fulfilment worked result would be useful practice, not a prerequisite for the shown one-mug mechanism. |
| Isolation, snapshots and writes | Ordinary statement views, transaction views, own writes and changed-row rejection are distinguished. The featured-display example changes subject from inventory but explicitly says it is a separate rule. | Preserve that explicit change of subject. The write-skew drawing and both possible serial orders teach the failure without relying on isolation terminology alone. |
| Isolation, shared control row | The reader must track a lock on one record, reads of two others, and the fresh subsequent statement at Read Committed. The existing four-step table exposes those relationships. | Keep the table and its Repeatable Read counterexample. An interactive version is optional; the current explanation does not need one to be complete. |
| Retries, waits through recovery | The reader can distinguish waiting, known rejection and missing commit reply. Stable K14, proposed O14/O15, intent comparison, retained results and a claim waiting on the original attempt all receive explicit reasoning. | Preserve the existing alternative-history drawings and branching pseudocode. A compact outcome-to-action reference could help recall this dense article, but must retain pending outcomes and whole-transaction retries. |
| Supplemental checkout | Alice/Bob and mug_42 establish a different scenario. The storage tour supplies pages, B-tree routing, versions and WAL at a faster pace than the focused sequence. It has its own model and directory entry, but no place in the collection switcher. | Give it an explicit optional worked-tour position and links to focused explanations. Do not insert it as a compulsory prerequisite or treat it as another continuation of the C4/P7 dataset. |

## Interactions observed

These checks used the Codex browser at its existing viewport and current dark theme.
They are observations of illustrative browser models, not concurrent PostgreSQL runs.

| Aid | Action and visible outcome |
| --- | --- |
| Schema history model | Correcting one copied name left one order showing Ada. Switching to a customer reference and correcting the name made both show Ada Noor with one update. Changing the catalogue to EUR20 kept O12's total EUR36. |
| Constraint probe | SQL NULL without NOT NULL was accepted with CHECK UNKNOWN. Adding NOT NULL rejected it while the CHECK still passed. |
| JSON value probe | JSON null retained a present key and JSON null under JSON extraction, while text extraction returned SQL NULL. The type was the text `null`. |
| Pagination model | Inserting O17 reported shifting positions without moving the saved boundary. Moving unread O14 across it reported that keyset does not freeze membership. |
| Concurrent-update model | The live initial state was step 0 of 5, committed stock 1 and purchases 0. The unsafe commit run ended with two purchases for one mug and stock zero. A conditional-update commit run ended with one purchase. A conditional-update rollback run also ended with one purchase, after the waiting request could proceed. |
| Isolation model | Three events at Read Committed returned EUR22 on the second read. At Repeatable Read the second read retained EUR20 while the committed catalogue was EUR22. |
| Supplemental checkout model | With both earlier reads at one, B waited while A held the lock, then committed a second order under the unsafe policy. Under the guarded policy B found no stock and created no order. |

I visually inspected the checkout model in its waiting state and the normalisation
section at the reading viewport. Controls were visibly separate from result data;
the normalisation drawing followed the preceding example. No warning or error was
reported in the browser log at the final inspection. This is not a full light/dark,
mobile, keyboard or assistive-technology review. The other static figures' text was
read in assembled page order; their complete visual layouts were not independently
validated here.

## What this pass says about the reading method

The collection needs an inherited-concept ledger and a separate example-state ledger.
Correct local explanations do not establish that an earlier SQL block is readable,
or that a reused identity still means the same thing. Optional closed setups should
be distinguished from the text visible on the ordinary reading path. Browser state
should supplement, rather than silently replace, a source or extracted-text reading.
Repair candidates should name the prediction they would enable and how to recheck it.
The independent extraction found a completed unsafe result in the concurrent-update
model's server markup. The browser's actual initial state resolves that uncertainty:
the script starts at step zero. Keep both observations; the static completed state
is not evidence that the live experiment opens at its ending.
