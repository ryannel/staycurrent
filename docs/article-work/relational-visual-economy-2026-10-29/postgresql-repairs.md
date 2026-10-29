# PostgreSQL and recovery repair confirmation

29 October 2026. Repairs address the five grouped Medium findings in `postgresql-recovery.md`; seven figures across six articles. This is a bounded repair confirmation, not a new collection review. The earlier review's unaffected findings and coverage remain valid.

## Repairs

- **Architecture Figure 5; query execution Figure 1:** removed narration-only playback. The complete index-to-visible-tuple route is available immediately. The plan retains its nested loop boundary and measured counts, with the total 27,525 lines beside the 9,176 lookups and an explicit reminder that three rows per loop is rounded. The plan introduction now describes the comparison rather than directing clicks.
- **JSON Figure 2; access control Figure 2:** the selected input or statement now exposes its corresponding checks and result together. All seven JSON cases and all four RLS statements remain available. The RLS figure keeps excluded rows visible and separates existing-row eligibility from the proposed-row check. Its initial HTML includes the actual default rows and result, not a pending placeholder.
- **JSON Figure 4:** replaced three repeated process cards with one expression/operator/index mapping. Exact expressions and predicates remain intact. After the first phone rendering proved cramped, changed the narrow layout to one full-width expression above its operator and matching index, retaining the same three-row comparison.
- **Upgrades Figure 2:** directory paths now point to visible user-file objects. Copy and clone have separate file identities; link converges on one shared file. Starting the linked target visibly marks the old directory unsafe to start. Clone's initially shared blocks and copy-on-write qualification remain explicit. Removed the duplicate stage paragraph for this drawing; its state boundary and native-fixture limitations remain.
- **Replicas Figure 3:** two successive requests from one reader now form a visible route to A and then B. The retained-history choice visibly excludes B instead of returning its earlier value. Both alternatives are immediate comparisons, without a playback sequence that merely changes commentary.

Changes are confined to six figure components and the two JSON/plan introductions. No shared player or style component changed. SQL, model state data and native experiment artefacts are unchanged.

## Confirmation

Read the revise, figures, continuity and review guidance; used the fixed Storage and durability reference for the physical file distinction and the input/answer comparisons. Re-read the affected articles and their surrounding figure explanations. The repairs preserve the shop's product, tenant and commit-history examples, distinguish rounded plan values from actual totals, and retain the clone/native-experiment boundary.

Inspected all seven affected figures rendered at desktop and 375 px in both light and dark appearances. Checked the actual comparison geometry, labels, nearby prose, result placement and phone wrapping. Restored the System appearance and reset the temporary viewport before yielding the browser to the next reviewer.

Operated all seven JSON inputs, four RLS statements, both session-routing alternatives and all three upgrade modes through all three states. Checked upgrade Back, Next, Reset and keyboard activation of Next and Play/Pause. Confirmed the unchanged replica-progress Next control still advances after factoring the shared drawing callback. Rechecked the last replica heading deletion and the RLS initial result after their final edits. All six affected public routes returned HTTP 200. `git diff --check` passed after trimming a trailing blank line.

Limits: native database experiments were not rerun because their code and evidence did not change. This check does not certify continuous animation pacing, screen-reader behaviour, or every native-select keyboard gesture; the selections were verified through browser option selection. The coordinator owns the final build, site checks and publication.
