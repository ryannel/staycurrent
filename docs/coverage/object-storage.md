# Object storage: proposed coverage map

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/objects-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/objects-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-storage.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.

## Review boundaries retained in this allocation

OB-A01's table/vector recognition and OB-S01's specialised-resource recognition
follow the first ordinary object operation and remain optional signposts.
AN17–AN22 own table/catalogue semantics; SR09–SR20 own vector mechanisms and
evaluation. OB-S04 follows one upload/read request path through policy, signing,
encryption and finalisation; unrelated policy combinations stay reference material.
OB-S10 uses one incident to select metrics/log/inventory evidence, with any repair
batch as the consequence of that diagnosis. Neither becomes a console/IAM survey.
OB-A16 applies FD05's shared authority-transfer proof to object names, versions,
metadata, permissions and serving URLs. Keep those byte-interface compatibility
and verification cases rather than another generic cutover tutorial.


Independent proposal, 18 October 2026. Read `objects-abilities.md` for the prior derivation: 16 tasks and 67 units. That file was persisted before these page assignments. This is a proposal for independent challenge and whole-field reconciliation. It commissions no article, creates no route and changes no publication state. Existing reading has not been used as a page template or treated as evidence of coverage.

## The route through the subject

The collection teaches an application engineer to use object storage well. It begins with a remote byte interface and follows consequences: identity makes transfers and retries intelligible; conditional operations support publication; publication and application state explain lifecycle; lifecycle and dependencies make recovery testable. Access, delivery, events, diagnosis and migration also have direct entrances because practitioners often arrive with one of those problems.

The proposal has **27 article groups: 16 general articles and 11 in a selective S3 branch**. This count follows the boundaries below. It is not a target, a requirement to read every article, or an instruction to preserve an existing collection. Four short recognition units live inside other pages rather than earning a product directory or new query course. The S3 branch teaches requests, settings and evidence against actual resources; it does not retell the general mechanisms.

The running document-service example, identifiers and dataset-release variation come from the abilities file. They recur only where they lower entry cost. Each direct entrant gets the necessary local reminder: a key identifies a name, a version identifies a stored instance when supported, a validator has its documented comparison meaning, and a manifest pins a release. Links let a reader deepen that reminder without making the page unreadable on its own.

### OB-G01 — Establish the byte interface

OB-A01 through OB-A05 teach role, identity, transfer, integrity and coordination. They are useful before choosing S3 or any other endpoint. A comparison-seeking reader can go directly from OB-A01 to OB-A15.

### OB-G02 — Build application protocols

OB-A06 through OB-A10 teach release publication, user uploads, access, delivery and change processing. These are separate engineering jobs, even when one document service uses all five. They share identities and failure histories, rather than reintroducing the same storage model five times.

### OB-G03 — Preserve, recover and operate

OB-A11 through OB-A16 teach history/deletion, tier economics, recovery, diagnosis, endpoint choice and migration. This grouping is navigation, not a demand that someone diagnosing a 403 first read recovery or a vendor comparison.

### OB-G04 — A representative S3 implementation

OB-S01 through OB-S11 form a connected implementation branch. General purpose buckets are the baseline. A directory-bucket branch is explicit because it changes ordinary operations and protection assumptions. Tables and Vectors are recognised as specialised query resources, then handed to their family homes. Readers can enter at the S3 setup or from a focused general article; there is no single page called “S3 internals” that pretends to explain eleven mechanisms.

## General teaching homes

### OB-A01 — What object storage gives an application

**Outcome and entry.** A newcomer can decide what work a remote object service should own. Entry needs are ordinary requests and persistent application data, explained briefly in the opening.

**Sections and owned units.** “The object operation” owns OB-U01; “Bytes in a database, a file or an object service” owns OB-U02; “When stored files become a query resource” owns the short recognition units OB-U51 and OB-U52. The last section explains bytes versus managed tables/vector indexes, gives the source-deletion dependency case, then hands off full query/storage design to those families. Hosted/self-operated responsibility gets a short reminder and a link to its full OB-A15 home.

**Form and necessary change.** A small request/state view replaces a byte sequence, then the workload changes from a large immutable source to tiny transactional attachments and a repeatedly edited file. A comparison keeps real alternatives credible, including keeping bytes in the existing database. A short exception shows that append or rename must be checked against the chosen resource.

**Decision and boundary.** The reader chooses the interface worth investigating and the requirement most likely to rule it out. It earns an introduction because every other page otherwise has to explain the model. Identity, multipart mechanics and provider lists stay out: including them would delay the first useful choice.

### OB-A02 — Names, versions and metadata

**Outcome and entry.** Design a namespace and record the identity required for later operations. A direct entrant needs only a sentence defining container/key and replacement.

**Sections and owned units.** “Names, versions and validators” owns OB-U04; “Bytes and their descriptions” owns OB-U05; “Listing a namespace” owns OB-U06. List pagination, delimiter views and catalogue queries are taught here; scan visibility gets the local warning and OB-A05 link.

**Form and necessary change.** An identity ledger follows `doc42` across two uploads of identical content, a metadata change and an overwritten key. A prefix listing expands into multiple pages while an application needs a query by customer and acceptance state. An untrusted content label tests whether the catalogue may trust uploader metadata.

**Decision and boundary.** Choose immutable versus mutable keys, what identifier to persist, which metadata is trusted and when to add an application catalogue. Keep these together because the same identity ledger resolves them. Give integrity its own page: a validator's byte coverage requires a different investigation, rather than an extra column of definitions here.

### OB-A03 — Uploading and reading large objects

