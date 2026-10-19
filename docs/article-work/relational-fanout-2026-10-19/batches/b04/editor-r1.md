# b04 — adversarial editor, round 1

Reviewed a09–a13 and their supplied contexts against the original relational-practice goal. No review report linked from a context was opened. These are planning judgements; no unwritten teaching or implementation is assumed.

## a09 — Choosing types and representing missing values

**Pass.** The seven sections each change an ordinary schema decision. No child article is needed.

- Keep the representation contract as a compact fixture used throughout; do not repeat the parent's general schema-design method in the opening or ending.
- Numeric range/error, identifier/text equality, temporal meaning and missing states earn their space. Keep the identifier-format comparison short: identity/key design already has an owner. For text, retain only encoding/normalisation/collation differences that change equality, acceptance or ordering in the example; omit a general Unicode tutorial.
- The structured-value section should remain one decision about validation, independent changes and ownership. Fold binary/external-payload choices into its concluding comparison rather than another worked storage design. The loss is payload-storage specialism, not the ability to choose an appropriate relational boundary.
- a13 owns SQL arithmetic, predicates and time calculation. Driver integration owns conversion mechanisms. Here, state what must survive and use a few round-trip checks as evidence; do not rebuild those lessons. No useful understanding is lost by linking to the operational explanation.

## a10 — Expressing rules with constraints

**Pass.** The sections resolve distinct enforcement questions, and the plan avoids a constraint-feature catalogue by requiring accepted and rejected changes. Keep this as one article.

- Required values and identity can be a short extension of the parent's schema, not another introduction to candidate keys, defaults or type choice. The useful new work is closing actual enforcement gaps.
- Composite references, conditional uniqueness and deferred validity each expose a different failure; retain them. Use the generic-reference counterexample only if needed to explain a repair to this schema, as the plan already permits. Cutting it otherwise loses only another pattern example.
- Non-overlap earns one engine-specific worked enforcement decision; do not add a temporal-feature comparison or repeat a12's historical model. Deletion actions should follow one reference graph rather than give every action an independent scenario.
- The closing enforcement map should record the remaining obligation and hand it to transactions. Do not expand the trigger/protocol comparison into implementations here: a database-trigger location alone is not the missing correctness argument. No extra constraint or trigger descendants are justified.

## a11 — Normalisation and deliberate redundancy

**Pass, with the strongest local trimming opportunity in this batch.** Dependency reasoning and a derived-copy maintenance contract belong together; splitting them would hide the tradeoff this article must teach. The plan should remain a terminal article.

- Fold “Check every candidate key” into “State what determines each fact”. Reduce “Separate a changing fact from a different fact” to a brief reminder linking to the parent/a12. Neither needs another substantial teaching stop. This removes repeated foundations while preserving the key assumptions.
- Keep the service-line decomposition as the main case. The overlapping-key example must do both jobs—show the missed dependency and the resulting enforcement tradeoff—rather than launch a normal-form progression. The venue sets need only one independent-versus-correlated contrast. Names such as BCNF and fourth normal form should label the decisions already demonstrated; proofs, decomposition algorithms or further counterexample families would exceed the original goal.
- Fold “Measure the decision against the workload” into the decision about storing a repeated result. The four stored-result forms need short variations, not four walkthroughs. No useful understanding is lost: source, benefit, extra work and freshness remain explicit.
- Retain the maintenance contract, but stop at the guarantee required of an atomic update or rebuild. Link concurrency protocols, asynchronous delivery and live replacement procedures to their owners. The lost-update schedule should be a small counterexample establishing an obligation, not a second transaction lesson.

## a12 — Modelling history and data lifecycles

**Pass.** Current state, agreement snapshots, change evidence and applicability periods answer different practical questions. Version identity, corrections and removal consequences add decisions that the parent cannot safely compress into one lifecycle paragraph. No further child is justified.

- Use the opening question set as the organising table for the four representations; avoid four independent pattern introductions. Preserve the option to keep current state alone.
- “Separate an entity from its versions” and “Define time boundaries and correction rules” earn their space through the historical answer they preserve. Keep recorded time conditional on reproducing an earlier understanding; do not require a complete two-time-dimension schema for the ordinary example.
- Treat removal as a requirement passed to constraint enforcement, evolution and operations. Keep the reference/uniqueness/report effects here, but cut repeated cascade syntax, deletion jobs and backup expiry/restore procedures. Their owners already supply the implementation. The final lifecycle walk should test this article's promised historical answers, not repeat the whole schema acceptance exercise.

## a13 — Getting SQL values right

**Pass.** The nine sections are bounded by observable wrong answers in ordinary queries. The named-engine approach avoids a dialect catalogue, and no specialist calendar or expression branch is needed.

- Keep unknown propagation and business fallbacks together around the optional charge; a standalone general truth-table tutorial would add work without another decision. Leave membership and outer-join cases to their named owners.
- Arithmetic and conversions should share fixtures: use the same operands to show why conversion before calculation differs from conversion afterwards. Retain separate parse/invalid-input checks, but omit a survey of cast rules or functions.
- Text matching earns its literal-wildcard example; schema equality policy belongs to a09. Reuse that policy rather than reteach the Unicode/collation background.
- The two time sections should reuse one daylight-saving timeline for reporting boundaries and calendar-versus-elapsed movement. Introduce only the type distinctions needed to explain the query; a09 owns their storage meaning. Month-end and timestamp-clock differences should appear only when they change the worked answer. Cutting unrelated calendar examples loses breadth, not query correctness.
- Keep the final regression fixture as a compact record of these results. It should not become another general testing methodology section.

## Consolidation judgement

Retain these five destinations: representation, enforcement, dependency/derived-copy design, lifecycle meaning and expression correctness serve distinct reader decisions. Merging them would make those decisions harder to find. The efficient corpus here uses shared facts and fixtures, short reminders and links, and no further descendants. All suggested cuts remove duplicated setup or specialist breadth without removing a commissioned practical capability.
