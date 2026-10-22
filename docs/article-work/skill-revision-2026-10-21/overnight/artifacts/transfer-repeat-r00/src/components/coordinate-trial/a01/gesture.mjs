// Geometry and DOM access are injected, so the event policy can be checked separately.
export function createGesture({ read, update, capture, release, report = () => {} }) {
  let active = null;
  const matches = e => active && active.pointerId === e.pointerId;
  function clear(reason) {
    if (!active) return;
    const ended = active;
    active = null; // release can cause lostpointercapture: clear first.
    release(ended.pointerId);
    report(reason);
  }
  function finish(e) {
    if (!matches(e)) return;
    const valid = update(active, e);
    clear(valid ? 'Completed' : 'Completed; final mapping rejected');
  }
  return {
    get active() { return active; },
    down(e, mode) {
      if (active || e.button !== 0 || !(e.buttons & 1)) return;
      const anchor = read(mode, e);
      if (!anchor) { report('Start mapping rejected'); return; }
      active = { mode, pointerId: e.pointerId, anchor };
      try { capture(e.pointerId); }
      catch { clear('Capture failed'); }
    },
    move(e) {
      if (!matches(e)) return;
      if (!(e.buttons & 1)) { finish(e); return; }
      if (!update(active, e)) clear('Mapping rejected; kept last valid state');
    },
    up: finish,
    cancel(e) { if (matches(e)) clear('Cancelled; kept last valid state'); },
    lost(e) { if (matches(e)) clear('Capture lost; kept last valid state'); },
    stop() { clear('Reset'); },
  };
}
