# Rendered reference calibration

On 24 October 2026, the visual reviewer inspected the complete drawings below in the browser at actual 1280×720, recovering tall views with ordinary scrolling. Each was studied with its introductory teaching passage and following explanation. This is calibration, not a new quality review of the references. Source files were not read.

## Sequence diagrams · 13 drawings

Rendered route: `http://127.0.0.1:4350/review/examples/sequences/`.

1. Mina books a repair — ordering through labelled requests and replies.
2. Who is waiting — nested activation/wait bars and clock.
3. Sending the email inside the request — provider wait carried into the browser's wait.
4. A job in the database — browser completion separated from worker activity.
5. One crowded diagram, or two — the comparison between one crowded interaction and focused questions.
6. The same messages in another order — permitted ordering across lifelines.
7. Checking Mina's details — guards, alternatives, optional work and faded untaken paths.
8. Polling in a loop — one drawn body, pass counter and wasted final wait.
9. Two requests in parallel — independent requests and the join condition.
10. Round trips before the first request — protocol flights and the resulting clock.
11. The same booking, fork or stair — where control lives.
12. One call per repair — repeated remote calls and their accumulated cost.
13. What crosses the browser when Mina signs in — trust boundaries and data paths.

The UML/Mermaid/PlantUML notation table was also read and inspected through its final row.

## Indexes · 11 drawings

Rendered route: `http://127.0.0.1:4350/review/examples/indexes/`.

1. Sequential scan for customer 42.
2. Building an index on customer_id.
3. B-tree search for one customer_id.
4. Range scan along the leaf pages.
5. Finding customer 42's orders in a clustered table.
6. Page visits as the range widens.
7. Column order in a composite index.
8. Index-only scan and the visibility map.
9. One insert, one update, up to four indexes.
10. The same keys, inserted in order and at random.
11. Deleting two-thirds of the rows from an index.

Calibration followed the stable orders/pages/keys through the diagrams, labelled counters and illustrative-versus-measured comparisons. Completed states were inspected. All six comparison/measurement/design tables were read and visually inspected: B-tree depth; heaps/clustered tables; history query plans; covering indexes; partial/expression/unique indexes; mapping the query to index columns.

## Storage and durability · 10 drawings

Rendered route: `http://127.0.0.1:4350/review/examples/storage/`.

1. PostgreSQL rows and line pointers filling three pages.
2. PostgreSQL: four buffer slots above the table file.
3. Where the old version of P7 waits.
4. A database without a log.
5. PostgreSQL: the price change with a write-ahead log.
6. PostgreSQL: who writes the dirty page a query needs to evict.
7. Commits sharing log flushes.
8. PostgreSQL: crash recovery at three moments.
9. PostgreSQL: the flush path.
10. PostgreSQL: the price change with synchronous_commit off.

Calibration followed P7, its retained version, memory/disk boundaries, dirty-page state, durable evidence and what the application heard. Completed relevant states were inspected. All seven tables were read and inspected: row overhead; overflow values; version retention; measured commit rates; InnoDB flush settings; data-loss choices; causes of losing committed changes. Tall tables were recovered at their later rows.

## Applied standard

The references make a changing fact visible next to its consequence: arrows and stable lifelines for order, stable pages/keys and counters for database work, and explicit memory/disk/application lanes for durability. Their captions identify illustrative layouts, limits and measurements. Their tables give real headings to comparisons and the player keeps an explanation beside its controls. These are the standards used for the five assigned pieces, with their own simpler visual forms judged on whether they make the required reasoning visible.
