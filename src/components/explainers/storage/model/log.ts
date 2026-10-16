/*
 * Scenes about the log after the commit: checkpoints, torn pages, and the
 * path a flushed WAL record takes through the operating system and drive.
 */
import { rect, text, type Item, type Frame } from './draw';
import type { Scene, Step } from './types';

/* ---------- Checkpoints ---------- */

/** Forty price changes, each to a product on one of pages 10 to 15. Page 12 holds P7. */
export const TOUCHES = [12, 10, 12, 14, 11, 12, 10, 13, 15, 12, 11, 10, 14, 12, 13, 12, 10, 15, 11, 12, 14, 10, 12, 13, 11, 12, 15, 10, 12, 14, 13, 12, 10, 11, 12, 15, 14, 12, 10, 13];
const BUF_PAGES = [10, 11, 12, 13, 14, 15];

type Cell = { kind: 'rec' | 'ckpt'; page?: number };
type CkptState = { cells: Cell[]; dirty: number[]; redo: number; writes: number; crashed?: boolean; replay?: boolean };

const sinceRedo = (state: CkptState) => state.cells.slice(state.redo + 1).filter(cell => cell.kind !== 'ckpt').length;

/** Replay length and page writes for a checkpoint every `interval` records. */
export function checkpointTotals(interval: number) {
  let dirty = new Set<number>();
  let writes = 0;
  let sinceLast = 0;
  TOUCHES.forEach((page, i) => {
    dirty.add(page);
    sinceLast++;
    const n = i + 1;
    if (n % interval === 0 && n < TOUCHES.length) {
      writes += dirty.size;
      dirty = new Set();
      sinceLast = 0;
    }
  });
  return { replay: sinceLast, writes };
}

