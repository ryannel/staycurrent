---
layout: ../../../../layouts/ObjectArticle.astro
title: Performance, storage classes and cost
description: Relate object size and request concurrency to throughput, calculate the work a layout creates, and choose storage classes from access and recovery needs.
lesson: cost
---
An object-storage bill and a slow download often begin with the same design choice: how much useful data each request retrieves. Many tiny objects can require enormous request counts. One huge object can make a selective reader transfer bytes it does not need. Neither stored terabytes nor advertised throughput alone explains the workload.

Start with a reader's operation. Count the objects it needs, the bytes it will transfer, where it runs and how quickly it must finish. Then test whether the chosen layout and client can supply that operation at an acceptable cost.

## Separate latency from throughput

Latency is the time for one request to complete. Throughput is the amount of useful work completed over time. A client making one request at a time can spend much of its time waiting, even when the service and network could handle more work.

In an illustrative system where each request takes 50 ms, a single sequential worker completes about 20 requests per second. Ten independent workers could approach 200 if nothing else limits them. This is arithmetic, not an S3 measurement. Actual throughput also depends on object size, transfer bandwidth, client CPU, connection reuse, service behaviour and other limits.

Concurrency helps until another resource becomes the bottleneck. Increasing it further can produce queueing, retries and higher tail latency, meaning longer waits among the slowest requests. Measure the complete operation rather than celebrate a higher number of in-flight requests. S3's [performance guidelines](https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-guidelines.html) discuss parallel connections, range fetches, Region placement and monitoring.

For a large upload, multipart transfers let several parts travel concurrently and reduce the work repeated after one part fails. For a download, independent ranges can help if the client can assemble and verify one stable object revision. In both cases, unbounded parallelism can overwhelm the client or a downstream consumer.

## Layout changes request count

Consider one million records averaging 1 KB, using decimal units for this example. The payload is about 1 GB. One object per record means about one million whole-object GETs for a full scan. Packing 1,000 records per object means about 1,000 GETs for the same payload.

The packed layout has not made the bytes disappear. It has reduced per-request work. If a user needs one record, though, the application may now fetch a 1 MB batch instead of 1 KB. An index and range-readable format can reduce that waste, at the cost of another structure to maintain. Columnar formats can additionally avoid reading unrelated fields for analytical queries.

The [cost lesson](/learn/databases/object-storage/sandbox/?lesson=cost) lets you change records per object, scan count, retries and retained copies. It reports request and byte counts first. You supply prices if you want a currency estimate; its example rates are arithmetic inputs, not a current AWS quote.

## Retries are part of the workload

A request that fails after transferring most of its body still used time and bandwidth. Retries can also increase pressure while a service or client is already struggling. Limit retries and increase the wait between failed attempts, a policy called backoff. Add random variation to those waits, called jitter, so clients do not all retry together. Use appropriate timeouts and an overall operation deadline. Record retry count separately from the number of user operations.

S3 can return `503 Slow Down` while scaling to a changed request pattern. Its [performance design patterns](https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html) explain retry and scaling considerations. Do not turn historical advice about random key prefixes into a universal rule: current guidance allows sequential naming, and distributing a workload should follow measured needs rather than obscure every useful prefix.

Also inspect dependencies. SSE-KMS requests can be constrained by KMS quotas; a client can saturate its network interface; a worker can spend more time decoding images than reading them. A storage benchmark that omits the application's expensive step cannot establish end-to-end capacity.

## A bill has several terms

A useful estimate separates storage, requests, retrieval, transfer and supporting services. For example, suppose an invented workload holds 100 GB throughout one month. During that month it makes 2,000,000 GETs, retrieves 20 GB from a charged retrieval tier and transfers 30 GB through a charged route. With deliberately illustrative unit prices:

```text
Storage:    100 GB × 0.02 units/GB-month     = 2.00
GETs: 2,000,000 / 1,000 × 0.0004 units      = 0.80
Retrieval:   20 GB × 0.01 units/GB          = 0.20
Transfer:    30 GB × 0.09 units/GB          = 2.70
Subtotal                                    5.70 units
```

This subtotal excludes writes, listing, lifecycle transitions, replication, KMS, CDN charges and other applicable costs. The example's point is that transfer can exceed storage cost even in a small workload. Use the [current S3 price schedule](https://aws.amazon.com/s3/pricing/) for the actual Region, class, route and billing units. Free allowances and tiering can change the arithmetic.

Versioning changes stored bytes. Thirty retained versions of a 100 MB object contain 3 GB of payload, using decimal units and assuming every version is that size. Application compression can change the uploaded size; S3 charges for each [complete stored version](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html), rather than only its changed bytes. A delete marker does not remove that history. Incomplete multipart uploads can also consume space that ordinary object lists do not explain. A capacity estimate should include the retention and cleanup protocol, not just current keys.

## Storage classes encode access assumptions

Frequently read objects usually need immediate access. Infrequent-access classes trade lower storage charges against retrieval charges and other conditions. Some classes have minimum billable sizes and minimum storage durations, so repeatedly storing and quickly deleting small objects may not produce the savings the headline storage rate suggests.

Archive classes differ in retrieval behaviour. Glacier Instant Retrieval supports immediate access; Glacier Flexible Retrieval and Deep Archive require a restore workflow before ordinary reads of archived data. A restore request is not an immediate download. Wait for completion, then read during the temporary restored copy's lifetime. The original archived object remains, and the restored copy can add charges. See [storage classes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html) and [restoring archived objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html).

For a recovery copy needed within minutes, a low monthly archive price may be the wrong choice. For records retained for years and rarely retrieved, a slower restore may be acceptable. Define the recovery requirement before selecting the class; a durable but unreadable-for-now copy does not meet an immediate failover objective.

Intelligent-Tiering can move eligible objects among access tiers based on access patterns, with monitoring charges and optional archive behaviour. Its optional Archive Access and Deep Archive Access tiers also require restoration, but restoration moves the object back to Frequent Access rather than creating the expiring restored copy described above. The [restore guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html) distinguishes the two workflows.

Lifecycle transitions need a workload calculation too. For configurations created or modified since September 2024, objects smaller than 128 KB do not transition by default; explicit size settings can override that default. Our one million separate 1 KB records would stay in their existing class under that rule. Packing them into 1 MB objects crosses the default size threshold, but transition requests, minimum storage durations and retrieval still affect the saving. Older configurations can retain different defaults, so inspect the [transition rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html) and the actual configuration before estimating savings.

## Measure the operation readers need

A useful test uses realistic object sizes, request mix, concurrency and network placement. Record throughput, latency percentiles, errors, retries and transferred bytes. For example, the 99th percentile, or p99, is the time within which 99% of measured requests finish; it helps show slow requests that an average can hide. Test a cold path as well as a cached one, and say which one the result represents. A CDN hit is useful application performance, but it is not an origin GET measurement.

Then change one meaningful condition: object packing, worker count, range size or client location. Check that the answers remain correct and the recovery behaviour still meets the application requirement. Faster scans that break individual updates or shorten the usable recovery window may be a poor trade.

The browser model can calculate work and make cache state visible. It cannot measure S3 latency, durability or your bill. Use its [cost lesson](/learn/databases/object-storage/sandbox/?lesson=cost) to form a hypothesis, then test that hypothesis with the real client and representative data before making a capacity commitment.
