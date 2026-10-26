# Practitioner review — crdb-transactions v01

Reviewed 26 October 2026. First independent practitioner/technical review for an application engineer following the stated prerequisites. No substantive findings.

## Version and scope

Read the fixed v01 article, plan, incoming ownership, neighbouring briefs and original shared-example snapshot; inspected all three walk definitions and the rendered article at `http://127.0.0.1:4606/review/relational-rebuild/cockroachdb/transactions/`. Current article, metadata and component SHA-256 values match the four entries in `review-source.json`. The original shared-example snapshot hashes to `44656a905fac8edd2306a441e32bb91f54d7e250efaecc1b80e5c4049cd13d31`, matching its input receipt.

Coverage: intents versus committed values and application request rows; lazy records and v26.2 write buffering; STAGING plus successful listed writes; coordinator recovery and late-write prevention; refresh versus automatic SQL replay; complete interactive retries; ordinary versus retry savepoints; 40001, 40003 and missing replies; bounded recovery, canonical payload, refusal and external effects. The article gives the native mechanisms and actionable error boundaries its incoming ownership requires. General invariant design, request retention and external delivery remain with their linked owners. Stock, order, lines, prices and no-payment facts remain coherent.

The practitioner-facing progression is sound: Figure 1 distinguishes the two records before Figure 2 asks what proves commitment; the refresh explanation precedes the application loop; the loop checks commit and discards provisional answers. The ordinary savepoint preserves the claimed key while reversing a partial basket on refusal, without suggesting it can preserve decisions across 40001. The ambiguity branch re-enters the protected operation rather than treating absence or a deadline as proof of abort. These are useful awkward cases, not just the successful purchase.

## Evidence checked

Checked the actual `native-verify.mjs`, runtime/fixture provenance, execution receipt, results and cleanup. Its hash is `b9428e8334e65de2433f0888761402aae9ddaf58e478ee35f7b983baf4d1c425`, matching the before/after execution receipt. Every SQL connection specifies its target and checks database, user, v26.2.8 version, cluster UUID and fixture marker. The retained run exited 0. Assertions and recorded states support full rollback after injected 40001, fresh acceptance, identical same-key recovery, mismatched-payload rejection, incorrect-new-key refusal, partial-basket rollback, commitment on successful retry-savepoint release before final COMMIT, and the ordered two-client WriteTooOld 40001.

Inspected the observed defaults: Serializable; explicit write buffering on; implicit write buffering off; `results_buffer_size = 524288`. The article appropriately avoids adopting the versioned Transactions page's conflicting 16 KiB default and distinguishes result buffering from write buffering.

Primary sources checked directly: [v26.2 Transaction Layer](https://www.cockroachlabs.com/docs/v26.2/architecture/transaction-layer), [Transactions](https://www.cockroachlabs.com/docs/v26.2/transactions), [Transaction Retry Error Reference](https://www.cockroachlabs.com/docs/v26.2/transaction-retry-error-reference), [retry example](https://www.cockroachlabs.com/docs/v26.2/transaction-retry-error-example), [advanced retry savepoints](https://www.cockroachlabs.com/docs/v26.2/advanced-client-side-transaction-retries), and the [Parallel Commits RFC](https://github.com/cockroachdb/cockroach/blob/master/docs/RFCS/20180324_parallel_commit.md). The older RFC terminology is not confused with current STAGING or presented as current execution evidence.

Calibrated against bounded Sequence diagrams message/wait passages, Indexes scan/index-entry passages and Storage and durability's commit/log explanation and rendered Figure 5. In the article browser, exercised implicit commitment, the coordinator-disappears branch through resolution, and invalidated refresh through its client boundary. Their visible conclusions agree with the source and prose. Shared theme preferences were unchanged.

## Limits

Reused the retained native evidence; no concrete concern justified rerunning it. It is single-node v26.2.8 SQL evidence with two clients, not a distributed intent trace or coordinator-machine-loss test. No 40003 or lost reply was induced; no latency, throughput or replica-survival result is established. The article states these limits. This review provides bounded desktop interaction checks; the separate rendered reader owns complete controls, phone and theme coverage. No edits, delegation, publication or earlier reviews were used.