**Outcome and entry.** Design a transfer that can resume, complete or cancel without mixing content or leaking abandoned sessions. The opening supplies key/version identity and the distinction between sent bytes and accepted bytes.

**Sections and owned units.** “A stream and its acknowledgement” owns OB-U07; “Parts, sessions and completion” owns OB-U08; “Ranges from one stored instance” owns OB-U09; “Copying and moving content” owns OB-U10. Exact endpoint calls are product links, not generic promises.

**Form and necessary change.** One large source is split into parts. Drop a connection, restart the client, lose completion's response and cancel with parts still stored. On download, replace the object between two ranges, then pin the source. Copy-then-delete shows the two-name interval and a failed delete. A resource-specific atomic rename is a deliberate contrast.

**Decision and boundary.** Choose streaming/multipart, persisted resume state, range identity and cleanup responsibility. The parts/range/copy sections stay together because all answer how to move one intended byte sequence under interruption; they do not each need another entrance. Ambiguous application outcome gets a local reminder and its full OB-A05 home. Integrity has its own byte-comparison investigation in OB-A04.

### OB-A04 — Checking which bytes arrived

**Outcome and entry.** Construct and verify an integrity chain from the selected source to later reads. Direct entry needs an example of bytes plus a stored validator; no multipart implementation is assumed.

**Sections and owned units.** “What the comparison covers” owns OB-U11; “An independent expected value” owns OB-U12; “Content identity after transformation” owns OB-U13.

**Form and necessary change.** A byte-strip calculation contrasts a full digest with a digest assembled from part results. Keep bytes constant while changing transfer shape. Then select the wrong local file: server agreement still fails the business requirement. Compression, preview creation and a tenant boundary change the meaning of content identity. A small real checksum exercise can run locally; provider validation requires recorded endpoint execution.

**Decision and boundary.** Choose which digest, expected value and identity to retain and what each successful check proves. This earns a separate page because the fast rule “compare the ETag” produces plausible but wrong designs. Algorithm implementation, encryption constructions and a cryptography survey remain references.

### OB-A05 — Concurrent writes and uncertain outcomes

**Outcome and entry.** Defend a single-object coordination protocol under competing writers and a lost response. A local two-writer example establishes the necessary identity terms for direct entrants.

**Sections and owned units.** “What one acknowledgement makes visible” owns OB-U14; “Check and write in one operation” owns OB-U15; “When the response disappears” owns OB-U16; “Equal content and intervening changes” owns OB-U17.

**Form and necessary change.** A request scheduler lets readers interleave a check and write, replace it with a condition, then drop the winner's response. Change content back to its earlier body and edit metadata independently. Show that paginated listing and several individually atomic keys do not form a snapshot or transaction. Compare an ETag-based condition with GCS generation semantics without presenting either as universal.

**Decision and boundary.** Choose conditional create/update/delete, an immutable operation key, a recovery lookup or an external coordinator. Keep these cases together: retries are part of the correctness argument, not an optional appendix. Multi-object publication earns OB-A06 because readers and reachability add a different protocol. Shared consensus theory stays parked.

### OB-A06 — Publishing a complete release

**Outcome and entry.** Publish and retire a multi-object release without exposing missing dependencies or deleting a reader's bytes. Direct entrants get a small manifest and a local conditional-pointer explanation.

**Sections and owned units.** “Dependencies before the pointer” owns OB-U18; “Competing releases and rollback” owns OB-U19; “Readers and unreachable objects” owns OB-U20.

**Form and necessary change.** A manifest graph starts with source, preview and extracted text. Fail after only previews exist, let a slow older publisher finish last, roll back, and run cleanup while a reader holds the old manifest. The dataset-release variation confirms that the protocol is not an upload-form trick. A browser state model can expose every referenced version; label it a model.

**Decision and boundary.** Choose manifest contents, publication ordering, pointer checks, rollback window and a safe collection cutoff. These stay together because the publication claim is false if cleanup can immediately remove the accepted release. The user-facing acceptance workflow belongs in OB-A07. Iceberg snapshot internals do not become a second publication lesson here.

### OB-A07 — Accepting uploads into an application

**Outcome and entry.** Make the application accept exactly the intended, validated document and repair every database/object gap. Entry needs are a row, a request and an untrusted client; a short state view supplies the rest.

**Sections and owned units.** “An upload intent” owns OB-U21; “Quarantine and acceptance” owns OB-U22; “Two stores, two commits” owns OB-U23; “Deletion and late arrivals” owns OB-U24.

**Form and necessary change.** Follow `up91` from quota reservation to direct/proxied transfer, exact-version inspection, scanning and accepted-row commit. Replace bytes after scanning, lose the row commit, retry finalisation, and accept a delayed upload after its intent expires. Shared-content references and tombstones complicate deletion. A failure matrix identifies the reconciler and durable evidence for each gap.

**Decision and boundary.** Choose the state machine, trust boundary, finalisation key and repair/cleanup policy. All four sections stay together because treating upload success as acceptance creates the central bug. Signed-request mechanics belong in OB-A08 and OB-S04; this page explains what they must protect. It uses a database transaction locally without teaching isolation internals.

### OB-A08 — Access, delegation and encryption keys

**Outcome and entry.** Establish who may do what, how temporary access works and what can make stored content unreadable. A local principal/action/resource example supports direct entrants.

**Sections and owned units.** “Authorising an operation” owns OB-U25; “Delegating a bounded request” owns OB-U26; “Encryption and the ability to recover” owns OB-U27; “Ownership and evidence” owns OB-U28.

