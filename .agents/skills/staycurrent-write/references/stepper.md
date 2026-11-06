# Stepped figures

Reuse shared article infrastructure for presentation and controls; build the scene for the explanation.

Use [stepper.mjs](../../../../src/components/figures/stepper.mjs) with the figure root, `steps()` and `draw(step)`; call returned `render` when options change.

| Attribute | Element |
| --- | --- |
| `data-play`, `data-back`, `data-next`, `data-reset` | Four buttons |
| `data-step` | Step counter, e.g. “2 / 5” |
| `data-hold` | Hold bar containing one `span` |
| `data-live` | Every part whose text changes between steps |
| `data-explanation` | Step explanation with `aria-live="polite"` |

Playback holds each step long enough to read changed text, with pause and manual stepping always available. Mark all changing text `data-live` so timing sees it. Back/Next use `aria-disabled` at the ends to retain focus. The hold bar does not animate under reduced motion.
