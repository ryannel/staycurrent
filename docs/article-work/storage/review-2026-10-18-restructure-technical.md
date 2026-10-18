# Technical review of the Storage and durability restructure, 18 October 2026

Perspective: technical reviewer and figure tester. I read the writer's note, the family's
section of `docs/coverage/relational.md` and `evidence.md`, then the seven rendered pages
from the dev server: `storage`, `checkpoints-and-the-log`, `buffer-pool`,
`backup-and-restore` (`#pitr`), `slow-queries` (`#hit-rate`), `postgresql/recovery` and
`postgresql/architecture` (the new sections). I checked new and moved claims against the
Microsoft Learn pages, the MySQL 8.4 manual, the SQLite file format and the PostgreSQL 18
manual and `REL_18_STABLE` source. I ran no database. I changed no file except this one.

Most of the new material holds up. The SQL Server row arithmetic is right, the TOAST,
InnoDB, SQL Server and SQLite large-value rules match their sources, and the PostgreSQL
source still says what the moved checkpoint and ring claims rely on. Four sentences are
wrong and one is misleading. Each needs a short fix. Every figure works from the
keyboard, with reduced motion, at 375 px and 1280 px, in light and dark. Every internal
link and anchor on the seven pages resolves, and no link in `src/` points at a removed
anchor.

## Repairs

### 1. Storage says SQL Server keeps old versions only under snapshot isolation. With ADR it keeps them for every change

