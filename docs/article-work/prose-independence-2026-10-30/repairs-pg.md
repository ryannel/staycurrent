# PostgreSQL prose-independence repairs

Completed 30 October 2026 for all **17** PostgreSQL articles in
`src/articles/relational-rebuild/`, following the revised writer, revision,
continuity, figure and review guidance. The baseline findings are in
`reviews/baseline-pg.md`.

The repair keeps the subject's explanation in the article text. Necessary
starting facts, mechanisms, outcomes and conditions no longer depend on numbered
figures, selected controls or a caption. Existing explanations that already did
that work were retained. This is a prose repair to published articles; routes,
publication state and the shared shop facts were not changed.

## Changed articles

| File | Repair and continuity decision |
| --- | --- |
| `pg-access.astro` | Explain inherited grants versus becoming a role directly. Name the customer-4 update probe and its diagnostic grant before comparing hidden existing rows with rejected proposed rows. Retain the separate support design and protected login mapping. |
| `pg-architecture.astro` | Replace process, buffer, lookup, visibility, HOT and write-path tours with the actual causal steps. Define clean versus dirty victims and the hypothetical TID in text. Refer consistently to the price writer rather than inheriting W from a scene. Explain HOT's two failure conditions explicitly. |
| `pg-backup.astro` | Explain consistency WAL versus later archive coverage and the effect of a missing required segment before using that consequence. Describe the observed gap test and new writable recovery branch directly. Preserve all command shapes and reconciliation conditions. |
| `pg-distribution.astro` | Explain partitions, replicas, independent ownership, route keys, co-location, remote filtering and local combination without graphic directions. Establish the foreign-table server S in prose and use “local” for the querying side, avoiding confusion with customer group C. Preserve global order identity and the guarded handover. |
| `pg-extensions.astro` | Define the spatial radius, bounding square, points and exact acceptance in text. Recover A=(3,4), B=(4,4), C=(6,0) from the actual shared scene; their distances remain illustrative mathematics. Explain extension software versus dump contents directly. Preserve range, exclusion and extension-lifecycle evidence limits. |
| `pg-indexes.astro` | Explain retained information by method rather than touring cards. Define the four-point pruning example and query box independently. Compare increasing and mixed timestamp layouts without inheriting an arbitrary eight-page setup. Keep operator, recheck, bitmap and native-plan distinctions. |
| `pg-json.astro` | Name specialised typed detail rows and a JSONB document row before comparing their shared product reference. Explain extraction/validation and diagnostic tag variants directly. Establish both clients' starting document and the intervening care edit before contrasting whole-document replacement with a current-value member edit. |
| `pg-logical-replication.astro` | Explain the commit/apply interval and snapshot-plus-stream coverage without playback. Restore the filtered-update membership rules to the body: entering becomes insert, leaving becomes delete, matching both remains update and matching neither emits no change. Preserve the separate FULL-identity price-filter example and selected-history limitations. |
| `pg-operations.astro` | Trace request evidence through pool/server boundaries directly and name waiting backend W. Explain ordinary/reserved/superuser admission by the actual settings and roles. State the two-second illustrative deadline allocation in text. Report native lock/cancellation results independently of their graphic counterpart. |
| `pg-plans.astro` | State what repeated and inclusive counters count without nesting directions. Put the observed individual-statistics and joint-MCV results into the prose. State the actual external-merge versus in-memory sort result and identify the newly built index's three shared reads. Explain parameter skew for both request classes without a selector instruction. |
| `pg-replication.astro` | Define U and C as article notation for the price update and commit records. Explain receipt, write, flush and replay separately, and remove the commit-setting table's dependency on a figure step. Preserve A/B history, routing and promotion semantics. |
| `pg-schema-change.astro` | Explain the retained reader, queued DDL and later reader sequence directly. Distinguish non-null from cross-form agreement and the three concurrent-build properties in text. Introduce `_ccnew` and `_ccold` meanings before the cleanup decision. Preserve all native lock, validation and failed-build qualifications. |
| `pg-text.astro` | State English/simple preparation and retained positions directly. Explain field-vector composition, GIN candidate proof, eligibility before limit and stale-vector/new-query configuration mismatch without playback directions. Preserve the independent score table, query language and maintenance rules. |
| `pg-upgrades.astro` | Compare routes by work inside the write pause. Explain copy/link startup consequences, source admission closure and final source history without scene modes or a drawing-only B. State the target-only price commit and its effect on simple return directly. |
| `pg-vacuum.astro` | Explain retention release, non-HOT price-index maintenance and live-tuples-on-every-page conditions in the body. Remove arbitrary six-page dependence while retaining why internal free space can remain costly. Describe unchanged-row freezing and autovacuum limitations independently. |
| `pg-vector.astro` | Retain mathematical vector definitions and explain cosine directions without relying on arrows. Define the C→D→E search trade and the chosen IVFFlat centres/query/list-boundary example in text. Keep invented coordinates separate from learned relevance and bounded exploration separate from exact retrieval. |
| `pg-wal.astro` | Name the commit setting, define the checkpoint redo position R in prose, and explain the later checkpoint record without an undefined K. Report automatic replay, checkpoint/readiness ordering and the actual recovered P7/P9/order outcomes in the body. Keep process-stop, storage-survival and timing limits explicit. |

