# Storage and durability: accuracy and generality review, 17 October 2026

Reviewer: independent technical and editorial read of `relational/storage.astro` after
the general rewrite, plus the three receiving PostgreSQL articles. Sources were fetched
on 17 October 2026 from the MySQL 8.4 Reference Manual, sqlite.org and PostgreSQL 18
documentation. Nothing was run; every verdict is a documentation verdict. No article
files were edited.

## Step 0: coverage I expected before reading the article

For developers who use some relational database and are new to storage internals,
under the title "Storage and durability", with the outcome "distinguish buffered
state, durable log records, table-file contents, row-version visibility and what the
application knows after a commit, in any mainstream engine":

1. What durability promises and what it does not (the application's view of COMMIT).
2. Pages as the unit of storage and IO; how pages form a table (heap vs B-tree) and
   that indexes are pages too, changed and logged by the same machinery.
3. The in-memory page cache, dirty pages, eviction.
4. Why not just write pages at commit: random writes, partial writes.
5. The write-ahead (redo) log: ordering rule, sequential cost, group commit.
6. Crash recovery: redo, undoing unfinished work, what "recovery start point" means.
7. Checkpoints and the replay-versus-write-cost trade.
8. Torn pages and the engine-specific repairs.
9. Whether the flush is honest: OS cache, drive cache, power-loss protection.
10. Commit-durability knobs and what each costs; the dangerous ones.
11. Old row versions and where they live, briefly (the outcome names visibility).
12. Crash recovery is not backup; PITR; replicas as a third, different layer.
13. Where the application's knowledge ends (dropped connection after COMMIT).

Comparison I expected: PostgreSQL, InnoDB, SQLite, with SQLite's rollback journal
presented as the odd one out (it forces pages at commit, the reverse of the others).

Against that, the article covers 1, 3 to 10, 12 (replicas only in passing) and 13. It
covers 11 at more length than a general article needs (see finding 5). Thin: item 2's
"indexes are pages too" (only a figure caption and one clause) and replication as a
durability layer (one sentence in Backups, one in Trading durability).

## Findings, ranked by consequence

### 1. The checkpoint definition and "InnoDB keeps no checkpoint timer" (imprecise, and it is the general definition that is off)

Article, Checkpoints: "A **checkpoint** writes the pages dirtied before a chosen
point in the log to disk, then records that recovery can start there ... InnoDB keeps
no timer. It has a fixed amount of redo log space (`innodb_redo_log_capacity`) and
flushes dirty pages more aggressively as the log fills."

What the manual says:
- InnoDB "implements a checkpoint mechanism known as fuzzy checkpointing. InnoDB
  flushes modified database pages from the buffer pool in small batches." It does not
  flush in one batch. Recovery "looks for a checkpoint label ... all modifications to
  the database before the label are present in the disk image."
  https://dev.mysql.com/doc/refman/8.4/en/innodb-checkpoints.html
- Flushing is done by page cleaner threads; an adaptive flushing algorithm adjusts
  the rate "based on the speed of redo log generation and the current rate of
  flushing"; `innodb_max_dirty_pages_pct` (default 90) is a second driver: "InnoDB
  aggressively flushes buffer pool pages if the percentage of dirty pages ...
  reaches" it; a "sharp checkpoint" forced when the log is full causes a throughput
  drop. https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool-flushing.html
- Redo capacity: lower occupancy flushes "less aggressively", higher flushes "more
  aggressively". https://dev.mysql.com/doc/refman/8.4/en/innodb-redo-log.html

Verdicts:
- "Flushes more aggressively as the log fills" is correct.
- "No timer" is defensible only as "no `checkpoint_timeout` setting". It is not
  documented either way; the manual describes continuous background flushing by page
  cleaners, so an InnoDB reader will picture flushing happening all the time, not
  waiting for a trigger. The omission of the dirty-percentage driver and of
  continuous (fuzzy) flushing is the real gap. Writer's own evidence note admits
  "No timer" is inference. Rate: imprecise.
- The general definition ("writes the pages dirtied before a chosen point, then
  records that recovery can start there") is PostgreSQL's shape (choose a redo point,
  flush everything dirty, record it). InnoDB's checkpoint is a moving label: pages are
  flushed continuously and the label advances as the oldest dirty page goes out. A
  reader who runs InnoDB is told something different from what their engine does.
  Figure 7 (checkpoints as discrete events, "pages written by checkpoints") cannot
  show the InnoDB model at all, and its caption says nothing of that.

Repair. Define at the level both share: "A checkpoint is a log position before which
every change is already in the table files; recovery starts there, and the log before
it can be reused." Then the engines' ways of getting there: "PostgreSQL does it in
bursts: every 5 minutes or when the log nears 1 GB, it writes out the dirty pages and
records the position, spreading the writes. InnoDB does it continuously, in small
batches ('fuzzy' checkpointing): background threads write dirty pages at a pace set by
how fast the redo log fills and how many pages are dirty, and the checkpoint position
advances behind them. When the redo log is nearly full it must wait for these writes
(a 'sharp' checkpoint) and throughput drops." Say once that the figure uses PostgreSQL's
burst model. Add `innodb-checkpoints.html` and `innodb-buffer-pool-flushing.html` to
the sources.

### 2. `innodb_flush_log_at_trx_commit = 2` and a server-process crash (correct by mechanism; the manual does not say it and its wording points the other way)

Article: "At 2 it writes at each commit but flushes about once a second, so a crash of
the server process loses nothing and a crash of the operating system loses up to a
second."

Manual (innodb-parameters.html): at 2 "logs are written after each transaction commit
and flushed to disk once per second. Transactions for which logs have not been flushed
can be lost in a crash." It also says "any unexpected mysqld process exit can erase up
to N seconds of transactions" (under `innodb_flush_log_at_timeout`, which governs 0
and 2). So the manual, read literally, says a process exit can lose a second.
https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html

