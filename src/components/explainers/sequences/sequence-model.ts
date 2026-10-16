// A small sequence-diagram model for the Sequence diagrams article.
// Scenarios are built in logical playback time (T, seconds of animation) and,
// where it matters, a scenario clock in milliseconds. Rows are order, not time.

export type MsgKind = 'sync' | 'reply' | 'async' | 'lost' | 'error';

export interface Participant { id: string; label: string; short?: string }
export interface Occ { t0: number; t1: number; label?: string }

interface Base { id: number; occ: Occ[]; ghost?: boolean }
export interface Msg extends Base { type: 'msg'; from: string; to: string; label: string; kind: MsgKind; row: number; lostAt?: number }
export interface Bar extends Base { type: 'bar'; on: string; mode: 'busy' | 'wait'; row0: number; row1: number; depth: number }
export interface Note extends Base { type: 'note'; over: string[]; text: string; row: number; rows: number; tone: 'plain' | 'warn' | 'good' }
export interface Gap extends Base { type: 'gap'; text: string; row: number }
export interface Frame extends Base { type: 'frame'; op: string; guard: string; from: string; to: string; row0: number; row1: number; sections: { row: number; guard: string }[]; passes: number[] }
export interface Status extends Base { type: 'status'; on: string; text: string; detail?: string }
export type Item = Msg | Bar | Note | Gap | Frame | Status;

export interface Scenario {
  participants: Participant[];
  items: Item[];
  rows: number;
  duration: number;
  clock: [number, number][] | null;
  darkMs: number;
  strip: boolean;
  summary: string;
}

export interface ParamDef {
  id: string;
  label: string;
  type: 'toggle' | 'choice';
  default: string;
  options?: { value: string; label: string }[];
}

export interface ScenarioDef {
  title: string;
  params: ParamDef[];
  build: (p: Record<string, string>) => Scenario;
}

const TRAVEL = 0.75;

class Builder {
  T = 0;
  ms = 0;
  row = 0;
  items: Item[] = [];
  clock: [number, number][] = [[0, 0]];
  ghost = false;
  ghostT = 0;
  lastArrival = 0;
  replay: { list: Item[]; i: number } | null = null;
  record: Item[] | null = null;
  constructor(public participants: Participant[], public opts: { bars?: boolean; clock?: boolean; strip?: boolean; darkMs?: number } = {}) {}

  private add<I extends Item>(item: I): I {
    if (this.replay) {
      const existing = this.replay.list[this.replay.i++] as I;
      existing.occ.push(...item.occ);
      return existing;
    }
    item.id = this.items.length;
    this.items.push(item);
    this.record?.push(item);
    return item;
  }

  advance(dT: number, dms = 0) {
    this.T += dT;
    this.ms += dms;
    if (this.opts.clock) this.clock.push([this.T, this.ms]);
  }

  msg(from: string, to: string, label: string, kind: MsgKind, o: { ms?: number; T?: number; lostAt?: number } = {}): Msg {
    const row = this.row++;
    if (this.ghost) return this.add<Msg>({ type: 'msg', id: 0, from, to, label, kind, row, lostAt: o.lostAt, ghost: true, occ: [{ t0: this.ghostT, t1: this.ghostT, label }] });
    const dT = o.T ?? (o.lostAt ? TRAVEL * o.lostAt + 0.15 : TRAVEL);
    const m = this.add<Msg>({ type: 'msg', id: 0, from, to, label, kind, row, lostAt: o.lostAt, occ: [{ t0: this.T, t1: this.T + dT, label }] });
    this.lastArrival = this.T + dT;
    this.advance(dT, o.ms ?? 1);
    return m;
  }

  pause(dT = 0.25, dms = 0) { if (!this.ghost) this.advance(dT, dms); }

  bar(on: string, mode: 'busy' | 'wait', row0: number, row1: number, t0: number, t1: number) {
    if (!this.opts.bars || this.ghost || this.replay) return;
    this.add<Bar>({ type: 'bar', id: 0, on, mode, row0, row1, depth: 0, occ: [{ t0, t1 }] });
  }

  call(from: string, to: string, label: string, reply: string, o: { reqMs?: number; repMs?: number; workMs?: number; workT?: number; inner?: () => void; replyKind?: MsgKind } = {}) {
    const req = this.msg(from, to, label, 'sync', { ms: o.reqMs ?? 1 });
    const busyT0 = this.T;
    this.pause(0.12, 0);
    if (o.inner) o.inner();
    if (o.workMs) this.pause(o.workT ?? 0.35, o.workMs);
    const rep = this.msg(to, from, reply, o.replyKind ?? 'reply', { ms: o.repMs ?? 1 });
    this.bar(from, 'wait', req.row, rep.row, req.occ[0].t0, rep.occ[0].t1);
    this.bar(to, 'busy', req.row, rep.row, busyT0, rep.occ[0].t0);
    this.pause(0.15, 0);
    return { req, rep };
  }

  note(over: string[], text: string, o: { rows?: number; tone?: Note['tone']; T?: number } = {}): Note {
    const rows = o.rows ?? 1;
    const row = this.row;
    this.row += rows;
    if (this.ghost) return this.add<Note>({ type: 'note', id: 0, over, text, row, rows, tone: o.tone ?? 'plain', ghost: true, occ: [{ t0: this.ghostT, t1: this.ghostT }] });
    const n = this.add<Note>({ type: 'note', id: 0, over, text, row, rows, tone: o.tone ?? 'plain', occ: [{ t0: this.T, t1: this.T + 0.3 }] });
    this.advance(o.T ?? 0.6, 0);
    return n;
  }

  gap(text: string, dT: number, dms: number) {
    const row = this.row;
    this.row += 0.8;
    this.add<Gap>({ type: 'gap', id: 0, text, row, occ: [{ t0: this.T, t1: this.T + dT }] });
    this.advance(dT, dms);
  }

