/*
 * Scenes about where rows live: filling 8 kB pages, reading pages into shared
 * buffers, row versions, and reclaiming old versions.
 */
import { rect, text, line, type Item, type Frame } from './draw';
import type { Scene, Step } from './types';

const PAGE = 8192;
const HEADER = 24;
const POINTER = 4;
const TUPLE_HEADER = 24; // 23-byte header, aligned to 8 bytes
const align8 = (n: number) => Math.ceil(n / 8) * 8;
export const tupleBytes = (data: number) => align8(TUPLE_HEADER + data);
export const rowsPerPage = (data: number) => Math.min(291, Math.floor((PAGE - HEADER) / (tupleBytes(data) + POINTER)));
const fmt = (n: number) => n.toLocaleString('en-GB');

/* ---------- Page fill ---------- */

type FillState = { data: number; n: number };

export const pageFill: Scene<FillState> = {
  id: 'page-fill',
  onParam: 'end',
  params: [{
    id: 'data', label: 'Row data', initial: '100',
    options: ['40', '100', '250', '1000', '2000'].map(value => ({ value, label: `${fmt(Number(value))} B` })),
  }],
  steps: ({ data }) => {
    const d = Number(data);
    const per = rowsPerPage(d);
    const tb = tupleBytes(d);
    const total = per * 2 + Math.ceil(per / 2);
    const steps: Step<FillState>[] = [{
      text: `An empty table file. Each page is 8,192 bytes, starting with a 24-byte header. Each row here is ${fmt(d)} bytes of data plus a 23-byte row header, padded to ${fmt(tb)} bytes.`,
      state: { data: d, n: 0 },
    }];
    for (let n = 1; n <= total; n++) {
      const page = Math.floor((n - 1) / per);
      const item = ((n - 1) % per) + 1;
      let line = `Row ${n} goes on page ${page} as item ${item}. A 4-byte line pointer is added after the header, and the ${fmt(tb)}-byte row is placed at the end of the free space.`;
      if (item === 1 && page > 0) {
        const free = PAGE - HEADER - per * (tb + POINTER);
        line = `Page ${page - 1} has ${fmt(free)} bytes left, too few for another ${fmt(tb + POINTER)}-byte row and pointer. Row ${n} starts page ${page}.`;
      }
      steps.push({ text: line, state: { data: d, n } });
    }
    return steps;
  },
  interval: ({ data }) => Math.max(30, Math.min(900, 3200 / rowsPerPage(Number(data)))),
  stats: ({ data, n }) => {
    const per = rowsPerPage(data);
    const onPage = n === 0 ? 0 : ((n - 1) % per) + 1;
    return [
      { label: 'Rows per 8 kB page', value: fmt(per) },
      { label: 'Bytes per row, with pointer', value: fmt(tupleBytes(data) + POINTER) },
      { label: 'Free on the current page', value: `${fmt(PAGE - HEADER - onPage * (tupleBytes(data) + POINTER))} B` },
    ];
  },
  render: ({ data, n }, W) => {
    const items: Item[] = [];
    const pad = 10;
    const gap = W < 420 ? 10 : 22;
    const pw = Math.min(150, (W - pad * 2 - gap * 2) / 3);
    const left = (W - (pw * 3 + gap * 2)) / 2;
    const ph = W < 420 ? 230 : 280;
    const top = W < 520 ? 56 : 40;
    const s = ph / PAGE;
    const per = rowsPerPage(data);
    const tb = tupleBytes(data);

    // Legend
    const legend: [string, string][] = [['sf-pg-header', 'page header'], ['sf-pg-lp', 'line pointers'], ['sf-pg-free', 'free space'], ['sf-pg-row-a', 'rows']];
    const twoRows = W < 520;
    legend.forEach(([cls, label], i) => {
      const lx = twoRows ? pad + (i % 2) * ((W - pad * 2) / 2) : pad + i * 125;
      const ly = twoRows ? 8 + Math.floor(i / 2) * 18 : 8;
      items.push(rect(`lg-${i}`, lx, ly, 12, 12, `${cls} sf-swatch`));
      items.push(text(`lg-t-${i}`, lx + 17, ly + 10, label, 'sf-t sf-xs'));
    });

    for (let p = 0; p < 3; p++) {
      const x = left + p * (pw + gap);
      const count = Math.max(0, Math.min(per, n - p * per));
      items.push(rect(`page-${p}`, x, top, pw, ph, 'sf-pg-free'));
      const hh = Math.max(4, HEADER * s);
      items.push(rect(`hdr-${p}`, x, top, pw, hh, 'sf-pg-header'));
      if (count > 0) items.push(rect(`lp-${p}`, x, top + hh, pw, Math.max(1.5, count * POINTER * s), 'sf-pg-lp'));
      const th = tb * s;
      const inset = th > 3 ? 1 : 0.35;
      for (let j = 0; j < count; j++) {
        const y = top + ph - (j + 1) * th;
        items.push(rect(`row-${p}-${j}`, x + 3, y + inset / 2, pw - 6, Math.max(0.6, th - inset), j % 2 ? 'sf-pg-row-b' : 'sf-pg-row-a', { from: { x: x + 3, y: y - 14 } }));
      }
      items.push(rect(`page-edge-${p}`, x, top, pw, ph, 'sf-pg-edge'));
      items.push(text(`pl-${p}`, x + pw / 2, top + ph + 18, `Page ${p}`, 'sf-t sf-strong sf-mid'));
      items.push(text(`pc-${p}`, x + pw / 2, top + ph + 34, `${count} ${count === 1 ? 'row' : 'rows'}`, 'sf-t sf-xs sf-mid sf-muted'));
    }
    return { items, height: top + ph + 44 };
  },
};

