# Storage and durability: existing articles against the consolidated plan

Compared on 18 October 2026, after `storage-consolidated.md` was saved. Inputs: the
extracted text of *Storage and durability* (deep dive, 37 min shown, about 10,900 words
including figure steps and code), *The buffer pool* (companion, 23 min, about 6,000) and
*Watching storage in a running database* (companion, 31 min, about 7,700), with the page
sources and figure step text for what the figures show. I also checked the extracted
*Indexes* page, only to see whether parts the plan puts in article 1 are homed there.

## Summary

The existing set covers the plan's durability material well and its storage-layout
material thinly. It teaches buffer-pool and diagnosis detail far beyond the plan's
depth, and teaches several operational topics two or three times. *Storage and
durability* is in effect the plan's article 2 and most of article 3 in one page, with a
short storage preface and a backups section added. The commit path, group commit, crash
recovery, torn pages, the flush path and the settings decision are accurate and taught in
a good form. What is missing is a layer-1 model at the top, the storage-layout parts the
plan puts at layer 2 (row cost across engines, large values), and SQL Server. The two
companions spend most of their length on PostgreSQL-specific reading of counters and
log lines, which the brief puts in the PostgreSQL series.

**Verdict: restructure the set; the deep dive needs targeted cuts and additions, not a
rewrite.** The existing three pages take about 91 minutes. The plan covers the same
ground in about 51 (its 57 minutes, less the key-choice material that *Indexes* already
teaches).

## How the existing pages map to the plan

| Plan article | Where the existing set teaches it |
|---|---|
| 1. How a relational database stores your data | Storage: "Rows live in pages", "A cache of pages", "Updating a row without overwriting it", a paragraph on deletes. Table organisation, key width, UUIDv7 and update cost per index are in *Indexes*. Memory is mostly in *The buffer pool*. |
| 2. How a commit survives a crash | Storage: "Changed pages wait" through "Trading durability for speed", plus "What can lose a committed change". |
| 3. Checkpoints, torn pages and the log on disk | Storage: checkpoints, log retention, torn pages, the flush path. Repeated and extended in *Watching storage*. |
| Not in the plan | Storage: backups and point-in-time recovery. *Watching storage*: PostgreSQL signal reading. *The buffer pool*: eviction algorithms, memory budget, hit-rate reading, online resizing. |

## Part by part

Verdicts: **right** (about the depth needed), **deeper**, **thinner**, **missing**,
**elsewhere** (homed in a neighbour, acceptable), **slower** (a slower form than needed).

### Plan article 1

| Part | Existing | Verdict |
|---|---|---|
| 1.0 Layer-1 model | Storage opening | **Missing**; see "Layer 1" below |
| 1.1 Pages | "Rows live in pages", figure 1 (rows and line pointers filling pages, row size selectable) | **Right.** The figure doubles as a rows-per-page estimate. |
| 1.2 Row cost across engines; measuring size | PostgreSQL only, through figure 1's caption | **Thinner.** Add InnoDB's 18-byte overhead (5-byte header plus 13 bytes of transaction fields), SQL Server's limit, and how to measure real size (about 200 words). |
| 1.3 Size estimate | Figure 1 for PostgreSQL | **Thinner, acceptable.** One worked table estimate would finish it. |
| 1.4 Large values | Two sentences | **Thinner.** No thresholds, no row-size errors, nothing on `SELECT *` or the cost of updating wide rows. About 300 words short. |
| 1.5–1.6 Organisation and key choice | One paragraph; *Indexes* covers width, insert pattern and UUIDv7 | **Elsewhere.** A sound boundary: my plan flagged it as uncertain, and *Indexes* settles it. |
| 1.7 Memory | Storage section (about 480 words, 4-slot eviction figure) plus the whole buffer-pool companion | **Deeper**; see "Material beyond the plan". The storage section is about right on its own. Its eviction-choice step is more than the deep dive needs. |
| 1.8 Where old versions live | "Updating a row without overwriting it", with a three-engine table | **Right** for PostgreSQL, InnoDB and SQLite. SQL Server's tempdb and persistent version store are **missing**. |
| 1.9 Index writes on update | One sentence, inaccurate for PostgreSQL (see "Accuracy"); *Indexes* has it right | **Elsewhere**; fix the sentence. |
| 1.10 Cleanup and the long transaction | The engine table's last two columns | **Right.** |
| 1.11 Space reused, not returned | One paragraph | **Right.** Fill factor isn't mentioned (a sentence). |

