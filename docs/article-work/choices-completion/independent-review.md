# Independent choices review

Reviewer: existing-lessons agent, who did not author these articles or lessons. Audience: application programmer with the earlier collection’s SQL grounding. Read assembled numbered chunks in order before viewing source, evidence or brief. Observations below were recorded before opening the next chunk. Optional text files were empty.

## First reading

- product-comparison 00: Title promises product selection guidance. No substantive claims yet.
- product-comparison 01: Clear opening connects product choice to execution, concurrency and failure. Expect concrete differentiating workloads rather than feature ranking.
- product-comparison 02: Three recognizable cases establish organizing comparison; awaiting how notebook/shared service/report estate map to product needs.
- product-comparison 03: Scope/version date explicit and useful. Verify current documented semantics later; not reading sources yet.
- product-comparison 04: Section route matches opening; assumptions/access/operations sequence plausible.
- product-comparison 05: Concrete notebook/server cases paid off; SQLite writer serialization explained without false many-users limit. Table focuses on starting investigations, keeps existing operational knowledge in view. Reader restart statement could use a named symptom but linked optional detail sufficient at this depth. No blockers.
- product-comparison 06: Excellent shift from ACID slogan to ordered two-read experiment; covers SQL Server setting and type/enforcement contracts. Numeric rounding example memorable and simulator scope honest. Need verify first-consistent-read qualification under MySQL and SQLite FK default; all looks technically sound.
- product-comparison 07: Physical differences explained through actual lookup/wider-key costs without product ranking. SQL Server PK != clustered key explicit. JSON paragraph generic but focused test instruction makes it useful. No reading repair required.
- product-comparison 08: Operations section changes evaluation behavior: restore rehearsal, hosted permissions, edition and online locking conditions. No unsupported universal cost claim. Specific license Developer factual statement should get primary doc check.
- product-comparison 09: Returns to opening scenarios and resolves them. Practical recommendation with nonuniform physical tuning caveat avoids invalid benchmarks. Ending decision record contains measurable evidence; prose coherent, no forced slogan.
- product-comparison 10: Related practice/implementation/next decision paths relevant. First-reading judgment: strong explanatory article, not a product catalog; no blocking questions.
- adding-another-system 00: Decision title promises conditions for introducing second engine/system.
- adding-another-system 01: Concrete search/report pressures and copying consequences clearly established.
- adding-another-system 02: Distinguishes operations before products. Need later evidence for specialized store gains and local options.
- adding-another-system 03: Narrow product-search thread promises explanatory depth; derived-copy transfer signposted honestly. PGlite single connection limitation explicit.
- adding-another-system 04: Sequence from need→native alternative→delivery/rebuild reads naturally.
- adding-another-system 05: Good workload acceptance examples incl withdrawn record importance; reports tied to answer time. Avoids implying any second engine fixes request overhead.
- adding-another-system 06: SQL taught term-by-term with expected match, typo counterexample, rename/fresh snapshot. Strong no-copy transactional consistency benefit. Three-row capacity qualification prevents toy-benchmark misuse. Verify generated-column immutable config form and literal lesson.
- adding-another-system 07: Sequence table makes eventual propagation interval concrete; stale positive vs missing negative and non-atomic check explained exceptionally clearly. Version tombstone topic likely next. PGlite model honest.
- adding-another-system 08: Outbox local guarantee and redelivery gap explicit. Full-state vs delta version qualification and retained inactive ordering memory are strong. No guarantee inflation. SQL atomicity supported by ON CONFLICT semantics; need test no older revival in lesson.
- adding-another-system 09: Rebuild race followed by consistent snapshot/stream position or explicitly overlapping versions mechanism. Operational visibility and catch-up load connect well. Question for later technical review: exported snapshot exact guarantees, retained stream limits described enough? Not first-read blocker.
- adding-another-system 10: Decision closes opening shop scenarios; references measurable relevance/resource/recovery and freshness. Responsibilities list earned by preceding explanation.
- adding-another-system 11: Practice links match main narrative. First-reading judgment: coherent substantive explanation; no prose/comprehension blocker; source verification pending.

## Verification

Checked primary references after completing the first reading: PostgreSQL 18 text-search controls and generated-column arrangement, numeric conversion, and exported logical-decoding snapshots; MySQL 8.4 isolation and clustered/secondary indexes; SQLite isolation and per-connection foreign-key enforcement; Microsoft’s SQL Server isolation settings and 2025 edition matrix; and the original transactional-outbox pattern explanation. The product comparison describes named versions rather than claiming a universal latest release. The snapshot/stream-boundary claim is directly supported by PostgreSQL’s exported-snapshot documentation.

Primary references checked independently:

- [PostgreSQL text-search controls](https://www.postgresql.org/docs/18/textsearch-controls.html) and [table arrangement](https://www.postgresql.org/docs/18/textsearch-tables.html).
- [PostgreSQL numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html) and [logical-decoding snapshots](https://www.postgresql.org/docs/18/logicaldecoding-explanation.html).
- [MySQL isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html) and [index organisation](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html).
- [SQLite isolation](https://www.sqlite.org/isolation.html) and [foreign-key enforcement](https://www.sqlite.org/foreignkeys.html).
- [SQL Server isolation](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver17) and [2025 editions](https://learn.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-2025?view=sql-server-ver17).
- [Transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html).

## Finding and repair

The search lesson’s final typo variation originally used “blu mug” after product 1 had already been renamed to “Blue ceramic cup”. At that point even the correctly spelled “blue mug” returns nothing. The result therefore could not isolate the effect of the spelling error. Changed the variation to “blu cup”, directly paired with the successful “blue cup” query, and explained that only blue’s spelling changes. Updated the verifier to execute that variation. No main-article prose repair was needed.

Independently inspected the verification script and reran all 13 literal lesson SQL steps through the raw simple-query protocol, including expected SQLSTATE 23514, the three variations and all resets. All passed; observed.json contains the renewed execution record. The copy exercise’s older event preserves version 2/inactive; a deliberately newer restoration changes it to version 3/active. These executions establish PostgreSQL behavior and explicit model states, not behavior in other products or independent services.

## Rendered review

Inspected readable crops from the supplied 390px and 1280px light/dark screenshots for both pages, including headers, prose, code and the source/copy timeline table. Type and links remain legible; the four-column timeline fits the phone width with wrapping, and code stays within its bounded scroll region. The supplied rendered-checks.json records no page overflow, browser errors or failed images at all eight combinations. The floating Astro development toolbar appears in the captures; this is the development environment rather than publication content. I did not independently operate sandbox browser controls in this review; the coordinator’s integrated browser checks cover those.

## Final judgment

Writing and comprehension: ready. Product selection grows from distinct application arrangements through observable contracts and operational rehearsals; the ending returns to the opening scenarios. The additional-system article carries one concrete catalogue/search example through native matching, copy freshness, delivery, ordering and rebuild. Its distinction between removing stale positives and finding missing matches, and between complete-state events and increments, prevents common misunderstandings.

Technical and learning quality: ready after the typo-variation repair and successful execution. The versioned-copy example retains withdrawal information and does not imply an outbox creates a distributed transaction. The product comparison does not turn its one PostgreSQL exercise into cross-product evidence. No unresolved blocker from this independent review. Publication state and the final integrated build remain the coordinator’s responsibility.
