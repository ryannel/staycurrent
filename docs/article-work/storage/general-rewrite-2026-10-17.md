# Storage and durability: from a PostgreSQL article to a general one

Commissioned 17 October 2026. The user: "it's quite postgres specific and it's
meant to be a general article in the relational database section", citing the
opening ("Once PostgreSQL tells your application that COMMIT succeeded ...").
The article names no other database; most section headings are PostgreSQL
features (heap, shared buffers, VACUUM and HOT, full_page_writes, fsync = off,
unlogged tables), and it overlaps the PostgreSQL series' Row versions and
Recovery articles.

## What the reader came for
The reader understands tables, a simple query and a transaction, uses some relational
database, and wants to know what happens below the interface and what a successful
commit preserves. They should finish able to distinguish buffered state, durable log
records, table-file contents, row-version visibility and what the application knows
after a commit, in any mainstream engine, and recognise where their engine's choices
change the answer. They should also understand why crash recovery is not a backup.

## The shared mechanism (general names)
Rows live in fixed-size pages; pages are read into a memory cache (buffer pool);
changes are made there and recorded in a write-ahead (redo) log; commit waits for
the log to reach durable storage; dirty pages are written later; checkpoints bound
replay; crash recovery replays the log; a page half-written by a crash needs repair;
settings and hardware caches can weaken the promise; backups and point-in-time
recovery answer a different failure.

## Where engines differ (say so where it changes a prediction)
- Old row versions: PostgreSQL keeps them in the table and VACUUM removes them;
  InnoDB keeps the current row in place and older versions in undo logs, purged
  in the background; SQLite has no concurrent writers' versions in that sense.
- Torn pages: PostgreSQL full-page images in WAL; InnoDB doublewrite buffer.
- Logging: PostgreSQL WAL; InnoDB redo log (plus undo); SQLite rollback journal or
  WAL mode, which changes when a commit is durable and what readers see.
- Commit durability settings: PostgreSQL synchronous_commit; InnoDB
  innodb_flush_log_at_trx_commit; SQLite synchronous. Name the shared trade-off once.
- Table layout: PostgreSQL heap; InnoDB clustered on the primary key (the Indexes
  article explains this; link rather than repeat).

## The job
- Rewrite the opening and headings in general terms (the user-quoted opening is the
  test case). PostgreSQL 18 remains the worked example for the P7 price change and
  the existing figures; present it as one implementation.
- Move PostgreSQL-only depth to the PostgreSQL series as real explanation:
  TOAST and heap page layout to `postgresql/architecture.astro` (Inside PostgreSQL),
  fsync, fsync = off, synchronous_commit detail, unlogged tables and full_page_writes
  detail to `postgresql/recovery.astro`; VACUUM and HOT to `postgresql/row-versions.astro`
  only where it is not already covered (it covers HOT and vacuum at length; prefer a
  link). Do not duplicate what those articles already teach.
- Keep Sources and further reading last; add primary sources for InnoDB and SQLite.

## Evidence
Primary documentation with versions: MySQL 8.4 Reference Manual (InnoDB buffer pool,
redo log, undo logs, purge, doublewrite buffer, innodb_flush_log_at_trx_commit,
checkpoints), SQLite (atomic commit, rollback journal, WAL mode, synchronous pragma),
PostgreSQL 18. Record claims in docs/article-work/storage/evidence.md under a dated
heading.

## Boundaries
Not a product comparison; no new file-format reference. Keep the article about the
length it is now; the PostgreSQL-only material leaving should make room for the
comparisons.

## Handoff (writer, 17 October 2026)

### What changed
- `storage.astro` rewritten in general terms. The opening now says what durability
  is for any relational database, names PostgreSQL 18 as the labelled worked example
  and InnoDB and SQLite as comparisons. TitleLine version: "PostgreSQL 18, with
  InnoDB (MySQL 8.4) and SQLite comparisons". Page description updated.
- Headings: Rows live in pages; A cache of pages in memory; Updating a row without
  overwriting it; Changed pages wait in memory; The log is written before the pages;
  Crash recovery; Checkpoints bound the replay; Pages torn by a crash; Whether a flush
  reaches the disk; Trading durability for speed; Backups and point-in-time recovery;
  Sources and further reading (last).
- Comparisons added where a reader's prediction changes: heap vs clustered vs rowid
  B-tree; page sizes; buffer pool sizing (25% vs 80%, OS cache vs O_DIRECT); old
  versions (table + VACUUM, undo + purge, SQLite readers/WAL); redo log vs rollback
  journal vs SQLite WAL; InnoDB redo-then-undo recovery with background rollback;
  checkpoint triggers; full-page images vs doublewrite buffer vs journal/frame
  checksums; commit durability settings in all three; MySQL binary-log PITR.
- Figures: the VACUUM and HOT figure (old Figure 4) and its section were removed from
  the page; the rest are renumbered 1 to 10 (cross-references updated). Titles of
  PostgreSQL-specific figures now begin "PostgreSQL:". The `vacuum` scene remains in
  `model/pages.ts` and `model/index.ts`, now unused; delete it if you want no dead code.
- Reading time drops a little (VACUUM, settings detail left); comparisons filled the room.

### What moved where
- `postgresql/architecture.astro`: page header (24 bytes), line pointer size (4 bytes),
  free space between, row-version header and alignment with the 100-byte example,
  and the roughly 2 kB threshold at which TOAST is considered.
