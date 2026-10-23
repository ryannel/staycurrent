# Evidence index

## Commission and preservation

- commission.md, writer-input.md, reader-outcomes.json, example-facts.md, child-reading.json: actual initial commission and inputs.
- handoff.md and assignments/: exact assignments and operational follow-ups.
- input-manifest.json, earlier-samples-baseline.json, final-verification.json: input hashes and final preservation check.
- first-return/ and first-return-sha256.json: earliest captured complete source.
- author-version-v1/, frozen-v1.json and frozen-v1-addendum.json: original complete author snapshot, served at port 4360.
- review-version-v2/ and frozen-v2.json: reviewed source and immutable r07 render, served at port 4362.

## Reference delivery and writing

- reference-tool-audit.md/.json: initial writer’s actual reference-read delivery and limits.
- reference-reading/, reference-reading-clean/: original rendered reference content exports and provenance manifests; clean variant decodes code markup.
- reference-delivery-repair-v2.json: bounded reference reads delivered before repair source writes.
- writer-record.md, author-teaching-notes.md, repair-record-v2.md: author/repair records, withheld from blind readers.
- coordinator-first-read.md, coordinator-final-reading.md: root’s own complete readings and judgements.

## Reviews and decisions

- reviews/v1-*.md: four independent first perspectives.
- decisions.md: consolidated accepted decisions, pass conditions, confirmation results and optional low finding.
- reviews/v2-confirm-*.md: four fresh relevant repair confirmations.
- reviews/v2-final-practitioner.md, reviews/v2-final-editorial.md: fresh final complete readings.
- confirmation-scope-v2.md, final-reading-inputs-v2.json, review-dispatch.json: scope/input boundaries and dispatch/completion record.
- experiment-result.md: quality result, timing and experimental limits.

## Execution, rendering and checks

- native-check.json: observed PostgreSQL 18.6 query/concurrency outcomes; owned temporary instance stopped and removed.
- mechanical-receipt-v1.md, mechanical-limits-v1.md, mechanical-receipt-v2.md: clean evidence extracts for reviewers.
- rendered-mechanical-receipt.md, evidence/repair-v2-mechanical-receipt.md: detailed author render checks and limitations.
- evidence/native-applicability-v2.json, evidence/repair-v2-data-check.json: unchanged executed inputs and current derived display facts.
- preview-structure-v1.json, preview-structure-v2.json, build-receipt-v2.json: actual draft structure before/after and successful final builds.
- evidence/v1-opening.png, evidence/v2-opening.png: captured first-figure comparison.
- temporary-build-cleanup.json: deleted unserved intermediate builds; original/final immutable previews retained.

## Reading links

- Reviewed: <http://127.0.0.1:4362/review/relational-full-reference/>
- Original author return: <http://127.0.0.1:4360/review/relational-full-reference/>
- Fixed references: <http://127.0.0.1:4350/review/examples/sequences/>, <http://127.0.0.1:4350/review/examples/indexes/>, <http://127.0.0.1:4350/review/examples/storage/>

These are local review previews, not published articles.
