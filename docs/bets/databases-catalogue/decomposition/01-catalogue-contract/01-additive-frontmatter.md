# Slice 1.1 — core: additive frontmatter extraction

**Owner service:** `@staycurrent/core`
**Surface:** core
**Complexity:** S
**Prerequisite:** none (G3's `npx groundwork-method repo-map` runs first, per the milestone note)

## Scope

Extends `validateTopicFrontmatter` to extract the seven additive catalogue keys as optional fields on the existing topic entity, exactly as `04-data-design.md` specifies. This is the entire core-side footprint of the bet: no loader, gate, or cut-path change.

**Required Capabilities:**
- `TopicFrontmatter` (`core/src/types.ts`) gains the optional fields `area`, `register` (`TopicRegister` closed union), `movement`, `reading_order`, `prereqs`, `core`, `axes` (`ProfileAxes`) — the authored YAML key names, exactly as `03-api-design.md` and `04-data-design.md`'s examples spell them (`readingOrder` exists only on the derived `CatalogueEntry`).
- `validateTopicFrontmatter` extracts each per its exact rule (extracted-if-valid-else-absent; `register` only on exact union match; `axes` copies recognized string keys and drops everything else) and **never** populates `issues` from any of the seven — a malformed additive key can never fail validation, a build, or a cut.
- Gate↔loader parity holds by construction: all existing `runPublishGate` and `frontmatter` tests pass unchanged, and `validateVersionFrontmatter` still rejects unknown snapshot keys (the asymmetry `04-data-design.md` preserves).

## Design

Implements the `validateTopicFrontmatter` extension in `03-api-design.md`; realizes no flow of its own — it is the data producer flows (a) and (b) consume.

## Proof of work

**Proves:** Annotated topics carry their catalogue fields through the sweep; malformed or absent annotations degrade to absent fields, never to failures.

**How we prove it:** Unit tests feed frontmatter with each key valid, invalid, and absent, asserting the extracted shape and an empty `issues` delta in every case; the full existing core suite runs green untouched.

**Test file:** `tests/bets/databases-catalogue/test_slice_1_core_additive_frontmatter.ts` — generated red at Delivery start; traces to the `validateTopicFrontmatter` contract in `03-api-design.md`.