**Form and necessary change.** A policy trace separates list, read, write and delete. A bearer URL is leaked and reused; its underlying credentials expire early. A permitted read fails at decryption, and a supposed independent recovery copy shares the compromised administrator. Audit evidence is designed before the incident. CORS gets its local browser meaning without pretending it grants access.

**Decision and boundary.** Choose identities, scopes, delegated lifetime, key dependencies and audit separation. Encryption stays with access because another principal and key service sit directly in the read path. A full federation/security course and legal interpretation stay external. Cache/viewer access needs OB-A09's separate delivery state.

### OB-A09 — Serving content through caches

**Outcome and entry.** Serve the intended public or private representation and explain its freshness and revocation limits. The opening shows origin, edge and browser; a reader need not know CDN internals.

**Sections and owned units.** “The HTTP representation” owns OB-U29; “Immutable URLs and changing aliases” owns OB-U30; “Private viewers and a private origin” owns OB-U31.

**Form and necessary change.** Trace headers and validators through two readers. Change an alias while its dependencies are cached; vary content encoding during a resumed read. Introduce authorisation and a badly chosen cache boundary that shares private content. Change a permission after delivery, distinguishing new requests from copies already obtained.

**Decision and boundary.** Choose URL versioning, headers, cache key, TTL/invalidation and viewer/origin credentials. Keep public/private cases together because cache reuse is the same mechanism whose boundary changes. This deserves its own page because fresh origin state cannot explain a user's cached response. CloudFront configuration lives in OB-S05; general CDN algorithms do not.

### OB-A10 — Processing changes and rebuilding derived state

**Outcome and entry.** Keep transforms, catalogues or indexes correct despite repeated, reordered or initially unconfigured change delivery. Direct entry supplies an object version and a worker's effect ledger.

**Sections and owned units.** “Identify the work and its bytes” owns OB-U32; “Order within one key” owns OB-U33; “Inventory and the missing interval” owns OB-U34; “Commit effects before retry” owns OB-U35.

**Form and necessary change.** Duplicate a transform event, deliver deletion before creation, crash after a database effect but before acknowledgement, and bootstrap after notification configuration was absent. Reconcile a dated inventory with the processed ledger. Show how output-key filtering avoids a trigger loop. The browser model exposes delivery choices; a hosted worksheet verifies only the configured provider path.

**Decision and boundary.** Choose job identity, stale-event rule, checkpoint/reconciliation method and replay-safe effects. Events and reconciliation remain one page because either alone leaves a correctness gap. Queue internals and a general exactly-once course stay outside; vector retrieval design is elsewhere even when vector entries are the derived state.

### OB-A11 — Versions, preservation and deletion

**Outcome and entry.** Explain what survives a delete, preserve the required versions and make a defensible erasure plan. A direct entrant starts with one key and two versions.

**Sections and owned units.** “Current names and older versions” owns OB-U37; “What a hold protects” owns OB-U38; “Following an erasure request” owns OB-U39.

**Form and necessary change.** Add a soft delete/delete marker, expire current and noncurrent versions, and leave unfinished transfer state. Protect one version, hide it with a newer version, test bypass authority, then trace erasure through preview, replica, cache and index. Preservation requirements deliberately conflict with an erasure request; the page defines the technical conflict without claiming legal authority.

**Decision and boundary.** Choose history/expiry rules, preservation authority and the evidence required before reporting deletion complete. They stay together because “deleted”, “retained” and “not visible” otherwise look interchangeable. Storage class economics earns OB-A12: preserving a version does not establish that it can be read within the required time. Restore execution belongs to recovery/product homes.

### OB-A12 — Storage tiers and the cost of a workload

**Outcome and entry.** Choose a retention/retrieval design from a workload and compute its likely cost rather than comparing stored-GB prices. Entry needs are an object count, size distribution and access history, provided by the example.

**Sections and owned units.** “Retrieval is an operation” owns OB-U36; “Count the billable work” owns OB-U46. The second section includes active/history storage, requests, transitions, retrieval, egress, replication, key-service and delivery terms, with an explicit source date for later prices.

**Form and necessary change.** A scenario workbook starts with rarely read large documents, then changes retrieval bursts, object size, retention window and egress destination. An archive restore crosses the application's deadline. Show minimum duration and minimum object/metadata charges as provider-specific variables rather than universal rules. No permanent price table substitutes for workload reasoning.

**Decision and boundary.** Choose class/placement, lifecycle timing, retrieval budget and the evidence worth collecting before migration. Cost and tiers stay together because transitions often exchange storage savings for delay and request work. Performance has its own diagnostic page; recovery objectives are stated locally and fully developed in OB-A13.

### OB-A13 — Recovery that restores an application

**Outcome and entry.** Design and test recovery of matching bytes, references, permissions and keys. A direct entrant sees a small manifest/catalogue and a stated time/loss objective.

**Sections and owned units.** “Which failure must the copy survive?” owns OB-U40; “History, replication and independent copies” owns OB-U41; “Choose a consistent recovery state” owns OB-U42; “Prove the application works” owns OB-U43.

**Form and necessary change.** A copy graph first survives one infrastructure outage, then fails under shared administrator compromise or key loss. Delay replication of an accepted object. Restore the application catalogue to yesterday: one referenced object expired and a later valid upload must be reconciled. A drill inspects all dependencies and includes archived retrieval time, not a single successful GET.

