# Object storage: operational evidence

Checked 16 October 2026 against AWS primary documentation. Scope: Amazon S3
general-purpose buckets, chiefly articles 6, 8, 9 and 11 in `plan.md`, with links
to delivery, publication and cost. These are documented guarantees and design
inferences, not observed AWS executions. No credentials, buckets or cloud resources
were used. Directory buckets and managed table/vector resources need their own
capability checks.

## Access and private uploads

### Start from policy-based ownership

New buckets default to Bucket owner enforced Object Ownership: ACLs are disabled
and the bucket owner owns uploaded objects. Uploads with no ACL or the
bucket-owner-full-control ACL are accepted; other ACLs fail with
`AccessControlListNotSupported`. Existing buckets may have different settings.
Teach policies first and inspect actual settings when diagnosing an older bucket.
Avoid copying a legacy public-read upload example into the main path.
[Object Ownership](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html)

Block Public Access applies across resource/account/organization settings; the
most restrictive applicable combination wins. It constrains public grants and
does not replace an application user's authorization decision. A bucket-level
change cannot necessarily remove a higher-level restriction. Article 11 should
diagnose the relevant principal, operation, resource and applicable controls
before recommending a policy change.
[Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)

**Article decision:** follow one authenticated application user requesting an upload
from the backend. The backend decides tenant and object identity before issuing
upload authority. Keep that decision distinct from S3 authenticating the request.
This is application design, not a claim that S3 knows the application's users.

### A presigned URL delegates a request

A presigned URL uses the signer's permissions and grants access to its holder.
It can be reused until expiry; it is not a single-use ticket. The configured
expiration cannot extend the underlying credential lifetime. Revoking or
deactivating credentials can invalidate it earlier, and policy conditions can
further restrict access. S3 checks expiry when the HTTP request begins: an ongoing
download can continue past expiry, while a restart after expiry fails. Signed
method, headers and query parameters must match the actual request.
[Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)

**Article decision:** use an application-assigned staging key and explicit pending,
uploaded, validated and published states. Treat the browser's completion message as
a prompt to inspect the uploaded object, not proof of its contents. Validation must
identify the exact version or promote validated bytes to a separately controlled
final key; otherwise a still-valid upload URL can permit replacement after checking.
This is the proposed protocol's reasoning, not an S3 validation feature.

