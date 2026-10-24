# Visual review · article mode · r15, r18–r21 · batch06-v01

Inputs read: the [exact frozen manifest](v01/manifest.json), its visual input restrictions and [mechanical applicability receipt](v01/mechanical/applicability.md); the five complete rendered articles and their isolated-media routes on `127.0.0.1:4440`; the rendered fixed references on `127.0.0.1:4350`; current visual perspective and figure/render guidance. The r15 mechanical control record was consulted after my own isolated first reading. Source, plans, context, history, author notes, other reviews and earlier versions were withheld and were not read. No build, article edit, delegation or publication was performed.

Highest severity: **low**. No critical or medium visual finding.

The complete articles used were `storage/`, `crash-recovery/`, `backup-and-restore/`, `replicas-and-read-routing/` and `failover/`, under `/review/relational-collection/`. The r20 route follows its actual rendered article link; the assignment's `replication/` shorthand was a coordinator error, not a defect in the piece. Each article's final Sources disclosure was expanded and read, including disclosures outside the article element.

## Checks

| Piece | Check | Result | Note |
| --- | --- | --- | --- |
| r15 | 1. First reading alone | Pass | Figure, one SQL example and both tables inspected on the isolated route before article prose; all six figure states used. |
| r15 | 2. Form fits the content | Pass | Two reader answers above the retained versions show why one product can occupy two physical versions. The separate engine and byte-count tables make two different comparisons. |
| r15 | 3. Readable at a glance | Pass | P7, prices and visibility labels remain explicit. Tables have useful headings; the short query has one reading order. |
| r15 | 4. Interaction | Pass | Play/Pause, Back, Next, Reset, Replay and text alternative used. All states agree; keyboard focus remains on Back at the first state and Next at the last. The code panel also accepts keyboard horizontal scrolling. |
| r15 | 5. Themes and phones | Pass | Actual 1280×720 and 375×812 in light/dark, with every manual state exercised in each combination. Reader answers, versions and explanatory result remain legible. No page overflow; the longer SQL comment scrolls inside a focusable code panel. |
| r18 | 1. First reading alone | Pass | Figure and durability table inspected before prose; all three cuts and all four states per cut used. |
| r18 | 2. Form fits the content | Pass | Parallel table-file, log and application-knowledge lanes directly compare the evidence each crash leaves. The table separates acknowledgement choices. |
| r18 | 3. Readable at a glance | Pass | Lane headings and purchase/stock summaries are concise. The two committed histories visibly have the same recovered purchase and different application knowledge. |
| r18 | 4. Interaction | Pass | All twelve states agree with their explanation. Radio choices meaningfully change the selected history, retaining the current step for comparison; Reset returns to the start. Playback, Pause, Replay, text alternative and keyboard endpoint focus work. |
| r18 | 5. Themes and phones | Pass | All display combinations and manual states used. The radio group stacks and the lanes become labelled blocks at phone width; the result stays above the player. Table remains readable. |
| r19 | 1. First reading alone | Pass | Backup-pieces table and complete six-step restoration figure inspected before prose. |
| r19 | 2. Form fits the content | Pass | A fixed historical sequence above changing source/candidate/acceptance blocks distinguishes the recovery target from reconciliation and authority. |
| r19 | 3. Readable at a glance | Pass | 103, 107, P3 and the stock changes are named; the table distinguishes what each saved piece supplies from its dependencies. |
| r19 | 4. Interaction | Pass | All six steps agree, including the closed history, missing valid request, idempotent application and continuing fence. All player controls, text alternative and keyboard endpoints work; playback/Pause observed. |
| r19 | 5. Themes and phones | Pass | At 375px the history becomes a vertical sequence with downward arrows. The changing candidate and acceptance result remain with the explanation and controls; light/dark text is legible. All manual states exercised. |
| r20 | 1. First reading alone | Pass | Progress figure and both tables inspected before prose; all five progress states used. |
| r20 | 2. Form fits the content | Pass | Identical labelled position chips across four rails permit direct comparison of local durability, receipt, remote durability and replay. Check marks supplement colour. |
| r20 | 3. Readable at a glance | Low finding | Main figure, position key and tables read clearly. Expanded text alternative joins several words and numbers; see **r20 · visual-1**. |
| r20 | 4. Interaction | Pass, with low polish | Each meaningful state changes the appropriate rail and query answer. All controls and text alternative work, with keyboard focus retained at both ends; playback/Pause observed. The text alternative's spacing is the only local polish issue. |
| r20 | 5. Themes and phones | Pass | At 375px each rail keeps its heading immediately above its chips. Current query answer and explanation remain beside the player in the reading flow. Both tables readable; all manual states exercised in both themes. |
| r21 | 1. First reading alone | Pass | Both five-state protocols and the closed-history/candidate/accepted-result table inspected before prose. |
| r21 | 2. Form fits the content | Pass | The new-connection route is separate from two server role cards and the existing client's write outcome. This makes route change and enforced loss of authority separately visible. |
| r21 | 3. Readable at a glance | Pass | Role and outcome labels distinguish the unsafe two-writer case from refusal by the fence. The table gives the original, missing and accepted purchase facts under explicit headings. |
| r21 | 4. Interaction | Pass | All ten states agree with their explanation; protocol selection permits comparison at the same step. All player controls, text alternative and keyboard endpoints work; playback/Pause observed. |
| r21 | 5. Themes and phones | Pass | Both cards stay readable at 375px; the existing-client outcome sits above the explanation and controls. The four-column table wraps but preserves clear row and column association. All manual states exercised in light/dark. |

