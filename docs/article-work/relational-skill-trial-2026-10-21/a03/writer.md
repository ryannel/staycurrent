# a03 writer record: Making concurrent changes correct

Second skill trial, 21 October 2026. A fresh writer applied staycurrent-write, staycurrent-figures and staycurrent-continuity. The orchestrator manages review, so no review was arranged here. Nothing was committed.

## What was built

- Article: `src/articles/relational-trial-2/a03.astro`, rendered at `/review/relational-trial-2/transactions/` through the existing trial route (route not edited). Wrapped in `ArticleBody depth={3}`, so the contents list follows the opening and nests the h3s. All 18 registry anchors are present as heading ids, in registry order, with `sources` as the last h2.
- `src/components/relational-trial-2/a03/model.mjs`: the single source of rows (from `docs/coverage/relational-example.md`, class-booking extension), the schema, every SQL string the article and figures show, the rule checks, all four figures' step schedules with expected results and committed rows, and the prose claims (`claims.visibility`, `claims.countingVariation`, `claims.rollbackPrediction`). The article imports its starting tables, schema, listings and the visibility table from it.
- `render.mjs`: draws one step of a schedule (lanes, statements, results, waits, committed tables with PK/FK marks and changed cells, rule check). Used for the server-rendered first paint and in the browser, so both agree. Also builds each figure's text alternative.
- `ScheduleFigure.astro`: the figure component, built on `src/components/figures/stepper.mjs` (Play/Back/Next/Reset, counter, hold bar, `data-live`, `data-explanation` with `aria-live="polite"`), with option buttons (`aria-pressed`), a "Read this figure as text" summary and a caption. It overrides the drafts stylesheet's `.relational-draft [data-step]` padding for its counter.
- `verify.mjs`: a dependency-free PostgreSQL wire-protocol client (Node 22+) that creates its own database, replays every figure option statement by statement against real sessions, confirms each wait through `pg_stat_activity`, compares every result and the committed rows after every step with the model, and runs the extra prose checks listed below. Downloadable from the article with `model.mjs`.
- `verify-sqlite.py`: checks the two SQLite cards with Python's standard library.

## Figures

| Figure | Options | What it teaches | Counterexample it contains |
| --- | --- | --- | --- |
| 1 Mina's double click in class 22 | Each statement on its own; One transaction per booking | Atomicity: R11's refused insert leaves a vanished place under autocommit; inside a transaction the failure (25P02, COMMIT reported as ROLLBACK) undoes it | Separate statements break rule 1 |
| 2 Mina and Tariq book class 21's last place | Read, then write the new value; Subtract one, no condition; Change only if a place is left; Read, then write, at Repeatable Read | Lost update; protection must cover the decision; conditional update with recheck; 23514 from CHECK; 40001 at Repeatable Read and whole retry | Read-then-write at Read Committed overbooks |
| 3 Lena and Ravi both ask to stop teaching class 21 | Repeatable Read; Lock class 21 first; Serializable, repeat the transaction; Serializable, repeat the failed statement | Write skew; guard row; SSI refusal at commit; retrying one statement keeps a stale decision | Repeatable Read and statement retry both leave class 21 with nobody |
| 4 Mina's booking when the reply to COMMIT is lost | Committed; service books again / looks up R8; Never committed; service looks up R8 | Ambiguous commit; look up the operation identity before repeating | Booking again tells Mina "full" while she is booked |

Each caption says the run was recorded on PostgreSQL 18.6 and what it leaves out (application code between read and write; tables not shown; how the lost connection was staged). Each figure's kind line says it replays recorded results and does not run a database.

Static tables: starting rows (three small relations), choice of protection (3 columns), PostgreSQL anomaly table (short cells), visibility table (short cells, from `claims.visibility`), outcomes table (3 columns), email placement table (2 columns). The seven-entry engine contract comparison is shown as labelled cards at every width (figures skill: more than three sentence columns), each with an evidence line.

Listings: schema, booking, version check, lock-first departure, ordered move; all built from `model.mjs` strings.

## Decisions

