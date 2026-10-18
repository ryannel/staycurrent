# Storage planning review

Independent practitioner and editorial review for an intelligent application engineer new to each subject. This is a review of planned teaching. It cannot establish whether an article teaches its plan, whether an experiment runs, or whether a draft is ready to publish.

## First account, before reading proposals or author ability lists

This account was recorded from the subject names and audience alone. It is preserved as the baseline for the later comparison.

### Caches and in-memory stores

A practitioner can explain what happens on a hit, miss, write, expiry and eviction, and identify which system owns the durable truth. They can choose a cache only after estimating reuse, memory cost, request distribution and acceptable staleness. They can distinguish caching a derived answer from using an in-memory store as the primary record, and recognise when the latter requires durability, recovery and explicit loss semantics.

They can design a key and its namespace, representation and lifetime; define what a reader may observe after a write; and reason through concurrent fills and invalidations. They can trace a stale fill that lands after invalidation, decide what versioning or a weaker freshness promise buys, and explain why TTL alone does not provide read-after-write behaviour. Negative caching, per-user answers and permission changes must obey the same ownership and isolation rules.

They can keep misses from becoming an outage. That includes request coalescing, bounded concurrent fills, jitter, retry limits, timeouts and an explicit response to a dead cache or origin. They can recognise a cold start, stampede, hot key, memory-pressure eviction and an origin bottleneck from measurements. They can distinguish a high hit rate from a useful latency or cost improvement, and can size headroom for a failover or warm-up.

For the selected implementation, they can predict the actual limits of command atomicity, transactions or scripts, persistence and replication. They can deploy a modest instance, set memory and eviction policy, observe it, recover it, and test loss or failover without confusing an acknowledgement with a durable replicated commit. Sharding and connection ownership need enough explanation to handle redirection, partial failure and skew. Distributed locking or rate limiting deserves an explicit safety boundary if used as an example; a cache's convenience primitives do not by themselves prove a coordination guarantee.

The collection need not teach every data structure, vendor, cache algorithm or consensus protocol. It does owe the reader a way to recognise when freshness, durability, multi-key atomicity, topology or working-set size makes the proposed design unsuitable.

### Object storage

A practitioner can explain a bucket, object key, bytes, metadata, version and range read, including why a key that looks like a path does not provide filesystem directory or rename semantics. They can map a real application's upload, publication, read and deletion path onto those operations. They can choose object storage for immutable or whole-object data and recognise the limits for frequent small updates, shared file mutation or transactional records.

They can make a multi-step operation correct despite a retry, timeout or race. They can distinguish an unsuccessful request from an unknown result, use conditional operations and stable identity, decide when bytes become visible to readers, and avoid publishing an index entry for an incomplete upload. They can explain single-object consistency separately from a multi-object snapshot or transaction. Multipart completion, abandoned uploads and whole-object replacement need concrete consequences, not just API names.

They can give access to an intended principal for the intended object and period, including browser upload/download, private access, temporary links, encryption and key ownership. They can reason about a leaked capability, unintended public access, tenant key confusion, content type and application authorisation. They can separate integrity checks from encryption and from a provider's durability claim.

They can recover a mistaken overwrite or deletion when recovery was configured in advance, and can distinguish versioning, lifecycle removal, retention protection, replication and an independent recoverable copy. They can identify what a failed region, lost credential, deleted encryption key or malicious delete actually leaves recoverable. They can inventory and reconcile database references against objects, including unreferenced bytes and missing referenced bytes.

They can measure and manage request cost, transfer cost, storage class transitions, retrieval latency, small-object overhead, prefix or partition pressure and incomplete-upload waste. For the selected provider they can run a small private workflow, test access, race/retry behaviour and recovery, and read the limits of the guarantee they rely on. An API-compatible service need not share another service's consistency, retention or operational guarantees.

The collection need not cover every cloud service, lakehouse format or storage backend. It owes a usable boundary between application correctness, provider guarantees and local simulation, and a route from a working upload to an operable application.