## First reading

These observations were made from the isolated routes, including the controls, before reading the article prose.

| Piece/example | Apparent meaning and uncertainty before prose |
| --- | --- |
| r15 Figure 1, “Two readers, one product” | A retained report keeps 20.00 while a fresh query moves to 25.00. The heap holds both versions until the report ends; cleanup makes room rather than removing a file page. The isolation level, illustrative layout and omitted detail are stated inside the example. No unresolved visual ambiguity. |
| r15 SQL, “Inspect the current physical version” | A query shows P7's current price and `ctid`; the comment cautions that this is a version address, not identity. It reads as an inspection query, not an update or a lasting reference. |
| r15 engine comparison table | PostgreSQL retains heap versions and InnoDB reconstructs from undo; long snapshots retain history in either design. Cleanup ownership is separately named. |
| r15 native byte-count table | Halving logical rows did not halve the heap until a rewrite. The caption limits the values to one run and excludes indexes. |
| r18 Figure 1, “Which evidence survives the crash?” | Before-commit recovery lacks the purchase; both durable cases recover it, but only the after-reply application knows success. The figure expressly distinguishes chosen conceptual cuts from a real ambiguous connection failure. No unseen timing is inferred. |
| r18 durability-decisions table | Ordinary durability, an early acknowledgement and broken storage ordering have different consequences; the latter includes corruption, not just a missing tail. |
| r19 saved-pieces table | A backup component alone may lack what recovery requires: globals/configuration, WAL, dependency chain or correct continuation. |
| r19 Figure 1, “A clean database can still be missing a valid order” | Restoring before the deletion recovers 103 and excludes valid later 107. Closing the old writer comes before comparing its accepted history; applying 107 once restores P3 to 9. Acceptance precedes authority transfer. The final external checks are explicitly conceptual, not an executed provider test. |
| r20 Figure 1, “The copy has the bytes before its reader has the order” | Receipt, durable storage and replay are different positions. Even the durable replica lacks 103 until replay crosses the commit. The position key makes the abstract chips interpretable without PostgreSQL LSN knowledge. |
| r20 acknowledgement table | Three remote conditions carry different read requirements; the caption requires synchronous standbys to be configured. |
| r20 read-routes table | A catalogue, confirmation, stock decision and fixed export need different views and routes. Each suggested route is paired with its required promise. |
| r21 Figure 1, “Moving the route does not close an old connection” | Directing new connections to the candidate leaves an existing old-primary connection writable. Fencing first makes the same final attempt fail. The candidate's own history is a distinct acceptance question. |
| r21 purchase/candidate table | The old primary accepted the complete 103 purchase and stock decrements; the candidate is missing it; the selected accepted result restores those facts. This is a comparison of whole operation states, not a replacement for a relation schema. |

