# Object storage: the abilities to teach

Independent derivation, 18 October 2026. Planning only. This file was saved before assigning pages in `objects-proposal.md`. The commission, planning and style skills, research skill and depth-and-experiments reference set the method. No existing object article, outline, inventory, coverage map, previous field proposal or other derivation supplied the units or boundaries. The required site-direction document includes a short publication summary; that incidental summary was not used to derive this plan. Routes and publication states remain unchanged.

## The practitioner and the work

The reader can write a small application and understands requests, authentication and persistent data. They may never have used an object service. An expert chooses its role, gives every byte a stable identity, transfers and verifies content, coordinates writers, publishes complete releases, connects object state to application state, controls access, processes change, delivers content, preserves and removes it deliberately, recovers from failures, and diagnoses work and cost. They check which properties an actual endpoint provides. They need not implement a provider's undisclosed storage engine.

The running work is a tenant document service. Tenant `t17` uploads `doc42` under upload intent `up91`. A source file produces preview and extracted-text objects, then a manifest for release `rel7`. An application row points to the accepted release. Jobs update a search index. Private downloads may pass through a cache. The bytes later enter an archive or recovery copy. Business identity, stored version, validator and content digest remain visibly different. A separate dataset release shows why a database transaction cannot encompass all files. Neither example assumes S3.

These are teachable units, not page candidates. **Local** means a short explanation at use; **case** means connected worked states; **mechanism** needs a visible state model; **execution** needs a real endpoint or inspectable request trace; **reference** supplies exact limits without turning a catalogue into a lesson. No experiments have run.

## OB-T01 — Choose an object service's job

Choose whether the interface makes the application simpler, then identify the responsibilities it leaves behind.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U01 | Model a container and key addressing bytes with metadata. Distinguish replacing content from a file handle, block write or transactional row update. Check append, rename and partial-update capabilities by endpoint/resource. | Editing one byte replaces a 2 GB object, unless this resource offers another operation. Request case. |
| OB-U02 | Choose database bytes, object storage, files or block storage from access shape, size, metadata queries, transactional needs and delivery. | Tiny private attachments may fit the existing database better. Worked comparison; file/block internals remain elsewhere. |
| OB-U03 | Allocate durability, availability, capacity, patching, credentials, replication and restore across hosted service, self-operated endpoint and application. | A compatible endpoint runs on one machine. Responsibility diagram; full cluster administration is another specialisation. |

## OB-T02 — Design identity and discovery

Names become part of permissions, publication and migration. Identify a business thing, a stored version, a representation and particular bytes separately.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U04 | Separate container/key, version/generation, business identifier, ETag/validator and content digest. Persist the identity needed by the next operation. | The same bytes are uploaded twice. Five-column identity ledger. |
| OB-U05 | Distinguish bytes, content type/encoding/cache headers, user metadata, tags and application catalogue; understand update and trust boundaries. | Executable content is labelled as an image. Case and local API distinctions. |
| OB-U06 | Design keys and enumerate prefixes with pagination; distinguish delimiter views and opaque continuation state from arbitrary metadata queries. Consider tenant and secret exposure in keys. | A growing million-key prefix is scanned during writes. List trace; cross-request visibility continues in OB-U14. |

## OB-T03 — Finish a transfer despite interruption

Reason about remote completion, retry state and the identity of a resumed read.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U07 | Trace a single transfer through streaming, buffering, deadlines and cancellation. Distinguish bytes sent from remote acceptance. | The final response is lost after commit. Mechanism; reconciliation belongs to OB-U16. |
| OB-U08 | Explain multipart/resumable session identity, part identity, parallelism, completion, retry, abort and abandoned storage. Persist enough state to resume. | A client restarts after three parts; cancellation leaves parts behind. State model and execution. |
| OB-U09 | Resume or parallelise downloads with ranges while pinning a version or suitable precondition. Account for encodings and verify assembled bytes. | A replacement occurs between two ranges. Byte-strip model and request trace. |
| OB-U10 | Treat copy and copy-then-delete move as protocols with source identity, metadata, permissions, size and failure boundaries. Check resource-specific rename. | Copy finishes, deletion fails or the source changes. State trace; no universal atomic-rename claim. |

## OB-T04 — Prove that the intended bytes arrived

