// Figure 4: where an acknowledged write lives with the append-only file. A
// write reaches Redis, which appends it to the AOF with write(): it is now in
// the operating system's page cache, and Redis replies. It reaches the disk
// only when the file is fsynced: before the reply ('always'), about once a
// second in the background ('everysec'), or whenever the operating system
// flushes, here every 30 seconds ('no'). A crash of the Redis process loses
// nothing that reached the page cache; a power cut loses what is only there.
// Not modelled: with 'everysec' on a slow disk, Redis postpones the write() for up
// to 2 s while a background fsync runs but still replies (aof.c
// flushAppendOnlyFile, 8.10.3), so a process crash then loses acknowledged writes.
// Travel times are slowed for watching. Pure: no DOM.
import { Simulation, Movers, poissonArrivals } from '../shared/sim.mjs';

export const HOP = 500;          // drawn travel time between application and Redis
export const FSYNC_DRAW = 450;   // drawn time an fsync takes in 'always'
export const OS_FLUSH = 30000;   // a typical Linux flush interval for dirty pages

export function create(params = {}, seed = 1) {
  const p = { fsync: 'everysec', rate: 3, ...params };
  const sim = new Simulation({ seed });
  const movers = new Movers(sim);
  const model = { sim, params: p, movers, inCache: 0, ackedInCache: 0, flushGen: 0, pending: 0, onDisk: 0, acknowledged: 0, sent: 0, lost: 0, lastEvent: null, events: [] };

  model.epoch = 0;
  const fsync = () => { model.onDisk += model.inCache; model.inCache = 0; model.ackedInCache = 0; model.flushGen++; };
  let stopTimer = null;
  const schedule = () => {
    if (stopTimer) stopTimer();
    stopTimer = null;
    if (model.params.fsync === 'everysec') stopTimer = sim.every(1000, fsync);
    if (model.params.fsync === 'no') stopTimer = sim.every(OS_FLUSH, fsync);
  };
  schedule();
  model.setPolicy = policy => { model.params.fsync = policy; schedule(); };

  // A write counts as acknowledged-and-only-in-the-page-cache once its reply has
  // arrived, if no fsync or power cut has happened since it was written.
  const reply = (inPageCache) => {
    const gen = model.flushGen, epoch = model.epoch;
    movers.add({ edge: 'app-redis', reverse: true, duration: HOP, kind: 'write', onArrive: () => {
      model.acknowledged++;
      if (inPageCache && gen === model.flushGen && epoch === model.epoch) model.ackedInCache++;
    } });
  };
  poissonArrivals(sim, () => model.params.rate, () => {
    model.sent++;
    movers.add({ edge: 'app-redis', duration: HOP, kind: 'write', onArrive: () => {
      if (model.params.fsync === 'always') {
        // Not acknowledged until it is on disk: a power cut now loses a write the client never saw succeed.
        model.pending++;
        const epoch = model.epoch;
        movers.add({ edge: 'redis-os', duration: FSYNC_DRAW / 2, kind: 'write' });
        sim.after(FSYNC_DRAW / 2, () => movers.add({ edge: 'os-disk', duration: FSYNC_DRAW / 2, kind: 'write', onArrive: () => {
          if (epoch !== model.epoch) return; // the machine lost power on the way
          model.pending--; model.onDisk++; reply();
        } }));
      } else {
        model.inCache++;
        movers.add({ edge: 'redis-os', duration: 250, kind: 'write' });
        reply(true);
      }
    } });
  });

  /** 'crash': the Redis process dies; 'power': the machine loses power. Returns writes lost. */
  model.fail = kind => {
    const lost = kind === 'power' ? model.ackedInCache : 0;
    if (kind === 'power') { model.inCache = 0; model.ackedInCache = 0; model.pending = 0; model.epoch++; }
    model.lost += lost;
    model.lastEvent = { kind, lost, at: sim.now };
    model.events.push(model.lastEvent);
    return lost;
  };
  return model;
}
