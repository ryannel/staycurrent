# Visual review · scoped initial first reading · r03 deferred-reference SQL · batch02-v01

Inputs read: supplied [375 × 812 light-theme SQL screenshot](coordinator-visual/r03-deferral-phone-light-code.png); rendered r03 disclosure **When the reference may be checked at commit**, including its preceding reference/deletion explanation; [frozen identity manifest](v01/manifest.json); the review skill and only its visual perspective; rendered Indexes reference SQL at `#check` and the table **Where each part of the history query goes in the index key** at `#design`; coordinator-captured rendered reference images [history-query plan/work comparison](coordinator-visual/reference-indexes-table-2.png) and [query-role/key-column mapping](coordinator-visual/reference-indexes-table-5.png). No source, context briefs, mechanical receipts, peer reports, earlier findings, author notes or plan approval were read.

Highest severity: none

## Scope and order of exposure

This is narrow initial visual first-reading coverage of the optional deferred-reference SQL block only. It is neither a full article perspective nor repair confirmation nor a whole-corpus judgement.

1. Opened the supplied screenshot first and attended only to the SQL block. Surrounding prose was ignored. Recorded the apparent meaning and uncertainty in the tool record before opening the article or any reference page.
2. Read the review skill and visual perspective.
3. Opened current rendered r03, located and expanded **When the reference may be checked at commit**, and read the complete disclosure and surrounding explanation.
4. Read the rendered Indexes reference SQL/plan passage and its query-role table for local calibration.
5. Read the manifest for frozen identity: `batch02-v01`, frozen `2026-10-24T00:50:29.465366+00:00`; r03 article hash `54542157012ccb0bb551ed85e15c480a15b9804bd09fafa2a1c5dc011d8a3247`.
6. Inspected the two coordinator-captured unchanged rendered Indexes table images listed above. These arrived after the target first impression and later judgement, so they cannot contaminate that first exposure.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| First reading alone | Pass within scope | Apparent meaning was recorded before prose, as below. |
| Form fits the content | Pass within scope | A short schema declaration makes the precise foreign-key option visible. Two tables are sufficient context for that declaration. |
| Readable at a glance | Pass within scope | At 375 px, the declarations fit as legible, separated lines; no clipping, packed cells or wrapped identifier requires reconstruction in the supplied screenshot. Native execution is outside this facet. |
| Interaction | Pass for disclosure only | The disclosure expands and exposes the SQL and both explanatory paragraphs. This static code has no playback/state controls. |
| Themes and phones | Partial | Inspected the supplied 375 × 812 light screenshot. No independent dark-theme, contrast-ratio or desktop comparison is claimed. |

## First reading

The recorded code-only reading was: the block creates two temporary tables. `deferred_orders` has an integer primary key, `order_id`. `deferred_lines` has a required integer `order_id`, with the named foreign-key constraint `deferred_order_exists` referring to `deferred_orders`. `DEFERRABLE INITIALLY DEFERRED` makes that reference check capable of postponement and deferred by default.

The recorded uncertainties were: `REFERENCES deferred_orders` omits a target column, so a newcomer must infer the primary-key target. The block shows the declaration rather than a transaction, inserts or the instant of checking. The all-capital SQL words remain readable as successive phone-width lines. The constraint name and its following foreign-key clauses require following their indentation, but the short block is easy to trace.

## Later judgement

The surrounding explanation resolves the timing question at the point of need. The disclosure title names commit; its opening paragraph explains a temporarily missing reference inside a transaction and requires a valid final state. Its closing paragraph supplies the concrete order-103 sequence and explains that `SET CONSTRAINTS deferred_order_exists IMMEDIATE` forces the pending check. The constraint's name in the code therefore has a useful later role, rather than becoming an unexplained label.

The preceding section has already established the parent primary key as the reference target and uses explicit column references. In this scratch example the parent has only one column, visibly marked `PRIMARY KEY`. Its omitted target column is a small SQL convention to infer, not a substantive obstacle to understanding this optional timing example. No extra table or animation is needed to read the declaration correctly.

The reference calibration supports treating compact SQL as a declaration/query beside prose that supplies its operational consequences. The Indexes `#check` example likewise separates a short executable query from a following plan and explains how to read the latter; the query-role table maps selected syntax to meaning using direct column headings. The target uses the same useful division: the code makes the changed declaration concrete, and the prose supplies the temporal scenario.

## Findings

No new issue found within the assigned facet. `visual-2` was reserved as the first new finding number and is unused.

## Limits

The initial observation uses the coordinator-supplied screenshot, stated to be from the exact unchanged frozen rendering at 375 × 812. I did not independently regenerate it. Browser accessibility text confirmed the live disclosure and permitted opening it, but screenshot capture in this subagent session failed with an IAB visibility limitation. Reference calibration used rendered browser accessibility/visible text and the two subsequently supplied rendered reference table screenshots. I inspected those pixels directly; their unchanged-rendering provenance is supplied by the coordinator.

I did not review the rest of r03's media, whole-article teaching/coherence, other pieces, downloadable SQL execution, native database behaviour, source, contrast measurements, other themes, full disclosure keyboard behaviour or corpus continuity. No source/content changes, build, delegation or publication were performed. Only this report is written.