**Decision and boundary.** Choose failure independence, copy coverage, accepted-loss window, restore procedure and evidence for readiness. These stay together because a recovery copy's value depends on the restoration it supports. Replication mechanics stay local to the object protocol; consensus and a shared distributed-systems programme remain parked. S3 configuration is separately inspectable in OB-S09.

### OB-A14 — Diagnosing slow and expensive object work

**Outcome and entry.** Locate the limiting work and change it with evidence. Entry is a failed latency/cost objective; a request trace and object-size histogram supply all local context.

**Sections and owned units.** “Where a transfer spends its time” owns OB-U44; “Objects, ranges and request amplification” owns OB-U45; “Follow the evidence” owns OB-U47. OB-A12 owns the full price model; this page uses request counts and observed work rather than reteaching charges.

**Form and necessary change.** Vary part size, connection count, client CPU and concurrency while keeping bytes constant. More parallelism eventually reduces completed work. Change many tiny objects into a packed object, then request or delete one member. A diagnostic dossier distinguishes denial, cache staleness, throttling, missing data and archived state. Published measurements need a real endpoint and bounded workload; a local model proves neither service throughput nor universal key-layout advice.

**Decision and boundary.** Choose the next measurement and a justified layout/concurrency/cache/catalogue change. Diagnosis remains with performance because it prevents the proposed fix from addressing the wrong bottleneck. A separate performance article is warranted: its unit is request work and tail latency, whereas transfers teach correct completion. Columnar format pruning and query planning belong to analytics.

### OB-A15 — Choosing and testing an object storage service

**Outcome and entry.** Choose among credible implementation/deployment options and test the contract the application actually needs. Direct entrants get the remote-byte model and a small requirement list; they can skip the introductory journey.

**Sections and owned units.** “Who operates and recovers the service?” owns OB-U03; “Test the required contract” owns OB-U50; “One service name, several resource types” owns OB-U53.

**Form and necessary change.** Compare S3 general purpose buckets, GCS and a specified stable Ceph Object Gateway release for the same private-document workload. Compare versions/preconditions, transfer identity/integrity, listing/events, access/key dependencies, recovery, locality/transfer costs and operator work. Use conditional comparisons, not rankings: existing cloud integration may favour a hosted service; data locality and an existing operated cluster may favour Ceph; API compatibility alone settles neither. Move the workload onto a specialised low-latency resource and test which application assumptions fail. An emulator success deliberately fails to prove IAM, availability or durability.

**Decision and boundary.** Choose a shortlist, deployment owner and conformance worksheet. Comparison earns a page because a buyer/operator enters here directly and needs credible alternatives. No feature-directory appendix; exact current limits belong in sources and dated cases. A full Ceph operator branch is out of initial scope, explicitly rather than by pretending managed-service competence covers it.

### OB-A16 — Migrating a live object namespace

**Outcome and entry.** Backfill, cut over, validate and retire a namespace without losing late writes or live references. A direct entrant gets a version ledger and two endpoints; transfer mechanics and contract checks are concise reminders.

**Sections and owned units.** “An auditable copy ledger” owns OB-U48; “Concurrent writes and cutover” owns OB-U49. Validation includes independent bytes and metadata, not merely matching object counts. Cutover includes URLs, events, keys, cache policy and consumers.

**Form and necessary change.** Copy a namespace while one source key changes, one batch item fails and one metadata field disappears. Fence or capture late writers, switch reads/writes, then roll back after new writes have reached only the destination. The ledger explains which changes need copying back before rollback can be safe.

**Decision and boundary.** Choose a cutover fence/change-capture method, acceptance evidence, rollback conditions and retirement window. Migration earns its direct entrance because neither ordinary transfer nor recovery teaches coexistence with a continuing source. Keep per-file copy details in OB-A03 and endpoint support in OB-A15.

## The S3 implementation branch

Each S3 article uses precise request/response/state evidence and names resource type, Region, SDK/CLI version, identity and settings. A model can teach a schedule, but must not be labelled a service experiment. An implementation exercise that needs previous setup links to one reusable worksheet rather than copying setup on every page. The following are bounded investigations, not generic pages decorated with AWS commands.

### OB-S01 — Working with S3 general purpose buckets

**Outcome and entry.** A reader new to AWS can identify the resource and credentials behind a request and run an inspectable, disposable read/write/list exercise. Entry needs are the local key/version/validator reminder; there is no requirement to read every general article first.

**Sections and owned units.** “Resource, account and endpoint”, “Request identity and signing”, “Observe bytes, metadata and versions”, and “Clean up what was created” jointly own OB-U54. “Tables and vector indexes are different resources” owns the short recognition homes OB-U66 and OB-U67. The latter point to the analytical-table and vector/search family homes, owned by AN17–AN22 and SR09–SR20 respectively; they do not teach SQL, Iceberg, ANN or embedding design here.

**Form and change.** A narrow real-service worksheet creates an isolated general purpose bucket, records identity/Region/settings, traces requests and removes all exercise state. Change Region, caller and versioning state to explain three different failures or identities. Default public exposure is not needed. Introduce directory buckets only as a handoff to OB-S11.

**Decision and split.** Choose and verify the actual baseline resource before running later exercises. This short entrance earns a page because direct S3 entrants need a reusable setup and cannot safely infer the environment from scattered command snippets. Transfer, conditions and access have separate mechanisms and separate evidence; they are not compressed into this setup page.

### OB-S02 — S3 multipart transfers and checksums

**Outcome and entry.** Complete, resume, abort and verify an S3 transfer while explaining exactly what each identifier/checksum covers. Entry needs are the reusable setup and a local part/session/checksum reminder.

