# Editorial v03 preparation receipt

Status: reference preparation complete; current corpus release awaited. This is preparation, not a corpus verdict. Assignment remains ongoing for the immutable current manifest, intended audience and all 58 finished pieces.

## Independence and permitted inputs

Read `AGENTS.md`, `README.md`, `docs/site-direction.md`, `.agents/skills/staycurrent-review/SKILL.md` and only its `perspectives/editorial.md`. Read the short `.agents/skills/staycurrent-write/SKILL.md` for its complete-reference delivery protocol. No other perspective file, current relational piece, draft, plan, historical record, author note, finding, earlier report or quality verdict was inspected. The repository README/site-direction contain general publication history; no linked historical/editorial documents were followed.

The eventual review will apply the seven editorial checks to each of the 58 pieces: titles/headings; plain sentences; terms; openings; reader-facing text; captions/labels; one piece. It will also judge complete-piece coherence, prerequisite order, examples, teaching and promised practical judgement, and cross-article consistency of terms, names and the running example. No judgement of current material has begun.

## Complete reference text receipts

Each part below was read in its own bounded tool result from `python3 scripts/read-writing-reference.py ARTICLE PART`, with a 5,000-token output budget. Every result delivered the matching intact `END REFERENCE ARTICLE PART n/N` marker. No result was truncated; no text recovery was required.

| Reference | Complete extracted-text SHA256 | Characters | Parts received, character spans |
| --- | --- | ---: | --- |
| Sequence diagrams | `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c` | 52,666 | 1/6 0:8901; 2/6 8901:17486; 3/6 17486:26211; 4/6 26211:35204; 5/6 35204:44107; 6/6 44107:52666 |
| Indexes | `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1` | 59,821 | 1/7 0:8745; 2/7 8745:17715; 3/7 17715:26516; 4/7 26516:35406; 5/7 35406:44391; 6/7 44391:53229; 7/7 53229:59821 |
| Storage and durability | `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07` | 52,355 | 1/6 0:8938; 2/6 8938:17794; 3/6 17794:26709; 4/6 26709:35578; 5/6 35578:44552; 6/6 44552:52355 |

All 19 parts include complete prose, code, labels, captions and sources. These hashes are the extraction script's complete text hashes, not source-file hashes.

## Actual styled drawing inspection

Used an owned temporary Chrome browser 1 tab, ID `315244768`, at the existing `http://127.0.0.1:4560` reference preview. It visited only `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`. The normal viewport remained 1488 × 917; no override was applied. The site's existing System theme was selected and remained unchanged (its resolved appearance was dark). An initial browser lookup selected IAB but opened no IAB tab; actual inspection used Chrome 1 throughout.

All 34 actual styled drawings were viewed in screenshots, with nearby prose/caption/controls. Sliders, Back and selected scenario controls were used to follow the explanations. Tall drawings were inspected across overlapping upper/lower views where needed, rather than treated as complete from a cropped viewport. This was editorial reference calibration, not a fresh technical or exhaustive control-state verification of the reference implementations.

### Sequence diagrams: 13/13

| Figure | Actual inspection |
| --- | --- |
| 1 Mina books a repair | Three named lifelines, solid request arrows and dashed return arrows; the four messages form the prose's booking order. |
| 2 Who is waiting | Initial and completed states; browser's hatched waiting bar spans the API/database chain, with state words and clock. |
| 3 Sending the email inside the request | Initial and completed waiting-for-provider states; email round trip precedes 201 and prolongs the browser bar. Upper and lower areas recovered in a centred view. |
| 4 A job in the database | Completed booking, poll, claim, send and mark-sent sequence; the named 0.7 s gap separates the caller's result from the worker. |
| 5 One crowded diagram, or two | Entire crowded seven-lifeline drawing across upper/lower views, then Booking only; the latter removes incidental participants and ends with a ref frame. |
| 6 The same messages in another order | Completed early-poll state; claim and Job J9 precede the browser's 201 on the page, while per-lifeline order remains visible. |
| 7 Checking Mina's details | Completed valid/returning state; alt frame, nested faded opt and faded invalid path distinguish execution from the alternatives retained on the page. |
| 8 Polling in a loop | Completed third-pass state, clock and pass counter; scheduled reply followed by the drawn 2 s wait makes the wasted wait visible. |
| 9 Two requests in parallel | Completed slots-first state; two par sections and the note requiring both replies link the drawing to the page's completion condition. |
| 10 Round trips before the first request | Completed TLS 1.2 state; handshake messages and the explicit two-round-trip/100 ms note precede GET. |
| 11 The same booking, fork or stair | Completed central and delegated states; the first fans out from API, the second nests callers' waiting bars down the stair. |
| 12 One call per repair | Completed ten-pass state, loop guard and pass counter; visible 265 ms clock and final answer support the chatty-call explanation. |
| 13 What crosses the browser when Mina signs in | Static full trust-boundary drawing; code returns through browser, token exchange stays between app server and provider. |

