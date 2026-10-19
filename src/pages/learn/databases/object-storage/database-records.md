---
layout: ../../../../layouts/ObjectArticle.astro
title: Objects and database records
description: Keep an application's searchable records and stored bytes consistent through pending uploads, publication, retries and deletion.
lesson: lifecycle
---
A database row can name a photograph in object storage, but the database cannot enforce that reference like a foreign key to another table. The row and the object belong to separate systems. An upload may succeed while a database transaction fails, or a row may commit before the bytes arrive.

A reliable design makes unfinished work a state the application understands. It gives each upload an identity, publishes only validated bytes, and leaves enough durable information to resume or clean up after a crash. We will follow one profile photograph through that lifecycle.

<div id="define-what-ready-means" aria-hidden="true"></div>

## Pending and ready images

Our application has an `images` table with an image ID, owner ID, object key and state. It also records a source version or digest once validation completes. An `accounts` row points to the currently published image ID. The application serves only images marked ready and authorised for the requesting account.

For image i-83, ready means the complete bytes exist at the recorded immutable identity, passed the application's size and format checks, and may be delivered. It does not mean that a browser merely reported a successful upload. That report is useful input to verification, not proof of content or ownership.

Start by inserting i-83 with state pending and a server-chosen key under its owner's prefix. Commit that row before issuing an upload URL. If the process crashes now, the application can see an unfinished upload; it has not changed the account's published photograph.

## Upload, verify, publish

The browser uploads bytes to the assigned location. A worker verifies the object, then attempts to publish it. In one database transaction, the application can mark i-83 ready and replace the account's current image reference, subject to its ownership and concurrency checks. It records the exact delivery key, and version where applicable, chosen by validation in that same transaction.

The object has already been uploaded, so this transaction changes only database state. A database failure leaves pending or unreferenced bytes rather than a published reference to missing bytes. Existing readers continue to use the previous image.

<figure class="object-figure"><div class="flow"><div><strong>Pending i-83</strong><span>Database records owner and key<br>Account still points to i-82</span></div><div><strong>Validate stored bytes</strong><span>Complete upload<br>Check size, format and exact revision</span></div><div><strong>Publish i-83</strong><span>Database transaction marks ready<br>Account now points to i-83</span></div></div><figcaption>The S3 upload and database transaction remain separate. Explicit states make a failure between them recoverable.</figcaption></figure>

There is a subtle race if the uploader can overwrite the object after validation. The worker might approve version one while readers later receive version two at the same key. Prevent that by publishing an identity the uploader cannot change: for example, validate a specific version and have the server copy that version to a fresh protected delivery key, or use a version-specific reference throughout delivery. A reusable presigned URL is not a one-use token. The [private-upload article](/learn/databases/object-storage/access/) develops this boundary.

This is an application protocol, not an S3 transaction feature. Its database transition should be idempotent: repeated completion for the same upload must not accidentally replace a newer account choice. A compare-and-set on the expected account revision, or an explicit user-selected image operation ID, can establish which update is still eligible.

<div id="follow-the-failures" aria-hidden="true"></div>

## Recovering interrupted uploads

A pending row without bytes can expire after an agreed upload window. The cleanup worker first changes pending to abandoned in the database, but only if the row is still pending. The validation worker's ready transition has the same pending precondition, and its transaction also checks that the account update remains eligible. If cleanup wins, validation cannot revive the row. If publication wins, cleanup's transition fails and it must leave the ready object's bytes alone.

Marking the row abandoned does not stop an upload already in flight or revoke its presigned URL. A late upload can therefore leave more bytes to collect. Retain the abandoned record and repeat cleanup after upload authority and in-flight work have ended. The state transition prevents publication; the eventual storage cleanup reclaims the bytes.

Bytes without a published reference need a different check. They may belong to an upload whose database update failed, an older image still used by a reader, or a validation worker still running. A collector should not treat “not currently selected” as “safe to delete immediately.” Retain enough workflow state and time bounds to distinguish those cases.

If the ready transition commits but its response is lost, a retry reads the operation's durable state. It should return the already-completed result rather than create another image identity. If it finds that a newer account update won, it should report that outcome rather than blindly restoring i-83 as current.

| Observed state | Useful next action |
| --- | --- |
| Pending row, no completed object | Resume or expire the upload |
| Pending row, verified object | Retry the eligible database transition |
| Ready row, no account reference | Retain while needed, then collect under policy |
| Current account reference, missing object | Treat as an integrity incident; repair or restore |

The last case should be unusual if only the application controls deletion. It still deserves monitoring because administrative actions, policy changes or an incorrect cleanup job can violate the protocol.

<div id="deletion-needs-a-durable-obligation" aria-hidden="true"></div>

## Durable deletion jobs

Deleting an account reference and deleting its object are also separate operations. If the application commits the row deletion and then crashes before calling S3, it can leak the object indefinitely unless it recorded the work.

Instead, remove or retire the reference and insert a deletion job in the same database transaction. When retention permits deletion, a worker must also prevent new references from appearing after its check. One design marks the image deleting in a transaction that checks its remaining references; every operation that attaches an image must coordinate on that record and reject deleting images. The worker can then call the object API and record completion. A crash leaves a durable job to retry rather than reopening the image for use.

A retry after a lost reply must handle the object already being absent. If bucket versioning is enabled, deleting a key without a version ID creates a delete marker; it does not necessarily remove the bytes. The [recovery article](/learn/databases/object-storage/recovery/) explains that distinction.

Use fresh keys for replacement images. Reusing one key makes an old deletion job dangerous: a delayed worker could delete the new image now living at that address. An immutable identity, and a deletion target that specifies the intended version where needed, lets the worker act on exactly the retired object.

For shared deduplicated content, the collector must consider all references. Removing one account's image reference is not evidence that no account needs the bytes. The scope of deletion follows the identity model you chose.

## Reconciliation completes the design

A durable job queue handles expected work. A periodic reconciliation process finds missed or inconsistent work: old pending uploads, deletion jobs that keep failing, references to missing objects, and stored objects absent from the application's inventory. Use an appropriate catalogue or inventory report for large collections rather than repeatedly fetching every object.

Reconciliation should create reviewable or retryable work, not immediately delete everything it cannot explain. It also needs a consistent application view and an age margin so that active uploads are not mistaken for abandoned data. Record what is being compared and when the inventories were captured.

The [lifecycle lesson](/learn/databases/object-storage/sandbox/?lesson=lifecycle) models a pending record, an upload and a separate publication decision. Interrupt the sequence, inspect both states and repair it. It is an application-state model, not a transaction spanning a real database and S3. For the real pattern of recording durable follow-up work inside a database transaction, continue with [outbox delivery](/learn/databases/relational/outboxes-and-jobs/).
