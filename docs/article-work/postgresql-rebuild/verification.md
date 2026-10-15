# Verification of the PostgreSQL rebuild

This record concerns the eleven-page PostgreSQL rebuild commissioned on 15 October
2026. The earlier four-page publication's review is historical and does not stand
in for review of these replacements.

## Runtimes and repeatability

The site uses Node.js 24, pnpm 11.4.0 and its installed PGlite 0.5.8 package. That
browser engine reports PostgreSQL 18.3. The isolated native server reports
PostgreSQL 18.6. The capabilities labs additionally use pgvector 0.8.7 and
PostGIS 3.6.4; their installation and evidence notes are in `capabilities/`.

The native harnesses are records of this macOS authoring environment. They use the
Homebrew PostgreSQL 18 binaries and the `pg` Node package installed under
`/private/tmp/staycurrent-pg-lab`. They are not added to the website's runtime
or installed as a background service. The shared authoring cluster uses only a
Unix socket under `/private/tmp/staycurrent-pg-rebuild/socket`, port 55438;
authors use separate databases. Crash and replication harnesses create their own
separate temporary clusters and stop them in cleanup. The public vector and spatial
SQL downloads use ordinary psql and explicitly require their server extensions.

## Automated checks

- `pnpm build` builds every page. The integrated build currently produces 62 pages.
- `node --experimental-strip-types docs/article-work/postgresql-rebuild/verify-lessons.mjs`
  runs all 39 lessons and 214 literal steps through PGlite's raw query protocol.
  It verifies expected SQLSTATE failures and that every lesson ends outside a
  transaction. `lesson-execution.json` preserves results. Authors' focused scripts
  also assert semantic answers, variations and plan properties.
- `python3 docs/article-work/postgresql-rebuild/audit-links.py` checks built internal
  destinations, fragments and lesson IDs. It found no issues among 2,720 links;
  all 38 relational article/practice/tool routes are represented. Historical route
  aliases are not counted as separate teaching articles.
- `verify-browser.mjs` exercises the actual worker, editor, all lesson steps,
  completion and error handling, navigation/search, keyboard focus, reset/stop,
  safe output, narrow layouts and both themes. All 214 steps and the UX checks
  passed with no page errors; `browser-verification.json` preserves the results.
- `source-link-check.json` records an HTTP check of primary-source destinations.
  This checks reachability, not factual support; technical reviewers assess the
  associated claims. Two outdated PostgreSQL GIN paths were repaired to the
  merged PostgreSQL 18 documentation.

The native scripts preserve evidence for overlapping transactions, HOT and freezing,
prepared plans, candidate/recheck counts, crash recovery, physical and logical
replication, filtered vector retrieval, temporal constraints and spatial queries.
Citus was not deployed. Its architecture and transaction claims are checked against
versioned documentation and the 14.2 source; diagrams and browser models state that
boundary. No benchmark or physical power-loss guarantee is inferred from these labs.

## Reading and visual review

`review/first-reading.md` is a progressive, uncued reading of assembled DOM chunks,
with opening observations saved before later sections and writing judgments kept
separate from comprehension. It identifies the actual artifact and distinguishes
optional setup from the visible path. Screenshots were inspected where figures
occurred; this is an agent review, not evidence from a human usability study.

The eleven-page first reading is complete. Its artifacts under
`/private/tmp/postgresql-rebuild-review/` remain unchanged. Revised captures under
`/private/tmp/postgresql-rebuild-final/` support the final flow/repair reread and
layout checks. Full pages use 390- and 1280-pixel widths in light and dark themes.
Selected retained figure captures are under `visual/`. Final layout, technical
findings and repair dispositions are recorded alongside the completed review.

The final layout records cover 44 full-page states (eleven pages at two widths and
two themes) and 64 figure states (sixteen figures at those widths and themes).
Every page loaded successfully, with no reported script errors, failed images or
document overflow; no figure container overflowed. Independent reviewers inspected
native figure crops in addition to these measurements. The coordinator rechecked
the repaired replication and vector labels, GIN spacing, and dark phone views of
JSON, ranges and distribution. These checks support readability in the inspected
states, not a claim of human accessibility certification.

`review/core-technical.md` covers the first five chapters;
`review/capabilities-scaling-technical.md` covers the remaining six. Both reviewers
worked outside their own authorship. Their local repair findings and the uncued
reader's findings are tracked in `review/repairs.md`; the final continuous editorial
reread is recorded separately from the preserved first reading.

The disposable shared PostgreSQL cluster was stopped after experiments and technical
review completed. No default Homebrew cluster or background PostgreSQL service was
started. The retained scripts and JSON observations identify the tested fixtures.

Fresh sandbox catalogue screenshots are retained as
`visual/sandbox-postgresql-1440-light.png` and
`visual/sandbox-postgresql-390-dark.png`. They show the searchable PostgreSQL
lessons in the completed chooser, including its subject filter and links back to
the explanations. Searching PostgreSQL also finds two related family lessons;
the PostgreSQL branch itself supplies fourteen lessons.

The final continuous editorial reread accepted all eleven pages with no unresolved
consequential finding. The original progressive log, informed reread and technical
reports remain separate. One optional word choice was then adopted: “small tenant”
replaces “cold tenant” without changing the query or its reasoning.