`storage#versions`, the SQL Server paragraph: "SQL Server keeps old versions only when
read committed snapshot or snapshot isolation is on." The ADR concepts page says ADR
works "by versioning all physical database modifications", and its persistent version
store holds those versions whatever the isolation setting. ADR is always on in Azure SQL
Database and Managed Instance. The same page says so itself in `#unfinished` ("keeps old
versions in the database itself"), and the companion's `#restart` repeats it. A reader
who has ADR on and RCSI off would conclude, wrongly, that nothing can make the database
grow with old versions, and would skip `sys.dm_tran_persistent_version_store_stats`.

Repair: "SQL Server keeps old versions when read committed snapshot or snapshot
isolation is on, and for every change when accelerated database recovery is on, as it
always is in Azure SQL Database." Relabel the table row "SQL Server, with versioning or
ADR on".

### 2. Rebuilding doesn't give SQL Server's space back to the operating system

`storage#fill-factor`, the list of rewrites: "SQL Server returns space with DBCC
SHRINKFILE, which moves pages and leaves indexes fragmented, or by rebuilding." An index
rebuild packs the table into fewer pages, but the space it frees stays inside the data
file. Only shrinking the file gives it back. The list exists to tell the reader which
operation returns space and what it costs, so this mix-up leads straight to the wrong
operation.

Repair: "SQL Server's rebuild packs the table inside its file; only DBCC SHRINKFILE
returns the space, and it moves pages and leaves indexes fragmented."

### 3. The companion's reading of Figure 2 claims a jump that the third checkpoint doesn't show

`checkpoints-and-the-log#choosing-interval`, after Figure 2: "the log rate jumps at
every checkpoint start, from under 3 MB a second to over 5". In the figure's data
(`run` in `checkpoints-and-the-log.astro`) the jumps reach 5.31 at 33.6 s and 5.18 at
61.8 s, but only 4.27 at 90.2 s. The rendered chart shows that third peak clearly below
the 5 gridline. A reader who checks the drawing against the sentence finds the sentence
wrong.

Repair: "from under 3 MB a second to between 4 and 5.3".

### 4. The restart reading gives mebibytes as megabytes

`postgresql/recovery#reading-restart`: "The positions are byte offsets, so recovery
replayed 560 MB". 0x6A1D6808 − 0x47181CB8 is 587,549,520 bytes: 560.3 MiB, or 588 MB.
The deep dive and the companion take care over this unit ("566 MiB (594 MB)"), and this
page's own figure works in MiB. Repair: "560 MiB".

### 5. Backup Figure 1 opens the restored server on timeline 2, which needs promotion

`backup-and-restore#pitr`, Figure 1's last step: "The server opens on timeline 2", and
the paragraph after it says "The restored server also starts a new history from 13:59".
A new timeline begins only when archive recovery ends. With the default
`recovery_target_action = pause`, the server stops at the target, read-only, still on
timeline 1. The experiment two sections later on the same page uses exactly that pause.
A reader who runs it will see no timeline 2 and wonder which account is right. This text
moved unchanged from Storage, but its new neighbour exposes the gap.

Repair: in the step text, "Recovery is ended and the server opens on timeline 2". In the
timeline paragraph, "Once it is promoted, the restored server starts a new history".

## Smaller points

- **SQLite's per-row overhead** (`storage#row-size` table) lists "one small
  variable-length integer per column, the rowid, and a 2-byte cell pointer". Each cell
  also has a payload-length varint, and each record header starts with a header-length
  varint (fileformat2, "B-tree Cell Format" and "Record Format"). That's two more
  bytes or so; add "and two length fields" to make the row complete.
- **The 1,900-byte example** (`storage#large-values`) holds, but more narrowly than the
  writer's note shows. The working there, 24 + 1,900 + 100 = 2,024, leaves out the
  4-byte varlena header, so the tuple is 2,028 bytes. That is still under
  `TOAST_TUPLE_THRESHOLD`, which is 2,032 (`MaximumBytesPerTuple(4)` in
  `heaptoast.h`), and still four rows a page. But at about 1,905 bytes TOAST would start
  compressing. Record the corrected working in the evidence file. The text needs no
  change.
- **`slow-queries#hit-rate`**, fifth item: "A sequential scan through PostgreSQL's buffer
  ring counts every page as a read". Pages the scan finds already cached still count as
  hits. "Nearly every page" is accurate, because the ring keeps the table out of the
  pool. The same item uses "buffer ring" without saying what it is. Linking it to
  `buffer-pool#scans` would fix that.
- **`buffer-pool#knee`** uses "a usage count of 0 or 1" as a cheap reading. Now that
  the clock sweep has moved to the series, this page never says what a usage count is
  or that `pg_buffercache` shows it. Add a clause and a link to
  `postgresql/architecture#eviction`.
- **`storage#row-size`**: `sys.dm_db_index_physical_stats` reports the average record
  size only in `SAMPLED` or `DETAILED` mode. Its default, `LIMITED`, returns NULL.
- **SQL Server delayed durability in the `#loss` table**, "up to a log buffer's worth":
  this is a fair reading, but Microsoft's page states no bound. It says only that the
  engine "does attempt to flush" on log generation and timing, with no guarantee. The
  `#relaxed-commits` advice to run `sp_flush_log` before a planned shutdown is a sound
  inference from the page, not a sentence in it.
- **The evidence record.** `evidence.md` ends at the 17 October sixth pass. None of the
  18 October claims are in it: the SQL Server row sizes, version store, ADR, delayed
  durability, page verify, log reuse, InnoDB row fields and large values. Their sources
  appear only in the writer's note. Add a dated section, with the SQL Server working and
  the corrections above, so that the next reviewer checks against the evidence file.

## Claims checked and confirmed

**Row size.** PostgreSQL: 24-byte header + 100 + 4 padding = 128, + 4-byte line pointer
= 132; (8,192 − 24) / 132 = 61. The figure's other sizes check out the same way: 40 bytes
gives 120 rows, 250 gives 28, 1,000 gives 7 and 2,000 gives 4. A 2,000-byte row (2,024
bytes as a tuple) stays below 2,032, so it is not toasted. SQL Server, from "Estimate
the size of a heap": Null_Bitmap = 2 + ⌊(4 + 7) / 8⌋ = 3; Row_Size = 100 + 0 + 3 + 4 =
107; Rows_Per_Page = ⌊8,096 / (107 + 2)⌋ = 74. The working is correct, and the table
describes the formula's parts accurately (4-byte header, bitmap of 2 bytes plus a bit
per column, 2 + 2 per variable column, 2-byte slot, 8,096 bytes for rows). InnoDB: 5 + 6
+ 7 = 18 bytes, plus 6 with no primary key, matches `innodb-row-format.html` and
`innodb-physical-structure.html`. Ten million rows at 61 a page is 163,935 pages, 1.34
GB.

