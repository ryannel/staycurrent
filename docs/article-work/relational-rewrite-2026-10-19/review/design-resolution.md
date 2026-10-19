# Design branch review and resolution

19 October 2026. Reviewed RL76–RL87 and RL89. RL88 remains retired. The intact opening-first source reading is in `design-first-reading.md`; it preceded briefs, author notes, the coverage map and external checking. This pass then read the full review/style instructions, all thirteen briefs, their source ledgers, the relevant final map cards, native records and runnable examples. No reviewer subagents were launched from this assigned review.

All thirteen pages are **ready as a draft** for their owned explanations. This means the consequential findings below have been repaired and the revised passages reread in sequence. Frontmatter remains `status: drafting`. It does not authorise publication. The coordinator owns the separate collection-wide checks and complete desktop/phone, light/dark control QA. No human comprehension session was run.

## Findings, decisions and rechecks

### RL76 — fixture identity

The first reading met Mina as `(t4,42)`, then Ada for the same identity in RL77. Although each lab can reset data, this name change bought no teaching value on the new-application route. Aligned this page to Ada. The coordinator separately reran the SQLite evidence and regenerated its observed CSV, rather than editing observed output by hand. The join's keys, output meaning and transaction boundary remain clear on rereading.

The conditional UPDATE sample is explicitly an operation shape with an application branch, not a complete replay-safe booking program. Kept that boundary and the onward request-replay link. The architecture table supplies useful conditional choices, including server-side SQLite; it does not claim a vendor benchmark.

### RL77 — formal vocabulary

The compact BCNF orientation asked a newcomer to supply “nontrivial determinant”. Replaced that phrase with the actual question: do columns determining another value identify the whole row? Kept superkey's local definition and the lossless/dependency-preservation caution. Rereading the whole dependencies section still moves from session/room through composite keys to the stronger check without turning the page into a theory survey. The room anomaly, key schema and agreed-price distinction remain its teaching centre.

### RL78 — retain the explanation

No consequential repair needed. The money, repeated clock, text and NULL examples each change the meaning of equality or comparison. They earn their breadth by the final NOT IN failure. Native records support decimal true/float false, 1.005 rounding to 1.01, the one-hour instant difference, and zero versus one unpaid-order result. SQLite affinity and ASCII-only NOCASE are separately labelled and documented. No generic type catalogue was added.

### RL79 — retain the enforcement boundary

No consequential repair needed. The constraint failures, rejected ownership pair and accepted three-seats-against-two result teach different obligations. Reviewed MATCH SIMPLE/FULL, constraint deferral and SQLite connection enforcement against primary documentation. The page identifies the concurrent sum protocol's job and links RL90/RL91; those pages, rather than an application-side COUNT, own enforcement. The access-policy distinction is explicit.

### RL80 — retain both time questions

No consequential repair needed. Traced 9 October at recorded dates 12 and 16 October through the four interval rows: 20 and 22. The correction is presented as a resulting history, with concurrent correction enforcement explicitly excluded from the small schema's guarantee. History, audit and event sourcing retain distinct jobs. Deletion follows references and restores without promising physical erasure from one DELETE.

### RL81 — retain row-grain reasoning

No consequential repair needed. Traced two lines × two payments into four pairs and the false 90 total; preaggregation returns purchased 45/paid 45 and preserves empty o82. The cancelled-row outer-join counterexample earns its extra paragraph because it defeats the tempting OR IS NULL repair. Grouping is introduced just enough to repair multiplicity, with its full explanation in RL82.

### RL82 — name the measured quantity

The first grouped total included pending o82 but called the output `revenue`. Renamed it `order_value` and immediately stated that pending orders contribute. The later paid-only query now has an explicit reason to differ. Values and SQL operations are unchanged; the author record's earlier alias remains historical execution evidence for the same arithmetic. Reread grouping, HAVING and the paid-total section together: the correction resolves the business meaning without interrupting SQL teaching. Tied frames, ranks and weighted denominators remain traceable.

### RL83 — make the native experiment reachable

