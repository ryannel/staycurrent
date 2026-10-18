# Filesystems and block storage: proposed coverage map

18 October 2026. Proposal for discussion within the [field plan](../databases-and-storage-plan.md),
before independent planning review or writing. Use the [shared map conventions](databases-and-storage.md#map-conventions).

An expert user chooses the interface and failure boundary an application needs,
reasons about visibility and persistence, sizes the I/O path, and restores data
without assuming a copied volume is an application-consistent backup. This
collection covers using storage beneath and beside a database, not implementing
a filesystem or storage device.

Running example: the shop edits `manuals/P7.pdf`, atomically publishes a generated
catalogue file, and runs its database on a volume. File identity/path, an open file
handle and a disk block are deliberately distinct. Base for new pages:
`/learn/databases/files-and-volumes/`.

| ID | Proposed page and role | Owned sections and reader outcome | Teaching form | Entry needs; onward homes | Existing material / destination |
| --- | --- | --- | --- | --- | --- |
| B01 | Files, objects and volumes — introduction | File/directory operations; byte ranges; file metadata; block address space beneath a filesystem; local/shared/remote access; object interface contrast; choose from required operations. | Edit one part of P7.pdf, rename a generated file, place a database on a volume. | No filesystem internals. B02/B04/B05/B09. | New entrance; existing field guide's filesystem/block paragraphs supply orientation only. |
| B02 | File writes, visibility and persistence — deep dive | Buffered writes/page cache; file size and partial writes; close against flush; file/directory sync; atomic rename scope; crash-safe replacement; ordering and failure assumptions. Explain what survives a power loss. | Write-temp/sync/rename/directory-sync trace with crash points; actual OS/filesystem contract stated. | B01; R15 owns database WAL, B07 snapshot/recovery. | New `writes-and-durability/`. |
| B03 | Sharing files and concurrent changes — deep dive | Path against open identity; concurrent overwrite/append; advisory/mandatory lock scope; rename/readers; local process sharing; mmap/coherency caveats; permissions and races. Choose coordination the interface actually supplies. | Two writers and an open reader during replacement; reproduce on a named OS/filesystem. | B02; B04 network changes, R32 embedded database implications. | New `concurrent-access/`. |
| B04 | Network and shared filesystems — deep dive | NFS/SMB client/server model; caching and close/open visibility; locking/leases and failures; metadata latency; mount/reconnect behaviour; managed file-service boundaries; database suitability checks. Predict the effect of a delayed or failed server. | Same file operation locally and across two clients; inspect specified guarantees and measured behaviour. | B01/B03; general distributed-systems curriculum stays parked. | New `shared-filesystems/`. |
| B05 | Storage devices, volumes and failure domains — deep dive | Blocks/pages and request sizes; sequential/random work; HDD/SSD/NVMe distinctions; local/remote persistent/ephemeral volumes; queues; RAID/mirroring/parity and erasure coding in decision-level outline; flush and power-loss protection. Map accepted I/O to the failure it survives. | Trace database page/log requests through OS, controller and volume service; two devices share a hidden failure domain. | B01; R15 flush requirement, B06 performance and B07 recovery. | New `devices-and-volumes/`. |
| B06 | Measuring storage performance — practical guide | IOPS/throughput/latency relationship; queue depth; request size and mix; tail latency; cache/burst credits; sustained/maintenance load; workload-safe measurement; end-to-end bottleneck. Choose capacity from representative work. | Compare sync log writes and page reads; show a fast cache run against a sustained cold run. | B05; F07 owns whole-system evaluation, R17 database diagnosis. | New `performance/`. |
| B07 | Snapshots, corruption and recovery — practical guide | Crash/application consistency; multi-volume coordination; copy-on-write snapshots; replication/mirrors against backup; checksums/scrubbing and repair; independent copies; restore/mount validation; lost-key and volume failures. Prove recovery at the application's boundary. | Snapshot during a database change, restore, replay and validate later application state. | B02/B05; R23 database backup chains, F08 recovery authority. | New `snapshots-and-recovery/`. |
| B08 | Capacity, access and operating filesystems — practical guide | Space/inodes/metadata; fragmentation and write amplification; quotas and tenants; permissions/ACLs; encryption/key rotation; discard/TRIM and growth; full-volume behaviour; upgrades and migration. Keep capacity and authority usable over time. | Bytes remain free but file creation fails; tenant exceeds quota; encrypted backup restored with the correct keys. | B01; F08 policy, F06 migration, B09 implementation choices. | New `operations/`. |
| B09 | Choosing a file or volume arrangement — comparison | Local ext4/XFS/ZFS or platform equivalents; shared NFS/SMB/managed files; local versus network block; object storage as an alternative interface; latency, concurrency, growth, repair and operator responsibility. Choose an arrangement from an application's required operations. | Embedded database, shared recording editor and hosted transactional database contrasted with current platform evidence. | B01/F02; F07/B06 evaluation. | New `choosing/`. |

Linux/POSIX is an initial concrete file-semantics example, not a universal promise
for Windows, macOS, a network mount or an object-backed adapter. Compare differences
where they change the operation or its durability. Product command catalogues and
full ZFS/Ceph internals remain reference material unless a later bounded question
requires more depth. Browser models can show ordering; they cannot verify power-loss
behaviour or a cloud volume's persistence contract.
