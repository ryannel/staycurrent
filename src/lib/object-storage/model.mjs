// Deliberately bounded teaching model. No network requests or AWS credentials.
export const operations = [
  "PUT",
  "GET",
  "LIST",
  "DELETE",
  "DELETE_VERSION",
  "CREATE_UPLOAD",
  "UPLOAD_PART",
  "COMPLETE_UPLOAD",
  "ABORT_UPLOAD",
  "CACHE_GET",
  "TICK",
  "APP_CREATE",
  "APP_VALIDATE",
  "APP_PUBLISH",
  "APP_ABANDON",
  "PROCESS_EVENT",
  "COST",
  "VECTOR_QUERY",
];
export function emptyState() {
  return {
    objects: {},
    uploads: {},
    records: {},
    cache: {},
    outputs: {},
    jobs: {},
    latest: {},
    variables: {},
    clock: 0,
    serial: 0,
  };
}
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const entry = (o, k) => (own(o, k) ? o[k] : undefined);
const fields = {
  PUT: ["key", "body", "metadata", "ifMatch", "ifNoneMatch"],
  GET: ["key", "version"],
  LIST: ["prefix"],
  DELETE: ["key"],
  DELETE_VERSION: ["key", "version"],
  CREATE_UPLOAD: ["key"],
  UPLOAD_PART: ["upload", "part", "body"],
  COMPLETE_UPLOAD: ["upload", "parts", "metadata", "ifMatch", "ifNoneMatch"],
  ABORT_UPLOAD: ["upload"],
  CACHE_GET: ["key", "ttl"],
  TICK: ["seconds"],
  APP_CREATE: ["id", "key"],
  APP_VALIDATE: ["id"],
  APP_PUBLISH: ["id"],
  APP_ABANDON: ["id"],
  PROCESS_EVENT: ["key", "sequence", "body", "stopAfterOutput"],
  COST: [
    "records",
    "bytesPerRecord",
    "recordsPerObject",
    "scans",
    "copies",
    "retryFraction",
    "rates",
  ],
  VECTOR_QUERY: ["query", "topK", "category"],
};
function object(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${field} must be a JSON object.`);
  return value;
}
function validateRequest(r) {
  const allowed = ["op", "saveAs", "loseReply", ...fields[r.op]];
  for (const field of Object.keys(r))
    if (!allowed.includes(field))
      throw new Error(`${field} is not supported by ${r.op} in this model.`);
  for (const field of ["loseReply", "stopAfterOutput"])
    if (r[field] !== undefined && typeof r[field] !== "boolean")
      throw new Error(`${field} must be true or false.`);
  for (const field of ["version", "ifMatch"])
    if (r[field] !== undefined) required(r[field], field);
  if (r.metadata !== undefined) object(r.metadata, "metadata");
  if (r.category !== undefined) required(r.category, "category");
  if (r.rates !== undefined) {
    object(r.rates, "rates");
    for (const field of Object.keys(r.rates))
      if (!["getPer1000", "storagePerGBMonth", "transferPerGB"].includes(field))
        throw new Error(`Unknown rate: ${field}.`);
  }
}
function required(value, name) {
  if (typeof value !== "string" || !value.length || value.length > 16000)
    throw new Error(
      `${name} must be a nonempty string of at most 16,000 characters.`,
    );
  return value;
}
function name(value, field = "key") {
  required(value, field);
  if (["__proto__", "constructor", "prototype"].includes(value))
    throw new Error(`Choose another ${field}.`);
  return value;
}
function number(value, field, min = 0, max = 1e12) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  )
    throw new Error(`${field} must be a finite number from ${min} to ${max}.`);
  return value;
}
function integer(value, field, min = 0, max = 10000) {
  number(value, field, min, max);
  if (!Number.isInteger(value))
    throw new Error(`${field} must be a whole number.`);
  return value;
}
async function etag(body) {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body),
  );
  return (
    '"model-' +
    Array.from(new Uint8Array(hash))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("") +
    '"'
  );
}
function current(s, key) {
  return own(s.objects, key) ? s.objects[key][0] : undefined;
}
function resolve(value, variables) {
  if (
    typeof value === "string" &&
    /^\$[a-zA-Z][\w-]*(?:\.[\w-]+)*$/.test(value)
  ) {
    const parts = value.slice(1).split(".");
    let v = variables;
    for (const part of parts) {
      if (!v || !own(v, part))
        throw new Error(
          `No saved response at ${value}. Run the earlier request first.`,
        );
      v = v[part];
    }
    return structuredClone(v);
  }
  if (Array.isArray(value)) return value.map((v) => resolve(v, variables));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      name(k, "field");
      out[k] = resolve(v, variables);
    }
    return out;
  }
  return value;
}
function get(s, r) {
  name(r.key);
  const versions = entry(s.objects, r.key) || [];
  const v = r.version
    ? versions.find((v) => v.version === r.version)
    : versions[0];
  if (!v)
    return {
      status: 404,
      error: "NoSuchKey",
      message: "No readable object at this identity.",
    };
  if (v.deleted)
    return {
      status: r.version ? 405 : 404,
      error: "DeleteMarker",
      message: "This version is a delete marker, not object bytes.",
    };
  return { status: 200, key: r.key, ...structuredClone(v) };
}
async function put(s, r) {
  name(r.key);
  if (typeof r.body !== "string" || r.body.length > 16000)
    throw new Error("body must be text of at most 16,000 characters.");
  if (r.ifMatch !== undefined && r.ifNoneMatch !== undefined)
    throw new Error("Use one write condition in this model.");
  const old = current(s, r.key);
  const exists = old && !old.deleted;
  if (r.ifNoneMatch !== undefined && r.ifNoneMatch !== "*")
    throw new Error('ifNoneMatch supports only "*".');
  if (r.ifNoneMatch === "*" && exists)
    return {
      status: 412,
      error: "PreconditionFailed",
      message: "A current object already exists. Nothing was written.",
    };
  if (r.ifMatch !== undefined && !exists)
    return {
      status: 404,
      error: "NoSuchKey",
      message: "If-Match needs a current object.",
    };
  if (r.ifMatch !== undefined && r.ifMatch !== old.etag)
    return {
      status: 412,
      error: "PreconditionFailed",
      message: "The current ETag differs. Re-read and reconsider the body.",
    };
  if (!own(s.objects, r.key) && Object.keys(s.objects).length >= 60)
    throw new Error(
      "This teaching bucket holds at most 60 keys. Reset to start again.",
    );
  const v = {
    version: `v${++s.serial}`,
    etag: await etag(r.body),
    body: r.body,
    bytes: new TextEncoder().encode(r.body).length,
    metadata: r.metadata || {},
    deleted: false,
  };
  if (
    !v.metadata ||
    typeof v.metadata !== "object" ||
    Array.isArray(v.metadata)
  )
    throw new Error("metadata must be a JSON object.");
  if ((entry(s.objects, r.key) || []).length >= 60)
    throw new Error("This model retains at most 60 versions per key.");
  s.objects[r.key] = [v, ...(entry(s.objects, r.key) || [])];
  return {
    status: 200,
    key: r.key,
    version: v.version,
    etag: v.etag,
    bytes: v.bytes,
  };
}
async function apply(s, r) {
  switch (r.op) {
    case "PUT":
      return put(s, r);
    case "GET":
      return get(s, r);
    case "LIST": {
      if (r.prefix !== undefined && typeof r.prefix !== "string")
        throw new Error("prefix must be text.");
      return {
        status: 200,
        objects: Object.keys(s.objects)
          .filter((k) => k.startsWith(r.prefix || "") && !current(s, k).deleted)
          .sort()
          .map((key) => ({
            key,
            bytes: current(s, key).bytes,
            version: current(s, key).version,
          })),
        note: "Small complete model listing; no pagination or delimiter grouping.",
      };
    }
    case "DELETE": {
      name(r.key);
      if (!own(s.objects, r.key) && Object.keys(s.objects).length >= 60)
        throw new Error("This teaching bucket holds at most 60 keys.");
      if ((entry(s.objects, r.key) || []).length >= 60)
        throw new Error("Version limit reached.");
      const v = { version: `v${++s.serial}`, deleted: true };
      s.objects[r.key] = [v, ...(entry(s.objects, r.key) || [])];
      return { status: 204, version: v.version, deleteMarker: true };
    }
    case "DELETE_VERSION": {
      name(r.key);
      required(r.version, "version");
      const old = entry(s.objects, r.key) || [];
      s.objects[r.key] = old.filter((v) => v.version !== r.version);
      if (!entry(s.objects, r.key).length) delete s.objects[r.key];
      return {
        status: 204,
        removed: old.length !== (entry(s.objects, r.key) || []).length,
      };
    }
    case "CREATE_UPLOAD": {
      name(r.key);
      if (Object.keys(s.uploads).length >= 20)
        throw new Error("At most 20 unfinished uploads in this model.");
      const upload = `u${++s.serial}`;
      s.uploads[upload] = { key: r.key, parts: {} };
      return { status: 200, upload };
    }
    case "UPLOAD_PART": {
      name(r.upload, "upload");
      const u = entry(s.uploads, r.upload);
      if (!u) return { status: 404, error: "NoSuchUpload" };
      integer(r.part, "part", 1, 20);
      if (typeof r.body !== "string" || r.body.length > 16000)
        throw new Error("part body must be text of at most 16,000 characters.");
      const token = await etag(r.body);
      u.parts[r.part] = { body: r.body, etag: token };
      return { status: 200, part: r.part, etag: token };
    }
    case "COMPLETE_UPLOAD": {
      name(r.upload, "upload");
      const u = entry(s.uploads, r.upload);
      if (!u) return { status: 404, error: "NoSuchUpload" };
      if (!Array.isArray(r.parts) || !r.parts.length)
        throw new Error("parts must list the selected part numbers and ETags.");
      let last = 0;
      let body = "";
      for (const p of r.parts) {
        object(p, "part entry");
        for (const field of Object.keys(p))
          if (!["part", "etag"].includes(field))
            throw new Error(`Unsupported part field: ${field}.`);
        required(p.etag, "etag");
        integer(p.part, "part", 1, 20);
        if (p.part <= last) return { status: 400, error: "InvalidPartOrder" };
        last = p.part;
        if (!u.parts[p.part] || u.parts[p.part].etag !== p.etag)
          return {
            status: 400,
            error: "InvalidPart",
            message: "A selected part is absent or its ETag differs.",
          };
        body += u.parts[p.part].body;
      }
      const response = await put(s, { ...r, key: u.key, body });
      if (response.status === 200) delete s.uploads[r.upload];
      return response;
    }
    case "ABORT_UPLOAD": {
      name(r.upload, "upload");
      if (!entry(s.uploads, r.upload))
        return { status: 404, error: "NoSuchUpload" };
      delete s.uploads[r.upload];
      return {
        status: 204,
        message: "Unfinished parts removed. No ordinary object was created.",
      };
    }
    case "CACHE_GET": {
      name(r.key);
      const ttl = number(r.ttl ?? 10, "ttl", 0, 100000);
      const cached = entry(s.cache, r.key);
      if (cached && s.clock < cached.expires)
        return {
          ...structuredClone(cached.response),
          servedBy: "model cache",
          expires: cached.expires,
        };
      const response = get(s, r);
      if (response.status === 200)
        s.cache[r.key] = {
          response: structuredClone(response),
          expires: s.clock + ttl,
        };
      return { ...response, servedBy: "origin model", expires: s.clock + ttl };
    }
    case "TICK": {
      s.clock += number(r.seconds, "seconds", 0, 100000);
      return { status: 200, clock: s.clock };
    }
    case "APP_CREATE": {
      name(r.id, "id");
      name(r.key);
      if (entry(s.records, r.id)) return { status: 409, error: "RecordExists" };
      if (Object.keys(s.records).length >= 60)
        throw new Error("Record limit reached.");
      s.records[r.id] = { key: r.key, state: "pending" };
      return { status: 201, record: structuredClone(entry(s.records, r.id)) };
    }
    case "APP_VALIDATE": {
      name(r.id, "id");
      const record = entry(s.records, r.id);
      if (!record || record.state !== "pending")
        return { status: 409, error: "NotPending" };
      const object = get(s, { key: record.key });
      if (object.status !== 200)
        return {
          status: 409,
          error: "MissingBytes",
          message: "Pending remains pending; upload complete bytes first.",
        };
      record.version = object.version;
      record.state = "verified";
      return {
        status: 200,
        record: structuredClone(record),
        note: "Model records an exact version. It does not inspect real image safety or permissions.",
      };
    }
    case "APP_PUBLISH": {
      name(r.id, "id");
      const record = entry(s.records, r.id);
      if (!record || !["verified", "ready"].includes(record.state))
        return { status: 409, error: "NotVerified" };
      if (get(s, { key: record.key, version: record.version }).status !== 200)
        return { status: 409, error: "MissingVersion" };
      record.state = "ready";
      return {
        status: 200,
        record: structuredClone(record),
        note: "Model publication uses the recorded version, not the mutable current key.",
      };
    }
    case "APP_ABANDON": {
      name(r.id, "id");
      const record = entry(s.records, r.id);
      if (!record || !["pending", "verified"].includes(record.state))
        return { status: 409, error: "NotPending" };
      record.state = "abandoned";
      return { status: 200, record: structuredClone(record) };
    }
    case "PROCESS_EVENT": {
      name(r.key);
      integer(r.sequence, "sequence", 1, 100000);
      if (typeof r.body !== "string" || r.body.length > 16000)
        throw new Error("body must be text of at most 16,000 characters.");
      const id = `${r.key}:${r.sequence}`;
      if (Object.keys(s.outputs).length >= 60 && !own(s.outputs, id))
        throw new Error("Event output limit reached.");
      if (own(s.outputs, id) && s.outputs[id] !== r.body)
        return {
          status: 409,
          error: "IdentityMismatch",
          message:
            "The same event identity cannot describe different output bytes.",
        };
      if (own(s.jobs, id))
        return {
          status: 200,
          duplicate: true,
          latest: entry(s.latest, r.key),
          output: id,
        };
      s.outputs[id] = r.body;
      if (r.stopAfterOutput)
        return {
          status: 202,
          message:
            "Worker stopped after storing output. Job is not complete; deliver it again.",
        };
      if (
        !entry(s.latest, r.key) ||
        r.sequence > entry(s.latest, r.key).sequence
      )
        s.latest[r.key] = { sequence: r.sequence, output: id };
      s.jobs[id] = true;
      return {
        status: 200,
        duplicate: false,
        latest: entry(s.latest, r.key),
        output: id,
      };
    }
    case "COST": {
      const records = integer(r.records, "records", 1, 1e9),
        bytes = number(r.bytesPerRecord, "bytesPerRecord", 1, 1e9),
        per = integer(r.recordsPerObject, "recordsPerObject", 1, 1e9),
        scans = number(r.scans, "scans", 0, 1e6),
        copies = number(r.copies ?? 1, "copies", 1, 10000),
        retry = number(r.retryFraction ?? 0, "retryFraction", 0, 10);
      const objects = Math.ceil(records / per),
        gets = objects * scans * (1 + retry),
        transferGB = (records * bytes * scans * (1 + retry)) / 1e9,
        storedGB = (records * bytes * copies) / 1e9;
      const rates = r.rates || {};
      const total =
        (gets / 1000) * number(rates.getPer1000 ?? 0, "getPer1000", 0, 1e6) +
        storedGB *
          number(rates.storagePerGBMonth ?? 0, "storagePerGBMonth", 0, 1e6) +
        transferGB * number(rates.transferPerGB ?? 0, "transferPerGB", 0, 1e6);
      return {
        status: 200,
        objects,
        expectedGETs: gets,
        storedGB,
        transferredGB: transferGB,
        illustrativeMonthlyUnits: total,
        assumptions:
          "Full scans of all records in one month. Retries repeat full GETs; copies are retained for the full month. Decimal GB. Excludes PUT/LIST, retrieval, minimum charges, compression, KMS and CDN. Rates are your inputs, not an AWS quote.",
      };
    }
    case "VECTOR_QUERY": {
      if (!Array.isArray(r.query) || r.query.length !== 2)
        throw new Error("query must contain two numbers.");
      r.query.forEach((x) => number(x, "coordinate", -1000, 1000));
      integer(r.topK ?? 2, "topK", 1, 4);
      const rows = [
        { key: "A", vector: [1, 0], category: "billing" },
        { key: "B", vector: [0.8, 0.2], category: "storage" },
        { key: "C", vector: [0, 1], category: "storage" },
        { key: "D", vector: [-1, 0], category: "billing" },
      ];
      const candidates = rows.filter(
        (x) => !r.category || x.category === r.category,
      );
      const ranked = candidates
        .map((x) => ({
          ...x,
          squaredDistance: x.vector.reduce(
            (a, v, i) => a + (v - r.query[i]) ** 2,
            0,
          ),
        }))
        .sort((a, b) => a.squaredDistance - b.squaredDistance);
      return {
        status: 200,
        candidates: ranked,
        results: ranked.slice(0, r.topK ?? 2),
        note: "Exact 2D squared Euclidean teaching calculation. Not S3 Vectors or an embedding model.",
      };
    }
    default:
      throw new Error(
        `Unsupported operation. Choose: ${operations.join(", ")}.`,
      );
  }
}
export async function execute(state, input) {
  try {
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("Enter one JSON request object.");
    if (JSON.stringify(input).length > 40000)
      throw new Error("Request is too large for this model.");
    const r = resolve(input, state.variables);
    if (!operations.includes(r.op))
      throw new Error(
        `Unsupported operation: ${r.op}. See the request reference.`,
      );
    validateRequest(r);
    const next = structuredClone(state);
    const response = await apply(next, r);
    if (r.saveAs !== undefined) {
      name(r.saveAs, "saveAs");
      if (!/^[A-Za-z][\w-]*$/.test(r.saveAs))
        throw new Error(
          "saveAs must begin with a letter and use letters, numbers, underscores or hyphens.",
        );
    }
    if (r.loseReply && response.status < 300) {
      return {
        state: next,
        response: {
          status: "unknown",
          message:
            "The model applied the operation, then hid its reply. The caller must reconcile state. No response variable was saved.",
        },
      };
    }
    if (r.saveAs && response.status < 300)
      next.variables[r.saveAs] = structuredClone(response);
    return { state: next, response: structuredClone(response) };
  } catch (error) {
    return {
      state,
      response: {
        status: 400,
        error: "ModelRequestError",
        message: error.message,
      },
    };
  }
}
export async function seed(requests = []) {
  let state = emptyState();
  for (const r of requests) {
    const result = await execute(state, r);
    if (result.response.status >= 400)
      throw new Error(result.response.message || result.response.error);
    state = result.state;
  }
  return state;
}
