# Example facts and continuity

Baseline is the post-order-103 shop: P3 Green tea, 50g 4.50/stock10; P7 Blue mug20.00/stock0; P9 Teapot35.00/stock4. Main one-way products copy raises P7 to22.00. Orders/payments are outside the copy. Order103 remains pending, no payment, agreed line total29.00. No currency assigned; no sequence or new business time introduced.

Independent local scenarios:

- Initial-copy drawing places the same20→22 update during the copy; conceptual, no asserted observed concurrent copy timing.
- Pause/resume native phase reverses P7 from22 back to20 while subscriber disabled; subscriber stays22 then catches20. It does not change the shared starting record.
- Filter drawing uses a separate full-row/FULL-identity publication and price>=21.00. Independent20→22 enters;22→20 leaves. The working publication remains a full products copy. No subscription to overlapping variants is instructed.
- Keyless identity_demo reuses P7/20 then attempts22; separate native counterexample, not schema change to products.
- Duplicate-key repair independently introduces P11 Tea strainer8.00/stock0 locally at subscriber and then publisher. It is the existing independent P11 product variation, not importB17 or a new shared baseline row. Native evidence retains the exact attempts and cleanup.
- Consumer model uses symbolic C for the source price transaction. No invented native LSN/time, connector or real external effect. Projection is assignment to22; alternative append/counter repetition is explained without claiming an observed service.
- Retention R/F/N are symbolic ordered positions, not byte scale or measured LSNs.

Complete author reread/continuity pass: concepts develop source→identity→setup/copy→selection→compatibility→progress/repair→consumer→handover. Figures, captions, controls and their alternatives checked together. `product_id` remains logical identity; `ctid` is only contrast with physical tuple location. Replica identity differs from identity-column sequences. Receipt/apply/fresh snapshot, slot restart/confirmation and failover/writer handover stay distinct.

Ownership retained: native row stream here; explicit application intention/deduplication/external outcomes with outboxes; physical promotion/fencing/former-primary return with pg-replication; full inventory/acceptance/write handover/return boundary with pg-upgrades. Canonical links only. No shared business-fact or ownership extension required.
