# a35 — independent writing and teaching review

Reviewed 20 October 2026 against the b40 manifest and frozen preview at `http://127.0.0.1:4438/review/relational-next/security/`.

**Verdict: one required figure-narration repair.** The article otherwise develops the operational security contribution needed by the original relational-practice commission. No new article or security-specialist branch is needed.

## Required finding

### T1 — Make Figure 1's narration follow the failed gate

Location: `src/components/relational-next/a35/SecurityFigure.astro:37`, admission scene, wrong-password and forbidden-route choices, steps 3/4 and 4/4.

The panels correctly show **Password rejected** or **Not reached**, followed by **No SQL session / Connection rejected**. The narration nevertheless says **“Authentication establishes reporter”** at 3/4 and **“A successful login permits the approved view, while the separate raw-table request remains denied”** at 4/4. I reproduced both failures in the rendered browser. This is the central lesson of the section: a rejected connection never gets to the object-authority decision. The narrated result currently contradicts that lesson precisely when the reader changes the assumption to learn it.

Make the narration depend on the selected case and current gate. For a blocked route, say authentication and both SQL requests were never reached. For the wrong password, say the listener was reached but no reporter session was established, so neither query ran. Preserve the existing projection-versus-raw-read account only for the successfully authenticated case. Check all twelve admission states after repair, including changing the choice while paused at 3/4 or 4/4.

## Optional improvements, not acceptance blockers

1. **Reduce the repeated reading cost of playback.** The state comparisons are useful, but they redraw long, mostly unchanged text panels. In the fresh defaults, the browser schedules 32.667, 39.667, 36.000, 34.334 and 38.667 seconds for the first states of Figures 1–5. These holds genuinely include the whole figure rather than only the narrative line, so they do not rush a newcomer. However, repeating that full reading allowance at every small change makes a default play-through about thirteen minutes including final-state holds; exploring every comparison costs much more. The article's fresh rendered `article.innerText` was 4,515 words including figure text, navigation and metadata. The displayed “About 16 minutes” should not imply that it includes watching every branch. Keep manual stepping, but consider highlighting the changed gate/value and timing later states from newly introduced text plus a small orientation allowance. A reader should not have to reread the caption, progress labels and unchanged authority path at every step. The reference figures earn their repeated steps through visible movement, counters and short changed explanations.

2. **Name Figure 2's operation and object.** In the routine choice, the panel still calls the application a **table user**, and its attempted work is only **Application operation / Succeeds**. Use a routine-user label and name an execution attempt; name the table read in the table choices. This would make the PUBLIC execution comparison self-explanatory without looking back into the prose.

3. **Give the namespace warning one tiny causal example if polishing further.** The paragraph beginning “Names can open another route” correctly defines `search_path`, writable schemas and `SECURITY DEFINER`, but is the densest mechanism left entirely to prose. A single qualified/unqualified lookup example showing whose object resolves would reduce the newcomer’s inference work. Do not expand this into a privileged-routine tutorial or claim the fixture tested an exploit.

## Teaching and scope assessment

The opening gives the useful high-level answer immediately: credentials, routes, object privileges and readable copies are separate boundaries. The shop, order 101 and reporting projection give the controls something concrete to protect. Definitions generally precede specialised terms, SQL is labelled PostgreSQL-specific and excerpted, and permitted work is consistently paired with forbidden work.

All five figures compare consequential assumptions rather than providing ornamental controls: permitted and forbidden queries after authentication; ownership versus grants and future-object defaults; trusted server identity versus encrypted traffic to an unchecked peer; new logins versus established sessions; and present containment versus knowledge of earlier damage. The figures are less spatial than the references, but these paired state panels do support operational decisions. T1 is the only observed contradictory outcome.

The actual parent a07 supplies a complete first operating case and retains incident command, evidence preservation, data acceptance and the return-to-service gate. a35 recalls that method, adds database-specific containment and hands possible reconstruction to a39. It leaves customer authorisation and query safety in application integration, capacity and alert response with a36, controlled maintenance with a37 and topology/reconnection dependencies with a38. Copy/key acceptance links to restoration instead of reproducing a restore procedure. The plans for those neighbouring scopes were considered; there is no useful cut or consolidation that would remove the need for this operational-security article.

Observed fixture outcomes are consistently distinguished from explanatory models and untested deployment acceptance. The article identifies loopback limits, ordinary-routine versus privileged-routine limits, operational logs versus complete read auditing, certificate-reload versus session revocation, and hosted IAM/copy/key/emergency paths that still need acceptance evidence. This review does not independently certify the native run or hosted security.

## Checks performed

- Read AGENTS.md, repository layout/direction, review skill, original and writing commissions, b40 manifest, a35 context and complete article, actual a07 parent and relevant a36–a39 scopes.
- Read all three fixed reference articles in full, including their figure components and teaching implementations: SequencePlayer and its relevant scenarios/rendering/player, the eleven Indexes figures and shared player, and the Storage StepFigure/definitions and page/server/log/player models. Used their concrete continuing example, one-assumption comparisons, narrated consequences, visible mechanisms and explicit evidence boundaries as the standard.
- In my own Chrome review tab, used only documented CUA APIs. Read every panel and narration in all **58 states**: admission 3×4, authority 3×4, TLS 3×4, rotation 3×4 and incident 2×5. Confirmed choice changes preserve the current comparison step, Reset returns to step 1, and replay returns from an endpoint to the start.
- Confirmed fresh defaults on reload: all choices 0, all figures paused at 1/4 or 1/5. Tested keyboard Tab access to the aria-disabled Previous endpoint, activation as a no-op there, retained focus on Next when reaching the final state, a no-op activation at that endpoint, and keyboard replay/pause for all five figures. Focus is not dropped into the page.
- Checked every state again at **390×844** in both Light and Dark: **58 states per theme**, no horizontal overflow in figures, panels, nodes or definitions. Visually read all five stacked comparisons in both themes. The three-column facts inside each stacked panel remain legible, though the longest incident state is 933 px tall and therefore needs normal vertical scrolling. Dynamic panel styling is present; it is not falling back to unstyled DOM.
- Measured whole-figure rendered word counts and scheduled holds, checked that a running player initially retains its state through the reading interval, and checked pause/replay controls. In an actual timed observation, Figure 1 remained at 1/4 after eight seconds with its 32.667-second hold, then subsequently advanced to 3/4 while the review record was being written. I paused it before cleanup; this was actual browser playback rather than an inference from the scheduling code.
- Did not click a download or wait for a download event. Did not run shared builds, edit article/components, use Git, inspect another perspective's report or run nested reviewers. Native and worksheet-byte validation belong to their assigned checks.

## Completion note

Restored the original System theme, reset the temporary phone viewport override and closed my review tab. The frozen preview is released for the orchestrator's next step. Required finding T1 has been communicated to the orchestrator; it needs the responsible writer's repair and a focused recheck.
