---
layout: ../../../../layouts/ObjectArticle.astro
title: Events and object-processing workflows
description: Build image-processing work that survives duplicate notifications, reversed delivery order and a crash after writing its output.
lesson: events
---
An uploaded photograph often starts more work: generate a thumbnail, scan its content, extract text or update a search index. An object event can notify a worker that something changed. It does not make that downstream work part of the upload transaction.

A dependable worker must know which object revision it is processing, what effect it intends to produce and how it will recognise work already completed. We will follow a thumbnail job through duplicate and out-of-order notifications, then through a failure after the output was written.

## An event identifies work

S3 event notifications are designed for at-least-once delivery. A notification can be delivered more than once, and events are not guaranteed to arrive in the order the writes occurred. Notifications can feed services such as SQS, SNS, Lambda or EventBridge, with different delivery arrangements. The [event notification guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html) describes supported destinations.

Suppose a versioned source key `uploads/i-83.jpg` receives version v1, then v2. A worker receiving the v1 event should not blindly GET the current key: by the time it runs, that GET may return v2. If the job is “process every uploaded revision,” fetch the event's exact version ID. If the system only wants the latest revision, it still needs an explicit rule for deciding that older work can be skipped.

Store enough identity for the intended operation. A useful thumbnail job key is the source bucket, source key, source version and transformation version. The transformation version matters because changing the resize algorithm can legitimately require new work even when the source bytes did not change.

The event's object key is encoded, and the event schema contains details that a parser must handle correctly. In S3 event records, a plus sign can represent a space in the encoded key. Decode using the documented form-encoding rules rather than fetch the literal event string. The [message structure reference](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-content-structure.html) also describes version IDs and sequencers.

## Make repeating the effect harmless

For this example, notifications feed a queue and a worker acknowledges a message after completing its work. Imagine the output key is `thumbs/i-83/v1/resize-3.jpg`. The worker fetches source v1, produces the thumbnail and stores it. It then crashes before acknowledging the queue message. The same event is delivered again.

If the output identity is stable and the transformation is deterministic, the second worker can verify an existing output or safely attempt a conditional create. The repeated delivery need not produce another user-visible thumbnail. This is idempotent processing: repeating the operation preserves the intended result.

A `412 Precondition Failed` response to `If-None-Match: *` establishes only that something already occupies the output key. Before treating that as completed work, verify that the existing object represents the intended source version and transformation, using recorded provenance and an expected content checksum where appropriate. A different result is a conflict to investigate, not a successful retry. Restrict writes to this output namespace so those records are trustworthy. Once the effect is established, the worker can record completion and acknowledge the message; a crash between those steps must remain safe to repeat. The [conditional-write article](/learn/databases/object-storage/consistency/) distinguishes this conflict from other failed or uncertain requests.

A separate “processed” marker requires care. Writing the marker before the thumbnail can lose work if the process crashes between them. Writing it after the thumbnail can cause repeated work if the marker write fails. The marker and effect do not become atomic merely because they both live in object storage.

<figure class="object-figure"><div class="flow"><div><strong>Event v1</strong><span>Fetch exact source version<br>Compute resize-3</span></div><div><strong>Write stable output</strong><span>thumbs/i-83/v1/resize-3.jpg<br>Crash before acknowledgement</span></div><div><strong>Repeated event v1</strong><span>Recognise or verify the same output<br>Complete the pending work</span></div></div><figcaption>A stable output identity lets a retry reconcile the effect. The queue can still deliver the event more than once.</figcaption></figure>

If processing includes a non-idempotent external effect, such as charging an account, use that destination's idempotency mechanism or a durable workflow that can reconcile uncertain outcomes. A thumbnail convention does not establish exactly-once behaviour for arbitrary services. The [relational outbox discussion](/learn/databases/relational/adding-another-system/) follows the durable-work boundary in more detail.

## Do not let old work replace new results

Now v2's thumbnail finishes before v1's. Keeping their outputs at separate keys preserves both. A mutable “current thumbnail” pointer needs another rule, otherwise the late v1 job can make the interface show the older image.

The cleanest authority may already be in the application database: the account selects source version v2. A worker can publish its derivative only if that source revision is still selected, using a conditional database update. A late v1 result remains stored but does not become current. This links publication to the user's chosen revision instead of worker completion time.

If a crash left publication unfinished, a retry that finds the derivative already present still applies that selection check. “Thumbnail exists” and “current pointer updated” are separate milestones. Keep unfinished publication discoverable until the pointer update succeeds or the source has been superseded.

For workflows that use S3 event sequencers to maintain a latest-per-key view, compare them only for the same key. Left-pad the shorter hexadecimal string with zeros before comparing: `f` becomes `0f`, which precedes `10`. Comparing the original strings directly would reverse that example. Sequencers do not establish order across different object keys. A revision with a larger-looking version ID is not necessarily newer; version IDs are identities, not counters. These rules come from the [event message reference](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-content-structure.html).

The [events lesson](/learn/databases/object-storage/sandbox/?lesson=events) uses explicit application sequence numbers to make this policy inspectable. Deliver revision two before revision one, then deliver two again. Observe the separate derivative outputs, completed-job ledger and latest pointer. Its numbers are teaching inputs, not real S3 sequencers.

## Failures need somewhere to go

A corrupted image can fail every time. Retrying it without a bound consumes workers without making progress. Separate transient failures from persistent input failures, record the cause and move exhausted work to a repair path. A queue's visibility timeout and redrive policy are part of the actual worker deployment; they are not object-storage settings.

After fixing a decoder or correcting permissions, replay the durable work using the same operation identity. If the repair changes the transformation, give that new transformation its own version. Otherwise a previous “done” record might wrongly suppress the newly required work.

Avoid creating a processing loop. If every object write triggers the worker and the worker writes thumbnails into the same triggering scope, its output can trigger another job. Use a source prefix or separate bucket and test the notification filter against actual source and output keys. A successful thumbnail upload is not a reason to process that thumbnail as a new original.

## Reconcile events with intended work

Events reduce the delay before work starts; they should not be the only inventory of what the application expects. A reconciliation job can compare published source revisions with completed transformation records and enqueue missing work. This also helps repair older objects that predate a notification configuration or a new transformation version.

The comparison needs a stable target. If it scans a changing list of objects while the application publishes new revisions, record the scan's scope and allow overlapping later passes. A manifest of required source versions or a database query over pending jobs gives stronger application meaning than “everything we happened to list.”

A useful operational view reports oldest unfinished work, retry counts, persistent failure categories and the number of published images without their required derivatives. Those are closer to the user-visible problem than counting notification messages alone. A queue can be empty because all work succeeded, because notifications were misconfigured, or because failures were discarded; only the surrounding state distinguishes those outcomes.
