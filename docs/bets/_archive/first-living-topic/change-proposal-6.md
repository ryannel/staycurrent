# Change Proposal 6 — the gate gains a tenth check: frontmatter schema

**Severity:** minor (one check added to the gate contract; no signature, store, or ladder change)
**Discovered:** slice 3.1 delivery review (edge-case tracer), 2026-07-10.

## Discovery / evidence

The publish gate's nine checks validate artifact integrity (snapshot completeness, version agreement, byte-identical skill, provenance presence, slug/cadence/date shape) but never run the frontmatter schema the loaders enforce. Slice 3.1's tightening (non-blank `title`/`stance`, maturity G8) widened the gap into a live failure path: a research run that writes a blank stance into the staged article **passes the gate**, `executeCut` lands it (its own comment defers "full schema validation" to "the loaders' job"), and the next site build dies for the entire catalogue — fail-closed in the wrong place, after landing, breaking the gate's TODO-list contract for exactly the fields the hardening protects. This collides with Milestone 4's "zero hand-edits" hypothesis: the operator would be reverting a landed cut by hand.

## Change

- **`technical-design/03-api-design.md`**, Publish gate: the contract is **ten** checks. New check 10, `frontmatter-schema` — the live `article.md` frontmatter passes `validateTopicFrontmatter`, the identical schema the loaders enforce; every validator issue becomes one `GateFailure` (`article.md: ${issue}`, the validator's issue text verbatim). All "nine checks" prose updated.
- **`technical-design/04-data-design.md`**, frontmatter field table: `title` and `stance` gain the non-blank constraint slice 3.1 enforces (the field-table amendment that slice's Design section committed to record).
- Implementation lands in slice 3.1's diff (the hardening slice), with gate tests at the existing suite's rigour.

## Impact

- The gate remains mode-agnostic and non-throwing: schema issues aggregate as failures alongside the other checks; check 9's narrower cadence/date shape checks overlap the schema's and both report — aggregation, not contradiction.
- `runPublishGate`'s signature, `GateResult` shape, and ADR 0003's one-code-path rule are unchanged; CI and the workbench inherit the check with no caller change.
- Delivered milestone 1 prose ("nine fail-closed checks", slice 1.2) stays as history — the canonical contract is the technical design, now ten.

## Before / after

Before: gate = nine integrity checks; frontmatter schema enforced only at load time, so a schema-invalid staged article could pass the gate, land, and kill the next site build. After: gate = ten checks; a schema-invalid staged article fails the gate pre-cut with the validator's own issue text, and a gate-passed cut can never land content the loaders reject.

**Decision:** approved by the operator, 2026-07-10 (over deferring to Milestone 4 or documenting the divergence).
