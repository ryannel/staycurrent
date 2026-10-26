# Example and continuity decisions

Starting facts are the supplied shared example. No central business-fact or ownership changes are proposed.

- Independent pre-103 purchase replay: customer 1 Mina Shah; P3 price4.50 stock12, P7 price20.00 stock1, P9 price35.00 stock4. Success: pending order103 at2026-10-20 10:15UTC; line1 P7×1 at20.00, line2 P3×2 at4.50; value29.00; stock10/0/4; no payment. Existing101/102 and501–503 remain the starting rows.
- Request identity remains customer1 / purchase / purchase-103, separate from order103. The fixture canonical JSON normalises lines to P3 then P7, preserving prices as decimal strings. The prose's order P7 then P3 means the same fixed basket. A changed mug quantity2 is a rejected payload mismatch.
- Native transaction T and timestamps t₁/t₂ are symbols, not observed IDs or business times. Related writes are grouped, not assigned a fixed count of ranges. Reference/index work can add keys.
- Figure2 models an eligible Parallel Commits path after writes reach KV. It does not override v26.2 gateway write buffering, lazy transaction records or single-range optimisations. Coordinator disappearance happens after the successful reply and before cleanup, so it demonstrates a distinct boundary from the later missing-reply discussion. No distributed run is claimed.
- Figure3 is an independent read-refresh abstraction. Its P7 1→0 write represents invalidation, not an added committed order or a chosen race winner in the core story.
- Figure4 selects an injected/retry-shaped path in which no other transaction consumes stock before attempt2. It does not promise two attempts suffice.
- Independent refusal fixture: initialise P7 stock0 and P3 stock12 before attempting the same basket, with no103. Correct purchase-work rollback preserves12/0/4 and records refusal; deliberately omitting it leaves10/0/4 without103. This is a local test variation, not a changed shared starting state.
- Independent two-session conflict isolates P7: both work from the pre-103 fixture, one connection commits a guarded decrement; the earlier-reader's conflicting write gets40001. It adds no order and supplies no full business purchase trace.
- Native full-rollback, retry-savepoint and conflict experiments reset independently. P9 remains4. No provider, email, outbox row or payment is created.

Continuity pass completed with captions, options, text alternatives and pseudocode. General invariant/isolation design stays with transactions; generic key retention, canonical payload and recovery contracts stay with retry-outcomes; current/historical reads stay with crdb-reads; external work stays with outboxes-jobs. All in-text neighbour destinations use the supplied canonical /learn/databases/relational/ links. The collection wrapper owns their availability labels/navigation.
