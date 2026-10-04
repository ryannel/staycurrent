# Rows to columns illustration

Asset: `public/images/explainers/rows-to-columns.png`

Generated on 2026-10-02 with the built-in imagegen tool. Used in
`src/pages/explore/column-stores.astro`. The selected result was inspected:
four records on the left, four fields per record, four corresponding column
stacks on the right. The teaching illustration uses four fields; the working
page-read model introduces six and computes all quantities independently.

## Original prompt

Use case: scientific-educational
Asset type: wide editorial cutaway illustration for an interactive essay about column-oriented databases.
Primary request: A beautiful, precise exploded isometric illustration showing the SAME small table of data transformed from rows into columns. Warm ivory paper background, refined graphite linework and softly shaded translucent solid blocks, scientific museum exhibit quality. Left: four horizontal record trays, each holding four equal blocks colored in the identical sequence teal, amber, muted blue, terracotta. Right: four vertical separated stacks, each stack containing four blocks of ONE corresponding color: teal stack, amber stack, blue stack, terracotta stack. This teaches grouping identical fields together. A thin curved arrow connects the two arrangements. On the right, the teal and amber stacks are gently illuminated while the other two recede in pale neutral tones, suggesting selective reading. Accurate counts: four records, four fields. Lots of breathing room, restrained elegant composition, tactile surfaces, delicate soft shadows. No decorative circuitry, server racks, neon, gradients in the background, or glowing science fiction.
Text (verbatim): only two small elegant labels: "ROWS" beneath the left arrangement and "COLUMNS" beneath the right.
Constraints: landscape 3:2 composition. No additional text, no numbers, no logo, no watermark. Original illustration, editorial information design.

## Targeted correction

Correct this educational illustration with exactly one change: the LEFT arrangement currently has FIVE horizontal trays. Remove the bottommost tray and all four colored blocks on it, leaving EXACTLY FOUR horizontal trays, each still holding teal, amber, blue, terracotta blocks. The right arrangement already has four stacks of four blocks each; preserve it exactly. Preserve the labels, the arrow, paper background, perspective, shading, and artistic style. Do not add anything.

The correction was applied to the original generated illustration by explicit
local path. An intervening output based on the wrong screenshot reference was
discarded and is not used in the project.
