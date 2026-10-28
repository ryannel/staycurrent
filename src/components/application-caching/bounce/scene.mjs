const clamp=x=>Math.max(0,Math.min(1,x));
const phase=(t,a,b)=>clamp((t-a)/(b-a));
const ease=p=>p*p*(3-2*p);
const paper='var(--color-surface)';
export const starts=[.6,10.4,11.9,13.4,14.9,16.4,17.9,19.4,20.9];
export const duration=25500;
const colours=['--coral','--blue','--teal','--gold','--purple'];
const text=(x,y,value,size=22,colour='--color-text')=>`<text x="${x}" y="${y}" text-anchor="middle" style="font:400 ${size}px var(--font-sans);fill:var(${colour});paint-order:stroke;stroke:var(--color-surface);stroke-width:5px;stroke-linejoin:round">${value}</text>`;
const stroke=(d,colour='--color-rule-strong',width=1.6,extra='')=>`<path d="${d}" fill="none" stroke="var(${colour})" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const qpath=(a,c,b)=>`M${a}Q${c} ${b}`;
const at=(a,c,b,p)=>[(1-p)**2*a[0]+2*(1-p)*p*c[0]+p*p*b[0],(1-p)**2*a[1]+2*(1-p)*p*c[1]+p*p*b[1]];
function result(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><circle cx="-4" cy="0" r="5" fill="var(--blue)"/><circle cx="4" cy="0" r="5" fill="var(--gold)"/>${stroke('M-2-4Q0-6 2-4M-2 4Q0 6 2 4','--color-text',1)}</g>`;}
function ball(x,y,colour,answered=false,squash=0,opacity=1){
  return `<g transform="translate(${x} ${y})" opacity="${opacity}"><ellipse cy="19" rx="${11+3*squash}" ry="2.5" fill="var(--color-text)" opacity=".08"/><g transform="scale(${1+.13*squash} ${1-.13*squash})"><circle r="13" fill="var(${colour})"/><ellipse cx="-4" cy="-5" rx="6" ry="4" transform="rotate(-30 -4 -5)" fill="${paper}" opacity=".3"/>${answered?`<circle r="8" fill="${paper}"/>${result(0,0,.62)}`:''}</g></g>`;
}
function moving(age,a,b,from,control,to,colour,answered=false){
  if(age<a||age>=b)return '';
  const p=phase(age,a,b),e=ease(p),pos=at(from,control,to,e);
  let s='';
  for(let i=3;i>=1;i--){const previous=at(from,control,to,ease(Math.max(0,p-i*.045)));s+=`<circle cx="${previous[0]}" cy="${previous[1]}" r="${4-i*.65}" fill="var(${colour})" opacity="${.22-i*.045}"/>`;}
  return s+ball(...pos,colour,answered,Math.sin(p*Math.PI*2)*.35);
}
function pulse(t,start,x,y,colour='--teal',r=38){const p=phase(t,start,start+.65);return p>0&&p<1?`<circle cx="${x}" cy="${y}" r="${r+14*p}" fill="none" stroke="var(${colour})" stroke-width="1.5" opacity="${(1-p)*.65}"/>`:'';}
function table(x,y,title,colour,active){
  let s=text(x,y-20,title,21);
  s+=`<rect x="${x-46}" y="${y-5}" width="92" height="72" rx="7" fill="var(--color-surface-alt)" stroke="var(--color-rule-strong)"/>`;
  for(let i=0;i<3;i++){
    const yy=y+6+i*21;
    if(i===1)s+=`<rect x="${x-41}" y="${yy-6}" width="82" height="20" rx="4" fill="var(${colour})" opacity="${active?.28:.08}"/>`;
    s+=i===1?text(x-18,yy+9,'P7',15):stroke(`M${x-31} ${yy+3}H${x-9}`,'--color-text-secondary',2,'opacity=".4"');
    s+=stroke(`M${x+9} ${yy+3}H${x+29}`,i===1&&active?colour:'--color-text-secondary',3,`opacity="${i===1&&active?1:.35}"`);
  }
  return s;
}
function picture(seconds,compact){
  const W=compact?440:760,H=compact?515:440;
  const B=compact?[60,220]:[75,220],S=compact?[195,220]:[255,220],C=compact?[330,110]:[475,105];
  const J=compact?[295,445]:[575,380],TY=compact?353:287;
  const P=[J[0]-61,TY+27],R=[J[0]+61,TY+27];
  const bc=[(B[0]+S[0])/2,B[1]-27],sc=[S[0]+28,C[1]],sj=[S[0]+5,J[1]+8];
  const age=seconds-starts[0],saved=age>=7.2,joining=age>=3.35&&age<5.5;
  let s=`<svg class="${compact?'bounce-portrait':'bounce-landscape'}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
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
  s+=`<circle cx="${C[0]}" cy="${C[1]}" r="40" fill="color-mix(in srgb,var(--teal) ${saved?12:4}%,${paper})" stroke="var(${saved?'--teal':'--color-rule-strong'})" stroke-width="1.8"/>`;
  s+=saved?result(...C,1.8):`<circle cx="${C[0]}" cy="${C[1]}" r="10" fill="none" stroke="var(--color-text-secondary)" stroke-dasharray="2 4"/>`;
  s+=text(C[0],C[1]+66,saved?'ready':'empty',18,'--color-text-secondary');
  // An opened database: the two matching rows feed one joined answer.
  s+=`<rect x="${J[0]-121}" y="${TY-44}" width="242" height="${J[1]-TY+66}" rx="20" fill="${paper}" stroke="var(--color-rule-strong)"/>`;
  s+=text(J[0],TY-65,'Database',22);
  s+=table(P[0],TY,'Products','--blue',joining)+table(R[0],TY,'Prices','--gold',joining);
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
  // First request: cache miss -> server -> database join -> server -> cache fill -> reply.
  s+=moving(age,0,.8,B,bc,S,colours[0]);
  s+=moving(age,.8,1.65,S,sc,C,colours[0]);
  s+=moving(age,1.65,2.45,C,sc,S,colours[0]);
  s+=moving(age,2.45,3.35,S,sj,J,colours[0]);
  if(age>=3.35&&age<5.5)s+=ball(J[0],J[1]-30-Math.abs(Math.sin((age-3.35)*Math.PI*1.5))*7,colours[0],age>=5.15);
  s+=moving(age,5.5,6.4,J,sj,S,colours[0],true);
  s+=moving(age,6.4,7.2,S,sc,C,colours[0],true);
  s+=moving(age,7.3,8,C,sc,S,colours[0],true);
  s+=moving(age,8,8.8,S,bc,B,colours[0],true);
  s+=pulse(age,7.2,...C)+pulse(age,8.8,...B,colours[0],25);
  // A softer, quicker rhythm once the answer is ready.
  for(let i=1;i<starts.length;i++){
    const t=seconds-starts[i],c=colours[i%colours.length];
    s+=moving(t,0,.65,B,bc,S,c);
    s+=moving(t,.65,1.35,S,sc,C,c);
    if(t>=1.35&&t<1.6)s+=ball(C[0],C[1]-Math.sin(phase(t,1.35,1.6)*Math.PI)*9,c,true,Math.sin(phase(t,1.35,1.6)*Math.PI));
    s+=moving(t,1.6,2.25,C,sc,S,c,true);
    s+=moving(t,2.25,2.9,S,bc,B,c,true);
    s+=pulse(t,1.35,...C,c)+pulse(t,2.9,...B,c,25);
  }
  return s+'</svg>';
}
export { clamp, phase, ease, paper, colours, text, stroke, qpath, at, result, ball, moving, pulse };
export const scene={title:'An answer, ready',duration,
 alt:'Nine coloured request balls ask for the same product. The first reaches the server, misses the cache and waits while the database joins matching P7 rows from Products and Prices. The server saves the joined result in the cache and replies. Eight later requests return through the cache while both database tables remain still.',
 render:t=>picture(clamp(t)*duration/1000,false)+picture(clamp(t)*duration/1000,true)
};