A checksum calculated after selecting the wrong source does not prove the right document was stored.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U11 | Use validators for documented comparison semantics and checksums for documented byte coverage. Distinguish whole-object/composite checksums, algorithms and encodings. | Multipart ETag is compared with a whole-file MD5. Worked byte computation. |
| OB-U12 | Maintain an independent expected digest from source through request validation, stored metadata and download verification. Separate wrong input, transfer corruption and later damage. | Uploader and store agree on the checksum of the wrong file. Case and executable small-file check. |
| OB-U13 | Define content identity across compression, encryption, transformations and deduplication; choose collision resistance when identity or hostile substitution depends on it. | Preview bytes differ; cross-tenant deduplication leaks equality. Case; cryptographic constructions are references. |

## OB-T05 — Coordinate competing operations

Predict observable state and build protocols from documented guarantees.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U14 | Distinguish one-object atomic visibility, acknowledgement, listing, paginated scan and transaction across keys. Check control-plane and cached views separately. | Individually readable keys form a mixed release; strong listing does not make several requests one snapshot. Request schedules. |
| OB-U15 | Replace check-then-write races with conditional create/update/delete where supported. Distinguish stale input, conflict and retry. | Two publishers read the same pointer. Interactive schedule and real worksheet. |
| OB-U16 | Reconcile ambiguous success with operation identity, immutable keys, receipts and bounded retries. | Retried versioned PUT adds a version; conditional retry fails because attempt one succeeded. State machine. |
| OB-U17 | Separate content equality from mutation identity, including change-and-change-back and independently changing metadata. Use another coordinator when the invariant requires one. | A pointer returns to its old body after an intervening business transition. Counterexample; no universal generation semantics. |

## OB-T06 — Publish many objects as one usable release

Keep bundles complete while uploads, publishers, readers and cleanup overlap.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U18 | Write immutable dependencies and a manifest with pinned identities/digests, then publish a pointer. Define reader validation and partial-upload handling. | The network dies after previews but before the source. Manifest graph and reader trace. |
| OB-U19 | Coordinate pointer updates and rollback. Distinguish any valid winner from required business ordering; prevent an older job publishing last. | Slow `rel6` overwrites accepted `rel7`; CAS needs an application generation check. Competing publisher case. |
| OB-U20 | Keep versions alive for readers, rollback and retained releases; collect unreachable objects with a race-safe mark/cutoff policy. | A reader holds the old manifest when cleanup starts. Graph timeline and bounded collection algorithm. |

## OB-T07 — Connect uploads to application state

The user wants an accepted document, not an arbitrary key. Define when bytes become trusted and who repairs every gap.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U21 | Make tenant-bound upload intents with expected size/type/digest, expiry, quota and reserved identity. Choose direct/proxied transfer from control needs. | A delegated uploader writes different bytes or offers another tenant's key. Protocol case. |
| OB-U22 | Validate completion server-side, bind the stored version, quarantine, scan/transform and publish accepted results. | Reusable upload permission changes bytes after scanning. Hostile timing state machine. |
| OB-U23 | Manage the database/object commit gap with pending/accepted/failed states, idempotent finalisation and reconciliation. | Object succeeds but database commit fails, or the row points to absent bytes. Failure matrix; transaction internals elsewhere. |
| OB-U24 | Delete through intent, reference checks, tombstones and grace periods. Clean stale intents, transfers and unreachable objects without racing references. | A delayed upload arrives after expiry; a shared object still has a reference. State case. |

## OB-T08 — Control access and protect keys

Distinguish who authorises an operation, who receives bytes and who can make them unreadable.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U25 | Define principal/action/resource/condition; separate list/read/write/delete/admin and public exposure. Follow denies through service, account and network controls. | A writer uploads but cannot list. Policy evaluation cases. |
| OB-U26 | Delegate narrowly using signed requests or temporary credentials; bind method, resource, headers and effective lifetime. Separate bearer reuse, CORS and authorisation. | A leaked URL is reused; application ACL changes do not recall bytes. Request and threat case. |
| OB-U27 | Separate transport, server-side and client-side encryption. Model key permission, availability, rotation and recovery as dependencies. | Preserved versions cannot be decrypted after key loss. Dependency diagram. |
| OB-U28 | Design auditable ownership, service identities, cross-account copies and incident evidence. Understand log limits. | Recovery copy shares the compromised administrator; required logs were never enabled. Incident case. |

## OB-T09 — Deliver the intended representation

