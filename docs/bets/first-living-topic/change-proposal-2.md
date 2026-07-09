# Change Proposal 2 — companion-skill authoring deferred

**Severity:** minor (operator-directed scope change; ladder shape unchanged)
**Discovered:** operator review of the databases v1 article, 2026-07-09.

## Discovery / evidence

Reviewing the founding article, the operator deferred companion-skill authoring: skill design should wait until the article format settles across more than one cut, and the one-skill-per-topic assumption is itself in doubt — the databases topic will likely yield several focused skills rather than one. Authoring a full skill now would bake in a shape the operator expects to change.

## Change

- **Slice 1.6** cuts v1 with the seeded skeleton skill, rewritten as an honest placeholder: its description states plainly that the skill is not yet authored, that skill design is deferred, and that the article is the stance's only rendering. The `article_version: 1` binding and byte-identical live/snapshot pair stay intact — the gate's skill machinery is proven; the skill's *content* is deferred.
- **Pitch Success Signal 2** re-scoped: M3 proves the distribution *mechanism* — the install page renders, the payload tree and zip are fetchable, the placeholder is honestly labelled where a reader meets it. Stance-fidelity of an installed skill (the original signal) moves to the future skill-authoring bet.
- **M3 (published-trust)** acceptance adjusted to the same scope; the install page carries the placeholder state as a designed honesty state ("companion skill forthcoming"), not a broken promise.
- **M4 (loop-closes)** unaffected: a research run cuts v2 of the article; the placeholder skill rides through the gate unchanged.

## Impact

- Product brief's "article and skill never disagree; both cut in the same version" holds — a placeholder that says "the article is the only rendering" cannot disagree with the article.
- The skill-design question (one topic → many skills; what a skill's unit is; how the install page presents a set) is captured in discovery notes as input to a future bet. The content contract (`topics/<slug>/skill/`) is NOT redesigned in this bet.
- No slices added or removed; slice 1.6's proof drops "skill authored to the stance" and keeps the founding cut.

## Before / after

Before: slice 1.6 = author companion skill + execute founding cut; Success Signal 2 = installed skill answers per the stance. After: slice 1.6 = honest placeholder skill + founding cut; Success Signal 2 = distribution plumbing proven with the placeholder honestly labelled; skill authoring and skill-unit design deferred to a dedicated bet.
