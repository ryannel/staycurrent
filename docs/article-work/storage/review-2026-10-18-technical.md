# Technical review of the style pass, 18 October 2026

Perspective: technical reviewer and figure tester. I compared the working tree against
`HEAD` for `storage.astro` and `src/components/explainers/storage/`. I checked changed,
moved and newly tabulated claims against the PostgreSQL 18, MySQL 8.4 and SQLite pages
and the PostgreSQL source. I also stepped through Figures 3, 6 and 10 in a browser. I
read `style-pass-2026-10-18.md` after my first pass through the page.

Six things need repair. Two are small factual errors in the new InnoDB text, one is a
contradiction inside Figure 10, and three are conditions the reader needs that are
missing or overstated. All six are one-sentence fixes. The figures work at every
setting, in both themes, at 375px, from the keyboard and with reduced motion.

## Repairs

### 1. The `innodb_flush_log_at_trx_commit` table says the operating system flushes the log

Relaxed commit settings, the row for value 2: "Writes the redo log to the operating
system, which flushes it about once a second". The relative clause makes the operating
system the thing that flushes once a second. It isn't. InnoDB calls the flush once a
second on its own timer. The manual says: "With a setting of 2, logs are written after
each transaction commit and flushed to disk once per second". The next paragraph of the
article even says `innodb_flush_log_at_timeout` sets the interval, which only makes
sense if InnoDB does the flushing. A reader who believes the operating system does it
might go looking at kernel writeback settings. The 17 October text had it right ("it
hands the log to the operating system at each commit but flushes it only about once a
second", where "it" was InnoDB). The error came in with the table.

Repair: "Writes the redo log to the operating system; InnoDB flushes it about once a
second".

### 2. "Flushing grows more aggressive once the files occupy more than the capacity" misreads the manual

Choosing an interval, the InnoDB paragraph. The writer flagged this sentence, and it
needs changing. The sentence in `innodb-redo-log.html` is about resizing at runtime:
"When set at runtime, the configuration change occurs immediately but it may take some
time for the new limit to be fully implemented. … If the redo log files occupy more space
than the specified value, dirty pages are flushed more aggressively, eventually
decreasing the disk space occupied by redo log files." Files can only occupy more than
the capacity just after you lower the capacity. In steady running they never exceed it,
so the article's sentence describes something a reader will never see. It also hides
what does happen as the log fills, which is what the sizing advice depends on.

The documented behaviour is in `innodb-buffer-pool-flushing.html`. Adaptive flushing
turns on when the log passes `innodb_adaptive_flushing_lwm`, a low-water mark given as a
percentage of redo log capacity (10 by default). Asynchronous flushing starts at 75%,
which the page calls "the hardcoded limit". A full log forces a sharp checkpoint.

Repair: replace the clause with "MySQL 8.4 can resize it while running. Flushing speeds
up as the log fills: adaptive flushing starts at 10% of the capacity
(`innodb_adaptive_flushing_lwm`), faster flushing at 75%, and a full log forces the
sharp checkpoint described above." The 75% point also gives the closing advice ("keep
the gap between the two positions well below it") a number.

### 3. Figure 10's first step contradicts its fourth

Step 1: "A checkpoint has just finished, so a crash now would replay nothing." Step 4:
"When the checkpoint finishes, replay would start from where it began, so the amount
drops to 485 MiB." Both can't be true of a checkpoint that wrote anything while log was
being written. Step 4 is the rule the figure exists to teach, and it matches
`xlog.c`. Step 1 only holds if nothing was written while that first checkpoint ran.
The drawing follows step 1: the first tooth starts at zero, and every later tooth starts
at 0.9 of the trigger. A careful reader sees two different tooth shapes and two
statements that disagree.

Repair the text, not the model: "A quiet server has just finished a checkpoint, so a
crash now would replay nothing. Then writing starts, at about 28 MiB a second." That
explains why the first tooth differs from the rest.

### 4. "At every level, the primary also waits for its own flush" includes `off`

Synchronous replication, the sentence before the table. `synchronous_commit` has five
levels, and `off` waits for nothing, locally or on the standby. The article recommends
`off` for counters two sections earlier, so a reader could take this sentence to mean
that `off` still waits for the local flush once standbys are configured. The manual's
wording is "The local behavior of all non-`off` modes is to wait for local flush of WAL
to disk."

Repair: "At each of these levels, the primary also waits for its own flush."

### 5. The trigger formula lost what it is measured from

Choosing an interval. The 17 October text said a checkpoint starts "when the log written
since the previous checkpoint reaches" the trigger. The new text gives
`trigger = max_wal_size ÷ (1 + checkpoint_completion_target)` and "about 540 MiB" but
never says 540 MiB of what, counted from where. The worst-case paragraph that follows
("one trigger's worth of log, plus everything written while the current checkpoint ran")
only adds up if the reader already knows that the count starts where the previous
checkpoint began. In the source, `XLogCheckpointNeeded` counts from `RedoRecPtr`.

Repair: "it starts the next checkpoint once the log written since the previous
checkpoint began reaches the setting divided by one plus the share of the interval spent
writing".

### 6. The `max_wal_size` ceiling assumes checkpoints finish on time

Choosing an interval presents the worst case as "close to `max_wal_size`" and turns that
into a method: "replay rate times the time you can spend gives a ceiling for
`max_wal_size`". The manual calls the setting "a soft limit; WAL size can exceed
`max_wal_size` under special circumstances, such as heavy load". If the disks can't
write a checkpoint's pages within 0.9 of the interval, the checkpoint finishes late and
replay grows past the setting. This condition changes what the reader would do: leave
headroom below the ceiling. Figure 10 assumes a steady write rate and checkpoints that
finish on schedule. Its caption says "Arithmetic from PostgreSQL's trigger rule" and
doesn't name those assumptions, which the writer also raised as an open question.

Repair: add one clause to the method sentence, such as "as long as checkpoints keep up:
`max_wal_size` is a soft limit, and a checkpoint the disks can't finish in time lets the
log, and the replay, grow past it". Optionally make the caption say "a steady 28 MiB a
second, with checkpoints finishing on schedule".

## Smaller points

These are optional, and none is wrong enough to block.

- **Retention table, binary log row.** The third column is headed "If that never
  happens", but 30 days always pass. The real problem is that 30 days of binary logs can
  be more than the disk holds. A header such as "If it piles up" fits every row.
- **Retention table, slot row.** "The slot's standby has received it" leaves out logical
  slots, whose consumer is a decoding client, not a standby. An abandoned logical slot,
  left by a change-data-capture tool that stopped, is a common cause of the incident the
  next paragraph describes. "The slot's consumer, a standby or a logical replication
  client, has confirmed it" covers both.
- **540 MiB against 516 MiB.** The text says the trigger is about 540 MiB and then says
  "the real server agreed" at 516 MiB. The gap has a cause. `CalculateCheckpointSegments`
  rounds down to whole 16 MB segments (33 at the defaults), and the check fires when a
  segment completes. So the real trigger is between 512 and 528 MiB, and 516 falls inside
  that range. A clause would stop an attentive reader wondering.
- **Rounds or continuously.** "or sooner if the log approaches `max_wal_size`" sets up an
  expectation that Choosing an interval then has to correct ("about half the setting").
  "or sooner, once waiting longer could take the log past `max_wal_size`" would agree
  with the later section. This sentence predates the style pass.
- **Which indexes an update changes (17 October fix).** This is correct. One clause would
  complete it: in InnoDB, every secondary index holds the primary key, so changing the
  primary key changes every index. The article has just explained that, so the reader is
  ready for it.
- **Figure 6, "waits for that write to finish".** In PostgreSQL the query's write goes
  to the operating system's cache, not to the drive. The wait is usually short unless the
  log has to be flushed to the page's LSN first, or the kernel is throttling writeback.
  The caption's LSN sentence covers the second part. The model isn't wrong, but "writes
  page 31 out" would promise less than "to the table file".
- **Figure 10, last step at 8 GB.** "The pattern repeats" appears when the five-minute
  window shows a single checkpoint and a single drop. "From then on, a checkpoint every
  154 s" reads correctly at every setting.
- **Outside this diff: Figure 7's stats disagree with each other.** At the defaults, the
  group-commit figure shows "Commits per flush: 16", "Flushes per second: 200" and
  "Commits per second, at most: 1,600". Sixteen times 200 is 3,200. The 1,600 is right:
  each commit waits two flushes, which is the article's own 10.2 ms. So a flush carries 8
  commits on average, not 16. `log.ts` is unchanged by this pass apart from Figure 10,
  but a reference article shouldn't keep this.

## What checks out

These can be kept as they are, and pointed to.

- **Figure 10's arithmetic.** With 1 GB counted as 1,024 MiB, 28 MiB a second, and replay
  at 169 or 84.5 MiB a second (the figure labels 84.5 as 85), every value matches. The
  intervals are 9.6, 19.2, 38.5, 77.0 and 154.0 s, and the worst cases are 3, 6, 12, 24
  and 48 s, or 6, 12, 24, 48 and 97 s at half the rate. The 4 GB trigger is 2,156 MiB
  (2.1 GiB). The value after a drop is 0.9 of the trigger (485 MiB at 1 GB). The checkpoint
  counts in five minutes are 31, 15, 7, 3 and 1, and the drawing shows the same number of
  checkpoint dots. The verdict flips to "over" at 8 GB (fast rate) and at 4 GB (slow
  rate), and it says so in words as well as in colour. The worst case equal to
  `max_wal_size` follows from the source: the trigger plus 0.9 of it is 1.9 times the
  trigger. The prose numbers (19 s, about 6 s, 2.1 GiB, about 77 s, about 24 s, about 48)
  match the figure. So do "about 5 GiB" for 30 s at 169 MiB a second, and the measured
  566 MiB, 3.35 s and 516 MiB. I checked the 566 MiB against the LSNs in `evidence.md`:
  593,937,480 bytes.
- **The rest of the InnoDB table.** Value 0 loses up to about a second even if only
  `mysqld` crashes. Value 2 loses nothing in a crash of `mysqld` alone, which bug 73725
  supports. Both lose up to about a second in a power cut. The late-flush paragraph
  matches the manual ("not 100% guaranteed … sometimes less frequently due to scheduling
  issues").
- **The `synchronous_commit` table.** `remote_write` survives a crash of the standby's
  PostgreSQL but not of its operating system. `on` survives a power cut on the standby.
  `remote_apply` also makes the change visible to queries there. All three rows match the
  manual.
- **The retention defaults.** `max_slot_wal_keep_size` defaults to -1, and
  `binlog_expire_logs_seconds` to 30 days. Archiving lets WAL files accumulate when it
  falls behind. The InnoDB redo log stalls instead of growing.
- **The two 17 October fixes are present and correct.** PostgreSQL adds an entry to
  every index unless the update is HOT. Unlogged tables are emptied "after a crash or an
  immediate shutdown, and on a promoted standby".
- **No condition was lost elsewhere.** I compared every shortened paragraph with the
  17 October text. These are still there: InnoDB rolls back unfinished transactions after
  accepting connections; killing the process doesn't help; `fsync = off` breaks the
  ordering; `sync_binlog = 0` leaves replicas holding commits the source lost; semisync
  falls back to asynchronous replication after a timeout; replay is only part of the
  outage. Moving `fdatasync` to "On Linux, PostgreSQL uses…" fixes an old overreach,
  since the 17 October text applied it to every database. "Rolling back … several times
  as long", "Killing the database process does not help", ZFS, diskchecker.pl and "many
  of these do not honor cache flush commands by default" all match their sources.
- **Figure 3.** Both engines match the prose and the caption at every step. PostgreSQL
  shows two copies on page 12 and VACUUM removing one. InnoDB writes the undo record
  first, then changes the row in place with a pointer, and purge discards the record. The
  report reads 20.00 throughout and the later query reads 22.00. The "Copies of P7 on
  page 12" counter (2 against 1) makes the difference visible without colour. The text
  alternative describes both engines.
- **Figure 6.** Both settings match the prose. Page 31 is evicted, as in Figure 2. "Writes
  the query waited for" is 1 when the background writer fell behind and 0 when it kept
  up. The text alternative describes both.
- **The figures that share the changed code.** Figure 2 still draws as before after the
  move to the shared `renderPool`. The figures with parameters still respond and still
  match their prose: 61 rows and 4 rows in Figure 1, and 5/30/35 and 20/6/12 in Figure 9.

## Figure testing

The built-in browser pane had reached its tab limit with other reviewers' tabs, and I
didn't close any of them. I used a separate headless Chromium instead (Playwright 1.62.1,
already installed in another of the owner's projects, with its cached Chromium build).

| Check | Result |
| --- | --- |
| Console errors and warnings, Storage and Buffer pool pages | None |
| Horizontal scroll at 1280px and 375px | None on either page (`scrollWidth` equals `clientWidth`) |
| Keyboard | Enter and Space work on Next, Reset, the engine, writer and replay-rate buttons. The `max_wal_size` slider moves with Home and the arrow keys. Its `<output>` and `aria-valuetext` follow it (512 MB, 1 GB, 2 GB, 4 GB, 8 GB), and the figure jumps to its result step. Focus rings are visible. |
| Light and dark | Correct with the system setting dark. Also correct through the site's theme switch both ways: light system to Dark, and dark system to Light (`data-theme` set). The chart's lines use theme tokens and differ by dash pattern as well as colour. |
| 375px | Figure 3 stacks the undo log under page 12 with a vertical pointer. Figure 6's "query writes it" and "background writer" labels fit. Figure 10's axis labels and legend fit, with "4 min" and "5 min" close but separate. |
| `prefers-reduced-motion: reduce` | Every figure rests on its last step and never autoplays. Changing a parameter goes to the last step and stays paused. Transitions are off. |
| Buffer pool page | Its eviction figure renders, steps, switches policy and has no console errors at 1280px or 375px. |

Two notes on the drawings, neither blocking. At 512 MB and 1 GB, Figure 10's saw-tooth is
only 10 to 20 pixels tall, because the axis runs to 9 GiB so that 8 GB fits. It is still
readable at 1 GB, and comparing it against the 30-second line is the point. The Astro dev
toolbar covers the end of some captions at 375px; that happens only in development.

## What I couldn't check

- Safari and Firefox; I tested Chromium only.
- A real screen reader. I checked the text alternatives, labels, `aria-valuetext` and the
  live step text in the DOM, but didn't listen to them.
- Touch dragging of the slider on a phone, forced-colours mode and hover states.
- The site check and `pnpm build`, which I didn't run, as instructed.
- No measurements were repeated on a server. I checked the laptop numbers against
  `evidence.md` and its LSNs, not against a fresh run.

## Verdict

**Ready after the listed repairs.** The new tables and figures are accurate apart from
two InnoDB sentences, and both errors are local: one is a relative clause, the other a
misread manual passage. Figure 10 does what its prose says at every setting, and its
arithmetic matches the source rule exactly. One sentence contradicts that rule and needs
rewording. The `synchronous_commit` lead-in and the trigger formula each need a few words
put back, and the sizing method needs its one missing condition. None of this asks for
restructuring. With those six sentences fixed, I would be comfortable pointing future
writers to this article's tables and figures as accurate examples. Figure 7's
contradictory counters, which predate this pass, should be fixed before the article is
used as a reference.

## Recheck after repairs

I checked the writer's repairs, listed in the Repairs section of `style-pass-2026-10-18.md`, against the source, the PostgreSQL 18 code and the manuals. In headless Chromium I stepped through Figures 7, 9, 10 and 14 under every setting, at 1280 px and 375 px, in light and dark, with reduced motion. There were no console errors, and the page's width matched the viewport at both sizes. The buffer-pool page still loads, with its figure and no errors.

### The six repairs

1. **Value 2.** The table now says InnoDB flushes the log about once a second, on the `innodb_flush_log_at_timeout` timer, and that a `mysqld` crash loses nothing because the operating system still holds the writes. That's correct.
2. **Redo capacity.** Adaptive flushing starting at 10% (`innodb_adaptive_flushing_lwm`), faster flushing at 75%, a sharp checkpoint when the log is full, and resizing while the server runs: all four match the 8.4 manual. "Keep the gap … well below 75% of it" follows from them.
3. **Figure 10.** Step 1 now starts from a finished checkpoint with nothing to replay. Step 3's 1 GB worst case and step 4's drop to 485 MiB (0.9 × 539) follow from that start. The last step reads "From then on" at 512 MB, 1 GB, 4 GB and 8 GB, at both replay rates, and its counts of 31, 15, 3 and one checkpoint in five minutes are right. The caption now names the model's assumptions.
4. **"At each of these levels"** now follows a sentence naming `remote_write`, `on` and `remote_apply`, so it no longer covers `off`. That's correct.
5. **"Since the previous checkpoint began"** is back in the trigger rule.
6. **The soft limit.** The sizing method now holds only while checkpoints keep up, and says why to leave room below the ceiling.

### Figure 7

The counters now agree with each other under every combination: 8 × 200 = 1,600 for 16 clients, 2 × 200 = 400 for 4, and 200 for one client or with sharing off. At 0.2 ms and 2 ms they give 40,000 and 4,000. The step text names groups A and B, and the one-client case has its own text ("Each commit waits one whole flush"). The 10.2 ms explanation fits the same model: each commit waits for most of one 5.1 ms flush and all of the next, so a flush carries 8 commits. That makes about 1,570 a second, which is the observed figure. The figure, the caption and the paragraph now tell one story.

### Figure 9

The figure's end states match the new debrief:

| Act every | Rounds: replay / writes / images | Continuous: replay / writes |
|---|---|---|
| 5 records | 5 / 30 / 35 | 7 / 24 |
| 10 | 10 / 18 / 24 | 14 / 15 |
| 20 | 20 / 6 / 12 | 20 / 6 |

### Figure 14

Each setting shows what PostgreSQL guarantees when the primary's disk fails just after the reply:

- **Primary flushed (asynchronous).** The standby has nothing, and P7 is 20.00 after the failover, so the acknowledged commit is lost. That's correct: the WAL sender only sends WAL the primary has already flushed, so the standby can be behind but never ahead. The caption is honest that the failure has to fall within the moments the standby lags.
- **`remote_write`.** The record is in the standby's OS cache. Promotion replays it, giving 22.00, "unless the standby's OS failed too". That's correct. When the walreceiver shuts down for promotion it flushes what it has written (`WalRcvDie` calls `XLogWalRcvFlush`), and the startup process replays up to the flushed position. So the drawing is right to move the record to the standby's disk before replaying it, and the counter is right to read "on disk, applied" at the end.
- **`on`.** The record is flushed on the standby, and P7 is 22.00. That's correct.
- **`remote_apply`.** The record is applied before the reply, so the standby's queries saw 22.00 before the failover. That's correct.

The step text and counters agree at every step. The text alternative's five layers match the drawing. Like every figure's text alternative, it lists the default setting's steps; the paragraph after the figure gives the asynchronous and `remote_write` outcomes, so a reader without the drawing still gets all four. At 375 px, in light and dark, the labels fit without overlapping, and the controls wrap onto two rows. Tab moves between the options, Space selects one, and Enter works Reset and Next. The surrounding prose correctly limits the levels to "when synchronous standbys are configured", and the table below the figure agrees with it.

### The 512 to 528 MiB trigger

This is confirmed against `xlog.c` on `REL_18_STABLE`. `CalculateCheckpointSegments` takes 1,024 MiB ÷ 16 MiB ÷ 1.9 = 33.7 segments and rounds down to 33. `XLogCheckpointNeeded` requests a checkpoint once the segment just completed is 32 segments past the one holding the redo pointer, and `XLogWrite` runs that check as each segment completes. That is 528 MiB minus the redo pointer's offset within its segment: more than 512 MiB and at most 528. The observed 516 MiB (528,459 kB) falls inside that range. The article's clause and Figure 10's "no rounding to whole segments" agree.

### Space reclamation, now in Log volume

"PostgreSQL logs every page it writes" is right at the default `wal_level = replica`, where `VACUUM FULL` logs each new page in full. It doesn't hold at `wal_level = minimal`, where a rewrite is synced to disk instead of logged, or for unlogged tables. Neither case changes what a reader running replicas would do, so I wouldn't add them. Limiting the claim to PostgreSQL is right. InnoDB rebuilds indexes with sorted index builds, and the 8.4 manual says redo logging is disabled during them, with a checkpoint taking its place.

### Retention table

"If it piles up", with the InnoDB row's "It can't", reads correctly. The slot row now covers logical slots, and the default of -1 is right. One optional wording point: "the capacity is fixed" comes shortly after "MySQL 8.4 can resize it while running". "The log can't grow past its capacity" would say the same thing without the clash.

### Still open, optional

Figure 6's "waits for that write to finish" is unchanged; see Smaller points. It isn't wrong.

### What I couldn't check

I didn't run a standby, so Figure 14 is checked against the documentation and the walreceiver and walsender code rather than against an observed failover.

### Updated verdict

**Ready.** All six repairs are correct, and Figures 7, 9, 10 and 14 now agree with their counters, their step text and the prose. The new trigger clause matches the PostgreSQL 18 source and the measurement. I would be comfortable pointing future writers to this article's tables and figures as accurate examples. The two optional points above can wait.
