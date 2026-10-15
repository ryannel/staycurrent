# Relational collection publication

Completed 15 October 2026 under the user's explicit commission to finish, review
and publish the aligned collection, committing and pushing stages to main.

## Published scope

All 27 articles in the relational reading map are available: eleven existing
articles and sixteen new articles across performance, operations, capacity,
PostgreSQL and database choices. The introduction, checkout tour, practice setup
and SQL sandbox complete the 31 relational routes. Other database families and
engineering fields retain their existing publication status.

The SQL sandbox has 29 lessons with 152 steps. Articles link directly to relevant
lessons, and lessons link back to their explanations. A Playgrounds entrance in
the site navigation and homepage gives practical learning a permanent place;
the SQL playground is its first available tool. The lesson catalogue groups the
material by subject and offers a clear starting route for someone new to SQL.

## Review and repairs

Batch research, example execution and independent review are recorded alongside
each commission. `collection-first-reading.md` preserves an independent reading
of the finished prose in order, recording questions before later sections could
answer them. It covers the introduction, all 27 articles, checkout and practice.
`final-lesson-review.md` examines every lesson's learning outcome, state, variation
and connection to its article. `media-review.md` records the separate reading of
the capacity and choice diagrams and tables.

Repairs included separating preparation from the query plan it changes, making
committed-update boundaries explicit, explaining how a retained monitoring
transaction can show stale statistics, correcting a search variation after a
product rename, and clarifying which SQL exercises model a distributed process.
The final reading also clarified reporting syntax, index setup, proposed rows in
an upsert, and the order of the row-version experiment. Old draft links and a
duplicate practice-table entry were removed.

The sandbox now uses actual PostgreSQL transaction status, preserves errors when
results are truncated, bounds displayed data and execution time, supports stopping
and restarting work, and protects pending SQL when a reset is cancelled. Expected
errors are checked against the lesson's original statement and SQLSTATE. A lesson
step must run before its continuation becomes available.

## Verification

- Final production build: 57 pages, successful.
- All 29 lessons and 152 steps executed with expected outcomes and final idle
  transaction states; focused example and variation checks also passed.
- Browser execution of all 152 steps passed, alongside checks for expected
  errors, transaction recovery, reset confirmation, stop/restart, keyboard
  execution, SQL NULL, literal HTML display and result limits.
- Internal audit: 2,063 route, fragment and lesson links checked; no issues.
- Publication checks: 27 published article entries and 31 indexable relational
  routes, with no stale draft presentation. Navigation, directory filtering and
  the lesson catalogue passed on desktop and phone in both themes.
- Rendered article inspections found no horizontal overflow, missing images or
  browser errors at 390 and 1280 pixels. Final repaired pages were captured again.
- `git diff --check` passed before the publication commit.

The checked JSON reports and verification scripts are retained in this directory.
The build emits existing PGlite dependency warnings but finishes successfully.

## What these checks establish

SQL execution uses PGlite's embedded PostgreSQL, and browser checks exercise the
actual playground. They do not establish physical recovery, replica failover,
cross-server movement or independent simultaneous connections. Those articles
identify the limits of their local models and supply server procedures. The
downloadable restore drill was checked for shell syntax and SQL fixture behaviour;
an actual `pg_dump`/`pg_restore` drill and the Docker setup were not run here.

This publication completes the commissioned relational scope. Its examples and
operational guidance remain revisable as products and the publication develop.
