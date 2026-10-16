---
layout: ../../../../layouts/ObjectArticle.astro
title: Uploads, downloads and integrity
description: Follow a multipart upload from its first part to completion, recover from an interrupted request, and distinguish object identity from byte integrity.
lesson: multipart
---
Uploading an object means transferring bytes and deciding when they are safe to use. A small photograph may fit comfortably in one PUT. A large recording may take long enough that restarting from zero after one broken connection is wasteful. Multipart upload divides that transfer into independently retryable pieces while still publishing one completed object.

The distinction is between transfer state and readable object state. A service can hold uploaded parts without yet having an object that an ordinary GET can return. Following those two states separately makes retries, completion and cleanup much easier to understand.

## A transfer in three stages

An uploader wants to store a 13 MiB recording at a new key, `recordings/r-7.bin`. It chooses three parts: 5 MiB, 5 MiB and 3 MiB. The final part may be smaller than the usual minimum. These sizes satisfy S3's multipart constraints; a real uploader chooses part sizes using the expected object size, maximum part count and available concurrency. The maintained [multipart limits](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) should drive that choice. In this example, no other writer uses the destination key.

First, `CreateMultipartUpload` establishes the upload and returns an upload ID. The uploader records that ID with the intended key, source file and metadata. Next, each `UploadPart` request carries that ID, a part number and that part's bytes. It records the returned ETag for each successful part. Finally, `CompleteMultipartUpload` sends the ordered part numbers and their ETags. Successful completion assembles the selected parts into the object.

<figure class="object-figure"><div class="flow"><div><strong>1. Initiate</strong><span>Key: recordings/r-7.bin<br>Upload ID identifies unfinished work</span></div><div><strong>2. Transfer parts</strong><span>1: 5 MiB · 2: 5 MiB · 3: 3 MiB<br>Each accepted part has its own ETag</span></div><div><strong>3. Complete</strong><span>Ordered part list<br>GET can now read the 13 MiB object</span></div></div><figcaption>Uploaded parts belong to an unfinished upload. Completion creates the ordinary object; it does not publish three independent files.</figcaption></figure>

Part 3 can finish before part 2. Completion still orders the bytes by part number, not arrival time. Sending new bytes for the same part number replaces that part in this upload. Therefore, the uploader must keep its completion list consistent with the accepted parts. The [multipart process](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) explains the relationship between upload IDs, part ETags and completion.

## Resume the same source

Suppose part 2's connection breaks. The uploader can retry that part rather than resend parts 1 and 3. But it must retry bytes from the same source revision. If a local file changed between requests, successfully assembling parts would produce a recording that never existed as a complete source file.

A resumable uploader therefore persists more than an upload ID. It needs the source identity, size, part layout and successful part responses. A local immutable file, or a verified source revision, makes that state meaningful. Listing the unfinished upload's parts can help verify what exists after a crash. AWS advises maintaining the completion list from the uploader's own part responses rather than constructing it from that listing.

For our recording, the uploader's state might develop like this. The ETag names below are illustrative tokens.

| Step | Accepted parts | Uploader's next action |
| --- | --- | --- |
| Parts 1 and 3 succeed; part 2 fails before reaching S3 | 1/e1 and 3/e3 | Keep both responses and resend the source's second 5 MiB as part 2 |
| Part 2 succeeds | 1/e1, 2/e2 and 3/e3 | Complete with the ordered pairs 1/e1, 2/e2, 3/e3 |
| Completion succeeds | One 13 MiB object | Verify the result and record completion |

Completion checks the parts the client names. Naming a missing part, or the wrong ETag for a part, produces `InvalidPart`. But a client that accidentally completes with only parts 1 and 2 can create a valid 10 MiB object: S3 cannot infer that the application intended another 3 MiB. Keep the expected size and a suitable full-object checksum with the transfer record. Successful assembly and a complete recording are different conclusions. The [completion API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html) defines these checks.

Completion deserves its own error handling. A raw S3 completion response can begin with HTTP 200 and later contain an error in its response body. AWS SDKs handle that protocol detail. A hand-written client that treats the initial status as publication success can expose a key that was never completed. Read the full [CompleteMultipartUpload response contract](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html).

If completion's response is lost, inspect the intended object and its expected identity before starting another upload. A retry can find that the upload ID no longer exists because completion already consumed it. The absence of that upload ID does not distinguish successful completion from other reasons it disappeared. A unique destination key and application revision metadata make reconciliation easier; checksums add evidence about the bytes.

## What a checksum proves

A checksum is a value computed from bytes. The sender supplies a supported checksum so the receiver can detect a transfer whose bytes differ from the expected input. On download, a client can verify a corresponding checksum rather than assume a completed HTTP transfer is sufficient.

Keep three values separate. The key names the object. A version ID identifies a stored version when versioning is enabled. A checksum describes bytes under a particular algorithm and checksum mode. An ETag serves the API's object/condition machinery and is not a universal whole-object MD5 hash.

Multipart checksums can describe the full object or combine part checksums, depending on the selected algorithm and supported mode. Comparing a composite value with a locally computed whole-file digest is not a valid integrity check merely because both are labelled “checksum.” Record the algorithm and type with the value. The [upload integrity guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html) describes the supported checks and how to request stored checksum values during downloads.

Integrity also has a boundary. Matching the uploader's checksum proves agreement with those supplied bytes; it does not prove that the photograph is appropriate, the CSV has valid rows, or the recording came from a trusted source. Content validation belongs before publication when readers rely on those properties.

## Downloading a range

A range request fetches a selected interval of bytes. For a zero-based byte sequence, `Range: bytes=0-1023` requests its first 1,024 bytes. That is useful for a file format whose header tells the reader where another section begins, or for resuming a large download. S3's [GetObject API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) specifies its range support and response fields.

Several range requests must still describe one object revision. If the key is overwritten between requests, the client can otherwise join the start of the old recording to the end of the new one. Use an immutable key, an explicit version ID, or appropriate read conditions so a changed object causes a visible failure instead of silently mixed content.

A byte range is not a row filter. Asking for a slice in the middle of a compressed stream may leave the client unable to decode it. Formats designed for independent blocks, with metadata locating those blocks, make selective reading practical. This is one reason analytical storage layouts matter even when their files all live in the same object store.

## Finishing abandoned work

An uploader can fail permanently after sending two parts. Ordinary object listing will not make those parts look like a finished recording, but they still consume storage. Abort the unfinished upload when the work is abandoned; configure an incomplete-upload lifecycle rule as a backstop.

Stop active part workers before concluding that an abort has reclaimed everything. Requests already in flight can finish around an abort, so cleanup must follow the service's documented procedure and verify that work is gone. Deleting an ordinary object is not a substitute for aborting its unfinished multipart upload. The [abort guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/abort-mpu.html) gives the distinct operation.

The [multipart lesson](/learn/databases/object-storage/sandbox/?lesson=multipart) uses short text parts so their contents remain visible. It deliberately omits S3's minimum part sizes and network behaviour. Try completing before all listed parts exist, repair the missing part, then complete and GET the result. A second lesson aborts unfinished work. These state transitions are what the model teaches; throughput and real-service checksums need a real transfer.
