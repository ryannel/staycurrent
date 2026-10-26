# Authoring checks

First complete source requested an initial root compilation; root reports private compile22797 passed. After author QA corrections, requested one final stable compilation. Root owns builds/integration/publication; no pnpm, installs, server launch, commits or main-repository edits were performed by this writer.

Normal author reread and continuity pass completed through the complete rendered article, including captions, labels, controls, SQL and sources. Compared the explanation sequence with the fixed references: introduce the object, show one concrete operation, follow its stages, then explain the costs and qualifications. The accepted plan’s ownership is retained without treating its subheadings as a coverage checklist. Figure labels are paragraphs/captions, not section headings.

## Model and SQL

- All 12 displayed listings extracted directly from current source and executed in closed disposable PGlite0.5.8/PostgreSQL18.3. Latest rerun passes after final SQL edits.
- Native18.6 verifier passed unchanged under root; exact observed scope and important unobserved cases stated in prose and technical-sources.md.
- Figure2 counterexample: zero missing with one unequal pair; not-null validation succeeds, agreement fails; unrelated update fails; safe repair then validates. Separate native unsafe/safe race shows the protection matters.
- Formula/range/source semantics, late-key ordering, defaults, constraint enforcement and final index readiness all checked. No new shared facts or business uniqueness.

## Rendered and controls

Owned tabs only at private127.0.0.1:4696. Reference-origin settings left unchanged. All five figures visually inspected at actual1280×720 and375×812, light/dark. New tab initially inherited1280 despite a prior override; reapplying the browser viewport to the selected fresh tab verified375. Later desktop verification also confirmed actual1280 after closing the selected mobile tab. No claim rests on requested rather than observed width.

- Page scrollWidth equals innerWidth in both widths. Five figures desktop640px (scroll638), mobile343px (scroll341); no figure overflow. Mobile SQL scrolling stays inside focusable regions, without page overflow. Table wraps within its region.
- Figure1 every stage and both endings, changing option at final step, Back, Reset, Play/Pause and Enter/Space activation verified. Figure2 every stage, Back/Reset, Play/Pause/Replay and text alternative verified. Figure3 every stage, Back/Reset and Play/Pause verified. Shared controls retain focus at ends via aria-disabled; state labels give meaning independently of colour.
- All changing teaching text marked data-live; explanations aria-live=polite. Static figures retain complete readable labels/captions. Sources disclosure initially closed, opened/read/closed successfully. One getByRole(button) selector did not match native summary in Playwright; inspecting summary text and using the actual summary locator succeeded. This was a QA selector issue, not a reader control failure.
- Browser error/warning log empty in inspected preview. Reduced-motion was not forced in this browser; the shared player’s reduced-motion guard prevents hold-bar animation, inspected in its implementation. No untested emulation is claimed.
- Actual rendered colours sampled from computed styles. Contrast on figure background: light text13.73:1, secondary6.05:1; dark text10.89:1, secondary6.15:1. Meaningful borders: light teal4.36/gold3.16/coral3.91, dark teal8.16/gold7.41/coral5.92. Text uses neutral colours, not the lower-contrast gold.
- Author QA replaced undefined amber with supplied gold, clarified the old-snapshot rewrite precondition, kept P11 conditional/contextual, and labelled the actual native first-scan unique failure separately from documented later enforcement. Native verifier unaffected. Latest article listings rerun after migration application_name was made explicit.

All playback stopped. System radio was checked and actual1280×720 confirmed, then all owned tabs closed and the temporary viewport override reset. No independent review performed by this writer, per assignment; root freezes stable source before arranging it. No unresolved authoring dependency.
