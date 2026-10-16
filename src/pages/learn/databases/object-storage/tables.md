---
layout: ../../../../layouts/ObjectArticle.astro
title: Tables on object storage
description: Follow an Iceberg snapshot from catalog metadata to data files, then see what S3 Tables manages and what a query engine still has to do.
lesson: table-commit
---
Parquet stores tabular data in columnar files. A directory of those files is not yet a table with a dependable history. A query engine needs to know which files belong to the current table, how their columns are interpreted and which changes became committed together. A table format supplies that shared structure over object storage.

Apache Iceberg is one such format. Amazon S3 Tables manages Iceberg tables in a specialised table bucket and performs maintenance on their files and snapshots. The query engine remains a separate participant: it interprets table metadata and reads the required data to answer SQL.

## From files to a snapshot

Suppose two data files, F1 and F2, contain yesterday's purchases. A writer produces F3 containing today's purchases. If a reader discovers data by listing a prefix, it may see F3 before the writer has finished the rest of its work. It also cannot tell whether a replacement file should be read alongside an older file or instead of it.

An Iceberg snapshot identifies a particular table state. In the V2/V3 model used here, table metadata identifies snapshots; a snapshot's manifest list identifies manifests; manifests describe data files and associated information such as statistics. A catalog identifies the current table metadata. The reader follows these references instead of guessing from all files present in storage. Our example only appends rows. A table with row deletions also needs the format's deletion information, which the engine applies when determining the visible rows.

<figure class="object-figure">
  <ol>
    <li><strong>Catalog:</strong> locates the current table metadata file, here <code>metadata-B.json</code>.</li>
    <li><strong>Table metadata file:</strong> contains the schema, snapshot records and the ID of the current snapshot, B.</li>
    <li><strong>Snapshot B record, inside that metadata:</strong> names its manifest-list file.</li>
    <li><strong>Manifest-list file:</strong> names the manifests used by B and describes them for planning.</li>
    <li><strong>Manifest files:</strong> list the data-file paths and their statistics.</li>
    <li><strong>Data files F1, F2 and F3:</strong> contain the rows selected by B.</li>
  </ol>
  <figcaption>Follow the references from top to bottom. Uploading F3 alone leaves the catalog pointing to A’s metadata and its F1/F2 file set. A committed metadata change makes B discoverable.</figcaption>
</figure>

