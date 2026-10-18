/*
 * Scenes about the log after the commit: checkpoints, how max_wal_size sets
 * their spacing and the worst-case replay, torn pages, the path a flushed
 * WAL record takes through the operating system and drive, how far a
 * synchronous standby gets before COMMIT returns, a restore to a point in
 * time, and commits sharing log flushes.
 */
import { rect, text, line, type Item, type Frame } from './draw';
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
      id: 'every', label: 'Act every', initial: '5',
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
        : 'Just after a checkpoint. Nothing is dirty, and the checkpoint position is at the start of the log.',
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
        steps.push({ text: `Checkpoint: ${count} dirty pages written. The checkpoint position moves here.`, state: snap(), hold: 1600 });
      }
    }
    steps.push({ text: `The power fails. The ${firstDirty.size} dirty pages in memory are lost.`, state: snap({ crashed: true }) });
    const last = snap({ crashed: true, replay: true });
    steps.push({ text: `Recovery starts at the checkpoint position and replays the ${sinceRedo(last)} records after it.`, state: last });
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
      lines.push(`After every ${interval} records, a checkpoint writes every dirty page and moves the checkpoint position.`);
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
      // The label is wider than a cell, so keep it inside the figure at either edge.
      if (i === state.redo) items.push(text('redo', Math.min(W - pad - 18, Math.max(pad + 18, x + (cs - 4) / 2)), y + cs + 8, 'position', 'sf-t sf-xxs sf-mid sf-strong'));
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

/* ---------- Synchronous standby ---------- */

type StandbyState = {
  /** The furthest layer the commit record has reached: 0 and 1 on the primary, 2 to 4 on the standby. */
  at: number;
  reply?: boolean;
  crashed?: boolean;
  promoted?: boolean;
  result?: { text: string; kind: 'ok' | 'bad' | 'warn' };
};

const STANDBY_LAYERS = [
  { name: 'WAL buffers', sub: 'memory: lost if the primary crashes', kind: 'memory' },
  { name: 'WAL file on disk', sub: 'lost if the primary’s disk is lost', kind: 'durable' },
  { name: 'WAL file, OS cache', sub: 'lost if the standby’s OS crashes', kind: 'memory' },
  { name: 'WAL file on disk', sub: 'survives a standby power cut', kind: 'durable' },
  { name: 'Page 12, replayed', sub: '', kind: 'memory' },
];

/** The layer each choice waits for before COMMIT returns. */
const STOP: Record<string, number> = { local: 1, remote_write: 2, on: 3, remote_apply: 4 };
const STANDBY_HAS = ['no', 'no', 'in its OS cache', 'on disk', 'on disk, applied'];

