# Example facts and continuity

P3 remains Green tea, 50 g, origin Japan, price 4.50. P7 remains Blue mug,
capacity 300 ml, price 20.00, with independent gift and ceramic memberships.
Post-103 stock in the disposable verifier is P3/P7/P9 = 10/0/4. No stock write,
payment or new business identity is introduced. P9 remains Teapot, price 35.00.

Order 103 remains pending. Lines are 103/1 P7 × 1 at agreed 20.00 and 103/2
P3 × 2 at agreed 4.50; response lines preserve their sequence and total 29.00.
No catalogue price is used to reprice the response. Monetary unit is unassigned.

Local illustrative alternatives, not changes to the shared shop:

- `product_documents` is a proposed one-object-per-product JSONB detail table.
  Typed subtype rows are an alternative home for the same details, not a second
  authority. Both retain product identity/reference.
- `teaware_documents` is a separately proposed stricter table with required
  positive numeric-JSON capacity and arbitrary extra members. It does not claim
  subtype completeness for the shop or imply that P3 requires capacity.
- The measurement composite uses 300 ml, without adding a measurement fact.
- `tag_probe` has diagnostic documents labelled p7, reversed, extra and repeated.
  The first projects the existing memberships; variations are not products or
  new authoritative tags. The sale/repeated entries exist only in this probe.
- Missing/null/string/zero/negative/array/scalar/boolean inputs are constraint
  counterexamples, not shop states. Array [300] is the lax-JSONPath counterexample.
- Capacity 330, care “hand wash”, dimensions and width_mm 80 are isolated update
  examples. The stale/current-value figure is conceptual Read Committed, A's
  commit before B's UPDATE starts; no overlapping-session observation is claimed.
  The path-creation example does not propose two authoritative capacity fields.

No central shared-fact or ownership extension is needed. General modelling/EAV,
SQL NULL/equality, result grain/aggregation, access-method mechanics, transaction
protocols, HOT internals and migration procedures remain with their owners.

Continuity reread: the field starts as an optional specialised description,
then a clearly announced stricter local contract makes numeric indexing safe.
The predicate probe is introduced before its SQL table name is used. JSONB vs
text, JSON null vs SQL NULL, occurrences vs membership and search vs validation
stay distinct in prose, figure state, captions and verifier outputs. Figures use
captions rather than document headings. Canonical neighbour links are retained.