A reader that selected snapshot A can continue using its file set while a writer publishes B, subject to retention preserving the files it needs. The [Iceberg specification](https://iceberg.apache.org/spec/) defines these metadata relationships. Our F1/F2/F3 example is an invented explanation of them, not an observed S3 query trace.

## Committing a new table state

A writer reads the current metadata and prepares new data and metadata files. It then asks the catalog to replace the current metadata reference only if its starting state is still valid. The new files exist before this commit, but readers following the previous snapshot do not automatically include them.

S3 Tables exposes a metadata-location update with a version token. A conflicting update can reject a writer whose token is no longer current. The [metadata-location API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_s3Buckets_UpdateTableMetadataLocation.html) supplies that concrete boundary; table clients should use their supported catalog integration rather than invent their own commit format.

Consider a writer adding F3 while maintenance compacts F1 and F2 into F12. Both began from A. Maintenance commits first. The writer's old token must not simply replace the compacted state with its stale metadata. It reloads the new table state and validates whether its operation can be retried. An independent append may be able to reuse F3 and build metadata containing F12 and F3. A rewrite based on rows in F1/F2 must validate that its inputs and assumptions still hold before it can commit.

| Stage | Files selected by current metadata | Prepared but unpublished work |
| --- | --- | --- |
| Both jobs start from A | F1, F2 | Writer prepares F3; maintenance prepares F12 |
| Maintenance commits C | F12 | F3 |
| Writer reloads C and commits D | F12, F3 | None from these jobs |

F12 contains the same rows as F1 and F2 in this example. Reading all three would count those purchases twice. A reader already using A still follows F1/F2; keeping those files for that reader is a separate retention decision. Replacing the current table pointer does not require deleting its previous files immediately.

This is why “retry the commit” is not equivalent to sending the same stale decision until accepted. The client must preserve the logical operation under the new state. Iceberg's [reliability explanation](https://iceberg.apache.org/docs/latest/reliability/) develops optimistic concurrency and retry validation.

## Metadata can avoid data reads

A table format also gives the engine useful information before it opens every file. If a query asks for purchases from October and a file's partition information or column bounds exclude October, the planner may skip that file. Within the selected files, a columnar format can reduce the fields read.

For a separate layout example, let one file contain September purchases and another October purchases. A query constrained to October can skip the September file if trustworthy metadata proves it cannot match. An unfiltered scan still includes both. Statistics and layout reduce work only when the query can use them; storing files in S3 does not itself make arbitrary SQL selective.

Schema and partition evolution also live above ordinary object PUT/GET. Iceberg tracks column identities and layout metadata so a table can evolve without treating every old file as though it were written under today's exact arrangement. The [Iceberg evolution guide](https://iceberg.apache.org/docs/latest/evolution/) explains those rules. A query engine must support the relevant format features to interpret the table correctly.

## What S3 Tables manages

A table bucket contains table resources, not merely an ordinary prefix labelled “table.” S3 Tables uses its own resource and permission namespace. Supported engines can connect through its Iceberg REST interface or an AWS catalog integration. The [access guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-access.html) explains the routes; [the REST integration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integrating-open-source.html) identifies the catalog endpoint and signing context.

Managed compaction combines small files and incorporates deletes, improving the layout later readers encounter. Snapshot management limits retained history. Unreferenced-file removal cleans up files no longer needed by the table. These jobs reduce operational work, but they still act on policies that affect readers, writers and recovery.

A snapshot expiring and a physical file disappearing are different events. A file shared by retained snapshots can remain necessary. Conversely, an uncommitted file left around too long can become eligible for cleanup before a delayed writer commits metadata referring to it. The [maintenance considerations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-considerations.html) explicitly discuss maintenance conflicts and delayed commits. The unreferenced-file age threshold must exceed the longest supported write-to-commit interval, including retries.

In a different run, suppose the threshold is three days and a stalled job tries to commit a four-day-old F3. If cleanup has already marked F3 noncurrent, publishing its path does not make it readable again: a query selecting it can fail. Here, noncurrent is a stage in S3 Tables’ managed cleanup. It is not the ordinary version history from which this application can issue a version-specific GET. AWS says viewing or recovering a file in this stage requires contacting Support; after permanent deletion it cannot be recovered. The [table-bucket maintenance guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html) describes that boundary.

The job must establish that its prepared data is still usable before committing. Increasing the threshold can protect future slow commits, but does not restore an already inaccessible file. Track delayed writes as well as maintenance failures.

This also changes how external consumers should access files. A client that bypasses the table and pins a raw data-file path has created a reference the table's cleanup may not know about. Use the table's snapshot and retention mechanisms rather than assume a copied filename grants indefinite lifetime. [Table maintenance](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-maintenance.html) and [bucket maintenance](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html) separate these responsibilities.

## Choose the format and engine together

S3 Tables supports Iceberg V3 features, but service support does not imply that every engine can read them. The current AWS V3 guidance lists engine-specific limitations, including Athena's inability to read V3 tables as checked on 16 October 2026. A format upgrade can therefore make an existing reader unusable even though storage accepts the table. Review [V3 compatibility](https://docs.aws.amazon.com/AmazonS3/latest/userguide/working-with-apache-iceberg-v3.html) before changing a shared table.

For a stable workload, record the table format version and every required engine's supported operations. Test representative reads, writes, deletes and schema changes together. A successful SELECT from one engine is not evidence that another can safely commit its intended update.

## When this is the useful abstraction

Choose ordinary objects when the application needs named assets or a small explicit export protocol. Choose a table format when analytical readers and writers need shared schema, snapshots and file-selection rules. Managed S3 Tables can remove much of the maintenance work when its integrations and controls fit the workload.

A table on object storage is still not a substitute for every transactional application database. A checkout may need low-latency point updates, constraints and a transaction across related records. Evaluate those requirements directly instead of inferring them from the presence of SQL somewhere in the system.

The [table-commit lesson](/learn/databases/object-storage/sandbox/?lesson=table-commit) uses a simplified manifest and conditional pointer to expose the competing append and compaction decisions. It does not implement Iceberg or call S3 Tables. After maintenance wins, rebuild the append from its file set and inspect which files the reader selects. The lesson isolates that decision; the catalog integrations above supply the real format and engine behaviour.
