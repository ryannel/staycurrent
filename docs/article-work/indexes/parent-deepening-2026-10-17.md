# Parent deepening decisions, 17 October 2026

Scope: the parent's share of `coverage-map-2026-10-17.md`. Companions (`indexing-queries`, `maintaining-indexes`) are written separately; the parent links to both and does not edit `relational-collection.ts`.

Added: h2 "Indexing for a query" (`#design`, after the write costs so the procedure can cite cost and plan reading), h2 "When the database ignores an index" (`#ignored`, after Checking with EXPLAIN, with a symptom-to-cause table and seven h3s), h3s `#key-choice`, `#order`, `#combining`, `#deleted-rows`, `#redundant`, a skew paragraph in Selectivity, partial-index queue and soft-delete sentences, a join paragraph in Unique indexes and foreign keys, an intro sentence, an InnoDB fan-out clause.

Decisions: the sargability catalogue stays short (functions, casts, one rewrite example) with a link to the queries companion for the long list. Statistics maintenance stays a paragraph with per-engine commands; the maintenance companion owns routine and rollouts. "Deleted rows" uses one measurement (234/166 to 25/19 pages) from the parent's own run; the maintenance companion may report its own numbers, so check they are consistent in framing. The stale-statistics example honestly shows a wrong estimate without a flipped plan. Not added: SQL Server detail, HypoPG, B6 prefix indexes, G10 corruption checks, E5 beyond a link.

## Repair after the trio reviews (ownership pass)

- Ignored section: symptom table and proof method kept; wrapped/converted columns, LIKE and OR cut to one short paragraph each (h3 `#ignored-expression`) linking to indexing-queries `#bare-column`, `#types`, `#like`, `#or`; the 80/20 status measurement lives only in Selectivity. `#ignored-like` and `#ignored-or` removed.
- Write costs h2 renamed "What an index costs to keep"; building, unused, duplicate, invalid and dropping reduced to one h3 `#upkeep` linking to maintaining-indexes `#build`, `#drop-duplicate`, `#drop-invalid`, `#drop-safely`, `#drop-unused`. `#redundant` removed; statistics paragraph cut to a link to `#stats` and `#stats-stale`.
- Deleted rows: contiguous delete does not shrink the file, one sentence linking `#empty-or-thin`; links to `#measure`, `#rebuild`.
- Order fixes: "Order without sorting" moved under Composite (after the history query), trimmed and linked to indexing-queries `#breaks`, `#paging`; "Choosing the key" moved after Page splits; "Indexing for a query" moved after Checking with EXPLAIN. Range scans' "next section" now true.
- Gaps: "Did the query sort?" row and Handler_read% sentence (not run on MySQL; from the technical review), unique indexes and NULLs / NULLS NOT DISTINCT (from review and knowledge; PostgreSQL 15 feature not re-run), key-ordered conversion now states about 62 pages in 60 searches (argued, not measured), covering paragraph introduces row versions first, HOT sentence rewritten, temporary table named in the opening note.
- Unchanged ids companions use: #writes, #splits, #composite, #covering, #check, #design, #ignored, #kinds, #combining. SQLite runs were 3.51.0 and the article says so.
