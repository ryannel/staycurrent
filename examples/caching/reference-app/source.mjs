import { Worker } from "node:worker_threads";
import { EventEmitter } from "node:events";
import { Admission, Unavailable, boundedWait } from "./limits.mjs";
export class Source extends EventEmitter {
  constructor(path, metrics, options = {}) {
    super();
    this.metrics = metrics;
    this.gate = new Admission(options);
    this.deadline = options.deadline ?? 300;
    this.pending = new Map();
    this.controls = new Map();
    this.serial = 0;
    this.available = false;
    this.worker = new Worker(new URL("./source-worker.mjs", import.meta.url), {
      workerData: { path },
    });
    this.ready = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
    this.worker.on("message", (msg) => {
      if (msg.ready) {
        this.available = true;
        this.resolveReady();
        return;
      }
      if (msg.control) {
        this.controls.get(msg.control)?.();
        this.controls.delete(msg.control);
        return;
      }
      if (msg.observed) {
        this.emit("observed", msg);
        return;
      }
      const entry = this.pending.get(msg.id);
      if (!entry) return;
      clearTimeout(entry.timer);
      entry.release();
      this.pending.delete(msg.id);
      if (msg.error) {
        metrics.sourceErrors++;
        entry.reject(new Unavailable("Source unavailable"));
      } else entry.resolve(msg.result);
    });
    this.worker.on("error", () => this.fail());
    this.worker.on("exit", () => this.fail());
  }
  fail() {
    this.available = false;
    this.rejectReady(new Unavailable("Source worker unavailable"));
    for (const entry of this.pending.values()) {
      clearTimeout(entry.timer);
      entry.release();
      entry.reject(new Unavailable("Source worker unavailable"));
    }
    this.pending.clear();
  }
  async start() {
    await boundedWait(this.ready, 3000, () => this.worker.terminate());
  }
  call(op, args) {
    if (!this.available)
      return Promise.reject(new Unavailable("Source unavailable"));
    let release;
    try {
      release = this.gate.acquire();
    } catch (e) {
      this.metrics.sourceRefused++;
      return Promise.reject(e);
    }
    this.metrics.sourceStarts++;
    if (op === "read") this.metrics.sourceReads++;
    const id = ++this.serial;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.metrics.sourceTimeouts++;
        reject(new Unavailable("Source deadline exceeded"));
        this.worker.postMessage({ type: "cancel", id });
      }, this.deadline);
      // Keep the permit until the worker replies or exits, even after the caller times out.
      this.pending.set(id, { resolve, reject, release, timer });
      this.worker.postMessage({ type: "operation", id, op, ...args });
    });
  }
  configure(config) {
    const control = ++this.serial;
    return boundedWait(
      new Promise((resolve) => {
        this.controls.set(control, resolve);
        this.worker.postMessage({ type: "configure", control, config });
      }),
      1000,
    );
  }
  release() {
    this.worker.postMessage({ type: "release" });
  }
  async close() {
    await this.worker.terminate();
    this.fail();
  }
}
