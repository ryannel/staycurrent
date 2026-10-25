# Cluster-change v01 — independent practitioner review

Reviewed the fixed first version in `batch-23/review-source.json`, the original v01 source, plan, incoming ownership, neighbour briefs and supplied finished prerequisite reading. Used the current staycurrent-review practitioner checks with relevant teaching and rendered technical-state checks. No article edits, delegation or publication.

## Findings

No substantive findings.

The article supplies the promised practical judgement: base installation, durable continuation, application and voting authority remain distinct; the unsafe old/new-majority counterexample explains why intersecting membership lists alone are insufficient; membership safety remains separate from the availability and capacity checks at intermediate placements. The quorum and failure examples are correct. The capacity table correctly rejects abundant but ineligible or insufficient space, and decommission completion covers every affected group and active role. Native procedures, primary/standby fencing, placement theory and binary rollout retain their assigned owners. The supplied parent establishes the replicated-history vocabulary used here.

The explanation and finished figures carry the key distinctions with bounded examples, comparable to the references' labelled transitions and before/after reasoning. Calibrated against Sequence diagrams' lifelines/messages passage and drawing, Indexes' sequential-scan passage and drawing, and Storage and durability's row-versions passage and drawing. This technical review found no missing prerequisite or unnecessary mechanism depth that stalls the intended reader.

## Evidence and rendering

Read [Raft §§6–7](https://raft.github.io/raft.pdf), including receipt versus commitment of configurations, both joint majorities, final-new commitment, non-voting catch-up and snapshot index/term/configuration metadata. Checked [etcd learner design](https://etcd.io/docs/v3.5/learning/design-learner/) and [runtime reconfiguration](https://etcd.io/docs/v3.5/op-guide/runtime-configuration/), plus CockroachDB's [replication layer](https://www.cockroachlabs.com/docs/stable/architecture/replication-layer), [node shutdown](https://www.cockroachlabs.com/docs/stable/node-shutdown) and [decommission stall explanation](https://www.cockroachlabs.com/docs/stable/cluster-setup-troubleshooting#decommissioning-process-hangs-indefinitely). These support the consequential claims checked.

Reused `v01/evidence/verification.json` after inspecting `verify.mjs` and the model. Independently checked the actual source hashes against the fixed manifest and receipt: article `0f3a330…`, Scene `42bb5d4…`, model `1212411…`, CSS `cf4c411…`, verifier `35c1e6c…`; all match. Original `v01/input/shared-example.md` hash `44656a9…` matches its input receipt. The owned in-memory PGlite 0.5.8/PostgreSQL 18.3 WASM result executes the displayed UPDATE, retaining stock 10/0/4, pending order 103, no payment and line value 29.00. The separate 16-set quorum checks and fixed-rate backlog rows agree with the stated arithmetic. No rerun was necessary for these unchanged artifacts.

Operated the assigned preview in an owned IAB tab. Actual viewport was 1280 × 720; retained its System-selected dark rendering as coordinated. Checked the copying endpoint and durable-but-unapplied continuation, old/joint/new roles, R2+R3 failing joint, R1+R2 passing joint, R1+R4 failing joint and passing new, and all three replay rates at 60 seconds (0/600/720 MiB). Rendered values, explanation, selected options and verdicts agreed; screenshots showed readable technical states.

## Limits

No distributed engine, replicated snapshot, protocol execution, durability test or transfer benchmark was run or asserted. PGlite evidence establishes only SQL/shop facts; set arithmetic establishes only the illustrative structural counts. The manuscript makes those limits explicit and says Next tests assumed reached checkpoints. Native operating procedures are outside this article. Full phone/theme coverage, playback timing and keyboard-boundary coverage are assigned to the reader review; this report does not duplicate or claim them. Builds and integration remain with the coordinator.