/* ---------- Buffer read ---------- */

type BufState = {
  slots: (number | null)[];
  query?: string;
  hits: number;
  reads: number;
  focus?: number;
  row?: string;
  from?: number;
  outcome?: { text: string; kind: 'hit' | 'miss' };
};

const FILE_PAGES = [10, 11, 12, 13, 31];
const PAGE_ROWS: Record<number, string[]> = { 12: ['P3', 'P9', 'P7'], 31: ['P38', 'P40', 'P41'] };

export const bufferRead: Scene<BufState> = {
  id: 'buffer-read',
  steps: () => {
    const empty = [null, null, null, null];
    return [
      { text: 'Shared buffers start empty. A real server has 16,384 slots of 8 kB by default; this drawing has four.', state: { slots: empty, hits: 0, reads: 0 } },
      { text: 'A query asks for P7. The index says P7 is at page 12, item 3.', state: { slots: empty, hits: 0, reads: 0, query: "P7 → (12,3)", focus: 12 } },
      { text: 'Page 12 isn’t in shared buffers, so PostgreSQL reads all 8 kB of it from the table file into a free slot. That is one read.', state: { slots: [12, null, null, null], hits: 0, reads: 1, query: 'P7 → (12,3)', focus: 12, from: 12, outcome: { text: 'read', kind: 'miss' } } },
      { text: 'It finds item 3 on the page in memory and returns 20.00.', state: { slots: [12, null, null, null], hits: 0, reads: 1, query: 'P7 → (12,3)', row: '12-P7' } },
      { text: 'The next query asks for P3, at page 12, item 1. Page 12 is already in memory, so this is a hit. There is no disk access.', state: { slots: [12, null, null, null], hits: 1, reads: 1, query: 'P3 → (12,1)', row: '12-P3', outcome: { text: 'hit', kind: 'hit' } } },
      { text: 'P40 lives on page 31. That is another miss and another read.', state: { slots: [12, 31, null, null], hits: 1, reads: 2, query: 'P40 → (31,2)', focus: 31, from: 31, row: '31-P40', outcome: { text: 'read', kind: 'miss' } } },
      { text: 'Ask for P7 again and it is a hit.', state: { slots: [12, 31, null, null], hits: 2, reads: 2, query: 'P7 → (12,3)', row: '12-P7', outcome: { text: 'hit', kind: 'hit' } } },
    ];
  },
  stats: state => [
    { label: 'shared hit', value: String(state.hits) },
    { label: 'shared read', value: String(state.reads) },
    { label: 'Pages in memory', value: String(state.slots.filter(Boolean).length) },
  ],
  render: (state, W) => {
    const items: Item[] = [];
    const pad = W < 420 ? 10 : 14;
    const narrow = W < 420;
    items.push(text('q-label', pad, 14, 'QUERY', 'sf-t sf-lane'));
    if (state.query) {
      items.push(rect('q-bg', pad, 22, 130, 22, 'sf-bubble'));
      items.push(text('q', pad + 8, 37, state.query, 'sf-t sf-mono'));
    }
    if (state.outcome) {
      const cls = state.outcome.kind === 'hit' ? 'sf-reply-ok' : 'sf-reply-wait';
      items.push(rect('q-out-bg', pad + 140, 22, 56, 22, `sf-reply ${cls}`));
      items.push(text('q-out', pad + 168, 37, state.outcome.text, `sf-t sf-mid sf-strong`));
    }

    const memY = 54;
    const laneH = 112;
    const diskY = memY + laneH + 12;
    items.push(rect('lane-mem', 3, memY, W - 6, laneH, 'sf-lane-mem'));
    items.push(text('lane-mem-t', pad, memY + 16, narrow ? 'SHARED BUFFERS · memory' : 'SHARED BUFFERS · memory', 'sf-t sf-lane'));
    items.push(rect('lane-disk', 3, diskY, W - 6, laneH, 'sf-lane-disk'));
    items.push(text('lane-disk-t', pad, diskY + 16, 'TABLE FILE · disk', 'sf-t sf-lane'));

    const ph = 76;
    const slotGap = narrow ? 8 : 14;
    const sw = (W - pad * 2 - slotGap * 3) / 4;
    const fileGap = narrow ? 6 : 12;
    const ell = 18;
    const fw = (W - pad * 2 - fileGap * 4 - ell) / 5;
    const fileX = (i: number) => pad + i * (fw + fileGap) + (i === 4 ? ell : 0);
    const slotY = memY + 26;
    const fileY = diskY + 26;

    const miniPage = (prefix: string, page: number, x: number, y: number, w: number, from?: { x: number; y: number }, highlight = false) => {
      const off = (dx: number, dy: number) => (from ? { x: from.x + dx, y: from.y + dy } : undefined);
      items.push(rect(`${prefix}-bg`, x, y, w, ph, `sf-card${highlight ? ' sf-focus' : ''}`, { from: off(0, 0) }));
      items.push(text(`${prefix}-t`, x + w / 2, y + 15, `page ${page}`, 'sf-t sf-small sf-strong sf-mid', { from: off(w / 2, 15) }));
      const rows = PAGE_ROWS[page];
      for (let r = 0; r < 3; r++) {
        const label = rows ? rows[r] : '';
        const hot = rows && state.row === `${page}-${label}` && prefix.startsWith('s');
        items.push(rect(`${prefix}-r${r}`, x + 5, y + 24 + r * 16, w - 10, 12, hot ? 'sf-row sf-row-hot' : 'sf-row sf-row-live', { from: off(5, 24 + r * 16) }));
        if (label) items.push(text(`${prefix}-rt${r}`, x + 10, y + 34 + r * 16, label, 'sf-t sf-xs sf-mono', { from: off(10, 34 + r * 16) }));
      }
    };

    state.slots.forEach((page, i) => {
      const x = pad + i * (sw + slotGap);
      if (page === null) {
        items.push(rect(`slot-${i}`, x, slotY, sw, ph, 'sf-card sf-empty'));
        items.push(text(`slot-${i}-t`, x + sw / 2, slotY + ph / 2 + 4, 'free', 'sf-t sf-xs sf-mid sf-muted'));
      } else {
        const fi = FILE_PAGES.indexOf(page);
        miniPage(`s-${page}`, page, x, slotY, sw, { x: fileX(fi), y: fileY });
      }
    });
    FILE_PAGES.forEach((page, i) => miniPage(`f-${page}`, page, fileX(i), fileY, fw, undefined, state.focus === page));
    items.push(text('ellipsis', fileX(3) + fw + fileGap / 2 + ell / 2, fileY + ph / 2 + 4, '…', 'sf-t sf-mid sf-muted'));
    if (state.from !== undefined) {
      const fi = FILE_PAGES.indexOf(state.from);
      const slot = state.slots.indexOf(state.from);
      const sx = pad + slot * (sw + slotGap) + sw / 2;
      const fx = fileX(fi) + fw / 2;
      items.push(line(`copy-arrow-${state.from}`, fx, fileY - 3, sx, slotY + ph + 3, 'sf-arrow', { attrs: { 'marker-end': 'url(#sf-arrowhead)' } }));
    }
    return { items, height: diskY + laneH + 8 };
  },
};

