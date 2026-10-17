/*
 * The running model: one PostgreSQL server holding page 12 of the products
 * table. Memory holds shared buffers and WAL buffers; disk holds the table
 * file and the WAL files. Four scenes reuse it, changing one thing each time.
 */
import { rect, text, line, type Item, type Frame } from './draw';
import type { Scene, Step, Stat } from './types';

type RowKind = 'live' | 'uncommitted' | 'old' | 'live-new';
type Row = { key: string; label: string; price: string; kind: RowKind; from?: 'disk' | 'buf' | 'wal' };
type Card = { rows: Row[]; lsn?: string; dirty?: boolean };
type Rec = { key: string; label: string; kind: 'old' | 'rec' | 'commit' };
type ReplyKind = 'ok' | 'lost' | 'wait';

export type ServerState = {
  showWal: boolean;
  sent?: string;
  reply?: { text: string; kind: ReplyKind };
  buf: Card | null;
  disk: Card;
  walBuf: Rec[];
  walDisk: Rec[];
  crashed?: boolean;
  recovering?: boolean;
  arrow?: 'flush' | 'write' | 'walwriter';
  hot?: string;
  result?: { text: string; kind: 'ok' | 'bad' | 'warn' };
};

const OLD_LSN = '0/4F2A1C8';
const NEW_LSN = '0/5000148';
const EARLIER: Rec = { key: 'w-old', label: 'earlier records', kind: 'old' };
const UPD: Rec = { key: 'w-upd', label: 'update P7 → 22.00', kind: 'rec' };
const COMMIT: Rec = { key: 'w-commit', label: 'commit tx 812', kind: 'commit' };

const baseRows = (from?: Row['from']): Row[] => [
  { key: 'r1', label: 'P3', price: '18.00', kind: 'live', from },
  { key: 'r2', label: 'P9', price: '9.50', kind: 'live', from },
  { key: 'r3', label: 'P7', price: '20.00', kind: 'live', from },
];
const clean = (from?: Row['from']): Card => ({ rows: baseRows(from), lsn: OLD_LSN });
const updated = (from?: Row['from']): Card => ({
  rows: [...baseRows(), { key: 'r4', label: 'P7', price: '22.00', kind: 'uncommitted', from }],
  lsn: NEW_LSN, dirty: true,
});
const committed = (dirty = true, from?: Row['from']): Card => ({
  rows: [
    ...baseRows().slice(0, 2),
    { key: 'r3', label: 'P7', price: '20.00', kind: 'old' },
    { key: 'r4', label: 'P7', price: '22.00', kind: 'live-new', from },
  ],
  lsn: NEW_LSN, dirty,
});

const S = (patch: Partial<ServerState>): ServerState => ({
  showWal: true, buf: clean(), disk: clean(), walBuf: [], walDisk: [EARLIER], ...patch,
});

const SENT_UPDATE = 'UPDATE P7 → 22.00';

/* ---------- rendering ---------- */

const tagText: Partial<Record<RowKind, string>> = { uncommitted: 'not committed', old: 'old version' };

function cardItems(prefix: string, card: Card, x: number, y: number, w: number, h: number, title: string, from: (row: Row, index: number) => { x: number; y: number } | undefined, hot?: string): Item[] {
  const items: Item[] = [];
  items.push(rect(`${prefix}-frame`, x, y, w, h, `sf-card${card.dirty ? ' sf-dirty' : ''}`));
  items.push(text(`${prefix}-title`, x + 8, y + 15, title, 'sf-t sf-strong'));
  if (card.dirty) {
    items.push(rect(`${prefix}-dirty-bg`, x + w - 46, y + 5, 40, 14, 'sf-tag-dirty'));
    items.push(text(`${prefix}-dirty`, x + w - 26, y + 15.5, 'dirty', 'sf-t sf-xs sf-mid sf-on-dirty'));
  }
  card.rows.forEach((row, index) => {
    const ry = y + 22 + index * 19;
    const origin = from(row, index);
    const shiftFrom = (dx: number, dy: number) => (origin ? { x: origin.x + dx, y: origin.y + dy } : undefined);
    const hotCls = hot === `${prefix}-${row.key}` ? ' sf-hot' : '';
    items.push(rect(`${prefix}-${row.key}-bg`, x + 6, ry, w - 12, 16, `sf-row sf-row-${row.kind}${hotCls}`, { from: shiftFrom(0, 0) }));
    items.push(text(`${prefix}-${row.key}-label`, x + 12, ry + 12, `${row.label}  ${row.price}`, `sf-t sf-mono sf-row-text-${row.kind}`, { from: shiftFrom(6, 12) }));
    if (row.kind === 'old') items.push(line(`${prefix}-${row.key}-strike`, x + 10, ry + 8, x + 70, ry + 8, 'sf-strike', { from: shiftFrom(4, 8) }));
    const tag = tagText[row.kind];
    if (tag && w > 150) items.push(text(`${prefix}-${row.key}-tag`, x + w - 12, ry + 12, tag, 'sf-t sf-xs sf-end sf-muted', { from: shiftFrom(w - 18, 12) }));
  });
  if (card.lsn) items.push(text(`${prefix}-lsn`, x + 8, y + h - 7, `page LSN ${card.lsn}`, 'sf-t sf-xs sf-muted sf-mono'));
  return items;
}

