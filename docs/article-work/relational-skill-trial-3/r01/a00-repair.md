# a00 · round 1 repair record

Assignment start: **2026-10-21 19:34:44 UTC**, the first recorded clock reading. End, duration and freeze hashes are recorded at the foot after completing this record.

Fresh reviser `r01_revise_a00`; coordinator owns independent review and delivery. Applied `staycurrent-revise`, `staycurrent-write`, `staycurrent-figures` and `staycurrent-continuity` at the supplied skill version `005ab6f`. No agents spawned; no commit or push.

## Inputs and isolation

Before opening the findings, read the complete current trial-3 a00 source, all four a00 component/model/verifier files, root heading briefs and immediate-child context from the coverage tree and registry, the canonical example record, a00-writing.md and both native evidence records including their commands and results. Read all three fixed reference article sources in full, including their figures, captions and listings. Read repository/site direction. The live-change handoff was checked against the complete a06 article; the other unchanged handoffs were checked against the authorised child context and relevant article passages. The historical paths named in the canonical example record were not followed.

Then read r01/decisions.md and the teaching, editorial and visual reports. No live a00/a03, earlier trial page/component/record/review, trial-3 run record or trial-3 results informed this repair. Did not open current trial-3 a03. The coordinator supplied the preview and manages integration checks.

## Findings and repairs

| Accepted finding | Repair | Check |
| --- | --- | --- |
| teaching-1 · medium | Both displayed transaction inserts now name their columns explicitly. The order maps its date to `placed_at`; the line maps its five values to `order_id`, `line_no`, `product_id`, `quantity` and `unit_price`. The short introduction explains the column/value mapping and `RETURNING stock` before the listing. | Native verifier runs this exact `reserve` listing; result remains order 103/Mina/29.00 and stocks P3=10, P7=0, P9=4. Rendered listing inspected at phone and desktop widths. |
| editorial-1 · medium | Replaced Figure 1's final defensive qualification with “Dates are omitted.” The caption remains about displayed facts, references and omitted dates; reservation meaning first arrives in its teaching section. | Read complete caption against the actual tables and canonical rows; phone/dark and light checks. |
| editorial-3 · low, a00 part | The live-change link now says it “shows how to stage those changes and plan for interruptions”. | Checked against a06's compatibility stages and interruption/recovery sections. |
| editorial-4 · low | The task-route opening first says what the walkthrough builds. The shortlist opening first explains that a suitable data engine can fail sharing or recovery requirements, then introduces the shop's deployment. | Reread both sections with their existing lists; their scope and conclusions are unchanged. |
| visual-2 · low | Added phone-width hints before the `order_items` and `payments` scroll regions: “Scroll sideways to see all columns →”. Hints sit outside the scrolling content so scrolling does not carry them away. Regions have names and keyboard focus. | At375px, order_items is 536 px inside 315 px; payments 363 px inside 315 px. Both show the cue in both themes. Arrow keys move the focused region, exposing hidden fields; document remains 375 px. |

The argument and section order remain facts → query shape → competing change → physical work → request outcome → recovery → placement → shortlist. No section was rebuilt. No schema, stored example row, race state, protection or outcome changed. `example.mjs` and Race.astro are untouched.

## Every new or restructured passage for the next placement check

1. **Find your next question, opening paragraph:** replaced its reading instruction with the walkthrough's concrete benefit before the direct task entrances.
2. **Reserve the last mug, immediately before the complete transaction:** reshaped the existing one-paragraph introduction as two short paragraphs. The first explains the listing's fixed example and explicit `INSERT`/`VALUES` mapping plus `RETURNING stock`; the second preserves required application branches, all-writer guarded subtraction and both result checks. These sentences belong before the first complete insert listing, where the reader must interpret its values. They do not add another protocol.
3. **The `reserve` listing in a00/model.mjs:** only its two insert column lists and formatting are new.
4. **Complete the application request, live-change paragraph:** only the linked-reading sentence's verb phrase changed.
5. **Choose a system you can test, opening paragraph:** only the first sentence changed; the stated shop and three candidates follow it unchanged.
6. **Figure 1 caption:** only its final sentence changed. **Figure 1 controls/labels:** two new phone-only scrolling hints and named, keyboard-focusable regions.
7. **Sources, transactions item:** added the PostgreSQL INSERT and Returning Data documentation for the listing explanation.

No prose outside those passages was restructured. The verifier accepts an optional third command-line argument for its evidence directory, preserving its original default; this keeps this round's evidence within the assigned write scope. It changes no database setup, assertion or cleanup path.

## Technical evidence

Command actually run:

```sh
node src/components/relational-trial-3/a00/verify.mjs 56310 docs/article-work/relational-skill-trial-3/r01/a00-repair-evidence
```

