import test from "node:test";
import assert from "node:assert/strict";
import { emptyState, execute } from "./model.mjs";

function client() {
  let state = emptyState();
  return {
    get state() {
      return state;
    },
    async run(request) {
      const result = await execute(state, request);
      state = result.state;
      return result.response;
    },
  };
}

test("malformed or unsupported requests preserve all existing state", async () => {
  const c = client();
  await c.run({ op: "PUT", key: "report", body: "good" });
  const before = structuredClone(c.state);
  for (const request of [
    { op: "DELETE", key: "report", version: "v1" },
    { op: "PUT", key: "report", body: "bad", ifMacth: "old" },
    { op: "PUT", key: "report", body: "bad", metadata: null },
    { op: "PUT", key: "report", body: "bad", ifMatch: 1 },
    { op: "PUT", key: "report", body: "bad", loseReply: "false" },
    { op: "PUT", key: "report", body: "bad", saveAs: "__proto__" },
    { op: "GET", key: "report", version: "" },
    { op: "CACHE_GET", key: "report", version: "v1" },
    JSON.parse('{"op":"PUT","key":"bad","body":"x","__proto__":{}}'),
  ]) {
    assert.equal((await c.run(request)).status, 400);
    assert.deepEqual(c.state, before);
  }
});

test("ordinary names matching inherited properties are ordinary keys and IDs", async () => {
  const c = client();
  assert.equal((await c.run({ op: "GET", key: "toString" })).status, 404);
  assert.equal(
    (await c.run({ op: "UPLOAD_PART", upload: "toString", part: 1, body: "x" }))
      .status,
    404,
  );
  assert.equal(
    (await c.run({ op: "APP_CREATE", id: "toString", key: "toString" })).status,
    201,
  );
  assert.equal(
    (await c.run({ op: "PUT", key: "toString", body: "hello" })).status,
    200,
  );
  assert.equal(
    (await c.run({ op: "CACHE_GET", key: "toString" })).body,
    "hello",
  );
  assert.equal(
    (await c.run({ op: "APP_VALIDATE", id: "toString" })).status,
    200,
  );
  const marker = await c.run({ op: "DELETE", key: "hasOwnProperty" });
  await c.run({
    op: "DELETE_VERSION",
    key: "hasOwnProperty",
    version: marker.version,
  });
  assert.equal(Object.hasOwn(c.state.objects, "hasOwnProperty"), false);
});

test("conditional writes reject stale state and treat a marker as absent", async () => {
  const c = client();
  const first = await c.run({
    op: "PUT",
    key: "p",
    body: "one",
    saveAs: "first",
  });
  await c.run({ op: "PUT", key: "p", body: "two", ifMatch: "$first.etag" });
  const before = structuredClone(c.state.objects);
  assert.equal(
    (await c.run({ op: "PUT", key: "p", body: "lost", ifMatch: first.etag }))
      .status,
    412,
  );
  assert.equal(
    (await c.run({ op: "PUT", key: "p", body: "lost", ifNoneMatch: "*" }))
      .status,
    412,
  );
  assert.deepEqual(c.state.objects, before);
  await c.run({ op: "DELETE", key: "p" });
  assert.equal(
    (await c.run({ op: "PUT", key: "p", body: "lost", ifMatch: first.etag }))
      .status,
    404,
  );
  assert.equal(
    (await c.run({ op: "PUT", key: "p", body: "new", ifNoneMatch: "*" }))
      .status,
    200,
  );
});

test("a lost successful reply changes state but does not save a response", async () => {
  const c = client();
  const response = await c.run({
    op: "PUT",
    key: "p",
    body: "published",
    ifNoneMatch: "*",
    loseReply: true,
    saveAs: "lost",
  });
  assert.equal(response.status, "unknown");
  assert.equal(Object.hasOwn(c.state.variables, "lost"), false);
  assert.equal((await c.run({ op: "GET", key: "p" })).body, "published");
  assert.equal(
    (
      await c.run({
        op: "PUT",
        key: "p",
        body: "published",
        ifNoneMatch: "*",
        loseReply: true,
      })
    ).status,
    412,
  );
});

