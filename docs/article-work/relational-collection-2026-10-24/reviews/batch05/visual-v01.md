# Visual review · article mode · r22, r25 · batch05-v01

Inputs read: [frozen manifest](v01/manifest.json); complete rendered articles and isolated examples at `127.0.0.1:4418/review/relational-collection/`; current visual perspective and figures/render-check guidance; applicable frozen mechanical contrast records. Final Sources disclosures were expanded and read, including material outside article elements. Source, plans, context, author notes, earlier versions and reviews were withheld and not consulted.

Highest severity: none.

This is a fresh initial visual perspective on these two complete articles, alongside a separate report for the three articles in batch04-v01. It is not corpus coverage.

## Reference calibration

I studied all 34 numbered rendered reference figures on port 4350: Sequence diagrams 1–13, Indexes 1–11 and Storage and durability 1–10, with their teaching passages and the comparison tables. The calibration covered named entities and directed relationships, visible keys and page references, counters and comparisons, transaction/memory/disk boundaries, meaningful controls, text alternatives and explicit distinctions between illustrative models and observed execution. Tall/clipped views were recovered through viewport scrolling. No reference source was read.

## Checks

| Piece · check | Result | Observation |
| --- | --- | --- |
| r22 · 1. First reading alone | Pass | Both figures, both tables and all six SQL examples were read on the isolated route before prose. Both write protocols and all eight player states were used. |
| r22 · 2. Form fits content | Pass | Real column headings separate agreed price from hundredths in the five-line relation. The changing scratch row has explicitly named decimal/integer fields, with backfill and old caller on either side. A separate late-row diagram and compatibility table answer different questions. |
| r22 · 3. Readable at a glance | Pass | The paired values, NULL, mismatch/equivalence text and line identity are legible. Statements preserve expansion, bridge, guard, batch and acceptance order. The composite line key participates visibly in the batch match. |
| r22 · 4. Interaction | Pass | All eight states agreed with their explanations: saved 2000 becomes wrong after 21.00; the bridge produces 2100 and the missing-only batch skips it. Play, Pause, Back, Next, Reset, Replay, both radios and expanded text alternative were used. Arrow-key selection worked; keyboard first/last arrivals retained Back/Next focus. |
| r22 · 5. Themes and phones | Pass | Actual 1280×720 and 375×812 in light/dark. Cards stack; price fields stay alongside their headings; current result, explanation and controls remain understandable. Document width stayed 375. The compatibility table scrolls horizontally within its own 343 px region; I scrolled it to read the final column. Relevant NULL/warning/body text and meaningful outlines pass contrast. |
| r25 · 1. First reading alone | Pass | The interactive figure, its embedded result relation, both surrounding tables and all four surrounding SQL examples were read before prose. All eight login/setting/policy combinations were used. |
| r25 · 2. Form fits content | Pass | The products appear as actual headed rows with one kind of value per column. Composite keys distinguish the two P7s. Separate login, caller setting and trusted-policy controls make their different authorities visible. |
| r25 · 3. Readable at a glance | Pass | The result marks both returned and hidden rows explicitly, preserving the other-shop counterexample. Policy text identifies the decisive value and the summary names the received product and price. Role/grant/policy snippets stay ordered and labelled. |
| r25 · 4. Interaction | Pass | All eight combinations matched their policy, row marks and explanation. Both native selectors, both radios and the comparison disclosure were used. Keyboard selector and arrow-key radio operation retained focus and changed the comparison. There is no automatic player or first/last step boundary. |
| r25 · 5. Themes and phones | Pass | Actual desktop/375 px, light/dark views checked. Controls stack; the policy and result relation remain legible and are visible together with a small scroll. Both product rows retain readable text rather than becoming illegibly dimmed. Tables fit or wrap inside the phone; document width stayed 375. Contrast passes. |

## First reading

These meanings were recorded from the isolated examples before their article prose.

### r22 · Live schema changes and backfills

- **Table: The five existing order lines, with their intended new representation.** Each order/line identity maps an agreed decimal price to its integer hundredths. The repeated 20.00 values stay separate rows; 4.50 becomes 450 rather than a rounded whole-unit price.
- **SQL: Expand without removing the decimal column.** Add a new integer field and keep the old representation available. Existing-row completion is visibly a separate concern.
- **SQL: Keep the decimal authoritative while old callers coexist.** A before-write trigger derives the new value from the decimal on the row being written. The direction of authority is clear.
- **SQL: Require a complete, equivalent pair on new writes.** A non-null check and exact comparison express both completeness and agreement. `NOT VALID` raises the expected question about existing rows, which the prose later answers.
- **Figure 1: A row can change after the backfill reads it.** The backfill saves 2000, then an old caller changes the decimal to 21.00. Saved copy finishes at a labelled mismatch, 21.00/2000. Decimal bridge stores 2100 in that same edit, after which the missing-only backfill skips the row. NULL is a written state, and the scratch-history disclosure is explicit. Before prose the main remaining question was how the shown safe branch relates to the SQL batch; the visual sequence itself was clear.
- **SQL: One small, replayable PostgreSQL batch.** Select at most two missing composite keys under locks, calculate from the update target and return the changed values. Both key fields and the repeated missing-value condition are visible.
- **Figure 2: A late row behind the worker.** The cursor is past 103 · 2 while 101 · 1 was absent. A later insert appears behind that progress marker. The caption distinguishes a missing new value from a bridge-filled 4.50/450 pair. It does not claim that the fixed line had always been absent.
- **SQL: Find every incomplete or inconsistent pair.** Return either missing values or unequal representations, rather than treating non-NULL as sufficient completion.
- **SQL: Turn the transitional guard into a checked table property.** Validate the earlier constraint after acceptance.
- **Table: Compatibility depends on the deployed caller, not just the schema version.** A four-stage mapping of readable representation, write authority and permitted next move. It distinguishes the safe mixed period from the later handover and contracted state.

