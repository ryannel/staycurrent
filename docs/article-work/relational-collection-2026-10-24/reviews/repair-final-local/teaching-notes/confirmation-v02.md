# Teaching continuity notes · repair-final-local-v02

Scope: informed F1–F5 confirmation; complete current rendered r05/r08/r20/r34/r42/r54 read for integration. These notes are observations for the saved report, not independent first-reading or native evidence.

## Reference calibration

- **Sequence diagrams**, rendered `/review/examples/sequences/`: read the actual opening progression and the article text, with particular attention to “Ordering and gaps” and Figure 6, “The same messages in another order”. Inspected the current rendered figure in context. Its useful pattern is to define the ordering rule, ask the reader to watch a specific change, then explain what that change does and does not establish. This calibrates the import publication sequence and r42's configuration and identity transitions.
- **Indexes**, rendered `/review/examples/indexes/`: read the actual introductory page-cost explanation, composite-index worked question and Figure 7 in context; read the complete partial/expression/unique section and “Checking an index with EXPLAIN”. Its useful pattern separates a model, the native result, the query's meaning and the measured counter's scope. This calibrates r34's short reminder and retained distinctions, and r05's worked projected-row comparison. The long initial extraction omitted some middle text; the relevant partial/expression section was then read directly in full. No claim to full-reference rereading is made.
- **Storage and durability**, rendered `/review/examples/storage/`: read the introduction and complete WAL/crash-recovery/fsync passages, including the actual text alternatives for Figures 5, 8 and 9; inspected Figure 9's current rendered flush layers and failure-scope note. The article explicitly distinguishes killed process, OS/power failure and honest storage. This calibrates the narrower r20 fourth-state qualification.

## Continuity decisions

- r05 keeps Mina's two order contributions distinct from one customer's identity. Showing `customer_id, order_id` after customer-ID duplicate removal gives the reader the counterexample needed to understand projection. r54's shop ID likewise distinguishes the two P7 rows; its recap correctly prepares Append without importing r05's whole explanation.
- r08's source version 3, old version 2, seen-version payload and batch receipt retain distinct meanings. The new snapshot passage comes after staging and before publication code, where the persistent comparison actually needs it. It does not make staging imply a live snapshot guarantee.
- r20's conceptual positions remain 0/1/2, not native LSNs. At the fourth state all received/durable positions reach 2 while replay stays 0 and the fresh result lacks 103. The full alternative's process-crash/flush-contract condition agrees with the live state's narrower statement and the earlier definition.
- r42's forced-owner control, enabled/unforced helper comparison and restored FORCE acceptance are labelled as different configurations. Unsafe shop-ID access reads the intended real table under owner bypass; the later forged-table attack reads the caller's temporary relation. The restricted helper selects `shop.products`, runs as `catalogue_code` and maps `session_user` to shop 10. Both figure paths and their complete alternative preserve these differences.
- r34's synthetic correlation data stays separate from shop purchase history. The estimate improves while the route remains sequential; typed integer equality then supplies the access-path repair. Partial-index use depends on known pending status, not on a rule that generic plans can never use partial indexes.
- r11 was read as unchanged owner context. It provides the loop and inclusive-count arithmetic to which r34 links. The two pieces give different native observations without presenting them as the same run: r11's correlation scan remains an index scan, while r34's remains sequential. Both teach that improved knowledge does not by itself promise a new route.

## Current figure reading

- Read r05's two full alternatives; both figures' result meanings remain consistent with the appended-row section.
- Read r08's full two-policy alternative, preserving stale versus contradictory version 2 and unchanged agreed order price.
- Used r20 Next to state 4 and opened the full alternative; checked replay, durable progress, missing order and failure qualification together. Reset and collapsed afterwards.
- Read r34's all-three-routes alternative. It preserves custom pending, generic unknown status and generic fixed pending as different planning contexts. Collapsed afterwards.
- Used r42's five states in each of the two modes and read the complete alternative, note and surroundings. Reset to first unsafe mode and collapsed afterwards.
- Read r54's static snapshot figure and complete handover alternative. The independent snapshot and single-writer authority arguments add no alternative meaning to Append. Collapsed afterwards.

No unresolved teaching dependency was found in these repaired areas. Native chronology and results remain outside the permitted teaching inputs and require practitioner confirmation.