**PASS, 22 checks; serverStopped=true.** Native run: 2026-10-21T19:37:29.813Z to 19:37:31.548Z, 1.735 seconds. PostgreSQL 18.6 (Homebrew), aarch64-apple-darwin25.6.0, Apple clang 21.0.0, 64-bit. Read Committed, fsync on, synchronous_commit on and full_page_writes on. This invocation created its own new cluster and database a00 on unique port 56310; no retry or reused database. It stopped both sessions and the server, then removed `/tmp/staycurrent-t3-a00-FxaGUU`; the directory's absence was checked. No other server was started by this worker.

The full native evidence is `a00-repair-evidence/native-56310.json`. Its command label records the verifier and port; the actual invocation above additionally specifies the evidence destination. It contains every executed input/output and assertion. The complete revised listing still passes. Existing adversarial cases still expose doubled join totals, two accepted mug orders after stale assignments, conditional refusal after a lock wait, successful rollback on insufficient tea, and the missing-rollback counterexample. The repair changes column visibility, not a protection claim, so no additional database case was needed.

Opened the PostgreSQL18 primary documentation for [INSERT](https://www.postgresql.org/docs/18/sql-insert.html) and [Returning Data from Modified Rows](https://www.postgresql.org/docs/18/dml-returning.html). Column/value association is left-to-right in the explicit list; UPDATE's default returned values are the changed row's new contents. Those sources are now included in the article. No production workload, crash, replica, restore or other engine was run.

Both `pnpm build` invocations completed successfully. The last finished at 19:38:41 UTC, built 171 pages, and passed all 13 site-check rules across 147 checked pages; its full output is `a00-repair-build.txt`. Existing PGlite bundling warnings remain. The coordinator later reported another worker's concurrent build failure and requested no further worker builds. None remains running; the coordinator will run the sole final integration build after both repairs freeze. No new unit tests were added for this reversible wording/layout repair.

## Rendered checks and limits

Used the coordinator's preview at `http://127.0.0.1:4333/review/relational-trial-3/`. Browser tabs were created with the options argument omitted, as instructed. This is a hidden-pane check; no visible-window animation judgement is claimed. The screenshot state was compared with the current rendered DOM.

- Checked the changed Figure 1 and transaction at 375 px and 1280 px, light and dark. The table headings stay intact inside local scroll regions, complete column identities remain available, and document width equals viewport width. New cue text contrast is 6.05:1 in light and 6.15:1 in dark, calculated from rendered text and enclosing surface colours.
- Figure 1 still shows Mina's pending 103, both order lines and post-order stock. Its caption correctly distinguishes displayed 103 rows from older payments. The two scroll hints remain outside the moving content.
- Reread the complete article source after the final edits, including contents, all captions, static tables, code disclosures and the unchanged Race.astro/model step text. Compared its concrete explanations and restrained figure choices with the three references. The two pre-listing paragraphs now explain one thing each rather than attaching an extra qualification to the original paragraph.
- Both race options reached their final Replay states through automatic playback after authoring settled. An earlier playback was reset during the development server's refresh; it was repeated. Read/calcul­ate/write ends with 103 and 104 accepted, stock 0; conditional subtraction ends with 103 only, stock 0. Both also reached those endpoints by keyboard, with focus retained on Next and `aria-disabled=true`. Back, Reset and option changes were exercised.
- Playback exposed Pause and the initial 3500 ms hold transition; checked timing from the rendered timer rather than inferring smoothness from the hidden screenshot. No race timing code changed.
- Saved phone light/dark Figure 1 views, phone and desktop/dark protocol views, race keyboard outcomes and responsive DOM measurements under this round's `a00-repair-*` paths. Cleared the viewport override and closed the temporary tab. Coordinator previews were reused and left running.

## Continuity term ledger

Read in article order, including navigation, captions, listing introductions and every race option/step. The explanatory sentence is at first substantive use unless the table explicitly notes an immediate follow-up. No earlier article is required by this root. Ordinary task labels such as “protected changes” carry their plain-language sense.

| Term | First use and explanation |
| --- | --- |
| Relational database; tables, rows, columns | Opening: “stores related facts in tables: rows of values under named columns.” First teaching paragraph then states one kind of fact, each instance and its named values. |
| Order line | Give each fact a home: “one numbered line within an order, which we will call an order line.” Stored table remains `order_items`. |
| Relation | “The relational model calls a table-shaped collection of facts a relation.” |
| Primary key | “the column or columns chosen to identify each row uniquely, with no missing key value.” |
| Composite key | Order ID plus line number: “made of several columns.” |
| Foreign key | “requires a reference to match an existing key.” |
| PK/FK | Figure 1 legend before its tables: “PK = primary key; FK = foreign key.” |
| Current/agreed price | Paragraph after Figure 1: current product offer differs from the line's preserved £20 agreement. |
| Schema; constraint | “definition of tables, their values and their rules”; “a rule the database checks when accepting a change.” |
| integer; NOT NULL; CHECK | Column fragment followed immediately by “chooses whole numbers”, “requires a value” and “rejects a value failing its condition.” |
| SQL; declarative; engine | Query section: language for asking/changing rows; “describe the result”; “the software implementing the database”. |
| Join; SELECT; FROM; WHERE | Matching rows under a condition; output values, input table and filtering condition are explained before the first query. |
| SUM; GROUP BY | Before first query: adds line values; combines matched rows into one result per order/customer. |
| Table labels o/c/i | Immediately following first query: “label the input tables.” |
| Inner join | Repair paragraph: “keeps only matching rows”. |
| Reservation | Reserve section: “Accepting the pending order reserves its items now; taking payment happens later.” Figure 1 no longer introduces it. |
| Transaction; BEGIN; COMMIT; ROLLBACK; atomicity | Kept/discarded as a unit; start, ask to keep, discard; keep all changes or none. |
| Isolation; Read Committed | Overlapping transactions' permitted seeing/affecting; ordinary query reads changes committed before query start. |
| Conditional subtraction | Prose before Figure 3: “checks availability as it subtracts”; subsequent paragraph gives subtract-only-if-available and wait/recheck. |
| Committed/uncommitted | Inherits kept/not-yet-kept transaction meaning; Figure 3 explicitly distinguishes committed stock from pending buyer work. |
| INSERT; VALUES | New first sentence before complete listing: “names the columns to fill before giving their VALUES.” |
| RETURNING stock | New first sentence before listing: “reports the new stock for each row the update changes.” |
| Scan; index | “examines table rows to find matches”; “additional structure that helps locate rows by selected values.” |
| Pages; cache | “blocks read into memory together”; holds copies to avoid loading again. |
| Write-ahead log/WAL; flush; crash recovery | Figure 4 defines reconstructable history, storage confirmation and replay; the following durability paragraph states the failure boundary. |
| Durability | “an acknowledged commit survives the failures covered by that configuration.” |
| Execution plan; EXPLAIN; EXPLAIN ANALYZE | Operations answering the statement; shows selected operations; also runs/reports observations. |
| Timeout | Application opening: “the end of a wait, not the absence of a change.” |
| Stable attempt identity | Assigned before sending; repeated 103 uses the same customer/items and outcome, not another order. |
| External fulfilment; worker; connections | Parcel request beyond rollback; saved work performed separately; “channels carrying application–database exchanges”. |
| Replica/failover | Recovery choices: maintained copy serving instead of failed writer. |
| Restore; point-in-time recovery; base backup | Reconstruct earlier state; recoverable starting copy plus saved log history. |
| Access control; managed service | Limits who reads/changes; specified operating duties transferred while data/recovery ownership remains. |
| Replication | Placement section: “maintains copies of data”; timing determines freshness. Replica was already explained. |
| Sharding; write owner | “assigns different subsets of data to different write owners”; contrasted with copies of the same writer's facts. |
| Distributed transaction/system | Coordinates one all-or-nothing change across owners; product supplies some coordination. |
| Embedded; conventional server | Shortlist: engine in application process/local files; shared service through connections. |
| Column store; document/object/search stores | Concluding workload comparison gives their units: columns for broad calculations, independent documents, photographs and relevance-ranked discovery. |

One-name/example pass: Mina Shah remains customer 1/order 103; Tariq Aziz remains customer 2 and losing 104; Edda Berg remains customer 3. P3/P7/P9, quantities, prices, line numbers and payments 501–503 match the canonical record. Figure 1's accepted 103 agrees with the query and protected race. The race explicitly rewinds before 103; unprotected 104 is accepted only in the deliberately broken branch. Recovery explicitly uses the canonical separate 10:10 deletion/10:15 order/10:09 restore timeline. No extension to the shared example is proposed, and no customer becomes another role.

Source word count at completion: **3,796**, versus the writer's 3,752, a net 44 source words. This includes markup, sources and controls as measured by `wc -w`, consistent with the trial metric.


## Freeze

Assignment end and prose/component freeze: **2026-10-21 19:43:15 UTC**.
Duration from first recorded clock reading: **8 minutes 31 seconds (511 seconds)**.

All checks and the record above are complete. The following article/component files are now frozen; no further edits will be made by this reviser. The coordinator may record or commit this snapshot.

| File | SHA-256 |
| --- | --- |
| `src/articles/relational-trial-3/a00.astro` | `8d245fdc583ccc323540e48e4254169e47908eb8ff90a45e757f94425eee80a5` |
| `src/components/relational-trial-3/a00/Race.astro` | `ae82741a7bd942cde1378636bb5728e58d1ec35ddd84fbc2a2973ee80e6a76d5` |
| `src/components/relational-trial-3/a00/Shop.astro` | `19dc44553a8de79dae87dbbb590a65332e111737b6dab8cd24dd15e952c3a39b` |
| `src/components/relational-trial-3/a00/model.mjs` | `380ff91472f8d364a16b0489aaae7f82bb8e0fed43e65179da3aab3d49920cda` |
| `src/components/relational-trial-3/a00/verify.mjs` | `5e79d43bfebeb243178078dba1e90170fc352a1b0998d29faa59e9f0bd741a1a` |
