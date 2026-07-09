---
title: 0005. Skill Distribution as Static Payloads
description: Companion skills distribute as a browsable file tree plus a per-version zip under /skills/<slug>/, with no registry, installer, or package manager.
status: accepted
last_reviewed: 2026-07-09
---

# 0005. Skill Distribution as Static Payloads

**Status:** accepted     **Owner:** operator
**Date:** 2026-07-09     **Supersedes:** —

> The record is immutable; the decision is not. If this is later superseded,
> change status to `superseded by [NNNN](NNNN-<slug>.md)`, add a one-line note
> at the top of the body explaining what changed, and leave the original
> reasoning intact — never overwrite it. The trail is what makes the set
> trustworthy enough to re-evaluate against.

## Context

Each topic ships a companion skill an adopter's own agent runtime installs. The product's
supply-chain floor requires skill payloads to be plain markdown and files — no
executables, no network calls, no host-specific features — so any agent runtime that can
read files can consume one with nothing to sandbox. The choice was between static file
distribution served directly by the site, or a package-manager-style registry and
installer.

## Decision

Companion skills distribute as static payloads only: a browsable file tree at
`/skills/<slug>/` (current) and `/skills/<slug>/v/<n>/` (archived), plus a per-version
`.zip` archive for one-command install. There is no package registry, installer, or
npm-style distribution channel. The `article_version` frontmatter field binds a skill
payload to the article version it renders, enforced by the publish gate. Because skills
live at the top-level `/skills/` path, the root slugs `skills`, `changelog`, `about`, and
`rss.xml` are reserved — a topic slug cannot collide with them.

## Assumptions

- Adopters' agent runtimes can fetch a URL and unpack an archive, or read a raw file
  tree, without needing a package manager.
- Skill payload sizes stay small enough that a full-tree zip per version is a reasonable
  download.
- There is no present need for dependency resolution, semantic-version ranges, or a
  discovery/search registry across skills from multiple publishers.

## Review trigger

If adopters need dependency resolution between skills, discovery across many publishers'
skills, or automated update-checking that a registry protocol would provide, this
decision is revisited — that is explicitly the post-MVP framework-extraction and
skill-registry territory the architecture defers.

## Trade-offs

- **What we gave up:** any package-manager convenience — version ranges, dependency
  graphs, `install`/`update` commands beyond "fetch and unpack."
- **What risk we accepted:** adopters install skills as a manual, if one-line, step; there
  is no automated notification when a new `article_version` supersedes what they
  installed.
- **What this makes harder in future:** building a multi-publisher skill discovery or
  registry experience means adding a new distribution layer on top of this one, not just
  extending the zip format.

## Alternatives considered

- **npm/registry-style packaging:** rejected at MVP — it is infrastructure (a registry,
  publish credentials, dependency resolution) for a problem adopters don't have yet at
  this project's single-publisher, single-skill-per-topic scale.
