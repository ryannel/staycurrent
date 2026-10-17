# First reading, general rewrite, 17 October 2026

Uncued reader cast as a developer who uses MySQL at work and SQLite on a side
project, new to storage internals. Text-only reading of the dev-server page; figures
not rendered. Full log returned to the coordinator; consequential observations:

- Opening works: the three "where this reaches your code" cases and the P7 question
  set up the article; the reader could check each later section against them.
- "Updating a row without overwriting it" read as a detour from durability until
  the recovery paragraph tied versions to unfinished transactions.
- The SQLite rollback-journal paragraph inside the log section ("the other way
  round") switches mechanism without warning mid-PostgreSQL story.
- "Rows live in pages", second paragraph (heap, clustered index, ctid, rowid) is
  dense for someone who has just learned what a page is; skippable but not marked so.
- Figure 1 step text says a 100-byte row takes 128 bytes; caption says 132.
- Figure 2 clock-sweep step and Figure 7's seven near-identical steps carry detail
  the thesis doesn't need; Figure 10 repeats Figure 6's recovery text.
- Dropped connection after COMMIT treats only power failure; the commonest case, a
  network drop with the server fine, is not distinguished.
- Torn pages: "35 images vs 12" could not be derived from the text.
- Flush test: the 120/s rule is for spinning disks; no guidance for what thousands
  of flushes a second mean on an SSD with power-loss protection.
- SQLite: defaults for synchronous and journal mode unclear to a user of an ordinary
  connection; no backup answer for SQLite; 600 ms unexplained.
- InnoDB: unclear whether its pages carry an LSN and recovery skips the same way;
  no end-to-end InnoDB picture; per-engine sentences at the end of nearly every
  section were hard to weigh.
- Passages that worked: "The application was told the change committed, and the
  change is gone."; the COMMIT-waited-for-one-thing paragraph; "it just answered too
  early"; "crash recovery will faithfully keep the delete."
