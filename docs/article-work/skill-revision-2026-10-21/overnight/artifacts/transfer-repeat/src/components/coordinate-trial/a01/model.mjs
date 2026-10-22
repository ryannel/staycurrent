import { example } from '../example.mjs';
import { compose, translation, rotation, scale, viewMatrix, bridgeMatrix, point, displacement, inverse, finitePoint, finiteMatrix, add, subtract } from '../geometry.mjs';

export const freshState = () => ({
  card: { ...example.card.translation },
  view: { ...example.view, pan: { ...example.view.pan } },
});
export const groupMatrix = () => compose(translation(example.group.translation.x, example.group.translation.y), rotation(example.group.angle));
export const validState = s => finitePoint(s.card) && finitePoint(s.view.pan)
  && Number.isFinite(s.view.angle) && Number.isFinite(s.view.zoom)
  && s.view.zoom >= example.zoomLimits.min && s.view.zoom <= example.zoomLimits.max
  && finiteMatrix(viewMatrix(s.view));

// Both terms of this subtraction are in V. Rotation has no translation.
export function compensatedView(view, anchorW, targetV, requestedZoom, angle = view.angle) {
  if (![requestedZoom, angle].every(Number.isFinite) || !finitePoint(anchorW) || !finitePoint(targetV)) return null;
  const zoom = Math.max(example.zoomLimits.min, Math.min(example.zoomLimits.max, requestedZoom));
  const pan = subtract(targetV, displacement(compose(rotation(angle), scale(zoom)), anchorW));
  return finitePoint(pan) ? { zoom, angle, pan } : null;
}
export const cardPlacement = (pointerG, grabO) => finitePoint(pointerG) && finitePoint(grabO) ? subtract(pointerG, grabO) : null;

export const presets = [
  { id: 'baseline', label: 'Baseline · full size', half: false, turned: false, resized: false },
  { id: 'half', label: 'Half-size editor', half: true, turned: false, resized: false },
  { id: 'turned', label: 'Turned view · half size', half: true, turned: true, resized: false },
  { id: 'resize', label: 'Resize between moves', half: true, turned: false, resized: true },
];
export function presetState(preset) {
  const s = freshState();
  if (preset.turned) s.view = { zoom: example.view.zoom, angle: 90, pan: { x: 660, y: -40 } };
  return s;
}
export function mappings(s, half = false) {
  const VfromW = viewMatrix(s.view), WfromG = groupMatrix();
  const CfromV = bridgeMatrix({ ...example.bridge, scale: half ? 0.5 : 1 });
  const CfromG = compose(CfromV, VfromW, WfromG);
  return { CfromV, VfromW, WfromG, CfromG, CfromO: compose(CfromG, translation(s.card.x, s.card.y)) };
}
export function snapshot(preset, mode = 'Card', wrong = false, stale = false) {
  const start = presetState(preset), before = mappings(start, preset.resized ? false : preset.half);
  const current = mappings(start, preset.half);
  const fromC = point(before.CfromO, example.p), targetC = add(fromC, example.gesture.clientDelta);
  // Resize uses the next pointer sample recorded by the canonical example.
  if (preset.resized) Object.assign(targetC, { x: 320, y: 260 });
  const map = stale ? before : current;
  const pointerG = point(inverse(map.CfromG), targetC);
  const pointerV = point(inverse(map.CfromV), targetC);
  const anchorW = point(compose(before.WfromG, translation(start.card.x, start.card.y)), example.p);
  const next = structuredClone(start);
  if (mode === 'Pan') next.view = compensatedView(start.view, anchorW, pointerV, start.view.zoom);
  else next.card = wrong
    ? add(start.card, { x: (targetC.x - fromC.x) / start.view.zoom, y: (targetC.y - fromC.y) / start.view.zoom })
    : cardPlacement(pointerG, example.p);
  const after = mappings(next, preset.half), landedC = point(after.CfromO, example.p);
  const deltaC = subtract(targetC, fromC), deltaV = displacement(inverse(current.CfromV), deltaC);
  const deltaW = displacement(inverse(current.VfromW), deltaV), deltaG = displacement(inverse(current.WfromG), deltaW);
  return { start, next, fromC, targetC, landedC, beforeC: point(current.CfromO, example.p), deltaC, deltaV, deltaW, deltaG,
    corners: [{x:0,y:0},{x:example.card.width,y:0},{x:example.card.width,y:example.card.height},{x:0,y:example.card.height}].map(p => point(after.CfromO,p)) };
}
export const formatPoint = p => `(${Number(p.x.toFixed(2))}, ${Number(p.y.toFixed(2))})`;