A signed POST policy can constrain key/prefix and `content-length-range`, as well
as specified form fields. These are POST policy conditions; do not present that
syntax as a presigned PUT capability. A declared content type is a request field,
so the proposed application must still inspect untrusted bytes before publication.
[POST policy](https://docs.aws.amazon.com/AmazonS3/latest/developerguide/sigv4-HTTPPOSTConstructPolicy.html)

### CORS and encryption answer different questions

S3 matches a CORS preflight against origin, requested method and requested headers.
Its ACLs and policies still apply. CORS therefore cannot make an unauthorized
upload succeed or provide tenant authorization. Article 6 should show the browser,
backend and S3 as separate actors, including the preflight and actual request.
[CORS evaluation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)

New uploads receive SSE-S3 encryption by default unless another supported setting
applies. Changing bucket defaults does not change existing objects; explicit upload
encryption settings can override the default. A required encryption choice therefore
needs an appropriate policy as well as a default. SSE-KMS introduces KMS request
quotas and another authorization dependency.
[Default encryption configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html)

For SSE-KMS, `PutObject` requires `kms:GenerateDataKey`; a download requires
`kms:Decrypt`; multipart upload needs both. KMS keys must be in the bucket's Region.
AWS-managed KMS keys do not support cross-account sharing of those objects;
customer-managed keys are required for that use. Article 6 should explain one
S3-allowed/KMS-denied request rather than declaring that a bucket policy is the
complete access decision.
[SSE-KMS permissions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html)

Current documentation describes `UpdateObjectEncryption` for changing an existing
encrypted general-purpose-bucket object from SSE-S3 to SSE-KMS without copying its
data. Avoid the obsolete absolute claim that every encryption change requires a
copy. A complete migration procedure is outside this foundation article.
[Updating encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/update-sse-encryption.html)

**Practice opportunity:** trace a presigned upload and vary credential expiry,
request fields, CORS match and validation state in a labelled application model.
Do not display a successful model result as IAM, SigV4 or KMS validation. A real
browser exercise requires a real configured origin/bucket and separate permission
checks; it is outside this production run.

## Versions, retention and recovery

### Deletion and recovery must name the version

In a versioning-enabled bucket, a delete without a version ID creates a delete
marker. A subsequent ordinary GET returns 404 while previous data versions can
remain. A GET explicitly naming the marker returns 405. Removing the current marker
by its version ID exposes the preceding version; deleting again without that ID
adds another marker. Article 8 should draw the actual version stack before asking
the reader which operation recovers the object.
[Delete markers](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html),
[removing markers](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManagingDelMarkers.html)

Version-specific deletion permanently removes that version. Versioning does not
recover an already permanently deleted version. The article's recovery procedure
must distinguish restoring visibility from having retained the bytes at all.
[Versioning troubleshooting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/troubleshooting-versioning.html)

The first enablement of versioning can take up to 15 minutes to propagate. AWS
recommends waiting 15 minutes before writes; newly written objects may otherwise
produce transient 404s. The CLI worksheet must include this setup interval rather
than interpreting it as a contradiction of normal object consistency.
[Enabling versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/manage-versioning-examples.html)

### Object Lock protects versions, not the current-key view

Object Lock requires versioning and protects individual versions. It permits new
versions and delete markers above a protected version. Governance mode can be
bypassed with the specific permission and explicit bypass request header;
compliance retention cannot be shortened or bypassed by an account user, including
root. Legal holds remain until explicitly removed and are independent of retention
periods. Current documentation also describes variable retention using event holds,
so avoid asserting that every retention deadline is fixed at upload.
[Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)

Once enabled, Object Lock cannot be disabled and versioning cannot be suspended on
that bucket. Lifecycle can still place markers or transition protected versions,
but cannot permanently expire a locked version. Lock does not preserve access to
encryption keys: losing the key can leave retained bytes unreadable. A recovery
drill must include usable read permissions and key access.
[Object Lock considerations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html)

**Article decision:** demonstrate a protected version hidden by a marker, then
recover visibility. Keep legal compliance advice outside the article. Do not put
irreversible lock configuration in the default disposable CLI exercise; use a
labelled version-stack model for the mechanism and link the real configuration.

### Lifecycle is asynchronous policy execution

Current-version expiration in a versioning-enabled bucket ordinarily adds a marker
and makes the data version noncurrent. Removing noncurrent versions requires its
own action and permanently removes their recovery value. Existing old objects can
be eligible immediately after adding a rule. Lifecycle runs asynchronously; an
eligibility date is not a precise deletion completion time. A bucket-policy denial
does not prevent lifecycle deletions or transitions.
[Expiration behaviour](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html)

**Article decision:** show an accidental overwrite recovered before noncurrent
expiry, then repeat after permanent expiration. Separate the retention window,
storage bill and time at which the action actually executes. A teaching clock can
advance eligibility and execution independently, but must not imply an observed
AWS scheduling delay.

## Replication and recovery readiness

Live replication copies asynchronously and covers new/updated objects after the
configuration is established. Existing objects need Batch Replication. Copying
objects to another Region therefore does not make a successful source write proof
that the destination can already serve it.
[Replication overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html)

With current V2 rules, delete markers are not replicated by default; marker
replication can be enabled for non-tag-based rules. Lifecycle-created markers are
not replicated. Deleting a specific source version does not replicate that version
deletion to the destination. Do not summarize replication as mirroring every
mutation. The article needs to state which destination history its recovery
procedure expects.
[What is replicated](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html)

KMS-encrypted objects require explicit replication opt-in and suitable key
configuration/permissions. `PutBucketReplication` does not validate the supplied
KMS key: it can return 200 while later replication fails. This is an especially
useful example of configuration acceptance failing to establish the intended
operational outcome. Prefer this dedicated guide over the overview's compressed
description of encrypted-object replication.
[Encrypted-object replication](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-config-for-kms-objects.html)

Inspect object replication status (`PENDING`, `COMPLETED`, `FAILED`) and the actual
destination version. Temporary destination unavailability can remain pending;
permission failures can become failed. Repairing configuration alone is not a
demonstration that failed objects were copied: AWS documents re-upload or Batch
Replication for them. With multiple destinations, completed means all completed.
[Replication status](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-status.html)

AWS pages use two RTC percentages inconsistently in summary wording. The current
FAQ distinguishes the 99.99% design target from the SLA commitment of 99.9% within
15 minutes per replication Region pair over a billing month. Use that distinction
if quoting numbers, and never translate either into a per-object deadline or a
zero-loss failover guarantee. The dedicated RTC guide documents missed-threshold
events and workload/quota exclusions.
[S3 FAQ](https://aws.amazon.com/s3/faqs/),
[RTC details](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-time-control.html)

**Article decision:** recovery should enumerate the required generation, inspect
each required replica and exercise its reads before declaring it usable. Inference:
a copied manifest alone cannot establish that every referenced object is ready.
A model can make lag and a missing member visible; it cannot measure S3 replication
latency or prove an application recovery objective.

## Events and application workflows

S3 notifications are designed for at-least-once delivery. Typical delivery is
seconds, but it can take a minute or longer. They support several destinations;
direct S3 notification delivery to SQS FIFO is unsupported, with EventBridge a
documented route to FIFO. Writing derivatives back into a triggering location can
create a loop; use an appropriate source prefix or separate bucket.
[Event notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html)

Notifications can arrive out of order. For PUT/delete events, compare sequencers
only for the same object key, left-padding the shorter hexadecimal string before
comparison. A sequencer does not order different keys. Events include version
identity when applicable, and object keys are form-URL-encoded: `+` can represent a
space. The test notification has a different shape from normal `Records` messages.
[Event message structure](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-content-structure.html)

**Article decision:** distinguish processing every uploaded version from maintaining
only the latest derived view. The former needs stable version identity; the latter
also needs a rule preventing older work from replacing newer results. Demonstrate
a worker that writes its result then loses its acknowledgement, so delivery repeats.
The deduplication record must not declare work complete before the durable effect
it represents. Choosing an atomic boundary or an idempotent effect is application
design, not an exactly-once S3 guarantee.

**Practice opportunity:** enqueue two version events, reverse them, duplicate one,
and interrupt after result storage. Show the work ledger, output and latest pointer
separately. Add bounded failure handling and a repair/reconciliation path for an
unprocessed item. A deterministic lesson can teach those decisions without pretending
to execute SQS, Lambda or EventBridge. An actual queue deployment needs independent
delivery, visibility-timeout and redrive evidence beyond these S3 sources.

## Review handoff

The highest-value technical checks are the full upload-to-publication lifecycle,
exact-version recovery, destination readiness and duplicate/out-of-order worker
behaviour. Preserve the differences between byte retention, current visibility,
permission to read, and application completion. For the assembled articles, ask an
uncued reader to derive the next state before revealing it. The proposed browser
exercises should expose the same state changes and complete the same decision.

No live AWS behaviour, permissions, CORS configuration, replication lag or recovery
duration has been verified by this research. Before publication, recheck any SDK
syntax, resource-specific support and dates or numerical service claims added by
the authors. The source-specific evidence above is sufficient to commission the
mechanisms; it is not evidence that the eventual prose or executable lessons teach
them correctly.
