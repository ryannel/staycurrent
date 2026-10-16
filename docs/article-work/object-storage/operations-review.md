# Operations article review and repair

Reviewed 16 October 2026. Scope: `access.md`, `delivery.md`, `recovery.md`,
`events.md` and `performance-and-cost.md`. This was an informed technical and
editorial review using current AWS primary documentation, followed by repairs and
a continuous reread. It was not an uncued reader pass or a rendered-media review.
Only those five articles and this record were edited in this pass.

The drafts already explained the principal boundaries well: application users
versus AWS principals, cached responses versus origin reads, retained versions
versus a recovered application, and notifications versus completed work. The
repairs complete decisions inside those explanations rather than add more topics.

## Findings and repairs

| Finding | Repair and consequence |
| --- | --- |
| Validation selected stable source bytes, but the promotion copy's failure boundary was implicit. | The pending operation now retains the validated source version and delivery key. Publication follows confirmed copy completion; lost replies require destination verification, and a failed database update resumes the same operation. |
| Private origin access and viewer access were separated, but cached private bytes lacked a concrete authorization path. | Alice warms the cache; Bob must still satisfy signed viewer access. Added signature/policy evaluation before cache lookup, the regular S3 origin scope of OAC, and request-start expiry behaviour for ongoing downloads and later range requests. |
| The TTL citation led to a general overview. | Replaced it with the policy reference that explicitly documents positive minimum TTL overriding `no-cache`, `no-store` and `private`. |
| Recovery copied v1 over v2, then the next diagram silently returned to a history without that copy. | Explicitly resets the second example to pre-recovery state and identifies illustrative version labels. The simple recovery pauses the writer so a valid concurrent report is not displaced. |
| Replication deletion behaviour was too compressed to support an actual recovery decision. | Added a table scoped to current V2 rules: disabled/enabled marker replication, explicit version deletion, and lifecycle markers. Preserved asynchronous progress and the need to verify a whole destination generation. |
| An existing derivative could be mistaken for completed work solely because conditional creation failed. | A 412 now triggers verification of source/transform identity and expected content. Output existence and current-pointer publication remain separate milestones, including on retries. |
| Sequencer comparison deferred the useful step entirely to documentation. | Added the concrete `f` versus `10` padding example, retaining the same-key-only scope and distinction from version IDs. |
| Monthly storage arithmetic omitted its time assumption, and version-size wording implied unspecified compression effects. | States a full month of storage, exact equal-sized version arithmetic and full-version billing. Rates remain invented inputs. |
| Small-object lifecycle restrictions and archive restoration stayed abstract. | Applies the post-September-2024 default threshold to the article's 1 KB records and 1 MB packed objects. Distinguishes temporary Glacier restored copies from Intelligent-Tiering's move back to Frequent Access. |

No broad current-price, SDK retry or measured-throughput guarantee was introduced.
The 50 ms example remains illustrative arithmetic. The event example now names
its queue-worker assumption; it does not generalise acknowledgment mechanics to
every notification destination.

## Evidence checked

The earlier access, encryption, retention and notification research remains in
`operations-evidence.md`. This review additionally opened and checked:

- [CloudFront cache policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-key-understand-cache-policy.html), [S3 origin access](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html), and [signed URLs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html): TTLs, OAC scope, viewer validation order and expiry.
- [Replication scope](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html): the deletion table and older-rule distinction.
- [Event structure](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-content-structure.html): source version, form-encoded key and sequencer comparison.
- [Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html), [archive restoration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html), and [lifecycle transitions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html): full-version billing, distinct restore workflows and configuration-dependent small-object defaults.
- [Performance patterns](https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html), [performance guidelines](https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-guidelines.html), and [pricing](https://aws.amazon.com/s3/pricing/): retained workload-dependent guidance and links, without copying a current price into the model.

Promotion recovery, output verification and publication coordination are application
design reasoning. No AWS requests or deployment configurations were executed.

## Continuous reread and integration

Access still follows one photo from account authorization to stable publication.
Delivery moves from the blue/green cache example through immutable references to
private delivery; its viewer check does not imply that S3 sees each cache hit.
Recovery now has a consistent version history and makes ordinary visibility
distinct from retained bytes. Events follows source identity through output,
publication and reconciliation without allowing a completion flag to erase an
unfinished publication. Cost returns to the same record-packing example when
explaining lifecycle, keeping the practical choice connected to the calculation.

The added version-lesson sentence explicitly excludes real retention enforcement
and replication. Existing IAM/CORS/KMS, CloudFront and production-latency exclusions
remain visible in the relevant articles. No required source-level technical or
prose-flow repair remains from this pass.

The coordinator must still verify these promised lesson behaviours:

- `lifecycle`: pending upload/publication state, with no claim to validate actual
  IAM, signatures, CORS or KMS.
- `cache`: origin overwrite while an old cached value remains, then clock-driven
  refetch. No real browser cache or CloudFront propagation is implied.
- `versions`: inspect data versions and marker, remove a marker, permanently
  delete a data version and observe the resulting history.
- `events`: deliver two before one and repeat two; inspect derivative outputs,
  completed-job ledger and current pointer. Teaching sequence numbers remain
  distinct from actual S3 sequencers; no real queue runs in the model.
- `cost`: change packing, scans, retries and retained copies, inspect request/byte
  counts, and use explicit illustrative or user-supplied prices. The model's
  request arithmetic must not be presented as an actual AWS bill.

The recovery article also relies on the practice worksheet keeping ordinary
versioning separate from enabling Object Lock. These are integration dependencies,
not observed passes. Browser inspection, internal route verification, uncued
reading and the build remain with the coordinator. No build or commit ran here.

## Vocabulary follow-up after independent reading

On 16 October 2026, added short explanations at the consequential first uses of
tail latency, backoff, jitter and latency percentiles in performance/cost. The
retry paragraph now explains both why waits increase and why clients vary them.
The measurement paragraph uses p99 to connect percentiles to slow requests that
an average can hide. Added a brief Availability Zone definition before the S3
resource comparison, checked against the [AWS infrastructure overview](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/global-infrastructure.html).

Access now expands IAM through its policy role and introduces ACLs as the older
bucket/object access-list mechanism, retaining the distinction between policy
evaluation and disabled ACLs under Bucket owner enforced ownership.

Reread the surrounding latency/concurrency, retry, measurement, placement and
access-policy sections. Each explanation remains attached to its engineering
choice; no separate glossary or repeated definitions were added. No new SDK,
performance or placement guarantee is implied. Tables and Vectors were outside
this follow-up's edit scope.

Confirmed the current practice source already names Python 3, prints the captured
v1/v2/marker IDs and tells readers to stop after a failed or missing capture. Those
initial-snapshot concerns were repaired in the earlier worksheet review, so the
worksheet was not rewritten. No build or commit ran in this follow-up.
