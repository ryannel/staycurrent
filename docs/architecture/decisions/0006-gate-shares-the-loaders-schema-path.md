---
title: 0006. The Publish Gate Validates Through the Loaders' Own Schema Path
description: The publish gate parses every staged content artifact through the identical loader code the site build uses, so a gate-passed cut can never land content the reader then rejects.
status: accepted
last_reviewed: 2026-07-14
---

# 0006. The Publish Gate Validates Through the Loaders' Own Schema Path

**Status:** accepted     **Owner:** content-core maintainer
**Date:** 2026-07-14     **Supersedes:** — (extends [0003](0003-single-fail-closed-publish-gate.md))

> The record is immutable; the decision is not. If this is later superseded,
> change status to `superseded by [NNNN](NNNN-<slug>.md)`, add a one-line note
> at the top of the body explaining what changed, and leave the original
> reasoning intact.

## Context

[ADR 0003](0003-single-fail-closed-publish-gate.md) established one fail-closed
publish gate inside content-core. As first built, that gate checked **artifact
integrity** — snapshot completeness, version agreement, byte-identical skill,
provenance presence, slug/cadence/date shape — but not the **content schema** the
site build's loaders enforce at render time. The two validated different things.

The founding bet surfaced the cost twice, empirically. A staged `article.md` with
a blank `stance`, and later a staged `changelog.md` whose `**Stance:**` line was
bullet-prefixed, both **passed the gate**, `cut` committed them — and then the
loaders (`loadTopic`, `loadChangelog`) rejected the committed files, breaking the
site build *after* the run had closed and its staged tree was gone. Fail-closed,
but in the wrong place: after landing, with no sanctioned repair (the operator
never hand-edits `topics/`), and directly against the loop's zero-hand-edits
premise. The same defect appeared in two different stores (change-proposals 6 and
7) — a recurrence, not a one-off — which is what promoted the fix from a patch to
a recorded stance.

## Decision

**The publish gate validates every staged content artifact by parsing it through
the identical loader code path the site build uses — never a re-implementation of
the schema in the gate.** Concretely, the gate's `frontmatter-schema` and
`changelog-schema` checks call the same module-internal validator/parser that
`loadTopic` and `loadChangelog` wrap; each `ContentValidationError` issue becomes
one `GateFailure` carrying the loader's own message verbatim. The gate and the
reader see one schema, so a gate-passed cut can never land content the reader
rejects. This is ADR 0003's "one gate, one code path" principle extended from
*where the gate runs* to *what code it validates with*.

## Assumptions

- The site build's loaders remain the authoritative definition of "valid content"
  — if a second consumer with a stricter schema appears, it too must feed the gate,
  or the gate stops being complete.
- content-core stays embedded and in-process, so the gate can call the loaders'
  code directly without a network or serialization boundary.
- Loader validation stays pure and side-effect-free (safe to run against a staged
  tree that has not been committed).

## Review trigger

When a new content artifact type or a second content consumer with its own schema
is introduced — that consumer's validation must join the gate, or this decision is
incomplete and returns for review.

## Trade-offs

- **What we gave up:** some checks now report the same underlying problem twice
  (the schema check overlaps the older shape checks for cadence/date and the
  changelog top-entry). This double-reporting is deliberate aggregation, not
  redundancy to dedupe.
- **What risk we accepted:** the gate's cost grows with the loaders' — a slow
  loader makes a slow gate. Acceptable while content is small and local.
- **What this makes harder in future:** a consumer that *wants* a looser schema
  than the gate cannot get one; the gate enforces the strictest shared floor.

## Alternatives considered

- **Leave the gate at artifact integrity; let the build fail on bad schema.**
  Rejected: it fails after the commit lands, against the zero-hand-edits premise,
  with no clean repair path — the exact failure the founding bet reproduced twice.
- **Re-implement the schema checks in the gate independently.** Rejected: two
  definitions of "valid" drift, which is the precise class of bug ADR 0003 exists
  to prevent; the gate would pass content the loader rejects, or vice versa.
