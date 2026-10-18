# The three reference articles against the pieces that inspired them

On 18 October 2026 we read Sam Who's Memory Allocation in full, and Ciechanowski's
Gears from "Disc" through "Strings Attached". Then we read Sequence diagrams, Indexes,
and Storage and durability again, as built after the 17 October accuracy fixes. This
note says where the three articles already write in that style, where they drift from
it, and what would close the gap. The structural lessons it checks against are the ones
in `.claude/skills/staycurrent-style/SKILL.md`. Depth is a separate question, covered
in `depth-derivation-2026-10-17/summary.md`; the last section says how the two fit
together.

## Measurements

Prose means body paragraphs and list items, without code, figures, tables or sources.
Sentence and paragraph counts come from a script, so treat them as rough. Figures in
the inspiration pieces were counted from the live pages.

| | Prose words | Mean sentence | Sentences over 35 words | Mean paragraph | Figures | Prose words per figure | In-prose links per 1,000 words |
|---|---|---|---|---|---|---|---|
| Memory Allocation | 2,993 | 14.5 | 1% | 41 | 20 | 150 | 0.7 |
| Gears, Disc to Strings Attached | 3,557 | 20.0 | 3% | 45 | 24 | 148 | 4.0 |
| Load Balancing | 2,324 | 15.8 | 1% | 43 | 21 | 110 | 4.3 |
| Sequence diagrams | 5,923 | 14.4 | 1% | 49 | 10 | 592 | 6.1 |
| Indexes | 7,640 | 18.2 | 5% | 64 | 8 | 955 | 6.8 |
| Storage and durability | 7,715 | 19.7 | 8% | 90 | 11 | 701 | 9.3 |

Three things stand out:

- **Sentences in Sequence diagrams match Sam Who's.** Indexes and Storage are nearer
  Ciechanowski's average, but they have two to three times as many very long sentences.
- **Paragraph length is the bigger gap.** Storage's paragraphs average twice the length
  of either author's.
- **Figures are four to six times sparser than in the inspiration pieces.** Our figures
  are larger, with several steps and controls each, so the count alone overstates the
  gap. Where the figures fall matters more, and that is covered below.

## What the three already do well

- **One running model carries each page.**
  - Sequence diagrams: Mina's booking.
  - Indexes: the 36-order table and customer 42.
  - Storage: P7 on page 12, going from 20.00 to 22.00. Storage reuses it most closely
    to Sam Who's grid. Figures 3, 4, 6 and 10 are the same two lanes with one thing
    changed each time, and the caption of Figure 10 says so.
- **Break, fix, new cost.** Sequence diagrams follows Sam Who's chain almost exactly:
  - Sending the email inside the request makes Mina wait.
  - Not waiting means errors go unnoticed.
  - The outbox leaves a gap when the worker crashes.
  - A retry sends a duplicate.
  - An idempotency key prevents it, but only for 24 hours.

  Storage does the same: from a database with no log, through write-ahead logging, the
  flush ceiling, group commit, checkpoints, torn pages and full-page images, to
  untrustworthy flushes.
- **Each figure is framed by the prose.** The prose before a figure says what to watch,
  and the prose after it says what the reader saw. Every interactive figure has
  stepping, a reset and a text alternative. On the rendered pages the figures look
  finished and work.
- **Exact numbers and real systems.** Examples: undici's 300-second default, Resend's
  24 hours, 190 commits a second at a 5.1 ms flush, 367 entries on a leaf page.
  Invented figures are labelled as invented.
- **Plain verdicts.** For example: "Neither version suits a booking." "Keep the ORDER BY
  in the SQL." "If you cannot show that it does, the safe choice is to leave it on."
- **No Ciechanowski-style introductions.** None of the three opens with a persona or a
  story about the author.

## Where all three drift

### Figures thin out where the reasoning gets hardest

In both inspiration pieces, figures keep arriving until the end, because each new idea
is a change to the model. Ours cluster around the mechanism and stop when the article
moves on to cases and operations:

- **Indexes:** no figure in the last 3,400 words except Figure 8.
- **Storage:** none in the sections on row versions, log volume, or choosing a
  checkpoint interval.
- **Sequence diagrams:** none in the section on order and gaps.

These stretches ask the reader to hold a changing state in their head. Sam Who would
show that state changing. Most of the missing figures could reuse a model the page
already has, with one thing changed. The per-article sections below list them.

### Engine differences interrupt the explanation

The general-article rule asked us to name where InnoDB, SQLite and SQL Server differ,
and the articles do. Indexes and Storage do it in asides, often one per paragraph, so
each mechanism is told in a stop-start rhythm. Sam Who handles variation differently:
the malloc(0) paragraph gives three behaviours in a row, then a verdict.

