import { example } from '../example.mjs';
import { finitePoint } from '../geometry.mjs';
import { cardFor, panFor, validState } from './model.mjs';

// Each call obtains the current element-local -> client mapping.
export function localPoint(element, event) {
  if (![event.clientX, event.clientY].every(Number.isFinite)) return null;
  try {
    const matrix = element.getScreenCTM();
    if (!matrix) return null;
    const back = matrix.inverse(); // SVGMatrix may throw; DOMMatrix may return NaN.
    if (![back.a, back.b, back.c, back.d, back.e, back.f].every(Number.isFinite)) return null;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(back);
    return finitePoint(p) ? { x: p.x, y: p.y } : null;
  } catch {
    return null; // Let the caller retain state and finish any active gesture.
  }
}

// Rendering must commit synchronously before the next mapping is read.
export function installGestures({ surface, card, parent, world, getState, commit, getMode, report = () => {} }) {
  let active = null;
  function update(event) {
    if (!active || event.pointerId !== active.pointerId) return false;
    const state = getState();
    const pointer = localPoint(active.mode === 'Card' ? parent : surface, event);
    if (!pointer) { report('Invalid conversion: kept the last valid placement.'); return false; }
    const candidate = active.mode === 'Card'
      ? { ...state, card: cardFor(active.anchor, pointer) }
      : { ...state, view: { ...state.view, pan: panFor(active.anchor, pointer, state.view.zoom, state.view.angle) } };
    if (!validState(candidate)) { report('Invalid state: kept the last valid placement.'); return false; }
    commit(candidate);
    return true;
  }
  function finish(event, finalUpdate) {
    if (!active || event.pointerId !== active.pointerId) return;
    if (finalUpdate) update(event);
    const id = active.pointerId;
    active = null; // release may itself cause lostpointercapture
    if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
    report(finalUpdate ? 'Completed; final valid sample retained.' : 'Cancelled; last valid placement retained.');
  }
  function down(event) {
    if (active || event.button !== 0 || !(event.buttons & 1) || !validState(getState())) return;
    const mode = getMode();
    if (!['Card', 'Pan'].includes(mode)) return;
    const anchor = localPoint(mode === 'Card' ? card : world, event);
    if (!anchor || (mode === 'Card' && (anchor.x < 0 || anchor.x > example.card.width || anchor.y < 0 || anchor.y > example.card.height))) return;
    try { surface.setPointerCapture(event.pointerId); }
    catch { report('Capture failed; gesture did not start.'); return; }
    active = { pointerId: event.pointerId, mode, anchor };
    report(`${mode} started with pointer ${event.pointerId}.`);
  }
  function move(event) {
    if (!active || event.pointerId !== active.pointerId) return;
    if (!(event.buttons & 1)) finish(event, true);
    else if (!update(event)) finish(event, false);
  }
  const up = event => finish(event, true);
  const cancel = event => finish(event, false);
  const listeners = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: cancel, lostpointercapture: cancel };
  for (const [type, handler] of Object.entries(listeners)) surface.addEventListener(type, handler);
  return { get active() { return active; }, cancel() { if (active) finish({ pointerId: active.pointerId }, false); },
    destroy() { this.cancel(); for (const [type, handler] of Object.entries(listeners)) surface.removeEventListener(type, handler); } };
}
