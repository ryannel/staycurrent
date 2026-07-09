---
title: Topic
description: The unit of publication — a living article, its companion skill, and its version history under `topics/<slug>/`.
status: active
last_reviewed: 2026-07-09
---

# Topic

**Owner:** content-core

## What it is

A topic is a practice area Stay Current maintains a committed position on — the living
article, its companion skill, and its full version history, all rooted at
`topics/<slug>/`. The article's frontmatter *is* the topic's state; there is no parallel
registry, so state can never drift from the thing that states it. The invariant a topic
exists to enforce: at any moment there is exactly one current stance per topic, and it is
always the thing readers, the skill, and the operator all see.

## Fields

| Field | Type | Description |
|---|---|---|
| topic | string (kebab-case slug) | Must equal the directory name; the reconciliation check greps for drift. Immutable — renaming a topic is a migration, not an edit. |
| title | string | Display title. |
| stance | string (one sentence) | The one-sentence committed position; renders as the site's card one-liner. (The ≤ 3-sentence budget belongs to the article's stance callout, not this field.) |
| version | integer | Positive, monotonic — only increments, only at a cut. |
| status | enum: `current` \| `in-research` | The only two stored values, ever. `due` is never one of them (see Lifecycle). |
| cadence | string (`<int>d`) | Research interval, e.g. `90d`. |
| last_researched | ISO date | Updated on **every** resolved run, cut or no-cut — a quiet check is still currency information. |

## Lifecycle

```mermaid
stateDiagram-v2
    [*] --> current: create <topic> (v1 cut)
    current --> in-research: operator convenes run
    in-research --> current: run resolves — cut (version += 1)
    in-research --> current: run resolves — no-cut (log entry only)
```

| State | Triggered by | Description |
|---|---|---|
| current | topic created (v1 cut), or a run resolves | The live truth; no run in flight. |
| in-research | operator convenes a run | A session file exists at `.staycurrent/sessions/<slug>.md`; a run is in flight. |

`due` is never a stored state. It is derived at read time —
`last_researched + cadence < today` — by any tool that wants it, and it is a bug for
anything to persist it. The frontmatter `status` field holds exactly `current` or
`in-research`.

## Domain events

Modeled as in-process domain events only — the architecture provisions no message broker,
so nothing here implies a publish channel.

| Event | Trigger | Payload summary |
|---|---|---|
| topic.created | `create <topic>` seeds the directory and its v1 cut through the same gate as any later version | topic, title, cadence, version: 1 |
| topic.research-convened | operator convenes a run | topic, against_version, session path |
| topic.cut | a convened run resolves with cut | topic, version (new), last_researched |
| topic.no-cut | a convened run resolves without a cut | topic, last_researched |

## Invariants

- `topic` equals its directory name (`topics/<topic>/`); the reconciliation check greps
  for drift.
- `topic` is immutable once created; a rename is a migration, not an edit.
- A topic slug colliding with a reserved root slug (`skills`, `changelog`, `about`,
  `rss.xml`) is rejected by the gate.
- `version` only increments, and only as part of a cut.
- Only content-core mutates a topic's directory, and only via stage → gate → commit; one
  cut is one git commit.

## Notes

Topic creation is not a bootstrapped exception: the `create` operation writes the full
directory (`article.md`, `changelog.md`, `skill/`, `versions/v1/`, `research-log.md`) and
its v1 cut through the identical publish gate any later version passes through.

If `status: in-research` is found with no matching session file in
`.staycurrent/sessions/`, the filesystem wins: the field reverts to `current` and the
reconciliation is reported to the operator — see [research-run](research-run.md) for the
mechanics of that resumption/reversion.
