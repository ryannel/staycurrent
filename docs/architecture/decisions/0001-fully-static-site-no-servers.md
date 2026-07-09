---
title: 0001. Fully Static Site, No Servers
description: The site ships as a static export on GitHub Pages with content-core embedded in-process; the system scales to zero when idle.
status: accepted
last_reviewed: 2026-07-09
---

# 0001. Fully Static Site, No Servers

**Status:** accepted     **Owner:** operator
**Date:** 2026-07-09     **Supersedes:** —

> The record is immutable; the decision is not. If this is later superseded,
> change status to `superseded by [NNNN](NNNN-<slug>.md)`, add a one-line note
> at the top of the body explaining what changed, and leave the original
> reasoning intact — never overwrite it. The trail is what makes the set
> trustworthy enough to re-evaluate against.

## Context

Stay Current publishes a git-versioned content tree of long-lived articles with no
per-reader personalization, no accounts, and no write path other than a git push. The
product must incur no runtime cost while idle and collect nothing about readers. The
choice was between a hosted server (or serverless) rendering layer, an off-the-shelf
docs-site generator, or a fully static export with no server anywhere in the request
path.

## Decision

Stay Current ships as a fully static export — Next.js `output: 'export'` — deployed to
GitHub Pages, with content-core embedded as an in-process library rather than a network
service. Every route is statically enumerable from the content tree at build time: no
route handlers, no server components at runtime, no image optimizer service. The only
server-shaped component in the system, GitHub Actions, runs at push time, not at request
time, and the CDN serves bytes cut at that build.

## Assumptions

- Reader traffic requires no personalization, authentication, or per-request computation.
- The content update cadence (research runs, not live traffic) tolerates a full
  rebuild-and-redeploy cycle — minutes — as the sole change-propagation path.
- GitHub Pages' static-hosting limits (no server-side logic beyond static serving,
  bandwidth and build-minute ceilings) remain acceptable at this project's scale.

## Review trigger

If the product needs server-side search, per-reader personalization, authenticated
content, or any write path other than git push, this decision is revisited — likely
alongside [0002](0002-git-filesystem-as-only-store.md), since a request-time feature
would also strain the filesystem-as-store decision.

## Trade-offs

- **What we gave up:** runtime dynamism — no server-side search, no personalization, no
  request-time computation of any kind.
- **What risk we accepted:** any future feature that needs a request-time decision (A/B
  tests, live ranking) requires re-architecting the hosting model, not just adding a
  route.
- **What this makes harder in future:** incremental or partial rebuilds — every content
  change triggers a full site rebuild; there is no server able to serve one changed page
  without a full redeploy of the export.

## Alternatives considered

- **Hosted SSR (a Next.js server or serverless functions):** rejected — it adds cost and
  operational surface (deploys, monitoring, scaling) for a fundamentally read-only
  publication with no per-request logic to justify a server.
- **Docs-site generator (e.g. Docusaurus, VitePress):** rejected — these tools are
  hard-wired to a single `docs/`-shaped content tree and page hierarchy; Stay Current
  needs routes a docs generator's model doesn't express — per-topic version pages
  (`/[topic]/v/[n]`) and skill-install pages (`/[topic]/skill`) bound to article versions.
