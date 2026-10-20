# a03 trial: Making concurrent changes correct (writer record)

Trial page: `/review/relational-trial/transactions/` (article `src/articles/relational-trial/a03.astro`, components `src/components/relational-trial/a03/`).

Written from the a03 registry entry and its `nested_article` plan, with the skills `staycurrent-write` and `staycurrent-figures`. The current a03 draft, its components and its work folders were not read. The trial a00 was not read.

## What was built

- One running example kept from the introduction's shop: Mina (customer 1) and Arun (customer 2) book classes 21 (tea tasting, capacity 1) and 22 (mug painting, capacity 3, Arun already holds R7). Instructors Lena and Tariq carry (superseded in d01: customers are now Mina and Tariq, instructors Lena and Ravi) the multirow staffing rule for class 21.
- Three invariants stated up front (capacity, ownership, staffing) with acceptable outcomes and the list of writers; the final section returns to them as a correctness argument.
- All 18 registry anchors kept, plus `sources`. Headings polished; the contents list shows the level-2 sections.
- Links to a18 (locking) and a19 (isolation) where their subjects arise and again under further reading. Sibling links: a10, a17, a20, a22 (two anchors), a23, a04, a07, a29, a39.

## Figures, tables and listings

| Item | Kind | Status label |
| --- | --- | --- |
| Figure 1, `ClassTables.astro` | Static tables with PK and FK marks, and the three rules | Rows checked against the server |
| Figure 2, `ScheduleFigure.astro` mode `schedule` | Stepped schedule: last place or staffing, one after the other versus interleaved | Illustrative schedule, replayed on PostgreSQL 18.6 |
| Figure 3, `ScheduleFigure.astro` mode `protect` | Stepped schedule: three examples, nine protection options | Illustrative schedule, replayed on PostgreSQL 18.6 |
| Figure 4, `VersionFigure.astro` | Stepped row-version model: ordinary SELECT, FOR UPDATE or conditional UPDATE while A's change is pending | Illustrative model; outcomes observed |
| Tables | Savepoint endings; rules to constraints; isolation levels; what the application knows after each reply; durability by configuration; payment placement; check procedure (list) | Observed tables say so in their captions; the durability table is marked as documentation only |
| Listings | Two-statement failed attempt with server replies; one-statement conditional booking; ordered move; invariant check | Each ran as printed |

Every figure reads its data from `model.mjs`. `schedule-view.mjs` builds Figure 2 and 3 rows for both the server render and the browser script. Each interactive figure has a "Read this figure as text" block, `aria-live` explanation, and the shared stepper.

`verify.mjs` replays every schedule step by step in two psql sessions, confirms each blocked step through `pg_stat_activity` rather than a sleep, and asserts each reply and committed state against the model. It also checks the listings, endings, isolation-level table, single-statement retry, the deadlock and ordered moves, and the two lost-reply cases. Last run: passed (exit 0).

## Decisions

- Kept the stored counter `remaining` so that the conditional single statement could be taught as the simplest protection; a18 removes the counter and builds a locking protocol for the count-based rule, which matches its own text ("remove its remaining-place counter").
- Deadlock shown in prose and a listing rather than a figure, because PostgreSQL does not promise which transaction is the victim; the observed run is reported as one run.
- The lost-reply case was produced with a deferred constraint trigger that sleeps 1.5 s during COMMIT, and the client was killed 300 ms into it. The article says so.
- Durability table comes from documentation; not tested, and labelled.
- Figure styles use `<style is:global>` with selectors prefixed `figure.a03-…`. Scoped styles did not reach rows created by the browser script, and the RelationalNext draft rules (`.relational-draft table`, `th`, `td`, `[data-step]`) otherwise overrode the figure tables and the stepper's step counter.

## Stepper suggestion (not edited)

`src/components/figures/stepper.mjs` returns `{ render, stop }`. Figures whose options change the schedule need to return to step 0. Both a03 figures do this by clicking their own Reset control. A `reset()` in the returned object would make that explicit. Separately, `.relational-draft [data-step]` in `relational-drafts.css` styles any `[data-step]` element, including the stepper's counter; a more specific selector there would avoid the override each figure now needs.

## Checks

- Browser (pane hidden; viewport emulated): desktop 1280 px dark; 375 px light and dark. Figures 1 to 4 stepped through; option change restarts; keyboard Enter on Next advances; no horizontal page overflow at 375 px; no console errors. Contrast measured in light theme at 375 px: warning outcome 6.1:1, changed state 8.8:1, caption 6.1:1.
- Not checked: screen-reader announcement order; Play timing over a full run; dark-theme contrast numerically (checked visually only).

## Proposed tree changes

- a18 and a19 use their own tables (`resources` and `places`, with Tariq as a booker). Align them with this article's `classes`, `reservations` and `instructors`, with Mina (1) and Arun (2) as bookers and Lena and Tariq as instructors, so that "the class reservations from Making concurrent changes correct" and "class 21's last place" match.
- a19 links to `#choose-protection-for-the-invariant-you-actually-have`, `#express-a-change-and-its-condition-together` and `#losing-the-reply-does-not-prove-rollback`; all three anchors are kept.
- The a00 link into this article (`#a-transaction-protects-a-change-within-a-stated-contract`) is assumed from the current a00; check it against the trial a00.

