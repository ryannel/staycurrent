// Turns one frame from scenes.mjs into HTML. ShopFigure.astro uses it on the
// server for the first frame and in the browser for every later one, so the
// page reads the same with or without the script.

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Notation shared with the transactions article (a03): a value or row changed
// at this step is bold and underlined; the statements added at this step are
// outlined; a statement that waits has a dashed bar, the other column shows
// "still waiting" until it is released, and its result arrives on a later row.
const rowTag = { pending: 'uncommitted', gone: 'removed', rolledback: 'rolled back', dropped: 'dropped', hit: 'linked' };

export function renderTable(table) {
  const head = table.columns.map(c => `<th scope="col">${esc(c.name)}${c.key ? ` <abbr class="key" title="${c.key === 'PK' ? 'primary key' : c.key === 'FK' ? 'foreign key' : 'part of the primary key and a foreign key'}">${esc(c.key)}</abbr>` : ''}</th>`).join('');
  const body = table.rows.length
    ? table.rows.map(r => {
        const state = r.state === 'new' ? '' : r.state;
        const attrs = `${state ? ` data-row="${state}"` : ''}${r.state === 'new' ? ' class="changed"' : ''}`;
        return `<tr${attrs}>${r.cells.map((cell, i) => {
          const changed = r.changed?.includes(i) ? ' class="changed"' : '';
          const tag = i === 0 && state ? ` <span class="tag">${rowTag[state]}</span>` : '';
          return i === 0 ? `<th scope="row"${changed}>${esc(cell)}${tag}</th>` : `<td${changed}>${esc(cell)}</td>`;
        }).join('')}</tr>`;
      }).join('')
    : `<tr><td colspan="${table.columns.length}" class="empty">no rows</td></tr>`;
  return `<div class="t2-table"><p class="t2-table-name"><code>${esc(table.name)}</code>${table.note ? ` <span>${esc(table.note)}</span>` : ''}</p><div class="t2-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div></div>`;
}

/**
 * The history so far: one column per session or viewer, one row per moment,
 * time running down the table. A cell is empty when that column did nothing
 * at that moment.
 *   entry: { text, result?, state?, plain?, current?, resumed?, blocked? }
 *   state: 'wait' (still waiting) | 'waited' (released) | 'error'
 */
function renderEntry(e) {
  if (!e) return '<td></td>';
  if (e.blocked) return '<td class="blocked"><span class="msg">still waiting</span></td>';
  const text = e.plain ? `<span class="msg">${esc(e.text)}</span>` : `<code>${esc(e.text)}</code>`;
  const shown = e.state === 'wait' ? `${e.result}…` : e.resumed ? `finished after the wait: ${e.result}` : e.result;
  const result = e.result ? `<span class="result">${esc(shown)}</span>` : '';
  const kind = e.state === 'waited' ? 'wait ended' : e.state;
  const classes = [kind, e.resumed && 'resumed', e.current && 'current'].filter(Boolean).join(' ');
  return `<td${classes ? ` class="${classes}"` : ''}>${text}${result}</td>`;
}

export function renderHistory(history) {
  const head = history.columns.map(c => `<th scope="col">${esc(c)}</th>`).join('');
  const body = history.rows.length
    ? history.rows.map(row => `<tr>${row.map(renderEntry).join('')}</tr>`).join('')
    : `<tr><td colspan="${history.columns.length}" class="empty">nothing sent yet</td></tr>`;
  return `<div class="t2-history-wrap"><table class="t2-history" data-columns="${history.columns.length}"><caption>Time runs down the table</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/** The figure's board: history, tables and the Right/Wrong lines. The step's
 * title and explanation sit below it, beside the controls (ShopFigure.astro). */
export function renderFrame(frame) {
  const history = frame.history ? renderHistory(frame.history) : '';
  const tables = `<div class="t2-tables">${frame.tables.map(renderTable).join('')}</div>`;
  const checks = frame.checks?.length
    ? `<ul class="t2-checks">${frame.checks.map(c => `<li data-ok="${c.ok}"><span class="mark">${c.ok ? 'Right' : 'Wrong'}</span> <span>${esc(c.label)}:</span> <strong>${esc(c.value)}</strong></li>`).join('')}</ul>`
    : '';
  const outcome = frame.outcome ? `<p class="t2-outcome">${esc(frame.outcome)}</p>` : '';
  return `${history}${tables}${checks}${outcome}`;
}

/** A plain-text account of every step, for the "Read this figure as text" summary. */
export function frameText(frame) {
  const checks = frame.checks?.map(c => `${c.label}: ${c.value} (${c.ok ? 'right' : 'wrong'}).`).join(' ') ?? '';
  return `${frame.label}. ${frame.explanation} ${checks} ${frame.outcome ?? ''}`.replace(/\s+/g, ' ').trim();
}
