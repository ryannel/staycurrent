# Pilot p01: independent practitioner repair recheck

Reviewed 19 October 2026 using the previously read `staycurrent-review` skill,
practitioner perspective only. This is a narrow recheck of p00 findings; the
unchanged report logic, scope and model outcomes retain the p00 assessment.
No teaching review or old relational corpus was read. No article or component
was edited.

## a14 — Joining and summarising data

**Verdict: pass. No remaining required practitioner repairs.**

- **a14-P1 resolved:** `queries.mjs` now defines employees once in a CTE and
  references that same relation with aliases e and m. It matches the existing
  self-join prose and teaches the two roles directly. Independently executed the
  repaired query in PGlite 0.5.8 / PostgreSQL 18.3 and the named native PostgreSQL
  18.6 review cluster: both return `(Mina, NULL), (Tariq, Mina)`. The existing
  expected-row assertion remains appropriate; its result contract did not change.
- **a14-P2 resolved:** snapshot `a14.astro:104` now says an additional grouping
  column can split a group when its values vary within it, and explicitly
  contrasts the dependent customer name with order status. This is accurate and
  consistent with the dependency explanation in the following paragraph.
- **Optional negative-check improvement resolved:** `verify.mjs` now compares
  the same ID/value projection on both sides. Independently executed that shape
  in PGlite and confirmed matching column names but differing values, including
  customer 1's wrong 100/60 rather than 50/30. The failure can no longer pass
  merely because the column shapes differ.
- **Optional evidence wording resolved:** snapshot `a14.astro:179` distinguishes
  the shared-column sum comparison from the ON/WHERE customer/order-pair
  comparison. Its claims now describe the performed checks exactly.

All four owned-file SHA-256 values matched the p01 manifest. Compared p00/p01
article snapshots and inspected the changed query and verifier sources plus the
writer's repair evidence. `models.mjs` is byte-for-byte unchanged from p00.
Figure-control repairs belong to the independent teaching recheck; this report
does not repeat that work or recertify layout and playback.

The main report, completeness policy, original relational-practice depth and
parent/sibling boundaries have no new practitioner concern. No full unchanged
verifier or build rerun was needed for this narrow recheck; the writer separately
records both complete engine runs and the build after repair.