## d01 repairs

Source: `../d01/repair-decisions.md`, "Accepted · a03". All findings applied. Article word count after repair: 5,736 (`wc -w`, file with markup).

| Finding | Change |
| --- | --- |
| practitioner-4 | Move listing rewritten: lock 21 then 22, then `UPDATE reservations … WHERE request_id = 'R8' AND class_id = 21` as a guard (UPDATE 0 → ROLLBACK), then take a place in 22 conditionally, then free 21. `verify.mjs` adds a concurrent repeated move with class 21 at capacity 3 (R8, R20, R21): the old listing's second run commits and breaks both classes; the new one stops at `UPDATE 0` and rolls back. The deadlock section and closing argument say moves recheck the booking's current class under the locks. |
| teaching-4, practitioner-7 | New Figure 5 (`ScheduleFigure` mode `deadlock`, scenario `move`): opposite-order run (40P01 victim, 25P02, Tariq's business rejection, Mina's whole retry) beside the ascending-order run, with starting rows stated in the figure and the prose. Full ordering procedure handed to a18. The old prose-only deadlock check in `verify.mjs` is replaced by the figure's checked schedule. |
| visual-8, teaching-5, editorial-11 | Customers are Mina Shah (1), Tariq Aziz (2), Edda Berg (3); Tariq is the rival booker; instructors are Lena and Ravi. The opening no longer calls the classes the introduction's shop; it maps `remaining` to the mug's stock and a reservation to an order line once. A closing paragraph applies the argument to the shop's order, items and guarded stock reservation. |
| visual-9 | Figure 1: `classes` table first and full width; no box scrolls at 375, 768, 1024 or 1280 px. |
| visual-10 | Figure 4: old version no longer uses opacity; text uses the secondary text token (6.6:1 light, 6.8:1 dark). Uncommitted outline uses the secondary text token (6.6:1 light, 6.8:1 dark). |
| teaching-6 | Paragraph after Figure 1 on why `remaining` is stored and that a18 takes the counted case. |
| teaching-7 | "Choosing a protection" table (rule shape, protection, guarantee, writer duty, loser's view); closing argument says why the coordination row was preferred to Serializable and what would change that. |
| teaching-8 | Predicate paragraph gives the concrete unseen-row case (counting reservations `FOR UPDATE`); check step 4 points to a18 for the worked insert race. |
| practitioner-5 | Retry paragraph and lost-reply table qualified: under Serializable, 23505 and 23P01 may be retried when the key came from data another transaction was changing (Serialization failure handling page cited). |
| practitioner-6 | "A row that did not match yet, whether newly inserted or changed to match"; coordination-row and Serializable bullets say they cover rows that start matching, provided every writer takes the row or runs at Serializable. |
| editorial-12 | Heading "Isolation levels: a fixed snapshot is not enough" (anchor kept); "steady view" removed. |
| editorial-13 | H2 "Deadlocks, retries and lost replies" (anchor kept). |
| editorial-14 | "The example schema declares…"; predicate explained; "Suppose class 22 becomes a paid class"; lock defined at first use in the transaction section. |
| editorial-15 | Deadlock outcome split into short sentences; lost-update definition rephrased; a18 hand-off sentence rephrased. |
| editorial-16 | Schedule eyebrows "one possible timing, replayed on PostgreSQL 18.6"; "illustrative" no longer used for run schedules; Figure 1 caption rewritten; duplicate verdict uses "left"/"booked"; text summaries keep original case. |
| editorial-17 | "This procedure works for any rule"; Sources provenance shortened, Homebrew and script notes removed from the page. |
| visual-11 | Row labels number the starting state as step 1, so the counter and the highlighted row agree. |
| visual-12 | Move listing and Figure 4 statements broken over short lines; no listing scrolls sideways at 375–1280 px (measured). |
| visual-13 | Bookings cells show owners ("R7 Tariq, R10 Mina, R11 Mina"); endings table shows owners too. |
| visual-14 | Result table of the capacity check on the starting rows added under the listing (`invariantResult`, asserted by `verify.mjs`). |

Checks after repair: `verify.mjs` full run exit 0 (twice); browser (pane hidden, emulated viewports) at 375 px light and dark, 768 px light, 1024 px dark, 1280 px light: no page overflow, no Figure 1 box or listing overflow, Figure 5 stepped through both options, counter matches row labels, option change restarts, no console errors. Measured: Figure 4 old-version text and uncommitted outline 6.6:1 (light) and 6.8:1 (dark); captions 6.1:1 and 6.2:1; Figure 5 error text 7.8:1 dark. `pnpm build` passed, all 13 site-check rules ok.

Not checked: screen-reader announcement; Play timing over a full run; the deadlock victim is PostgreSQL's choice — in every run so far the first waiter (Mina) was chosen, and `verify.mjs` would fail if that changed.

Tree note: the instructors are now Lena and Ravi; a19 uses Mina and Tariq as instructors and should rename to match.