**Sections and owned units.** “Create and inspect an upload”, “Retry parts and complete”, “Verify full and composite checksums”, and “Pin reads, copy and clean abandoned state” jointly own OB-U55. Generic digest reasoning remains in OB-A04; the full teaching here is the actual S3 protocol and returned fields.

**Form and change.** Run a small multipart exercise with independent expected bytes and captured part/complete responses. Lose a client response, repeat a part, alter completion input and inspect stored object/checksum/version identity. Copy the bytes and compare meaning rather than assuming validator stability. Pin ranged reads and explicitly abort unfinished sessions. Do not silently rely on an SDK's changing checksum default.

**Decision and split.** Select checksum type, persisted upload state, verification and cleanup for the actual SDK/API. It earns a page because part state and checksum representation are inspectable mechanisms with several failure states. The concurrency protocol belongs to OB-S03, linked at uncertain completion rather than re-taught here.

### OB-S03 — Conditional operations in S3

**Outcome and entry.** Implement and diagnose conditional writes/deletes for the chosen general purpose bucket. A direct entrant gets one lost-update schedule and the meaning/limits of the validator used.

**Sections and owned units.** “Conditional create and replacement”, “Conflict, deletion and uncertain success”, and “Enforce the protocol for every writer” jointly own OB-U56. The brief must verify supported operations and error handling against current API documentation, including conditional copy/delete and multipart completion rather than assuming all condition headers work everywhere.

**Form and change.** Two clients race on a pointer; then delete concurrently, lose the winning response, retry and test versioned state. Inspect actual status, ETag/versionId and resulting content. Add a bucket policy condition and an uncooperative writer. A schedule model explains possibilities; captured endpoint results establish only the executed cases.

**Decision and split.** Choose the conditional operation and reconciliation branch, or recognise when a business generation needs another coordinator. S3-specific status/retry/policy details justify a product home separate from generic OB-A05. No claim that ETag uniquely names every intervening mutation.

### OB-S04 — Direct uploads, S3 permissions and finalisation

**Outcome and entry.** Authorise a direct browser upload narrowly and verify the bytes that become accepted. The opening supplies an upload intent, bearer delegation and principal/action/resource; a reader need not complete the general application journey first.

**Sections and owned units.** “Evaluate the caller and resource policies” owns OB-U57; “Sign an intent-bound upload” and “Browser completion and server verification” own OB-U58. The first section includes ownership, public-access blocks, explicit deny, network/cross-account boundaries and a KMS-dependent read as needed by this request path. An exact permission reference sits beside the trace; this is not a catalogue of IAM features.

**Form and change.** A browser uploads with signed method/headers to a reserved key, then a server checks exact stored identity before accepting it. Reuse the URL, expire its temporary credential early, change a signed header, omit CORS, and deny KMS access. Separate signature, browser and authorisation errors from finalisation trust failures.

**Decision and split.** Choose signing scope, effective expiry, policy and finaliser evidence. Permissions and delegated upload stay together because both determine whether the actual request is allowed. Application commit-gap design remains fully in OB-A07; private delivery is another request/caching boundary and earns OB-S05.

### OB-S05 — Private S3 delivery through CloudFront

**Outcome and entry.** Configure a concrete private-origin path while explaining viewer access and freshness. Entry needs are an origin/edge/browser reminder and the reusable S3 setup.

**Sections and owned units.** “Authorise the origin fetch”, “Authorise the viewer”, and “Inspect cache reuse and invalidation” jointly own OB-U59. CloudFront is the selected integration, not a promise that every object service or CDN has this mechanism.

**Form and change.** With two viewer identities, fetch a private document, update a mutable alias and inspect edge/origin/browser results. Change viewer authorisation and cache settings; check a cached response after a new origin denial. Direct S3 access and viewer access deliberately differ. The later brief must source the exact origin-access and viewer/cache configuration, since the initial scope check did not verify a complete CloudFront setup.

**Decision and split.** Choose the origin access mechanism, viewer policy, URL/header policy and freshness/revocation bounds. This earns a page because successful S3 GET and correct IAM cannot establish safe cached private delivery. It links to OB-A09's general model and avoids a CDN architecture survey.

### OB-S06 — S3 notifications and reconciliation

**Outcome and entry.** Configure an observable notification path and keep downstream work correct. Entry needs are a versioned object, a worker ledger and a short delivery/retry reminder.

**Sections and owned units.** “Configure and inspect the delivery path”, “Identify versions and order same-key changes”, and “Reconcile the bootstrap gap” jointly own OB-U60. Choose one concrete queue destination, document its permissions and keep queue implementation outside the scope.

**Form and change.** Capture real S3 event payloads and processing receipts. Decode keys and compare same-key sequencers with the documented scope. Inject duplicate/reordered payloads at the consumer, crash around effect acknowledgement, and compare a generated inventory with accepted work. Test output filtering. Induced consumer input is labelled separately from observed AWS delivery.

**Decision and split.** Choose version/job identity, stale-event check, queue/filter configuration and repair evidence. Events earn their own implementation investigation; combining them with CloudFront under “S3 integrations” would obscure both request paths. Full algorithm teaching stays in OB-A10; actual message fields and service configuration live here.

### OB-S07 — S3 versions, expiry and Object Lock

**Outcome and entry.** Predict the exact version state and allowed deletion after S3 lifecycle/protection settings. The opening gives a current/noncurrent/delete-marker ledger, so a reader diagnosing retained bytes can enter directly.

