# Editorial review · article · Keep a diagram under the pointer · D-REPEAT-ARTICLE-r01

Inputs read: [frozen manifest](manifest.json), confirmed once as the assigned version; complete [rendered child](http://127.0.0.1:4344/review/skill-transfer/gestures/), including all expanded figure text, event policy and source listings; rendered parent as prerequisite context; the complete fixed Sequence diagrams, Indexes, and Storage and durability references, including captions, labels and figure step text (Indexes' scripted step definitions also read in its figure components). Local AGENTS.md, review SKILL.md and editorial perspective only. Plans, commission beyond the supplied audience, author notes, work records, evidence index, prior findings/decisions and repair history withheld.

Audience: intelligent engineer new to affine gestures, having read Coordinates in a zoomable editor.

Highest severity: low

UTC intervals (tool-clock bounds): instruction/version, rendered child and initial reference reading 2026-10-22 01:42:48–01:43:59; continuing reference prose/steps 01:43:59–01:44:22; prerequisite context and whole-piece assessment 01:44:22–01:45:10. Report written immediately afterwards. These are session bounds, not dwell-time measurements.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title identifies the practical outcome; headings name each gesture or implementation responsibility. |
| 2. Plain sentences | pass | Equations are unpacked in connected prose, with the spaces of the operands stated. Numerical cases explain the consequences of each wrong rule. |
| 3. Terms | pass | Invariant, clamping, DOM, pointer events/capture and button flags are explained. O/G/W/V/C are recapped; matrix, linear part, pivot and determinant are available from the prerequisite. |
| 4. Openings | pass | The opening starts with a recognisable failed drag, explains why dividing by zoom fails and establishes the parent relationship and implementation purpose. |
| 5. Reader-facing text only | finding | The last validation paragraph refers to inaccessible internal “trial evidence”; see editorial-1. |
| 6. Captions and labels | pass | The comparison separates model snapshots from the live SVG and explains marks, coordinate readouts, controls and deliberate wrong rules. Tables name the quantities and destinations they compare. |
| 7. One piece | pass | Retaining a point unifies pan, anchored view changes and card placement. Mapping selection then leads naturally into event lifetime and validation. Qualifications about translation-only placement, changing mappings and bounded arithmetic sit with the reasoning they affect. |

## Whole-piece judgement

The mathematical and browser portions form one argument: choose the retained point, solve in the destination space, obtain the current mapping from the appropriate element, and clear the gesture on its defined finish paths. The diagnostic table turns that argument into useful implementation checks. The parent supplies the affine foundations without the child having to rebuild them. The substantial listings are optional disclosures, and their surrounding prose explains their roles. I found no substantive editorial coherence defect, padding passage or stock rhetorical section that spends reader effort without a concrete return. This is an editorial judgement, not technical or visual approval.

## Findings

### editorial-1 · low · Check the promise before storing the update, final paragraph

Problem: “Browser and rendered-control observations are recorded separately from model checks in the trial evidence” points outside the reader's article to unnamed, unlinked internal material. Nothing in the rendered article identifies where that evidence is available.

Effect: A reader interested in what was actually observed must guess what “trial evidence” means and where to find it. The sentence briefly shifts from explaining the implementation's limits to reporting its production process. The surrounding qualification about browser/device coverage remains understandable, so this does not obstruct the argument.

Suggestion: Keep the useful distinction between mathematical snapshots, arithmetic checks and browser observations, but either provide a reader-facing evidence destination or express the limit directly without referring to internal records.

Evidence: The closing paragraph immediately before Sources and further reading contains that sentence; the source list links the parent and standards, with no trial-evidence destination.

## Limits

Read-only editorial assessment of the assigned child. No native gestures, figure correctness checks, viewport/theme changes, technical verification, build/test runs, article edits, publication or other review perspectives were performed. Semantic disclosures were opened only in this reviewer's own Chrome tabs. Reference calibration used their complete prose and figure text; it did not test their controls. No self-review or code checks were treated as editorial approval.
