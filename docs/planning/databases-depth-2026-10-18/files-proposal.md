# Filesystems and block storage: derived proposal

18 October 2026. Planning only. Derived from the separately persisted `files-abilities.md`; no existing outline, inventory, coverage map, old field proposal or other derivation was consulted. No article, route or publication state changes are proposed by this file itself. No experiments were run.

## What this collection must deliver

A reader should be able to defend the storage contract their application needs, locate which layer supplies it, operate a concrete stack and recover useful application data after failure. A page that describes files and volumes without teaching allocation, acknowledgement, sharing and recovery separately cannot deliver that result.

The derivation yields **56 units with 30 proposed teaching homes**. This is the result of the boundaries below, not a target. There is one collection entrance, 17 further general explanations or practical investigations, one implementation comparison and 11 implementation articles. The implementation work has seven Linux local-stack articles, two hosted-block articles and two network-filesystem articles. Worksheets and models live alongside the questions they answer; there is no additional compulsory sandbox or practice destination in this count.

| Article group | Proposed homes | Job |
| --- | --- | --- |
| **FS-GROUP-APP — Interfaces and application correctness** | FS-G01–FS-G08: 8 | Choose the interface; use names, bytes, durable boundaries, writers, access and sharing correctly. |
| **FS-GROUP-BLOCK — Devices and volumes** | FS-G09–FS-G11: 3 | Change the stack safely; understand physical-device behaviour and redundancy. |
| **FS-GROUP-OPS — Capacity, evidence and recovery** | FS-G12–FS-G18: 7 | Keep space available, diagnose/measure work, capture recoverable state, restore and migrate. |
| **FS-GROUP-CHOICE — Implementation choice** | FS-C01: 1 | Compare ext4, XFS and OpenZFS under consequential operating constraints. |
| **FS-GROUP-LINUX — XFS, LVM and encrypted mappings** | FS-L01–FS-L07: 7 | Explain and operate a real Linux local stack, with separate allocation, log, lifecycle, repair, mapping, thin-pool and key-recovery investigations. |
| **FS-GROUP-EBS — Hosted block storage** | FS-E01–FS-E02: 2 | Operate EBS performance/attachment and its snapshot/restore path. |
| **FS-GROUP-NFS — Shared files on Linux** | FS-N01–FS-N02: 2 | Establish a real NFSv4.1 identity/export contract and observe its two-client/outage behaviour. |

These identifiers are local planning identities, not routes. All 56 units have exactly one full teaching home below. Another article can give a short reminder and a link, especially for direct entrants; it cannot silently re-teach the full mechanism.

## Entrances and implementation depth

FS-G01 explains the territory and offers routes by work: “my save must survive a crash”, “another machine needs the directory”, “a volume is full/slow”, “I need a recoverable copy” and “I am choosing a filesystem”. A newcomer can follow G01 → G02 → G03 → G04 and then choose work. The collection is not a 30-page prerequisite chain.

A slow-volume entrant starts at G13, receives a small local explanation of requests, caches and acknowledgement, then uses G14 or the relevant implementation article. A restore entrant starts at G16; it defines a recovery point and consistency boundary locally before linking G15/G17. A shared-directory entrant starts at G08 or N01 and receives the distinction between remote files and remote blocks there. An XFS entrant can begin at L01, L03 or L04 without completing the whole general route. The entry needs below are actual required concepts, not blanket instructions to read everything earlier.

The initial real environment is a pinned, supported Linux distribution, XFS and LVM2, with LUKS where encrypted mapping is the lesson. The authoring commission must select the exact distribution/kernel/xfsprogs/LVM2/cryptsetup combination before runnable instructions are written. EBS supplies a concrete provider contract; Linux NFSv4.1 supplies a concrete network-file contract. A disposable local VM can teach most Linux work. It cannot establish EBS semantics or hardware power-loss durability. Native two-client NFS work needs separate clients and a server; a browser is useful for cache and lease states but is not a substitute.

XFS earns depth through allocation, reflink, metadata logging, quotas, resize eligibility and recovery. LVM earns separate work through mappings and physical thin-pool exhaustion. EBS earns separate work through attachment/lifecycle, per-layer performance constraints and restore readiness. NFS earns separate work through client/server state, identity, coherence and outage handling. Neither “Linux storage” nor “NFS supports POSIX” stands in for these mechanisms.

## Interfaces and application correctness

### FS-G01 — Files, shared directories and block volumes

**Outcome and decision:** Choose which storage interface to investigate, and write a short contract stating required operations and tolerated losses.

**Owned sections:** “The operations an application needs” → FS-U01; “Which layer makes the promise” → FS-U02; “What survives which failure” → FS-U03.

