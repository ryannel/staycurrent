# Independent adversarial editor review

Verdict after recheck: **pass**. Both required parent/child boundary repairs are resolved. Retain the three proposed children; no additional article is justified at this stage.

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md`, applying `.agents/skills/staycurrent-review/SKILL.md`. Read the three fixed reference sources in full: Sequence diagrams, Indexes, and Storage and durability, including their figure implementations, shared playback/drawing code and the models used by those figures. Did not read previous relational articles, plans or the other review. This is a review of learning value and structure, not verification of future implementation claims or executable experiments.

## Required repairs

### E1. Keep the parent migration passage to decisions and give the worked protocol one owner

Location: `heading[5]`, **Compare choices and change architecture safely**, especially lines 138–143; compare the sharding child at lines 87–94 and application-engineering neighbour in `context.yaml`.

The comparison table earns its place: it brings all three architectures back to the same workload. The following instruction to “walk through a move” also promises a consistent copy, change capture, identities and constraints, reconciliation, authority handover, draining clients and rollback. That is almost the online movement recipe already commissioned to the sharding child, with delivery details commissioned to application engineering. A newcomer choosing an architecture should not have to read a second implementation of that recipe before reaching the acceptance worksheet.

Repair the parent brief so that it retains a short architecture-transition decision example: what must be equivalent at the target, which system may accept writes, what evidence permits handover, and what makes rollback cease to be a simple routing change. Explicitly leave the detailed snapshot/catch-up/cutover history with **Designing and moving relational shards**, and rolling compatibility, backfill/restart and client delivery mechanics with application engineering. The sharding child's protocol should state that the same ownership reasoning also supports an initial move out of a single writer; the parent should link to it as such.

Useful understanding lost by the cut: readers will no longer finish the overview with a full migration procedure. That is an appropriate loss here: the retained authority and rollback decisions support architecture choice, while the procedure remains available once a path is selected. Do not remove migrations from the corpus or add a fourth migration child.

Acceptance: the parent promises comparison and a bounded handover decision, while one child owns the worked copy/change-capture/cutover protocol. Its brief must not still require a second full migration walkthrough.

### E2. Make the parent's final worksheet a reusable specification, with one worked case

Location: `heading[6]`, **Test the promise, including the uncomfortable interval**, lines 146–156; compare child testing promises at lines 62–65, 90–92 and 128–129.

The common acceptance worksheet is valuable because it prevents readers substituting “replication enabled” for a testable guarantee. Its present action wording, however, instructs the parent to inject writer loss, isolation, replay delay, stale routing and interrupted movement, then analyse all the outcomes. Read literally, this adds a failure-testing tour of all three deeper mechanisms to an article whose stated purpose is choosing a path. The children independently require the same evidence at working depth.

Keep the worksheet here as the common format for an invariant, failure assumptions, operation history, permissible outcomes and evidence limits. Work through it once using the opening reservation/replica failure. List the other failure families as prompts with direct hand-offs: replica lag and promotion to the replication child; stale routers and interrupted movement to sharding; quorum loss and interrupted membership/commit recovery to distributed SQL. Explicitly require the relevant child to complete the same worksheet on its concrete mechanism rather than repeating a general test-method section.

Useful understanding lost by the cut: the overview will not itself demonstrate every fault family. Nothing is lost from the intended corpus; readers retain a complete first example and can apply the format immediately. Navigation becomes purposeful: a reader follows a mechanism they need rather than completing an overview of every test first.

Acceptance: the parent has one completed failure worksheet plus a concise map of further cases; child briefs remain responsible for concrete failure histories and engine evidence.

## Boundary challenges and consolidation decisions

- **Opening history + contract:** retain both headings. The history first exposes an observable surprise; the contract then turns it into an engineering decision. Folding them into an abstract checklist would save a heading but lose the reason freshness, survival and uncertainty are different questions. Reuse the opening history in the replication section rather than restarting the example.
- **Single-writer replication child:** retain. Folding promotion, replica visibility, catch-up and old-writer reintegration into the parent would impose substantial operational reading on readers still deciding whether replicas meet their needs. Splitting physical/logical replication, reads and failover into separate children now would make the acknowledgement-to-promotion reasoning harder to follow. Keep its multi-writer material a short boundary warning and link to the coordinated/conflict-resolving comparison owned by distributed SQL; it should not become another multi-writer tutorial.
- **Sharding child:** retain. The key choice and live movement protocol answer one coherent question: who owns each unit of data as the system grows? Separating design from movement would hide the migration cost of a seemingly convenient key. Keep fan-out/pagination/constraint material tied to the account placement example instead of creating miniature SQL or transaction lessons. Atomic commit mechanics correctly belong to the distributed child.
- **Distributed SQL child:** retain. The important reader gain is seeing that consensus, cross-group atomic commit, isolation and real-time order are different promises. Folding it into sharding would force an application-sharding reader through engine coordination internals. Avoid creating one descendant per term: membership changes should be a continuation of the replica-group failure history, and distributed query/index/constraint work should be traced through the same reservation and report rather than taught as independent product features. Its eventual breakdown may determine a justified deeper split; this parent should not prescribe one merely because the mechanism list is long.
- **Neighbour boundaries:** the explicit ownership statements are useful. A sentence that a replica copies a mistaken deletion is enough to justify the backup link; backup policy belongs to operations. Client uncertainty needs to be observable in the opening history, but safe retry/outbox protocols belong to application engineering. No general distributed-systems prerequisite article is needed.

## Reference teaching judgement

The plan's strongest choice is its persistent reservation example and insistence on histories. Sequence diagrams changes one aspect of Mina's booking at a time and distinguishes drawn order from a promised ordering relation. Storage and durability follows P7 through memory, log, acknowledgement and recovery, then changes one setting to expose a different loss. Indexes keeps the small invented table separate from measured engine page counts and attaches each control to a specific comparison.

Preserve that discipline during expansion: the parent needs a small history whose acknowledgement/replay/failure point changes the answer, not a topology gallery or a control panel that changes several guarantees at once. Child experiments should say what the reader will compare and what conclusion it supports. The current illustrative-versus-observed distinction is strong and should survive the two cuts above. No rendered prose or figures exist in this assignment yet, so this review does not certify their eventual quality.

## Recheck

Re-read the revised saved `breakdown.yaml` after the worker's repair request. **E1 resolved:** the parent now commissions one short transition decision example about equivalence, write authority, reconciliation evidence and rollback. The worked snapshot/change-capture/cutover history has one explicit owner, the sharding child, including the initial move out of one writer; application engineering owns compatibility, backfill/restart and client delivery mechanics.

**E2 resolved:** the parent completes the common worksheet only for its opening reservation/replica failure, then gives concise prompts routing other histories to the relevant child. All three child briefs explicitly complete that same worksheet on their own mechanisms. The general testing method therefore has one home without dropping concrete evidence from the corpus.

The replication child's multi-writer paragraph is now explicitly a short boundary warning with a link to distributed SQL's coordinated/conflict-resolving comparison, resolving the consolidation caution as well. No further editor repairs are required for this breakdown. The findings above retain the original rationale and acceptance criteria; this recheck is the current verdict.