Why the article's claim still holds by mechanism: "written" means handed to the
operating system, and the same manual page says `O_DIRECT` is used "to open the data
files, and uses fsync() to flush both the data and log files", so the redo log goes
through the OS cache. A process death leaves that cache intact; an OS crash or power
loss does not. That is also the article's own Figure 9 logic. So: correct, but an
inference the reader cannot confirm in the cited page, and a reader who checks the
page finds a sentence that appears to contradict it. I could not find a primary
MySQL 8.4 sentence that states the distinction (I did not get a MariaDB page to load).

Repair, no extra length: "At 2 it hands the log to the operating system at each
commit but flushes it only about once a second. If just the MySQL process dies, the
operating system still holds those writes; if the machine loses power or the kernel
crashes, up to a second of commits goes." Keep it in the evidence note as reasoning
from "written, not flushed", and note that the manual's wording on process exit is
looser. Mention that at 0 even a process crash can lose a second (it keeps the log in
the process's own buffer until the once-a-second write), which is the practical
difference between 0 and 2. (That last point is from how the log buffer works, not a
quote; verify before stating.)

### 3. "InnoDB's default is to open its files with `O_DIRECT`" (imprecise)

Manual: `innodb_flush_method` default on Unix is "O_DIRECT if supported, otherwise
fsync"; with O_DIRECT, InnoDB "uses O_DIRECT ... to open the data files, and uses
fsync() to flush both the data and log files." So data files only; the redo log is
buffered by the operating system. Claim "bypasses the operating system's cache" is
true of the buffer pool's data pages, not of the log. The "up to 80%" claim is
correct ("On dedicated servers, up to 80% of physical memory is often assigned to the
buffer pool", innodb-buffer-pool.html); 128 MB default is correct (shown in
innodb-buffer-pool-resize.html). The PostgreSQL 25% is a "reasonable starting value"
for a dedicated server with 1 GB or more, and the docs add that more than 40% is
unlikely to help because PostgreSQL relies on the OS cache (runtime-config-resource).

Repair: "InnoDB's default on Linux is to open its data files with `O_DIRECT`, which
bypasses the operating system's cache for table pages (the log still goes through it)".

### 4. Statements that would mislead someone running InnoDB or SQLite

a. Opening, third paragraph: "A report that runs for hours can make busy tables keep
growing, because the database can't discard old copies of rows the report might still
need ... chasing a table that won't stop growing." In InnoDB the old copies are in
undo, so the tables do not bloat; the history list grows (the manual's purge page:
long transactions raise `History list length`). In SQLite rollback mode a long reader
blocks the writer instead. The sentence is PostgreSQL behaviour stated as general in
the page's own lede. Repair: "can make the database keep old versions of rows (as
bloat in the table in PostgreSQL, as a growing undo log in InnoDB, or as a writer
that cannot commit in SQLite's default mode)", or keep the reader-facing symptom
short: "chasing storage that won't stop growing".

b. Changed pages wait in memory: "The obvious fix is to write page 12 to the table
file before replying. That's slow ... It isn't safe either." and Figure 4 "A database
without a log". SQLite's default mode does exactly this (writes the changed pages to
the database file and flushes before the commit), made safe by the journal; the
article says so two sections later. The argument is right for the log-based engines;
it should be scoped, not universal. Repair: "Most engines do not make that trade ...
SQLite's default does write the pages at commit, and pays for it with a journal (see
below)."

