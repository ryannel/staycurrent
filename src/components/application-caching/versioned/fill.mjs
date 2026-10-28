import { stepper } from '../../figures/stepper.mjs';

function init() {
 for (const root of document.querySelectorAll('[data-versioned-fill]')) {
  if (root.dataset.ready) continue;
  root.dataset.ready = 'true';
  const rule = root.querySelector('[data-rule]');
  const loss = root.querySelector('[data-loss]');
  const player = stepper(root, { steps: () => 7, draw: step => {
   const token = rule.value === 'token';
   const revision = rule.value === 'revision';
   const lost = revision && loss.checked;
   const rejected = token || (revision && !lost);
   const put = (key, value) => { root.querySelector(`[data-${key}]`).textContent = value; };
   root.dataset.stage = String(step);
   root.dataset.rule = rule.value;
   root.dataset.rejected = String(rejected);
   loss.disabled = !revision;
   const card = root.querySelector('[data-card]');
   card.style.left = step < 2 ? '50%' : step < 6 ? '15%' : rejected ? '65%' : '85%';
   card.style.top = step < 6 ? '90px' : '210px';
   card.style.opacity = step < 2 ? '0' : '1';
   const ticket = root.querySelector('[data-ticket]');
   ticket.style.opacity = token && step >= 1 && step < 4 ? '1' : '0';
   ticket.style.transform = step >= 4 ? 'translate(-50%, 70px) rotate(35deg) scale(.4)' : 'translate(-50%, 0) rotate(-5deg)';
   root.querySelector('[data-barrier]').style.opacity = step === 6 && rejected ? '1' : '0';
   const knowledge = root.querySelector('[data-knowledge]');
   knowledge.style.opacity = revision && step >= 4 && !(lost && step >= 5) ? '1' : '0';
   knowledge.style.transform = lost && step >= 5 ? 'translateY(55px) rotate(15deg)' : 'none';
   put('source', step >= 3 ? 'GBP 22.00 · revision 2' : 'GBP 20.00 · revision 1');
   let cache = token && step >= 1 && step < 4 ? 'Loading · token A' : 'Absent';
   if (revision && step >= 4 && !(lost && step >= 5)) cache = 'No card · known revision 2';
   if (step === 6 && !rejected) cache = 'Ready · GBP 20.00 · revision 1';
   put('cache', cache);
   put('result', step < 6 ? 'Not attempted' : rejected ? 'Rejected · old card stays in App A' : 'Accepted · old card is reusable');
   const explanations = [
    'App A has missed. No source read has happened yet.',
    token ? 'App A reserves token A in the missing key. This grants one attempt permission to publish.' : 'App A proceeds without a revocable permission. The revision rule will compare source revisions when it fills.',
    'App A reads revision 1. The card moves to App A, which pauses before publishing it.',
    'App B commits revision 2. The authoritative source now says GBP 22.00; App A still holds GBP 20.00.',
    token ? 'Deletion removes the loading record. Watch token A fall away: App A still has its card, but its permission is gone.' : revision ? 'Invalidation records revision 2. A fill carrying revision 1 can now be recognised as too old.' : 'Deletion succeeds. The cache is empty, but App A can still write its old card.',
    token ? 'The key stays absent. There is no default token and no permission to recreate the old reservation.' : lost ? 'The remembered revision disappears. The cache no longer knows about revision 2. Treating this as zero would invent permission.' : revision ? 'Revision 2 remains known. The next comparison still has something trustworthy to compare against.' : 'No further change: the key remains empty while App A waits.',
    token ? 'The old card stops at the cache boundary. Absent does not match loading token A, so publication fails.' : rejected ? 'Revision 1 is below the remembered 2. The atomic comparison rejects the card.' : lost ? 'The unsafe rule compares revision 1 with an invented zero and accepts it. Losing knowledge has reopened the race.' : 'The unconditional write puts revision 1 back. Source and cache now disagree.'
   ];
   put('explanation', explanations[step]);
  }});
  rule.addEventListener('change', () => player.render());
  loss.addEventListener('change', () => player.render());
 }
}
init();
document.addEventListener('astro:page-load', init);
