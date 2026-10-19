# a01 writer handoff

Status: ready for orchestrator-managed review. No nested reviewers, shared changes, commits or pushes were performed by this worker.

Current repair status: B01's three required a01 findings are addressed. The root has re-promoted the staged fragment, including the new pre-DDL model; no prose changes followed that promotion. Native exact-case checks, compact mobile comparison and endpoint keyboard checks passed. Shared HMR interrupted one timed-playback observation; the root will perform the independent complete timing recheck on a fixed preview. See the repair evidence appended to sources.md.

## Ready files

- `docs/article-work/relational-writing-2026-10-19/nodes/a01/article.astro` — staged fragment; imports resolve from the assigned final article location.
- `src/components/relational-next/a01/FactOwnership.astro` — native model with copied/owned storage selection and four change steps, manual and timed playback, accessible explanation and no-script outcome text.
- `src/components/relational-next/a01/KeysFigure.astro` — pre-DDL customer/booking/session model with complete keys, new-number duplicate and cross-tenant cases, manual check steps and acceptance/rejection.
- `src/components/relational-next/a01/schema.sql` and `fixture.sql` — single-source displayed executable example.
- `src/components/relational-next/a01/verify.sql` — native assertions and invalid-change evidence.
- `src/components/relational-next/a01/verify-keys.sql` — exact new figure cases checked in a rolled-back transaction against the unchanged schema.
- `docs/article-work/relational-writing-2026-10-19/nodes/a01/sources.md` — primary sources, native result table, limitations and rendering checks.

## Teaching and scope

The parent provides a complete first booking design: requirements, row meanings, candidate and selected keys, tenant scope, value meanings, an executable schema, fact ownership, agreed versus current prices, retained cancellation and review against reads/changes. It makes one-place and one-retained-record assumptions explicit. The normalisation model lets readers compare the same correction under different fact ownership and distinguish intended historical price differences from stale current-name copies.

Detailed types and missing-state representations go to a09; conditional uniqueness, constraint timing and stronger declarative mechanisms to a10; safe decomposition and derived-copy contracts to a11; history patterns and lifecycle policy to a12. Capacity protocols go to transactions; measured read/write tradeoffs to performance; live constraint deployment to live changes; removal beyond current rows to operations. Contextual links retain supplied stable anchors. The shared wrapper provides the bottom child list.

The deliberate capacity gap is in the enforcement inventory, not hidden in code: all relevant operations need a protected transaction protocol. Agreed-price capture and permission to amend are also explicit protocol/authority obligations. No concurrency, performance, historical reconstruction or erasure guarantee is inferred from the schema tests.

## Verification and integration

Native PostgreSQL 18.6 checks passed in `rel3_a01_run1`; see sources. Compile checks on staged fragment and owned component returned zero diagnostics. Shared preview loaded successfully. Browser checked all four figure states, both storage choices, final Next focus and timed playback stopping at cancellation with focus retained on the restored Play changes button. Endpoint handlers clamp step values and use aria-disabled to preserve focus; styled paragraphs avoid headings inside figures. Screenshot inspection led to overriding inherited section margins.

The orchestrator already re-promoted the repaired staged fragment for preview. It includes the identifier-label clarification and key-model entrance; no further promotion is currently needed. Mobile comparison now measured 596px at 390 × 844, with both conflicting booking names, narration and transport visible together. The key figure measured 747px with no page horizontal overflow. Narration-aware playback replaces 1.8-second cycling; see sources for timing observations and the shared-HMR limitation. Browser viewport and System theme were restored. Full build/site check and fixed-preview independent recheck remain with the orchestrator. One initial reference preview process briefly started on port 4347 was stopped; shared port 4337 was reused.

## Proposed tree changes

None. The current parent/child boundaries support this design without curriculum expansion.
