# Core evidence

Checked 16 October 2026. All service claims are documented, not observations of
hosted AWS execution. Invented keys, revisions, request schedules and byte counts
are teaching examples. Browser execution will verify only the implemented model.

- S3 Welcome consistency section: object-level atomic replacement and strong reads;
  no cross-key transaction, configuration propagation separate.
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel
- Object keys: general-purpose flat names, UTF-8 bytes, prefix and delimiter.
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
- ListObjectsV2: 1,000 max, continuation tokens, general-purpose lexical order versus
  directory unordered listing. Multi-request snapshot inference is not promised.
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
- Conditional writes: 412 condition failure, current delete marker counts absent for
  If-None-Match; absent If-Match is404; concurrent delete may give409; multipart409
  requires reinitiation. Model handles deterministic conditions, not real races.
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html
- Multipart process and completion: part identity and ETag, completion ordering,
  unfinished charges, abort and in-flight caveat; embedded error after HTTP200.
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html
- GetObject: ranges and version identity. Byte ranges alone are not row filtering.
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html
- Performance patterns and guidelines: client concurrency, range fetches, measured
  retry/backoff and503, placement; no universal key randomisation requirement.
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-guidelines.html

The generation-manifest and pending-image protocols are design inferences built
from these contracts. They need the application's immutability, ownership and
retention rules; S3 does not validate references. Tiny checksums/ETags in a model
must never be presented as the service's exact generated identifiers.

Writing reference revisited: Sam Who's Load Balancing opening through round-robin
variation, https://samwho.dev/load-balancing/. It illustrates keeping a changed
condition and its consequence visible, rather than supplying an article template.
