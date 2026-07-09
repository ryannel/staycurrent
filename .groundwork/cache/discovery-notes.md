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

- The website is fully static: versions are content files, RSS generated at build, no backend, no accounts, no server-side search. Static generator reads the topic content tree directly.

---

## Design Details

<!-- Internal mechanisms the user never sees directly — async flows, callback patterns, job lifecycles, data ownership, contract format choices, resiliency patterns. Not user-facing interaction patterns; those go to ## Design System. -->

<!-- (Entries incorporated into docs/design-system.md at the design-system commit: writer skill as binding stage, skill-creator conventions, frontmatter-as-state.) -->

---

## Bets

<!-- Delivery priorities, MVP scope instincts, feature sequencing for future bets. -->
