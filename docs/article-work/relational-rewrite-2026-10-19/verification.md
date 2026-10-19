# Relational replacement verification

19 October 2026. This record closes the authoring commission. Article-specific
claims and commands remain in `evidence/` and `lab/`; independent judgements
remain in `review/`.

## Native execution

PostgreSQL 18.6 observations cover transactions, contention, uncertain replies,
crash recovery, row versions, vacuum, indexes, query plans, JSON, privileges,
physical and logical replication, restore acceptance and concurrent schema work.
The major-upgrade supplement actually upgrades an independent PostgreSQL 17.6
fixture to 18.6 and checks ordinary application access and rejected invalid work.
Its former installation remains independently startable with its earlier data.

`evidence/rl119-lifecycle-observed.json` records sparse and freshly built indexes
containing the same surviving keys, reuse of deleted pages, a concurrent rebuild
under callers and an old snapshot, failed-copy cleanup, safe removal and final
constraint and booking acceptance. Its verification note explains the measured
resource interval and what the workload cannot establish.

CockroachDB 25.3.7 and 25.4.17 native observations include independent clients,
serialisation errors, ranges and covering plans, bounded historical reads, schema
jobs, region-labelled placement and failures, decommissioning, a rolling upgrade
and an application migration. The additional worksheets record:

- `cockroach-atomicity-observed.json`: separate participant ranges, a discarded
  COMMIT completion with gateway loss, and a required unavailable participant.
- `cockroach-identity-observed.json`: rejected unknown-CA joining, repaired trust,
  certificate replacement, old-identity login retirement and denied mutation.
- `cockroach-restore-observed.json`: an independent destination, ordinary-user
  access repair, latest and earlier restore targets, then idempotent replay of
  accepted work coupled to remaining capacity.

The six-script CockroachDB worksheet ZIP was checked for archive integrity and
expected members. These are bounded native observations; the articles retain the
scope limits. Teaching models and native results are labelled separately.

## Independent review

The design, operation, PostgreSQL and CockroachDB groups each have uncued first
readings and technical/editorial resolution records. The collection audit retains
its independent ability derivation, original findings and bounded recheck of the
repaired artifacts. The rebuilt RL119 and RL129 explanations received further
fresh readings. There are no remaining findings blocking ready-as-draft status.

## Rendered pages and controls

`review/rendered-pages.json` records 216 rendered states: all 54 articles at
1440-pixel desktop and 390-pixel phone widths, each in light and dark. Checks found
no page overflow, broken images or missing article titles. Tables and code retain
horizontal scrolling where needed.

All 31 generic stepped figures were exercised through Next and Reset. The retained
index and storage figures were checked separately, including covering-index
visibility changes, update costs and crash mode. The rebuilt recovery figure was
stepped through replay and reset. The final migration page has correctly rendered
headings and code fences. `review/screenshots/collection-directory.jpg` preserves
the final directory view. Browser theme and viewport overrides were reset.

## Repository checks

- `pnpm test`: all 15 site-check tests pass.
- `RELATIONAL_DRAFT_PREVIEW=1 pnpm build`: passes all 13 site-check rules, including
  draft links, anchors, source sections and figure structure.
- `pnpm build`: passes all 13 rules. The normal build emits no `dist/review` files.
- Final registry source hashes match the 54 ready draft files.
- Prose and source whitespace checks pass. Raw console tables and CSV observations
  preserve their original padding and line endings.

The preview build is for local reading. The normal production build is run last
so the saved search index matches the published site.
