# Teaching review · breakdown · Coordinates in a zoomable editor · transfer-root-plan-v1

Started UTC: 2026-10-21 21:22:19
Finished UTC: 2026-10-21 21:23:44

Inputs read: [frozen manifest](root-manifest.json); [raw commission](../../transfer-commission.md); archive `/private/tmp/staycurrent-skills-night-d` files `docs/coverage/coordinate-editor.yaml` and `coordinate-editor-example.md` (both SHA-256 values match the manifest); installed `staycurrent-review/SKILL.md` and its teaching perspective; the complete Sequence diagrams, Indexes, and Storage and durability reference articles, including their figure descriptions, comparisons, controls and source-defined teaching steps. The sole contextual child stub is part of the root breakdown; no child headings yet exist. No earlier versions, other reports, planner records or author verdicts were read.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Begins with the pointer problem and named origins, axes and units; scalar positions and movements precede trigonometry, coefficients and matrices. |
| 2. Order | pass | Turning unit steps gives meaning to rotation, mapped origin/steps give meaning to coefficients, and substitution precedes matrix multiplication; reversing actions precedes the inverse formula. |
| 3. Examples | pass | The same Review card and marked point carry translation, rotation, composition and input; wrong order, a smaller SVG, a turned view and collapse vary labelled fields of that state. |
| 4. Showing | pass | Briefs specify what each hard-part display must establish: shared point across spaces, point versus step, fixed pivot, changing pan under order reversal, forward/backward arithmetic, browser scaling and two points collapsing together. |
| 5. Judgement | pass | The reader is equipped to choose a conversion by its endpoints, diagnose order/pivot mistakes, perform the local rectangle test, distinguish model V from browser C, and reject invalid input mappings while retaining valid state. |
| 6. Gradual exposure | pass | Root retains the complete mathematical and small-browser implementation route and derives the zoom/drag invariants before handing event lifecycle and fuller gesture implementation to one child. |
| 7. Placement of additions | pass | Planned figures sit at the operations they explain; browser fitting follows inverse mapping and precedes its failure case, while gesture invariants finish the root's implementation story before the child link. |

## Findings

None. There is no `teaching-1` finding to report.

The plan makes the unfamiliar mathematics earn its introduction through a task the programmer already understands. In particular, it does not require the reader to learn matrix syntax before seeing what the operations do. It gives extra help to the places most likely to defeat a newcomer: arbitrary rotation, composition order, reversing a mapping, and crossing from SVG units to browser coordinates. The settled variations expose why the easy shortcuts fail, without changing the scenario or requiring another subject. At breakdown resolution, this supports the commissioned reader's ability to implement and diagnose the editor, with the deeper gesture page extending an answer already given in the root.

## Limits

This is a review of planned teaching, not finished prose or executable media. Reference figures were read through article source and their component/scenario teaching material; no rendered preview, control playback, server, build or browser verification was performed. The transfer figures and implementation do not yet exist. Mathematical calculations and browser API correctness require the separately commissioned practitioner and subsequent implementation checks. There is no parent/sibling plan beyond the raw commission, and the contextual child stub is intentionally not a completed child plan; progression within that child remains unreviewed. No publication judgement is made.
