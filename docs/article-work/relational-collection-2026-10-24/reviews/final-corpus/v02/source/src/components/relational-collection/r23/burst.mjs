// A finite teaching schedule, not a database scheduler or a performance model.
export function burst(pool = 2, queue = 8, width = 2) {
  const accepted = Math.min(8, pool + queue);
  const rejected = Array.from({ length: 8 - accepted }, (_, i) => i + accepted + 1);
  let connected = Array.from({ length: Math.min(pool, accepted) }, (_, i) => i + 1);
  let waiting = Array.from({ length: Math.max(0, accepted - pool) }, (_, i) => i + pool + 1);
  let done = [];
  const states = [];
  while (true) {
    states.push({ active: connected.slice(0, width), blocked: connected.slice(width), waiting: [...waiting], done: [...done], rejected: [...rejected] });
    if (!connected.length) break;
    done.push(...connected.splice(0, width));
    connected.push(...waiting.splice(0, Math.max(0, pool - connected.length)));
  }
  return states;
}