Trace what clients and caches see instead of assuming origin freshness reaches every reader.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U29 | Set content type/disposition/encoding, cache directives, range and conditional behaviour. Separate representation validator from release identity. | Compressed ranges disagree; untrusted HTML renders on a trusted origin. Request/response case. |
| OB-U30 | Design immutable URLs, mutable aliases and invalidation across origin, edge and browser. | Origin serves `rel7`; edge serves `rel6`; cached child files outlive alias invalidation. Cache timeline. |
| OB-U31 | Separate viewer authorisation from origin fetch; choose revocation semantics accounting for cache key, TTL and delivered copies. | Cached private content crosses tenants. Worked delivery design; CDN internals elsewhere. |

## OB-T10 — Process object change reliably

Notifications observe storage; they do not atomically commit downstream application effects.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U32 | Build job identity from the relevant object/version and transform; fetch intended bytes and deduplicate attempts. | Duplicate event runs a transform twice or reads a newer overwrite. Job ledger. |
| OB-U33 | Use per-key ordering evidence without assuming ordering across keys or a global timestamp sequence. | Delete arrives before earlier create. Schedule case. |
| OB-U34 | Reconcile notifications, catalogue and inventory/list scans across bootstrap, backlog, replay and gaps. Measure lag and define restart boundaries. | Configuration was absent during migration; inventory is older than current reads. Reconciliation design. |
| OB-U35 | Make effects idempotent or conditionally committed; isolate outputs to prevent trigger loops. | Worker commits an effect then crashes before acknowledgement. Failure case; queue internals elsewhere. |

## OB-T11 — Make retention, availability and erasure deliberate

Deleting a name, protecting a version and making retained bytes cheap are different operations.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U36 | Choose tiers/placement from access distribution, retrieval delay, fees, minimum duration and recovery objectives. Observe restore completion. | Intact archive misses a two-hour objective; tiny objects cost more after transition. Cost/time workbook and restore state model. |
| OB-U37 | Reason about current/noncurrent versions, soft deletes/delete markers, expiry and unfinished uploads. | Deleting a name leaves billed history and orphan parts. Version ledger. |
| OB-U38 | Translate preservation requirements into version protection, holds, bypass authority and irreversibility. Separate preserved bytes from visibility at a name. | Retained record is hidden by a newer version; an administrator bypasses protection. Timeline; no legal compliance promise. |
| OB-U39 | Design erasure across versions, replicas, caches, derived files, indexes and logs; reconcile requests with active preservation requirements. | Original disappears but previews remain; a hold forbids deletion. Dependency graph and evidence plan. |

## OB-T12 — Recover useful application state

Recover consistent bytes and references within a required time under a specified failure.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U40 | Separate durability, availability, zone/region failure, deletion, compromised credentials and key loss. Identify provider promises and application checks. | Durable bytes are unreachable or all versions are deleted with valid credentials. Failure-domain model; no invented S3 internals. |
| OB-U41 | Choose history, asynchronous replication, isolated copies and export from failure objectives. Check coverage of old data, deletion, settings and key material. | Bad writes replicate; the latest accepted object has not reached the destination. Copy graph and loss window. |
| OB-U42 | Restore catalogue/manifest and referenced versions consistently; isolate restoration and reconcile valid later work. | Yesterday's database references expired objects and loses today's accepted upload. Restore ledger. |
| OB-U43 | Verify dependencies, digests, access and representative archives; measure full application readiness. | One GET succeeds while the manifest or key service is missing. Drill design; no execution claim. |

## OB-T13 — Diagnose time and money

Measure actual work and tail behaviour before selecting a feature or key-naming rule.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U44 | Separate first-byte latency, throughput, client CPU/memory, connections, parallel parts, service limits and retries; bound concurrency/backoff by a deadline. | Parallelism saturates the client or causes throttling. Trace and parameter experiment. |
| OB-U45 | Choose object size/layout and discovery from whole/ranged access, small-object amplification and request work. Weigh packing against rewrites and deletion. | Packing tiny documents saves requests but makes individual deletion expensive. Work counts; columnar query design elsewhere. |
| OB-U46 | Estimate storage/history, requests, transitions, retrieval, transfer, replication, keys and delivery charges. Vary uncertain assumptions. | Cheap GB becomes expensive through egress or hidden versions. Scenario workbook, not permanent prices. |
| OB-U47 | Correlate request traces, errors, latency, transfers, job lag, inventory and billing. Distinguish denied/missing/stale/throttled/archived before changing data. | A 403 becomes alleged absence; a stale cache becomes alleged weak origin consistency. Diagnostic investigation. |

