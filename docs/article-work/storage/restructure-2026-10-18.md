# Storage and durability restructure, 18 October 2026

Carried out against `docs/article-work/depth-derivation-2026-10-17/derived/storage-consolidated.md`
and `storage-comparison.md`, checked against the pages as they stood after the style pass.
The plan is the "Storage and durability" section of `docs/coverage/relational.md`.

## Reading times (rendered TitleLine, dev server)

| Page | Before | After |
|---|---|---|
| `storage` (deep dive) | 39 | 28 |
| `buffer-pool` (companion) | 23 | 9 |
| `watching-storage` → `checkpoints-and-the-log` (companion) | 31 | 19 |
| **Family total** | **93** | **56** |
| `backup-and-restore` (receives point-in-time recovery) | 10 | 14 |
| `slow-queries` (receives hit rate) | 9 | 11 |
| `postgresql/recovery` (receives field guides) | 11 | 17 |
| `postgresql/architecture` (receives eviction) | 14 | 18 |

The family now sits near the plan's 57 minutes. About 18 minutes moved to receiving pages
rather than being cut; the net site reduction is about 20 minutes.

## Decisions

- **Three articles, not two.** The buffer pool stays a slim companion (9 min). Readers
  arrive with the sizing question (`shared_buffers`, `innodb_buffer_pool_size`, max server
  memory), and folding about 1,500 words of working set, two caches, sizing and warm-up
  into the deep dive would bury its page-to-log-to-recovery argument. Eviction algorithms
  shrank to one section of three paragraphs; PostgreSQL internals went to the series.
- **`watching-storage` becomes `checkpoints-and-the-log`,** titled "Checkpoints, torn pages
  and the log". It now teaches the operator's cases (checkpoint costs and sizing, torn
  pages, trusting the flush, the log as a resource, restart time) and keeps the incidents
  and the signals table as reference. The name says what it covers; "watching" described a
  method that the PostgreSQL field guides took with them.
- **Point-in-time recovery moved whole to `backup-and-restore`.** That page taught the
  procedure and ran a real experiment, but not the mechanism: a running copy as a crashed
  disk, `full_page_writes` during backup, XtraBackup, archiving and recycling,
  `pg_stat_archiver`, timelines, `archive_timeout`, restore time growing with the log,
  MySQL binary-log recovery, SQLite's backup API and Litestream. The passage moved
  unshortened with its figure (restore-timeline) as a new section `#pitr`, "How
  point-in-time recovery works", before the experiment. Joins adapted: "You already know
  what repairs that" became "Crash recovery repairs exactly that" with a link to
  `storage/#recovery`; "The checkpoint section showed" became a linked sentence; the closing
  link to Backups and recovery became a lead-in to the experiment. The experiment's own h2
  became "Point-in-time recovery on a server", and its repeat of the "can't skip one
  transaction" point was trimmed to a back-reference. The deep dive keeps one paragraph and
  a link in `#loss`. **The teaching now lives only in `backup-and-restore#pitr`.**
- **Figure 14 (sync-standby) retired from the deep dive.** `replicas-and-failover#acknowledgements`
  already teaches the synchronous levels table; repeating it here was the comparison's
  main example of re-teaching. The scene stays in the shared model, unused.
- **Boundary with Indexes,** as agreed with idx-lead: Storage keeps page and row layout,
  row cost, large values, the table fill factor and HOT's free space (`#fill-factor`);
  Indexes keeps table order by key, key choice, index fill factor and splits. Storage links
  `indexes/#key-order` and `indexes/#splits`; Indexes links `storage/#fill-factor` and
  `storage/#pages`.

## What moved where

From `storage`:
- Checkpoints section (rounds or continuous, Figure 9 checkpoints, settings table, symptoms)
  → `checkpoints-and-the-log#checkpoints`, `#checkpoint-settings`, `#checkpoint-symptoms`.
  A short checkpoint paragraph stays in `storage#recovery`.
- Sizing between checkpoints: general method → `checkpoints-and-the-log#choosing-interval`;
  PostgreSQL trigger formula, Figure 10 checkpoint-sizing and the measured warning →
  `postgresql/recovery#max-wal-size`; `pg_stat_checkpointer` → `postgresql/recovery#reading-checkpoints`;
  InnoDB redo sizing → companion `#choosing-interval`.
