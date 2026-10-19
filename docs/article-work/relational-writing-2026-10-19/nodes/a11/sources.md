# a11 — source and execution record

Checked 20 October 2026. Read the complete assigned context, commission and runtime;
the complete fixed Sequence diagrams, Indexes, and Storage and durability articles,
including their rendered figure text, controls and explanatory narratives; and the
actual a01 parent and a09 sibling. No archived editorial instructions were loaded.

## Primary sources and consequential claims

- William Kent, [A Simple Guide to Five Normal Forms in Relational Database Theory](https://www.bkent.davidjkent.com/Doc/simple5.htm),
  especially §§3.1–3.3 and §4: partial and indirect dependencies, identity/equality
  assumptions, independent multivalued facts and the difference when combinations
  themselves have meaning. Examples here are newly constructed booking cases.
- Philip A. Bernstein, [Synthesizing Third Normal Form Relations from Functional Dependencies](https://apollo.inf.upol.cz/~urbanec/teaching/2021/data2/files/bernstein.pdf),
  ACM TODS 1(4), December 1976, pp.277–298; §2 for keys, dependencies, projection,
  join, prime attributes and normalisation. The adviser example checks candidate
  keys under explicitly stated FDs; there is no synthesis algorithm in this article.
- Ronald Fagin, [Multivalued Dependencies and a New Normal Form for Relational Databases](https://s3.us.cloud-object-storage.appdomain.cloud/res-files/500-tods77.pdf),
  original 1977 paper linked from [the author’s papers](https://ronfagin.com/papers/)
  and [IBM’s publication record](https://research.ibm.com/publications/multivalued-dependencies-and-a-new-normal-form-for-relational-databases).
  §§2–3 define multivalued dependencies, BCNF, 4NF and nonloss decomposition.
  These support the concise normal-form conditions, not a claim that inspecting
  a sample proves the dependencies. The booking/adviser counterexample is reasoned
  from the stated rules and reproduced in native SQL.
- PostgreSQL 18, [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html):
  keys, matching composite references, requiredness, and why CHECK is not a
  general cross-row enforcement facility. SQL verifies the declarations used.
- PostgreSQL 18, [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html),
  [Materialized Views](https://www.postgresql.org/docs/18/rules-materializedviews.html),
  [REFRESH MATERIALIZED VIEW](https://www.postgresql.org/docs/18/sql-refreshmaterializedview.html):
  ordinary views store queries rather than results; materialised views persist
  results, do not automatically follow source updates, and refresh replaces their
  contents. No claimed concurrent refresh or interruption test.

## Native execution

Used only fresh database `rel3_a11_run1` on the documented disposable PostgreSQL
18.6 runtime, at loopback port 57319, role staycurrent. UTC, C cluster locale,
default read committed; no session setting overrides. Ran
`src/components/relational-next/a11/verify.sql`, which includes the unchanged a01
schema and fixture and this article’s `extension.sql`. Full output is retained in
`native-results.txt`. The database was dropped after retaining evidence; the shared
server was neither reconfigured nor stopped.

Observed:

- Three mixed service rows reconstructed with zero set differences.
- Figure 2 unsafe tenant-only split produced exactly two invented associations.
- Category correction reached both KIT reads. Removing every KIT line left KIT
  in the catalogue. MAP was offered with no bookings.
- Initial source optional subtotals: B11 €10, B12 €3, cancelled B13 zero.
- BCNF split local constraints admitted two advisers for B11/KIT. Controlled
  triples rejected a second adviser and an inconsistent adviser/service copy.
  Tenant-crossing line reference was rejected.
- Independent facility/language sets joined to four pairs. Correlated projection
  produced two false pairs. Zero languages left two facility memberships and no
  joined pairs.
- Sequential stale-read replacement reproduction: source €18 versus copy €15.
  This deliberately writes known earlier calculations; it is **not** a concurrent
  execution or proof of any protected protocol.
- MAP cancellation → €15; TEA deletion → €11; booking cancellation → zero;
  reactivation → €11. A later KIT quantity correction made source €14 while the
  materialised result stayed €11. Explicit refresh produced €14.

The native checks establish these sequential stored-state observations only.
They establish neither measured read benefit nor concurrent update/rebuild safety.

## Illustrative model and compile checks

`verify-model.mjs` checks all 80 supported figure states and meaningful outcomes:
invented associations, adviser enforcement loss, false availability, empty sets,
€15/€18 disagreement, explicit lag and final generation publication. The five
figures call this same model. They do not execute PostgreSQL.

Astro compiler 2.13.1 transformed the article fragment and DesignFigure without
diagnostics. Planned heading IDs and all review destinations were checked against
the registry. Root owns the full site build, promotion, browser checks and reviews.

## Boundaries

Retain the normalised source design. The adviser service copy has a stated
declarative enforcement purpose. The cached subtotal remains a proposed design
requiring performance evidence and a tested maintenance protocol. The 100 ms read
target and 60-second dashboard age are invented acceptance examples, not results.
History, constraint syntax, concurrency protocol implementation, delivery,
replacement and operational scheduling remain with their commissioned owners.

## Root teaching repair, 20 October 2026

Explicitly reset fact-box margins to zero in the namespaced dynamic-card rule, removing inherited article-section spacing from figure panels. Prose, model states, SQL and playback are unchanged.
