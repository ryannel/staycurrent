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
      text: `An empty table file. Each row here takes ${fmt(tb)} bytes on the page, plus a 4-byte line pointer.`,
      state: { data: d, n: 0 },
    }];
    for (let n = 1; n <= total; n++) {
      const page = Math.floor((n - 1) / per);
      const item = ((n - 1) % per) + 1;
      if (item === 1 && page > 0) {
        const free = PAGE - HEADER - per * (tb + POINTER);
        steps.push({ text: `Page ${page - 1} has ${fmt(free)} bytes left, too few for another row and pointer. Row ${n} starts page ${page}.`, state: { data: d, n } });
      } else {
        steps.push({ text: `Row ${n}: page ${page}, item ${item}.`, state: { data: d, n }, fast: true });
      }
    }
    return steps;
  },
  interval: ({ data }) => Math.max(30, Math.min(900, 3200 / rowsPerPage(Number(data)))),
  outline: () => [
    'Three empty 8 kB pages. Each starts with a 24-byte header.',
    'Each inserted row adds a 4-byte line pointer after the header and puts the row at the end of the free space, so the two grow towards each other.',
    'With 100 bytes of data a row takes 128 bytes, plus a 4-byte pointer: 132 in all. So 61 rows fit before page 0 is full and row 62 starts page 1.',
    'With 40-byte rows, 120 fit on a page; with 250-byte rows, 28; with 1,000-byte rows, 7; with 2,000-byte rows, 4.',
  ],
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
const PAGE_ROWS: Record<number, string[]> = { 12: ['P3', 'P9', 'P7'], 13: ['P48', 'P50', 'P52'], 31: ['P38', 'P40', 'P41'] };

export const bufferRead: Scene<BufState> = {
  id: 'buffer-read',
  steps: () => {
    const empty = [null, null, null, null];
    return [
      { text: 'Shared buffers start empty. This drawing has four slots.', state: { slots: empty, hits: 0, reads: 0 } },
      { text: 'A query asks for P7. The index says it is at page 12, item 3.', state: { slots: empty, hits: 0, reads: 0, query: "P7 → (12,3)", focus: 12 } },
      { text: 'Page 12 isn’t in memory, so PostgreSQL reads all 8 kB of it from the table file into a free slot. That is one read.', state: { slots: [12, null, null, null], hits: 0, reads: 1, query: 'P7 → (12,3)', focus: 12, from: 12, outcome: { text: 'read', kind: 'miss' } } },
      { text: 'It finds item 3 on the page in memory and returns 20.00.', state: { slots: [12, null, null, null], hits: 0, reads: 1, query: 'P7 → (12,3)', row: '12-P7' } },
      { text: 'The next query asks for P3, also on page 12. The page is already in memory, so this is a hit.', state: { slots: [12, null, null, null], hits: 1, reads: 1, query: 'P3 → (12,1)', row: '12-P3', outcome: { text: 'hit', kind: 'hit' } } },
      { text: 'P40 lives on page 31, which isn’t in memory either. That is another read.', state: { slots: [12, 31, null, null], hits: 1, reads: 2, query: 'P40 → (31,2)', focus: 31, from: 31, row: '31-P40', outcome: { text: 'read', kind: 'miss' } } },
      { text: 'P7 again: a hit.', state: { slots: [12, 31, null, null], hits: 2, reads: 2, query: 'P7 → (12,3)', row: '12-P7', outcome: { text: 'hit', kind: 'hit' } } },
      { text: 'Other queries read pages 10 and 11. All four slots are now in use.', state: { slots: [12, 31, 10, 11], hits: 2, reads: 4 } },
      { text: 'P50 is on page 13, and no slot is free. The pool evicts a page that has been used little. Page 12 was used three times and stays; page 31 goes, and page 13 takes its slot.', state: { slots: [12, 13, 10, 11], hits: 2, reads: 5, query: 'P50 → (13,2)', focus: 13, from: 13, row: '13-P50', outcome: { text: 'read', kind: 'miss' } } },
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
