# Learning-tools repair verification

19 October 2026. All commissioned repair and independent review is complete as a
draft. This supplements the original native-experiment verification; those
retained server observations were not rerun or replaced by browser models.

## Models and repository checks

`node --test` over the three new folders passes 64 focused tests: 14 design,
25 operation and 25 product groups. They cover meaningful variation and failure
boundaries, including empty children, NULLs, temporal boundaries, stable export
membership, incomplete commit, snapshot decisions, authority loss, replay-safe
capacity, schema contraction and upgrade gates. A range-control invariant checks
that native controls can represent their defaults without clamping them.

`pnpm test` passes all 15 site-check tests. The final private preview build passes
all 13 site rules, with 235 routes including isolated model views. The normal
production build also passes all 13 rules and emits no `dist/review` files. It
was run last so the saved search index matches the published site. No live
article body, reading availability entry or public navigation was changed.

## Browser and independent readings

`rendered-matrix.json` records all 54 articles at 1440×1000 and 390×852, each in
light and dark. All 216 states have their article title, no page overflow or
broken images, ready nonempty new tools and no invalid computed result text.
The two final phone-card repairs were rechecked in all four configurations.
These DOM checks establish layout and hydration, not teaching quality.

The three independent aid-first reviews chose 120 initial changed cases:
26 design, 39 operation and 55 product. Predictions were recorded before the
coordinator executed the choices. Each case started from defaults; requested
control values were checked in the actual DOM. The reviewers inspected returned
pixels and text, then article source, rendered bodies and model context. Product
review explicitly distinguishes its first 32 changed-image readings from 23
later informed readings. The fresh introduction review adds two uncued cases and
an editorial recheck of the opening.

The coordinator captured every one of the 64 new aid placements at phone width
in both themes. The original reviewers inspected all 128 images. Design review
found two remaining hidden-outcome tables, repaired them as labelled phone cards,
and inspected four replacement images. Operation and product sweeps found no
further essential rendering defect. Representative images are retained in
`screenshots/`; raw rendered packets remain in
`/private/tmp/staycurrent-media-review/` while that temporary directory survives.
Permanent first readings and resolutions retain the consequential observations.

`browser/` saves the independently chosen cases and repair checks. In the fresh
introduction case file, rl76-1 and rl76-2 are case identifiers: both operated the
same `/tools/rl76-1/` aid. Its report records that operation accurately.

Keyboard testing covered the three new component families. Range keys and native
selector menu keys changed inputs; Enter on Reset restored both the initial
control values and represented result. `browser/keyboard-reset.json` records the
actual states. Native macOS selectors were opened and selected with arrow keys
and Enter; End alone did not select an option. Identity's combined NOLOGIN and
new-role action was inspected in the selected state.

## What this does not establish

These are agent reviews with a coordinator-operated browser, not a human learning
study or independent manual execution on every assistive technology. The models
are bounded explanations; native product claims retain their separate evidence.
The Astro development toolbar overlays small parts of some temporary captures;
reviewers distinguished that preview chrome from article layout. Browser theme
and viewport overrides are reset after verification.

No unresolved finding blocks draft acceptance in the recorded scope. The earlier
rejected judgements and their repairs remain visible. Publication is a separate
user decision.
