# Style pass, 18 October 2026

This pass carries out the Storage section of `docs/article-work/style-dogfood-2026-10-18.md`
and the shared fixes in the style-pass brief. It changes style and tone, not depth. Every
mechanism, decision and condition from the 17 October text is still there, and the
17 October accuracy fixes are kept.

## What changed and why

- **Headings** now use the field's terms: Pages, Buffer pool, Row versions and undo logs,
  Dirty pages, Write-ahead log, Crash recovery, Checkpoints, Log volume and retention,
  Torn pages, fsync and drive caches, Relaxed commit settings, Backups and point-in-time
  recovery. Subheadings follow suit (Recovery time, Checkpoint settings, Monitoring
  checkpoints, Write caches and power-loss protection, Flush time in production,
  The setting in each engine, Synchronous replication, Log records and MySQL's binary log,
  SQLite's rollback journal and WAL mode). Every existing `id` is kept, so no inbound link
  changes. Two new `id`s: `checksums` (Page checksums, under Torn pages) and `checks`
  (What to check, under the closing loss section).
- **Opening.** The fourth paragraph (five decisions and five checks, about 130 words) is
  gone. In its place: one paragraph giving the model (page in memory, small log record,
  wait for the drive, page later, replay after a crash) and one sentence naming the main
  cost. The five checks became a closing table, "What to check", beside "What can lose a
  committed change", which moved to the end so the two close the article together. The
  scope exclusions moved to the sources section. The housekeeping sentence about
  PostgreSQL 18's defaults moved to just before Figure 1.
- **Paragraphs** went from about 90 words on average to about 46, and sentences average
  about 16 words. Splits follow the steps of the reasoning.
- **Tables.** InnoDB's `innodb_flush_log_at_trx_commit` list item became a table (value,
  what each commit does, mysqld crash, power cut or OS crash), with the late-flush note and
  the binary-log explanation in their own short paragraphs. The `synchronous_commit`
  standby levels became a table (what COMMIT waits for, what the commit survives on the
  standby). The retention paragraph became a table (log, kept until, if that never
  happens), and "What recovery cannot repair" became a list.
- **Research notes.** Of the eight provenance sentences:
  - kept once, as a clause: the trigger rule "comes from PostgreSQL's source code rather
    than its manual, so it may change between versions"; the laptop rates "measured on one
    laptop, so read them as an example of the pattern"; the replay rate "Treat that rate as
    a ceiling" (said once, in Recovery time, and referred to once in Choosing an interval);
    the InnoDB sizing method "The manual gives no formula ... but the mechanism suggests a
    method"; Figure 10's caption, "Arithmetic from PostgreSQL's trigger rule".
  - removed from the reading path: "inferred from how the documentation presents it"
    (SQLite's `synchronous` is per connection; stated plainly), "an observation, not a
    benchmark", "arithmetic, not a documented limit" (the 7,200 rpm reasoning stands on its
    own), "arithmetic from assumptions, not measurements" (now the figure caption), the
    second "best case", and "No documentation or vendor page checked for it states one"
    (now "No single typical flush time holds across them"). The xlog.c source, the
    separate replay run and the scope now sit in Sources.
- **Watch it, then name it.** The write-ahead log section now opens with the figure and
  names the WAL and LSN afterwards. Group commit opens with the observation (sixteen
  clients, eight times the throughput) and names the mechanism after it.
- **Engine asides dropped** because they change no decision: `innodb_max_purge_lag`, and
  the page-cleaner threshold names and percentages in prose (they stay in the checkpoint
  settings table). The versions section no longer opens with the crash bridge; the
  dirty-pages section now carries that point (uncommitted changes can reach the table
  files, and recovery undoes or hides them).
