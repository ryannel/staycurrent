# Scoped practitioner confirmation

25 October 2026. **Resolved:** the critical missing-`line_no` finding in `practitioner.md`. No unresolved part of that finding remains.

Checked current `src/articles/relational-rebuild/normalisation.astro`, SHA256 `00b0412f1aa39e7b5a9574cc82ac8e93fca826e9e15c360e418d1c7327fa812e`, byte-identical to the archived `normalisation/repairs/complete-projections/source/src/articles/current/article.astro`. Comparison with v01 confirms that only the paragraph at line 103 changed. Metadata, Walkthrough, model and scenes remain byte-identical to v01.

The replacement explicitly decomposes the existing four-attribute schema into `(order_id, line_no, customer_id)` and `(order_id, customer_name)`. Their union covers the schema. Their intersection is `order_id`; its original closure contains customer ID and customer name, so it determines the complete second component. The preceding binary lossless-join test therefore applies without any silent change of base schema.

The preservation contrast also remains correct. Projecting all implied FDs gives `order_id → customer_id` on the first component, with its augmented variants, and `order_id → customer_name` on the second. Under their union, customer ID alone reaches no customer name. The repaired split is thus lossless but does not preserve `customer_id → customer_name` locally. I independently calculated these closures and projected dependencies using a small Python set calculation; the original two-line counterexample now round-trips with both line numbers intact.

Inspected the focused verifier and its retained results: its legal round trip retains lines 1 and 2, and its separately labelled inconsistent-name state satisfies each component's projected FDs while the joined relation violates the customer/name rule. Its status as a set-based witness rather than an engine observation or exhaustive proof is accurate. The universal losslessness argument rests on the binary theorem already checked in the first review.

Read the surrounding projection/coverage definitions, four-column chase and preservation procedure, plus the later adviser contrast and final decomposition assessment. The new “different split” stays distinct from the unchanged chase/synthesis design; no downstream claim assumes that the alternative preserves both original FDs. The later legal-original versus independent-table-state explanation remains consistent.

Scope limits: this is confirmation of the accepted local argument only. Original model, SQL and rendered coverage are retained. No database, native harness, full article/corpus review or new rendered sweep was run; no article source was edited.
