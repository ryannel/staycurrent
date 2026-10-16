---
layout: ../../../../layouts/ObjectArticle.astro
title: Try the requests against S3
description: Use a disposable, versioned general-purpose bucket to test a conditional write and recover a deleted object with the AWS CLI.
---
This worksheet sends real requests to Amazon S3 from a terminal on your computer. It complements the [browser model](/learn/databases/object-storage/sandbox/): the model makes state easy to inspect, while this exercise uses S3's actual responses and version IDs.

The command syntax and input shapes were checked locally with AWS CLI 2.34.51, using output skeletons where supported and a stubbed client for GET and caller identity. No hosted AWS run was performed for this article. The responses described below are documented expectations; your account permissions, bucket settings and client version affect the real run.

## Prepare the environment

Use a current AWS CLI v2 and an authenticated profile for a disposable learning account or suitably scoped role. You need a private **general-purpose bucket with versioning enabled**, owned by the account you intend to use. Create it in the AWS console, keep Block Public Access enabled and use ordinary SSE-S3 encryption for this exercise. Do not enable Object Lock or add lifecycle/replication rules as part of this worksheet.

After first enabling versioning, wait at least 15 minutes before these writes, as recommended in [the versioning setup guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/manage-versioning-examples.html). That configuration propagation interval is separate from the normal object consistency being tested.

Use a fresh empty local directory, Python 3 for generating the run ID, and a Bash or zsh terminal. Run the blocks one at a time and inspect each result; two requests deliberately return errors, so this is not an unattended script. Set these values to your actual profile, bucket and Region, then check the caller. All later commands run in this same terminal so the variables and local files remain available.

```bash
export AWS_PROFILE='your-learning-profile'
export AWS_REGION='your-bucket-region'
export AWS_PAGER=''
lab_bucket='your-disposable-bucket'
lab_owner=$(aws sts get-caller-identity --query Account --output text)
aws sts get-caller-identity
aws s3api get-bucket-versioning \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner"
```

Stop if the account or bucket is wrong or versioning does not report `Enabled`. The `expected-bucket-owner` check assumes this is a bucket owned by the displayed account. This is a small real-storage exercise and can incur charges.

The role needs `s3:GetBucketVersioning`, `s3:ListBucket` and `s3:ListBucketVersions` on the bucket, and `s3:PutObject`, `s3:GetObject`, `s3:GetObjectVersion`, `s3:DeleteObject` and `s3:DeleteObjectVersion` on the exercise objects. Scope object permissions to the practice prefix. Listing versions has its own [permission](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectVersions.html); ordinary listing permission also determines whether a missing-object GET reports 404 or 403. The [GET reference](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-object.html) explains that distinction. An applicable explicit deny can still block these operations.

Give this run a unique prefix so its cleanup cannot select another run's objects:

```bash
lab_run=$(python3 -c 'import uuid; print(uuid.uuid4())')
lab_key="staycurrent-practice/$lab_run/settings.json"
printf '%s\n' '{"limit":10,"revision":"r1"}' > settings-r1.json
printf '%s\n' '{"limit":20,"revision":"r2"}' > settings-r2.json
printf 'Profile: %s\nRegion: %s\nBucket: %s\nOwner: %s\nRun: %s\nKey: %s\n' \
  "$AWS_PROFILE" "$AWS_REGION" "$lab_bucket" "$lab_owner" "$lab_run" "$lab_key" \
  > run-info.txt
```

Keep `run-info.txt` until cleanup is complete. It records the run's location without storing credentials. Use this prefix only for this exercise and leave other writers out of it until the final optional experiment.

## Create and read one version

Create the key conditionally. Save its returned version ID, then read the object and save its ETag. A successful GET writes the body to the local output file while printing response metadata.

```bash
lab_v1=$(aws s3api put-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --body settings-r1.json \
  --content-type application/json --if-none-match '*' \
  --query VersionId --output text)
printf 'Version v1: %s\n' "$lab_v1"
```

Stop if the PUT failed or the version ID is empty, `None` or `null`. Those values do not establish a new version in the intended versioning-enabled bucket. Then read it:

```bash
lab_etag=$(aws s3api get-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" observed-r1.json --query ETag --output text)
cat observed-r1.json
```