  status(on: string, text: string, detail?: string) {
    if (this.ghost) return;
    // A status follows from the message that just arrived, so it starts with that arrival.
    const t = Math.max(0, Math.min(this.T, this.lastArrival - 0.003));
    this.add<Status>({ type: 'status', id: 0, on, text, detail, occ: [{ t0: t, t1: t }] });
  }

  frame(op: string, from: string, to: string, sections: { guard: string; ghost?: boolean; offset?: number; body: () => void }[]) {
    const frame = this.add<Frame>({ type: 'frame', id: 0, op, guard: sections[0].guard, from, to, row0: this.row, row1: 0, sections: [], passes: [], ghost: this.ghost, occ: [{ t0: this.ghost ? this.ghostT : this.T, t1: this.ghost ? this.ghostT : this.T + 0.3 }] });
    const outerGhost = this.ghost;
    const T0 = this.T;
    let maxT = this.T;
    this.row += 0.6;
    sections.forEach((s, i) => {
      if (i > 0) {
        this.row += 0.15;
        frame.sections.push({ row: this.row, guard: s.guard });
        this.row += 0.55;
      }
      if (s.offset !== undefined) this.T = T0 + s.offset;
      if (s.ghost && !outerGhost) { this.ghost = true; this.ghostT = T0; }
      s.body();
      this.ghost = outerGhost;
      maxT = Math.max(maxT, this.T);
    });
    this.T = maxT;
    this.row += 0.15;
    frame.row1 = this.row;
    this.row += 0.3;
    return frame;
  }

  loop(guard: string, from: string, to: string, passes: number, body: (pass: number) => void) {
    const frame = this.add<Frame>({ type: 'frame', id: 0, op: 'loop', guard, from, to, row0: this.row, row1: 0, sections: [], passes: [], occ: [{ t0: this.T, t1: this.T + 0.3 }] });
    this.row += 0.6;
    const bodyRow = this.row;
    let recorded: Item[] = [];
    let endRow = bodyRow;
    for (let k = 0; k < passes; k++) {
      frame.passes.push(this.T);
      this.row = bodyRow;
      if (k === 0) this.record = [];
      else this.replay = { list: recorded, i: 0 };
      body(k);
      if (k === 0) { recorded = this.record!; this.record = null; endRow = this.row; }
      this.replay = null;
    }
    this.row = endRow + 0.15;
    frame.row1 = this.row;
    this.row += 0.3;
    return frame;
  }

  finish(summary: string): Scenario {
    const bars = this.items.filter((i): i is Bar => i.type === 'bar');
    for (const b of bars) {
      b.depth = bars.filter(o => o !== b && o.on === b.on && o.occ[0].t0 <= b.occ[0].t0 && o.occ[0].t1 >= b.occ[0].t1).length;
    }
    return {
      participants: this.participants,
      items: this.items,
      rows: this.row,
      duration: this.T + 0.3,
      clock: this.opts.clock ? this.clock : null,
      darkMs: this.opts.darkMs ?? 1000,
      strip: !!this.opts.strip,
      summary,
    };
  }
}

const P = {
  ui: { id: 'ui', label: 'Browser' },
  api: { id: 'api', label: 'Repair API' },
  db: { id: 'db', label: 'Repair DB' },
  worker: { id: 'worker', label: 'Notification worker', short: 'Worker' },
  provider: { id: 'provider', label: 'Email provider' },
  inbox: { id: 'inbox', label: 'Mina’s inbox' },
};

const dbChoices = [
  { value: '5', label: '5 ms' },
  { value: '50', label: '50 ms' },
  { value: '500', label: '500 ms' },
  { value: '3000', label: '3 s' },
];
const dbAnimT: Record<string, number> = { '5': 0.15, '50': 0.35, '500': 1, '3000': 2.4 };

