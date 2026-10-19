# a38 promotion boundary repair

P1: the enforced Exclude-old step now says exclusion is confirmed and promotion is pending. The unsafe Refresh-route step reports that A accepted 104 and B may accept separate writes. B's acceptance of 105 appears at the final step.

Comparing all 73 states confirmed that only these two text fields changed. Cards, rows, routes, notes, other outcomes, prose and the native harness remain unchanged. Direct assertions for the intermediate states were added to the verifier. The verifier, narrow regression check and full build passed. Retain the native and unaffected model passes from b15. Teaching still needs its full initial review.
