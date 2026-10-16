---
layout: ../../../../layouts/ObjectArticle.astro
title: Delivering and caching objects
description: Distinguish an origin read from a cached response, choose immutable asset URLs, and design private delivery without accidentally sharing protected bytes.
lesson: cache
---
Object storage is often the origin for images, downloads and application assets. The origin retains the bytes; a content delivery network, or CDN, keeps copies near readers. A browser can keep another copy. These layers reduce repeated transfers, but they also mean that replacing an origin object is not the same as replacing every response a user might receive.

A useful delivery design makes the identity of the content and the lifetime of its copies explicit. We will follow a photograph changing from one revision to another, then consider what changes when the photograph is private.

## Which layer answered?

At noon, `photo.jpg` contains a blue mug. A CDN fetches it and stores the response for ten minutes. At 12:01, the application replaces the origin object with a green mug. At 12:02, the CDN can still answer from its cached blue copy without consulting the origin.

That does not contradict S3's object consistency. The origin was not asked for this response. A browser may also answer from its own cache without contacting the CDN. Diagnose the actual request path, response cache headers and age before concluding that storage returned stale bytes.

<figure class="object-figure"><div class="flow"><div><strong>S3 origin</strong><span>photo.jpg now contains green<br>New origin GET sees green</span></div><div><strong>CDN copy</strong><span>Cached blue response<br>Freshness lifetime has not ended</span></div><div><strong>Browser copy</strong><span>May reuse its own blue response<br>No origin request is necessary</span></div></div><figcaption>Freshness is evaluated by each cache. A successful origin replacement does not push new bytes into every existing copy.</figcaption></figure>

HTTP's [caching specification](https://www.rfc-editor.org/rfc/rfc9111.html) defines freshness and validation. For CloudFront, cache-policy minimum, default and maximum TTLs also affect how origin directives are used. In particular, a positive minimum TTL causes caching for at least that interval even with `no-cache`, `no-store` or `private` origin directives. Review the actual [CloudFront cache policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-key-understand-cache-policy.html) rather than treating one object header as the entire configuration.

## Immutable asset URLs

Instead of replacing `photo.jpg`, publish the new photograph at `photos/i-83/r2.jpg`. Leave r1 unchanged. The updated application page points to r2, while a page already displaying r1 can finish normally. Because each URL identifies stable content, a long cache lifetime becomes useful rather than surprising.

The changing reference still needs a freshness policy. An HTML page, API response or manifest that selects r2 cannot remain cached forever if readers need new revisions promptly. Give stable assets and changing references different policies. A long-lived asset cache does not help when the page selecting the asset is stale.

A digest or revision in the filename makes identity visible and avoids depending on how a CDN includes query parameters in its cache key. Query-string versioning can also work, but only if the cache policy actually distinguishes the parameter. The [CloudFront versioning guidance](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/UpdatingExistingObjects.html) explains versioned names and invalidation as different update mechanisms.

Removing r1 immediately would still break a reader whose cached page points to it but whose image cache does not contain it. Retain old assets for the supported lifetime of pages and clients. Naming and caching therefore meet the same reader-lifetime problem as [dataset publication](/learn/databases/object-storage/publication/).

## Validation and invalidation

A stale cache entry can ask the origin whether its stored representation is still usable. An ETag-based conditional GET can receive `304 Not Modified`, allowing reuse without transferring the full body. If the content changed, the origin returns a new representation. Validation saves bytes; it still requires a request and its latency.

Invalidation asks a CDN to stop using selected cached entries. It is useful when a stable URL must change or incorrect content must be removed, but it has propagation and cost considerations. It also cannot erase a copy already downloaded by a browser or another client. Avoid promising that an invalidation instantaneously recalls every byte.

For an ordinary deployment, versioned assets make rollback simple: publish a reference to the previous known-good version, provided the old assets remain available. A rollback should restore a complete set of compatible assets, not select a previous script while leaving a newer incompatible stylesheet or data manifest.

## Private content changes the cache design

A private S3 bucket can serve a CDN origin without becoming publicly readable. CloudFront Origin Access Control gives the distribution a controlled origin access path, with a bucket policy scoped to that distribution. This uses a regular S3 bucket origin; an S3 static website endpoint does not support OAC. Viewer authorization is a separate decision: a distribution that can fetch private origin bytes still needs a rule for which viewers may receive them. See [restricting S3 origin access](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).

CloudFront signed URLs or cookies can restrict viewer access without exposing the origin directly. They are different credentials from an S3 presigned URL. The [private-content guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) describes those choices.

Suppose Alice's authorised request puts a private photograph in the edge cache. Bob must still present valid viewer authority to fetch it through a cache behaviour that requires signed access. CloudFront checks a signed URL's signature and policy before using the cached object or fetching the origin. The bucket's origin policy does not perform that viewer check on a cache hit. This order lets authorised viewers share one cached representation without making it public. See the [signed URL request flow](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html).

If an application generates different bytes for different users at the same URL, a shared cache must not accidentally reuse one user's response for another. Either avoid shared caching of those responses or define a cache key and authorization design that safely separates representations. Adding every session token to the cache key can destroy reuse and may expose sensitive values in logs. The right boundary depends on whether the bytes are shared content with restricted access or genuinely personalised content.

CloudFront checks a signed URL's expiry when each HTTP request begins. A download begun before expiry can continue afterwards, but a new range request or restart after expiry fails. Expiry also cannot revoke bytes someone already downloaded. If a user loses access, the application must decide what future requests are blocked and what retention of prior copies it can realistically control. These are the [documented expiry boundaries](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html), not a promise to stop an active transfer at the expiry instant.

## Large files and partial responses

Range requests let a player or downloader request part of an object. A CDN may cache and serve ranges according to its own rules. Keep the object revision stable across the sequence so a resumed download cannot combine two revisions. The [transfer article](/learn/databases/object-storage/transfers/) explains the byte-level boundary; CloudFront documents its [range GET behaviour](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RangeGETs.html) separately.

Also set content metadata for the actual delivery. A download may need an attachment disposition; a rendered image needs an accurate media type. Serve untrusted active content from an appropriately isolated origin rather than grant it the application's origin privileges because it lives in your bucket.

In the [cache lesson](/learn/databases/object-storage/sandbox/?lesson=cache), fetch a mutable key through a small model cache, overwrite the origin and compare an origin read with the cached read. Advancing the model clock makes the cache refetch. This exposes the freshness decision; it does not simulate CloudFront propagation, browser cache implementation or production latency.
