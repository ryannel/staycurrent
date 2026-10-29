import {text,line,path,travel,svg,ring,ball,makeScene} from '../drawing.mjs';
import {actions,labelLines,payments} from './core.mjs';
function timing(t,small,v){
 const W=small?440:760,L=[W*.24,180],P=[W*.76,180],deferred=v==='deferred';let s=ring(...L,'Order line','105 / 1','--blue',48)+ring(...P,'Parent order',t>.55&&deferred?'105':'Absent','--gold',48)+path(L,P);
 s+=travel(t,.1,.3,L,P,'--blue');if(!deferred&&t>.3)s+=text(W/2,300,'Reference rejected',25);
 if(deferred){s+=travel(t,.35,.55,[P[0],65],P,'--gold');if(t>.7)s+=line(`M${L[0]-48} 320H${P[0]+48}`,'--teal')+text(W/2,355,'COMMIT checks the reference',24);}
 s+=labelLines(W/2,430,t>.8?(deferred?['The parent now exists.','Both rows commit together.']:['The first statement failed.','Roll back this transaction.']):[deferred?'A deliberately deferred foreign key.':'An immediate foreign key.']);return svg(s,small,515);
}
export const scenes={
 timing:makeScene('The same reference, checked later',10000,timing,'A line for new order 105 arrives before the parent order. An immediate foreign key rejects that first insert and the transaction must roll back. When a deferrable foreign key is deliberately deferred, the parent can arrive later; commit then verifies the reference before either row commits. Omitting the parent still makes commit fail.','This independent import scenario keeps the same intended final rows.',actions([['immediate','Immediate'],['deferred','Deferred']])),
 payments:makeScene('Two checks against the same allowance',11000,(t,s)=>payments(t,s,'repeatable'),'At Read Committed both ordinary reads can see no payments. Each transaction decides its proposed £20 fits within £29. Their distinct payment rows satisfy row constraints and both can commit, producing £40.','Row constraints cannot by themselves protect the combined payment total.')
};
