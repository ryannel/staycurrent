# The buffer pool: evidence

Checked 17 October 2026. Documentation pinned to PostgreSQL 18, MySQL 8.4 and the
current SQLite site; PostgreSQL source at REL_18_STABLE; SQLite source at master
(`src/pcache1.c`). Pages were fetched and read as text, not paraphrased from memory.

## Documented claims

| Claim in the article | Source | Notes |
| --- | --- | --- |
| `shared_buffers` default typically 128MB; set only at server start; 25% of RAM a reasonable start on a dedicated server with ≥ 1 GB; "unlikely" that more than 40% works better because PostgreSQL relies on the OS cache; larger settings usually need a larger `max_wal_size` | https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-SHARED-BUFFERS | Quoted wording paraphrased in the article. |
| `work_mem` default 4MB, per sort/hash operation, several per query and per session; total "many times" the value | same page, `work_mem` | Used for the memory budget. |
| `vacuum_buffer_usage_limit` default 2MB, capped at 1/8 of shared_buffers | same page | VACUUM ring. |
| `effective_cache_size` default 4GB, planner-only, allocates nothing | https://www.postgresql.org/docs/18/runtime-config-query.html#GUC-EFFECTIVE-CACHE-SIZE | One sentence, to stop readers confusing it with a cache. |
| `blks_hit` counts only PostgreSQL buffer-cache hits, "not the operating system's file system cache" | https://www.postgresql.org/docs/18/monitoring-stats.html (pg_stat_database) | Basis for "a read may be an OS-cache hit". |
| `pg_stat_io`: per backend type/object/context; `hits`, `reads`, `evictions`, `reuses`; contexts `normal`, `bulkread`, `bulkwrite`, `vacuum`; docs: "A high evictions count can indicate that shared buffers should be increased"; times need `track_io_timing` | same page, 27.2.13 | Column list checked for 18 (has `read_bytes`, no `op_bytes`). |
| `EXPLAIN ANALYZE` includes buffer counts automatically in 18 | https://www.postgresql.org/docs/18/sql-explain.html | "Buffers information is automatically included when ANALYZE is used." |
| `pg_buffercache` view (`usagecount`), `pg_buffercache_summary()`, `pg_buffercache_usage_counts()`, `pg_buffercache_evict*()` (developer testing, superuser) | https://www.postgresql.org/docs/18/pgbuffercache.html | `evict_relation`/`evict_all` are new in 18; used only in our experiments. |
| `pg_prewarm(regclass, mode)` modes `prefetch`, `read`, `buffer`; autoprewarm via `shared_preload_libraries`; `autoprewarm.blocks`; two background workers reload after restart; `pg_prewarm.autoprewarm` on by default; interval 300 s; prewarmed pages get no special protection | https://www.postgresql.org/docs/18/pgprewarm.html | |
| Clock sweep: usage count incremented on pin up to a small limit, hand decrements nonzero counts and takes the first zero | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/storage/buffer/README ("Normal Buffer Replacement Strategy") | |
| Maximum usage count is 5 | `src/include/storage/buf_internals.h`, `BM_MAX_USAGE_COUNT` | |
| A newly loaded buffer starts at usage count 1; a ring (strategy) access never raises the count above 1 | `src/backend/storage/buffer/bufmgr.c` (`BUF_USAGECOUNT_ONE` on load; `PinBuffer` strategy branch: "Ring buffers shouldn't evict others from pool") | |
| Sequential scans of a table larger than a quarter of shared buffers use the bulk-read ring | `src/backend/access/heap/heapam.c`, `initscan`: `scan->rs_nblocks > NBuffers / 4` | |
| Bitmap heap scans don't use the ring: `table_beginscan_bm` sets `SO_TYPE_BITMAPSCAN` and `SO_ALLOW_PAGEMODE` but not `SO_ALLOW_STRAT` | `src/include/access/tableam.h` (REL_18_STABLE) | Index scans go through the buffer manager without a strategy; observed in e1. |
| Ring sizes: bulk read starts at 256 kB, grown for I/O concurrency but capped by the per-backend pin limit; bulk write (COPY, CREATE TABLE AS) 16 MB; VACUUM 2 MB / `vacuum_buffer_usage_limit`; a bulk UPDATE/DELETE that dirties ring pages degrades to the normal strategy | `src/backend/storage/buffer/freelist.c` `GetAccessStrategy`; README "Buffer Ring Replacement Strategy" | README's "16MB (but not more than 1/8th of shared_buffers)" for bulk write. Article says "under a megabyte with default settings" from the observation below, not from the formula alone. |
| `debug_io_direct` exists but "reduces performance, and is intended for developer testing only" | https://www.postgresql.org/docs/18/runtime-config-developer.html | So ordinary PostgreSQL 18 data I/O goes through the OS cache. |
| InnoDB buffer pool caches table and index data; "up to 80% of physical memory is often assigned" on dedicated servers; LRU variant with midpoint insertion; old sublist 3/8; new pages inserted at the head of the old sublist; Standard Monitor BUFFER POOL AND MEMORY fields incl. "Pages made young", "not young", "youngs/s", "Buffer pool hit rate" | https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool.html | That page also says "By default, pages read by queries are immediately moved into the new sublist"; the scan-resistance page and the variable reference describe the 1000 ms window that applies to pages accessed in quick succession. The article follows the latter and says so in prose ("a page read and used again within a second stays old"). |
| `innodb_old_blocks_pct` default 37 (range 5–95); `innodb_old_blocks_time` default 1000 ms: a block stays in the old sublist until accessed at least that long after its first access; scans touch a page "a few times in quick succession" | https://dev.mysql.com/doc/refman/8.4/en/innodb-performance-midpoint_insertion.html and https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html#sysvar_innodb_old_blocks_time | Both dynamic (SET GLOBAL). |
| `innodb_buffer_pool_size` default 134217728 (128 MB), dynamic; "On a dedicated database server, you might set the buffer pool size to 80%"; total allocation about 10% larger than the setting for control structures | https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html#sysvar_innodb_buffer_pool_size | |
| `innodb_flush_method` default on Unix: `O_DIRECT` if supported, otherwise `fsync`; `O_DIRECT` opens the data files with O_DIRECT | same page, `innodb_flush_method` | 8.4 change from 8.0. |
| `innodb_buffer_pool_instances`: 1 if pool ≤ 1 GiB; otherwise min(½ × size/chunk, ¼ × logical CPUs), 1–64; not dynamic | same page | Only used for the resize rounding. |
| `--innodb-dedicated-server`: pool 128 MB below 1 GB RAM, 50% for 1–4 GB, 75% above 4 GB; not recommended when sharing the host | https://dev.mysql.com/doc/refman/8.4/en/innodb-dedicated-server.html | |
| Online resize: `SET GLOBAL innodb_buffer_pool_size`; performed in chunks of `innodb_buffer_pool_chunk_size` (128M default); size rounded to a multiple of chunk × instances (9G with 16 instances becomes 10G); resize waits for active transactions to complete before starting; new transactions needing the pool wait until it finishes (except during defragmenting/withdrawing pages when shrinking); progress in `Innodb_buffer_pool_resize_status` | https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool-resize.html | The waits are the operational point. |
| Dump/load: saves a percentage of most-recently-used pages per pool instance at shutdown and reloads at startup; `innodb_buffer_pool_dump_pct` default 25; `innodb_buffer_pool_dump_at_shutdown` and `innodb_buffer_pool_load_at_startup` ON by default; file `ib_buffer_pool` holds only tablespace and page IDs; loading in the background, does not delay startup; `innodb_buffer_pool_dump_now`, `_load_now`, `_load_abort`; `Innodb_buffer_pool_load_status` | https://dev.mysql.com/doc/refman/8.4/en/innodb-preload-buffer-pool.html and `innodb-parameters.html` | |
| Status variables: `Innodb_buffer_pool_read_requests` (logical reads), `Innodb_buffer_pool_reads` (could not be satisfied from the pool, read from disk), `Innodb_buffer_pool_wait_free` (waits for a clean page; "should be small"), `Innodb_buffer_pool_pages_dirty`, `_free`, `_total`, `Innodb_buffer_pool_read_ahead_evicted` | https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html | |
| `INFORMATION_SCHEMA.INNODB_BUFFER_POOL_STATS` has `PAGES_MADE_YOUNG`, `PAGES_NOT_MADE_YOUNG`, `HIT_RATE` (per thousand) | https://dev.mysql.com/doc/refman/8.4/en/information-schema-innodb-buffer-pool-stats-table.html | |
| SQLite `cache_size`: per open database file, default -2000 (2,048,000 bytes); negative values mean KiB; reverts when the database is closed and reopened; allocated as needed | https://www.sqlite.org/pragma.html#pragma_cache_size | |
| `sqlite3_db_status` `SQLITE_DBSTATUS_CACHE_HIT`, `_MISS`, `_USED`, `_SPILL` | https://www.sqlite.org/c3ref/c_dbstatus_options.html | CLI `.stats on` prints "Page cache hits/misses". |
| Default page cache keeps unpinned pages on an LRU list | https://github.com/sqlite/sqlite/blob/master/src/pcache1.c (header comments, `pLruNext`/`pLruPrev`) | Source, not documentation; the article says "a plain least-recently-used list". |
| Shared-cache mode obsolete and discouraged | https://www.sqlite.org/sharedcache.html | One clause. |
| File change counter lets other processes detect changes and flush stale caches; WAL mode uses the wal-index | https://www.sqlite.org/fileformat2.html §1.3.6 | Basis for "a connection's cache is checked, and dropped if another connection wrote". |
| `mmap_size` default usually 0 (off); memory-mapped reads share pages with the OS page cache; disadvantages (I/O errors become signals; needs a unified buffer cache) | https://www.sqlite.org/mmap.html and pragma page | |

