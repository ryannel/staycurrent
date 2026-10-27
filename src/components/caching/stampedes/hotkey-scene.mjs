// Browser side of Figures 1, 3, 5 and 7: draws hotkey-model.mjs as clients,
// four application processes, Redis and the database.
import { mountSim, setReadouts } from '../shared/player.mjs';
import { createScene } from '../shared/scene.mjs';
import { hotKey, waitingBy } from './hotkey-model.mjs';

const seconds = ms => (ms == null ? '–' : `${(ms / 1000).toFixed(1)} s`);

/** root: the SimFigure; fixed: params not exposed as controls (e.g. { mode: 'none' }). */
export function mountHotKey(root, fixed = {}) {
  const processes = 4;
  const nodes = [
    { id: 'clients', kind: 'client', label: 'Clients', count: 3 },
    ...Array.from({ length: processes }, (_, i) => ({ id: `app-${i}`, kind: 'app', label: `Process ${i + 1}` })),
    { id: 'redis', kind: 'redis', label: 'Redis' },
    { id: 'database', kind: 'database', label: 'Database' },
  ];
  const edges = Array.from({ length: processes }, (_, i) => [
    { id: `client-${i}`, from: 'clients', to: `app-${i}` },
    { id: `redis-${i}`, from: `app-${i}`, to: 'redis' },
    { id: `db-${i}`, from: `app-${i}`, to: 'database' },
  ]).flat();
  const scene = createScene(root.querySelector('[data-scene]'), {
    label: 'Clients send requests to four application processes, which read one key from Redis and, when it is missing or stale, query the database',
    nodes,
    edges,
    layout: (width, compact) => {
      const left = compact ? 30 : 64, mid = Math.round(width * (compact ? 0.45 : 0.44)), right = width - (compact ? 44 : 96);
      const ys = compact ? [40, 112, 184, 256] : [40, 110, 180, 250];
      const positions = { clients: [left, 150], redis: [right, compact ? 70 : 72], database: [right, compact ? 222 : 218] };
      ys.forEach((y, i) => { positions[`app-${i}`] = [mid, y]; });
      return { height: compact ? 300 : 292, positions };
    },
  });

  mountSim(root, {
    seed: 7,
    create: (params, seed) => hotKey({ ...params, ...fixed }, seed),
    update: (model, params) => {
      if (params.mode && params.mode !== model.params.mode) return false;
      Object.assign(model.params, params, fixed);
      return true;
    },
    render(model) {
      scene.dots(model.movers.active());
      const { redis, db, episode, last, params } = model;
      const now = model.sim.now;
      const present = redis.value !== null && now < redis.expiresAt;
      const fresh = present && now < redis.storedAt + params.ttl;
      const lock = redis.lock && now < redis.lockExpiresAt;
      const copy = fresh ? 'fresh copy' : present ? 'stale copy' : 'no copy';
      scene.node('redis').set({ sublabel: params.mode === 'lock' || params.mode === 'stale' ? `${copy} · ${lock ? 'locked' : 'no lock'}` : copy, highlight: !fresh });
      scene.node('database').set({ meter: Math.min(1, db.running / 20), meterKind: 'database', sublabel: `${db.running} ${db.running === 1 ? 'query' : 'queries'} running` });
      const waiting = waitingBy(model);
      waiting.forEach((n, i) => scene.node(`app-${i}`).set({ queue: [n, n ? 6 : 0] }));
      setReadouts(root, {
        // Until the new expiry's first query is sent, keep showing the previous expiry's count.
        queries: String(episode.open && episode.queries === 0 && last.queries != null ? last.queries : episode.queries),
        predicted: (params.rate * 1).toFixed(0),
        slowest: seconds(episode.slowest || last.slowest),
        stale: String(params.mode === 'stale' ? episode.stale : 0),
        waiting: String(waiting.reduce((a, b) => a + b, 0)),
      });
    },
  });
}
