import http from "node:http";
import { performance } from "node:perf_hooks";
import { Source } from "./source.mjs";
import { Cache } from "./cache.mjs";
import {
  Unavailable,
  HttpError,
  boundedWait,
  cacheKey,
  validEnvelope,
} from "./limits.mjs";
export async function createApplication({
  socket,
  database,
  maxAge = 2000,
  requestDeadline = 1000,
  sourceOptions = {},
  cacheOptions = {},
  maxWaiters = 16,
  maxRequests = 64,
} = {}) {
  const metrics = Object.fromEntries(
    [
      "requests",
      "success",
      "notFound",
      "errors",
      "cacheHits",
      "cacheMisses",
      "cacheRejected",
      "cacheErrors",
      "cacheRefused",
      "sourceStarts",
      "sourceReads",
      "sourceErrors",
      "sourceTimeouts",
      "sourceRefused",
      "coalesced",
      "waiterRefused",
      "httpRefused",
      "invalidationsFailed",
    ].map((k) => [k, 0]),
  );
  const source = new Source(database, metrics, sourceOptions),
    cache = new Cache(socket, metrics, cacheOptions),
    fills = new Map();
  let active = 0,
    peak = 0;
  await source.start();
  const payload = (context, result) => ({
    schema: 1,
    ...context,
    product: {
      name: context.locale === "sv" ? result.row.name_sv : result.row.name_en,
      priceCents: result.row.price,
      currency: "GBP",
      revision: result.row.revision,
    },
    observedAt: result.observedAt,
    validUntil: result.observedAt + maxAge,
  });
  async function display(context) {
    const key = cacheKey(context.tenant, context.id, context.locale);
    let raw;
    try {
      raw = await cache.command(["GETRANGE", key, "0", "4096"]);
    } catch {}
    if (raw !== undefined && raw !== null && raw !== "") {
      let value;
      try {
        if (Buffer.byteLength(raw) <= 4096) value = JSON.parse(raw);
      } catch {}
      if (validEnvelope(value, context, maxAge)) {
        metrics.cacheHits++;
        return { value, path: "redis" };
      }
      metrics.cacheRejected++;
    } else if (raw === null || raw === "") metrics.cacheMisses++;
    let entry = fills.get(key),
      path = "source";
    if (entry) {
      if (entry.waiters >= maxWaiters) {
        metrics.waiterRefused++;
        throw new Unavailable("Shared fill waiter limit");
      }
      metrics.coalesced++;
      path = "coalesced";
    } else {
      entry = { waiters: 0, promise: null };
      fills.set(key, entry);
      entry.promise = (async () => {
        const result = await source.call("read", {
          tenant: context.tenant,
          productId: context.id,
        });
        if (!result.row) throw new HttpError(404, "Product not found");
        const value = payload(context, result);
        if (!validEnvelope(value, context, maxAge))
          throw new Unavailable("Source observation exceeded age limit");
        try {
          const remaining = value.validUntil - Date.now();
          if (remaining > 0)
            await cache.command([
              "SET",
              key,
              JSON.stringify(value),
              "PX",
              String(remaining),
            ]);
        } catch {}
        return value;
      })().finally(() => {
        if (fills.get(key) === entry) fills.delete(key);
      });
    }
    entry.waiters++;
    try {
      return { value: await entry.promise, path };
    } finally {
      entry.waiters--;
    }
  }
  async function body(req, signal) {
    return new Promise((resolve, reject) => {
      let text = "";
      const cleanup = () => {
        req.off("data", data);
        req.off("end", end);
        req.off("error", error);
        signal.removeEventListener("abort", abort);
      };
      const error = (e) => {
        cleanup();
        reject(e);
      };
      const abort = () => {
        cleanup();
        req.resume();
        reject(new Unavailable("Request cancelled"));
      };
      const data = (chunk) => {
        text += chunk;
        if (Buffer.byteLength(text) > 2048) {
          cleanup();
          req.resume();
          reject(new HttpError(413, "Request too large"));
        }
      };
      const end = () => {
        cleanup();
        try {
          resolve(JSON.parse(text));
        } catch {
          reject(new HttpError(400, "Invalid JSON"));
        }
      };
      if (signal.aborted) {
        abort();
        return;
      }
      req.on("data", data);
      req.on("end", end);
      req.on("error", error);
      signal.addEventListener("abort", abort, { once: true });
    });
  }
  async function handle(req, signal) {
    if (req.url === "/metrics" && req.method === "GET") {
      if (req.headers.authorization !== "Bearer demo-operator")
        throw new HttpError(401, "Operator demo credential required");
      return {
        ...metrics,
        active,
        peak,
        sourceActive: source.gate.active,
        sourcePeak: source.gate.peak,
        cachePending: cache.pending,
        cachePeak: cache.peak,
        fills: fills.size,
      };
    }
    const tenant = new Map([
      ["Bearer demo-alpha", "alpha"],
      ["Bearer demo-beta", "beta"],
    ]).get(req.headers.authorization);
    if (!tenant) throw new HttpError(401, "Use a documented demo credential");
    const url = new URL(req.url, "http://localhost");
    const match = /^\/(products|price-check)\/([1-9][0-9]{0,2})$/.exec(
      url.pathname,
    );
    if (!match) throw new HttpError(404, "Unknown route");
    for (const key of url.searchParams.keys())
      if (key !== "locale") throw new HttpError(400, "Unknown query parameter");
    const locale = url.searchParams.get("locale") || "en";
    if (!["en", "sv"].includes(locale))
      throw new HttpError(400, "Unsupported locale");
    const context = { tenant, id: match[2], locale };
    if (req.method === "GET") {
      if (match[1] === "products") return display(context);
      const result = await source.call("read", {
        tenant,
        productId: context.id,
      });
      if (!result.row) throw new HttpError(404, "Product not found");
      return { value: payload(context, result), path: "authoritative" };
    }
    if (req.method === "PATCH" && match[1] === "products") {
      const input = await body(req, signal);
      if (signal.aborted) throw new Unavailable("Request cancelled");
      if (
        !input ||
        Object.keys(input).some(
          (k) => !["priceCents", "revision"].includes(k),
        ) ||
        !Number.isSafeInteger(input.priceCents) ||
        input.priceCents < 0 ||
        input.priceCents > 10000000 ||
        !Number.isSafeInteger(input.revision) ||
        input.revision < 1
      )
        throw new HttpError(400, "Expected priceCents and revision");
      const result = await source.call("update", {
        tenant,
        productId: context.id,
        priceCents: input.priceCents,
        revision: input.revision,
      });
      if (result.revision === null)
        throw new HttpError(409, "Revision conflict or missing product");
      try {
        await cache.command([
          "DEL",
          cacheKey(tenant, context.id, "en"),
          cacheKey(tenant, context.id, "sv"),
        ]);
      } catch {
        metrics.invalidationsFailed++;
      }
      return { updated: true, revision: result.revision };
    }
    throw new HttpError(405, "Method not allowed");
  }
  const server = http.createServer(async (req, res) => {
    metrics.requests++;
    const send = (status, value) => {
      if (!res.destroyed && !res.writableEnded) {
        res.writeHead(status, {
          "content-type": "application/json",
          "cache-control": "no-store",
        });
        res.end(JSON.stringify(value));
      }
    };
    if (active >= maxRequests) {
      metrics.httpRefused++;
      send(503, { error: "HTTP admission limit" });
      req.resume();
      return;
    }
    active++;
    peak = Math.max(peak, active);
    const start = performance.now(),
      controller = new AbortController();
    const work = handle(req, controller.signal).finally(() => {
      active--;
    });
    try {
      const value = await boundedWait(work, requestDeadline, () =>
        controller.abort(),
      );
      if (value.value && !validEnvelope(value.value, value.value, maxAge))
        throw new Unavailable("Observation expired before response");
      // The authoritative path promises a source read, not a complete purchase transaction.
      metrics.success++;
      send(200, { ...value, elapsedMs: Math.round(performance.now() - start) });
    } catch (e) {
      if (e.status === 404) metrics.notFound++;
      else metrics.errors++;
      send(e.status || 503, {
        error:
          e.status && e.status < 500 ? e.message : "Temporarily unavailable",
      });
    }
  });
  server.requestTimeout = requestDeadline;
  server.headersTimeout = requestDeadline;
  server.keepAliveTimeout = 1000;
  server.maxConnections = 128;
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  let closing;
  const close = () =>
    (closing ??= (async () => {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      await cache.close();
      await source.close();
    })());
  return {
    server,
    source,
    cache,
    metrics,
    url: `http://127.0.0.1:${server.address().port}`,
    stats: () => ({
      ...metrics,
      active,
      peak,
      sourceActive: source.gate.active,
      sourcePeak: source.gate.peak,
      cachePending: cache.pending,
      cachePeak: cache.peak,
      fills: fills.size,
    }),
    close,
  };
}
