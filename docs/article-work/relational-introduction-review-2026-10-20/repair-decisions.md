# Repair decisions · a00 Relational databases · c01

Coordinator: the session that arranged this review, 20 October 2026.
Reports: `c01/practitioner.md`, `c01/teaching.md`, `c01/editorial.md`, `c01/visual.md` (with `c01/visual-first-reading.md`).

| Perspective | Verdict | Required | Optional |
| --- | --- | --- | --- |
| Practitioner | pass | 0 | 4 |
| Teaching | repairs required | 1 | 4 |
| Editorial | repairs required | 3 | 10 |
| Visual | repairs required | 3 | 5 |

## Accepted

All required findings are accepted.

| Finding | Decision and reason |
| --- | --- |
| visual-1 | Accepted. The shop table is the reader's first picture of relational data and shows the wrong one. Replace it with small connected tables under real column headings, using the rows the article relies on later (Mina, Arun, orders 101 and 102, both items of 101, MUG and TEA stock), with keys marked and foreign keys drawn or made visible. |
| visual-2 | Accepted. Figure 4 should look up a customer's orders by `customer_id` over rows in arrival order, matching the index the prose names. |
| visual-3 | Accepted, together with editorial-3. Figure 5's early branch must not contradict itself, its step labels must fit each branch, and the old application's next order must appear. The caption and prose must agree about where existing orders' delivery instructions come from. |
| teaching-1 | Accepted. The two-buyer race is the hardest idea and needs to be shown: both buyers read 1 and write 0 under read-then-write; under the conditional update, the second waits, rechecks and changes nothing. Keep it compact and labelled as illustrative, citing the recorded PostgreSQL 18.6 observation. Leave isolation-level comparisons to Making concurrent changes correct. |
| editorial-1 | Accepted. Replace planning language ("main article", "working case", "deeper links", "parent articles", "contextual detail") with reader terms. |
| editorial-2 | Accepted. Define the primary (the server that accepts changes), replica, promotion and failover at first use; stop using "writer" for three things. |
| editorial-3 | Accepted with visual-3. |
| practitioner-1 | Accepted. Correctness of Figure 3's text: rollback happens when the server learns the session has ended; until then the open transaction keeps its locks. One clause on limiting idle open transactions. |
| practitioner-2 | Accepted. One clause: engine defaults differ (InnoDB defaults to Repeatable Read). |
| practitioner-3 | Accepted. One sentence: even a quick schema change waits for a strong lock and requests queue behind it, so set a short lock-wait limit. |
| practitioner-4 | Accepted as one or two sentences on routine upkeep, handed to the maintenance article. |
| teaching-2 | Accepted. Show the order 103 transaction as one listing and explain `SET` and `RETURNING`. May be combined with teaching-1. |
| teaching-3 | Accepted. Close the payment thread for order 103 in two or three sentences or a small state table. |
| teaching-4, visual-5 | Accepted. Figure 3 should end on a step that shows something new (R103 stored, the lookup result, and the retry with R103). Figure 6's last step should mark the chosen recovery copy. |
| teaching-5, editorial-6 | Accepted. Gloss or drop "pages and indexes" in the tables section; settle one name each for reserving stock, items, constraints, backups and the background worker; tie "waiting for payment" to `pending_payment`. |
| editorial-4, 5, 7, 8, 9, 10, 12 | Accepted. Plain-wording repairs; the reviewer's alternatives are suggestions, not required text. |
| editorial-11 (heading only) | Accepted in part: rename "Keeping the service and its data" to a heading that says what the section covers. The coordinator updates the registry and coverage-map titles to match. |
| editorial-13, visual-8 | Accepted. Phrase every route-table row as a job and remove the doubled Working with SQL. |
| visual-4 | Accepted. Mark changed values (including stock 1 → 0) and let the last step labels follow the branch. |
| visual-6 | Accepted. Holds of 34–42 s per step come from timing the whole visible text at 180 words a minute. Time each hold from the text that changed at that step, with a sensible floor, so a reader can follow without waiting minutes. Pause remains available. |
| visual-7 (labels only) | Accepted: split `qty × price` into its two values, fix "1 grouped rows", mark matched rows. |

