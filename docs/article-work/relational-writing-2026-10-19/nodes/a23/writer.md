# a23 writer handoff

Status: ready for orchestrator-managed article reviews. No nested agents, final article writes, shared edits, staging, commits, pushes or full builds.

## Delivered

- Staged article: `article.astro` (imports resolve at final `src/articles/relational-next/a23.astro`).
- Owned components: `src/components/relational-next/a23/WorkBoundary.astro`, `scenes.ts`, `rehearse.mjs`.
- Evidence: `evidence/native-results.json` and `evidence/owned-checks.json`.
- Source/limitations record: `sources.md`.

The article follows Mina's order 103, mug and two packets of tea, from actual a04. It reads the completed a20/a21/a22 siblings and preserves their division: connection cancellation/reuse → a20; application query work → a21; request idempotency and uncertain database commit → a22. This article owns durable external intent, worker claims, attempt/operation identity separation, external uncertainty, payload meaning and the limited capture comparison. Schema rollout, data lifecycle policy and monitoring link to the registry's actual destinations. All seven required heading IDs are preserved; no tree changes proposed.

The three fixed reference articles were consulted in full, with their figure placements, controls and explanations: definitions precede mechanism, one worked example recurs, each figure asks the reader to change one condition, and following prose interprets the endpoint. The new players use compact state cards and a five-step causal path for the boundary being taught rather than unrelated decorative artwork.

## Learning tools

Five independent comparisons:

1. Call before commit / after commit / inside transaction / commit intent.
2. A completes / dies after claiming / outlives lease and returns obsolete completion.
3. Receiver suppresses repeats / accepts each request.
4. Immutable accepted fact / pointer to current state.
5. Poll outbox / capture outbox, retaining the common hand-off gap.

All variants retain the same current step when changed. Each has Play/Pause, Back, Next, End and Reset; each automatic step holds for 6.5 seconds. Play centres the figure; playback stops when hidden or no longer fully visible. Initial SSR content gives the starting state. Dynamic updates use textContent and data attributes on already scoped DOM nodes, so Astro scoped CSS remains valid. Phone styles use compact cards and explicit local list/paragraph margins, with no nested article section elements; light/dark presentation uses shared tokens. No figure contains heading elements.

## Verification and limits

Astro compiler: no diagnostics for both owned Astro files. TypeScript: scene data and extracted browser script pass. Node: downloadable worksheet syntax passes. Registry links and all required anchors pass; retained in owned-checks.json. Native PostgreSQL and loopback delivery rehearsal passed; retained output has zero remaining database sessions and successful cleanup. No changes to repository dependencies or the shared server.

Root should stage the article and run normal build/site checks and rendered desktop/phone/light/dark interaction review. No complete-site rendered review is claimed by the writer: the fresh staged fragment has not been placed in final src by this worker. In particular check figure height at 390 px width during the longest captions and endpoint narratives, and the screenshot-visible scenario select. No browser download click or event wait was performed.

The receiver is deliberately synthetic and in-memory; the article explicitly labels the acceptance counts and does not call them shipped parcels or durable real-provider deduplication. Capture is documented rather than executed. Lease expiry is a controlled fixture change. The short claim uses a tested native PostgreSQL mechanism; any production claim indexes, service capacity, retention intervals and receiver contracts require their owning workload/deployment checks.