**Large values.** TOAST target about 2 kB, `TOAST_MAX_CHUNK_SIZE` about 2,000 bytes,
unchanged out-of-line values kept on UPDATE (`storage-toast.html`). InnoDB DYNAMIC:
longest columns moved off-page until the record fits, a 20-byte pointer, TEXT/BLOB of 40
bytes or less in line, about half a page as the row limit. SQL Server, from the pages
and extents guide, fetched 18 October: 8,060-byte row, row-overflow widest column first
with a 24-byte pointer, LOB types in row when they fit, otherwise a 16-byte pointer.
SQLite: payload beyond U − 35 spills to a linked list of overflow pages.

**Fill factor and HOT.** Table `fillfactor` 10 to 100, default 100. `VACUUM` truncates
only trailing empty pages. `VACUUM FULL` rewrites under ACCESS EXCLUSIVE. `OPTIMIZE
TABLE` rebuilds InnoDB tables, and file-per-table is on by default.

**SQL Server.** RCSI default in Azure SQL Database. 14 bytes per versioned row.
`sys.dm_tran_version_store_space_usage` and `sys.dm_tran_persistent_version_store_stats`
exist. ADR: introduced in 2019, always on in Azure SQL Database, recovery from the last
checkpoint, instant rollback (concepts page, fetched). Delayed durability: DISABLED
(default), ALLOWED or FORCED; `COMMIT WITH (DELAYED_DURABILITY = ON)` is valid syntax,
because TRAN is optional; flushes on a durable commit or `sp_flush_log`; a planned
shutdown is treated like a crash (page fetched). Indirect checkpoints with a 60-second
target for databases created since 2016. Page verify CHECKSUM by default, error 824,
`suspect_pages`. `log_reuse_wait_desc` values; error 9002.

**Relaxed commits.** PostgreSQL: 600 ms = 3 × `wal_writer_delay`; per transaction. InnoDB
0/1/2 table as already reviewed. SQLite WAL + NORMAL. `pg_ctl stop -m immediate` leads to
crash recovery and unlogged tables are emptied.

**Checkpoints and recovery as moved.** `CalculateCheckpointSegments` in `REL_18_STABLE`
`xlog.c` rounds `max_wal_size / (1 + checkpoint_completion_target)` down to 33 segments
at the defaults. `XLogCheckpointNeeded` fires at the redo segment + 32, so 512 to 528
MiB, as stated. The worst case is close to `max_wal_size`. The figure's numbers check
out: 539 MiB, 19 s and 6 s at 1 GB; 2.1 GiB, 77 s, 24 s and 48 s at 4 GB; 154 s, 48 s and
97 s at 8 GB. InnoDB rollback "three or four times" (`innodb-recovery.html`) and "several
times" (`optimizing-innodb-transaction-management.html`) are both quotes from their own
pages. Killing the server doesn't help. Level 3 of `innodb_force_recovery` is the
documented route. `log_checkpoints` is on by default. Checkpoint log fields. `pg_stat_checkpointer`
from version 17. The `pg_stat_io` WAL columns and `track_wal_io_timing` are new in 18.
`log_startup_progress_interval` is 10 s. Statistics are reset after crash recovery.

**Buffer pool and eviction.** Ring sizes in `freelist.c` (`REL_18_STABLE`): BULKREAD
starts at 256 kB and grows up to the per-backend pin limit, which scales with
`NBuffers`. So "the ring grows with the pool" is source-accurate, and 32 pages per
process in a 16 MB pool fits. BULKWRITE is 16 MB and VACUUM 2 MB. A table smaller than a
quarter of the pool gets no ring. Usage count up to 5. InnoDB `innodb_old_blocks_time`
is 1 s; `innodb_buffer_pool_dump_pct` is 25. `innodb_dedicated_server` uses 75% above 4
GB. The pool needs about 10% extra. SQL Server max server memory is effectively
unlimited by default. The sizing table and warm-up arithmetic recompute as stated.

