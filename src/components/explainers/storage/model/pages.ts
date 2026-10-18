/*
 * Scenes about where rows live: filling 8 kB pages, keeping old row versions
 * in PostgreSQL and InnoDB, reading pages into shared buffers, and who writes
 * a dirty page when a query needs its slot.
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

/* ---------- Row versions ---------- */

type VKind = 'live' | 'uncommitted' | 'old' | 'live-new';
/** A row on page 12 (slot 0 to 3) or a record in the undo log (slot 0). */
type VRow = { key: string; slot: number; label: string; price: string; kind: VKind; tag?: string };
type ReaderId = 'R' | 'Q';
type VerState = {
  sent?: string;
  page: VRow[];
  undo: VRow[];
  pointer?: boolean;
  readers: { id: ReaderId; key: string }[];
  emph?: ReaderId;
};

const vr = (key: string, slot: number, label: string, price: string, kind: VKind = 'live', tag?: string): VRow => ({ key, slot, label, price, kind, tag });
const OTHERS = [vr('v1', 0, 'P3', '18.00'), vr('v2', 1, 'P9', '9.50')];
const P7_OLD = (kind: VKind = 'live', tag?: string) => vr('v3', 2, 'P7', '20.00', kind, tag);
const SENT_UPD = 'UPDATE P7 → 22.00';

