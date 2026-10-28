// Several clients adding 1 to one counter in Redis, four ways. Pure; time in
// milliseconds of the on-screen simulation (one network trip each way takes
// 300 to 500 ms, so the reader can follow each message).
//
// Redis is modelled as executing each command the moment it arrives, one at a
// time, which is all the single main thread needs to be here. Left out: the
// cost of executing commands, and anything else the clients do.
import { Simulation, Movers } from '../shared/sim.mjs';

export const CLIENTS = 4;
export const METHODS = ['getset', 'watch', 'incr', 'script'];

/** create({ method, clients }, seed) -> model */
export function create({ method = 'getset', clients = CLIENTS } = {}, seed = 1) {
  const sim = new Simulation({ seed });
  const movers = new Movers(sim);
  const redis = { value: 0, version: 0 };
  const stats = { done: 0, writes: 0, retries: 0, trips: 0, aborted: 0 };
  const model = { sim, movers, redis, stats, method, clients: [] };

  const oneWay = () => 300 + sim.random() * 200;
  // A round trip: a dot to Redis, execute(), a dot back, then onReply(result).
  const trip = (client, { kind, label }, execute, replyKind, onReply) => {
    stats.trips++;
    client.state = label;
    movers.add({
      edge: client.edge, duration: oneWay(), kind,
      onArrive: () => {
        const result = execute();
        const back = typeof replyKind === 'function' ? replyKind(result) : replyKind;
        movers.add({ edge: client.edge, reverse: true, duration: oneWay(), kind: back, onArrive: () => onReply(result) });
      },
    });
  };

  const finish = client => {
    stats.done++;
    client.done++;
    client.state = 'thinking';
    sim.after(sim.random() * 600, () => start(client));
  };

  const start = client => {
    if (model.method === 'incr') {
      trip(client, { kind: 'write', label: 'INCR' }, () => { redis.value++; redis.version++; stats.writes++; return redis.value; }, 'hit', () => finish(client));
      return;
    }
    if (model.method === 'script') {
      // A Lua script that reads the counter, decides and writes, all inside Redis in one step.
      trip(client, { kind: 'write', label: 'EVALSHA' }, () => { const seen = redis.value; redis.value = seen + 1; redis.version++; stats.writes++; return redis.value; }, 'hit', () => finish(client));
      return;
    }
    if (model.method === 'getset') {
      trip(client, { kind: 'client', label: 'GET' }, () => redis.value, 'hit', seen => {
        client.seen = seen;
        trip(client, { kind: 'write', label: `SET ${seen + 1}` }, () => { redis.value = seen + 1; redis.version++; stats.writes++; return 'OK'; }, 'hit', () => finish(client));
      });
      return;
    }
    // WATCH and GET together, then MULTI, SET, EXEC together: two round trips.
    trip(client, { kind: 'client', label: 'WATCH, GET' }, () => ({ seen: redis.value, version: redis.version }), 'hit', ({ seen, version }) => {
      client.seen = seen;
      trip(client, { kind: 'write', label: `EXEC SET ${seen + 1}` }, () => {
        if (redis.version !== version) { stats.aborted++; return null; }
        redis.value = seen + 1; redis.version++; stats.writes++; return 'OK';
      }, result => (result === null ? 'error' : 'hit'), result => {
        if (result === null) { stats.retries++; client.state = 'retry'; start(client); }
        else finish(client);
      });
    });
  };

  for (let i = 0; i < clients; i++) {
    const client = { id: i, edge: `c${i}-redis`, done: 0, seen: null, state: 'thinking' };
    model.clients.push(client);
    sim.after(i * 180 + sim.random() * 200, () => start(client));
  }
  // Increments that Redis executed but that the counter does not show.
  model.lost = () => stats.writes - redis.value;
  return model;
}
