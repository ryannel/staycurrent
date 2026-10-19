# Adversarial editor review

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md`. This is a structural, reading-effort and consolidation review, not a judgement of unwritten prose or figure style. No existing relational corpus or earlier plan was used.

Verdict: repair the enforcement boundary before expanding children. The design has a coherent worked problem and useful stopping condition, but currently proposes three child articles where two clearly earn separate reading. The enforcement child largely promises a second pass over the parent's central work.

## Findings

### E1 — Fold the enforcement child into the parent and distribute its genuinely deeper cases (priority 2)

Location: `breakdown.yaml:120–159`, especially the child at lines 137–151.

The parent already promises named constraints, rejected counterexamples, immediate/deferred checks, a classification of rule scope, procedural limits, a competing-writer history, all write paths, useful failures and existing-data validation. The child repeats all of these, as well as null/equality material from lines 105–112. This is a substantial additional reading and navigation cost without a distinct promised outcome: both articles teach choosing where an invariant belongs.

Recommended repair: remove `Choosing how to enforce invariants` as a child. Keep one parent section built around the ledger: ordinary row/key/reference guards; a structural reformulation or conditional-uniqueness case; a deferred transition; a rule that requires a transaction protocol; and one compact account of every write path and useful rejection. Use a named engine only where a choice changes. Have `Modelling history and time` own the actual interval/overlap enforcement example as part of its historical representation, with the transaction owner supplying the concurrent protocol where needed. Keep privilege policy and deployment/validation execution with their already named owners.

What useful understanding would be lost: a separate comparative survey of enforcement mechanisms across multiple engines and repeated worked examples of already introduced rule classes. The rule-placement decision, the warning about procedural checks under concurrency, conditional uniqueness, and temporal integrity need not be lost. If the worker retains the child, it needs a substantially narrower, demonstrably deeper outcome; merely moving all parent depth behind its link would make this core schema-design article unnecessarily dependent on another page.

### E2 — Use the ending for transfer, rather than replaying six already taught failures (priority 2)

Location: `breakdown.yaml:219–235`.

The final section proposes another walkthrough of duplicate identity, tenant scope, absence, concurrency, price history and deletion. All six have explicit worked ownership earlier. Re-running them serially risks spending the reader's final effort on recognition instead of demonstrating that the design method transfers.

Recommended repair: keep the complete annotated schema and ledger as the cumulative result, but make the final activity the new requirement already proposed at lines 231–232. Select one requirement that forces several decisions together, such as allowing split fulfilment with cancellation after partial shipment. Ask the reader to revise row meanings, identity, lifecycle, quantity rules and enforcement ownership, then give the reasoning. Refer to the existing counterexamples in the ledger rather than narrating all of them again. Fold `Leave a design another engineer can change` into that closing section instead of making a single-child heading level.

What useful understanding would be lost: a second recital of the existing examples. The finished review artefact, integrated validation and stopping condition remain, while the new requirement tests independent judgement.

## Challenge of every main section and child

| Location | Keep, cut or consolidate | Learning retained and cost judgement |
| --- | --- | --- |
| Lines 14–34: facts and forbidden states | Keep; make the ledger cumulative. | Row meaning and a counterexample-led specification are prerequisites for everything that follows. No separate schema-design-method article is warranted. |
| Lines 35–55: identity and relationships | Keep. | Candidate versus chosen keys, scoped references, participation and association attributes each change the schema. Keep the long list of malformed alternatives subordinate to one counterexample rather than giving each a tour. Cutting this loses the ability to defend a key or relationship. |
| Lines 56–90: dependencies and flexible attributes | Keep the parent worked decomposition and one concrete flexible-attribute decision. | Readers need to see why the same product and order-line prices are different facts. Dedicated columns, lookup relations, documents and EAV should answer the one new requirement, not become four mini introductions. |
| Lines 70–83: normalisation child | Keep. | Losslessness versus dependency preservation, BCNF trade-offs and independent multivalued facts require enough counterexample work to justify a separate page. Do not repeat candidate-key derivation at introductory length. Cut the open-ended promise about higher join dependencies at lines 80–81 unless expansion supplies a practical decision not already taught by the worked 4NF example; the loss is specialist completeness, not the parent's design outcome. |
| Lines 91–119: value domains | Keep in the parent. | Units/rounding, absence and civil versus elapsed time all prevent ordinary design mistakes; splitting these into type-reference children would impose disproportionate navigation. Keep SQL expression semantics with SQL as promised. |
| Lines 120–159: enforcement | Consolidate under E1. | This is central to the parent outcome. The separate child currently duplicates its decision process. |
| Lines 160–182: ownership and history | Keep the common cases. | Agreed order facts and deletion decisions are required before a practitioner can defend the schema. The parent should stop at selecting a representation; it need not work the full two-axis correction. |
| Lines 183–197: temporal child | Keep. | Backdated correction, two time axes, historical references and interval invariants form a distinct problem with substantial reasoning. Removing the child would either leave these unanswered or overload the parent. Move its detailed overlap enforcement here as in E1. |
| Lines 198–218: access patterns and duplication | Keep; keep physical organisation as a short boundary note. | The maintenance contract for a stored total is the useful judgement. Do not grow partition/shard/index examples here: their mechanics already have owners. Cutting the physical note loses an important caveat about available enforcement, so retain that caveat and links. |
| Lines 219–235: final review | Consolidate under E2. | A single transfer exercise and a cumulative artefact earn their space; another full run of all prior failure examples does not. |

## Recheck requested

The parent worker owns repairs. Recheck that the revised breakdown preserves the ordinary constraint examples, a concurrency handoff and the domain/temporal integrity boundaries after E1; and that the ending requires a new design decision after E2. Child stubs must remain `topic`, `title` and `brief` only.

## Repair recheck — final verdict

Re-read the repaired `breakdown.yaml` in full. E1 is resolved: the duplicate enforcement child is removed; the parent retains ordinary guards, conditional uniqueness/structural reformulation, deferred transitions, aggregate and lifecycle rules, a competing-writer counterexample, all write paths and useful rejection. The temporal child explicitly owns interval/overlap protection and hands concurrent protocols to transactions. E2 is resolved: the ending now tests split fulfilment and cancellation after partial shipment using the cumulative schema and ledger, and the redundant heading level is removed. The unbounded higher-join-dependency promise is also cut. The two remaining child stubs contain only topic, title and brief.

No unresolved findings from the adversarial editor perspective. Ready for tree-level reconciliation and child expansion; this verdict does not assess unwritten prose or implementation correctness.
