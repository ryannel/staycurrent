# Relational and object-storage heading and coverage review

16 October 2026. Commission: apply the revised heading-tree, transition and technical
completeness review to every written article in both collections, repairing material
issues. Existing publication and push-to-main authorization applies to these repairs.

## Scope and work list

- [x] Inventory the actual published destinations and capture assembled headings.
- [x] Review 14 relational foundations/introduction/practice destinations.
- [x] Review 12 relational operations/choice destinations.
- [x] Review all 11 PostgreSQL articles and implement bounded editorial repairs.
- [x] Review 15 object-storage introduction/focused/practice destinations.
- [x] Check sandbox entrances and article-to-lesson links as supporting navigation.
- [x] Independently recheck repairs, including new technical explanations.
- [x] Build, inspect rendered results, preserve anchors and prepare the reviewed work for publication.

There are 52 articles and practice guides, plus two sandbox entrances. Redirects and
planned unrelated families are not counted as articles. `before-inventory.json`
preserves routes, source hashes, word counts and actual heading trees, including
component headings. The text artifacts used for sequential reading distinguish
optional disclosures from the main argument. They omit scripts, styling and SVG
internals, and do not establish live model behaviour or visual quality. Sandbox
extraction can include hidden lesson panels; its visible state is checked separately.

Each informed reviewer records expected understanding from the title/opening before
reading the tree/body. Findings distinguish navigation, technical completeness and
accuracy. Existing external sources are investigated when a changed claim needs it;
this is not represented as a new source-by-source factual audit of the entire site.

## Records

- `relational-fundamentals.md`: design, queries, transactions, indexes/storage,
  introduction, checkout and local practice.
- `relational-operations.md`: performance, scaling, operations and product choices.
- `postgresql.md`: the eleven implementation articles.
- `object-storage.md`: introduction, thirteen focused articles and real-S3 practice.
- `postgresql-recheck.md`: another reviewer's check of the eleven PostgreSQL repairs.
- `object-delivery-recheck.md`: independent reading and source check of the cache recipe.

Concurrent workspace edits to shared skills, site navigation/configuration and the
field guide are outside this commission's changes and must not be bundled into its
commit. Changes belonging to this review are tracked by explicit file paths.

## Outcome

All 52 articles and practice guides received a subject/opening expectation check,
a heading-tree review and a full-body reading. We changed 37 article sources and
retained 15 after review. The two sandbox entrances received a supporting navigation
check. This pass did not rerun every lesson or repeat the earlier full sandbox UX
review.

Most repairs make existing teaching easier to find. They name mechanisms such as
keyset pagination, GIN indexes, multipart upload and idempotent processing; separate
foreign tables from local partitioning; and group worked examples under the concept
they illustrate. The outbox case, migration lock queue, publication cleanup races
and product-contract comparisons now have clearer parent/child relationships and
transitions. Existing useful questions and procedural worksheet headings remain.

Three bounded completeness repairs add explanations:

- Constraints now explains immediate versus deferred checking, failure at commit
  and changing a deferrable constraint back to immediate checking.
- Object delivery now gives separate concrete policies for immutable public assets
  and changing public manifests. Independent review caught CloudFront's stale
  fallback during origin failure; the final recipe includes `stale-if-error=0` and
  explains the resulting availability choice alongside a zero minimum TTL.
- Storage classes now explains the consequence of losing the Availability Zone
  containing the sole One Zone-IA copy, with the corresponding recovery requirement.

The S3 worksheet's footer no longer offers itself as onward reading. This small
repair is in `ObjectArticle.astro`; the other articles retain their practice link.
Checkout's onward links now identify draft destinations as drafts.

## Verification

`before-inventory.json` and `after-inventory.json` preserve all 54 assembled heading
trees and article-source hashes. Every previously captured heading/section anchor
still resolves. Twenty-four aliases preserve renamed Markdown fragments; static
Astro IDs remain. The final delivery hash in `after-inventory.json` supersedes the
object reviewer's earlier snapshot, taken before the independent cache correction.

`browser-checks.json` records 54 successful page loads, 216 width/colour-scheme
checks (390 and 1280 pixels, light and dark), 881 internal link occurrences and 99
valid sandbox lesson links. No missing fragments, duplicate IDs, visible empty
headings, horizontal page overflow or page-script errors were found. The check
inspected 260 contents links. The modelling article deliberately uses shorter
subject labels for several longer headings; these are meaningful summaries and
all point to the intended explanation.

Eight screenshots in `screenshots/` were visually inspected: deferred checks on a
phone, PostgreSQL sharding contents on a phone, PostgreSQL indexes in desktop dark
mode, object cache policies on a phone, the nested outbox case on a phone, schema
lock nesting on desktop, and both sandbox entrances. Long code lines retain local
horizontal scrolling; the page itself fits. The screenshots include concurrent
shared-navigation work, which is outside this commit.

`constraint-timing-check.json` records a focused PGlite 0.5.8 / PostgreSQL 18.3
execution: a deferred reference repaired before commit succeeds; a missing parent
at commit rejects the transaction; changing to immediate checking rejects an
outstanding violation. This is a local engine check, not a multi-connection server
experiment. The new AWS storage-class explanation was checked against the official
storage-class comparison. The cache correction was checked against AWS expiration
rules and HTTP caching specifications; the independent report records its source
and resolution.

The shared workspace build and a build to a separate output directory passed.
Because other work is in progress in this checkout, an additional publication
snapshot contains only HEAD (`07c87f5`) plus this review's 38 source-file changes.
Its own `pnpm install --frozen-lockfile --offline` and `pnpm build` passed, producing
77 pages. The snapshot was rebuilt with its own dependencies after pnpm rejected
reuse of the workspace's differently configured modules. No shared dependencies
were removed or changed.

`publication-browser-checks.json` repeats the route, anchor, contents, sandbox-link
and viewport checks against that isolated publication build. Deployment is through
the existing Publish workflow when this review is pushed to main. The article
review is complete; publication status is reported separately after that run.
