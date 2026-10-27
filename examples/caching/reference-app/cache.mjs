import { createClient } from "redis";
import { performance } from "node:perf_hooks";
import { boundedWait, Unavailable } from "./limits.mjs";
export class Cache {
  constructor(
    path,
    metrics,
    { deadline = 60, cooldown = 150, maxPending = 16 } = {},
  ) {
    Object.assign(this, { path, metrics, deadline, cooldown, maxPending });
    this.client = null;
    this.connecting = false;
    this.retryAt = 0;
    this.pending = 0;
    this.peak = 0;
    this.closed = false;
  }
  drop(client) {
    if (this.client === client) {
      this.client = null;
      this.retryAt = performance.now() + this.cooldown;
    }
    if (client.isOpen) client.destroy();
  }
  async connection() {
    if (this.closed) throw new Unavailable("Cache closed");
    if (this.client?.isReady) return this.client;
    if (this.connecting || performance.now() < this.retryAt)
      throw new Unavailable("Cache probe deferred");
    this.connecting = true;
    const client = createClient({
      RESP: 3,
      socket: {
        path: this.path,
        reconnectStrategy: false,
        connectTimeout: this.deadline,
      },
      disableOfflineQueue: true,
      commandsQueueMaxLength: this.maxPending,
    });
    this.client = client;
    client.on("error", () => {
      if (!this.connecting) this.drop(client);
    });
    try {
      await boundedWait(client.connect(), this.deadline, () =>
        this.drop(client),
      );
      return client;
    } catch (e) {
      this.drop(client);
      throw e;
    } finally {
      this.connecting = false;
    }
  }
  async command(args) {
    if (this.pending >= this.maxPending) {
      this.metrics.cacheRefused++;
      throw new Unavailable("Cache pending limit");
    }
    this.pending++;
    this.peak = Math.max(this.peak, this.pending);
    try {
      const client = await this.connection();
      return await boundedWait(client.sendCommand(args), this.deadline, () =>
        this.drop(client),
      );
    } catch (e) {
      this.metrics.cacheErrors++;
      throw e;
    } finally {
      this.pending--;
    }
  }
  async close() {
    this.closed = true;
    if (this.client) this.drop(this.client);
  }
}
