# Change Proposal 1 — executeCut landing semantics

**Severity:** minor (contract completion; no pitch or decomposition impact)
**Discovered:** slice 1.3 review, 2026-07-09 — three lenses independently confirmed the gap by executing the built module.

## Discovery / evidence

The technical design specifies `convene` stamps `status: in-research` and then seeds the staged tree, and specifies `executeCut` as a pure byte-copy of the staged tree into `topics/<slug>/`. Nothing assigns responsibility for resetting `status` to `current` at cut time. Empirically confirmed against `core/dist`: convene → author v2 (without touching status) → gate PASS → executeCut lands `status: in-research` as published truth — violating the invariant that `in-research` never appears in git history (02-data-flows). Three sibling gaps in the same landing contract surfaced in the same review: a zero-authoring cut (staged N == live N) passes the gate and commits a no-op "cut"; files deleted in the staged tree survive live (the freshly cut topic then fails its own gate in CI); and nothing binds a GateResult to the directory it validated.

## Change

`03-api-design.md` (Cut mechanics / Session mechanics):
1. `convene` seeds the staged tree **before** stamping `in-research` — the staged baseline always reads `status: current`.
2. `executeCut` owns landing semantics, defined as four rules: (a) the landed live `article.md` carries `status: current` (normalized at landing — published state is always current); (b) the staged version must exceed the live topic's version — otherwise `ContentValidationError` (monotonicity enforced at the landing, not only by convention); (c) landing is a **sync**: `topics/<slug>/` exactly matches the staged tree afterward — files absent from staging are removed, reported in a new `CutReport.removed: string[]` field; (d) `GateResult` gains a `dir` field (the directory the gate validated); `executeCut` refuses a result whose `dir` is not the staged tree it is landing (`GateNotPassedError`).
3. A missing staged tree at `executeCut` is `ContentNotFoundError`, never a silent empty success.

`02-data-flows.md` (Research-Run flow): the convene sequence swaps to seed-then-stamp; the version-cut flow notes the landing sync + normalization.

## Impact

- Pitch: none. Decomposition prose: none (proofs already state outcomes, not landing internals).
- Built artifacts: slice 1.3 code patched in the same pass (convene ordering, executeCut normalization/monotonicity/sync/binding, plus the review's independent patches).
- The `bet/first-living-topic/approved` tag is re-pointed to the amendment commit per the protocol.

## Before / after

Before: executeCut = "writes the staged tree's artifacts into `topics/<slug>/`" (copy-only, status silent, no version check, unbound GateResult). After: executeCut = the landing contract above; convene = seed-then-stamp.

## Addendum (slice 1.4 review, same day)

Four contract completions in the same landing-contract family, discovered wiring the CLI:
- `cut`'s sibling crash window (commit landed, cleanup lost): the CLI probes for a no-op commit and falls through to cleanup — both halves of the crash window now recover.
- `log` gains the mirrored converged re-entry (resolution applied, commit lost → commit + cleanup).
- `discard`'s nothing-to-discard condition now includes the staged tree (an orphaned staged tree — crash between `createTopic` and the session write — is discardable; exit 2 only when none of the three exist).
- `cut --json` branch shapes recorded in contract vocabulary: degenerate CutReport for nothing-to-cut; serialized ContentValidationError for the non-advancing refusal. 03's Response block is normative for cut's human output (01's rendered example aligned).