export const scenarios: Record<string, ScenarioDef> = {
  booking: {
    title: 'Mina books a repair',
    params: [],
    build: () => {
      const b = new Builder([P.ui, P.api, P.db]);
      b.pause(0.2);
      b.msg('ui', 'api', 'POST /repairs', 'sync');
      b.pause(0.15);
      b.msg('api', 'db', 'INSERT repair request', 'sync');
      b.pause(0.25);
      b.msg('db', 'api', 'COMMIT ok', 'reply');
      b.pause(0.15);
      b.msg('api', 'ui', '201 Created: R17', 'reply');
      return b.finish('The browser sends POST /repairs to the Repair API. The API inserts the repair request into Repair DB, the database replies that the commit succeeded, and only then does the API reply 201 Created with request R17.');
    },
  },

  waiting: {
    title: 'Who is waiting',
    params: [{ id: 'db', label: 'Repair DB takes', type: 'choice', default: '50', options: dbChoices }],
    build: p => {
      const dbMs = Number(p.db);
      const b = new Builder([P.ui, P.api, P.db], { bars: true, clock: true, strip: true, darkMs: 1000 });
      b.pause(0.2);
      b.call('ui', 'api', 'POST /repairs', '201 Created: R17', {
        reqMs: 30, repMs: 30,
        inner: () => b.call('api', 'db', 'INSERT repair request', 'COMMIT ok', { workMs: dbMs, workT: dbAnimT[p.db] }),
      });
      b.status('ui', 'done', 'has R17');
      return b.finish(`The same booking with activation bars. The browser waits from sending POST /repairs until 201 Created arrives. The API is busy handling the request, and inside that it waits ${p.db === '3000' ? '3 seconds' : `${dbMs} ms`} for Repair DB. The diagram is the same height whatever the database time.`);
    },
  },

  email: {
    title: 'Sending the email inside the request',
    params: [{ id: 'mode', label: 'API’s call to the email provider', type: 'choice', default: 'sync', options: [{ value: 'sync', label: 'Waits for the reply' }, { value: 'async', label: 'Doesn’t wait' }] }],
    build: p => {
      const b = new Builder([P.ui, P.api, P.db, P.provider], { bars: true, clock: true, strip: true, darkMs: 2000 });
      b.pause(0.2);
      if (p.mode === 'sync') {
        b.call('ui', 'api', 'POST /repairs', '201 Created: R17', {
          reqMs: 30, repMs: 30,
          inner: () => {
            b.call('api', 'db', 'INSERT repair request', 'COMMIT ok', { workMs: 5, workT: 0.15 });
            b.call('api', 'provider', 'POST /emails', '202 Accepted', { reqMs: 40, repMs: 40, workMs: 2500, workT: 2.2 });
          },
        });
        b.status('ui', 'done', 'has R17');
        return b.finish('The API stores the request, then calls the email provider and waits for its reply. The provider takes 2.5 seconds, so the browser waits more than 2.5 seconds for 201 Created.');
      }
      const reqT = b.T;
      const post = b.msg('ui', 'api', 'POST /repairs', 'sync', { ms: 30 });
      const apiBusy = b.T;
      b.pause(0.12);
      b.call('api', 'db', 'INSERT repair request', 'COMMIT ok', { workMs: 5, workT: 0.15 });
      const send = b.msg('api', 'provider', 'POST /emails', 'async', { ms: 1 });
      const providerStart = b.ms;
      const providerT = b.T;
      b.pause(0.12, 1);
      const receipt = b.msg('api', 'ui', '201 Created: R17', 'reply', { ms: 30 });
      b.bar('ui', 'wait', post.row, receipt.row, reqT, receipt.occ[0].t1);
      b.bar('api', 'busy', post.row, receipt.row, apiBusy, receipt.occ[0].t0);
      b.status('ui', 'done', 'has R17');
      b.status('api', 'idle', 'moved on');
      b.pause(1.6, 2500 - (b.ms - providerStart));
      const late = b.msg('provider', 'api', '202 Accepted', 'reply', { ms: 40 });
      b.bar('provider', 'busy', send.row, late.row, providerT, late.occ[0].t0);
      b.note(['api'], 'Nobody is waiting for this reply', { tone: 'warn' });
      return b.finish('The API stores the request, sends the email request without waiting, and replies 201 Created to the browser at once. The provider’s 202 Accepted arrives about 2.5 seconds later, when no part of the API is waiting for it. Had it been an error, nothing would have handled it.');
    },
  },

  outbox: {
    title: 'A job in the database',
    params: [{ id: 'down', label: 'Email provider is down', type: 'toggle', default: 'off' }],
    build: p => {
      const down = p.down === 'on';
      const b = new Builder([P.ui, P.api, P.db, P.worker, P.provider], { bars: true, clock: true, strip: true, darkMs: 1000 });
      b.pause(0.2);
      b.call('ui', 'api', 'POST /repairs', '201: R17', {
        reqMs: 30, repMs: 30,
        inner: () => b.call('api', 'db', 'INSERT request + job J9', 'COMMIT ok', { workMs: 5, workT: 0.15 }),
      });
      b.status('ui', 'done', 'has R17');
      b.gap('The worker polls for jobs about once a second', 0.9, 700);
      b.call('worker', 'db', 'Claim next job', 'Job J9', { workMs: 3, workT: 0.15 });
      b.call('worker', 'provider', 'POST /emails', down ? '503 Unavailable' : '202 Accepted', { reqMs: 40, repMs: 40, workMs: 300, workT: 0.45, replyKind: down ? 'error' : 'reply' });
      b.call('worker', 'db', down ? 'J9: retry in 30 s' : 'Mark J9 sent', 'OK', { workMs: 3, workT: 0.15 });
      if (down) b.status('worker', 'idle', 'J9 waits');
      return b.finish(down
        ? 'The booking is stored with notification job J9 in one transaction and the browser gets R17 within about 70 ms. The worker later claims J9, the provider answers 503 Unavailable, and the worker records that J9 should be retried in 30 seconds. The browser’s part of the diagram is unchanged.'
        : 'The booking is stored with notification job J9 in one transaction and the browser gets R17 within about 70 ms. Around 0.7 seconds later the worker claims J9, the provider accepts the email, and the worker marks J9 sent.');
    },
  },

  timeout: {
    title: 'What the worker sees after a timeout',
    params: [{ id: 'history', label: 'What actually happens', type: 'choice', default: 'reply-lost', options: [{ value: 'request-lost', label: 'Request is lost' }, { value: 'reply-lost', label: 'Reply is lost' }, { value: 'slow', label: 'Provider is slow' }] }],
    build: p => {
      const b = new Builder([P.worker, P.provider, P.inbox], { bars: true, clock: true, strip: true, darkMs: 10000 });
      b.status('inbox', 'empty', 'no email');
      b.pause(0.2);
      let req: Msg;
      if (p.history === 'request-lost') {
        req = b.msg('worker', 'provider', 'POST /emails', 'lost', { ms: 20, lostAt: 0.5 });
        b.pause(3, 10000 - b.ms);
      } else if (p.history === 'reply-lost') {
        req = b.msg('worker', 'provider', 'POST /emails', 'sync', { ms: 20 });
        const t = b.T;
        b.pause(0.45, 300);
        const rep = b.msg('provider', 'worker', '202 Accepted', 'lost', { ms: 20, lostAt: 0.5 });
        b.bar('provider', 'busy', req.row, rep.row, t, rep.occ[0].t0);
        b.pause(0.2, 200);
        b.msg('provider', 'inbox', 'Deliver email', 'async', { ms: 600 });
        b.status('inbox', 'delivered', '1 email');
        b.pause(2, 10000 - b.ms);
      } else {
        req = b.msg('worker', 'provider', 'POST /emails', 'sync', { ms: 20 });
        b.pause(2.8, 10000 - b.ms);
      }
      const timeoutT = b.T;
      const note = b.note(['worker'], 'Timeout after 10 s. Outcome unknown.', { tone: 'warn', rows: 1.2 });
      b.bar('worker', 'wait', req.row, note.row, req.occ[0].t0, timeoutT);
      b.status('worker', 'gave up', 'no reply');
      if (p.history === 'slow') {
        b.pause(1.2, 4000);
        const rep = b.msg('provider', 'worker', '202 Accepted, at 14 s', 'reply', { ms: 20 });
        b.bar('provider', 'busy', req.row, rep.row, req.occ[0].t1, rep.occ[0].t0);
        b.pause(0.2, 200);
        b.msg('provider', 'inbox', 'Deliver email', 'async', { ms: 600 });
        b.status('inbox', 'delivered', '1 email');
      }
      const said = { 'request-lost': 'The request never reaches the provider, so no email is sent.', 'reply-lost': 'The provider accepts the request and delivers the email, but its reply is lost on the way back.', slow: 'The provider takes 14 seconds. Its reply reaches the worker after the worker has stopped waiting, and the email is delivered.' }[p.history];
      return b.finish(`The worker sends POST /emails and waits. ${said} In every case the worker sees the same thing: no reply after 10 seconds.`);
    },
  },

  retry: {
    title: 'Retrying after a timeout',
    params: [
      { id: 'history', label: 'First attempt', type: 'choice', default: 'reply-lost', options: [{ value: 'request-lost', label: 'Request is lost' }, { value: 'reply-lost', label: 'Reply is lost' }] },
      { id: 'key', label: 'Send an idempotency key', type: 'toggle', default: 'off' },
    ],
    build: p => {
      const key = p.key === 'on';
      const b = new Builder([P.worker, P.provider, P.inbox], { bars: true, clock: true, strip: true, darkMs: 10000 });
      let emails = 0;
      b.status('inbox', 'empty', 'no email');
      b.pause(0.2);
      const label = key ? 'POST /emails, key J9' : 'POST /emails';
      let req: Msg;
      if (p.history === 'request-lost') {
        req = b.msg('worker', 'provider', label, 'lost', { ms: 20, lostAt: 0.5 });
        b.pause(1.4, 10000 - b.ms);
      } else {
        req = b.msg('worker', 'provider', label, 'sync', { ms: 20 });
        const t = b.T;
        b.pause(0.4, 300);
        const rep = b.msg('provider', 'worker', '202 Accepted', 'lost', { ms: 20, lostAt: 0.5 });
        b.bar('provider', 'busy', req.row, rep.row, t, rep.occ[0].t0);
        b.pause(0.15, 200);
        b.msg('provider', 'inbox', 'Deliver email', 'async', { ms: 600 });
        b.status('inbox', 'delivered', `${++emails} email`);
        b.pause(1.2, 10000 - b.ms);
      }
      const tT = b.T;
      const note = b.note(['worker'], 'Timeout after 10 s', { tone: 'warn' });
      b.bar('worker', 'wait', req.row, note.row, req.occ[0].t0, tT);
      b.status('worker', 'retrying', 'in 2 s');
      b.gap('Wait 2 s, then send the same request again', 0.8, 2000);
      const req2 = b.msg('worker', 'provider', key ? 'POST /emails, key J9 (retry)' : 'POST /emails (retry)', 'sync', { ms: 20 });
      const t2 = b.T;
      b.pause(0.4, 300);
      if (key && p.history === 'reply-lost') b.note(['provider'], 'Key J9 seen before: send nothing, return the saved reply', { tone: 'good', rows: 1.3 });
      const rep2 = b.msg('provider', 'worker', '202 Accepted', 'reply', { ms: 20 });
      b.bar('provider', 'busy', req2.row, rep2.row, t2, rep2.occ[0].t0);
      b.bar('worker', 'wait', req2.row, rep2.row, req2.occ[0].t0, rep2.occ[0].t1);
      b.status('worker', 'done', 'J9 sent');
      if (!(key && p.history === 'reply-lost')) {
        b.pause(0.15, 200);
        b.msg('provider', 'inbox', 'Deliver email', 'async', { ms: 600 });
        emails++;
        b.status('inbox', emails > 1 ? 'duplicate' : 'delivered', `${emails} email${emails > 1 ? 's' : ''}`);
      }
      const outcome = emails > 1 ? 'Mina receives two copies of the email.' : 'Mina receives one email.';
      return b.finish(`The first attempt ${p.history === 'request-lost' ? 'is lost before it reaches the provider' : 'reaches the provider, which sends the email, but the reply is lost'}. The worker times out after 10 seconds, waits 2 seconds and retries${key ? ' with the same idempotency key, J9' : ''}. ${outcome}`);
    },
  },

  fragments: {
    title: 'alt and opt',
    params: [
      { id: 'valid', label: 'Details valid', type: 'toggle', default: 'on' },
      { id: 'customer', label: 'New customer', type: 'toggle', default: 'off' },
    ],
    build: p => {
      const valid = p.valid === 'on';
      const fresh = p.customer === 'on';
      const b = new Builder([P.ui, P.api, P.db]);
      b.pause(0.2);
      b.msg('ui', 'api', 'POST /repairs', 'sync');
      b.pause(0.15);
      b.frame('alt', 'ui', 'db', [
        { guard: '[details valid]', ghost: !valid, body: () => {
          b.frame('opt', 'api', 'db', [{ guard: '[new customer]', ghost: !fresh, body: () => {
            b.msg('api', 'db', 'INSERT customer', 'sync'); b.pause(0.15);
            b.msg('db', 'api', 'OK', 'reply'); b.pause(0.15);
          } }]);
          b.msg('api', 'db', 'INSERT repair request', 'sync'); b.pause(0.15);
          b.msg('db', 'api', 'COMMIT ok', 'reply'); b.pause(0.15);
          b.msg('api', 'ui', '201 Created: R17', 'reply');
        } },
        { guard: '[details invalid]', ghost: valid, body: () => { b.msg('api', 'ui', '422: postcode missing', 'error'); } },
      ]);
      const path = valid ? `The details are valid, so the first section of the alt runs${fresh ? ', including the opt fragment that inserts a new customer' : '. Mina is a returning customer, so the opt fragment is skipped'}, and the browser gets R17.` : 'The details are invalid, so the else section runs and the API replies 422 without touching the database.';
      return b.finish(`After POST /repairs an alt fragment offers two paths. ${path} The path not taken stays drawn, faded.`);
    },
  },

  loop: {
    title: 'Polling in a loop',
    params: [{ id: 'passes', label: 'Technician scheduled on pass', type: 'choice', default: '3', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] }],
    build: p => {
      const n = Number(p.passes);
      const b = new Builder([P.ui, P.api, P.db], { clock: true });
      b.pause(0.2);
      b.loop('[status not scheduled]', 'ui', 'db', n, k => {
        const last = k === n - 1;
        b.msg('ui', 'api', 'GET /repairs/R17', 'sync', { ms: 30, T: 0.6 }); b.pause(0.1, 1);
        b.msg('api', 'db', 'SELECT status', 'sync', { ms: 1, T: 0.5 }); b.pause(0.1, 2);
        b.msg('db', 'api', last ? 'scheduled' : 'received', 'reply', { ms: 1, T: 0.5 }); b.pause(0.1, 1);
        b.msg('api', 'ui', last ? '200: scheduled' : '200: received', 'reply', { ms: 30, T: 0.6 });
        if (!last) { b.pause(0.1); b.note(['ui'], 'Wait 2 s', { T: 0.7 }); b.pause(0, 2000); }
      });
      return b.finish(`A loop fragment drawn once runs ${n} time${n > 1 ? 's' : ''}. Each pass the browser asks for the status of R17, the API reads it from Repair DB, and the browser waits 2 seconds before asking again. On pass ${n} the status is scheduled and the loop ends.`);
    },
  },

  par: {
    title: 'Two requests in parallel',
    params: [{ id: 'first', label: 'Reply that arrives first', type: 'choice', default: 'slots', options: [{ value: 'slots', label: 'Free slots' }, { value: 'status', label: 'Repair status' }] }],
    build: p => {
      const slotsFirst = p.first === 'slots';
      const b = new Builder([P.ui, P.api]);
      b.pause(0.2);
      b.frame('par', 'ui', 'api', [
        { guard: '[repair status]', offset: 0.2, body: () => {
          b.msg('ui', 'api', 'GET /repairs/R17', 'sync');
          b.pause(slotsFirst ? 1.6 : 0.3);
          b.msg('api', 'ui', '200: received', 'reply');
        } },
        { guard: '[free slots]', offset: 0.55, body: () => {
          b.msg('ui', 'api', 'GET /slots?repair=R17', 'sync');
          b.pause(slotsFirst ? 0.2 : 1.6);
          b.msg('api', 'ui', '200: three slots', 'reply');
        } },
      ]);
      return b.finish(`A par fragment with two sections. The browser asks for the repair status and for free appointment slots without waiting between them. ${slotsFirst ? 'The slots reply arrives first' : 'The status reply arrives first'}. Inside each section the request still comes before its reply.`);
    },
  },
};

