# CockroachDB operations: visual teaching-economy review

Reviewed 2026-10-29. Scope: `crdb-operations`, `crdb-backup`, `crdb-schema-change`, `crdb-upgrades`, `crdb-migration`. Review only; no product changes.

## Method and limits

Applied `staycurrent-review` and its visual perspective, `staycurrent-figures`, and `staycurrent-continuity`. The rendered fixed Storage and durability reference had been calibrated during the preceding PostgreSQL assignment: the comparison is whether a figure makes a relationship or consequence easier to understand, not whether it has controls.

Read each article's rendered explanation and all **15 numbered figures** at `http://127.0.0.1:4328/learn/databases/relational/cockroachdb/…`. Inspected screenshots of initial and final states, stepped the eight playback figures, and exercised representative alternatives listed below. The five static figures and two direct-selection figures were also inspected. Tables and code were read in the rendered article for context; this is not a new technical or executable-SQL audit.

IAB became unavailable before this added scope, so these five articles were reviewed in a separate Chrome review session at its existing desktop size and system dark appearance. No global viewport or theme changes. Settled screenshots and step transitions establish the observations below; smooth timed playback, mobile layout, light theme and every combination of alternatives were not certified. No conclusions below depend on source code or earlier editorial verdicts.

## Findings

**Critical: none found in this visual perspective.**

### Medium — make the tenant-policy comparison direct

Location: `crdb-operations.astro`, Figure 2, “The same query, a different trusted context” (`operations/`, “Enforce the tenant boundary”).

The useful visual relationship is the selected context against four persistent customer rows. Context 10 admits Mina, Tariq and Edda; context 20 admits Rowan. That comparison works immediately when the selector changes at the final state. The four-step playback adds little: steps 2 and 3 show the same matched/excluded rows and the same explanation, and both still say “Result not yet returned”; step 4 adds a textual result repeating the highlighted names. Readers must advance through a staged explanation to obtain what is fundamentally an input/result comparison.

Keep the selector, stored rows, matching treatment and the caller-trust explanation. Show the result immediately, or draw an actual distinct result area into which the matching rows enter. Removing the redundant middle stage is a smaller repair. This is a specific interaction issue, not a reason to remove the operations article's quorum stepper.

### Medium — keep the stale original distinct from the fresh return candidate

Location: `crdb-migration.astro`, Figure 3, “Bring the accepted purchase back with you” (`migration/`, “Return without losing accepted work”).

The initial left box is the stale original PostgreSQL database. At the copy stage the same box becomes a fresh PostgreSQL candidate, then the authority. The original disappears from the drawing. The caption and surrounding prose explicitly explain the substitution and correctly say to preserve the original separately, but the visual asks readers to remember a hidden third object at the exact point where overwriting or reopening the wrong database is the lesson's danger.

Retain the forward/reverse handover comparison and persistent CockroachDB actor. Give the old PostgreSQL copy a small fixed “closed · retained evidence” position, and introduce the fresh candidate as a distinct object. A compact three-object drawing would make the named distinction visible without requiring the explanatory caveat to carry it. This is an identity-tracking problem, not a claim that the procedure's prose is wrong.

### Low — show the repeat in reconciliation, or compress its last steps

Location: `crdb-backup.astro`, Figure 3, “Restore the record of an accepted charge” (`backup-and-restore/`, “Reconcile the later payment”).

The recovered database/provider split is valuable, and the unavailable-evidence alternative visibly stops with no payment. In the successful path, however, steps 3–5 leave the same payment count, mapping, balance and provider state on screen. Only the explanatory sentence changes to describe the repeat and final result. Optionally show the repeated operation visibly consulting the retained mapping, or combine the final explanation with the recorded state. The teaching content is sound; the small extra clicking cost does not require a full redesign.

### Low — reduce repeated narration around otherwise useful state changes

Concrete locations: `crdb-schema-change.astro` Figures 1 and 3; `crdb-migration.astro` Figures 2 and 3. These combine a stage title, status strip, explanatory paragraph, caption and adjacent prose. The index-build drawing earns its stages through changing entries and read eligibility; the handover earns them through changing authority and differing stock. Some state is then described several times. Optional tightening should preserve the actual entries, identities, status distinctions and model limits, and shorten duplicated narration or excess reserved explanation space. Do not remove informative states merely to reduce the number of clicks.

## Exact coverage and forms to retain

| Article / public route suffix | Rendered coverage and exercised states | Judgment / retained form |
| --- | --- | --- |
| `crdb-operations` / `operations/` | All 4 figures: secure connection; tenant context; range protection; retirement procedure. Tenant path 1–4 and context 20 at final state. Range path 1–4, then “B also fails” showing missing majority and blocked replacement. | Keep the static connection/check distinction and immediately readable retirement checklist. Keep Figure 3's four persistent nodes and visible voter count: C's loss, D's learner status, restored membership and blocked alternative make availability versus protection concrete. Figure 2 has the Medium interaction finding above. |
| `crdb-backup` / `backup-and-restore/` | All 3 figures. Restore cut before mistake versus through payment. Complete chain versus missing B; complete chain with “Backup points only”. Reconciliation 1–5, then unavailable evidence ending at 2/2 with no payment or mapping. | Keep the fixed event history, changing retained cut and separate external provider. Keep the dependency chain plus continuous-history band versus discrete backup points: removing B visibly shortens reach, while changing history changes permissible stopping points. Retain the reconciliation boundary; Low optional compression above. |
| `crdb-schema-change` / `schema-changes/` | All 3 figures. Index build 1–7, including partial backfill, P7's 20→22 update, completion and read eligibility. Static pause/cancel/cleanup paths. Loyalty build 1–5 through duplicate failure, correction, success and rejected later assignment. | Keep parallel primary/secondary representations: newly appearing entries and synchronized P7 value show why an index cannot serve reads early. The static job-path comparison avoids unnecessary controls. Loyalty rows remain distinct from the proposed/accepted rule, so failed construction is not confused with deleting customer data. Low narration tightening only. |
| `crdb-upgrades` / `upgrades/` | Both figures. Initial state and complete seven-stage finalisation path; selected return branch at the late state and advanced to its 8/8 outcome, then reset. Static checkpoint before stopping B. | Keep separate node binaries, cluster version, finalisation state, return eligibility and P7 value. The return outcome restores old binaries while retaining 22.00, answering a real misconception. The static checkpoint separates node readiness, range protection and useful service without another playback sequence. No substantive visual finding. |
| `crdb-migration` / `migration/` | All 3 figures. Static four-part committed contract. Forward transfer 1–6; reverse transfer 1–5. Both initial and final states, including stale-source versus changed target stock and preserved purchase/request/work identity. | Keep the transaction boundary grouping stock, agreement, retained request and durable work. Keep side-by-side transfer states and visible stock divergence: copying and granting authority remain different stages. Figure 3 needs the Medium actor-identity repair; narration tightening is optional. |

## Continuity observation

The inspected figures distinguish their branches in the rendered text: migration begins before purchase 103; backup keeps the purchase and stock 10/0/4 while restoring before a later payment; schema and upgrade catalogue changes retain the agreed order amount. The backup provider remains outside the database restore. The models and bounded native observations are explicitly separated. No new continuity defect was established by this review.