function recItems(prefix: string, recs: Rec[], x: number, y: number, w: number, hot?: string): Item[] {
  const items: Item[] = [];
  recs.forEach((rec, index) => {
    const ry = y + 8 + index * 19;
    const hotCls = hot === rec.key ? ' sf-hot' : '';
    items.push(rect(rec.key, x + 6, ry, w - 12, 16, `sf-rec sf-rec-${rec.kind}${hotCls}`));
    items.push(text(`${rec.key}-t`, x + 12, ry + 12, rec.label, `sf-t sf-xs sf-rec-text-${rec.kind}`));
  });
  return items;
}

export function renderServer(state: ServerState, W: number): Frame {
  const items: Item[] = [];
  const pad = W < 420 ? 10 : 14;
  const narrow = W < 420;
  const cols = state.showWal ? 2 : 1;
  const cw = state.showWal ? (W - pad * 3) / 2 : Math.min(W - pad * 2, 300);
  const x0 = pad;
  const x1 = pad * 2 + cw;
  const cardH = narrow ? 112 : 122;

  // Application row
  items.push(text('app-label', pad, 14, 'APPLICATION', 'sf-t sf-lane'));
  if (state.sent) {
    const bw = Math.min(W * 0.5, 170);
    items.push(rect('app-sent-bg', pad, 22, bw, 22, 'sf-bubble'));
    items.push(text('app-sent', pad + 8, 37, state.sent, 'sf-t sf-mono'));
  }
  if (state.reply) {
    const rw = narrow ? 118 : 140;
    items.push(rect('app-reply-bg', W - pad - rw, 22, rw, 22, `sf-reply sf-reply-${state.reply.kind}`, { from: { x: W - pad - rw, y: 70 } }));
    items.push(text('app-reply', W - pad - rw / 2, 37, state.reply.text, `sf-t sf-mid sf-reply-text-${state.reply.kind}`, { from: { x: W - pad - rw / 2, y: 85 } }));
  }

  const memY = 54;
  const laneH = 40 + cardH + (narrow ? 6 : 10);
  const diskY = memY + laneH + (narrow ? 8 : 12);

  // Lanes
  items.push(rect('lane-mem', 3, memY, W - 6, laneH, 'sf-lane-mem'));
  items.push(text('lane-mem-t', pad, memY + 16, narrow ? 'MEMORY · lost in a crash' : 'MEMORY · lost in a crash or power cut', 'sf-t sf-lane'));
  items.push(rect('lane-disk', 3, diskY, W - 6, laneH, 'sf-lane-disk'));
  items.push(text('lane-disk-t', pad, diskY + 16, 'DISK · survives a crash', 'sf-t sf-lane'));
  if (state.recovering) {
    items.push(text('recovering', W - pad, memY + 16, 'crash recovery', 'sf-t sf-lane sf-end sf-recover'));
  }

  const subY = 34;
  items.push(text('h-buf', x0, memY + subY, 'Shared buffers', 'sf-t sf-small'));
  items.push(text('h-file', x0, diskY + subY, 'Table file', 'sf-t sf-small'));
  if (cols === 2) {
    items.push(text('h-walbuf', x1, memY + subY, 'WAL buffers', 'sf-t sf-small'));
    items.push(text('h-walfile', x1, diskY + subY, narrow ? 'WAL file' : 'WAL file (pg_wal)', 'sf-t sf-small'));
  }

  const bufY = memY + 40;
  const fileY = diskY + 40;
  const rowPos = (cardX: number, cardY: number, index: number) => ({ x: cardX + 6, y: cardY + 22 + index * 19 });
  const diskIndex = (key: string) => Math.max(0, state.disk.rows.findIndex(row => row.key === key));
  const bufIndex = (key: string) => Math.max(0, state.buf?.rows.findIndex(row => row.key === key) ?? 0);
  const walRecPos = (key: string) => {
    const index = state.walDisk.findIndex(rec => rec.key === key);
    return { x: x1 + 6, y: fileY + 8 + Math.max(0, index) * 19 };
  };

  if (state.buf) {
    items.push(...cardItems('b', state.buf, x0, bufY, cw, cardH, 'page 12', row => {
      if (row.from === 'disk') return rowPos(x0, fileY, diskIndex(row.key));
      if (row.from === 'wal') return walRecPos(UPD.key);
      return undefined;
    }, state.hot));
  } else {
    items.push(rect('b-empty', x0, bufY, cw, cardH, 'sf-card sf-empty'));
    if (!state.crashed) items.push(text('b-empty-t', x0 + cw / 2, bufY + cardH / 2 + 4, 'empty', 'sf-t sf-small sf-mid sf-muted'));
  }
  items.push(...cardItems('d', state.disk, x0, fileY, cw, cardH, 'page 12', row => (row.from === 'buf' ? rowPos(x0, bufY, bufIndex(row.key)) : undefined), state.hot));

  if (cols === 2) {
    items.push(rect('wb-frame', x1, bufY, cw, cardH, 'sf-card sf-walframe'));
    items.push(rect('wd-frame', x1, fileY, cw, cardH, 'sf-card sf-walframe'));
    items.push(...recItems('wb', state.walBuf, x1, bufY, cw, state.hot));
    items.push(...recItems('wd', state.walDisk, x1, fileY, cw, state.hot));
  }

  if (state.arrow) {
    const inWal = state.arrow !== 'write';
    const ax = inWal ? x1 + cw / 2 : x0 + cw / 2;
    const top = bufY + cardH + 3;
    const bottom = fileY - 3;
    items.push(line('arrow', ax, top, ax, bottom, 'sf-arrow', { attrs: { 'marker-end': 'url(#sf-arrowhead)' } }));
    const label = state.arrow === 'flush' ? 'flush' : state.arrow === 'walwriter' ? 'WAL writer' : 'write page 12';
    items.push(text('arrow-t', ax + 8, (top + bottom) / 2 + 4, label, 'sf-t sf-xs sf-arrow-text'));
  }

  if (state.crashed) {
    items.push(rect('crash', 3, memY, W - 6, laneH, 'sf-crash'));
    items.push(text('crash-t', W / 2, memY + laneH / 2 + 18, 'Power lost · memory is empty', 'sf-t sf-mid sf-crash-text'));
  }

  const H = diskY + laneH + 34;
  if (state.result) {
    items.push(text('result', pad, diskY + laneH + 22, state.result.text, `sf-t sf-strong sf-result-${state.result.kind}`));
  }
  return { items, height: H };
}

