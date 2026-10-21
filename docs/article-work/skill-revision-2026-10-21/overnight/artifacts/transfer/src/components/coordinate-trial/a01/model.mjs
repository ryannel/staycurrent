import { example } from '../example.mjs';
import { add, subtract, point, displacement, translation, rotation, scale, compose, about, inverse, finitePoint, finiteMatrix, viewMatrix, bridgeMatrix } from '../geometry.mjs';

export function initialState(preset = 'baseline') {
  let view = { ...example.view, pan: { ...example.view.pan } };
  if (preset === 'turned') {
    const turned = compose(about({ x: example.svg.width / 2, y: example.svg.height / 2 }, example.group.angle), viewMatrix(view));
    view = { zoom: view.zoom, angle: example.group.angle, pan: { x: turned[4], y: turned[5] } };
  }
  return { card: { ...example.card.translation }, view,
    bridge: { ...example.bridge, scale: ['resized', 'turned'].includes(preset) ? 0.5 : 1 } };
}

export function matrices(state) {
  const G_from_O = translation(state.card.x, state.card.y);
  const W_from_G = compose(translation(example.group.translation.x, example.group.translation.y), rotation(example.group.angle));
  const V_from_W = viewMatrix(state.view);
  const C_from_V = bridgeMatrix(state.bridge);
  return { G_from_O, W_from_G, V_from_W, C_from_V,
    C_from_G: compose(C_from_V, V_from_W, W_from_G),
    V_from_O: compose(V_from_W, W_from_G, G_from_O),
    C_from_O: compose(C_from_V, V_from_W, W_from_G, G_from_O) };
}

export function validState(state) {
  if (!finitePoint(state.card) || !finitePoint(state.view.pan) || !Number.isFinite(state.view.angle) ||
      !Number.isFinite(state.view.zoom) || state.view.zoom < example.zoomLimits.min || state.view.zoom > example.zoomLimits.max) return false;
  return Object.values(matrices(state)).every(m => finiteMatrix(m) && inverse(m));
}

// The anchor is in W; the target and both terms of the subtraction are in V.
export function panFor(anchorW, targetV, zoom, angle) {
  if (![zoom, angle].every(Number.isFinite) || !finitePoint(anchorW) || !finitePoint(targetV)) return null;
  const pan = subtract(targetV, displacement(compose(rotation(angle), scale(zoom)), anchorW));
  return finitePoint(pan) ? pan : null;
}

// Translation-only O-to-G placement: pointer_G = grabbed_O + translation_G.
export function cardFor(grabO, pointerG) {
  if (!finitePoint(grabO) || !finitePoint(pointerG)) return null;
  const card = subtract(pointerG, grabO);
  return finitePoint(card) ? card : null;
}

export function anchoredView(state, targetV, requestedZoom, angle) {
  if (!validState(state) || !finitePoint(targetV) || ![requestedZoom, angle].every(Number.isFinite)) return null;
  const oldInverse = inverse(viewMatrix(state.view));
  const anchorW = point(oldInverse, targetV);
  const zoom = Math.max(example.zoomLimits.min, Math.min(example.zoomLimits.max, requestedZoom));
  const pan = panFor(anchorW, targetV, zoom, angle);
  const candidate = { ...state, view: { zoom, angle, pan } };
  return validState(candidate) ? candidate : null;
}

export function comparison(preset = 'baseline', algorithm = 'derived', mode = 'Card') {
  const before = initialState(preset);
  const old = matrices(before);
  const startC = point(old.C_from_O, example.p);
  const after = structuredClone(before);
  if (preset === 'resize-between') after.bridge.scale = 0.5;
  const current = matrices(after);
  const targetC = preset === 'resize-between'
    ? add(point(current.C_from_O, example.p), example.gesture.clientDelta)
    : add(startC, example.gesture.clientDelta);
  const pointerV = point(inverse(current.C_from_V), targetC);
  const anchorW = point(compose(old.W_from_G, old.G_from_O), example.p);
  if (mode === 'Pan') {
    after.view.pan = panFor(anchorW, pointerV, after.view.zoom, after.view.angle);
  } else if (algorithm === 'divide') {
    after.card = add(before.card, { x: (targetC.x - startC.x) / before.view.zoom, y: (targetC.y - startC.y) / before.view.zoom });
  } else {
    const mapping = algorithm === 'stale' ? old.C_from_G : current.C_from_G;
    after.card = cardFor(example.p, point(inverse(mapping), targetC));
  }
  const result = matrices(after);
  const actualC = point(result.C_from_O, example.p);
  const currentStartC = point(current.C_from_O, example.p);
  const deltaC = subtract(targetC, currentStartC);
  const deltaV = displacement(inverse(current.C_from_V), deltaC);
  const deltaW = displacement(inverse(current.V_from_W), deltaV);
  const deltaG = displacement(inverse(current.W_from_G), deltaW);
  return { before, after, startC, currentStartC, targetC, actualC, anchorW,
    targetV: pointerV, actualV: point(inverse(current.C_from_V), actualC),
    deltas: { C: deltaC, V: deltaV, W: deltaW, G: deltaG } };
}