export function defaults(def: ScenarioDef) {
  return Object.fromEntries(def.params.map(p => [p.id, p.default]));
}

// ---------- Layout and rendering ----------

export interface Layout {
  W: number; H: number; narrow: boolean; font: number; small: number;
  xs: Record<string, number>; margin: number; spacing: number;
  headW: number; headH: number; headLines: Record<string, string[]>;
  stripY: number; top: number; rowH: number;
}

const charW = (font: number) => font * 0.56;

function wrap(text: string, maxChars: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > maxChars) { lines.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) lines.push(line);
  return lines;
}

export function layout(s: Scenario, width: number): Layout {
  const W = Math.max(300, Math.round(width));
  const narrow = W < 520;
  const font = narrow ? 11.5 : 13;
  const small = narrow ? 10.5 : 11.5;
  const n = s.participants.length;
  const margin = Math.min(narrow ? 56 : 84, Math.max(34, W / (n * 2)));
  const spacing = n > 1 ? (W - 2 * margin) / (n - 1) : 0;
  const xs: Record<string, number> = {};
  s.participants.forEach((p, i) => { xs[p.id] = margin + i * spacing; });
  const headW = Math.min(132, spacing - 8, 2 * margin - 4);
  const maxChars = Math.max(5, Math.floor((headW - 10) / charW(font)));
  const headLines: Record<string, string[]> = {};
  let maxLines = 1;
  for (const p of s.participants) { const words = p.label.split(' '); const label = p.short && words.some(w => w.length > maxChars) ? p.short : p.label; headLines[p.id] = wrap(label, maxChars); maxLines = Math.max(maxLines, headLines[p.id].length); }
  const headH = 14 + maxLines * font * 1.2;
  const stripY = headH + 8;
  const top = stripY + (s.strip ? small * 2.6 + 6 : 0) + 10;
  const rowH = narrow ? 40 : 44;
  const H = Math.round(top + s.rows * rowH + 18);
  return { W, H, narrow, font, small, xs, margin, spacing, headW, headH, headLines, stripY, top, rowH };
}