function stats(state: ServerState): Stat[] {
  const out: Stat[] = [];
  out.push({ label: 'Application heard', value: state.reply && state.reply.kind !== 'wait' ? state.reply.text : '—' });
  if (state.showWal) {
    const last = state.walDisk[state.walDisk.length - 1];
    out.push({ label: 'WAL on disk reaches', value: last.kind === 'old' ? 'older records' : last.kind === 'rec' ? 'the update' : 'the commit' });
  }
  const p7 = state.disk.rows.find(row => row.kind === 'live-new') ?? state.disk.rows.find(row => row.key === 'r3');
  out.push({ label: 'P7 in the table file', value: p7?.price ?? '—' });
  return out;
}

const shortResult = (text: string, kind: 'ok' | 'bad' | 'warn') => ({ text, kind });

/* ---------- scenes ---------- */

export const dirtyCrash: Scene<ServerState> = {
  id: 'dirty-crash',
  steps: () => [
    { text: 'Page 12 is in shared buffers, and the table file holds the same copy. P7 costs 20.00.', state: S({ showWal: false }) },
    { text: 'The UPDATE adds a new version of P7 to the page in memory. The page is now dirty.', state: S({ showWal: false, sent: SENT_UPDATE, buf: updated() }) },
    { text: 'Suppose COMMIT replied straight away, with nothing written to disk.', state: S({ showWal: false, sent: 'COMMIT', reply: { text: '← COMMIT', kind: 'ok' }, buf: committed() }) },
    { text: 'The power fails. Everything in memory is gone, including the only copy of 22.00.', state: S({ showWal: false, sent: 'COMMIT', reply: { text: '← COMMIT', kind: 'ok' }, buf: null, crashed: true }) },
    { text: 'After the restart, page 12 is read from the table file. P7 costs 20.00 again.', state: S({ showWal: false, sent: 'COMMIT', reply: { text: '← COMMIT', kind: 'ok' }, buf: clean('disk'), result: shortResult('After restart: P7 = 20.00. The commit is lost.', 'bad') }) },
  ],
  render: renderServer,
  stats,
};

