import {text,line,path,travel,svg,ring,ball,phase,ease,makeScene} from '../drawing.mjs';
import {actions,colours,labelLines,dot} from './core.mjs';
import {startingRows,mutations,nextIds,isAfter} from '../../relational-rebuild-pagination/data.mjs';
function order(t,small,v,mode){
 const W=small?440:760,L=80,R=W-80,scenario=mutations[v],changed=t>.2,rows=changed?scenario.rows:startingRows,ids=nextIds(rows,mode),p=ease(phase(t,.2,.48));let s=text(W/2,40,'Page 1 already returned: 202, 201',23);
 const all=[...new Set([...startingRows,...scenario.rows].map(r=>r.id))],yFor=i=>125+i*72;
 all.forEach(id=>{const before=startingRows.findIndex(r=>r.id===id),after=scenario.rows.findIndex(r=>r.id===id),from=before<0?65:yFor(before),to=after<0?65:yFor(after),y=from+(to-from)*p,opacity=before<0?p:after<0?1-p:1;if(opacity<=0)return;s+=`<g opacity="${opacity}">`+dot(L,y,String(id),ids.includes(id)&&t>.65?'--teal':'--blue',23)+text(L+50,y+7,rows.find(r=>r.id===id)?.short||startingRows.find(r=>r.id===id)?.short,small?18:23,'--color-text','start')+'</g>';});
 const cut=mode==='offset'?2:Math.max(0,rows.findIndex(isAfter));const boundary=yFor(cut)-36;
 if(t>.5)s+=line(`M35 ${boundary}H${W-35}`,'--coral','stroke-dasharray="4 6"')+text(R,boundary-12,mode==='offset'?'Skip 2':'After key',19);
 if(t>.7)s+=labelLines(W/2,625,[`Next page: ${ids.join(', ')}`,v==='forward'?'Unread 103 moved before the saved key.':v==='backward'?'Already-read 202 moved after the key.':mode==='offset'?(v==='insert'?'201 repeats.':'103 is skipped.'):'The saved key still leads to 103, 102.']);
 else s+=labelLines(W/2,625,[changed?({insert:'New order 203 arrives before the boundary.',delete:'Already-read order 202 is removed.',forward:'Unread order 103 moves before the key.',backward:'Already-read order 202 moves after the key.'}[v]):'The list is about to change.']);return svg(s,small,705);
}
function snapshots(t,small,v){
 const W=small?440:760,L=W*.25,R=W*.75,first=t>.25,second=t>.7,change=t>.45,ids=[202,201,103,102,101],ys=[100,200,300,400,500];let s=text(L,35,'Database now',22)+text(R,35,'Exported values',22);
 ids.forEach((id,i)=>{const state=i<2?'pending':i===2?(change?'paid':'pending'):'paid',copied=i<2?first:second;let exportState=i===2&&v==='fixed'?'pending':state;s+=dot(L,ys[i],String(id),state==='paid'?'--teal':'--gold',22)+text(L,ys[i]+39,state,20);if(copied)s+=dot(R,ys[i],String(id),exportState==='paid'?'--teal':'--gold',22)+text(R,ys[i]+39,exportState,20);s+=travel(t,i<2?.08:.52,i<2?.25:.7,[L,ys[i]],[R,ys[i]],exportState==='paid'?'--teal':'--gold');});
 s+=labelLines(W/2,615,[v==='fixed'?'Every batch uses the first snapshot.':'Later batches get fresh snapshots.',second?`Order 103 was copied as ${v==='fixed'?'pending':'paid'}.`:'Order 103 changes between batches.']);return svg(s,small,690);
}
const pagination=(mode,opts)=>makeScene(mode==='offset'?'The numbered boundary moves':'The key stays fixed; rows can move',11000,(t,s,v)=>order(t,s,v,mode),opts.map(v=>mutations[v].label+': '+mutations[v][mode]).join(' '),'These are results from successive queries, not the engine’s physical execution.',actions(opts.map(v=>[v,mutations[v].label])));
export const scenes={
 offset:pagination('offset',['insert','delete']),
 keyset:pagination('keyset',['delete','insert','forward','backward']),
 snapshots:makeScene('Which version enters the export?',11500,snapshots,'The first batch copies pending orders 202 and 201. Another transaction commits order 103 as paid. The next batch reads 103 and 102. With fresh Read Committed snapshots 103 is copied as paid; with the first Repeatable Read snapshot it remains pending in the export. Both finish with order 101 paid.','A keyset boundary protects position, not the values in an earlier snapshot.',actions([['fresh','Fresh snapshots'],['fixed','One snapshot']]))
};
