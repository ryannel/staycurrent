---
name: staycurrent-research
description: >
  Use when running a Stay Current research run on a topic — checking what is
  due, researching what has changed in the field, presenting the findings,
  arguing the stance with the operator, and then cutting a new version or
  logging a no-cut. Also use when creating a new topic. Owns the shape of
  every file under topics/; pairs with staycurrent-style, which owns the
  prose inside them.
---

# Stay Current — Research Skill

A research run keeps one topic current. The system researches, drafts, and
recommends; the operator argues the stance and decides. **Nothing is committed
without the operator's explicit go.** That is the one rule with no exception.

Write everything in the staycurrent-style voice. Status words are a closed set:
a topic is `current` or `due`; a version is `current` or `superseded`; a run ends
`cut` or `no-cut`; a provenance claim is `sourced` or `synthesis`; a changelog
entry's stance is `held`, `bent`, or `reversed`. Never a synonym.

## What is where

```
topics/<slug>/
  article.md                 the living article; frontmatter is the topic's state
  changelog.md               newest entry first: "## vN — YYYY-MM-DD"
  research-log.md            every run, cut or no-cut, newest first
  versions/vN/article.md     frozen copy of the article at vN (frontmatter: version, cut)
  versions/vN/provenance.md  "## Sources" and "## Synthesis" for vN
  evidence/<lab>/            harness, environment record, raw logs, fact notes
```

The site (`src/`) reads these files at build time and nothing else. Every
version page, changelog entry, history row, and feed item comes from them.

## Opening a session

Sweep `topics/*/article.md` frontmatter. A topic is due when
`last_researched + cadence < today`. Open with the state and a proposal, never
an open question:

```
databases          v5   researched 29 Jul 2026   due — 62 days over
query-execution    v1   researched 29 Jul 2026   current — next run 25 Jan 2027
```
…followed by "databases is furthest over — convene it?"

## The run

**Convene.** `Convening <topic> against v<N> (last researched <date>). Sources
first, digest when I have it.`

**Research.** Investigate what has changed in the field since the current
version: releases, deprecations, standards that stabilised, benchmarks, the
opinions that moved. Report completed facts, never activity: `12 sources
examined; 3 findings of consequence.` A source that fails to fetch after three
tries is dropped and recorded as a gap (below); no halt.

**Digest.** A ranked table of finding · source · what it touches (a claim, a
number, the stance itself), most consequential first. Say which findings touch
the stance and why the ranking is what it is.

**Verdict.** State a position and invite pushback:
- `Verdict: cut. <n> findings, <m> touch the stance — <one-line reason>. Draft entry below; argue or approve.`
- `Verdict: no-cut. What moved doesn't touch the claims or the stance — logging the run. Overrule if you read it differently.`

A finding that materially changes a claim, a number, or the stance cuts a
version. Noise does not. The operator can overrule either way.

## Cutting a version (after the go)

With N the new version number and today's date:

1. **Rewrite `article.md`.** The article is always the current truth: rewrite,
   never append or annotate with "updated". Bump `version: N`, set
   `last_researched: today`. Anatomy: frontmatter → `# Title` → a stance
   blockquote of at most three sentences (this run's stance, whether it held,
   bent, or reversed) → the essay in `##` and `###` sections only.
2. **Freeze the snapshot.** Copy the rewritten body to
   `versions/vN/article.md` with frontmatter reduced to `version: N` and
   `cut: today`.
3. **Write `versions/vN/provenance.md`.** Two sections, every consequential
   claim under exactly one:
   - `## Sources` — one bullet per citable input:
     `- [Title](URL) — accessed YYYY-MM-DD — supports: <which claims>.`
   - `## Synthesis` — one bullet per claim drawn from the agent's own
     knowledge, stated plainly. A dropped source is one more bullet:
     `- Research gap — <source> unreachable after bounded retries; would have supported <claim>.`
   The two sections may not both be empty.
4. **Prepend the changelog entry** to `changelog.md` as `## vN — YYYY-MM-DD`.
   A self-contained mini-essay a reader current on v(N−1) can stop at: what
   moved in the field, what it means for practice, and a final line that
   starts the line, never bulleted: `**Stance:** held — <one sentence>.`
   The founding `## v1` entry has no Stance line.
5. **Prepend the research-log entry** to `research-log.md` as
   `## YYYY-MM-DD — cut vN`, two to four factual lines: what was examined,
   what moved, what the stance did.
6. **Edit.** Read the draft aloud per staycurrent-style's editing pass, and
   measure it: `node scripts/prose-metrics.mjs topics/<slug>/article.md`.
7. **Build.** `pnpm build` must pass; open the built pages if anything about
   the shape changed.
8. **Commit** everything under `topics/<slug>/` as one commit:
   `cut(<slug>): vN`. Then report:
   `Cut v<N> — article, changelog entry, provenance; the site rebuilds on push.`

## Logging a no-cut (after the go)

Set `last_researched: today` in `article.md`. Prepend
`## YYYY-MM-DD — no-cut` to `research-log.md` with two to four lines on what was
examined and why nothing warranted a version. Commit as `log(<slug>): no-cut`.

## Creating a topic

`topics/<slug>/` with `article.md` at `version: 1`, `status: current`, a
`cadence` such as `90d`, `last_researched: today`, and the catalogue fields
where they apply (`area`, `register: hub | foundation | profile`, `movement`,
`reading_order`, `prereqs`, `core`). Slugs are kebab-case, at most three words,
noun-form, and permanent: `changelog`, `about`, and `rss.xml` are taken. The
founding run authors v1 through the same steps as any cut.

## Measured claims

When a claim is measured for the article rather than sourced, the harness goes
in `evidence/<lab>/`: setup and driver scripts, an environment record, raw logs
that are never edited after the run, and fact notes stating what the lab does
and does not establish. Every measured figure in the article names the log it
came from.

## Halting

Anything that stops the run renders this and nothing else:

```
Blocked: <what stopped, one line>
Cause:   <why — the file, the value, the check that failed>
State:   <topic, last durable step — what is safely on disk>
Action:  <the one thing the operator should do>
```
