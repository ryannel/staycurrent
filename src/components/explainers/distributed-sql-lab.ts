import { rangeWrite, transferView } from '../../lib/explainers/distributed-sql-model.mjs';
class DistributedSqlLab extends HTMLElement {
  stage=0; failed=false; recovered=false;
  connectedCallback() {
    if(this.dataset.ready) return; this.dataset.ready='true';
    this.addEventListener('input',(e)=>{if((e.target as HTMLElement).matches('[data-time]')) this.render();});
    this.addEventListener('change',(e)=>{if(!(e.target as HTMLElement).matches('[data-time]')) this.reset();});
    this.addEventListener('click',(e)=>{
      const b=(e.target as HTMLElement).closest('button'); if(!b) return;
      if(b.hasAttribute('data-reset')) this.reset();
      if(b.hasAttribute('data-next')) { const r=transferView({mode:this.value('[data-mode]'),stage:this.stage,failed:this.failed,recovered:this.recovered}); if(r.canAdvance) this.stage++; }
      if(b.hasAttribute('data-fail')) this.failed=true;
      if(b.hasAttribute('data-recover')) this.recovered=true;
      this.render();
    }); this.render();
  }
  value(s:string) { return this.querySelector<HTMLSelectElement>(s)!.value; }
  reset() { this.stage=0; this.failed=false; this.recovered=false; const clock=this.querySelector<HTMLInputElement>('[data-time]'); if(clock) clock.value='0'; this.render(); }
  render() {
    const stats=this.querySelector('[data-stats]')!,picture=this.querySelector('[data-picture]')!,answer=this.querySelector('[data-answer]')!;
    if(this.dataset.kind==='quorum') {
      const time=Number(this.value('[data-time]'));
      this.querySelector('[data-time-label]')!.textContent=`${time} ms`;
      const r=rangeWrite({topology:this.value('[data-topology]'),failure:this.value('[data-failure]'),client:this.value('[data-client]'),time});
      stats.innerHTML=`<div><strong>${r.replicas.filter((p:any)=>p.stored).length}/3</strong><span>stored entries</span></div><div><strong>${r.quorumAt===null?'Blocked':r.quorumAt+' ms'}</strong><span>commit time since reaching A</span></div><div><strong>${r.acknowledgedAt===null?'No reply':r.clientElapsed+' ms'}</strong><span>Expected time from client request to reply</span></div>`;
      const clientLeg=this.value('[data-client]')==='near'?1:70;
      picture.innerHTML=`<p class="distributed-sql-client-path">Client → A: ${clientLeg} ms before clock zero. A → client: ${clientLeg} ms after commit.${r.quorumAt===null?' No commit or success reply is possible on this path.':` Expected total: ${clientLeg} + ${r.quorumAt} + ${clientLeg} = ${r.clientElapsed} ms; the reply reaches the client at ${r.acknowledgedAt} ms on the slider’s clock.`}</p><div class="distributed-sql-replicas">${r.replicas.map((p:any,i:number)=>`<div class="distributed-sql-replica ${p.stored?'stored':''}"><strong>${p.name}${i===0?' · leader':''}</strong><span>${p.region}</span><div>${!p.reachable?'Unreachable':p.stored?'Entry stored':'Awaiting entry'}</div><small>${!p.reachable?'No reply on this path':`Durable reply at ${p.at} ms`}</small></div>`).join('')}</div>`;
      answer.textContent=r.quorumAt===null?'A can store the entry locally, but cannot commit this new write without another voter. B and C may elect a leader elsewhere; that recovery is outside this fixed-leader model.':r.acknowledged?'The client has received success. The entry is committed; any follower without it must catch up before serving a read that requires it.':r.committed?'The range entry is committed by a majority. The client has not received the response yet. This is one range’s entry, not a cross-range transaction decision.':'Waiting for a second durable entry. A local copy alone is insufficient for this consensus group.';
    } else {
      const mode=this.value('[data-mode]'); const r=transferView({mode,stage:this.stage,failed:this.failed,recovered:this.recovered});
      this.querySelector<HTMLButtonElement>('[data-next]')!.disabled=!r.canAdvance;
      this.querySelector<HTMLButtonElement>('[data-fail]')!.disabled=this.failed;
      this.querySelector<HTMLButtonElement>('[data-recover]')!.disabled=!this.failed || this.recovered;
      stats.innerHTML=`<div><strong>${this.stage}</strong><span>completed steps</span></div><div><strong>${r.total}</strong><span>committed snapshot total</span></div><div><strong>${r.coordinator}</strong><span>original coordinator</span></div>`;
      picture.innerHTML=`<div class="distributed-sql-accounts"><div><strong>Range A</strong><span>Committed: ${r.debit} credits</span><small>${r.provisionalDebit?'Provisional: debit 10 · majority stored':'No unresolved debit'}</small></div><div><strong>Range B</strong><span>Committed: ${r.credit} credits</span><small>${r.provisionalCredit?'Provisional: credit 10 · majority stored':'No unresolved credit'}</small></div></div><ol class="distributed-sql-steps"><li class="${this.stage>=1?'done':''}">Replicate debit ${mode==='atomic'?'as provisional':'as committed'}</li><li class="${this.stage>=2?'done':''}">Replicate credit ${mode==='atomic'?'as provisional':'as committed'}</li>${mode==='atomic'?`<li class="${this.stage>=3?'done':''}">Record durable commit outcome; both changes become visible</li>`:''}</ol>`;
      answer.textContent=r.aborted?'Recovery finds no commit decision and aborts this attempt. Provisional changes are discarded; the total stays 140.':r.committed?'Both changes have committed. The total is 140, including after loss of the coordinator.':r.pending?'Replicated provisional changes are not committed account balances. This earlier snapshot still totals 140; a current read encountering these changes waits for an outcome.':mode==='independent' && this.stage===1?'The debit is a committed write, but the credit has not happened. The snapshot totals 130. Losing the coordinator leaves this partial transfer; replication has faithfully preserved it.':this.failed?'No transfer has committed. The coordinator is offline.':'No transfer steps have completed. Both original balances total 140.';
    }
  }
}
if(!customElements.get('distributed-sql-lab')) customElements.define('distributed-sql-lab',DistributedSqlLab);
