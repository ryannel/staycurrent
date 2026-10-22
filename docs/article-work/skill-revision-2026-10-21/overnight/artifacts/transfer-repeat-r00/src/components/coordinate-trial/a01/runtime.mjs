import { example } from '../example.mjs';
import { point, inverse, viewMatrix, translation, svgMatrix, finitePoint } from '../geometry.mjs';
import { freshState, validState, compensatedView, cardPlacement, groupMatrix, presetState, presets, snapshot, formatPoint } from './model.mjs';
import { createGesture } from './gesture.mjs';

// getScreenCTM already includes the browser bridge. Do not compose it again.
export function localPoint(element, event) {
  const client = { x: event.clientX, y: event.clientY };
  if (!finitePoint(client)) return null;
  try {
    const matrix = element.getScreenCTM();
    if (!matrix || !matrix.is2D) return null;
    const undo = matrix.inverse();
    if (!undo.is2D || ![undo.a, undo.b, undo.c, undo.d, undo.e, undo.f].every(Number.isFinite)) return null;
    const result = new DOMPoint(client.x, client.y).matrixTransform(undo);
    return finitePoint(result) ? { x: result.x, y: result.y } : null;
  } catch { return null; }
}

export function mount(container) {
  const find = name => container.querySelector(`[data-${name}]`);
  const svg = find('editor'), world = find('world'), group = find('group'), card = find('card');
  const target = find('target'), status = find('status'), stateOutput = find('state');
  const tool = find('tool'), zoomInput = find('zoom'), angleInput = find('angle');
  let state = freshState(), targetV = { x: example.svg.width/2, y: example.svg.height/2 };
  let preset = presets[0], reveal = false;
  const log = [];
  function report(message) {
    log.push(message); if (log.length > 8) log.shift();
    status.textContent = log.join(' → ');
  }
  function render() {
    world.setAttribute('transform', svgMatrix(viewMatrix(state.view)));
    group.setAttribute('transform', svgMatrix(groupMatrix()));
    card.setAttribute('transform', svgMatrix(translation(state.card.x, state.card.y)));
    target.setAttribute('transform', `translate(${targetV.x} ${targetV.y})`);
    zoomInput.value = state.view.zoom; angleInput.value = state.view.angle;
    stateOutput.textContent = `Card translation G ${formatPoint(state.card)} · zoom ${state.view.zoom} · angle ${state.view.angle}° · pan V ${formatPoint(state.view.pan)} · target V ${formatPoint(targetV)}`;
  }
  function commit(candidate) {
    if (!validState(candidate)) return false;
    state = candidate; render(); return true;
  }
  const gesture = createGesture({
    read(mode, event) {
      if (!validState(state)) return null;
      const anchor = localPoint(mode === 'Card' ? card : world, event);
      if (mode === 'Card' && anchor && (anchor.x < 0 || anchor.y < 0 || anchor.x > example.card.width || anchor.y > example.card.height)) return null;
      return anchor;
    },
    update(active, event) {
      const pointer = localPoint(active.mode === 'Card' ? group : svg, event);
      if (!pointer || !validState(state)) return false;
      const candidate = structuredClone(state);
      if (active.mode === 'Card') candidate.card = cardPlacement(pointer, active.anchor);
      else candidate.view = compensatedView(state.view, active.anchor, pointer, state.view.zoom);
      if (!candidate.card || !candidate.view) return false;
      // Verify the retained point in the space where the equation was solved.
      const check = active.mode === 'Card'
        ? { x: active.anchor.x + candidate.card.x, y: active.anchor.y + candidate.card.y }
        : point(viewMatrix(candidate.view), active.anchor);
      if (Math.hypot(check.x-pointer.x, check.y-pointer.y) > 1e-7) return false;
      return commit(candidate);
    },
    capture(id) { svg.setPointerCapture(id); },
    release(id) { if (svg.hasPointerCapture(id)) svg.releasePointerCapture(id); },
    report,
  });
  svg.addEventListener('pointerdown', event => {
    if (tool.value === 'Pivot') {
      if (event.button !== 0) return;
      const p = localPoint(svg, event);
      if (p) { targetV = p; render(); report('Pivot chosen in V'); }
      return;
    }
    gesture.down(event, tool.value);
  });
  svg.addEventListener('pointermove', event => gesture.move(event));
  svg.addEventListener('pointerup', event => gesture.up(event));
  svg.addEventListener('pointercancel', event => gesture.cancel(event));
  svg.addEventListener('lostpointercapture', event => gesture.lost(event));
  svg.addEventListener('contextmenu', event => event.preventDefault());
  tool.addEventListener('change', () => gesture.stop());
  function changeView(zoom, angle) {
    gesture.stop();
    if (!validState(state)) return report('Invalid current state');
    const undo = inverse(viewMatrix(state.view));
    if (!undo) return report('View mapping rejected');
    const anchorW = point(undo, targetV);
    const candidate = compensatedView(state.view, anchorW, targetV, zoom, angle);
    if (!candidate) return report('View input rejected');
    const rule = find('anchor-rule').value;
    if (rule === 'pan') candidate.pan = { ...state.view.pan };
    if (rule === 'angle') {
      const wrong = compensatedView(state.view, anchorW, targetV, candidate.zoom, 0);
      candidate.pan = wrong.pan;
    }
    if (commit({ ...state, view: candidate })) {
      const landed = point(viewMatrix(candidate), anchorW);
      find('anchor-before').setAttribute('transform', `translate(${targetV.x} ${targetV.y})`);
      find('anchor-after').setAttribute('transform', `translate(${landed.x} ${landed.y})`);
      find('anchor-trace').style.visibility = 'visible';
      find('anchor-summary').textContent = `World anchor W ${formatPoint(anchorW)}: before V ${formatPoint(targetV)}, after V ${formatPoint(landed)}. Target V ${formatPoint(targetV)} stays fixed.`;
      report(rule === 'correct' ? 'Anchor retained' : 'Deliberately broken anchor rule');
    }
  }
  zoomInput.addEventListener('change', () => changeView(zoomInput.valueAsNumber, state.view.angle));
  angleInput.addEventListener('change', () => changeView(state.view.zoom, angleInput.valueAsNumber));
  find('zoom-more').addEventListener('click', () => changeView(state.view.zoom*1.5, state.view.angle));
  find('mark-pivot').addEventListener('click', () => {
    const markW = point(groupMatrix(), { x: state.card.x+example.p.x, y: state.card.y+example.p.y });
    targetV = point(viewMatrix(state.view), markW); render(); report('Marked point chosen as pivot');
  });
  find('size').addEventListener('click', () => {
    svg.classList.toggle('half'); report('Editor resized; next movement reads current mapping');
  });
  function reset() {
    gesture.stop(); state = presetState(preset);
    svg.classList.toggle('half', preset.half);
    targetV = { x: example.svg.width/2, y: example.svg.height/2 };
    find('anchor-trace').style.visibility = 'hidden';
    find('anchor-summary').textContent = 'Change zoom or angle to compare the anchor before and after.';
    reveal = false; render(); drawTrace(); report('Reset to labelled preset');
  }
  find('preset').addEventListener('change', event => { preset = presets.find(p => p.id === event.target.value); reset(); });
  find('reset').addEventListener('click', reset);
  find('reveal').addEventListener('click', () => { reveal = !reveal; drawTrace(); });
  for (const name of ['algorithm','trace-mode','stale']) find(name).addEventListener('change', drawTrace);
  function drawTrace() {
    const mode = find('trace-mode').value;
    const s = snapshot(preset, mode, find('algorithm').value === 'wrong', preset.resized && find('stale').checked);
    const trace = find('trace');
    trace.querySelector('[data-start-mark]').setAttribute('transform',`translate(${s.beforeC.x} ${s.beforeC.y})`);
    trace.querySelector('[data-pointer-mark]').setAttribute('transform',`translate(${s.targetC.x} ${s.targetC.y})`);
    const polygon = trace.querySelector('[data-result-card]');
    polygon.setAttribute('points',s.corners.map(p=>`${p.x},${p.y}`).join(' '));
    polygon.style.visibility = reveal ? 'visible' : 'hidden';
    const result = trace.querySelector('[data-result-mark]');
    result.setAttribute('transform',`translate(${s.landedC.x} ${s.landedC.y})`);
    result.style.visibility = reveal ? 'visible' : 'hidden';
    const line = trace.querySelector('[data-move-line]');
    for (const [key,value] of Object.entries({x1:s.fromC.x,y1:s.fromC.y,x2:s.targetC.x,y2:s.targetC.y})) line.setAttribute(key,value);
    find('reveal').textContent = reveal ? 'Hide result' : 'Reveal result';
    find('trace-start').textContent = `Start: card G ${formatPoint(s.start.card)}; pan V ${formatPoint(s.start.view.pan)}; zoom ${s.start.view.zoom}; angle ${s.start.view.angle}°; ${preset.half ? 'half' : 'full'} size${preset.resized ? ' after grab' : ''}. Pointer C ${formatPoint(s.fromC)} → ${formatPoint(s.targetC)}.`;
    find('trace-result').textContent = reveal
      ? `${mode === 'Card' ? `New card translation G ${formatPoint(s.next.card)}` : `New pan V ${formatPoint(s.next.view.pan)}`}. Grab lands C ${formatPoint(s.landedC)}; target C ${formatPoint(s.targetC)}.`
      : 'Predict where the grab will land, then reveal the result.';
    const moves = [['C',s.deltaC],['V',s.deltaV],['W',s.deltaW],['G',s.deltaG]];
    find('arrows').replaceChildren(...moves.map(([space,d])=>{
      const el = document.createElement('div');
      el.textContent = `${space}: Δ ${formatPoint(d)} `;
      const arrow = document.createElementNS('http://www.w3.org/2000/svg','svg');
      arrow.setAttribute('viewBox','-50 -50 100 100'); arrow.setAttribute('aria-label',`${space} displacement ${formatPoint(d)}`);
      const path = document.createElementNS(arrow.namespaceURI,'path');
      const length = Math.max(Math.abs(d.x),Math.abs(d.y),1), x=d.x/length*35,y=d.y/length*35;
      path.setAttribute('d',`M0 0 L${x} ${y} m${-x*.2+y*.15} ${-y*.2-x*.15} L${x} ${y} l${-x*.2-y*.15} ${-y*.2+x*.15}`);
      arrow.append(path); el.append(arrow); return el;
    }));
    find('stale-wrap').hidden = !preset.resized;
  }
  render(); drawTrace();
  // Inspection surface for repeatable checks; it does not drive the article.
  container.gestureDemo = { get state() { return structuredClone(state); }, get active() { return gesture.active; }, log, localPoint, gesture };
}