**Sections and owned units.** “Version-specific reads and deletion”, “Expiry and unfinished transfers”, and “Holds, retention and bypass” jointly own OB-U61. Preservation mode, legal hold and authority are shown as distinct settings, without legal compliance certification.

**Form and change.** Create small disposable versions, hide a protected version behind a delete marker/new version, and inspect version-specific access. Compare governance bypass with compliance restrictions using the least irreversible practical setup. Lifecycle timing is observed or labelled documented; the lesson must not pretend background expiry happens immediately. Account for noncurrent versions and unfinished multipart uploads in cleanup.

**Decision and split.** Choose rules and authorities that preserve or remove the intended versions, then report residual state accurately. This earns a page because a normal DELETE response is insufficient evidence. Archive class changes and regional replication have different mechanisms and earn OB-S08/09 rather than expanding this into an all-purpose protection essay.

### OB-S08 — Choosing S3 classes and restoring archives

**Outcome and entry.** Choose a class from measured access and restore objectives, then observe an archive retrieval through completion. Direct entry supplies a small workload and restore state machine.

**Sections and owned units.** “Class and placement tradeoffs”, “Transition constraints and charges”, and “Request, observe and verify a restore” jointly own OB-U62. General-purpose classes, one-zone placement and directory-bucket storage are identified precisely, rather than treated as interchangeable tier names.

**Form and change.** Populate the general cost workbook with dated S3 class/request/retrieval inputs and change size, retention, burst access and deadline. A real archive exercise records the chosen class, retrieval tier, submission/completion and read outcome; if not run, the article must label its trace as documented/modelled. Show a restore that cannot meet the application's target.

**Decision and split.** Choose class, transition rule and retrieval plan or reject archiving for that workload. A full price catalogue is unnecessary. Archive state and timing justify a separate page from version protection; general pricing reasoning remains in OB-A12.

### OB-S09 — S3 replication and application recovery

**Outcome and entry.** Establish what reaches a recovery destination, prove it is readable and restore matching application references. Direct entry supplies a copy graph, version identity and a stated recovery objective.

**Sections and owned units.** “Rules, roles and destination keys”, “Backfill and replication evidence”, “Deletion and configuration coverage”, and “Restore a matching application state” jointly own OB-U63. These teach the service's asynchronous replication/status/configuration boundary, not a guessed internal replica algorithm.

**Form and change.** Configure a disposable destination, inspect pending/failed/completed state and compare existing versus newly written objects. Break destination/key permissions and distinguish deletion of a name/version, lifecycle actions and bucket configuration. Restore a manifest/catalogue referring to versions actually present. To claim administrator compromise protection, the exercise needs separately controlled credentials/keys; a second bucket in the same account alone cannot establish it.

**Decision and split.** Choose live replication/backfill, destination authority, coverage checks and restore evidence. Keep replication and its bounded application recovery case together because status without useful restoration does not answer the reader's question. It links to OB-A13 for the full recovery-design method and OB-S07 for retention semantics; it does not teach all three in full.

### OB-S10 — Investigating an S3 workload

**Outcome and entry.** Explain a failed latency/cost objective from real S3 evidence and operate bounded inventory/batch work. Entry needs are a request trace and workload, provided locally.

**Sections and owned units.** “Requests, limits and service errors”, “Logs, inventory and billing views”, and “Batch work with partial failures” jointly own OB-U64. The general performance and price models remain OB-A14 and OB-A12; the lesson maps their questions onto actual S3 evidence and controls.

**Form and change.** A diagnostic dossier follows request IDs and permissions to distinguish failed requests, client saturation, slowdown, key-service work and stale inventory. A bounded real load change tests only the recorded workload; documented example rates are not measured results. A small Inventory/Batch Operations case records manifest identity, per-object success/failure and a resumable ledger. Full account observability setup gets a focused reference rather than a monitoring product tour.

**Decision and split.** Choose the next source of evidence, bounded concurrency change or repair batch. This page earns its own home because operating evidence differs from transfer correctness. A single root-cause investigation keeps inventory, batch repair and request metrics together; it should split further only if the later case cannot remain one investigation.

### OB-S11 — When directory buckets change the object protocol

**Outcome and entry.** Decide whether S3 Express One Zone/directory-bucket behaviour fits a workload and redesign the application assumptions it changes. Entry needs are a general purpose bucket's local operation/protection reminder; no claim that this is a drop-in tier switch.

**Sections and owned units.** “Locality, endpoint and session”, “Append at an expected offset”, “Atomic rename within the resource”, and “Rebuild the protection and change path” jointly own OB-U65. OB-U53's generic recognition lesson stays in OB-A15; this is the exact resource mechanism.

**Form and change.** Compare an append/read log or media workflow with ordinary multipart completion; append at a stale expected offset and reason about part count/checksum consequences. Rename within the documented same-resource boundary and test source/destination conditions. Then move the document application's version/event/replication assumptions onto this resource and show where they fail. Optional real execution must pin resource placement and supported SDK/API operations.

**Decision and split.** Choose this resource for a justified low-latency/append/rename need, retain general purpose storage, or keep a recovery source elsewhere. It earns a focused page because actual operation semantics change, unlike a name-only product comparison. This is a selective resource branch, not a commitment to every specialised S3 capability or filesystem adapter.

## Unit-to-section audit

The entries above are the teaching plan. This compact audit makes omissions and double homes visible. “Short” still has one local full recognition home; the substantive neighbouring subject is explicitly outside this collection. Coordinated shared homes are recorded in the field map; local recognition and application obligations remain here.