export const checkpoints: Scene<CkptState> = {
  id: 'checkpoints',
  onParam: 'end',
  params: [{
    id: 'every', label: 'Checkpoint every', initial: '5',
    options: [{ value: '5', label: '5 records' }, { value: '10', label: '10' }, { value: '20', label: '20' }],
  }],
  steps: ({ every }) => {
    const interval = Number(every);
    const cells: Cell[] = [{ kind: 'ckpt' }];
    const dirty = new Set<number>();
    let redo = 0;
    let writes = 0;
    const snap = (extra: Partial<CkptState> = {}): CkptState => ({ cells: [...cells], dirty: [...dirty], redo, writes, ...extra });
    const steps: Step<CkptState>[] = [{ text: 'Just after a checkpoint. Nothing is dirty, and the redo point is at the start of the log.', state: snap() }];
    TOUCHES.forEach((page, i) => {
      const n = i + 1;
      dirty.add(page);
      cells.push({ kind: 'rec', page });
      steps.push({ text: `Record ${n} changes page ${page}.`, state: snap(), fast: true });
      if (n % interval === 0 && n < TOUCHES.length) {
        const count = dirty.size;
        writes += count;
        dirty.clear();
        cells.push({ kind: 'ckpt' });
        redo = cells.length - 1;
        steps.push({ text: `Checkpoint: ${count} dirty pages written. The redo point moves here.`, state: snap(), hold: 1600 });
      }
    });
    steps.push({ text: `The power fails. The ${dirty.size} dirty pages in memory are lost.`, state: snap({ crashed: true }) });
    const last = snap({ crashed: true, replay: true });
    steps.push({ text: `Recovery starts at the last redo point and replays the ${sinceRedo(last)} records after it.`, state: last });
    return steps;
  },
  interval: () => 380,
  outline: ({ every }) => {
    const interval = Number(every);
    const lines = ['Each price change is one WAL record and dirties its page.'];
    for (let start = 0; start < TOUCHES.length; start += interval) {
      const chunk = TOUCHES.slice(start, start + interval);
      const pages = [...new Set(chunk)].sort((a, b) => a - b);
      const end = start + chunk.length;
      const tail = end < TOUCHES.length ? `; a checkpoint writes ${pages.length} pages and moves the redo point` : '';
      lines.push(`Records ${start + 1}–${end} change pages ${pages.join(', ')}${tail}.`);
    }
    const totals = checkpointTotals(interval);
    lines.push(`The power fails. Recovery replays ${totals.replay} records; the checkpoints wrote ${totals.writes} pages.`);
    return lines;
  },
  stats: state => [
    { label: state.replay ? 'Records replayed' : 'Records to replay after a crash now', value: String(sinceRedo(state)) },
    { label: 'Pages written by checkpoints', value: String(state.writes) },
  ],
  render: (state, W) => {
    const items: Item[] = [];
    const pad = W < 420 ? 10 : 14;
    const narrow = W < 420;
    items.push(text('buf-t', pad, 14, 'SHARED BUFFERS · pages 10–15', 'sf-t sf-lane'));
    const gap = narrow ? 6 : 10;
    const pw = Math.min(56, (W - pad * 2 - gap * 5) / 6);
    BUF_PAGES.forEach((page, i) => {
      const x = pad + i * (pw + gap);
      const isDirty = state.dirty.includes(page);
      items.push(rect(`bp-${page}`, x, 22, pw, 34, `sf-card${isDirty ? ' sf-dirty' : ''}`));
      items.push(text(`bp-${page}-t`, x + pw / 2, 43, String(page), 'sf-t sf-mono sf-mid'));
      if (!state.crashed) items.push(text(`bp-${page}-d`, x + pw / 2, 70, isDirty ? 'dirty' : 'clean', `sf-t sf-xs sf-mid ${isDirty ? 'sf-dirty-text' : 'sf-muted'}`));
    });
    if (state.crashed) {
      const w = BUF_PAGES.length * (pw + gap) - gap;
      items.push(rect('crash', pad - 4, 18, w + 8, 58, 'sf-crash'));
      items.push(text('crash-t', pad + w / 2, 71, 'power lost: dirty pages gone', 'sf-t sf-xs sf-mid sf-crash-text'));
    }

    const top = 96;
    items.push(text('wal-t', pad, top, 'WAL', 'sf-t sf-lane'));
    const cs = narrow ? 24 : 28;
    const cols = Math.floor((W - pad * 2) / cs);
    const rowH = cs + 14;
    state.cells.forEach((cell, i) => {
      const x = pad + (i % cols) * cs;
      const y = top + 10 + Math.floor(i / cols) * rowH;
      const replay = state.replay && i > state.redo ? ' sf-replay' : '';
      const cls = cell.kind === 'ckpt' ? 'sf-cell-ckpt' : 'sf-cell-rec';
      items.push(rect(`c-${i}`, x, y, cs - 4, cs - 4, cls + replay, { from: { x: x + 8, y } }));
      const label = cell.kind === 'ckpt' ? 'C' : String(cell.page);
      items.push(text(`c-${i}-t`, x + (cs - 4) / 2, y + cs / 2 + 2, label, `sf-t sf-xs sf-mid sf-mono ${cell.kind === 'rec' ? '' : 'sf-cell-ink'}`, { from: { x: x + 8 + (cs - 4) / 2, y: y + cs / 2 + 2 } }));
      if (i === state.redo) items.push(text('redo', x + (cs - 4) / 2, y + cs + 8, 'redo', 'sf-t sf-xxs sf-mid sf-strong'));
    });
    const rows = Math.ceil((TOUCHES.length + 1 + 8) / cols);
    const legendY = top + 10 + rows * rowH + 8;
    const legend: [string, string][] = [['sf-cell-rec', 'change record, with its page'], ['sf-cell-ckpt', 'checkpoint']];
    legend.forEach(([cls, label], i) => {
      const lx = pad + i * 210;
      items.push(rect(`lg-${i}`, lx, legendY, 12, 12, `${cls} sf-swatch`));
      items.push(text(`lg-t-${i}`, lx + 17, legendY + 10, label, 'sf-t sf-xs'));
    });
    return { items, height: legendY + 22 };
  },
};