### Filesystems and block storage

A practitioner can distinguish a file API, filesystem, block device, volume, disk and managed network volume. They can follow an application write through buffering and writeback, explain what read, write, close, flush, synchronisation and acknowledgement establish, and identify which state can be lost at a process crash, host crash or storage failure. They can reason about a short write, an error reported later and the difference between atomic replacement and durable replacement.

They can construct and test a safe file update involving a temporary file, synchronisation, rename and any required directory synchronisation, with platform and filesystem conditions stated. They can understand why journalling, a snapshot or a successful rename does not alone prove application recovery. Shared mutation needs enough treatment of locks, concurrent readers and naming to show when a database would be the safer tool.

They can choose and provision local or network-backed storage from latency, throughput, IOPS, access shape, queueing, capacity and failure domain. They can predict the consequence of a small synchronous write versus a large sequential transfer, contention, capacity exhaustion, inode exhaustion and provisioned-performance limits. They can interpret a useful benchmark without mistaking cached reads for device throughput or a brief burst for sustained performance.

They can recognise whether a volume may be mounted by several clients and what coordinates them, including what an ordinary filesystem cannot make safe on a shared block device. They can distinguish block attachment from a shared filesystem service and understand the practical limits of local POSIX assumptions on remote filesystems. Mounts, ownership, permissions, paths and symlinks need enough treatment to make the selected application's deployment and access boundary work.

They can take and restore a copy appropriate to a running application's consistency needs, explain crash-consistent versus application-consistent snapshots, and test a restore on another host. They can distinguish resilience to device loss from protection against deletion, corruption and application mistakes. For the selected implementation they can inspect the relevant layers, measure a representative workload, observe space and I/O pressure, and recover deliberately damaged application state.

The collection need not teach filesystem internals, driver development, every RAID level or every cloud volume. It owes enough of those mechanisms to prevent incorrect durability claims, dangerous shared mounting and unrepresentative performance decisions. The boundary between application file safety, filesystem guarantees and device/provider guarantees must stay visible.

## First findings after the assigned proposals

Read `caching-proposal.md`, `objects-proposal.md` and `files-proposal.md` after preserving the first account above. Consulted the corresponding ability files to check whether a short article contract had omitted a case that its mapped unit already covered. No older plans, inventories, other reviews or coordinator decisions informed this reading. This is the first independent account, before any integration overlay.

**Judgement:** all three are ready for user discussion as substantive proposals. They need the small concrete repairs below before their affected teaching contracts should be commissioned. I found no reason to replace their overall shape, to set a smaller page target, or to demand a second complete implementation branch. Readiness for discussion does not establish factual verification, runnable exercises, finished teaching or publication readiness.

### Consequential repairs

#### ST-01 — Cache validity must include a changed permission

**Reader outcome at stake:** prevent a previously valid cached answer from disclosing data after access is revoked. Choosing a tenant-aware key alone does not tell the reader what changes when a user's permissions change while the underlying event data does not.

**Home checked:** CA-A02, “The identity of a result”, “How old is this answer?” and “Repair after missed changes”; CA-U04 includes permission context and the proposal's worksheet promises a valid answer. CA-A17/CA-U52 handles Redis access control, which is a different boundary from application permission to see a cached result.

**Why owed:** this collection owns the cached-answer contract, including its key, freshness and invalidation. A reader should not have to infer that an authorisation dependency needs its own freshness rule. The initial ability file names permission context but its changed case is a tenant collision/representation change; neither exposes revocation of an answer already resident under the right tenant key.

**Smallest repair:** add one permission-revocation trace to the existing A02 worksheet. Keep the event bytes unchanged, revoke a reader's access, then ask whether the next hit may be returned. Compare a current authorisation gate, a policy/version dependency or an explicitly acceptable stale permission contract. Explain the consequence of missing the permission-change signal. This is a case within validity, not another security article. A17 retains engine ACLs.