### Plan article 2

| Part | Existing | Verdict |
|---|---|---|
| 2.0 Layer-1 model | Opening | **Missing** |
| 2.1 Failures and what covers each | Spread out: crash types appear in "Crash recovery", in figure 9's caption and in the closing loss table | **Right in content, late in place.** The closing table is the summary the plan wanted at the start. |
| 2.2 Write-ahead rule and each engine's log | Figure 3 (a database without a log), figure 4 (with a log), binlog, "SQLite's two ways" | **Right**, in a good form. Figure 3 is an efficient argument for the log. |
| 2.3 Flush price, group commit, batching | Measured commit table; figure 5, an interactive group-commit model | **Right.** The model's three controls teach a little more than needed, but cheaply. |
| 2.4 Checkpoints in brief | "Checkpoints bound the replay": 1,400 words, figure 7, a settings table, interval sizing from `xlog.c`, monitoring | **Deeper** than layer 2. About 900 words are layer 3 or PostgreSQL-specific (layer 4) inside the deep dive. |
| 2.5 Crash recovery | Figure 6 (power fails at three chosen moments), unfinished transactions, measured replay, what recovery can't repair | **Right.** This is the stepped crash-point figure the plan asked for. SQL Server's undo-bound recovery and ADR are **missing**. |
| 2.6 Choosing durability | Three settings, figure 10, a decision table by kind of data, `sync_binlog` and two-phase recovery | **Right.** It is the strongest section. SQL Server delayed durability is **missing**. |
| 2.7 Corner cases of relaxed commits | One sentence says the application is never told | **Thinner.** Neither corner case appears: another session or an email acting on a commit a crash erased, or a planned SQL Server shutdown losing delayed-durable commits. |
| 2.8 Storage must honour the flush | "Whether a flush reaches the disk", in full | **Right, but in the deep dive at layer 3 depth** (see 3.4). |
| 2.9 Where durability ends | "With replicas", "What the application knows after COMMIT", and the whole backups section | **Deeper**; it re-teaches neighbours (see "Material beyond the plan"). |

### Plan article 3

| Part | Existing | Verdict |
|---|---|---|
| 3.1 Checkpoint costs | Storage (rounds or continuous, choosing an interval, seeing a checkpoint, symptom table) and *Watching storage* (log line, recorded cycle, timed or requested, InnoDB checkpoint age) | **Deeper, and duplicated.** The 1 GB against 64 MB experiment is good layer-3 evidence, but it belongs with one telling, not two. |
| 3.2 Torn pages | Figure 8, an engine table, turning protection off | **Right.** SQL Server's detect-only handling, which changes the prediction (repair means restore), is **missing**. |
| 3.3 Write cost tallied | Figure 7 counts images; *Watching* measures a 95% image share | **Right**, though spread over two pages. |
| 3.4 Trusting the stack | Figure 9 (the flush path, honest and dishonest drive), a layers table, fsync failure, checking storage | **Slightly deeper.** The rpm arithmetic, `fio` and `pg_stat_io` timing could go (about 200 words). |
| 3.5 Checksums | One paragraph | **Right** |
| 3.6 The log as a resource | Storage (265 words); *Watching* (about 1,000, with a failing-archive and abandoned-slot experiment) | **Right in total, duplicated.** |
| 3.7 Long transactions at recovery | Storage; repeated in *Watching* | **Right, duplicated.** |

## Layer 1

