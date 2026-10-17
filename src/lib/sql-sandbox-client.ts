import { sandboxTutorials, type Tutorial } from './sql-sandbox-tutorials';

const root = document.querySelector<HTMLElement>('[data-sandbox]')!;
const element = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-${name}]`)!;
const chooser = element<HTMLDialogElement>('chooser');
const historyResults = element('history');
const start = element<HTMLButtonElement>('start');
const editor = element<HTMLTextAreaElement>('editor');
const run = element<HTMLButtonElement>('run');
const reset = element<HTMLButtonElement>('reset');
const stop = element<HTMLButtonElement>('stop');
const status = element('status');
const workspace = element('workspace');
const guide = element('guide');
const results = element('results');
const launch = element('launch');
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
  editor.readOnly = busy;
  reset.disabled = busy;
  start.disabled = busy;
  element<HTMLButtonElement>('explore').disabled = busy;
  root.querySelectorAll<HTMLButtonElement>('[data-browse],[data-choose],[data-free-choice],[data-sample],[data-schema]').forEach(button => button.disabled = busy);
  stop.hidden = !busy;
  stop.textContent = ready ? 'Stop & discard database' : 'Cancel loading';
  const proceed = element<HTMLButtonElement>('continue');
  proceed.hidden = !tutorial || step === tutorial.steps.length - 1 || !ranStep;
  proceed.disabled = busy;
  proceed.textContent = tutorial ? `Next: ${tutorial.steps[step + 1]?.title || 'finish'} →` : 'Next step →';
  element('complete').hidden = !tutorial || step !== tutorial.steps.length - 1 || !ranStep;
  element('clear').hidden = !results.children.length && !historyResults.children.length;
  element<HTMLButtonElement>('clear').disabled = busy;
  element<HTMLButtonElement>('edit-query').disabled = busy;
  if (tutorial) element<HTMLProgressElement>('progress').value = step + (ranStep ? 1 : 0);
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
  archiveResults();
  step = proposedStep;
  ranStep = false;
  guide.hidden = false;
  element('step-count').textContent = `Step ${step + 1} of ${tutorial.steps.length}`;
  element<HTMLProgressElement>('progress').max = tutorial.steps.length;
  element('step-title').textContent = item.title;
  element('instruction').textContent = item.instruction;
  element('expected').textContent = item.expected;
  element('expected-panel').hidden = true;
  element('complete').hidden = true;
  element('empty').hidden = false;
  element('empty').textContent = 'Run this step’s SQL to see its result here.';
  element('results-title').textContent = `Result · step ${step + 1}`;
  element('step-list').replaceChildren(...tutorial.steps.map((item, index) => {
    const li = node('li', item.title);
    if (index === step) li.setAttribute('aria-current', 'step');
    return li;
  }));
  element<HTMLAnchorElement>('guide-link').href = `?tutorial=${encodeURIComponent(tutorial.id)}`;
  element<HTMLAnchorElement>('article').href = tutorial.articleHref;
  controls();
  if (checkEdits) {
    status.textContent = 'Next step loaded. Your database still includes the earlier steps.';
    guide.scrollIntoView({ block: 'nearest' });
    element('step-title').focus({ preventScroll: true });
  }
}
function archiveResults() {
  while (results.lastElementChild) historyResults.prepend(results.lastElementChild);
  while (historyResults.children.length > 4) historyResults.lastElementChild?.remove();
  element('history-panel').hidden = !historyResults.children.length;
  element('history-label').textContent = `Previous runs (${historyResults.children.length})`;
}
function discard(message: string) {
  if (busy && ready && sentSQL) {
    const pending = node('section', '', 'sandbox-run');
    pending.append(node('h4', `Run ${runNumber} stopped`), node('p', 'The disposable session was discarded. This is the SQL that was sent; no successful response was received.'), node('pre', sentSQL));
    archiveResults();
    results.prepend(pending);
    element('empty').hidden = true;
  }
  clearTimeout(timer);
  worker?.terminate(); worker = undefined;
  ready = busy = false;
  ranStep = false;
  element('expected-panel').hidden = true;
  status.textContent = message;
  showTransaction('');
  controls();
  // Starting again is always available, including after load or worker failure.
  start.disabled = false;
}
function begin(selected: Tutorial | undefined, ask = true) {
  if (ask && (changed || editor.value !== loadedSQL) && !confirm('Start again with a fresh database? This discards your data changes, edited SQL and result history.')) return false;
  worker?.terminate(); clearTimeout(timer);
  ready = false; busy = true; changed = false; runNumber = 0;
  tutorial = selected; step = 0; ranStep = false;
  chooser.close(); launch.hidden = true;
  element('entry-message').textContent = '';
  results.replaceChildren(); historyResults.replaceChildren();
  element('history-panel').hidden = true;
  element<HTMLDetailsElement>('history-panel').open = false;
  element('empty').hidden = false;
  element('empty').textContent = 'Run the SQL above to see its result here.';
  element('expected-panel').hidden = true;
  element('free-guide').hidden = !!selected;
  element('session-title').textContent = selected?.title || 'Explore the shop database';
  element('mode').textContent = selected ? 'Guided lesson' : 'Free exploration';
  reset.textContent = selected ? 'Restart lesson' : 'Restart database';
  workspace.hidden = false;
  if (selected) showStep(); else { guide.hidden = true; loadSQL('SELECT * FROM products;', false); element('results-title').textContent = 'Result'; }
  const url = new URL(location.href);
  if (selected) url.searchParams.set('tutorial', selected.id); else url.searchParams.delete('tutorial');
  url.hash = '';
  history.replaceState(null, '', url);
  showTransaction('');
  status.textContent = 'Preparing PostgreSQL… The first visit downloads the database engine.';
  controls();
  workspace.scrollIntoView({ block: 'start' });
  element('session-title').setAttribute('tabindex', '-1');
  element('session-title').focus({ preventScroll: true });
  try {
    const current = new Worker(new URL('./sql-sandbox-worker.ts', import.meta.url), { type: 'module' });
    worker = current;
    controls();
    timer = setTimeout(() => { if (worker === current) discard('The database took too long to load. Use Restart to try again.'); }, 60000);
    current.onerror = () => { if (worker === current) discard('The database stopped unexpectedly. Use Restart to try again.'); };
    current.onmessage = ({ data }) => {
      if (worker !== current) return;
      clearTimeout(timer);
      if (data.type === 'fatal') { discard(`${data.message} Use Restart to restore the database.`); return; }
      if (data.type === 'ready') {
        ready = true; busy = false; showTransaction('I');
        status.textContent = selected ? 'Ready. Read the step, then run its SQL.' : 'Ready. Run the query or choose a shop table.';
      } else if (data.type === 'result') {
        busy = false; ranStep = true; showTransaction(data.status);
        renderResults(data);
      }
      controls();
    };
    current.postMessage({ type: 'init' });
  } catch { discard('This browser could not start the database. Try Restart, or use the local practice guide under About this playground.'); }
  return true;
}
function renderResults(data: any) {
  const section = node('section', '', 'sandbox-run');
  section.append(node('h4', tutorial ? `Step ${step + 1} · Run ${data.id}` : `Run ${data.id}`));
  const sent = document.createElement('details');
  sent.append(node('summary', 'SQL you sent'), node('pre', sentSQL));
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
        const isPlan = output.tag === 'EXPLAIN' && output.fields.length === 1 && output.fields[0] === 'QUERY PLAN';
        const wrapper = node('div', '', isPlan ? 'sandbox-output-table sandbox-output-plan' : 'sandbox-output-table');
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
  section.append(sent);
  archiveResults();
  results.prepend(section);
  element('empty').hidden = true;
  const expectedError = tutorial?.steps[step].expectedError;
  const expectedRejection = expectedError && data.outputs.some((output: any) => output.kind === 'error' && output.code === expectedError) && sentSQL.trim() === tutorial?.steps[step].sql.trim();
  ranStep = !!expectedRejection || (errors === 0 && data.outputs.length > 0);
  status.textContent = expectedRejection ? 'Expected rejection. Compare the error with the lesson below.' : errors ? `Database error. ${data.status === 'E' ? 'Send ROLLBACK before continuing.' : 'Inspect the response below.'}` : 'SQL finished. Inspect the result below.';
  element('expected-panel').hidden = !tutorial;
  element<HTMLDetailsElement>('expected-panel').open = !!tutorial;
  element('edited').hidden = !tutorial || sentSQL.trim() === tutorial.steps[step].sql.trim();
  const heading = element('results-title');
  requestAnimationFrame(() => {
    heading.closest('section')!.scrollIntoView({ block: matchMedia('(max-width: 800px)').matches ? 'start' : 'nearest' });
    heading.focus({ preventScroll: true });
  });
}
function execute() {
  if (!ready || busy || !worker) return;
  const sql = editor.value.trim();
  if (!sql) { status.textContent = 'Enter a SQL command first.'; editor.focus(); return; }
  if (sql.length > 100000) { status.textContent = 'This editor accepts up to 100,000 characters per run. Send a smaller query.'; return; }
  sentSQL = sql; changed = true; busy = true; controls();
  status.textContent = 'PostgreSQL is running your SQL…';
  const current = worker;
  timer = setTimeout(() => { if (worker === current) discard('The query exceeded 20 seconds. Its database was discarded. Use Restart to restore the original data.'); }, 20000);
  current.postMessage({ type: 'run', id: ++runNumber, sql });
}
start.addEventListener('click', () => begin(sandboxTutorials.find(item => item.id === 'queries')));
element('explore').addEventListener('click', () => begin(undefined));
element('free-choice').addEventListener('click', () => begin(undefined));
element('continue').addEventListener('click', () => {
  if (tutorial && ranStep && step < tutorial.steps.length - 1) showStep(true, step + 1);
});
run.addEventListener('click', execute);
editor.addEventListener('keydown', event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); execute(); } });
reset.addEventListener('click', () => begin(tutorial));
stop.addEventListener('click', () => discard('Session discarded. Your SQL is still visible. Use Restart to restore the original data.'));
element('clear').addEventListener('click', () => {
  results.replaceChildren(); historyResults.replaceChildren();
  element('history-panel').hidden = true;
  element('expected-panel').hidden = true;
  element('empty').hidden = false;
  element('empty').textContent = 'Results cleared. Your database has not changed.';
  controls();
});
root.querySelectorAll<HTMLButtonElement>('[data-sample]').forEach(button => button.addEventListener('click', () => {
  if (loadSQL(`SELECT * FROM ${button.dataset.sample} LIMIT 50;`)) { editor.focus(); editor.scrollIntoView({ block: 'nearest' }); }
}));
element('schema').addEventListener('click', () => {
  if (loadSQL("SELECT table_name, column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_schema = 'public'\nORDER BY table_name, ordinal_position;")) { editor.focus(); editor.scrollIntoView({ block: 'nearest' }); }
});
root.querySelectorAll<HTMLButtonElement>('[data-browse]').forEach(button => button.addEventListener('click', () => chooser.showModal()));
element('close').addEventListener('click', () => chooser.close());
chooser.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); chooser.close(); } });
element('edit-query').addEventListener('click', () => { editor.focus({ preventScroll: true }); editor.scrollIntoView({ block: 'center' }); });
root.querySelectorAll<HTMLButtonElement>('[data-choose]').forEach(button => button.addEventListener('click', () => begin(sandboxTutorials.find(item => item.id === button.dataset.choose))));
function filterLessons() {
  const query = element<HTMLInputElement>('search').value.trim().toLowerCase();
  const subject = element<HTMLSelectElement>('subject').value;
  let count = 0;
  root.querySelectorAll<HTMLElement>('[data-lesson-group]').forEach(group => {
    let visible = 0;
    group.querySelectorAll<HTMLElement>('[data-lesson-card]').forEach(card => {
      card.hidden = !!(subject && group.dataset.lessonGroup !== subject) || !card.dataset.searchText?.includes(query);
      if (!card.hidden) visible++;
    });
    group.hidden = !visible; count += visible;
  });
  element('lesson-count').textContent = `${count} ${count === 1 ? 'lesson' : 'lessons'}`;
  element('no-lessons').hidden = count > 0;
}
element('search').addEventListener('input', filterLessons);
element('subject').addEventListener('change', filterLessons);
// Lessons merged into another keep their old links working.
const renamedTutorials: Record<string, string> = { 'index-order': 'indexes', 'index-selectivity': 'indexes' };
const requestedId = new URL(location.href).searchParams.get('tutorial');
const requested = requestedId && (renamedTutorials[requestedId] ?? requestedId);
const initial = sandboxTutorials.find(item => item.id === requested);
controls();
if (initial) begin(initial, false);
else if (requested) element('entry-message').textContent = 'That lesson was not found. Start the first lesson, explore freely, or browse the catalogue.';
if (location.hash === '#lessons') chooser.showModal();