The page described B's correction and insert but referred only vaguely to an accompanying experiment. Added a direct link to the two-connection record containing commands and observations. Kept the main page's focus on position, membership and values rather than duplicating a long session transcript. The record confirms the offset repeat, stable keyset continuation, moved unseen order and old snapshot values. Rereading still distinguishes a keyset cursor from a snapshot and fixed IDs from a durable copy of values.

### RL84 — isolation scope and truthful import outcomes

The UPDATE recheck claim originally named PostgreSQL without its isolation condition. Named default Read Committed and the stricter-level serialization failure/retry branch. The revised paragraph still teaches the third capacity attempt's empty result before introducing competing writers.

The batch script computes dispositions before upserting. That is correct for its unchanged destination fixture, but a concurrent newer write could make its precomputed “applied” label false. Explicitly scoped the script, then supplied the live PostgreSQL order: conditional upsert first; capture applied candidates from RETURNING; retain conflict-row locks; read unchanged destinations and classify their revision/payload; record outcomes before commit; retry the transaction on retryable failure. PostgreSQL documents that even a conflict row rejected by DO UPDATE's WHERE remains locked. This is a documentation-backed protocol explanation, not a newly claimed native concurrency experiment. Reread the six-row fixture, classifier and reconciliation together; every input is still accounted for, and fixture results are no longer presented as proof of live outcome accounting.

### RL85 — context-manager precision

Changed “commits on success” to “commits an open transaction on success”, matching Python's documented no-op when there is no transaction. Kept the important separate point that the context does not close the connection. The N+1/batching example, empty parent, cursor error and uncertain commit remain coherent. The streaming heading's initial ambiguity resolves immediately through buffering versus streaming, so no extra heading or paragraph was added.

### RL86 — separate the physical model from universal rules

Kept the full access-path explanation, eleven retained components and new inverted Figure 12. Repaired consequential overstatements without changing measurements or model code:

- Distinguished the clustering key from a declared primary key throughout the shared explanation and key-choice section. SQLite normally uses rowid; SQL Server can choose another clustered key; InnoDB uses the declared primary key. The generic secondary lookup now follows the clustering key. The key-choice heading and link label agree.
- Identified page sizes as defaults, introduced cached page visits before the first measurements, and explained repeated/inclusive cache accesses in EXPLAIN. The arithmetic no longer promises physical disk-I/O counts or distinct pages. Kept each recorded count and its PGlite/native provenance.
- Scoped the leading-column design rule to narrow lookups, retained skip scan as an actual choice, and removed the inference that a later-column condition always scans the same entries. Removed the inference that larger InnoDB pages guarantee equal or shallower trees.
- Replaced the universal scan-and-sort cost verdict with a measured workload choice; included the reverse-index alternative for DESC NULLS LAST. The full-table result remains an observation about the fixture.
- Kept covering values distinct from visibility; acknowledged partial/expression proof and index-only filters. A Filter label alone no longer claims heap work. Replaced SQL Server's unqualified “Never” with the narrower absence of a column-retrieval lookup in a covering path, and named heap RID Lookup alongside Key Lookup.
- Scoped non-HOT entry maintenance to the demonstrated B-tree indexes and named the BRIN summarising-index exception. Bounded queue-index size by backlog/upkeep. Treated key-width arithmetic as representation-dependent, and UUIDv7 arrivals as concentrated near the right edge rather than perfectly ordered across generators.
- Made the stopping condition a workload cost decision; a useful index need not eliminate every filter or sort.

Reread the opening, heap/clustered transition, B-tree counts, composite conditions, covering, writes, key choice, EXPLAIN and final design method after repair. The same progression survives: inspect the model, count the work, change one condition, then account for the saving and its maintenance. The added conditions change decisions, rather than adding a repeated warning to every paragraph.

### RL87 — retain the causal native plan

No consequential repair needed. The native record supports estimate 1/actual 40,000, 40,000 inner probes and 120,723 hits, then estimate about 40,000, hash join and 1,565 hits after ANALYZE. The actual count remains 40,000. Its explicit per-loop, inclusive-buffer and OS-cache explanations are the standard applied to RL86's repair. The three-session orientation does not itself demonstrate forty thousand probes, but the independent event fixture does; no artificial expansion was warranted.