#### ST-02 — Duplicate suppression needs a survival contract as well as a time limit

**Reader outcome at stake:** avoid claiming retry safety when an operation's effect remains but its operation-ID evidence disappears. A time-based expiry example alone makes it easy to think that choosing a long TTL solves the whole problem.

**Home checked:** CA-A06, “The request ran; the reply was lost”; CA-A13, “Operation IDs and replay”; CA-U22/CA-U41. CA-A04 and A11 separately distinguish evictable and authoritative data; A14/A15 teach persistence and failover. The planned retry investigation does not explicitly join those survival choices to the deduplication evidence.

**Why owed:** the same atomic boundary already joins the mutation and deduplication record. Its continued validity also depends on which facts survive pressure, restart or promotion. Readers operating a selected Redis counter need the consequence locally; a link to persistence cannot by itself establish that their retry proof still holds.

**Smallest repair:** extend the A13 exercise with one state where the effect exists but duplicate-suppression evidence does not. Require the reader to state both the retention window and the eviction/persistence/replication fate of the record, plus what happens when the evidence budget is exhausted. A06 supplies the general sentence and links to survival; A13 applies the actual engine contract. Do not add a separate idempotency article or pretend that co-locating two keys proves stronger failure survival.

#### ST-03 — Redis practical work has no owned reusable starting environment

**Reader outcome at stake:** a direct Redis entrant can reproduce the first investigation with the intended settings, then carry the same known environment into later exercises. Otherwise server startup, client configuration and fixture assumptions become implicit prerequisites scattered across seven pages.

**Home checked:** CA-A11's entry and teaching form, CA-A12's selected client/source fixture, and the implementation preamble requiring real processes and recorded versions/settings. These establish execution requirements but assign no full home for obtaining and starting the initial instance/client/fixture. The object proposal does assign this job explicitly to OB-S01.

**Why owed:** the branch promises to integrate, operate and recover a selected implementation for newcomers. A repeatable environment is a small practical obligation, not a reason for a parallel installation manual.

**Smallest repair:** give A11 a short owned reusable setup worksheet: pinned server/client, isolated process/data directory, explicit initial persistence/memory/access settings, sample keys, inspection and cleanup. A12 extends it with the source fixture; A15/A16 introduce their different topologies. State the single-instance baseline so direct entrants do not silently bring a managed-service or cluster contract. Keep A11's main investigation about execution and memory.

#### ST-04 — The filesystem branch needs an explicit build path through its independently sized layers

**Reader outcome at stake:** a newcomer can assemble the stack used by the XFS investigations, and a direct volume entrant knows which worksheet creates the input expected by another. Otherwise correct local instructions can leave the reader with a block device, filesystem or mapping that none of the pages actually established in their reading order.

**Home checked:** the initial-environment preamble; FS-L01's native XFS observations; FS-L03's “identified block device” entry and correctly sized device boundary; FS-L05's ordinary thick LV; FS-L07's encrypted mapping; FS-G09's general ordered-change model. FS-U26 explicitly includes initialise/mount/persist, but the implementation path does not assign that complete first mounting/reboot verification to a named section.

**Why owed:** understanding independent layers is central to the promise. The implementation branch should make the first working stack as explicit as its later thin-pool, resize and repair work. I supplied the missing assembly order from prior knowledge while reading.

**Smallest repair:** name a reusable disposable-environment worksheet and a concrete route in the branch entrance: obtain identified disposable devices, create the ordinary mapping in L05, create/mount XFS in L03, verify identity and the chosen mount lifecycle, then inspect it in L01/L02. Put optional LUKS insertion and cloud/NFS variants on that same layer diagram. Assign actual creation/mount/lifecycle verification to L03 rather than leaving it only in general G09. This needs an entry paragraph and section ownership, not another article.

### Page cost and boundaries worth preserving

**Cache validity and overload answer different questions.** CA-A02's stale-fill ordering is already a full investigation; CA-A03's source budget is not a redundant cache article. A correct old answer does not show whether the source survives misses. Keep them separate. Within A02, key identity, age and fill ordering belong together. The permission case above strengthens that investigation without creating another entrance.

