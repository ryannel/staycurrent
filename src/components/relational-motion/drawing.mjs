// The shared vocabulary is taken from the approved caching animations.
// Choreography is illustrative; a dot is a request/record, never a benchmark.
export { clamp, phase, ease, paper, ball, moving, pulse, result } from '../application-caching/bounce/scene.mjs';
import { clamp, moving, ball } from '../application-caching/bounce/scene.mjs';
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const text = (x,y,value,size=22,colour='--color-text',anchor='middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="var(${colour})" style="font:400 ${size}px var(--font-sans);paint-order:stroke;stroke:var(--color-surface);stroke-width:4px;stroke-linejoin:round">${esc(value)}</text>`;
export const line = (d,colour='--color-text-secondary',extra='') => `<path d="${d}" fill="none" stroke="var(${colour})" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export const midpoint = (a,b,bend=0) => [(a[0]+b[0])/2,(a[1]+b[1])/2+bend];
export const path = (a,b,bend=0,colour='--color-text-secondary',extra='') => line(`M${a}Q${midpoint(a,b,bend)} ${b}`,colour,extra);
export const travel = (t,start,end,a,b,colour='--coral',label='',bend=0) => moving(t,start,end,a,midpoint(a,b,bend),b,colour,false,label);
export const svg = (body,small,height=420) => `<svg class="motion-${small?'portrait':'landscape'}" viewBox="0 0 ${small?440:760} ${height}" aria-hidden="true">${body}</svg>`;
export const note = (x,y,lines,small=false) => lines.map((s,i)=>text(x,y+i*28,s,small?21:23)).join('');
export const divider = (y,small) => line(`M24 ${y}H${small?416:736}`,'--color-rule-strong');
export function app(x,y,label='App') {
  return `<rect x="${x-27}" y="${y-22}" width="54" height="44" rx="7" fill="var(--color-surface)" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`+line(`M${x-27} ${y-9}H${x+27}`)+`<circle cx="${x-17}" cy="${y-15}" r="2" fill="var(--color-text-secondary)"/><circle cx="${x-9}" cy="${y-15}" r="2" fill="var(--color-text-secondary)"/>`+text(x,y+54,label,21);
}
export function server(x,y,label='Server',colour='--color-text-secondary') {
  let s=`<circle cx="${x}" cy="${y}" r="30" fill="var(--color-surface)" stroke="var(${colour})" stroke-width="1.7"/>`;
  for(let i=0;i<2;i++)s+=`<rect x="${x-15}" y="${y-14+i*17}" width="30" height="12" rx="3" fill="none" stroke="var(${colour})"/><circle cx="${x+9}" cy="${y-8+i*17}" r="1.5" fill="var(${colour})"/>`;
  return s+text(x,y+58,label,21);
}
export function database(x,y,label='Database',value='',colour='--color-text-secondary') {
  return `<path d="M${x-33} ${y-23}V${y+23}C${x-33} ${y+40} ${x+33} ${y+40} ${x+33} ${y+23}V${y-23}" fill="var(--color-surface)" stroke="var(${colour})" stroke-width="1.6"/><ellipse cx="${x}" cy="${y-23}" rx="33" ry="11" fill="var(--color-surface)" stroke="var(${colour})" stroke-width="1.6"/>`+text(x,y+12,value,22)+text(x,y+65,label,21);
}
export function ring(x,y,label='',value='',colour='--teal',radius=37) {
  return `<circle cx="${x}" cy="${y}" r="${radius}" fill="var(--color-surface)" stroke="var(${colour})" stroke-width="1.8"/>`+text(x,y+8,value,22)+text(x,y+radius+30,label,21);
}
export function token(x,y,label='',colour='--blue',r=13) {
  return ball(x,y,colour,false,0,1)+ (label?text(x,y-r-13,label,19):'');
}
export function makeScene(title,duration,draw,alt,caption='',extra={}) {
  return {title,duration,alt,caption,replayResetsVariant:false,visibilityThreshold:.35,render:(t,v)=>draw(clamp(t),false,v)+draw(clamp(t),true,v),...extra};
}