/* ---------- Torn page ---------- */

type Sector = 'old' | 'new';
type TornState = { mem: boolean; disk: Sector[]; crashed?: boolean; hot?: boolean; result?: { text: string; kind: 'ok' | 'bad' }; status: string };

const sectors = (newCount: number): Sector[] => Array.from({ length: 16 }, (_, i) => (i < newCount ? 'new' : 'old'));

export const tornPage: Scene<TornState> = {
  id: 'torn-page',
  params: [{ id: 'fpw', label: 'full_page_writes', initial: 'on', options: [{ value: 'on', label: 'on' }, { value: 'off', label: 'off' }] }],
  steps: ({ fpw }) => {
    const on = fpw === 'on';
    const steps: Step<TornState>[] = [
      { text: on ? 'Page 12 changed for the first time since the last checkpoint, so its WAL record, already on disk, carries a copy of the whole page.' : 'Page 12 changed. With full_page_writes off, its WAL record, already on disk, holds only the change.', state: { mem: true, disk: sectors(0), status: 'old' } },
      { text: 'The checkpoint writes page 12 to the table file: sixteen 512-byte sectors, one after another.', state: { mem: true, disk: sectors(6), status: 'being written' } },
      { text: 'The power fails after 6 of the 16 sectors. Page 12 on disk is torn: part new, part old.', state: { mem: false, disk: sectors(6), crashed: true, status: 'torn' } },
    ];
    if (on) {
      steps.push({ text: 'Recovery reaches the record with the full-page image and copies it over the torn page.', state: { mem: false, disk: sectors(16), hot: true, status: 'whole' } });
      steps.push({ text: 'Page 12 is whole again. Later records for it apply on top of this copy.', state: { mem: false, disk: sectors(16), status: 'whole', result: { text: 'Page 12 restored from the WAL.', kind: 'ok' } } });
    } else {
      steps.push({ text: 'Recovery reaches the change record and reads page 12 to check it. The torn page fails its data checksum, on by default in PostgreSQL 18, so recovery stops with an invalid-page error.', state: { mem: false, disk: sectors(6), hot: true, status: 'torn' } });
      steps.push({ text: 'Without checksums, the new LSN in sector 0 makes the page look up to date. Recovery skips the record, and nobody notices the tear.', state: { mem: false, disk: sectors(6), status: 'torn', result: { text: 'Page 12 can’t be repaired from the WAL.', kind: 'bad' } } });
    }
    return steps;
  },
  stats: (state, { fpw }) => [
    { label: 'Sectors with new data', value: `${state.disk.filter(sector => sector === 'new').length} of 16` },
    { label: 'Page 12 on disk', value: state.status },
    { label: 'WAL record holds', value: fpw === 'on' ? 'the whole page' : 'the change only' },
  ],
  render: (state, W, { fpw }) => {
    const items: Item[] = [];
    const pad = W < 420 ? 10 : 14;
    const gap = W < 420 ? 10 : 24;
    const cw = Math.min(240, (W - pad * 2 - gap) / 2);
    const left = (W - (cw * 2 + gap)) / 2;
    const cell = Math.min(34, (cw - 24) / 4);
    const gridW = cell * 4;
    const cardH = 30 + gridW + 14;
    const lanes: [string, number, string][] = [['MEMORY', left, 'Shared buffers'], ['DISK', left + cw + gap, 'Table file']];
    lanes.forEach(([lane, x, title], li) => {
      items.push(text(`lane-${li}`, x, 12, lane, 'sf-t sf-lane'));
      items.push(rect(`card-${li}`, x, 20, cw, cardH, 'sf-card'));
      items.push(text(`card-${li}-t`, x + 8, 37, cw < 200 ? title : `${title} · page 12`, 'sf-t sf-small sf-strong'));
    });
    const gx = (x: number) => x + (cw - gridW) / 2;
    if (state.mem) {
      for (let i = 0; i < 16; i++) {
        items.push(rect(`m-${i}`, gx(left) + (i % 4) * cell, 46 + Math.floor(i / 4) * cell, cell - 3, cell - 3, 'sf-sec-new'));
      }
    }
    if (state.crashed || !state.mem) {
      items.push(rect('crash', left, 20, cw, cardH, 'sf-crash'));
      items.push(text('crash-t', left + cw / 2, 20 + cardH / 2 + 4, state.crashed ? 'power lost' : 'empty after restart', 'sf-t sf-small sf-mid sf-crash-text'));
    }
    state.disk.forEach((sector, i) => {
      items.push(rect(`d-${i}`, gx(left + cw + gap) + (i % 4) * cell, 46 + Math.floor(i / 4) * cell, cell - 3, cell - 3, `sf-sec-${sector}${state.status === 'torn' && !state.mem ? ' sf-sec-torn' : ''}`, { delay: sector === 'new' ? i * 110 : 0 }));
    });

    const walY = 20 + cardH + 24;
    items.push(text('wal-lane', left, walY, 'WAL ON DISK', 'sf-t sf-lane'));
    const recW = cw * 2 + gap;
    const fpwOn = fpw === 'on';
    items.push(rect('wal-rec', left, walY + 8, recW, fpwOn ? 34 : 22, `sf-rec sf-rec-rec${state.hot ? ' sf-hot' : ''}`));
    items.push(text('wal-rec-t', left + 8, walY + 23, fpwOn ? 'update P7 + full image of page 12 (up to 8 kB)' : 'update P7 (the change only)', 'sf-t sf-xs sf-rec-text-rec'));
    const legY = walY + 64;
    items.push(rect('lg-new', left, legY - 10, 12, 12, 'sf-sec-new sf-swatch'));
    items.push(text('lg-new-t', left + 17, legY, 'new sector', 'sf-t sf-xs'));
    items.push(rect('lg-old', left + 110, legY - 10, 12, 12, 'sf-sec-old sf-swatch'));
    items.push(text('lg-old-t', left + 127, legY, 'old sector', 'sf-t sf-xs'));
    if (state.result) items.push(text('result', left, legY + 26, state.result.text, `sf-t sf-strong sf-result-${state.result.kind}`));
    return { items, height: legY + 36 };
  },
};