After the complete reading, every example supported the surrounding explanation and used the same entities, values and declared illustrative/native boundary. No prose was needed to reverse an initially misleading visual reading.

## Findings

### r20 · visual-1 · low · Figure 1, expanded “All progress states as text”

Problem: the text alternative visibly joins prose to numbers, including “purchase103”, “position2”, “through2”, “remain0”, “lack103” and “P3stock10/P7stock0”.

Effect: readers choosing the static alternative have to separate identifiers, positions and stock labels themselves. The meaning remains recoverable from the figure's key and preceding sentences, so this is minor local polish rather than a substantive barrier.

Suggestion: preserve ordinary spaces at these inline boundaries, and give the final stock summary the same readable separation as the main figure.

Evidence: [current rendered text alternative](visual-v01-evidence/r20-text-alternative-spacing.jpg). This was visible in the browser, not inferred from source.

No finding is raised for r15, r18, r19 or r21.

## Evidence and limits

- [Reference calibration record](visual-v01-evidence/reference-calibration.md): all 34 rendered fixed-reference drawings, their teaching passages and comparison tables inspected. Tall/clipped views were recovered using ordinary scrolling. Misregistered `fullPage + clip` captures were discarded as evidence.
- [Manual states and endpoint focus](visual-v01-evidence/responsive-states-and-focus.json): all 39 meaningful states exercised at desktop/phone in both themes, including both ends by keyboard and every radio option. Initial isolated observations are separately retained in [manual-states.json](visual-v01-evidence/manual-states.json).
- Screenshots are named by piece, width/theme and location in [the evidence directory](visual-v01-evidence/). Each piece has desktop light/dark and phone light/dark figure captures; phone table captures cover all seven tables. The r15 code panel's horizontal scroll and keyboard focus were used, not merely observed as overflow.
- [Fresh text contrast samples](visual-v01-evidence/contrast-summary.json), from [rendered computed colours](visual-v01-evidence/rendered-colours.json), have minima **6.61:1 light / 6.83:1 dark** for sampled active text, including secondary labels/captions. Inactive endpoint buttons were excluded from active-text minima. No dimmed data row, NULL marker or warning was needed by these figures. [Meaningful selected rail-border contrast](visual-v01-evidence/graphic-contrast.json) is **5.52:1 light / 8.77:1 dark** on its actual chip background, above 3:1. Decorative frame/rule contrast is not treated as information-bearing graphics.
- [Bounded page-clock transitions](visual-v01-evidence/playback-observed-transitions.json) and [playback/Pause records](visual-v01-evidence/playback-and-pause.json) establish that every player advances and every paused player stayed unchanged for at least **17.3 seconds**. The nominal one-second observations sampled a roughly 24-second transition window; observed complete intermediate intervals included 6.24/8.34 seconds for r15, 12.51/5.19 for r18, 11.46 for r19, 8.34/5.19 for r20 and 9.38/8.31 for r21. These are sampled intervals, not exact internal dwell durations. Initial residual intervals are not full first-state holds and were not treated as failures. Every manual state was read; not every automatic state was independently timed. The browser pane was hidden, so screenshots/animation frames can lag; page-clock readings and current DOM state were used for timing.
- Native fixture execution was not rerun. Its technical correctness is outside this visual assignment; conceptual illustrations were assessed as illustrations and complete disclosures were read. No browser download/save verification was applicable: these pieces offer no downloads.
- The five additional playback tabs opened at verified actual 1280×720 despite the earlier tab's 375px override. They were treated as desktop timing observations. Responsive records use the verified target tab's actual dimensions, not the requested override alone.
- Cleanup completed: every own player reset, every own tab returned to System, actual **1280×720** verified on the last reviewed tab, viewport override reset and all own temporary tabs closed. The global viewport lease was explicitly released to the coordinator.

This is one fresh initial visual perspective on batch06-v01, not a corpus review or a final complete editorial/practitioner check.
