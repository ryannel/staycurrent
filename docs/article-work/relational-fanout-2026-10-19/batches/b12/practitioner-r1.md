# Practitioner review — b12, round 1

Reviewed a39 and its context against the original relational-practice goal; rechecked only a32's durability-owner link clarification. No other review report was read. Verdicts assess planned coverage and boundaries, not unexecuted restoration procedures.

## a39 — Backing up and restoring relational data

**Pass. No required repair.** The plan develops recovery as reconstruction of an acceptable state, with dependencies and measured time, rather than successful copy creation. Detection delay, independent access, retained base/log dependencies and recoverable keys cover failures that replica survival alone cannot address. The accidental-deletion case forces an explicit target boundary and preserves valid later work for reconciliation.

“Decide between replacing the database and repairing selected data” makes the important practical trade-off without pretending an extracted table is automatically safe to merge. Isolation from live writers and external side effects, application-level validation, exclusive write authority and a fallback are part of readiness. Detailed corrective work and external reconciliation have clear owners. The shared full/PITR procedure is sufficient; no backup-product or engine-specific child is needed.

## a32 — Checking an embedded choice with SQLite — link recheck

**Pass. Clarification resolved.** The non-existent “common durability article” reference is replaced by the existing transaction-durability owner, “Making concurrent changes correct”, and the named service recovery/restore owners. This preserves the intended boundary without implying a new article. No remaining finding.

## Batch verdict

Both assigned reviews pass. No required repair or additional article is identified.