**Entry:** Familiarity with a service and its files; no storage vocabulary. **Form:** Operation comparison, a layered write-path diagram and failure-domain cases. **Necessary changed case:** The same upload moves from local scratch to a volume retained after host replacement, then to a shared directory. Its interface, ownership and loss domain change independently.

**Boundary:** Keep these together because an interface choice without its provider and lifecycle boundary is misleading. Leave file-call correctness, replication mechanisms, implementation commands and recovery practice to their homes. Containers/CSI get only the local sentence that attachment, mounting and application access are different promises; no Kubernetes operations curriculum.

### FS-G02 — Paths, opened files and changing names

**Outcome and decision:** Predict what a reader will see after rename/unlink, and decide whether a proposed path/copy workflow preserves identity and portability.

**Owned sections:** “Resolve a name to an opened object” → FS-U04; “Replace a name while readers are open” → FS-U05; “Move a tree between namespaces” → FS-U06.

**Entry:** A file and directory model, provided in the opening. **Form:** Clickable name/object/descriptor trace and short native cases. **Changed case:** A worker keeps the old manifest open after replacement; an unlinked upload still occupies space; moving the staging directory across a mount becomes a different operation.

**Boundary:** Names and object lifetime belong together. Directory durability belongs in G04, malicious path resolution in G07, and full migration execution in G18. Windows/SMB behaviour is explicitly contrasted where it changes the prediction; Linux observations do not become portable rules.

### FS-G03 — Reading and writing bytes

**Outcome and decision:** Implement a checked I/O loop and choose an access mode based on actual semantics and workload.

**Owned sections:** “Progress, offsets and errors” → FS-U07; “Buffered, direct and mapped access” → FS-U08.

**Entry:** An open handle; G02 offers detail, with a local reminder here. **Form:** Annotated small programmes and cache/offset traces. **Changed case:** A write completes partly; the same workload switches from buffered to direct; a mapped file is truncated while another process uses it.

**Boundary:** The page stops at access-mode consequences. Direct-I/O alignment and support are versioned implementation details; it does not teach firmware queues. G04 owns persistence, G06 application invariants, G14 performance measurement. The programme and its changed access mode need each other, so a page for each API would add navigation without a new investigation.

### FS-G04 — When a saved file survives a crash

**Outcome and decision:** Specify and implement a bounded durable single-file publication protocol, including the acknowledgement and failure path.

**Owned sections:** “Choose the durable boundary” → FS-U09; “Persist contents and the name” → FS-U10; “Reach non-volatile storage” → FS-U12; “A writeback error leaves work unresolved” → FS-U14.

**Entry:** Writes can be buffered and partial; the opening supplies that reminder. **Form:** One crash-point timeline with runtime buffer, kernel data, namespace and device state; a small Linux protocol worksheet. **Changed case:** A process crash becomes host power loss; rename succeeds but the directory has not been synchronised; synchronisation reports an error. Require the reader to distinguish visible, documented durable and unknown states.

**Boundary:** These steps form one acknowledgement argument, so splitting file and directory sync would break the lesson. Filesystem structural recovery is G05, multi-file application state G06 and batching measurements G14. Linux calls are labelled as a concrete contract; other platforms need their documented equivalents. No desktop or VM crash test alone proves real power-loss protection.

### FS-G05 — How a filesystem recovers its structures

**Outcome and decision:** Explain what journalling and copy-on-write protect, and decide which application guarantees still need their own protocol.

**Owned section:** “Ordered recovery of allocation and names” → FS-U13, developed through an interrupted metadata update, log replay and COW root publication, then the remaining application problem.

**Entry:** Names refer to objects and storage blocks; a small local drawing supplies this. **Form:** Paired crash-state models with ext4/XFS and COW implementation contrasts. **Changed case:** A recovered directory is structurally sound while the manifest names an incomplete output generation.

**Boundary:** This unit earns an article because it needs its own invisible-state investigation. It would distract from the application acknowledgement proof in G04. It stops before on-disk structure catalogues or implementation of journal algorithms. Actual XFS logging is L02; corruption and repair are G17/L04.

### FS-G06 — Concurrent writers and coherent file generations

**Outcome and decision:** Decide when a lock is enough, when immutable generations help, and when file protocols should give way to a transactional store.

**Owned sections:** “The atomic unit is smaller than the invariant” → FS-U11; “Coordinate competing writers” → FS-U15; “Append and rotate with existing readers” → FS-U16; “Publish and reclaim generations” → FS-U17.

**Entry:** Name replacement and opened objects; provide a compact trace before the first race. **Form:** Two-process interleavings and a manifest model. **Changed case:** Two workers derive updates from `g17`; then a reader stays on `g17` while publication reaches `g18` and cleanup deletes old files. A torn record defeats an assumed whole-record append.

