import {text,line,path,travel,svg,ring,ball,phase,ease,makeScene} from '../drawing.mjs';
import {colours,labelLines} from './core.mjs';
export function combinations(t,small){
 const W=small?440:760,x=[W*.42,W*.78],y=[185,340];let s=text(W*.6,45,'Payments',23)+text(65,100,'Lines',23);
 x.forEach((xx,j)=>s+=ring(xx,100,j?'£9.50':'£30',j?'502':'501',colours[j],30));
 y.forEach((yy,i)=>{s+=ring(65,yy,i?'Teapot':'Tea',String(i+1),'--purple',28);x.forEach((xx,j)=>{const start=.12+(i*2+j)*.17;s+=path([65,yy],[xx,yy],0,'--color-rule-strong');s+=travel(t,start,start+.13,[65,yy],[xx,yy],'--purple')+travel(t,start,start+.13,[xx,100],[xx,yy],colours[j]);if(t>start+.13)s+=ball(xx-6,yy,'--purple')+ball(xx+8,yy,colours[j]);});});
 s+=labelLines(W/2,455,t>.82?['2 lines × 2 payments = 4 rows','Each payment is counted twice.']:['Match on the same order.']);return svg(s,small,530);
}
export function offer(t,small,v='actual'){
 const W=small?440:760,A=[W/2,90],B=[W*.2,315],C=[W*.8,315],p=t>.78;let s=path(A,B)+path(B,C)+path(C,A)+ring(...A,'Supplier','S1','--purple')+ring(...B,'Product','P7','--blue')+ring(...C,'Region','South','--gold');
 s+=travel(t,.08,.28,A,B,'--purple')+travel(t,.3,.5,A,C,'--gold')+travel(t,.52,.72,B,C,'--blue');
 s+=labelLines(W/2,445,p?(v==='approval'?['All three approvals exist.','This policy permits the triple.']:['Every pair exists somewhere.','The triple was never offered.']):['A three-way fact is more than its pairs.']);return svg(s,small,520);
}
function dependencies(t,small){
 const W=small?440:760,left=W*.23,right=W*.77,repair=t>.6;let s=ring(left,100,'Line 1','103 / 1','--blue',43)+ring(right,100,'Line 2','103 / 2','--gold',43);
 if(!repair){s+=text(left,245,t>.26?'Mina Patel':'Mina Shah',22)+text(right,245,'Mina Shah',22)+path([left,155],[left,215])+path([right,155],[right,215]);s+=travel(t,.08,.26,[W/2,330],[left,245],'--coral');}
 else {const P=[W/2,300];s+=path([left,155],P)+path([right,155],P)+ring(...P,'Customer 1','Mina Patel','--purple',59)+travel(t,.63,.8,[left,245],P,'--purple')+travel(t,.63,.8,[right,245],P,'--purple');}
 s+=labelLines(W/2,445,repair?['Correct one customer record.','Both lines keep the same reference.']:t>.26?['One correction missed a copy.']:['The same customer name is repeated.']);return svg(s,small,525);
}
export function split(t,small,v='sequence'){
 const W=small?440:760,L=75,R=W-80,ys=[135,295],safe=v==='safe'||(v==='sequence'&&t>.72);let s=text(L,45,'Order',23)+text(R,45,'Order time',23);
 ys.forEach((y,i)=>{s+=ring(L,y,'',i?'103':'101',colours[i],32)+ring(R,y,'',i?'20 Oct':'12 Oct',colours[i],44);});
 ys.forEach((y,i)=>ys.forEach((yy,j)=>{if(safe&&i!==j)return;const a=[L+33,y],b=[R-44,yy],start=.07+(i*2+j)*.14;s+=path(a,b,0,i===j?'--color-text-secondary':'--coral');s+=travel(t,start,start+.12,a,b,i===j?colours[i]:'--coral');}));
 s+=labelLines(W/2,410,safe?['Join by order_id.','Each order recovers its own time.']:['Join through their shared customer.','Both dates match both orders.']);return svg(s,small,495);
}
function price(t,small){
 const W=small?440:760,A=[W*.23,200],B=[W*.77,200];let s=ring(...A,'Catalogue',t>.45?'£22':'£20','--gold',50)+ring(...B,'Agreed price','£20','--blue',50)+travel(t,.1,.45,[A[0],65],A,'--gold');
 s+=labelLines(W/2,360,t>.5?['The catalogue changes.','Order 103 still totals £29.']:['Equal values, different facts.']);return svg(s,small,450);
}
export const scenes={
 grain:makeScene('Two lines meet two payments',10500,combinations,'Order 101 has two lines and two payments. Joining both one-to-many relationships by order produces four pairings. Each payment is repeated, so summing the joined payment amounts would report £79 rather than £39.50.','A pairing does not mean that a payment was allocated to that line.'),
 offers:makeScene('Three pairs can invent an offer',10000,offer,'S1–P7, S1–South and P7–South each occur in the original three offers, but S1 / P7 / South was never offered. Splitting an actual offer into three pair lists loses this distinction.','Keep the supplier, product and region together when the triple is the fact.'),
 dependencies:makeScene('One name, one home',10500,dependencies,'Two flattened order lines repeat customer 1’s name. Correcting only one to Mina Patel leaves inconsistent current names. A single customer record gives the current name one home, referenced by both lines.','The line keeps its own quantity and agreed price.'),
 split:makeScene('A shared value can forget the pairing',11000,split,'Orders 101 and 103 share customer 1 but have different dates. Joining projections through the customer pairs each order with both dates, inventing two rows. Keeping order_id on each side restores exactly the original associations.','Lossless means the original associations can be reconstructed.',{defaultVariant:'sequence'}),
 price:makeScene('The agreement keeps its price',7500,price,'The catalogue mug price rises from £20 to £22. The existing order line retains its agreed £20 price, and order 103 still totals £29.','Current price and agreed price answer different questions.')
};
