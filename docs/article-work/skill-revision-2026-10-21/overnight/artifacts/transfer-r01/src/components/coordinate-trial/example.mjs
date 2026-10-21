// The collection's canonical Review board, in named coordinate spaces.
export const example = Object.freeze({
  card: Object.freeze({ width: 80, height: 40, translation: Object.freeze({ x: 30, y: 20 }), centre: Object.freeze({ x: 40, y: 20 }) }),
  p: Object.freeze({ x: 10, y: 10 }),
  q: Object.freeze({ x: 20, y: 10 }),
  group: Object.freeze({ translation: Object.freeze({ x: 160, y: 100 }), angle: 90, width: 140, height: 90 }),
  view: Object.freeze({ zoom: 2, angle: 0, pan: Object.freeze({ x: 60, y: 40 }) }),
  svg: Object.freeze({ width: 800, height: 600 }),
  bridge: Object.freeze({ scale: 1, origin: Object.freeze({ x: 120, y: 80 }) }),
  gesture: Object.freeze({ clientDelta: Object.freeze({ x: 40, y: 20 }), anchorZoom: 3 }),
  zoomLimits: Object.freeze({ min: 0.25, max: 4 }),
});
export const spaces = Object.freeze([
  { id: 'O', name: 'Card', point: { x: 10, y: 10 } },
  { id: 'G', name: 'Group', point: { x: 40, y: 30 } },
  { id: 'W', name: 'World', point: { x: 130, y: 140 } },
  { id: 'V', name: 'View', point: { x: 320, y: 320 } },
  { id: 'C', name: 'Client', point: { x: 440, y: 400 } },
]);
