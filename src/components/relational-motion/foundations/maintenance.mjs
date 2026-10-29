import {text,line,path,travel,svg,app,database,ring,ball,phase,ease,makeScene} from '../drawing.mjs';
import {actions,colours,labelLines,dot} from './core.mjs';
function guard(t,small,v){
 const W=small?440:760,x=[W*.2,W*.5,W*.8],old=v==='20',names=['Tea','Mug','Teapot'],prices=['£4.50',t>.65&&old?'£22':`£${v}`,'£35'];let s=text(W/2,45,'Change the mug only while it costs £20',small?21:25);
 x.forEach((xx,i)=>s+=ring(xx,190,names[i],prices[i],i===1?'--teal':'--color-text-secondary',43));
 s+=travel(t,.1,.38,[W/2,70],[x[1],190],'--coral');if(t>.42)s+=text(W/2,320,old?'Key and old price both match.':'The old-price condition is false.',23);
 s+=labelLines(W/2,415,t>.8?[old?'£22 returned · 1 row changed':'No returned row · no change']:['The condition belongs to the write.']);return svg(s,small,480);
}
function batch(t,small){
 const W=small?440:760,L=65,R=W-110,ys=[110,215,320,425],labels=['Mug · £22','New tea · £8','Tea · −£4.50','Teapot · £36'],starts=[.15,.28,null,.73];let s=text(L,35,'B17',23)+text(R,35,'Recorded outcome',23);
 labels.forEach((label,i)=>{const start=starts[i],done=start!==null&&t>start+.15,reject=i===2&&t>.13;s+=dot(L,ys[i],String(i+1),colours[i])+text(L+40,ys[i]-28,label,small?19:23,'--color-text','start');if(start!==null)s+=travel(t,start,start+.15,[L,ys[i]],[R,ys[i]],colours[i]);if(done||reject)s+=text(R,ys[i]+45,reject?'Rejected':'Applied',23);else s+=text(R,ys[i]+45,t>.13?'Pending':'Received',21);});
 s+=labelLines(W/2,575,t>.9?['3 applied + 1 rejected = 4 received','Replay finds no pending work.']:t>.47&&t<.7?['Stopped before the final chunk.','Its row remains pending.']:['Commit each chunk with its progress.']);return svg(s,small,650);
}
function prune(t,small,v){
 const W=small?440:760,months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],cols=4,dx=(W-90)/3,ys=[105,235,365],query=[W/2,540],oct=v==='october';let s=app(...query,'Query');months.forEach((m,i)=>{const x=45+i%cols*dx,y=ys[Math.floor(i/cols)],kept=!oct||i===9;s+=ring(x,y,m,'',t>.35&&!kept?'--color-rule-strong':'--teal',28);if(t>.35&&!kept)s+=text(x,y+7,'×',24);if(kept){s+=path([x,y+29],[query[0],query[1]-24],0,'--color-rule-strong');s+=travel(t,.42+i*.018,.65+i*.018,[query[0],query[1]-24],[x,y],colours[i%5]);}});
 s+=labelLines(W/2,650,t>.8?[oct?'1 candidate partition':'12 candidate partitions',v==='id'?'No time bound proves a month irrelevant.':'Status, join and aggregation work remain.']:['Exclude a partition only from its bounds.']);return svg(s,small,725);
}
function retire(t,small,v){
 const W=small?440:760,whole=v==='whole',A=[W/2,80],start=[W/2,270],p=whole?ease(phase(t,.3,.55)):0,J=[start[0]-p*W*.25,start[1]+p*70],gone=whole&&t>.85;let s=ring(...A,'Monthly table','','--teal',40);
 if(t<.55||!whole)s+=path([A[0],A[1]+40],J);
 if(!gone){s+=database(...J,'January');[0,1,2].forEach(i=>s+=ball(J[0]+(i-1)*18,J[1]+5,whole||i===0?'--blue':'--gold'));}
 if(whole&&t>.55&&t<.85)s+=text(W*.71,300,'Detached',24);
 s+=labelLines(W/2,465,!whole?['The cutoff falls inside January.','Keep the month; some rows must remain.']:gone?['Authorised drop verified.','Other copies still need their own outcome.']:t>.55?['Detached, but still stored.','Verify before any authorised destruction.']:['Resolve related records and writers first.']);return svg(s,small,545);
}
function deletion(t,small){
 const W=small?440:760,A=[65,300],R=W-90,labels=['Profile','Earlier versions','Invoice PDF','Search copy','Backup copies'],end=[.2,.32,.48,.76,.94];let s=app(...A,'Request');
 labels.forEach((label,i)=>{const y=75+i*125,done=t>end[i];s+=path([A[0]+27,A[1]],[R-30,y],0,'--color-rule-strong')+ring(R,y,label,done?'✓':i===3&&t>.5?'!':'','--teal',30)+travel(t,end[i]-.13,end[i],[A[0]+27,A[1]],[R-30,y],i===3&&t<.6?'--coral':colours[i]);});
 s+=labelLines(W/2,715,t>.95?['The agreed scope can close.']:t>.76?['Online copies are removed.','Backup expiry is still outstanding.']:t>.5?['Search removal failed.','Keep the request open and retry.']:['A database deletion is only one destination.']);return svg(s,small,795);
}
export const scenes={
 guard:makeScene('A guarded write checks the current fact',9000,guard,'The statement selects only P7 and changes it to £22 only while its old price is £20. If it is already £22, the statement succeeds but changes and returns no row. Other products and stock are unchanged.','Zero rows is a result the application must interpret.',actions([['20','Mug starts at £20'],['22','Mug starts at £22']])),
 batch:makeScene('An interrupted import keeps its place',12500,batch,'B17 receives four records. The negative tea price is rejected. Mug and new tea changes commit with applied records; a stop leaves the teapot row pending. Resume commits that last row. Replaying B17 finds nothing pending: three applied and one rejected account for all four inputs.','Stock and agreed order prices are untouched; the stop is before the final chunk starts.'),
 prune:makeScene('Which months can contain an answer?',11000,prune,'An October time range excludes eleven of twelve month partitions. A full-year range keeps all twelve. An order ID without a time bound also keeps twelve possible partitions. Paid-status tests, local searches and any order-line join remain after pruning.','Kept means possible, not necessarily scanned or matched.',actions([['october','October report'],['year','Full-year report'],['id','Order ID only']])),
 retire:makeScene('Detached does not mean erased',11000,retire,'After a hypothetical policy decision, all January rows before February are eligible. Resolve dependent records and writers, detach January, verify the retained table, then drop only when authorised. A mid-January cutoff leaves ineligible rows, so this path stops before detachment.','Each remaining recovery or derived copy has its own required outcome.',actions([['whole','Cutoff: 1 February'],['partial','Cutoff: 15 January']])),
 deletion:makeScene('Track the whole removal request',13500,deletion,'The agreed scope includes the profile, retained versions, invoice PDF, search copy and backup copies. Database removal completes first. PDF removal succeeds, search removal fails then succeeds on retry. The request stays open until the remaining backup expiry is verified.','The drawing starts after an approved policy decision; it does not decide retention rights.')
};
