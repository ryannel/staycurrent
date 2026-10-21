// Draws one step of a schedule figure as HTML. Used at build time for the first
// paint and in the browser by ScheduleFigure's script, so both always agree.
import { rules, customerName } from './model.mjs';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The history up to `index`: one row per lane statement, in the order things
 * happened. A statement that waits keeps its own row; when the wait ends, its
 * result arrives as a new row at that point in time, after whatever released it. */
export function history(steps, index) {
  const rows = [];
  for (let i = 0; i <= index; i++) {
    const step = steps[i];
    if (!step.lane) continue;
    if (step.resume) {
      const waiting = [...rows].reverse().find(r => r.lane === step.lane && r.status === 'wait' && r.endedAt === undefined);
      if (waiting) waiting.endedAt = i;
      rows.push({ lane: step.lane, show: step.show, out: step.out, status: step.status ?? 'ok', at: i, resumed: true });
      continue;
    }
    rows.push({ lane: step.lane, show: step.show, out: step.out, status: step.status ?? 'ok', at: i });
  }
  return rows;
}

const waited = out => out.replace(/^waiting for/, 'waited for');

function laneCell(row, lane, rows, index) {
  if (row.lane === lane) {
    const current = row.at === index;
    if (row.status === 'wait') {
      const ended = row.endedAt !== undefined;
      return `<div class="hcell st-wait${ended ? ' ended' : ''}${current ? ' current' : ''}"><code>${esc(row.show)}</code><span class="out">${esc(ended ? waited(row.out) : `${row.out}…`)}</span></div>`;
    }
    if (row.resumed) {
      return `<div class="hcell st-${row.status} resumed${current ? ' current' : ''}"><code>${esc(row.show)}</code><span class="out">finished after the wait: ${esc(row.out)}</span></div>`;
    }
    return `<div class="hcell st-${row.status}${current ? ' current' : ''}"><code>${esc(row.show)}</code><span class="out">${esc(row.out)}</span></div>`;
  }
  // Show a lane that is still blocked while the other lane works.
  const blocked = rows.find(r => r.lane === lane && r.status === 'wait' && r.at < row.at && (r.endedAt === undefined || r.endedAt > row.at));
  return blocked ? `<div class="hcell blocked"><span class="out">still waiting</span></div>` : '<div class="hcell empty"></div>';
}

function tableHtml(kind, db, before) {
  const changed = (rowKey, column, value) => {
    if (!before) return false;
    const old = before[kind].find(r => rowKey(r));
    return !old || old[column] !== value;
  };
  if (kind === 'classes') {
    return `<table class="rows"><caption>classes</caption><thead><tr><th scope="col">class_id <abbr title="primary key">PK</abbr></th><th scope="col">title</th><th scope="col">capacity</th><th scope="col">remaining</th></tr></thead><tbody>${
      db.classes.map(c => `<tr><td>${c.class_id}</td><td>${esc(c.title)}</td><td>${c.capacity}</td><td class="${changed(r => r.class_id === c.class_id, 'remaining', c.remaining) ? 'changed' : ''}">${c.remaining}</td></tr>`).join('')
    }</tbody></table>`;
  }
  if (kind === 'reservations') {
    return `<table class="rows"><caption>reservations</caption><thead><tr><th scope="col">request_id <abbr title="primary key">PK</abbr></th><th scope="col">class_id <abbr title="foreign key to classes">FK</abbr></th><th scope="col">owner_id <abbr title="foreign key to customers">FK</abbr></th></tr></thead><tbody>${
      db.reservations.map(r => { const isNew = before && !before.reservations.some(o => o.request_id === r.request_id); return `<tr class="${isNew ? 'changed' : ''}"><td>${esc(r.request_id)}</td><td>${r.class_id}</td><td>${r.owner_id} <span class="who">(${esc(customerName(r.owner_id))})</span></td></tr>`; }).join('')
    }</tbody></table>`;
  }
  return `<table class="rows"><caption>instructors</caption><thead><tr><th scope="col">class_id <abbr title="part of the primary key, and a foreign key to classes">PK FK</abbr></th><th scope="col">person <abbr title="part of the primary key">PK</abbr></th><th scope="col">available</th></tr></thead><tbody>${
    db.instructors.map(i => `<tr><td>${i.class_id}</td><td>${esc(i.person)}</td><td class="${changed(r => r.person === i.person, 'available', i.available) ? 'changed' : ''}">${i.available}</td></tr>`).join('')
  }</tbody></table>`;
}

export function boardHtml(figure, option, index) {
  const steps = option.steps;
  const step = steps[index];
  const before = index > 0 ? steps[index - 1].db : null;
  const lanes = Object.keys(figure.lanes);
  const rows = history(steps, index);
  const pending = lane => { for (let i = index; i >= 0; i--) { const s = steps[i]; if (s.lane === lane && s.pending !== undefined) return s.pending; } return ''; };
  // A figure about locks states what each lane holds instead of what it has changed.
  const holdsLocks = lane => steps.some(s => s.lane === lane && s.holds !== undefined);
  const holds = lane => { for (let i = index; i >= 0; i--) { const s = steps[i]; if (s.lane === lane && s.holds !== undefined) return s.holds; } return ''; };
  const state = lane => holdsLocks(lane)
    ? (holds(lane) ? `Holds locks on: ${esc(holds(lane))}` : 'Holds no locks')
    : (pending(lane) ? `Uncommitted: ${esc(pending(lane))}` : 'Nothing uncommitted');
  const head = lanes.map(l => `<div class="lane-head"><span class="lane-name">${esc(figure.lanes[l])}</span><span class="pending" data-live>${state(l)}</span></div>`).join('');
  const body = rows.length
    ? rows.map(row => `<li class="hrow">${lanes.map(l => laneCell(row, l, rows, index)).join('')}</li>`).join('')
    : `<li class="hrow"><div class="hcell empty start">No statement has run yet.</div></li>`;
  const r = rules(step.db);
  const ruleLines = figure.tables.includes('instructors') ? [r.instructors] : r.classes;
  const rulesHtml = ruleLines.map(x => `<li class="${x.ok ? 'ok' : 'broken'}"><span class="mark" aria-hidden="true">${x.ok ? '✓' : '✗'}</span> ${esc(x.text)}<span class="verdict">${x.ok ? ' (rule holds)' : ' (rule broken)'}</span></li>`).join('');
  return `<div class="history lanes-${lanes.length}">
  <div class="lane-heads">${head}</div>
  <ol class="hrows" data-live>${body}</ol>
</div>
<div class="committed">
  <p class="panel-name">Committed rows, as every new transaction sees them</p>
  <div class="tables" data-live>${figure.tables.map(t => tableHtml(t, step.db, before)).join('')}</div>
  <ul class="rule-check" data-live>${rulesHtml}</ul>
</div>`;
}

/** The text alternative: every option's steps and its outcome. */
export function textAlternative(figure) {
  return figure.options.map(option => {
    const last = option.steps.at(-1).db;
    const r = rules(last);
    const lines = figure.tables.includes('instructors') ? [r.instructors] : r.classes;
    return { label: option.label, steps: option.steps.map(s => s.text), outcome: lines.map(x => `${x.text}: ${x.ok ? 'the rule holds' : 'the rule is broken'}.`).join(' ') };
  });
}
