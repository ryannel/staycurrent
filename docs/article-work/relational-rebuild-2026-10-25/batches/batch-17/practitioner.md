# Practitioner review · Failover and fencing

Reviewed v01 on 25 October 2026, against batch-17/review-source.json. **No substantive practitioner findings.**

## Scope and evidence

Read the complete frozen article and Transfer component, supplied plan, article/prerequisite brief, incoming and neighbouring ownership, commission and original shared-example input. Checked the actual hashes: article `99506afb…798b`, metadata `d8988f94…94c3`, Transfer `0766301d…8e86`, verifier `b12a9772…a16b`, shared-example input `44656a90…3d31` and SQL results `450bafd1…76387` match the frozen receipts. The SQL result also names the reviewed full article hash.

Inspected `verify-example.mjs` and `sql-results.json`: one owned in-memory PGlite 0.5.8 instance reports PostgreSQL 18.3/WASM; the verifier extracts the displayed SELECT and constructs the before/after states. Results preserve catalogue 20.00/22.00, pending order 103 and line total 29.00, with stock 10/0/4 and no payment for 103. This supports the displayed fact query and arithmetic only, exactly as the article states at lines 50–58. No native failover execution is claimed or required to establish the expressly conceptual schedules. Read the supplied native-environment provenance; its runtime probe is not treated as replication evidence.

Checked the consequential mechanisms directly against [PostgreSQL 18 Failover](https://www.postgresql.org/docs/18/warm-standby-failover.html), [standby operation and synchronous replication](https://www.postgresql.org/docs/18/warm-standby.html), [Pacemaker fencing](https://clusterlabs.org/projects/pacemaker/doc/3.0/Pacemaker_Explained/html/fencing.html), [Patroni watchdog](https://patroni.readthedocs.io/en/latest/watchdog.html), [Patroni replication modes](https://patroni.readthedocs.io/en/latest/replication_modes.html), [Chubby §2.4](https://storage.googleapis.com/gweb-research2023-media/pubtools/4444.pdf) and [pg_rewind](https://www.postgresql.org/docs/18/app-pgrewind.html).

## Assessment

The authority/history separation holds throughout: heartbeat loss leaves the old connection possible; confirmed power fencing includes restart exclusion; leases require a tested exclusion protocol; the hypothetical generation check protects only the enforcing receiver. The A/B example distinguishes durable usable history from replay and current read values. Lines 35–39 correctly limit retention of C to that commit and tie wider promotion eligibility to acknowledgement policy rather than sampled lag or controller majority.

The handover preserves uncertain outcomes rather than calling failed connections aborted. The divergent-history explanation preserves evidence before destructive rejoin, separates business reconciliation from physical synchronisation, and warns against overwriting newer decisions. Returning role, history, catch-up, routing and renewed commit protection are all required before claiming restored redundancy. Native commands/prerequisites, detailed reconciliation and consensus remain with their named owners; their omission is consistent with this commission.

Calibrated the explanation against bounded passages in all three fixed references, especially Storage and durability’s crash recovery, and inspected that reference’s rendered Figure 8. In an owned article tab at verified 1280 × 900, stepped Figure 1 to its fenced outcome and changed to address-only routing: one writer became two. Stepped Figure 2 and selected both candidates: A showed replayed 22.00/C retained; B showed 20.00/C omitted. Those rendered outcomes agree with the source and body. The figures and prose keep the shop variation distinct from the retained order agreement.

## Limits

Reused the applicable SQL execution receipt after inspecting its verifier and hashes; did not rerun it or run a database, fencing or replication fixture. No concrete concern required coordinator reproduction. Rendered checks here are bounded technical consistency checks, not full phone/theme, playback-timing or contrast coverage. Changed no main/reference theme, source, build or publication state. Did not consult authoring-checks, older manuscripts or previous review verdicts.