**Boundary:** Keep publication and reclamation together because fixing one creates the other's race. Lock command semantics and lifetimes are explicit; network locks are only introduced locally and developed in G08/N02. This is a bounded application-protocol lesson, not a general concurrency or distributed-systems course. If the lock/append section outgrows its supporting role during authoring, re-evaluate the split rather than shorten the generation lesson.

### FS-G07 — File access, path safety and encryption boundaries

**Outcome and decision:** Define who can operate on a path, choose a safe opening strategy and choose which copies and keys must remain protected and recoverable.

**Owned sections:** “Open beneath a trusted directory” → FS-U18; “Identity and directory policy” → FS-U19; “Keys, retained copies and deletion” → FS-U20.

**Entry:** Paths and descriptors, with a local reminder. **Form:** Permission/path worksheet and small threat/recovery matrix. **Changed case:** An upload path is replaced by a symlink between check and open; a container's numeric identity differs from the host's intended user; a deleted file survives in a snapshot whose key is retained.

**Boundary:** This is a single access-boundary argument: namespace handling, authorisation and encryption answer different adversaries. Detailed key/header procedures belong to L07. Network identity is N01, organisation-wide IAM and compliance external. Do not expand this into a survey of every ACL syntax.

### FS-G08 — Sharing files across machines

**Outcome and decision:** Choose a shared-file service, application coordination or exclusive volume ownership from the consistency and failure behaviour required.

**Owned sections:** “Remote files, copied trees and shared blocks” → FS-U21; “Cached readers and concurrent writes” → FS-U22; “Timeouts and recovered state” → FS-U23; “Fence a former volume owner” → FS-U24.

**Entry:** Files and writers; the opening shows a local single-writer case. **Form:** Two-client state traces and a separate stale-owner block trace. **Changed case:** A second host arrives; cached state persists while the network fails; the old block-volume writer returns after failover.

**Boundary:** The interface/failure comparison belongs in one decision page. It introduces only the cache, lease and fencing context needed locally; the shared systems programme stays parked. Detailed NFS configuration and observations are N01/N02. SMB is a consequential alternative, not assumed equivalent; a Windows/SMB operational branch remains outside the initial plan. Cluster filesystem and SAN deployment are external.

## Devices and volumes

### FS-G09 — Provisioning and resizing a storage stack

**Outcome and decision:** Produce an ordered change plan that identifies the right device and each independently sized layer.

**Owned sections:** “Identify the device behind the mount” → FS-U25; “Create, mount, grow and move in order” → FS-U26.

**Entry:** Block device versus filesystem, explained locally. **Form:** Layer inventory and reversible/disruptive change worksheet. **Changed case:** The provider reports a larger disk, but the partition or filesystem is still the old size; a reattached device has a new transient name; requested shrink is unsupported in this environment.

**Boundary:** The general home teaches identification, preconditions and operation ordering. Commands and supported limits are L03/L05/E01. RAID and media behaviour have separate failure arguments in G10/G11, preventing a generic volume chapter from swallowing them.

### FS-G10 — The device beneath the block interface

**Outcome and decision:** Interpret device specifications and changing latency without assuming a disk block is a physical write unit.

**Owned sections:** “Sectors and alignment”, “SSD writes and endurance” and “Discard across mappings” → FS-U28.

**Entry:** Addressed blocks and requests. **Form:** Small sector/erase-unit model plus specification-reading cases. **Changed case:** Repeated small overwrites replace sequential ingest; a nearly full SSD has less spare working room; discard stops at a mapping layer.

**Boundary:** This earns its own page because the media model explains otherwise surprising cost and lifetime. Stop when the operator can ask for physical/logical sizes, endurance, protection and supported discard evidence. No FTL implementation, queue submission programming or universal performance promise from the diagram. G13/G14 own diagnosis and measurements.

### FS-G11 — Redundancy, failure and rebuilding arrays

**Outcome and decision:** Choose a redundancy arrangement from tolerated device failures, usable capacity and degraded-workload risk.

**Owned sections:** “Stripe, mirror and parity”, “Work while degraded” and “Rebuild exposure” → FS-U27.

**Entry:** Independent devices and failure domains, locally introduced. **Form:** Block-placement and failure/rebuild models with worked capacity. **Changed case:** A second device fails during rebuild; two “independent” copies share a controller or enclosure; deletion reaches every healthy replica.

**Boundary:** Redundancy needs room for the second failure rather than a RAID-level table. It remains separate from device internals and backup. Implementation commands for mdraid/hardware controllers, full RAID write-hole mechanisms and SAN design are external references, with enough explanation to recognise when power-protection or implementation evidence is required.