const walSteps = (): Step<ServerState>[] => [
  { text: 'The same starting point, now with a write-ahead log: WAL buffers in memory, WAL files on disk.', state: S({}) },
  { text: 'The UPDATE changes page 12 in memory and appends a WAL record for the change. The page’s LSN now points past that record.', state: S({ sent: SENT_UPDATE, buf: updated(), walBuf: [UPD] }) },
  { text: 'COMMIT appends a commit record for transaction 812. Nothing has reached the disk yet.', state: S({ sent: 'COMMIT', reply: { text: 'waiting…', kind: 'wait' }, buf: updated(), walBuf: [UPD, COMMIT] }) },
  { text: 'PostgreSQL writes the WAL buffers to the WAL file and asks the operating system to flush it to disk. It waits for the disk to confirm.', state: S({ sent: 'COMMIT', reply: { text: 'waiting…', kind: 'wait' }, buf: committed(), walDisk: [EARLIER, UPD, COMMIT], arrow: 'flush' }) },
  { text: 'Only now does the application hear COMMIT. The table file still says 20.00.', state: S({ sent: 'COMMIT', reply: { text: '← COMMIT', kind: 'ok' }, buf: committed(), walDisk: [EARLIER, UPD, COMMIT] }) },
  { text: 'Later, a checkpoint, PostgreSQL’s periodic write of dirty pages, writes page 12 to the table file. The page is clean again.', state: S({ sent: 'COMMIT', reply: { text: '← COMMIT', kind: 'ok' }, buf: committed(false), disk: committed(false, 'buf'), walDisk: [EARLIER, UPD, COMMIT], arrow: 'write' }) },
];

export const walCommit: Scene<ServerState> = {
  id: 'wal-commit',
  steps: walSteps,
  render: renderServer,
  stats,
};

function recoverySteps(walOnDisk: Rec[], before: ServerState, outcome: { text: string; kind: 'ok' | 'bad' | 'warn' }, outcomeText: string): Step<ServerState>[] {
  const keep = { sent: before.sent, reply: before.reply, walDisk: walOnDisk };
  const steps: Step<ServerState>[] = [
    { text: 'On restart, recovery looks up the last checkpoint in a small control file, pg_control, and replays the WAL from there.', state: S({ ...keep, buf: null, recovering: true }) },
  ];
  const hasUpdate = walOnDisk.some(rec => rec.key === UPD.key);
  const hasCommit = walOnDisk.some(rec => rec.key === COMMIT.key);
  if (!hasUpdate) {
    steps.push({ text: 'The WAL on disk ends before the update. Replaying the earlier records rebuilds page 12 with P7 at 20.00.', state: S({ ...keep, buf: clean('disk'), recovering: true, hot: EARLIER.key }) });
  } else {
    steps.push({ text: `Replaying the earlier records rebuilds page 12 as it was at LSN ${OLD_LSN}. That is older than the update record, so the page is missing the update.`, state: S({ ...keep, buf: clean('disk'), recovering: true, hot: EARLIER.key }) });
    steps.push({ text: `Recovery applies the update record. The 22.00 version is back, and the page LSN moves to ${NEW_LSN}.`, state: S({ ...keep, buf: updated('wal'), recovering: true, hot: UPD.key }) });
    if (hasCommit) steps.push({ text: 'The commit record for transaction 812 follows, so the 22.00 version counts as committed.', state: S({ ...keep, buf: committed(), recovering: true, hot: COMMIT.key }) });
  }
  const finalBuf = hasCommit ? committed() : hasUpdate ? updated() : clean();
  steps.push({ text: outcomeText, state: S({ ...keep, buf: finalBuf, result: outcome }) });
  return steps;
}