## Rejected

| Finding | Reason |
| --- | --- |
| editorial-11 (anchors) | Anchors are the stable destinations recorded in the registry and coverage map and may already be shared from the live draft. Readers rarely see them; changing them costs link stability for little reading benefit. |
| visual-7 (phone height) | Collapsing or reflowing Figure 1's source tables on phones is a layout redesign with a small gain; the figure is usable by scrolling and nothing overflows. |

## Disagreements between perspectives

None directly conflicting. Practitioner passed with optional additions, while teaching asked for a new figure. Both add length to an introduction; the writer is asked to keep each addition to the size stated above so the introduction does not grow into its children's material.

## Coordinator repairs outside the writer's files

- editorial-1, "Read the collection" box: this text comes from the shared draft layout, `src/layouts/RelationalNext.astro`, not from a00. The coordinator replaced both of its sentences with reader terms. It changes the same box on every relational draft page.
- editorial-11 heading: the coordinator updates the registry and coverage-map title once the writer reports the new heading.
- Order 104 in Figure 5's invented data now belongs to customer 2 (Arun), matching Figure 3; customer 1's orders and pages are unchanged. Coordinator edit to scenes.mjs.

# Recheck at c02

All four perspectives pass at c02 with no required findings; every accepted c01 finding is confirmed fixed. Reports: `c02/practitioner.md`, `c02/teaching.md`, `c02/editorial.md`, `c02/visual.md` (with `c02/visual-first-reading.md`). Finding numbers restart in each c02 report.

| Perspective | Verdict | Required | Optional |
| --- | --- | --- | --- |
| Practitioner | pass | 0 | 2 |
| Teaching | pass | 0 | 3 |
| Editorial | pass | 0 | 7 |
| Visual | pass | 0 | 4 |

## Accepted for one narrow repair round (c03)

The optional findings are small and several are raised by two perspectives, so they are worth one more short pass.

| c02 finding | Decision |
| --- | --- |
| teaching-6, editorial-1 | Accepted. Explain "lock" once, at Figure 3's wait, in plain terms. |
| teaching-7 | Accepted. Links should send a reader to the longer article before its shorter follow-ups, as the introduction asks. |
| teaching-8, practitioner-6 | Accepted. No order number may contradict an earlier figure (order 104 is refused in Figure 3's conditional path). Show where the purchase-attempt identifier is stored, and label the order 103 listing so it does not claim to be the whole transaction. |
| editorial-2 to editorial-7 | Accepted. Wording repairs, including "session" at first use and a plainer evidence sentence in Sources. |
| practitioner-5 | Accepted. Record the Figure 4 and Figure 6 statements that were run, with versions, in a c03 source record in this folder, or add them to verify.mjs. The earlier polish folder's sources.md is a historical record and stays unchanged. |
| visual-1 | Accepted. Column headings should not break inside a name at phone width. |
| visual-2 | Accepted. Make the roll-back case of the order 103 listing readable at 375 px. |
| visual-3 | Accepted. Bring warning, NULL and dimmed-row text to at least 4.5:1 in the light theme within a00's components. |
| visual-4 | Accepted. Explain the foreign-key underline, and make Figure 2's caption cover the mismatch outline. |

# Recheck at c03

Practitioner, teaching and editorial pass at c03; all accepted c02 findings are confirmed fixed (`c03/` reports). Three optional one-phrase findings were applied directly by the coordinator, since they change wording only:

- c03 editorial-1: "Its follow-up, …" became "One of its follow-ups, …" in the three moved link sentences.
- c03 editorial-2: Figure 4's caption now says "The shop stores R103 in a new purchase_attempt column on orders, which has a unique constraint."
- c03 practitioner-7: "Even a quick change, such as adding an optional column, usually needs a lock that blocks all other use of the table."
