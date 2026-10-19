# a22 writer handoff

Status: staged draft ready for orchestrator integration and two independent
reviews. No nested agents, final source route edits, shared edits, full build,
Git staging, commit or push performed by this writer.

## Outputs

- `article.astro`: full supplied heading anchors; final-location imports.
- `src/components/relational-next/a22/RecoveryFigure.astro`: five interactive
  figures, explicit causal event line, observer/attempt/database state, comparison
  at a preserved step, End, manual scrub/next/back, text fallback and slow playback.
- `src/components/relational-next/a22/model.mjs`: illustrative scene schedules.
- `src/components/relational-next/a22/rehearse.mjs`: reader-download native checks.
- `native-results-run2.jsonl`: successful real-driver evidence.
- `native-results.jsonl`: initial run retaining the unexpected successful COMMIT.
- `sources.md`: primary sources, session overrides, observations and limits.

## Scope and teaching decisions

Uses Mina's parent order and one stable operation K7. Explains one logical
operation versus transport requests and transaction attempts before deadline
accounting. Outcome evidence determines retry or resolution. A minimal retained
operation protocol handles matching overlap, changed input and unknown commit
replies at READ COMMITTED using a separate post-conflict lookup statement.
Retention is an explicit part of the guarantee. Full stock/concurrency theory
links to transactions, cleanup to a20 and external publication/takeover to a23.

The timeout table is a scope reference, with the a20 demonstration used as the
prerequisite; no duplicate cancellation/reuse procedure is taught here. The
COMMIT observation is narrowly reported and does not claim that a local timeout
guarantees request completion.

No proposed tree changes. There are no child articles; contextual sibling links
also appear in the final reading list.

## Checks completed

- Astro compiler transform: article fragment and RecoveryFigure; zero diagnostics.
- Node syntax checks: model and native rehearsal; pass.
- Native PostgreSQL/pg harness: all run-2 assertions pass; own database removed,
  zero remaining own database sessions before drop. Details in sources.md.
- Whitespace check for own output paths: pass.

The compiler is resolved through Astro's installed dependency; it is not a direct
repository dependency. No dependencies were added. The writer did not build dist
or interfere with the active independent review snapshot.

## Render and review follow-up

Root must copy the staged fragment to the final src article before route-based
browser review. Writer-side template compilation is complete; rendered desktop,
phone, light/dark, intermediate cards and full playback still need the root's
fixed review snapshot. In particular check that the budget bar, all three outcome
histories, claim timeout endpoint, fingerprint mismatch and expiry endpoint align
with their narration. Mobile panels use divs with explicit zero margins rather
than article section elements, and playback uses the whole visible figure text
at three words/second plus headroom, without a short maximum hold.
