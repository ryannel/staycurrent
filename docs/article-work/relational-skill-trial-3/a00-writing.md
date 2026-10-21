# a00 · initial writing record

Assignment start: **2026-10-21 19:08:34 UTC** (first recorded clock reading).
Assignment end: **2026-10-21 19:22:40 UTC**.
Duration: **14 minutes 6 seconds**.
Writer: fresh `write_a00` worker. Orchestrator owns independent review. No reviewer was spawned. No commit or push was made by this worker.

## Inputs and isolation

Applied the committed write, figures and continuity skills at `005ab6f`, as instructed. Read README, current site direction, trial-3 brief, the root's complete heading briefs in `docs/coverage/relational-2026-10-19.yaml`, registry and its `relational-next.ts` adapter, and the canonical example record. Read all three fixed reference articles, including their listings and figure captions/choices. Read the completed a01, a02 and a04–a08 child articles; read shared SQL rendering, review styling and the complete shared stepper. Did not open live a00 or a03, earlier trial articles/components/records, or earlier review reports. Historical references inside the authorised example record were not followed. Did not read trial-3 a03.

The root is new prose written from the plan. Its working sequence is facts → result shape → competing order → physical work → request outcome → recovery → placement → shortlist. Early task entrances support returning readers. Eight existing immediate children are linked in context and in the reading list. The regenerated a03 link uses the trial-3 route, without assuming its headings.

## Files

- `src/articles/relational-trial-3/a00.astro`
- `src/components/relational-trial-3/a00/{Shop.astro,Race.astro,model.mjs,verify.mjs}`
- `src/components/relational-trial-3/example.mjs` (coordinator explicitly extended this assignment to own the common rows)
- This record and `a00-evidence/native-{56130,56131}.json`.

`example.mjs` exports the canonical customer rows, product rows and shop order identities. Both article models import the customers; a03's writer confirmed that shape suits its classes extension. All a00 figures use the same model, including joined rows and race outcomes.

## Teaching choices and model boundaries

1. The connected schema is static: the reader needs the actual column headings, keys, rows and relationship multiplicities. It shows order 103 after acceptance, product stock after that order, all three customers, and earlier payments. It explicitly omits earlier order and line rows. The five relations remain distinct tables, with local horizontal scrolling where narrow widths require it.
2. The join example is static because four rows expose the multiplication immediately. Order 101 has two lines and two payments. Its incorrect totals are both £79.00, leaving a deceptively correct zero balance; independently calculated totals are each £39.50. The counterexample with one payment removed makes the wrong balance visible too.
3. The stepped final-mug figure makes concurrency a cause the reader can change. Both options have transactions. A stale calculated assignment accepts two orders from one mug; conditional subtraction and required refusal accepts only 103. It uses the shared stepper; option changes preserve the step. Committed stock is distinguished from a buyer's uncommitted work; changing values are underlined. The full adjacent protocol includes both products, order and lines, explicit result checks and rollback branches. It is an outline with application branches identified as such, not a claim that SQL comments execute them.
4. The physical path is an illustrative ordered figure, not a measured engine trace. Page size and the write-ahead/durable-acknowledgement boundary come from PostgreSQL documentation. No physical-performance measurements are asserted.

The lost-reply, deletion/restore, replica freshness and sharding sections are explanatory scenarios, not observed fault injection. The shortlist is an illustrative decision with disqualifying tests still to obtain. No production workload, crash, replica, restore, distributed engine or alternative engine was exercised.

## Native verification

Run command: `node src/components/relational-trial-3/a00/verify.mjs 56130`.
Result: failed during initdb's shared-memory creation (`shmget ... Operation not permitted`). No server remained; temporary directory removed. The full command/output is retained in `native-56130.json`.

Fresh run command, using approved sandbox escalation: `node src/components/relational-trial-3/a00/verify.mjs 56131`.
Result: **PASS, 22 checks, serverStopped=true**.
Server: **PostgreSQL 18.6 (Homebrew), aarch64-apple-darwin25.6.0, Apple clang 21.0.0, 64-bit**. Node reported 24.16.0. Each invocation owns a new `mkdtemp` cluster and database `a00`; no pre-existing server/database is used. Socket-only listener and unique assigned port; local trust is confined to the throwaway private directory. The script stops its server in `finally`, including failed runs, and removes the cluster only after successful shutdown. Version, settings, every actual command/input/output, and all assertions are in `native-56131.json`.

Observed settings: Read Committed, fsync on, synchronous_commit on, full_page_writes on. Checks include:

