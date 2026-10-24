# r13 · Transactions and isolation

Writer workspace: `/private/tmp/staycurrent-relational-20261024-r13`. Fresh article from supplied brief, example facts, links and complete r00 entrance context. No old r13, reviews, history or unrelated drafts inspected. Root owns integration, build, preview, reviews and any later publication. No delegation, local builds/servers, commit or push performed.

## Reference exposure and design boundary

All 19 numbered reference parts were separately delivered with their END markers before design: sequences 1–6, indexes 1–7, storage 1–6. See `evidence/reference-study.md` for full hashes and rendered passages. All 34 numbered reference drawings were inspected in temporary tabs at the assigned URLs with no viewport/theme changes. Tabs were closed.

Coordinator explicitly acknowledged exact delivery before source design and accepted the explanation-owned duty schema. Current write, figures and continuity skills and the three figure references were read. The Serena initial instructions were called before authoring the figure/verifier implementation; its unrelated activated project was not inspected or edited.

## Teaching decisions

The introduction already supplies the purchase and last-mug race. This piece develops what the invariant demands; atomic transaction boundaries and application branching; conditional one-row updates; statement versus transaction snapshots; a different-row write-skew counterexample; Serializable and full decision retry; choice and reproduction.

Two stepped drawings show logical relationships, not execution timing or storage. Snapshot read labels move between two views while the committed stock remains explicit. The two-instructor drawing holds read facts above planned/committed own-row writes and the shared current rows below. Mode switching preserves the current step so readers can compare the same point. Figures reuse the shared stepper for timing, controls, retained focus at ends and reduced-motion behaviour. No other article's subject mechanics were copied.

## Continuity pass

- Starting reader knows tables/keys, the order, atomicity, the stock race and conditional UPDATE from r00. Atomicity is briefly developed where the article's new snapshot distinction needs it; this is not treated as a new beginner SQL introduction.
- Uses core JSON for order103's stock-effect table. P7 begins 1; P3 begins 12; successful 103 leaves P7=0/P3=10, pending, with existing line quantities/prices. Tariq's104 never commits in the protected schedule. No authoritative orders.total or currency is invented.
- Report view and purchase race are kept distinct. Every race resets before 103; snapshot histories and duty histories are separate. Historical 101/102 are not deducted from the fixed pre103 stock.
- E2 gives S502, I1 Ada Lind and I2 Tomas Ek, initially on duty; no customer becomes staff. Coordinator accepted explanation-owned `duty(session_id text NOT NULL,instructor_id text NOT NULL,on_duty boolean NOT NULL,PRIMARY KEY(session_id,instructor_id))`. Exact DDL and initial rows are in worksheet/transcript; no core amendment is implied.
- Snapshots are introduced before stable reads; stable reads before write skew; serial orders before the cycle and Serializable; rejection before complete retry. The diagram's initial action text was clarified to “No change yet”, with a planned off-duty change only after the read.
- Read Committed's row recheck is not generalised to all decision facts. Repeatable Read is not called serializable. Serializable is conditional on correct serial decisions and every participating writer. Existing snapshots are not said to refresh after a lock wait.
- Detailed lock/guard protocols remain with the locks neighbour. Uncertain replies and retry control remain with the retries neighbour; external effects link to outboxes. No distributed commit protocol is introduced.

## Verification and provenance

Native worksheet: `src/components/relational-collection/r13/downloads/run-isolation.py`; actual installed version PostgreSQL 18.6 (Homebrew). Python 3 standard library, native psql clients, max_connections 8/shared_buffers 16 MB, socket only, locale C/UTF8, ownership verified from SHOW data_directory/current_user before DDL. Inherited PG variables removed. Two session histories plus observer belong to the generated cluster.

The default sandbox blocked initdb's shmget; owned failure was cleaned up. Coordinator authorised direct escalation for this named owned disposable check. Escalated run passed. A later rerun aligned the P3 reservation with the conditional recipe and strengthened partially-started-cluster cleanup; that final run passed in tool-reported 0.75 seconds. This wall time is process execution bookkeeping, not a performance result in the article.

`evidence/native-transcript.json` records every command, statement, SQLSTATE and result, server log and successful fast shutdown. `evidence/native-summary.json` records the readable assertions. The temporary cluster was removed. The checked protections have visible counterexamples:

- rollback: observer cannot see unfinished P7 change; rollback removes order and P3/P7 effects;
- saved-value stock writes: both 103/104 commit and stock 0, so the shop oversells;
- conditional P7 update: observer sees B waiting on Lock, then B gets no row after A commits; B rolls back; only103 remains, P3=10/P7=0/P9=4;
- statement/transaction snapshots: 1→0 at Read Committed versus 1→1 at Repeatable Read;
- write skew: both RR commits leave zero on duty;
- Serializable: B gets 40001 during UPDATE; the whole fresh decision reads 1 and keeps I2 on duty.

`verify-model.mjs` checks final figure outcomes and explanation coverage; it passed. It corroborates the bounded model's arithmetic, not PostgreSQL behaviour. Source hashes are in `evidence/source-hashes.json` and must be regenerated after any later author changes.

Primary sources checked 24 October 2026: PostgreSQL 18 transaction isolation, transaction tutorial, BEGIN, MVCC introduction, explicit row locks, serialization failure handling and CHECK-constraint scope. Links are listed in the article. No timings, regional behaviour, production capacity or other engine execution is claimed.

## Rendered author checks

Own integrated preview: `http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/`. Desktop 1280 × 720 with System resolving to dark was visually inspected. Both figures' every option/state was traversed (20 explanatory states total). Keyboard Enter stepping/back/reset, Play/Pause, Replay/Pause, manual stopping and end-state attributes were checked. Snapshot final RC/RR and instructor RR final drawings were visually inspected.

The browser download-event/path call hung for more than 22 minutes and required root interruption. After resumption the writer's IAB surface was unavailable. No viewport/theme changes had occurred. The writer explicitly released the lease, did not create a Chrome tab, and reported exact limits. Root accepted the remaining ordinary author rendered checks: 375 px light/dark, desktop light, Serializable rejection/retry visual states, phone keyboard focus/tab order, details alternatives and automatic timed advance. Reduced motion was not emulated. `evidence/render-checks.md` records actual checks and limits; root will append its owner receipt before freezing return.

Bounded direct HTTP verification of the served download passed: HTTP 200, 9,850 bytes, attachment/type/nosniff headers, exact byte equality to the final executed worksheet. See `evidence/download-check.json`.

## Limits and delivery

Article SQL is a transaction recipe with explicit application branch requirements, not a standalone checkout implementation. Worksheet is a reproducible mechanism demonstration on a single owned PostgreSQL process and deliberately chosen schedules. Figures are illustrative schedules and not an engine emulator. Root's required site build and independent reviews are separate; no claim is made that source/model/native checks establish teaching quality or publication approval.
