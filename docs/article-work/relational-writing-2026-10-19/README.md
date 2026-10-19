# Relational writing run

The user commissioned the full reviewed 38-article tree for morning review,
starting with a writing/teaching pilot and committing and pushing each completed
article. The [commission](commission.md) and [registry](registry.json) define this
run; the [reviewed tree](../../coverage/relational-fanout-2026-10-19.yaml) remains
the curriculum. New work is available as an unlisted draft review collection at
`/review/relational-next/`.

The pilot is a14, Joining and summarising data. Both independent perspectives
passed batch p01 after local SQL wording, keyboard, mobile and motion repairs.
The teaching reviewer found effective mechanism-changing interactions and judged
the approach ready to scale; no skill rewrite was justified. Full writing is now
under way. Initial findings and the narrow rechecks remain in batches p00/p01.

Each assignment includes its own section plan, parent and sibling scopes, and its
children's actual section plans. The parent teaches a useful high-level answer;
its contextual children own deeper mechanisms and procedures. The writer and
reviewer skills now make this boundary explicit. Stable section anchors let
writers link to precise prerequisites while a parent is still planned.

Authors stage fragments under their node directory, with private teaching
components under `src/components/relational-next/aXX/`. The orchestrator copies
returned drafts into the review route for rendered checks, handles independent
review batches, and commits each completed article with its components and
records. In-progress fragments stay outside the route glob. The pilot predates
that staging convention and writes its single src fragment directly.

`state.json` tracks progress. Article assignments, sources and author reports are
under `nodes/`; independent batch reviews and completion commits will be recorded
as the run proceeds. The live wrapper distinguishes planned pages from available
drafts and carries noindex; availability does not itself assert independent review.
