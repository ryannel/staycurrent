# Research digest: content-model fit audit

> Discovery input to the `databases-catalogue` bet (audited 2026-07-16 against the live
> contract). File-level answer to what the multi-piece catalogue costs: what is free, what is
> a patch, what is a genuine contract bet. This grounds the pitch's "editorial + display patch,
> no contract change" scope and its deferred-bet no-gos.

## The governing seam

`validateTopicFrontmatter` (`core/src/frontmatter.ts:35-104`) validates the seven known fields
but **does not reject unknown keys** (contrast `validateVersionFrontmatter`, which rejects any
key outside `{version, cut}`). Additive frontmatter on a live `article.md` passes loaders and
gate check 10 untouched today. The project's own evolution rule (archived technical design,
`04-data-design.md`): the content contract evolves **additively only** within a major version.

## Free / patch / bet

| Vision element | Size | Anchor |
|---|---|---|
| Create N sibling topics as separate slugs | FREE | flat `topics/<slug>/`; names fit `SLUG_RE` (`core/src/slug.ts:19` — `^[a-z0-9]+(-[a-z0-9]+){0,2}$`, ≤3 words, permanent) |
| Additive frontmatter keys on live articles | FREE | `frontmatter.ts:35-104` tolerates unknown keys |
| Cross-links between topic bodies | FREE | relative/anchor URLs pass the protocol sanitizer (`core/src/render/rehypeSanitizeProtocols.ts:14-16`) |
| Per-piece freshness at mixed cadences | FREE | per-topic `computeDue` (`core/src/dates.ts:36-47`) and `isFresh` keyed on cut date (`services/site/lib/freshness.ts`) |
| Chooser as prose + Mermaid | FREE | `core/src/render/rehypeMermaid.ts` |
| Reading-order + prereq data & display | PATCH | additive field → `core/src/types.ts` / `frontmatter.ts` → `services/site/lib/content.ts` → render |
| "Databases area" grouping, display-only | PATCH | group-by accessor in `content.ts` + grouped render in `services/site/components/library/topic-library.tsx` and `components/shell/sidebar.tsx` (both sort slug-alphabetical today) |
| Hub freshness rollup | PATCH | new accessor in `content.ts`; no contract change |
| Prereq graph validated (existence, acyclicity) | BET (small) | the gate validates one directory in isolation (`core/src/runPublishGate.ts:428`) — cross-topic integrity is net-new |
| Broken-cross-link build/gate check | BET (small) | no link-graph capability exists; `dynamicParams=false` means a bad slug 404s at read time, never at build |
| Nested URLs `/databases/relational` | BET | single-segment routes; permanent slugs; no rename migration |
| Lighter "profile" register (no stance/skill/changelog machinery) | BET | all 11 gate checks + `createTopic` + the build sweep assume the five-artifact stance shape |
| Enforced structured profile fields (diffable schema) | BET | no structured-body schema exists anywhere; body is freeform markdown rendered by `renderMarkdown` |
| Multi-topic atomic cut | BET | `executeCut`/`stageCut`/`convene`/CLI are single-slug; "one cut is one git commit" is a recorded invariant |

## Consequences the bet's design must honor

- **Slugs are one-way doors.** ≤3 words, permanent, no rename path. The full slug set locks in
  Design Foundations before the first cut.
- **Cross-piece consistency is convention-only.** Between cuts, pieces may cite each other at
  stale versions; nothing catches skew. Mitigated by wave ordering + the hub-lands-last rule +
  a manual link sweep at each wave boundary (the pitch's success-signal check 2).
- **Comparability is a writer-skill convention**, enforced editorially (profile skeleton + hub
  matrix), not by the gate. If a wave retrospective names the convention as failed, that is
  the trigger for the deferred structured-fields bet — not authoring convenience.
- **Freshness/cadence scale cleanly.** Nothing shares a cadence assumption across topics; the
  RSS builder caps at 50 items and the design notes a ~25-topic ceiling — the program lands at
  21 topics, inside the ceiling with headroom consumed.
- **Every piece carries the full five-artifact machinery** (article, changelog, versions/,
  provenance, placeholder skill) — the maintenance price of staying inside the contract, paid
  deliberately per the pitch's appetite.
