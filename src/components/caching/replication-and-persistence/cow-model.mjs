// Figure 2: a snapshot (BGSAVE) and copy-on-write. Redis's memory is drawn as
// `pages` pages. A fork gives the child process the same pages; the child walks
// them in order, writing each to the snapshot file, over `saveSeconds`. While
// the child lives, the first write the parent makes to a page copies it, so
// the page now exists twice. When the child exits, its old copies are freed.
// Writes arrive at `rate` a second, either all over memory ('spread') or on a
// few hot pages ('hot'). Scaled down for watching: a real page is 4 KB and a
// real server takes thousands of writes a second. Pure: no DOM.
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

export const PAGES = 48;
export const HOT_PAGES = 4;
export const SAVE_MS = 12000;
export const FORK_MS = 400; // drawn pause while the page tables are copied; not to scale

export function create(params = {}, seed = 1) {
  const p = { spread: 'spread', rate: 5, ...params };
  const sim = new Simulation({ seed });
  const pages = Array.from({ length: PAGES }, () => ({ copied: false, saved: false, writes: 0 }));
  const model = { sim, params: p, pages, phase: 'idle', startedAt: 0, savedUpTo: 0, peakCopied: 0, saves: 0, lastWrite: -1, writes: 0 };

  const pick = () => (model.params.spread === 'hot' ? sim.random.int(HOT_PAGES) * 7 % PAGES : sim.random.int(PAGES));
  poissonArrivals(sim, () => model.params.rate, () => {
    const i = pick();
    model.writes++;
    model.lastWrite = i;
    pages[i].writes++;
    if (model.phase === 'saving' && !pages[i].copied) pages[i].copied = true;
  });

  model.copied = () => pages.filter(pg => pg.copied).length;
  model.progress = () => (model.phase === 'saving' ? Math.min(1, (sim.now - model.startedAt - FORK_MS) / SAVE_MS) : model.phase === 'done' ? 1 : 0);

  /** Starts BGSAVE: a short fork pause, then the child writes page after page. */
  model.bgsave = () => {
    if (model.phase === 'forking' || model.phase === 'saving') return false;
    for (const pg of pages) { pg.copied = false; pg.saved = false; }
    model.phase = 'forking';
    model.startedAt = sim.now;
    model.saves++;
    sim.after(FORK_MS, () => { model.phase = 'saving'; });
    const perPage = SAVE_MS / PAGES;
    for (let i = 0; i < PAGES; i++) sim.after(FORK_MS + (i + 1) * perPage, () => { pages[i].saved = true; model.savedUpTo = i + 1; });
    sim.after(FORK_MS + SAVE_MS, () => {
      model.peakCopied = model.copied();
      model.phase = 'done';
      for (const pg of pages) pg.copied = false; // the child exits; its old copies are freed
    });
    return true;
  };
  return model;
}

/** Expected share of pages copied when `writes` writes land uniformly on `pages` pages. */
export const expectedCopied = (writes, pages) => 1 - Math.pow(1 - 1 / pages, writes);
