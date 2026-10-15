# Editorial and learning-design review

Reviewed 15 October 2026. Status: **repair required for two figures; prose ready as a draft from this perspective**. This assessment does not authorise publication.

## Scope and evidence

I read the browser-extracted articles in this order: Indexes, How a query runs, Storage and durability. The supplied reading JSON preserved article order but delivered each whole article at once; this was an informed editorial review, not an uncued, section-by-section first reading. All three optional-content JSON files were empty. I then inspected all seven figures as pixels, each at desktop and phone sizes across light and dark examples. The desktop storage page-read figure was checked in both themes. I used the completed baseline capture under `browser/`, before repairs, and subsequently inspected source for the parent article's execution sections and the collection's actual reading structure. I did not read another reviewer's report, edit the articles, run the SQL, or independently verify technical claims against PostgreSQL sources.

The audience is a reader who knows tables, simple SQL and the purpose of transactions, but not database internals. The review used the style and review skills, `docs/writing-style.md`, its relevant original Sam Who opening, and the site's direction. Screenshot findings remain valid even though `layout.json` reports no page overflow: element overlap can occur inside a page that fits its viewport.

## Repairs

### 1. Preserve the visible transfer between the file and buffer

**Required; Storage and durability, “One row arrives with its page.”** In `browser/storage-1280-light-figure-1.png` and its dark counterpart, the right-hand page card covers the central arrow and most of “Read page 12”; only “Read” remains visible. The caption says “The page is the unit brought into the buffer,” but the picture loses the movement that makes its two copies meaningful. This is especially unfortunate at the point where the reader is first distinguishing table storage, memory and the selected query value.

Repair the layout/style collision around the transfer element in `src/components/explainers/storage/PageRead.astro`. Give the arrow and its complete label an unobstructed central column. The phone version already displays the downward transfer clearly. Recheck pixels at 1280 in both themes and retain the phone check; an overflow test alone will not verify this repair.

### 2. Keep the phone search arrow attached to the selected leaf

**Required, lower severity; Indexes, “An ordered route to scattered rows.”** In `browser/indexes-390-light-figure-1.png`, the root's “↓ follow 42” sits directly above **Leaf page A**, whose entries are 3 and 8. The desktop figure correctly aligns this label above B. On the phone, stacking the three leaves changes the apparent route: the arrow enters a leaf that the root should exclude. The highlighted B and accompanying prose let an attentive reader recover the intended meaning, so this does not invalidate the text's explanation, but the figure makes the reader correct its routing.

At the mobile breakpoint in `src/components/explainers/indexes/IndexRoute.astro`, place the selected-route cue directly with Leaf page B, or explicitly present A and C as unvisited siblings outside that route. Preserve the useful visibility of their excluded ranges. Recheck that a reader following arrows alone goes from the root to B, then from D/E/F to the table locations. The desktop route should remain legible.

## What the articles teach successfully

**Indexes establishes its own subject before asking for internals.** The opening makes the desired work concrete: one customer's ten recent orders. “An index that finds a customer may still leave dates to check and results to sort” gives the reader a reason to care about key order. The hierarchy explanation answers the otherwise omitted question of how a sorted list helps find the first match. The distinction between searching the index and fetching table rows remains available throughout.

The regular fixture is explained before the result is used: 60 orders per customer, 15 inside the date range, and the expected ten IDs. That lets a reader distinguish correctness from changed access work. Customer-only, composite and covering indexes each answer a question the preceding arrangement left open. The paid-order extension supplies a concrete 12-candidate/10-result counterexample to “the index handles the WHERE clause.” The return to the original query before covering avoids an accidental state change.

The composite-key picture supports the important difference between local date order within a customer and a global date sequence. It remains understandable when stacked on a phone. The covering section finishes the reasoning with visibility and the observed heap-fetch change; it also gives a useful exception to a simplistic “many matching rows imply a table scan” rule. The final evaluation paragraph names actual workload dimensions rather than ending at “benchmark it.” Including write costs, constraint enforcement and live-build consequences is proportionate to the article's promise. I found no consequential missing prose step in its decision process.

**How a query runs earns its place beneath Querying your data.** The parent already teaches result meaning, a concrete receipt plan, repeated work, the possibility of alternate joins and the role of estimates. The child does not merely repeat that catalogue. Its opening immediately introduces a new investigation: three output rows produced from either 30 or 30,000 contributing lines. The new dataset is explicitly distinguished from both parent and Indexes, and the caller/session is named before executable statements.