Where the articles gather differences into a short paragraph or a table after the
mechanism, it reads well. Examples are Storage's tables of old versions and of clean
page copies, and Indexes' table of EXPLAIN terms. That pattern should replace the
scattered asides.

### Research notes sit in the reading path

Storage has eight sentences that say where a fact came from or how sure we are:

- "inferred from how the documentation presents it"
- "in the source, not in the manual"
- "reasoning from the mechanism, not a documented rule"
- "arithmetic, not a documented limit"
- "an observation, not a benchmark"
- "a best case" (twice)
- "arithmetic from assumptions"

Each was added for a good reason during accuracy review. Together they bring back the
hedging register the owner rejected in the 16 October brief.

Keep any qualification a reader needs to act correctly. For example, the max_wal_size
trigger comes from the source code and could change between versions. Say it once, in
a clause where it matters. Move the rest to the sources section or the review notes.

### Links and sign-off endings

Storage has 9.3 in-prose links per 1,000 words, about twice the inspiration pieces at
most. Many sections in Indexes and Storage end on a sentence that only points
elsewhere, after the point has been made. Examples: "Measuring size and bloat shows how
to see it…" and "The buffer pool also covers…". The section then ends on a signpost
rather than on its point.

A consistent, visually distinct "Go deeper" line would fix this, or leaving onward
reading to the sources list. Either is a site-wide decision, not a per-article edit.

### Openings carry housekeeping and previews

Each opening gives the model first, which is right. Each then spends a paragraph on
something the reader can't use yet:

- **Sequence diagrams** previews the later sections and names PlantUML.
- **Indexes** explains the toy table, the generated table, the temporary table and why
  plans say "local".
- **Storage** lists five decisions and the one thing to check for each, in one
  130-word paragraph. Phrases like "timed against requested checkpoints" mean nothing
  to the reader at that point.

Sam Who introduces the grid when the first figure appears.

## Sequence diagrams: light edits

This is the closest of the three. Sentence length matches, the chain is complete, and
all ten figures are interactive.

- **Code listings.** Fifteen Mermaid listings repeat the figure they follow. Each one
  turns the reading from what the diagram means to how to type it, then back again.
  Keep the listings that teach a notation decision:
  - `-)` against `->>`
  - `-x` for a lost message
  - the note that stands in for `ref`
  - Mermaid's reading of `critical`

  Put the rest behind a "Mermaid source" disclosure on each figure, or in the syntax
  companion. The depth comparison recommended the same cut for its own reasons.
- **Order and gaps.** This section is the best place in the article for an animation.
  Reuse Figure 4 and move the worker's poll earlier, so the 201 and the claim swap rows
  and nothing else changes. "Both listings are the same diagram" becomes something the
  reader sees.
- **Timeouts inside timeouts.** The section asks the reader to scroll back to Figure 2
  and set two controls. Give it its own copy of that model, with the browser timeout
  already in play. Figure 2 then needs only the database time.
- **The outbox section** opens with a definition. The previous section has just shown
  the problem, so let this section open with the fix happening, and name the
  transactional outbox afterwards. Keep definition-first openings for notation readers
  look up, such as lifeline, activation bar and lost message.
- **Review list and common mistakes.** The two lists restate what earlier sections
  ended on. Merge them into one list, and keep the worked application, "Try three of
  them on the outbox diagram". That part works.
- **Opening.** Drop the fourth paragraph and the PlantUML sentence.

## Indexes: new figures in the second half and one model

The first half matches the style well. "So far, nothing says how a search finds the
first 42" is exactly the transition the inspiration pieces use. The second half drifts:
longer paragraphs, engine asides in most of them, and almost no figures.

- **Two models at once.** Every section reports the toy table, then "on the generated
  table". Some sections then switch to one of several variants:
  - a table of 1,936 pages with an email column
  - a shuffled copy
  - a status variant
  - a 50,000-row statistics table
  - tables of 100,000, 1 million and 10 million rows

  Neither inspiration piece runs a second model. Two changes would help:
  - Measure everything on one generated table that has every column from the start.
  - Put the at-scale number in the figure as a second counter, such as "At 60,000
    orders: 62 pages", so the prose keeps at most one scale number per section.
- **New figures that reuse existing models:**
  - **Page splits:** sequential against random keys filling leaf pages, about 15/16
    full against anywhere from half to 15/16. Use Figure 8's page-fill shading.
  - **Deleted rows:** scattered deletes thin every page while the page count stays the
    same; contiguous deletes empty whole pages; REINDEX compacts. This is the
    fragmentation lesson in database form.
  - **Covering indexes:** the Heap Fetches counter against each page's visibility bit.
    VACUUM sets the bit and an update clears it.
  - **Leading column:** Figure 5 with a condition on placed_at only, over the
    (customer_id, placed_at) index. The scan walks every leaf, which is the 242 pages at
    scale.