export const crashRecovery: Scene<ServerState> = {
  id: 'crash-recovery',
  params: [{
    id: 'crash', label: 'Power fails', initial: 'flush',
    options: [
      { value: 'update', label: 'before COMMIT' },
      { value: 'commit', label: 'before flush' },
      { value: 'flush', label: 'after flush' },
    ],
  }],
  steps: ({ crash }) => {
    const w = walSteps();
    const prefix = w.slice(0, crash === 'update' ? 2 : crash === 'commit' ? 3 : 4);
    prefix[0] = { ...prefix[0], text: 'Page 12 and P7 at 20.00, as before. This time the power fails partway through.' };
    const last = prefix[prefix.length - 1].state;
    const reply = { text: 'connection lost', kind: 'lost' as const };
    const crashed = S({ sent: last.sent, reply, buf: null, walDisk: last.walDisk, crashed: true });
    const crashText = crash === 'update'
      ? 'The power fails before COMMIT is sent. The update’s WAL record was still in memory.'
      : crash === 'commit'
        ? 'The power fails after COMMIT is sent but before the flush. The application sees its connection drop.'
        : 'The power fails after the flush, a moment before the reply leaves the server. The application sees its connection drop.';
    const outcome = crash === 'update'
      ? { result: shortResult('P7 = 20.00. COMMIT was never sent.', 'ok'), text: 'P7 is 20.00. The application never sent COMMIT, so it knows the change didn’t happen.' }
      : crash === 'commit'
        ? { result: shortResult('P7 = 20.00, and the application never heard.', 'warn'), text: 'P7 is 20.00. The application saw only a dropped connection.' }
        : { result: shortResult('P7 = 22.00, but the application never heard.', 'warn'), text: 'P7 is 22.00. The application saw only a dropped connection, the same as before the flush.' };
    return [...prefix, { text: crashText, state: crashed }, ...recoverySteps(last.walDisk, crashed, outcome.result, outcome.text)];
  },
  render: renderServer,
  stats,
};

export const asyncCommit: Scene<ServerState> = {
  id: 'async-commit',
  params: [{
    id: 'crash', label: 'Power fails', initial: 'early',
    options: [
      { value: 'early', label: 'before WAL writer' },
      { value: 'late', label: 'after WAL writer' },
    ],
  }],
  steps: ({ crash }) => {
    const told = { text: '← COMMIT', kind: 'ok' as const };
    const steps: Step<ServerState>[] = [
      { text: 'The same update, with synchronous_commit = off.', state: S({}) },
      { text: 'The UPDATE changes page 12 and appends its WAL record, as before.', state: S({ sent: SENT_UPDATE, buf: updated(), walBuf: [UPD] }) },
      { text: 'COMMIT appends the commit record and replies at once. It does not wait for a flush.', state: S({ sent: 'COMMIT', reply: told, buf: committed(), walBuf: [UPD, COMMIT] }) },
    ];
    let walDisk: Rec[] = [EARLIER];
    if (crash === 'late') {
      walDisk = [EARLIER, UPD, COMMIT];
      steps.push({ text: 'Within about 600 ms, the WAL writer flushes the WAL buffers to disk.', state: S({ sent: 'COMMIT', reply: told, buf: committed(), walDisk, arrow: 'walwriter' }) });
    }
    const crashed = S({ sent: 'COMMIT', reply: told, buf: null, walDisk, crashed: true });
    steps.push({ text: 'The power fails.', state: crashed });
    const outcome = crash === 'early'
      ? { result: shortResult('P7 = 20.00. The acknowledged commit is lost.', 'bad'), text: 'P7 is 20.00. The database is consistent, but a commit the application heard about is gone.' }
      : { result: shortResult('P7 = 22.00. The WAL writer got there first.', 'ok'), text: 'P7 is 22.00. The WAL writer flushed the records before the power failed.' };
    const recovery = recoverySteps(walDisk, crashed, outcome.result, outcome.text);
    const done = recovery[recovery.length - 1];
    return [...steps, { ...done, text: `On restart, recovery replays whatever reached the disk, as before. ${outcome.text}` }];
  },
  render: renderServer,
  stats,
};