/* ---------- Row versions ---------- */

type VRow = { item: number; label: string; price: string; xmin: string; xmax: string; kind: 'live' | 'uncommitted' | 'old' };
type VerState = { rows: VRow[]; readers: { id: string; letter: string; item: number }[]; note?: string };

const r = (item: number, label: string, price: string, xmin: string, xmax: string, kind: VRow['kind']): VRow => ({ item, label, price, xmin, xmax, kind });
const base3 = (xmax7 = '—'): VRow[] => [r(1, 'P3', '18.00', '790', '—', 'live'), r(2, 'P9', '9.50', '790', '—', 'live'), r(3, 'P7', '20.00', '790', xmax7, xmax7 === '—' ? 'live' : 'live')];

export const rowVersions: Scene<VerState> = {
  id: 'row-versions',
  steps: () => [
    { text: 'Page 12 holds three rows. Each row records xmin, the transaction that created it, and xmax, the transaction that replaced or deleted it. Nothing has replaced these rows yet.', state: { rows: base3(), readers: [{ id: 'Q', letter: 'Q', item: 3 }] } },
    { text: 'A report starts and takes a snapshot: a note of which transactions had committed at that moment. It reads P7 at 20.00.', state: { rows: base3(), readers: [{ id: 'R', letter: 'R', item: 3 }, { id: 'Q', letter: 'Q', item: 3 }] } },
    { text: 'Transaction 812 updates P7. PostgreSQL doesn’t overwrite item 3. It sets item 3’s xmax to 812 and adds item 4, a new version with xmin 812 and price 22.00.', state: { rows: [...base3('812'), r(4, 'P7', '22.00', '812', '—', 'uncommitted')], readers: [{ id: 'R', letter: 'R', item: 3 }, { id: 'Q', letter: 'Q', item: 3 }, { id: 'T', letter: 'T', item: 4 }] } },
    { text: 'Until 812 commits, other queries skip item 4 because its creator hasn’t committed. They still read 20.00. Transaction 812 reads its own 22.00.', state: { rows: [...base3('812'), r(4, 'P7', '22.00', '812', '—', 'uncommitted')], readers: [{ id: 'R', letter: 'R', item: 3 }, { id: 'Q', letter: 'Q', item: 3 }, { id: 'T', letter: 'T', item: 4 }] } },
    { text: '812 commits. A new query now reads item 4 at 22.00. Item 3 is an old version.', state: { rows: [r(1, 'P3', '18.00', '790', '—', 'live'), r(2, 'P9', '9.50', '790', '—', 'live'), r(3, 'P7', '20.00', '790', '812', 'old'), r(4, 'P7', '22.00', '812', '—', 'live')], readers: [{ id: 'R', letter: 'R', item: 3 }, { id: 'Q', letter: 'Q', item: 4 }] } },
    { text: 'The report’s snapshot was taken before 812 committed, so it keeps reading item 3 at 20.00 until it finishes.', state: { rows: [r(1, 'P3', '18.00', '790', '—', 'live'), r(2, 'P9', '9.50', '790', '—', 'live'), r(3, 'P7', '20.00', '790', '812', 'old'), r(4, 'P7', '22.00', '812', '—', 'live')], readers: [{ id: 'R', letter: 'R', item: 3 }, { id: 'Q', letter: 'Q', item: 4 }], note: 'R' } },
  ],
  stats: state => {
    const sees = (id: string) => {
      const reader = state.readers.find(rd => rd.id === id);
      return reader ? state.rows.find(row => row.item === reader.item)!.price : '—';
    };
    return [
      { label: 'Versions of P7 on the page', value: String(state.rows.filter(row => row.label === 'P7').length) },
      { label: 'Report (R) reads', value: sees('R') },
      { label: 'New query (Q) reads', value: sees('Q') },
    ];
  },
  render: (state, W) => {
    const items: Item[] = [];
    const pad = W < 420 ? 10 : 14;
    const narrow = W < 420;
    const cardW = Math.min(W - pad * 2, 520);
    const x = (W - cardW) / 2;
    const top = 10;
    const rowH = 30;
    const cols = narrow
      ? { item: x + 10, row: x + 40, xmin: x + 128, xmax: x + 172, readers: x + 214 }
      : { item: x + 16, row: x + 64, xmin: x + 190, xmax: x + 260, readers: x + 340 };
    items.push(rect('card', x, top, cardW, 44 + rowH * 4 + 10, 'sf-card'));
    items.push(text('card-t', x + 10, top + 18, 'page 12 · in shared buffers', 'sf-t sf-strong'));
    const hy = top + 38;
    items.push(text('h-item', cols.item, hy, 'item', 'sf-t sf-xs sf-muted'));
    items.push(text('h-row', cols.row, hy, 'row', 'sf-t sf-xs sf-muted'));
    items.push(text('h-xmin', cols.xmin, hy, 'xmin', 'sf-t sf-xs sf-muted'));
    items.push(text('h-xmax', cols.xmax, hy, 'xmax', 'sf-t sf-xs sf-muted'));
    items.push(text('h-readers', cols.readers, hy, 'who reads it', 'sf-t sf-xs sf-muted'));
    const rowY = (item: number) => top + 46 + (item - 1) * rowH;
    for (const row of state.rows) {
      const y = rowY(row.item);
      items.push(rect(`v-${row.item}`, x + 6, y, cardW - 12, rowH - 6, `sf-row sf-row-${row.kind === 'live' && row.item === 4 ? 'live-new' : row.kind}`, { from: { x: x + 6, y: y - 10 } }));
      items.push(text(`v-${row.item}-i`, cols.item + 4, y + 16, String(row.item), 'sf-t sf-mono'));
      items.push(text(`v-${row.item}-r`, cols.row, y + 16, `${row.label}  ${row.price}`, `sf-t sf-mono sf-row-text-${row.kind}`));
      items.push(text(`v-${row.item}-xmin`, cols.xmin, y + 16, row.xmin, 'sf-t sf-mono'));
      items.push(text(`v-${row.item}-xmax`, cols.xmax, y + 16, row.xmax, `sf-t sf-mono${row.xmax !== '—' ? ' sf-strong' : ' sf-muted'}`));
      if (row.kind === 'old') items.push(line(`v-${row.item}-strike`, cols.row - 2, y + 12, cols.row + 72, y + 12, 'sf-strike'));
      if (row.kind === 'uncommitted' && !narrow) items.push(text(`v-${row.item}-tag`, cols.xmax + 30, y + 16, 'not committed', 'sf-t sf-xs sf-muted'));
    }
    const order = ['R', 'T', 'Q'];
    for (const reader of state.readers) {
      const y = rowY(reader.item);
      const bx = cols.readers + order.indexOf(reader.id) * 28;
      const emph = state.note === reader.id ? ' sf-reader-emph' : '';
      items.push(rect(`reader-${reader.id}`, bx, y + 3, 22, 18, `sf-reader sf-reader-${reader.id}${emph}`, { from: { x: bx, y: y - 16 } }));
      items.push(text(`reader-${reader.id}-t`, bx + 11, y + 16, reader.letter, 'sf-t sf-strong sf-mid sf-reader-text', { from: { x: bx + 11, y: y - 3 } }));
    }
    const ly = top + 44 + rowH * 4 + 30;
    const legend = narrow
      ? ['R  report, snapshot from before the update', 'T  transaction 812, doing the update', 'Q  a new query']
      : ['R  report with a snapshot from before the update', 'T  transaction 812, doing the update', 'Q  a new query'];
    legend.forEach((entry, i) => items.push(text(`legend-${i}`, x + 4, ly + i * 17, entry, 'sf-t sf-xs')));
    return { items, height: ly + 17 * 3 };
  },
};

