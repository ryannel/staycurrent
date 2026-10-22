import { example } from '../example.mjs';

export function clientToLocal(element, x, y) {
  if (![x,y].every(Number.isFinite)) return null;
  const raw = element.getScreenCTM();
  if (!raw || raw.is2D === false) return null;
  const matrix = DOMMatrix.fromMatrix(raw);
  if (!matrix.is2D || ![matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f].every(Number.isFinite)) return null;
  const undo = matrix.inverse();
  if (!undo.is2D || ![undo.a,undo.b,undo.c,undo.d,undo.e,undo.f].every(Number.isFinite)) return null;
  const p = new DOMPoint(x,y).matrixTransform(undo);
  return [p.x,p.y].every(Number.isFinite) ? p : null;
}

export function installEditor(host) {
  const svg=host.querySelector('[data-editor-svg]'), world=host.querySelector('[data-editor-world]'), group=host.querySelector('[data-editor-group]'), card=host.querySelector('[data-editor-card]');
  const readout=host.querySelector('[data-editor-readout]'), status=host.querySelector('[data-editor-status]'), mapping=host.querySelector('[data-editor-mapping]');
  const controls=Object.fromEntries(['zoom','angle','panX','panY'].map(key=>[key,host.querySelector(`[data-editor-${key}]`)]));
  let state={zoom:example.view.zoom,angle:0,panX:example.view.pan.x,panY:example.view.pan.y};
  const matrixValues=m=>[m.a,m.b,m.c,m.d,m.e,m.f];
  const display=n=>Number(n.toFixed(2));
  const cardMatrix=new DOMMatrix().translate(example.card.translation.x,example.card.translation.y);
  const groupMatrix=new DOMMatrix().translate(example.group.translation.x,example.group.translation.y).rotate(example.group.angle);
  const makeView=s=>new DOMMatrix().translate(s.panX,s.panY).rotate(s.angle).scale(s.zoom);
  const put=(el,m)=>el.setAttribute('transform',`matrix(${matrixValues(m).join(' ')})`);
  function render(candidate) {
    if (!Object.values(candidate).every(Number.isFinite) || candidate.zoom < example.zoomLimits.min || candidate.zoom > example.zoomLimits.max) {
      status.textContent='Cannot map this state; the last valid view is retained.';
      return false;
    }
    const view=makeView(candidate), inv=view.inverse();
    if (!matrixValues(inv).every(Number.isFinite)) return false;
    state={...candidate};put(world,view);put(group,groupMatrix);put(card,cardMatrix);
    for(const key of Object.keys(controls)) controls[key].value=String(state[key]);
    host.dataset.state=JSON.stringify(state);
    status.textContent=`View: zoom ${state.zoom}, angle ${state.angle}°, pan (${display(state.panX)}, ${display(state.panY)}).`;
    mapping.textContent='Use Check current mapping to compare the composed route with the browser after a change.';
    return true;
  }
  for(const [key,input] of Object.entries(controls)) input.addEventListener('input',()=>render({...state,[key]:input.valueAsNumber}));
  host.querySelector('[data-editor-reset]').addEventListener('click',()=>{host.querySelector('[data-editor-size]').checked=false;svg.style.width='100%';render({zoom:2,angle:0,panX:60,panY:40});readout.textContent='Move or tap within the SVG to test the card.';});
  host.querySelector('[data-editor-turn]').addEventListener('click',()=>{
    const m=new DOMMatrix().translate(example.svg.width/2,example.svg.height/2).rotate(90).translate(-example.svg.width/2,-example.svg.height/2).multiply(makeView({zoom:2,angle:0,panX:60,panY:40}));
    render({zoom:2,angle:90,panX:m.e,panY:m.f});
  });
  host.querySelector('[data-editor-anchor]').addEventListener('click',()=>{
    const anchor=new DOMPoint(example.p.x,example.p.y).matrixTransform(groupMatrix.multiply(cardMatrix));
    const target=anchor.matrixTransform(makeView(state));
    const zoom=Math.min(example.zoomLimits.max,state.zoom*example.gesture.anchorZoom/example.view.zoom);
    const scaled=anchor.matrixTransform(new DOMMatrix().rotate(state.angle).scale(zoom));
    render({...state,zoom,panX:target.x-scaled.x,panY:target.y-scaled.y});
  });
  host.querySelector('[data-editor-size]').addEventListener('change',event=>{svg.style.width=event.target.checked?'50%':'100%';mapping.textContent='The SVG size changed. Check the current mapping again.';});
  host.querySelector('[data-editor-check]').addEventListener('click',()=>{
    const rawBridge=svg.getScreenCTM(), rawMeasured=card.getScreenCTM();
    const shape=raw=>raw?{type:raw.constructor.name,is2D:raw.is2D===undefined?'absent':raw.is2D,coefficients:matrixValues(raw)}:null;
    const rawReturn={bridge:shape(rawBridge),card:shape(rawMeasured)};
    host.dataset.mappingReceipt=JSON.stringify({kind:'Browser return-shape diagnostic',rawReturn});
    if(!rawBridge || !rawMeasured || rawBridge.is2D===false || rawMeasured.is2D===false){mapping.textContent='A current 2D mapping is unavailable.';return;}
    const bridge=DOMMatrix.fromMatrix(rawBridge), measured=DOMMatrix.fromMatrix(rawMeasured);
    if(!bridge.is2D || !measured.is2D){mapping.textContent='A current 2D mapping is unavailable.';return;}
    const composed=bridge.multiply(makeView(state)).multiply(groupMatrix).multiply(cardMatrix);
    const actual=matrixValues(measured), expected=matrixValues(composed);
    if(![...actual,...expected].every(Number.isFinite)){mapping.textContent='A finite current mapping is unavailable.';return;}
    const clientMark=new DOMPoint(example.p.x,example.p.y).matrixTransform(measured);
    const recovered=clientToLocal(card,clientMark.x,clientMark.y);
    const difference=Math.max(...actual.map((x,i)=>Math.abs(x-expected[i])));
    const bounds=svg.getBoundingClientRect();
    const receipt={utc:new Date().toISOString(),kind:'Current browser API measurement, not the fixed bridge snapshot',rawReturn,state:{...state},viewport:{width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio},svgCSS:{width:bounds.width,height:bounds.height,left:bounds.left,top:bounds.top},bridge:matrixValues(bridge),actual,expected,maxCoefficientDifference:difference,clientMark:{x:clientMark.x,y:clientMark.y},recovered:recovered?{x:recovered.x,y:recovered.y}:null};
    host.dataset.mappingReceipt=JSON.stringify(receipt);
    mapping.textContent=`Browser O→C [${actual.map(display).join(', ')}]. Composed bridge × view × group × card differs by at most ${difference.toExponential(1)} per coefficient. Mark: actual C (${display(clientMark.x)}, ${display(clientMark.y)}), recovered O ${recovered?`(${display(recovered.x)}, ${display(recovered.y)})`:'unavailable'}.`;
  });
  function inspect(event) {
    const p=clientToLocal(card,event.clientX,event.clientY);
    if(!p){readout.textContent='Pointer cannot be mapped; last valid view retained.';return;}
    const hit=0<=p.x&&p.x<=example.card.width&&0<=p.y&&p.y<=example.card.height;
    readout.textContent=`Actual client C (${display(event.clientX)}, ${display(event.clientY)}) → card O (${display(p.x)}, ${display(p.y)}): ${hit?'inside':'outside'} Review’s filled rectangle.`;
  }
  svg.addEventListener('pointermove',inspect);svg.addEventListener('pointerdown',inspect);
  render(state);
  return { getState:()=>({...state}), render, clientToLocal:(x,y)=>clientToLocal(card,x,y) };
}
