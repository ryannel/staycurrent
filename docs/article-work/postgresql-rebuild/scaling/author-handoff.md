# Replication and sharding author handoff

15 October 2026. Two articles, four code-native diagrams and two independent browser lessons are ready for the coordinator's uncued reader and technical/media review. No registry/shared-import changes and no commit were made by this author.

## Owned files

- `src/pages/learn/databases/relational/postgresql/replication.astro`
- `src/pages/learn/databases/relational/postgresql/sharding.astro`
- `src/components/explainers/pg-scale-diagram.astro`
- `src/lib/sql-lessons/postgresql-scaling.ts` exports `postgresqlScalingTutorials` and `scalingSql`; IDs `pg-runtime-pruning` and `pg-tenant-keys`, ten total steps.
- Research: `../scaling-research.md`, including the Citus 14.2 source resolution appendix.

## What was actually executed

`physical-replication.mjs` starts isolated PostgreSQL 18.6 clusters in temporary Unix-socket-only directories. It observed receipt reaching a post-commit LSN while replay and the visible price remained old; resumed replay; contrasted synchronous remote flush with remote_apply waiting on SyncRep; deliberately omitted an asynchronous acknowledged write from a stopped standby; fenced the old primary by stopping it; promoted the surviving standby; rewound and rejoined the old primary; and observed the new primary's later change arrive. `physical-observed.json` contains the successful run. `physical-missing-wal-observed.json` preserves the earlier real rewind failure caused by recycled WAL. Retaining enough WAL and establishing the rejoin slot allowed the complete path. Both temporary servers were stopped and removed; a final process check found no remaining pg-scale server processes. The shared server was never reconfigured or stopped.

`logical-replication.mjs` starts separate temporary PG18 publisher/subscriber clusters. `logical-observed.json` records a filtered initial copy, UPDATE crossing out of and back into tenant 7, independent subscriber index creation, a copied identity value without corresponding sequence advancement, a local uniqueness conflict stopping apply, repair permitting continuation, and a missing-target UPDATE skipped before a later INSERT arrives. Both clusters were stopped and removed.

`verify-lessons.mjs` runs all ten steps in the owned `pg_scaling_lab` database on the shared test server. `lessons-server-observed.json` includes generic-plan Subplans Removed, changed child selection, both-child tenant filtering, accepted repeated IDs with different dates, the four-row incorrect join, correct tenant join and expected 23503 rejection followed by successful repair. Node's JSON rendering converts date objects to UTC timestamps; SQL/browser date values retain the intended calendar dates.

`verify-embedded.mjs` runs the same module on the repository's PGlite 0.5.8 package. All ten steps passed, including the expected constraint failure. `lessons-embedded-observed.json` preserves results. This is engine verification; the coordinator should run the integrated sandbox navigation after registering the tutorials.

Citus was not installed or run. Its diagrams are explicitly schematic and the two-phase sequence is a possible schedule. The exact v14.2.0 adaptive-executor and remote-transaction source establish the two-owner activation and prepare paths used in the article. FDW and failover-slot readiness are documented explanations, not claimed experiments. The browser lessons test real native pruning/local constraints; they do not impersonate distributed execution.

## Build and rendering

`pnpm build` passed twice during authorship (61 pages at that point). The final small Citus source-citation paragraph replacement followed the second build and needs inclusion in the coordinator's final build. Existing PGlite bundler warnings remained.

Full pages were captured at 390 and 1280 pixels in both system themes, eight combinations. Every route returned 200, no page errors, no failed images and no horizontal document overflow. Artifacts: `/private/tmp/pg-scaling-review/`. The Citus paragraph in that capture precedes the final source-backed replacement; recapture for the fresh reader.

`check-layout.mjs` captured all four figures at both widths and themes, sixteen combinations, under `/private/tmp/pg-scaling-figures/`; `layout-observed.json` records no figure overflow and correctly changed foreground/background colors. Author inspected phone physical-flow and two-phase panels plus desktop placement and divergent-history panels: labels, arrows and captions are readable. Static media uses flat ruled surfaces; no control-shaped elements are presented as clickable.

## Review focus

Follow the work across processes and owners, rather than treating topic coverage as sufficient. The first article should let a reader distinguish receipt, durable flush, replay, snapshot freshness and the authority chosen by promotion. The second should let a reader derive why the tenant join is local, why its full identity matters, why a global rule needs more coordination, and why atomic completion differs from a distributed snapshot. The Citus prototype is a mechanism explanation with clearly stated evidence limits, not an untested deployment recipe.
