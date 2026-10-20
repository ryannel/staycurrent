# a03 trial: Making concurrent changes correct (writer record)

Trial page: `/review/relational-trial/transactions/` (article `src/articles/relational-trial/a03.astro`, components `src/components/relational-trial/a03/`).

Written from the a03 registry entry and its `nested_article` plan, with the skills `staycurrent-write` and `staycurrent-figures`. The current a03 draft, its components and its work folders were not read. The trial a00 was not read.

## What was built

- One running example kept from the introduction's shop: Mina (customer 1) and Arun (customer 2) book classes 21 (tea tasting, capacity 1) and 22 (mug painting, capacity 3, Arun already holds R7). Instructors Lena and Tariq carry the multirow staffing rule for class 21.
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
