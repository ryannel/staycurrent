// Replays every schedule and table in model.mjs against a disposable PostgreSQL
// server, with real concurrent sessions, and asserts each output and committed
// state. It creates its own database, refuses an existing one and drops it at
// the end. It changes no server setting.
//
//   PG_BIN=/opt/homebrew/bin/ PGHOST=127.0.0.1 PGPORT=57502 PGUSER=staycurrent \
//   A03_DB=trial_a03_check node verify.mjs > result.json
//
// A blocked statement is confirmed by the server (pg_stat_activity shows
// wait_event_type = 'Lock' for that session), never by a sleep.
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import * as m from './model.mjs';

const BIN = process.env.PG_BIN ?? '/opt/homebrew/bin/';
const HOST = process.env.PGHOST ?? '127.0.0.1';
const PORT = process.env.PGPORT ?? '57502';
const USER = process.env.PGUSER ?? 'staycurrent';
const DB = process.env.A03_DB ?? 'trial_a03_check';
assert.match(DB, /^[a-z][a-z0-9_]*$/, 'A03_DB must be a plain lower-case name');
for (const value of [BIN, HOST, PORT, USER]) assert.match(value, /^[A-Za-z0-9_./:-]*$/);
const conn = ['-h', HOST, '-p', PORT, '-U', USER];
const psql = (db, sql) => execFileSync(`${BIN}psql`, ['-X', '-qAt', ...conn, '-d', db, '-v', 'ON_ERROR_STOP=1', '-c', sql], { encoding: 'utf8' }).trim();
const observe = sql => psql(DB, sql);
const evidence = { schedules: {}, versions: {}, endings: {}, levels: {}, deadlock: {}, retry: {}, outcome: {} };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class Session {
  constructor(name) {
    this.name = name; this.n = 0; this.lines = []; this.pending = new Map();
    // stderr is merged into stdout so errors stay in statement order.
    const command = [`${BIN}psql`, '-X', '-At', '-v', 'VERBOSITY=sqlstate', ...conn, '-d', DB].join(' ');
    this.p = spawn('/bin/sh', ['-c', `exec ${command} 2>&1`], { stdio: ['pipe', 'pipe', 'ignore'] });
    this.p.stdout.setEncoding('utf8');
    let partial = '';
    this.p.stdout.on('data', chunk => {
      partial += chunk;
      const parts = partial.split('\n'); partial = parts.pop();
      for (const line of parts) {
        const marker = /^__END_(\d+)__$/.exec(line);
        if (marker) { this.pending.get(Number(marker[1]))(this.lines); this.pending.delete(Number(marker[1])); this.lines = []; }
        else this.lines.push(line);
      }
    });
    this.ready = this.send(`SET application_name = 'a03_${name}';`);
  }
  send(sql) {
    const n = ++this.n;
    const result = new Promise(resolve => this.pending.set(n, resolve));
    this.p.stdin.write(`${sql}\n\\echo __END_${n}__\n`);
    return result;
  }
  close() { try { this.p.stdin.end('ROLLBACK;\n\\q\n'); } catch { /* already gone */ } }
  kill() { this.p.kill('SIGKILL'); }
}
async function waitingOnLock(name) {
  for (let i = 0; i < 100; i++) {
    if (observe(`SELECT count(*) FROM pg_stat_activity WHERE application_name = 'a03_${name}' AND wait_event_type = 'Lock'`) === '1') return true;
    await sleep(50);
  }
  throw new Error(`session ${name} was expected to wait on a lock`);
}
async function sessions() { const A = new Session('A'), B = new Session('B'); await A.ready; await B.ready; return { A, B }; }

function reset({ withoutUnique = false } = {}) {
  observe(`SET client_min_messages = warning; DROP TABLE IF EXISTS instructors, reservations, classes, customers CASCADE; DROP FUNCTION IF EXISTS slow_commit(); ${m.fixture}`);
  if (withoutUnique) observe('ALTER TABLE reservations DROP CONSTRAINT reservations_class_id_owner_id_key;');
}
const list = sql => { const out = observe(sql); return out ? out.split('\n') : []; };
function committed(scenario) {
  if (scenario === 'staff') return { available: list("SELECT person FROM instructors WHERE class_id = 21 AND available ORDER BY person") };
  const id = scenario === 'place' ? 21 : 22;
  return { remaining: Number(observe(`SELECT remaining FROM classes WHERE class_id = ${id}`)), bookings: list(`SELECT request_id FROM reservations WHERE class_id = ${id} ORDER BY length(request_id), request_id`) };
}
const json = sql => JSON.parse(observe(`SELECT coalesce(json_agg(r), '[]') FROM (${sql}) r`));

