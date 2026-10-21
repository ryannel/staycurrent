#!/usr/bin/env node
// Verification script for "Making concurrent changes correct": runs every schedule the
// article's figures and tables describe in real PostgreSQL sessions, with explicit
// barriers, and checks each statement's result and the committed rows after each
// step. Needs Node 22 or later and a disposable PostgreSQL 18 server that accepts
// password-less (trust) connections, for example one started with
//   initdb -D /tmp/pg --auth=trust -U postgres
//   pg_ctl -D /tmp/pg -o "-p 57612 -c listen_addresses=127.0.0.1" start
// Usage: node verify.mjs [--host 127.0.0.1] [--port 57612] [--user postgres]
// It creates its own database, refuses one that already exists, and drops it at
// the end. Keep model.mjs beside this file: the schedules come from there.
import net from 'node:net';
import { figures, schemaSql, seedSql, sql, rules, claims, start } from './model.mjs';

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const HOST = arg('host', '127.0.0.1');
const PORT = Number(arg('port', '57612'));
const USER = arg('user', 'postgres');
const DB = `a03_verify_${process.pid}`;

// ---- A small PostgreSQL client: simple-query protocol, trust authentication ----
class Session {
  constructor(name, database) { this.name = name; this.database = database; this.queue = []; this.buffer = Buffer.alloc(0); }
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = net.connect(PORT, HOST);
      this.socket.on('error', error => { if (this.ready) this.failCurrent(error); else reject(error); });
      this.socket.on('close', () => { this.closed = true; this.failCurrent(new Error('connection closed')); });
      this.socket.on('data', chunk => this.receive(chunk));
      this.socket.on('connect', () => {
        const params = Buffer.from(`user\0${USER}\0database\0${this.database}\0application_name\0${this.name}\0\0`);
        const header = Buffer.alloc(8); header.writeInt32BE(8 + params.length, 0); header.writeInt32BE(196608, 4);
        this.socket.write(Buffer.concat([header, params]));
      });
      this.onReady = () => { this.ready = true; resolve(this); };
      this.onStartupError = reject;
    });
  }
  failCurrent(error) { const current = this.queue.shift(); if (current) current.reject(Object.assign(error, { results: current.results, notices: current.notices ?? [] })); }
  receive(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 5) {
      const type = String.fromCharCode(this.buffer[0]);
      const length = this.buffer.readInt32BE(1);
      if (this.buffer.length < length + 1) return;
      const body = this.buffer.subarray(5, length + 1);
      this.buffer = this.buffer.subarray(length + 1);
      this.message(type, body);
    }
  }
  message(type, body) {
    const current = this.queue[0];
    if (type === 'R' && body.readInt32BE(0) !== 0) { this.onStartupError(new Error('server asked for a password; use a trust-authenticated disposable server')); return; }
    if (type === 'K') { this.pid = body.readInt32BE(0); return; }
    if (type === 'Z') {
      if (!this.ready) { this.onReady(); return; }
      this.status = String.fromCharCode(body[0]);
      const done = this.queue.shift(); if (done) done.resolve(done.results);
      return;
    }
    if (type === 'E' || type === 'N') {
      const fields = {}; let i = 0;
      while (body[i] !== 0) { const code = String.fromCharCode(body[i]); const end = body.indexOf(0, i + 1); fields[code] = body.toString('utf8', i + 1, end); i = end + 1; }
      if (type === 'E') { if (!this.ready) { this.onStartupError(new Error(fields.M)); return; } if (current) current.results.push({ error: fields.C, message: fields.M }); }
      if (type === 'N' && current) (current.notices ??= []).push(`${fields.M}${fields.D ? ` ${fields.D}` : ''}`);
      return;
    }
    if (!current) return;
    if (type === 'T') current.results.push({ rows: [] });
    if (type === 'D') {
      const count = body.readInt16BE(0); const row = []; let i = 2;
      for (let c = 0; c < count; c++) { const len = body.readInt32BE(i); i += 4; if (len < 0) row.push(null); else { row.push(body.toString('utf8', i, i + len)); i += len; } }
      current.results.at(-1).rows.push(row.map(v => (v !== null && /^-?\d+$/.test(v) ? Number(v) : v === 't' ? true : v === 'f' ? false : v)));
    }
    if (type === 'C') {
      const tag = body.toString('utf8', 0, body.length - 1);
      const last = current.results.at(-1);
      const entry = last && last.rows && last.tag === undefined ? last : (current.results.push({}), current.results.at(-1));
      entry.tag = tag; entry.count = Number(tag.split(' ').at(-1));
    }
  }
  /** Sends SQL and returns a promise of every statement's result. */
  send(text) {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, results: [] });
      const payload = Buffer.from(text + '\0');
      const header = Buffer.alloc(5); header.write('Q', 0); header.writeInt32BE(4 + payload.length, 1);
      this.socket.write(Buffer.concat([header, payload]));
    });
  }
  async query(text) { const results = await this.send(text); const error = results.find(r => r.error); if (error) throw new Error(`${this.name}: ${error.error} ${error.message} in ${text}`); return results.at(-1); }
  close() { if (!this.closed) { this.socket.end(); this.closed = true; } }
  destroy() { this.socket.destroy(); this.closed = true; }
}

