---
name: staycurrent-research
description: >
  Use when researching a topic for Stay Current: checking what is due,
  finding what has changed in the field, arguing the stance with the
  operator, and then cutting a new version or logging a no-cut. Also use when
  creating a topic. Owns the shape of every file under topics/; pairs with
  staycurrent-style, which owns the prose inside them.
---

# Stay Current — Research

A research run keeps one topic current. You research, draft, and recommend; the
operator argues the stance and decides. **Nothing under `topics/` is committed
without the operator's explicit go.**

## What is where

```
topics/<slug>/
  article.md                 the living article; frontmatter is the topic's state
  changelog.md               newest entry first: "## vN — YYYY-MM-DD"
  research-log.md            every run, cut or no-cut, newest first
  versions/vN/article.md     frozen copy of the article at vN (frontmatter: version, cut)
  versions/vN/provenance.md  "## Sources" and "## Synthesis" for vN
  evidence/<lab>/            optional: harness, environment record, raw logs, notes
```

The site reads these files at build time and nothing else.

## A run

A topic is due when `last_researched + cadence` is in the past. Sweep the
frontmatter, say what is due, and propose which topic to run rather than asking.

Then, against the current version, find what has changed in the field:
releases, deprecations, standards that stabilised, benchmarks, opinions that
moved. Prefer primary sources (vendor docs, release notes, papers, licence
texts) and record the URL and access date of everything you rely on. Present
the findings ranked by consequence, saying which touch a claim, a number, or
the stance itself, and give a verdict with its reason: cut a version when a
finding materially changes a claim or the stance; log a no-cut when it does
not. The operator can overrule either way, and the run waits for their go.

## Cutting a version

With N the new version number and today's date:

1. **Rewrite `article.md`.** The article is always the current truth: rewrite,
   never append or annotate with "updated". Set `version: N` and
   `last_researched`. Shape: frontmatter, `# Title`, a stance blockquote of at
   most three sentences, then the essay in `##` and `###` sections.
2. **Freeze the snapshot.** Copy the body to `versions/vN/article.md` with
   frontmatter `version: N` and `cut: <date>`.
3. **Write `versions/vN/provenance.md`.** Two sections, every consequential
   claim under exactly one. `## Sources`: one bullet per citable input,
   `- [Title](URL) — accessed YYYY-MM-DD — supports: <which claims>.`
   `## Synthesis`: one bullet per claim from your own knowledge, stated
   plainly and never dressed as a citation.
4. **Prepend the changelog entry** as `## vN — YYYY-MM-DD`: what moved in the
   field, what it means for practice, written so a reader current on the
   previous version can stop there. End every entry after the first with a
   line that starts `**Stance:** held`, `bent`, or `reversed`, then one
   sentence; the site parses that word.
5. **Prepend the research-log entry** as `## YYYY-MM-DD — cut vN`: a few
   factual lines on what was examined and what moved.
6. **Edit** per staycurrent-style, then `pnpm build` must pass.
7. **Commit** `topics/<slug>/` as one commit, `cut(<slug>): vN`.

A no-cut sets `last_researched`, prepends `## YYYY-MM-DD — no-cut` to the
research log with why nothing warranted a version, and commits as
`log(<slug>): no-cut`.

## Creating a topic

`topics/<slug>/article.md` at `version: 1` with a `cadence` such as `90d`, and
the catalogue fields where a field is served by several pieces (`area`,
`register: hub | foundation | profile`, `movement`, `reading_order`,
`prereqs`). Slugs are kebab-case, short, noun-form, and permanent; `changelog`,
`about`, and `rss.xml` are taken. The founding run authors v1 through the same
steps as any cut.

## Measured claims

When a claim is measured rather than sourced, keep the harness in
`evidence/<lab>/`: the scripts, an environment record, raw logs never edited
after the run, and notes on what the lab does and does not establish. Every
measured figure in the article names the log it came from.
