---
title: 0002. Git + Filesystem as the Only Store
description: The topics/ tree, versioned in git, is the system's only data store; no database exists anywhere in the architecture.
status: accepted
last_reviewed: 2026-07-09
---

# 0002. Git + Filesystem as the Only Store

**Status:** accepted     **Owner:** operator
**Date:** 2026-07-09     **Supersedes:** —

> The record is immutable; the decision is not. If this is later superseded,
> change status to `superseded by [NNNN](NNNN-<slug>.md)`, add a one-line note
> at the top of the body explaining what changed, and leave the original
> reasoning intact — never overwrite it. The trail is what makes the set
> trustworthy enough to re-evaluate against.

## Context

Content-core needs a store for topic frontmatter, versioned snapshots, changelog
entries, provenance records, research logs, and in-flight session state. Every access
pattern in the system is either a frontmatter sweep across topics (status questions) or a
full-file read at build or session time (content questions) — neither needs a query
engine. The choice was between introducing a database for some or all of this state, or
treating the `topics/<slug>/` directory tree, versioned in git, as the entire store.

## Decision

The `topics/` directory tree, versioned in git, is the system's only data store. No
database exists anywhere in the architecture. State that can be computed — `due`,
`superseded` — is derived at read time and never persisted redundantly, so it can never
disagree with the thing it's derived from.

## Assumptions

- Access patterns stay confined to frontmatter sweeps and full-file reads — no ad hoc
  queries, joins, or aggregations across topics that only an index or database would
  serve efficiently.
- Content volume stays small enough (tens of topics, tens of versions each) that a full
  frontmatter sweep at every session start is cheap.
- There is exactly one writer, content-core, so no concurrent-write conflict resolution
  beyond git's own is needed.

## Review trigger

If the topic count or query pattern grows to need something a filesystem sweep can't
serve cheaply — the design system already earmarks roughly 25 topics as the point search
becomes necessary — or if a second concurrent writer appears, this decision is revisited.

## Trade-offs

- **What we gave up:** query flexibility — no filtering, sorting, or joining beyond what
  a full sweep and simple field comparison can do.
- **What risk we accepted:** at high topic or version counts, a full frontmatter sweep on
  every cold start could get slow, with no index to fall back on.
- **What this makes harder in future:** any feature wanting aggregate or cross-topic
  analytics (e.g. "which topics moved the most this quarter") has to be built as a
  sweep-and-compute pass, not a query.

## Alternatives considered

- **Any database (SQLite, Postgres, a hosted document store):** rejected — no access
  pattern in the architecture needs query capability a filesystem sweep doesn't already
  serve, and a database would become a second source of truth the git tree's state could
  drift against.
