import { groupRequests, fieldUpdate, schemaRead, negativeRead } from './keys-model.mjs';
for(const root of document.querySelectorAll('[data-keys]')) {
 const kind=root.dataset.keys;
 const get=name=>root.querySelector(`[data-${name}]`);
 const put=(name,text)=>{const el=get(name);if(el&&el.textContent!==text)el.textContent=text;};
 let timer;
 function stop(){clearInterval(timer);timer=undefined;if(get('play'))get('play').textContent='Play writes';}
 function render(){
  if(kind==='identity'){
   const fields=[...root.querySelectorAll('[data-field]:checked')].map(el=>el.dataset.field);
   const {entries,outcomes}=groupRequests(fields);
   // All strings here come from the fixed teaching dataset, never reader input.
   get('buckets').innerHTML=entries.map(([key,r])=>`<div class="key-bucket"><code>${key}</code><p>Saved: ${r.tenant} · ${r.currency} · ${r.group}<br><b>${r.currency} ${(r.amount/100).toFixed(2)}</b></p><div class="assigned">${outcomes.filter(o=>o.key===key).map(o=>`<span class="${o.correct?'':'wrong'}" title="${o.hit?'hit':'fill'} · ${o.correct?'correct answer':'wrong answer'}">${o.id} ${o.correct?'✓':'×'} <small>${o.hit?'hit':'fill'}</small></span>`).join('')}</div></div>`).join('');
   put('status',`${entries.length} saved ${entries.length===1?'answer':'answers'} · ${outcomes.filter(r=>r.hit).length} hits in 8 requests · ${outcomes.filter(r=>!r.correct).length} wrong answers.`);
  }else if(kind==='fields'){
   const step=Number(get('step').value),state=fieldUpdate(get('mode').value,step);
   put('currency',state.currency);put('amount',String(state.amount));put('displayed',`${state.currency} ${(state.amount/100).toFixed(2)}`);
   get('pair').classList.toggle('mixed',state.mixed);put('command',state.command);
   put('pair-status',state.mixed?'Mixed answer: old amount, new currency':step===0?'Complete old answer':'Complete new answer');
   put('status',state.mixed?'A reader between the commands sees USD 18.00, which was never an intended price.':step===0?'Start with EUR 18.00. The intended replacement is USD 20.00.':'A reader now sees USD 20.00.');
  }else if(kind==='schema'){
   const reader=Number(get('reader').value),writer=Number(get('writer').value),versioned=get('versioned').checked;
   const state=schemaRead(versioned,reader,writer);
   put('written-key',`price:${versioned?`v${writer}:`:''}mug`);put('read-key',`price:${versioned?`v${reader}:`:''}mug`);
   put('bytes',String(state.stored));put('written-unit',`Writer means ${writer===1?'euros':'cents'}`);put('read-unit',`Reader interprets ${reader===1?'euros':'cents'}`);
   put('decoded',state.hit?`€${state.displayed.toFixed(2)}`:'Miss');get('decoder').classList.toggle('wrong',state.hit&&!state.correct);
   put('status',!state.hit?'Different formats use different keys. This reader must rebuild an answer it understands.':state.correct?'The writer and reader agree on the value format.':'A successful lookup returns bytes the reader misinterprets.');
  }else{
   const outcome=get('outcome').value,state=negativeRead(outcome,get('negative').checked);
   put('entry',state.entry);put('second',state.hit?'Use cached answer':'Read source again');put('response',state.response);
   get('origin-two').classList.toggle('skipped',state.originReads===1);
   put('status',outcome==='failed'?'A timeout proves no absence. Keep an error distinct and apply the failure policy.':`${state.originReads} source ${state.originReads===1?'read':'reads'} for two requests. ${state.hit?'The second lookup is a hit.':'There is no saved answer to reuse.'}`);
  }
 }
 root.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',()=>{stop();render();}));
 get('play')?.addEventListener('click',()=>{
  if(timer){stop();return;}get('step').value='0';render();get('play').textContent='Pause';
  timer=setInterval(()=>{get('step').value=String(Number(get('step').value)+1);render();if(Number(get('step').value)===2)stop();},1500);
 });
 get('reset')?.addEventListener('click',()=>{stop();get('step').value='0';render();});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 render();
}
