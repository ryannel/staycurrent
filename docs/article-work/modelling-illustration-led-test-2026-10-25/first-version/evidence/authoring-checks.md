# First-complete version: authoring checks

Version: `first-complete-2026-10-25`.

The article is complete for the commissioned first-version handoff. No independent review, review findings or repair cycle has occurred. All changes during the assignment were the writer's normal composition and authoring checks. No commit, push or publication was performed.

## Rendering and controls

Preview: http://127.0.0.1:4602/review/modelling-first-draft/ . Root owns compilation and server. Root reported the first full isolated Astro build passed (one page, no errors). Final compilation is requested after this handoff.

Used one owned reference tab, then one owned draft tab through the supplied browser interface. Original browser viewport was 1280×720; theme control selected System. Checks used desktop 1280×1000 and narrow 375×900. Restored the default viewport to 1280×720 and selected System again. Both owned tabs were closed; user tabs were untouched. Browser lease is released.

- Inspected screenshots of all 11 figures at desktop in Light, and all 11 at narrow width in Dark. Also inspected the final schema at narrow Light and desktop Dark, the correction result in desktop Dark, and the final separate lines/payments scene at both widths. Tall narrow figures scroll vertically; they do not shrink their text into a miniature desktop diagram.
- Ran DOM layout checks for all 19 states of the six stepped figures in all four width/theme combinations (375/1280, Light/Dark). No scene or figure horizontal overflow. Whole-page horizontal overflow was false in each combination. Static figures fitted the narrow page width too.
- Every stepped figure: Play/Pause label, Next, Back, Reset, Replay, initial/end aria-disabled states and counters checked. Keyboard Enter advanced Next; Space returned Back; Enter opened and closed each All steps as text disclosure. Results were 3 steps for grain/offers/dependencies, 4 for normalise/split, 2 for price. Replay returned each to step 1; Reset restored each initial scene.
- Actual automatic advancement was observed on the shared player: Figure 1 progressed from 1/3 to 3/3 and its label became Replay. Playback was not left running.
- The interactive visual content is real HTML tables and definition lists, with table headers, captions, figure labels, a polite changing explanation and full step-text alternatives. No drawing's meaning depends only on colour.
- Computed foreground/background contrast on rendered figure text yielded minimum 5.52:1 in Light and 6.15:1 in Dark. Arrows use the site accent; table rules and box borders are decorative and duplicate text grouping, rather than being the sole source of a fact or relationship.
- Browser console checks returned no warning/error messages.

Limits: no physical mobile device or screen-reader session was used. Reduced-motion emulation was not available in this authoring browser; the unchanged supplied player contains its reduced-motion hold-bar guard. Keyboard operation was tested through the browser's native button/disclosure semantics. This is authoring verification, not an independent teaching/technical review.

## Model and continuity checks

Focused local assertions verified the line/payment product (four rows, repeated payment sum 79.00), agreement total 29.00, absent three-way offer with all pairs present, unsafe four-row versus safe two-row reconstruction, and independent two-by-two tag/supplier memberships. Final assertions confirmed the repaired name is Mina Patel in Figure 5, the moved timestamp remains visible in the final schema, and Figure 1's orders row expresses its customer reference rather than suggesting a stored derived total.

Complete article, all figure steps, captions and controls were reread for continuity. The record is `evidence/example-facts.md`. Consequential source checks and limits are `evidence/technical-sources.md`; complete reference exposure is `evidence/reference-exposure.md`.

## Owned files

- `src/articles/modelling-first-draft/article.astro`
- `src/articles/modelling-first-draft/article.meta.json`
- `src/components/modelling-first-draft/ModelFigure.astro`
- `src/components/modelling-first-draft/models.mjs`
- `src/components/modelling-first-draft/figures.css`
- This evidence directory.

Shared preview, layout, theme, SQL and player infrastructure were not changed. No public assets or dependencies were added.
