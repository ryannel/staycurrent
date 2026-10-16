# Specialised S3 storage: evidence for authoring

Checked 16 October 2026 against the primary sources linked below. This records
published service behaviour and proposed teaching examples. No AWS requests were
executed, credentials used, or remote resources created. Examples below are
illustrative until independently implemented and verified. Current documentation
must be rechecked if authors change resource type, format version or index mode.

## S3 Tables: from files to a committed table

The reader decision is whether the application needs named bytes, an analytical
table with a shared format and catalog, or a database that supplies its transactional
application model. Start with how a reader discovers a table's contents.

The [Apache Iceberg specification](https://iceberg.apache.org/spec/) describes
immutable table metadata and an atomic update of the pointer selecting current
metadata. A snapshot identifies table contents; in format versions 1–3, a manifest
list names manifests, which describe data files and their statistics. A reader
retains its loaded snapshot until refresh. Writers prepare new files and metadata
before attempting the catalog change; a competing commit requires checking and
retrying against the new state. This supports a diagram of catalog pointer → table
metadata → snapshot/manifest list → manifests → data files. The current specification
also discusses version 4's changed manifest structure: do not silently borrow that
structure for an S3 Tables V2/V3 example.

The [S3 Tables metadata-location API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_s3Buckets_UpdateTableMetadataLocation.html)
requires both `metadataLocation` and `versionToken`, returns the new location and
token on success, and documents HTTP 409 `ConflictException` for a conflicting
previous write. Locations must be within the table's warehouse location. The
illustrative sequence should read current metadata/token, write new data and
metadata, attempt the pointer change, then show the losing writer reloading before
replanning. The API's “retry” wording does not justify blindly repeating a stale
application decision.

A useful worked case begins with files F1/F2 in snapshot A. Writer W adds F3 while
maintenance replaces F1/F2 with compacted F12. Both start from A. Show the failed
commit, the still-unpublished F3, and the distinction between reusing a safe prepared
file and recomputing a write whose assumptions no longer hold. This is a proposed
teaching case, not an observed S3 transaction transcript.

### What S3 manages

[Maintenance for tables](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-maintenance.html)
describes compaction and snapshot management, both enabled by default. Compaction
combines small files and applies row-level deletes. The documented target is 512 MB,
configurable from 64 to 512 MB. Snapshot configuration defaults to a minimum of one
snapshot and maximum snapshot age of 120 hours. Expired snapshots can make their
uniquely referenced objects noncurrent. Do not equate an expired snapshot with an
immediately physically deleted file.

[Table-bucket maintenance](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html)
owns unreferenced-file removal. Its defaults are three `unreferencedDays` and ten
`nonCurrentDays`. An old unreferenced object becomes noncurrent, then is permanently
deleted after the second period. External references do not protect a file from
this table's cleanup. Recovering noncurrent objects requires contacting AWS Support;
this is not normal application time travel or a browser-operated undelete feature.

[Maintenance considerations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-considerations.html)
explicitly describes optimistic conflicts between user writes and compaction.
Compaction retries; applications should handle conflicts too. It also warns about
files written long before their commit: if the unreferenced age threshold arrives
first, the object can become noncurrent and a later commit referencing it can leave
queries failing. Therefore choose retention longer than the maximum anticipated
write-to-commit interval, including retries. This is a better maintenance example
than claiming that automatic compaction eliminates operational decisions.

### Access, format and execution boundaries

[S3 Tables access methods](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-access.html)
distinguishes AWS Glue Data Catalog integration from direct access. Query engines
such as Spark or Athena execute queries; S3 Tables is not itself a general SQL
execution endpoint. The direct REST route fits a bounded single-table-bucket
example; broader catalog and governance needs can justify the Glue integration.

The [S3 Tables Iceberg REST endpoint](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integrating-open-source.html)
translates Iceberg REST operations to S3 Tables operations. Its URI is
`https://s3tables.<region>.amazonaws.com/iceberg`, warehouse is the table-bucket ARN,
and signing name is `s3tables`. Catalog reads, data reads and commits require their
respective permissions. An article can show a configured client and the resulting
request flow without implying that ordinary S3 object permissions are sufficient.

[S3 Tables overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html)
confirms Iceberg V3 support and the separate `s3tables` permission namespace.
[Working with Iceberg V3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/working-with-apache-iceberg-v3.html)
says upgrading V2 to V3 is one-way through standard operations and requires checking
every engine's compatibility. Its current compatibility table says Athena cannot
read V3 tables. Select an explicit format and engine for any exercise; a generic
statement that all listed AWS engines support every S3 Tables capability would be
wrong. The foundation can teach the V2/V3 shared metadata chain without surveying
all V3 data types.

A browser can demonstrate pointer selection, competing commits and file reachability
as a labelled model. It cannot validate managed compaction, permissions, SQL engine
integration or AWS cleanup timing. A local Iceberg experiment would verify format
and client behaviour only, and must be reported separately from S3 Tables execution.

## S3 Vectors: the embedding, index and application remain distinct

The reader should be able to trace source content through an embedding model into
an index, send a query vector produced by a compatible model, interpret distances
and filtered results, and decide how source updates and access changes reach the
index. Storing a text file does not automatically create its embedding.

[Vector concepts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-vectors.html)
identifies the vector key, numeric data and metadata, and places embedding generation
in a separate model invocation or integration. [Vector indexes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-indexes.html)
requires a dimension and distance metric (cosine or Euclidean). The metric and
non-filterable metadata keys are creation-time decisions. Treat a model change as
an application migration question; matching dimensions alone does not demonstrate
that two embedding spaces are compatible.

The [S3 Vectors overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html)
states that writes are strongly consistent and recently written vectors are
immediately accessible. This is not evidence of a transaction connecting source
objects, SQL records and embeddings. The article should retain that distinction
when showing a stale source reference or an indexing failure.

### Filtering now depends on index mode

[Metadata filtering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-metadata-filtering.html)
currently distinguishes `ENHANCED` and `CLASSIC`. Enhanced indexes apply the filter
before similarity search. Classic indexes evaluate filters while searching
candidates and can return fewer than the requested top K for selective filters.
Vector buckets created on or after 30 September 2026 default new indexes to Enhanced;
older buckets default to Classic. Do not present the older filter behaviour as an
unqualified service property. Enhanced supports `$startsWith` and a limit of 100
filter constraints, with each value in an `$in` list counting separately.

[Index-mode migration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-index-mode.html)
provides an explicit index update path and per-request `queryMode: ENHANCED` on a
Classic index. Authors should state the mode used by the worked request and inspect
it rather than inferring it solely from when they created an index.

[Querying vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-query.html)
describes the query vector, index ARN, top K and optional metadata filter. Keys are
returned by default; metadata and distances are optional. Filtering on a field
declared non-filterable returns 400. Large result sets can be paginated.
[QueryVectors API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_S3VectorBuckets_QueryVectors.html)
is the authoritative request/response contract for an eventual real-service example.
A tiny exact-distance browser calculation is useful for explaining filtering and
ranking, but is not an emulation of managed approximate retrieval or measured recall.

### Permissions change with the request

[Identity and access management](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-access-management.html)
says `s3vectors:QueryVectors` alone permits unfiltered queries returning keys and
distances. Metadata filters or `returnMetadata: true` also require
`s3vectors:GetVectors`. This gives a precise failure example: the same caller's
plain query can succeed while its filtered query lacks permission. Metadata filters
should not be described as an independently enforced tenant-authorization boundary
without a policy and application design that establishes it.

[Vector encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-data-encryption.html)
documents default SSE-S3 and optional customer-managed KMS keys. Index encryption
can override bucket encryption at creation; bucket and index settings cannot later
be changed. This is a bounded migration and access-dependency consequence, not a
reason to turn the article into an encryption survey.

A useful example keeps four source passages, their IDs, vectors and category metadata
visible. First derive an exact filtered result in a small model. Then show the real
API shape, mode and permissions, and discuss measured relevance, approximate recall,
source deletion and retry as separate questions. Do not invent measured S3 latency
or claim its published latency marketing as an application guarantee.

## Directory buckets: scope the changed object operations

The resource-selection article should contrast general-purpose buckets with a
stated S3 Express One Zone workload. [S3 resource overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
places Express data in one Availability Zone. Directory buckets can also serve
Dedicated Local Zone residency use cases with a different storage class; “directory
bucket” and “S3 Express One Zone” should not be treated as interchangeable in all
claims.

[Differences for directory buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-differences.html)
documents unordered listing, slash-delimited prefix restrictions, regional management
and zonal data endpoints, and session-related permissions. It also lists absent
Versioning, Object Lock, replication, event notifications and object tags. Directory
ETags are not MD5 checksums. These differences change existing application assumptions;
a directory bucket is not simply a faster drop-in bucket for the collection's entire
recovery and event path.

[Appending objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-append.html)
is scoped to Express One Zone. `PutObject` supplies an offset equal to the existing
object size and uses a session. Each successful append adds a part; 10,000 total
parts includes any original multipart-upload parts. The documented append request
maximum is 5 GB, with no minimum. This differs from uploading unexposed multipart
parts: append supports reading the object as it grows. A worked example can append
at offset 12 and then revisit the client's state after a lost reply; check exact
error semantics before implementing that retry lesson.

[Renaming objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-rename.html)
documents atomic rename without copying object bytes, limited to Express One Zone.
[RenameObject API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_RenameObject.html)
limits the rename to the same directory bucket. Source and destination conditions
are separate. `If-None-Match: *` protects an existing destination with a 412 response.
A client token makes identical retries idempotent; changing parameters under a used
token causes a mismatch error. This is a useful example of why retry policy follows
the actual operation contract. It does not establish atomic directory-tree rename
or a multi-object transaction.

[Directory lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-lifecycle.html)
supports expiry and incomplete multipart cleanup, but not storage-class transitions.
It requires explicit permission for the lifecycle service principal to obtain a
ReadWrite session. Do not repeat the older blanket claim that directory buckets
have no lifecycle support.

The browser foundation should remain scoped to general-purpose bucket semantics.
Directory append/rename can use a separate explicitly scoped model or diagram.
Do not silently add them to the ordinary sandbox's command set, because doing so
would change the interface its earlier lessons teach.

## Evidence still needed for concrete exercises

The sources establish the proposed mechanisms and boundaries. They do not establish
an observed AWS run, current SDK installation, exact regional pricing, query latency
or recall. Before publishing a runnable specialised-service worksheet, choose the
client and format/index mode, inspect its actual command schema, record any local
execution, and label remote steps that were not executed. Prefer one clear exercise
per advanced article over a broad checklist of service features.
