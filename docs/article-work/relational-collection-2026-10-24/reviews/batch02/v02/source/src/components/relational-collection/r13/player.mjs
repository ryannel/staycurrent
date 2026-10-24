import {stepper} from '../../figures/stepper.mjs';
import {models,snapshotState,dutyState} from './model.mjs';
function snapshotDrawing(mode,step){
 const s=snapshotState(mode,step);
 return `<p class="r13-stat" data-live>Current committed stock <strong>${s.committed}</strong></p>
 <ol class="r13-timeline" aria-label="Schedule"><li class="${step===1?'current':''}">Report reads</li><li class="${step===2?'current':''}">Checkout commits</li><li class="${step===3?'current':''}">Report reads again</li></ol>
 <div class="r13-views" aria-label="Logical views before and after checkout, not physical storage">
 <div class="r13-view ${s.first?'used':''}"><p class="r13-label">Before checkout</p><p class="r13-row">P7 · stock <strong>1</strong></p><div class="r13-tags" data-live>${s.first?'<span>Read 1 → 1</span>':'<span class="r13-empty">No read yet</span>'}${s.second&&s.secondOld?'<span>Read 2 → 1</span>':''}</div></div>
 <div class="r13-view ${s.second&&!s.secondOld?'used':''} ${!s.after?'future':''}"><p class="r13-label">After checkout</p><p class="r13-row">P7 · stock <strong>${s.after?'0':'—'}</strong></p><div class="r13-tags" data-live>${s.second&&!s.secondOld?'<span>Read 2 → 0</span>':s.after?'<span class="r13-empty">Commit is available</span>':'<span class="r13-empty">No commit yet</span>'}</div></div>
 </div><p class="r13-view-note" data-live>${step===0?'Report transaction is open.':mode==='rr'?'One transaction snapshot, established by Read 1.':'Each SELECT takes its own snapshot.'}</p>`;
}
function skewDrawing(mode,step){
 const s=dutyState(mode,step); const failed=mode==='serial'&&s.tomasAttempt;
 return `<p class="r13-stat" data-live>Committed instructors on duty <strong>${Number(s.ada)+Number(s.tomas)}</strong><span>Rule: at least 1</span></p>
 <div class="r13-decisions">
 <div class="r13-person"><p class="r13-label">Ada · I1</p><div class="r13-observation" data-live>${s.read?'Read: Tomas is on':'Has not read yet'}</div><p class="r13-because" data-live>${s.read?'↓ so Ada may leave':'↓'}</p><div class="r13-action" data-live>${s.adaCommit?'Ada off · committed':s.read?'Planned: Ada off':'No change yet'}</div></div>
 <div class="r13-person"><p class="r13-label">Tomas · I2</p><div class="r13-observation" data-live>${s.retry?'Fresh read: Ada is off':s.read?'Read: Ada is on':'Has not read yet'}</div><p class="r13-because" data-live>${s.retry?'↓ so Tomas must stay':s.read?'↓ so Tomas may leave':'↓'}</p><div class="r13-action" data-live>${s.retry?'Tomas stays · '+(s.final?'committed':'fresh attempt'):failed?'Attempt rejected · 40001':s.tomasAttempt?'Tomas off · committed':s.read?'Planned: Tomas off':'No change yet'}</div></div>
 </div>
 <div class="r13-committed" aria-label="Committed duty rows"><p class="r13-label">Shared rows · session S502</p><div data-live><span>Ada <strong>${s.ada?'on':'off'}</strong></span><span>Tomas <strong>${s.tomas?'on':'off'}</strong></span></div></div>
 <p class="r13-view-note" data-live>${step>=3?(mode==='rr'?'No serial order permits both to leave.':'Rejected work has no committed duty change.'):'Each transaction plans to change only its own row.'}</p>`;
}
function init(){for(const root of document.querySelectorAll('[data-r13-scene]')){
 if(root.dataset.ready)continue;root.dataset.ready='true';
 const kind=root.dataset.r13Scene;const model=models[kind];let mode=model.options[0][0];
 const drawing=root.querySelector('[data-drawing]');const explanation=root.querySelector('[data-explanation]');
 const player=stepper(root,{steps:()=>model.steps,draw:(step)=>{drawing.innerHTML=kind==='snapshots'?snapshotDrawing(mode,step):skewDrawing(mode,step);explanation.textContent=model.explain(mode,step);}});
 for(const button of root.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>{mode=button.dataset.mode;for(const other of root.querySelectorAll('[data-mode]'))other.setAttribute('aria-pressed',String(other===button));player.render();});
 root.querySelector('.r13-enhanced').hidden=false;root.querySelector('.r13-text').open=false;
}}
init();document.addEventListener('astro:page-load',init);