const rowY = (L: Layout, r: number) => L.top + (r + 0.5) * L.rowH;
const rowTop = (L: Layout, r: number) => L.top + r * L.rowH;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const r1 = (v: number) => Math.round(v * 10) / 10;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function clockAt(s: Scenario, T: number) {
  const c = s.clock;
  if (!c) return 0;
  if (T <= c[0][0]) return c[0][1];
  for (let i = 1; i < c.length; i++) {
    if (T <= c[i][0]) {
      const [t0, m0] = c[i - 1];
      const [t1, m1] = c[i];
      return t1 === t0 ? m1 : m0 + (m1 - m0) * (T - t0) / (t1 - t0);
    }
  }
  return c[c.length - 1][1];
}

export function formatMs(ms: number) {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(ms < 10000 ? 2 : 1)} s`;
}

/** Latest occurrence that has started by T, if any. */
function current(item: Item, T: number): Occ | null {
  let found: Occ | null = null;
  for (const o of item.occ) if (o.t0 <= T + 1e-9) found = o;
  return found;
}

function visibleFrom(item: Item) { return item.occ[0].t0; }

interface Mark { t0: number; y: number }
function marks(s: Scenario, L: Layout): Mark[] {
  const list: Mark[] = [];
  for (const it of s.items) {
    if (it.ghost) continue;
    if (it.type === 'msg') for (const o of it.occ) list.push({ t0: o.t0, y: rowY(L, it.row) });
    if (it.type === 'note') list.push({ t0: it.occ[0].t0, y: rowY(L, it.row + (it.rows - 1) / 2) });
  }
  return list.sort((a, b) => a.t0 - b.t0);
}

function nowY(ms: Mark[], T: number) {
  let k = -1;
  for (let i = 0; i < ms.length; i++) if (ms[i].t0 <= T) k = i;
  if (k < 0) return -Infinity;
  const prev = k > 0 ? ms[k - 1].y : ms[k].y;
  const p = clamp((T - ms[k].t0) / 0.3, 0, 1);
  return prev + (ms[k].y - prev) * p;
}

type Attrs = Record<string, string | number>;
type PartState = Record<string, Attrs | { text: string }>;

function msgGeom(m: Msg, L: Layout, T: number) {
  const occ = current(m, T);
  const a = L.xs[m.from], b = L.xs[m.to];
  const dir = b > a ? 1 : -1;
  const x0 = a + dir * 5;
  const xEnd = b - dir * 6;
  const full = m.lostAt ? x0 + (xEnd - x0) * m.lostAt : xEnd;
  const y = rowY(L, m.row);
  let p = 0;
  if (m.ghost) p = 1;
  else if (occ) p = occ.t1 > occ.t0 ? clamp((T - occ.t0) / (occ.t1 - occ.t0), 0, 1) : 1;
  if (p > 0.99) p = 1;
  const ease = p < 1 ? 1 - Math.pow(1 - p, 2.2) : 1;
  const x = x0 + (full - x0) * ease;
  const label = occ?.label ?? m.label;
  const est = label.length * charW(L.font);
  const lx = clamp((a + b) / 2, est / 2 + 3, L.W - est / 2 - 3);
  return { x0, x, y, dir, p, visible: m.ghost ? T >= visibleFrom(m) : !!occ, label, lx, moving: !m.ghost && p > 0 && p < 1 };
}

function headPath(kind: MsgKind) {
  if (kind === 'sync') return 'M0,0 L-9,-4.5 L-9,4.5 Z';
  if (kind === 'lost') return 'M0,0 m-4,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0';
  return 'M-9,-4.5 L0,0 L-9,4.5';
}

function itemState(s: Scenario, L: Layout, it: Item, T: number, mk: Mark[]): PartState {
  switch (it.type) {
    case 'msg': {
      const g = msgGeom(it, L, T);
      const headX = it.kind === 'lost' ? g.x + g.dir * 4 : g.x;
      return {
        g: { opacity: g.visible ? (it.ghost ? 0.32 : 1) : 0, class: `seq-msg seq-${it.kind}${it.ghost ? ' seq-ghost' : ''}${g.moving ? ' is-moving' : ''}` },
        line: { x1: r1(g.x0), y1: r1(g.y), x2: r1(it.kind === 'lost' ? g.x : g.x - g.dir * 2), y2: r1(g.y) },
        head: { transform: `translate(${r1(headX)},${r1(g.y)}) scale(${g.dir},1)` },
        packet: { cx: r1(g.x - g.dir * 7), cy: r1(g.y), opacity: g.moving ? 1 : 0 },
        label: { x: r1(g.lx), y: r1(g.y - 7) },
        labelText: { text: g.label },
      };
    }
    case 'bar': {
      const occ = it.occ[0];
      const top = rowY(L, it.row0);
      const end = rowY(L, it.row1);
      const bottom = T >= occ.t1 - 0.003 ? end : clamp(nowY(mk, T), top, end);
      const vis = T >= occ.t0;
      let opacity = vis ? 1 : 0;
      if (vis && it.mode === 'wait' && s.clock) {
        const waited = clockAt(s, Math.min(T, occ.t1)) - clockAt(s, occ.t0);
        opacity = 0.4 + 0.6 * clamp(waited / s.darkMs, 0, 1);
      }
      const active = vis && T < occ.t1;
      return {
        g: { opacity, class: `seq-bar seq-bar-${it.mode}${active ? ' is-active' : ''}` },
        rect: { x: r1(L.xs[it.on] - 5 + it.depth * 5), y: r1(top), width: 10, height: r1(Math.max(0, bottom - top)) },
      };
    }
    case 'note': {
      const vis = T >= it.occ[0].t0;
      const p = it.ghost ? 1 : clamp((T - it.occ[0].t0) / 0.3, 0, 1);
      return { g: { opacity: vis ? (it.ghost ? 0.32 : p) : 0, class: `seq-note seq-note-${it.tone}${it.ghost ? ' seq-ghost' : ''}` } };
    }
    case 'gap': {
      const vis = T >= it.occ[0].t0;
      return { g: { opacity: vis ? clamp((T - it.occ[0].t0) / 0.3, 0, 1) : 0, class: 'seq-gap' } };
    }
    case 'frame': {
      const vis = T >= it.occ[0].t0;
      const p = it.ghost ? 1 : clamp((T - it.occ[0].t0) / 0.3, 0, 1);
      let pass = 0;
      it.passes.forEach((t, i) => { if (t <= T) pass = i + 1; });
      return {
        g: { opacity: vis ? (it.ghost ? 0.4 : p) : 0, class: `seq-frame${it.ghost ? ' seq-ghost' : ''}` },
        passText: { text: it.passes.length ? (pass ? `pass ${pass}` : '') : '' },
      };
    }
    default:
      return {};
  }
}

interface StripState { state: string; detail: string; cls: string }

export function stripState(s: Scenario, T: number): Record<string, StripState> {
  const out: Record<string, StripState> = {};
  for (const p of s.participants) {
    const bars = s.items.filter((i): i is Bar => i.type === 'bar' && i.on === p.id && i.occ[0].t0 <= T && T < i.occ[0].t1 - 0.003);
    const wait = bars.find(b => b.mode === 'wait');
    if (wait) { out[p.id] = { state: 'waiting', detail: formatMs(clockAt(s, T) - clockAt(s, wait.occ[0].t0)), cls: 'wait' }; continue; }
    if (bars.length) { out[p.id] = { state: 'working', detail: '', cls: 'busy' }; continue; }
    let st: Status | null = null;
    for (const i of s.items) if (i.type === 'status' && i.on === p.id && i.occ[0].t0 <= T) st = i;
    out[p.id] = st ? { state: st.text, detail: st.detail ?? '', cls: st.text.replace(/\s+/g, '-') } : { state: 'idle', detail: '', cls: 'idle' };
  }
  return out;
}

function attrs(a: Attrs) {
  return Object.entries(a).map(([k, v]) => `${k}="${esc(String(v))}"`).join(' ');
}

export function renderSVG(s: Scenario, L: Layout, T: number, uid: string, titleId: string) {
  const mk = marks(s, L);
  const out: string[] = [];
  out.push(`<svg class="seq-svg" viewBox="0 0 ${L.W} ${L.H}" width="${L.W}" height="${L.H}" role="img" aria-labelledby="${titleId}" style="font-size:${L.font}px">`);
  out.push(`<defs><pattern id="${uid}-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><rect width="5" height="5" class="seq-hatch-bg"/><line x1="0" y1="0" x2="0" y2="5" class="seq-hatch-line"/></pattern></defs>`);
  // participants and lifelines
  for (const p of s.participants) {
    const x = L.xs[p.id];
    const lines = L.headLines[p.id];
    out.push(`<line class="seq-life" x1="${r1(x)}" y1="${r1(L.headH + 2)}" x2="${r1(x)}" y2="${L.H - 6}"/>`);
    out.push(`<rect class="seq-head" x="${r1(x - L.headW / 2)}" y="2" width="${r1(L.headW)}" height="${r1(L.headH)}" rx="3"/>`);
    const y0 = 2 + L.headH / 2 - ((lines.length - 1) * L.font * 1.2) / 2 + L.font * 0.35;
    out.push(`<text class="seq-head-text" text-anchor="middle">${lines.map((l, i) => `<tspan x="${r1(x)}" y="${r1(y0 + i * L.font * 1.2)}">${esc(l)}</tspan>`).join('')}</text>`);
  }
  // strip
  if (s.strip) {
    const st = stripState(s, T);
    for (const p of s.participants) {
      const x = L.xs[p.id];
      out.push(`<text class="seq-strip seq-strip-${st[p.id].cls}" data-strip="${p.id}" text-anchor="middle" style="font-size:${L.small}px"><tspan data-k="state" x="${r1(x)}" y="${r1(L.stripY + L.small)}">${esc(st[p.id].state)}</tspan><tspan data-k="detail" x="${r1(x)}" y="${r1(L.stripY + L.small * 2.25)}">${esc(st[p.id].detail)}</tspan></text>`);
    }
  }
  const order: Item['type'][] = ['frame', 'gap', 'bar', 'note', 'msg'];
  const byDepth = [...s.items].sort((a, b) => (a.type === 'bar' ? a.depth : 0) - (b.type === 'bar' ? b.depth : 0));
  for (const type of order) {
    for (const it of byDepth) {
      if (it.type !== type) continue;
      const st = itemState(s, L, it, T, mk);
      const g = st.g as Attrs | undefined;
      if (!g) continue;
      out.push(`<g data-i="${it.id}" ${attrs(g)}>`);
      if (it.type === 'msg') {
        out.push(`<line data-p="line" ${attrs(st.line as Attrs)}/>`);
        out.push(`<rect data-p="packet" class="seq-packet" x="-6" y="-4" width="12" height="8" rx="2" ${attrs({ opacity: (st.packet as Attrs).opacity, transform: `translate(${(st.packet as Attrs).cx},${(st.packet as Attrs).cy})` })}/>`);
        out.push(`<path data-p="head" class="seq-headmark" d="${headPath(it.kind)}" ${attrs(st.head as Attrs)}/>`);
        out.push(`<text data-p="label" class="seq-label" text-anchor="middle" ${attrs(st.label as Attrs)}>${esc((st.labelText as { text: string }).text)}</text>`);
      } else if (it.type === 'bar') {
        out.push(`<rect data-p="rect" ${attrs(st.rect as Attrs)} ${it.mode === 'wait' ? `fill="url(#${uid}-hatch)"` : ''}/>`);
      } else if (it.type === 'note') {
        const xs = it.over.map(id => L.xs[id]);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const maxW = Math.min(L.W - 8, Math.max(L.spacing * 1.6, 150));
        const lines = wrap(it.text, Math.floor((maxW - 14) / charW(L.small)));
        const w = Math.min(maxW, Math.max(...lines.map(l => l.length)) * charW(L.small) + 16);
        const h = lines.length * L.small * 1.3 + 9;
        const x = clamp(cx - w / 2, 4, L.W - 4 - w);
        const y = rowY(L, it.row + (it.rows - 1) / 2) - h / 2;
        out.push(`<rect class="seq-note-box" x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="2"/>`);
        out.push(`<text class="seq-note-text" text-anchor="middle" style="font-size:${L.small}px">${lines.map((l, i) => `<tspan x="${r1(x + w / 2)}" y="${r1(y + 4.5 + L.small * 1.02 + i * L.small * 1.3)}">${esc(l)}</tspan>`).join('')}</text>`);
      } else if (it.type === 'gap') {
        const y = rowY(L, it.row - 0.1);
        const lines = wrap(it.text, Math.floor((L.W - 20) / charW(L.small)));
        out.push(`<text class="seq-gap-text" text-anchor="middle" style="font-size:${L.small}px">${lines.map((l, i) => `<tspan x="${r1(L.W / 2)}" y="${r1(y + i * L.small * 1.25)}">${esc(l)}</tspan>`).join('')}</text>`);
      } else if (it.type === 'frame') {
        const pad = Math.min(L.margin - 3, 30) - 0;
        const xa = L.xs[it.from] - pad, xb = L.xs[it.to] + pad;
        const ya = rowTop(L, it.row0) + 2, yb = rowTop(L, it.row1);
        const tagW = it.op.length * charW(L.small) + 16;
        const tagH = L.small + 7;
        out.push(`<rect class="seq-frame-box" x="${r1(xa)}" y="${r1(ya)}" width="${r1(xb - xa)}" height="${r1(yb - ya)}"/>`);
        out.push(`<path class="seq-frame-tag" d="M${r1(xa)},${r1(ya)} h${r1(tagW)} v${r1(tagH - 5)} l-5,5 h${r1(-(tagW - 5))} Z"/>`);
        out.push(`<text class="seq-frame-op" x="${r1(xa + 6)}" y="${r1(ya + tagH - 5)}" style="font-size:${L.small}px">${esc(it.op)}</text>`);
        out.push(`<text class="seq-guard" x="${r1(xa + tagW + 6)}" y="${r1(ya + tagH - 5)}" style="font-size:${L.small}px">${esc(it.guard)}</text>`);
        out.push(`<text data-p="pass" class="seq-pass" text-anchor="end" x="${r1(xb - 6)}" y="${r1(ya + tagH - 5)}" style="font-size:${L.small}px">${esc((st.passText as { text: string }).text)}</text>`);
        for (const sec of it.sections) {
          const y = rowTop(L, sec.row);
          out.push(`<line class="seq-frame-divider" x1="${r1(xa)}" x2="${r1(xb)}" y1="${r1(y)}" y2="${r1(y)}"/>`);
          out.push(`<text class="seq-guard" x="${r1(xa + 6)}" y="${r1(y + L.small + 4)}" style="font-size:${L.small}px">${esc(sec.guard)}</text>`);
        }
      }
      out.push('</g>');
    }
  }
  out.push('</svg>');
  return out.join('');
}

