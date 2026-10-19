# Practitioner review — b05, round 1

Reviewed a14–a16 and their contexts against the original relational-practice goal. Rechecked only the consolidated a11 sections against this perspective's b04 findings. No other review report was read. These are planning verdicts; executable examples and technical evidence remain to be checked when written.

## a14 — Joining and summarising data

**Pass. No required repair.** The plan teaches decisions that ordinary report authors must get right beyond the parent's basic join: preserving the intended row grain, distinguishing absent matches from null attributes, and combining independent details without inflated totals. “Combine independent totals without multiplying them” explicitly rejects attractive but incorrect DISTINCT repairs and checks equal-valued legitimate payments. The fixture set exercises those failures rather than merely reproducing the happy-path output. Existence semantics, expression details and execution costs retain separate owners. No further reporting branch is needed.

## a15 — Composing larger SQL queries

**Pass. No required repair.** Scalar cardinality, lost correlation, null-sensitive membership and multiplicity in set operations each lead to an explicit correctness choice. The parent/child boundary is maintained: ordinary staging is assumed, while this article owns the additional semantic traps. The optional traversal contains the required termination and cycle argument, distinguishes a safety depth bound from completeness, and separates evaluation from display order. This is enough traversal competence for the global relational goal without a graph curriculum. View use is bounded by interface meaning, with deployment and execution elsewhere.

## a16 — Calculating across related rows

**Pass. No required repair.** The plan preserves input grain, business ties, frame membership and filtering stage as separate decisions. Particularly useful are the distinction between stable selection and business ranking, the whole-group denominator versus running denominator, and an absent predecessor versus a predecessor with a null value. Missing calendar periods are treated as an input requirement rather than something a window frame supplies. Two reusable fixtures and a named-engine evidence requirement make this adequate practical depth without a window-function catalogue or further analytical branch.

## a11 — Normalisation and deliberate redundancy — consolidation recheck

**Pass. Useful capability preserved.** Candidate-key reasoning and measured justification for redundancy remain explicit after their subheadings are folded into adjacent sections. Reusing the overlapping-key example preserves the reconstruction/enforceability distinction with less example overhead. The shorter maintenance sections still require every derived copy to have a concurrency guarantee, lag allowance, drift detection, concurrent-change-aware rebuilding and defined reader behaviour when repair fails. Procedure construction is now clearly handed to its owners. This retains the capabilities identified in b04; no new coverage gap or remaining finding is identified.

## Batch verdict

All four articles pass for the assigned review scope. No required repair or additional child article is identified.
