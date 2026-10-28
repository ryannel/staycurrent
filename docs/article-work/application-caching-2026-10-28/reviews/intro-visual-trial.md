# Introduction watching trial — scoped visual review

28 October 2026. Only the six replacement introduction figures and their immediate lead-ins/captions were reviewed. Other articles and their earlier checks are unaffected. This is a trial for the user’s style judgement, not approval to extend the treatment or publish.

## Judgement

The figures now communicate without requiring the reader to operate a demonstration. Four finite scenes start when sufficiently visible and retain their result; two static comparisons expose the whole relationship immediately. Pause and Replay are optional and worked by keyboard. There are no selectors, step controls or changing paragraphs the reader must follow.

The first scene contrasts a source read with reuse. The price-change scene visibly holds the new source price beside the old copy before deletion. The shared-fill scene compares four independent paths with four paths converging on one read. The memory scene replaces three small cards with one large answer. These changes carry the explanation, and the retained states preserve the conclusion. Local/shared placement and key identity need no animation to show containment and separation. This addresses the requested watching-first direction; checks do not establish whether the user will prefer the style.

The 10.5–13.5 second durations are presentation time, explicitly distinguished from measurements. The first request completes before reuse; burst and memory comparisons keep their example inputs fixed. No obvious new technical contradiction was found in these sequences.

## Findings and confirmation

All reported visual problems are resolved in the refreshed trial:

- **Medium, repaired:** Figure 5’s returned “£20” labels were struck through by the request paths. Opaque label backgrounds now keep all eight successful replies clear, confirmed at 375 px light and 1280 px dark.
- **Medium, repaired:** Small coral/teal SVG outcome text had light-theme contrast of approximately 3.91:1 and 4.36:1. It now uses ordinary theme text. Live computed values are `rgb(36,33,26)` on `rgb(240,237,229)`, approximately **13.73:1**. Colour remains available for paths without being required to read outcomes.
- **Coordinator repair, confirmed:** Figure 1’s node labels now sit above the drawing, clear of the source route.
- **Low, repaired:** The tiny saved-card prices were about 8 px at phone width. Larger prices now fit the cards without clipping, including both static comparisons.

A visibility check held Figure 5 at exactly `0.027819…` progress while only 149 of its 334 vertical pixels were visible. Bringing the full drawing into view resumed it. This supports the intended behaviour of waiting until the reader can watch the scene; it is not a real-device scrolling study.

## Evidence and limits

Used CUA’s Chrome integration at **375 × 960** and **1280 × 960**, with light and dark inspections. IAB was unavailable. No external browser automation or shell-driven browser was used. Watched all four scenes, inspected all six endings/comparisons, then checked only affected visuals after repair. Source inspection covered `Watching.astro`, `watch-scenes.mjs` and `watching.css`.

Four final CUA captures are retained under `../evidence/visual-review/`:

- `intro-trial-read-phone-light.jpg`
- `intro-trial-read-desktop-dark.jpg`
- `intro-trial-burst-phone-light.jpg`
- `intro-trial-burst-desktop-dark.jpg`

Reduced motion was checked in source: it presents the final drawing and hides playback. The documented CUA surface did not provide preference emulation; no OS preference was changed, so this is not a fresh browser reduced-motion receipt. No formal screen-reader or touch-device session was performed. Each drawing exposes a concise image alternative. Temporary viewport and theme settings were restored.