c. Crash recovery: "In PostgreSQL, recovery compares each record's LSN with the LSN on
the page it changes." InnoDB does the same (pages carry the LSN of their last
change; redo is applied only where the page is older). Framed as "In PostgreSQL" it
suggests InnoDB differs. Same for "In PostgreSQL, each page remembers the LSN of the
last record that changed it" in The log. Repair: "In PostgreSQL and InnoDB each page
remembers ..." (SQLite WAL does not use page LSNs; the sentence can say so).

d. Versions: "SQLite ... In its default rollback-journal mode, a writer needs every
reader to finish before it can commit, so readers and the writer take turns." The
first half is right (pending lock then exclusive lock). The second half overstates:
sqlite.org's atomic-commit page says a reserved lock lets readers continue while the
writer prepares changes in its cache; only the final write waits, and new readers are
refused during the wait. Repair: "a writer can prepare its changes while readers
read, but cannot write them to the file until the readers finish, and new readers wait
while it does."

e. Section opening, Updating a row: "So engines keep the old value for as long as some
reader needs it" is then contradicted for SQLite default mode in the next paragraph.
Change to "Most engines keep ...".

f. The flush test: "A disk spinning at 7,200 rpm turns 120 times a second ... a result
in the thousands means a cache is answering." This works only for spinning disks. On a
SSD or NVMe drive with power-loss protection, thousands of honest flushes a second are
normal; the arithmetic cannot tell an honest SSD from a lying one. The recovery article
conditions it ("from such a disk"); the general article reads as a universal test.
Repair: add "For a rotating disk"; for SSDs, say the check is whether the drive has
power-loss protection or reports flushes honestly (the PostgreSQL docs point to
`diskchecker.pl` for this), not a count.

