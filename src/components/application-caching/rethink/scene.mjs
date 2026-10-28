import { clamp, progress, stateAt, duration } from './model.mjs';

const paper = 'var(--color-surface)';
// Redis's current R symbol: Simple Icons, CC0.
const redisPath = 'M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73zm-4.349-5.013c0 1.959-1.926 2.922-3.685 2.922-.941 0-1.664-.247-2.235-.568 1.051-1.592 2.092-3.225 3.21-4.973 1.972.334 2.71 1.43 2.71 2.619z';
const text = (x,y,value,size=18,colour='--color-text',anchor='middle',font='sans') => `<text x="${x}" y="${y}" text-anchor="${anchor}" style="font:400 ${size}px var(--font-${font});fill:var(${colour})">${value}</text>`;
const path = (d,colour='--color-rule-strong',width=1.4,extra='') => `<path d="${d}" fill="none" stroke="var(${colour})" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const smooth = p => p*p*(3-2*p);
const settle = p => p===0||p===1?p:1-Math.exp(-6*p)*Math.cos(9*p);
const mix = (a,b,p) => a+(b-a)*p;
function mug(x=0,y=0,scale=1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M17-12H25C42-12 42 15 24 15H17" fill="none" stroke="var(--blue)" stroke-width="6"/><path d="M-22-22Q-3-17 19-22L17 15Q14 28-2 28Q-19 28-21 15Z" fill="var(--blue)"/><ellipse cx="-1" cy="-22" rx="21" ry="6" fill="${paper}" stroke="var(--blue)" stroke-width="3"/><path d="M-14-10L-13 10Q-12 18-7 19" fill="none" stroke="${paper}" stroke-opacity=".65" stroke-width="3" stroke-linecap="round"/></g>`;
}
function product(x,y,scale=1,rotation=0,assembly=1) {
  const image = settle(progress(assembly,0,.5));
  const name = settle(progress(assembly,.2,.75));
  const price = settle(progress(assembly,.4,1));
  return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})">
    <rect x="-45" y="-57" width="90" height="114" rx="4" fill="${paper}" stroke="var(--color-rule-strong)" stroke-width="1.5"/>
    <rect x="-39" y="-51" width="78" height="61" rx="2" fill="color-mix(in srgb,var(--blue) 12%,${paper})"/>
    <g opacity="${clamp(image)}" transform="translate(0 ${-20*(1-image)})">${mug(-3,-24,.7)}</g>
    <g opacity="${clamp(name)}" transform="translate(${-28*(1-name)} 0)">${text(0,29,'Blue mug',15)}</g>
    <g opacity="${clamp(price)}" transform="translate(${28*(1-price)} 0)">${text(0,49,'£20',19,'--color-text','middle','serif')}</g>
  </g>`;
}
function travel(age,a,b,from,to,draw,arc=0) {
  if(age<a||age>=b)return '';
  const p=smooth(progress(age,a,b));
  return draw(mix(from[0],to[0],p),mix(from[1],to[1],p)-Math.sin(p*Math.PI)*arc,p);
}
function request(x,y) {
  return `<g transform="translate(${x} ${y})"><rect x="-21" y="-12" width="42" height="24" rx="12" fill="${paper}" stroke="var(--color-text-secondary)"/>${text(0,5,'P7',14,'--color-text','middle','mono')}</g>`;
}
function readDial(p) {
  const angle=p*Math.PI*2, x=18*Math.sin(angle),y=-18*Math.cos(angle);
  return `<g transform="translate(345 286)"><circle r="20" fill="${paper}" stroke="var(--gold)" stroke-width="1.5"/><path d="M0 0L0-18A18 18 0 ${p>.5?1:0} 1 ${x} ${y}Z" fill="var(--gold)" opacity=".45"/></g>`;
}
function panel(seconds,cached) {
  const q=stateAt(seconds,cached), {age,index,hit,saved}=q;
  const reading=!hit&&age>=.6&&age<1.5;
  const assembling=!hit&&age>=1.95&&age<2.65;
  const delivered=index>=0&&age>=q.finish;
  const slot=index<0?52:52+index*72;
  let s='<svg viewBox="0 0 400 330" aria-hidden="true">';
  // The browser is the receipt: five identical cards, no hidden score or latency claim.
  s+=`<rect x="10" y="4" width="380" height="70" rx="5" fill="${paper}" stroke="var(--color-rule-strong)"/>`;
  s+=path('M10 23H390')+text(26,18,'north / product P7',11,'--color-text-secondary','start','mono');
  for(let i=0;i<5;i++) {
    const x=52+i*72;
    if(i<q.answers)s+=`<g transform="translate(${x} 49)"><rect x="-29" y="-20" width="58" height="40" rx="3" fill="color-mix(in srgb,var(--blue) 9%,${paper})"/>${mug(-13,0,.3)}${text(13,7,'£20',16,'--color-text','middle','serif')}</g>`;
    else if(i===index&&!delivered) {
      const p=clamp(age/q.finish),r=12;
      s+=`<circle cx="${x}" cy="49" r="${r}" fill="none" stroke="var(--color-rule)" stroke-width="2"/><circle cx="${x}" cy="49" r="${r}" fill="none" stroke="var(--color-text-secondary)" stroke-width="2" stroke-dasharray="${2*Math.PI*r*p} ${2*Math.PI*r}" transform="rotate(-90 ${x} 49)"/>`;
    } else s+=`<circle cx="${x}" cy="49" r="2" fill="var(--color-rule-strong)"/>`;
  }
  // Open the application work area; the data source and Redis stay outside it.
  s+=text(118,106,'Shop server',18);
  s+=`<rect x="19" y="116" width="199" height="129" rx="3" fill="var(--color-surface-alt)"/>`;
  s+=path('M31 136V128H39M198 128H206V136M31 225V233H39M198 233H206V225','--color-text-secondary');
  // A faint layout is a work surface, not a second cached answer.
  s+=`<rect x="73" y="124" width="90" height="114" rx="4" fill="none" stroke="var(--color-text-secondary)" stroke-opacity=".8" stroke-dasharray="2 5"/>`;
  if(!hit&&age>=1.95&&age<(cached?3.1:2.75))s+=product(118,181,1,0,progress(age,1.95,2.65));
  if(hit&&age>=1.08&&age<1.2)s+=product(118,181);
  // The cache slot is deliberately outside the application work area.
  if(cached) {
    s+=`<g transform="translate(268 88) scale(.75)" fill="var(--color-text)"><path d="${redisPath}"/></g>`;
    s+=text(319,106,'Redis',18)+text(311,254,saved?'saved copy':'cache',15,'--color-text-secondary');
    s+=`<rect x="266" y="124" width="90" height="114" rx="4" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-dasharray="${saved?'none':'3 5'}"/>`;
    if(saved)s+=product(311,181);
    else s+=text(311,186,age>=.4&&age<.65?'miss':'empty',16,'--color-text-secondary');
    // The key touches the cache before we fetch or copy anything.
    s+=travel(age,.35,.6,[118,113],[311,113],(x,y)=>request(x,y),8);
    if(hit) s+=travel(age,.65,1.08,[311,181],[118,181],(x,y,p)=>product(x,y,1,-7*Math.sin(p*Math.PI)),20);
    else s+=travel(age,2.65,3.1,[118,181],[311,181],(x,y,p)=>product(x,y,1,7*Math.sin(p*Math.PI)),20);
  }
  // The database's row is always retained. A read copies the facts upwards.
  s+=text(25,270,'Database',17,'--color-text','start');
  s+=`<rect x="19" y="278" width="362" height="38" rx="3" fill="color-mix(in srgb,var(--gold) ${reading?18:7}%,${paper})" stroke="var(${reading?'--gold':'--color-rule-strong'})" stroke-width="${reading?1.8:1}"/>`;
  s+=path('M72 278V316M244 278V316');
  s+=text(46,303,'P7',16,'--color-text','middle','mono')+text(158,303,'Blue mug',18)+text(285,303,'£20',20,'--color-text','middle','serif');
  if(reading)s+=readDial(progress(age,.6,1.5));
  if(!hit) {
    s+=travel(age,1.5,1.95,[158,297],[118,210],(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-45" y="-13" width="90" height="26" rx="3" fill="${paper}" stroke="var(--gold)"/>${text(0,6,'Blue mug',16)}</g>`,8);
    s+=travel(age,1.6,2.05,[285,297],[118,230],(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-27" y="-13" width="54" height="26" rx="3" fill="${paper}" stroke="var(--gold)"/>${text(0,6,'£20',18,'--color-text','middle','serif')}</g>`,28);
  }
  // A request falls into the backend; the completed card comes back to that browser slot.
  s+=travel(age,0,.35,[slot,79],[118,113],(x,y)=>request(x,y));
  const answerStart=hit?1.2:cached?3.1:2.75;
  s+=travel(age,answerStart,q.finish,[118,181],[slot,49],(x,y,p)=>product(x,y,mix(1,.36,p),Math.sin(p*Math.PI)*-5),20);
  s+='</svg>';
  const pips=(n,colour)=>Array.from({length:5},(_,i)=>`<i style="--pip:var(${i<n?colour:'--color-rule'})"></i>`).join('');
  return `<section class="work-scenario"><p class="scenario-title">${cached?'Keep a copy':'Build every answer'}</p>${s}<div class="work-counts"><span><b>${q.reads}</b> database ${q.reads===1?'read':'reads'}<em>${pips(q.reads,'--gold')}</em></span><span><b>${q.builds}</b> ${q.builds===1?'card built':'cards built'}<em>${pips(q.builds,'--blue')}</em></span></div></section>`;
}
export const scene={
  title:'Do the work once',duration,
  alt:'Two versions of the same shop receive five requests for the same £20 blue mug. Without caching, the server reads the database and builds a card five times. With Redis, the first request does that work and saves a copy; four later requests reuse it. Both browsers receive five identical answers. Redis is separate from the application server.',
  render:t=>`<div class="work-pair">${panel(clamp(t)*duration/1000,false)}${panel(clamp(t)*duration/1000,true)}</div>`
};
