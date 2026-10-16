---
layout: ../../../../layouts/ObjectArticle.astro
title: Publishing a dataset
description: Publish immutable object generations through one manifest, resolve competing writers, and decide when old files are safe to delete.
lesson: publication
---
A dataset often occupies more than one object. A catalogue export may contain prices, stock counts and descriptions. A reader needs those files to describe the same export, even though each upload is a separate operation.

The application can build that boundary by writing immutable generation files and publishing one manifest. The manifest is a small object that names a complete set. Its replacement becomes the point at which new readers discover the new generation. This works because readers follow a protocol, not because the store has acquired a transaction across all the files.

## The intermediate state

Generation A contains a mug price of 20 and stock of four. Generation B should contain a price of 24 and stock of eight. Suppose a publisher overwrites `prices.json`, then `stock.json`. Between those operations a reader can receive 24 and four. Each response is correct for the key it fetched, yet the pair never belonged to a completed export.

Even changing the upload order does not solve this. It merely changes which mixture can appear. A reader that fetches the two files at different times can straddle the update in either order. The unit of publication must be something that identifies both files together.

<div id="give-each-generation-its-own-names" aria-hidden="true"></div>

## Immutable generations and the manifest

Upload B to new keys: `exports/B/prices.json` and `exports/B/stock.json`. Do not modify A. Only after both B uploads have succeeded and their content has been checked should the publisher replace `current.json` with:

```json
{
  "generation": "B",
  "publicationId": "publish-82",
  "files": {
    "prices": "exports/B/prices.json",
    "stock": "exports/B/stock.json"
  }
}
```

This JSON is our application format. S3 stores it as ordinary bytes. A reader GETs `current.json` once, parses that copy, then GETs the exact keys it contains. It must not re-read the manifest between the price and stock requests, nor list the bucket to infer which files belong together.

<figure class="object-figure"><div class="flow"><div><strong>Reader already holding A</strong><span>A/prices → 20<br>A/stock → 4<br>Keeps using its saved manifest</span></div><div><strong>Publish current.json</strong><span>Before: generation A<br>After: generation B<br>One object replacement</span></div><div><strong>Reader fetching origin afterwards</strong><span>B/prices → 24<br>B/stock → 8<br>Uses the new manifest</span></div></div><figcaption>Both readers can finish after B is published because A's files remain available and unchanged.</figcaption></figure>

The [S3 object consistency contract](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel) supplies the single-object replacement boundary. Completeness of the files, immutable naming and the reader's behaviour are our additional rules. A missing B file is a publication bug; the reader should report an incomplete generation rather than quietly substitute A's stock.

The exporter must also construct B from an appropriate source view. If it reads prices before a database change and stock afterwards, a manifest faithfully publishes that mixture. Use a source snapshot or another defined export boundary when the files must represent one state of the source. Publication preserves the set the exporter built; it cannot repair how that set was computed.

## A failed publisher

Consider a crash after B's prices upload but before B's stock upload. `current.json` still names A, so conforming readers continue to get a complete dataset. The unfinished B object is unused work that can be resumed or collected later. Its presence in a listing does not mean publication succeeded.

A crash after both files but before the manifest has the same reader outcome. A crash after the manifest write is different: B may already be public even if the publisher never received its success response. Read the manifest and compare its publication ID before deciding whether to retry. If other publishers can advance it again, keep enough publication history to resolve an intervening successful publication when the application needs that distinction.

Use unique generation names and prevent accidental replacement of generation objects. `If-None-Match: *` on creation can reject reuse of a live key. Permission boundaries and retention rules must also support immutability; a naming convention alone cannot stop another writer from modifying bytes behind an old manifest.

## Competing publishers

Two jobs can both read current generation A, build B and C, and race to replace the manifest. If C was computed using A, overwriting B may discard work C was supposed to include. Protect publication with `If-Match` using the ETag read from the current manifest. Only a writer whose premise is still valid should advance it.

A conflict is a decision point. If the exports are independent snapshots and a scheduler deliberately chooses one winner, discard the losing generation. If the new generation must include the winning job's changes, read the new state and rebuild. Blindly fetching a newer ETag and resending C does not merge any data. The [concurrent-writer article](/learn/databases/object-storage/consistency/) follows that failure in detail.

Put a unique publication ID in each manifest body. This helps distinguish a logical publication from a repeated byte representation and helps resolve a lost reply. Retain the conditional request: the ID does not make the check-and-replace operation atomic by itself.

<div id="when-can-a-be-deleted" aria-hidden="true"></div>

## Retaining and collecting generations

A collector has to account for readers still using published generations and writers that might still publish unfinished ones. Absence from the current manifest is not enough to decide either case.

### Readers still using a generation

Publishing B does not prove that nobody still needs A. A reader may have fetched A one second earlier and be slowly downloading its files. A cached manifest may also continue to name A after origin publication changes.

A bounded retention scheme can work when the application defines a maximum age for a cached manifest and maximum reader duration. Suppose B is published at 12:00, a cache may still hand out A for five minutes, and a reader may take ten minutes after receiving its manifest. A reader starting just before 12:05 can still need A until almost 12:15. Retaining A for ten minutes after publication would be too short: the two windows add together. Include any permitted stale-cache serving, retries and operational margin in the bound. An offline client allowed to resume a month later needs a different promise. Keeping the last three generations is not an equivalent time bound when publishing can happen rapidly.

For unbounded readers, consider explicit leases or pins that the collector honours, or retain generations until an external workflow confirms they are no longer needed. Those mechanisms have their own failure handling: a crashed reader's pin needs an expiry or administrative recovery policy. The useful question is what evidence makes deletion safe for this application.

### Abandoned generations and active publishers

The collector must also distinguish unpublished work from newly uploading work. A file absent from the current manifest may belong to an active publisher or an older pinned generation. Suppose a collector checks that B is unpublished, then B's writer publishes it just before the collector deletes its stock file. Rechecking without coordinating with the publisher leaves that race open.

For a small export service, a simple rule is to collect a failed job's generation only after its publisher has stopped and any in-flight manifest request has a resolved outcome. A resumed job gets a new generation name; it cannot later publish the abandoned one. If the job might already have published B, retain B under the reader-lifetime rule until that uncertainty is settled. More concurrent designs need to coordinate publication, pin acquisition and collection so that a generation selected for deletion cannot gain a new reference. A broad age-based lifecycle rule cannot inspect those application references for you.

## Where a table format goes further

This manifest gives readers a coherent file set. It does not define column types, validate updates to individual rows, resolve every concurrent operation or plan a query. A table format such as Iceberg adds metadata and commit rules for those jobs; an engine interprets the format and executes queries. The [S3 Tables article](/learn/databases/object-storage/tables/) follows that next layer.

For a photograph referenced from one database row, a full export manifest may be unnecessary. The database can hold the current immutable object key, but its transaction still cannot atomically commit a separate S3 upload. The [database-record lifecycle](/learn/databases/object-storage/database-records/) uses explicit pending and ready states to handle that boundary.

In the [publication lesson](/learn/databases/object-storage/sandbox/?lesson=publication), first expose a mixed price-and-stock pair. Then publish a generation manifest and continue a reader holding the older one. Delete an old file and inspect the broken reader: the experiment makes retention part of correctness rather than an afterthought about storage cost.
