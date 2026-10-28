// Figure 9: a Sentinel failover. Three Sentinels watch a primary with two
// replicas, pinging it once a second; clients find the primary through Sentinel and send it about ten
// cache requests a second. When the primary dies, each Sentinel marks it
// subjectively down (SDOWN) once it has gone `downAfter` ms without a valid
// reply; with two agreeing (the quorum) it is objectively down (ODOWN); one
// Sentinel is elected leader by a majority, promotes the replica, the clients
// re-resolve the address, and the other replica is pointed at the new primary.
// The delays after the first SDOWN are the medians of two failovers I ran on
// Redis 8.10.3 (evidence s1, s2): ODOWN +0.1 s, leader +0.2 s, promoted +1.1 s,
// clients back +1.15 s, other replica reconfigured +2.1 s. Until clients are
// back, each request fails and falls through to the database. Pure: no DOM.
import { Simulation, Movers, poissonArrivals, Window } from '../shared/sim.mjs';

export const AFTER_SDOWN = { odown: 100, leader: 240, promoted: 1080, clients: 1150, reconfigured: 2050, end: 2200 };
export const SDOWN_SPREAD = [70, 120, 160]; // ms after downAfter at which each Sentinel saw SDOWN (measured: 50–180)
export const HOP = 350;

export function create(params = {}, seed = 1) {
  const p = { downAfter: 30000, rate: 10, ...params };
  const sim = new Simulation({ seed });
  const movers = new Movers(sim);
  const sentinels = [0, 1, 2].map(i => ({ id: `s${i + 1}`, state: 'watching', vote: null }));
  const model = {
    sim, params: p, movers, sentinels,
    primary: 'p', dead: null, killedAt: null, phase: 'healthy', clientsOn: 'p',
    ok: new Window(1000), failed: new Window(1000), totals: { ok: 0, failed: 0 }, samples: [], marks: [],
    roles: { p: 'primary', r1: 'replica', r2: 'replica' },
  };

  poissonArrivals(sim, () => model.params.rate, () => {
    const target = model.clientsOn;
    const alive = target !== model.dead;
    const edge = `clients-${target}`;
    movers.add({ edge, duration: HOP, kind: 'client', onArrive: () => {
      if (alive && target !== model.dead) {
        model.ok.add(sim.now); model.totals.ok++;
        movers.add({ edge, reverse: true, duration: HOP, kind: 'hit' });
      } else {
        model.failed.add(sim.now); model.totals.failed++;
        movers.add({ edge, reverse: true, duration: HOP, kind: 'error' });
      }
    } });
  });
  sim.every(1000, () => model.samples.push([sim.now / 1000, model.ok.rate(sim.now), model.failed.rate(sim.now)]));
  // Each Sentinel pings the primary it was configured with once a second; after the kill the pings go unanswered.
  sentinels.forEach((s, i) => sim.after(250 + 330 * i, () => sim.every(1000, () => {
    movers.add({ edge: `${s.id}-p`, duration: HOP, kind: 'client', onArrive: () => {
      movers.add({ edge: `${s.id}-p`, reverse: true, duration: HOP, kind: model.dead === 'p' ? 'error' : 'hit' });
    } });
  })));

  const mark = (type, label) => model.marks.push({ type, t: sim.now / 1000, label });

  model.kill = () => {
    if (model.dead) return false;
    model.dead = model.primary;
    model.killedAt = sim.now;
    model.phase = 'dead';
    model.roles[model.dead] = 'down';
    mark('kill', 'primary killed');
    const first = sim.now + model.params.downAfter + SDOWN_SPREAD[0];
    sentinels.forEach((s, i) => sim.at(sim.now + model.params.downAfter + SDOWN_SPREAD[i], () => { s.state = 'sdown'; if (i === 0) mark('sdown', 'SDOWN'); }));
    sim.at(first + AFTER_SDOWN.odown, () => {
      model.phase = 'odown';
      sentinels.forEach(s => { s.state = 'odown'; });
      mark('odown', 'ODOWN');
    });
    sim.at(first + AFTER_SDOWN.leader, () => {
      model.phase = 'electing';
      sentinels.forEach(s => { s.vote = 's1'; s.state = s.id === 's1' ? 'leader' : 'voted'; });
    });
    sim.at(first + AFTER_SDOWN.promoted, () => {
      model.phase = 'promoted';
      model.primary = 'r1';
      model.roles.r1 = 'primary';
      mark('promoted', 'replica promoted');
    });
    sim.at(first + AFTER_SDOWN.clients, () => { model.clientsOn = 'r1'; model.phase = 'clients'; });
    sim.at(first + AFTER_SDOWN.reconfigured, () => { model.roles.r2 = 'replica of Redis B'; });
    sim.at(first + AFTER_SDOWN.end, () => { model.phase = 'done'; sentinels.forEach(s => { s.state = 'watching'; s.vote = null; }); });
    return true;
  };
  /** Seconds since the primary died, or null. */
  model.silentFor = () => (model.killedAt === null ? null : (sim.now - model.killedAt) / 1000);
  return model;
}

/** Seconds from the primary's death until clients are served again, under the measured delays. */
export const outageSeconds = downAfter => (downAfter + SDOWN_SPREAD[0] + AFTER_SDOWN.clients) / 1000;
