# Object-storage model review

Reviewed 16 October 2026. Scope: `src/lib/object-storage/model.mjs` and its focused
behavioural tests. This review checks local state transitions against the articles;
it does not validate AWS behaviour by executing AWS requests. The model is always
versioned and sequential. It uses local JSON teaching operations, text bodies and
deterministic model ETags, with no real IAM, network, retention or replication.

## Repairs

The original model silently ignored unsupported fields. A request such as DELETE
with a `version` field therefore created a marker instead of deleting the selected
version. A misspelled write condition silently became an unconditional write.
Operations now reject unsupported fields before changing state. Optional conditions,
metadata, version identities, boolean switches, multipart entries and rates receive
type and field checks. Invalid requests leave the entire state unchanged.

Several dictionary reads accidentally inherited JavaScript properties. Names such
as `toString` could behave as existing objects, upload sessions or application
records. Lookups now distinguish stored entries from inherited properties. Reserved
prototype-mutating names remain outside this teaching model's accepted syntax.

Event processing previously returned success for an already completed identity
before checking whether its bytes had changed. A repeated event now verifies its
output identity first. A stopped worker can resume after writing its output, and
reversed event delivery cannot replace a newer current pointer. Responses are
cloned before return so changing a displayed response cannot mutate model state.

The application workflow previously allowed abandonment only before validation.
That left verified but unpublished records outside the cleanup decision. Abandonment
now accepts pending or verified records; publication rejects abandoned records,
and abandonment rejects ready records. These are sequential schedules showing
which transition wins, not execution of a real database transaction or lock.

CACHE_GET now explicitly accepts only a current key and TTL. Previously an ignored
or inconsistently used version field could return a different cached revision from
the requested one. Version-specific reads remain available through GET. Adding a
version-aware cache is outside this model's stated cache lesson.

## Behaviour verified

`node --test src/lib/object-storage/model.test.mjs` passes 13 tests covering:

- Malformed requests, ignored-condition hazards and unchanged state after failure.
- Object, upload and record names that collide with inherited JavaScript properties.
- Stale ETag rejection, conditional creation and delete-marker treatment.
- Successful writes with lost replies, unsaved response variables and visible
  failures on subsequent conditional retries.
- Delete-marker reads/removal and permanent deletion of particular data versions.
- Multipart missing/wrong parts, order rejection, part replacement, intentional
  omission, conditional completion failure and abort.
- Lost completion replies: assembled bytes exist, the upload is consumed, and
  retrying the consumed upload does not create another object version.
- Cached bytes surviving origin overwrite/deletion until the model TTL expires.
- Exact validated-version publication, missing-version failure and both orders of
  abandonment versus publication.
- Event output identity, interrupted work, duplicates and reversed delivery order.
- Packed full-scan request counts, fractional retry expectations, retained copies,
  byte counts and illustrative cost arithmetic.
- Exact vector ranking after category filtering.

The tests exercise consequential transitions rather than assert every line of the
implementation. They are focused development verification; no package script was
added and no site build or commit ran in this review.

## UI and lesson requirements

The request reference should make strict local syntax visible. `DELETE_VERSION`
takes a version; DELETE does not. COMPLETE_UPLOAD accepts a list of `{part, etag}`
entries, not whole saved UPLOAD_PART response objects. Variables resolve through
strings such as `$part.etag`; that syntax is reserved by the local teaching parser.
`loseReply` and `stopAfterOutput` are booleans. Unknown price names produce errors
rather than quietly contributing zero.

Explain `verified` as still unpublished, so APP_ABANDON can win before ready. The
model pins a service-like version identity rather than copying or validating a real
image. It omits reader pins, garbage collection, content inspection and permissions.

The runner must serialize requests and prevent reset or lesson changes from racing
an in-flight async request. `execute` works from the state supplied by its caller;
two simultaneous calls with the same starting state do not coordinate with each
other. Disable conflicting controls or use a generation check when applying results.

The model cannot produce real concurrent S3 409 outcomes, multipart minimum sizes,
pagination, out-of-order network completion, SDK retries or embedded HTTP errors.
Its content-derived ETags are model tokens, not an S3 checksum implementation or a
revision counter. Its multipart limits are deliberately small. Small complete LIST
responses explicitly omit pagination and delimiter grouping.

The event body is already the derivative output; the model does not decode an
image, receive a real S3 record or run a queue. Sequence numbers are teaching inputs
for one key. The cost calculation assumes full repeated GETs and full-month retained
copies; it is neither measured traffic nor AWS error-response billing. All prices
remain supplied arithmetic inputs. Cache TTL and clock are local teaching state,
not CloudFront configuration.

Browser rendering and end-to-end lesson verification remain with the coordinator.
