# Object storage: proposed coverage map

18 October 2026. Proposal for discussion within the [field plan](../databases-and-storage-plan.md),
before independent planning review or writing. Use the [shared map conventions](databases-and-storage.md#map-conventions).

This map reconstructs the existing collection from
`src/lib/object-storage-collection.ts`, the introduction, practice and sandbox,
and `docs/article-work/object-storage/`, before proposing its boundaries. Its
introduction and thirteen focused articles are already published. The new plan
does not reset that status or establish that their proposed revisions are done.

An expert user chooses object boundaries and keys, transfers and validates bytes,
handles concurrent requests and uncertain outcomes, publishes application state,
controls authority, delivers content and proves retention/recovery. Amazon S3 is
the worked implementation; service-specific claims must stay identifiable.

Running example: tenant T4 uploads P7's photograph using upload U17; the database
tracks pending/published state and immutable object revisions. Dataset generation
G7/G8 supplies the manifest case. Keep version IDs, checksums and application IDs
distinct. Base: `/learn/databases/object-storage/`.

| ID | Proposed page and role | Owned sections and reader outcome | Teaching form | Entry needs; onward homes | Existing material / destination |
| --- | --- | --- | --- | --- | --- |
| O01 | Object storage — introduction | Named bytes and metadata; bucket/key/request; objects against files/rows; request-level operations and costs; consistency scope; application ownership; fit and limits. Understand the byte service before using it as a filesystem or database. | Upload/fetch P7 photo and assemble the product page from database plus bytes. | No S3 knowledge. O02–O04/O15. | Existing collection entrance `/learn/databases/object-storage/`. |
| O02 | Keys, metadata and object layout — deep dive | Object identity; prefixes/listing and pagination; immutable naming; object size/boundaries; metadata/tags; content type and encoding; layout for access and retention. Choose a namespace that supports the work. | U17 staged/published keys and a dataset split three ways; inspect exact listing results. | O01; O03 transfer, O05 publication; A07 analytical file layout. | Existing `keys-and-layout/`. |
| O03 | Uploads, downloads and integrity — deep dive | Whole/range requests; multipart create/parts/complete/abort; resumability/retries; checksums against ETags; conditional download; incomplete work and cleanup. Verify the bytes and finish ambiguous transfers. | Interrupted multipart upload, uncertain completion and verified final object. | O01; O04 concurrency and O06 signed request authority. | Existing `transfers/`. |
| O04 | Consistency and concurrent writers — deep dive | Request-level read/list guarantees; conditional create/replace/delete; validators and version IDs; compare-and-set; missing replies and idempotency; absence of multi-object transactions. Preserve an application invariant using actual request semantics. | Two writers replace a manifest pointer, one loses its reply and reconciles state. | F03 vocabulary supplied locally; O05 dataset publication. | Existing `consistency/`. |
| O05 | Publishing a dataset — deep dive | Immutable generation; manifest/pointer; atomic publication boundary; reader pinning; concurrent publisher; keeping old generations; safe cleanup and validation. Make a many-object change visible as one complete generation. | G7/G8 with a slow reader and failed publisher; inspect reachable objects. | O02/O04; A08 owns table/catalog protocols, O10 retention mechanisms. | Existing `publication/`. |
| O06 | Access and private uploads — practical guide | Application user against storage principal; action/resource scope; policy evaluation; presigned authority/expiry; CORS; validation/quarantine; key/tenant ownership; encryption/key access. Grant exactly the intended byte operation. | Browser/backend/S3 request trace, malicious key choice and a rejected unsafe upload. | O01; F08 policy and O12 S3-specific resource controls. | Existing `access/`; move AWS-only reference detail to O12 where it interrupts general reasoning. |
| O07 | Objects and database records — deep dive | Pending upload state; validation/publication; no cross-service transaction; durable jobs and retries; orphan/missing bytes; replacing and retiring objects; reconciliation. Complete a lifecycle after any crash point. | U17 followed through failed upload, late completion, database commit and deletion. | O03/O04/R11; F05 owns generic copy/reconciliation protocol. | Existing `database-records/`. |
| O08 | Delivering and caching objects — deep dive | Direct/proxied/CDN delivery; immutable assets and changing pointers; HTTP cache freshness and validation; cache identity; ranges; signed delivery/private content; invalidation and source deletion. Deliver the right revision under the right authority. | Cached P7 photo plus changing manifest; expiry and stale private access. | O02/O06; C02 general invalidation race, C08 cache arrangement. | Existing `delivery/`. |
| O09 | Events and object-processing workflows — practical guide | Notifications against authoritative state; duplicate/reordered events; version-bound work; retry/reconciliation; partial outputs and publication; backlog/deletion. Produce one usable result from unreliable notifications. | Revision 7 job completes after revision 8; retry and inspect published state. | O05/O07; F05 shared protocol; broker internals stay elsewhere. | Existing `events/`. |
| O10 | Versions, retention and recovery — practical guide | Versions/delete markers; lifecycle rules; retention/hold and immutability; replication against independent recovery; credentials/keys; restore selection and application reconciliation; verifying deletion. Recover a usable generation and know what is still retained. | Bad delete followed by restore while later valid objects exist. | O05/O07; F08 policy, O12 S3 modes. | Existing `recovery/`. |
| O11 | Performance, storage classes and cost — practical guide | Request/byte/transfer cost; concurrency and object sizing; cold access and restore delay; lifecycle transitions/minimums; listing and multipart residue; egress; capacity/failure observations. Cost the application's full request and recovery path. | Same workload under three layouts/classes; prices are dated inputs, not fixed claims. | O02/O03/O10; F07 evaluation and B06 lower-layer measurement are different scopes. | Existing `performance-and-cost/`. |
| O12 | Amazon S3 in practice — product deep dive | AWS resource types/endpoints; general-purpose/directory distinctions; IAM/ownership/public-access controls; regions and request routing; classes/replication/versioning/Object Lock; SDK/CLI diagnostics and native evidence. Apply the exact service contract. | Request failure diagnosed by principal, endpoint, method, headers and resource configuration. | O01–O11 as needed; O13/O14 specialised resources. | Existing `s3/`; proposed receiving home for AWS-only detail currently scattered through general pages. |
| O13 | S3 Tables — product deep dive | Managed table bucket/catalog/API; integration and supported table features; permissions; maintenance ownership; retention, cost and recovery boundaries. Distinguish managed S3 Tables from arbitrary Parquet objects. | Follow an actual supported engine/catalog/table path with current resource/service evidence. | A07/A08 own columnar files and Iceberg tables; local reminder for direct entrants. | Existing `tables/`; general table teaching has its proposed home at A08. |
| O14 | S3 Vectors — product deep dive | Vector bucket/index/API; metric/model configuration; index modes and filtering; resource permissions; source/version reconciliation; performance/cost evidence and limits. Use the service without confusing it with object PUT or exact toy geometry. | Versioned native request examples and source-revision failure; bounded local geometry is labelled. | S05/S06/S08 own vector/ANN/evaluation; O07 application state. | Existing `vectors/`; narrow general repetition during later writing. |
| O15 | Choosing object, file or database storage — comparison | Blob in database; filesystem; S3 and credible compatible/alternative services such as Azure Blob/GCS; API compatibility against actual guarantees; hosting, access, recovery and whole-workflow cost. Choose from required operations. | User upload, mutable recording and analytical dataset require different operations and ownership. | O01/F02; B01 files/volumes, A08 tables, F07 evaluation. | New `choosing/`. |

## Tools, evidence and boundaries

Two existing tool destinations stay outside article counts: `sandbox/` contains
the bounded local teaching model; `practice/` is the real-S3 worksheet. Its local
schema checks do not establish hosted execution. Keep actual execution evidence
beside the lesson, and do not describe model results as service observations.

No new AWS account actions are commissioned by this plan. Native service practice
can be designed later with its own resources, costs and cleanup. Publication state
continues to come from the current routes and inventory, not this proposal.
