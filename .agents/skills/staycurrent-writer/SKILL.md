---
name: staycurrent-writer
description: >
  Use when authoring a research run's cut artifacts — the article rewrite,
  the changelog entry, provenance.md, and the skill snapshot — into the
  staged tree ahead of `cut <slug>`. Every prose artifact a cut produces is
  authored through this skill, never freehand; pairs with
  staycurrent-research, which runs the choreography that precedes it, and
  staycurrent-style, which owns the voice the prose is written in.
---

# Stay Current — Writer Skill

Renders `docs/design-system.md`'s Document Architecture as executable authoring
rules — the anatomy of every cut artifact. Sentence-level voice and craft come from
staycurrent-style, loaded alongside this skill for every artifact; together they are
the mechanism by which ten research runs a year read as one author. A cut whose
prose bypassed either skill is a process violation even when the mechanical gate
passes (design system, Skill Anatomy).

## Where artifacts go

Everything below is authored directly into `.staycurrent/staged/<slug>/` — seeded by
`convene`/`create` — which `gate <slug>` and `cut <slug>` validate. `topics/` itself
is mutated only through `workbench/cli.mjs` (`create`, `convene`, `cut`, `log` mutate
it; `discard` mutates session state; `gate` is a read-only dry-run) — the cut command
lands the staged tree there in one commit, never a hand edit. Hand-editing `topics/`
outside the action contract is a `violation` — a hard stop, never overridable
in-session. There is no other sanctioned authoring surface.

## Article rewrite (`article.md`)

Anatomy (`docs/bets/first-living-topic/technical-design/04-data-design.md`):
frontmatter → `# Title` → stance callout (the committed position, restated, ≤ 3
sentences — this run's stance goes here first, whether it held, bent, or reversed) →
the essay, `##`/`###` sections only (no `####`). No "updated:" annotations, no
strikethrough history — the article is always current truth; history lives in
`versions/`. Frontmatter's `version` increments by exactly one; `status`
stays/returns to `current`; `last_researched` updates to today.

## `versions/vN/` snapshot

The frozen pair: `article.md` (the live rewrite's body at cut time, frontmatter
reduced to `version` + `cut` date, no `status` field) and `skill/` (see Skill
snapshot below). Written once; nothing about it changes after the cut lands.

## Changelog entry (`changelog.md`, prepended as `## vN — YYYY-MM-DD`)

A self-contained mini-essay: a reader current on v*N*−1 finishes it and is done — no
need to reread the article. Three-part anatomy:

- **What moved** — the field that changed.
- **What it means** — the consequence for the reader's practice.
- **Stance:** `held` | `bent` | `reversed` + one sentence, on every non-founding
  entry.

The Stance line's shape is pinned, not stylistic: it begins `**Stance:**` at the very
start of its own line — never bullet-prefixed. A `- **Stance:** held — …` list item
(the natural misreading of the anatomy above) fails to parse; gate check 11
(`changelog-schema`) now catches the slip pre-commit, but this skill authors it right
the first time. Verbatim, correct form:
```
**Stance:** held — the pitch holds against three new benchmark sources.
```

The founding `## v1` entry carries no `Stance:` line — there is no predecessor cut to
hold the stance against; its body is the founding note (the initial stance, what the
topic covers).

## Provenance (`versions/vN/provenance.md`)

Two sections; every consequential claim traces to exactly one. The entry grammar the
loaders parse — see a real example at `topics/databases/versions/v1/provenance.md`:

- `## Sources` — one bullet per citable input: `- [Title](URL) — accessed
  YYYY-MM-DD — supports: <which claims it supports>.` — a `sourced` claim.
- `## Synthesis` — one bullet per claim drawn from agent knowledge, stated plainly
  and labelled `synthesis`, never disguised as `sourced`. A degraded-source gap
  (staycurrent-research's bounded-retry rule) is one more `## Synthesis` bullet in
  its named form: `- Research gap — <source> unreachable after bounded retries;
  would have supported <claim>.`

**Combined non-emptiness** is a gate input: the two sections together may not both be
empty. A fully-sourced cut needs no synthesis bullet, and a purely synthesised cut
needs no sourced bullet — only the *combination* being empty is disallowed.

## Skill snapshot (`skill/`)

This skill authors BOTH staged copies' frontmatter directly — the live
`skill/SKILL.md` and `versions/vN/skill/SKILL.md` — bumping `article_version` to `N`
in each so they stay byte-identical; `cut <slug>` never edits either file, it only
gates what is already staged (byte-identity is gate check 5,
`skill-byte-identical`). Per change-proposal-2, the placeholder skill rides unchanged
in content — only the version binding moves — while skill authoring stays deferred.
Do not author new skill prose while that deferral holds: it ends only when a future
skill-design bet supersedes change-proposal-2
(`docs/bets/first-living-topic/change-proposal-2.md`), not on this skill's own
judgment.

## Session narrative vs. staged artifact

The session file's `## Draft` section holds the resume narrative — the proposed
changelog entry text plus a one-paragraph rationale — and is never the artifact
source. The staged tree (`.staycurrent/staged/<slug>/`) is the artifact source,
authored by this skill. Nothing in `## Draft` substitutes for the real files above.