/* ---------- Flush path ---------- */

type FlushState = { at: number | null; reply?: boolean; crashed?: boolean; returned?: boolean; result?: { text: string; kind: 'ok' | 'bad' } };

const LAYERS = [
  { name: 'PostgreSQL WAL buffers', short: 'WAL buffers', kind: 'memory' },
  { name: 'Operating system page cache', short: 'OS page cache', kind: 'memory' },
  { name: 'Drive write cache', short: 'Drive cache', kind: 'volatile' },
  { name: 'Flash cells', short: 'Flash cells', kind: 'durable' },
];
const PLACE = ['WAL buffers', 'OS page cache', 'drive cache', 'flash', 'nowhere'];

export const flushPath: Scene<FlushState> = {
  id: 'flush-path',
  params: [{ id: 'drive', label: 'The drive', initial: 'honest', options: [{ value: 'honest', label: 'honours flushes' }, { value: 'liar', label: 'ignores flushes' }] }],
  steps: ({ drive }) => {
    const honest = drive === 'honest';
    const steps: Step<FlushState>[] = [
      { text: 'The commit record for transaction 812 sits in PostgreSQL’s WAL buffers.', state: { at: 0 } },
      { text: 'PostgreSQL hands it to the operating system, which keeps it in its page cache. That is still memory.', state: { at: 1 } },
      { text: 'fdatasync asks the operating system to send it to the drive. It lands in the drive’s write cache first.', state: { at: 2 } },
      honest
        ? { text: 'This drive copies the cached data to its flash cells before it reports success.', state: { at: 3 } }
        : { text: 'This drive reports success as soon as the data is in its cache. The flash cells don’t have it yet.', state: { at: 2, returned: true } },
      { text: 'fdatasync returns, and PostgreSQL replies COMMIT.', state: { at: honest ? 3 : 2, returned: true, reply: true } },
      honest
        ? { text: 'The power fails. Every volatile layer is wiped, but the commit record is in flash.', state: { at: 3, returned: true, reply: true, crashed: true } }
        : { text: 'The power fails before the drive writes its cache to flash. The commit record is gone.', state: { at: null, returned: true, reply: true, crashed: true } },
      honest
        ? { text: 'Recovery finds the commit record and replays the change. P7 costs 22.00.', state: { at: 3, returned: true, reply: true, result: { text: 'P7 = 22.00, as the application was told.', kind: 'ok' } } }
        : { text: 'Recovery finds no commit record. P7 costs 20.00, though the application heard COMMIT.', state: { at: null, returned: true, reply: true, result: { text: 'P7 = 20.00. The acknowledged commit is lost.', kind: 'bad' } } },
    ];
    return steps;
  },
  stats: state => [
    { label: 'Commit record is in', value: PLACE[state.at ?? 4] },
    { label: 'fdatasync returned', value: state.returned ? 'yes' : 'not yet' },
    { label: 'Application heard', value: state.reply ? 'COMMIT' : '—' },
  ],
  render: (state, W) => {
    const items: Item[] = [];
    const pad = W < 420 ? 10 : 14;
    const narrow = W < 420;
    items.push(text('app', pad, 14, 'APPLICATION', 'sf-t sf-lane'));
    const chipW = narrow ? 112 : 140;
    const chipX = W - pad - chipW - 6;
    if (state.reply) {
      items.push(rect('reply', chipX, 22, chipW, 22, 'sf-reply sf-reply-ok', { from: { x: chipX, y: 64 } }));
      items.push(text('reply-t', chipX + chipW / 2, 37, '← COMMIT', 'sf-t sf-mid sf-reply-text-ok', { from: { x: chipX + chipW / 2, y: 79 } }));
    }
    const top = 54;
    const lh = 50;
    LAYERS.forEach((layer, i) => {
      const y = top + i * (lh + 6);
      items.push(rect(`layer-${i}`, 3, y, W - 6, lh, layer.kind === 'durable' ? 'sf-lane-disk' : 'sf-lane-mem'));
      items.push(text(`layer-${i}-t`, pad, y + 21, narrow ? layer.short : layer.name, 'sf-t sf-small sf-strong'));
      items.push(text(`layer-${i}-k`, pad, y + 38, layer.kind === 'durable' ? 'durable' : 'volatile: lost when power fails', 'sf-t sf-xs sf-muted'));
      items.push(rect(`slot-${i}`, chipX, y + 13, chipW, 24, 'sf-slot-free'));
    });
    if (state.at !== null) {
      const y = top + state.at * (lh + 6) + 13;
      items.push(rect('rec', chipX, y, chipW, 24, 'sf-rec sf-rec-commit'));
      items.push(text('rec-t', chipX + chipW / 2, y + 16, 'commit tx 812', 'sf-t sf-xs sf-mid sf-rec-text-commit'));
    }
    if (state.crashed) {
      const h = 3 * (lh + 6) - 6;
      items.push(rect('crash', 3, top, W - 6, h, 'sf-crash'));
      items.push(text('crash-t', chipX + chipW / 2, top + h / 2 + 4, 'Power lost', 'sf-t sf-mid sf-crash-text'));
    }
    const bottom = top + 4 * (lh + 6);
    if (state.result) items.push(text('result', pad, bottom + 16, state.result.text, `sf-t sf-strong sf-result-${state.result.kind}`));
    return { items, height: bottom + 26 };
  },
};