export const rowVersions: Scene<VerState> = {
  id: 'row-versions',
  params: [{
    id: 'engine', label: 'Engine', initial: 'postgres',
    options: [{ value: 'postgres', label: 'PostgreSQL' }, { value: 'innodb', label: 'InnoDB' }],
  }],
  steps: ({ engine }) => {
    const start: Step<VerState> = {
      text: 'Page 12 holds P7 at 20.00. A long report starts and takes its snapshot. It reads 20.00.',
      state: { page: [...OTHERS, P7_OLD()], undo: [], readers: [{ id: 'R', key: 'v3' }] },
    };
    if (engine === 'innodb') {
      const undoRec = vr('u1', 0, 'P7', '20.00', 'old', 'before 812');
      const changed = (kind: VKind, tag?: string) => vr('v3', 2, 'P7', '22.00', kind, tag);
      return [
        start,
        { text: 'Transaction 812 updates P7. InnoDB first copies the old value, 20.00, into an undo record.', state: { sent: SENT_UPD, page: [...OTHERS, P7_OLD()], undo: [undoRec], readers: [{ id: 'R', key: 'v3' }] } },
        { text: 'Then it changes the row on the page to 22.00 and points the row at the undo record. The report now reads 20.00 from there.', state: { sent: SENT_UPD, page: [...OTHERS, changed('uncommitted', 'not committed')], undo: [undoRec], pointer: true, readers: [{ id: 'R', key: 'u1' }] } },
        { text: '812 commits. A query that starts now reads the row on the page: 22.00.', state: { sent: 'COMMIT', page: [...OTHERS, changed('live-new')], undo: [undoRec], pointer: true, readers: [{ id: 'R', key: 'u1' }, { id: 'Q', key: 'v3' }] } },
        { text: 'The report’s snapshot is older than the commit, so InnoDB follows the pointer and rebuilds 20.00 from the undo record. Page 12 holds only one copy of P7.', state: { sent: 'COMMIT', page: [...OTHERS, changed('live-new')], undo: [undoRec], pointer: true, readers: [{ id: 'R', key: 'u1' }, { id: 'Q', key: 'v3' }], emph: 'R' } },
        { text: 'The report finishes. No snapshot needs the undo record now, so purge discards it.', state: { sent: 'COMMIT', page: [...OTHERS, changed('live-new')], undo: [], readers: [{ id: 'Q', key: 'v3' }] } },
      ];
    }
    const NEW = (kind: VKind, tag?: string) => vr('v4', 3, 'P7', '22.00', kind, tag);
    return [
      start,
      { text: 'Transaction 812 updates P7. PostgreSQL leaves the 20.00 version where it is, marks it as replaced by 812, and adds a new version, 22.00, to the same page.', state: { sent: SENT_UPD, page: [...OTHERS, P7_OLD('live', 'replaced by 812'), NEW('uncommitted', 'not committed')], undo: [], readers: [{ id: 'R', key: 'v3' }] } },
      { text: '812 commits. A query that starts now reads the new version: 22.00.', state: { sent: 'COMMIT', page: [...OTHERS, P7_OLD('old', 'old version'), NEW('live-new')], undo: [], readers: [{ id: 'R', key: 'v3' }, { id: 'Q', key: 'v4' }] } },
      { text: 'The report’s snapshot is older than the commit, so it still reads the 20.00 version. Both versions sit on page 12.', state: { sent: 'COMMIT', page: [...OTHERS, P7_OLD('old', 'old version'), NEW('live-new')], undo: [], readers: [{ id: 'R', key: 'v3' }, { id: 'Q', key: 'v4' }], emph: 'R' } },
      { text: 'The report finishes. No snapshot can see 20.00 now, so VACUUM removes that version, and its space can be reused.', state: { sent: 'COMMIT', page: [...OTHERS, NEW('live-new')], undo: [], readers: [{ id: 'Q', key: 'v4' }] } },
    ];
  },
  outline: () => [
    'A long report takes its snapshot while P7 costs 20.00. Then transaction 812 changes P7 to 22.00 and commits, and a new query starts.',
    'PostgreSQL: the update adds a second version of P7, 22.00, to page 12 and marks the 20.00 version as replaced. The report keeps reading the 20.00 version on the page; the new query reads 22.00. When the report finishes, VACUUM removes the old version.',
    'InnoDB: the update copies 20.00 into an undo record, then changes the row on page 12 to 22.00, with a pointer to the undo record. The new query reads 22.00 on the page; the report follows the pointer and rebuilds 20.00. When the report finishes, purge discards the undo record.',
  ],
  stats: state => {
    const reads = (id: ReaderId) => {
      const reader = state.readers.find(r => r.id === id);
      if (!reader) return id === 'R' ? 'finished' : '—';
      return [...state.page, ...state.undo].find(row => row.key === reader.key)?.price ?? '—';
    };
    return [
      { label: 'Copies of P7 on page 12', value: String(state.page.filter(row => row.label === 'P7').length) },
      { label: 'Report (R) reads', value: reads('R') },
      { label: 'New query (Q) reads', value: reads('Q') },
    ];
  },
  render: (state, W, { engine }) => {
    const items: Item[] = [];
    const narrow = W < 540;
    const pad = narrow ? 10 : 14;
    const innodb = engine === 'innodb';

    items.push(text('tx-label', pad, 14, 'TRANSACTION 812', 'sf-t sf-lane'));
    if (state.sent) {
      const bw = Math.min(W * 0.55, 170);
      items.push(rect('tx-bg', pad, 22, bw, 22, 'sf-bubble'));
      items.push(text('tx-sent', pad + 8, 37, state.sent, 'sf-t sf-mono'));
    }

    const rowH = 24;
    const top = 58;
    const pageH = 30 + rowH * 4 + 6;
    const pageW = narrow ? W - pad * 2 : (W - pad * 3) * 0.56;
    const px = pad;
    const undoX = narrow ? pad : px + pageW + pad;
    const undoY = narrow ? top + pageH + 30 : top;
    const undoW = narrow ? W - pad * 2 : W - pad - undoX;
    const undoH = 30 + rowH + (innodb && !narrow ? 24 : 10);
    const chips = 56;

    const rowItems = (row: VRow, x: number, y: number, w: number) => {
      items.push(rect(`${row.key}-bg`, x + 6, y, w - 12, rowH - 5, `sf-row sf-row-${row.kind}`, { from: { x: x + 6, y: y - 10 } }));
      items.push(text(`${row.key}-t`, x + 12, y + 14, `${row.label}  ${row.price}`, `sf-t sf-mono sf-row-text-${row.kind}`, { from: { x: x + 12, y: y + 4 } }));
      if (row.tag) items.push(text(`${row.key}-tag`, x + w - 12 - chips, y + 14, row.tag, 'sf-t sf-xs sf-end sf-muted'));
    };
    const rowY = (slot: number) => top + 28 + slot * rowH;
    const undoRowY = undoY + 28;

    // Page 12
    items.push(rect('page', px, top, pageW, pageH, 'sf-card'));
    items.push(text('page-t', px + 8, top + 17, 'page 12', 'sf-t sf-strong'));
    for (let slot = 0; slot < 4; slot++) {
      const row = state.page.find(r => r.slot === slot);
      if (row) rowItems(row, px, rowY(slot), pageW);
      else items.push(rect(`free-${slot}`, px + 6, rowY(slot), pageW - 12, rowH - 5, 'sf-slot-free'));
    }

    // Undo log
    items.push(rect('undo', undoX, undoY, undoW, undoH, innodb ? 'sf-card sf-walframe' : 'sf-card sf-empty'));
    items.push(text('undo-t', undoX + 8, undoY + 17, 'Undo log', 'sf-t sf-strong'));
    if (!innodb) {
      items.push(text('undo-none', undoX + 8, undoRowY + 14, narrow ? 'none: old versions stay on the page' : 'none: old versions stay in the table', 'sf-t sf-xs sf-muted'));
    }
    state.undo.forEach(row => rowItems(row, undoX, undoRowY, undoW));

    // InnoDB's pointer from the row to its undo record
    if (state.pointer) {
      const from = rowY(2);
      if (narrow) {
        const x = px + 100;
        items.push(line('ptr', x, from + rowH - 4, x, undoRowY - 3, 'sf-arrow', { attrs: { 'marker-end': 'url(#sf-arrowhead)' } }));
        items.push(text('ptr-t', x + 8, (from + rowH + undoRowY) / 2 + 2, 'pointer to the undo record', 'sf-t sf-xs sf-arrow-text'));
      } else {
        items.push(line('ptr', px + pageW - 4, from + 9, undoX + 4, undoRowY + 9, 'sf-arrow', { attrs: { 'marker-end': 'url(#sf-arrowhead)' } }));
        items.push(text('ptr-t', undoX + 12, undoRowY + rowH + 12, '← pointer from the row', 'sf-t sf-xs sf-arrow-text'));
      }
    }

    // Readers
    const order: ReaderId[] = ['R', 'Q'];
    for (const reader of state.readers) {
      const onPage = state.page.find(r => r.key === reader.key);
      const y = onPage ? rowY(onPage.slot) : undoRowY;
      const right = onPage ? px + pageW : undoX + undoW;
      const bx = right - 12 - chips + 6 + order.indexOf(reader.id) * 26;
      const emph = state.emph === reader.id ? ' sf-reader-emph' : '';
      items.push(rect(`reader-${reader.id}`, bx, y + 1, 22, 17, `sf-reader sf-reader-${reader.id}${emph}`, { from: { x: bx, y: y - 14 } }));
      items.push(text(`reader-${reader.id}-t`, bx + 11, y + 14, reader.id, 'sf-t sf-strong sf-mid sf-reader-text', { from: { x: bx + 11, y: y - 1 } }));
    }

    // Legend
    const ly = Math.max(top + pageH, undoY + undoH) + (narrow ? 22 : 30);
    const legend: [ReaderId, string][] = [['R', 'report, snapshot taken before the update'], ['Q', 'query that starts after the commit']];
    legend.forEach(([id, label], i) => {
      const lx = narrow ? pad : pad + i * 300;
      const y = narrow ? ly + i * 22 : ly;
      items.push(rect(`lg-${id}`, lx, y - 12, 22, 17, `sf-reader sf-reader-${id}`));
      items.push(text(`lg-${id}-t`, lx + 11, y + 1, id, 'sf-t sf-strong sf-mid sf-reader-text'));
      items.push(text(`lg-${id}-l`, lx + 30, y + 1, label, 'sf-t sf-xs'));
    });
    return { items, height: ly + (narrow ? 32 : 12) };
  },
};

