# Repair v2

Fresh repair assignment: `assignments/repair-v2.txt`. Accepted batch: D1–D5 in `decisions.md`. Work was confined to the new introduction/component namespace and the records named here. No earlier experiment/draft, other experiment outcome or unrelated history was read. No reviewers/subagents, builds, servers, commits, pushes or publication were arranged by this writer.

## Input and calibration

The whole current introduction was read before the accepted findings. The repair then used the current revise, write, figures and continuity skills with `reader-outcomes.json`, `example-facts.md` and `child-reading.json`. All three exact unabridged rendered-text references were read in bounded separate calls: Sequences lines 1–110, 111–270, 271–420, 421–552; Indexes 1–145, 146–290, 291–452; Storage 1–140, 141–280, 281–416. Their provenance is `reference-reading/manifest.json`.

Relevant finished drawings were inspected at port 4350 before designing the repair: the first booking sequence with its accompanying explanation; Indexes' construction and final mapping from sorted entries to table rows; and Storage's page-filling drawing from empty to its final filled state. The direct matching and one visible mechanism at a time informed the repair. These observations describe this repair's reference exposure, not the original author's.

## Repair and exact changed scope

| Decision | Repair | Scope for fresh confirmation |
| --- | --- | --- |
| D1 | Added `ProductTable.astro`: one three-column products table, an outlined P7 row, a labelled stock column and a written reading of the row. The prose establishes the single table before introducing customers, orders and order lines. Rebuilt `ShopFacts.astro` as selected rows on an explicit identifier path: customer 1 → order customer 1; order 103 → its two lines; line 1's P7 → the mug row. | Reread the complete opening through the subsequent SQL section. Judge whether row/column meaning is established and whether following actual matching values carries the relationship. Do not restrict confirmation to legibility. |
| D2 | Both opening figures show the coherent accepted-order moment: order 103 and its two lines exist; stock is P3 10, P7 0, P9 4; the order remains pending/unpaid. Added `productsAfter103`, deriving display counts from starting stock and the existing order lines. The purchase section now explicitly rewinds before 103 or its lines exist, with stocks 12 and 1, before describing the atomic change and race. | Follow state through both opening figures, the history result, the purchase section, both race histories and the commit explanation. Protected outcome agrees with the opening. |
| D3 | Replaced the final duties checklist with the history request: a correct query for another customer's identifier can still disclose the wrong person's orders, so the application must identify/check its caller. Explained parameter values as separately supplied data. The following reading route now gives schema changes a cause: old/new callers coexist while the shop changes tables. | Read the whole request section in its durability/application-boundary argument, including its new return to the history query and the next distribution section. The short-transaction/timeouts/connection-release checklist was cut; working detail remains with application SQL. |
| D4 | Race caption now says that both outcomes were also reproduced in PostgreSQL 18, alongside its explicit illustration/no-live-database statement. | Caption and Sources together must preserve the execution/illustration distinction in reader language. |
| D5 | Replaced the four generated race `h3` labels with styled paragraphs. Updated the corresponding styles so buyer state paragraphs retain their own dimensions. | Heading outline and text history/buyer labels on the draft itself. |

The first section was restructured more widely than a line-level wording repair: its original four-table encounter was split into two figures with intervening prose, and order-line meaning is introduced before the relationship figure. Selecting fewer rows removed Edda from that figure, so the foreign-key paragraph now introduces her through the shop registering a customer without a purchase. The price paragraph refers to the new Figure 2. Race/commit numbering, their in-prose references and the race control group label changed to Figures 3/4. The new stock-column boundary was strengthened during rendered checking. No other section's exposition was restructured.

The article's overall route remains facts → query/result meaning → atomic/concurrent purchase → engine work → durable commit → application request → copies/partitions → recovery → initial choice. The new opening supports the unchanged joined SQL and answer; this is a dependency of the wider opening repair, not an additional accepted first-SQL finding.

## Claims and sources

- No SQL listing, native fixture, stock protection rule, race state/event or native verifier changed. The new display state agrees with the already observed protected result. Existing query/multiplication results remain the same.
- The customer-ID substitution is an explanatory consequence of the existing `WHERE o.customer_id = 1` query and unchanged customer/order ownership; no new native result is claimed or presented.
- The D3 passage now explains the previously listed permission/parameter duties. Primary sources consulted directly on 23 October: PostgreSQL 18 [Command Execution Functions](https://www.postgresql.org/docs/18/libpq-exec.html#LIBPQ-PQEXECPARAMS), particularly separately supplied parameter values and statement text; and OWASP [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), particularly identity versus permission and checks on every request. Added those links to Sources. The schema-coexistence claim was already present; its reading route is now causal.
- `native-check.json`, `mechanical-receipt-v1.md` and `mechanical-limits-v1.md` were read solely for applicability. Current mechanical observations and limits are separate in `evidence/repair-v2-mechanical-receipt.md`; current source/dependency hashes and static data comparisons are in `evidence/repair-v2-data-check.json`. No unchanged evidence was copied into a new native run.

## Complete reread and continuity

The complete repaired source was reread in bounded calls. After the last two edits, the complete final rendered article was reread as two untruncated slices, including contents, captions, labels, SQL and Sources; both expanded race histories were also read. This is the writer's continuity pass, not an independent final complete reading.

The newcomer first sees one product per row and one attribute per column, then sees what the other tables' rows mean before matching their identifiers. The same P7 row carries from the first table to the end of the identifier path; the two price meanings still differ. Mina remains customer 1; Tariq is customer 2 and the losing buyer; Edda has no order. Order 103 has one P7 and two P3 at agreed prices 20.00/4.50, total 29.00, and no payment. The SQL answer remains one row per line and four rows across two orders. The explicit rewind restores the stocks and removes 103 before the purchase. The race's protected terminal state returns to the illustrated accepted-order moment. Its unsafe branch remains the labelled alternative, not a second simultaneous truth about that moment. The later commit/retry/replica/recovery passages still refer to that same identified purchase and distinguish record survival, reply receipt and read freshness. Terms and all child-reading routes were checked against the provided scope metadata. No example extension or unresolved shared-fact dependency is proposed.

## Actual milestones and return

- First recorded clock during the repair: 17:25:16 UTC, after complete input/reference text reading and relevant browser reference inspection.
- Initial source batch sent to root for preview, followed by the Edda/caption continuity adjustment; root supplied r06 on port 4362.
- Final two-edit source batch completed by 17:35:48 UTC: stock-column contrast and D3 sender wording. Root supplied r07. No later source edit.
- Final source hashes recorded at 17:38:13 UTC. Browser System/default restoration was confirmed before the final whole-article reading; no later theme/viewport change was made.

The repair is ready for the coordinator's fresh confirmations. Mechanical limits are recorded in the separate receipt. No publication is authorised by this repair.
