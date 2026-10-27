import { performance } from "node:perf_hooks";
export class Unavailable extends Error {
  constructor(message = "Temporarily unavailable") {
    super(message);
    this.status = 503;
  }
}
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export class Admission {
  constructor({ concurrency = 4, rate = 20, burst = 4 } = {}) {
    this.limit = concurrency;
    this.rate = rate;
    this.burst = burst;
    this.tokens = burst;
    this.last = performance.now();
    this.active = 0;
    this.peak = 0;
  }
  acquire() {
    const now = performance.now();
    this.tokens = Math.min(
      this.burst,
      this.tokens + ((now - this.last) * this.rate) / 1000,
    );
    this.last = now;
    if (this.active >= this.limit || this.tokens < 1)
      throw new Unavailable("Source admission limit");
    this.tokens--;
    this.active++;
    this.peak = Math.max(this.peak, this.active);
    let released = false;
    return () => {
      if (!released) {
        released = true;
        this.active--;
      }
    };
  }
}
export function boundedWait(promise, ms, onTimeout = () => {}) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(
        () => {
          onTimeout();
          reject(new Unavailable("Wait deadline exceeded"));
        },
        Math.max(1, ms),
      );
    }),
  ]).finally(() => clearTimeout(timer));
}
export const cacheKey = (tenant, id, locale) =>
  `display:v1:${JSON.stringify([tenant, id, locale])}`;
export function validEnvelope(value, context, maxAge, now = Date.now()) {
  if (
    !value ||
    value.schema !== 1 ||
    value.tenant !== context.tenant ||
    value.id !== context.id ||
    value.locale !== context.locale
  )
    return false;
  if (
    !Number.isSafeInteger(value.observedAt) ||
    !Number.isSafeInteger(value.validUntil) ||
    value.observedAt > now ||
    value.validUntil <= now ||
    value.validUntil - value.observedAt > maxAge ||
    value.validUntil <= value.observedAt
  )
    return false;
  return (
    value.product &&
    typeof value.product.name === "string" &&
    value.product.name.length <= 200 &&
    Number.isSafeInteger(value.product.priceCents) &&
    value.product.priceCents >= 0 &&
    value.product.priceCents <= 10000000 &&
    value.product.currency === "GBP" &&
    Number.isSafeInteger(value.product.revision) &&
    value.product.revision > 0
  );
}
