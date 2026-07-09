---
title: 0004. Research Runs in the Operator's Claude Code Session — No LLM Integration
description: The product ships no LLM SDK, API keys, or inference cost center; research intelligence is the operator's own Claude Code session, and workbench "programs" are skills.
status: accepted
last_reviewed: 2026-07-09
---

# 0004. Research Runs in the Operator's Claude Code Session — No LLM Integration

**Status:** accepted     **Owner:** operator
**Date:** 2026-07-09     **Supersedes:** —

> The record is immutable; the decision is not. If this is later superseded,
> change status to `superseded by [NNNN](NNNN-<slug>.md)`, add a one-line note
> at the top of the body explaining what changed, and leave the original
> reasoning intact — never overwrite it. The trail is what makes the set
> trustworthy enough to re-evaluate against.

## Context

The research loop (convene → research → argue → decide) needs a source of intelligence.
The product brief constrains research to subscription pricing rather than a metered
inference cost the product operates and pays for, and wants the workbench portable to any
Claude Code installation. The choice was between the product integrating directly with an
LLM API (or a hosted research service it operates), versus the research intelligence
being the operator's own interactive Claude Code session.

## Decision

Stay Current's research intelligence is the operator's own Claude Code session. The
product ships no hosted LLM integration of any kind: no API keys, no provider SDK, no
inference cost center in the codebase. The workbench's "programs" are skill definitions
(`SKILL.md` + `references/`) and deterministic scripts that a Claude Code session
executes, not a client of any inference API the product operates or bills for.

## Assumptions

- The operator has, or gets, their own Claude Code subscription and runs research
  sessions interactively — the product does not, and cannot, run research unattended,
  since there is no service account or API key to do so.
- Claude Code's skill and subagent facilities remain sufficient to express the research
  loop's choreography (convene / argue / decide) without needing a capability only a
  direct API integration would unlock.

## Review trigger

If the product needs research to run unattended — on a schedule, with no operator present
— or needs capabilities Claude Code's skill surface can't express, this decision is
revisited. That would require introducing exactly the API integration and cost center
this ADR declines.

## Trade-offs

- **What we gave up:** the ability to run research autonomously or on a schedule without
  an operator present in a Claude Code session.
- **What risk we accepted:** research throughput is bounded by the operator's own session
  time and subscription, not by the product's ability to scale inference spend.
- **What this makes harder in future:** any pitch for a fully autonomous research mode
  requires undoing this decision, not extending it.

## Alternatives considered

- **A hosted research service the product operates:** rejected in the product brief — it
  introduces an inference cost center and infrastructure the product's economics don't
  call for.
- **Direct API integration** (the product holds its own Anthropic API key and calls the
  model): rejected — it duplicates a session the operator already has, adds a cost model
  the subscription-pricing constraint exists to avoid, and adds a credential the product
  would need to manage.