The body should contain limit 10 and revision r1. If the GET failed, stop and diagnose it; do not continue using an empty ETag or a local file left by another request. Keep the quotes contained in the ETag value: the shell's `"$lab_etag"` passes that value as one argument. The [PutObject CLI reference](https://docs.aws.amazon.com/cli/latest/reference/s3api/put-object.html) defines the conditional options.

A timeout or lost connection does not prove that a write failed. If its outcome is uncertain, pause the sequence and use the version listing in the cleanup section, then version-specific GETs, to identify what this run stored. Repeating a request is not a substitute for establishing which version exists.

## Reject a stale writer

Use the saved ETag to publish r2, recording its version ID. Then repeat a write using the same old ETag. Predict the second result before sending it.

```bash
lab_v2=$(aws s3api put-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --body settings-r2.json --content-type application/json \
  --if-match "$lab_etag" --query VersionId --output text)
printf 'Version v2: %s\n' "$lab_v2"
```

Confirm that r2 succeeded and returned a version ID before attempting the deliberately stale write. If r2 failed, the old ETag might still match, so continuing would test a different schedule.

```bash
aws s3api put-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --body settings-r1.json --content-type application/json \
  --if-match "$lab_etag"
```

The second operation should fail with `PreconditionFailed` because the current content no longer has r1's ETag. An AccessDenied or connection error is a different result, not a successful conflict demonstration. Do not remove the condition to make the command succeed.

Fetch the current object again and inspect the body:

```bash
aws s3api get-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" observed-current.json
cat observed-current.json
```

It should still contain r2. This pair of observations establishes the intended effect: the stale request was rejected and did not replace the current object. The [concurrency article](/learn/databases/object-storage/consistency/) explains how an application decides whether to merge or rebuild after that conflict.

## Hide the key, then recover visibility

Delete without a version ID and record the marker's version ID. Try an ordinary GET, then explicitly fetch v1.

```bash
lab_marker=$(aws s3api delete-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --query VersionId --output text)
printf 'Delete marker: %s\n' "$lab_marker"
```

Confirm that deletion succeeded and returned a marker version ID before testing visibility. Then run the following GETs individually; the first is expected to fail:

```bash
aws s3api get-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" hidden.json

aws s3api get-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --version-id "$lab_v1" recovered-r1.json
cat recovered-r1.json
```

With the required permissions, the ordinary GET should report not found while the version-specific GET returns r1. The local output path is not evidence that a failed GET produced a valid new body; inspect successful responses and their intended files separately.

Remove the exact marker, then read the current key:

```bash
aws s3api delete-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --version-id "$lab_marker"
aws s3api get-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" visible-again.json
cat visible-again.json
```

The visible version is r2, not r1. Removing the marker restored the preceding current version. Selecting the good historical content is a separate recovery decision. See [version recovery](/learn/databases/object-storage/recovery/) for that distinction.

## Clean up this run

First list all versions under the unique run prefix and inspect them. This also finds unexpected versions if you repeated a successful PUT.

```bash
aws s3api list-object-versions \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --prefix "staycurrent-practice/$lab_run/"
```

For the unmodified sequence, the marker is already removed and v1/v2 remain. Delete those exact versions:

```bash
aws s3api delete-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --version-id "$lab_v1"
aws s3api delete-object \
  --bucket "$lab_bucket" --expected-bucket-owner "$lab_owner" \
  --key "$lab_key" --version-id "$lab_v2"
```

Repeat the listing. If you created extra versions or markers, remove only the exact key/version pairs belonging to this run, using the same version-specific command. Check both `Versions` and `DeleteMarkers`; a listing error does not establish that cleanup finished. An ordinary recursive delete of current keys does not empty a versioned bucket's history.

If the terminal state was lost, open `run-info.txt` and restore the profile, Region, bucket, owner, run ID and key variables from its recorded values. Set `AWS_PAGER=''` again and recheck the caller and bucket versioning. Do not generate a new run ID for cleanup: that would list a different prefix. List the recorded prefix to recover the exact version and marker IDs, then delete those pairs rather than guessing the old shell variables.

Once the run prefix contains no versions or markers, remove your local exercise files. Delete the disposable bucket through the console only after verifying that it contains no other work. The worksheet creates no multipart uploads, queues, replicas or keys that need separate cleanup.

For another experiment, start with a fresh run prefix. Try two terminal sessions that both read the same ETag before either writes. Keep their requests in a recorded order, then compare the actual responses with the [conditional-write lesson](/learn/databases/object-storage/sandbox/?lesson=conditions).