**Storage and durability** opens with the promise, one example change and a question:
"where does P7 live, and what has to reach the disk before the database can say COMMIT?"
Its second paragraph then packs five decisions, each with "the one thing to check for
it", into three sentences. They use terms (checkpoint, replay rate, archive) that the
article defines only later. A reader who stops after the opening has the question but
not the model. They don't learn that the log is written first, that one flush per
commit is the price, that pages follow later and are replayed from a checkpoint, that
old versions make tables grow, or that the promise depends on the storage and on one
machine. The opening is a good hook, but layer 1 needs four or five plain sentences of
model inserted before the decision list, and the list could move to the end.

Detail also arrives before its model in a few places. "Updating a row without
overwriting it" opens by assuming checkpoints write uncommitted pages, three sections
before checkpoints are explained. "Who writes a dirty page" names the checkpointer early,
and "How long it takes" relies on full-page images, which come two sections later. These
are forward references, not errors, but each makes the reader hold an undefined term.

**The buffer pool** opens with its model (the pool as a page cache, hits and reads,
eviction) and the questions it answers. **Watching storage** opens with its premise
(each mechanism reports through counters and log lines) and its four incidents. Both are
sound places to stop.

## Material beyond the plan

Estimates are words of prose, rounded.

| Material | Where | Words | Why it serves no part of the plan |
|---|---|---|---|
| Backups and point-in-time recovery, with figure 11 | Storage | ~1,050 of 1,140 | Re-teaches *Backups and recovery*. Keep one paragraph: point-in-time recovery is crash recovery from an older copy, stopped early. |
| Synchronous replica levels and MySQL semisync detail | Storage | ~170 | *Replication and failover*. A sentence and a link suffice. |
| Uncertain commit outcome | Storage | ~100 | *Handling conflicts and uncertain outcomes*; the sentence linking there stays. |
| Checkpoint interval sizing from `xlog.c`, InnoDB redo sizing method, settings table, `pg_stat_checkpointer` | Storage | ~900 | Layer 3–4 in the deep dive; PostgreSQL parts belong in *WAL, checkpoints, and recovery*. |
| InnoDB page-cleaner thresholds, purge lag | Storage | ~120 | Layer 4 |
| Eviction algorithms: LRU, clock sweep, rings, midpoint insertion, four-policy figure | Buffer pool | ~1,300 of 1,500 | The decision-relevant fact takes a paragraph: sequential scans are fenced off in PostgreSQL and InnoDB, but index-driven bulk reads and bulk writes aren't, so reports can still flush the working set. |
| Hit-rate reading, `pg_buffercache` queries, memory budget (`work_mem` and others), huge pages, online resizing | Buffer pool | ~1,400 | Belong to *Understanding database performance* or the PostgreSQL series |
| Counter mechanics, the checkpoint log-line field guide, end-of-WAL messages, `pg_stat_io` WAL columns, InnoDB message catalogue | Watching storage | ~2,000 | PostgreSQL-only or engine-only reading; the brief sends it to the PostgreSQL series |
| Duplicated across the three pages | All | ~2,100 | Who writes dirty pages is told three times (~600). Also repeated: checkpoint triggers and warnings (~550), log retention (~250), hit rate (~250), InnoDB post-crash rollback (~150), SQLite checkpoint starvation (~150), flush timing (~80), warm-up after a restart (~100). |

That is about 9,000 words, roughly 36 minutes, that the plan would not ask a reader to
read in this collection. Some of it, such as the cold standby after a failover and the
scan-resistance consequence, is real layer-3 value. It needs a paragraph each, not a
section.

## Reading time

| | Existing | Plan |
|---|---|---|
| Deep dive(s) | 37 min (one) | 23 + 20 min (two) |
| Companions | 23 + 31 min | 14 min (one) |
| Total | 91 min | 57 min |
| Same ground | 91 min | about 51 min, after taking out the ~1,300 words of key choice and update cost that *Indexes* already teaches |

