import { makeScene, svg, text, line, path, travel, ball, ring, phase, ease } from '../drawing.mjs';
const colours=['--blue','--blue','--gold','--purple','--purple'];
const tag=(x,y,value,c='--blue',r=19)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--color-surface)" stroke="var(${c})" stroke-width="1.7"/>`+text(x,y+6,value,18);
function flow(t,small) {
  const W=small?440:760,x=[W*.22,W*.5,W*.78],ordersY=90,linesY=255,totalY=425,resultY=590;
  const orders=[[x[0],ordersY],[x[1],ordersY],[x[2],ordersY]],items=x.map(xx=>[xx,linesY]),totals=[[W*.3,totalY],[W*.7,totalY]];
  let s=text(W/2,28,'Read three orders',24);
  ['101','102','103'].forEach((id,i)=>{s+=tag(...orders[i],id,['--blue','--gold','--purple'][i],23)+text(x[i],142,i===2?'pending':'paid',20);});
  s+=text(W/2,198,'Match the paid orders to their lines',small?21:24);
  const parents=[0,0,1],amounts=['4.50','35.00','40.00'];
  items.forEach((p,i)=>{
    const from=orders[parents[i]],a=.08+i*.08,b=a+.14;
    s+=path([from[0],from[1]+26],[p[0],p[1]-16],0,'--color-rule-strong')+travel(t,a,b,from,p,colours[i]);
    if(t>=b)s+=ball(...p,colours[i])+text(p[0],p[1]+46,amounts[i],23);
  });
  if(t>.2)s+=line(`M${x[2]-12} ${ordersY+68}h24`,'--color-text-secondary');
  s+=text(W/2,365,'Add within each customer',24);
  items.forEach((p,i)=>{const to=totals[i===2?1:0],a=.4+i*.08,b=a+.14;s+=path([p[0],p[1]+57],[to[0],to[1]-34],0,'--color-rule-strong')+travel(t,a,b,p,to,colours[i]);});
  s+=ring(...totals[0],'Mina',t>=.62?'39.50':t>=.54?'4.50':'—','--blue',39)+ring(...totals[1],'Tariq',t>=.7?'40.00':'—','--gold',39);
  s+=text(W/2,525,'Return the largest total first',24);
  const outputs=[[W*.3,resultY],[W*.7,resultY]];
  s+=travel(t,.77,.9,totals[1],outputs[0],'--gold')+travel(t,.77,.9,totals[0],outputs[1],'--blue');
  if(t>=.9){s+=ball(...outputs[0],'--gold')+ball(...outputs[1],'--blue')+text(outputs[0][0],resultY+45,'Tariq · 40.00',22)+text(outputs[1][0],resultY+45,'Mina · 39.50',22);}
  return svg(s,small,665);
}
function output(t,small,ends,Y=550) {
  const W=small?440:760,x=[W*.22,W*.5,W*.78];let s=line(`M30 ${Y-45}H${W-30}`,'--color-rule-strong')+text(W/2,Y-65,'Joined lines',23);
  ends.forEach((end,i)=>{if(t>=end)s+=ball(x[i],Y,colours[i])+text(x[i],Y+45,['101 / 1','101 / 2','102 / 1'][i],21)+text(x[i],Y+75,['4.50','35.00','40.00'][i],20,'--color-text-secondary');});
  return s;
}
function nested(t,small) {
  const W=small?440:760,L=W*.2,R=W*.75,y=[125,285,415];let s=text(L,40,'Orders',23)+text(R,40,'Line index',23);
  for(let i=0;i<3;i++){
    if(i<2)s+=tag(L,y[i],String(101+i),i?'--gold':'--blue',25);
    s+=ring(R,y[i],'',String(101+i),i===2?'--purple':i?'--gold':'--blue',30);
    const count=i===1?1:2;for(let j=0;j<count;j++)s+=ball(R+(j-(count-1)/2)*30,y[i]+55,i===2?'--purple':i?'--gold':'--blue');
    if(i<2)s+=path([L+25,y[i]],[R-30,y[i]],0,'--color-rule-strong');
  }
  [[.08,.25,0],[.43,.6,1]].forEach(([a,b,i])=>s+=travel(t,a,b,[L,y[i]],[R,y[i]],i?'--gold':'--blue'));
  const ends=[.38,.4,.75];
  [0,1,2].forEach(i=>s+=travel(t,i<2?.26:.61,ends[i],[R+(i<2?(i-.5)*30:0),y[i<2?0:1]+55],[W*[.22,.5,.78][i],550],colours[i]));
  s+=output(t,small,ends)+text(W/2,668,t<.43?'One order starts one lookup':'Two orders · two line lookups',small?22:25);
  return svg(s,small,700);
}
function hash(t,small) {
  const W=small?440:760,L=W*.2,R=W*.73,ys=[135,270,400];let s=text(L,38,'Line input',23)+text(R,38,'Hash table',23);
  s+=text(R,75,'Build from orders',18,'--color-text-secondary');
  for(let i=0;i<3;i++){
    s+=`<path d="M${R-41} ${ys[i]-25}V${ys[i]+25}Q${R-41} ${ys[i]+35} ${R-31} ${ys[i]+35}H${R+31}Q${R+41} ${ys[i]+35} ${R+41} ${ys[i]+25}V${ys[i]-25}" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.7"/>`;
    if(i<2&&t>=.16)s+=tag(R,ys[i],String(101+i),i?'--gold':'--blue');
    else if(i===2)s+=text(R,ys[i]+8,'Empty',20);
  }
  for(let i=0;i<2;i++)s+=travel(t,.01+i*.035,.12+i*.035,[R,75],[R,ys[i]],i?'--gold':'--blue');
  const groups=[0,0,1,2,2],ends=[];
  groups.forEach((group,i)=>{
    const a=.22+i*.115,b=a+.075,Y=ys[group]+(i===1||i===4?20:-20),from=[L,Y],to=[R,ys[group]];
    s+=tag(...from,String(101+group),colours[i],17)+path([L+20,Y],[R-42,ys[group]],0,'--color-rule-strong')+travel(t,a,b,from,to,colours[i]);
    if(i<3){const end=b+.055;ends.push(end);s+=travel(t,b,end,to,[W*[.22,.5,.78][i],550],colours[i]);}
    else if(t>=b)s+=text(L-30,Y+6,'×',23,'--color-text');
  });
  s+=output(t,small,ends)+text(W/2,668,'2 build rows · 5 line probes',small?22:25);
  return svg(s,small,700);
}
function merge(t,small) {
  const W=small?440:760,L=W*.24,R=W*.76,ys=[130,290,420];let s=text(L,40,'Ordered orders',small?20:23)+text(R,40,'Ordered lines',small?20:23);
  s+=line(`M${L} 80V445`,'--color-rule-strong')+line(`M${R} 80V445`,'--color-rule-strong');
  ys.forEach((y,i)=>{
    if(i<2)s+=tag(L,y,String(101+i),i?'--gold':'--blue',25);else s+=text(L,y+5,'End',21);
    s+=tag(R,y,String(101+i),i===0?'--blue':i===1?'--gold':'--purple',25);
    s+=text(R,y+52,i===1?'1 line':'2 lines',20,'--color-text-secondary');
    if(i<2)s+=path([L+25,y],[R-25,y],0,'--color-rule-strong');
  });
  const cursor=t<.46?0:t<.78?1:2,cy=ys[cursor];s+=text(L-48,cy+7,'›',32)+text(R-48,cy+7,'›',32);
  s+=travel(t,.08,.26,[L,ys[0]],[R,ys[0]],'--blue')+travel(t,.47,.62,[L,ys[1]],[R,ys[1]],'--gold');
  const ends=[.38,.42,.76];ends.forEach((end,i)=>s+=travel(t,i<2?.27:.63,end,[R,ys[i<2?0:1]],[W*[.22,.5,.78][i],550],colours[i]));
  s+=output(t,small,ends)+text(W/2,668,t<.78?'Match whole key groups':'Orders ended · remaining lines unread',small?21:25);
  return svg(s,small,700);
}
export const scenes={
 flow:makeScene('Three orders become two customer totals',14000,flow,'Orders 101 and 102 are paid; pending order 103 is excluded. Order 101 supplies two lines, 4.50 and 35.00, for Mina. Order 102 supplies one 40.00 line for Tariq. Grouping makes Mina 39.50 and Tariq 40.00. Sorting returns Tariq first, then Mina.','One illustrative execution. Every contributing line reaches its customer total before the final sort can return the largest.'),
 joins:makeScene('Three methods, the same matching lines',13500,(t,s,v='nested')=>({nested,hash,merge})[v](t,s),'Nested loop: order 101 looks up two lines, then order 102 looks up one. Hash join: build the two eligible order keys, then probe all five lines; the two lines for order 103 do not match. Merge join: advance through ordered 101 and 102 groups, preserving every matching occurrence; when orders end, remaining 103 lines need not be consumed. Each method emits the same three lines.','The nested loop assumes an indexed lookup. Hashing needs a build first. The merge assumes inputs already ordered by order ID. These are different preparations, not measured relative speeds.',{defaultVariant:'nested',actions:[{value:'nested',label:'Nested loop'},{value:'hash',label:'Hash join'},{value:'merge',label:'Merge join'}]})
};
