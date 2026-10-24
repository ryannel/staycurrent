# Teaching review · article mode · r36, r37, r38, r39, r43 · batch09-v01

Inputs read: [fixed manifest](v01/manifest.json) and teaching restrictions; frozen briefs and bounded individual plans RL115, RL116, RL117, RL118 and RL122 in full, including child/owner boundaries. Commission hash matches the earlier read. Canonical example changes from batch08 were read (E1–E8 status correction and fixed search/vector variant); all unchanged shared facts retain their earlier completed read. Full rendered pieces at http://127.0.0.1:4502/review/relational-collection/postgresql/{recovery,backup-and-restore,replication,logical-replication,upgrades}/, all explanatory disclosures and final Sources outside the article.

Highest severity: none

## Calibration


This coherent 25-piece assignment calibrated once against all three fixed references in full. The helper `scripts/read-writing-reference.py` delivered exactly 19 separate bounded text outputs: sequences 1–6, indexes 1–7, storage 1–6. Every individual call had a 5,000-token output budget and its END marker was read; none was clipped. Complete-text SHA256: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Separate rendered study at http://127.0.0.1:4350/review/examples/ covered all 34 drawings and their explanations: sequences figures 1–13, indexes 1–11, storage 1–10. Actual changing/completed states were inspected. A mispositioned tall screenshot crop was recovered with bounded crops; the long crowded sequence drawing's lower portion was read separately. No global viewport or theme changes. Root received the complete calibration report for public-output audit. The comparison standard is explanatory progression through concrete changing state, controlled variations and awkward cases, and practical judgement supported by the mechanism, with illustrative/observed boundaries explicit.

## r36 · PostgreSQL WAL, checkpoints and durability

Entry: General crash recovery and PostgreSQL architecture.

Whole article: Inserted, written, flushed and checkpoint/redo positions are kept distinct through settings, observation and the native crash drill. The final tested-promise assessment follows from those distinctions rather than equating successful restart with power-loss safety.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | LSN format and three progress functions are explained; synchronous levels, full-page protection and checkpoint controls are assigned exact responsibilities. |
| 2. Order | pass | Local positions → acknowledgement modes → redo/checkpoint boundary → counters and tuning → accountable crash → evidence limits. |
| 3. Examples | pass | Purchase 103 carries logged recovery; unlogged and unfinished scratch rows provide distinct counterexamples; off path is explicitly conceptual. |
| 4. Showing | pass | Three-position figure/two-path alternative, backwards checkpoint diagram, observation table, annotated restart log and full purchase acceptance table show the important states. |
| 5. Judgement | pass | Reader can interpret local progress/counters, choose loss promises, separate checkpoint and flush costs and specify what their recovery drill did establish. |
| 6. Gradual exposure | pass | General recovery prerequisite is developed into PostgreSQL controls without redoing backup or remote acknowledgement procedures; both have clear hand-offs. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r37 · Restoring PostgreSQL to a recovery target

Entry: General backup reasoning and PostgreSQL WAL.

Whole article: One alternative class history earns the chain, exclusive target, closed source, once-only capacity reconciliation and acceptance. The missing-segment failure and admission race make the operational conditions concrete.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Cluster, base consistency, archive command contract, target placeholders/inclusivity, timeline, recovery signal/pause and gate protocol are explained locally. |
| 2. Order | pass | Base/continuation → durable archive → target proof → isolated restore → source closure → complete reconciliation → service/retention obligations. |
| 3. Examples | pass | S503 mistake and valid B203 carry full capacity state; missing required WAL, boundary request and repeated/conflicting request payload supply awkward cases. |
| 4. Showing | pass | Command/configuration shapes, target log, six-step history alternative and capacity/remaining/B203 table show both correct restoration and the valid work it excludes. |
| 5. Judgement | pass | Reader can preserve a usable chain, verify exclusion by actual state, close all writers before enumeration and accept booking plus single decrement without assuming external reversal. |
| 6. Gradual exposure | pass | Concrete full-base/XID procedure is complete at its promised mechanism level; incremental success, standby promotion and major migration remain explicit separate scopes. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r38 · PostgreSQL physical replicas and promotion

