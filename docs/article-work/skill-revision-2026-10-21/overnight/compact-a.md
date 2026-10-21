# Compact A candidate

Prepared 21 October 2026. This is an isolated compaction candidate, not an active-skill change or publication. No builds, servers, article/preview changes, commits or pushes were performed. No article drafts or overnight review findings were read; no team was arranged.

Source is the seven current skills and five perspective files, overlaid with every changed file in `candidates/a/.agents/skills/`. The complete candidate is `candidates/compact-a/.agents/skills/`; it does not depend on the active skill text or on the Phase A overlay at execution time. Existing repository-asset links retain their intended installed `.agents/skills/` paths so the snapshot can be copied into a staging checkout without rewrites. Such links resolve against the repository when installed; they are not physically relative to this deeply nested archival folder.

Applied Skill Creator's guidance to assume a capable model, keep actual constraints in entrypoints and disclose only substantial conditional technical detail progressively. Removed historical trial narratives, repeated rationales and assignment prompt scaffolding. Reworded the five perspective files while retaining all existing numbered checks in their existing order. Added no teaching template, word budget, checklist, acceptance criterion or later stable-acceptance/focused-check policy.

## Preserved decisions

- The commission's common expertise goal and reader-effort objective govern every article; child articles do not acquire a separate specialist goal. Subject depth determines coverage/proportion, and the plan remains distinct from available reading.
- The orchestrator still owns the canonical tree and integration. Every assignment, repair and later review uses a fresh subagent. Workers do not arrange review teams; standalone breakdowns/articles still manage the prescribed reviews. Scope/publication choices go to the user; routine review decisions remain with the coordinator.
- Breakdown YAML retains `topic`, `title`, `brief`, recursive singular `heading`, and heading-owned `nested_article` stubs with only `topic`, `title`, `brief`. Child headings are commissioned separately; root example agreement precedes child planning. The minimal nested YAML example retains both recursion and a child stub.
- Modes and perspective coverage are unchanged: breakdown/tree = practitioner, value, teaching; article = practitioner, teaching, editorial, visual with the existing round schedule; corpus = practitioner, value, teaching, editorial. All original perspective checks and the report's fields, per-check result row, visual First reading and Limits remain. Numbering continues across rounds while reviewers receive no earlier findings.
- Severity definitions are verbatim. The repair floors remain all severities in round 1, critical/medium in round 2, critical from round 3. Below-floor decisions are recorded, critical problems are always repaired, and a clear round ends review subject to the existing article-mode editorial/visual completion requirement. Round 3 remains the last full round, followed by the existing fresh finding-perspective critical-repair rechecks. This is the Phase A stopping policy, not the later experiment.
- Whole-article reading remains mandatory for first drafting and before/after repair, including contents, captions and controls. Repairs retain local/proportionate changes for low/medium findings and critical-only section restructuring where necessary. Writers still read all three fixed reference articles in full, including figures; repairs may recalibrate from relevant passages without reloading every reference. No new writing-quality instruction was introduced.
- Canonical example records and per-article term ledgers retain complete reading-order audits on drafts and repairs, first-use/explanation records, cross-article example ownership, shared data modules and downstream invalidation.
- Consequential correctness still uses primary sources; observed execution must match version/command evidence and unrun commands cannot be presented as observed. Evidence reuse remains dependency-bound to relevant source, data, environment and verifier; text may invalidate meaning, layout or timing. Reports and ledgers are linked rather than repeatedly copied. Shared-layout findings still require checking all affected articles.
- Review versions/previews remain frozen behind a manifest and one build owner. Editorial input exclusions remain independent of plan, approvals, repair history and writer notes. Visual reviewers still inspect freshly rendered items before prose and use controls, even when mechanical evidence is reused.
- Figure rules retain real columns/relations, shared example data, key relationships, static-versus-interactive selection, outcome text alternatives, model/observation labels and boundaries, themes/375 px/contrast requirements, every option and keyboard checks. Only stepper API/markup and database verification detail moved to two directly linked references, loaded for their applicable figure types. Database anti-cases and dependency-valid receipts remain required.

## Observed scope correction

The coordinator separately supplied a narrow observed input-boundary correction while this task was running: mechanical receipts must exclude author teaching notes and earlier quality verdicts as well as earlier review findings. The candidate therefore requires extraction of relevant mechanical records/provenance from mixed writing records. This appears in orchestrator handoffs, review evidence rules and visual inputs. It is an intentional scope correction, not wording-only compaction; it preserves independent semantic judgement while allowing mechanical evidence reuse. No underlying overnight findings were opened to derive it.

## Ambiguity and limits

No ambiguity prevented a faithful candidate. Phase A says both that every round is a full review and that round 3 is the last full round followed by limited critical-repair rechecks. The candidate retains the specific post-round-3 exception and makes its relationship to the general full-round rule explicit, without changing the affected passages, surrounding-section reading, fresh-reviewer requirement or repetition-until-pass rule. It does not introduce a new repair-only policy for earlier rounds.

Validation establishes structure and linkability, not behavioural equivalence. Controlled behavioural testing is still required and was not run by this assignment.

## Counts

Counts use whitespace-separated words, including frontmatter, YAML examples and report-template text. All instruction files are included; nothing is omitted as “optional” from the candidate total.

| Instruction category | Composite Phase A | Compact A |
| --- | ---: | ---: |
| Seven skill entrypoints | 5545 | 2933 |
| Five mode-selected perspective files | 1546 | 829 |
| Two conditional technical references | 0 | 216 |
| **All entrypoints + references** | **7091** | **3978** |

Total reduction: **3113 words (43.9%)**. Candidate contains 7 entrypoints + 7 conditional/mode-selected reference files = 14 Markdown files. References comprise the 5 existing perspectives and 2 new technical references; no mandatory prose annex was added.

| File | Composite Phase A words | Compact A words |
| --- | ---: | ---: |
| `staycurrent-breakdown/SKILL.md` | 475 | 291 |
| `staycurrent-continuity/SKILL.md` | 556 | 257 |
| `staycurrent-figures/SKILL.md` | 1055 | 361 |
| `staycurrent-figures/references/database-verification.md` | 0 | 97 |
| `staycurrent-figures/references/stepper.md` | 0 | 119 |
| `staycurrent-orchestrate/SKILL.md` | 991 | 596 |
| `staycurrent-review/SKILL.md` | 1381 | 856 |
| `staycurrent-review/perspectives/editorial.md` | 239 | 147 |
| `staycurrent-review/perspectives/practitioner.md` | 256 | 134 |
| `staycurrent-review/perspectives/teaching.md` | 325 | 183 |
| `staycurrent-review/perspectives/value.md` | 229 | 109 |
| `staycurrent-review/perspectives/visual.md` | 497 | 256 |
| `staycurrent-revise/SKILL.md` | 722 | 316 |
| `staycurrent-write/SKILL.md` | 365 | 256 |

## Validation

- Skill Creator `quick_validate.py` passed for all seven candidate skill folders.
- Every Markdown link resolved either within the snapshot or at its intended repository installation location; no unresolved targets.
- Manual comparison against the composite source covered the semantic decisions above, all 29 perspective checks (5 practitioner, 5 value, 7 teaching, 7 editorial, 5 visual), all four modes, report fields, severity/floor/stopping policy, reference standard and evidence boundaries. No perspective check was removed or added.
- Full unified diff below compares the composite source, not merely current active skills. It includes both added technical references and every modified instruction file.

## Full diff