### r25 · Database access and least privilege

- **Table: Authority derived from these three tasks.** Runtime, migration and support need different powers. Each row names a boundary worth testing, rather than merely calling all access “read-only” or “admin”.
- **SQL: Separate the owner from the deployed logins.** One owner, a migration path, a shared grants role and two runtime identities have distinct role-assumption/inheritance rules. The snippet alone raises the expected question of how tenant identity is later used.
- **SQL: Grant the catalogue task its object and column permissions.** Schema lookup, product reading, specified insert columns and price-only updates are separate grants.
- **Figure 1 and embedded query/result table: Which identity decides the visible shop?** Two different products share P7 but have composite keys (10, P7) and (20, P7). Caller-setting policy follows the supplied setting regardless of login; identity policy follows the login regardless of setting. Changing runtime_10's setting to 20 visibly returns Copper mug under the first rule and Blue mug under the second. The query, both rows, marks, policy sentence and summary agree in all eight combinations. The disclosure limits “Hidden” to this SELECT, avoiding a claim about every privileged path.
- **SQL: A policy scoped by the effective database identity.** Both existing-row visibility and proposed-row checks map the two runtime identities to their shops.
- **SQL: Expose the intended all-shop support report.** An owner-created view deliberately names report columns and receives a separate support grant. The header makes the owner context explicit.
- **Table: Acceptance cases in the disposable PostgreSQL run.** Permitted Blue mug reading is kept beside cross-shop refusals, forbidden role/schema actions and the deliberate support exception. Expected empty/zero results are distinguished from errors.

## Findings

None. The complete article readings explain the scratch fixtures, write authority, partial SQL context and identity assumptions while preserving the meaning apparent from the examples alone.

## Evidence and limits

- Independent [manual state records](../visual-v01-evidence/states.json) include all eight r22 states and all eight r25 combinations. Both interactive text alternatives were expanded and read. Browser controls were actually exercised; receipts did not replace fresh use.
- [Page-clock observations](../visual-v01-evidence/playback.json): r22 progressed from 1/4 through 2/4 to 4/4. A changed 2/4 explanation stayed present for 4.51 seconds; after Pause it stayed at 2/4 for a further 42.85 seconds. This establishes a readable changed-text hold and working Pause without pretending every automatic state/option was independently re-timed. Hidden panes can throttle animation; the samples use browser `Date.now()` rather than screenshot age.
- Selected phone captures: [r22 mismatch and controls](../visual-v01-evidence/r22-phone-dark.png), [r25 caller-setting result](../visual-v01-evidence/r25-phone-light.png). Both complete figures and their upper/lower portions were also inspected in both themes. The r22 compatibility table was read on both sides of its local horizontal scroll.
- Direct [rendered style samples](../visual-v01-evidence/contrast-styles.json) matched the common frozen palette. The applicable [r22 contrast record](v01/mechanical/r22/contrast.json) and [r25 contrast record](v01/mechanical/r25/contrast.json) give text minima on the two surfaces: primary 13.73:1 in light and 10.89:1 in dark; secondary 6.05:1 and 6.15:1. Accent outlines have a minimum of 5.52:1. NULL, mismatch text, captions and hidden result rows remain above 4.5:1; meaningful graphics exceed 3:1. The inspected hidden rows used full text opacity. Shared stylesheet identities are fixed by the manifest. These measurements establish contrast only, not visual teaching quality.
- All four current rendered download links for this batch returned HTTP 200 and byte hashes equal to the manifest: [bounded HTTP record](../visual-v01-evidence/download-http.json). The ordinary sandbox initially blocked the local socket; the authorised bounded read-only escalation succeeded. No browser download/save waits were used, and browser saving remains unverified. Native SQL was not rerun for this visual perspective; the articles distinguish models and controlled experiments from live execution.
- Longer SQL scrolls locally. No source inspection, article edit, build, delegation or publication occurred.
- [Restoration record](../visual-v01-evidence/restored.json): actual 1280×720 restored, both frozen origins set to System, viewport override reset and only the three reviewer-created temporary tabs closed. Global viewport lease released.