/** Update an already rendered SVG to time T without rebuilding it. */
export function updateSVG(svg: SVGSVGElement, s: Scenario, L: Layout, T: number) {
  const mk = marks(s, L);
  for (const it of s.items) {
    if (it.type === 'status') continue;
    const g = svg.querySelector<SVGGElement>(`g[data-i="${it.id}"]`);
    if (!g) continue;
    const st = itemState(s, L, it, T, mk);
    for (const [part, a] of Object.entries(st)) {
      if (part === 'g') { for (const [k, v] of Object.entries(a as Attrs)) g.setAttribute(k, String(v)); continue; }
      if (part === 'labelText') { const el = g.querySelector('[data-p="label"]'); if (el && el.textContent !== (a as { text: string }).text) el.textContent = (a as { text: string }).text; continue; }
      if (part === 'passText') { const el = g.querySelector('[data-p="pass"]'); if (el) el.textContent = (a as { text: string }).text; continue; }
      const el = g.querySelector(`[data-p="${part}"]`);
      if (!el) continue;
      if (part === 'packet') {
        const pa = a as Attrs;
        el.setAttribute('opacity', String(pa.opacity));
        el.setAttribute('transform', `translate(${pa.cx},${pa.cy})`);
        continue;
      }
      for (const [k, v] of Object.entries(a as Attrs)) el.setAttribute(k, String(v));
    }
  }
  if (s.strip) {
    const st = stripState(s, T);
    for (const p of s.participants) {
      const t = svg.querySelector(`[data-strip="${p.id}"]`);
      if (!t) continue;
      t.setAttribute('class', `seq-strip seq-strip-${st[p.id].cls}`);
      const a = t.querySelector('[data-k="state"]'), b = t.querySelector('[data-k="detail"]');
      if (a && a.textContent !== st[p.id].state) a.textContent = st[p.id].state;
      if (b && b.textContent !== st[p.id].detail) b.textContent = st[p.id].detail;
    }
  }
}