- Log volume and retention → `checkpoints-and-the-log#log-volume`, `#retention`.
- Torn pages and checksums (Figure 11) → `checkpoints-and-the-log#torn-pages`, `#checksums`.
- `fsync` section: the mechanism and Figure 12 (now 9) stay in `storage#flush`, condensed
  to five paragraphs; layers table, failed flush, testing, flush time in production →
  `checkpoints-and-the-log#trust`, `#testing`; PostgreSQL flush columns →
  `postgresql/recovery#wal-flush-timing`.
- Synchronous replication → one sentence and a link in `storage#loss`.
- What the application knows after COMMIT → one sentence and a link in `storage#loss`.
- Backups and point-in-time recovery → `backup-and-restore#pitr` (see above); paragraph in
  `storage#loss`.
- "What to check" table → dropped; each check now sits with its teaching in the companion.

From `watching-storage`:
- Checkpoint log line, writers by backend in `pg_stat_io`, timed against requested →
  `postgresql/recovery#reading-checkpoints`.
- Recorded checkpoint cycle (inline SVG, now Figure 2) and the 1 GB against 64 MB table →
  `checkpoints-and-the-log#choosing-interval`.
- Failing-archive experiment and slot retention → companion `#retention`, compact.
- Flush time and wait events → `postgresql/recovery#wal-flush-timing` (PostgreSQL) and
  companion `#testing` (cross-engine).
- Reading a restart, end-of-WAL messages → `postgresql/recovery#reading-restart`;
  InnoDB and SQLite restart → companion `#restart`.
- Incidents and summary table → companion `#incidents`, `#summary`, condensed, with SQL
  Server added.
- Reporting basics (counters, resets, prerequisites) → a paragraph in companion `#summary`.

From `buffer-pool`:
- Clock sweep, ring, Figure 1 pool-scan, `pg_buffercache` query, usage counts as a gauge,
  autoprewarm detail, huge pages, `effective_cache_size` → `postgresql/architecture#eviction`.
- Hit rate (counter table, formula, misreadings, ratio SQL) → `slow-queries#hit-rate`, with
  a SQL Server row.
- InnoDB midpoint detail → one sentence in `buffer-pool#scans` and in the architecture figure text.
- Dirty-page eviction section → dropped; `storage#writers` teaches it.
- Online resizing → a sentence in `#knee`.

## What was cut and why

- `watching-storage`'s "Reads and the cache" and "Old row versions that pile up" sections:
  the first is the hit-rate material now in `slow-queries`; the second repeated
  `storage#versions` and `postgresql/row-versions#maintenance`. The companion's fourth
  incident links both.
- The SQLite LRU measurement, the InnoDB young/old monitor counters and detailed online
  resize behaviour in `buffer-pool`: product detail with no decision attached at the
  companion's depth.
- The storage "What to check" table: a repeat of checks taught where they belong.

## What was added, with sources

- `storage#row-size`: per-row overhead table and a worked comparison (PostgreSQL 132 bytes
  and 61 rows a page; SQL Server 107 bytes plus slot, 74 a page; InnoDB at least 18 bytes
  of header and transaction fields) and how to measure real size.
  - SQL Server formula: learn.microsoft.com/…/databases/estimate-the-size-of-a-heap
    (Row_Size = Fixed + Variable + Null_Bitmap + 4; Null_Bitmap = 2 + (cols+7)/8;
    rows per page = 8096 / (Row_Size + 2)). 100 + 3 + 4 = 107; 8096 / 109 = 74.
  - 14-byte versioning tag: the transaction locking and row versioning guide.
  - InnoDB 5-byte header, 6-byte transaction ID, 7-byte roll pointer, 6-byte row ID:
    MySQL 8.4 innodb-row-format.html and innodb-physical-structure.html.
  - PostgreSQL: storage-page-layout.html (24-byte header, 4-byte item pointer).
  - SQLite: fileformat2.html (varint record header, 2-byte cell pointer).
- `storage#large-values`: TOAST about 2 kB and 2,000-byte chunks, unchanged out-of-line
  values not rewritten (storage-toast.html); InnoDB DYNAMIC, 20-byte pointer, values of
  40 bytes or less kept in line, half-page row limit (innodb-row-format.html); SQL Server
  8,060-byte row, row-overflow 24-byte and LOB 16-byte pointers (pages and extents guide);
  SQLite overflow beyond U−35 as a linked list (fileformat2.html). The 1,900-byte example:
  24 + 1,900 + 100 bytes stays under PostgreSQL's 2,032-byte threshold, 4 rows a page
  against 61.
