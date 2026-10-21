# Value review · tree · coordinate editor collection · transfer-tree-v1

Candidate: D-02  
Start: 2026-10-21 21:39:05 UTC  
End: 2026-10-21 21:40:17 UTC  
Highest severity: none

## Fixed inputs read

Complete frozen inputs, all read in full:

- `/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/transfer/planning/snapshots/tree-v1/docs/coverage/coordinate-editor.yaml`
- `/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/transfer/planning/snapshots/tree-v1/docs/coverage/coordinate-editor-example.md`
- `/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/transfer/planning/snapshots/tree-v1/docs/article-work/coordinate-skill-trial/registry.json`
- `/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/transfer/planning/tree-manifest.json`
- `/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/transfer-commission.md`

Review instructions: `/private/tmp/staycurrent-skills-night-d/.agents/skills/staycurrent-review/SKILL.md` and only its `perspectives/value.md`. All three snapshot hashes match the manifest. The frozen snapshot, rather than the changing canonical archive, is the review authority. No earlier reviews, planner records, candidate reports or coordinator opinions were read; no prescribed value input was omitted.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Loss if cut | pass | Each article and section supplies a named part of the commissioned implementation or diagnosis; losses are listed below. No cut proposed. |
| 2. Overlap | pass | Repeated anchors and browser checks have different instructional jobs; ownership is stated below. No duplicate independent derivation is commissioned. |
| 3. Separate pages | pass | The gesture child adds a complete interaction mechanism and failure diagnosis beyond the root's usable coordinate explanation. No thin child or third page. |
| 4. Route cost | pass | Initial placement/input and transform diagnosis cost one page; complete robust gesture work costs two, including the prerequisite root. No dependency route needs a third opening or a separate mathematics page. |
| 5. Proportion | pass | Most conceptual depth belongs in the root; the child is bounded to single-pointer interactions and earns its six main sections. Actual prose length remains unassessable before writing. |

## Loss if cut

The root earns its page by taking the reader from local geometry to display, inverse input mapping and a basic editor implementation without a prerequisite mathematics article.

| Root section | Useful understanding lost if cut |
| --- | --- |
| One card, several sets of coordinates | The purpose and direction of conversions, the local-storage strategy and the meaning of each space. |
| A position and a movement follow different rules | Why translation belongs to positions but cancels from movements, and why movement cannot simply cross spaces. |
| Turn the group around a known pivot | A derived rotation rule, angle convention and the practical subtract–turn–add pivot construction. |
| Six numbers describe the whole placement | An intelligible affine representation, point/displacement matrix distinction and the browser coefficient ordering. |
| Put the conversions together in the right order | Composition as substitution, matching source/destination spaces and the ability to predict the wrong-order pan result. |
| Follow the pointer back to the card | Derived inversion and a concrete local hit test, rather than an unexplained inverse API call. |
| Connect the maths to browser coordinates | A correct bridge between SVG user units and client CSS pixels, including why a bounding-box subtraction fails under resizing. |
| When the way back disappears | The information lost under collapse, negative versus zero determinant, and limits on safe inverse input. |
| Keep the chosen point under the pointer | The implementation choices for pan, rotation and card movement, the anchor invariant and enough anchored-zoom reasoning to answer the root's practical promise. |

The child earns its page by turning those geometric ideas into one complete gesture route, including event interruption and changing layout. It is a continuation with an explicit root prerequisite, not an independent introductory article.

| Child section | Useful understanding lost if cut |
| --- | --- |
| Decide what the gesture must keep | The common retained-point model and a precise link between each operation and the state it changes. |
| Pan in the view's coordinates | Why a turned/resized editor needs current client-to-view conversion and an absolute anchor equation rather than raw client deltas. |
| Zoom and turn around the chosen point | Applying the retained-point equation to changed scale/angle, chosen pivots and clamping without drift. |
| Move the card in its parent's space | Preserving an arbitrary grab and solving its new parent-space translation; the central failed divide-by-zoom comparison. |
| Ask the right element for the mapping | Selecting an inverse by destination and understanding capture targets and layout changes, including a measurable stale-inverse failure. |
| Give the gesture a beginning and an end | One implementable pointer lifecycle, capture, safe completion and cancellation; geometry alone cannot supply this. |
| Check the promise before storing the update | Validating before committing state and relating visible symptoms to geometry, stale mappings or lifecycle faults. |

