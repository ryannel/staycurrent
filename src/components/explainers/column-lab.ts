import { fields, records, featuredRecord, countryReport, scanModel, pruningModel, insertBatch, mergeSmallest, replicationModel } from '../../lib/explainers/models.mjs';

const colors = ['teal', 'gold', 'blue', 'coral', 'purple', 'stone'];
const letters = ['S', 'T', 'C', 'E', 'U', 'P'];
const metric = (value: string | number, label: string) => `<div><strong>${value}</strong><span>${label}</span></div>`;

class ColumnLab extends HTMLElement {
  layout = 'rows'; selected = [0, 2]; sorted = false; tenant = 'B';
  parts: number[] = []; batch = 4; rewritten = 0;
  time = 0; delay = 4; wait = false; failedAt: number | null = null;
  scanPosition = 12; frame = 0; playing = false;

  connectedCallback() {
    this.controls(); this.draw();
    this.addEventListener('input', this.onInput);
    this.addEventListener('click', this.onClick);
  }
  disconnectedCallback() { this.stop(); this.removeEventListener('input', this.onInput); this.removeEventListener('click', this.onClick); }
  get kind() { return this.dataset.kind; }
  node(name: string) { return this.querySelector<HTMLElement>(`[data-${name}]`)!; }
  controls() {
    const controls = this.node('controls');
    if (this.kind === 'scan') controls.innerHTML = `<div class="control-line segmented" role="group" aria-label="Storage layout"><button data-action="rows" aria-pressed="${this.layout === 'rows'}">Store as rows</button><button data-action="columns" aria-pressed="${this.layout === 'columns'}">Store as columns</button></div><fieldset><legend>Fields requested by the query</legend><div class="field-picker">${fields.map((f, i) => `<label class="${colors[i]}"><input type="checkbox" data-field="${i}" ${this.selected.includes(i) ? 'checked' : ''}>${f}</label>`).join('')}</div></fieldset><div class="control-line"><button data-action="play">Run scan</button><label class="range-label">Scan progress<input type="range" data-input="scan" min="0" max="12" value="${this.scanPosition}"></label></div>`;
    if (this.kind === 'pruning') controls.innerHTML = `<div class="control-line"><div class="segmented" role="group" aria-label="Data order"><button data-action="unsorted" aria-pressed="${!this.sorted}">Arrival order</button><button data-action="sorted" aria-pressed="${this.sorted}">Sort by shop</button></div><label>Find shop <select data-input="tenant"><option>A</option><option selected>B</option><option>C</option><option>D</option><option value="all">All shops</option></select></label></div>`;
    if (this.kind === 'merging') controls.innerHTML = `<div class="control-line"><label>Events per batch <select data-input="batch"><option value="1">1</option><option value="4" selected>4</option><option value="16">16</option></select></label><button data-action="insert">Insert batch</button><button data-action="merge">Merge two parts</button><button data-action="reset">Reset</button></div>`;
    if (this.kind === 'replication') controls.innerHTML = `<div class="control-line"><label class="range-label">Replica delay <output data-delay>${this.delay} steps</output><input type="range" data-input="delay" min="1" max="8" value="${this.delay}"></label><label class="check-label"><input type="checkbox" data-input="wait"> Wait for second replica</label></div><div class="control-line"><button data-action="step">Advance one step</button><button data-action="fail">Lose receiving replica</button><button data-action="reset">Reset write</button></div><p class="control-note">Changing the delay or waiting policy starts a new write at step zero and restores both replicas.</p>`;
  }
  onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.dataset.field !== undefined) { const field = Number(target.dataset.field); this.selected = target.checked ? [...this.selected, field] : this.selected.filter(x => x !== field); this.stop(); this.scanPosition = 12; }
    if (target.dataset.input === 'scan') { this.stop(); this.scanPosition = Number(target.value); }
    if (target.dataset.input === 'tenant') this.tenant = target.value;
    if (target.dataset.input === 'batch') this.batch = Number(target.value);
    if (target.dataset.input === 'delay') { this.delay = Number(target.value); this.time = 0; this.failedAt = null; this.querySelector('[data-delay]')!.textContent = `${this.delay} steps`; }
    if (target.dataset.input === 'wait') { this.wait = target.checked; this.time = 0; this.failedAt = null; }
    this.draw(); this.announce();
  };
  onClick = (event: Event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'rows' || action === 'columns') { this.layout = action; this.stop(); this.scanPosition = 12; }
    if (action === 'sorted' || action === 'unsorted') this.sorted = action === 'sorted';
    if (action === 'insert' && this.parts.length < 24) this.parts = insertBatch(this.parts, this.batch);
    if (action === 'merge') { const result = mergeSmallest(this.parts); this.parts = result.parts; this.rewritten += result.rewritten; }
    if (action === 'step') this.time = Math.min(10, this.time + 1);
    if (action === 'fail' && this.failedAt === null) this.failedAt = this.time;
    if (action === 'reset') { this.parts = []; this.rewritten = 0; this.time = 0; this.failedAt = null; }
    if (action === 'play') { if (this.playing) this.stop(); else this.play(); }
    this.draw(); this.announce();
  };
  stop() { cancelAnimationFrame(this.frame); this.playing = false; const b = this.querySelector('[data-action="play"]'); if (b) b.textContent = this.scanPosition > 0 && this.scanPosition < 12 ? 'Resume scan' : 'Run scan'; }
  play() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.scanPosition = 12; this.draw(); this.announce(); return; }
    this.playing = true;
    if (this.scanPosition >= 12) this.scanPosition = 0;
    const start = performance.now() - this.scanPosition * 300;
    const tick = (now: number) => {
      const position = Math.min(12, Math.floor((now - start) / 300));
      if (position !== this.scanPosition) { this.scanPosition = position; this.draw(); }
      if (this.scanPosition < 12) this.frame = requestAnimationFrame(tick);
      else { this.stop(); this.announce(); }
    };
    this.frame = requestAnimationFrame(tick);
  }
  announce() {
    const stats = [...this.node('stats').children].map(el => `${el.querySelector('strong')!.textContent} ${el.querySelector('span')!.textContent}`).join('. ');
    this.node('announcement').textContent = `${stats}. ${this.node('explanation').textContent}`;
  }
  draw() {
    const picture = this.node('picture'), stats = this.node('stats'), explanation = this.node('explanation');
    if (this.kind === 'scan') {
      const model = scanModel(this.layout, this.selected);
      this.querySelectorAll<HTMLButtonElement>('[data-action="rows"], [data-action="columns"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.action === this.layout)));
      const slider = this.querySelector<HTMLInputElement>('[data-input="scan"]')!; slider.value = String(this.scanPosition);
      this.querySelector('[data-action="play"]')!.textContent = this.playing ? 'Pause scan' : this.scanPosition > 0 && this.scanPosition < 12 ? 'Resume scan' : 'Run scan';
      picture.innerHTML = `<div class="memory-pages">${model.pages.map((page, i) => `<div class="memory-page ${i < this.scanPosition ? (page.read ? 'read' : 'skipped') : 'pending'}"><div class="page-cells">${page.values.map(v => `<span class="cell ${colors[v.field]} ${v.needed ? 'needed' : ''} ${v.row === featuredRecord ? 'featured' : ''}" title="Record ${v.row + 1}: ${fields[v.field]} = ${v.value}">${letters[v.field]}</span>`).join('')}</div><small>Page ${String(i + 1).padStart(2, '0')} <b>${i < this.scanPosition ? (page.read ? 'read' : 'skip') : 'waiting'}</b></small></div>`).join('')}</div>`;
      const read = model.pages.slice(0, this.scanPosition).filter(p => p.read).length;
      stats.innerHTML = metric(`${read} / 12`, 'pages read') + metric(read * 8, 'cells brought into memory') + metric(model.useful, 'values requested');
      const sentence = this.selected.length === 0 ? 'No fields selected. There is nothing to read.' : this.layout === 'rows' ? 'A page is read whenever it contains a field you selected. The grey cells on that page get read too.' : `With these fields selected, the column layout can leave ${12 - model.read} of the 12 pages unread.`;
      const report = this.selected.includes(0) && this.selected.includes(2) ? (this.scanPosition === 12 ? ' The country report is unchanged: eight groups, 16 page views.' : ' The scan is still in progress.') : ' These fields alone cannot produce our shop-and-country report.';
      explanation.textContent = sentence + (this.selected.length ? report : '');
      this.node('description').textContent = `${this.layout === 'rows' ? 'Fields of each record are adjacent.' : 'Values are grouped by field; each column keeps the same record order.'} The marked record is ${records[featuredRecord].values.join(', ')}. ` + model.pages.map((p, i) => `Page ${i + 1}: ${i >= this.scanPosition ? 'waiting' : p.read ? 'read' : 'skipped'}; ${[...new Set(p.values.map(v => fields[v.field]))].join(', ')}.`).join(' ');
    }
    if (this.kind === 'pruning') {
      const model = pruningModel(this.sorted, this.tenant);
      this.querySelectorAll<HTMLButtonElement>('[data-action="sorted"], [data-action="unsorted"]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.action === 'sorted') === this.sorted)));
      picture.innerHTML = `<p class="diagram-key">Each line is one record: <strong>Shop · Country</strong>. The marked line is the blue-mug visit.</p><div class="range-blocks">${model.blocks.map((b, i) => `<div class="range-block ${b.read ? 'read' : 'skipped'}"><small>Block ${i + 1} · ${b.min}–${b.max}</small><div class="aligned-records">${b.values.map(r => `<div class="aligned-record ${r.id === featuredRecord ? 'featured' : ''} ${this.tenant === 'all' || r.tenant === this.tenant ? 'match' : ''}"><span>${r.tenant}</span><span>${r.country}</span></div>`).join('')}</div><b>${b.read ? 'READ' : 'SKIP'}</b></div>`).join('')}</div>`;
      stats.innerHTML = metric(`${model.read} / 4`, 'blocks read') + metric(model.read * 4, 'records examined') + metric(model.matches, 'matching records');
      const result = countryReport(undefined, this.tenant);
      explanation.textContent = (this.tenant === 'all' ? 'All shops need all four blocks.' : this.sorted ? 'All four matching records are in one block. The ranges on the other three blocks exclude this shop.' : 'Every block spans A to D. We must check each one for this shop.') + ` Report: ${result.map(r => `${r.shop} / ${r.country}: ${r.views}`).join('; ')}. Sorting leaves these counts unchanged.`;
      this.node('description').textContent = model.blocks.map((b, i) => `Block ${i + 1}, range ${b.min} to ${b.max}, ${b.read ? 'read' : 'skip'}: ${b.values.map(r => `record ${r.id + 1}, shop ${r.tenant}, ${r.country}${r.id === featuredRecord ? ', blue-mug visit' : ''}`).join('; ')}.`).join(' ');
    }
    if (this.kind === 'merging') {
      picture.innerHTML = `<div class="parts-stage">${this.parts.length ? this.parts.map((n, i) => `<div class="part" style="--part-height:${45 + Math.min(80, n * 3)}px"><div class="part-lines"></div><b>${n}</b><small>events</small><span>part ${i + 1}</span></div>`).join('') : '<p class="empty-stage">Insert a batch to create your first sorted part.</p>'}</div>`;
      this.node('description').textContent = this.parts.length ? this.parts.map((n, i) => `Part ${i + 1}: ${n} events.`).join(' ') : 'No parts yet.';
      stats.innerHTML = metric(this.parts.length, 'active parts') + metric(this.parts.reduce((a,b) => a+b, 0), 'events stored') + metric(this.rewritten, 'events rewritten by merges');
      this.querySelector<HTMLButtonElement>('[data-action="merge"]')!.disabled = this.parts.length < 2;
      this.querySelector<HTMLButtonElement>('[data-action="insert"]')!.disabled = this.parts.length >= 24;
      explanation.textContent = this.parts.length >= 24 ? 'The model stops at 24 parts. Merge or reset to continue. Compare the same event total with larger batches.' : this.parts.length < 2 ? 'Try inserting four batches of one event. Then reset and send those four events in a single batch. Compare how many parts you need to merge.' : 'Merging two parts reads their events and writes them into a new part. The rewritten-events counter includes those writes each time.';
    }
    if (this.kind === 'replication') {
      const model = replicationModel(this.time, this.delay, this.wait, this.failedAt);
      const progress = Math.min(100, this.time / this.delay * 100);
      picture.innerHTML = `<div class="replica-stage"><div class="replica ${model.alive ? 'has-write' : 'failed'}"><span>Receiving replica</span><strong>${model.alive ? 'Stored' : 'Lost'}</strong><small>${model.alive ? 'new page view' : 'storage lost'}</small></div><div class="transfer"><span>${model.copied ? 'Copy received' : model.lost ? 'Transfer lost' : 'Copy in flight'}</span><div class="transfer-track"><i style="width:${progress}%" class="${model.lost ? 'lost' : ''}"></i></div><small>step ${this.time} / arrival at ${this.delay}</small></div><div class="replica ${model.copied ? 'has-write' : ''}"><span>Second replica</span><strong>${model.copied ? 'Stored' : 'Absent'}</strong><small>new page view</small></div></div>`;
      stats.innerHTML = metric(model.acknowledged ? 'Success' : 'None yet', 'reply to the writer') + metric(model.copies, 'surviving copies of the page view') + metric(model.copied ? 'Present' : 'Absent', 'page view on the second replica');
      this.querySelector<HTMLButtonElement>('[data-action="step"]')!.disabled = this.time >= 10 || model.lost;
      this.querySelector<HTMLButtonElement>('[data-action="fail"]')!.disabled = this.failedAt !== null;
      explanation.textContent = model.lost ? (model.acknowledged ? 'The receiving replica reported success. Its storage was then lost before the second replica received the page view. No copy survives.' : 'The page view is lost. The application never received success, because it was waiting for the second copy.') : model.copied ? (model.alive ? 'Both replicas have the page view. Losing the receiving replica now leaves a copy on the second.' : 'The receiving replica is gone. The second replica received the page view before the failure and still has it.') : this.wait ? 'The application is waiting for the second copy. Advance time to let it arrive, or lose the receiving replica before it does.' : 'The application was told the write succeeded. Only the receiving replica has the page view so far.';
      this.node('description').textContent = `Step ${this.time}. Receiving replica: ${model.alive ? 'page view stored' : 'storage lost'}. Second replica: ${model.copied ? 'page view stored' : 'page view absent'}. Copy scheduled to arrive at step ${this.delay}.`;

    }
  }
}
if (!customElements.get('column-lab')) customElements.define('column-lab', ColumnLab);
