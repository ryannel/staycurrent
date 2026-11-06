# Figure style: ink and tokens

Chosen 5 November 2026 as the house style for article figures, after comparing six
directions in the [style lab](reviews/process-review-2026-11-05/style-lab.html). Study A
is the reference rendering. This document governs new and repaired figures. The
pencil-and-wash guidance in [illustration-style.md](illustration-style.md) still applies to
raster illustrations, and Drawing systems keeps its plain notation drawings, because those
teach notation itself.

The style borrows nothing from the subject's real products: no logos, brand colours or
product art. Shapes are generic roles.

## The picture

- **Canvas.** No frame or panel. The figure sits on the page's own paper with generous
  space. Desktop and phone get separate layouts drawn for their widths, never a scaled-down
  desktop picture.
- **Ink.** Fine strokes, about 1.8 units, in the ink colour. Paths between roles are lighter
  `--line` strokes with a gentle curve.
- **One icon per role, used everywhere.** App (window with two dots), server (circle with two
  racks), cache (ring), database (cylinder), load balancer, worker and queue. They come from
  `src/components/relational-motion/drawing.mjs`; extend that library rather than drawing
  a new variant.
- **Tokens are flat discs.** No highlight, gradient, glow or drop shadow.
- **Values ride on chips.** Anything carrying a value the reader should read (an answer,
  a key, a version) is a small rounded chip with the value printed on it, for example
  `£20`. If the reader should be able to read a value, draw the value.

## Colour has two jobs

| Token | Light | Dark | Meaning |
| --- | --- | --- | --- |
| `--c0` coral | `#c4603f` | `#e08a6c` | First identity (request, product, customer) |
| `--c1` blue | `#4f7ea3` | `#93b4cd` | Second identity |
| `--c2` amber | `#b07d22` | `#d6ac67` | Third identity |
| `--c3` plum | `#8b6e98` | `#b39cc2` | Fourth identity |
| `--cache` teal | `#277a73` | `#8ac7bb` | The cache, the accepted path, the useful outcome |
| `--miss` | `#b4523a` | `#ee9a7e` | A miss, a refusal, a failure, shown briefly |
| `--db` | `#9a6b1f` | `#d6ac67` | The authoritative source |

Identity colours say *which thing*. Teal says *useful or cached*. Never use colour only to
decorate, and never let colour carry meaning that a label or position does not also carry.

## Type and titling

- Labels use the site sans at about 21 units, with values a step bolder. Labels carry a
  halo in the background colour, so a path can never cross their letters.
- Each figure has **one title**: the caption. A short line inside the drawing may state
  the outcome ("4 database reads"), but it does not repeat the caption.
- Provenance ("timings are illustrative") belongs in the article's closing section on
  where the numbers come from, not in every caption.

## Two registers

1. **Flow register.** Roles, paths and moving tokens, for anything about who calls whom,
   in what order, and what waits. Most caching and distributed figures.
2. **Data register.** The same ink, palette and type, but with unframed cells carrying
   real values: B-tree pages with their keys, buffer slots, WAL records, byte layouts,
   result rows. Use it whenever the lesson is in the values. The reference Indexes B-tree
   shows the content; draw it in this ink, without its panel and stepper chrome.

## Motion and controls

- A figure plays once when it becomes visible, then settles on a final frame that holds
  the whole lesson. No loops.
- Motion shows cause: a request travelling, a fill arriving, a slot held, a reader
  waiting. A short arrival pulse is the only flourish.
- Pause and Replay are text links at the bottom right. Variants are underlined text tabs
  at the bottom left. Nothing sits above the drawing.
- Use the step-through stepper only when the reader needs to count states.
- Reduced motion shows the final frame.

## Defects to check on every figure

- No label overlaps another label, a token or a path.
- No label sits on a token.
- Token treatment matches the rest of the site (flat).
- Values the lesson depends on are drawn, not replaced by dots.
- One title, no duplicated headline.
- Light and dark at desktop and 375 px, including the settled final frame.

Existing figures that break these rules are listed in the
[5 November review](reviews/process-review-2026-11-05/README.md#3-art-style). Fix them when
an article is next substantially revised; a targeted repair fixes only what its findings
name. A separate restyling sweep has not been commissioned.