- **Section endings and links.** Signposts after a point is made went to Sources (The
  buffer pool's coverage, Inside PostgreSQL, Replication in PostgreSQL). Links to Watching
  storage are down to about one per section; `#log`, `#timed-requested` and
  `#innodb-checkpoint` are no longer linked from here. The stale comment saying the two
  companions were unwritten is gone, and both companions are now in Sources.
- **Units.** Computed amounts are in MiB and GiB; settings are written as PostgreSQL
  writes them (1 GB), with "1 GB (1,024 MiB)" said once. The heavy test's write rate is
  given as about 28 MiB a second (566 MiB in 20 s), where the old text said 28 MB.

## Figures

Fourteen figures now, renumbered. Three are new; every "Figure N" reference and the alt
texts that name other figures were updated (crash recovery now cites figure 5; async
commit cites figures 5 and 8; the after-COMMIT section cites Figure 8).

- **Figure 3, Where the old version of P7 waits** (`row-versions`, new). Job: show where
  each engine keeps the old value for a reader with an older snapshot. Page 12 with P7;
  a report (R) takes its snapshot, transaction 812 updates P7 and commits, a later query
  (Q) starts. Engine toggle. PostgreSQL adds a second version to page 12 and VACUUM later
  removes the old one; InnoDB copies 20.00 to an undo record, changes the row in place
  with a pointer to it, and purge later discards it. R reads 20.00 and Q reads 22.00 in
  both. The existing comparison table stays after it.
- **Figure 6, who writes the dirty page a query needs to evict** (`dirty-evict`, new).
  Job: show that only a query's own write makes the query wait. Figure 2's four slots,
  all dirty; a query needs page 13. Toggle "Background writer: fell behind / kept up". In
  the first, the page chosen for eviction (31, as in Figure 2) is dirty, so the query
  writes it and waits before reading. In the second, the background writer wrote page 31
  earlier, so the read waits for nothing else.
- **Figure 10, how max_wal_size sets checkpoint spacing and the worst-case replay**
  (`checkpoint-sizing`, new). Job: make the trigger formula visible. A chart over five
  minutes of the log a crash would replay, at 28 MiB a second: it rises to max_wal_size
  just before each checkpoint finishes and drops to 0.9 of the trigger when it does. A
  max_wal_size slider (512 MB to 8 GB) and a replay-rate choice (169 or 85 MiB a second)
  update the trigger, the interval and the worst-case replay against a 30 s target.
  Values: interval 10, 19, 38, 77, 154 s; worst case 3, 6, 12, 24, 48 s at 169 MiB/s and
  6, 12, 24, 48, 97 s at half.
- Component changes to support them: `Param` gains `kind: 'slider'`, which StepFigure
  renders as a labelled range input with an output, and the player wires it (keyboard
  works through the native input; `aria-valuetext` names the value). The buffer-pool
  drawing became a shared `renderPool` used by Figures 2 and 6; Figure 2 draws as before.
  New CSS classes for the chart use theme tokens only, and its lines differ by dash
  pattern as well as colour.

Checked in the dev server at desktop width and 375px, light and dark, with no console
errors and no horizontal scroll. The page rules of the site check pass on the dev-server
HTML (the only reports are links to pages that weren't in the test folder).

## Claims checked

- Checkpoint trigger `max_wal_size / (1 + checkpoint_completion_target)`, measured from the
  start of the previous checkpoint: `CalculateCheckpointSegments` in `xlog.c`
  (REL_18_STABLE). Worst case close to max_wal_size follows from it.
- `innodb_flush_log_at_trx_commit` values and what each survives: MySQL 8.4
  innodb-parameters; MySQL bug 73725 for "value 2 loses nothing in a mysqld-only crash".
  The late once-a-second flush and `innodb_flush_log_at_timeout`: same page.
- `synchronous_commit` levels: PostgreSQL 18 runtime-config-wal. remote_write survives a
  standby PostgreSQL crash but not an OS crash; on flushes to durable storage;
  remote_apply also applies. Every non-off level waits for the local flush.
- Default `wal_sync_method` is `fdatasync` on Linux (and FreeBSD): runtime-config-wal.
- Background writer writes dirty shared buffers so server processes rarely have to:
  PostgreSQL 18 runtime-config-resource. "Looks at the pages next in line for eviction"
  reflects that it works ahead of the clock sweep (`BgBufferSync` in the source); the
  manual says it keeps enough clean, reusable buffers for the predicted need.
- InnoDB writes the undo record, then changes the row in place with a roll pointer;
  purge discards undo no read view needs: MySQL 8.4 innodb-multi-versioning and
  innodb-undo-logs.
- PostgreSQL's reliability page points to diskchecker.pl: PostgreSQL 18 wal-reliability.
- 45-second run at 1 GB, distance 528,459 kB (516 MiB), warning at 20 s apart:
  `evidence.md`, local run.

## Open questions

- Figure 10 uses the heavy test's rate as a steady write rate. Real write rates vary, so the
  chart is the steady case. The caption says it is arithmetic; it doesn't say "steady".
- "Looks at the pages next in line for eviction" in Figure 6 rests on the source rather
  than the manual's wording. It is accurate for PostgreSQL 18 but simplified: the writer
  works in rounds and writes several pages.
- The InnoDB sentence "flushing grows more aggressive once the files occupy more than the
  capacity" is kept from the 17 October text unchanged; it reads oddly and may be worth a
  second look against innodb-redo-log.html.

## Repairs

Made on 18 October after the editorial and technical reviews of this pass, both of which
said "ready after repairs". The two open questions above about Figure 10's steady rate and
the InnoDB redo-capacity sentence are settled by repairs 2 and 6 below.

### Technical

1. The `innodb_flush_log_at_trx_commit = 2` row now says InnoDB flushes the log about once
   a second, on the `innodb_flush_log_at_timeout` timer. The operating system doesn't.
2. The misread redo-capacity sentence is gone. The paragraph now says MySQL 8.4 can resize
   the log while running, that adaptive flushing starts at 10% of capacity
   (`innodb_adaptive_flushing_lwm`) and faster flushing at 75%, and that a full log forces
   a sharp checkpoint. The closing advice now says "well below 75% of it". Checked against
   innodb-buffer-pool-flushing.html, which calls 75% the point where asynchronous flushing
   starts. `innodb_adaptive_flushing_lwm` was added to the settings table.
3. Figure 10's first step now reads "A quiet server has just finished a checkpoint…
   Then writing starts", which explains why the first tooth differs from the rest. The
   last step starts "From then on" rather than "The pattern repeats".
4. "At each of these levels" now follows a sentence that names the three levels.
5. The trigger rule says again that it counts the log written since the previous
   checkpoint began.
6. The sizing method now holds only while checkpoints keep up. It says `max_wal_size` is a
   soft limit, so leave room below the ceiling. Figure 10's caption names its assumptions:
   a steady 28 MiB a second, checkpoints finishing on schedule, no segment rounding.
7. Figure 7 now models two groups of clients that take turns. With n clients a flush
   carries n/2 commits (1 for one client), so its counters agree: 8 × 200 = 1,600. The
   flushes alternate colour and are labelled group A and group B. The step text names the
   two groups, and the one-client case has its own text. The caption and the paragraph
   before the figure agree with this.
8. Optional points taken. The retention table's last column is headed "If it piles up",
   and the InnoDB row reads "It can't". The slot row covers logical slots. A clause
   reconciles 540 MiB with 516 MiB: the server rounds down to whole 16 MiB segments and
   checks when a segment completes, so the real trigger is 512 to 528 MiB. Checked
   against `CalculateCheckpointSegments`, `XLogCheckpointNeeded` and `XLogWrite` on
   `REL_18_STABLE`, and noted in `evidence.md`. Also taken: "or sooner, once waiting
   longer could take the log past `max_wal_size`", the InnoDB clause that changing the
   primary key changes every index, and "From then on".

### Editorial

1. Figures now finish their thoughts.
   - Figure 8: the prose before it says what to compare, and a new paragraph after it
     covers both later cases.
   - Figure 9: a new paragraph says what the continuous model shows (24 page writes
     against 30, replay 7 against 5, identical at 20). The numbers were recomputed from
     the model. The "stall rather than a spike" promise is gone.
   - Figure 11: a new paragraph covers `full_page_writes` off.
   - Line pointers are named after Figure 1, and "asynchronous commit" after Figure 13.
   - Figure 12's h3 now sits below its debrief. The paragraph before Figure 15 stops
     before the outcome, and a short debrief after the figure gives it. "Press play" is
     now "Watch".
2. Source sentences now state their facts: the InnoDB rollback, the redo capacity, the
   WAL writer's risk window, ZFS, Fusion-io, the folded "about a second" paragraph, the
   backup quote and the three quoted manuals. diskchecker.pl and the loss table's
   corruption cell now get plain sentences too. The trigger clause is cut to "The rule isn't documented, so it may change between
   versions". The ceiling repeat in the sizing section is gone, and so is the macOS
   explanation in the commit section. The laptop method is in a new section, "Where the
   numbers come from" (`#numbers`), before Sources. The body keeps one clause per
   measurement. Figure 7's and Figure 10's captions no longer say "not a benchmark" or
   "not a recording".
3. SQLite: the rollback journal is named and explained in a sentence at its first
   mention, in Row versions, and every "described below" is gone. The SQLite aside and
   "for engines that keep a log, as most do" are out of Dirty pages. Pages is shorter:
   - heap against clustered tables is two sentences with the Indexes link;
   - TOAST is one sentence;
   - the housekeeping and scope sentences are cut;
   - space reclamation has moved to Log volume as a log cost.
4. Terms. A full-page image is defined at its first use, in Recovery time, and the later
   glosses are gone; Torn pages keeps the full reason. Checkpoint is defined once, in
   Crash recovery. The Checkpoints section opens on what each checkpoint does, and
   Figure 5's step no longer gives its own definition. Figure 9 says "checkpoint
   position" throughout, its marker reads "position", and its control is "Act every".
5. Group commit uses the reviewer's wording: almost two flushes per commit, and "So flush
   latency sets commit latency."
6. The long stretch before the restore figure: a new Figure 14 (`sync-standby`), and the
   restore figure is now Figure 15. It is built from the flush-path layers, as the review
   suggested. The commit record goes from the primary's WAL buffers and disk to the
   standby's OS cache, its disk and its replayed page 12. The reader chooses what COMMIT
   waits for (primary flushed, standby wrote, standby flushed, standby applied), and the
   primary's disk then fails just after the reply. The figure shows the gap directly: the
   asynchronous case loses an acknowledged commit, `remote_write` survives only while the
   standby's OS does, and the other two keep it. That beat a table, which the section
   already has. The `sync_binlog = 0` passage is also split, one direction per paragraph.
7. Backups: the two announcements are cut. The point-in-time sentence stays, as does
   "You already know what repairs that".
8. Headings, with every id kept: "Periodic and fuzzy checkpoints"
   (`rounds-or-continuous`), "Asynchronous commit" (`settings`) and "Sizing the log
   between checkpoints" (`choosing-interval`). The h2 for `fsync` now opens with a
   paragraph. Optional points taken: the opening's 5 ms example, plainer endings, the loss
   table's first cell as a list, and the 60 MiB example marked as invented.

### Decided against

- Moving the binary log's introduction into the commit-settings section. The retention
  table in Log volume names the binary log first, so its introduction stays in "Log
  records and MySQL's binary log". Only the forward reference was cut.
- Moving Torn pages ahead of Checkpoints. Defining the full-page image at first use was
  the smaller change and keeps the section order.
- Dropping Figure 9's engine toggle. The new debrief makes it teach something.
- Putting the laptop method in the table caption, as the editorial addendum suggested. The
  coordinator asked for a provenance section like Indexes has.
- Repeating the old claim that every rewrite is logged. The moved sentence says only that
  PostgreSQL logs every page it rewrites, because the claim wasn't checked for InnoDB or
  SQLite. Plain VACUUM's end-of-file truncation and `VACUUM FULL`'s lock were dropped as
  off the durability thread.

### Checks

`pnpm build` wasn't run. The page's site-check rules pass on the dev server's HTML; the
only findings are links to other pages, which a single-page run can't resolve. TypeScript
reports no errors in the storage figures. In a browser, Figure 14 was stepped through
under all four settings, and Figures 7, 9 and 10 under the settings named above. Figures
7 and 14 were also checked at 375px, and Figure 14 in dark mode. There were no console
errors and no horizontal scroll. The model's step text and counters for Figures 7, 9 and
14 were also run under every setting in Node. No anchor changed, and the inbound links (`#pages`,
`#versions`, `#backups`, `#flush`, `#torn-pages`) still resolve.

### Copy-edits after the rechecks

Synchronous replication is now its own h2 with its old id, `with-replicas`. Figure 14's
prose names the controls, four long paragraphs were split, the line-pointer paragraphs
were merged, and `VACUUM FULL` became a fourth log-volume bullet; the InnoDB and SQLite
rewrite examples went with the deleted-rows sentence. From the technical recheck: the
retention row now says the redo log can't grow past its capacity, and Figure 6 says the
page is written "out" rather than "to the table file". The site-check rules, TypeScript
and a browser pass were rerun as above, without `pnpm build`.
