# Sandbox review

Independent browser review, 16 October 2026. The first impression below was
recorded before inspecting implementation. Scope: reader understanding, controls,
state visibility and article alignment; the coordinator owns exhaustive execution.
No AWS calls were made.

## First impression

The entrance states the evidence boundary clearly: selected S3 ideas, a local
model, no credentials and tab-memory state. The first loaded lesson has a small
editable JSON PUT, a prediction question, explicit Run/Next/Restore controls and a
bucket inspector. It distinguishes restoring the request from restarting the
lesson. The inspector also explains its privileged view of a lost-response write.

The lesson names describe useful tasks. I can see where to start and how to leave
for the explanation or real-service practice. Before interacting, I expect Run to
change state, Next to advance the lesson and Restore to preserve state while
recovering the original request. I have not yet established whether Next requires
running, whether responses remain easy to compare with the editor, or how the
inspector behaves after many operations.

## Observed interaction

Used headless real Google Chrome through Playwright against
`http://localhost:4330/learn/databases/object-storage/sandbox/`. Inspected the
rendered page and controls, without opening implementation files.

- Ran the opening PUT, changed the next GET to a missing key, received 404, restored
  the request and retrieved the original bytes. Restore preserved the bucket.
- Entered malformed JSON and saw an explicit 400 `InvalidJSON` response without
  changing stored state. Restart returned the opening lesson to an empty bucket.
- Followed every step of conditional writers, lost reply, table commit and vector
  filtering. The chosen sequence makes failed conditions consequential: the old
  writer rereads before preserving the winner's changes. The lost-reply inspector
  is explicitly labelled as knowing more than the caller.
- Followed multipart creation, parts, the rejected completion and repaired
  completion on mobile; inspected unfinished work. Entered unsupported
  `IAM_VALIDATE` and received a model error referring to the request reference.
- Opened the request reference. Its inventory and omissions distinguish versioned
  model objects, application/cache/cost/vector commands and unsupported AWS features.
- Exercised keyboard Enter on Run, Tab to Next and Enter on Next. Next moved focus
  to the new request heading. Confirmed `role="status"` on both response status and
  notice; these provide implicit polite live regions. No actual screen reader was
  used.

## Findings sent to the coordinator

### Repair: show vector records before asking for a prediction

The initial vector step asks which two records are nearest to [1,0], and the lesson
promises “four visible records.” Yet its initial request contains only query/topK,
the inspector reports an empty bucket, and the four coordinates/categories first
appear in the response after Run. A direct entrant cannot derive the answer from
the lesson as displayed. Show A–D, their vectors and categories before Run. This
also establishes that the special vector dataset is separate from the empty
ordinary-object bucket.

The related article already supplies all four rows and correctly derives A/B,
then B/C after filtering. The sandbox should provide the same prerequisites without
requiring a reader to open another page before its first question.

### Repair: reserve “Lesson complete” for the completed final request

Entering the final multipart step, “Read the completed object,” immediately showed
a disabled button labelled “Lesson complete.” The response still said “Predict
the result, then run the request.” The label can cause a reader to omit the final
GET that verifies assembled bytes. Before execution, indicate that this is the
last step; show completion after it has been run.

### Improve: make vector results readable as a comparison

The first vector reply duplicates candidate records in a results array. In the
original 640px desktop content column, the response occupies roughly half that
width. The candidate list consumes the scrollable code panel, so the result set
requires scrolling inside it. Floating-point output such as
`0.07999999999999999` also competes with the article's clear 0.08 calculation.
A compact candidate/result table with rounded display distances would expose the
question directly; keep raw JSON available for inspecting the model response.

The narrow desktop workbench also wraps prediction text and hides portions of long
JSON lines. It is usable, but a wider sandbox layout would put the inspector and
request/response in a more useful relationship. The coordinator accepted this and
is widening the workbench. Mobile already stacks the controls clearly.

### Withdrawn preliminary finding

An initial DOM query looked only for explicit `aria-live` attributes and returned
none. The coordinator pointed out the status roles. Rechecking confirmed both
status regions and the deliberate Next-step heading focus. The preliminary claim
that results lacked announcements was incorrect and is withdrawn. Do not count it
as an outstanding defect.

