# Example facts and continuity decisions

Starting facts come only from the supplied `docs/coverage/relational-example.md`. No canonical record is changed.

- Mina Shah is customer 1, Tariq Aziz customer 2, Edda Berg customer 3. Edda has no orders. Mina owns 101 and 103; Tariq owns 102.
- Order 101: line 1, P3 × 1 at 4.50; line 2, P9 × 1 at 35.00; total 39.50. Payments 501 for 30.00 (card), 502 for 9.50 (gift card). Pairing each line with each payment produces four rows and a repeated payment sum of 79.00. No line allocation is asserted.
- Order 103: 20 October 2026, 10:15 UTC, customer 1, pending. Line 1, P7 × 1 at 20.00; line 2, P3 × 2 at 4.50; total 29.00, no payment. Money has no assigned currency.
- Order 101 was placed 12 October 2026, 09:30 UTC. These two timestamps are used to demonstrate safe/unsafe reconstruction.
- P7 is Blue mug; P3 is Green tea, 50 g; P9 is Teapot. P9 appears only on order 101 line 2 in the starting data; deleting that line from a hypothetical sole flattened store illustrates losing product facts.

Local illustrative changes, each starting again from the base data unless the figure states a change:
- Figure 2 proposes an additional line 3 containing P7, to compare occurrence identity with a unique order–product pair. It does not add that line to the total calculation later.
- Figure 5 corrects customer 1's current name to Mina Patel. One-copy failure and the repaired single customer row are shown; later figures return to the starting data.
- Current offers: (S1, P7, North), (S1, P3, South), (S2, P7, South). (S1, P7, South) is absent. Its three pairs all occur. One current offer per triple is an explicit local rule; future repeated offers would need another distinction.
- P7 has independent tag memberships gift and ceramic, and supplier memberships S1 and S2. No tag–supplier relationship is asserted.
- After order 103, products.price for P7 rises from 20.00 to 22.00; its line unit_price stays 20.00. Catalogue-based repricing would give 31.00; agreement-based total remains 29.00. No tax, shipping or adjustments are included.
- Optional subtype examples: tea_details(P3, origin=Japan), teaware_details(P7, capacity_ml=300). Product identities remain shared. Overlap and completeness are decisions to enforce separately.
- Categories: Teaware is root, Mugs under Teaware, Blue mugs under Mugs. The multiple-parent alternative adds Gifts as another parent of Mugs. References do not prevent cycles.

Continuity pass: read the entire authored article, figures, captions and control explanations from the commissioned reader's starting vocabulary. Functional-dependency notation is introduced before normalisation. Superkey/candidate-key meanings are introduced before BCNF. Historic agreement versus current name is explicit. Repeated foreign keys are distinguished from repeated dependent facts. Lossless reconstruction is distinguished from local dependency enforcement. Independent sets are contrasted directly with the genuine three-way offer. Both children are labelled planned, without links implying availability. Other routes are limited to those supplied in delivery context.

Normal forms are practical diagnoses here. Formal closure, decomposition algorithms, overlapping-key trade-offs and higher-form analysis remain with the planned child. Detailed hierarchy operations, enforcement, temporal procedures, query construction, value choices and physical measurement remain outside the article's working depth.
