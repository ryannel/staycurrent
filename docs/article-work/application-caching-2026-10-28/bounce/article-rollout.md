# Introduction visual rollout — 28 October 2026

Scope: the six figures in the application caching introduction at
`/review/application-caching/`. The user approved the coloured-ball study and
commissioned the rest of this article in that design language. The deeper
collection articles and public availability are unchanged.

The accepted first scene is now Figure 1. Five new scenes reuse its spheres,
paired answer symbol, curved routes, quiet typography and role labels. They
cover local/shared placement, key collisions, invalidation, coalescing and
admission. Comparisons are visible together and play automatically; the only
controls are pause/resume and replay. The original timing/work tables remain
tables. Nothing requires a sequence of reader inputs to reveal the lesson.

## Continuity

- App names the client in Figure 1; Server owns cache and database calls.
  Server A/B distinguish processes only where the comparison needs two.
- General figures say Cache. Redis remains the worked implementation in the
  implementation section, explicitly one of several choices.
- Figure 1 uses the previously verified Products/Prices join and nine requests.
  Prose now names that join and count, replacing the old two-request account.
- North P7 remains £20, south P7 £18, and north's committed update £22.
  The existing key, schema, TTL and checkout qualifications are retained.
- The memory comparison names P7/P8/P9/P10 as four illustrative 1 KiB entries.
  Only the retained byte budget and later requests matter; no new product facts
  are claimed. Its later misses stop before refilling, as the caption states.

## Independent review and repairs

`article_bounce_review` reviewed the five new scene definitions, captions and
surrounding prose. It found no request-count, price or update-order error. Its
medium finding was that requests after eviction lost their product identity:
P7/P8/P9 labels now remain at those request origins. Two wording suggestions
were also accepted: “Each request reads” and “Outlined circles hold saved
answers”. The coordinator confirmed the changed labels in the phone rendering.

`article_bounce_visual` inspected all six phone layouts in light theme, memory
in dark theme, and a preserved Storage reference for calibration. It found no
clipping or label collisions. Its open concern was faint meaningful light-theme
lines. New lesson routes and empty-cache outlines now use the secondary text
token. Their contrast is 6.61:1 in light and 6.83:1 in dark. Small coral outcome
text was replaced with neutral text; remaining coloured glyphs have at least
3.46:1 in light and 3.95:1 in dark. Trails/highlights are decorative. This scoped
check does not recertify every colour in the unchanged first study.

## Verification

- Draft build passes all 14 error rules; 36 existing dense-prose warnings remain
  in 16 other pages. The introduction's targeted dense-prose check passes.
- 1,285 sampled frame pairs across the five new timelines are finite and each
  includes desktop and phone drawings.
- Coordinator inspected desktop and 375 px phone layouts in light and dark,
  including initial/final states and sampled motion. Corrected cramped heading
  spacing and the qualified key routes before final review. Phone has no
  horizontal overflow.
- Keyboard replay, pause and resume exercised on all six figures. Pausing
  changes the label to Resume; replay resets the timeline. Evidence is in
  `article-screens/controls.json`. Figures pause while offscreen and finish in a
  readable state. The existing shared player's reduced-motion/background/
  cleanup evidence is retained; no fresh browser reduced-motion emulation was
  available for this pass. Final-state SVGs and text alternatives are supplied.
- Screenshots and computed token contrast are in `article-screens/`. Some phone
  shots record the layout review before the final stroke-contrast repair;
  desktop shots show the repaired strokes. Screenshots do not establish
  frame-rate quality or real service timing.
- Existing join fixture and query result are reused; neither data nor query
  changed. Cache-aside and local/shared behaviour were checked against
  [Microsoft's pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
  and [Amazon's caching discussion](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/).
  These drawings remain illustrative models, not Redis executions.

The pre-existing draft route gate, collection status and reading index are
unchanged. This commission does not publish the collection or roll the style
out across other collections.

## Placement simplification after user feedback

The user found Figure 2 messy. Removed the duplicate database drawings, source
routes, crossing lines and dashed process enclosures. Desktop now compares two
aligned arrangements side by side; phone stacks them. Each local cache sits
beside its named owner. The shared arrangement has two uncrossed links to one
cache. Every cache is labelled.

The animation begins with A saving an answer, then B checking for that answer.
B either misses its own cache and later fills it, or reuses A's shared copy.
Database reads are deliberately offstage, stated in the caption and text
alternative; Figure 1 still teaches that full path. Removed the diagram's source
read counters. The surrounding placement explanation and example facts remain
consistent. This is a bounded media repair confirmed by the coordinator, not a
new collection review.

Draft build passes with the same unrelated warnings. Sampled placement frames
are finite. Checked desktop and 375 px layouts in both themes, replay/pause, and
the final two-copies/one-copy state. Updated screenshots use `placement-tidy-*`.

## Request origin in the coalescing comparison

The user noted that Figure 5 made the server appear to generate work. Added the
same browser/App symbol used in Figure 1 to both comparisons. All four coloured
requests now start at the App, pass through the Server, and return to the App
carrying answers. Waiting remains at the server, where coalescing happens.
Reply departures are staggered so all four can be followed; the final count
appears after the last reply reaches the App. Captions and alternatives name
the origin and destination. Source counts and the process boundary are unchanged.

Kept cache and database branches separate, with compact geometry for phones.
The changed scene has 261 finite sampled frame pairs, each containing an App
in both comparisons and both layouts. This bounded repair retains the earlier
technical review and shared-player evidence.

Draft build passes with the existing unrelated warnings. Coordinator checked
desktop and phone in both themes, final counts, keyboard replay/pause/resume,
and restored System theme and the default viewport. Screenshots use
`burst-app-*`.

## App origin in the placement comparison

Applied the user's same correction to Figure 2: each arrangement now includes
the browser/App. Its first request reaches A, misses, fills, and returns to the
App. A later request reaches B; B either fills its local copy or hits the shared
copy, then returns the answer to the App. Kept the aligned desktop comparison,
stacked phone panels, and uncrossed routes. Database reads remain omitted and
explicitly scoped in the caption. The example's copy ownership is unchanged.

Playback is 15.5 seconds to allow both requests to complete visibly. The two
answers return at 6.2 seconds and 10.1 seconds (shared) or 12.7 seconds (local);
the final summary follows both. 311 sampled frame pairs are finite, with the
App present in every comparison and layout.

Draft build passes with the existing 36 unrelated dense-prose warnings.
Coordinator checked desktop and 375px phone layouts in both themes, the final
copy counts, and keyboard replay/pause/resume. No overlapping labels or crossed
routes. Restored System theme and the default viewport. Screenshots use
`placement-app-*`. The collection remains behind its draft preview gate.