| Unit | One full teaching home or explicit boundary |
| --- | --- |
| OB-U01 | OB-A01 — The object operation |
| OB-U02 | OB-A01 — Bytes in a database, a file or an object service |
| OB-U03 | OB-A15 — Who operates and recovers the service? |
| OB-U04 | OB-A02 — Names, versions and validators |
| OB-U05 | OB-A02 — Bytes and their descriptions |
| OB-U06 | OB-A02 — Listing a namespace |
| OB-U07 | OB-A03 — A stream and its acknowledgement |
| OB-U08 | OB-A03 — Parts, sessions and completion |
| OB-U09 | OB-A03 — Ranges from one stored instance |
| OB-U10 | OB-A03 — Copying and moving content |
| OB-U11 | OB-A04 — What the comparison covers |
| OB-U12 | OB-A04 — An independent expected value |
| OB-U13 | OB-A04 — Content identity after transformation |
| OB-U14 | OB-A05 — What one acknowledgement makes visible |
| OB-U15 | OB-A05 — Check and write in one operation |
| OB-U16 | OB-A05 — When the response disappears |
| OB-U17 | OB-A05 — Equal content and intervening changes |
| OB-U18 | OB-A06 — Dependencies before the pointer |
| OB-U19 | OB-A06 — Competing releases and rollback |
| OB-U20 | OB-A06 — Readers and unreachable objects |
| OB-U21 | OB-A07 — An upload intent |
| OB-U22 | OB-A07 — Quarantine and acceptance |
| OB-U23 | OB-A07 — Two stores, two commits |
| OB-U24 | OB-A07 — Deletion and late arrivals |
| OB-U25 | OB-A08 — Authorising an operation |
| OB-U26 | OB-A08 — Delegating a bounded request |
| OB-U27 | OB-A08 — Encryption and the ability to recover |
| OB-U28 | OB-A08 — Ownership and evidence |
| OB-U29 | OB-A09 — The HTTP representation |
| OB-U30 | OB-A09 — Immutable URLs and changing aliases |
| OB-U31 | OB-A09 — Private viewers and a private origin |
| OB-U32 | OB-A10 — Identify the work and its bytes |
| OB-U33 | OB-A10 — Order within one key |
| OB-U34 | OB-A10 — Inventory and the missing interval |
| OB-U35 | OB-A10 — Commit effects before retry |
| OB-U36 | OB-A12 — Retrieval is an operation |
| OB-U37 | OB-A11 — Current names and older versions |
| OB-U38 | OB-A11 — What a hold protects |
| OB-U39 | OB-A11 — Following an erasure request |
| OB-U40 | OB-A13 — Which failure must the copy survive? |
| OB-U41 | OB-A13 — History, replication and independent copies |
| OB-U42 | OB-A13 — Choose a consistent recovery state |
| OB-U43 | OB-A13 — Prove the application works |
| OB-U44 | OB-A14 — Where a transfer spends its time |
| OB-U45 | OB-A14 — Objects, ranges and request amplification |
| OB-U46 | OB-A12 — Count the billable work |
| OB-U47 | OB-A14 — Follow the evidence |
| OB-U48 | OB-A16 — An auditable copy ledger |
| OB-U49 | OB-A16 — Concurrent writes and cutover |
| OB-U50 | OB-A15 — Test the required contract |
| OB-U51 | Short: OB-A01 — When stored files become a query resource; full table/catalogue/snapshot/query mechanics belong to analytical tables |
| OB-U52 | Short: OB-A01 — When stored files become a query resource; full vector/embedding/index/query mechanics belong to vector/search |
| OB-U53 | OB-A15 — One service name, several resource types |
| OB-U54 | OB-S01 — Resource, account and endpoint; Request identity and signing; Observe bytes, metadata and versions; Clean up what was created |
| OB-U55 | OB-S02 — Create and inspect an upload; Retry parts and complete; Verify full and composite checksums; Pin reads, copy and clean abandoned state |
| OB-U56 | OB-S03 — Conditional create and replacement; Conflict, deletion and uncertain success; Enforce the protocol for every writer |
| OB-U57 | OB-S04 — Evaluate the caller and resource policies |
| OB-U58 | OB-S04 — Sign an intent-bound upload; Browser completion and server verification |
| OB-U59 | OB-S05 — Authorise the origin fetch; Authorise the viewer; Inspect cache reuse and invalidation |
| OB-U60 | OB-S06 — Configure and inspect the delivery path; Identify versions and order same-key changes; Reconcile the bootstrap gap |
| OB-U61 | OB-S07 — Version-specific reads and deletion; Expiry and unfinished transfers; Holds, retention and bypass |
| OB-U62 | OB-S08 — Class and placement tradeoffs; Transition constraints and charges; Request, observe and verify a restore |
| OB-U63 | OB-S09 — Rules, roles and destination keys; Backfill and replication evidence; Deletion and configuration coverage; Restore a matching application state |
| OB-U64 | OB-S10 — Requests, limits and service errors; Logs, inventory and billing views; Batch work with partial failures |
| OB-U65 | OB-S11 — Locality, endpoint and session; Append at an expected offset; Atomic rename within the resource; Rebuild the protection and change path |
| OB-U66 | Short: OB-S01 — Tables and vector indexes are different resources; actual S3 Tables investigation belongs to analytical tables, not generic object storage |
| OB-U67 | Short: OB-S01 — Tables and vector indexes are different resources; actual S3 Vectors investigation belongs to vector/search, not generic object storage |

## Independent reader journeys

