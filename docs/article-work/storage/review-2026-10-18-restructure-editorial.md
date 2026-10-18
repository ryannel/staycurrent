# Storage and durability restructure: editorial review, 18 October 2026

Reviewer: editorial perspective, informed. Read the rendered dev pages in headless
Chromium (text, headings, figure steps, captions and controls), with the writer's note,
the map's Storage section, `derived/storage-consolidated.md` and `storage-comparison.md`,
and the style anchors (Sam Who, *Memory Allocation*; the house-reference brief). No file
changed apart from this note.

Pages read: `storage/`, `checkpoints-and-the-log/`, `buffer-pool/`; receiving sections
`backup-and-restore/#pitr` and `#physical`, `slow-queries/#hit-rate`,
`postgresql/recovery/` (`#reading-checkpoints`, `#max-wal-size`, `#reading-restart`,
`#wal-flush-timing`, and their neighbours), `postgresql/architecture/#eviction`.

## What an expert practitioner can do (written before opening the pages)

1. Explain a page's layout (header, line pointers or slots, row header, padding, null
   bitmap, overflow) and estimate row size, rows per page and table size from a schema.
2. Explain where each engine keeps old versions, why updates grow tables, what cleans
   them up, why space is rarely returned, and what fill factor buys.
3. Explain the buffer pool: hits, reads, eviction, dirty pages, the OS cache beside it,
   sizing against the working set, and why the hit rate misleads.
4. Explain the write-ahead rule, what COMMIT waits for, group commit, and the price of a
   flush; choose a durability setting per kind of data in each engine and know what each
   loses on a process crash against a power cut.
5. Explain checkpoints and size them from a recovery-time target; read checkpoint logs.
6. Explain crash recovery (redo from a checkpoint, undo or hiding of unfinished work)
   and estimate restart time, including a cold cache.
7. Explain torn pages and each engine's guard; know checksums detect and don't repair.
8. Know a flush is only as honest as every layer below it, and how to test a volume.
9. Treat the log as a resource: what holds it, how a full log disk happens, how to fix it.
10. Explain backups and point-in-time recovery: a running copy as a crashed disk,
    archiving, stopping early and what it costs, and know a replica is not a backup.
11. Diagnose the common incidents: slow commits, long restart, log filling the disk,
    a table or undo history that keeps growing.

**Against the map.** Every item has a home in the map, mostly in S and C, with sizing
in B, hit rate in `slow-queries`, PITR in `backup-and-restore` and PostgreSQL reading in
the series. Two of my items are thinner in the map than in my list, and both are fine at
this depth: bloat measurement (S `#fill-factor` names the rewrites but not how to measure
bloat; `postgresql/row-versions` is the natural home) and separating an I/O-bound from a
CPU-bound server (belongs to *Understanding database performance*). Nothing in the family
is drift outside the map.

## Heading trees

```
Storage and durability (deep dive, 28 min)
  Pages #pages
    What a row costs in each engine #row-size        [new]
    Large values #large-values                        [new]
  Buffer pool #buffers
  Row versions and undo logs #versions               [+SQL Server]
    Space reused, rarely returned #fill-factor        [new]
  Dirty pages #dirty
  Write-ahead log #wal
    Who writes a dirty page / What COMMIT waits for / Group commit /
    Log records and MySQL's binary log / SQLite's rollback journal and WAL mode
  Crash recovery #recovery                            [checkpoint paragraph kept]
    Unfinished transactions / Recovery time / What recovery cannot repair
  fsync and drive caches #flush                       [condensed]
  Asynchronous commit #settings
    The setting in each engine / Choosing what may be lost /
    What else a relaxed commit changes #relaxed-commits   [new]
  What can lose a committed change #loss
  Where the numbers come from

Checkpoints, torn pages and the log (companion, 19 min)
  What a checkpoint costs / Checkpoint settings / Choosing the interval / Checkpoint symptoms
  Torn pages / What one change writes / Checksums
  Trusting the flush / Testing a volume
  The log as a resource / What keeps the log
  How long a restart takes
  Four incidents (four h3s)
  What to watch, by engine

The buffer pool (companion, 9 min)
  What the pool holds / Two caches / Scans that push the working set out
  Choosing a size (knee, memory, starting points, too small)
  A cold pool after a restart or failover (saving, failover)
```

