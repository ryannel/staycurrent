function init() {
 for (const root of document.querySelectorAll('[data-fresh-age]')) {
  if (root.dataset.ready) continue;
  root.dataset.ready = 'true';
  const draw = () => {
   const delay = Number(root.querySelector('[data-delay]').value);
   const lag = Number(root.querySelector('[data-lag]').value);
   const age = delay + lag;
   const total = age + 30;
   const put = (name, text) => { root.querySelector(`[data-${name}]`).textContent = text; };
   put('snapshot', `Snapshot from t = ${-lag} s`);
   put('insert', `t = ${delay} s`);
   put('age', `Already ${age} s old`);
   put('expire', `t = ${delay + 30} s`);
   put('end-age', `Observation age reaches ${total} s`);
   put('scale', `Bars share a scale from t = ${-lag} s to t = ${delay + 30} s.`);
   put('age-label', `0 → ${total} seconds`);
   const bar = root.querySelector('[data-ttl-bar]');
   bar.style.left = `${age / total * 100}%`;
   bar.style.width = `${30 / total * 100}%`;
   put('explanation', age >= 30
    ? `The copy is already ${age} seconds old at insertion. A thirty-second age rule rejects it, although an insertion TTL would give it thirty more seconds.`
    : `The copy is ${age} seconds old at insertion. A thirty-second age rule leaves ${30 - age} seconds for reuse, ending at t = ${30 - lag} s. The insertion TTL instead ends at t = ${delay + 30} s.`);
  };
  root.querySelectorAll('select').forEach(select => select.addEventListener('change', draw));
  draw();
 }
}
init();
document.addEventListener('astro:page-load', init);
