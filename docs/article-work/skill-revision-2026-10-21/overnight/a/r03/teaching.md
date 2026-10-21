# Teaching review · article · a00 and a03 · A-r02, round 3

Started UTC: 2026-10-21 21:09:34 UTC  
Ended UTC: 2026-10-21 21:12:56 UTC

Inputs read: the installed [review skill](/private/tmp/staycurrent-skills-night-a-repair/.agents/skills/staycurrent-review/SKILL.md) and [teaching perspective](/private/tmp/staycurrent-skills-night-a-repair/.agents/skills/staycurrent-review/perspectives/teaching.md); [A-r02 fixed manifest](/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/a/repaired-r02-manifest.json) and its inherited manifest; complete [a00](/private/tmp/staycurrent-skills-night-a-repair/src/articles/relational-trial-3/a00.astro) and [a03](/private/tmp/staycurrent-skills-night-a-repair/src/articles/relational-trial-3/a03.astro), their rendered pages and figure text, and their teaching-model data and steps. All four changed-file hashes in the A-r02 manifest match the archived files. Read all three fixed reference articles in full, including the rendered figures' text alternatives and controls: [Sequence diagrams](http://127.0.0.1:4341/review/examples/sequences/), [Indexes](http://127.0.0.1:4341/review/examples/indexes/) and [Storage and durability](http://127.0.0.1:4341/review/examples/storage/). Context: archived [current coverage tree](/private/tmp/staycurrent-skills-night-a-repair/docs/coverage/relational-2026-10-19.yaml), root/concurrency plans and related parent, sibling and child scopes; [running example](/private/tmp/staycurrent-skills-night-a-repair/docs/coverage/relational-example.md); current registry through `src/lib/relational-next.ts`; trial commission and brief. The current coverage tree governs scope where the registry retains earlier wording. No earlier reports, findings, repair narratives, decisions or coordinator verdicts were read. The workspace's different article sources and plans were not read.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | a00 introduces tables, identity, constraints and SQL before relying on them; a03 recaps its precise prerequisites and introduces invariant, snapshot, lock, serialisability and retry terms through their examples. |
| 2. Order | pass | The order walkthrough supplies the first model; a03 moves from atomicity and the stale decision to conditional protection, visibility, multi-row dependencies, abort handling and executable testing. |
| 3. Examples | pass | The shop persists across both pieces; the class extension states its correspondence, identifiers and reset conditions, then reaches double clicks, competing bookings, empty/changing sets, write skew and unknown outcomes. |
| 4. Showing | pass | Connected rows, join multiplication, competing transaction lanes and the count-after-wait table make the difficult state changes inspectable; the worksheet's ordered barriers show how to test the argument. |
| 5. Judgement | pass | a00 supports a defensible first shortlist and next question; a03 lets the reader distinguish one-row conditions, unique claims and multi-row decisions, with participation and restart obligations. |
| 6. Gradual exposure | pass | Each parent gives a usable answer before its links; detailed locking protocols, engine isolation analysis, request recovery, physical recovery and external delivery retain their owning branches. |
| 7. Placement of additions | pass | All six nominated additions belong in their current pieces and appear where the preceding argument creates the need; observations follow. |

### Placement observations

- **Transaction-boundary qualification after savepoints, a03.** Belongs in this article: it bounds the rollback promise just taught. Sequences and implicit schema commits are explained as exceptions to that boundary, without taking over schema migration or storage mechanisms. The placement directly after partial rollback is coherent.
- **Executable worksheet at first mention, a03.** Belongs beside the first native observation, because the reader needs to know what kind of evidence “worksheet” means. Calling it an executable PostgreSQL experiment resolves that immediately; installation and execution remain together in the testing section.
- **Local counted-set setup, a03.** Belongs immediately before the locking counterexample. Removing the counter and explicitly giving capacity 2 with only R7 prevents the reader from carrying the earlier capacity-3 fixture into this variation. The parent teaches why locking returned rows fails and why a fresh command matters, then hands the complete protocol to locking.
- **Predicate explanation, a03.** Belongs where the instructor dependency is generalised from named existing rows to a selecting condition and a possible new row. Its distinction between dependency checking and making inserts wait develops the isolation decision already in progress; deeper engine analysis remains with isolation.
- **Figure 2 control-adjacent summaries, a03.** Belong with the figure. The text alternative contrasts the stale overwrite and conditional outcomes using the same class and requests; the surrounding prose first selects the unsafe option, then later explicitly selects the repaired option. They support inspection without adding a second lesson.
- **Distributed shortlist description, a00.** Belongs in the root's commissioned comparison of deployment shapes. Earlier paragraphs have introduced replicas, divided write ownership and cross-owner coordination. The shortlist now ties the distributed candidate to a demonstrated write or failure-survival requirement and comparison with a server arrangement; placement, delays and cost become validation questions without importing the distribution branch's mechanisms.

## Findings

None at any severity. No finding identifiers were consumed; `teaching-3` remains the next available identifier.

## Limits

This was a full teaching review of both fixed pieces under candidate A's seven checks, not a scoped repair check or a substitute policy. Rendered pages were read at port 4341; a03's three figure text disclosures were expanded, and complete article model steps were read. The reference figures were read through their rendered text alternatives, labels and controls. I did not independently replay every control state, audit visual layout at multiple sizes, execute the native worksheet, rerun builds, or reverify every technical claim against external documentation. Those are not claimed as teaching evidence here. No source edits, builds, servers, agents, commits or pushes were performed; only this report was written.
