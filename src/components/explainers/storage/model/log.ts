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
type CkptState = { cells: Cell[]; dirty: number[]; redo: number; writes: number; fpi: number; crashed?: boolean; replay?: boolean };

const sinceRedo = (state: CkptState) => state.cells.slice(state.redo + 1).filter(cell => cell.kind !== 'ckpt').length;

export const checkpoints: Scene<CkptState> = {
  id: 'checkpoints',
  onParam: 'end',
  params: [
    {
      id: 'model', label: 'Engine model', initial: 'rounds',
      options: [{ value: 'rounds', label: 'PostgreSQL: rounds' }, { value: 'continuous', label: 'InnoDB: continuous' }],
    },
    {
      id: 'every', label: 'Batch every', initial: '5',
      options: [{ value: '5', label: '5 records' }, { value: '10', label: '10' }, { value: '20', label: '20' }],
    },
  ],
  steps: ({ every, model }) => {
    const interval = Number(every);
    const continuous = model === 'continuous';
    const cells: Cell[] = [{ kind: 'ckpt' }];
    // First record (cell index) that dirtied each page since it was last written.
    const firstDirty = new Map<number, number>();
    let redo = 0;
    let writes = 0;
    let fpi = 0;
    const snap = (extra: Partial<CkptState> = {}): CkptState => ({ cells: [...cells], dirty: [...firstDirty.keys()], redo, writes, fpi, ...extra });
    const steps: Step<CkptState>[] = [{
      text: continuous
        ? 'Nothing is dirty, and the checkpoint position is at the start of the log.'
        : 'Just after a checkpoint. Nothing is dirty, and the redo point is at the start of the log.',
      state: snap(),
    }];
    for (let start = 0; start < TOUCHES.length; start += interval) {
      const chunk = TOUCHES.slice(start, start + interval);
      chunk.forEach(page => {
        cells.push({ kind: 'rec', page });
        if (!firstDirty.has(page)) {
          firstDirty.set(page, cells.length - 1);
          fpi++;
        }
      });
      const end = start + chunk.length;
      steps.push({ text: `Records ${start + 1} to ${end} change ${new Set(chunk).size} different pages.`, state: snap(), hold: 900 });
      if (end >= TOUCHES.length) continue;
      if (continuous) {
        const old = [...firstDirty.entries()].filter(([, idx]) => idx < cells.length - Math.ceil(interval / 2));
        old.forEach(([page]) => firstDirty.delete(page));
        writes += old.length;
        redo = firstDirty.size ? Math.min(...firstDirty.values()) - 1 : cells.length - 1;
        steps.push({
          text: old.length
            ? `Page cleaners write the ${old.length} pages that have been dirty longest. The checkpoint position moves up behind them.`
            : 'No page has been dirty long enough to write yet.',
          state: snap(),
          hold: 1400,
        });
      } else {
        const count = firstDirty.size;
        writes += count;
        firstDirty.clear();
        cells.push({ kind: 'ckpt' });
        redo = cells.length - 1;
        steps.push({ text: `Checkpoint: ${count} dirty pages written. The redo point moves here.`, state: snap(), hold: 1600 });
      }
    }
    steps.push({ text: `The power fails. The ${firstDirty.size} dirty pages in memory are lost.`, state: snap({ crashed: true }) });
    const last = snap({ crashed: true, replay: true });
    steps.push({ text: `Recovery starts at the last ${continuous ? 'checkpoint position' : 'redo point'} and replays the ${sinceRedo(last)} records after it.`, state: last });
    return steps;
  },
  interval: () => 380,
  outline: params => {
    const steps = checkpoints.steps(params);
    const final = steps[steps.length - 1].state;
    const interval = Number(params.every);
    const lines = ['Each price change is one log record and dirties its page.'];
    if (params.model === 'continuous') {
      lines.push(`After every ${interval} records, background page cleaners write the pages dirty longest, and the checkpoint position follows the oldest page still dirty.`);
    } else {
      lines.push(`After every ${interval} records, a checkpoint writes every dirty page and moves the redo point.`);
    }
    lines.push(`The power fails. Recovery replays ${sinceRedo(final)} records; ${final.writes} page writes were made on the way.`);
    return lines;
  },
  stats: (state, params) => [
    { label: state.replay ? 'Records replayed' : 'Records to replay after a crash now', value: String(sinceRedo(state)) },
    { label: 'Pages written', value: String(state.writes) },
    ...(params.model === 'continuous' ? [] : [{ label: 'Full-page images logged', value: String(state.fpi) }]),
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
      steps.push({ text: 'Recovery reaches the change record and reads page 12 to check it. The torn page fails its data checksum, on by default for new clusters in PostgreSQL 18, so recovery stops with an invalid-page error.', state: { mem: false, disk: sectors(6), hot: true, status: 'torn' } });
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

/* ---------- Restore to a point in time ---------- */

type RestoreState = { n: number };

const HISTORY = [
  { time: '09:00', label: 'base backup starts' },
  { time: '10:00', label: 'P7 set to 22.00' },
  { time: '14:00', label: 'DELETE FROM products' },
  { time: '14:02', label: 'P8 set to 31.00' },
];

export const restoreTimeline: Scene<RestoreState> = {
  id: 'restore-timeline',
  steps: () => [
    { text: 'At 09:00 a base backup of the running server begins. From here on, every log file is copied to an archive before the server reuses it.', state: { n: 0 } },
    { text: 'At 10:00 a transaction commits P7 at 22.00. Its log records go to the archive too.', state: { n: 1 } },
    { text: 'At 14:00 someone commits DELETE FROM products. The commit is durable, so crash recovery would keep it.', state: { n: 2 } },
    { text: 'At 14:02 a valid price change for P8 commits.', state: { n: 3 } },
    { text: 'The disk is lost, or the delete is noticed. A new server starts from the 09:00 base backup. Its files are a mixture of ages, like a crashed server’s.', state: { n: 4 } },
    { text: 'Recovery reads the archive and replays the log in order, as after a crash. The 10:00 price change comes back.', state: { n: 5 } },
    { text: 'The recovery target is 13:59, so replay stops before the DELETE’s commit record. That transaction never committed as far as this server is concerned.', state: { n: 6 } },
    { text: 'The server opens on timeline 2. P7 is 22.00 and the products are back. The 14:02 change was after the target, so it is lost too and has to be applied again.', state: { n: 7 } },
  ],
  stats: ({ n }) => [
    { label: 'Stop point', value: n >= 6 ? '13:59' : '—' },
    { label: 'Timeline', value: n >= 7 ? '2' : '1' },
  ],
  render: ({ n }, W) => {
    const items: Item[] = [];
    const narrow = W < 420;
    const pad = narrow ? 10 : 14;
    const cw = (W - pad * 3) / 2;
    const lx = pad;
    const rx = pad * 2 + cw;
    items.push(text('h-orig', lx, 14, narrow ? 'ORIGINAL · TIMELINE 1' : 'ORIGINAL SERVER · TIMELINE 1', 'sf-t sf-lane'));
    if (n >= 4) items.push(text('h-rest', rx, 14, n >= 7 ? 'RESTORED · TIMELINE 2' : 'RESTORED COPY', 'sf-t sf-lane'));
    const top = 26;
    const rowH = 40;
    const shown = n <= 3 ? n + 1 : 4;
    HISTORY.forEach((ev, i) => {
      const y = top + i * rowH;
      if (i < shown) {
        const lost = n >= 7 && i === 3;
        const del = i === 2;
        const cls = lost ? 'sf-card sf-dirty' : del ? 'sf-card sf-dirty' : 'sf-rec sf-rec-rec';
        items.push(rect(`l-${i}`, lx, y, cw, 30, cls));
        items.push(text(`l-${i}-t`, lx + 8, y + 13, ev.time, 'sf-t sf-xs sf-mono'));
        items.push(text(`l-${i}-l`, lx + 8, y + 25, ev.label, `sf-t sf-xs${lost || del ? ' sf-dirty-text' : ''}`));
      }
      if (n >= 4) {
        const replayed = (i === 0 && n >= 4) || (i === 1 && n >= 5);
        const refused = (i >= 2 && n >= 6);
        if (replayed) {
          items.push(rect(`r-${i}`, rx, y, cw, 30, i === 0 ? 'sf-rec sf-rec-old' : 'sf-rec sf-rec-rec'));
          items.push(text(`r-${i}-t`, rx + 8, y + 13, ev.time, 'sf-t sf-xs sf-mono'));
          items.push(text(`r-${i}-l`, rx + 8, y + 25, i === 0 ? 'copy, mixed ages' : 'replayed', 'sf-t sf-xs'));
        } else if (refused) {
          items.push(rect(`r-${i}`, rx, y, cw, 30, 'sf-slot-free'));
          items.push(text(`r-${i}-t`, rx + 8, y + 13, ev.time, 'sf-t sf-xs sf-mono sf-muted'));
          items.push(text(`r-${i}-l`, rx + 8, y + 25, 'not replayed', 'sf-t sf-xs sf-muted'));
        }
      }
    });
    if (n >= 6) items.push(rect('stop', rx - 4, top + 2 * rowH - 6, cw + 8, 3, 'sf-cell-ckpt'));
    const bottom = top + 4 * rowH;
    const result = ['P7 = 22.00.', 'The 14:02 change must be applied again.'];
    if (n >= 7) {
      if (narrow) result.forEach((line, i) => items.push(text(`result-${i}`, pad, bottom + 12 + i * 16, line, 'sf-t sf-strong sf-result-ok')));
      else items.push(text('result', pad, bottom + 12, result.join(' '), 'sf-t sf-strong sf-result-ok'));
    }
    return { items, height: bottom + (narrow ? 40 : 24) };
  },
};

/* ---------- Group commit ---------- */

type GroupState = { k: number };

const fmtRate = (n: number) => Math.round(n).toLocaleString('en-GB');

/** Commits per second the log can sustain: a model, not a measurement. */
export function commitCeiling(clients: number, flushMs: number, group: boolean) {
  if (!group) return 1000 / flushMs;
  const waitMs = clients === 1 ? flushMs : 2 * flushMs;
  return (clients * 1000) / waitMs;
}

export const groupCommit: Scene<GroupState> = {
  id: 'group-commit',
  onParam: 'end',
  params: [
    { id: 'clients', label: 'Clients committing', initial: '16', options: [{ value: '1', label: '1' }, { value: '4', label: '4' }, { value: '16', label: '16' }] },
    { id: 'flush', label: 'One flush takes', initial: '5', options: [{ value: '0.2', label: '0.2 ms' }, { value: '2', label: '2 ms' }, { value: '5', label: '5 ms' }] },
    { id: 'group', label: 'Group commit', initial: 'on', options: [{ value: 'on', label: 'on' }, { value: 'off', label: 'off' }] },
  ],
  steps: ({ clients, group }) => {
    const n = Number(clients);
    const on = group === 'on';
    return [
      { text: `${n === 1 ? 'The client has' : `All ${n} clients have`} sent COMMIT. Each commit record has to reach the disk before its client gets a reply.`, state: { k: 0 } },
      {
        text: on
          ? `The first flush starts. It carries every commit record in the log so far${n > 1 ? `, so ${n} commits share it` : ''}.`
          : 'The first flush carries one commit record. The other clients wait their turn.',
        state: { k: 1 },
      },
      {
        text: on
          ? 'Clients that were answered send their next COMMIT at once. Commits that arrived during the flush wait for the next one, which carries them together.'
          : 'The second flush carries the next client’s commit record, and so on down the queue.',
        state: { k: 2 },
      },
      {
        text: on
          ? 'Each flush answers everyone who was waiting for it, so the flush rate stays the same however many clients there are.'
          : 'Without sharing, every commit costs a whole flush, so throughput is capped at one commit per flush.',
        state: { k: 4 },
      },
    ];
  },
  stats: (_state, { clients, flush, group }) => {
    const n = Number(clients);
    const f = Number(flush);
    const on = group === 'on';
    return [
      { label: 'Commits per flush', value: on ? String(n) : '1' },
      { label: 'Flushes per second', value: fmtRate(1000 / f) },
      { label: 'Commits per second, at most', value: fmtRate(commitCeiling(n, f, on)) },
    ];
  },
  render: ({ k }, W, { clients, group }) => {
    const items: Item[] = [];
    const narrow = W < 420;
    const pad = narrow ? 10 : 14;
    const n = Number(clients);
    const on = group === 'on';
    items.push(text('t', pad, 14, 'LOG FLUSHES, ONE AFTER ANOTHER', 'sf-t sf-lane'));
    const gap = 6;
    const bw = (W - pad * 2 - gap * 3) / 4;
    for (let i = 0; i < 4; i++) {
      const x = pad + i * (bw + gap);
      const shown = i < k;
      items.push(rect(`f-${i}`, x, 26, bw, 44, shown ? 'sf-rec sf-rec-rec' : 'sf-slot-free'));
      items.push(text(`f-${i}-t`, x + bw / 2, 46, shown ? 'flush' : '', 'sf-t sf-xs sf-mid'));
      items.push(text(`f-${i}-c`, x + bw / 2, 62, shown ? `${on ? n : 1} commit${(on ? n : 1) === 1 ? '' : 's'}` : '', 'sf-t sf-xs sf-mid sf-muted'));
    }
    const waiting = on ? 0 : Math.max(0, n - k);
    items.push(text('w', pad, 96, k === 0 ? `${n} commit${n === 1 ? '' : 's'} waiting for the first flush` : on ? 'Nobody waits for more than the next flush' : `${waiting} commit${waiting === 1 ? '' : 's'} still waiting`, 'sf-t sf-xs sf-strong'));
    return { items, height: 110 };
  },
};
