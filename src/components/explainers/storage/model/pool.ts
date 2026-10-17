/*
 * The buffer pool under a one-off scan: four replacement policies on the same
 * eight-slot pool. Four shop pages are used constantly, four were used once,
 * and a report then reads a run of pages it will never need again.
 */
import { rect, text, line, type Item } from './draw';
import type { Scene, Step } from './types';

export type Policy = 'lru' | 'clock' | 'ring' | 'midpoint';
type Kind = 'hot' | 'warm' | 'scan';
type Page = { id: string; kind: Kind; count: number };

const SLOTS = 8;
const OLD = 3; // InnoDB's old sublist: 3/8 of the pool
const RING = 2; // the drawing's ring; PostgreSQL's is 256 kB or more
const HOT = ['S1', 'S2', 'S3', 'S4'];

type PoolState = {
  policy: Policy;
  /** Clock policies: slot by position. List policies: most recent first. */
  slots: Page[];
  hand: number;
  ring: number[];
  request?: { who: 'report' | 'shop'; page: string; outcome: 'hit' | 'read' };
  evicted?: string;
  reportReads: number;
  shopHits: number;
  shopReads: number;
  done: boolean;
  /** Shop pages still cached when the report finished. */
  kept?: number;
};

const kindOf = (id: string): Kind => (id.startsWith('S') ? 'hot' : id.startsWith('W') ? 'warm' : 'scan');

function initial(policy: Policy): PoolState {
  const clockOrder = ['S1', 'W1', 'S2', 'W2', 'S3', 'W3', 'S4', 'W4'];
  const listOrder = ['S1', 'S2', 'S3', 'S4', 'W1', 'W2', 'W3', 'W4'];
  const order = policy === 'clock' || policy === 'ring' ? clockOrder : listOrder;
  return {
    policy,
    slots: order.map(id => ({ id, kind: kindOf(id), count: kindOf(id) === 'hot' ? 5 : 1 })),
    hand: 0, ring: [], reportReads: 0, shopHits: 0, shopReads: 0, done: false,
  };
}

const clone = (s: PoolState): PoolState => ({ ...s, slots: s.slots.map(p => ({ ...p })), ring: [...s.ring], request: undefined, evicted: undefined });

/** Clock sweep: decrement until a page with count 0 is found; return its slot. */
function sweep(s: PoolState): number {
  for (;;) {
    const i = s.hand;
    s.hand = (s.hand + 1) % SLOTS;
    if (s.slots[i].count === 0) return i;
    s.slots[i].count -= 1;
  }
}

/** Bring `id` into the pool for `who`. Returns the evicted page id, if any. */
function access(s: PoolState, id: string, who: 'report' | 'shop'): { hit: boolean; evicted?: string } {
  const at = s.slots.findIndex(p => p.id === id);
  const fromScan = who === 'report';
  if (at >= 0) {
    const page = s.slots[at];
    if (s.policy === 'clock' || s.policy === 'ring') page.count = Math.min(5, page.count + 1);
    if (s.policy === 'lru') s.slots.unshift(...s.slots.splice(at, 1));
    if (s.policy === 'midpoint') s.slots.unshift(...s.slots.splice(at, 1)); // a reuse more than a second later
    return { hit: true };
  }
  const page: Page = { id, kind: kindOf(id), count: 1 };
  if (s.policy === 'lru') {
    const out = s.slots.pop()!;
    s.slots.unshift(page);
    return { hit: false, evicted: out.id };
  }
  if (s.policy === 'midpoint') {
    const out = s.slots.pop()!;
    s.slots.splice(SLOTS - OLD, 0, page); // head of the old sublist
    return { hit: false, evicted: out.id };
  }
  if (s.policy === 'ring' && fromScan && s.ring.length === RING) {
    const slot = s.ring.shift()!;
    const out = s.slots[slot];
    s.slots[slot] = page;
    s.ring.push(slot);
    return { hit: false, evicted: out.id };
  }
  const slot = sweep(s);
  const out = s.slots[slot];
  s.slots[slot] = page;
  if (s.policy === 'ring' && fromScan) s.ring.push(slot);
  return { hit: false, evicted: out.id };
}

