# Informed technical and editorial review

Reviewed 4 October 2026, by the technical contributor, independently of the article
author. This is an informed reading: I had the commission and helped settle SQL
contracts. It is not a blind reader or an independent review of my own fixtures.
Root owns rendered browser inspection and build verification.

## Consequential findings and repairs

1. **First normal form:** the first modelling draft associated scalar
   `product_1/product_2/product_3` slots with a 1NF violation. Scalar slots can be
   formally 1NF while still being brittle. The revised paragraph separates a
   nested purchase group from the fixed-slot design problem. Rechecked in source;
   the distinction now holds. The partial-key and indirect-dependency examples
   fit the declared shop rules. Their scope note avoids claiming a full formal
   definition for every possible candidate key.
2. **Numeric NaN:** `numeric(12,2)` admits NaN, and PostgreSQL orders it above
   normal numbers. A bare non-negative CHECK permits it. Both price checks now
   exclude NaN explicitly, and the prose explains why. Executed both rejection
   cases. This closes a material gap in the stated price contract.
3. **Integer extraction from JSON numbers:** the JSON type check deliberately
   admits fractions. A permitted `350.5` becomes text `350.5`, which the article's
   integer cast rejects. It can fail a query, index build or indexed write. Sent
   the writer a request to connect the fraction caveat directly to that cast.
   The executed extraction run observes query and indexed-write failures. The
   writer added the explicit `350.5` explanation beside the type check.
   Rechecked the revised source and reran extraction: the prose now connects the
   permissive number rule to the still-needed integer contract.
4. **Shared example:** aligned Bowl price at EUR 24, O12 at 09:00 UTC on 4 October,
   and the diagram's O13 lines. The concurrency example uses initially absent
   CUP-GREEN with distinct products P11 and P12; using already-assigned MUG-BLUE
   would contradict the two empty lookup results.

## What the sequence explains

The modelling article follows changes rather than just listing table names:
correcting a shared name, registering an unsold product, deleting its only sale,
and retaining an agreed price each make a different design consequence visible.
The distinction between present catalogue information and purchase history is
carried into the actual receipt query. The historical-name and address examples
show where the same reasoning applies without expanding the SQL schema.

Constraints follows that chosen schema, then separates a comparison's truth value
from acceptance of a row. It does not leave the reader with "a check enforces the
rule" when NULL passes. Composite identity and default UNIQUE null behaviour have
actual accepted and rejected writes. The concurrency explanation names the gap
between the earlier lookup and the insert, and the database's insertion-time rule
closes that particular gap. Empty orders and stock decisions supply concrete
limits while leaving the transaction branch its own job.

Tables and JSON gives credible reasons for all three arrangements. Shared
identity stays outside the variable object; related rows retain typing and
independent identity; JSON offers a descriptive bundle. The null/type examples
lead to query and write contracts, which lead to indexing and write contention.
Schema evolution returns to the original duplicated-fact problem. That connection
supplies a reason for an authoritative value during migration instead of ending
with a generic promise that a hybrid approach is best.

No further material causal gap appeared in the informed article reading. A few
paragraphs deliberately guard important boundaries—required subtype rows,
historical immutability, and price acceptance—and are justified by nearby
examples. Avoid adding more surveys of normal forms, JSON indexes or transaction
isolation: that would interrupt the worked reasoning. The integer/fraction point
above belongs because it changes the shown SQL, not because completeness requires
a new section.

## Six media: source-level semantic reading

| Aid | What its source communicates | Result |
| --- | --- | --- |
| SchemaMap | C4 has O12 and O13; the lines connect orders and products; the composite key permits line 1 in both orders | Matches the example and reference direction |
| FactChangeLab | Current copied names need all copies corrected; one referenced name changes both displays; agreed purchase price survives catalogue change | Correct; model explicitly excludes automatic propagation and transactions |
| CheckConstraintLab | TRUE/UNKNOWN pass CHECK, FALSE fails; NOT NULL separately rejects missing quantity | All four displayed values agree with executed SQL |
| UniqueWriteTimeline | Two free-code reads can precede competing inserts; B waits for A and fails after A commits | Correct illustrative immediate-constraint schedule; no elapsed-time or executed-concurrency claim |
| ProductAttributesMap | Columns/JSON share the product row; details have another row and a reference; boundaries affect row locks | Correct logical boundary, explicitly not a storage-size picture |
| JsonValueLab | Number and string share text extraction; missing, JSON null and whole SQL NULL differ | All five cases agree with executed SQL; diagnostic NULL case is distinguished from the production NOT NULL column |

Sent the media author one terminology repair: CUP-GREEN identifies a catalogue
product, rather than an individual "stock item." That distinction keeps SKU
meaning aligned with the article.

## Execution and remaining verification

`verify-sql.mjs` passed 48 asserted PostgreSQL cases. `verify-article-sql.mjs`
passed 34 statements extracted from the actual three Astro sources and four
focused contract probes. The exact extraction transcript includes source SHA-256 hashes.
No multi-session, plan-selection, speed, physical-storage or browser execution
was claimed. PGlite's one connection is the execution boundary.

The repaired fraction sentence is rechecked. Extraction and focused fixtures ran
again after the final article changes, so the saved hashes match that revision.
The informed technical/editorial result is **ready as a draft**, subject to root's
rendered-media, responsive-page and build checks. The small media SKU terminology
request remains with the media author. This is not publication approval and does
not replace the intended fresh-reader perspective.
