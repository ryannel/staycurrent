import { makeScene,svg,text,line,path,travel,app,server,database,ring,ball,phase,ease,note } from '../drawing.mjs';
const W=s=>s?440:760;
const actions=(values,labels)=>({defaultVariant:values[0],actions:values.map((value,i)=>({value,label:labels[i]}))});
const cross=(x,y)=>line(`M${x-13} ${y-13}L${x+13} ${y+13}M${x-13} ${y+13}L${x+13} ${y-13}`,'--coral');
const gate=(x,y,open)=>line(open?`M${x} ${y-25}L${x+30} ${y-45}`:`M${x} ${y-25}V${y+25}`,open?'--teal':'--coral');
const pill=(x,y,value,c='--blue',w=110)=>`<rect x="${x-w/2}" y="${y-23}" width="${w}" height="46" rx="23" fill="var(--color-surface)" stroke="var(${c})" stroke-width="1.6"/>`+text(x,y+7,value,22);

function rollout(t,small){
 const w=W(small),A=[65,240],O=[w-90,145],N=[w-90,355],stage=Math.min(5,Math.floor(t*6)),both=stage>=2&&stage<5;let s=app(...A,'Callers');
 s+=path(A,O,0,stage===5?'--color-rule-strong':'--color-text-secondary')+path(A,N,0,stage>=2?'--color-text-secondary':'--color-rule-strong');
 s+=pill(...O,stage===5?'Removed':'20.00',stage===5?'--color-text-secondary':'--blue')+text(O[0],O[1]+55,'price',22);
 s+=pill(...N,stage<1?'Absent':stage<3?'NULL':'2000',stage<1?'--color-text-secondary':'--gold')+text(N[0],N[1]+55,'hundredths',22);
 for(let i=0;i<5;i++){const a=i*.16+.02,b=a+.12,target=i<4?O:N;s+=travel(t,a,b,A,target,i<4?'--blue':'--gold');if(i>=2)s+=travel(t,a,b,A,N,'--gold');}
 s+=text(w/2,45,['Old callers','Add the field','Bridge writers','Backfill and check','Switch reads','Retire the old field'][stage],26);
 s+=note(w/2,470,stage<2?['Old reads and writes remain valid']:both?['Write both atomically',stage<4?'Keep reads on the old field':'Keep the return path current']:['End the old dependencies','Then remove the old field'],small);
 return svg(s,small,550);
}
function race(t,small,v){
 const w=W(small),A=[w*.2,130],B=[w*.8,130],D=[w*.5,370],updated=t>.43,write=t>.83,stale=v==='stale';let s=path(A,D)+path(B,D)+server(...A,'Backfill worker')+server(...B,'Bridge writer')+database(...D,'Product');
 s+=travel(t,.04,.16,A,D,'--blue')+travel(t,.17,.3,D,A,'--blue')+travel(t,.32,.43,B,D,'--gold')+travel(t,.65,.83,A,D,stale?'--coral':'--blue');
 if(t>=.3)s+=text(A[0],225,'Remembers 2000',20);
 s+=text(D[0],D[1]+106,updated?`22.00 / ${write&&stale?'2000':'2200'}`:'20.00 / NULL',25);
 if(write&&v==='guard')s+=cross(D[0]-55,D[1]);
 s+=note(w/2,545,write?(stale?['A stale overwrite breaks agreement']:v==='guard'?['Guard fails · zero rows changed','Re-read before retrying']:['Convert the protected current value','2200 remains correct']):['A remembered value is not a lock'],small);
 return svg(s,small,615);
}
function cursor(t,small,v){
 const w=W(small),xs=[w*.15,w*.38,w*.61,w*.84],start=xs[1],end=xs[3],p=phase(t,.38,.76),x=start+(end-start)*ease(p),old=v==='old';let s=text(w/2,40,'Scan in text-key order',25)+line(`M${xs[0]} 170H${xs[3]}`);
 ['P11','P3','P7','P9'].forEach((key,i)=>{if(i===0&&t<.24)return;const filled=i===0?!old:i===1||x>=xs[i];s+=ring(xs[i],170,'',key,filled?'--teal':'--color-text-secondary',29);s+=text(xs[i],235,filled?['800','450','2000','3500'][i]:'NULL',20);});
 s+=line(`M${x} 105V130`,'--gold')+ball(x,95,'--gold');
 if(t>.24)s+=text(xs[0],292,'Late insert',20)+text(xs[0],319,'Behind cursor',18);
 s+=note(w/2,395,t<.24?['P3 committed; the cursor advances']:t<.76?['A new row can arrive behind the cursor']:old?['Scan finished · one missing value','Do not switch reads']:['Scan finished · all values agree','The bridge already filled the late row'],small);
 return svg(s,small,470);
}
function indexBuild(t,small){
 const w=W(small),L=w*.23,R=w*.77,ys=[150,245,340],stage=Math.min(6,Math.floor(t*7)),count=stage<3?0:stage<5?2:3,updated=stage>=4;let s=text(L,45,'Primary rows',24)+text(R,45,'New price index',24);
 ys.forEach((y,i)=>{const value=[4.5,updated?22:20,35][i];s+=ball(L,y,['--blue','--gold','--purple'][i])+text(L,y+40,`${value.toFixed(2)}`,22)+path([L,y],[R,y],0,'--color-rule-strong');if(i<count)s+=pill(R,y,`${value.toFixed(2)}`,['--blue','--gold','--purple'][i],92);const a=[.4,.46,.72][i];s+=travel(t,a,a+.12,[L,y],[R,y],['--blue','--gold','--purple'][i]);});
 if(updated)s+=text(w/2,245,'20 → 22',19);
 s+=gate(R,420,stage===6)+text(R,475,stage===6?'Reads allowed':'Closed to reads',21);
 s+=text(w/2,550,['Index absent','Allow deletion first','Maintain new writes','Backfill existing rows','Keep up with the price change','Finish and validate','Index is public'][stage],small?21:25);
 return svg(s,small,590);
}
function loyalty(t,small){
 const w=W(small),A=[w*.23,170],B=[w*.77,170],I=[w*.5,380],fixed=t>.4,built=t>.7;let s=path(A,I)+path(B,I)+ring(...A,'Mina','TEA-7','--blue',48)+ring(...B,'Tariq',fixed?'NULL':'TEA-7','--gold',48)+ring(...I,'Unique index',built?'TEA-7':'','--teal',50);
 s+=travel(t,.04,.2,A,I,'--blue')+travel(t,.08,.24,B,I,'--gold');if(t>.24&&t<.4)s+=cross(...I);
 s+=travel(t,.47,.68,A,I,'--blue')+travel(t,.77,.9,B,I,'--gold','TEA-7');if(t>.76)s+=text(B[0],B[1]+105,'Try TEA-7',20);if(t>.9)s+=cross(I[0]+65,I[1]);
 s+=note(w/2,510,t<.24?['Two customers have the same code']:t<.4?['Build fails · rule not established']:t<.7?['Correct the mistaken assignment','Unassigned customers can remain NULL']:['New index built','A later duplicate write is rejected'],small);
 return svg(s,small,585);
}
function upgrade(t,small,v){
 const back=v==='return',w=W(small),xs=[w*.18,w*.5,w*.82],n=Math.min(3,Math.floor(t/.14)),returned=back&&t>.66?Math.min(3,Math.floor((t-.66)/.1)+1):0,finalising=!back&&t>.73,finalised=!back&&t>.9;let s='';
 xs.forEach((x,i)=>{const fresh=i<n&&i>=returned;s+=server(x,145,['A','B','C'][i],fresh?'--teal':'--color-text-secondary')+text(x,245,fresh?'26.2.8':'26.1.8',22);const a=.04+i*.14;s+=travel(t,a,a+.1,[x,55],[x,145],'--teal');if(back)s+=travel(t,.66+i*.1,.74+i*.1,[x,145],[x,55],'--blue');});
 s+=text(w/2,35,'Node binaries',24)+line(`M35 300H${w-35}`)+text(w/2,350,'Active cluster version',22)+text(w/2,395,finalised?'26.2':finalising?'26.1 · migrations running':'26.1',small?25:30);
 s+=text(w/2,465,`Catalogue price: ${t>.58?'£22':'£20'}`,24);
 s+=note(w/2,535,back&&t>.66?['Returning software keeps committed data']:finalising?['Old-binary return is closed']:['Finalisation held','New binaries do not advance this version'],small);
 return svg(s,small,610);
}
function handover(t,small,v,reverse=false){
 const w=W(small),A=[w/2,65],L=[w*.22,290],R=[w*.78,290],source=reverse?R:L,dest=reverse?L:R,closed=t>.18,copy=t>.4,accepted=t>.69,open=t>.82,updated=!reverse&&t>.94;
 let s=app(...A)+path(A,L,0,!reverse&&!closed||reverse&&open?'--color-text-secondary':'--color-rule-strong')+path(A,R,0,reverse&&!closed||!reverse&&open?'--color-text-secondary':'--color-rule-strong')+path(source,dest,80);
 s+=database(...L,reverse?'Fresh PostgreSQL':'PostgreSQL',reverse?(copy?'103':'—'):'—')+database(...R,'CockroachDB',reverse||updated?'103':'—');
 s+=gate((A[0]+L[0])/2,170,!reverse&&!closed||reverse&&open)+gate((A[0]+R[0])/2,170,reverse&&!closed||!reverse&&open);
 for(let i=0;i<3;i++)s+=travel(t,.32+i*.06,.49+i*.06,source,dest,['--blue','--gold','--purple'][i],'',80);
 if(open)s+=travel(t,.85,.95,A,dest,'--coral');
 s+=text(w/2,450,t<.18?'One authority admits work':t<.32?'Close admission and drain':t<.69?'Copy the complete final state':t<.82?'Accept the excluded candidate':'Record authority, then move callers',small?21:25);
 if(reverse){s+=line(`M30 490H${w-30}`)+text(w/2,535,'Original PostgreSQL stays closed',22)+text(w/2,570,'Separate · stale · no purchase 103',20);}
 else if(updated)s+=note(w/2,525,['Target accepts purchase 103','The old source is now stale'],small);
 return svg(s,small,reverse?610:605);
}
export const scenes={
 rollout:makeScene('Keep a working route through the change',15000,rollout,'Start with price. Add nullable price_hundredths, deploy bridge writers that write both atomically and drain every old writer. Backfill and reconcile while reads use price. Switch reads while both forms stay maintained. Retire old dependencies and return targets before removing price.','Changing stored fields and changing their callers are separate parts of one migration.'),
 race:makeScene('The row changes while the worker remembers',13000,race,'A worker reads 20.00 and remembers 2000. A bridge writer commits 22.00 and 2200. An unguarded remembered assignment overwrites 2200 with 2000. Guarding on price 20.00 affects zero rows and requires a reread. Converting the current protected value leaves 2200 correct.','The three writes share the same event order; timing is illustrative.',actions(['stale','guard','current'],['Earlier value','Source-value guard','Current value'])),
 cursor:makeScene('The cursor can pass a new arrival',11000,cursor,'The committed cursor is P3. A late P11 sorts before it in text order, so the remaining scan of P7 and P9 never visits P11. A bridge insert already fills 800; an old-only insert leaves NULL. Whole-population reconciliation finds the missing value after the scan ends.','Here the keys matter: the trap is their text ordering.',actions(['bridge','old'],['Bridge insert','Old-only insert'])),
 index:makeScene('Build the index before letting readers in',16000,indexBuild,'The new index gains deletion support before write support. Backfill copies the existing product entries while foreground writes maintain it. The mug changes from £20 to £22, updating its entry. Only after completion and validation is the index made public to readers.','Index availability follows a protocol; a partially built index cannot answer the complete query.'),
 loyalty:makeScene('A new rule must fit the existing rows',13000,loyalty,'Mina and Tariq initially share the assigned code TEA-7, so the unique-index build fails. After the shop confirms Tariq’s assignment is mistaken, it is cleared to NULL and a fresh build succeeds. Unassigned customers may share NULL. A later conflicting assignment is rejected.','A failed schema build does not decide which business value to correct.'),
 upgrade:makeScene('Three binaries, one cluster version',18000,upgrade,'Nodes A, B and C roll from v26.1.8 to v26.2.8 while active cluster version stays 26.1. A later catalogue update commits £22. Before finalisation, a rolling binary return keeps that data. Once finalisation begins, the old-binary return closes before the final 26.2 version is reported.','A supported transition model. The intermediate migration stage was observed; completion is documentation-backed, not a captured timing trace.',actions(['finalise','return'],['Finalise','Return before finalisation'])),
 forward:makeScene('Close the source before opening the target',17000,(t,s,v)=>handover(t,s,v,false),'PostgreSQL is the sole writer. Admission and dispatch close and admitted work drains. One complete final snapshot is loaded into an excluded CockroachDB candidate. Acceptance precedes a recorded transfer of authority. After the target accepts purchase 103, reopening the unchanged old source would lose accepted work.','A deliberately paused handover. Controlled acceptance never grants two live application writing paths.'),
 return:makeScene('Bring the accepted purchase back',17000,(t,s,v)=>handover(t,s,v,true),'CockroachDB holds accepted purchase 103 and its request and durable-work identities. Close its admission and dispatch, drain and copy the complete compatible final state into a fresh PostgreSQL candidate. Accept, record authority and then reopen. The original stale PostgreSQL database stays separate and closed.','A return assumes a readable source and data that fits the reviewed PostgreSQL contract.')
};
