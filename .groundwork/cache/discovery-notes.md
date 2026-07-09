# Discovery Notes

> Signals captured out-of-phase during GroundWork conversations. Each skill reads its section before starting and removes lines once incorporated into output. Section headers match the canonical set defined in `operating-contract.md` — do not add, rename, or reorder them.

---

## Product Brief

<!-- Vision-level signals captured during later phases — new user types, missing capabilities, refined success criteria. -->

---

## Design System

<!-- What the user sees or does: interaction patterns, search/browse/navigation flows, aesthetic instincts. User-facing signals go here even when they name a concrete mechanism (e.g. faceted vs conversational search). Internal mechanisms belong in ## Design Details. -->

---

## Architecture

<!-- Infrastructure preferences, scaling instincts, technology opinions surfaced outside the architecture phase. -->

<!-- (Entry incorporated into docs/architecture/index.md at the architecture commit: fully static site, build-time content reads.) -->

---

## Design Details

<!-- Internal mechanisms the user never sees directly — async flows, callback patterns, job lifecycles, data ownership, contract format choices, resiliency patterns. Not user-facing interaction patterns; those go to ## Design System. -->

<!-- (Entries incorporated into docs/design-system.md at the design-system commit: writer skill as binding stage, skill-creator conventions, frontmatter-as-state.) -->

---

## Bets

<!-- Delivery priorities, MVP scope instincts, feature sequencing for future bets. -->

- MVP scope reasoning (first-living-topic): both surfaces in scope because the product IS the article+skill pair — excluding either voids the signal. Databases chosen as seed content by operator directive (coverage: relational/document/key-value/columnar/vector/graph, selection heuristics, convergence trend, mental models). Build order by dependency: core → topics/databases → site routes → workbench → deploy workflow. Post-MVP sequence instincts: second topic (proves repeatability), framework extraction, search at ~25 topics.
