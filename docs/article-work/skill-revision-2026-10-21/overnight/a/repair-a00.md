# A · a00 repair 1

Fresh repair worker; candidate A revise, figures and continuity skills from the repair archive. Start (first recorded clock, after initial reading): **2026-10-21 20:43:50 UTC**. End: **2026-10-21 20:47:25 UTC**. Recorded interval: **3 minutes 35 seconds**; initial reading preceded the first clock reading, so this is not a complete assignment-duration measurement.

Read the complete current a00 before the original editorial/visual findings, then reread the complete repaired article, contents, captions and controls. Context: root plan, canonical example, initial a00 writing/evidence record, relevant operations child passages and the storage reference’s recovery conclusion. No other overnight reports, coordinator personal findings, later trial version or earlier trial prose was read. No source outside the two assigned files was changed.

## Repairs

| Finding | Changed location | Repair |
| --- | --- | --- |
| A05 | `Shop.astro:14–19,25` | Four complete relationship rows, each retaining both table endpoints and its multiplicity. Two-column grid on wider screens; one column below 600px. No edge can wrap independently of its endpoints. |
| A08 | `a00.astro:106` | Replaced recovery labels with actions: provider may back up/restore under its contract; the application owner checks orders, payments and stock, accounts for later valid work and decides when order-taking resumes. The linked procedure now names assignment, rehearsal and data/application checks. |
| A09 | `Shop.astro:21`; `a00.astro:63` | Caption now explains the displayed relations and omitted dates. The reservation paragraph explains that starting stock already accounts for earlier orders and that accepting the new pending order subtracts its quantities. |
| A10 | `a00.astro:115` | Gives the reason for choosing deployment and engine together before the comparison: a commit on one machine does not alone survive loss of that machine and storage. |

These are the only rewritten prose passages. No broader section rewrite, new mechanism, running-example extension, changed query, changed numerical result or new observed-execution claim. Source word count: **3,752 → 3,819** (+67).

Durable sources: [a00.astro](../artifacts/a-r01/src/articles/relational-trial-3/a00.astro) and [Shop.astro](../artifacts/a-r01/src/components/relational-trial-3/a00/Shop.astro). They are byte-identical to the repair archive’s final working files.

## Verification and limits

- **Native evidence reused:** [canonical a00 evidence index](../../../relational-skill-trial-3/a00-writing.md#native-verification), specifically [native-56131.json](../../../relational-skill-trial-3/a00-evidence/native-56131.json): PostgreSQL18.6, 22 checks, PASS, stopped server. Byte comparison with input `80276a4` confirmed unchanged `example.mjs`, a00 `model.mjs`, `verify.mjs`, `Race.astro` and shared `stepper.mjs`. Claims, SQL, data and verifier scope are unchanged. The stock wording clarifies the fixture’s starting-state meaning; it does not add a history to execute. No database rerun was needed or made.
- **Primary checks:** reread [RDS point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) and [PostgreSQL standby documentation](https://www.postgresql.org/docs/18/warm-standby.html). The managed-service example remains conditional on its contract; the single-machine failure boundary is the already-stated durability boundary. No particular restore or failure-survival result is asserted.
- **Mutable authoring evidence only:** coordinator-owned port4341, 375×812, both themes. Four complete relationship rows and the new caption were rendered; document width equalled viewport width (375px). Initial light screenshots/measurements had the new markup with stale flex CSS, even after reload. A later dark screenshot showed the new equal-width endpoint grid. This mixed authoring evidence is **not certification of the final stylesheet in both themes**. Browser visibility returned false, so screenshots were from a hidden pane. Per coordinator direction, further dev-cache recovery stopped; a single static build and fresh visual review will check A05 at375px in both themes. No frozen review pass is claimed.
- No build, server, commit or push was started by this worker. No timing/playback retest was needed because the interactive component and stepper are unchanged. Existing evidence is not used as a fresh readability judgement. Source changes and the durable copies were compared against the original input; no changes outside the assigned locations appeared in that comparison.

## Continuity delta

Keep the [single canonical term ledger](../../../relational-skill-trial-3/a00-writing.md#continuity-term-ledger), linked to the [collection example](../../../../coverage/relational-example.md); this is its repair delta, not another ledger. The complete reading order was audited again, including Figure1 labels/text alternative and all unchanged figure controls, captions and SQL labels.

- **Reservation:** removed premature caption use. First explanation is now the reservation section’s opening: accepting the pending order subtracts its quantities now, with payment later. Checked Figure3, complete-order listing, rollback paragraph and later application/recovery references against that meaning.
- **Managed service:** replaces “specified operating duties” with the concrete backup/restore example under its contract. Removed “recovery acceptance”, “recovery gates” and “health observations”; owner actions supply their intended meaning. Access control still receives its definition at first use.
- **Deployment:** the shortlist introduction explains the choice through the already-taught durability boundary; engine was defined in the SQL section. No new specialised term is required.

Other ledger entries remain applicable. Names, row identities, amounts, stock, accepted/refused orders and the10:10 deletion /10:15 order103 /10:09 restore timeline still agree with the canonical example. Figure1’s four relationships preserve the same directions and cardinalities; the reservation explanation still leads to P7=0 and P3=10. No cross-article example change is proposed.
