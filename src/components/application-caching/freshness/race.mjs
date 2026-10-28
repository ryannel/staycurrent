import { stepper } from '../../figures/stepper.mjs';
function init() {
 for (const root of document.querySelectorAll('[data-fresh-race]')) {
  if (root.dataset.ready) continue;
  root.dataset.ready = 'true';
  const choice = root.querySelector('[data-action]');
  const player = stepper(root, { steps: () => 5, draw: step => {
   const updating = choice.value === 'update';
   const packet = root.querySelector('[data-packet]');
   packet.style.left = step === 0 ? '50%' : step === 4 ? '85%' : '15%';
   packet.style.top = step === 0 ? '25px' : '85px';
   const put = (name, text) => { root.querySelector(`[data-${name}]`).textContent = text; };
   put('source', step >= 2 ? 'GBP 22.00 · revision 2' : 'GBP 20.00 · revision 1');
   put('cache', step === 4 ? 'GBP 20.00 · revision 1' : step === 3 && updating ? 'GBP 22.00 · revision 2' : 'Empty');
   put('ttl', step === 4 ? 'New TTL: 30 seconds' : step === 3 && updating ? 'TTL: 30 seconds' : 'No entry');
   put('reader', step === 0 ? 'Has not read the source yet.' : step === 4 ? 'Resumes and fills with its saved revision 1.' : 'Holds revision 1; paused before filling.');
   put('writer', step < 2 ? 'Has not changed the price yet.' : step === 2 ? 'Commits revision 2. Cache work is still pending.' : updating ? 'Writes revision 2 to the cache successfully.' : 'Deletes the cache key successfully.');
   const explanations = [
    'Both applications share one cache. Start with a cache miss.',
    'App A reads revision 1 from the source. It has the old price in memory but has not copied it into the cache.',
    'App B commits revision 2. App A still holds the answer it read before that commit.',
    updating ? 'App B puts revision 2 in the cache. Source and cache agree at this moment.' : 'App B deletes the key. Deletion succeeds even though App A has not filled it yet.',
    updating ? 'App A overwrites revision 2 with revision 1. A successful cache update did not stop an older read from arriving afterwards.' : 'App A creates the key with revision 1. Deletion removed the key, but did not remove App A’s saved answer or its ability to fill.'
   ];
   put('explanation', explanations[step]);
  }});
  choice.addEventListener('change', () => player.render());
 }
}
init();
document.addEventListener('astro:page-load', init);
