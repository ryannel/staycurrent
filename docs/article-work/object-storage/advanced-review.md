# Review of Tables, Vectors and Amazon S3 in practice

Reviewed and repaired 16 October 2026. This is an informed independent review of
the coordinator's three drafts, following the earlier planning and primary-source
research. It is not a blind reading: the reviewer already knew the collection's
intended outcomes. Scope is the three articles and this record; no shared code,
build, commit or AWS execution was performed.

## First reading of the drafts

Tables establishes the format, catalog and engine as separate participants, then
follows a useful append/compaction race. I could explain why F3's existence does not
commit it, but had to supply the exact post-compaction file set and what happens to
an old reader's files. The later metadata-pruning example quietly reassigned the
same file labels to different dates. The maintenance section named delayed-commit
risk without following it through a failed read.

Vectors gives a derivable four-row filter example and correctly separates exact
model arithmetic from managed approximate search. Its source/index section lacked
the race that makes source revision identity necessary: two jobs can overwrite a
shared key in the wrong order. The evaluation advice named quality but did not give
a reader an exact comparison they could perform.

S3 provides useful resource selection and compatibility scope. Its failed-request
section listed things to inspect but did not finish a diagnosis. Directory-bucket
feature differences were described vaguely enough that a reader might still assume
version recovery or event notifications were available there. Append and rename
were correctly scoped, but rename's retry mechanism deserved a concrete outcome.

## Repairs

### Tables

Added a short Parquet definition and scoped the metadata diagram's append-only
example. Row-deletion information belongs to the real format and engine too.
A state table now follows A → compaction C → rebased append D, showing selected
files and unpublished work separately. The text derives why reading F1/F2 alongside
F12 would duplicate purchases and why an old reader still needs F1/F2 retained.
The date-pruning example now explicitly starts a separate layout.

The maintenance example now follows a stalled four-day-old file past a three-day
unreferenced threshold: once marked noncurrent, a later metadata commit can name a
file readers cannot use. It distinguishes preventing future cleanup from restoring
already inaccessible data. The V3/Athena compatibility claim is dated.

Technical basis: [Iceberg reliability](https://iceberg.apache.org/docs/latest/reliability/),
[S3 metadata-location update](https://docs.aws.amazon.com/AmazonS3/latest/API/API_s3Buckets_UpdateTableMetadataLocation.html),
[maintenance considerations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-considerations.html)
and [V3 compatibility](https://docs.aws.amazon.com/AmazonS3/latest/userguide/working-with-apache-iceberg-v3.html).
The file sets and delayed-job schedule remain illustrative, not reported service runs.

### Vectors

Made the creation-time dimension/metric boundary explicit. Added exact filtered
recall evaluation: eight of the exact nearest ten gives recall@10 of 0.8, while
answer usefulness remains a separate question. The toy arithmetic is unchanged.
Index-mode discussion now names `GetIndex` and the per-query Enhanced option.

Added a revision-7/revision-8 race. Distinct revision/model vector keys prevent one
job from replacing another revision's vector; a conditional application-database
update prevents an old completion from moving the published revision backwards.
The consequence remains visible: old records can still occupy query results until
cleanup, and filtering them against published application state can reduce the
usable result count. Monitoring now follows that consequence rather than repeating
a generic synchronization warning.

Technical basis: [index configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-indexes.html),
[QueryVectors](https://docs.aws.amazon.com/AmazonS3/latest/API/API_S3VectorBuckets_QueryVectors.html)
and [index mode](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-index-mode.html).
The revision protocol is an explicitly introduced application design, not a claim
that S3 Vectors provides a cross-service transaction.

### Amazon S3 in practice

Named the unsupported directory-bucket features and added the supported lifecycle
expiry/abort operations with their session permission dependency. Added an identical
rename retry after a lost response, then the changed-parameter/token mismatch.

Completed a request diagnosis in a general-purpose bucket: current reads work,
version-specific reads fail, the role lacks `s3:GetObjectVersion`, and verification
repeats the actual version request and checks returned identity/content. Other
policy layers and KMS remain subsequent diagnostic branches. The missing-key
403/404 case now names `s3:ListBucket`. Removed closing advice aimed at the author
of the collection and replaced it with a reader's concrete compatibility record.

Technical basis: [directory differences](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-differences.html),
[directory lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-lifecycle.html),
[RenameObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_RenameObject.html)
and [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html).

## Continuous editorial reread

Read each assembled article from opening through onward links after the substantive
repairs, then reread the final small edits in context. Tables now keeps the reader's
file sets visible across the race and explicitly resets the example before the
later retention failure. Its opening introduces the format's job without requiring
prior Iceberg knowledge. The figure and state table do different work: reference
containment first, changing selected files second.

Vectors' strongest passage remains the four-row distance calculation: every number
needed to derive the filtered result is present. The longer source-revision example
now gives the lifecycle advice a reason and preserves its retrieval cost. During
rereading, removed a redundant paragraph about missing sources, split the recall
paragraph, and made the database publication check explicitly conditional.

S3 now has a complete operational example rather than only diagnostic prompts.
Split the rename mechanism from its retry story so each paragraph has one job.
Explicitly return to a general-purpose bucket before the version-permission example,
so its placement after directory buckets cannot imply directory versioning support.
The specialised features remain a bounded resource decision rather than an API list.

## Verification and handoff

All 23 original external article links returned HTTP 200 at their intended URLs
and had the expected documentation titles. In particular,
`s3-vectors-indexes.html` is correct and needed no change. The newly added directory
lifecycle link also returned HTTP 200. Current primary docs were reread for repaired
claims; `advanced-evidence.md` preserves the wider source context.

Existing internal targets for the assessment, object/database lifecycle, event
workflow and real-service practice guide were present. The sandbox route was still
being built by the coordinator when checked, so lesson IDs, actual transitions,
rendering, keyboard use and browser execution were not verified in this review.
The table lesson must use its declared simplified manifest conflict, and the vector
lesson must match the four coordinates and squared distances printed in the article.
Neither article claims that these lessons emulate the managed services.

Status: prose and source review complete; the articles are ready for integrated
lesson and rendered-page review. No unresolved material source problem was found.
This record does not claim build success, visual acceptance or an executed AWS lab.
