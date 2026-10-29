# Relational motion

The approved application-caching drawings are the visual reference. Use quiet,
open space, fine paths, familiar role icons, coloured records/requests, and small
arrival bounces. A drawing should explain itself as it plays once and settles.
Do not turn a paragraph tour into a generic procession of boxes or balls.

`MotionFigure.astro` accepts `collection` (e.g. `foundations/introduction`),
`kind`, `number`, optional `id`, `title`, and `caption`; its default slot can
carry a caption with markup. Each collection module exports `scenes` keyed by
kind. A scene has `title`, `duration` in milliseconds, `alt`, `caption`, and
`render(t, variant)` for t in [0,1]. Optional `actions`, `defaultVariant`, and
`altFor` follow the application-caching player contract. Render landscape and
portrait SVGs with classes `motion-landscape` and `motion-portrait`.

For independent inputs use `choices: [{label, value, options: [{value, label}]}]`.
Their values join with `:` to form the variant; `defaultVariant` must agree.
Replay retains that variant. Relational scenes play while at least 35% of the
drawing is visible, so using controls below a tall scene does not leave Replay
silently waiting for the reader to scroll. They pause offscreen or in hidden tabs.

`drawing.mjs` supplies the caching drawing vocabulary; tailored SVG geometry is
welcome. `makeScene` renders a draw(t, small, variant) function in both layouts.
No autoplay loops. Keep outcomes on screen. Preserve useful input comparisons;
omit step descriptions and step controls when the drawing makes them redundant.
All scene timings illustrate causality, never measured database timings.

Keep exact result tables, query plans, and static figures when inspecting their
values is the point. Redesign the animated/stepped stories, preserving the
reviewed semantics, identities, and conditions in the surrounding article.
