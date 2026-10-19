# Practitioner repair recheck — b01-repair, round 1

Rechecked only the changes to a01–a03 against this perspective's original b01 findings and the original relational-practice goal. No other reviewer report was read.

## a01 — Designing relational data

**Pass.** Removing the subtype, generic-reference and recursive-reference tour preserves the required relationship-design competence: row meaning, cardinality, scoped identity, optionality and enforceable references remain covered. The revised booking example makes optionality concrete without requiring specialist modelling patterns. No remaining practitioner finding.

## a02 — Working with SQL

**Pass.** The parent now completes an ordinary staged report and basic existence query, while the child owns deeper subquery, membership, set-operation and traversal decisions. The join child's existence reference has a clear purpose—preserving row multiplicity—without taking over the detailed semantics. Optional traversal and child-specific fixtures preserve the original useful SQL coverage while reducing repeated instruction. No remaining practitioner finding.

## a03 — Making concurrent changes correct

**Pass.** The constraint-deployment hand-off now goes to schema evolution, resolving this perspective's minor reference finding. Lock construction and engine-contract interpretation have distinct owners, with each locking protocol still required to state its verified isolation assumptions. The split preserves the correctness argument rather than treating locks and isolation as independent guarantees. No remaining practitioner finding.
