# Independent choice-pair review

Reviewed the current complete `cache-benefits.astro`, `cache-keys.astro` and `stories/choice.mjs` on 29 October 2026. This is an independent technical/reader review of the changed writing and causal animation sequences. The coordinator owns rendered layout, controls and phone inspection; no browser review or native experiment rerun was performed here. No colleague files were edited.

## Finding

**Medium — the source-outcome animation makes timeout look like a returned answer.** In `stories/choice.mjs`, `outcomes` (lines 79–81 at review), all three cases use the same source-to-server return ball, including “Source cannot answer / Timeout”. The server also displays the result as soon as the request reaches the database (`p >= .5`), before the ball returns. The surrounding article correctly says a timeout establishes no product result, but the motion depicts it as the third kind of result delivered by the database, rather than the caller ending its wait without an answer. This weakens the distinction this figure exists to teach. Show successful knowledge reaching the server before displaying it; let the timeout case finish its wait without a source answer. A simple indication of the saved-versus-unsaved cache outcome would also make the stated consequence visible, but need not add a full additional network stage.

## Coverage that passed

The article arguments stay coherent: define saved work, check actual reuse, count both paths, then choose placement and test the candidate. The key article distinguishes answer identity, unambiguous encoding, authorisation, representation versions and explicit absence without making Redis the general rule. The in-process/shared close-up explicitly states that requests are omitted; its separate expiry schedule produces the claimed divergence and does not suggest sharing ensures freshness.

Checked the new numerical models directly: the eight-request trace ends with three misses and five hits; sixteen hits give mean 6.6 ms and nearest-rank p95 25 ms; nineteen give 3.15 ms and 2 ms; the cheap-source case gives mean 3 ms versus 2 ms uncached. The threshold calculation and two-layer conditional hit-ratio arithmetic agree with the prose. No invented timing is presented as measured performance.

The encoding comparison preserves the actual collision and the JSON alternative keeps field boundaries. The format/source-revision sequence keeps the product revision unchanged when the format changes. The permission flow stops the denied request at the server and does not retrieve the restricted value for it; the prose correctly allows an internal attribute lookup where the access decision requires one.

Primary sources rechecked: [Redis keys and values](https://redis.io/docs/latest/develop/using-commands/keyspace/) for binary safety, colon conventions and lack of namespaces; [OWASP authorisation guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html#validate-the-permissions-on-every-request) for validating permissions on every request. Other unchanged mechanism/lab claims retain the collection's prior technical evidence; no new performance or failover claim was introduced by these presentation edits.

No other substantive technical or reader issue found in this scope. Rendered readability and whether the pacing feels sufficiently calm remain with the coordinator's current UI review.

## Author repair

Accepted the source-outcome causality finding. Each request now travels App → Server → Database. Product and established absence appear at the server only once their return motion arrives. The timeout case has no returning source ball: a small waiting indicator at the server ends in Timeout. The three stated retention consequences remain save card, save absence and save nothing. Also repaired coordinator-observed panel spacing: increased the work comparison row gap, and moved outcome Server labels beneath their nodes. Integrated rendered confirmation remains with the coordinator.
