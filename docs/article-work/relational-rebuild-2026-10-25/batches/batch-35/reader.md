# Independent reader review — pg-operations v01

Reviewed the fixed first version in `review-source.json`, served at `http://127.0.0.1:4606/review/relational-rebuild/postgresql/operations/`. The four current source hashes match that manifest. No edits, delegation, earlier reviews, coordinator verdicts or technical-review report were used. Initial blind notes were saved in `initial-notes.md` before consulting the plan, shared example or ownership record.

## Findings

No substantive reader, teaching, editorial or rendered finding. One optional polish item:

- **Low — Figure 2, Cancel W’s query, step 3/4:** the W card says **“Explicit transaction failed”**, whereas the step explanation correctly says **“If W used BEGIN, its transaction is now failed.”** W’s explicit transaction has not been established in the opening setup. A reader following the cards alone has to infer whether the model deliberately chose that case. Make that assumption explicit in the figure or retain the condition in the card. The surrounding explanation and text alternative already provide the correct distinction, so this does not undermine the taught cancellation/cleanup decision. Source location: `src/components/relational-rebuild-pg-operations/LockRecovery.astro:61`.

## Teaching and editorial judgement

The article fulfils the intended journey from request identity, through activity state and dependency evidence, to a targeted action and useful recovery. It answers its native PostgreSQL commission without taking over capacity budgets, full plan analysis, vacuum, WAL or schema-operation lifecycles. Those hand-offs follow a useful local answer.

The figures work as an explanation sequence on their own. Figure 1 puts the absence of a backend before checkout alongside the identity available after borrowing. Figure 2 makes the hardest distinction visible: the apparently idle H still owns the blocking transaction, and the four actions change the dependency and W’s outcome differently. Figure 3 keeps the same accumulated total while changing frequency versus duration. Figures 4 and 5 expose admission thresholds and nested time allowances instead of relying on setting names alone. The state/wait table turns each observation into a concrete next question.

The actual headings name recognisable tasks (“Diagnose connection pressure”, “Cancel a statement or end a session”). Paragraphs develop their reasoning in plain language: the warning that an old `query_start` beside `idle` does not mean the query is running follows the timestamp explanation; the last section connects lock release through rows consumed and client returned to useful responses. Qualifications sit with the inference they constrain. The result can sit beside the references in selection, development and prose.

Calibration used bounded rendered passages and drawings: Storage and durability’s Buffer pool passage and Figure 2; Indexes’ Sequential scan opening and Figure 1; Sequence diagrams’ Lifelines and messages passage and Figure 1, plus the labels/caption of Who is waiting. Like those examples, the current article follows named participants, narrates the changed state and distinguishes the drawing’s scale/assumptions from observations. Its smaller static comparisons are sufficient for their narrower teaching tasks.

Continuity checked against the supplied plan, incoming ownership and shared-example input after the blind notes: Mina/customer 1 still reads pending 103 before paid 101; 103 has no payment and totals 29.00; H is an independent lock-only branch with no row changes; report and storage quantities remain labelled models. Terms and later recovery uses retain those distinctions.

## Rendered/control coverage and limits

Owned IAB tabs; desktop actual 1280 × 720 and fresh article phone tab verified at actual 375 × 812 (document width 375). Inspected all five drawings on desktop and phone, including light and dark appearances; static layouts, labels and captions remained readable. The lock model stacks coherently on phone and keeps its current result/explanation near its controls. Inspected every intervention and all four steps; exercised Play, Pause, Back, Next, Reset, the intervention selector and expanded text alternative, and observed the terminal Replay state. Keyboard Enter retained focus on Back at the first boundary and Next at the last boundary; visible focus and reset states were usable. The contrast samples for secondary figure text were approximately 6.05:1 light and 6.15:1 dark against their figure surfaces.

Playback visibly progressed and finished at Replay; explicit Play→Pause and Reset worked. A page-timer sampling attempt exceeded IAB’s evaluation deadline, so this review does **not** establish exact dwell durations. Background screenshots are not reliable playback clocks. No screen-reader run, full browser matrix, exhaustive phone table/code-scroll matrix or native database execution was performed. This reader review does not replace the separate technical review or any applicable mechanical receipts.

A bounded practitioner cross-check used PostgreSQL 18’s [server signalling functions](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL) and [client connection defaults](https://www.postgresql.org/docs/18/runtime-config-client.html): cancellation targets the current query; termination’s positive timeout can observe session end; lock limits apply per acquisition inside the server statement interval; longer lifetime timeouts terminate sessions. These support the central action distinctions checked here.

Cleanup: main and reference origins restored to System; players stopped/reset; viewport override reset and final main article measured at 1280 × 720; all owned tabs closed. Theme lease released to coordinator. No source changes, commits or publication.