## OB-T14 — Move a live namespace and test its contract

Migration ends when references work, dependencies retire safely and the endpoint meets the protocol.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U48 | Maintain a resumable identity/bytes/metadata migration ledger across pagination, concurrent changes and partial batches. | Copy skips versions or loses content headers. Ledger and changed-source case. |
| OB-U49 | Plan backfill, change capture, read/write cutover, validation, rollback and retirement. Repair URLs, caches, events and references. | A late writer updates only the old store; rollback lacks new writes. Cutover timeline. |
| OB-U50 | Select and test preconditions, versions, listing, multipart/checksums, permissions, events, recovery, limits and responsibility. Pin API/SDK/resource/release. | Emulator accepts a request but cannot verify production durability or IAM; compatible endpoint omits an operation. Comparison and conformance worksheet. |

## OB-T15 — Recognise specialised resources

Identify where generic byte storage ends without retelling neighbouring fields.

| Unit | Ability chain and stopping point | Awkward case and teaching form |
| --- | --- | --- |
| OB-U51 | Distinguish Parquet/Iceberg bytes from a managed table with metadata, commits and maintenance APIs. Hand off snapshots, catalogues and query execution. | Storage lifecycle removes files referenced by a table snapshot. Boundary case and analytical-table reference. |
| OB-U52 | Distinguish an embedding file from a vector index with filters and similarity queries. Hand off retrieval quality, indexing and embedding design. | Source deletion leaves a searchable derived vector. Boundary case; local lifecycle owns the dependency only. |
| OB-U53 | Detect resources whose locality, namespace, append/rename, versions, events or protection alter the object's operating contract. | Low-latency zonal storage lacks the original rollback/notification facilities. Contract case. |

## OB-T16 — Apply the mechanisms to one actual implementation

Amazon S3 general purpose buckets are a coherent initial representative: its documented requests make integrity, conditions, IAM, versions, event identity, tiers and asynchronous replication inspectable. This is a choice to investigate, not the definition of the family. GCS is the hosted counterexample; Ceph Object Gateway supplies self-operated/API-compatibility contrast. A full Ceph/RADOS operator branch would require placement, rebalancing, recovery and upgrades; it is not hidden here.

| Unit | Concrete ability and scope | Necessary changed case and form |
| --- | --- | --- |
| OB-U54 | Identify S3 resource/account/Region/endpoint/key/versionId/credentials/SDK settings; trace HEAD/GET/PUT/LIST in an isolated general purpose bucket. | Wrong Region or ownership; versioning changes identity. Real setup and request worksheet. |
| OB-U55 | Use multipart initiation/parts/completion/abort; inspect checksum algorithm/type and independently verify copy/range bytes. | Lost completion response, composite/full confusion, orphan parts. Request-level execution. |
| OB-U56 | Implement supported S3 conditional create/update/delete and enforcement. Distinguish 412, conflict, delete race, versioning and validator limits. | Two clients race, then lose a response. Paired-client execution. |
| OB-U57 | Diagnose IAM/resource policies, ownership, public-access blocks, cross-account/network controls and KMS permissions from request identity. | Object allow succeeds but decrypt fails; explicit deny beats bucket allow. Policy worksheet. |
| OB-U58 | Bind presigned upload to intent and requirements; calculate effective credential/policy expiry, configure CORS and verify stored version. | URL reuse, early credential expiry or changed signed header. Browser/finaliser trace. |
| OB-U59 | Configure private S3 origin and CloudFront path with separate viewer, origin and cache policies. | Edge freshness or viewer access differs from direct S3. Hosted two-reader experiment. |
| OB-U60 | Configure notifications to a selected queue; decode keys, use versionId/sequencer, prevent loops and compare inventory with completed work. | Duplicate/reordered same-key events; absent bootstrap configuration. Inject duplicates at consumer, without claiming to cause AWS duplicate delivery. |
| OB-U61 | Configure versions, noncurrent expiry, transfer cleanup, Object Lock and holds; inspect version-specific protection/delete markers. | Current DELETE hides a locked old version; governance bypass differs from compliance. Isolated execution with disposable conservative settings. |
| OB-U62 | Choose S3 classes and retrieve an archive from observed restore status, including duration, retrieval, small-object and availability distinctions. | Restore misses deadline; placement changes failure domain. Cost/restore worksheet. |
| OB-U63 | Configure replication/backfill, inspect status/permission failures and recover references from another destination. Check version/delete/lifecycle/settings coverage. | Existing data lacks backfill or destination KMS permissions prevent recovery. Two-bucket/account drill with credential/key isolation. |
| OB-U64 | Investigate request IDs, errors, Inventory/Batch Operations, CloudTrail/access logs, storage/billing metrics and scaling. Preserve partial-failure evidence. | Sudden load produces slowdown, inventory is old or a batch partly fails. Diagnostic dossier and bounded measurement. |
| OB-U65 | Evaluate directory buckets, endpoints/session model and selected documented append/rename operations; trace consequences of missing versions/events/replication. | Moving to zonal storage breaks the original protocol. Product mechanism case and optional real exercise. |
| OB-U66 | Recognise S3 Tables' separate bucket/resource/API/maintenance boundary; hand off full table investigation. | Generic bucket policy/lifecycle assumptions are copied to a managed table. Short product boundary reference. |
| OB-U67 | Recognise S3 Vectors' separate bucket/index/API boundary; hand off filtering, quality and embedding lifecycle. | GET-object or generic events are assumed to maintain a vector index. Short product boundary reference. |

