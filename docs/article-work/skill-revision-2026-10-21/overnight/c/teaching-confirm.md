# Teaching review · focused repair confirmation · a03 · C-02 / frozen A-r02

Started: 2026-10-21 21:18:42 UTC  
Ended: 2026-10-21 21:20:31 UTC  
Highest severity: none

## Inputs and actual scope

Applied the review skill and teaching perspective from `/private/tmp/staycurrent-skills-night-c/.agents/skills/staycurrent-review/`, as identified by `../c-frozen-manifest.json`. This was an informed repair confirmation, not an independent first reading or a whole-article judgement.

Read the a03 repaired passages, their preceding explanations and affected downstream uses: transaction boundaries and constraints; Figure 2 and its conditional-statement explanation; snapshots, locks and counted reservations; instructor departures, serialisable dependencies and restart; worksheet definition, barriers, execution instructions and results. Read the a00 transaction section and relevant introduction/example context to check the incoming knowledge and parent hand-off. Inspected the current rendered a03 at `http://127.0.0.1:4341/review/relational-trial-3/transactions/`; stepped Figure 2 through both options, reading every step and inspecting the summary's position beside the controls.

Context: canonical `docs/coverage/relational-2026-10-19.yaml` root/concurrency branch and nested locking brief; `docs/coverage/relational-example.md`; trial-3 `brief.md`; a03/a18/a19 registry entries. The historical rewrite commission was also read during input discovery, but supplied no additional obligations. The effective C skill governs this confirmation, rather than the original trial brief's superseded review schedule. No earlier reviews, decisions, repair narratives or final reports were consulted.

Calibration was limited to relevant reference passages: Sequence diagrams' opening progression and outbox explanation; Indexes' B-tree/range-scan and conditional-query examples; Storage and durability's row-version explanation. These support the checks of concrete state, first-use explanation and depth; no full-reference or whole-article calibration is claimed.

## Checks

| Teaching check | Result | Scope and observation |
| --- | --- | --- |
| Starting point | pass | Worksheet is defined at its first link; execution prerequisites precede its command. The count variation states capacity 2, R7 as the only reservation, and removal of the counter before using the count. |
| Order | pass | Atomicity is qualified immediately after rollback/savepoints; snapshots and locks precede the count example; conflicting instructor reads precede the predicate explanation and restart. |
| Examples | pass | Named people, request identities and local starting rows carry the awkward cases without changing their roles. |
| Showing | pass | Figure 2 exposes both pending actions and committed state; the count-before/after-wait table externalises the important snapshot difference; Figure 3 and its concrete read-dependency prose support the staffing case. |
| Judgement | pass within scope | The additions preserve the choice between a conditional row change, coordination and Serializable, and the distinction between transaction abort and a fresh business decision. |
| Gradual exposure | pass within scope | The parent supplies the single-row race. a03 gives the necessary mechanism and hands full changing-set protocols and detailed engine contracts to locking/isolation. |
| Placement of additions | pass | Each addition belongs in a03 and sits where its prerequisite or limit first matters; details do not displace the booking argument. |

## Accepted problems and pass conditions

| Problem | Result | Evidence and reader effect |
| --- | --- | --- |
| A13 · engine-specific rollback boundaries | pass | `a03.astro:49`: after explaining atomicity and savepoints, the passage identifies PostgreSQL sequence allocation and MySQL 8.4 `ALTER TABLE` as concrete exceptions to an overbroad rollback interpretation. It preserves the canonical plan's sequence/schema qualification without opening a migration tutorial. The main transaction-and-constraint argument then resumes. |
| A15 · worksheet prerequisite and counted-set starting state | pass | `a03.astro:68` defines the native worksheet as an executable PostgreSQL experiment when first linked. `a03.astro:83` explicitly establishes the local count model and its capacity/R7 state before Mina/Edda insertions; the table repeats that state. `a03.astro:142` gives tools, platform, extraction directory, command, port and `PG_BIN` information before execution is requested. A reader can follow the early evidence reference without running anything and meets practical requirements before acting. |
| A16 · concrete predicate/read-write tracking | pass | `a03.astro:95–103`: the rule, starting instructor rows and departure condition precede the two read/write dependencies. The predicate is then defined as available instructors for class 21, with new-row coverage and rejection rather than universal blocking. The complete restart reads one and declines departure. This is enough mechanism to justify the protection choice; deeper implementation remains with isolation. |
| Figure 2 · near-control causal summaries | pass | `model.mjs:63–67`, rendered under both options: steps 3–4 identify Mina's pending decrement/reservation and commit, alongside Tariq's stale intention or wait/recheck. The committed counter/reservation table stays separate from pending work. The summary appears directly above the controls and makes the state change intelligible even when the lanes have scrolled above the viewport. |

## New findings

None encountered in the checked passages, their surroundings or affected dependencies. These changes do not alter the overall reading order or invalidate a broader teaching judgement, so I found no reason to expand this confirmation to both complete articles.

## Limits

This report confirms teaching placement, prerequisites, examples and practical judgement within the stated repair scope. It does not replace the separate blind complete final reading, a full teaching review, specialist technical verification, or responsive/keyboard visual review. Native executions, downloads and engine documentation claims were not independently rerun or reverified. Figure 2's current text and controls were used; unchanged mechanics were not audited. No source edits, builds, servers, additional agents, commits or pushes were made; only this report was written.
