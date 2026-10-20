# Repair decisions · skill trial · d01

Coordinator: the session that arranged this trial, 20 October 2026. Version reviewed: 03f972f.
Reports: `practitioner.md`, `teaching.md`, `editorial.md`, `visual.md` (with screenshots) in this folder.

| Perspective | a00 required | a00 optional | a03 required | a03 optional |
| --- | --- | --- | --- | --- |
| Practitioner | 1 | 2 | 1 | 3 |
| Teaching | 2 | 1 | 1 | 4 |
| Editorial | 5 | 5 | 1 (shared layout) | 8 |
| Visual | 2 | 5 | 3 | 4 |

Distinct required problems after merging duplicates: a00 5, a03 5 (one of them shared layout text).

## Accepted · a00

| Findings | Decision |
| --- | --- |
| practitioner-1, teaching-2, editorial-1, visual-1 | Accepted. Raised by all four perspectives. The section 1 table has three rows; the transaction answers the first two and not the concurrency problem in the third. |
| teaching-1, editorial-3 | Accepted. Before Figure 3, explain isolation level, snapshot, row lock and serialisation error in two or three plain sentences. |
| editorial-4, teaching-3 | Accepted. Explain the write-ahead log and the replica before the durability paragraph and Figure 4 rely on them. |
| editorial-2 | Accepted. Replace "contextual articles", "working-route articles" and "parent" with reader terms, and make the route advice agree with the "Read the collection" box ("Start with this introduction. Then read each longer article before the shorter articles that follow from it."). |
| visual-2 | Accepted. Figure 1's key-path highlight and Figure 3's changed-value mark must reach 3:1 in both themes. |
| practitioner-2, practitioner-3 | Accepted. Split the deadline row into before COMMIT and during COMMIT, and mention returning a connection with an open transaction. Add "once no old code is running" to the NOT VALID advice. |
| editorial-5 to 9 | Accepted. Refer to sections by heading, not number; cut repeated "verification run/script" from the body (keep it in Sources); untangle the compressed sentences; one name for an order line; link names match article titles. |
| visual-3 to 7 | Accepted. Name SQLSTATE codes in words beside the code; one value per cell in the page-count table; explain or remove the order 104 gap; say "beside" or "below" correctly per layout, or neither; no sideways scrolling at 375 px. |

## Accepted · a03

| Findings | Decision |
| --- | --- |
| practitioner-4 | Accepted. Correctness. The move listing must lock and recheck the reservation, or make its update conditional on the reservation still being in the source class. Add a concurrent repeated-move case to verify.mjs with capacities that would expose the bug, and amend the closing argument. |
| teaching-4, practitioner-7 | Accepted together. Show the observed deadlock as a compact step table (or a figure option), with the consistent-order run beside it, and restate the starting rows. Keep it to the principle and the observed result, and hand the full protocol to a18. |
| visual-8, teaching-5, editorial-11 | Accepted. Tariq is the rival customer across the collection (a02, a14, a15, a18, a19), so keep Mina and Tariq as the two customers and give the instructors other names. Do not call the classes "the shop from the introduction". Say once what each part stands for in the shop (`remaining` for the mug's stock, a reservation for an order line), and end with a short paragraph that applies the correctness argument to the shop's order, items and guarded stock reservation, which a04 expects this article to supply. |
| visual-9 | Accepted. Figure 1's `classes` table must fit its box at every width from 375 to 1280 px without clipping a header. |
| visual-10 | Accepted. Figure 4's dimmed caption to 4.5:1 and the uncommitted-version outline to 3:1, in both themes. |
| teaching-6, teaching-7, teaching-8 | Accepted. Say why `remaining` is stored beside the booking rows; gather the criteria for choosing a protection in one place and say why the closing argument picks the coordination row over Serializable; show or drop the insert-of-an-unseen-row test. |
| practitioner-5, practitioner-6 | Accepted. Correct the retry rule for unique and exclusion violations under Serializable, citing the docs; say which protections cover a new row or a row moved into the class. |
| editorial-12 to 17 | Accepted. Plain heading for "A steady view does not prove the rule"; the retry section's heading covers deadlocks; explain or replace "fixture", "predicate", "workshop" and define "lock" at first use; untangle the deadlock-ending sentence; one meaning of "illustrative" (a model, not a run) consistent with a00; remove notes about how the article was made. |
| visual-11 to 14 | Accepted. Step counter and row labels agree; the deadlock listing wraps or shortens so its guard is visible; show owners on the double-click bookings; show the final check query's result. |

## Shared layout (coordinator)

| Finding | Decision |
| --- | --- |
| editorial-10, "planned articles are marked below" | Accepted and repaired by the coordinator in `src/layouts/RelationalNext.astro`: the sentence appears only when some listed article is still planned. |
| editorial-10, draft banner and "Draft available" labels | Rejected. The review route is for reviewers, and these labels say truthfully what it is. |
| editorial-18, breadcrumb skips the parent | Deferred. Shared layout behaviour for every draft; not part of this trial. |

## Not a finding

Editorial noted that the trial a00 links to the live a03 path. That is the trial's setup: each trial page links to the live collection so it can be read alone. Every anchor the live tree uses still resolves in the trial a03.
