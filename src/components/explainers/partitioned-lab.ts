import { historyPlan, writeBuckets } from '../../lib/explainers/partitioned-model.mjs';
class PartitionedLab extends HTMLElement {
  connectedCallback() { if (this.dataset.ready) return; this.dataset.ready='true'; this.addEventListener('change',()=>this.render()); this.render(); }
  render() {
    const value = (s:string) => this.querySelector<HTMLSelectElement>(s)!.value;
    const stats=this.querySelector('[data-stats]')!;
    const picture=this.querySelector('[data-picture]')!;
    const answer=this.querySelector('[data-answer]')!;
    const results=this.querySelector('[data-results]')!;
    if (this.dataset.kind==='history') {
      const membership=this.querySelector<HTMLInputElement>('[data-membership]')!;
      const hasIndex=this.querySelector<HTMLInputElement>('[data-index]')!.checked;
      membership.disabled=value('[data-layout]')!=='device' || value('[data-query]')!=='customer' || hasIndex;
      const plan=historyPlan({membership:membership.checked,layout:value('[data-layout]'),order:value('[data-order]'),query:value('[data-query]'),index:hasIndex});
      stats.innerHTML=`<div><strong>${plan.requests}</strong><span>logical groups opened</span></div><div><strong>${plan.examined}</strong><span>records examined</span></div><div><strong>${plan.copies}</strong><span>stored record copies</span></div>`;
      picture.innerHTML=plan.groups.map((g:any)=>`<div class="partitioned-group ${g.accessed?'opened':''}"><strong>${g.key}</strong><small>${g.accessed?'Open group':'Leave closed'}</small>${g.rows.map((r:any)=>`<div class="partitioned-row ${g.examined.includes(r)?'examined':''}">${r.device} · ${r.hour}:00 · ${r.temperature}° <span>${g.examined.includes(r)?'read':'skip'}</span></div>`).join('')}</div>`).join('');
      answer.textContent=`${plan.matches.length} matching readings. ${plan.effective===value('[data-query]')?'The requested key routes to one group.':plan.knownDevices?'The known membership list routes Birch’s request to B1 and B2; other device groups stay closed.':value('[data-query]')==='customer'?'No membership list or customer-keyed index is available, so every device group is searched.':'The device’s customer key is unknown, so every customer group is searched.'} ${value('[data-order]')==='time'?'Time order excludes the 09:00 readings before examination.':'Temperature order cannot narrow this time condition; the opened groups are filtered after reading.'}`;
      results.innerHTML=`<table class="partitioned-results"><caption>Answer, unchanged by storage layout</caption><thead><tr><th>Device</th><th>Time</th><th>Temperature</th></tr></thead><tbody>${plan.matches.map((r:any)=>`<tr><td>${r.device}</td><td>${r.hour}:00</td><td>${r.temperature}°</td></tr>`).join('')}</tbody></table>`;
    } else {
      const r=writeBuckets(Number(value('[data-shards]')),value('[data-hot]')==='hot');
      stats.innerHTML=`<div><strong>${r.total}</strong><span>writes in this batch</span></div><div><strong>${r.largest}</strong><span>largest bucket's writes</span></div><div><strong>${r.fanout}</strong><span>requests for B1 history</span></div>`;
      picture.innerHTML=r.buckets.map((b:any)=>`<div class="partitioned-bucket"><span>${b.key}</span><div class="partitioned-load"><i style="width:${b.writes/70*100}%"></i></div><strong>${b.writes} writes</strong></div>`).join('');
      answer.textContent=`The busiest logical bucket receives ${r.largest} of 100 writes. B1's history for this day now occupies ${r.fanout} bucket${r.fanout===1?'':'s'}, requiring ${r.fanout} ${r.fanout===1?'query':'queries and an ordered merge'}.`;
      results.innerHTML='';
    }
  }
}
if (!customElements.get('partitioned-lab')) customElements.define('partitioned-lab',PartitionedLab);