// Run one schedule, step by step, as the figures show it.
async function runSteps(scenario, steps, { withoutUnique = false, label }) {
  reset({ withoutUnique });
  const s = await sessions();
  const pending = {};
  const record = [];
  for (const [i, step] of steps.entries()) {
    let out = null;
    if (step.collect) { out = await pending[step.who]; delete pending[step.who]; }
    else if (step.waits) { pending[step.who] = s[step.who].send(step.sql); await waitingOnLock(step.who); }
    else out = await s[step.who].send(step.sql);
    if (step.out) assert.deepEqual(out, step.out, `${label} step ${i + 1} output`);
    if (step.state) assert.deepEqual(committed(scenario), step.state, `${label} step ${i + 1} committed state`);
    record.push({ step: i + 1, session: step.who, sql: step.sql, output: step.waits ? 'waiting on Lock (pg_stat_activity)' : out });
  }
  s.A.close(); s.B.close(); await sleep(100);
  return record;
}

const version = psql('postgres', 'SELECT version()');
const settings = Object.fromEntries(['default_transaction_isolation', 'synchronous_commit', 'fsync', 'deadlock_timeout'].map(name => [name, psql('postgres', `SHOW ${name}`)]));
assert.equal(psql('postgres', `SELECT count(*) FROM pg_database WHERE datname = '${DB}'`), '0', `database ${DB} already exists; choose an unused name`);
execFileSync(`${BIN}createdb`, [...conn, DB]);
try {
  // Figure 1: the fixture holds exactly the model's rows.
  process.stderr.write(`[check] Figure 1: the fixture holds exactly the model's rows.\n`);
  reset();
  assert.deepEqual(json('SELECT * FROM customers ORDER BY customer_id'), m.customers);
  assert.deepEqual(json('SELECT * FROM classes ORDER BY class_id'), m.classes);
  assert.deepEqual(json('SELECT * FROM reservations ORDER BY request_id'), m.reservations);
  assert.deepEqual(json('SELECT * FROM instructors ORDER BY person'), m.instructors);
  assert.deepEqual(json(m.invariantCheck.replace(/;\s*$/, '')), [
    { class_id: 21, capacity: 1, remaining: 1, booked: 0, rule_holds: true },
    { class_id: 22, capacity: 3, remaining: 2, booked: 1, rule_holds: true },
  ]);

  // Figures 2 and 3: every schedule and option.
  process.stderr.write(`[check] Figures 2 and 3: every schedule and option.\n`);
  for (const [scenario, def] of Object.entries(m.scenarios)) {
    for (const [option, opt] of Object.entries(def.options)) {
      const label = `${scenario}/${option}`;
      evidence.schedules[label] = await runSteps(scenario, opt.steps, { withoutUnique: opt.withoutUnique, label });
      const final = opt.steps.at(-1).state;
      evidence.schedules[label].push({ final, verdict: m.verdict(scenario, final) });
    }
  }

  // Figure 4: B's statement while A's change to class 21 is uncommitted.
  process.stderr.write(`[check] Figure 4: B's statement while A's change to class 21 is uncommitted.\n`);
  for (const [choice] of m.versionOptions) {
    reset();
    const { A, B } = await sessions();
    assert.deepEqual(await A.send('BEGIN; UPDATE classes SET remaining = 0 WHERE class_id = 21;'), ['BEGIN', 'UPDATE 1']);
    let early = null, pending = null;
    if (choice === 'select') early = await B.send(`BEGIN; ${m.versionSql.select}`);
    else { pending = B.send(`BEGIN; ${m.versionSql[choice]}`); await waitingOnLock('B'); }
    assert.deepEqual(await A.send("INSERT INTO reservations VALUES ('R8', 21, 1); COMMIT;"), ['INSERT 0 1', 'COMMIT']);
    const late = pending ? await pending : await B.send(m.versionSql.select);
    const expected = { select: [['BEGIN', '1'], ['0']], forupdate: [null, ['BEGIN', '0']], conditional: [null, ['BEGIN', 'UPDATE 0']] }[choice];
    assert.deepEqual([early, late], expected, `versions/${choice}`);
    evidence.versions[choice] = { while_A_open: early ?? 'waiting on Lock (pg_stat_activity)', after_A_commits: late };
    A.close(); B.close(); await sleep(100);
  }

  // The two-statement listing and the three endings of Arun's duplicate attempt.
  process.stderr.write(`[check] The two-statement listing and the three endings of Arun's duplicate attempt.\n`);
  {
    reset();
    const { A } = await sessions();
    const out = await A.send(m.twoStep);
    assert.deepEqual(out, ['BEGIN', '1', 'UPDATE 1', 'ERROR:  23505', 'ERROR:  25P02', 'ROLLBACK']);
    assert.deepEqual(committed('duplicate'), { remaining: 2, bookings: ['R7'] });
    evidence.endings.listing = out;
    A.close();
  }
  const take = 'UPDATE classes SET remaining = remaining - 1 WHERE class_id = 22 AND remaining > 0 RETURNING remaining;';
  const dup = "INSERT INTO reservations VALUES ('R12', 22, 2);";
  const endingSql = {
    rollback: `BEGIN; ${take} ${dup} COMMIT;`,
    'savepoint-late': `BEGIN; ${take} SAVEPOINT before_insert; ${dup} ROLLBACK TO SAVEPOINT before_insert; COMMIT;`,
    'savepoint-early': `BEGIN; SAVEPOINT attempt; ${take} ${dup} ROLLBACK TO SAVEPOINT attempt; COMMIT;`,
  };
  for (const ending of m.endings) {
    reset();
    const { A } = await sessions();
    const out = await A.send(endingSql[ending.id]);
    const state = committed('duplicate');
    assert.deepEqual(state, { remaining: ending.remaining, bookings: ending.bookings }, `ending ${ending.id}`);
    assert.equal(state.remaining + state.bookings.length === 3, ending.holds);
    evidence.endings[ending.id] = { sql: endingSql[ending.id], output: out, state };
    A.close(); await sleep(50);
  }

  // The isolation-level table: Figure 2's unprotected interleavings at each level.
  process.stderr.write(`[check] The isolation-level table: Figure 2's unprotected interleavings at each level.\n`);
  const at = (steps, level) => steps.map(step => ({ ...step, sql: step.sql && step.sql.replace(/^BEGIN;/, `BEGIN ISOLATION LEVEL ${level};`) }));
  const levelRuns = {
    'REPEATABLE READ': { place: ['ERROR:  40001'], staffCommit: ['COMMIT'], staffAvailable: [] },
    SERIALIZABLE: { place: ['ERROR:  40001'], staffCommit: ['ERROR:  40001'], staffAvailable: ['Tariq'] },
  };
  for (const [level, expect] of Object.entries(levelRuns)) {
    const place = at(m.scenarios.place.options.interleaved.steps, level).slice(0, 4);
    reset();
    let s = await sessions();
    for (const step of place) await s[step.who].send(step.sql);
    const placeWrite = await s.B.send(m.scenarios.place.options.interleaved.steps[4].sql);
    assert.deepEqual(placeWrite.slice(0, 1), expect.place, `${level} place write`);
    await s.B.send('ROLLBACK;');
    assert.deepEqual(committed('place'), { remaining: 0, bookings: ['R8'] });
    s.A.close(); s.B.close(); await sleep(100);
    reset();
    s = await sessions();
    const staff = at(m.scenarios.staff.options.interleaved.steps, level);
    for (const step of staff.slice(0, 5)) await s[step.who].send(step.sql);
    const staffCommit = await s.B.send('COMMIT;');
    assert.deepEqual(staffCommit, expect.staffCommit, `${level} staff commit`);
    assert.deepEqual(committed('staff'), { available: expect.staffAvailable });
    evidence.levels[level] = { place_arun_write: placeWrite, staff_tariq_commit: staffCommit, staff_available: expect.staffAvailable };
    s.A.close(); s.B.close(); await sleep(100);
  }
  evidence.levels['READ COMMITTED'] = { place: 'see schedules place/interleaved', staff: 'see schedules staff/interleaved' };
  assert.deepEqual(m.levels.map(row => [row.place.holds, row.staff.holds]), [[false, false], [true, false], [true, true]]);

  // Retrying one statement after a serialisation failure keeps the stale decision.
  process.stderr.write(`[check] Retrying one statement after a serialisation failure keeps the stale decision.\n`);
  {
    reset();
    const { A, B } = await sessions();
    const serial = 'BEGIN ISOLATION LEVEL SERIALIZABLE; SELECT count(*) FROM instructors WHERE class_id = 21 AND available;';
    await A.send(serial); await B.send(serial);
    await A.send(m.leave('Lena')); await B.send(m.leave('Tariq'));
    await A.send('COMMIT;');
    assert.deepEqual(await B.send('COMMIT;'), ['ERROR:  40001']);
    const naive = await B.send(`BEGIN ISOLATION LEVEL SERIALIZABLE; ${m.leave('Tariq')} COMMIT;`);
    assert.deepEqual(naive, ['BEGIN', 'UPDATE 1', 'COMMIT']);
    assert.deepEqual(committed('staff'), { available: [] });
    evidence.retry = { only_the_failed_update: naive, available_afterwards: [] };
    A.close(); B.close(); await sleep(100);
  }

  // Deadlock: Mina moves R8 from 21 to 22 while Arun moves R7 from 22 to 21.
  process.stderr.write(`[check] Deadlock: Mina moves R8 from 21 to 22 while Arun moves R7 from 22 to 21.\n`);
  for (const order of ['opposite', 'ascending']) {
    reset();
    observe(`${m.book('R8', 21, 1)}`);
    const { A, B } = await sessions();
    const sess = { A, B };
    const mv = { A: m.moveSql.mina, B: m.moveSql.arun };
    const holds = () => json(m.invariantCheck.replace(/;\s*$/, '')).every(row => row.rule_holds);
    const finish = async who => {
      const out = await sess[who].send(mv[who].change.replace(/\n/g, ' '));
      if (out[1] === 'UPDATE 0') return [...out, ...await sess[who].send('ROLLBACK;')];
      return [...out, ...await sess[who].send('COMMIT;')];
    };
    if (order === 'opposite') {
      assert.deepEqual(await A.send(`BEGIN; ${mv.A.lock(21)}`), ['BEGIN', '21']);
      assert.deepEqual(await B.send(`BEGIN; ${mv.B.lock(22)}`), ['BEGIN', '22']);
      const pa = A.send(mv.A.lock(22)); await waitingOnLock('A');
      const pb = B.send(mv.B.lock(21));
      const settled = { A: null, B: null };
      pa.then(out => { settled.A = out; }); pb.then(out => { settled.B = out; });
      for (let i = 0; !settled.A?.[0]?.includes('40P01') && !settled.B?.[0]?.includes('40P01'); i++) {
        if (i > 500) throw new Error(`no deadlock victim reported: ${JSON.stringify(settled)}`);
        await sleep(20);
      }
      const victim = settled.A?.[0]?.includes('40P01') ? 'A' : 'B', survivor = victim === 'A' ? 'B' : 'A';
      assert.deepEqual(await sess[victim].send('SELECT 1;'), ['ERROR:  25P02']);
      assert.deepEqual(await sess[victim].send('ROLLBACK;'), ['ROLLBACK']);
      const survivorLock = await (survivor === 'A' ? pa : pb);
      const survivorResult = [...survivorLock, ...await finish(survivor)];
      const v = mv[victim];
      const retry = await sess[victim].send(`BEGIN; ${v.lock(v.from)} ${v.lock(v.to)} ${v.change.replace(/\n/g, ' ')} COMMIT;`);
      assert.deepEqual(retry, ['BEGIN', String(v.from), String(v.to), 'UPDATE 1', 'UPDATE 1', 'UPDATE 1', 'COMMIT']);
      evidence.deadlock.opposite = { victim: victim === 'A' ? 'Mina (A)' : 'Arun (B)', victim_error: '40P01', next_statement: '25P02', survivor: survivorResult, victim_whole_retry: retry, final: json('SELECT request_id, class_id FROM reservations ORDER BY request_id') };
    } else {
      assert.deepEqual(await A.send(`BEGIN; ${mv.A.lock(21)}`), ['BEGIN', '21']);
      const pb = B.send(`BEGIN; ${mv.B.lock(21)}`); await waitingOnLock('B');
      assert.deepEqual(await A.send(mv.A.lock(22)), ['22']);
      assert.deepEqual(await finish('A'), ['UPDATE 1', 'UPDATE 1', 'UPDATE 1', 'COMMIT']);
      assert.deepEqual(await pb, ['BEGIN', '21']);
      assert.deepEqual(await B.send(mv.B.lock(22)), ['22']);
      assert.deepEqual(await finish('B'), ['UPDATE 1', 'UPDATE 1', 'UPDATE 1', 'COMMIT']);
      evidence.deadlock.ascending = { arun_waited_for_21: true, both_committed: true };
      assert.deepEqual(json('SELECT request_id, class_id FROM reservations ORDER BY request_id'), [{ request_id: 'R7', class_id: 21 }, { request_id: 'R8', class_id: 22 }]);
    }
    assert.ok(holds(), `capacity rule after ${order} moves`);
    A.close(); B.close(); await sleep(100);
  }

  // The move listing as printed runs on its own.
  process.stderr.write(`[check] The move listing as printed runs on its own.\n`);
  reset(); observe(m.book('R8', 21, 1));
  { const { A } = await sessions(); assert.deepEqual(await A.send(m.moveListing), ['BEGIN', '21', '22', 'UPDATE 1', 'UPDATE 1', 'UPDATE 1', 'COMMIT']); A.close(); await sleep(50); }

  // A lost reply: cut the client off before COMMIT, and while COMMIT is in progress.
  process.stderr.write(`[check] A lost reply: cut the client off before COMMIT, and while COMMIT is in progress.\n`);
  // A deferred trigger holds COMMIT open for 1.5 s so the cut lands inside it.
  process.stderr.write(`[check] A deferred trigger holds COMMIT open for 1.5 s so the cut lands inside it.\n`);
  const slow = `CREATE FUNCTION slow_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_sleep(1.5); RETURN NULL; END $$;
CREATE CONSTRAINT TRIGGER slow_commit AFTER INSERT ON reservations DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION slow_commit();`;
  for (const cut of ['before-commit', 'during-commit']) {
    reset(); observe(slow);
    const client = new Session('C'); await client.ready;
    assert.deepEqual(await client.send(`BEGIN; ${m.book('R8', 21, 1)}`), ['BEGIN', 'R8', 'INSERT 0 1']);
    if (cut === 'during-commit') { client.p.stdin.write('COMMIT;\n'); await sleep(300); }
    client.kill();
    await sleep(2500);
    const state = committed('place');
    evidence.outcome[cut] = { client_saw: 'connection lost, no reply', committed: state };
    if (cut === 'before-commit') assert.deepEqual(state, { remaining: 1, bookings: [] });
    else {
      assert.deepEqual(state, { remaining: 0, bookings: ['R8'] });
      // A blind retry of the same booking now answers "full", though R8 is Mina's.
      const retry = observe(m.book('R8', 21, 1));
      assert.equal(retry, '');
      evidence.outcome['during-commit'].blind_retry = 'no row returned: the class looks full';
      assert.equal(observe("SELECT owner_id FROM reservations WHERE request_id = 'R8'"), '1');
      evidence.outcome['during-commit'].lookup_by_request_id = 'R8 exists, owner 1';
    }
  }
} finally {
  await sleep(200);
  psql('postgres', `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB}' AND pid <> pg_backend_pid()`);
  execFileSync(`${BIN}dropdb`, [...conn, DB]);
}
console.log(JSON.stringify({ version, settings, database: DB, evidence, checks: 'fixture rows, invariant query, every Figure 2 and 3 schedule, Figure 4 options, listing and endings, isolation-level table, single-statement retry, deadlock and ordered moves, lost-reply cases: passed' }, null, 2));
process.exit(0); // psql children that were killed mid-statement can keep the event loop open
