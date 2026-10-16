---
layout: ../../../../layouts/ObjectArticle.astro
title: Versions, retention and recovery
description: Recover an overwritten or hidden object, distinguish retained bytes from a usable application, and understand how lifecycle, Object Lock and replication change the outcome.
lesson: versions
---
A durable object can still be the wrong object. An authorised application may overwrite a report with an empty file or delete a photograph that a database still references. Durability protects stored data against certain infrastructure failures; recovery also needs an earlier usable state and a way to select it.

S3 versioning can retain earlier object versions. Retention rules determine how long those versions remain, and permissions determine whether they can be removed. We will follow a mistaken change through recovery, then ask what replication adds and what it leaves to the application.

## A key can have a history

In a versioning-enabled bucket, two successful writes to `report.csv` create distinct stored versions. An ordinary GET selects the current version. A GET with a particular version ID can select an earlier one, provided it still exists and the caller has permission.

Suppose version v1 is a valid report and v2 is an accidental empty replacement. Fetching v1 lets an operator inspect the earlier bytes. One recovery approach copies that verified version back to the key, creating a new current version v3 containing the good data. Keeping v2 in history may help investigate the incident; removing it is a separate decision. The [versioning guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) describes the retained history.

For this simple recovery, pause the normal writer while inspecting and copying. Otherwise a valid new report could arrive after inspection and be displaced by the recovery copy. An application that must keep accepting changes needs recovery to participate in its normal conditional publication protocol. Copying old bytes alone does not settle which result should be current.

The labels v1, v2 and v3 are shorthand for this example. Do not confuse an S3 version ID with an application's revision name. Both can identify a version, but they are allocated by different systems. A recovery record should retain the exact bucket, key and service version needed to reproduce the read.

## Deleting can hide rather than remove

With versioning enabled, a DELETE without a version ID normally adds a delete marker. A subsequent ordinary GET returns not found, even though earlier data versions remain. The marker changes the current view; it is not an empty replacement file.

Return to the state before our recovery copy: v2 is current and v1 is beneath it. Deleting that key now produces this history:

<figure class="object-figure"><div class="flow"><div><strong>Newest: delete marker d3</strong><span>Ordinary GET → not found<br>No object body here</span></div><div><strong>Earlier: version v2</strong><span>Empty accidental report<br>Still a stored data version</span></div><div><strong>Oldest: version v1</strong><span>Verified complete report<br>Version-specific GET can read it</span></div></div><figcaption>Removing d3 exposes v2, not necessarily the desired v1. Recovery must identify the good version, not merely make the key visible again.</figcaption></figure>

Deleting the current marker by its version ID exposes the preceding version. Deleting the key again without a version ID adds another marker instead. Deleting a specific data version permanently removes that version, unless a retention control blocks the operation. [Delete markers](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html) and [marker removal](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManagingDelMarkers.html) have distinct request semantics.

The [version lesson](/learn/databases/object-storage/sandbox/?lesson=versions) lets you inspect this stack. Recover visibility, then deliberately delete a data version and see why removing a marker cannot recover bytes that no longer exist. It models these stack operations, not service retention enforcement or replication.

## Lifecycle sets the recovery window

Retaining every revision forever can become expensive. Lifecycle rules can expire current objects, transition eligible storage classes or permanently remove noncurrent versions. Those actions have different consequences. In a versioned bucket, expiring the current object can add a marker while leaving data versions behind; noncurrent-version expiration removes recovery candidates.

Imagine discovering the empty report after the good version has been permanently expired. Versioning was enabled, but the needed history is gone. A policy must preserve versions for the time in which mistakes are likely to be detected and investigated, not merely for the time between daily uploads.

Lifecycle eligibility is not an exact execution schedule. Existing old objects can become eligible when a rule is added, and the service performs actions asynchronously. A bucket-policy deny does not block lifecycle's expiration and transition actions. Review the rule itself, including noncurrent versions, before relying on an ordinary delete restriction. The [expiration guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html) explains these cases.

An application manifest adds another constraint. A version old enough for an age-based rule may still be needed by a supported reader. Lifecycle does not inspect your database references or reader pins. Align its scope and ages with the application's retention protocol.

## Object Lock protects stored versions

Object Lock can prevent a protected version from being permanently removed during its retention period or legal hold. Governance and compliance modes have different bypass rules; compliance retention cannot be shortened by an account user, while governance has an explicit privileged bypass mechanism. Legal holds are separately controlled. The [Object Lock guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) describes these mechanisms, including newer retention options.

A lock protects a version, not the ordinary key's current appearance. Another version or delete marker can sit above the protected bytes. An application can therefore fail to read the current key while the protected earlier version remains recoverable. The version stack is essential to interpreting this result.

Protection also does not guarantee a usable decrypting key or read permission. Test recovery with the role and keys that will exist during an incident. Object Lock has lasting bucket-level consequences, so the introductory practice worksheet uses ordinary versioning rather than enabling a retention configuration as an incidental experiment. [Operational considerations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html) explain those consequences.

## Replication is another copy with its own progress

S3 replication copies eligible objects asynchronously to another bucket. A successful source write does not prove that the destination already has the required version. Existing objects and failed replications may need Batch Replication rather than waiting for a live rule to revisit them. See the [replication overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html).

Deletion behaviour depends on the rule and operation. Suppose the destination already holds the report's data versions. With a current V2 replication rule, identified by its `Filter` element, the following source actions have different results:

| Source action and configuration | Destination consequence |
| --- | --- |
| DELETE without a version ID; marker replication left disabled | Source GET is hidden by a marker; destination GET can still return its current data version. |
| Same DELETE; marker replication enabled on an eligible non-tag-based rule | The marker is replicated asynchronously and then hides the destination's current data view. |
| DELETE specifying a data version ID | That permanent deletion is not replicated; the corresponding destination version remains. |
| Lifecycle expiration creates a delete marker | That marker is not replicated, even with marker replication enabled. |

The [replication scope guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html) also describes older V1 rules, whose default marker behaviour differs. Inspect the actual rule before an incident. A replica can preserve recovery history while giving a different ordinary GET result from the source; that difference needs to be part of the recovery procedure.

For a dataset, the manifest may arrive before every referenced object. Failover must verify the required generation at the destination, not just observe that `current.json` exists. It may choose an older complete generation while a newer one is incomplete, provided that loss of freshness is acceptable to the application.

SSE-KMS replication needs suitable configuration and key permissions. Acceptance of a replication configuration is not a successful test of the resulting copies: the KMS guide documents configurations that can be accepted even when the supplied key prevents replication. Inspect [replication status](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-status.html), retrieve the destination bytes and test the recovery role. The [encrypted-object replication guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-config-for-kms-objects.html) explains the extra dependency.

## Recover the application, too

A drill should begin with a concrete failure: the current report is wrong, one generation file is missing, or a Region is unavailable. Identify the last acceptable complete dataset, restore or select its exact versions, and verify that the application's references point to those bytes. Reading one restored object does not establish that the whole export is usable.

Record what later valid work is excluded by the chosen recovery point. If a product's new photo was uploaded after the restored database backup, the recovered database may not reference it. Reconciliation must decide whether to reattach it or retain it as unused work. Conversely, a database reference can survive while the corresponding object history was expired.

Measure recovery using the actual data volume, permissions and access tier. An archived version may require an asynchronous restore before GET can read it. The [cost and storage-class article](/learn/databases/object-storage/performance-and-cost/) explains why a cheap retained copy can still be a poor immediate-recovery copy.
