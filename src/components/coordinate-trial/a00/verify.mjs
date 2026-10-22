import assert from 'node:assert/strict';
import {example} from '../example.mjs';
import {translation,rotation,scale,compose,point,displacement,inverse,determinant,about,viewMatrix} from '../geometry.mjs';
import {route,cardWorld,cardView,cardClient,turnView,collapsedClient,orderState,pivotState,corners} from './model.mjs';
let checks=0;
function close(actual,expected,label){assert.equal(actual.length,expected.length,label);actual.forEach((x,i)=>assert.ok(Math.abs(x-expected[i])<1e-9,`${label}[${i}]: ${x} != ${expected[i]}`));checks++;}
const xy=p=>[p.x,p.y];
close(route().flatMap(xy),[10,10,40,30,130,140,320,320,440,400],'forward route');
close(route(example.q).flatMap(xy),[20,10,50,30,130,150,320,340,440,420],'second route');
close(cardWorld,[0,1,-1,0,140,130],'O to W');
close(cardView,[0,2,-2,0,340,300],'O to V');
close(cardClient,[0,2,-2,0,460,380],'O to C');
close(xy(point(inverse(cardClient),{x:440,y:400})),[10,10],'inverse baseline');
close(xy(displacement(cardClient,{x:10,y:0})),[0,20],'step ignores translation');
close(corners.flatMap(p=>xy(point(cardView,p))),[340,300,340,460,260,460,260,300],'corners');
close(turnView,[0,2,-2,0,660,-40],'centre-turned view');
close(xy(point(turnView,{x:130,y:140})),[380,220],'turned point');
close(xy(orderState(2,false).point),[320,320],'normal order');
close(xy(orderState(2,true).point),[380,360],'swapped order');
close(xy(pivotState(true).centre),[70,40],'centre pivot');
close(xy(pivotState(false).centre),[10,60],'origin pivot');
close(xy(point(collapsedClient,example.p)),[440,320],'collapsed p');
close(xy(point(collapsedClient,example.q)),[440,320],'collapsed q');
assert.equal(determinant(collapsedClient),0);assert.equal(inverse(collapsedClient),null);checks+=2;
assert.equal(inverse([1,0,0,1,NaN,0]),null);checks++;
close(xy(point(compose(translation(120,80),scale(.5),cardView),example.p)),[280,240],'half-size bridge');
close(xy(point(viewMatrix({zoom:3,angle:0,pan:{x:-70,y:-100}}),{x:130,y:140})),[320,320],'anchor zoom');
assert.equal(determinant(scale(-1,1)),-1);assert.ok(inverse(scale(-1,1)));checks++;
for(const angle of [-170,-45,0,30,90,123])for(const z of [.25,1,2,4]){
 const m=compose(translation(120,80),viewMatrix({zoom:z,angle,pan:{x:60,y:40}}),cardWorld);
 for(const p of [example.p,example.q,...corners])close(xy(point(inverse(m),point(m,p))),xy(p),`round trip ${angle}/${z}`);
 const pivot=example.card.centre;close(xy(point(about(pivot,angle),pivot)),xy(pivot),`pivot ${angle}/${z}`);
}
console.log(JSON.stringify({kind:'mathematical model checks; no browser execution',utc:new Date().toISOString(),checks,baseline:{cardWorld,cardView,cardClient},tolerance:1e-9},null,2));