/* ---------- Vacuum ---------- */

type Slot = { key: string; label: string; price: string; kind: 'live' | 'dead' | 'needed' } | null;
type VacState = { p12: Slot[]; p13: Slot[]; index: string[]; report: boolean; banner?: string; pruned?: boolean };

const other = (key: string, label: string, price: string): Slot => ({ key, label, price, kind: 'live' });
const v = (price: string, kind: 'live' | 'dead' | 'needed'): Slot => ({ key: `p7-${price}`, label: 'P7', price, kind });
const pad6 = (slots: Slot[]) => [...slots, ...Array(6 - slots.length).fill(null)].slice(0, 6);

export const vacuum: Scene<VacState> = {
  id: 'vacuum',
  params: [{
    id: 'snapshot', label: 'Meanwhile', initial: 'none',
    options: [{ value: 'none', label: 'no long-running report' }, { value: 'held', label: 'a report holds an old snapshot' }],
  }],
  steps: ({ snapshot }) => {
    const held = snapshot === 'held';
    const deadKind = held ? 'needed' : 'dead';
    const P3 = other('p3', 'P3', '18.00');
    const P9 = other('p9', 'P9', '9.50');
    const p13base = [other('p15', 'P15', '4.00'), other('p16', 'P16', '6.50')];
    const prices = ['20.00', '22.00', '23.00', '24.00'];
    const chain = (upto: number) => prices.slice(0, upto + 1).map((price, i) => v(price, i === upto ? 'live' : deadKind));
    const steps: Step<VacState>[] = [];
    const idx1 = ['P7 → (12,3)'];
    steps.push({ text: held ? 'Page 12 has room for six row versions in this drawing. A report started before any of the updates below, and it is still running.' : 'Page 12 has room for six row versions in this drawing. P3, P9 and P7 use three of them.', state: { p12: pad6([P3, P9, ...chain(0)]), p13: pad6(p13base), index: idx1, report: held } });
    [1, 2, 3].forEach(i => {
      const tail = i === 3 ? ' Page 12 is now full.' : '';
      const lead = i === 1
        ? `P7 changes to ${prices[i]}. The 20.00 version is now ${held ? 'old, but the report still reads it.' : 'dead: no transaction can see it any more.'}`
        : `P7 changes to ${prices[i]}. Another new version, another old one.`;
      steps.push({ text: lead + tail, state: { p12: pad6([P3, P9, ...chain(i)]), p13: pad6(p13base), index: idx1, report: held } });
    });
    if (!held) {
      steps.push({ text: 'The next update needs space. PostgreSQL first prunes page 12: the 20.00, 22.00 and 23.00 versions are invisible to every transaction, so their space is reclaimed.', state: { p12: pad6([P3, P9, v('24.00', 'live')]), p13: pad6(p13base), index: idx1, report: false, pruned: true } });
      steps.push({ text: 'P7 changes to 25.00, and the new version fits on page 12. This is a HOT update: the index entry still leads to the right place, so no new one is needed.', state: { p12: pad6([P3, P9, v('24.00', 'dead'), v('25.00', 'live')]), p13: pad6(p13base), index: idx1, report: false } });
      steps.push({ text: 'P7 changes to 26.00. Still on page 12, still one index entry. The table has not grown.', state: { p12: pad6([P3, P9, v('24.00', 'dead'), v('25.00', 'dead'), v('26.00', 'live')]), p13: pad6(p13base), index: idx1, report: false } });
    } else {
      const full = pad6([P3, P9, ...prices.map(price => v(price, 'needed'))]);
      const idx2 = ['P7 → (12,3)', 'P7 → (13,3)'];
      steps.push({ text: 'The next update needs space, and pruning can’t help. The report’s snapshot is older than all these updates, so none of the old versions can be removed yet. P7 at 25.00 goes to page 13, and the index gains a second entry for P7.', state: { p12: full, p13: pad6([...p13base, v('25.00', 'live')]), index: idx2, report: true } });
      steps.push({ text: 'P7 changes to 26.00, on page 13 this time. Old versions now fill page 12 and part of page 13.', state: { p12: full, p13: pad6([...p13base, v('25.00', 'needed'), v('26.00', 'live')]), index: idx2, report: true } });
      steps.push({ text: 'The report finishes. Every old version of P7 is now dead.', state: { p12: pad6([P3, P9, ...prices.map(price => v(price, 'dead'))]), p13: pad6([...p13base, v('25.00', 'dead'), v('26.00', 'live')]), index: idx2, report: false } });
      steps.push({ text: 'VACUUM removes the dead versions and the index entry that led to them. Page 12 has free space again, but the table file stays two pages long.', state: { p12: pad6([P3, P9]), p13: pad6([...p13base, null, v('26.00', 'live')]), index: ['P7 → (13,3)'], report: false, pruned: true } });
    }
    return steps;
  },
  stats: state => {
    const all = [...state.p12, ...state.p13].filter(Boolean) as Exclude<Slot, null>[];
    const p7Pages = [state.p12, state.p13].filter(page => page.some(slot => slot?.label === 'P7')).length;
    return [
      { label: 'Old versions of P7', value: String(all.filter(slot => slot.label === 'P7' && slot.kind !== 'live').length) },
      { label: 'Pages holding P7', value: String(p7Pages) },
      { label: 'Index entries for P7', value: String(state.index.length) },
    ];
  },
  render: (state, W) => {
    const items: Item[] = [];
    const pad = W < 420 ? 10 : 14;
    const gap = W < 420 ? 10 : 24;
    const cw = Math.min(230, (W - pad * 2 - gap) / 2);
    const left = (W - (cw * 2 + gap)) / 2;
    const top = 8;
    // Index
    items.push(text('ix-t', left, top + 12, 'INDEX ON product_id', 'sf-t sf-lane'));
    state.index.forEach((entry, i) => {
      items.push(rect(`ix-${entry}`, left + i * 118, top + 20, 110, 20, 'sf-rec sf-rec-rec', { from: { x: left + i * 118, y: top + 8 } }));
      items.push(text(`ix-${entry}-t`, left + i * 118 + 8, top + 34, entry, 'sf-t sf-xs sf-mono sf-rec-text-rec', { from: { x: left + i * 118 + 8, y: top + 22 } }));
    });
    if (state.report) {
      items.push(rect('report', W - pad - 96, top, 96, 18, 'sf-reader sf-reader-R'));
      items.push(text('report-t', W - pad - 48, top + 13, 'report running', 'sf-t sf-xs sf-mid sf-reader-text'));
    }
    const cardY = top + 56;
    const slotH = 22;
    const cardH = 26 + slotH * 6 + 8;
    const draw = (page: number, slots: Slot[], x: number) => {
      items.push(rect(`pg-${page}`, x, cardY, cw, cardH, 'sf-card'));
      items.push(text(`pg-${page}-t`, x + 8, cardY + 17, `page ${page}`, 'sf-t sf-strong'));
      slots.forEach((slot, i) => {
        const y = cardY + 26 + i * slotH;
        if (!slot) {
          items.push(rect(`free-${page}-${i}`, x + 6, y, cw - 12, slotH - 4, 'sf-slot-free'));
          return;
        }
        const k = `${page}-${slot.key}`;
        items.push(rect(k, x + 6, y, cw - 12, slotH - 4, `sf-row sf-row-${slot.kind === 'live' ? 'live' : slot.kind === 'dead' ? 'dead' : 'old'}`, { from: { x: x + 6, y: y - 10 } }));
        items.push(text(`${k}-t`, x + 12, y + 13, `${slot.label}  ${slot.price}`, `sf-t sf-mono sf-xs sf-row-text-${slot.kind === 'live' ? 'live' : 'old'}`, { from: { x: x + 12, y: y + 3 } }));
        const tag = slot.kind === 'dead' ? 'dead' : slot.kind === 'needed' ? 'old, still needed' : '';
        if (tag && cw > 150) items.push(text(`${k}-tag`, x + cw - 12, y + 13, tag, 'sf-t sf-xs sf-end sf-muted'));
        else if (tag) items.push(text(`${k}-tag`, x + cw - 12, y + 13, slot.kind === 'dead' ? 'dead' : 'needed', 'sf-t sf-xs sf-end sf-muted'));
      });
    };
    draw(12, state.p12, left);
    draw(13, state.p13, left + cw + gap);
    return { items, height: cardY + cardH + 10 };
  },
};
