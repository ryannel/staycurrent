import {text,path,travel,svg,ring,ball,makeScene} from '../drawing.mjs';
import {actions,labelLines} from './core.mjs';
import {definitions,scene} from '../../relational-rebuild-hierarchies/model.mjs';
function recursion(t,small,v){
 const W=small?440:760,x=W/2,ys=[75,210,345,480],labels=['Catalogue','Teaware','Mugs','Blue mugs'],route=v==='up'?[3,2,1,0]:[1,2,3],reached=route.slice(0,Math.min(route.length,1+Math.floor(t*4)));let s='';
 ys.forEach((y,i)=>{if(i)s+=path([x,ys[i-1]+35],[x,y-35]);s+=ring(x,y,labels[i],String([0,10,11,12][i]),reached.includes(i)?'--teal':'--color-text-secondary',31);});
 route.slice(1).forEach((idx,i)=>s+=travel(t,.12+i*.23,.33+i*.23,[x,ys[route[i]]],[x,ys[idx]],'--teal'));
 s+=labelLines(W/2,600,t>.83?['No next working rows.','Keep every row already reached.']:['One generation becomes the next.']);return svg(s,small,675);
}
function race(t,small,v){
 const W=small?440:760,A=[W*.25,210],B=[W*.75,210],safe=v==='safe';let s=ring(...A,'Teaware','10','--blue',40)+ring(...B,'Gifts','20','--gold',40)+text(W/2,65,'Opposite moves, separate checks',23);
 if(t>.2)s+=path(A,B,-95)+travel(t,.22,.43,A,B,'--blue','',-95);
 if(t>.5&&!safe)s+=path(B,A,100,'--coral')+travel(t,.52,.75,B,A,'--gold','',100);
 if(safe&&t>.5)s+=text(W/2,330,'B reads after A commits',22);
 s+=labelLines(W/2,430,t>.8?(safe?['Teaware is now inside Gifts.','The opposite move is rejected.']:['Both parent changes committed.','Following parents now loops.']):[safe?'Take the topology lock before reading.':'Both checks pass against the old tree.']);return svg(s,small,520);
}
const make=(kind,draw)=>{const d=definitions[kind];return makeScene(d.title,11000,draw,d.options.map(([v,l])=>l+': '+Array.from({length:d.steps},(_,i)=>scene(kind,v,i).explanation).join(' ')).join(' '),'Working sets and concurrency are illustrated, not measured execution traces.',actions(d.options));};
export const scenes={recursion:make('recursion',recursion),race:make('race',race)};
