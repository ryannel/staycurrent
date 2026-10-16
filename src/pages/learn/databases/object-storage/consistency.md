---
layout: ../../../../layouts/ObjectArticle.astro
title: Consistency and concurrent writers
description: Follow two writers through conditional object updates, distinguish a conflict from a lost response, and see why strong consistency is not a multi-object transaction.
lesson: conditions
---
Consistency describes what a reader can observe as writes happen. It matters when two clients disagree about what is current: a customer downloads an old picture, an export job overwrites another job's work, or a retry appears to fail after the first request succeeded.

For S3 general-purpose buckets, a successful object write is visible to subsequent origin reads; another write or delete can change what those reads return. Replacing one object does not expose a mixture of its old and new bytes. That gives an application a useful boundary, but it does not decide which writer should win or make a group of objects change together.

## One key, one visible replacement

Our application stores a small configuration object at `settings.json`. Its initial content says `{"limit":10}`. Writer A replaces it with `{"limit":20}`. A read that overlaps the write can observe the earlier or later object; after the write has successfully completed, a new origin read observes the replacement, provided nobody has replaced it again. The reader does not receive half of each JSON document.

S3 documents these guarantees for object operations, including overwrite and delete, and documents that there is no atomic update across different keys. It also separates object consistency from bucket configuration changes. These management settings belong to the control plane, the part of the API used to configure the service. Do not infer that their changes propagate like object data. [S3's consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel) is the relevant contract.

A browser may still display the old configuration if it uses a cached response. That request did not necessarily reach S3. Similarly, reading another bucket populated by asynchronous replication is a different operation. First identify which copy answered the request before diagnosing the origin's consistency.

## The lost-update problem

Now the object contains two settings:

```json
{"limit":10,"colour":"blue","revision":"r1"}
```

A and B both read that object. A changes the limit to 20. B changes the colour to green. If both send unconditional replacements built from their earlier reads, B can restore the old limit while publishing green. Every individual write can be atomic and immediately visible, yet A's change is lost.

The problem is the decision made before the write. B's replacement was based on a state that no longer exists. We need the service to check that premise at the same point it accepts the replacement.

## Conditional replacement

A GET response includes an ETag. A writer can return that value in an `If-Match` condition on its PUT. Here, A and B both read ETag `"e1"`; the labels are illustrative, not real S3-generated values.

| Step | Request | Outcome |
| --- | --- | --- |
| 1 | A reads r1 and ETag e1 | A prepares limit 20 |
| 2 | B reads r1 and ETag e1 | B prepares colour green |
| 3 | A puts r2 with If-Match e1 | Accepted; current content changes |
| 4 | B puts its replacement with If-Match e1 | 412 Precondition Failed; e1 no longer matches |
| 5 | B reads r2, reapplies green, and uses its ETag | Can preserve limit 20 while attempting the next revision |

B must reconsider its operation after the conflict. Replacing the header with the newest ETag while sending the same stale body would simply make the lost update deliberate. Sometimes merging is valid, as with these separate settings. Sometimes a job must be recomputed or rejected because its input has changed.

For a key that must be created only once, `If-None-Match: *` checks absence during the write. A separate HEAD followed by an unconditional PUT leaves a race between the two requests. In a versioned bucket the condition concerns the current object; older versions behind a delete marker do not reserve the name forever. These checks and their errors are described in the [conditional-write guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html).

## A token is not the application's history

Treat an ETag as the token the API accepts, not as a universal MD5 checksum or a monotonic revision number. Upload method and encryption affect its interpretation. A change from content A to B and back to identical A may also produce a token that does not reveal the intervening history.

For our configuration, put a fresh revision ID inside every published body and prohibit reusing old revision IDs. That makes logically new revisions differ in content. The revision also gives a retrying client something meaningful to recognise. It does not replace the conditional write: the server still needs a condition that rejects stale replacements. The [object integrity documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html) explains why checksum and ETag should not be treated as interchangeable concepts.

## When the reply disappears

Suppose A sends revision r2 and loses its connection before receiving the response. It cannot infer whether the write failed. Retrying with the original condition may now receive a precondition failure because the first attempt succeeded.

A can read the current object and compare its revision ID with r2. If r2 is current, it has evidence that its revision was published. If another revision is current, that observation alone cannot establish whether r2 briefly appeared and was later replaced. If the business needs that history, retain publication records or an appropriate version history and reconciliation process.

This distinction changes error handling. A confirmed precondition failure means this attempt did not replace the object. A lost response means the attempt's outcome is unknown. Neither is a reason to remove the condition and blindly overwrite the latest state.

Concurrent deletion adds other outcomes. If the current object is absent or a delete marker, `If-Match` fails with 404 rather than matching a previous version. A concurrent operation can also produce 409 Conflict. After a PUT conflict, reconsider the current state before retrying with the appropriate condition. Multipart completion has a different recovery cost: after a 409, S3 requires initiating and uploading again. Keep these branches distinct from the 412 caused by B's stale ETag. The [conditional-write contract](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html#conditional-write-behavior) describes the operation-specific responses.

The [conditional-write lesson](/learn/databases/object-storage/sandbox/?lesson=conditions) lets you keep the old ETag, accept one writer and reject the other. Its separate lost-reply lesson applies the write but hides its response, so you must inspect the revision before deciding what happened. The model serialises requests to make the order visible; it is not a network concurrency test.

## Several objects still need a protocol

Suppose `prices.json` says 20 and `stock.json` says four. Replacing prices with 24 and then stock with eight exposes a period when a reader can receive 24 and four. Both are the latest values of their keys. Strong consistency has not failed; the application published an intermediate state.

Use immutable names for a complete generation and publish one small manifest naming the set. A reader fetches that manifest once, then follows only its names. A conditional replacement can protect the manifest from competing writers. The next article, [publishing a dataset](/learn/databases/object-storage/publication/), develops the protocol through incomplete uploads, conflicting publishers and cleanup. The single-object guarantee becomes useful because the application chooses one object as its publication point.