/* ---------- Buffer pool drawing, shared by the read and eviction scenes ---------- */

type BufState = {
  slots: (number | null)[];
  query?: string;
  hits: number;
  reads: number;
  focus?: number;
  row?: string;
  from?: number;
  outcome?: { text: string; kind: 'hit' | 'miss' };
  /** Pages in the pool that have changed since they were read. */
  dirty?: number[];
  /** A slot's page to outline, for the page about to be evicted. */
  slotFocus?: number;
  /** A page being written from its slot to the table file, and who writes it. */
  write?: { page: number; by: string };
  /** Counters for the eviction scene. */
  waited?: number;
  ahead?: number;
};

const FILE_PAGES = [10, 11, 12, 13, 31];
const PAGE_ROWS: Record<number, string[]> = { 12: ['P3', 'P9', 'P7'], 13: ['P48', 'P50', 'P52'], 31: ['P38', 'P40', 'P41'] };

function renderPool(state: BufState, W: number): Frame {
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
    const ow = Math.max(56, 16 + state.outcome.text.length * 7);
    items.push(rect('q-out-bg', pad + 140, 22, ow, 22, `sf-reply ${cls}`));
    items.push(text('q-out', pad + 140 + ow / 2, 37, state.outcome.text, `sf-t sf-mid sf-strong`));
  }

  const memY = 54;
  const laneH = state.dirty ? 122 : 112;
  // The eviction scene leaves room between the lanes to label a write.
  const diskY = memY + laneH + (state.dirty ? 24 : 12);
  items.push(rect('lane-mem', 3, memY, W - 6, laneH, 'sf-lane-mem'));
  items.push(text('lane-mem-t', pad, memY + 16, 'SHARED BUFFERS · memory', 'sf-t sf-lane'));
  items.push(rect('lane-disk', 3, diskY, W - 6, 112, 'sf-lane-disk'));
  items.push(text('lane-disk-t', pad, diskY + 16, 'TABLE FILE · disk', 'sf-t sf-lane'));

  const ph = 76;
  const slotGap = narrow ? 8 : 14;
  const sw = (W - pad * 2 - slotGap * 3) / 4;
  const fileGap = narrow ? 6 : 12;
  const ell = 18;
  const fw = (W - pad * 2 - fileGap * 4 - ell) / 5;
  const fileX = (i: number) => pad + i * (fw + fileGap) + (i === 4 ? ell : 0);
  const slotX = (i: number) => pad + i * (sw + slotGap);
  const slotY = memY + 26;
  const fileY = diskY + 26;

  const miniPage = (prefix: string, page: number, x: number, y: number, w: number, from?: { x: number; y: number }, highlight = false, dirty = false) => {
    const off = (dx: number, dy: number) => (from ? { x: from.x + dx, y: from.y + dy } : undefined);
    items.push(rect(`${prefix}-bg`, x, y, w, ph, `sf-card${dirty ? ' sf-dirty' : ''}${highlight ? ' sf-focus' : ''}`, { from: off(0, 0) }));
    items.push(text(`${prefix}-t`, x + w / 2, y + 15, `page ${page}`, 'sf-t sf-small sf-strong sf-mid', { from: off(w / 2, 15) }));
    const rows = PAGE_ROWS[page];
    for (let r = 0; r < 3; r++) {
      const label = rows ? rows[r] : '';
      const hot = rows && state.row === `${page}-${label}` && prefix.startsWith('s');
      items.push(rect(`${prefix}-r${r}`, x + 5, y + 24 + r * 16, w - 10, 12, hot ? 'sf-row sf-row-hot' : 'sf-row sf-row-live', { from: off(5, 24 + r * 16) }));
      if (label) items.push(text(`${prefix}-rt${r}`, x + 10, y + 34 + r * 16, label, 'sf-t sf-xs sf-mono', { from: off(10, 34 + r * 16) }));
    }
    if (dirty) {
      items.push(rect(`${prefix}-dirty-bg`, x + w / 2 - 18, y + ph - 6, 36, 14, 'sf-tag-dirty'));
      items.push(text(`${prefix}-dirty`, x + w / 2, y + ph + 4.5, 'dirty', 'sf-t sf-xs sf-mid sf-on-dirty'));
    }
  };

  state.slots.forEach((page, i) => {
    const x = slotX(i);
    if (page === null) {
      items.push(rect(`slot-${i}`, x, slotY, sw, ph, 'sf-card sf-empty'));
      items.push(text(`slot-${i}-t`, x + sw / 2, slotY + ph / 2 + 4, 'free', 'sf-t sf-xs sf-mid sf-muted'));
    } else {
      const fi = FILE_PAGES.indexOf(page);
      miniPage(`s-${page}`, page, x, slotY, sw, { x: fileX(fi), y: fileY }, state.slotFocus === page, state.dirty?.includes(page));
    }
  });
  FILE_PAGES.forEach((page, i) => miniPage(`f-${page}`, page, fileX(i), fileY, fw, undefined, state.focus === page || state.write?.page === page));
  items.push(text('ellipsis', fileX(3) + fw + fileGap / 2 + ell / 2, fileY + ph / 2 + 4, '…', 'sf-t sf-mid sf-muted'));
  if (state.from !== undefined) {
    const fi = FILE_PAGES.indexOf(state.from);
    const slot = state.slots.indexOf(state.from);
    const sx = slotX(slot) + sw / 2;
    const fx = fileX(fi) + fw / 2;
    items.push(line(`copy-arrow-${state.from}`, fx, fileY - 3, sx, slotY + ph + 3, 'sf-arrow', { attrs: { 'marker-end': 'url(#sf-arrowhead)' } }));
  }
  if (state.write) {
    const fi = FILE_PAGES.indexOf(state.write.page);
    const slot = state.slots.indexOf(state.write.page);
    const sx = slotX(slot) + sw / 2;
    const fx = fileX(fi) + fw / 2;
    const y1 = slotY + ph + (state.dirty ? 12 : 3);
    items.push(line(`write-arrow-${state.write.page}`, sx, y1, fx, fileY - 3, 'sf-arrow', { attrs: { 'marker-end': 'url(#sf-arrowhead)' } }));
    // Label the arrow in the gap between the lanes, just left of where it crosses.
    const ly = memY + laneH + 16;
    const ax = sx + ((ly - 13 - y1) / (fileY - 3 - y1)) * (fx - sx);
    items.push(text(`write-t-${state.write.page}`, ax - 6, ly, state.write.by, 'sf-t sf-xs sf-arrow-text sf-end'));
  }
  return { items, height: diskY + 112 + 8 };
}

