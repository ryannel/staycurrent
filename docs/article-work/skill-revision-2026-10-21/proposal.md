# Proposed changes to the Stay Current skills

21 October 2026. Compiled from the discussion, current skills, completed trial 3 and the execution diagnosis supplied by the user. Baseline checkout: `8ff2861`.

This is a proposal, not an amendment to the active skills. It does not commission new articles, another trial or publication. Changes to review coverage remain experiments, rather than established improvements.

## What we are trying to achieve

Given a topic, the AI should establish a useful learning goal, decompose it into a coherent tree of articles, and write the collection in a strong, consistent style. Diagrams, animations and interactive pieces should make the subject easier to understand. The process must support substantial volume without losing that standard.

Keep the seven small skills. They should supply the purpose, relevant context, decision criteria and essential constraints that a capable model needs. Avoid building a writing manual or prescribing every editorial decision. Keep the three reference articles as the shared standard.

Review is the immediate speed problem. Trial 3 took about 14 minutes to draft two articles and about 72 minutes from the first recorded setup timestamp to final records. The supplied execution diagnosis rounds the complete delivery to about 74 minutes. Later reviews found genuine defects, and the final result still contained four medium and six low finding groups. Passing the existing stopping policy did not establish publication readiness. See the [results](../relational-skill-trial-3/results.md) and [timings](../relational-skill-trial-3/timings.md).

## Order of changes

| Stage | Proposed work | What it establishes |
| --- | --- | --- |
| First: remove repeated work | Improve scheduling, preparation, evidence reuse and records while retaining the existing full review coverage, fresh assignments and stopping policy for the comparison. | Whether overhead can fall without removing opportunities to find defects. |
| Next: clarify acceptance | Replace round-dependent severity floors with a stable distinction between substantive defects and optional improvements. | Whether completion corresponds to the intended quality, independently of speed. |
| Then: test review scope | Compare full repeated reviews with focused repair checks plus a fresh final reading, using the same acceptance standard. | Whether narrower rechecks preserve quality. This is not yet demonstrated. |
| Separately: refine teaching and planning | Make small improvements to the writing objective, provisional tree and scope boundaries. | Whether these improve first drafts. Keep them out of the first review-speed comparison. |

These are separable changes, not a requirement to run a succession of expensive full trials. Use existing drafts and records where possible and decide what further experiment is justified by the results.

## 1. staycurrent-review

The largest change is to distinguish independent reader judgement from repeated verification.

**First changes:**

- Retain the existing perspectives and fresh reviewers for full reviews. Preserve their distinct inputs, including the editorial reader's independence from plans and repair history.
- Remove avoidable scheduling dependencies. When a full set of perspectives is commissioned, dispatch against the same frozen version as slots become free. Start long browser reviews early. Do not automatically run extra perspectives merely to fill slots; record speculative work if it is tested as a latency trade-off.
- Let reviewers rely on identified, valid evidence for unchanged mechanics while still examining what the current page means and how it reads. A passing playback test does not establish that a figure explains the subject well.
- Keep reports compact: location, problem, reader effect, severity, suggested outcome, evidence and limitations. Preserve actual findings and decisions, but stop reproducing long inventories of unchanged inputs and checks. A short coverage record should make omissions visible.
- Keep a canonical issue identity across discoveries and checks. Duplicate observations by two perspectives are one problem with two observations, not two repairs.

**Acceptance change, tested separately:**

- Remove the rising severity floor. A defect's importance must not depend on the round in which it is found.
- Require correction of false or unsupported claims, broken examples and controls, missing prerequisites, and defects that materially impair understanding, coherence or the promised practical judgement.
- Retain excellent writing as a requirement. A confusing detour or a paragraph that reads as an accumulated patch is not automatically optional because it is editorial.
- Treat equivalent wording preferences and small improvements as optional. The coordinator may include them in a repair batch without making every suggestion a condition for completion.
- Finish with an explicit judgement about whether the article fulfils its promise, reads coherently and has no known substantive defects. Report unresolved defects honestly; elapsed time does not make them acceptable.

**Review-scope experiment:**

1. Run the current complete independent review on a frozen draft.
2. Consolidate findings and send accepted problems together for repair.
3. Use fresh checkers to verify the repairs, surrounding explanation and affected dependencies. Give these checkers the findings and intended outcomes: this assignment verifies a repair rather than providing an unprompted first reading.
4. Give a fresh reader the complete repaired article for a final judgement of clarity, teaching and coherence, without earlier reports. Newly discovered technical or visual defects receive the relevant specialist check.
5. Repair substantive findings and check their consequences. Repeat a full reading when restructuring changes the article's overall argument; a local correction does not restart every perspective.

This is a candidate replacement for repeated full rounds. Later reviews in trial 3 found real weaknesses in unchanged material, so the candidate must demonstrate that it preserves detection and final quality.

## 2. staycurrent-revise

