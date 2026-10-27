// Connects a <SimFigure controls="live"> to a simulation model: play/pause,
// speed, reset, optional step-forward, parameter controls and readouts.
// The animation runs only while the figure is on screen and the tab is visible,
// and does not start by itself when the reader prefers reduced motion.
import { formatValue, paramText, clockText } from './sim.mjs';

export const SPEEDS = [0.25, 0.5, 1, 2, 4];
const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Current values of every [data-param] control in the figure. */
export function readParams(root) {
  const params = {};
  root.querySelectorAll('[data-param]').forEach(input => {
    const name = input.dataset.param;
    if (input.type === 'radio') { if (input.checked) params[name] = input.value; return; }
    if (input.type === 'checkbox') { params[name] = input.checked; return; }
    params[name] = input.type === 'range' || input.type === 'number' ? Number(input.value) : input.value;
    // A slider over `stops` reports the stop, not its position.
    const stops = jsonData(input, 'stops');
    if (stops) params[name] = stops[Number(input.value)];
  });
  return params;
}

const parsed = new WeakMap();
function jsonData(input, key) {
  const raw = input.dataset?.[key];
  if (!raw) return undefined;
  let cache = parsed.get(input);
  if (!cache) parsed.set(input, (cache = {}));
  if (!(key in cache)) { try { cache[key] = JSON.parse(raw); } catch { cache[key] = undefined; } }
  return cache[key];
}

/** Sets readouts: { name: text } fills each [data-readout="name"]. */
export function setReadouts(root, values) {
  for (const [name, text] of Object.entries(values)) {
    root.querySelectorAll(`[data-readout="${name}"]`).forEach(el => { if (el.textContent !== String(text)) el.textContent = text; });
  }
}

/**
 * For figures without a running clock: shows each parameter's value and calls
 * onChange(params) now and after every change.
 */
export function bindParams(root, onChange) {
  const inputs = root.querySelectorAll('[data-param]');
  const run = () => onChange(readParams(root));
  inputs.forEach(input => {
    showParam(root, input);
    input.addEventListener('input', () => { showParam(root, input); run(); });
  });
  run();
}

function showParam(root, input) {
  const output = root.querySelector(`[data-param-output="${input.dataset.param}"]`);
  const labels = jsonData(input, 'labels'), stops = jsonData(input, 'stops');
  if (!labels && !stops) {
    if (output) output.textContent = formatValue(input.value, input.dataset.format, input.dataset.unit);
    return;
  }
  // Sliders with custom labels or stops also give screen readers the same text.
  const value = stops ? stops[Number(input.value)] : input.value;
  const text = paramText(value, { format: input.dataset.format, unit: input.dataset.unit, labels });
  if (output) output.textContent = text;
  input.setAttribute('aria-valuetext', text);
}

/**
 * mountSim(root, {
 *   create(params, seed) -> model     builds a fresh model; must expose model.sim (a Simulation)
 *   render(model, root)               draws the model; called every frame while running and after any change
 *   update?(model, params) -> boolean applies changed params in place; return false to rebuild instead
 *   seed?                             default 1
 *   timeScale?                        model time units advanced per screen millisecond at 1× (default 1);
 *                                     e.g. 0.005 runs a microsecond model 200 times slower than real time
 *   formatClock?(now) -> text         the clock's text; by default seconds, or per the figure's timeUnit
 *   actions?: { [name]: (model, api) => void }   handlers for <ActionButton name="…"> in the controls bar
 * })
 * <ActionButton advance={ms}> buttons pause and advance the model by that much model time.
 * Returns { play(), pause(), reset(), advance(ms), get model(), get playing() }.
 */
export function mountSim(root, { create, render, update, seed = 1, timeScale = 1, formatClock, actions = {} }) {
  const playButton = root.querySelector('[data-play]');
  const resetButton = root.querySelector('[data-reset]');
  const advanceButton = root.querySelector('[data-advance]');
  const speedInput = root.querySelector('[data-speed]');
  const speedOutput = root.querySelector('[data-speed-output]');
  const clock = root.querySelector('[data-clock]');
  let params = readParams(root);
  let model = create(params, seed);
  let playing = false;
  let visible = false;
  let frame = 0;
  let last = 0;
  let speed = 1;

  const draw = () => {
    render(model, root);
    const seconds = model.sim.now / 1000;
    if (clock) clock.textContent = formatClock ? formatClock(model.sim.now) : root.dataset.timeUnit ? clockText(model.sim.now, root.dataset.timeUnit) : `${seconds < 100 ? seconds.toFixed(1) : Math.round(seconds)} s`;
    root.dataset.simTime = String(Math.round(model.sim.now));
  };
  const label = () => {
    if (!playButton) return;
    playButton.dataset.state = playing ? 'playing' : 'paused';
    playButton.querySelector('[data-play-label]').textContent = playing ? 'Pause' : 'Play';
    playButton.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${root.dataset.figureName ?? 'simulation'}`);
  };
  const tick = time => {
    frame = 0;
    if (!running()) return;
    // A long gap (a background tab, a slow frame) advances at most 100 ms, so nothing jumps.
    const elapsed = last ? Math.min(100, time - last) : 0;
    last = time;
    model.sim.advance(elapsed * speed * timeScale);
    draw();
    frame = requestAnimationFrame(tick);
  };
  const running = () => playing && visible && !document.hidden;
  const sync = () => {
    if (running() && !frame) { last = 0; frame = requestAnimationFrame(tick); }
    if (!running() && frame) { cancelAnimationFrame(frame); frame = 0; }
  };

  const api = {
    play() { playing = true; label(); sync(); },
    pause() { playing = false; label(); sync(); },
    reset() { model = create(params, seed); draw(); },
    advance(ms) { model.sim.advance(ms); draw(); },
    get model() { return model; },
    get playing() { return playing; },
  };

  playButton?.addEventListener('click', () => (playing ? api.pause() : api.play()));
  resetButton?.addEventListener('click', () => api.reset());
  advanceButton?.addEventListener('click', () => { api.pause(); api.advance(Number(advanceButton.dataset.advance) || 1000); });
  root.querySelectorAll('[data-cache-action]').forEach(button => button.addEventListener('click', () => {
    const by = Number(button.dataset.cacheAdvance);
    if (by > 0) { api.pause(); api.advance(by); return; }
    const handler = actions[button.dataset.cacheAction];
    if (handler) { handler(model, api); draw(); }
  }));
  const setSpeed = () => {
    if (!speedInput) return;
    speed = SPEEDS[Number(speedInput.value)] ?? 1;
    const text = `${speed}×`;
    if (speedOutput) speedOutput.textContent = text;
    speedInput.setAttribute('aria-valuetext', `${speed} times`);
  };
  speedInput?.addEventListener('input', setSpeed);
  setSpeed();
  root.querySelectorAll('[data-param]').forEach(input => {
    showParam(root, input);
    input.addEventListener('input', () => {
      showParam(root, input);
      params = readParams(root);
      if (!update || update(model, params) === false) model = create(params, seed);
      draw();
    });
  });

  if (typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); sync(); }, { rootMargin: '80px 0px' }).observe(root);
  } else visible = true;
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('astro:before-swap', () => api.pause(), { once: true });

  if (root.dataset.autoplay === 'true' && !reducedMotion()) playing = true;
  label();
  draw();
  sync();
  return api;
}
