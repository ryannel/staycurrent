# A · a03 repair r02

First recorded worker clock/start: **2026-10-21 21:02:21 UTC**; assignment and initial reading preceded this clock, so exact dispatch time is unavailable. End: **2026-10-21 21:05:20 UTC**; recorded interval **2 minutes 59 seconds**. Candidate-A installed revision, continuity and figures skills applied. No build, preview server, review team, native-engine rerun, commit or push.

Read the complete current article before repair, its a03/parent/neighbour context and plan, canonical example, commission and initial writing/evidence record, current decisions, and relevant current figure/stepper sources. Consulted the prior repair record for continuity/evidence applicability and revisited the sequence reference's figure interpretation. Reread the complete article, contents, listings, captions, controls and model steps after the changes.

| Issue | Repair |
| --- | --- |
| A13 | Added one transaction-boundary paragraph after the booking/savepoint explanation: ordinary transactional table changes roll back, PostgreSQL sequence numbers allocated by aborted work are not reclaimed, and MySQL 8.4 `ALTER TABLE` commits preceding work. Each qualification states its consequence for a booking. The savepoint paragraph remains about the booking's decrement and insert; no detached savepoint aside or deeper identity/migration procedure was added. Sources identify the two primary contracts. |
| A14 | Figure 2 steps 3/4 now explain both Mina and Tariq beside the controls, in both modes. Guarded step 3 explicitly says Mina's decrement/R8 are pending while committed remaining stays 1 and Tariq waits. Step 4 says Mina commits, remaining becomes 0, and Tariq's waiting UPDATE rechecks that committed row and finds its condition false. Stale-mode summaries explicitly retain Tariq's earlier decision. No component, control, CSS, state value or outcome changed. |
| A15 | First worksheet mention now links the download and identifies an executable PostgreSQL experiment. The counted-set variation locally states removal of the counter, capacity 2 and R7 as the sole starting booking; it no longer depends on a statement elsewhere. Removed the redundant “In our worksheet it did” interruption. |
| A16 | Replaced the abstract dependency/predicate compression with Lena reading Ravi available and each departure changing what the other read. The predicate is defined through the available-instructor count, including a new row's effect. The distinction between rejection by checking and universal insertion blocking remains explicit. |

No passage was restructured beyond these findings. Article whitespace word count is **4,381**, previously **4,245**. No example/tree extension or cross-article change.

## Verification and pending render

[Source/model/bundle receipt](a03-evidence/r02-source-checks.json) records:

- `node src/components/relational-trial-3/a03/check-model.mjs`: passed canonical rows and all six model outcomes.
- Compared current module against the prior downloadable module: customer/class/reservation/instructor data, schema/seed, all three SQL listings and every frame's non-explanation fields are identical across all six options. Shared example and verifier bytes also match. The applicable [PostgreSQL 18.6 native receipt](a03-evidence/native-56700.json), plus existing [identity-failure](a03-evidence/identity-failure.json) and [adversarial](a03-evidence/adversarial.json) receipts, therefore remain applicable to those unchanged claims. No new engine execution is represented.
- Checked both Figure 2 modes' changed step 3/4 states directly. Calculated continuous-playback holds from the unchanged shared stepper and leaf texts: guarded **9,705 / 9,750 ms**, stale **8,895 / 7,995 ms**. Starting Play manually from those steps uses explanation-only holds: guarded **7,095 / 7,500 ms**, stale **5,970 / 5,970 ms**. These are source calculations, not browser timer observations.
- Regenerated the ZIP with exactly `example.mjs`, `a03/model.mjs`, `a03/verify.py`, each byte-identical to current source, preserving the import layout. Extracted module import and Python syntax passed. ZIP SHA-256: `919c51237d08f990306690d646b963ce124e4c6be2ad4b754621d0bedeee64da`.

**Pending:** coordinator build/freeze, current rendered prose/links, Figure 2 both modes through changed steps 3/4 at 375 px in light/dark, keyboard stepping and actual Play/hold observation. The static 4341 preview still serves A-r01; it was not opened or used to claim repaired rendering. Existing colour/control implementation receipts establish only unchanged mechanics, not this text's current readability. No foreground-animation or layout pass is claimed.

Primary documentation checked afresh: PostgreSQL 18 [sequence functions](https://www.postgresql.org/docs/18/functions-sequence.html), caution on unreclaimed `nextval` values; [transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html), Read Committed rechecks and Serializable read/write tracking including predicate locks; MySQL 8.4 [implicit commits](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html), schema commands ending preceding work. These are documentation-supported qualifications, not newly observed MySQL or sequence executions.

## Continuity delta and capture

Baseline: [initial term ledger](../../../relational-skill-trial-3/a03-writing.md#continuity-term-ledger), updated by [r01 repair](repair-a03.md#continuity-ledger-delta), against the [canonical example](../../../../coverage/relational-example.md). Full reading-order audit repeated, including figure text alternatives and step text; unchanged ledger entries are not copied.

- **Sequence** returns at its first use as “number-generating sequences”; allocation/abort consequence is explained there. `ALTER TABLE` is introduced as a schema-changing command; “implicitly commits” immediately states why later rollback cannot undo preceding booking work.
- **Native worksheet** first appears as a linked downloadable executable experiment. Later worksheet, barriers, observer and fixture uses refer to that same artefact.
- **Predicate** is defined at first use as a condition selecting rows, then concretely as available instructors for class 21. Read/write tracking is explained before the later “dependency checking” wording.
- Pending versus committed work remains explicit throughout both changed modes. No lane/table state changes; no R9 appears in the guarded result. Mina/Tariq/Edda remain customers 1/2/3; Lena/Ravi instructors. Class 22's local capacity-2 variation and R7/R13/R14 ownership match the record. No other first-use/name/example issue found in the complete audit.

Changed source copies are byte-identical under [artifacts/a-r02](../artifacts/a-r02/src/articles/relational-trial-3/a03.astro), preserving all source-relative paths: article, model and refreshed ZIP only. Article SHA-256 `4566247f157d95f800329e176138b2446db5d47ab9900f511c74bfb0e32269bf`; model SHA-256 `deb608b9e8a9a75a0523283c7b2a8e3cbf96fdf2373c85b7395e9e7728360e46`. The receipt records these hashes and the bundle hash. The coordinator owns final rendered acceptance and fresh full round 3.
