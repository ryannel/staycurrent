# a03 · round 2 local repair

Applied `staycurrent-revise` and `staycurrent-continuity` at the working `005ab6f` skill match. Scope: accepted **editorial-5** only. Coordinator owns review and the final build. No agents, review, commit or push.

## Inputs

Before reading the finding: whole current trial-3 a03, current figure/model and worksheet; a03 plan with parent/child context from the coverage tree and registry; canonical running example; a03-writing and round-1 a03-repair records; all three preserved reference articles in full including their source figure declarations, captions and explanations; finished a18/a19. README/site direction read. Then read r02 decisions and editorial-5. Earlier article/trial sources, components, records and reviews, and trial run/results were not opened. Historical paths inside allowed context records were not followed.

## Complete passage inventory

Only the final two sentences of the savepoint paragraph under “Keep ownership and the counter together” were replaced. The preceding savepoint definition and partial-rollback warning are unchanged. Replacement:

> Here R10 and R11 are supplied identifiers and the tables already exist. If you add number generation or table-definition changes, check the engine’s rollback rules: PostgreSQL’s number-generating sequences, for example, do not give back consumed numbers, even when the booking’s row changes roll back.

“Number-generating sequences” now links directly to PostgreSQL 18’s [Sequence Manipulation Functions](https://www.postgresql.org/docs/18/functions-sequence.html), rechecked during repair: aborted calls do not reclaim their consumed values. The supplied literal request IDs and pre-existing booking tables bound the exception; the booking’s row rollback remains clear. The plan’s engine-specific sequence/table-definition caution remains, conditional on changing the operation. No other prose passage, heading, figure, component, listing, protocol or download changed. Final source count: **4,149 words**, `wc -w`, **+9** from round1’s 4,140.

## Reread and continuity

Reread the entire final article in reading order, including contents, captions, controls, model step text, SQL and Sources, against the references. The local transition now resolves applicability before entering constraints; no further restructuring was needed.

Canonical complete term list: [round1 complete continuity ledger](../r01/a03-repair.md#complete-continuity-term-ledger). Audited every listed term against the current whole article and model; all unchanged rows remain applicable. Changed first-use detail: **sequence** remains in the savepoint paragraph, still explained at first use by “number-generating sequences”; it now follows the explicit explanation that R10/R11 are supplied. “Table-definition changes” means the existing tables would be changed and appears only as a conditional addition. No new unexplained technical term or earlier use introduced. Identifier/key/table vocabulary is inherited through the explicitly linked introduction and reminded beside the starting tables.

Full one-name/example audit confirmed: Mina/Tariq/Edda remain customers 1/2/3; Lena/Ravi instructors; classes21/22 retain canonical capacity/remaining1/1 and3/2, R7 belongs to Tariq, R10/R11 to Mina; R8/R9 and R13/R14 retain their roles. Independent figure resets and stated capacity2 count variation remain explicit. Rejected requests do not become accepted within the same experiment. Finished-child discrepancies remain outside scope and were not copied.

## Verification and cleanup

Ran the existing, unchanged `src/components/relational-trial-3/a03/verify.py` **once**, port **56520**, on a newly created native **PostgreSQL 18.6** cluster and database `a03_trial`. Exit0: all hostile counterexamples and protected outcomes passed; load1 accepted/19 declined. Evidence: [native transcript](a03-repair-native-56520.json). It records real server Lock waits, version/settings and successful fast shutdown. Verified the disposable cluster parent directory no longer exists after the script’s session/server cleanup. No application database contacted. The repair changes no executable claim, so no new test added. Focused `git diff --check` passed. Figures were untouched; responsive/theme/playback audits were not repeated. No worker build run.

## Timing and source freeze

First explicit clock/start: **2026-10-21 20:01:44 UTC** (the initial skill-read call preceded it). Completion below includes record writing and verified native cleanup. Source and evidence are final; no later source edits.

Recorded completion: **2026-10-21 20:03:51 UTC**; elapsed from recorded start: **127 seconds**. **FREEZE** after completing this record.