**The accepted-state path is justified, but must remain conditional.** CA-A05/A06/A07 progress from representation to invariant to loss. Merging atomic execution into survival would hide the fact that an atomically accepted update can later disappear. A08's restore/reconciliation has an outcome distinct from A07's failure matrix. Redis A14 and A15 likewise need separate artifact and replica histories. A17 should integrate completed procedures; its warning against inheriting unfinished teaching is useful.

**The cache comparison has credible alternatives without superficial operator branches.** CA-A10's local cache, Memcached, Redis and Valkey are different enough to challenge the workload. A choice of Redis as the first implementation is defensible for this application audience. It remains an explicit choice, not proof that protocol ancestry gives Valkey identical runtime or recovery behaviour. No second seven-page branch is required merely to balance names. Strict acknowledged-write survival must lead to an actual suitable alternative or a refusal of this use; the proposal correctly retains that boundary.

**Object integrity deserves its own investigation.** OB-A02 must establish identity before OB-A04 can compare what a validator proves. OB-A04's identical bytes/different transfer shape and wrong-input case are more useful than an ETag warning in a footnote. OB-S02 then needs the returned S3 fields and request evidence. That is a general explanation plus implementation application, not automatic duplication.

**Publication and acceptance should remain distinct.** OB-A06 owns complete multi-object reachability and reader-safe reclamation. OB-A07 owns validation, trust, two commits and late arrivals. A merger would ask readers to hold release readers, upload attackers, database state and cleanup in mind together. Keep the cleanup consequence with publication and the reconciler with acceptance; neither can be shortened to “upload then update the row”. Filesystem G06 has the analogous local generation problem, but must retain its own open-file/name/lock mechanisms. A cross-link can acknowledge the analogy without moving either complete protocol to a parked shared course.

**Object recovery is adequately deep at the planning level.** OB-A13 and OB-S09 explicitly include references, keys, independence, replication gaps and restored application state. A successful GET is rejected as insufficient. OB-A11's retention versus deletion and OB-A12's archive timing are necessary inputs with distinct questions. I found no missing recovery article to add. Their direct-entry local reminders are important because the object journey is otherwise substantial.

**Keep specialised object resources away from the first useful request.** OB-A01's table/vector recognition and OB-S01's matching recognition should remain short signposts. Their owned full recognition is legitimate, but a newcomer does not need a taxonomy of branded resources before knowing what a normal object operation supplies. The smallest cost control is to place those signposts after the core worked choice/setup and offer OB-A15/OB-S11 as optional onward reading. OB-S11 has a real changed contract and deserves its optional focused home; it should not become a prerequisite for ordinary S3 use merely because rename or append exists there.

**The S3 permission page is the main product-page pressure point.** OB-S04 covers policy evaluation, cross-account/network boundaries, KMS, signing, CORS and finaliser verification. That can remain one investigation only if every policy example belongs to the same upload/read path and each changed case explains the next failed request. Its exact permission reference should not become a second IAM course. Preserve application commit-gap teaching in A07. If the later draft cannot follow one request path, first remove unrelated policy combinations; do not automatically split signing from the policies that make its request valid.

**The S3 operational dossier also needs one actual question.** OB-S10's metrics, logs, inventory, billing and Batch Operations can become a console tour. Its proposal already requires a single root-cause investigation. Enforce that by making the partial-failure repair batch the result of the diagnosed incident; link to an existing inventory/notification lesson when full bootstrap reasoning is needed. No page-count judgement follows until that trace exists.

**Filesystem structural recovery earns room separate from application safety.** FS-G04's contents/name/device acknowledgement argument is already demanding. FS-G05 teaches why recovered filesystem structures do not establish correct application content. FS-L02's real XFS log-pressure mechanism and L04's actual triage/repair are distinct operator investigations. Keep them, with short reminders rather than a second full journalling lesson in L02.

