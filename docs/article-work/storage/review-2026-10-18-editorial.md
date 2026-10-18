# Storage and durability: editorial review

18 October 2026. Perspective: editor. I read the rendered page at
http://localhost:4321/learn/databases/relational/storage/ from top to bottom. I stepped
through all fourteen figures under every control setting and read their step text,
stats, captions and labels. I wrote this before reading the writer's notes; a short
addendum at the end records what the notes changed.

## What the pass achieved

The sentences and paragraphs are now the right size. The 166 body paragraphs average 45
words, and none is over 75. Sentences average 16 words, and only four run past 32. That
closes the gap the style skill recorded, when paragraphs averaged 90 words.

The running model holds. P7 on page 12, transaction 812 and the change from 20.00 to
22.00 run from the first SQL block to the restore at 13:59. Figures 4, 5, 8 and 13 reuse
the same memory and disk lanes and change one thing each time. Most sections open by
naming their term or by following from the section before.

The opening does its job. The first paragraph says what durability is and what it
promises the application. The third sets memory against disk and asks the question the
article answers. The fourth gives the whole mechanism in five short sentences, and the
fifth names its cost. Housekeeping waits until the Pages section. One repair to the
fifth paragraph is listed under finding 6.

What remains is structural. Each passage reads well alone, and the problems show up
across the page.

## Findings, most consequential first

### 1. Five figures break the watch-then-name pattern

A writer copying this page will copy how its figures are framed, so these matter most.

