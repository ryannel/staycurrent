// Turns a schedule from model.mjs into the rows Figures 2 and 3 show at one step.
// Shared by the server render and the browser script so both draw the same thing.
import { scenarios, stateCells, stateHeadings, verdict } from './model.mjs';

export function scheduleView(scenarioId, optionId, step) {
  const sc = scenarios[scenarioId];
  const steps = sc.options[optionId].steps;
  // Row labels match the step counter: the starting state is step 1.
  const rows = [{ label: '1', a: 'Not started', b: 'Not started', state: stateCells(scenarioId, sc.initial), changed: false, current: step === 0, idle: true }];
  let previous = stateCells(scenarioId, sc.initial).join('|');
  const waiting = { A: false, B: false };
  steps.slice(0, step).forEach((s, i) => {
    const other = s.who === 'A' ? 'B' : 'A';
    const cells = { A: '', B: '' };
    cells[s.who] = s.cell;
    if (waiting[other]) cells[other] = 'still waiting';
    if (s.waits) waiting[s.who] = true;
    if (s.collect) waiting[s.who] = false;
    const state = stateCells(scenarioId, s.state);
    const key = state.join('|');
    rows.push({ label: String(i + 2), a: cells.A, b: cells.B, who: s.who, waits: Boolean(s.waits), resumed: Boolean(s.collect), error: /Error|fails/.test(s.cell), state, changed: key !== previous, current: i + 1 === step });
    previous = key;
  });
  const last = step === steps.length;
  return {
    rows,
    headings: stateHeadings(scenarioId),
    a: sc.a, b: sc.b,
    rule: sc.rule,
    stateHeading: sc.stateHeading,
    note: step === 0 ? sc.startNote ?? `${sc.label}. Rule: ${sc.rule}. ${sc.options[optionId].protection}.` : steps[step - 1].note,
    outcome: last ? verdict(scenarioId, steps.at(-1).state) : null,
    count: steps.length + 1,
  };
}
