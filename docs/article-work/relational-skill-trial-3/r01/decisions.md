# Round1 decisions · 80276a4

Floor: **low** — repair critical, medium and low. Four independent full reports are complete. Practitioner reports no findings. All eight reported findings are accepted; two labels identify one figure defect, giving seven distinct repair problems. No finding is below this round’s floor. No earlier trial reports informed these decisions.

| Finding | Reviewer severity | Coordinator severity | Piece | Decision and reason |
| --- | --- | --- | --- | --- |
| teaching-1 | medium | medium | a00 | Accept. Newcomer must infer an undisplayed schema; retain medium. |
| teaching-2 | medium | medium | a03 | Accept. Reader must animate changing state to justify the fresh-command rule; retain medium. |
| editorial-1 | medium | medium | a00 | Accept. Premature term and attached qualification force rereading; retain medium. |
| editorial-2 | medium | critical | a03 | Accept. Raise to critical: the figure contradicts its fixed request labels and prose, rather than merely needing smoother wording. |
| editorial-3 | low | low | a00, a03 | Accept. Meaning is recoverable without stalling; retain low. |
| editorial-4 | low | low | a00 | Accept. Small improvement to otherwise followable openings; retain low. |
| visual-1 | medium | critical | a03 | Accept. Raise to critical under the explicit rule for a figure contradicting its own text. Same problem as editorial-2; one repair satisfies both. |
| visual-2 | low | low | a00 | Accept. The fields are accessible and no page overflow occurs; retain low. |

## Fresh-writer repair assignments

Each reviser first reads the whole current article, plan context, canonical example and its writing/evidence record, then these accepted problems. Apply staycurrent-revise at005ab6f and its full finish/continuity/figure/native checks. Preserve the argument; changes stay proportionate to the finding. No earlier live/trial article, component, review or record is authorised. No coordinator prose edits.

### a00

Repair teaching-1, editorial-1, editorial-3 (a00 part), editorial-4 and visual-2 together. The problems are the unshown column mapping, premature caption qualification, editorial ownership wording, directive openings and phone scrolling cue. Give insert values explicit, comprehensible column identities; keep the caption about its displayed data; make the reading links and openings useful to the reader; expose the scroll affordance. These describe problems and outcomes, not required wording. No section rebuild is warranted by these medium/low findings. Rerun verification on a new disposable cluster/port56310, incrementing if another invocation is needed.

### a03

Repair teaching-2, editorial-2/visual-1 and editorial-3 (a03 part) together. Keep each request’s work in its own lane at every Figure1 step. Show the snapshot/lock-wait causal sequence compactly where the reader needs it, without duplicating the locking child’s complete protocol. Make the linked-reading explanation reader-facing. A new displayed schedule must agree with native execution: verify any newly claimed same-command count behaviour with an adversarial case rather than relying on an existing passing fresh-command test. Refresh the worksheet archive after source changes. New disposable PostgreSQL18.6 cluster/database and port56320 per first invocation, incrementing later.

## Assignment times

| Perspective | Start UTC | End UTC | Duration |
| --- | --- | --- | --- |
| Practitioner | 19:24:06 | 19:27:50 | 224.6s |
| Teaching | 19:24:15 | 19:29:02 | 287s |
| Visual | 19:24:26 | 19:31:50 | 444s |
| Editorial | 19:28:11 | 19:32:39 | 268s |

Initial review counts by coordinator severity: **2 critical, 3 medium, 3 low** reported labels; **1 critical, 3 medium, 3 low** distinct problems. The critical labels are duplicate observations of the same misattributed request lane.

The coordinator will compare the returned changes with every accepted finding, record repair outcomes and both word counts, build and commit the round. Confirmation by fresh independent reviewers belongs to round2.

## Coordinator confirmation after repair

The coordinator compared the entire scoped change with every accepted problem. No article prose was changed by the coordinator.

| Finding | Returned repair and confirmation |
| --- | --- |
| teaching-1 | Both inserts now name columns, including placed_at, and the transaction lead-in explains INSERT/VALUES/RETURNING. Native verification uses the same exported listing and passes. |
| teaching-2 | The read/lock section now shows the 1→0 versus1→1 read comparison, the exact combined locking/count SQL, and the stale1/fresh2 lock-wait history. The new adversarial native test imports that SQL and confirms the real wait and results. |
| editorial-1 | The premature stock-reservation qualification is removed; the caption describes only its displayed relations and omissions. |
| editorial-2, visual-1 | R10/R11 are explicit fixed lane headings. R10 remains committed while all R11 decrement/rejection/rollback work stays under R11 at every step. Model and browser checks cover both variants. |
| editorial-3 | Both linked-reading descriptions state the explanation supplied rather than editorial ownership. |
| editorial-4 | Both a00 openings now begin with the walkthrough’s benefit or the engine/deployment fact. |
| visual-2 | Wide phone tables carry a visible sideways-scroll cue and their scroll regions are keyboard focusable. No document overflow. |

All accepted r01 problems have a returned repair. This is coordinator confirmation; fresh full review of the repaired version follows as r02.

Repair assignment times: a00 **19:34:44–19:43:15 UTC,511s**; a03 **19:34:57–19:43:16 UTC,499s**. Source counts after repair: **a00 3,796 (+44); a03 4,140 (+223)**. Counts include Astro source markup as in trial2.

Native a00 port56310 passed22 checks. Native a03 source56320 and extracted bundles56321/56322 passed, with the final archive byte-matching current sources. All owned clusters were stopped/removed. a03’s overlapping build failed on a generated dist module while a00 built; the coordinator serialised the final build and records its independent output in build.log. This build collision is an execution cost, not an article finding.
