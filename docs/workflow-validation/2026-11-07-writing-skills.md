# Writing skills alignment, 7 November 2026

The commission was to read the revised writing skills in the neighbouring
`ryannel.dev` workspace, align Stay Current with the new writing reference and adopt
useful improvements to the skills' structure.

## Source and scope

Read the working-tree versions of `ryannel.dev`'s writing, review and publish skills.
The writing revision was still uncommitted, so its working tree was the source. The
writing file's SHA-256 was
`03cbdce66f424c3f1512b4c19f815bccca80e7312789cafe0057f326e50058dc`;
the review file's was
`512fe28978519aca470f5c99b70bf5b3a581617bfbaa5570a235c9883e7a6a00`.
That workspace was read only. Read all four linked Randall Munroe essays as full
article text.

The delivered change applies to the four-skill editorial structure on `origin/main`
at `ee4c82b2`, reconciled with the existing local checkpoint. The expert dossier, exit
questions, three review lenses, independent confirmations and ink-and-tokens figure
style remain in place. No article content or site behaviour is changed by this update.

## What changed

- The [voice guide](../../.agents/skills/staycurrent-write/references/voice.md) owns the
  four writing references and the shared prose guidance. Planning, writing and informed
  reader review point there. The old sentence-length comparison and Sam Who/Ciechanowski
  prose anchors are replaced by connected reasoning, literal language, explicit
  assumptions and useful understanding per paragraph.
- The three preserved local articles remain worked examples. Their sources, reading
  exports and preview routes are unchanged; they no longer set the prose voice. The
  current house figure style remains authoritative.
- The reader-and-visual lens starts with an unaided reading of the finished page. Its
  observations are saved before the same reviewer receives the voice and figure guides.
  The short [first-reading instructions](../../.agents/skills/staycurrent-review/lenses/first-reading.md)
  keep those inputs separate without adding a fourth lens. Teach-back still tests exit
  questions independently and now explicitly excludes implementation comments and
  figure-only teaching from its prose input.
- Readers record effort, expectations, unsupported steps and passages worth preserving.
  Informed review assesses openings, endings and what each section earns. Original
  observations remain separate from proposed repairs.
- Substantive prose repairs get a whole-article coherence read by the repairer. Bounded
  corrections retain scoped checks and unaffected evidence. Prose-only drafts can stop
  before integration with rendered checks recorded as pending.

Stay Current keeps researched technical claims, British English, coherent illustrative
examples, complete prose and separate publication authorisation. The personal
notebook's requirement that example facts come from Ryan, its phrasing-approval rule and
its publishing workflow were not adopted.

## Validation

- All four skills pass the skill-creator `quick_validate.py` validator. PyYAML was
  supplied in a temporary environment outside the project.
- All 27 local links and anchors across the skills' 15 Markdown files resolve, as do
  all four `.claude/skills` symlinks.
- `git diff --check` passes. Active guidance no longer requires the old prose anchors.
- `pnpm build` passes on the reconciled tree. The site check reports 36 dense-prose
  warnings across 16 existing pages; article content is unchanged by this update.

An independent agent exercised three realistic requests against the final four-skill
suite. The coordinator inspected its artifacts:

- A 407-word cache-expiry explanation used the supplied illustrative values, read all
  four essays in full, checked primary documentation and stopped at an explicitly
  unreviewed prose draft. Its short plan and work notes stayed separate from the article.
- The review handoff supplied only the finished page, audience and first-reading
  instructions initially. It saved observations before supplying style guidance to
  the same reviewer, keeping teach-back and practitioner review separate.
- The numerical-repair plan checked affected reasoning, later uses, evidence and exit
  questions, retained unaffected checks, and required scoped independent confirmation
  without restarting collection review.

No blocking instruction conflict was reported. The trial did not integrate or publish
an article, launch reviews or claim rendered checks. Its artifacts remain outside the
repository in a temporary directory. This is evidence that the instructions can be
followed in these cases, not proof of writing quality across future commissions.
