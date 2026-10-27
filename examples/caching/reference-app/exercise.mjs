import assert from "node:assert/strict";
import path from "node:path";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { createClient } from "redis";
import { createApplication } from "./app.mjs";
import { cacheKey, boundedWait } from "./limits.mjs";
const until = async (test) => {
  for (let i = 0; i < 150; i++) {
    if (test()) return;
    await delay(10);
  }
  assert.ok(test(), "Expected controlled state did not arrive");
};
export async function exercise(owned, signal) {
  const apps = [];
  let admin;
  const abort = () => {
    if (admin?.isOpen) admin.destroy();
    for (const app of apps) void app.close();
    void owned.stop();
  };
  signal?.addEventListener("abort", abort, { once: true });
  const make = async (options = {}) => {
    if (signal?.aborted) throw new Error("Lab interrupted");
    const app = await createApplication({
      socket: owned.socket,
      database: path.join(owned.directory, `source-${apps.length}.sqlite`),
      maxAge: 500,
      sourceOptions: { rate: 1000, burst: 4, deadline: 1200 },
      ...options,
    });
    apps.push(app);
    return app;
  };
  const connectAdmin = async () => {
    admin = createClient({
      RESP: 3,
      socket: { path: owned.socket, reconnectStrategy: false },
      disableOfflineQueue: true,
    });
    admin.on("error", () => {});
    await admin.connect();
  };
  const request = async (app, route = "/products/42", options = {}) => {
    const response = await fetch(app.url + route, {
      ...options,
      headers: { authorization: "Bearer demo-alpha", ...options.headers },
      signal: AbortSignal.timeout(3000),
    });
    return { status: response.status, body: await response.json() };
  };
  try {
    await connectAdmin();
    const app = await make();
    assert.equal(
      (
        await request(app, "/products/42", {
          headers: { authorization: "bad" },
        })
      ).status,
      401,
    );
    assert.equal(app.stats().sourceStarts, 0);
    assert.equal((await request(app, "/metrics")).status, 401);
    assert.equal(
      (
        await request(app, "/metrics", {
          headers: { authorization: "Bearer demo-operator" },
        })
      ).status,
      200,
    );
    const cold = await request(app);
    assert.equal(cold.status, 200);
    assert.equal(cold.body.path, "source");
    const reads = app.stats().sourceReads;
    const warm = await request(app);
    assert.equal(warm.body.path, "redis");
    assert.equal(app.stats().sourceReads, reads);
    const beta = await request(app, "/products/42", {
      headers: { authorization: "Bearer demo-beta" },
    });
    assert.equal(beta.body.value.product.priceCents, 7500);
    const sv = await request(app, "/products/42?locale=sv");
    assert.match(sv.body.value.product.name, /mugg/);
    assert.equal((await request(app, "/products/42?tenant=beta")).status, 400);
    console.log(
      "Cold source read then Redis hit; source count unchanged on hit; tenant and locale answers remain separate; unauthorised/context injection rejected",
    );
    const key = cacheKey("alpha", "42", "en");
    for (const raw of [
      "{broken",
      JSON.stringify({ ...cold.body.value, tenant: "beta" }),
      JSON.stringify({ ...cold.body.value, schema: 2 }),
      JSON.stringify({ ...cold.body.value, observedAt: 1, validUntil: 2 }),
      "x".repeat(10000),
    ]) {
      await admin.set(key, raw, { PX: 10000 });
      const before = app.stats().cacheRejected;
      const result = await request(app);
      assert.equal(result.status, 200);
      assert.equal(result.body.path, "source");
      assert.equal(app.stats().cacheRejected, before + 1);
    }
    console.log(
      "Malformed, wrong-tenant, wrong-schema, expired and oversized entries rejected; bounded GETRANGE never retrieves more than 4097 bytes",
    );
    await admin.del(key);
    const observed = once(app.source, "observed");
    await app.source.configure({ holdKey: "alpha:42" });
    const late = request(app);
    const [observation] = await boundedWait(observed, 1500);
    const updated = await request(app, "/products/42", {
      method: "PATCH",
      body: JSON.stringify({ priceCents: 1500, revision: 1 }),
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.revision, 2);
    assert.equal(
      (
        await request(app, "/products/42", {
          method: "PATCH",
          body: JSON.stringify({ priceCents: 1600, revision: 1 }),
        })
      ).status,
      409,
    );
    await app.source.configure({ holdKey: null });
    app.source.release();
    const old = await late;
    assert.equal(old.body.value.product.priceCents, 1200);
    assert.equal(old.body.value.validUntil, observation.observedAt + 500);
    assert.equal((await request(app)).body.value.product.priceCents, 1200);
    assert.equal(
      (await request(app, "/price-check/42")).body.value.product.priceCents,
      1500,
    );
    await delay(Math.max(0, old.body.value.validUntil - Date.now() + 10));
    assert.equal((await request(app)).body.value.product.priceCents, 1500);
    console.log(
      "Controlled stale refill survives post-commit DEL within age budget; authoritative price sees1500; original deadline then prevents reuse of old1200",
    );
    const expiresObserved = once(app.source, "observed");
    await app.source.configure({ holdKey: "alpha:43" });
    const expires = request(app, "/products/43");
    const [oldRead] = await boundedWait(expiresObserved, 1500);
    await delay(Math.max(0, oldRead.observedAt + 510 - Date.now()));
    await app.source.configure({ holdKey: null });
    app.source.release();
    assert.equal((await expires).status, 503);
    assert.equal(await admin.exists(cacheKey("alpha", "43", "en")), 0);
    console.log(
      "A source reply delayed beyond its original age budget is refused and never cached",
    );
    await admin.sendCommand(["CLIENT", "PAUSE", "250", "ALL"]);
    const errors = app.stats().cacheErrors;
    const delayed = await request(app);
    assert.equal(delayed.status, 200);
    assert.equal(delayed.body.path, "source");
    assert.ok(app.stats().cacheErrors > errors);
    await until(() => app.stats().cachePending === 0);
    await delay(280);
    await request(app);
    assert.equal((await request(app)).body.path, "redis");
    console.log(
      "Paused Redis exceeds external wait deadline; connection discarded, bounded source fallback succeeds, later cache access recovers",
    );
    admin.destroy();
    await owned.stop();
    const shared = await make({
      maxAge: 2000,
      sourceOptions: { rate: 0, burst: 4, deadline: 1500 },
    });
    await shared.source.configure({ holdKey: "alpha:42" });
    const sharedObserved = once(shared.source, "observed");
    const burst = Array.from({ length: 40 }, () => request(shared));
    await boundedWait(sharedObserved, 1500);
    await until(
      () =>
        shared.stats().requests === 40 && shared.stats().waiterRefused === 24,
    );
    assert.equal(shared.stats().sourceReads, 1);
    assert.equal(shared.stats().sourceActive, 1);
    assert.equal(shared.stats().sourcePeak, 1);
    await shared.source.configure({ holdKey: null });
    shared.source.release();
    const results = await Promise.all(burst);
    assert.equal(results.filter((x) => x.status === 200).length, 16);
    assert.equal(results.filter((x) => x.status === 503).length, 24);
    console.log(
      "Redis down / 40 same-key HTTP requests: one source read,16 successful waiters,24 refusals; peak source concurrency1",
    );
    const many = await make({
      sourceOptions: { rate: 0, burst: 4, deadline: 1200 },
    });
    await many.source.configure({ holdKey: "*" });
    const diverseRequests = Array.from({ length: 40 }, (_, i) =>
      request(many, `/products/${i + 1}`),
    );
    await until(
      () => many.stats().requests === 40 && many.stats().sourceRefused === 36,
    );
    assert.equal(many.stats().sourceActive, 4);
    await many.source.configure({ holdKey: null });
    many.source.release();
    const diverse = await Promise.all(diverseRequests);
    assert.equal(diverse.filter((x) => x.status === 200).length, 4);
    assert.equal(diverse.filter((x) => x.status === 503).length, 36);
    assert.equal(many.stats().sourceStarts, 4);
    assert.equal(many.stats().sourcePeak, 4);
    assert.equal(many.stats().sourceActive, 0);
    console.log(
      "Redis down / 40 distinct-key HTTP requests:4 admitted source reads,36 refusals; concurrency and initial token budget both bounded",
    );
    const slow = await make({
      sourceOptions: { rate: 1000, burst: 4, deadline: 80 },
    });
    await slow.source.configure({ holdKey: "alpha:42" });
    const timeout = await request(slow);
    assert.equal(timeout.status, 503);
    await until(() => slow.stats().sourceActive === 0);
    assert.equal(slow.stats().sourceTimeouts, 1);
    await slow.source.configure({ holdKey: null, fail: true });
    assert.equal((await request(slow)).status, 503);
    await until(() => slow.stats().sourceActive === 0);
    await slow.source.configure({ fail: false });
    assert.equal((await request(slow)).status, 200);
    console.log(
      "Source timeout and failure refuse safely; cancellation acknowledgement releases permit; later source work succeeds",
    );
    const blocked = await make({
      sourceOptions: { concurrency: 1, rate: 1000, burst: 4, deadline: 60 },
    });
    await blocked.source.configure({ delayMs: 0, blockMs: 220 });
    assert.equal((await request(blocked)).status, 503);
    assert.equal(
      blocked.stats().sourceActive,
      1,
      "Permit must remain while worker is blocked",
    );
    assert.equal((await request(blocked, "/products/43")).status, 503);
    assert.equal(blocked.stats().sourceStarts, 1);
    await until(() => blocked.stats().sourceActive === 0);
    console.log(
      "Blocked database worker: caller times out but source permit stays occupied until actual worker reply; another load is refused",
    );
    const short = await make({
      requestDeadline: 80,
      maxRequests: 1,
      sourceOptions: { rate: 1000, burst: 4, deadline: 800 },
    });
    await short.source.configure({ holdKey: "alpha:42" });
    assert.equal((await request(short)).status, 503);
    assert.equal(
      short.stats().active,
      1,
      "Timed-out HTTP work remains counted",
    );
    assert.equal((await request(short, "/products/43")).status, 503);
    assert.equal(short.stats().httpRefused, 1);
    await short.source.configure({ holdKey: null });
    short.source.release();
    await until(
      () => short.stats().active === 0 && short.stats().sourceActive === 0,
    );
    console.log(
      "HTTP deadline does not remove unfinished work from admission count; excess request refused until the shared fill finishes",
    );
    await owned.start();
    await connectAdmin();
    await delay(180);
    const restored = await request(app);
    assert.equal(restored.status, 200);
    assert.equal(restored.body.value.product.priceCents, 1500);
    assert.equal((await request(app)).body.path, "redis");
    console.log(
      "Owned Redis restarted empty; SQLite retains authoritative1500; bounded reconnect, refill and subsequent hit succeed",
    );
    console.log(
      "All reference application assertions passed. Injected delays and budgets are teaching inputs, not performance measurements.",
    );
  } finally {
    signal?.removeEventListener("abort", abort);
    if (admin?.isOpen) admin.destroy();
    for (const app of apps) await app.close();
  }
}
