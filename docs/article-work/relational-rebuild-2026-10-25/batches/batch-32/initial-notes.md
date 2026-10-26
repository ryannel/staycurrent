# Initial blind reader notes — logical replication v01

Saved after figures/labels/captions/controls, then the article body, before plans, example facts, author notes or review verdicts. Assignment: batch32-reader.txt; source fixed by review-source.json. Browser: owned IAB article tab on port 4606, desktop 1280×720, initial System preference rendered dark.

## What the figures teach unaided

- Figure 1: both local copies begin at 20.00; source commit makes 22.00 durable before the target applies it; the message identifies P7 rather than a heap address; apply creates a local target version; fresh and older target snapshots differ. The paused branch retains the old price while source history remains required. All five states of both branches inspected.
- Figure 2: a consistent starting view supplies 20.00, source update to 22.00 occurs during copying, copied rows can be visible before readiness, catch-up applies the missing update and reaches r. All four states inspected.
- Figure 3: crossing into a price-selected set sends INSERT; crossing out sends DELETE. Caption covers both-match/neither-match cases. The two labelled directions make the static comparison understandable.
- Figure 4: R is the required-history boundary, F is acknowledged receipt and N is current writing; retention begins at R and includes wider WAL activity. It is explicitly symbolic. The ordered labelled columns plus R-to-N bracket convey the comparison; there is no need to infer a byte scale.
- Figure 5: projection-first can repeat C; progress-first can omit C; one local transaction leaves both durable facts aligned. All four states of each of three choices inspected. The external-service limit is clear.

## Body first reading

The opening names useful situations and the ongoing selection/identity/compatibility/history contract. The main route develops the right dependencies: changed row → identity → setup and initial copy → selection → target compatibility → diagnosis/retention → repair → custom consumer → handover. P7 carries the core ideas consistently; local P11 is explicitly separate. Examples distinguish observations from conceptual schedules and avoid pretending that the narrow run measures production catch-up.

The prose is connected and concrete. Headings name the concepts/actions actually developed, e.g. “Replica identity”, “Copy existing rows, then follow changes”, “Replication progress and retained WAL”. Operational sections are dense, but density is mostly meaningful configuration and failure cases rather than repeated cautions. The preparations list several budgets and privileges without exact deployment values, which is consistent with the stated deployment-input boundary. I did not stall on a substantive missing connection on this first reading. No substantive editorial/teaching finding established yet.

## Remaining checks

Calibrate bounded comparable reference passages/drawings; consult intended understanding and ownership; representative phone, light/dark/current controls, playback and keyboard boundary handling; stop/reset players, restore System/1280×720 and close owned tabs. Technical review is assigned separately; this reader has not read its report.