test("version-specific deletion reveals history and permanently removes selected bytes", async () => {
  const c = client();
  const good = await c.run({ op: "PUT", key: "p", body: "good" });
  const bad = await c.run({ op: "PUT", key: "p", body: "bad" });
  const marker = await c.run({ op: "DELETE", key: "p" });
  assert.equal((await c.run({ op: "GET", key: "p" })).status, 404);
  assert.equal(
    (await c.run({ op: "GET", key: "p", version: marker.version })).status,
    405,
  );
  assert.equal(
    (await c.run({ op: "GET", key: "p", version: good.version })).body,
    "good",
  );
  await c.run({ op: "DELETE_VERSION", key: "p", version: marker.version });
  assert.equal((await c.run({ op: "GET", key: "p" })).body, "bad");
  await c.run({ op: "DELETE_VERSION", key: "p", version: good.version });
  await c.run({ op: "DELETE_VERSION", key: "p", version: bad.version });
  assert.equal(
    (await c.run({ op: "GET", key: "p", version: good.version })).status,
    404,
  );
  assert.deepEqual((await c.run({ op: "LIST" })).objects, []);
});

test("multipart validates the selected parts and assembles only those named", async () => {
  const c = client();
  const { upload } = await c.run({ op: "CREATE_UPLOAD", key: "movie" });
  const one = await c.run({ op: "UPLOAD_PART", upload, part: 1, body: "A" });
  const two = await c.run({ op: "UPLOAD_PART", upload, part: 2, body: "B" });
  assert.equal((await c.run({ op: "GET", key: "movie" })).status, 404);
  assert.equal(
    (await c.run({ op: "COMPLETE_UPLOAD", upload, parts: [null] })).status,
    400,
  );
  assert.equal(
    (
      await c.run({
        op: "COMPLETE_UPLOAD",
        upload,
        parts: [{ part: 3, etag: one.etag }],
      })
    ).error,
    "InvalidPart",
  );
  assert.equal(
    (
      await c.run({
        op: "COMPLETE_UPLOAD",
        upload,
        parts: [two, one].map(({ part, etag }) => ({ part, etag })),
      })
    ).error,
    "InvalidPartOrder",
  );
  assert.equal(
    (
      await c.run({
        op: "COMPLETE_UPLOAD",
        upload,
        parts: [{ part: 1, etag: "wrong" }],
      })
    ).error,
    "InvalidPart",
  );
  assert.equal(
    (
      await c.run({
        op: "COMPLETE_UPLOAD",
        upload,
        parts: [{ part: 1, etag: one.etag }],
      })
    ).status,
    200,
  );
  assert.equal((await c.run({ op: "GET", key: "movie" })).body, "A");
  assert.equal(
    (await c.run({ op: "ABORT_UPLOAD", upload })).error,
    "NoSuchUpload",
  );
});

test("multipart retry replaces a part; conditional failure retains unfinished work", async () => {
  const c = client();
  await c.run({ op: "PUT", key: "movie", body: "existing" });
  const { upload } = await c.run({ op: "CREATE_UPLOAD", key: "movie" });
  await c.run({ op: "UPLOAD_PART", upload, part: 1, body: "wrong" });
  const { etag } = await c.run({
    op: "UPLOAD_PART",
    upload,
    part: 1,
    body: "fixed",
  });
  assert.equal(
    (
      await c.run({
        op: "COMPLETE_UPLOAD",
        upload,
        parts: [{ part: 1, etag }],
        ifNoneMatch: "*",
      })
    ).status,
    412,
  );
  assert.ok(c.state.uploads[upload]);
  assert.equal((await c.run({ op: "ABORT_UPLOAD", upload })).status, 204);
  assert.equal((await c.run({ op: "GET", key: "movie" })).body, "existing");
  assert.equal(
    (await c.run({ op: "UPLOAD_PART", upload, part: 1, body: "late" })).error,
    "NoSuchUpload",
  );
});

test("lost multipart completion reply leaves one complete object and consumes the upload", async () => {
  const c = client();
  const { upload } = await c.run({ op: "CREATE_UPLOAD", key: "movie" });
  const first = await c.run({
    op: "UPLOAD_PART",
    upload,
    part: 1,
    body: "first",
  });
  const second = await c.run({
    op: "UPLOAD_PART",
    upload,
    part: 2,
    body: "second",
  });
  const request = {
    op: "COMPLETE_UPLOAD",
    upload,
    parts: [
      { part: 1, etag: first.etag },
      { part: 2, etag: second.etag },
    ],
    ifNoneMatch: "*",
    loseReply: true,
  };
  assert.equal((await c.run(request)).status, "unknown");
  assert.equal((await c.run({ op: "GET", key: "movie" })).body, "firstsecond");
  assert.equal((await c.run(request)).error, "NoSuchUpload");
  assert.equal(c.state.objects.movie.length, 1);
});

