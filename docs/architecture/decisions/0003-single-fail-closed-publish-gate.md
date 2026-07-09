---
title: 0003. Single, Fail-Closed Publish Gate
description: The publish gate exists exactly once, inside content-core; workbench and CI both call the identical code path, and no human approval step sits after it.
status: accepted
last_reviewed: 2026-07-09
---

# 0003. Single, Fail-Closed Publish Gate

**Status:** accepted     **Owner:** operator
**Date:** 2026-07-09     **Supersedes:** —

> The record is immutable; the decision is not. If this is later superseded,
> change status to `superseded by [NNNN](NNNN-<slug>.md)`, add a one-line note
> at the top of the body explaining what changed, and leave the original
> reasoning intact — never overwrite it. The trail is what makes the set
> trustworthy enough to re-evaluate against.

## Context

A version cut has to validate against a fixed set of mechanical checks (five-artifact
completeness, version and `article_version` agreement, byte-identical skill directories,
non-empty provenance) both when the workbench proposes it and again before CI deploys it.
The product brief rules out a human approval queue after the mechanical check, naming
auditability — every published artifact is a git commit with a mechanical gate check in
its history — as the compensating control instead. The choice was where the gate logic
lives and how many times it's implemented.

## Decision

The publish gate is implemented exactly once, inside content-core, and every caller — the
workbench, pre-commit, and CI, pre-deploy — invokes that same code path. There is no
second implementation and no human approval step between a passing gate and a live
publish.

## Assumptions

- content-core stays embedded (in-process) in both the workbench's and CI's Node
  environment, so "the same code path" is literally the same function call, not a
  reimplementation in a different language or runtime.
- The gate's checks stay filesystem-only — frontmatter fields, file presence, byte
  identity — nothing that requires a live service to evaluate.

## Review trigger

If a future surface needs to validate content in a runtime content-core can't run in
(e.g. a non-Node CI environment, or an adopter's own pipeline in another language), this
decision is revisited — likely as a need to publish the gate as a portable spec, not just
a library.

## Trade-offs

- **What we gave up:** a human review step between "gate passes" and "goes live" — there
  is no approval queue.
- **What risk we accepted:** a mechanically valid but editorially wrong cut (bad prose,
  wrong facts) still publishes; the compensating control is that it's a revertible git
  commit with the gate check in its history, not that it's caught before publishing.
- **What this makes harder in future:** any workflow wanting staged, pending-approval
  content sitting between "gate passed" and "live" needs new machinery — the current
  model has no such intermediate state.

## Alternatives considered

- **A human approval gate after the mechanical check:** rejected by the product brief —
  auditability (every cut is a git commit with the gate check in its history) is the
  chosen compensating control, not a review queue.
- **Site-side validation** (the site re-checks content shape at build or render time
  instead of, or in addition to, content-core's gate): rejected — it would create two
  enforcers of the same contract with no single authority, and gate-passing content could
  still fail to render correctly.
