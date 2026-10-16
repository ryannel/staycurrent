# Introduction and practice review

Reviewed 16 October 2026. Scope: the object-storage introduction and `practice.md`.
This was a bounded technical/editorial review, including local CLI syntax and
input-shape validation. No real AWS credentials, account calls or cloud resources
were used. Only those two pages and this record were edited.

## Findings and repairs

The introduction's account of keys, bytes, single-object replacement and coherent
publication agrees with the detailed articles. Its post-write GET sentence now
allows a later write or deletion to change the current state. The sandbox invitation
now says readers step through competing writes, accurately describing the model's
sequential schedules rather than implying real concurrent execution.

The worksheet's main path was sound, but several steps depended on invisible
successful outcomes. The first PUT, conditional r2 PUT and marker deletion now
display their captured version IDs and pause before the next experiment. In
particular, if r2 never succeeded, reusing r1's ETag would not be a stale-write
test. The worksheet distinguishes the expected conflict from access or transport
failures and explains how to investigate an uncertain write outcome.

Added Python 3 to the prerequisites and made block-by-block execution explicit.
The expected failed PUT and missing-object GET make an unattended script or a
shell's automatic stop-on-error behaviour inappropriate for simply pasting the
whole worksheet. ETag quoting remains intact through command substitution and
the quoted shell argument.

The permission discussion now names bucket and object actions, including the
distinct version-listing permission and the listing permission that affects
missing-object 404/403 behaviour. The account-owner guard, SSE-S3 scope, Block
Public Access, first-versioning propagation wait and exclusion of Object Lock,
lifecycle and replication remain in place.

Cleanup formerly assumed the run prefix survived a lost terminal session. Each
run now records its profile name, Region, bucket, owner, run ID and key in a local
text file without credentials. Recovery instructions restore that location before
listing exact version/marker pairs. They explicitly avoid generating a new run ID
for cleanup. The final inspection checks both Versions and DeleteMarkers, and a
failed listing is not treated as proof of emptiness.

## Local CLI verification

Installed CLI: `aws-cli/2.34.51`, Python 3.14.5, Darwin arm64.

Six command variants passed local `--generate-cli-skeleton output` checks:
GetBucketVersioning, conditional PutObject with each condition, DeleteObject with
and without a version ID, and ListObjectVersions. They used fake bucket/account
identities, temporary input files, `--no-sign-request`, empty configuration and
credential-file paths, and disabled metadata credential discovery.

The streaming GetObject CLI command rejects `--generate-cli-skeleton`. The STS
GetCallerIdentity output skeleton also fails in this installation because its
generated sample ARN is shorter than the service model allows. Those are limits
of this validation route, not evidence of a failed article command.

For those commands, the installed CLI parser was invoked with its client API call
stubbed locally. DNS and socket connection functions were blocked, configuration
and credential files were disabled, and only placeholder values were supplied.
The stub checked the parsed parameters against the installed service input shape.
Both caller-identity forms and the ordinary/version-specific GET forms passed.
This verifies argument parsing and input shapes; it does not test streaming output
or an actual response from STS or S3. Placeholder response metadata was generated
locally solely to let the parser path finish.

All 12 shell blocks also pass Bash and zsh syntax checks with `-n`; those checks
execute no worksheet commands. Temporary validation files were removed.

## Primary evidence and limits

- [Enabling versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/manage-versioning-examples.html): the first-enable propagation interval and recommendation to wait before writes.
- [GetObject CLI reference](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-object.html): ordinary/version-specific reads, positional output file, required read permissions and missing-object responses.
- [PutObject CLI reference](https://docs.aws.amazon.com/cli/latest/reference/s3api/put-object.html): conditional write arguments and expected conflict behaviour, alongside the collection's prior conditional-write evidence.
- [ListObjectVersions API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectVersions.html): version-listing permission, prefix selection, owner guard and version/marker records.

A continuous reread confirms that the worksheet progresses from one stored version
through a rejected stale write, marker visibility and exact cleanup. Actual
account policies, configuration propagation, service responses and cleanup remain
documented expectations for the reader's run. The article states that limit.
No site build or commit ran in this review; the coordinator owns final rendering
and build verification.