test("cached bytes persist through overwrite and deletion until their expiry", async () => {
  const c = client();
  await c.run({ op: "PUT", key: "p", body: "blue" });
  assert.equal(
    (await c.run({ op: "CACHE_GET", key: "p", ttl: 10 })).servedBy,
    "origin model",
  );
  await c.run({ op: "PUT", key: "p", body: "green" });
  assert.equal((await c.run({ op: "GET", key: "p" })).body, "green");
  assert.equal((await c.run({ op: "CACHE_GET", key: "p" })).body, "blue");
  await c.run({ op: "DELETE", key: "p" });
  assert.equal((await c.run({ op: "CACHE_GET", key: "p" })).body, "blue");
  await c.run({ op: "TICK", seconds: 10 });
  assert.equal((await c.run({ op: "CACHE_GET", key: "p" })).status, 404);
});

test("publication pins validated bytes and abandonment can win before ready", async () => {
  const c = client();
  await c.run({ op: "APP_CREATE", id: "a", key: "photo" });
  assert.equal(
    (await c.run({ op: "APP_VALIDATE", id: "a" })).error,
    "MissingBytes",
  );
  const first = await c.run({ op: "PUT", key: "photo", body: "validated" });
  await c.run({ op: "APP_VALIDATE", id: "a" });
  await c.run({ op: "PUT", key: "photo", body: "replacement" });
  const ready = await c.run({ op: "APP_PUBLISH", id: "a" });
  assert.equal(ready.record.version, first.version);
  assert.equal((await c.run({ op: "APP_ABANDON", id: "a" })).status, 409);
  await c.run({ op: "APP_CREATE", id: "b", key: "photo" });
  await c.run({ op: "APP_VALIDATE", id: "b" });
  assert.equal((await c.run({ op: "APP_ABANDON", id: "b" })).status, 200);
  assert.equal((await c.run({ op: "APP_PUBLISH", id: "b" })).status, 409);
  await c.run({ op: "APP_CREATE", id: "c", key: "photo" });
  const validated = await c.run({ op: "APP_VALIDATE", id: "c" });
  await c.run({
    op: "DELETE_VERSION",
    key: "photo",
    version: validated.record.version,
  });
  assert.equal(
    (await c.run({ op: "APP_PUBLISH", id: "c" })).error,
    "MissingVersion",
  );
});

test("event retries verify identity, finish interrupted work and preserve latest order", async () => {
  const c = client();
  const event = {
    op: "PROCESS_EVENT",
    key: "photo",
    sequence: 2,
    body: "thumb2",
  };
  assert.equal((await c.run({ ...event, stopAfterOutput: true })).status, 202);
  assert.deepEqual(c.state.jobs, {});
  assert.deepEqual(c.state.latest, {});
  assert.equal(
    (await c.run({ ...event, body: "different" })).error,
    "IdentityMismatch",
  );
  assert.equal((await c.run(event)).duplicate, false);
  await c.run({ ...event, sequence: 1, body: "thumb1" });
  assert.equal(c.state.latest.photo.sequence, 2);
  assert.equal((await c.run(event)).duplicate, true);
  assert.equal(
    (await c.run({ ...event, body: "different" })).error,
    "IdentityMismatch",
  );
  const response = await c.run(event);
  response.latest.sequence = 999;
  assert.equal(c.state.latest.photo.sequence, 2);
});

test("cost separates packing, full repeated scans and retained copies", async () => {
  const c = client();
  const input = {
    op: "COST",
    records: 1000000,
    bytesPerRecord: 1000,
    recordsPerObject: 1000,
    scans: 2,
    copies: 3,
    retryFraction: 0.5,
    rates: { getPer1000: 1, storagePerGBMonth: 2, transferPerGB: 3 },
  };
  const result = await c.run(input);
  assert.equal(result.objects, 1000);
  assert.equal(result.expectedGETs, 3000);
  assert.equal(result.storedGB, 3);
  assert.equal(result.transferredGB, 3);
  assert.equal(result.illustrativeMonthlyUnits, 18);
  const loose = await c.run({ ...input, recordsPerObject: 1 });
  assert.equal(loose.expectedGETs, 3000000);
  assert.equal(loose.transferredGB, result.transferredGB);
  assert.equal((await c.run({ ...input, records: 1001 })).objects, 2);
  assert.equal((await c.run({ ...input, rates: [] })).status, 400);
  assert.equal(
    (await c.run({ ...input, rates: { storagePerGb: 2 } })).status,
    400,
  );
});

test("vector filtering precedes exact ranking and top-k", async () => {
  const c = client();
  const result = await c.run({
    op: "VECTOR_QUERY",
    query: [1, 0],
    category: "storage",
    topK: 1,
  });
  assert.deepEqual(
    result.results.map((row) => row.key),
    ["B"],
  );
  assert.deepEqual(
    result.candidates.map((row) => row.key),
    ["B", "C"],
  );
  assert.equal(
    (await c.run({ op: "VECTOR_QUERY", query: [1, NaN] })).status,
    400,
  );
});
