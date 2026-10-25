# Reader review — Failover and fencing v01

**Result:** no substantive reader, editorial or rendered finding. This bounded article fulfils its promise for application engineers arriving from Replicas, lag and read routing.

## Version and scope

Reviewed the integrated first version at `http://127.0.0.1:4606/review/relational-rebuild/failover/`. Current article, metadata and Transfer component SHA-256 hashes exactly match `review-source.json` and the v01 evidence hashes (article `99506af…`, component `0766301…`). No edits or publication. Saved `initial-notes.md` before consulting the plan, ownership, example facts, technical-source record or mechanical receipts. The initial DOM snapshot exposed the body while locating figures; I followed the illustrations and controls first, then read the complete body.

## Reader understanding and reference standard

The three figures form a useful argument. Figure 1 keeps the old pool's write route visible when the monitor loses contact; its address-only final state visibly leaves both writers accepting work. Figure 2 then isolates the other decision: A and B initially return the same 20.00, yet only A durably holds U and C and can recover 22.00. Figure 3 follows B's omitted-commit path into separate histories and the need to preserve evidence before replacing the old copy. No missing visual connection blocked that reading.

The prose develops the harder practitioner cases where they become necessary. “Suppose A is now unavailable too” makes the durability/availability trade concrete. “A larger number on a different branch is not evidence that it contains C” prevents a misleading comparison. The handover list includes competing promotions, recovered history, pools, workers and uncertain replies. Rejoin is distinguished from business reconciliation. The lease/token subsection is denser but its hypothetical generation 8/7 receiver example gives enough explanation for the limited claim, with deeper protocol work handed onward.

Calibrated with bounded original passages and rendered drawings: Storage's write-ahead-log explanation/figure, Sequences' synchronous/asynchronous contrast, and Indexes' selectivity explanation/figure. This article uses their pattern of one concrete example, one changed decision and an explicit conclusion. Its headings identify actual questions or actions; the connected sentences and qualifications read as one piece. Captions distinguish symbolic histories and constructed SQL states from observed failover. The plan and ownership check subsequently confirmed coverage of the intended exclusion, loss-boundary, divergent-work and return decisions without borrowing the native PostgreSQL procedure or full backup reconciliation. P7's catalogue change remains separate from order 103's retained 29.00 agreement.

## Rendered and control coverage

Current owned tabs, confirmed actual widths: 1280×720 desktop; fresh phone tab before override, confirmed 375×812 and page width 375. Sampled desktop dark/System and light, phone light split-brain outcome and dark history/branch drawings. Labels, missing-record dashes, panels, summaries and controls remained readable; no horizontal page overflow. The phone history drawing retains aligned H/U/C columns; Figure 3's narrower two-branch layout wraps cleanly. Long figures need ordinary scrolling, while the current explanation and controls remain together.

Manually stepped both four-state figures, compared both options at their outcomes, reset them and sampled actual Figure 2 playback (Pause available, progressed through 3/4 to its end). Keyboard Enter on Next advanced to the final state and retained focus at that endpoint. Retained applicable authored `browser-checks.json` receipts after blind notes: both-option state/back matrices, text-alternative/reset observations and 375px theme-token contrast measurements. Their source hashes match the reviewed files. These mechanical receipts supplement the current rendering inspection; no author quality verdict was used.

## Evidence and limits

Independently consulted [PostgreSQL 18 Failover](https://www.postgresql.org/docs/18/warm-standby-failover.html) for old-primary exclusion, restored standby protection and rehearsal, and [Patroni Watchdog](https://patroni.readthedocs.io/en/latest/watchdog.html) for demotion failure under process/VM pause or overload and the need for protocol-specific enforcement. These support the bounded practitioner explanation; this is not a replacement for the separate technical review. No database failover or fencing was executed and the SQL receipt was not rerun.

This was representative rendered sampling, not another complete viewport/state matrix. Playback was observed in a background IAB tab; I did not measure per-state wall-clock hold durations. Exact contrast ratios are retained authored mechanical evidence, not independently remeasured. First-step Back activation through the automation action was prevented by its disabled accessibility state; no claim of a fresh complete keyboard traversal is made.

At completion both owned article tabs' players were stopped/reset to 1/4, System selected, viewport override reset and actual 1280×720 confirmed. All owned article/reference tabs were closed. No outstanding optional polish requested.