## Local observations

All on one MacBook (Apple silicon, Darwin 25.6), 17 October 2026. Scripts and raw
output are in this directory. These are observations of mechanism (which pages stay),
not performance measurements. Times are shown only where they show the OS cache at
work, and the article says so.

**PostgreSQL 18.6 (Homebrew)**, scratch cluster, `shared_buffers = 16MB` (2,048
buffers), `track_io_timing = on`, `pg_prewarm` preloaded. Tables from `setup.sql`; `pgstatindex('page_views_pkey')`: tree level 2, 13 internal pages, 3,279 leaves; the remaining page of the 3,293 is the metapage, so 13 pages, root included, sit above the leaves.
Tables:
`products` 444 pages + `products_pkey` 57 pages; `page_views` 14,815 pages +
`page_views_pkey` 3,293 pages.

- `e1.sql` / `e1.out`: after warming, products 444 buffers (avg usage 5.0), pkey 57
  (4.9). Parallel sequential scan of `page_views` (`shared read=14815`): afterwards
  `page_views` holds 96 buffers (three processes × 32), products and pkey unchanged; the
  next products scan `shared hit=444`. The same rows read through the primary-key
  index (`shared hit=3082 read=18093`): afterwards only page_views (1,708) and its index
  (340) remain; the products scan reads `shared read=444`, I/O time 1.571 ms. The
  18,093 reads are the table's 14,815 pages plus nearly all 3,279 leaves. The 1.571 ms
  was measured with asynchronous, combined reads (`io_method = worker`,
  `io_combine_limit = 128kB`), so it is wait time for about 28 I/Os, not a per-page
  cost; the article now uses e5 instead (reviewer finding).
