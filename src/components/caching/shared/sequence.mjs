// A stepped sequence diagram for ordered interactions: a race between two
// requests, a failover, a slot migration. Lanes run down the figure; each step
// adds one arrow or note and one explanation. Controls come from
// src/components/figures/stepper.mjs through <SimFigure controls="steps">.
import { stepper } from '../../figures/stepper.mjs';
import { svgEl } from './scene.mjs';

/**
 * Lane state after `step`: the initial values merged with every step's `state` up to it.
 * Pure; tested in node.
 */
export function stateAt(spec, step) {
  const state = { ...(spec.initial ?? {}) };
  const changed = new Set();
  spec.steps.slice(0, step + 1).forEach((s, i) => {
    for (const [lane, value] of Object.entries(s.state ?? {})) {
      state[lane] = value;
      if (i === step) changed.add(lane);
    }
  });
  return { state, changed };
}

/** Splits a label into two lines at the space nearest its middle; a single word stays whole. Pure; tested in node. */
export function splitLabel(text) {
  const spaces = [...String(text).matchAll(/ /g)].map(m => m.index);
  if (!spaces.length) return [String(text)];
  const middle = text.length / 2;
  const at = spaces.reduce((best, i) => (Math.abs(i - middle) < Math.abs(best - middle) ? i : best));
  return [text.slice(0, at), text.slice(at + 1)];
}

// Makes a lane heading fit its box: two lines at a smaller size if the label has a
// space, then a smaller font, never below 9 px. Labels that already fit are untouched.
function fitLaneLabel(text, label, x, headH, max) {
  const measure = el => (typeof el.getComputedTextLength === 'function' ? el.getComputedTextLength() : 0);
  const full = measure(text);
  if (!full || full <= max) return;
  const lines = splitLabel(label);
  let widest = full, base = 12.5;
  if (lines.length === 2) {
    text.textContent = '';
    text.setAttribute('y', headH / 2 - 2);
    base = 11;
    text.style.fontSize = `${base}px`;
    const spans = lines.map((line, i) => { const t = svgEl('tspan', { x, dy: i ? 12 : 0 }, text); t.textContent = line; return t; });
    widest = Math.max(...spans.map(measure));
    if (widest <= max) return;
  }
  text.style.fontSize = `${Math.max(9, base * max / widest).toFixed(1)}px`;
  if (base * max / widest < 9) { text.setAttribute('textLength', max); text.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
}

/**
 * sequenceFigure(root, {
 *   label:   accessible name for the diagram
 *   intro?:  explanation shown before the first step, with no arrows drawn
 *   lanes:   [{ id, label, short?, kind }],          left to right; `short` replaces the label below 480 px.
 *                                                    A label wider than its box wraps to two lines or shrinks.
 *   initial: { [laneId]: 'text' },                    what each lane holds before step 1, e.g. { redis: 'empty', db: 'v1' }
 *   steps:   [{
 *     from?, to?, label?, kind?,                      an arrow from lane to lane, coloured by kind
 *     at?, note?,                                     or a note on one lane (e.g. 'pause', 'expires')
 *     state?: { [laneId]: 'text' },                   lane values that change at this step
 *     explanation,                                    the sentence shown under the diagram
 *   }],
 * })
 * The root must be a <SimFigure controls="steps"> with a [data-scene] and [data-explanation].
 */
export function sequenceFigure(root, spec) {
  const container = root.querySelector('[data-scene]');
  const explanation = root.querySelector('[data-explanation]');
  container.replaceChildren();
  const svg = svgEl('svg', { class: 'cache-svg cache-sequence', role: 'img', 'aria-label': spec.label ?? 'Sequence of steps' }, container);
  let width = 0;
  let current = 0;

  const offset = spec.intro ? 1 : 0;
  const draw = shown => {
    current = shown;
    const step = shown - offset;
    if (explanation) explanation.textContent = step < 0 ? spec.intro : spec.steps[step]?.explanation ?? '';
    if (!width) return;
    svg.replaceChildren();
    const compact = width < 480;
    const n = spec.lanes.length;
    const margin = compact ? 6 : 16;
    const laneWidth = (width - 2 * margin) / n;
    const laneX = Object.fromEntries(spec.lanes.map((lane, i) => [lane.id, margin + laneWidth * (i + 0.5)]));
    const headH = 30, stateH = 26, rowH = compact ? 40 : 38;
    const top = headH + stateH + 18;
    const height = top + spec.steps.length * rowH + 8;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width); svg.setAttribute('height', height);
    const { state, changed } = stateAt(spec, step);

    for (const lane of spec.lanes) {
      const x = laneX[lane.id];
      const g = svgEl('g', { class: 'cache-lane', 'data-cache-kind': lane.kind ?? 'neutral' }, svg);
      const boxW = Math.min(laneWidth - 6, 120);
      svgEl('rect', { class: 'cache-lane-head', x: x - boxW / 2, y: 2, width: boxW, height: headH - 4, rx: 4 }, g);
      const laneLabel = compact && lane.short ? lane.short : lane.label;
      const text = svgEl('text', { class: 'cache-lane-label', x, y: headH / 2 + 4, 'text-anchor': 'middle' }, g);
      text.textContent = laneLabel;
      fitLaneLabel(text, laneLabel, x, headH, boxW - 8);
      svgEl('path', { class: 'cache-lifeline', d: `M${x} ${headH + stateH + 4}V${height - 4}` }, g);
      if (state[lane.id] !== undefined) {
        svgEl('text', { class: changed.has(lane.id) ? 'cache-lane-state is-changed' : 'cache-lane-state', x, y: headH + 17, 'text-anchor': 'middle' }, g).textContent = state[lane.id];
      }
    }

    spec.steps.slice(0, step + 1).forEach((s, i) => {
      const y = top + i * rowH + rowH * 0.62;
      const g = svgEl('g', { class: i === step ? 'cache-message is-current' : 'cache-message', 'data-cache-kind': s.kind ?? 'neutral' }, svg);
      if ((s.from && s.to) || s.at) svgEl('text', { class: 'cache-step-number', x: 2, y: y + 4 }, g).textContent = String(i + 1);
      if (s.from && s.to) {
        const a = laneX[s.from], b = laneX[s.to];
        const dir = Math.sign(b - a) || 1;
        const start = a + dir * 4, end = b - dir * 4;
        svgEl('path', { class: 'cache-arrow', d: `M${start} ${y}H${end}` }, g);
        svgEl('path', { class: 'cache-arrowhead', d: `M${end} ${y}l${-dir * 7} -4.5v9z` }, g);
        const label = svgEl('text', { class: 'cache-message-label', x: (a + b) / 2, y: y - 7, 'text-anchor': 'middle' }, g);
        label.textContent = s.label ?? '';
      } else if (s.at) {
        // A note may be wider than its lane; keep it inside the drawing.
        const w = (s.note ?? '').length * 6.8 + 14;
        const x = Math.max(w / 2 + 2, Math.min(width - w / 2 - 2, laneX[s.at]));
        svgEl('rect', { class: 'cache-note-box', x: x - w / 2, y: y - 10, width: w, height: 20, rx: 3 }, g);
        svgEl('text', { class: 'cache-note-text', x, y: y + 4, 'text-anchor': 'middle' }, g).textContent = s.note ?? '';
      }
    });
  };

  const player = stepper(root, { steps: () => spec.steps.length + offset, draw });
  const resize = () => { const w = Math.round(container.clientWidth); if (w && w !== width) { width = w; draw(current); } };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(container);
  resize();
  return player;
}