```diff
--- a/.agents/skills/staycurrent-breakdown/SKILL.md
+++ b/.agents/skills/staycurrent-breakdown/SKILL.md
@@ -3,15 +3,11 @@
 description: Plan one article from its topic and brief as a heading outline, with stubs for the deeper articles it introduces.
 ---
 
-A breakdown decides what one article teaches and which deeper subjects it hands on to nested articles. The aim is the commission's: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. This article contributes its share of that goal; it does not set a new goal of specialist mastery in its own topic.
+Plan this article's contribution to the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A child does not set its own specialist target.
 
-Start from what a practitioner needs, not from existing pages. Work out the decisions, failure cases and practical judgement this article must give the reader, checking consequential points against primary sources and standard texts, and record them in the brief as its intended outcomes. Then read any existing articles and the surrounding plan. They can supply material and show what neighbours already teach, but they do not set the scope.
+Start with practitioners' decisions, failure cases and practical judgement, checking consequential points against primary sources and standard texts. Record these intended outcomes in the brief. Then read existing articles and surrounding plans for material and neighbouring coverage; they do not set scope. Let subject depth determine length and form; keep a subject as a section when that serves the reader better than another page.
 
-The subject sets the depth. A shallow subject may be taught fastest as a short catalogue of examples, common cases and corner cases; a deep one may need its mechanism opened up. Never pad or trim a section to match its neighbours.
-
-Return the article's `title`, `brief` and a recursive `heading` list. Place each `nested_article` under the heading that introduces it, with only that child's `topic`, `title` and `brief`; its own headings come from a separate breakdown. Keep a subject as a section wherever that serves the reader better than another page to open.
-
-Titles and headings are for readers, so write them as they would appear on the page. Teaching instructions and intended outcomes belong in the briefs. Where a section's idea is hard to hold in the head, such as changing state, data spread across tables or a sequence of events, its brief names the example, figure or table that will show it, so teaching review can check the plan before anything is built. Draw examples from the collection's example record ([staycurrent-continuity](../staycurrent-continuity/SKILL.md)); if this article needs something the record lacks, propose the extension with the breakdown. A root breakdown proposes the record itself. The writer polishes the final wording, so aim for clear rather than final.
+Return `topic`, `title`, `brief` and a recursive singular `heading` list. Under the heading introducing a child, place `nested_article` with only its `topic`, `title` and `brief`; commission that child's headings separately. Titles/headings are reader-facing; instructions and outcomes belong in briefs. Hard-to-picture ideas need a named example, figure or table in their brief for teaching review. Use the collection's [example record](../staycurrent-continuity/SKILL.md), proposing missing extensions; the root proposes the record. The writer polishes final wording.
 
 ```yaml
 topic: Relational indexes
@@ -19,16 +15,16 @@
 brief: Explain how indexes work and what they cost.
 heading:
   - title: How an index finds a row
-    brief: Follow one lookup from key to table page, counting the pages read.
+    brief: Follow a lookup from key to table page, counting pages read.
   - title: Write cost and upkeep
     brief: Follow changes through the indexes.
     heading:
       - title: Building and removing indexes
