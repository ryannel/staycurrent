# Visual review · article · Relational databases · v1

Inputs read: the assigned `first-visual.txt`; repository `AGENTS.md`, `README.md` and `docs/site-direction.md`; `review-audience.md`; `frozen-v1.json`; the complete frozen rendered article and its isolated figure route at port 4360; the complete rendered Sequence diagrams, Indexes, and Storage and durability references at port 4350, including their figures, tables and code; `staycurrent-review/SKILL.md` and only its visual perspective; `staycurrent-figures/SKILL.md` and its rendering and stepper guidance; `mechanical-receipt-v1.md`, `mechanical-limits-v1.md` and `native-check.json`. No other experiment, review history, author teaching notes or review outcomes were read.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Read the isolated examples and operated both protocol options before reading the article prose. The first impressions are recorded below. Then read the complete article and each example in place. |
| 2. Form fits the content | pass | Separate relations have real column headings and one kind of value per column. Explicit qualified key pairs and highlighted rows connect the tables. The race uses two named lanes and numbered event rows; the commit drawing makes the ordering and memory/storage distinction visible. The comparison material suits tables. |
| 3. Readable at a glance | pass | Names, identifiers, values and outcomes remain consistent. SQL is short and formatted. The history result visibly contains four lines for two orders. At 375 px, wide tables and the history query use local horizontal scrolling rather than page overflow; keyboard scrolling reaches the clipped content. |
| 4. Interaction | pass, with limits | Used all five states in each protocol, Next, Back, Reset, Play, Pause, Replay, the protocol selector and both text histories. Every displayed event, current buyer state, stock/order summary and explanation agreed. Keyboard stepping retained focus at the first and last steps. Playback held text for roughly 6–9 seconds between changes, and Pause stopped advancement. The full native select-popup keyboard path remains unestablished. |
| 5. Themes and phones | pass, with limits | Inspected desktop and 375 × 812 in explicit light and dark themes. Default desktop content area measured 1488 × 917. The phone race keeps its current buyer cards, explanation and controls together; its long event labels wrap within their lanes. Text and meaningful accent contrast pass the measurements described below. System theme and default viewport were restored. |

## First reading

These impressions were formed on the isolated route, before article prose.

- **Figure 1, four shop tables:** each table describes a different kind of fact. Mina's customer number leads to orders 101 and 103; order 103 leads to its numbered items; P7 identifies the blue mug. Real headings make the repeated numbers interpretable. The qualified key pairs below the tables establish which columns connect. The current product offer and the line's agreed price look like separate facts; without prose I could see their equal values but could not yet infer the reason for storing both. The caption explicitly bounds the stock to before order 103 and says that row positions carry no meaning.
- **History SELECT and result table:** the query combines orders, lines and products, filters customer 1 and orders the result. The result contains two lines from order 101 and two from 103. It appears to teach that a result row represents a line rather than an order, with status repeated accordingly. The statement and result correspond visibly; interpreting the aliases and JOIN syntax needs the subsequent prose, as expected for this audience.
- **Figure 2, “Read, calculate, write 0”:** both buyers read the same remaining stock and calculate zero. Mina commits first, then Tariq writes his old calculation. The final stock remains zero while both order identities appear as committed. The important failure is taking one mug for two orders, rather than making stock negative.
- **Figure 2, “Conditional UPDATE”:** Mina changes the row and holds it; Tariq waits, resumes after her commit, fails the stock condition and rolls back. Only 103 commits. “1 committed; 0 for Mina” distinguishes the uncommitted change from the committed value during the middle states. The explanatory text removes any ambiguity about why those values coexist. The histories-as-text disclosure supplies both sequences independently of playback.
- **Conditional UPDATE code:** the stock test and decrement belong to the same statement; RETURNING supplies evidence of whether a row changed. The code alone does not supply the whole purchase transaction, and the article subsequently explains the required application decision and transaction boundary.
- **Figure 3, recoverable purchase:** changes begin in memory; the log reaches persistent storage before the success reply; page-file work can follow. The line between flushing and replying makes that ordering the visual centre. The lost-reply note connects the application's uncertainty to a successful commit. The caption marks the drawing as conceptual, with settings, storage and omitted-detail limits, and says the numbered steps are not equal durations.
- **Recovery table:** a surviving-storage crash, an unavailable writer and a replicated mistake require different paths. The third column asks what each path must establish, rather than implying that every copy solves every incident.
- **Arrangement shortlist:** local data and writes suggest an embedded engine, shared concurrent requests suggest a server, and distributed data/writes suggest a distributed relational candidate. The final column makes these provisional choices testable. It reads as a shortlist for investigation rather than a feature ranking.