- Zero/missing quantity, duplicate order-line identity and missing order reference are refused.
- The complete order-103 success listing gives P3=10, P7=0, P9=4 and `103|Mina Shah|29.00`.
- Wrong join returns `79.00|79.00`; repaired join returns `39.50|39.50`. Removing payment 502 yields wrong `39.50|60.00` versus repaired `39.50|30.00`.
- Two persistent psql clients both read stock 1. The second stale assignment is held behind the first until an independent observer sees a PostgreSQL lock wait. After both commits, stock is 0 with **two** new mug lines. This is the failing counterexample to transaction wrapping and non-negative stock being sufficient.
- The same controlled overlap with conditional subtraction makes Tariq wait, then return no row after Mina commits. Rollback leaves one new order and stock 0.
- Lowering tea stock to 1 makes Mina's second guarded update return no row after the mug was claimed. Rollback restores the mug and leaves no order103. Deliberately omitting that rollback removes the mug without an order: a failing counterexample to proceeding after an unsuccessful result check.

## Primary-source checks

Opened the PostgreSQL 18 manuals for constraints, table expressions, transaction isolation, transactions, page layout, EXPLAIN, write-ahead logging, synchronous commit settings, continuous archiving and standby servers; also SQLite's appropriate-uses and WAL pages. The article links these primary sources beside its further reading. Their roles are schema acceptance, join multiplicity, conditional-update rechecking, atomicity, physical-page/log behaviour, historical recovery, copy freshness and SQLite's same-host WAL requirement. Native results establish only the fixture's cases, not universal throughput, fault survival or safe application replay.

## Rendered checks

Preview supplied by coordinator at `http://127.0.0.1:4333/review/relational-trial-3/`. This writer used cua_repl with a hidden in-app-browser tab at 1280×720. The subagent cannot create a visible pane; the coordinator also reports that visibility returns false because this chat is not foreground. Screenshots/DOM are therefore hidden-pane checks, and real-time animation viewing is not claimed.

Checked both race endpoints, option change at the last step, Back, Reset, keyboard Enter stepping and focus retention on Next at the terminal step (`aria-disabled=true`, focused element text `Next`). Stale endpoint: `103 and 104 — oversold`, stock0. Guarded endpoint: `103 only`, stock0, Tariq refused/rolled back. Play showed Pause and a measured inline hold transition of `width 3500ms linear` for the initial state, consistent with the shared timer's floor; HMR during authoring reset later playback, so uninterrupted visible playback of the whole sequence is not claimed. Counter and changing regions are marked data-live; shared stepper handles pause and reduced-motion hold-bar behaviour.

The writer's DOM check reported viewport/page width 1280/1280. Coordinator final QA reports **375px, light and dark, no document overflow; local table scroll containers preserve complete headings; both race endpoints reached by keyboard and focus retained on Next**. No additional defect was returned. Full visual screenshots are held by the coordinator.

`pnpm build` initially compiled but failed the no-heading-in-figure rule on two figure titles. Replaced their h3 elements with styled title paragraphs. The second `pnpm build` passed all 13 site-check rules (147 checked pages). Existing PGlite bundling warnings were emitted. Subsequent changes are small continuity wording only; coordinator owns the final integration build.

Length at delivery: **3,752 source words (`wc -w`)**. Hidden browser article text: **4,362 words**, including the wrapper, generated collection reading list and rendered figure/code text; hidden closed disclosures are excluded by innerText. Use source words for the trial's comparable metric as directed.

## Continuity term ledger

Read article, contents, table headings, captions, options and step text in order. The opening introduces related facts and tabular rows/columns; the first teaching section then makes their grain precise. Navigation labels use plain language before the SQL and transaction definitions. No prior article is required to understand a term.