// ---- Bookkeeping ---------------------------------------------------------
const log = [];
let failures = 0;
const check = (ok, label, detail = '') => {
  if (process.env.A03_PROGRESS) process.stderr.write(`${ok ? 'ok  ' : 'FAIL'} ${label}\n`);
  log.push(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const timeout = (promise, ms) => Promise.race([promise.then(v => ({ value: v })), sleep(ms).then(() => ({ pending: true }))]);

let admin, observer;
async function connectAs(name) { const s = new Session(name, DB); await s.connect(); return s; }
async function reset() {
  await observer.query('DROP TABLE IF EXISTS instructors, reservations, classes, customers CASCADE;');
  await observer.query(schemaSql);
  await observer.query(seedSql);
}
async function committed() {
  const classes = (await observer.query('SELECT class_id, title, capacity, remaining FROM classes ORDER BY class_id;')).rows
    .map(([class_id, title, capacity, remaining]) => ({ class_id, title, capacity, remaining }));
  const reservations = (await observer.query('SELECT request_id, class_id, owner_id FROM reservations ORDER BY request_id;')).rows
    .map(([request_id, class_id, owner_id]) => ({ request_id, class_id, owner_id }));
  const instructors = (await observer.query('SELECT class_id, person, available FROM instructors ORDER BY person;')).rows
    .map(([class_id, person, available]) => ({ class_id, person, available }));
  return { classes, reservations, instructors };
}
const normal = db => ({ ...db, reservations: [...db.reservations].sort((a, b) => a.request_id.localeCompare(b.request_id)), instructors: [...db.instructors].sort((a, b) => a.person.localeCompare(b.person)) });
async function waitingOnLock(session, ms = 3000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    const r = await observer.query(`SELECT wait_event_type FROM pg_stat_activity WHERE pid = ${session.pid};`);
    if (r.rows[0]?.[0] === 'Lock') return true;
    await sleep(25);
  }
  return false;
}
function compare(label, expect, result) {
  if (expect.error) return check(result.error === expect.error, label, `expected ${expect.error}, got ${result.error ?? result.tag}`);
  if (result.error) return check(false, label, `unexpected ${result.error} ${result.message}`);
  if (expect.rows) return check(same(result.rows, expect.rows), label, `expected ${JSON.stringify(expect.rows)}, got ${JSON.stringify(result.rows)}`);
  if (expect.count !== undefined) return check(result.count === expect.count, label, `expected ${expect.count} rows, got ${result.tag}`);
  if (expect.tag) return check(result.tag === expect.tag, label, `expected ${expect.tag}, got ${result.tag}`);
  return check(true, label);
}

// ---- Replay a figure's steps -----------------------------------------------
async function replay(figureId, option) {
  await reset();
  if (figures[figureId].setupSql) await observer.query(figures[figureId].setupSql);
  const sessions = {}; const pending = {};
  const lane = async id => (sessions[id] && !sessions[id].closed ? sessions[id] : (sessions[id] = await connectAs(`${figureId}-${option.id}-${id}`)));
  for (const [index, step] of option.steps.entries()) {
    const label = `Figure ${figureId} · ${option.label} · step ${index + 1}${step.show ? ` (${step.lane}: ${step.show})` : ''}`;
    // A new request in the same lane gets its own session, as Figure 1's R11 does.
    if (step.fresh && sessions[step.lane]) { sessions[step.lane].close(); delete sessions[step.lane]; }
    if (step.lane && step.resume) {
      const outcome = await timeout(pending[step.lane], 4000);
      if (outcome.pending) check(false, label, 'the waiting statement did not finish');
      else compare(label, step.expect, outcome.value.at(-1));
      delete pending[step.lane];
    } else if (step.lane && step.action === 'commit-then-drop') {
      const session = await lane(step.lane);
      session.send(step.run).catch(() => {}); session.socket.end(); session.closed = true;
      await sleep(300);
      check(true, label, 'COMMIT sent, connection dropped without reading the reply');
    } else if (step.lane && step.action === 'commit-held') {
      // The COMMIT is lost on the way: nothing reaches the server yet, so the
      // transaction stays open there until a later step sends it.
      const session = await lane(step.lane);
      check(session.status === 'T', label, `COMMIT held back; the server still has the transaction open (status ${session.status})`);
    } else if (step.lane && step.action === 'drop-before-commit') {
      const session = await lane(step.lane);
      await observer.query(`SELECT pg_terminate_backend(${session.pid});`);
      await sleep(300);
      const sent = await timeout(session.send(step.run).catch(e => [{ error: 'connection', message: e.message }]), 1000);
      check(sent.pending || sent.value?.[0]?.error === 'connection', label, 'connection ended before COMMIT reached the server');
    } else if (step.lane && step.run) {
      const session = await lane(step.lane);
      const promise = session.send(step.run);
      if (step.expect?.waits) {
        const early = await timeout(promise, 150);
        check(!early.value && await waitingOnLock(session), label, early.value ? `returned instead of waiting: ${JSON.stringify(early.value)}` : 'blocked on a lock, seen in pg_stat_activity');
        pending[step.lane] = promise;
      } else {
        const outcome = await timeout(promise, 4000);
        if (outcome.pending) check(false, label, 'statement did not finish');
        else compare(label, step.expect, outcome.value.at(-1));
      }
    }
    await sleep(40);
    const actual = await committed();
    check(same(normal(actual), normal(step.db)), `${label}: committed rows`, same(normal(actual), normal(step.db)) ? '' : `expected ${JSON.stringify(step.db)}, got ${JSON.stringify(actual)}`);
  }
  for (const s of Object.values(sessions)) s.close();
  const final = option.steps.at(-1).db;
  const r = rules(final);
  return [...r.classes, r.instructors].filter(x => !x.ok).map(x => x.id);
}

// Each option's final committed state must show whether its protection worked.
const expectedBroken = {
  'clicks/separate': ['class-22'], 'clicks/transaction': [],
  'race/read-write': ['class-21'], 'race/subtract': [], 'race/condition': [], 'race/repeatable': [],
  'instructors/repeatable': ['instructors'], 'instructors/lock': [], 'instructors/serializable-whole': [], 'instructors/serializable-statement': ['instructors'],
  'swap/opposite': [], 'swap/ordered': [],
  'reply/again': [], 'reply/lookup': [], 'reply/claim': [], 'reply/claim-lost': [],
};

// ---- Checks for claims made outside the figures -----------------------------
async function visibilityTable() {
  for (const level of ['READ COMMITTED', 'REPEATABLE READ']) {
    for (const row of claims.visibility) {
      await reset();
      const mina = await connectAs('vis-mina'); const tariq = await connectAs('vis-tariq');
      await tariq.query(`BEGIN ISOLATION LEVEL ${level};`);
      if (level === 'REPEATABLE READ') await tariq.query('SELECT count(*) FROM customers;'); // take Tariq's snapshot before Mina commits
      await mina.query(`BEGIN; ${sql.take(21)}`); await mina.query(sql.book('R8', 21, 1));
      const text = row.statement === 'Ordinary SELECT' ? sql.readRemaining(21)
        : row.statement.startsWith('SELECT') ? 'SELECT remaining FROM classes WHERE class_id = 21 FOR UPDATE;' : sql.take(21);
      const label = `Versions and locks · ${row.statement} · ${level}`;
      const p = tariq.send(text);
      const early = await timeout(p, 200);
      if (row.during.startsWith('Returns')) check(same(early.value?.at(-1)?.rows, [[1]]), `${label} · during`, row.during);
      else check(!early.value && await waitingOnLock(tariq), `${label} · during`, row.during);
      await mina.query('COMMIT;');
      let after;
      if (row.statement === 'Ordinary SELECT') after = (await tariq.send(text)).at(-1);
      else after = (await p).at(-1);
      const claim = level === 'READ COMMITTED' ? row.readCommitted : row.repeatableRead;
      const ok = claim.includes('40001') ? after.error === '40001'
        : claim.includes('no rows') ? after.count === 0 && after.rows?.length === 0
        : claim.includes('returns 0') ? same(after.rows, [[0]]) : same(after.rows, [[1]]);
      check(ok, `${label} · after Mina commits`, `${claim}; got ${after.error ?? JSON.stringify(after.rows)}`);
      mina.close(); tariq.close();
    }
  }
}

async function rollbackPrediction() {
  await reset();
  const mina = await connectAs('pred-mina'); const tariq = await connectAs('pred-tariq');
  await mina.query(`BEGIN; ${sql.take(21)}`); await mina.query(sql.book('R8', 21, 1));
  const p = tariq.send(`BEGIN; ${sql.take(21)}`);
  check(await waitingOnLock(tariq), 'Prediction · Tariq waits while Mina’s booking is open');
  await mina.query('ROLLBACK;');
  const got = (await p).at(-1);
  check(same(got.rows, claims.rollbackPrediction.tariqGets), 'Prediction · after Mina rolls back, Tariq’s condition is checked against the original row and takes the place', JSON.stringify(got.rows));
  await tariq.query(`${sql.book('R9', 21, 2)} COMMIT;`);
  const db = await committed();
  check(same(db.reservations.map(r => r.request_id), claims.rollbackPrediction.bookings) && db.classes[0].remaining === 0, 'Prediction · only R9 holds class 21', JSON.stringify(db.reservations));
  mina.close(); tariq.close();
}

async function concurrentClicks() {
  // Mina's two clicks arrive together. The second waits on class 22's row, then its insert is refused.
  await reset();
  const c1 = await connectAs('click-r10'); const c2 = await connectAs('click-r11');
  await c1.query(`BEGIN; ${sql.take(22)}`);
  const p = c2.send(`BEGIN; ${sql.take(22)}`);
  check(await waitingOnLock(c2), 'Concurrent clicks · R11 waits on class 22’s row');
  await c1.query(`${sql.book('R10', 22, 1)} COMMIT;`);
  check(same((await p).at(-1).rows, [[0]]), 'Concurrent clicks · R11 then takes a place (remaining 0)');
  const ins = (await c2.send(sql.book('R11', 22, 1))).at(-1);
  check(ins.error === '23505', 'Concurrent clicks · R11’s insert is refused by UNIQUE (class_id, owner_id)', ins.error);
  const end = (await c2.send('COMMIT;')).at(-1);
  check(end.tag === 'ROLLBACK', 'Concurrent clicks · COMMIT of the failed transaction reports ROLLBACK', end.tag);
  const db = await committed();
  check(db.classes[1].remaining === 1 && db.reservations.length === 2, 'Concurrent clicks · class 22 keeps 1 place, R7 and R10', JSON.stringify(db));
  // With the insert first, the second click waits on the first one's uncommitted key instead.
  await reset();
  await c1.query(`BEGIN; ${sql.book('R10', 22, 1)}`);
  const q2 = c2.send(`BEGIN; ${sql.book('R11', 22, 1)}`);
  check(await waitingOnLock(c2), 'Concurrent clicks, insert first · R11 waits for R10’s uncommitted key');
  await c1.query(`${sql.take(22)} COMMIT;`);
  check((await q2).at(-1).error === '23505', 'Concurrent clicks, insert first · then fails with 23505');
  await c2.send('ROLLBACK;');
  c1.close(); c2.close();
}

async function failedStatementInsideTransaction() {
  await reset();
  const s = await connectAs('aborted');
  await s.query(`BEGIN; ${sql.book('R12', 22, 2)}`.replace('BEGIN; ', 'BEGIN; ')).catch(() => {});
  const after = (await s.send(sql.readRemaining(22))).at(-1);
  check(after.error === '25P02', 'Aborted transaction · Tariq’s refused R12 leaves the transaction failed; the next statement gets 25P02', after.error);
  await s.send('ROLLBACK;');
  s.close();
}

async function savepointHazard() {
  await reset();
  const s = await connectAs('savepoint');
  await s.query(`${sql.take(22)} ${sql.book('R10', 22, 1)}`); // R10 already booked, autocommit
  await s.query(`BEGIN; ${sql.take(22)} SAVEPOINT before_insert;`);
  const ins = (await s.send(sql.book('R11', 22, 1))).at(-1);
  await s.query('ROLLBACK TO SAVEPOINT before_insert;');
  const end = (await s.send('COMMIT;')).at(-1);
  const db = await committed();
  check(ins.error === '23505' && end.tag === 'COMMIT' && db.classes[1].remaining === 0 && db.reservations.length === 2,
    'Savepoint · rolling back to a savepoint around the insert, then committing, keeps the taken place with no booking', JSON.stringify(db.classes[1]));
  s.close();
}

async function ddlAndSequences() {
  const s = await connectAs('ddl');
  await s.query('BEGIN; CREATE TABLE waitlist (request_id text PRIMARY KEY); ROLLBACK;');
  const t = await s.query("SELECT to_regclass('waitlist') IS NULL;");
  check(t.rows[0][0] === true, 'DDL · CREATE TABLE inside a rolled-back transaction leaves no table in PostgreSQL');
  await s.query('CREATE SEQUENCE request_numbers;');
  await s.query("BEGIN; SELECT nextval('request_numbers'); ROLLBACK;");
  const n = await s.query("SELECT nextval('request_numbers');");
  check(n.rows[0][0] === 2, 'Sequences · a value taken in a rolled-back transaction is not reused', `next value ${n.rows[0][0]}`);
  await s.query('DROP SEQUENCE request_numbers;');
  s.close();
}

async function countingVariation() {
  // Stated variation: class 22's capacity is 2 (one place left). Mina (R13) and Edda
  // (R14) each lock and count class 22's reservations. The decision counts
  // reservations and locks the rows it counted. A new row is not among them.
  await reset();
  await observer.query('UPDATE classes SET capacity = 2, remaining = 1 WHERE class_id = 22;');
  const mina = await connectAs('count-mina'); const edda = await connectAs('count-edda');
  const lockRows = 'SELECT request_id FROM reservations WHERE class_id = 22 FOR UPDATE;';
  const m = await mina.query(`BEGIN; ${lockRows}`);
  check(same(m.rows, [['R7']]), 'Counting variation · Mina locks and counts 1 reservation (capacity 2)');
  const p = edda.send(`BEGIN; ${lockRows}`);
  check(await waitingOnLock(edda), 'Counting variation · Edda waits on R7’s lock');
  await mina.query(`${sql.book('R13', 22, 1)} COMMIT;`);
  const e = (await p).at(-1);
  check(same(e.rows, [['R7']]), 'Counting variation · after the wait Edda still counts only R7: R13 is not among the rows her statement found', JSON.stringify(e.rows));
  await edda.query(`${sql.book('R14', 22, 3)} COMMIT;`);
  const n = (await observer.query('SELECT count(*) FROM reservations WHERE class_id = 22;')).rows[0][0];
  check(n === claims.countingVariation.bookingsAfter, 'Counting variation · three bookings for capacity 2', `${n}`);
  mina.close(); edda.close();
}

async function conditionalDoesNotWait() {
  // A conditional update does not wait for an uncommitted change it does not match.
  // (The swap's deadlock and its lock-order fix are replayed as a figure.)
  await reset();
  await observer.query(`${sql.take(21)} ${sql.book('R8', 21, 1)}`);
  const mina = await connectAs('cond-mina'); const tariq = await connectAs('cond-tariq');
  await mina.query(`BEGIN; ${sql.free(21)}`);
  const quick = await timeout(tariq.send(`BEGIN; ${sql.take(21)}`), 1000);
  check(!quick.pending && same(quick.value.at(-1).rows, []), 'Conditional update · Tariq’s take of class 21 sees committed remaining 0 and returns no row at once, without waiting for Mina’s uncommitted +1');
  await mina.send('ROLLBACK;'); await tariq.send('ROLLBACK;');
  mina.close(); tariq.close();
}

async function inFlightCommit() {
  // A COMMIT that has reached the server but not finished. A synchronous standby that
  // never connects ('ghost') holds the first attempt's COMMIT in the SyncRep wait,
  // after its commit record is written locally but before other sessions can see it.
  // Meanwhile the service's repeat runs on a new connection.
  const ghost = async on => {
    await observer.query(on ? "ALTER SYSTEM SET synchronous_standby_names = 'ghost';" : 'ALTER SYSTEM RESET synchronous_standby_names;');
    await observer.query('SELECT pg_reload_conf();'); await sleep(300);
  };
  const syncRepWait = async (session, ms = 3000) => {
    const until = Date.now() + ms;
    while (Date.now() < until) {
      const r = await observer.query(`SELECT wait_event FROM pg_stat_activity WHERE pid = ${session.pid};`);
      if (r.rows[0]?.[0] === 'SyncRep') return true;
      await sleep(25);
    }
    return false;
  };
  const cases = [
    { name: 'take first', first: `${sql.take(21)} ${sql.book('R8', 21, 1)}`, repeat: sql.take(21), expect: r => same(r.rows, []), result: 'no row: the repeat reports the class full although R8 committed' },
    { name: 'record R8 first', first: `${sql.book('R8', 21, 1)} ${sql.take(21)}`, repeat: sql.book('R8', 21, 1), expect: r => r.error === '23505', result: '23505: the repeat learns that R8 exists' },
  ];
  for (const c of cases) {
    await reset();
    try { await ghost(true); } catch (error) { log.push(`note In-flight COMMIT check skipped: ALTER SYSTEM was refused (${error.message})`); return; }
    const a = await connectAs(`inflight-a-${c.name}`); const b = await connectAs(`inflight-b-${c.name}`);
    try {
      await a.query(`BEGIN ISOLATION LEVEL READ COMMITTED; ${c.first}`);
      const commit = a.send('COMMIT;').catch(error => [...(error.notices ?? []).map(message => ({ message })), ...(error.results ?? []), { error: 'connection', message: error.message }]);
      check(await syncRepWait(a), `In-flight COMMIT, ${c.name} · the first attempt’s COMMIT is held in the SyncRep wait`);
      const look = await b.query(sql.lookup('R8'));
      check(same(look.rows, []), `In-flight COMMIT, ${c.name} · the repeat’s lookup does not find R8`, JSON.stringify(look.rows));
      const repeat = b.send(`BEGIN ISOLATION LEVEL READ COMMITTED; ${c.repeat}`);
      check(await waitingOnLock(b), `In-flight COMMIT, ${c.name} · the repeat waits for the first attempt`);
      await observer.query(`SELECT pg_terminate_backend(${a.pid});`);
      const first = await commit;
      check(first.some(r => /committed locally/i.test(r.message ?? '')), `In-flight COMMIT, ${c.name} · ending the first attempt’s wait leaves it committed locally`, first.map(r => r.message ?? r.tag).join(' | '));
      const outcome = await timeout(repeat, 3000);
      check(!outcome.pending && c.expect(outcome.value.at(-1)), `In-flight COMMIT, ${c.name} · after the wait the repeat gets ${c.result}`, outcome.pending ? 'still waiting' : JSON.stringify(outcome.value.at(-1)));
      await b.send('ROLLBACK;');
      const db = await committed();
      check(db.reservations.filter(r => r.request_id === 'R8').length === 1 && db.classes[0].remaining === 0, `In-flight COMMIT, ${c.name} · R8 is committed once and class 21 has no place left`);
    } finally {
      await ghost(false);
      a.destroy(); b.close();
    }
  }
}

async function guardRowLevels() {
  // "Rules that span several rows": the guard-row protocol relies on Read Committed's
  // new snapshot for the count after the wait. At Repeatable Read the snapshot comes
  // from the locking statement, before the wait, and a lock on a row nobody changed
  // raises no 40001, so both requests commit. Making the guard a write restores a 40001.
  const guards = [
    { name: 'lock class 21 FOR UPDATE', guard: sql.lockClass(21), expectRavi: 'commits' },
    { name: 'guard as an UPDATE of class 21', guard: 'UPDATE classes SET remaining = remaining WHERE class_id = 21;', expectRavi: '40001' },
  ];
  for (const g of guards) {
    await reset();
    const lena = await connectAs('guard-rr-lena'); const ravi = await connectAs('guard-rr-ravi');
    await lena.query(`BEGIN ISOLATION LEVEL REPEATABLE READ; ${g.guard}`);
    const p = ravi.send(`BEGIN ISOLATION LEVEL REPEATABLE READ; ${g.guard}`);
    const waited = await waitingOnLock(ravi);
    const lenaCount = (await lena.query(sql.countAvailable)).rows[0][0];
    await lena.query(`${sql.leave('Lena')} COMMIT;`);
    const got = (await p).at(-1);
    if (g.expectRavi === 'commits') {
      const raviCount = got.error ? null : (await ravi.query(sql.countAvailable)).rows[0][0];
      const end = raviCount === 2 ? (await ravi.send(`${sql.leave('Ravi')} COMMIT;`)).at(-1) : (await ravi.send('ROLLBACK;')).at(-1);
      const db = await committed();
      const left = db.instructors.filter(i => i.available).length;
      check(waited && lenaCount === 2 && !got.error && raviCount === 2 && end.tag === 'COMMIT' && left === 0,
        `Guard row at Repeatable Read · ${g.name}: Ravi waits, gets the lock with no error, still counts 2, and both commit, leaving class 21 with nobody`,
        `waited ${waited}, Lena counted ${lenaCount}, Ravi lock ${got.error ?? 'ok'}, Ravi counted ${raviCount}, end ${end.tag ?? end.error}, available ${left}`);
    } else {
      await ravi.send('ROLLBACK;');
      const db = await committed();
      const left = db.instructors.filter(i => i.available).length;
      check(waited && got.error === '40001' && left === 1,
        `Guard row at Repeatable Read · ${g.name}: Ravi waits, then fails with 40001; class 21 keeps Ravi`,
        `waited ${waited}, Ravi ${got.error ?? got.tag}, available ${left}`);
    }
    lena.close(); ravi.close();
  }
}

async function phantomAtRepeatableRead() {
  // The Phantom card: at Repeatable Read a rerun sees the same rows, yet another
  // transaction can commit a new row that breaks a rule checked from that view.
  // Stated variation: class 22's capacity is 2. Mina (R13) and Edda (R14) count bookings.
  await reset();
  await observer.query('UPDATE classes SET capacity = 2, remaining = 1 WHERE class_id = 22;');
  const mina = await connectAs('phantom-mina'); const edda = await connectAs('phantom-edda');
  const count = 'SELECT count(*) FROM reservations WHERE class_id = 22;';
  const m = (await mina.query(`BEGIN ISOLATION LEVEL REPEATABLE READ; ${count}`)).rows[0][0];
  const e1 = (await edda.query(`BEGIN ISOLATION LEVEL REPEATABLE READ; ${count}`)).rows[0][0];
  await mina.query(`${sql.book('R13', 22, 1)} COMMIT;`);
  const e2 = (await edda.query(count)).rows[0][0];
  const end = (await edda.send(`${sql.book('R14', 22, 3)} COMMIT;`)).at(-1);
  const n = (await observer.query(count)).rows[0][0];
  check(m === 1 && e1 === 1 && e2 === 1 && end.tag === 'COMMIT' && n === 3,
    'Phantom card · at Repeatable Read Edda’s rerun still counts 1, and her new booking commits beside Mina’s: three bookings for capacity 2, no error',
    `Mina ${m}, Edda ${e1} then ${e2}, end ${end.tag ?? end.error}, bookings ${n}`);
  mina.close(); edda.close();
}

async function abandonedAttempt() {
  // "A lost reply to COMMIT": an open first attempt holds class 21's row, so every other
  // booking waits behind it. Server-side limits end such a transaction; both are off by default.
  const defaults = (await observer.query("SELECT name, boot_val FROM pg_settings WHERE name IN ('idle_in_transaction_session_timeout', 'transaction_timeout') ORDER BY name;")).rows;
  check(same(defaults, [['idle_in_transaction_session_timeout', 0], ['transaction_timeout', 0]]), 'Abandoned attempt · idle_in_transaction_session_timeout and transaction_timeout are off (0) by default', JSON.stringify(defaults));
  for (const setting of ['idle_in_transaction_session_timeout', 'transaction_timeout']) {
    await reset();
    const first = await connectAs(`abandoned-${setting}`); const edda = await connectAs('abandoned-edda');
    await first.query(`SET ${setting} = '600ms';`);
    await first.query(`BEGIN; ${sql.book('R8', 21, 1)} ${sql.take(21)}`); // then the client goes quiet
    const p = edda.send(`BEGIN; ${sql.take(21)}`);
    const waited = await waitingOnLock(edda, 400);
    const outcome = await timeout(p, 3000);
    const got = outcome.pending ? null : outcome.value.at(-1);
    await edda.send('ROLLBACK;');
    await sleep(100);
    check(waited && got && same(got.rows, [[0]]) && first.closed,
      `Abandoned attempt · ${setting}: Edda’s booking waits behind the open attempt until the server ends that session, then takes the place`,
      `waited ${waited}, Edda ${got ? JSON.stringify(got.rows ?? got.error) : 'still waiting'}, first session closed ${first.closed}`);
    edda.close();
  }
}

async function versionCheck() {
  // A decision made from an earlier read: change only if the value is still the one read.
  await reset();
  const mina = await connectAs('ver-mina'); const tariq = await connectAs('ver-tariq');
  const read = (await mina.query(sql.readRemaining(21))).rows[0][0];
  const readT = (await tariq.query(sql.readRemaining(21))).rows[0][0];
  const guarded = `UPDATE classes SET remaining = 0 WHERE class_id = 21 AND remaining = 1;`;
  await mina.query(`BEGIN; ${guarded}`);
  const p = tariq.send(`BEGIN; ${guarded}`);
  check(read === 1 && readT === 1 && await waitingOnLock(tariq), 'Version check · both read 1; Tariq’s guarded update waits for Mina');
  await mina.query(`${sql.book('R8', 21, 1)} COMMIT;`);
  const t = (await p).at(-1);
  check(t.count === 0, 'Version check · after Mina commits, Tariq’s “remaining is still 1” update changes no rows', t.tag);
  await tariq.send('ROLLBACK;');
  mina.close(); tariq.close();
}

async function fracturedReport() {
  // A report reads remaining and the bookings in two statements while R8 commits between them.
  for (const level of ['READ COMMITTED', 'REPEATABLE READ']) {
    await reset();
    const report = await connectAs('report'); const mina = await connectAs('report-mina');
    await report.query(`BEGIN ISOLATION LEVEL ${level};`);
    const left = (await report.query(sql.readRemaining(21))).rows[0][0];
    await mina.query(`BEGIN; ${sql.take(21)} ${sql.book('R8', 21, 1)} COMMIT;`);
    const booked = (await report.query('SELECT count(*) FROM reservations WHERE class_id = 21;')).rows[0][0];
    await report.query('COMMIT;');
    const expected = level === 'READ COMMITTED' ? [1, 1] : [1, 0];
    check(same([left, booked], expected), `Report · ${level}: remaining then bookings for class 21 read ${left} and ${booked}`, level === 'READ COMMITTED' ? 'two snapshots: the totals disagree with capacity 1' : 'one snapshot: the totals agree');
    report.close(); mina.close();
  }
}

async function load() {
  // Bounded load: 20 load clients (customers 101-120, used only here) race for class 21's
  // single place, 20 rounds each for the unsafe and the conditional protocol.
  const clients = [];
  for (let i = 0; i < 20; i++) clients.push(await connectAs(`load-${i}`));
  const results = {};
  for (const protocol of ['read-write', 'condition']) {
    let overbooked = 0, finished = 0, accepted = 0;
    for (let round = 0; round < 20; round++) {
      await reset();
      await observer.query(`INSERT INTO customers SELECT g, 'Load client ' || g FROM generate_series(101, 120) g;`);
      const attempts = clients.map(async (c, i) => {
        const owner = 101 + i; const id = `L${round}-${i}`;
        if (protocol === 'read-write') {
          const r = await c.query(`${'BEGIN;'} ${sql.readRemaining(21)}`);
          const left = r.rows[0][0];
          if (left < 1) { await c.query('ROLLBACK;'); return 'declined'; }
          await c.query(`${sql.writeRemaining(21, left - 1)} ${sql.book(id, 21, owner)} COMMIT;`);
          return 'booked';
        }
        const r = await c.query(`BEGIN; ${sql.take(21)}`);
        if (r.rows.length === 0) { await c.query('ROLLBACK;'); return 'declined'; }
        await c.query(`${sql.book(id, 21, owner)} COMMIT;`);
        return 'booked';
      });
      const outcomes = await Promise.all(attempts);
      finished += outcomes.length; accepted += outcomes.filter(o => o === 'booked').length;
      const n = (await observer.query('SELECT count(*) FROM reservations WHERE class_id = 21;')).rows[0][0];
      if (n > 1) overbooked += 1;
    }
    results[protocol] = { rounds: 20, clients: 20, finished, accepted, overbooked };
  }
  check(results.condition.overbooked === 0 && results.condition.accepted === 20 && results.condition.finished === 400, 'Load · conditional protocol: every round finished with exactly one booking', JSON.stringify(results.condition));
  check(results['read-write'].overbooked > 0, 'Load · read-then-write protocol overbooked in some rounds', JSON.stringify(results['read-write']));
  // Two clients, no deliberate barrier: the unsafe protocol often looks correct.
  let twoClientOverbooked = 0;
  for (let round = 0; round < 100; round++) {
    await reset();
    const outcomes = await Promise.all([[clients[0], 1, 'R8'], [clients[1], 2, 'R9']].map(async ([c, owner, id]) => {
      const left = (await c.query(`BEGIN; ${sql.readRemaining(21)}`)).rows[0][0];
      if (left < 1) { await c.query('ROLLBACK;'); return; }
      await c.query(`${sql.writeRemaining(21, left - 1)} ${sql.book(id, 21, owner)} COMMIT;`);
    }));
    void outcomes;
    const n = (await observer.query('SELECT count(*) FROM reservations WHERE class_id = 21;')).rows[0][0];
    if (n > 1) twoClientOverbooked += 1;
  }
  results.twoClientsNoBarrier = { rounds: 100, overbooked: twoClientOverbooked };
  log.push(`info Load results: ${JSON.stringify(results)}`);
  for (const c of clients) c.close();
  return results;
}

// ---- Run -------------------------------------------------------------------
const watchdog = setTimeout(() => { console.log(log.join('\n')); console.log('\nStopped: the script took longer than five minutes.'); process.exit(3); }, 300000);
admin = new Session('a03-admin', 'postgres');
await admin.connect();
const exists = await admin.query(`SELECT 1 FROM pg_database WHERE datname = '${DB}';`);
if (exists.rows.length) { console.error(`Database ${DB} already exists; refusing to use it.`); process.exit(2); }
await admin.query(`CREATE DATABASE ${DB};`);
try {
  observer = await connectAs('a03-observer');
  const version = (await observer.query('SELECT version();')).rows[0][0];
  const settings = (await observer.query("SELECT name, setting FROM pg_settings WHERE name IN ('default_transaction_isolation','deadlock_timeout','synchronous_commit','fsync','lock_timeout','statement_timeout') ORDER BY name;")).rows;
  log.push(`info ${version}`);
  log.push(`info settings ${settings.map(([n, v]) => `${n}=${v}`).join(', ')}`);
  check(same(rules(start).classes.map(r => r.ok), [true, true]) && rules(start).instructors.ok, 'Starting rows satisfy every rule');
  for (const [id, figure] of Object.entries(figures)) {
    for (const option of figure.options) {
      const broken = await replay(id, option);
      check(same(broken, expectedBroken[`${id}/${option.id}`]), `Figure ${id} · ${option.label}: final rule check`, `broken: ${broken.join(', ') || 'none'}`);
    }
  }
  await visibilityTable();
  await rollbackPrediction();
  await concurrentClicks();
  await failedStatementInsideTransaction();
  await savepointHazard();
  await ddlAndSequences();
  await countingVariation();
  await conditionalDoesNotWait();
  await guardRowLevels();
  await phantomAtRepeatableRead();
  await abandonedAttempt();
  await inFlightCommit();
  await versionCheck();
  await fracturedReport();
  await load();
} finally {
  observer?.close();
  await sleep(200);
  await admin.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB}' AND pid <> pg_backend_pid();`);
  await admin.query(`DROP DATABASE IF EXISTS ${DB};`);
  admin.close();
}
console.log(log.join('\n'));
console.log(`\n${failures === 0 ? 'All checks passed' : `${failures} check(s) failed`}.`);
clearTimeout(watchdog);
process.exit(failures === 0 ? 0 : 1);
