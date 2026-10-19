# Adversarial breakdown review

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md` on 19 October 2026. Assigned perspective: learning value, reading and navigation cost, and consolidation. No existing relational articles, old coverage maps or earlier trees were inspected. This is a structural breakdown review, not a verdict on unwritten prose or rendered figures.

## Verdict

**No actionable findings.** The parent and five proposed children are a defensible small corpus for this assignment. Each child owns a different practical completion condition. Removing one would either leave a material practitioner obligation at sketch depth or turn the parent into a much longer implementation article. No additional child is justified at this stage.

The parent is useful only if its promises are honoured in writing: the bounded-call contract, failure timeline, delivery crash, compatibility timeline and transfer sketch must establish usable understanding before the links. The current briefs expressly require those demonstrations; they do not merely offer a contents page.

## Challenge to every parent section

| Location in breakdown.yaml | Concrete cut or merge considered | Useful understanding lost; decision |
| --- | --- | --- |
| Follow one request beyond the commit | Delete the opening and begin with driver mechanics; alternatively merge its uncertain-outcome explanation into the retry section. | The reader would lose the common request/result/external-effect model that makes the subsequent ownership boundaries meaningful. Retain the happy-path contract here; the detailed outcome classification already belongs to “Decide what a caller may repeat”. |
| Make each database call bounded and explicit | Replace the lifecycle walkthrough with a link to the client child. | The parent would cease to explain how application resource ownership affects the reservation. Retain the small caller contract, without duplicating the child's mapping catalogue or pool-sizing treatment. |
| Decide what a caller may repeat | Fold the failure timeline into the opening request trace. | The initial trace would have to introduce rejection, abort, ambiguity, lookup and replay at once. The separate section earns its space by turning observation into a repeat-or-reconcile decision. Retain. |
| Carry committed intent across system boundaries | Merge this with retries because both handle repeated attempts; alternatively omit the read-model example. | A safe repeat of one command does not make two independent effects atomic. Dropping the read-model comparison would also conceal that a successful reservation need not be visible immediately through every read path. Retain one delivery/read-model boundary section. |
| Change code, schema and existing data together | Cut this overview and route readers straight to migrations. | The compact compatibility timeline establishes why code rollback and data recovery are different decisions. That is necessary working knowledge even for readers who do not implement the migration themselves. Retain the timeline; leave deployment machinery to the child. |
| Put behaviour where its contract can be maintained | Fold into SQL or modelling; alternatively create a resident-code child. | SQL and modelling own semantics and integrity design, while this section owns who can invoke the behaviour and who must deploy and test it. Removing it would leave that application responsibility between owners; a child would add navigation without an independently demonstrated need. Retain as a parent section. |
| Move many records with a recoverable protocol | Merge into the migration overview because both move existing rows. | An external source introduces identity, authority and source-to-target acceptance obligations that a schema backfill does not. The explicit distinction prevents false reuse of a migration recipe. Retain the short staging-and-acceptance sketch. |
| Prove the application contract before release | Delete this and rely on the tests in every child; alternatively make testing a sixth child. | Deletion loses the end-to-end check that the request, relay and mixed-version release satisfy one product promise. A separate child would repeat their mechanisms. Retain the acceptance matrix and brief ownership checklist, as specified, with detailed tests remaining in their protocol owners. |

## Challenge to every child

| Child and location | Concrete consolidation considered | Useful understanding lost; decision |
| --- | --- | --- |
| Making bounded database calls | Fold into the parent, or merge with retries. | Folding would add value conversions, streaming, helper ownership, multiple timeout layers, connection hygiene, admission control and ORM inspection to a compact parent. Merging with retries would require command-recovery readers to traverse all those resource details. Retain one child: the complete request resource lifecycle joins these topics more economically than separate driver, pool and ORM pages. |
| Retrying commands without repeating their effects | Fold into the parent failure timeline, or merge into external delivery. | The parent classification cannot substitute for concurrent idempotency attempts, fingerprints, durable result recording and retention. External delivery has a different boundary and can be read after local command safety is established. Retain; its explicit safe-replay/recovery stopping condition is appropriate. |
| Delivering work beyond the database | Fold notification into the retry child; move CDC, caches and workflows to independent children. | Folding loses the independently failing relay/consumer protocol. Splitting would force repeated explanations of acknowledgement loss, replay, ordering and rebuilding. Retain the combined child: polling/CDC transport alternatives and cache/read-model consequences all serve the same committed-intent boundary. The brief already restricts workflow treatment to the relational example and rejects a messaging survey. |
| Evolving schemas without breaking running applications | Merge with bulk movement into one data-change article. | Mixed live versions, DDL behaviour, long-lived jobs, prepared statements and removal gates are release-compatibility obligations. An import reader does not need all of them, and a migration reader does not need an external authority policy. Retain. The shared bounded-progress/restart principle should be reused rather than reintroduced as a separate generic topic. |
| Importing and moving data reliably | Fold into the parent staging sketch, or merge into migrations/external coordination. | Folding loses snapshot/change boundaries, quarantine, correction/deletion policy and reconciliation under concurrent source changes. Migrations do not own source authority; external coordination does not own bulk acceptance and cutover. Retain. The final explicit boundary keeping compatible schema backfills with delivery is valuable. |

## Consolidation guardrails already present

The proposal keeps database-resident placement in the parent, distributes testing to the protocol owner, assigns schema backfills to delivery, links SQL and transaction correctness instead of repeating them, and gives replication mechanisms to distribution. These are meaningful cuts, not missing coverage. Preserve them during child expansion. No structural repair was required for the initial version.


## Final recheck after practitioner repair

Re-read the saved final `breakdown.yaml` after the session-reuse repair. **No actionable structural or consolidation findings.**

“Make each database call bounded and explicit” now makes the next borrower's known session context part of the compact parent contract. “Making bounded database calls” owns successful and failed cleanup, request/tenant context, application versus external session/transaction pooling, and configuration compatibility. These additions complete the existing acquire/use/return lifecycle rather than introduce another task needing a child. Their real-engine reuse test verifies the same boundary, so it belongs with the client contract rather than in a separate tenant-isolation or testing article.

The short parent promise and deeper child treatment remain proportionate. No extra page, merge or cut is warranted. All eight parent sections and five child boundaries remain accepted. Locations above now use stable heading/title names.
