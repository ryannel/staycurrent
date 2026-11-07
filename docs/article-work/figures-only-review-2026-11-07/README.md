# Figures-only review: Handling cache misses

## Commission

Update the editorial skills so each figure explains its own lesson and the sequence
teaches the article's main mechanisms, consequential failures and practical choices.
Then trial the independent figures-only review on the published Handling cache misses
to establish what needs improving. This commission stops at findings; it does not
rewrite or republish the article's explanation or drawings.

The published article baseline is `e1cf0b72`. Work is isolated on
`codex/figures-only-review`, based on `origin/main`, so unrelated local commits are not
part of this delivery.

## Instruction changes

Planning records visual coverage beside the existing brief and exit questions. The
figure guide owns the learning target and the isolated preview. Review now has separate
prose and visual readers, alongside teach-back and practitioner lenses. The visual
reader records an unaided account before receiving the article and learning goals,
then judges comprehension and coverage. Teaching repairs require an unprimed check;
bounded rendering repairs retain unaffected comprehension evidence.

## Trial method

The new `/review/figures/cache-misses/` route is enabled only by
`STAYCURRENT_FIGURE_PREVIEW=1`. It renders the existing five figure components in the
article's order with their existing visible captions and controls. It excludes article
prose, author notes and long explanatory accessibility alternatives from its DOM.
The normal article retains those alternatives. No scene, timing, data, caption or
drawing is changed for this trial.

The reviewer starts in a fresh context with only the isolated preview, audience and
`first-visual-reading.md`. It saves its first account before receiving the informed
visual lens, brief, exit questions, article and house style. Existing rendering checks
may be reused where unchanged; they cannot substitute for the new comprehension test.

The [original account](reviews/first-visual-reading.md) and
[informed findings](reviews/informed-visual-review.md) are retained unchanged, with
build and isolation evidence under `evidence/`. The first account was saved and hashed
before informed inputs were sent; its hash still matches. Findings remain open for the
owner's next decision; producing them is the requested stopping point.

## Result and priorities

The current sequence does not meet the new visual coverage target. Its strongest
figures explain caller deadlines, work outliving a lease, and the fixed age limit during
refresh. The independent reader correctly described these comparisons. The sequence
leaves the article's central argument about protecting the source during failure and
recovery largely to prose. Rendering approval had not tested that understanding.

The reviewer raised five Medium findings and one Low finding, with no Critical finding.
The coordinator accepts these as concrete improvement needs supported by the unaided
account and the existing brief and exit questions. They remain unrepaired.

| Priority | Understanding the visuals need to add | Useful direction for a subsequent design |
| --- | --- | --- |
| 1 | What happens when source capacity is full, including distinct-key misses and cache failure | Show admitted work, bounded waiting and refused/fallback outcomes; distinguish concurrency from start rate and the fleet allowance from each server's pool. |
| 2 | Why a cache can remain cold after service returns, and how to recover safely | Connect slow fills, retained capacity, retries and too few completions; show what changes when demand is reduced and which measurements justify a ramp. |
| 3 | When local sharing is sufficient and when a fleet-wide lease is worth its cost | Extend the shared-load example across processes, so remaining duplicate work and its cost make the coordination choice visible. |
| 4 | How refresh scheduling policies differ | Show request-driven selection versus spreading different keys' expiries, including duplicate attempts and the empty-cache limit. Preserve Figure 4's clear hard-limit explanation. |
| 5 | Why demand filling beats catalogue order in Figure 5's model | Make key popularity and use of the same fill allowance visible, so the viewer can explain the curves rather than infer their cause from prior knowledge. |
| Polish | Caller wait allowance versus elapsed waiting | Clarify Figure 2's “waits” labels; the reader initially misread them but recovered the correct meaning. |

These are learning needs, not a requirement to add five animations. Existing examples
can evolve, combine or split; still diagrams may explain some relationships better.
Keep the useful timelines, single-condition variants and settled final views. Detailed
code, the exact refresh formula and experimental derivations can remain in prose.

The trial demonstrates why the separate reading matters: the reviewer supplied some
correct causal links from existing cache knowledge, and the saved account exposed those
as assumptions before the prose made them seem obvious. One fresh agent's account is
evidence of these gaps, not a population-level comprehension study. Teaching repairs
will need a different unprimed reader; this reviewer has now read the article.

## Checks and limits

- All four skills pass `quick_validate.py`; local skill links resolve.
- The flagged build passes with the isolated preview. Its figures match the article's
  SVGs, order and visible captions, while explanatory prose and long alternatives are
  absent from its HTML. The fixed build served both review stages.
- The normal build passes with 139 pages; the preview route is absent and all five
  normal text alternatives and descriptive accessible names remain present. The build
  reports the existing dense-prose warnings on other pages.
- All 24 site-check tests pass. Article prose and scene modules are unchanged from
  `e1cf0b72`.
- Fresh visual observations cover desktop dark mode and every variant, using sampled
  initial, changing and settled states. Earlier phone, theme, keyboard and contrast
  checks are retained only for unchanged mechanics, as the review records.
- Reduced-motion emulation and screen-reader-software testing were not performed.
  The trial does not claim continuous-video observation or a new phone-layout review.

This delivery updates instructions, adds preview plumbing and records findings. It does
not approve the existing sequence against the new target or change the article's
explanation, scenes, timing, data or captions.
