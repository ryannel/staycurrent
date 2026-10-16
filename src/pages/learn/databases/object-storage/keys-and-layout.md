---
layout: ../../../../layouts/ObjectArticle.astro
title: Keys, metadata and object layout
description: Design object identities, distinguish a prefix from a directory, and choose a layout that readers can use without scanning every object.
lesson: keys
---
An object key is the name an application supplies when it stores or fetches bytes. In an S3 general-purpose bucket, `photos/mug/front.jpg` is one key. The slashes make that name convenient to organise, but they do not create parent directories with independent ownership or an atomic directory rename.

Choosing keys is therefore part of designing an application's data. A good name gives the operations you actually need a dependable way to reach an object. It cannot make the store understand all the properties of the content behind that name.

## Identity and location

Suppose product 17 has two photographs. The database can store the product's colour, price and an ordered list of image IDs. Each image record names an object such as `images/i-83/original.jpg`. Renaming the product from “Blue mug” to “Ocean mug” leaves the image address unchanged. A key derived from the display name would make that ordinary edit into a storage migration.

The image ID is the application's identity. The bucket and key locate its bytes. Keeping those concepts separate lets us move storage later without changing every reference to the image itself. A tenant prefix, such as `tenants/t-4/images/i-83/original.jpg`, can also give operational tooling and access policies a useful boundary. The application must derive that tenant from the authenticated request, rather than trust a supplied prefix to establish ownership.

What if the photograph changes? Replacing the same key is convenient for writers, but readers and caches may already hold its previous contents. Giving each revision a new key makes that distinction visible: `images/i-83/r2/original.jpg` can coexist with r1. The database chooses the current revision. A request that already received r1 can finish reading it while newer pages use r2.

A content digest can also form part of a key. If identical bytes always map to the same name, an application can reuse an existing object. It must still choose the hash algorithm, verify the bytes, and decide how tenant permissions and deletion work. Shared content cannot be deleted merely because one reference disappeared. A digest is an identity convention we implement, not a reference-counting feature supplied by S3.

## Prefixes and listing

A prefix is a beginning of a key. Listing with prefix `images/i-83/` finds keys beginning with those exact characters. It does not search object contents, and a prefix without its trailing slash can match more than intended: `images/i-8` can include both i-8 and i-83.

Adding a delimiter, usually `/`, groups the next level into common prefixes. A browser can use that response to draw folders. For these keys:

```text
exports/A/prices.json
exports/A/stock.json
exports/B/prices.json
photos/mug.jpg
```

A listing with prefix `exports/` and delimiter `/` can show A and B as groups. Removing the delimiter returns the matching object names. Nothing has moved between two physical directories. This is a way to select and present names. [S3's naming guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html) explains the flat key model and its UTF-8 naming rules.

A listing is also a paginated operation. One `ListObjectsV2` response contains at most 1,000 keys. If `IsTruncated` is true, use `NextContinuationToken` in the next request and continue until the result is complete. Treat that token as opaque; do not invent it from the last filename. High-level command-line tools may paginate automatically, which can hide this responsibility from an application author. The [API reference](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html) distinguishes response pagination from key ordering.

Strong consistency does not freeze a whole multi-request walk. A writer can add or remove objects between pages. If an export requires a fixed inventory, publish a manifest containing the exact keys and read that manifest once. A listing answers what names are visible to each request; a manifest defines which objects belong to a particular dataset.

<div id="metadata-has-different-jobs" aria-hidden="true"></div>

## Metadata, tags and content types

An object has bytes and descriptive fields. `Content-Type` tells a client how to interpret the bytes. `Cache-Control` influences caching. Application metadata might record a source image ID or the software version that produced a thumbnail. These values help when handling an object already identified by key.

They do not turn an ordinary list operation into “find all blue photographs larger than five megapixels.” Keep that queryable business information in a database or a deliberately maintained catalogue. Otherwise the application must fetch metadata for many objects just to discover which ones matter.

S3 distinguishes user-defined metadata supplied at upload from object tags. Replacing that user-defined metadata involves copying the object with the new metadata; tags have separate operations and can participate in lifecycle and access rules. S3 also offers annotations that can be changed separately. These choices determine how a field is updated, but none makes an ordinary LIST query its value. A database row may be a better home for upload progress that must change alongside an account record. The [metadata guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html) describes these fields and their update rules.

A stored `Content-Type: image/jpeg` is also only a declared type. An untrusted upload does not become a safe JPEG because its sender chose that header. The [private-upload article](/learn/databases/object-storage/access/) follows validation before publication.

## Object boundaries determine the work

Imagine one million readings, each 1 KB. One object per reading makes an individual reading easy to retrieve, but a scan now needs roughly one million GET requests. Grouping 1,000 readings into each object reduces a complete scan to roughly 1,000 GETs. It also changes the smallest convenient unit of replacement and recovery.

If readers mostly request one reading, large bundles can transfer many unwanted bytes. A format with an offset index can use range reads, but the application now needs to know the offsets and interpret the format. If readers mostly scan a day, grouping by day may be useful. The format and access pattern decide the boundary; total stored size alone does not.

<figure class="object-figure"><div class="flow"><div><strong>One reading per object</strong><span>1,000,000 names<br>One reading per GET</span></div><div><strong>1,000 readings per object</strong><span>1,000 names<br>A batch per GET</span></div><div><strong>Indexed batches</strong><span>Fewer objects<br>An index locates byte ranges</span></div></div><figcaption>The same readings can require very different request patterns. These are illustrative counts, with one GET per whole object; compression and retries are excluded.</figcaption></figure>

## Moving and retiring data

In general-purpose buckets, moving an object to a new name commonly means copying it and then deleting the old name. Those are separate operations. A crash after the copy can leave both names; a reader holding the old name can fail after the delete. Moving a thousand-key prefix does not turn those steps into one transaction. Objects in S3 Express One Zone directory buckets have a different rename API, covered in [S3 in practice](/learn/databases/object-storage/s3/).

Design a migration around references instead. Copy and verify the bytes, publish the new reference, retain the old object for existing readers, and remove it when the retention rule allows. If the reference is in a database, the [object lifecycle article](/learn/databases/object-storage/database-records/) explains how to make unfinished work recoverable.

In the [keys lesson](/learn/databases/object-storage/sandbox/?lesson=keys), list `photos/`, then change the prefix to `photo`. Add a new key and observe which names change. The lesson's tiny lists fit in one response; the real application's pagination loop remains necessary when the collection grows.
