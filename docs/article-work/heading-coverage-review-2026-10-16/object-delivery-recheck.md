# Object delivery independent recheck

Independent source reading of `src/pages/learn/databases/object-storage/delivery.md`, 16 October 2026. The reviewer did not write this page or consult the object-storage review report. Root handles built-page and browser verification.

## Expectation recorded from title and opening

Before reading the headings or body: a developer should be able to distinguish origin, CDN and browser copies; predict why replacing a photograph at the origin leaves an older response possible; choose a URL/version and cache lifetime that make revision delivery dependable; and understand how private delivery keeps both the origin and intermediary caches from exposing bytes to another reader. The promise about private delivery owes a concrete authorization/cache boundary, including the consequence of signed-link expiry or revocation for bytes already cached. I expect a worked revision rather than a complete HTTP caching reference. CDN-specific configuration can be bounded explicitly, but the reader still needs enough to avoid assuming origin permissions automatically protect every cached response.

## Heading map

```text
## Which layer answered?
## Immutable asset URLs
## Validation and invalidation
## Private content changes the cache design
## Large files and partial responses
```

## Assessment

Heading fit and transitions pass. The first question names the actual diagnostic distinction and the noon/12:01/12:02 example answers it. Immutable naming follows naturally from stale responses; the manifest policy then prevents the reader from assuming asset naming also refreshes the selecting page. Validation and invalidation separates two commonly confused mechanisms. The private-content section changes the access assumptions explicitly, and the range section returns to delivery mechanics. There are no misplaced major ideas or headings that conceal an essential lesson.

The body meets the expected scope. It explains three copies, stable URLs, the separate changing reference, public cache directives, retention of old revisions, conditional reads, invalidation limits, origin access versus viewer authority, authorization before cache reuse, shared restricted bytes versus personalised representations, and request-start expiry. These are taught in the article, not merely named. The range paragraph gives the required stable-revision rule before linking onward.

I inspected the relevant local onward teaching: `publication.md` explains cached-manifest lifetime, bounded reader duration and old-generation retention, including the five-minute plus ten-minute example; `transfers.md` explains byte ranges and the need for immutable names, version IDs or conditions across requests. Those links carry the promises made here. A complete HTTP directive reference, deployment configuration, CDN error-policy tutorial and signed-cookie implementation are legitimate scope exclusions. Browser behaviour and the cache lesson remain for root's rendered review.

## Finding and resolution

**Qualify the concrete manifest policy for origin failure.** The paragraph after `Cache-Control: no-cache` says setting CloudFront's minimum TTL to zero makes it honour validation before reuse. That matches AWS's summary table, but the same primary page documents an outage exception: when the origin is unreachable and minimum or maximum TTL is positive, CloudFront may serve the prior response. AWS prescribes `stale-if-error=0` to prevent that fallback. The article's recipe can leave maximum TTL positive, so a reader may infer a stronger fresh-or-error guarantee than the configuration establishes. Add `stale-if-error=0` to the manifest example and briefly explain why it is there if strict validation is intended; alternatively, limit the promise to normal reachable-origin operation and identify the separate outage choice. This is a bounded qualification of the recipe, not a request to enumerate caching directives. [AWS expiration documentation, table and warning](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html).

The AWS page's warning is nested under the positive-minimum-TTL warning even though its outage condition explicitly says minimum **or maximum** TTL. I have preserved that distinction rather than treating the summary table alone as an unconditional guarantee. The proposed explicit directive follows AWS's stated mitigation.

**Resolved on independent recheck.** The coordinator changed the example to `Cache-Control: no-cache, stale-if-error=0`. The following paragraph now keeps the zero minimum TTL requirement, explains the separate unreachable-origin case, and makes the error-over-unchecked-manifest choice explicit with the relevant AWS link. I reread that passage with the surrounding immutable-asset, retention and validation sections. The qualification is accurate, understandable and in the right place; it adds no disruptive detour. The original finding is closed.

Final assessment: pass for heading fit, transitions and scoped technical completeness. No material issue remains from this independent reading. I did not edit the article.

## Primary-source checks

- The meanings of `no-cache`, `no-store`, freshness and validation match [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.2). The versioned asset example correctly treats `immutable` as a promise during the freshness lifetime, not write protection, matching [RFC 8246](https://www.rfc-editor.org/rfc/rfc8246.html#section-2).
- The positive-minimum-TTL override and query-parameter cache-key distinction match [CloudFront cache-policy documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-key-understand-cache-policy.html). The outage qualification above comes from [CloudFront expiration documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html).
- Distribution-scoped bucket permission and the exclusion of S3 website endpoints match [CloudFront OAC documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).
- Signature and policy checks precede cache/origin serving; an active transfer can continue past expiry, while later range or restarted requests fail. These claims match [CloudFront signed URL documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html). The page's photograph/download context does not require expanding into the documented OPTIONS exception.
- The cautious range-cache wording is supported by [CloudFront range GET documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RangeGETs.html).

## Verification boundary

This was an independent full source-text read after recording the opening-based expectation, with official source checks and targeted inspection of linked teaching. It does not certify rendered heading semantics, figure appearance, keyboard operation, the sandbox, or deployed CDN behaviour. Root owns build and browser checks. No article, component or layout was changed during this recheck.
