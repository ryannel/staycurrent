import {text,line,path,travel,svg,ring,ball,phase,ease,makeScene} from '../drawing.mjs';
import {actions,colours,labelLines,dot} from './core.mjs';
import {split,offer} from './modelling.mjs';
import {figures} from '../../relational-rebuild-normalisation/scenes.mjs';
function closure(t,small,v){
 const W=small?440:760,O=[W*.25,90],L=[W*.75,90],C=[W*.25,275],N=[W*.25,440],P=[W*.75,275];const full=v==='0',customer=v==='2';
 let s=path(O,C)+path(C,N)+path(L,P)+path(O,P)+ring(...O,'Order','O',customer?'--color-text-secondary':'--blue')+ring(...L,'Line','L',full?'--gold':'--color-text-secondary')+ring(...C,'Customer','C',customer||t>.4?'--purple':'--color-text-secondary')+ring(...N,'Name','N',t>.7?'--purple':'--color-text-secondary')+ring(...P,'Line facts','P Q U',full&&t>.4?'--teal':'--color-text-secondary',45);
 if(!customer)s+=travel(t,.12,.4,O,C,'--blue');if(full)s+=travel(t,.12,.4,L,P,'--gold')+travel(t,.12,.4,O,P,'--blue');s+=travel(t,customer?.12:.43,customer?.4:.7,C,N,'--purple');
 s+=labelLines(W/2,560,t>.8?[full?'7 of 7 attributes reached.':customer?'2 of 7 attributes reached.':'3 of 7 attributes reached.',full?'Order + line is a candidate key.':'This starting set is not a superkey.']:['Follow a rule only when its left side is known.']);return svg(s,small,635);
}
function chase(t,small){
 const W=small?440:760,left=small?38:100,step=(W-2*left)/3,x=[0,1,2,3].map(i=>left+i*step),y=[150,270,390],headers=['Order','Line','Customer','Name'],customer=t>.32,name=t>.65;let s='';
 headers.forEach((h,i)=>s+=text(x[i],70,h,small?18:22));
 const rows=[['aO','aL',customer?'aC':'b1C',name?'aN':'b1N'],['aO','b2L','aC',name?'aN':'b2N'],['b3O','b3L','aC','aN']];
 rows.forEach((r,i)=>{s+=line(`M20 ${y[i]+47}H${W-20}`,'--color-rule-strong');r.forEach((v,j)=>s+=dot(x[j],y[i],v,v.startsWith('a')?'--teal':'--purple',22));});
 s+=travel(t,.1,.32,[x[2],y[1]],[x[2],y[0]],'--teal')+travel(t,.4,.65,[x[3],y[2]],[x[3],y[0]],'--teal')+travel(t,.4,.65,[x[3],y[2]],[x[3],y[1]],'--teal');
 s+=labelLines(W/2,515,name?['The first row is entirely a-symbols.','That row is the lossless-join witness.']:customer?['Customer determines name.']:['Order determines customer.']);return svg(s,small,595);
}
function advice(t,small){
 const W=small?440:760,C=[W/2,75],A=[W*.23,260],B=[W*.77,260],both=t>.6;let s=ring(...C,'Customer','1','--purple')+ring(...A,'Iris','Green','--blue',42)+ring(...B,'Oren','Green','--gold',42)+path(C,A)+travel(t,.12,.35,C,A,'--blue');
 if(t>.42)s+=path(C,B,0,'--coral')+travel(t,.43,.6,C,B,'--gold');
 s+=labelLines(W/2,405,both?['Both local keys are valid.','Customer 1 has two green-tea advisers.']:['Adviser determines tea style.']);return svg(s,small,500);
}
function synthesis(t,small){
 const W=small?440:760,ys=[225,390,555],labels=[['O L','P Q U','Line facts'],['O','C','Order'],['C','N','Customer']],L=W*.25,R=W*.75;
 const reduced=t>=.22,redundant=t>=.4;
 let s=text(W/2,25,'Two extra written rules',23);
 s+=text(W*.25,68,reduced?'O → C':'O L → C',23)+text(W*.75,68,'O → N',23,redundant?'--color-text-secondary':'--color-text');
 if(reduced)s+=text(W*.25,105,'L adds nothing',19,'--color-text-secondary');
 if(redundant)s+=line(`M${W*.75-43} 61H${W*.75+43}`,'--coral')+text(W*.75,105,'Follows through C',19,'--color-text-secondary');
 labels.forEach(([a,b,home],i)=>{const start=.46+i*.14;s+=text(W/2,ys[i]-55,home,24)+path([L,ys[i]],[R,ys[i]])+ring(L,ys[i],'',a,colours[i],38)+ring(R,ys[i],'',b,colours[i],43);s+=travel(t,start,start+.12,[L,ys[i]],[R,ys[i]],colours[i]);if(t>start+.12)s+=line(`M${L-43} ${ys[i]+65}H${R+45}`,'--teal');});
 s+=labelLines(W/2,695,t<.22?['O → C already holds.']:t<.4?['O → C and C → N also give O → N.']:['Each minimal-cover rule has a home.','The line relation contains the key OL.']);return svg(s,small,765);
}
function mvd(t,small){
 const W=small?440:760,x=[W*.3,W*.75],y=[155,330];let s=text(x[0],55,'Supplier 1',22)+text(x[1],55,'Supplier 2',22)+text(22,155,'Gift',20,'--color-text','start')+text(22,330,'Ceramic',20,'--color-text','start');
 x.forEach(xx=>s+=line(`M${xx} 100V370`,'--color-rule-strong'));y.forEach(yy=>s+=line(`M${x[0]-25} ${yy}H${x[1]+25}`,'--color-rule-strong'));
 s+=ball(x[0],y[0],'--blue')+ball(x[1],y[1],'--gold')+travel(t,.2,.5,[x[0],y[0]],[x[1],y[0]],'--blue')+travel(t,.2,.5,[x[1],y[1]],[x[0],y[1]],'--gold');if(t>.5)s+=ball(x[1],y[0],'--blue')+ball(x[0],y[1],'--gold');
 s+=labelLines(W/2,450,t>.55?['Independence requires all four corners.','Two membership lists are enough.']:['Two selected combinations.']);return svg(s,small,535);
}
const spec=(kind,draw,extra={})=>{const f=figures[kind];return makeScene(f.title,11000,draw,f.cases.map(c=>c.label+': '+c.stages.map(s=>s.explanation).join(' ')).join(' '),f.caption,extra);};
export const scenes={
 closure:spec('closure',closure,actions([['0','Order + line'],['1','Order only'],['2','Customer only']])),
 loss:spec('loss',(t,s)=>split(t,s,'unsafe')),
 chase:spec('chase',chase),
 advice:spec('advice',advice),
 synthesis:spec('synthesis',synthesis),
 mvd:spec('mvd',mvd),
 jd:spec('jd',offer,actions([['actual','Actual offers'],['approval','Pairwise approval policy']]))
};