- Kept the registry headings verbatim, since they read well as prose headings and the anchors must stay.
- Used the example record's class-booking extension throughout: Mina, Tariq, Edda; classes 21 and 22; R7 to R12; Lena and Ravi. The FOR UPDATE counting case is the record's stated variation (class 22 capacity 2; Mina R10 and Edda R11 reach 3 bookings), described in the article as a variation and verify-only apart from prose.
- Short answer in the opening, as the reference articles do, avoiding level names there; Read Committed and isolation level are introduced before Figure 2, snapshot at the Repeatable Read option, lock at the guard row, Serializable with a short forward gloss at Figure 3 and its full treatment in its own section.
- MySQL claims are documented only and labelled so in the cards and sources. SQLite claims were run.
- Load results are reported honestly: the unprotected protocol overbooked in every round, including all 100 two-client rounds without a barrier. The planned point that "random runs often look correct" was changed to "on this machine it failed every time; elsewhere the same code may pass a long load test", since the run did not show passing randomness.
- Prediction (Mina rolls back) uses `headingLevel={4}` so it stays out of the contents list.
- Left full guard-row protocols, lock modes, NOWAIT/SKIP LOCKED detail and move rechecks to a18; serial-order versus real-time and engine testing to a19; request identity and retry policy to a22; outbox to a23; replica acknowledgement to a38.

## What ran

PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, disposable cluster on 127.0.0.1:57612:

```
LC_ALL=C initdb -D <scratch>/pg57612 --auth=trust -U postgres --encoding=UTF8 --locale=C
LC_ALL=C pg_ctl -D <scratch>/pg57612 -o "-p 57612 -c listen_addresses=127.0.0.1 -c unix_socket_directories=''" -l <scratch>/pg.log start
cd src/components/relational-trial-2/a03 && A03_PROGRESS=1 node verify.mjs      # Node 24.16.0
LC_ALL=C pg_ctl -D <scratch>/pg57612 stop && rm -rf <scratch>/pg57612
```

(`unix_socket_directories=''` because the scratchpad path is too long for a Unix socket; `LC_ALL=C` because pg_ctl refused to start with the default locale environment, "postmaster became multithreaded".)

Server settings recorded by the script: default_transaction_isolation=read committed, deadlock_timeout=1s, fsync=on, lock_timeout=0, statement_timeout=0, synchronous_commit=on.

Result: 235 checks, all passed. They cover:

- every option of every figure, step by step: result or SQLSTATE, waits confirmed through `wait_event_type = 'Lock'`, committed rows after each step, and the final rule check against the expected broken/unbroken set (the four unsafe options must break their rule; the others must not);
- the visibility table at Read Committed and Repeatable Read (ordinary read, FOR UPDATE, conditional UPDATE, during and after Mina's commit);
- the rollback prediction (Tariq waits, then takes the place when Mina rolls back; bookings R7, R9);
- concurrent clicks (R11 waits on class 22's row, then 23505, COMMIT reports ROLLBACK) and the insert-first variant (R11 waits on R10's uncommitted key, then 23505);
- 25P02 after Tariq's refused R12;
- the savepoint hazard (place kept with no booking after ROLLBACK TO SAVEPOINT and COMMIT);
- transactional CREATE TABLE and nextval not rolled back;
- the counting variation (three bookings for capacity 2 after locking counted rows);
- the swap: opposite lock order gives exactly one 40P01 (Mina's in this run); ascending order runs in turn with both class rules holding;
- conditional update not waiting for an uncommitted change it does not match;
- version check (guarded update waits, then changes 0 rows);
- fractured report (Read Committed reads 1 and 1; Repeatable Read reads 1 and 0);
- load: 20 clients (customers 101–120), 20 rounds per protocol. Read-then-write: 400 of 400 attempts booked, overbooked in 20 of 20 rounds. Conditional: 20 of 400 booked, overbooked in 0 rounds. Two clients without a barrier, read-then-write: overbooked in 100 of 100 rounds.

An earlier run hung in the swap case: the original moves used the conditional take, which skipped class 21's committed row (remaining 0) without waiting, so no deadlock formed. The moves were rewritten to lock both class rows explicitly; that behaviour became its own check.

SQLite 3.54.0, `python3 -I verify-sqlite.py`: 3 checks passed (deferred WAL write after another commit: SQLITE_BUSY_SNAPSHOT, class 21 keeps 1 booking; deferred instructors: SQLITE_BUSY, 1 instructor left; BEGIN IMMEDIATE: Tariq waited 0.36 s, then read 0).

MySQL: not run. Every MySQL statement in the article is labelled documented.

Cleanup: the PostgreSQL cluster was stopped with `pg_ctl stop` and its data directory removed; the dev server on port 4512 was stopped. Leftover `a03_worksheet_*` databases from two killed runs had been dropped before the final run.

## Page checks

The browser pane was hidden, so the rendered page was checked in headless Chromium (chrome-headless-shell 1234, driven over CDP from Node 24) against `pnpm astro dev --port 4512`. `pnpm build` was not run, as instructed.

- Structure: one nav labelled "In this article", after the opening and before the first h2; h2 order matches the registry; all 18 registry anchors present; Figure 1–4 labels in page order; sources is the last h2 of the article body (the layout's own "Continue into the detail" follows it). Links to both children (`/review/relational-next/locking/`, `/review/relational-next/isolation/`) where their subjects come up and in the reading list.
- Site-check rules run on the served HTML (fake dist in scratch, every rule except internal-links, which needs the whole site): all pass. Source rules (raw colour etc.): no issues in a03 files. Every on-site anchor linked was confirmed in the relational-next sources.
- Every option of every figure stepped to its end: final rule checks match the verified expectations (clicks/separate, race/read-write, instructors/repeatable and instructors/serializable-statement broken; all others hold).
- Keyboard: focus on Next, eight Enter presses on Figure 2 (condition, 6 steps): reaches 6 / 6, Next becomes `aria-disabled="true"`, focus stays on Next.
- Timing (page timers, `performance.now()`): Play on Figure 2 held steps for 3.5, 4.8, 7.5, 6.5, 8.7 and 8.0 s, tracking the changed text (floor 3.5 s); Play label switches to Pause.
- 375 px and 1280 px in light and dark: no horizontal page overflow; screenshots of all four figures, the engine cards and the starting tables inspected. Two faults found and fixed: a global `.cell` rule (centred text, grey background) leaked into the history cells, so the figure classes were renamed `hcell`; the starting-row tables clipped "remaining" at 1280 px, so they now size to content and wrap as whole tables.
- Contrast (computed): secondary text in figures and cards 6.05–6.15:1 against its background; "still waiting" 5.22:1 (light); rule lines 12–15:1.
- Console: no errors or warnings.
- Download links for `verify.mjs`, `model.mjs` and `verify-sqlite.py` return 200 in dev.

## Continuity pass

Terms, in reading order (first use → where explained):

| Term | First use | Explained |
| --- | --- | --- |
| transaction, commit, rollback | opening | opening (commit or disappear together); BEGIN/COMMIT/ROLLBACK in "Put the complete change" |
| constraint | opening list | schema paragraph and "Let the database reject" |
| shared lock / lock | opening (plain sense) | "which locks the row: another transaction that tries to lock or change it waits" (guard-row section); fixed: savepoint lock remark moved after this |
| invariant | first h2 | same sentence |
| primary key, foreign key, CHECK, UNIQUE | schema paragraph | assumed from a01/a10 on the reader's route; each stated in plain words where used |
| autocommit | "Put the complete change" | same sentence |
| 25P02, 23505 (error codes) | after Figure 1 | same paragraph (five-character codes added) |
| atomicity, consistency, isolation, durability | ACID list | same list |
| savepoint | after ACID | same sentence |
| history, lane, serial order | Figure 2 lead-in | same sentences |
| isolation level, Read Committed | Figure 2 lead-in (moved there; was first in the caption) | same paragraph |
| lost update | after Figure 2 | same sentence |
| RETURNING | third option paragraph | same paragraph |
| Repeatable Read, snapshot | "A repeatable view" | same paragraph |
| Serializable | Figure 3 lead-in (option labels) and protection table | short gloss at Figure 3 ("PostgreSQL’s strictest level"); full in "Stronger isolation" |
| write skew, snapshot isolation | after Figure 3 | same paragraph |
| version check | "Express a change" | same sentence |
| FOR UPDATE, guard row | "Coordinate decisions" | same paragraph |
| serialisable, anomaly names (dirty read, non-repeatable read, phantom) | isolation section | definition paragraph and the table's "What happens" column |
| MVCC | "Versions and locks" | same sentence |
| WAL mode, deferred (SQLite) | before cards | cards lead-in (added) |
| deadlock | outcomes table | table row and the following paragraph |
| NOWAIT, SKIP LOCKED, 55P03 | retry section | same sentence |
| write-ahead log, synchronous_commit, fsync | durability section | same paragraph |
| outbox | email table | same row |

Fixed during the pass: Read Committed was first used in Figure 2's caption (moved the explanation before the figure); "lock" was used in the savepoint paragraph before explanation (moved); Serializable appeared in Figure 3's option labels and the opening (opening reworded, gloss added); SQLite "WAL" and "deferred" were unexplained in the cards (explained in the lead-in); "deadlocks and serialization failures" was a forward use in the constraints section (reworded); "outside any lock" in the version-check listing (reworded).

One name per thing: conditional update (one stray "conditional statement" in the InnoDB card changed); guard row; version check; option labels quoted in prose match the buttons exactly; Mina/Tariq/Edda, Lena/Ravi throughout.

Example check against `docs/coverage/relational-example.md`: customers 1–3, classes 21 (capacity 1, remaining 1) and 22 (capacity 3, remaining 2), R7 (class 22, owner 2), Lena and Ravi in class 21, R8 Mina's last place in 21, R9 Tariq competing, R10/R11 Mina's double click in 22, R12 Tariq's refused booking in 22 (worksheet only), the counting variation (class 22 capacity 2, Mina R10 and Edda R11, three bookings). Outcomes agree across figures: R8 is the booking that holds class 21 in Figures 2 and 4, and the move section starts from that state.

## Proposed example and tree changes

For the orchestrator to merge into the example record (not added there by this writer):

1. **Load clients**: customers 101–120 ("Load client N"), used only by the worksheet's load test; never shown in a figure.
2. **The swap**: after R8 holds class 21, Mina moves R8 from 21 to 22 while Tariq moves R7 from 22 to 21. Used for the deadlock (opposite lock order, one 40P01) and the ordered move (ascending class_id, both commit).
3. **Optional instructor counter**: an available-instructor count on the class row with `CHECK (… >= 1)`, mentioned in prose only as a design alternative for rule 3.
4. **Version check and report**: the version-check guard (`WHERE remaining = 1`) and the fractured report (remaining then booking count) reuse R8 and class 21 without new rows; recorded here so later writers keep the same numbers.

Disagreements found (not repaired; they are outside this assignment):

- a18 uses `resources`, `resource_id`, request R1 and owner 7 rather than the record's `classes`, R8 and Mina. This article links a18 as "the version of this example that counts bookings" without repeating its names.
- a19 uses Mina and Tariq as the instructors (places and staff), while the record and this article use Lena and Ravi. A reader moving from Figure 3 to a19 will meet the same scenario with customers as staff.

No change to the tree is proposed.

## Not checked

- MySQL/InnoDB behaviour was not run; the InnoDB Serializable "can deadlock" line is inferred from documented shared-lock behaviour.
- Crash behaviour of `synchronous_commit = off`, `lock_timeout`/`NOWAIT`/`SKIP LOCKED` (55P03) and `statement_timeout` (57014) were not run here (a18's worksheet observed NOWAIT and SKIP LOCKED).
- No production build (`pnpm build`) and no full-site link check; the page was checked in dev only. Download URLs were checked in dev, where Vite serves them; the built asset paths were not seen.
- Headless Chromium only; no visible-window check, so animation smoothness of the hold bar was not seen, only its timer.
