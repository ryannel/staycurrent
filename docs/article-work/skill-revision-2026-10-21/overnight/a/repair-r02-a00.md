# A · a00 repair 2

Fresh repair worker; exact installed candidate-A revise and continuity skills. Start (first recorded clock, during initial input read): **2026-10-21 21:01:56 UTC**. End: **2026-10-21 21:03:22 UTC**. Recorded interval: **86 seconds**.

## Repair

**A17 only**, `a00.astro:119`: replaced the implicit “Keep conditional … while working” sentence with an explicit instruction to shortlist a distributed relational service when the shop demonstrates a need for divided write ownership across servers or for its database to continue answering queries and accepting orders during a specified failure. Loss of a location is the concrete failure example. The following comparison with a conventional server arrangement remains intact. This states a requirement to test, not a promise that every distributed service meets it.

No passage was restructured beyond this sentence. A byte-level replacement check against [A-r01 source](../artifacts/a-r01/src/articles/relational-trial-3/a00.astro) confirms the complete article differs only by that replacement. **A18's access-control/detection paragraph is unchanged**, as required by [round2 decisions](decisions-r02.md). Source word count: **3,819 → 3,839** (+20).

Durable source: [a00.astro](../artifacts/a-r02/src/articles/relational-trial-3/a00.astro), byte-identical to the repair working source. SHA-256: `b197bbe49a673f7f73eecfd9631ec927157c8a71442497761bf37778810583ab`.

## Checks and limits

Read the whole current article, its root plan and relevant work record before changing the card, then reread the whole repaired article, including contents, captions, SQL labels, figure text alternatives and all race choices/steps. Checked the distribution section and the downstream shortlist conclusion/evidence matrix: the PostgreSQL starting shortlist and its rejection tests are unchanged. The new sentence supplies a candidate, admission condition and required service behaviour without adding an observed failure result or a vendor-specific guarantee. No new primary-source claim was introduced.

Native evidence remains applicable: [native-56131.json](../../../relational-skill-trial-3/a00-evidence/native-56131.json) records PostgreSQL18.6, PASS, 22 checks and `serverStopped=true`. Rechecked applicability by byte-comparing shared example rows, a00 SQL/model, verifier, Race component and shared stepper against input commit `80276a4` through the main repository; all match. Shop remains byte-identical to its A-r01 artifact. The prose repair changes none of those inputs, numerical outcomes, concurrency claims or playback timings, so no database or media-mechanics run was repeated. The initial comparison command ran from the source archive (which has no Git metadata); rerunning the comparison through the main repository succeeded.

No build or server was started. Static preview4341 is frozen A-r01 and cannot establish the new card's rendered layout. Coordinator-owned A-r02 build/freeze and the full round3 review remain outstanding; this record claims source-level repair and continuity, not fresh rendered approval.

## Continuity delta

The complete reading order was audited against the [single canonical term ledger](../../../relational-skill-trial-3/a00-writing.md#continuity-term-ledger) and [running example](../../../../coverage/relational-example.md). Changed entry: **distributed relational service** still follows its explanation in “Put data and decisions in the right place”; “write ownership” is explained by the preceding replication/sharding discussion, and “queries” by SQL. The card now names the candidate directly and uses already-taught operations to explain continuing service. No new specialised term, name or example extension was added; unchanged ledger entries are not reproduced.

Mina/customer1/order103, Tariq/customer2/refused104, Edda/customer3, P3/P7/P9 values, £29.00 and £39.50 totals, P7=0/P3=10 protected outcome and the10:10 deletion /10:15 order103 /10:09 restore timeline retain the canonical meanings. No cross-article example changes are needed. Only assigned article source and this requested delivery record/copy were written; no subagent, commit or push.