- `e2.sql` / `e2.out`: same warm start, serial index range scans of about 3,000 pages
  each. After the first: products 444 buffers and pkey 56 still cached (500 of 501),
  average usage 1.0 (was 5.0). After the second: neither remains.
- Default pool, one serial sequential scan: with `shared_buffers = 128MB` the
  `page_views` scan left 94 buffers (≈ 750 kB) in the pool.
- Ring size, from source (`freelist.c` `GetAccessStrategy`, `bufmgr.c`
  `MaxProportionalPins = NBuffers / (MaxBackends + NUM_AUXILIARY_PROCS)`, `postinit.c`
  `InitializeMaxBackends`, `proc.h`): the bulk-read ring wants 256 kB +
  8 kB × `io_combine_limit` (16) × `effective_io_concurrency` (16) = 2,304 kB, capped at
  max(256 kB, pin limit × 8 kB) and at NBuffers/8. With this cluster's settings
  (read back with `pg_settings`): MaxBackends = 100 connections + 16 autovacuum slots +
  8 worker processes + 10 WAL senders + 2 special = 136; auxiliary = 6 + 32 I/O
  workers = 38; 174 in all. 16 MB: 2,048 / 174 = 11 buffers (88 kB) < 256 kB floor,
  so 32 buffers, matching e1's 32 per process. 128 MB: 16,384 / 174 = 94 buffers,
  matching the observation. The full 2,304 kB (288 buffers) needs about 50,000
  buffers, roughly 390 MB.
