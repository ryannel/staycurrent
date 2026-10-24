# Practitioner review · informed repair confirmation · r36, r37, r39, r43 · v02

Highest severity: none.

This is the assigned fresh, informed confirmation of repairs, their complete surrounding articles and affected dependencies. It supplies neither blind final-practitioner coverage nor corpus credit. All five practitioner checks were applied to each current piece. No earlier article version, peer report, quality verdict or author teaching note was read. No delegation, product edit, build, native rerun, browser action, commit, push or publication was performed.

## Exact inputs and method

The fixed input is [v02/manifest.json](v02/manifest.json), version `repair-batch09-v02`, frozen `2026-10-24T07:03:47.519304+00:00`, manifest SHA-256 `f94714f4e59625e6b56ca7b57ca97b675e2fd5b35102aaabdec762bc9b630084`. Independently recomputing the hashes found **147/147 matching files**. Read the complete frozen article sources, imported figure/state explanations, captions, tables, code and disclosures; the supplied briefs, commission, shared example, relevant parent/sibling/child plans; and applicable mechanical source, environment, result and log records. Reference calibration used the fixed Storage and durability passages on WAL ordering, page writers, process versus power loss, recovery and provenance, and Indexes' measurement-provenance passage. No reference quality verdict was used.

The exact manifest routes below returned HTTP 200. Their complete bounded response bytes equalled the corresponding files in `/private/tmp/staycurrent-relational-batch09-10-v02-final-author`. Built text was extracted including the separate final sources disclosure outside the article element; current additions were checked against that text and the complete frozen source. Each actual `download` href was independently fetched as bounded HTTP bytes and matched the frozen script. This establishes served-byte identity, **not browser saving or visual/control confirmation**.

| Piece | Exact route after `http://127.0.0.1:4548/review/relational-collection/` | HTML SHA-256 |
| --- | --- | --- |
| r36 | `postgresql/recovery/` | `92665d7cabca76056a709729570dbd95c10e6e249cbe670fb44337c3e715aa4f` |
| r37 | `postgresql/backup-and-restore/` | `050836295806a9e2deb66cca1258eccb038d184a72fb40c4a74e568358d3ab67` |
| r39 | `postgresql/logical-replication/` | `499b3d0dde6b860e83febc8960af970ecce98ae719e2cf029d4e810a2ce34b8f` |
| r43 | `postgresql/upgrades/` | `67edcbfb93bddf9a70afdbc4fcc4e1b0a0ba293b2df8bdde6838ca00604e32c2` |

## r36 · PostgreSQL WAL, checkpoints and durability

