# Practitioner review — b04, round 1

Reviewed a09–a13 and their supplied contexts against the original relational-practice commission. No other review report was read or followed. This review concerns planned decisions, depth and boundaries; technical demonstrations remain to be verified when written.

## a09 — Choosing types and representing missing values

**Pass. No required repair.** The representation contract makes this useful design work rather than a type catalogue. “Choose the boundary of a structured value” uses ownership, independent references and evolution to decide between embedded values and rows; external-payload consistency is correctly handed off. Time-zone rule changes and application round trips close consequential gaps that a list of SQL types would leave. Expression evaluation and constraint enforcement have explicit separate owners. The proposed depth can terminate here.

## a10 — Expressing rules with constraints

**Pass. No required repair.** “Reference the whole relationship” covers tenant-crossing and partially absent composite references, while “Decide when related changes must become valid” distinguishes deferred checking from expressing an otherwise absent rule. These are valuable enforcement decisions beyond basic syntax. The final enforcement map prevents triggers and declarative-looking mechanisms from substituting for a concurrency argument. Live deployment and multi-session analysis remain with their owners. No new constraint-specialist branch is needed.

## a11 — Normalisation and deliberate redundancy

**Pass. No required repair.** Reconstruction and local enforceability are assessed separately, which makes decomposition reasoning actionable. The overlapping-key and independent-set cases have explicit decision payoffs and stopping points; retain those compact examples rather than expanding normal-form coverage. “Give every derived copy a maintenance contract” preserves freshness, every writer, drift detection and a safe rebuild boundary, so redundancy is judged as an ongoing responsibility. Protocol and benchmark tutorials are correctly handed off. No deeper theory article is required.

## a12 — Modelling history and data lifecycles

**Pass. No required repair.** “Separate an entity from its versions” prevents today's references from silently changing historical answers. The second time dimension is introduced only for a requirement that needs it, and the final lifecycle test checks what retained data can actually establish. The plan also distinguishes historical truth, audit evidence, active visibility and removal from recoverable copies. Those capabilities meet the relational goal without requiring event-sourcing or temporal-database specialism. No coverage repair is needed.

## a13 — Getting SQL values right

**Pass. No required repair.** The depth is tied to plausible wrong answers in ordinary queries. The evaluation-order cautions around guards and casts, and the separation of calendar movement from elapsed duration, are particularly useful practical safeguards. The named reference engine, settings and recorded-results requirement make dialect differences testable rather than anecdotal. Schema representation, membership, aggregate/join semantics and driver conversion retain distinct owners. The regression fixture suffices; no further function or calendar branch is warranted.

## Batch verdict

All five plans pass. Their useful practitioner capabilities are present, with no required repairs or additional child articles identified.
