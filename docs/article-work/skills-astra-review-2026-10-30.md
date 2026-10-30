# Repository skills review for GPT-6 Astra

Reviewed and repaired on 30 October 2026 against current official OpenAI guidance.

## Scope and sources

Read all seven active `.agents/skills/*/SKILL.md` files, all five review
perspectives, all three figure references and root `AGENTS.md`. Checked their
relationship to `README.md`, `docs/site-direction.md`, the reference-reading
helper and the shared stepper implementation. The seven `.claude/skills/`
symlinks expose the same skills. Archived skills and experiment snapshots under
`docs/` were identified as historical records and left intact; they are not the
active suite for work launched at this repository root.

The review used these official sources, searched and opened on the review date:

- [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra): concise, discriminating descriptions; conditional reference loading; room for model judgement; context-specific repository instructions; explicit completion boundaries.
- [Using GPT-6: instruction following and follow-through](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra): make user priority clear, explain instructions that cause a pause, finish authorised work and scale verification to the change.
- [Build skills for plugins](https://developers.openai.com/plugins/build/skills): define inputs, outputs, workflow boundaries and supporting-resource use; test representative requests and cases that should not activate the skill.
- [Build skills for Codex](https://learn.chatgpt.com/docs/build-skills): metadata supports discovery, full instructions load on selection, and supporting references and UI metadata are optional.

The installed `skill-creator` guidance also informed validation and the independent
instruction-following dry run. These sources guide the skill design; the findings
below are judgements about this repository, rather than OpenAI requirements for
this publication's editorial process.

## Findings and changes

The suite already had useful specialisation, short entrypoints, conditional
figure references and a strong rule for retaining applicable review evidence.
It needed targeted boundary repairs rather than a replacement workflow.

| Area | Finding | Delivered change |
| --- | --- | --- |
| [Repository instructions](../../AGENTS.md) | Unconditional document reading and “use the seven skills” could burden site maintenance. Skill/user priority was implicit. | Route repository reading by need, select skills for editorial work, state explicit user priority and require a sourced explanation when a skill causes a pause. |
| [Orchestrate](../../.agents/skills/staycurrent-orchestrate/SKILL.md) | The first-version experiment stopping rule was more specific than its reusable workflow needed. | Tie an unreviewed stopping point to the user's request; otherwise finish the commissioned review and repair. Preserve fresh planners/writers, independent first readers and central integration. |
| [Breakdown](../../.agents/skills/staycurrent-breakdown/SKILL.md) | A standalone outline always led to review, including where the user wanted only an unreviewed outline. | Return draft YAML for that explicit boundary, retaining unresolved dependencies. Keep the canonical `heading`/`nested_article` schema and contextual child scope. |
| [Write](../../.agents/skills/staycurrent-write/SKILL.md) | The collection-oriented instructions left standalone facts and prose-only checks unclear. “Article path” could be mistaken for a source file. | Support a single-article commission without constructing a collection. Reuse complete references already in context. Define the check selector as a rendered URL; prose-only work receives direct prose checking and an honest pending-render record. Honour an explicitly unreviewed draft. |
| [Figures](../../.agents/skills/staycurrent-figures/SKILL.md) | A standalone assignment appeared to require a separate preview owner. Repair scope and illustrative counterexamples needed clarification in supporting files. | Allow direct rendered checks, state the media/check deliverable, retain unaffected media checks, and clarify that an illustrative counterexample does not itself require a native engine run. |
| [Continuity](../../.agents/skills/staycurrent-continuity/SKILL.md) | Every local repair required a complete reread; an independent article appeared to need a collection example record. | Follow changed reasoning, prerequisites and later uses for local repairs, widening when needed. Keep whole-piece reading for drafts and substantial rewrites. Store independent example facts with the article's work. |
| [Revise](../../.agents/skills/staycurrent-revise/SKILL.md) | Mandatory whole-article reading for every repair conflicted with proportionate confirmation. | Read the relevant context and downstream uses; require the whole article when argument, structure or uncertainty warrants it. Keep coherent repairs and affected-claim verification. |
| [Review](../../.agents/skills/staycurrent-review/SKILL.md) | Assigned reviewers lacked an explicit narrow route. Editorial/teaching input files required full reference preparation despite the entrypoint's calibration-only rule. Visual inputs excluded findings even for informed repair confirmation. | Route assigned perspectives and confirmation explicitly. Align reference preparation with calibration passages/figures. Distinguish blind first readings from informed confirmation; report unavailable browser checks without inferring their result. |

All seven descriptions now identify their action and task boundary directly.
No new reference hierarchy, helper script, UI metadata or model setting was needed.
The existing short skills do not benefit from extra routers merely to reduce their
line counts. The reviewer perspective files and conditional figure guides already
provide useful progressive disclosure.

The practitioner and value perspectives, and the stepper guide, were reviewed and
retained. Their checks and implementation contract remain applicable. The three
complete writing references remain required preparation for new planning/writing;
that is the publication's explicit teaching standard. Native evidence provenance,
theme/keyboard checks, British English and publication authorisation also remain.

## Independent scenario checks

An independent worker received the raw skill suite and realistic requests without
the proposed fixes or intended answers. It traced seven baseline requests, then
re-read the revised files and traced nine requests. It performed no article work,
site changes or external actions.

| Request | Revised instruction-following result |
| --- | --- |
| Plan one cache-invalidation article | One outline with contextual child stubs; no collection replanning. |
| Write a complete standalone idempotency article | Single-article scope, independent example facts, applicable checks and proportionate review; no publication. |
| Qualify one retry claim after review | Contextual repair and affected dependencies, followed by scoped confirmation. |
| Return the first collection draft before commissioning review | Complete the commissioned drafts and author checks, then stop at the requested boundary. |
| Perform only the assigned editorial review | Load the editorial perspective, inspect finished work and calibration references, return findings; no extra review team. |
| Fix the article-directory layout | Ordinary site maintenance; no article-writing workflow. |
| Review an illustrative database sequence | Check claims and model boundaries without manufacturing an execution requirement. |
| Return only an unreviewed heading outline | Draft YAML; no review or repair commission. |
| Write a prose-only single-article draft | Direct prose checks; no Astro integration/build solely for checking; rendered checks recorded as pending. |

The worker found the direct reference-reading and repair-scope contradictions
resolved. It noted that “prose-only draft” specifies format, not necessarily review
status. The retained default is proportionate standalone review unless the user
requests an unreviewed result. This is a scope interpretation, not a reason to
block ordinary work or introduce another approval gate.

## Validation and limits

- All seven skills pass the installed `skill-creator/scripts/quick_validate.py`.
- All 15 active skill Markdown files were checked; all 40 local Markdown links
  resolve, and all seven Claude aliases resolve to their skill entrypoints.
- `python3 scripts/read-writing-reference.py` successfully verifies the preserved
  source/export hashes and lists the reference parts. The stepper guide's API and
  data attributes agree with the current shared implementation.
- `git diff --check` passes.
- `pnpm build` passes, including the site check over 114 pages and 14 rules. It
  reports 36 dense-prose warnings across 16 pages and Vite dependency warnings.
  The build used the current working tree, including the user's pre-existing
  article/example edits; this review did not change article sources.

This establishes structural validity and a reviewed instruction design aligned
with the cited guidance. The scenario checks are instruction dry runs, not an
empirical Astra benchmark or a full article-production trial. No claim is made
that a new article's teaching or prose quality has been demonstrated by this
maintenance review. No article publication was commissioned by this task.