## Findings

None. I found no visual contradiction, unreadable required label, unusable control or substantive layout obstacle in the prescribed states.

## Verification detail

The reference calibration was the use of explicit entities, visible state changes and explanatory counters in Indexes; distinct memory and persistent-storage areas in Storage and durability; and named participants, message order and focused comparisons in Sequence diagrams. The reviewed article's simpler table relationships, event grid and commit-order drawing suit its introductory task without requiring readers to decode page addresses or an unfamiliar diagram notation.

The complete set of race states was read manually in both options on the isolated route. The article was then exercised again, including keyboard Enter for stepping and the endpoint focus checks. Arriving at 5/5 left focus on Next with `aria-disabled="true"`; returning from 2/5 to 1/5 left focus on Back with that attribute. Reset returned to the initial state; changing protocol reset the history to its matching first state. Replay restarted the sequence and offered Pause. The expanded text histories matched the stepped explanations.

A fresh timed run of the conditional protocol recorded state changes at approximately 0, 6.6, 15.3, 24.0 and 32.1 seconds. The other protocol changed at approximately 0, 6.1, 13.3, 20.2 and 28.4 seconds. The final state remains available for reading. A paused conditional state stayed unchanged over a 2.5-second observation. These are observed playback intervals, not database timings.

Fresh contrast calculations used rendered computed colours and composited ancestor backgrounds across laid-out article text in each theme, including the table headings/cells, code, captions, relationship notes, numbered event rows, buyer states and current explanations. The lowest active-text result was **6.03:1 in light** and **5.46:1 in dark**. Meaningful thick accents on highlighted rows, buyer cards, the durable-log block and the ordering divider measured at least **3.46:1 in light** and **7.16:1 in dark**. Inactive endpoint button labels are dimmed separately (Next approximately 2.44:1 light / 3.99:1 dark); these are inactive controls, not dimmed data or explanatory text. There are no NULL markers or dimmed data rows in the reviewed figures.

At 375 px, no page-level horizontal overflow was observed or measured (`scrollWidth` equalled 375). Focusable local regions exposed the order-item columns, query, query-result columns and both comparison tables to horizontal keyboard scrolling. The figure's changing buyer cards and explanation remain immediately above the controls in the narrow layout. The timeline's longer conditional labels wrap to two lines without collision. Figure 3 stacks its numbered labels and content boxes and preserves the flush-before-reply divider.

The native receipt reproduces the exact history result and both named concurrency outcomes, including a lock wait and no-row result for Tariq. That evidence supports the examples' identified mechanics; this review did not rerun PostgreSQL or treat the browser drawings as live traces.

## Limits

- Chrome only. No screen-reader session, zoom matrix, print check or physical-phone test was performed. Reduced-motion preference was not emulated.
- The protocol options were operated successfully through the native select automation. Attempts to select through the full native popup keyboard path did not establish that path; keyboard button activation, focus retention and horizontal scrolling were established separately.
- Browser automation may operate a hidden window with coarse animation/screenshot updates. Timing was sampled from the actual rendered state at roughly half-second intervals using the review runtime's clock. The read-only page scope did not expose page timers, so the quoted intervals have sampling/tool-latency limits; they are not frame-accurate timings.
- Contrast calculations cover laid-out DOM text and the identified meaningful accents, not every antialiased pixel, browser-native popup, decorative rule or possible operating-system configuration. No performance, crash, network, replica or capacity behaviour was measured.
- All reference articles were read in their rendered form, with figure/table inspection and sampled reference interaction, rather than an exhaustive state/theme/viewport matrix for the references themselves. The exhaustive two-protocol state checks apply to the reviewed v1 article.
- Screenshots were inspected through the browser tool, not saved as separate files; this assignment authorised only the named report file.

System/default desktop restoration was verified before returning: System selected, Dark/Light unselected, explicit viewport override cleared, 1488 × 917 browser content area.