**Filesystem concurrency is a watchpoint, not yet a split finding.** FS-G06 has locks, append/rotation and generation publication. Those can fit if locks and append are the deliberately insufficient approaches the running generation problem tests. A full independent logging curriculum would overwhelm it. Preserve its final reader/reclamation case even if supporting append material is cut or moved. FS-G07 likewise stays coherent as a small path/identity/retained-copy matrix; detailed key recovery is properly in L07. Neither merits an automatic new article.

**The filesystem operator scope is honest.** XFS/LVM/LUKS, EBS and Linux NFS supply substantive runnable mechanisms. Ext4/OpenZFS comparison does not promise operating competence, and SMB/Windows, cluster filesystems, Ceph, SAN and CSI are explicitly outside the first branch. That is appropriate for an application engineer learning a Linux service stack. A Windows or storage-appliance audience would need a changed implementation commission, not a few feature-table additions. FS-N01's trusted-lab identity boundary must remain visible; running two clients there does not establish production identity administration.

**Diagnosis, measurement and restore are not interchangeable pages.** FS-G13 finds a bottleneck; G14 designs a measurement without changing the durability question; G16 reconstructs the service; G18 handles a continuing source and late writers. Their changed cases justify the separate entrances. The native fio worksheet does real work that a queue model cannot. G12's byte/inode/quota/open-file/thin-pool ledger is more useful than a generic free-space article; the ability file confirms that the short proposal heading still owns those cases.

### Entrants and prerequisites I supplied

The proposals consistently give incident entrants a local state model and send them to the full mechanism only when required. I did not need a general distributed-systems curriculum to evaluate the stale-fill, uncertain-reply, object publication or shared-volume failures. Keeping that shared programme parked is reasonable.

I did supply the Redis process/client starting environment and the filesystem build order noted in ST-03/ST-04. I also supplied the connection between idempotency evidence and the selected key's loss contract in ST-02. These are the prerequisites that should become explicit. The object proposal's reusable S3 setup, manifests, stored identities and separate general/product homes make its starting assumptions clearer.

Title promises mostly match outcomes. “Concurrent writes and uncertain outcomes”, “Recovery that restores an application”, “When a saved file survives a crash” and “Why a volume is full” give useful direct entrances. “Establish the byte interface” is a planning group label; the actual article title “What object storage gives an application” is the better reader entrance. Do not expose the planning label as a prerequisite whose meaning newcomers must decode.

### Disagreements and limits preserved

I do not agree that a large number of proposed homes by itself demonstrates excess reading cost. Many are optional operator/incident entrances with distinct state histories. Equally, saying the count was derived does not prove every boundary optimal. The product-page watchpoints above need a concrete worked trace at commissioning, not another assertion that one unit has one home.

I would not expand the initial object scope into Ceph cluster operation for this audience, or the filesystem scope into Windows/SMB operations, solely to defend the word “practitioner”. The selected deployment boundary is explicit and useful. If the publication intends the broader operator promises, that is a scope decision needing its own derivation; these comparisons cannot discharge it.

I have not checked live provider claims or version-specific commands in this review. Statements about features in the proposals remain authoring verification obligations. The finding here is about what the plan commits to teach, including whether models, documented behaviour and executed observations are distinguished. All three proposals make that distinction well.

## Bounded repair recheck of the coordinated maps

Read the actual final `docs/coverage/caching.md`, `object-storage.md` and `files-and-block-storage.md`, comparing their changed contracts with the first proposals. Read the relevant ownership and field-page rows in `databases-and-storage.md`, and the authoritative/disposable Redis entrances and unit reconciliation in `key-value-and-wide-column.md`. This is a later, cued repair check. It does not replace the independent first account above.

**Judgement:** the four required repairs are now explicit teaching obligations in the maps. The coordinated allocation is ready for user discussion on this review's subjects. I found no material contradiction that requires another planning repair before that discussion. The claims remain about proposed teaching, not completed articles, verified provider behaviour or executed practical work.