- `e3.sh` (run interactively; output transcribed here): `autoprewarm_dump_now()`
  wrote 507 blocks; after `pg_ctl restart` the log said "autoprewarm successfully
  prewarmed 507 of 507 previously-loaded blocks", products had 444 buffers and the
  products scan was `shared hit=444`. With `pg_prewarm.autoprewarm = off` and another
  restart: no products buffers; first scan `shared read=444`, second `shared hit=444`.
  `SELECT pg_prewarm('products'), pg_prewarm('products_pkey')` returned 444 and 57.

- `e3.sh`: the 507 blocks are the shop's 501 pages plus six other pages cached at the
  time; e4 shows catalog pages (pg_proc, pg_amop, pg_attribute) in the pool alongside the
  shop, so catalogs are the likely remainder.
- `e4.sql` / `e4.out` (working-set estimate from usage counts): after evicting all,
  warming the shop and an index range scan of 100,000 page_views rows,
  `pg_buffercache_usage_counts()` gave 1,178 buffers at 0, 310 at 1, 28 at 2, 11 at 3,
  10 at 4, 511 at 5. Buffers at 2 or more: products 444, products_pkey 56, then
  catalog pages. Another pass of shop lookups: 540 at 5. Basis for the article's
  usage-count method; it is a rough indicator, not a measure.
- `e5.sql` / `e5.out` (per-page cost of an OS-cache "read"): `io_method = sync`,
  `io_combine_limit = 1` (one 8 kB read call per page), restored to defaults
  afterwards. products evicted from shared buffers, then scanned: `shared read=444`,
  I/O time 1.271 ms; again 0.958 ms. 2–3 µs a page, well under a single random read
  from an SSD (tens of microseconds or more, general knowledge, not measured here). Not
  run: a cold-OS-cache contrast, which would need `sudo purge` on macOS.
- Context, not measured: PostgreSQL 18 `hash_mem_multiplier` default 2.0;
  `shared_memory_size_in_huge_pages`; `huge_pages = try` falls back silently
  (runtime-config-resource). `pg_buffercache_summary()` reports `buffers_unused`
  (pgbuffercache). Autoprewarm reloads only after a server start (pgprewarm), so not at
  promotion.

**SQLite 3.54.0 (Homebrew)**, `sqlite-cache.sh` / `sqlite-cache.out`: WAL mode,
4,096-byte pages, `cache_size = -2000`; products 771 pages, page_views 3,852 pages.
`SELECT sum(price) FROM products` twice: first 773 misses, second 4 hits and 768
misses — a table larger than the cache gets almost nothing from it on a repeat scan.
The repeat scan makes 772 requests (4 + 768): the table's 771 pages plus the schema
page (sqlite_schema, 1 page). The first scan's 773 misses include one more page read
while opening the database.
After a page_views scan (3,852 misses) the products scan had 1 hit (the schema page)
and 771 misses: all of the table's pages.
macOS's system `/usr/bin/sqlite3` (3.51.0) is compiled with
`DEFAULT_CACHE_SIZE=2000` (pages, about 8 MB); the article uses the documented default.

Not run: MySQL/InnoDB (no local server). Every InnoDB statement is documented
behaviour; the figure's midpoint policy is a model of it.

## Arithmetic and models

- Sizing table: a modelled workload, stated in the article (100 GB database; 99% of
  40,000 page requests a second fall on an 8 GB hot set; the rest spread evenly; an
  ideal cache that keeps the hot set first). Hit rate = 0.99 × min(P, 8)/8 +
  0.01 × max(P − 8, 0)/92. Not a benchmark.
- Cold-cache time: 16 GB / 8 kB = 2,097,152 pages; at an assumed 5,000 random reads a
  second about 420 s. Assumption stated in the article.
- Hit-rate inflation: a three-level B-tree lookup requests root, branch, leaf and table
  page; with root and branch always cached and the other two always missing, the ratio is
  50%. Mechanism, not measurement.
- Memory budget on a 64 GB host: arithmetic from the documented starting points.

## Figure

`src/components/explainers/storage/model/pool.ts` (scene `pool-scan`). Eight slots;
policies as documented above, simplified: the ring is two slots; the midpoint model
treats every report page as reused within a second (so never promoted) and every
shop access as a reuse more than a second later. Outcomes checked by script (all
policy × length combinations): LRU loses all four shop pages for 8 or 24 report
pages; clock sweep keeps all four at count 1 after 8 and loses all four after 24;
ring and midpoint keep all four for both lengths.

## What would warrant revisiting

A new major release of either server: recheck the clock-sweep description, the
ring sizes and the `pg_stat_io` columns against PostgreSQL's next release, and the
resize and dump/load behaviour against the MySQL release the collection moves to.
