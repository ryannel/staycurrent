# Figures

The house style is [Figure style: ink and tokens](../../../../docs/figure-style.md). This
guide covers when to draw, how to build and how to check.

## When a figure earns its place

Draw when seeing something saves the reader real effort. That means timing and order,
who waits for whom, accumulation and contention, scale, or values changing in a
structure. Choose example variation and counters that expose the mechanism being taught.
In a comparison, keep the common setup recognisable and make only the relevant difference
change. If a figure needs instructions before it can be understood, it is teaching too
much at once. Split it, or let the prose carry part of it.

## Building

- **Animated flows.** Use `src/components/relational-motion/`: `MotionFigure.astro` with
  scenes built from `drawing.mjs`. Its README gives the scene contract. Extend the
  drawing library rather than drawing a new variant of a role icon.
- **Counted states.** When the reader needs to step through states and count them, use
  the shared stepper; see the [stepper guide](stepper.md).
- **Data register.** Draw real values in cells: keys, pages, records, bytes. Use exact
  result tables and query plans when inspecting the values is the point.
- Keep shared data and outcomes in one place, and use site colour tokens only.
- Give every interactive figure a text alternative.
- Label illustrations as illustrations. Engine behaviour presented as observed needs
  [database verification](database-verification.md).

## Checks

Check each new or changed figure on the rendered page:

- at 375 px and on desktop, in light and dark;
- watched from its first frame to its settled final frame;
- with every control and option exercised, including by keyboard;
- against the defect list in the figure style;
- for contrast: 4.5:1 for text, 3:1 for large text and graphics.

A change to a shared layout, player or drawing primitive needs these checks across the
affected figures. Unchanged figures keep their earlier checks. Without browser access,
report the rendered checks as not done; do not infer them from source.