## Capacity, evidence and recovery

### FS-G12 — Why a volume is full

**Outcome and decision:** Locate the exhausted resource and set actionable headroom/retention policy from growth rate and response time.

**Owned sections:** “Different counters count different things” → FS-U29; “Allocated, shared and physically available space” → FS-U30; “Headroom before the next response” → FS-U31.

**Entry:** A file tree and its volume; opening explains allocation versus length. **Form:** Space ledger, incident counters and forecast. **Changed case:** Deleting a large log does not release it while a process holds it open; a thin guest reports abundant free bytes while its pool metadata is exhausted; snapshots retain changed blocks after deletion.

**Boundary:** Keep logical/physical counters and response planning together: an accurate counter without time to act is insufficient. L01/L06 own actual reflink/thin mechanisms and commands. This page owns the general capacity argument, not detailed firmware overprovisioning or cloud billing tables.

### FS-G13 — Finding storage latency

**Outcome and decision:** Identify the next discriminating observation and choose whether to change workload, cache, filesystem, device, instance or network capacity.

**Owned sections:** “Request size, rate and outstanding work” → FS-U32; “Where this workload waits” → FS-U33; “Correlate evidence across layers” → FS-U34.

**Entry:** No performance course; introduce IOPS, byte rate and latency using the running workload. **Form:** Queue model, worked numbers and a correlated incident record. **Changed case:** Large uploads become tiny metadata-heavy jobs; a warm test becomes a cold read; application latency rises while average device latency appears flat.

**Boundary:** The bottleneck investigation remains together because metrics only matter in relation to the path. G14 owns controlled measurements and L02/E01/N02 own implementation diagnosis. No comprehensive observability programme is activated.

### FS-G14 — Measuring storage without changing the question

**Outcome and decision:** Produce a reproducible workload profile, interpret its distributions and decide whether an observed improvement preserves the required durability boundary.

**Owned sections:** “Specify the workload and environment” → FS-U35; “Measure the acknowledgement the application needs” → FS-U36.

**Entry:** Throughput, latency and cache layers; give a short reminder and link to G13. **Form:** Native fio worksheet and matched application sync profiles. **Changed case:** A test dataset fits in memory, a sync flag is removed, or queue depth grows while a serial service remains serial. Each makes a headline number answer a different question.

**Boundary:** This is a practical execution page because reproducibility and interpretation are substantial work. It stays separate from incident diagnosis. It contains no claimed benchmark until the exact tests run; hosted/storage-family comparisons require matched conditions and evidence.

### FS-G15 — Taking a recoverable snapshot

**Outcome and decision:** State exactly what a snapshot captures, coordinate the necessary layers and decide whether its failure domain meets the intended recovery need.

**Owned sections:** “A snapshot retains a view” → FS-U37; “Capture a consistent application boundary” → FS-U38.

**Entry:** Persistent state and buffered work, reintroduced locally. **Form:** Snapshot/space model and a database–manifest–queue capture timeline. **Changed case:** A filesystem freeze succeeds while application buffers remain unwritten; independent snapshots capture opposite sides of a two-volume update; the source pool is lost with its local snapshots.

**Boundary:** Keep snapshot mechanics and capture coordination together, because otherwise “point in time” reads as application consistency. G16 owns restore objectives, rehearsal and reconciliation; L06/E02 own commands, asynchronous operations and limits. Database checkpoint/replay details stay in the database's own home, while their required handoff is shown here.

### FS-G16 — Restoring the application after storage failure

**Outcome and decision:** Choose a recovery source and point, restore in isolation, verify the service and plan treatment of useful work after that point.

**Owned sections:** “Define the restore set and objectives” → FS-U39; “Triage, restore, reconcile and cut over” → FS-U42.

**Entry:** Local definitions of backup, recovery point and recovery time make this a direct incident-planning entrance. **Form:** Recoverability checklist and a complete incident rehearsal. **Changed case:** Restoring pre-`g18` fixes the manifest but loses valid database writes made afterwards; the first restore attempt lacks an encryption key or required metadata. Include a measurable verification/cutover condition and alternative source.

**Boundary:** Backup configuration and restore are kept together because only the latter proves the former useful. Migration has a separate live-change decision in G18. Corruption triage links G17 rather than assuming repair is the first step. The collection cannot guarantee a universal application reconciliation procedure; it must identify decisions and evidence needed from the owner.

### FS-G17 — Detecting damage and choosing repair or restore

**Outcome and decision:** Decide what an integrity check can detect, whether a good copy exists and whether to repair structures, recover files or restore the application.