The deep dive's tree reads well as a map: field terms, one mechanism per h2, in the order
the argument needs. The companion's tree names its cases plainly. Two headings work
against a skimming reader; they are findings 5 and 9.

## What works

- **The deep dive's argument survived the cuts intact.** Opening → pages → memory →
  versions → dirty pages → log → recovery → flush → settings → loss still runs as one
  chain on one running example (P7 on page 12). At 28 minutes it reads faster than the
  39-minute version did, and nothing between Figure 4 and Figure 10 lost a step.
- **The deep dive now meets the paragraph calibration.** Measured on rendered `<p>` text:
  about 48 words a paragraph and 16 a sentence across sections, against the 90-word
  paragraphs the style skill recorded for October. The new sections sit inside that range
  (row size 58/13, fill factor 45/17, relaxed commits 53/18). Large values is the densest
  at 23 words a sentence.
- **Row size opens the right way.** "Figure 1's 132 bytes for 100 bytes of data is
  PostgreSQL's price" re-enters the model, and the worked estimate (10 million rows,
  about 164,000 pages, 1.3 GB) is the kind of exact number the anchors use. The
  arithmetic checks.
- **Large values ends on a cost the reader can feel.** The 1,900-byte description that
  leaves four rows a page and makes a scan read fifteen times the pages turns a threshold
  table into a decision. "Wide columns are best declared last" for SQLite is a plain
  verdict in the house manner.
- **Relaxed commits is the best new passage.** A second transaction reads 22.00, sends a
  confirmation, and a crash brings back 20.00: "built on a price that no longer exists".
  That is break-then-consequence in two sentences, and it gives a reason to read the
  section that a list of caveats wouldn't.
- **The SQL Server notes are integrated, not appended.** Each one sits after InnoDB in
  the section it changes (versions, writers, unfinished transactions, settings), opens
  by naming SQL Server's term, and states only the difference. Readers who don't use SQL
  Server lose a paragraph per section, not a section.