A reader who wants the durability decision can stop after about 25 minutes of the
existing deep dive. The plan's article 2 gets them there in 20. A reader who wants
operations has to read all three existing pages, about 91 minutes with heavy repetition,
against 34 minutes for the plan's article 2 and its companion.

## Accuracy

Checked against primary sources. This is not a full fact check, and most claims I
sampled were right: the defaults, the InnoDB rollback warning, the asynchronous-commit
window, PostgreSQL 18 checksums, the SQLite synchronous semantics, the ring sizes in
PostgreSQL 18's `freelist.c`, the InnoDB dedicated-server sizing, and the
`pg_stat_io` move in 18.

1. **Index writes on update (Storage, "Rows live in pages").** "An update changes the
   table page that holds the row and the indexes whose columns it changes" is true of
   InnoDB's secondary indexes. For PostgreSQL, the worked engine, a non-HOT update adds
   an entry to *every* index, because the new version has a new address. HOT applies only
   when no indexed column changes and the page has room (PostgreSQL 18 docs, "Heap-Only
   Tuples"). *Indexes* states it correctly, so the two pages disagree.
2. **Unlogged tables (Storage, loss table).** "The table is empty after a restart"
   should be "after a crash or immediate shutdown". A clean restart keeps the rows.
3. **Checkpoint trigger rule (Storage and Watching).** The `max_wal_size / (1 +
   checkpoint_completion_target)` rule is correct in the source, but the article itself
   says it is undocumented internal behaviour. That makes it fragile in a general article
   that will outlive versions; it belongs in the PostgreSQL series with its version.
4. **Scope against the brief.** All three pages compare only PostgreSQL, InnoDB and
   SQLite. SQL Server differs in ways that change predictions:
   - recovery and rollback time are roughly proportional to the longest active
     transaction unless ADR is on, and ADR is always on in Azure SQL;
   - delayed durability loses commits on a planned shutdown;
   - torn pages are detected by checksum but not repaired;
   - old versions live in tempdb or the persistent version store.

   This is an omission, not an error, but the brief names SQL Server.

## Verdict

**Restructure the set; make targeted cuts and additions to the deep dive.** Nothing
here needs rewriting. The mechanism sections are accurate, measured and taught with
figures that do real work. What is wrong is where the lines fall. Durability operations
are taught three times while storage layout gets a preface. Most of the extra length is
PostgreSQL-specific reading that the brief sends to its own series.

1. **Storage and durability:**
   - add a layer-1 model of about 150 words before the decision list;
   - add the missing storage parts: row cost across engines, large values and fill
     factor (about 500 words);
   - add SQL Server notes where they change a prediction (about 300 words);
   - fix the HOT sentence;
   - cut backups to a paragraph and replicas and uncertain outcomes to sentences;
   - move checkpoint tuning, torn pages, the flush path's checks and log retention into
     the companion below.

   That leaves a deep dive of about 6,000 words (25 min). It could split along the
   plan's two deep dives if the collection wants a storage-layout page of its own; with
   *Indexes* holding key choice, one deep dive is defensible.
2. **Watching storage plus the moved sections** become the plan's article 3:
   - checkpoint costs, torn pages, trusting the stack, the log as a resource, recovery
     time;
   - the four incidents and the cross-engine signals table, kept as reference.

   The PostgreSQL field guides (checkpoint log line, end-of-WAL messages, `pg_stat_io`
   columns) move to *WAL, checkpoints, and recovery*. Target about 3,500 words (15 min).
3. **The buffer pool:**
   - fold the working set, two caches, sizing knee, starting points and warm-up after a
     restart or failover into the deep dive's memory section (about 700 words);
   - or keep a slim companion of about 2,000 words (9 min) if readers come looking for
     it;
   - reduce eviction algorithms to a paragraph;
   - send hit-rate reading to *Understanding database performance*, and PostgreSQL
     internals to the series.

The result is about 50 minutes against 91, with nothing an expert relies on lost.
