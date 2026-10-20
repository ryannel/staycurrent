# B39 practitioner review — a36

Verdict: **REPAIR** — two narrow model decision/narration corrections. Full native observation, arithmetic, scope and unaffected model checks pass. Optional advice: none.

## Required repairs

**a36-P1 — Do not infer the 99.9% objective from p95 and useful completions.**

Location: `src/components/relational-next/a36/models.mjs:15` and `:18`; Figure 1, History is retained, steps 2 and 3. The article defines 99.9% of eligible attempts succeeding within 500 ms over 30 days. The dashboard shows p95 100 ms labelled “target 500 ms”, useful completions and zero failures/rejections, then says “The application still meets its objective.” Those measures do not establish the deadline bad fraction or its objective window. Useful-but-late operations remain useful in a28's definition, and p95 hides most of the relevant tail.

Concrete counterexample: 1,198 successful operations at 100 ms and two successful operations at 600 ms preserve p95=100 ms, zero failures/rejections and 1,200 useful completions, but 0.1667% exceed the deadline. Repeating that population can fail the 99.9% objective. The displayed ten-second window also cannot establish 30-day compliance. The independent counterexample is retained in [practitioner-model-audit.json](practitioner-model-audit.json).

Required correction: qualify the note to the facts actually displayed (continuing useful completions and low displayed p95), leaving objective compliance unproved. Avoid labelling the 500 ms threshold as a sufficient p95 acceptance target; a short legend qualification is enough. Preserve the useful point that archive/recovery trouble can require action independently of the application's apparent health. No invented compliance evidence or native rerun is needed.

**a36-P2 — Keep the missing-telemetry deadline conditional on actual service impact.**

Location: `models.mjs:24`; Figure 4, Collector stops arriving, final step. Its owner is the telemetry owner and the condition is unknown service state, but its deadline inherits “Restore order-taking within its 10 min incident budget.” The article's corresponding ownership row instead requires collection investigation, independent checks and escalation on service impact or continuing unknown state. Missing collection does not establish that order-taking has failed.

Required correction: make this branch's deadline collection/verification/escalation work, with the order-service incident clock applied only if an independent check establishes the relevant service failure. Keep advancing samples and agreement with the independent check as its completion evidence. The service-signal branch's ten-minute deadline can remain. Confirmed directly in the rendered final state as well as source.

## Scope and practical depth

Read the full article/context, sources, writer handoff, models, component, CSV and native procedures/results. Compared the actual a07/a28/a37/a38/a39 responsibilities and bounded observations with their previously reviewed full cases. The article owns the intended visibility, evidence routing, growth/retention clocks, normal/degraded reservations and useful alerts. It does not repeat a28's diagnosis, maintenance commands, promotion or restoration. This is useful depth for the original relational-practice goal.

A28's intended-arrival boundary and offered/admitted/useful/failure/rejection/outstanding meanings are retained. Retries do not multiply logical operations; residual server work after caller timeout is separate. The cited 240-arrival two-second schedules, 187–188 before completions and 240 after completions agree with a28. Its small workload, a38's 0.303-second local switchover and a39's subsecond tiny restore are explicitly insufficient to accept production resource or recovery budgets. Large budgets remain labelled invented/unverified and “planned, not accepted”.

## Independent native checks

Executed the complete inspected PG18.6/pg8.23.1 worksheet with its uniquely owned database and role. Retained [raw independent evidence](practitioner-native.json). Audited all 22 query records, exact returned activity columns, own-database/session filters, actual errors and allocations:

- Before the grant, another fixture session exists but state is null and query is hidden. pg_read_all_stats exposes idle state and its fixture query while SELECT orders and pg_ls_waldir remain denied with 42501. The role is not given broader file or table-reading authority.
- Both size snapshots satisfy total=table+indexes. Deleting 3,000 of 4,000 rows and no-truncate vacuum leaves the 1,220,608-byte main heap unchanged; 1,000 live rows remain. Total rises 1,359,872→1,368,064 bytes.
- Independently resolved that last attribution in a second fresh database: heap, FSM, TOAST and indexes remain identical; VM alone rises 0→8,192 bytes. Exact fork observations are retained in [practitioner-forks.json](practitioner-forks.json).
- Own-database commits move 2→15; two temporary files contribute 1,107,392 cumulative bytes. These include observer/setup/maintenance work, not thirteen orders or occupied temporary space. Statistics estimates and null reset fields are not promoted to exact live-row/reclaimable-space or never-reset proof.

Both own databases, the temporary role and their sessions were independently checked absent after cleanup: all counts zero. No shared server settings, restart, global reset, other worker query inspection or installation.

## Arithmetic, primary contracts and rendered models

Independently recomputed every configured forecast/resource/accounting state and all 35 CSV rows' scope/status structure. Local 224+64+16+96=400 GB; remote 900 GB and separate 500 GB remain different boundaries. Ordinary/adverse time-to-reserve is 16/5.333 h and hard-full 24/8 h. Eight-hour intervention plus two contingency gives 72/152 GB thresholds; longer intervention gives 104/248 GB. The worked 14:00 review/16:00 start follows from the ordinary six-hour latest-start margin. Zero/negative reserve margin remains urgent.

The dashboard's first changed interval offers 1,200, admits 904 and completes 900: 300 outstanding=296 queued+4 active. The next interval adds 300 outstanding. Resource sums are [9,15,230,96] against [8,16,200,90]; agreed report deferral gives [6,12,160,76], explicitly arithmetic rather than accepted capacity. Alert ratios 1%/0.1%=10 and 0.4%/0.1%=4 are correct, with monthly consumption correctly distinguished.

Checked PostgreSQL 18 [statistics](https://www.postgresql.org/docs/18/monitoring-stats.html), [roles](https://www.postgresql.org/docs/18/predefined-roles.html), [administration/size functions](https://www.postgresql.org/docs/18/functions-admin.html) and the primary RDS [metric definitions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-metrics.html)/[autoscaling restrictions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html). Scope, lag, state/wait, allocation inclusions and provider examples agree with the stated contracts.

Walked all **34 rendered states across four figures/eight variants** on immutable 4439, reading every current metric and consequence. Apart from P1/P2, model values and operating decisions agree with prose, evidence and the arithmetic audit. Both component hashes match B39; article snapshot equals rendered source. No assigned sources, evidence, builds or Git changed; downloads were not activated. Frozen preview released after review. A repair recheck can retain all these unaffected native, scope and arithmetic passes.
