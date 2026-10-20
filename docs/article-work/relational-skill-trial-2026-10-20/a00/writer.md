# a00 Relational databases: writer record (skill trial, 20 October 2026)

Regenerated from the plan (registry a00 entry and the top-level brief in
`docs/coverage/relational-fanout-2026-10-19.yaml`) with
`.agents/skills/staycurrent-write/SKILL.md` and
`.agents/skills/staycurrent-figures/SKILL.md`. Per the isolation rule, the
current a00 text, its components and its work folders were not read.

## What was built

- Article: `src/articles/relational-trial/a00.astro`, rendered at
  `/review/relational-trial/` in the RelationalNext layout. 5,259 words in the
  file; about 6,700 rendered words in the article excluding the figures’
  “Read this figure as text” blocks.
- Components in `src/components/relational-trial/a00/`:
  - `model.mjs`: the one shop (Mina, Tariq, Edda; P3 tea, P7 last blue mug,
    P9 teapot; orders 101–103; payments 501–503) that every figure, table and
    listing imports.
  - `verify.mjs`: replays every observed claim against a disposable
    PostgreSQL 18.6 server and fails if the model drifts; `observed.txt` is
    the last run’s log (exit 0, “All checks passed”).
  - `figures.css`, `KeysFigure.astro`, `QueryFigure.astro`,
    `RaceFigure.astro`, `RecoveryFigure.astro`.

## Sections (registry anchors kept, headings polished)

1. `one-action-changes-several-facts`: One order changes several facts
2. `tables-describe-facts-and-relationships`: Tables, keys and relationships
3. `ask-for-a-result-then-check-what-it-means`: Asking questions with SQL
4. `a-transaction-protects-a-change-within-a-stated-contract`: Transactions and competing buyers
5. `the-application-is-part-of-the-database-system`: From a request to a committed order
6. `correct-sql-still-has-to-do-physical-work`: The work behind a query
7. `data-and-applications-change-at-different-speeds`: Changing a live database
8. `operate-for-the-failure-you-must-recover-from`: Running and recovering the database
9. `choose-a-system-by-testing-the-contract-you-need`: Choosing a database and where to read next
10. `sources`: Sources and further reading

Each section ends with its child article (registry title and href), deep
anchors into that child, and its contextual grandchildren. The opening states
the parent-first reading contract; section 9 holds the task route table
(a02 setup then a01–a04; a05 then a26 or a28; a07 with a36; a06; a08, then a32
only for embedded and a34 only after a distributed requirement survives) and
says each deeper article names the parent section it assumes.

## Figures and tables

| Item | Kind | Evidence label |
| --- | --- | --- |
| Figure 1: Each fact is stored once; keys connect the facts | Select an item line; highlights the order, customer, product and payments its keys reach; prints the key path and joined row | Rows and constraints loaded into PostgreSQL 18.6; highlighting is illustrative |
| Figure 2: Three queries run without error; only one answers the question | Three options; SQL, returned result with “(wrong)” / “Row missing” marked in text, hand calculation, verdict | Observed, PostgreSQL 18.6 |
| Figure 3: Two transactions want the last blue mug | Stepper (shared `stepper.mjs`), three options (Read Committed overwrite, Repeatable Read, guarded update), six steps each; Mina / Tariq / committed-state lanes, changed values highlighted | Observed: two concurrent sessions, waits detected from `pg_stat_activity` |
| Figure 4: A replica copies mistakes; a backup with archived log can go back before one | Stepper, two options (host lost, bad deletion); primary / replica / backup lanes with order chips and “101 missing” | Illustrative model |
| Static tables | Where separate writes stop (illustrative); database does / you decide; receipt result; refused changes with SQLSTATE; Mina’s orders; request failure outcomes; pages read at three sizes; tax-country changes; reading routes | Observed ones labelled in their aria-label and surrounding prose |
| Listings | Receipt join, select, broad and narrow cancellation, order transaction; Figure 2 queries | All executed by `verify.mjs` |

All figures have a figcaption with “Figure N”, a “Read this figure as text”
block, a model/observed note, keyboard-operable controls (native radios,
select and buttons; Back/Next use aria-disabled at the ends) and a polite live
explanation. Scrollable tables inside figures are focusable regions.

## Decisions

- One worked shop across the whole article, matching the children: a04’s
  “Mina orders a mug and two packets of tea, order 103”, a07’s paid order 101
  with two items, a08’s last blue mug P7 at 20.00.
- Figure 3 uses PostgreSQL’s observed behaviour; InnoDB’s Repeatable Read
  difference is stated from MySQL 8.4 documentation and labelled as not run.
- Section 7 uses observed PostgreSQL 18 outcomes, including the new
  `NOT NULL … NOT VALID`; the general staged sequence is presented as the
  consequence of those outcomes.
- Section 6’s page counts are from a separate synthetic `big_orders` table at
  1,000 / 100,000 / 1,000,000 rows, with parallel workers off.
- Section 5 (request path and unknown commit outcome) and section 8 are
  reasoning plus documentation, not executions, and are not labelled observed.
- No links to `/review/examples/*`.

## Notes for the orchestrator

- Shared stepper CSS conflict (not edited): `src/styles/relational-drafts.css`
  styles `.relational-draft [data-step]` with padding and a left border for
  older stepped figures, which also hits the shared stepper’s `data-step`
  counter. These figures override it with `.a00-figure .a00-controls
  [data-step]`. Suggest either renaming the old draft hook or scoping that
  rule, so every stepper figure need not override it.
- The stepper exposes no reset for option changes; the figures click their
  own Reset button before `render()`. A `reset()` in the returned object
  would be cleaner.
- Proposed tree changes: none. Heading titles were polished but anchors kept.

## Checks run

- `LC_ALL=C node src/components/relational-trial/a00/verify.mjs`: all checks
  passed.
- Dev server on port 4401: each figure exercised through every option and
  step by script (Back/Next/Reset states, Play/Pause, option change resets to
  step 1), 375 px with no horizontal page overflow, light and dark themes with
  a computed contrast check of every visible figure text node (no pair below
  4.5:1 in the states checked), screenshots at 375 px and 1200 px. The
  Browser pane was hidden throughout; viewport and colour scheme were
  emulated in the tab.
- `pnpm build`: completed, site check all 13 rules ok.

## Not checked

- Screen reader announcement in practice; reduced-motion setting.
- The final grid tweak (table grid minimum `min(100%, 21rem)`, results grid
  `min(100%, 15rem)`) was made after the 375 px pass and checked only by the
  build, not re-screenshotted.
- Contrast of the Shiki-coloured SQL inside figures (shared component).
