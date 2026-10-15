# Body revision and review

15 October 2026. The user asked for natural, direct body prose across Indexes,
How a query runs, and Storage and durability after rejecting their headings.
This pass revises the three articles and their seven figures. It also updates the
style, authoring and review skills. The earlier ready verdict remains a record of
that review, not evidence that the user accepted the writing.

## What changed

The main problem was cumulative: paragraphs repeatedly announced a lesson, used
abstract route/work language, or ended by describing the documentation. Several
sentences sounded like verification notes. The revisions stay with the orders,
rows, page contents and log records being explained. Source links remain, often
attached directly to their claims. Necessary distinctions and qualifications remain,
including visibility checks, per-loop counts, memory limits and durability settings.

The author and editors read original human writing references. Strong existing
explanations were preserved, including the two sorts and the old/new price versions.
Natural writing was not treated as a short-sentence target or a ban on contrasts.

## Review and repairs

- [Editorial review](body-editorial-review.md): initial passage-level diagnosis,
  then a continuous reading of all three revised articles with separate judgements
  about writing and comprehension. It caught an overbroad B-tree sentence after
  simplification and a repeated conclusion; both were repaired and rechecked.
- [Technical review](body-technical-review.md): compared revised sources and figures
  with the preceding versions and checked consequential claims. It caught a reset
  instruction that would fail because the setup creates existing tables. The article
  now requests a new, empty practice database. The storage opening now states its
  default-durability assumption before the commit guarantee.
- [Independent first reading](body-first-reading.md): a new agent read 39 assembled
  HTML chunks in sequence, saving observations before opening each next chunk. It
  received audience and context-free guidance, without author intentions or earlier
  findings. Its questions about unfinished versions and checkpoints were resolved
  by the following sections. It also found an overbroad statement about the mutation
  checks: the prose now names the exact row-count and corrected-total assertions.
  The parameterized-plan explanation now says why reuse across different status
  values matters. Later local revisions were rechecked separately from the frozen log.

The first text extraction removed indentation from plan lines. An additional
[exact plan-text export](body-plan-layout.txt) resolved that delivery defect for the
reader; its initial observation is preserved. This reading is not a human novice
study or a browser-layout approval.

The compact later-key index-condition caveat remains, with linked documentation.
Its full mechanics are optional depth and do not carry the worked index choice.
The short crash-C recap remains so the body explains the retry consequence without
requiring the reader to study the figure. These are deliberate scope decisions,
not unresolved blockers or proof that no further editorial improvement is possible.

## Skill changes and validation

The earlier review conflated technical/explanatory success with writing quality.
The style skill now asks for connected-passage judgement and a concrete alternative
when phrasing feels strained. The review skill explicitly separates writing from
comprehension, including cumulative patterns across paragraphs, and requests a
whole-piece reread after repairs. Authoring guidance asks for review additions to be
integrated into the explanation. No phrase blacklist, score, fixed paragraph form,
or extra mandatory reviewer role was added.

A fresh agent applied the revised guidance to the unchanged Pagination and large
results article, without an expected verdict or earlier findings. Its
[review](skill-forward-review.md) preserved the main explanations and proposed three
local edits for repetition and abstraction. The [input record](skill-forward-input.json)
identifies the source and extracted chunks. These suggestions were not applied to
that fourth article. This is a bounded forward test, not a controlled comparison
against the old skills or proof of future reliability. All three installed skill
entrypoints passed the skill validator. The writing reference preserves the user's
feedback and marks these new passages as awaiting their judgement.

## Verification and disposition

The executable article constants, SQL component code and external source URL sets
are unchanged. The original executed SQL evidence remains applicable; this prose
pass did not rerun or claim new database experiments. Inspection of the downloadable
index script confirmed the precise mutation assertions now described.

The build succeeds for all 56 pages. The internal-link audit checks 1,309 links with
no errors. The in-app browser showed no page or figure overflow at 390 and 1280
pixels, no broken images, and retained noindex on all three pages; see
[measurements](body-layout.json). The changed plan label was visually checked on a
phone-width view, and storage figure/body copy on desktop. This pass used the
browser's current dark appearance. CSS was unchanged; the earlier light/dark pixel
checks were not repeated. The user's existing Indexes preview is refreshed.

Ready as revised working drafts for the user's reading, with independent findings
and limits preserved. Nothing was committed or published. Current article and figure
hashes are in [body-revision-hashes.json](body-revision-hashes.json).


## Further user feedback on the opening

The user rejected the Indexes opening after this pass. It entered a shop scenario
before orienting the reader and spent too much space announcing the investigation.
The writing readiness judgement above missed that problem. The opening and its
transition into B-trees have been rewritten, and the article brief now states what
the introduction must explain instead of fixing its opening scenario. A bounded
independent reader could identify the index's contents, grouped entries versus
scattered rows, and maintenance costs; they correctly distinguished the deferred
search mechanism and composite ordering from what the introduction already teaches.
Their two substantive findings were resolved: keys are now defined locally, and
the B-tree introduction no longer implies that a sorted list requires a linear
search. This is a local repair awaiting the user's reading, not renewed evidence
that all three openings meet their expectations.


The user subsequently called the revised Indexes direction “better” and asked to
apply it to the other openings. That work and the final context-led skill changes
are recorded in [opening hardening](opening-hardening/review.md). The later
[six-article review](../six-article-review/review.md) includes a full reading of
How a query runs. Hashes above identify the earlier body revision; later records
identify the subsequent sources.
