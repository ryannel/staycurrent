# Rendering and build evidence

This receipt contains implementation checks, not an independent comprehension verdict.
Supply it only after the new reader has saved its unaided account.

The frozen review build is described in `frozen-v1.json`. The article prose is unchanged
from `0c0b831d`; only figure components and numbering were added in its source. The ten
isolated SVGs, captions and order match the normal article. Normal articles retain all
ten long text alternatives; the isolated DOM contains neither those nor body prose.

Both flagged and normal builds pass. The normal build excludes the figures-only route.
All 24 site-check tests pass and the article-specific dense-prose check passes. Existing
warnings elsewhere are unchanged.

The author checked final-state geometry through Chrome using a temporary gallery built
from the same scene renderers. `geometry.json` records 23 variants × four combinations:
375 × 812 and 1488 × 973, light and dark. It measures text bounding boxes for overlap,
overflow and horizontal page scrolling. A collision in the retry diagram was found and
repaired; `geometry-v1.json` retains the first result. This is a layout measurement, not
proof that every image was visually judged or that animations played correctly.

After that pass, the Redis-unavailable variant gained its numerical fleet comparison
and outcome bar. That variant needs a new rendered check in the frozen build. The other
22 variants retain their geometry checks. Representative phone captures are retained;
the earlier outage capture is named `before-fleet-comparison-phone-light-admission-outage.png`.

Fresh author playback observations sampled initial and settled states of stampede,
coordination (both variants), XFetch and admission, in the desktop dark layout. They
do not replace the fresh reader's playback check. The shared player and CSS/palette are
unchanged, so their prior keyboard, contrast and reduced-motion implementation evidence
can be reused where applicable. New controls and new layouts still need interaction and
visual checks. Earlier measured contrast minima were 4.76:1 light / 6.83:1 dark for text
and 3.85:1 / 4.84:1 for meaning-bearing graphics; supplementary gridlines were excluded.

Reduced-motion emulation and screen-reader-software testing have not been performed.
The independent visual reviewer should record fresh observations separately and state
any unavailable check, rather than treating this receipt as a full rendered approval.
