// Figure 6: the replication backlog. The primary keeps the most recent
// `backlogBytes` of its replication stream in a ring buffer. A replica that
// reconnects asks to continue from its offset; that works only if the bytes it
// missed are still in the ring. Pure arithmetic: no DOM.

export const MB = 1024 * 1024;
/** Bytes a SET of a 100-byte value with a TTL takes in the stream, as measured (276,790 bytes for 2,000). */
export const BYTES_PER_WRITE = 138;

/** What happens when a replica reconnects after `outage` seconds at `writesPerSecond`. */
export function reconnect({ writesPerSecond, outage, backlogBytes }) {
  const missed = writesPerSecond * BYTES_PER_WRITE * outage;
  const partial = missed <= backlogBytes;
  return {
    missed,
    partial,
    laps: missed / backlogBytes,
    /** Seconds of writes the backlog holds at this rate. */
    covers: backlogBytes / (writesPerSecond * BYTES_PER_WRITE),
    /** Backlog that would cover the outage. */
    needed: missed,
  };
}

export function formatBytes(bytes) {
  if (bytes >= MB) return `${(bytes / MB).toFixed(bytes >= 10 * MB ? 0 : 1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round(bytes)} bytes`;
}
