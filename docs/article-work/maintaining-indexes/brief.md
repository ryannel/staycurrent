# Maintaining indexes: size, rebuilds and statistics (brief)

Companion to the relational Indexes deep dive. File: `src/pages/learn/databases/relational/maintaining-indexes.astro`. Plan: `docs/article-work/indexes/coverage-map-2026-10-17.md` section 6 B2, section 8, tree items G3-G10 and E1/G7. Written 17 October 2026. A draft, not published; the coordinator registers the collection entry.

## Reader

An on-call or platform engineer who already has indexes and a symptom: "this index is twice the size it should be", "can I rebuild without locking", "stats are stale after a bulk load", "which indexes can I drop". They know what an index is and have seen a plan; they may not know why an index stays big after deletes, which engine operation rebuilds it, what that operation locks, or how to tell a stale statistic from a missing index. They arrive from the Indexes bridge section or directly. General relational article: PostgreSQL 18 is the labelled worked example, with InnoDB (MySQL 8.4) and SQLite where they differ.

## Useful stopping point

The reader can: measure an index's size and density in each engine and judge whether it is bloated; choose a rebuild method and say what it will lock and what it will cost; build an index without stopping writes and recognise the invalid leftover of a failed build; keep statistics current after a bulk load and in routine operation; find unused, duplicate and invalid indexes and drop them safely; roll an index change out in order; and run an integrity check.

## Topic tree (derived from the subject before reading the parent's section)

Subject: keeping the indexes of a running relational database the right size, current and sound.

1. Why size drifts (mechanism). 1a deleted entries free space inside pages, not the file; 1b empty pages are reclaimed by the tree, thin pages are not; 1c delete pattern matters (range delete of sequential keys versus scattered deletes); 1d freed pages are reused only after a later cleanup pass (PostgreSQL); 1e updates and version churn: non-HOT updates, bottom-up deletion, deduplication; 1f InnoDB: purge, delete-marking, merge threshold; 1g SQLite: freelist and file that never shrinks.
2. Seeing it. 2a baseline: what size to expect (live entries, key width, fill factor 90 per cent); 2b per-index size and growth versus live rows; 2c density inside pages (pgstatindex; innodb_index_stats size and n_leaf_pages; dbstat); 2d the decision: when low density is a problem (will the data grow back? is the index hot?).
3. Rebuilding. 3a what a rebuild does (new index from live entries at the fill factor); 3b PostgreSQL REINDEX: plain versus CONCURRENTLY, locks, steps, disk, time, WAL, waiting on old transactions; 3c failure modes: invalid `_ccnew`/`_ccold`; 3d table-level alternatives (VACUUM FULL, CLUSTER) and why they are heavier; 3e InnoDB has no per-index rebuild: OPTIMIZE TABLE / ALTER TABLE ... FORCE rebuild the table online; 3f SQLite REINDEX (frees pages, file unchanged) and VACUUM (shrinks, writer lock, double disk); 3g what is the schedule: none; measure first.
4. Building new indexes safely (G6). 4a lock level per engine; 4b time and memory settings, parallel workers; 4c replicas; 4d failed concurrent build -> invalid index (shared with 3c).
5. Statistics (E1/G7). 5a what they are and what breaks when stale; 5b PostgreSQL autovacuum analyze trigger, the lag after a bulk load, manual ANALYZE, partitioned parents; 5c InnoDB persistent statistics, 10 per cent trigger, ANALYZE TABLE read lock; 5d SQLite PRAGMA optimize; 5e how to recognise stale statistics (estimate versus actual) and link to slow-queries.
6. Removing indexes (G8). 6a unused (link parent); 6b exact duplicates and prefix-redundant indexes with queries, MySQL sys.schema_redundant_indexes; 6c invalid indexes; 6d dropping safely: DROP INDEX CONCURRENTLY, MySQL invisible then drop, SQLite keep the DDL; counter resets, replicas, rare queries, constraint indexes.
7. Rolling out a change (G9): create, verify, switch, watch, drop; replacing an index of the same definition.
8. Integrity (G10): amcheck, CHECK TABLE, PRAGMA integrity_check; when (collation changes, crash, hardware).

## Where each part goes

Sections with their own h2: 1, 2, 3, 4, 5, 6, 7, 8 (one each). Depth by need: 1 and 3 are the longest because the mechanism and the lock behaviour decide the on-call action; 4 is moderate because the PostgreSQL mechanics are in `postgresql/indexes.astro#concurrently` and schema locks in `schema-changes.astro`; 7 and 8 are short. Statistics get a full section because the parent only says "ANALYZE" once and no page covers MySQL or SQLite statistics.

## Left out on purpose

GIN pending list and BRIN maintenance (kept in `postgresql/indexes.astro`); index internals (page layout, split algorithm); fill-factor tuning beyond one mention; partition-level rebuild strategy (one sentence, partitioning article); third-party tools (pg_repack, gh-ost, pt-online-schema-change) named in one sentence at most, not taught; extended statistics (`CREATE STATISTICS` stays in query-execution); hypothetical and invisible-index experiments for planning (the parent). SQL Server and Oracle are not covered.

## Neighbours (link, do not repeat)

Indexes (parent, bridge "Deleted rows and index size"); `postgresql/row-versions.astro` (why dead versions linger, vacuum horizon); `postgresql/indexes.astro#concurrently`; `slow-queries.astro` (statistics case and vacuum); `query-execution.astro` (estimates); `schema-changes.astro` (lock timeouts); `storage.astro` (pages).