- `postgresql/recovery.astro`: new section "When a flush does not reach the disk"
  (fdatasync, OS and drive caches, power-loss protection, pg_test_fsync, 120 flushes a
  second arithmetic, managed services); torn-page limits (no image means no repair,
  checksums default in 18, ZFS); async commit mechanics (WAL writer, 200 ms, up to
  600 ms), the per-transaction SQL example, fsync = off and unlogged tables.
- `postgresql/row-versions.astro`: one sentence that a snapshot holds back cleanup
  across every table in its database. VACUUM, HOT, pruning, fillfactor and VACUUM FULL
  were already taught there and are now only linked.

### Unsure
- InnoDB `innodb_flush_log_at_trx_commit = 2`: "server crash loses nothing" is not on
  the manual page; it only says "lost in a crash". Stated as widely documented.
- "InnoDB defaults to O_DIRECT so bypasses the OS cache" and "SQLite cache is per
  connection" rest on the manual's default plus general knowledge.
- "InnoDB keeps no checkpoint timer" is inferred from the redo-log page.
- MySQL PITR via binary log: the subpage was not read.
- Figure 8's step text (data checksums default in PG 18) and Figure 5/6 labels remain
  PostgreSQL-specific by design; check the "PostgreSQL:" title prefixes read well.

### For review
- Run `pnpm build` / `pnpm check` (not run by me, to avoid clashing with the parallel
  writer); I ran `pnpm test` (passes) and confirmed the four pages return 200 on the
  dev server with Figures 1 to 10 in order.
- Read the new Crash recovery and Pages torn paragraphs for density; they carry three
  engines each. Cross-check the architecture and recovery additions in their contexts.
- No git state changed.

## Handoff after review repairs (writer, 17 October 2026)
`pnpm build` passes with all 13 site-check rules ok. No git changes.

- Storage article: opening cut to the definition, the P7 change and the question;
  versions section reduced to the three-engine comparison with the durability bridge;
  Crash recovery, Checkpoints and Pages torn now answer the shared question first and
  give InnoDB its own paragraph; SQLite's journal is told once, with an announced
  switch; checkpoints defined generally (PostgreSQL bursts, InnoDB continuous, figure
  labelled as the burst model); dropped-connection text became its own section,
  "What the application knows after COMMIT", with the network-fault case first;
  flush-count test restricted to spinning disks; SQLite defaults, WAL/NORMAL risk and
  backup answer added; `sync_binlog` added; 35/12 images derived.
- Figures: Figure 3 (row versions) removed from the page along with the unused
  `rowVersions` and `vacuum` scenes; now nine figures. Figures 2, 6, 8 prefixed
  "PostgreSQL:". Figure 1 text says 132. Clock-sweep step shortened; checkpoint figure
  groups records per interval; the async figure ends with one restart step.
- Receiving pages: recovery keeps PostgreSQL specifics and links to Storage for the
  drive-level explanation; duplicates cut; unlogged tables not replicated; ZFS wording;
  `max_wal_size` advice moved here; architecture layout numbers in own paragraph with
  "100 bytes of column data" and corrected TOAST clause; snapshot-reach sentence moved
  into "Long-lived snapshots and vacuum".
- Outside my file list: `postgresql/indexes.astro` linked to `storage/#vacuum`, a
  heading that no longer exists, so the build failed. I repointed that one link to
  `row-versions/#hot`.
- Declined: nothing outright. I kept the SQLite and InnoDB lines about O_DIRECT and
  fuzzy checkpoints as the accuracy review reports them without re-fetching those pages.
- Doubts: SQLite `journal_mode = DELETE` default not fetched; value 2 wording is
  reasoning (see evidence); whether removing Figure 3 is wanted (restorable from git).

## Handoff after the depth pass (writer, 17 October 2026)
Changed `relational/storage.astro` and the storage figure model. No git changes. `pnpm build`: every rule passes except `internal-links`, which fails on every page with `no page at /learn/databases/relational/watching-storage/`. That page is registered by the other writer and does not exist yet. Storage links to the two companions only once their files exist (`fs.existsSync` in the frontmatter), so Storage itself adds no failing link; the failure is from the collection navigation. Re-run the build once `watching-storage.astro` lands.

Section-by-section depth decisions are in the report to the coordinator. New figures: Figure 5 (`group-commit`, a labelled model) and Figure 7 now has an engine toggle (burst or continuous) with full-page-image and replay stats. Figures renumber 1 to 11. Deleted nothing.

Open for review: the unverified list at the end of the fifth-pass section of `evidence.md`; whether the checkpoint-sizing arithmetic (two figures marked as arithmetic) is acceptable; whether the article is now too long to read in one sitting (about 9,000 words of prose).

## Handoff: repair pass from two reviews (17 October 2026)
Edited `storage.astro` and `model/log.ts` (checkpoint param value `burst` to `rounds`). `pnpm build` and `pnpm test` pass. Evidence in `evidence.md`, sixth pass.
Moved out to links: the checkpoint log line (Watching `#checkpoint-line`, `#timed-requested`, `#innodb-checkpoint`), the annotated restart log and InnoDB restart phases (`#restart`), log-rate sampling and retention experiments (`#log`, `#retention`), pg_stat_io and dirty-share observation (`#writers`), hit-rate/25%/80%/O_DIRECT detail (buffer pool `#two-caches`).
Kept against the notes: the `checkpointWarning` excerpt and `pg_stat_checkpointer` query (the one signal for log size); the InnoDB LSN query (now used for sizing); the SQLite journal/WAL and checkpoint-starvation asides where they change a prediction.