### RL89 — spell out the other engine's consequence

Replaced vague “significant foreign-key restrictions” with MySQL 8.4's actual prohibition: partitioned InnoDB tables cannot contain foreign keys or be referenced by them. Added the exact storage-engine limitation source. Reread the uniqueness/reference discussion with its neighbours: this changes a real product choice without disturbing the PostgreSQL route/attach/detach example. Native evidence supports pruning October, searching both children without date, failed December insert, later attach and preserved detached rows.

## Primary checks

These were independently browsed on 19 October 2026. Existing article source sections retain their fuller ledgers. No MySQL or SQL Server native execution is claimed.

- RL76's local/server boundary: [SQLite appropriate uses](https://www.sqlite.org/whentouse.html), including a remote browser with local application-server database ownership and the one-writer-per-file rule.
- RL77/RL79: [PostgreSQL constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) for keys, NULL checks, references and the cross-row CHECK limit; [SQLite foreign keys](https://www.sqlite.org/foreignkeys.html) for connection enforcement and deferral. The normal-form repair expands the definition already supported by the brief's textbook reference; it adds no new decomposition claim.
- RL78: [PostgreSQL numeric](https://www.postgresql.org/docs/18/datatype-numeric.html), [date/time](https://www.postgresql.org/docs/18/datatype-datetime.html), [subquery expressions](https://www.postgresql.org/docs/18/functions-subquery.html) and [SQLite datatypes](https://www.sqlite.org/datatype3.html). Checked decimal scale, instant/zone distinction, NOT IN missingness and ASCII case folding.
- RL81/RL82: [PostgreSQL window tutorial](https://www.postgresql.org/docs/18/tutorial-window.html) and [window functions](https://www.postgresql.org/docs/18/functions-window.html), alongside traced native result records for grouping and join cardinality. No change to executed arithmetic.
- RL83/RL84: [PostgreSQL isolation](https://www.postgresql.org/docs/18/transaction-iso.html) and [INSERT](https://www.postgresql.org/docs/18/sql-insert.html) for statement/snapshot scope, concurrent UPDATE handling, conditional conflict locks and returned rows; [MySQL upsert](https://dev.mysql.com/doc/refman/8.4/en/insert-on-duplicate.html) and [SQLite conflict resolution](https://www.sqlite.org/lang_conflict.html) for the labelled alternative semantics.
- RL85: [Python sqlite3](https://docs.python.org/3.14/library/sqlite3.html) for binding and connection context, checked against the actual driver's output and PostgreSQL cursor error record.
- RL86: [PostgreSQL multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html), [ordered indexes](https://www.postgresql.org/docs/18/indexes-ordering.html), [index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html), [HOT](https://www.postgresql.org/docs/18/storage-hot.html) and [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html). Compared [InnoDB clustered indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html), [InnoDB page structure](https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html), [SQLite rowid layout](https://www.sqlite.org/withoutrowid.html) and [SQL Server clustered/nonclustered indexes](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described?view=sql-server-ver17). The cross-engine repairs follow these distinct locators, not PostgreSQL assumptions.
- RL87's plan-count interpretation: [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html), native before/after output and documented planner behaviour. No fresh benchmark was run.
- RL89: [PostgreSQL partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html) for local unique keys, pruning and maintenance; [MySQL partitioned storage-engine limits](https://dev.mysql.com/doc/refman/8.4/en/partitioning-limitations-storage-engines.html) for the exact foreign-key prohibition.

## Rendered media reading

After preserving the source reading, opened the private RL86 page in Chrome at `http://localhost:4323/review/relational/rl86/`. Read the live accessible figure content and counters, manipulated step sliders, and inspected screenshots of the scan, sorted-entry and covering models. This was a separate informed media reading, not a second uncued first reading. The chapter prose and source impressions were already known.

1. The scan shows all six pages consumed while only orders 3, 11, 21 and 36 match customer 42. Its completed counters are 6 pages, 36 checked, 4 matched.
2. Building/sorting leaves customer-42 entries together while their TIDs still lead to four scattered table pages. The matching-value highlight preserves identity across the reorder; it does not imply reordering the heap.
3. The B-tree separates three index levels from four table fetches. Its completed live counters are 3 index pages/4 table pages/4 rows.
4. The range follows leaf links and checks the first out-of-range 42. Ten entries return in order, with five model index pages visited and no sort; table fetches are explicitly omitted.
5. The static clustered figure repeats a table-tree descent for order keys 3, 11, 21 and 36, communicating why the locator differs from a direct TID.
6. Widening the range makes scattered matches reach every page early. The completed live comparison reads 36 index-following visits versus six bitmap or sequential table pages. The alternate physical-order control offers the corresponding locality comparison.
7. The default customer/date route stops at two matches with two entries and two row fetches. The three visible index choices explain what changes when customer or date leads; the live accessible descriptions retain 4/2/16 entry counts.
8. Covering separates an available total from a usable visibility bit. Selecting INCLUDE and Vacuumed produced an Index Only Scan with zero heap fetches. Then updated visibly selects the changed-state scenario and labels its native-scale result 5 pages/1 heap fetch; its animation was observed in progress rather than claimed as a second independently completed end-state check.
9. The completed insert model reports four indexes/eight changed pages; the split's branch work is counted even though branch pages are omitted. Its text distinguishes invented fill levels from native WAL numbers.
10. The completed two-row model holds 75 keys on five ordered pages versus seven random pages after six splits. It communicates occupancy, not a UUID throughput benchmark.
11. The completed rebuild model packs twelve surviving entries into two pages. Its controls and descriptions preserve the distinction between scattered deletion, empty reusable pages and file shrinkage through rebuilding.
12. The inline postings diagram communicates intersection directly: wood gives s7/s8, beginner gives s7/s9, and the two-tag query yields s7.

The coordinator's broader visual/control QA remains the evidence for other combinations and viewports. The later browser DOM request timed out; no missing or broken figure was inferred from that tooling timeout. No component code was edited by this review.

## Delivery boundary and per-page status

| Page | Status | Revision checked |
| --- | --- | --- |
| RL76 | ready as a draft | Ada identity; join and architecture reread |
| RL77 | ready as a draft | BCNF wording; dependencies and price reread |
| RL78 | ready as a draft | original reviewed explanation; native/source check |
| RL79 | ready as a draft | original enforcement explanation; native/source check |
| RL80 | ready as a draft | original two-time history; interval trace |
| RL81 | ready as a draft | original join and absence cases; result trace |
| RL82 | ready as a draft | order_value meaning; summaries and windows reread |
| RL83 | ready as a draft | linked two-session record; cursor/export reread |
| RL84 | ready as a draft | isolation and outcome protocol; batch reread |
| RL85 | ready as a draft | open-transaction qualifier; boundary reread |
| RL86 | ready as a draft | bounded physical/portability repairs; model teaching read |
| RL87 | ready as a draft | original causal plan; native counts checked |
| RL89 | ready as a draft | exact InnoDB reference limit; lifecycle reread |

No layout, live route, navigation or coverage-map file was changed. No publication, commit, push or new agent launch was performed. No separate shared distributed-systems work was started. Final repository checks belong to the coordinator because all writers share the build output.

Final file-integrity check: all thirteen frontmatter IDs/statuses remain intact; every linked private review page/evidence file exists; RL86 retains component numbers 1–11 and Figure 12. SHA-256 prefixes of the reviewed files: RL76 `da5d65c4a4646ff2`, RL77 `184080f1cf171684`, RL78 `f971d984579af029`, RL79 `ff83220c92b5501c`, RL80 `a247b008ceb86122`, RL81 `273ce101db5b17ad`, RL82 `8426ace0cde9fe12`, RL83 `b5a3bb849db48dd6`, RL84 `b82e74b46638aada`, RL85 `e57770c822ff51b9`, RL86 `171cd710a2dae37a`, RL87 `5fba607453247b95`, RL89 `781c1bb6860b5350`.