-        brief: Introduce the operating decisions before offering deeper reading.
+        brief: Introduce operating decisions before deeper reading.
         nested_article:
           topic: Index maintenance
           title: Maintaining indexes
           brief: Teach how to inspect, rebuild and remove indexes safely.
 ```
 
-When the orchestrator manages review, return the YAML as a draft. Otherwise review it with [staycurrent-review](../staycurrent-review/SKILL.md) in breakdown mode, repair the findings and return the reviewed YAML.
+For orchestrator-managed review, return draft YAML. Otherwise arrange breakdown-mode [review](../staycurrent-review/SKILL.md), repair findings and return reviewed YAML.
--- a/.agents/skills/staycurrent-continuity/SKILL.md
+++ b/.agents/skills/staycurrent-continuity/SKILL.md
@@ -3,22 +3,14 @@
 description: "Keep what a reader carries through a collection consistent: the shared running example, and every term explained before it is used. Run the pass before returning any draft or repair."
 ---
 
-A reader builds on two things from page to page: the example they already know, and the words they have already been taught. Both break quietly. A writer who knows the subject does not notice using "snapshot" or "row lock" before explaining it, and a writer working on one article cannot see that a neighbour named the same people differently. In the 2026-10-20 skill trial, nine terms were used before their explanation across two pages, three perspectives raised it, and repairs reintroduced it. The same trial's a03 switched its example from the shop's stock to class bookings to match its children, and a child already used the shop's customers as instructors. The figures skill's consistency rule caught this only after the fact, because it works within one article.
+Keep one collection example record beside its tree at `docs/coverage/<collection>-example.md`: people/roles, tables/keys/starting rows, article-specific extensions and their correspondence to the core example. The orchestrator settles it with the root breakdown before child planning and gives it to every planner/writer. Briefs use that record. Propose and follow missing extensions for central integration; a standalone writer extends the record directly and reports it.
 
-## The collection's running example
+Figures use recorded rows. Shared rows across articles live in one module imported by their model files.
 
-Each collection keeps one example record beside its tree, at `docs/coverage/<collection>-example.md`. It names the people and their roles, the tables with their keys and starting rows, and any extension a particular article adds, such as class bookings for the transactions article, with what each part stands for in the core example.
+Before returning every draft or repair, audit the complete reading order, including captions, controls and step text:
 
-The orchestrator writes it with the root breakdown, before any child is planned, and gives it to every planner and writer. Briefs refer to parts of the record rather than inventing their own examples. When an article needs something the record lacks, the writer proposes an extension and keeps to it, and the orchestrator merges it like any other tree change. A standalone writer extends the record directly and says so.
+1. List each technical term's first-use sentence and explanation sentence. Fix unexplained or late-explained terms by explaining at first use, moving use or using plain words. A previously taught term needs a reminder/link and an explicit statement that this article builds on that earlier article.
+2. Keep one name per term, protection, option and person, with control labels matching prose.
+3. Check names, keys, rows and values against the example record, and outcomes against earlier figures.
 
-Figures take their rows from the record. Where several articles' figures share rows, keep them in one module that each article's model file imports.
-
-## The pass
-
-Run this before returning a draft or a repair. It is a list rather than a reread, because a reread is exactly where an expert's own vocabulary goes unnoticed.
-
-1. **Terms.** Go through the article in reading order, including figure captions, controls and step text, and list each technical term with the sentence where it first appears and the sentence that explains it. Fix every term used first and explained later, or never: explain it where it first appears, move the use after the explanation, or use plain words instead. A term an earlier article on the reader's route explains may be used with a short reminder and a link, but only if the article says it builds on that one.
-2. **One name per thing.** Each term, protection, option and person has one name throughout, and control labels match the prose.
-3. **The example.** Check every name, key, row and value against the example record, and every outcome against earlier figures. An order refused in one figure must not appear as accepted in a later one.
-
-Maintain one term ledger per article in the work record, linked to the collection's example record. On repair, audit the complete reading order again, update changed entries and record the audit result rather than reproduce unchanged entries. When a definition, name or example moves or changes, check its downstream uses and affected articles and figures; send cross-article example changes to the orchestrator.
+Maintain one term ledger per article in its work record, linked to the example record. On repair, repeat the complete audit, update changed entries and record the result without duplicating unchanged entries. When definitions, names or examples move/change, check downstream uses and affected articles/figures; send cross-article example changes to the orchestrator.
--- a/.agents/skills/staycurrent-figures/SKILL.md
+++ b/.agents/skills/staycurrent-figures/SKILL.md
@@ -3,66 +3,16 @@
 description: Design and build the figures, tables, code listings and interactive tools in an article, and check them on the rendered page before returning.
 ---
 
-Figures carry the explanations a reader would otherwise have to hold in their head: state that changes, rows that connect, two outcomes side by side. A good figure lets the reader change a cause and watch the result. A bad one looks accurate and still has to be decoded. This skill covers choosing, building and checking them. The figures in [Sequence diagrams](../../../src/reference-articles/sequences.astro), [Indexes](../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../src/reference-articles/storage.astro) are the standard.
+Show the state, relationships or outcomes the reader would otherwise hold in their head. Use the figures in [Sequence diagrams](../../../src/reference-articles/sequences.astro), [Indexes](../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../src/reference-articles/storage.astro) as the standard.
 
-## Choose the form
+Choose from the reader's question: static tables/listings for data/code, steps for sequences, options for comparisons. Use interaction only when it teaches more than a static example.
 
-Start from the reader's real question at that point in the article and the state they would otherwise have to picture alone. Then pick the form that shows that content most directly:
+Show example data under real column headings, one table per relation and one kind of value per column; do not pack columns into `name = value` cells. Mark primary/foreign keys and draw relationships. Use the [example record](../staycurrent-continuity/SKILL.md) and one shared article model file for all figures. Keep recurring rows/keys/names/values consistent and caption-named columns present.
 
-- **A static table or listing** when the reader needs to see data or code as it is. Most examples are this.
-- **A stepped figure** when the point is a sequence: what happens first, what changes, and what the reader sees after each step.
-- **A figure with options** when the point is a comparison: the same steps under two choices, such as separate commits against one transaction.
+For Play/Back/Next figures, use the shared stepper and read [stepped figures](references/stepper.md). Each step adds information, marks changed values and follows the chosen option's labels; end on the outcome without a repeated final step.
 
-Interaction must earn its place. If a static example teaches as well, use it.
+Check at 375 px and in light/dark themes: stack comparisons, keep headings unbroken within names and prevent article-column overflow. Sentence tables with more than about three columns use labelled row cards at every width. Use site colour tokens. Body text—including warnings, NULL markers and dimmed rows—needs 4.5:1 contrast; large text/graphics need 3:1. Give interactive figures a “Read this figure as text” outcome summary.
 
-## Show example data as the reader will meet it
+Label illustrative models versus observed system results in captions and boundary notes stating omissions; never present unrun commands as observed. For database behaviour, read [database verification](references/database-verification.md). Keep evidence in one index with receipt links, reusing it only while relevant source, data, environment and verifier remain applicable.
 
-- Rows sit under their real column headings, one small table per relation. Never pack a relation's columns into one cell as `name = value` lists.
-- Each column holds one kind of value. If a reader has to decode a cell, the form is wrong.
-- Mark primary and foreign keys, and draw relationships rather than describe them.
-- Keep the running example consistent from figure to figure and from article to article. Take its people, rows, keys and values from the collection's example record ([staycurrent-continuity](../staycurrent-continuity/SKILL.md)), keep them in one model file that every figure imports, and make sure a column named in a caption exists in the tables.
-
-## Build stepped figures on the shared stepper
-
-Use [stepper.mjs](../../../src/components/figures/stepper.mjs) for any figure with Play, Back and Next. Give it the figure's root element, a `steps()` function and a `draw(step)` function; call the returned `render` when an option changes. The markup it expects:
-
-| Attribute | Element |
-| --- | --- |
-| `data-play`, `data-back`, `data-next`, `data-reset` | The four buttons |
-| `data-step` | The "2 / 5" counter |
-| `data-hold` | The hold bar, containing one `span` |
-| `data-live` | Every part whose text changes between steps |
-| `data-explanation` | The sentence that says what this step shows, with `aria-live="polite"` |
-
-The stepper handles timing and keyboard use:
-
-- **Timing.** While playing, each step is held long enough to read the text that changed at that step, not all the text on screen. The reader can pause at any time and step by hand. Mark every changing part with `data-live` so the timing sees it.
-- **Keyboard.** Back and Next use `aria-disabled` at the ends rather than `disabled`, so focus stays on the button the reader was using.
-- **Reduced motion.** The hold bar does not animate when the reader asks for reduced motion.
-
-Each step should show something new. End on the step that shows the outcome, not on a step that repeats the one before. Mark values that changed at a step, and let step labels follow the option the reader chose.
-
-## Make it readable everywhere
-
-- **Phones.** Check at 375 px. Side-by-side comparisons stack, column headings do not break inside a name, and nothing overflows the article column.
-- **Prose tables.** A table whose cells are sentences fits only about three columns in the article column. With more, show each row as a labelled card at every width; a table that stacks only on phones still clips on a desktop once its text grows, as the trial's "Choosing a protection" table did.
-- **Themes.** Use the site's colour tokens; the build rejects raw colour values. Check light and dark themes.
-- **Contrast.** Body text needs at least 4.5:1 against its background, and large text and graphics at least 3:1. Warnings, NULL markers and dimmed rows count as body text.
-- **Text alternative.** Give each interactive figure a "Read this figure as text" summary that states the outcomes.
-
-## Say what the figure is
-
-Label each figure as an illustrative model or as results observed from a real system, in its caption and in a boundary note that says what it leaves out. Never present an unrun command as observed.
-
-When a figure shows database behaviour, keep its data and outcomes in a model file and check them against a real database with a verification script, as the relational introduction does in [verify.mjs](../../../src/components/relational-next/a00/verify.mjs). Run it against a disposable local server, and record the version and command in the work record. Reuse a prior run only while the relevant source, data, environment and verifier still apply to the current claim; otherwise rerun the affected checks. Keep one evidence index and link to receipts instead of copying unchanged logs.
-
-A script passes easily when the example data cannot show the failure. In the 2026-10-20 trial, both verification scripts passed while a move listing could still overbook and a `FOR UPDATE` claim was false, because the example data happened to hide both failures. For each protection a figure or listing claims, include a case that would fail if the protection were missing, with data chosen so that the failure is visible, such as a capacity where a missed recheck overbooks.
-
-## Check before returning
-
-Use the designated preview/build owner for builds and a fixed preview; for standalone work, own both. Open the built page in a visible browser window. In a hidden pane, animation runs at about one frame a second and screenshots can be stale; if you cannot see the window, check timing from the page's timers and say so. Then:
-
-1. Look at each figure before reading its prose, and note what it seems to show. Fix anything that does not stand on its own.
-2. Play each stepped figure through every option, and step through it by keyboard.
-3. Check it at 375 px and in both themes.
-4. Read every caption and label against what the figure shows.
+Use the designated preview/build owner and fixed preview; standalone workers own both. Open the built page in a visible browser. Hidden panes may animate at about one frame per second with stale screenshots; if hidden, check timing from page timers and report that limit. Before reading prose, inspect each figure and record what it seems to show; fix items that do not stand alone. Play every option, check keyboard stepping, both themes and 375 px, and compare every caption/label with its displayed content.
--- /dev/null
+++ b/.agents/skills/staycurrent-figures/references/database-verification.md
@@ -0,0 +1,5 @@
+# Database verification
+
+Keep figure data/outcomes in a model file and check them against a real database using a verification script, as in [verify.mjs](../../../../src/components/relational-next/a00/verify.mjs). Run against a disposable local server; record version and command in the work record and link the canonical evidence receipt. Reuse a run only while relevant source, data, environment and verifier still apply to the current claim; otherwise rerun affected checks.
+
+For every protection claimed by a figure or listing, include a case that would fail without that protection, choosing data that makes failure visible—for example, a capacity where a missed recheck overbooks.
--- /dev/null
+++ b/.agents/skills/staycurrent-figures/references/stepper.md
@@ -0,0 +1,13 @@
+# Stepped figures
+
+Use [stepper.mjs](../../../../src/components/figures/stepper.mjs) with the figure root, `steps()` and `draw(step)`; call returned `render` when options change.
+
+| Attribute | Element |
+| --- | --- |
+| `data-play`, `data-back`, `data-next`, `data-reset` | Four buttons |
+| `data-step` | Step counter, e.g. “2 / 5” |
+| `data-hold` | Hold bar containing one `span` |
+| `data-live` | Every part whose text changes between steps |
+| `data-explanation` | Step explanation with `aria-live="polite"` |
+
+Playback holds each step long enough to read changed text, with pause and manual stepping always available. Mark all changing text `data-live` so timing sees it. Back/Next use `aria-disabled` at the ends to retain focus. The hold bar does not animate under reduced motion.
--- a/.agents/skills/staycurrent-orchestrate/SKILL.md
+++ b/.agents/skills/staycurrent-orchestrate/SKILL.md
@@ -3,64 +3,30 @@
 description: From a topic and brief, plan a recursive article tree, then coordinate its review, writing and repair.
 ---
 
-An orchestrated commission turns one topic and brief into a reviewed tree of articles and, when commissioned, the written articles. The goal throughout is the commission's: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Every article serves that one goal; a nested article does not set its own expertise target. Run only the stages the commission asks for.
+Serve the commission's goal: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Each article contributes to that goal, without setting a separate specialist target. Run only commissioned stages.
 
-The orchestrator owns the tree, the schedule, review and integration. Workers (planners, writers and reviewers) complete one assignment and return, and every assignment goes to a fresh subagent, including repairs and later review rounds. A worker who has seen earlier rounds carries their blind spots forward; everything a fresh one needs is in the plan, the work record and the piece itself. Keeping review with the orchestrator means workers never wait for review capacity and reviewers can compare pieces across a batch, so workers never start review teams of their own; an assigned reviewer performs its perspective directly.
+The orchestrator owns the tree, scheduling, review and integration. Every planning, writing, repair and review assignment goes to a fresh subagent and ends on return. Workers never arrange review teams; assigned reviewers perform their perspective directly. Apply [staycurrent-review](../staycurrent-review/SKILL.md) for the fixed modes, inputs, reports, severity floors and stopping policy. Resolve disagreements against the commission and record why; bring the user genuine scope or publication choices.
 
-When perspectives disagree, for example completeness against value, decide against the commission's goal and record the reason. Bring the user genuine choices of scope or publication, not routine review decisions.
+## Records and review inputs
 
-[staycurrent-review](../staycurrent-review/SKILL.md) fixes which perspectives run at each stage, what each reviewer receives and the shape of its report. Follow it as written rather than choosing perspectives per run, so that reviews stay comparable across commissions.
+Keep one canonical YAML tree under `docs/coverage/`, its [example record](../staycurrent-continuity/SKILL.md) beside it, and a work record under `docs/article-work/`. Retain the commission, piece/version/status, assignments, start/end, original review reports, findings, decisions, changed locations, verification and limitations. Keep one decision ledger and one evidence index; link unchanged records rather than copy them. Map duplicate observations to one issue while preserving each report.
 
-## Keep the record
+Designate one preview/build owner; workers request builds from that owner. Freeze review inputs and preview only when articles, components, shared shell and applicable evidence agree. A manifest identifies the complete version, preview and dependencies. Evidence identifies relevant source, data, environment and verifier versions; reuse it only while they remain applicable. Text changes may invalidate technical meaning, layout or playback timing.
 
-Keep one canonical YAML tree under `docs/coverage/`, the collection's example record beside it ([staycurrent-continuity](../staycurrent-continuity/SKILL.md)), and a work record under `docs/article-work/` with the commission and each piece's draft and review status. Keep original review reports, one decision ledger and one evidence index; link to them instead of copying inventories or unchanged decisions into handoffs. Record assignment, version, start/end, findings, decisions, changed locations, verification and limitations. Map duplicate observations to one issue while retaining each perspective's report.
+Handoffs give task, version, relevant context and evidence links within the perspective's permitted inputs. Editorial receives no plans, repair history or writer's notes. Mechanical receipts exclude author teaching notes, earlier quality verdicts and review findings; extract relevant mechanical records and provenance from mixed writing records. Dispatch ready commissioned work as slots free up, starting long visual work early; do not commission extra reviews to occupy slots. Combine each piece's findings before repair. Route shared-layout findings to their owner and check every affected article.
 
-## Prepare and schedule review
+## Planning
 
-Name one owner for both the preview and builds; the coordinator can own them. Workers request a build from that owner rather than run concurrent builds into the same output directory. Freeze review inputs only when articles, components, shared shell and applicable evidence agree. Identify the complete input version, preview and dependencies in a manifest, and keep that preview unchanged during its reviews. Include relevant source, data, environment and verifier versions with evidence; reuse it only while those remain applicable. Text changes can invalidate layout, playback timing or technical meaning.
+Give each fresh planner its topic and brief, commission and expertise goal, parent/neighbouring briefs and example record. Apply [staycurrent-breakdown](../staycurrent-breakdown/SKILL.md), returning YAML for orchestrator-managed batched review. Settle the root's proposed example record before planning children.
 
-Handoffs state the task, version, relevant context and evidence links, restricted to the perspective's permitted inputs. Editorial receives no plans, repair history or writer's notes. Dispatch ready commissioned perspectives as slots free up; start long visual/browser work early. Do not commission extra reviews simply to fill slots. Combine a piece's findings before repair. Route shared-layout findings to their owner and check every affected article.
+Review breakdown batches in breakdown mode. Give each piece's findings and breakdown to a fresh planner, then fresh reviewers. Merge accepted breakdowns and example extensions centrally, and commission each `nested_article` stub until none remain.
 
-## Plan the tree
+Review the complete tree and commission in tree mode with fresh reviewers who have no batch-review history. Reconcile findings, return changed parts through breakdown and review, and recheck affected findings before writing. A planning-only commission returns the reviewed tree here.
 
-Start from the commission's topic and brief, and give ready assignments to fresh planners as slots free up. Give each planner:
+## Writing and integration
 
-- its topic and brief;
-- the commission's topic, brief and expertise goal;
-- relevant parent and neighbouring briefs;
-- the example record. For the root breakdown, ask for a proposed record and settle it before planning any child.
+Give each fresh writer its topic, title, brief and headings; children's briefs, headings, introduction points and finished articles; parent/neighbouring scopes; existing linkable articles; example record; and commission/expertise goal. Apply [staycurrent-write](../staycurrent-write/SKILL.md), returning the draft and proposed tree changes for batched article review.
 
-> Apply [staycurrent-breakdown](../staycurrent-breakdown/SKILL.md) to this assignment and context. Return the YAML breakdown for orchestrator-managed batched review.
+Review fixed article versions with perspective-specific inputs and a rendered preview for visual review, plus isolated figure routes where available. Reconcile findings, then give the article, plan context, work record and accepted problems together to a fresh writer using [staycurrent-revise](../staycurrent-revise/SKILL.md). Even a one-phrase prose fix uses that skill. Review repairs under the review skill's policy, retaining separate reports. Merge tree/example changes centrally and update affected articles.
 
-Review returned breakdowns in batches in breakdown mode. Give the findings for each article, with its breakdown, to a fresh planner, then review the changed breakdown again with fresh reviewers. Use free slots for ready planning or commissioned review.
-
-Merge accepted breakdowns into the tree, and accepted example extensions into the record, and queue each `nested_article` stub for its own breakdown. Repeat until no stubs remain.
-
-## Review the tree
-
-Give the complete tree and the commission to fresh reviewers in tree mode. Fresh reviewers see the tree as a whole, without the history of individual batches. Reconcile findings across the tree, send changed parts back through breakdown and review, and recheck the affected findings before writing starts. A planning-only commission ends here: return the reviewed tree.
-
-## Write the articles
-
-Give each article to a fresh writer with:
-
-- its topic, title, brief and headings;
-- its children's briefs and planned headings, where each is introduced, and any finished child articles;
-- parent and neighbouring scopes;
-- existing articles it can link to;
-- the example record;
-- the commission's topic, brief and expertise goal.
-
-> Apply [staycurrent-write](../staycurrent-write/SKILL.md) to this article plan and context. Return the article for orchestrator-managed batched review, with any proposed tree changes.
-
-Review written articles in batches in article mode, giving each reviewer only the inputs its perspective file lists. Visual reviewers need a rendered preview of the fixed version, with isolated figure routes where you can provide them. Reconcile the findings and give them together to a fresh writer, with the article, its plan context and its work record, as problems to solve rather than wording to insert:
-
-> Apply [staycurrent-revise](../staycurrent-revise/SKILL.md) to this article and these accepted findings. Return the repaired article and its work record.
-
-Send even a one-phrase fix back through that skill rather than making it yourself: a phrase changed in isolation is how patches accumulate. After repair, review again with fresh reviewers as [staycurrent-review](../staycurrent-review/SKILL.md) describes, which also sets the severity floor that decides which findings each round repairs and when review ends. Keep each perspective's report separate. Merge proposed tree and example changes centrally and update the articles they affect.
-
-## Review the corpus
-
-Give the assembled articles and tree to fresh reviewers in corpus mode. Send findings to fresh writers for repair and review the repaired articles again with fresh reviewers. Return the tree, article locations, review outcomes and any unresolved work.
-
-Reviewed drafts are not published reading. Keep them distinct from available articles; publication needs the user's authorisation.
+Review the assembled articles and tree in corpus mode with fresh reviewers. Send repairs to fresh writers and review repaired articles again. Return the tree, article locations, review outcomes and unresolved work. Keep reviewed drafts distinct from available reading; publication requires user authorisation.
--- a/.agents/skills/staycurrent-review/SKILL.md
+++ b/.agents/skills/staycurrent-review/SKILL.md
@@ -3,99 +3,79 @@
 description: Arrange independent reviews of a breakdown, article tree, written article or corpus, or carry out one assigned review perspective.
 ---
 
-Independent reviewers catch what an author cannot see in their own work. Each perspective looks for a different kind of failure, so each gets its own subagent, its own inputs and its own report. The perspectives, their checks and the report format are fixed so that every run reviews the same ground and runs can be compared. Judge everything against the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A nested article contributes to that goal; it does not have to make the reader a specialist in its own topic.
-
-## Which perspectives run
+Judge against the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Each article contributes without setting its own specialist target. Each perspective has its own fresh subagent, permitted inputs and report; reviewers report without editing.
 
 | Mode | Perspectives |
 | --- | --- |
-| Breakdown, or a batch of breakdowns | practitioner, value, teaching |
+| Breakdown, including batches | practitioner, value, teaching |
 | Tree | practitioner, value, teaching |
-| Article, or a batch of articles | practitioner, teaching, editorial, visual (which run in each round is below) |
+| Article, including batches | practitioner, teaching, editorial, visual (round schedule below) |
 | Corpus | practitioner, value, teaching, editorial |
 
-Each perspective has one file that states its purpose, its inputs and its checks:
+Use the fixed checks and inputs in [practitioner](perspectives/practitioner.md), [value](perspectives/value.md), [teaching](perspectives/teaching.md), [editorial](perspectives/editorial.md) and [visual](perspectives/visual.md). Plans receive no wording/visual review; teaching checks how briefs propose to show hard parts.
 
-- [Practitioner](perspectives/practitioner.md): correctness, evidence, coverage and depth.
-- [Value](perspectives/value.md): whether each article and section earns the reader's time.
-- [Teaching](perspectives/teaching.md): how a newcomer builds understanding, and where showing beats telling.
-- [Editorial](perspectives/editorial.md): the words on the page, read as a reader meets them.
-- [Visual](perspectives/visual.md): everything the reader looks at rather than reads: figures, tables, code, diagrams and interactive tools.
+## Assignment and evidence
 
-Plans are not reviewed for wording or visuals, because the writer replaces the plan's wording and builds the visuals later. A plan's teaching review still checks that each brief says how its hard parts will be shown.
+Give each reviewer exactly one perspective, mode, pieces, fixed version and only that perspective's listed inputs. Every assignment, including later rounds, uses a reviewer who has seen neither the piece, earlier versions nor prior reports. Assigned reviewers perform the perspective directly without arranging teams.
 
-## Assigning a perspective
+Freeze complete inputs and preview with one preview/build owner under [staycurrent-orchestrate](../staycurrent-orchestrate/SKILL.md). Start ready commissioned perspectives as slots free up, long visual work early.
 
-Give each reviewer exactly one perspective, its mode, the pieces, a fixed version of them, and the inputs its file lists:
+Editorial/teaching may read scripted step text from the built page without playing it. Practitioner/visual may reuse identified evidence for unchanged mechanics where their permitted inputs allow. Relevant source, data, environment and verifier must still apply to the current version; otherwise rerun affected verification or report the limit. Mechanical receipts contain provenance and relevant mechanical records only, excluding author teaching notes, earlier quality verdicts and review findings. Extract these from mixed writing records. Reuse replaces no perspective check and no fresh visual reading/use of controls. Editorial receives no plan, earlier approval or writer's notes.
 
-> Apply the [perspective] perspective of [staycurrent-review](SKILL.md) in [mode] mode to [pieces] at [version].
-
-Freeze the complete inputs and rendered preview before dispatch, with one preview/build owner, as [staycurrent-orchestrate](../staycurrent-orchestrate/SKILL.md) describes. Start ready commissioned perspectives as slots free up, scheduling long visual work early. Every assignment goes to a fresh reviewer that has not seen the piece, its earlier versions or any earlier report, including in a later round. A reviewer who has followed the rounds reads the page through its history: it sees repairs as fixes and stops noticing what has been there all along. In the 2026-10-20 skill trial, reviewers kept across three rounds passed a03; a fresh editorial reviewer then found five required problems, three of which had been on the page throughout. Runs stay comparable because the perspectives, checks and report format are fixed, not because the reviewer is. A reviewer assigned one perspective performs it directly and never arranges another team.
-
-## The report
-
-Reviewers report; they do not edit the work. Every report uses this shape, so findings can be compared across runs:
+## Report
 
 ```markdown
 # [Perspective] review · [mode] · [pieces] · [version]
 