## Primary-source checks

Opened the relevant official sources during repair; these are also already
cited by their owning articles. This pass checked consequential wording moved or
expanded into prose rather than redoing unrelated technical reviews.

- [PostgreSQL 18 row filters](https://www.postgresql.org/docs/18/logical-replication-row-filter.html), section 29.4.3: old/new row membership determines UPDATE, INSERT, DELETE or no emitted change. The initial-copy and combined-filter distinctions remain unchanged.
- [PostgreSQL 18 REINDEX](https://www.postgresql.org/docs/18/sql-reindex.html), concurrent rebuilding: transient replacement, readiness/validity transfer, `_ccnew` and `_ccold` failure remnants. Suffixes can have appended numbers; the exact catalogue state and dependencies still determine cleanup.
- [PostgreSQL 18 WAL configuration](https://www.postgresql.org/docs/18/wal-configuration.html): checkpoint writing, checkpoint record and recovery redo point. Existing native observations supply the actual prices and restart transcript; no new observed execution is claimed.
- [PostGIS ST_DWithin](https://postgis.net/docs/ST_DWithin.html): bounding-box-assisted candidate filtering followed by the complete distance predicate, with geometry/geography units kept distinct. The example coordinates were checked against `src/components/relational-motion/postgresql/search.mjs`; √32 is approximately 5.66.
- [PostgreSQL 18 connection settings](https://www.postgresql.org/docs/18/runtime-config-connection.html): reserved-slot thresholds and the `pg_use_reserved_connections`/superuser admission distinction.
- [PostgreSQL 18 HOT](https://www.postgresql.org/docs/18/storage-hot.html): unchanged non-summarising index dependencies and same-page free space are separate prerequisites; summarising BRIN maintenance is preserved.
- [PostgreSQL 18 controlling text search](https://www.postgresql.org/docs/18/textsearch-controls.html): lexeme preparation, positions and source-field weights. The already-checked article and shared scene supply the specific “The blue mugs” transformation.

The ANN examples were checked against the actual figure sources rather than
inventing a replacement geometry. The shared HNSW scene explicitly has the route
through farther D to nearer E; its distances are a chosen candidate-list model.
The IVFFlat scene chooses centres 0/4/8, query 1.9 and B=2.1. The JSON update
component supplies the independent capacity/care schedule. Neither was converted
into a claim of measured engine execution.

## Verification and evidence reuse

- Followed the complete article explanations with lower-case figure blocks,
  imported scene instances and their captions/controls omitted, retaining SQL
  listings and ordinary reference tables as textual teaching. Checked repaired
  premises against later references and outcomes; no numbered-figure or playback
  dependencies remain in the body paragraphs or ordinary table cells.
- `git diff --check` passes for all 17 files.
- A source comparison against the baseline confirms that every embedded
  `<figure>...</figure>` block, SQL component listing, imported scene component
  instance, frontmatter import block, inline script and style block is unchanged.
- Checked new paragraphs for added density and split the longer logical-filter
  and index-failure explanations at their conceptual boundaries. No newly changed
  paragraph exceeds 90 words in the source prose check.
- Native execution evidence is reused because the SQL, fixtures, commands,
  verifiers, figure mechanisms and stored outcomes are unchanged. No database
  experiment or performance measurement was rerun for these prose repairs.
- Routes, metadata, downloads and publication state were not edited. The
  collection's canonical identities, stock, prices, order agreement and payment
  boundaries remain unchanged; mathematical and diagnostic branches stay local.

The coordinator owns the current build, dense-prose site check and rendered-page
verification. I did not run a build, operate the animations, commit or push. This
record is the writer's repair/continuity receipt; independent final reader
confirmation and the coordinator's current rendered checks remain separate.

The coordinator’s integrated build passed. Its one PostgreSQL density warning,
in the four-point spatial setup in `pg-indexes.astro`, was repaired by separating
the point pairs and search-box premise into short sentences, with every coordinate
unchanged. No new technical claim or media change was introduced.