- **The PITR paragraph left in `#loss`** compresses the moved section into one sentence
  ("crash recovery started from an older copy of the files, fed with a saved log, and
  stopped just before the mistake") and links it. That is a good join.
- **The companion's new shape is honest.** Its title now says what it holds, its first
  half is mechanism with figures (checkpoints model, recorded cycle, torn page) and its
  second half is operator reference. The torn-page section moved whole and reads as well
  here as it did in the deep dive, and `#write-cost` ("two bytes cost at least 16 kB in
  PostgreSQL after a checkpoint and over 32 kB in InnoDB") is a strong new tally.
- **`postgresql/recovery#max-wal-size`** is the strongest of the moved sections: rule in
  words, then the formula, then what it means in numbers (540 MiB, 512 to 528 after
  rounding, worst case near `max_wal_size`), then a figure with one slider, then the real
  server agreeing. It reads like the house reference.
- Every internal link on the seven pages resolves, including every anchor; both aliases
  (`watching-storage`, `commit-and-recovery`) answer 302 to sensible pages; the landing
  page lists the family as one published deep dive and two working drafts.

## Findings, most consequential first

### 1. Sizing from the replay ceiling can lead to a wrong setting

**Where:** `checkpoints-and-the-log/#choosing-interval`, first paragraph: "At the 169 MiB
a second measured in Storage and durability, that is about 5 GiB."

**What happens:** the deep dive calls that rate a ceiling (warm OS cache, mostly
full-page images, "After a reboot ... replay can be much slower"). The companion feeds it
straight into the method that produces a setting. A reader following the method sets
`max_wal_size` or redo capacity near 5 GiB for a 30-second target and may get a
restart several times longer after a reboot. The caveat reappears only later, in
`#restart`.

**Repair:** one clause where the number is used: "...at the 169 MiB a second measured
with a warm cache, a ceiling, that is about 5 GiB; after a reboot, plan on less, and
measure your own." The PostgreSQL series figure already offers a half-rate option, so
this is consistent with it.

### 2. The deep dive raises the half-written page and never closes it

**Where:** `storage/#dirty`: "a page half-written when the power fails is part old and
part new" (a reason not to write pages at commit); `#cannot-repair`: "Damage that is not
a tear"; `#recovery-time`: full-page images defined only as "copies of whole pages that
PostgreSQL logs the first time each page changes after a checkpoint".

**What happens:** the torn-page section left, but the problem it answered is still
posed. The reader learns the log removes page writes from the commit, yet pages are
still written later and can still tear, and the page never says what handles that.
"A tear" is now used without definition, and full-page images arrive without their
purpose. A reader using the deep dive alone could reasonably think the log covers torn
pages by itself, which is false with `full_page_writes` off.

**Repair:** one or two sentences at the end of `#recovery`'s checkpoint paragraph: "A page
written later can still be caught half-written, a torn page. Each engine keeps a whole
copy somewhere to repair it: PostgreSQL in the log, InnoDB in a doublewrite buffer.
Checkpoints, torn pages and the log compares them." Then "not a tear" reads correctly.

### 3. Two receiving-page references now point at the wrong passage

**Where and what:**

- `postgresql/recovery/#flush`: "Read its numbers with that article's caveat: a high
  rate means a fast, honest drive or a lying one". "That article" is Storage, which no
  longer has `pg_test_fsync` or that caveat. It moved to
  `checkpoints-and-the-log/#testing`.
- `postgresql/recovery/#flush` ends: "The settings in the next section decide whether
  COMMIT waits for the flush at all." The next section is now `#wal-flush-timing`, which
  was inserted between it and `#policy`.

**Repair:** point the first at `checkpoints-and-the-log/#testing` ("the caveat in
Testing a volume"); change the second to "The settings in Commit acknowledgement and
durability settings, below, decide..." or move `#wal-flush-timing` above `#flush`, where
it also reads naturally after `#reading-restart`.

### 4. Three more terms or references dangle after the moves

- `buffer-pool/#knee`: "If a steady share of buffers sits at a usage count of 0 or 1".
  Usage counts left with the clock sweep; the reader has never met one on this page.
  Repair: "a usage count of 0 or 1 (PostgreSQL's clock-sweep counter, explained in
  Inside PostgreSQL)", with the link to `architecture/#eviction`, or cut the sentence.
- `checkpoints-and-the-log/#choosing-interval`: "The jump is full-page images, which the
  next section explains". The next section is Checkpoint symptoms; Torn pages is two on.
  Repair: "which Torn pages explains".
- `storage/#cannot-repair`: "Backups cover the rest." No link now that the backups
  section left. Repair: link "Backups" to `backup-and-restore/`.

### 5. "Space reused, rarely returned" hides fill factor from a skimming reader

**Where:** `storage/#fill-factor`, h3 under Row versions.

**What happens:** half the section is the new fill-factor material and the anchor is
`#fill-factor`, but the heading is a phrase, not the term. A reader scanning the
contents for "fill factor" won't find it, and Indexes links here for exactly that. The
brief asks headings to use the field's terms.

**Repair:** "Free space and fill factor", or "Reclaiming space and fill factor". In the
same section, name the mechanism once: "PostgreSQL calls this a heap-only tuple, or HOT,
update", linked to `indexes/#writes`. The page describes the idea twice (`#pages` and
here) without its name, and the name is what the reader will meet in the PostgreSQL
series and in tools.

### 6. The companion's opening promises an order the page doesn't follow

**Where:** `checkpoints-and-the-log/` opening: three jobs (checkpoints, torn pages, the
log), then "This article goes through them in that order, then through the trust every
one of them places in the storage, and the time a restart takes."

**What happens:** the page runs checkpoints, torn pages, *trust*, log, restart. A reader
looking for the third job finds the flush in its place.

**Repair:** move "Trusting the flush" (with "Testing a volume") after "What keeps the
log". The trust section opens with "Every guarantee so far rests on...", which reads
better after all three jobs anyway. Alternatively reword the opening, but the move is
the cleaner fix.

### 7. The companion and the deep dive repeat each other on restart and flush

**Where:**

- `storage/#recovery-time` and `checkpoints-and-the-log/#restart` both state the four
  parts of an outage ("A recovery-time target should include/cover all four"), both
  repeat the 566 MiB in 3.35 s result with the same caveat, and both say "measure your
  own rate by crashing a copy under load".
- `storage/#flush`, the companion's layers table and the paragraph after it all say the
  guarantee on a virtual or network volume is "whatever the provider documents an
  acknowledged write to mean", in nearly the same words.

**What happens:** a reader who follows the deep dive's link to `#restart` reads the
first paragraph and a half again before reaching what's new (progress lines,
`innodb_force_recovery`, SQLite's lock, why ADR matters for batch jobs).

**Repair:** open `#restart` with one back-reference ("Storage and durability lists the
four parts of an outage and the measured replay; here is what each engine adds") and
cut the restated paragraph. Cut the paragraph after the layers table, keeping only its
new example ("Local instance storage may disappear when an instance stops").

### 8. Hedging residue is back, mostly in the companion

The style skill names this residue as a known drift. Instances:

- Companion opening: "show patterns, not numbers to expect"; Figure 2 caption: "The
  rates belong to this run, not to PostgreSQL in general"; after the 1 GB/64 MB table:
  "With one run of each on a laptop, take that as an indication, not a measurement."
  Three in one section.
- Storage: "They show the pattern, not typical numbers" before the commit table, and
  "show the pattern rather than typical numbers" again in "Where the numbers come from";
  "(limited by the processor, not the storage)" twice in the same table.
- Buffer pool `#failover`: "That follows from how replay and the pool work, not from a
  documented guarantee." `postgresql/recovery#max-wal-size`: "The rule lives in the
  source ... not the manual, so it may change between versions" (this one does change
  what a reader does, and can stay).

**Repair:** keep one qualification per page where it changes a decision (the companion
opening's is enough; Storage's "Where the numbers come from" is enough) and cut the rest.
Put "limited by the processor" once in a table note.

### 9. "Relaxed commit" and "Asynchronous commit" name the same thing two ways

**Where:** h2 "Asynchronous commit" (`#settings`), h3 "What else a relaxed commit
changes", whose first two sentences use both terms.

**What happens:** a skimmer meets "relaxed commit" as if it were a different term. The
opening uses "relaxing the wait", so it is house paraphrase, not a field term.

**Repair:** "What else asynchronous commit changes", and "Other sessions see an
asynchronous commit before it is durable." (The h2 itself is PostgreSQL's term doing
duty for SQL Server's "delayed durability" too; the section's first paragraph says so,
which is enough.)

