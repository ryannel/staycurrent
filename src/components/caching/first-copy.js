import { reuseTrace, cacheCost, copyAt, requestJourney } from './first-copy-model.mjs';

for (const root of document.querySelectorAll('[data-first-copy]')) {
  const kind = root.dataset.firstCopy;
  const get = name => root.querySelector(`[data-${name}]`);
  const put = (name, text) => { const el=get(name); if(el && el.textContent !== text) el.textContent=text; };
  const progress = get('progress');
  const play = get('play');
  let warm=false, frame=0, playing=false, last=0, clock=0;
  function stop() {
    playing=false; cancelAnimationFrame(frame);
    if(play) { play.textContent=kind==='journey'?'Play request':kind==='reuse'?'Play requests':'Play time'; play.setAttribute('aria-pressed','false'); }
  }
  function render() {
    if(kind==='journey') {
      const steps=requestJourney(warm), amount=Number(progress.value)/1000*steps.length;
      const index=Math.min(steps.length-1,Math.floor(amount)), part=amount>=steps.length?1:amount-index;
      const step=steps[index], positions={reader:[65,170],app:[240,170],cache:[420,70],source:[420,270]};
      const a=positions[step.from], b=positions[step.to];
      get('route').setAttribute('d',`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`);
      get('parcel').setAttribute('cx',String(a[0]+(b[0]-a[0])*part));
      get('parcel').setAttribute('cy',String(a[1]+(b[1]-a[1])*part));
      get('parcel').setAttribute('visibility',amount===steps.length?'hidden':'visible');
      const filled=warm||amount>=6;
      put('cache',filled?'€18':'empty'); get('cache-box').classList.toggle('cached',filled);
      put('app',amount>=(warm?3:5)?'€18':'—'); put('reader',amount===steps.length?'€18':'?');
      put('status',amount===steps.length?`Request complete · ${warm?'0 catalogue reads; the copy supplied the answer.':'1 catalogue read; a copy is ready for another request.'}`:`${index+1} / ${steps.length} · ${step.label}.`);
    } else if(kind==='reuse') {
      const distinct=Number(get('distinct').value), count=Number(progress.value), trace=reuseTrace(distinct);
      put('distinct-value',String(distinct));
      root.querySelectorAll('[data-cell]').forEach((cell,i)=>{
        cell.querySelector('b').textContent=`#${trace[i].key}`;
        cell.querySelector('small').textContent=i<count?(trace[i].hit?'hit':'read'):'waiting';
        cell.classList.toggle('hit',i<count&&trace[i].hit);cell.classList.toggle('miss',i<count&&!trace[i].hit);cell.classList.toggle('current',i===count-1);
      });
      const misses=trace.slice(0,count).filter(r=>!r.hit).length;
      put('status',`${count} requests · ${misses} catalogue reads · ${count-misses} hits. ${misses} saved ${misses===1?'copy':'copies'}.`);
    } else if(kind==='cost') {
      const hits=Number(get('hits').value), source=Number(get('source').value), c=cacheCost(hits,source);
      put('hits-value',String(hits));put('source-value',`${source} ms`);put('direct',`${source} ms`);put('miss',`${c.miss} ms`);
      for(const [name,value] of [['direct-bar',source],['hit-bar',2],['lookup-bar',2],['source-bar',source],['fill-bar',2]]) get(name).style.width=`${value/c.miss*100}%`;
      for(const [name,value] of [['average-lookup',2],['average-source',(1-hits/100)*source],['average-fill',(1-hits/100)*2]]) {
        get(name).style.width=`${value/c.miss*100}%`; get(name).style.display=value===0?'none':'';
      }
      put('average',`${c.mean.toFixed(1)} ms`);
      put('mean',`${c.mean.toFixed(1)} ms average with the cache`);
      const difference=source-c.mean;
      put('status',`${c.sourceReads} catalogue reads instead of 100. ${Math.abs(difference).toFixed(1)} ms ${difference>=0?'faster':'slower'} on average. Each miss takes ${c.miss} ms.`);
    } else {
      const t=Number(progress.value), state=copyAt(t,get('invalidate').checked);
      put('time',`${t.toFixed(1)} s`);put('source-price',`€${state.source}`);put('copy-price',state.cached===null?'empty':`€${state.cached}`);
      get('copy-box').classList.toggle('stale',state.stale);get('copy-box').classList.toggle('cached',state.cached!==null&&!state.stale);
      put('copy-label',state.stale?'A hit would return the old price':state.cached===null?'The next lookup would miss':'Both copies agree');
      get('clock').setAttribute('cx',String(40+t/12*400));
      put('status',state.cached===null?`The copy is ${get('invalidate').checked?'deleted':'expired'}. The catalogue still has €15. No replacement is fetched.`:`The copy has ${state.ttl.toFixed(1)} seconds left. ${state.stale?'Its saved price is now out of date.':'No further requests have arrived.'}`);
    }
  }
  function tick(now) {
    if(!playing)return;
    const max=Number(progress.max), duration=kind==='reuse'?9600:kind==='journey'?(warm?5200:10400):12000;
    clock=Math.min(max,clock+Math.min(now-last,100)/duration*max);last=now;
    progress.value=String(kind==='reuse'?Math.floor(clock):clock);render();
    if(clock>=max)stop();else frame=requestAnimationFrame(tick);
  }
  play?.addEventListener('click',()=>{
    if(playing){stop();return;}
    if(Number(progress.value)>=Number(progress.max))progress.value='0';
    clock=Number(progress.value);playing=true;last=performance.now();play.textContent='Pause';play.setAttribute('aria-pressed','true');frame=requestAnimationFrame(tick);
  });
  get('reset')?.addEventListener('click',()=>{stop();progress.value='0';render();});
  root.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{stop();render();}));
  root.querySelectorAll('[data-warm]').forEach(button=>button.addEventListener('click',()=>{
    stop();warm=button.dataset.warm==='true';progress.value='0';
    root.querySelectorAll('[data-warm]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();
  }));
  // Animation is opt-in, including for reduced-motion users, and stops offscreen.
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(root);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  render();
}
