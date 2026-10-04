# Editorial review

Reviewed 4 October 2026. Independent full reading of `modelling.astro`,
`constraints.astro`, and `tables-and-documents.astro` for engineers learning
relational design. Used the style and review skills, `docs/writing-style.md`,
and the original “Disc” and “Transmission” passages in Bartosz Ciechanowski’s
*Gears*. Build and browser checks belong to the coordinating review.

**Result: ready as a draft from this editorial perspective.** The sequence has
enough explanatory depth and a coherent progression from facts and identities
through enforcement to typed and embedded attributes. This is not publication
approval or evidence of rendered-media behaviour.

The first reading found two bounded repairs:

- The transition from first normal form to JSON left readers to reconcile a
  column value with facts inside an object. The added paragraph in “Attributes
  in an object” now makes the connection explicit. Its supplier-address example
  shows how embedding can recreate the earlier update problem, while the mug’s
  descriptive attributes remain facts about that product. The repair resolves
  the gap without a theoretical detour.
- The final design paragraph said the stored agreed price preserved “what Ada
  paid.” It now says “what Ada agreed to pay,” preserving the distinction between
  purchase terms and payment that Constraints establishes.

Both repairs were reread in their surrounding passages. No consequential
editorial issue remains from this review.

Preserve the price-change opening and its separation of shared current facts
from purchase history. The normalisation section gives each anomaly an
operational consequence and explains what moves in the second- and third-normal-
form examples. Constraints develops unknown check results, competing inserts,
and incomplete purchases rather than merely listing limitations. Tables and
JSON follows representation choices through extraction, validation, indexing,
contention, and migration. Its number/string example makes lost distinctions
concrete. Headings identify useful subjects, and the openings work without
decks. There is no editorial reason to impose a shorter length or uniform
section shape on these drafts.
