// The scene is an illustration. Its clock describes choreography, not service latency.
export function mountScene(root, scene) {
  const drawing = root.querySelector('.delight-stage');
  const controls = root.querySelector('.delight-controls');
  const pause = root.querySelector('[data-pause]');
  const replay = root.querySelector('[data-replay]');
  const slider = root.querySelector('input[type="range"]:not([data-traffic])');
  const trafficSlider = root.querySelector('[data-traffic]');
  const trafficControl = root.querySelector('[data-traffic-control]');
  const trafficOutput = root.querySelector('[data-traffic-output]');
  let traffic = scene.traffic ? scene.traffic.create() : null;
  let trafficLevel = scene.traffic?.defaultLevel ?? 2, nextArrival = scene.traffic?.startAt ?? 0, requestIndex = 0;
  const output = root.querySelector('output');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let variant = root.dataset.variant, elapsed = 0, last = 0, frame = 0;
  const duration = () => scene.durationFor?.(variant) ?? scene.duration;
  let visible = false, paused = false, finished = false, observer;
  const paint = fraction => {
    drawing.innerHTML = scene.render(fraction, variant, motion.matches ? null : traffic);
    root.dataset.progress = String(fraction);
  };
  const labelPause = () => {
    pause.textContent = paused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-label', `${paused ? 'Resume' : 'Pause'} animation: ${scene.title}`);
  };
  const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
  const tick = now => {
    if (last) elapsed = Math.min(traffic ? Infinity : duration(), elapsed + Math.min(now - last, 100));
    last = now;
    if (traffic) {
      scene.traffic.advance(traffic, elapsed);
      if (elapsed >= nextArrival) {
        scene.traffic.arrive(traffic, elapsed, requestIndex++);
        nextArrival = elapsed + scene.traffic.intervals[trafficLevel - 1];
      }
    }
    paint(Math.min(1, elapsed / duration()));
    if (traffic || elapsed < duration()) frame = requestAnimationFrame(tick);
    else { stop(); finished = true; pause.hidden = true; }
  };
  const start = () => {
    if (!frame && visible && !document.hidden && !paused && !finished && !motion.matches) frame = requestAnimationFrame(tick);
  };
  const restart = () => {
    stop(); elapsed = 0; paused = false; finished = false;
    if (traffic) { traffic = scene.traffic.create(); nextArrival = scene.traffic.startAt; requestIndex = 0; }
    pause.hidden = motion.matches; labelPause();
    paint(motion.matches ? 1 : 0); start();
  };
  const preference = () => {
    stop();
    pause.hidden = motion.matches || finished;
    replay.hidden = motion.matches;
    if (trafficControl) trafficControl.hidden = motion.matches;
    paint(motion.matches || finished ? 1 : Math.min(1, elapsed / duration()));
    start();
  };
  const onPause = () => { paused = !paused; labelPause(); if (paused) stop(); else start(); };
  pause.addEventListener('click', onPause);
  const onReplay = () => {
    if (!slider) {
      variant = scene.defaultVariant ?? 'story'; root.dataset.variant = variant;
      drawing.setAttribute('aria-label', scene.altFor?.(variant) ?? scene.alt);
    }
    restart();
  };
  replay.addEventListener('click', onReplay);
  const actions = [...root.querySelectorAll('[data-variant-action]')];
  const actionHandlers = actions.map(button => {
    const handler = () => {
      variant = button.dataset.variantAction;
      root.dataset.variant = variant;
      drawing.setAttribute('aria-label', scene.altFor?.(variant) ?? scene.alt);
      restart();
    };
    button.addEventListener('click', handler);
    return handler;
  });
  const adjust = () => {
    stop(); variant = slider.value; root.dataset.variant = variant;
    output.textContent = `${variant} ${scene.range.unit}`;
    slider.setAttribute('aria-valuetext', output.textContent);
    drawing.setAttribute('aria-label', scene.altFor?.(variant) ?? scene.alt);
    elapsed = duration(); finished = true; pause.hidden = true; paint(1);
  };
  slider?.addEventListener('input', adjust);
  const adjustTraffic = () => {
    trafficLevel = Number(trafficSlider.value);
    const label = scene.traffic.labels[trafficLevel - 1];
    trafficOutput.textContent = label;
    trafficSlider.setAttribute('aria-valuetext', label);
    // Keep in-flight requests and the slow introduction intact.
    if (elapsed >= scene.traffic.startAt) nextArrival = elapsed + scene.traffic.intervals[trafficLevel - 1];
  };
  trafficSlider?.addEventListener('input', adjustTraffic);
  const observe = () => {
    observer?.disconnect();
    const threshold = Math.min(.85, Math.max(.1, (innerHeight - 48) / drawing.getBoundingClientRect().height * .85));
    observer = new IntersectionObserver(entries => {
      visible = entries[0].intersectionRatio >= threshold;
      if (visible) start(); else stop();
    }, { threshold: [0, threshold, 1] });
    observer.observe(drawing);
  };
  const visibility = () => document.hidden ? stop() : start();
  observe();
  window.addEventListener('resize', observe);
  document.addEventListener('visibilitychange', visibility);
  motion.addEventListener('change', preference);
  controls.hidden = false;
  preference();
  return () => {
    stop(); observer.disconnect();
    window.removeEventListener('resize', observe);
    document.removeEventListener('visibilitychange', visibility);
    motion.removeEventListener('change', preference);
    pause.removeEventListener('click', onPause);
    replay.removeEventListener('click', onReplay);
    slider?.removeEventListener('input', adjust);
    trafficSlider?.removeEventListener('input', adjustTraffic);
    actions.forEach((button, i) => button.removeEventListener('click', actionHandlers[i]));
  };
}
