# Scoped repair: complete the alternative decomposition

Accepted finding: first practitioner review, batch-08/practitioner.md, “Testing the dependencies that remain”. The original alternative omitted line_no from the preceding four-attribute schema. Read the full working article before designing the repair and applied staycurrent-revise; retained the reference exposure and technical sources already checked for v01.

Changed only the final paragraph of that subsection, article.astro line 103. It now explicitly splits (order_id, line_no, customer_id, customer_name) into (order_id, line_no, customer_id) and (order_id, customer_name). The components cover every attribute. Their shared order_id determines the whole second component, so the binary lossless-join test applies. The union of their projected implied FDs still does not imply customer_id → customer_name.

`node evidence/repair-lossless-alternative.mjs` passed. Its retained result records:

- Complete attribute coverage and the shared determinant’s closure.
- Every implied local FD, obtained by closing all subsets of each component under the original FDs and projecting the reached attributes.
- A legal set-based original with orders 101 and 103 and both line numbers 1 and 2 of 103. Projection and join recover exactly those rows and retain both line numbers.
- A deliberately inconsistent correction of order 103’s current customer name. Both local relations satisfy every projected FD, but their join has Mina Shah and Mina Patel for customer 1 and violates customer_id → customer_name. The customer’s closure under the local FD union contains only customer_id.

These are focused relational calculations, not new engine observations. The universal losslessness argument uses the binary theorem already checked in Database System Concepts chapter 7; projected-FD preservation uses Foundations of Databases section 11.2. No source claim or dependency language changed.

Continuity confirmation: reread the surrounding definitions of decomposition, the unchanged four-column chase, binary intersection test and projected-dependency method, then the downstream adviser contrast and final design assessment. The corrected alternative now stays within the same base schema; it supplies a compact first example of losslessness without local preservation before the adviser figure develops that trade-off. No wider restructuring or unresolved dependency.

Figures, styles, controls, metadata, shared models and scenes are byte-identical to v01. Original model/SQL results, all 132 rendered scene checks and original evidence files are retained without rerunning unaffected checks. The original v01 archive was not touched. `source-hashes.json` remains the original first-version manifest; `repair-lossless-alternative-hashes.json` records the repair separately.

Stable compilation requested from the coordinator. Return for scoped confirmation only; no new full review, server, database fixture, commit or publication was performed.
