// Turns one frame from scenes.mjs into HTML. ShopFigure.astro uses it on the
// server for the first frame and in the browser for every later one, so the
// page reads the same with or without the script.

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const rowTag = { new: 'new', pending: 'uncommitted', gone: 'removed', rolledback: 'rolled back', dropped: 'dropped', hit: 'linked' };
const entryTag = { new: 'new', wait: 'waiting', waited: 'waited', error: 'error' };

export function renderTable(table) {
  const head = table.columns.map(c => `<th scope="col">${esc(c.name)}${c.key ? ` <abbr class="key" title="${c.key === 'PK' ? 'primary key' : c.key === 'FK' ? 'foreign key' : 'part of the primary key and a foreign key'}">${esc(c.key)}</abbr>` : ''}</th>`).join('');
  const body = table.rows.length
    ? table.rows.map(r => `<tr${r.state ? ` data-row="${r.state}"` : ''}>${r.cells.map((cell, i) => {
        const value = r.changed?.includes(i) ? `<mark>${esc(cell)}</mark>` : esc(cell);
        const tag = i === 0 && r.state ? ` <span class="tag">${rowTag[r.state]}</span>` : '';
        return i === 0 ? `<th scope="row">${value}${tag}</th>` : `<td>${value}</td>`;
      }).join('')}</tr>`).join('')
    : `<tr><td colspan="${table.columns.length}" class="empty">no rows</td></tr>`;
  return `<div class="t2-table"><p class="t2-table-name"><code>${esc(table.name)}</code>${table.note ? ` <span>${esc(table.note)}</span>` : ''}</p><div class="t2-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div></div>`;
}

/**
 * The history so far: one column per session or viewer, one row per moment,
 * time running down the table. A cell is empty when that column did nothing
 * at that moment.
 */
function renderEntry(e) {
  if (!e) return '<td></td>';
  const text = e.plain ? `<span class="msg">${esc(e.text)}</span>` : `<code>${esc(e.text)}</code>`;
  const result = e.result ? `<span class="result">→ ${esc(e.result)}</span>` : '';
  const tag = e.state ? ` <span class="tag">${entryTag[e.state]}</span>` : '';
  return `<td${e.state ? ` data-entry="${e.state}"` : ''}>${text}${result}${tag}</td>`;
}

export function renderHistory(history) {
  const head = history.columns.map(c => `<th scope="col">${esc(c)}</th>`).join('');
  const body = history.rows.length
    ? history.rows.map(row => `<tr>${row.map(renderEntry).join('')}</tr>`).join('')
    : `<tr><td colspan="${history.columns.length}" class="empty">nothing sent yet</td></tr>`;
  return `<div class="t2-history-wrap"><table class="t2-history" data-columns="${history.columns.length}"><caption>Time runs down the table</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function renderFrame(frame) {
  const history = frame.history ? renderHistory(frame.history) : '';
  const tables = `<div class="t2-tables">${frame.tables.map(renderTable).join('')}</div>`;
  const checks = frame.checks?.length
    ? `<ul class="t2-checks">${frame.checks.map(c => `<li data-ok="${c.ok}"><span class="mark">${c.ok ? 'Right' : 'Wrong'}</span> <span>${esc(c.label)}:</span> <strong>${esc(c.value)}</strong></li>`).join('')}</ul>`
    : '';
  const outcome = frame.outcome ? `<p class="t2-outcome">${esc(frame.outcome)}</p>` : '';
  return `<p class="t2-label">${esc(frame.label)}</p>${history}${tables}${checks}${outcome}`;
}

/** A plain-text account of every step, for the "Read this figure as text" summary. */
export function frameText(frame) {
  const checks = frame.checks?.map(c => `${c.label}: ${c.value} (${c.ok ? 'right' : 'wrong'}).`).join(' ') ?? '';
  return `${frame.label}. ${frame.explanation} ${checks} ${frame.outcome ?? ''}`.replace(/\s+/g, ' ').trim();
}