The two-sort explanation is particularly effective. Product-ID order gathers contributions; units-sold order ranks completed totals. The reader can therefore explain why a limit cannot make the aggregate ignore later contributions. The comparison figure consolidates this after both paths have been developed; its tall phone layout adds scrolling but preserves the quantities and operation order. The merge figure preserves repeated line keys rather than suggesting duplicates disappear. These are useful supports for reasoning, not decorative restatements.

The estimates section then performs a repair the parent only motivates. The reader sees why ordinary ANALYZE cannot discover the missing relationship, adds dependency statistics, and checks the changed estimate without claiming that a new plan shape must follow. The sort-spill exercise has an explicit input change and restores its local setting. The closing paragraph names concrete next experiments. Direct entrants need grouping and join semantics; the opening states and links that prerequisite rather than silently assuming it. I would retain the parent's substantive execution introduction and the child's worked investigation.

**Storage and durability keeps distinct concepts connected to one event.** It introduces the commit reply as the question, then gives the page/buffer model needed to answer it. The update has an application handler, one connection and a successful path. The paragraph distinguishing “dirty,” “committed” and “visible” prepares the later recovery cases instead of treating those terms as synonyms.

The WAL schedule is explicitly one allowed order, and its caption usefully prevents a false universal sequence. The crash figure keeps durable log, table-file contents, application knowledge and recovered query result separate. Cases B and C make the uncertain reply consequential without turning storage into another full retry tutorial. Both the schedule and crash cases remain legible on a phone; the captions supply necessary conditions rather than repetitive disclaimers.

The later checkpoint/vacuum comparison answers a predictable confusion: each reduces future work, but they manage different state. The ending delivers a practical boundary. A successful local commit covers a particular failure model; storage loss and an accepted mistake need an independently recoverable copy. Planned backup coverage is marked as planned, and the existing documentation link supplies a real next investigation.

## Sequence and remaining limits

The three articles are not one compulsory linear lesson. How a query runs is under Querying your data; Indexes and Storage and durability are main deep dives. Their cross-links support several paths. Reading Indexes first supplies helpful physical context, but the query article gives enough of an index definition and named prerequisite to proceed without inheriting the full B-tree lesson. Storage reintroduces pages and heap storage for its own purpose. Shared terms therefore reinforce one another without requiring the reader to remember an undocumented state across datasets.

No additional subject, interactive model or prose expansion is required by this review. A B-tree update animation, deeper hash mechanics or a restore procedure could be useful later, but none is needed to complete these commissioned explanations. The two local figure repairs need rendered reinspection. Technical correctness, execution reproducibility and any findings from the independent fresh reader remain outside this review's verdict.

## Bounded visual recheck

Rechecked the completed `final-browser/` captures on 15 October 2026, without repeating the article reading or consulting other review reports. **Updated editorial readiness: ready as a draft. Both required visual repairs are resolved in the inspected captures.** The baseline findings above remain a record of the original artifacts.

- **PageRead:** At 1280 pixels in light and dark themes, the right-pointing arrow and complete “Read page 12” label now sit visibly between the two page cards. The page transfer is explicit and unobstructed. At 390 pixels in both themes, the downward arrow and label remain clear between the stacked pages. No visual regression appeared in these four captures.
- **IndexRoute:** At 390 pixels in both themes, “The root selects leaf B; leaves A and C are skipped” replaces the misplaced downward route cue. The B card is explicitly labelled “selected” and highlighted. This makes the stacked cards readable as siblings while preserving which route the search takes. At 1280 pixels in both themes, the selected arrow remains aligned with B and the table references remain visible. The local repair resolves the original false route.
- **PlanFlow:** Inspected the refined 1280-light and 390-dark figures. Reduced blank space makes the comparison easier to follow, especially between the phone's two routes. The revised introduction distinguishes “rows or prepared lookup” passed to the next stage, so the broad route's available order-ID lookup is no longer described as if every arrow were a stream of emitted rows. Counts and operations remain legible.

This bounded recheck establishes those local rendered outcomes. It does not expand the earlier technical-validation scope or replace the independent sequential reader's pending observations.