## Article and lesson alignment

The table lesson follows the article's A → compaction C → rebased append D sequence
and selects F12/F3 at the end. Its explicit scope is a simplified manifest/conditional
pointer, with no Iceberg or S3 Tables execution claim. The sandbox's illustrative
file bodies name September and October rows while the article's initial files name
yesterday's purchases. That difference does not change the taught file-selection
mechanism, though keeping labels aligned would reduce unnecessary translation.

The vector lesson uses the same A–D coordinates, categories and squared Euclidean
calculation as the article. Moving the query to [0,1] makes C the nearest storage
record. Actual floating-point values match the expected mathematical result within
ordinary numeric representation. The stated scope correctly excludes embeddings,
managed approximate search and S3 Vectors execution.

Conditional writers and lost reply teach the same important application distinction:
a rejected retry does not identify what happened to an earlier request with no
response. A later writer can complicate reconciliation; the final lesson note
preserves that limit instead of claiming the current GET always resolves history.

## Visual and accessibility observations

Inspected desktop at 1440px in the light theme and mobile at 390px in the dark theme.
The mobile document remained 390px wide, including with the reference open.
Controls have legible labels and clear separation. Restore and Restart have distinct
names and explicit copy about their effect. Responses and inspector state are
available as text; error understanding does not depend on colour alone.

The mobile screenshots show the editor, action row and response status comfortably
within the viewport width. Long response JSON still requires scrolling, which is
reasonable for raw detail but weaker as the primary vector comparison.

Screenshots are under `visual/review/`: `desktop-first.png`, the four selected
lesson desktop captures, `vectors-mobile-dark.png`, `multipart-mobile-dark.png`,
`mobile-controls.png` and `mobile-response.png`. These preserve the initial reviewed
revision, before the coordinator's layout and lesson repairs.

## Handoff

The core interactions and selected failure paths worked in the browser. Two teaching
repairs and the result-presentation improvement above were sent promptly and accepted
by the coordinator. Capture stopped before their rebuild. The updated rendering and
completion behaviour need a targeted recheck; this record does not claim acceptance
of changes that were not yet running. Exhaustive lesson execution remains the
coordinator's separate check.

## Targeted rereview after repairs

Revisited the rebuilt localhost sandbox in real Chrome on 16 October 2026, at
1440px/light and 390px/dark. No code was inspected or changed in this rereview.

All requested repairs are confirmed:

- Before the first vector Run, a visible table now supplies A–D, coordinates and
  categories, plus the distance calculation rule. The question can be answered from
  the displayed lesson.
- After Run, a compact table shows filtered candidates, rounded squared distance and
  whether each candidate was returned. Step one shows A=0 and B=0.08 as returned;
  filtering to storage shows B=0.08 and C=2. Raw model JSON is available in a closed
  disclosure. Ordinary object replies remain expanded so their response details
  have not become hidden behind the vector-specific presentation.
- Entering the final vector step shows “Final step.” An invalid one-coordinate query
  returns 400 and retains that label. Restoring and running the expected request
  changes it to “Lesson complete.”
- The desktop main is 1216px wide, matching 76rem. Request and state panels now have
  useful width without losing the textual model boundary.
- At 390px the response JSON uses `pre-wrap` and `overflow-wrap: anywhere`, with
  client width and scroll width both 358px. Opening it keeps document width at 390px.

The dynamically created result table receives the site's global table styling:
8px vertical/12px horizontal cell padding, left-aligned text and theme-aware row
borders. It does not receive the static dataset table's 9.6px scoped padding, but
this is not a usability defect in the rendered result. The mobile detail screenshot
shows all four columns and rows clearly; “Squared distance” wraps inside its header
and the values remain aligned. No additional style repair is needed for acceptance.

New evidence uses the `repaired-` screenshot prefix, including desktop before/after,
mobile with raw response open and a tightly captured mobile result table. These
supersede the original visual findings while preserving the earlier evidence.

Targeted rereview status: the reported teaching and presentation findings are
resolved. The selected browser interactions, final-step error branch and desktop/
mobile presentation are accepted within this review's scope. Exhaustive execution,
site build and deployment remain the coordinator's separate work.
