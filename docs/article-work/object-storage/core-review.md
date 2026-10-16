# Core article review and repair

Reviewed 16 October 2026. Scope: `keys-and-layout.md`, `transfers.md`,
`consistency.md`, `publication.md` and `database-records.md` under the object-storage
article directory. This is an informed technical/editorial review, followed by
repairs and a continuous reread. It is not an uncued reader pass or rendered-media
review. Only those five articles and this record were edited.

The drafts already establish useful mechanisms. Keys separates application identity
from location; consistency follows a lost update through a conditional replacement;
publication keeps a reader on one manifest; database records distinguishes durable
state from a successful browser upload. I preserved those explanations. The material
repairs concern decisions that stopped one step too early.

## Findings and repairs

| Finding | Repair and consequence |
| --- | --- |
| Multipart completion was described clearly, but a reader could still equate accepted parts with the complete intended recording. | Added a concrete 13 MiB retry schedule and the contrasting valid 10 MiB completion when part 3 is omitted. Missing listed parts/wrong ETags cause `InvalidPart`; omitted intended bytes require the application's expected size/checksum to detect. Scoped the example to an unused destination with no competing writer. |
| Conditional conflicts were discussed without completing the operation-specific response branches. | Named the stale ETag's 412 and explained absent-current-object 404 and concurrent 409. A multipart 409 requires reinitiation and reupload, unlike simply repeating a PUT. Preserved the separate unknown-outcome reasoning for lost replies. |
| “Retain beyond both” cache lifetime and reader duration could be read as taking their maximum. | Derived the sum using publication at 12:00, cache serving A until 12:05 and a ten-minute reader finishing near 12:15. Included permitted stale serving and retries in the bound. |
| Rechecking that a generation was unpublished did not close the collector/publisher race. | Added the interleaving that breaks a newly published generation. The simple collector waits for a stopped publisher and resolved in-flight publication; resumed work uses a new generation. More concurrent designs must coordinate publication/pins/collection. |
| The manifest could appear to make independently gathered source data consistent. | Explained that it preserves the file set the exporter constructed. The exporter still needs an appropriate source snapshot or other defined boundary. |
| Pending cleanup named abandonment but did not explain why a late validator could not publish it. | Both ready and abandoned transitions now require pending state. The text follows both winning orders, then distinguishes publication prevention from eventual cleanup of late uploads. |
| Deletion checked references but left a race with new attachment. | Added a deleting state checked under coordination on the image record by both collector and attaching operations. The durable deletion job remains retryable after a crash. |
| Two scope details were too broad. | Clarified that user-defined upload metadata is the copy-to-change mechanism while annotations can change separately; scoped the alternative rename API to Express One Zone directory buckets. |
| Outbox continuation used a nonexistent route. | Replaced `/relational/outbox/` with the existing `/relational/adding-another-system/`. |

The publication figure now names an origin reader after publication, so its new
generation does not contradict the later cached-reader example. The consistency
opening also allows subsequent writes/deletes to change the visible state. The
database transaction records the exact delivery identity validated by the worker.

## Evidence checked

These AWS sources were read during this review. Claims are documented behaviour;
no AWS account, request execution or cloud resources were involved.

- [Object consistency](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel): single-key atomic visibility and separate bucket-configuration propagation. Manifest/source-snapshot and collection protocols are application reasoning built on that boundary.
- [Conditional writes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html): current-object evaluation, delete-marker treatment and 412/404/409 branches. The article retains the distinction between a definite failed attempt and an earlier attempt whose reply disappeared.
- [Multipart process](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html): client-maintained part/ETag records, verification listings, assembly and outstanding-part cleanup.
- [CompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html): ordered named parts, `InvalidPart`, consumed/aborted upload identities and embedded errors after initial HTTP 200. The shorter recording is a design inference from completing only valid named parts, with no independent expected-size/full-checksum constraint supplied.
- [Multipart limits](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html): the 5/5/3 MiB example satisfies minimum-part rules. The article links maintained limits instead of repeating a stale maximum object size.
- [ListObjectsV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html): bounded responses, grouping and opaque continuation tokens. No multi-request snapshot is assumed.
- [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html): version IDs, range requests and conditional reads.
- [Metadata](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html): upload metadata, separate tags/annotations and ordinary-list versus metadata-query responsibilities.
- [Directory rename](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-rename.html): Express One Zone scope, distinct from a general-purpose copy/delete migration.

The previously researched presigned-URL and versioning evidence in
`operations-evidence.md` supports the upload-authority and delete-marker boundaries.
No SQL schedule or cleanup implementation is claimed as executed here.

## Continuous editorial reread

The revised sequence carries identity from keys into transfers, then into
conditional writes, manifest publication and database references. Each opening
establishes its subject before introducing the concrete problem. The useful
progression in consistency—both writers read r1, A publishes r2, B receives a
conflict, then B must reconsider its body—remains intact. The lost-reply section
still avoids inferring historical publication from current state alone.

Transfers now uses the same 13 MiB recording to explain both retrying and checking
completeness. The added table gives each response a caller action; the following
checksum section explains why that action needs more than an ETag. Publication's
retention example stays with reader A rather than introducing an unrelated storage
policy. The cleanup additions name the failing interleaving and give a bounded
resolution, rather than appending generic cautions.

Database records now follows pending through publication and retirement without
treating state labels as coordination by themselves. Its broad reconciliation
ending remains appropriate: it describes how missing work is found without
claiming that an inventory sweep establishes a transaction across systems. No
required technical or prose-flow repair remains from this source-level pass.

## Integration still required

The article prose promises these sandbox behaviours. They were not available to
execute during this review and must be reconciled with the implemented lessons:

- `keys`: compare `photos/` with `photo`, then add a key. Tiny listings explicitly
  omit real pagination.
- `multipart`: reject completion naming a missing part, repair it, complete and
  GET. A separate abort lesson is also promised. Short text parts explicitly omit
  S3 minimum sizes and network behaviour.
- `conditions`: hold an old ETag, accept one writer and reject the other. A separate
  lost-reply lesson must apply the write while concealing its response.
- `publication`: expose mixed prices/stock, then retain an old manifest while
  publishing a new one, and demonstrate the broken old reader after deletion.
- `lifecycle`: interrupt pending/upload/publication, inspect both states and repair.
  It must remain labelled an application model rather than a database/S3 transaction.

These are release dependencies, not observed passes. The coordinator still owns
lesson verification, internal-route checks, phone/desktop light/dark inspection,
the independent uncued reading and `pnpm build`. No build or commit was run here.
The prose is ready for that integration review; the complete pages and practical
outcomes are not certified by this record alone.

## Vocabulary follow-up after independent reading

On 16 October 2026, the fresh reading identified unexplained “control plane”
terminology in consistency. Added its meaning at the existing bucket-configuration
boundary: the API used to configure the service. Rereading the surrounding
single-key and cached-copy paragraphs confirms that the small gloss preserves the
argument and adds no new guarantee. The independent first-reading record remains
unchanged as evidence of the initial experience.