| Finding | Actual home checked | Recheck |
| --- | --- | --- |
| ST-01: cached permission revocation | CA-A02, “Permission-change case” | Resolved in the plan. It holds event bytes and the correct tenant key constant, revokes access, inspects the hit, compares current gating/version dependency/permitted stale authority and requires a missed-signal repair. Redis ACLs remain a separate boundary. |
| ST-02: duplicate-suppression evidence survival | CA-A06, “Retry evidence”; CA-A13, “Native acceptance cases” | Resolved in the plan. Retention is now separate from eviction/restart/promotion survival. A13 must execute a supported state with effect present and evidence absent, state persistence/replication fate and handle exhausted evidence capacity. The counter/atomic-expiry/window-boundary case gives the additional keyed use a concrete native acceptance result. It must not be reduced to selecting a TTL. |
| ST-03: reusable Redis environment | CA-A11, “Reusable starting worksheet owned here” | Resolved in the plan. Server/client, isolated single instance, disposable directory, memory/persistence/access settings, sample keys, inspection/reset/cleanup have one explicit home. A12 extends the fixture and A15/A16 extend topology. |
| ST-04: filesystem assembly and mounting | FS-L03, “First working stack owned here” | Resolved in the plan. The route identifies disposable devices, creates the ordinary mapping in L05, creates/mounts XFS in L03 and verifies identity plus restart/remount before L01/L02 observation. LUKS insertion and EBS/NFS variants are visible. Native mount/lifecycle work is no longer left only to G09's general change model. |

The shared Redis allocation preserves the two roles that justify different entrances. The keyed map's authoritative route starts with state, atomic changes and survival, then enters A11/A13 and actual persistence/topology work. The disposable-cache route starts with validity and source protection. Both reach one implementation branch. The field map explicitly gives coherence to A02, source load to A03 and admission to A04; adding the keyed units therefore does not create a second competing explanation. The reconciled native counter and retry case belongs with A13's existing invariant investigation rather than in a product-summary page.

CA-A17's new direct entrances address its page-cost risk at the planning level. Evidence-led diagnosis remains the default, baseline setup is linked to A11, and named maintenance has a separately reachable outcome with supported versions, discovery, interruption, acceptance and rollback/restore gates. A14/A15 remain the mechanism homes. The later draft still needs to show that those entrances are usable without forcing an incident reader through a maintenance worksheet; this is a draft check, not an unresolved reason to split the plan now.

The object map retains the substantive byte-interface work. Its opening coordination notes put table/catalogue semantics in AN17–AN22 and vector mechanisms/evaluation in SR09–SR20, while leaving arbitrary release publication, stored-version identity, transfer integrity, lifecycle, access and application recovery here. That matches the shared field rows. Optional specialised-resource recognition follows the first ordinary object operation. OB-S04 is constrained to one upload/read request path, and OB-S10's repair batch must follow from its diagnosed incident. Those are concrete controls on the pressure points identified in the first review, rather than a promise to make every page short.

FD05 now owns the transferable authority/cutover/rollback proof. OB-A16 is explicitly its application to object names, versions, metadata, permissions and URLs. The original A16 card still describes a continuing-source/cutover trace, but the superseding ownership note makes its purpose the byte-specific compatibility and verification cases; it should not be commissioned as a second generic migration tutorial. File G18 retains its own live-tree metadata, sparse-layout, link and ownership consequences. Likewise, the file map's reference to relational RL95/RL96 does not discharge G15/G16's local checkpoint/consistency and later-valid-work obligations: the boundary row explicitly keeps those here. I found no restoration or reclamation consequence removed by coordination.

The earlier authoring watchpoints remain useful: A17's combined diagnosis/change presentation, OB-S04's policy scope, OB-S10's operational dossier and FS-G06/G07's supporting cases need actual sequential reading once written. The coordinated maps do not justify declaring those future pages successful, and they do not need automatic new articles now.