**Owned sections:** “Which bytes are checked”, “Detection needs a reference” and “Repair needs a good copy” → FS-U40.

**Entry:** File contents versus filesystem structures, supplied with a diagram. **Form:** Corruption decision tree contrasting metadata checks, data checksums, scrubs and application checks. **Changed case:** A filesystem check succeeds while an image checksum fails; a redundant copy repairs a detected error; all retained copies contain the same bad application write.

**Boundary:** This owns the integrity argument across implementations. Actual XFS tools and their hazards are L04; OpenZFS supplies a bounded contrast rather than an uncommissioned operational deep dive. Treat device errors, malicious changes and logically wrong application data as different evidence, not one “corruption” symptom.

### FS-G18 — Moving a live file tree

**Outcome and decision:** Plan and verify a copy/cutover that preserves required contents, metadata and application boundaries.

**Owned sections:** “Choose the copy unit”, “Capture changes during the copy” and “Verify before switching owners” → FS-U41.

**Entry:** Names/objects and required recovery metadata, briefly defined. **Form:** Native rehearsal preserving selected ACLs/xattrs/links/sparse files, plus a changing-generation timeline. **Changed case:** The copy follows a symlink unexpectedly, materialises sparse holes or misses changes between passes; ownership changes at cutover and a former writer resumes.

**Boundary:** Migration earns a page because live change capture and cutover are a different task from restoring a stopped service. Copy-tool flags are pinned examples, not a catalogue. Application-specific database files must use a supported application protocol rather than assume that a live recursive copy is valid.

## Choosing an implementation

### FS-C01 — Choosing ext4, XFS or OpenZFS for a Linux service

**Outcome and decision:** Defend a choice for a specified workload and support environment, including its recovery and migration cost.

**Owned sections:** “A simple service volume”, “Shared extents and growth”, “Integrity and recoverable copies” and “Supported operations and exit costs” → FS-U56.

**Entry:** Short local explanations of extent allocation, journalling/COW and integrity; optional links give depth. **Form:** Three workload cases and a compact matrix with conditions. **Changed case:** A modest single volume becomes a clone-heavy workload, silent-corruption detection becomes mandatory, or a resize/migration must work on the organisation's supported kernel. A feature in upstream master cannot satisfy a distribution support requirement.

**Boundary:** Compare these credible implementations at their native layer. Ext4/XFS plus separate volume snapshots is not identical to an integrated ZFS pool. Do not rank products by feature count or compress another full implementation branch into this page. NFS/SMB, local/network blocks and filesystem choice are different axes; G01/G08 own those choices.

## The Linux implementation branch

### FS-L01 — XFS allocation, extents and reflink copies

**Outcome and decision:** Explain observed XFS space/allocation behaviour and decide whether cloning or a real independent copy fits the job.

**Owned sections:** “Geometry, allocation groups and delayed allocation” → FS-U43; “Shared extents and copy-on-write” → FS-U45.

**Entry:** Logical size versus allocated space, introduced locally. **Form:** Native `xfs_info`/extent/space observations and a bounded extent model. **Changed case:** A cheap clone is heavily overwritten, increasing space and write work; allocation is deferred; metadata integrity protection does not imply user-data checksumming.

**Boundary:** Keep extent allocation and reflink together because sharing changes the same map and its space costs. B-tree node formats and allocator implementation are external. Log persistence has its own timeline in L02; general COW/snapshot and integrity arguments remain G05/G15/G17.

### FS-L02 — The XFS write path and metadata log

**Outcome and decision:** Explain which work fsync and metadata pressure wait for, and connect symptoms to the XFS log rather than treating every stall as data bandwidth exhaustion.

**Owned sections:** “Metadata transactions and delayed logging”, “A synchronisation point” and “Log pressure and replay” → FS-U44.

**Entry:** Short local recall of data/metadata and durability; neither kernel development nor the entire general route. **Form:** Source-backed write-path model and a native metadata-versus-data workload observation. **Changed case:** Many small directory operations replace large writes; synchronous boundaries interrupt batching; the machine fails before unforced metadata is durable.

**Boundary:** This needs an article-sized investigation, not a product-summary section. Stop at explaining operational consequences of reservations, log forces and replay; do not derive every internal transaction algorithm. L04 owns repair execution and G04 the application protocol.

### FS-L03 — Creating, governing and resizing XFS

**Outcome and decision:** Prepare an XFS volume, set project capacity policy and execute a supported resize with a verified fallback.

**Owned sections:** “Feature flags and compatibility”, “Project quotas” and “Resize eligibility and execution” → FS-U46.

