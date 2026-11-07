# Figures

The house style is [Figure style: ink and tokens](../../../../docs/figure-style.md). This
guide covers when to draw, how to build and how to check.

## The learning target

A reader following only the figures, their visible labels, captions and controls should
understand the article's main mechanisms, consequential failure cases and practical
choices. Each figure explains its own setup, cause and outcome without the article body.
The sequence builds a connected explanation, with consistent identities and terms.
Detailed code, derivations and supporting evidence can remain in the prose. The prose
also remains independently complete; these are two ways to learn the same subject.

Use the plan's visual coverage to choose what to draw. State briefly what the viewer
should understand from each figure and what the visual form contributes. Revisit the
map as figures develop: individually clear examples can still leave major gaps in the
article's explanation. Do not substitute a figure quota for that judgement.

## Design the explanation

Draw when seeing something saves the reader real effort. That means timing and order,
who waits for whom, accumulation and contention, scale, or values changing in a
structure. Choose example variation and counters that expose the mechanism being taught.
In a comparison, keep the common setup recognisable and make only the relevant difference
change. Show enough starting conditions, readable values and intermediate changes for
the viewer to see why the outcome follows. Let motion reveal timing, order or change;
use a still drawing or table where that explains the relationship more directly.

Captions may establish context and interpret the result, but the visual must do
substantial explanatory work. A long caption or text alternative cannot rescue an
unintelligible animation. If the viewer must guess a connection, simplify, split,
reorder or change the visual form. Settle on a useful final view and allow replay
without requiring elaborate instructions.

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

Check both each figure's lesson and the sequence's coverage. Provide a figures-only
preview using the same components, data, order and visible captions as the article.
Exclude article prose, author notes and teaching plans from the page and its DOM.
For the initial visual reading, keep long text alternatives and explanatory accessibility
descriptions out of the review surface too: browser snapshots can otherwise supply the
answer without the reviewer seeing it. Preserve them on the normal article and review
their accuracy afterwards. A hidden article body is not an isolated preview.
Keep review routes behind a preview flag and out of normal builds and search.

Check each new or changed figure on the rendered page:

- at 375 px and on desktop, in light and dark;
- watched from its first frame to its settled final frame;
- with every control and option exercised, including by keyboard;
- against the defect list in the figure style;
- for contrast: 4.5:1 for text, 3:1 for large text and graphics.

A change to a shared layout, player or drawing primitive needs these checks across the
affected figures. Unchanged figures keep their earlier checks. Without browser access,
report the rendered checks as not done; do not infer them from source.

The independent [visual lens](../../staycurrent-review/lenses/first-visual-reading.md) tests the
learning target. Rendering checks establish legibility and operation, not comprehension.
