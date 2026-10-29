import { text, line, path, travel, svg, app, server, database, ring, ball, phase, ease, makeScene, divider } from '../drawing.mjs';
export const colours=['--blue','--gold','--teal','--coral','--purple'];
export const actions = values => ({defaultVariant:values[0][0],actions:values.map(([value,label])=>({value,label}))});
export const dot=(x,y,label,c='--blue',r=19)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(${c})"/>`+text(x,y+6,label,17);
export const labelLines=(x,y,lines,small=false)=>{
 const limit=x<=220?36:62;
 const wrapped=lines.flatMap(value=>{const result=[];let line='';for(const word of String(value).split(' ')){if(line&&(line+' '+word).length>limit){result.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)result.push(line);return result;});
 return wrapped.map((v,i)=>text(x,y+i*27,v,small?20:22)).join('');
};
export const finalNote=(W,y,t,before,after)=>labelLines(W/2,y,t<.88?before:after);

// A bounded transaction has a visible commit boundary. All its facts cross it
// together; a rollback withdraws the provisional work instead.
export function purchase(t,small,v){
 const W=small?440:760,fail=['failure','rollback'].includes(v),A=[small?68:110,150],D=[small?350:650,150],boundary=W*.57;
 let s=path(A,D)+app(...A)+database(...D,'Committed');
 s+=line(`M${boundary} 90V345`,'--teal','stroke-dasharray="4 6"')+text(boundary,57,'Commit',22);
 const y=[225,280,335],labels=['Mug: −1','Tea: −2','Order + lines'];
 labels.forEach((label,i)=>{const start=.12+i*.15,ready=t>=start,stop=fail&&i>0;if(stop)return;const p=ease(phase(t,.7,.83)),x=fail?W*.33-ease(phase(t,.55,.78))*80:W*.33+p*(D[0]-W*.33);if(ready&&!(fail&&t>.8)){s+=path([W*.33,y[i]],[D[0],y[i]],0,'--color-rule-strong');s+=`<g opacity="${fail?1-phase(t,.55,.8):1}">`+ball(x,y[i],colours[i])+text(x,y[i]+35,label,19)+'</g>';}});
 const done=t>.84;s+=labelLines(W/2,410,done?(fail?['Rolled back','Mug 1 · Tea 12 · no order']:['Committed together','Mug 0 · Tea 10 · order 103']):[fail&&t>.5?'The purchase cannot finish':'Changes remain provisional']);
 return svg(s,small,485);
}
export function race(t,small,v){
 const W=small?440:760,A=[65,120],B=[65,330],D=[W-85,225],guarded=['guarded','write'].includes(v);
 let s=path(A,D,-30)+path(B,D,30)+app(...A,'Mina')+app(...B,'Tariq')+database(...D,'Mug stock',t>.57?'0':'1');
 s+=travel(t,.04,.13,A,D,'--blue')+travel(t,.14,.23,D,A,'--blue')+travel(t,.07,.16,B,D,'--gold')+travel(t,.17,.26,D,B,'--gold');
 if(t>.23)s+=text(A[0],A[1]-60,'Read 1',20);
 if(t>.26)s+=text(B[0],B[1]+90,'Read 1',20);
 s+=travel(t,.30,.42,A,D,'--blue')+travel(t,.35,.46,B,[D[0]-70,D[1]+55],'--gold');
 if(t>.46&&t<.66)s+=ball(D[0]-70,D[1]+55-Math.abs(Math.sin(t*60))*8,'--gold')+text(W/2,315,'Waits',20);
 s+=travel(t,.66,.77,[D[0]-70,D[1]+55],D,'--gold')+travel(t,.58,.68,D,A,'--blue')+travel(t,.79,.9,D,B,guarded?'--coral':'--gold');
 if(t>.68)s+=text(A[0]+20,A[1]-28,'Accepted',19);
 if(t>.9)s+=text(B[0]+40,B[1]-48,guarded?'0 rows · rollback':'Accepted',20);
 s+=labelLines(W/2,480,t>.9?(guarded?['The guard sees stock 0.','One mug, one purchase.']:['Both wrote their earlier zero.','One mug, two purchases.']):[guarded?'Check stock and subtract together':'Write a previously calculated value']);
 return svg(s,small,550);
}
export function snapshots(t,small,v){
 const W=small?440:760,left=55,right=W-55,repeat=v==='repeatable';let s=text(W/2,42,repeat?'One transaction snapshot':'A snapshot for each statement',23);
 s+=line(`M${left} 135H${right}`)+text(left,103,'Before',21)+text(right,103,'After',21)+text(W/2,112,'Purchase commits',20);
 const current=left+ease(phase(t,.1,.6))*(right-left);s+=ball(current,135,'--teal');
 s+=text(left,180,'Stock 1',21)+text(right,180,'Stock 0',21);
 const readX=[left,repeat?left:right,repeat?left:right],at=[.12,.64,.81],labels=['Read stock','Find order 103','Read stock again'],answers=['1',repeat?'Absent':'Present',repeat?'1':'0'];
 labels.forEach((label,i)=>{const yy=260+i*100;s+=text(left,yy,label,21,'--color-text','start');if(t>=at[i]){s+=line(`M${readX[i]} 195V${yy+15}`,'--color-rule-strong','stroke-dasharray="3 5"');s+=travel(t,at[i],at[i]+.1,[readX[i],195],[right,yy+25],colours[i]);if(t>at[i]+.1)s+=dot(right,yy+25,answers[i],colours[i],answers[i].length>1?34:20);}});
 return svg(s,small,560);
}
export function payments(t,small,v){
 const W=small?440:760,left=40,right=W-40,width=right-left,serial=v==='serializable',paid=t<.58?0:t<.8?20:serial?20:40;
 let s=app(left+35,100,'Request A')+app(right-35,100,'Request B')+text(W/2,215,'Both read: £0 paid',24);
 const limit=left+width*29/40;
 s+=line(`M${left} 320H${right}`)+line(`M${limit} 280V362`,'--coral')+text(limit,392,'£29 limit',22);
 if(paid)s+=`<rect x="${left}" y="300" width="${width*20/40}" height="40" rx="10" fill="var(--blue)"/>`;
 if(paid===40)s+=`<rect x="${left+width/2}" y="300" width="${width/2}" height="40" rx="10" fill="var(--gold)"/>`;
 s+=travel(t,.28,.58,[left+35,130],[left+width*.25,320],'--blue')+travel(t,.43,.8,[right-35,130],serial?[right-35,235]:[left+width*.75,320],serial?'--coral':'--gold');
 s+=text(W/2,445,`£${paid} committed`,28);
 if(t>.8)s+=labelLines(W/2,495,serial?['One attempt aborts.','A fresh decision refuses another £20.']:['Different rows can both commit.','The combined payments exceed the limit.']);
 return svg(s,small,565);
}
export function recovery(t,small,v){
 const W=small?440:760,A=[65,155],M=[W/2,155],L=[W-75,155],D=[W-75,380];
 const early=['early','before'].includes(v),replied=['reply','early'].includes(v),lost=v==='early',durable=!early;
 let s=path(A,M)+path(M,L)+path(L,D)+app(...A)+server(...M,'Memory')+database(...L,'Durable WAL',t>.4&&durable?'Commit':'')+database(...D,'Recovered',t>.85?(durable?'£22':'£20'):'');
 s+=travel(t,.05,.18,A,M,'--coral')+travel(t,.22,.4,M,L,'--gold');
 if(t>.48){s+=line(`M${M[0]-18} 137L${M[0]+18} 173`,'--coral')+line(`M${M[0]+18} 137L${M[0]-18} 173`,'--coral')+text(M[0],250,'Power loss',22);}
 if(durable)s+=travel(t,.63,.84,L,D,'--gold');
 s+=labelLines(W/2,480,t>.85?[`App heard: ${replied?'success':'no reply'}`,durable?'Commit survives.':lost?'An early reply can be lost.':'No committed change survives.']:['The table file may still hold £20.']);
 return svg(s,small,550);
}
export const transactionScenes={
 purchase:makeScene('The whole purchase, or none of it',10500,purchase,'The mug allocation, tea allocation and order are provisional together. Commit makes all three available to a new reader. Rollback after the mug allocation leaves the original stock and no order.','The commit boundary belongs to the complete purchase, not each stock change.',actions([['commit','Commit'],['rollback','Roll back']])),
 stock:makeScene('Two buyers, one mug',12000,race,'Mina and Tariq both read one mug. Mina updates first. Tariq waits. Writing the earlier calculated zero can accept both purchases; a guarded subtraction rechecks stock zero and changes no row, so Tariq rolls back.','A selected PostgreSQL Read Committed schedule. Zero changed rows must make the caller abandon the purchase.',actions([['unsafe','Earlier calculation'],['guarded','Guarded change']])),
 snapshots:makeScene('Two reads across one commit',12000,snapshots,'The first stock read sees one mug. Mina commits a purchase. Read Committed uses new statement snapshots: the order appears and the later stock read sees zero. Repeatable Read keeps the first query’s snapshot: no order and stock one.','The saved first answer never changes. The choice is which committed view a later query reads.',actions([['committed','Read Committed'],['repeatable','Repeatable Read']])),
 payments:makeScene('Two payments against £29',11000,payments,'Two transactions each read zero paid and propose twenty. Under Repeatable Read their distinct payment rows can both commit, producing forty. Serializable cannot retain both; in the illustrated outcome one aborts and its whole retry refuses another twenty.','The bar counts committed payments. The chosen winner is illustrative.',actions([['repeatable','Repeatable Read'],['serializable','Serializable']]))
};