### Indexes: 11/11

| Figure | Actual inspection |
| --- | --- |
| 1 Sequential scan for customer 42 | Actual six-page/36-row grid, highlighted scanning page, row customer/order labels and separate read/checked/matched counters. |
| 2 Building an index on customer_id | Actual heap grid beside index area, initial row-reading stage and page counts distinguishing the invented model from the 60,000-order measurement. |
| 3 B-tree search for one customer_id | Initial/root stage and completed result; root/branch/leaf path, four entries and links to four heap pages, three plus four page counters. |
| 4 Range scan along the leaf pages | Completed 20–34 state; checked entries run across linked leaves and the crossed-out first 42 shows stopping beyond the bound. |
| 5 Finding customer 42's orders in a clustered table | Static four-entry drawing; each order key crosses an explicit upper-level box to its table bottom page. |
| 6 Page visits as the range widens | Completed scattered/all-matching state; every row highlighted, 36 index visits versus six bitmap/sequential pages in bars. |
| 7 Column order in a composite index | Completed customer/date state; two read/fetched entries, no sort, highlighted matching dates and table rows. |
| 8 Index-only scan and the visibility map | Completed non-covering state with two heap visits, then INCLUDE/Vacuumed comparison with checked page bits and zero heap visits. |
| 9 One insert, one update, up to four indexes | Completed four-index insert; separate table/index page rows, filled boxes and counters show eight changed pages, including the history split. |
| 10 The same keys, inserted in order and at random | Completed 75-key state; five near-full ordered pages versus seven uneven random pages and six random splits. |
| 11 Deleting two-thirds of the rows from an index | Completed scattered-delete/reindex state; surviving keys pack into two pages while removed old pages remain indicated. |

### Storage and durability: 10/10

| Figure | Actual inspection |
| --- | --- |
| 1 PostgreSQL rows and line pointers filling three pages | Completed 100-byte state; pointer strips grow down while rows grow up, with 61/61/31 rows on three pages and 132-byte row cost. |
| 2 PostgreSQL: four buffer slots above the table file | Completed P50 read; four in-memory slots above files, evicted page 31 absent and page 13 linked to the query. |
| 3 Where the old version of P7 waits | PostgreSQL completed state, InnoDB completed state and Back to live-report state; old 20.00 in undo with R marker and current 22.00 on page with Q marker. |
| 4 A database without a log | Completed restart state; application heard COMMIT but file and recovered page show 20.00, with explicit lost-commit outcome. |
| 5 PostgreSQL: the price change with a write-ahead log | Completed log-and-later-page state; memory/disk lanes, change and commit records, changed page LSN and later page-write arrow. |
| 6 PostgreSQL: who writes the dirty page a query needs to evict | Completed fell-behind state; dirty outlines, replacement page 13, three remaining dirty pages and one write waited for. |
| 7 Commits sharing log flushes | Completed sixteen-client/five-ms/grouping-on state; alternating groups of eight and explicit 1,600-commit ceiling. |
| 8 PostgreSQL: crash recovery at three moments | Completed after-flush state; WAL commit on disk, connection-lost application outcome and 22.00 restored in memory. |
| 9 PostgreSQL: the flush path | Completed honours-flushes and ignores-flushes states; flash retains the commit in the first, the second gives the same acknowledged COMMIT but loses its record. |
| 10 PostgreSQL: the price change with synchronous_commit off | Completed before-WAL-writer state; acknowledged COMMIT with only older disk records, recovered 20.00 and explicit acknowledged-loss outcome. |

Every touched reference page was reloaded before leaving it, resetting playback and local scenario choices; the owned Chrome tab was then closed. No browser viewport or System preference change needs reversal. No product files, native environment, build or Git action was performed.

## Calibration to carry into the released reading

The references establish their concrete question early, name only terms they are about to use, and develop a continuing example one change at a time. They derive practical decisions from what the example exposed, rather than adding a separate generic checklist. A qualification is placed where it changes the reasoning: the model/observation boundary near the first numbers, the asynchronous-commit risk beside the setting, the heap/clustered-table distinction before row locations are reused. Figure instructions name an observation to make, and the visible labels/counters give readers the material for it. Later article boundaries are meaningful extensions of questions the article has already raised.

The review will use this standard directly and identify concrete reader effects, rather than treating length, sentence-level correctness or a clean first impression as sufficient. Awaiting the root's fixed release; no corpus finding numbers or verdict yet.
