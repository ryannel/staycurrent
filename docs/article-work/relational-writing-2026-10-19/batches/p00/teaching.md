# P00 independent writing and teaching review

**Article:** a14, *Joining and summarising data*.
**Verdict:** local figure repairs required before pilot acceptance. The prose and
teaching approach are ready to scale after those repairs; this pilot does **not**
justify rewriting the writer/reviewer skills or substantially rewriting the
article. Its controls reveal mechanisms rather than merely changing labels.

Read the frozen article, all supplied parent/sibling/child scope context and the
article's displayed queries and figure implementation. Applied the three fixed
examples already read in full. Operated all three actual figures in a separate
Chrome tab at the supplied preview, using both modes, stepping and playback.
Checked desktop and 390 × 844 presentation, light and dark themes, keyboard
activation and horizontal scrolling. Restored the original System theme and
viewport afterwards. Reduced-motion emulation was not exposed by this browser;
the motion finding below is from source inspection, not a claimed emulated run.

## Required repairs

1. **Keep the active matrix pair visible on a narrow screen.**
   `JoinFigure.astro:72,100–104`, Figure 1. At 390px the scrolling region is 337px
   wide over a 460px matrix. The final highlighted Sol/order-105 cell is off the
   right edge. More seriously, manually scrolling right to 56.5px and pressing
   Next reset the scroll position to zero: replacing the board destroys the
   scroll container on every frame. This prevents watching the emitted pair even
   after the reader makes room for it. Preserve the container/scroll position
   and reveal the current cell, or adapt the matrix to fit. Recheck stepping and
   playback through the fourth column at this width.

2. **Retain keyboard focus at playback endpoints.**
   `JoinFigure.astro:75–76`. Keyboard Enter on Figure 2's final Next changed it to
   disabled and moved focus to `BODY`. The reader loses their place in a long
   article. Hand focus to an appropriate enabled playback control when disabling
   the focused Next or Back, as the Indexes reference does. Recheck both ends in
   all figure modes with keyboard activation.

3. **Disable the keyframe animation under reduced motion.**
   `JoinFigure.astro:108–109,123`. The media query disables transitions only;
   `.ja-current` still runs `ja-arrive` on each newly rendered frame. Include
   animations in the reduced-motion override. There is no automatic playback on
   load, so no new autoplay policy is needed. Verify a current pair/source chip
   changes instantly with the preference enabled when a supporting test surface
   is available.

## Teaching findings

- The opening explains the failure before introducing machinery. The customer
  report keeps a stable row contract and one connected fixture through the
  article. Expected rows distinguish inactive, unknown and multiplied results.
  Terms arrive with concrete examples. Composite-key and self-join asides are
  brief, and the article respects the composition, values, windows and
  performance boundaries. The stated parent prerequisite supplies staging
  notation without sending readers on a specialist detour.
- Figure 1 changes four legitimate matching pairs into twenty possible pairs;
  the emitted-pair count and represented-customer count teach different facts.
  Figure 2 exposes matching, null extension and later filtering separately. Its
  ON mode retains five customers in six rows; WHERE retains three in four. Tariq
  and Edda visibly fail for different reasons.
- Figure 3 is the strongest explanation: source identities remain visible as
  each pair contributes to running sums, reaching the wrong 100/60. The repair
  creates separate 50 and 30 subtotals before joining one row to each. Repeated
  legitimate payments remain separate. The prose interprets the same evidence
  rather than asking readers to trust a rule about joins.
- These animations are staged table/chip highlights and narrated state changes,
  rather than the references' travelling SVG objects. That is sufficient for
  these logical mechanisms: the reader can predict a result, change an
  assumption and inspect the changed contributions. The captions clearly
  distinguish the model from observed engine execution. Theme presentation was
  legible, and no page-level horizontal overflow occurred at 390px.

## Optional improvements

- Give waiting/emitted/current states a text or accessibility equivalent in
  Figures 1 and 3. At the first step, the accessibility tree already contains all
  future pairs/subtotals, while the counters describe zero output; opacity alone
  distinguishes future content. The current narration helps, but explicit state
  makes independent inspection clearer.
- The counts/completeness/conditional-total section is the densest reading.
  A small contribution table beside the guarded CASE expression could reduce
  the effort of comparing paid-order counts with known paid values. This is
  polish, not a missing fourth interactive figure or a reason to expand scope.
- Consider pausing playback when its figure leaves view and suppressing repeated
  live-region narration during continuous play, following the references.
  Present playback remains manual and paced well enough to read.
