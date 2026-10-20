// Step controls for any stepped figure: Play/Pause, Back, Next, Reset, a step
// counter and a hold bar. The markup contract and timing rule are described in
// .agents/skills/staycurrent-figures/SKILL.md.
// Back and Next use aria-disabled rather than disabled at the ends, so keyboard
// focus stays on the control. While playing, each step is held for the text that
// changed on arriving at it, read at roughly 230 words a minute, with a floor.

const leafTexts = root => [...root.querySelectorAll('[data-live], [data-live] *')]
  .filter(el => el.children.length === 0)
  .map(el => el.textContent.replace(/\s+/g, ' ').trim())
  .filter(Boolean);

/** Characters in the texts of `after` that were not already on screen in `before`. */
export function changedCharacters(before, after) {
  const pool = [...before];
  let count = 0;
  for (const text of after) {
    const index = pool.indexOf(text);
    if (index >= 0) pool.splice(index, 1); else count += text.length;
  }
  return count;
}

export const holdFor = characters => Math.min(24000, Math.max(3500, 1200 + characters * 45));

/**
 * root: the figure; steps(): how many steps the current options give;
 * draw(step): renders that step. Returns { render, stop } for option changes.
 */
export function stepper(root, { steps, draw }) {
  const play = root.querySelector('[data-play]');
  const back = root.querySelector('[data-back]');
  const next = root.querySelector('[data-next]');
  const counter = root.querySelector('[data-step]');
  const bar = root.querySelector('[data-hold] span');
  let step = 0;
  let timer;
  const last = () => steps() - 1;
  const label = () => { play.textContent = timer ? 'Pause' : step === last() ? 'Replay' : 'Play'; };
  const showHold = ms => {
    if (!bar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    void bar.offsetWidth;
    if (ms) { bar.style.transition = `width ${ms}ms linear`; bar.style.width = '100%'; }
  };
  const render = () => {
    step = Math.min(step, last());
    draw(step);
    back.setAttribute('aria-disabled', String(step === 0));
    next.setAttribute('aria-disabled', String(step === last()));
    counter.textContent = `${step + 1} / ${steps()}`;
    label();
  };
  const stop = () => { clearTimeout(timer); timer = undefined; showHold(0); label(); };
  const schedule = characters => {
    const ms = holdFor(characters);
    timer = setTimeout(() => {
      const before = leafTexts(root);
      step += 1;
      timer = undefined;
      render();
      if (step < last()) schedule(changedCharacters(before, leafTexts(root))); else stop();
    }, ms);
    showHold(ms);
    label();
  };
  play.addEventListener('click', () => {
    if (timer) { stop(); return; }
    if (step === last()) { step = 0; render(); schedule(changedCharacters([], leafTexts(root))); return; }
    const explanation = root.querySelector('[data-explanation]');
    schedule(explanation ? explanation.textContent.length : 0);
  });
  next.addEventListener('click', () => { stop(); if (step < last()) { step += 1; render(); } });
  back.addEventListener('click', () => { stop(); if (step > 0) { step -= 1; render(); } });
  root.querySelector('[data-reset]').addEventListener('click', () => { stop(); step = 0; render(); });
  document.addEventListener('astro:before-swap', stop, { once: true });
  render();
  return { render: () => { stop(); render(); }, stop };
}