/* ---------- Buffer read ---------- */

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
  render: renderPool,
};

/* ---------- Who writes a dirty page ---------- */

export const dirtyEvict: Scene<BufState> = {
  id: 'dirty-evict',
  params: [{
    id: 'writer', label: 'Background writer', initial: 'behind',
    options: [{ value: 'behind', label: 'fell behind' }, { value: 'ahead', label: 'kept up' }],
  }],
  steps: ({ writer }) => {
    const full = [12, 31, 10, 11];
    const after = [12, 13, 10, 11];
    const base = { hits: 0, reads: 0, waited: 0, ahead: 0 };
    const q = 'P50 → (13,2)';
    const steps: Step<BufState>[] = [{
      text: 'The four slots from Figure 2, all in use. Every page in them has changed since it was read, so all four are dirty.',
      state: { ...base, slots: full, dirty: [12, 31, 10, 11] },
    }];
    if (writer === 'ahead') {
      const dirty = [12, 10, 11];
      steps.push(
        { text: 'Before any query needs a slot, the background writer looks at the pages next in line for eviction. Page 31 is one, and it is dirty, so the writer writes it out.', state: { ...base, slots: full, dirty: [12, 31, 10, 11], write: { page: 31, by: 'background writer' } } },
        { text: 'Page 31 stays in memory, clean again. No query waited for that write.', state: { ...base, slots: full, dirty, ahead: 1 } },
        { text: 'A query asks for P50, on page 13. Page 13 isn’t in memory, and there is no free slot.', state: { ...base, slots: full, dirty, ahead: 1, query: q, focus: 13 } },
        { text: 'The pool picks page 31 to evict, as in Figure 2. It is clean, so its slot can be reused at once.', state: { ...base, slots: full, dirty, ahead: 1, query: q, focus: 13, slotFocus: 31 } },
        { text: 'The query reads page 13 into the slot. It waited for one read and no write.', state: { ...base, slots: after, dirty, ahead: 1, reads: 1, query: q, from: 13, row: '13-P50', outcome: { text: 'read', kind: 'miss' } } },
      );
      return steps;
    }
    const dirty = [12, 31, 10, 11];
    steps.push(
      { text: 'A query asks for P50, on page 13. Page 13 isn’t in memory, and there is no free slot.', state: { ...base, slots: full, dirty, query: q, focus: 13 } },
      { text: 'The pool picks page 31 to evict, as in Figure 2. But page 31 is dirty: its latest changes exist only here and in the log, so its slot can’t simply be reused.', state: { ...base, slots: full, dirty, query: q, focus: 13, slotFocus: 31 } },
      { text: 'So the query writes page 31 out itself, and waits until the write is done.', state: { ...base, slots: full, dirty, query: q, write: { page: 31, by: 'query writes it' }, waited: 1, outcome: { text: 'writing 31', kind: 'miss' } } },
      { text: 'Only then can it read page 13 into the slot. The read had to wait for a write first.', state: { ...base, slots: after, dirty: [12, 10, 11], waited: 1, reads: 1, query: q, from: 13, row: '13-P50', outcome: { text: 'read', kind: 'miss' } } },
    );
    return steps;
  },
  outline: () => [
    'The four buffer slots from Figure 2 hold pages 12, 31, 10 and 11, all dirty. A query needs page 13, and no slot is free.',
    'If background writing fell behind: the page chosen for eviction, 31, is dirty, so the query writes it out and waits, then reads page 13. One read waited for a write.',
    'If the background writer kept up: it wrote page 31 earlier, so page 31 is clean when the query needs its slot. The query reads page 13 without waiting for any write.',
  ],
  stats: state => [
    { label: 'Dirty pages in memory', value: String(state.dirty?.length ?? 0) },
    { label: 'Written ahead in the background', value: String(state.ahead ?? 0) },
    { label: 'Writes the query waited for', value: String(state.waited ?? 0) },
  ],
  render: renderPool,
};