| Term | First use / explanation at that point |
| --- | --- |
| Relational database | Opening: stores related facts in tables, answers questions, applies specified rules. |
| Table, row, column | Opening: “tables: rows of values under named columns”; Give each fact a home specifies one kind of fact, its instances and named values. |
| Order line | Give each fact a home: one numbered line within an order; stored table remains order_items. |
| Relation | “The relational model calls a table-shaped collection of facts a relation.” |
| Primary key | “column or columns chosen to identify each row uniquely, with no missing key value.” |
| Composite key | Order ID plus line number, “made of several columns.” |
| Foreign key | “requires a reference to match an existing key.” |
| PK / FK | Figure1 legend before headings: primary key / foreign key. |
| Current price / agreed price | Paragraph after Figure1 distinguishes tomorrow's offer from the line agreement. |
| Schema | “definition of tables, their values and their rules.” |
| Constraint | “a rule the database checks when accepting a change.” |
| integer / NOT NULL / CHECK | Introduced through the column definition, immediately read as whole, present, positive. |
| SQL | First main-query paragraph: language to ask for and change rows. Removed the earlier “SQL results” mention and navigation label. |
| Declarative | Same sentence: describe the result; engine chooses how. |
| Engine | Same sentence: software implementing the database. |
| SELECT / FROM / WHERE | Before listing: output values, input table, filtering condition. |
| Join | “combines rows whose values satisfy a condition.” |
| SUM / GROUP BY | Before query: add line values / combine matched rows per order and customer name. |
| Input table labels o/c/i | Immediately after first listing; table names are already present in its FROM/JOIN clauses. |
| Inner join | Repair paragraph: keeps only matching rows. |
| Reservation | Rewind paragraph: accepting pending order takes stock now, payment later; cancellation/release protocol is outside the history. |
| Transaction | “groups database work into a change that is kept or discarded as a unit.” |
| BEGIN / COMMIT / ROLLBACK | Same paragraph: start, ask to keep, discard. |
| Atomicity | Same paragraph: keep all database changes or none. |
| Isolation | “specifies how overlapping transactions may see and affect one another.” |
| Read Committed | Default PostgreSQL setting; ordinary query reads previously committed changes at query start. |
| Conditional subtraction | Figure option follows prose “checks availability as it subtracts”; subsequent paragraph explains condition, waiting and recheck. |
| Committed/uncommitted | Kept versus not yet kept under the transaction definition; race explicitly separates committed table from buyer's pending work. |
| Scan | “examines table rows to find matches.” |
| Index | “additional structure that helps locate rows by selected values.” Removed premature earlier index mention. |
| Page | “blocks read into memory together.” |
| Cache | Same paragraph: holds copies of pages to avoid loading again. |
| Write-ahead log / WAL | Figure4: history from which engine can reconstruct changes; acronym introduced with full name. |
| Flush | Figure4 uses storage confirmation as its role; next durability paragraph states storage/settings limit. |
| Crash recovery | Figure4 says it can replay stored log; later recovery comparison gives its failure boundary. |
| Durability | “acknowledged commit survives the failures covered by that configuration.” |
| Execution plan / EXPLAIN / EXPLAIN ANALYZE | Physical-work paragraph: chosen operations / show them / also run and report observations. |
| Timeout | First application paragraph: end of a wait, not proof of no change. |
| Stable attempt identity | Following paragraph: assigned before sending; reuse with same customer and items to resolve the same result. |
| External fulfilment / worker | Parcel-service action cannot be recalled by rollback; saved work is performed separately with its own recovery. |
| Connection | Application link sentence: channels carrying application–database exchanges. Removed earlier unintroduced connection-wait wording. |
| Replica / failover | Recovery comparison: maintained copy, made to serve instead of failed writer. |
| Restore / point-in-time recovery / base backup | Recovery comparison: reconstruct earlier state from recoverable starting copy and saved log history. |
| Access control | Operating paragraph: limits who can read or change data. |
| Managed service | Same paragraph: takes specified operating duties; data/recovery acceptance retains a shop owner. |
| Replication | Distribution section: maintains copies, with timing determining freshness. Replica was defined earlier. |
| Sharding / write owner | Distribution: subsets assigned to different owners; contrasted with copying the same writer's facts. |
| Distributed transaction | Same paragraph: coordinates an all-or-nothing change across owners. |
| Repairing partly completed work | Plain wording replaces the initially unintroduced compensation term; no repair protocol is prescribed. |
| Embedded | Shortlist first card: engine inside application process, local files. |
| Conventional server | Second card: shared service reached over connections. |
| Distributed relational service | Prior distribution paragraph: database supplies coordination across machines; shortlist inherits it. |
| Column store | Neighbouring-workload paragraph: column values stored together for broad scans/calculations. |
| Document/object/search stores | Neighbouring-workload paragraph names their task units: independent documents, photographs, relevance ranking; no engine-specific guarantee is assumed. |

One-name pass: Mina Shah/customer1/order103; Tariq Aziz/customer2/losing104; Edda Berg/customer3. No customer is an instructor. Product P3/P7/P9 and prices, line numbers, payment identities and dates match the canonical record. Every figure's accepted103 is the same order. The race explicitly rewinds before103 and the recovery incident is a separate stated timeline. The unprotected104 is accepted only in the intentionally broken branch; protected104 never appears as accepted later. Connection and query wording removed premature technical uses; PK/FK moved into a pre-table legend.

## Proposed tree/example changes and inherited discrepancies

- Root plan names a separate distribution child, but the registry and finished immediate children do not contain it. This draft gives the compact root explanation and links existing operational replica/partition discussion plus choosing. Propose completing the planned distribution branch rather than inventing a dead route here.
- Registry a00 headings reflect an earlier breakdown. Propose aligning its headings/anchors with this draft's nine task/teaching sections, retaining the existing eight-child list until the distribution child exists.
- Canonical core does not explicitly name currency; this root declares pound amounts for its £29.00 order and reports. Propose recording GBP as this shop's single-currency assumption if it is not already implied elsewhere.
- Existing children disagree with the canonical record: a01 uses tenant-scoped pottery/glazing sessions and Mina's changed surname; a02 uses different January orders, order_lines and payment IDs; a05 uses synthetic customer42 data; a06's address/move examples collide with existing order102; a07 uses the wrong deletion time/later order106; a08 uses a separate inventory/reservations schema and seven mugs. No such values were copied into this root. a02's link explicitly says its exercise resets to its own fixture. These are future continuity repairs, not changes authorised in this assignment.