**Entry:** An identified block device; G09 supplies the general change plan. **Form:** Disposable VM worksheet with explicit device identity, tool/kernel versions and cleanup. **Changed case:** A clone must mount on an older host; quota stops one workload while the filesystem has free bytes; a requested shrink is outside supported geometry or distribution policy.

**Boundary:** Keep lifecycle and quota policy together because they govern the usable volume. Full LVM mapping belongs in L05; L03 receives a correctly sized device. Do not teach the obsolete blanket rule that XFS cannot shrink: current upstream documentation has limited last-allocation-group shrinking. Exactly what is usable must be checked against the pinned stack and supported procedures.

### FS-L04 — XFS health, log recovery and repair

**Outcome and decision:** Classify an XFS incident and choose supported replay/check/repair or restore without confusing recovered metadata with verified application data.

**Owned sections:** “Health evidence”, “A dirty log is not repaired by a generic check” and “Repair limits and restore” → FS-U47.

**Entry:** Local explanation of log replay, metadata and known-good copies. **Form:** Saved disposable filesystem images and diagnostic cases; actual repair practice only on copies. **Changed case:** An unclean shutdown, an unreadable underlying device and a metadata-corrupt image produce different next actions. A repair that completes still leaves an application content check failing.

**Boundary:** Version-gate online scrub/repair features and vendor support. Dirty-log handling and destructive log-zeroing risk receive explicit treatment from current manuals. This cannot be a one-command repair recipe. G17 owns the general integrity argument, and forensic reconstruction is external.

### FS-L05 — Building and changing LVM mappings

**Outcome and decision:** Inventory PV/VG/LV ownership, execute an ordered mapping change and know when to copy/migrate instead of shrinking an underlying layer.

**Owned sections:** “Trace physical to logical allocation”, “Grow in order” and “Migrate or remove with headroom” → FS-U48.

**Entry:** G09's layer model, restated in one small diagram. **Form:** Disposable two-device worksheet with stable IDs, before/after mappings and verification. **Changed case:** The LV grows but the filesystem does not; a PV is to be removed while allocated extents remain; an operator mistakes a similarly sized device for the target.

**Boundary:** Mapping is substantial practical work and belongs apart from XFS internals and thin-pool accounting. It receives an ordinary thick LV first. Boot/root-volume rescue and every possible device-mapper target are outside scope.

### FS-L06 — LVM thin pools and snapshots under load

**Outcome and decision:** Budget and monitor thin data/metadata space, take the intended snapshot and respond to pool pressure before the filesystems lose write service.

**Owned sections:** “Logical volumes share a physical pool”, “Snapshot/discard accounting” and “Data and metadata exhaustion” → FS-U49.

**Entry:** PV/VG/LV basics and snapshot point-in-time meaning, each briefly recalled. **Form:** Deliberately small disposable thin pool, counters and failure model. **Changed case:** Snapshots retain blocks after file deletion; data or metadata fills; the monitoring service or auto-extension reserve is unavailable. Compare queue/error behaviour as configuration, not a universal timeout guarantee.

**Boundary:** This earns its own investigation because thin-pool failure can invalidate the guest's space model and cause write errors. G12 owns the general budget; G15 consistency; L06 owns actual commands/defaults/limits. Snapshot merging and crash recovery are included only where needed for the supported rehearsal, not as a complete LVM target manual.

### FS-L07 — Encrypted Linux volumes and key recovery

**Outcome and decision:** Place LUKS/dm-crypt in the stack, retain the material needed to unlock a restored copy and explain the consequences of discard and key retirement.

**Owned sections:** “Where the mapping sits”, “Unlock and header recovery” and “Copies, discard and key lifecycle” → FS-U50.

**Entry:** G07's distinction between authorisation and encryption, explained locally; identified disposable devices. **Form:** Native create/unlock/restore-to-copy worksheet, with secret handling and cleanup appropriate to the exercise. **Changed case:** The restored volume is intact but the unlock dependency is missing; a clone and old header preserve access after the presumed retirement action.

**Boundary:** Key recoverability deserves its own page rather than a paragraph beside LV growth. This is bounded operator practice, not cryptographic design or organisation-wide key-service setup. Provider-managed encryption stays explicitly a different contract in E01/E02.

## Hosted block storage

### FS-E01 — EBS volumes, performance and ownership

**Outcome and decision:** Choose/provision an EBS volume for the workload, locate volume-versus-instance limits and operate its attachment/lifecycle safely.

**Owned sections:** “Volume and instance performance contracts” → FS-U51; “Identity, availability zone and exclusive ownership” → FS-U52.

**Entry:** Requests/throughput and a mounted filesystem, locally introduced. **Form:** Provider contract/cost/metric worksheet and attachment failure trace. **Changed case:** Increasing volume IOPS leaves the instance limit unchanged; an instance is replaced with different termination settings; two hosts try to write XFS using Multi-Attach.