- Preserve a whole-article reread for coherence. Make the supporting preparation proportional to the repair: use relevant plan context, findings and evidence, rather than automatically reloading every reference and the full work history.
- Keep references available for calibration; a wording repair should not require three full reference-article readings.
- Replace the unconditional instruction to rerun the article's verifier with a check of what the repair invalidates. Changed claims, data, code, controls or layouts require the corresponding verification. Even a prose-only change can alter a claim and require new evidence.
- Maintain the continuity record through changed entries and dependency checks. Do not reproduce an unchanged ledger.
- Preserve the principle that accepted findings describe reader problems, not prescribed replacement sentences. Resolve related findings together.
- In the later editorial refinement, remove the prohibition on restructuring for non-critical findings. Allow the smallest coherent change that solves the problem, including restructuring when the explanation requires it. Preserve sound material and identify any wider change for review.

Candidate replacement for the broad finishing instruction:

> Reread the whole article for coherence. Recheck every claim, term, example and figure affected by the repair. Reuse verification evidence only while its relevant source, data, environment and verifier remain applicable; otherwise rerun the affected checks. Update the canonical continuity record and identify any wider changes.

Keep fresh repair assignments in the first experiment. Reusing the original writer was discussed, but is not part of the proposed initial change.

## 3. staycurrent-orchestrate

**Immediate execution changes:**

- Freeze each review input only after the articles, components, shared shell and evidence agree. Identify the version and do not mutate that preview during the review. Avoid starting reviews that must be cancelled when writing is still finishing.
- Assign one owner for builds and one for the preview; the coordinator can own both. Independent writers should not run colliding builds in the same output directory.
- Schedule ready reviews without unnecessary gates, accounting for long visual assignments. Combine findings before commissioning repairs.
- Supply a compact handoff containing the task, relevant context, fixed version and existing evidence. Link to detailed records only where needed.
- Maintain one decision record and one evidence record. Capture timings and counts automatically where existing tooling allows it; generate summaries from the records instead of transcribing them repeatedly. Add a small helper only if the repeated work justifies one.
- Route shared-layout findings to their actual owner and check the other articles affected by the shared change.

**Later process refinements:**

- Translate a bare topic into a concrete commission: audience, starting knowledge, useful outcomes and boundaries. Infer reasonable defaults; ask only when an ambiguity materially changes the collection.
- Keep the tree provisional while writing reveals better boundaries. Where the topic or teaching approach is unfamiliar, use an introduction and a demanding article to test it before expanding the entire collection. This is an option, not a compulsory two-article gate on every commission.
- Integrate proposed tree and example changes centrally. A planning-only commission still returns a complete reviewed plan without drafting articles.
- Keep corpus review focused on reading journeys, gaps, overlap and cross-article consistency, using existing article evidence rather than automatically repeating every local test.
- Reference the review skill for the review procedure and acceptance rule; remove duplicated round and floor instructions when those change.

## 4. staycurrent-continuity

- Retain the canonical example record and the explicit check that terms are explained before the reader needs them. These address demonstrated failures.
- Keep one maintained ledger per article, linked to the collection record. Repairs record changes and the audit result rather than copying every unchanged entry.
- Check downstream uses when a definition, example, name or section moves. A local textual change can have non-local consequences; a changed-lines-only check is insufficient.
- Coordinate cross-article example changes centrally and identify affected articles and figures.
- Generalise the core instruction for different subjects. A shared example may contain a system, scenario, quantities or notation; tables, people and starting rows are appropriate for the relational collection, not compulsory for every topic.
- Remove trial narratives from the operational skill while retaining their evidence in the work records.

## 5. staycurrent-figures

- Separate checks of teaching meaning from checks of mechanics. Fresh reviewers still inspect the rendered figures and judge whether their states, labels, examples and placement teach the intended idea.
- Reuse verified shared components and unchanged mechanical evidence. Recheck when relevant markup, styles, text, data, component dependencies or environment changes. Text changes can invalidate layout, playback timing and accessibility evidence.
- Use automated checks where they reliably establish mechanics. Screenshots or passing scripts do not replace judgement about legibility and explanation.
- Retain native evidence, counterexamples for claimed protections, illustrative/observed labels, phone and theme checks, keyboard access and text alternatives. Reuse evidence only when it supports the current claim and version.
- Keep the root skill about choosing, designing and assessing teaching media. Move substantial stepper API details and database-specific verification procedures into a directly linked reference loaded when applicable; preserve the actual requirements.
- State one consistent principle across writing and figures: choose the form that reduces the reader's effort. Diagrams, animation and interaction should carry useful explanation; there is no quota or universal preference for interaction.
- Replace the blanket three-column prose-table rule with the actual requirement: readable material within the article width, using cards or another form when the table fails. Retain the clipping case as evidence rather than a universal column limit.

## 6. staycurrent-write

Keep this skill small. Do not add a handbook, mandatory paragraph formula, annotated reference collection or another preliminary review stage by default.

- Retain the reference articles, commission, relevant neighbouring scopes, shared example and primary-source requirements.
- Replace vague or overlapping prose guidance with a short statement of the desired explanation. Candidate wording:

> Build a connected explanation in which each idea gives the reader what they need for the next. Use concrete examples to make mechanisms and consequences understandable, and help the reader draw the judgement the article promises. Let the subject determine the form and depth. Every detail should contribute to that understanding; place qualifications where they change the reader's interpretation or decision.

- Plan the prose and teaching media together. Introduce what the reader should notice and interpret the result; use the figures skill for implementation and checking.
- Preserve the writer's ability to propose changes to headings and article boundaries. Coverage is an obligation; the plan's wording is provisional.
- Keep the whole-piece reread before returning a substantial draft, with continuity and evidence checks appropriate to the work.
- Refer to the review skill for standalone review without duplicating its procedure.

These changes are about first-draft quality and should be evaluated separately from the first review-speed experiment.

## 7. staycurrent-breakdown

- Keep the current compact YAML structure. Add the necessary information to briefs rather than expanding the schema without a demonstrated need.
- Make each article's contribution explicit: what readers bring, what question it resolves, what they leave able to explain or do, and where deeper treatment belongs.
- Establish a reading journey as well as a subject hierarchy. Identify real prerequisites and handoffs without making every reader traverse every branch.
- Stop decomposition when the commissioned outcomes are covered at useful article boundaries. A topic's further subtopics do not automatically justify additional articles.
- Name the concrete example or teaching form for difficult ideas while leaving the writer room to choose a better implementation.
- Keep references and sections proportional to their subject. Do not impose uniform article lengths or a hard word budget.

## Supporting files and shared rules

The review perspective files need small coordinated edits. Their criteria remain distinct. Teaching should assess whether additions improve the explanation as well as whether they belong to its scope; editorial should judge clarity and coherence rather than mechanically reject a sentence form; visual should distinguish fresh semantic judgement from reusable mechanical evidence. Practitioner evidence should be traceable to current claims. Value continues to assess what the reader loses if material is cut. Do not add a fifth article reviewer in the first experiment.

Keep descriptions short and specific. State each rule in its owning skill and link to it where necessary. Move historical trial explanations into work records, but do not move all existing text into compulsory references and call that simplification. Create supporting files only for substantial conditional detail.

Keep `AGENTS.md` and the README consistent with the skills. Preserve British English, the fixed references, fresh independent assignments, technical evidence and publication boundaries. If worker reuse is later adopted, explicitly amend the fresh-assignment rule in both `AGENTS.md` and orchestration; do not quietly contradict it inside revision guidance.

Preserve existing historical reports. Future records can be compact and generated without rewriting the evidence from earlier trials.

## Ideas discussed but not part of the initial change

- Reducing or merging the four initial article perspectives.
- Reusing reviewers or writers across assignments.
- Replacing repeated whole-page reviews with focused checks before testing the effect on detection.
- A fixed word budget, mandatory writing templates, or a new reference handbook.
- A fixed worker allocation, wholesale planning redesign, or a six-article production trial as the first speed experiment.
- Separate Sol and Astra versions of the skills without observed differences that justify them.
- A promised 40–45 minute delivery time. The other agent's estimate is a target to investigate, not a measured saving.

## Validation and implementation boundary

For the first comparison, reuse a frozen initial draft and keep the model, reasoning effort, reviewer coverage and acceptance policy fixed. Do not regenerate the articles. Change only scheduling, preparation, record handling and evidence reuse, with the minimal related changes to review and revision instructions.

Measure wall time, assignment time, tool operations, repeated checks, substantive defects found, repair-induced defects and unresolved defects in the finished artifact. Use the same quality judgement for both outputs; a lower finding count alone does not demonstrate improvement. Separate execution failures from editorial work, and avoid causal claims from a single run.

Test acceptance and narrower rechecks separately. A faster run that misses the rollback detour, unexplained terms or inaccessible phone controls is not sufficient. Use those known problems as targeted checks, while withholding the answers from independent readers. Broader transfer beyond the two relational articles remains to be established.

When implementing, validate skill frontmatter, links, ownership and conflicting instructions. A skill validator establishes structure, not writing quality. Behavioural testing should exercise the changed decisions. Keep the active skills and articles unchanged until implementation is commissioned.

## Research informing the proposal

- [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra): supports narrow descriptions, relevant context and revisiting elaborate recipes and repeated preparation. It does not establish that fewer editorial reviews preserve quality.
- [GPT-6 prompting guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices): recommends explicit writing preferences and proportionate verification. The family guidance includes Sol 6.1, but its behavioural observations are primarily about Astra and require workload-specific evaluation.
- [Build skills](https://learn.chatgpt.com/docs/build-skills): supports focused skills, progressive disclosure and instruction-only implementations where additional tooling is unnecessary.
- [Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills): supports a small set of outcome, style and efficiency checks.
- [Maintaining software with the GPT-6 family](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family): offers the useful method of replaying the same task with one instruction removed or corrected. Its software-maintenance results are not measurements of this writing process.