- **Engine asides.** Gather the asides in Order without sorting, Combining two indexes,
  Covering, the partial, expression and unique indexes, and Building into a short
  paragraph or table after each mechanism.
- **Opening.** Move the fifth paragraph into Sequential scan, where Figure 1 introduces
  the toy table. Move the explanation of "local" to the EXPLAIN section, where a plan
  first shows it.
- **Long sentences.** Split the longest. Examples are the 55-word sentence on wrapped
  columns and the 46-word sentence on finding indexes to remove. Most long sentences
  carry a parenthesis or an engine aside, so the two fixes above remove many of them.

## Storage and durability: lighter paragraphs, real headings, fewer hedges

Storage has the strongest spine of the three and the densest surface.

- **Headings.** Storage's headings are claims, such as "A cache of pages in memory",
  "Changed pages wait in memory" and "The log is written before the pages". They hide
  the terms a skimming reader looks for: buffer pool, dirty pages, write-ahead log.
  Sequence diagrams and Indexes use the field's terms. An agent chose these headings
  during the 17 October rewrite; they weren't a user decision. Candidate replacements:
  - Pages
  - Buffer pool
  - Row versions and undo logs
  - Dirty pages
  - Write-ahead log
  - Crash recovery
  - Checkpoints
  - Log volume and retention
  - Torn pages
  - fsync and drive caches
  - Relaxed commit settings
  - Backups and point-in-time recovery

  Changing them changes anchors that other pages link to, including Indexes' link to
  the Pages section, so update those links too.
- **Paragraphs.** These average 90 words. Split them at each step of the reasoning.
  Three passages need more than a split:
  - **InnoDB's commit setting** is one list item of about 250 words. As a table it
    becomes easy to read: the values 0, 1 and 2 against what survives a mysqld crash
    and what survives a power cut.
  - **PostgreSQL's synchronous_commit levels** for standbys are one 63-word sentence.
    They would also read better as a table: remote_write, on and remote_apply against
    what each survives.
  - **How long it takes** is one paragraph of about 250 words.
- **Research notes.** Move the eight provenance sentences listed above out of the
  reading path, as described in that section.
- **Choosing an interval.** This section is a formula told in a sentence: max_wal_size
  divided by (1 + checkpoint_completion_target). Ciechanowski's order would help:
  1. Say the mechanism in words.
  2. Show the formula on its own line.
  3. Say what it means.

  A single max_wal_size slider would make it visible. It would show the trigger
  distance, the checkpoint interval and the worst-case replay at a chosen replay rate.
- **More new figures:**
  - **Row versions:** page 12 under PostgreSQL, with two versions side by side, against
    InnoDB, which changes the row in place and writes an undo record. An engine
    toggle switches between them, and the table already there can stay.
  - **Who writes a dirty page:** the buffer pool from Figure 2, with dirty slots, and
    a query that has to write one out before it can read.
- **Opening.** Cut the fourth paragraph to one sentence. Move the five things to check
  to a closing table, next to "What can lose a committed change". The scope exclusions
  fit in a clause or in the sources.

## How this fits with the depth findings

The depth comparison already recommends restructuring all three sets. Its cuts target
repeated explanation, re-taught neighbours, PostgreSQL-only detail and, in Sequence
diagrams, the code listings. Those cuts overlap with this note: removing listings and
moving engine detail elsewhere also fixes rhythm.

So the style work belongs in the same restructure, one set at a time, rather than in a
separate pass that the restructure would then rewrite. Three changes stand alone, are
cheap and wouldn't be undone by a restructure:

- Storage's headings
- Storage's opening paragraph
- moving Storage's research notes out of the reading path

None of the three needs a rewrite for style. In rough order of effort:

- **Sequence diagrams:** light edits.
- **Indexes:** moderate. Most of the work is four figures.
- **Storage:** moderate. Most of the work is prose density, plus two or three figures.

## What it suggests for the skills

All four were applied on 18 October 2026: paragraph calibration and research notes in
`staycurrent-style`, engine differences in `staycurrent-authoring`, and figure placement in
its teaching-aid reference.

- **Paragraph length.** The style skill calibrates sentence length at about 16 words.
  Paragraph length showed the larger gap here, so a calibration note on paragraphs
  would help: both authors average about 40 to 45 words.
- **Research notes.** Say that provenance and certainty belong in sources and review
  notes, and that the page states a qualification once, where it changes what the
  reader does.
- **Engine differences.** Say they get their own paragraph or table where they change
  a decision, rather than an aside in each paragraph.
- **Figure placement.** The teaching-aid reference already says one figure every two or
  three paragraphs. Add that figures should keep arriving through the cases and
  operations sections, not only the mechanism.