- `storage#versions`: SQL Server paragraph and table row (version store in tempdb, or the
  database with ADR; RCSI default in Azure SQL Database, off in SQL Server, where readers
  lock; long transactions stop shrinkage; `sys.dm_tran_version_store_space_usage`,
  `sys.dm_tran_persistent_version_store_stats`). Source: row versioning guide, ADR concepts.
- `storage#fill-factor`: reuse against return per engine (VACUUM, VACUUM FULL,
  OPTIMIZE TABLE with file-per-table default, DBCC SHRINKFILE fragmentation, SQLite VACUUM
  and auto_vacuum) and the table fillfactor 10–100, default 100, leaving room for HOT
  (sql-createtable.html storage parameters).
- `storage#writers`: SQL Server lazy writer and indirect checkpoints (database-checkpoints
  page: indirect default since 2016, 1-minute target).
- `storage#unfinished`: SQL Server undo time with the longest transaction; ADR since 2019,
  always on in Azure SQL Database, instant rollback and recovery (ADR concepts).
- `storage#settings`: SQL Server delayed durability (DISABLED, ALLOWED, FORCED;
  `COMMIT WITH (DELAYED_DURABILITY = ON)`; flush on full buffer, a durable commit or
  `sp_flush_log`). Source: control-transaction-durability.
- `storage#relaxed-commits`: visible before durable; SQL Server warns a planned shutdown
  can lose delayed-durable commits (same page); PostgreSQL immediate shutdown counts as a
  crash and empties unlogged tables (pg_ctl and unlogged-table docs).
- Companion SQL Server material: checkpoint settings row and symptom row
  (database-checkpoints); torn pages detected only, error 824, suspect_pages, page restore,
  automatic page repair in availability groups (ALTER DATABASE SET PAGE_VERIFY;
  automatic-page-repair page); log retention row and `log_reuse_wait_desc`, error 9002
  (the transaction log; troubleshoot a full transaction log); `WRITELOG` waits; ADR and
  restart time; summary column.
- Companion `#write-cost`: tally from the mechanisms above, no new facts.
- Companion `#trust`: SQLite on network file systems (howtocorrupt.html, broken locking).
- `buffer-pool`: SQL Server max server memory default effectively unlimited, set it
  (server-memory-server-configuration-options).
- `slow-queries#hit-rate`: SQL Server row (`Buffer cache hit ratio` over its base counter,
  `Page reads/sec` cumulative in the DMV).

All Microsoft URLs were fetched on 18 October 2026 and returned 200; the page-verify link
first chosen returned 404 and was replaced with the ALTER DATABASE SET options page, which
confirms CHECKSUM, error 824 and torn-page detection.

## Redirects and anchor changes

- Alias added in `src/lib/relational-collection.ts`: `"watching-storage": "checkpoints-and-the-log"`.
  `watching-storage.astro` was removed so the alias route serves; the dev server answers
  302 to `/learn/databases/relational/checkpoints-and-the-log/`.
- Storage group entries updated: storage and buffer-pool descriptions and scopes;
  the third entry renamed (slug, title, description, scope), status still draft.
- `storage` anchors removed: `#checkpoints`, `#rounds-or-continuous`, `#checkpoint-settings`,
  `#choosing-interval`, `#seeing-checkpoints`, `#log-volume`, `#torn-pages`, `#checksums`,
  `#flush-asks`, `#flush-breaks`, `#flush-check`, `#flush-watch`, `#with-replicas`,
  `#after-commit`, `#backups`, `#copying`, `#archive`, `#replay`, `#cost`, `#engines`,
  `#checks`. Added: `#row-size`, `#large-values`, `#fill-factor`, `#relaxed-commits`.
  Kept: every other id.
- `buffer-pool` anchors removed: `#eviction`, `#lru`, `#clock`, `#ring`, `#midpoint`,
  `#seeing`, `#dirty`, `#hit-rate`, `#resizing`, `#warming`. Added `#scans`.
- New anchors elsewhere: `backup-and-restore#pitr` (with `#pitr-copying`, `#pitr-archive`,
  `#pitr-replay`, `#pitr-cost`, `#pitr-engines`); `slow-queries#hit-rate`;
  `postgresql/recovery#reading-checkpoints`, `#max-wal-size`, `#reading-restart`,
  `#wal-flush-timing`; `postgresql/architecture#eviction`.
- Inbound links changed: `postgresql/recovery` (`storage/#backups` → `backup-and-restore/#pitr`).
  A grep of `src/` finds no remaining link to a removed anchor or to `watching-storage`.

