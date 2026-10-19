# Adversarial editor review

Verdict: **revise**, with the existing three-article boundary retained.

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md`. I read the three fixed reference articles in full, including their figure instructions, scenarios, captions and explanations. I did not consult the existing relational corpus or earlier plans. This is a breakdown review of learning value, reading cost and consolidation, not a claim that the future procedures have been technically verified.

The outline covers the assignment and generally respects its neighbours. Security verification and recovery execution each justify a child article: folding either into this parent would make its operational decision path substantially harder to follow. No additional children are justified by this outline. The revisions below concern a parent that currently promises too many similar procedures and a worked example that is still more a subject than a teaching progression.

## Required repairs

### 1. Give the running service an explicit problem and a changing evidence record

**Locations:** root brief, lines 4–13; “Decide what this service must survive”, lines 17–23; “Observe the service…”, lines 85–92; “Prove recovery…”, lines 107–114.

Following the reservation service is promising, but the sections mostly enumerate what a complete operator should record. The plan does not yet identify the concrete workload, accepted-work markers, objective values, operational observations or failed acceptance result that make those records useful. A writer could satisfy these briefs with several tables of recommended fields and still never let the newcomer practise a decision.

**Repair:** commit the parent to one compact worked service record that successive sections update: an explicitly illustrative peak demand and latency objective, a named failure domain, accepted reservation markers and chosen recovery objectives. Provisioning produces the first tested record; a measured or explicitly modelled busy period produces an alert and a capacity decision; one changed assumption or failed drill forces a revised setting or recovery policy. Distinguish illustrative input numbers from observations. End with the evidence that supports acceptance and the outstanding limitation, rather than introducing another checklist. The exact numbers can be selected during research; the planning brief should promise the observable comparison and decision.

The fixed examples earn their length by changing one thing and reading the result: the sequence article changes who waits; the index article counts pages before and after an index choice; the storage article changes the moment of failure. An equivalent here is to move the destructive event or remove a recovery dependency and ask which accepted reservation markers can still be recovered within the target. A static timeline or small table is sufficient unless a control makes that comparison easier.

**Cut/merge and loss:** replace separate illustrative objective, dashboard, capacity and acceptance inventories with views of this same record. No useful operational understanding is lost. A generic reusable blank template is less prominent, but readers gain the reasoning needed to fill one in correctly.

### 2. Consolidate repeated incident machinery and explicitly allocate corruption coverage

**Locations:** exhaustion subsection, lines 94–104; recovery child, lines 125–135; change section, lines 139–146; final incident section, lines 158–170.

The parent promises two exhaustion incident branches, a configuration change, a version upgrade and a complete suspected-corruption incident. The recovery child then promises a full mistaken-deletion procedure, corruption, domain loss and several failed-dependency cases. Target verification, authority, evidence capture, stop conditions, validation, traffic return and renewed protection recur across these briefs. These are useful shared habits, but repeated full walkthroughs would carry a large reading cost without a correspondingly clear new decision.

**Repair:** establish the common procedure record once in the parent and reuse it by reference. Make the configuration change the short first use and the upgrade the consequential variation, explicitly showing what changes. Keep one exhaustion response as the complete bounded-containment example and make the second a short comparison of trigger, safe action and stop condition. In the final incident section teach the extra judgement specific to suspected corruption—preserving originals, restricting writes, uncertainty about scope, command and handover—and consume the recovery child's verified output rather than re-enacting restoration. In the child, make mistaken deletion the full restore execution; corruption and domain loss should be targeted branches with different surviving dependencies and validation needs, not two more general incident narratives.

**Cut/merge and loss:** cut repeated narration of the common procedure fields and duplicate restoration/return-to-service steps. Keep every failure category. The reader loses repetition of the same process under different labels, but retains the distinct decisions: containing demand, restoring earlier data, dealing with uncertain damage, losing an administrative domain and crossing an upgrade compatibility boundary. This should be encoded in the briefs so later expansion does not turn each branch into its own child article.

## Consolidation and neighbour checks

- **Keep “Securing relational access” separate** (lines 64–82). The actual-identity denial tests, privileged code and revocation/rotation failure cases require executable depth. Folding them into the parent's trust-boundary section would either make that section dominate the article or lose the ability to verify the security design. The parent should retain only its identity/action map, go-live evidence and the reason to enter the child. In the child, use the same actors and one denied cross-tenant access attempt through ordinary SQL, resident code and export paths; do not grow a separate tutorial for every object type or encryption layer.
- **Keep “Proving relational recovery” separate** (lines 115–136). A recovery policy can be understood compactly; a restore needs compatible artefacts, dependencies, target selection and end-to-end validation. Folding the execution into the parent would hide these necessary preconditions. Keep the parent deletion timeline to one conceptual target/later-good-writes comparison and leave method comparison, commands and reconciliation execution to the child. No third backup catalogue article is needed.
- **Keep installation to one reproducible path** (lines 34–54). The empty-host-to-smoke-transaction progression earns its place; it provides a usable service for the later exercises. A pinned PostgreSQL path plus a small managed-service substitution/responsibility table is sufficient. Parallel operating-system installers, provider walkthroughs or exhaustive setting tables would add navigation cost without a different operational decision.
- **Keep operations as the consumer of diagnosis** (lines 47–54, 85–104 and 150–156). The numerical memory example should justify an operating envelope and reserved headroom, not re-derive engine memory allocation. The capacity section should end in a lead-time and service-risk decision. Maintenance should select a trigger, window, budget and validation using evidence supplied by execution, rather than reteaching vacuum, statistics, bloat or query investigation. Cutting those mechanisms here loses no corpus understanding because the assigned neighbour explicitly owns them.
- **Keep replication as a verified dependency** (lines 29–33 and 131–136). A service-wide decision to fail over belongs here; promotion mechanics, fencing protocols, quorum and routing guarantees do not. A readiness record and one unmet-precondition result carry the necessary operational lesson without another failover article under this branch.

## Recheck condition

Pass once the briefs commit to the single evolving worked service record, identify which procedure is fully executed versus a bounded variation, and allocate corruption restoration to the recovery child while keeping incident command and evidence preservation in the parent. These are local repairs: retain the seven top-level sections and two child articles unless expansion later supplies evidence that a boundary fails.