**Boundary:** Keep performance and ownership together as the volume's provider contract. General request-rate arithmetic is G13, not repeated as a cloud feature catalogue. Multi-Attach requires an appropriate clustered design/fencing and does not authorise concurrent XFS use. Guest filesystem recovery is L04; snapshot/restore is E02. Region/type/instance support, quotas and prices must be verified at authoring.

### FS-E02 — EBS snapshots and restored-volume readiness

**Outcome and decision:** Capture a specified application boundary, restore to new EBS volumes and verify the recovered service's contents and performance before cutover.

**Owned sections:** “Capture single and multiple volumes”, “Create and prepare restored volumes” and “Verify, cut over and clean up” → FS-U53.

**Entry:** A local reminder distinguishes application-consistent capture from a provider block snapshot. **Form:** Real-account worksheet with explicit resource inventory, cost and exact-ID cleanup; a model can preview the states without claiming to run AWS. **Changed case:** A snapshot excludes application/OS cached data; multi-volume capture is crash-consistent without the application protocol; initial reads from a restored volume change readiness/performance requirements.

**Boundary:** Recovery earns a separate article because asynchronous service state, initialisation, keys and application validation would bury the attachment/performance argument in E01. G15 owns general capture semantics and G16 the recovery/reconciliation plan. Cross-account/key permissions and independent-copy choices are taught only to the level required by this restore path and must be checked against primary provider documentation.

## Network filesystems

### FS-N01 — A Linux NFSv4.1 share and its access boundary

**Outcome and decision:** Establish a real two-client share with intentional identity, export and transport/authentication policy, and know which assumptions the environment makes.

**Owned sections:** “Client/server/export contract”, “Identity and root mapping” and “Authentication and transport protection” → FS-U54.

**Entry:** Files, a server and access policy, introduced locally. **Form:** Disposable server/two-client worksheet with pinned versions and observable permitted/denied operations. **Changed case:** A user has different numeric identity across hosts; root squashing appears to prevent one operation but does not authenticate clients; a trusted-lab export is mistakenly proposed for an untrusted network.

**Boundary:** Setup and identity are one access argument. Coherence and outage observation are N02. The worksheet may use a bounded trusted lab without pretending to implement production Kerberos/identity infrastructure; it must explain what additional authentication/protection the production contract needs. SMB/Windows setup and managed NAS service administration are explicit future branches, not covered by this worksheet.

### FS-N02 — NFS client state, outages and diagnosis

**Outcome and decision:** Predict and observe changed visibility, lock and outage behaviour across two clients, and choose the next observation or mount-policy change deliberately.

**Owned sections:** “Observe cache and lock behaviour”, “Interrupt the server and recover state” and “Separate client/network/server/storage pressure” → FS-U55.

**Entry:** An NFS mount and the minimum local cache/lease model; N01 supplies an executable setup. **Form:** Real two-client exercises with saved client/mount/server settings and per-layer counters. **Changed case:** One client retains a file while the other changes it; the server restarts while locks are held; hard requests stall and a proposed soft timeout changes correctness risk; small metadata requests dominate rather than bulk transfer.

**Boundary:** Keep the failure and diagnostic observations together because a retransmission or stall cannot explain its own cause. G08 owns general shared-file/fencing choices; G13 general workload diagnosis. Advanced pNFS layouts, HA-server clustering and protocol implementation are external. Protocol version and mount defaults must be named; do not turn an NFSv3 coherence explanation into an unverified NFSv4.1 claim.

## Coverage audit and boundary statuses

The owned-section statements above are the unit-to-section map. In compact form: U01–03 → G01; U04–06 → G02; U07–08 → G03; U09/U10/U12/U14 → G04; U13 → G05; U11/U15–17 → G06; U18–20 → G07; U21–24 → G08; U25–26 → G09; U28 → G10; U27 → G11; U29–31 → G12; U32–34 → G13; U35–36 → G14; U37–38 → G15; U39/U42 → G16; U40 → G17; U41 → G18; U56 → C01; U43/U45 → L01; U44 → L02; U46 → L03; U47 → L04; U48 → L05; U49 → L06; U50 → L07; U51–52 → E01; U53 → E02; U54 → N01; U55 → N02. All identifiers here carry the `FS-` prefix when written in full.

