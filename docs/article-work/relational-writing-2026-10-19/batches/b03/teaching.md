# B03 independent writing and teaching review

**Verdict: a03 passes its narrow recheck; a04 needs two shared-player repairs.** The prose and article approach can continue to scale under the existing updated skill. These are local implementation repairs, not grounds for another skill rewrite.

Used the three fixed references previously read in full, including their figures. For a03, compared the B02/B03 worksheet change and checked its rendered text; retained the B02 pass for the three unchanged figures. For a04, read the full article, player and all model paths, and supplied parent/sibling/child scope context, against the already-read available family drafts. Component hashes matched the manifest. Operated the five real comparisons in a separate Chrome tab on fixed preview **4437**: all ten paths, every manual step, both endpoints, comparison changes, Play/Pause/Reset and all five text alternatives. Checked 390 × 844 and desktop layouts and light/dark views. Restored System theme and the normal viewport.

## a03 — Making concurrent changes correct: pass

The repaired “Initially absent identity” worksheet row (`a03.astro:144`) now describes two complete reservation attempts. Each guarded decrement must affect one row before inserting; the attempts use different class rows but compete for the same request identity. B waits for A, its insert fails, and rollback restores class 22's place. The expected committed states explicitly give class 21 zero remaining/one reservation and class 22 one remaining/no reservations, with both satisfying the invariant. The contrast now teaches uniqueness without silently breaking the enclosing reservation protocol.

**Required:** none remaining in the assigned recheck. **Optional:** the B02 suggestion to link directly back to Figure 1 remains optional. No unchanged teaching work was repeated.

## a04 — Building applications around a relational database: repair

The prose has a coherent first working route. Mina's order connects value conversion, authority, connection ownership, generated work, uncertain replies and discoverable external work. Terms are introduced before use; concrete snippets precede qualifications. The ownership outline names its invented cleanup helper and explains its contract instead of suggesting a nonexistent driver method. The acceptance table clearly separates proposed application checks from the narrower native observations.

The article builds on a03's transaction distinctions and gives useful first answers before handing detailed cleanup, loading strategies, idempotency protocols and worker claims to a20–a23. The value table's date/instant example and explicit microsecond loss are sufficient at this level. The bounded ten-order ORM table gives a small, checkable 11/1/2-statement comparison and distinguishes rows from objects; no additional interactive figure is required there. Deeper cardinality and loading experiments belong to its child.

The existing figures provide useful comparisons, although their common presentation is closer to a narrated state sequence than the references' richer spatial models:

- **Figure 1:** the database becomes committed while the API still waits; then the API knows while a lost HTTP response leaves the user without confirmation. Changing the case preserves the step and the committed order.
- **Figure 2:** changing representation at binding sends `9007199254740992` instead of the original `9007199254740993`; readback preserves the wrong value. This illustrates where precision was lost, rather than falsely blaming binding or PostgreSQL.
- **Figure 3:** holding A's client leaves C queued despite A being idle; releasing lets C borrow and execute. Occupancy and SQL activity are separate state fields.
- **Figure 4:** the same missing confirmation accompanies either no committed order or committed order 103. The application's evidence stays insufficient in both paths.
- **Figure 5:** after process death, pending J9 survives with the order and can be discovered; the last step retains uncertainty if the worker's successful call is not recorded. Durable intent is not presented as completed fulfilment.

Thus the controls reveal actual changes in the explanation; their mere presence is not the basis for approval. Neither continuous movement nor another figure quota is needed. Repair the shared player's reading and keyboard behaviour below.

### Required

1. **Preserve endpoint keyboard focus — `a04/BoundaryPlayer.astro:34–35`.** In every one of the ten paths, Enter on final Next moved focus to BODY. Returning with Back to the first step did the same. Move focus to an available control before disabling the active endpoint, or retain a properly guarded accessible endpoint as a03 does. Recheck both ends in all five scenes and both choices. The page should remain operable from the figure after reaching its boundary.
2. **Budget playback for narration and comparison — `BoundaryPlayer.astro:45`.** All scenes use a fixed 4.5-second interval. That is too short for the longer detail plus the two changed state fields: Figure 4's settled-state explanation alone asks readers to distinguish what a new session observes from what the original caller could infer; Figure 5's final job state adds a second failure window. Figure 2 also asks readers to inspect a one-digit difference in long identifiers. Adopt narration-aware holds with comparison time, preserving pause and manual stepping. Recheck Play through the longer states, including phone views; the reference players and repaired siblings already establish this pattern.

### Optional

- **Make Figure 3's resource mechanism more visual (`scenes.mjs:35–45`).** Two persistent pool slots labelled with their current owners, plus waiting C, would reduce the remaining need to reconstruct occupancy from sentences. Show idle-but-leased A retaining its slot, then C taking that same slot when A releases. The current three-state contrast is understandable, so this is an enhancement rather than another required model.
- **Retain the source identifier and mark the changed digit in Figure 2 (`scenes.mjs:21–33`).** At Bind, both displayed values contain the rounded number; the original is only in an earlier step or the prose. A persistent original and an underlined changed digit would make the comparison quicker without relying on colour.
- **Compact mobile whitespace (`BoundaryPlayer.astro:58–60`).** At 390px the figures were roughly 840–899px tall, largely because the short event receives a 12rem minimum height and the state cards stack. The changing facts and transport are readable together; positioning the choices and lower fields together takes more scrolling than necessary. Reduce the empty event space or compact the state comparison while retaining legible values and touch targets. There was no page overflow.

## Limits and next check

The controls, text alternatives, state changes, selected-choice indicators and focus outlines were legible in both themes. Reduced-motion emulation is unavailable here; source inspection found no travelling/fading/keyframe animation, and playback starts only on request. This review makes no claim of a screen-reader or emulated reduced-motion audit, nor of native application/driver correctness beyond the separate practitioner work.

Recheck the two required player repairs narrowly, preserving the good prose and comparisons. The current skill already asks for readable playback and keyboard use; the repeated defect calls for applying and verifying that guidance in the article, not expanding the skill.