const cachedHot = (s: PoolState) => HOT.filter(id => s.slots.some(p => p.id === id)).length;

const NAMES: Record<Policy, string> = {
  lru: 'least recently used',
  clock: 'clock sweep',
  ring: 'clock sweep with a ring',
  midpoint: 'midpoint insertion',
};

function narrate(policy: Policy, s: PoolState, page: string, evicted: string, firstHotLoss: boolean): string {
  const lost = kindOf(evicted) === 'hot';
  if (policy === 'ring' && s.ring.length === RING && s.reportReads > RING) return `The report reads ${page} into its own ring slot again, replacing ${evicted}.`;
  if (lost && firstHotLoss) return `The report reads ${page}. This time the page to go is ${evicted}, one the shop uses all the time.`;
  return `The report reads ${page}, which replaces ${evicted}.`;
}

export const poolScan: Scene<PoolState> = {
  id: 'pool-scan',
  onParam: 'play',
  params: [
    {
      id: 'policy', label: 'Policy', initial: 'lru',
      options: [
        { value: 'lru', label: 'Least recently used' },
        { value: 'clock', label: 'Clock sweep' },
        { value: 'ring', label: 'Clock + ring' },
        { value: 'midpoint', label: 'Midpoint' },
      ],
    },
    {
      id: 'length', label: 'Report reads', initial: '8',
      options: [{ value: '8', label: '8 pages' }, { value: '24', label: '24 pages' }],
    },
  ],
  steps: ({ policy, length }) => {
    const p = policy as Policy;
    const n = Number(length);
    let s = initial(p);
    const intro: Record<Policy, string> = {
      lru: 'Eight slots, ordered from most to least recently used. The shop has just used S1 to S4; W1 to W4 were each used once, a while ago.',
      clock: 'Eight slots, each with a usage count. The shop’s pages S1 to S4 have reached the maximum of 5; W1 to W4 were each used once.',
      ring: 'The same pool and counts as the clock sweep. This time the report is a sequential scan of a large table, so it gets a small ring of slots to itself.',
      midpoint: 'Eight slots as a list. The first five are the young sublist; the last three, 3/8 of the pool, are the old sublist. S1 to S4 and W1 are young; W2 to W4 are old.',
    };
    const steps: Step<PoolState>[] = [{ text: intro[p], state: s }];
    let hotLost = false;
    for (let i = 1; i <= n; i++) {
      const next = clone(s);
      const id = `R${i}`;
      const { evicted } = access(next, id, 'report');
      next.reportReads = s.reportReads + 1;
      next.request = { who: 'report', page: id, outcome: 'read' };
      next.evicted = evicted;
      const firstHotLoss = !hotLost && !!evicted && kindOf(evicted) === 'hot';
      if (firstHotLoss) hotLost = true;
      const firstRingReuse = p === 'ring' && i === RING + 1;
      const firstOld = p === 'midpoint' && i === 1;
      let textOut = narrate(p, next, id, evicted ?? '', firstHotLoss);
      if (firstRingReuse) textOut = `The ring is full, so the report reuses its own slot for ${id}, replacing ${evicted}. It will keep cycling through these two slots.`;
      if (firstOld) textOut = `The report reads R1. A new page goes in at the midpoint, the head of the old sublist, and the page at the tail, ${evicted}, leaves.`;
      if (p === 'clock' && i === 1) textOut = `The report needs a slot for R1. The hand passes pages, taking 1 off each count, until it finds a count of 0. It evicts ${evicted}.`;
      steps.push({ text: textOut, state: next, fast: !(firstHotLoss || firstRingReuse || firstOld || (p === 'clock' && i === 1)) });
      s = next;
    }
    const kept = cachedHot(s);
    const summary: Record<Policy, string> = {
      lru: 'The report has finished. Every page it read went to the front of the list, so the shop’s pages were pushed out of the end.',
      clock: kept === 4
        ? 'The report has finished. Each pass of the hand wore the shop’s counts down, from 5 to 1, but none reached 0, so all four pages are still here.'
        : `The report has finished. Pass after pass wore the shop’s counts down to 0, and ${['none', 'one', 'two', 'three', 'all four'][4 - kept]} of its pages went.`,
      ring: 'The report has finished. It read every page through two slots, so the shop’s pages were never in its way.',
      midpoint: 'The report has finished. Its pages entered and left through the old sublist without being used again a second later, so the young pages were never touched.',
    };
    s = { ...clone(s), done: true, kept };
    steps.push({ text: summary[p], state: s, hold: 2600 });
    for (const id of HOT) {
      const next = clone(s);
      const { hit, evicted } = access(next, id, 'shop');
      next.request = { who: 'shop', page: id, outcome: hit ? 'hit' : 'read' };
      next.evicted = evicted;
      next.shopHits = s.shopHits + (hit ? 1 : 0);
      next.shopReads = s.shopReads + (hit ? 0 : 1);
      next.done = true;
      steps.push({ text: hit ? `The shop asks for ${id}: a hit.` : `The shop asks for ${id}. It has to be read again${evicted ? `, evicting ${evicted}` : ''}.`, state: next, hold: 1300 });
      s = next;
    }
    steps.push({
      text: s.shopReads === 0
        ? `With ${NAMES[p]}, the report cost the shop nothing: four hits.`
        : `With ${NAMES[p]}, the report cost the shop ${s.shopReads} ${s.shopReads === 1 ? 'read' : 'reads'} it would otherwise not have made.`,
      state: { ...clone(s), done: true }, hold: 2600,
    });
    return steps;
  },
  interval: ({ length }) => (Number(length) > 12 ? 420 : 700),
  outline: () => [
    'Eight pool slots. Four hold pages the shop uses constantly (S1 to S4); four hold pages used once (W1 to W4). A report then reads pages R1 onwards, each once.',
    'Least recently used: each report page goes to the front of the list and the page at the end is evicted. After eight report pages, all four shop pages are gone, and the shop has to read them again.',
    'Clock sweep: a hand moves round the slots, taking one off each page’s usage count and evicting the first page at 0. The shop’s pages start at 5, so an 8-page report only wears them down to 1; a 24-page report evicts them.',
    'Clock sweep with a ring: a large sequential scan reuses two slots of its own, so the shop’s pages are never touched, whatever the report’s length.',
    'Midpoint insertion: new pages enter at the head of the old sublist (the last three slots) and leave from its tail unless used again more than a second later. The shop’s pages stay in the young sublist.',
  ],
  stats: s => [
    { label: 'Pages the report read', value: String(s.reportReads) },
    s.done
      ? { label: 'Shop pages that survived the report', value: `${s.kept ?? cachedHot(s)} of 4` }
      : { label: 'Shop pages still in the pool', value: `${cachedHot(s)} of 4` },
    { label: 'Shop reads afterwards', value: s.shopHits + s.shopReads > 0 ? String(s.shopReads) : '–' },
  ],
  render: (s, W) => {
    const items: Item[] = [];
    const narrow = W < 460;
    const pad = narrow ? 8 : 14;
    const gap = narrow ? 4 : 9;
    const sw = Math.min(70, (W - pad * 2 - gap * (SLOTS - 1)) / SLOTS);
    const rowW = sw * SLOTS + gap * (SLOTS - 1);
    const left = (W - rowW) / 2;
    const slotX = (i: number) => left + i * (sw + gap);
    const clockLike = s.policy === 'clock' || s.policy === 'ring';

    // Request
    items.push(text('req-l', pad, 14, 'REQUEST', 'sf-t sf-lane'));
    if (s.request) {
      const who = s.request.who === 'report' ? 'report' : 'shop';
      const bw = 112;
      items.push(rect('req-bg', pad, 22, bw, 22, 'sf-bubble'));
      items.push(text('req-t', pad + 8, 37, `${who} → ${s.request.page}`, 'sf-t sf-mono'));
      const ok = s.request.outcome === 'hit';
      items.push(rect('req-o', pad + bw + 8, 22, 50, 22, `sf-reply ${ok ? 'sf-reply-ok' : 'sf-reply-wait'}`));
      items.push(text('req-ot', pad + bw + 33, 37, s.request.outcome, 'sf-t sf-mid sf-strong'));
      if (s.evicted) items.push(text('req-ev', pad + bw + 66, 37, `evicts ${s.evicted}`, `sf-t sf-small ${kindOf(s.evicted) === 'hot' ? 'sf-result-bad sf-strong' : 'sf-muted'}`));
    }

    // Pool
    const top = 62;
    const laneH = 118;
    items.push(rect('lane', 3, top, W - 6, laneH, 'sf-lane-mem'));
    items.push(text('lane-t', pad, top + 16, narrow ? 'BUFFER POOL · 8 slots' : 'BUFFER POOL · eight slots in memory', 'sf-t sf-lane'));
    const sy = top + 28;
    const sh = 46;
    s.slots.forEach((page, i) => {
      const x = slotX(i);
      const just = s.request?.page === page.id && s.request.outcome === 'read';
      const cls = page.kind === 'hot' ? 'sf-card sf-bp-hot' : page.kind === 'scan' ? 'sf-card sf-bp-scan' : 'sf-card';
      const from = just ? { x, y: sy + 60 } : undefined;
      items.push(rect(`p-${page.id}`, x, sy, sw, sh, `${cls}${just ? ' sf-focus' : ''}`, { from }));
      items.push(text(`p-${page.id}-t`, x + sw / 2, sy + (clockLike ? 20 : 28), page.id, 'sf-t sf-mono sf-mid sf-strong', { from: from && { x: x + sw / 2, y: from.y + 20 } }));
      if (clockLike) items.push(text(`p-${page.id}-c`, x + sw / 2, sy + 37, String(page.count), 'sf-t sf-xs sf-mid sf-muted', { from: from && { x: x + sw / 2, y: from.y + 37 } }));
    });

    // Policy annotations under the slots
    const ay = sy + sh + 16;
    if (s.policy === 'lru') {
      items.push(text('a-l', slotX(0), ay, '← most recent', 'sf-t sf-xs sf-muted'));
      items.push(text('a-r', slotX(SLOTS - 1) + sw, ay, 'evicted next →', 'sf-t sf-xs sf-muted sf-end'));
    }
    if (s.policy === 'midpoint') {
      const split = slotX(SLOTS - OLD) - gap / 2;
      items.push(line('a-split', split, sy - 6, split, sy + sh + 6, 'sf-bp-split'));
      items.push(text('a-young', (slotX(0) + split) / 2, ay, 'young', 'sf-t sf-xs sf-mid sf-muted'));
      items.push(text('a-old', (split + slotX(SLOTS - 1) + sw) / 2, ay, 'old · 3/8', 'sf-t sf-xs sf-mid sf-muted'));
    }
    if (clockLike) {
      const hx = slotX(s.hand) + sw / 2;
      items.push(text('a-hand', hx, ay + 2, '▲', 'sf-t sf-small sf-mid sf-bp-hand'));
      items.push(text('a-hand-t', hx, ay + 15, 'hand', 'sf-t sf-xxs sf-mid sf-muted'));
      if (s.policy === 'ring' && s.ring.length) {
        s.ring.forEach(i => items.push(rect(`ring-${i}`, slotX(i) - 2, sy - 4, sw + 4, sh + 8, 'sf-bp-ring')));
      }
      if (!narrow) items.push(text('a-count', slotX(SLOTS - 1) + sw, top + 16, 'number = usage count', 'sf-t sf-xs sf-muted sf-end'));
    }

    // Legend
    const ly = top + laneH + 14;
    const legend: [string, string][] = [['sf-card sf-bp-hot', 'shop page'], ['sf-card', 'used once'], ['sf-card sf-bp-scan', 'report page']];
    if (s.policy === 'ring') legend.push(['sf-bp-ring sf-bp-ring-swatch', 'ring']);
    const step = narrow ? (W - pad * 2) / legend.length : 120;
    legend.forEach(([cls, label], i) => {
      const lx = pad + i * step;
      items.push(rect(`lg-${i}`, lx, ly, 12, 12, `${cls} sf-swatch`));
      items.push(text(`lg-t-${i}`, lx + 17, ly + 10, label, 'sf-t sf-xs'));
    });
    return { items, height: ly + 22 };
  },
};