| Boundary | Status and local obligation |
| --- | --- |
| Relational/application recovery internals | External teaching home, provisional until field coordination. G15/G16 must still show the checkpoint/log/consistency dependency and later valid work. |
| Object-storage API and lifecycle | External family. G01/G08 teach enough interface contrast for a file/block decision without re-teaching object APIs. |
| General distributed systems | Parked. G08/N02 teach the cache, lease, retry and fencing mechanisms their own decisions require. |
| Filesystem/firmware implementation, NVMe programming | External reference. G05/G10/L01/L02 stop at what explains operational behaviour and choices. |
| Full ZFS, ext4, Windows/SMB, Ceph and managed-NAS operation | Not in the initial implementation branch. C01 and G08 provide meaningful conditions and links; they do not confer operator expertise in those stacks. |
| SAN multipath, cluster filesystem deployment, Kubernetes CSI | External. G01/G09 retain local attachment/mount/ownership context; G08 explains why cluster coordination/fencing matters. |
| Forensic recovery and security certification | External professional work. G16/G17 preserve evidence and identify when the plan needs it. |
| Publication and site navigation | Unchanged. This is a proposal; no new routes or available-reading claims. |

## Evidence, uncertainties and review questions

The primary sources recorded in `files-abilities.md` were fetched during this derivation. Their role is to challenge scope, not to pre-approve article facts. Additional checks below affected the plan. Authoring must pin versions/defaults and record executed observations separately from diagrams and documented behaviour.

- [Current upstream XFS grow manual](https://man7.org/linux/man-pages/man8/xfs_growfs.8.html) documents limited last-allocation-group shrinking. This changes L03 and C01: no blanket no-shrink claim, and no assumption that upstream support is distribution support. Exact supported resize recipes remain unresolved until the stack is chosen.
- [XFS logging design](https://docs.kernel.org/filesystems/xfs/xfs-delayed-logging-design.html) distinguishes asynchronous metadata work from forced persistence. This justifies L02 as a separate investigation, but old design narrative/defaults inside the document need current code/version corroboration before tuning guidance.
- [XFS repair manual](https://man7.org/linux/man-pages/man8/xfs_repair.8.html) distinguishes dirty-log handling from repair and documents destructive log-zeroing risk. L04 must teach classification and preservation, rather than a generic filesystem-check command.
- [LVM thin manual](https://man7.org/linux/man-pages/man7/lvmthin.7.html) distinguishes data and metadata exhaustion and configurable queue/error handling. L06 therefore requires its own failure case. The exact tested timeout/default belongs to pinned practice, not general prose.
- [OpenZFS concepts](https://openzfs.github.io/openzfs-docs/man/master/7/zfsconcepts.7.html) and [scrub](https://openzfs.github.io/openzfs-docs/man/master/8/zpool-scrub.8.html) make integrated pool/checksum/repair behaviour a credible choice contrast; compare a stable supported release before commissioning C01.
- [Microsoft file caching](https://learn.microsoft.com/en-us/windows/win32/fileio/file-caching) confirms that buffering/write-through/flush choices require a platform contract. It does not establish the full SMB/Windows semantics needed for G02/G08; that remains specific primary research for those articles.
- [Linux NFS manual](https://man7.org/linux/man-pages/man5/nfs.5.html) is a useful implementation source, but its sections distinguish protocol versions. N01/N02 require NFSv4.1 protocol/server documentation as well as the chosen Linux client; they must verify server restart/lock recovery rather than paraphrase the NFSv3 CTO example.
- [EBS snapshot creation](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html) excludes application/OS cached data, [Multi-Attach](https://docs.aws.amazon.com/en_en/ebs/latest/userguide/ebs-volumes-multi.html) warns about ordinary XFS/ext4 concurrent access, and [I/O characteristics](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-io-characteristics.html) distinguishes provider I/O accounting. E01/E02 must preserve these provider boundaries and recheck restored-volume initialisation, snapshot/key access and cost evidence before practice.

The major scope decision is the Linux XFS/LVM/EBS/NFS operational path. It serves Linux service operators coherently, but does not produce a Windows/NAS specialist or a ZFS administrator. If the intended audience instead centres on developer laptops, Windows file servers or a storage appliance, the implementation branch must change; adding product-summary paragraphs would not fix that mismatch.

The main page-cost pressure is G06, where locks, append and multi-file generation protocols share one application-invariant argument, and G07, where path confinement, identity and encryption share one access-boundary argument. Both deliberately avoid complete API/configuration surveys. Reviewers should test whether the changed cases still fit one running model. If a split is needed, it should preserve the full recovery/reclamation or key-retention consequence rather than delete it.

Independent challenge should ask: can a direct restore entrant reconstruct an application-consistent service; can a local-volume operator avoid treating Multi-Attach as shared-file safety; can a reader distinguish clean filesystem structures from correct content; and do the Linux investigations let them execute, diagnose and recover the mechanisms rather than merely name them? These questions are for the commissioning coordinator's independent reviewers; no further agents were launched here.