export const syncStandby: Scene<StandbyState> = {
  id: 'sync-standby',
  onParam: 'end',
  params: [{
    id: 'wait', label: 'COMMIT waits until', initial: 'on',
    options: [
      { value: 'local', label: 'primary flushed' },
      { value: 'remote_write', label: 'standby wrote' },
      { value: 'on', label: 'standby flushed' },
      { value: 'remote_apply', label: 'standby applied' },
    ],
  }],
  steps: ({ wait }) => {
    const stop = STOP[wait] ?? 3;
    const steps: Step<StandbyState>[] = [
      { text: 'Transaction 812 commits on the primary. Its commit record is in the WAL buffers.', state: { at: 0 } },
      { text: 'The primary flushes the record to its own disk. Every choice here waits for this.', state: { at: 1 } },
    ];
    const moves = [
      '',
      '',
      'The primary’s WAL sender ships the record, and the standby writes it to its WAL file. It is in the standby’s operating-system cache, not yet on disk.',
      'The standby flushes the record to its disk.',
      'The standby replays the record into its copy of page 12, so queries there see 22.00.',
    ];
    for (let at = 2; at <= stop; at++) steps.push({ text: moves[at], state: { at } });
    const replies = [
      '',
      'With no synchronous standby, COMMIT waits for nothing more, and the primary replies. The record hasn’t reached the standby yet.',
      'The standby reports the write, and the primary replies. This is synchronous_commit = remote_write.',
      'The standby reports the flush, and the primary replies. This is synchronous_commit = on, the default.',
      'The standby reports that it has applied the record, and the primary replies. This is synchronous_commit = remote_apply.',
    ];
    steps.push({ text: replies[stop], state: { at: stop, reply: true } });
    steps.push({ text: 'Just after the reply, the primary’s disk fails, and the standby is promoted to take over.', state: { at: stop, reply: true, crashed: true, promoted: true } });
    const outcome: Record<number, Step<StandbyState>> = {
      1: { text: 'The standby never received the commit record. P7 is 20.00 there, though the application heard COMMIT.', state: { at: 1, reply: true, crashed: true, promoted: true, result: { text: 'P7 = 20.00. The acknowledged commit is lost.', kind: 'bad' } } },
      2: { text: 'Promotion replays every record the standby received, so P7 is 22.00. Had the standby’s operating system crashed as well, the record would have gone with it.', state: { at: 4, reply: true, crashed: true, promoted: true, result: { text: 'P7 = 22.00, unless the standby’s OS failed too.', kind: 'warn' } } },
      3: { text: 'The record is on the standby’s disk, and promotion replays it. P7 is 22.00.', state: { at: 4, reply: true, crashed: true, promoted: true, result: { text: 'P7 = 22.00, as the application was told.', kind: 'ok' } } },
      4: { text: 'The standby already has P7 at 22.00, and its queries saw the change before the failover.', state: { at: 4, reply: true, crashed: true, promoted: true, result: { text: 'P7 = 22.00, as the application was told.', kind: 'ok' } } },
    };
    steps.push(outcome[stop]);
    return steps;
  },
  stats: state => [
    { label: 'Application heard', value: state.reply ? 'COMMIT' : '—' },
    { label: 'Standby has the record', value: STANDBY_HAS[state.at] },
    { label: 'P7 after the failover', value: state.result ? (state.result.kind === 'bad' ? '20.00' : '22.00') : '—' },
  ],
  render: (state, W, { wait }) => {
    const items: Item[] = [];
    const narrow = W < 420;
    const pad = narrow ? 10 : 14;
    const stop = STOP[wait] ?? 3;
    items.push(text('app', pad, 14, 'APPLICATION', 'sf-t sf-lane'));
    const chipW = narrow ? 104 : 140;
    const chipX = W - pad - chipW - 6;
    if (state.reply) {
      items.push(rect('reply', chipX, 22, chipW, 22, 'sf-reply sf-reply-ok', { from: { x: chipX, y: 64 } }));
      items.push(text('reply-t', chipX + chipW / 2, 37, '← COMMIT', 'sf-t sf-mid sf-reply-text-ok', { from: { x: chipX + chipW / 2, y: 79 } }));
    }
    const lh = 44;
    const primaryTop = 74;
    const standbyTop = primaryTop + 2 * (lh + 6) + 26;
    const bandY = (i: number) => (i < 2 ? primaryTop + i * (lh + 6) : standbyTop + (i - 2) * (lh + 6));
    items.push(text('h-primary', pad, primaryTop - 8, 'PRIMARY', 'sf-t sf-lane'));
    items.push(text('h-standby', pad, standbyTop - 8, state.promoted ? 'STANDBY · PROMOTED' : 'STANDBY', 'sf-t sf-lane'));
    STANDBY_LAYERS.forEach((layer, i) => {
      const y = bandY(i);
      const sub = i === 4 ? (state.at >= 4 ? 'queries here see 22.00' : 'queries here still see 20.00') : layer.sub;
      items.push(rect(`band-${i}`, 3, y, W - 6, lh, layer.kind === 'durable' ? 'sf-lane-disk' : 'sf-lane-mem'));
      items.push(text(`band-${i}-t`, pad, y + 18, layer.name, 'sf-t sf-small sf-strong'));
      items.push(text(`band-${i}-s`, pad, y + 34, sub, 'sf-t sf-xs sf-muted'));
      // The layer COMMIT waits for is marked before the record gets there.
      const gone = state.crashed && i < 2;
      if (!gone) items.push(rect(`slot-${i}`, chipX, y + 10, chipW, 24, i === stop ? 'sf-slot-free sf-stop' : 'sf-slot-free'));
      items.push(text(`slot-${i}-t`, chipX + chipW / 2, y + 26, i === stop && state.at < i ? 'reply waits here' : '', 'sf-t sf-xxs sf-mid sf-muted'));
      const reached = state.at >= i && !gone;
      if (reached) {
        const hot = state.reply && i === stop && !state.crashed ? ' sf-hot' : '';
        const applied = i === 4;
        items.push(rect(`rec-${i}`, chipX, y + 10, chipW, 24, `sf-rec ${applied ? 'sf-rec-rec' : 'sf-rec-commit'}${hot}`));
        items.push(text(`rec-${i}-t`, chipX + chipW / 2, y + 26, applied ? 'P7 = 22.00' : 'commit tx 812', `sf-t sf-xs sf-mid${applied ? '' : ' sf-rec-text-commit'}`));
      }
    });
    if (state.at >= 2) {
      const ax = chipX + chipW / 2;
      const top = bandY(1) + lh + 3;
      const bottom = bandY(2) - 3;
      items.push(line('ship', ax, top, ax, bottom, 'sf-arrow', { attrs: { 'marker-end': 'url(#sf-arrowhead)' } }));
      items.push(text('ship-t', ax - 8, (top + bottom) / 2 + 4, 'WAL sender', 'sf-t sf-xs sf-end sf-arrow-text'));
    }
    if (state.crashed) {
      const h = 2 * (lh + 6) - 6;
      items.push(rect('crash', 3, primaryTop, W - 6, h, 'sf-crash'));
      items.push(text('crash-t', chipX + chipW / 2, bandY(1) + 26, 'disk failed', 'sf-t sf-mid sf-crash-text'));
    }
    const bottom = standbyTop + 3 * (lh + 6);
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

/**
 * How many commits one flush carries. With several clients and sharing on,
 * the clients answered by one flush send their next COMMIT while the next
 * flush is already running, so they wait for the one after. The clients
 * settle into two groups that take turns, and each flush carries half of them.
 */
export const commitsPerFlush = (clients: number, group: boolean) => (!group || clients === 1 ? 1 : clients / 2);

/** Commits per second the log can sustain: a model, not a measurement. */
export function commitCeiling(clients: number, flushMs: number, group: boolean) {
  return commitsPerFlush(clients, group) * (1000 / flushMs);
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
    const half = n / 2;
    if (n === 1) {
      return [
        { text: 'One client commits one row at a time, and sends its next COMMIT as soon as it is answered. Each commit record has to reach the disk before the reply.', state: { k: 0 } },
        { text: 'The first flush carries the client’s commit record. The client waits for the whole flush.', state: { k: 1 } },
        { text: 'The client is answered and sends its next COMMIT, which the next flush carries.', state: { k: 2 } },
        { text: 'With nobody to share a flush with, the commit rate is the flush rate.', state: { k: 4 } },
      ];
    }
    if (!on) {
      return [
        { text: `Each of ${n} clients commits one row at a time, sending its next COMMIT as soon as it is answered. Each commit record has to reach the disk before its client gets a reply.`, state: { k: 0 } },
        { text: 'The first flush carries one commit record. The other clients wait their turn.', state: { k: 1 } },
        { text: 'The second flush carries the next client’s commit record, and so on down the queue.', state: { k: 2 } },
        { text: 'Without sharing, every commit costs a whole flush, so throughput is capped at one commit per flush.', state: { k: 4 } },
      ];
    }
    return [
      { text: `Each of ${n} clients commits one row at a time, sending its next COMMIT as soon as it is answered. Each commit record has to reach the disk before its client gets a reply.`, state: { k: 0 } },
      { text: `A flush carries every commit record waiting in the log, here the ${half} from group A. While it runs, the other ${half} clients send their COMMITs and wait.`, state: { k: 1 } },
      { text: `The flush ends and group A is answered. The next flush starts at once with group B’s ${half} records, so group A’s new COMMITs have just missed it and wait for the one after.`, state: { k: 2 } },
      { text: `The two groups take turns. Each flush carries ${half} commits, and each commit waits for most of one flush and all of the next: almost two flushes.`, state: { k: 4 } },
    ];
  },
  stats: (_state, { clients, flush, group }) => {
    const n = Number(clients);
    const f = Number(flush);
    const on = group === 'on';
    return [
      { label: 'Commits per flush', value: String(commitsPerFlush(n, on)) },
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
    const turns = on && n > 1;
    const per = commitsPerFlush(n, on);
    items.push(text('t', pad, 14, 'LOG FLUSHES, ONE AFTER ANOTHER', 'sf-t sf-lane'));
    const gap = 6;
    const bw = (W - pad * 2 - gap * 3) / 4;
    for (let i = 0; i < 4; i++) {
      const x = pad + i * (bw + gap);
      const shown = i < k;
      // With sharing, the two groups alternate, so every other flush is drawn in the second colour.
      const b = turns && i % 2 === 1;
      items.push(rect(`f-${i}`, x, 26, bw, 44, shown ? `sf-rec ${b ? 'sf-rec-commit' : 'sf-rec-rec'}` : 'sf-slot-free'));
      items.push(text(`f-${i}-t`, x + bw / 2, 46, shown ? (turns ? `group ${b ? 'B' : 'A'}` : 'flush') : '', `sf-t sf-xs sf-mid${b ? ' sf-rec-text-commit' : ''}`));
      items.push(text(`f-${i}-c`, x + bw / 2, 62, shown ? `${per} commit${per === 1 ? '' : 's'}` : '', `sf-t sf-xs sf-mid ${b ? 'sf-rec-text-commit' : 'sf-muted'}`));
    }
    const waiting = Math.max(0, n - k);
    const footer = k === 0
      ? `${n} client${n === 1 ? '' : 's'} committing`
      : turns
        ? (narrow ? `Two groups of ${per} take turns` : `Two groups of ${per} take turns; each commit waits almost two flushes`)
        : on || n === 1
          ? 'Each commit waits one whole flush'
          : `${waiting} commit${waiting === 1 ? '' : 's'} still waiting`;
    items.push(text('w', pad, 96, footer, 'sf-t sf-xs sf-strong'));
    return { items, height: 110 };
  },
};

/* ---------- Sizing max_wal_size ---------- */

type SizingState = { t: number; after?: boolean; peak?: boolean; result?: boolean };

/** MiB of log written a second, as in the article's heavy test. */
const WRITE_RATE = 28;
/** checkpoint_completion_target at its default. */
const COMPLETION = 0.9;
/** Seconds shown, the length of checkpoint_timeout at its default. */
const WINDOW = 300;
/** Seconds of replay the restart may spend. */
const TARGET = 30;
/** MiB at the top of the chart, so 8 GB fits under it. */
const Y_MAX = 9216;

/**
 * PostgreSQL starts a checkpoint for log size once the log written since the
 * last checkpoint began reaches max_wal_size ÷ (1 + checkpoint_completion_target)
 * (CalculateCheckpointSegments in xlog.c). The checkpoint finishes 0.9 of an
 * interval later, so just before it does, a crash replays the log since the
 * previous checkpoint began: about 1.9 triggers, or max_wal_size.
 */
export const checkpointSizing = (maxWal: number, replay: number) => {
  const trigger = maxWal / (1 + COMPLETION);
  const interval = trigger / WRITE_RATE;
  return { trigger, interval, worst: maxWal / replay, budget: TARGET * replay, count: Math.floor(WINDOW / interval) };
};

const SIZES = [
  { value: '512', label: '512 MB' },
  { value: '1024', label: '1 GB' },
  { value: '2048', label: '2 GB' },
  { value: '4096', label: '4 GB' },
  { value: '8192', label: '8 GB' },
];
const sizeLabel = (size: string) => SIZES.find(s => s.value === size)?.label ?? `${size} MB`;
const mib = (n: number) => (n < 1024 ? `${Math.round(n)} MiB` : `${(n / 1024).toFixed(1)} GiB`);
const secs = (n: number) => `${Math.round(n)} s`;
const rateLabel = (replay: string) => (replay === '169' ? '169' : '85');

export const checkpointSizingScene: Scene<SizingState> = {
  id: 'checkpoint-sizing',
  onParam: 'end',
  params: [
    { id: 'size', label: 'max_wal_size', initial: '1024', kind: 'slider', options: SIZES },
    { id: 'replay', label: 'Replay rate', initial: '169', options: [{ value: '169', label: '169 MiB/s' }, { value: '84.5', label: '85 MiB/s' }] },
  ],
  steps: ({ size, replay }) => {
    const M = Number(size);
    const { trigger: D, interval: I, worst, count } = checkpointSizing(M, Number(replay));
    const peakAt = (1 + COMPLETION) * I;
    const within = worst <= TARGET;
    return [
      { text: 'A quiet server has just finished a checkpoint, so a crash now would replay nothing. Then writing starts, at about 28 MiB of log a second.', state: { t: 0 } },
      { text: `After ${mib(D)} of log, ${secs(I)} in, the size trigger starts the next checkpoint. It spreads its page writes over the next ${secs(COMPLETION * I)}, and the log keeps growing meanwhile.`, state: { t: I } },
      { text: `A crash just before that checkpoint finishes would replay all the log since the last finished one began: ${sizeLabel(size)}, the whole of max_wal_size. At ${rateLabel(replay)} MiB a second, that takes about ${secs(worst)}.`, state: { t: peakAt, peak: true } },
      { text: `When the checkpoint finishes, replay would start from where it began, so the amount drops to ${mib(COMPLETION * D)}.`, state: { t: peakAt, after: true } },
      { text: `From then on, a checkpoint every ${secs(I)}, ${count === 1 ? 'one' : count} in five minutes, and a worst case of about ${secs(worst)} of replay. That is ${within ? 'within' : 'over'} the 30 s target.`, state: { t: WINDOW, after: true, result: true } },
    ];
  },
  outline: () => [
    'A chart of how much log a crash would leave to replay over five minutes, with the server writing 28 MiB of log a second and max_wal_size at 1 GB.',
    'A checkpoint starts after about 539 MiB of log, every 19 s. Just before each one finishes, a crash would replay about 1 GB, the whole of max_wal_size. When it finishes, the amount drops to about 485 MiB.',
    'At 169 MiB a second, the worst case replays in about 6 s, within a 30 s target. Larger settings space checkpoints further apart and raise the worst case: at 8 GB, one every 154 s and about 48 s of replay, or 97 s at half the rate.',
  ],
  stats: (_state, { size, replay }) => {
    const { trigger, interval, worst } = checkpointSizing(Number(size), Number(replay));
    return [
      { label: 'Checkpoint starts after', value: mib(trigger) },
      { label: 'One checkpoint every', value: secs(interval) },
      { label: 'Worst-case replay (target 30 s)', value: secs(worst) },
    ];
  },
  render: (state, W, { size, replay }) => {
    const items: Item[] = [];
    const narrow = W < 520;
    const pad = narrow ? 10 : 14;
    const M = Number(size);
    const { trigger: D, interval: I, worst, budget, count } = checkpointSizing(M, Number(replay));
    const within = worst <= TARGET;
    const sawCls = `sf-saw ${within ? 'sf-saw-ok' : 'sf-saw-bad'}`;
    const left = pad + 40;
    const right = W - pad;
    const top = 26;
    const H = narrow ? 170 : 200;
    const bottom = top + H;
    const X = (t: number) => left + (t / WINDOW) * (right - left);
    const Y = (v: number) => bottom - (Math.min(v, Y_MAX) / Y_MAX) * H;

    items.push(text('title', pad, 14, 'LOG A CRASH WOULD REPLAY', 'sf-t sf-lane'));
    for (const g of [0, 2, 4, 6, 8]) {
      items.push(line(`grid-${g}`, left, Y(g * 1024), right, Y(g * 1024), g === 0 ? 'sf-axis' : 'sf-grid'));
      items.push(text(`grid-${g}-t`, left - 6, Y(g * 1024) + 4, g === 0 ? '0' : `${g} GiB`, 'sf-t sf-xs sf-end sf-muted'));
    }
    for (let m = 0; m <= 5; m++) {
      const anchor = m === 5 ? 'sf-end' : 'sf-mid';
      items.push(text(`min-${m}`, X(m * 60), bottom + 15, m === 0 ? '0' : `${m} min`, `sf-t sf-xs ${anchor} sf-muted`));
    }
    items.push(line('budget', left, Y(budget), right, Y(budget), 'sf-budget'));
    items.push(line('maxwal', left, Y(M), right, Y(M), 'sf-maxwal'));

    // The log a crash would replay, up to the step's moment.
    let t0 = 0;
    let v0 = 0;
    for (let k = 1; t0 < state.t; k++) {
      const done = (k + COMPLETION) * I;
      const end = Math.min(done, state.t);
      items.push(line(`saw-${k}`, X(t0), Y(v0), X(end), Y(v0 + (end - t0) * WRITE_RATE), sawCls));
      if (done > state.t + 1e-9 || (Math.abs(done - state.t) < 1e-9 && !state.after)) break;
      const after = COMPLETION * D;
      items.push(line(`drop-${k}`, X(done), Y(M), X(done), Y(after), sawCls));
      t0 = done;
      v0 = after;
    }
    for (let k = 1; k * I <= state.t + 1e-9; k++) {
      items.push({ key: `start-${k}`, tag: 'circle', x: X(k * I), y: Y(D), cls: 'sf-dot', attrs: { r: 3.5 } });
    }
    if (state.peak) {
      const px = X(state.t);
      const end = px > right - 50;
      items.push(text('peak-t', end ? px - 6 : px, Y(M) - 7, 'worst case', `sf-t sf-xs sf-strong ${end ? 'sf-end' : 'sf-mid'}`));
    }

    let y = bottom + 38;
    if (state.result) {
      const verdict = `${within ? 'within' : 'over'} the 30 s target`;
      const checkpointsIn = `${count} checkpoint${count === 1 ? '' : 's'} in five minutes`;
      const lines = narrow
        ? [`${checkpointsIn}.`, `Worst case ${secs(worst)}, ${verdict}.`]
        : [`${checkpointsIn}. Worst case ${secs(worst)} of replay, ${verdict}.`];
      lines.forEach((value, i) => items.push(text(`result-${i}`, pad, y + i * 17, value, `sf-t sf-strong ${within ? 'sf-result-ok' : 'sf-result-bad'}`)));
      y += lines.length * 17 + 8;
    }

    // Legend: line styles differ as well as colours.
    const legend: { key: string; label: string; cls: string; dot?: boolean }[] = [
      { key: 'saw', label: 'log a crash would replay', cls: sawCls },
      { key: 'budget', label: `what replays in 30 s at ${rateLabel(replay)} MiB/s`, cls: 'sf-budget' },
      { key: 'maxwal', label: 'max_wal_size', cls: 'sf-maxwal' },
      { key: 'dot', label: 'a checkpoint starts', cls: 'sf-dot', dot: true },
    ];
    let lx = pad;
    let ly = y + 6;
    for (const entry of legend) {
      const width = 28 + entry.label.length * 6;
      if (lx > pad && lx + width > right) {
        lx = pad;
        ly += 18;
      }
      if (entry.dot) items.push({ key: `lg-${entry.key}`, tag: 'circle', x: lx + 10, y: ly - 4, cls: entry.cls, attrs: { r: 3.5 } });
      else items.push(line(`lg-${entry.key}`, lx, ly - 4, lx + 20, ly - 4, entry.cls));
      items.push(text(`lg-${entry.key}-t`, lx + 26, ly, entry.label, 'sf-t sf-xs'));
      lx += width + 16;
    }
    return { items, height: ly + 10 };
  },
};
