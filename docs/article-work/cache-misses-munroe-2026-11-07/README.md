# Handling cache misses: writing-reference trial

## Commission and scope

Rewrite Handling cache misses with the updated writing skills. The owner initially
requested a comparison draft, then explicitly authorised publication: “actually just
push it to prod”. The published baseline is commit `50e06756`; this work uses branch
`codex/handling-cache-misses-munroe`.

The existing [dossier](../../coverage/application-caching-2026-10-28-dossier.md),
[ten exit questions](../../coverage/application-caching-2026-10-28.yaml) on the
`cache-misses` node, and [example record](../../coverage/application-caching-2026-10-28-example.md)
remain the plan. The scope is unchanged: same-key duplication, independent caller and
load deadlines, leases and conditional publication, early refresh, source admission,
outages, retries and recovery. Neighbouring articles retain key design, freshness
contracts, versioned publication and cache operations.

## Writing decisions

The author read all four current Munroe references in the preceding skill-update work;
their complete texts remained in context. The explanation starts with one cached list
and the requests arriving while it is rebuilt. Fleet numbers arrive when concurrency
and source protection need them. Necessary assumptions accompany the reasoning; detailed
provenance remains at the end. The executable examples and all five figures are retained;
review repairs correct the lease trace annotation and the recovery figure's provenance.

The new prose makes the 20-millisecond capacity calculation explicitly approximate
(Little's law needs a mean, while the shared example supplies a median). It separates
client cancellation from confirmed source completion and distinguishes lease ownership
from current source-version correctness. The unrelated AWS retry-quota details are
removed: current AWS documentation makes the 2026 behaviour opt-in, and those precise
costs are unnecessary to the article's retry-budget decision.

## Evidence

Existing native experiments and simulations are unchanged and remain in
[the 6 November pilot](../cache-misses-pilot-2026-11-06/evidence/). The author inspected
the wrapper, stampede, lease, connection-limit and simulation output records relevant
to the retained claims. These are reused execution records, not new runs. The Go example
and Lua publication example keep their existing behaviour. New arithmetic is explicit
in the prose; no new production measurement is claimed.

Primary-source checks include Go singleflight and WithoutCancel; Redis lease ownership
and conditional deletion; PostgreSQL 16 statement timeouts, connection checks and
connection limits; the XFetch paper; Google SRE guidance; and AWS retry documentation.
Article links point to the supporting sources. Independent review followed the retained
claims and examples back to their evidence.

## Review and verification

The new article receives the three current review lenses. The reader-and-visual lens
records an unaided reading before seeing the voice and figure guides. Teach-back uses
only rendered prose and exit questions, with an independent marker. Findings, repairs,
confirmations and build/render checks are recorded here as they complete.

| Finding | Decision and repair | Confirmation |
| --- | --- | --- |
| P1: prewarming assumes an unspecified popularity order (critical) | Accepted. Distinguish the demand simulation from the calculated prewarm expectation; state that catalogue order is independent of popularity in prose, caption and text alternatives. | Confirmed in `reviews/repair-confirmation.md`; final caption rendering confirmed |
| P2: the lease trace claims an unexecuted stale response (critical) | Accepted. Remove the stale-response annotation from the condensed trace and state that the native test had no older list to serve. The preceding hypothetical timeline keeps the valid policy choice. This issue was inherited from the baseline. | Confirmed in `reviews/repair-confirmation.md` |
| P3: missing distinctions between lookup, load and source counters (medium) | Accepted. Add application counters and source-side views, with an example where coalescing and retries produce different totals. | Confirmed in `reviews/repair-confirmation.md` |
| P4: missing cache-native coordination and failed-shard alternatives (medium) | Accepted. Add brief memcached meta and Gutter explanations with primary sources. | Confirmed in `reviews/repair-confirmation.md` |
| R1: reduced fallback assumes the missing fields are available (medium) | Accepted. Permit it only when the page already has usable fields; otherwise return an explicit error without another source read. | Confirmed; exit question 6 remains Supported |
| R2: unexplained approximate XFetch lead formula (low) | Accepted. Retain the clearly labelled simulation result and remove the extra rough formula. | Confirmed; exit question 5 remains Supported |
| R3: editorial history in the provenance paragraph (low) | Accepted. Remove the sentence about supporting this rewrite. | Confirmed |
| R4: invented teammate in the pool opener (low) | Accepted. State the numerical pool example directly. | Confirmed |
| R5: first-fill marker crosses the capacity label (medium) | Accepted. Draw the existing label last so its paper halo clears the marker in both layouts. | Confirmed in all four theme/layout combinations |

The independent teach-back marker found all ten exit questions Supported on v1.
The answer and marking reports retain their restricted-input evidence. After repairs,
the fresh confirmer checked questions 5 and 6 again and retained the unaffected marks.
The reader's unaided observations are retained separately from its informed assessment.
The writer reread the repaired article in order with figures omitted, then checked the
bounded XFetch and fallback refinements in their surrounding explanations and later uses.

## Final verification

- `pnpm build`: pass, 139 pages; site checks cover 114 pages and 14 rules. The 36
  existing dense-prose warnings on 16 other pages remain outside this commission.
- Targeted `dense-prose` check on this article: no findings after simplifying the
  simulation sentence and separating fallback choices from their shared limits.
- `pnpm test`: all 24 tests pass.
- All five figures: both themes, desktop and 375 px, settled states, variants and
  keyboard controls checked by the independent reader. Contrast and overflow checks
  passed; the one label collision is repaired and freshly confirmed in all four theme/layout combinations.
- `git diff --check`: pass.

The [v2 build manifest](evidence/v2-build.json) identifies the final article and figure
sources. [v2 prose](evidence/v2-prose.txt) is extracted from the built page with figures,
captions and controls omitted. Its code is plain text; v1's extraction retained some
syntax-highlighting markup inside code blocks, so the two word counts are not comparable.

Evidence limits: the native database runs are reused, not rerun. The first browser
snapshot exposed captions before the reader could isolate the figures; its unaided
prose observations were already saved. Reduced-motion emulation was unavailable, so
that preference was not retested. The shared player and colour palette are unchanged.

All accepted Critical and Medium findings are repaired and independently confirmed.
The Low findings were also repaired. The commission changes no neighbouring scope or
shared example facts. Publication to `origin/main` is explicitly authorised by the owner.
