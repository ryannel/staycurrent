# Slice 1.2 — core: Publish Gate

**Owner service:** core

**Surface:** core

**Complexity:** M

**Prerequisite:** Slice 1.1 merged

## Scope

This slice builds the one place gate logic exists: `runPublishGate`, the nine mechanical checks that decide whether a topic-shaped directory is internally consistent enough to become — or remain — published truth. It is the capability every later slice in this milestone depends on: `executeCut` refuses to write without a passing `GateResult`, the CLI's `gate` and `cut` commands report through it, and the databases content and skill slices are done only when it says so.

**Required Capabilities:**
- `runPublishGate(dir, opts?)` returns `GateResult { ok: boolean, failures: GateFailure[] }`, with `ok === true` iff `failures.length === 0`, and never throws for a content violation — every violation becomes a `GateFailure` entry, not an exception.
- N is derived as the highest version number present as a `versions/vN/` subdirectory inside `dir`, so the same function computes N identically whether `dir` is `.staycurrent/staged/<slug>/` or a committed `topics/<slug>/`.
- Each of the nine `GateCheckId` checks — `snapshot-complete`, `changelog-top-entry`, `article-version-match`, `skill-version-match`, `skill-byte-identical`, `provenance-non-empty`, `slug-matches-dirname`, `reserved-slug`, `cadence-date-valid` — fires on a fixture that violates exactly it, and produces a `GateFailure` whose `message` matches the exact per-check shape the Publish gate table specifies (for example, a missing `versions/v2/provenance.md` yields `missing required artifact: versions/v2/provenance.md` under `snapshot-complete`).

## Design

Implements `runPublishGate` and the nine-row Publish gate table in `technical-design/03-api-design.md`, against the Integrity Invariants table in `technical-design/04-data-design.md` that names each check's source invariant. Built on Slice 1.1's exported types (`GateResult`, `GateFailure`, `GateCheckId`), but the gate itself performs no Loading API calls — it is a standalone structural and content check over a directory, the one function in the module deliberately designed not to throw on invalid content.

## Proof of work

**Proves:** `runPublishGate` tells the truth about whether a topic-shaped directory is internally consistent across all nine checks, and names the exact offending artifact when it is not.

**How we prove it:** Run the gate against nine fixtures, each violating exactly one of the nine checks, and observe exactly the `GateFailure` the Publish gate table specifies for that check — the right `check` id, the right `path`, and the exact `message` text. Then run the gate against one complete, internally consistent fixture and observe `GateResult.ok === true` with an empty `failures` array. Each fixture is a real directory on disk the gate actually reads — not a mocked return standing in for the check.

**Test file:** `tests/bets/first-living-topic/test_slice_2_core_publish_gate.py` — generated red at Delivery start; traces to `runPublishGate` and the Publish gate table in `technical-design/03-api-design.md`.
