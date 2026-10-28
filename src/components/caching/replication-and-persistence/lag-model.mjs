// Figure 5: asynchronous replication. A writer changes product:42 about twice
// a second on the primary, which replies at once and sends each change down
// the replication stream; the replica applies it `delay` ms later. Readers
// read product:42 from the replica; a read is stale when the replica has not
// yet applied the latest change. Each change is about 60 bytes of stream.
// Dots are slowed for watching; the delay itself is model time. Pure: no DOM.
import { Simulation, Movers, poissonArrivals, RecentRatio } from '../shared/sim.mjs';

export const HOP = 450;
export const BYTES = 60;

export function create(params = {}, seed = 1) {
  const p = { delay: 250, writeRate: 2, readRate: 8, ...params };
  const sim = new Simulation({ seed });
  const movers = new Movers(sim);
  const model = { sim, params: p, movers, primary: 0, replica: 0, primaryOffset: 0, replicaOffset: 0, reads: 0, staleReads: 0, recent: new RecentRatio(100), lagSamples: [] };

  poissonArrivals(sim, () => model.params.writeRate, () => {
    movers.add({ edge: 'writer-primary', duration: HOP, kind: 'write', onArrive: () => {
      const version = ++model.primary;
      model.primaryOffset += BYTES;
      const offset = model.primaryOffset;
      const delay = model.params.delay;
      movers.add({ edge: 'primary-replica', duration: Math.max(delay, 250), kind: 'write' });
      sim.after(delay, () => {
        if (version > model.replica) model.replica = version;
        if (offset > model.replicaOffset) model.replicaOffset = offset;
      });
    } });
  });
  poissonArrivals(sim, () => model.params.readRate, () => {
    movers.add({ edge: 'reader-replica', duration: HOP, kind: 'client', onArrive: () => {
      const stale = model.replica < model.primary;
      model.reads++;
      if (stale) model.staleReads++;
      model.recent.add(stale);
      movers.add({ edge: 'reader-replica', reverse: true, duration: HOP, kind: stale ? 'stale' : 'hit' });
    } });
  });
  return model;
}

/** Expected share of reads that find the replica behind, for Poisson writes at w a second and a fixed delay d ms. */
export const expectedStale = (writeRate, delayMs) => 1 - Math.exp(-writeRate * delayMs / 1000);
