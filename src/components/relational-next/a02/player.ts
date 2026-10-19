// Discrete states: leave time to read narration and compare the displayed rows.
export const readingHold = (note: string) => Math.max(4200, 1600 + note.trim().split(/\s+/).length * 280);
export function attachPlayer(host: HTMLElement, max: number, renderState: (step: number) => string) {
 const abort = new AbortController();
 const el = <T extends HTMLElement>(selector: string) => host.querySelector<T>(selector)!;
 const play = el<HTMLButtonElement>('[data-act="play"]');
 const back = el<HTMLButtonElement>('[data-act="back"]');
 const next = el<HTMLButtonElement>('[data-act="next"]');
 const note = el('[data-note]');
 let step = max, timer = 0, playing = false, narration = '';
 const draw = () => {
  narration = renderState(step);
  note.textContent = narration;
  el('[data-position]').textContent = `Step ${step + 1} of ${max + 1}`;
  // Move focus before disabling its current owner, at either endpoint.
  if ((step === 0 && document.activeElement === back) || (step === max && document.activeElement === next)) play.focus({preventScroll:true});
  back.disabled = step === 0; next.disabled = step === max;
  play.textContent = playing ? 'Pause' : step === max ? 'Replay' : 'Play';
  note.setAttribute('aria-live', playing ? 'off' : 'polite');
 };
 const stop = () => { clearTimeout(timer); timer = 0; playing = false; play.textContent = step === max ? 'Replay' : 'Play'; note.setAttribute('aria-live','polite'); };
 const schedule = () => { timer = window.setTimeout(() => { step++; if(step === max) playing = false; draw(); if(playing) schedule(); }, readingHold(narration)); };
 host.querySelectorAll<HTMLElement>('[data-controls]').forEach(x => x.hidden = false);
 host.addEventListener('click', event => {
  const action = (event.target as Element).closest<HTMLButtonElement>('button[data-act]')?.dataset.act;
  if(!action) return;
  if(action === 'play') { if(playing){stop();return;} if(step === max)step = 0; playing = true; draw(); schedule(); return; }
  stop(); if(action === 'back')step = Math.max(0,step-1); if(action === 'next')step = Math.min(max,step+1); if(action === 'reset')step = 0; draw();
 }, {signal:abort.signal});
 document.addEventListener('visibilitychange', () => {if(document.hidden)stop();}, {signal:abort.signal});
 draw();
 return {refresh:()=>{stop();draw();}, destroy:()=>{stop();abort.abort();}};
}
