# Change Proposal 4 — zero-topic build is structurally impossible; empty-state proof re-scoped

**Severity:** minor (one proof observation re-scoped; no API, schema, or ladder change)
**Discovered:** slice 2.3 delivery (worker blocking concern, verified empirically), 2026-07-10.

## Discovery / evidence

Slice 2.3's proof requires the `/` first-run empty state to be proven "through the same real pipeline against a temporary zero-topic copy of the tree". Verified against multiple real `pnpm build` runs: Next.js 16's `output: 'export'` hard-fails the entire build whenever a dynamic route's `generateStaticParams()` returns zero entries (`Error: Page "/[topic]" is missing "generateStaticParams()" so it cannot be used with "output: export" config` — `hasGenerateStaticParams` requires ≥ 1 prerendered route). A genuinely empty `topics/` tree therefore does not produce a deployable site with an empty-state home page; it does not build at all. The constraint is inherent to the committed route shape (`app/[topic]/page.tsx` + static export), not to the empty-state implementation, which is correct and covered.

## Change

- **`decomposition/02-article-readable/03-library-about-404.md`**, Proof of work: the empty-state observation is re-scoped — proven at the component and data layer against a validly-empty tree (the designed sentence, the framework-docs link, zero cards), with the zero-topic build constraint named rather than a real-build walk that cannot exist.
- The zero-topic-deploy constraint is recorded as **input to the framework-extraction bet** (discovery notes → Bets): a fresh Stay Current instance starts with zero topics, so extraction must confront the `[topic]` static-export shape (conditional route emission, a seeded starter topic, or an export-mode change) before "the first research run creates one" is literally true for a new instance.

## Impact

- Nothing on this bet's path deploys zero topics — `topics/databases/` exists from Milestone 1's founding cut, and every milestone proof runs against it. No slice is added, removed, or re-scoped beyond the one observation.
- The empty state remains implemented, styled, and covered (component + data-layer tests); the `/` view's Populated and First-run states are both real code, not dead spec.
- The product claim "No topics yet. The first research run creates one." stays honest for readers — the state is unreachable on this deployment precisely because a topic already exists.

## Before / after

Before: "The first-run empty state is proven through the same real pipeline against a temporary zero-topic copy of the tree — the designed sentence renders in the vacated grid, and the repository's own `topics/` is never touched." After: the empty state is proven at the component and data layer against a validly-empty tree; the zero-topic build constraint (Next static export requires ≥ 1 `[topic]` route) is recorded for the framework-extraction bet; the repository's own `topics/` is never touched.

**Decision:** approved by the operator, 2026-07-10 (over engineering zero-topic buildability mid-milestone).
