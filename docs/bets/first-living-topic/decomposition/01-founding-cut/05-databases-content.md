# Slice 1.5 — workbench: Databases Content

**Owner service:** workbench

**Surface:** workbench

**Complexity:** L

**Prerequisite:** Slice 1.4 merged

## Scope

This slice authors the databases living article, its founding changelog entry, and its provenance record — real content, not stubs — into `.staycurrent/staged/databases/`, seeded by Slice 1.4's `create databases`. It carries the operator's coverage directive (relational, document, key-value, columnar, vector, and graph databases; when to use each; how to choose; the convergence trend; practitioner mental models) into the document anatomies the gate checks against, so the milestone's remaining gap after this slice is the companion skill alone.

**Required Capabilities:**
- The staged `article.md` frontmatter states `topic: databases`, `title`, a one-sentence `stance`, `version: 1`, `status: current`, a `cadence` matching `<int>d`, and `last_researched` as an ISO date — the `TopicFrontmatter` shape `03-api-design.md` types and `04-data-design.md`'s `article.md` entry fixes on disk — and its body follows the document anatomy `04-data-design.md` fixes: an H1 title, a stance callout of at most three sentences, then `##`/`###` sections only (no heading level below that), with diagrams as fenced ` ```mermaid ` blocks.
- The staged `changelog.md` carries the `## v1 — YYYY-MM-DD` founding entry with no `Stance:` line, matching the v1-founding-entry exception `04-data-design.md`'s changelog entry documents.
- The staged `versions/v1/provenance.md` carries at least one bullet across `## Sources` and `## Synthesis` combined, each `## Sources` bullet in the `- [<title>](<url>) — accessed <YYYY-MM-DD> — supports: <claim>` grammar and each `## Synthesis` bullet as `- <claim>`, per the bullet grammar `03-api-design.md`'s `loadVersion` design rationale fixes and the combined non-emptiness rule `04-data-design.md`'s provenance entry states.
- Running `gate databases` against the staged tree reports no `FAIL` for `changelog-top-entry`, `article-version-match`, `provenance-non-empty`, `slug-matches-dirname`, `reserved-slug`, or `cadence-date-valid` — the six checks this slice's artifacts govern.

## Design

Authors real content into the staged tree Slice 1.3's `stageCut`/`createTopic` and Slice 1.4's `create databases` seed, following `technical-design/04-data-design.md`'s document anatomies for `article.md`, `changelog.md`, and `versions/v1/provenance.md`, and the Seed Data section's coverage directive for `topics/databases/`.

## Proof of work

**Proves:** The databases article, founding changelog entry, and provenance are real, complete content in the staged tree — not stubs — and satisfy every gate check that inspects them.

**How we prove it:** Run `gate databases` against the staged tree after authoring, and observe no `FAIL` line for `changelog-top-entry`, `article-version-match`, `provenance-non-empty`, `slug-matches-dirname`, `reserved-slug`, or `cadence-date-valid` — the six checks the article, changelog, and provenance content governs. The skill-related checks (`skill-version-match`, `skill-byte-identical`) may still fail at this point — that is Slice 1.6's scope, not this one's. This runs the real gate against the real staged files, not an assertion about the content's word count.

**Test file:** `tests/bets/first-living-topic/test_slice_5_workbench_databases_content.py` — generated red at Delivery start; traces to `runPublishGate` in `technical-design/03-api-design.md` and the `article.md`/`changelog.md`/`provenance.md` document anatomies in `technical-design/04-data-design.md`.