- **Newcomer building a document service:** OB-A01 → OB-A02 → OB-A03/04 → OB-A05 → OB-A07. Continue to OB-A06 for multi-file releases and OB-A08/09 for delivery. This is a dependency path, not a compulsory reading list before a first upload.
- **Designing a release protocol:** enter OB-A06. Its local manifest/condition reminder is enough to follow the argument; OB-A05 deepens concurrency, OB-A11/13 explains retained/recoverable releases.
- **A stale or missing private download:** enter OB-A09 or OB-A14 from the symptom. Route into OB-A08 for permission/key dependencies and OB-S05 or OB-S10 for concrete evidence. Do not route every 403 through an introductory course.
- **Choosing a service or moving one:** OB-A01 → OB-A15 → OB-A16. Follow only the failed conformance dimension into deeper general/S3 reading. The comparison includes the credible choice to keep data in an existing system.
- **A worker or derived index is wrong:** enter OB-A10, then OB-S06 for actual events. Full search/vector design remains in its own family; source-to-derived deletion remains intelligible locally.
- **Retention or recovery responsibility:** enter OB-A11 or OB-A13; OB-A12 tests retrieval deadlines/cost; OB-S07/08/09 supplies service mechanisms. A good stored-GB price is not recovery evidence.
- **AWS practitioner:** OB-S01 supplies reusable setup, then enter the relevant focused implementation article. A short local model and a general-home link precede commands; product readers are not sent back through all sixteen general pages.

## Sources and the claims they do not yet establish

The abilities file records primary scope checks. They support page boundaries, not completed article claims or experiment results. The following further checks sharpen the implementation choices, all accessed on 18 October 2026:

- [S3 presigned requests](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) documents bearer reuse and credential-bounded lifetime. This justifies the reuse/expiry failure cases in OB-S04. Later execution must pin signing settings and the actual browser/finaliser path.
- [Append in directory buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-append.html) and [rename in directory buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-rename.html) document resource-specific operations, including expected offset/session access and same-bucket rename. They justify OB-S11 and reject a universal “objects cannot append or rename” lesson. They do not make directory buckets interchangeable with general purpose buckets or establish application recovery correctness.
- [Directory differences](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-differences.html) records different endpoint/list behaviour and absent versioning, notification and replication facilities. Exact capabilities must be checked for the chosen placement/resource before the practical brief.
- [Lifecycle transitions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html) makes size, age, transition charges and storage-duration constraints consequential to OB-S08. Workload-specific calculation is still required; no price recommendation follows from a feature's existence.
- [S3 Tables](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html) and [S3 Vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html) expose specialised resource and service namespaces. Their product names do not justify teaching analytical snapshot commits or vector query behaviour again in object storage.

An attempted generic S3-to-CloudFront documentation URL did not resolve in the scope check. The selected OB-S05 architecture is a proposed investigation. A later brief must read the current CloudFront primary origin-access, viewer-authorisation and cache-policy documents before describing commands or claiming behaviour. No complete CloudFront configuration has been verified here.

## Cost decisions, hard boundaries and unresolved questions

The page count is deliberately a result. Identity and metadata stay together; transfers retain ranges/copy/multipart; publication retains reachability/collection; application lifecycle retains reconciliation/deletion; events retain repair; tier choice retains economics. These combinations save re-entry without hiding a distinct reader job. Concurrency/integrity/publication remain separate because they need different state models and failure evidence. Provider operations remain in a branch, so generic reading is not an AWS setup manual.

The eleven S3 articles each expose an actual boundary: request identity, multipart/integrity, conditional operations, delegated authorisation, cached delivery, notifications, version protection, archive retrieval, asynchronous replication, operational evidence and directory operations. This is not an equal-length series. OB-S01 may be short; OB-S09 can be longer where restoring valid later application work requires it. Keep their actual investigations bounded during commissioning, and split only if a mechanism cannot be understood without burying another outcome.

**Hard boundaries.** This plan covers object-application engineering and S3 operation through its documented interface. It does not cover self-operated storage-cluster competence, filesystem adapters in full, low-level erasure coding, an invented S3 engine, general distributed-systems theory, analytics table internals, vector retrieval design, IAM federation, cryptographic implementation or queue internals. Give local prerequisites before external handoffs. Shared distributed-systems work stays parked. AN17–AN22 and SR09–SR20 own table/vector teaching, and planned links must never look like available reading.

**Implementation choice requiring discussion.** S3 supplies a broad representative application/operations branch, but it cannot by itself teach object-store construction or self-hosted cluster operation. If “expert object-storage practitioner” is intended to include running Ceph/RADOS, this scope needs an additional operator branch rather than a nominal comparison paragraph. Its depth should be independently derived from placement, metadata, repair, capacity and upgrade tasks. Conversely, if only application integration is intended, some hosted operational exercises may be optional reader paths; their correctness requirements still need homes.

**Other uncertainties.** A stable Ceph release must be selected before detailed comparison; the checked `latest` API page explicitly describes development documentation. Provider contracts and SDK defaults evolve, especially conditional copy/delete, checksums, directory operations and specialised resources. CloudFront configuration still needs primary-source investigation. Recovery exercises require a decision about account/key independence and affordable archive waiting time. Actual lifecycle timing, duplicate AWS delivery, disaster independence and service throughput cannot be inferred from a browser model or a successful API call. The later briefs must separate documented, modelled and observed evidence.

**Delivery state.** Both files are planning artifacts for independent review. No articles, routes, maps, publication flags, commits or pushes were changed by this derivation. The proposed field reconciliation can later promote the agreed unit map into the collection's canonical coverage map; this commission explicitly keeps the derivation to these two files.