// ---------- Text equivalents ----------

export interface Event { t0: number; t1: number; text: string }

export function events(s: Scenario): Event[] {
  const name = (id: string) => s.participants.find(p => p.id === id)?.label ?? id;
  const list: Event[] = [];
  for (const it of s.items) {
    if (it.ghost) continue;
    if (it.type === 'msg') {
      const kind = { sync: 'call', reply: 'reply', async: 'one-way message, sender does not wait', lost: 'lost on the way', error: 'error reply' }[it.kind];
      it.occ.forEach(o => list.push({ t0: o.t0, t1: o.t1, text: `${name(it.from)} → ${name(it.to)}: ${o.label ?? it.label} (${kind})` }));
    } else if (it.type === 'note') {
      list.push({ t0: it.occ[0].t0, t1: it.occ[0].t1, text: `Note on ${it.over.map(name).join(' and ')}: ${it.text}` });
    } else if (it.type === 'gap') {
      list.push({ t0: it.occ[0].t0, t1: it.occ[0].t1, text: it.text });
    } else if (it.type === 'frame') {
      list.push({ t0: it.occ[0].t0, t1: it.occ[0].t0, text: `${it.op} fragment begins ${it.guard}` });
      it.passes.slice(1).forEach((t, i) => list.push({ t0: t, t1: t, text: `Loop pass ${i + 2} begins` }));
    }
  }
  return list.sort((a, b) => a.t0 - b.t0 || a.t1 - b.t1);
}

export function stops(s: Scenario): number[] {
  const set = new Set<number>([0]);
  // Stop just before each event ends, so the next event (often starting at that instant) hasn't begun.
  for (const e of events(s)) set.add(Math.max(e.t0, Math.round((e.t1 - 0.002) * 1000) / 1000));
  set.add(Math.round(s.duration * 1000) / 1000);
  return [...set].sort((a, b) => a - b);
}
