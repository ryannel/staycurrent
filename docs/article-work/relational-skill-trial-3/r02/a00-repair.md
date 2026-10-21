# a00 · round 2 local repair

Started **2026-10-21 20:01:33 UTC**. Fresh reviser `r02_revise_a00`; coordinator owns independent review and final build. Applied `staycurrent-revise` and `staycurrent-continuity` at the supplied working skill version `005ab6f`.

Read the complete current trial-3 article, its current Shop/Race/model/verifier, coverage root and immediate-child context, registry, canonical example, a00-writing.md and r01/a00-repair.md before the finding. Read all three fixed reference articles, including figures/listings/captions, and relevant finished application/evaluation children a04 and a08. Then read r02/decisions.md and editorial-7. No earlier live a00/a03, prior trial content/components/records/reviews, or trial-3 run/results were opened.

## Accepted finding and changed passages

**editorial-7 (coordinator medium): repaired only the “Specialist features and ecosystem” evidence cell in “Choose a system you can test”.** It retains checks for features, permissions and support, then asks readers to verify that the application's database library preserves required values, such as exact prices, when sending them to the database and reading them back. This gives both directions and a familiar value to test. The existing application child develops that boundary. This is a prototype check to obtain, not a new claim of measured conversion results.

That cell is the complete changed-passage list. No other passage was restructured; no figure, listing, model, protocol, section, example or source changed. Findings below the medium floor remain untouched.

## Complete reread and continuity

Reread the whole finished article, contents, captions, disclosures, tables, listings, and current component/model control and step text against the three references. The local cell reads as a concrete evidence request and preserves the article's argument.

Audited the complete canonical [round 1 term ledger](../r01/a00-repair.md#continuity-term-ledger) in reading order against the whole article and its figure text; unchanged rows are retained there. Changed first-use entry only:

| Term | First use and explanation |
| --- | --- |
| Application's database library | Specialist-feature evidence cell: the software sending required values to the database and reading them back; preserving exact prices is its concrete test. This replaces the unexplained “application-library value conversions”. |

All other ledger first uses and explanations remain valid. One-name and example audit confirms Mina/customer 1/order 103, Tariq/customer 2/losing 104, Edda/customer 3, P3/P7/P9, prices, order lines, payments and recovery timeline agree with the canonical record. The broken race's accepted 104 remains confined to that branch; the protected branch accepts only 103. No example extension.

## Verification and cleanup

Ran the existing native verifier, without adding checks, using the optional evidence-directory argument:

`node src/components/relational-trial-3/a00/verify.mjs 56510 docs/article-work/relational-skill-trial-3/r02/a00-repair-evidence`

The restricted attempt failed during initdb shared-memory creation, before tests. It stopped/removed its temporary directory. Retried with approved sandbox escalation on new port **56511**, same command except the port. Each invocation creates a new cluster/database `a00`; no cluster/database was reused.

**PASS: 22 checks**, PostgreSQL **18.6 (Homebrew)**, Read Committed, fsync/synchronous_commit/full_page_writes on. Successful run 20:02:51.602–20:02:52.662 UTC (1.060 s). Schema rejections, query totals, complete order, stale-assignment counterexample, protected refusal and rollback counterexamples all still pass. Existing assertions establish the existing article cases; no application-library conversion run is claimed.

Evidence: [restricted attempt](a00-repair-evidence/native-56510.json), [passing native run](a00-repair-evidence/native-56511.json). Both report `serverStopped=true`; independently checked both temporary parent directories absent. No worker server/process remains. No browser or build started; unchanged figures require no repeated phone/theme/playback audit. Coordinator runs the sole final build. No agents, review, commit or push.

Final source count: **3,816 words**, up **20** from 3,796 (`wc -w` equivalent whitespace count).
Article SHA-256: `3a33b33993cab09a67cb55d38a1f6e575ef44f67dc0d5852e4a502650a361bc4`.

Completed including record writing and cleanup: **2026-10-21 20:03:42 UTC**, **129 seconds**. All assigned edits and this record are complete; source is frozen and this reviser will make no further source edits.
