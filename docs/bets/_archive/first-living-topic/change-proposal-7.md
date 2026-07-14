# Change Proposal 7 — the gate gains an eleventh check: changelog schema

**Severity:** minor (one check added under change-proposal-6's approved principle; no signature, store, or ladder change)
**Discovered:** slice 4.1 delivery review (edge-case tracer, proven in a sandbox), 2026-07-10.

## Discovery / evidence

Proven end-to-end against a sandbox copy of the instance: a staged changelog entry whose `**Stance:**` line is bullet-prefixed (`- **Stance:** held — …`, the natural reading of the writer skill's bulleted anatomy) passes all ten gate checks (`checkChangelogTopEntry` inspects only the top `## vN — date` heading), `cut` lands the commit — and `loadChangelog`'s line-start-anchored `STANCE_LINE_RE` then rejects the committed file, breaking the site build after the run has closed and its staged tree is deleted. The operator's sanctioned repair surface at that point is nothing: `topics/` is never hand-edited, and no fresh convene can amend a committed changelog. This is the identical failure class change-proposal-6 closed for frontmatter, one store over.

## Change

- **`technical-design/03-api-design.md`**, Publish gate: the contract is **eleven** checks. New check 11, `changelog-schema` — the staged tree's `changelog.md` parses through `loadChangelog`, the identical loader the site build runs; a `ContentValidationError` becomes one `GateFailure` per issue (`changelog.md: ${message}`), a missing file its own failure. Runs the loader itself — never a re-implementation — per ADR 0003's one-code-path rule and change-proposal-6's recorded principle: *a gate-passed cut must never land content the loaders reject.*
- All "ten checks" prose and the `GateCheckId` union updated to eleven.
- Implementation lands in slice 4.1's diff (the slice whose review surfaced it), with gate tests at the suite's rigour.
- The residual loader↔gate parity question (e.g. `validateVersionFrontmatter`'s extra-key strictness on frozen snapshots, unchecked by the gate) is recorded as a maturity row rather than absorbed here — the systematic answer ("the gate runs every loader") is a deliberate future decision, not an emergency.

## Impact

- The gate stays non-throwing and aggregating; `runPublishGate`'s signature and `GateResult` shape are unchanged; CI and the workbench inherit the check with no caller change.
- The rehearsal (slice 4.2) and the operator's live run inherit a gate that cannot green-light the one content slip the loop's own choreography makes most likely.

## Before / after

Before: gate = ten checks; a schema-invalid staged changelog passes, lands, and kills the next site build with no sanctioned repair. After: gate = eleven checks; the same slip halts pre-commit with the loader's own message, staged tree intact.

**Decision:** recorded under change-proposal-6's operator-approved principle (2026-07-10); surfaced for ratification at the Milestone 4 postmortem.
