# Reader, teaching and rendered review — pg-replication v01

26 October 2026. First independent review of **PostgreSQL physical replicas and promotion**, served at `http://127.0.0.1:4606/review/relational-rebuild/postgresql/replication/`. The three current article/meta/component hashes match `review-source.json`. No edits, delegation, commits or publication. No practitioner report, earlier manuscript/review or author quality verdict was read.

## Result

No critical or medium reader, teaching, editorial or rendered finding. The article fulfils its assigned explanation for an application engineer arriving with replica progress, write authority and WAL-position understanding. No additional reading round is requested.

The article can sit beside the fixed references in its concrete example, explanatory order and prose. “Written, flushed and replayed WAL” names the mechanism directly, as Storage and durability's “Write-ahead log” does. “What synchronous commit waits for” leads into a compact comparison tied to the figure's 20.00/22.00 outcome, rather than leaving settings as unexplained configuration names. “Return the former primary as a standby” describes the final task plainly. The transition from recoverable WAL to promotion is coherent: “A's durable C can be replayed even though its last price query said 20.00” uses the distinction already established, instead of introducing a new test of readiness.

The reference calibration used bounded passages and actual finished drawings: Storage and durability's WAL and row-version explanations and WAL Figure 5; Indexes' sequential-scan/index-entry passages and Figure 2 from initial rows through the four sorted 42 entries and their table locations; Sequence diagrams' lifelines/messages passage and Figure 1. The draft's Figure 1 provides comparable direct teaching: stage lanes retain the same U/C records while the displayed read changes only after C is replayed. It offers less spatial machinery than the reference's memory/disk drawing because the lesson here is progress within one standby, rather than page/log storage.

## Teaching and continuity

Figure 1's six states establish volatile receipt, OS write, durable flush, replay of U alone and replay through C. At the durable-flush state the displayed 20.00 is explicitly accompanied by “C is durable; replay is behind”; the final new-snapshot result becomes 22.00. This answers the article's central question without requiring the body. Figure 2 then gives the report/cleanup conflict and two outcomes; its caption explicitly places the conflict after C and distinguishes it from the earlier pause. Figure 3 carries the same A/B/C facts into a promotion choice, including the assumption that B has no extra WAL source. Its qualification that holding this C does not establish possession of all confirmed work prevents the toy example becoming a candidate-selection algorithm.

After saving `initial-notes.md`, I consulted the fixed v01 `article.json`, `incoming-ownership.json`, `plan.yaml` and shared example. The article covers the intended setup, stage measurements, exact-copy/new-snapshot qualification, synchronous promises and selection, slot retention, query conflicts, loss boundary, promotion and return. Required acknowledgements that cannot arrive are usefully integrated under the standby-selection heading. General routing, fencing/reconciliation, past-target recovery and selective replication remain with their named owners. The native PostgreSQL details add implementation depth without repeating those neighbours' complete lessons.

The complete reading also served the continuity pass. The independent catalogue-price edit preserves pending order 103, no payment, 29.00 agreed line total and stock 10/0/4. The final verification query makes these retained facts useful. Symbolic U/C and the native observed LSNs are distinguished; the native drill paragraphs state the surviving-storage/container limits and identify the fresh-copy return separately from the manually checked rewind outline. This review does not independently establish the native claims' correctness.

## Current rendered coverage

Owned IAB tabs inspected the finished article at actual **1280 × 720** and **375 × 812**, verified from the browser. No phone-reload workaround was needed. Desktop and phone comparisons included explicit light/dark choices, current figure states, table layout and body/code surroundings. The phone page had a 375 px document width; each of the three table regions was 343 px wide without horizontal overflow. Rows wrap narrowly but remain readable. Figures 2 and 3 stack cleanly; the candidate labels, outcomes and caption stay legible. In Figure 1, the bottom read value, changed explanation and controls remain understandable together, although the whole four-lane figure naturally needs vertical scrolling on a phone.

All six Figure 1 states were read in the browser. Next/Back, Play/Pause, final Replay, Reset and Figure as text were exercised. Keyboard Return advanced into the final state while focus stayed on Next; keyboard Back into the first state retained focus on Back. The text alternative matches the six depicted stages. Playback visibly advanced and could be paused/reset. The shared player's current implementation uses text-length-based holds with a 3.5 s floor; no wall-clock playback-rate claim is made here.

Computed foreground/background samples from leaf text in all three figures gave a lowest text contrast of **6.15:1 dark** and **5.52:1 light**. These checks include secondary captions and accent record labels; they do not measure every decorative rule or every syntax-highlight colour. Ticks and explicit stage wording keep inclusion understandable without colour alone.

## Optional polish

**Low — Figure 2 title:** “The report and recovery need incompatible pages” is less exact than its own labels: the report needs the old version while cleanup removes it. A title naming the old-version conflict would make the heading more immediately precise. The labels, surrounding paragraph and caption already establish the correct relationship, so this is optional wording polish and does not reopen delivery.

## Limits and cleanup

Initial notes were saved before plans/example facts/author evidence/verdicts, but the requested strictly figure-first exposure was imperfect: an initial batched source read inadvertently returned prose before the rendered figure inspection. This is recorded in `initial-notes.md`; it does not conceal a prior review or author explanation. The judgement is independent, but cannot be described as perfectly figure-only blind exposure.

Browser work used hidden IAB tabs; screenshots can be stale/throttled during hidden playback. I used explicit manual states and actual DOM state for interaction checks. The browser's read-only evaluation surface did not expose `performance`, so I did not measure playback timing with page timers. Native PostgreSQL execution, power-loss survival, external fencing, runtime capacity, a production handover, exhaustive contrast auditing and the separate technical review are outside this reader assignment. No author mechanical receipt was needed or used.

Before releasing the theme lease, both article players and the viewed reference players were stopped/reset; System theme and actual 1280 × 720 were verified, the temporary viewport override was reset, and all four owned tabs were closed. Reference-origin theme remained System. The main/reference theme lease was released to the coordinator.
