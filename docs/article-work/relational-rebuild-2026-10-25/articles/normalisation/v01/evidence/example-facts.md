# Chosen scenarios and continuity

- Flattened line schema: order_id, line_no, product_id, quantity, unit_price, customer_id, customer_name (current). Dependencies are OL→PQU, O→C, C→N. Abbreviations are introduced beside the synthesis. No extra core row is added.
- Figure 2 uses orders 101 and 103 for customer 1 with the supplied 12 October 09:30 and 20 October 10:15 UTC timestamps. Incorrect reconstruction is explicitly a counterexample.
- Figure 3 uses a schema projection (O,L,C,N) and arbitrary distinguished/fresh symbols. It adds no shop facts. The first row becomes distinguished through O→C then C→N.
- Adviser scenario is the centrally approved independent buyer_advice variation. A1/Iris Lin and A2/Oren Moss both advise green tea. Begin valid with (1,green,A1), (2,green,A2). A later attempted assignment (1,A2) is a locally valid BCNF counterexample, not an addition to core data. Adviser spelling in prose is British; the agreed advisor_id identifier is retained.
- Product/name/tag uses P7/Blue mug and the existing gift/ceramic memberships. No new tag or name is introduced.
- MVD scenario uses exactly P7’s independent gift/ceramic and S1/S2 memberships. The matrix displays the two selected diagonal tuples and the two swapped required tuples. It is not a claim about supplier packaging.
- Actual offers remain exactly (S1,P7,North), (S1,P3,South), (S2,P7,South). Their four-row pairwise join is explicitly lossy. The separately labelled pairwise-approval policy admits the fourth triple (S1,P7,South) by its declared rule. No fourth actual offer is added.
- Agreed line price remains 20.00 when P7’s catalogue becomes 22.00. Current customer name is distinguished from historical agreement. No historical rows are rewritten.

No extension outside the centrally approved record was needed. The FD chase projection and adviser assignment selection were reported to the coordinator. Later independent fact capacity (products before memberships) is distinguished from reconstruction of legal original projections. SQL NULL/duplicate semantics, concurrent enforcement, migrations, query costs and detailed temporal work remain with their assigned neighbours.
