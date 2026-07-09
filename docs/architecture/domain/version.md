---
title: Version
description: An immutable atomic cut of a topic — a frozen article, skill, and provenance record plus its changelog entry.
status: active
last_reviewed: 2026-07-09
---

# Version

**Owner:** content-core

## What it is

A version is one atomic cut of a topic: the snapshot directory `versions/vN/`
(`article.md`, `skill/`, `provenance.md`) written together with the `## vN` entry in
`changelog.md`, in a single git commit. It is a record, not a resource under management —
once written it never changes. The invariant it exists to enforce: the article and its
companion skill can never disagree about which stance they render, and every consequential
claim in the version traces to a source or is labelled synthesis.

## Fields

| Field | Type | Description |
|---|---|---|
| topic | string | Parent topic slug; the snapshot lives at `topics/<topic>/versions/vN/`. |
| version (N) | integer | Matches the `versions/vN/` directory number and, at cut time, the live article's `version`. |
| cut | ISO date | Date the snapshot was written. |
| article.md | file | Snapshot of the article at this stance; frontmatter carries `version` and `cut` only — no `status` field. |
| skill/ | directory | Snapshot of the companion skill at this version; `SKILL.md` frontmatter carries `article_version: N`. |
| provenance.md | file | `## Sources` + `## Synthesis`; every consequential claim in the version traces to exactly one of the two. |

## Lifecycle

Version has no state machine. A snapshot is written once, atomically, as part of a cut,
and nothing about it ever mutates afterward — there is no diagram or table to draw.

`current` and `superseded` are not states the version holds: they are read-time labels
derived by comparing this version's `N` to the live article's `version` field, never
stored on the version itself. Becoming superseded writes nothing to this version — it is
a fact about a *later* version's cut, observed by comparison, not an event this entity
emits.

## Domain events

Modeled as in-process domain events only — the architecture provisions no message broker,
so nothing here implies a publish channel.

| Event | Trigger | Payload summary |
|---|---|---|
| version.cut | the action contract's stage → gate → commit completes | topic, version (N), cut date, paths to article/skill/provenance/changelog entry |

## Invariants

- A cut is atomic across five artifacts: the snapshot's `article.md`, `skill/`, and
  `provenance.md` in `versions/vN/`, the `## vN` entry appended atop the topic's
  `changelog.md`, and the RSS item generated at site build from that changelog entry
  verbatim.
- The snapshot skill's frontmatter `article_version` equals `N`.
- For the current version, the live `skill/` is byte-identical to `versions/vN/skill/`.
- `provenance.md` carries at least one entry across `## Sources` and `## Synthesis`
  combined; a version whose provenance lists nothing in either section cannot cut. A
  fully-sourced version needs no synthesis bullet, and vice versa.

## Notes

One cut is one git commit — rollback is git: reverting the commit restores every artifact
of the cut atomically, with no bespoke undo mechanism. The gate that validates a cut runs
against the *staged* prospective tree before anything touches `topics/`, so a failed cut
never produces a partial version.