-Inputs read: [perspective-specific fixed input manifest or concise links; note omissions and anything withheld]
+Inputs read: [fixed input manifest or concise links; omissions and withheld inputs]
 Highest severity: critical | medium | low | none
 
 ## Checks
 
 | Check | Result | Note |
 | --- | --- | --- |
-| [each check from the perspective file, in order] | pass, finding or not applicable | [one line] |
+| [each perspective check, in order] | pass, finding or not applicable | [one line] |
 
 ## First reading
 
-[Visual perspective only: what each figure, table and code example seemed to show before reading its prose, and where you were unsure]
+[Visual only: what each figure, table and code example seemed to show before prose; uncertainties]
 
 ## Findings
 
 ### [perspective]-[n] · critical | medium | low · [piece and location]
 
-Problem: [what is wrong, as the reader meets it]
+Problem: [what is wrong as the reader meets it]
 Effect: [what the reader loses or must do instead]
-Suggestion: [one way to fix it; the writer chooses the repair]
-Evidence: [specific observation, source or applicable mechanical receipt]
+Suggestion: [one possible repair; writer chooses]
+Evidence: [observation, source or applicable mechanical receipt]
 
 ## Limits
 
-[What this review could not check, and why]
+[What could not be checked, and why]
 ```
 
-Keep one line per check, with detail in findings rather than repeated inventories. Link applicable evidence instead of copying logs; state material limits. The coordinator maps duplicate observations to one canonical issue and records one repair decision without discarding observations. Number findings per perspective and keep counting across rounds of the same review: if the editorial findings in the first round end at editorial-13, the coordinator tells the next round's reviewer to start at editorial-14. Each observation label remains traceable to its canonical issue throughout the work record.
-
-Editorial and teaching reviewers may read the step text of scripted figures from the built page rather than by playing them. Practitioner and visual reviewers may use identified evidence for unchanged mechanics where their prescribed inputs permit it. Check its source, data, environment and verifier still apply to the current version; otherwise rerun the affected verification or report the limit. Evidence reuse does not replace any perspective's checks or the visual reviewer's fresh rendered reading and use of controls.
+Keep one line per check and detail in findings. Link evidence without copying logs and state material limits. Continue each perspective's finding numbers across rounds; the coordinator supplies the next number without prior findings. Map duplicate observations to one canonical issue and repair decision, retaining each report and label's traceability.
 
 ## Severity
-
-Rank each finding by what happens to the reader:
 
 - **Critical:** the reader would come away believing or doing something wrong, cannot follow the argument past this point, or a figure contradicts its own text. A false sentence, a figure note that is wrong in some of its states, and a claim the evidence does not support are critical.
 - **Medium:** the reader stalls, rereads or has to supply something themselves. A term used before it is explained, a passage that reads as a patch, a figure that is hard to follow, and a section that spends the reader's time without return are medium.
 - **Low:** a change that would make reading a little easier, such as wording, a heading or a small layout point.
 
-Length is not a finding by itself. A long article is right when every part earns its place; a part that does not is medium.
+Length alone is not a finding: every part must earn its place; a part that does not is medium.
 
-## Deciding and rechecking
+## Decisions and rounds
 
-The coordinator (the orchestrator, or whoever arranged the review) sets each finding's severity, starting from the reviewer's and recording the reason for any change, and decides which findings to accept, especially where perspectives disagree, for example practitioner coverage against value. A decision names the problem to solve, not the words to insert: a fresh writer repairs it with [staycurrent-revise](../staycurrent-revise/SKILL.md) so that the article still reads as one piece. Accepted findings for one piece go to its writer together. Findings on shared layout or site-wide text, which belongs to no writer, go to the coordinator to repair.
+The coordinator sets severity from the reviewer's proposal, recording reasons for changes, and decides acceptance/conflicts against the commission. Accepted decisions state problems rather than replacement wording. Send each piece's accepted findings together to a fresh writer using [staycurrent-revise](../staycurrent-revise/SKILL.md). Shared layout/site-wide text without a writer goes to the coordinator.
 
-Each round repairs findings at or above that round's floor:
-
-| Round | Repaired |
+| Round | Repair floor |
 | --- | --- |
 | 1 | critical, medium and low |
 | 2 | critical and medium |
 | 3 and later | critical |
 
-A fresh reviewer reading a long piece always finds something, and every repair adds new text to find it in. In the 2026-10-21 skill trial, findings that had to be fixed fell from 16 to 7 to 5 over three full rounds but never reached zero, and two of the last five sat in text the previous repair had written. The early rounds therefore do the polishing and the later rounds guard correctness. Record findings below the floor with the decision "below this round's floor", so a later revision can take them up.
+Record lower findings as “below this round's floor”. End after a round finding nothing at or above its floor; always repair critical findings. Round 3 is the last full round. After it, have a fresh reviewer of the finding's perspective check each critical repair, reading repaired passages and surrounding sections in the whole piece; repeat until it passes.
 
-The review ends after a round that finds nothing at or above its floor. Critical findings are always repaired. Round 3 is the last full round: check a critical repair after it with a fresh reviewer of the perspective that found it, reading the repaired passages and the sections around them in the whole piece, and repeat that check until it passes.
+Article mode runs practitioner/teaching every round, editorial/visual in round 1 and again before ending: when a round clears its floor without them, run them on that same version. Other modes run every listed perspective each round.
 
-In article mode, practitioner and teaching review every round. Editorial and visual review round 1, and review again before the review ends: when a round finds nothing at or above its floor without them, run them on that same version. In other modes every perspective runs each round.
-
-Every round is a full review of the whole piece by fresh reviewers with every check, as in the first. The coordinator, not the reviewer, compares the new report with the accepted findings to confirm each was fixed. When a repair added passages or figures, the coordinator names them to the teaching reviewer, without the findings behind them, for its placement check.
+Every round fully reviews the whole piece with fresh reviewers and every check, except the post-round-3 critical rechecks just described. The coordinator compares reports with accepted findings to confirm repairs. Name added passages/figures to teaching for its placement check, without the findings behind them.
--- a/.agents/skills/staycurrent-review/perspectives/editorial.md
+++ b/.agents/skills/staycurrent-review/perspectives/editorial.md
@@ -1,17 +1,15 @@
 # Editorial perspective
 
-The words on the page are judged as a reader meets them. Knowing the plan or the writer's reasons makes unclear wording look clear, because the reviewer fills the gaps from what they already know.
-
-**Inputs:** the finished pieces as rendered; the intended audience; the [Sequence diagrams](../../../../src/reference-articles/sequences.astro), [Indexes](../../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../../src/reference-articles/storage.astro) reference articles in full. Do not read the plan, earlier approvals or the writer's notes.
+**Inputs:** finished pieces as rendered; intended audience; [Sequence diagrams](../../../../src/reference-articles/sequences.astro), [Indexes](../../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../../src/reference-articles/storage.astro) in full. Do not read plans, earlier approvals or writer's notes.
 
 ## Checks
 
-1. **Titles and headings.** Each says what its section is about, in words a reader would use.
-2. **Plain sentences.** Ordinary words and one idea per sentence. No compressed, clever or writerly phrasing a reader must decode.
-3. **Terms.** Each term is explained at first use and then used consistently.
-4. **Openings.** Each section opens by telling the reader something, with its reason, not with a bare instruction.
-5. **Reader-facing text only.** No planning language, editing history or notes about how the article was made.
-6. **Captions and labels.** Captions say what the reader is looking at; control labels say what they will change.
-7. **One piece.** The article reads as if written in one go. No paragraph answers an objection the reader never had, no sentence stacks conditions until its point is lost, and no aside interrupts the argument. Name each passage that reads as a later patch.
+1. **Titles and headings.** Say what the section covers in reader-facing words.
+2. **Plain sentences.** Ordinary words, one idea per sentence; no compressed, clever or writerly wording needing decoding.
+3. **Terms.** Explain at first use and use consistently.
+4. **Openings.** Tell the reader something with its reason, rather than a bare instruction.
+5. **Reader-facing text only.** Exclude planning language, editing history and production notes.
+6. **Captions and labels.** Captions explain what is shown; labels explain what controls change.
+7. **One piece.** The article reads as if written in one go. Name passages that read as later patches: unprompted objections, stacked conditions or interrupting asides.
 
-In corpus mode, also check that terms, names and the running example stay consistent from article to article.
+In corpus mode, also check cross-article consistency of terms, names and running example.
--- a/.agents/skills/staycurrent-review/perspectives/practitioner.md
+++ b/.agents/skills/staycurrent-review/perspectives/practitioner.md
@@ -1,15 +1,13 @@
 # Practitioner perspective
 
-An expert practitioner checks that the piece is right and that it gives the reader what the job actually demands. Wrong or untested claims cost the reader more than any other failure, because they cannot see them.
-
-**Inputs:** the pieces under review; each piece's brief and intended outcomes; its parent, sibling and child plans; its sources and evidence records; the commission.
+**Inputs:** pieces; briefs/intended outcomes; parent, sibling and child plans; sources/evidence records; commission.
 
 ## Checks
 
-1. **Correctness.** Each consequential technical claim is right. Check it against a primary source such as official documentation, a specification or the source code, and name the sources you checked. Where the system can be run locally, reproducing a claim on a disposable instance is welcome; record the version and commands.
-2. **Evidence.** Illustrative models are labelled as models. Observed results match the recorded evidence, including the version and command. No unrun command is presented as observed.
-3. **Coverage.** The decisions, failure cases and practical judgement in the brief's intended outcomes are all taught, including the awkward case a practitioner will meet.
-4. **Depth, both ways.** Nothing the goal needs is missing, and nothing is taught more deeply than the goal needs. Name both kinds.
-5. **Ownership.** The parent gives a useful high-level answer and leaves deeper mechanisms to the child that owns them. No subject has two full treatments.
+1. **Correctness.** Check consequential technical claims against primary sources (official documentation, specifications or source code), naming sources checked. Disposable local reproduction is welcome; record version/commands.
+2. **Evidence.** Label illustrative models; observed results match recorded version/command evidence. No unrun command is presented as observed.
+3. **Coverage.** Teach the brief's decisions, failure cases and practical judgement, including awkward practitioner cases.
+4. **Depth, both ways.** Name missing understanding and unnecessary depth relative to the goal.
+5. **Ownership.** Give a useful parent-level answer, leaving deeper mechanisms to their owning child; avoid duplicate full treatments.
 
-In tree and corpus modes, apply the checks across the whole set: every subject the goal needs has exactly one owner, and the depth across the set matches what a practitioner needs rather than what neighbouring articles happen to contain.
+In tree/corpus modes, check that every needed subject has exactly one owner and that depth across the set follows practitioner needs rather than what neighbouring articles contain.
--- a/.agents/skills/staycurrent-review/perspectives/teaching.md
+++ b/.agents/skills/staycurrent-review/perspectives/teaching.md
@@ -1,17 +1,15 @@
 # Teaching perspective
 
-A newcomer can only build on what they already have. This perspective follows the reader through the piece and looks for the points where they would stall: an idea arriving before what it depends on, or a mechanism they are left to picture alone.
-
-**Inputs:** the pieces under review; the [Sequence diagrams](../../../../src/reference-articles/sequences.astro), [Indexes](../../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../../src/reference-articles/storage.astro) reference articles in full, including their figures; the parent, sibling and child plans; the commission.
+**Inputs:** pieces; [Sequence diagrams](../../../../src/reference-articles/sequences.astro), [Indexes](../../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../../src/reference-articles/storage.astro) in full, including figures; parent, sibling and child plans; commission.
 
 ## Checks
 
-1. **Starting point.** Everything an idea depends on is introduced before it, and each term is explained at first use.
-2. **Order.** Each idea builds on the one before, and the hardest part gets the most help.
-3. **Examples.** A concrete running example carries the explanation, and it reaches the awkward case as well as the easy one.
-4. **Showing.** Wherever the reader would otherwise have to hold changing state in their head, a figure, table or worked example shows it. In breakdown and tree modes, check that each brief says how its hard parts will be shown.
-5. **Judgement.** The reader finishes able to make the decision the piece exists for, and knows when it changes.
-6. **Gradual exposure.** The parent gives the high-level answer first and hands the deeper mechanism on to its child at the point the reader would want it.
-7. **Placement of additions.** When the coordinator names passages or figures a repair added, for each one say whether it belongs in this piece or in an article that already owns the subject, and whether it sits in the argument where the reader needs it or has been attached beside it. Length is not a finding: an addition that belongs here may be as long as the teaching needs.
+1. **Starting point.** Dependencies precede ideas; terms are explained at first use.
+2. **Order.** Ideas build on earlier ones; the hardest part gets the most help.
+3. **Examples.** A concrete running example carries both easy and awkward cases.
+4. **Showing.** Show changing state in figures, tables or worked examples. In breakdown/tree modes, briefs specify how hard parts will be shown.
+5. **Judgement.** The reader can make the intended decision and knows when it changes.
+6. **Gradual exposure.** The parent answers at high level before handing deeper mechanisms to children where wanted.
+7. **Placement of additions.** For coordinator-named added passages/figures, say whether each belongs here or with an existing owner, and whether it sits where the argument needs it or reads as attached. Length alone is not a finding; needed additions may be as long as the teaching requires.
 
-In tree mode, judge the planned progression. In corpus mode, follow the finished reading routes from the introduction and check that a reader on each route meets ideas in an order they can build on.
+In tree mode, judge planned progression. In corpus mode, follow finished routes from the introduction, checking idea order along each route.
--- a/.agents/skills/staycurrent-review/perspectives/value.md
+++ b/.agents/skills/staycurrent-review/perspectives/value.md
@@ -1,15 +1,13 @@
 # Value perspective
 
-Every section and page costs the reader time to read and effort to reach. Reviews that only ask what is missing push length up; this perspective pushes back, looking for the smallest coherent set of articles that still meets the goal.
-
-**Inputs:** the pieces under review, or the whole tree or corpus; the commission. In breakdown mode, also the parent and neighbouring briefs.
+**Inputs:** pieces, tree or corpus; commission; in breakdown mode, parent/neighbouring briefs.
 
 ## Checks
 
-1. **Loss if cut.** For each article and section, name the useful understanding the reader would lose without it. Where you cannot name any, propose the cut.
-2. **Overlap.** The same thing is not taught in two places. Name both places and say which should own it.
-3. **Separate pages.** Each nested article is substantial enough to justify a page of its own; a thin one should become a section of its parent.
-4. **Route cost.** In tree and corpus modes: count the pages a reader must open to finish a typical task, and say where a merge would shorten the route without losing understanding.
-5. **Proportion.** Each piece's length follows its subject's depth, not its neighbours' length. A shallow subject taught at length is as much a finding as a deep one cut short.
+1. **Loss if cut.** Name useful understanding lost without each article/section; propose cuts where none is lost.
+2. **Overlap.** Name both duplicate treatments and choose an owner.
+3. **Separate pages.** Each child earns a page; merge thin children into their parent.
+4. **Route cost.** In tree/corpus modes, count pages needed for a typical task and identify merges that save openings without losing understanding.
+5. **Proportion.** Length follows subject depth; flag shallow subjects overextended and deep subjects cut short.
 
-Each proposed cut or merge states what it would save and what understanding it would lose, so the coordinator can weigh it against the practitioner review.
+For each cut/merge, state reader effort saved and understanding lost for reconciliation with practitioner review.
--- a/.agents/skills/staycurrent-review/perspectives/visual.md
+++ b/.agents/skills/staycurrent-review/perspectives/visual.md
@@ -1,13 +1,11 @@
 # Visual perspective
 
-Figures, tables, code, diagrams and interactive tools carry much of the teaching, and they fail in ways prose review misses. A table can be accurate and still unreadable; a figure can pass its model tests and still hide its outcome or contradict its caption. Both happened in earlier runs. This perspective judges what the reader actually sees, on the rendered page.
-
-**Inputs:** the rendered pieces in a browser, at a fixed version; isolated figure routes where the coordinator provides them; the three reference articles' rendered figures and tables for comparison; [staycurrent-figures](../../staycurrent-figures/SKILL.md), which states how figures should be built. Applicable mechanical evidence receipts may accompany these inputs; they must identify their version and contain no earlier review findings. Reuse them under the review skill's evidence rule while still performing every check below. If you cannot operate a browser, say so and ask the coordinator to operate the controls and report what happened, rather than inferring behaviour from source. In a hidden browser pane, animation runs at about one frame a second and screenshots can be stale. If your window is hidden, check playback timing from the page's timers and say so under Limits.
+**Inputs:** fixed-version rendered pieces in a browser; isolated figure routes where supplied; the three reference articles' rendered figures/tables; [staycurrent-figures](../../staycurrent-figures/SKILL.md). Applicable mechanical receipts may accompany them under the review skill's evidence rule: include versions/provenance, exclude author teaching notes, earlier quality verdicts and review findings. Reuse replaces none of these checks. Without browser access, ask the coordinator to operate controls and report results; do not infer operation from source. Hidden panes may animate at about one frame per second with stale screenshots; use page timers for hidden-window playback timing and report that under Limits.
 
 ## Checks
 
-1. **First reading alone.** Before reading the surrounding prose, look at each figure, table and code example, and use each interactive tool. Record what each seems to show and where you are unsure, in the report's First reading section. That record shows whether it stands on its own. Then read it in place.
-2. **Form fits the content.** Each item uses the form that shows its content most directly. Example data appears as rows under its real column headings, as the reader will meet it in a database. Each table column holds one kind of value. Relationships are drawn rather than described, and keys visibly connect across examples. The running example stays consistent from figure to figure: the same rows, keys, names and values wherever they recur, and every column a caption names exists in the tables. Where a better form exists, name it: for instance, a small table per relation instead of a single table that packs each relation's columns into one cell as `name = value` lists.
-3. **Readable at a glance.** No cell, caption or label needs decoding. Code examples are short, formatted and run in the order shown.
-4. **Interaction.** Each control changes something meaningful. States and results are clear at every step, the explanation agrees with what is shown, and automatic playback holds each step long enough to read the text that changed at that step, with pause always available. Keyboard use works, with focus kept on a control at its first and last step.
-5. **Themes and phones.** Everything is readable in light and dark themes and at phone width, including comparisons that sit side by side on a desktop. Body text, including warnings, NULL markers and dimmed rows, has at least 4.5:1 contrast with its background; large text and graphics at least 3:1.
+1. **First reading alone.** Before prose, inspect each figure/table/code example and use each interactive tool. Record apparent meaning and uncertainties under First reading, then read each in place.
+2. **Form fits the content.** Use the clearest form. Show data as rows under real column headings, one kind of value per column. Draw relationships and visibly connect keys; keep recurring rows/keys/names/values consistent and caption-named columns present. Name better forms where needed, such as one table per relation instead of packed `name = value` cells.
+3. **Readable at a glance.** No cell/caption/label needs decoding; code is short, formatted and runs in the shown order.
+4. **Interaction.** Controls change something meaningful. Every state's result and explanation agree. Playback holds changed text long enough to read, with pause available. Keyboard operation retains focus at first/last steps.
+5. **Themes and phones.** Check light/dark themes and phone width, including desktop comparisons. Body text—including warnings, NULL markers and dimmed rows—needs 4.5:1 contrast; large text/graphics need 3:1.
--- a/.agents/skills/staycurrent-revise/SKILL.md
+++ b/.agents/skills/staycurrent-revise/SKILL.md
@@ -3,33 +3,14 @@
 description: Repair a written article from accepted review findings so that it reads as if it had been written that way, with the same standard and proportionate verification.
 ---
 
-Review findings arrive one problem at a time, so the easy repair is local: add the missing sentence, qualify the claim, append the case. Each such patch is correct, and together they make a worse article. Qualifications stack, asides answer the reviewer rather than the reader, and the argument loses its line. In the 2026-10-20 skill trial, "Making concurrent changes correct" grew from 4,925 to 6,112 words over two repair rounds. Teaching judged every addition to belong in the article, yet two passages still read as accumulated fixes: a closing sentence about a vendor import tool carried four conditions, and a paragraph about `FOR UPDATE` had to be read twice. Length is not the problem. A repaired article must meet the same standard as a first draft, with every affected claim and figure verified.
+Anyone changing article prose uses this skill, including a coordinator making a one-phrase fix. Repairs must read as one article at first-draft standard.
 
-## Read the finding as a reader's problem
+Read the whole article before the findings, with relevant plan context and current decisions/evidence from its work record. Follow earlier history only as needed. Treat accepted findings as reader problems, not wording to insert. Reread the whole affected section before changing it.
 
-You are usually not the article's original writer. Read the whole article before the findings, with the relevant plan context and current decisions and evidence from its work record, so you know the argument you are repairing. Follow links into earlier history only where needed to understand the problem.
+Repair low/medium findings locally with the smallest change that leaves the section reading well. Restructure a section only when a critical finding cannot otherwise be fixed. Reword, reorder, cut or move existing material where that gives the clearest explanation. Link material moved to its owning article. If adding a missing point, integrate it into the surrounding paragraph. State correctness repairs as simply as the evidence allows, placing decision-changing conditions where the reader acts; edge cases may belong with their owner or in Sources.
 
-A finding says where the reader stalls or is misled. Its suggested repair is one way to fix that, and the coordinator's decision records which problems to fix, not the wording. Before changing anything, reread the whole section the finding sits in and ask what the reader there needs.
+After repair, reread the complete article, including contents, captions and controls, against the three references in [staycurrent-write](../staycurrent-write/SKILL.md). Revisit relevant reference passages/figures when calibration is needed; repairs need not reload all three in full. Remove patch-like passages: objections the reader never had, stacked conditions and interrupting asides.
 
-Keep the change in proportion to the problem. A low or medium finding is repaired where it sits, with the smallest change that leaves the section reading well. Restructure a section only when a critical finding cannot be fixed without it. Every passage you rewrite is new text that the next fresh reviewer has to check, and in the 2026-10-21 trial repairs that rebuilt more than their findings needed caused most of the later rounds' problems.
+Run the [continuity pass](../staycurrent-continuity/SKILL.md). Recheck every affected claim, term, example and figure, including downstream uses. Use [staycurrent-figures](../staycurrent-figures/SKILL.md) for changed figures and request builds from the preview/build owner. Reuse verification only while relevant source, data, environment and verifier remain applicable; otherwise rerun affected checks. Prose can change technical meaning, layout or playback timing. Add verification cases only when a repair changes a figure/listing's claim.
 
-Then choose the change that leaves the section clearest. Usually that means reshaping what is already there, not appending to it:
-
-- **Reword or reorder** when the idea is present but arrives in the wrong place or form.
-- **Cut** when a claim cannot be made true without a pile of conditions. Say the plain true thing, and move the edge cases to the article that owns them or to Sources.
-- **Move** a passage that belongs in another article, and link to it.
-- **Add** when the reader genuinely lacks something. Rewrite the surrounding paragraph so that the new point is part of the argument, rather than a sentence attached at its end.
-
-A correctness repair follows the same rule. State what is true as simply as the evidence allows, and put any condition that changes the reader's decision where they will act on it.
-
-## Finish as a first draft finishes
-
-After the findings are repaired:
-
-1. Reread the complete article as a reader would, including its contents list, captions and controls, against the standard of the three reference articles named in [staycurrent-write](../staycurrent-write/SKILL.md). Revisit relevant reference passages or figures when calibration is needed; every repair need not reload all three in full. Revise any passage that now reads as a patch: a paragraph that answers an objection the reader never had, a sentence with more than one "unless" or "provided", or an aside that interrupts the point.
-2. Run the [staycurrent-continuity](../staycurrent-continuity/SKILL.md) pass. Repairs are where terms most often arrive before their explanation.
-3. Recheck every claim, term, example and figure affected by the repair, including downstream uses. Use [staycurrent-figures](../staycurrent-figures/SKILL.md) for changed figures and request needed builds from the preview/build owner. Reuse verification only while its relevant source, data, environment and verifier remain applicable; otherwise rerun affected checks. Prose changes can alter technical meaning, layout or playback timing. Add a verification case only when the repair changes what a figure or listing claims.
-
-Update the canonical work record with each finding's repair and verification links; do not copy unchanged evidence or the continuity ledger. Name every passage restructured beyond the finding, so rechecks know to read it.
-
-Anyone who changes an article's prose uses this skill, including a coordinator making a one-phrase fix.
+Update the canonical work record with repairs and verification links, without copying unchanged evidence or the continuity ledger. Name every passage restructured beyond the finding for rechecking.
--- a/.agents/skills/staycurrent-write/SKILL.md
+++ b/.agents/skills/staycurrent-write/SKILL.md
@@ -3,16 +3,14 @@
 description: Write or substantially revise one article from its plan and the plans around it, to the standard of the three reference articles.
 ---
 
-Each article moves an intelligent newcomer towards expert practice in the commissioned subject, in the least reader time and effort. Its brief says what share of that goal it carries. The parent, sibling and child plans show what the reader already has and what deeper articles will cover, so this article can give a useful high-level answer and leave deeper mechanisms and procedures to the articles that own them. When finished child articles exist, read them too: the parent can then summarise and link to what they actually say.
+Teach this article's share of the commission: take an intelligent newcomer towards expert practice in the commissioned subject, in the least reader time and effort. Read parent, sibling and child plans and any finished children. Give a useful high-level answer, leaving deeper mechanisms/procedures to their owners; summarise and link to finished children accurately.
 
-Read [Sequence diagrams](../../../src/reference-articles/sequences.astro), [Indexes](../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../src/reference-articles/storage.astro) in full, including their figures. They are the standard for both writing and teaching.
+Read [Sequence diagrams](../../../src/reference-articles/sequences.astro), [Indexes](../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../src/reference-articles/storage.astro) in full, including figures: they set the writing and teaching standard.
 
-Let figures carry the important explanations rather than decorate the prose. The strongest let the reader change a cause and watch the result. Choose, build and check every figure, table, code listing and interactive tool with [staycurrent-figures](../staycurrent-figures/SKILL.md). Use the existing Astro article components where they fit.
+Use the plan for coverage and relationships; polish provisional titles/headings with the prose. Link each nested article where introduced and in the final reading list. Use the [collection's example record](../staycurrent-continuity/SKILL.md), proposing extensions rather than inventing local examples.
 
-Check consequential technical claims against primary sources and list them under Sources and further reading. Never present an unrun command as observed. Record what actually ran in the canonical evidence index and link to it from the work record, rather than copying logs. Coordinate builds with the designated preview/build owner.
+Let figures explain, with interaction where changing a cause helps show the result. Use [staycurrent-figures](../staycurrent-figures/SKILL.md) for every figure, table, listing and interactive tool, and existing Astro article components where they fit.
 
-Use the plan for coverage and relationships. Its titles and headings are provisional: polish them with the prose. Link to each nested article where its subject comes up, and again in the reading list at the foot of the article. Take the running example from the collection's example record, as [staycurrent-continuity](../staycurrent-continuity/SKILL.md) describes, and propose an extension rather than inventing a local one.
+Check consequential technical claims against primary sources listed under Sources and further reading. Never present unrun commands as observed. Record actual execution in the canonical evidence index and link it from the work record. Coordinate builds with the designated preview/build owner.
 
-Before returning, reread the complete piece as a reader would, including its contents list, captions and controls, and revise anything that falls short of the references. Then run the continuity pass.
-
-When the orchestrator manages review, return the draft with any proposed tree changes. Otherwise review it with [staycurrent-review](../staycurrent-review/SKILL.md) in article mode, repair the findings with [staycurrent-revise](../staycurrent-revise/SKILL.md), and return the article, the review results and any proposed tree changes.
+Before returning, reread the complete piece, including contents, captions and controls, and revise anything below the references' standard. Run the continuity pass. Return the draft and proposed tree changes for orchestrator-managed review; otherwise arrange article-mode [review](../staycurrent-review/SKILL.md), repair with [staycurrent-revise](../staycurrent-revise/SKILL.md), and return article, review results and proposed tree changes.
```