No section is retained merely for terminology coverage: the matrix, trigonometric and determinant material serves the commission's requirement to derive operations and diagnose failures.

## Overlap and ownership

| Both treatments | Owner and distinct return |
| --- | --- |
| Root rotation/pivot section; child zoom/turn section | Root owns rotation and pivot derivation. Child owns solving compensating pan for changed view parameters and implementing a chosen target. |
| Root final section; child zoom/turn section | Root owns the anchor invariant and baseline zoom derivation. Child reuses that baseline as an implementation check, then adds rotated view, clamping and chosen-target control. Do not expand the baseline into a second conceptual lesson. |
| Root final section; child card-movement section | Root owns the retained-grab/parent-space principle. Child owns the absolute update, arbitrary grabs and the normal/resized/turned failure comparison. |
| Root browser subsection; child mapping subsection | Root owns client coordinates, SVG fitting and what getScreenCTM supplies. Child owns choosing the correct element and reacquiring its mapping during a live gesture. |
| Root collapse section; child final section | Root owns inverse failure and numerical/geometric explanation. Child owns rejecting an update before mutation and ending an unmappable gesture. A reminder and link are sufficient there, as the plan requests. |

The space reminders and canonical arithmetic reuse are purposeful continuity and verification, rather than five independent mathematics lessons. The child explicitly prohibits reteaching multiplication, rotation and inversion. These ownership boundaries keep the planned overlap proportionate.

## Whole-route reading cost

Counts include prerequisites; direct arrival at the child does not make its root cost disappear.

| Typical reader task | Required route | Pages opened | Scope read |
| --- | --- | --- | --- |
| Implement nested card placement and map a pointer to a local hit | Root | 1 | Root's eight main sections and browser subsection establish the complete route. |
| Diagnose swapped transform order, wrong pivot or noninvertible placement | Root | 1 | Root supplies the model, numeric comparison and inverse limits; no separate reference page is required. |
| Implement anchored zoom and robust pan/card dragging | Root → child | 2 | Complete root foundation plus child's six main sections and mapping subsection: sixteen planned heading units in total. |
| Diagnose dragging after rotation/resize, or an interrupted/stuck gesture | Root → child | 2 | Root establishes the spaces and inverse; child covers current mappings, retained grabs and lifecycle. Returning readers can follow the symptom table, but newcomers still pay both pages. |

Merging the entire child into the root would save one page opening on the complete-gesture route and lose no conceptual understanding if every passage were retained. It would also put all lifecycle and changing-layout implementation material into the introductory article; it does not reduce the amount the full-route reader must learn, and weakens the useful stopping point for the one-page placement/input task. That merge is not recommended. Cutting the implementation detail to make such a merge shorter would lose the child's stated lifecycle and stale-mapping outcomes. There is no thinner child subsection that currently warrants another page.

The plans contain no word counts or reading-time targets. Page and heading counts are observable here; minutes, prose volume and control effort are not. A two-page plan can still be overlong in execution, so this pass does not certify eventual reading time.

## Proportion

The root has the greater conceptual load: coordinate conventions, points/displacements, rotation, affine representation, composition, inversion and the browser bridge. Its eight main sections are justified by those dependencies. The child narrows to a single retained-point method with four uses and the event/state route needed to make them work. Its extra snapshots change a relevant condition—bridge scale, view rotation or mapping freshness—rather than merely adding numbers.

The explicit exclusions of wheel normalisation, multi-touch recognition, inertia, undo and a scene-graph framework prevent the deeper article from becoming an interaction-framework survey. Neither the three-article limit nor the subject's available mathematics is being used to fill space. No shallow branch is overextended and no commissioned deep branch is visibly truncated in the plan.

## Findings

None. No finding numbers assigned; any later finding in this independent value sequence should begin at `value-1`.

## Limits

This is a value review of a frozen complete plan, not of written articles. Actual prose repetition, reading minutes, media usability, arithmetic correctness and browser execution have not been established. No implementation, build, browser, commit or push was performed. No outside technical sources were needed to judge the planned contribution and route structure.
