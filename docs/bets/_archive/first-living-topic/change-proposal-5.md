# Change Proposal 5 — stance order settled title-first; diagram captions recorded as interim

**Severity:** minor (two view-spec sentences reconciled to the built product; no API, schema, or ladder change)
**Discovered:** Milestone 2 experience audit, 2026-07-10.

## Discovery / evidence

Two places where the `/[topic]/` spec and the shipped milestone disagreed, each needing an operator ruling rather than a silent edit:

1. **Stance order.** The wireframe drew the stance callout above the article `<h1>` ("the reader meets the position before the title"); the built page — and the article markdown's own document outline, where the `# Databases` heading opens the body — renders title first, then stance. The bet-progress suite pins the built order (stance callout before the first `<h2>`).
2. **Diagram captions.** The spec committed every figure to a designed caption and `alt`, and the render-failure state to "the figure's designed caption in the empty-state pattern" — but the content contract carries no caption channel, so none of it is authorable. The shipped interim: heading-derived `aria-label`s on the rendered SVGs, and the failure state keeps the fenced source readable in the reserved container.

## Change

- **`technical-design/01-ui-design.md`**, `/[topic]/` wireframe: reordered to trust header → `# Databases` → stance callout — title-first is the design.
- **`technical-design/01-ui-design.md`**, `/[topic]/` wireframe figure + States table (Diagram render failure): captions/alt recorded as awaiting the caption channel the writer-skill/content-format bet designs (already a discovery-note item); interim is heading-derived accessible names and source-on-failure.
- **`docs/design-system.md`**, Error & honesty choreography → Diagram/image failure: the same interim recorded.

## Impact

- No code change — both edits reconcile prose to the shipped, reviewed, test-pinned build.
- The caption channel remains a designed obligation, owned by the future writer-skill/content-format bet; when it lands, the interim sentences are superseded by that bet's design.

## Before / after

Before: wireframe ordered stance above `<h1>`; spec promised designed captions/alt and a caption-rendering failure state the content format cannot author. After: title-first order is canonical; captions/alt are a recorded deferral with a named owner (writer-skill/content-format bet), heading-derived accessible names and readable source-on-failure as the interim.

**Decision:** approved by the operator, 2026-07-10 (both items, at the Milestone 2 postmortem).
