---
layout: ../../../../layouts/ObjectArticle.astro
title: Access and private uploads
description: Follow a browser upload through application authorization, a presigned request, CORS and validation without confusing those separate checks.
---
An object key identifies bytes; it does not establish who may read or replace them. A private-upload design needs to answer two questions: which application user is allowed to perform this action, and which storage request is authorised to carry it out?

Amazon S3 knows AWS principals and policies. It does not automatically know that the person signed into your application owns account 17. Your backend connects those two worlds. We will follow that connection through a profile-photo upload, including the point where uploaded bytes become safe to publish.

## Who makes the request?

A server using an AWS role can send an authenticated PUT to S3. The role's permissions and the applicable resource policies determine whether the request is allowed. Applications normally use temporary role credentials rather than distribute a long-lived AWS secret to every browser.

For direct uploads, the browser first asks the backend for permission. The backend authenticates the application user, checks that they may change account 17, chooses an upload ID and staging key, and records the pending operation. It then produces a presigned request for that particular object operation.

The browser sends the bytes directly to S3 using the signed URL. This avoids making the application server relay the entire photograph. The backend still owns the decision to issue that authority and the later decision to publish the image.

<figure class="object-figure"><div class="flow"><div><strong>Browser → application</strong><span>“Upload my new photo”<br>Application checks account ownership</span></div><div><strong>Application → browser</strong><span>Assigned staging key<br>Short-lived signed PUT authority</span></div><div><strong>Browser → S3</strong><span>Bytes and signed request fields<br>S3 evaluates storage authorization</span></div></div><figcaption>The application's account check happens before signing. S3 receives the authority granted by the signer, not the user's application session.</figcaption></figure>

## Read, write and list are different permissions

A caller allowed to fetch one object need not be allowed to list its bucket. AWS Identity and Access Management (IAM) uses policies to describe permitted or denied actions on resources. In such a policy, `s3:GetObject` applies to object resources, while `s3:ListBucket` applies to the bucket. A prefix condition can constrain listing; it does not automatically constrain every object operation. Use object-resource scopes for the corresponding reads and writes.

For example, a service serving tenant t-4's images needs access to the relevant `tenants/t-4/` object resources. If a broadly privileged backend signs arbitrary keys supplied by users, a carefully private bucket still cannot repair the backend's missing tenant check. The [access-policy guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html) explains the relationship among principals, actions and resources.

An allow is not the whole evaluation. An applicable explicit deny can block the request, and cross-account or organisational controls add requirements. When debugging, identify the actual principal, action and resource before changing policies. S3 also has an older access mechanism: access control lists (ACLs), attached to individual buckets or objects to grant access. New buckets normally use Bucket owner enforced Object Ownership, disabling ACLs; copying an older `public-read` ACL example can therefore fail or introduce the wrong access model. See [Object Ownership](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html).

Keep Block Public Access enabled for this private workflow. It constrains public grants; it does not replace the account-level authorization decision in your application. The [Block Public Access guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html) describes the combination of bucket and higher-level settings.

## What a signed URL grants

A presigned URL is usable by whoever holds it, subject to the signer's permissions and the request's conditions. It is not a one-use ticket. A URL can be reused before expiry, and temporary credentials may expire before its configured lifetime ends. Do not put it in public logs or treat possession as proof of the application's current session.

The method and signed request fields must match. A URL signed for PUT is not a general-purpose grant to GET or DELETE the object. If a header participates in the signature, the browser must send the matching value. The [presigned URL guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) describes expiry and reuse.

If the upload needs a size range enforced by a form policy, S3's signed POST policy supports `content-length-range`. That is a POST-policy feature, not a field to copy into an ordinary presigned PUT request. A declared media type remains a declaration; validation still has to inspect the bytes. See [POST policy conditions](https://docs.aws.amazon.com/AmazonS3/latest/developerguide/sigv4-HTTPPOSTConstructPolicy.html).

## CORS controls the browser's participation

A browser page at `https://app.example` may need to send a cross-origin request to the S3 endpoint. Its preflight asks whether the origin, method and headers are allowed by the bucket's CORS configuration. A matching rule lets the browser proceed or expose the response as appropriate.

It does not grant object permission. A request can pass CORS and fail authorization; a valid signed request can work in a command-line client while the browser refuses it because CORS is missing. These are two distinct observations. Configure only the origins, methods and headers the upload needs, and expose response headers such as ETag if the browser must read them. [S3's CORS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html) explains this interaction.

The practical diagnostic order follows the actors. Did the backend authorise the intended account and key? Did it sign the fields actually sent? Did the browser complete the preflight? What did the actual S3 operation return? Removing storage protections to make a preflight pass addresses the wrong mechanism.

## Validation must refer to stable bytes

After the upload, the browser tells the backend it has finished. The backend or a worker checks the stored object's size, checksum where appropriate, actual file format and any application-specific content rules. Until then, the image stays pending and is not served as the account's published photo.

The reusable URL creates a race: after validation, its holder may upload different bytes to the same staging key. To close that gap, validation must bind to an exact revision. A versioned staging object can be inspected by version ID and copied from that same version to a fresh, protected delivery key. Alternatively, keep a version-specific reference through every subsequent read. Do not validate “whatever is current” and then publish an unversioned reference that can change.

The delivery key should be writable only by the promotion service. The original upload URL must not authorise replacing it. Record the validated source version and intended delivery key in the pending operation so that a retry knows exactly which copy it is completing.

Publish the delivery reference only after establishing that the copy completed. If the copy fails, leave the new photo pending and keep serving the previous one. If its reply is lost, inspect the intended destination and verify it against the recorded source before deciding whether to retry. If the copy succeeded but the database update failed, resume that same operation rather than validate whatever is now current at the staging key. Once the validated identity is published, retire staging data under an explicit cleanup policy. The [database-record article](/learn/databases/object-storage/database-records/) follows the pending, ready and retired states through crashes.

## Encryption adds a dependency

S3 encrypts new uploads at rest by default using SSE-S3 unless another supported configuration applies. Encryption at rest does not mean that all authenticated callers may read the object, and it does not replace TLS for transport. Bucket defaults guide new uploads; changing a default does not retroactively rewrite all existing objects. See [default encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html).

With SSE-KMS, the key service participates in the access path. A role permitted to read an S3 object can still fail because it lacks permission to decrypt using the associated KMS key. Upload and multipart operations have their own KMS permission requirements. That means a recovery copy with retained bytes is not useful if its key is unavailable to the recovery role. The [SSE-KMS guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html) gives those dependencies.

For this upload design, test the whole route with the actual role: sign, upload, verify, promote and read. The browser sandbox cannot validate IAM, signatures, CORS or KMS. Its [application lifecycle lesson](/learn/databases/object-storage/sandbox/?lesson=lifecycle) explores the separate publication decision; real authorization belongs in an explicitly configured service exercise.