**Hit rate.** InnoDB read_requests include misses. SQL Server's ratio needs its base
counter, and `Page reads/sec` is cumulative in the DMV. `SQLITE_DBSTATUS_CACHE_HIT` and
`MISS` exist.

**PITR as moved.** A running copy is repaired like a crashed disk. The backup forces a
checkpoint and `full_page_writes`. Archiving is recycle-after-success. Recovery target
types. Timelines. `archive_timeout`. XtraBackup's prepare step. The binary log is kept
30 days by default. `mysqlbinlog` stop semantics. SQLite backup API and `VACUUM INTO`.

## Figures

I ran headless Chromium (playwright-core 1.62.1) over all seven pages in four settings:
375 px dark with reduced motion, 375 px light, 1280 px light with reduced motion, and
1280 px dark. There are 15 step figures (ten on Storage, two in the companion, one each
on backup, recovery and architecture) and six static figures. Buffer-pool has no figure
now; the shared pool-scan scene it used to carry is `postgresql/architecture` Figure 1,
tested there.

- No horizontal page scroll and no console errors on any page in any setting. Every
  table sits in a focusable `role="region"` scroller.
- Keyboard, for every step figure: Enter on Reset goes to step 1; Enter, then Space, on
  Next goes to step 3; Back goes to 2; End on the scrubber goes to the last step; Home
  and then ArrowRight go to step 2. Tab from Play reaches Back. I pressed every
  parameter button with Enter and stepped to the end. The SVG never overflowed its
  figure, and `aria-pressed` tracked the choice.
- Reduced motion: each figure rests on its last step and doesn't advance on its own.
  Without it, each figure autoplays once scrolled into view, after its first hold
  (checked over 7 s).
- Dark mode: I inspected screenshots of Storage Figure 4, companion Figures 1 and 2,
  backup Figure 1, recovery Figure 1 and the page-redo figure, and architecture Figure
  1. Labels and chips are legible, and the coral and amber states are distinct. A
  computed-contrast scan flagged chip text against the page background. Every flag was
  dark text on a light chip, so none is a problem.

## Links, anchors and the redirect

- `GET /learn/databases/relational/watching-storage/` returns a 302 to
  `/checkpoints-and-the-log/`. The URL without the trailing slash returns 404 in dev,
  the same as every other alias under `trailingSlash: 'always'`. The static build emits
  Astro's redirect page from the same `getStaticPaths`.
- Every internal `href` on the seven pages returns 200, and every fragment exists on its
  target. Inbound links from the rest of `src/` into the family (`storage/#fill-factor`,
  `#pages`, `#versions`, `#recovery`, `#flush`, `#unfinished`, `#recovery-time`, the
  companion's four anchors, `buffer-pool/#cold`, `#too-small`, `#two-caches`,
  `backup-and-restore/#pitr`, `slow-queries/#hit-rate`, the four new recovery anchors
  and `architecture/#eviction`) all resolve.
- A grep of `src/` for each removed Storage and buffer-pool anchor, and for
  `watching-storage`, finds nothing except the alias entry.
- External links: all 75 non-MySQL URLs return 200. `dev.mysql.com` and
  `bugs.mysql.com` answer 403 to curl, which is bot blocking. WebFetch read the two
  MySQL pages I needed (`innodb-recovery.html` and
  `optimizing-innodb-transaction-management.html`) without trouble.
- Collection: the storage group lists `checkpoints-and-the-log` under its new title,
  still marked as a working draft, so planned coverage stays distinct from available
  reading.

## Verdict

**Ready after the listed repairs.** The restructure kept the family's technical
backbone. Moved claims reached their new pages intact, and the PostgreSQL source still
supports the trigger rule and the ring. The new cross-engine material is mostly
accurate, including the SQL Server sizes worked from Microsoft's formula. Repairs 1 and
2 matter most: they would send a SQL Server reader to the wrong conclusion about version
growth and the wrong operation for reclaiming space. Repairs 3 to 5 are wording that
contradicts the page's own data or a neighbouring section. All five are one-sentence
edits that need only a look at the rendered page afterwards, plus the evidence-file
entry.
