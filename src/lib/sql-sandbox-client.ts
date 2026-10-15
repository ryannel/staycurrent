import { sandboxTutorials, type Tutorial } from './sql-sandbox-tutorials';

const root = document.querySelector<HTMLElement>('[data-sandbox]')!;
const element = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-${name}]`)!;
const picker = element<HTMLSelectElement>('tutorial');
const start = element<HTMLButtonElement>('start');
const editor = element<HTMLTextAreaElement>('editor');
const run = element<HTMLButtonElement>('run');
const reset = element<HTMLButtonElement>('reset');
const stop = element<HTMLButtonElement>('stop');
const status = element('status');
const workspace = element('workspace');
const guide = element('guide');
const results = element('results');
const previous = element<HTMLButtonElement>('previous');
const next = element<HTMLButtonElement>('next');
const transaction = element('transaction');
let worker: Worker | undefined;
let tutorial: Tutorial | undefined;
let step = 0;
let ready = false;
let busy = false;
let changed = false;
let runNumber = 0;
let loadedSQL = editor.value;
let sentSQL = '';
let ranStep = false;
let timer: ReturnType<typeof setTimeout>;

const node = (tag: string, text: string, className?: string) => {
  const result = document.createElement(tag);
  result.textContent = text;
  if (className) result.className = className;
  return result;
};
function controls() {
  run.disabled = !ready || busy;
  reset.disabled = !worker;
  start.disabled = busy;
  previous.disabled = busy || !tutorial || step === 0;
  next.disabled = busy || !tutorial || step === tutorial.steps.length - 1;
  stop.hidden = !busy;
  stop.textContent = ready ? 'Stop and discard session' : 'Cancel loading';
  const proceed = element<HTMLButtonElement>('continue');
  proceed.hidden = !tutorial || step === tutorial.steps.length - 1 || !ranStep;
  proceed.disabled = busy;
  root.querySelectorAll<HTMLButtonElement>('[data-sample],[data-schema]').forEach(button => button.disabled = busy);
}
function showTransaction(value: string) {
  transaction.dataset.state = value;
  transaction.textContent = ({ I: 'No transaction open', T: 'Transaction open · changes uncommitted', E: 'Transaction failed · roll back to continue' } as Record<string, string>)[value] || 'No active database';
}
function loadSQL(sql: string, checkEdits = true) {
  if (checkEdits && editor.value !== loadedSQL && !confirm('Replace your edited SQL with this example? Your database will not change.')) return false;
  editor.value = loadedSQL = sql;
  return true;
}
function showStep(checkEdits = false, proposedStep = step) {
  if (!tutorial) { guide.hidden = true; return; }
  const item = tutorial.steps[proposedStep];
  if (!loadSQL(item.sql, checkEdits)) return;
  step = proposedStep;
  ranStep = false;
  guide.hidden = false;
  element('step-count').textContent = `Step ${step + 1} of ${tutorial.steps.length}`;
  element('guide-title').textContent = tutorial.title;
  element('step-title').textContent = item.title;
  element('instruction').textContent = item.instruction;
  element('expected').textContent = item.expected;
  element<HTMLDetailsElement>('expected-panel').open = false;
  const link = element<HTMLAnchorElement>('guide-link');
  link.href = `?tutorial=${encodeURIComponent(tutorial.id)}`;
  element<HTMLAnchorElement>('article').href = tutorial.articleHref;
  controls();
  if (checkEdits) {
    guide.scrollIntoView({ block: 'start' });
    element('step-title').setAttribute('tabindex', '-1');
    element('step-title').focus({ preventScroll: true });
  }
}
function preview() {
  const selected = sandboxTutorials.find(item => item.id === picker.value);
  start.textContent = selected ? 'Start tutorial · fresh database' : 'Start exploring · fresh database';
  element('preview').textContent = selected?.description || 'Start with customers, products, orders, order lines and stock. Change the data, try your own queries and reset whenever you want.';
}
function discard(message: string) {
  if (busy && ready && sentSQL) {
    const pending = node('section', '', 'sandbox-run');
    pending.append(node('h3', `Run ${runNumber} stopped`), node('p', 'The disposable session was discarded. This is the SQL that was sent; no successful response was received.'), node('pre', sentSQL));
    results.prepend(pending);
    while (results.children.length > 5) results.lastElementChild?.remove();
    element('empty').hidden = true;
  }
  clearTimeout(timer);
  worker?.terminate(); worker = undefined;
  ready = busy = false;
  status.textContent = message;
  showTransaction('');
  controls();
  // Starting again is always available, including after load or worker failure.
  start.disabled = false;
}
function begin(selected: Tutorial | undefined, ask = true) {
  if (ask && (changed || editor.value !== loadedSQL) && !confirm('Restore the original shop? This discards your database changes, edited SQL and response history.')) return;
  worker?.terminate(); clearTimeout(timer);
  ready = false; busy = true; changed = false; runNumber = 0;
  tutorial = selected; step = 0; ranStep = false;
  picker.value = selected?.id || ''; preview();
  results.replaceChildren(); element('empty').hidden = false;
  element('empty').textContent = 'No SQL sent yet. Edit a query above and choose Run SQL.';
  workspace.hidden = false;
  if (selected) showStep(); else { guide.hidden = true; loadSQL('SELECT * FROM products;', false); }
  const url = new URL(location.href);
  if (selected) url.searchParams.set('tutorial', selected.id); else url.searchParams.delete('tutorial');
  history.replaceState(null, '', url);
  showTransaction('');
  status.textContent = 'Loading PostgreSQL and preparing the shop… The first load downloads the database engine.';
  controls();
  try {
    const current = new Worker(new URL('./sql-sandbox-worker.ts', import.meta.url), { type: 'module' });
    worker = current;
    controls();
    timer = setTimeout(() => { if (worker === current) discard('The database took too long to load. Start again to retry.'); }, 60000);
    current.onerror = () => { if (worker === current) discard('The database could not start or stopped unexpectedly. Start again to retry.'); };
    current.onmessage = ({ data }) => {
      if (worker !== current) return;
      clearTimeout(timer);
      if (data.type === 'fatal') { discard(`${data.message} Start again to restore the shop.`); return; }
      if (data.type === 'ready') {
        ready = true; busy = false; showTransaction('I');
        status.textContent = selected ? 'Shop ready. Read the first step, then choose Run SQL.' : 'Shop ready. Edit the query or choose a sample, then Run SQL.';
      } else if (data.type === 'result') {
        busy = false; ranStep = true; showTransaction(data.status);
        renderResults(data);
      }
      controls();
    };
    current.postMessage({ type: 'init' });
  } catch { discard('This browser could not start the database worker. You can use the local practice guide below.'); }
}
function renderResults(data: any) {
  const section = node('section', '', 'sandbox-run');
  section.append(node('h3', `Run ${data.id}`));
  const sent = document.createElement('details');
  sent.append(node('summary', 'SQL you sent'), node('pre', sentSQL));
  section.append(sent);
  let errors = 0;
  let statement = 0;
  for (const output of data.outputs) {
    statement++;
    if (output.kind === 'error' || output.kind === 'notice') {
      if (output.kind === 'error') errors++;
      const box = node('div', '', output.kind === 'error' ? 'sandbox-error' : 'sandbox-notice');
      box.append(node('p', `${output.kind === 'error' ? 'Error' : 'Notice'}${output.code ? ` · SQLSTATE ${output.code}` : ''}`), node('pre', output.text));
      section.append(box);
    } else {
      section.append(node('p', output.tag || 'Command completed', 'sandbox-tag'));
      if (output.fields) {
        const wrapper = node('div', '', 'sandbox-output-table');
        wrapper.tabIndex = 0; wrapper.setAttribute('role', 'region'); wrapper.setAttribute('aria-label', `Response ${statement} in run ${data.id}`);
        const table = document.createElement('table');
        const heading = document.createElement('tr');
        for (const name of output.fields) { const th = node('th', name); th.setAttribute('scope', 'col'); heading.append(th); }
        const thead = document.createElement('thead'); thead.append(heading); table.append(thead);
        const body = document.createElement('tbody');
        for (const row of output.rows) {
          const tr = document.createElement('tr');
          for (const value of row) {
            const cell = node('td', value === null ? 'NULL' : value, value === null ? 'sandbox-null' : '');
            if (value === null) cell.setAttribute('aria-label', 'SQL NULL: no value');
            tr.append(cell);
          }
          body.append(tr);
        }
        table.append(body); wrapper.append(table); section.append(wrapper);
        if (output.rows.length === 0 && !output.truncated) section.append(node('p', 'No rows returned.'));
        if (output.cellsTruncated) section.append(node('p', 'Cells exceeding the display budget are marked and shortened (at most 2,000 characters per cell).'));
        if (output.truncated) section.append(node('p', 'Result display shortened (up to 200 rows and 40 columns per statement; 5,000 cells and 250,000 cell characters per run). Select fewer columns, add a WHERE clause or use LIMIT.'));
      }
    }
  }
  if (!data.outputs.length) section.append(node('p', 'No command result. Check that the editor contains SQL, not only comments.'));
  if (data.omitted) section.append(node('p', 'Some responses were omitted. Run fewer statements at once to inspect them.'));
  results.prepend(section);
  while (results.children.length > 5) results.lastElementChild?.remove();
  element('empty').hidden = true;
  const expectedError = tutorial?.steps[step].expectedError;
  const expectedRejection = expectedError && data.outputs.some((output: any) => output.kind === 'error' && output.code === expectedError) && sentSQL.trim() === tutorial?.steps[step].sql.trim();
  status.textContent = expectedRejection ? `Run ${data.id} produced the rejection this lesson asks you to inspect. Read the response and “What to look for” before continuing.` : errors ? `Run ${data.id} returned a database error. Read the response below. ${data.status === 'E' ? 'The transaction is failed; send ROLLBACK to continue.' : ''}` : `Run ${data.id} completed. Responses are shown below; the tutorial does not grade your edited SQL.`;
}
function execute() {
  if (!ready || busy || !worker) return;
  const sql = editor.value.trim();
  if (!sql) { status.textContent = 'Enter a SQL command first.'; editor.focus(); return; }
  if (sql.length > 100000) { status.textContent = 'This editor accepts up to 100,000 characters per run. Send a smaller query.'; return; }
  sentSQL = sql; changed = true; busy = true; controls();
  status.textContent = 'PostgreSQL is running your SQL…';
  const current = worker;
  timer = setTimeout(() => { if (worker === current) discard('The query exceeded 20 seconds. Its disposable database was discarded. Start again to restore the shop.'); }, 20000);
  current.postMessage({ type: 'run', id: ++runNumber, sql });
}
start.addEventListener('click', () => begin(sandboxTutorials.find(item => item.id === picker.value)));
picker.addEventListener('change', preview);
element('continue').addEventListener('click', () => {
  if (tutorial && step < tutorial.steps.length - 1) showStep(true, step + 1);
});
run.addEventListener('click', execute);
editor.addEventListener('keydown', event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); execute(); } });
reset.addEventListener('click', () => begin(tutorial));
stop.addEventListener('click', () => discard('Query stopped. The disposable database was discarded. Start again to restore the shop.'));
previous.addEventListener('click', () => { if (tutorial && step > 0) showStep(true, step - 1); });
next.addEventListener('click', () => { if (tutorial && step < tutorial.steps.length - 1) showStep(true, step + 1); });
element('clear').addEventListener('click', () => { results.replaceChildren(); element('empty').hidden = false; element('empty').textContent = 'Responses cleared. Your database has not changed.'; controls(); });
root.querySelectorAll<HTMLButtonElement>('[data-sample]').forEach(button => button.addEventListener('click', () => loadSQL(`SELECT * FROM ${button.dataset.sample} LIMIT 50;`)));
element('schema').addEventListener('click', () => loadSQL("SELECT table_name, column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_schema = 'public'\nORDER BY table_name, ordinal_position;"));
const requested = new URL(location.href).searchParams.get('tutorial');
const initial = sandboxTutorials.find(item => item.id === requested);
picker.value = initial?.id || '';
preview();
start.disabled = false;
status.textContent = requested && !initial ? 'That tutorial was not found. Choose one above, or explore freely.' : 'Choose Start to load your own copy of the shop database.';