## Evidence used to challenge scope

Primary documentation checked on 18 October 2026. These are **planning sources** establishing consequential distinctions. Article claims still need verification against pinned API/SDK/resource settings and recorded execution. No experiment has run; dynamic prices and limits need rechecking.

- [S3 conditional requests](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-requests.html) and [writes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html): native conditions justify single-object coordination teaching. Exact operations/errors belong to the implementation branch.
- [S3 integrity](https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity.html): checksum algorithm and byte coverage need inspection; ETag cannot replace the integrity protocol.
- [GCS consistency](https://docs.cloud.google.com/storage/docs/consistency) and [metadata](https://docs.cloud.google.com/storage/docs/metadata): strong object/list guarantees coexist with cached/ranged-read hazards. Generation/metageneration differs from S3 identity.
- [S3 notification delivery](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html) and [message structure](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-content-structure.html): duplicates and per-key ordering require work identity and reconciliation.
- [S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) and [considerations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html): protection belongs to versions; losing decryption keys can still prevent recovery.
- [S3 replication coverage](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html): backfill, deletion and configuration require explicit coverage checks.
- [S3 resource types](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html), [Tables](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html), [Vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html), and [directory differences](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-differences.html): one product name spans different contracts. Query resources need family handoffs; directory buckets change object operations directly.
- [S3 performance design](https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html): workload-dependent scaling/slowdown requires measurement, rather than universal prefix rules or claimed benchmark results.
- [Ceph Object Gateway compatibility](https://docs.ceph.com/en/latest/radosgw/s3/): basic API compatibility and partial support do not establish all AWS guarantees. This is explicitly development documentation: select a stable release before a detailed compatibility claim or experiment.

## Hard boundaries and uncertainty

- Scope is general object-application competence plus one S3 branch. Operating Ceph/RADOS, building erasure coding or a distributed metadata engine needs another commission. S3 physical internals are not invented from its public API.
- Necessary ordering, lag and failure-domain reasoning stays local. The shared distributed-systems programme remains parked.
- Analytical tables own snapshots/catalogues/compaction; vector/search owns index/query/embedding design. Object storage owns byte dependencies, source/derived lifecycle and short resource recognition. These shared homes remain provisional until field coordination.
- Cryptography, HTTP/CDN internals, federation and queue internals receive enough local context for the decision, then references. Direct entrants do not depend on an unpublished shared course.
- Directory append/rename/session operations need focused source verification by resource and placement before a lesson. They are exceptions to investigate, not promises for every compatible API.
- Hosted lessons may require separate identities/accounts/Regions and incur charges. Briefs must define minimal setup, evidence and cleanup. Browser models can reveal state, but cannot verify service guarantees.

Derived inventory: **16 practitioner tasks; 67 teachable units**. OB-U51/52 and OB-U66/67 are deliberately short general/product recognition units with external-family handoffs. No page count was chosen while deriving them.
