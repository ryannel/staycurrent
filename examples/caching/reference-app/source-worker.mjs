import { parentPort, workerData } from "node:worker_threads";
import { DatabaseSync } from "node:sqlite";
import { setTimeout as delay } from "node:timers/promises";
const db = new DatabaseSync(workerData.path, { timeout: 100 });
db.exec(
  "CREATE TABLE IF NOT EXISTS products (tenant TEXT, id TEXT, name_en TEXT, name_sv TEXT, price INTEGER, revision INTEGER, PRIMARY KEY(tenant,id)) STRICT",
);
const seed = db.prepare("INSERT OR IGNORE INTO products VALUES (?,?,?,?,?,1)");
for (const tenant of ["alpha", "beta"])
  for (let id = 1; id <= 100; id++)
    seed.run(
      tenant,
      String(id),
      `${tenant} mug ${id}`,
      `${tenant} mugg ${id}`,
      tenant === "alpha" ? 1200 : 7500,
    );
const read = db.prepare("SELECT * FROM products WHERE tenant=? AND id=?");
const update = db.prepare(
  "UPDATE products SET price=?, revision=revision+1 WHERE tenant=? AND id=? AND revision=? RETURNING revision",
);
let config = { delayMs: 20, fail: false, holdKey: null, blockMs: 0 };
const controllers = new Map(),
  held = new Map();
parentPort.on("message", async (msg) => {
  if (msg.type === "configure") {
    config = { ...config, ...msg.config };
    parentPort.postMessage({ control: msg.control });
    return;
  }
  if (msg.type === "release") {
    for (const release of held.values()) release();
    held.clear();
    return;
  }
  if (msg.type === "cancel") {
    controllers.get(msg.id)?.abort();
    return;
  }
  if (msg.type !== "operation") return;
  const controller = new AbortController();
  controllers.set(msg.id, controller);
  const signal = controller.signal;
  try {
    await delay(config.delayMs, undefined, { signal });
    // Test-only blocking delay models work which cannot acknowledge cancellation yet.
    if (config.blockMs > 0)
      Atomics.wait(
        new Int32Array(new SharedArrayBuffer(4)),
        0,
        0,
        config.blockMs,
      );
    if (config.fail) throw new Error("Injected source failure");
    let result;
    if (msg.op === "read") {
      const observedAt = Date.now(),
        row = read.get(msg.tenant, msg.productId);
      result = { observedAt, row: row || null };
      if (
        config.holdKey === "*" ||
        config.holdKey === `${msg.tenant}:${msg.productId}`
      ) {
        parentPort.postMessage({
          observed: msg.id,
          productId: msg.productId,
          observedAt,
        });
        await new Promise((resolve, reject) => {
          const abort = () => {
            held.delete(msg.id);
            reject(new Error("Cancelled source wait"));
          };
          signal.addEventListener("abort", abort, { once: true });
          held.set(msg.id, () => {
            signal.removeEventListener("abort", abort);
            resolve();
          });
        });
      }
    } else if (msg.op === "update") {
      // Exhaust RETURNING, then commit before replying; Redis is outside this transaction.
      db.exec("BEGIN IMMEDIATE");
      try {
        const rows = update.all(
          msg.priceCents,
          msg.tenant,
          msg.productId,
          msg.revision,
        );
        db.exec("COMMIT");
        result = { revision: rows[0]?.revision ?? null };
      } catch (error) {
        try {
          db.exec("ROLLBACK");
        } catch {}
        throw error;
      }
    } else throw new Error("Unknown source operation");
    parentPort.postMessage({ id: msg.id, result });
  } catch {
    parentPort.postMessage({
      id: msg.id,
      error: "Source operation failed or cancelled",
    });
  } finally {
    controllers.delete(msg.id);
    held.delete(msg.id);
  }
});
parentPort.postMessage({ ready: true });
