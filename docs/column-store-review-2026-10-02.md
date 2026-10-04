# Column-store essay review — 2 October 2026

Three independent reviewers assessed the current local article. One received only the page URL and intended audience, with no conversation history, repository files, writing guidance, or suggested conclusions. That blind reader read the whole rendered page and tried all four experiments. A visual reviewer examined all three illustrations, the first experiment, and source. An interaction reviewer exercised all four tools, checked the accessibility tree, read the implementation, and ran the four model tests.

The article has enough interactive material. The most useful additions are a query and its result, continuity between the existing models, and small diagrams that show the mechanisms currently left abstract. All three reviewers independently identified the missing query. All three also found that the concrete page-view record disappears too quickly into anonymous letters and blocks.

## First: correct the replication example

The paragraph about ReplacingMergeTree explains that old and corrected versions can coexist. Immediately afterwards, the replica experiment uses those versions but reports that a read from B returns v1 as soon as copying completes. This makes replication appear to resolve versions as well as copy them.

Both technical reviewers flagged this; the coordinating reviewer confirmed the adjacent prose and implementation. ClickHouse documents replacement as a separate process based on sorting-key identity, with background merges not guaranteeing that duplicates have disappeared. See the [ReplacingMergeTree documentation](https://clickhouse.com/docs/reference/engines/table-engines/mergetree-family/replacingmergetree).

Use a newly inserted page view for the durability experiment: the record is either present or absent. That teaches the same acknowledgement tradeoff without introducing version resolution. Alternatively, explicitly define the query-time reconciliation assumed by the displayed read.

Locations: `src/pages/explore/column-stores.astro:88–99`; `src/components/explainers/column-lab.ts:94–98`.

## Show the report and keep its records with us

The opening promises country counts for each shop, but we never see that report. A short SQL example and a small result table would give the storage experiments a visible purpose. Use the same underlying records and show that switching layouts changes the work, while preserving the answer. In the next section, add the shop-B filter to that query.

The blue-mug visit is already a good concrete example. Highlight that record in both layouts, with its actual values available without hovering. When sorting by shop, show its country and other fields moving with it. The blind reader specifically wondered whether sorting the shop column also reorders the corresponding values in other columns.

The transition also changes from pages of field values to blocks of records, and from 16 records to 32. Each model is understandable alone; their relationship needs an explicit explanation. A small aligned view of the columns in one sorted block could show how selecting fields and skipping record ranges combine.

Locations: `src/pages/explore/column-stores.astro:41–65`; `src/components/explainers/column-lab.ts:71–82`.

## Give the index and merge a visible mechanism

The index label is now clear, but the card is blank. The pruning model uses minimum and maximum values, while the following prose introduces a sparse primary index. The article acknowledges that distinction without showing how the actual index works. A small diagram of sorted keys, a few granule starts, and a traced lookup would help more than another large illustration.

Similarly, the merge experiment makes rewrite costs visible, but its anonymous bars do not show sorted inputs becoming a sorted output. A small sequence such as `A, C` and `B, D` becoming `A, B, C, D` would explain what the operation does before the existing tool explores its cost.

Compression and batch processing receive only one paragraph. A compact repeated-values encoding example is a worthwhile later addition if this is to become a deeper treatment of column-store internals. It is an extension, rather than a repair needed to understand the current models.

Locations: `src/pages/explore/column-stores.astro:54,65,74–86`.

## Let the writing and experiments take turns

The blind reader understood the main lessons and found the shop example coherent. Their writing criticism was repetition: the prose supplies the complete numerical outcome, the instruction asks the reader to reproduce it, and the tool explains it again.

Keep the setup before each experiment and put more of the numerical explanation afterwards. The prose can still stand alone; readers who skip the controls should find a complete explanation below them. There is room to invite a prediction before revealing the answer without turning the article into a compulsory exercise.

The replication section felt like a second topic to the blind reader. Explain why the article is now following this column store into a particular deployment, and distinguish the general storage ideas from ClickHouse-specific behavior at that transition. Also avoid calling replicas A and B after using those names for shops.

Locations: `src/pages/explore/column-stores.astro:49–53,61–65,93–101`.

## Improve feedback and legibility

- **Announce outcomes.** The explanation is a live region, but the changing statistics are not. Several interactions leave the explanation unchanged, so a screen-reader user does not receive the result. Announce a concise outcome on completion or meaningful control changes and provide an accessible alternative to the repeated field-initial grid. This finding comes from source and accessibility-tree inspection, not a VoiceOver session. See `ColumnLab.astro:11–13` and `column-lab.ts:71–74`.
- **Explain resets.** Changing replica delay or acknowledgement policy resets time and restores the failed replica. Make it clear that this starts a new scenario. See `column-lab.ts:34–35`.
- **Keep skipped blocks readable.** The blind reader struggled to read their faded ranges, although those ranges explain why skipping is safe.
- **Tighten the models vertically.** At the blind reader's viewport, the scan's controls and results did not fit together on screen. The merge model left substantial empty space above tiny single-event parts. These observations need responsive checks before choosing a layout adjustment.

## Preserve what works

The opening picture now depicts what the prose is discussing. The Sweden/blue-mug record makes the fields concrete. The index and data-part labels were clear in the desktop review. The separate/shared-storage picture communicates one useful distinction, with a caption that addresses the misleading possibility of reading its tray as a single disk.

The scan's reduction from 12 pages to four is visible and satisfying. Four one-event batches producing eight rewritten events exposes a cost readers might otherwise miss. The distinction that waiting does not copy data faster was especially effective for the blind reader. The final dashboard-versus-checkout example provides a useful decision to end on.

## Verification and limits

The interaction reviewer verified 12 versus four scan pages, eight versus two pruning blocks, conservation of records through merges, and the replica outcomes before and after copying. Keyboard Home/End worked on the scan slider, and Run/Pause operated. All four existing model tests passed. No arithmetic failure appeared in those scenarios.

This was a desktop review, not a complete mobile or assistive-technology audit. The blind reviewer used only the rendered article and controls. The other reviewers used source as well. The article and implementation were not changed during review.

## Implementation follow-up

The next revision addresses these findings. Both reading models now use one set of 16 page views. The query/result examples derive their counts from that dataset; the blue-mug record remains outlined in both layouts and the sorting model. Short diagrams explain dictionary encoding, sparse-index entries and their boundary candidates, and merging sorted inputs. The replica experiment now follows a new event, uses distinct replica names, and explains resets. Numerical explanations follow the controls; text descriptions and live outcome announcements support the models.

Six model tests pass, including record reconstruction and report preservation across layouts and sorting. The 42-page build passes. Browser checks covered scan keyboard controls, field changes, sorting, merging, and replica failure before and after copying. SQL and model layouts were inspected at desktop, 390px, and 320px widths; the narrow-screen SQL overflow was repaired. Source and tests received a second technical review; an editorial follow-up corrected an index caption. VoiceOver itself was not exercised. The original findings and line references above describe the pre-change revision.
