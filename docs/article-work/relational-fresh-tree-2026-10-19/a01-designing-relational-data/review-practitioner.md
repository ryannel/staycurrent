# Practitioner review: Designing relational data

**Verdict: clean. No required repairs.**

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md` from the
assigned practitioner perspective: coverage, depth and practical judgement. This
review did not consult existing relational articles, earlier coverage maps or old
plans. It reviews a plan, not the correctness of unwritten examples or the final
article's teaching execution.

## Coverage and depth

The breakdown covers the assigned design responsibility with a coherent worked
order-reservation schema. Row meaning and the invariant ledger precede structural
choices (lines 14–34); keys include business scope, equality and alternative
uniqueness, while relationships include participation and reverse obligations
(35–55). Dependency-led normalisation includes lossless reconstruction and
dependency preservation, with a bounded deeper child (56–90). Values cover units,
precision, absence and temporal meaning (91–119).

Integrity is treated as more than a catalogue of constraints. The plan requires
rejected counterexamples, distinguishes row-local rules from cross-row and
concurrent rules, covers immediate/deferred checking and existing-data validation,
and includes every write path in the enforcement boundary (120–159). Ownership,
deletion and history have concrete trade-offs and a separate deeper temporal
design only when the questions require it (160–197). Deliberate duplication has
explicit authority, maintenance, staleness, rebuilding and reconciliation duties
(198–218). The final schema review tests the resulting design rather than merely
recapping vocabulary (219–235).

## Practical judgement and boundaries

The strongest safeguards are the distinction between an agreed historical price
and duplicated current truth (58–62, 200–203), scoped references that reject
cross-tenant mistakes (44–47), and the explicit warning that procedural validation
does not itself protect against concurrent writers (131–136). These prevent common
design errors without importing transaction mechanics into this article.

The three child stubs each provide a credible deeper practice task:
decomposition reasoning (70–83), enforcement design (137–151), and historical
representation (183–197). Each remains `topic`/`title`/`brief` only. The parent
retains enough reasoning to make a useful complete design before a reader follows
one of those branches. SQL semantics, transaction protocols, migration execution,
physical diagnosis and operational policy have explicit neighbouring owners.

No technical concern in the proposed plan required an external factual check.
Named-engine behaviour still needs verification when the eventual examples choose
an engine/version, as the plan already requires (109–112, 126–127, 143–145).

## Recheck after editorial consolidation

**Final verdict: clean. No unresolved findings or required repairs.**

Rechecked only the editorial changes against the reviewed coverage. Removing the
enforcement child loses no required design responsibility: “Put ordinary guards in
the schema”, “Recognise rules that need more than a row check” and “Make rejection
useful to every writer” retain the ordinary constraints, conditional uniqueness and
structural alternative, deferred transitions, procedural limits, competing-writer
counterexample, existing-data validation and all write paths. The temporal child
now explicitly owns interval/overlap enforcement and preserves the hand-off to the
transactions owner when concurrency requires a protocol.

The normalisation child retains the practical dependency and decomposition depth;
removing the open-ended higher join-dependency promise leaves no gap in the assigned
parent scope. The revised ending keeps the cumulative review artefact and applies
it to split fulfilment and cancellation after partial shipment. This tests the
reader's ability to change identity, grain, lifecycle, quantity rules and enforcement
ownership rather than replaying the original examples. The two remaining child
stubs still contain only `topic`, `title` and `brief`.
