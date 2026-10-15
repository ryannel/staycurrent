# Access and persistence: review and verification

15 October 2026. Commission: [three-article batch](brief.md). This record covers
Indexes, How a query runs, and Storage and durability.

## Independent perspectives

- [Technical review](technical-review.md): source-supported claims, SQL execution,
  diagram meaning and practical outcomes. The reviewer independently reran the
  index and query-plan experiments.
- [Editorial review](editorial-review.md): orientation, causal explanation,
  practical closure, figure inspection and the query article's purpose beneath its
  parent. The reader found the new investigation distinct from the parent's plan.
- [Sequential first reading](first-reading.md): one uncued reader carried learning
  across all three articles, recording questions before receiving later chunks.
  The artifact was browser DOM extraction in article order plus actual figure
  screenshots. It was an agent reading, not a human novice session.

The baseline remains under `browser/`; revised captures are under `final-browser/`.
Authors' final autocommit instructions reached the source after the initial build,
so they are present in the revised capture rather than the baseline. Reviewers
record this distinction. The first reader received no briefs or intended answers.

## Repairs and decisions

| Finding | Decision and repair |
| --- | --- |
| Desktop storage diagram hides its read arrow and part of the label | Renamed its local transfer class, avoiding an unrelated global rule that imposed a 200px width. Rechecked the actual pixels in both themes and widths. |
| Stacked index leaves make the phone arrow point at excluded leaf A | Removed the misleading mobile arrow, named B as selected and A/C as skipped, and retained desktop alignment. |
| Plan comparison caption says every arrow carries rows | Described stages and their rows or prepared lookup, so the built hash table is not mistaken for a stream of purchase lines. Removed inherited section margins inside the figure. |
| Index-only visibility explanation relies on knowledge developed later | Added a local account of overlapping readers and retained row versions before relying on the heap visibility check. |
| Vacuum changes the running practice state but appears only as a reported inline command | Made it an explicit standalone command with autocommit instructions, before the broad-query example that uses the resulting state. |
| Download execution can accidentally wrap VACUUM in a transaction | Specified psql file execution or individual statements with autocommit, both on the page and in the downloaded file. Named the download to match the example command. |
| Storage figure names the shared buffer before defining it | Moved the existing cache explanation ahead of the figure; retained the nearby consequence about reusing neighbouring rows. |

The original main articles keep their substantive explanations. No new interactive
model was needed for this batch: seven static figures expose the arrangements and
sequences, while runnable SQL supplies the meaningful experiments.

## Verification scope

The [index evidence](../indexes/evidence.md), [query-execution evidence](../query-execution/evidence.md)
and [storage evidence](../storage/evidence.md) preserve sources, engine versions,
commands and observed results. SQL checks use PostgreSQL 18.3 through PGlite 0.5.8.
They establish results and particular plan behaviours, not production performance.
Storage SQL checks establish updates, row-version changes and rollback; crash
recovery and persistence guarantees are documented behaviour, not fault-injection
observations.

Browser checks cover the three pages at 390px and 1280px in light and dark themes,
including every figure. [Reader-path checks](reader-path.json) exercise focus and
keyboard scrolling, fetch all three SQL downloads and compare their bytes with
the verified source, and find all three entries in the article directory.
The [link audit](links.json) checks built-site destinations and fragments.

The local build uses bundled Node 24.19.0 and locked pnpm 11.4.0. Existing PGlite
browser-bundle warnings remain.

## Final disposition

**All three articles are ready as working drafts.** Technical and editorial
reviewers rechecked the figure repairs. The sequential reader separately rechecked
the changed explanations, practice sequence and storage figure, preserving the
original reading log. No consequential finding remains unresolved. A further
example of a later key rejecting entries without narrowing an index interval is
retained as an optional improvement; the present worked choice does not depend on it.

Final `pnpm build` passed: 56 pages. The link audit found 1,309 internal links and
no missing destination or fragment. All twelve page/width/theme combinations
returned 200, retained noindex, and had no page overflow, failed images or browser
exceptions. Pixel inspection established that the repaired internal relationships
were visible as well. Download byte comparisons, directory discovery and keyboard
checks passed. `git diff --check` is clean.

The collection now has eleven working drafts and sixteen planned articles. Batch 2
remains the proposed next production work. These checks establish reviewed drafts;
no production timing, storage fault injection or human learner study was performed.

## Subsequent user review and body revision

The user rejected the headings as unnatural, then requested the same scrutiny
across the body text. The earlier readiness verdict above did not establish that
the prose met their expectations. The [body revision and review](body-review.md)
records the subsequent rewrites, independent rereadings, repairs, verification and
skill changes. Its final source hashes supersede the earlier prose snapshots.