**Figure 8, crash recovery, has no paragraph after it.** The prose before it explains the
LSN comparison, then says "Choose when the power fails, then watch PostgreSQL recover"
without saying what to look for. The figure ends, and the next line is the heading
"Unfinished transactions". The figure's payoff is that the application sees the same
dropped connection whether the power failed before the flush or after it. The prose
doesn't say so until "What the application knows after COMMIT", more than eighty
paragraphs later ("A server crash adds the case Figure 8 showed"). Repair: before the
figure, say what to compare ("Try all three moments, and watch what the application
sees in each"). After it, add two or three sentences. With the commit record on disk,
recovery finds page 12 older than the update record and applies it. Before the flush,
nothing of the update survives. In both of the later cases the application saw only a
dropped connection.

**Figure 9, checkpoints, has two jobs, and its debrief covers one.** The engine toggle
compares rounds with continuous flushing, and the second control compares frequencies.
The paragraph before the figure says InnoDB's difference is "a stall rather than a
spike", which a figure counted in records rather than time can't show. The paragraph
after it reports only the rounds model. A reader who switches to the continuous model
sees it replay 7 records with 24 page writes, where rounds replayed 5 with 30. At 20
records the two models give identical numbers. Nothing tells the reader what that
means. Repair: either drop the engine toggle and let the figure teach frequency alone,
or add a sentence naming what the continuous model showed: fewer page writes, and
replay that never falls to zero, because the position trails the oldest dirty page.

**Figure 11, torn page, asks the reader to try `full_page_writes` on and off, and the
prose reports only "on".** The off case is the payoff. With checksums, recovery stops
with an invalid-page error. Without them, the new LSN in the first sector makes the page
look current, recovery skips the record, and nobody notices the tear. That exists only
in the figure's step text. Repair: one short paragraph after "One image per checkpoint
is enough".

**Figure 1 never names what the reader watched.** The prose says "watch each page fill
from both ends until the two meet", and afterwards gives row counts. The entries
growing down from the header, line pointers, are named only in the figure's title and
labels. The next paragraph gives P7's address as "page 12, item 3" without saying that
the item is a line pointer. Repair: "The small entries growing down from the header are
line pointers, one per row. A row's item number is its line pointer, so the row can move
within its page without its address changing." That also gives the `ctid` paragraph a
reason to be there.

**Figure 13 never gets its name.** The field calls `synchronous_commit = off`
asynchronous commit, and PostgreSQL's own page has that title. The term never appears
in the prose. It shows up first in a table cell under "Choosing what may be lost".
Repair: after "The reply came before the flush", add "This is called asynchronous
commit." See also the heading note under finding 7.

Lesser cases:

- Figure 12's debrief ("The database couldn't notice anything wrong with the second
  drive") sits under a new h3, so a heading falls between the figure and what it
  showed. Move the heading below that paragraph.
- Figure 14 comes after prose that already gives the outcome ("so the delete is gone and
  P7 is back at 22.00"), so the reader watches what they've just been told. End that
  paragraph before the result, and let the figure and "What stopping early costs"
  deliver it.
- The paragraph before Figure 1 says "Press play", but the figure plays by itself when
  it scrolls into view. Say "Watch".

### 2. Source-recording and lab notes are still in the body

The style skill quotes this residue from Storage itself, and about ten sentences remain.
Each records where a fact came from instead of stating it.

- "This rule comes from PostgreSQL's source code rather than its manual, so it may change
  between versions." (Choosing an interval.) It lands straight after the formula and its
  meaning, which otherwise follow the mechanism, formula, meaning pattern exactly. The
  sources section's note on `xlog.c` already says it. Cut it here.
- "The manual notes that killing the process does not help" becomes "Killing the process
  doesn't help: the rollback starts again on startup."
- "The manual says flushing grows more aggressive once…" and "The manual gives no
  formula for sizing it, but the mechanism suggests a method." State the behaviour, and
  start the method with "To size it, sample the log position twice…".
- "the documentation puts the longest risk window at three times that delay" becomes
  "the longest risk window is three times that delay".
- "PostgreSQL's documentation names ZFS…" and "the manual notes the buffer is turned off
  automatically on Fusion-io devices". State both facts directly.
- "'About a second' is approximate: the manual warns…" is a whole paragraph of
  qualification. Fold it into the table: "about a second, sometimes longer; set by
  `innodb_flush_log_at_timeout`".
- "PostgreSQL's documentation says the same: any inconsistency in the copy 'will be
  corrected by log replay'." The paragraph before has already said it. Cut the quote and
  keep the `full_page_writes` sentence.
- "The warning appears in every engine's documentation", followed by three quoted
  manuals. One sentence carries the evidence: "PostgreSQL, MySQL and SQLite all warn
  that many drives acknowledge a flush before the data is safe."

Method paragraphs do the same thing at greater length. Before the commit-rate table, two
paragraphs describe the laptop, the pgbench script and `wal_sync_method`, starting with
"so read them as an example of the pattern rather than typical numbers". Recovery time
does it again ("The replay rate was measured once, on the same laptop… 566 MiB (594
MB)…"). The reader needs one clause, such as "On one laptop SSD, with PostgreSQL set to
make the drive really flush". The rest belongs in the table caption or the sources
section. The fact that macOS acknowledges a flush early appears in the commit section
and again in "Checking your own storage". Keep it in the second, where it's the point.

The replay rate's ceiling caveat appears three times: "Treat that rate as a ceiling"
(Recovery time), "That rate is a ceiling, so a real plan should use…" (Choosing an
interval), and the half-rate option in Figure 10. Keep the first, with its reasons, and
the figure's control.

Two captions follow the "not a benchmark" pattern the style skill quotes: "A model of
the ceiling, not a benchmark" (Figure 7) and "Arithmetic from PostgreSQL's trigger rule,
not a recording of a server" (Figure 10). Figure 4's "A hypothetical design, shown for
contrast" changes how the picture reads, so it should stay.

### 3. SQLite asides interrupt the central argument

Where an engine difference changes a decision, the page mostly handles it well. The
tables in Row versions, Torn pages and Relaxed commit settings do this, and so does the
"In MySQL and SQLite" subsection that closes Backups. That subsection is the model to
copy: explain the mechanism once on PostgreSQL, then gather the other engines under
their own heading.

The early sections don't do that, and SQLite's rollback journal is the clearest case.
Row versions mentions it as "described below", Dirty pages mentions it again, and the
explanation comes only at the end of Write-ahead log. The Dirty pages interruption costs
the most. Figure 4 breaks the design without a log, the prose proposes the obvious fix,
and the next paragraph gives two reasons the fix is a bad trade. Then: "SQLite's default
mode does write the pages at commit, and a journal, described below, is what makes that
safe. So what does the commit write instead?" The aside lands between the cost and the
question that opens the WAL section, at the point where the page has the most momentum.
The same exception leaks into the main line as qualifiers: "In most engines" (twice) and
"For engines that keep a log, as most do".

Repair: cut the SQLite sentence from Dirty pages and drop "for engines that keep a log,
as most do". Explain the rollback journal once, in its own subsection. The other SQLite
sentences ("SQLite has nothing to group…", "SQLite's recovery is the journal restore…",
"SQLite has no background writer…") can then point back to it or move into it.

The Pages section piles up engine comparisons before the reader has watched anything.
Before Figure 1, the reader meets three engines' page sizes, TOAST and InnoDB's off-page
pointer, heap against clustered B-tree against rowid tree, and a lookup that needs two
descents. Then comes housekeeping ("How these layouts fill, split and age is the subject
of Indexes; here only the page matters. The drawings and numbers in this article
describe PostgreSQL 18's defaults…"), which admits the detour. After the figure, two
paragraphs on reclaiming space (`VACUUM FULL`, `ALTER TABLE … FORCE`, SQLite's `VACUUM`)
leave the durability thread entirely. Repair: keep the page, Figure 1, `ctid`, and the
index paragraph that leads to "writes more log per row". Shrink heap against clustered
to one sentence with the Indexes link. Move TOAST and space reclamation to the linked
articles or the sources list. Cut the scope sentence, because the title line already
says it.

### 4. Terms are used before they are explained

**Full-page images** appear as a cost in six places before the Torn pages section
defines them: Recovery time ("mostly full-page images, whole-page copies that replay
quickly, described under torn pages below"), the paragraph before Figure 9, its caption,
the paragraph after it, Choosing an interval, and the Log volume list. Each place
re-explains a little. Either move Torn pages ahead of Checkpoints, where it can follow
Crash recovery, or define the image once at first use and drop the later glosses.

**Checkpoint** is defined twice in nearly the same words: "the last checkpoint, a
position before which the engine knows every change is already in the table files"
(Crash recovery) and "A checkpoint is a log position before which every change is
already in the table files" (Checkpoints). Figure 5 gives a third version, and Figure 9's
steps call the same thing a "redo point", a term the prose never uses. Keep one
definition and one name.

The page has more than twenty signposts such as "described below", "as the section on X
explains", "covered under" and "returns to". The ones that point back to the running
model help. Most of the forward ones mark the two ordering problems above, and fixing
those removes them.

### 5. The longest stretch without a figure holds the hardest state

Between Figure 13 and Figure 14 there are 30 paragraphs and about 1,260 words: InnoDB's
commit values, the binary log, SQLite's synchronous modes, choosing what may be lost,
synchronous replication, what the application knows after `COMMIT`, and the first three
backup subsections. This stretch holds the hardest passage on the page. The
`sync_binlog = 0` paragraph asks the reader to hold two logs on one machine and a replica
on another. Its last sentence then reverses direction: "A replica that had already read
events the source then lost holds commits the source no longer has." Synchronous
replication is a list of stopping points along a path, which is what the flush-path and
lane figures already draw. Two suggestions, most valuable first. Add a standby to the
lanes of Figure 13 or the layers of Figure 12, and show each `synchronous_commit` level
as a stopping point on it. At the least, split the binary log passage so that each
direction of divergence gets its own short paragraph.

Group commit has a smaller version of this. Figure 7 shows counts, not time, so the
reader works out unaided why a commit with sixteen clients takes 10.2 ms rather than 5.1.
The prose also contradicts itself slightly. It says "a commit takes between one and two
flushes: that is the 10.2 ms in the table, twice 5.1", then "So commit latency is flush
latency." Repair: "A commit that arrives during a flush waits for the rest of it and then
the whole of the next. With every client committing again the moment it's answered,
nearly every commit arrives just as a flush starts, so each waits almost two: 10.2 ms."
Then change the verdict to "So flush latency sets commit latency."

### 6. Announcements and polished endings

There are few of these, mostly in the second half, but they cluster.

- Backups announces familiarity three times in four paragraphs: "That second part is
  nothing new.", "Each piece is something the earlier sections already described." and
  "You already know what repairs that." One of the best sentences on the page sits
  between them (see below). Cut the first two, and keep "You already know what repairs
  that", which leads into a mechanism.
- "So the target is not what needs attention here; the cost is." Plainer: "That leaves
  plenty of room under the 30-second target. The cost is elsewhere: a checkpoint every
  20 seconds…"
- "Continuing as if nothing had happened is how a database loses writes without telling
  anyone." and "a failing archive is how the history develops a gap" end on a turn of
  phrase. Plain versions: "A retry that reported success would hide the lost write." and
  "If archiving fails, the archive has a gap, and no restore can replay past it."
- The opening's last sentence, "The storage settings in this article trade costs like it
  against what a crash can take away and how long recovery takes", announces the article
  and leaves "costs like it" vague. Give the cost a number instead: "On a drive that
  takes 5 ms to flush, one client can commit at most 200 times a second. Most storage
  settings trade that wait, and the page writes behind it, against what a crash can take
  away and how long recovery takes."
- Relaxed commit settings says four times that the database stays consistent: in its
  opener, after Figure 13, in the figure, and in "In every case recovery still replays
  what reached the disk, in order, so the database ends consistent." Cut the last.

### 7. Headings

Most headings use the field's terms and lead into their sections: Buffer pool, Dirty
pages, Write-ahead log, Group commit, Torn pages, Page checksums, Recovery time. Three
don't.

- "Relaxed commit settings" is house phrasing. Readers search for "asynchronous commit",
  which is PostgreSQL's page title, and the term never appears in the prose. Rename the
  section "Asynchronous commit". The name still covers InnoDB's and SQLite's settings.
- "In rounds or continuously" describes rather than names, and the body already uses
  InnoDB's terms "fuzzy checkpointing" and "sharp checkpoint". "Periodic and fuzzy
  checkpoints" would orient a skimmer.
- "Choosing an interval" is about sizing `max_wal_size`. "Sizing max_wal_size" or
  "Choosing a checkpoint interval" says what the section does.

Smaller: the h2 "`fsync` and drive caches" goes straight into an h3 with no paragraph
between them. "Log records and MySQL's binary log" joins two subjects. The binary log's
introduction would sit better in the commit-settings section, where it first matters.

### Smaller notes

- The first row of the "What can lose a committed change" table packs four engines'
  loss windows into one comma-chained cell, with a clause inside a clause ("and at 0 even
  after a crash of the MySQL process alone"). Split it into a short list in the cell.
- Figure 9's second control is labelled "Batch every", which fits the continuous model
  but not rounds. "Every" or "Act every" works for both.
- Figure 7's step text keeps "Clients that were answered … carries them together" when
  one client is selected.
- "At 60 MiB a second, the default 100 MiB lasts under 2 seconds": the 60 MiB is
  invented. Say so, or tie it to a stated workload.

## Passages to point to

1. **From Figure 4 to the naming of the write-ahead log.** "The application was told the
   change committed, and the change is gone. The obvious fix is to write page 12 to the
   table file before replying." Next come two concrete reasons the fix costs too much,
   then the WAL figure, then "The log records reached the disk before the reply, and page
   12 reached the table file only later. That order gives the log its name." This is
   break, fix, new cost, and the term arrives as the name for what the reader just
   watched. Once the SQLite sentence comes out, it will be the cleanest example on the
   site.
2. **The Row versions opening and what follows Figure 3.** "An update can't simply
   overwrite P7. A long report that began before the update must still see 20.00… If the
   update rolls back, 20.00 has to come back too. So the engine keeps the old version of
   the row somewhere." The section opens on a problem from the running model, not a
   definition. Figure 3 runs both engines on the same update. The two paragraphs after it
   name row version, VACUUM, undo log and purge from what the reader saw, and the table
   gathers the engine differences where they change a decision.
3. **The Backups opening and point-in-time recovery.** "Durability protects committed
   changes from a crash. It doesn't protect them from losing the disk, or from a
   mistake… If someone commits DELETE FROM products, crash recovery will faithfully keep
   the delete." Then: "Point-in-time recovery is crash recovery started from an older
   copy of the files, fed with a saved log, and stopped early." And: "When the copy
   finishes, it looks like the disk of a server that crashed: some pages are old, some
   are new, and one may have been caught mid-write." This shows a new subject built in
   plain words from mechanisms the reader already has. Point to it after the two
   announcements are cut.

Two smaller passages are also worth pointing to. The Buffer pool debrief names read, hit
and evict from what the reader just watched, then ties them to an `EXPLAIN` line. The
spinning-disk flush test ("At 7,200 rpm it turns 120 times a second…") shows exact
numbers ending in a plain verdict.

## Verdict

**Ready after the listed repairs.** The pass did what it set out to do for sentences and
paragraphs. Their lengths now match the calibration, the running model holds, and the
best sections are as good as anything on the site. But a reference teaches by example.
As it stands, a writer copying this page would learn that a figure can end without a
debrief (Figure 8), that a figure's second control needn't be explained (Figures 9 and
11), that a term can live only in a figure label (line pointers, asynchronous commit),
and that "the manual says" is acceptable phrasing. The repairs are local. Add three
debrief paragraphs and two naming sentences. Delete or move about ten source-recording
sentences and the lab-method paragraphs. Take the SQLite aside out of Dirty pages and
explain the rollback journal once. Define full-page images and checkpoints once each,
and rename two headings. The crowded Pages section and the stretch without figures
before Figure 14 are larger jobs. They don't need to hold the article back as a
reference, provided the style guidance doesn't point writers at those stretches.

## Addendum after reading the writer's notes

I read `style-pass-2026-10-18.md` after writing the review. It changes two findings and
leaves the verdict as it is.

- **Source-recording (finding 2).** The writer audited the eight provenance sentences the
  style skill quotes, removed four, and kept four deliberately as single clauses: the
  trigger rule's source, the laptop rates, the replay ceiling, and InnoDB's undocumented
  sizing. That fits the skill's allowance ("say it once in a clause where it matters"),
  so I'd soften my repair for those. Keep the trigger clause, but cut it to its
  consequence ("The rule isn't documented, so it may change between versions"). Keep the
  laptop clause and move its method details to the table caption. The ceiling repeat in
  Choosing an interval still goes. The "the manual says / notes / warns" sentences (the
  InnoDB rollback, the redo capacity, ZFS, Fusion-io, "About a second", the backup
  quote, the three quoted manuals) aren't in the writer's list. They look like residue
  the audit didn't reach, and they're what a future writer would copy. The writer's own
  open question flags the redo-capacity sentence as reading oddly. I agree, and the
  "The manual says" framing is part of the reason.
- **Housekeeping before Figure 1 (finding 3).** Moving the PostgreSQL 18 sentence there
  was deliberate, to get it out of the opening. It still interrupts the Pages section,
  and the title line already gives the version and engines, so I'd still cut it.

The notes confirm that the WAL section was rebuilt to show the figure first and name the
log afterwards. That is the first of the passages I recommend pointing to.

## Re-read after repairs

18 October, after the repairs listed in `style-pass-2026-10-18.md`. I re-read the page
source from top to bottom, with headings, captions and tables. I ran every figure's model
headlessly under each control setting and read its step text and counters. I didn't use
the shared browser pane.

### My findings

All seven are resolved, or were decided against for stated reasons that I accept.

- Figures 8, 9 and 11 now have paragraphs that say what the reader saw. Line pointers and
  asynchronous commit are named, Figure 12's heading sits below its debrief, Figure 15's
  outcome now comes after the figure, and "Press play" is gone.
- The "the manual says" sentences are gone. What remains is one consequence clause ("The
  rule isn't documented, so it may change between versions") and the new "Where the
  numbers come from" section, which suits a reference page well.
- SQLite no longer interrupts Dirty pages, and every forward "described below" has gone.
  The remaining signposts point back.
- Full-page images are defined at first use and checkpoints once. Figure 9 says
  "checkpoint position" throughout.
- The new Figure 14 fills the old gap well. Its debrief says what the reader saw, and its
  caption keeps the one qualification that changes how it reads. The binary-log passage
  now takes one direction per paragraph. Group commit is consistent: "almost two flushes",
  then "So flush latency sets commit latency".
- Backups' announcements are cut. "Sizing the log between checkpoints" and "Periodic and
  fuzzy checkpoints" both lead into their sections.

Paragraphs still average 45 words and sentences 16. The longest stretch without a figure
is now 19 paragraphs, down from 30.

### New strains from the repairs

1. **Heading tree.** "Synchronous replication" is now an h3 under the h2 "Asynchronous
   commit", so the contents list reads as a contradiction. It now has its own figure and
   covers both engines. Promote it to an h2 between "Asynchronous commit" and "What the
   application knows after COMMIT".
2. **Two passages now say the same thing about Figure 8.** The new debrief ends "In both
   cases the application saw only a dropped connection, the same whether its change was
   kept or lost." The After COMMIT section still says it again in full: "The application
   sees the same dropped connection whether the power failed before the flush, when the
   change is gone, or after it, when the change committed." Cut the second to "A server
   crash adds the case Figure 8 showed." and go straight to "Either way, retrying
   blindly…".
3. **Line pointers come before the address they explain.** The new paragraph says "A
   row's item number is its line pointer, so the row can move within its page without
   its address changing". Only the next paragraph says what an address and an item number
   are. Merge the two in order: line pointers, then "A row's address is its page and its
   line pointer's number, which you can read as the hidden `ctid` column", then P7 at
   (12,3), then the point about rows moving.
4. **Log volume's list now has four items.** "Three things set how much of it there is"
   is followed by three bullets and then "Maintenance counts too", which is a fourth.
   Make the rewrite a fourth bullet ("Rewrites that reclaim space, such as `VACUUM
   FULL`, which write and log the whole table again"), change "Three" to "Four", and drop
   the sentence about deleting rows.
5. **Merged repairs re-lengthened four paragraphs.** The index paragraph in Pages is now
   88 words, after the added InnoDB primary-key sentence. The first Group commit
   paragraph is 84, Pages' opening is 83 and Figure 9's continuous-model debrief is 76.
   Each splits cleanly at the point where a repair was added: after "depends on the
   engine.", after "every one of them gets its reply.", before "A row can't span two
   pages", and before "But some log always remains".
6. **Figure 14's controls and its prose use different names.** The control offers
   "primary flushed / standby wrote / standby flushed / standby applied". The prose says
   asynchronous, `remote_write`, `on` and `remote_apply`, and later refers to "the first
   case in the figure". The step text gives the mapping, but a reader of the prose alone
   doesn't get it. In the debrief, write "With *primary flushed*, the standby is
   asynchronous: …", and refer to it by that name in the replica paragraph.
7. **Smaller joins.**
   - Crash recovery defines a checkpoint as "a log position". Checkpoints then opens "Each
     new checkpoint moves the checkpoint position forward", which treats a checkpoint as
     an act. "Each checkpoint writes out dirty pages and moves that position forward"
     agrees with the definition.
   - "This is called asynchronous commit." now arrives after the term has been the h2 and
     a link, so it no longer names anything new, and it splits the debrief. Drop it, or
     move it to the section's opening sentence.
   - Figure 9's caption mentions the doublewrite buffer before Torn pages introduces it.
     "InnoDB doesn't log full-page images, so the continuous model counts none" is enough.
   - "…gave these rates: an example of the pattern rather than typical numbers" trails.
     Make it "…gave these rates. They show the pattern, not typical numbers."

### Example passages

All three survived, and the first improved.

- Figure 4 to "That order gives the log its name" now runs without interruption: the
  failure, the fix, "That is a bad trade", the question, and the log.
- The Row versions opening and what follows Figure 3 are unchanged, apart from SQLite's
  rollback journal now being defined in a sentence there.
- The Backups opening now leads straight to "Point-in-time recovery is crash recovery
  started from an older copy of the files, fed with a saved log, and stopped early",
  standing as its own paragraph, followed by "You already know what repairs that".

### Updated verdict

**Ready after the listed repairs.** These are copy-edits: one heading promoted, one
duplicate cut, two paragraphs merged in order, a list made consistent, four paragraphs
split and a few joins smoothed. None needs another review round. The heading tree should
be fixed before the page is pointed to, because writers copy a reference's structure as
well as its sentences. Once these are made, I'd call the page ready as a reference.
