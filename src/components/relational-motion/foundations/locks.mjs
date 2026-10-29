import { text,line,path,travel,svg,app,ring,ball,makeScene } from '../drawing.mjs';
import {actions,labelLines} from './core.mjs';
import {mug,authority,snapshot,deadlock} from '../../relational-rebuild-locks/models.mjs';
function padlock(x,y,c){return line(`M${x-8} ${y}V${y-8}Q${x} ${y-21} ${x+8} ${y-8}V${y}` ,c)+`<rect x="${x-11}" y="${y}" width="22" height="18" rx="3" fill="var(--color-surface)" stroke="var(${c})" stroke-width="2"/>`;}
function ownership(t,small,v,payment=false){
 const W=small?440:760,A=[65,110],B=[65,335],D=[W-85,220],held=t>.18&&t<.61,free=v==='read'||v==='children';let s=app(...A,payment?'Attempt A':'Mina')+app(...B,payment?'Attempt B':'Tariq')+ring(...D,payment?'Order 103':'Mug row',payment?'£29':t>.61?'0':'1','--teal',45)+path(A,D)+path(B,D);
 s+=travel(t,.04,.18,A,D,'--blue')+travel(t,.25,.39,B,free?D:[D[0]-70,D[1]+60],'--gold');
 if(held&&! (payment&&v==='children'))s+=padlock(D[0],D[1]-75,'--blue');
 if(held&&!free&&t>.39)s+=ball(D[0]-70,D[1]+60-Math.abs(Math.sin(t*65))*7,'--gold')+text(W/2,365,'Waiting',22);
 if(free)s+=travel(t,.4,.53,D,B,'--gold');else s+=travel(t,.64,.75,[D[0]-70,D[1]+60],D,'--gold')+travel(t,.77,.89,D,B,'--gold');
 if(!payment&&v==='read')s+=travel(t,.7,.79,B,D,'--gold')+travel(t,.8,.9,D,B,'--gold');
 const ending=payment?(v==='children'?['No rows existed to lock.','Both pay £20 · total £40.']:['B reads the new £20 total.','The second payment is refused.']):v==='read'?['Earlier read: 1 · later read: 0.','Neither read reserves stock.']:v==='lock'?['Tariq locks the changed row.','Stock 0 · purchase refused.']:['The guard is tested again.','Stock 0 · no row changed.'];
 s+=labelLines(W/2,470,t>.9?ending:[held?'The statement finished; its lock remains.':'The transaction owns the lock.']);return svg(s,small,550);
}
function view(t,small,v){
 const W=small?440:760,left=55,right=W-55,fresh=v==='rc';let s=text(W/2,45,'B waits for the order lock',25)+line(`M${left} 140H${right}`)+text(left,103,'£0 paid',21)+text(right,103,'£20 paid',21);
 s+=text(W/2,190,'A commits',23);if(t>.2)s+=ball(left,140,'--gold');if(t>.52)s+=padlock(right,220,'--gold');
 s+=travel(t,.05,.48,[left,140],[right,140],'--blue');
 s+=text(W/2,280,fresh?'A later statement starts':'The earlier snapshot remains',23);
 s+=travel(t,.6,.82,[fresh?right:left,140],[W/2,355],'--gold');
 if(t>.82)s+=ring(W/2,355,'B reads',fresh?'£20':'£0','--gold',45);
 s+=labelLines(W/2,470,t>.85?(fresh?['£20 + £20 exceeds £29.','B refuses.']:['£0 + £20 appears to fit.','Ownership did not refresh the view.']):['Lock acquisition and observation are separate.']);return svg(s,small,550);
}
function cycle(t,small,v){
 const W=small?440:760,A=[65,90],B=[W-65,90],P=[65,290],Q=[W-65,290],ordered=v==='ordered';let s=app(...A,'Transaction A')+app(...B,'Transaction B')+ring(...P,'Tea row','P3','--blue')+ring(...Q,'Mug row','P7','--gold')+path(A,P)+path(B,Q);
 s+=travel(t,.05,.2,A,P,'--blue');if(t>.2&&t<.8)s+=padlock(P[0],P[1]-65,'--blue');
 s+=travel(t,.22,.36,B,ordered?P:Q,'--gold');
 if(ordered){s+=path(A,Q,35)+travel(t,.4,.55,A,Q,'--blue');if(t>.55&&t<.8)s+=padlock(Q[0],Q[1]-65,'--blue');}
 else {if(t>.36&&t<.85)s+=padlock(Q[0],Q[1]-65,'--gold');s+=path(A,Q,0,'--color-rule-strong')+path(B,P,0,'--color-rule-strong')+travel(t,.4,.55,A,[Q[0]-25,Q[1]-60],'--blue')+travel(t,.58,.72,B,[P[0]+25,P[1]-60],'--gold');}
 s+=labelLines(W/2,420,t>.78?(ordered?['A releases both; B can continue.','One wait, no cycle.']:['Each waits for the other.','One transaction must abort.']):[ordered?'Both request tea before the mug.':'Each holds what the other needs.']);return svg(s,small,500);
}
const from=(model,draw)=>makeScene(model.title,12000,draw,model.options.map(o=>`${o.label}: ${o.steps.map(s=>s.explanation).join(' ')}`).join(' '),model.caption,actions(model.options.map(o=>[o.value,o.label])));
export const scenes={
 'lock-lifetime':from(mug,(t,s,v)=>ownership(t,s,v)),
 'payment-authority':from(authority,(t,s,v)=>ownership(t,s,v,true)),
 'decision-snapshot':from(snapshot,view),
 'product-deadlock':from(deadlock,cycle)
};