g. The torn-page paragraph assumes 512-byte sectors ("A PostgreSQL page is 16 sectors
and an InnoDB page is 32"). PostgreSQL's reliability page says sectors are "commonly
512 bytes". Many drives now write 4 KiB. Repair: "traditionally 512-byte sectors,
which gives 16 for PostgreSQL's page and 32 for InnoDB's; drives with larger sectors
tear less often but a page is still more than one sector".

h. Durability settings, InnoDB: with the binary log on (the 8.4 default), commit
durability and the replication and point-in-time story also depend on
`sync_binlog`. A MySQL reader who sets `innodb_flush_log_at_trx_commit = 1` and
believes COMMIT is durable has not checked the binary log. The article uses the binary
log for PITR two sections later without connecting the two. Not wrong, but it is the
engine difference most likely to bite; one clause under the InnoDB bullet fixes it
(verify `sync_binlog` default and wording in the 8.4 manual before writing; I did not
fetch it).

### 5. Remaining PostgreSQL-only material in the general article

- "Updating a row without overwriting it" is about a sixth of the page. After the
  engine comparison paragraph the section follows PostgreSQL: xmin, xmax, snapshots,
  Figure 3, "Take PostgreSQL's way", VACUUM, a link to the PostgreSQL sandbox lesson.
  The comparison itself earns its place; the xmin/xmax walk-through is the PostgreSQL
  series' Row versions article (`postgresql/row-versions.astro` teaches it at length).
  Proposed repair: keep the opening paragraph, the three-engine comparison and the
  "readers don't block writers" conclusion; shorten xmin/xmax to two sentences (a
  version records who created it and who replaced it; a query compares that with the
  moment its snapshot was taken) and link; keep Figure 3 only if the section stays
  the page's only MVCC picture. If the figure goes the page also loses a PG-only
  model, which suits the brief.
- `ctid` query and "(12,3)" is labelled as PostgreSQL ("Ask PostgreSQL where P7 is
  stored"); acceptable as the worked example.
- Checkpoint paragraph: "A background writer flushes some dirty pages early ... a
  query that finds none writes one out itself. If PostgreSQL's server log warns that
  checkpoints are occurring too frequently, raise `max_wal_size`." Both sentences are
  PostgreSQL, one unlabelled until the second. InnoDB's page cleaners and adaptive
  flushing are the equivalent (see finding 1); either generalise or move to the
  PostgreSQL recovery article.
- Figure titles: Figures 1, 3, 5, 6, 8 and 10 begin "PostgreSQL:" (or name it); 2
  ("Four buffer slots above the table file"), 4 ("A database without a log"), 7
  ("Checkpoint interval") and 9 ("The flush path") do not, but 2, 7 and 9 are
  drawn with "Shared buffers" lanes, "WAL" and "PostgreSQL WAL buffers" (model files
  `pages.ts`, `log.ts`, `server.ts`), and the text beside them says "Watch a few
  PostgreSQL queries". The inconsistent prefix leaves readers unsure which figures are
  general. Either prefix 2, 7 and 9 (4 is explicitly hypothetical) or rename them so
  the engine-specific parts are in the caption ("Shared buffers here is PostgreSQL's
  name for the buffer pool"). Figure 8's step text says "data checksum, on by default
  in PostgreSQL 18"; it is on by default for new clusters made by initdb in 18
  (release notes E.6.2; pg_upgrade requires matching settings, so upgraded clusters
  keep what they had). "For new clusters" matches `recovery.astro`.
- SQLite rollback-journal recovery is told three times: in The log is written ("After
  a crash, a journal that is still there means the commit never finished, and SQLite
  copies the saved pages back"), in Crash recovery ("SQLite in rollback-journal mode
  skips replay: it restores the journal's saved pages"), and in Torn pages ("the
  journal holds the original page and recovery restores it"). Keep it in the log
  section; in the other two say only what differs (no replay; the original is the
  repair).
- The Backups paragraph is general and correct.

### 6. PostgreSQL claims in the general page and receiving articles: verification table

| Claim | Verdict | Source |
| --- | --- | --- |
| shared_buffers 128 MB default; 25% starting value on a dedicated server | correct | PG 18 runtime-config-resource |
| WAL on commit, group commit, LSN per page | correct | wal-intro |
| checkpoint_timeout 5 min, max_wal_size 1 GB, writes spread over most of the interval, "too frequently" warning advises max_wal_size | correct | wal-configuration |
| full_page_writes on by default; first change after a checkpoint carries a full-page image | correct | runtime-config-wal |
| "up to 8 kB" per image | correct (can be compressed, `recovery.astro` says so) | |
| async commit loss window "about 600 ms" | correct for the default `wal_writer_delay` of 200 ms: the docs say the "maximum duration of the risk window is three times `wal_writer_delay`". Add "with the default setting" in the general article, which gives the number without the condition | wal-async-commit |
| "replies once the commit record is in the WAL buffers" | correct in effect (docs: commit before WAL flushed; WAL writer flushes) | wal-async-commit |
| data checksums default in PostgreSQL 18 | correct for new initdb clusters; `--no-data-checksums` opts out; pg_upgrade needs matching settings | release-18, E.6.2 |
| fsync=off may corrupt beyond repair; only if you can rebuild | correct | runtime-config-wal |
| unlogged tables skipped from WAL, truncated after a crash | correct (also not replicated; `recovery.astro` could add that, it matters for failover) | sql-createtable |
| ZFS as an example of storage that prevents partial page writes | correct (wal-reliability names ZFS). Phrase "as ZFS does" is stronger than the docs ("if your file system prevents partial page writes, e.g. ZFS") | wal-reliability |
| consumer SATA and many SSDs have volatile caches; many SSDs ignore flush by default; avoid non-battery controller caches; disable write-back cache if not guaranteed | correct | wal-reliability |
| 24-byte page header, 4-byte item identifiers | correct | storage-page-layout |
| 23-byte tuple header "on most machines", `t_hoff` a multiple of MAXALIGN | correct. With no nulls the header occupies 24 bytes after alignment | storage-page-layout |
| 100-byte row = 132 bytes (24 + 100, padded to 128, + 4) | arithmetic correct, assuming 8-byte MAXALIGN and "100-byte row" meaning 100 bytes of column data. Architecture says "100-byte row" without that, so a reader may add the header to 100; say "100 bytes of column data" | |
| "PostgreSQL considers this [TOAST] once a row grows past about 2 kB, because a row version cannot span two pages" | threshold correct (`TOAST_TUPLE_THRESHOLD`, "normally 2 kB"), but the causal clause is muddled. The no-spanning rule is why TOAST exists at all; the 2 kB figure is a design choice that lets several tuples share a page. Repair: "A row version cannot span two pages, so PostgreSQL moves or compresses wide values; it starts doing so once a row exceeds about 2 kB." | storage-toast |
| a snapshot holds back cleanup of dead versions on every table in its database | correct in effect (the retained horizon is per database); fits row-versions | row-versions context |
| `pg_test_fsync` arithmetic (120 flushes a second) | the 120 figure is arithmetic, not documented on the pg_test_fsync page (it has no rpm statement); say it is arithmetic | pgtestfsync |

### 7. InnoDB and SQLite verification table

| Claim | Verdict | Source |
| --- | --- | --- |
| InnoDB page 16 kB default, instance-time only | correct | innodb_page_size |
| InnoDB buffer pool 128 MB default | correct | innodb-buffer-pool-resize |
| "up to 80% of memory" on dedicated servers | correct, as "often" | innodb-buffer-pool |
| InnoDB clustered index holds rows; secondary index records hold PK | correct (the page does not literally say "primary-key order"; it says so only of the hidden row-ID case) | innodb-index-types |
| InnoDB undo + purge; history list length from long transactions | correct | innodb-undo-logs, innodb-purge-configuration |
| InnoDB redo has LSN; recovery from latest checkpoint LSN | correct | innodb-redo-log |
| InnoDB recovery: redo first, accepts connections, background rollback, lock conflicts meanwhile | correct | innodb-recovery |
| doublewrite buffer on by default; pages written there before their place; recovery uses it | correct; since 8.0.20 it lives in doublewrite files, which only matters if the article says "area" | innodb-doublewrite-buffer, innodb_doublewrite |
| flush warning "worst case, a power outage can corrupt InnoDB data" | correct; located in the Caution under `innodb_flush_log_at_trx_commit` | innodb-parameters |
| flush_log_at_trx_commit 1 / 0 / 2 | see finding 2 | |
| MySQL PITR: restore a full backup, then replay the binary log to a chosen point | correct. The binary log must be enabled (default on in 8.4) and is "the set of binary log files generated subsequent to the full backup". `mysqlbinlog` bounds by time or position. The article links the section intro `point-in-time-recovery.html`, not the binary-log page; link `point-in-time-recovery-binlog.html` instead | point-in-time-recovery, point-in-time-recovery-binlog |
| SQLite page 4 kB default since 3.12.0; 512 to 64 kB | correct | pragma.html#pragma_page_size |
| SQLite page cache about 2 MB, per connection | correct: default -2000 (2,048,000 bytes) "per open database file"; atomic-commit page describes each connection's private cache. Shared-cache mode is the exception; footnote not needed | pragma, atomiccommit |
| SQLite table B-tree keyed by rowid | correct for rowid tables; WITHOUT ROWID tables are keyed by primary key; "keyed by an integer rowid" is right for the default | fileformat2 |
| rollback-journal commit = journal deletion; hot journal triggers rollback | correct (journal modes TRUNCATE/PERSIST move the commit point) | atomiccommit |
| WAL mode: commit frame, end mark, one writer, readers and writer concurrent, checkpoint at 1,000 pages | correct | wal.html |
| first connection after a crash runs recovery; frames failing checksums ignored | recovery claim documented; the checksum detail is in the WAL file-format page, not wal.html. Cite the file-format page | wal.html, walformat |
| synchronous FULL default in rollback mode; NORMAL in WAL can lose durability, not consistency; OFF can corrupt | correct | pragma synchronous |
| quote "do not work as advertised on many systems" | the source sentence is "neither of these interfaces works as advertised on many systems" (section 9.2). Quote accurately or paraphrase | atomiccommit |
| SQLite "does not need" group commit | true in effect (one writer), phrase it as "has nothing to group" | wal.html |

### 8. Writing: passages that work and passages that strain

Works.
- "The application was told the change committed, and the change is gone." The step
  figure has just shown it; the sentence names the consequence in plain words and
  motivates the next section.
- "Writing the log is cheaper than writing the pages, because every record goes on
  the end of the same file. One flush can also serve many transactions." One cause,
  then the consequence that follows from it.
- "The database couldn't notice anything wrong with the second drive: it just answered
  too early." Concrete, and ties the three engines' warnings in without listing
  mechanics.
- Backups: "A replica on another server covers a lost disk, but it copies the delete
  too." The reader meets the case that makes the distinction.

Strains.
- Opening, paragraphs two and three. "The mechanism is much the same in every
  mainstream engine, and its details differ in a few places that change what you
  would predict" and "Come back to this article when you're deciding how your
  application retries, chasing a table that won't stop growing, or choosing write
  settings and disks" announce the lesson and the audience's use for it instead of
  starting on the subject. The house style skill warns against prose that announces its
  lessons. The second also carries finding 4a. The first paragraph is strong (durability
  defined by what it survives); the page can move to the P7 change a paragraph sooner.
- Crash recovery, third paragraph: "Recovery brings back exactly the transactions whose
  commit records reached disk. What happens to the rest depends on where old versions
  live. PostgreSQL may replay ... InnoDB replays ... SQLite in rollback-journal mode
  skips replay ... In WAL mode the first connection ..." Four engines, five mechanisms
  in one paragraph, each in one clause, with the reader's prediction (what happens to
  the unfinished transaction?) answered four different ways. The difference from the
  stronger passages: those give one cause and one consequence; this gives four
  parallel descriptions. Repair: keep the first sentence and the shared question
  ("what happens to the unfinished transaction?"). Answer it for PostgreSQL in one
  sentence (replayed, invisible). Give InnoDB its own short paragraph because its
  consequence reaches users (rolled back in the background; new connections can meet
  its locks). Fold the two SQLite sentences into the SQLite paragraph under The log
  is written (they are already there for the journal) so Crash recovery is not asked to
  carry them.
- Torn pages, last paragraph: "InnoDB keeps the copy somewhere else ... The result is
  the same, but the extra writes go to a separate area on every flush of a page, not
  in the log after each checkpoint. SQLite avoids the problem in rollback-journal mode
  ... and in WAL mode ..." The InnoDB half is good (one mechanism, one cost contrast).
  The SQLite half is a clause pair that restates earlier material (finding 5). Repair:
  end the InnoDB paragraph at "...after each checkpoint", and put SQLite in one
  sentence: "SQLite never overwrites a page it cannot restore: the rollback journal
  holds the original, and a WAL frame is checksummed."
- Checkpoints, "Engines choose when differently. PostgreSQL starts ...; InnoDB ...;
  SQLite ... Below, price changes arrive for products on pages 10 to 15." Three
  engines in three clauses, then the figure silently follows the first one. See
  finding 1 for the content repair; as writing, name the figure's model in the
  sentence that introduces it ("The figure uses PostgreSQL's burst model").
- Settings bullets are a fair use of a list (three engines, parallel). The second
  sentence of the PostgreSQL bullet ("The longest the loss can reach is about 600 ms")
  needs "with the default delay"; the InnoDB bullet needs finding 2.

### 9. The heading tree

```
h1 Storage and durability
  h2 Rows live in pages
  h2 A cache of pages in memory
  h2 Updating a row without overwriting it
  h2 Changed pages wait in memory
  h2 The log is written before the pages
  h2 Crash recovery
    h3 When the connection drops after COMMIT
  h2 Checkpoints bound the replay
  h2 Pages torn by a crash
  h2 Whether a flush reaches the disk
  h2 Trading durability for speed
  h2 Backups and point-in-time recovery
  h2 Sources and further reading
```

It reads as a map of one argument and in general terms: no engine name in any heading,
and the sequence pages, memory, dirty pages, log, recovery, checkpoints, torn pages,
flush, settings, backups follows the dependencies a reader needs. Weak points:

- "Updating a row without overwriting it" interrupts the durability thread (pages,
  cache, then versions, then back to dirty pages). The outcome includes row-version
  visibility, so it belongs, but it is the one heading whose content is the PG-only
  xmin walk-through (finding 5). Alternatively move it after Crash recovery, where
  "what happens to the unfinished transaction's versions" brings it back into the
  argument. If it stays, the section is shorter.
- "Crash recovery" is a plain label among otherwise claim-style headings ("Checkpoints
  bound the replay", "Pages torn by a crash"). Fine; a claim-style version
  ("Recovery replays the log from the last checkpoint") would match, but it is
  not needed.
- The lone h3 "When the connection drops after COMMIT" is about what the application
  knows, not about recovery. As a one-child subsection it weakens the tree. Consider
  moving it to follow Trading durability for speed, as its own h2 "What the application
  knows after COMMIT", which is the reader outcome's last clause.
- Density: Crash recovery and Pages torn by a crash are the two sections carrying
  four and three engines respectively; findings 5 and 8 propose the split. The
  Checkpoints section is a third (three engines plus a PG-model figure plus PG
  tuning advice).
- Missing against Step 0: a sentence that indexes are pages logged the same way (the
  Figure 2 caption concedes it); replication as a separate layer. Neither is essential
  to the argument but the second is the usual first answer to "what if the disk dies?",
  and the Backups paragraph handles it in one clause. No change required.

### 10. The three receiving PostgreSQL articles

`postgresql/recovery.astro`
- "When a flush does not reach the disk" fits: it comes after full-page images and
  before commit policy, and its first sentence ("Every ordering rule above rests on
  one report") links back to the earlier argument. The opening paragraph of the
  article already states what was and was not tested (no power failure, no honesty
  test), so the new section makes that limitation useful rather than contradicting it.
- Duplication with the general article: the 7,200 rpm / 120 flushes arithmetic, the
  power-loss-protection definition and the managed-service sentence appear in both
  almost word for word (the general article's flush section and this one). The
  PostgreSQL article should keep what is PostgreSQL's (the `fdatasync` default,
  `wal_sync_method`, `pg_test_fsync`, the reliability page's advice on controller
  caches) and let the general article keep the drive-level explanation. Pick one home
  for the rotation arithmetic and link; the general article is the better home.
- The policy section's first paragraph now says the same thing twice: "Recovery
  still preserves a consistent database under the supported storage settings; the
  changed promise is which recent successes are guaranteed to survive" and later
  "Recovery still replays what survived in order, so the database ends consistent but
  slightly behind what the application was told." Cut one. The 200 ms and three-cycle
  detail is the useful addition. Likewise the `fsync` paragraph now says
  "unrecoverable corruption" twice ("can allow unrecoverable corruption after a
  failure" and "can leave the database corrupt beyond repair"); keep the second and
  drop the first, then keep the "different" comparison sentence. The paragraph is also
  carrying fsync, then unlogged tables; split unlogged tables into its own short
  paragraph.
- The new `asyncCommit` SQL block is introduced with "which suits writes the
  application can afford to lose, such as a page-view counter" in a paragraph that
  otherwise has no example. It fits. The paragraph before it should end so the example
  reads as the page-view case, not as a continuation of the fsync discussion.
- The torn-page addition ("Without the image, a torn page cannot be repaired from the
  log ... Data checksums, on by default for new PostgreSQL 18 clusters, at least let
  recovery notice ...") is accurate and reads as explanation. "Turn `full_page_writes`
  off only when the storage itself guarantees whole-page writes, as ZFS does" is
  stronger than the docs (finding 6); say "such as ZFS, which the documentation names".
- Unlogged tables: add one clause that they are also not copied to standbys (the
  CREATE TABLE page says so); it changes the failover answer and the article ends on
  replication.

`postgresql/architecture.astro`
- The page-layout addition is accurate but is a row of figures wedged into a paragraph
  about indirection: the paragraph's last sentences go from "The index can keep
  referring to that item" to header sizes, free space and alignment, then to the
  documentation link. Put the layout in its own short paragraph after the indirection
  one, so the reader can take each separately.
- "A 100-byte row therefore takes about 132 bytes" needs "100 bytes of column data"
  (finding 6), or the reader adds a header and gets a different total.
- TOAST sentence: causal clause fix in finding 6. It also repeats the general
  article's out-of-line sentence ("values too wide for a page are stored elsewhere"),
  which is fine since the general article links here.

`postgresql/row-versions.astro`
- The sentence on a snapshot holding back cleanup across a database is correct, but
  it sits in "Diagnosing vacuum and retained versions", after the experiment, while
  the concept of a retained snapshot is introduced earlier in "Long-lived snapshots
  and vacuum". Move it to that section (one sentence after "The old version remains
  needed") so the reader meets the reach of a snapshot when they meet the snapshot.
  In the diagnosing section it reads as an afterthought to a query result. It does
  not duplicate other text (searched for "other tables", "every table", "whole
  database": none).

### 11. Sources, evidence note and process

- The article's Sources paragraph says "Checked on 17 October 2026"; the evidence
  note records that the MySQL binary-log subpage was not read and the PostgreSQL items
  were "not re-fetched". I have now read the binary-log page and all PostgreSQL pages
  above, so the claim holds after this review; before it, the date overstated.
  Update the note with what this review found (checkpoints, flush_log_at_trx_commit
  wording, O_DIRECT scope).
- Add to Sources: `innodb-checkpoints.html`, `innodb-buffer-pool-flushing.html`,
  `point-in-time-recovery-binlog.html`, `innodb-index-types.html`,
  `sqlite.org/fileformat2.html`. The brief required InnoDB and SQLite primary sources;
  the list has most but not those that back the checkpoint and PITR claims.
- The unused `vacuum` scene in `model/pages.ts` and `model/index.ts` is dead code
  (writer's note). Remove it if the figure will not return.

## Summary of what must change before this page can be called general

1. Checkpoint definition and InnoDB checkpoint description (finding 1).
2. Process-crash claim for setting 2, and O_DIRECT scope (2, 3).
3. The PostgreSQL-shaped statements in the lede, the "write pages first" argument and
   "In PostgreSQL" LSN sentences (4a to 4c), and the SQLite reader/writer phrase (4d).
4. Trim the xmin/xmax material in the versions section, or move the section later
   (5, 9).
5. Remove the triple SQLite recovery statement and split the Crash recovery paragraph
   (5, 8).
6. Flush-rate test conditional on rotating disks; sector caveat; `sync_binlog` clause.
7. In the PostgreSQL articles: remove the repeated sentences in the recovery policy
   section, move the rotation arithmetic to one home, separate the layout figures in
   architecture, move the snapshot-reach sentence in row-versions.
