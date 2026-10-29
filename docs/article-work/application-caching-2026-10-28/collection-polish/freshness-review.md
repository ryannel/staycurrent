# Independent scoped review: freshness pair

29 October 2026. Reviewed the complete current `freshness.astro` and `versioned-fills.astro`, recovering the clipped end of the first article separately, and all of `stories/freshness.mjs`. This is an independent technical/reader and causal-animation review of the repair, not a new collection-wide review. The coordinator owns browser layout and controls. No colleague files were edited.

## Findings

No substantive technical or reader finding in this scope.

The age drawing preserves one age origin across insertion and replica lag. Its age-limit position is adjusted by the replica's prior age, while the insertion TTL still begins at the fill. The explanation properly distinguishes trustworthy source observation from receiving a stale replica result and keeps clock assumptions beside the guarantee.

The three race drawings retain the same actors and operation order. Source revision 1 is obtained before the merchant commits revision 2; deletion arrives at the cache before the unprotected fill. In the token case reservation arrives before the source read and deletion removes it before publication. In the unheard-change case that deletion is deliberately delayed, so the still-matching token permits the old fill. Each visible state changes at the corresponding travelling event's arrival. These cases teach distinct limitations without conflating rejected publication with the waiting caller's result.

The dependency drawing correctly leaves the under-£21 list wrong after the mug's price rises; its membership cannot be repaired merely by reading current cards. The outbox drawing makes price and pending work appear together and does not mark the record complete until the successful deletion. Its caption explicitly avoids claiming that durable delivery also stops late fills.

The authoritative-revision sequence reads revision 2 before selecting the `:r2` card, retains the old key for comparison, and returns through Server to App. The surrounding miss pseudocode uses the payload's own revision from its source snapshot, rather than attaching the first lookup's revision to a later product read.

The remembered-knowledge comparison labels the lower case as deliberately unsafe. The conditional-token implementation checks and replaces one record atomically, consumes permission on success, and treats absence as refusal. Source freshness, old-snapshot recovery, duplicate source work and cache publication remain separate concerns throughout the article. The recovery warning does not imply asynchronous Redis failover preserves a revoked token.

## Limits

This review inspected source-level choreography and explanatory causality, not rendered geometry, keyboard operation or reduced-motion behaviour; those remain the coordinator's current browser checks. Native experiment code and evidence were not changed by this writing/figure repair and were not rerun. The review makes no new measured-performance, failover or native-memory claims.