## Style-skill example passages

- Figure 4 through the naming of the write-ahead log: unchanged in `storage#dirty` and
  `storage#wal`.
- The Row versions opening and the table after Figure 3: in `storage#versions`. The
  opening is unchanged. A SQL Server paragraph now sits after the InnoDB paragraph and the
  table has a SQL Server row; the existing rows are unchanged.
- The Backups and point-in-time recovery opening: moved verbatim to
  `backup-and-restore#pitr`, apart from linking "crash recovery" in its third paragraph.

## Checks

- Headless Chromium (playwright-core 1.62.1), 375 px, light and dark, reduced motion in
  the dark run: all seven pages have no horizontal scroll, no console errors, and every
  StepFigure has its controls. Moved figures (companion Figure 2, backup Figure 1,
  architecture Figure 1) were inspected in dark mode.
- Site-check rules run against copied dev HTML: no issues on the seven pages except two
  pre-existing dev-mode download URLs on `backup-and-restore` that the build rewrites.

## Unsure

- The style of `postgresql/recovery.astro` and `backup-and-restore.astro` predates the
  house voice; the added sections follow the house voice, so the pages now mix two.
- The sync-standby scene is unused. `replicas-and-failover` could adopt it at
  `#acknowledgements`, or it could be removed from the model.
- The companion's summary table is 52rem wide with a SQL Server column; it scrolls inside
  its region at 375 px.
- No MySQL or SQL Server instance was run. Everything about them is from the manuals; the
  SQL Server row sizes are worked from Microsoft's formula, not measured.
- `indexes.astro`'s further-reading line still describes Storage as covering "VACUUM and
  HOT updates"; Storage now mentions both but teaches neither in depth. Left for idx-lead.

## Repairs after review

From the editorial, technical and first-reading reviews of 18 October.

- Reading times after: storage 30 minutes (from 28), companion 19, buffer pool 9, backup and
  restore 14, slow queries 11, recovery 17, architecture 18.
- Storage deep dive: page LSN defined before Figure 4; the write-ahead rule stated where the
  log is named, with its reason; torn pages named in `#recovery` with full-page images and
  doublewrite, linked to the companion; a retry sentence beside Figure 8, and `#loss` cut to
  a reminder; SQLite WAL mode introduced with a forward reference and the "once instead of
  twice" contradiction removed; SQL Server versioning corrected (ADR versions every
  modification, on by default in Azure) and the table row relabelled; rebuild versus shrink
  corrected; SQLite cell length fields, the TOAST header and the DMV mode added; delayed
  durability rephrased as what the mechanism implies; one name, "asynchronous commit";
  hedges trimmed. The h3 "Space reused, rarely returned" is now "Free space and fill
  factor" (id `#fill-factor` kept), and HOT is named where it is described.
- Companion: the replay rate marked as a warm-cache ceiling; jump peaks given as between 4
  and 5.5 MB/s; section order now matches the opening (checkpoints, torn pages, log volume,
  trust, restart); `#restart` reduced to a reminder pointing at the deep dive and the
  series; the cross-references fixed.
- Buffer pool: usage count defined at `#knee`; "Starting points" is a four-row table. No
  figure added: the pool-scan figure in `postgresql/architecture#eviction` already shows the
  mechanism, and a copy would duplicate it.
- Receiving pages: `postgresql/recovery` says 560 MiB and its `#flush` joins point to the
  companion's `#testing` and to `#policy`; `backup-and-restore` uses "WAL" throughout
  `#pitr`, bridges P7/P8 to orders 101 to 103, teaches stopping early once (in
  `#pitr-cost`), ties `archive_timeout` to the RPO, and its Figure 1 now pauses on timeline 1
  and starts timeline 2 only at promotion (new step 8 in `restore-timeline`);
  `architecture#eviction` defines the shop's 501 pages and the 16 MB pool;
  `slow-queries#hit-rate` says "nearly every page".
- The sync-standby scene stays unused: `replicas-and-failover#acknowledgements` already
  teaches the same levels with a table and the mug example.
- Evidence: an 18 October section in `evidence.md`.
- Second round, after the editorial re-read: the LSN gloss moved into Figure 4's caption;
  the repeated sentence at the end of the companion's first `#restart` paragraph cut; link
  wording redone across the family so each link names its destination page as an object
  or at the end of a sentence, never as the subject; P7 introduced as a mug at
  `backup-and-restore#pitr-replay`; `#physical`'s first paragraph cut to a pointer back.
