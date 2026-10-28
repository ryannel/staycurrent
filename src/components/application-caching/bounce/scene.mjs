import { products, readRequests } from './workload.mjs';

const clamp=x=>Math.max(0,Math.min(1,x));
const phase=(t,a,b)=>clamp((t-a)/(b-a));
const ease=p=>p*p*(3-2*p);
const paper='var(--color-surface)';
export const starts=[.6,10.4,11.9,13.4,14.9,16.4,17.9,19.4,20.9];
export const duration=37500;
const colours=['--coral','--blue','--teal','--gold','--purple'];
const text=(x,y,value,size=22,colour='--color-text')=>`<text x="${x}" y="${y}" text-anchor="middle" style="font:400 ${size}px var(--font-sans);fill:var(${colour});paint-order:stroke;stroke:var(--color-surface);stroke-width:5px;stroke-linejoin:round">${value}</text>`;
const stroke=(d,colour='--color-rule-strong',width=1.6,extra='')=>`<path d="${d}" fill="none" stroke="var(${colour})" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const qpath=(a,c,b)=>`M${a}Q${c} ${b}`;
const at=(a,c,b,p)=>[(1-p)**2*a[0]+2*(1-p)*p*c[0]+p*p*b[0],(1-p)**2*a[1]+2*(1-p)*p*c[1]+p*p*b[1]];
function result(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><circle cx="-4" cy="0" r="5" fill="var(--blue)"/><circle cx="4" cy="0" r="5" fill="var(--gold)"/>${stroke('M-2-4Q0-6 2-4M-2 4Q0 6 2 4','--color-text',1)}</g>`;}
const keyLabel=(x,y,key)=>`<text x="${x}" y="${y+3.5}" text-anchor="middle" style="font:600 12px var(--font-sans);fill:var(--color-text);paint-order:stroke;stroke:var(--color-surface);stroke-width:2px">${key}</text>`;
export function keyCache(x,y,keys,r=40){
  let s=`<circle cx="${x}" cy="${y}" r="${r}" fill="${paper}" stroke="var(${keys.size?'--teal':'--color-text-secondary'})" stroke-width="1.8"/>`;
  products.forEach((product,i)=>{
    const xx=x+(i-1)*24,filled=keys.has(i);
    s+=`<circle cx="${xx}" cy="${y}" r="11" fill="${filled?'var('+product.colour+')':paper}" stroke="var(${filled?product.colour:'--color-text-secondary'})" ${filled?'':'stroke-dasharray="2 3"'}/>`+keyLabel(xx,y,product.key);
  });
  return s;
}
function ball(x,y,colour,answered=false,squash=0,opacity=1,key=''){
  return `<g transform="translate(${x} ${y})" opacity="${opacity}"><ellipse cy="19" rx="${11+3*squash}" ry="2.5" fill="var(--color-text)" opacity=".08"/><g transform="scale(${1+.13*squash} ${1-.13*squash})"><circle r="13" fill="var(${colour})"/><ellipse cx="-4" cy="-5" rx="6" ry="4" transform="rotate(-30 -4 -5)" fill="${paper}" opacity=".3"/>${answered?`<circle r="8" fill="${paper}"/>${key?'':result(0,0,.62)}`:''}${key?keyLabel(0,0,key):''}</g></g>`;
}
function moving(age,a,b,from,control,to,colour,answered=false,key=''){
  if(age<a||age>=b)return '';
  const p=phase(age,a,b),e=ease(p),pos=at(from,control,to,e);
  let s='';
  for(let i=3;i>=1;i--){const previous=at(from,control,to,ease(Math.max(0,p-i*.045)));s+=`<circle cx="${previous[0]}" cy="${previous[1]}" r="${4-i*.65}" fill="var(${colour})" opacity="${.22-i*.045}"/>`;}
  return s+ball(...pos,colour,answered,Math.sin(p*Math.PI*2)*.35,1,key);
}
function pulse(t,start,x,y,colour='--teal',r=38){const p=phase(t,start,start+.65);return p>0&&p<1?`<circle cx="${x}" cy="${y}" r="${r+14*p}" fill="none" stroke="var(${colour})" stroke-width="1.5" opacity="${(1-p)*.65}"/>`:'';}
function table(x,y,title,colour,active,key='P7'){
  let s=text(x,y-20,title,21);
  s+=`<rect x="${x-46}" y="${y-5}" width="92" height="72" rx="7" fill="var(--color-surface-alt)" stroke="var(--color-rule-strong)"/>`;
  products.forEach((product,i)=>{
    const yy=y+6+i*21,selected=active&&product.key===key;
    if(selected)s+=`<rect x="${x-41}" y="${yy-6}" width="82" height="20" rx="4" fill="var(${colour})" opacity=".28"/>`;
    s+=text(x-18,yy+9,product.key,15);
    s+=stroke(`M${x+9} ${yy+3}H${x+29}`,selected?colour:'--color-text-secondary',3,`opacity="${selected?1:.35}"`);
  });
  return s;
}
function picture(seconds,compact){
  const W=compact?440:760,H=compact?515:440;
  const B=compact?[60,220]:[75,220],S=compact?[195,220]:[255,220],C=compact?[330,110]:[475,105];
  const J=compact?[295,445]:[575,380],TY=compact?353:287;
  const P=[J[0]-61,TY+9],R=[J[0]+61,TY+9];
  const bc=[(B[0]+S[0])/2,B[1]-27],sc=[S[0]+28,C[1]],sj=[S[0]+5,J[1]+8];
  const filled=new Set(readRequests.filter(r=>r.miss&&seconds>=r.at+7.2/r.speed).map(r=>r.key));
  const misses=readRequests.filter(r=>r.miss&&seconds>=r.at+1.65/r.speed).length;
  const cold=readRequests.find(r=>r.miss&&(seconds-r.at)*r.speed>=3.35&&(seconds-r.at)*r.speed<5.5);
  const age=cold?(seconds-cold.at)*cold.speed:0,joining=Boolean(cold),saved=filled.size>0;
  const currentKey=products[cold?.key??0].key;
  P[1]+=21*(cold?.key??0); R[1]+=21*(cold?.key??0);
  let s=`<svg class="${compact?'bounce-portrait':'bounce-landscape'}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  products.forEach((product,i)=>{
    const x=W/2+(i-1)*85;
    s+=`<circle cx="${x-22}" cy="21" r="7" fill="var(${product.colour})"/>`+text(x+5,27,product.key,18);
  });
  // Quiet permanent geography. Colour belongs to the moving requests and matching data.
  s+=stroke(qpath(B,bc,S));
  s+=stroke(qpath(S,sc,C),saved?'--teal':'--color-rule-strong',saved?2:1.6);
  s+=stroke(qpath(S,sj,J),'--color-rule-strong',1.6);
  // A little browser, then the server that owns both lookups.
  s+=`<rect x="${B[0]-29}" y="${B[1]-23}" width="58" height="46" rx="7" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`;
  s+=stroke(`M${B[0]-29} ${B[1]-10}H${B[0]+29}`,'--color-text-secondary',1);
  s+=`<circle cx="${B[0]-19}" cy="${B[1]-16}" r="1.8" fill="var(--color-text-secondary)"/><circle cx="${B[0]-12}" cy="${B[1]-16}" r="1.8" fill="var(--color-text-secondary)"/>`;
  s+=text(B[0],B[1]+55,'App',22);
  s+=`<circle cx="${S[0]}" cy="${S[1]}" r="29" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`;
  for(let i=0;i<2;i++)s+=`<rect x="${S[0]-14}" y="${S[1]-13+i*15}" width="28" height="11" rx="3" fill="none" stroke="var(--color-text-secondary)"/><circle cx="${S[0]+8}" cy="${S[1]-7.5+i*15}" r="1.4" fill="var(--color-text-secondary)"/>`;
  s+=text(S[0],S[1]+55,'Server',22);
  // The saved join result is a pair; it stays here when later balls pick up a copy.
  s+=text(C[0],C[1]-61,'Cache',24);
  s+=keyCache(...C,filled);
  s+=text(C[0],C[1]+66,`${misses} cache ${misses===1?'miss':'misses'}`,18,'--color-text-secondary');
  // An opened database: the two matching rows feed one joined answer.
  s+=`<rect x="${J[0]-121}" y="${TY-44}" width="242" height="${J[1]-TY+66}" rx="20" fill="${paper}" stroke="var(--color-rule-strong)"/>`;
  s+=text(J[0],TY-65,'Database',22);
  s+=table(P[0],TY,'Products','--blue',joining,currentKey)+table(R[0],TY,'Prices','--gold',joining,currentKey);
  s+=stroke(qpath([P[0],TY+68],[P[0],J[1]],J),'--color-rule-strong',1.2);
  s+=stroke(qpath([R[0],TY+68],[R[0],J[1]],J),'--color-rule-strong',1.2);
  // Only the cold request wakes the join. The table rows themselves are never removed.
  if(joining){
    for(const [from,colour] of [[P,'--blue'],[R,'--gold']]){
      const p=ease(phase(age,4.0,5.15));
      const [x,y]=at(from,[from[0],J[1]],J,p);
      s+=`<circle cx="${x}" cy="${y}" r="${6+Math.sin(p*Math.PI)*2}" fill="var(${colour})"/>`;
    }
  }
  s+=`<circle cx="${J[0]}" cy="${J[1]}" r="17" fill="${paper}" stroke="var(--color-rule-strong)"/>`;
  if(age>=5.15&&age<5.5)s+=result(...J,.9);
  for(const request of readRequests){
    const a=(seconds-request.at)*request.speed,product=products[request.key],c=product.colour,k=product.key;
    const saved=[C[0]+(request.key-1)*24,C[1]];
    const move=(start,end,from,control,to,answered=false)=>moving(a,start,end,from,control,to,c,answered,k);
    s+=move(0,.8,B,bc,S)+move(.8,1.65,S,sc,saved);
    if(request.miss){
      s+=move(1.65,2.45,saved,sc,S)+move(2.45,3.35,S,sj,J);
      if(a>=3.35&&a<5.5)s+=ball(J[0],J[1]-30-Math.abs(Math.sin((a-3.35)*Math.PI*1.5))*7,c,a>=5.15,0,1,k);
      s+=move(5.5,6.4,J,sj,S,true)+move(6.4,7.2,S,sc,saved,true);
      s+=move(7.3,8,saved,sc,S,true)+move(8,8.8,S,bc,B,true);
      s+=pulse(a,7.2,...C,c);
    }else{
      s+=move(1.65,2.3,saved,sc,S,true)+move(2.3,2.95,S,bc,B,true);
      s+=pulse(a,1.65,...C,c);
    }
  }
  return s+'</svg>';
}
export { clamp, phase, ease, paper, colours, text, stroke, qpath, at, result, ball, moving, pulse };
export const scene={title:'An answer, ready',duration,
 alt:'P7, P8 and P9 have distinct, labelled colours. Each product’s first request misses, reads matching rows from Products and Prices, and saves its own answer. Repeated requests for that same product hit. The cache gains three separate entries and counts three misses across nine requests.',
 caption:'Figure 1. In Figures 1–2, each labelled colour identifies a product. P7’s saved answer cannot answer P8. Filled dots are saved entries. Each new key misses once; later requests for that key reuse its entry. Nine requests, three cache misses. Motion and timing are illustrative.',
 render:t=>picture(clamp(t)*duration/1000,false)+picture(clamp(t)*duration/1000,true)
};
