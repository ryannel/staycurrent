import {text,line,path,travel,svg,ring,ball,phase,makeScene} from '../drawing.mjs';
import {actions,colours,labelLines,dot} from './core.mjs';
import {packages,filters,truthLabel} from '../../relational-rebuild-values/model.mjs';
import {lines,groups,frameIndices,money} from '../../relational-rebuild-aggregation/facts.mjs';
function filter(t,small,v){
 const W=small?440:760,L=65,M=W*.5,R=W-65,rule=filters.find(f=>f.key===v)||filters[0];let s=text(L,40,'Weight',22)+text(M,40,'Predicate',22)+text(R,40,'WHERE',22);
 packages.forEach((r,i)=>{const y=125+i*145,start=.06+i*.19,value=rule.values[i];s+=ring(L,y,r.id,r.weight===null?'NULL':r.weight+' g',colours[i],39)+path([L+40,y],[M,y])+path([M,y],[R,y],0,'--color-rule-strong');s+=travel(t,start,start+.13,[L+40,y],[M,y],colours[i]);if(t>start+.13)s+=text(M,y+6,truthLabel(value),21);if(value===true){s+=travel(t,start+.16,start+.31,[M,y],[R,y],colours[i]);if(t>start+.31)s+=ball(R,y,colours[i])+text(R,y+42,'Keep',20);}else if(t>start+.31)s+=text(R,y+6,'×',28)+text(R,y+42,'Leave out',20);});
 s+=text(W/2,555,'WHERE keeps only true.',25);return svg(s,small,590);
}
function joins(t,small,v){
 const W=small?440:760,L=65,R=W-85,lineMode=v==='lines',inputY=[120,280,440],output=lineMode?[[0,'101 · line 1'],[0,'101 · line 2'],[1,'102 · line 1'],[2,'103 · line 1'],[2,'103 · line 2']]:[[0,'101 · Mina'],[1,'102 · Tariq'],[2,'103 · Mina']];let s=text(L,40,'Orders',23)+text(R,40,'Result rows',23);
 inputY.forEach((y,i)=>s+=ring(L,y,'',String(101+i),colours[i],32));
 output.forEach(([i,label],j)=>{const y=105+j*(lineMode?90:165),start=.07+j*.78/output.length;s+=path([L+32,inputY[i]],[R-35,y],0,'--color-rule-strong')+travel(t,start,start+.12,[L+32,inputY[i]],[R-35,y],colours[i]);if(t>start+.12)s+=ball(R-35,y,colours[i])+text(R-15,y+35,label,small?18:22);});
 s+=text(W/2,590,t>.9?`${output.length} result rows from 3 orders`:'Each match contributes a result row',24);return svg(s,small,630);
}
function grouping(t,small,v){
 const W=small?440:760,L=70,R=W-90,gs=groups(v==='status'),sy=i=>90+i*110,gy=i=>90+i*(440/Math.max(1,gs.length-1));let s=text(L,30,'Order lines',22)+text(R,30,'Groups',22);
 lines.forEach((row,i)=>{const c=colours[['P3','P7','P9'].indexOf(row.product)],g=gs.findIndex(g=>g.rows.includes(row)),start=.07+i*.15;s+=dot(L,sy(i),String(row.quantity),c)+text(L,sy(i)+35,row.name,20)+path([L+20,sy(i)],[R-35,gy(g)],0,'--color-rule-strong')+travel(t,start,start+.14,[L+20,sy(i)],[R-35,gy(g)],c);});
 gs.forEach((g,j)=>{const count=g.rows.reduce((n,r)=>n+(t>.21+lines.indexOf(r)*.15?r.quantity:0),0),name={P3:'Tea',P7:'Mug',P9:'Teapot'}[g.product];s+=ring(R,gy(j),'',String(count),colours[['P3','P7','P9'].indexOf(g.product)],28)+text(R,gy(j)+48,name,21);if(v==='status')s+=text(R,gy(j)+73,g.rows[0].status,18);});
 s+=text(W/2,645,`${gs.length} groups from 5 lines`,24);return svg(s,small,680);
}
function frame(t,small,v){
 const W=small?440:760,L=small?45:80,R=W-L,step=Math.min(4,Math.floor(t*5)),indices=frameIndices(v,step),x=i=>L+i*(R-L)/4;let s=text(W/2,40,v==='whole'?'Whole partition':v==='rows'?'One row at a time':'Timestamp peers stay together',25);
 lines.forEach((r,i)=>{const included=indices.includes(i);s+=line(`M${x(i)} 110V330`,'--color-rule-strong');s+=dot(x(i),145,String(i+1),included?colours[i]:'--color-rule-strong');s+=text(x(i),210,money(r.cents),small?17:22)+text(x(i),250,r.day+' Oct',small?16:20);if(i===step)s+=text(x(i),95,'↓',27);if(included)s+=travel(t,step/5+.015,step/5+.15,[x(i),280],[W/2,380],colours[i]);});
 s+=ring(W/2,385,'Current row’s sum',money(indices.reduce((a,i)=>a+lines[i].cents,0)),'--teal',65);
 s+=labelLines(W/2,530,[`${indices.length} contributing ${indices.length===1?'line':'lines'}`,v==='default'?'Equal timestamps share the frame end.':v==='rows'?'The complete order identifies the current row.':'Every line contributes to every result.']);return svg(s,small,605);
}
export const scenes={
 filter:makeScene('A missing measurement is not zero',12000,filter,filters.map(f=>f.label+': '+f.explanation+' '+packages.map((p,i)=>p.id+' '+truthLabel(f.values[i])).join('; ')).join(' '),'The drawing explains logical results, not a physical execution order.',actions(filters.map(f=>[f.key,f.label]))),
 join:makeScene('One row for each match',11000,joins,'With customers, orders 101, 102 and 103 each have one match, giving Mina, Tariq and Mina. With lines, orders 101 and 103 each contribute two rows and order 102 contributes one, giving five result rows.','The input records stay in place. The result’s row meaning depends on the join.',actions([['customer','Attach customer'],['lines','Attach order lines']])),
 group:makeScene('Five lines become summaries',11500,grouping,'By product, tea has three units in two lines, mugs three in two lines and teapot one in one line. Adding status creates five groups: tea paid one, tea pending two, mug paid two, mug pending one and teapot paid one.','Each moving dot contributes its quantity to one group.',actions([['product','Group by product'],['status','Product and status']])),
 frame:makeScene('Which rows contribute now?',16000,frame,'The five line values are 4.50, 35.00, 40.00, 20.00 and 9.00. The default timestamp RANGE sums are 39.50,39.50,79.50,108.50,108.50. A fully ordered cumulative ROWS frame gives 4.50,39.50,79.50,99.50,108.50. The whole partition gives 108.50 for each row.','The arrow identifies the current row; coloured records contribute to its sum.',actions([['default','Timestamp RANGE'],['rows','Cumulative ROWS'],['whole','Whole partition']]))
};