### 10. The companion title as a sentence subject strains three times

**Where:** `storage/#recovery`: "Checkpoints, torn pages and the log sizes that trade."
`#recovery-time`: "Reading a restart goes through that log line by line, and
Checkpoints, torn pages and the log through restart time in each engine." `#flush`:
"Checkpoints, torn pages and the log goes through each layer...".

**What happens:** a title containing a comma and "and" makes a poor subject. The first
reads as "the log sizes", a garden path; the second gaps its verb. The link styling
helps, but not enough.

**Repair:** put the title at the end: "How to size that trade is in Checkpoints, torn
pages and the log." / "...and the companion, Checkpoints, torn pages and the log, covers
restart time in each engine."

### 11. Smaller points in the new deep-dive sections

- `#row-size`: "InnoDB adds at least 18 bytes to every row, before its page directory
  and the free space it leaves when pages fill in key order." The comparison gives
  rows per page for PostgreSQL and SQL Server but not InnoDB, and "page directory" is
  unexplained. Repair: replace "before its page directory" with "plus page overhead",
  and say why no rows-per-page figure ("InnoDB's depends on how full key order leaves
  each page").
- `#row-size` table, SQL Server cell: "2 bytes plus 2 more for each variable-length
  column" has no noun. Repair: "an offset array of 2 bytes plus 2 per variable-length
  column".
- `#large-values`: the four-engine table comes before the running example. Moving the
  "A query for P7's price never touches its 50 kB description" paragraph above the table
  would open from the model, as Row size does.
- `#versions`: "accelerated database recovery" appears here before `#unfinished`
  explains it. A parenthetical "(see Unfinished transactions)" is enough.
- `#settings`, SQL Server: the loss table says delayed durability risks "up to a log
  buffer's worth" without a size. A technical reviewer should confirm whether a figure
  can be given.

## The deep dive as a style reference

It still works, with one change to the skill. The style skill names three Storage
passages. Two are intact on the page: Figure 4 through the naming of the write-ahead log,
and the Row versions opening with the table after Figure 3 (now with a SQL Server
paragraph and row; the passage still reads in sequence). The third, "the backups
opening, which builds point-in-time recovery from mechanisms the reader already has",
now lives in `backup-and-restore#pitr`. The skill's pointer at
`.claude/skills/staycurrent-style/SKILL.md` lines 39 to 40 is now wrong.

What the deep dive lost with its checkpoint, torn-page and backup sections was mostly
operator material; the teaching passages that model the voice stayed. It still shows the
anchors' main moves: one running model, watch-then-name (Figures 4 and 5 into "That order
gives the log its name"), break-fix-cost (writing pages at commit, then the log), exact
numbers (5.1 ms, 196 a second; 10.2 ms as twice 5.1), and plain verdicts. Its figures are
now less frequent in the second half (Figure 8 to Figure 9 spans three text-only
subsections; the settings section is table-led), which a future writer could copy as
licence for tables where an animation should anchor. That is worth saying in the skill,
not repairing here.

Recommendations for whoever maintains the skill (not the writer's remit):

- Replace "the backups opening" with a passage still on the page. The best candidate is
  `#commit-wait` into `#group-commit`: the reader sees 5.1 ms and 10.2 ms in a measured
  table, and the next section explains exactly why the second is twice the first. That
  is the watch-then-explain move with real numbers. `#relaxed-commits`' first paragraph
  is a second candidate, for consequence in a short space.
- If the backups opening stays named, point at `backup-and-restore#pitr`, and note that
  the page around it is in the older voice (see below).

Fix findings 2, 5 and 9 before the page is copied again, because they are the patterns
a copying writer would spread: an unresolved problem left by a cut, a phrase heading over
a term, and two names for one setting.

## The receiving pages

### How much the two voices matter

The writer is right that four older pages now mix voices. The cost differs by page:

- **`backup-and-restore`: matters most.** The moved section is now the page's conceptual
  core, and it differs from its neighbours in more than register. The older sections use
  the orders table (101, 102, 103, req-a to req-c) and say "WAL"; `#pitr` uses the
  products table from Storage (P7 at 22.00, P8, a 09:00 to 14:30 day) and says "the log".
  The page tells the same lesson three times: "What the backup contains" ("stopping
  there also excludes legitimate transactions committed afterwards"), `#pitr-cost` (P8
  lost with the delete) and `#physical` (req-c, "as the section above showed"). And P7
  arrives with no introduction on this page ("At 10:00 P7 is set to 22.00").
- **`postgresql/architecture#eviction`: moderate.** It brings a second running example
  into a page built on product 7's reservation: "the shop's 501 pages", a 16 MB test
  pool, `page_views`. The shop and its 501 pages are never introduced here. The next
  section returns to product 7 with no bridge.
- **`postgresql/recovery`: low.** The new sections are log-reading and arithmetic; their
  plainer voice reads as "this section is clearer", not as a break. The costs are the
  broken joins in finding 3, the "checkpoints are occurring too frequently" advice now
  given three times (end of `#checkpoint`, `#reading-checkpoints`, `#max-wal-size`), and a
  second experiment (pgbench on a laptop) that the opening, which describes only the
  stock-update cluster, doesn't mention.
- **`slow-queries#hit-rate`: low.** Self-contained and well placed after "Plans and
  changing data", whose last paragraphs already discuss buffer hits. One overlap: that
  preceding paragraph's "reads do not alone prove a physical storage access because the
  operating system may cache them" is the hit-rate section's fourth misreading. "Buffer
  pool" in the first sentence and "buffer ring" in the fifth bullet are undefined for a
  reader arriving on the performance path.

**Smallest repair.** Don't restyle the older pages in this restructure. Fix the joins,
which is where the reader actually stumbles:

1. `backup-and-restore`: one bridge sentence at the start of `#pitr` ("This section
   follows the products table from Storage and durability, where P7, a mug, was raised to
   22.00; the experiment after it returns to the orders.") and one at the start of
   `#physical` ("req-c plays the part P8 played above"). Cut the stop-early sentences
   from "What the backup contains" and point to `#pitr-cost`. Trim `#physical`'s first
   paragraph, which re-explains base backup plus archive just after `#pitr` did.
2. `architecture#eviction`: one opening sentence defining the test database (the shop's
   products table and index, 501 pages, and a 14,815-page `page_views` table in a 16 MB
   pool), and one closing sentence returning to product 7.
3. `recovery`: finding 3's two fixes; cut the last sentence of `#checkpoint`'s "workload
   cost" paragraph; add one clause to the opening naming the pgbench runs.
4. `slow-queries`: link "buffer pool" to `storage/#buffers` and "buffer ring" to
   `buffer-pool/#scans`; cut the duplicated sentence from "Plans and changing data".

A voice pass over `backup-and-restore`, `postgresql/recovery` and
`postgresql/architecture` is real work and belongs in the backlog. Of the three,
`backup-and-restore` should come first. Its older prose has the register the house is
moving away from: "establish", "insufficient", sections that end on a maxim ("The
existence of a backup is the beginning of that claim").

### Does point-in-time recovery read whole in backup-and-restore?

Yes, as a mechanism and a procedure. It runs: why durability can't help, a running copy
as a crashed disk, archiving, replay and stopping early with the figure, timelines and
what stopping early costs, MySQL and SQLite, then a real server run, then the
incomplete-chain failure, then validation. That covers every PITR part the map moved,
with its figure, and nothing was lost in the move. The figure's step text and its caption
("Times are invented for the example") still read correctly here.

It doesn't yet read as one part of this page. Three repairs would make it whole:

- the running-example bridge and the de-duplication of the stop-early lesson (above);
- one clause in `#pitr-cost`'s `archive_timeout` paragraph tying it to the page's own
  RPO: "the commits at risk ... are the RPO for a lost disk";
- optionally, "restore time grows with the log" linked back to the RTO paragraph in
  `#requirements`.

The figure shows "Timeline 2" before `#pitr-cost` explains timelines. That is acceptable,
since the explanation follows within two paragraphs.

## The site stays whole

- Redirects: `watching-storage/` and `commit-and-recovery/` both 302 to live pages.
- Links: every internal link and anchor on the seven pages resolves. A grep of `src/`,
  `docs/coverage/` and the skills finds no link to a removed anchor.
- Collection: landing page and `relational-collection.ts` list the deep dive as
  published and both companions as working drafts, with descriptions that match the
  pages. The pager runs Maintaining indexes → Storage → Buffer pool → Checkpoints →
  Understanding database performance.
- Planned against available: nothing in the family offers planned coverage as reading.
- Outstanding, outside this family: `indexes.astro`'s further-reading line still says
  Storage covers "VACUUM and HOT updates" (the writer flagged it for idx-lead), and the
  style skill's pointer to the backups opening (above).
- The buffer-pool companion now has no figure. At 9 minutes with one modelled table that
  is defensible, but its paragraphs average 70 to 90 words and "Starting points" is a
  single 111-word paragraph covering four engines. Splitting that paragraph into four
  short lines is the one repair worth making there now.

## Verdict: ready after the listed repairs

The family's coverage is complete against the map. Every part has a home that teaches it,
the moves lost no condition or step that I could find, and the deep dive is both shorter
and better calibrated to the house voice than before. Two findings carry the weight:
finding 1 could lead an operator to a wrong checkpoint setting, and finding 2 leaves the
deep dive posing a problem it no longer answers. The rest are joins (findings 3, 4, 6, 7
and 10), terms (5 and 9), residue (8) and receiving-page bridges, each a sentence or a
heading. None needs a rewrite, and all can be checked on the rendered pages without
another full review. After them, the deep dive can stand as the house reference once the
style skill's third Storage pointer is updated. The voice pass on the older receiving
pages is follow-up work, not a condition of this restructure.

## Re-read after repairs

Re-read on 18 October after the writer's "Repairs after review" (see
`restructure-2026-10-18.md`). I read the deep dive, the companion and the buffer pool
again from top to bottom on the dev server, including figure steps, captions and
controls, and diffed the rendered text against my first reading. I also read the changed
joins on `backup-and-restore`, `postgresql/recovery`, `postgresql/architecture#eviction`
and `slow-queries#hit-rate`, and checked every internal link and anchor on the seven
pages again. All of them resolve.

### The repairs asked about

- **Torn pages and the write-ahead rule: fixed.** In `#recovery`, a new paragraph after
  the checkpoint paragraph ("Replay also needs a whole page to apply records to...")
  names the torn page, gives PostgreSQL's full-page image and InnoDB's doublewrite, and
  links the companion. That closes the problem `#dirty` poses, and "Damage that is not a
  tear" now reads correctly. The write-ahead rule is now named ("That order is a rule,
  the write-ahead rule") and gets its reason: a page on disk may hold a change that only
  its log record lets recovery finish or undo. That is the step an expert would supply
  and a newcomer couldn't, and it is well placed.
- **LSN at first use: fixed, but in the wrong spot.** The definition now sits between
  "The figure shows what that costs" and Figure 4. It interrupts the lead-in to one of
  the style skill's named passages. It also says "log sequence number" before the
  reader has seen why a log is needed, which slightly spoils the naming of the log after
  Figure 5. And the page now defines LSN twice: "a counter that grows with every change"
  here, "a position in the log that only grows" in `#wal`. **Repair:** move the two
  sentences into Figure 4's caption ("Each page carries a page LSN, a change counter
  that the next section explains"). The prose then reads as it did, and the figure's
  labels still get their gloss.
- **Retry sentence by Figure 8: works.** "So a blind retry could apply the change twice,
  and the retry has to be made safe to repeat" follows directly from what the reader
  just watched: the same dropped connection whether the change was kept or lost. `#loss`
  now points back to it ("as in the crash above") instead of making the point again.
  That is a good join.
- **"Free space and fill factor": fixed.** The heading names the term. HOT is named once
  where it is described ("PostgreSQL calls this a HOT update, for heap-only tuple"). The
  InnoDB/SQL Server paragraph now ends on page splits with a link. The rebuild-versus-shrink
  correction for SQL Server reads cleanly.
- **Companion section order: fixed.** The page now runs checkpoints, torn pages, the log,
  trust, restart, as its opening promises. "Trusting the flush" opens "Every guarantee so
  far rests on...", which reads better after all three jobs. The ceiling clause in
  `#choosing-interval` ("Treat that as a ceiling... measure your own rate on a cold copy
  before sizing to it") fixes my finding 1 fully. The Figure 2 caption lost its hedge,
  and the 1 GB/64 MB paragraph lost its "indication, not a measurement".
- **Reduced `#restart`: mostly right, with one seam.** The repeated outage paragraph is
  gone, and the section keeps only what the deep dive lacks. Its first paragraph ends
  "What each engine adds is in how it treats unfinished transactions", and the next
  begins "Unfinished transactions cost differently in each engine." That is the same
  sentence twice. "Which the checkpoint settings above bound" is stiff. **Repair:** cut
  the first paragraph's last sentence, and write "the measured replay, which checkpoint
  settings bound". The section's last line, "Warming it is part of sizing the buffer
  pool", has a vague "it" and a link labelled *sizing* that lands on `buffer-pool#cold`,
  which is about warming. See the new finding below.
- **backup-and-restore bridge and de-duplication: fixed where it mattered.** "Stopping
  early" is now taught once, in `#pitr-cost`. The cut in "What the backup contains" is
  clean, and `#physical`'s req-c sentence now reads "like P8 above". The closing bridge
  of `#pitr` ("in place of the delete of products, one order is deleted by mistake, and
  in place of P8, a later purchase...") does what I asked. The section says "WAL"
  throughout, matching the page. `archive_timeout` is tied to the RPO ("Set it no longer
  than the gap your RPO allows"). Figure 1 now pauses on timeline 1 and starts timeline 2
  only at promotion, which is more accurate and teaches `recovery_target_action` without
  extra prose. Two small things remain. P7 still arrives cold at the start of
  `#pitr-replay` ("At 10:00 P7 is set to 22.00"), so a reader who comes straight to this
  page doesn't know P7 is a mug from Storage; a half-sentence fixes it. And `#physical`'s
  first paragraph still re-explains base backup plus archive just after `#pitr`. Neither
  blocks.

Other receiving pages: `postgresql/recovery#flush` now carries the `pg_test_fsync`
caveat itself, links the pull-the-plug test to the companion's `#testing`, and points to
"the settings under commit acknowledgement below". Both broken joins are fixed.
`architecture#eviction` now defines the shop's 501 pages and the 16 MB pool. It still
returns to product 7 in the next section with no bridge; that is minor. Not taken up,
and still minor: the "checkpoints are occurring too frequently" advice given three times
on `postgresql/recovery`, and its opening not mentioning the pgbench runs.

### A new finding: link wording overcorrected

My finding 10 asked that article titles not be used as sentence subjects. The repair
went further. Across the family, destination names were taken out of link text and
replaced with phrases. A reader can no longer tell from the link which page it opens,
and several sentences became stilted or misleading:

- `storage/#pages`: "What that changes ... is [a question for indexes]"; "[What each
  index costs a write] follows from this", a sentence that no longer says where the
  explanation is.
- `storage/#buffers`: "are [covered with the buffer pool]"; `#recovery`: "[A companion
  article] shows how to [size that trade]". Which companion?
- `storage/#loss`: "[How point-in-time recovery works, and what it costs], belongs with
  backups".
- `checkpoints-and-the-log/#restart`: "Warming it is part of [sizing the buffer pool]",
  which links to `#cold` and is about warming, not sizing.
- `buffer-pool`: "[the hit rate in slow-query work]" ("slow-query work" is house jargon;
  the page is *Understanding database performance*). Also "The counts are [explained with
  PostgreSQL's eviction]".
- `postgresql/recovery#flush`: "[explained with storage and durability]", a lowercased
  title.

This also breaks from the sibling house reference. *Indexes* names its destinations:
"How a query runs explains the join methods", "Free space and fill factor explains...".
The authoring skill asks writers to match neighbouring pages' link wording. Future
writers will copy the deep dive, so this would spread.

**Repair:** name the destination, with the title at the end of the sentence or as an
object, never as a subject with a comma inside. For example: "Indexes explains what that
changes for a lookup and for the primary key." "How to size that trade is in Checkpoints,
torn pages and the log." "The buffer pool covers the two caches and how to size the
pool." "Point-in-time recovery is explained in Backups and recovery." "Warming the pool
again is covered in The buffer pool." This is about ten sentences in all, and each is a
like-for-like edit.

### Does 30 minutes earn its two extra minutes?

Yes. Rendered text grew by about 340 words. Nearly all of it closes a gap an informed
reviewer found: the write-ahead rule's reason, LSN at first use, torn pages and their
guards, the retry consequence, the corrected SQL Server versioning and rebuild behaviour,
and SQLite WAL mode's flush count without the "once instead of twice" contradiction.
The asterisk note on the commit table and the trimmed hedges took words out. I found no
addition that is depth the subject doesn't need.

### The style skill's third Storage pointer

**Confirmed: replace "the backups opening" with `#commit-wait` into `#group-commit`.**
The passage runs from "While a transaction runs, its log records collect in a buffer in
memory" to "Sharing a flush this way is called group commit." In between, the reader
sees 5.1 ms and 10.2 ms in a measured table; the next section explains exactly why the
second is twice the first ("each waits almost two: 10.2 ms, twice 5.1"); and only then
does the term arrive as the name for what they saw. Measured numbers, mechanism in
words, then the term: this is the anchors' structure at its plainest, and it survived
every repair unchanged.

**Should the backups passage stay named, now that it lives in `backup-and-restore#pitr`?**
Keep it, but under its new location and as a passage only: "the opening of How
point-in-time recovery works (`backup-and-restore#pitr`), which builds point-in-time
recovery from mechanisms the reader already has." It is still the skill's one example
of building a new mechanism from earlier ones, and it moved verbatim. Add a clause that
the page around it is older prose and not itself a reference. Otherwise a writer told to
copy *Backups and recovery* would copy the formal register around the passage.

### Updated verdict: ready after two small repairs

Every consequential finding from the first reading is fixed. The checkpoint sizing no
longer invites a wrong setting, the deep dive answers the torn-page problem it poses, the
broken joins are mended, the companion keeps its promised order, and point-in-time
recovery now reads as one part of its new page. Two repairs remain before the deep dive
is copied as the house reference:

1. Restore destination names in link text across the family (the new finding above).
2. Move the LSN definition from the Figure 4 lead-in into its caption.

The `#restart` seam, P7's cold arrival in `backup-and-restore`, and the minor
receiving-page leftovers can go in with them or later. None needs another full review;
a look at the rendered sentences is enough. After the two repairs, and the style-skill
pointer change above, I would call Storage and durability ready as a draft and fit to
serve as the house reference. As always, that doesn't authorise publication.