| Check | Result | Applied check and conclusion |
| --- | --- | --- |
| Correctness | pass | Checked insertion/write/flush distinctions against [administration functions](https://www.postgresql.org/docs/18/functions-admin.html), commit settings against [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html), checkpoint work against [WAL configuration](https://www.postgresql.org/docs/18/wal-configuration.html), and observation fields/reset boundaries against [statistics](https://www.postgresql.org/docs/18/monitoring-stats.html). The four question records retain their different questions, observations and interpretations. Requested checkpoints are not silently equated with size-driven ones; elapsed checkpoint write time is not called active device time. |
| Evidence | pass, qualified reuse | The chosen WAL cuts remain explicitly illustrative. The observed synchronous purchase, unfinished insert and unlogged-row results match the supplied PostgreSQL 18.6 verifier/results/log. Independently confirmed that the final download differs from the executed preceding verifier only by creating `evidence/`; no exact-final-script native run is credited. |
| Coverage | pass | The opening still gives the purchase's acceptance state. Commit acknowledgement, checkpoint/redo, diagnostic intervals, retained WAL, unlogged data and the process/host/storage boundary remain connected. The observation restructuring loses no operational meaning. |
| Depth, both ways | pass | Each counter answers a tuning question; the article does not require an extra internal-consistency assertion to explain its starting state. The distinction between data-page writes and commit durability remains sufficient without expanding into an engine-internals survey. |
| Ownership | pass | RL95/RL110 provide the general recovery/architecture entry; r36 owns the PostgreSQL settings and local crash drill. Backup recovery and remote acknowledgement still go to RL116/RL117. Neither the new records nor the shorter opening takes over those subjects. |

Assigned-problem result: **technical preservation confirmed**. All four phone question groups retain the desktop comparison's meaning: log generation; checkpoint causes; elapsed write/sync/total; and which process writes buffers. Captions, surrounding baseline/reset advice, and downstream tuning advice agree. Phone readability itself requires the separate visual confirmation.

## r37 · Restoring PostgreSQL to a recovery target

| Check | Result | Applied check and conclusion |
| --- | --- | --- |
| Correctness | pass | Checked base/WAL/archive/timeline responsibilities against [continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html), manifest limits against [pg_verifybackup](https://www.postgresql.org/docs/18/app-pgverifybackup.html), and exclusive XID/pause/resume semantics against the [recovery targets](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET). Checked the gate's shared-lock/update dependency and post-wait row under [locking](https://www.postgresql.org/docs/18/explicit-locking.html) and [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html). The changed capacity example now follows E6 throughout. |
| Evidence | pass | Challenged the **fresh changed verifier**, data, environment, exact served download and results together; details below. XID 753 and missing segment `000000010000000000000003` come from this fresh run's logs, not an inherited first-version result. Scenario times are labels. |
| Coverage | pass | The full base/archive route includes a failed missing-segment candidate, target acceptance, admitted/racing work, closed-source enumeration, stable identity and payload conflict, complete booking/decrement reconciliation, external-effect limits and authority transfer. Successful startup alone is never acceptance. |
| Depth, both ways | pass | A serial isolated reconciliation is explicitly bounded; it does not present the small helper as a concurrent universal idempotency algorithm. The archive heading now states the actual success contract. Incremental backup and service objectives retain useful guidance without an unperformed incremental or RTO claim. |
| Ownership | pass | RL96 supplies general backup/reconciliation judgement, r36 supplies PostgreSQL WAL, and r37 supplies native PITR. Physical promotion and major-version migration remain with RL117/RL122. The revised booking history does not alter the shop snapshot or the independent S501/S502 examples. |

Assigned-problem result: **confirmed**. Source, prose, execution table, complete six-state figure, textual alternative, reconciliation and final acceptance consistently describe: start `S503|3|3`; mistake `30|3`; source after B203 `30|2`; exclusive restored target `3|3` without B203/request; first/repeated reconciliation `3|2` with exactly one booking. The wording retains the difference between remaining capacity and total capacity.

Fresh evidence applicability:

- The frozen reader download, `mechanical/r37/restore-drill.py` and HTTP download share SHA-256 `f1d8a0f8ce1a63f2b23fa59bd92879a1e4b220256cef7d6e8409f149804dd822`. The result records that same verifier hash. Result SHA-256 is `10cf1d4790701a05092737e7c54546a14fa7b9250291b6aa23a41dd5e90dac9e`.
- Read the actual SQL and control flow rather than relying on the applicability assertion: the mistake updates **capacity only** to 30; `book` takes `FOR SHARE` on the gate; the closing update is held while a request waits; accepted identities are enumerated after closure; the source is stopped before either saved-base restoration. The booking helper decrements remaining capacity and records booking/request in one transaction; its repeat returns `existing` before a further decrement.
- Recorded environment: PostgreSQL 18.6 Homebrew; unique `/private/tmp/sc-b09v02-r37-3e2ddjkx`; private socket; no TCP listener; source/candidate ports 55437/55438. The verifier clears `PG*` from its **actual process** before constructing child environments and checks owned data directory, port, role and listener before mutations. Both results and applicability record this. The archive helper compares repeated content, flushes the file and directory, and rejects differing bytes. One-host storage remains the explicit limit.
- Candidate log names XID 753, restores segment `…003`, stops before that commit and pauses. Missing-chain log names the absent same segment and ends with `recovery ended before configured recovery target was reached`. The successful target queries show recovery true, session `3|3`, zero bookings and zero requests. Results then show `created`, `existing`, payload conflict, final B203/Edda/request identity and gate closed. The fresh cleanup record reports no remaining root, consistent with the verifier's owned cleanup path.

No concrete unresolved mechanism justified a new native instance. This is independent scrutiny of supplied fresh evidence, not an independent execution claim.

## r39 · PostgreSQL logical replication and change feeds

| Check | Result | Applied check and conclusion |
| --- | --- | --- |
| Correctness | pass | [Publication/replica-identity documentation](https://www.postgresql.org/docs/18/logical-replication-publication.html) supports the publisher refusal and FULL fallback. [Restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) support schema/sequence responsibilities and FULL datatype limits; [conflicts](https://www.postgresql.org/docs/18/logical-replication-conflicts.html) distinguishes stopping insert conflicts from skipped missing-row changes. The repaired tables do not imply a successful source update in the refusal case. |
| Evidence | pass, qualified reuse | Download/verifier hash remains `fa6104f3e6bf1a7ea8353d70e43e9e81e46af933e4834e9cd4e092c9c2ef4daa`; the supplied PostgreSQL 18.6 pair's source, fixture, results and logs apply to unchanged identity-key/schema/sequence/conflict/slot mechanisms. FULL remains documented, not natively demonstrated. |
| Coverage | pass | Old-row identity is distinguished from request identity. Initial copy readiness, selection, schema, sequences, local writes, skipped changes, monitoring, retention, cleanup and consumer effects still supply the promised operational judgement. |
| Depth, both ways | pass | Explicit field headings replace tuple decoding without adding a packet-format lesson. The figure calls itself conceptual, and the text does not imply that the displayed fields exhaust an actual protocol packet. No required explanation is lost. |
| Ownership | pass | r39 owns selective row-stream identity/lifecycle; RL117 retains physical copying, RL94 external event delivery and RL122 migration cutover. Its isolated P7 scratch change remains separate from the dated catalogue history and agreed order price. |

Assigned-problem result: **confirmed**. Publisher caption is `Attempted source update`, with `Before` and `Requested` rows naming `row_no` and `value`. The no-identity state explicitly says the source remains `before`, no update message is sent, the new-values field is absent because the source update was refused, and the subscriber remains `before`. Key mode matches old `row_no = 1`; FULL matches old `row_no = 1; value = before`, with requested new values separately named. All three state arrays and the complete text alternative agree with the article and native fixture. No newly claimed FULL execution was introduced.

## r43 · Upgrading and migrating PostgreSQL

| Check | Result | Applied check and conclusion |
| --- | --- | --- |
| Correctness | pass | Checked mode/preflight/compatibility/return/statistics claims against [pg_upgrade](https://www.postgresql.org/docs/18/pgupgrade.html). The complete account separates old-file usability from target-only accepted history; opening the new authority remains a separate acceptance step. |
| Evidence | pass, qualified reuse | Exact download hash `b675ecf2412d77da8cb198385a6d66ac1717841290b9e8f3f82f0068d23ac541` matches retained native source. The supplied 17.6→18.6 copy-mode results and logs support checksum rejection, compatible conversion, fence race, shop/report equality, pre-acceptance rejection and the absent `after-cutover` probe on the preserved old copy. Other modes and production downtime remain unclaimed. |
| Coverage | pass | Route choice, compatibility, extension/collation considerations, enforced source closure, acceptance, new writes, return and restoring protection remain present. Anonymous probes add authority evidence without inventing purchase history. |
| Depth, both ways | pass | The revised opening gives the actual starting rows and purpose of the scratch probes. It preserves the two return boundaries without an internal process assurance or another upgrade internals explanation. |
| Ownership | pass | The article builds on RL116/RL118/RL119/RL98 for backup, row streams, compatible schema and fencing, then owns version-transfer choice and return. It refers deeper mechanisms rather than duplicating them. |

Assigned-problem result: **confirmed**. The opening's products and order states match the native SQL and before/after evidence. The complete return figure keeps the old gate closed in both states; the new probe changes history even when original shop rows compare equal. The surrounding text, separate final sources and native limits remain consistent.

## Findings and limits

No new practitioner finding. Supplied next finding number 1 remains unused for each piece.

Retained evidence was checked for current applicability rather than rerun ceremonially. r36 retains the precise one-line verifier qualification above; r39 and r43 retain exact unchanged scripts, fixture SQL, versions and local result scope. This confirmation did not test power loss, lost storage, offsite recovery, live service completeness, external effects, production timings or browser saving. No owned server or browser resource was created. Current phone geometry, reading comfort, control use, theme appearance and visual pass conditions remain for the separately assigned visual reviewer. This report does not certify publication or replace the required independent complete checks.