Entry: General replication, failover and PostgreSQL WAL.

Whole article: The distinction between receipt and visibility leads into configured synchronous waits, retention and a fenced promotion. Known scratch loss and fresh-base rejoin make the limits of promotion and return inspectable.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Physical seed, standby signal, sender/receiver positions, actual durable receive function, synchronous selection and promotion/rejoin roles are explained. |
| 2. Order | pass | Compatible base → progress evidence → remote boundary → retained history/read conflict → fence/candidate acceptance → former-primary return. |
| 3. Examples | pass | Complete purchase 103 carries paused replay and on/remote_apply; separate local-only scratch tail demonstrates real unavailable history without rewriting purchase facts. |
| 4. Showing | pass | Native progress values, acknowledgement figure/full alternative, SyncRep result and known-tail/rejoin outcomes show both success and excluded history. |
| 5. Judgement | pass | Reader can choose the actual remote wait/candidate, monitor the right gap, fence before promotion and distinguish rejoining from merging divergent work. |
| 6. Gradual exposure | pass | Native physical operation is developed from its general entry; application routing, PITR, logical streams and broader fencing retain their neighbouring owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r39 · PostgreSQL logical replication and change feeds

Entry: General replicas, physical replication distinctions and constraints.

Whole article: Row identity, stream scope, schema, sequences, conflicts and retention are successive responsibilities of one selective copy. The final effect/checkpoint problem follows naturally when the destination is an external consumer.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Publication/subscription, decoding/apply, initial ready state and replica identity are introduced before failure cases; row identity stays distinct from request/effect identity. |
| 2. Order | pass | Existing schema/initial copy → old-row matching → scope → missing schema/sequence → apply conflict → slot lifecycle → external effect. |
| 3. Examples | pass | P7 scratch update anchors the catalogue; anonymous identity, note-column, row-2 conflict and sequence fixtures expose insert-only success and failed continuation. |
| 4. Showing | pass | Identity comparison/full cases, concrete source/apply failures and duplicate/default-to-ID-3 table show why a running copy is insufficient acceptance. |
| 5. Judgement | pass | Reader can configure the intended row stream, test updates/deletes after initial copy, prepare unreplicated state, repair rather than casually skip history, and own slot/effect lifecycles. |
| 6. Gradual exposure | pass | Selective replication contract stands on its entry; full migration cutover and durable application-event delivery are handed onward with their unanswered responsibilities named. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r43 · Upgrading and migrating PostgreSQL

Entry: Backups, logical replication, schema compatibility and authority fencing.

Whole article: Transfer choice, compatibility and write authority stay connected through a copy-mode rehearsal. Separate physical and business-history return boundaries give a useful practical judgement beyond a conversion command.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Minor/major transfer, dump/upgrade/logical routes, copy/clone/link/swap and preflight/checksum compatibility are explained before their return implications. |
| 2. Order | pass | Transfer goal → application/environment compatibility → exact mode rehearsal → closed source → isolated acceptance → new-write return boundary → restored protection. |
| 3. Examples | pass | Fixed shop snapshot supplies meaningful acceptance totals; checksum mismatch, admission race and before-upgrade/after-cutover probes expose awkward failure and return cases. |
| 4. Showing | pass | Route comparison, pg_upgrade command shape, still-due result table and two-history figure/full alternative show compatible data and newly missing work separately. |
| 5. Judgement | pass | Reader can choose/rehearse a route, inventory relevant dependencies, accept actual application work, distinguish two rollback boundaries and restore backup/replica protection. |
| 6. Gradual exposure | pass | Owns PostgreSQL major handover and return; extension-specific and logical-stream mechanisms are taken from their prerequisite owners without pretending the executed copy drill proves every route. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## Limits

Fresh independent initial teaching perspective only, for the exact first-return versions named above. This is not corpus, final complete or any other perspective coverage. Source, mechanical/native receipts, writer notes, earlier reports/decisions and later versions were withheld. No builds, article edits, downloads or publication. Complete rendered text, all explanatory disclosures and final Sources outside the article were read. No claim of independent native execution or production verification. No global viewport/theme changes.
