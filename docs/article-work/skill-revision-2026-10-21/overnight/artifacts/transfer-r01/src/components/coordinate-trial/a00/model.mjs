import { example } from '../example.mjs';
import { compose, translation, rotation, scale, viewMatrix, bridgeMatrix, point, about, displacement } from '../geometry.mjs';
export const card = translation(example.card.translation.x, example.card.translation.y);
export const group = compose(translation(example.group.translation.x,example.group.translation.y), rotation(example.group.angle));
export const view = viewMatrix(example.view);
export const bridge = bridgeMatrix(example.bridge);
export const cardWorld = compose(group,card);
export const cardView = compose(view,group,card);
export const cardClient = compose(bridge,view,group,card);
export const turnView = compose(about({x:example.svg.width/2,y:example.svg.height/2},90),view);
export const collapsedGroup = compose(group,scale(0,1));
export const collapsedClient = compose(bridge,view,collapsedGroup,card);
export const corners = [{x:0,y:0},{x:example.card.width,y:0},{x:example.card.width,y:example.card.height},{x:0,y:example.card.height}];
export const polygon = m => corners.map(p => {const q=point(m,p); return `${q.x},${q.y}`;}).join(' ');
export const format = n => Number.isInteger(n) ? String(n) : Number(n.toFixed(2)).toString();
export const pair = p => `(${format(p.x)}, ${format(p.y)})`;
export function route(p=example.p) {
  const g=point(card,p), w=point(group,g), v=point(view,w), c=point(bridge,v);
  return [p,g,w,v,c];
}
export function orderState(zoom=example.view.zoom, swapped=false) {
  const pan=translation(example.view.pan.x,example.view.pan.y);
  const m=swapped ? compose(scale(zoom),pan) : compose(pan,scale(zoom));
  return { matrix:m, point:point(compose(m,cardWorld),example.p), origin:point(m,{x:0,y:0}), pan:displacement(swapped?scale(zoom):scale(1),example.view.pan) };
}
export function pivotState(centre=true, degrees=90) {
  const local=centre ? about(example.card.centre,degrees) : rotation(degrees);
  const m=compose(card,local);
  return {matrix:m, centre:point(m,example.card.centre), pivot:point(card,centre?example.card.centre:{x:0,y:0})};
}
