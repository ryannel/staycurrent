# Object-storage verification

16 October 2026. The user commissioned publication and milestone pushes to main.
Amazon S3 is the leading service; general-purpose buckets are the default scope.
The collection has an introduction and thirteen focused articles, a real-service
worksheet and a browser sandbox with fourteen lessons and 78 request steps.

## Evidence boundary

The browser executes a local, sequential JavaScript model. Its status codes and
state transitions illustrate selected service and application ideas; it is not S3,
an AWS client or a compatibility emulator. No AWS credentials or cloud resources
were used. The real-service worksheet passed local shell syntax, CLI parsing and
service-input-shape checks, with the limits recorded in `intro-practice-review.md`.
Actual hosted responses, permissions and cleanup were not exercised.

## Completed checks

- The five revised writing skills passed skill validation and independent review.
  Their Claude mirrors were synchronised. Commit `b023309` was pushed to main.
- Planning, core articles, operations articles, advanced articles, the introduction
  and worksheet received independent review and repairs. Records preserve the
  consequential findings and the claims' primary evidence.
- Thirteen model tests pass. They exercise failed conditions, immutable history,
  missing replies, multipart completion, application publication races, duplicate
  events, cache expiry, cost and filtered vector ranking.
- All 78 guided requests ran through the actual browser UI with their expected
  responses. Malformed JSON, reset, literal HTML input, unknown lesson links and
  keyboard movement from the editor also passed.
- Sixteen routes were inspected at desktop and phone widths in light and dark
  themes: 64 layout states, no document overflow, missing article contents lists,
  broken internal route links or browser exceptions. Native figures and selected
  full-page views were captured under `visual/`.
- Independent sandbox inspection found premature completion wording, missing
  vector prerequisites and a cramped result display. Repairs were reread in the
  browser and accepted; the original and revised screenshots remain available.
- Seventy-two external source links returned successfully without unexpected
  redirects. A removed AWS download-integrity URL had silently led to the guide
  homepage; the article now links the relevant maintained integrity guide.
  This link check complements the claim reviews; an HTTP success is not factual
  verification.

The continuous reading, final repair checks and publication evidence are recorded
below when complete.

## Final local build and repair checks

`pnpm build` completed at 02:22:53 local time on 16 October: 77 pages in 3.64
seconds. The existing PGlite dependency warnings remain; no build error occurred.
All thirteen model tests passed after the final source changes.

Repeated the complete browser check after lesson-prose and result-display repairs:
78 expected outcomes, 64 layout states, no overflow, missing contents lists, broken
internal routes or browser exceptions. A separate anchor check found all 108
internal fragment targets. Searching the article directory for S3 returns sixteen
relevant entries, including all thirteen focused articles.

The final cost response was checked at both viewport widths and in both themes.
Its third step displays 33 GB transferred and 3.0432 illustrative monthly cost units;
the unrounded JSON remains available in a closed disclosure. The table and its
assumptions fit the phone viewport. Screenshots and structured results are in
`final-ui-check.json` and `visual/cost-final-*`. The revised Iceberg reference trace
was captured in all four display states and visually inspected at phone size.

The full independent first reading preserved its questions before later sections
answered them. It found no blocking main-argument gap across the introduction,
thirteen articles, all sandbox steps and the worksheet. Repairs addressed the
specific remaining burdens: first-use terminology, approximate-search motivation,
managed table-cleanup terminology, visible seeded lessons and rounded numerical
results. Its targeted repaired-build judgment remains in `first-reading.md`.

## Publication and live verification

Publication commit `f54f9ee` was pushed to `origin/main`.
[GitHub Actions run 38829382895](https://github.com/ryannel/staycurrent/actions/runs/38829382895)
completed its build and Pages deployment successfully.

The public site returned HTTP 200 for all sixteen object-storage destinations and
four discovery pages. Their HTML hashes exactly matched the final local build.
All object-storage pages are indexable. The database field guide retains its
existing noindex status; this commission does not publish the other draft families.
The live checker initially applied its noindex condition to that existing guide,
then narrowed the publication assertion to the commissioned object-storage routes.
The recorded raw observations are unchanged.

A real Chrome run against `https://staycurrent.dev` completed seventeen guided
steps across lost replies, multipart completion, cost and vector retrieval, with
all expected statuses and no browser exceptions. Local testing had already covered
all 78 steps. `live-verification.json` records the public checks, and
`verify-live.mjs` preserves the procedure. The scripts use the local Playwright
installation stated in their imports; they are evidence tooling, not application
dependencies or additional required repository checks.

The independent reader accepted the repaired build and found no new blocking
comprehension issue. All commissioned work is complete. The remaining verification
limit is deliberate: no real AWS account request or cloud resource was used.
