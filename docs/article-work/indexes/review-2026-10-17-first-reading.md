# First reading, general rewrite, 17 October 2026

Uncued reader cast as a developer who uses MySQL and SQLite and is new to indexes.
Text-only reading of the dev-server page; figures not rendered. The reader saw the
heading list before the opening, so heading expectations are partly retrospective.
Full log returned to the coordinator; consequential observations:

- Opening works: the book-index analogy, when to reach for an index, its cost, and
  the page-count question all landed. Pages are asserted rather than shown until
  Figure 1; "query plan" and "planner" are used before definition.
- "Index entries and row locations" teaches the heap and TID first; a MySQL or
  SQLite reader who stops after Figure 2 carries a PostgreSQL model. "Tables stored
  in key order" was the most useful passage for this reader. "Page split" is used
  there before it is defined in write costs.
- Figure 5 caption pointed to figure 3 for the B-tree (fixed: figure 4).
- Range scans ends on PostgreSQL's bitmap re-sort without saying whether InnoDB
  does anything similar.
- Selectivity: the figure paragraph works (8 rows, 22%, every page has a match).
  The last paragraphs stack generated layout, shuffled copy, 500/550 switch points
  and cost units; the reader lost the point. No sentence says that InnoDB and
  SQLite also choose scan or index by estimate.
- Composite: Figure 7 was the most effective device. The plain leftmost-prefix rule
  is never stated; "as MySQL and SQLite can in some cases" leaves skip scan vague.
  57 pages for the reversed index reads as a win without comment on 11,000 entries.
- Covering: the row-version paragraph names MVCC, visibility map and VACUUM without
  showing them; nothing on whether SQLite has the problem.
- Partial/expression/unique: three features under one heading; time-zone reason and
  foreign-key delete reason compressed past what a new reader can supply. MySQL's
  lack of partial indexes and SQLite's expression indexes are implicit.
- Write costs: "InnoDB splits that differently" collides with page splits. SQLite
  absent. Unused indexes names only pg_stat_user_indexes.
- EXPLAIN: the translation table was the most useful thing for this reader; it
  should be signalled earlier that MySQL and SQLite don't report pages. Index Cond
  vs Filter has no MySQL/SQLite row ("Using where").
- Passages that worked: "Its cost follows the size of the table, not the size of
  the answer."; "So far, nothing says how a search finds the first 42."; the depth
  table; "Compare Figure 2 ... Here each entry starts another search."; Figure 6's
  22%; Figure 7; "Read it from the most indented line outwards."
